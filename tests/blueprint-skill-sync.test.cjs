const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const projectRoot = path.resolve(__dirname, "..");

async function loadBlueprintSkillSyncModule() {
  return import(
    pathToFileURL(path.join(projectRoot, "tools", "blueprint-skill-sync.mjs")).href
  );
}

function writeFile(repoRoot, relativePath, content) {
  const filePath = path.join(repoRoot, ...relativePath.split("/"));
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function readFile(repoRoot, relativePath) {
  return fs.readFileSync(path.join(repoRoot, ...relativePath.split("/")), "utf8");
}

function createBlueprintSkillFixture() {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "blueprint-skill-sync-"));

  writeFile(
    repoRoot,
    "docs/blueprints/blueprint-workflow-spec.md",
    [
      "# Blueprint Workflow Spec",
      "",
      "## Reading Order",
      "",
      "<!-- blueprint-skill:reading-order:start -->",
      "1. `docs/blueprints/project-progress.md`",
      "2. `docs/blueprints/blueprint.md`",
      "3. active version plan",
      "4. active queue doc",
      "<!-- blueprint-skill:reading-order:end -->",
      "",
      "## Required Sync",
      "",
      "<!-- blueprint-skill:sync-checklist:start -->",
      "- update the affected queue doc",
      "- update the active version plan when routing truth changes",
      "- update `docs/change-log.md` when code or behavior changes are recorded",
      "<!-- blueprint-skill:sync-checklist:end -->",
      "",
      "## Verification",
      "",
      "<!-- blueprint-skill:verification:start -->",
      "- `npm run lint:blueprints`",
      "- `npm run blueprint:governance:check` when version routing truth changes",
      "<!-- blueprint-skill:verification:end -->",
      "",
      "## Red Flags",
      "",
      "<!-- blueprint-skill:red-flags:start -->",
      "- do not use `docs/change-log.md` as live execution truth",
      "- do not activate implementation work before admission truth exists",
      "<!-- blueprint-skill:red-flags:end -->",
      "",
    ].join("\n")
  );

  writeFile(
    repoRoot,
    "docs/blueprints/classification-rule-layer-spec.md",
    [
      "# Classification Rule Layer Spec",
      "",
      "## Routing Rules",
      "",
      "<!-- blueprint-skill:routing-rules:start -->",
      "- classify first, route second, promote later",
      "- queue-candidate work must return to version-plan admission review before implementation",
      "- do not create a parallel active queue when single-active-task mode is in effect",
      "<!-- blueprint-skill:routing-rules:end -->",
      "",
    ].join("\n")
  );

  return repoRoot;
}

test("blueprint skill sync renders a generated governance skill from blueprint markers", async () => {
  const repoRoot = createBlueprintSkillFixture();
  const { syncBlueprintGovernanceSkill } = await loadBlueprintSkillSyncModule();

  const result = syncBlueprintGovernanceSkill(repoRoot);

  assert.equal(result.ok, true);
  assert.match(result.messages.join("\n"), /updated .*blueprint-governance/i);

  const skillText = readFile(repoRoot, ".codex/skills/blueprint-governance/SKILL.md");
  assert.match(skillText, /name: blueprint-governance/);
  assert.match(skillText, /<!-- GENERATED FILE: do not edit by hand -->/);
  assert.match(skillText, /## Required Reading Order/);
  assert.match(skillText, /docs\/blueprints\/project-progress\.md/);
  assert.match(skillText, /## Routing Rules/);
  assert.match(skillText, /classify first, route second, promote later/);
  assert.match(skillText, /## Verification/);
  assert.match(skillText, /npm run lint:blueprints/);
});

test("blueprint skill lint passes when the generated skill matches blueprint markers", async () => {
  const repoRoot = createBlueprintSkillFixture();
  const { syncBlueprintGovernanceSkill, lintBlueprintGovernanceSkill } =
    await loadBlueprintSkillSyncModule();

  const syncResult = syncBlueprintGovernanceSkill(repoRoot);
  assert.equal(syncResult.ok, true);

  const lintResult = lintBlueprintGovernanceSkill(repoRoot);
  assert.equal(lintResult.ok, true);
  assert.deepEqual(lintResult.messages, ["Blueprint governance skill is synchronized."]);
});

test("blueprint skill lint fails closed when the generated skill drifts from blueprint markers", async () => {
  const repoRoot = createBlueprintSkillFixture();
  const { syncBlueprintGovernanceSkill, lintBlueprintGovernanceSkill } =
    await loadBlueprintSkillSyncModule();

  const syncResult = syncBlueprintGovernanceSkill(repoRoot);
  assert.equal(syncResult.ok, true);

  writeFile(
    repoRoot,
    "docs/blueprints/blueprint-workflow-spec.md",
    [
      "# Blueprint Workflow Spec",
      "",
      "## Reading Order",
      "",
      "<!-- blueprint-skill:reading-order:start -->",
      "1. `docs/blueprints/project-progress.md`",
      "2. `docs/blueprints/blueprint.md`",
      "3. active version plan",
      "4. active queue doc",
      "5. active task definition",
      "<!-- blueprint-skill:reading-order:end -->",
      "",
      "## Required Sync",
      "",
      "<!-- blueprint-skill:sync-checklist:start -->",
      "- update the affected queue doc",
      "- update the active version plan when routing truth changes",
      "- update `docs/change-log.md` when code or behavior changes are recorded",
      "<!-- blueprint-skill:sync-checklist:end -->",
      "",
      "## Verification",
      "",
      "<!-- blueprint-skill:verification:start -->",
      "- `npm run lint:blueprints`",
      "- `npm run blueprint:governance:check` when version routing truth changes",
      "<!-- blueprint-skill:verification:end -->",
      "",
      "## Red Flags",
      "",
      "<!-- blueprint-skill:red-flags:start -->",
      "- do not use `docs/change-log.md` as live execution truth",
      "- do not activate implementation work before admission truth exists",
      "<!-- blueprint-skill:red-flags:end -->",
      "",
    ].join("\n")
  );

  const lintResult = lintBlueprintGovernanceSkill(repoRoot);
  assert.equal(lintResult.ok, false);
  assert.match(lintResult.messages.join("\n"), /out of date|not synchronized|sync/i);
});

test("blueprint skill sync fails closed when a required marker is missing", async () => {
  const repoRoot = createBlueprintSkillFixture();
  const { syncBlueprintGovernanceSkill } = await loadBlueprintSkillSyncModule();

  writeFile(
    repoRoot,
    "docs/blueprints/classification-rule-layer-spec.md",
    [
      "# Classification Rule Layer Spec",
      "",
      "## Routing Rules",
      "",
      "- classify first, route second, promote later",
      "",
    ].join("\n")
  );

  const result = syncBlueprintGovernanceSkill(repoRoot);
  assert.equal(result.ok, false);
  assert.match(result.messages.join("\n"), /missing blueprint-skill marker "routing-rules"/i);
});

test("blueprint skill sync fails closed when a marker appears more than once", async () => {
  const repoRoot = createBlueprintSkillFixture();
  const { syncBlueprintGovernanceSkill } = await loadBlueprintSkillSyncModule();

  writeFile(
    repoRoot,
    "docs/blueprints/blueprint-workflow-spec.md",
    [
      "# Blueprint Workflow Spec",
      "",
      "## Reading Order",
      "",
      "<!-- blueprint-skill:reading-order:start -->",
      "1. `docs/blueprints/project-progress.md`",
      "<!-- blueprint-skill:reading-order:end -->",
      "",
      "<!-- blueprint-skill:reading-order:start -->",
      "2. `docs/blueprints/blueprint.md`",
      "<!-- blueprint-skill:reading-order:end -->",
      "",
      "## Required Sync",
      "",
      "<!-- blueprint-skill:sync-checklist:start -->",
      "- update the affected queue doc",
      "<!-- blueprint-skill:sync-checklist:end -->",
      "",
      "## Verification",
      "",
      "<!-- blueprint-skill:verification:start -->",
      "- `npm run lint:blueprints`",
      "<!-- blueprint-skill:verification:end -->",
      "",
      "## Red Flags",
      "",
      "<!-- blueprint-skill:red-flags:start -->",
      "- do not use `docs/change-log.md` as live execution truth",
      "<!-- blueprint-skill:red-flags:end -->",
      "",
    ].join("\n")
  );

  const result = syncBlueprintGovernanceSkill(repoRoot);
  assert.equal(result.ok, false);
  assert.match(result.messages.join("\n"), /appears more than once|duplicate/i);
});

test("blueprint skill lint fails closed when the generated skill file is missing", async () => {
  const repoRoot = createBlueprintSkillFixture();
  const { lintBlueprintGovernanceSkill } = await loadBlueprintSkillSyncModule();

  const result = lintBlueprintGovernanceSkill(repoRoot);
  assert.equal(result.ok, false);
  assert.match(result.messages.join("\n"), /is missing; run blueprint skill sync/i);
});
