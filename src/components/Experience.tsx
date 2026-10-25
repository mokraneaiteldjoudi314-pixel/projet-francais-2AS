import { ExternalLink, RotateCcw } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType, type TouchEvent } from 'react'
import { SOURCES } from '../data/content'
import { SCENES } from '../data/scenes'
import { captionAt, useGuidedPlayback } from '../hooks/useGuidedPlayback'
import { KEYS, load, remove, save } from '../lib/storage'
import { touchVisit } from '../lib/visitLog'
import { ActionScene } from '../scenes/ActionScene'
import { ChoicesScene } from '../scenes/ChoicesScene'
import { EnergyScene } from '../scenes/EnergyScene'
import { FoodScene } from '../scenes/FoodScene'
import { HomeScene } from '../scenes/HomeScene'
import { ProblemScene } from '../scenes/ProblemScene'
import { QuizScene } from '../scenes/QuizScene'
import { EMPTY_PROGRESS, type Progress, type SceneProps } from '../scenes/types'
import { WaterScene } from '../scenes/WaterScene'
import { CaptionsLine } from './Captions'
import { ControlBar } from './ControlBar'
import { SCENE_ICONS } from './icons'
import type { Session } from './LoginScreen'
import { Modal } from './Modal'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

const COMPONENTS: ComponentType<SceneProps>[] = [HomeScene, ProblemScene, FoodScene, WaterScene, EnergyScene, ChoicesScene, QuizScene, ActionScene]

const TOPIC_BLURBS = [
  'The opening: why small choices matter.',
  'What waste really costs, with sources.',
  'Plan, store and use food wisely. Try the Smart Kitchen.',
  'Water-smart habits and the Water Habit Challenge.',
  'Compare a wasteful and a smarter energy routine.',
  'A five-step game about everyday decisions.',
  'Six questions to test what you learned.',
  'Choose your commitments for home, school and community.',
]

interface Prefs {
  soundOn: boolean
  captionsOn: boolean
  reduceMotion: boolean
}

interface Props {
  session: Session
  onSignOut: () => void
}

function isTyping(el: EventTarget | null) {
  const t = el as HTMLElement | null
  return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)
}

export function Experience({ session, onSignOut }: Props) {
  const [progress, setProgress] = useState<Progress>(() => ({ ...EMPTY_PROGRESS, ...load<Partial<Progress>>(KEYS.progress, {}) }))
  const [prefs, setPrefs] = useState<Prefs>(() => ({ soundOn: true, captionsOn: true, reduceMotion: false, ...load<Partial<Prefs>>(KEYS.prefs, {}) }))
  const [playing, setPlaying] = useState(false)
  const [pausedByUser, setPausedByUser] = useState(false)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [menuOpen, setMenuOpen] = useState(false)
  const [modal, setModal] = useState<'sources' | 'topics' | 'settings' | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [resetCount, setResetCount] = useState(0)

  const current = Math.min(Math.max(progress.scene, 0), SCENES.length - 1)
  const scene = SCENES[current]

  useEffect(() => save(KEYS.progress, progress), [progress])
  useEffect(() => save(KEYS.prefs, prefs), [prefs])

  const update = useCallback((patch: Partial<Progress>) => setProgress((p) => ({ ...p, ...patch })), [])

  const goTo = useCallback(
    (index: number) => {
      const i = Math.min(Math.max(index, 0), SCENES.length - 1)
      setMenuOpen(false)
      if (i === current) return
      setDirection(i > current ? 1 : -1)
      const n = SCENES[i].number
      setProgress((p) => ({ ...p, scene: i, visited: p.visited.includes(n) ? p.visited : [...p.visited, n] }))
    },
    [current],
  )

  const next = useCallback(() => goTo(current + 1), [goTo, current])
  const prev = useCallback(() => goTo(current - 1), [goTo, current])

  const onComplete = useCallback(() => {
    if (!scene.interactive && current < SCENES.length - 1) goTo(current + 1)
    else setPlaying(false)
  }, [scene.interactive, current, goTo])

  const { elapsed, mode, restart: restartNarration } = useGuidedPlayback({ scene, playing, soundOn: prefs.soundOn, onComplete })

  const togglePlay = useCallback(() => {
    setPlaying((p) => {
      setPausedByUser(p)
      return !p
    })
  }, [])

  const start = useCallback(() => {
    goTo(1)
    setPausedByUser(false)
    setPlaying(true)
  }, [goTo])

  const restartExperience = useCallback(() => {
    setProgress((p) => ({ ...EMPTY_PROGRESS, visited: p.visited, quizBest: p.quizBest, gameBest: p.gameBest }))
    setDirection(-1)
    setPlaying(false)
    setPausedByUser(false)
    setResetCount((n) => n + 1)
  }, [])

  const resetProgress = useCallback(() => {
    remove(KEYS.progress)
    setProgress(EMPTY_PROGRESS)
    setPlaying(false)
    setPausedByUser(false)
    setResetCount((n) => n + 1)
    setModal(null)
  }, [])

  // ---- Visit log: chapters viewed, active time, quiz score ----
  const lastTouch = useRef(0)
  const visitId = session.visitId
  const flush = useCallback(
    (extra: { scene?: number; quizScore?: number; quizTotal?: number } = {}) => {
      if (!visitId) return
      const now = Date.now()
      const seconds = document.visibilityState === 'visible' || extra.scene ? Math.round((now - lastTouch.current) / 1000) : 0
      lastTouch.current = now
      void touchVisit(visitId, { seconds, ...extra })
    },
    [visitId],
  )

  useEffect(() => {
    if (!lastTouch.current) lastTouch.current = Date.now()
    flush({ scene: scene.number })
  }, [scene.number, flush])

  useEffect(() => {
    if (!visitId) return
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') flush()
    }, 30000)
    const onVis = () => {
      if (document.visibilityState === 'hidden') flush()
      else lastTouch.current = Date.now()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [visitId, flush])

  const onQuizDone = useCallback(
    (score: number, total: number) => {
      setProgress((p) => ({ ...p, quizBest: Math.max(p.quizBest ?? 0, score) }))
      flush({ quizScore: score, quizTotal: total })
    },
    [flush],
  )

  // ---- Fullscreen ----
  const fullscreenSupported = typeof document !== 'undefined' && !!document.documentElement.requestFullscreen
  useEffect(() => {
    const onChange = () => setFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])
  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined)
    else void document.documentElement.requestFullscreen?.().catch(() => undefined)
  }, [])

  // ---- Keyboard ----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (modal) setModal(null)
        else if (menuOpen) setMenuOpen(false)
        return
      }
      if (modal || isTyping(e.target) || e.altKey || e.ctrlKey || e.metaKey) return
      if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === ' ' || e.code === 'Space') {
        const t = e.target as HTMLElement | null
        if (t && (t.tagName === 'BUTTON' || t.getAttribute('role') === 'radio' || t.getAttribute('role') === 'checkbox')) return
        e.preventDefault()
        togglePlay()
      } else if (e.key === 'm' || e.key === 'M') setPrefs((p) => ({ ...p, soundOn: !p.soundOn }))
      else if (e.key === 'c' || e.key === 'C') setPrefs((p) => ({ ...p, captionsOn: !p.captionsOn }))
      else if (e.key === 'f' || e.key === 'F') toggleFullscreen()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modal, menuOpen, next, prev, togglePlay, toggleFullscreen])

  // ---- Touch swipe between scenes (outside interactive controls) ----
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e: TouchEvent) => {
    const s = touchStart.current
    touchStart.current = null
    if (!s || (e.target as HTMLElement).closest('input, .compare')) return
    const t = e.changedTouches[0]
    const dx = t.clientX - s.x
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(t.clientY - s.y) * 1.5) (dx < 0 ? next : prev)()
  }

  const caption = playing || elapsed > 0 ? captionAt(scene.narration, scene.duration, elapsed) : ''
  const narrationNote = mode === 'speech' ? 'Browser voice' : mode === 'silent' ? 'Captions only' : null

  const SceneComponent = COMPONENTS[current]
  const sceneProps: SceneProps = useMemo(
    () => ({
      active: true,
      progress,
      goTo,
      next,
      start,
      update,
      onQuizDone,
      openSources: () => setModal('sources'),
      openTopics: () => setModal('topics'),
      restart: restartExperience,
    }),
    [progress, goTo, next, start, update, onQuizDone, restartExperience],
  )

  const classes = ['app', pausedByUser && !playing ? 'is-paused' : '', prefs.reduceMotion ? 'reduce-motion' : '', playing ? 'is-playing' : '', prefs.captionsOn ? 'captions-on' : ''].join(' ')

  return (
    <div className={classes}>
      <Sidebar
        current={current}
        visited={progress.visited}
        open={menuOpen}
        visitorName={session.name}
        onSelect={goTo}
        onClose={() => setMenuOpen(false)}
        onSignOut={onSignOut}
      />
      <main className="main">
        <TopBar
          current={current}
          soundOn={prefs.soundOn}
          captionsOn={prefs.captionsOn}
          onToggleSound={() => setPrefs((p) => ({ ...p, soundOn: !p.soundOn }))}
          onToggleCaptions={() => setPrefs((p) => ({ ...p, captionsOn: !p.captionsOn }))}
          onOpenSettings={() => setModal('settings')}
          onOpenMenu={() => setMenuOpen(true)}
          onSelect={goTo}
        />
        <section className="stage" aria-live="polite" aria-label={`Scene ${scene.number} of ${SCENES.length}: ${scene.chapter}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div key={`${scene.id}-${resetCount}`} className={`scene-wrap enter-${direction > 0 ? 'next' : 'prev'}`}>
            <SceneComponent {...sceneProps} />
          </div>
          <CaptionsLine text={caption} visible={prefs.captionsOn} />
        </section>
        <ControlBar
          current={current}
          elapsed={elapsed}
          playing={playing}
          soundOn={prefs.soundOn}
          fullscreen={fullscreen}
          fullscreenSupported={fullscreenSupported}
          narrationNote={narrationNote}
          onTogglePlay={togglePlay}
          onPrev={prev}
          onNext={next}
          onSelect={goTo}
          onReplay={() => {
            restartNarration()
            setPausedByUser(false)
            setPlaying(true)
          }}
          onToggleSound={() => setPrefs((p) => ({ ...p, soundOn: !p.soundOn }))}
          onToggleFullscreen={toggleFullscreen}
        />
      </main>

      <Modal title="Sources" open={modal === 'sources'} onClose={() => setModal(null)}>
        <p className="muted">Figures in this experience come from these organisations. Comparisons marked “illustrative” are examples, not measurements.</p>
        <ul className="source-list">
          {SOURCES.map((s) => (
            <li key={s.id}>
              <a href={s.url} target="_blank" rel="noreferrer">
                <strong>{s.name}</strong> {s.title} <ExternalLink size={14} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
        <p className="muted small">Sustainable choices depend on local circumstances and access to resources.</p>
      </Modal>

      <Modal title="Explore the Topics" open={modal === 'topics'} onClose={() => setModal(null)} wide>
        <ul className="topic-grid">
          {SCENES.map((s, i) => {
            const Icon = SCENE_ICONS[s.id]
            return (
              <li key={s.id}>
                <button
                  className={`topic-tile ${progress.visited.includes(s.number) ? 'is-visited' : ''}`}
                  onClick={() => {
                    goTo(i)
                    setModal(null)
                  }}
                >
                  <Icon size={20} aria-hidden="true" />
                  <span>
                    <strong>
                      {String(s.number).padStart(2, '0')} · {s.chapter}
                    </strong>
                    <small>{TOPIC_BLURBS[i]}</small>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </Modal>

      <Modal title="Settings" open={modal === 'settings'} onClose={() => setModal(null)}>
        <div className="settings">
          <label className="switch-row">
            <span>
              <strong>Narration sound</strong>
              <small>Voice-over recorded with Speko. Press M to toggle.</small>
            </span>
            <input type="checkbox" checked={prefs.soundOn} onChange={(e) => setPrefs({ ...prefs, soundOn: e.target.checked })} />
          </label>
          <label className="switch-row">
            <span>
              <strong>Captions</strong>
              <small>Show the narration as text. Press C to toggle.</small>
            </span>
            <input type="checkbox" checked={prefs.captionsOn} onChange={(e) => setPrefs({ ...prefs, captionsOn: e.target.checked })} />
          </label>
          <label className="switch-row">
            <span>
              <strong>Reduce motion</strong>
              <small>Stop background animations and transitions.</small>
            </span>
            <input type="checkbox" checked={prefs.reduceMotion} onChange={(e) => setPrefs({ ...prefs, reduceMotion: e.target.checked })} />
          </label>
          <div className="settings-progress">
            <span>
              Chapters visited: <strong>{progress.visited.length} / {SCENES.length}</strong>
              {progress.quizBest !== null && (
                <>
                  {' '}· Best quiz score: <strong>{progress.quizBest}</strong>
                </>
              )}
            </span>
            <button className="btn btn-ghost btn-small" onClick={resetProgress}>
              <RotateCcw size={16} aria-hidden="true" /> Reset my progress
            </button>
          </div>
          <p className="muted small">Shortcuts: ← → change scene · Space play/pause · F full screen · Esc close.</p>
        </div>
      </Modal>
    </div>
  )
}
