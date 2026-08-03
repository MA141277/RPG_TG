const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("tickable playable loop is not restricted to house-owned sessions", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src", "main.ts"),
    "utf8"
  );

  assert.doesNotMatch(
    source,
    /session == null \|\| session\.ownerContext\.ownerKind !== "house"/,
    "Expected shared playable auto-tick to allow external/event-owned playable sessions too."
  );
});
