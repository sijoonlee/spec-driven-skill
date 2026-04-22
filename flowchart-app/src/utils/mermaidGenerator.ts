import type { Node, Edge } from '@xyflow/react'
import type { FlowNodeData, ShapeType } from '../types/diagram'

function nodeToMermaid(id: string, shapeType: ShapeType, label: string): string {
  const safe = label.replace(/"/g, '#quot;')
  switch (shapeType) {
    case 'process':    return `  ${id}["${safe}"]`
    case 'decision':   return `  ${id}{"${safe}"}`
    case 'terminator': return `  ${id}(["${safe}"])`
    case 'io':         return `  ${id}[/"${safe}"/]`
  }
}

export function generateMermaid(
  nodes: Node<FlowNodeData>[],
  edges: Edge[],
): string {
  const lines: string[] = ['flowchart TD']

  for (const node of nodes) {
    lines.push(nodeToMermaid(node.id, node.data.shapeType, node.data.label))
  }

  for (const edge of edges) {
    lines.push(`  ${edge.source} --> ${edge.target}`)
  }

  return lines.join('\n')
}
