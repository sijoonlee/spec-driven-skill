# Requirements Example: Annotated

Annotations are in `[ANNOTATION: ...]` blocks.

---

# Requirements: Hello Express API

## Overview
A minimal Node.js Express server that exposes a single HTTP endpoint. The server responds to GET requests at `/hello` with a JSON payload.

[ANNOTATION: Two sentences. Names the tech (Node.js Express), the scope (single endpoint), and the output (JSON payload). Avoids vague summaries like "a backend service".]

## User Stories

### US-1: Fetch the hello endpoint
**As a** client (curl, browser, or HTTP client)
**I want** to send a GET request to `/hello`
**So that** I receive a JSON response confirming the service is alive

#### Acceptance Criteria
- [ ] `GET /hello` returns HTTP status 200
- [ ] Response body is `{ "message": "hi" }`
- [ ] Response has `Content-Type: application/json`

[ANNOTATION: All three ACs are mechanically verifiable — status code, exact body, exact header. "Returns a response" would be bad. "Returns HTTP 200 with body `{ "message": "hi" }`" is good. The exact JSON shape is specified, not just "some JSON".]

### US-2: Run the server
**As a** developer
**I want** to start the server with a single command
**So that** I can run it locally without manual configuration

#### Acceptance Criteria
- [ ] `npm start` starts the server
- [ ] Server listens on port 3000 by default
- [ ] Server logs the port it is listening on at startup

[ANNOTATION: "npm start" is the exact command. "Port 3000" is the exact port. "Logs the port at startup" is observable. Compare to a bad AC: "server is easy to start" — that's subjective and untestable.]

## Non-Functional Requirements
### Compatibility
- Runs on Node.js 18+

[ANNOTATION: A specific version floor. "Runs on modern Node.js" is not a requirement — it's a hope. "Node.js 18+" is actionable.]

## Out of Scope
- Authentication or API keys
- HTTPS / TLS
- Other endpoints beyond GET /hello
- Database or persistence
- Environment-specific configuration beyond default port

[ANNOTATION: Each item is something a developer might reasonably add. "HTTPS / TLS" prevents someone from spending time on certificates. "Other endpoints" prevents scope creep mid-implementation. Explicit beats implicit.]

## Quality Check
✓ All user stories have acceptance criteria
✓ Acceptance criteria are verifiable (status codes, exact body, exact header)
✓ Non-functional requirements are specific (Node 18+, port 3000)
✓ Out-of-scope items explicitly listed
