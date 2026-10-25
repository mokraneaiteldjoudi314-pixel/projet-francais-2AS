import { Maximize, Minimize, Pause, Play, RotateCcw, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import { SCENES, SCENE_TAIL, TOTAL_DURATION } from '../data/scenes'

interface Props {
  current: number
  elapsed: number
  playing: boolean
  soundOn: boolean
  fullscreen: boolean
  fullscreenSupported: boolean
  narrationNote: string | null
  onTogglePlay: () => void
  onPrev: () => void
  onNext: () => void
  onSelect: (index: number) => void
  onReplay: () => void
  onToggleSound: () => void
  onToggleFullscreen: () => void
}

function fmt(sec: number) {
  const s = Math.max(0, Math.floor(sec))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export function ControlBar(p: Props) {
  const offset = SCENES.slice(0, p.current).reduce((n, s) => n + s.duration + SCENE_TAIL, 0)
  const scene = SCENES[p.current]
  const sceneProgress = Math.min(p.elapsed / (scene.duration + SCENE_TAIL), 1)
  return (
    <footer className="controlbar" aria-label="Presentation controls">
      <div className="cb-group">
        <button className="icon-btn" onClick={p.onPrev} disabled={p.current === 0} aria-label="Previous scene" title="Previous (←)">
          <SkipBack size={18} />
        </button>
        <button className="play-btn" onClick={p.onTogglePlay} aria-label={p.playing ? 'Pause guided presentation' : 'Play guided presentation'} title="Play / pause (Space)">
          {p.playing ? <Pause size={22} /> : <Play size={22} />}
        </button>
        <button className="icon-btn" onClick={p.onNext} disabled={p.current === SCENES.length - 1} aria-label="Next scene" title="Next (→)">
          <SkipForward size={18} />
        </button>
      </div>
      <span className="cb-time" aria-live="off">
        {fmt(offset + p.elapsed)} / {fmt(TOTAL_DURATION)}
      </span>
      <div className="timeline" role="group" aria-label="Chapter timeline">
        {SCENES.map((s, i) => {
          const fill = i < p.current ? 1 : i === p.current ? sceneProgress : 0
          return (
            <button
              key={s.id}
              className={`tl-seg ${i === p.current ? 'is-active' : ''}`}
              style={{ flexGrow: s.duration + SCENE_TAIL }}
              onClick={() => p.onSelect(i)}
              aria-label={`Chapter ${s.number}: ${s.navLabel}`}
              aria-current={i === p.current ? 'step' : undefined}
            >
              <span className="tl-track">
                <span className="tl-fill" style={{ transform: `scaleX(${fill})` }} />
              </span>
              <span className="tl-label">{s.navLabel}</span>
            </button>
          )
        })}
      </div>
      <span className="cb-count">
        {scene.number} / {SCENES.length}
      </span>
      <div className="cb-group cb-right">
        {p.narrationNote && <span className="cb-note">{p.narrationNote}</span>}
        <button className="icon-btn" onClick={p.onReplay} aria-label="Replay this scene's narration" title="Replay scene">
          <RotateCcw size={18} />
        </button>
        <button className="icon-btn" onClick={p.onToggleSound} aria-pressed={p.soundOn} aria-label={p.soundOn ? 'Mute narration' : 'Unmute narration'}>
          {p.soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
        {p.fullscreenSupported && (
          <button className="icon-btn" onClick={p.onToggleFullscreen} aria-label={p.fullscreen ? 'Exit full screen' : 'Enter full screen'} title="Full screen (F)">
            {p.fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        )}
      </div>
    </footer>
  )
}
