import { COURSE_INFO, WEEKS, EIGHT_KEYS, DISCLAIMER_TEXT, generateMilestones } from "./course-data.js";
import { checkReasons } from "./reason-check.js";

// State
let currentTab = "tutor";
let activeFilter = "all";
let termStartDate = "2026-09-28";
let conversationHistory = [];
let isGenerating = false;

// DOM Elements
const navButtons = document.querySelectorAll(".nav-btn");
const tabPanes = document.querySelectorAll(".tab-pane");
const conversationStream = document.getElementById("conversation-stream");
const formChat = document.getElementById("form-chat");
const inputProof = document.getElementById("input-proof");
const btnSubmitProof = document.getElementById("btn-submit-proof");
const charCounter = document.getElementById("char-counter");
const btnClearChat = document.getElementById("btn-clear-chat");
const escalationBanner = document.getElementById("escalation-banner");
const calendarTimeline = document.getElementById("calendar-timeline");
const inputTermStart = document.getElementById("input-term-start");
const btnDownloadIcs = document.getElementById("btn-download-ics");
const filterChips = document.querySelectorAll(".filter-chip");
const syllabusCards = document.getElementById("syllabus-cards");

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  initURLState();
  setupEventListeners();
  renderCalendar();
  renderSyllabus();
});

function initURLState() {
  const url = new URL(window.location.href);
  if (url.searchParams.get("embed") === "true") {
    document.body.classList.add("embed-mode");
  }

  let hash = window.location.hash.replace("#", "");
  if (hash === "professor") hash = "teacher"; // old #teacher links still work too
  if (["tutor", "calendar", "syllabus", "keys", "embed", "coursemap", "teacher"].includes(hash)) {
    switchTab(hash);
  }
}

function setupEventListeners() {
  // Navigation
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });

  // Chat input typing & character count
  inputProof.addEventListener("input", () => {
    const len = inputProof.value.length;
    charCounter.textContent = `${len} / 4000`;
  });

  inputProof.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formChat.dispatchEvent(new Event("submit"));
    }
  });

  // Chat submit
  formChat.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = inputProof.value.trim();
    if (!text || isGenerating) return;
    if (text.includes("____")) {
      showBlankWarning();
      return;
    }

    appendMessage("user", text);
    inputProof.value = "";
    charCounter.textContent = "0 / 4000";

    if (pathId) await checkPathProof(text);
    else await executeProofCheck(text);
  });

  // Clear chat
  btnClearChat.addEventListener("click", () => {
    conversationHistory = [];
    conversationStream.innerHTML = `
      <div class="system-notice">
        <div>
          <strong>Step 3 Guardrail Active:</strong> Proof drafts require at least 2 steps with statements and reasons. Replies are strictly capped under 120 words and terminate with an instructor disclaimer.
        </div>
      </div>
    `;
    closeEscalation();
  });

  // Sample prompts open a guided path
  document.querySelectorAll(".path-pill").forEach((pill) => {
    pill.addEventListener("click", () => openPath(Number(pill.dataset.path)));
  });
  document.getElementById("path-close").addEventListener("click", closePath);
  document.getElementById("path-vid-toggle").addEventListener("click", toggleVideo);

  // Onboarding: pick a world for the reward video
  document.getElementById("world-chip").addEventListener("click", () => openOnboard());
  document.getElementById("onboard-skip").addEventListener("click", closeOnboard);
  document.querySelectorAll(".world-tile").forEach((tile) => {
    tile.addEventListener("click", () => {
      setWorld(tile.dataset.world);
      closeOnboard();
      if (afterOnboard) { const go = afterOnboard; afterOnboard = null; go(); }
    });
  });
  showWorld();
  if (!getWorld() && !document.body.classList.contains("embed-mode")) openOnboard();

  // Date picker change
  inputTermStart.addEventListener("change", (e) => {
    termStartDate = e.target.value || "2026-09-28";
    renderCalendar();
  });

  // Filter chips for calendar
  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      filterChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      activeFilter = chip.dataset.filter;
      renderCalendar();
    });
  });

  // Download ICS
  btnDownloadIcs.addEventListener("click", () => {
    const url = `/api/calendar?format=ics&startDate=${encodeURIComponent(termStartDate)}`;
    window.location.href = url;
  });

  // Course Map iframe reload
  const btnRefreshMap = document.getElementById("btn-refresh-coursemap");
  if (btnRefreshMap) {
    btnRefreshMap.addEventListener("click", () => {
      const iframe = document.getElementById("iframe-coursemap");
      if (iframe) iframe.src = iframe.src;
    });
  }
}

// Tab switcher
window.switchTab = function (tabName) {
  currentTab = tabName;
  // The Professor tab is "teacher" inside the code; its address is #professor.
  window.location.hash = tabName === "teacher" ? "professor" : tabName;

  navButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });

  tabPanes.forEach((pane) => {
    pane.classList.toggle("active", pane.id === `section-${tabName}`);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Append message bubble
function appendMessage(role, content) {
  const turnEl = document.createElement("div");
  turnEl.className = `msg-turn ${role}`;

  const senderEl = document.createElement("span");
  senderEl.className = "sender";
  senderEl.textContent = role === "user" ? "You" : "Hint";

  const contentEl = document.createElement("div");
  contentEl.className = "msg-content";
  contentEl.textContent = content;

  turnEl.appendChild(senderEl);
  turnEl.appendChild(contentEl);

  if (role === "assistant") {
    const actionsEl = document.createElement("div");
    actionsEl.className = "msg-actions";
    actionsEl.innerHTML = `
      <button class="btn btn-feedback" data-variant="ghost" data-size="sm" onclick="handleFeedback('makes-sense')">Makes sense</button>
      <button class="btn btn-feedback" data-variant="ghost" data-size="sm" onclick="handleFeedback('not-sure')">Not sure (Send to Prof. Bahls)</button>
      <button class="btn btn-feedback" data-variant="ghost" data-size="sm" onclick="handleFeedback('disagree')">I disagree (Escalate)</button>
    `;
    turnEl.appendChild(actionsEl);
  }

  conversationStream.appendChild(turnEl);
  conversationStream.scrollTop = conversationStream.scrollHeight;
  return contentEl;
}

// Call Proof-Check API with typewriter streaming effect
// For a guided path, only the newest draft is sent, with the steps that already passed.
// That way the helper cannot move the goalposts back to an old step.
async function executeProofCheck(userPrompt, path = null, locked = []) {
  isGenerating = true;
  btnSubmitProof.disabled = true;
  let data = null;

  conversationHistory.push({ role: "user", content: userPrompt });

  // Placeholder bubble for streaming response
  const assistantBubble = appendMessage("assistant", "Reflecting on proof logic...");

  try {
    const res = await fetch("/api/proof-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(path ? { messages: [{ role: "user", content: userPrompt }], path, locked } : { messages: conversationHistory })
    });

    data = await res.json();
    const replyText = data.reply || "Could not analyze draft. Please try again.";

    // Typewriter effect
    assistantBubble.textContent = "";
    let i = 0;
    const speed = 14;

    await new Promise((resolve) => {
      function type() {
        if (i < replyText.length) {
          assistantBubble.textContent += replyText.charAt(i);
          i++;
          conversationStream.scrollTop = conversationStream.scrollHeight;
          setTimeout(type, speed);
        } else {
          resolve();
        }
      }
      type();
    });

    conversationHistory.push({ role: "assistant", content: replyText });
  } catch (err) {
    assistantBubble.textContent =
      "Network error reaching Socratic tutor service. Please check your connection.\n\n" + DISCLAIMER_TEXT;
  } finally {
    isGenerating = false;
    btnSubmitProof.disabled = false;
  }
  return data;
}

// ---------- Guided paths: 1 Watch → 2 Answer → 3 Write ----------
// Each path starts with a question a 10-year-old can answer. The student still
// writes the proof reasons; the tutor only gives a hint on what they wrote.
const PATHS = {
  1: {
    question: "A box and 3 apples weigh the same as 7 apples. How many apples are in the box?",
    choices: [
      { text: "4 apples", right: true },
      { text: "10 apples", v: "10" },
      { text: "3 apples", v: "3" },
    ],
    yes: "Yes! Take 3 apples off both sides. The box is 4 apples. You just solved x + 3 = 7.",
    no: "Look again at the video. Take the same apples off BOTH sides.",
    draft:
      "1. x + 3 = 7 (Given)\n2. x + 3 − 3 = 7 − 3 (because ____)\n3. x = 4 (because ____)",
  },
  2: {
    question: "You walk 3 steps right. Then you walk 4 steps up. How many steps is the straight shortcut back?",
    choices: [
      { text: "5 steps", right: true },
      { text: "7 steps", v: "7" },
      { text: "1 step", v: "1" },
    ],
    yes: "Yes! 3 × 3 + 4 × 4 = 25, and 5 × 5 = 25. The shortcut is 5 steps.",
    no: "Look again at the squares in the video: 9 + 16 = 25.",
    draft:
      "1. The walk goes 3 right and 4 up (Given)\n2. 3 × 3 + 4 × 4 = shortcut × shortcut (because ____)\n3. 9 + 16 = 25, so the shortcut is 5 (because ____)",
  },
  3: {
    question: "A plant is 2 cm tall. It grows 3 cm every week. How tall is it after 4 weeks?",
    choices: [
      { text: "14 cm", right: true },
      { text: "12 cm", v: "12" },
      { text: "9 cm", v: "9" },
    ],
    yes: "Yes! 3 × 4 + 2 = 14. It grows the same 3 cm each week, so the tops make a straight line.",
    no: "Look again at the video. Start at 2. Then add 3 four times.",
    draft:
      "1. The plant starts at 2 cm and grows 3 cm each week (Given)\n2. height = 3 × weeks + 2 (because ____)\n3. height = 3 × 4 + 2 = 14 cm (because ____)",
  },
  4: {
    question: "You throw a ball up. It goes up, then it comes down. What shape does its path make?",
    choices: [
      { text: "An arch", right: true },
      { text: "A straight line", v: "line" },
      { text: "A square", v: "square" },
    ],
    yes: "Yes! It is an arch. Math calls it a parabola. It is the same on both sides.",
    no: "Look again at the video. Watch the ball go up and come back down.",
    draft:
      "1. height = 9 − x × x (Given)\n2. At x = 3, height = 9 − 3 × 3 = 0 (because ____)\n3. At x = −3, height = 0 too (because ____)",
  },
};
// Show answer choices in a new order each time, so the right one is not always first.
function shuffled(list) {
  const a = list.map((c, i) => ({ ...c, i }));
  for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [a[k], a[j]] = [a[j], a[k]]; }
  return a;
}
let pathId = null;
const pathPanel = document.getElementById("path-panel");
const pathBody = document.getElementById("path-body");

function setPathStep(step) {
  pathPanel.querySelectorAll(".path-steps li").forEach((li) => {
    const n = Number(li.dataset.step);
    li.classList.toggle("active", n === step);
    li.classList.toggle("done", n < step);
  });
  // After the first watch, the Video button lets the student open and close the video.
  document.getElementById("path-vid-toggle").classList.toggle("hidden", step < 2);
  if (step < 2) setVideoOpen(false);
}

// ---------- Video button: open and close the video during Answer and Write ----------
const vidDrawer = document.getElementById("path-vid-drawer");
const vidToggle = document.getElementById("path-vid-toggle");
function setVideoOpen(open) {
  vidDrawer.classList.toggle("hidden", !open);
  vidToggle.setAttribute("aria-expanded", String(open));
  vidToggle.classList.toggle("on", open);
  vidToggle.title = open ? "Hide the video" : "Show the video";
  const frame = vidDrawer.querySelector("iframe");
  if (open && pathId) frame.src = `/videos/${pathId}.html`;
  if (!open) frame.removeAttribute("src");
}
function toggleVideo() { setVideoOpen(vidDrawer.classList.contains("hidden")); }

// ---------- Worlds (onboarding) ----------
const WORLDS = { animals: "Animals", sports: "Sports", space: "Space", music: "Music", food: "Food", games: "Games" };
let afterOnboard = null;
function getNick() { try { return localStorage.getItem("m140-nick") || ""; } catch (e) { return ""; } }
function saveNick() {
  const v = document.getElementById("onboard-nick").value.replace(/[<>]/g, "").trim().slice(0, 24);
  try { if (v) localStorage.setItem("m140-nick", v); } catch (e) {}
}
function getWorld() { try { return localStorage.getItem("m140-world") || ""; } catch (e) { return ""; } }
function setWorld(w) { try { localStorage.setItem("m140-world", w); } catch (e) {} showWorld(); }
function showWorld() {
  const w = getWorld();
  document.getElementById("world-name").textContent = w ? WORLDS[w] : "Pick your world";
  document.getElementById("world-mark").dataset.world = w; // its line icon (styles.css)
}
function openOnboard(then) {
  afterOnboard = then || null;
  document.getElementById("onboard-nick").value = getNick();
  document.getElementById("onboard").classList.remove("hidden");
}
function closeOnboard() { saveNick(); document.getElementById("onboard").classList.add("hidden"); }

// ---------- Finish line: Write → Check → hint, or no missing reason → video ----------
// 2 checks must agree before the reward opens: the page's rule-word check AND the AI's "no gap".
// If the AI is busy, the page says so, and the word check works alone (clearly labeled).
const MAX_ROUNDS = 3;
let attempt = null;
function newAttempt() { return { round: 0, locked: {}, guess: "", guessV: "", rewarded: false }; }

async function checkPathProof(text) {
  const id = pathId;
  attempt.round++;
  const check = checkReasons(id, text);
  // A step stays checked only while its words stay the same.
  for (const [n, line] of Object.entries(attempt.locked)) {
    if (check.steps.find((s) => s.n === Number(n))?.line !== line) delete attempt.locked[n];
  }
  const locked = Object.keys(attempt.locked).map(Number);
  const data = (await executeProofCheck(text, id, locked)) || { verdict: "busy" };
  if (pathId !== id) return;

  const v = data.verdict;
  const flagged = v === "gap" ? data.step : null;
  const status = {};
  for (const s of check.steps) {
    if (s.given || attempt.locked[s.n]) status[s.n] = "ok";
    else if (flagged && s.n === flagged) status[s.n] = "hint";
    else if (flagged && s.n > flagged) status[s.n] = "todo";
    else if (v === "need_draft") status[s.n] = "todo";
    else status[s.n] = s.ok ? "ok" : "hint";
  }
  // Steps the AI looked at and the word check passed stay checked from now on.
  for (const s of check.steps) if (status[s.n] === "ok" && (v !== "gap" || flagged)) attempt.locked[s.n] = s.line;

  const allOk = check.steps.every((s) => status[s.n] === "ok");
  const agree = check.pass && allOk && (v === "no_gap" || v === "busy");
  const capped = !agree && attempt.round >= MAX_ROUNDS;
  renderProgress(check.steps, status);
  showGate({ agree, capped, busy: v === "busy", check, status, data });
  logCheck(id, text, check, status, data, agree || (capped && check.pass), capped);
}

function renderProgress(steps, status) {
  const el = document.getElementById("path-progress");
  const icon = { ok: "✅", hint: "💧", todo: "⬜" };
  el.innerHTML = `<span class="pp-label">Try ${Math.min(attempt.round, MAX_ROUNDS)} of ${MAX_ROUNDS}</span>` +
    steps.map((s) => `<span class="pp-step ${status[s.n]}">Step ${s.n} ${icon[status[s.n]]}</span>`).join('<span class="pp-dot">·</span>');
  el.classList.remove("hidden");
}

function showGate({ agree, capped, busy, check, status, data }) {
  lastCheck = check;
  const box = document.getElementById("path-reward");
  const weak = check.steps.find((s) => status[s.n] === "hint");
  if (agree) {
    const head = busy
      ? "<b>Every reason has a rule word!</b> The AI helper was busy, so only the word check ran this time."
      : "<b>2 checks agree!</b> The AI found no missing reason, and every reason has a rule word.";
    rewardCard(head, "Your Professor still checks it.");
    return;
  }
  if (capped) {
    box.innerHTML = `
      <div class="teacher-card">
        <div class="reward-head"><b>Show your Professor.</b> You tried ${MAX_ROUNDS} times. That is real work!</div>
        <p class="path-tip">Your Professor can see this proof. They will help with ${weak ? `step ${weak.n}` : "the last step"}.</p>
        ${check.pass ? `<div class="path-actions"><button type="button" class="btn" id="reward-anyway">Open my video anyway</button></div>` : ""}
        <div id="reward-stage"></div>
      </div>`;
    document.getElementById("reward-anyway")?.addEventListener("click", () => rewardCard("<b>Every reason has a rule word.</b> Your Professor checks the last step.", "Your Professor still checks it.", true));
    return;
  }
  const left = MAX_ROUNDS - attempt.round;
  // The 2 checks can disagree: the AI found no gap, but the word check did not find a rule word.
  const msg = !weak ? "Write each step with a reason."
    : data.verdict === "no_gap" ? `The AI found no missing reason, but <b>step ${weak.n}</b> needs a rule word, not a picture.`
    : `Fix <b>step ${weak.n}</b>. Use a math rule, not a picture.`;
  box.innerHTML = `<div class="reward-nudge"><b>Almost!</b> ${msg} Then press <b>Evaluate Proof</b> again. ${left} ${left === 1 ? "try" : "tries"} left before we show your Professor.</div>`;
}

// Save the check for the Professor tab (nickname only).
function logCheck(id, text, check, status, data, rewardable, needsHelp) {
  const body = {
    nick: getNick() || "Guest", world: getWorld(), path: id, text, guess: attempt.guess, round: attempt.round,
    verdict: data.verdict, mode: data.mode, step: data.step, hint: data.hint, rubricPass: check.pass,
    rewarded: rewardable, needsHelp, steps: check.steps.map((s) => ({ n: s.n, ok: status[s.n] === "ok" })),
  };
  fetch("/api/class", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).catch(() => {});
}

// ---------- Reward video ----------
let lastCheck = null;
function rewardCard(head, note, open = false) {
  const w = getWorld();
  const box = document.getElementById("path-reward");
  box.innerHTML = `
    <div class="reward-card">
      <div class="reward-head">${head}</div>
      <div class="path-actions">
        <button type="button" class="btn" id="reward-go">Make my ${w ? WORLDS[w] : ""} movie</button>
        <button type="button" class="btn" data-variant="outline" data-size="sm" id="reward-world">Change world</button>
      </div>
      <p class="path-tip">The checks only look for rule words and missing reasons. It is practice. <b>${note}</b></p>
      <div id="reward-stage"></div>
    </div>`;
  document.getElementById("reward-go").addEventListener("click", generateReward);
  document.getElementById("reward-world").addEventListener("click", () => openOnboard(() => rewardCard(head, note)));
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
  if (open) generateReward();
}
function generateReward() {
  if (!getWorld()) { openOnboard(generateReward); return; }
  attempt.rewarded = true;
  const stage = document.getElementById("reward-stage");
  const words = ["Lights…", "Camera…", "Action!"];
  let i = 0;
  stage.innerHTML = `<div class="reward-growing" id="reward-growing">${words[0]}</div>`;
  const tick = setInterval(() => {
    i++;
    const el = document.getElementById("reward-growing");
    if (!el) { clearInterval(tick); return; }
    if (i < words.length) { el.textContent = words[i]; return; }
    clearInterval(tick);
    const seed = Math.floor(Math.random() * 1e9);
    const [r1 = "", r2 = ""] = lastCheck.reasons;
    const hash = new URLSearchParams({ p: pathId, t: getWorld(), s: seed, r1, r2, g: attempt.guessV }).toString();
    stage.innerHTML = `
      <iframe class="path-video" src="/videos/reward.html#${hash}" title="Your reward movie" allow="autoplay"></iframe>
      <div class="path-actions">
        <span class="path-tip">A new movie every time. Sound on. Click it to pause.</span>
        <button type="button" class="btn" data-variant="secondary" id="reward-again">Make a new one</button>
      </div>`;
    document.getElementById("reward-again").addEventListener("click", generateReward);
  }, 650);
}

function openPath(id) {
  pathId = id;
  attempt = newAttempt();
  document.getElementById("path-reward").innerHTML = "";
  document.getElementById("path-progress").classList.add("hidden");
  document.querySelectorAll(".path-pill").forEach((p) => p.classList.toggle("active", Number(p.dataset.path) === id));
  pathPanel.classList.remove("hidden");
  showWatch();
  pathPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function closePath() {
  setVideoOpen(false);
  pathId = null;
  pathPanel.classList.add("hidden");
  pathBody.innerHTML = "";
  document.getElementById("path-reward").innerHTML = "";
  document.getElementById("path-progress").classList.add("hidden");
  document.querySelectorAll(".path-pill").forEach((p) => p.classList.remove("active"));
}

function showWatch() {
  setPathStep(1);
  pathBody.innerHTML = `
    <p class="path-q">${PATHS[pathId].question}</p>
    <iframe class="path-video" src="/videos/${pathId}.html" title="Path ${pathId} video" loading="lazy"></iframe>
    <p class="path-tip">Watch the 20-second video. Click the video to pause it.</p>
    <div class="path-actions"><button type="button" class="btn" id="path-next">I watched it → Answer</button></div>`;
  document.getElementById("path-next").addEventListener("click", showAnswer);
}

function showAnswer() {
  setPathStep(2);
  const p = PATHS[pathId];
  pathBody.innerHTML = `
    <p class="path-q">${p.question}</p>
    <div class="path-choices">${shuffled(p.choices).map((c) => `<button type="button" class="path-choice" data-i="${c.i}">${c.text}</button>`).join("")}</div>
    <p class="path-feedback" id="path-feedback"></p>
    <div class="path-actions">
      <button type="button" class="btn" data-variant="outline" data-size="sm" id="path-back">← Watch again</button>
      <button type="button" class="btn hidden" id="path-write">Next → Write it</button>
    </div>`;
  document.getElementById("path-back").addEventListener("click", showWatch);
  document.getElementById("path-write").addEventListener("click", showWrite);
  pathBody.querySelectorAll(".path-choice").forEach((btn) => {
    btn.addEventListener("click", () => {
      const choice = p.choices[Number(btn.dataset.i)], right = choice.right;
      // The first wrong guess becomes the plot twist in the reward movie.
      if (!right && !attempt.guess) { attempt.guess = choice.text; attempt.guessV = choice.v || ""; }
      pathBody.querySelectorAll(".path-choice").forEach((b) => b.classList.remove("right", "wrong"));
      btn.classList.add(right ? "right" : "wrong");
      const fb = document.getElementById("path-feedback");
      fb.textContent = right ? p.yes : p.no;
      fb.className = `path-feedback ${right ? "is-right" : "is-wrong"}`;
      document.getElementById("path-write").classList.toggle("hidden", !right);
    });
  });
}

function showWrite() {
  setPathStep(3);
  const p = PATHS[pathId];
  inputProof.value = p.draft;
  inputProof.dispatchEvent(new Event("input"));
  pathBody.innerHTML = p.send
    ? `<p class="path-q">The question is in the box below. Press <b>Evaluate Proof</b>. Watch the helper say no.</p>`
    : `<p class="path-q">Your starter proof is in the box below.</p>
       <ol class="path-howto">
         <li>Find each <b>____</b>.</li>
         <li>Write a <b>reason</b> in your own words. A reason is a rule, not a picture.</li>
         <li>Press <b>Evaluate Proof</b>. The helper points at <b>1 weak step</b>, or finds none.</li>
         <li>When <b>every step is ✅</b>, your movie unlocks.</li>
       </ol>
       <p class="path-tip">Your Professor can see the proofs you check here, with your nickname.</p>`;
  inputProof.focus();
  if (!p.send) {
    const at = inputProof.value.indexOf("____");
    if (at >= 0) inputProof.setSelectionRange(at, at + 4);
  }
}

function showBlankWarning() {
  let warn = document.getElementById("blank-warn");
  if (!warn) {
    warn = document.createElement("p");
    warn.id = "blank-warn";
    warn.className = "path-feedback is-wrong";
    formChat.parentNode.insertBefore(warn, formChat);
  }
  warn.textContent = "Fill in each ____ first. Use your own words.";
  const at = inputProof.value.indexOf("____");
  inputProof.focus();
  if (at >= 0) inputProof.setSelectionRange(at, at + 4);
  setTimeout(() => warn.remove(), 4000);
}

// Escalation feedback handler
window.handleFeedback = function (type) {
  if (type === "not-sure" || type === "disagree") {
    escalationBanner.classList.remove("hidden");
    escalationBanner.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } else {
    alert("Noted! Keep testing your proof against your theorem list before the board defense.");
  }
};

window.closeEscalation = function () {
  escalationBanner.classList.add("hidden");
};

// Render Calendar
function renderCalendar() {
  const milestones = generateMilestones(termStartDate);

  calendarTimeline.innerHTML = "";

  milestones.forEach((m) => {
    // Filter check
    let filteredDeliverables = m.deliverables;
    if (activeFilter !== "all") {
      filteredDeliverables = m.deliverables.filter((d) => d.type === activeFilter);
      if (filteredDeliverables.length === 0) return;
    }

    const card = document.createElement("div");
    card.className = "timeline-card";

    const delivPills = filteredDeliverables
      .map(
        (d) =>
          `<span class="badge deliv-pill ${d.type}" data-variant="secondary">
            <strong>${d.type.toUpperCase()}:</strong> ${d.name} (${d.weight}) · Due ${d.date}
          </span>`
      )
      .join("");

    card.innerHTML = `
      <div class="tl-dates">
        <span class="badge tl-week-badge" data-variant="outline">Week ${m.week}</span>
        <span class="tl-date-range">${m.startDate} → ${m.endDate}</span>
      </div>
      <div class="tl-details">
        <h3>${m.title}</h3>
        <p>${m.topics}</p>
        <div class="tl-deliverables">
          ${delivPills || '<span class="badge deliv-pill" data-variant="secondary">Class Workshop & Hand Constructions</span>'}
        </div>
      </div>
      <div class="tl-stop">
        <span class="badge tl-stop-badge" data-variant="secondary">${m.stop}</span>
      </div>
    `;

    calendarTimeline.appendChild(card);
  });
}

// Render Syllabus
function renderSyllabus() {
  syllabusCards.innerHTML = "";

  WEEKS.forEach((w) => {
    const card = document.createElement("div");
    card.className = "syllabus-card";

    const acts = w.activities.map((a) => `<li>${a}</li>`).join("");
    const dels = w.deliverables
      .map((d) => `<span class="badge deliv-pill ${d.type}" data-variant="secondary">${d.name} [${d.weight}]</span>`)
      .join(" ");

    card.innerHTML = `
      <div class="card-top">
        <span class="badge week-badge" data-variant="outline">WEEK ${w.week}</span>
        <span class="badge tl-stop-badge" data-variant="secondary">${w.stop}</span>
      </div>
      <h3>${w.title}</h3>
      <p class="syllabus-topics">${w.topics}</p>
      <div class="syllabus-activities">
        <div class="activities-title">In-Class Exploration:</div>
        <ul style="padding-left: 18px; margin: 0 0 10px 0;">${acts}</ul>
        <div class="activities-title">Deliverables & Due Dates:</div>
        <div>${dels}</div>
      </div>
    `;

    syllabusCards.appendChild(card);
  });
}

// Copy clipboard utility
window.copyText = function (text) {
  navigator.clipboard.writeText(text);
  alert(`Copied to clipboard:\n${text}`);
};

window.copyIframe = function () {
  const snippet = `<iframe src="https://team-math140-study-tool.vercel.app?embed=true" width="100%" height="720" style="border:1px solid #e5e5e5; border-radius:12px; box-shadow:0 8px 30px rgba(0,0,0,0.06);" allow="clipboard-write"></iframe>`;
  navigator.clipboard.writeText(snippet);
  alert("Embed code copied to clipboard!");
};
