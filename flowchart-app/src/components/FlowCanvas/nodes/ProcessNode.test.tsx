import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ProcessNode from './ProcessNode'

const mockUpdateNodeData = vi.fn()

vi.mock('@xyflow/react', async () => {
  const actual = await vi.importActual('@xyflow/react')
  return {
    ...actual,
    useReactFlow: () => ({ updateNodeData: mockUpdateNodeData }),
    Handle: ({ id }: { id: string }) => <div data-testid={`handle-${id}`} />,
    NodeResizer: ({ isVisible }: { isVisible: boolean }) =>
      isVisible ? <div data-testid="resizer" /> : null,
  }
})

function renderNode(label = 'Process', selected = false) {
  return render(
    <ProcessNode
      id="n1"
      data={{ label, shapeType: 'process' }}
      selected={selected}
      width={120}
      height={60}
      type="process"
      zIndex={0}
      isConnectable={true}
      positionAbsoluteX={0}
      positionAbsoluteY={0}
      dragging={false}
      draggable={true}
      selectable={true}
      deletable={true}
    />
  )
}

describe('ProcessNode', () => {
  it('renders with default label text', () => {
    renderNode('My Step')
    expect(screen.getByText('My Step')).toBeInTheDocument()
  })

  it('double-click activates inline input with current label', () => {
    renderNode('My Step')
    fireEvent.dblClick(screen.getByText('My Step').closest('svg')!)
    expect(screen.getByDisplayValue('My Step')).toBeInTheDocument()
  })

  it('pressing Enter commits the new label', () => {
    renderNode('Old')
    fireEvent.dblClick(screen.getByText('Old').closest('svg')!)
    const input = screen.getByDisplayValue('Old')
    fireEvent.change(input, { target: { value: 'New' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(mockUpdateNodeData).toHaveBeenCalledWith('n1', expect.objectContaining({ label: 'New' }))
  })

  it('blur commits the new label', () => {
    renderNode('Old')
    fireEvent.dblClick(screen.getByText('Old').closest('svg')!)
    const input = screen.getByDisplayValue('Old')
    fireEvent.change(input, { target: { value: 'Blurred' } })
    fireEvent.blur(input)
    expect(mockUpdateNodeData).toHaveBeenCalledWith('n1', expect.objectContaining({ label: 'Blurred' }))
  })

  it('renders resize handles when selected', () => {
    renderNode('X', true)
    expect(screen.getByTestId('resizer')).toBeInTheDocument()
  })
})
