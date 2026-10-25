import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  title: string
  open: boolean
  onClose: () => void
  children: ReactNode
  wide?: boolean
}

export function Modal({ title, open, onClose, children, wide }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    ref.current?.focus()
    return () => prev?.focus()
  }, [open])
  if (!open) return null
  return (
    <div className="modal-layer" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal glass ${wide ? 'is-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}
