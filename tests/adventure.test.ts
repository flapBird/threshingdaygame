import test from "node:test";
import assert from "node:assert/strict";
import {
  adventureScene,
  adventureConsequence,
  routes,
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
        [
          "crossing",
          "sunken-way",
          "lantern-grove",
          "windward-ridge",
          "aureth",
          "vesper",
          "sylvara",
        ].includes(scene.art),
      );
      assert.deepEqual(
        scene.choices.map(({ trait, secondary }) => ({ trait, secondary })),
        scenes[step].choices.map(({ trait, secondary }) => ({
          trait,
          secondary,
        })),
        `choice meaning must retain v1 answer positions at step ${step}`,
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

test("each encounter returns a specific outcome in both the next scene and journey journal", () => {
  const outcomes = new Set<string>();
  for (let route = 0; route < 3; route++) {
    for (let entrance = 0; entrance < 3; entrance++) {
      const reactions = new Set<string>();
      for (let response = 0; response < 3; response++) {
        const prefix = [route, entrance, response];
        const consequence = adventureConsequence(prefix);
        outcomes.add(consequence);
        assert.equal(adventureScene(prefix).consequence, consequence);
        const trail = journeyTrail([...prefix, 0, 1, 2, 0, 2]);
        assert.equal(trail[2].outcome, consequence);
        reactions.add(adventureScene(prefix).story);
      }
      assert.equal(
        reactions.size,
        3,
        "the dragon scene must recall each encounter action differently",
      );
    }
  }
  assert.equal(
    outcomes.size,
    27,
    "all nine encounters need three concrete consequences",
  );
  assert.match(adventureConsequence([0, 0, 1]), /rope.*keeper/);
  assert.match(adventureConsequence([1, 1, 1]), /fire.*travelers/);
  assert.match(adventureConsequence([2, 0, 1]), /rope.*lookout/);
});

test("route geography and earlier choices survive through the final promise", () => {
  const remembered = new Set<string>();
  for (let route = 0; route < 3; route++) {
    for (let entrance = 0; entrance < 3; entrance++) {
      for (let response = 0; response < 3; response++) {
        const finalScene = adventureScene([
          route,
          entrance,
          response,
          0,
          0,
          0,
          0,
        ]);
        assert.equal(finalScene.routeId, routes[route].id);
        assert.equal(finalScene.stage, "oath");
        assert.ok(finalScene.story.includes(routes[route].name));
        remembered.add(finalScene.story);
      }
    }
    const beforeOffer = adventureScene([route, 0, 0, 0, 0]);
    const helped = adventureScene([route, 0, 0, 0, 1]);
    const independent = adventureScene([route, 0, 0, 0, 2]);
    assert.equal(
      new Set([beforeOffer.story, helped.story, independent.story]).size,
      3,
    );
    assert.notEqual(
      adventureScene([route, 0, 0, 0, 0, 0, 0]).story,
      adventureScene([route, 0, 0, 0, 0, 0, 2]).story,
    );
  }
  assert.equal(
    remembered.size,
    27,
    "the oath must retain the actual early encounter, not a generic route summary",
  );
  assert.match(adventureScene([0, 0, 1, 0, 0, 0, 0]).story, /rope.*keeper/);
  assert.match(
    adventureScene([1, 1, 1, 0, 0, 0, 0]).story,
    /Woodsmoke.*people/,
  );
  assert.match(
    adventureScene([2, 0, 1, 0, 0, 0, 0]).story,
    /lookout's lantern/,
  );
});

test("route backgrounds alternate with encounters while all scene text stays compact", () => {
  assert.equal(adventureScene([]).routeId, null);
  const expectedStages = [
    "crossing",
    "entrance",
    "encounter",
    "meeting",
    "detour",
    "offer",
    "reckoning",
    "oath",
  ];
  for (let route = 0; route < 3; route++) {
    const path = [route, 0, 0, 0, 1, 0, 2, 2];
    const arts = path.map((_, step) => {
      const scene = adventureScene(path.slice(0, step));
      assert.equal(scene.stage, expectedStages[step]);
      return scene.art;
    });
    assert.equal(arts[1], routes[route].art);
    assert.equal(arts[2], routes[route].art);
    assert.ok(new Set(arts).size >= 3);
  }
  // Check every reachable prefix rather than only a hand-picked journey.
  for (let step = 0; step < 8; step++) {
    for (let n = 0; n < 3 ** step; n++) {
      let rest = n;
      const prefix = Array.from({ length: step }, () => {
        const answer = rest % 3;
        rest = Math.floor(rest / 3);
        return answer;
      });
      const words = adventureScene(prefix).story.split(/\s+/).length;
      assert.ok(
        words >= 35 && words <= 55,
        `step ${step}, path ${prefix}: ${words} words`,
      );
    }
  }
});

test("journal outcomes describe the chosen crossing instead of a shared generic response", () => {
  const river = journeyTrail([0, 0, 1, 0, 1, 2, 0, 1]);
  const grove = journeyTrail([1, 0, 1, 0, 1, 2, 0, 1]);
  const ridge = journeyTrail([2, 0, 1, 0, 1, 2, 0, 1]);
  assert.match(river[5].outcome, /ferryman/);
  assert.match(grove[5].outcome, /mapkeeper/);
  assert.match(ridge[5].outcome, /glider/);
  assert.equal(
    river[7].outcome,
    adventureConsequence([0, 0, 1, 0, 1, 2, 0, 1]),
  );
  assert.equal(adventureConsequence([]), "");
  for (const prefix of [[3], [-1], [0, 0.5], Array(9).fill(0)])
    assert.throws(() => adventureConsequence(prefix));
});
