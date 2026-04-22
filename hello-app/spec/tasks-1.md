# Tasks: Hello Express API

## Task 1: Project Setup
**Feature**: Project foundation
**Requirement**: N/A (setup task)

### Implementation
- [ ] Create `package.json` with name, version `1.0.0`, and `"start": "node src/index.js"` script
- [ ] Add `express` as a dependency
- [ ] Run `npm install`
- [ ] Create `src/` directory

### Test
- [ ] Verify: `npm install` completes without errors
- [ ] Verify: `node_modules/express` exists

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

### Test
- [ ] Verify: `npm start` starts without errors → verifies US-2 AC1
- [ ] Verify: server logs port 3000 at startup → verifies US-2 AC3
- [ ] Verify: `curl http://localhost:3000/hello` returns `{"message":"hi"}` → verifies US-1 AC1, AC2
- [ ] Verify: response includes `Content-Type: application/json` → verifies US-1 AC3

---

## Task Dependencies
| Task | Depends On |
|------|------------|
| Task 2 | Task 1 |

## Requirements Traceability
| Requirement | Tasks |
|-------------|-------|
| US-1 | Task 2 |
| US-2 | Task 2 |

## Quality Check
✓ One feature per task
✓ Every task has verifiable tests mapped to requirements
✓ All requirements covered
✓ Tasks are well under 1 hour each
✓ Dependencies respected (setup before implementation)
