// 🧑‍🏫 Class log for the Professor tab. This site has no database yet, so it runs in demo mode:
// GET returns made-up students (setup: true tells the page no Professor code is configured),
// POST accepts a student's check but keeps nothing, DELETE has nothing to clear.
import { KEY, DEMO_ATTEMPTS } from "./_class-data.js";

function demo() {
  const now = Date.now() - 60000;
  const attempts = DEMO_ATTEMPTS.map(({ offset, ...a }) => ({ ...a, ts: now - offset }));
  return { demo: true, setup: true, attempts, key: KEY, storage: "none" };
}

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "GET") return res.status(200).json(demo());
  if (req.method === "POST") return res.status(202).json({ saved: false, reason: "Demo mode: no class log is kept." });
  if (req.method === "DELETE") return res.status(200).json({ cleared: 0 });
  res.setHeader("Allow", "GET, POST, DELETE");
  return res.status(405).json({ error: "Use GET, POST or DELETE." });
}
