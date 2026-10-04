import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";

test("Cloudflare D1 publication, idempotency, daily ranking, input limits and privacy removal", async () => {
  const mf = new Miniflare(
    convertV4MiniflareOptions({
      modules: true,
      scriptPath: "dist/cf-test/worker.js",
      compatibilityDate: "2026-10-04",
      d1Databases: ["DB"],
      serviceBindings: { ASSETS: () => new Response("static asset") },
    }),
  );
  try {
    const db = await mf.getD1Database("DB");
    const migration = await readFile(
      "cloudflare/migrations/0001_community.sql",
      "utf8",
    );
    for (const statement of migration.split(";").filter((s) => s.trim()))
      await db.prepare(statement).run();
    const base = "https://threshing.example";
    const call = (path, init = {}) => mf.dispatchFetch(base + path, init);
    const post = (data, cookie = "", origin = base) =>
      call("/api/bonds", {
        method: "POST",
        headers: {
          Origin: origin,
          "Content-Type": "application/json",
          Cookie: cookie,
        },
        body: JSON.stringify(data),
      });
    assert.equal((await call("/")).status, 200);
    assert.deepEqual((await (await call("/api/community")).json()).leaders, []);
    assert.equal((await call("/api/community?period=bad")).status, 400);
    const data = {
      name: "QA Rider",
      runId: crypto.randomUUID(),
      answers: [0, 0, 0, 0, 0, 0, 0, 0],
      strength: 999999,
      dragonId: "vesper",
    };
    assert.equal((await post({ ...data, answers: [0] })).status, 400);
    assert.equal((await post({ ...data, name: "<script>" })).status, 400);
    assert.equal(
      (await post(data, "", "https://elsewhere.example")).status,
      403,
    );
    const first = await post(data);
    assert.equal(first.status, 201);
    const bond = await first.json();
    assert.ok(bond.strength <= 100);
    assert.equal(bond.dragonId, "pyrren");
    const cookie = first.headers.get("set-cookie").split(";")[0];
    assert.match(first.headers.get("set-cookie"), /HttpOnly; SameSite=Lax/);
    assert.equal((await post(data, cookie)).status, 200);
    const retry = await (
      await post({ ...data, answers: [2, 2, 2, 2, 2, 2, 2, 2] }, cookie)
    ).json();
    assert.equal(retry.dragonId, bond.dragonId);
    assert.equal(retry.strength, bond.strength);
    assert.equal((await post(data)).status, 409);
    assert.equal(
      (await post({ ...data, runId: crypto.randomUUID() }, cookie)).status,
      429,
    );
    let community = await (await call("/api/community")).json();
    assert.equal(community.bonds, 1);
    assert.equal(community.riders, 1);
    assert.equal(community.leaders[0].points, bond.strength);
    const {
      results: [row],
    } = await db.prepare("SELECT rider_id FROM bonds").all();
    const now = Date.now(),
      today = Math.floor(now / 86400000) * 86400000;
    await db
      .prepare("INSERT INTO bonds VALUES (?,?,?,?,?)")
      .bind(
        crypto.randomUUID(),
        row.rider_id,
        "pyrren",
        100,
        Math.max(today, now - 20000),
      )
      .run();
    await db
      .prepare("INSERT INTO bonds VALUES (?,?,?,?,?)")
      .bind(
        crypto.randomUUID(),
        row.rider_id,
        "aureth",
        90,
        Math.max(today, now - 20000),
      )
      .run();
    await db
      .prepare("INSERT INTO bonds VALUES (?,?,?,?,?)")
      .bind(crypto.randomUUID(), row.rider_id, "vesper", 100, today - 1)
      .run();
    community = await (await call("/api/community")).json();
    assert.equal(community.leaders[0].points, 190);
    assert.equal(community.leaders[0].discovered, 2);
    const all = await (await call("/api/community?period=all")).json();
    assert.equal(all.leaders[0].points, 290);
    assert.equal(all.leaders[0].discovered, 3);
    assert.equal(all.recent.length, 4);
    assert.equal(
      (
        await call("/api/bonds", {
          method: "DELETE",
          headers: { Origin: "https://elsewhere.example", Cookie: cookie },
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await call("/api/bonds", {
          method: "DELETE",
          headers: { Origin: base, Cookie: cookie },
        })
      ).status,
      200,
    );
    community = await (await call("/api/community")).json();
    assert.equal(community.bonds, 0);
    assert.equal(community.riders, 0);
    assert.deepEqual(community.leaders, []);
  } finally {
    await mf.dispose();
  }
});
