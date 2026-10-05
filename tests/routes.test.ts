import assert from "node:assert/strict";
import test from "node:test";
import { pageMeta, staticPaths } from "../src/content";

test("results stay in the game and the retired result path is not a page", () => {
  assert.ok(staticPaths.includes("/"));
  assert.ok(staticPaths.includes("/play/"));
  assert.ok(!staticPaths.includes("/result/"));
  assert.match(pageMeta("/result/").title, /Page Not Found/);
});
