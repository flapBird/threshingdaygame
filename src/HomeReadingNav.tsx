import { useEffect, useState } from "react";
import { ArrowUp, ArrowUpRight, BookOpen } from "@phosphor-icons/react";

const chapters = [
  ["about-game", "The game & its world"],
  ["how-to-play", "Choices & your journey"],
  ["field-guides", "Dragonkind field guides"],
  ["player-questions", "Player questions"],
] as const;

/** A reading aid for existing content; following a chapter keeps the trial intact. */
export function HomeReadingNav() {
  const [active, setActive] = useState<string>(chapters[0][0]);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-12% 0px -55% 0px" },
    );
    chapters.forEach(([id]) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);
  return (
    <aside className="reading-directory">
      <div className="reading-directory-inner">
        <p className="eyebrow">
          <BookOpen size={16} aria-hidden="true" /> Explore the world
        </p>
        <nav aria-label="Explore the world">
          <ol>
            {chapters.map(([id, label], index) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? "location" : undefined}
                  onClick={() => setActive(id)}
                >
                  <span aria-hidden="true">0{index + 1}</span>
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="reading-directory-links">
          <a href="/dragons/">
            Meet our six dragons <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <a href="#play-card">
            Return to your story <ArrowUp size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </aside>
  );
}
