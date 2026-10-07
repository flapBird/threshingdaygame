import { dragons, getResult, traits, type Dragon, type Trait } from "./trial";
import { parseJournal, journalProgress } from "./adventure";
import { getBondRarity, rarityTiers, type BondRarity } from "./rarity";

export const JOURNAL_EVENT = "threshingday:journal-updated";

export type CollectedBond = {
  id: string;
  dragon: Dragon;
  ranking: Trait[];
  rarity: BondRarity;
  journeys: number;
  discovered: number;
};
export const bondVariants = dragons.flatMap((dragon) =>
  traits
    .filter((trait) => trait !== dragon.trait)
    .map((secondary) => ({
      id: `${dragon.id}:${secondary}`,
      dragon,
      ranking: [dragon.trait, secondary],
      rarity: getBondRarity([dragon.trait, secondary])!,
    })),
);
export function dragonCollection(raw: string | null) {
  const paths = parseJournal(raw);
  const bonds = new Map<string, CollectedBond>();
  paths.forEach((path, index) => {
    const { dragon, ranking } = getResult([...path].map(Number));
    const pair = ranking.slice(0, 2);
    const id = `${dragon.id}:${pair[1]}`;
    const existing = bonds.get(id);
    if (existing) existing.journeys++;
    else
      bonds.set(id, {
        id,
        dragon,
        ranking: pair,
        rarity: getBondRarity(pair)!,
        journeys: 1,
        discovered: index,
      });
  });
  const collected = [...bonds.values()].sort(
    (a, b) => b.discovered - a.discovered,
  );
  const rarest =
    [...collected].sort((a, b) => a.rarity.paths - b.rarity.paths)[0] ?? null;
  return { paths, collected, rarest, progress: journalProgress(paths) };
}
export function rarityOrder(tier: string) {
  return rarityTiers.findIndex((item) => item.name === tier);
}
