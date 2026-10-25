import { ArrowRight, Zap } from 'lucide-react'
import { useState } from 'react'
import { Hotspots } from '../components/Hotspots'
import { MobileTabs } from '../components/MobileTabs'
import { SceneArt } from '../components/SceneArt'
import { ENERGY_HOTSPOTS, ENERGY_ROUTINE } from '../data/content'
import type { SceneProps } from './types'

type Mode = 'wasteful' | 'smart'

export function EnergyScene({ next }: SceneProps) {
  const [pane, setPane] = useState<'main' | 'side'>('main')
  const [mode, setMode] = useState<Mode>('wasteful')
  const levelKey = mode === 'wasteful' ? 'wastefulLevel' : 'smartLevel'
  const total = ENERGY_ROUTINE.reduce((n, s) => n + s[levelKey], 0)
  const max = ENERGY_ROUTINE.length * 5
  return (
    <div className={`scene scene-energy mode-${mode}`}>
      <SceneArt scene="energy" />
      <MobileTabs pane={pane} onChange={setPane} mainLabel="Explore" sideLabel="Compare" />
      <div className={`layout-split show-${pane}`}>
        <section className="split-main hotspot-stage">
          <p className="eyebrow spaced">Chapter 05 · Energy</p>
          <h1 className="title">Power the Future</h1>
          <p className="lead short">Select the glowing points to explore smarter ways to use energy.</p>
          <Hotspots spots={ENERGY_HOTSPOTS} label="Energy saving tips" />
        </section>
        <section className="split-side glass" aria-labelledby="routine-title">
          <h2 className="panel-title" id="routine-title">
            <Zap size={20} aria-hidden="true" /> One Day, Two Routines
          </h2>
          <div className="segmented" role="radiogroup" aria-label="Routine">
            <button role="radio" aria-checked={mode === 'wasteful'} className={mode === 'wasteful' ? 'is-on bad' : ''} onClick={() => setMode('wasteful')}>
              Wasteful Routine
            </button>
            <button role="radio" aria-checked={mode === 'smart'} className={mode === 'smart' ? 'is-on good' : ''} onClick={() => setMode('smart')}>
              Smarter Routine
            </button>
          </div>
          <ul className="routine">
            {ENERGY_ROUTINE.map((s) => (
              <li key={s.time}>
                <span className="routine-time">{s.time}</span>
                <span className="routine-text">{mode === 'wasteful' ? s.wasteful : s.smart}</span>
                <span className="meter" aria-label={`Illustrative demand ${s[levelKey]} out of 5`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} className={n <= s[levelKey] ? 'on' : ''} />
                  ))}
                </span>
              </li>
            ))}
          </ul>
          <div className="routine-total">
            <span>Daily energy demand</span>
            <span className="total-bar">
              <span style={{ transform: `scaleX(${total / max})` }} />
            </span>
          </div>
          <p className="disclaimer">Illustrative example to compare habits. These levels are not measured data.</p>
        </section>
      </div>
      <button className="btn btn-primary scene-next" onClick={next}>
        Next: Your Choices <ArrowRight size={18} aria-hidden="true" />
      </button>
    </div>
  )
}
