// Sample class for the Professor tab, plus the answer key (true proofs and the reasons a Professor accepts).
// Copied from the MATH 140 Study Tool. Timestamps are offsets so the demo always looks recent.
const latest = 1793293954185;
export const KEY = {
  "1": {
    "title": "The Balance",
    "question": "A box and 3 apples weigh the same as 7 apples. How many apples are in the box?",
    "answer": "4 apples (x = 4)",
    "steps": [
      {
        "s": "x + 3 = 7",
        "r": "Given",
        "kid": ""
      },
      {
        "s": "x + 3 − 3 = 7 − 3",
        "r": "Subtraction Property of Equality: subtract the same number from both sides and the equation stays true.",
        "kid": "“take 3 off both sides”, “do the same to each side so it stays level”"
      },
      {
        "s": "x = 4",
        "r": "Simplify (arithmetic): 3 − 3 = 0 and 7 − 3 = 4.",
        "kid": "“3 − 3 is 0 and 7 − 3 is 4”, “the 3s cancel”"
      }
    ]
  },
  "2": {
    "title": "The Shortcut",
    "question": "You walk 3 steps right, then 4 steps up. How many steps is the straight shortcut back?",
    "answer": "5 steps",
    "steps": [
      {
        "s": "The walk goes 3 right and 4 up",
        "r": "Given. Right and up meet at a right angle, so the path is a right triangle.",
        "kid": ""
      },
      {
        "s": "3² + 4² = c²",
        "r": "Pythagorean Theorem: in a right triangle, a² + b² = c² (c is the long side).",
        "kid": "“Pythagorean theorem”, “it is a right triangle, so square each short side and add”"
      },
      {
        "s": "9 + 16 = 25, so c = √25 = 5",
        "r": "Arithmetic, then take the positive square root (a length is positive).",
        "kid": "“5 times 5 is 25”, “square root of 25”"
      }
    ]
  },
  "3": {
    "title": "The Growing Line",
    "question": "A plant is 2 cm tall. It grows 3 cm every week. How tall is it after 4 weeks?",
    "answer": "14 cm",
    "steps": [
      {
        "s": "Start 2 cm, +3 cm each week",
        "r": "Given",
        "kid": ""
      },
      {
        "s": "h = 3w + 2",
        "r": "Linear function: a constant rate (3 cm per week) is the slope, and the start (2 cm) is the y-intercept.",
        "kid": "“it grows the same 3 every week and starts at 2”"
      },
      {
        "s": "h = 3 · 4 + 2 = 14",
        "r": "Substitution (w = 4), then order of operations: multiply, then add.",
        "kid": "“put 4 in for weeks”, “3 times 4 is 12, plus 2”"
      }
    ]
  },
  "4": {
    "title": "The Arch",
    "question": "You throw a ball up. It goes up, then it comes down. What shape does its path make?",
    "answer": "An arch (a parabola)",
    "steps": [
      {
        "s": "h = 9 − x²",
        "r": "Given",
        "kid": ""
      },
      {
        "s": "At x = 3: h = 9 − 3² = 0",
        "r": "Substitution (x = 3).",
        "kid": "“put 3 in for x”, “3 times 3 is 9, and 9 − 9 = 0”"
      },
      {
        "s": "At x = −3: h = 9 − (−3)² = 0",
        "r": "Substitution, and (−3)(−3) = 9 because a negative times a negative is positive. So the parabola is symmetric about x = 0.",
        "kid": "“−3 times −3 is also 9”, “it is the same on both sides (mirror)”"
      }
    ]
  }
};

export const DEMO_ATTEMPTS = [
  {
    "id": "d1",
    "ts": 1793292154184,
    "nick": "Demo · Mila",
    "world": "animals",
    "path": 1,
    "round": 1,
    "guess": "",
    "verdict": "no_gap",
    "mode": "ai",
    "step": null,
    "hint": "",
    "rubricPass": true,
    "rewarded": true,
    "needsHelp": false,
    "text": "1. x + 3 = 7 (Given)\n2. x + 3 − 3 = 7 − 3 (because I take 3 off both sides so it stays level)\n3. x = 4 (because 3 − 3 is 0 and 7 − 3 is 4)",
    "steps": [
      {
        "n": 1,
        "ok": true
      },
      {
        "n": 2,
        "ok": true
      },
      {
        "n": 3,
        "ok": true
      }
    ]
  },
  {
    "id": "d2",
    "ts": 1793292394184,
    "nick": "Demo · Theo",
    "world": "sports",
    "path": 1,
    "round": 1,
    "guess": "10 apples",
    "verdict": "gap",
    "mode": "ai",
    "step": 2,
    "hint": "This step needs a property of equality.",
    "rubricPass": false,
    "rewarded": false,
    "needsHelp": false,
    "text": "1. x + 3 = 7 (Given)\n2. x + 3 − 3 = 7 − 3 (because it looks right)\n3. x = 4 (because 7 − 3 is 4)",
    "steps": [
      {
        "n": 1,
        "ok": true
      },
      {
        "n": 2,
        "ok": false
      },
      {
        "n": 3,
        "ok": true
      }
    ]
  },
  {
    "id": "d3",
    "ts": 1793292814184,
    "nick": "Demo · Theo",
    "world": "sports",
    "path": 1,
    "round": 2,
    "guess": "10 apples",
    "verdict": "no_gap",
    "mode": "ai",
    "step": null,
    "hint": "",
    "rubricPass": true,
    "rewarded": true,
    "needsHelp": false,
    "text": "1. x + 3 = 7 (Given)\n2. x + 3 − 3 = 7 − 3 (because you subtract 3 from both sides and it stays equal)\n3. x = 4 (because 7 − 3 is 4)",
    "steps": [
      {
        "n": 1,
        "ok": true
      },
      {
        "n": 2,
        "ok": true
      },
      {
        "n": 3,
        "ok": true
      }
    ]
  },
  {
    "id": "d4",
    "ts": 1793293174184,
    "nick": "Demo · Ana",
    "world": "space",
    "path": 2,
    "round": 1,
    "guess": "",
    "verdict": "busy",
    "mode": "busy",
    "step": null,
    "hint": "",
    "rubricPass": true,
    "rewarded": true,
    "needsHelp": false,
    "text": "1. The walk goes 3 right and 4 up (Given)\n2. 3 × 3 + 4 × 4 = shortcut × shortcut (because it is a right triangle so I use Pythagoras)\n3. 9 + 16 = 25, so the shortcut is 5 (because 5 times 5 is 25)",
    "steps": [
      {
        "n": 1,
        "ok": true
      },
      {
        "n": 2,
        "ok": true
      },
      {
        "n": 3,
        "ok": true
      }
    ]
  },
  {
    "id": "d5",
    "ts": 1793293954185,
    "nick": "Demo · Jay",
    "world": "games",
    "path": 4,
    "round": 3,
    "guess": "A straight line",
    "verdict": "gap",
    "mode": "ai",
    "step": 3,
    "hint": "This step needs a rule about multiplying negative numbers.",
    "rubricPass": false,
    "rewarded": false,
    "needsHelp": true,
    "text": "1. height = 9 − x × x (Given)\n2. At x = 3, height = 9 − 3 × 3 = 0 (because I put 3 in for x)\n3. At x = −3, height = 0 too (because I guess so)",
    "steps": [
      {
        "n": 1,
        "ok": true
      },
      {
        "n": 2,
        "ok": true
      },
      {
        "n": 3,
        "ok": false
      }
    ]
  }
].map((a) => ({ ...a, offset: latest - a.ts }));
