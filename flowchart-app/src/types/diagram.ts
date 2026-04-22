export type ShapeType = 'process' | 'decision' | 'terminator' | 'io'

export interface FlowNodeData extends Record<string, unknown> {
  label: string
  shapeType: ShapeType
}
