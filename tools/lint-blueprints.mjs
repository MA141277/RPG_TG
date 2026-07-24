import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const allowedEntryActions = new Set(["open-next-file", "stop", "blocked"]);
const allowedVersionNextActions = new Set([
  "classify-fresh-work",
  "write-admission-review",
  "activate-admitted-queue",
  "resume-active-queue",
  "auto-reconcile-active-task",
  "write-queue-closeout",
  "return-to-promotion-review",
  "write-version-closeout",
  "resolve-blocker",
]);
const allowedVersionNextDecisions = new Set([
  "queue-admission-review",
  "queue-closeout-or-return-to-version-review",
  "same-version-admission-or-version-closeout",
  "version-closeout",
  "resolve-blocker",
]);
const allowedPostQueueCloseoutPausePolicies = new Set([
  "auto-continue",
  "pause-when-explicitly-requested",
]);
const allowedAdmissionStatuses = new Set([
  "none",
  "pending",
  "admitted",
  "rejected",
  "deferred",
  "blocked",
]);
const allowedIntakeStatuses = new Set([
  "none",
  "evaluating",
  "absorbed",
  "candidate-recorded",
  "admission-review",
]);
const allowedIntakeResults = new Set([
  "none",
  "absorbed-into-active-queue",
  "queued-as-candidate",
  "promoted-to-admission",
  "rejected",
  "deferred",
]);
const allowedIntakeFeedbackModes = new Set([
  "none",
  "fixed-receipt",
]);
const allowedClosureReviewStatuses = new Set(["none", "evaluating", "routed", "blocked"]);
const allowedStopReasons = new Set([
  "none",
  "version-closeout-confirmation",
  "explicit-answer-only",
  "operator-requested-suspend",
  "real-blocker",
  "outside-parent-spec",
  "parent-spec-change",
  "capability-downgrade-risk",
  "retired-rewrite-risk",
  "product-decision",
]);
const allowedResidueFamilies = new Set([
  "same-family",
  "cross-family",
  "accepted-residue",
  "none",
]);
const allowedQueueStatuses = new Set(["active", "blocked", "suspended", "done", "dropped"]);
const allowedExecutionCloseoutStatuses = new Set(["done", "partial", "blocked"]);
const allowedTopicClosureStatuses = new Set(["closed", "open-residue", "blocked"]);
const allowedResidueRoutingStatuses = new Set([
  "auto-routable",
  "needs-version-review",
  "needs-human-decision",
  "none",
]);
const allowedBooleanStrings = new Set(["true", "false"]);
const allowedSyncStatuses = new Set(["pending", "success", "failed"]);
const allowedSyncScopes = new Set([
  "local-record",
  "branch-commit",
  "branch-push",
  "baseline-merge",
  "baseline-push",
  "remote-sync",
  "none",
]);
const closureRoutingFields = [
  "closure_review_subject",
  "closure_review_status",
  "residue_candidate_id",
  "residue_candidate_family",
  "routing_basis",
  "next_lawful_queue_recommendation",
  "auto_admission_ready",
];
const queueClosureJudgementFields = [
  "execution_closeout_status",
  "topic_closure_status",
  "closure_basis",
  "residue_remaining",
  "residue_family",
  "residue_routing_status",
  "next_family_candidate",
  "auto_continue_eligible",
];

function isExplicitContinuationAction(value) {
  return typeof value === "string" && /^continue-task\./u.test(value);
}

export function lintBlueprintDocs(repoRoot = process.cwd()) {
  const failures = [];
  const blueprintsRoot = path.join(repoRoot, "docs", "blueprints");
  const {
    projectProgressPath,
    blueprintPath,
    targetPlanPath,
    targetSpecPath,
    activeVersionId,
  } = resolveLiveTruthPaths(repoRoot, failures);

  lintProjectProgress(projectProgressPath, failures, repoRoot);
  lintBlueprintIndex(blueprintPath, failures, repoRoot);
  lintTargetPlan(targetPlanPath, failures, repoRoot, "version plan");
  lintTargetSpec(targetSpecPath, failures, repoRoot, "version spec");
  lintQueueDocs(
    path.join(blueprintsRoot, "queues"),
    failures,
    repoRoot,
    activeVersionId
  );
  lintWorkflowIntakeContract(
    path.join(blueprintsRoot, "blueprint-workflow-spec.md"),
    failures,
    repoRoot
  );
  lintWorkflowEvidenceContract(
    path.join(blueprintsRoot, "blueprint-workflow-spec.md"),
    failures,
    repoRoot
  );
  lintWorkflowGitSyncContract(
    path.join(blueprintsRoot, "blueprint-workflow-spec.md"),
    failures,
    repoRoot
  );
  lintTemplate(
    path.join(blueprintsRoot, "templates", "project-progress-template.md"),
    failures,
    repoRoot,
    lintProjectProgress
  );
  lintTemplate(
    path.join(blueprintsRoot, "templates", "target-plan-template.md"),
    failures,
    repoRoot,
    (filePath, innerFailures) =>
      lintTargetPlan(filePath, innerFailures, repoRoot, "version-plan template")
  );
  lintTemplate(
    path.join(blueprintsRoot, "templates", "target-spec-template.md"),
    failures,
    repoRoot,
    (filePath, innerFailures) =>
      lintTargetSpec(filePath, innerFailures, repoRoot, "version-spec template")
  );
  lintTemplate(
    path.join(blueprintsRoot, "templates", "execution-queue-template.md"),
    failures,
    repoRoot,
    (filePath, innerFailures) =>
      lintQueueDoc(filePath, innerFailures, repoRoot, true)
  );
  if (targetPlanPath != null && fs.existsSync(targetPlanPath)) {
    lintTargetPlanOperatorContract(targetPlanPath, failures, repoRoot);
  }
  lintTargetPlanOperatorContract(
    path.join(blueprintsRoot, "templates", "target-plan-template.md"),
    failures,
    repoRoot
  );
  lintEvidenceBoundTemplates(blueprintsRoot, failures, repoRoot);
  lintReadableQueueOperatorSnapshotContract(
    path.join(blueprintsRoot, "templates", "execution-queue-template.md"),
    failures,
    repoRoot
  );

  lintCrossDocumentConsistency(
    projectProgressPath,
    blueprintPath,
    targetPlanPath,
    failures,
    repoRoot
  );

  return failures;
}

function resolveLiveTruthPaths(repoRoot, failures) {
  const blueprintsRoot = path.join(repoRoot, "docs", "blueprints");
  const projectProgressPath = path.join(blueprintsRoot, "project-progress.md");
  const fallbackBlueprintPath = path.join(blueprintsRoot, "blueprint.md");
  let blueprintPath = fallbackBlueprintPath;
  let blueprintText = null;

  if (fs.existsSync(projectProgressPath)) {
    const projectProgressText = fs.readFileSync(projectProgressPath, "utf8");
    const nextFileRef = matchField(projectProgressText, "next_file");
    if (
      nextFileRef != null &&
      nextFileRef !== "none" &&
      nextFileRef.endsWith("/blueprint.md")
    ) {
      blueprintPath = path.join(repoRoot, ...nextFileRef.split("/"));
    }
  }

  if (fs.existsSync(blueprintPath)) {
    blueprintText = fs.readFileSync(blueprintPath, "utf8");
  } else if (fs.existsSync(fallbackBlueprintPath)) {
    blueprintPath = fallbackBlueprintPath;
    blueprintText = fs.readFileSync(blueprintPath, "utf8");
  }

  const activeVersionId = blueprintText == null
    ? null
    : matchField(blueprintText, "active_version");
  const targetPlanPath = resolveBlueprintDocumentPath({
    repoRoot,
    blueprintsRoot,
    blueprintText,
    fieldNames: ["active_version_plan"],
    searchDirectory: path.join(blueprintsRoot, "plans"),
    ownerFieldNames: ["version_id"],
    ownerId: activeVersionId,
  });
  const targetSpecPath = resolveBlueprintDocumentPath({
    repoRoot,
    blueprintsRoot,
    blueprintText,
    fieldNames: ["active_version_spec"],
    searchDirectory: path.join(blueprintsRoot, "specs"),
    ownerFieldNames: ["version_id"],
    ownerId: activeVersionId,
  });

  if (blueprintText != null && targetPlanPath == null) {
    failures.push(
      `${relative(repoRoot, blueprintPath)}: cannot resolve current version plan from blueprint pointers`
    );
  }

  if (blueprintText != null && targetSpecPath == null) {
    failures.push(
      `${relative(repoRoot, blueprintPath)}: cannot resolve current version spec from blueprint pointers`
    );
  }

  return {
    projectProgressPath,
    blueprintPath,
    targetPlanPath,
    targetSpecPath,
    activeVersionId,
  };
}

function resolveBlueprintDocumentPath({
  repoRoot,
  blueprintsRoot,
  blueprintText,
  fieldNames,
  searchDirectory,
  ownerFieldNames,
  ownerId,
}) {
  if (blueprintText != null) {
    for (const fieldName of fieldNames) {
      const ref = matchField(blueprintText, fieldName);
      if (ref != null && ref !== "none") {
        return path.join(repoRoot, ...ref.split("/"));
      }
    }

    return null;
  }

  const matchedByOwner = findMarkdownFileByOwnerField(searchDirectory, ownerFieldNames, ownerId);
  if (matchedByOwner != null) {
    return matchedByOwner;
  }

  return firstMarkdownFile(searchDirectory);
}

function findMarkdownFileByOwnerField(directoryPath, fieldNames, ownerId) {
  if (ownerId == null || ownerId === "none" || !fs.existsSync(directoryPath)) {
    return null;
  }

  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) {
      continue;
    }

    const filePath = path.join(directoryPath, entry.name);
    const text = fs.readFileSync(filePath, "utf8");
    if (fieldNames.some((fieldName) => matchField(text, fieldName) === ownerId)) {
      return filePath;
    }
  }

  return null;
}

function lintTemplate(filePath, failures, repoRoot, lintFn) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  lintFn(filePath, failures, repoRoot);
}

function lintProjectProgress(filePath, failures, repoRoot) {
  const text = readFileOrFail(filePath, failures, repoRoot);
  if (text == null) {
    return;
  }

  const relativePath = relative(repoRoot, filePath);
  rejectQueueLocalSyncFields(text, relativePath, failures, "project-progress");

  if (/^- next_step:/m.test(text)) {
    failures.push(
      `${relativePath}: project-progress must not contain next_step prose mirrors; use entry_action instead`
    );
  }

  if (/^- active_target:/m.test(text)) {
    failures.push(
      `${relativePath}: project-progress must not use legacy live pointer field "active_target"; use active_version`
    );
  }

  const entryActionMatch = text.match(/^- entry_action: `([^`]+)`/m);
  if (entryActionMatch == null) {
    failures.push(
      `${relativePath}: project-progress missing Control Block field "entry_action"`
    );
  } else if (!allowedEntryActions.has(entryActionMatch[1])) {
    failures.push(
      `${relativePath}: project-progress entry_action "${entryActionMatch[1]}" is not an allowed enum value`
    );
  }
}

function lintBlueprintIndex(filePath, failures, repoRoot) {
  const text = readFileOrFail(filePath, failures, repoRoot);
  if (text == null) {
    return;
  }

  const relativePath = relative(repoRoot, filePath);
  requireFieldValue(
    text,
    "blueprint_version",
    relativePath,
    failures,
    `${relativePath}: blueprint missing Control Block field "blueprint_version"`
  );
  requireFieldValue(
    text,
    "active_version",
    relativePath,
    failures,
    `${relativePath}: blueprint missing Control Block field "active_version"`
  );
  requireFieldValue(
    text,
    "active_version_plan",
    relativePath,
    failures,
    `${relativePath}: blueprint missing Control Block field "active_version_plan"`
  );
  requireFieldValue(
    text,
    "active_version_spec",
    relativePath,
    failures,
    `${relativePath}: blueprint missing Control Block field "active_version_spec"`
  );
  rejectQueueLocalSyncFields(text, relativePath, failures, "blueprint");
  for (const forbiddenField of [
    "active_target",
    "active_target_plan",
    "active_target_spec",
  ]) {
    if (new RegExp(`^- ${escapeRegExp(forbiddenField)}:`, "m").test(text)) {
      failures.push(
        `${relativePath}: blueprint must not use legacy live pointer field "${forbiddenField}"; use version terminology`
      );
    }
  }
  for (const forbiddenField of [
    "version_status",
    "decision_state",
    "active_queue",
    "active_task",
    "completed_targets",
  ]) {
    if (new RegExp(`^- ${escapeRegExp(forbiddenField)}:`, "m").test(text)) {
      failures.push(
        `${relativePath}: blueprint must not own downstream truth field "${forbiddenField}"`
      );
    }
  }
}

function lintWorkflowIntakeContract(filePath, failures, repoRoot) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const text = readFileOrFail(filePath, failures, repoRoot);
  if (text == null) {
    return;
  }

  const relativePath = relative(repoRoot, filePath);
  requirePatterns(text, relativePath, failures, [
    [/\u65b0\u9700\u6c42/u, 'workflow spec must name `???` as allowed intake input'],
    [/\u53c2\u8003\u6cbb\u7406\u89c4\u8303/u, 'workflow spec must name `??????` as allowed intake input'],
    [/^### 7\.1\.1 Fixed operator receipt contract$/m, "workflow spec must define the fixed operator receipt contract"],
    [/\u5904\u7406\u7ed3\u679c\uff1a/u, "workflow spec must publish the fixed receipt labels"],
    [/\u4eba\u5de5\u64cd\u4f5c\uff1a\u5f53\u524d\u4e0d\u9700\u8981 \/ \u5f53\u524d\u9700\u8981\u786e\u8ba4 xxx/u, "workflow spec must require the explicit human-action line"],
    [/Default intake output must not expose truth-chain detail/i, "workflow spec must hide Blueprint internal analysis by default"],
  ]);
}

function lintWorkflowEvidenceContract(filePath, failures, repoRoot) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const text = readFileOrFail(filePath, failures, repoRoot);
  if (text == null) {
    return;
  }

  const relativePath = relative(repoRoot, filePath);
  requirePatterns(text, relativePath, failures, [
    [/^## 8\.5 Evidence-Bound Version Creation$/m, "workflow spec must define evidence-bound version creation"],
    [/^## 8\.6 Acceptance Matrix Rules$/m, "workflow spec must define acceptance matrix rules"],
    [/^## 8\.7 Candidate Evidence Matrix Rules$/m, "workflow spec must define candidate evidence matrix rules"],
    [/^### 8\.7\.2 Queue Spec Anti-Over-Narrowing Contract$/m, "workflow spec must define the queue-spec anti-over-narrowing contract"],
    [/^## 8\.8 Evidence Lock Before Queue Activation$/m, "workflow spec must define evidence lock before queue activation"],
    [/^## 8\.9 Queue Claim Boundary$/m, "workflow spec must define queue claim boundaries"],
    [/^## 8\.10 Final Acceptance Coverage Review$/m, "workflow spec must define final acceptance coverage review"],
  ]);
}

function lintWorkflowGitSyncContract(filePath, failures, repoRoot) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const text = readFileOrFail(filePath, failures, repoRoot);
  if (text == null) {
    return;
  }

  const relativePath = relative(repoRoot, filePath);
  requirePatterns(text, relativePath, failures, [
    [/Every completed execution queue should form its own local `branch-commit`/u, "workflow spec must require a local commit for each completed execution queue"],
    [/Once a push is started, no later Blueprint scheduling action may continue until the push returns success or failure/u, "workflow spec must require waiting for push results before continuing Blueprint scheduling"],
    [/Every completed execution queue should attempt remote-sync after its queue-local branch-commit/u, "workflow spec must require per-queue remote-sync attempts"],
    [/Resume truth comes from the written governance docs, not branch memory or remote push status/u, "workflow spec must keep Blueprint resume independent from remote push status"],
    [/^### 12\.1 Explicit Operator-Directed Closure Or Suspension$/m, "workflow spec must define explicit operator-directed closure or suspension"],
    [/queue_status = suspended/u, "workflow spec must define suspended queue handling"],
    [/stop_reason = operator-requested-suspend/u, "workflow spec must define operator-requested version suspension"],
    [/^### 11\.2\.1 Post-Queue Closeout Pause Policy$/m, "workflow spec must define post-queue closeout pause policy"],
    [/post_queue_closeout_pause_policy = auto-continue/u, "workflow spec must define auto-continue as the default post-queue pause policy"],
    [/pause-when-explicitly-requested/u, "workflow spec must define explicit pause mode"],
    [/Restarted queue handling is still candidate handling until admission is legal/u, "workflow spec must keep restarted queues in candidate handling until lawful admission"],
    [/restarted queue may become active only after the current active queue closes/u, "workflow spec must prevent restarted queues from preempting active queues"],
    [/^### 11\.6 Candidate Backlog Refresh Before Version Review$/m, "workflow spec must define candidate backlog refresh before version review"],
    [/candidate_backlog_refresh_status/u, "workflow spec must define candidate backlog refresh status"],
    [/A `fresh` refresh with an empty candidate snapshot is the only lawful basis/u, "workflow spec must require fresh empty candidate snapshot before saying none"],
    [/must not require the operator to paste a queue doc/u, "workflow spec must require agents to refresh named queue docs without operator paste"],
  ]);
}

function lintEvidenceBoundTemplates(blueprintsRoot, failures, repoRoot) {
  const targetSpecTemplatePath = path.join(
    blueprintsRoot,
    "templates",
    "target-spec-template.md"
  );
  const targetPlanTemplatePath = path.join(
    blueprintsRoot,
    "templates",
    "target-plan-template.md"
  );
  const executionQueueTemplatePath = path.join(
    blueprintsRoot,
    "templates",
    "execution-queue-template.md"
  );

  if (fs.existsSync(targetSpecTemplatePath)) {
    const text = readFileOrFail(targetSpecTemplatePath, failures, repoRoot);
    if (text != null) {
      const relativePath = relative(repoRoot, targetSpecTemplatePath);
      requirePatterns(text, relativePath, failures, [
        [/^### Version Draft Summary$/m, "target spec template must include a Version Draft Summary section"],
        [/^### Evidence Draft Review$/m, "target spec template must include an Evidence Draft Review section"],
        [/^### Draft Requirement Coverage$/m, "target spec template must include Draft Requirement Coverage"],
        [/^### Acceptance Matrix$/m, "target spec template must include an Acceptance Matrix"],
        [/^### Final Acceptance Coverage Contract$/m, "target spec template must include a Final Acceptance Coverage Contract"],
      ]);
    }
  }

  if (fs.existsSync(targetPlanTemplatePath)) {
    const text = readFileOrFail(targetPlanTemplatePath, failures, repoRoot);
    if (text != null) {
      const relativePath = relative(repoRoot, targetPlanTemplatePath);
      requirePatterns(text, relativePath, failures, [
        [/^### Evidence Draft Summary$/m, "target plan template must include an Evidence Draft Summary"],
        [/^### Evidence Lock Rule$/m, "target plan template must include an Evidence Lock Rule"],
        [/^### Queue Spec Integrity Rule$/m, "target plan template must include a Queue Spec Integrity Rule section"],
        [/^### Candidate Evidence Matrix$/m, "target plan template must include a Candidate Evidence Matrix"],
        [/^### Candidate Queue Integrity Checklist$/m, "target plan template must include a Candidate Queue Integrity Checklist section"],
        [/^### Acceptance Coverage Ledger$/m, "target plan template must include an Acceptance Coverage Ledger"],
        [/Implementation Anchors/u, "target plan template candidate ledger must include implementation anchors"],
        [/Can Claim/u, "target plan template candidate ledger must include claim scope"],
        [/Cannot Claim/u, "target plan template candidate ledger must include non-claim scope"],
        [/Every completed execution queue should have its own local commit/u, "target plan template must require one local commit per completed queue"],
        [/Once push starts, wait for its success or failure result/u, "target plan template must require waiting for push results"],
        [/attempt remote-sync toward (the )?remote development trunk mod-first-dev/u, "target plan template must require remote-sync toward mod-first-dev"],
        [/Every completed execution queue should then attempt remote-sync toward mod-first-dev/u, "target plan template must require per-queue remote-sync attempts"],
        [/operator-requested-suspend/u, "target plan template must define operator-requested suspension"],
        [/post_queue_closeout_pause_policy/u, "target plan template must include post-queue closeout pause policy"],
        [/^### Post-Queue Closeout Pause Policy$/m, "target plan template must include a Post-Queue Closeout Pause Policy section"],
        [/If post_queue_closeout_pause_policy=auto-continue and the next legal step is unique/u, "target plan template must prevent default continuation prompts under auto-continue"],
        [/If a restarted queue requires document updates/u, "target plan template must route restarted queues through candidate updates"],
        [/A restarted queue must not stop, replace, preempt, or immediately become the current active execution queue/u, "target plan template must prevent restarted queues from preempting active queues"],
        [/^### Candidate Backlog Refresh Rule$/m, "target plan template must include a Candidate Backlog Refresh Rule section"],
        [/candidate_backlog_refresh_status/u, "target plan template must include candidate backlog refresh status"],
        [/candidate_backlog_snapshot/u, "target plan template must include candidate backlog snapshot"],
        [/Do not answer no candidate queues remain unless candidate_backlog_refresh_status=fresh/u, "target plan template must block no-candidate answers until refresh is fresh"],
        [/Do not require the operator to paste a queue doc/u, "target plan template must require named queue docs to be refreshed without operator paste"],
      ]);
    }
  }

  if (fs.existsSync(executionQueueTemplatePath)) {
    const text = readFileOrFail(executionQueueTemplatePath, failures, repoRoot);
    if (text != null) {
      const relativePath = relative(repoRoot, executionQueueTemplatePath);
      requirePatterns(text, relativePath, failures, [
        [/^### Evidence Lock$/m, "execution queue template must include an Evidence Lock section"],
        [/^### Claim Boundary$/m, "execution queue template must include a Claim Boundary section"],
        [/^#### Can Claim$/m, "execution queue template must include Can Claim"],
        [/^#### Cannot Claim$/m, "execution queue template must include Cannot Claim"],
        [/^#### Capability Floor$/m, "execution queue template must include Capability Floor"],
        [/^#### Parent Capability Coverage$/m, "execution queue template must include Parent Capability Coverage"],
        [/^#### User Path Coverage Matrix$/m, "execution queue template must include User Path Coverage Matrix"],
        [/^#### Functional Loss Budget$/m, "execution queue template must include Functional Loss Budget"],
        [/^#### Replacement Proof$/m, "execution queue template must include Replacement Proof"],
        [/^#### Implementation Anchors$/m, "execution queue template must include Implementation Anchors"],
        [/^### Queue Spec Integrity Rule$/m, "execution queue template must include a Queue Spec Integrity Rule section"],
        [/- owned_closure:/u, "execution queue template must include owned_closure in Parent Capability Coverage"],
        [/- preserved_not_owned:/u, "execution queue template must include preserved_not_owned in Parent Capability Coverage"],
        [/- routed_elsewhere:/u, "execution queue template must include routed_elsewhere in Parent Capability Coverage"],
        [/- leave_return_or_followup_paths:/u, "execution queue template must include leave_return_or_followup_paths in User Path Coverage Matrix"],
        [/- rejection_or_error_paths:/u, "execution queue template must include rejection_or_error_paths in User Path Coverage Matrix"],
        [/- old_truth_owner_exit_proof:/u, "execution queue template must include old_truth_owner_exit_proof in Replacement Proof"],
        [/functional_loss_audit:/u, "execution queue template must include functional_loss_audit"],
        [/capability_floor_verification:/u, "execution queue template must include capability_floor_verification"],
        [/user_path_matrix_verification:/u, "execution queue template must include user_path_matrix_verification"],
        [/placeholder_or_legacy_fallback_audit:/u, "execution queue template must include placeholder_or_legacy_fallback_audit"],
        [/task\.replace-me\.evidence-anchor-reconcile/u, "execution queue template must include evidence-anchor-reconcile as the first task"],
        [/Every completed execution queue should produce one local commit/u, "execution queue template must require one local commit per completed queue"],
        [/Once push starts, wait for its success or failure result/u, "execution queue template must require waiting for push results"],
        [/attempted remote-sync toward mod-first-dev/u, "execution queue template must define attempted remote-sync toward mod-first-dev"],
        [/Every completed execution queue should then attempt remote-sync toward mod-first-dev/u, "execution queue template must require per-queue remote-sync attempts"],
        [/queue_status=suspended/u, "execution queue template must define suspended queue handling"],
      ]);
    }
  }
}

function lintTargetPlanOperatorContract(filePath, failures, repoRoot) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const text = readFileOrFail(filePath, failures, repoRoot);
  if (text == null) {
    return;
  }

  const relativePath = relative(repoRoot, filePath);
  requirePatterns(text, relativePath, failures, [
    [/^### Operator Intake Contract$/m, "version plan must include an Operator Intake Contract section"],
    [/\u65b0\u9700\u6c42/u, "version plan must limit operator intake to `???`"],
    [/\u53c2\u8003\u6cbb\u7406\u89c4\u8303/u, "version plan must limit operator intake to `??????`"],
    [/\u5904\u7406\u7ed3\u679c\uff1a/u, "version plan must publish the fixed operator receipt block"],
    [/\u5f53\u524d\u6267\u884c\u60c5\u51b5\uff1a/u, "version plan must publish the current-execution receipt block"],
    [/\u4eba\u5de5\u64cd\u4f5c\uff1a\u5f53\u524d\u4e0d\u9700\u8981 \/ \u5f53\u524d\u9700\u8981\u786e\u8ba4 xxx/u, "version plan must publish the explicit human-action receipt line"],
    [/\u9ed8\u8ba4\u4e0d\u5411\u4eba\u5de5\u66b4\u9732\u771f\u503c\u94fe\u7ec6\u8282/u, "version plan must default-hide Blueprint internal analysis"],
  ]);
}

function lintQueueOperatorSnapshotContract(filePath, failures, repoRoot) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const text = readFileOrFail(filePath, failures, repoRoot);
  if (text == null) {
    return;
  }

  const relativePath = relative(repoRoot, filePath);
  requirePatterns(text, relativePath, failures, [
    [/^### Operator Snapshot Contract$/m, "execution queue template must include an Operator Snapshot Contract section"],
    [/\u5f53\u524d\u6267\u884c\u961f\u5217.*queue_id/u, "execution queue template must map ?????? to queue_id"],
    [/\u5f53\u524d\u4efb\u52a1.*active_task/u, "execution queue template must map ???? to active_task"],
    [/\u5f53\u524d\u961f\u5217\u76ee\u6807.*queue_goal/u, "execution queue template must map ?????? to queue_goal"],
  ]);
}

function lintReadableQueueOperatorSnapshotContract(filePath, failures, repoRoot) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const text = readFileOrFail(filePath, failures, repoRoot);
  if (text == null) {
    return;
  }

  const relativePath = relative(repoRoot, filePath);
  requirePatterns(text, relativePath, failures, [
    [/^### Operator Snapshot Contract$/m, "execution queue template must include an Operator Snapshot Contract section"],
    [/\u5f53\u524d\u6267\u884c\u961f\u5217.*queue_id/u, "execution queue template must map ?????? to queue_id"],
    [/\u5f53\u524d\u4efb\u52a1.*active_task/u, "execution queue template must map ???? to active_task"],
    [/\u5f53\u524d\u961f\u5217\u76ee\u6807.*queue_goal/u, "execution queue template must map ?????? to queue_goal"],
  ]);
}

function lintTargetPlan(filePath, failures, repoRoot, label) {
  const text = readFileOrFail(filePath, failures, repoRoot);
  if (text == null) {
    return;
  }

  const relativePath = relative(repoRoot, filePath);
  const isTemplate = relativePath.includes("/templates/");
  const versionStatus = matchField(text, "version_status");
  rejectQueueLocalSyncFields(text, relativePath, failures, label);

  if (/^- next_legal_action:/m.test(text)) {
    failures.push(
      `${relativePath}: ${label} must not contain next_legal_action prose; use next_action enum instead`
    );
  }

  if (/^### Current Decision$/m.test(text)) {
    failures.push(
      `${relativePath}: ${label} must not keep a Current Decision prose block; Control Block must stand alone`
    );
  }

  requireFieldValue(
    text,
    "version_status",
    relativePath,
    failures,
    `${relativePath}: ${label} missing Control Block field "version_status"`
  );
  if (/^- target_status:/m.test(text)) {
    failures.push(
      `${relativePath}: ${label} must not use legacy target_status; use version_status`
    );
  }

  const nextAction = requireFieldValue(
    text,
    "next_action",
    relativePath,
    failures,
    `${label} missing Control Block field "next_action"`
  );
  if (!isTemplate && nextAction != null && !allowedVersionNextActions.has(nextAction)) {
    failures.push(
      `${relativePath}: ${label} next_action "${nextAction}" is not an allowed enum value`
    );
  }

  const nextDecision = requireFieldValue(
    text,
    "next_decision",
    relativePath,
    failures,
    `${label} missing Control Block field "next_decision"`
  );
  if (!isTemplate && nextDecision != null && !allowedVersionNextDecisions.has(nextDecision)) {
    failures.push(
      `${relativePath}: ${label} next_decision "${nextDecision}" is not an allowed enum value`
    );
  }

  const postQueueCloseoutPausePolicy = requireFieldValue(
    text,
    "post_queue_closeout_pause_policy",
    relativePath,
    failures,
    `${relativePath}: ${label} missing Control Block field "post_queue_closeout_pause_policy"`
  );
  if (
    !isTemplate &&
    postQueueCloseoutPausePolicy != null &&
    !allowedPostQueueCloseoutPausePolicies.has(postQueueCloseoutPausePolicy)
  ) {
    failures.push(
      `${relativePath}: ${label} post_queue_closeout_pause_policy "${postQueueCloseoutPausePolicy}" is not an allowed enum value`
    );
  }

  for (const requiredField of [
    "review_subject_id",
    "review_subject_classification",
    "proposed_queue_id",
    "review_basis",
    "admission_status",
    "intake_status",
    "intake_item_id",
    "intake_summary",
    "intake_result",
    "intake_feedback_mode",
    "stop_reason",
    "stop_basis",
    "next_unblocked_action",
    "human_input_required",
  ]) {
    requireFieldValue(
      text,
      requiredField,
      relativePath,
      failures,
      `${relativePath}: ${label} missing Control Block field "${requiredField}"`
    );
  }

  const closureRoutingValues = Object.fromEntries(
    closureRoutingFields.map((fieldName) => [
      fieldName,
      requireFieldValue(
        text,
        fieldName,
        relativePath,
        failures,
        `${relativePath}: ${label} closure routing requires Control Block field "${fieldName}"`
      ),
    ])
  );

  const admissionStatus = matchField(text, "admission_status");
  if (!isTemplate && admissionStatus != null && !allowedAdmissionStatuses.has(admissionStatus)) {
    failures.push(
      `${relativePath}: ${label} admission_status "${admissionStatus}" is not an allowed enum value`
    );
  }

  const intakeStatus = matchField(text, "intake_status");
  const intakeItemId = matchField(text, "intake_item_id");
  const intakeSummary = matchField(text, "intake_summary");
  const intakeResult = matchField(text, "intake_result");
  const intakeFeedbackMode = matchField(text, "intake_feedback_mode");

  if (!isTemplate && intakeStatus != null && !allowedIntakeStatuses.has(intakeStatus)) {
    failures.push(
      `${relativePath}: ${label} intake_status "${intakeStatus}" is not an allowed enum value`
    );
  }

  if (!isTemplate && intakeResult != null && !allowedIntakeResults.has(intakeResult)) {
    failures.push(
      `${relativePath}: ${label} intake_result "${intakeResult}" is not an allowed enum value`
    );
  }

  if (
    !isTemplate &&
    intakeFeedbackMode != null &&
    !allowedIntakeFeedbackModes.has(intakeFeedbackMode)
  ) {
    failures.push(
      `${relativePath}: ${label} intake_feedback_mode "${intakeFeedbackMode}" is not an allowed enum value`
    );
  }

  const closureReviewStatus = closureRoutingValues.closure_review_status;
  const residueCandidateFamily = closureRoutingValues.residue_candidate_family;
  const autoAdmissionReady = closureRoutingValues.auto_admission_ready;
  const stopReason = matchField(text, "stop_reason");
  const stopBasis = matchField(text, "stop_basis");
  const nextUnblockedAction = matchField(text, "next_unblocked_action");
  const humanInputRequired = matchField(text, "human_input_required");

  if (
    !isTemplate &&
    closureReviewStatus != null &&
    !allowedClosureReviewStatuses.has(closureReviewStatus)
  ) {
    failures.push(
      `${relativePath}: ${label} closure_review_status "${closureReviewStatus}" is not an allowed enum value`
    );
  }

  if (
    !isTemplate &&
    residueCandidateFamily != null &&
    !allowedResidueFamilies.has(residueCandidateFamily)
  ) {
    failures.push(
      `${relativePath}: ${label} residue_candidate_family "${residueCandidateFamily}" is not an allowed enum value`
    );
  }

  if (
    !isTemplate &&
    autoAdmissionReady != null &&
    !allowedBooleanStrings.has(autoAdmissionReady)
  ) {
    failures.push(
      `${relativePath}: ${label} auto_admission_ready "${autoAdmissionReady}" is not an allowed boolean value`
    );
  }

  if (!isTemplate && stopReason != null && !allowedStopReasons.has(stopReason)) {
    failures.push(
      `${relativePath}: ${label} stop_reason "${stopReason}" is not an allowed enum value`
    );
  }

  const activeQueue = matchField(text, "active_queue");
  const decisionState = matchField(text, "decision_state");
  const reviewSubjectClassification = matchField(
    text,
    "review_subject_classification"
  );
  const reviewSubjectId = matchField(text, "review_subject_id");
  const proposedQueueId = matchField(text, "proposed_queue_id");
  const reviewBasis = matchField(text, "review_basis");
  const blockedByEntries = extractListEntries(text, "blocked_by");
  const closureReviewSubject = closureRoutingValues.closure_review_subject;
  const residueCandidateId = closureRoutingValues.residue_candidate_id;
  const routingBasis = closureRoutingValues.routing_basis;
  const nextLawfulQueueRecommendation =
    closureRoutingValues.next_lawful_queue_recommendation;
  const allowsExplicitContinuationTruth =
    activeQueue != null &&
    activeQueue !== "none" &&
    decisionState === "active-execution" &&
    isExplicitContinuationAction(nextUnblockedAction);

  if (
    !isTemplate &&
    nextUnblockedAction != null &&
    nextUnblockedAction !== "none" &&
    !allowedVersionNextActions.has(nextUnblockedAction) &&
    !allowsExplicitContinuationTruth
  ) {
    failures.push(
      `${relativePath}: ${label} next_unblocked_action "${nextUnblockedAction}" is not an allowed enum value`
    );
  }

  if (
    !isTemplate &&
    humanInputRequired != null &&
    !allowedBooleanStrings.has(humanInputRequired)
  ) {
    failures.push(
      `${relativePath}: ${label} human_input_required "${humanInputRequired}" is not an allowed boolean value`
    );
  }
  const hasClosureRoutingTruth = [
    closureReviewSubject,
    closureReviewStatus,
    residueCandidateId,
    residueCandidateFamily,
    routingBasis,
    nextLawfulQueueRecommendation,
  ].some((value) => value != null && value !== "none") || autoAdmissionReady === "true";

  if (!isTemplate && activeQueue === "none" && decisionState === "active-execution") {
    failures.push(
      `${relativePath}: ${label} cannot keep decision_state=active-execution when active_queue=none`
    );
  }

  if (
    !isTemplate &&
    activeQueue !== "none" &&
    activeQueue != null &&
    decisionState !== "active-execution"
  ) {
    failures.push(
      `${relativePath}: ${label} must keep decision_state=active-execution while an active_queue is named`
    );
  }

  if (!isTemplate && nextAction === "resume-active-queue" && activeQueue === "none") {
    failures.push(
      `${relativePath}: ${label} cannot use next_action=resume-active-queue while active_queue=none`
    );
  }

  if (!isTemplate && admissionStatus === "admitted" && activeQueue === "none") {
    failures.push(
      `${relativePath}: ${label} cannot keep admission_status=admitted while active_queue=none`
    );
  }

  if (
    !isTemplate &&
    reviewSubjectClassification === "queue-candidate" &&
    (proposedQueueId == null || proposedQueueId === "none")
  ) {
    failures.push(
      `${relativePath}: ${label} must name proposed_queue_id when review_subject_classification=queue-candidate`
    );
  }

  if (
    !isTemplate &&
    activeQueue !== "none" &&
    [reviewSubjectId, reviewSubjectClassification, proposedQueueId, reviewBasis, admissionStatus]
      .some((value) => value != null && value !== "none")
  ) {
    failures.push(
      `${relativePath}: ${label} must not keep a live admission review subject while active_queue=${activeQueue}`
    );
  }

  if (
    !isTemplate &&
    blockedByEntries.some((entry) => isRepositorySyncMirror(entry))
  ) {
    failures.push(
      `${relativePath}: ${label} blocked_by must not mirror merge conflict or repository sync state as version-level blocker truth`
    );
  }

  if (
    !isTemplate &&
    intakeStatus === "none" &&
    [intakeItemId, intakeSummary, intakeResult, intakeFeedbackMode].some(
      (value) => value != null && value !== "none"
    )
  ) {
    failures.push(
      `${relativePath}: ${label} intake_status=none requires intake_item_id/intake_summary/intake_result/intake_feedback_mode to all be none`
    );
  }

  if (!isTemplate && intakeStatus != null && intakeStatus !== "none") {
    if (intakeItemId == null || intakeItemId === "none") {
      failures.push(
        `${relativePath}: ${label} must name intake_item_id while intake_status=${intakeStatus}`
      );
    }

    if (intakeSummary == null || intakeSummary === "none") {
      failures.push(
        `${relativePath}: ${label} must keep intake_summary while intake_status=${intakeStatus}`
      );
    }

    if (intakeFeedbackMode == null || intakeFeedbackMode === "none") {
      failures.push(
        `${relativePath}: ${label} must keep intake_feedback_mode while intake_status=${intakeStatus}`
      );
    }

    if (intakeStatus === "evaluating" && intakeResult !== "none") {
      failures.push(
        `${relativePath}: ${label} intake_status=evaluating requires intake_result=none until evaluation resolves`
      );
    }

    if (intakeStatus !== "evaluating" && (intakeResult == null || intakeResult === "none")) {
      failures.push(
        `${relativePath}: ${label} must keep intake_result while intake_status=${intakeStatus}`
      );
    }
  }

  if (
    !isTemplate &&
    hasClosureRoutingTruth &&
    [closureReviewSubject, closureReviewStatus, routingBasis].some(
      (value) => value == null || value === "none"
    )
  ) {
    failures.push(
      `${relativePath}: ${label} closure routing requires closure_review_subject, closure_review_status, and routing_basis before residue routing can be recorded`
    );
  }

  if (
    !isTemplate &&
    residueCandidateFamily === "same-family" &&
    (nextLawfulQueueRecommendation == null || nextLawfulQueueRecommendation === "none")
  ) {
    failures.push(
      `${relativePath}: ${label} residue_candidate_family=same-family requires next_lawful_queue_recommendation to name the next lawful queue`
    );
  }

  if (
    !isTemplate &&
    autoAdmissionReady === "true" &&
    (
      residueCandidateId == null ||
      residueCandidateId === "none" ||
      nextLawfulQueueRecommendation == null ||
      nextLawfulQueueRecommendation === "none"
    )
  ) {
    failures.push(
      `${relativePath}: ${label} auto_admission_ready=true requires a structured residue candidate and recommendation`
    );
  }

  if (
    !isTemplate &&
    stopReason === "none" &&
    (
      (stopBasis != null && stopBasis !== "none") ||
      (
        nextUnblockedAction != null &&
        nextUnblockedAction !== "none" &&
        !allowsExplicitContinuationTruth
      ) ||
      humanInputRequired === "true"
    )
  ) {
    failures.push(
      `${relativePath}: ${label} stop_reason=none requires stop_basis=none and human_input_required=false; next_unblocked_action may be non-none only for an explicit active-queue continuation`
    );
  }

  if (!isTemplate && stopReason === "operator-requested-suspend") {
    if (
      stopBasis == null ||
      stopBasis === "none" ||
      nextUnblockedAction == null ||
      nextUnblockedAction === "none" ||
      humanInputRequired !== "false"
    ) {
      failures.push(
        `${relativePath}: ${label} stop_reason=operator-requested-suspend requires stop_basis, next_unblocked_action, and human_input_required=false`
      );
    }
  } else if (
    !isTemplate &&
    stopReason != null &&
    stopReason !== "none" &&
    (
      stopBasis == null ||
      stopBasis === "none" ||
      nextUnblockedAction == null ||
      nextUnblockedAction === "none" ||
      humanInputRequired !== "true"
    )
  ) {
    failures.push(
      `${relativePath}: ${label} stop_reason=${stopReason} requires stop_basis, next_unblocked_action, and human_input_required=true`
    );
  }

  if ((isTemplate || versionStatus === "open") && !/^### Candidate Backlog Refresh Rule$/m.test(text)) {
    failures.push(
      `${relativePath}: ${label} with version_status=open must include a Candidate Backlog Refresh Rule section`
    );
  }
}

function lintTargetSpec(filePath, failures, repoRoot, label) {
  const text = readFileOrFail(filePath, failures, repoRoot);
  if (text == null) {
    return;
  }

  const relativePath = relative(repoRoot, filePath);
  rejectQueueLocalSyncFields(text, relativePath, failures, label);

  if (/^### Queue Portfolio$/m.test(text)) {
    failures.push(
      `${relativePath}: ${label} must use "Queue Contract Portfolio" instead of runtime-style "Queue Portfolio"`
    );
  }

  if (/^\| Queue ID \| Class \| State \| Promote When \| Source \|$/m.test(text)) {
    failures.push(
      `${relativePath}: ${label} Queue Portfolio must not include runtime State/Source columns`
    );
  }

  if (!/^### Queue Contract Portfolio$/m.test(text)) {
    failures.push(
      `${relativePath}: ${label} missing "Queue Contract Portfolio" section`
    );
  }
}

function lintQueueDocs(queueDir, failures, repoRoot, activeVersionId) {
  if (!fs.existsSync(queueDir)) {
    return;
  }

  for (const entry of fs.readdirSync(queueDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) {
      continue;
    }

    const filePath = path.join(queueDir, entry.name);
    lintQueueDoc(filePath, failures, repoRoot, false, activeVersionId);
  }
}

function lintQueueDoc(filePath, failures, repoRoot, isTemplate, activeVersionId = null) {
  const text = readFileOrFail(filePath, failures, repoRoot);
  if (text == null) {
    return;
  }

  const relativePath = relative(repoRoot, filePath);
  const head = text.split(/\r?\n/u).slice(0, 35).join("\n");
  const ownerVersion =
    matchField(head, "belongs_to_version") ??
    matchField(head, "belongs_to_target");

  for (const requiredField of [
    "queue_status",
    "active_task",
    "closeout_status",
    "next_effect",
  ]) {
    if (!new RegExp(`^- ${escapeRegExp(requiredField)}:`, "m").test(head)) {
      failures.push(
        `${relativePath}: queue Control Block missing "${requiredField}"`
      );
    }
  }

  if (/^- status:/m.test(head)) {
    failures.push(
      `${relativePath}: queue Control Block must not use legacy status field; use queue_status`
    );
  }

  const queueStatus = matchField(head, "queue_status");
  const activeTask = matchField(head, "active_task");
  const syncStatus = matchField(head, "sync_status");
  const syncScope = matchField(head, "sync_scope");
  const syncSummary = matchField(head, "sync_summary");
  const queueSnapshotRequired = isTemplate || queueStatus === "active";
  const queueSnapshotFields = [
    "queue_goal",
    "task_count",
    "completed_task_count",
    "remaining_task_count",
    "active_task_summary",
    "task_briefs",
  ];
  const queueSnapshotValues = Object.fromEntries(
    queueSnapshotFields.map((fieldName) => [fieldName, matchField(text, fieldName)])
  );
  const queueClosureValues = Object.fromEntries(
    queueClosureJudgementFields.map((fieldName) => [fieldName, matchField(text, fieldName)])
  );
  const taskLedgerIds = extractTaskLedgerIds(text);
  const taskDefinitions = extractTaskDefinitions(text);
  const taskDefinitionIds = taskDefinitions.map((definition) => definition.taskId);
  const closureJudgementInScope =
    isTemplate ||
    [
      "execution_closeout_status",
      "topic_closure_status",
      "closure_basis",
      "residue_family",
      "residue_routing_status",
      "next_family_candidate",
      "auto_continue_eligible",
    ].some((fieldName) => queueClosureValues[fieldName] != null);
  const requiresActiveVersionClaimStructure =
    isTemplate ||
    (
      activeVersionId != null &&
      ownerVersion === activeVersionId &&
      /^### Claim Boundary$/m.test(text)
    );

  if (!isTemplate && queueStatus != null && !allowedQueueStatuses.has(queueStatus)) {
    failures.push(
      `${relativePath}: queue_status=${queueStatus} is not an allowed queue status`
    );
  }

  if (
    !isTemplate &&
    /^(active|blocked)$/u.test(queueStatus ?? "") &&
    /^- belongs_to_target:/m.test(head)
  ) {
    failures.push(
      `${relativePath}: governed queue docs must not use legacy belongs_to_target; use belongs_to_version`
    );
  }

  if (
    !isTemplate &&
    queueStatus !== "active" &&
    activeTask != null &&
    activeTask !== "none"
  ) {
    failures.push(
      `${relativePath}: queue must not keep active_task=${activeTask} while queue_status=${queueStatus}`
    );
  }

  if (isTemplate || queueStatus === "active" || queueStatus === "blocked") {
    for (const fieldName of ["sync_status", "sync_scope", "sync_summary"]) {
      if (!new RegExp(`^- ${escapeRegExp(fieldName)}:`, "m").test(head)) {
        failures.push(
          `${relativePath}: queue Control Block missing repository sync record field "${fieldName}"`
        );
      }
    }
  }

  if (!isTemplate && syncStatus != null && !allowedSyncStatuses.has(syncStatus)) {
    failures.push(
      `${relativePath}: sync_status=${syncStatus} is not an allowed repository sync status`
    );
  }

  if (!isTemplate && syncScope != null && !allowedSyncScopes.has(syncScope)) {
    failures.push(
      `${relativePath}: sync_scope=${syncScope} is not an allowed repository sync scope`
    );
  }

  const blockedByEntries = extractListEntries(head, "blocked_by");
  if (
    blockedByEntries.some((entry) => isRepositorySyncMirror(entry))
  ) {
    failures.push(
      `${relativePath}: queue blocked_by must not mirror merge conflict or repository sync state as execution blockers`
    );
  }

  if (closureJudgementInScope) {
    for (const fieldName of queueClosureJudgementFields) {
      if (queueClosureValues[fieldName] == null) {
        failures.push(
          `${relativePath}: queue closeout judgement requires Control Block field "${fieldName}"`
        );
      }
    }
  }

  if (
    !isTemplate &&
    queueClosureValues.execution_closeout_status != null &&
    !allowedExecutionCloseoutStatuses.has(queueClosureValues.execution_closeout_status)
  ) {
    failures.push(
      `${relativePath}: execution_closeout_status="${queueClosureValues.execution_closeout_status}" is not an allowed queue closeout value`
    );
  }

  if (
    !isTemplate &&
    queueClosureValues.topic_closure_status != null &&
    !allowedTopicClosureStatuses.has(queueClosureValues.topic_closure_status)
  ) {
    failures.push(
      `${relativePath}: topic_closure_status="${queueClosureValues.topic_closure_status}" is not an allowed topic closure value`
    );
  }

  if (
    !isTemplate &&
    queueClosureValues.residue_family != null &&
    !allowedResidueFamilies.has(queueClosureValues.residue_family)
  ) {
    failures.push(
      `${relativePath}: residue_family="${queueClosureValues.residue_family}" is not an allowed residue family`
    );
  }

  if (
    !isTemplate &&
    queueClosureValues.residue_routing_status != null &&
    !allowedResidueRoutingStatuses.has(queueClosureValues.residue_routing_status)
  ) {
    failures.push(
      `${relativePath}: residue_routing_status="${queueClosureValues.residue_routing_status}" is not an allowed routing status`
    );
  }

  if (
    !isTemplate &&
    queueClosureValues.auto_continue_eligible != null &&
    !allowedBooleanStrings.has(queueClosureValues.auto_continue_eligible)
  ) {
    failures.push(
      `${relativePath}: auto_continue_eligible="${queueClosureValues.auto_continue_eligible}" is not an allowed boolean value`
    );
  }

  if (
    !isTemplate &&
    queueClosureValues.topic_closure_status === "closed" &&
    queueClosureValues.residue_remaining === "yes"
  ) {
    failures.push(
      `${relativePath}: topic_closure_status=closed cannot coexist with residue_remaining=yes`
    );
  }

  if (
    !isTemplate &&
    queueClosureValues.residue_family === "same-family" &&
    (queueClosureValues.next_family_candidate == null ||
      queueClosureValues.next_family_candidate === "none")
  ) {
    failures.push(
      `${relativePath}: residue_family=same-family requires next_family_candidate to name the continuation`
    );
  }

  if (
    !isTemplate &&
    queueClosureValues.auto_continue_eligible === "true" &&
    (queueClosureValues.next_family_candidate == null ||
      queueClosureValues.next_family_candidate === "none")
  ) {
    failures.push(
      `${relativePath}: auto_continue_eligible=true requires a named continuation`
    );
  }

  if (queueSnapshotRequired) {
    if (!/^### Queue Snapshot$/m.test(text)) {
      failures.push(
        `${relativePath}: active queue docs must include a Queue Snapshot section`
      );
    }

    for (const fieldName of queueSnapshotFields) {
      if (!new RegExp(`^- ${escapeRegExp(fieldName)}:`, "m").test(text)) {
        failures.push(`${relativePath}: Queue Snapshot missing "${fieldName}"`);
      }
    }
  }

  if (requiresActiveVersionClaimStructure) {
    requirePatterns(text, relativePath, failures, [
      [/^#### Parent Capability Coverage$/m, "active-version queue docs must include a Parent Capability Coverage section"],
      [/^#### Capability Floor$/m, "active-version queue docs must include a Capability Floor section"],
      [/^#### User Path Coverage Matrix$/m, "active-version queue docs must include a User Path Coverage Matrix section"],
      [/^#### Functional Loss Budget$/m, "active-version queue docs must include a Functional Loss Budget section"],
      [/^#### Replacement Proof$/m, "active-version queue docs must include a Replacement Proof section"],
      [/^### Completion Completeness Review$/m, "active-version queue docs must include a Completion Completeness Review section"],
      [/^- owned_closure:/m, "active-version queue docs must record owned_closure in Parent Capability Coverage"],
      [/^- preserved_not_owned:/m, "active-version queue docs must record preserved_not_owned in Parent Capability Coverage"],
      [/^- routed_elsewhere:/m, "active-version queue docs must record routed_elsewhere in Parent Capability Coverage"],
      [/^- leave_return_or_followup_paths:/m, "active-version queue docs must record leave_return_or_followup_paths in User Path Coverage Matrix"],
      [/^- rejection_or_error_paths:/m, "active-version queue docs must record rejection_or_error_paths in User Path Coverage Matrix"],
      [/^- functional_loss_audit:/m, "active-version queue docs must record functional_loss_audit in Completion Completeness Review"],
      [/^- capability_floor_verification:/m, "active-version queue docs must record capability_floor_verification in Completion Completeness Review"],
      [/^- user_path_matrix_verification:/m, "active-version queue docs must record user_path_matrix_verification in Completion Completeness Review"],
      [/^- replacement_proof_summary:/m, "active-version queue docs must record replacement_proof_summary in Completion Completeness Review"],
      [/^- placeholder_or_legacy_fallback_audit:/m, "active-version queue docs must record placeholder_or_legacy_fallback_audit in Completion Completeness Review"],
      [/^- previous_owner_or_path:/m, "active-version queue docs must record previous_owner_or_path in Replacement Proof"],
      [/^- new_owner_or_path:/m, "active-version queue docs must record new_owner_or_path in Replacement Proof"],
      [/^- behavior_preservation_expectation:/m, "active-version queue docs must record behavior_preservation_expectation in Replacement Proof"],
      [/^- old_truth_owner_exit_proof:/m, "active-version queue docs must record old_truth_owner_exit_proof in Replacement Proof"],
      [/^- verification_evidence:/m, "active-version queue docs must record verification_evidence in Replacement Proof"],
    ]);
  }

  if (
    queueSnapshotRequired &&
    queueSnapshotValues.task_count != null &&
    Number.isFinite(Number(queueSnapshotValues.task_count)) &&
    Number(queueSnapshotValues.task_count) !== taskLedgerIds.length
  ) {
    failures.push(
      `${relativePath}: Queue Snapshot task_count=${queueSnapshotValues.task_count} does not match Task Ledger count ${taskLedgerIds.length}`
    );
  }

  if (queueStatus === "active") {
    if (activeTask == null || activeTask === "none") {
      failures.push(`${relativePath}: active queues must expose a non-none active_task`);
    }

    if (activeTask != null && activeTask !== "none" && !taskLedgerIds.includes(activeTask)) {
      failures.push(
        `${relativePath}: active_task=${activeTask} is missing from the queue task ledger`
      );
    }

    if (
      activeTask != null &&
      activeTask !== "none" &&
      !taskDefinitionIds.includes(activeTask)
    ) {
      failures.push(
        `${relativePath}: active_task=${activeTask} is missing from task definitions`
      );
    }
  }

  if (queueSnapshotRequired) {
    for (const taskId of taskLedgerIds) {
      if (!taskDefinitionIds.includes(taskId)) {
        failures.push(
          `${relativePath}: task ledger entry ${taskId} is missing from task definitions`
        );
      }
    }

    for (const definition of taskDefinitions) {
      if (!definition.hasTaskBrief) {
        failures.push(
          `${relativePath}: task definition ${definition.taskId} is missing required task_brief`
        );
      }

      if (!definition.hasTaskOutcomeSummary) {
        failures.push(
          `${relativePath}: task definition ${definition.taskId} is missing required task_outcome_summary`
        );
      }
    }
  }

  if (queueStatus === "done") {
    const disallowedPatterns = [
      /^### Execution State$/m,
      /^## Next Executable Task$/m,
      /^## Candidate Backlog$/m,
      /Current Focus:/m,
      /Active Task:/m,
      /Next Step:/m,
    ];
    for (const pattern of disallowedPatterns) {
      if (pattern.test(text)) {
        failures.push(
          `${relativePath}: done queue still contains live execution label matching ${pattern}`
        );
      }
    }
  }
}

function lintCrossDocumentConsistency(
  projectProgressPath,
  blueprintPath,
  targetPlanPath,
  failures,
  repoRoot
) {
  if (
    !fs.existsSync(projectProgressPath) ||
    !fs.existsSync(blueprintPath) ||
    !fs.existsSync(targetPlanPath)
  ) {
    return;
  }

  const projectProgressText = fs.readFileSync(projectProgressPath, "utf8");
  const blueprintText = fs.readFileSync(blueprintPath, "utf8");
  const targetPlanText = fs.readFileSync(targetPlanPath, "utf8");

  const projectActiveTarget = matchField(projectProgressText, "active_version");
  const blueprintActiveTarget = matchField(blueprintText, "active_version");
  if (
    projectActiveTarget != null &&
    blueprintActiveTarget != null &&
    projectActiveTarget !== blueprintActiveTarget
  ) {
    failures.push(
      `${relative(repoRoot, projectProgressPath)}: active_version must match blueprint active_version`
    );
  }

  const hasActiveQueue = matchField(projectProgressText, "has_active_queue");
  const activeQueue = matchField(targetPlanText, "active_queue");
  if (hasActiveQueue === "false" && activeQueue != null && activeQueue !== "none") {
    failures.push(
      `${relative(repoRoot, projectProgressPath)}: has_active_queue=false conflicts with target plan active_queue=${activeQueue}`
    );
  }

  const blueprintExecutionMode = matchField(blueprintText, "execution_mode");
  const blueprintAllowParallel = matchField(blueprintText, "allow_parallel");
  const activeQueueDocs = collectActiveQueueDocs(path.join(repoRoot, "docs", "blueprints", "queues"));

  if (
    blueprintExecutionMode === "single-active-task" &&
    blueprintAllowParallel === "false" &&
    activeQueueDocs.length > 1
  ) {
    failures.push(
      `${relative(repoRoot, blueprintPath)}: single-active-task + allow_parallel=false cannot coexist with multiple active queue docs (${activeQueueDocs.join(", ")})`
    );
  }

  if (activeQueue === "none" && activeQueueDocs.length > 0) {
    failures.push(
      `${relative(repoRoot, targetPlanPath)}: active_queue=none conflicts with active queue docs (${activeQueueDocs.join(", ")})`
    );
  }

  if (activeQueue != null && activeQueue !== "none") {
    if (activeQueueDocs.length === 0) {
      failures.push(
        `${relative(repoRoot, targetPlanPath)}: active_queue=${activeQueue} has no matching active queue doc`
      );
    } else if (activeQueueDocs.length > 1 || activeQueueDocs[0] !== activeQueue) {
      failures.push(
        `${relative(repoRoot, targetPlanPath)}: active_queue=${activeQueue} conflicts with active queue docs (${activeQueueDocs.join(", ")})`
      );
    }
  }
}

function collectActiveQueueDocs(queueDir) {
  if (!fs.existsSync(queueDir)) {
    return [];
  }

  const activeQueueIds = [];

  for (const entry of fs.readdirSync(queueDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) {
      continue;
    }

    const filePath = path.join(queueDir, entry.name);
    const text = fs.readFileSync(filePath, "utf8");
    const queueStatus = matchField(text, "queue_status");
    const queueId = matchField(text, "queue_id");

    if (queueStatus === "active" && queueId != null) {
      activeQueueIds.push(queueId);
    }
  }

  return activeQueueIds.sort();
}

function requirePatterns(text, relativePath, failures, checks) {
  for (const [pattern, message] of checks) {
    if (!pattern.test(text)) {
      failures.push(`${relativePath}: ${message}`);
    }
  }
}

function extractTaskLedgerIds(text) {
  const taskIds = [];
  for (const match of text.matchAll(/^\| `([^`]+)` \|/gm)) {
    if (match[1].startsWith("task.")) {
      taskIds.push(match[1]);
    }
  }

  return [...new Set(taskIds)];
}

function extractTaskDefinitions(text) {
  const definitions = [];
  const headingMatches = [...text.matchAll(/^#{3,4} `([^`]+)`$/gm)];

  for (let index = 0; index < headingMatches.length; index += 1) {
    const [, taskId] = headingMatches[index];
    if (!taskId.startsWith("task.")) {
      continue;
    }

    const start = headingMatches[index].index ?? 0;
    const end =
      index + 1 < headingMatches.length
        ? headingMatches[index + 1].index
        : text.length;
    const section = text.slice(start, end);

    definitions.push({
      taskId,
      hasTaskBrief: /^- task_brief:/m.test(section),
      hasTaskOutcomeSummary: /^- task_outcome_summary:/m.test(section),
    });
  }

  return definitions;
}

function requireFieldValue(text, fieldName, relativePath, failures, failureMessage) {
  const value = matchField(text, fieldName);
  if (value == null) {
    failures.push(failureMessage ?? `${relativePath}: missing Control Block field "${fieldName}"`);
    return null;
  }

  return value;
}

function matchField(text, fieldName) {
  return (
    text.match(new RegExp(`^- ${escapeRegExp(fieldName)}: \`([^\\\`]+)\``, "m"))?.[1] ??
    null
  );
}

function extractListEntries(text, fieldName) {
  const match = text.match(
    new RegExp(`^- ${escapeRegExp(fieldName)}:\\s*\\r?\\n((?:  - .*\\r?\\n?)*)`, "m")
  );
  if (match == null || match[1].trim() === "") {
    return [];
  }

  return match[1]
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).replace(/^`|`$/g, ""));
}

function rejectQueueLocalSyncFields(text, relativePath, failures, label) {
  for (const fieldName of ["sync_status", "sync_scope", "sync_summary"]) {
    if (new RegExp(`^- ${escapeRegExp(fieldName)}:`, "m").test(text)) {
      failures.push(
        `${relativePath}: ${label} must not mirror queue-local repository sync field "${fieldName}"`
      );
    }
  }
}

function isRepositorySyncMirror(entry) {
  return /(repository sync|sync failure|sync failed|repository sync failed|merge conflict|branch push|baseline merge|baseline push|\bgit\b|\bcommit\b|\bpush\b|\bmerge\b)/i.test(
    entry
  );
}

function firstMarkdownFile(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return null;
  }

  const markdownFiles = fs
    .readdirSync(directoryPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(directoryPath, entry.name))
    .sort();

  return markdownFiles[0] ?? null;
}

function readFileOrFail(filePath, failures, repoRoot) {
  if (filePath == null) {
    failures.push("missing required Blueprint document path");
    return null;
  }

  if (!fs.existsSync(filePath)) {
    failures.push(`${relative(repoRoot, filePath)}: missing required Blueprint document`);
    return null;
  }

  return fs.readFileSync(filePath, "utf8");
}

function relative(repoRoot, filePath) {
  return path.relative(repoRoot, filePath).replaceAll("\\", "/");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const failures = lintBlueprintDocs();

  if (failures.length > 0) {
    console.error("Blueprint lint failed:\n");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log("Blueprint lint passed.");
}
