import { ArrowRight, CheckCircle2, Gamepad2, RotateCcw, XCircle } from 'lucide-react'
import { useState } from 'react'
import { Ambient, PhotoBg } from '../components/PhotoBg'
import { GAME_MAX, GAME_STEPS } from '../data/content'
import type { SceneProps } from './types'

export function GameScene({ next, update, progress }: SceneProps) {
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const finished = step >= GAME_STEPS.length
  const current = GAME_STEPS[Math.min(step, GAME_STEPS.length - 1)]
  const best = Math.max(...current.options.map((o) => o.points))

  const choose = (i: number) => {
    if (picked !== null) return
    setPicked(i)
    setScore((s) => s + current.options[i].points)
  }

  const advance = () => {
    if (step === GAME_STEPS.length - 1) update({ gameBest: Math.max(progress.gameBest ?? 0, score) })
    setStep(step + 1)
    setPicked(null)
  }

  const reset = () => {
    setStep(0)
    setPicked(null)
    setScore(0)
  }

  const good = picked !== null && current.options[picked].points === best

  return (
    <div className="hero-scene hero-play tone-purple">
      <PhotoBg src="images/game.jpg" position="30% 50%" />
      <Ambient kind="sparks" />
      <div className="play-intro">
        <p className="eyebrow spaced rise d1">Chapter 06 · Mini Game</p>
        <h1 className="hero-title rise d2">
          Make the <span className="accent shimmer">right choices!</span>
        </h1>
      </div>
      <section className="play-card glass pop" aria-live="polite" aria-label="Mini game">
        <div className="play-top">
          <span className="play-label">
            <Gamepad2 size={16} aria-hidden="true" /> {finished ? 'Results' : `Situation ${step + 1} / ${GAME_STEPS.length} · ${current.place}`}
          </span>
          <span className="score-pill">
            {score} / {GAME_MAX} pts
          </span>
        </div>
        <div className="step-bar" aria-hidden="true">
          {GAME_STEPS.map((s, i) => (
            <span key={s.id} className={i < step || (i === step && picked !== null) ? 'done' : i === step ? 'now' : ''} />
          ))}
        </div>
        {finished ? (
          <div className="results">
            <p className="big-score">
              {score}
              <small> / {GAME_MAX}</small>
            </p>
            <p className="results-text">
              {score >= GAME_MAX - 1
                ? 'Outstanding! Your choices save food, water and energy.'
                : score >= GAME_MAX / 2
                  ? 'Good job! A few small changes would make your day even greener.'
                  : 'Every expert started somewhere. Try again and look for the smarter option.'}
            </p>
            <div className="btn-row">
              <button className="btn btn-ghost btn-small" onClick={reset}>
                <RotateCcw size={16} aria-hidden="true" /> Play again
              </button>
              <button className="btn btn-primary btn-small" onClick={next}>
                Take the quiz <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="play-q">{current.situation}</h2>
            {picked === null ? (
              <div className="options">
                {current.options.map((o, i) => (
                  <button key={o.text} className="option" onClick={() => choose(i)}>
                    <span className="option-key">{String.fromCharCode(65 + i)}</span>
                    <span>{o.text}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className={`feedback ${good ? 'good' : 'bad'}`}>
                {good ? <CheckCircle2 size={22} aria-hidden="true" /> : <XCircle size={22} aria-hidden="true" />}
                <span>
                  <strong>
                    {current.options[picked].text} · +{current.options[picked].points} pt{current.options[picked].points === 1 ? '' : 's'}
                  </strong>
                  {current.options[picked].feedback}
                </span>
                <button className="btn btn-primary btn-small" onClick={advance} autoFocus>
                  {step === GAME_STEPS.length - 1 ? 'See results' : 'Next'} <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
