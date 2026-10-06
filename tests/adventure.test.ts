import test from "node:test";
import assert from "node:assert/strict";
import {
  adventureScene,
  journeyTrail,
  journalProgress,
  nextDiscovery,
  parseJournal,
} from "../src/adventure";
import { scenes, scoreAnswers, getResult } from "../src/trial";

test("all 6561 branching journeys complete with unchanged scoring and valid artwork", () => {
  const encountered = new Set<string>();
  for (let n = 0; n < 6561; n++) {
    let rest = n;
    const answers = Array.from({ length: 8 }, () => {
      const a = rest % 3;
      rest = Math.floor(rest / 3);
      return a;
    });
    const score = Object.fromEntries(
      Object.keys(scoreAnswers([])).map((k) => [k, 0]),
    );
    for (let step = 0; step < 8; step++) {
      const scene = adventureScene(answers.slice(0, step));
      assert.equal(scene.choices.length, 3);
      assert.ok(scene.title && scene.story);
      assert.ok(
        ["crossing", "brannoc", "aureth", "vesper", "sylvara"].includes(
          scene.art,
        ),
      );
      const choice = scene.choices[answers[step]];
      score[choice.trait] += 3;
      score[choice.secondary] += 1;
      if (step === 2) encountered.add(scene.id);
    }
    assert.deepEqual(score, scoreAnswers(answers));
    assert.equal(journeyTrail(answers).length, 8);
    assert.ok(getResult(answers).dragon);
  }
  assert.equal(encountered.size, 9);
});
test("route, encounter, dragon response and earlier help have visible consequences", () => {
  assert.notEqual(adventureScene([0]).title, adventureScene([2]).title);
  assert.notEqual(adventureScene([0, 0]).title, adventureScene([0, 1]).title);
  assert.notEqual(
    adventureScene([0, 0, 0]).story,
    adventureScene([0, 0, 1]).story,
  );
  assert.notEqual(
    adventureScene([0, 0, 0, 0]).title,
    adventureScene([0, 0, 0, 1]).title,
  );
  assert.notEqual(
    adventureScene([0, 0, 0, 0, 0, 0]).story,
    adventureScene([0, 0, 0, 0, 0, 2]).story,
  );
  assert.deepEqual(adventureScene([]).choices, scenes[0].choices);
});
test("backtracking uses only the current prefix; invalid paths never enter the story", () => {
  const previous = [0, 1, 2, 1];
  const revised = [...previous.slice(0, 1), 2];
  assert.deepEqual(adventureScene(revised), adventureScene([0, 2]));
  assert.notEqual(
    adventureScene(previous.slice(0, 2)).id,
    adventureScene(revised).id,
  );
  for (const path of [[-1], [3], [0, 0.5], Array(8).fill(0)])
    assert.throws(() => adventureScene(path));
  assert.throws(() => journeyTrail([0, 1]));
});
test("journal ignores corrupt data and duplicate reloads; goals reflect real completed journeys", () => {
  assert.deepEqual(parseJournal("null"), []);
  assert.deepEqual(parseJournal("invalid"), []);
  assert.deepEqual(parseJournal('["00000000","00000000","33333333",7,"001"]'), [
    "00000000",
  ]);
  const progress = journalProgress(["00000000", "10000000", "20000000"]);
  assert.equal(progress.routes.length, 3);
  assert.equal(progress.encounters.length, 3);
  assert.match(nextDiscovery([]).title, /Sunken Way/);
  assert.match(nextDiscovery(["00000000"]).title, /Lantern Grove/);
  assert.match(
    nextDiscovery(["00000000", "10000000", "20000000"]).title,
    /hidden encounter/,
  );
});
