import { X } from 'lucide-react'
import { useState } from 'react'
import type { Hotspot } from '../data/content'

interface Props {
  spots: Hotspot[]
  label: string
}

export function Hotspots({ spots, label }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)
  const open = spots.find((s) => s.id === openId)
  return (
    <div className="hotspots" role="group" aria-label={label}>
      {spots.map((s) => (
        <button
          key={s.id}
          className={`hotspot ${openId === s.id ? 'is-open' : ''}`}
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          onClick={() => setOpenId(openId === s.id ? null : s.id)}
          aria-expanded={openId === s.id}
        >
          <span className="hotspot-ring" aria-hidden="true" />
          <span className="hotspot-label">{s.label}</span>
        </button>
      ))}
      {open && (
        <div
          className="hotspot-card glass"
          style={{ left: `${Math.min(Math.max(open.x, 18), 70)}%`, top: `${open.y > 50 ? open.y - 6 : open.y + 8}%`, transform: open.y > 50 ? 'translate(-50%, -100%)' : 'translate(-50%, 0)' }}
          role="status"
        >
          <button className="icon-btn hotspot-close" onClick={() => setOpenId(null)} aria-label="Close tip">
            <X size={16} />
          </button>
          <strong>{open.title}</strong>
          <p>{open.text}</p>
        </div>
      )}
    </div>
  )
}
