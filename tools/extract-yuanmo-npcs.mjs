import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const modDataRoot = path.join(
  repositoryRoot,
  "map",
  "yuan mo feng yun lu",
  "mods",
  "yuanmofengyunlu",
  "data"
);
const outputRoot = path.join(repositoryRoot, "generated");
const stratPath = path.join(
  modDataRoot,
  "world",
  "maps",
  "campaign",
  "imperial_campaign",
  "descr_strat.txt"
);

function stripBom(text) {
  return text.replace(/^\uFEFF/, "");
}

async function readText(filePath, encoding = "utf8") {
  return stripBom(await readFile(filePath, encoding));
}

async function readUtf16Text(filePath) {
  return readText(filePath, "utf16le");
}

function parseLocalisationTable(text) {
  const entries = new Map();
  const entryPattern = /^\{([^}]+)\}\s*(.*)$/gm;
  let match;

  while ((match = entryPattern.exec(text)) != null) {
    const key = match[1]?.trim();
    const value = match[2]?.trim() ?? "";
    if (key != null && key !== "") {
      entries.set(key, value);
    }
  }

  return entries;
}

function parseTraitLevels(text) {
  const traitLevels = new Map();
  let currentTrait = null;

  for (const line of text.split(/\r?\n/)) {
    const traitMatch = line.match(/^\s*Trait\s+(\S+)/);
    if (traitMatch != null) {
      currentTrait = traitMatch[1];
      continue;
    }

    const levelMatch = line.match(/^\s*Level\s+(\S+)/);
    if (currentTrait != null && levelMatch != null && !traitLevels.has(currentTrait)) {
      traitLevels.set(currentTrait, levelMatch[1]);
    }
  }

  return traitLevels;
}

function parseTraitToken(token) {
  const match = token.trim().match(/^(\S+)(?:\s+(-?\d+))?$/);
  if (match == null) {
    return null;
  }

  return {
    id: match[1],
    level: match[2] == null ? 1 : Number(match[2]),
  };
}

function parseTraits(line) {
  return line
    .replace(/^traits\s+/i, "")
    .split(",")
    .map(parseTraitToken)
    .filter((trait) => trait != null);
}

function localizeName(rawName, namesByKey) {
  const tokens = rawName.trim().split(/\s+/).filter(Boolean);
  const localizedTokens = tokens.map((token) => namesByKey.get(token) ?? token);
  return localizedTokens.join("");
}

function parseCharacterLine(line, faction, namesByKey) {
  const match = line.match(/^character\s+([^,]+),\s*([^,]+)(.*)$/i);
  if (match == null) {
    return null;
  }

  const rawName = match[1]?.trim() ?? "";
  const fields = line
    .replace(/^character\s+[^,]+,/i, "")
    .split(",")
    .map((field) => field.trim())
    .filter(Boolean);
  const role =
    fields.find((field) =>
      /^(named character|general|admiral|diplomat|spy|assassin|merchant|princess)$/i.test(field)
    ) ?? "unknown";
  const rest = fields.join(", ");
  const ageMatch = rest.match(/age\s+(\d+)/i);
  const xMatch = rest.match(/\bx\s+(\d+)/i);
  const yMatch = rest.match(/\by\s+(\d+)/i);
  const portraitMatch = rest.match(/portrait\s+([^,\s]+)/i);
  const battleModelMatch = rest.match(/battle_model\s+([^,\s]+)/i);

  return {
    id: `yuanmo.character.${rawName.replace(/[^A-Za-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "")}`,
    sourceName: rawName,
    name: localizeName(rawName, namesByKey),
    faction,
    role,
    gender: /\bfemale\b/i.test(rest) ? "female" : "male",
    isLeader: /\bleader\b/i.test(rest),
    isHeir: /\bheir\b/i.test(rest),
    age: ageMatch == null ? null : Number(ageMatch[1]),
    x: xMatch == null ? null : Number(xMatch[1]),
    y: yMatch == null ? null : Number(yMatch[1]),
    portrait: portraitMatch?.[1] ?? null,
    battleModel: battleModelMatch?.[1] ?? null,
    traits: [],
    biographyTraitId: null,
    biography: null,
    epithet: null,
  };
}

function enrichCharacter(character, traitLevelsById, vnvsByKey) {
  for (const trait of character.traits) {
    const levelKey = traitLevelsById.get(trait.id);
    if (levelKey == null) {
      continue;
    }

    const biography = vnvsByKey.get(`${levelKey}_desc`);
    const epithet = vnvsByKey.get(`${levelKey}_epithet_desc`);
    if (biography != null || epithet != null) {
      character.biographyTraitId = trait.id;
      character.biography = biography ?? null;
      character.epithet = epithet ?? null;
      break;
    }
  }
}

function parseDescrStrat(text, namesByKey, traitLevelsById, vnvsByKey) {
  const characters = [];
  let currentFaction = "unknown";
  let currentCharacter = null;

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith(";")) {
      continue;
    }

    const factionMatch = trimmed.match(/^faction\s+([^,\s]+)/i);
    if (factionMatch != null) {
      currentFaction = factionMatch[1] ?? currentFaction;
      currentCharacter = null;
      continue;
    }

    if (/^character\s+/i.test(trimmed)) {
      currentCharacter = parseCharacterLine(trimmed, currentFaction, namesByKey);
      if (currentCharacter != null) {
        characters.push(currentCharacter);
      }
      continue;
    }

    if (currentCharacter != null && /^traits\s+/i.test(trimmed)) {
      currentCharacter.traits = parseTraits(trimmed);
      enrichCharacter(currentCharacter, traitLevelsById, vnvsByKey);
    }
  }

  return characters;
}

function summarize(characters) {
  const byFaction = {};
  const byRole = {};

  for (const character of characters) {
    byFaction[character.faction] = (byFaction[character.faction] ?? 0) + 1;
    byRole[character.role] = (byRole[character.role] ?? 0) + 1;
  }

  return {
    total: characters.length,
    withLocalizedName: characters.filter(
      (character) => character.name !== character.sourceName
    ).length,
    withBiography: characters.filter((character) => character.biography != null).length,
    withEpithet: characters.filter((character) => character.epithet != null).length,
    byFaction: Object.fromEntries(
      Object.entries(byFaction).sort((left, right) => right[1] - left[1])
    ),
    byRole: Object.fromEntries(
      Object.entries(byRole).sort((left, right) => right[1] - left[1])
    ),
    nearDadu: characters
      .filter(
        (character) =>
          character.x != null &&
          character.y != null &&
          Math.abs(character.x - 339) <= 35 &&
          Math.abs(character.y - 362) <= 35
      )
      .slice(0, 40),
  };
}

async function main() {
  const [strat, namesText, vnvsText, traitText] = await Promise.all([
    readText(stratPath, "latin1"),
    readUtf16Text(path.join(modDataRoot, "text", "names.txt")),
    readUtf16Text(path.join(modDataRoot, "text", "export_vnvs.txt")),
    readText(path.join(modDataRoot, "export_descr_character_traits.txt")),
  ]);

  const namesByKey = parseLocalisationTable(namesText);
  const vnvsByKey = parseLocalisationTable(vnvsText);
  const traitLevelsById = parseTraitLevels(traitText);
  const characters = parseDescrStrat(strat, namesByKey, traitLevelsById, vnvsByKey);
  const summary = summarize(characters);

  await mkdir(outputRoot, { recursive: true });
  await Promise.all([
    writeFile(
      path.join(outputRoot, "yuanmo-npcs.json"),
      `${JSON.stringify(characters, null, 2)}\n`,
      "utf8"
    ),
    writeFile(
      path.join(outputRoot, "yuanmo-npc-summary.json"),
      `${JSON.stringify(summary, null, 2)}\n`,
      "utf8"
    ),
  ]);

  console.log(JSON.stringify(summary, null, 2));
}

await main();
