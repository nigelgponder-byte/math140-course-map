// App shell: the sidebar menu on phones, the top bar title, and keeping the tool scrolled.
// app.js and teacher.js run the tool itself; this file only handles the layout around it.
const $ = (id) => document.getElementById(id);
const main = $("app-main");
const toolScroll = $("tool-scroll");
const openBtn = $("sidebar-open");

function setSidebar(open) {
  document.body.classList.toggle("sidebar-open", open);
  openBtn.setAttribute("aria-expanded", String(open));
}
openBtn.addEventListener("click", () => setSidebar(true));
document.querySelectorAll("[data-close-sidebar]").forEach((el) => el.addEventListener("click", () => setSidebar(false)));
addEventListener("keydown", (e) => { if (e.key === "Escape") setSidebar(false); });

// The top bar names the page that is open.
function showTitle() {
  const active = document.querySelector(".nav-btn.active span");
  $("topbar-title").textContent = active ? active.textContent : "Proof Check";
}

// Every page change: new title, back to the top, menu closed.
const switchTab = window.switchTab;
window.switchTab = function (tabName) {
  switchTab(tabName);
  showTitle();
  main.scrollTop = 0;
  setSidebar(false);
};
showTitle();

// A practice path in the sidebar opens inside the tool, whatever page is showing.
document.querySelectorAll(".app-sidebar .path-pill").forEach((pill) => pill.addEventListener("click", () => {
  if (!$("section-tutor").classList.contains("active")) window.switchTab("tutor");
  setSidebar(false);
}));

// New messages (and the hint typing out) keep the newest line in view.
new MutationObserver(() => { toolScroll.scrollTop = toolScroll.scrollHeight; })
  .observe($("conversation-stream"), { childList: true, subtree: true, characterData: true });
