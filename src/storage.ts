// A failed persistent write must not hide the newest answers in this session.
const sessionMemory = new Map<string, string | null>();
export function readDevice(key: string): string | null {
  if (sessionMemory.has(key)) return sessionMemory.get(key) ?? null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
export function writeDevice(key: string, value: string): boolean {
  sessionMemory.set(key, value);
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
export function removeDevice(key: string): boolean {
  // A tombstone also prevents a failed removal from restoring old progress.
  sessionMemory.set(key, null);
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
