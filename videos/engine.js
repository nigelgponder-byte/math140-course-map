// Path video engine (copied from math140-course-map/explainers): every frame is drawn in code. draw(frame) is a pure function of the frame number.
// Style: dark canvas, smooth constructions, pink / blue / cyan accents (a 3Blue1Brown-style look).
const W = 1280, H = 720, FPS = 30;
const C = { bg:"#0B1B3B", ink:"#FAFAF8", dim:"#94A3B8", pink:"#FAFAF8", blue:"#3B82F6", cyan:"#7DB2FA", grid:"rgba(255,255,255,0.05)" };
const SERIF = 'italic 600 30px "Times New Roman", Times, serif';
const SANS = '"Avenir Next", "Helvetica Neue", Arial, sans-serif';

const cv = document.querySelector("canvas"), g = cv.getContext("2d");
cv.width = W; cv.height = H;

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };   // smooth in-out
const prog = (t, a, b) => ease((t - a) / (b - a));                                                       // 0..1 between a and b
const lerp = (a, b, k) => a + (b - a) * k;
const fade = (t, a, b, c, d) => Math.min(prog(t, a, b), d === undefined ? 1 : 1 - prog(t, c, d));       // fade in a..b, out c..d

function bg() {
  g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
  g.strokeStyle = C.grid; g.lineWidth = 1;
  for (let x = 0; x <= W; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
  for (let y = 0; y <= H; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
}
function line(x1, y1, x2, y2, k, col, w = 4) {
  if (k <= 0) return;
  g.strokeStyle = col; g.lineWidth = w; g.lineCap = "round";
  g.beginPath(); g.moveTo(x1, y1); g.lineTo(lerp(x1, x2, k), lerp(y1, y2, k)); g.stroke();
}
function arc(x, y, r, a0, a1, k, col, w = 3, dash) {
  if (k <= 0) return;
  g.strokeStyle = col; g.lineWidth = w; g.setLineDash(dash || []);
  g.beginPath(); g.arc(x, y, r, a0, a0 + (a1 - a0) * k); g.stroke(); g.setLineDash([]);
}
function dot(x, y, k, col, r = 9) {
  if (k <= 0) return;
  g.globalAlpha = clamp(k); g.fillStyle = col;
  g.beginPath(); g.arc(x, y, r * (0.6 + 0.4 * k), 0, Math.PI * 2); g.fill(); g.globalAlpha = 1;
}
function label(s, x, y, a, col = C.ink, font = SERIF, align = "center") {
  if (a <= 0) return;
  g.globalAlpha = clamp(a); g.fillStyle = col; g.font = font; g.textAlign = align; g.textBaseline = "middle";
  g.fillText(s, x, y); g.globalAlpha = 1;
}
function type(s, x, y, k, col, font, align = "left") { label(s.slice(0, Math.round(s.length * clamp(k))), x, y, k > 0 ? 1 : 0, col, font, align); }
function poly(pts, k, col, fill, w = 4) {
  if (k <= 0) return;
  g.globalAlpha = clamp(k);
  g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath();
  if (fill) { g.fillStyle = fill; g.fill(); }
  if (col) { g.strokeStyle = col; g.lineWidth = w; g.lineJoin = "round"; g.stroke(); }
  g.globalAlpha = 1;
}
function box(x, y, w, h, r, fill, stroke, a = 1, lw = 2) {
  if (a <= 0) return;
  g.globalAlpha = clamp(a); g.beginPath(); g.roundRect(x, y, w, h, r);
  if (fill) { g.fillStyle = fill; g.fill(); }
  if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); }
  g.globalAlpha = 1;
}
// Title in the top-left: part number, emoji, name.
function title(t, n, emoji, name) {
  const a = fade(t, 0, .8);
  label(`PATH ${n} OF 4`, 48, 46, a, C.dim, `600 16px ${SANS}`, "left");
  label(`${emoji}  ${name}`, 48, 82, a, C.ink, `700 34px ${SANS}`, "left");
}
// Caption: one short sentence at a time, in a pill at the bottom.
function captions(t, list) {
  for (const [a, b, s] of list) {
    const k = fade(t, a, a + .4, b - .4, b);
    if (k <= 0) continue;
    g.font = `600 30px ${SANS}`;
    const w = g.measureText(s).width + 56;
    box(W / 2 - w / 2, H - 104, w, 58, 29, "rgba(255,255,255,0.08)", "rgba(255,255,255,0.18)", k);
    label(s, W / 2, H - 75, k, C.ink, `600 30px ${SANS}`);
  }
}
function progress(f) {
  g.fillStyle = "rgba(255,255,255,0.08)"; g.fillRect(0, H - 6, W, 6);
  const grad = g.createLinearGradient(0, 0, W, 0); grad.addColorStop(0, C.pink); grad.addColorStop(.6, C.blue); grad.addColorStop(1, C.cyan);
  g.fillStyle = grad; g.fillRect(0, H - 6, W * f / (FRAMES - 1), 6);
}

const SCENE = window.SCENE, DUR = SCENE.dur, FRAMES = Math.round(DUR * FPS);
function draw(frame) {
  const t = frame / FPS;
  bg(); SCENE.draw(t); if (SCENE.title !== false) title(t, SCENE.n, SCENE.emoji, SCENE.name); captions(t, SCENE.captions); progress(frame);
}
window.draw = draw; window.FRAMES = FRAMES; window.FPS = FPS;
window.CUES = SCENE.captions.map(c => c[0]).filter(x => x > 0);

// Live preview: loops forever. The frame comes from the clock; draw() itself stays pure.
if (!location.search.includes("render")) {
  let start = performance.now(), paused = false, held = 0;
  const loop = now => { if (!paused) draw(Math.floor(((now - start) / 1000 * FPS)) % FRAMES); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
  cv.addEventListener("click", () => { paused = !paused; if (paused) held = performance.now(); else start += performance.now() - held; });
  addEventListener("message", e => { if (e.data === "restart") { start = performance.now(); paused = false; } });
} else draw(0);
