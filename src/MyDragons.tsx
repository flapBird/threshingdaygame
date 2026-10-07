import { useEffect, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  LockKey,
  Check,
  Trophy,
  Compass,
  Sparkle,
  ShareNetwork,
} from "@phosphor-icons/react";
import { dragons, traits } from "./trial";
import { JOURNAL_KEY, nextDiscovery } from "./adventure";
import { readDevice } from "./storage";
import { bondSharePath, rarityTiers } from "./rarity";
import {
  bondVariants,
  dragonCollection,
  rarityOrder,
  JOURNAL_EVENT,
} from "./collection";

function useCollection() {
  const [raw, setRaw] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const update = () => {
      setRaw(readDevice(JOURNAL_KEY));
      setReady(true);
    };
    update();
    window.addEventListener(JOURNAL_EVENT, update);

    return () => {
      window.removeEventListener(JOURNAL_EVENT, update);
    };
  }, []);
  return { ...dragonCollection(raw), ready };
}
export function CollectionCount() {
  const { collected, ready } = useCollection();
  return ready ? (
    <span
      className="collection-count"
      aria-label={`${collected.length} bond combinations discovered`}
    >
      {collected.length}
    </span>
  ) : null;
}
const colors: Record<string, string> = {
  Black: "#b5abc9",
  Blue: "#80bbed",
  Brown: "#c59b78",
  Green: "#88bda5",
  Red: "#e39d87",
  Orange: "#e7b66e",
};
export function MyDragonsPage() {
  const { paths, collected, rarest, progress, ready } = useCollection();
  const [color, setColor] = useState("All");
  const [tier, setTier] = useState("All");
  const [order, setOrder] = useState("recent");
  const [hint, setHint] = useState("");
  const [message, setMessage] = useState("");
  const found = new Set(collected.map((bond) => bond.id));
  const goal = nextDiscovery(paths);
  // Journal-derived next goal below is independent of saved portrait bookmarks.
  const filtered = collected.filter(
    (bond) =>
      (color === "All" || bond.dragon.color === color) &&
      (tier === "All" || bond.rarity.tier === tier),
  );
  if (order === "rarity")
    filtered.sort(
      (a, b) =>
        rarityOrder(a.rarity.tier) - rarityOrder(b.rarity.tier) ||
        a.rarity.paths - b.rarity.paths,
    );
  const share = async () => {
    const text = `My Threshing Day Game collection: ${progress.companions.length}/6 dragons, ${collected.length}/30 bond combinations and ${progress.routes.length}/3 routes.${rarest ? ` Rarest bond: ${rarest.rarity.tier} ${rarest.dragon.name} (${rarest.ranking.join(" + ")}).` : ""} Find your dragon: ${window.location.origin}/play/`;
    try {
      await navigator.clipboard.writeText(text);
      setMessage(
        "Collection summary copied. Your private journey stays on this device.",
      );
    } catch {
      setMessage(text);
    }
  };
  return (
    <main className="my-dragons content-width">
      <header className="collection-intro">
        <p className="eyebrow">Your own corner of the valley</p>
        <h1>My Dragons</h1>
        <p>
          Every companion you have met. Every bond still waiting.
          <br />
          Your collection lives in this browser, with no account needed.
        </p>
      </header>
      {!ready ? (
        <p role="status">Opening your collection…</p>
      ) : (
        <>
          <section
            className="rider-record"
            aria-labelledby="rider-record-title"
          >
            <img
              src={`/images/${rarest?.dragon.id ?? "crossing"}.webp`}
              alt={
                rarest
                  ? `${rarest.dragon.name}, your rarest discovered bond`
                  : "The bridge into the valley"
              }
              width="160"
              height="200"
            />
            <div>
              <p className="eyebrow">Rider record · Saved on this device</p>
              <h2 id="rider-record-title">
                {rarest
                  ? `${rarest.dragon.name}’s companion`
                  : "Your story is still unwritten."}
              </h2>
              <p>
                {rarest
                  ? `Rarest discovery: ${rarest.rarity.tier} ${rarest.dragon.color.toLowerCase()} dragon · ${rarest.ranking.join(" + ")}`
                  : "Cross the bridge and make your first bond. It will be waiting for you here."}
              </p>
              <div className="collection-stats">
                <span>
                  <strong>
                    {progress.companions.length}
                    <small> / 6</small>
                  </strong>
                  Dragons discovered
                </span>
                <span>
                  <strong>
                    {collected.length}
                    <small> / 30</small>
                  </strong>
                  Bond combinations
                </span>
                <span>
                  <strong>{progress.journeys}</strong>Unique journeys
                </span>
              </div>
            </div>
            <a className="button primary" href="/play/#play-card">
              {collected.length
                ? "Return to the valley"
                : "Find my first dragon"}
              <ArrowRight size={17} />
            </a>
          </section>
          <section
            className="collection-achievements"
            aria-label="Your milestones"
          >
            {[
              {
                name: "First bond",
                text: "Complete a journey",
                done: collected.length > 0,
                Icon: Sparkle,
              },
              {
                name: "Wayfinder",
                text: `${progress.routes.length}/3 routes explored`,
                done: progress.routes.length === 3,
                Icon: Compass,
              },
              {
                name: "Dragonkeeper",
                text: `${progress.companions.length}/6 companions met`,
                done: progress.companions.length === 6,
                Icon: Trophy,
              },
              {
                name: "Bond collector",
                text: `${collected.length}/30 combinations found`,
                done: collected.length === 30,
                Icon: Check,
              },
            ].map(({ name, text, done, Icon }) => (
              <div
                key={name}
                className={done ? "milestone earned" : "milestone"}
              >
                <Icon size={21} />
                <div>
                  <strong>{name}</strong>
                  <span>{text}</span>
                </div>
                {done && <Check size={15} aria-label="Earned" />}
              </div>
            ))}
          </section>
          <section
            className="collection-book"
            aria-labelledby="collection-title"
          >
            <div className="collection-section-head">
              <div>
                <p className="eyebrow">Six companions. Thirty ways to bond.</p>
                <h2 id="collection-title">
                  Your collection <span>{collected.length} / 30</span>
                </h2>
              </div>
              <button
                className="button secondary"
                onClick={share}
                disabled={!collected.length}
              >
                <ShareNetwork size={17} /> Share my collection
              </button>
            </div>
            <p className="collection-explanation">
              Each dragon has five possible secondary traits. Discover a new
              pairing to fill another space. Colors and tails stay true to our
              six original companions.
            </p>
            <p className="matrix-scroll-hint">
              Swipe across to explore every secondary trait.
            </p>
            <div
              className="bond-matrix-scroll"
              role="region"
              aria-label="Bond collection grid, scroll horizontally on small screens"
              tabIndex={0}
            >
              <table className="bond-matrix">
                <caption className="sr-only">
                  Discovered dragon and secondary-trait combinations
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Dragon / second trait</th>
                    {traits.map((t) => (
                      <th scope="col" key={t}>
                        {t}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dragons.map((dragon) => (
                    <tr key={dragon.id}>
                      <th scope="row">
                        <strong>{dragon.name}</strong>
                        <small>
                          {dragon.color} · {dragon.trait}
                        </small>
                      </th>
                      {traits.map((secondary) => {
                        if (secondary === dragon.trait)
                          return (
                            <td key={secondary} className="matrix-na">
                              <span aria-label="A secondary trait must be different">
                                —
                              </span>
                            </td>
                          );
                        const variant = bondVariants.find(
                          (b) => b.id === `${dragon.id}:${secondary}`,
                        )!;
                        const discovered = found.has(variant.id);
                        return (
                          <td
                            key={secondary}
                            style={
                              {
                                "--dragon-color": colors[dragon.color],
                              } as CSSProperties
                            }
                          >
                            {discovered ? (
                              <a
                                href={bondSharePath(dragon.id, variant.ranking)}
                                className="matrix-bond found"
                                aria-label={`${dragon.name}, ${secondary}, ${variant.rarity.tier}, discovered. View card`}
                              >
                                <img
                                  src={`/images/${dragon.id}.webp`}
                                  alt=""
                                  width="150"
                                  height="85"
                                  loading="lazy"
                                />
                                <Check size={17} />
                                <span>{variant.rarity.tier}</span>
                              </a>
                            ) : (
                              <button
                                className="matrix-bond locked"
                                aria-label={`Discover ${dragon.name} with ${secondary}`}
                                onClick={() =>
                                  setHint(
                                    `Seek ${dragon.name} through ${dragon.trait}, with ${secondary} as your second strongest trait. Your full set of eight decisions shapes the pair. Choose actions that express both, with ${dragon.trait} leading.`,
                                  )
                                }
                              >
                                <img
                                  src={`/images/${dragon.id}.webp`}
                                  alt=""
                                  width="150"
                                  height="85"
                                  loading="lazy"
                                />
                                <LockKey size={16} />
                                <span>Undiscovered</span>
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="collection-next" role="status">
              <Compass size={20} />
              <p>{hint || `${goal.title}. ${goal.hint}`}</p>
              <a href="/play/#play-card">
                Explore <ArrowRight size={16} />
              </a>
            </div>
            {message && (
              <p className="action-message" role="status">
                {message}
              </p>
            )}
          </section>
          <section
            className="collected-dragons"
            aria-labelledby="your-dragons-title"
          >
            <div className="collection-section-head">
              <h2 id="your-dragons-title">Your dragons</h2>
              <span>{filtered.length} discovered combinations</span>
            </div>
            <div className="collection-filters">
              <label>
                Color
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                >
                  {["All", ...dragons.map((d) => d.color)].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label>
                Rarity
                <select value={tier} onChange={(e) => setTier(e.target.value)}>
                  {["All", ...rarityTiers.map((t) => t.name)].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label>
                Sort
                <select
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                >
                  <option value="recent">Newest discovery</option>
                  <option value="rarity">Rarest first</option>
                </select>
              </label>
            </div>
            {filtered.length ? (
              <div className="collection-cards">
                {filtered.map((bond) => (
                  <a
                    className={`collected-card tier-${bond.rarity.tier.toLowerCase()}`}
                    style={
                      {
                        "--dragon-color": colors[bond.dragon.color],
                      } as CSSProperties
                    }
                    href={bondSharePath(bond.dragon.id, bond.ranking)}
                    key={bond.id}
                  >
                    <img
                      src={`/images/${bond.dragon.id}.webp`}
                      alt={`${bond.dragon.name}, ${bond.dragon.color.toLowerCase()} dragon`}
                      width="800"
                      height="1000"
                      loading="lazy"
                    />
                    <div className="collected-card-top">
                      <span
                        className={`rarity-badge rarity-${bond.rarity.tier.toLowerCase()}`}
                      >
                        {bond.rarity.tier}
                      </span>
                      <h3>{bond.dragon.name}</h3>
                      <p>
                        {bond.dragon.color} · {bond.dragon.tail}tail
                      </p>
                    </div>
                    <div className="collected-card-bottom">
                      <strong>{bond.ranking.join(" + ")}</strong>
                      <span>
                        {bond.journeys} unique{" "}
                        {bond.journeys === 1 ? "journey" : "journeys"} · View &
                        share <ArrowRight size={14} />
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="collection-empty">
                <Sparkle size={28} />
                <h3>
                  {collected.length
                    ? "No bonds match these filters."
                    : "An empty page. A thousand possibilities."}
                </h3>
                <p>
                  {collected.length
                    ? "Try another color or rarity to find your companions."
                    : "Complete eight choices to reveal your first dragon and unlock its place in your collection."}
                </p>
                {collected.length ? (
                  <button
                    className="text-button"
                    onClick={() => {
                      setColor("All");
                      setTier("All");
                    }}
                  >
                    Clear filters
                  </button>
                ) : (
                  <a className="button primary" href="/play/#play-card">
                    Begin a journey <ArrowRight size={17} />
                  </a>
                )}
              </div>
            )}
            <p className="collection-footnote">
              Only completed journeys fill this collection. Opening a shared
              card or bookmarking an atlas portrait does not unlock a bond.
              Bookmarked portraits remain in the Dragon Atlas. Rarity describes
              answer combinations, not official dragon odds.{" "}
              <a href="/sources/#bond-rarity">How rarity works</a>
            </p>
          </section>
        </>
      )}
    </main>
  );
}
