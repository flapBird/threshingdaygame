import {
  HomePodium,
  LeaderboardPage,
  HomeDragonWall,
  PublishBond,
  RemovePublicBonds,
} from "./CommunityUI";
import React, { useEffect, useRef, useState } from "react";
import {
  BlackDragonPage,
  FourthWingQuizPage,
  DiscoveryLinks,
} from "./DiscoveryPages";
import {
  getBondRarity,
  parseSharedBond,
  bondSharePath,
  rarityTiers,
  type BondRarity,
} from "./rarity";
import { HomeFAQ } from "./HomeFAQ";
import { StoryScene } from "./StoryScene";
import { adventureScene, JOURNAL_KEY, routes } from "./adventure";
import { JourneyProgress } from "./JourneyProgress";
import { MyDragonsPage, CollectionCount } from "./MyDragons";
import { Atmosphere } from "./Atmosphere";
import { JOURNAL_EVENT } from "./collection";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CaretLeft,
  DownloadSimple,
  ShareNetwork,
  X,
  List,
  ClockCountdown,
  BookmarkSimple,
  ArrowClockwise,
  BookOpen,
} from "@phosphor-icons/react";
import {
  dragons,
  scenes,
  RULE_VERSION,
  getResult,
  parseSavedRun,
  formatDuration,
  remainingTime,
  type Dragon,
} from "./trial";
import {
  guides,
  normalizePath,
  pageMeta,
  SOURCE_FAQ,
  SOURCE_SHOP,
  SOURCE_REDDIT,
  type Guide,
} from "./content";
import {
  readDevice as read,
  writeDevice as write,
  removeDevice as remove,
} from "./storage";
const RUN_KEY = "threshingday:adventure-run:v1",
  COLLECTION_KEY = "threshingday:collection:v1",
  TIMER_KEY = "threshingday:reminder:v1";
// Public podium enabled by user request; show only actual community data.
const SHOW_HOME_PODIUM = true;
function navigate(to: string) {
  window.history.pushState({}, "", to);
  window.dispatchEvent(new Event("site:navigate"));
}
function Link({
  to,
  children,
  className = "",
  onNavigate,
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
          return;
        e.preventDefault();
        navigate(to);
        onNavigate?.();
      }}
    >
      {children}
    </a>
  );
}
function External({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
      <ArrowUpRight size={18} aria-hidden="true" />
    </a>
  );
}
function Label({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
function Header({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  return (
    <header className="site-header">
      <Link to="/" className="brand">
        <img src="/images/emblem.webp" alt="" width="44" height="44" />
        <span>Threshing Day Game</span>
      </Link>
      <button
        className="menu-button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="main-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={24} /> : <List size={24} />}
      </button>
      <nav
        id="main-navigation"
        className={`main-nav ${open ? "is-open" : ""}`}
        aria-label="Main navigation"
      >
        {[
          ["/", "Play"],
          ["/#dragon-wall", "Dragon Wall"],
          ["/leaderboard/", "Leaderboard"],
          ["/guides/retry-cooldown/", "Retry Timer"],
          ["/dragons/", "Dragon Atlas"],
          ["/guides/", "Guides"],
          ["/my-dragons/", "My Dragons"],
        ].map(([to, label]) => (
          <Link
            key={to}
            to={to}
            onNavigate={() => setOpen(false)}
            className={
              path === to || (to === "/" && path === "/play/") ? "active" : ""
            }
          >
            {label}
            {to === "/my-dragons/" && <CollectionCount />}
          </Link>
        ))}
      </nav>
    </header>
  );
}
function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link to="/" className="footer-brand">
          Threshing Day Game
        </Link>
        <p>A little courage. A story of your own.</p>
      </div>
      <div className="footer-links">
        <Link to="/my-dragons/">My Dragons</Link>
        <Link to="/about/">About</Link>
        <Link to="/sources/">Sources</Link>
        <Link to="/privacy/">Privacy</Link>
        <Link to="/contact/">Feedback</Link>
      </div>
      <p className="disclaimer">
        Independent fan site. Not affiliated with Rebecca Yarros, Yarros Ink,
        Entangled Publishing or Red Tower Books. Our trial, dragon names and
        artwork are original fan creations. © 2026
      </p>
    </footer>
  );
}
function Trial({ fullPage = false }: { fullPage?: boolean }) {
  const [answers, setAnswers] = useState<number[]>([]),
    [step, setStep] = useState(0),
    [selected, setSelected] = useState<number | null>(null),
    [loaded, setLoaded] = useState(false),
    [transitioning, setTransitioning] = useState(false),
    [storageOK, setStorageOK] = useState(true),
    [sharedDragon, setSharedDragon] = useState<Dragon | null>(null),
    [sharedRanking, setSharedRanking] = useState<string[]>([]),
    [storyRun, setStoryRun] = useState(0),
    [started, setStarted] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const advancingRef = useRef(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (advanceTimer.current !== null) clearTimeout(advanceTimer.current);
    },
    [],
  );
  useEffect(() => {
    const saved = parseSavedRun(read(RUN_KEY));
    if (saved) {
      setAnswers(saved.answers);
      setStep(saved.step);
      setSelected(saved.answers[saved.step] ?? null);

      setStarted(saved.answers.length > 0);
    }
    const params = new URLSearchParams(window.location.search);
    const shared = parseSharedBond(params);
    if (shared) {
      setSharedDragon(shared.dragon);
      setSharedRanking(shared.ranking);
      setStarted(true);
    }
    setLoaded(true);
  }, []);
  const save = (a: number[], s: number) =>
    setStorageOK(
      write(
        RUN_KEY,
        JSON.stringify({ version: RULE_VERSION, answers: a, step: s }),
      ),
    );
  const focus = () =>
    requestAnimationFrame(() => {
      titleRef.current?.focus({ preventScroll: true });
      if (window.matchMedia("(max-width: 900px)").matches) {
        panelRef.current?.scrollIntoView({
          block: "start",
          behavior: "instant",
        });
      }
    });
  const next = (choiceIndex: number) => {
    if (!loaded || advancingRef.current) return;
    advancingRef.current = true;
    setTransitioning(true);
    setSelected(choiceIndex);
    // Briefly show the selected answer and ignore a double click on the next scene.
    advanceTimer.current = setTimeout(() => {
      const a = [...answers.slice(0, step), choiceIndex];
      setAnswers(a);

      if (step === 7) {
        save(a, step);
        write("threshingday:run-id:v1", crypto.randomUUID());
        focus();
      } else {
        setStep(step + 1);
        setSelected(null);
        save(a, step + 1);
        focus();
      }
      advancingRef.current = false;
      setTransitioning(false);
      advanceTimer.current = null;
    }, 220);
  };
  const previous = () => {
    if (advancingRef.current) return;
    const prev = Math.max(0, step - 1);
    setStep(prev);
    setSelected(answers[prev] ?? null);
    save(answers, prev);
    focus();
  };
  const restart = () => {
    if (advancingRef.current) return;
    setAnswers([]);
    setStep(0);
    setSelected(null);
    setSharedDragon(null);
    setStoryRun((run) => run + 1);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}#play-card`,
    );
    remove(RUN_KEY);
    remove("threshingday:run-id:v1");
    setStarted(true);
    focus();
  };
  const scene = adventureScene(answers.slice(0, step));
  const completed = answers.length === scenes.length;
  const showingBond = completed || sharedDragon !== null;
  useEffect(() => {
    // Warm the next illustration without delaying a player's choice.
    if (!started || step >= scenes.length - 1) return;
    const nextImage = new Image();
    nextImage.src = `/images/${adventureScene([...answers.slice(0, step), 0]).art}.webp`;
  }, [started, step, answers]);
  return (
    <section
      className={`landing-hero content-width ${fullPage ? "dedicated-play" : ""}`}
      aria-label="Threshing Day Game"
    >
      <div className="landing-copy">
        <h1>
          Threshing Day
          <br />
          <span>Game</span>
        </h1>
        <p className="landing-lead">
          A sunken passage. A lantern-lit grove. A ridge above the clouds.
          Choose your way through eight encounters, see the consequences, and
          discover the dragon waiting at the end of your story.
        </p>
        <ul className="feature-pills" aria-label="Game features">
          <li>About 3 minutes</li>
          <li>No sign up</li>
          <li>Instant replay</li>
          <li>Free dragon card</li>
        </ul>
        <div className="hero-utilities">
          <Link to="/guides/retry-cooldown/#timer">
            <ClockCountdown size={21} />
            <strong>Dragonkind retry timer</strong>
            <span>Keep your next official attempt in view.</span>
            <ArrowUpRight size={16} />
          </Link>
          <Link to="/#dragon-wall">
            <BookmarkSimple size={21} />
            <strong>The dragon wall</strong>
            <span>Meet the newest bonds from the valley.</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
        <p className="official-inline">
          Looking for the official game?{" "}
          <External href="https://dragonkind.com/">Open Dragonkind</External>
          <span>Our story is an independent fan experience.</span>
        </p>
        {!started && <JourneyProgress key={storyRun} />}
      </div>
      <div
        className={`game-card story-card ${showingBond ? "showing-bond" : ""} ${started ? "game-started" : ""} ${transitioning ? "story-leaving" : ""}`}
        ref={panelRef}
        id="play-card"
      >
        {!showingBond && (
          <div className="story-backdrop" aria-hidden="true">
            <img
              key={started ? step : "cover"}
              src={`/images/${started ? scene.art : "crossing"}.webp`}
              style={{
                objectPosition:
                  scene.art === "crossing" ? "50% 38%" : "50% 28%",
              }}
              alt=""
              fetchPriority="high"
            />
          </div>
        )}
        {showingBond ? (
          <BondResult
            earnedAnswers={sharedDragon ? null : answers}
            sharedDragon={sharedDragon}
            sharedRanking={sharedRanking}
            onRestart={restart}
          />
        ) : !started ? (
          <div className="game-intro">
            <div className="game-intro-copy">
              <h2>
                Your dragon
                <br />
                is waiting.
              </h2>
              <p>
                Three ways into the valley. Every choice leaves a mark. Where
                will your first step take you?
              </p>
              <button
                className="button primary"
                disabled={!loaded}
                onClick={() => {
                  setStarted(true);
                  focus();
                }}
              >
                Enter the valley <ArrowRight size={20} />
              </button>
              <span>8 choices · 3 routes · 6 original dragons</span>
            </div>
          </div>
        ) : (
          <div className="trial-panel">
            <div className="step-header">
              <span>
                {String(step + 1).padStart(2, "0")} / 08 · {scene.route}
              </span>
              {step > 0 && (
                <button
                  className="back-button"
                  aria-label="Previous question"
                  disabled={transitioning}
                  onClick={previous}
                >
                  <CaretLeft size={17} />
                  Back
                </button>
              )}
            </div>
            <div
              className="story-progress"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={8}
              aria-valuenow={step + 1}
              aria-label={`Question ${step + 1} of 8`}
            >
              {scenes.map((_, index) => (
                <span
                  key={index}
                  className={
                    index < step ? "complete" : index === step ? "current" : ""
                  }
                />
              ))}
            </div>
            <div className="story-slide" key={`${storyRun}-${step}`}>
              <StoryScene
                scene={scene}
                titleRef={titleRef}
                consequence={scene.consequence}
              >
                <div
                  className="choices"
                  role="group"
                  aria-label="Choose your next path"
                >
                  <p id="choice-instructions" className="sr-only">
                    Choose an answer to move directly to the next scene.
                  </p>
                  {scene.choices.map((option, i) => (
                    <button
                      type="button"
                      className={`choice ${selected === i ? "selected" : ""}`}
                      key={`${step}-${i}`}
                      disabled={!loaded || transitioning}
                      aria-describedby="choice-instructions"
                      style={{ "--choice-index": i } as React.CSSProperties}
                      onClick={(event) => {
                        if (event.detail > 1) return;
                        next(i);
                      }}
                      onKeyDown={(event) => {
                        if (event.repeat && ["Enter", " "].includes(event.key))
                          event.preventDefault();
                      }}
                    >
                      <span className="choice-letter" aria-hidden="true">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>
                        {option.text}
                        {step === 0 && (
                          <small className="choice-route">
                            {routes[i].name}
                          </small>
                        )}
                      </span>
                      <span className="choice-check" aria-hidden="true">
                        {selected === i && <Check size={20} weight="bold" />}
                      </span>
                    </button>
                  ))}
                </div>
                {!storageOK && (
                  <p className="sr-only" role="status">
                    You can keep playing. This browser cannot save your
                    progress.
                  </p>
                )}
                {step > 0 && (
                  <button
                    className="restart-link"
                    disabled={transitioning}
                    onClick={restart}
                  >
                    Start over
                  </button>
                )}
              </StoryScene>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
function Homepage() {
  return (
    <>
      <Trial />
      {SHOW_HOME_PODIUM && <HomePodium />}
      <section
        className="route-preview content-width"
        aria-label="Three routes to discover"
      >
        <div>
          <p className="eyebrow">One valley. Three ways through.</p>
          <h2>Your next journey can be different.</h2>
          <p>
            Change your first choice to find a new route. The people you help
            and the paths you notice change what happens next.
          </p>
        </div>
        <ol>
          {routes.map((route, index) => (
            <li key={route.id}>
              <span>0{index + 1}</span>
              <strong>{route.name}</strong>
              <p>
                {
                  [
                    "Read the current. Uncover the lost crossing.",
                    "Follow the bells. Decide who walks beside you.",
                    "Climb into the wind. Find a way beyond the tower.",
                  ][index]
                }
              </p>
              <small>Begin with: “{route.hint}”</small>
            </li>
          ))}
        </ol>
      </section>
      <HomeDragonWall />
      <section
        className="home-explainer content-width"
        aria-labelledby="what-title"
      >
        <div className="explainer-copy">
          <p className="eyebrow">A bond begins with a choice</p>
          <h2 id="what-title">
            What is the
            <br />
            Threshing Day Game?
          </h2>
          <p>
            In Rebecca Yarros’s world, Threshing is the trial where would-be
            riders seek a dragon bond. Our Threshing Day Game is a free,
            browser-based fan adventure about finding your dragon companion.
            Choose the sunken way, lantern grove or windward ridge. Your
            decisions lead to different encounters, crossings and consequences
            before you meet one of six original companions.
          </p>
          <p>
            Your strongest trait — insight, loyalty, freedom, courage, resolve
            or curiosity — determines your bond. There are no wrong answers or
            failed attempts here. The same choices lead to the same companion,
            and you can replay immediately.
          </p>
          <p>
            This is our original story, separate from Rebecca Yarros’s official
            Dragonkind game. Your result includes a dragon portrait, a personal
            oath and a downloadable card.
          </p>
          <Link to="/sources/" className="text-link">
            Our story & matching rules <ArrowRight size={18} />
          </Link>
        </div>
        <div className="companion-showcase">
          <img
            src="/images/aureth.webp"
            alt="Aureth, our original blue dragon"
            width="800"
            height="1000"
            loading="lazy"
          />
          <div>
            <span>Blue · Freedom</span>
            <h3>Aureth</h3>
            <p>The Unbound Horizon</p>
            <Link to="/dragons/">
              Meet all six companions <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section className="how-section">
        <div className="content-width">
          <div className="section-heading">
            <h2>How to play Threshing Day Game</h2>
            <p>Three minutes. A story to keep.</p>
          </div>
          <ol className="how-steps">
            {[
              [
                "Enter the valley",
                "Start the trial on this page. No email, download or account is required.",
              ],
              [
                "Make eight choices",
                "Choose a route and react to what you find. Later scenes remember your decisions; use Back to explore another way.",
              ],
              [
                "Meet your dragon",
                "Reveal your companion and new discoveries. Save a card, share your result, and look back through your journey.",
              ],
              [
                "Find what you missed",
                "Follow your next discovery hint to explore three routes, nine opening encounters and six companions. Publishing your bond is optional.",
              ],
            ].map(([title, text], i) => (
              <li key={title}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="home-guides content-width">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Keep exploring</p>
            <h2>A little guidance for the journey.</h2>
          </div>
          <Link to="/guides/" className="text-link">
            All guides <ArrowRight size={18} />
          </Link>
        </div>
        <div className="guide-grid">
          {guides.slice(0, 3).map((g) => (
            <Link
              to={`/guides/${g.slug}/`}
              className="guide-preview"
              key={g.slug}
            >
              <span className="guide-number">{g.number}</span>
              <h3>{g.title}</h3>
              <p>{g.short}</p>
              <span className="text-link">
                Read the guide <ArrowRight size={18} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <div className="content-width">
        <DiscoveryLinks />
      </div>
      <HomeFAQ />
    </>
  );
}
async function downloadCard(
  dragon: Dragon,
  ranking: string[],
  rarity: BondRarity | null,
) {
  await document.fonts.ready;
  const image = new Image();
  image.src = `/images/${dragon.id}.webp`;
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw Error("Card export unavailable");
  ctx.fillStyle = "#11272a";
  ctx.fillRect(0, 0, 1080, 1350);
  const cropHeight = image.naturalWidth * (1000 / 1080);
  ctx.drawImage(image, 0, 0, image.naturalWidth, cropHeight, 0, 0, 1080, 1000);
  ctx.fillRect(0, 970, 1080, 380);
  ctx.fillStyle = "#d4b780";
  ctx.font = "22px Inter";
  ctx.fillText(
    rarity
      ? `${rarity.tier} ${dragon.color} Dragon`.toUpperCase()
      : "YOUR ORIGINAL FAN COMPANION",
    64,
    1023,
  );
  ctx.fillStyle = "#f3eee4";
  ctx.font = '88px "Cormorant Garamond"';
  ctx.fillText(dragon.name, 60, 1121);
  ctx.font = '32px "Cormorant Garamond"';
  ctx.fillText(dragon.title, 64, 1173);
  ctx.fillStyle = "#bac8c5";
  ctx.font = "22px Inter";
  ctx.fillText(
    `${dragon.color} · ${dragon.tail}tail · ${(ranking.length ? ranking : [dragon.trait]).join(" / ")}`,
    64,
    1228,
  );
  if (rarity) {
    ctx.font = "18px Inter";
    ctx.fillText(
      `Bond rarity · ${rarity.percent}% of answer paths share this trait pair`,
      64,
      1260,
    );
  }
  ctx.fillStyle = "#d4b780";
  ctx.font = "20px Inter";
  ctx.fillText("THRESHING DAY GAME", 64, 1293);
  ctx.fillStyle = "#bac8c5";
  ctx.fillText("Fan-made result", 830, 1293);
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(Error("Export failed"))),
      "image/png",
    ),
  );
  const url = URL.createObjectURL(blob),
    anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${dragon.name.toLowerCase()}-dragon-bond.png`;
  anchor.click();
  return { url, filename: anchor.download };
}
function BondResult({
  earnedAnswers,
  sharedDragon,
  sharedRanking,
  onRestart,
}: {
  earnedAnswers: number[] | null;
  sharedDragon: Dragon | null;
  sharedRanking: string[];
  onRestart: () => void;
}) {
  const result = earnedAnswers ? getResult(earnedAnswers) : null;
  const dragon = result?.dragon ?? sharedDragon!;
  const ranking = result?.ranking.slice(0, 2) ?? sharedRanking;
  const rarity = getBondRarity(ranking);
  const [saved, setSaved] = useState(false),
    [busy, setBusy] = useState(false),
    [shareOpen, setShareOpen] = useState(false),
    [message, setMessage] = useState("");
  const [imageReady, setImageReady] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [exported, setExported] = useState<{
    url: string;
    filename: string;
  } | null>(null);
  useEffect(
    () => () => {
      if (exported) URL.revokeObjectURL(exported.url);
    },
    [exported],
  );
  useEffect(() => {
    try {
      const collection = JSON.parse(read(COLLECTION_KEY) || "[]");
      setSaved(Array.isArray(collection) && collection.includes(dragon.id));
    } catch {
      /* Ignore corrupt collection data. */
    }
  }, [dragon.id]);
  useEffect(() => {
    if (!imageReady) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reveal = () => setRevealed(true);
    const timer = setTimeout(reveal, motion.matches ? 0 : 1100);
    const onMotion = () => {
      if (motion.matches) reveal();
    };
    motion.addEventListener("change", onMotion);
    return () => {
      clearTimeout(timer);
      motion.removeEventListener("change", onMotion);
    };
  }, [imageReady]);
  useEffect(() => {
    if (revealed) headingRef.current?.focus({ preventScroll: true });
  }, [revealed]);
  const exportCard = async () => {
    setBusy(true);
    setMessage("");
    try {
      setExported(await downloadCard(dragon, ranking, rarity));
      setMessage("Your dragon card is ready to save.");
    } catch {
      setMessage(
        "The card could not be saved. Try again, or copy your result link.",
      );
    } finally {
      setBusy(false);
    }
  };
  const share = async (copyOnly = false) => {
    setShareOpen(true);
    setMessage("");
    const url = `${window.location.origin}${bondSharePath(dragon.id, ranking)}`;
    const text = rarity
      ? `${dragon.name} chose me — ${rarity.tier} ${dragon.color} Dragon. ${rarity.percent}% of answer paths share my ${ranking.join(" + ")} trait pair. Which dragon would choose you?`
      : `${dragon.name} chose me. Which dragon would choose you?`;
    if (!copyOnly && navigator.share) {
      try {
        await navigator.share({ title: "Threshing Day Game", text, url });
        setMessage("Your dragon is ready for another rider to discover.");
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setMessage(
        "Result and link copied. Invite a friend to find their dragon.",
      );
    } catch {
      setMessage(`Copy your result: ${text} ${url}`);
    }
  };
  const bookmark = () => {
    let c: string[] = [];
    try {
      const raw = JSON.parse(read(COLLECTION_KEY) || "[]");
      if (Array.isArray(raw))
        c = raw.filter((id) => dragons.some((d) => d.id === id));
    } catch {
      /* reset corrupt data */
    }
    const next = saved
      ? c.filter((id) => id !== dragon.id)
      : [...new Set([...c, dragon.id])];
    if (write(COLLECTION_KEY, JSON.stringify(next))) {
      setSaved(!saved);
      setMessage(
        saved
          ? "Removed from your device collection."
          : "Saved to your collection on this device.",
      );
    } else
      setMessage(
        "This browser cannot save a collection. You can still download your card.",
      );
  };
  return (
    <section
      className={`bond-panel ${imageReady ? "bond-arriving" : ""} ${revealed ? "bond-revealed" : ""}`}
      aria-label="Your dragon bond"
    >
      <div className="dragon-card">
        <img
          src={`/images/${dragon.id}.webp`}
          onLoad={() => setImageReady(true)}
          onError={() => {
            setImageReady(true);
            setRevealed(true);
          }}
          alt={`Original painting of ${dragon.name}, a ${dragon.color.toLowerCase()} dragon`}
          width="800"
          height="1000"
        />
        <div className="dragon-card-caption">
          <Label>
            {rarity
              ? `${rarity.tier} ${dragon.color} Dragon`
              : "Your original fan companion"}
          </Label>
          <h2>{dragon.name}</h2>
          <p>{dragon.title}</p>
          <span>
            {dragon.color} · {dragon.tail}tail
          </span>
          <small>Threshing Day Game · Fan-made result</small>
        </div>
      </div>
      {!revealed && (
        <p className="bond-reveal-status" role="status">
          A bond is awakening…
        </p>
      )}
      <div className="result-copy" inert={!revealed} aria-hidden={!revealed}>
        <Label>The beginning of a bond</Label>
        <h2 ref={headingRef} tabIndex={-1}>
          {dragon.name} has chosen you.
        </h2>
        <p className="result-description">{dragon.description}</p>
        <div className="trait-tags">
          {(ranking.length ? ranking : [dragon.trait]).map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        {rarity && (
          <div className="bond-rarity">
            <span
              className={`rarity-badge rarity-${rarity.tier.toLowerCase()}`}
            >
              {rarity.tier} bond
            </span>
            <p>{rarity.percent}% of all answer paths share this trait pair.</p>
            <details>
              <summary>How rare is this bond?</summary>
              <p>
                {rarity.paths.toLocaleString("en-US")} of{" "}
                {rarity.total.toLocaleString("en-US")} possible paths lead to{" "}
                {ranking.join(" + ")}, in that order. Each path counts equally.
                This describes our fan quiz’s answer combinations, not real
                riders or official Dragonkind odds.{" "}
                <Link to="/sources/#bond-rarity">See all tiers.</Link>
              </p>
            </details>
          </div>
        )}
        <blockquote>“{dragon.oath}”</blockquote>
        <div className="bond-primary-actions">
          <button
            className="button primary"
            onClick={exportCard}
            disabled={busy}
          >
            {busy ? "Saving…" : "Save card"}
          </button>
          <button className="button secondary" onClick={() => share()}>
            Share
          </button>
          <button className="button secondary" onClick={onRestart}>
            Go again
          </button>
        </div>
        {earnedAnswers && <JourneyProgress answers={earnedAnswers} />}
        {!earnedAnswers && (
          <p className="shared-journey-note">
            This is a shared companion. Play your own journey to discover routes
            and fill your exploration journal.
          </p>
        )}
        {shareOpen && (
          <div className="share-fallback">
            <button className="text-button" onClick={() => share(true)}>
              Copy result & link
            </button>
            <p>Invite a friend to discover their dragon.</p>
          </div>
        )}
        <p className="action-message" role="status">
          {message}
        </p>
        {exported && (
          <details className="export-preview">
            <summary>Preview & download your PNG card</summary>
            <img
              src={exported.url}
              alt={`Downloadable fan companion card for ${dragon.name}`}
              width="1080"
              height="1350"
            />
            <a
              className="text-link"
              href={exported.url}
              download={exported.filename}
            >
              Download PNG · 1080 × 1350 <DownloadSimple size={18} />
            </a>
          </details>
        )}
        {earnedAnswers && (
          <details className="bond-publish">
            <summary>Share your bond with the riders’ hall</summary>
            <PublishBond answers={earnedAnswers} />
          </details>
        )}
        <p className="fan-note">
          An original fan result, separate from your official Dragonkind bond.
          Names, personalities and artwork are our own.
        </p>
        <div className="result-bottom">
          <button className="text-button" onClick={bookmark}>
            <BookmarkSimple size={16} weight={saved ? "fill" : "regular"} />
            {saved ? "Saved on this device" : "Keep this companion"}
          </button>
          <Link to="/dragons/" className="text-link">
            Meet the others <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
function Reminder() {
  const [hours, setHours] = useState(""),
    [minutes, setMinutes] = useState(""),
    [deadline, setDeadline] = useState<number | null>(null),
    [now, setNow] = useState(0),
    [error, setError] = useState(""),
    [storage, setStorage] = useState(true);
  useEffect(() => {
    const raw = Number(read(TIMER_KEY));
    if (Number.isFinite(raw) && raw > 0) setDeadline(raw);
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const start = (e: React.FormEvent) => {
    e.preventDefault();
    const h = hours === "" ? 0 : Number(hours),
      m = minutes === "" ? 0 : Number(minutes);
    if (
      !Number.isInteger(h) ||
      !Number.isInteger(m) ||
      h < 0 ||
      h > 168 ||
      m < 0 ||
      m > 59 ||
      h + m === 0
    ) {
      setError(
        "Enter a duration greater than zero: 0–168 hours and 0–59 minutes.",
      );
      return;
    }
    const end = Date.now() + (h * 60 + m) * 60000;
    setDeadline(end);
    setNow(Date.now());
    setStorage(write(TIMER_KEY, String(end)));
    setError("");
  };
  const remaining = deadline ? remainingTime(deadline, now) : 0;
  return (
    <section id="timer" className="reminder-box" aria-labelledby="timer-title">
      <div className="reminder-title">
        <ClockCountdown size={28} />
        <div>
          <Label>Your personal reminder</Label>
          <h3 id="timer-title">Keep your next chance in view.</h3>
        </div>
      </div>
      {deadline ? (
        <>
          <div
            className="timer-display"
            aria-label={`Time remaining ${formatDuration(remaining)}`}
          >
            {formatDuration(remaining)}
          </div>
          <p className="timer-units">
            hours <span>minutes</span> seconds
          </p>
          <p role="status">
            {remaining === 0 ? (
              "Your reminder has ended. Check Dragonkind for your next attempt."
            ) : (
              <>
                Estimated end:{" "}
                <strong>
                  {new Date(deadline).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </strong>
              </>
            )}
          </p>
          <button
            className="text-button"
            onClick={() => {
              setDeadline(null);
              remove(TIMER_KEY);
              setError("");
            }}
          >
            <X size={18} />
            Clear & set a new reminder
          </button>
        </>
      ) : (
        <form onSubmit={start}>
          <p>Enter the remaining time displayed by your official game.</p>
          <div className="timer-fields">
            <label>
              Hours
              <input
                type="number"
                inputMode="numeric"
                min="0"
                max="168"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="0"
              />
            </label>
            <label>
              Minutes
              <input
                type="number"
                inputMode="numeric"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                placeholder="0"
              />
            </label>
          </div>
          <button className="button primary" type="submit">
            Start reminder <ArrowRight size={19} />
          </button>
        </form>
      )}
      <p className="form-error" role="alert">
        {error}
      </p>
      <small>
        {storage
          ? "Saved in this browser. Keep this page open for the end message."
          : "This browser cannot save the reminder. Keep this page open."}{" "}
        This reminder does not unlock or sync with Dragonkind.
      </small>
    </section>
  );
}
function GuidesPage() {
  return (
    <main className="editorial-page guides-page">
      <div className="page-intro">
        <Label>The field notes</Label>
        <h1>
          A little guidance.
          <br />A little more courage.
        </h1>
        <p>
          Find the right entrance, understand the wait, and leave the guesses
          behind. Practical help for the official Dragonkind experience.
        </p>
      </div>
      <div className="guide-list">
        {guides.map((g) => (
          <Link to={`/guides/${g.slug}/`} className="guide-row" key={g.slug}>
            <span>{g.number}</span>
            <div>
              <Label>{g.category}</Label>
              <h2>{g.title}</h2>
              <p>{g.short}</p>
            </div>
            <ArrowRight size={28} />
          </Link>
        ))}
      </div>
      <DiscoveryLinks />
      <div className="source-note">
        <BookOpen size={22} />
        <p>
          Official guidance and player observations are kept distinct.{" "}
          <Link to="/sources/">Read our sources & methods.</Link>
        </p>
      </div>
    </main>
  );
}
function GuidePage({ guide }: { guide: Guide }) {
  return (
    <main className="editorial-page article-page">
      <div className="breadcrumbs">
        <Link to="/guides/">Guides</Link>
        <span>/</span>
        <span>{guide.category}</span>
      </div>
      <header className="article-header">
        <Label>{guide.category}</Label>
        <h1>{guide.title}</h1>
        <div className="article-meta">
          <span>Checked October 4, 2026</span>
          <span>No book spoilers in the summary</span>
        </div>
        <p className="article-intro">{guide.intro}</p>
      </header>
      <div className="article-layout">
        <article>
          {guide.sections.map((s) =>
            s.spoiler ? (
              <details className="spoiler-block" key={s.id}>
                <summary>
                  Reveal scene details <span>Game scene spoilers</span>
                </summary>
                <section id={s.id}>
                  <h2>{s.title}</h2>
                  {s.text.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                  {s.source && (
                    <External href={s.source} className="source-link">
                      {s.label || "Source"}
                    </External>
                  )}
                </section>
              </details>
            ) : (
              <section id={s.id} key={s.id}>
                <h2>{s.title}</h2>
                {s.text.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {s.source && (
                  <External href={s.source} className="source-link">
                    {s.label || "Source"}
                  </External>
                )}
                {s.label && !s.source && (
                  <p className="source-tag">{s.label}</p>
                )}
              </section>
            ),
          )}
          {guide.slug === "retry-cooldown" && <Reminder />}
          {guide.slug === "black-blue-dragons" && <DiscoveryLinks />}
          <div className="article-next">
            <Label>Your story is waiting</Label>
            <h3>Try an original fan adventure.</h3>
            <p>
              Eight choices, a dragon of your own, and a card worth keeping.
            </p>
            <Link to="/play/" className="button primary">
              Begin the trial <ArrowRight size={19} />
            </Link>
          </div>
        </article>
        <aside>
          <Label>In this guide</Label>
          {guide.sections
            .filter((s) => !s.spoiler)
            .map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                {s.title}
              </a>
            ))}
          {guide.slug === "retry-cooldown" && (
            <a href="#timer">Personal retry reminder</a>
          )}
          <External href="https://dragonkind.com/" className="text-link">
            Official Dragonkind
          </External>
          <p>Our trial is a separate, original fan story.</p>
        </aside>
      </div>
    </main>
  );
}
function AtlasPage() {
  const [filter, setFilter] = useState("All"),
    [collection, setCollection] = useState<string[]>([]);
  useEffect(() => {
    try {
      const saved = JSON.parse(read(COLLECTION_KEY) || "[]");
      if (Array.isArray(saved))
        setCollection(saved.filter((id) => dragons.some((d) => d.id === id)));
    } catch {
      /* empty fallback */
    }
  }, []);
  const items = dragons.filter(
    (d) =>
      filter === "All" ||
      filter === d.color ||
      (filter === "My companions" && collection.includes(d.id)),
  );
  return (
    <main className="atlas-page">
      <div className="page-intro">
        <Label>The original dragon atlas</Label>
        <h1>
          Six spirits.
          <br />A thousand possible stories.
        </h1>
        <p>
          Meet our original fan companions. These portraits and personality
          meanings belong to our trial; they are separate from official
          Dragonkind results.
        </p>
      </div>
      <div className="atlas-filters" aria-label="Filter original dragons">
        {[
          "All",
          "Black",
          "Blue",
          "Brown",
          "Green",
          "Red",
          "Orange",
          "My companions",
        ].map((c) => (
          <button
            className={filter === c ? "active" : ""}
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
            key={c}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="dragon-grid">
        {items.map((d) => (
          <Link
            key={d.id}
            to={`/?dragon=${d.id}&v=${RULE_VERSION}#play-card`}
            className="atlas-card"
          >
            <img
              src={`/images/${d.id}.webp`}
              width="800"
              height="1000"
              alt={`Original ${d.color.toLowerCase()} dragon ${d.name}`}
              loading="lazy"
            />
            <div>
              <Label>
                {d.color} · {d.trait}
              </Label>
              <h2>{d.name}</h2>
              <p>{d.title}</p>
              <span>
                Meet this companion <ArrowRight size={18} />
              </span>
            </div>
          </Link>
        ))}
      </div>
      {!items.length && (
        <div className="empty-collection">
          <h2>Your collection begins with a choice.</h2>
          <p>
            Finish the trial and choose Keep this companion in the game’s result
            card.
          </p>
          <Link to="/play/" className="button primary">
            Begin the trial <ArrowRight size={19} />
          </Link>
        </div>
      )}
      <section className="atlas-facts">
        <Label>The official color families</Label>
        <h2>
          Artwork is imagination.
          <br />
          Guidance needs a source.
        </h2>
        <p>
          The official shop lists black, blue, brown, green, orange and red
          collections. The author’s FAQ confirms all colors and tail types are
          possible. Neither source publishes a matching algorithm or color
          probabilities.
        </p>
        <External href={SOURCE_SHOP} className="text-link">
          Official color collections
        </External>
        <External href={SOURCE_FAQ} className="text-link">
          Author’s Dragonkind FAQ
        </External>
        <details>
          <summary>About tails and our original companions</summary>
          <p>
            Our fan cards use swordtail, daggertail, clubtail, scorpiontail and
            morningstartail labels. A card’s color, tail and personality
            combination is our own creative choice. It does not predict a match,
            rarity or lineage in the official game.
          </p>
        </details>
      </section>
    </main>
  );
}
function Feedback() {
  const [note, setNote] = useState(""),
    [status, setStatus] = useState("");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        `Threshing Day Game correction\n\n${note}`,
      );
      setStatus(
        "Correction note copied. Share it through the channel where you found this site.",
      );
    } catch {
      setStatus("Copy is unavailable. Select and copy the note directly.");
    }
  };
  return (
    <div className="feedback-form">
      <label htmlFor="correction">
        Page, suggested correction & supporting source
      </label>
      <textarea
        id="correction"
        rows={6}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Which page needs a correction? Include a source link if you have one."
      />
      <button className="button primary" onClick={copy} disabled={!note.trim()}>
        Copy correction note <ArrowRight size={19} />
      </button>
      <p role="status">{status}</p>
      <small>
        This creates a note for you to share. It does not submit a report
        automatically.
      </small>
    </div>
  );
}
function ClearDeviceData() {
  const [confirm, setConfirm] = useState(false),
    [message, setMessage] = useState("");
  return (
    <div className="clear-data">
      {confirm ? (
        <>
          <p>
            This removes your story progress, exploration journal, saved
            companions and reminder from this browser.
          </p>
          <button
            className="button outline"
            onClick={() => {
              const cleared = [
                RUN_KEY,
                COLLECTION_KEY,
                JOURNAL_KEY,
                "threshingday:run:v1",
                TIMER_KEY,
                "threshingday:run-id:v1",
                "threshingday:published:v1",
                "threshingday:rider-name:v1",
                "threshingday:atmosphere",
              ]
                .map(remove)
                .every(Boolean);
              setConfirm(false);
              window.dispatchEvent(new Event(JOURNAL_EVENT));
              setMessage(
                cleared
                  ? "Your saved story, exploration journal, companions and reminder have been cleared."
                  : "This browser could not clear persistent storage. Clear this site in your browser’s site-data settings.",
              );
            }}
          >
            Clear saved data
          </button>
          <button className="text-button" onClick={() => setConfirm(false)}>
            Cancel
          </button>
        </>
      ) : (
        <button className="button outline" onClick={() => setConfirm(true)}>
          Manage saved site data
        </button>
      )}
      <p role="status">{message}</p>
    </div>
  );
}
function InfoPage({ path }: { path: string }) {
  if (path === "/sources/")
    return (
      <main className="editorial-page info-page">
        <Label>Checked October 5, 2026</Label>
        <h1>Sources & methods.</h1>
        <p className="article-intro">
          A guide should tell you what it knows, where it learned it, and what
          remains uncertain.
        </p>
        <h2>Official sources</h2>
        <p>
          We use the author’s FAQ for code delivery and retry rules, the
          official game for its entrance, and official shop collections for the
          six color families.
        </p>
        <div className="source-list">
          <External href="https://dragonkind.com/">
            Dragonkind · Official game
          </External>
          <External href={SOURCE_FAQ}>Rebecca Yarros · Dragonkind FAQ</External>
          <External href={SOURCE_SHOP}>
            Rebecca Yarros Shop · Color collections
          </External>
        </div>
        <External
          href="https://rebeccayarros.com/threshing-day-xaden"
          className="text-link"
        >
          Rebecca Yarros · Threshing bonus story
        </External>
        <h2>Community observations</h2>
        <p>
          Reddit threads help identify questions and describe player
          experiences. These are labeled community reports. They do not
          establish official code, hidden mechanics, probabilities or a
          guaranteed route.
        </p>
        <External href={SOURCE_REDDIT} className="text-link">
          Dragon bonding megathread · Part 3
        </External>
        <h2>Original fan work</h2>
        <p>
          Our eight-choice story, dragon names, portraits, traits and result
          rules are original. AI-assisted illustrations are reviewed for
          consistency. Our test uses fixed trait scores and a fixed tie-break
          order, so the same answers under the same rules give the same result.
          This is entertainment, not a personality assessment.
        </p>
        <h2 id="bond-rarity">How bond rarity works</h2>
        <p>
          We enumerate all 6,561 possible eight-choice paths under matching
          rules v1. Each path counts once. We group results by their two leading
          traits, in order, using the same fixed tie-break as the trial. The
          group’s share of all paths determines bond rarity v1:
        </p>
        <ul>
          {rarityTiers.map((tier, index) => (
            <li key={tier.name}>
              <strong>{tier.name}</strong>:{" "}
              {index === 0
                ? "up to"
                : `above ${rarityTiers[index - 1].maxPercent}% and up to`}{" "}
              {tier.maxPercent}% of paths.
            </li>
          ))}
        </ul>
        <p>
          These are theoretical answer-path frequencies, not measured player
          percentages or random drop rates. Players may prefer some answers.
          Rarity belongs to a trait combination, not a dragon color; it does not
          change your strength score or official bond. Percentages are rounded
          to two decimals, while tier boundaries use exact counts. Shared links
          describe a possible result; they are not proof of a completed or
          published run.
        </p>
        <h2>Corrections</h2>
        <p>
          Sources are checked when content is reviewed. We do not have a live
          view of the official game’s status or your account. If a source
          changes, share a correction with its URL.
        </p>
        <Link to="/contact/" className="text-link">
          Prepare a correction note <ArrowRight size={18} />
        </Link>
      </main>
    );
  if (path === "/privacy/")
    return (
      <main className="editorial-page info-page">
        <Label>Last updated October 5, 2026</Label>
        <h1>Your story stays with you.</h1>
        <p className="article-intro">
          Your progress, saved companions and reminder are stored in your
          browser. We use Google Analytics and Microsoft Clarity to understand
          how visitors use this website and improve the experience.
        </p>
        <h2>Analytics and session recordings</h2>
        <p>
          Google Analytics measures website visits and usage. Microsoft Clarity
          provides heatmaps and session recordings of website interactions.
          These services may use cookies and collect usage, browser and device
          data, which is processed by Google and Microsoft. Read{" "}
          <External href="https://policies.google.com/technologies/partner-sites">
            how Google uses information from partner sites
          </External>{" "}
          and the{" "}
          <External href="https://privacy.microsoft.com/privacystatement">
            Microsoft Privacy Statement
          </External>{" "}
          for more information.
        </p>
        <h2>What is stored on this device</h2>
        <p>
          Your eight choices and current question, completed journey paths,
          saved companion IDs, your background-motion preference, and the end
          time of a reminder use localStorage. Your exploration journal records
          discoveries on this device only. Your answers are sent for score
          verification only if you choose to publish a bond. The answers
          themselves are not retained in the database. This storage does not
          follow you to another browser or device.
        </p>
        <h2>Optional public bonds</h2>
        <p>
          When you publish, we store your chosen rider name, dragon,
          bond-strength score, story ID and publication time in Cloudflare D1.
          Your public name and bond appear on the dragon wall and rankings. A
          first-party, HttpOnly cookie recognizes your anonymous rider profile;
          a hashed identifier links your bonds. We do not request your email or
          retain your answer path. Publishing again with the same browser
          updates your public name.
        </p>
        <p>
          You can remove all your public bonds below from the browser that
          published them. Clearing its cookie first loses that access. Removing
          public bonds does not clear your saved local trial.
        </p>
        <RemovePublicBonds />
        <h2>What a shared link contains</h2>
        <p>
          A result link contains a companion ID and rules version. New links
          also include a secondary trait and rarity version to recreate the
          trait pair and bond tier. It does not contain your eight answers,
          name, email or official Dragonkind information. Anyone with the link
          can see that fan result.
        </p>
        <h2>Website requests and external links</h2>
        <p>
          Your browser requests pages, locally hosted fonts and illustrations
          from the website host. The host may process ordinary request
          information such as IP address and server logs. External sources and
          the official game have their own privacy practices.
        </p>
        <h2>Clear your saved story</h2>
        <p>
          Start a new trial to replace the current story while keeping your
          exploration journal. Remove companions from their result cards, or
          clear a reminder on the retry page. You can also remove all site
          storage using your browser’s site-data controls.
        </p>
        <ClearDeviceData />
        <h2>Feedback notes</h2>
        <p>
          The feedback page only helps you prepare and copy a note. It does not
          upload or submit its contents.
        </p>
      </main>
    );
  if (path === "/contact/")
    return (
      <main className="editorial-page info-page">
        <Label>Help keep the guide useful</Label>
        <h1>
          A correction starts
          <br />
          with a good source.
        </h1>
        <p className="article-intro">
          Found an outdated rule or unclear sentence? Prepare a short note with
          the page and a source, then share it through the channel where you
          found this site.
        </p>
        <Feedback />
        <h2>For official account help</h2>
        <p>
          We cannot access your Dragonkind account or resend a code. Use the
          official site and the author’s FAQ. Never include a login code or
          password in a correction note.
        </p>
        <External href={SOURCE_FAQ} className="text-link">
          Official Dragonkind FAQ
        </External>
      </main>
    );
  if (path === "/about/")
    return (
      <main className="editorial-page info-page">
        <Label>A fan story, thoughtfully made</Label>
        <h1>
          A little courage.
          <br />A story of your own.
        </h1>
        <p className="article-intro">
          Threshing Day Game is an independent fan trial and a practical
          companion for people exploring Dragonkind.
        </p>
        <h2>Our original trial</h2>
        <p>
          We wrote eight moments about choices, uncertainty and the promises you
          keep. They lead to six original dragons, each with a portrait and a
          card to save. There are no accounts, forced wait timers or paid
          outcomes.
        </p>
        <h2>A clear path to the official game</h2>
        <p>
          Dragonkind at dragonkind.com is the official experience. Our guides
          explain common questions using official sources and clearly labeled
          community observations. Our trial does not connect to your official
          bond.
        </p>
        <h2>Independent fan work</h2>
        <p>
          We are not affiliated with Rebecca Yarros, Yarros Ink, Entangled
          Publishing or Red Tower Books. The Empyrean series belongs to its
          respective owners. Our artwork is AI-assisted original fan art; names
          and matching rules are our own.
        </p>
        <Link to="/sources/" className="text-link">
          Read our sources & methods <ArrowRight size={18} />
        </Link>
      </main>
    );
  return (
    <main className="empty-state">
      <Label>A path not yet taken</Label>
      <h1>
        This page wandered
        <br />
        out of the valley.
      </h1>
      <p>Return to your story or find the guide you need.</p>
      <Link to="/" className="button primary">
        Back to the trial <ArrowRight size={20} />
      </Link>
      <Link to="/guides/" className="text-link">
        Explore the guides
      </Link>
    </main>
  );
}
export default function App({ initialPath = "/" }: { initialPath?: string }) {
  const [path, setPath] = useState(normalizePath(initialPath)),
    [routeKey, setRouteKey] = useState(initialPath);
  const pageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => {
      setPath(normalizePath(window.location.pathname));
      setRouteKey(window.location.pathname + window.location.search);
      if (window.location.hash)
        requestAnimationFrame(() =>
          document
            .getElementById(window.location.hash.slice(1))
            ?.scrollIntoView(),
        );
      else {
        window.scrollTo(0, 0);
        requestAnimationFrame(() =>
          pageRef.current?.focus({ preventScroll: true }),
        );
      }
    };
    if (window.location.hash) update();
    window.addEventListener("site:navigate", update);
    window.addEventListener("popstate", update);
    return () => {
      window.removeEventListener("site:navigate", update);
      window.removeEventListener("popstate", update);
    };
  }, []);
  useEffect(() => {
    const meta = pageMeta(path);
    document.title = meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", meta.description);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", `https://threshingdaygame.xyz${path}`);
    document
      .querySelector('meta[name="robots"]')
      ?.setAttribute(
        "content",
        path === "/my-dragons/" ||
          pageMeta(path).title.startsWith("Page Not Found")
          ? "noindex,follow"
          : "index,follow",
      );
  }, [path]);
  const guide = guides.find((g) => path === `/guides/${g.slug}/`);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Atmosphere />
      <Header path={path} />
      <div
        id="main-content"
        className="page-content"
        role={["/", "/play/"].includes(path) ? "main" : undefined}
        tabIndex={-1}
        ref={pageRef}
        key={routeKey}
      >
        {path === "/" ? (
          <Homepage />
        ) : path === "/play/" ? (
          <Trial fullPage />
        ) : path === "/dragonkind-black-dragon/" ? (
          <BlackDragonPage />
        ) : path === "/fourth-wing-dragon-quiz/" ? (
          <FourthWingQuizPage />
        ) : path === "/leaderboard/" ? (
          <LeaderboardPage />
        ) : path === "/guides/" ? (
          <GuidesPage />
        ) : guide ? (
          <GuidePage guide={guide} />
        ) : path === "/my-dragons/" ? (
          <MyDragonsPage />
        ) : path === "/dragons/" ? (
          <AtlasPage />
        ) : (
          <InfoPage path={path} />
        )}
      </div>
      <Footer />
    </>
  );
}
