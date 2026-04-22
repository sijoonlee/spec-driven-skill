import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DecisionNode from './DecisionNode'
import TerminatorNode from './TerminatorNode'
import IONode from './IONode'

vi.mock('@xyflow/react', async () => {
  const actual = await vi.importActual('@xyflow/react')
  return {
    ...actual,
    useReactFlow: () => ({ updateNodeData: vi.fn() }),
    Handle: ({ id }: { id: string }) => <div data-testid={`handle-${id}`} />,
    NodeResizer: () => null,
  }
})

const baseProps = {
  zIndex: 0,
  isConnectable: true,
  positionAbsoluteX: 0,
  positionAbsoluteY: 0,
  dragging: false,
  selected: false,
  draggable: true,
  selectable: true,
  deletable: true,
}

describe('DecisionNode', () => {
  it('renders with label text', () => {
    render(<DecisionNode id="n1" type="decision" data={{ label: 'Is ok?', shapeType: 'decision' }} width={140} height={80} {...baseProps} />)
    expect(screen.getByText('Is ok?')).toBeInTheDocument()
  })

  it('double-click shows inline input', () => {
    render(<DecisionNode id="n1" type="decision" data={{ label: 'Is ok?', shapeType: 'decision' }} width={140} height={80} {...baseProps} />)
    fireEvent.dblClick(screen.getByText('Is ok?').closest('svg')!)
    expect(screen.getByDisplayValue('Is ok?')).toBeInTheDocument()
  })
})

describe('TerminatorNode', () => {
  it('renders with label text', () => {
    render(<TerminatorNode id="n2" type="terminator" data={{ label: 'End', shapeType: 'terminator' }} width={120} height={60} {...baseProps} />)
    expect(screen.getByText('End')).toBeInTheDocument()
  })

  it('double-click shows inline input', () => {
    render(<TerminatorNode id="n2" type="terminator" data={{ label: 'End', shapeType: 'terminator' }} width={120} height={60} {...baseProps} />)
    fireEvent.dblClick(screen.getByText('End').closest('svg')!)
    expect(screen.getByDisplayValue('End')).toBeInTheDocument()
  })
})

describe('IONode', () => {
  it('renders with label text', () => {
    render(<IONode id="n3" type="io" data={{ label: 'Input', shapeType: 'io' }} width={140} height={60} {...baseProps} />)
    expect(screen.getByText('Input')).toBeInTheDocument()
  })

  it('double-click shows inline input', () => {
    render(<IONode id="n3" type="io" data={{ label: 'Input', shapeType: 'io' }} width={140} height={60} {...baseProps} />)
    fireEvent.dblClick(screen.getByText('Input').closest('svg')!)
    expect(screen.getByDisplayValue('Input')).toBeInTheDocument()
  })
})
