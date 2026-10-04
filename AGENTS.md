# Prototype Instructions

## Product decision · 2026-10-04

The user selected design/concepts/03-first-choice.png and authorized first-version development. Preserve the deep petrol, antique gold, cinematic bridge illustration, left editorial introduction and right first-choice experience. The first question must have no preselected answer. Build the original eight-choice trial, downloadable fan result card, guides, dragon atlas and device-local retry reminder. Keep official Dragonkind links clearly separate. The site language is English. Do not deploy or bind the domain until requested.

Brand preference · 2026-10-04: use “Threshing Day Game” as the complete visible brand (corrected October 5). Do not display “.xyz” in the header, footer, result card or downloadable card. Keep threshingdaygame.xyz for URLs and SEO configuration. This user decision overrides the domain suffix shown in the selected mock.

Typography refinement from user feedback · 2026-10-04: the user finds the initial typography and spacing less comfortable than competitor sites. Keep the selected visual direction, but prioritize a clear primary title, smaller task headings, readable body text and compact spacing. These refinements override the original mock’s oversized typography and fixed main-section height. Bordered answer rows are the implementation choice for easier scanning.

Interaction and hosting preference · 2026-10-04: clicking an answer advances immediately, with a brief selected state and protection against double clicks. Remove decorative trial eyebrow/chapter text, the Continue step, routine progress/fan notes, and the official-help heading/description. Keep Back, progress, help links and the footer disclosure. The final hosting target is Cloudflare; maintain a separate Wrangler static-assets config with prerendered routes and true HTTP 404 responses. No deployment or DNS change is authorized in this refinement.

User convention: after changes and appropriate verification, create a new local commit containing only this request's edits, with a Chinese commit title. Do not commit pre-existing untracked design/ artifacts, amend or push automatically.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

Product refinement · 2026-10-05: full visible keyword “Threshing Day Game” in header, H1, footer and result cards. The user supplied threshingdaygame.com hero and podium screenshots as the new layout reference: centered editorial introduction on the left, compact illustrated interactive game on the right, podium immediately below. Preserve our original assets and petrol/gold identity. Include substantial What / How explanations, daily and all-time real-data rankings, and a public dragon wall. Never invent traffic, riders or scores. Public publishing is optional; compute result/strength on the server and count only each dragon’s best strength. Cloudflare Worker + D1 is the intended community backend. No remote deployment or DNS changes until requested.

FAQ and launch refinement · 2026-10-05: use the same dark petrol / antique gold theme for How to play; the ivory section was explicitly rejected. Use the exact FAQ heading “Threshing Day game FAQ”. Prioritize black/blue dragons, survival answers, specific green/red encounters, randomness, retry waits, signets and result details, with useful links to existing features. Distinguish official confirmations, sourced player reports and this original fan story; do not claim guaranteed official answer routes. Hide the homepage Today’s top riders until the user requests it back (`SHOW_HOME_PODIUM` is false); keep the leaderboard route. The wall must show all six original companions even before the first public bond, with actual published counts and explicit loading/error states rather than seeded data.
