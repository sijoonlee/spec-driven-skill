# Tasks: React Flowchart Builder

---

## Task 1: Project Setup
**Feature**: Project foundation
**Requirement**: N/A (setup)

### Implementation
- [x] Scaffold project with `npm create vite@latest flowchart-app -- --template react-ts`
- [x] Install runtime dependencies: `@xyflow/react`, `@reactflow/node-resizer`, `mermaid`
- [x] Install dev dependencies: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@vitejs/plugin-react`, `jsdom`
- [x] Add test script to `package.json`: `"test": "vitest run"`
- [x] Add `test` config to `vite.config.ts`: `environment: 'jsdom'`, `globals: true`, `setupFiles: ['./src/setupTests.ts']`
- [x] Create `src/setupTests.ts` importing `@testing-library/jest-dom`
- [x] Create `src/types/diagram.ts` with placeholder export (filled in Task 2)

### Tests
- [x] Verify `npm install` completes without errors
- [x] Verify `npm test` runs without configuration errors (zero tests passing is fine)

---

## Task 2: Mermaid Generator Utility
**Feature**: Mermaid syntax generation
**Requirement**: US-5

### Implementation
- [x] Define types in `src/types/diagram.ts`:
  - `type ShapeType = 'process' | 'decision' | 'terminator' | 'io'`
  - `interface FlowNodeData { label: string; shapeType: ShapeType }`
- [x] Create `src/utils/mermaidGenerator.ts` exporting `generateMermaid(nodes, edges): string`
- [x] Map each ShapeType to Mermaid node syntax:
  - `process` → `id["label"]`
  - `decision` → `id{"label"}`
  - `terminator` → `id(["label"])`
  - `io` → `id[/"label"/]`
- [x] Map each edge to `sourceId --> targetId`
- [x] Output starts with `flowchart TD\n`
- [x] Return empty diagram string `flowchart TD\n` when nodes array is empty

### Tests
- [x] Write `src/utils/mermaidGenerator.test.ts`: unit tests for generator → verifies US-5
  - `'empty canvas returns flowchart TD header only'` → US-5 AC2
  - `'process node maps to rectangle syntax id["label"]'` → US-5 AC3
  - `'decision node maps to diamond syntax id{"label"}'` → US-5 AC3
  - `'terminator node maps to stadium syntax id(["label"])'` → US-5 AC3
  - `'io node maps to parallelogram syntax id[/"label"/]'` → US-5 AC3
  - `'edge maps to --> arrow between correct node ids'` → US-5 AC4
  - `'multiple nodes and edges produce valid multi-line output'` → US-5 AC2
  - `'node label with special characters is quoted correctly'` → US-5 AC2
- [x] Run `npm test` — all tests pass

---

## Task 3: Custom Shape Node Components
**Feature**: Shape rendering, resize, inline label editing
**Requirement**: US-2, US-3

### Implementation
- [x] Create `src/components/FlowCanvas/nodes/ProcessNode.tsx`:
  - Render a rectangle SVG shape sized to node width/height
  - Include `<NodeResizer minWidth={80} minHeight={50} />` from `@reactflow/node-resizer`
  - Show `data.label` as centered text inside the shape
  - On double-click, switch to an `<input>` with `autoFocus`; on blur or Enter commit the label via `useReactFlow().updateNodeData()`
  - Expose 4 `<Handle>` components (top, right, bottom, left) for connections
- [x] Repeat the same pattern for `DecisionNode.tsx` (diamond — SVG polygon), `TerminatorNode.tsx` (oval — SVG ellipse), `IONode.tsx` (parallelogram — SVG polygon)
- [x] Export `nodeTypes` object from `src/components/FlowCanvas/nodes/index.ts`: `{ process: ProcessNode, decision: DecisionNode, terminator: TerminatorNode, io: IONode }`

### Tests
- [x] Write `src/components/FlowCanvas/nodes/ProcessNode.test.tsx` → verifies US-2, US-3
  - `'renders with default label text'` → US-2 AC3
  - `'double-click activates inline input with current label'` → US-2 AC1
  - `'pressing Enter commits the new label'` → US-2 AC2
  - `'blur commits the new label'` → US-2 AC2
  - `'renders resize handles when selected'` → US-3 AC1
- [x] Write equivalent smoke-render tests for `DecisionNode`, `TerminatorNode`, `IONode` (renders with label, double-click shows input)
- [x] Run `npm test` — all tests pass

---

## Task 4: Shape Sidebar and Canvas Drop
**Feature**: Drag shapes from sidebar onto canvas
**Requirement**: US-1

### Implementation
- [x] Create `src/components/ShapeSidebar/DraggableShape.tsx`:
  - Renders a labeled tile representing one shape type
  - Sets `draggable` and on `dragStart` calls `event.dataTransfer.setData('shapeType', props.shapeType)`
- [x] Create `src/components/ShapeSidebar/ShapeSidebar.tsx`:
  - Renders 4 `<DraggableShape>` tiles: process, decision, terminator, io
- [x] Create `src/components/FlowCanvas/FlowCanvas.tsx`:
  - Wraps `<ReactFlow>` with `nodeTypes` from Task 3
  - Accepts `nodes`, `edges`, `onNodesChange`, `onEdgesChange` as props
  - On `onDrop`: reads `shapeType` from `dataTransfer`, computes canvas position via `screenToFlowPosition()`, appends a new node with default label and `width: 120, height: 60` to nodes
  - On `onDragOver`: calls `event.preventDefault()` to allow drop

### Tests
- [x] Write `src/components/ShapeSidebar/ShapeSidebar.test.tsx` → verifies US-1
  - `'renders exactly 4 shape tiles'` → US-1 AC1
  - `'each tile has draggable attribute'` → US-1 AC1
  - `'dragStart sets shapeType in dataTransfer for process shape'` → US-1 AC2
  - `'dragStart sets shapeType in dataTransfer for decision shape'` → US-1 AC2
- [x] Write `src/components/FlowCanvas/FlowCanvas.test.tsx` → verifies US-1
  - `'drop event with shapeType process creates a process node'` → US-1 AC2, AC3
  - `'dropped node appears with default label'` → US-1 AC3
  - `'dropping multiple shapes creates multiple nodes'` → US-1 AC2
- [x] Run `npm test` — all tests pass

---

## Task 5: Connector Drawing
**Feature**: Draw arrows between shapes
**Requirement**: US-4

### Implementation
- [x] In `FlowCanvas.tsx`, pass `onConnect` handler to `<ReactFlow>`:
  - Uses `addEdge` from `@xyflow/react` to append the new edge to edges state
- [x] Confirm `<Handle>` components in each node (added in Task 3) have correct `type="source"` and `type="target"` on all four sides so any port can initiate or receive a connection
- [x] Set `connectionMode={ConnectionMode.Loose}` on `<ReactFlow>` so any handle can connect to any other handle
- [x] Verify connectors re-route automatically (React Flow default behaviour — no extra work needed)

### Tests
- [x] Write additional cases in `src/components/FlowCanvas/FlowCanvas.test.tsx` → verifies US-4
  - `'onConnect handler adds an edge between two nodes'` → US-4 AC2
  - `'a node can have multiple edges connected to it'` → US-4 AC4
- [x] Run `npm test` — all tests pass

---

## Task 6: Output Panel and Mermaid Preview
**Feature**: Mermaid syntax display, copy to clipboard, rendered preview
**Requirement**: US-5, US-6

### Implementation
- [x] Create `src/components/OutputPanel/MermaidPreview.tsx`:
  - Accepts `mermaidText: string` prop
  - On mount and when `mermaidText` changes, calls `mermaid.render('preview', mermaidText)` and injects the returned SVG
  - If `mermaid.render` throws, displays `<p className="error">Invalid Mermaid syntax</p>` instead of crashing
- [x] Create `src/components/OutputPanel/OutputPanel.tsx`:
  - Accepts `mermaidText: string` prop
  - Renders a read-only `<textarea>` containing `mermaidText`
  - Renders a "Copy to clipboard" `<button>` that calls `navigator.clipboard.writeText(mermaidText)` and shows "Copied!" for 2 seconds
  - Renders `<MermaidPreview mermaidText={mermaidText} />`

### Tests
- [x] Write `src/components/OutputPanel/OutputPanel.test.tsx` → verifies US-5, US-6
  - `'displays mermaid syntax text in textarea'` → US-5 AC5
  - `'copy button writes text to clipboard'` → US-5 AC6
  - `'copy button shows Copied! confirmation after click'` → US-5 AC6
  - `'renders mermaid preview when valid syntax is provided'` → US-6 AC1
  - `'shows error message when mermaid syntax is invalid'` → US-6 AC4
- [x] Run `npm test` — all tests pass

---

## Task 7: App Integration and Layout
**Feature**: Full app wiring and layout
**Requirement**: US-1, US-5, US-6

### Implementation
- [x] In `src/App.tsx`:
  - Hold `nodes`, `edges` state using `useNodesState` / `useEdgesState` from `@xyflow/react`
  - Hold `mermaidText: string` state (empty initially)
  - Render layout: `<ShapeSidebar>` (left column) | `<FlowCanvas>` (centre) | `<OutputPanel>` (right column)
  - Render "Generate Mermaid" button in the header; on click call `generateMermaid(nodes, edges)` and set `mermaidText`
  - Pass `mermaidText` down to `<OutputPanel>`
- [x] Apply CSS (via `src/App.css`) for three-column layout: sidebar fixed width (~160px), canvas flex-grow, output panel fixed width (~360px)
- [x] Wrap `<FlowCanvas>` in `<ReactFlowProvider>` so `useReactFlow()` hooks work inside child components

### Tests
- [x] Write `src/App.test.tsx` → integration test verifying US-1, US-5, US-6
  - `'Generate Mermaid button is present on load'` → US-5 AC1
  - `'clicking Generate Mermaid with nodes produces non-empty mermaid text'` → US-5 AC2
  - `'clicking Generate Mermaid updates the output panel textarea'` → US-5 AC5
- [x] Run `npm test` — all tests pass

---

## Task Dependencies

| Task   | Depends On        |
|--------|-------------------|
| Task 2 | Task 1            |
| Task 3 | Task 1            |
| Task 4 | Task 1, Task 3    |
| Task 5 | Task 4            |
| Task 6 | Task 1, Task 2    |
| Task 7 | Task 2, Task 3, Task 4, Task 5, Task 6 |

---

## Requirements Traceability

| Requirement | Tasks          |
|-------------|----------------|
| US-1        | Task 4, Task 7 |
| US-2        | Task 3         |
| US-3        | Task 3         |
| US-4        | Task 5         |
| US-5        | Task 2, Task 6, Task 7 |
| US-6        | Task 6, Task 7 |

---

## Quality Check

- [x] One feature per task
- [x] Every task that adds behaviour has automated test code (no manual curl/verify steps)
- [x] Test files are named and test cases are described with quoted strings
- [x] Every test case maps to a US and AC
- [x] All 6 requirements appear in the traceability table
- [x] Tasks are 1–4 hours each
- [x] Dependencies respected: setup → data layer → components → integration
- [x] Setup task (Task 1) installs test framework and adds `npm test` script
