import React from "react";
import { Plus, Minus, ArrowUpRight } from "@phosphor-icons/react";
import { SOURCE_FAQ, SOURCE_REDDIT, SOURCE_SCENES } from "./content";

type AnswerLink = { href: string; label: string; source?: boolean };
type Question = { question: string; answer: string; links?: AnswerLink[] };
const groups: { title: string; questions: Question[] }[] = [
  {
    title: "Dragons & choices",
    questions: [
      {
        question: "How do I get a black dragon in Dragonkind?",
        answer:
          "Black dragons are possible in official Dragonkind, but the author has not published a guaranteed answer route. In our fan trial, resolve leads to Vesper, the black dragon: favor choices about holding your ground and keeping your promises.",
        links: [
          {
            href: "/guides/black-blue-dragons/",
            label: "Black & blue dragon guide",
          },
          { href: SOURCE_FAQ, label: "Author’s FAQ", source: true },
        ],
      },
      {
        question: "How do I get a blue dragon?",
        answer:
          "There is no verified sequence that guarantees a blue dragon in official Dragonkind. In this site’s story, freedom leads to Aureth, our blue companion. Look for choices that value independence, a new path and partnership. All six companions are reachable; we do not designate a rare color.",
        links: [{ href: "/dragons/", label: "Explore the six companions" }],
      },
      {
        question:
          "What are the correct Threshing answers? Which choices help me survive?",
        answer:
          "Official Dragonkind can end in a bond or death. A successful player’s route is useful to compare, but it is not a universal answer key. Record the exact scene and choice when comparing attempts. Our eight-choice story has no wrong answers or deaths: every completed path gives you a companion.",
        links: [
          {
            href: "/guides/black-blue-dragons/#routes",
            label: "Understand community routes",
          },
        ],
      },
      {
        question: "What should I choose when I see two green dragons?",
        answer:
          "Scene spoilers: one player reported looking at the left dragon, then holding position when the right dragon swung its tail; another reported being burned for indecision. These are individual experiences, not a guaranteed solution. Compare the wording of your encounter before applying a shared route. This scene belongs to official Dragonkind, not our original trial.",
        links: [
          {
            href: SOURCE_SCENES,
            label: "Player reports · scene spoilers",
            source: true,
          },
        ],
      },
      {
        question: "How do I survive the red dragon?",
        answer:
          "Players report both bonding with red dragons and dying during red-dragon encounters. Color alone does not identify a safe choice, and we have not verified a universal survival answer. In our story, Pyrren is the red companion: courage builds that bond, and every completed path survives.",
        links: [
          {
            href: SOURCE_SCENES,
            label: "Compare encounter reports · spoilers",
            source: true,
          },
        ],
      },
      {
        question: "Why did the dragon burn or kill me?",
        answer:
          "You reached a failed-attempt ending in official Dragonkind. That outcome does not prove anything about your real personality or rule out bonding on a later attempt. Note where your run ended, then return when the game’s retry countdown allows it. The author confirms you can keep trying until you bond.",
        links: [
          {
            href: "/guides/retry-cooldown/",
            label: "What to do after a failed attempt",
          },
          { href: SOURCE_FAQ, label: "Confirmed retry rules", source: true },
        ],
      },
      {
        question: "Is Dragonkind random? Do my answers or personality matter?",
        answer:
          "Players report different outcomes from similar choices, but the official matching algorithm is not published. Those reports do not establish which random or hidden factors are involved. Our fan game uses a fixed six-trait score: the same eight answers under the same rules always give the same dragon. Its personality meanings are our own creative interpretation.",
        links: [
          { href: "/sources/", label: "Our matching rules & sources" },
          { href: SOURCE_REDDIT, label: "Community discussion", source: true },
        ],
      },
    ],
  },
  {
    title: "Retries & countdowns",
    questions: [
      {
        question:
          "How long do I wait after dying? Can I skip the Dragonkind timer?",
        answer:
          "The author’s FAQ says you can retry after a few hours; players commonly report four hours. Use the countdown on your official screen for your own attempt. Our retry timer saves a personal reminder in this browser. It does not shorten the wait or unlock your official account. You can play our fan story immediately while you wait.",
        links: [
          {
            href: "/guides/retry-cooldown/#timer",
            label: "Set your retry reminder",
          },
          { href: SOURCE_FAQ, label: "Author’s retry FAQ", source: true },
        ],
      },
      {
        question: "Can I retry, reset or get a different dragon?",
        answer:
          "Here, choose Explore another path after your result, or Begin a new story in the game card. Change your choices to discover a different companion, with no cooldown. Official Dragonkind allows repeat failed attempts until you bond; its FAQ does not promise a reset after bonding. Check the controls in your official account for that option.",
        links: [{ href: "/play/", label: "Explore another path" }],
      },
      {
        question: "When do I get my signet? What is the long countdown?",
        answer:
          "Players’ summary of the author’s announcement identifies the long Dragonkind countdown as a signet update, with May 9 mentioned. Check the official site and author’s announcements for current details. This is separate from the death retry countdown. Our fan result gives you a dragon and an oath; it does not assign an official signet.",
        links: [
          {
            href: SOURCE_REDDIT,
            label: "Announcement summary · community source",
            source: true,
          },
          {
            href: "https://dragonkind.com/",
            label: "Check official Dragonkind",
            source: true,
          },
        ],
      },
    ],
  },
  {
    title: "Playing & sharing",
    questions: [
      {
        question:
          "Is this the official Threshing Day game? Is it free, and how do I play?",
        answer:
          "This is a free, independent fan adventure. Select Enter the valley above, make eight choices and receive an original dragon card. No email, account or download is required. Rebecca Yarros’s official experience is Dragonkind at dragonkind.com, which uses email sign-in. A bond here does not create or change an official bond.",
        links: [
          {
            href: "/guides/how-to-play/",
            label: "Find the right game & get started",
          },
        ],
      },
      {
        question: "Why hasn’t my Dragonkind login code arrived?",
        answer:
          "The author says codes are sent in batches. Check your spam folder and the spelling of your email, then allow time for delivery. We cannot resend a code or access your official account. Our own trial needs no code, so you can play here while you wait.",
        links: [
          { href: "/guides/code-not-received/", label: "Login-code checklist" },
        ],
      },
      {
        question: "What do dragon color, tail type and lineage mean?",
        answer:
          "Color describes the dragon’s color family, tail type describes its tail form, and lineage refers to its family line. Players compare these details on their official result cards; they are not a verified answer key or personality score. Our atlas uses six original companions with our own traits and oaths, and does not assign official lineage.",
        links: [
          { href: "/dragons/", label: "Meet our original companions" },
          {
            href: SOURCE_SCENES,
            label: "Official card details · player reports",
            source: true,
          },
        ],
      },
      {
        question: "What do Wing, Section and Squad mean?",
        answer:
          "These identify your cadet’s group assignment in official Dragonkind. Players use the combination shown on their profile to find squadmates. They are separate from a dragon’s color or our bond-strength score. This fan trial does not assign a Wing, Section or Squad.",
        links: [
          {
            href: SOURCE_SCENES,
            label: "Squadmate discussions · community source",
            source: true,
          },
        ],
      },
      {
        question:
          "How do I save my dragon card or add my bond to the dragon wall?",
        answer:
          "Complete the trial to download your card, copy a result link or save your companion in this browser. To join the public wall, choose Publish my bond and enter a rider name. Wall counts include published bonds only, so an undiscovered or unpublished companion adds no public count. On the leaderboard, each dragon contributes your best strength, up to 600 points across six companions.",
        links: [
          { href: "/#dragon-wall", label: "Visit the dragon wall" },
          { href: "/leaderboard/", label: "Ranking rules" },
        ],
      },
      {
        question: "Where is my progress saved? Can I remove a published bond?",
        answer:
          "Progress, saved companions and reminders stay in this browser and do not sync between devices. Publishing is optional and makes your chosen rider name, dragon and score public. Use the Privacy page from the publishing browser to remove your public bonds, or clear your local progress there.",
        links: [
          { href: "/privacy/", label: "Manage your progress & public bonds" },
        ],
      },
    ],
  },
];

export function HomeFAQ() {
  return (
    <section className="home-faq content-width" aria-labelledby="faq-title">
      <div className="faq-heading">
        <p className="eyebrow">FAQ</p>
        <h2 id="faq-title">Threshing Day game FAQ</h2>
        <p className="faq-intro">
          Dragon choices, retries and your result — here and in official
          Dragonkind.
        </p>
      </div>
      <div className="faq-content">
        {groups.map((group, groupIndex) => (
          <div className="faq-group" key={group.title}>
            <h3>{group.title}</h3>
            {group.questions.map(
              ({ question, answer, links }, questionIndex) => (
                <details
                  key={question}
                  open={groupIndex === 0 && questionIndex === 0}
                >
                  <summary>
                    <span>{question}</span>
                    <Plus className="faq-plus" size={18} aria-hidden="true" />
                    <Minus className="faq-minus" size={18} aria-hidden="true" />
                  </summary>
                  <div className="faq-answer">
                    <p>{answer}</p>
                    {links && (
                      <div className="faq-links">
                        {links.map(({ href, label, source }) => (
                          <a
                            key={href}
                            href={href}
                            {...(source
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                          >
                            {label}
                            {source && (
                              <ArrowUpRight size={14} aria-hidden="true" />
                            )}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </details>
              ),
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
