import fs from "node:fs/promises";
import path from "node:path";

import TGA from "tga";
import { PNG } from "pngjs";

const REPOSITORY_ROOT = "D:/RPG_TG";
const MOD_ROOT = "D:/RPG_TG/map/yuan mo feng yun lu/mods/yuanmofengyunlu";
const MODEL_INDEX_PATH = "D:/RPG_TG/generated/yuanmo-strat-model-index.json";
const OUTPUT_DIR = "D:/RPG_TG/src/assets/yuanmo-units";

const TARGET_IDS = ["red-turban-strat", "yuan-infantry-strat"];

function decodeCString(buffer, offset, byteLength) {
  const stringBuffer = buffer.subarray(offset, offset + Math.max(byteLength - 1, 0));
  return stringBuffer.toString("latin1");
}

function readVector(buffer, offset) {
  return [
    buffer.readFloatLE(offset),
    buffer.readFloatLE(offset + 4),
    buffer.readFloatLE(offset + 8),
  ];
}

function rtwToModel(vector) {
  return [-vector[0], -vector[2], vector[1]];
}

function addVector(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function normalizeVector(vector) {
  const length =
    Math.hypot(vector[0], vector[1], vector[2]) ||
    1;
  return [vector[0] / length, vector[1] / length, vector[2] / length];
}

function computeGlobalBonePositions(bones) {
  const globalPositions = bones.map(() => [0, 0, 0]);
  for (let index = 0; index < bones.length; index += 1) {
    const bone = bones[index];
    if (bone == null) {
      continue;
    }

    if (bone.parentIndex == null) {
      globalPositions[index] = [...bone.localPosition];
      continue;
    }

    const parentPosition = globalPositions[bone.parentIndex] ?? [0, 0, 0];
    globalPositions[index] = addVector(parentPosition, bone.localPosition);
  }
  return globalPositions;
}

function parseBoneChunk(buffer) {
  const version = buffer.readFloatLE(0);
  let offset = 50;
  const boneCount = buffer.readUInt32LE(offset);
  offset += 4;
  if (version >= 3.05) {
    offset += 2;
  }

  const parentRefs = [];
  for (let index = 0; index < Math.max(boneCount - 1, 0); index += 1) {
    parentRefs.push(buffer.readUInt32LE(offset));
    offset += 4;
  }

  const frameCount = buffer.readUInt32LE(offset);
  offset += 4 + frameCount * 4;

  const bones = [];
  for (let index = 0; index < boneCount; index += 1) {
    const nameLength = buffer.readUInt32LE(offset);
    offset += 4;
    const name = decodeCString(buffer, offset, nameLength);
    offset += nameLength;

    const boneFrameCount = buffer.readUInt32LE(offset);
    const offsetStart = buffer.readUInt32LE(offset + 8);
    const offsetEnd = buffer.readUInt32LE(offset + 12);
    offset += 20;

    let extraLabel = "";
    if (version >= 3.16) {
      const extraLabelLength = buffer.readUInt32LE(offset);
      offset += 4;
      extraLabel = decodeCString(buffer, offset, extraLabelLength);
      offset += extraLabelLength;
    }

    bones.push({
      name,
      parentIndex: index === 0 ? null : (parentRefs[index - 1] ?? 0),
      frameCount: boneFrameCount,
      offsetStart,
      offsetEnd,
      extraLabel,
      localPosition: [0, 0, 0],
    });
  }

  for (let index = 1; index < boneCount; index += 1) {
    const animationVectorCount = bones[index]?.frameCount ?? 0;
    offset += animationVectorCount * 16;
  }

  const rootMotionFrameCount = boneCount > 1
    ? (bones[1]?.frameCount ?? 0)
    : (bones[0]?.frameCount ?? 0);
  offset += rootMotionFrameCount * 12;

  for (let index = 0; index < boneCount; index += 1) {
    const localPosition = rtwToModel(readVector(buffer, offset));
    offset += 12;
    const bone = bones[index];
    if (bone != null) {
      bone.localPosition = localPosition;
    }
  }

  return {
    bones,
    nextOffset: offset,
    version,
  };
}

function parseMeshChunk(buffer, version, chunkOffset, chunkType) {
  const offsetToNextChunk = buffer.readUInt32LE(chunkOffset);
  const storedChunkType = buffer.readUInt32LE(chunkOffset + 4);
  const meshCount = buffer.readUInt32LE(chunkOffset + 8);
  if (storedChunkType !== chunkType) {
    throw new Error(
      `Unexpected chunk type ${storedChunkType} at ${chunkOffset}, expected ${chunkType}.`
    );
  }

  let offset = chunkOffset + 12;
  const meshes = [];

  for (let meshIndex = 0; meshIndex < meshCount; meshIndex += 1) {
    const nameLength = buffer.readUInt32LE(offset);
    offset += 4;
    const name = decodeCString(buffer, offset, nameLength);
    offset += nameLength;

    let extraLabel = "";
    if (version >= 3.05 || chunkType === 1) {
      const extraLabelLength = buffer.readUInt32LE(offset);
      offset += 4;
      extraLabel = decodeCString(buffer, offset, extraLabelLength);
      offset += extraLabelLength;
    }

    let attachmentLabel = "";
    let attachedBoneIndex = null;
    if (chunkType === 1) {
      if (version >= 3.05) {
        const attachmentLabelLength = buffer.readUInt32LE(offset);
        offset += 4;
        attachmentLabel = decodeCString(buffer, offset, attachmentLabelLength);
        offset += attachmentLabelLength;
      }
      attachedBoneIndex = buffer.readUInt32LE(offset);
      offset += 4;
    }

    offset += 28;

    const vertexCount = buffer.readUInt16LE(offset);
    const faceCount = buffer.readUInt16LE(offset + 2);
    const hasUv = buffer[offset + 4] !== 0;
    const hasVertexColor = buffer[offset + 5] !== 0;
    offset += 6;

    let rigidBoneIndices = null;
    if (chunkType === 2) {
      rigidBoneIndices = new Array(vertexCount);
      for (let index = 0; index < vertexCount; index += 1) {
        rigidBoneIndices[index] = buffer.readUInt32LE(offset);
        offset += 4;
      }
    }

    const positions = new Array(vertexCount);
    for (let index = 0; index < vertexCount; index += 1) {
      positions[index] = rtwToModel(readVector(buffer, offset));
      offset += 12;
    }

    const normals = new Array(vertexCount);
    for (let index = 0; index < vertexCount; index += 1) {
      normals[index] = normalizeVector(rtwToModel(readVector(buffer, offset)));
      offset += 12;
    }

    const indices = new Array(faceCount * 3);
    for (let faceIndex = 0; faceIndex < faceCount; faceIndex += 1) {
      const fileIndexA = buffer.readUInt16LE(offset);
      const fileIndexB = buffer.readUInt16LE(offset + 2);
      const fileIndexC = buffer.readUInt16LE(offset + 4);
      offset += 6;

      const writeOffset = faceIndex * 3;
      indices[writeOffset] = fileIndexC;
      indices[writeOffset + 1] = fileIndexB;
      indices[writeOffset + 2] = fileIndexA;
    }

    const textureIndex = buffer.readInt32LE(offset);
    offset += 4;

    const uvs = new Array(vertexCount);
    if (hasUv) {
      for (let index = 0; index < vertexCount; index += 1) {
        const u = buffer.readFloatLE(offset);
        const storedV = buffer.readFloatLE(offset + 4);
        offset += 8;
        uvs[index] = [u, 1 - storedV];
      }
    } else {
      for (let index = 0; index < vertexCount; index += 1) {
        uvs[index] = [0, 0];
      }
    }

    const colors = new Array(vertexCount);
    if (hasVertexColor) {
      for (let index = 0; index < vertexCount; index += 1) {
        colors[index] = [
          (buffer[offset] ?? 255) / 255,
          (buffer[offset + 1] ?? 255) / 255,
          (buffer[offset + 2] ?? 255) / 255,
          (buffer[offset + 3] ?? 255) / 255,
        ];
        offset += 4;
      }
    } else {
      for (let index = 0; index < vertexCount; index += 1) {
        colors[index] = [1, 1, 1, 1];
      }
    }

    offset += version > 3.16 ? 4 : 1;

    meshes.push({
      name,
      extraLabel,
      attachmentLabel,
      chunkType,
      attachedBoneIndex,
      textureIndex,
      positions,
      normals,
      uvs,
      colors,
      rigidBoneIndices,
      indices,
    });
  }

  if (chunkType === 1) {
    offset += 6;
  }

  return {
    chunkOffset,
    offsetToNextChunk,
    meshes,
    nextOffset: offset,
  };
}

function mergeMeshes(parsedModel) {
  const globalBonePositions = computeGlobalBonePositions(parsedModel.bones);
  const positions = [];
  const normals = [];
  const uvs = [];
  const colors = [];
  const boneIndices = [];
  const indices = [];
  const meshes = [];

  let vertexBase = 0;
  const boundsMin = [Infinity, Infinity, Infinity];
  const boundsMax = [-Infinity, -Infinity, -Infinity];

  for (const mesh of parsedModel.meshes) {
    const indexStart = indices.length;
    for (let index = 0; index < mesh.positions.length; index += 1) {
      const localPosition = mesh.positions[index] ?? [0, 0, 0];
      const localNormal = mesh.normals[index] ?? [0, 0, 1];
      const uv = mesh.uvs[index] ?? [0, 0];
      const color = mesh.colors[index] ?? [1, 1, 1, 1];
      const boneIndex = mesh.chunkType === 1
        ? (mesh.attachedBoneIndex ?? 0)
        : (mesh.rigidBoneIndices?.[index] ?? 0);
      const bonePosition = globalBonePositions[boneIndex] ?? [0, 0, 0];
      const worldPosition = addVector(bonePosition, localPosition);

      positions.push(worldPosition[0], worldPosition[1], worldPosition[2]);
      normals.push(localNormal[0], localNormal[1], localNormal[2]);
      uvs.push(uv[0], uv[1]);
      colors.push(color[0], color[1], color[2], color[3]);
      boneIndices.push(boneIndex);

      boundsMin[0] = Math.min(boundsMin[0], worldPosition[0]);
      boundsMin[1] = Math.min(boundsMin[1], worldPosition[1]);
      boundsMin[2] = Math.min(boundsMin[2], worldPosition[2]);
      boundsMax[0] = Math.max(boundsMax[0], worldPosition[0]);
      boundsMax[1] = Math.max(boundsMax[1], worldPosition[1]);
      boundsMax[2] = Math.max(boundsMax[2], worldPosition[2]);
    }

    for (const index of mesh.indices) {
      indices.push(index + vertexBase);
    }

    meshes.push({
      name: mesh.name,
      chunkType: mesh.chunkType,
      vertexStart: vertexBase,
      vertexCount: mesh.positions.length,
      indexStart,
      indexCount: mesh.indices.length,
    });
    vertexBase += mesh.positions.length;
  }

  const origin = [
    (boundsMin[0] + boundsMax[0]) / 2,
    (boundsMin[1] + boundsMax[1]) / 2,
    boundsMin[2],
  ];

  for (let index = 0; index < positions.length; index += 3) {
    positions[index] -= origin[0];
    positions[index + 1] -= origin[1];
    positions[index + 2] -= origin[2];
  }

  return {
    origin,
    bounds: {
      min: [boundsMin[0] - origin[0], boundsMin[1] - origin[1], boundsMin[2] - origin[2]],
      max: [boundsMax[0] - origin[0], boundsMax[1] - origin[1], boundsMax[2] - origin[2]],
    },
    meshes,
    positions,
    normals,
    uvs,
    colors,
    boneIndices,
    indices,
  };
}

function parseCasModel(buffer) {
  const { bones, nextOffset, version } = parseBoneChunk(buffer);
  const firstChunk = parseMeshChunk(buffer, version, nextOffset, 1);
  const secondChunk = parseMeshChunk(buffer, version, firstChunk.nextOffset, 2);
  return {
    version,
    bones,
    meshes: [...firstChunk.meshes, ...secondChunk.meshes],
  };
}

async function writePngFromTga(inputPath, outputPath) {
  const inputBuffer = await fs.readFile(inputPath);
  const tga = new TGA(inputBuffer);
  const png = new PNG({
    width: tga.width,
    height: tga.height,
  });
  png.data = Buffer.from(tga.pixels);
  await fs.writeFile(outputPath, PNG.sync.write(png));
  return {
    width: tga.width,
    height: tga.height,
  };
}

async function buildTargetAsset(target, dataRoot) {
  const modelRelativePath = String(target.modelFlexi ?? "").replace(/,+$/, "").trim();
  const textureRelativePath =
    String(target.textures?.[0]?.texturePath ?? "").replace(/,+$/, "").trim();
  if (modelRelativePath === "" || textureRelativePath === "") {
    throw new Error(`Target ${target.id} is missing model or texture metadata.`);
  }

  const modelPath = path.join(dataRoot, modelRelativePath);
  const texturePath = path.join(dataRoot, textureRelativePath);
  const fileStem = target.id;

  const outputModelPath = path.join(OUTPUT_DIR, `${fileStem}.json`);
  const outputTexturePath = path.join(OUTPUT_DIR, `${fileStem}.png`);

  const modelBuffer = await fs.readFile(modelPath);
  const parsedModel = parseCasModel(modelBuffer);
  const mergedModel = mergeMeshes(parsedModel);
  const textureInfo = await writePngFromTga(texturePath, outputTexturePath);

  const exportPayload = {
    id: target.id,
    label: target.label,
    role: target.role,
    scale: target.scale ?? 1,
    source: {
      modelPath: path.relative(REPOSITORY_ROOT, modelPath).replace(/\\/g, "/"),
      texturePath: path.relative(REPOSITORY_ROOT, texturePath).replace(/\\/g, "/"),
    },
    textureFile: `${fileStem}.png`,
    textureSize: textureInfo,
    bones: parsedModel.bones.map((bone) => ({
      name: bone.name,
      parentIndex: bone.parentIndex,
      localPosition: bone.localPosition,
    })),
    origin: mergedModel.origin,
    bounds: mergedModel.bounds,
    meshes: mergedModel.meshes,
    positions: mergedModel.positions,
    normals: mergedModel.normals,
    uvs: mergedModel.uvs,
    colors: mergedModel.colors,
    boneIndices: mergedModel.boneIndices,
    indices: mergedModel.indices,
  };

  await fs.writeFile(outputModelPath, `${JSON.stringify(exportPayload, null, 2)}\n`, "utf8");

  return {
    id: target.id,
    modelFile: path.basename(outputModelPath),
    textureFile: path.basename(outputTexturePath),
    vertexCount: mergedModel.positions.length / 3,
    triangleCount: mergedModel.indices.length / 3,
    boneCount: parsedModel.bones.length,
  };
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const modelIndex = JSON.parse(await fs.readFile(MODEL_INDEX_PATH, "utf8"));
  const targetsById = new Map(
    (modelIndex.targets ?? []).map((target) => [target.id, target])
  );
  const dataRoot = path.join(MOD_ROOT, "data");
  const results = [];

  for (const targetId of TARGET_IDS) {
    const target = targetsById.get(targetId);
    if (target == null) {
      throw new Error(`Missing target "${targetId}" in ${MODEL_INDEX_PATH}.`);
    }
    results.push(await buildTargetAsset(target, dataRoot));
  }

  const manifestPath = path.join(OUTPUT_DIR, "manifest.json");
  await fs.writeFile(
    manifestPath,
    `${JSON.stringify({ generatedAt: new Date().toISOString(), targets: results }, null, 2)}\n`,
    "utf8"
  );

  console.log(JSON.stringify(results, null, 2));
}

await main();
