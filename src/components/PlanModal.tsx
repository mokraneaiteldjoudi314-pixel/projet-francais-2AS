import { Check, Copy, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { COMMITMENTS } from '../data/content'
import { planSummary } from '../lib/plan'
import { Modal } from './Modal'

interface Props {
  open: boolean
  selected: string[]
  onChange: (ids: string[]) => void
  onClose: () => void
}

export function PlanModal({ open, selected, onChange, onClose }: Props) {
  const [copied, setCopied] = useState(false)
  const toggle = (id: string) => {
    setCopied(false)
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id])
  }
  const summary = planSummary(selected)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`My plan (Waste Less, Live Better): ${summary}`)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Modal title="Build My Plan" open={open} onClose={onClose}>
      <p className="muted">Choose the commitments you want to keep. Your plan stays on this device only.</p>
      <ul className="commit-list" role="group" aria-label="Commitments">
        {COMMITMENTS.map((c) => {
          const on = selected.includes(c.id)
          return (
            <li key={c.id}>
              <button role="checkbox" aria-checked={on} className={`commit-item ${on ? 'is-on' : ''}`} onClick={() => toggle(c.id)}>
                <span className="commit-box">{on && <Check size={16} aria-hidden="true" />}</span>
                {c.text}
              </button>
            </li>
          )
        })}
      </ul>
      <div className={`plan-result ${summary ? 'is-ready' : ''}`} aria-live="polite">
        <Sparkles size={18} aria-hidden="true" />
        <span>{summary || 'Select at least one commitment to generate your plan.'}</span>
      </div>
      <div className="btn-row end">
        {summary && (
          <button className="btn btn-ghost btn-small" onClick={copy}>
            <Copy size={16} aria-hidden="true" /> {copied ? 'Copied!' : 'Copy my plan'}
          </button>
        )}
        <button className="btn btn-primary btn-small" onClick={onClose}>
          Done
        </button>
      </div>
    </Modal>
  )
}
