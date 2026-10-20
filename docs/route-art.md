# Original route scene artwork

Created on 2026-10-20 for the three original branching adventure routes.

## Generation and references

All three images were generated independently with the built-in `image_gen` tool, using this project's existing original illustrations as style references:

- `public/images/crossing.webp`
- `public/images/brannoc.webp`
- `public/images/aureth.webp`

The references supplied the established cinematic painterly fantasy style, deep petrol shadows, antique gold practical lighting and natural material detail. Competitor artwork was not used as an input. There are no people, dragons, text or UI in the new scenes.

Each image is 1024 × 1536 pixels. The upper portion establishes the route; the darker lower foreground leaves room for the game's narrative and answers. Final assets were converted from generated PNG files with `cwebp -q 80 -m 6`; no code-based image editing or compositing was used.

## Deliverables

| Route          | File                                |  Bytes |
| -------------- | ----------------------------------- | -----: |
| Sunken Way     | `public/images/sunken-way.webp`     | 274478 |
| Lantern Grove  | `public/images/lantern-grove.webp`  | 251996 |
| Windward Ridge | `public/images/windward-ridge.webp` | 163700 |

## Generation prompts

### sunken-way

```text
Use case: illustration-story. Asset type: original portrait background for a fantasy choice-adventure game. Generate ONE image, portrait 1024x1536. Input images 1–3 are STYLE REFERENCES ONLY: match their cinematic painterly realism, fine weathered stone detail, deep petrol / midnight teal, muted antique gold practical light, mist and subtle moonlight. Do not reproduce their subjects. Primary scene: The Sunken Way, a once-grand ancient stone stair descending through a flooded ravine toward an old river sluice gate beneath a broken masonry arch. Shallow dark water flows over timeworn steps; one old iron lantern glows warm antique gold beside the visible sluice mechanism. Empty place, no people and no dragons. Composition: make the distinctive submerged stair, arch and sluice gate readable in the upper 55% of the portrait, with depth into a misty river gorge. Lower 45% must be a quiet dark petrol pool and wet near-black stone foreground with restrained reflections and little fine contrast, suitable beneath overlaid game narrative and answer buttons. The illustration should look like a sibling of the supplied project artwork, not a UI mockup. Cinematic realistic fantasy painting, elegant and ominous, authentic water, ivy, wet basalt and old bronze. No text, lettering, symbols, UI, border, logo, watermark, portraits, creatures, or pre-existing fictional locations. No neon teal or bright magical glow.
```

### lantern-grove

```text
Use case: illustration-story. Asset type: original portrait background for a fantasy choice-adventure game. Generate ONE image, portrait 1024x1536. Input images 1–3 are STYLE REFERENCES ONLY: match their cinematic painterly realism, fine natural detail, deep petrol / midnight teal, muted antique gold practical light, mist and subtle moonlight. Do not reproduce their subjects. Primary scene: The Lantern Grove, an ancient forest at moonlit dusk, an enormous old tree's braided roots forming a natural arched doorway over a narrow woodland path. Silver-grey roots cross the dark earth. Exactly three small weathered bronze bells hang together from a branch near a warm old lantern, clearly visible as objects in the upper half, not icons or symbols. Empty place, no people and no dragons. Composition: arched roots, hanging bells and golden lantern are the readable focus in the upper 55% of the portrait, layered distant black pines and faint mist. Lower 45% is quiet dark petrol forest floor and deep shadow, restrained texture with little fine contrast, suitable beneath overlaid narrative and answer buttons. The illustration should look like a sibling of the supplied project artwork, not a UI mockup. Cinematic realistic fantasy painting, hushed and atmospheric, weathered bark, moss, ferns, silver roots and old bronze. No text, lettering, UI, border, logo, watermark, portraits, creatures, or pre-existing fictional locations. No neon or bright fantasy particles.
```

### windward-ridge

```text
Use case: illustration-story. Asset type: original portrait background for a fantasy choice-adventure game. Generate ONE image, portrait 1024x1536. Input images 1–3 are STYLE REFERENCES ONLY: match their cinematic painterly realism, mountain stone detail, deep petrol / midnight teal, muted antique gold practical light, mist and subtle moonlight. Do not reproduce their subjects. Primary scene: The Windward Ridge, a narrow high mountain ridge over a sea of dense cloud, leading to a weathered abandoned stone signal tower with a damaged timber beacon frame. A single old sheltered lantern at the tower entrance burns warm antique gold against deep-blue approaching storm clouds. Empty place, no people and no dragons. Composition: the distinctive ridge, battered signal tower and sweeping cloud sea are readable in the upper 55% of the portrait, massive dark blue distant peaks and dramatic subdued storm sky. Lower 45% should be quiet shadowed near-black ridge stones and deep petrol mist with restrained texture and little fine contrast, suitable beneath overlaid narrative and answer buttons. The illustration should look like a sibling of the supplied project artwork, not a UI mockup. Cinematic realistic fantasy painting, wind-swept and tense, wet rock, old masonry, cloud depth and subtle moonlight. No text, lettering, symbols, UI, border, logo, watermark, portraits, creatures, or pre-existing fictional locations. No neon light, no bright lightning or fire.
```

## Lantern Grove object-count refinement

The initial scene was refined with the same built-in image tool so three foreground bells are clear at game-card size. The rest of the scene was preserved. These were the two follow-up prompts applied to the generated Lantern Grove image:

```text
Edit target: the supplied Lantern Grove illustration. Change ONLY the small hanging bronze bell group near the lantern: it currently has two obvious bells. Make there be EXACTLY THREE clearly separate, fully visible small weathered bronze bells, arranged as a natural hanging cluster on cords. Add just the missing third small bell to the left of the pair with enough separation to count all three at game-card scale. Preserve every other detail, root arch, lantern, framing, lighting, sky, palette, dark foreground and painterly realistic fantasy style unchanged. This is a local object-count correction, not a new composition. No text, no UI, no people, no dragons. Portrait 1024x1536.
```

```text
Local removal edit to the supplied illustration. Keep the THREE large clearly separate foreground bronze bells unchanged. REMOVE the tiny fourth bell that hangs behind them near the lantern: specifically the small bronze conical object attached to the cord at about x=620, y=315 in this 1024x1536 image. Replace that tiny rear bell and its dangling cord with the existing unadorned tree-root/background texture so the scene contains exactly three bells total, namely the three large front bells. Preserve the lantern, tree arch, sky, every other object, layout, scale, lighting, style and dark foreground unchanged. Do not add new objects. No text, no UI, no people, no dragons. Portrait 1024x1536.
```

## Visual check

The final generated scenes and their WebP exports were visually inspected for the intended route landmarks, matching palette, clear silhouettes, dark text area, absence of text or UI, and three clearly visible Lantern Grove bells.
