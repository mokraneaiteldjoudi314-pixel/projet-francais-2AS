import { ArrowRight, CheckCircle2, RotateCcw, Route, XCircle } from 'lucide-react'
import { useState } from 'react'
import { SceneArt } from '../components/SceneArt'
import { GAME_STEPS } from '../data/content'
import type { SceneProps } from './types'

const MAX = GAME_STEPS.reduce((n, s) => n + Math.max(...s.options.map((o) => o.points)), 0)

export function ChoicesScene({ next, update, progress }: SceneProps) {
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const finished = step >= GAME_STEPS.length
  const current = GAME_STEPS[Math.min(step, GAME_STEPS.length - 1)]

  const choose = (i: number) => {
    if (picked !== null) return
    setPicked(i)
    setScore((s) => s + current.options[i].points)
  }

  const advance = () => {
    const last = step === GAME_STEPS.length - 1
    setStep(step + 1)
    setPicked(null)
    if (last) update({ gameBest: Math.max(progress.gameBest ?? 0, score) })
  }

  const reset = () => {
    setStep(0)
    setPicked(null)
    setScore(0)
  }

  const best = Math.max(...current.options.map((o) => o.points))

  return (
    <div className="scene scene-choices">
      <SceneArt scene="choices" />
      <div className="layout-center">
        <header className="scene-head center">
          <p className="eyebrow spaced">Chapter 06 · Game</p>
          <h1 className="title">Your Daily Choices</h1>
        </header>
        <section className="game-card glass" aria-live="polite">
          <div className="game-top">
            <span className="panel-title small">
              <Route size={18} aria-hidden="true" /> {finished ? 'Results' : `Situation ${step + 1} of ${GAME_STEPS.length}`}
            </span>
            <span className="score-pill">Score {score} / {MAX}</span>
          </div>
          <div className="step-bar" aria-hidden="true">
            {GAME_STEPS.map((s, i) => (
              <span key={s.id} className={i < step || (i === step && picked !== null) ? 'done' : i === step ? 'now' : ''} />
            ))}
          </div>
          {!finished ? (
            <>
              <p className="game-place">{current.place}</p>
              <h2 className="game-q">{current.situation}</h2>
              <div className="options">
                {current.options.map((o, i) => {
                  const state = picked === null ? '' : o.points === best ? 'is-good' : i === picked ? 'is-bad' : 'is-dim'
                  return (
                    <button key={o.text} className={`option ${state} ${picked === i ? 'is-picked' : ''}`} onClick={() => choose(i)} disabled={picked !== null}>
                      <span className="option-key">{String.fromCharCode(65 + i)}</span>
                      <span>{o.text}</span>
                    </button>
                  )
                })}
              </div>
              {picked !== null && (
                <div className={`feedback ${current.options[picked].points === best ? 'good' : 'bad'}`}>
                  {current.options[picked].points === best ? <CheckCircle2 size={20} aria-hidden="true" /> : <XCircle size={20} aria-hidden="true" />}
                  <span>
                    <strong>+{current.options[picked].points} point{current.options[picked].points === 1 ? '' : 's'}.</strong> {current.options[picked].feedback}
                  </span>
                  <button className="btn btn-primary btn-small" onClick={advance}>
                    {step === GAME_STEPS.length - 1 ? 'See results' : 'Next situation'} <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="results">
              <p className="big-score">
                {score}
                <small> / {MAX}</small>
              </p>
              <p className="lead short">
                {score >= MAX - 1
                  ? 'Outstanding! Your daily choices save food, water and energy.'
                  : score >= MAX / 2
                    ? 'Good job! A few small changes would make your day even greener.'
                    : 'Every expert started somewhere. Try again and look for the smarter option.'}
              </p>
              <div className="btn-row center">
                <button className="btn btn-ghost" onClick={reset}>
                  <RotateCcw size={18} aria-hidden="true" /> Try Again
                </button>
                <button className="btn btn-primary" onClick={next}>
                  Continue <ArrowRight size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
