import type { SceneMeta } from '../data/scenes'

export interface Progress {
  scene: number
  visited: number[]
  quizBest: number | null
  gameBest: number | null
  commitments: string[]
}

export const EMPTY_PROGRESS: Progress = {
  scene: 0,
  visited: [1],
  quizBest: null,
  gameBest: null,
  commitments: [],
}

export interface SceneProps {
  scene: SceneMeta
  /** Seconds into this scene's narration. */
  elapsed: number
  progress: Progress
  goTo: (index: number) => void
  next: () => void
  start: () => void
  update: (patch: Partial<Progress>) => void
  onQuizDone: (score: number, total: number) => void
  openPlan: () => void
  openSources: () => void
  /** Index of a tip chosen from search, to show first. */
  focusTip: number | null
}

/** Index of the last cue the narration has reached, or -1 before the first one. */
export function cueReached(narration: string, cues: { cue: string }[], elapsed: number, duration: number): number {
  const pos = (Math.min(elapsed, duration) / duration) * narration.length
  let found = -1
  cues.forEach((c, i) => {
    const at = narration.indexOf(c.cue)
    if (at >= 0 && at <= pos) found = i
  })
  return found
}
