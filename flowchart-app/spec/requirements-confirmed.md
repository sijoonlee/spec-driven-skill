# Requirements: React Flowchart Builder

## Project Overview

A client-side React web application that lets users build flowchart diagrams through a drag-and-drop interface. Users drag standard flowchart shapes onto a canvas, connect them with arrows, edit labels, resize shapes, export the result as valid Mermaid flowchart syntax, and preview the rendered Mermaid diagram to validate it against their canvas drawing. Initial version supports flowcharts only.

---

## User Stories

### US-1: Drag shapes onto the canvas
As a user, I want to drag pre-made flowchart shapes from a sidebar panel onto a canvas so that I can build a diagram visually.

**Acceptance Criteria:**
- The sidebar displays exactly 4 standard shapes: Process (rectangle), Decision (diamond), Terminator (oval), I/O (parallelogram)
- Dragging a shape from the sidebar and releasing it on the canvas places the shape at the drop position
- The placed shape immediately appears with a default label (e.g. "Process", "Decision")
- Shapes can be repositioned by dragging them on the canvas after placement

### US-2: Edit shape labels inline
As a user, I want to edit a shape's label directly on the canvas so that I can describe each step in my flowchart.

**Acceptance Criteria:**
- Double-clicking a shape activates an inline text input on the shape
- Pressing Enter or clicking outside the shape commits the label change
- The shape immediately displays the updated label
- Empty label is allowed (shape renders with no text)

### US-3: Resize shapes
As a user, I want to resize shapes on the canvas so that I can adjust layout and fit longer labels.

**Acceptance Criteria:**
- Selecting a shape reveals 8 resize handles (corners + edge midpoints)
- Dragging a handle resizes the shape in the corresponding direction
- Minimum shape size is enforced at 80×50px; shape cannot be dragged smaller
- Shape type is preserved during and after resize (a diamond stays a diamond)

### US-4: Draw connectors between shapes
As a user, I want to draw arrows between shapes so that I can show the flow between steps.

**Acceptance Criteria:**
- Hovering a shape reveals connection ports on its edges (top, right, bottom, left)
- Clicking a port and dragging to another shape's port creates a directional arrow connector
- Connectors re-route automatically when either connected shape is moved or resized
- A shape can have multiple connectors attached to it

### US-5: Generate Mermaid syntax
As a user, I want to generate Mermaid flowchart syntax from my diagram so that I can paste it into documentation.

**Acceptance Criteria:**
- A "Generate Mermaid" button is always visible in the UI
- Clicking it produces syntactically valid `flowchart TD` Mermaid syntax representing all shapes and connectors on the canvas
- Each shape maps to the correct Mermaid node syntax: `[text]` rectangle, `{text}` diamond, `([text])` oval, `[/text/]` parallelogram
- Each connector maps to `-->` arrow syntax between the correct node IDs
- The generated code is shown in a read-only text area with a "Copy to clipboard" button
- Clicking "Copy to clipboard" copies the text and shows a brief confirmation ("Copied!")

### US-6: Preview rendered Mermaid diagram
As a user, I want to see a rendered preview of the generated Mermaid diagram alongside my canvas drawing so that I can validate the output is correct.

**Acceptance Criteria:**
- When Mermaid syntax is generated (via the "Generate Mermaid" button), a rendered diagram preview is displayed in the same panel as the syntax text area
- The preview renders using the Mermaid library client-side — no external service is called
- The preview updates each time "Generate Mermaid" is clicked; it does not auto-update on every canvas edit
- If the generated syntax is invalid, the preview panel shows a clear error message instead of crashing
- The canvas and the preview are visible at the same time so the user can compare them side by side

---

## Non-Functional Requirements

| Category        | Requirement                                                                    |
|-----------------|--------------------------------------------------------------------------------|
| Performance     | Canvas supports ≥50 nodes and ≥100 connectors without frame drops below 30fps  |
| Load time       | Application loads and is interactive in ≤3 seconds on a modern desktop browser |
| Browser support | Latest stable versions of Chrome, Firefox, and Safari                          |
| Deployment      | Runs entirely client-side — no backend, no server-side rendering                |
| Accessibility   | Shape labels are readable at default zoom; color contrast meets WCAG AA         |

---

## Out of Scope (v1)

- Mermaid diagram types other than flowchart (sequence, class, state, ER, etc.)
- Changing a shape's type after it has been placed on the canvas
- Undo / redo
- Exporting the diagram as PNG, SVG, or PDF
- Saving or loading diagrams (localStorage or server)
- Multi-user / real-time collaboration
- Shape grouping or alignment guides
- Keyboard shortcuts for adding shapes
- Custom shape colors or styles
- Live / auto-updating Mermaid preview on every canvas edit

---

## Quality Check

- [x] Every acceptance criterion is observable or measurable (no "works correctly")
- [x] NFRs have specific numbers (fps, seconds, px)
- [x] Out-of-scope list explicitly addresses items a reader might assume are included
- [x] All 6 user stories map to the core idea in `idea.md`
