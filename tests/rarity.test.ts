import assert from "node:assert/strict";
import test from "node:test";
import { getResult } from "../src/trial";
import {
  getBondRarity,
  parseSharedBond,
  bondSharePath,
  rarityTiers,
} from "../src/rarity";

test("rarity counts every path, preserves matching, and reaches all five tiers", () => {
  const counts = new Map<string, number>();
  const tiers = new Set<string>();
  for (let n = 0; n < 6561; n++) {
    let rest = n;
    const answers = Array.from({ length: 8 }, () => {
      const a = rest % 3;
      rest = Math.floor(rest / 3);
      return a;
    });
    const result = getResult(answers);
    const key = result.ranking.slice(0, 2).join(":");
    counts.set(key, (counts.get(key) ?? 0) + 1);
    const rarity = getBondRarity(result.ranking)!;
    assert.ok(rarity);
    tiers.add(rarity.tier);
    const url = new URL(
      bondSharePath(result.dragon.id, result.ranking),
      "https://example.com",
    );
    const shared = parseSharedBond(url.searchParams)!;
    assert.equal(shared.dragon.id, result.dragon.id);
    assert.deepEqual(shared.ranking, result.ranking.slice(0, 2));
    assert.deepEqual(getBondRarity(shared.ranking), rarity);
  }
  assert.deepEqual([...tiers].sort(), rarityTiers.map((t) => t.name).sort());
  assert.equal(
    [...counts.values()].reduce((a, b) => a + b, 0),
    6561,
  );
  for (const [key, count] of counts) {
    const rarity = getBondRarity(key.split(":"))!;
    assert.equal(rarity.paths, count);
    assert.equal(rarity.total, 6561);
    assert.equal(rarity.percent, ((count / 6561) * 100).toFixed(2));
    assert.equal(
      rarity.tier,
      rarityTiers.find((t) => (count / 6561) * 100 <= t.maxPercent)!.name,
    );
  }
  assert.equal(getBondRarity(["resolve", "courage"])?.tier, "Legendary");
  assert.equal(getBondRarity(["loyalty", "courage"])?.tier, "Common");
});

test("old links remain usable; malformed or unversioned rarity is never invented", () => {
  assert.equal(
    parseSharedBond(new URLSearchParams("dragon=vesper&v=1"))?.ranking.length,
    1,
  );
  for (const query of [
    "dragon=unknown&v=1",
    "dragon=vesper&v=2",
    "dragon=vesper",
  ]) {
    assert.equal(parseSharedBond(new URLSearchParams(query)), null);
  }
  for (const suffix of [
    "trait=resolve&rv=1",
    "trait=nonsense&rv=1",
    "trait=courage&rv=2",
    "trait=courage",
  ]) {
    const shared = parseSharedBond(
      new URLSearchParams(`dragon=vesper&v=1&${suffix}`),
    )!;
    assert.equal(shared.ranking.length, 1);
    assert.equal(getBondRarity(shared.ranking), null);
  }
  assert.equal(getBondRarity(["resolve", "resolve"]), null);
});
