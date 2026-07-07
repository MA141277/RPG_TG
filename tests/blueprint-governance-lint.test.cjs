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
  fs.mkdirSync(path.join(repoRoot, "docs", "blueprints", "targets"), { recursive: true });
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

function createV1FixtureRepo() {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "rpg-tg-blueprint-v1-lint-"));
  fs.mkdirSync(path.join(repoRoot, "docs", "blueprints", "specs"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "docs", "blueprints", "plans"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "docs", "blueprints", "targets"), { recursive: true });
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
      "- active_target_file: `docs/blueprints/targets/test-target-v1.md`",
      "- classification_rules_ref: `docs/blueprints/classification-rule-layer-spec.md`",
      "- execution_mode: `single-active-task`",
      "- allow_parallel: `false`",
      "",
    ].join("\n")
  );

  writeFile(
    repoRoot,
    "docs/blueprints/targets/test-target-v1.md",
    [
      "# Test Target v1",
      "",
      "## Control Block",
      "",
      "- target_id: `target.test`",
      "- version_goal: `Close the remaining target gap with minimal live truth.`",
      "- acceptance_criteria:",
      "  - `required evidence remains satisfied`",
      "- in_scope:",
      "  - `current target work only`",
      "- out_of_scope:",
      "  - `new target creation`",
      "- execution_queue: `none`",
      "- candidate_queues:",
      "  - candidate_id: `queue.test`",
      "    state: `candidate`",
      "    goal: `Activate only when current evidence proves a blocker.`",
      "    entry_conditions: `fresh blocker proven`",
      "    artifacts_needed:",
      "      - `artifact.current-gap-proof`",
      "    drop_if: `blocker disproved or absorbed into target truth`",
      "    on_failure: `absorb-into-target`",
      "- transition_queue:",
      "  - queue_id: `none`",
      "  - state: `none`",
      "  - binds_candidates: []",
      "  - trigger_basis: []",
      "  - minimal_scope: []",
      "- absorb_resolution:",
      "  - source_queue: `none`",
      "  - failure_scope: `none`",
      "  - resolution_kind: `none`",
      "  - resolution_target: `none`",
      "- constraints:",
      "  - `Only one execution queue may be active at a time.`",
      "- artifact_rules:",
      "  - artifact_id: `artifact.current-gap-proof`",
      "    required_for:",
      "      - `queue.test`",
      "    transition_allowed_when_missing: `false`",
      "    rule: `Candidate activates directly only when current blocker proof exists.`",
      "- done_when:",
      "  - `execution_queue = none`",
      "  - `no candidate has a proven entry_conditions match`",
      "- closeout_condition:",
      "  - `close only when done_when is satisfied`",
      "- decision_required: `none`",
      "",
    ].join("\n")
  );

  writeFile(
    repoRoot,
    "docs/blueprints/plans/test-target-plan.md",
    [
      "# Target Plan Compatibility Shell",
      "",
      "## Compatibility Pointer",
      "",
      "- v1 live target owner:",
      "  - `docs/blueprints/targets/test-target-v1.md`",
      "- Compatibility role:",
      "  - `Legacy shell only.`",
      "",
    ].join("\n")
  );

  writeFile(
    repoRoot,
    "docs/blueprints/specs/test-target.md",
    [
      "# Target Compatibility Shell",
      "",
      "## Control Block",
      "",
      "- target_id: `target.test`",
      "- version_label: `v1`",
      "- closeout_contract_version: `v1`",
      "",
      "## Human Context",
      "",
      "### Compatibility Pointer",
      "",
      "- v1 live target owner:",
      "  - `docs/blueprints/targets/test-target-v1.md`",
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

test("blueprint lint rejects project-progress fields that mirror downstream v1 truth", async () => {
  const repoRoot = createV1FixtureRepo();
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
      "- execution_queue: `queue.test`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /project-progress.*downstream truth field "execution_queue"/i);
});

test("blueprint lint requires project-progress to point at blueprint.md for recovery", async () => {
  const repoRoot = createV1FixtureRepo();
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
      "- next_file: `docs/blueprints/targets/test-target-v1.md`",
      "- entry_action: `open-next-file`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /next_file must point to docs\/blueprints\/blueprint\.md/i);
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

test("blueprint lint accepts a v1 target owner referenced by active_target_file", async () => {
  const repoRoot = createV1FixtureRepo();
  const { lintBlueprintDocs } = await loadBlueprintLintModule();

  const failures = lintBlueprintDocs(repoRoot);

  assert.deepEqual(failures, []);
});

test("blueprint lint rejects active_target_plan when active_target_file already exists", async () => {
  const repoRoot = createV1FixtureRepo();
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
      "- active_target_file: `docs/blueprints/targets/test-target-v1.md`",
      "- active_target_plan: `docs/blueprints/plans/test-target-plan.md`",
      "- classification_rules_ref: `docs/blueprints/classification-rule-layer-spec.md`",
      "- execution_mode: `single-active-task`",
      "- allow_parallel: `false`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /active_target_plan.*active_target_file/i);
});

test("blueprint lint rejects blueprint fields that mirror target-level execution truth", async () => {
  const repoRoot = createV1FixtureRepo();
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
      "- active_target_file: `docs/blueprints/targets/test-target-v1.md`",
      "- classification_rules_ref: `docs/blueprints/classification-rule-layer-spec.md`",
      "- execution_mode: `single-active-task`",
      "- allow_parallel: `false`",
      "- execution_queue: `queue.test`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /blueprint must not own downstream truth field "execution_queue"/i);
});

test("blueprint lint rejects queue docs that still reference target plan/spec once a v1 target owner exists", async () => {
  const repoRoot = createV1FixtureRepo();
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
      "### Parent Target",
      "",
      "- Target plan:",
      "  - `docs/blueprints/plans/test-target-plan.md`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /queue doc must reference the v1 target owner instead of target plan\/spec/i);
});

test("blueprint lint accepts minimal legacy spec and plan shells when a v1 target owner exists", async () => {
  const repoRoot = createV1FixtureRepo();
  writeFile(
    repoRoot,
    "docs/blueprints/specs/test-target.md",
    [
      "# Target Compatibility Shell",
      "",
      "## Control Block",
      "",
      "- target_id: `target.test`",
      "- version_label: `v1-compat`",
      "- closeout_contract_version: `v1`",
      "",
      "## Human Context",
      "",
      "### Compatibility Pointer",
      "",
      "- v1 live target owner:",
      "  - `docs/blueprints/targets/test-target-v1.md`",
      "",
    ].join("\n")
  );
  writeFile(
    repoRoot,
    "docs/blueprints/plans/test-target-plan.md",
    [
      "# Target Plan Compatibility Shell",
      "",
      "## Human Context",
      "",
      "### Compatibility Pointer",
      "",
      "- v1 live target owner:",
      "  - `docs/blueprints/targets/test-target-v1.md`",
      "- Compatibility role:",
      "  - `Legacy shell only.`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.deepEqual(failures, []);
});

test("blueprint lint rejects v1 targets that keep legacy candidate field names", async () => {
  const repoRoot = createV1FixtureRepo();
  writeFile(
    repoRoot,
    "docs/blueprints/targets/test-target-v1.md",
    [
      "# Test Target v1",
      "",
      "## Control Block",
      "",
      "- target_id: `target.test`",
      "- version_goal: `Close the remaining target gap with minimal live truth.`",
      "- acceptance_criteria:",
      "  - `required evidence remains satisfied`",
      "- in_scope:",
      "  - `current target work only`",
      "- out_of_scope:",
      "  - `new target creation`",
      "- execution_queue: `none`",
      "- candidate_queues:",
      "  - candidate_id: `queue.test`",
      "    state: `candidate`",
      "    goal: `Activate only when current evidence proves a blocker.`",
      "    activation_condition: `fresh blocker proven`",
      "    artifacts_needed:",
      "      - `artifact.current-gap-proof`",
      "    fallback_on_failure: `absorb-into-target`",
      "- transition_queue:",
      "  - queue_id: `none`",
      "  - state: `none`",
      "  - binds_candidates: []",
      "  - trigger_basis: []",
      "  - minimal_scope: []",
      "- constraints:",
      "  - `Only one execution queue may be active at a time.`",
      "- artifact_rules:",
      "  - artifact_id: `artifact.current-gap-proof`",
      "    required_for:",
      "      - `queue.test`",
      "    transition_allowed_when_missing: `false`",
      "    rule: `Candidate activates directly only when current blocker proof exists.`",
      "- done_when:",
      "  - `execution_queue = none`",
      "- closeout_condition:",
      "  - `close only when done_when is satisfied`",
      "- decision_required: `none`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /legacy candidate\/task field "activation_condition"/i);
  assert.match(failures.join("\n"), /legacy candidate\/task field "fallback_on_failure"/i);
  assert.match(failures.join("\n"), /candidate queue\.test missing required field drop_if/i);
  assert.match(failures.join("\n"), /candidate queue\.test missing required field on_failure/i);
});

test("blueprint lint rejects v1 targets with an active candidate but no execution_queue", async () => {
  const repoRoot = createV1FixtureRepo();
  writeFile(
    repoRoot,
    "docs/blueprints/targets/test-target-v1.md",
    [
      "# Test Target v1",
      "",
      "## Control Block",
      "",
      "- target_id: `target.test`",
      "- version_goal: `Close the remaining target gap with minimal live truth.`",
      "- acceptance_criteria:",
      "  - `required evidence remains satisfied`",
      "- in_scope:",
      "  - `current target work only`",
      "- out_of_scope:",
      "  - `new target creation`",
      "- execution_queue: `none`",
      "- candidate_queues:",
      "  - candidate_id: `queue.test`",
      "    state: `active`",
      "    goal: `Activate only when current evidence proves a blocker.`",
      "    entry_conditions: `fresh blocker proven`",
      "    artifacts_needed:",
      "      - `artifact.current-gap-proof`",
      "    drop_if: `blocker disproved or absorbed into target truth`",
      "    on_failure: `absorb-into-target`",
      "- transition_queue:",
      "  - queue_id: `none`",
      "  - state: `none`",
      "  - binds_candidates: []",
      "  - trigger_basis: []",
      "  - minimal_scope: []",
      "- constraints:",
      "  - `Only one execution queue may be active at a time.`",
      "- artifact_rules:",
      "  - artifact_id: `artifact.current-gap-proof`",
      "    required_for:",
      "      - `queue.test`",
      "    transition_allowed_when_missing: `false`",
      "    rule: `Candidate activates directly only when current blocker proof exists.`",
      "- done_when:",
      "  - `execution_queue = none`",
      "- closeout_condition:",
      "  - `close only when done_when is satisfied`",
      "- decision_required: `none`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /execution_queue=none.*candidate.*state=active/i);
});

test("blueprint lint rejects transition queues that are not bound to explicit candidates", async () => {
  const repoRoot = createV1FixtureRepo();
  writeFile(
    repoRoot,
    "docs/blueprints/targets/test-target-v1.md",
    [
      "# Test Target v1",
      "",
      "## Control Block",
      "",
      "- target_id: `target.test`",
      "- version_goal: `Close the remaining target gap with minimal live truth.`",
      "- acceptance_criteria:",
      "  - `required evidence remains satisfied`",
      "- in_scope:",
      "  - `current target work only`",
      "- out_of_scope:",
      "  - `new target creation`",
      "- execution_queue: `none`",
      "- candidate_queues:",
      "  - candidate_id: `queue.test`",
      "    state: `candidate`",
      "    goal: `Activate only when current evidence proves a blocker.`",
      "    entry_conditions: `fresh blocker proven`",
      "    artifacts_needed:",
      "      - `artifact.current-gap-proof`",
      "    drop_if: `blocker disproved or absorbed into target truth`",
      "    on_failure: `absorb-into-target`",
      "- transition_queue:",
      "  - queue_id: `queue.transition`",
      "  - state: `prepared`",
      "  - binds_candidates: []",
      "  - trigger_basis:",
      "    - `artifact.current-gap-proof missing`",
      "  - minimal_scope:",
      "    - `produce one bridge artifact`",
      "- constraints:",
      "  - `Only one execution queue may be active at a time.`",
      "- artifact_rules:",
      "  - artifact_id: `artifact.current-gap-proof`",
      "    required_for:",
      "      - `queue.test`",
      "    transition_allowed_when_missing: `true`",
      "    rule: `Transition allowed only when one bridge artifact would make the candidate executable.`",
      "- done_when:",
      "  - `execution_queue = none`",
      "- closeout_condition:",
      "  - `close only when done_when is satisfied`",
      "- decision_required: `none`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /transition queue.*bind/i);
});

test("blueprint lint rejects transition queues that bind unknown candidates", async () => {
  const repoRoot = createV1FixtureRepo();
  writeFile(
    repoRoot,
    "docs/blueprints/targets/test-target-v1.md",
    [
      "# Test Target v1",
      "",
      "## Control Block",
      "",
      "- target_id: `target.test`",
      "- version_goal: `Close the remaining target gap with minimal live truth.`",
      "- acceptance_criteria:",
      "  - `required evidence remains satisfied`",
      "- in_scope:",
      "  - `current target work only`",
      "- out_of_scope:",
      "  - `new target creation`",
      "- execution_queue: `none`",
      "- candidate_queues:",
      "  - candidate_id: `queue.test`",
      "    state: `prepared`",
      "    goal: `Activate only when current evidence proves a blocker.`",
      "    entry_conditions: `fresh blocker proven`",
      "    artifacts_needed:",
      "      - `artifact.current-gap-proof`",
      "    drop_if: `blocker disproved or absorbed into target truth`",
      "    on_failure: `absorb-into-target`",
      "- transition_queue:",
      "  - queue_id: `queue.transition`",
      "  - state: `prepared`",
      "  - binds_candidates:",
      "    - `queue.unknown`",
      "  - trigger_basis:",
      "    - `artifact.current-gap-proof missing`",
      "  - minimal_scope:",
      "    - `produce one bridge artifact`",
      "- constraints:",
      "  - `Only one execution queue may be active at a time.`",
      "- artifact_rules:",
      "  - artifact_id: `artifact.current-gap-proof`",
      "    required_for:",
      "      - `queue.test`",
      "    transition_allowed_when_missing: `true`",
      "    rule: `Transition allowed only when one bridge artifact would make the candidate executable.`",
      "- done_when:",
      "  - `execution_queue = none`",
      "- closeout_condition:",
      "  - `close only when done_when is satisfied`",
      "- decision_required: `none`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /transition queue must bind only candidate ids that already exist/i);
});

test("blueprint lint rejects execution_queue values that have no active candidate or active transition backing", async () => {
  const repoRoot = createV1FixtureRepo();
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
    "docs/blueprints/targets/test-target-v1.md",
    [
      "# Test Target v1",
      "",
      "## Control Block",
      "",
      "- target_id: `target.test`",
      "- version_goal: `Close the remaining target gap with minimal live truth.`",
      "- acceptance_criteria:",
      "  - `required evidence remains satisfied`",
      "- in_scope:",
      "  - `current target work only`",
      "- out_of_scope:",
      "  - `new target creation`",
      "- execution_queue: `queue.test`",
      "- candidate_queues:",
      "  - candidate_id: `queue.test`",
      "    state: `prepared`",
      "    goal: `Activate only when current evidence proves a blocker.`",
      "    entry_conditions: `fresh blocker proven`",
      "    artifacts_needed:",
      "      - `artifact.current-gap-proof`",
      "    drop_if: `blocker disproved or absorbed into target truth`",
      "    on_failure: `absorb-into-target`",
      "- transition_queue:",
      "  - queue_id: `none`",
      "  - state: `none`",
      "  - binds_candidates: []",
      "  - trigger_basis: []",
      "  - minimal_scope: []",
      "- constraints:",
      "  - `Only one execution queue may be active at a time.`",
      "- artifact_rules:",
      "  - artifact_id: `artifact.current-gap-proof`",
      "    required_for:",
      "      - `queue.test`",
      "    transition_allowed_when_missing: `false`",
      "    rule: `Candidate activates directly only when current blocker proof exists.`",
      "- done_when:",
      "  - `execution_queue = none`",
      "- closeout_condition:",
      "  - `close only when done_when is satisfied`",
      "- decision_required: `none`",
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

  assert.match(failures.join("\n"), /must be backed by one active candidate or one active transition queue/i);
});

test("blueprint lint accepts v1 queue closeout escalation when non-owner verification failure is absorbed by target", async () => {
  const repoRoot = createV1FixtureRepo();
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
    "docs/blueprints/targets/test-target-v1.md",
    [
      "# Test Target v1",
      "",
      "## Control Block",
      "",
      "- target_id: `target.test`",
      "- version_goal: `Close the remaining target gap with minimal live truth.`",
      "- acceptance_criteria:",
      "  - `required evidence remains satisfied`",
      "- in_scope:",
      "  - `current target work only`",
      "- out_of_scope:",
      "  - `new target creation`",
      "- execution_queue: `none`",
      "- candidate_queues:",
      "  - candidate_id: `queue.repo-regression-follow-up`",
      "    state: `candidate`",
      "    goal: `Absorb a repository/global verification blocker after the current queue goal is already satisfied.`",
      "    entry_conditions: `target has absorbed a conservative repository/global verification blocker`",
      "    artifacts_needed:",
      "      - `artifact.non-owner-verify-failure`",
      "    drop_if: `fresh evidence proves the blocker belongs to the original queue after all`",
      "    on_failure: `absorb-into-target`",
      "- transition_queue:",
      "  - queue_id: `none`",
      "  - state: `none`",
      "  - binds_candidates: []",
      "  - trigger_basis: []",
      "  - minimal_scope: []",
      "- absorb_resolution:",
      "  - source_queue: `queue.test`",
      "  - failure_scope: `repository/global`",
      "  - resolution_kind: `new-candidate`",
      "  - resolution_target: `queue.repo-regression-follow-up`",
      "- constraints:",
      "  - `Only one execution queue may be active at a time.`",
      "  - `A non-owner verification failure must be absorbed into target-owned follow-up work and must not remain on the original queue closeout.`",
      "- artifact_rules:",
      "  - artifact_id: `artifact.current-gap-proof`",
      "    required_for:",
      "      - `queue.test`",
      "    transition_allowed_when_missing: `false`",
      "    rule: `Candidate activates directly only when current blocker proof exists.`",
      "  - artifact_id: `artifact.non-owner-verify-failure`",
      "    required_for:",
      "      - `queue.repo-regression-follow-up`",
      "    transition_allowed_when_missing: `true`",
      "    rule: `If a conservative repository/global verification blocker cannot be reasonably assigned to the current queue bounded goal, owner scope, or direct edit surface, target must absorb it as a candidate rewrite, a new candidate, or one unique necessary transition queue.`",
      "- done_when:",
      "  - `execution_queue = none`",
      "- closeout_condition:",
      "  - `close only when done_when is satisfied`",
      "- decision_required: `none`",
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
      "- goal_status: `satisfied`",
      "- failure_owner_scope: `repository/global`",
      "- closeout_status: `escalated-to-target`",
      "- next_effect: `absorb-into-target`",
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

test("blueprint lint rejects blocked closeout when a non-owner verification failure should escalate to target", async () => {
  const repoRoot = createV1FixtureRepo();
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
    "docs/blueprints/targets/test-target-v1.md",
    [
      "# Test Target v1",
      "",
      "## Control Block",
      "",
      "- target_id: `target.test`",
      "- version_goal: `Close the remaining target gap with minimal live truth.`",
      "- acceptance_criteria:",
      "  - `required evidence remains satisfied`",
      "- in_scope:",
      "  - `current target work only`",
      "- out_of_scope:",
      "  - `new target creation`",
      "- execution_queue: `none`",
      "- candidate_queues:",
      "  - candidate_id: `queue.repo-regression-follow-up`",
      "    state: `candidate`",
      "    goal: `Absorb a repository/global verification blocker after the current queue goal is already satisfied.`",
      "    entry_conditions: `target has absorbed a conservative repository/global verification blocker`",
      "    artifacts_needed:",
      "      - `artifact.non-owner-verify-failure`",
      "    drop_if: `fresh evidence proves the blocker belongs to the original queue after all`",
      "    on_failure: `absorb-into-target`",
      "- transition_queue:",
      "  - queue_id: `none`",
      "  - state: `none`",
      "  - binds_candidates: []",
      "  - trigger_basis: []",
      "  - minimal_scope: []",
      "- absorb_resolution:",
      "  - source_queue: `queue.test`",
      "  - failure_scope: `repository/global`",
      "  - resolution_kind: `new-candidate`",
      "  - resolution_target: `queue.repo-regression-follow-up`",
      "- constraints:",
      "  - `Only one execution queue may be active at a time.`",
      "- artifact_rules:",
      "  - artifact_id: `artifact.current-gap-proof`",
      "    required_for:",
      "      - `queue.test`",
      "    transition_allowed_when_missing: `false`",
      "    rule: `Candidate activates directly only when current blocker proof exists.`",
      "- done_when:",
      "  - `execution_queue = none`",
      "- closeout_condition:",
      "  - `close only when done_when is satisfied`",
      "- decision_required: `none`",
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
      "- goal_status: `satisfied`",
      "- failure_owner_scope: `repository/global`",
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

  assert.match(
    failures.join("\n"),
    /non-owner verification failure must not remain attached to queue closeout as blocked/i
  );
});

test("blueprint lint rejects non-owner verification failures that are not absorbed into target", async () => {
  const repoRoot = createV1FixtureRepo();
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
    "docs/blueprints/targets/test-target-v1.md",
    [
      "# Test Target v1",
      "",
      "## Control Block",
      "",
      "- target_id: `target.test`",
      "- version_goal: `Close the remaining target gap with minimal live truth.`",
      "- acceptance_criteria:",
      "  - `required evidence remains satisfied`",
      "- in_scope:",
      "  - `current target work only`",
      "- out_of_scope:",
      "  - `new target creation`",
      "- execution_queue: `none`",
      "- candidate_queues:",
      "  - candidate_id: `queue.repo-regression-follow-up`",
      "    state: `candidate`",
      "    goal: `Absorb a repository/global verification blocker after the current queue goal is already satisfied.`",
      "    entry_conditions: `target has absorbed a conservative repository/global verification blocker`",
      "    artifacts_needed:",
      "      - `artifact.non-owner-verify-failure`",
      "    drop_if: `fresh evidence proves the blocker belongs to the original queue after all`",
      "    on_failure: `absorb-into-target`",
      "- transition_queue:",
      "  - queue_id: `none`",
      "  - state: `none`",
      "  - binds_candidates: []",
      "  - trigger_basis: []",
      "  - minimal_scope: []",
      "- absorb_resolution:",
      "  - source_queue: `queue.test`",
      "  - failure_scope: `repository/global`",
      "  - resolution_kind: `new-candidate`",
      "  - resolution_target: `queue.repo-regression-follow-up`",
      "- constraints:",
      "  - `Only one execution queue may be active at a time.`",
      "- artifact_rules:",
      "  - artifact_id: `artifact.current-gap-proof`",
      "    required_for:",
      "      - `queue.test`",
      "    transition_allowed_when_missing: `false`",
      "    rule: `Candidate activates directly only when current blocker proof exists.`",
      "- done_when:",
      "  - `execution_queue = none`",
      "- closeout_condition:",
      "  - `close only when done_when is satisfied`",
      "- decision_required: `none`",
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
      "- goal_status: `satisfied`",
      "- failure_owner_scope: `repository/global`",
      "- closeout_status: `escalated-to-target`",
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

  assert.match(
    failures.join("\n"),
    /non-owner verification failure must use next_effect=absorb-into-target/i
  );
});

test("blueprint lint rejects absorb_resolution that does not record one legal target-owned path", async () => {
  const repoRoot = createV1FixtureRepo();
  writeFile(
    repoRoot,
    "docs/blueprints/targets/test-target-v1.md",
    [
      "# Test Target v1",
      "",
      "## Control Block",
      "",
      "- target_id: `target.test`",
      "- version_goal: `Close the remaining target gap with minimal live truth.`",
      "- acceptance_criteria:",
      "  - `required evidence remains satisfied`",
      "- in_scope:",
      "  - `current target work only`",
      "- out_of_scope:",
      "  - `new target creation`",
      "- execution_queue: `none`",
      "- candidate_queues:",
      "  - candidate_id: `queue.repo-regression-follow-up`",
      "    state: `candidate`",
      "    goal: `Absorb a repository/global verification blocker after the current queue goal is already satisfied.`",
      "    entry_conditions: `target has absorbed a conservative repository/global verification blocker`",
      "    artifacts_needed:",
      "      - `artifact.non-owner-verify-failure`",
      "    drop_if: `fresh evidence proves the blocker belongs to the original queue after all`",
      "    on_failure: `absorb-into-target`",
      "- transition_queue:",
      "  - queue_id: `none`",
      "  - state: `none`",
      "  - binds_candidates: []",
      "  - trigger_basis: []",
      "  - minimal_scope: []",
      "- absorb_resolution:",
      "  - source_queue: `queue.test`",
      "  - failure_scope: `repository/global`",
      "  - resolution_kind: `none`",
      "  - resolution_target: `none`",
      "- constraints:",
      "  - `Only one execution queue may be active at a time.`",
      "- artifact_rules:",
      "  - artifact_id: `artifact.non-owner-verify-failure`",
      "    required_for:",
      "      - `queue.repo-regression-follow-up`",
      "    transition_allowed_when_missing: `true`",
      "    rule: `If conservative verification shows the failure cannot be reasonably assigned to the current queue bounded goal, owner scope, or direct edit surface, target must absorb it into target-owned follow-up work as a candidate rewrite, a new candidate, or one unique necessary transition queue.`",
      "- done_when:",
      "  - `execution_queue = none`",
      "- closeout_condition:",
      "  - `close only when done_when is satisfied`",
      "- decision_required: `none`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /absorb_resolution must record one legal target-owned path/i);
});

test("blueprint lint rejects escalated queues that are not in the unified terminal state", async () => {
  const repoRoot = createV1FixtureRepo();
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
      "- queue_status: `dropped`",
      "- queue_class: `required`",
      "- active_task: `none`",
      "- next_task: `none`",
      "- goal_status: `satisfied`",
      "- failure_owner_scope: `repository/global`",
      "- closeout_status: `escalated-to-target`",
      "- next_effect: `absorb-into-target`",
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

  assert.match(failures.join("\n"), /closeout_status=escalated-to-target requires queue_status=done/i);
});

test("blueprint lint rejects active candidate and transition queue living at the same time", async () => {
  const repoRoot = createV1FixtureRepo();
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
    "docs/blueprints/targets/test-target-v1.md",
    [
      "# Test Target v1",
      "",
      "## Control Block",
      "",
      "- target_id: `target.test`",
      "- version_goal: `Close the remaining target gap with minimal live truth.`",
      "- acceptance_criteria:",
      "  - `required evidence remains satisfied`",
      "- in_scope:",
      "  - `current target work only`",
      "- out_of_scope:",
      "  - `new target creation`",
      "- execution_queue: `queue.transition`",
      "- candidate_queues:",
      "  - candidate_id: `queue.test`",
      "    state: `active`",
      "    goal: `Activate only when current evidence proves a blocker.`",
      "    entry_conditions: `fresh blocker proven`",
      "    artifacts_needed:",
      "      - `artifact.current-gap-proof`",
      "    drop_if: `blocker disproved or absorbed into target truth`",
      "    on_failure: `absorb-into-target`",
      "- transition_queue:",
      "  - queue_id: `queue.transition`",
      "  - state: `active`",
      "  - binds_candidates:",
      "    - `queue.test`",
      "  - trigger_basis:",
      "    - `artifact.current-gap-proof missing`",
      "  - minimal_scope:",
      "    - `produce one bridge artifact`",
      "- constraints:",
      "  - `Only one execution queue may be active at a time.`",
      "- artifact_rules:",
      "  - artifact_id: `artifact.current-gap-proof`",
      "    required_for:",
      "      - `queue.test`",
      "    transition_allowed_when_missing: `true`",
      "    rule: `Transition allowed only when one bridge artifact would make the candidate executable.`",
      "- done_when:",
      "  - `execution_queue = none`",
      "- closeout_condition:",
      "  - `close only when done_when is satisfied`",
      "- decision_required: `none`",
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
      "- queue_id: `queue.transition`",
      "- belongs_to_target: `target.test`",
      "- queue_status: `active`",
      "- queue_class: `required`",
      "- active_task: `task.transition`",
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

  assert.match(failures.join("\n"), /transition queue must not coexist with candidate state=active/i);
  assert.match(failures.join("\n"), /double live execution truth/i);
});

test("blueprint lint rejects decision_required text that exposes internal control semantics", async () => {
  const repoRoot = createV1FixtureRepo();
  writeFile(
    repoRoot,
    "docs/blueprints/targets/test-target-v1.md",
    [
      "# Test Target v1",
      "",
      "## Control Block",
      "",
      "- target_id: `target.test`",
      "- version_goal: `Close the remaining target gap with minimal live truth.`",
      "- acceptance_criteria:",
      "  - `required evidence remains satisfied`",
      "- in_scope:",
      "  - `current target work only`",
      "- out_of_scope:",
      "  - `new target creation`",
      "- execution_queue: `none`",
      "- candidate_queues:",
      "  - candidate_id: `queue.test`",
      "    state: `candidate`",
      "    goal: `Activate only when current evidence proves a blocker.`",
      "    entry_conditions: `fresh blocker proven`",
      "    artifacts_needed:",
      "      - `artifact.current-gap-proof`",
      "    drop_if: `blocker disproved or absorbed into target truth`",
      "    on_failure: `absorb-into-target`",
      "- transition_queue:",
      "  - queue_id: `none`",
      "  - state: `none`",
      "  - binds_candidates: []",
      "  - trigger_basis: []",
      "  - minimal_scope: []",
      "- constraints:",
      "  - `Only one execution queue may be active at a time.`",
      "- artifact_rules:",
      "  - artifact_id: `artifact.current-gap-proof`",
      "    required_for:",
      "      - `queue.test`",
      "    transition_allowed_when_missing: `false`",
      "    rule: `Candidate activates directly only when current blocker proof exists.`",
      "- done_when:",
      "  - `execution_queue = none`",
      "- closeout_condition:",
      "  - `close only when done_when is satisfied`",
      "- decision_required: `Should Blueprint promote this queue or run closeout sync first?`",
      "",
    ].join("\n")
  );

  const { lintBlueprintDocs } = await loadBlueprintLintModule();
  const failures = lintBlueprintDocs(repoRoot);

  assert.match(failures.join("\n"), /decision_required.*internal control semantics/i);
});
