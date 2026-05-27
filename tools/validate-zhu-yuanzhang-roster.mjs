import { readFileSync } from "node:fs";

const rosterSource = readFileSync(
  new URL("../src/content/zhu-yuanzhang-early-characters.ts", import.meta.url),
  "utf8"
);
const mapSource = readFileSync(
  new URL("../src/content/yuanmo-campaign-map.ts", import.meta.url),
  "utf8"
);

function collectStringPropertyValues(source, propertyName) {
  const values = [];
  const pattern = new RegExp(`"?${propertyName}"?:\\s*"([^"]+)"`, "g");
  for (const match of source.matchAll(pattern)) {
    values.push(match[1]);
  }
  return values;
}

function collectStringArrayValues(source, propertyName) {
  const values = [];
  const pattern = new RegExp(`${propertyName}:\\s*\\[([\\s\\S]*?)\\]`, "g");
  for (const match of source.matchAll(pattern)) {
    const arrayBody = match[1] ?? "";
    for (const stringMatch of arrayBody.matchAll(/"([^"]+)"/g)) {
      values.push(stringMatch[1]);
    }
  }
  return values;
}

function fail(messages) {
  for (const message of messages) {
    console.error(`- ${message}`);
  }
  process.exit(1);
}

const mapNodeIds = new Set(collectStringPropertyValues(mapSource, "id"));
const characterIds = collectStringPropertyValues(rosterSource, "id").filter((id) =>
  id.startsWith("zyz.character.")
);
const uniqueCharacterIds = new Set(characterIds);
const rosterCityNodeIds = collectStringPropertyValues(rosterSource, "cityNodeId");
const characterCityNodeIds = [
  ...collectStringPropertyValues(rosterSource, "homeCityNodeId"),
  ...collectStringPropertyValues(rosterSource, "currentCityNodeId"),
  ...collectStringArrayValues(rosterSource, "relatedCityNodeIds"),
].filter((id) => id.startsWith("settlement."));
const rosterCharacterIds = [
  ...collectStringArrayValues(rosterSource, "primaryCharacterIds"),
  ...collectStringArrayValues(rosterSource, "secondaryCharacterIds"),
  ...collectStringArrayValues(rosterSource, "backgroundCharacterIds"),
];

const errors = [];

if (characterIds.length !== uniqueCharacterIds.size) {
  const seen = new Set();
  const duplicated = new Set();
  for (const characterId of characterIds) {
    if (seen.has(characterId)) {
      duplicated.add(characterId);
    }
    seen.add(characterId);
  }
  errors.push(`Duplicate character ids: ${[...duplicated].join(", ")}`);
}

for (const characterId of rosterCharacterIds) {
  if (!uniqueCharacterIds.has(characterId)) {
    errors.push(`Roster references missing character id "${characterId}".`);
  }
}

for (const cityNodeId of [...rosterCityNodeIds, ...characterCityNodeIds]) {
  if (!mapNodeIds.has(cityNodeId)) {
    errors.push(`Roster references missing map node id "${cityNodeId}".`);
  }
}

for (const cityNodeId of rosterCityNodeIds) {
  const rosterBlockPattern = new RegExp(
    `cityNodeId:\\s*"${cityNodeId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]*?notes:\\s*"([^"]*)"`,
    "m"
  );
  const notes = rosterSource.match(rosterBlockPattern)?.[1] ?? "";
  if (notes.length === 0) {
    errors.push(`City roster "${cityNodeId}" is missing notes.`);
  }
}

if (errors.length > 0) {
  fail(errors);
}

console.log(
  `Validated ${uniqueCharacterIds.size} characters across ${rosterCityNodeIds.length} city rosters.`
);
