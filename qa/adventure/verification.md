# Branching adventure verification · 2026-10-06

## Changes and contract

Three routes, nine opening encounters and response-dependent crossings now replace the fixed linear presentation. All eight option positions retain the existing v1 trait weights. Matching, bond strength, rarity distribution and share links remain compatible. Completed journeys are recorded locally and deduplicated by validated answer path; shared dragon views do not earn discoveries. Public publishing remains opt-in.

## Automated checks

- `npm run build`: TypeScript, production bundle, 16 prerendered routes and required Sites artifacts pass.
- `npm test`: 18 tests pass, including exhaustive 6,561-path adventure/scoring equivalence, nine distinct encounters, backtracking, corrupt journal filtering, six reachable companions and five rarity tiers.
- `npm run test:sites`: 4 checks pass.
- `npm run test:community`: temporary local workerd/D1 integration check passes, covering publication, idempotency, daily rankings, input limits and privacy removal; Wrangler only performed a dry run.

## Browser checks (actual local app)

- Desktop: start with no selected answer; choose the ridge and see “Above the cloud line.” Return to the bridge and select the grove; see “The stranger knows a way.”
- Reload during the grove route: restored at decision 2. Finish the eight choices to earn Pyrren and journal progress 1/6 companions, 1/3 routes, 1/9 encounters.
- Reload the completed result: the same counts remain; new-discovery notices are not repeated.
- At a 390×844 viewport, restart and complete the sunken route using a different encounter. Earn Solvane; progress becomes 2/6, 2/3, 2/9, and the next goal points to the uncompleted ridge route.
- Narrow-screen DOM measurement: document scrollWidth 375, innerWidth 390; no horizontal page overflow. Inspected the answer rows and the three primary result actions.
- Visit `/?dragon=vesper&v=1#play-card`: shared result notice is shown, no exploration journal is earned. Return to own completed result: counts stay 2/6, 2/3, 2/9 and Vesper remains undiscovered.
- Restart: selected answer count is 0. Viewport override reset and local preview left open at the first choice.
- Local Worker/D1 is running at port 4175; real local empty community renders 0 published bonds / 0 riders after the initial API-unavailable state. No remote publication or deployment was performed.

## Captures

- `desktop-choices.png`: final desktop first decision and route labels.
- `mobile-choices.png`: mobile first decision. The brighter second row is pointer hover, not a saved/preselected answer.
- `mobile-result.png`: second earned companion, exploration progress and next-route hint. All discoveries in screenshots are local QA runs, not public rider activity.

These checks do not constitute a full screen-reader audit or a new end-to-end download/native-share audit. Existing download, sharing and publishing controls are preserved.
