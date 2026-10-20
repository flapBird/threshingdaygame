import test from "node:test";
import assert from "node:assert/strict";
import {
  JourneyAudioEngine,
  normalizeSoundVolume,
  readSoundVolume,
} from "../src/journey-audio";

class FakeParam {
  value = 0;
  setValueAtTime(value: number) {
    this.value = value;
  }
  linearRampToValueAtTime(value: number) {
    this.value = value;
  }
  exponentialRampToValueAtTime(value: number) {
    this.value = value;
  }
  setTargetAtTime(value: number) {
    this.value = value;
  }
}

class FakeNode {
  gain = new FakeParam();
  frequency = new FakeParam();
  Q = new FakeParam();
  type = "sine";
  buffer: unknown = null;
  loop = false;
  started = false;
  stopped = false;
  disconnected = false;
  connect() {}
  disconnect() {
    this.disconnected = true;
  }
  start() {
    this.started = true;
  }
  stop() {
    this.stopped = true;
  }
}

class FakeContext {
  state = "suspended";
  currentTime = 0;
  sampleRate = 2000;
  destination = new FakeNode();
  nodes: FakeNode[] = [];
  closeCount = 0;
  resumeCount = 0;
  rejectResume = false;
  private node() {
    const node = new FakeNode();
    this.nodes.push(node);
    return node;
  }
  createGain() {
    return this.node();
  }
  createOscillator() {
    return this.node();
  }
  createBufferSource() {
    return this.node();
  }
  createBiquadFilter() {
    return this.node();
  }
  createBuffer(_channels: number, length: number) {
    return { getChannelData: () => new Float32Array(length) };
  }
  resume() {
    this.resumeCount++;
    if (this.rejectResume) return Promise.reject(new Error("Audio denied"));
    this.state = "running";
    return Promise.resolve();
  }
  suspend() {
    this.state = "suspended";
    return Promise.resolve();
  }
  close() {
    this.closeCount++;
    this.state = "closed";
    return Promise.resolve();
  }
}

function makeEngine(context = new FakeContext(), onFailure = () => {}) {
  return {
    context,
    audio: new JourneyAudioEngine(
      context as unknown as AudioContext,
      0.35,
      onFailure,
    ),
  };
}

test("stored volume handles corrupt values and live changes stay in range", () => {
  for (const raw of [null, "", " ", "bad", "NaN", "Infinity", "-0.1", "2"])
    assert.equal(readSoundVolume(raw), 0.35);
  assert.equal(readSoundVolume("0"), 0);
  assert.equal(readSoundVolume("0.8"), 0.8);
  assert.equal(normalizeSoundVolume(-1), 0);
  assert.equal(normalizeSoundVolume(5), 1);
  assert.equal(normalizeSoundVolume(NaN), 0.35);
});

test("audio is silent until explicitly activated and replacing routes releases old sources", () => {
  const { audio, context } = makeEngine();
  try {
    assert.equal(context.resumeCount, 0);
    assert.equal(context.nodes.filter((node) => node.started).length, 0);
    audio.playChoice();
    audio.playBond();
    assert.equal(
      context.nodes.length,
      1,
      "silent feedback cannot create sources",
    );

    audio.setScene("river", true);
    const riverSources = context.nodes.filter((node) => node.started);
    assert.equal(riverSources.length, 4);
    const riverNodeCount = context.nodes.length;
    audio.setScene("river", true);
    assert.equal(
      context.nodes.length,
      riverNodeCount,
      "same scene does not duplicate ambience",
    );

    audio.setScene("grove", true);
    assert.ok(riverSources.every((node) => node.stopped && node.disconnected));
    audio.setScene("ridge", true);
    audio.setScene(null, true);
  } finally {
    audio.dispose();
  }
  assert.ok(context.nodes.every((node) => node.disconnected));
  assert.ok(
    context.nodes.filter((node) => node.started).every((node) => node.stopped),
  );
  assert.equal(context.closeCount, 1);
  audio.dispose();
  assert.equal(context.closeCount, 1, "cleanup remains safe when called twice");
});

test("pausing for visibility or mute stops ambience and feedback, then resumes one scene", () => {
  const { audio, context } = makeEngine();
  try {
    audio.setScene("grove", true);
    audio.playBond();
    audio.setScene("grove", false);
    assert.equal(context.state, "suspended");
    assert.ok(
      context.nodes
        .filter((node) => node.started)
        .every((node) => node.stopped),
    );
    const pausedNodeCount = context.nodes.length;
    audio.playChoice();
    audio.playBond();
    assert.equal(context.nodes.length, pausedNodeCount);
    audio.setScene("grove", true);
    assert.equal(context.state, "running");
    assert.equal(
      context.nodes.filter((node) => node.started && !node.stopped).length,
      2,
    );
    audio.setVolume(0);
    assert.equal(context.nodes[0].gain.value, 0);
  } finally {
    audio.dispose();
  }
});

test("duplicate feedback calls do not stack and blocked audio falls back once", async () => {
  const { audio, context } = makeEngine();
  audio.setScene("river", true);
  audio.playChoice();
  const choiceCount = context.nodes.length;
  audio.playChoice();
  assert.equal(context.nodes.length, choiceCount);
  audio.playBond();
  const bondCount = context.nodes.length;
  audio.playBond();
  assert.equal(context.nodes.length, bondCount);
  audio.dispose();

  let failureCount = 0;
  const deniedContext = new FakeContext();
  deniedContext.rejectResume = true;
  const denied = makeEngine(deniedContext, () => failureCount++);
  denied.audio.setScene("river", true);
  denied.audio.setScene("river", true);
  await Promise.resolve();
  assert.equal(failureCount, 1);
  assert.equal(deniedContext.closeCount, 1);
  assert.ok(deniedContext.nodes.every((node) => node.disconnected));
});
