import { ArrowRight, ChefHat, MoveHorizontal } from 'lucide-react'
import { useState } from 'react'
import { MobileTabs } from '../components/MobileTabs'
import { SceneArt } from '../components/SceneArt'
import { FOOD_ACTIONS, KITCHEN_HABITS } from '../data/content'
import type { SceneProps } from './types'

export function FoodScene({ next }: SceneProps) {
  const [pane, setPane] = useState<'main' | 'side'>('main')
  const [habitId, setHabitId] = useState(KITCHEN_HABITS[0].id)
  const [split, setSplit] = useState(50)
  const habit = KITCHEN_HABITS.find((h) => h.id === habitId) ?? KITCHEN_HABITS[0]
  return (
    <div className="scene scene-food">
      <SceneArt scene="food" />
      <MobileTabs pane={pane} onChange={setPane} mainLabel="Actions" sideLabel="Smart Kitchen" />
      <div className={`layout-split show-${pane}`}>
        <section className="split-main">
          <p className="eyebrow spaced">Chapter 03 · Food</p>
          <h1 className="title">Respect Every Bite</h1>
          <p className="lead short">Much of the food wasted at home can be avoided with a little planning.</p>
          <ul className="action-grid">
            {FOOD_ACTIONS.map((a, i) => (
              <li key={a.title} className="action-tile glass" style={{ animationDelay: `${i * 70}ms` }}>
                <strong>{a.title}</strong>
                <span>{a.text}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="split-side glass" aria-labelledby="kitchen-title">
          <h2 className="panel-title" id="kitchen-title">
            <ChefHat size={20} aria-hidden="true" /> Smart Kitchen
          </h2>
          <p className="muted">Pick a common habit to see a better one.</p>
          <div className="chips" role="radiogroup" aria-label="Kitchen habits">
            {KITCHEN_HABITS.map((h) => (
              <button
                key={h.id}
                role="radio"
                aria-checked={h.id === habitId}
                className={`chip ${h.id === habitId ? 'is-selected' : ''}`}
                onClick={() => {
                  setHabitId(h.id)
                  setSplit(50)
                }}
              >
                {h.habit}
              </button>
            ))}
          </div>
          <div className="compare" style={{ ['--split' as string]: `${split}%` }}>
            <div className="compare-pane compare-before">
              <span className="tag tag-bad">Before</span>
              <strong>{habit.habit}</strong>
              <p>{habit.problem}</p>
            </div>
            <div className="compare-pane compare-after" aria-hidden={split > 92}>
              <span className="tag tag-good">After</span>
              <strong>A smarter habit</strong>
              <p>{habit.tip}</p>
            </div>
            <span className="compare-handle" aria-hidden="true">
              <MoveHorizontal size={16} />
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={split}
              onChange={(e) => setSplit(Number(e.target.value))}
              aria-label="Compare before and after: drag left to reveal the smarter habit"
              className="compare-range"
            />
          </div>
          <div className="compare-buttons">
            <button className="btn btn-small btn-ghost" onClick={() => setSplit(100)}>Show before</button>
            <button className="btn btn-small btn-primary" onClick={() => setSplit(0)}>Show the tip</button>
          </div>
        </section>
      </div>
      <button className="btn btn-primary scene-next" onClick={next}>
        Next: Water <ArrowRight size={18} aria-hidden="true" />
      </button>
    </div>
  )
}
