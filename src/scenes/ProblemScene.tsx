import { ArrowRight, BookOpen, Droplets, UtensilsCrossed, Zap } from 'lucide-react'
import { useState } from 'react'
import { SceneArt } from '../components/SceneArt'
import { PROBLEM_PANELS, SOURCES } from '../data/content'
import type { SceneProps } from './types'

const ICONS = { food: UtensilsCrossed, water: Droplets, energy: Zap }

export function ProblemScene({ next, openSources }: SceneProps) {
  const [selected, setSelected] = useState<string>('food')
  return (
    <div className="scene scene-problem">
      <SceneArt scene="problem" />
      <div className="layout-stack">
        <header className="scene-head">
          <p className="eyebrow spaced">Chapter 02</p>
          <h1 className="title">The Cost of Waste</h1>
          <p className="lead short">Waste is not only what we throw away. It is also everything that was used to make it.</p>
        </header>
        <div className="problem-panels">
          {PROBLEM_PANELS.map((p) => {
            const Icon = ICONS[p.id]
            const isOpen = selected === p.id
            const source = SOURCES.find((s) => s.id === p.sourceId)
            return (
              <button
                key={p.id}
                className={`problem-panel glass panel-${p.id} ${isOpen ? 'is-open' : ''}`}
                onClick={() => setSelected(p.id)}
                aria-expanded={isOpen}
              >
                <span className="pp-head">
                  <span className={`topic-icon topic-${p.id}`}>
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <strong>{p.title}</strong>
                </span>
                <span className="pp-lead">{p.lead}</span>
                {isOpen && (
                  <span className="pp-detail">
                    <span className="pp-stat">{p.stat}</span>
                    <span className="pp-stat-label">{p.statLabel}</span>
                    {p.detail.map((d) => (
                      <span key={d} className="pp-line">{d}</span>
                    ))}
                    {source && <span className="pp-source">Source: {source.name}, {source.title}</span>}
                  </span>
                )}
                {!isOpen && <span className="pp-more">Select to learn more</span>}
              </button>
            )
          })}
        </div>
        <div className="scene-foot">
          <button className="btn btn-ghost" onClick={openSources}>
            <BookOpen size={18} aria-hidden="true" /> Sources
          </button>
          <button className="btn btn-primary" onClick={next}>
            Continue <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
