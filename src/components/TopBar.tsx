import { Captions, CaptionsOff, Menu, Settings, Volume2, VolumeX } from 'lucide-react'
import { SCENES } from '../data/scenes'
import { LogoMark } from './Logo'

interface Props {
  current: number
  soundOn: boolean
  captionsOn: boolean
  onToggleSound: () => void
  onToggleCaptions: () => void
  onOpenSettings: () => void
  onOpenMenu: () => void
  onSelect: (index: number) => void
}

export function TopBar({ current, soundOn, captionsOn, onToggleSound, onToggleCaptions, onOpenSettings, onOpenMenu, onSelect }: Props) {
  const scene = SCENES[current]
  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" onClick={onOpenMenu} aria-label="Open chapter menu">
        <Menu size={22} />
      </button>
      <span className="topbar-logo">
        <LogoMark size={30} />
      </span>
      <div className="topbar-chapter">
        <span className="eyebrow">Chapter {String(scene.number).padStart(2, '0')}</span>
        <span className="topbar-title">{scene.chapter}</span>
      </div>
      <div className="scene-dots" role="group" aria-label="Scene progress">
        {SCENES.map((s, i) => (
          <button
            key={s.id}
            className={`dot ${i === current ? 'is-active' : ''} ${i < current ? 'is-done' : ''}`}
            aria-label={`Go to scene ${s.number}: ${s.navLabel}`}
            aria-current={i === current ? 'step' : undefined}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
      <div className="topbar-actions">
        <span className="lang-chip" title="Language: English">EN</span>
        <button className="icon-btn" onClick={onToggleCaptions} aria-pressed={captionsOn} aria-label={captionsOn ? 'Hide captions' : 'Show captions'} title="Captions (C)">
          {captionsOn ? <Captions size={20} /> : <CaptionsOff size={20} />}
        </button>
        <button className="icon-btn" onClick={onToggleSound} aria-pressed={soundOn} aria-label={soundOn ? 'Mute narration' : 'Unmute narration'} title="Sound (M)">
          {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
        <button className="icon-btn" onClick={onOpenSettings} aria-label="Settings and progress" title="Settings">
          <Settings size={20} />
        </button>
      </div>
    </header>
  )
}
