import { ChevronRight, Info, Leaf, Lightbulb, LogOut, X } from 'lucide-react'
import { useState } from 'react'
import { QUICK_TIPS } from '../data/content'
import { SCENES } from '../data/scenes'
import { SCENE_ICONS } from './icons'
import { Logo } from './Logo'

interface Props {
  current: number
  visited: number[]
  open: boolean
  visitorName: string
  onSelect: (index: number) => void
  onClose: () => void
  onAbout: () => void
  onSignOut: () => void
}

function QuickTip() {
  const [i, setI] = useState(0)
  const [open, setOpen] = useState(true)
  if (!open) {
    return (
      <button className="tip-reopen" onClick={() => setOpen(true)}>
        <Lightbulb size={16} aria-hidden="true" /> Show quick tips
      </button>
    )
  }
  return (
    <aside className="quick-tip" aria-label="Quick tip" aria-live="polite">
      <div className="qt-head">
        <span>
          <Lightbulb size={15} aria-hidden="true" /> Quick Tip
        </span>
        <span>
          <button className="icon-btn tiny" onClick={() => setI((i + 1) % QUICK_TIPS.length)} aria-label="Next tip">
            <ChevronRight size={16} />
          </button>
          <button className="icon-btn tiny" onClick={() => setOpen(false)} aria-label="Close quick tips">
            <X size={15} />
          </button>
        </span>
      </div>
      <p key={i}>{QUICK_TIPS[i]}</p>
    </aside>
  )
}

export function Sidebar({ current, visited, open, visitorName, onSelect, onClose, onAbout, onSignOut }: Props) {
  return (
    <>
      <div className={`drawer-backdrop ${open ? 'is-open' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside className={`sidebar ${open ? 'is-open' : ''}`} aria-label="Chapters">
        <div className="sidebar-head">
          <Logo />
          <button className="icon-btn drawer-close" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <nav className="chapter-nav">
          <ul>
            {SCENES.map((s, i) => {
              const Icon = SCENE_ICONS[s.id]
              const active = i === current
              return (
                <li key={s.id}>
                  <button
                    className={`nav-item ${active ? 'is-active' : ''} ${visited.includes(s.number) ? 'is-visited' : ''}`}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => onSelect(i)}
                    title={s.navLabel}
                  >
                    <Icon size={19} aria-hidden="true" />
                    <span className="nav-label">{s.navLabel}</span>
                  </button>
                </li>
              )
            })}
            <li>
              <button className="nav-item" onClick={onAbout} title="About">
                <Info size={19} aria-hidden="true" />
                <span className="nav-label">About</span>
              </button>
            </li>
          </ul>
        </nav>
        <QuickTip />
        <div className="sidebar-foot">
          <p className="script-line">
            Small actions make a big impact <Leaf size={15} aria-hidden="true" />
          </p>
          <div className="signed-in">
            <span className="signed-dot" aria-hidden="true" />
            <span className="signed-name">{visitorName}</span>
            <button className="icon-btn tiny" onClick={onSignOut} aria-label="Sign out" title="Sign out">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
