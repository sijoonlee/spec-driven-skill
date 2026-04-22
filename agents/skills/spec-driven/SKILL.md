---
name: spec-driven
description: This skill should be used when the user wants to "build a feature spec-driven", "write requirements first", "create a design doc before coding", "do spec-driven development", "spec out a feature", "plan before implementing", "write user stories", "create a task breakdown", or wants to follow a structured requirements → design → tasks → implementation workflow. Use this skill whenever the user wants to plan a software feature or project before writing code, even if they don't explicitly say "spec-driven".
---

# Spec-Driven Development

Four sequential phases. Each phase requires user confirmation before the next begins. Save all spec files to `spec/` in the project root.

```
Requirements → Design → Tasks → Implementation
```

Each phase produces numbered drafts (`requirements-1.md`, `requirements-2.md`, ...) and a confirmed final (`requirements-confirmed.md`).

---

## Phase 1: Requirements

Ask 2-3 focused questions to clarify intent. If the user's message already answers them, draft immediately.

Write `spec/requirements-1.md` containing: project overview, user stories (As a / I want / So that + acceptance criteria), non-functional requirements with measurable thresholds, and an explicit out-of-scope list. End with a Quality Check section.

Rules:
- Acceptance criteria must be observable or measurable — not "works correctly"
- NFRs need specific numbers (e.g. "loads in 2s", "supports 500 nodes")
- Out-of-scope list prevents scope creep — be explicit

Revise as needed (`requirements-2.md`, etc.). Confirm → `requirements-confirmed.md`.
**Gate: do not start Phase 2 until the user confirms.**

---

## Phase 2: Design

Read `requirements-confirmed.md` first. Every decision must trace to a requirement.

Write `spec/design-1.md` containing: system architecture (ASCII diagram), tech stack table with rationale for each choice (include test framework), component hierarchy, key data models with typed fields, file structure (include test file locations). End with a summary of open questions resolved.

Rules:
- Test framework must be chosen here — it drives the setup task and `npm test`
- Data models must be specific enough to code from (field names and types)
- File structure is a commitment, not a suggestion
- Quality Check must fail (`✗`) if the tech stack table has no testing row

Revise as needed. Confirm → `design-confirmed.md`.
**Gate: do not start Phase 3 until the user confirms.**

---

## Phase 3: Tasks

Read both confirmed spec files first.

Write `spec/tasks-1.md`. Each task has: feature area, requirement mapping (US-N), implementation steps (concrete enough to code from), and a Tests section. End with a Task Dependencies table, Requirements Traceability table, and Quality Check.

Rules:
- Tasks are 1–4 hours each, one feature per task
- **Tests are automated test code** — name the test file and list specific test case descriptions (e.g. `'deleteNode() removes its connectors'`). Never use manual curl/verify steps.
- Every test case maps to a specific US acceptance criterion
- Setup task must install the test framework and add `npm test` to `package.json`
- Order by dependency: setup → data layer → features → advanced

See `references/templates.md` for the exact per-task structure and quality check checklist.

Revise as needed. Confirm → `tasks-confirmed.md`.
**Gate: do not start Phase 4 until the user confirms.**

---

## Phase 4: Implementation

Work through `tasks-confirmed.md` top to bottom. For each task:
1. Implement the steps
2. Write and run the tests (`npm test`)
3. Mark all steps and tests `[x]` in the tasks doc
4. Report: what was built, tests passing, any deviations from spec
5. **Stop and wait for the user to confirm before starting the next task**

If a design decision turns out to be wrong: note the deviation explicitly and ask before making significant changes.

**Mid-implementation spec changes**: If a requirement or design decision needs to change during Phase 4, update the relevant confirmed doc first (`requirements-confirmed.md` or `design-confirmed.md`), then update the affected tasks in `tasks-confirmed.md`, then continue. Never silently diverge from the spec — the confirmed docs should always reflect what is actually being built.

---

## Reference Files

- **`references/templates.md`** — Exact doc structures for all three phases + quality check checklists
- **`references/requirements-example.md`** — Annotated example requirements doc
- **`references/design-example.md`** — Annotated example design doc
- **`references/tasks-example.md`** — Annotated example task list
