const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

test("runtime result exposes canonical RuntimeFollowUp while retaining legacy compatibility fields", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/runtime-result.ts"),
    "utf8"
  );

  assert.match(source, /export type RuntimeInteractiveSignal =/);
  assert.match(source, /export type RuntimeFollowUp = RuntimeInteractiveSignal;/);
  assert.match(source, /followUp\?: RuntimeFollowUp \| null;/);
  assert.match(source, /interactive\?: RuntimeInteractiveSignal \| null;/);
  assert.match(source, /outcome\?: RuntimeFollowUpOutcome \| null;/);
  assert.match(
    source,
    /canonical continuation surface[\s\S]*followUp\?: RuntimeFollowUp \| null;/
  );
  assert.match(
    source,
    /compatibility-only legacy continuation surfaces[\s\S]*outcome\?: RuntimeFollowUpOutcome \| null;[\s\S]*interactive\?: RuntimeInteractiveSignal \| null;/
  );
});
