import assert from "node:assert/strict";
import test from "node:test";
import { restoreTrialSession } from "../src/trial-session";
import { RULE_VERSION } from "../src/trial";
const run = (answers: number[], step: number) =>
  JSON.stringify({ version: RULE_VERSION, answers, step });
test("returning after completion resets the trial and migrates the previous result", () => {
  const answers = [1, 0, 2, 1, 1, 0, 2, 0];
  assert.deepEqual(restoreTrialSession(run(answers, 7), null), {
    resume: null,
    lastAnswers: answers,
  });
});
test("a new unfinished trial resumes while the previous completed bond survives", () => {
  const last = [2, 2, 2, 2, 2, 2, 2, 2];
  const active = run([0, 1], 2);
  const restored = restoreTrialSession(active, run(last, 7));
  assert.deepEqual(restored.resume?.answers, [0, 1]);
  assert.equal(restored.resume?.step, 2);
  assert.deepEqual(restored.lastAnswers, last);
  assert.deepEqual(restoreTrialSession(null, run(last, 7)), {
    resume: null,
    lastAnswers: last,
  });
});
test("malformed and incomplete previous results never become a last bond", () => {
  for (const raw of [
    null,
    "bad",
    run([1], 1),
    run([9, 9, 9, 9, 9, 9, 9, 9], 7),
  ]) {
    assert.deepEqual(restoreTrialSession(null, raw), {
      resume: null,
      lastAnswers: null,
    });
  }
});
