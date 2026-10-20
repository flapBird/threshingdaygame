import { SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import type { SoundRoute } from "./journey-audio";

type SoundControlProps = {
  enabled: boolean;
  unavailable: boolean;
  volume: number;
  toggleSound: () => void;
  setVolume: (volume: number) => void;
  route: SoundRoute;
};

const soundLabels = {
  river: "River & flowing water",
  grove: "Woodland & chimes",
  ridge: "Wind across the ridge",
};

export function SoundControl({
  enabled,
  unavailable,
  volume,
  toggleSound,
  setVolume,
  route,
}: SoundControlProps) {
  return (
    <div className={`journey-sound ${enabled ? "is-enabled" : ""}`}>
      <button
        type="button"
        className="journey-sound-toggle"
        aria-pressed={enabled}
        aria-label={enabled ? "Mute journey sounds" : "Turn on journey sounds"}
        disabled={unavailable}
        onClick={toggleSound}
      >
        {enabled ? <SpeakerHigh size={16} /> : <SpeakerSlash size={16} />}
        <span>
          {unavailable
            ? "Sound unavailable"
            : enabled
              ? "Sound on"
              : "Sound off"}
        </span>
      </button>
      <span className="journey-sound-caption" aria-live="polite">
        {unavailable
          ? "Your journey continues silently."
          : enabled
            ? route
              ? soundLabels[route]
              : "A breeze through the valley"
            : "Optional ambience & choice sounds"}
      </span>
      {enabled && (
        <label className="journey-sound-volume">
          <span>Volume</span>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            aria-label="Journey sound volume"
            aria-valuetext={`${Math.round(volume * 100)} percent`}
            value={Math.round(volume * 100)}
            onChange={(event) => setVolume(Number(event.target.value) / 100)}
          />
        </label>
      )}
    </div>
  );
}
