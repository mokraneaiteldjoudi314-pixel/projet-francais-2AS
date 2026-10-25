import { Check, ClipboardList, ExternalLink, Gamepad2, Brain, Map as MapIcon } from 'lucide-react'
import { COMMITMENTS, GAME_MAX, PLANET_STATS, QUIZ, SOURCES, TOPICS } from '../data/content'
import { SCENES, type SceneMeta } from '../data/scenes'
import { cueReached, type Progress } from '../scenes/types'
import { ICONS } from './icons'
import { planSummary } from '../lib/plan'

interface Props {
  scene: SceneMeta
  elapsed: number
  progress: Progress
  openSources: () => void
  openPlan: () => void
}

export function SidePanel({ scene, elapsed, progress, openSources, openPlan }: Props) {
  if (scene.id === 'home') {
    return (
      <section className="side glass" aria-label="Our planet today">
        <h2 className="side-title">Our Planet Today</h2>
        <ul className="stat-list">
          {PLANET_STATS.map((s, i) => {
            const Icon = ICONS[s.icon]
            const src = SOURCES.find((x) => x.id === s.sourceId)
            return (
              <li key={s.label} className={`stat tone-${s.tone}`} style={{ animationDelay: `${0.15 + i * 0.12}s` }}>
                <span className="ring">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="stat-text">
                  <small>{s.label}</small>
                  <strong>{s.value}</strong>
                  <span>
                    {s.text}
                    {src && <em> · {src.name}</em>}
                  </span>
                </span>
              </li>
            )
          })}
        </ul>
        <button className="side-link" onClick={openSources}>
          Sources <ExternalLink size={13} aria-hidden="true" />
        </button>
      </section>
    )
  }

  if (scene.id in TOPICS) {
    const topic = TOPICS[scene.id as keyof typeof TOPICS]
    const reached = cueReached(scene.narration, topic.facts, elapsed, scene.duration)
    return (
      <section className={`side glass tone-${topic.tone}`} aria-label="Key facts">
        <h2 className="side-title">Key Facts</h2>
        <ul className="stat-list facts">
          {topic.facts.map((f, i) => {
            const Icon = ICONS[f.icon]
            return (
              <li key={f.title} className={`stat tone-${topic.tone} ${i === reached ? 'is-now' : i < reached ? 'is-done' : ''}`} style={{ animationDelay: `${0.15 + i * 0.12}s` }}>
                <span className="ring">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="stat-text">
                  <strong className="fact-title">{f.title}</strong>
                  <span>{f.text}</span>
                </span>
                {i < reached && <Check className="stat-check" size={16} aria-label="Covered" />}
              </li>
            )
          })}
        </ul>
        <button className="side-link" onClick={openSources}>
          Sources <ExternalLink size={13} aria-hidden="true" />
        </button>
      </section>
    )
  }

  if (scene.id === 'action') {
    const chosen = COMMITMENTS.filter((c) => progress.commitments.includes(c.id))
    return (
      <section className="side glass tone-green" aria-label="My plan">
        <h2 className="side-title">My Plan</h2>
        {chosen.length ? (
          <>
            <ul className="plan-list">
              {chosen.map((c) => (
                <li key={c.id}>
                  <Check size={16} aria-hidden="true" /> {c.text}
                </li>
              ))}
            </ul>
            <p className="plan-summary">{planSummary(progress.commitments)}</p>
          </>
        ) : (
          <p className="side-empty">Pick the habits you want to start this week. Your plan will appear here.</p>
        )}
        <button className="btn btn-primary btn-small" onClick={openPlan}>
          <ClipboardList size={16} aria-hidden="true" /> {chosen.length ? 'Edit my plan' : 'Build my plan'}
        </button>
      </section>
    )
  }

  const visited = progress.visited.length
  return (
    <section className="side glass tone-purple" aria-label="Your progress">
      <h2 className="side-title">Your Progress</h2>
      <ul className="stat-list">
        <li className="stat tone-green">
          <span className="ring">
            <MapIcon size={20} aria-hidden="true" />
          </span>
          <span className="stat-text">
            <small>Chapters visited</small>
            <strong>
              {visited} / {SCENES.length}
            </strong>
            <span className="meter" aria-hidden="true">
              <i style={{ transform: `scaleX(${visited / SCENES.length})` }} />
            </span>
          </span>
        </li>
        <li className={`stat tone-purple ${scene.id === 'game' ? 'is-now' : ''}`}>
          <span className="ring">
            <Gamepad2 size={20} aria-hidden="true" />
          </span>
          <span className="stat-text">
            <small>Mini game best</small>
            <strong>{progress.gameBest === null ? 'Not played yet' : `${progress.gameBest} / ${GAME_MAX} pts`}</strong>
          </span>
        </li>
        <li className={`stat tone-yellow ${scene.id === 'quiz' ? 'is-now' : ''}`}>
          <span className="ring">
            <Brain size={20} aria-hidden="true" />
          </span>
          <span className="stat-text">
            <small>Quiz best</small>
            <strong>{progress.quizBest === null ? 'Not taken yet' : `${progress.quizBest} / ${QUIZ.length}`}</strong>
          </span>
        </li>
      </ul>
      <p className="side-empty">{scene.id === 'game' ? 'Pick the choice that saves the most resources. No time limit!' : 'Read each explanation: mistakes help you learn.'}</p>
    </section>
  )
}
