import { useEffect, useRef, useState } from "react";
import { dragons } from "./trial";
import { dragonCollection, JOURNAL_EVENT } from "./collection";
import { readDevice, writeDevice } from "./storage";
import {
  JOURNAL_KEY,
  journalProgress,
  journeyTrail,
  nextDiscovery,
  parseJournal,
  routes,
} from "./adventure";

export function JourneyProgress({ answers }: { answers?: number[] }) {
  const [paths, setPaths] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [persistent, setPersistent] = useState(true);
  const [unlocks, setUnlocks] = useState<string[]>([]);
  const recorded = useRef<string | null>(null);
  const code = answers?.join("");
  useEffect(() => {
    const stored = parseJournal(readDevice(JOURNAL_KEY));
    let next = stored;
    if (code && /^[012]{8}$/.test(code) && recorded.current !== code) {
      recorded.current = code;
      if (!stored.includes(code)) {
        next = [...stored, code];
        const before = journalProgress(stored),
          after = journalProgress(next);
        const notices = [];
        if (
          dragonCollection(JSON.stringify(next)).collected.length >
          dragonCollection(JSON.stringify(stored)).collected.length
        )
          notices.push("New bond combination discovered");
        if (after.companions.length > before.companions.length)
          notices.push("New companion discovered");
        if (after.routes.length > before.routes.length)
          notices.push(`New route: ${routes[Number(code[0])].name}`);
        if (after.encounters.length > before.encounters.length)
          notices.push("New encounter recorded");
        if (after.routes.length === 3 && before.routes.length < 3)
          notices.push("Wayfinder · All three routes");
        if (after.companions.length === 6 && before.companions.length < 6)
          notices.push("Dragonkeeper · All six companions");
        setUnlocks(notices);
        setPersistent(writeDevice(JOURNAL_KEY, JSON.stringify(next)));
        window.dispatchEvent(new Event(JOURNAL_EVENT));
      }
    }
    setPaths(next);
    setReady(true);
  }, [code]);
  if (!ready || (!answers && !paths.length)) return null;
  const progress = journalProgress(paths);
  const goal = nextDiscovery(paths);
  const trail = answers ? journeyTrail(answers) : null;
  return (
    <section
      className={`journey-progress ${answers ? "journey-result" : "journey-return"}`}
      aria-label="Your exploration journal"
    >
      {!!unlocks.length && (
        <p className="journey-unlocks" role="status">
          {unlocks.join(" · ")}
        </p>
      )}
      <div className="journey-heading">
        <h3>{answers ? "Your discoveries" : "Your next discovery"}</h3>
        <span>On this device</span>
      </div>
      <div className="journey-counts">
        <span>
          <strong>{progress.companions.length}/6</strong> companions
        </span>
        <span>
          <strong>{progress.routes.length}/3</strong> routes
        </span>
        <span>
          <strong>{progress.encounters.length}/9</strong> encounters
        </span>
      </div>
      <ul className="discovery-companions" aria-label="Discovered companions">
        {dragons.map((dragon) => {
          const found = progress.companions.includes(dragon.id);
          return (
            <li
              key={dragon.id}
              className={found ? "discovered" : "undiscovered"}
            >
              <img
                src={`/images/${dragon.id}.webp`}
                alt=""
                width="80"
                height="100"
                loading="lazy"
              />
              <span>{dragon.name}</span>
              <small>{found ? "Found" : "To discover"}</small>
            </li>
          );
        })}
      </ul>
      <a href="/my-dragons/" className="journey-collection-link">
        Open My Dragons ·{" "}
        {dragonCollection(JSON.stringify(paths)).collected.length}/30 bonds{" "}
        <span aria-hidden="true">→</span>
      </a>
      <div className="journey-goal">
        <strong>{goal.title}</strong>
        <p>{goal.hint}</p>
      </div>
      {trail && (
        <details className="journey-trail">
          <summary>Your journey through {routes[answers![0]].name}</summary>
          <ol>
            {trail.map((entry, index) => (
              <li key={entry.id}>
                <strong>
                  {index + 1}. {entry.title}
                </strong>
                <p>{entry.choice}</p>
                <small>{entry.outcome}</small>
              </li>
            ))}
          </ol>
        </details>
      )}
      {!persistent && (
        <p role="status">
          Your discoveries are available for this session. This browser could
          not save them for your next visit.
        </p>
      )}
    </section>
  );
}
