// Shared video pop-up: the 5 explainers, one for each part of the unit.
// Add <script src="(path)/assets/garden.js" data-root="(path)"></script> to a page.
// Any element with [data-open-videos] opens it. On the map page it opens by itself once.
(function () {
  const me = document.currentScript, root = me.dataset.root || "", autoOpen = me.dataset.auto === "1";
  const PARTS = [
    { n: 1, name: "Seed: Draw", say: "Draw a shape by hand with a compass. No AI here." },
    { n: 2, name: "Sprout: Write", say: "Write your own proof. Every step needs a reason." },
    { n: 3, name: "Water: One hint", say: "The AI points at one weak step. A little water helps. Too much drowns the plant." },
    { n: 4, name: "Bloom: Explain", say: "Explain your proof out loud. Your partner asks why. No AI here." },
    { n: 5, name: "Fruit: Quiz", say: "Show what you know. No computers. Only the Professor grades." },
  ];
  const wrap = document.createElement("div");
  wrap.className = "vmodal"; wrap.hidden = true;
  wrap.setAttribute("role", "dialog"); wrap.setAttribute("aria-modal", "true"); wrap.setAttribute("aria-labelledby", "vtitle");
  wrap.innerHTML = `<div class="vcard">
    <div class="vhead"><h2 id="vtitle">Watch the 5 parts</h2><span class="vsay">Each video is about 20 seconds. Click the video to pause it.</span></div>
    <div class="vtabs" role="tablist">${PARTS.map(p => `<button role="tab" type="button" data-n="${p.n}" aria-selected="false">${p.n} ${p.name}</button>`).join("")}</div>
    <iframe class="vframe" title="Explainer video" loading="lazy"></iframe>
    <p class="vsay" id="vsay"></p>
    <div class="vfoot">
      <label><input type="checkbox" id="vnomore"> Don't show this again</label>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="vbtn ghost" type="button" id="vprev">◀ Back</button>
        <button class="vbtn pink" type="button" id="vnext">Next ▶</button>
        <button class="vbtn" type="button" id="vclose">Close ✕</button>
      </div>
    </div></div>`;
  document.body.appendChild(wrap);
  const frame = wrap.querySelector("iframe"), say = wrap.querySelector("#vsay");
  let cur = 1, lastFocus = null;
  function show(n) {
    cur = Math.min(5, Math.max(1, n));
    frame.src = `${root}explainers/${cur}.html`;
    wrap.querySelectorAll("[role=tab]").forEach(b => b.setAttribute("aria-selected", String(+b.dataset.n === cur)));
    const p = PARTS[cur - 1]; say.textContent = `Part ${p.n}: ${p.say}`;
    wrap.querySelector("#vprev").disabled = cur === 1;
    wrap.querySelector("#vnext").textContent = cur === 5 ? "Done ✓" : "Next ▶";
  }
  function open(n) { lastFocus = document.activeElement; wrap.hidden = false; show(n || 1); wrap.querySelector("#vclose").focus(); }
  function close() {
    wrap.hidden = true; frame.src = "about:blank";
    try { if (wrap.querySelector("#vnomore").checked) localStorage.setItem("garden-videos-seen", "1"); } catch (e) {}
    try { sessionStorage.setItem("garden-videos-closed", "1"); } catch (e) {}
    if (lastFocus) lastFocus.focus();
  }
  wrap.querySelectorAll("[role=tab]").forEach(b => b.onclick = () => show(+b.dataset.n));
  wrap.querySelector("#vprev").onclick = () => show(cur - 1);
  wrap.querySelector("#vnext").onclick = () => cur === 5 ? close() : show(cur + 1);
  wrap.querySelector("#vclose").onclick = close;
  wrap.addEventListener("click", e => { if (e.target === wrap) close(); });
  addEventListener("keydown", e => { if (!wrap.hidden && e.key === "Escape") close(); });
  document.querySelectorAll("[data-open-videos]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); open(+b.dataset.openVideos || 1); }));
  window.openVideos = open;
  if (autoOpen) {
    let skip = false;
    try { skip = localStorage.getItem("garden-videos-seen") === "1" || sessionStorage.getItem("garden-videos-closed") === "1"; } catch (e) {}
    if (location.hash === "#full" || location.search.includes("print")) skip = true;
    if (!skip) open(1);
  }
})();
