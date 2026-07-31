import fs from "node:fs";
import path from "node:path";

const VALID_OWNER_KINDS = new Set(["house", "scene", "task", "external"]);
const VALID_RETURN_POLICIES = new Set([
  "resume-owner",
  "reenter-owner",
  "close-only",
]);
const KNOWN_BUILTIN_PLAYABLE_IDS = new Set([
  "activity-qte",
  "city-begging",
  "grain-accounting",
  "medicine-compounding",
  "story-battle",
]);

const args = parseArgs(process.argv.slice(2));
const repoRoot = path.resolve(args["repo-root"] ?? process.cwd());
const mechanicDir = path.join(repoRoot, "src", "content", "playables");
const integrationDir = path.join(repoRoot, "src", "content", "playable-integrations");

const mechanicFiles = listJsonFiles(mechanicDir, ".playable.json");
const integrationFiles = listJsonFiles(integrationDir, ".integration.json");
const errors = [];
const playableIds = new Set(KNOWN_BUILTIN_PLAYABLE_IDS);

for (const filePath of mechanicFiles) {
  const artifact = readJsonFile(filePath, errors);
  if (artifact == null) {
    continue;
  }

  validateMechanicArtifact({ repoRoot, filePath, artifact, errors });
  if (isNonEmptyString(artifact.playableId)) {
    playableIds.add(artifact.playableId);
  }
}

for (const filePath of integrationFiles) {
  const artifact = readJsonFile(filePath, errors);
  if (artifact == null) {
    continue;
  }

  validateIntegrationArtifact({
    filePath,
    artifact,
    playableIds,
    errors,
  });
}

if (errors.length > 0) {
  process.stderr.write(`Playable validation failed with ${errors.length} error(s):\n`);
  for (const error of errors) {
    process.stderr.write(`- ${error}\n`);
  }
  process.exit(1);
}

process.stdout.write(
  `Playable validation passed: ${mechanicFiles.length} mechanic artifact(s), ${integrationFiles.length} integration artifact(s).\n`
);

function validateMechanicArtifact({ repoRoot, filePath, artifact, errors }) {
  if (artifact.schemaVersion !== 1) {
    errors.push(`${relative(repoRoot, filePath)}: schemaVersion must be 1.`);
  }
  if (!isValidPlayableId(artifact.playableId)) {
    errors.push(`${relative(repoRoot, filePath)}: playableId must be kebab-case.`);
  }
  if (!isNonEmptyString(artifact.title)) {
    errors.push(`${relative(repoRoot, filePath)}: title is required.`);
  }
  if (!isNonEmptyString(artifact.kind)) {
    errors.push(`${relative(repoRoot, filePath)}: kind is required.`);
  }

  if (!isValidPlayableId(artifact.playableId)) {
    return;
  }

  const requiredPaths = [
    `src/domain/playables/${artifact.playableId}.ts`,
    `src/application/playables/${artifact.playableId}/${artifact.playableId}-definition.ts`,
    `src/application/playables/${artifact.playableId}/${artifact.playableId}-session.ts`,
    `src/application/playables/${artifact.playableId}/${artifact.playableId}-presenter.ts`,
    `src/application/playables/${artifact.playableId}/${artifact.playableId}-metrics.ts`,
    `src/application/playables/${artifact.playableId}/${artifact.playableId}-settlement.ts`,
    `src/ui/views/playables/${artifact.playableId}-view.ts`,
  ];

  for (const relativePath of requiredPaths) {
    const absolutePath = path.join(repoRoot, relativePath);
    if (!fs.existsSync(absolutePath)) {
      errors.push(
        `${relative(repoRoot, filePath)}: missing canonical playable file ${relativePath}.`
      );
    }
  }
}

function validateIntegrationArtifact({ filePath, artifact, playableIds, errors }) {
  const fileLabel = toPosix(filePath);

  if (artifact.schemaVersion !== 1) {
    errors.push(`${fileLabel}: schemaVersion must be 1.`);
  }
  if (!isNonEmptyString(artifact.integrationId)) {
    errors.push(`${fileLabel}: integrationId is required.`);
  }
  if (!isValidPlayableId(artifact.playableId)) {
    errors.push(`${fileLabel}: playableId must be kebab-case.`);
  } else if (!playableIds.has(artifact.playableId)) {
    errors.push(`${fileLabel}: playableId '${artifact.playableId}' is unknown.`);
  }

  const ownerDefaults = artifact.ownerDefaults;
  if (!isObject(ownerDefaults)) {
    errors.push(`${fileLabel}: ownerDefaults is required.`);
  } else {
    if (!VALID_OWNER_KINDS.has(ownerDefaults.ownerKind)) {
      errors.push(`${fileLabel}: ownerDefaults.ownerKind is invalid.`);
    }
    if (
      ownerDefaults.ownerKind !== "external" &&
      !isNonEmptyString(ownerDefaults.ownerId)
    ) {
      errors.push(`${fileLabel}: non-external ownerDefaults require ownerId.`);
    }
    if (
      ownerDefaults.ownerKind === "external" &&
      ownerDefaults.ownerId !== null &&
      ownerDefaults.ownerId !== undefined &&
      ownerDefaults.ownerId !== ""
    ) {
      errors.push(`${fileLabel}: external ownerDefaults.ownerId must be null or empty.`);
    }
    if (!VALID_RETURN_POLICIES.has(ownerDefaults.returnPolicy)) {
      errors.push(`${fileLabel}: ownerDefaults.returnPolicy is invalid.`);
    }
  }

  const trigger = artifact.trigger;
  if (!isObject(trigger)) {
    errors.push(`${fileLabel}: trigger configuration is required.`);
  } else {
    if (!isNonEmptyString(trigger.triggerId)) {
      errors.push(`${fileLabel}: trigger.triggerId is required.`);
    }
    if (!VALID_OWNER_KINDS.has(trigger.ownerKind)) {
      errors.push(`${fileLabel}: trigger.ownerKind is invalid.`);
    }
    if (!isNonEmptyString(trigger.trigger)) {
      errors.push(`${fileLabel}: trigger.trigger is required.`);
    }
    if (
      isObject(ownerDefaults) &&
      VALID_OWNER_KINDS.has(ownerDefaults.ownerKind) &&
      VALID_OWNER_KINDS.has(trigger.ownerKind) &&
      ownerDefaults.ownerKind !== trigger.ownerKind
    ) {
      errors.push(`${fileLabel}: trigger.ownerKind must match ownerDefaults.ownerKind.`);
    }
  }

  const outcomeConfig = artifact.outcomeConfig;
  if (!isObject(outcomeConfig)) {
    errors.push(`${fileLabel}: outcomeConfig is required.`);
    return;
  }

  const successWhen = normalizeConditionList(outcomeConfig.successWhen);
  const failureWhen = normalizeConditionList(outcomeConfig.failureWhen);
  const cancelledWhen = normalizeConditionList(
    outcomeConfig.cancelledWhen ?? outcomeConfig.cancelWhen
  );

  if (
    successWhen.length === 0 &&
    failureWhen.length === 0 &&
    cancelledWhen.length === 0
  ) {
    errors.push(`${fileLabel}: missing outcome conditions.`);
  }

  const handoffByOutcome = outcomeConfig.handoffByOutcome;
  if (handoffByOutcome != null) {
    for (const [outcome, policy] of Object.entries(handoffByOutcome)) {
      if (!VALID_RETURN_POLICIES.has(policy)) {
        errors.push(
          `${fileLabel}: handoffByOutcome.${outcome} must be a valid return policy.`
        );
      }
    }
  }

  const rewardsByOutcome = outcomeConfig.rewardsByOutcome;
  if (rewardsByOutcome != null && !isObject(rewardsByOutcome)) {
    errors.push(`${fileLabel}: rewardsByOutcome must be an object when provided.`);
  }
}

function parseArgs(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith("--")) {
      fail(`Unexpected argument '${key}'.`);
    }

    const value = argv[index + 1];
    if (value == null || value.startsWith("--")) {
      fail(`Missing value for '${key}'.`);
    }

    parsed[key.slice(2)] = value;
    index += 1;
  }

  return parsed;
}

function listJsonFiles(rootPath, suffix) {
  if (!fs.existsSync(rootPath)) {
    return [];
  }

  return fs
    .readdirSync(rootPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(suffix))
    .map((entry) => path.join(rootPath, entry.name));
}

function readJsonFile(filePath, errors) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    errors.push(`${toPosix(filePath)}: invalid JSON (${error.message}).`);
    return null;
  }
}

function normalizeConditionList(value) {
  return Array.isArray(value) ? value : [];
}

function isObject(value) {
  return typeof value === "object" && value != null && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidPlayableId(value) {
  return isNonEmptyString(value) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function toPosix(value) {
  return value.replaceAll(path.sep, "/");
}

function relative(rootPath, filePath) {
  return toPosix(path.relative(rootPath, filePath));
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
