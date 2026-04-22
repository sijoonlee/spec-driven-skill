---
name: reverse-spec
description: Use this skill whenever the user wants to understand, document, or produce a written spec for an existing service or codebase — even if they don't use the word "spec". Trigger phrases include: "document this service", "what does this service do", "generate requirements from code", "reverse-engineer the spec", "write a design doc for existing code", "create a requirements doc for this", "spec out what's already built", "write up what this does", "produce a spec from the source", or any variation of wanting structured documentation derived from reading code rather than planning new features. This skill reads the codebase and produces versioned requirements and design documents in the same format used by spec-driven development.
disable-model-invocation: true
---

# Reverse Spec: Document an Existing Service

Three sequential phases. Each phase requires user confirmation before the next begins. Save all spec files to `spec/` in the service root (create it if it doesn't exist).

```
Exploration → Requirements → Design
```

Requirements and design are each a single versioned file named after the service version in `package.json` (e.g. `requirements-2.40.3.md`, `design-2.40.3.md`). Revisions overwrite the same file — there is no separate confirmed copy.

---

## Phase 1: Exploration

Read the service thoroughly before writing anything. Work through these in order:

1. **`package.json`** (or equivalent manifest) — service name, version, scripts, runtime dependencies, dev dependencies. If there is no `package.json`, look for `pom.xml`, `go.mod`, `setup.py`, `Cargo.toml`, or similar to find the service name and version.
2. **Entry point** — `src/index.ts` or `src/service.ts`; find `runService`, `initHandler`, or `initService` calls to understand how the service is bootstrapped and what routes/events/jobs/workers it registers.
3. **Route handlers** — for each route, note: HTTP method, path, request shape, response shape, auth requirements. If there are more than 6 route handler files, read them all if they are short; otherwise read a representative sample (at least 3–4 covering different patterns) and note in the summary that sampling was done.
4. **Event handlers** — for each event subscription, note: event name, payload shape, side effects.
5. **Job handlers** — for each job, note: job name, trigger mechanism, what it does.
6. **Workers** — for each worker, note: name, what it does continuously.
7. **`config.ts`** (or equivalent) — every env var, its type, and its default value.
8. **Data models** — TypeScript interfaces, types, Mongoose schemas, Postgres table definitions.
9. **`__tests__/`** — scan test files to discover: what behaviors are explicitly tested, what edge cases are covered, what external dependencies are mocked (mocks reveal integration points).
10. **`README.md`** or any other docs — pre-existing documentation.

After reading, present an **Exploration Summary** in your response (not a file):

```
Service: <name> v<version>
Purpose: <2-3 sentences>

Capabilities:
  Routes:  [METHOD /path — what it does]
  Events:  [event.name — what it does]
  Jobs:    [job-name — what it does]
  Workers: [worker-name — what it does]

Data entities: [list]
External dependencies: [DBs, services, APIs]
Config surface: [key env vars and defaults]
```

Then ask: "Does this match your understanding? Anything to add or correct before I write the requirements?"

**Gate: do not start Phase 2 until the user confirms the exploration summary.**

---

## Phase 2: Requirements

Re-read specific source files as needed to verify behavior before writing. Every user story must trace to observed behavior in the code.

Create `spec/` in the service root if it doesn't already exist. Write `spec/requirements-<version>.md` (e.g. `spec/requirements-2.40.3.md`) using the structure below.

### User story framing by capability type

- **HTTP route** → "As a [API caller / client service], I want to [call METHOD /path], so that [effect or data returned]"
- **Event subscription** → "As a [system that depends on the side effect], I want [event.name to trigger X], so that [downstream benefit]"
- **Job** → "As an [operator / scheduler], I want [job-name to run], so that [outcome]"
- **Worker** → "As a [system / operator], I want [worker-name to run continuously], so that [ongoing benefit]"

### Acceptance criteria rules

- Derived from actual code behavior — what inputs produce what outputs, what side effects occur, what errors are caught
- Must be mechanically verifiable: status codes, exact field names, specific conditions — not "works correctly"
- If the code has a bug or inconsistency, add a `## Discrepancies` section noting it rather than documenting broken behavior as a requirement
- Mark inferred items with `[inferred]` when not explicitly enforced in code but implied by tech choice or convention

### NFR sources

- Response time or rate limits from config or middleware
- Port, timeout, retry settings from `config.ts`
- Runtime version from `.nvmrc`, `package.json` engines, or equivalent
- Auth requirements from middleware applied to routes

### Out-of-scope guidance

List what the service explicitly does NOT do — inferred from absent functionality, TODO comments, or clear boundaries in the code.

---

End the document with a **Quality Check** section:

```
✓/✗ All capabilities have a user story
✓/✗ Acceptance criteria are verifiable (not subjective)
✓/✗ NFRs have measurable thresholds where visible in code/config
✓/✗ Out-of-scope items explicitly listed
✓/✗ Discrepancies section present if any bugs/inconsistencies were found
```

After writing, tell the user: "I've written `spec/requirements-<version>.md`. Please review it — what would you like to change, or say 'looks good' to move on to the design?"

Incorporate any feedback and overwrite the file. **Gate: do not start Phase 3 until the user confirms.**

---

## Phase 3: Design

Read `spec/requirements-<version>.md` and specific source files again as needed. Document what IS — not what should be. This is reverse-documentation, not a redesign.

Write `spec/design-<version>.md` (same version as requirements, e.g. `spec/design-2.40.3.md`) using the structure below.

### System Architecture

ASCII diagram showing: external callers → this service's entry point → internal components → external dependencies (DBs, downstream services, queues). Name the actual files responsible for each box.

### Tech Stack

Table with one row per category. Pull versions from the manifest file. Rationale must cite a requirement or explain the actual reason the choice exists.

| Category | Choice | Rationale |
|----------|--------|-----------|
| Runtime  | ...    | ...       |
| Framework| ...    | ...       |
| Database | ...    | ...       |
| Testing  | ...    | ...       |

### Component Design

**Component Hierarchy** — tree or ASCII diagram of key source files and what each owns.

**Key Data Models** — TypeScript interfaces/types exactly as they appear in the code. Do not clean up field names or invent missing fields. Note `[inferred shape]` only if a type is untyped in the source.

### Data Flow

Sequence or flow diagram for the most important operation (e.g. the primary route or most complex job). Show request → handler → DB/service calls → response.

### File Structure

Actual directory tree annotated with one-phrase descriptions per file. Must match what is on disk — do not include files that do not exist.

### Notable Decisions / Deviations

Note anything in the actual structure that deviates from standard conventions for the tech stack, or from patterns described in a `CLAUDE.md` file if one is present in the repo. These are observations for future readers, not prescriptions to fix now.

---

End with a **Quality Check** section:

```
✓/✗ Every design element traces to a requirement or an observed code fact
✓/✗ File structure matches what actually exists on disk
✓/✗ Data models match actual TypeScript types
✓/✗ Tech stack table includes a Testing row
✓/✗ Notable Decisions / Deviations section present if any deviations found
```

After writing, tell the user: "I've written `spec/design-<version>.md`. Please review it — what would you like to change, or say 'looks good' to finish."

Incorporate any feedback and overwrite the file.

---

## Output

After both phases are confirmed, `spec/` will contain:

- `requirements-<version>.md` — what the service does and for whom
- `design-<version>.md` — how it does it

These files are compatible with the `spec-driven` skill: they can be used directly as input to `spec-driven` Phase 3 (Tasks) if the user wants to plan improvements or refactors.
