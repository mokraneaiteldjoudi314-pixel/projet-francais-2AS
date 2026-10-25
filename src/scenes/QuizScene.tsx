import { ArrowRight, Brain, CheckCircle2, LayoutGrid, RotateCcw, XCircle } from 'lucide-react'
import { useState } from 'react'
import { SceneArt } from '../components/SceneArt'
import { QUIZ } from '../data/content'
import type { SceneProps } from './types'

export function QuizScene({ goTo, onQuizDone, progress }: SceneProps) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const finished = index >= QUIZ.length
  const q = QUIZ[Math.min(index, QUIZ.length - 1)]

  const select = (i: number) => {
    if (selected !== null) return
    setSelected(i)
    if (i === q.correct) setScore((s) => s + 1)
  }

  const nextQuestion = () => {
    const last = index === QUIZ.length - 1
    setIndex(index + 1)
    setSelected(null)
    if (last) onQuizDone(score, QUIZ.length)
  }

  const retry = () => {
    setIndex(0)
    setSelected(null)
    setScore(0)
  }

  const pct = Math.round((score / QUIZ.length) * 100)

  return (
    <div className="scene scene-quiz">
      <SceneArt scene="quiz" />
      <div className="layout-center">
        <header className="scene-head center">
          <p className="eyebrow spaced">Chapter 07 · Quiz</p>
          <h1 className="title">Test Your Knowledge</h1>
        </header>
        <section className="game-card glass" aria-live="polite">
          <div className="game-top">
            <span className="panel-title small">
              <Brain size={18} aria-hidden="true" /> {finished ? 'Your result' : `Question ${index + 1} of ${QUIZ.length}`}
            </span>
            <span className="score-pill">Score {score}</span>
          </div>
          <div className="quiz-progress" role="progressbar" aria-valuemin={0} aria-valuemax={QUIZ.length} aria-valuenow={Math.min(index + (selected !== null ? 1 : 0), QUIZ.length)} aria-label="Quiz progress">
            <span style={{ transform: `scaleX(${Math.min(index + (selected !== null ? 1 : 0), QUIZ.length) / QUIZ.length})` }} />
          </div>
          {!finished ? (
            <>
              <h2 className="game-q">{q.question}</h2>
              <div className="options" role="radiogroup" aria-label="Answers">
                {q.answers.map((a, i) => {
                  const state = selected === null ? '' : i === q.correct ? 'is-good' : i === selected ? 'is-bad' : 'is-dim'
                  return (
                    <button
                      key={a}
                      role="radio"
                      aria-checked={selected === i}
                      className={`option ${state} ${selected === i ? 'is-picked' : ''}`}
                      onClick={() => select(i)}
                      disabled={selected !== null}
                    >
                      <span className="option-key">{String.fromCharCode(65 + i)}</span>
                      <span>{a}</span>
                    </button>
                  )
                })}
              </div>
              {selected !== null && (
                <div className={`feedback ${selected === q.correct ? 'good' : 'bad'}`}>
                  {selected === q.correct ? <CheckCircle2 size={20} aria-hidden="true" /> : <XCircle size={20} aria-hidden="true" />}
                  <span>
                    <strong>{selected === q.correct ? 'Correct!' : 'Not quite.'}</strong> {q.explanation}
                  </span>
                  <button className="btn btn-primary btn-small" onClick={nextQuestion}>
                    {index === QUIZ.length - 1 ? 'See my score' : 'Next question'} <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="results">
              <p className="big-score">
                {score}
                <small> / {QUIZ.length}</small>
              </p>
              <p className="lead short">
                {pct === 100
                  ? 'Perfect score! You are ready to share these ideas with others.'
                  : pct >= 60
                    ? 'Well done! You know the key habits for food, water and energy.'
                    : 'Good effort! Review the chapters and try again. Every attempt helps you learn.'}
              </p>
              {progress.quizBest !== null && <p className="muted">Best score on this device: {Math.max(progress.quizBest, score)} / {QUIZ.length}</p>}
              <div className="btn-row center">
                <button className="btn btn-ghost" onClick={retry}>
                  <RotateCcw size={18} aria-hidden="true" /> Retry Quiz
                </button>
                <button className="btn btn-ghost" onClick={() => goTo(0)}>
                  <LayoutGrid size={18} aria-hidden="true" /> Back to Topics
                </button>
                <button className="btn btn-primary" onClick={() => goTo(7)}>
                  Take Action <ArrowRight size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
