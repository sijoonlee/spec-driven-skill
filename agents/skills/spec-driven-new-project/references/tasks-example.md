# Tasks Example: Annotated

Annotations are in `[ANNOTATION: ...]` blocks.

---

# Tasks: Hello Express API

## Task 1: Project Setup
**Feature**: Project foundation
**Requirement**: N/A (setup task)

[ANNOTATION: Setup tasks have no requirement mapping — note "N/A" explicitly rather than leaving it blank or forcing a mapping. This task's job is to install dependencies and establish the `npm test` script so every subsequent task can immediately write and run tests.]

### Implementation
- [ ] Create `package.json` with name, version `1.0.0`, `"start": "node src/index.js"` and `"test": "jest"` scripts
- [ ] Add `express` as a dependency
- [ ] Add `jest` and `supertest` as dev dependencies
- [ ] Run `npm install`
- [ ] Create `src/` directory

### Tests
- [ ] Verify: `npm install` completes without errors
- [ ] Verify: `npm test` runs without configuration errors (zero tests is fine at this stage)

[ANNOTATION: Setup tasks use smoke-test verifications rather than written test files — there's nothing to unit test yet. The key deliverable is that `npm test` works, so Task 2 can immediately write to it. If the test framework isn't installed in Task 1, Task 2 has nowhere to run tests.]

---

## Task 2: Implement GET /hello endpoint
**Feature**: Hello endpoint
**Requirement**: US-1, US-2

### Implementation
- [ ] Create `src/index.js`
- [ ] Require `express` and create app instance
- [ ] Register `GET /hello` route returning `res.json({ message: 'hi' })`
- [ ] Read port from `process.env.PORT` with fallback to `3000`
- [ ] Call `app.listen(port, ...)` with a `console.log` naming the port

### Tests
- [ ] Write `src/index.test.js`: HTTP-level tests for the /hello endpoint → verifies US-1, US-2
  - `'GET /hello returns 200'` → US-1 AC1
  - `'GET /hello returns { message: "hi" }'` → US-1 AC2
  - `'GET /hello responds with Content-Type application/json'` → US-1 AC3
  - `'server starts and logs the port'` → US-2 AC3
- [ ] Run `npm test` — all tests pass

[ANNOTATION: The test file path (`src/index.test.js`) is named explicitly. Each test case is a quoted string matching the `it('...')` description an implementer will write. Every case maps to a US + AC. "Verify: curl..." would be wrong here — tests must be automated code that runs with `npm test`, not manual steps.]

---

## Task Dependencies
| Task | Depends On |
|------|------------|
| Task 2 | Task 1 |

[ANNOTATION: Task 2 depends on Task 1 because `npm test` must work before Task 2 can write tests. Even for a two-task project, the dependency table is worth including — it makes the ordering intentional, not accidental.]

## Requirements Traceability
| Requirement | Tasks |
|-------------|-------|
| US-1 | Task 2 |
| US-2 | Task 2 |

[ANNOTATION: Every US must appear here. A requirement with no task is a gap — something was specified but never planned for implementation. In a larger project, a missing row here is a red flag.]

## Quality Check
✓ One feature per task
✓ Every task that adds behavior has automated test code (not manual steps)
✓ Test files are named and test cases are described
✓ All requirements covered (US-1, US-2 both appear in traceability table)
✓ Tasks are well under 1 hour each
✓ Dependencies respected (setup before implementation)
✓ Setup task installs test framework (jest, supertest) and adds `npm test` script
