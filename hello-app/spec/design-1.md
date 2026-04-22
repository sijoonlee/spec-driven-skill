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

## Tech Stack

| Category | Choice | Rationale |
|----------|--------|-----------|
| Runtime | Node.js 18+ | Required by spec |
| Framework | Express 4 | Minimal, well-known, no unnecessary overhead for a single endpoint |
| Language | JavaScript (CommonJS) | No build step needed; keeps setup to just `npm install` |

## File Structure

```
hello-app/
├── package.json      – name, version, "start" script, express dependency
├── src/
│   └── index.js      – server entry: creates app, registers route, listens
└── spec/
    └── ...
```

## Key Implementation Details

- Single file `src/index.js` — no need for a router module at this scale
- Port read from `process.env.PORT` with fallback to `3000` (satisfies US-2 AC2 and keeps it flexible)
- `console.log` on listen to satisfy US-2 AC3
- `express.json()` middleware not required (no request body), but `res.json()` sets `Content-Type: application/json` automatically (satisfies US-1 AC3)

## Quality Check
✓ Every design decision traces to a requirement
✓ No over-engineering: single file, no router module, no env library
✓ File structure is complete and matches implementation scope
