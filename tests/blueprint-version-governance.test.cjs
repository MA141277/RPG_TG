const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const {
  createGovernanceFixture,
  OPERATOR_INTAKE_CONTRACT_LINES,
  writeFixtureFile,
} = require("./helpers/blueprint-governance-fixtures.cjs");

const projectRoot = path.resolve(__dirname, "..");

async function loadGovernanceTool() {
  return import(
    pathToFileURL(path.join(projectRoot, "tools", "blueprint-version-governance.mjs")).href
  );
}

async function loadBlueprintLintModule() {
  return import(
    pathToFileURL(path.join(projectRoot, "tools", "lint-blueprints.mjs")).href
  );
}

function writeProjectProgressFixture(repoRoot, { activeVersion = "target.test", hasActiveQueue }) {
  writeFixtureFile(
    repoRoot,
    "docs/blueprints/project-progress.md",
    [
      "# Project Progress",
      "",
      "## Control Block",
      "",
      "- entry_id: `project-progress.test`",
      "- active_blueprint: `blueprint.test`",
      `- active_version: \`${activeVersion}\``,
      `- has_active_queue: \`${hasActiveQueue ? "true" : "false"}\``,
      "- next_file: `docs/blueprints/blueprint.md`",
      "- entry_action: `open-next-file`",
      "",
    ].join("\n")
  );
}

function writeVersionPlanFixture(
  repoRoot,
  relativePath,
  {
    versionId = "target.test",
    activeQueue = "none",
    decisionState = "idle-open",
    nextDecision = "same-version-admission-or-version-closeout",
    nextAction = "classify-fresh-work",
    resumeGate = "idle-open",
    postQueueCloseoutPausePolicy = "auto-continue",
    promotionReviewResult = "none",
    reviewSubjectId = "none",
    reviewSubjectClassification = "none",
    proposedQueueId = "none",
    reviewBasis = "none",
    admissionStatus = "none",
    candidateQueueIds = [],
  } = {}
) {
  writeFixtureFile(
    repoRoot,
    relativePath,
    [
      "# Version Plan",
      "",
      "## Control Block",
      "",
      "- document_role: `version-governor`",
      `- version_id: \`${versionId}\``,
      "- version_status: `open`",
      "- active_phase: `phase.test`",
      `- active_queue: \`${activeQueue}\``,
      `- decision_state: \`${decisionState}\``,
      `- next_decision: \`${nextDecision}\``,
      `- next_action: \`${nextAction}\``,
      `- resume_gate: \`${resumeGate}\``,
      `- post_queue_closeout_pause_policy: \`${postQueueCloseoutPausePolicy}\``,
      `- promotion_review_result: \`${promotionReviewResult}\``,
      `- review_subject_id: \`${reviewSubjectId}\``,
      `- review_subject_classification: \`${reviewSubjectClassification}\``,
      `- proposed_queue_id: \`${proposedQueueId}\``,
      `- review_basis: \`${reviewBasis}\``,
      `- admission_status: \`${admissionStatus}\``,
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
    "- next_unblocked_action: `none`",
    "- human_input_required: `false`",
      "- blocked_by: []",
      "- candidate_queue_ids:",
      ...candidateQueueIds.map((queueId) => `  - \`${queueId}\``),
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
}

function writeQueueFixture(
  repoRoot,
  relativePath,
  {
    queueId,
    ownerId = "target.test",
    ownerField = "belongs_to_version",
    blueprintVersion = null,
    queueStatus = "active",
    activeTask = null,
    nextTask = "none",
    closeoutStatus = null,
    nextEffect = "none",
    syncStatus = "pending",
    syncScope = "none",
    syncSummary = "No repository sync has run yet.",
    taskState = null,
  }
) {
  const resolvedActiveTask =
    activeTask ?? (queueStatus === "active" ? `task.${queueId}.execute` : "none");
  const resolvedTaskState =
    taskState ?? (queueStatus === "done" ? "done" : queueStatus === "active" ? "active" : "queued");
  const resolvedCloseoutStatus =
    closeoutStatus ?? (queueStatus === "done" ? "done" : queueStatus === "blocked" ? "blocked" : "in-progress");
  const queueGoal = `Govern ${queueId} through the current version workflow.`;
  const taskCount = 1;
  const completedTaskCount = queueStatus === "done" ? 1 : 0;
  const remainingTaskCount = queueStatus === "done" ? 0 : 1;
  const taskId = `task.${queueId}.execute`;

  writeFixtureFile(
    repoRoot,
    relativePath,
    [
      "# Queue Title",
      "",
      "## Control Block",
      "",
      `- queue_id: \`${queueId}\``,
      `- ${ownerField}: \`${ownerId}\``,
      ...(blueprintVersion == null ? [] : [`- blueprint_version: \`${blueprintVersion}\``]),
      ...(blueprintVersion == null ? [] : ["- governance_last_synced_at: `2026-07-10`"]),
      ...(blueprintVersion == null ? [] : ["- governance_sync_source: `docs/blueprints/blueprint.md`"]),
      `- queue_status: \`${queueStatus}\``,
      "- queue_class: `required`",
      `- active_task: \`${resolvedActiveTask}\``,
      `- next_task: \`${nextTask}\``,
      `- closeout_status: \`${resolvedCloseoutStatus}\``,
      `- next_effect: \`${nextEffect}\``,
      `- sync_status: \`${syncStatus}\``,
      `- sync_scope: \`${syncScope}\``,
      `- sync_summary: \`${syncSummary}\``,
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
      `- queue_goal: \`${queueGoal}\``,
      `- task_count: \`${taskCount}\``,
      `- completed_task_count: \`${completedTaskCount}\``,
      `- remaining_task_count: \`${remainingTaskCount}\``,
      `- active_task_summary: \`${queueStatus === "done" ? "The queue is already closed." : "Execute the governed queue task."}\``,
      "- task_briefs:",
      `  - \`${taskId}: Execute the governed queue task.\``,
      "",
      "### Task Ledger",
      "",
      "| Task ID | State | Summary | Depends On | Notes |",
      "| --- | --- | --- | --- | --- |",
      `| \`${taskId}\` | \`${resolvedTaskState}\` | \`Execute the governed queue task.\` | \`none\` | \`Fixture-owned queue task.\` |`,
      "",
      "### Task Definitions",
      "",
      `#### \`${taskId}\``,
      "",
      "##### Control Block",
      "",
      `- task_id: \`${taskId}\``,
      `- state: \`${resolvedTaskState}\``,
      "- task_kind: `execution`",
      "- scope:",
      `  - \`${relativePath}\``,
      "- must_inspect:",
      `  - \`${relativePath}\``,
      "- must_not_change:",
      "  - `historical evidence`",
      "- done_when:",
      "  - `The queue state is synchronized.`",
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
      "  - `Execute the governed queue task.`",
      "- task_outcome_summary:",
      "  - `The queue state stays synchronized with version truth.`",
      "",
    ].join("\n")
  );
}

function writeMultiTaskQueueFixture(
  repoRoot,
  relativePath,
  {
    queueId,
    ownerId = "target.test",
    blueprintVersion = "2026.07",
    queueStatus = "active",
    activeTask,
    nextTask = "none",
    closeoutStatus = "in-progress",
    nextEffect = "none",
    syncStatus = "pending",
    syncScope = "none",
    syncSummary = "No repository sync has run yet.",
    executionCloseoutStatus = "partial",
    topicClosureStatus = "open-residue",
    closureBasis = "Implementation is still in progress.",
    residueRemaining = "yes",
    residueFamily = "none",
    residueRoutingStatus = "none",
    nextFamilyCandidate = "none",
    autoContinueEligible = "false",
    tasks,
  }
) {
  const resolvedTasks = tasks.map((task, index) => ({
    taskId: task.taskId,
    state: task.state,
    summary: task.summary ?? `Task ${index + 1} for ${queueId}.`,
    dependsOn: task.dependsOn ?? "none",
    notes: task.notes ?? "Fixture-owned queue task.",
    taskKind: task.taskKind ?? "execution",
    outcome: task.outcome ?? `Outcome placeholder for ${task.taskId}.`,
  }));
  const completedTaskCount = resolvedTasks.filter((task) => task.state === "done").length;
  const remainingTaskCount = resolvedTasks.length - completedTaskCount;
  const queueGoal = `Govern ${queueId} through a multi-task Blueprint workflow.`;

  writeFixtureFile(
    repoRoot,
    relativePath,
    [
      "# Queue Title",
      "",
      "## Control Block",
      "",
      `- queue_id: \`${queueId}\``,
      `- belongs_to_version: \`${ownerId}\``,
      `- blueprint_version: \`${blueprintVersion}\``,
      "- governance_last_synced_at: `2026-07-10`",
      "- governance_sync_source: `docs/blueprints/blueprint.md`",
      `- queue_status: \`${queueStatus}\``,
      "- queue_class: `required`",
      `- active_task: \`${activeTask}\``,
      `- next_task: \`${nextTask}\``,
      `- closeout_status: \`${closeoutStatus}\``,
      `- execution_closeout_status: \`${executionCloseoutStatus}\``,
      `- topic_closure_status: \`${topicClosureStatus}\``,
      `- closure_basis: \`${closureBasis}\``,
      `- residue_remaining: \`${residueRemaining}\``,
      `- residue_family: \`${residueFamily}\``,
      `- residue_routing_status: \`${residueRoutingStatus}\``,
      `- next_family_candidate: \`${nextFamilyCandidate}\``,
      `- auto_continue_eligible: \`${autoContinueEligible}\``,
      `- next_effect: \`${nextEffect}\``,
      `- sync_status: \`${syncStatus}\``,
      `- sync_scope: \`${syncScope}\``,
      `- sync_summary: \`${syncSummary}\``,
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
      `- queue_goal: \`${queueGoal}\``,
      `- task_count: \`${resolvedTasks.length}\``,
      `- completed_task_count: \`${completedTaskCount}\``,
      `- remaining_task_count: \`${remainingTaskCount}\``,
      `- active_task_summary: \`Current active task is ${activeTask}.\``,
      "- task_briefs:",
      ...resolvedTasks.map((task) => `  - \`${task.taskId}: ${task.summary}\``),
      "",
      "### Task Ledger",
      "",
      "| Task ID | State | Summary | Depends On | Notes |",
      "| --- | --- | --- | --- | --- |",
      ...resolvedTasks.map(
        (task) =>
          `| \`${task.taskId}\` | \`${task.state}\` | \`${task.summary}\` | \`${task.dependsOn}\` | \`${task.notes}\` |`
      ),
      "",
      "### Task Definitions",
      "",
      ...resolvedTasks.flatMap((task) => [
        `#### \`${task.taskId}\``,
        "",
        "##### Control Block",
        "",
        `- task_id: \`${task.taskId}\``,
        `- state: \`${task.state}\``,
        `- task_kind: \`${task.taskKind}\``,
        "- scope:",
        `  - \`${relativePath}\``,
        "- must_inspect:",
        `  - \`${relativePath}\``,
        "- must_not_change:",
        "  - `historical evidence`",
        "- done_when:",
        `  - \`${task.outcome}\``,
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
        `  - \`${task.summary}\``,
        "- task_outcome_summary:",
        `  - \`${task.outcome}\``,
        "",
      ]),
    ].join("\n")
  );
}

function removeFixtureRepo(repoRoot) {
  fs.rmSync(repoRoot, { recursive: true, force: true });
}

test("check reports governed active queue when blueprint_version is missing from the queue doc", async () => {
  const { repoRoot } = createGovernanceFixture();
  const { runBlueprintVersionGovernance } = await loadGovernanceTool();

  const result = runBlueprintVersionGovernance("check", repoRoot);

  assert.equal(result.ok, false);
  assert.match(result.messages.join("\n"), /blueprint_version/i);
});

test("sync updates governance shell without rewriting historical snapshot text", async () => {
  const { repoRoot, activeQueuePath, blueprintVersion } = createGovernanceFixture();
  const { runBlueprintVersionGovernance } = await loadGovernanceTool();

  const result = runBlueprintVersionGovernance("sync", repoRoot);
  const syncedText = fs.readFileSync(path.join(repoRoot, ...activeQueuePath.split("/")), "utf8");

  assert.equal(result.ok, true);
  assert.match(syncedText, new RegExp(`- blueprint_version: \`${blueprintVersion}\``));
  assert.match(syncedText, /- belongs_to_version: `target\.test`/);
  assert.match(syncedText, /Do not rewrite this line\./);
});

test("sync fails closed when blueprint.md omits blueprint_version", async () => {
  const { repoRoot } = createGovernanceFixture();
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

  const { runBlueprintVersionGovernance } = await loadGovernanceTool();
  const result = runBlueprintVersionGovernance("sync", repoRoot);

  assert.equal(result.ok, false);
  assert.match(result.messages.join("\n"), /blueprint_version/i);
});

test("check reports a missing active version plan file with version-first wording", async () => {
  const { repoRoot } = createGovernanceFixture();
  writeFixtureFile(
    repoRoot,
    "docs/blueprints/blueprint.md",
    [
      "# Current Blueprint",
      "",
      "## Control Block",
      "",
      "- blueprint_id: `blueprint.test`",
      "- blueprint_version: `2026.07`",
      "- active_version: `target.test`",
      "- active_version_plan: `docs/blueprints/plans/missing-version-plan.md`",
      "- active_version_spec: `docs/blueprints/specs/test-target.md`",
      "- classification_rules_ref: `docs/blueprints/classification-rule-layer-spec.md`",
      "- execution_mode: `single-active-task`",
      "- allow_parallel: `false`",
      "",
    ].join("\n")
  );

  const { runBlueprintVersionGovernance } = await loadGovernanceTool();
  const result = runBlueprintVersionGovernance("check", repoRoot);

  assert.equal(result.ok, false);
  assert.match(result.messages.join("\n"), /missing active version plan file/i);
});

test("check fails closed when blueprint keeps only legacy active_target_plan", async () => {
  const { repoRoot } = createGovernanceFixture();
  writeFixtureFile(
    repoRoot,
    "docs/blueprints/blueprint.md",
    [
      "# Current Blueprint",
      "",
      "## Control Block",
      "",
      "- blueprint_id: `blueprint.test`",
      "- blueprint_version: `2026.07`",
      "- active_version: `target.test`",
      "- active_target_plan: `docs/blueprints/plans/test-target-plan.md`",
      "- active_version_spec: `docs/blueprints/specs/test-target.md`",
      "- classification_rules_ref: `docs/blueprints/classification-rule-layer-spec.md`",
      "- execution_mode: `single-active-task`",
      "- allow_parallel: `false`",
      "",
    ].join("\n")
  );

  const { runBlueprintVersionGovernance } = await loadGovernanceTool();
  const result = runBlueprintVersionGovernance("check", repoRoot);

  assert.equal(result.ok, false);
  assert.match(result.messages.join("\n"), /active_version_plan/i);
});

test("check governs candidate queues listed in the target plan candidate queue registry", async () => {
  const { repoRoot } = createGovernanceFixture({
    activeQueueId: "none",
    candidateQueueIds: ["queue.candidate"],
  });

  writeFixtureFile(
    repoRoot,
    "docs/blueprints/queues/test-candidate-queue.md",
    [
      "# Candidate Queue",
      "",
      "## Control Block",
      "",
      "- queue_id: `queue.candidate`",
      "- belongs_to_version: `target.test`",
      "- queue_status: `blocked`",
      "- queue_class: `required`",
      "- active_task: `none`",
      "- next_task: `none`",
      "- closeout_status: `blocked`",
      "- next_effect: `none`",
      "- sync_status: `pending`",
      "- sync_scope: `none`",
      "- sync_summary: `No repository sync has run yet.`",
      "- blocked_by: []",
      "- allowed_item_classifications:",
      "  - `current-target-item`",
      "- reject_item_classifications:",
      "  - `out-of-scope`",
      "",
    ].join("\n")
  );

  const { runBlueprintVersionGovernance } = await loadGovernanceTool();
  const result = runBlueprintVersionGovernance("check", repoRoot);

  assert.equal(result.ok, false);
  assert.match(result.messages.join("\n"), /test-candidate-queue\.md: missing or outdated blueprint_version/i);
});

test("sync updates candidate queues listed in the target plan candidate queue registry", async () => {
  const { repoRoot } = createGovernanceFixture({
    activeQueueId: "none",
    candidateQueueIds: ["queue.candidate"],
  });

  writeFixtureFile(
    repoRoot,
    "docs/blueprints/queues/test-candidate-queue.md",
    [
      "# Candidate Queue",
      "",
      "## Control Block",
      "",
      "- queue_id: `queue.candidate`",
      "- belongs_to_target: `target.test`",
      "- queue_status: `blocked`",
      "- queue_class: `required`",
      "- active_task: `none`",
      "- next_task: `none`",
      "- closeout_status: `blocked`",
      "- next_effect: `none`",
      "- sync_status: `pending`",
      "- sync_scope: `none`",
      "- sync_summary: `No repository sync has run yet.`",
      "- blocked_by: []",
      "- allowed_item_classifications:",
      "  - `current-target-item`",
      "- reject_item_classifications:",
      "  - `out-of-scope`",
      "",
    ].join("\n")
  );

  const { runBlueprintVersionGovernance } = await loadGovernanceTool();
  const result = runBlueprintVersionGovernance("sync", repoRoot);
  const syncedText = fs.readFileSync(
    path.join(repoRoot, "docs", "blueprints", "queues", "test-candidate-queue.md"),
    "utf8"
  );

  assert.equal(result.ok, true);
  assert.match(result.messages.join("\n"), /updated docs\/blueprints\/queues\/test-candidate-queue\.md/i);
  assert.match(syncedText, /- blueprint_version: `2026\.07`/);
  assert.match(syncedText, /- belongs_to_version: `target\.test`/);
});

test("check does not fail when a recorded candidate queue has no queue doc yet", async () => {
  const { repoRoot } = createGovernanceFixture({
    activeQueueId: "none",
    candidateQueueIds: ["queue.candidate-without-doc"],
  });

  const { runBlueprintVersionGovernance } = await loadGovernanceTool();
  const result = runBlueprintVersionGovernance("check", repoRoot);

  assert.equal(result.ok, true);
  assert.deepEqual(result.messages, ["Blueprint version governance check passed."]);
});

test("check resolves version-only blueprint pointers without target aliases", async () => {
  const { repoRoot } = createGovernanceFixture({
    useVersionTerms: true,
  });

  const { runBlueprintVersionGovernance } = await loadGovernanceTool();
  const result = runBlueprintVersionGovernance("check", repoRoot);

  assert.equal(result.ok, false);
  assert.match(result.messages.join("\n"), /blueprint_version|active_version_plan|version/i);
});

test("candidate queue can be recorded, promoted, synced, and closed through the version workflow", async () => {
  const {
    repoRoot,
    blueprintVersion,
    targetPlanPath,
    queueOwnerId,
  } = createGovernanceFixture({
    activeQueueId: "queue.existing-active",
    activeQueuePath: "docs/blueprints/queues/existing-active-queue.md",
  });
  const existingQueuePath = "docs/blueprints/queues/existing-active-queue.md";
  const candidateQueuePath = "docs/blueprints/queues/queue-snapshot-auto-repair.md";
  const candidateQueueId = "queue.queue-snapshot-auto-repair";
  const { runBlueprintVersionGovernance } = await loadGovernanceTool();
  const { lintBlueprintDocs } = await loadBlueprintLintModule();

  writeProjectProgressFixture(repoRoot, {
    activeVersion: queueOwnerId,
    hasActiveQueue: true,
  });
  writeVersionPlanFixture(repoRoot, targetPlanPath, {
    versionId: queueOwnerId,
    activeQueue: "queue.existing-active",
    decisionState: "active-execution",
    nextDecision: "queue-closeout-or-return-to-version-review",
    nextAction: "resume-active-queue",
    resumeGate: "open-active-queue",
  });
  writeQueueFixture(repoRoot, existingQueuePath, {
    queueId: "queue.existing-active",
    ownerId: queueOwnerId,
    blueprintVersion,
    queueStatus: "active",
    nextEffect: "none",
  });

  assert.deepEqual(lintBlueprintDocs(repoRoot), []);
  assert.deepEqual(
    runBlueprintVersionGovernance("check", repoRoot),
    { ok: true, messages: ["Blueprint version governance check passed."] }
  );

  writeVersionPlanFixture(repoRoot, targetPlanPath, {
    versionId: queueOwnerId,
    activeQueue: "queue.existing-active",
    decisionState: "active-execution",
    nextDecision: "queue-closeout-or-return-to-version-review",
    nextAction: "resume-active-queue",
    resumeGate: "open-active-queue",
    candidateQueueIds: [candidateQueueId],
  });
  writeQueueFixture(repoRoot, candidateQueuePath, {
    queueId: candidateQueueId,
    ownerId: queueOwnerId,
    ownerField: "belongs_to_target",
    blueprintVersion: null,
    queueStatus: "blocked",
    activeTask: "none",
    closeoutStatus: "blocked",
    nextEffect: "none",
    taskState: "queued",
  });

  let result = runBlueprintVersionGovernance("check", repoRoot);
  assert.equal(result.ok, false);
  assert.match(result.messages.join("\n"), /queue-snapshot-auto-repair\.md/i);
  assert.match(result.messages.join("\n"), /blueprint_version|belongs_to_target/i);

  result = runBlueprintVersionGovernance("sync", repoRoot);
  assert.equal(result.ok, true);
  let candidateQueueText = fs.readFileSync(
    path.join(repoRoot, ...candidateQueuePath.split("/")),
    "utf8"
  );
  assert.match(candidateQueueText, /- blueprint_version: `2026\.07`/);
  assert.match(candidateQueueText, /- belongs_to_version: `target\.test`/);
  assert.deepEqual(lintBlueprintDocs(repoRoot), []);
  assert.deepEqual(
    runBlueprintVersionGovernance("check", repoRoot),
    { ok: true, messages: ["Blueprint version governance check passed."] }
  );

  writeQueueFixture(repoRoot, existingQueuePath, {
    queueId: "queue.existing-active",
    ownerId: queueOwnerId,
    blueprintVersion,
    queueStatus: "done",
    activeTask: "none",
    closeoutStatus: "done",
    nextEffect: "return-to-version-review",
    syncStatus: "success",
    syncSummary: "The existing queue is closed.",
    taskState: "done",
  });
  writeProjectProgressFixture(repoRoot, {
    activeVersion: queueOwnerId,
    hasActiveQueue: false,
  });
  writeVersionPlanFixture(repoRoot, targetPlanPath, {
    versionId: queueOwnerId,
    activeQueue: "none",
    decisionState: "promotion-review",
    nextDecision: "queue-admission-review",
    nextAction: "write-admission-review",
    resumeGate: "promotion-review",
    reviewSubjectId: "item.queue-snapshot-auto-repair",
    reviewSubjectClassification: "queue-candidate",
    proposedQueueId: candidateQueueId,
    reviewBasis: "fresh evidence proves queue snapshot governance drift needs a bounded queue",
    admissionStatus: "pending",
    candidateQueueIds: [candidateQueueId],
  });

  assert.deepEqual(lintBlueprintDocs(repoRoot), []);
  assert.deepEqual(
    runBlueprintVersionGovernance("check", repoRoot),
    { ok: true, messages: ["Blueprint version governance check passed."] }
  );

  writeProjectProgressFixture(repoRoot, {
    activeVersion: queueOwnerId,
    hasActiveQueue: true,
  });
  writeVersionPlanFixture(repoRoot, targetPlanPath, {
    versionId: queueOwnerId,
    activeQueue: candidateQueueId,
    decisionState: "active-execution",
    nextDecision: "queue-closeout-or-return-to-version-review",
    nextAction: "resume-active-queue",
    resumeGate: "open-active-queue",
    promotionReviewResult: "admit",
    candidateQueueIds: [candidateQueueId],
  });
  writeQueueFixture(repoRoot, candidateQueuePath, {
    queueId: candidateQueueId,
    ownerId: queueOwnerId,
    blueprintVersion,
    queueStatus: "active",
    nextEffect: "none",
  });

  assert.deepEqual(lintBlueprintDocs(repoRoot), []);
  assert.deepEqual(
    runBlueprintVersionGovernance("check", repoRoot),
    { ok: true, messages: ["Blueprint version governance check passed."] }
  );

  writeProjectProgressFixture(repoRoot, {
    activeVersion: queueOwnerId,
    hasActiveQueue: false,
  });
  writeVersionPlanFixture(repoRoot, targetPlanPath, {
    versionId: queueOwnerId,
    activeQueue: "none",
    decisionState: "idle-open",
    nextDecision: "same-version-admission-or-version-closeout",
    nextAction: "classify-fresh-work",
    resumeGate: "idle-open",
  });
  writeQueueFixture(repoRoot, candidateQueuePath, {
    queueId: candidateQueueId,
    ownerId: queueOwnerId,
    blueprintVersion,
    queueStatus: "done",
    activeTask: "none",
    closeoutStatus: "done",
    nextEffect: "return-to-version-review",
    syncStatus: "success",
    syncSummary: "The candidate queue was completed and closed.",
    taskState: "done",
  });

  assert.deepEqual(lintBlueprintDocs(repoRoot), []);
  assert.deepEqual(
    runBlueprintVersionGovernance("check", repoRoot),
    { ok: true, messages: ["Blueprint version governance check passed."] }
  );
});

test("workflow inspection drives isolated end-to-end Blueprint routing with auto-continue and human-decision checkpoints", async (t) => {
  const {
    repoRoot,
    blueprintVersion,
    targetPlanPath,
    queueOwnerId,
  } = createGovernanceFixture({
    activeQueueId: "none",
    candidateQueueIds: ["queue.alpha", "queue.beta"],
  });
  t.after(() => removeFixtureRepo(repoRoot));

  const { inspectBlueprintWorkflow } = await loadGovernanceTool();
  const { lintBlueprintDocs } = await loadBlueprintLintModule();

  writeProjectProgressFixture(repoRoot, {
    activeVersion: queueOwnerId,
    hasActiveQueue: false,
  });
  writeVersionPlanFixture(repoRoot, targetPlanPath, {
    versionId: queueOwnerId,
    activeQueue: "none",
    decisionState: "promotion-review",
    nextDecision: "queue-admission-review",
    nextAction: "write-admission-review",
    resumeGate: "promotion-review",
    reviewSubjectId: "item.alpha",
    reviewSubjectClassification: "queue-candidate",
    proposedQueueId: "queue.alpha",
    reviewBasis: "alpha is the smallest lawful queue while beta stays candidate",
    admissionStatus: "pending",
    candidateQueueIds: ["queue.alpha", "queue.beta"],
  });
  writeQueueFixture(repoRoot, "docs/blueprints/queues/alpha.md", {
    queueId: "queue.alpha",
    ownerId: queueOwnerId,
    blueprintVersion,
    queueStatus: "blocked",
    activeTask: "none",
    closeoutStatus: "blocked",
    nextEffect: "none",
    taskState: "queued",
  });
  writeQueueFixture(repoRoot, "docs/blueprints/queues/beta.md", {
    queueId: "queue.beta",
    ownerId: queueOwnerId,
    blueprintVersion,
    queueStatus: "blocked",
    activeTask: "none",
    closeoutStatus: "blocked",
    nextEffect: "none",
    taskState: "queued",
  });

  assert.deepEqual(lintBlueprintDocs(repoRoot), []);
  let result = inspectBlueprintWorkflow(repoRoot);
  assert.equal(result.ok, true);
  assert.equal(result.recommendedAction, "promote-candidate");
  assert.equal(result.humanDecisionRequired, false);
  assert.equal(result.promotionCandidate.queueId, "queue.alpha");
  assert.deepEqual(result.candidateQueueIds, ["queue.alpha", "queue.beta"]);

  writeProjectProgressFixture(repoRoot, {
    activeVersion: queueOwnerId,
    hasActiveQueue: true,
  });
  writeVersionPlanFixture(repoRoot, targetPlanPath, {
    versionId: queueOwnerId,
    activeQueue: "queue.alpha",
    decisionState: "active-execution",
    nextDecision: "queue-closeout-or-return-to-version-review",
    nextAction: "resume-active-queue",
    resumeGate: "open-active-queue",
    promotionReviewResult: "admit",
    candidateQueueIds: ["queue.alpha", "queue.beta"],
  });
  writeMultiTaskQueueFixture(repoRoot, "docs/blueprints/queues/alpha.md", {
    queueId: "queue.alpha",
    ownerId: queueOwnerId,
    blueprintVersion,
    queueStatus: "active",
    activeTask: "task.queue.alpha.audit",
    nextTask: "task.queue.alpha.impl",
    tasks: [
      { taskId: "task.queue.alpha.audit", state: "active", summary: "Audit the queue boundary." },
      { taskId: "task.queue.alpha.impl", state: "queued", summary: "Implement the bounded slice.", dependsOn: "task.queue.alpha.audit" },
      { taskId: "task.queue.alpha.verify", state: "queued", summary: "Verify closeout evidence.", dependsOn: "task.queue.alpha.impl" },
    ],
  });

  assert.deepEqual(lintBlueprintDocs(repoRoot), []);
  result = inspectBlueprintWorkflow(repoRoot);
  assert.equal(result.ok, true);
  assert.equal(result.recommendedAction, "continue-active-queue");
  assert.equal(result.humanDecisionRequired, false);
  assert.equal(result.activeQueue.queueId, "queue.alpha");
  assert.equal(result.activeQueue.taskCount, 3);
  assert.equal(result.activeQueue.activeTask, "task.queue.alpha.audit");
  assert.deepEqual(result.activeQueue.taskIds, [
    "task.queue.alpha.audit",
    "task.queue.alpha.impl",
    "task.queue.alpha.verify",
  ]);

  writeProjectProgressFixture(repoRoot, {
    activeVersion: queueOwnerId,
    hasActiveQueue: false,
  });
  writeVersionPlanFixture(repoRoot, targetPlanPath, {
    versionId: queueOwnerId,
    activeQueue: "none",
    decisionState: "promotion-review",
    nextDecision: "queue-admission-review",
    nextAction: "write-admission-review",
    resumeGate: "promotion-review",
    reviewSubjectId: "item.beta",
    reviewSubjectClassification: "queue-candidate",
    proposedQueueId: "queue.beta",
    reviewBasis: "same-family residue routing proved beta is the unique next queue",
    admissionStatus: "pending",
    candidateQueueIds: ["queue.beta"],
    promotionReviewResult: "none",
  });
  writeFixtureFile(
    repoRoot,
    targetPlanPath,
    fs.readFileSync(path.join(repoRoot, ...targetPlanPath.split("/")), "utf8")
      .replace("- closure_review_subject: `none`", "- closure_review_subject: `queue.alpha`")
      .replace("- closure_review_status: `none`", "- closure_review_status: `routed`")
      .replace("- residue_candidate_id: `none`", "- residue_candidate_id: `item.beta`")
      .replace("- residue_candidate_family: `none`", "- residue_candidate_family: `same-family`")
      .replace("- routing_basis: `none`", "- routing_basis: `queue alpha closed with one same-family residue path`")
      .replace("- next_lawful_queue_recommendation: `none`", "- next_lawful_queue_recommendation: `queue.beta`")
      .replace("- auto_admission_ready: `false`", "- auto_admission_ready: `true`")
  );
  writeMultiTaskQueueFixture(repoRoot, "docs/blueprints/queues/alpha.md", {
    queueId: "queue.alpha",
    ownerId: queueOwnerId,
    blueprintVersion,
    queueStatus: "done",
    activeTask: "none",
    nextTask: "none",
    closeoutStatus: "done",
    nextEffect: "return-to-version-review",
    syncStatus: "success",
    syncSummary: "Queue alpha is closed and routed.",
    executionCloseoutStatus: "done",
    topicClosureStatus: "open-residue",
    closureBasis: "The bounded alpha slice landed but one same-family residue remains.",
    residueRemaining: "yes",
    residueFamily: "same-family",
    residueRoutingStatus: "auto-routable",
    nextFamilyCandidate: "queue.beta",
    autoContinueEligible: "true",
    tasks: [
      { taskId: "task.queue.alpha.audit", state: "done", summary: "Audit the queue boundary." },
      { taskId: "task.queue.alpha.impl", state: "done", summary: "Implement the bounded slice.", dependsOn: "task.queue.alpha.audit" },
      { taskId: "task.queue.alpha.verify", state: "done", summary: "Verify closeout evidence.", dependsOn: "task.queue.alpha.impl" },
    ],
  });

  assert.deepEqual(lintBlueprintDocs(repoRoot), []);
  result = inspectBlueprintWorkflow(repoRoot);
  assert.equal(result.ok, true);
  assert.equal(result.recommendedAction, "auto-route-same-family-residue");
  assert.equal(result.humanDecisionRequired, false);
  assert.equal(result.nextLawfulQueueRecommendation, "queue.beta");
  assert.equal(result.residueSourceQueueId, "queue.alpha");

  writeVersionPlanFixture(repoRoot, targetPlanPath, {
    versionId: queueOwnerId,
    activeQueue: "none",
    decisionState: "promotion-review",
    nextDecision: "queue-admission-review",
    nextAction: "write-admission-review",
    resumeGate: "promotion-review",
    reviewSubjectId: "none",
    reviewSubjectClassification: "none",
    proposedQueueId: "none",
    reviewBasis: "multiple lawful follow-up queues remain",
    admissionStatus: "none",
    candidateQueueIds: ["queue.gamma", "queue.delta"],
  });
  writeQueueFixture(repoRoot, "docs/blueprints/queues/gamma.md", {
    queueId: "queue.gamma",
    ownerId: queueOwnerId,
    blueprintVersion,
    queueStatus: "blocked",
    activeTask: "none",
    closeoutStatus: "blocked",
    nextEffect: "none",
    taskState: "queued",
  });
  writeQueueFixture(repoRoot, "docs/blueprints/queues/delta.md", {
    queueId: "queue.delta",
    ownerId: queueOwnerId,
    blueprintVersion,
    queueStatus: "blocked",
    activeTask: "none",
    closeoutStatus: "blocked",
    nextEffect: "none",
    taskState: "queued",
  });

  assert.deepEqual(lintBlueprintDocs(repoRoot), []);
  result = inspectBlueprintWorkflow(repoRoot);
  assert.equal(result.ok, true);
  assert.equal(result.recommendedAction, "ask-human-routing-decision");
  assert.equal(result.humanDecisionRequired, true);
  assert.match(result.humanDecisionReason, /multiple lawful candidate queues/i);
  assert.deepEqual(result.candidateQueueIds, ["queue.delta", "queue.gamma"]);
});
