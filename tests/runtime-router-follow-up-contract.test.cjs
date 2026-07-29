const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

test("runtime router exposes follow-up naming while keeping legacy handlers", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/runtime-router.ts"),
    "utf8"
  );

  assert.match(source, /RuntimeFollowUp/);
  assert.match(source, /export type RuntimeRouteResult = RuntimeResult;/);
  assert.match(source, /export type RuntimeFollowUpInput = \{/);
  assert.match(source, /followUp: Exclude<NonNullable<RuntimeFollowUp>, \{ type: "none" \}>;/);
  assert.match(source, /export type RuntimeFollowUpResult = \{/);
  assert.match(source, /handleFollowUp\?\(input: RuntimeFollowUpInput\): RuntimeFollowUpResult;/);
  assert.match(source, /handleInteractive\?\(input: RuntimeInteractiveFollowUpInput\): RuntimeState;/);
  assert.match(source, /handleOutcome\?\(input: RuntimeOutcomeFollowUpInput\): RuntimeOutcomeFollowUpResult;/);
  assert.match(source, /route\(input: RuntimeRouteInput\): RuntimeRouteResult;/);
});

test("runtime dispatch keeps canonical followUp ahead of retained compatibility fallback ordering", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/runtime-dispatch.ts"),
    "utf8"
  );

  assert.match(
    source,
    /handleFollowUp[\s\S]*handleOutcome[\s\S]*handleInteractive/
  );
  assert.match(
    source,
    /if \(\s*!handledModernFollowUp[\s\S]*\(followUp == null \|\| followUp\.type === "none"\)[\s\S]*outcome == null[\s\S]*interactive != null[\s\S]*handleInteractive != null/
  );
});
