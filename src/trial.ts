export const traits = [
  "insight",
  "loyalty",
  "freedom",
  "courage",
  "resolve",
  "curiosity",
] as const;
export type Trait = (typeof traits)[number];
export type Scores = Record<Trait, number>;
export type Choice = { text: string; trait: Trait; secondary: Trait };
export type Scene = {
  chapter: string;
  title: string;
  story: string;
  choices: Choice[];
};
const choice = (text: string, trait: Trait, secondary: Trait): Choice => ({
  text,
  trait,
  secondary,
});
export const scenes: Scene[] = [
  {
    chapter: "The crossing",
    title: "The bridge falls silent.",
    story:
      "Mist hides the far shore. Behind you, a stranger hesitates. What do you do?",
    choices: [
      choice("Test the stones before crossing.", "insight", "resolve"),
      choice("Offer the stranger your hand.", "loyalty", "courage"),
      choice("Find a path along the ridge.", "freedom", "curiosity"),
    ],
  },
  {
    chapter: "The lantern",
    title: "One light. Two paths.",
    story:
      "Beyond the bridge, you find a lantern beside a ruined watchtower. One path climbs into the wind; the other follows fresh tracks into a grove. You hear a voice calling from somewhere out of sight.",
    choices: [
      choice("Follow the voice into the grove.", "courage", "loyalty"),
      choice("Hold your ground and listen.", "resolve", "insight"),
      choice("Study the tracks for a new way through.", "curiosity", "freedom"),
    ],
  },
  {
    chapter: "The witness",
    title: "Someone has been here before.",
    story:
      "A traveler rests beside an extinguished fire. They warn you that the valley rewards those who take what they need. An abandoned satchel lies nearby, its clasp marked with an unfamiliar symbol.",
    choices: [
      choice("Read the symbol before touching it.", "insight", "curiosity"),
      choice("Leave supplies for the next traveler.", "loyalty", "resolve"),
      choice("Set out without taking the satchel.", "freedom", "courage"),
    ],
  },
  {
    chapter: "The shadow",
    title: "The sky grows smaller.",
    story:
      "A great shadow moves across the clearing. The dragon lands beyond the trees, breaking the quiet with a low breath. It has seen you. For a moment, neither of you moves.",
    choices: [
      choice("Step into the clearing, unarmed.", "courage", "freedom"),
      choice("Stay still and let it approach.", "resolve", "loyalty"),
      choice("Watch how it moves before responding.", "curiosity", "insight"),
    ],
  },
  {
    chapter: "The turning",
    title: "The fog changes the way.",
    story:
      "The path you marked has vanished in the fog. A distant bell sounds once. The traveler from the bridge is still behind you, and the wind is bringing the scent of rain. You must decide what matters now.",
    choices: [
      choice("Trace the wind back to higher ground.", "insight", "freedom"),
      choice("Return for the traveler.", "loyalty", "curiosity"),
      choice("Trust your own direction and move on.", "freedom", "resolve"),
    ],
  },
  {
    chapter: "The offer",
    title: "Nothing is freely given.",
    story:
      "At a stone arch, another traveler offers you a map in exchange for your lantern. The map looks old, but the route is unfamiliar. Darkness is close, and you cannot carry every advantage with you.",
    choices: [
      choice("Keep the lantern. Face what comes.", "courage", "resolve"),
      choice("Choose carefully, then stand by it.", "resolve", "insight"),
      choice("Trade for a route you have never seen.", "curiosity", "loyalty"),
    ],
  },
  {
    chapter: "The stillness",
    title: "A gaze meets yours.",
    story:
      "The dragon waits on the far side of a pool. It lowers its head, studying you without a sound. In the water, you see the bridge, the lantern, and every choice that brought you here. How do you answer?",
    choices: [
      choice("Let your actions speak before your words.", "insight", "courage"),
      choice("Show that a bond is a promise to keep.", "loyalty", "resolve"),
      choice("Offer partnership, never obedience.", "freedom", "curiosity"),
    ],
  },
  {
    chapter: "The oath",
    title: "What will you carry forward?",
    story:
      "The valley is quiet at last. The dragon opens one wing, making room beside it. This is not a reward for being fearless. It is an invitation to become something together. What do you promise?",
    choices: [
      choice("To act, even when I am afraid.", "courage", "loyalty"),
      choice("To remain when the easy path is gone.", "resolve", "freedom"),
      choice("To keep asking what lies beyond.", "curiosity", "insight"),
    ],
  },
];
export type Dragon = {
  id: string;
  name: string;
  color: string;
  title: string;
  trait: Trait;
  tail: string;
  description: string;
  oath: string;
};
export const dragons: Dragon[] = [
  {
    id: "vesper",
    name: "Vesper",
    color: "Black",
    title: "The Quiet Sentinel",
    trait: "resolve",
    tail: "Morningstar",
    description:
      "Vesper answers a steady heart. You do not need the loudest voice to hold your ground. Your choices show the patience to stay, and the strength to mean what you promise.",
    oath: "I will remain when the easy path is gone.",
  },
  {
    id: "aureth",
    name: "Aureth",
    color: "Blue",
    title: "The Unbound Horizon",
    trait: "freedom",
    tail: "Scorpion",
    description:
      "Aureth sees a companion who can choose a path of their own. You value partnership over permission. Where others see a boundary, you see the beginning of another way.",
    oath: "We will choose our own horizon.",
  },
  {
    id: "brannoc",
    name: "Brannoc",
    color: "Brown",
    title: "The Hearthkeeper",
    trait: "loyalty",
    tail: "Club",
    description:
      "Brannoc finds strength in the way you make room for others. A bond is more than a moment of courage; it is a promise you keep when no one is watching.",
    oath: "No one who walks with me walks alone.",
  },
  {
    id: "sylvara",
    name: "Sylvara",
    color: "Green",
    title: "The Keeper of Still Waters",
    trait: "insight",
    tail: "Sword",
    description:
      "Sylvara notices what you notice. You read the space between action and consequence. Your calm attention makes you a companion who can find clarity when the valley grows loud.",
    oath: "I will listen before I decide.",
  },
  {
    id: "pyrren",
    name: "Pyrren",
    color: "Red",
    title: "The Emberhearted",
    trait: "courage",
    tail: "Dagger",
    description:
      "Pyrren answers the courage to take a first step. You know fear, and you move with it. Your bond begins in the choice to face what matters, rather than wait for certainty.",
    oath: "I will act, even when I am afraid.",
  },
  {
    id: "solvane",
    name: "Solvane",
    color: "Orange",
    title: "The Seeker of Dawn",
    trait: "curiosity",
    tail: "Sword",
    description:
      "Solvane senses a mind that has not stopped wondering. You follow the unfamiliar with open eyes. Together, you will find the stories hidden beyond the well-worn path.",
    oath: "There will always be more to discover.",
  },
];
export const RULE_VERSION = 1;
export function scoreAnswers(answers: number[]): Scores {
  const scores = Object.fromEntries(
    traits.map((trait) => [trait, 0]),
  ) as Scores;
  answers.forEach((answer, index) => {
    const selected = scenes[index]?.choices[answer];
    if (!selected) throw new Error("Invalid trial answer");
    scores[selected.trait] += 3;
    scores[selected.secondary] += 1;
  });
  return scores;
}
export function rankTraits(scores: Scores): Trait[] {
  return [...traits].sort(
    (a, b) => scores[b] - scores[a] || traits.indexOf(a) - traits.indexOf(b),
  );
}
export function getResult(answers: number[]): {
  dragon: Dragon;
  scores: Scores;
  ranking: Trait[];
} {
  if (answers.length !== scenes.length)
    throw new Error("Complete all eight choices first");
  const scores = scoreAnswers(answers);
  const ranking = rankTraits(scores);
  return {
    dragon: dragons.find((d) => d.trait === ranking[0])!,
    scores,
    ranking,
  };
}
export function validAnswers(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.length <= scenes.length &&
    value.every(
      (answer, index) =>
        Number.isInteger(answer) &&
        answer >= 0 &&
        answer < scenes[index].choices.length,
    )
  );
}
export function parseSavedRun(
  raw: string | null,
): { answers: number[]; step: number } | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (
      data.version !== RULE_VERSION ||
      !validAnswers(data.answers) ||
      !Number.isInteger(data.step) ||
      data.step < 0 ||
      data.step > data.answers.length ||
      data.step >= scenes.length
    )
      return null;
    return { answers: data.answers, step: data.step };
  } catch {
    return null;
  }
}
export function remainingTime(deadline: number, now = Date.now()) {
  return Math.max(0, deadline - now);
}
export function formatDuration(ms: number) {
  const seconds = Math.ceil(Math.max(0, ms) / 1000);
  return `${String(Math.floor(seconds / 3600)).padStart(2, "0")}:${String(Math.floor(seconds / 60) % 60).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}
