import { ArrowRight, Droplets, Globe2, LayoutGrid, Leaf, Play, UtensilsCrossed, Zap } from 'lucide-react'
import { SceneArt } from '../components/SceneArt'
import type { SceneProps } from './types'

const TOPICS = [
  { scene: 2, icon: UtensilsCrossed, title: 'Food', text: 'Plan, store and share food so less of it ends up in the bin.' },
  { scene: 3, icon: Droplets, title: 'Water', text: 'Simple habits that protect a limited, essential resource.' },
  { scene: 4, icon: Zap, title: 'Energy', text: 'Use power wisely at home and at school.' },
]

export function HomeScene({ start, goTo, openTopics, openSources }: SceneProps) {
  return (
    <div className="scene scene-home">
      <SceneArt scene="home" />
      <div className="layout-hero">
        <div className="hero-copy">
          <p className="eyebrow spaced">A better future starts here</p>
          <h1 className="display">
            Waste Less. <span className="grad">Live Better.</span>
          </h1>
          <p className="lead">Discover how everyday choices can protect resources, reduce waste, and make a real difference.</p>
          <div className="btn-row">
            <button className="btn btn-primary" onClick={start}>
              <Play size={18} aria-hidden="true" /> Start the Experience <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button className="btn btn-ghost" onClick={openTopics}>
              <LayoutGrid size={18} aria-hidden="true" /> Explore the Topics
            </button>
          </div>
          <ul className="indicators" aria-label="Topics">
            <li className="indicator ind-food">
              <span className="ind-icon"><UtensilsCrossed size={16} aria-hidden="true" /></span> Food
            </li>
            <li className="indicator ind-water">
              <span className="ind-icon"><Droplets size={16} aria-hidden="true" /></span> Water
            </li>
            <li className="indicator ind-energy">
              <span className="ind-icon"><Zap size={16} aria-hidden="true" /></span> Energy
            </li>
          </ul>
        </div>
        <aside className="side-panel glass hide-sm">
          <h2 className="panel-title">
            <Leaf size={20} aria-hidden="true" /> Quick Facts
          </h2>
          <ul className="facts">
            <li>
              <span className="fact-icon"><UtensilsCrossed size={18} aria-hidden="true" /></span>
              <span>
                <small>Food wasted worldwide in 2022</small>
                <strong>1.05 billion tonnes</strong>
                <small>UNEP Food Waste Index 2024</small>
              </span>
            </li>
            <li>
              <span className="fact-icon"><Droplets size={18} aria-hidden="true" /></span>
              <span>
                <small>Share of Earth’s water that is fresh</small>
                <strong>about 2.5%</strong>
                <small>USGS</small>
              </span>
            </li>
            <li>
              <span className="fact-icon"><Globe2 size={18} aria-hidden="true" /></span>
              <span>
                <small>Global emissions linked to food loss and waste</small>
                <strong>8–10%</strong>
                <small>UNEP estimate</small>
              </span>
            </li>
          </ul>
          <button className="link-btn" onClick={openSources}>
            View sources <ArrowRight size={14} aria-hidden="true" />
          </button>
        </aside>
      </div>
      <div className="bottom-row hide-xs">
        {TOPICS.map(({ scene, icon: Icon, title, text }) => (
          <button key={title} className="topic-card glass" onClick={() => goTo(scene)}>
            <span className={`topic-icon topic-${title.toLowerCase()}`}>
              <Icon size={22} aria-hidden="true" />
            </span>
            <span className="topic-text">
              <strong>{title}</strong>
              <span>{text}</span>
            </span>
            <ArrowRight size={18} aria-hidden="true" className="topic-arrow" />
          </button>
        ))}
      </div>
    </div>
  )
}
