const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { spawnSync } = require("node:child_process");

const projectRoot = path.resolve(__dirname, "..");

function createFixtureRepo() {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "rpg-tg-blueprint-lint-"));
  fs.mkdirSync(path.join(repoRoot, "docs", "blueprints", "specs"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "docs", "blueprints", "plans"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "docs", "blueprints", "queues"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "docs", "blueprints", "templates"), { recursive: true });

  writeFile(
    repoRoot,
    "docs/blueprints/project-progress.md",
    [
      "# Project Progress",
      "",
      "## Control Block",
      "",
      "- entry_id: `project-progress.test`",
      "- active_blueprint: `blueprint.test`",
      "- active_target: `target.test`",
      "- has_active_queue: `false`",
      "- next_file: `docs/blueprints/blueprint.md`",
      "- entry_action: `open-next-file`",
      "",
    ].join("\n")
  );

  writeFile(
    repoRoot,
    "docs/blueprints/blueprint.md",
    [
      "# Current Blueprint",
      "",
      "## Control Block",
      "",
      "- blueprint_id: `blueprint.test`",
      "- active_target: `target.test`",
      "- active_target_plan: `docs/blueprints/plans/test-target-plan.md`",
      "- classification_rules_ref: `docs/blueprints/classification-rule-layer-spec.md`",
      "- execution_mode: `single-active-task`",
      "- allow_parallel: `false`",
      "",
    ].join("\n")
  );

  writeFile(
    repoRoot,
    "docs/blueprints/specs/test-target.md",
    [
      "# Target Title",
      "",
      "## Control Block",
      "",
      "- target_id: `target.test`",
      "- version_label: `v1`",
      "- closeout_contract_version: `v1`",
      "",
      "## Human Context",
      "",
      "### Queue Contract Portfolio",
      "",
      "| Queue ID | Class | Contract Role | Promote When |",
      "| --- | --- | --- | --- |",
      "| `queue.test` | `required` | `required evidence family` | `only if a fresh blocker is proven` |",
      "",
    ].join("\n")
  );

  writeFile(
    repoRoot,
    "docs/blueprints/plans/test-target-plan.md",
    [
      "# Target Plan Title",
      "",
      "## Control Block",
      "",
      "- document_role: `target-governor`",
      "- target_id: `target.test`",
      "- target_status: `open`",
      "- active_phase: `phase.test`",
      "- active_queue: `none`",
      "- decision_state: `idle-open`",
      "- next_decision: `same-target-admission-or-target-closeout`",
      "- next_action: `classify-fresh-work`",
      "- resume_gate: `idle-open`",
      "- promotion_review_result: `none`",
      "- review_subject_id: `none`",
      "- review_subject_classification: `none`",
      "- proposed_queue_id: `none`",
      "- review_basis: `none`",
      "- admission_status: `none`",
      "- blocked_by: []",
      "",
    ].join("\n")
  );

  writeFile(
    repoRoot,
    "docs/blueprints/queues/test-queue.md",
    [
      "# Queue Title",
      "",
      "## Control Block",
      "",
      "- queue_id: `queue.test`",
      "- belongs_to_target: `target.test`",
      "- queue_status: `done`",
      "- queue_class: `required`",
      "- active_task: `none`",
      "- next_task: `none`",
      "- closeout_status: `done`",
      "- next_effect: `return-to-target-review`",
      "- blocked_by: []",
      "- allowed_item_classifications:",
      "  - `current-target-item`",
      "- reject_item_classifications:",
      "  - `out-of-scope`",
      "",
      "## Human Context",
      "",
      "### Closed Review Record",
      "",
      "- Status: `done`",
      "",
    ].join("\n")
  );

  return repoRoot;
}

function writeFile(repoRoot, relativePath, content) {
  const absolutePath = path.join(repoRoot, ...relativePath.split("/"));
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, `${content}\n`, "utf8");
}

async function loadBlueprintLintModule() {
  return import(
    pathToFileURL(path.join(projectRoot, "tools", "lint-blueprints.mjs")).href
  );
}

test("blueprint lint accepts structured control-block-only resume fields", async () => {
  const repoRoot = createFixtureRepo();
  const { lintBlueprintDocs } = await loadBlueprintLintModule();

  const failures = lintBlueprintDocs(repoRoot);

  assert.deepEqual(failures, []);
});

test("blueprint lint rejects project-progress next_step prose mirrors", async () => {
  const repoRoot = createFixtureRepo();
  writeFile(
    repoRoot,
    "docs/blueprints/project-progress.md",
    [
      "# Project Progress",
      "",
      "## Control Block",
      "",
      "- entry_id: `project-progress.test`",
      "- active_blueprint: `blueprint.test`",
      "- active_target: `target.test`",
      "- has_active_queue: `false`",
      "- next_file: `docs/blueprints/blueprint.md`",
      "- next_step: `Open the Blueprint index, then open the current target plan.`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /project-progress.*next_step/i);
});

test("blueprint lint rejects target plans that keep Current Decision prose or next_legal_action", async () => {
  const repoRoot = createFixtureRepo();
  writeFile(
    repoRoot,
    "docs/blueprints/plans/test-target-plan.md",
    [
      "# Target Plan Title",
      "",
      "## Control Block",
      "",
      "- document_role: `target-governor`",
      "- target_id: `target.test`",
      "- target_status: `open`",
      "- active_phase: `phase.test`",
      "- active_queue: `none`",
      "- decision_state: `idle-open`",
      "- next_decision: `same-target-admission-or-target-closeout`",
      "- next_legal_action: `Classify fresh work.`",
      "- resume_gate: `idle-open`",
      "- promotion_review_result: `none`",
      "- review_subject_id: `none`",
      "- review_subject_classification: `none`",
      "- proposed_queue_id: `none`",
      "- review_basis: `none`",
      "- admission_status: `none`",
      "- blocked_by: []",
      "",
      "## Human Context",
      "",
      "### Current Decision",
      "",
      "- State explanation:",
      "  - `Still prose.`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /target plan.*next_legal_action/i);
  assert.match(failures.join("\n"), /Current Decision/i);
});

test("blueprint lint rejects target specs that mix queue contract with runtime state columns", async () => {
  const repoRoot = createFixtureRepo();
  writeFile(
    repoRoot,
    "docs/blueprints/specs/test-target.md",
    [
      "# Target Title",
      "",
      "## Control Block",
      "",
      "- target_id: `target.test`",
      "- version_label: `v1`",
      "- closeout_contract_version: `v1`",
      "",
      "## Human Context",
      "",
      "### Queue Portfolio",
      "",
      "| Queue ID | Class | State | Promote When | Source |",
      "| --- | --- | --- | --- | --- |",
      "| `queue.test` | `required` | `done` | `already closed` | `docs/blueprints/queues/test-queue.md` |",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /target spec.*Queue Portfolio.*State/i);
});

test("blueprint lint rejects repository entry drift when has_active_queue is false but target plan names an active queue", async () => {
  const repoRoot = createFixtureRepo();
  writeFile(
    repoRoot,
    "docs/blueprints/plans/test-target-plan.md",
    [
      "# Target Plan Title",
      "",
      "## Control Block",
      "",
      "- document_role: `target-governor`",
      "- target_id: `target.test`",
      "- target_status: `open`",
      "- active_phase: `phase.test`",
      "- active_queue: `queue.test`",
      "- decision_state: `active-execution`",
      "- next_decision: `same-target-admission-or-target-closeout`",
      "- next_action: `resume-active-queue`",
      "- resume_gate: `open-active-queue`",
      "- promotion_review_result: `none`",
      "- review_subject_id: `none`",
      "- review_subject_classification: `none`",
      "- proposed_queue_id: `none`",
      "- review_basis: `none`",
      "- admission_status: `none`",
      "- blocked_by: []",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /has_active_queue.*active_queue/i);
});

test("blueprint lint rejects active-execution when the target plan has no active queue", async () => {
  const repoRoot = createFixtureRepo();
  writeFile(
    repoRoot,
    "docs/blueprints/plans/test-target-plan.md",
    [
      "# Target Plan Title",
      "",
      "## Control Block",
      "",
      "- document_role: `target-governor`",
      "- target_id: `target.test`",
      "- target_status: `open`",
      "- active_phase: `phase.test`",
      "- active_queue: `none`",
      "- decision_state: `active-execution`",
      "- next_decision: `queue-closeout-or-return-to-target-review`",
      "- next_action: `resume-active-queue`",
      "- resume_gate: `open-active-queue`",
      "- promotion_review_result: `none`",
      "- review_subject_id: `none`",
      "- review_subject_classification: `none`",
      "- proposed_queue_id: `none`",
      "- review_basis: `none`",
      "- admission_status: `none`",
      "- blocked_by: []",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /decision_state=active-execution.*active_queue=none/i);
  assert.match(failures.join("\n"), /resume-active-queue.*active_queue=none/i);
});

test("blueprint lint rejects queue-candidate review without a proposed queue id", async () => {
  const repoRoot = createFixtureRepo();
  writeFile(
    repoRoot,
    "docs/blueprints/plans/test-target-plan.md",
    [
      "# Target Plan Title",
      "",
      "## Control Block",
      "",
      "- document_role: `target-governor`",
      "- target_id: `target.test`",
      "- target_status: `open`",
      "- active_phase: `phase.test`",
      "- active_queue: `none`",
      "- decision_state: `promotion-review`",
      "- next_decision: `queue-admission-review`",
      "- next_action: `write-admission-review`",
      "- resume_gate: `promotion-review`",
      "- promotion_review_result: `none`",
      "- review_subject_id: `item.test`",
      "- review_subject_classification: `queue-candidate`",
      "- proposed_queue_id: `none`",
      "- review_basis: `fresh blocker proven`",
      "- admission_status: `pending`",
      "- blocked_by: []",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(
    failures.join("\n"),
    /proposed_queue_id.*review_subject_classification=queue-candidate/i
  );
});

test("blueprint lint rejects queue docs that still use candidate status", async () => {
  const repoRoot = createFixtureRepo();
  writeFile(
    repoRoot,
    "docs/blueprints/queues/test-queue.md",
    [
      "# Queue Title",
      "",
      "## Control Block",
      "",
      "- queue_id: `queue.test`",
      "- belongs_to_target: `target.test`",
      "- queue_status: `candidate`",
      "- queue_class: `required`",
      "- active_task: `none`",
      "- next_task: `none`",
      "- closeout_status: `in-progress`",
      "- next_effect: `none`",
      "- blocked_by: []",
      "- allowed_item_classifications:",
      "  - `current-target-item`",
      "- reject_item_classifications:",
      "  - `out-of-scope`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /queue_status=candidate is not an allowed queue status/i);
});

test("blueprint lint rejects non-active queues that still expose a live active task", async () => {
  const repoRoot = createFixtureRepo();
  writeFile(
    repoRoot,
    "docs/blueprints/queues/test-queue.md",
    [
      "# Queue Title",
      "",
      "## Control Block",
      "",
      "- queue_id: `queue.test`",
      "- belongs_to_target: `target.test`",
      "- queue_status: `blocked`",
      "- queue_class: `required`",
      "- active_task: `task.test`",
      "- next_task: `none`",
      "- closeout_status: `blocked`",
      "- next_effect: `none`",
      "- blocked_by: []",
      "- allowed_item_classifications:",
      "  - `current-target-item`",
      "- reject_item_classifications:",
      "  - `out-of-scope`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /queue must not keep active_task=.*while queue_status=blocked/i);
});

test("blueprint lint rejects active queue docs when target plan still says active_queue=none", async () => {
  const repoRoot = createFixtureRepo();
  writeFile(
    repoRoot,
    "docs/blueprints/queues/test-queue.md",
    [
      "# Queue Title",
      "",
      "## Control Block",
      "",
      "- queue_id: `queue.test`",
      "- belongs_to_target: `target.test`",
      "- queue_status: `active`",
      "- queue_class: `required`",
      "- active_task: `task.test`",
      "- next_task: `none`",
      "- closeout_status: `in-progress`",
      "- next_effect: `return-to-target-review`",
      "- blocked_by: []",
      "- allowed_item_classifications:",
      "  - `current-target-item`",
      "- reject_item_classifications:",
      "  - `out-of-scope`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /active_queue=none conflicts with active queue docs/i);
});

test("blueprint lint rejects live admission review while another queue is already active", async () => {
  const repoRoot = createFixtureRepo();
  writeFile(
    repoRoot,
    "docs/blueprints/project-progress.md",
    [
      "# Project Progress",
      "",
      "## Control Block",
      "",
      "- entry_id: `project-progress.test`",
      "- active_blueprint: `blueprint.test`",
      "- active_target: `target.test`",
      "- has_active_queue: `true`",
      "- next_file: `docs/blueprints/blueprint.md`",
      "- entry_action: `open-next-file`",
      "",
    ].join("\n")
  );
  writeFile(
    repoRoot,
    "docs/blueprints/plans/test-target-plan.md",
    [
      "# Target Plan Title",
      "",
      "## Control Block",
      "",
      "- document_role: `target-governor`",
      "- target_id: `target.test`",
      "- target_status: `open`",
      "- active_phase: `phase.test`",
      "- active_queue: `queue.test`",
      "- decision_state: `active-execution`",
      "- next_decision: `queue-closeout-or-return-to-target-review`",
      "- next_action: `resume-active-queue`",
      "- resume_gate: `open-active-queue`",
      "- promotion_review_result: `none`",
      "- review_subject_id: `item.other`",
      "- review_subject_classification: `queue-candidate`",
      "- proposed_queue_id: `queue.other`",
      "- review_basis: `fresh blocker proven`",
      "- admission_status: `pending`",
      "- blocked_by: []",
      "",
    ].join("\n")
  );
  writeFile(
    repoRoot,
    "docs/blueprints/queues/test-queue.md",
    [
      "# Queue Title",
      "",
      "## Control Block",
      "",
      "- queue_id: `queue.test`",
      "- belongs_to_target: `target.test`",
      "- queue_status: `active`",
      "- queue_class: `required`",
      "- active_task: `task.test`",
      "- next_task: `none`",
      "- closeout_status: `in-progress`",
      "- next_effect: `return-to-target-review`",
      "- blocked_by: []",
      "- allowed_item_classifications:",
      "  - `current-target-item`",
      "- reject_item_classifications:",
      "  - `out-of-scope`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /must not keep a live admission review subject while active_queue=queue.test/i);
});

test("blueprint lint CLI reports success for a valid fixture repository", () => {
  const repoRoot = createFixtureRepo();

  const result = spawnSync(
    process.execPath,
    [path.join(projectRoot, "tools", "lint-blueprints.mjs")],
    {
      cwd: repoRoot,
      encoding: "utf8",
    }
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Blueprint lint passed/i);
});
