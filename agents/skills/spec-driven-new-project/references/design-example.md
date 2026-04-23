# Design Example: Annotated

Annotations are in `[ANNOTATION: ...]` blocks.

---

# Architecture Design: Hello Express API

## System Architecture

```
Client (curl / browser)
        │
        │  GET /hello
        ▼
┌───────────────────┐
│   Express Server  │  src/index.js
│                   │
│  router.get(      │
│   '/hello', ...)  │
└───────────────────┘
        │
        │  200 { message: "hi" }
        ▼
      Client
```

[ANNOTATION: The diagram shows the full request/response cycle and names the file responsible (`src/index.js`). It doesn't show every internal detail — just enough to understand what exists and how it connects. For a single-file server, one box is correct; adding more boxes would be over-engineering the diagram.]

## Tech Stack

| Category | Choice | Rationale |
|----------|--------|-----------|
| Runtime | Node.js 18+ | Required by spec |
| Framework | Express 4 | Minimal, well-known, no unnecessary overhead for a single endpoint |
| Language | JavaScript (CommonJS) | No build step needed; keeps setup to just `npm install` |
| Testing | Jest + supertest | Jest is the standard Node test runner; supertest enables HTTP-level assertions without starting a real server |

[ANNOTATION: Every row has a rationale. "Required by spec" is a valid rationale (ties to a requirement). "No build step needed" explains why TypeScript was not chosen — it rules out a reasonable alternative. The testing row was added during the skill improvement cycle; it drives the setup task's `npm install` steps and the `npm test` script.]

## File Structure

```
hello-app/
├── package.json          – dependencies, start + test scripts
├── src/
│   └── index.js          – server entry: app, route, listen
└── src/
    └── index.test.js     – integration tests via supertest
```

[ANNOTATION: Test file location is explicit: `src/index.test.js` co-located with the source. This is a decision, not left to the implementer. File comments describe purpose in one phrase — "server entry: app, route, listen" tells you what's inside without opening the file.]

## Key Implementation Details

- Single file `src/index.js` — no router module needed at this scale
- Port read from `process.env.PORT` with fallback to `3000` (satisfies US-2 AC2, keeps it flexible for deployment)
- `console.log` on listen satisfies US-2 AC3
- `res.json()` sets `Content-Type: application/json` automatically (satisfies US-1 AC3) — no middleware needed

[ANNOTATION: Each bullet cites the requirement it satisfies. "Satisfies US-2 AC2" means an implementer can cross-check the design against the requirements doc. "No middleware needed" rules out a plausible wrong move (adding `express.json()` is a common reflex).]

## Quality Check
✓ Every design decision traces to a requirement
✓ No over-engineering: single file, no router module, no env library
✓ File structure is complete and includes test file locations
✓ Test framework chosen (Jest + supertest)
