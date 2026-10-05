export const SOURCE_FAQ = "https://rebecca-yarros.squarespace.com/faqs";
export const SOURCE_SHOP = "https://rebeccayarrosshop.com/pages/dragonkind";
export const SOURCE_REDDIT =
  "https://www.reddit.com/r/fourthwing/comments/1wvwfp9/dragonkind_dragon_bonding_megathread_part_3/";
export const SOURCE_SCENES =
  "https://www.reddit.com/r/fourthwing/comments/1wuyvem/dragonkind_masterpost_pt_2_will_contain_spoilers/";
export type Guide = {
  slug: string;
  number: string;
  category: string;
  title: string;
  short: string;
  intro: string;
  sections: {
    id: string;
    title: string;
    text: string[];
    source?: string;
    label?: string;
    spoiler?: boolean;
  }[];
};
export const guides: Guide[] = [
  {
    slug: "how-to-play",
    number: "01",
    category: "Start your journey",
    title: "How to play Dragonkind",
    short: "Find the official game and know which experience you are entering.",
    intro:
      "The official dragon-bonding experience is at dragonkind.com. This site offers a separate, original fan trial. A result here does not create or change your official Dragonkind bond.",
    sections: [
      {
        id: "official",
        title: "Start with the official website",
        text: [
          "Open dragonkind.com and use its candidate or returning-rider entrance. The official experience uses an email account. Follow the prompts on that site; our trial does not ask for your email or connect to that account.",
        ],
        source: "https://dragonkind.com/",
        label: "Official website",
      },
      {
        id: "code",
        title: "If you are waiting for your code",
        text: [
          "The author’s FAQ says codes are sent in batches and recommends checking your spam folder. A delay by itself does not mean your address has failed. Check the spelling of your email and leave time for the batch to arrive.",
        ],
        source: SOURCE_FAQ,
        label: "Official FAQ",
      },
      {
        id: "choices",
        title: "What to expect from the trial",
        text: [
          "Players describe a sequence of decisions that can end in a dragon bond or a failed attempt. The author confirms that failed attempts can be retried after a few hours. Different players report different outcomes from similar choices; treat community routes as observations, rather than a guaranteed answer key.",
        ],
        source: SOURCE_REDDIT,
        label: "Community report",
      },
      {
        id: "fan",
        title: "Try our original eight-choice story",
        text: [
          "Our trial is a short story about courage, attention and the promises you keep. Your eight answers produce an original dragon portrait and a personal result card. There is no cooldown and no account. The same answers under the same rules give the same result.",
          "Our dragon names, personality meanings and matching rules are original fan creations. They are not official characters, lore or predictions.",
        ],
      },
    ],
  },
  {
    slug: "code-not-received",
    number: "02",
    category: "Getting into the game",
    title: "Dragonkind code not arriving?",
    short: "What the official FAQ says, and a short checklist to try.",
    intro:
      "Dragonkind codes are sent in batches. The author’s FAQ advises waiting and checking your spam folder. We cannot resend your code or look up your official account.",
    sections: [
      {
        id: "official",
        title: "The confirmed explanation",
        text: [
          "The official FAQ explains that delivery is batched. Check your spam folder before assuming the code has not been sent. That is the confirmed advice; the FAQ does not publish a precise delivery deadline.",
        ],
        source: SOURCE_FAQ,
        label: "Official FAQ",
      },
      {
        id: "checklist",
        title: "A practical inbox checklist",
        text: [
          "Check the address you entered for spelling mistakes. Search all inbox folders for Dragonkind and check any spam or filtering rules you use. Keep the official login page open while you wait.",
          "If the official page offers a resend action, follow its instructions. Requesting repeatedly can make it harder to tell which code is current. These are general email troubleshooting suggestions, not additional official rules.",
        ],
        label: "Our suggestion",
      },
      {
        id: "launch",
        title: "A launch-week report is not a live status",
        text: [
          "On October 1, players reported loading failures and slow pages in the Reddit master thread. Those reports explain the launch experience. They do not establish whether Dragonkind is currently down. Check the official page and its latest announcements for the present situation.",
        ],
        source:
          "https://www.reddit.com/r/fourthwing/comments/1wupoud/dragonkind_master_post_will_contain_spoilers_for/",
        label: "Community report",
      },
      {
        id: "safety",
        title: "Keep your login code private",
        text: [
          "Enter your one-time code only on the official Dragonkind website. Our fan trial never needs that code, your inbox password or your account details. While you wait, you can explore our original story without signing in.",
        ],
      },
    ],
  },
  {
    slug: "retry-cooldown",
    number: "03",
    category: "After the fire",
    title: "Burned? Your story is not over.",
    short: "Understand the retry rules and keep your next attempt in view.",
    intro:
      "The official FAQ says you can try again after a few hours and keep trying until you bond. Use the time displayed in your official game to set a personal reminder below.",
    sections: [
      {
        id: "rules",
        title: "What the author confirms",
        text: [
          "You can retry after a failed Threshing attempt. The FAQ describes the wait as a few hours and says there is no limit to how many times you can try before you bond. It does not give a fixed countdown for every player.",
        ],
        source: SOURCE_FAQ,
        label: "Official FAQ",
      },
      {
        id: "hours",
        title: "About the four-hour reports",
        text: [
          "The third Reddit megathread summarizes a four-hour repeat countdown from the author’s Instagram discussion. That is a community summary of a specific announcement. Your current game screen is the better reference for your own next attempt.",
          "A bare “4:00” can be ambiguous. Our reminder asks for hours and minutes separately and shows a full hours:minutes:seconds countdown.",
        ],
        source: SOURCE_REDDIT,
        label: "Community report",
      },
      {
        id: "reminder",
        title: "Set a personal reminder",
        text: [
          "Enter the remaining hours and minutes shown by Dragonkind. The reminder stays in this browser and survives a refresh. It does not read your official account, shorten your cooldown or prove that your next attempt is unlocked.",
          "When the reminder ends, check Dragonkind again. This page has to be open to show the end message; it does not send email, push notifications or alerts after you close your browser.",
        ],
      },
      {
        id: "waiting",
        title: "Make the wait your own",
        text: [
          "Read a guide, explore the atlas, or try our original fan story. A result from our trial is separate from the official game. You can revisit any choice and start again without waiting.",
        ],
      },
    ],
  },
  {
    slug: "black-blue-dragons",
    number: "04",
    category: "Know your dragon",
    title: "Black dragons, blue dragons & answer keys",
    short: "Separate confirmed possibilities from routes and fan theories.",
    intro:
      "The official FAQ confirms that all dragon colors and tail types are possible. It does not publish a matching algorithm or a guaranteed path to a black or blue dragon.",
    sections: [
      {
        id: "confirmed",
        title: "What is confirmed",
        text: [
          "The author’s FAQ says dragons of all colors and tail types are possibilities. The official shop has collections for black, blue, brown, green, orange and red. These collections identify color families; they do not establish the probability of getting each color.",
        ],
        source: SOURCE_FAQ,
        label: "Official FAQ",
      },
      {
        id: "routes",
        title: "Why a shared route is not a guarantee",
        text: [
          "Players in the bonding threads describe different outcomes from similar choices. The third megathread states that there is no specific route for black or blue dragons. This is community guidance, not a technical description of the game’s code.",
          "We have not verified the official matching rules. A player’s successful route is an account of one experience, not proof of a universal answer key.",
        ],
        source: SOURCE_REDDIT,
        label: "Community report",
      },
      {
        id: "details",
        title: "What players report about choices",
        spoiler: true,
        text: [
          "Community discussions include choosing between multiple dragons, standing still during an encounter, and taking different paths through the valley. Some players report a bond where others report a failed attempt. These scene examples may spoil the surprise, and none is a confirmed recipe for a particular color.",
        ],
        source:
          "https://www.reddit.com/r/fourthwing/comments/1wuyvem/dragonkind_masterpost_pt_2_will_contain_spoilers/",
        label: "Community report · Scene spoilers",
      },
      {
        id: "theories",
        title: "Treat hidden-factor theories cautiously",
        text: [
          "Claims about phone battery levels, device settings or secret answer sequences need evidence from the official creator. We do not recommend changing your device or creating extra accounts to follow an unconfirmed trick. A dragon color poll is also a self-selected sample, not an official drop-rate table.",
        ],
        label: "Our suggestion",
      },
      {
        id: "our-trial",
        title: "How our own matching works",
        text: [
          "Our original trial scores six traits: insight, loyalty, freedom, courage, resolve and curiosity. Your strongest trait selects one of six original companions. Every companion is reachable, and none is designated rarer than another.",
          "Black and blue portraits in our atlas are fan artwork. Receiving one here does not influence your official game.",
        ],
      },
    ],
  },
];
export const staticPaths = [
  "/",
  "/play/",
  "/leaderboard/",
  "/guides/",
  ...guides.map((g) => `/guides/${g.slug}/`),
  "/dragons/",
  ...["about", "sources", "privacy", "contact", "404"].map((p) => `/${p}/`),
];
export function normalizePath(path: string) {
  return path === "/" ? path : path.replace(/\/+$/, "") + "/";
}
export function pageMeta(path: string) {
  const guide = guides.find((g) => path === `/guides/${g.slug}/`);
  if (guide)
    return {
      title: `${guide.title} | Threshing Day Game`,
      description: guide.intro,
    };
  const pages: Record<string, [string, string]> = {
    "/": [
      "Threshing Day Game — Play, Discover Your Dragon & Join the Rankings",
      "Play Threshing Day Game free: eight choices, six original dragons, a shareable result card and rider rankings. Discover your bond with no account or cooldown.",
    ],
    "/play/": [
      "Play the Original Fan Trial | Threshing Day Game",
      "Eight choices. One original dragon companion. Continue your saved trial or start a new story without an account.",
    ],
    "/leaderboard/": [
      "Rider Leaderboard | Threshing Day Game",
      "Discover six original dragons and climb daily or all-time rider rankings. Each companion counts your strongest published bond.",
    ],
    "/guides/": [
      "Dragonkind Guides & Practical Help | Threshing Day Game",
      "Find the official game, troubleshoot email codes, understand retry waits, and separate dragon-bonding facts from theories.",
    ],
    "/dragons/": [
      "Dragon Atlas — Six Original Companions | Threshing Day Game",
      "Explore six original dragon companions and learn how official color families differ from our fan personality meanings.",
    ],
    "/about/": [
      "About This Fan Site | Threshing Day Game",
      "An independent fan trial and practical companion for Dragonkind players.",
    ],
    "/sources/": [
      "Sources & Methods | Threshing Day Game",
      "Official sources, community observations and original fan content, clearly distinguished.",
    ],
    "/privacy/": [
      "Privacy | Threshing Day Game",
      "How trial progress stays on your device, how optional public bonds are stored, and how to remove your published results.",
    ],
    "/contact/": [
      "Feedback & Corrections | Threshing Day Game",
      "Prepare a correction note with a source for this independent fan guide.",
    ],
  };
  const [title, description] = pages[path] || [
    "Page Not Found | Threshing Day Game",
    "Find your way back to the trial or Dragonkind guides.",
  ];
  return { title, description };
}
