import { dragons, getResult, scenes, validAnswers, type Scene } from "./trial";

export const JOURNAL_KEY = "threshingday:journeys:v1";
export const routes = [
  {
    id: "river",
    name: "The Sunken Way",
    hint: "Test the stones before crossing.",
    art: "sunken-way",
  },
  {
    id: "grove",
    name: "The Lantern Grove",
    hint: "Offer the stranger your hand.",
    art: "lantern-grove",
  },
  {
    id: "ridge",
    name: "The Windward Ridge",
    hint: "Find a path along the ridge.",
    art: "windward-ridge",
  },
] as const;
export type AdventureRouteId = (typeof routes)[number]["id"];
const stages = [
  "crossing",
  "entrance",
  "encounter",
  "meeting",
  "detour",
  "offer",
  "reckoning",
  "oath",
] as const;
export type AdventureStage = (typeof stages)[number];

type Episode = [
  title: string,
  story: string,
  choices: [string, string, string],
];
const entrances: Episode[] = [
  [
    "A stair beneath the river.",
    "Your foot finds a submerged stair beside the bridge. Below, a keeper knocks against a jammed sluice gate: three sharp blows, then a pause. You lift a lantern from its hook. The next surge will cover the lowest step; the keeper points urgently downstream.",
    [
      "Enter the flooded passage to reach the keeper.",
      "Brace the gate and listen before moving.",
      "Inspect the watermarks for another entrance.",
    ],
  ],
  [
    "The stranger knows a way.",
    "The stranger grips your hand until both feet reach solid ground. They press a lantern into your palm and lead you beneath the trees. Three bells hang over a root-bound arch. One rings without wind; beyond it, a smaller voice answers each note.",
    [
      "Follow the ringing bell into the dark.",
      "Wait beside the stranger until the ringing stops.",
      "Examine the arch for a hidden path.",
    ],
  ],
  [
    "Above the cloud line.",
    "You leave the bridge for a stair cut into the ridge, taking a lantern from an abandoned pack. A signal tower rises above the mist. Someone inside waves a torn pennant, but each gust swallows their words. Loose stones skitter down the only visible stair.",
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
      "You squeeze through before the surge and reach the keeper on a narrow shelf. Their ankle is trapped beneath a fallen beam. A brass key lies beside them, its wave-shaped teeth matching a grate across the channel. Your rope could lift the beam, but retrieving it will take time.",
      [
        "Read the key's markings to find the outlet.",
        "Use your rope to free the keeper.",
        "Leave the key and find another way out.",
      ],
    ],
    [
      "The river holds its breath.",
      "You wedge a stone against the gate and hear the keeper count: three surges, then silence. Beneath you, an empty ferry strikes the bridge with every wave. Its fraying line is the only handhold along the channel. On the bank, reeds bend toward a longer, open route.",
      [
        "Study the surges and cross in the quiet moment.",
        "Secure the ferry for whoever comes next.",
        "Step onto the bank and follow the open river.",
      ],
    ],
    [
      "A map written in water.",
      "A pale line above the flood leads you into a dry maintenance tunnel. Names and water levels cover its wall; beneath them, someone has drawn a crossing that no longer exists. Your lantern catches worn pillars through an opening. Footsteps behind you stop where the tunnel turns dark.",
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
      "You follow the bell to a young traveler caught in silver roots. Each pull tightens them around a small carved stone. The traveler freezes when you kneel: a dragon's claw is carved beside an open hand. Beyond the roots, something large exhales slowly enough to stir the leaves.",
      [
        "Read the carving before loosening the roots.",
        "Untangle the traveler and lead them out.",
        "Find a new passage around the roots.",
      ],
    ],
    [
      "A quiet bargain.",
      "You wait until the stranger stops gripping your sleeve. The bells settle one by one, revealing smoke beneath an enormous root. A deserted shelter holds enough dry wood for one fire. A maker's mark is cut above its hearth; outside, wet travelers call to one another through the trees.",
      [
        "Look for signs of who built the shelter.",
        "Build the fire for the travelers behind you.",
        "Leave the shelter and follow the evening light.",
      ],
    ],
    [
      "The door inside the tree.",
      "Behind the arch, you uncover a door worked into a living trunk. Its pattern turns with the grain instead of crossing it. A bundle of provisions rests untouched on the threshold. The stranger lowers their voice: someone keeps this way open, though no footprints ever lead back from it.",
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
      "Your call brings a lookout to the broken landing. They hold the beacon's shutter closed with both hands; releasing it would send glass into the climbers below. A coil of rope hangs beside you. Between gusts, you can see a cracked support and a narrow route along the outer wall.",
      [
        "Study the supports before choosing a way up.",
        "Carry the rope up to the lookout.",
        "Find your own crossing along the outer wall.",
      ],
    ],
    [
      "The tower's long shadow.",
      "You anchor yourself inside the doorway and let the wind pass. Falling stones reveal where the stair is failing. Below, three cadets cling to the exposed steps. A sheltered ledge reaches around the tower, but its last section is hidden. Above you, the open summit catches a break in the cloud.",
      [
        "Judge which ledge will hold their weight.",
        "Guide the cadets onto the sheltered ledge.",
        "Climb toward the open summit alone.",
      ],
    ],
    [
      "The forgotten observatory.",
      "Around the tower, a forgotten stair opens into a roofless observatory. A star chart rests beneath a cracked lens, its brass pointer aimed at a saddle in the ridge. Fresh scratches mark the stair's weakest step. Higher up, an uncharted crest disappears into bright, fast-moving cloud.",
      [
        "Read the chart and locate the saddle.",
        "Mark the safe stairs for the next climber.",
        "Choose the higher, uncharted crest.",
      ],
    ],
  ],
];
// The same decision has a different, concrete consequence in each encounter.
const encounterOutcomes = [
  [
    [
      "The key opens the outlet; falling water frees the keeper's trapped ankle.",
      "Your rope lifts the beam; the keeper secures it for the next traveler.",
      "You find a dry seam; the keeper stays by the gate with the key.",
    ],
    [
      "You cross between surges while the ferry remains caught against the stone.",
      "Your knot holds the ferry off the rocks; a downstream traveler waves back.",
      "You reach the open bank, leaving the hidden channel behind.",
    ],
    [
      "The wall-map reveals a dry crossing between the old pillars.",
      "Your spare wick lights the tunnel; the footsteps behind you start again.",
      "Daylight opens through an unmarked crack; the wall-map remains unread.",
    ],
  ],
  [
    [
      "The carved hand shows where to press; the roots release their grip.",
      "You ease the traveler free; they ring the bell once in thanks.",
      "You find space between the roots and leave the bell's path behind.",
    ],
    [
      "The maker's mark reveals a sheltered way between the oldest trees.",
      "Your fire draws the wet travelers in; the stranger stays to share it.",
      "You follow the evening light; the shelter falls quiet behind you.",
    ],
    [
      "You follow the grain; the door opens without a broken branch.",
      "You leave food on the threshold; the stranger adds their last apple.",
      "You pass the unopened door and make your own trail through the fern.",
    ],
  ],
  [
    [
      "You skirt the cracked support and open a safe way to the landing.",
      "Your rope holds the shutter; the lookout can finally leave the beacon.",
      "You reach the outer wall; the lookout keeps hold of the shutter.",
    ],
    [
      "You test the sheltered ledge and mark its weakest stone.",
      "The cadets follow your voice onto the ledge, clear of the falling stone.",
      "You climb into clear air; the cadets remain below the tower.",
    ],
    [
      "The chart guides you through the cloud toward a sheltered saddle.",
      "Your marks steer the next climber away from the broken step.",
      "You reach the uncharted crest with the observatory far below.",
    ],
  ],
];
const encounterEchoes = [
  [
    [
      "The keeper's wave-marked key rests warm in your palm.",
      "Your rope still trails back to the keeper's safe shelf.",
      "The keeper's knocking fades behind your narrow escape.",
    ],
    [
      "You still count the river's three surges under your breath.",
      "The ferry's new knot holds firm in the distance.",
      "Reeds brush your boots along the bank you chose.",
    ],
    [
      "The wall-map's old pillars rise from the water ahead.",
      "A second lantern now glows inside the tunnel behind you.",
      "Dry tunnel dust clings to your sleeves.",
    ],
  ],
  [
    [
      "You trace the open hand carved into the stone.",
      "The freed traveler's answering bell follows you between the trees.",
      "Silver roots close around the path you left behind.",
    ],
    [
      "The shelter's maker's mark appears on another ancient trunk.",
      "Woodsmoke carries the voices of the people you warmed.",
      "The deserted shelter disappears behind the evening trees.",
    ],
    [
      "The living door settles closed without a splinter.",
      "The stranger's last apple rests beside the food you left.",
      "Fern tips spring back over your unmarked trail.",
    ],
  ],
  [
    [
      "The cracked support falls safely below your marked route.",
      "The lookout's lantern follows yours away from the broken beacon.",
      "The lookout's shutter still flashes behind your solitary climb.",
    ],
    [
      "Your chalk mark warns of the ledge's weakest stone.",
      "Three cadets raise their hands in thanks from the shelter.",
      "The cadets' voices fade beneath your solitary summit.",
    ],
    [
      "The star chart's brass pointer leads you toward the saddle.",
      "Another climber follows the marks you left on the stair.",
      "The uncharted crest narrows to a pale line ahead.",
    ],
  ],
];
const meetings: Episode[] = [
  [
    "Something stirs below.",
    "At the sluice, a dragon rises from the water and sets one claw across your way. Ripples strike the bank in widening rings. It looks past you toward the passage you took, then waits with its wing folded against the stone.",
    [
      "Step onto the bank where it can see you.",
      "Stay at the water's edge and let it approach.",
      "Watch the current shift around its claws.",
    ],
  ],
  [
    "The grove falls silent.",
    "Every bell stops at once. Between the trees, a dragon opens its eyes and lowers its head toward the trail. A folded wing covers the clearing's far exit. Its gaze pauses on your hands, then returns to the roots at your feet.",
    [
      "Step into its clearing with empty hands.",
      "Hold your place beside the roots.",
      "Watch which way its gaze is turning.",
    ],
  ],
  [
    "A shadow across the summit.",
    "A dragon lands on the signal tower, bending its broken beacon under one claw. Stone shudders along the ridge. It turns toward you instead of the valley, holding a wing against the wind. The only way onward runs beneath that wing.",
    [
      "Step into the wind to meet its gaze.",
      "Hold the ledge and wait for it to settle.",
      "Study its wings before choosing your next move.",
    ],
  ],
];
const detours: Episode[][] = [
  [
    [
      "A wing above the water.",
      "You step where the dragon can see you. It lifts its wing, revealing a broken aqueduct across the channel. Spray makes the stones shine; you can hear people entering the sluice behind you. The dragon holds still, leaving the first move to you.",
      [
        "Read the current before crossing the aqueduct.",
        "Return and bring the others across.",
        "Leave the aqueduct for a channel of your own.",
      ],
    ],
    [
      "The river takes the short way.",
      "You give the dragon room to pass. Its weight sends a wave over the low crossing, swallowing the stones you meant to use. Beyond them, an old towpath curves beneath a dry arch. Voices still echo from the sluice, unaware the direct way has vanished.",
      [
        "Trace the towpath beneath the dry arch.",
        "Warn the others and guide them around.",
        "Climb the bank and choose your own direction.",
      ],
    ],
    [
      "A warning in the current.",
      "You watch the water split around the dragon's claws and notice mud sliding beneath your boots. You step clear before the bank collapses. A low culvert remains open beside the broken ground. Behind you, another lantern is approaching the edge you have just left.",
      [
        "Check the culvert before entering.",
        "Turn back to warn the approaching traveler.",
        "Climb toward an opening above the bank.",
      ],
    ],
  ],
  [
    [
      "A path beneath the wing.",
      "You enter the clearing with open hands. The dragon raises its wing, uncovering a narrow walk of interlaced branches. Lanterns sway on the far side. The stranger calls your name from the roots; there is room to cross together if you return for them.",
      [
        "Read the branches before choosing your footing.",
        "Go back and bring the stranger through.",
        "Find your own way beyond the clearing.",
      ],
    ],
    [
      "The grove closes behind it.",
      "You hold still while the dragon passes between the trees. A root rises in its wake, closing the nearest exit without touching your boots. One bell answers from a darker path. The stranger cannot see the blockage yet; you can hear their lantern knocking against a branch.",
      [
        "Trace the bell to a sheltered passage.",
        "Return and guide the stranger around the roots.",
        "Take an unmarked path without waiting.",
      ],
    ],
    [
      "The branch before it falls.",
      "You follow the dragon's gaze to a split overhead branch. Its tail brushes the trunk; you move before the branch strikes the path. A hollow beneath the roots opens beyond it. The stranger is following your footprints toward the place where the branch fell.",
      [
        "Check the hollow before entering.",
        "Turn back to warn the stranger.",
        "Climb toward a clearing of your own.",
      ],
    ],
  ],
  [
    [
      "The span beneath the storm.",
      "You step into the wind and meet the dragon's gaze. It lifts a wing from a narrow stone span linking the peaks. The tower bells swing behind you, battered by the gusts. You could cross now, but the climbers below have not seen the opening.",
      [
        "Read the gusts before crossing the span.",
        "Return and bring the climbers through.",
        "Leave the span for a route of your own.",
      ],
    ],
    [
      "The long way around.",
      "You brace against the ledge while the dragon settles. A broken piece of beacon falls across the direct stair; the dragon folds its wing, leaving you unharmed. A sheltered traverse circles the peak below. From the tower, the next climber calls to ask whether the stair is clear.",
      [
        "Trace the sheltered traverse around the peak.",
        "Warn the climbers and guide them around.",
        "Take the higher, unmarked crest alone.",
      ],
    ],
    [
      "The ledge gives warning.",
      "You watch the dragon shift its wings and see grit jumping along a crack in the ledge. One step back keeps you clear as the stone falls. A lower shelf remains intact. Above it, a climber reaches for the handhold that has just broken away.",
      [
        "Check the lower shelf before entering.",
        "Turn back to warn the climber.",
        "Find an opening above the broken ledge.",
      ],
    ],
  ],
];
const detourOutcomes = [
  [
    "You map a sheltered line through the water.",
    "The travelers cross safely because you went back.",
    "You reach the far bank by an unmarked channel.",
  ],
  [
    "You follow the trees' shelter beyond the clearing.",
    "The stranger catches up because you returned.",
    "You reach the grove's boundary by your own trail.",
  ],
  [
    "You map a sheltered line through the gusts.",
    "The climbers clear the damaged crossing with your help.",
    "You reach the next peak along your own crest.",
  ],
];
const detourEchoes = [
  [
    "Your sheltered line brings you to a quiet bend.",
    "The travelers you guided wait beside you on the bank.",
    "Your unmarked channel brings you to the bend alone.",
  ],
  [
    "The sheltered trees lead you beyond the last bell.",
    "The stranger walks beside you beyond the last bell.",
    "Your own trail brings you beyond the last bell alone.",
  ],
  [
    "Your sheltered line leads to a break in the wind.",
    "The climbers you guided gather beside your lantern.",
    "Your unmarked crest brings you to the overlook alone.",
  ],
];
const offers: Episode[] = [
  [
    "The ferryman's price.",
    "A ferryman offers passage for your lantern: he needs a light to find his return. Stepping-stones reach the far bank, but the current is rising. Upstream, a marked path leads to a longer crossing. The dragon watches from the water without choosing for you.",
    [
      "Keep the light and face the stepping-stones.",
      "Keep your lantern and take the marked crossing.",
      "Trade your lantern for the ferry passage.",
    ],
  ],
  [
    "A map for a lantern.",
    "At the boundary, a mapkeeper offers you a route through a hidden gate in exchange for your lantern. They need its light to read the fading ink. A dark clearing lies ahead; a marked path curves around it. Between the trees, the dragon waits.",
    [
      "Keep the lantern and cross the dark clearing.",
      "Keep your lantern and follow the marked path.",
      "Trade for the map and seek the hidden gate.",
    ],
  ],
  [
    "The last beacon.",
    "An old climber offers a tethered glider for your lantern: the lookout below needs another signal light. A steep scramble drops toward the valley; a marked stair takes longer. The glider's cable reaches an unfamiliar landing. On the next peak, the dragon turns to watch.",
    [
      "Keep the light and climb down the exposed rock.",
      "Keep your lantern and hold to the marked stair.",
      "Trade for the glider and try the unfamiliar landing.",
    ],
  ],
];
const offerOutcomes = [
  [
    "You cross the wet stones with your lantern held high.",
    "You reach the marked crossing after the water settles.",
    "The ferryman takes your light and carries you to an unfamiliar bank.",
  ],
  [
    "You carry your lantern across the dark clearing.",
    "You follow the marked path, even when the bells fall silent.",
    "The mapkeeper takes your light; their map opens the hidden gate.",
  ],
  [
    "Your lantern lights each handhold down the exposed rock.",
    "You follow the marked stair through the last of the storm.",
    "Your lantern becomes a signal below; the glider carries you to a new landing.",
  ],
];
const offerEchoes = [
  [
    "Water still drips from your lantern onto the stepping-stones.",
    "Your lantern catches the final marker of the longer crossing.",
    "Across the water, your lantern now lights the ferryman's return.",
  ],
  [
    "Your lantern throws the clearing's last shadow behind you.",
    "The last painted marker glows beside your steady lantern.",
    "The borrowed map curls in your hand beyond the hidden gate.",
  ],
  [
    "Your lantern swings against the rock you have just descended.",
    "Your lantern illuminates the final step of the marked descent.",
    "Far below, your lantern answers from the tower's signal window.",
  ],
];
const reckonings = [
  [
    "The river becomes a mirror.",
    "On the final bank, the dragon lowers its head toward your reflection. It has followed the whole crossing. The river holds still for a moment, leaving no current to choose your answer for you.",
  ],
  [
    "The last bell answers.",
    "Beyond the final trees, the dragon waits beneath a silent bell. It lowers its head until you can see the clearing reflected in its eye. This time, there is no carved sign to read.",
  ],
  [
    "The horizon opens.",
    "On the final landing, the dragon lowers its head into the quiet between gusts. Its wing leaves you room to stand beside it. There is no marked stair for the answer it is waiting for.",
  ],
];
const oathSettings = [
  "The Sunken Way lies behind you, its sluice and lanterns small against the river.",
  "The Lantern Grove lies behind you, its bells finally quiet beneath the trees.",
  "The Windward Ridge lies behind you, its broken beacon catching the first clear light.",
];
const bondResponses = [
  "You leave your journey as the answer; the dragon bows its head.",
  "You promise to keep showing up; the dragon settles beside you.",
  "You offer an equal place beside you; the dragon makes room in return.",
];
const bondEchoes = [
  "It meets your silence with a slow, deliberate bow.",
  "It settles beside you, accepting the promise you offered.",
  "It moves aside, leaving an equal place for you.",
];
const promises = [
  "You promise to act through fear, wherever the next journey leads.",
  "You promise to remain when the easier road is gone.",
  "You promise to keep exploring together beyond the valley.",
];

export type AdventureScene = Scene & {
  id: string;
  art: string;
  route: string;
  routeId: AdventureRouteId | null;
  stage: AdventureStage;
  consequence: string;
};
/** The immediate consequence of the latest choice, without claiming a result dragon. */
export function adventureConsequence(prefix: number[]): string {
  if (!validAnswers(prefix) || prefix.length > 8)
    throw new Error("Invalid story position");
  const step = prefix.length;
  if (!step) return "";
  const r = prefix[0];
  const last = prefix[step - 1];
  if (step === 1)
    return [
      "Your careful footing reveals a stair beneath the bridge.",
      "The stranger reaches safety and shares a way into the grove.",
      "You leave the bridge and take the exposed ridge.",
    ][r];
  if (step === 2)
    return [
      [
        "You reach the keeper before the next surge.",
        "Your braced gate reveals a rhythm in the rising water.",
        "The watermarks reveal a dry maintenance tunnel.",
      ],
      [
        "The ringing bell leads you to a trapped traveler.",
        "Your patience settles the bells and reveals a hidden shelter.",
        "Your search uncovers a door within a living tree.",
      ],
      [
        "The lookout answers your call from the broken landing.",
        "Your pause reveals a sheltered ledge beneath the falling stones.",
        "Your search finds an observatory behind the tower.",
      ],
    ][r][last];
  if (step === 3) return encounterOutcomes[r][prefix[1]][last];
  if (step === 4)
    return [
      [
        "The dragon lifts a wing and uncovers an aqueduct.",
        "You stay clear as the dragon's wave covers the short crossing.",
        "You spot the sliding mud before the bank collapses.",
      ],
      [
        "The dragon lifts its wing and reveals a walk of branches.",
        "You stay clear as a root closes the short exit.",
        "You read its warning before the branch falls.",
      ],
      [
        "The dragon lifts its wing and uncovers a stone span.",
        "You stay clear as the broken beacon blocks the stair.",
        "You notice the crack before the ledge gives way.",
      ],
    ][r][last];
  if (step === 5) return detourOutcomes[r][last];
  if (step === 6) return offerOutcomes[r][last];
  if (step === 7) return bondResponses[last];
  return promises[last];
}
/** Narrative branching only: option positions retain the v1 server scoring contract. */
export function adventureScene(prefix: number[]): AdventureScene {
  if (!validAnswers(prefix) || prefix.length >= 8)
    throw new Error("Invalid story position");
  const step = prefix.length;
  const base = scenes[step];
  if (!step)
    return {
      ...base,
      story:
        "Mist hides the far shore. A stranger hesitates behind you as water climbs the bridge's lowest stones. Beneath its arch, someone knocks against a closed gate. Above the valley, a broken signal tower catches the wind. Your first choice will decide which way you enter.",
      id: "crossing",
      art: "crossing",
      route: "Choose your way",
      routeId: null,
      stage: stages[step],
      consequence: "",
    };
  const r = prefix[0];
  const route = routes[r];
  let episode: Episode;
  let id = `${route.id}-${step}`;
  if (step === 1) episode = entrances[r];
  else if (step === 2) {
    episode = encounters[r][prefix[1]];
    id += `-${prefix[1]}`;
  } else if (step === 3) {
    const meeting = meetings[r];
    episode = [
      meeting[0],
      `${encounterEchoes[r][prefix[1]][prefix[2]]} ${meeting[1]}`,
      meeting[2],
    ];
  } else if (step === 4) {
    episode = detours[r][prefix[3]];
    id += `-${prefix[3]}`;
  } else if (step === 5) {
    const offer = offers[r];
    episode = [offer[0], `${detourEchoes[r][prefix[4]]} ${offer[1]}`, offer[2]];
  } else if (step === 6)
    episode = [
      reckonings[r][0],
      `${offerEchoes[r][prefix[5]]} ${reckonings[r][1]}`,
      [
        "Let the journey speak before your words.",
        "Show that a bond is a promise to keep.",
        "Offer partnership, never obedience.",
      ],
    ];
  else
    episode = [
      "A promise beyond the valley.",
      `${oathSettings[r]} ${encounterEchoes[r][prefix[1]][prefix[2]]} ${bondEchoes[prefix[6]]} Its open wing is an invitation. What will you carry forward together?`,
      base.choices.map((c) => c.text) as Episode[2],
    ];
  return {
    ...base,
    id,
    title: episode[0],
    story: episode[1],
    choices: base.choices.map((choice, index) => ({
      ...choice,
      text: episode[2][index],
    })),
    // These are witnesses along the route, not the player's earned companion.
    art:
      step === 3 || step === 6
        ? ["sylvara", "vesper", "aureth"][r]
        : step === 4 && prefix[3] === 0 && r !== 1
          ? "crossing"
          : route.art,
    route: route.name,
    routeId: route.id,
    stage: stages[step],
    consequence: adventureConsequence(prefix),
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
      outcome: adventureConsequence(answers.slice(0, step + 1)),
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
