import { LogOut, X } from 'lucide-react'
import { SCENES } from '../data/scenes'
import { Logo } from './Logo'
import { SCENE_ICONS } from './icons'

interface Props {
  current: number
  visited: number[]
  open: boolean
  visitorName: string
  onSelect: (index: number) => void
  onClose: () => void
  onSignOut: () => void
}

export function Sidebar({ current, visited, open, visitorName, onSelect, onClose, onSignOut }: Props) {
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
          <ol>
            {SCENES.map((s, i) => {
              const Icon = SCENE_ICONS[s.id]
              const active = i === current
              return (
                <li key={s.id}>
                  <button
                    className={`nav-item ${active ? 'is-active' : ''} ${visited.includes(s.number) ? 'is-visited' : ''}`}
                    aria-current={active ? 'step' : undefined}
                    onClick={() => onSelect(i)}
                  >
                    <Icon size={20} aria-hidden="true" />
                    <span className="nav-label">{s.navLabel}</span>
                    <span className="nav-num">{String(s.number).padStart(2, '0')}</span>
                  </button>
                </li>
              )
            })}
          </ol>
        </nav>
        <div className="sidebar-foot">
          <div className="signed-in">
            <span className="signed-dot" aria-hidden="true" />
            <span>
              Signed in as <strong>{visitorName}</strong>
            </span>
          </div>
          <button className="link-btn" onClick={onSignOut}>
            <LogOut size={16} aria-hidden="true" /> Sign out
          </button>
        </div>
      </aside>
    </>
  )
}
