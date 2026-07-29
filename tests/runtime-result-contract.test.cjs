const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

test("runtime result contract types settlement effects explicitly", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/runtime-result.ts"),
    "utf8"
  );

  assert.match(source, /export type RuntimeSettlementResult = \{/);
  assert.match(source, /effects: Effect\[\]/);
  assert.match(source, /settlement\?: RuntimeSettlementResult \| null;/);
  assert.doesNotMatch(source, /settlement\?: unknown/);
});
