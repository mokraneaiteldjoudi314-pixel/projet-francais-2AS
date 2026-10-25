import { Check, Home, RotateCcw, School, Users } from 'lucide-react'
import { SceneArt } from '../components/SceneArt'
import { ACTION_GROUPS, COMMITMENTS } from '../data/content'
import type { SceneProps } from './types'

const GROUP_ICONS = { home: Home, school: School, community: Users }

function joinList(items: string[]) {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

export function ActionScene({ progress, update, restart }: SceneProps) {
  const chosen = progress.commitments
  const toggle = (id: string) =>
    update({ commitments: chosen.includes(id) ? chosen.filter((c) => c !== id) : [...chosen, id] })
  const summary = COMMITMENTS.filter((c) => chosen.includes(c.id)).map((c) => c.short)
  return (
    <div className="scene scene-action">
      <SceneArt scene="action" />
      <div className="layout-stack">
        <header className="scene-head">
          <p className="eyebrow spaced">Chapter 08 · Take Action</p>
          <h1 className="title">Your Next Step Starts Today</h1>
        </header>
        <div className="action-body">
          <div className="action-groups">
            {ACTION_GROUPS.map((g) => {
              const Icon = GROUP_ICONS[g.id as keyof typeof GROUP_ICONS]
              return (
                <section key={g.id} className="action-group glass">
                  <h2 className="panel-title small">
                    <Icon size={18} aria-hidden="true" /> {g.title}
                  </h2>
                  <ul>
                    {g.actions.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </section>
              )
            })}
          </div>
          <section className="commit glass" aria-labelledby="commit-title">
            <h2 className="panel-title small" id="commit-title">My commitments</h2>
            <ul className="commit-list">
              {COMMITMENTS.map((c) => (
                <li key={c.id}>
                  <button className={`commit-item ${chosen.includes(c.id) ? 'is-on' : ''}`} role="checkbox" aria-checked={chosen.includes(c.id)} onClick={() => toggle(c.id)}>
                    <span className="box">{chosen.includes(c.id) && <Check size={14} aria-hidden="true" />}</span>
                    {c.text}
                  </button>
                </li>
              ))}
            </ul>
            <p className="commit-summary" aria-live="polite">
              {summary.length
                ? `Starting today, I will ${joinList(summary)}.`
                : 'Select the commitments you want to keep.'}
            </p>
          </section>
        </div>
        <div className="final-row">
          <p className="final-message">The future is shaped by the choices we make together.</p>
          <button className="btn btn-primary" onClick={restart}>
            <RotateCcw size={18} aria-hidden="true" /> Restart Experience
          </button>
        </div>
      </div>
    </div>
  )
}
