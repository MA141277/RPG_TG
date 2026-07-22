import fs from "node:fs";
import path from "node:path";
import {
  createScenarioPackManifest,
  SCENARIO_PACK_CANONICAL_FILES,
} from "./scenario-pack-authoring-contract.mjs";

const usage = `
Usage:
  node tools/scaffold-scenario-pack.mjs --pack-id <id> --directory-name <name> --title <title> --player-character-id <id> --chapter-id <id> --map-id <id> --city-id <id> [--description <text>] [--sort <number>] [--is-default <true|false>] [--output-root <path>]
`.trim();

const args = parseArgs(process.argv.slice(2));
const packId = args["pack-id"];
const directoryName = args["directory-name"];
const title = args.title;
const playerCharacterId = args["player-character-id"];
const chapterId = args["chapter-id"];
const mapId = args["map-id"];
const cityId = args["city-id"];
const description = args.description;
const outputRoot = path.resolve(args["output-root"] ?? process.cwd());
const sort = parseOptionalInteger(args.sort, "sort");
const isDefault = parseBooleanFlag(args["is-default"] ?? "false", "is-default");

if (
  !isNonEmptyString(packId) ||
  !isValidDirectoryName(directoryName) ||
  !isNonEmptyString(title) ||
  !isNonEmptyString(playerCharacterId) ||
  !isNonEmptyString(chapterId) ||
  !isNonEmptyString(mapId) ||
  !isNonEmptyString(cityId)
) {
  fail(`${usage}\n\nMissing or invalid required arguments.`);
}

const scenarioPacksRoot = path.join(outputRoot, "src", "content", "scenario-packs");
const catalogPath = path.join(scenarioPacksRoot, "catalog.json");
const manifestPath = path.join(scenarioPacksRoot, directoryName, "pack.json");

if (fs.existsSync(manifestPath)) {
  fail(`Refusing to overwrite existing manifest: ${toPosix(manifestPath)}`);
}

const catalogEntries = readCatalogEntries(catalogPath);
const manifestRelativePath = `./${directoryName}/pack.json`;

if (catalogEntries.some((entry) => entry.id === packId)) {
  fail(`Scenario pack id already exists in catalog: ${packId}`);
}
if (catalogEntries.some((entry) => entry.manifestPath === manifestRelativePath)) {
  fail(`Scenario pack manifest path already exists in catalog: ${manifestRelativePath}`);
}
if (isDefault && catalogEntries.some((entry) => entry.isDefault === true)) {
  fail("Scenario pack catalog already has a default entry.");
}

const packDirectory = path.dirname(manifestPath);
writeNewFile(
  manifestPath,
  `${JSON.stringify(createScenarioPackManifest({ packId, title, description }), null, 2)}\n`
);

for (const [relativePath, contents] of Object.entries({
  [SCENARIO_PACK_CANONICAL_FILES.scenarioProfile]: {
    id: `${packId}.profile`,
    playerCharacterId,
    chapterId,
    initialLocation: {
      mapId,
      cityId,
      houseId: null,
      view: "city",
    },
  },
  [SCENARIO_PACK_CANONICAL_FILES.characters]: [],
  [SCENARIO_PACK_CANONICAL_FILES.cities]: [],
  [SCENARIO_PACK_CANONICAL_FILES.houses]: [],
  [SCENARIO_PACK_CANONICAL_FILES.maps]: [],
  [SCENARIO_PACK_CANONICAL_FILES.cityEntries]: [],
  [SCENARIO_PACK_CANONICAL_FILES.events]: [],
  [SCENARIO_PACK_CANONICAL_FILES.dialogues]: [],
  [SCENARIO_PACK_CANONICAL_FILES.tasks]: [],
  [SCENARIO_PACK_CANONICAL_FILES.activities]: [],
  [SCENARIO_PACK_CANONICAL_FILES.textEntries]: {},
})) {
  writeNewFile(
    path.join(packDirectory, relativePath),
    `${JSON.stringify(contents, null, 2)}\n`
  );
}

const nextSort =
  sort ?? catalogEntries.reduce((maxSort, entry) => Math.max(maxSort, entry.sort ?? 0), 0) + 10;
const nextCatalogEntries = sortCatalogEntries([
  ...catalogEntries,
  {
    id: packId,
    title,
    ...(isNonEmptyString(description) ? { description } : {}),
    manifestPath: manifestRelativePath,
    sort: nextSort,
    ...(isDefault ? { isDefault: true } : {}),
  },
]);

fs.mkdirSync(path.dirname(catalogPath), { recursive: true });
fs.writeFileSync(catalogPath, `${JSON.stringify(nextCatalogEntries, null, 2)}\n`, "utf8");

process.stdout.write(
  `Scaffolded scenario pack '${packId}' in ${toPosix(path.relative(outputRoot, packDirectory))}.\n`
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

function readCatalogEntries(catalogPathValue) {
  if (!fs.existsSync(catalogPathValue)) {
    return [];
  }

  const parsed = JSON.parse(fs.readFileSync(catalogPathValue, "utf8"));
  if (!Array.isArray(parsed)) {
    fail(`Scenario pack catalog must be an array: ${toPosix(catalogPathValue)}`);
  }

  return parsed;
}

function sortCatalogEntries(entries) {
  return [...entries].sort(
    (left, right) =>
      (left.sort ?? 0) - (right.sort ?? 0) || left.title.localeCompare(right.title)
  );
}

function writeNewFile(filePath, contents) {
  if (fs.existsSync(filePath)) {
    fail(`Refusing to overwrite existing file: ${toPosix(filePath)}`);
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents, "utf8");
}

function parseOptionalInteger(value, label) {
  if (value == null) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    fail(`${label} must be an integer.`);
  }

  return parsed;
}

function parseBooleanFlag(value, label) {
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }

  fail(`${label} must be 'true' or 'false'.`);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidDirectoryName(value) {
  return isNonEmptyString(value) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function toPosix(value) {
  return value.replaceAll(path.sep, "/");
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
