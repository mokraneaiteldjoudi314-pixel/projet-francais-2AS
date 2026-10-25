import { BookOpen, ExternalLink, LayoutGrid, ListChecks, MonitorPlay, RotateCcw } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from 'react'
import { SOURCES } from '../data/content'
import { SCENES, SCENE_STARTS, TOTAL_DURATION } from '../data/scenes'
import { captionAt, useGuidedPlayback } from '../hooks/useGuidedPlayback'
import { KEYS, load, remove, save } from '../lib/storage'
import { touchVisit } from '../lib/visitLog'
import { ActionScene } from '../scenes/ActionScene'
import { GameScene } from '../scenes/GameScene'
import { HomeScene } from '../scenes/HomeScene'
import { QuizScene } from '../scenes/QuizScene'
import { TopicScene } from '../scenes/TopicScene'
import { EMPTY_PROGRESS, type Progress, type SceneProps } from '../scenes/types'
import { CaptionsLine } from './Captions'
import { CardGrid } from './CardGrid'
import type { Session } from './LoginScreen'
import { Modal } from './Modal'
import { PlanModal } from './PlanModal'
import { PlaybackBar } from './PlaybackBar'
import { SidePanel } from './SidePanel'
import { Sidebar } from './Sidebar'
import { TopBar, type SearchHit } from './TopBar'

const COMPONENTS: ComponentType<SceneProps>[] = [HomeScene, TopicScene, TopicScene, TopicScene, TopicScene, GameScene, QuizScene, ActionScene]

type Tab = 'watch' | 'facts' | 'explore'

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
  const [menuOpen, setMenuOpen] = useState(false)
  const [modal, setModal] = useState<'about' | 'settings' | 'plan' | null>(null)
  const [tab, setTab] = useState<Tab>('watch')
  const [fullscreen, setFullscreen] = useState(false)
  const [resetCount, setResetCount] = useState(0)
  const [focusTip, setFocusTip] = useState<{ scene: number; tip: number } | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const pendingSeek = useRef<number | null>(null)

  const current = Math.min(Math.max(progress.scene, 0), SCENES.length - 1)
  const scene = SCENES[current]

  useEffect(() => save(KEYS.progress, progress), [progress])
  useEffect(() => save(KEYS.prefs, prefs), [prefs])

  const update = useCallback((patch: Partial<Progress>) => setProgress((p) => ({ ...p, ...patch })), [])

  const goTo = useCallback(
    (index: number) => {
      const i = Math.min(Math.max(index, 0), SCENES.length - 1)
      setMenuOpen(false)
      setTab('watch')
      if (i === current) return
      setFocusTip(null)
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

  const { elapsed, mode, restart: restartNarration, seek } = useGuidedPlayback({ scene, playing, soundOn: prefs.soundOn, onComplete })

  // A seek into another chapter lands once that chapter is loaded.
  useEffect(() => {
    if (pendingSeek.current === null) return
    const t = pendingSeek.current
    pendingSeek.current = null
    seek(t)
  }, [seek])

  const seekGlobal = useCallback(
    (t: number) => {
      const clamped = Math.min(Math.max(t, 0), TOTAL_DURATION - 0.1)
      let i = 0
      SCENE_STARTS.forEach((s, k) => {
        if (clamped >= s) i = k
      })
      const offset = clamped - SCENE_STARTS[i]
      if (i === current) seek(offset)
      else {
        pendingSeek.current = offset
        goTo(i)
      }
    },
    [current, seek, goTo],
  )

  const togglePlay = useCallback(() => {
    setPlaying((p) => {
      setPausedByUser(p)
      return !p
    })
  }, [])

  const start = useCallback(() => {
    restartNarration()
    setPausedByUser(false)
    setPlaying(true)
  }, [restartNarration])

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
      const t = e.target as HTMLElement | null
      if (e.key === '/') {
        e.preventDefault()
        searchRef.current?.focus()
      } else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === ' ' || e.code === 'Space') {
        if (t && (t.tagName === 'BUTTON' || t.getAttribute('role') === 'slider')) return
        e.preventDefault()
        togglePlay()
      } else if (e.key === 'm' || e.key === 'M') setPrefs((p) => ({ ...p, soundOn: !p.soundOn }))
      else if (e.key === 'c' || e.key === 'C') setPrefs((p) => ({ ...p, captionsOn: !p.captionsOn }))
      else if (e.key === 'f' || e.key === 'F') toggleFullscreen()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modal, menuOpen, next, prev, togglePlay, toggleFullscreen])

  const onSearchPick = useCallback(
    (hit: SearchHit) => {
      goTo(hit.scene)
      if (hit.tip !== null) setFocusTip({ scene: hit.scene, tip: hit.tip })
    },
    [goTo],
  )

  const caption = playing || elapsed > 0 ? captionAt(scene.narration, scene.duration, Math.min(elapsed, scene.duration - 0.01)) : ''
  const narrationNote = mode === 'speech' ? 'Browser voice' : mode === 'silent' ? 'Captions only' : null
  const tip = focusTip && focusTip.scene === current ? focusTip.tip : null

  const SceneComponent = COMPONENTS[current]
  const sceneProps: SceneProps = useMemo(
    () => ({
      scene,
      elapsed,
      progress,
      goTo,
      next,
      start,
      update,
      onQuizDone,
      openPlan: () => setModal('plan'),
      openSources: () => setModal('about'),
      focusTip: tip,
    }),
    [scene, elapsed, progress, goTo, next, start, update, onQuizDone, tip],
  )

  const classes = ['app', pausedByUser && !playing ? 'is-paused' : '', prefs.reduceMotion ? 'reduce-motion' : '', playing ? 'is-playing' : '', `scene-${scene.id}`].join(' ')

  return (
    <div className={classes}>
      <Sidebar
        current={current}
        visited={progress.visited}
        open={menuOpen}
        visitorName={session.name}
        onSelect={goTo}
        onClose={() => setMenuOpen(false)}
        onAbout={() => {
          setMenuOpen(false)
          setModal('about')
        }}
        onSignOut={onSignOut}
      />
      <main className="main">
        <TopBar
          soundOn={prefs.soundOn}
          onToggleSound={() => setPrefs((p) => ({ ...p, soundOn: !p.soundOn }))}
          onOpenSettings={() => setModal('settings')}
          onOpenMenu={() => setMenuOpen(true)}
          onPick={onSearchPick}
          searchRef={searchRef}
        />
        <div className={`dash tab-${tab}`}>
          <section className="stage" aria-label={`Scene ${scene.number} of ${SCENES.length}: ${scene.chapter}`}>
            <div key={`${scene.id}-${resetCount}-${tip ?? ''}`} className="scene-wrap">
              <SceneComponent {...sceneProps} />
            </div>
            <CaptionsLine text={caption} visible={prefs.captionsOn} />
            {playing && <span className="live-dot" aria-hidden="true" />}
          </section>
          <div className="side-area">
            <SidePanel scene={scene} elapsed={elapsed} progress={progress} openSources={() => setModal('about')} openPlan={() => setModal('plan')} />
          </div>
          <div className="cards-area">
            <CardGrid current={scene.id} visited={progress.visited} onOpen={goTo} />
          </div>
        </div>
        <nav className="mobile-tabs" aria-label="Sections">
          {(
            [
              ['watch', 'Watch', MonitorPlay],
              ['facts', scene.id === 'home' ? 'Planet' : scene.id === 'action' ? 'My plan' : 'Facts', ListChecks],
              ['explore', 'Explore', LayoutGrid],
            ] as const
          ).map(([id, label, Icon]) => (
            <button key={id} className={tab === id ? 'is-on' : ''} aria-pressed={tab === id} onClick={() => setTab(id)}>
              <Icon size={17} aria-hidden="true" /> {label}
            </button>
          ))}
        </nav>
        <PlaybackBar
          current={current}
          elapsed={elapsed}
          playing={playing}
          soundOn={prefs.soundOn}
          captionsOn={prefs.captionsOn}
          fullscreen={fullscreen}
          fullscreenSupported={fullscreenSupported}
          narrationNote={narrationNote}
          onTogglePlay={togglePlay}
          onPrev={prev}
          onNext={next}
          onSeek={seekGlobal}
          onToggleSound={() => setPrefs((p) => ({ ...p, soundOn: !p.soundOn }))}
          onToggleCaptions={() => setPrefs((p) => ({ ...p, captionsOn: !p.captionsOn }))}
          onOpenSettings={() => setModal('settings')}
          onToggleFullscreen={toggleFullscreen}
        />
      </main>

      <PlanModal open={modal === 'plan'} selected={progress.commitments} onChange={(ids) => update({ commitments: ids })} onClose={() => setModal(null)} />

      <Modal title="About this project" open={modal === 'about'} onClose={() => setModal(null)} wide>
        <p>
          <strong>Waste Less, Live Better</strong> is a school project: a 10-minute guided documentary about food, water, energy and waste, with a mini game, a quiz
          and a personal action plan.
        </p>
        <h3 className="modal-sub">
          <BookOpen size={16} aria-hidden="true" /> Sources for the figures
        </h3>
        <ul className="source-list">
          {SOURCES.map((s) => (
            <li key={s.id}>
              <a href={s.url} target="_blank" rel="noreferrer">
                <strong>{s.name}</strong> {s.title} <ExternalLink size={14} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
        <p className="muted small">
          Photos were generated with AI (Figma) for illustration. The voice-over was recorded with Speko. Tips are general advice: sustainable choices depend on local circumstances.
        </p>
        <div className="btn-row end">
          <a className="btn btn-ghost btn-small" href="#/log">
            <ListChecks size={16} aria-hidden="true" /> Open the access log
          </a>
        </div>
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
          <p className="muted small">Shortcuts: ← → change chapter · Space play/pause · / search · M sound · C captions · F full screen · Esc close.</p>
        </div>
      </Modal>
    </div>
  )
}
