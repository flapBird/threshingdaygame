import assert from "node:assert/strict";
import test from "node:test";
import { pageMeta, staticPaths } from "../src/content";

test("results stay in the game and the retired result path is not a page", () => {
  assert.ok(staticPaths.includes("/"));
  assert.ok(staticPaths.includes("/play/"));
  assert.ok(!staticPaths.includes("/result/"));
  assert.match(pageMeta("/result/").title, /Page Not Found/);
});

test("search entry pages are indexable routes alongside the existing guide", () => {
  for (const path of [
    "/dragonkind-black-dragon/",
    "/fourth-wing-dragon-quiz/",
    "/guides/black-blue-dragons/",
  ]) {
    assert.ok(staticPaths.includes(path));
    assert.doesNotMatch(pageMeta(path).title, /Page Not Found/);
  }
  assert.equal(
    pageMeta("/").title,
    "Threshing Day Game — Free Dragon Bonding Game & Quiz",
  );
  assert.match(
    pageMeta("/").description,
    /8 choices, no signup, instant replay/,
  );
});

test("My Dragons has a dedicated route and metadata", () => {
  assert.ok(staticPaths.includes("/my-dragons/"));
  assert.match(pageMeta("/my-dragons/").title, /My Dragons/);
});
