import {
  dragons,
  getResult,
  RULE_VERSION,
  scenes,
  traits,
  type Trait,
} from "./trial";

// Rarity describes ordered leading trait pairs, not dragon colors or real riders.
// Version separately from the unchanged dragon-matching rules.
export const RARITY_VERSION = 1;
export const rarityTiers = [
  { name: "Legendary", maxPercent: 0.5 },
  { name: "Epic", maxPercent: 1 },
  { name: "Rare", maxPercent: 3 },
  { name: "Uncommon", maxPercent: 5 },
  { name: "Common", maxPercent: 100 },
] as const;
export type BondRarity = {
  tier: (typeof rarityTiers)[number]["name"];
  paths: number;
  total: number;
  percent: string;
};
let distribution: Map<string, number> | undefined;
const total = scenes.reduce((count, scene) => count * scene.choices.length, 1);
function getDistribution() {
  if (distribution) return distribution;
  distribution = new Map();
  for (let path = 0; path < total; path++) {
    let remaining = path;
    const answers = scenes.map((scene) => {
      const answer = remaining % scene.choices.length;
      remaining = Math.floor(remaining / scene.choices.length);
      return answer;
    });
    const key = getResult(answers).ranking.slice(0, 2).join(":");
    distribution.set(key, (distribution.get(key) ?? 0) + 1);
  }
  return distribution;
}
export function getBondRarity(ranking: readonly string[]): BondRarity | null {
  if (ranking.length < 2) return null;
  const paths = getDistribution().get(ranking.slice(0, 2).join(":"));
  if (!paths) return null;
  const percent = (paths / total) * 100;
  return {
    tier: rarityTiers.find((tier) => percent <= tier.maxPercent)!.name,
    paths,
    total,
    percent: percent.toFixed(2),
  };
}
export function parseSharedBond(params: URLSearchParams) {
  if (params.get("v") !== String(RULE_VERSION)) return null;
  const dragon = dragons.find((d) => d.id === params.get("dragon"));
  if (!dragon) return null;
  const secondary = params.get("trait") as Trait;
  const ranking: Trait[] = [dragon.trait];
  if (
    params.get("rv") === String(RARITY_VERSION) &&
    traits.includes(secondary) &&
    getBondRarity([dragon.trait, secondary])
  )
    ranking.push(secondary);
  return { dragon, ranking };
}
export function bondSharePath(dragonId: string, ranking: readonly string[]) {
  const params = new URLSearchParams({
    dragon: dragonId,
    v: String(RULE_VERSION),
  });
  if (getBondRarity(ranking)) {
    params.set("trait", ranking[1]);
    params.set("rv", String(RARITY_VERSION));
  }
  return `/?${params}#play-card`;
}
