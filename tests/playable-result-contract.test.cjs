const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

test("playable runtime exposes PlayableResult without dropping settlement compatibility", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/playable-runtime.ts"),
    "utf8"
  );

  assert.match(source, /export type PlayableSettlement = \{/);
  assert.match(source, /export type PlayableResult = PlayableSettlement;/);
});
