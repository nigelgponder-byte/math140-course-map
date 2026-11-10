// SCAD MATH 140 "The Geometry of Physical Space"
// Core course map, weekly syllabus, milestones, and grading structure.

export const COURSE_INFO = {
  code: "MATH 140",
  title: "The Geometry of Physical Space",
  institution: "Savannah College of Art and Design (SCAD)",
  professor: "Patrick Bahls (Associate Chair, Department of Liberal Arts)",
  quarterLengthWeeks: 10,
  description: "A study of Euclidean and non-Euclidean geometries, transformational geometry, symmetry, topology, and fractals, emphasizing structural applications to art, design, and physical space.",
  sourceRepo: "https://github.com/nigelgponder-byte/math140-course-map",
  liveMapUrl: "https://team-math140-study-tool.vercel.app/map/",
  weights: [
    { category: "Exams (4 × 10%)", weight: 40, detail: "Functions, Polygonal, Transformational, Modern Geometry (33 Q each, open book)" },
    { category: "Activities (5 × 5%)", weight: 25, detail: "Polygonal, Vector, Tessellation, Graph Theory, Fractal Activities" },
    { category: "Discussions (10 × 2.5%)", weight: 25, detail: "Weekly forum connections to art, design, architecture & animation" },
    { category: "Applied Geometry Project", weight: 10, detail: "Final synthesized project & oral presentation (Week 10)" }
  ]
};

export const WEEKS = [
  {
    week: 1,
    title: "Euclidean Primitives & Coordinate Geometry",
    topics: "Points, lines, angles, planes; Euclid's axioms; Cartesian coordinates; Distance formula; Linear functions.",
    activities: ["Name design (symmetry and proportions)", "Triangulation activity (Phineas & Ferb)"],
    deliverables: [
      { name: "Problem Set: Euclidean Geometry", type: "assignment", weight: "Standard" }
    ],
    stop: "Stop 1: Draw (No AI)"
  },
  {
    week: 2,
    title: "Quadratics, Polynomials & Trigonometry",
    topics: "Parabolas, catenary arches; Higher-order polynomials; Unit circle trigonometry; Pythagorean theorem.",
    activities: ["Parabola arch construction (Gaudí)", "Unit circle trigonometric exploration"],
    deliverables: [
      { name: "Polygonal Activity", type: "activity", weight: "5%" },
      { name: "Problem Set: Quadratics & Trig", type: "assignment", weight: "Standard" },
      { name: "Discussion 1: Math in Art & Architecture", type: "discussion", weight: "2.5%" }
    ],
    stop: "Stop 1: Draw (No AI)"
  },
  {
    week: 3,
    title: "Functions Exam, Vectors & Polygonal Proofs",
    topics: "Vector operations (dot & cross product, matrix representation); 2D polygonal geometry; Triangle congruence; First geometric proofs.",
    activities: ["Kahoot! Vectors challenge", "Triangulation proof workshop"],
    deliverables: [
      { name: "Functions Exam (33 Q, Open Book)", type: "exam", weight: "10%" },
      { name: "Vector Activity", type: "activity", weight: "5%" },
      { name: "Discussion 2: Math in Your Creative Major", type: "discussion", weight: "2.5%" }
    ],
    stop: "Stop 2: Write (No AI) & Stop 3: Hint (AI Allowed)"
  },
  {
    week: 4,
    title: "Applied Polygonal & Transformational Geometry",
    topics: "Design applications (graphics, industrial furniture, jewelry, fashion); Rigid and non-rigid motions; Matrix transformations; Tessellations.",
    activities: ["Polygonal silhouette modeling", "Transformational Tetris tessellation lab"],
    deliverables: [
      { name: "Discussion 3: Candy Bar Geometry & Packaging", type: "discussion", weight: "2.5%" }
    ],
    stop: "Stop 2: Write (No AI) & Stop 3: Hint (AI Allowed)"
  },
  {
    week: 5,
    title: "Polygonal Geometry Exam & 3D Spatial Systems",
    topics: "3D Cartesian coordinate systems (XYZ, right-hand rule, distance in space); Space-filling polygons; Spatial transformations.",
    activities: ["Polygon spatial assembly", "Kahoot! 3D coordinates exploration"],
    deliverables: [
      { name: "Polygonal Geometry Exam (33 Q, Open Book)", type: "exam", weight: "10%" },
      { name: "Discussion 4: Non-Euclidean Concepts in Creative Fields", type: "discussion", weight: "2.5%" }
    ],
    stop: "Stop 3: Hint (AI Allowed) & Stop 4: Explain (No AI)"
  },
  {
    week: 6,
    title: "Planes, 3D Vectors & Spatial Transformations",
    topics: "Planar equations; 3D vector fields; 3D transformational algebra and applications in CGI/game design.",
    activities: ["Vertex coloring challenge (Graph Theory)", "Escher-style isometric tessellation"],
    deliverables: [
      { name: "Tessellation Activity", type: "activity", weight: "5%" },
      { name: "Problem Set: Transformational Geometry", type: "assignment", weight: "Standard" },
      { name: "Discussion 5: Geometry of Physical Space in Practice", type: "discussion", weight: "2.5%" }
    ],
    stop: "Stop 3: Hint (AI Allowed) & Stop 4: Explain (No AI)"
  },
  {
    week: 7,
    title: "Transformational Exam & Non-Euclidean Spaces",
    topics: "Euclid's 5th postulate (Parallel Postulate); Hyperbolic geometry; Elliptic and spherical geometry; Curvature.",
    activities: ["Hyperbolic crochet/paper model construction", "Spherical triangle angle sum demonstration"],
    deliverables: [
      { name: "Transformational Geometry Exam (33 Q, Open Book)", type: "exam", weight: "10%" },
      { name: "Discussion 6: Vertex Coloring in Real-World Systems", type: "discussion", weight: "2.5%" }
    ],
    stop: "Stop 3: Hint (AI Allowed) & Stop 4: Explain (No AI)"
  },
  {
    week: 8,
    title: "Graph Theory & Topology",
    topics: "Eulerian paths and circuits; Königsberg bridges problem; Planar graphs; Topological invariants; Genus and homeomorphisms.",
    activities: ["Graph network routing", "Möbius strip and torus slicing"],
    deliverables: [
      { name: "Graph Theory Activity", type: "activity", weight: "5%" },
      { name: "Problem Set: Non-Euclidean Geometry & Topology", type: "assignment", weight: "Standard" },
      { name: "Discussion 7: The Golden Ratio in Art & Design", type: "discussion", weight: "2.5%" }
    ],
    stop: "Stop 3: Hint (AI Allowed) & Stop 4: Explain (No AI)"
  },
  {
    week: 9,
    title: "Fractals & Modern Geometry Exam",
    topics: "Fractal geometry; Self-similarity; Hausdorff dimension; Sierpinski triangle; Koch snowflake; Mandelbrot set.",
    activities: ["Iterated function system generator", "Fractal dimension calculation lab"],
    deliverables: [
      { name: "Modern Geometry Exam (33 Q, Open Book)", type: "exam", weight: "10%" },
      { name: "Discussion 8: Euler Circuits in Urban & Motion Design", type: "discussion", weight: "2.5%" }
    ],
    stop: "Stop 4: Explain (No AI)"
  },
  {
    week: 10,
    title: "Applied Project Defense & Synthesis",
    topics: "Comprehensive review of 10-week geometric systems; Final portfolio synthesis; Project presentations.",
    activities: ["Peer critique of applied geometric artifacts", "Course reflection seminar"],
    deliverables: [
      { name: "Applied Geometry Project & Presentation", type: "project", weight: "10%" },
      { name: "Fractal Activity", type: "activity", weight: "5%" },
      { name: "Discussion 9: Fractals in Your Major", type: "discussion", weight: "2.5%" },
      { name: "Discussion 10: Retrospective & Lessons Learned", type: "discussion", weight: "2.5%" }
    ],
    stop: "Stop 5: Quiz & Project Defense (No AI - Professor Grades)"
  }
];

export const EIGHT_KEYS = [
  {
    num: 1,
    title: "The Single Stop Boundary (Stop 3 Only)",
    detail: "AI is strictly prohibited from drawing constructions, writing proofs from scratch, or assigning grades. It exists solely at Stop 3 as a reflective mirror for your own draft."
  },
  {
    num: 2,
    title: "Theorem Class, Never Answers",
    detail: "The hint tutor will name the family of theorem you need (e.g., 'a triangle congruence postulate' or 'alternate interior angles'), but will never provide the explicit step or proof code."
  },
  {
    num: 3,
    title: "48-Hour Instructor Escalation",
    detail: "Selecting 'Not sure' or 'I disagree' queues your hint for direct professor review within 48 hours, safeguarding against AI hallucination before your board defense."
  },
  {
    num: 4,
    title: "40% Exam Block (4 × 10%)",
    detail: "Functions, Polygonal, Transformational, and Modern Geometry exams require independent conceptual mastery. They are open-book but test synthesis over mechanical computation."
  },
  {
    num: 5,
    title: "25% Weekly Discussion Cadence",
    detail: "10 weekly forum discussions (2.5% each) bridge abstract geometry to your creative major (architecture, animation, industrial design, sequential art)."
  },
  {
    num: 6,
    title: "Physical Compass & Hand-Drafting Primacy",
    detail: "Euclidean geometry begins in the hands. Compass and straightedge drawing at Stop 1 cannot be automated—spatial intuition begins with tactile construction."
  },
  {
    num: 7,
    title: "Socratic Statement & Reason Rigor",
    detail: "Always format proof drafts with dual columns: Statement and Justification. Isolate your starting given facts from your required target claim before requesting a hint."
  },
  {
    num: 8,
    title: "Stop 4 Board Presentation Defense",
    detail: "You must explain your proof verbally to peer partners at the board ('Bloom'). If you did not reason through the proof yourself, you cannot defend it under peer inquiry."
  }
];

export const ETHICAL_SYSTEM_PROMPT = `You are the Proof Check hint tutor for SCAD MATH 140 "The Geometry of Physical Space", Step 3 of the Constructions & Proof unit. This is the only step in the unit where AI is allowed.

Your only job: read a proof the student has ALREADY drafted and point to the FIRST step whose reason is missing, wrong, or does not follow. Then name the kind of justification they need (for example "a triangle congruence postulate", "a property of parallel lines cut by a transversal", "a theorem about inscribed angles"), without naming the exact statement to write.

The student may also send worked algebra from the Weeks 1–2 review (equations, linear functions, distance, parabolas) written as steps with reasons. Treat it the same way: point to the first step whose reason is missing or wrong, and name the kind of rule they need (for example "a property of equality", "the Pythagorean theorem", "substituting a value into a function"). Do not do the arithmetic for them.

Hard rules:
- Never write a proof step, statement, or reason for the student. Never complete, rewrite, or fix their proof. Never give the final answer.
- If the message has no attempted proof with at least 2 steps, do not help with the problem. Ask the student to write their own draft first (two-column or paragraph).
- If the student asks for the answer or the next step, decline kindly and give only the hint described above.
- You cannot see diagrams or constructions. If the proof depends on a figure, say which given fact you are assuming from the description.
- Keep replies under 120 words. One gap per reply. Ask one question that makes the student justify their own step.
- You can be wrong about proofs. The exact final sentence of every reply must be: "Check this hint against your theorem list; your instructor decides what is correct."`;

// The live helper answers in a fixed form (JSON). The code, not the AI's wording, decides what happens next.
export const VERDICT_PROMPT = `You are the Proof Check hint helper for SCAD MATH 140 "The Geometry of Physical Space". This is the only step where AI is allowed. Some students are young, so write short, simple sentences.

Read the proof the student ALREADY drafted. Each numbered step has a statement and a reason in parentheses. It can be geometry, or Weeks 1-2 algebra (equations, distance, linear functions, parabolas).

Decide ONE thing: is there a step whose reason is missing, wrong, only says it "looks" right, or does not follow?

Reply with ONLY this JSON, nothing else:
{"draft": true or false, "gap": true or false, "step": number or null, "hint": "text", "question": "text"}

Rules:
- "draft" is true when the message has 2 or more numbered steps, even if the reasons are weak or silly. "draft" is false only when there is no attempt with 2 steps, or the message only asks for the answer. Then set gap to true, step to null, hint to "", question to "".
- Steps marked "(Given)" never need a reason. Never pick a Given step.
- Steps the message lists as ALREADY CHECKED are done. Never pick them.
- If the message has a PROFESSOR NOTE with accepted reasons, a reason with the same idea counts. Do not ask for more than the Professor accepts. Never copy words from the PROFESSOR NOTE into the hint or question.
- A reason in everyday words counts when it names the right idea. Example: "take 3 off both sides" is a property of equality. Do not ask for formal names, more detail, or nicer wording.
- If every reason names a real rule, set gap to false, step to null, hint to "", question to "". Do not invent problems.
- If gap is true: "step" is the number of the FIRST weak step. "hint" is 1 sentence under 25 words that names only the KIND of rule needed (for example "a property of equality", "a theorem about right triangles", "substituting a value"). Do not give the exact name of the rule (no "subtraction property", no "Pythagorean theorem") or the words to write. "question" is 1 short question that makes the student think.
- Never write a step, a reason, or the answer for the student. Never do the arithmetic for them. Never say the proof is correct, right, or perfect.`;

export const DISCLAIMER_TEXT ="Check this hint against your theorem list; your instructor decides what is correct.";

function formatDateICS(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  const h = String(date.getUTCHours()).padStart(2, "0");
  const min = String(date.getUTCMinutes()).padStart(2, "0");
  const s = String(date.getUTCSeconds()).padStart(2, "0");
  return `${y}${m}${d}T${h}${min}${s}Z`;
}

function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function generateMilestones(startStr) {
  const base = startStr ? new Date(startStr + "T09:00:00") : new Date();
  const start = isNaN(base.getTime()) ? new Date() : base;

  return WEEKS.map((w, idx) => {
    const weekStart = new Date(start.getTime() + idx * 7 * 86400000);
    const weekEnd = new Date(weekStart.getTime() + 4 * 86400000);

    const items = [];
    w.deliverables.forEach((d, dIdx) => {
      const offsetDays = d.type === "exam" ? 4 : (dIdx === 0 ? 2 : 4);
      const itemDate = new Date(weekStart.getTime() + offsetDays * 86400000);
      items.push({
        name: d.name,
        type: d.type,
        weight: d.weight,
        date: formatDateKey(itemDate),
        dateTime: itemDate.toISOString()
      });
    });

    return {
      week: w.week,
      title: w.title,
      topics: w.topics,
      stop: w.stop,
      startDate: formatDateKey(weekStart),
      endDate: formatDateKey(weekEnd),
      deliverables: items
    };
  });
}

export function buildICS(milestones) {
  let lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SCAD//MATH 140 Study Tool//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:MATH 140 - The Geometry of Physical Space",
    "X-WR-TIMEZONE:America/New_York"
  ];

  const now = new Date();
  const stamp = formatDateICS(now);

  milestones.forEach((m) => {
    const wStart = new Date(m.startDate + "T10:00:00");
    const wEnd = new Date(m.startDate + "T11:40:00");
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:math140-w${m.week}-${Date.now()}@scad.edu`);
    lines.push(`DTSTAMP:${stamp}`);
    lines.push(`DTSTART:${formatDateICS(wStart)}`);
    lines.push(`DTEND:${formatDateICS(wEnd)}`);
    lines.push(`SUMMARY:MATH 140 Week ${m.week}: ${m.title}`);
    lines.push(`DESCRIPTION:Topics: ${m.topics}\\n${m.stop}`);
    lines.push("LOCATION:SCAD Arnold Hall / Virtual");
    lines.push("STATUS:CONFIRMED");
    lines.push("END:VEVENT");

    m.deliverables.forEach((d, i) => {
      const dStart = new Date(d.date + "T14:00:00");
      const dEnd = new Date(d.date + "T15:00:00");
      lines.push("BEGIN:VEVENT");
      lines.push(`UID:math140-w${m.week}-deliv-${i}-${Date.now()}@scad.edu`);
      lines.push(`DTSTAMP:${stamp}`);
      lines.push(`DTSTART:${formatDateICS(dStart)}`);
      lines.push(`DTEND:${formatDateICS(dEnd)}`);
      lines.push(`SUMMARY:[MATH 140] ${d.name} (${d.weight})`);
      lines.push(`DESCRIPTION:${d.type.toUpperCase()} milestone for Week ${m.week}. Weight: ${d.weight}.`);
      lines.push("STATUS:CONFIRMED");
      lines.push("END:VEVENT");
    });
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

