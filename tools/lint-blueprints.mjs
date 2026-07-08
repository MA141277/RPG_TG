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
const allowedSyncStatuses = new Set(["pending", "success", "failed"]);
const allowedSyncScopes = new Set(["branch-push", "baseline-merge", "baseline-push", "none"]);

export function lintBlueprintDocs(repoRoot = process.cwd()) {
  const failures = [];
  const blueprintsRoot = path.join(repoRoot, "docs", "blueprints");

  const projectProgressPath = path.join(blueprintsRoot, "project-progress.md");
  const blueprintPath = path.join(blueprintsRoot, "blueprint.md");
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

  lintProjectProgress(projectProgressPath, failures, repoRoot);
  lintBlueprintIndex(blueprintPath, failures, repoRoot);
  lintTargetPlan(targetPlanPath, failures, repoRoot, "target plan");
  lintTargetSpec(targetSpecPath, failures, repoRoot, "target spec");
  lintQueueDocs(path.join(blueprintsRoot, "queues"), failures, repoRoot);
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
      lintTargetPlan(filePath, innerFailures, repoRoot, "target-plan template")
  );
  lintTemplate(
    path.join(blueprintsRoot, "templates", "target-spec-template.md"),
    failures,
    repoRoot,
    (filePath, innerFailures) =>
      lintTargetSpec(filePath, innerFailures, repoRoot, "target-spec template")
  );
  lintTemplate(
    path.join(blueprintsRoot, "templates", "execution-queue-template.md"),
    failures,
    repoRoot,
    (filePath, innerFailures) =>
      lintQueueDoc(filePath, innerFailures, repoRoot, true)
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
  rejectQueueLocalSyncFields(text, relativePath, failures, "blueprint");
  for (const forbiddenField of [
    "target_status",
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
  const blockedByEntries = extractListEntries(text, "blocked_by");

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
      `${relativePath}: ${label} blocked_by must not mirror merge conflict or repository sync state as target-level blocker truth`
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

  if (!isTemplate && queueStatus != null && !allowedQueueStatuses.has(queueStatus)) {
    failures.push(
      `${relativePath}: queue_status=${queueStatus} is not an allowed queue status`
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
  return /(repository sync|merge conflict|branch push|baseline merge|baseline push|\bgit\b|\bcommit\b|\bpush\b|\bmerge\b)/i.test(
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
