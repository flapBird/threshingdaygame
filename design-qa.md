# Design QA · 2026-10-05

**final result: passed**

## Source and implementation

- Source visual truth: `qa/community/reference-hero.png` (user screenshot, 2690 × 1254) and `qa/community/reference-podium.png` (2712 × 642).
- Reference: [threshingdaygame.com](https://threshingdaygame.com/). Homepage HTML was reviewed; competitor playthrough, traffic and ranking integrity were not verified.
- Implementation: [Cloudflare local preview](http://127.0.0.1:4175/).
- Desktop: 1280 × 720 CSS viewport. `qa/community/home-desktop-final.png` is the first 720px of the desktop full-page capture; full-page capture `home-full-final.png` (1280 × 3068). `home-overview.png` is its first 920px, cropped without altering page content.
- Responsive: 390 × 844 (`game-mobile-final.png`, `home-mobile-final.png`); 320 × 812 (`leaderboard-320.png`); 768 × 1024 (`home-tablet.png`). All measured document widths equal viewport widths.
- Visible handoff: enabling the in-app preview resized its pane to 397 × 656; `home-handoff-397.png` records this additional normal visible state. The full keyword and mobile grid remain intact.
- State: fresh game introduction and genuine empty community in the final desktop capture. Earlier `result-published.png`, `leaderboard-desktop.png`, `wall-desktop.png` show one actual local QA publication; that test record was subsequently removed from the local database.
- Normalization: source CSS viewport / DPR are unknown. Reference images were resized proportionally to 1280px width, with no inferred exact pixel equivalence. Browser screenshots are 1 screenshot pixel per CSS pixel. This is a layout/hierarchy adaptation retaining the previously approved petrol/gold palette and original artwork, rather than an exact competitor clone.

## Combined comparison evidence

- Full view: `qa/community/comparison-full.png` places the normalized reference above the rendered overview in one input. Both were opened and compared together.
- Focused region: `qa/community/comparison-podium.png` compares the reference podium with the actual page’s podium at the same normalized width. Required because avatars, ranking order and small labels are harder to judge in the full view.
- Interaction evidence: `game-mobile-final.png` shows a long story and wrapped choice at 390px; `leaderboard-desktop.png` and `wall-desktop.png` show the same published QA result.

## Comparison history and fixes

1. **Before implementation — blocked**: `before.png` showed a missing visible full keyword, dominant full-bleed illustration, generic headline, no What / How, and no community loop. [P1] Replace with centered left introduction / right playable card, full brand/H1, meaningful explanations and connected result publication, podium, leaderboard and wall.
2. **First visual pass — blocked**: `home-first.png`, `home-mobile-saved.png` and initial game screenshots showed some secondary copy at 10–13px, with uneven mobile feature-pill wrapping. [P2] Raise reading copy to 14–15px and answer rows to 15px, set mobile feature pills to two columns, and condense the hero description to a single coherent paragraph. Remove obsolete layout rules.
3. **Post-fix pass — passed**: combined `comparison-full.png` / `comparison-podium.png` and final mobile game evidence show complete keyword, aligned introduction/card, consistent spacing, readable controls and an immediately adjacent podium. No actionable P0/P1/P2 remains. Original art, six original dragons, eight choices, real empty seats and a fixed UTC reset description are intentional product differences.

## Five fidelity surfaces

- **Fonts / typography**: self-hosted Cormorant Garamond 400/500 for display and Inter 400/500 for interface. Full desktop H1 uses a controlled 60–86px scale and two lines, body/interface copy has a clearer hierarchy, long questions and answer rows wrap naturally. The competitor’s all-caps display styling is intentionally not copied.
- **Spacing / layout rhythm**: centered 1180px content, 70px desktop hero gap, contained right artwork, matching small utility cards and a single podium strip. Mobile collapses to one column, two-by-two feature labels and readable answer rows. Table and navigation remain usable at 320px.
- **Colors / tokens**: retained original petrol (#0b2023), ivory (#f3eee4) and antique gold (#d4b780). A light How section separates explanatory content without adding competing accents. Gold marks actions, score and selection; muted body text remains readable on dark surfaces. The rival’s brown/orange palette is an intentional difference.
- **Image quality**: existing original compressed WebP art remains sharp, properly cropped and masked. Original emblem, dragon portraits and bridge illustration are retained. Phosphor supplies ordinary UI icons; no decorative custom SVG, CSS-art replacement or invented avatars were used. Empty podium seats use dimmed original portraits and explicitly say Seat awaits.
- **Copy / content**: visible complete brand in header, H1, footer, result and PNG export; clear purpose, eight-choice/six-dragon rules, What / How and FAQ. Public publication, scoring and privacy copy match the implemented behavior. No fabricated player counters, scores or rarity claims.

## Functional verification

- Build / TypeScript / prerender: passed; 16 static routes and sitemap.
- Unit checks: 10 passed, including all 6561 routes, all six 100% strength maxima, invalid inputs and storage failure behavior.
- Original Sites packaging checks: 4 passed; protected template files unchanged.
- Separate workerd / temporary D1 integration: passed. Verified publication, server score computation, idempotent retries (including tampered retry answers), cross-origin rejection, publication interval limit, per-dragon maximum ranking, UTC-day exclusion, all-time inclusion, public removal and empty state.
- CF HTTP checks: all 16 routes and metadata passed; unknown page/API return 404, leaderboard slash redirect returns 307, and community is genuinely empty after test cleanup. Vite proxy accepts same-origin requests and still rejects a foreign origin.
- Local D1 migration and Cloudflare dry-run: passed. Production database is not provisioned; config retains a clearly documented placeholder ID.
- Supplementary light-page check: privacy removal reuses the existing light-page control theme; DOM confirms foreground #0b2023. Evidence: `qa/community/privacy-final.png`.
- Browser: eight answers → result → optional publish → daily/all-time ranking → color-filterable wall; double-click, keyboard Enter, Back, restart, refresh, mobile menu and long mobile story checked. Application console error check returned no errors.
- Remaining verification limit: OS-level PNG saving and production-domain behavior await actual browser / deployment acceptance. Existing in-browser PNG preview remains available.

## Implementation checklist

- [x] Complete visible keyword and coherent hero description.
- [x] Right-side game and direct answer progression.
- [x] What / How and expanded FAQ.
- [x] Genuine data for podium, daily / all-time leaderboard and six-color wall.
- [x] Optional public publishing with server scoring and removal controls.
- [x] Desktop / tablet / 390px / 320px checks.
- [x] CF Worker / D1 migration and packaging readiness.

No remaining visual fixes required for this refinement. Production setup is documented in README.md.
