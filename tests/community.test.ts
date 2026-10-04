import test from "node:test";
import assert from "node:assert/strict";
import { bondStrength, validRiderName } from "../src/community";
import { scenes, dragons } from "../src/trial";
test("all 6561 routes have bounded strength and each companion can reach 100%", () => {
  const maximum = new Map<string, number>();
  for (let n = 0; n < 3 ** scenes.length; n++) {
    let code = n;
    const answers = scenes.map(() => {
      const value = code % 3;
      code = Math.floor(code / 3);
      return value;
    });
    const result = bondStrength(answers);
    assert.ok(result.strength >= 0 && result.strength <= 100);
    maximum.set(
      result.dragonId,
      Math.max(maximum.get(result.dragonId) || 0, result.strength),
    );
  }
  for (const dragon of dragons) assert.equal(maximum.get(dragon.id), 100);
});
test("public rider names allow Unicode but reject markup, control characters and oversized names", () => {
  for (const name of [
    "Aurelia",
    "小龙骑士",
    "O’Neil".replace("’", "'"),
    "Rider-42",
  ])
    assert.ok(validRiderName(name));
  for (const name of [
    "",
    "a",
    " padded ",
    "a".repeat(25),
    "<script>",
    "Rider\nName",
    null,
    42,
  ])
    assert.equal(validRiderName(name), false);
});
