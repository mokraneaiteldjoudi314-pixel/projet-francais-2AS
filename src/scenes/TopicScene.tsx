import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { Ambient, PhotoBg } from '../components/PhotoBg'
import { ICONS } from '../components/icons'
import { SOURCES, TOPICS } from '../data/content'
import { cueReached, type SceneProps } from './types'

type TopicId = keyof typeof TOPICS

const AMBIENT = { food: 'leaves', water: 'bubbles', energy: 'sparks', reuse: 'leaves' } as const

export function TopicScene({ scene, elapsed, focusTip, openSources }: SceneProps) {
  const id = scene.id as TopicId
  const topic = TOPICS[id]
  const auto = cueReached(scene.narration, topic.tips, elapsed, scene.duration)
  // A tip picked by hand (or from search) stays until the narration reaches the next one.
  const [manual, setManual] = useState<{ i: number; at: number } | null>(() => (focusTip !== null ? { i: focusTip, at: auto } : null))
  const shown = manual && manual.at === auto ? manual.i : Math.max(auto, 0)
  const tip = topic.tips[shown]
  const TipIcon = ICONS[tip.icon]
  const source = SOURCES.find((s) => s.id === topic.fact.sourceId)
  const pick = (i: number) => setManual({ i: (i + topic.tips.length) % topic.tips.length, at: auto })

  return (
    <div className={`hero-scene hero-topic tone-${topic.tone}`}>
      <PhotoBg src={topic.image} position={id === 'water' ? '60% 50%' : 'center'} />
      <Ambient kind={AMBIENT[id]} />
      <div className="hero-copy">
        <p className="eyebrow spaced rise d1">{topic.eyebrow}</p>
        <h1 className="hero-title rise d2">
          {topic.title}
          <br />
          <span className="accent shimmer">{topic.accent}</span>
        </h1>
        <p className="hero-lead rise d3">{topic.lead}</p>
        <div className="fact-chip rise d4">
          <strong>{topic.fact.value}</strong>
          <span>{topic.fact.text}</span>
          {source && (
            <button className="source-link" onClick={openSources} aria-label={`Source: ${source.name}, ${source.title}`}>
              {source.name} <ExternalLink size={12} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <aside className="tip-card glass pop" aria-label="Practical actions" aria-live="polite">
        <div className="tip-head">
          <span className="tip-label">
            Practical action <b>{shown + 1}</b> / {topic.tips.length}
          </span>
          <span className="tip-nav">
            <button className="round-btn small" onClick={() => pick(shown - 1)} aria-label="Previous action">
              <ChevronLeft size={16} />
            </button>
            <button className="round-btn small" onClick={() => pick(shown + 1)} aria-label="Next action">
              <ChevronRight size={16} />
            </button>
          </span>
        </div>
        <div key={shown} className="tip-body">
          <span className="tip-icon">
            <TipIcon size={26} aria-hidden="true" />
          </span>
          <span>
            <strong>{tip.title}</strong>
            <span className="tip-text">{tip.text}</span>
          </span>
        </div>
        <div className="tip-dots" aria-hidden="true">
          {topic.tips.map((t, i) => (
            <span key={t.title + i} className={i === shown ? 'on' : i <= auto ? 'seen' : ''} />
          ))}
        </div>
      </aside>
    </div>
  )
}
