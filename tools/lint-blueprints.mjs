import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const allowedEntryActions = new Set(["open-next-file", "stop", "blocked"]);
const allowedTargetNextActions = new Set([
  "classify-fresh-work",
  "promote-queue",
  "write-target-closeout",
  "return-to-idle-open",
  "resolve-blocker",
]);
const allowedTargetNextDecisions = new Set([
  "same-target-admission-or-target-closeout",
  "queue-promotion",
  "target-closeout",
  "resolve-blocker",
]);

export function lintBlueprintDocs(repoRoot = process.cwd()) {
  const failures = [];
  const blueprintsRoot = path.join(repoRoot, "docs", "blueprints");

  const projectProgressPath = path.join(blueprintsRoot, "project-progress.md");
  const blueprintPath = path.join(blueprintsRoot, "blueprint.md");
  const liveTargetSpecPath = path.join(blueprintsRoot, "specs", "2026-07-06-project-complete-modularization-target.md");
  const liveTargetPlanPath = path.join(blueprintsRoot, "plans", "2026-07-06-project-complete-modularization-target-plan.md");

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
  lintTemplate(path.join(blueprintsRoot, "templates", "project-progress-template.md"), failures, repoRoot, lintProjectProgress);
  lintTemplate(path.join(blueprintsRoot, "templates", "target-plan-template.md"), failures, repoRoot, (filePath, innerFailures) =>
    lintTargetPlan(filePath, innerFailures, repoRoot, "target-plan template")
  );
  lintTemplate(path.join(blueprintsRoot, "templates", "target-spec-template.md"), failures, repoRoot, (filePath, innerFailures) =>
    lintTargetSpec(filePath, innerFailures, repoRoot, "target-spec template")
  );

  lintCrossDocumentConsistency(projectProgressPath, blueprintPath, targetPlanPath, failures, repoRoot);

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

  if (/^- next_step:/m.test(text)) {
    failures.push(`${relativePath}: project-progress must not contain next_step prose mirrors; use entry_action instead`);
  }

  const entryActionMatch = text.match(/^- entry_action: `([^`]+)`/m);
  if (entryActionMatch == null) {
    failures.push(`${relativePath}: project-progress missing Control Block field "entry_action"`);
  } else if (!allowedEntryActions.has(entryActionMatch[1])) {
    failures.push(`${relativePath}: project-progress entry_action "${entryActionMatch[1]}" is not an allowed enum value`);
  }
}

function lintBlueprintIndex(filePath, failures, repoRoot) {
  const text = readFileOrFail(filePath, failures, repoRoot);
  if (text == null) {
    return;
  }

  const relativePath = relative(repoRoot, filePath);
  for (const forbiddenField of ["target_status", "decision_state", "active_queue", "active_task", "completed_targets"]) {
    if (new RegExp(`^- ${escapeRegExp(forbiddenField)}:`, "m").test(text)) {
      failures.push(`${relativePath}: blueprint must not own downstream truth field "${forbiddenField}"`);
    }
  }
}

function lintTargetPlan(filePath, failures, repoRoot, label) {
  const text = readFileOrFail(filePath, failures, repoRoot);
  if (text == null) {
    return;
  }

  const relativePath = relative(repoRoot, filePath);

  if (/^- next_legal_action:/m.test(text)) {
    failures.push(`${relativePath}: ${label} must not contain next_legal_action prose; use next_action enum instead`);
  }

  const nextActionMatch = text.match(/^- next_action: `([^`]+)`/m);
  if (nextActionMatch == null) {
    failures.push(`${relativePath}: ${label} missing Control Block field "next_action"`);
  } else if (!allowedTargetNextActions.has(nextActionMatch[1])) {
    failures.push(`${relativePath}: ${label} next_action "${nextActionMatch[1]}" is not an allowed enum value`);
  }

  const nextDecisionMatch = text.match(/^- next_decision: `([^`]+)`/m);
  if (nextDecisionMatch == null) {
    failures.push(`${relativePath}: ${label} missing Control Block field "next_decision"`);
  } else if (!allowedTargetNextDecisions.has(nextDecisionMatch[1])) {
    failures.push(`${relativePath}: ${label} next_decision "${nextDecisionMatch[1]}" is not an allowed enum value`);
  }

  if (/^### Current Decision$/m.test(text)) {
    failures.push(`${relativePath}: ${label} must not keep a Current Decision prose block; Control Block must stand alone`);
  }
}

function lintTargetSpec(filePath, failures, repoRoot, label) {
  const text = readFileOrFail(filePath, failures, repoRoot);
  if (text == null) {
    return;
  }

  const relativePath = relative(repoRoot, filePath);

  if (/^### Queue Portfolio$/m.test(text)) {
    failures.push(`${relativePath}: ${label} must use "Queue Contract Portfolio" instead of runtime-style "Queue Portfolio"`);
  }

  if (/^\| Queue ID \| Class \| State \| Promote When \| Source \|$/m.test(text)) {
    failures.push(`${relativePath}: ${label} Queue Portfolio must not include runtime State/Source columns`);
  }

  if (!/^### Queue Contract Portfolio$/m.test(text)) {
    failures.push(`${relativePath}: ${label} missing "Queue Contract Portfolio" section`);
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
    const text = fs.readFileSync(filePath, "utf8");
    const relativePath = relative(repoRoot, filePath);
    const head = text.split(/\r?\n/u).slice(0, 25).join("\n");

    for (const requiredField of ["queue_status", "closeout_status", "next_effect"]) {
      if (!new RegExp(`^- ${escapeRegExp(requiredField)}:`, "m").test(head)) {
        failures.push(`${relativePath}: queue Control Block missing "${requiredField}"`);
      }
    }

    if (/^- status:/m.test(head)) {
      failures.push(`${relativePath}: queue Control Block must not use legacy status field; use queue_status`);
    }

    const queueStatusMatch = head.match(/^- queue_status: `([^`]+)`/m);
    if (queueStatusMatch?.[1] === "done") {
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
          failures.push(`${relativePath}: done queue still contains live execution label matching ${pattern}`);
        }
      }
    }
  }
}

function lintCrossDocumentConsistency(projectProgressPath, blueprintPath, targetPlanPath, failures, repoRoot) {
  if (!fs.existsSync(projectProgressPath) || !fs.existsSync(blueprintPath) || !fs.existsSync(targetPlanPath)) {
    return;
  }

  const projectProgressText = fs.readFileSync(projectProgressPath, "utf8");
  const blueprintText = fs.readFileSync(blueprintPath, "utf8");
  const targetPlanText = fs.readFileSync(targetPlanPath, "utf8");

  const projectActiveTarget = matchField(projectProgressText, "active_target");
  const blueprintActiveTarget = matchField(blueprintText, "active_target");
  if (projectActiveTarget != null && blueprintActiveTarget != null && projectActiveTarget !== blueprintActiveTarget) {
    failures.push(`${relative(repoRoot, projectProgressPath)}: active_target must match blueprint active_target`);
  }

  const hasActiveQueue = matchField(projectProgressText, "has_active_queue");
  const activeQueue = matchField(targetPlanText, "active_queue");
  if (hasActiveQueue === "false" && activeQueue != null && activeQueue !== "none") {
    failures.push(`${relative(repoRoot, projectProgressPath)}: has_active_queue=false conflicts with target plan active_queue=${activeQueue}`);
  }
}

function matchField(text, fieldName) {
  return text.match(new RegExp(`^- ${escapeRegExp(fieldName)}: \`([^\\\`]+)\``, "m"))?.[1] ?? null;
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
    failures.push(`missing required Blueprint document path`);
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

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
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
