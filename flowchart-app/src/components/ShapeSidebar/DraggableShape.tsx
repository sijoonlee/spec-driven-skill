import type { ShapeType } from '../../types/diagram'

const LABELS: Record<ShapeType, string> = {
  process: 'Process',
  decision: 'Decision',
  terminator: 'Terminator',
  io: 'I/O',
}

interface Props {
  shapeType: ShapeType
}

export default function DraggableShape({ shapeType }: Props) {
  function onDragStart(e: React.DragEvent) {
    e.dataTransfer.setData('shapeType', shapeType)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="draggable-shape"
      data-shape-type={shapeType}
    >
      {LABELS[shapeType]}
    </div>
  )
}
