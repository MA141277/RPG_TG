import fs from "node:fs";
import path from "node:path";
import {
  SCENARIO_PACK_AUTHORING_TEMPLATE,
  SCENARIO_PACK_CANONICAL_FILES,
  SCENARIO_PACK_REQUIRED_FILE_KEYS,
} from "./scenario-pack-authoring-contract.mjs";

const args = parseArgs(process.argv.slice(2));
const repoRoot = path.resolve(args["repo-root"] ?? process.cwd());
const scenarioPacksRoot = path.join(repoRoot, "src", "content", "scenario-packs");
const catalogPath = path.join(scenarioPacksRoot, "catalog.json");
const packContentAccessPath = path.join(repoRoot, "src", "content", "pack-content-access.ts");
const errors = [];

const catalogEntries = readCatalog(catalogPath, errors);

for (const [index, entry] of catalogEntries.entries()) {
  validateCatalogEntry({
    entry,
    entryIndex: index,
    scenarioPacksRoot,
    errors,
  });
}

if (fs.existsSync(packContentAccessPath)) {
  validateDefaultPackAuthoringContract({
    catalogEntries,
    packContentAccessPath,
    errors,
  });
}

if (errors.length > 0) {
  process.stderr.write(`Scenario pack validation failed with ${errors.length} error(s):\n`);
  for (const error of errors) {
    process.stderr.write(`- ${error}\n`);
  }
  process.exit(1);
}

process.stdout.write(
  `Scenario pack validation passed: ${catalogEntries.length} catalog entr${catalogEntries.length === 1 ? "y" : "ies"}.\n`
);

function validateCatalogEntry({ entry, entryIndex, scenarioPacksRoot, errors }) {
  const label = `catalog entry ${entryIndex}`;
  if (!isObject(entry)) {
    errors.push(`${label}: entry must be an object.`);
    return;
  }
  if (!isNonEmptyString(entry.id)) {
    errors.push(`${label}: id is required.`);
  }
  if (!isNonEmptyString(entry.title)) {
    errors.push(`${label}: title is required.`);
  }
  if (!isNonEmptyString(entry.manifestPath)) {
    errors.push(`${label}: manifestPath is required.`);
    return;
  }

  const manifestPath = path.join(scenarioPacksRoot, entry.manifestPath);
  if (!fs.existsSync(manifestPath)) {
    errors.push(`${label}: missing manifest ${toPosix(manifestPath)}.`);
    return;
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (error) {
    errors.push(`${label}: invalid manifest JSON (${error.message}).`);
    return;
  }

  if (manifest.schemaVersion !== 1) {
    errors.push(`${label}: manifest schemaVersion must be 1.`);
  }
  if (manifest.kind !== "scenario-pack") {
    errors.push(`${label}: manifest kind must be scenario-pack.`);
  }
  if (manifest.id !== entry.id) {
    errors.push(`${label}: manifest id must match catalog id.`);
  }
  if (manifest.title !== entry.title) {
    errors.push(`${label}: manifest title must match catalog title.`);
  }
  if (!isObject(manifest.files)) {
    errors.push(`${label}: manifest files block is required.`);
    return;
  }

  if (manifest.authoringTemplate === SCENARIO_PACK_AUTHORING_TEMPLATE) {
    for (const requiredKey of SCENARIO_PACK_REQUIRED_FILE_KEYS) {
      if (!isNonEmptyString(manifest.files[requiredKey])) {
        errors.push(`${label}: manifest files.${requiredKey} is required.`);
      }
    }

    for (const [requiredKey, expectedRelativePath] of Object.entries(
      SCENARIO_PACK_CANONICAL_FILES
    )) {
      if (manifest.files[requiredKey] !== expectedRelativePath) {
        errors.push(
          `${label}: manifest files.${requiredKey} must be ${expectedRelativePath}.`
        );
      }
    }
  }

  const manifestDirectory = path.dirname(manifestPath);
  for (const [key, relativePath] of Object.entries(manifest.files)) {
    if (!isNonEmptyString(relativePath)) {
      errors.push(`${label}: manifest files.${key} must be a non-empty string.`);
      continue;
    }

    const referencedPath = path.join(manifestDirectory, relativePath);
    if (!fs.existsSync(referencedPath)) {
      errors.push(
        `${label}: manifest files.${key} points to missing file ${toPosix(referencedPath)}.`
      );
    }
  }
}

function validateDefaultPackAuthoringContract({
  catalogEntries,
  packContentAccessPath,
  errors,
}) {
  const defaultEntries = catalogEntries.filter((entry) => entry.isDefault === true);
  if (defaultEntries.length !== 1) {
    errors.push(
      `default pack authoring contract requires exactly one default scenario pack entry, found ${defaultEntries.length}.`
    );
    return;
  }

  const defaultEntry = defaultEntries[0];
  const defaultDirectory = path.basename(path.dirname(defaultEntry.manifestPath));
  const source = fs.readFileSync(packContentAccessPath, "utf8");
  const referencedDirectories = [
    ...new Set(
      [...source.matchAll(/["']\.\/scenario-packs\/([^\/"'\\]+)\//g)].map(
        (match) => match[1]
      )
    ),
  ];

  if (referencedDirectories.length === 0) {
    errors.push(
      "default pack authoring contract requires pack-content-access.ts to import scenario-pack JSON from the default scenario pack directory."
    );
    return;
  }

  for (const directory of referencedDirectories) {
    if (directory !== defaultDirectory) {
      errors.push(
        `default pack authoring contract drift: pack-content-access.ts imports scenario pack directory '${directory}', expected '${defaultDirectory}'.`
      );
    }
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

function readCatalog(catalogPathValue, errors) {
  if (!fs.existsSync(catalogPathValue)) {
    errors.push(`Missing scenario pack catalog: ${toPosix(catalogPathValue)}.`);
    return [];
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(catalogPathValue, "utf8"));
    if (!Array.isArray(parsed)) {
      errors.push(`Scenario pack catalog must be an array: ${toPosix(catalogPathValue)}.`);
      return [];
    }
    return parsed;
  } catch (error) {
    errors.push(`Scenario pack catalog JSON is invalid: ${error.message}.`);
    return [];
  }
}

function isObject(value) {
  return typeof value === "object" && value != null && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function toPosix(value) {
  return value.replaceAll(path.sep, "/");
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
