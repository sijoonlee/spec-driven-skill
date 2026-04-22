# Architecture Design: React Flowchart Builder

## System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        Browser (SPA)                             │
│                                                                  │
│  ┌─────────────┐  ┌──────────────────────┐  ┌────────────────┐  │
│  │   Shape     │  │    Flow Canvas        │  │ Output Panel   │  │
│  │   Sidebar   │  │  (@xyflow/react)      │  │                │  │
│  │             │  │                       │  │ ┌────────────┐ │  │
│  │ [Process]   │──▶  nodes[]  edges[]     │  │ │ Text Area  │ │  │
│  │ [Decision]  │  │    │         │        │  │ │ (Mermaid   │ │  │
│  │ [Terminal]  │  │    ▼         ▼        │  │ │  syntax)   │ │  │
│  │ [I/O]       │  │  Custom   Default     │  │ └────────────┘ │  │
│  └─────────────┘  │  Nodes    Edges       │  │ [Copy] [Gen.]  │  │
│                   └──────────┬───────────┘  │ ┌────────────┐ │  │
│                              │ Generate      │ │  Mermaid   │ │  │
│                              └──────────────▶│ │  Preview   │ │  │
│                                             │ └────────────┘ │  │
│                                             └────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                    (No backend — fully client-side)
```

---

## Tech Stack

| Category   | Choice                     | Rationale                                                                                      |
|------------|----------------------------|------------------------------------------------------------------------------------------------|
| Framework  | React 18                   | Required by spec; component model fits the sidebar + canvas + panel layout                    |
| Build      | Vite + TypeScript          | Fast dev server; TypeScript gives type safety for complex node/edge models                    |
| Canvas     | @xyflow/react (React Flow) | Purpose-built for node-based diagrams; handles DnD, connections, custom nodes, and resize out of the box — avoids rebuilding all of this from scratch |
| Node resize| @reactflow/node-resizer    | Official React Flow plugin; adds 8 resize handles with min-size enforcement (satisfies US-3)  |
| Mermaid    | mermaid (npm)              | Client-side Mermaid rendering with no external service call (satisfies US-6 AC2)              |
| Styling    | Plain CSS Modules          | No extra dependencies; sufficient scope for this app                                           |
| Testing    | Vitest + @testing-library/react | Native Vite integration; fast; React-friendly; `jsdom` environment for DOM assertions   |

---

## Component Hierarchy

```
App
├── ShapeSidebar
│   ├── DraggableShape (type="process")
│   ├── DraggableShape (type="decision")
│   ├── DraggableShape (type="terminator")
│   └── DraggableShape (type="io")
├── FlowCanvas                         ← owns nodes[] and edges[] state
│   ├── ProcessNode   (custom node)
│   ├── DecisionNode  (custom node)
│   ├── TerminatorNode(custom node)
│   └── IONode        (custom node)
└── OutputPanel
    ├── MermaidTextArea  (read-only)
    ├── CopyButton
    └── MermaidPreview
```

State lives in `App` as `nodes` and `edges` (React Flow's state shape). `OutputPanel` receives `mermaidText` string derived on button click. No external state library needed at this scale.

---

## Key Data Models

```typescript
// src/types/diagram.ts

type ShapeType = 'process' | 'decision' | 'terminator' | 'io';

// Extends React Flow's Node type
interface FlowNodeData {
  label: string;
  shapeType: ShapeType;
}

// React Flow node (position, id, type are React Flow fields)
// Full type: Node<FlowNodeData> from @xyflow/react

// React Flow edge — uses default Edge type from @xyflow/react
// sourceHandle / targetHandle: 'top' | 'right' | 'bottom' | 'left'

// Mermaid node syntax per shape type:
//   process    → id["label"]        (rectangle)
//   decision   → id{"label"}        (diamond)
//   terminator → id(["label"])       (stadium/oval)
//   io         → id[/"label"/]      (parallelogram)
// Connector    → sourceId --> targetId
```

---

## Data Flow

```
1. User drags DraggableShape from sidebar
        │  drag event carries { shapeType }
        ▼
2. FlowCanvas.onDrop → creates new Node<FlowNodeData>
        │  appended to nodes[] state
        ▼
3. Node renders as custom shape component (SVG polygon/ellipse)
   NodeResizer plugin adds resize handles → enforces 80×50px min (US-3)
   Double-click → inline label edit (US-2)
   Port hover → shows connection handles (US-4)

4. User drags port → React Flow creates Edge → appended to edges[]

5. User clicks "Generate Mermaid"
        │
        ▼
   mermaidGenerator(nodes, edges) → string
        │  pure function, easily testable
        ▼
6. OutputPanel receives mermaidText string
   ├── displays in <textarea> with Copy button (US-5)
   └── passes to MermaidPreview → mermaid.render() → SVG (US-6)
```

---

## UI Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│  React Flowchart Builder                    [Generate Mermaid]  │
├────────────────┬────────────────────────────────────────────────┤
│  Shapes        │                                                │
│  ┌──────────┐  │              Canvas                           │
│  │ Process  │  │                                               │
│  └──────────┘  │       ┌──────────┐        ┌────────┐         │
│  ┌──────────┐  │       │  Start   │──────▶ │Process │         │
│  │ Decision │  │       └──────────┘        └────────┘         │
│  └──────────┘  │                                               │
│  ┌──────────┐  │                                               │
│  │Terminator│  │                                               │
│  └──────────┘  ├───────────────────────────────────────────────┤
│  ┌──────────┐  │  Mermaid Syntax            │  Preview         │
│  │   I/O    │  │  ┌─────────────────────┐  │  ┌────────────┐  │
│  └──────────┘  │  │ flowchart TD        │  │  │ [rendered  │  │
│                │  │   A["Start"]        │  │  │  diagram]  │  │
│                │  │   A --> B           │  │  │            │  │
│                │  │   B["Process"]      │  │  └────────────┘  │
│                │  └─────────────────────┘  │                  │
│                │  [Copy to clipboard]       │                  │
└────────────────┴───────────────────────────────────────────────┘
```

---

## File Structure

```
flowchart-app/
├── index.html
├── package.json                        – dependencies + scripts (dev, build, test)
├── vite.config.ts
├── tsconfig.json
├── src/
│   ├── main.tsx                        – React root mount
│   ├── App.tsx                         – layout, nodes/edges state, Generate handler
│   ├── App.test.tsx                    – integration: drop shape → node appears
│   ├── types/
│   │   └── diagram.ts                  – ShapeType, FlowNodeData
│   ├── components/
│   │   ├── ShapeSidebar/
│   │   │   ├── ShapeSidebar.tsx        – sidebar container
│   │   │   ├── ShapeSidebar.test.tsx   – renders 4 shapes, drag event carries shapeType
│   │   │   └── DraggableShape.tsx      – single draggable shape tile
│   │   ├── FlowCanvas/
│   │   │   ├── FlowCanvas.tsx          – ReactFlow wrapper, onDrop, nodeTypes
│   │   │   ├── FlowCanvas.test.tsx     – drop creates node, port drag creates edge
│   │   │   └── nodes/
│   │   │       ├── ProcessNode.tsx     – rectangle SVG + NodeResizer + inline edit
│   │   │       ├── DecisionNode.tsx    – diamond SVG + NodeResizer + inline edit
│   │   │       ├── TerminatorNode.tsx  – oval SVG + NodeResizer + inline edit
│   │   │       └── IONode.tsx          – parallelogram SVG + NodeResizer + inline edit
│   │   └── OutputPanel/
│   │       ├── OutputPanel.tsx         – text area + copy + preview container
│   │       ├── OutputPanel.test.tsx    – shows syntax, copy works, preview renders/errors
│   │       └── MermaidPreview.tsx      – calls mermaid.render(), shows error on invalid
│   └── utils/
│       ├── mermaidGenerator.ts         – pure fn: nodes[] + edges[] → Mermaid string
│       └── mermaidGenerator.test.ts    – unit tests for all shape types + edge cases
```

---

## Open Questions Resolved

| Question | Decision |
|---|---|
| Canvas library choice | @xyflow/react — avoids re-implementing drag, connect, resize; well-maintained |
| SVG vs HTML Canvas | SVG via React Flow — easier per-element event handling for click, double-click, hover |
| State management | useState in App — diagram is small enough; no Zustand/Redux needed |
| Mermaid preview trigger | On button click only — avoids re-rendering on every keystroke/drag (out of scope per US-6 AC3) |
| Test framework | Vitest + @testing-library/react — native Vite integration, no extra config |
| TypeScript | Yes — FlowNodeData model has enough fields that type errors would be easy to introduce |

---

## Quality Check

- [x] Every design decision traces to a requirement
- [x] Tech stack table includes a Testing row
- [x] Data models have field names and types — specific enough to code from
- [x] File structure includes test file locations
- [x] No over-engineering — no global state library, no custom DnD, no backend
