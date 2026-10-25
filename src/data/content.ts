export interface Source {
  id: string
  name: string
  title: string
  url: string
}

export const SOURCES: Source[] = [
  {
    id: 'unep',
    name: 'UNEP',
    title: 'Food Waste Index Report 2024',
    url: 'https://www.unep.org/resources/publication/food-waste-index-report-2024',
  },
  {
    id: 'fao',
    name: 'FAO',
    title: 'Food loss and waste: platform and data',
    url: 'https://www.fao.org/platform-food-loss-waste/en/',
  },
  {
    id: 'usgs',
    name: 'USGS',
    title: 'Where is Earth’s water?',
    url: 'https://www.usgs.gov/special-topics/water-science-school/science/where-earths-water',
  },
  {
    id: 'iea',
    name: 'IEA',
    title: 'Energy efficiency',
    url: 'https://www.iea.org/topics/energy-efficiency',
  },
]

export interface ProblemPanel {
  id: 'food' | 'water' | 'energy'
  title: string
  lead: string
  stat: string
  statLabel: string
  sourceId: string
  detail: string[]
}

export const PROBLEM_PANELS: ProblemPanel[] = [
  {
    id: 'food',
    title: 'Food Waste',
    lead: 'Food is thrown away while many people still lack reliable access to it.',
    stat: '1.05 billion t',
    statLabel: 'of food wasted in 2022, according to UNEP. About 60% of it came from households.',
    sourceId: 'unep',
    detail: [
      'Wasting food also wastes the land, water and energy used to grow, transport and store it.',
      'UNEP estimates that food loss and waste produce 8–10% of global greenhouse gas emissions.',
    ],
  },
  {
    id: 'water',
    title: 'Water Waste',
    lead: 'Fresh water is a limited and essential resource for people and nature.',
    stat: '≈ 2.5%',
    statLabel: 'of all water on Earth is fresh water, and most of it is frozen or underground (USGS).',
    sourceId: 'usgs',
    detail: [
      'Treating and pumping clean water to our homes also uses energy.',
      'Polluting rivers and lakes makes even less water safe to use.',
    ],
  },
  {
    id: 'energy',
    title: 'Energy Waste',
    lead: 'Energy we do not need still has to be produced, which increases demand and impact.',
    stat: 'Most',
    statLabel: 'of the world’s electricity is still generated from fossil fuels such as coal and gas (IEA).',
    sourceId: 'iea',
    detail: [
      'The IEA calls energy efficiency a key way to cut costs and emissions at the same time.',
      'Lights, devices, heating and cooling left on for no reason are everyday sources of waste.',
    ],
  },
]

export const FOOD_ACTIONS = [
  { title: 'Plan meals', text: 'Check what you already have and shop with a list.' },
  { title: 'Store food well', text: 'Keep the fridge cold and put older food at the front.' },
  { title: 'Read date labels', text: '“Use by” is about safety. “Best before” is about quality.' },
  { title: 'Use leftovers safely', text: 'Cool, cover and refrigerate them, then eat them soon.' },
  { title: 'Share surplus', text: 'Donate suitable food where local rules allow it.' },
  { title: 'Compost scraps', text: 'Turn peels and scraps into soil when you can.' },
]

export interface Habit {
  id: string
  habit: string
  problem: string
  tip: string
}

export const KITCHEN_HABITS: Habit[] = [
  {
    id: 'too-much',
    habit: 'Buying too much',
    problem: 'Extra food goes off before anyone can eat it.',
    tip: 'Check the fridge and cupboards first, plan a few meals, and shop with a list. Buy loose fruit and vegetables when you only need a few.',
  },
  {
    id: 'leftovers',
    habit: 'Forgetting leftovers',
    problem: 'Leftovers hide at the back of the fridge until they spoil.',
    tip: 'Put leftovers in clear, covered containers at the front of the fridge, note the date, and eat them within a day or two. When unsure, follow local food-safety advice.',
  },
  {
    id: 'storage',
    habit: 'Storing food incorrectly',
    problem: 'Food spoils faster when it is too warm or badly wrapped.',
    tip: 'Keep the fridge at 5 °C or below, as food-safety agencies commonly advise. Seal opened food, and keep raw meat on the lowest shelf.',
  },
  {
    id: 'labels',
    habit: 'Misreading date labels',
    problem: 'Good food is thrown away just because a date has passed.',
    tip: 'Never eat food after its “use by” date. After a “best before” date, food is often still fine: look, smell and check before deciding.',
  },
  {
    id: 'portions',
    habit: 'Cooking too much',
    problem: 'Big portions end up on the plate and then in the bin.',
    tip: 'Cook portions that match how many people are eating. Freeze extra portions quickly to enjoy another day.',
  },
]

export interface Hotspot {
  id: string
  label: string
  title: string
  text: string
  x: number
  y: number
}

export const WATER_HOTSPOTS: Hotspot[] = [
  { id: 'tap', label: 'Tap', title: 'Turn off the tap', text: 'Turn off the tap while you brush your teeth or soap your hands.', x: 14, y: 22 },
  { id: 'leak', label: 'Leak', title: 'Fix leaking taps', text: 'A dripping tap wastes water all day long. Report or repair leaks quickly.', x: 34, y: 70 },
  { id: 'wash', label: 'Washing', title: 'Wash efficiently', text: 'Run washing machines and dishwashers with full loads, using eco settings when available.', x: 52, y: 30 },
  { id: 'plants', label: 'Plants', title: 'Water plants thoughtfully', text: 'Water in the cool morning or evening and use a watering can instead of a running hose.', x: 72, y: 74 },
  { id: 'river', label: 'River', title: 'Keep waterways clean', text: 'Never pour oil, paint or chemicals down drains. They can end up in rivers and lakes.', x: 84, y: 26 },
]

export interface HabitChoice {
  id: string
  situation: string
  wasteful: string
  smart: string
  feedback: string
}

export const WATER_CHALLENGE: HabitChoice[] = [
  {
    id: 'brush',
    situation: 'Brushing your teeth',
    wasteful: 'Leave the tap running',
    smart: 'Turn the tap off',
    feedback: 'Water only needs to run when you rinse.',
  },
  {
    id: 'shower',
    situation: 'Taking a shower',
    wasteful: 'Stay in for a long time',
    smart: 'Keep it short',
    feedback: 'A shorter shower saves water and the energy used to heat it.',
  },
  {
    id: 'dishes',
    situation: 'Washing the dishes',
    wasteful: 'Rinse each plate under a running tap',
    smart: 'Fill a bowl or run a full dishwasher',
    feedback: 'Washing in one go uses water more carefully.',
  },
]

export const ENERGY_HOTSPOTS: Hotspot[] = [
  { id: 'lights', label: 'Lights', title: 'Switch off lights', text: 'Turn lights off when you leave a room or when daylight is enough.', x: 18, y: 56 },
  { id: 'devices', label: 'Devices', title: 'Turn devices off', text: 'Switch off screens, consoles and chargers instead of leaving them on for no reason.', x: 40, y: 82 },
  { id: 'daylight', label: 'Daylight', title: 'Use natural daylight', text: 'Open curtains and work near windows during the day.', x: 56, y: 36 },
  { id: 'efficient', label: 'Efficient', title: 'Choose efficient equipment', text: 'LED bulbs and efficient appliances provide the same service with less energy.', x: 30, y: 22 },
  { id: 'heating', label: 'Heating', title: 'Heat and cool sensibly', text: 'Close doors and windows when heating or cooling, and avoid extreme settings.', x: 72, y: 70 },
  { id: 'renewable', label: 'Renewables', title: 'Learn about renewables', text: 'Solar and wind power produce electricity without burning fuel.', x: 84, y: 18 },
]

export interface RoutineStep {
  time: string
  wasteful: string
  smart: string
  /** Illustrative demand level from 1 (low) to 5 (high), not measured data. */
  wastefulLevel: number
  smartLevel: number
}

export const ENERGY_ROUTINE: RoutineStep[] = [
  { time: '07:00', wasteful: 'Every light on in the house', smart: 'Curtains open, one light where needed', wastefulLevel: 4, smartLevel: 2 },
  { time: '08:00', wasteful: 'TV left on in an empty room', smart: 'Screens switched off before leaving', wastefulLevel: 3, smartLevel: 1 },
  { time: '13:00', wasteful: 'Heating high with a window open', smart: 'Window closed, moderate setting', wastefulLevel: 5, smartLevel: 3 },
  { time: '18:00', wasteful: 'Half-empty washing machine', smart: 'Full load on an eco setting', wastefulLevel: 4, smartLevel: 2 },
  { time: '23:00', wasteful: 'Console and chargers left on all night', smart: 'Devices off, chargers unplugged', wastefulLevel: 3, smartLevel: 1 },
]

export interface GameOption {
  text: string
  points: 0 | 1 | 2
  feedback: string
}

export interface GameStep {
  id: string
  place: string
  situation: string
  options: GameOption[]
}

export const GAME_STEPS: GameStep[] = [
  {
    id: 'lunch',
    place: 'Lunch time',
    situation: 'You are hungry and buying lunch. What do you do?',
    options: [
      { text: 'Buy the biggest meal deal, even if you rarely finish it', points: 0, feedback: 'Food you cannot finish usually ends up in the bin.' },
      { text: 'Choose a portion that matches how hungry you are', points: 2, feedback: 'Great choice: the right portion means nothing is wasted.' },
      { text: 'Buy extra snacks “just in case”', points: 1, feedback: 'Snacks can keep, but buying only what you need avoids waste.' },
    ],
  },
  {
    id: 'classroom',
    place: 'At school',
    situation: 'You are the last person to leave the classroom.',
    options: [
      { text: 'Leave everything as it is', points: 0, feedback: 'Lights and a projector would keep using energy in an empty room.' },
      { text: 'Switch off the lights only', points: 1, feedback: 'Good start. The projector and screens should be switched off too.' },
      { text: 'Switch off the lights, projector and screens', points: 2, feedback: 'Perfect: nothing is left running for nobody.' },
    ],
  },
  {
    id: 'shower',
    place: 'Morning routine',
    situation: 'It is time for your shower.',
    options: [
      { text: 'Take a short shower', points: 2, feedback: 'A short shower saves water and the energy used to heat it.' },
      { text: 'Stay under the hot water as long as you like', points: 0, feedback: 'Long hot showers use a lot of water and energy.' },
    ],
  },
  {
    id: 'leftovers',
    place: 'After dinner',
    situation: 'There is pasta left over after dinner.',
    options: [
      { text: 'Throw it away', points: 0, feedback: 'Good food wasted, along with everything used to produce it.' },
      { text: 'Leave it on the counter overnight', points: 0, feedback: 'Cooked food left out too long can become unsafe to eat.' },
      { text: 'Cool it, cover it, refrigerate it and eat it tomorrow', points: 2, feedback: 'Excellent: tomorrow’s lunch is ready and nothing is wasted.' },
    ],
  },
  {
    id: 'charging',
    place: 'Bedtime',
    situation: 'Your phone is fully charged.',
    options: [
      { text: 'Unplug the phone and switch off the charger', points: 2, feedback: 'Well done: devices and chargers should not stay on for no reason.' },
      { text: 'Leave the charger plugged in and switched on', points: 1, feedback: 'A charger left on uses a little energy. Switching it off is better.' },
    ],
  },
]

export interface QuizQuestion {
  question: string
  answers: string[]
  correct: number
  explanation: string
}

export const QUIZ: QuizQuestion[] = [
  {
    question: 'Which habit helps most to reduce food waste at home?',
    answers: ['Buying in bulk without a plan', 'Planning meals and shopping with a list', 'Cooking extra food every day'],
    correct: 1,
    explanation: 'Planning means you buy what you will actually eat.',
  },
  {
    question: 'What does a “best before” date usually tell you?',
    answers: ['The food is dangerous after this date', 'The food is at its best quality before this date', 'The food must be frozen on this date'],
    correct: 1,
    explanation: '“Best before” is about quality. “Use by” is the date to respect for safety.',
  },
  {
    question: 'According to UNEP’s 2024 report, where does most food waste happen?',
    answers: ['In households', 'In restaurants', 'In shops'],
    correct: 0,
    explanation: 'UNEP found that about 60% of food waste in 2022 came from households.',
  },
  {
    question: 'Roughly how much of Earth’s water is fresh water?',
    answers: ['About 2.5%', 'About 25%', 'About 70%'],
    correct: 0,
    explanation: 'According to the USGS, only about 2.5% is fresh, and most of it is frozen or underground.',
  },
  {
    question: 'Which choice saves energy?',
    answers: ['Leaving the TV on in an empty room', 'Opening the curtains and using daylight', 'Heating with the window open'],
    correct: 1,
    explanation: 'Daylight is free. Lights only need to be on when it is not enough.',
  },
  {
    question: 'Why does wasting food also waste water and energy?',
    answers: ['It does not', 'Growing, transporting and storing food uses water and energy', 'Because bins need to be washed'],
    correct: 1,
    explanation: 'Every wasted meal carries the resources that were used to produce it.',
  },
]

export const ACTION_GROUPS = [
  {
    id: 'home',
    title: 'At Home',
    actions: ['Plan meals and check the fridge before shopping', 'Turn off taps and keep showers short', 'Switch off lights and devices you are not using'],
  },
  {
    id: 'school',
    title: 'At School',
    actions: ['Take only the food you will eat at lunch', 'Switch off classroom lights and screens', 'Report leaking taps to staff'],
  },
  {
    id: 'community',
    title: 'In Your Community',
    actions: ['Support food sharing or donation projects', 'Keep streets and rivers free of litter', 'Talk about simple habits with friends and family'],
  },
]

export const COMMITMENTS = [
  { id: 'plan', text: 'I will plan food purchases more carefully.', short: 'plan food purchases' },
  { id: 'water', text: 'I will avoid wasting water.', short: 'save water' },
  { id: 'energy', text: 'I will switch off unused lights and devices.', short: 'switch off unused lights and devices' },
  { id: 'leftovers', text: 'I will use leftovers safely instead of throwing them away.', short: 'use leftovers' },
  { id: 'encourage', text: 'I will encourage others without blaming them.', short: 'encourage others kindly' },
]
