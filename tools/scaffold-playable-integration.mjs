import fs from "node:fs";
import path from "node:path";

const usage = `
Usage:
  node tools/scaffold-playable-integration.mjs --integration-id <id> --playable-id <id> --owner-kind <house|scene|task|external> [--owner-id <id>] --return-policy <resume-owner|reenter-owner|close-only> [--output-root <path>]
`.trim();

const args = parseArgs(process.argv.slice(2));
const integrationId = args["integration-id"];
const playableId = args["playable-id"];
const ownerKind = args["owner-kind"];
const ownerId = args["owner-id"] ?? null;
const returnPolicy = args["return-policy"];
const outputRoot = path.resolve(args["output-root"] ?? process.cwd());

if (
  !isNonEmptyString(integrationId) ||
  !isValidPlayableId(playableId) ||
  !isValidOwnerKind(ownerKind) ||
  !isValidReturnPolicy(returnPolicy)
) {
  fail(`${usage}\n\nMissing or invalid required arguments.`);
}

if (ownerKind !== "external" && !isNonEmptyString(ownerId)) {
  fail("Non-external playable integrations require --owner-id.");
}

const integrationFilePath = path.join(
  outputRoot,
  "src",
  "content",
  "playable-integrations",
  `${integrationId}.integration.json`
);

writeNewFile(
  integrationFilePath,
  `${JSON.stringify(
    {
      schemaVersion: 1,
      integrationId,
      playableId,
      ownerDefaults: {
        ownerKind,
        ownerId,
        sessionToken: null,
        returnPolicy,
      },
      trigger: {
        triggerId: `${integrationId}.trigger`,
        ownerKind,
        trigger: "manual",
        when: [],
      },
      outcomeConfig: {
        successWhen: [
          {
            type: "configured-by-editor",
            id: `${integrationId}.success`,
          },
        ],
        failureWhen: [
          {
            type: "configured-by-editor",
            id: `${integrationId}.failure`,
          },
        ],
        cancelledWhen: [
          {
            type: "configured-by-editor",
            id: `${integrationId}.cancelled`,
          },
        ],
        rewardsByOutcome: {
          success: [],
          failure: [],
          cancelled: [],
        },
        handoffByOutcome: {
          success: returnPolicy,
          failure: returnPolicy,
          cancelled: ownerKind === "external" ? "close-only" : returnPolicy,
        },
      },
      contentRefs: {},
    },
    null,
    2
  )}\n`
);

process.stdout.write(
  `Scaffolded playable integration '${integrationId}' for '${playableId}'.\n`
);

function parseArgs(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith("--")) {
      fail(`${usage}\n\nUnexpected argument '${key}'.`);
    }

    const value = argv[index + 1];
    if (value == null || value.startsWith("--")) {
      fail(`${usage}\n\nMissing value for '${key}'.`);
    }

    parsed[key.slice(2)] = value;
    index += 1;
  }

  return parsed;
}

function writeNewFile(filePath, contents) {
  if (fs.existsSync(filePath)) {
    fail(`Refusing to overwrite existing file: ${toPosix(filePath)}`);
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents, "utf8");
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidPlayableId(value) {
  return isNonEmptyString(value) && /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(value);
}

function isValidOwnerKind(value) {
  return value === "house" || value === "scene" || value === "task" || value === "external";
}

function isValidReturnPolicy(value) {
  return value === "resume-owner" || value === "reenter-owner" || value === "close-only";
}

function toPosix(value) {
  return value.replaceAll(path.sep, "/");
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
