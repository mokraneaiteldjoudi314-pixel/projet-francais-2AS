export type SceneId = 'home' | 'problem' | 'food' | 'water' | 'energy' | 'choices' | 'quiz' | 'action'

export interface SceneMeta {
  id: SceneId
  number: number
  navLabel: string
  chapter: string
  /** Narration read by the Speko voice (public/audio/scene-N.mp3) and shown as captions. */
  narration: string
  /** Length of the recorded narration, in seconds. */
  duration: number
  audio: string
  /** Guided playback waits here instead of moving on, because the scene needs answers. */
  interactive?: boolean
}

export const SCENES: SceneMeta[] = [
  {
    id: 'home',
    number: 1,
    navLabel: 'Home',
    chapter: 'Opening',
    narration:
      'Welcome to Waste Less, Live Better. Every day, we use food, water and energy, often without thinking about it. In this short journey, you will discover how small, everyday choices can protect our resources and make a real difference. Small choices. Big impact.',
    duration: 17.7,
    audio: 'audio/scene-1.mp3',
  },
  {
    id: 'problem',
    number: 2,
    navLabel: 'The Problem',
    chapter: 'The Cost of Waste',
    narration:
      'Waste has a cost. When food is thrown away, the water, land and energy used to produce it are lost too. Fresh water is limited and essential to life. And energy we do not need still has to be produced, often from fossil fuels. Select each panel to learn more.',
    duration: 17.1,
    audio: 'audio/scene-2.mp3',
  },
  {
    id: 'food',
    number: 3,
    navLabel: 'Food',
    chapter: 'Respect Every Bite',
    narration:
      'Respect every bite. Much of the food wasted at home can be avoided with a little planning. Make a shopping list, store food correctly, understand date labels, and turn leftovers into new meals. Try the Smart Kitchen to see how a few simple changes can help.',
    duration: 16.1,
    audio: 'audio/scene-3.mp3',
  },
  {
    id: 'water',
    number: 4,
    navLabel: 'Water',
    chapter: 'Every Drop Matters',
    narration:
      'Every drop matters. Only a small share of the water on Earth is fresh water that we can use. Turning off the tap while brushing your teeth, fixing leaks, and keeping rivers clean are simple ways to protect it. Take the Water Habit Challenge.',
    duration: 14.6,
    audio: 'audio/scene-4.mp3',
  },
  {
    id: 'energy',
    number: 5,
    navLabel: 'Energy',
    chapter: 'Power the Future',
    narration:
      'Power the future. Switching off lights and devices, using natural daylight, and choosing efficient appliances all reduce the energy we need. Compare a wasteful routine with a smarter one, and discover the role of renewable energy.',
    duration: 14.1,
    audio: 'audio/scene-5.mp3',
  },
  {
    id: 'choices',
    number: 6,
    navLabel: 'Daily Choices',
    chapter: 'Your Daily Choices',
    narration:
      'Now it is your turn. In this game, you will face five everyday situations. Choose what you would do, and discover why some choices save more resources than others.',
    duration: 10.2,
    audio: 'audio/scene-6.mp3',
    interactive: true,
  },
  {
    id: 'quiz',
    number: 7,
    navLabel: 'Quiz',
    chapter: 'Knowledge Quiz',
    narration:
      "Let's test what you have learned. Answer each question, read the short explanation, and see your final score.",
    duration: 6.6,
    audio: 'audio/scene-7.mp3',
    interactive: true,
  },
  {
    id: 'action',
    number: 8,
    navLabel: 'Take Action',
    chapter: 'Your Next Step',
    narration:
      'Your next step starts today. Choose your personal commitments for home, for school, and for your community. Remember: families, schools, businesses and governments all have a role to play. The future is shaped by the choices we make together.',
    duration: 15.6,
    audio: 'audio/scene-8.mp3',
  },
]

/** Seconds of quiet after the narration before guided playback moves on. */
export const SCENE_TAIL = 3

export const TOTAL_DURATION = SCENES.reduce((sum, s) => sum + s.duration + SCENE_TAIL, 0)
