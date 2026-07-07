import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const allowedEntryActions = new Set(["open-next-file", "stop", "blocked"]);
const allowedTargetNextActions = new Set([
  "classify-fresh-work",
  "write-admission-review",
  "activate-admitted-queue",
  "resume-active-queue",
  "auto-reconcile-active-task",
  "write-queue-closeout",
  "return-to-promotion-review",
  "write-target-closeout",
  "resolve-blocker",
]);
const allowedTargetNextDecisions = new Set([
  "queue-admission-review",
  "queue-closeout-or-return-to-target-review",
  "same-target-admission-or-target-closeout",
  "target-closeout",
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
const allowedQueueStatuses = new Set(["active", "blocked", "done", "dropped"]);
const allowedGoalStatuses = new Set(["in-progress", "satisfied"]);
const allowedFailureOwnerScopes = new Set([
  "none",
  "queue-local",
  "target-level",
  "repository/global",
]);
const allowedV1CloseoutStatuses = new Set([
  "in-progress",
  "done",
  "escalated-to-target",
]);
const allowedCandidateStates = new Set(["candidate", "prepared", "active"]);
const allowedTransitionStates = new Set(["candidate", "prepared", "active", "none"]);
const allowedAbsorbFailureScopes = new Set(["target-level", "repository/global", "none"]);
const allowedAbsorbResolutionKinds = new Set([
  "candidate-rewrite",
  "new-candidate",
  "unique-transition-queue",
  "none",
]);
const forbiddenHumanControlTerms = [
  "admission",
  "closeout",
  "sync",
  "promote",
  "promotion",
  "state machine",
  "active_queue",
];

export function lintBlueprintDocs(repoRoot = process.cwd()) {
  const failures = [];
  const blueprintsRoot = path.join(repoRoot, "docs", "blueprints");

  const projectProgressPath = path.join(blueprintsRoot, "project-progress.md");
  const blueprintPath = path.join(blueprintsRoot, "blueprint.md");
  const blueprintText = readFileOrFail(blueprintPath, failures, repoRoot);
  const liveTargetSpecPath = path.join(
    blueprintsRoot,
    "specs",
    "2026-07-06-project-complete-modularization-target.md"
  );
  const liveTargetPlanPath = path.join(
    blueprintsRoot,
    "plans",
    "2026-07-06-project-complete-modularization-target-plan.md"
  );

  const targetPlanPath = fs.existsSync(liveTargetPlanPath)
    ? liveTargetPlanPath
    : firstMarkdownFile(path.join(blueprintsRoot, "plans"));
  const targetSpecPath = fs.existsSync(liveTargetSpecPath)
    ? liveTargetSpecPath
    : firstMarkdownFile(path.join(blueprintsRoot, "specs"));
  const targetFilePath = resolveActiveTargetFile(blueprintText, repoRoot);

  lintProjectProgress(projectProgressPath, failures, repoRoot);
  lintBlueprintIndex(blueprintPath, failures, repoRoot);
  lintTargetV1(targetFilePath, failures, repoRoot, "target");
  if (targetFilePath != null) {
    lintTargetPlanCompatibilityShell(
      targetPlanPath,
      targetFilePath,
      failures,
      repoRoot,
      "target plan"
    );
    lintTargetSpecCompatibilityShell(
      targetSpecPath,
      targetFilePath,
      failures,
      repoRoot,
      "target spec"
    );
  } else {
    lintTargetPlan(targetPlanPath, failures, repoRoot, "target plan");
    lintTargetSpec(targetSpecPath, failures, repoRoot, "target spec");
  }
  lintQueueDocs(path.join(blueprintsRoot, "queues"), failures, repoRoot, targetFilePath != null);
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
      lintTargetPlanCompatibilityTemplate(
        filePath,
        innerFailures,
        repoRoot,
        "target-plan template"
      )
  );
  lintTemplate(
    path.join(blueprintsRoot, "templates", "topic-queue-template.md"),
    failures,
    repoRoot,
    (filePath, innerFailures) =>
      lintTopicQueueCompatibilityTemplate(
        filePath,
        innerFailures,
        repoRoot,
        "topic-queue template"
      )
  );
  lintTemplate(
    path.join(blueprintsRoot, "templates", "target-spec-template.md"),
    failures,
    repoRoot,
    (filePath, innerFailures) =>
      lintTargetSpec(filePath, innerFailures, repoRoot, "target-spec template")
  );

  lintCrossDocumentConsistency(
    projectProgressPath,
    blueprintPath,
    targetFilePath,
    targetPlanPath,
    failures,
    repoRoot
  );

  return failures;
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
  for (const forbiddenField of [
    "active_target_file",
    "execution_queue",
    "candidate_queues",
    "transition_queue",
    "active_queue",
    "active_task",
  ]) {
    if (new RegExp(`^- ${escapeRegExp(forbiddenField)}:`, "m").test(text)) {
      failures.push(
        `${relativePath}: project-progress must not mirror downstream truth field "${forbiddenField}"`
      );
    }
  }

  if (/^- next_step:/m.test(text)) {
    failures.push(
      `${relativePath}: project-progress must not contain next_step prose mirrors; use entry_action instead`
    );
  }

  const nextFile = matchField(text, "next_file");
  if (nextFile == null) {
    failures.push(`${relativePath}: project-progress missing Control Block field "next_file"`);
  } else if (nextFile !== "docs/blueprints/blueprint.md") {
    failures.push(
      `${relativePath}: project-progress next_file must point to docs/blueprints/blueprint.md for the unique recovery chain`
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
  for (const forbiddenField of [
    "target_status",
    "decision_state",
    "active_queue",
    "active_task",
    "completed_targets",
    "execution_queue",
    "candidate_queues",
    "transition_queue",
    "decision_required",
    "has_active_queue",
    "next_file",
  ]) {
    if (new RegExp(`^- ${escapeRegExp(forbiddenField)}:`, "m").test(text)) {
      failures.push(
        `${relativePath}: blueprint must not own downstream truth field "${forbiddenField}"`
      );
    }
  }

  const activeTargetFile = matchField(text, "active_target_file");
  if (activeTargetFile != null) {
    const resolvedTargetFile = path.join(repoRoot, ...activeTargetFile.split("/"));
    if (!fs.existsSync(resolvedTargetFile)) {
      failures.push(
        `${relativePath}: blueprint active_target_file points to a missing document (${activeTargetFile})`
      );
    }

    if (/^- active_target_plan:/m.test(text)) {
      failures.push(
        `${relativePath}: blueprint must not keep active_target_plan once active_target_file exists`
      );
    }
  }
}

function lintTargetV1(filePath, failures, repoRoot, label) {
  if (filePath == null) {
    return;
  }

  const text = readFileOrFail(filePath, failures, repoRoot);
  if (text == null) {
    return;
  }

  const relativePath = relative(repoRoot, filePath);
  for (const requiredField of [
    "target_id",
    "version_goal",
    "execution_queue",
    "candidate_queues",
    "transition_queue",
    "absorb_resolution",
    "constraints",
    "artifact_rules",
    "done_when",
    "closeout_condition",
    "decision_required",
  ]) {
    if (!new RegExp(`^- ${escapeRegExp(requiredField)}:`, "m").test(text)) {
      failures.push(`${relativePath}: ${label} missing Control Block field "${requiredField}"`);
    }
  }

  const executionQueue = matchField(text, "execution_queue");
  const decisionRequired = matchField(text, "decision_required");
  const candidateEntries = parseCandidateEntries(text);
  const activeCandidates = candidateEntries.filter((entry) => entry.state === "active");

  if (candidateEntries.length === 0) {
    failures.push(`${relativePath}: ${label} must define at least one candidate_queues entry`);
  }

  for (const entry of candidateEntries) {
    for (const [fieldName, fieldValue] of [
      ["state", entry.state],
      ["entry_conditions", entry.entryConditions],
      ["drop_if", entry.dropIf],
      ["on_failure", entry.onFailure],
    ]) {
      if (fieldValue == null) {
        failures.push(
          `${relativePath}: candidate ${entry.candidateId} missing required field ${fieldName}`
        );
      }
    }

    if (!allowedCandidateStates.has(entry.state)) {
      failures.push(
        `${relativePath}: candidate ${entry.candidateId} uses invalid state=${entry.state}`
      );
    }
  }

  for (const legacyFieldName of ["activation_condition", "fallback_on_failure"]) {
    if (new RegExp(`\\b${escapeRegExp(legacyFieldName)}\\b`).test(text)) {
      failures.push(
        `${relativePath}: ${label} must not use legacy candidate/task field "${legacyFieldName}"`
      );
    }
  }

  if (activeCandidates.length > 1) {
    failures.push(
      `${relativePath}: only one candidate may use state=active, found ${activeCandidates.length}`
    );
  }

  if (executionQueue === "none" && activeCandidates.length > 0) {
    failures.push(
      `${relativePath}: execution_queue=none conflicts with candidate ${activeCandidates[0].candidateId} state=active`
    );
  }

  if (
    executionQueue != null &&
    executionQueue !== "none" &&
    activeCandidates.length === 1 &&
    activeCandidates[0].candidateId !== executionQueue
  ) {
    failures.push(
      `${relativePath}: execution_queue=${executionQueue} must match active candidate ${activeCandidates[0].candidateId}`
    );
  }

  const transitionQueue = parseTransitionQueue(text);
  const absorbResolution = parseAbsorbResolution(text);
  const activeTransitionQueueId =
    transitionQueue != null &&
    transitionQueue.queueId !== "none" &&
    transitionQueue.state === "active"
      ? transitionQueue.queueId
      : null;
  if (transitionQueue != null) {
    if (!allowedTransitionStates.has(transitionQueue.state)) {
      failures.push(
        `${relativePath}: transition queue uses invalid state=${transitionQueue.state}`
      );
    }

    if (transitionQueue.queueId === "none" && transitionQueue.state !== "none") {
      failures.push(
        `${relativePath}: transition queue state=${transitionQueue.state} requires a queue_id`
      );
    }

    if (transitionQueue.queueId !== "none" && transitionQueue.state === "none") {
      failures.push(
        `${relativePath}: transition queue queue_id=${transitionQueue.queueId} cannot use state=none`
      );
    }

    if (transitionQueue.queueId !== "none" && transitionQueue.bindsCandidates.length === 0) {
      failures.push(
        `${relativePath}: transition queue must bind explicit candidate ids before it can exist`
      );
    }

    if (
      transitionQueue.queueId !== "none" &&
      transitionQueue.bindsCandidates.some(
        (candidateId) => !candidateEntries.some((entry) => entry.candidateId === candidateId)
      )
    ) {
      failures.push(
        `${relativePath}: transition queue must bind only candidate ids that already exist in candidate_queues`
      );
    }

    if (transitionQueue.queueId !== "none" && activeCandidates.length > 0) {
      failures.push(
        `${relativePath}: transition queue must not coexist with candidate state=active because only one execution slot may exist`
      );
    }

    if (
      transitionQueue.queueId !== "none" &&
      transitionQueue.state !== "active" &&
      executionQueue != null &&
      executionQueue !== "none"
    ) {
      failures.push(
        `${relativePath}: transition queue state=${transitionQueue.state} must not coexist with execution_queue=${executionQueue}`
      );
    }

    if (
      transitionQueue.state === "active" &&
      executionQueue != null &&
      executionQueue !== transitionQueue.queueId
    ) {
      failures.push(
        `${relativePath}: execution_queue=${executionQueue} must match active transition queue ${transitionQueue.queueId}`
      );
    }
  }

  if (absorbResolution == null) {
    failures.push(`${relativePath}: ${label} must define absorb_resolution`);
  } else {
    const { sourceQueue, failureScope, resolutionKind, resolutionTarget } = absorbResolution;

    if (!allowedAbsorbFailureScopes.has(failureScope ?? "")) {
      failures.push(
        `${relativePath}: absorb_resolution failure_scope=${failureScope} is not allowed`
      );
    }

    if (!allowedAbsorbResolutionKinds.has(resolutionKind ?? "")) {
      failures.push(
        `${relativePath}: absorb_resolution resolution_kind=${resolutionKind} is not allowed`
      );
    }

    if (
      sourceQueue === "none" ||
      failureScope === "none" ||
      resolutionKind === "none" ||
      resolutionTarget === "none"
    ) {
      const allNone =
        sourceQueue === "none" &&
        failureScope === "none" &&
        resolutionKind === "none" &&
        resolutionTarget === "none";
      if (!allNone) {
        failures.push(
          `${relativePath}: absorb_resolution must record one legal target-owned path or be all none`
        );
      }
    } else {
      if (resolutionKind === "unique-transition-queue") {
        if (transitionQueue == null || transitionQueue.queueId !== resolutionTarget) {
          failures.push(
            `${relativePath}: absorb_resolution unique-transition-queue must target the active transition_queue`
          );
        }
      } else if (
        !candidateEntries.some((entry) => entry.candidateId === resolutionTarget)
      ) {
        failures.push(
          `${relativePath}: absorb_resolution must target an existing candidate or transition queue`
        );
      }
    }
  }

  if (
    executionQueue != null &&
    executionQueue !== "none" &&
    activeCandidates.length === 0 &&
    activeTransitionQueueId == null
  ) {
    failures.push(
      `${relativePath}: execution_queue=${executionQueue} must be backed by one active candidate or one active transition queue`
    );
  }

  if (activeCandidates.length > 0 && activeTransitionQueueId != null) {
    failures.push(
      `${relativePath}: active candidate and active transition queue would create double live execution truth`
    );
  }

  if (
    decisionRequired != null &&
    decisionRequired !== "none" &&
    forbiddenHumanControlTerms.some((term) =>
      decisionRequired.toLowerCase().includes(term)
    )
  ) {
    failures.push(
      `${relativePath}: decision_required must stay human-facing and must not expose internal control semantics`
    );
  }
}

function lintTargetPlan(filePath, failures, repoRoot, label) {
  const text = readFileOrFail(filePath, failures, repoRoot);
  if (text == null) {
    return;
  }

  const relativePath = relative(repoRoot, filePath);
  const isTemplate = relativePath.includes("/templates/");

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

  const nextAction = requireFieldValue(
    text,
    "next_action",
    relativePath,
    failures,
    `${label} missing Control Block field "next_action"`
  );
  if (!isTemplate && nextAction != null && !allowedTargetNextActions.has(nextAction)) {
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
  if (!isTemplate && nextDecision != null && !allowedTargetNextDecisions.has(nextDecision)) {
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
  ]) {
    requireFieldValue(
      text,
      requiredField,
      relativePath,
      failures,
      `${relativePath}: ${label} missing Control Block field "${requiredField}"`
    );
  }

  const admissionStatus = matchField(text, "admission_status");
  if (!isTemplate && admissionStatus != null && !allowedAdmissionStatuses.has(admissionStatus)) {
    failures.push(
      `${relativePath}: ${label} admission_status "${admissionStatus}" is not an allowed enum value`
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
}

function lintTargetSpec(filePath, failures, repoRoot, label) {
  const text = readFileOrFail(filePath, failures, repoRoot);
  if (text == null) {
    return;
  }

  const relativePath = relative(repoRoot, filePath);

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

function lintQueueDocs(queueDir, failures, repoRoot, usingV1Target = false) {
  if (!fs.existsSync(queueDir)) {
    return;
  }

  for (const entry of fs.readdirSync(queueDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) {
      continue;
    }

    const filePath = path.join(queueDir, entry.name);
    const text = fs.readFileSync(filePath, "utf8");
    const relativePath = relative(repoRoot, filePath);
    const head = text.split(/\r?\n/u).slice(0, 25).join("\n");

    if (usingV1Target && /target plan|target spec/i.test(text)) {
      failures.push(
        `${relativePath}: queue doc must reference the v1 target owner instead of target plan/spec once active_target_file exists`
      );
    }

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

    const queueStatus = head.match(/^- queue_status: `([^`]+)`/m)?.[1] ?? null;
    const activeTask = head.match(/^- active_task: `([^`]+)`/m)?.[1] ?? null;
    const goalStatus = head.match(/^- goal_status: `([^`]+)`/m)?.[1] ?? null;
    const failureOwnerScope =
      head.match(/^- failure_owner_scope: `([^`]+)`/m)?.[1] ?? null;
    const closeoutStatus = head.match(/^- closeout_status: `([^`]+)`/m)?.[1] ?? null;
    const nextEffect = head.match(/^- next_effect: `([^`]+)`/m)?.[1] ?? null;

    if (queueStatus != null && !allowedQueueStatuses.has(queueStatus)) {
      failures.push(
        `${relativePath}: queue_status=${queueStatus} is not an allowed queue status`
      );
    }

    if (queueStatus !== "active" && activeTask != null && activeTask !== "none") {
      failures.push(
        `${relativePath}: queue must not keep active_task=${activeTask} while queue_status=${queueStatus}`
      );
    }

    const usesEscalatedTerminalState = closeoutStatus === "escalated-to-target";
    const needsV1ExecutionFields =
      usingV1Target &&
      (queueStatus === "active" ||
        usesEscalatedTerminalState ||
        goalStatus != null ||
        failureOwnerScope != null);

    if (needsV1ExecutionFields) {
      if (goalStatus == null) {
        failures.push(
          `${relativePath}: v1 queue must declare goal_status so queue goal completion stays distinct from closeout`
        );
      } else if (!allowedGoalStatuses.has(goalStatus)) {
        failures.push(
          `${relativePath}: goal_status=${goalStatus} is not an allowed v1 goal status`
        );
      }

      if (failureOwnerScope == null) {
        failures.push(
          `${relativePath}: v1 queue must declare failure_owner_scope for verification ownership`
        );
      } else if (!allowedFailureOwnerScopes.has(failureOwnerScope)) {
        failures.push(
          `${relativePath}: failure_owner_scope=${failureOwnerScope} is not an allowed v1 failure owner scope`
        );
      }

      if (closeoutStatus == null) {
        failures.push(
          `${relativePath}: v1 queue must declare closeout_status`
        );
      } else if (!allowedV1CloseoutStatuses.has(closeoutStatus)) {
        failures.push(
          `${relativePath}: closeout_status=${closeoutStatus} is not an allowed v1 closeout status`
        );
      }

      if (usesEscalatedTerminalState) {
        if (queueStatus !== "done") {
          failures.push(
            `${relativePath}: closeout_status=escalated-to-target requires queue_status=done`
          );
        }

        if (goalStatus !== "satisfied") {
          failures.push(
            `${relativePath}: closeout_status=escalated-to-target requires goal_status=satisfied`
          );
        }

        if (activeTask !== "none") {
          failures.push(
            `${relativePath}: closeout_status=escalated-to-target requires active_task=none`
          );
        }

        if (nextEffect !== "absorb-into-target") {
          failures.push(
            `${relativePath}: non-owner verification failure must use next_effect=absorb-into-target`
          );
        }
      }

      if (
        goalStatus === "satisfied" &&
        (failureOwnerScope === "target-level" ||
          failureOwnerScope === "repository/global") &&
        closeoutStatus !== "escalated-to-target"
      ) {
        failures.push(
          `${relativePath}: non-owner verification failure must not remain attached to queue closeout as blocked or in-progress`
        );
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
}

function lintCrossDocumentConsistency(
  projectProgressPath,
  blueprintPath,
  targetFilePath,
  targetPlanPath,
  failures,
  repoRoot
) {
  if (
    !fs.existsSync(projectProgressPath) ||
    !fs.existsSync(blueprintPath) ||
    (!fs.existsSync(targetPlanPath) && !fs.existsSync(targetFilePath ?? ""))
  ) {
    return;
  }

  const projectProgressText = fs.readFileSync(projectProgressPath, "utf8");
  const blueprintText = fs.readFileSync(blueprintPath, "utf8");
  const targetText =
    targetFilePath != null && fs.existsSync(targetFilePath)
      ? fs.readFileSync(targetFilePath, "utf8")
      : null;
  const targetPlanText =
    targetPlanPath != null && fs.existsSync(targetPlanPath)
      ? fs.readFileSync(targetPlanPath, "utf8")
      : null;

  const projectActiveTarget = matchField(projectProgressText, "active_target");
  const blueprintActiveTarget = matchField(blueprintText, "active_target");
  if (
    projectActiveTarget != null &&
    blueprintActiveTarget != null &&
    projectActiveTarget !== blueprintActiveTarget
  ) {
    failures.push(
      `${relative(repoRoot, projectProgressPath)}: active_target must match blueprint active_target`
    );
  }

  const targetId = targetText != null ? matchField(targetText, "target_id") : null;
  if (
    blueprintActiveTarget != null &&
    targetId != null &&
    blueprintActiveTarget !== targetId
  ) {
    failures.push(
      `${relative(repoRoot, blueprintPath)}: active_target must match target target_id`
    );
  }

  const hasActiveQueue = matchField(projectProgressText, "has_active_queue");
  const usingV1Target = targetText != null;
  const activeQueue = usingV1Target
    ? matchField(targetText, "execution_queue")
    : matchField(targetPlanText, "active_queue");
  const activeQueueLabel = usingV1Target ? "execution_queue" : "active_queue";
  const activeQueueOwnerPath = relative(repoRoot, usingV1Target ? targetFilePath : targetPlanPath);
  if (hasActiveQueue === "false" && activeQueue != null && activeQueue !== "none") {
    failures.push(
      `${relative(repoRoot, projectProgressPath)}: has_active_queue=false conflicts with target ${activeQueueLabel}=${activeQueue}`
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
      `${activeQueueOwnerPath}: ${activeQueueLabel}=none conflicts with active queue docs (${activeQueueDocs.join(", ")})`
    );
  }

  if (activeQueue != null && activeQueue !== "none") {
    if (activeQueueDocs.length === 0) {
      failures.push(
        `${activeQueueOwnerPath}: ${activeQueueLabel}=${activeQueue} has no matching active queue doc`
      );
    } else if (activeQueueDocs.length > 1 || activeQueueDocs[0] !== activeQueue) {
      failures.push(
        `${activeQueueOwnerPath}: ${activeQueueLabel}=${activeQueue} conflicts with active queue docs (${activeQueueDocs.join(", ")})`
      );
    }
  }

  if (targetText != null && targetPlanText != null) {
    const legacyActiveQueue = matchField(targetPlanText, "active_queue");
    if (
      legacyActiveQueue != null &&
      activeQueue != null &&
      legacyActiveQueue !== activeQueue
    ) {
      failures.push(
        `${relative(repoRoot, targetPlanPath)}: legacy active_queue=${legacyActiveQueue} must mirror target execution_queue=${activeQueue}`
      );
    }
  }
}

function lintTargetPlanCompatibilityShell(
  filePath,
  targetFilePath,
  failures,
  repoRoot,
  label
) {
  const text = readFileOrFail(filePath, failures, repoRoot);
  if (text == null) {
    return;
  }

  const relativePath = relative(repoRoot, filePath);
  if (!/^##+ Compatibility Pointer$/m.test(text)) {
    failures.push(`${relativePath}: ${label} compatibility shell missing "Compatibility Pointer"`);
  }

  const activeTargetRelative = relative(repoRoot, targetFilePath);
  if (!text.includes(activeTargetRelative)) {
    failures.push(
      `${relativePath}: ${label} compatibility shell must point to active_target_file (${activeTargetRelative})`
    );
  }

  if (/^- active_queue:/m.test(text) || /^- next_action:/m.test(text)) {
    failures.push(
      `${relativePath}: ${label} compatibility shell must not keep legacy target-plan control fields once a v1 target owner exists`
    );
  }
}

function lintTargetSpecCompatibilityShell(
  filePath,
  targetFilePath,
  failures,
  repoRoot,
  label
) {
  const text = readFileOrFail(filePath, failures, repoRoot);
  if (text == null) {
    return;
  }

  const relativePath = relative(repoRoot, filePath);
  if (!/^##+ Compatibility Pointer$/m.test(text)) {
    failures.push(`${relativePath}: ${label} compatibility shell missing "Compatibility Pointer"`);
  }

  const activeTargetRelative = relative(repoRoot, targetFilePath);
  if (!text.includes(activeTargetRelative)) {
    failures.push(
      `${relativePath}: ${label} compatibility shell must point to active_target_file (${activeTargetRelative})`
    );
  }

  if (/^### Goal$/m.test(text) || /^### Acceptance Criteria$/m.test(text)) {
    failures.push(
      `${relativePath}: ${label} compatibility shell must not keep thick target prose once a v1 target owner exists`
    );
  }
}

function lintTargetPlanCompatibilityTemplate(filePath, failures, repoRoot, label) {
  const text = readFileOrFail(filePath, failures, repoRoot);
  if (text == null) {
    return;
  }

  const relativePath = relative(repoRoot, filePath);
  if (!/^##+ Compatibility Pointer$/m.test(text)) {
    failures.push(`${relativePath}: ${label} missing "Compatibility Pointer"`);
  }

  if (/^## Control Block$/m.test(text) || /admission_status/i.test(text)) {
    failures.push(
      `${relativePath}: ${label} must stay a compatibility shell and must not reintroduce legacy target-plan control fields`
    );
  }
}

function lintTopicQueueCompatibilityTemplate(filePath, failures, repoRoot, label) {
  const text = readFileOrFail(filePath, failures, repoRoot);
  if (text == null) {
    return;
  }

  const relativePath = relative(repoRoot, filePath);
  if (!/compatibility alias/i.test(text)) {
    failures.push(`${relativePath}: ${label} must state that it is a compatibility alias`);
  }

  if (!/execution-queue-template\.md/i.test(text)) {
    failures.push(
      `${relativePath}: ${label} must point to execution-queue-template.md as the canonical queue template`
    );
  }

  if (/^## Control Block$/m.test(text) || /active_task:/i.test(text)) {
    failures.push(
      `${relativePath}: ${label} must not keep a second live queue template structure`
    );
  }
}

function resolveActiveTargetFile(blueprintText, repoRoot) {
  if (blueprintText == null) {
    return null;
  }

  const activeTargetFile = matchField(blueprintText, "active_target_file");
  if (activeTargetFile == null) {
    return null;
  }

  return path.join(repoRoot, ...activeTargetFile.split("/"));
}

function parseCandidateEntries(text) {
  const sectionMatch = text.match(/^- candidate_queues:\r?\n([\s\S]*?)^- transition_queue:/m);
  if (sectionMatch == null) {
    return [];
  }

  const entries = [];
  let currentEntry = null;

  for (const line of sectionMatch[1].split(/\r?\n/u)) {
    const candidateId = line.match(/^  - candidate_id: `([^`]+)`$/u)?.[1] ?? null;
    if (candidateId != null) {
      if (currentEntry != null) {
        entries.push(materializeCandidateEntry(currentEntry));
      }

      currentEntry = { candidateId, lines: [] };
      continue;
    }

    if (currentEntry != null) {
      currentEntry.lines.push(line);
    }
  }

  if (currentEntry != null) {
    entries.push(materializeCandidateEntry(currentEntry));
  }

  return entries;
}

function materializeCandidateEntry(entry) {
  const body = entry.lines.join("\n");
  return {
    candidateId: entry.candidateId,
    state: body.match(/^    state: `([^`]+)`/m)?.[1] ?? null,
    entryConditions: body.match(/^    entry_conditions: `([^`]+)`/m)?.[1] ?? null,
    dropIf: body.match(/^    drop_if: `([^`]+)`/m)?.[1] ?? null,
    onFailure: body.match(/^    on_failure: `([^`]+)`/m)?.[1] ?? null,
  };
}

function parseTransitionQueue(text) {
  const sectionMatch = text.match(
    /^- transition_queue:\r?\n([\s\S]*?)(?=^- [a-z_]+:|\Z)/m
  );
  if (sectionMatch == null) {
    return null;
  }

  const queueId =
    sectionMatch[1].match(/^  - queue_id: `([^`]+)`/m)?.[1] ?? null;
  const state = sectionMatch[1].match(/^  - state: `([^`]+)`/m)?.[1] ?? null;
  const bindsBlock =
    sectionMatch[1].match(/^  - binds_candidates:\r?\n((?:    - `[^`]+`\r?\n)*)/m)?.[1] ??
    "";
  const bindsCandidates = [...bindsBlock.matchAll(/^\s+- `([^`]+)`/gm)].map(
    (match) => match[1]
  );

  return { queueId, state, bindsCandidates };
}

function parseAbsorbResolution(text) {
  const sectionMatch = text.match(/^- absorb_resolution:\r?\n([\s\S]*?)^- constraints:/m);
  if (sectionMatch == null) {
    return null;
  }

  return {
    sourceQueue: sectionMatch[1].match(/^  - source_queue: `([^`]+)`/m)?.[1] ?? null,
    failureScope: sectionMatch[1].match(/^  - failure_scope: `([^`]+)`/m)?.[1] ?? null,
    resolutionKind:
      sectionMatch[1].match(/^  - resolution_kind: `([^`]+)`/m)?.[1] ?? null,
    resolutionTarget:
      sectionMatch[1].match(/^  - resolution_target: `([^`]+)`/m)?.[1] ?? null,
  };
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
