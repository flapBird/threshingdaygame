import test from "node:test";
import assert from "node:assert/strict";
import { readDevice, writeDevice, removeDevice } from "../src/storage";
function withStorage(storage: object, run: () => void) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", {
    value: storage,
    configurable: true,
  });
  try {
    run();
  } finally {
    if (previous) Object.defineProperty(globalThis, "localStorage", previous);
    else Reflect.deleteProperty(globalThis, "localStorage");
  }
}
test("quota failure keeps new completed answers available instead of stale progress", () => {
  withStorage(
    {
      getItem: () => "old incomplete run",
      setItem: () => {
        throw Error("quota");
      },
    },
    () => {
      assert.equal(readDevice("quota-run"), "old incomplete run");
      assert.equal(writeDevice("quota-run", "new complete run"), false);
      assert.equal(readDevice("quota-run"), "new complete run");
    },
  );
});
test("unavailable storage still allows a session result and honest removal status", () => {
  withStorage(
    {
      getItem: () => {
        throw Error("blocked");
      },
      setItem: () => {
        throw Error("blocked");
      },
      removeItem: () => {
        throw Error("blocked");
      },
    },
    () => {
      assert.equal(readDevice("blocked-run"), null);
      assert.equal(writeDevice("blocked-run", "completed"), false);
      assert.equal(readDevice("blocked-run"), "completed");
      assert.equal(removeDevice("blocked-run"), false);
      assert.equal(readDevice("blocked-run"), null);
    },
  );
});
test("failed removal cannot resurrect previously stored progress during restart", () => {
  withStorage(
    {
      getItem: () => "old completed run",
      removeItem: () => {
        throw Error("blocked");
      },
    },
    () => {
      assert.equal(readDevice("restart-run"), "old completed run");
      assert.equal(removeDevice("restart-run"), false);
      assert.equal(readDevice("restart-run"), null);
    },
  );
});
