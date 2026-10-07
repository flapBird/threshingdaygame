import assert from "node:assert/strict";
import test from "node:test";
import { dragonCollection, bondVariants } from "../src/collection";
import { getResult } from "../src/trial";
import { parseSharedBond, bondSharePath } from "../src/rarity";

test("all 30 bond combinations are reachable and aggregate actual unique completed journeys", () => {
  const paths = Array.from({ length: 6561 }, (_, n) =>
    n.toString(3).padStart(8, "0"),
  );
  const collection = dragonCollection(JSON.stringify(paths));
  assert.equal(bondVariants.length, 30);
  assert.equal(new Set(bondVariants.map((b) => b.id)).size, 30);
  assert.equal(collection.collected.length, 30);
  assert.equal(collection.progress.journeys, 6561);
  assert.equal(collection.progress.companions.length, 6);
  assert.equal(collection.progress.routes.length, 3);
  assert.equal(
    collection.collected.reduce((sum, b) => sum + b.journeys, 0),
    6561,
  );
  for (const bond of collection.collected) {
    assert.equal(bond.journeys, bond.rarity.paths);
    const shared = parseSharedBond(
      new URL(
        bondSharePath(bond.dragon.id, bond.ranking),
        "https://example.com",
      ).searchParams,
    )!;
    assert.equal(shared.dragon.id, bond.dragon.id);
    assert.deepEqual(shared.ranking, bond.ranking);
  }
});
test("reloads do not duplicate bonds, older journal paths migrate without inventing dates or discoveries", () => {
  const raw = JSON.stringify(["00000000", "00000000", "10000000"]);
  const collection = dragonCollection(raw);
  assert.equal(collection.progress.journeys, 2);
  assert.equal(
    collection.collected.reduce((sum, b) => sum + b.journeys, 0),
    2,
  );
  assert.equal(
    collection.collected[0].dragon.id,
    getResult([..."10000000"].map(Number)).dragon.id,
  );
  assert.deepEqual(dragonCollection(raw), collection);
});
test("shared links, bookmarks, corrupt and incomplete data do not earn discoveries", () => {
  for (const raw of [
    null,
    "bad",
    "null",
    JSON.stringify([
      "vesper",
      "012",
      "99999999",
      {},
      "?dragon=vesper&trait=courage&rv=1&v=1",
    ]),
  ]) {
    const collection = dragonCollection(raw);
    assert.equal(collection.collected.length, 0);
    assert.equal(collection.progress.journeys, 0);
    assert.equal(collection.rarest, null);
  }
});
