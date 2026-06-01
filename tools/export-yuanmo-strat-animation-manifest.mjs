import fs from "node:fs/promises";
import path from "node:path";

const REPOSITORY_ROOT = "D:/RPG_TG";
const GAME_ROOT = "D:/RPG_TG/map/yuan mo feng yun lu";
const MOD_ROOT = "D:/RPG_TG/map/yuan mo feng yun lu/mods/yuanmofengyunlu";
const MODEL_INDEX_PATH = "D:/RPG_TG/generated/yuanmo-strat-model-index.json";
const DESCR_SKELETON_PATH = "D:/RPG_TG/map/yuan mo feng yun lu/mods/yuanmofengyunlu/data/descr_skeleton.txt";
const PACK_INDEX_PATH = "D:/RPG_TG/map/yuan mo feng yun lu/mods/yuanmofengyunlu/data/animations/pack.idx";
const PACK_DATA_PATH = "D:/RPG_TG/map/yuan mo feng yun lu/mods/yuanmofengyunlu/data/animations/pack.dat";
const OUTPUT_ROOT = "D:/RPG_TG/generated/yuanmo-strat-animation-export";
const OUTPUT_CLIPS_ROOT = path.join(OUTPUT_ROOT, "clips");
const OUTPUT_MANIFEST_PATH = path.join(OUTPUT_ROOT, "manifest.json");

function splitWhitespace(value) {
  return value.trim().split(/\s+/).filter(Boolean);
}

function normalizeSlashes(value) {
  return value.replace(/\\/g, "/");
}

function normalizeAnimationPath(value) {
  const normalized = normalizeSlashes(value).replace(/,+$/g, "").trim().toLowerCase();
  const dataAnimationsIndex = normalized.indexOf("data/animations/");
  if (dataAnimationsIndex >= 0) {
    return normalized.slice(dataAnimationsIndex);
  }
  const animationsIndex = normalized.indexOf("animations/");
  if (animationsIndex >= 0) {
    return `data/${normalized.slice(animationsIndex)}`;
  }
  return normalized;
}

function parseAnimFlags(tokens) {
  return tokens.map((token) => {
    if (!token.startsWith("-")) {
      return {
        raw: token,
        kind: "unknown",
        value: null,
      };
    }

    const separatorIndex = token.indexOf(":");
    if (separatorIndex < 0) {
      return {
        raw: token,
        kind: token.slice(1),
        value: true,
      };
    }

    return {
      raw: token,
      kind: token.slice(1, separatorIndex),
      value: token.slice(separatorIndex + 1),
    };
  });
}

function parseDescrSkeleton(content) {
  const skeletons = [];
  let current = null;

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line === "" || line.startsWith(";")) {
      continue;
    }

    const parts = splitWhitespace(line);
    const [key, ...rest] = parts;
    if (key === "type") {
      if (current != null) {
        skeletons.push(current);
      }
      current = {
        type: rest.join(" ").trim(),
        scale: null,
        clips: [],
      };
      continue;
    }

    if (current == null) {
      continue;
    }

    if (key === "scale") {
      current.scale = Number(rest[0] ?? "");
      continue;
    }

    if (key === "anim") {
      const [animationId, sourcePath, ...flagTokens] = rest;
      if (animationId == null || sourcePath == null) {
        continue;
      }

      current.clips.push({
        animationId,
        sourcePath: sourcePath.replace(/,+$/g, "").trim(),
        normalizedSourcePath: normalizeAnimationPath(sourcePath),
        flags: parseAnimFlags(flagTokens),
      });
    }
  }

  if (current != null) {
    skeletons.push(current);
  }

  return skeletons;
}

function collectTargetSkeletons(modelIndex) {
  const targets = Array.isArray(modelIndex.targets) ? modelIndex.targets : [];
  const targetSkeletons = new Map();

  for (const target of targets) {
    if (typeof target?.skeleton !== "string" || target.skeleton === "") {
      continue;
    }

    const existing = targetSkeletons.get(target.skeleton);
    if (existing == null) {
      targetSkeletons.set(target.skeleton, {
        actorIds: [String(target.id ?? "")],
        actorRoles: [String(target.role ?? "unknown")],
      });
      continue;
    }

    existing.actorIds.push(String(target.id ?? ""));
    existing.actorRoles.push(String(target.role ?? "unknown"));
  }

  return targetSkeletons;
}

function parsePackIndexEntries(buffer) {
  const text = buffer.toString("latin1");
  const pathPattern = /mods\/[^\0]+/g;
  const entries = [];
  const seenPathStarts = new Set();

  let match = pathPattern.exec(text);
  while (match != null) {
    const rawPath = match[0] ?? "";
    const pathStart = match.index;
    if (!seenPathStarts.has(pathStart)) {
      seenPathStarts.add(pathStart);
      const pathEnd = pathStart + rawPath.length;
      if (buffer[pathEnd] === 0 && pathEnd + 17 <= buffer.length) {
        const recordSize = buffer.readUInt32LE(pathEnd + 1);
        const dataOffset = buffer.readUInt32LE(pathEnd + 5);
        const dataSize = buffer.readUInt32LE(pathEnd + 9);
        const scale = buffer.readFloatLE(pathEnd + 13);
        entries.push({
          rawPath,
          normalizedPath: normalizeAnimationPath(rawPath),
          pathStart,
          recordSize,
          dataOffset,
          dataSize,
          scale,
        });
      }
    }
    match = pathPattern.exec(text);
  }

  return entries;
}

async function fileExists(candidatePath) {
  try {
    await fs.access(candidatePath);
    return true;
  } catch {
    return false;
  }
}

async function resolveLooseClipPath(sourcePath) {
  const normalizedSourcePath = normalizeSlashes(sourcePath);
  const candidates = [
    path.join(MOD_ROOT, normalizedSourcePath),
    path.join(GAME_ROOT, normalizedSourcePath),
  ];

  for (const candidatePath of candidates) {
    if (await fileExists(candidatePath)) {
      return candidatePath;
    }
  }

  return null;
}

function buildPackEntryMap(entries) {
  const byNormalizedPath = new Map();
  for (const entry of entries) {
    const existing = byNormalizedPath.get(entry.normalizedPath);
    if (existing == null) {
      byNormalizedPath.set(entry.normalizedPath, entry);
    }
  }
  return byNormalizedPath;
}

async function ensureOutputDirectory(directoryPath) {
  await fs.mkdir(directoryPath, { recursive: true });
}

async function writeClipFromPack(input) {
  const {
    packDataHandle,
    packEntry,
    outputPath,
  } = input;
  const clipBuffer = Buffer.alloc(packEntry.dataSize);
  await packDataHandle.read(clipBuffer, 0, packEntry.dataSize, packEntry.dataOffset);
  await fs.writeFile(outputPath, clipBuffer);
  return clipBuffer;
}

function isLikelyCasBuffer(buffer) {
  if (buffer.length < 4) {
    return false;
  }
  const version = buffer.readFloatLE(0);
  return Number.isFinite(version) && version >= 2 && version <= 5;
}

async function exportSkeletonClips(input) {
  const {
    skeleton,
    packEntriesByPath,
    packDataHandle,
  } = input;
  const skeletonOutputRoot = path.join(OUTPUT_CLIPS_ROOT, skeleton.type);
  await ensureOutputDirectory(skeletonOutputRoot);

  const clipResults = [];
  for (const clip of skeleton.clips) {
    const loosePath = await resolveLooseClipPath(clip.sourcePath);
    const outputFileName = path.basename(clip.sourcePath);
    const outputPath = path.join(skeletonOutputRoot, outputFileName);

    if (loosePath != null) {
      const fileBuffer = await fs.readFile(loosePath);
      await fs.writeFile(outputPath, fileBuffer);
      clipResults.push({
        ...clip,
        resolvedStorage: "loose",
        formatKind: "original_cas",
        resolvedSourcePath: loosePath,
        outputPath,
        outputRelativePath: normalizeSlashes(path.relative(REPOSITORY_ROOT, outputPath)),
        byteLength: fileBuffer.length,
        looksLikeCas: isLikelyCasBuffer(fileBuffer),
      });
      continue;
    }

    const packEntry = packEntriesByPath.get(clip.normalizedSourcePath) ?? null;
    if (packEntry == null) {
      clipResults.push({
        ...clip,
        resolvedStorage: "missing",
        formatKind: "missing",
        resolvedSourcePath: null,
        outputPath: null,
        outputRelativePath: null,
        byteLength: 0,
        looksLikeCas: false,
      });
      continue;
    }

    const clipBuffer = await writeClipFromPack({
      packDataHandle,
      packEntry,
      outputPath,
    });

    clipResults.push({
      ...clip,
      resolvedStorage: "pack",
      formatKind: "packed_animation_chunk",
      resolvedSourcePath: packEntry.rawPath,
      outputPath,
      outputRelativePath: normalizeSlashes(path.relative(REPOSITORY_ROOT, outputPath)),
      byteLength: clipBuffer.length,
      looksLikeCas: isLikelyCasBuffer(clipBuffer),
      packEntry: {
        recordSize: packEntry.recordSize,
        dataOffset: packEntry.dataOffset,
        dataSize: packEntry.dataSize,
        scale: packEntry.scale,
      },
    });
  }

  return clipResults;
}

async function main() {
  await ensureOutputDirectory(OUTPUT_ROOT);

  const [modelIndexContent, descrSkeletonContent, packIndexBuffer] = await Promise.all([
    fs.readFile(MODEL_INDEX_PATH, "utf8"),
    fs.readFile(DESCR_SKELETON_PATH, "utf8"),
    fs.readFile(PACK_INDEX_PATH),
  ]);

  const modelIndex = JSON.parse(modelIndexContent);
  const targetSkeletons = collectTargetSkeletons(modelIndex);
  const allSkeletons = parseDescrSkeleton(descrSkeletonContent);
  const selectedSkeletons = allSkeletons.filter((skeleton) => targetSkeletons.has(skeleton.type));
  const packEntries = parsePackIndexEntries(packIndexBuffer);
  const packEntriesByPath = buildPackEntryMap(packEntries);
  const packDataHandle = await fs.open(PACK_DATA_PATH, "r");

  try {
    const exportedSkeletons = [];
    for (const skeleton of selectedSkeletons) {
      const targetInfo = targetSkeletons.get(skeleton.type) ?? {
        actorIds: [],
        actorRoles: [],
      };
      const clips = await exportSkeletonClips({
        skeleton,
        packEntriesByPath,
        packDataHandle,
      });
      exportedSkeletons.push({
        type: skeleton.type,
        scale: skeleton.scale,
        actorIds: targetInfo.actorIds,
        actorRoles: targetInfo.actorRoles,
        clipCount: clips.length,
        clips,
      });
    }

    const unresolvedClips = exportedSkeletons.flatMap((skeleton) =>
      skeleton.clips
        .filter((clip) => clip.resolvedStorage === "missing")
        .map((clip) => ({
          skeletonType: skeleton.type,
          animationId: clip.animationId,
          sourcePath: clip.sourcePath,
        }))
    );

    const exportManifest = {
      generatedAt: new Date().toISOString(),
      modelIndexPath: MODEL_INDEX_PATH,
      descrSkeletonPath: DESCR_SKELETON_PATH,
      packIndexPath: PACK_INDEX_PATH,
      packDataPath: PACK_DATA_PATH,
      selectedSkeletonTypes: selectedSkeletons.map((skeleton) => skeleton.type),
      packIndexEntryCount: packEntries.length,
      unresolvedClipCount: unresolvedClips.length,
      requiresCasConversion: exportedSkeletons.some((skeleton) =>
        skeleton.clips.some((clip) => clip.formatKind === "packed_animation_chunk")
      ),
      unresolvedClips,
      skeletons: exportedSkeletons,
    };

    await fs.writeFile(OUTPUT_MANIFEST_PATH, `${JSON.stringify(exportManifest, null, 2)}\n`, "utf8");

    process.stdout.write(
      `${JSON.stringify({
        outputManifestPath: OUTPUT_MANIFEST_PATH,
        skeletonCount: exportedSkeletons.length,
        unresolvedClipCount: unresolvedClips.length,
      }, null, 2)}\n`
    );
  } finally {
    await packDataHandle.close();
  }
}

await main();
