import { ArrowRight, Leaf, Play } from 'lucide-react'
import { Ambient, PhotoBg } from '../components/PhotoBg'
import type { SceneProps } from './types'

export function HomeScene({ start, next, elapsed }: SceneProps) {
  const started = elapsed > 0
  return (
    <div className="hero-scene hero-home">
      <PhotoBg src="images/hero.jpg" />
      <Ambient kind="sparks" />
      <div className="hero-copy">
        <p className="eyebrow spaced rise d1">Make every resource count</p>
        <h1 className="hero-title rise d2">
          Waste Less,
          <br />
          <span className="accent shimmer">Live Better</span>
        </h1>
        <p className="hero-lead rise d3">Explore how smarter everyday choices can reduce waste, protect resources, and help build a healthier future.</p>
        <div className="hero-actions rise d4">
          {started ? (
            <button className="btn btn-primary btn-glow" onClick={next}>
              Explore Food <ArrowRight size={18} aria-hidden="true" />
            </button>
          ) : (
            <button className="btn btn-primary btn-glow" onClick={start}>
              <Play size={18} aria-hidden="true" /> Start the Experience
            </button>
          )}
          <span className="script-note">
            A cleaner planet starts with you <Leaf size={16} aria-hidden="true" />
          </span>
        </div>
      </div>
    </div>
  )
}
