# Compact results and welcome back · 2026-10-08

The October 7 user screenshots identified the oversized result panel and unequal community panels. The supplied competitor screenshot is a structural reference for a small previous-bond summary above the starting game screen. Original assets, petrol/gold styling and eight-choice matching remain unchanged.

## Verified behavior

- A completed eight-choice journey still reveals its result immediately. Long bond/rarity copy and the exploration journal are closed by default; the dragon, trait pair, Save card / Share / Go again, discovery cue and My Dragons link remain visible.
- Desktop result measured 600.20 CSS px tall at 1440 × 1000. Mobile result measured 592.20px at 390 × 844. All three primary buttons have the same vertical coordinate; no horizontal page overflow.
- Returning through Play, visiting My Dragons and returning, or reloading the homepage restores the starting screen and displays the latest completed dragon. View last card reopens the earned result without increasing discoveries.
- A partially completed journey restored question 2 after reload and subsequently completed normally. Existing completed-run data migrates to the last-bond summary. A new trial does not discard the previous completed bond.
- A Sylvara shared link still opens its explicit result. It left the collection at 4 combinations and preserved Vesper as the previous completed dragon.
- Dragon colors and Latest shared bonds have identical top coordinates and measured 491.39px height in the local empty-data view. Their shared grid row stretches both panels to its tallest content; mobile stacks naturally. No public records were added for testing.
- Bond details and exploration journal disclosures were opened and closed successfully. Existing downloadable-card, share and optional publish actions remain connected; OS-level download and publishing were not rerun for this layout change.

## Evidence

- `result-desktop.jpg`: compact earned Vesper result.
- `welcome-desktop.jpg`: restored start screen with last-bond summary.
- `result-mobile.jpg`, `welcome-mobile.jpg`: mobile full-page captures.
- `wall-aligned.jpg`: direct crop from the final browser full-page capture, showing matching panel boundaries.

The local preview services had stopped between sessions; Vite and local Wrangler were restarted. Final fresh-tab console inspection returned no warnings/errors. Final production build, TypeScript and 17-route prerender passed, as did 25 unit tests and 4 Sites compatibility tests. Three new session tests cover completed-result migration, incomplete-run preservation, and invalid previous results. `git diff --check` passed. No deployment or push.
