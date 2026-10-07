import { parseSavedRun, scenes } from "./trial";

export const LAST_RUN_KEY = "threshingday:last-completed-run:v1";

// A completed run belongs in the welcome-back summary, not in the active trial.
export function restoreTrialSession(
  activeRaw: string | null,
  lastRaw: string | null,
) {
  const active = parseSavedRun(activeRaw);
  const last = parseSavedRun(lastRaw);
  const completed = active?.answers.length === scenes.length ? active : null;
  return {
    resume: active && !completed ? active : null,
    lastAnswers:
      completed?.answers ??
      (last?.answers.length === scenes.length ? last.answers : null),
  };
}
