const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { spawnSync } = require("node:child_process");
const {
  createGovernanceFixture,
  OPERATOR_INTAKE_CONTRACT_LINES,
  writeFixtureFile,
} = require("./helpers/blueprint-governance-fixtures.cjs");

const projectRoot = path.resolve(__dirname, "..");

function createFixtureRepo() {
  const { repoRoot, activeQueuePath } = createGovernanceFixture({
    activeQueueId: "none",
    activeQueuePath: "docs/blueprints/queues/test-queue.md",
    queueOwnerField: "belongs_to_version",
    queueStatus: "done",
  });

  writeFixtureFile(
    repoRoot,
    activeQueuePath,
    [
      "# Queue Title",
      "",
      "## Control Block",
      "",
      "- queue_id: `queue.test`",
      "- belongs_to_version: `target.test`",
      "- queue_status: `done`",
      "- queue_class: `required`",
      "- active_task: `none`",
      "- next_task: `none`",
      "- closeout_status: `done`",
      "- next_effect: `return-to-target-review`",
      "- sync_status: `success`",
      "- sync_scope: `none`",
      "- sync_summary: `No repository sync action is required for this closed fixture queue.`",
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
  writeFixtureFile(repoRoot, relativePath, content);
}

function readLiveVersionPlan() {
  const blueprint = fs.readFileSync(
    path.join(projectRoot, "docs", "blueprints", "blueprint.md"),
    "utf8"
  );
  const activeVersionMatch = blueprint.match(
    /^- active_version: `([^`]+)`$/m
  );
  const activeVersionPlanMatch = blueprint.match(
    /^- active_version_plan: `([^`]+)`$/m
  );

  assert.ok(activeVersionMatch, "blueprint must expose active_version");
  assert.ok(activeVersionPlanMatch, "blueprint must expose active_version_plan");

  return {
    activeVersion: activeVersionMatch[1],
    targetPlan: fs.readFileSync(
      path.join(projectRoot, ...activeVersionPlanMatch[1].split("/")),
      "utf8"
    ),
  };
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

test("blueprint lint resolves live target plan and spec from blueprint pointers instead of hardcoded filenames", async () => {
  const {
    repoRoot,
    targetPlanPath,
    targetSpecPath,
  } = createGovernanceFixture({
    activeQueueId: "none",
    targetPlanPath: "docs/blueprints/plans/custom-version-plan.md",
    targetSpecPath: "docs/blueprints/specs/custom-version-spec.md",
  });

  writeFixtureFile(
    repoRoot,
    "docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md",
    [
      "# Wrong Plan",
      "",
      "## Control Block",
      "",
      "- document_role: `target-governor`",
      "- target_id: `target.wrong`",
      "- version_status: `open`",
      "- active_phase: `phase.wrong`",
      "- active_queue: `queue.wrong`",
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
      "- intake_status: `none`",
      "- intake_item_id: `none`",
      "- intake_summary: `none`",
      "- intake_result: `none`",
      "- intake_feedback_mode: `none`",
      "- blocked_by: []",
      "",
    ].join("\n")
  );

  writeFixtureFile(
    repoRoot,
    "docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md",
    [
      "# Wrong Spec",
      "",
      "## Control Block",
      "",
      "- target_id: `target.wrong`",
      "- version_label: `v1`",
      "- closeout_contract_version: `v1`",
      "",
      "## Human Context",
      "",
      "### Queue Portfolio",
      "",
      "| Queue ID | Class | State | Promote When | Source |",
      "| --- | --- | --- | --- | --- |",
      "| `queue.wrong` | `required` | `active` | `never` | `wrong` |",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.equal(fs.existsSync(path.join(repoRoot, ...targetPlanPath.split("/"))), true);
  assert.equal(fs.existsSync(path.join(repoRoot, ...targetSpecPath.split("/"))), true);
  assert.deepEqual(failures, []);
});

test("blueprint lint accepts version-only live governance pointers", async () => {
  const { repoRoot } = createGovernanceFixture({
    activeQueueId: "none",
    useVersionTerms: true,
    targetPlanPath: "docs/blueprints/plans/custom-version-plan.md",
    targetSpecPath: "docs/blueprints/specs/custom-version-spec.md",
  });

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.deepEqual(failures, []);
});

test("blueprint lint rejects legacy target pointer fields in live blueprint docs after version cutover", async () => {
  const { repoRoot } = createGovernanceFixture({
    activeQueueId: "none",
    useVersionTerms: false,
  });

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /active_target|active_target_plan|active_target_spec/i);
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
      "- active_version: `target.test`",
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

test("blueprint lint rejects version plans that keep Current Decision prose or next_legal_action", async () => {
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
      "- version_status: `open`",
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

  assert.match(failures.join("\n"), /version plan.*next_legal_action/i);
  assert.match(failures.join("\n"), /Current Decision/i);
});

test("blueprint lint rejects version specs that mix queue contract with runtime state columns", async () => {
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

  assert.match(failures.join("\n"), /version spec.*Queue Portfolio.*State/i);
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
      "- version_status: `open`",
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

test("blueprint lint rejects blueprint.md when blueprint_version is missing", async () => {
  const repoRoot = createFixtureRepo();
  writeFixtureFile(
    repoRoot,
    "docs/blueprints/blueprint.md",
    [
      "# Current Blueprint",
      "",
      "## Control Block",
      "",
      "- blueprint_id: `blueprint.test`",
      "- active_version: `target.test`",
      "- active_version_plan: `docs/blueprints/plans/test-target-plan.md`",
      "- classification_rules_ref: `docs/blueprints/classification-rule-layer-spec.md`",
      "- execution_mode: `single-active-task`",
      "- allow_parallel: `false`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /blueprint_version/i);
});

test("blueprint lint rejects governed queue docs that still use belongs_to_target", async () => {
  const { repoRoot } = createGovernanceFixture({
    activeQueueId: "queue.test",
    activeQueuePath: "docs/blueprints/queues/test-queue.md",
    queueOwnerField: "belongs_to_target",
    queueStatus: "active",
  });
  writeFixtureFile(
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
      "- next_effect: `none`",
      "- sync_status: `pending`",
      "- sync_scope: `none`",
      "- sync_summary: `none`",
      "- blocked_by: []",
      "- allowed_item_classifications:",
      "  - `current-target-item`",
      "- reject_item_classifications:",
      "  - `out-of-scope`",
      "",
      "## Human Context",
      "",
      "### Queue Snapshot",
      "",
      "- queue_goal: `Keep the active queue governed by the current target.`",
      "- task_count: `1`",
      "- completed_task_count: `0`",
      "- remaining_task_count: `1`",
      "- active_task_summary: `Keep the current task visible.`",
      "- task_briefs:",
      "  - `task.test: maintain the queue shell.`",
      "",
      "### Task Ledger",
      "",
      "| Task ID | State | Summary | Depends On | Notes |",
      "| --- | --- | --- | --- | --- |",
      "| `task.test` | `active` | `Maintain the queue shell.` | `none` | `Test fixture active task.` |",
      "",
      "### Task Definitions",
      "",
      "#### `task.test`",
      "",
      "##### Control Block",
      "",
      "- task_id: `task.test`",
      "- state: `active`",
      "- task_kind: `execution`",
      "- scope:",
      "  - `docs/blueprints/queues/test-queue.md`",
      "- must_inspect:",
      "  - `docs/blueprints/queues/test-queue.md`",
      "- must_not_change:",
      "  - `historical evidence`",
      "- done_when:",
      "  - `Queue shell is synchronized.`",
      "- verify_with:",
      "  - `npm run lint:blueprints`",
      "- if_blocked:",
      "  - `Record the blocker in the queue doc.`",
      "- promote_next_if_done: `none`",
      "- stop_if:",
      "  - `none`",
      "",
      "##### Human Context",
      "",
      "- task_brief:",
      "  - `Maintain the queue shell.`",
      "- task_outcome_summary:",
      "  - `The queue shell stays synchronized.`",
      "",
      "### Closed Review Record",
      "",
      "- Status: `in-progress`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /belongs_to_target/i);
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
      "- version_status: `open`",
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
      "- version_status: `open`",
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
      "- intake_status: `none`",
      "- intake_item_id: `none`",
      "- intake_summary: `none`",
      "- intake_result: `none`",
      "- intake_feedback_mode: `none`",
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
      "- belongs_to_version: `target.test`",
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
      "- belongs_to_version: `target.test`",
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
      "- belongs_to_version: `target.test`",
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
      "- active_version: `target.test`",
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
      "- version_status: `open`",
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
      "- belongs_to_version: `target.test`",
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

test("blueprint lint accepts queue-local repository sync records on blocked queues", async () => {
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
      "- belongs_to_version: `target.test`",
      "- queue_status: `blocked`",
      "- queue_class: `required`",
      "- active_task: `none`",
      "- next_task: `none`",
      "- closeout_status: `blocked`",
      "- next_effect: `return-to-target-review`",
      "- sync_status: `failed`",
      "- sync_scope: `baseline-push`",
      "- sync_summary: `Baseline push failed after the queue state was already written as blocked.`",
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

  assert.deepEqual(failures, []);
});

test("blueprint lint accepts merge-conflict wording inside queue-local sync summary", async () => {
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
      "- belongs_to_version: `target.test`",
      "- queue_status: `blocked`",
      "- queue_class: `required`",
      "- active_task: `none`",
      "- next_task: `none`",
      "- closeout_status: `blocked`",
      "- next_effect: `return-to-target-review`",
      "- sync_status: `failed`",
      "- sync_scope: `baseline-merge`",
      "- sync_summary: `Merge conflict occurred during baseline merge after the queue state was already written as blocked.`",
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

  assert.deepEqual(failures, []);
});

test("blueprint lint rejects active or blocked queue docs that omit repository sync record fields", async () => {
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
      "- belongs_to_version: `target.test`",
      "- queue_status: `blocked`",
      "- queue_class: `required`",
      "- active_task: `none`",
      "- next_task: `none`",
      "- closeout_status: `blocked`",
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

  assert.match(failures.join("\n"), /repository sync record/i);
});

test("blueprint lint rejects queue blocked_by entries that mirror merge conflicts as execution blockers", async () => {
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
      "- active_task: `none`",
      "- next_task: `none`",
      "- closeout_status: `blocked`",
      "- next_effect: `return-to-target-review`",
      "- sync_status: `failed`",
      "- sync_scope: `baseline-merge`",
      "- sync_summary: `Merge conflict occurred during baseline merge after the queue state was already written as blocked.`",
      "- blocked_by:",
      "  - `merge conflict between branch and baseline`",
      "- allowed_item_classifications:",
      "  - `current-target-item`",
      "- reject_item_classifications:",
      "  - `out-of-scope`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /blocked_by.*merge conflict/i);
});

test("blueprint lint rejects version plans that mirror queue-local repository sync truth", async () => {
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
      "- version_status: `open`",
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
      "- intake_status: `none`",
      "- intake_item_id: `none`",
      "- intake_summary: `none`",
      "- intake_result: `none`",
      "- intake_feedback_mode: `none`",
      "- sync_status: `failed`",
      "- blocked_by: []",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /version plan.*sync_status/i);
});

test("blueprint lint rejects version-plan blocked_by entries that mirror merge conflicts as version blockers", async () => {
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
      "- version_status: `open`",
      "- active_phase: `phase.test`",
      "- active_queue: `none`",
      "- decision_state: `blocked`",
      "- next_decision: `resolve-blocker`",
      "- next_action: `resolve-blocker`",
      "- resume_gate: `blocked`",
      "- promotion_review_result: `none`",
      "- review_subject_id: `none`",
      "- review_subject_classification: `none`",
      "- proposed_queue_id: `none`",
      "- review_basis: `none`",
      "- admission_status: `none`",
      "- intake_status: `none`",
      "- intake_item_id: `none`",
      "- intake_summary: `none`",
      "- intake_result: `none`",
      "- intake_feedback_mode: `none`",
      "- blocked_by:",
      "  - `merge conflict between branch and baseline`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /version plan.*blocked_by.*merge conflict/i);
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

test("blueprint lint rejects target plans missing intake fields", async () => {
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
      "- version_status: `open`",
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

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /intake_status/i);
  assert.match(failures.join("\n"), /intake_item_id/i);
  assert.match(failures.join("\n"), /intake_feedback_mode/i);
});

test("blueprint lint rejects target plans whose idle intake fields do not reset to none", async () => {
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
      "- version_status: `open`",
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
      "- intake_status: `none`",
      "- intake_item_id: `item.test`",
      "- intake_summary: `Need queue help.`",
      "- intake_result: `queued-as-candidate`",
      "- intake_feedback_mode: `fixed-receipt`",
      "- blocked_by: []",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /intake_status=none/i);
});

test("blueprint lint rejects workflow specs that omit the fixed operator receipt contract", async () => {
  const repoRoot = createFixtureRepo();
  writeFile(
    repoRoot,
    "docs/blueprints/blueprint-workflow-spec.md",
    [
      "# Blueprint Workflow Spec",
      "",
      "## 7. Queue Admission Startup Rules",
      "",
      "Plain-language operator requests are valid intake inputs.",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /workflow spec.*固定 operator receipt contract|fixed operator receipt contract/i);
  assert.match(failures.join("\n"), /workflow spec.*allowed intake input/i);
});

test("blueprint lint rejects version-plan templates that omit the operator intake contract", async () => {
  const repoRoot = createFixtureRepo();
  writeFile(
    repoRoot,
    "docs/blueprints/templates/target-plan-template.md",
    [
      "# Target Plan Title",
      "",
      "## Control Block",
      "",
      "- document_role: `target-governor`",
      "- target_id: `target.replace-me`",
      "- version_status: `open | done | archived`",
      "- active_phase: `phase.replace-me`",
      "- active_queue: `queue.replace-me | none`",
      "- decision_state: `active-execution | promotion-review | idle-open | blocked`",
      "- next_decision: `queue-admission-review | queue-closeout-or-return-to-target-review | same-target-admission-or-target-closeout | target-closeout | resolve-blocker`",
      "- next_action: `classify-fresh-work | write-admission-review | activate-admitted-queue | resume-active-queue | auto-reconcile-active-task | write-queue-closeout | return-to-promotion-review | write-target-closeout | resolve-blocker`",
      "- resume_gate: `open-active-queue | promotion-review | idle-open | blocked`",
      "- promotion_review_result: `admit | reject | defer | block | none`",
      "- review_subject_id: `item.replace-me | none`",
      "- review_subject_classification: `queue-candidate | current-target-item | uncertain-needs-review | future-target-candidate | none`",
      "- proposed_queue_id: `queue.replace-me | none`",
      "- review_basis: `replace-with-written-evidence | none`",
      "- admission_status: `none | pending | admitted | rejected | deferred | blocked`",
      "- intake_status: `none | evaluating | absorbed | candidate-recorded | admission-review`",
      "- intake_item_id: `item.replace-me | none`",
      "- intake_summary: `replace-with-one-line-intake-summary | none`",
      "- intake_result: `none | absorbed-into-active-queue | queued-as-candidate | promoted-to-admission | rejected | deferred`",
      "- intake_feedback_mode: `none | fixed-receipt`",
      "- blocked_by: []",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /version plan must include an Operator Intake Contract section/i);
});

test("blueprint lint rejects execution-queue templates that omit the operator snapshot contract", async () => {
  const repoRoot = createFixtureRepo();
  writeFile(
    repoRoot,
    "docs/blueprints/templates/execution-queue-template.md",
    [
      "# Execution Queue Template",
      "",
      "## Control Block",
      "",
      "- queue_id: `queue.replace-me`",
      "- belongs_to_version: `target.replace-me`",
      "- queue_status: `active | blocked | done | dropped`",
      "- queue_class: `required`",
      "- active_task: `task.replace-me | none`",
      "- next_task: `task.replace-me-next | none`",
      "- closeout_status: `in-progress | done | blocked`",
      "- next_effect: `promote-next-queue | return-to-target-review | block-target | none`",
      "- sync_status: `pending | success | failed`",
      "- sync_scope: `branch-push | baseline-merge | baseline-push | none`",
      "- sync_summary: `Replace with the latest repository sync result.`",
      "- blocked_by: []",
      "- allowed_item_classifications:",
      "  - `current-target-item`",
      "- reject_item_classifications:",
      "  - `future-target-candidate`",
      "",
      "## Human Context",
      "",
      "### Queue Snapshot",
      "",
      "- queue_goal: `Replace with the bounded queue goal in one sentence.`",
      "- task_count: `1`",
      "- completed_task_count: `0`",
      "- remaining_task_count: `1`",
      "- active_task_summary: `Replace with the current active-task summary.`",
      "- task_briefs:",
      "  - `task.replace-me: Replace with a one-line task brief.`",
      "",
      "### Task Ledger",
      "",
      "| Task ID | State | Summary | Depends On | Notes |",
      "| --- | --- | --- | --- | --- |",
      "| `task.replace-me` | `active` | `Replace with task summary.` | `none` | `Replace with task note.` |",
      "",
      "### Task Definitions",
      "",
      "#### `task.replace-me`",
      "",
      "##### Control Block",
      "",
      "- task_id: `task.replace-me`",
      "- state: `active`",
      "",
      "##### Human Context",
      "",
      "- task_brief:",
      "  - `Replace with the one-sentence task responsibility.`",
      "- task_outcome_summary:",
      "  - `Replace with the expected or current task outcome in one sentence.`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /execution queue template must include an Operator Snapshot Contract section/i);
});

test("workflow spec documents minimal intake input and fixed operator receipt labels", () => {
  const workflowSpec = fs.readFileSync(
    path.join(projectRoot, "docs", "blueprints", "blueprint-workflow-spec.md"),
    "utf8"
  );

  assert.match(workflowSpec, /\u65b0\u9700\u6c42/u);
  assert.match(workflowSpec, /\u53c2\u8003\u6cbb\u7406\u89c4\u8303/u);
  assert.match(workflowSpec, /^### 7\.1\.1 Fixed operator receipt contract$/m);
  assert.match(workflowSpec, /\u5904\u7406\u7ed3\u679c\uff1a/u);
  assert.match(workflowSpec, /\u4eba\u5de5\u64cd\u4f5c\uff1a\u5f53\u524d\u4e0d\u9700\u8981 \/ \u5f53\u524d\u9700\u8981\u786e\u8ba4 xxx/u);
});

test("live version plan exposes the fixed operator intake contract", () => {
  const { targetPlan } = readLiveVersionPlan();

  assert.match(targetPlan, /^### Operator Intake Contract$/m);
  assert.match(targetPlan, /\u5904\u7406\u7ed3\u679c\uff1a/u);
  assert.match(targetPlan, /\u5f53\u524d\u6267\u884c\u60c5\u51b5\uff1a/u);
  assert.match(targetPlan, /\u4eba\u5de5\u64cd\u4f5c\uff1a\u5f53\u524d\u4e0d\u9700\u8981 \/ \u5f53\u524d\u9700\u8981\u786e\u8ba4 xxx/u);
});

test("workflow spec exposes the version-first resume chain and state model", () => {
  const workflowSpec = fs.readFileSync(
    path.join(projectRoot, "docs", "blueprints", "blueprint-workflow-spec.md"),
    "utf8"
  );

  assert.match(
    workflowSpec,
    /project-progress -> blueprint -> version plan -> active queue -> active task/
  );
  assert.match(workflowSpec, /^### 4\.3 version spec$/m);
  assert.match(workflowSpec, /^## 9\. Version State Model$/m);
  assert.doesNotMatch(
    workflowSpec,
    /project-progress -> blueprint -> target plan -> active queue -> active task/
  );
});

test("live version plan exposes version-first control fields and lifecycle wording", () => {
  const { activeVersion, targetPlan } = readLiveVersionPlan();
  const projectProgress = fs.readFileSync(
    path.join(projectRoot, "docs", "blueprints", "project-progress.md"),
    "utf8"
  );

  assert.match(targetPlan, /^- document_role: `version-governor`$/m);
  assert.match(
    targetPlan,
    new RegExp(`^- version_id: \`${activeVersion.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\`$`, "m")
  );
  const versionStatusMatch = targetPlan.match(/^- version_status: `([^`]+)`$/m);
  assert.ok(versionStatusMatch, "live version plan must expose version_status");
  assert.match(targetPlan, /^- active_queue: `[^`]+`$/m);
  assert.match(targetPlan, /^- next_decision: `[^`]+`$/m);
  assert.match(targetPlan, /^- next_action: `[^`]+`$/m);
  assert.match(targetPlan, /^- resume_gate: `[^`]+`$/m);
  if (versionStatusMatch[1] === "open") {
    assert.match(
      targetPlan,
      /^- decision_state: `(idle-open|promotion-review|active-execution|blocked)`$/m
    );
  } else if (versionStatusMatch[1] === "closed") {
    assert.match(targetPlan, /^- active_queue: `none`$/m);
    assert.match(targetPlan, /^- decision_state: `closed`$/m);
    assert.match(targetPlan, /^- resume_gate: `closed`$/m);
    assert.match(targetPlan, /^- next_lawful_queue_recommendation: `none`$/m);
    assert.match(projectProgress, /^- active_version: `[^`]+`$/m);
    assert.match(projectProgress, /^- has_active_queue: `false`$/m);
    assert.match(projectProgress, /^- entry_action: `open-next-file`$/m);
    assert.match(targetPlan, /Closeout confirmation:/);
    assert.match(targetPlan, /^- routing_basis: `closed-after-explicit-operator-closeout-with-no-same-family-residue`$/m);
  } else {
    assert.fail(`unexpected live version_status: ${versionStatusMatch[1]}`);
  }
  assert.match(targetPlan, /^### Version Lifecycle Rules$/m);
  assert.match(targetPlan, /^### Queue Admission Startup Rules$/m);
  assert.doesNotMatch(targetPlan, /^- target_id:/m);
  assert.doesNotMatch(targetPlan, /^- target_status:/m);
  assert.doesNotMatch(targetPlan, /^### Target Lifecycle Rules$/m);
});

test("execution queue template exposes version-first next_effect guidance and readable operator snapshot labels", () => {
  const queueTemplate = fs.readFileSync(
    path.join(
      projectRoot,
      "docs",
      "blueprints",
      "templates",
      "execution-queue-template.md"
    ),
    "utf8"
  );

  assert.match(
    queueTemplate,
    /^- next_effect: `promote-next-queue | return-to-version-review | block-version | none`$/m
  );
  assert.match(queueTemplate, /\u5f53\u524d\u6267\u884c\u961f\u5217.*queue_id/u);
  assert.match(queueTemplate, /\u5f53\u524d\u4efb\u52a1.*active_task/u);
  assert.match(queueTemplate, /\u5f53\u524d\u961f\u5217\u76ee\u6807.*queue_goal/u);
  assert.doesNotMatch(queueTemplate, /return-to-target-review/);
  assert.doesNotMatch(queueTemplate, /block-target/);
  assert.doesNotMatch(queueTemplate, /\?{4,}/u);
});

test("blueprint lint rejects active queues that omit queue snapshot", async () => {
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
      "- active_version: `target.test`",
      "- has_active_queue: `true`",
      "- next_file: `docs/blueprints/queues/test-queue.md`",
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
      "- version_status: `open`",
      "- active_phase: `phase.test`",
      "- active_queue: `queue.test`",
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
      "- intake_status: `none`",
      "- intake_item_id: `none`",
      "- intake_summary: `none`",
      "- intake_result: `none`",
      "- intake_feedback_mode: `none`",
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
      "- belongs_to_version: `target.test`",
      "- queue_status: `active`",
      "- queue_class: `required`",
      "- active_task: `task.test`",
      "- next_task: `task.next`",
      "- closeout_status: `in-progress`",
      "- next_effect: `return-to-target-review`",
      "- sync_status: `pending`",
      "- sync_scope: `none`",
      "- sync_summary: `No repository sync has run yet.`",
      "- blocked_by: []",
      "- allowed_item_classifications:",
      "  - `current-target-item`",
      "- reject_item_classifications:",
      "  - `out-of-scope`",
      "",
      "## Human Context",
      "",
      "### Active Task Ledger",
      "",
      "| Task ID | State | Summary | Depends On | Notes |",
      "| --- | --- | --- | --- | --- |",
      "| `task.test` | `active` | `Run the current task.` | `none` | `Current task.` |",
      "| `task.next` | `queued` | `Run the next task.` | `task.test` | `Next task.` |",
      "",
      "### Task Definitions",
      "",
      "#### `task.test`",
      "",
      "##### Control Block",
      "",
      "- task_id: `task.test`",
      "- state: `active`",
      "",
      "##### Human Context",
      "",
      "- task_brief:",
      "  - `Run the current task.`",
      "- task_outcome_summary:",
      "  - `Current task remains open.`",
      "",
      "#### `task.next`",
      "",
      "##### Control Block",
      "",
      "- task_id: `task.next`",
      "- state: `queued`",
      "",
      "##### Human Context",
      "",
      "- task_brief:",
      "  - `Run the next task.`",
      "- task_outcome_summary:",
      "  - `Next task has not started.`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /Queue Snapshot/i);
});

test("blueprint lint rejects active queues whose task definitions omit task_brief", async () => {
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
      "- active_version: `target.test`",
      "- has_active_queue: `true`",
      "- next_file: `docs/blueprints/queues/test-queue.md`",
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
      "- version_status: `open`",
      "- active_phase: `phase.test`",
      "- active_queue: `queue.test`",
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
      "- intake_status: `none`",
      "- intake_item_id: `none`",
      "- intake_summary: `none`",
      "- intake_result: `none`",
      "- intake_feedback_mode: `none`",
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
      "- belongs_to_version: `target.test`",
      "- queue_status: `active`",
      "- queue_class: `required`",
      "- active_task: `task.test`",
      "- next_task: `task.next`",
      "- closeout_status: `in-progress`",
      "- next_effect: `return-to-target-review`",
      "- sync_status: `pending`",
      "- sync_scope: `none`",
      "- sync_summary: `No repository sync has run yet.`",
      "- blocked_by: []",
      "- allowed_item_classifications:",
      "  - `current-target-item`",
      "- reject_item_classifications:",
      "  - `out-of-scope`",
      "",
      "## Human Context",
      "",
      "### Queue Snapshot",
      "",
      "- queue_goal: `Keep queue visibility explicit.`",
      "- task_count: `2`",
      "- completed_task_count: `0`",
      "- remaining_task_count: `2`",
      "- active_task_summary: `task.test keeps the queue active.`",
      "- task_briefs:",
      "  - `task.test: Run the current task.`",
      "  - `task.next: Run the next task.`",
      "",
      "### Active Task Ledger",
      "",
      "| Task ID | State | Summary | Depends On | Notes |",
      "| --- | --- | --- | --- | --- |",
      "| `task.test` | `active` | `Run the current task.` | `none` | `Current task.` |",
      "| `task.next` | `queued` | `Run the next task.` | `task.test` | `Next task.` |",
      "",
      "### Task Definitions",
      "",
      "#### `task.test`",
      "",
      "##### Control Block",
      "",
      "- task_id: `task.test`",
      "- state: `active`",
      "",
      "##### Human Context",
      "",
      "- task_outcome_summary:",
      "  - `Current task remains open.`",
      "",
      "#### `task.next`",
      "",
      "##### Control Block",
      "",
      "- task_id: `task.next`",
      "- state: `queued`",
      "",
      "##### Human Context",
      "",
      "- task_brief:",
      "  - `Run the next task.`",
      "- task_outcome_summary:",
      "  - `Next task has not started.`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /task_brief/i);
});

test("blueprint lint rejects active queues whose active_task is missing from task definitions", async () => {
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
      "- active_version: `target.test`",
      "- has_active_queue: `true`",
      "- next_file: `docs/blueprints/queues/test-queue.md`",
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
      "- version_status: `open`",
      "- active_phase: `phase.test`",
      "- active_queue: `queue.test`",
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
      "- intake_status: `none`",
      "- intake_item_id: `none`",
      "- intake_summary: `none`",
      "- intake_result: `none`",
      "- intake_feedback_mode: `none`",
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
      "- belongs_to_version: `target.test`",
      "- queue_status: `active`",
      "- queue_class: `required`",
      "- active_task: `task.test`",
      "- next_task: `task.next`",
      "- closeout_status: `in-progress`",
      "- next_effect: `return-to-target-review`",
      "- sync_status: `pending`",
      "- sync_scope: `none`",
      "- sync_summary: `No repository sync has run yet.`",
      "- blocked_by: []",
      "- allowed_item_classifications:",
      "  - `current-target-item`",
      "- reject_item_classifications:",
      "  - `out-of-scope`",
      "",
      "## Human Context",
      "",
      "### Queue Snapshot",
      "",
      "- queue_goal: `Keep queue visibility explicit.`",
      "- task_count: `2`",
      "- completed_task_count: `0`",
      "- remaining_task_count: `2`",
      "- active_task_summary: `task.test keeps the queue active.`",
      "- task_briefs:",
      "  - `task.test: Run the current task.`",
      "  - `task.next: Run the next task.`",
      "",
      "### Active Task Ledger",
      "",
      "| Task ID | State | Summary | Depends On | Notes |",
      "| --- | --- | --- | --- | --- |",
      "| `task.test` | `active` | `Run the current task.` | `none` | `Current task.` |",
      "| `task.next` | `queued` | `Run the next task.` | `task.test` | `Next task.` |",
      "",
      "### Task Definitions",
      "",
      "#### `task.next`",
      "",
      "##### Control Block",
      "",
      "- task_id: `task.next`",
      "- state: `queued`",
      "",
      "##### Human Context",
      "",
      "- task_brief:",
      "  - `Run the next task.`",
      "- task_outcome_summary:",
      "  - `Next task has not started.`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /active_task=.*task\.test.*task definitions/i);
});

test("blueprint lint rejects queues that claim topic closure while residue remains", async () => {
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
      "- belongs_to_version: `target.test`",
      "- queue_status: `done`",
      "- queue_class: `required`",
      "- active_task: `none`",
      "- next_task: `none`",
      "- closeout_status: `done`",
      "- execution_closeout_status: `done`",
      "- topic_closure_status: `closed`",
      "- closure_basis: `Implementation landed.`",
      "- residue_remaining: `yes`",
      "- residue_family: `same-family`",
      "- residue_routing_status: `auto-routable`",
      "- next_family_candidate: `queue.follow-up`",
      "- auto_continue_eligible: `true`",
      "- next_effect: `return-to-version-review`",
      "- sync_status: `success`",
      "- sync_scope: `none`",
      "- sync_summary: `No repository sync action is required for this closed fixture queue.`",
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

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /topic_closure_status=.*closed.*residue_remaining=.*yes/i);
});

test("blueprint lint rejects same-family queue residue without a named continuation", async () => {
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
      "- belongs_to_version: `target.test`",
      "- queue_status: `done`",
      "- queue_class: `required`",
      "- active_task: `none`",
      "- next_task: `none`",
      "- closeout_status: `done`",
      "- execution_closeout_status: `done`",
      "- topic_closure_status: `open-residue`",
      "- closure_basis: `Implementation landed but residue remains.`",
      "- residue_remaining: `yes`",
      "- residue_family: `same-family`",
      "- residue_routing_status: `auto-routable`",
      "- next_family_candidate: `none`",
      "- auto_continue_eligible: `true`",
      "- next_effect: `return-to-version-review`",
      "- sync_status: `success`",
      "- sync_scope: `none`",
      "- sync_summary: `No repository sync action is required for this closed fixture queue.`",
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

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(
    failures.join("\n"),
    /residue_family=same-family requires next_family_candidate/i
  );
  assert.match(failures.join("\n"), /auto_continue_eligible=.*true.*continuation/i);
});

test("blueprint lint rejects version plans that route same-family residue without a next lawful queue", async () => {
  const repoRoot = createFixtureRepo();
  writeFile(
    repoRoot,
    "docs/blueprints/plans/test-target-plan.md",
    [
      "# Target Plan Title",
      "",
      "## Control Block",
      "",
      "- document_role: `version-governor`",
      "- version_id: `target.test`",
      "- version_status: `open`",
      "- active_phase: `phase.test`",
      "- active_queue: `none`",
      "- decision_state: `promotion-review`",
      "- next_decision: `same-version-admission-or-version-closeout`",
      "- next_action: `write-admission-review`",
      "- resume_gate: `promotion-review`",
      "- promotion_review_result: `none`",
      "- review_subject_id: `none`",
      "- review_subject_classification: `none`",
      "- proposed_queue_id: `none`",
      "- review_basis: `none`",
      "- admission_status: `none`",
      "- intake_status: `none`",
      "- intake_item_id: `none`",
      "- intake_summary: `none`",
      "- intake_result: `none`",
      "- intake_feedback_mode: `none`",
      "- closure_review_subject: `queue.test`",
      "- closure_review_status: `routed`",
      "- residue_candidate_id: `item.residue`",
      "- residue_candidate_family: `same-family`",
      "- routing_basis: `Queue closeout proved one residue family.`",
      "- next_lawful_queue_recommendation: `none`",
      "- auto_admission_ready: `true`",
      "- stop_reason: `none`",
      "- stop_basis: `none`",
      "- next_unblocked_action: `none`",
      "- human_input_required: `false`",
      "- blocked_by: []",
      "",
      "## Human Context",
      "",
      "### Operator Intake Contract",
      "",
      "- Intake surface:",
      "  - `人工只输入：新需求 + 参考治理规范。`",
      "- Fixed receipt:",
      "  - `处理结果：已进入 Blueprint 内部治理。`",
      "  - `当前执行情况：等待版本层收敛。`",
      "  - `人工操作：当前不需要 / 当前需要确认 xxx`",
      "- Default visibility rule:",
      "  - `默认不向人工暴露真值链细节。`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(
    failures.join("\n"),
    /residue_candidate_family=same-family requires next_lawful_queue_recommendation/i
  );
});

test("blueprint lint rejects version plans that mark auto admission ready without structured routing truth", async () => {
  const repoRoot = createFixtureRepo();
  writeFile(
    repoRoot,
    "docs/blueprints/plans/test-target-plan.md",
    [
      "# Target Plan Title",
      "",
      "## Control Block",
      "",
      "- document_role: `version-governor`",
      "- version_id: `target.test`",
      "- version_status: `open`",
      "- active_phase: `phase.test`",
      "- active_queue: `none`",
      "- decision_state: `promotion-review`",
      "- next_decision: `same-version-admission-or-version-closeout`",
      "- next_action: `write-admission-review`",
      "- resume_gate: `promotion-review`",
      "- promotion_review_result: `none`",
      "- review_subject_id: `none`",
      "- review_subject_classification: `none`",
      "- proposed_queue_id: `none`",
      "- review_basis: `none`",
      "- admission_status: `none`",
      "- intake_status: `none`",
      "- intake_item_id: `none`",
      "- intake_summary: `none`",
      "- intake_result: `none`",
      "- intake_feedback_mode: `none`",
      "- closure_review_subject: `queue.test`",
      "- closure_review_status: `routed`",
      "- residue_candidate_id: `none`",
      "- residue_candidate_family: `none`",
      "- routing_basis: `none`",
      "- next_lawful_queue_recommendation: `none`",
      "- auto_admission_ready: `true`",
      "- stop_reason: `none`",
      "- stop_basis: `none`",
      "- next_unblocked_action: `none`",
      "- human_input_required: `false`",
      "- blocked_by: []",
      "",
      "## Human Context",
      "",
      "### Operator Intake Contract",
      "",
      "- Intake surface:",
      "  - `人工只输入：新需求 + 参考治理规范。`",
      "- Fixed receipt:",
      "  - `处理结果：已进入 Blueprint 内部治理。`",
      "  - `当前执行情况：等待版本层收敛。`",
      "  - `人工操作：当前不需要 / 当前需要确认 xxx`",
      "- Default visibility rule:",
      "  - `默认不向人工暴露真值链细节。`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(
    failures.join("\n"),
    /auto_admission_ready=.*true.*(residue candidate|recommendation)/i
  );
});

test("blueprint lint rejects version plans that carry residue routing without the required closure review fields", async () => {
  const repoRoot = createFixtureRepo();
  writeFile(
    repoRoot,
    "docs/blueprints/plans/test-target-plan.md",
    [
      "# Target Plan Title",
      "",
      "## Control Block",
      "",
      "- document_role: `version-governor`",
      "- version_id: `target.test`",
      "- version_status: `open`",
      "- active_phase: `phase.test`",
      "- active_queue: `none`",
      "- decision_state: `promotion-review`",
      "- next_decision: `same-version-admission-or-version-closeout`",
      "- next_action: `write-admission-review`",
      "- resume_gate: `promotion-review`",
      "- promotion_review_result: `none`",
      "- review_subject_id: `none`",
      "- review_subject_classification: `none`",
      "- proposed_queue_id: `none`",
      "- review_basis: `none`",
      "- admission_status: `none`",
      "- intake_status: `none`",
      "- intake_item_id: `none`",
      "- intake_summary: `none`",
      "- intake_result: `none`",
      "- intake_feedback_mode: `none`",
      "- residue_candidate_id: `item.residue`",
      "- residue_candidate_family: `cross-family`",
      "- next_lawful_queue_recommendation: `queue.follow-up`",
      "- auto_admission_ready: `false`",
      "- stop_reason: `none`",
      "- stop_basis: `none`",
      "- next_unblocked_action: `none`",
      "- human_input_required: `false`",
      "- blocked_by: []",
      "",
      "## Human Context",
      "",
      "### Operator Intake Contract",
      "",
      "- Intake surface:",
      "  - `人工只输入：新需求 + 参考治理规范。`",
      "- Fixed receipt:",
      "  - `处理结果：已进入 Blueprint 内部治理。`",
      "  - `当前执行情况：等待版本层收敛。`",
      "  - `人工操作：当前不需要 / 当前需要确认 xxx`",
      "- Default visibility rule:",
      "  - `默认不向人工暴露真值链细节。`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(
    failures.join("\n"),
    /closure routing.*(closure_review_subject|closure_review_status|routing_basis)/i
  );
});

test("blueprint lint rejects version plans whose stop_reason is none but stop fields still claim human input", async () => {
  const repoRoot = createFixtureRepo();
  writeFile(
    repoRoot,
    "docs/blueprints/plans/test-target-plan.md",
    [
      "# Target Plan Title",
      "",
      "## Control Block",
      "",
      "- document_role: `version-governor`",
      "- version_id: `target.test`",
      "- version_status: `open`",
      "- active_phase: `phase.test`",
      "- active_queue: `none`",
      "- decision_state: `promotion-review`",
      "- next_decision: `same-version-admission-or-version-closeout`",
      "- next_action: `return-to-promotion-review`",
      "- resume_gate: `promotion-review`",
      "- promotion_review_result: `none`",
      "- review_subject_id: `none`",
      "- review_subject_classification: `none`",
      "- proposed_queue_id: `none`",
      "- review_basis: `none`",
      "- admission_status: `none`",
      "- intake_status: `none`",
      "- intake_item_id: `none`",
      "- intake_summary: `none`",
      "- intake_result: `none`",
      "- intake_feedback_mode: `none`",
      "- closure_review_subject: `none`",
      "- closure_review_status: `none`",
      "- residue_candidate_id: `none`",
      "- residue_candidate_family: `none`",
      "- routing_basis: `none`",
      "- next_lawful_queue_recommendation: `none`",
      "- auto_admission_ready: `false`",
      "- stop_reason: `none`",
      "- stop_basis: `still waiting for a human answer`",
      "- next_unblocked_action: `write-version-closeout`",
      "- human_input_required: `true`",
      "- blocked_by: []",
      "",
      "## Human Context",
      "",
      "### Operator Intake Contract",
      "",
      "- Intake surface:",
      "  - `浜哄伐鍙緭鍏ワ細鏂伴渶姹?+ 鍙傝€冩不鐞嗚鑼冦€俙",
      "- Fixed receipt:",
      "  - `澶勭悊缁撴灉锛氬凡杩涘叆 Blueprint 鍐呴儴娌荤悊銆俙",
      "  - `褰撳墠鎵ц鎯呭喌锛氱瓑寰呯増鏈眰鏀舵暃銆俙",
      "  - `浜哄伐鎿嶄綔锛氬綋鍓嶄笉闇€瑕?/ 褰撳墠闇€瑕佺‘璁?xxx`",
      "- Default visibility rule:",
      "  - `榛樿涓嶅悜浜哄伐鏆撮湶鐪熷€奸摼缁嗚妭銆俙",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(
    failures.join("\n"),
    /stop_reason=none requires stop_basis=none and human_input_required=false; next_unblocked_action may be non-none only for an explicit active-queue continuation/i
  );
});

test("blueprint lint accepts explicit continuation truth when stop_reason is none and an active queue remains", async () => {
  const {
    repoRoot,
    targetPlanPath,
    activeQueuePath,
  } = createGovernanceFixture({
    activeQueueId: "queue.test-active",
    activeQueuePath: "docs/blueprints/queues/test-active-queue.md",
    queueOwnerField: "belongs_to_version",
    queueStatus: "active",
  });

  writeFile(
    repoRoot,
    targetPlanPath,
    [
      "# Target Plan Title",
      "",
      "## Control Block",
      "",
      "- document_role: `version-governor`",
      "- version_id: `target.test`",
      "- version_status: `open`",
      "- active_phase: `phase.test`",
      "- active_queue: `queue.test-active`",
      "- decision_state: `active-execution`",
      "- next_decision: `queue-closeout-or-return-to-version-review`",
      "- next_action: `resume-active-queue`",
      "- resume_gate: `open-active-queue`",
      "- post_queue_closeout_pause_policy: `auto-continue`",
      "- promotion_review_result: `none`",
      "- review_subject_id: `none`",
      "- review_subject_classification: `none`",
      "- proposed_queue_id: `none`",
      "- review_basis: `none`",
      "- admission_status: `none`",
      "- intake_status: `none`",
      "- intake_item_id: `none`",
      "- intake_summary: `none`",
      "- intake_result: `none`",
      "- intake_feedback_mode: `none`",
      "- closure_review_subject: `none`",
      "- closure_review_status: `none`",
      "- residue_candidate_id: `none`",
      "- residue_candidate_family: `none`",
      "- routing_basis: `none`",
      "- next_lawful_queue_recommendation: `none`",
      "- auto_admission_ready: `false`",
      "- stop_reason: `none`",
      "- stop_basis: `none`",
      "- next_unblocked_action: `continue-task.test-active.execute`",
      "- human_input_required: `false`",
      "- blocked_by: []",
      "",
      ...OPERATOR_INTAKE_CONTRACT_LINES,
      "### Candidate Backlog Refresh Rule",
      "",
      "- `After queue closeout or candidate-routing changes, refresh candidate truth before answering whether any same-version candidate queue remains.`",
      "- `Read project-progress -> blueprint -> current version plan -> candidate_queue_ids -> Candidate Recovery Ledger -> Queue Promotion Ledger -> named queue docs.`",
      "- `Do not answer none unless candidate_backlog_refresh_status=fresh and candidate_backlog_snapshot is empty.`",
      "",
    ].join("\n")
  );

  writeFile(
    repoRoot,
    activeQueuePath,
    [
      "# Queue Title",
      "",
      "## Control Block",
      "",
      "- queue_id: `queue.test-active`",
      "- belongs_to_version: `target.test`",
      "- queue_status: `active`",
      "- queue_class: `required`",
      "- active_task: `task.test-active.execute`",
      "- next_task: `none`",
      "- closeout_status: `in-progress`",
      "- execution_closeout_status: `partial`",
      "- topic_closure_status: `open-residue`",
      "- closure_basis: `Queue remains active during the continuation fixture.`",
      "- residue_remaining: `no`",
      "- residue_family: `none`",
      "- residue_routing_status: `none`",
      "- next_family_candidate: `queue.follow-up`",
      "- auto_continue_eligible: `true`",
      "- next_effect: `keep-active-queue`",
      "- sync_status: `pending`",
      "- sync_scope: `local-record`",
      "- sync_summary: `Fixture queue remains active.`",
      "- blocked_by: []",
      "- allowed_item_classifications:",
      "  - `current-target-item`",
      "- reject_item_classifications:",
      "  - `out-of-scope`",
      "",
      "## Human Context",
      "",
      "### Claim Boundary",
      "",
      "#### Can Claim",
      "",
      "- `ACC-TEST-001: Keep active-queue continuation truth synchronized.`",
      "",
      "#### Cannot Claim",
      "",
      "- `ACC-TEST-002: Final queue closeout.`",
      "",
      "#### Capability Floor",
      "",
      "- `The fixture must keep one active queue and one active task.`",
      "",
      "#### Parent Capability Coverage",
      "",
      "- owned_closure:",
      "  - `none`",
      "- preserved_not_owned:",
      "  - `queue closeout remains later work`",
      "- routed_elsewhere:",
      "  - `none`",
      "",
      "#### User Path Coverage Matrix",
      "",
      "- primary_paths:",
      "  - `Resume active queue execution.`",
      "- alternate_paths:",
      "  - `none`",
      "- leave_return_or_followup_paths:",
      "  - `Continue to the named active task.`",
      "- empty_or_fail_closed_paths:",
      "  - `none`",
      "- rejection_or_error_paths:",
      "  - `none`",
      "- forbidden_regressions:",
      "  - `Do not erase explicit continuation truth.`",
      "",
      "#### Functional Loss Budget",
      "",
      "- budget: `zero`",
      "- loss_accounting_rule:",
      "  - `No continuation truth may be lost.`",
      "",
      "#### Replacement Proof",
      "",
      "- previous_owner_or_path:",
      "  - `Implicit continuation only.`",
      "- new_owner_or_path:",
      "  - `Explicit next_unblocked_action continuation.`",
      "- behavior_preservation_expectation:",
      "  - `Execution still resumes the active task.`",
      "- old_truth_owner_exit_proof:",
      "  - `none`",
      "- verification_evidence:",
      "  - `lint-blueprints acceptance fixture`",
      "",
      "### Queue Snapshot",
      "",
      "- queue_goal: `Keep active-queue continuation explicit.`",
      "- task_count: `1`",
      "- completed_task_count: `0`",
      "- remaining_task_count: `1`",
      "- active_task_summary: `Run the active task from explicit continuation truth.`",
      "- task_briefs:",
      "  - `task.test-active.execute: Continue the active task.`",
      "",
      "### Completion Completeness Review",
      "",
      "- review_status: `in-progress`",
      "- can_claim_coverage:",
      "  - `none`",
      "- parent_spec_preservation:",
      "  - `Preserved.`",
      "- capability_floor_verification:",
      "  - `Pending.`",
      "- out_of_scope_routing:",
      "  - `none`",
      "- verification_sufficiency:",
      "  - `Pending.`",
      "- user_path_matrix_verification:",
      "  - `Pending.`",
      "- functional_loss_audit:",
      "  - `Pending.`",
      "- replacement_proof_summary:",
      "  - `Pending.`",
      "- placeholder_or_legacy_fallback_audit:",
      "  - `none`",
      "- gap_fill_decision:",
      "  - `none`",
      "- gap_fill_scope:",
      "  - `none`",
      "- remaining_gaps:",
      "  - `none`",
      "",
      "### Task Ledger",
      "",
      "| Task ID | State | Summary | Depends On | Notes |",
      "| --- | --- | --- | --- | --- |",
      "| `task.test-active.execute` | `active` | `Continue active execution.` | `none` | `Continuation fixture.` |",
      "",
      "### Task Definitions",
      "",
      "#### `task.test-active.execute`",
      "",
      "##### Control Block",
      "",
      "- task_id: `task.test-active.execute`",
      "- state: `active`",
      "- task_kind: `execution`",
      "- scope:",
      "  - `docs/blueprints/queues/test-active-queue.md`",
      "- must_inspect:",
      "  - `docs/blueprints/queues/test-active-queue.md`",
      "- must_not_change:",
      "  - `historical evidence`",
      "- done_when:",
      "  - `The continuation fixture remains valid.`",
      "- verify_with:",
      "  - `npm run lint:blueprints`",
      "- if_blocked:",
      "  - `Record the blocker in the queue doc.`",
      "- promote_next_if_done: `none`",
      "- stop_if:",
      "  - `none`",
      "",
      "##### Human Context",
      "",
      "- task_brief:",
      "  - `Continue the active task.`",
      "- task_outcome_summary:",
      "  - `The active task remains resumable.`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.deepEqual(failures, []);
});

test("blueprint lint rejects version plans whose non-none stop_reason lacks structured stop truth", async () => {
  const repoRoot = createFixtureRepo();
  writeFile(
    repoRoot,
    "docs/blueprints/plans/test-target-plan.md",
    [
      "# Target Plan Title",
      "",
      "## Control Block",
      "",
      "- document_role: `version-governor`",
      "- version_id: `target.test`",
      "- version_status: `open`",
      "- active_phase: `phase.test`",
      "- active_queue: `none`",
      "- decision_state: `promotion-review`",
      "- next_decision: `version-closeout`",
      "- next_action: `write-version-closeout`",
      "- resume_gate: `promotion-review`",
      "- promotion_review_result: `closeout-ready`",
      "- review_subject_id: `none`",
      "- review_subject_classification: `none`",
      "- proposed_queue_id: `none`",
      "- review_basis: `all acceptance covered`",
      "- admission_status: `none`",
      "- intake_status: `none`",
      "- intake_item_id: `none`",
      "- intake_summary: `none`",
      "- intake_result: `none`",
      "- intake_feedback_mode: `none`",
      "- closure_review_subject: `target.test`",
      "- closure_review_status: `routed`",
      "- residue_candidate_id: `none`",
      "- residue_candidate_family: `none`",
      "- routing_basis: `ready for closeout confirmation`",
      "- next_lawful_queue_recommendation: `none`",
      "- auto_admission_ready: `false`",
      "- stop_reason: `version-closeout-confirmation`",
      "- stop_basis: `none`",
      "- next_unblocked_action: `none`",
      "- human_input_required: `false`",
      "- blocked_by: []",
      "",
      "## Human Context",
      "",
      "### Operator Intake Contract",
      "",
      "- Intake surface:",
      "  - `浜哄伐鍙緭鍏ワ細鏂伴渶姹?+ 鍙傝€冩不鐞嗚鑼冦€俙",
      "- Fixed receipt:",
      "  - `澶勭悊缁撴灉锛氬凡杩涘叆 Blueprint 鍐呴儴娌荤悊銆俙",
      "  - `褰撳墠鎵ц鎯呭喌锛氱瓑寰呯増鏈眰鏀舵暃銆俙",
      "  - `浜哄伐鎿嶄綔锛氬綋鍓嶄笉闇€瑕?/ 褰撳墠闇€瑕佺‘璁?xxx`",
      "- Default visibility rule:",
      "  - `榛樿涓嶅悜浜哄伐鏆撮湶鐪熷€奸摼缁嗚妭銆俙",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(
    failures.join("\n"),
    /stop_reason=version-closeout-confirmation requires stop_basis, next_unblocked_action, and human_input_required=true/i
  );
});

test("blueprint lint accepts operator-requested version suspension when structured stop truth is complete", async () => {
  const repoRoot = createFixtureRepo();
  writeFile(
    repoRoot,
    "docs/blueprints/plans/test-target-plan.md",
    [
      "# Target Plan Title",
      "",
      "## Control Block",
      "",
      "- document_role: `version-governor`",
      "- version_id: `target.test`",
      "- version_status: `open`",
      "- active_phase: `phase.test`",
      "- active_queue: `none`",
      "- decision_state: `promotion-review`",
      "- next_decision: `same-version-admission-or-version-closeout`",
      "- next_action: `return-to-promotion-review`",
      "- resume_gate: `promotion-review`",
      "- post_queue_closeout_pause_policy: `auto-continue`",
      "- promotion_review_result: `none`",
      "- review_subject_id: `none`",
      "- review_subject_classification: `none`",
      "- proposed_queue_id: `none`",
      "- review_basis: `none`",
      "- admission_status: `none`",
      "- intake_status: `none`",
      "- intake_item_id: `none`",
      "- intake_summary: `none`",
      "- intake_result: `none`",
      "- intake_feedback_mode: `none`",
      "- closure_review_subject: `none`",
      "- closure_review_status: `none`",
      "- residue_candidate_id: `none`",
      "- residue_candidate_family: `none`",
      "- routing_basis: `none`",
      "- next_lawful_queue_recommendation: `none`",
      "- auto_admission_ready: `false`",
      "- stop_reason: `operator-requested-suspend`",
      "- stop_basis: `The operator explicitly requested suspending the current version.`",
      "- next_unblocked_action: `return-to-promotion-review`",
      "- human_input_required: `false`",
      "- blocked_by: []",
      "- candidate_queue_ids:",
      "",
      ...OPERATOR_INTAKE_CONTRACT_LINES,
      "### Candidate Backlog Refresh Rule",
      "",
      "- `After queue closeout or candidate-routing changes, refresh candidate truth before answering whether any same-version candidate queue remains.`",
      "- `Read project-progress -> blueprint -> current version plan -> candidate_queue_ids -> Candidate Recovery Ledger -> Queue Promotion Ledger -> named queue docs.`",
      "- `Do not answer none unless candidate_backlog_refresh_status=fresh and candidate_backlog_snapshot is empty.`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.doesNotMatch(
    failures.join("\n"),
    /operator-requested-suspend requires stop_basis, next_unblocked_action, and human_input_required=false/i
  );
});

test("blueprint lint accepts suspended queue status when no live active task remains", async () => {
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
      "- belongs_to_version: `target.test`",
      "- queue_status: `suspended`",
      "- queue_class: `required`",
      "- active_task: `none`",
      "- next_task: `task.test`",
      "- closeout_status: `in-progress`",
      "- next_effect: `return-to-version-review`",
      "- sync_status: `pending`",
      "- sync_scope: `local-record`",
      "- sync_summary: `Queue suspended by explicit operator request after governance truth was written.`",
      "- blocked_by: []",
      "- allowed_item_classifications:",
      "  - `current-target-item`",
      "- reject_item_classifications:",
      "  - `out-of-scope`",
      "",
      "## Human Context",
      "",
      "### Queue Snapshot",
      "",
      "- queue_goal: `Keep the queue available for later resumption.`",
      "- task_count: `1`",
      "- completed_task_count: `0`",
      "- remaining_task_count: `1`",
      "- active_task_summary: `Queue is suspended by explicit operator request.`",
      "- task_briefs:",
      "  - `task.test: Resume when the operator reopens the queue.`",
      "",
      "### Task Ledger",
      "",
      "| Task ID | State | Summary | Depends On | Notes |",
      "| --- | --- | --- | --- | --- |",
      "| `task.test` | `queued` | `Resume when the operator reopens the queue.` | `none` | `Suspended queue fixture.` |",
      "",
      "### Task Definitions",
      "",
      "#### `task.test`",
      "",
      "##### Control Block",
      "",
      "- task_id: `task.test`",
      "- state: `queued`",
      "- task_kind: `execution`",
      "- scope:",
      "  - `docs/blueprints/queues/test-queue.md`",
      "- must_inspect:",
      "  - `docs/blueprints/queues/test-queue.md`",
      "- must_not_change:",
      "  - `historical evidence`",
      "- done_when:",
      "  - `The operator resumes or drops the queue.`",
      "- verify_with:",
      "  - `npm run lint:blueprints`",
      "- if_blocked:",
      "  - `Record the blocker in the queue doc.`",
      "- promote_next_if_done: `none`",
      "- stop_if:",
      "  - `none`",
      "",
      "##### Human Context",
      "",
      "- task_brief:",
      "  - `Resume the queue later.`",
      "- task_outcome_summary:",
      "  - `The queue remains suspended until reopened.`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.doesNotMatch(failures.join("\n"), /queue_status=suspended is not an allowed queue status/i);
  assert.doesNotMatch(failures.join("\n"), /queue must not keep active_task=.*while queue_status=suspended/i);
});

test("blueprint lint rejects open version plans that omit Candidate Backlog Refresh Rule", async () => {
  const { repoRoot, targetPlanPath } = createGovernanceFixture({
    activeQueueId: "none",
  });
  const planPath = path.join(repoRoot, ...targetPlanPath.split("/"));
  const text = fs.readFileSync(planPath, "utf8").replace(
    /\r?\n### Candidate Backlog Refresh Rule[\s\S]*$/m,
    "\n"
  );
  fs.writeFileSync(planPath, text, "utf8");

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(
    failures.join("\n"),
    /open must include a Candidate Backlog Refresh Rule section/i
  );
});

test("blueprint lint rejects active-version claim-boundary queues that omit anti-over-narrowing structure", async () => {
  const { repoRoot } = createGovernanceFixture();
  writeFile(
    repoRoot,
    "docs/blueprints/queues/test-active-queue.md",
    [
      "# Queue Title",
      "",
      "## Control Block",
      "",
      "- queue_id: `queue.test-active`",
      "- belongs_to_version: `target.test`",
      "- queue_status: `active`",
      "- queue_class: `required`",
      "- active_task: `task.test`",
      "- next_task: `none`",
      "- closeout_status: `in-progress`",
      "- next_effect: `none`",
      "- sync_status: `pending`",
      "- sync_scope: `none`",
      "- sync_summary: `none`",
      "- blocked_by: []",
      "- allowed_item_classifications:",
      "  - `current-target-item`",
      "- reject_item_classifications:",
      "  - `out-of-scope`",
      "",
      "## Human Context",
      "",
      "### Claim Boundary",
      "",
      "#### Can Claim",
      "",
      "- `ACC-TEST-001: Keep one bounded acceptance.`",
      "",
      "#### Cannot Claim",
      "",
      "- `ACC-TEST-002: Leave other capability to another queue.`",
      "",
      "### Queue Snapshot",
      "",
      "- queue_goal: `Keep the queue active.`",
      "- task_count: `1`",
      "- completed_task_count: `0`",
      "- remaining_task_count: `1`",
      "- active_task_summary: `Run the current task.`",
      "- task_briefs:",
      "  - `task.test: Run the current task.`",
      "",
      "### Task Ledger",
      "",
      "| Task ID | State | Summary | Depends On | Notes |",
      "| --- | --- | --- | --- | --- |",
      "| `task.test` | `active` | `Run the current task.` | `none` | `Current task.` |",
      "",
      "### Task Definitions",
      "",
      "#### `task.test`",
      "",
      "##### Control Block",
      "",
      "- task_id: `task.test`",
      "- state: `active`",
      "- task_kind: `execution`",
      "- scope:",
      "  - `docs/blueprints/queues/test-active-queue.md`",
      "- must_inspect:",
      "  - `docs/blueprints/queues/test-active-queue.md`",
      "- must_not_change:",
      "  - `historical evidence`",
      "- done_when:",
      "  - `Queue shell is synchronized.`",
      "- verify_with:",
      "  - `npm run lint:blueprints`",
      "- if_blocked:",
      "  - `Record the blocker in the queue doc.`",
      "- promote_next_if_done: `none`",
      "- stop_if:",
      "  - `none`",
      "",
      "##### Human Context",
      "",
      "- task_brief:",
      "  - `Run the current task.`",
      "- task_outcome_summary:",
      "  - `The queue shell stays synchronized.`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /Capability Floor/i);
  assert.match(failures.join("\n"), /User Path Coverage Matrix/i);
  assert.match(failures.join("\n"), /functional_loss_audit/i);
  assert.match(failures.join("\n"), /previous_owner_or_path/i);
});
