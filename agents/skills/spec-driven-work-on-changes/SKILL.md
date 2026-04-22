---
name: spec-driven-work-on-changes
description: Use this skill whenever the user wants to add a new feature to an existing codebase, refactor existing code, or make a significant change to a service that already exists — and wants to plan it properly before writing code. Trigger phrases include: "add a feature to this service", "I want to refactor X", "plan this change before we implement it", "let's spec out this new feature", "write requirements for adding X", "design how to add Y to this service", "we need to change how Z works", or any situation where the user has existing code and wants to approach a change in a structured way. This skill is the right choice over spec-driven when code already exists — it starts by understanding what's there, then plans only the delta.
disable-model-invocation: true
---

# Spec-Driven Work on Changes

Five sequential phases. Each phase requires user confirmation before the next begins. Save all spec files to `spec/` in the project root — create this directory if it doesn't already exist.

```
Exploration → Change Requirements → Delta Design → Tasks → Implementation
```

Change spec files are single files overwritten on revision — no numbered drafts, no version suffixes:
- `spec/change-requirements.md`
- `spec/change-design.md`
- `spec/change-tasks.md`

This skill assumes the service already has spec docs produced by `reverse-spec` or `spec-driven` in `spec/`:
- `requirements-{version}.md` or `requirements-confirmed.md`
- `design-{version}.md` or `design-confirmed.md`

These are read as the baseline in Phase 1. If they don't exist, ask the user to run `reverse-spec` first before proceeding.

---

## Phase 1: Exploration

Before writing anything, understand two things: **what the user wants to change**, and **what the existing code does in the relevant area**.

Start by asking the user to describe the change they want to make. Two clarifying questions are usually enough:
- What is the goal of this change — is this a new capability users will see, or an improvement to internal structure?
- Are there any constraints (must not break X, must stay within Y, needs to ship by Z)?

Then read the existing spec docs from `spec/`:
1. Find `requirements-{version}.md` or `requirements-confirmed.md` — read it as the baseline picture of what the service does today
2. Find `design-{version}.md` or `design-confirmed.md` — read it for the current architecture, components, and data models

If neither file exists, stop and tell the user: "This skill expects existing spec docs in `spec/`. Please run `reverse-spec` first to document the current service, then come back here."

After reading, do a **targeted code exploration** focused only on the areas the change will touch — the existing spec docs give you the big picture, so you only need to read the specific files relevant to the change (affected handlers, data models, tests in that area).

Present a **Change Context Summary** in your response (not a file):

```
Change requested: <one sentence>
Change type: Feature addition | Refactor | Both

Baseline spec: <which file was read: requirements-X.md or requirements-confirmed.md>

Existing code affected:
  - [file or component — what it currently does]

Data models affected:
  - [model name — what changes]

Existing tests in this area:
  - [test file — what it covers]

Open questions before we write requirements:
  - [anything unclear that would block writing good requirements]
```

Ask: "Does this match your understanding of what needs to change? Anything to add before I write the requirements?"

**Gate: do not start Phase 2 until the user confirms.**

---

## Phase 2: Change Requirements

Read the confirmed change context and the existing spec docs. Write `spec/change-requirements.md`. Revisions overwrite this same file.

The requirements document only the **delta** — what changes, not the full system. Existing behavior is context, not content.

### User story framing by change type

**Feature addition** — frame around new user-visible behavior:
> "As a [user/caller], I want [new capability], so that [benefit]"
> Acceptance criteria: what the new behavior produces, what errors it handles, what it doesn't do

**Refactor** — frame around the improvement goal, not user-visible behavior:
> "As a developer, I want [structural change], so that [measurable improvement — e.g. 'response time drops below 200ms', 'test coverage increases from 40% to 80%', 'the module has a single responsibility']"
> Acceptance criteria: measurable before/after (performance metric, complexity metric, test count, etc.) + **all existing tests continue to pass**

**Mixed (new feature with internal restructuring)** — use both framings. Keep them in separate user stories.

### Document structure

```markdown
# Change Requirements: [short name for this change]

## Overview
[2-3 sentences: what is changing and why]

## Baseline
[Which spec doc was used as the baseline — e.g. "Based on requirements-2.40.3.md"]

## Change Type
Feature addition | Refactor | Both

## Out of Scope for This Change
[What is NOT changing — explicit. Prevents scope creep mid-implementation.]

## User Stories
[US-N: one per distinct behavior change or improvement goal]

## Non-Functional Requirements
[Only NFRs that change or that constrain this change — e.g. "must not increase p99 latency"]

## Regression Constraints
[Existing behaviors that must be preserved. These become the regression test baseline in Phase 4.]

## Quality Check
✓/✗ Every user story describes a delta, not existing behavior
✓/✗ Refactor stories have measurable acceptance criteria
✓/✗ Regression constraints are explicitly listed
✓/✗ Out-of-scope section prevents obvious scope creep
```

After writing, tell the user: "I've written `spec/change-requirements.md`. Please review it — what would you like to change, or say 'looks good' to move on to the design?"

Incorporate any feedback and overwrite the file. **Gate: do not start Phase 3 until the user confirms.**

---

## Phase 3: Delta Design

Read `spec/change-requirements.md` and the existing `design-{version}.md` or `design-confirmed.md`. Design only what changes — reference existing components by name rather than redrawing the whole system.

Write `spec/change-design.md`. Revisions overwrite this same file.

### Document structure

```markdown
# Delta Design: [short name for this change]

## Baseline
[Which design doc was used as the baseline — e.g. "Based on design-2.40.3.md"]

## What Changes
[Bulleted list: new files, modified files, deleted files, modified data models, new dependencies]

## What Stays the Same
[Explicitly name existing components this change does NOT touch — prevents unnecessary scope expansion]

## Architecture Impact
[ASCII diagram or description showing ONLY the changed portion and how it connects to existing components.
 Reference existing components by name (e.g. "→ existing CreditCardRepository") rather than redrawing them.]

## New / Modified Data Models
[TypeScript interfaces or equivalent for only the new or changed types.
 For modified models, show before → after if the change is to existing fields.]

## Integration Points
[How the new code connects to existing code: which existing functions are called, which are replaced,
 which new parameters are added to existing interfaces]

## Migration / Compatibility
[If the change affects stored data, API contracts, or published events:
 what migration is needed, whether the change is backward-compatible, and how to roll back if needed.
 Omit this section if there are no compatibility concerns.]

## File Changes
[Directory tree showing only new or modified files, annotated with what each does]

## Quality Check
✓/✗ Every design decision traces to a requirement in change-requirements.md
✓/✗ Existing components are referenced, not redrawn
✓/✗ New data models are specific enough to code from
✓/✗ Integration points are named (not just "connects to existing code")
✓/✗ Migration/compatibility section present if the change touches stored data or API contracts
```

After writing, tell the user: "I've written `spec/change-design.md`. Please review it — what would you like to change, or say 'looks good' to move on to the task breakdown?"

Incorporate any feedback and overwrite the file. **Gate: do not start Phase 4 until the user confirms.**

---

## Phase 4: Tasks

Read `spec/change-requirements.md` and `spec/change-design.md`. Write `spec/change-tasks.md`. Revisions overwrite this same file.

### Task ordering rules

Always start with a **regression baseline task**:
- Run the existing test suite and record how many tests pass
- This becomes the floor: implementation is not complete unless this count is maintained

Then order remaining tasks: setup (new deps, config) → data layer changes → core behavior changes → integration → new tests.

### Per-task structure

```markdown
## Task N: [Short title]
**Feature**: [Feature area or "Regression baseline" / "Setup"]
**Requirement**: [US-N, US-M] (or "N/A" for setup/baseline tasks)

### Implementation
- [ ] [Specific step]

### Tests
- [ ] Write `[test/file.test.ts]`: [what it covers] → verifies [US-N AC-M]
  - `'[test case description]'`
- [ ] Regression: run full test suite — pass count must be ≥ baseline
```

### Rules
- Tasks are 1–4 hours each, one concern per task
- Tests are automated test code — name the file and list specific test case descriptions
- Every new behavior has a test; every changed behavior has an updated test
- Regression check (`run full test suite — pass count ≥ baseline`) appears in every task that modifies existing code

End the document with a Task Dependencies table, Requirements Traceability table (covering only the change requirements), and Quality Check.

After writing, tell the user: "I've written `spec/change-tasks.md`. Please review it — what would you like to change, or say 'looks good' to start implementation?"

Incorporate any feedback and overwrite the file. **Gate: do not start Phase 5 until the user confirms.**

---

## Phase 5: Implementation

Work through `spec/change-tasks.md` top to bottom. For each task:
1. Implement the steps
2. Write and run the tests (`npm test` or equivalent)
3. Verify the regression baseline is maintained
4. Mark all steps and tests `[x]` in `change-tasks.md`
5. Report: what was built, test results, any deviations from spec
6. **Stop and wait for the user to confirm before starting the next task**

**Mid-implementation spec changes**: If a requirement or design decision needs to change, update `change-requirements.md` or `change-design.md` first, then update affected tasks in `change-tasks.md`, then continue. Never silently diverge from spec.

**Completion**: Once all tasks are marked `[x]`, present:
- What was built (one sentence per user story)
- Final test results (total passing, any new tests added)
- Any deviations from the confirmed spec
- Ask: "The baseline spec docs (`requirements-{version}.md` / `design-{version}.md`) describe the service before this change. Should I update them to reflect what was built?"

---

## How this skill relates to the others

| Situation | Skill to use |
|-----------|-------------|
| Documenting an existing service | `reverse-spec` |
| Building something new from scratch | `spec-driven` |
| Adding a feature or refactoring existing code | `spec-driven-work-on-changes` (this skill) |

The natural pipeline for a mature codebase: run `reverse-spec` once to create baseline docs, then use `spec-driven-work-on-changes` for every subsequent change.
