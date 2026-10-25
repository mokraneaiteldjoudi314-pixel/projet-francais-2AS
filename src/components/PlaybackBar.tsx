import { Captions, CaptionsOff, ChevronLeft, ChevronRight, Maximize, Minimize, Pause, Play, Settings, Volume2, VolumeX } from 'lucide-react'
import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { SCENES, SCENE_STARTS, TOTAL_DURATION } from '../data/scenes'

interface Props {
  current: number
  elapsed: number
  playing: boolean
  soundOn: boolean
  captionsOn: boolean
  fullscreen: boolean
  fullscreenSupported: boolean
  narrationNote: string | null
  onTogglePlay: () => void
  onPrev: () => void
  onNext: () => void
  onSeek: (t: number) => void
  onToggleSound: () => void
  onToggleCaptions: () => void
  onOpenSettings: () => void
  onToggleFullscreen: () => void
}

function fmt(sec: number) {
  const s = Math.max(0, Math.round(sec))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

function sceneAt(t: number) {
  let i = 0
  SCENE_STARTS.forEach((start, k) => {
    if (t >= start) i = k
  })
  return i
}

export function PlaybackBar(p: Props) {
  const now = Math.min(SCENE_STARTS[p.current] + p.elapsed, TOTAL_DURATION)
  const pct = (now / TOTAL_DURATION) * 100
  const scene = SCENES[p.current]
  const track = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number | null>(null)
  const dragging = useRef(false)

  const timeAt = (clientX: number) => {
    const r = track.current?.getBoundingClientRect()
    if (!r) return 0
    return Math.min(Math.max((clientX - r.left) / r.width, 0), 1) * TOTAL_DURATION
  }
  const down = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    p.onSeek(timeAt(e.clientX))
  }
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const t = timeAt(e.clientX)
    setHover(t)
    if (dragging.current) p.onSeek(t)
  }
  const up = () => {
    dragging.current = false
  }
  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 30 : 5
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') p.onSeek(Math.min(now + step, TOTAL_DURATION - 0.1))
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') p.onSeek(Math.max(now - step, 0))
    else if (e.key === 'Home') p.onSeek(0)
    else if (e.key === 'End') p.onSeek(SCENE_STARTS[SCENES.length - 1])
    else return
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <footer className="playbar" aria-label="Presentation controls">
      <button className={`play-btn ${p.playing ? 'is-on' : ''}`} onClick={p.onTogglePlay} aria-label={p.playing ? 'Pause guided presentation' : 'Play guided presentation'} title="Play / pause (Space)">
        {p.playing ? <Pause size={22} /> : <Play size={22} />}
      </button>
      <span className="pb-time" aria-hidden="true">
        {fmt(now)} <span>/ {fmt(TOTAL_DURATION)}</span>
      </span>
      <div
        className="seek"
        ref={track}
        role="slider"
        tabIndex={0}
        aria-label="Presentation timeline"
        aria-valuemin={0}
        aria-valuemax={Math.round(TOTAL_DURATION)}
        aria-valuenow={Math.round(now)}
        aria-valuetext={`${fmt(now)} of ${fmt(TOTAL_DURATION)}, ${scene.chapter}`}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onPointerLeave={() => setHover(null)}
        onKeyDown={key}
      >
        <div className="seek-track">
          <div className="seek-fill" style={{ width: `${pct}%` }} />
          {SCENE_STARTS.slice(1).map((s, i) => (
            <span key={i} className={`seek-mark ${s <= now ? 'passed' : ''}`} style={{ left: `${(s / TOTAL_DURATION) * 100}%` }} />
          ))}
          <span className="seek-thumb" style={{ left: `${pct}%` }} />
        </div>
        {hover !== null && (
          <span className="seek-tip" style={{ left: `${(hover / TOTAL_DURATION) * 100}%` }}>
            {fmt(hover)} · {SCENES[sceneAt(hover)].navLabel}
          </span>
        )}
      </div>
      <span className="hd-chip" title="High-definition images">
        HD
      </span>
      {p.narrationNote && <span className="pb-note">{p.narrationNote}</span>}
      <div className="pb-icons">
        <button className="icon-btn pb-dup" onClick={p.onToggleSound} aria-pressed={p.soundOn} aria-label={p.soundOn ? 'Mute narration' : 'Unmute narration'} title="Sound (M)">
          {p.soundOn ? <Volume2 size={19} /> : <VolumeX size={19} />}
        </button>
        <button className="icon-btn" onClick={p.onToggleCaptions} aria-pressed={p.captionsOn} aria-label={p.captionsOn ? 'Hide captions' : 'Show captions'} title="Captions (C)">
          {p.captionsOn ? <Captions size={19} /> : <CaptionsOff size={19} />}
        </button>
        <button className="icon-btn hide-xs" onClick={p.onOpenSettings} aria-label="Settings" title="Settings">
          <Settings size={19} />
        </button>
        {p.fullscreenSupported && (
          <button className="icon-btn pb-dup" onClick={p.onToggleFullscreen} aria-label={p.fullscreen ? 'Exit full screen' : 'Enter full screen'} title="Full screen (F)">
            {p.fullscreen ? <Minimize size={19} /> : <Maximize size={19} />}
          </button>
        )}
      </div>
      <span className="scene-chip" aria-live="polite">
        <b>
          Scene {scene.number}/{SCENES.length}
        </b>
        <span>{scene.chapter}</span>
      </span>
      <div className="pb-nav">
        <button className="round-btn" onClick={p.onPrev} disabled={p.current === 0} aria-label="Previous chapter" title="Previous (←)">
          <ChevronLeft size={20} />
        </button>
        <button className="round-btn" onClick={p.onNext} disabled={p.current === SCENES.length - 1} aria-label="Next chapter" title="Next (→)">
          <ChevronRight size={20} />
        </button>
      </div>
    </footer>
  )
}
