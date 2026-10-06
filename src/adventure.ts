import { dragons, getResult, scenes, validAnswers, type Scene } from "./trial";

export const JOURNAL_KEY = "threshingday:journeys:v1";
export const routes = [
  {
    id: "river",
    name: "The Sunken Way",
    hint: "Test the stones before crossing.",
    art: "crossing",
  },
  {
    id: "grove",
    name: "The Lantern Grove",
    hint: "Offer the stranger your hand.",
    art: "brannoc",
  },
  {
    id: "ridge",
    name: "The Windward Ridge",
    hint: "Find a path along the ridge.",
    art: "aureth",
  },
] as const;

type Episode = [
  title: string,
  story: string,
  choices: [string, string, string],
];
const entrances: Episode[] = [
  [
    "A stair beneath the river.",
    "Your careful foot finds a submerged stair. You light your lantern. Below the bridge, a voice calls from behind a sluice gate.",
    [
      "Enter the flooded passage to reach the voice.",
      "Brace the gate and listen before moving.",
      "Inspect the watermarks for another entrance.",
    ],
  ],
  [
    "The stranger knows a way.",
    "You bring the stranger across. They offer a lantern and lead you into a grove, where three bells hang above an overgrown arch. One rings without wind.",
    [
      "Follow the ringing bell into the dark.",
      "Wait beside the stranger until the ringing stops.",
      "Examine the arch for a hidden path.",
    ],
  ],
  [
    "Above the cloud line.",
    "You carry your lantern up the ridge. A signal tower stands above the mist. Its beacon is dark, but a torn pennant moves inside the doorway.",
    [
      "Climb inside and call to whoever is there.",
      "Anchor yourself at the doorway and listen.",
      "Circle the tower to find a forgotten stair.",
    ],
  ],
];
const encounters: Episode[][] = [
  [
    [
      "The keeper behind the gate.",
      "You reach a stranded keeper. Beside them lies a brass key with a wave engraved into its bow. The water is rising around both of you.",
      [
        "Read the key's markings to find the outlet.",
        "Give the keeper your rope and help them climb.",
        "Leave the key and make your own way out.",
      ],
    ],
    [
      "The river holds its breath.",
      "Holding the gate still reveals a rhythm: three surges, then silence. An old ferry is caught below you, its rope frayed against the stone.",
      [
        "Study the surges and choose the quiet moment.",
        "Secure the ferry for whoever comes next.",
        "Step onto the bank and follow the open river.",
      ],
    ],
    [
      "A map written in water.",
      "The watermarks lead to a dry tunnel. Lines cut into its wall trace a crossing that no longer exists. A lantern glows at the far end.",
      [
        "Decipher where the lost crossing once stood.",
        "Leave your spare wick for the next traveler.",
        "Follow the unmarked tunnel toward daylight.",
      ],
    ],
  ],
  [
    [
      "The bell has a keeper.",
      "Beneath the ringing bell, a young traveler is tangled in silver roots. They reach toward a carved symbol, afraid to touch it.",
      [
        "Read the carving before loosening the roots.",
        "Untangle the traveler and lead them out.",
        "Find a new passage around the roots.",
      ],
    ],
    [
      "A quiet bargain.",
      "Your patience settles the bells. The stranger shows you a shelter hidden beneath the roots. There is only enough dry wood for one fire.",
      [
        "Look for signs of who built the shelter.",
        "Build the fire for the travelers behind you.",
        "Leave the shelter and follow the evening light.",
      ],
    ],
    [
      "The door inside the tree.",
      "Behind the arch, you uncover a door shaped into a living trunk. A small bundle of provisions rests on its threshold.",
      [
        "Study the door's pattern before opening it.",
        "Add your provisions to the bundle.",
        "Take the untrodden path beyond the tree.",
      ],
    ],
  ],
  [
    [
      "A signal in the storm.",
      "A stranded lookout answers you. They cannot leave the beacon, but the stairs beneath them are breaking. A coil of rope hangs within reach.",
      [
        "Study the supports before choosing a way up.",
        "Carry the rope up to the lookout.",
        "Find your own crossing along the outer wall.",
      ],
    ],
    [
      "The tower's long shadow.",
      "From the shelter of the doorway, you hear stones falling below. Your patience reveals a ledge wide enough for the cadets climbing behind you.",
      [
        "Judge which ledge will hold their weight.",
        "Guide the cadets onto the sheltered ledge.",
        "Climb toward the open summit alone.",
      ],
    ],
    [
      "The forgotten observatory.",
      "The hidden stair opens into a room without a roof. A star chart lies beneath a cracked lens. Its edge points to a distant saddle in the ridge.",
      [
        "Read the chart and locate the saddle.",
        "Mark the safe stairs for the next climber.",
        "Choose the higher, uncharted crest.",
      ],
    ],
  ],
];
const meetings: Episode[] = [
  [
    "Something stirs below.",
    "Beyond the sluice, a vast shape moves beneath the water. A dragon rises onto the bank, blocking the narrow way forward.",
    [
      "Step onto the bank where it can see you.",
      "Stay at the water's edge and let it approach.",
      "Watch the current shift around its claws.",
    ],
  ],
  [
    "The grove falls silent.",
    "Every bell stops. Between the roots, a dragon opens its eyes. Its folded wing covers the path out of the grove.",
    [
      "Step into its clearing with empty hands.",
      "Hold your place beside the roots.",
      "Watch which way its gaze is turning.",
    ],
  ],
  [
    "A shadow across the summit.",
    "A dragon lands on the signal tower. Stone shudders beneath you. Its wing cuts off your view of the next peak.",
    [
      "Step into the wind to meet its gaze.",
      "Hold the ledge and wait for it to settle.",
      "Study its wings before choosing your next move.",
    ],
  ],
];
const detours: Episode[] = [
  [
    "The dragon opens a way.",
    "It answers your approach by lifting one wing. Beyond it is an exposed crossing. You can lead, return for the people behind, or choose another way.",
    [
      "Read the wind before crossing the open span.",
      "Go back and bring the others through.",
      "Leave the crossing and take your own path.",
    ],
  ],
  [
    "The long way around.",
    "Your stillness gives the dragon room to pass. Its footfall closes the short way. A bell sounds from a path you have not yet walked.",
    [
      "Trace the sound to find a sheltered passage.",
      "Return to guide the travelers around the blockage.",
      "Take the unmarked path without waiting.",
    ],
  ],
  [
    "A warning in the dust.",
    "You notice its claws turning before the ground gives way. A lower passage remains open. Someone behind you has not seen it.",
    [
      "Check the lower passage before entering.",
      "Turn back to warn the travelers behind you.",
      "Climb toward an opening of your own.",
    ],
  ],
];
const offers: Episode[] = [
  [
    "The keeper's last crossing.",
    "At the river's edge, a ferryman offers passage in exchange for your light. The far bank is close, but the water hides its depth.",
    [
      "Keep the light and wade across carefully.",
      "Wait for the water to settle, then keep your course.",
      "Trade the light for a passage you have never tried.",
    ],
  ],
  [
    "A path for a lantern.",
    "At the grove's boundary, a traveler offers a map for your lantern. Its ink shows a gate that only opens after sunset.",
    [
      "Keep the lantern and face the dark yourself.",
      "Choose the familiar path and stand by your decision.",
      "Trade for the map and seek the hidden gate.",
    ],
  ],
  [
    "The last beacon.",
    "An old climber offers you a glider for your lantern. Below the cliff, the clouds hide the valley floor.",
    [
      "Keep the light and climb down the exposed rock.",
      "Hold to the marked descent, however long it takes.",
      "Trade for the glider and find a new way down.",
    ],
  ],
];
const endings = [
  "The river becomes a mirror.",
  "The last bell answers.",
  "The horizon opens.",
];
const outcomes = [
  [
    "You found the stair beneath the bridge.",
    "The stranger leads you into the lantern grove.",
    "You take the high ridge instead of the bridge.",
  ],
  [
    "You answered the call.",
    "Your patience uncovered a quieter way.",
    "Your search revealed a hidden entrance.",
  ],
  [
    "You carry a clue from the encounter.",
    "You leave a safer way for another traveler.",
    "You leave the marked path behind.",
  ],
  [
    "Your approach persuaded the dragon to open a crossing.",
    "Waiting kept you safe, but closed the short way.",
    "You spotted the danger before the ground moved.",
  ],
  [
    "You find shelter by reading the landscape.",
    "The travelers catch up because you returned.",
    "You arrive by a path of your own.",
  ],
  [
    "You kept your light and faced the difficult crossing.",
    "You kept your course through the long way around.",
    "You traded certainty for an unfamiliar passage.",
  ],
  [
    "You let your actions answer.",
    "You offered a promise to keep.",
    "You asked for a partnership of equals.",
  ],
  [
    "You promise to act through fear.",
    "You promise to remain.",
    "You promise to keep exploring.",
  ],
];

export type AdventureScene = Scene & {
  id: string;
  art: string;
  route: string;
  consequence: string;
};
/** Narrative branching only: option positions retain the v1 server scoring contract. */
export function adventureScene(prefix: number[]): AdventureScene {
  if (!validAnswers(prefix) || prefix.length >= 8)
    throw new Error("Invalid story position");
  const step = prefix.length;
  const base = scenes[step];
  const route = routes[prefix[0] ?? 0];
  if (!step)
    return {
      ...base,
      id: "crossing",
      art: "crossing",
      route: "Choose your way",
      consequence: "",
    };
  let episode: Episode;
  let id = `${route.id}-${step}`;
  if (step === 1) episode = entrances[prefix[0]];
  else if (step === 2) {
    episode = encounters[prefix[0]][prefix[1]];
    id += `-${prefix[1]}`;
  } else if (step === 3) episode = meetings[prefix[0]];
  else if (step === 4) {
    episode = detours[prefix[3]];
    id += `-${prefix[3]}`;
  } else if (step === 5) episode = offers[prefix[0]];
  else if (step === 6)
    episode = [
      endings[prefix[0]],
      "The dragon waits at the end of your path. It has watched what you kept, what you gave, and who you made room for. Now it waits for an answer.",
      [
        "Let the journey speak before your words.",
        "Show that a bond is a promise to keep.",
        "Offer partnership, never obedience.",
      ],
    ];
  else
    episode = [
      "A promise beyond the valley.",
      `You have come through ${route.name.toLowerCase()}. The dragon opens a wing beside you. The road ahead is still unwritten. What will you carry into it?`,
      base.choices.map((c) => c.text) as Episode[2],
    ];
  const consequence = outcomes[step - 1][prefix[step - 1]];
  // Carry the previous decision into the scene, not just the final score.
  let story = episode[1];
  if (step === 3)
    story = `${["The clue shows where its path meets yours.", "A traveler following the safer way you left warns you of its arrival.", "Your unmarked path brings you to it alone."][prefix[2]]} ${story}`;
  if (step === 5)
    story = `${["You reach shelter before the rain.", "The people you returned for arrive beside you.", "You reach this place alone, by your own path."][prefix[4]]} ${story}`;
  if (step === 6)
    story = `${["Your light is still in your hand.", "You arrive late, but your resolve has held.", "The unfamiliar passage has brought you somewhere new."][prefix[5]]} ${story}`;
  return {
    ...base,
    id,
    title: episode[0],
    story,
    choices: base.choices.map((choice, index) => ({
      ...choice,
      text: episode[2][index],
    })),
    art:
      step === 3 || step === 6
        ? ["sylvara", "vesper", "aureth"][prefix[0]]
        : route.art,
    route: route.name,
    consequence,
  };
}
export function journeyTrail(answers: number[]) {
  if (!validAnswers(answers) || answers.length !== 8)
    throw new Error("Complete the story first");
  return answers.map((answer, step) => {
    const scene = adventureScene(answers.slice(0, step));
    return {
      id: scene.id,
      title: scene.title,
      choice: scene.choices[answer].text,
      outcome: outcomes[step][answer],
    };
  });
}
export function parseJournal(raw: string | null): string[] {
  try {
    const value: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(value)) return [];
    return [
      ...new Set(
        value.filter(
          (path): path is string =>
            typeof path === "string" && /^[012]{8}$/.test(path),
        ),
      ),
    ].slice(0, 6561);
  } catch {
    return [];
  }
}
export function journalProgress(paths: string[]) {
  const companions = new Set<string>();
  const explored = new Set<number>();
  const encounters = new Set<string>();
  for (const path of paths) {
    companions.add(getResult([...path].map(Number)).dragon.id);
    explored.add(Number(path[0]));
    encounters.add(path.slice(0, 2));
  }
  return {
    companions: [...companions],
    routes: [...explored],
    encounters: [...encounters],
    journeys: paths.length,
  };
}
export function nextDiscovery(paths: string[]) {
  const progress = journalProgress(paths);
  const route = routes.find((_, index) => !progress.routes.includes(index));
  if (route)
    return {
      title: `Explore ${route.name}`,
      hint: `On your next journey: “${route.hint}”`,
    };
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++) {
      if (!progress.encounters.includes(`${r}${c}`))
        return {
          title: `A hidden encounter in ${routes[r].name}`,
          hint: `Begin with “${routes[r].hint}” Then: “${entrances[r][2][c]}”`,
        };
    }
  const dragon = dragons.find((d) => !progress.companions.includes(d.id));
  if (dragon)
    return {
      title: `Discover ${dragon.name}`,
      hint: `Try choices that express ${dragon.trait}. Your whole journey shapes the bond; one answer does not guarantee it.`,
    };
  return {
    title: "Every companion. Every entrance.",
    hint: "You have found all six companions and all nine opening encounters. Try a different response to the dragon to uncover another crossing.",
  };
}
