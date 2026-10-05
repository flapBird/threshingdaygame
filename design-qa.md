# Design QA · FAQ and launch refinements · 2026-10-05

**final result: passed**

## Current refinement: source and implementation

- Visual source: user-supplied How to play screenshot, saved as `qa/refinements/reference-how.png` (2876 × 934 pixels). The requested change intentionally replaces its ivory background with the established petrol/gold theme; this screenshot is a structure/reference baseline, not a request to reproduce its colors.
- Additional source: the screenshots supplied by the user list the FAQ topics. Their accompanying analysis is treated as research leads, not verified official rules. Official author FAQ and two Reddit megathreads were checked on October 5.
- Implementation: [Cloudflare local preview](http://127.0.0.1:4175/), with real local D1 counts of 0 public bonds / 0 riders. No test rows were added to the preview database in this refinement.
- Desktop: 1280 × 800 CSS viewport; `home-after-desktop.png` is 1280 × 3610, `faq-desktop.png` is 1280 × 800, `wall-desktop.png` is 1280 × 1536, all in `qa/refinements/`.
- Responsive: 390 × 844 (`faq-mobile.png`, `wall-mobile.png`, `timer-mobile.png`), 320 × 740 (`home-320.png`, `faq-320.png`, `wall-320.png`), 768 × 1024 (`wall-tablet.png`). Measured document width equals actual viewport width at every checked breakpoint.
- Normalization: source CSS size/DPR are unknown (144 DPI metadata is not a verified CSS viewport). The source is resized proportionally to 1280px for comparison. Browser captures use one image pixel per CSS pixel. Full-page heights differ because the podium is hidden and FAQ content is expanded; this is an intentional content change.
- State: homepage introduction, FAQ closed or one question expanded, genuine empty wall, blue filter selected during interaction checks. Mobile keyboard screenshot includes the real focus outline.

## Current comparison evidence and iteration history

1. **Baseline — P1 theme discontinuity / FAQ gaps / empty wall presentation.** Current-run `home-before-desktop.png` and `wall-before-desktop.png` captured the ivory How section, generic six-question FAQ, homepage podium and text-only empty wall. The user asked to change these.
2. **First revision — P1 image sizing.** The new six dragon cards initially retained the HTML image height of 1000px; `wall-initial-sizing.png` records the problem. Adding explicit automatic CSS heights and a preferred aspect ratio restored compact cards. Final desktop images measure 183 × 173.84 CSS px rather than 183 × 1000. The same fix covers published wall images.
3. **Post-fix comparison — passed.** Opened and inspected both source and rendered artifacts in the same comparison inputs: `comparison-home.png` (baseline left / revised right, 1280 × 1805), `comparison-how.png` (user reference above / dark revision below, 1280 × 785), `comparison-wall.png` (empty baseline left / six-companion revision right, 1280 × 768), and `comparison-wall-sizing.png` (initial sizing issue left / corrected right, 1280 × 1181). `how-desktop.png` and `how-320.png` are unaltered content crops from their full-page captures.
- Rejected captures: offscreen keyboard activation initially left the screenshot at the hero, and full-page capture from a scrolled viewport included an offscreen fixed skip-link artifact. These were replaced by the accepted FAQ screenshot and fresh wall captures from scrollY = 0. They are not used as final evidence.

## Current five-surface assessment

- **Typography:** existing self-hosted Cormorant Garamond / Inter preserved. Display headings, 14px FAQ/body copy, gold step numbers and readable expanded answers remain consistent. At 320px, How is one column and FAQ questions wrap without covering their icons.
- **Spacing/layout:** desktop How retains four steps; mobile behavior follows existing breakpoints. FAQ has three topic groups and aligned plus/minus controls. Dragon filters use six columns on desktop, three at 768px and two on phones. No horizontal overflow was measured.
- **Colors/tokens:** How uses `--surface` #11282b, `--ivory`, `--muted` and antique gold. No isolated light section remains on the homepage. Hover, expanded, pressed and keyboard focus states are visible.
- **Image quality:** six original WebP portraits reused without placeholder or code-drawn replacements. All six loaded successfully; the compact crop preserves each dragon’s face and silhouette. No new generated artwork was needed.
- **Copy/content:** exact title “Threshing Day game FAQ”, 16 focused questions, contextual guide/timer/atlas/privacy links, and clearly attributed player reports. No guaranteed official black/blue route or fabricated public counts. Six available original companions are distinguished from published bonds. Homepage podium is manually disabled; the leaderboard route remains available.

## Current verification and limits

- Build / TypeScript / 16-route prerender passed, including a repeat build after the image sizing fix.
- 10 unit checks and 4 Sites compatibility checks passed. Separate temporary workerd/D1 integration and Cloudflare dry-run passed: publication, idempotency, scores, counts, rankings, privacy removal and input limits. No backend/schema change in this refinement.
- Browser checks: exact FAQ heading and 16 questions; homepage podium absent; mouse and keyboard FAQ open/close; blue wall filter; six real zero counts; loading states observed; FAQ links reach the black/blue guide, its `#routes` section, and retry `#timer` (settled anchor positions about 120px below the top). App console check returned no errors or warnings in the inspected tabs.
- Production D1/domain behavior and OS-level PNG download remain outside this local refinement. No deployment, DNS or remote migration was performed. Missing API/error presentation is implemented distinctly from a confirmed zero count, but no forced-offline UI capture was taken in this run.
- No actionable P0/P1/P2 findings remain. Current report and screenshot index: `qa/refinements/audit.md`.

## Archived baseline: previous hero and community build

The following records the previous implementation and its checks; the current user decision overrides its visible homepage podium and ivory How section.

### Previous source and implementation

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

## Story-card refinement · 2026-10-05

Source: user attachments `codex-clipboard-51dc41fb-9b8f-4443-ade5-fb5f8bb61676.png` (cover), `codex-clipboard-6a0581f0-e68a-4778-8dd9-14ad73e32469.png` (choices), `codex-clipboard-69840e6f-1f8f-43c2-8977-5e1e8df4da68.png` (narrative reveal), and `codex-clipboard-ff540112-95ef-47f8-9a2a-d20eee5de1f9.png` (next scene), supplied under `/var/folders/ll/zfhgnxpx1sl87rndkww8r32w0000gq/T/`.

Scope: adapt the reference's illustrated interactive slides to our original eight-choice story and existing petrol/gold design. This is not a pixel clone or a change to scoring. Existing dragon portraits provide atmospheric scene artwork; they do not announce the player's final companion.

Evidence:
- `qa/story-card/desktop.jpg`: homepage, first question, no selected answer; 1440 × 1000 CSS viewport, browser capture 1425 × 990 pixels.
- `qa/story-card/mobile.jpg`: final question and all three choices; 390 × 844 CSS viewport. No horizontal overflow; panel grows for long text.
- `qa/story-card/comparison.jpg`: source choice card (912 × 995 crop of the 1250 × 1076 attachment) beside our first-question card (519 × 612 CSS crop). Capture coordinates scaled by 1425/1440 and 990/1000; both cards fitted into 520 × 612 comparison regions. The source has four longer answers and a different story, so exact text wrapping and height are intentionally different. This combined focused comparison is readable enough to inspect all controls; the desktop capture supplies surrounding layout context.

Required surfaces reviewed:
- Typography: original Cormorant headings and Inter body retained; compact 32px desktop/30px mobile scene headings, 15px/14px narrative, no clipping.
- Layout: full-bleed illustration, overlaid bottom narrative, bordered answers, eight segmented progress marks; min-height instead of fixed-height clipping. Existing left introduction remains intact.
- Tokens: original deep petrol, ivory and antique gold retained intentionally instead of copying the reference's brown/orange palette. Dark text backing keeps the narrative readable.
- Imagery: original bridge and dragon illustrations retained; changing crops and artwork, gentle finite camera motion, no placeholders. Image preloading covers the next scene.
- Content: original story, answers and deterministic matching unchanged; no copied competitor claims or preselected first answer.

Verification: browser-tested start, double-click advancing only once, Back restoring a selection, changed choice, refreshed saved progress, all eight questions through the result, and replay returning to the cover. Console error inspection returned no errors. Reduced-motion CSS disables all story animations and transforms (code-reviewed; OS preference was not changed). Existing build, 10 unit tests and 4 Sites packaging tests pass. Community APIs remain unavailable on this existing Vite preview and display their existing honest error state; no public bond was posted.

Comparison history: first combined review found no actionable P0/P1/P2 mismatch within this adaptation scope. Original art, story length, compact typography and eight rather than seven progress segments are deliberate product constraints.

Implementation checklist: illustrated cover and questions, segmented progress, scene/content entrances, choice feedback, next-art preload, responsive flow, reduced-motion fallback, original scoring and controls preserved.

final result: passed
