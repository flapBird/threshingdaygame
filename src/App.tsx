import React, { useEffect, useRef, useState } from "react";
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
const RUN_KEY = "threshingday:run:v1",
  COLLECTION_KEY = "threshingday:collection:v1",
  TIMER_KEY = "threshingday:reminder:v1";
function navigate(to: string) {
  window.history.pushState({}, "", to);
  window.dispatchEvent(new Event("site:navigate"));
}
function Link({
  to,
  children,
  className = "",
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
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
        <span>Threshing Day</span>
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
        <Link
          to="/guides/"
          className={path.startsWith("/guides") ? "active" : ""}
        >
          Guides
        </Link>
        <Link to="/dragons/" className={path === "/dragons/" ? "active" : ""}>
          Dragon Atlas
        </Link>
        <External href="https://dragonkind.com/" className="official-nav">
          Official Dragonkind
        </External>
      </nav>
    </header>
  );
}
function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link to="/" className="footer-brand">
          Threshing Day
        </Link>
        <p>A little courage. A story of your own.</p>
      </div>
      <div className="footer-links">
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
function OfficialStrip() {
  return (
    <section className="official-strip" aria-label="Official game help">
      <Link to="/guides/code-not-received/">
        Login & code help <ArrowUpRight size={18} />
      </Link>
      <Link to="/guides/retry-cooldown/#timer">
        Set a retry reminder <ArrowRight size={20} />
      </Link>
    </section>
  );
}
function Trial({ fullPage = false }: { fullPage?: boolean }) {
  const [answers, setAnswers] = useState<number[]>([]),
    [step, setStep] = useState(0),
    [selected, setSelected] = useState<number | null>(null),
    [loaded, setLoaded] = useState(false),
    [transitioning, setTransitioning] = useState(false),
    [storageOK, setStorageOK] = useState(true),
    [hasSaved, setHasSaved] = useState(false);
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
      setHasSaved(saved.answers.length > 0);
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
      setHasSaved(true);
      if (step === 7) {
        save(a, step);
        navigate("/result/");
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
    setHasSaved(false);
    remove(RUN_KEY);
    focus();
  };
  const scene = scenes[step];
  return (
    <>
      <section
        className={`trial-layout ${fullPage ? "full-trial" : ""} ${step > 0 ? "trial-in-progress" : ""}`}
        aria-label="Original eight-choice fan trial"
      >
        <div className="trial-art">
          <picture>
            <source
              media="(max-width:700px)"
              srcSet="/images/crossing-mobile.webp"
            />
            <img
              src="/images/crossing.webp"
              width="1200"
              height="1320"
              fetchPriority="high"
              alt="An original painting of a dragon watching a traveler cross a moonlit stone bridge."
            />
          </picture>
          <div className="hero-copy">
            {step === 0 ? (
              <>
                <h1>
                  <span className="sr-only">Threshing Day Game. </span>
                  {fullPage ? (
                    "A story of your own."
                  ) : (
                    <>
                      Your first choice
                      <br />
                      changes everything.
                    </>
                  )}
                </h1>
                <p>Eight choices. A dragon of your own. No account required.</p>
              </>
            ) : (
              <>
                <h1>
                  Your story
                  <br />
                  is unfolding.
                </h1>
                <p>
                  Follow your instincts. A bond is built one choice at a time.
                </p>
              </>
            )}
          </div>
          <span className="art-credit">Original fan artwork</span>
        </div>
        <div className="trial-panel" ref={panelRef}>
          {answers.length === 8 && hasSaved ? (
            <div className="saved-bond">
              <Label>Your story is waiting</Label>
              <h2 ref={titleRef} tabIndex={-1}>
                You have found
                <br />
                your dragon.
              </h2>
              <p>
                Return to your bond, keep your card, or take a different path
                through the valley.
              </p>
              <Link to="/result/" className="button primary">
                See your dragon <ArrowRight size={22} />
              </Link>
              <button className="text-button" onClick={restart}>
                <ArrowClockwise size={18} />
                Begin a new story
              </button>
            </div>
          ) : (
            <>
              <div className="step-header">
                <span>{String(step + 1).padStart(2, "0")} / 08 </span>
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
                className="progress-track"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={8}
                aria-valuenow={step + 1}
                aria-label={`Question ${step + 1} of 8`}
              >
                <span style={{ width: `${((step + 1) / 8) * 100}%` }} />
              </div>
              <h2 ref={titleRef} tabIndex={-1}>
                {scene.title}
              </h2>
              <p className="scene-story">{scene.story}</p>
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
                    <span>{option.text}</span>
                    <span className="choice-check" aria-hidden="true">
                      {selected === i && <Check size={20} weight="bold" />}
                    </span>
                  </button>
                ))}
              </div>
              {!storageOK && (
                <p className="sr-only" role="status">
                  You can keep playing. This browser cannot save your progress.
                </p>
              )}
              {hasSaved && step > 0 && (
                <button
                  className="restart-link"
                  disabled={transitioning}
                  onClick={restart}
                >
                  Start over
                </button>
              )}
            </>
          )}
        </div>
      </section>
      <OfficialStrip />
    </>
  );
}
function Homepage() {
  return (
    <>
      <Trial />
      <section className="editorial-section">
        <div className="section-heading">
          <div>
            <Label>A little guidance</Label>
            <h2>Before your next adventure.</h2>
          </div>
          <Link to="/guides/" className="text-link">
            All guides <ArrowRight size={20} />
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
      <section className="atlas-teaser">
        <div>
          <Label>Six original companions</Label>
          <h2>
            Some bonds
            <br />
            begin with a whisper.
          </h2>
          <p>
            A watchful sentinel. An unbound spirit. A heart of embers. Meet the
            original dragons that might answer your choices.
          </p>
          <Link to="/dragons/" className="button outline">
            Explore the atlas <ArrowRight size={20} />
          </Link>
        </div>
        <img
          src="/images/vesper.webp"
          width="800"
          height="1000"
          alt="Vesper, our original black dragon companion"
          loading="lazy"
        />
        <img
          src="/images/sylvara.webp"
          width="800"
          height="1000"
          alt="Sylvara, our original green dragon companion"
          loading="lazy"
        />
      </section>
      <section className="faq-section">
        <Label>Before you enter</Label>
        <h2>A few things worth knowing.</h2>
        {[
          [
            "Is this the official Threshing Day game?",
            "This is an independent fan experience. The official Dragonkind game is at dragonkind.com. Our original trial has its own story, artwork and matching rules.",
          ],
          [
            "Do I need an account?",
            "No. Complete our eight-choice trial without an email or account. Progress and saved companions stay in this browser.",
          ],
          [
            "Will my result affect my official dragon?",
            "No. Our result is an original fan companion. We do not read, predict or change your official Dragonkind account.",
          ],
          [
            "Can I take the trial again?",
            "Yes. Choose Begin a new story when you return to the trial. There is no wait timer for our original story.",
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
    </>
  );
}
async function downloadCard(dragon: Dragon, ranking: string[]) {
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
  ctx.fillText("YOUR ORIGINAL FAN COMPANION", 64, 1023);
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
  ctx.fillStyle = "#d4b780";
  ctx.font = "20px Inter";
  ctx.fillText("THRESHING DAY", 64, 1293);
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
function ResultPage() {
  const [dragon, setDragon] = useState<Dragon | null>(null),
    [ranking, setRanking] = useState<string[]>([]),
    [ready, setReady] = useState(false),
    [saved, setSaved] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
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
    const params = new URLSearchParams(window.location.search),
      id = params.get("dragon");
    let found: Dragon | undefined;
    if (id) {
      if (params.get("v") === String(RULE_VERSION))
        found = dragons.find((d) => d.id === id);
    } else {
      const run = parseSavedRun(read(RUN_KEY));
      if (run?.answers.length === 8) {
        const result = getResult(run.answers);
        found = result.dragon;
        setRanking(result.ranking.slice(0, 2));
      }
    }
    if (found) {
      setDragon(found);
      try {
        const c = JSON.parse(read(COLLECTION_KEY) || "[]");
        setSaved(Array.isArray(c) && c.includes(found.id));
      } catch {
        /* ignore corrupt data */
      }
    }
    setReady(true);
  }, []);
  if (!ready)
    return (
      <div className="empty-state">
        <Label>Your dragon bond</Label>
        <h1>Opening your story…</h1>
      </div>
    );
  if (!dragon)
    return (
      <div className="empty-state">
        <Label>A new beginning</Label>
        <h1>Your story is still unwritten.</h1>
        <p>
          Complete the eight-choice trial to meet your dragon. If someone shared
          a card, ask them for its current result link.
        </p>
        <Link to="/play/" className="button primary">
          Begin your story <ArrowRight size={20} />
        </Link>
      </div>
    );
  const exportCard = async () => {
    setBusy(true);
    setMessage("");
    try {
      setExported(await downloadCard(dragon, ranking));
      setMessage("Your dragon card is ready to save.");
    } catch {
      setMessage(
        "The card could not be saved. Try again, or copy your result link.",
      );
    } finally {
      setBusy(false);
    }
  };
  const share = async () => {
    const url = `${window.location.origin}/result/?dragon=${dragon.id}&v=${RULE_VERSION}`;
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Result link copied. Your story is ready to share.");
    } catch {
      setMessage(`Copy this result link: ${url}`);
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
    <section className="result-page">
      <div className="dragon-card">
        <img
          src={`/images/${dragon.id}.webp`}
          alt={`Original painting of ${dragon.name}, a ${dragon.color.toLowerCase()} dragon`}
          width="800"
          height="1000"
        />
        <div className="dragon-card-caption">
          <Label>Your original fan companion</Label>
          <h2>{dragon.name}</h2>
          <p>{dragon.title}</p>
          <span>
            {dragon.color} · {dragon.tail}tail
          </span>
          <small>Threshing Day · Fan-made result</small>
        </div>
      </div>
      <div className="result-copy">
        <Label>The beginning of a bond</Label>
        <h1>
          {dragon.name}
          <span>has chosen you.</span>
        </h1>
        <p className="result-description">{dragon.description}</p>
        <div className="trait-tags">
          {(ranking.length ? ranking : [dragon.trait]).map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <blockquote>“{dragon.oath}”</blockquote>
        <button className="button primary" onClick={exportCard} disabled={busy}>
          <DownloadSimple size={21} />
          {busy ? "Preparing your card…" : "Save your dragon card"}
        </button>
        <div className="result-actions">
          <button className="text-button" onClick={share}>
            <ShareNetwork size={20} />
            Copy result link
          </button>
          <button className="text-button" onClick={bookmark}>
            <BookmarkSimple size={20} weight={saved ? "fill" : "regular"} />
            {saved ? "Saved on this device" : "Keep this companion"}
          </button>
        </div>
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
        <p className="fan-note">
          An original fan result, separate from your official Dragonkind bond.
          Names, personalities and artwork are our own.
        </p>
        <div className="result-bottom">
          <button
            className="text-button"
            onClick={() => {
              remove(RUN_KEY);
              navigate("/play/");
            }}
          >
            <ArrowClockwise size={18} />
            Explore another path
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
    <main className="light-page">
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
    <main className="light-page article-page">
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
            to={`/result/?dragon=${d.id}&v=${RULE_VERSION}`}
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
            Finish the trial and choose Keep this companion on your result page.
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
            This removes your progress, saved companions and reminder from this
            browser.
          </p>
          <button
            className="button outline"
            onClick={() => {
              const cleared = [RUN_KEY, COLLECTION_KEY, TIMER_KEY]
                .map(remove)
                .every(Boolean);
              setConfirm(false);
              setMessage(
                cleared
                  ? "Your saved story, companions and reminder have been cleared."
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
      <main className="light-page info-page">
        <Label>Checked October 4, 2026</Label>
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
      <main className="light-page info-page">
        <Label>Last updated October 4, 2026</Label>
        <h1>Your story stays with you.</h1>
        <p className="article-intro">
          Your progress, saved companions and reminder are stored in your
          browser. We use Google Analytics and Microsoft Clarity to understand
          how visitors use this website and improve the experience.
        </p>
        <h2>Analytics and session recordings</h2>
        <p>
          Google Analytics measures website visits and usage. Microsoft Clarity
          provides heatmaps and session recordings of website interactions. These
          services may use cookies and collect usage, browser and device data,
          which is processed by Google and Microsoft. Read
          {" "}
          <External href="https://policies.google.com/technologies/partner-sites">
            how Google uses information from partner sites
          </External>
          {" "}and the{" "}
          <External href="https://privacy.microsoft.com/privacystatement">
            Microsoft Privacy Statement
          </External>
          {" "}for more information.
        </p>
        <h2>What is stored on this device</h2>
        <p>
          Your eight choices and current question, saved companion IDs, and the
          end time of a reminder use localStorage. They are not sent to an
          application database. This storage does not follow you to another
          browser or device.
        </p>
        <h2>What a shared link contains</h2>
        <p>
          A result link contains a companion ID and rules version. It does not
          contain your answers, name, email or official Dragonkind information.
          Anyone with the link can see that fan companion.
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
          Start a new trial to replace progress, remove companions from their
          result pages, or clear a reminder on the retry page. You can also
          remove all site storage using your browser’s site-data controls.
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
      <main className="light-page info-page">
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
      <main className="light-page info-page">
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
        requestAnimationFrame(() => pageRef.current?.focus());
      }
    };
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
        path === "/result/" || pageMeta(path).title.startsWith("Page Not Found")
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
      <Header path={path} />
      <div
        id="main-content"
        className="page-content"
        role={["/", "/play/", "/result/"].includes(path) ? "main" : undefined}
        tabIndex={-1}
        ref={pageRef}
        key={routeKey}
      >
        {path === "/" ? (
          <Homepage />
        ) : path === "/play/" ? (
          <Trial fullPage />
        ) : path === "/result/" ? (
          <ResultPage />
        ) : path === "/guides/" ? (
          <GuidesPage />
        ) : guide ? (
          <GuidePage guide={guide} />
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
