import { ArrowRight, Brain, CheckCircle2, RotateCcw, XCircle } from 'lucide-react'
import { useState } from 'react'
import { Ambient, PhotoBg } from '../components/PhotoBg'
import { QUIZ } from '../data/content'
import type { SceneProps } from './types'

export function QuizScene({ next, onQuizDone }: SceneProps) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const finished = index >= QUIZ.length
  const q = QUIZ[Math.min(index, QUIZ.length - 1)]
  const answered = Math.min(index + (selected !== null ? 1 : 0), QUIZ.length)

  const select = (i: number) => {
    if (selected !== null) return
    setSelected(i)
    if (i === q.correct) setScore((s) => s + 1)
  }

  const nextQuestion = () => {
    if (index === QUIZ.length - 1) onQuizDone(score, QUIZ.length)
    setIndex(index + 1)
    setSelected(null)
  }

  const retry = () => {
    setIndex(0)
    setSelected(null)
    setScore(0)
  }

  const pct = Math.round((score / QUIZ.length) * 100)

  return (
    <div className="hero-scene hero-play tone-yellow">
      <PhotoBg src="images/quiz.jpg" position="40% 50%" />
      <Ambient kind="sparks" />
      <div className="play-intro">
        <p className="eyebrow spaced rise d1">Chapter 07 · Quiz</p>
        <h1 className="hero-title rise d2">
          What’s your <span className="accent shimmer">impact?</span>
        </h1>
      </div>
      <section className="play-card glass pop" aria-live="polite" aria-label="Quiz">
        <div className="play-top">
          <span className="play-label">
            <Brain size={16} aria-hidden="true" /> {finished ? 'Your result' : `Question ${index + 1} / ${QUIZ.length}`}
          </span>
          <span className="score-pill">Score {score}</span>
        </div>
        <div className="quiz-progress" role="progressbar" aria-valuemin={0} aria-valuemax={QUIZ.length} aria-valuenow={answered} aria-label="Quiz progress">
          <span style={{ transform: `scaleX(${answered / QUIZ.length})` }} />
        </div>
        {finished ? (
          <div className="results">
            <p className="big-score">
              {score}
              <small> / {QUIZ.length}</small>
            </p>
            <p className="results-text">
              {pct === 100
                ? 'Perfect score! You are ready to share these ideas with others.'
                : pct >= 60
                  ? 'Well done! You know the key habits for food, water and energy.'
                  : 'Good effort! Review the chapters and try again.'}
            </p>
            <div className="btn-row">
              <button className="btn btn-ghost btn-small" onClick={retry}>
                <RotateCcw size={16} aria-hidden="true" /> Retry
              </button>
              <button className="btn btn-primary btn-small" onClick={next}>
                Take action <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="play-q">{q.question}</h2>
            {selected === null ? (
              <div className="options" role="radiogroup" aria-label="Answers">
                {q.answers.map((a, i) => (
                  <button key={a} role="radio" aria-checked={false} className="option" onClick={() => select(i)}>
                    <span className="option-key">{String.fromCharCode(65 + i)}</span>
                    <span>{a}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className={`feedback ${selected === q.correct ? 'good' : 'bad'}`}>
                {selected === q.correct ? <CheckCircle2 size={22} aria-hidden="true" /> : <XCircle size={22} aria-hidden="true" />}
                <span>
                  <strong>{selected === q.correct ? 'Correct!' : `Not quite: the answer is “${q.answers[q.correct]}”.`}</strong>
                  {q.explanation}
                </span>
                <button className="btn btn-primary btn-small" onClick={nextQuestion} autoFocus>
                  {index === QUIZ.length - 1 ? 'See my score' : 'Next'} <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
