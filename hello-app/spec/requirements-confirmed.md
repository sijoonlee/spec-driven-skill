# Requirements: Hello Express API

## Overview
A minimal Node.js Express server that exposes a single HTTP endpoint. The server responds to GET requests at `/hello` with a JSON payload.

## User Stories

### US-1: Fetch the hello endpoint
**As a** client (curl, browser, or HTTP client)
**I want** to send a GET request to `/hello`
**So that** I receive a JSON response confirming the service is alive

#### Acceptance Criteria
- [ ] `GET /hello` returns HTTP status 200
- [ ] Response body is `{ "message": "hi" }`
- [ ] Response has `Content-Type: application/json`

### US-2: Run the server
**As a** developer
**I want** to start the server with a single command
**So that** I can run it locally without manual configuration

#### Acceptance Criteria
- [ ] `npm start` starts the server
- [ ] Server listens on port 3000 by default
- [ ] Server logs the port it is listening on at startup

## Non-Functional Requirements
### Compatibility
- Runs on Node.js 18+

## Out of Scope
- Authentication or API keys
- HTTPS / TLS
- Other endpoints beyond GET /hello
- Database or persistence
- Environment-specific configuration beyond default port

## Quality Check
✓ All user stories have acceptance criteria
✓ Acceptance criteria are verifiable
✓ Non-functional requirements are specific (Node 18+, port 3000)
✓ Out-of-scope items explicitly listed
