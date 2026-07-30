const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

test("runtime result contract keeps runtime settlement payload command-only", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/runtime-result.ts"),
    "utf8"
  );

  assert.match(source, /export type RuntimeSettlementResult = \{/);
  assert.doesNotMatch(source, /effects\?: Effect\[\]/);
  assert.match(source, /settlement\?: RuntimeSettlementResult \| null;/);
  assert.doesNotMatch(source, /settlement\?: unknown/);
});
