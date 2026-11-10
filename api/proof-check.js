// Proof Check: the only place AI is allowed (Stop 3).
// The model answers in fixed JSON (VERDICT_PROMPT). This code, not the model's wording,
// decides the verdict and writes the reply the student sees.
// Vercel AI Gateway authenticates deployed functions with a short-lived OIDC token,
// so this project does not need a long-lived model-provider key.
import { VERDICT_PROMPT, DISCLAIMER_TEXT } from "../course-data.js";
import { parseSteps } from "../reason-check.js";
import { KEY } from "./_class-data.js";

const MODELS = ["openai/gpt-oss-120b", "meta/llama-3.3-70b"];
const API_URL = "https://ai-gateway.vercel.sh/v1/chat/completions";
const MAX_CHARS = 4000;

// Vercel Functions receive OIDC at runtime in a request header. Build/local
// environments expose it as VERCEL_OIDC_TOKEN instead.
const apiKey = (req) => (process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN || req?.headers?.["x-vercel-oidc-token"] || "").trim().replace(/^["']|["']$/g, "");

async function ask(model, content, token) {
  const t0 = Date.now();
  const r = await fetch(API_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    signal: AbortSignal.timeout(20000),
    body: JSON.stringify({
      model,
      max_tokens: 700,
      temperature: 0,
      messages: [{ role: "system", content: VERDICT_PROMPT }, { role: "user", content }],
      providerOptions: { gateway: { disallowPromptTraining: true } },
    }),
  });
  const data = await r.json().catch(() => ({}));
  console.log("timing", model, r.status, `${Date.now() - t0}ms`, JSON.stringify(data.usage || {}));
  return { status: r.status, ok: r.ok && !data.error, text: (data.choices?.[0]?.message?.content || "").trim() };
}

// The model sometimes wraps its JSON in prose or a code fence: take the first {...} block.
function parseVerdict(text) {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try { return JSON.parse(m[0]); } catch { return null; }
}

// A guided path tells the model which steps are done and which reasons the Professor accepts.
function buildPrompt(text, path, locked) {
  const parts = [`STUDENT PROOF:\n${text}`];
  if (locked.length) parts.push(`ALREADY CHECKED: step ${locked.join(", step ")}. These are done.`);
  const key = KEY[path];
  if (key) {
    const notes = key.steps.map((s, i) => (/^given$/i.test(s.r) ? null : `step ${i + 1}: ${s.r}${s.kid ? ` A student might say ${s.kid}` : ""}`)).filter(Boolean);
    parts.push(`PROFESSOR NOTE (accepted reasons, never quote these):\n${notes.join("\n")}`);
  }
  return parts.join("\n\n");
}

const sentence = (s) => { const t = String(s || "").trim(); return t ? t[0].toUpperCase() + t.slice(1) + (/[.!?]$/.test(t) ? "" : ".") : ""; };

function result(verdict, extra = {}) {
  const { step = null, hint = "", question = "", model = null, mode = "ai" } = extra;
  let reply;
  if (verdict === "gap") {
    reply = [`Look at step ${step}. ${sentence(hint)}`.trim(), question.trim() || "What rule can justify this step?"].join("\n\n");
  } else if (verdict === "no_gap") {
    reply = "I can't find a missing reason. That does not mean it is correct. Your Professor still checks it.";
  } else if (verdict === "need_draft") {
    reply = "I can only look at a proof you already wrote. Write at least 2 steps. Give each step a reason.\n\nWhat is your first step?";
  } else {
    reply = "The AI helper is busy right now, so it could not read your proof. Try again in a minute.";
  }
  return { verdict, step, hint, question, model, reply: `${reply}\n\n${DISCLAIMER_TEXT}`, mode };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Use POST." });
  }

  const history = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const lastUser = [...history].reverse().find((m) => m?.role === "user" && typeof m.content === "string" && m.content.trim());
  if (!lastUser) return res.status(400).json({ error: "Send a message to start." });
  const text = lastUser.content.slice(0, MAX_CHARS);
  const path = Number(req.body?.path) || null;
  const locked = (Array.isArray(req.body?.locked) ? req.body.locked : []).map(Number).filter((n) => Number.isInteger(n) && n > 0);

  const token = apiKey(req);
  if (!token) {
    return res.status(200).json({ ...result("busy", { mode: "busy" }), error: "The chat isn't set up yet: the site owner needs to connect the AI gateway." });
  }

  const steps = parseSteps(text);
  const prompt = buildPrompt(text, path, locked);
  try {
    for (const model of MODELS) {
      const out = await ask(model, prompt, token);
      const v = out.ok && parseVerdict(out.text);
      if (!v) { console.error("AI Gateway model failed", model, out.status, out.text.slice(0, 300)); continue; }
      if (v.draft === false) return res.status(200).json(result("need_draft", { model }));
      const step = Number(v.step);
      const target = steps.find((s) => s.n === step);
      // The code checks the model's pick: never a Given step, a step already checked, or a step that isn't there.
      if (v.gap && target && !target.given && !locked.includes(step)) {
        return res.status(200).json(result("gap", { step, hint: String(v.hint || ""), question: String(v.question || ""), model }));
      }
      return res.status(200).json(result("no_gap", { model }));
    }
  } catch (err) {
    console.error(err);
  }
  return res.status(200).json({ ...result("busy", { mode: "busy" }), error: "The AI helper is busy or at its limit right now. Try again in a few minutes." });
}
