import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ShapeSidebar from './ShapeSidebar'

vi.mock('./ShapeSidebar.css', () => ({}))

describe('ShapeSidebar', () => {
  it('renders exactly 4 shape tiles', () => {
    render(<ShapeSidebar />)
    expect(screen.getAllByRole('generic').filter(el => el.classList.contains('draggable-shape'))).toHaveLength(4)
  })

  it('each tile has draggable attribute', () => {
    const { container } = render(<ShapeSidebar />)
    const tiles = container.querySelectorAll('.draggable-shape')
    tiles.forEach(tile => expect(tile).toHaveAttribute('draggable', 'true'))
  })

  it('dragStart sets shapeType in dataTransfer for process shape', () => {
    render(<ShapeSidebar />)
    const process = screen.getByText('Process')
    const setData = vi.fn()
    fireEvent.dragStart(process, { dataTransfer: { setData, effectAllowed: '' } })
    expect(setData).toHaveBeenCalledWith('shapeType', 'process')
  })

  it('dragStart sets shapeType in dataTransfer for decision shape', () => {
    render(<ShapeSidebar />)
    const decision = screen.getByText('Decision')
    const setData = vi.fn()
    fireEvent.dragStart(decision, { dataTransfer: { setData, effectAllowed: '' } })
    expect(setData).toHaveBeenCalledWith('shapeType', 'decision')
  })
})
