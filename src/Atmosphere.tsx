import { useEffect, useState } from "react";
import { Pause, Play } from "@phosphor-icons/react";
import { readDevice, writeDevice } from "./storage";

export function Atmosphere() {
  const [paused, setPaused] = useState(true);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReduced(motion.matches);
      setPaused(
        motion.matches || readDevice("threshingday:atmosphere") === "paused",
      );
    };
    sync();
    motion.addEventListener("change", sync);
    return () => motion.removeEventListener("change", sync);
  }, []);
  return (
    <>
      <div
        className={`world-atmosphere ${paused ? "is-paused" : ""}`}
        aria-hidden="true"
      >
        <img src="/images/crossing.webp" alt="" width="1536" height="1024" />
        <div className="world-light" />
      </div>
      {!reduced && (
        <button
          className="atmosphere-control"
          aria-label={
            paused ? "Resume background motion" : "Pause background motion"
          }
          title={
            paused ? "Resume background motion" : "Pause background motion"
          }
          onClick={() => {
            writeDevice(
              "threshingday:atmosphere",
              paused ? "playing" : "paused",
            );
            setPaused(!paused);
          }}
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
          <span>Atmosphere</span>
        </button>
      )}
    </>
  );
}
