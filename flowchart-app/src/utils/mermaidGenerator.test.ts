import { describe, it, expect } from 'vitest'
import type { Node, Edge } from '@xyflow/react'
import type { FlowNodeData } from '../types/diagram'
import { generateMermaid } from './mermaidGenerator'

function makeNode(id: string, shapeType: FlowNodeData['shapeType'], label: string): Node<FlowNodeData> {
  return {
    id,
    type: shapeType,
    position: { x: 0, y: 0 },
    data: { label, shapeType },
  }
}

function makeEdge(id: string, source: string, target: string): Edge {
  return { id, source, target }
}

describe('generateMermaid', () => {
  it('empty canvas returns flowchart TD header only', () => {
    expect(generateMermaid([], [])).toBe('flowchart TD')
  })

  it('process node maps to rectangle syntax id["label"]', () => {
    const result = generateMermaid([makeNode('A', 'process', 'Start')], [])
    expect(result).toContain('A["Start"]')
  })

  it('decision node maps to diamond syntax id{"label"}', () => {
    const result = generateMermaid([makeNode('B', 'decision', 'Is done?')], [])
    expect(result).toContain('B{"Is done?"}')
  })

  it('terminator node maps to stadium syntax id(["label"])', () => {
    const result = generateMermaid([makeNode('C', 'terminator', 'End')], [])
    expect(result).toContain('C(["End"])')
  })

  it('io node maps to parallelogram syntax id[/"label"/]', () => {
    const result = generateMermaid([makeNode('D', 'io', 'Input data')], [])
    expect(result).toContain('D[/"Input data"/]')
  })

  it('edge maps to --> arrow between correct node ids', () => {
    const nodes = [makeNode('A', 'process', 'Start'), makeNode('B', 'process', 'End')]
    const edges = [makeEdge('e1', 'A', 'B')]
    expect(generateMermaid(nodes, edges)).toContain('A --> B')
  })

  it('multiple nodes and edges produce valid multi-line output', () => {
    const nodes = [
      makeNode('A', 'process', 'Start'),
      makeNode('B', 'decision', 'Check'),
      makeNode('C', 'terminator', 'End'),
    ]
    const edges = [makeEdge('e1', 'A', 'B'), makeEdge('e2', 'B', 'C')]
    const result = generateMermaid(nodes, edges)
    expect(result).toMatch(/^flowchart TD/)
    expect(result).toContain('A["Start"]')
    expect(result).toContain('B{"Check"}')
    expect(result).toContain('C(["End"])')
    expect(result).toContain('A --> B')
    expect(result).toContain('B --> C')
  })

  it('node label with double quotes is escaped correctly', () => {
    const result = generateMermaid([makeNode('A', 'process', 'Say "hello"')], [])
    expect(result).toContain('#quot;')
    expect(result).not.toContain('"hello"')
  })
})
