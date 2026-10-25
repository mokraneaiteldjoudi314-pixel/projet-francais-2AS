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

export type IconKey =
  | 'food' | 'water' | 'energy' | 'globe' | 'list' | 'fridge' | 'label' | 'leftovers' | 'compost'
  | 'tap' | 'shower' | 'leak' | 'washer' | 'rain' | 'school' | 'snow' | 'cloud' | 'drought'
  | 'bulb' | 'plug' | 'thermo' | 'sun' | 'factory' | 'gauge' | 'wind'
  | 'reduce' | 'bag' | 'reuse' | 'repair' | 'recycle' | 'sort' | 'box' | 'trash' | 'heart' | 'home' | 'users'

export type Tone = 'orange' | 'blue' | 'yellow' | 'green' | 'purple'

export interface Stat {
  icon: IconKey
  tone: Tone
  label: string
  value: string
  text: string
  sourceId: string
}

/** "Our Planet Today": only sourced figures (see the About panel for the links). */
export const PLANET_STATS: Stat[] = [
  { icon: 'food', tone: 'orange', label: 'Food waste', value: '1.05 billion t', text: 'of food wasted in 2022', sourceId: 'unep' },
  { icon: 'water', tone: 'blue', label: 'Fresh water', value: '≈ 2.5%', text: 'of Earth’s water is fresh', sourceId: 'usgs' },
  { icon: 'energy', tone: 'yellow', label: 'Electricity', value: 'Mostly fossil', text: 'coal and gas still lead', sourceId: 'iea' },
  { icon: 'globe', tone: 'green', label: 'Global impact', value: '8–10%', text: 'of greenhouse gases come from food loss and waste', sourceId: 'unep' },
]

export interface Cue {
  icon: IconKey
  title: string
  text: string
  /** Words from the narration: the item lights up when the voice reaches them. */
  cue: string
}

export interface Topic {
  eyebrow: string
  title: string
  accent: string
  lead: string
  image: string
  tone: Tone
  fact: { value: string; text: string; sourceId?: string }
  facts: Cue[]
  tips: Cue[]
}

export const TOPICS: Record<'food' | 'water' | 'energy' | 'reuse', Topic> = {
  food: {
    eyebrow: 'Chapter 02 · Food',
    title: 'Eat smart.',
    accent: 'Waste less.',
    lead: 'Plan, store and cook wisely: every meal is a chance to make a difference.',
    image: 'images/food.jpg',
    tone: 'orange',
    fact: { value: '≈ 60%', text: 'of wasted food is thrown away at home', sourceId: 'unep' },
    facts: [
      { icon: 'trash', title: '1.05 billion tonnes', text: 'of food were wasted in 2022 (UNEP).', cue: 'According to the United Nations' },
      { icon: 'home', title: 'Mostly at home', text: 'About 60% of it came from households.', cue: 'here is the surprising part' },
      { icon: 'water', title: 'Hidden costs', text: 'Water, energy, work and land are lost too.', cue: 'We also waste the water' },
      { icon: 'cloud', title: 'Warming gases', text: 'Food loss and waste: 8–10% of emissions (UNEP).', cue: 'when food rots' },
    ],
    tips: [
      { icon: 'list', title: 'Plan your meals', text: 'Check what you already have, write a list, and buy only what you need.', cue: 'First, plan your meals' },
      { icon: 'fridge', title: 'Store food well', text: 'Older products to the front of the fridge; freeze bread and fruit before they go bad.', cue: 'Second, store food' },
      { icon: 'label', title: 'Read the labels', text: '“Use by” is about safety. “Best before” is about quality: look, smell and taste.', cue: 'Third, understand the labels' },
      { icon: 'leftovers', title: 'Love leftovers', text: 'Cook the right portions and turn leftovers into soups, salads or sandwiches.', cue: 'Fourth, cook the right portions' },
      { icon: 'compost', title: 'Compost scraps', text: 'Peels and coffee grounds belong in the compost, not in the bin.', cue: 'Finally, if something' },
    ],
  },
  water: {
    eyebrow: 'Chapter 03 · Water',
    title: 'Every drop',
    accent: 'counts.',
    lead: 'Fresh water is rare and precious. Simple habits keep it flowing for everyone.',
    image: 'images/water.jpg',
    tone: 'blue',
    fact: { value: '≈ 2.5%', text: 'of all water on Earth is fresh water', sourceId: 'usgs' },
    facts: [
      { icon: 'water', title: 'Mostly salt water', text: 'Only about 2.5% of Earth’s water is fresh (USGS).', cue: 'But most of it is salt water' },
      { icon: 'snow', title: 'Hard to reach', text: 'Most fresh water is frozen or deep underground.', cue: 'And most of that fresh water' },
      { icon: 'box', title: 'In everything we use', text: 'Food, clothes and phones all need water to be made.', cue: 'Yet we need fresh water' },
      { icon: 'drought', title: 'Droughts', text: 'Dry periods are becoming more frequent in many regions.', cue: 'In many regions' },
    ],
    tips: [
      { icon: 'tap', title: 'Turn off the tap', text: 'While you brush your teeth, wash your hands or do the dishes.', cue: 'Turn off the tap while' },
      { icon: 'shower', title: 'Shorter showers', text: 'Choose a short shower instead of a bath.', cue: 'Take shorter showers' },
      { icon: 'leak', title: 'Fix leaks fast', text: 'A small drip, day and night, adds up to a lot of water.', cue: 'Fix leaking taps' },
      { icon: 'washer', title: 'Full loads only', text: 'Run the washing machine and dishwasher only when full.', cue: 'Run the washing machine' },
      { icon: 'rain', title: 'Use rainwater', text: 'Water plants with rainwater, in the evening when less evaporates.', cue: 'Collect rainwater' },
      { icon: 'school', title: 'At school too', text: 'Report leaks and never leave a tap running.', cue: 'At school, report' },
    ],
  },
  energy: {
    eyebrow: 'Chapter 04 · Energy',
    title: 'Use energy',
    accent: 'wisely.',
    lead: 'Every switch counts: efficiency saves money and protects the climate.',
    image: 'images/energy.jpg',
    tone: 'yellow',
    fact: { value: 'Most', text: 'of the world’s electricity still comes from fossil fuels', sourceId: 'iea' },
    facts: [
      { icon: 'factory', title: 'Fossil power', text: 'Coal and gas still produce most of the world’s electricity.', cue: 'Today, most of the world' },
      { icon: 'cloud', title: 'CO₂ and smog', text: 'Burning fuels heats the climate and pollutes the air.', cue: 'Burning them releases' },
      { icon: 'gauge', title: 'Efficiency first', text: 'The IEA calls efficiency one of the fastest, cheapest fixes.', cue: 'The International Energy Agency' },
      { icon: 'wind', title: 'Renewables', text: 'Sun and wind make electricity without burning fuel.', cue: 'when it is possible, choose renewable' },
    ],
    tips: [
      { icon: 'bulb', title: 'Lights off', text: 'Switch off when you leave a room and use daylight whenever you can.', cue: 'Switch off the lights when' },
      { icon: 'bulb', title: 'Choose LED', text: 'LED bulbs use much less electricity and last much longer.', cue: 'Replace old bulbs' },
      { icon: 'plug', title: 'No standby', text: 'Turn devices off completely and unplug chargers.', cue: 'on standby' },
      { icon: 'fridge', title: 'Fridge smart', text: 'Keep the door closed and let hot food cool before storing it.', cue: 'Keep the fridge door closed' },
      { icon: 'thermo', title: 'Winter warmth', text: 'Close doors and curtains, and wear a jumper before turning the heating up.', cue: 'In winter' },
      { icon: 'sun', title: 'Summer cool', text: 'Close the shutters in the hottest hours instead of cooling all day.', cue: 'In summer' },
    ],
  },
  reuse: {
    eyebrow: 'Chapter 05 · Reduce & Recycle',
    title: 'Reduce, reuse,',
    accent: 'recycle right.',
    lead: 'The best waste is the waste we never create.',
    image: 'images/recycle.jpg',
    tone: 'green',
    fact: { value: '3 Rs', text: 'reduce first, reuse often, recycle right' },
    facts: [
      { icon: 'box', title: 'Hidden footprint', text: 'Every object used raw materials, water and energy.', cue: 'Every object around us' },
      { icon: 'reduce', title: 'The three Rs', text: 'Reduce, reuse, recycle: always in that order.', cue: 'That is why environmental' },
      { icon: 'sort', title: 'Sort carefully', text: 'One wrong item can spoil a whole recycling bin.', cue: 'Empty and rinse' },
      { icon: 'heart', title: 'Zero waste', text: 'The best waste is the waste we never create.', cue: 'Remember: the best waste' },
    ],
    tips: [
      { icon: 'reduce', title: 'Reduce', text: 'Before buying, ask yourself: do I really need it?', cue: 'The first, and the most powerful' },
      { icon: 'bag', title: 'Skip single-use', text: 'Less packaging, loose fruit, and no plastic bags, straws or cups.', cue: 'Choose products with less packaging' },
      { icon: 'reuse', title: 'Reuse', text: 'Carry a bottle and a cloth bag; store food in glass jars.', cue: 'The second is reuse' },
      { icon: 'repair', title: 'Repair & donate', text: 'Fix it, swap it or give it a second life.', cue: 'Repair a broken object' },
      { icon: 'recycle', title: 'Recycle', text: 'Paper, plastic and metal, glass, and food scraps: each in its bin.', cue: 'The third is recycle' },
    ],
  },
}

export const QUICK_TIPS = [
  'Freeze bread before it goes stale: toast it straight from the freezer.',
  'A full dishwasher usually uses less water than washing the same dishes by hand under a running tap.',
  'Put a “use me first” box in the fridge for food that needs eating soon.',
  'Unplug chargers when your phone is full.',
  'Carry a reusable bottle: refill it instead of buying a new one.',
  'Open the curtains before you switch on a light.',
  'Repair before you replace: many clothes only need a button or a stitch.',
  'Water plants in the evening so less water evaporates.',
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

export const GAME_MAX = GAME_STEPS.reduce((n, s) => n + Math.max(...s.options.map((o) => o.points)), 0)

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
    question: 'Which of the three Rs should come first?',
    answers: ['Recycle', 'Reduce', 'Reuse'],
    correct: 1,
    explanation: 'The best waste is the waste we never create: reduce first, reuse often, recycle right.',
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
  { id: 'reuse', text: 'I will carry a reusable bottle and bag.', short: 'carry a reusable bottle and bag' },
  { id: 'sort', text: 'I will sort my waste correctly.', short: 'sort my waste correctly' },
  { id: 'encourage', text: 'I will encourage others without blaming them.', short: 'encourage others kindly' },
]
