import fs from "node:fs/promises";
import path from "node:path";

const MOD_ROOT = "D:/RPG_TG/map/yuan mo feng yun lu/mods/yuanmofengyunlu";
const DATA_ROOT = path.join(MOD_ROOT, "data");
const MODEL_STRAT_FILE = path.join(DATA_ROOT, "descr_model_strat.txt");
const OUTPUT_FILE = "D:/RPG_TG/generated/yuanmo-strat-model-index.json";

function splitWhitespace(value) {
  return value.trim().split(/\s+/).filter(Boolean);
}

function normalizeAssetPath(value) {
  return value.replace(/\\/g, "/").replace(/,+$/g, "").trim().toLowerCase();
}

function parseModelStrat(content) {
  const lines = content.split(/\r?\n/);
  const entries = [];
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line === "" || line.startsWith(";")) {
      continue;
    }

    const [key, ...rest] = splitWhitespace(line);
    const value = rest.join(" ").trim();
    if (key === "type") {
      if (current != null) {
        entries.push(current);
      }
      current = {
        type: value,
        skeleton: null,
        scale: null,
        textures: [],
        modelFlexi: null,
        shadowModel: null,
      };
      continue;
    }

    if (current == null) {
      continue;
    }

    if (key === "skeleton") {
      current.skeleton = value;
      continue;
    }

    if (key === "scale") {
      current.scale = Number(value);
      continue;
    }

    if (key === "texture") {
      const [faction, texturePath] = rest;
      if (faction != null && texturePath != null) {
        current.textures.push({
          faction,
          texturePath: texturePath.replace(/,+$/g, "").trim(),
        });
      }
      continue;
    }

    if (key === "model_flexi_m" || key === "model_flexi" || key === "model_flexi_c") {
      current.modelFlexi = rest[0] ?? null;
      continue;
    }

    if (key === "shadow_model_flexi") {
      current.shadowModel = rest[0] ?? null;
    }
  }

  if (current != null) {
    entries.push(current);
  }

  return entries;
}

function pickTargets(entries) {
  const targetProfiles = [
    {
      id: "red-turban-strat",
      label: "Red Turban campaign actor",
      role: "friendly",
      match: (entry) =>
        entry.type === "shun_captain" ||
        normalizeAssetPath(entry.modelFlexi ?? "").endsWith("/shun_captain.cas"),
    },
    {
      id: "yuan-infantry-strat",
      label: "Yuan infantry campaign actor",
      role: "enemy",
      match: (entry) =>
        entry.type === "menggu_general" ||
        normalizeAssetPath(entry.modelFlexi ?? "").endsWith("/mongol_infantry.cas"),
    },
    {
      id: "yuan-general-strat",
      label: "Yuan general campaign actor",
      role: "enemy",
      match: (entry) =>
        entry.type === "manzhou_general" ||
        normalizeAssetPath(entry.modelFlexi ?? "").endsWith("/dayuanjiangjun.cas"),
    },
    {
      id: "ming-captain-strat",
      label: "Ming captain reference actor",
      role: "reference",
      match: (entry) =>
        entry.type === "ming_captain" ||
        normalizeAssetPath(entry.modelFlexi ?? "").endsWith("/daming_shibing.cas"),
    },
  ];

  return targetProfiles
    .map((profile) => {
      const entry = entries.find(profile.match) ?? null;
      if (entry == null) {
        return null;
      }

      return {
        ...profile,
        type: entry.type,
        skeleton: entry.skeleton,
        scale: entry.scale,
        modelFlexi: entry.modelFlexi,
        shadowModel: entry.shadowModel,
        textures: entry.textures,
      };
    })
    .filter(Boolean);
}

async function main() {
  const content = await fs.readFile(MODEL_STRAT_FILE, "utf8");
  const entries = parseModelStrat(content);
  const targets = pickTargets(entries);

  const exportData = {
    generatedAt: new Date().toISOString(),
    modelStratFile: MODEL_STRAT_FILE,
    totalEntries: entries.length,
    targets,
    nextStep: "Convert target modelFlexi CAS files and faction texture variants into GLB/GLTF assets for browser-side 3D campaign actors.",
  };

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, `${JSON.stringify(exportData, null, 2)}\n`, "utf8");
  process.stdout.write(JSON.stringify({ outputFile: OUTPUT_FILE, targetCount: targets.length }, null, 2));
}

await main();
