import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowClockwise,
  Crown,
  Trophy,
  Check,
  ShareNetwork,
} from "@phosphor-icons/react";
import { dragons } from "./trial";
import {
  bondStrength,
  communityRequest,
  type Community,
  type Rider,
} from "./community";
import { readDevice, writeDevice } from "./storage";

function useCommunity(period = "today") {
  const [data, setData] = useState<Community | null>(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const next = await communityRequest<Community>(
          `community?period=${period}`,
        );
        if (alive) {
          setData(next);
          setError("");
        }
      } catch {
        if (alive)
          setError(
            "The community is temporarily unavailable. You can still play.",
          );
      } finally {
        if (alive) setLoading(false);
      }
    };
    setLoading(true);
    setData(null);
    void load();
    const interval = setInterval(load, 30000);
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, [period, revision]);
  return { data, error, loading, refresh: () => setRevision((n) => n + 1) };
}
function CommunityStatus({
  error,
  loading,
  retry,
}: {
  error: string;
  loading: boolean;
  retry: () => void;
}) {
  if (error)
    return (
      <div className="community-status" role="status">
        <p>{error}</p>
        <button className="text-button" onClick={retry}>
          <ArrowClockwise size={16} /> Try again
        </button>
      </div>
    );
  if (loading)
    return (
      <p className="community-status" role="status">
        Opening the riders’ hall…
      </p>
    );
  return null;
}
function Portrait({ id, className = "" }: { id: string; className?: string }) {
  const dragon = dragons.find((d) => d.id === id);
  return dragon ? (
    <img
      className={className}
      src={`/images/${id}.webp`}
      alt={`${dragon.name}, ${dragon.color.toLowerCase()} dragon`}
      width="80"
      height="80"
      loading="lazy"
    />
  ) : null;
}
function Podium({ leaders }: { leaders: Rider[] }) {
  return (
    <div className="podium" aria-label="Top three riders">
      {[1, 0, 2].map((index) => {
        const rider = leaders[index];
        return (
          <div key={index} className={`podium-place place-${index + 1}`}>
            {index === 0 && (
              <Crown
                className="podium-crown"
                weight="fill"
                size={22}
                aria-hidden="true"
              />
            )}
            <div className={`podium-avatar ${rider ? "" : "awaiting"}`}>
              <Portrait
                id={rider?.dragonId || ["aureth", "vesper", "pyrren"][index]}
              />
              <span>{index + 1}</span>
            </div>
            <strong>{rider?.name || "Seat awaits"}</strong>
            <small>
              {rider ? `${rider.points} points` : "Your next adventure"}
            </small>
          </div>
        );
      })}
    </div>
  );
}
export function HomePodium() {
  const { data, error, loading, refresh } = useCommunity();
  return (
    <section
      className="home-podium content-width"
      aria-labelledby="podium-title"
    >
      <div>
        <Trophy size={23} className="gold" />
        <h2 id="podium-title">Today’s top riders</h2>
        <p>
          {data
            ? `${data.riders.toLocaleString()} riders in the valley · ${data.bonds.toLocaleString()} total bonds`
            : "A new place in the riders’ hall"}
          <span>New rankings every day at 00:00 UTC</span>
        </p>
      </div>
      {data && !error ? (
        <Podium leaders={data.leaders} />
      ) : (
        <div className="podium-unavailable">
          <Trophy size={30} aria-hidden="true" />
          <p>
            {loading
              ? "Gathering today’s riders…"
              : "The hall will return soon."}
          </p>
        </div>
      )}
      <div className="podium-cta">
        <p>Discover. Collect. Climb.</p>
        <a className="button primary" href="/leaderboard/">
          View leaderboard <ArrowRight size={17} />
        </a>
      </div>
      <CommunityStatus error={error} loading={loading} retry={refresh} />
    </section>
  );
}
export function LeaderboardPage() {
  const [period, setPeriod] = useState("today");
  const { data, error, loading, refresh } = useCommunity(period);
  return (
    <main className="community-page content-width">
      <div className="community-intro">
        <p className="eyebrow">The riders’ hall</p>
        <h1>Every bond tells a story.</h1>
        <p>
          Explore all six dragons. Your best bond with each companion earns a
          place in the Threshing Day Game leaderboard.
        </p>
      </div>
      <div className="community-toolbar">
        <div className="segmented" role="group" aria-label="Ranking period">
          {[
            ["today", "Today"],
            ["all", "All time"],
          ].map(([value, label]) => (
            <button
              key={value}
              aria-pressed={period === value}
              onClick={() => setPeriod(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <span>
          {period === "today"
            ? "Resets at 00:00 UTC"
            : "Your strongest bonds across every day"}
        </span>
      </div>
      <CommunityStatus error={error} loading={loading} retry={refresh} />
      {data && (
        <>
          <Podium leaders={data.leaders} />
          {data.leaders.length > 0 ? (
            <div className="ranking-table-wrap">
              <table className="ranking-table">
                <caption className="sr-only">
                  {period === "today" ? "Daily" : "All-time"} rider rankings
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Rank</th>
                    <th scope="col">Rider</th>
                    <th scope="col">Dragons</th>
                    <th scope="col">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {data.leaders.map((rider, i) => (
                    <tr key={`${i}-${rider.name}`}>
                      <td>{String(i + 1).padStart(2, "0")}</td>
                      <td>
                        <div className="ranking-rider">
                          <Portrait id={rider.dragonId} />
                          <strong>{rider.name}</strong>
                        </div>
                      </td>
                      <td>{rider.discovered} / 6</td>
                      <td>{rider.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="community-empty">
              <h2>The first seat could be yours.</h2>
              <p>Finish a trial and publish your bond to begin the rankings.</p>
              <a href="/play/" className="button primary">
                Find your dragon <ArrowRight size={18} />
              </a>
            </div>
          )}
        </>
      )}
      <section className="ranking-rules">
        <h2>How the rankings work</h2>
        <div>
          <p>
            <strong>One dragon, one best score.</strong> Bond strength measures
            how closely your choices match your companion’s defining trait, up
            to 100 points.
          </p>
          <p>
            <strong>Collect all six.</strong> Your total is the sum of your best
            score for each dragon, up to 600. Repeating the same bond does not
            add points.
          </p>
          <p>
            <strong>A fresh flight each day.</strong> Daily rankings count bonds
            published that UTC day. Equal scores are ordered by collection size,
            then the collection formed earlier. No prizes or official Dragonkind
            results are involved.
          </p>
        </div>
      </section>
    </main>
  );
}
export function HomeDragonWall() {
  const { data, error, loading, refresh } = useCommunity("all");
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(false);
  const bonds =
    data?.recent.filter((b) => filter === "all" || b.dragonId === filter) || [];
  return (
    <section
      id="dragon-wall"
      className="home-wall content-width"
      aria-labelledby="wall-title"
    >
      <div className="wall-intro">
        <div>
          <p className="eyebrow">Together in the valley</p>
          <h2 id="wall-title">The dragon wall</h2>
          <p>
            Real bonds, shared by their riders. Explore the newest companions
            discovered in our original Threshing Day Game.
          </p>
        </div>
        <a className="text-link" href="/leaderboard/">
          View leaderboard <ArrowRight size={18} />
        </a>
      </div>
      <div className="wall-stats">
        <div>
          <strong>{dragons.length}</strong>
          <span>Original companions</span>
        </div>
        <div>
          <strong>{data?.bonds.toLocaleString() ?? "—"}</strong>
          <span>Published bonds</span>
        </div>
        <div>
          <strong>{data?.riders.toLocaleString() ?? "—"}</strong>
          <span>Riders in the valley</span>
        </div>
        <a href="/play/" className="button primary">
          Add your story <ArrowRight size={18} />
        </a>
      </div>
      <div className="wall-heading">
        <div>
          <h3>Six dragons. Your story.</h3>
          <p>
            Choose a companion to filter the newest bonds. Counts include all
            published bonds of that color.
          </p>
        </div>
        <button
          className="wall-all-filter"
          aria-pressed={filter === "all"}
          onClick={() => {
            setFilter("all");
            setExpanded(false);
          }}
        >
          All dragons
        </button>
      </div>
      <div
        className="wall-companions"
        role="group"
        aria-label="Filter newest bonds by dragon color"
      >
        {dragons.map((d) => {
          const count = data
            ? (data.colors.find((c) => c.dragonId === d.id)?.count ?? 0)
            : null;
          return (
            <button
              key={d.id}
              aria-pressed={filter === d.id}
              onClick={() => {
                setFilter(d.id);
                setExpanded(false);
              }}
            >
              <img
                src={`/images/${d.id}.webp`}
                alt=""
                width="800"
                height="1000"
                loading="lazy"
              />
              <span className="wall-companion-copy">
                <span className="wall-companion-color">
                  {d.color} · {d.trait}
                </span>
                <strong>{d.name}</strong>
                <span className="wall-companion-count">
                  {count === null
                    ? loading
                      ? "Loading count…"
                      : "Count unavailable"
                    : `${count.toLocaleString()} published ${count === 1 ? "bond" : "bonds"}`}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="wall-community-grid">
        <aside
          className="wall-distribution"
          aria-labelledby="wall-colors-title"
        >
          <h3 id="wall-colors-title">Dragon colors</h3>
          <p>A glimpse of the bonds shared in our valley.</p>
          <div className="wall-color-bars">
            {dragons.map((dragon) => {
              const count =
                data?.colors.find((color) => color.dragonId === dragon.id)
                  ?.count ?? 0;
              const share =
                data && data.bonds > 0 ? (count / data.bonds) * 100 : 0;
              return (
                <div className="wall-color-row" key={dragon.id}>
                  <span>{dragon.color}</span>
                  <span className="wall-color-track" aria-hidden="true">
                    <span
                      style={{
                        width: `${share}%`,
                        backgroundColor: (
                          {
                            Black: "#827a96",
                            Blue: "#579bc7",
                            Brown: "#ae8058",
                            Green: "#629c7c",
                            Red: "#c76558",
                            Orange: "#d89a56",
                          } as Record<string, string>
                        )[dragon.color],
                      }}
                    />
                  </span>
                  <span>{data ? `${Math.round(share)}%` : "—"}</span>
                </div>
              );
            })}
          </div>
          <p className="wall-color-note">
            {data?.bonds === 0
              ? "No published bonds yet. Every color is waiting for its first story."
              : "Shares reflect published bonds, not your odds of meeting a dragon."}
          </p>
          <a href="/dragons/" className="text-link">
            Explore the dragon atlas <ArrowRight size={16} />
          </a>
        </aside>
        <div className="wall-latest">
          <h3 className="wall-feed-title">
            {filter === "all"
              ? "Latest shared bonds"
              : `Latest ${dragons.find((d) => d.id === filter)?.color.toLowerCase()} dragon bonds`}
          </h3>
          <CommunityStatus error={error} loading={loading} retry={refresh} />
          {data &&
            (bonds.length ? (
              <div className="home-bond-feed">
                {(expanded ? bonds : bonds.slice(0, 6)).map((b) => {
                  const d = dragons.find((d) => d.id === b.dragonId)!;
                  return (
                    <article key={b.id}>
                      <img
                        src={`/images/${d.id}.webp`}
                        alt={`${d.name}, our original ${d.color.toLowerCase()} dragon`}
                        width="800"
                        height="1000"
                        loading="lazy"
                      />
                      <div>
                        <span>
                          {d.color} · {b.strength}% bond
                        </span>
                        <h4>{d.name}</h4>
                        <p>
                          Bonded with <strong>{b.name}</strong>
                        </p>
                        <time dateTime={new Date(b.createdAt).toISOString()}>
                          {new Date(b.createdAt).toLocaleDateString("en-GB", {
                            month: "short",
                            day: "numeric",
                            timeZone: "UTC",
                          })}
                        </time>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="community-empty">
                <h4>
                  {filter === "all"
                    ? "The valley is waiting for its first rider."
                    : "No recent bonds of this color yet."}
                </h4>
                <p>
                  {data.bonds === 0
                    ? "All six companions are ready to discover. Complete a trial and choose Publish my bond to add your story here."
                    : "The wall shows the latest 24 published bonds across all colors. Try All dragons to see the newest stories, or publish your own."}
                </p>
                <a href="/play/" className="text-link">
                  Enter the valley <ArrowRight size={18} />
                </a>
              </div>
            ))}
          {bonds.length > 6 && (
            <button
              className="text-button wall-more"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded
                ? "Show fewer bonds"
                : `Show all ${bonds.length} recent bonds`}
            </button>
          )}
        </div>
      </div>
      <p className="wall-note">
        New bonds appear here automatically. All dragon names, artwork and
        matching rules are original fan creations.
      </p>
    </section>
  );
}
export function PublishBond({ answers }: { answers: number[] | null }) {
  const [name, setName] = useState(""),
    [runId, setRunId] = useState(""),
    [busy, setBusy] = useState(false),
    [published, setPublished] = useState(false),
    [message, setMessage] = useState("");
  useEffect(() => {
    let id = readDevice("threshingday:run-id:v1");
    if (!id) {
      id = crypto.randomUUID();
      writeDevice("threshingday:run-id:v1", id);
    }
    setRunId(id);
    setPublished(readDevice("threshingday:published:v1") === id);
    setName(readDevice("threshingday:rider-name:v1") || "");
  }, []);
  if (!answers) return null;
  const result = bondStrength(answers);
  return (
    <section className="publish-bond">
      <div className="publish-heading">
        <Trophy size={22} />
        <div>
          <h2>
            {published
              ? "Your story is in the riders’ hall."
              : "Give your bond a place in the hall."}
          </h2>
          <p>
            {result.strength}% bond strength · Discover more dragons to grow
            your score.
          </p>
        </div>
      </div>
      {published ? (
        <div className="published-links">
          <Check size={19} />
          <a href="/leaderboard/">
            See the rankings <ArrowRight size={16} />
          </a>
          <a href="/#dragon-wall">Visit the dragon wall</a>
        </div>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (busy || !runId) return;
            setBusy(true);
            setMessage("");
            try {
              await communityRequest("bonds", {
                method: "POST",
                body: JSON.stringify({ name: name.trim(), answers, runId }),
              });
              setPublished(true);
              writeDevice("threshingday:published:v1", runId);
              writeDevice("threshingday:rider-name:v1", name.trim());
            } catch (err) {
              setMessage((err as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <label htmlFor="rider-name">Choose your rider name</label>
          <div className="publish-fields">
            <input
              id="rider-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength={2}
              maxLength={24}
              required
              placeholder="Your name in the valley"
              autoComplete="nickname"
            />
            <button className="button primary" disabled={busy || !runId}>
              <ShareNetwork size={18} />
              {busy ? "Publishing…" : "Publish my bond"}
            </button>
          </div>
          <p className="publish-consent">
            Optional. Your rider name and dragon will be public. No email or
            account needed.
          </p>
          <p className="action-message" role="status">
            {message}
          </p>
        </form>
      )}
    </section>
  );
}
export function RemovePublicBonds() {
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  return (
    <div className="remove-public clear-data">
      <button
        className="button outline"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            const result = await communityRequest<{ count: number }>("bonds", {
              method: "DELETE",
            });
            writeDevice("threshingday:published:v1", "");
            setMessage(
              result.count
                ? "Your public bonds have been removed."
                : "No public bonds were found for this browser. Use the browser that published them.",
            );
          } catch (err) {
            setMessage((err as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Removing…" : "Remove my public bonds"}
      </button>
      <p role="status">{message}</p>
    </div>
  );
}
