import { ArrowRight, Check, HeartPulse, Recycle, Sprout } from 'lucide-react'
import type { Tone } from '../data/content'
import { SCENES, type SceneId } from '../data/scenes'
import { SCENE_ICONS } from './icons'

interface Card {
  id: SceneId
  title: string
  text: string
  cta: string
  image: string
  tone: Tone
}

const ROW_1: Card[] = [
  { id: 'food', title: 'Food', text: 'Eat smart. Waste less.', cta: 'Explore', image: 'images/food.jpg', tone: 'orange' },
  { id: 'water', title: 'Water', text: 'Every drop counts.', cta: 'Explore', image: 'images/water.jpg', tone: 'blue' },
  { id: 'energy', title: 'Energy', text: 'Use energy wisely.', cta: 'Explore', image: 'images/energy.jpg', tone: 'yellow' },
]

const ROW_2: Card[] = [
  { id: 'reuse', title: 'Reduce & Recycle', text: 'Give things a second life.', cta: 'Explore', image: 'images/recycle.jpg', tone: 'green' },
  { id: 'game', title: 'Mini Game', text: 'Make the right choices!', cta: 'Play Now', image: 'images/game.jpg', tone: 'purple' },
  { id: 'quiz', title: 'Quiz', text: 'What’s your impact?', cta: 'Take the Quiz', image: 'images/quiz.jpg', tone: 'yellow' },
]

interface Props {
  current: SceneId
  visited: number[]
  onOpen: (index: number) => void
}

export function CardGrid({ current, visited, onOpen }: Props) {
  const card = (c: Card, i: number) => {
    const index = SCENES.findIndex((s) => s.id === c.id)
    const Icon = SCENE_ICONS[c.id]
    const active = current === c.id
    const seen = visited.includes(SCENES[index].number)
    return (
      <button
        key={c.id}
        className={`card tone-${c.tone} ${active ? 'is-active' : ''}`}
        style={{ animationDelay: `${0.1 + i * 0.07}s` }}
        onClick={() => onOpen(index)}
        aria-current={active ? 'true' : undefined}
        aria-label={`${c.title}: ${c.text} ${c.cta}`}
      >
        <span className="card-img" style={{ backgroundImage: `url(${c.image})` }} aria-hidden="true" />
        <span className="card-shade" aria-hidden="true" />
        <span className="card-body">
          <span className="card-title">
            <span className="card-icon">
              <Icon size={16} aria-hidden="true" />
            </span>
            {c.title}
            {seen && !active && <Check className="card-seen" size={14} aria-label="Visited" />}
            {active && <span className="live-badge">Now</span>}
          </span>
          <span className="card-text">{c.text}</span>
          <span className="card-cta">
            {c.cta} <ArrowRight size={14} aria-hidden="true" />
          </span>
        </span>
      </button>
    )
  }

  const actionIndex = SCENES.findIndex((s) => s.id === 'action')
  return (
    <section className="cards" aria-label="Explore the topics">
      <div className="card-row row-3">{ROW_1.map(card)}</div>
      <div className="card-row row-4">
        {ROW_2.map((c, i) => card(c, i + 3))}
        <button
          className={`card card-slogan tone-green ${current === 'action' ? 'is-active' : ''}`}
          style={{ animationDelay: '0.52s' }}
          onClick={() => onOpen(actionIndex)}
          aria-current={current === 'action' ? 'true' : undefined}
          aria-label="Take action: real change starts with small steps. Build my plan"
        >
          <span className="card-img" style={{ backgroundImage: 'url(images/mountain.jpg)' }} aria-hidden="true" />
          <span className="card-shade" aria-hidden="true" />
          <span className="card-body">
            <span className="slogan">
              Real change starts with <em>small steps.</em>
            </span>
            <span className="slogan-icons" aria-hidden="true">
              <span>
                <Recycle size={14} /> Less waste
              </span>
              <span>
                <Sprout size={14} /> Save resources
              </span>
              <span>
                <HeartPulse size={14} /> A healthier planet
              </span>
            </span>
            <span className="card-cta">
              Take Action <ArrowRight size={14} aria-hidden="true" />
            </span>
          </span>
        </button>
      </div>
    </section>
  )
}
