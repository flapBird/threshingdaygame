import { useCallback, useEffect, useRef, useState } from "react";
import { readDevice, writeDevice } from "./storage";

export type SoundRoute = "river" | "grove" | "ridge" | null;
export const SOUND_VOLUME_KEY = "threshingday:sound-volume:v1";
const DEFAULT_VOLUME = 0.35;

export function normalizeSoundVolume(value: number): number {
  return Number.isFinite(value)
    ? Math.min(1, Math.max(0, value))
    : DEFAULT_VOLUME;
}

export function readSoundVolume(raw: string | null): number {
  if (raw === null || raw.trim() === "") return DEFAULT_VOLUME;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 && value <= 1
    ? value
    : DEFAULT_VOLUME;
}

type AudioGroup = {
  nodes: AudioNode[];
  sources: AudioScheduledSourceNode[];
  timers: Set<ReturnType<typeof setTimeout>>;
};

// All sounds are synthesized here. No audio file, embed or network request is used.
// One engine belongs to one mounted trial and starts only after a user gesture.
export class JourneyAudioEngine {
  private readonly output: GainNode;
  private readonly noise: AudioBuffer;
  private scene: AudioGroup | null = null;
  private effects = new Set<AudioGroup>();
  private route: SoundRoute = null;
  private active = false;
  private disposed = false;
  private failed = false;
  private lastChoice = -Infinity;
  private lastBond = -Infinity;

  constructor(
    private readonly context: AudioContext,
    volume: number,
    private readonly onFailure: () => void = () => {},
  ) {
    this.output = context.createGain();
    this.output.gain.value = normalizeSoundVolume(volume) * 0.65;
    this.output.connect(context.destination);
    this.noise = context.createBuffer(
      1,
      context.sampleRate * 4,
      context.sampleRate,
    );
    const samples = this.noise.getChannelData(0);
    // A fixed noise bed makes the route sound repeatable without affecting gameplay.
    let seed = 81731;
    for (let index = 0; index < samples.length; index++) {
      seed = (Math.imul(seed, 16807) >>> 0) % 2147483647;
      samples[index] = (seed / 2147483647) * 2 - 1;
    }
  }

  setVolume(volume: number) {
    if (this.disposed) return;
    this.output.gain.setTargetAtTime(
      normalizeSoundVolume(volume) * 0.65,
      this.context.currentTime,
      0.06,
    );
  }

  setScene(route: SoundRoute, active: boolean) {
    if (this.disposed) return;
    const changed = route !== this.route;
    this.route = route;
    if (!active) {
      this.active = false;
      this.clearScene();
      this.clearEffects();
      this.changeContextState("suspend");
      return;
    }
    if (changed || !this.scene) {
      this.clearScene();
      this.scene = this.makeGroup();
      this.makeAmbience(this.scene, route);
    }
    this.active = true;
    // Call resume synchronously in the enabling click, preserving browser activation.
    this.changeContextState("resume");
  }

  playChoice() {
    if (!this.canPlay() || this.context.currentTime - this.lastChoice < 0.12)
      return;
    this.lastChoice = this.context.currentTime;
    const group = this.effect(0.5);
    this.tone(group, 440, 0, 0.22, 0.055, "sine");
    this.tone(group, 660, 0.055, 0.2, 0.025, "sine");
  }

  playBond() {
    if (!this.canPlay() || this.context.currentTime - this.lastBond < 1.5)
      return;
    this.lastBond = this.context.currentTime;
    const group = this.effect(3.4);
    [293.66, 440, 587.33].forEach((frequency, index) => {
      this.tone(group, frequency, index * 0.26, 2.3, 0.065, "sine");
      this.tone(group, frequency * 2, index * 0.26, 1.6, 0.012, "sine");
    });
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.active = false;
    this.clearScene();
    this.clearEffects();
    this.output.disconnect();
    try {
      void this.context.close().catch(() => {});
    } catch {
      // Already-closed contexts and unavailable audio never interrupt the trial.
    }
  }

  private canPlay() {
    return !this.disposed && this.active && this.context.state === "running";
  }

  private changeContextState(method: "resume" | "suspend") {
    const fail = () => {
      if (this.disposed || this.failed) return;
      this.failed = true;
      this.dispose();
      this.onFailure();
    };
    try {
      void this.context[method]().catch(fail);
    } catch {
      fail();
    }
  }

  private makeGroup(): AudioGroup {
    return { nodes: [], sources: [], timers: new Set() };
  }

  private destroyGroup(group: AudioGroup) {
    group.timers.forEach(clearTimeout);
    group.timers.clear();
    group.sources.forEach((source) => {
      try {
        source.stop();
      } catch {
        // A short feedback tone may already have ended naturally.
      }
    });
    group.nodes.forEach((node) => node.disconnect());
    group.nodes.length = 0;
    group.sources.length = 0;
  }

  private clearScene() {
    if (this.scene) this.destroyGroup(this.scene);
    this.scene = null;
  }

  private clearEffects() {
    this.effects.forEach((group) => this.destroyGroup(group));
    this.effects.clear();
  }

  private later(group: AudioGroup, callback: () => void, seconds: number) {
    const timer = setTimeout(() => {
      group.timers.delete(timer);
      if (!this.disposed) callback();
    }, seconds * 1000);
    group.timers.add(timer);
  }

  private effect(seconds: number) {
    const group = this.makeGroup();
    this.effects.add(group);
    this.later(
      group,
      () => {
        this.destroyGroup(group);
        this.effects.delete(group);
      },
      seconds,
    );
    return group;
  }

  private noiseLayer(
    group: AudioGroup,
    type: BiquadFilterType,
    frequency: number,
    level: number,
    gustSeconds: number,
  ) {
    const source = this.context.createBufferSource();
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();
    const gust = this.context.createOscillator();
    const depth = this.context.createGain();
    source.buffer = this.noise;
    source.loop = true;
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = 0.65;
    gain.gain.setValueAtTime(0, this.context.currentTime);
    gain.gain.linearRampToValueAtTime(level, this.context.currentTime + 0.9);
    gust.frequency.value = 1 / gustSeconds;
    depth.gain.value = level * 0.34;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.output);
    gust.connect(depth);
    depth.connect(gain.gain);
    source.start();
    gust.start();
    group.nodes.push(source, filter, gain, gust, depth);
    group.sources.push(source, gust);
  }

  private makeAmbience(group: AudioGroup, route: SoundRoute) {
    if (route === "river") {
      this.noiseLayer(group, "lowpass", 750, 0.19, 7);
      this.noiseLayer(group, "bandpass", 2400, 0.038, 4.7);
    } else if (route === "grove") {
      this.noiseLayer(group, "lowpass", 430, 0.1, 9);
      let chime = 0;
      const ring = () => {
        if (!this.active || this.scene !== group) return;
        const frequencies = [880, 1174.66, 987.77, 1318.51];
        this.tone(
          this.effect(2.9),
          frequencies[chime++ % 4],
          0,
          2.6,
          0.035,
          "sine",
        );
        this.later(group, ring, 5.8);
      };
      this.later(group, ring, 1.8);
    } else if (route === "ridge") {
      this.noiseLayer(group, "lowpass", 950, 0.22, 8.4);
      this.noiseLayer(group, "bandpass", 510, 0.055, 12);
    } else {
      this.noiseLayer(group, "lowpass", 580, 0.11, 10);
    }
  }

  private tone(
    group: AudioGroup,
    frequency: number,
    delay: number,
    duration: number,
    level: number,
    type: OscillatorType,
  ) {
    const oscillator = this.context.createOscillator();
    const envelope = this.context.createGain();
    const start = this.context.currentTime + delay;
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    envelope.gain.setValueAtTime(0, start);
    envelope.gain.linearRampToValueAtTime(level, start + 0.035);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(envelope);
    envelope.connect(this.output);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.05);
    group.nodes.push(oscillator, envelope);
    group.sources.push(oscillator);
  }
}

export function useJourneyAudio(route: SoundRoute, active: boolean) {
  const [enabled, setEnabled] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [volume, updateVolume] = useState(DEFAULT_VOLUME);
  const engine = useRef<JourneyAudioEngine | null>(null);
  const enabledRef = useRef(false);
  const scene = useRef({ route, active });
  scene.current = { route, active };

  const synchronize = useCallback(() => {
    engine.current?.setScene(
      scene.current.route,
      enabledRef.current && scene.current.active && !document.hidden,
    );
  }, []);

  useEffect(() => {
    updateVolume(readSoundVolume(readDevice(SOUND_VOLUME_KEY)));
    document.addEventListener("visibilitychange", synchronize);
    return () => {
      document.removeEventListener("visibilitychange", synchronize);
      engine.current?.dispose();
      engine.current = null;
      enabledRef.current = false;
    };
  }, [synchronize]);

  useEffect(synchronize, [route, active, synchronize]);

  const toggleSound = useCallback(() => {
    if (unavailable) return;
    const next = !enabledRef.current;
    if (next && !engine.current) {
      let context: AudioContext | undefined;
      try {
        const AudioContextClass =
          window.AudioContext ||
          (
            window as typeof window & {
              webkitAudioContext?: typeof AudioContext;
            }
          ).webkitAudioContext;
        if (!AudioContextClass) throw new Error("Web Audio is unavailable");
        context = new AudioContextClass();
        engine.current = new JourneyAudioEngine(context, volume, () => {
          enabledRef.current = false;
          engine.current = null;
          setEnabled(false);
          setUnavailable(true);
        });
      } catch {
        try {
          void context?.close().catch(() => {});
        } catch {
          // Safe fallback when a browser does not provide a usable audio context.
        }
        setUnavailable(true);
        return;
      }
    }
    enabledRef.current = next;
    setEnabled(next);
    synchronize();
  }, [unavailable, volume, synchronize]);

  const setVolume = useCallback((value: number) => {
    const normalized = normalizeSoundVolume(value);
    updateVolume(normalized);
    writeDevice(SOUND_VOLUME_KEY, String(normalized));
    engine.current?.setVolume(normalized);
  }, []);

  const playChoice = useCallback(() => engine.current?.playChoice(), []);
  const playBond = useCallback(() => engine.current?.playBond(), []);

  return {
    enabled,
    unavailable,
    volume,
    toggleSound,
    setVolume,
    playChoice,
    playBond,
  };
}
