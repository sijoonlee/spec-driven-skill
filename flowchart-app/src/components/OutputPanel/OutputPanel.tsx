import { useState } from 'react'
import MermaidPreview from './MermaidPreview'
import './OutputPanel.css'

interface Props {
  mermaidText: string
}

export default function OutputPanel({ mermaidText }: Props) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(mermaidText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <aside className="output-panel">
      <div className="output-section">
        <p className="output-title">Mermaid Syntax</p>
        <textarea
          readOnly
          className="mermaid-textarea"
          value={mermaidText}
          placeholder="Click 'Generate Mermaid' to see the output"
        />
        <button
          className="copy-button"
          onClick={handleCopy}
          disabled={!mermaidText}
        >
          {copied ? 'Copied!' : 'Copy to clipboard'}
        </button>
      </div>

      {mermaidText && (
        <div className="output-section">
          <p className="output-title">Preview</p>
          <MermaidPreview mermaidText={mermaidText} />
        </div>
      )}
    </aside>
  )
}
