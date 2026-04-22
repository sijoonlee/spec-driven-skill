import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({ startOnLoad: false, theme: 'default' })

let renderCount = 0

interface Props {
  mermaidText: string
}

export default function MermaidPreview({ mermaidText }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mermaidText || !containerRef.current) return

    const id = `mermaid-preview-${++renderCount}`
    mermaid.render(id, mermaidText)
      .then(({ svg }) => {
        if (containerRef.current) containerRef.current.innerHTML = svg
      })
      .catch(() => {
        if (containerRef.current) {
          containerRef.current.innerHTML = '<p class="mermaid-error">Invalid Mermaid syntax</p>'
        }
      })
  }, [mermaidText])

  if (!mermaidText) return null

  return <div ref={containerRef} className="mermaid-preview" />
}
