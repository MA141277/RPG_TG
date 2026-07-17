const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const OPERATOR_INTAKE_CONTRACT_LINES = [
  "## Human Context",
  "",
  "### Operator Intake Contract",
  "",
  "- Allowed operator intake:",
  "  - `\u65b0\u9700\u6c42`",
  "  - `\u53c2\u8003\u6cbb\u7406\u89c4\u8303`",
  "- Internal-only Blueprint work:",
  "  - `read project-progress -> blueprint -> version plan -> active queue -> active task`",
  "  - `attempt active-queue absorption`",
  "  - `classify and route the intake`",
  "  - `record candidate truth or admission truth without asking the operator to fill internal fields`",
  "- Default operator output:",
  "",
  "```text",
  "\u5904\u7406\u7ed3\u679c\uff1a",
  "- \u52a0\u5165\u72b6\u6001\uff1a\u6210\u529f / \u5931\u8d25 / \u6210\u529f\uff0c\u5df2\u52a0\u5165",
  "- \u52a0\u5165\u7c7b\u578b\uff1a\u6267\u884c\u961f\u5217 / \u5019\u9009\u961f\u5217 / \u672a\u52a0\u5165",
  "- \u52a0\u5165\u961f\u5217\uff1a`\u5177\u4f53\u961f\u5217ID` / `none`",
  "",
  "\u539f\u56e0\u8bf4\u660e\uff1a",
  "- \u7528 2~4 \u53e5\u8bdd\u8bf4\u660e\u4e3a\u4ec0\u4e48\u8fdb\u5165\u8be5\u961f\u5217\uff0c\u6216\u8005\u4e3a\u4ec0\u4e48\u6ca1\u6709\u6210\u529f\u52a0\u5165\u3002",
  "- \u5982\u679c\u6ca1\u6709\u8fdb\u5165\u6267\u884c\u961f\u5217\uff0c\u8981\u660e\u786e\u8bf4\u660e\u662f\u56e0\u4e3a\u5f53\u524d\u5df2\u6709 active queue\uff0c\u8fd8\u662f\u56e0\u4e3a\u5b83\u5f53\u524d\u53ea\u6ee1\u8db3\u5019\u9009\u6761\u4ef6\u3002",
  "",
  "\u5f53\u524d\u6267\u884c\u60c5\u51b5\uff1a",
  "- \u5f53\u524d\u6267\u884c\u961f\u5217\uff1a`\u5177\u4f53\u961f\u5217ID`",
  "- \u5f53\u524d\u4efb\u52a1\uff1a`\u5177\u4f53 task ID`",
  "- \u5f53\u524d\u961f\u5217\u76ee\u6807\uff1a\u4e00\u53e5\u8bdd\u8bf4\u660e",
  "",
  "\u4e0b\u4e00\u6b65\uff1a",
  "- \u8bf4\u660e Blueprint \u63a5\u4e0b\u6765\u4f1a\u5982\u4f55\u5904\u7406",
  "- \u4eba\u5de5\u64cd\u4f5c\uff1a\u5f53\u524d\u4e0d\u9700\u8981 / \u5f53\u524d\u9700\u8981\u786e\u8ba4 xxx",
  "```",
  "",
  "- Default visibility rule:",
  "  - `\u9ed8\u8ba4\u4e0d\u5411\u4eba\u5de5\u66b4\u9732\u771f\u503c\u94fe\u7ec6\u8282\u3001\u5019\u9009\u5168\u96c6\u3001Why Not The Others\u3001Human Involvement Boundary\u3001admission \u5185\u90e8\u5b57\u6bb5\u6216\u6392\u5e8f\u5168\u8fc7\u7a0b\uff0c\u9664\u975e\u4eba\u5de5\u660e\u786e\u8981\u6c42\u5c55\u5f00\u5185\u90e8\u5206\u6790\u3002`",
  "",
];

function writeFixtureFile(repoRoot, relativePath, content) {
  const absolutePath = path.join(repoRoot, ...relativePath.split("/"));
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, `${content}\n`, "utf8");
}

function createGovernanceFixture(options = {}) {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "rpg-tg-blueprint-version-"));
  const blueprintVersion = options.blueprintVersion ?? "2026.07";
  const activeQueueId = options.activeQueueId ?? "queue.test-active";
  const activeQueuePath =
    options.activeQueuePath ?? "docs/blueprints/queues/test-active-queue.md";
  const targetPlanPath =
    options.targetPlanPath ?? "docs/blueprints/plans/test-target-plan.md";
  const targetSpecPath =
    options.targetSpecPath ?? "docs/blueprints/specs/test-target.md";
  const queueOwnerId = options.queueOwnerId ?? "target.test";
  const queueStatus = options.queueStatus ?? "active";
  const queueOwnerField = options.queueOwnerField ?? "belongs_to_version";
  const candidateQueueIds = options.candidateQueueIds ?? [];
  const useVersionTerms = options.useVersionTerms ?? true;
  const ownerFieldName = useVersionTerms ? "active_version" : "active_target";
  const ownerPlanFieldName = useVersionTerms ? "active_version_plan" : "active_target_plan";
  const ownerSpecFieldName = useVersionTerms ? "active_version_spec" : "active_target_spec";
  const ownerIdFieldName = useVersionTerms ? "version_id" : "target_id";
  const planRole = useVersionTerms ? "version-governor" : "target-governor";
  const statusFieldName = useVersionTerms ? "version_status" : "target_status";

  fs.mkdirSync(path.join(repoRoot, "docs", "blueprints", "specs"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "docs", "blueprints", "plans"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "docs", "blueprints", "queues"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "docs", "blueprints", "templates"), { recursive: true });

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
      `- ${ownerFieldName}: \`${queueOwnerId}\``,
      `- has_active_queue: \`${activeQueueId === "none" ? "false" : "true"}\``,
      "- next_file: `docs/blueprints/blueprint.md`",
      "- entry_action: `open-next-file`",
      "",
    ].join("\n")
  );

  writeFixtureFile(
    repoRoot,
    "docs/blueprints/blueprint.md",
    [
      "# Current Blueprint",
      "",
      "## Control Block",
      "",
      "- blueprint_id: `blueprint.test`",
      `- blueprint_version: \`${blueprintVersion}\``,
      `- ${ownerFieldName}: \`${queueOwnerId}\``,
      `- ${ownerPlanFieldName}: \`${targetPlanPath}\``,
      `- ${ownerSpecFieldName}: \`${targetSpecPath}\``,
      "- classification_rules_ref: `docs/blueprints/classification-rule-layer-spec.md`",
      "- execution_mode: `single-active-task`",
      "- allow_parallel: `false`",
      "",
    ].join("\n")
  );

  writeFixtureFile(
    repoRoot,
    targetSpecPath,
    [
      "# Version Title",
      "",
      "## Control Block",
      "",
      `- ${ownerIdFieldName}: \`${queueOwnerId}\``,
      "- version_label: `v1`",
      "- closeout_contract_version: `v1`",
      "",
      "## Human Context",
      "",
      "### Queue Contract Portfolio",
      "",
      "| Queue ID | Class | Contract Role | Promote When |",
      "| --- | --- | --- | --- |",
      `| \`${activeQueueId}\` | \`required\` | \`required evidence family\` | \`only if a fresh blocker is proven\` |`,
      "",
    ].join("\n")
  );

  writeFixtureFile(
    repoRoot,
    targetPlanPath,
    [
      "# Version Plan",
      "",
      "## Control Block",
      "",
      `- document_role: \`${planRole}\``,
      `- ${ownerIdFieldName}: \`${queueOwnerId}\``,
      `- ${statusFieldName}: \`open\``,
      "- active_phase: `phase.test`",
      `- active_queue: \`${activeQueueId}\``,
      `- decision_state: \`${activeQueueId === "none" ? "idle-open" : "active-execution"}\``,
      `- next_decision: \`${activeQueueId === "none"
        ? (useVersionTerms ? "same-version-admission-or-version-closeout" : "same-target-admission-or-target-closeout")
        : (useVersionTerms ? "queue-closeout-or-return-to-version-review" : "queue-closeout-or-return-to-target-review")}\``,
      `- next_action: \`${activeQueueId === "none" ? "classify-fresh-work" : "resume-active-queue"}\``,
      `- resume_gate: \`${activeQueueId === "none" ? "idle-open" : "open-active-queue"}\``,
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
      "- blocked_by: []",
      "- candidate_queue_ids:",
      ...candidateQueueIds.map((queueId) => `  - \`${queueId}\``),
      "",
      ...OPERATOR_INTAKE_CONTRACT_LINES,
    ].join("\n")
  );

  if (activeQueueId !== "none") {
    writeFixtureFile(
      repoRoot,
      activeQueuePath,
      [
        "# Active Queue",
        "",
        "## Control Block",
        "",
        `- queue_id: \`${activeQueueId}\``,
        `- ${queueOwnerField}: \`${queueOwnerId}\``,
        `- queue_status: \`${queueStatus}\``,
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
        "### Historical Snapshot (2026-07-09)",
        "",
        "- `Do not rewrite this line.`",
        "",
      ].join("\n")
    );
  }

  return {
    repoRoot,
    blueprintVersion,
    activeQueueId,
    activeQueuePath,
    targetPlanPath,
    targetSpecPath,
    queueOwnerId,
    candidateQueueIds,
  };
}

module.exports = {
  OPERATOR_INTAKE_CONTRACT_LINES,
  createGovernanceFixture,
  writeFixtureFile,
};
