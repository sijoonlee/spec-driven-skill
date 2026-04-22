import { useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  ConnectionMode,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  addEdge,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { nodeTypes } from './nodes'
import type { FlowNodeData, ShapeType } from '../../types/diagram'

let idCounter = 1
function nextId() { return `node_${idCounter++}` }

const DEFAULT_LABELS: Record<ShapeType, string> = {
  process: 'Process',
  decision: 'Decision',
  terminator: 'Terminator',
  io: 'I/O',
}

interface Props {
  nodes: Node<FlowNodeData>[]
  edges: Edge[]
  onNodesChange: OnNodesChange<Node<FlowNodeData>>
  onEdgesChange: OnEdgesChange
  setNodes: React.Dispatch<React.SetStateAction<Node<FlowNodeData>[]>>
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
}

export default function FlowCanvas({ nodes, edges, onNodesChange, onEdgesChange, setNodes, setEdges }: Props) {
  const { screenToFlowPosition } = useReactFlow()

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges(eds => addEdge(connection, eds)),
    [setEdges],
  )

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const shapeType = e.dataTransfer.getData('shapeType') as ShapeType
    if (!shapeType) return

    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })

    const newNode: Node<FlowNodeData> = {
      id: nextId(),
      type: shapeType,
      position,
      data: { label: DEFAULT_LABELS[shapeType], shapeType },
      width: shapeType === 'decision' ? 140 : 120,
      height: shapeType === 'decision' ? 80 : 60,
    }

    setNodes(nds => [...nds, newNode])
  }, [screenToFlowPosition, setNodes])

  return (
    <div style={{ flex: 1, height: '100%' }}>
      <ReactFlow
        nodes={nodes as Node[]}
        edges={edges}
        onNodesChange={onNodesChange as OnNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}
