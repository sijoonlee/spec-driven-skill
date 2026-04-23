---
name: spec-driven-new-project
description: Use this skill whenever the user wants to plan, design, or build a software feature by writing requirements or a spec before writing code — even if they don't say "spec-driven". Trigger phrases include: "build a feature spec-driven", "write requirements first", "create a design doc before coding", "spec out a feature", "plan before implementing", "write user stories", "create a task breakdown", "let's plan this properly", "what should we build exactly", or any situation where the user wants to think through WHAT and HOW before touching code. Also use this skill when the user describes a feature but hasn't yet defined acceptance criteria or a design — even if they haven't asked for a spec, they probably need one. This skill is the right choice for greenfield work — when there is no existing codebase to build on. Use spec-driven-work-on-changes instead if code already exists and the user wants to plan a change, or reverse-spec if the goal is to document what's already built without planning new features.
disable-model-invocation: true
---

# Spec-Driven Development

Four sequential phases. Each phase requires user confirmation before the next begins. Save all spec files to `spec/` in the project root — create this directory if it doesn't already exist.

```
Requirements → Design → Tasks → Implementation
```

Each phase produces numbered drafts (`requirements-1.md`, `requirements-2.md`, ...) and a confirmed final (`requirements-confirmed.md`).

---

## Phase 1: Requirements

Start by understanding intent. Good clarifying questions cover three areas: **who** (who is the user, what problem are they solving), **what** (the most important behavior to get right, any hard constraints), and **boundaries** (what's explicitly out of scope). Ask 2-3 focused questions from these areas — but if the user's message already answers them, draft immediately.

Create `spec/` in the project root if it doesn't already exist. Write `spec/requirements-1.md` containing: project overview, user stories (As a / I want / So that + acceptance criteria), non-functional requirements with measurable thresholds, and an explicit out-of-scope list. End with a Quality Check section.

Rules:
- Acceptance criteria must be observable or measurable — not "works correctly"
- NFRs need specific numbers (e.g. "loads in 2s", "supports 500 nodes")
- Out-of-scope list prevents scope creep — be explicit

After writing, tell the user: "I've written `spec/requirements-1.md`. Please review it — what would you like to change, or say 'looks good' to move on to the design?"

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

After writing, tell the user: "I've written `spec/design-1.md`. Please review it — what would you like to change, or say 'looks good' to move on to the task breakdown?"

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

After writing, tell the user: "I've written `spec/tasks-1.md`. Please review it — what would you like to change, or say 'looks good' to start implementation?"

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

**Completion**: Once all tasks are marked `[x]`, present a short summary: what was built, which tests pass, and any places where the implementation deviated from the confirmed spec. If there were deviations, ask: "Should I update the spec docs to reflect what was actually built?"

---

## Reference Files

- **`references/templates.md`** — Exact doc structures for all three phases + quality check checklists
- **`references/requirements-example.md`** — Annotated example requirements doc
- **`references/design-example.md`** — Annotated example design doc
- **`references/tasks-example.md`** — Annotated example task list
