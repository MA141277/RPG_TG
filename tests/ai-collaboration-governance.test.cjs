const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const projectRoot = path.resolve(__dirname, "..");

function readText(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

test("AI collaboration governance is a repository entrypoint rule", () => {
  const agents = readText("AGENTS.md");

  assert.match(agents, /AI Collaboration Governance/);
  assert.match(agents, /docs\/ai-collaboration-governance\.md/);
  assert.match(agents, /Default-To-Scenario-Pack Rule/);
  assert.match(agents, /Scenario Pack Mirror Rule/);
  assert.match(agents, /Asset \/ Resource Governance/);
  assert.match(agents, /Playable \/ Minigame Governance/);
});

test("AI collaboration governance document covers execution-time hard constraints", () => {
  const governance = readText("docs/ai-collaboration-governance.md");

  for (const requiredSection of [
    "Execution Trigger",
    "Default-To-Scenario-Pack Rule",
    "Scenario Pack Mirror Rule",
    "Unified Event Route Rule",
    "Playable / Minigame Governance",
    "Asset / Resource Governance",
    "Schema / Contract Version Rule",
    "ID Stability Rule",
    "Deletion / Migration Rule",
    "Runtime Preview Acceptance Rule",
    "Round-Trip Rule",
    "Reference Integrity Rule",
    "Ownership Rule",
    "No Silent Duplication Rule",
    "Acceptance Evidence Rule",
    "Localization / Text Rule",
    "Ordering / Determinism Rule",
    "Backward Compatibility Policy Rule",
    "Asset Size / Format Rule",
    "Security / External Resource Rule",
    "No Hidden Base-Pack Dependency Rule",
    "No Scenario Branch Rule",
    "Export / Import / Preview Symmetry",
    "Fail-Closed Rule",
    "Persistent State Rule",
    "Verification Rule",
  ]) {
    assert.match(governance, new RegExp(requiredSection.replaceAll("/", "\\/")));
  }

  assert.match(governance, /src\/content\/scenario-packs\/<pack-id>/);
  assert.match(
    governance,
    /src\/modules\/script-editor\/builtin-templates\/<pack-id>/
  );
  assert.match(governance, /event action `navigate` -> `navigation-runtime`/);
  assert.match(governance, /All minigame-like mechanics are governed as `playable`/);
  assert.match(governance, /must use stable resource ids/);
  assert.match(governance, /must not hardcode scenario-specific asset paths/);
  assert.match(governance, /runtime pack -> Script Editor import -> export -> runtime preview/);
  assert.match(governance, /eventId/);
  assert.match(governance, /resourceId/);
  assert.match(governance, /AI must not use temporary IDs/);
  assert.match(governance, /AI must not silently duplicate/);
  assert.match(governance, /final response must state/);
  assert.match(governance, /text entries/);
  assert.match(governance, /stable ordering/);
  assert.match(governance, /AI must not load remote scripts/);
  assert.match(governance, /basePackId/);
});

test("AI collaboration governance has a focused npm guard", () => {
  const packageJson = JSON.parse(readText("package.json"));

  assert.equal(
    packageJson.scripts["lint:ai-collaboration-governance"],
    "node --test tests/ai-collaboration-governance.test.cjs"
  );
  assert.match(
    packageJson.scripts.test,
    /tests\/ai-collaboration-governance\.test\.cjs/
  );
});
