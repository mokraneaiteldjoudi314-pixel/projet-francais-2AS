import { ArrowRight, Droplets, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Hotspots } from '../components/Hotspots'
import { MobileTabs } from '../components/MobileTabs'
import { SceneArt } from '../components/SceneArt'
import { WATER_CHALLENGE, WATER_HOTSPOTS } from '../data/content'
import type { SceneProps } from './types'

export function WaterScene({ next }: SceneProps) {
  const [pane, setPane] = useState<'main' | 'side'>('main')
  const [answers, setAnswers] = useState<Record<string, 'smart' | 'wasteful'>>({})
  const done = WATER_CHALLENGE.every((c) => answers[c.id])
  const smartCount = WATER_CHALLENGE.filter((c) => answers[c.id] === 'smart').length
  return (
    <div className="scene scene-water">
      <SceneArt scene="water" />
      <MobileTabs pane={pane} onChange={setPane} mainLabel="Explore" sideLabel="Challenge" />
      <div className={`layout-split show-${pane}`}>
        <section className="split-main hotspot-stage">
          <p className="eyebrow spaced">Chapter 04 · Water</p>
          <h1 className="title">Every Drop Matters</h1>
          <p className="lead short">Select the glowing points to discover water-smart habits.</p>
          <Hotspots spots={WATER_HOTSPOTS} label="Water saving tips" />
        </section>
        <section className="split-side glass" aria-labelledby="water-challenge">
          <h2 className="panel-title" id="water-challenge">
            <Droplets size={20} aria-hidden="true" /> Water Habit Challenge
          </h2>
          <p className="muted">What would you do?</p>
          <ol className="challenge">
            {WATER_CHALLENGE.map((c) => (
              <li key={c.id}>
                <span className="challenge-q">{c.situation}</span>
                <span className="challenge-opts">
                  {(['wasteful', 'smart'] as const).map((k) => (
                    <button
                      key={k}
                      className={`opt ${answers[c.id] === k ? (k === 'smart' ? 'is-good' : 'is-bad') : ''}`}
                      aria-pressed={answers[c.id] === k}
                      onClick={() => setAnswers({ ...answers, [c.id]: k })}
                    >
                      {c[k]}
                    </button>
                  ))}
                </span>
                {answers[c.id] && <span className={`challenge-fb ${answers[c.id] === 'smart' ? 'good' : 'bad'}`}>{c.feedback}</span>}
              </li>
            ))}
          </ol>
          {done && (
            <div className="result-strip" role="status">
              <strong>
                {smartCount} / {WATER_CHALLENGE.length} water-smart habits
              </strong>
              <span>{smartCount === WATER_CHALLENGE.length ? 'Excellent! Every drop counts.' : 'Try switching one more habit.'}</span>
              <button className="icon-btn" onClick={() => setAnswers({})} aria-label="Restart the challenge">
                <RotateCcw size={16} />
              </button>
            </div>
          )}
        </section>
      </div>
      <button className="btn btn-primary scene-next" onClick={next}>
        Next: Energy <ArrowRight size={18} aria-hidden="true" />
      </button>
    </div>
  )
}
