// ✅ Reason check (practice only, no AI). Shared by the page and the server.
// It looks for real rule words in each "because ____" reason. It never says "correct":
// only the Professor decides that.

// One list per path. Item i checks the reason in the i-th "because" step.
export const RUBRIC = {
  1: [/both sides|each side|same (thing|amount|number)|balanc|level|equal|subtract|take .{0,15}(off|away|from)|minus|remov/i,
      /simplif|3 ?[-−] ?3|3 minus 3|cancel|zero|\b0\b|7 ?[-−] ?3|7 minus 3|\b4\b|arithmetic|left with|leaves|subtract/i],
  2: [/pythag|a ?² ?\+ ?b|a\^?2 ?\+ ?b|right (triangle|angle)|squares? on (the|each|both)( two)?( short)? sides?|square on the long side|distance formula|square each/i,
      /square root|root|5 ?[x×*] ?5|5 times 5|five times five|\b25\b/i],
  3: [/same amount|every week|each week|grows 3|adds? 3|plus 3|\+ ?3|rate|slope|linear|pattern|straight line|starts? (at|with) 2|constant|3 (cm )?(a|per) week/i,
      /substitut|plug|put (in )?4|replace|4 (in|for)|multiply|times|3 ?[x×*] ?4|12 ?\+ ?2|order of operations/i],
  4: [/substitut|plug|put (in )?3|replace|3 (in|for)|3 ?[x×*] ?3|3 times 3|9 ?[-−] ?9|9 minus 9|multiply|times/i,
      /mirror|symmetr|same on both|both sides|negative times|[-−]3 ?[x×*] ?[-−]3|also 9|same height|opposite|flip|reflect|same as 3|equal/i],
};
// A reason that only says what you see is a picture, not a rule.
export const PICTURE = /\blooks?\b|\bsee\b|picture|eyeball|seems|guess/i;

// Split a draft into numbered steps: { n, line, given, reason }.
export function parseSteps(text) {
  return String(text || "").split("\n").map((l) => l.trim()).filter(Boolean).map((line, i) => {
    const num = line.match(/^(\d+)[.)]/);
    const because = line.match(/because\s+([^)\n]*)/i);
    return { n: num ? Number(num[1]) : i + 1, line, given: /\(\s*given\s*\)/i.test(line), reason: because ? because[1].trim() : "" };
  });
}

// Check every "because" step of a guided path. Each step gets ok: true / false.
export function checkReasons(id, text) {
  const rules = RUBRIC[id] || [];
  const steps = parseSteps(text);
  let k = 0;
  for (const s of steps) {
    if (s.given) { s.ok = true; continue; }
    const re = rules[k++];
    s.ok = Boolean(s.reason && re && re.test(s.reason) && !PICTURE.test(s.reason));
  }
  const reasons = steps.filter((s) => !s.given).map((s) => s.reason);
  const pass = rules.length > 0 && k >= rules.length && steps.every((s) => s.ok);
  return { pass, reasons, steps };
}
