import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import OutputPanel from './OutputPanel'

vi.mock('./OutputPanel.css', () => ({}))

const { mockRender } = vi.hoisted(() => ({ mockRender: vi.fn() }))
vi.mock('mermaid', () => ({
  default: {
    initialize: vi.fn(),
    render: mockRender,
  },
}))

const validSyntax = 'flowchart TD\n  A["Start"]'
const invalidSyntax = 'not valid mermaid !!!'

beforeEach(() => {
  vi.clearAllMocks()
  mockRender.mockResolvedValue({ svg: '<svg></svg>' })
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    writable: true,
  })
})

describe('OutputPanel', () => {
  it('displays mermaid syntax text in textarea', () => {
    render(<OutputPanel mermaidText={validSyntax} />)
    expect(screen.getByRole('textbox')).toHaveValue(validSyntax)
  })

  it('copy button writes text to clipboard', async () => {
    render(<OutputPanel mermaidText={validSyntax} />)
    fireEvent.click(screen.getByText('Copy to clipboard'))
    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(validSyntax)
    )
  })

  it('copy button shows Copied! confirmation after click', async () => {
    render(<OutputPanel mermaidText={validSyntax} />)
    fireEvent.click(screen.getByText('Copy to clipboard'))
    await waitFor(() => expect(screen.getByText('Copied!')).toBeInTheDocument())
  })

  it('renders mermaid preview when valid syntax is provided', async () => {
    mockRender.mockResolvedValue({ svg: '<svg data-testid="mermaid-svg"></svg>' })
    render(<OutputPanel mermaidText={validSyntax} />)
    await waitFor(() => expect(mockRender).toHaveBeenCalledWith(expect.any(String), validSyntax))
  })

  it('shows error message when mermaid syntax is invalid', async () => {
    mockRender.mockRejectedValue(new Error('parse error'))
    render(<OutputPanel mermaidText={invalidSyntax} />)
    await waitFor(() =>
      expect(screen.getByText('Invalid Mermaid syntax')).toBeInTheDocument()
    )
  })
})
