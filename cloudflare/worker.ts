import { bondStrength, validRiderName } from "../src/community";
import { validAnswers, scenes } from "../src/trial";

type Statement = {
  bind(...values: unknown[]): Statement;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<{ results: T[] }>;
  run(): Promise<{ meta: { changes: number } }>;
};
type Env = {
  DB: {
    prepare(sql: string): Statement;
    batch(statements: Statement[]): Promise<{ meta: { changes: number } }[]>;
  };
  ASSETS: { fetch(request: Request): Promise<Response> };
};
const uuid =
  /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const json = (
  body: unknown,
  status = 200,
  headers: Record<string, string> = {},
) =>
  Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
async function identity(request: Request) {
  const existing = request.headers
    .get("Cookie")
    ?.match(/(?:^|;\s*)td_rider=([a-f0-9-]+)/)?.[1];
  const token =
    existing && uuid.test(existing) ? existing : crypto.randomUUID();
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token),
  );
  return {
    id: Array.from(new Uint8Array(hash), (b) =>
      b.toString(16).padStart(2, "0"),
    ).join(""),
    token,
  };
}
export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);
    if (!env.DB)
      return json(
        {
          error:
            "Community publishing is not available yet. Your trial still works.",
        },
        503,
      );
    const now = Date.now(),
      today = Math.floor(now / 86400000) * 86400000;
    try {
      if (url.pathname === "/api/community" && request.method === "GET") {
        const period = url.searchParams.get("period") || "today";
        if (!["today", "all"].includes(period))
          return json({ error: "Unknown ranking period." }, 400);
        const since = period === "today" ? today : 0;
        const [stats, leaders, recent, colors] = await Promise.all([
          env.DB.prepare(
            "SELECT COUNT(*) AS bonds, COUNT(DISTINCT rider_id) AS riders FROM bonds",
          ).first<{ bonds: number; riders: number }>(),
          env.DB.prepare(
            `WITH best AS (SELECT rider_id, dragon_id, MAX(strength) AS strength, MIN(created_at) AS first_at FROM bonds WHERE created_at >= ? GROUP BY rider_id, dragon_id), ranked AS (SELECT rider_id, SUM(strength) AS points, COUNT(*) AS discovered, MAX(first_at) AS reached FROM best GROUP BY rider_id) SELECT riders.name, ranked.points, ranked.discovered, (SELECT dragon_id FROM bonds b WHERE b.rider_id=ranked.rider_id AND b.created_at >= ? ORDER BY b.strength DESC, b.created_at ASC, b.id ASC LIMIT 1) AS dragonId FROM ranked JOIN riders ON riders.id=ranked.rider_id ORDER BY points DESC, discovered DESC, reached ASC, ranked.rider_id ASC LIMIT 50`,
          )
            .bind(since, since)
            .all(),
          env.DB.prepare(
            "SELECT bonds.id, riders.name, dragon_id AS dragonId, strength, created_at AS createdAt FROM bonds JOIN riders ON riders.id=bonds.rider_id ORDER BY created_at DESC, bonds.id DESC LIMIT 24",
          ).all(),
          env.DB.prepare(
            "SELECT dragon_id AS dragonId, COUNT(*) AS count FROM bonds GROUP BY dragon_id",
          ).all(),
        ]);
        return json({
          ...stats,
          leaders: leaders.results,
          recent: recent.results,
          colors: colors.results,
          resetsAt: today + 86400000,
        });
      }
      if (
        url.pathname !== "/api/bonds" ||
        !["POST", "DELETE"].includes(request.method)
      )
        return json({ error: "API route not found." }, 404);
      if (request.headers.get("Origin") !== url.origin)
        return json({ error: "Please publish from this website." }, 403);
      const rider = await identity(request);
      if (request.method === "DELETE") {
        const removed = await env.DB.batch([
          env.DB.prepare("DELETE FROM bonds WHERE rider_id = ?").bind(rider.id),
          env.DB.prepare("DELETE FROM riders WHERE id = ?").bind(rider.id),
        ]);
        return json({ removed: true, count: removed[0].meta.changes });
      }
      if (!request.headers.get("Content-Type")?.startsWith("application/json"))
        return json({ error: "JSON required." }, 415);
      const raw = await request.text();
      if (raw.length > 4096)
        return json({ error: "Submission too large." }, 413);
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        return json({ error: "Invalid submission." }, 400);
      }
      if (
        !data ||
        !validAnswers(data.answers) ||
        data.answers.length !== scenes.length ||
        !validRiderName(data.name) ||
        typeof data.runId !== "string" ||
        !uuid.test(data.runId)
      )
        return json(
          {
            error:
              "Complete all eight choices and use a rider name of 2–24 letters or numbers.",
          },
          400,
        );
      const existing = await env.DB.prepare(
        "SELECT rider_id, dragon_id AS dragonId, strength FROM bonds WHERE id = ?",
      )
        .bind(data.runId)
        .first<{ rider_id: string; dragonId: string; strength: number }>();
      if (existing)
        return existing.rider_id === rider.id
          ? json({
              published: true,
              dragonId: existing.dragonId,
              strength: existing.strength,
            })
          : json({ error: "This story has already been published." }, 409);
      // The client never supplies a score or dragon: recompute both from its complete answer path.
      const result = bondStrength(data.answers);
      const changes = await env.DB.batch([
        env.DB.prepare(
          "INSERT INTO riders(id,name) VALUES(?,?) ON CONFLICT(id) DO NOTHING",
        ).bind(rider.id, data.name),
        env.DB.prepare(
          `INSERT OR IGNORE INTO bonds(id,rider_id,dragon_id,strength,created_at) SELECT ?,?,?,?,? WHERE (SELECT COUNT(*) FROM bonds WHERE rider_id=? AND created_at>=?) < 20 AND NOT EXISTS(SELECT 1 FROM bonds WHERE rider_id=? AND created_at>?)`,
        ).bind(
          data.runId,
          rider.id,
          result.dragonId,
          result.strength,
          now,
          rider.id,
          today,
          rider.id,
          now - 10000,
        ),
        env.DB.prepare(
          "UPDATE riders SET name=? WHERE id=? AND EXISTS(SELECT 1 FROM bonds WHERE id=? AND rider_id=? AND created_at=?)",
        ).bind(data.name, rider.id, data.runId, rider.id, now),
      ]);
      if (!changes[1].meta.changes)
        return json(
          {
            error:
              "Please wait 10 seconds between bonds. Up to 20 can be published each UTC day.",
          },
          429,
        );
      return json({ published: true, ...result }, 201, {
        "Set-Cookie": `td_rider=${rider.token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=31536000${url.protocol === "https:" ? "; Secure" : ""}`,
      });
    } catch {
      return json(
        {
          error:
            "The community is unavailable. Your story is safe; try publishing again shortly.",
        },
        503,
      );
    }
  },
};
