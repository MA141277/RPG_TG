import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function runBlueprintVersionGovernance(mode, repoRoot = process.cwd()) {
  const context = readGovernanceContext(repoRoot);
  if (!context.ok) {
    return context;
  }

  if (mode === "sync") {
    return syncGovernedQueues(context);
  }

  return checkGovernedQueues(context);
}

function readGovernanceContext(repoRoot) {
  const blueprintPath = path.join(repoRoot, "docs", "blueprints", "blueprint.md");
  if (!fs.existsSync(blueprintPath)) {
    return {
      ok: false,
      messages: [`${relative(repoRoot, blueprintPath)}: missing blueprint.md`],
    };
  }

  const blueprintText = fs.readFileSync(blueprintPath, "utf8");
  const blueprintVersion = matchField(blueprintText, "blueprint_version");
  const activePlanRef = matchField(blueprintText, "active_version_plan");

  if (blueprintVersion == null || blueprintVersion === "none") {
    return {
      ok: false,
      messages: [`${relative(repoRoot, blueprintPath)}: missing blueprint_version`],
    };
  }

  if (activePlanRef == null || activePlanRef === "none") {
    return {
      ok: false,
      messages: [`${relative(repoRoot, blueprintPath)}: missing active_version_plan`],
    };
  }

  const activePlanPath = path.join(repoRoot, ...activePlanRef.split("/"));
  if (!fs.existsSync(activePlanPath)) {
    return {
      ok: false,
      messages: [`${relative(repoRoot, blueprintPath)}: missing active version plan file`],
    };
  }

  const activePlanText = fs.readFileSync(activePlanPath, "utf8");

  return {
    ok: true,
    repoRoot,
    blueprintPath,
    blueprintVersion,
    activePlanPath,
    activePlanText,
  };
}

function checkGovernedQueues(context) {
  const queueRefs = resolveGovernedQueueRefs(context.activePlanText);
  const messages = [];

  for (const queueRef of queueRefs) {
    const queuePath = findQueuePath(context.repoRoot, queueRef.queueId);
    if (queuePath == null) {
      if (!queueRef.allowMissingDoc) {
        messages.push(`missing queue doc for ${queueRef.queueId}`);
      }
      continue;
    }

    const queueText = fs.readFileSync(queuePath, "utf8");
    if (matchField(queueText, "blueprint_version") !== context.blueprintVersion) {
      messages.push(`${relative(context.repoRoot, queuePath)}: missing or outdated blueprint_version`);
    }
    if (/^- belongs_to_target:/m.test(queueText)) {
      messages.push(`${relative(context.repoRoot, queuePath)}: legacy belongs_to_target must be reconciled`);
    }
  }

  return {
    ok: messages.length === 0,
    messages: messages.length === 0
      ? ["Blueprint version governance check passed."]
      : messages,
  };
}

function syncGovernedQueues(context) {
  const queueRefs = resolveGovernedQueueRefs(context.activePlanText);
  const messages = [];

  for (const queueRef of queueRefs) {
    const queuePath = findQueuePath(context.repoRoot, queueRef.queueId);
    if (queuePath == null) {
      if (!queueRef.allowMissingDoc) {
        messages.push(`missing queue doc for ${queueRef.queueId}`);
      }
      continue;
    }

    const queueText = fs.readFileSync(queuePath, "utf8");
    const syncedText = reconcileQueueGovernanceShell(queueText, context);
    fs.writeFileSync(queuePath, syncedText, "utf8");
    messages.push(`updated ${relative(context.repoRoot, queuePath)}`);
  }

  const hasFailure = messages.some((message) => message.startsWith("missing queue doc"));
  return {
    ok: !hasFailure,
    messages: messages.length === 0 ? ["No governed queues required sync."] : messages,
  };
}

function resolveGovernedQueueRefs(activePlanText) {
  const queueRefs = new Map();
  for (const fieldName of ["active_queue", "proposed_queue_id", "review_subject_id"]) {
    const value = matchField(activePlanText, fieldName);
    if (value != null && value !== "none" && value.startsWith("queue.")) {
      queueRefs.set(value, { queueId: value, allowMissingDoc: false });
    }
  }
  for (const queueId of extractListEntries(activePlanText, "candidate_queue_ids")) {
    if (queueId.startsWith("queue.")) {
      queueRefs.set(queueId, {
        queueId,
        allowMissingDoc: queueRefs.get(queueId)?.allowMissingDoc ?? true,
      });
    }
  }
  return [...queueRefs.values()];
}

function findQueuePath(repoRoot, queueId) {
  const queuesRoot = path.join(repoRoot, "docs", "blueprints", "queues");
  if (!fs.existsSync(queuesRoot)) {
    return null;
  }

  for (const entry of fs.readdirSync(queuesRoot)) {
    if (!entry.endsWith(".md")) {
      continue;
    }

    const filePath = path.join(queuesRoot, entry);
    const text = fs.readFileSync(filePath, "utf8");
    if (matchField(text, "queue_id") === queueId) {
      return filePath;
    }
  }

  return null;
}

function reconcileQueueGovernanceShell(queueText, context) {
  const ownerValue = matchField(queueText, "belongs_to_target") ?? matchField(queueText, "belongs_to_version");
  const today = new Date().toISOString().slice(0, 10);
  let updatedText = queueText;

  updatedText = replaceOrInsertControlField(
    updatedText,
    "belongs_to_target",
    `- belongs_to_version: \`${ownerValue}\``
  );
  updatedText = replaceOrInsertControlField(
    updatedText,
    "belongs_to_version",
    `- belongs_to_version: \`${ownerValue}\``
  );
  updatedText = replaceOrInsertControlField(
    updatedText,
    "blueprint_version",
    `- blueprint_version: \`${context.blueprintVersion}\``
  );
  updatedText = replaceOrInsertControlField(
    updatedText,
    "governance_last_synced_at",
    `- governance_last_synced_at: \`${today}\``
  );
  updatedText = replaceOrInsertControlField(
    updatedText,
    "governance_sync_source",
    `- governance_sync_source: \`docs/blueprints/blueprint.md\``
  );

  return updatedText;
}

function replaceOrInsertControlField(text, fieldName, replacementLine) {
  const fieldPattern = new RegExp(`^- ${escapeRegExp(fieldName)}:.*$`, "m");
  if (fieldPattern.test(text)) {
    return text.replace(fieldPattern, replacementLine);
  }

  const controlBlockPattern = /(## Control Block\s*\n\n(?:- [^\n]*\n)+)/m;
  const match = text.match(controlBlockPattern);
  if (match == null) {
    return text;
  }

  return text.replace(controlBlockPattern, `${match[1]}${replacementLine}\n`);
}

function matchField(text, fieldName) {
  const pattern = "^- " + escapeRegExp(fieldName) + ": `([^`]+)`";
  const match = text.match(new RegExp(pattern, "m"));
  return match?.[1] ?? null;
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

function relative(repoRoot, targetPath) {
  return path.relative(repoRoot, targetPath).split(path.sep).join("/");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] != null && path.resolve(process.argv[1]) === currentFilePath) {
  const mode = process.argv[2] ?? "check";
  const result = runBlueprintVersionGovernance(mode, process.cwd());
  for (const message of result.messages) {
    console.log(message);
  }
  process.exit(result.ok ? 0 : 1);
}
