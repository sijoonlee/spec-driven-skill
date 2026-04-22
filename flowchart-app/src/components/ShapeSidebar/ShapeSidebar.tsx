import DraggableShape from './DraggableShape'
import './ShapeSidebar.css'

export default function ShapeSidebar() {
  return (
    <aside className="shape-sidebar">
      <p className="sidebar-title">Shapes</p>
      <DraggableShape shapeType="process" />
      <DraggableShape shapeType="decision" />
      <DraggableShape shapeType="terminator" />
      <DraggableShape shapeType="io" />
    </aside>
  )
}
