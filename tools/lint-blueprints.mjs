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
const allowedResidueFamilies = new Set([
  "same-family",
  "cross-family",
  "accepted-residue",
  "none",
]);
const allowedQueueStatuses = new Set(["active", "blocked", "done", "dropped"]);
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

export function lintBlueprintDocs(repoRoot = process.cwd()) {
  const failures = [];
  const blueprintsRoot = path.join(repoRoot, "docs", "blueprints");
  const {
    projectProgressPath,
    blueprintPath,
    targetPlanPath,
    targetSpecPath,
  } = resolveLiveTruthPaths(repoRoot, failures);

  lintProjectProgress(projectProgressPath, failures, repoRoot);
  lintBlueprintIndex(blueprintPath, failures, repoRoot);
  lintTargetPlan(targetPlanPath, failures, repoRoot, "version plan");
  lintTargetSpec(targetSpecPath, failures, repoRoot, "version spec");
  lintQueueDocs(path.join(blueprintsRoot, "queues"), failures, repoRoot);
  lintWorkflowIntakeContract(
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

function lintQueueDocs(queueDir, failures, repoRoot) {
  if (!fs.existsSync(queueDir)) {
    return;
  }

  for (const entry of fs.readdirSync(queueDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) {
      continue;
    }

    const filePath = path.join(queueDir, entry.name);
    lintQueueDoc(filePath, failures, repoRoot, false);
  }
}

function lintQueueDoc(filePath, failures, repoRoot, isTemplate) {
  const text = readFileOrFail(filePath, failures, repoRoot);
  if (text == null) {
    return;
  }

  const relativePath = relative(repoRoot, filePath);
  const head = text.split(/\r?\n/u).slice(0, 35).join("\n");

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
