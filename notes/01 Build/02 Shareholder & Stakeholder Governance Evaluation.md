---
course: DIGI 230 Ethics of Emerging Technology
milestone: 2
client-course: MATH 140 The Geometry of Physical Space
professor: Patrick Bahls (Associate Chair, Liberal Arts)
tags: [digi230, milestone-2, stakeholders, shareholders, governance, ethical-evaluation]
cssclasses: [garden]
---

# 🏛️ Shareholder & Stakeholder Governance Evaluation

🧭 [🌸 Start](00%20Start%20Here.md) · [🗺️ Map](01%20MATH%20140%20Course%20Map.md) · [👥 People](05%20Stakeholder%20Snapshot.md) · [⚠️ Risks](02%20Stakeholders%2C%20Risk%20%26%20Evidence.md) · [💧 Hint Helper](03%20Proof%20Check%20Tool%20%26%20Build%20Log.md) · [📗 Guide](00%20Garden%20Guide%20%28live%29.md)

This evaluation establishes the ethical governance framework, stakeholder impact ledger, and institutional safeguards for deploying the **MATH 140 Proof Check SLM / Study Tool** alongside the interactive syllabus calendar and reverse-engineered verification framework (`morluto/rea`).

---

## 📊 Executive Summary & The Bounded Mandate

The Proof Check helper operates strictly under the **Single-Stop Touchpoint Principle**:
> AI is permitted **only at Stop 3 (Water / Hint)** within a 5-stop pedagogical arc (Draw → Write → Hint → Explain → Quiz). It functions exclusively as a Socratic hint reflector on student-authored draft proofs of 2 or more steps. It is prohibited from writing proofs, providing answers, evaluating final correctness, or grading.

```
       [🌱 1. Draw]   --> Compass & straightedge by hand (No AI)
            │
       [🌿 2. Write]  --> Independent proof draft ≥ 2 steps (No AI)
            │
       [💧 3. Hint]   --> AI points to 1st weak link + theorem class (ONLY AI)
            │
       [🌸 4. Explain]--> Blackboard oral presentation to peers (No AI)
            │
       [🍓 5. Quiz]   --> Human-graded proctored assessment (No AI)
```

---

## 👥 Stakeholder & Shareholder Matrix

| Stakeholder / Shareholder | Primary Motivation & Rights | Vulnerability & Downside Risk | Institutional Safeguard & Enforcement | Accountability Owner |
|---|---|---|---|---|
| **1. Students (Primary Users)** | Timely nocturnal feedback on proof logic; passing MATH 140; mastering geometrical deduction. | Over-reliance leading to skill atrophy; receiving misleading hints that derail proofs. | Mandatory 2-step draft before activation; theorem *class* hints only; 1 hint per turn; Socratic counter-questioning. | Student (owns steps) & Instructor (verifies) |
| **2. Course Faculty (Prof. Bahls)** | High academic standards; authentic student demonstrations; manageable grading load. | Grading synthetic AI output; student confusion from hallucinated mathematical logic. | 48-hour escalation loop on "Not sure" / "I disagree" feedback; zero-grading delegation; mandatory board defenses. | Instructor (final arbiter of truth) |
| **3. Peer Partners & Tutors** | High-quality collaborative board sessions; transparent learning dialogues. | Inability to assist peers who memorized an AI hint without conceptual grounding. | Stop 4 "Bloom" board defense enforces verbal explanation; tutors receive paper theorem checklists. | Peer Partner / Math Lab Tutor |
| **4. Educational Equity & No-AI Cohort** | Parity of outcomes regardless of hardware access, internet availability, or assistive needs. | Digital divide disadvantage; bias against students without home computers. | 100% equivalent Paper Theorem Checklist & designated instructor walk-in office hours; screen-reader accessible semantic HTML. | Liberal Arts Department |
| **5. University & Integrity Board (Shareholders)** | Accreditation standards; syllabus policy compliance; student data privacy; institutional reputation. | Systemic cheating scandals; unauthorized model training on student intellectual property. | Vercel AI Gateway with `disallowPromptTraining: true`; OIDC stateless tokenization; open-weight Meta Llama 3.3 70B runtime. | Academic Integrity Committee & SCAD IT |
| **6. Reverse Engineering & Verification (`rea`)** | Provable runtime boundaries; zero answer leakage; verifiable prompt-injection resistance. | Jailbreak exploits forcing model into full-proof generation mode. | Automated REA evaluation harness (`morluto/rea`) asserting negative invariant tests and ledger obligations. | Studio Systems Architect |

---

## 🔑 The 8 Essential Principles for Student Accounts

Every student account and study tool interface must embed and display these 8 core tenets:

1. **The Single Stop Boundary (Stop 3 Only)**: AI never draws constructions, never generates first drafts, and never assigns a grade. AI is only a mirror for Step 3.
2. **Theorem Class, Never Answers**: The model will identify that you need a "triangle congruence postulate" or "parallel line transversal theorem", but will never tell you whether it is ASA, SAS, or SSS.
3. **The 48-Hour Instructor Escalation Loop**: If a hint feels counterintuitive, choosing *"Not sure"* or *"I disagree"* automatically logs the instance for instructor review before your board presentation.
4. **Weighted Milestone Awareness (40% Exams)**: 4 major open-concept exams (Functions 10%, Polygonal 10%, Transformational 10%, Modern 10%) require personal synthesis that cannot be simulated.
5. **Creative Major Application (25% Discussions)**: 10 weekly discussions connect physical geometry to architecture, industrial design, animation, fashion, and sequential art.
6. **Physical Hand-Drafting Primacy**: Points, lines, parabolas, and Möbius strips must be constructed physically with compass and ruler; AI vision is deliberately disabled.
7. **Socratic Statement-Reason Discipline**: Proofs require structured logical causality; if stuck, isolate your given hypotheses from your required conclusion.
8. **Board Defense Authenticity**: Stop 4 requires you to defend your proof out loud before your peers. If you did not write the proof, you cannot defend it.

---

## 🛡️ Risk Mitigation & Evidence-Backed Validation

### Scientific Evidence Base
- **Bastani et al. (PNAS 2025)**: Nearly 1,000 high school math students. Unrestricted GPT-4 raised practice grades, but once access was removed those students scored 17% lower on exams than students who never had it; they had used it as a "crutch". A safeguarded tutor largely mitigated that harm.
- **Kestin et al. (Scientific Reports 2025)**: In a randomized trial with 194 Harvard physics students, a purpose-built AI tutor following pedagogical best practices produced median learning gains more than double those of an in-class *active-learning* lesson, in less time.
- **Petrov et al. (arXiv preprint 2025)**: Experts graded AI proofs on the 2025 USA Math Olympiad. The best model scored 25% and all others under 5%, yet the models presented their proofs confidently. This supports human verification and disclaimers.

Checked against the original papers on Nov 12, 2026. See the [Research & Evidence Index](../02%20Research%20%26%20Evidence/Research%20%26%20Evidence%20Index.md).

### Empirical Boundary Invariants
- `INV-01`: Input text must contain $\ge 2$ structured proof lines; otherwise reject with draft request.
- `INV-02`: Output character length strictly capped at 120 words to prevent runaway synthetic proofs.
- `INV-03`: Output MUST terminate with the exact disclaimer: *"Check this hint against your theorem list; your instructor decides what is correct."*
- `INV-04`: Token training strictly disabled at proxy layer.

---

## 🔄 Lifecycle Governance & Review Schedule

1. **Pre-Term Setup**: Syllabus calendar synchronization and exam milestone lock.
2. **Weekly Pulse**: Extraction of "Not sure" hint logs for professor triage during office hours.
3. **Midterm Audit (Week 5)**: REA harness execution to re-verify API gate security and model adherence against prompt injection suites.
4. **Post-Term Shareholder Report (Week 10)**: Evaluation of trial class performance delta between tool users and control cohort.
