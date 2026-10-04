import { getResult, scenes } from "./trial";

export function bondStrength(answers: number[]) {
  const { dragon, scores } = getResult(answers);
  const maximum = scenes.reduce(
    (sum, scene) =>
      sum +
      Math.max(
        ...scene.choices.map(
          (c) =>
            (c.trait === dragon.trait ? 3 : 0) +
            (c.secondary === dragon.trait ? 1 : 0),
        ),
      ),
    0,
  );
  return {
    dragonId: dragon.id,
    strength: Math.round((scores[dragon.trait] / maximum) * 100),
  };
}
export function validRiderName(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value === value.trim() &&
    value.length >= 2 &&
    value.length <= 24 &&
    /^[\p{L}\p{N} _.'-]+$/u.test(value)
  );
}
export type Rider = {
  name: string;
  points: number;
  discovered: number;
  dragonId: string;
};
export type Bond = {
  id: string;
  name: string;
  dragonId: string;
  strength: number;
  createdAt: number;
};
export type Community = {
  bonds: number;
  riders: number;
  resetsAt: number;
  leaders: Rider[];
  recent: Bond[];
  colors: { dragonId: string; count: number }[];
};
export async function communityRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`/api/${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(
      body.error || "The community is unavailable. Please try again.",
    );
  return body as T;
}
