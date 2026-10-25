export type SceneId = 'home' | 'food' | 'water' | 'energy' | 'reuse' | 'game' | 'quiz' | 'action'

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
    navLabel: "Home",
    chapter: "Introduction",
    narration:
      "Welcome to Waste Less, Live Better. Take a moment to look at our planet. It gives us everything we need to live: the food on our plates, the water in our glasses, and the energy that lights our homes and our schools. But these resources are not endless. Every day, around the world, huge amounts of them are wasted, often without anyone noticing. A forgotten yoghurt at the back of the fridge. A tap left running while we brush our teeth. A light shining in an empty room. On their own, these moments seem small. Added together, across billions of homes, they become one of the biggest challenges of our time. The good news is that the solution also starts with small things. In the next ten minutes, we will explore four areas of everyday life: food, water, energy, and the objects we buy and throw away. For each one, you will discover simple facts, practical habits, and choices you can make today. Then you will test yourself with a mini game and a short quiz, and finally, you will build your own personal action plan. Look at the panel on the right: it shows where our planet stands today. Keep these numbers in mind as we travel together. You can pause at any time, turn on the captions, or jump to any chapter using the timeline below. Are you ready? Let's start the experience. Because a cleaner planet starts with you.",
    duration: 84.72,
    audio: 'audio/scene-1.mp3',
  },
  {
    id: 'food',
    number: 2,
    navLabel: "Food",
    chapter: "Food Waste",
    narration:
      "Let's begin in the kitchen, with food. According to the United Nations Environment Programme, about one point oh five billion tonnes of food were wasted in twenty twenty-two. That is more than one billion tonnes of food that was grown, harvested, transported and cooked, and then simply thrown away. And here is the surprising part: around sixty percent of that waste happened at home, in households like yours and mine. Not in restaurants. Not in supermarkets. In our own kitchens. When we waste food, we do not only waste the food itself. We also waste the water used to grow it, the energy used to transport and cook it, the work of the farmers, and the land where it was grown. And when food rots in a landfill, it releases greenhouse gases that warm our planet. So, what can we do? First, plan your meals before you go shopping, check what you already have, and write a list. Buy only what you need. Second, store food correctly: put older products at the front of the fridge, so you use them first, and freeze bread or fruit before they go bad. Third, understand the labels. Use by is about safety. Best before is about quality, and food is often still good after that date: look, smell and taste before you throw it away. Fourth, cook the right portions, and turn leftovers into new meals, like soups, salads, omelettes or sandwiches. Finally, if something really cannot be eaten, like peels or coffee grounds, compost it instead of putting it in the bin. Eat smart. Waste less. Every meal is a chance to make a difference.",
    duration: 98.4,
    audio: 'audio/scene-2.mp3',
  },
  {
    id: 'water',
    number: 3,
    navLabel: "Water",
    chapter: "Water",
    narration:
      "Now, let's talk about water. When we look at a picture of the Earth, we see blue almost everywhere. It seems that water is unlimited. But most of it is salt water, in the oceans. According to the United States Geological Survey, only about two and a half percent of all the water on Earth is fresh water. And most of that fresh water is frozen in ice caps and glaciers, or hidden deep underground. Only a tiny part is easy for us to reach and use. Yet we need fresh water for drinking, cooking and washing, for growing our food, and for making almost everything we buy, from clothes to phones. In many regions, including around the Mediterranean, droughts are becoming more frequent, and every drop matters. At home, the biggest savings come from simple habits. Turn off the tap while you brush your teeth, wash your hands or do the dishes. Take shorter showers instead of baths. Fix leaking taps and toilets quickly, because a small drip, day and night, adds up to a surprising amount of water. Run the washing machine and the dishwasher only when they are full. Collect rainwater to water the plants, and water the garden in the evening, when less water evaporates. At school, report any leak you see, and never leave a tap running. Every drop counts. And every drop we save stays available for people, for farmers, and for nature.",
    duration: 83.36,
    audio: 'audio/scene-3.mp3',
  },
  {
    id: 'energy',
    number: 4,
    navLabel: "Energy",
    chapter: "Energy",
    narration:
      "Next, energy. Electricity seems invisible: we press a switch, and the light turns on. But that electricity has to be produced somewhere. Today, most of the world's electricity still comes from burning fossil fuels, like coal and gas. Burning them releases carbon dioxide, the main gas responsible for climate change, and it pollutes the air we breathe. The International Energy Agency explains that energy efficiency, which means getting the same result while using less energy, is one of the fastest and cheapest ways to reduce emissions. And efficiency starts at home. Switch off the lights when you leave a room, and use natural daylight whenever you can. Replace old bulbs with LED bulbs, which use much less electricity and last much longer. Don't leave devices on standby: turn off the television, the games console and the computer completely, and unplug chargers when you are not using them. Keep the fridge door closed, and let hot food cool down before you put it inside. In winter, close doors and curtains to keep the heat in, and wear a warm jumper instead of turning the heating up. In summer, close the shutters during the hottest hours, instead of running the air conditioning all day. And when it is possible, choose renewable energy, from the sun and the wind, like the solar panels on this house. Use energy wisely. It saves money for your family, and it protects the climate for everyone.",
    duration: 85.76,
    audio: 'audio/scene-4.mp3',
  },
  {
    id: 'reuse',
    number: 5,
    navLabel: "Reduce & Recycle",
    chapter: "Reduce & Reuse",
    narration:
      "Now, let's look at the things we buy and throw away. Every object around us, a phone, a T-shirt, a plastic bottle, was made using raw materials, water and energy. When we throw it away after a short time, all of those resources are lost with it. That is why environmental experts use a simple order of priorities, often called the three Rs: reduce, reuse, recycle. The first, and the most powerful, is reduce. Before buying something, ask yourself: do I really need it? Choose products with less packaging, buy loose fruit and vegetables, and say no to single-use items like plastic bags, straws and disposable cups. The second is reuse. Carry a reusable water bottle and a cloth bag. Use glass jars to store food. Repair a broken object instead of replacing it, and give clothes, books and toys a second life by donating, swapping or selling them. The third is recycle. When an object really reaches the end of its life, sort it correctly: paper and cardboard in one bin, plastic and metal in another, glass in its own container, and food scraps in the compost. Empty and rinse containers, and follow your local sorting rules, because one badly sorted item can spoil a whole bin. Remember: the best waste is the waste we never create. Reduce first, reuse often, and recycle right.",
    duration: 87.76,
    audio: 'audio/scene-5.mp3',
  },
  {
    id: 'game',
    number: 6,
    navLabel: "Mini Game",
    chapter: "Mini Game",
    narration:
      "Now it's your turn to play! In this mini game, you will face five everyday situations, at home and at school. For each situation, there are three possible choices. Read them carefully, and pick the one that saves the most resources. After each answer, you will see a short explanation, and you will earn points for the good choices. There is no time limit, so take your time, and think about everything you have learned about food, water, energy and waste. Make the right choices, and help our little planet smile! When you have finished, press next, or use the arrow, to continue to the quiz.",
    duration: 35.6,
    audio: 'audio/scene-6.mp3',
    interactive: true,
  },
  {
    id: 'quiz',
    number: 7,
    navLabel: "Quiz",
    chapter: "Quiz",
    narration:
      "It's quiz time! What's your impact? Six questions will check what you remember from this journey. Some questions are about facts, like how much of the Earth's water is fresh, and others are about everyday choices at home and at school. Choose your answer, then read the short explanation to learn even more. Don't worry about mistakes: every wrong answer is a chance to learn something new. At the end, you will see your final score. Ready? Let's see how much you know!",
    duration: 28.32,
    audio: 'audio/scene-7.mp3',
    interactive: true,
  },
  {
    id: 'action',
    number: 8,
    navLabel: "Take Action",
    chapter: "Take Action",
    narration:
      "Congratulations! You have reached the final chapter: taking action. Throughout this journey, we have seen that waste is not only a problem for factories or governments. It is also hidden in our daily routines: in our fridges, in our bathrooms, behind our light switches, and in our bins. And that means that each of us has real power to change things. Real change starts with small steps. Choose a few actions from this panel, and build your personal plan. At home, you could plan the week's meals, take shorter showers, and switch off your devices at night. At school, you could carry a reusable bottle, sort your waste correctly, and switch off the lights when the classroom is empty. In your community, you could donate clothes and toys, join a clean-up day, or simply share these ideas with your family and friends. Don't try to change everything at once. Start with one habit, repeat it every day for a few weeks, and it will become automatic. Then add another one. When many people make small changes, the impact becomes huge: less waste, saved resources, and a healthier planet for all of us. Thank you for watching Waste Less, Live Better. Remember: small actions make a big impact. And a cleaner planet starts with you.",
    duration: 76.72,
    audio: 'audio/scene-8.mp3',
  },
]

/** Seconds of quiet after each narration before guided playback moves on (keeps the full tour at 10:00). */
export const SCENE_TAIL = 2.42

export const sceneLength = (s: SceneMeta) => s.duration + SCENE_TAIL

export const TOTAL_DURATION = SCENES.reduce((sum, s) => sum + sceneLength(s), 0)

/** Start time of each scene on the full timeline. */
export const SCENE_STARTS = SCENES.map((_, i) => SCENES.slice(0, i).reduce((sum, s) => sum + sceneLength(s), 0))
