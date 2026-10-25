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
  active: boolean
  progress: Progress
  goTo: (index: number) => void
  next: () => void
  start: () => void
  update: (patch: Partial<Progress>) => void
  onQuizDone: (score: number, total: number) => void
  openSources: () => void
  openTopics: () => void
  restart: () => void
}
