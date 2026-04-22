import { useState, useRef, useEffect } from 'react'
import { Handle, Position, useReactFlow, type Node, type NodeProps } from '@xyflow/react'
import { NodeResizer } from '@xyflow/react'
import type { FlowNodeData } from '../../../types/diagram'

type Props = NodeProps<Node<FlowNodeData>>

export default function DecisionNode({ id, data, selected, width = 140, height = 80 }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(data.label)
  const inputRef = useRef<HTMLInputElement>(null)
  const { updateNodeData } = useReactFlow()

  useEffect(() => { setDraft(data.label) }, [data.label])
  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

  function commitLabel() {
    setEditing(false)
    updateNodeData(id, { ...data, label: draft })
  }

  const w = width ?? 140
  const h = height ?? 80
  const cx = w / 2
  const cy = h / 2
  const points = `${cx},0 ${w},${cy} ${cx},${h} 0,${cy}`

  return (
    <>
      <NodeResizer isVisible={selected} minWidth={80} minHeight={50} />
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Left} id="left" />

      <svg width={w} height={h} onDoubleClick={() => setEditing(true)} style={{ display: 'block', overflow: 'visible' }}>
        <polygon points={points} fill="#fff" stroke="#555" strokeWidth={1.5} />
        {editing ? (
          <foreignObject x={cx / 2} y={cy / 2} width={cx} height={cy}>
            <input
              ref={inputRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onBlur={commitLabel}
              onKeyDown={e => e.key === 'Enter' && commitLabel()}
              style={{ width: '100%', height: '100%', border: 'none', outline: 'none', textAlign: 'center', fontSize: 12 }}
            />
          </foreignObject>
        ) : (
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={12} fill="#1a1a1a">
            {data.label}
          </text>
        )}
      </svg>
    </>
  )
}
