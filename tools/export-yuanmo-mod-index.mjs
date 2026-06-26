import fs from "node:fs/promises";
import path from "node:path";

const MOD_ROOT = "D:/RPG_TG/map/yuan mo feng yun lu/mods/yuanmofengyunlu";
const DATA_ROOT = path.join(MOD_ROOT, "data");
const UNIT_FILE = path.join(DATA_ROOT, "export_descr_unit.txt");
const ANCILLARY_FILE = path.join(DATA_ROOT, "export_descr_ancillaries.txt");
const RESOURCE_FILE = path.join(DATA_ROOT, "descr_sm_resources.txt");
const UNIT_TEXT_FILE = path.join(DATA_ROOT, "text", "export_units.txt");
const ANCILLARY_TEXT_FILE = path.join(DATA_ROOT, "text", "export_ancillaries.txt");
const OUTPUT_DIR = "D:/RPG_TG/generated";

const RED_TURBAN_FACTIONS = new Set(["portugal", "papal_states", "scotland", "sicily"]);
const YUAN_FACTIONS = new Set(["byzantium", "moors", "saxons", "turks"]);
const RED_TURBAN_KEYWORDS = [
  "chuang_",
  "shun_",
  "daxi_",
  "jianghan_",
  "zhongyuan_",
  "dqs ",
  "dqs_",
  "qin_",
  "capital_",
  "ming_",
  "hongdengzhao",
  "xiaodaohui",
];
const YUAN_KEYWORDS = [
  "dayuan",
  "menggu",
  "mongol",
  "manchu",
  "steppe",
  "mon_",
  "hanren",
  "lvying",
  "baqi",
  "qing_",
];

function normalizeWhitespace(value) {
  return value.replace(/\r/g, "").trim();
}

function splitCommaList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseTextMap(content) {
  const lines = content.split(/\r?\n/);
  const map = new Map();

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    const match = line.match(/^\{([^}]+)\}(.*)$/);
    if (match == null) {
      continue;
    }

    const key = match[1];
    let value = match[2] ?? "";

    while (value.includes("\\n")) {
      value = value.replace(/\\n/g, "\n");
    }

    map.set(key, value.trim());
  }

  return map;
}

function parseUnitDefinitions(content) {
  const lines = content.split(/\r?\n/);
  const units = [];
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\t/g, " ").trim();
    if (line === "" || line.startsWith(";")) {
      continue;
    }

    const entryMatch = line.match(/^([a-zA-Z_]+)\s+(.+)$/);
    if (entryMatch == null) {
      continue;
    }

    const [, key, value] = entryMatch;
    if (key === "type") {
      if (current != null) {
        units.push(current);
      }
      current = { type: value.trim() };
      continue;
    }

    if (current == null) {
      continue;
    }

    current[key] = value.trim();
  }

  if (current != null) {
    units.push(current);
  }

  return units.map((unit) => {
    const ownership = splitCommaList(unit.ownership ?? "");
    const soldierParts = splitCommaList(unit.soldier ?? "");
    const mount = unit.mount ?? null;

    return {
      type: unit.type,
      dictionary: unit.dictionary ?? unit.type,
      category: unit.category ?? null,
      class: unit.class ?? null,
      soldier: unit.soldier ?? null,
      soldierModel: soldierParts[0] ?? null,
      soldierCount: soldierParts[1] != null ? Number.parseInt(soldierParts[1], 10) : null,
      mount,
      ownership,
      statPri: unit.stat_pri ?? null,
      statSec: unit.stat_sec ?? null,
      statCost: unit.stat_cost ?? null,
      armourUgModels: splitCommaList(unit.armour_ug_models ?? ""),
      attributes: splitCommaList(unit.attributes ?? ""),
    };
  });
}

function parseAncillaries(content) {
  const lines = content.split(/\r?\n/);
  const entries = [];
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\t/g, " ").trim();
    if (line === "" || line.startsWith(";")) {
      continue;
    }

    const ancillaryMatch = line.match(/^Ancillary\s+(.+)$/);
    if (ancillaryMatch != null) {
      if (current != null) {
        entries.push(current);
      }
      current = { id: ancillaryMatch[1].trim() };
      continue;
    }

    if (current == null) {
      continue;
    }

    const kvMatch = line.match(/^([A-Za-z_]+)\s+(.+)$/);
    if (kvMatch == null) {
      continue;
    }

    const [, key, value] = kvMatch;
    current[key] = value.trim();
  }

  if (current != null) {
    entries.push(current);
  }

  return entries;
}

function parseResources(content) {
  const lines = content.split(/\r?\n/);
  const resources = [];
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\t/g, " ").trim();
    if (line === "" || line.startsWith(";")) {
      continue;
    }

    const match = line.match(/^([A-Za-z_]+)\s+(.+)$/);
    if (match == null) {
      continue;
    }

    const [, key, value] = match;
    if (key === "type") {
      if (current != null) {
        resources.push(current);
      }
      current = { type: value.trim() };
      continue;
    }

    if (current == null) {
      continue;
    }

    current[key] = value.trim();
  }

  if (current != null) {
    resources.push(current);
  }

  return resources;
}

async function countFiles(root, extension) {
  const entries = await fs.readdir(root, { withFileTypes: true });
  let count = 0;

  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      count += await countFiles(fullPath, extension);
      continue;
    }

    if (fullPath.toLowerCase().endsWith(extension)) {
      count += 1;
    }
  }

  return count;
}

async function listTopLevelModelDirs(root) {
  const entries = await fs.readdir(root, { withFileTypes: true });
  const result = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const fullPath = path.join(root, entry.name);
    const meshCount = await countFiles(fullPath, ".mesh");
    const textureCount = await countFiles(fullPath, ".texture");
    if (meshCount === 0 && textureCount === 0) {
      continue;
    }

    result.push({
      name: entry.name,
      meshCount,
      textureCount,
    });
  }

  return result.sort((a, b) => b.meshCount - a.meshCount);
}

function hasKeyword(value, keywords) {
  const normalized = value.toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword));
}

function classifyAlignment(unit) {
  const typeText = `${unit.type} ${unit.dictionary} ${unit.soldierModel ?? ""}`.toLowerCase();
  const hasRedKeyword = hasKeyword(typeText, RED_TURBAN_KEYWORDS);
  const hasYuanKeyword = hasKeyword(typeText, YUAN_KEYWORDS);

  if (unit.category === "ship") {
    return "other";
  }

  if (hasRedKeyword && !hasYuanKeyword) {
    return "red_turban";
  }

  if (hasYuanKeyword && !hasRedKeyword) {
    return "yuan";
  }

  return "other";
}

function dedupeByType(units) {
  const seen = new Set();
  return units.filter((unit) => {
    if (seen.has(unit.type)) {
      return false;
    }
    seen.add(unit.type);
    return true;
  });
}

async function main() {
  const [
    unitContent,
    ancillaryContent,
    resourceContent,
    unitTextContent,
    ancillaryTextContent,
  ] = await Promise.all([
    fs.readFile(UNIT_FILE, "utf8"),
    fs.readFile(ANCILLARY_FILE, "utf8"),
    fs.readFile(RESOURCE_FILE, "utf8"),
    fs.readFile(UNIT_TEXT_FILE, "utf8"),
    fs.readFile(ANCILLARY_TEXT_FILE, "utf8"),
  ]);

  const unitTextMap = parseTextMap(unitTextContent);
  const ancillaryTextMap = parseTextMap(ancillaryTextContent);
  const units = parseUnitDefinitions(unitContent).map((unit) => ({
    ...unit,
    displayName: unitTextMap.get(unit.dictionary) ?? unit.dictionary,
    shortDescription: unitTextMap.get(`${unit.dictionary}_descr_short`) ?? null,
    longDescription: unitTextMap.get(`${unit.dictionary}_descr`) ?? null,
  }));

  const ancillaries = parseAncillaries(ancillaryContent).map((entry) => ({
    id: entry.id,
    image: entry.Image ?? null,
    type: entry.Type ?? null,
    transferable: entry.Transferable ?? null,
    effects: entry.Effect ?? null,
    displayName: ancillaryTextMap.get(entry.id) ?? entry.id,
    description: ancillaryTextMap.get(`${entry.id}_desc`) ?? null,
    effectsDescription: ancillaryTextMap.get(`${entry.id}_effects_desc`) ?? null,
  }));

  const resources = parseResources(resourceContent);
  const unitModelsRoot = path.join(DATA_ROOT, "unit_models");
  const unitCardsRoot = path.join(DATA_ROOT, "ui", "units");
  const unitInfoRoot = path.join(DATA_ROOT, "ui", "unit_info");
  const portraitsRoot = path.join(DATA_ROOT, "ui", "custom_portraits");
  const animationsRoot = "D:/RPG_TG/map/yuan mo feng yun lu/data/animations";

  const [
    meshCount,
    textureCount,
    unitCardCount,
    unitInfoCount,
    portraitCount,
    animationCount,
    modelDirBreakdown,
  ] = await Promise.all([
    countFiles(unitModelsRoot, ".mesh"),
    countFiles(unitModelsRoot, ".texture"),
    countFiles(unitCardsRoot, ".tga"),
    countFiles(unitInfoRoot, ".tga"),
    countFiles(portraitsRoot, ".tga"),
    countFiles(animationsRoot, ".cas"),
    listTopLevelModelDirs(unitModelsRoot),
  ]);

  const unitAlignment = units.map((unit) => ({
    ...unit,
    alignment: classifyAlignment(unit),
  }));
  const redTurbanUnits = dedupeByType(unitAlignment.filter((unit) => unit.alignment === "red_turban"));
  const yuanUnits = dedupeByType(unitAlignment.filter((unit) => unit.alignment === "yuan"));

  const fullExport = {
    generatedAt: new Date().toISOString(),
    modRoot: MOD_ROOT,
    summary: {
      unitCount: units.length,
      ancillaryCount: ancillaries.length,
      resourceCount: resources.length,
      meshCount,
      textureCount,
      animationCount,
      unitCardCount,
      unitInfoCount,
      portraitCount,
    },
    modelDirectoryBreakdown: modelDirBreakdown,
    units,
    ancillaries,
    resources,
  };

  const rosterExport = {
    generatedAt: new Date().toISOString(),
    assumptions: {
      redTurbanFactions: Array.from(RED_TURBAN_FACTIONS),
      yuanFactions: Array.from(YUAN_FACTIONS),
      redTurbanKeywords: RED_TURBAN_KEYWORDS,
      yuanKeywords: YUAN_KEYWORDS,
      note: "先按 ownership 阵营归属，再用 type/dictionary/soldierModel 关键字补充归类。结果适合做原型分组，仍建议你后续人工复核边界单位。",
    },
    redTurbanFriendlyUnits: redTurbanUnits,
    yuanEnemyUnits: yuanUnits,
  };

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await Promise.all([
    fs.writeFile(
      path.join(OUTPUT_DIR, "yuanmo-mod-index.json"),
      `${JSON.stringify(fullExport, null, 2)}\n`,
      "utf8"
    ),
    fs.writeFile(
      path.join(OUTPUT_DIR, "yuanmo-red-turban-vs-yuan-rosters.json"),
      `${JSON.stringify(rosterExport, null, 2)}\n`,
      "utf8"
    ),
  ]);

  process.stdout.write(
    JSON.stringify(
      {
        indexFile: path.join(OUTPUT_DIR, "yuanmo-mod-index.json"),
        rosterFile: path.join(OUTPUT_DIR, "yuanmo-red-turban-vs-yuan-rosters.json"),
        redTurbanCount: redTurbanUnits.length,
        yuanCount: yuanUnits.length,
      },
      null,
      2
    )
  );
}

await main();
