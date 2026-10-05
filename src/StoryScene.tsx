import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from "react";
import type { Scene } from "./trial";

/** Keep the paragraph's final geometry while revealing its text. */
export function StoryScene({
  scene,
  titleRef,
  children,
}: {
  scene: Scene;
  titleRef: Ref<HTMLHeadingElement>;
  children: ReactNode;
}) {
  const [visible, setVisible] = useState(0);
  const [choicesReady, setChoicesReady] = useState(false);
  const [decisionHeight, setDecisionHeight] = useState(0);
  const decisionsRef = useRef<HTMLDivElement>(null);
  const complete = visible >= scene.story.length;
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const finish = () => {
      if (motion.matches) {
        clearInterval(timer);
        setVisible(scene.story.length);
      }
    };
    if (motion.matches) finish();
    else
      timer = setInterval(
        () =>
          setVisible((count) => {
            const next = Math.min(count + 2, scene.story.length);
            if (next === scene.story.length) clearInterval(timer);
            return next;
          }),
        20,
      );
    motion.addEventListener("change", finish);
    return () => {
      clearInterval(timer);
      motion.removeEventListener("change", finish);
    };
  }, [scene.story]);
  useLayoutEffect(() => {
    const node = decisionsRef.current;
    if (!node) return;
    const measure = () =>
      setDecisionHeight(node.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!complete) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timer = setTimeout(
      () => setChoicesReady(true),
      motion.matches ? 0 : 460,
    );
    return () => clearTimeout(timer);
  }, [complete]);
  return (
    <div
      className={`story-sequence ${complete ? "narrative-lifted" : "narrative-typing"}`}
      style={{ "--decisions-height": `${decisionHeight}px` } as CSSProperties}
    >
      <div className="story-narrative">
        <h2 ref={titleRef} tabIndex={-1}>
          {scene.title}
        </h2>
        <p className="scene-story typed-story">
          <span className="sr-only">{scene.story}</span>
          <span className="type-reserve" aria-hidden="true">
            {scene.story}
          </span>
          <span className="type-ink" aria-hidden="true">
            {scene.story.slice(0, visible)}
            {!complete && <span className="type-cursor">▎</span>}
          </span>
        </p>
        <div className="typing-controls">
          {!complete && (
            <button
              className="text-button"
              onClick={() => setVisible(scene.story.length)}
            >
              Show choices <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </div>
      <div
        ref={decisionsRef}
        className={`scene-decisions ${choicesReady ? "decisions-ready" : ""}`}
        inert={!choicesReady}
        aria-hidden={!choicesReady}
      >
        {children}
      </div>
    </div>
  );
}
