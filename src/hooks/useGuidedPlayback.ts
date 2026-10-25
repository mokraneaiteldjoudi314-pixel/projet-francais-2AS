import { useCallback, useEffect, useRef, useState } from 'react'
import { SCENE_TAIL, type SceneMeta } from '../data/scenes'

export type NarrationMode = 'audio' | 'speech' | 'silent'

interface Options {
  scene: SceneMeta
  playing: boolean
  soundOn: boolean
  onComplete: () => void
}

const VOLUME = 0.8

function speechAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
}

/**
 * Drives the guided presentation for one scene: a clock that runs while playing,
 * the Speko narration audio kept in sync with it, and a browser speech fallback
 * if the audio file cannot be played.
 */
export function useGuidedPlayback({ scene, playing, soundOn, onComplete }: Options) {
  // The clock is tagged with its scene so a new scene starts at zero without an extra render.
  const [clock, setClock] = useState({ id: scene.id, t: 0 })
  const elapsed = clock.id === scene.id ? clock.t : 0
  const [mode, setMode] = useState<NarrationMode>('audio')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const elapsedRef = useRef(0)
  const completeRef = useRef(onComplete)
  const speechStarted = useRef(false)

  useEffect(() => {
    completeRef.current = onComplete
  }, [onComplete])

  // One audio element for the whole session.
  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'auto'
    audio.volume = VOLUME
    audio.onerror = () => {
      if (!audio.getAttribute('src')) return
      setMode(speechAvailable() ? 'speech' : 'silent')
    }
    audioRef.current = audio
    return () => {
      audio.pause()
      audio.removeAttribute('src')
      audioRef.current = null
    }
  }, [])

  // New scene: reset the clock and load its narration.
  useEffect(() => {
    elapsedRef.current = 0
    speechStarted.current = false
    if (speechAvailable()) window.speechSynthesis.cancel()
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.src = scene.audio
      audio.load()
    }
  }, [scene])

  // Clock.
  useEffect(() => {
    if (!playing) return
    let frame = 0
    let last = performance.now()
    const total = scene.duration + SCENE_TAIL
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.25)
      last = now
      elapsedRef.current = Math.min(elapsedRef.current + dt, total)
      setClock({ id: scene.id, t: elapsedRef.current })
      if (elapsedRef.current >= total) {
        completeRef.current()
        return
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playing, scene])

  // Narration audio follows the clock.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || mode !== 'audio') return
    if (playing && soundOn && elapsedRef.current < scene.duration) {
      if (Math.abs(audio.currentTime - elapsedRef.current) > 0.4) audio.currentTime = elapsedRef.current
      audio.play().catch((err: unknown) => {
        // Autoplay refusals are not file errors; anything else falls back to speech.
        if (err instanceof DOMException && err.name === 'NotAllowedError') return
        setMode(speechAvailable() ? 'speech' : 'silent')
      })
    } else {
      audio.pause()
    }
  }, [playing, soundOn, scene, mode])

  // Browser speech fallback.
  useEffect(() => {
    if (mode !== 'speech' || !speechAvailable()) return
    const synth = window.speechSynthesis
    if (playing && soundOn) {
      if (speechStarted.current && synth.paused) {
        synth.resume()
      } else if (!speechStarted.current && elapsedRef.current < scene.duration) {
        const u = new SpeechSynthesisUtterance(scene.narration)
        u.lang = 'en-US'
        u.rate = 1
        u.volume = VOLUME
        synth.speak(u)
        speechStarted.current = true
      }
    } else if (speechStarted.current) {
      if (soundOn) synth.pause()
      else {
        synth.cancel()
        speechStarted.current = false
      }
    }
  }, [playing, soundOn, scene, mode])

  useEffect(() => () => {
    if (speechAvailable()) window.speechSynthesis.cancel()
  }, [])

  const restart = useCallback(() => {
    elapsedRef.current = 0
    setClock({ id: scene.id, t: 0 })
    speechStarted.current = false
    if (speechAvailable()) window.speechSynthesis.cancel()
    if (audioRef.current) audioRef.current.currentTime = 0
  }, [scene.id])

  return { elapsed, mode, restart }
}

/** Splits narration into sentences and returns the one being spoken at `elapsed`. */
export function captionAt(text: string, duration: number, elapsed: number): string {
  const parts = text.match(/[^.!?]+[.!?]+/g)?.map((s) => s.trim()) ?? [text]
  const total = parts.reduce((n, p) => n + p.length, 0)
  let t = 0
  for (const p of parts) {
    t += (p.length / total) * duration
    if (elapsed < t) return p
  }
  return parts[parts.length - 1]
}
