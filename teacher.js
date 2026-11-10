// Professor tab: every student's checked proofs next to the true proofs.
// The Professor code is kept only for this browser tab (sessionStorage).
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const WORLD = { animals: "Animals", sports: "Sports", space: "Space", music: "Music", food: "Food", games: "Games" };

let data = null, filter = "all", showDemo = false, loaded = false;
const getPin = () => { try { return sessionStorage.getItem("m140-teacher") || ""; } catch { return ""; } };
const setPin = (p) => { try { p ? sessionStorage.setItem("m140-teacher", p) : sessionStorage.removeItem("m140-teacher"); } catch {} };

async function load() {
  loaded = true;
  $("teacher-banner").innerHTML = `<div class="teacher-banner">Loading the class log…</div>`;
  const res = await fetch(`/api/class${showDemo ? "?demo=1" : ""}`, { headers: { "x-teacher-pin": getPin() } }).catch(() => null);
  if (!res) return banner("warn", "Could not reach the class log. Check the connection and press Refresh.");
  if (res.status === 401) {
    setPin("");
    $("teacher-login").classList.remove("hidden");
    $("teacher-tools").classList.add("hidden");
    $("teacher-body").classList.add("hidden");
    return banner("", getPin() ? "" : "Type the Professor code to see the class.");
  }
  data = await res.json();
  $("teacher-login").classList.add("hidden");
  $("teacher-tools").classList.toggle("hidden", Boolean(data.setup));
  $("t-demo").textContent = showDemo ? "Show real class" : "Show demo";
  $("t-clear").classList.toggle("hidden", data.demo);
  if (data.setup) {
    banner("", `<b>Demo mode.</b> These students are made up. This site does not save student proofs yet:
      it needs a class log database and a Professor code before real proofs show up here.`);
  } else if (data.demo) {
    banner("", "<b>Demo students.</b> These are made up. Press Show real class to go back.");
  } else if (data.storage === "memory") {
    banner("warn", "Proofs are not saved yet. Connect a private Vercel Blob store to this project so the class log is kept.");
  } else banner("", "");
  $("teacher-body").classList.remove("hidden");
  render();
}

function banner(kind, html) { $("teacher-banner").innerHTML = html ? `<div class="teacher-banner ${kind}">${html}</div>` : ""; }

const ago = (ts) => {
  const m = Math.round((Date.now() - ts) / 60000);
  return m < 1 ? "just now" : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : new Date(ts).toLocaleDateString();
};

function helperLabel(a) {
  if (a.verdict === "busy") return "AI busy · word check only";
  if (a.verdict === "no_gap") return "AI: no missing reason";
  if (a.verdict === "need_draft") return "AI: needs a draft";
  return `AI hint${a.step ? ` on step ${a.step}` : ""}`;
}

function attemptHTML(a) {
  const key = data.key[a.path];
  const ok = Object.fromEntries((a.steps || []).map((s) => [s.n, s.ok]));
  const lines = a.text.split("\n").filter((l) => l.trim()).map((l, i) => {
    const n = Number((l.match(/^\s*(\d+)[.)]/) || [])[1]) || i + 1;
    return `<div class="t-line ${ok[n] === true ? "ok" : ok[n] === false ? "bad" : ""}">${esc(l)}</div>`;
  }).join("");
  const truth = key.steps.map((s, i) => `<div class="t-line ok">${i + 1}. ${esc(s.s)}<small>${esc(s.r)}${s.kid ? `<br>Kid words that count: ${esc(s.kid)}` : ""}</small></div>`).join("");
  return `
    <div class="t-attempt">
      <h4>Path ${a.path} · ${esc(key.title)} · Try ${a.round} · <span class="t-meta">${ago(a.ts)}</span></h4>
      <div class="t-chips">
        <span>${helperLabel(a)}</span>
        <span>${a.rubricPass ? "Rule words: all steps" : "Rule words: missing"}</span>
        <span>${a.rewarded ? "Movie unlocked" : "No movie yet"}</span>
        ${a.needsHelp ? "<span>Asked to show you</span>" : ""}
        ${a.guess ? `<span>First guess: ${esc(a.guess)}</span>` : ""}
      </div>
      ${a.hint ? `<p class="t-hint">Hint the student saw: “${esc(a.hint)}”</p>` : ""}
      <div class="t-cols">
        <div class="t-col"><h5>Student proof</h5>${lines}</div>
        <div class="t-col true"><h5>True proof · answer: ${esc(key.answer)}</h5>${truth}</div>
      </div>
    </div>`;
}

function render() {
  const all = data.attempts || [];
  // Group by nickname, newest first.
  const byNick = new Map();
  for (const a of all) {
    if (!byNick.has(a.nick)) byNick.set(a.nick, []);
    byNick.get(a.nick).push(a);
  }
  const students = [...byNick.entries()].map(([nick, list]) => {
    list.sort((a, b) => b.ts - a.ts);
    const latest = {};
    for (const a of list) if (!latest[a.path]) latest[a.path] = a;
    return { nick, list, latest, world: list[0].world };
  });
  const reached = students.filter((s) => s.list.some((a) => a.rewarded)).length;
  const help = students.filter((s) => Object.values(s.latest).some((a) => a.needsHelp)).length;
  const busy = all.filter((a) => a.verdict === "busy").length;
  $("teacher-stats").innerHTML = [
    [students.length, "students"], [all.length, "checks"], [reached, "reached the movie"], [help, "need help"],
    [all.length ? `${Math.round((busy / all.length) * 100)}%` : "0%", "AI was busy"],
  ].map(([b, s]) => `<div class="t-stat"><b>${b}</b><span>${s}</span></div>`).join("");

  const shown = students.filter((s) =>
    filter === "all" ? true : filter === "help" ? Object.values(s.latest).some((a) => a.needsHelp) : Boolean(s.latest[filter]));
  $("teacher-students").innerHTML = shown.length ? shown.map((s) => {
    const paths = Object.keys(s.latest).map(Number).sort().filter((p) => filter === "all" || filter === "help" || p === Number(filter));
    const badges = paths.map((p) => {
      const a = s.latest[p];
      const cls = a.rewarded ? "done" : a.needsHelp ? "help" : "work";
      return `<span class="t-badge ${cls}">Path ${p}: ${a.rewarded ? "movie" : a.needsHelp ? "needs help" : "working"}</span>`;
    }).join("");
    const body = paths.map((p) => {
      const tries = s.list.filter((a) => a.path === p);
      const older = tries.slice(1);
      return attemptHTML(tries[0]) + (older.length
        ? `<details class="t-older"><summary>Earlier tries on path ${p} (${older.length})</summary>${older.map(attemptHTML).join("")}</details>` : "");
    }).join("");
    return `<details class="t-student"><summary>${WORLD[s.world] ? `<span class="wmark" data-world="${s.world}" title="${WORLD[s.world]} world"></span>` : ""} ${esc(s.nick)} ${badges}<span class="t-meta">${s.list.length} ${s.list.length === 1 ? "check" : "checks"} · ${ago(s.list[0].ts)}</span></summary><div class="t-body">${body}</div></details>`;
  }).join("") : `<div class="t-empty">${all.length ? "No students match this filter." : "No checked proofs yet. When a student presses Evaluate Proof on a guided path, it shows up here."}</div>`;

  $("teacher-key").innerHTML = Object.entries(data.key).map(([p, k]) => `
    <details class="t-key"><summary>Path ${p} · ${esc(k.title)} <span class="t-meta">Answer: ${esc(k.answer)}</span></summary>
      <div class="t-body"><p class="t-hint">${esc(k.question)}</p>
        <div class="t-col true">${k.steps.map((s, i) => `<div class="t-line ok">${i + 1}. ${esc(s.s)}<small>${esc(s.r)}${s.kid ? `<br>Kid words that count: ${esc(s.kid)}` : ""}</small></div>`).join("")}</div>
      </div></details>`).join("");
}

$("teacher-login").addEventListener("submit", (e) => {
  e.preventDefault();
  setPin($("teacher-pin").value.trim());
  $("teacher-pin").value = "";
  load();
});
$("t-refresh").addEventListener("click", load);
$("t-demo").addEventListener("click", () => { showDemo = !showDemo; load(); });
$("t-lock").addEventListener("click", () => { setPin(""); showDemo = false; load(); });
$("t-clear").addEventListener("click", async () => {
  if (!confirm("Clear every saved proof in the class log? This cannot be undone.")) return;
  await fetch("/api/class", { method: "DELETE", headers: { "x-teacher-pin": getPin() } }).catch(() => null);
  load();
});
$("teacher-filters").addEventListener("click", (e) => {
  const b = e.target.closest("[data-f]");
  if (!b) return;
  filter = b.dataset.f;
  $("teacher-filters").querySelectorAll("[data-f]").forEach((x) => x.classList.toggle("active", x === b));
  render();
});
document.querySelector('.nav-btn[data-tab="teacher"]').addEventListener("click", () => { if (!loaded) load(); });
if (location.hash === "#teacher" || location.hash === "#professor") load();
