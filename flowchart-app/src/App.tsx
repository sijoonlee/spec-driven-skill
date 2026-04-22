import { useState, useCallback } from 'react'
import { ReactFlowProvider, useNodesState, useEdgesState, type Node, type Edge } from '@xyflow/react'
import ShapeSidebar from './components/ShapeSidebar/ShapeSidebar'
import FlowCanvas from './components/FlowCanvas/FlowCanvas'
import OutputPanel from './components/OutputPanel/OutputPanel'
import { generateMermaid } from './utils/mermaidGenerator'
import type { FlowNodeData } from './types/diagram'
import './App.css'

function FlowApp() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<FlowNodeData>>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [mermaidText, setMermaidText] = useState('')

  const handleGenerate = useCallback(() => {
    setMermaidText(generateMermaid(nodes, edges))
  }, [nodes, edges])

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-title">Flowchart Builder</span>
        <button className="generate-button" onClick={handleGenerate}>
          Generate Mermaid
        </button>
      </header>
      <div className="app-body">
        <ShapeSidebar />
        <FlowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          setNodes={setNodes}
          setEdges={setEdges}
        />
        <OutputPanel mermaidText={mermaidText} />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowApp />
    </ReactFlowProvider>
  )
}
