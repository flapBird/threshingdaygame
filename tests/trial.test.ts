import test from "node:test";
import assert from "node:assert/strict";
import {
  scenes,
  dragons,
  getResult,
  parseSavedRun,
  scoreAnswers,
  formatDuration,
  remainingTime,
} from "../src/trial";
test("all 6 companions are reachable across all 6561 paths; every path is deterministic", () => {
  const seen = new Set<string>();
  for (let n = 0; n < 3 ** 8; n++) {
    let v = n;
    const answers = Array.from({ length: 8 }, () => {
      const answer = v % 3;
      v = Math.floor(v / 3);
      return answer;
    });
    const result = getResult(answers);
    seen.add(result.dragon.id);
    assert.equal(getResult([...answers]).dragon.id, result.dragon.id);
    assert.equal(
      Object.values(result.scores).reduce((a, b) => a + b, 0),
      32,
    );
  }
  assert.deepEqual([...seen].sort(), dragons.map((d) => d.id).sort());
});
test("incomplete and malformed paths do not produce a result", () => {
  assert.throws(() => getResult([0, 1]));
  assert.throws(() => getResult([0, 0, 0, 0, 0, 0, 0, 9]));
  assert.throws(() => scoreAnswers([-1]));
});
test("saved runs validate rule version, choices and cursor, including completed paths", () => {
  assert.deepEqual(
    parseSavedRun(JSON.stringify({ version: 1, answers: [0, 1], step: 2 })),
    { answers: [0, 1], step: 2 },
  );
  assert.ok(
    parseSavedRun(
      JSON.stringify({ version: 1, answers: Array(8).fill(0), step: 7 }),
    ),
  );
  for (const raw of [
    null,
    "invalid",
    "null",
    JSON.stringify({ version: 2, answers: [], step: 0 }),
    JSON.stringify({ version: 1, answers: [4], step: 0 }),
    JSON.stringify({ version: 1, answers: [], step: 4 }),
  ])
    assert.equal(parseSavedRun(raw), null);
});
test("duration uses explicit hours and never goes below zero", () => {
  assert.equal(formatDuration(4 * 60 * 60 * 1000), "04:00:00");
  assert.equal(formatDuration(61000), "00:01:01");
  assert.equal(formatDuration(0), "00:00:00");
  assert.equal(remainingTime(1000, 2000), 0);
  assert.equal(remainingTime(61000, 1000), 60000);
});
test("each scene offers exactly three valid choices", () => {
  assert.equal(scenes.length, 8);
  for (const scene of scenes) {
    assert.equal(scene.choices.length, 3);
    assert.ok(scene.title.length && scene.story.length);
  }
});
