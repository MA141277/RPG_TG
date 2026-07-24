const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const {
  OPERATOR_INTAKE_CONTRACT_LINES,
  createGovernanceFixture,
  writeFixtureFile,
} = require("./helpers/blueprint-governance-fixtures.cjs");

const projectRoot = path.resolve(__dirname, "..");

async function loadSupervisorTool() {
  return import(
    pathToFileURL(path.join(projectRoot, "tools", "blueprint-supervisor.mjs")).href
  );
}

function removeFixtureRepo(repoRoot) {
  fs.rmSync(repoRoot, { recursive: true, force: true });
}

function makeAgentTurnResult(overrides = {}) {
  return {
    channel: "commentary",
    text: "continue",
    intent: "continue",
    ...overrides,
  };
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
    stopReason = "none",
    stopBasis = "none",
    nextUnblockedAction = "none",
    humanInputRequired = "false",
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
      `- decision_state: \`${activeQueue === "none" ? "promotion-review" : "active-execution"}\``,
      `- next_decision: \`${activeQueue === "none" ? "queue-admission-review" : "queue-closeout-or-return-to-version-review"}\``,
      `- next_action: \`${activeQueue === "none" ? "write-admission-review" : "resume-active-queue"}\``,
      `- resume_gate: \`${activeQueue === "none" ? "promotion-review" : "open-active-queue"}\``,
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
      `- stop_reason: \`${stopReason}\``,
      `- stop_basis: \`${stopBasis}\``,
      `- next_unblocked_action: \`${nextUnblockedAction}\``,
      `- human_input_required: \`${humanInputRequired}\``,
      "- blocked_by: []",
      "- candidate_queue_ids:",
      `  - \`${activeQueue === "none" ? "queue.alpha" : activeQueue}\``,
      "",
      ...OPERATOR_INTAKE_CONTRACT_LINES,
      "### Candidate Backlog Refresh Rule",
      "",
      "- `After queue closeout or candidate-routing changes, refresh candidate truth before answering whether any same-version candidate queue remains.`",
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
    tasks,
  }
) {
  const resolvedTasks = tasks.map((task) => ({
    taskId: task.taskId,
    state: task.state,
    summary: task.summary,
    dependsOn: task.dependsOn ?? "none",
    notes: task.notes ?? "Fixture-owned queue task.",
  }));
  const completedTaskCount = resolvedTasks.filter((task) => task.state === "done").length;
  const remainingTaskCount = resolvedTasks.length - completedTaskCount;

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
      "- closeout_status: `in-progress`",
      "- execution_closeout_status: `partial`",
      "- topic_closure_status: `open-residue`",
      "- closure_basis: `Implementation is still in progress.`",
      "- residue_remaining: `yes`",
      "- residue_family: `none`",
      "- residue_routing_status: `none`",
      "- next_family_candidate: `none`",
      "- auto_continue_eligible: `false`",
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
      "## Human Context",
      "",
      "### Queue Snapshot",
      "",
      `- queue_goal: \`Govern ${queueId} through a multi-task Blueprint workflow.\``,
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
        `- promote_next_if_done: \`${task.state === "done" ? "none" : nextTask}\``,
        "- stop_if:",
        "  - `none`",
        "",
        "##### Human Context",
        "",
        "- task_brief:",
        `  - \`${task.summary}\``,
        "- task_outcome_summary:",
        `  - \`${task.summary}\``,
        "",
      ]),
    ].join("\n")
  );
}

function seedSupervisorFixture({
  repoRoot,
  targetPlanPath,
  queueOwnerId,
  blueprintVersion,
  activeQueueId,
  activeTaskId,
  stopReason = "none",
  stopBasis = "none",
  nextUnblockedAction = "none",
  humanInputRequired = "false",
}) {
  writeProjectProgressFixture(repoRoot, {
    activeVersion: queueOwnerId,
    hasActiveQueue: activeQueueId !== "none",
  });
  writeVersionPlanFixture(repoRoot, targetPlanPath, {
    versionId: queueOwnerId,
    activeQueue: activeQueueId,
    stopReason,
    stopBasis,
    nextUnblockedAction,
    humanInputRequired,
  });
  if (activeQueueId !== "none") {
    writeMultiTaskQueueFixture(repoRoot, "docs/blueprints/queues/alpha.md", {
      queueId: activeQueueId,
      ownerId: queueOwnerId,
      blueprintVersion,
      queueStatus: "active",
      activeTask: activeTaskId,
      nextTask: "task.queue.alpha.impl",
      tasks: [
        { taskId: activeTaskId, state: "active", summary: "Run the current queue task." },
        {
          taskId: "task.queue.alpha.impl",
          state: "queued",
          summary: "Run the next queue task.",
          dependsOn: activeTaskId,
        },
      ],
    });
  }
}

test("supervisor rejects final-answer stop while active_task still exists", async (t) => {
  const { repoRoot, blueprintVersion, targetPlanPath, queueOwnerId } = createGovernanceFixture({
    activeQueueId: "none",
    candidateQueueIds: ["queue.alpha"],
  });
  t.after(() => removeFixtureRepo(repoRoot));

  seedSupervisorFixture({
    repoRoot,
    targetPlanPath,
    queueOwnerId,
    blueprintVersion,
    activeQueueId: "queue.alpha",
    activeTaskId: "task.queue.alpha.audit",
  });

  const { runBlueprintSupervisor } = await loadSupervisorTool();
  const result = await runBlueprintSupervisor(repoRoot, {
    once: true,
    agentRunner: async () =>
      makeAgentTurnResult({
        channel: "final",
        text: "\u5df2\u5b8c\u6210\uff0c\u4e0b\u9762\u662f\u603b\u7ed3\u3002",
        intent: "stop",
      }),
  });

  assert.equal(result.stoppedLegally, false);
  assert.equal(result.illegalStopCount, 1);
});

test("supervisor rejects stop when stop_reason is none", async (t) => {
  const { repoRoot, blueprintVersion, targetPlanPath, queueOwnerId } = createGovernanceFixture({
    activeQueueId: "none",
    candidateQueueIds: ["queue.alpha"],
  });
  t.after(() => removeFixtureRepo(repoRoot));

  seedSupervisorFixture({
    repoRoot,
    targetPlanPath,
    queueOwnerId,
    blueprintVersion,
    activeQueueId: "queue.alpha",
    activeTaskId: "task.queue.alpha.audit",
    stopReason: "none",
  });

  const { runBlueprintSupervisor } = await loadSupervisorTool();
  const result = await runBlueprintSupervisor(repoRoot, {
    once: true,
    agentRunner: async () =>
      makeAgentTurnResult({
        channel: "final",
        text: "\u6211\u4e0d\u786e\u5b9a\uff0c\u5148\u505c\u4e00\u4e0b\u3002",
        intent: "stop",
      }),
  });

  assert.equal(result.stoppedLegally, false);
  assert.equal(result.illegalStopCount, 1);
});

test("supervisor accepts stop only when structured stop truth is present", async (t) => {
  const { repoRoot, blueprintVersion, targetPlanPath, queueOwnerId } = createGovernanceFixture({
    activeQueueId: "none",
    candidateQueueIds: ["queue.alpha"],
  });
  t.after(() => removeFixtureRepo(repoRoot));

  seedSupervisorFixture({
    repoRoot,
    targetPlanPath,
    queueOwnerId,
    blueprintVersion,
    activeQueueId: "none",
    activeTaskId: "task.queue.alpha.audit",
    stopReason: "real-blocker",
    stopBasis: "fixture blocker evidence",
    nextUnblockedAction: "resolve-blocker",
    humanInputRequired: "true",
  });

  const { runBlueprintSupervisor } = await loadSupervisorTool();
  const result = await runBlueprintSupervisor(repoRoot, {
    once: true,
    agentRunner: async () =>
      makeAgentTurnResult({
        channel: "final",
        text: "stop accepted",
        intent: "stop",
      }),
  });

  assert.equal(result.stoppedLegally, true);
  assert.equal(result.illegalStopCount, 0);
});

test("supervisor treats Chinese stop-cue commentary as illegal stop even without explicit stop intent", async (t) => {
  const { repoRoot, blueprintVersion, targetPlanPath, queueOwnerId } = createGovernanceFixture({
    activeQueueId: "none",
    candidateQueueIds: ["queue.alpha"],
  });
  t.after(() => removeFixtureRepo(repoRoot));

  seedSupervisorFixture({
    repoRoot,
    targetPlanPath,
    queueOwnerId,
    blueprintVersion,
    activeQueueId: "queue.alpha",
    activeTaskId: "task.queue.alpha.audit",
    stopReason: "none",
  });

  const { runBlueprintSupervisor } = await loadSupervisorTool();
  const result = await runBlueprintSupervisor(repoRoot, {
    once: true,
    agentRunner: async () =>
      makeAgentTurnResult({
        channel: "commentary",
        text: "\u5df2\u5b8c\u6210\uff0c\u5148\u505c\u4e00\u4e0b\uff0c\u7b49\u5f85\u786e\u8ba4\u3002",
        intent: "continue",
      }),
  });

  assert.equal(result.stoppedLegally, false);
  assert.equal(result.illegalStopCount, 1);
});
