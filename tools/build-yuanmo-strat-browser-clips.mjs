import fs from "node:fs/promises";
import path from "node:path";

const REPOSITORY_ROOT = "D:/RPG_TG";
const SOURCE_MANIFEST_PATH = "D:/RPG_TG/generated/yuanmo-strat-animation-export/manifest.json";
const SOURCE_MODEL_PATH = "D:/RPG_TG/src/assets/yuanmo-units/red-turban-strat.json";
const OUTPUT_ROOT = "D:/RPG_TG/src/assets/yuanmo-unit-animations/strat_named_with_army";

const TARGET_CLIPS = [
  {
    animationId: "stand_a_idle",
    outputFileName: "stand_a_idle.json",
  },
  {
    animationId: "walk",
    outputFileName: "walk.json",
  },
];

function rtwToModel(vector) {
  return [-vector[0], -vector[2], vector[1]];
}

function normalizeQuaternion(input) {
  const length = Math.hypot(input[0], input[1], input[2], input[3]) || 1;
  return [
    input[0] / length,
    input[1] / length,
    input[2] / length,
    input[3] / length,
  ];
}

function parsePackedAnimationChunk(buffer, animatedBoneNames) {
  const numFrames = buffer.readUInt16LE(0);
  const numAnimatedBones = buffer.readUInt16LE(2);
  const flags = buffer.readUInt8(4);
  let offset = 5;

  const rotations = new Array(numFrames);
  for (let frameIndex = 0; frameIndex < numFrames; frameIndex += 1) {
    const frameRotations = new Array(numAnimatedBones);
    for (let boneIndex = 0; boneIndex < numAnimatedBones; boneIndex += 1) {
      const storedX = buffer.readFloatLE(offset);
      const storedY = buffer.readFloatLE(offset + 4);
      const storedZ = buffer.readFloatLE(offset + 8);
      const storedW = buffer.readFloatLE(offset + 12);
      offset += 16;

      frameRotations[boneIndex] = normalizeQuaternion([
        storedX,
        storedZ,
        -storedY,
        storedW,
      ]);
    }
    rotations[frameIndex] = frameRotations;
  }

  const pelvisPositions = new Array(numFrames);
  for (let frameIndex = 0; frameIndex < numFrames; frameIndex += 1) {
    pelvisPositions[frameIndex] = rtwToModel([
      buffer.readFloatLE(offset),
      buffer.readFloatLE(offset + 4),
      buffer.readFloatLE(offset + 8),
    ]);
    offset += 12;
  }

  const transitVectorCount = Math.floor((numFrames - 1) / 2);
  const transitionVectors = new Array(transitVectorCount);
  for (let index = 0; index < transitVectorCount; index += 1) {
    transitionVectors[index] = rtwToModel([
      buffer.readFloatLE(offset),
      buffer.readFloatLE(offset + 4),
      buffer.readFloatLE(offset + 8),
    ]);
    offset += 12;
  }

  const transitionScalarPadding = new Array(transitVectorCount);
  for (let index = 0; index < transitVectorCount; index += 1) {
    transitionScalarPadding[index] = buffer.readFloatLE(offset);
    offset += 4;
  }

  const rootPositions = new Array(numFrames);
  for (let frameIndex = 0; frameIndex < numFrames; frameIndex += 1) {
    rootPositions[frameIndex] = rtwToModel([
      buffer.readFloatLE(offset),
      buffer.readFloatLE(offset + 4),
      buffer.readFloatLE(offset + 8),
    ]);
    offset += 12;
  }

  const tailByteLength = Math.max(buffer.length - offset, 0);

  return {
    format: "yuanmo-packed-strat-animation-v1",
    fps: 20,
    numFrames,
    numAnimatedBones,
    flags,
    animatedBoneNames: animatedBoneNames.slice(0, numAnimatedBones),
    rotations,
    pelvisPositions,
    transitionVectors,
    transitionScalarPadding,
    rootPositions,
    tailByteLength,
  };
}

async function main() {
  await fs.mkdir(OUTPUT_ROOT, { recursive: true });

  const [manifestContent, modelContent] = await Promise.all([
    fs.readFile(SOURCE_MANIFEST_PATH, "utf8"),
    fs.readFile(SOURCE_MODEL_PATH, "utf8"),
  ]);

  const manifest = JSON.parse(manifestContent);
  const model = JSON.parse(modelContent);
  const skeleton = manifest.skeletons?.find((entry) => entry.type === "strat_named_with_army");
  if (skeleton == null) {
    throw new Error("Missing strat_named_with_army skeleton export.");
  }

  const animatedBoneNames = (model.bones ?? []).slice(1).map((bone) => String(bone.name ?? ""));
  const outputs = [];

  for (const targetClip of TARGET_CLIPS) {
    const clip = skeleton.clips.find((entry) => entry.animationId === targetClip.animationId);
    if (clip == null || typeof clip.outputPath !== "string") {
      throw new Error(`Missing exported clip for animationId "${targetClip.animationId}".`);
    }

    const clipBuffer = await fs.readFile(clip.outputPath);
    const parsedClip = parsePackedAnimationChunk(clipBuffer, animatedBoneNames);
    const outputPath = path.join(OUTPUT_ROOT, targetClip.outputFileName);
    await fs.writeFile(outputPath, `${JSON.stringify(parsedClip, null, 2)}\n`, "utf8");
    outputs.push({
      animationId: targetClip.animationId,
      outputPath,
      outputRelativePath: path.relative(REPOSITORY_ROOT, outputPath).replace(/\\/g, "/"),
      frameCount: parsedClip.numFrames,
      animatedBoneCount: parsedClip.numAnimatedBones,
    });
  }

  const manifestOutputPath = path.join(OUTPUT_ROOT, "manifest.json");
  await fs.writeFile(
    manifestOutputPath,
    `${JSON.stringify({
      generatedAt: new Date().toISOString(),
      sourceManifestPath: SOURCE_MANIFEST_PATH,
      skeletonType: "strat_named_with_army",
      outputs,
    }, null, 2)}\n`,
    "utf8"
  );

  process.stdout.write(`${JSON.stringify({
    outputRoot: OUTPUT_ROOT,
    clipCount: outputs.length,
    outputs,
  }, null, 2)}\n`);
}

await main();
