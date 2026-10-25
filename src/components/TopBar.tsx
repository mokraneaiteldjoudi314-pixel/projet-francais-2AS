import { Menu, Search, Settings, Volume2, VolumeX, X } from 'lucide-react'
import { useMemo, useRef, useState, type KeyboardEvent, type RefObject } from 'react'
import { ACTION_GROUPS, GAME_STEPS, QUIZ, TOPICS } from '../data/content'
import { SCENES } from '../data/scenes'
import { SCENE_ICONS } from './icons'
import { LogoMark } from './Logo'

export interface SearchHit {
  key: string
  title: string
  sub: string
  scene: number
  tip: number | null
}

const sceneIndex = (id: string) => SCENES.findIndex((s) => s.id === id)

/** Everything a visitor can search: chapters, practical actions, facts and activities. */
const INDEX: (SearchHit & { haystack: string })[] = [
  ...SCENES.map((s, i) => ({ key: `s-${s.id}`, title: s.navLabel, sub: `Chapter ${s.number} · ${s.chapter}`, scene: i, tip: null, haystack: `${s.navLabel} ${s.chapter}` })),
  ...Object.entries(TOPICS).flatMap(([id, t]) => [
    ...t.tips.map((tip, k) => ({ key: `t-${id}-${k}`, title: tip.title, sub: `${SCENES[sceneIndex(id)].navLabel} · ${tip.text}`, scene: sceneIndex(id), tip: k, haystack: `${tip.title} ${tip.text} ${id}` })),
    ...t.facts.map((f, k) => ({ key: `f-${id}-${k}`, title: f.title, sub: `${SCENES[sceneIndex(id)].navLabel} · ${f.text}`, scene: sceneIndex(id), tip: null, haystack: `${f.title} ${f.text}` })),
  ]),
  ...GAME_STEPS.map((g) => ({ key: `g-${g.id}`, title: g.place, sub: `Mini Game · ${g.situation}`, scene: sceneIndex('game'), tip: null, haystack: `game play ${g.place} ${g.situation}` })),
  ...QUIZ.map((q, k) => ({ key: `q-${k}`, title: 'Quiz question', sub: q.question, scene: sceneIndex('quiz'), tip: null, haystack: `quiz test ${q.question}` })),
  ...ACTION_GROUPS.flatMap((g) => g.actions.map((a, k) => ({ key: `a-${g.id}-${k}`, title: g.title, sub: a, scene: sceneIndex('action'), tip: null, haystack: `action plan ${g.title} ${a}` }))),
]

interface Props {
  soundOn: boolean
  onToggleSound: () => void
  onOpenSettings: () => void
  onOpenMenu: () => void
  onPick: (hit: SearchHit) => void
  searchRef: RefObject<HTMLInputElement | null>
}

export function TopBar({ soundOn, onToggleSound, onOpenSettings, onOpenMenu, onPick, searchRef }: Props) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const box = useRef<HTMLDivElement>(null)

  const hits = useMemo(() => {
    const words = q.toLowerCase().trim().split(/\s+/).filter(Boolean)
    if (!words.length) return []
    return INDEX.filter((h) => words.every((w) => h.haystack.toLowerCase().includes(w))).slice(0, 6)
  }, [q])

  const pick = (h: SearchHit) => {
    onPick(h)
    setQ('')
    setOpen(false)
    setExpanded(false)
    searchRef.current?.blur()
  }

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, hits.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter' && hits[active]) {
      e.preventDefault()
      pick(hits[active])
    } else if (e.key === 'Escape') {
      e.stopPropagation()
      setQ('')
      setOpen(false)
      setExpanded(false)
      e.currentTarget.blur()
    }
  }

  return (
    <header className={`topbar ${expanded ? 'search-open' : ''}`}>
      <button className="icon-btn menu-btn" onClick={onOpenMenu} aria-label="Open menu">
        <Menu size={22} />
      </button>
      <span className="topbar-logo">
        <LogoMark size={30} />
        <span>
          Waste Less, <b>Live Better</b>
        </span>
      </span>
      <div
        className="search"
        ref={box}
        onBlur={(e) => {
          if (!box.current?.contains(e.relatedTarget as Node)) {
            setOpen(false)
            setExpanded(false)
          }
        }}
      >
        <Search size={18} aria-hidden="true" className="search-icon" />
        <input
          ref={searchRef}
          type="search"
          value={q}
          placeholder="Search a topic or action..."
          aria-label="Search a topic or action"
          role="combobox"
          aria-expanded={open && hits.length > 0}
          aria-controls="search-results"
          aria-autocomplete="list"
          aria-activedescendant={open && hits[active] ? `hit-${hits[active].key}` : undefined}
          onChange={(e) => {
            setQ(e.target.value)
            setActive(0)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
        />
        {open && q.trim() && (
          <ul className="search-results glass" id="search-results" role="listbox">
            {hits.length ? (
              hits.map((h, i) => {
                const Icon = SCENE_ICONS[SCENES[h.scene].id]
                return (
                  <li key={h.key} id={`hit-${h.key}`} role="option" aria-selected={i === active}>
                    <button className={i === active ? 'is-active' : ''} onMouseEnter={() => setActive(i)} onClick={() => pick(h)}>
                      <Icon size={16} aria-hidden="true" />
                      <span>
                        <strong>{h.title}</strong>
                        <small>{h.sub}</small>
                      </span>
                    </button>
                  </li>
                )
              })
            ) : (
              <li className="no-hit">No result for “{q.trim()}”. Try food, water, energy, recycle…</li>
            )}
          </ul>
        )}
      </div>
      <div className="topbar-actions">
        <button
          className="icon-btn search-toggle"
          onClick={() => {
            setExpanded(!expanded)
            if (!expanded) setTimeout(() => searchRef.current?.focus(), 0)
          }}
          aria-label={expanded ? 'Close search' : 'Search'}
        >
          {expanded ? <X size={20} /> : <Search size={20} />}
        </button>
        <label className="lang">
          <span className="sr-only">Language</span>
          <select defaultValue="en" aria-label="Language">
            <option value="en">EN</option>
          </select>
        </label>
        <button className="icon-btn" onClick={onToggleSound} aria-pressed={soundOn} aria-label={soundOn ? 'Mute narration' : 'Unmute narration'} title="Sound (M)">
          {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
        <button className="icon-btn" onClick={onOpenSettings} aria-label="Settings" title="Settings">
          <Settings size={20} />
        </button>
      </div>
    </header>
  )
}
