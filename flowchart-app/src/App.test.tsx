import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

vi.mock('./App.css', () => ({}))
vi.mock('./components/ShapeSidebar/ShapeSidebar.css', () => ({}))
vi.mock('./components/OutputPanel/OutputPanel.css', () => ({}))
vi.mock('@xyflow/react/dist/style.css', () => ({}))
vi.mock('@reactflow/node-resizer/dist/style.css', () => ({}))

const { mockMermaidRender } = vi.hoisted(() => ({ mockMermaidRender: vi.fn().mockResolvedValue({ svg: '<svg></svg>' }) }))
vi.mock('mermaid', () => ({
  default: { initialize: vi.fn(), render: mockMermaidRender },
}))

vi.mock('@xyflow/react', async () => {
  const actual = await vi.importActual('@xyflow/react')
  const { useState } = await import('react')
  return {
    ...actual,
    ReactFlowProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useReactFlow: () => ({ screenToFlowPosition: vi.fn((p: object) => p), updateNodeData: vi.fn() }),
    ReactFlow: ({ onDrop, onDragOver, nodes, children }: {
      onDrop: (e: React.DragEvent) => void
      onDragOver: (e: React.DragEvent) => void
      nodes: { id: string; data: { label: string } }[]
      children?: React.ReactNode
    }) => (
      <div data-testid="react-flow" onDrop={onDrop} onDragOver={onDragOver}>
        {nodes.map(n => <div key={n.id}>{n.data.label}</div>)}
        {children}
      </div>
    ),
    Background: () => null,
    Controls: () => null,
    addEdge: (conn: object, eds: object[]) => [...eds, conn],
    ConnectionMode: { Loose: 'loose' },
    useNodesState: (init: object[]) => {
      const [nodes, setNodes] = useState(init)
      return [nodes, setNodes, vi.fn()]
    },
    useEdgesState: (init: object[]) => {
      const [edges, setEdges] = useState(init)
      return [edges, setEdges, vi.fn()]
    },
  }
})

vi.mock('./components/FlowCanvas/nodes', () => ({ nodeTypes: {} }))

describe('App integration', () => {
  it('Generate Mermaid button is present on load', () => {
    render(<App />)
    expect(screen.getByText('Generate Mermaid')).toBeInTheDocument()
  })

  it('clicking Generate Mermaid with nodes produces non-empty mermaid text', () => {
    render(<App />)
    const canvas = screen.getByTestId('react-flow')
    fireEvent.drop(canvas, {
      dataTransfer: { getData: (k: string) => k === 'shapeType' ? 'process' : '' },
      clientX: 200, clientY: 200,
    })
    fireEvent.click(screen.getByText('Generate Mermaid'))
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textarea.value).toContain('flowchart TD')
  })

  it('clicking Generate Mermaid updates the output panel textarea', () => {
    render(<App />)
    fireEvent.click(screen.getByText('Generate Mermaid'))
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })
})
