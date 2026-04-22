# Spec Document Templates

## requirements-N.md

```markdown
# Requirements: [Project Name]

## Overview
[2-3 sentence summary]

## User Stories

### US-N: [Title]
**As a** [role]
**I want** [capability]
**So that** [benefit]

#### Acceptance Criteria
- [ ] [Specific, verifiable criterion]

## Non-Functional Requirements
### Performance / Security / Scalability / Availability
- [Threshold-backed requirement]

## Out of Scope
- [Explicit exclusion]

## Quality Check
✓/✗ All user stories have acceptance criteria
✓/✗ Acceptance criteria are verifiable (not subjective)
✓/✗ NFRs have measurable thresholds
✓/✗ Out-of-scope items explicitly listed
```

---

## design-N.md

```markdown
# Architecture Design: [Project Name]

## System Architecture
[ASCII diagram]

## Tech Stack
| Category | Choice | Rationale |
|----------|--------|-----------|
| Runtime  | ...    | ...       |
| Framework| ...    | ...       |
| Testing  | ...    | ...       |

## Component Design
### Component Hierarchy
[Tree or ASCII diagram]

### Key Data Models
[Typed interfaces / structs]

## Data Flow
[Sequence or flow diagram if relevant]

## UI Wireframes
[ASCII wireframes for key screens — omit if no UI]

## File Structure
[Directory tree including test file locations]

## Summary
[Key decisions made and open questions resolved]
```

---

## tasks-N.md

### Per-task structure

```markdown
## Task N: [Short title]
**Feature**: [Feature area]
**Requirement**: [US-N, US-M, ...] (or "N/A" for setup)

### Implementation
- [ ] [Specific step]

### Tests
- [ ] Write `[test/file.test.ts]`: [what it covers] → verifies [US-N AC-M]
  - `[test case: 'description of what is asserted']`
- [ ] Run `npm test` — all tests pass
```

### Closing sections

```markdown
## Task Dependencies
| Task | Depends On |
|------|------------|
| Task 2 | Task 1 |

## Requirements Traceability
| Requirement | Tasks |
|-------------|-------|
| US-1 | Task 2, Task 3 |

## Quality Check
✓/✗ One feature per task
✓/✗ Every task that adds behavior has automated test code
✓/✗ Test files are named and test cases are described
✓/✗ All requirements covered by at least one task
✓/✗ Tasks are 1-4 hours each
✓/✗ Dependencies respected in ordering
✓/✗ Setup task installs test framework and adds `npm test` script
```
