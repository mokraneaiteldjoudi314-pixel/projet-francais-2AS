import { ClipboardList, HeartPulse, Leaf, Recycle, RotateCcw, Sprout } from 'lucide-react'
import { Ambient, PhotoBg } from '../components/PhotoBg'
import { ACTION_GROUPS } from '../data/content'
import type { SceneProps } from './types'

const PILLARS = [
  { icon: Recycle, label: 'Less waste' },
  { icon: Sprout, label: 'Save resources' },
  { icon: HeartPulse, label: 'A healthier planet' },
]

export function ActionScene({ openPlan, goTo, progress }: SceneProps) {
  return (
    <div className="hero-scene hero-action tone-green">
      <PhotoBg src="images/mountain.jpg" position="60% 40%" />
      <Ambient kind="leaves" />
      <div className="hero-copy">
        <p className="eyebrow spaced rise d1">Chapter 08 · Take Action</p>
        <h1 className="hero-title rise d2">
          Real change starts
          <br />
          <span className="accent shimmer">with small steps.</span>
        </h1>
        <ul className="pillars rise d3">
          {PILLARS.map(({ icon: Icon, label }) => (
            <li key={label}>
              <span className="pillar-icon">
                <Icon size={20} aria-hidden="true" />
              </span>
              {label}
            </li>
          ))}
        </ul>
        <div className="hero-actions rise d4">
          <button className="btn btn-primary btn-glow" onClick={openPlan}>
            <ClipboardList size={18} aria-hidden="true" /> {progress.commitments.length ? 'Edit My Plan' : 'Build My Plan'}
          </button>
          <button className="btn btn-ghost" onClick={() => goTo(0)}>
            <RotateCcw size={18} aria-hidden="true" /> Watch again
          </button>
        </div>
      </div>
      <aside className="groups glass pop" aria-label="Ideas for action">
        {ACTION_GROUPS.map((g) => (
          <div key={g.id} className="group">
            <strong>
              <Leaf size={14} aria-hidden="true" /> {g.title}
            </strong>
            <span>{g.actions[0]}</span>
          </div>
        ))}
      </aside>
    </div>
  )
}
