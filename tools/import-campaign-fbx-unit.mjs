/* global console, process */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const FBX_SECONDS_UNIT = 46186158000;
const DEFAULT_FPS = 24;

const args = parseArgs(process.argv.slice(2));
const sourcePath = requireArg(args, "source");
const texturePath = requireArg(args, "texture");
const outputDirectory = requireArg(args, "out-dir");
const animationDirectory = requireArg(args, "animation-dir");
const id = requireArg(args, "id");
const label = args.label ?? id;
const role = args.role ?? "friendly";
const scale = readNumberArg(args.scale, 1);
const facingOffsetDegrees = readNumberArg(args.facingOffsetDegrees, 0);
const posturePitchDegrees = readNumberArg(args.posturePitchDegrees, 0);
const fps = readNumberArg(args.fps, DEFAULT_FPS);
const idleStackName = args.idleStack ?? "NlaTrack.001";
const walkStackName = args.walkStack ?? "NlaTrack.002";
const walkRootMotionMode = args.walkRootMotionMode ?? "preserve";
const walkRootMotionAnchor = args.walkRootMotionAnchor ?? "start";
const walkLoopMode = args.walkLoopMode ?? "preserve";
const walkLoopBlendFrames = Math.max(Math.round(readNumberArg(args.walkLoopBlendFrames, 8)), 1);
const walkFrameStart = Math.max(Math.round(readNumberArg(args.walkFrameStart, 0)), 0);
const walkFrameEnd =
  args.walkFrameEnd == null
    ? null
    : Math.max(Math.round(readNumberArg(args.walkFrameEnd, 0)), 0);
const textureExtension = path.extname(texturePath).toLowerCase() || ".jpg";
const textureFileName = `${id}${textureExtension}`;
const modelFileName = `${id}.json`;
const idleFileName = "look_around.json";
const walkFileName = "run.json";

if (!Number.isFinite(scale) || scale <= 0) {
  throw new Error(`Invalid scale "${args.scale}".`);
}

if (!Number.isFinite(fps) || fps <= 0) {
  throw new Error(`Invalid fps "${args.fps}".`);
}

if (!["preserve", "in-place-horizontal"].includes(walkRootMotionMode)) {
  throw new Error(`Invalid --walkRootMotionMode "${walkRootMotionMode}".`);
}

if (!["start", "end"].includes(walkRootMotionAnchor)) {
  throw new Error(`Invalid --walkRootMotionAnchor "${walkRootMotionAnchor}".`);
}

if (!["preserve", "blend-tail"].includes(walkLoopMode)) {
  throw new Error(`Invalid --walkLoopMode "${walkLoopMode}".`);
}

if (walkFrameEnd != null && walkFrameEnd < walkFrameStart) {
  throw new Error("--walkFrameEnd must be greater than or equal to --walkFrameStart.");
}

const fbx = parseBinaryFbx(fs.readFileSync(sourcePath));
const exported = exportCampaignActorFromFbx(fbx, {
  facingOffsetDegrees,
  fps,
  id,
  idleStackName,
  label,
  role,
  scale,
  sourcePath,
  posturePitchDegrees,
  textureFileName,
  walkFrameEnd,
  walkFrameStart,
  walkLoopBlendFrames,
  walkLoopMode,
  walkRootMotionAnchor,
  walkRootMotionMode,
  walkStackName,
});

fs.mkdirSync(outputDirectory, { recursive: true });
fs.mkdirSync(animationDirectory, { recursive: true });
fs.copyFileSync(texturePath, path.join(outputDirectory, textureFileName));
fs.writeFileSync(
  path.join(outputDirectory, modelFileName),
  `${JSON.stringify(exported.model)}\n`,
  "utf8"
);
fs.writeFileSync(
  path.join(animationDirectory, idleFileName),
  `${JSON.stringify(exported.idleAnimation)}\n`,
  "utf8"
);
fs.writeFileSync(
  path.join(animationDirectory, walkFileName),
  `${JSON.stringify(exported.walkAnimation)}\n`,
  "utf8"
);

console.log(JSON.stringify({
  id,
  modelFile: modelFileName,
  textureFile: textureFileName,
  idleAnimationFile: idleFileName,
  walkAnimationFile: walkFileName,
  idleSourceStack: exported.idleAnimation.sourceStack,
  walkSourceStack: exported.walkAnimation.sourceStack,
  walkFrameStart: exported.walkAnimation.sourceFrameStart,
  walkFrameEnd: exported.walkAnimation.sourceFrameEnd,
  walkLoopMode: exported.walkAnimation.loopMode,
  walkLoopBlendFrames: exported.walkAnimation.loopBlendFrames,
  walkRootMotionMode: exported.walkAnimation.rootMotionMode,
  walkRootMotionAnchor: exported.walkAnimation.rootMotionAnchor,
  vertexCount: exported.model.positions.length / 3,
  triangleCount: exported.model.indices.length / 3,
  boneCount: exported.model.bones.length,
  idleFrames: exported.idleAnimation.numFrames,
  walkFrames: exported.walkAnimation.numFrames,
  bounds: exported.model.bounds,
}, null, 2));

function parseArgs(tokens) {
  const output = {};
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token?.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const value = tokens[index + 1];
    if (value == null || value.startsWith("--")) {
      output[key] = "true";
      continue;
    }

    output[key] = value;
    index += 1;
  }
  return output;
}

function requireArg(source, key) {
  const value = source[key];
  if (value == null || value === "") {
    throw new Error(`Missing --${key}.`);
  }
  return value;
}

function readNumberArg(value, fallback) {
  if (value == null || value === "") {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseBinaryFbx(buffer) {
  const header = buffer.subarray(0, 21).toString("latin1");
  if (!header.startsWith("Kaydara FBX Binary")) {
    throw new Error("Only binary FBX files are supported.");
  }

  const version = buffer.readUInt32LE(23);
  const uses64BitOffsets = version >= 7500;
  let offset = 27;

  const readOffset = () => {
    const value = uses64BitOffsets
      ? Number(buffer.readBigUInt64LE(offset))
      : buffer.readUInt32LE(offset);
    offset += uses64BitOffsets ? 8 : 4;
    return value;
  };

  const readArray = (type) => {
    const length = buffer.readUInt32LE(offset);
    const encoding = buffer.readUInt32LE(offset + 4);
    const compressedLength = buffer.readUInt32LE(offset + 8);
    offset += 12;
    let arrayBytes = buffer.subarray(offset, offset + compressedLength);
    offset += compressedLength;
    if (encoding === 1) {
      arrayBytes = zlib.inflateSync(arrayBytes);
    }

    const result = new Array(length);
    if (type === "d") {
      for (let index = 0; index < length; index += 1) {
        result[index] = arrayBytes.readDoubleLE(index * 8);
      }
      return result;
    }
    if (type === "f") {
      for (let index = 0; index < length; index += 1) {
        result[index] = arrayBytes.readFloatLE(index * 4);
      }
      return result;
    }
    if (type === "i") {
      for (let index = 0; index < length; index += 1) {
        result[index] = arrayBytes.readInt32LE(index * 4);
      }
      return result;
    }
    if (type === "l") {
      for (let index = 0; index < length; index += 1) {
        result[index] = Number(arrayBytes.readBigInt64LE(index * 8));
      }
      return result;
    }
    if (type === "b") {
      for (let index = 0; index < length; index += 1) {
        result[index] = arrayBytes[index] ?? 0;
      }
      return result;
    }
    throw new Error(`Unsupported FBX array type "${type}".`);
  };

  const readProperty = () => {
    const type = String.fromCharCode(buffer[offset]);
    offset += 1;
    if (type === "C") {
      const value = buffer[offset] !== 0;
      offset += 1;
      return value;
    }
    if (type === "Y") {
      const value = buffer.readInt16LE(offset);
      offset += 2;
      return value;
    }
    if (type === "I") {
      const value = buffer.readInt32LE(offset);
      offset += 4;
      return value;
    }
    if (type === "F") {
      const value = buffer.readFloatLE(offset);
      offset += 4;
      return value;
    }
    if (type === "D") {
      const value = buffer.readDoubleLE(offset);
      offset += 8;
      return value;
    }
    if (type === "L") {
      const value = Number(buffer.readBigInt64LE(offset));
      offset += 8;
      return value;
    }
    if (type === "S" || type === "R") {
      const length = buffer.readUInt32LE(offset);
      offset += 4;
      const value = buffer.subarray(offset, offset + length);
      offset += length;
      return type === "S" ? value.toString("utf8") : value;
    }
    if (["f", "d", "l", "i", "b"].includes(type)) {
      return readArray(type);
    }
    throw new Error(`Unsupported FBX property type "${type}".`);
  };

  const readNode = () => {
    const endOffset = readOffset();
    const propertyCount = readOffset();
    readOffset();
    const nameLength = buffer[offset] ?? 0;
    offset += 1;
    if (endOffset === 0 && propertyCount === 0 && nameLength === 0) {
      return null;
    }

    const name = buffer.subarray(offset, offset + nameLength).toString("utf8");
    offset += nameLength;
    const properties = [];
    for (let index = 0; index < propertyCount; index += 1) {
      properties.push(readProperty());
    }

    const children = [];
    while (offset < endOffset) {
      const child = readNode();
      if (child == null) {
        break;
      }
      children.push(child);
    }

    if (offset !== endOffset) {
      offset = endOffset;
    }
    return { name, properties, children };
  };

  const roots = [];
  while (offset < buffer.length) {
    const node = readNode();
    if (node == null) {
      break;
    }
    roots.push(node);
  }

  return { roots, version };
}

function exportCampaignActorFromFbx(fbx, options) {
  const objects = getRequiredRoot(fbx, "Objects");
  const connections = getRequiredRoot(fbx, "Connections");
  const nodesById = new Map();
  for (const node of objects.children) {
    nodesById.set(node.properties[0], node);
  }

  const childIdsByParent = new Map();
  const parentIdsByChild = new Map();
  const propertyConnections = [];
  for (const connection of connections.children) {
    const [kind, childId, parentId, propertyName] = connection.properties;
    if (kind === "OO") {
      pushMapValue(childIdsByParent, parentId, childId);
      pushMapValue(parentIdsByChild, childId, parentId);
      continue;
    }
    if (kind === "OP") {
      propertyConnections.push({ childId, parentId, propertyName });
    }
  }

  const modelNodes = getNodesByType(objects, "Model");
  const boneSourceNodes = modelNodes.filter((node) => node.properties[2] === "LimbNode");
  const boneIds = buildBoneOrder(boneSourceNodes, childIdsByParent, nodesById);
  const boneIndexByModelId = new Map();
  const bones = [{
    name: "Scene Root",
    parentIndex: null,
    localPosition: [0, 0, 0],
    localRotation: [0, 0, 0, 1],
  }];

  for (const boneId of boneIds) {
    boneIndexByModelId.set(boneId, bones.length);
    const node = nodesById.get(boneId);
    const parentBoneId = (parentIdsByChild.get(boneId) ?? []).find((parentId) =>
      boneIds.includes(parentId)
    );
    const localTranslation = readModelVectorProperty(node, "Lcl Translation", [0, 0, 0]);
    const localRotation = readModelVectorProperty(node, "Lcl Rotation", [0, 0, 0]);
    bones.push({
      name: cleanName(node.properties[1]),
      parentIndex: parentBoneId == null ? 0 : boneIndexByModelId.get(parentBoneId) ?? 0,
      localPosition: convertFbxVector(localTranslation),
      localRotation: convertFbxEulerToProjectQuaternion(localRotation),
    });
  }
  const boneBindMatrices = bones.map(() => createIdentityMatrix4());

  const geometryNodes = getNodesByType(objects, "Geometry");
  const modelPositions = [];
  const modelNormals = [];
  const modelUvs = [];
  const modelBoneIndices = [];
  const modelBoneInfluenceIndices = [];
  const modelBoneInfluenceWeights = [];
  const modelIndices = [];
  const meshes = [];
  const vertexByKey = new Map();

  for (const geometryNode of geometryNodes) {
    const geometryId = geometryNode.properties[0];
    const meshModelId = (childIdsByParent.get(0) ?? []).find((modelId) => {
      const parents = parentIdsByChild.get(geometryId) ?? [];
      return parents.includes(modelId);
    }) ?? (parentIdsByChild.get(geometryId) ?? []).find((id) =>
      nodesById.get(id)?.name === "Model"
    );
    const meshModel = nodesById.get(meshModelId);
    const meshTransform = readMeshTransform(meshModel);
    const skinId = (childIdsByParent.get(geometryId) ?? []).find((id) =>
      nodesById.get(id)?.name === "Deformer" &&
      nodesById.get(id)?.properties[2] === "Skin"
    );
    const controlPointBoneWeights = readControlPointBoneWeights(
      skinId,
      childIdsByParent,
      parentIdsByChild,
      nodesById,
      boneIndexByModelId,
      boneBindMatrices
    );
    const exportedGeometry = readGeometry(geometryNode, {
      controlPointBoneWeights,
      modelBoneInfluenceIndices,
      modelBoneInfluenceWeights,
      meshTransform,
      modelBoneIndices,
      modelIndices,
      modelNormals,
      modelPositions,
      modelUvs,
      vertexByKey,
    });
    meshes.push({
      name: cleanName(geometryNode.properties[1]),
      vertexBase: exportedGeometry.vertexBase,
      vertexCount: exportedGeometry.vertexCount,
      indexBase: exportedGeometry.indexBase,
      indexCount: exportedGeometry.indexCount,
      boneName: "skinned",
    });
  }

  if (modelPositions.length / 3 > 65535) {
    throw new Error("Campaign actor renderer currently requires <= 65535 vertices.");
  }

  const bounds = computeBounds(modelPositions);
  const origin = [
    (bounds.min[0] + bounds.max[0]) * 0.5,
    (bounds.min[1] + bounds.max[1]) * 0.5,
    bounds.min[2],
  ];
  for (let index = 0; index < modelPositions.length; index += 3) {
    modelPositions[index] -= origin[0];
    modelPositions[index + 1] -= origin[1];
    modelPositions[index + 2] -= origin[2];
  }
  const inverseBindMatrices = boneBindMatrices
    .map((matrix) => invertMatrix4(translateMatrix4(matrix, -origin[0], -origin[1], -origin[2])))
    .flat();
  for (const bone of bones) {
    if (bone.parentIndex === null) {
      continue;
    }
    bone.localPosition = [
      bone.localPosition[0],
      bone.localPosition[1],
      bone.localPosition[2],
    ];
  }

  const centeredBounds = computeBounds(modelPositions);
  const animationContext = {
    boneIds,
    boneIndexByModelId,
    bones,
    childIdsByParent,
    fps: options.fps,
    nodesById,
    propertyConnections,
  };
  const idleAnimation = exportAnimationClip(animationContext, options.idleStackName, "look_around", {
    rootMotionMode: "preserve",
  });
  const walkAnimation = exportAnimationClip(animationContext, options.walkStackName, "run", {
    frameEnd: options.walkFrameEnd,
    frameStart: options.walkFrameStart,
    loopBlendFrames: options.walkLoopBlendFrames,
    loopMode: options.walkLoopMode,
    rootMotionAnchor: options.walkRootMotionAnchor,
    rootMotionMode: options.walkRootMotionMode,
  });

  return {
    model: {
      id: options.id,
      label: options.label,
      role: options.role,
      scale: options.scale,
      facingOffsetDegrees: options.facingOffsetDegrees,
      posturePitchDegrees: options.posturePitchDegrees,
      source: {
        kind: "fbx",
        path: options.sourcePath,
      },
      textureFile: options.textureFileName,
      bones,
      origin,
      bounds: centeredBounds,
      meshes,
      positions: modelPositions,
      normals: modelNormals,
      uvs: modelUvs,
      boneIndices: modelBoneIndices,
      boneInfluenceIndices: modelBoneInfluenceIndices,
      boneInfluenceWeights: modelBoneInfluenceWeights,
      inverseBindMatrices,
      indices: modelIndices,
    },
    idleAnimation,
    walkAnimation,
  };
}

function getRequiredRoot(fbx, name) {
  const node = fbx.roots.find((root) => root.name === name);
  if (node == null) {
    throw new Error(`FBX is missing required root node "${name}".`);
  }
  return node;
}

function getNodesByType(objects, name) {
  return objects.children.filter((node) => node.name === name);
}

function pushMapValue(map, key, value) {
  if (!map.has(key)) {
    map.set(key, []);
  }
  map.get(key).push(value);
}

function cleanName(value) {
  return String(value ?? "").split("\u0000")[0];
}

function buildBoneOrder(boneNodes, childIdsByParent, nodesById) {
  const boneIdSet = new Set(boneNodes.map((node) => node.properties[0]));
  const rootIds = boneNodes
    .map((node) => node.properties[0])
    .filter((id) => {
      const parents = [...childIdsByParent.entries()]
        .filter(([, childIds]) => childIds.includes(id))
        .map(([parentId]) => parentId);
      return parents.every((parentId) => !boneIdSet.has(parentId));
    });
  const ordered = [];
  const visit = (id) => {
    if (!boneIdSet.has(id) || ordered.includes(id)) {
      return;
    }
    ordered.push(id);
    for (const childId of childIdsByParent.get(id) ?? []) {
      if (nodesById.get(childId)?.name === "Model") {
        visit(childId);
      }
    }
  };
  for (const id of rootIds) {
    visit(id);
  }
  for (const node of boneNodes) {
    visit(node.properties[0]);
  }
  return ordered;
}

function readModelVectorProperty(node, propertyName, fallback) {
  const property = node?.children
    .find((child) => child.name === "Properties70")
    ?.children.find((child) => child.name === "P" && child.properties[0] === propertyName);
  if (property == null) {
    return fallback;
  }
  return [
    Number(property.properties[4] ?? fallback[0]),
    Number(property.properties[5] ?? fallback[1]),
    Number(property.properties[6] ?? fallback[2]),
  ];
}

function readMeshTransform(node) {
  return {
    translation: convertFbxVector(readModelVectorProperty(node, "Lcl Translation", [0, 0, 0])),
    rotation: convertFbxRotationMatrix(readModelVectorProperty(node, "Lcl Rotation", [0, 0, 0])),
    scale: readModelVectorProperty(node, "Lcl Scaling", [1, 1, 1]),
  };
}

function readControlPointBoneWeights(
  skinId,
  childIdsByParent,
  parentIdsByChild,
  nodesById,
  boneIndexByModelId,
  boneBindMatrices
) {
  const weightsByControlPoint = new Map();
  for (const clusterId of childIdsByParent.get(skinId) ?? []) {
    const cluster = nodesById.get(clusterId);
    if (cluster?.properties[2] !== "Cluster") {
      continue;
    }
    const boneModelId = [
      ...(parentIdsByChild.get(clusterId) ?? []),
      ...(childIdsByParent.get(clusterId) ?? []),
    ].find((id) => nodesById.get(id)?.name === "Model" && boneIndexByModelId.has(id));
    const boneIndex = boneIndexByModelId.get(boneModelId) ?? 0;
    const transformLink =
      cluster.children.find((child) => child.name === "TransformLink")?.properties[0] ?? null;
    if (transformLink != null && transformLink.length >= 16) {
      boneBindMatrices[boneIndex] = convertFbxMatrix4(transformLink);
    }
    const indices = cluster.children.find((child) => child.name === "Indexes")?.properties[0] ?? [];
    const weights = cluster.children.find((child) => child.name === "Weights")?.properties[0] ?? [];
    for (let index = 0; index < indices.length; index += 1) {
      const controlPointIndex = indices[index] ?? 0;
      const weight = weights[index] ?? 0;
      if (weight <= 0) {
        continue;
      }
      const current = weightsByControlPoint.get(controlPointIndex) ?? [];
      current.push({ boneIndex, weight });
      weightsByControlPoint.set(controlPointIndex, current);
    }
  }

  for (const [controlPointIndex, weights] of weightsByControlPoint) {
    const sorted = weights
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 4);
    const total = sorted.reduce((sum, item) => sum + item.weight, 0) || 1;
    weightsByControlPoint.set(
      controlPointIndex,
      sorted.map((item) => ({
        boneIndex: item.boneIndex,
        weight: item.weight / total,
      }))
    );
  }

  return weightsByControlPoint;
}

function readGeometry(geometryNode, target) {
  const rawVertices = geometryNode.children.find((child) => child.name === "Vertices")?.properties[0] ?? [];
  const polygonVertexIndices =
    geometryNode.children.find((child) => child.name === "PolygonVertexIndex")?.properties[0] ?? [];
  const normalLayer = geometryNode.children.find((child) => child.name === "LayerElementNormal");
  const uvLayer = geometryNode.children.find((child) => child.name === "LayerElementUV");
  const normals = normalLayer?.children.find((child) => child.name === "Normals")?.properties[0] ?? [];
  const normalIndices = normalLayer?.children.find((child) => child.name === "NormalsIndex")?.properties[0] ?? [];
  const uvs = uvLayer?.children.find((child) => child.name === "UV")?.properties[0] ?? [];
  const uvIndices = uvLayer?.children.find((child) => child.name === "UVIndex")?.properties[0] ?? [];
  const vertexBase = target.modelPositions.length / 3;
  const indexBase = target.modelIndices.length;
  const face = [];
  let polygonVertexCursor = 0;

  const flushFace = () => {
    for (let index = 1; index < face.length - 1; index += 1) {
      const triangle = [face[0], face[index], face[index + 1]];
      for (const vertex of triangle) {
        const key = [
          geometryNode.properties[0],
          vertex.controlPointIndex,
          vertex.polygonVertexIndex,
          vertex.normalIndex,
          vertex.uvIndex,
        ].join("/");
        let exportedVertexIndex = target.vertexByKey.get(key);
        if (exportedVertexIndex == null) {
          exportedVertexIndex = target.modelPositions.length / 3;
          target.vertexByKey.set(key, exportedVertexIndex);
          const position = readVector3(rawVertices, vertex.controlPointIndex);
          const transformedPosition = transformPoint(convertFbxVector(position), target.meshTransform);
          const normal = readVector3(normals, vertex.normalIndex);
          const transformedNormal = transformDirection(convertFbxVector(normal), target.meshTransform);
          const uv = readVector2(uvs, vertex.uvIndex);
          const boneWeights =
            target.controlPointBoneWeights.get(vertex.controlPointIndex) ?? [];
          const paddedWeights = [
            boneWeights[0] ?? { boneIndex: 0, weight: 1 },
            boneWeights[1] ?? { boneIndex: 0, weight: 0 },
            boneWeights[2] ?? { boneIndex: 0, weight: 0 },
            boneWeights[3] ?? { boneIndex: 0, weight: 0 },
          ];
          const boneIndex = paddedWeights[0].boneIndex;
          target.modelPositions.push(...transformedPosition);
          target.modelNormals.push(...normalizeVector(transformedNormal));
          target.modelUvs.push(uv[0], 1 - uv[1]);
          target.modelBoneIndices.push(boneIndex);
          for (const influence of paddedWeights) {
            target.modelBoneInfluenceIndices.push(influence.boneIndex);
            target.modelBoneInfluenceWeights.push(influence.weight);
          }
        }
        target.modelIndices.push(exportedVertexIndex);
      }
    }
    face.length = 0;
  };

  for (const rawIndex of polygonVertexIndices) {
    const isEnd = rawIndex < 0;
    const controlPointIndex = isEnd ? -rawIndex - 1 : rawIndex;
    const normalIndex = normalIndices[polygonVertexCursor] ?? controlPointIndex;
    const uvIndex = uvIndices[polygonVertexCursor] ?? controlPointIndex;
    face.push({
      controlPointIndex,
      normalIndex,
      polygonVertexIndex: polygonVertexCursor,
      uvIndex,
    });
    polygonVertexCursor += 1;
    if (isEnd) {
      flushFace();
    }
  }

  return {
    vertexBase,
    vertexCount: target.modelPositions.length / 3 - vertexBase,
    indexBase,
    indexCount: target.modelIndices.length - indexBase,
  };
}

function readVector3(values, index) {
  const offset = index * 3;
  return [
    Number(values[offset] ?? 0),
    Number(values[offset + 1] ?? 0),
    Number(values[offset + 2] ?? 0),
  ];
}

function readVector2(values, index) {
  const offset = index * 2;
  return [
    Number(values[offset] ?? 0),
    Number(values[offset + 1] ?? 0),
  ];
}

function convertFbxVector(vector) {
  return [vector[0] ?? 0, vector[2] ?? 0, vector[1] ?? 0];
}

function transformPoint(point, transform) {
  const scaled = [
    point[0] * (transform.scale[0] ?? 1),
    point[1] * (transform.scale[2] ?? 1),
    point[2] * (transform.scale[1] ?? 1),
  ];
  const rotated = multiplyMatrixVector(transform.rotation, scaled);
  return [
    rotated[0] + transform.translation[0],
    rotated[1] + transform.translation[1],
    rotated[2] + transform.translation[2],
  ];
}

function transformDirection(direction, transform) {
  return multiplyMatrixVector(transform.rotation, direction);
}

function exportAnimationClip(context, stackName, animationId, options = {}) {
  const stack = [...context.nodesById.values()].find((node) =>
    node.name === "AnimationStack" &&
    cleanName(node.properties[1]) === stackName
  );
  if (stack == null) {
    throw new Error(`FBX animation stack "${stackName}" was not found.`);
  }

  const layer = (context.childIdsByParent.get(stack.properties[0]) ?? [])
    .map((id) => context.nodesById.get(id))
    .find((node) => node?.name === "AnimationLayer");
  if (layer == null) {
    throw new Error(`FBX animation stack "${stackName}" has no animation layer.`);
  }

  const curveNodes = (context.childIdsByParent.get(layer.properties[0]) ?? [])
    .map((id) => context.nodesById.get(id))
    .filter((node) => node?.name === "AnimationCurveNode");
  const rotationCurvesByModelId = new Map();
  const translationCurvesByModelId = new Map();
  let startTime = Number.POSITIVE_INFINITY;
  let endTime = Number.NEGATIVE_INFINITY;

  for (const curveNode of curveNodes) {
    const modelConnection = context.propertyConnections.find((connection) =>
      connection.childId === curveNode.properties[0] &&
      (connection.propertyName === "Lcl Rotation" ||
        connection.propertyName === "Lcl Translation")
    );
    if (modelConnection == null || !context.boneIndexByModelId.has(modelConnection.parentId)) {
      continue;
    }

    const curves = {};
    for (const curveConnection of context.propertyConnections.filter((connection) =>
      connection.parentId === curveNode.properties[0]
    )) {
      const curve = context.nodesById.get(curveConnection.childId);
      if (curve?.name !== "AnimationCurve") {
        continue;
      }
      const axis = String(curveConnection.propertyName ?? "").slice(-1);
      if (!["X", "Y", "Z"].includes(axis)) {
        continue;
      }
      const keyTimes = curve.children.find((child) => child.name === "KeyTime")?.properties[0] ?? [];
      const values = curve.children.find((child) => child.name === "KeyValueFloat")?.properties[0] ?? [];
      if (keyTimes.length > 0) {
        startTime = Math.min(startTime, keyTimes[0]);
        endTime = Math.max(endTime, keyTimes[keyTimes.length - 1]);
      }
      curves[axis] = { keyTimes, values };
    }
    if (modelConnection.propertyName === "Lcl Rotation") {
      rotationCurvesByModelId.set(modelConnection.parentId, curves);
    } else {
      translationCurvesByModelId.set(modelConnection.parentId, curves);
    }
  }

  if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || endTime <= startTime) {
    startTime = 0;
    endTime = FBX_SECONDS_UNIT;
  }

  const durationSeconds = Math.max((endTime - startTime) / FBX_SECONDS_UNIT, 1 / context.fps);
  const numFrames = Math.max(Math.round(durationSeconds * context.fps) + 1, 2);
  const rotations = [];
  const localPositions = [];
  const rootPositions = [];
  const pelvisPositions = [];

  for (let frameIndex = 0; frameIndex < numFrames; frameIndex += 1) {
    const time =
      startTime +
      (endTime - startTime) * (numFrames === 1 ? 0 : frameIndex / (numFrames - 1));
    const frameRotations = [];
    const framePositions = [];
    for (let boneIndex = 1; boneIndex < context.bones.length; boneIndex += 1) {
      const boneName = context.bones[boneIndex].name;
      const modelId = context.boneIds.find((id) =>
        context.boneIndexByModelId.get(id) === boneIndex
      );
      const model = context.nodesById.get(modelId);
      const baseRotation = readModelVectorProperty(model, "Lcl Rotation", [0, 0, 0]);
      const baseTranslation = readModelVectorProperty(model, "Lcl Translation", [0, 0, 0]);
      const rotationCurves = rotationCurvesByModelId.get(modelId);
      const translationCurves = translationCurvesByModelId.get(modelId);
      const euler = [
        evaluateCurve(rotationCurves?.X, time, baseRotation[0]),
        evaluateCurve(rotationCurves?.Y, time, baseRotation[1]),
        evaluateCurve(rotationCurves?.Z, time, baseRotation[2]),
      ];
      const translation = [
        evaluateCurve(translationCurves?.X, time, baseTranslation[0]),
        evaluateCurve(translationCurves?.Y, time, baseTranslation[1]),
        evaluateCurve(translationCurves?.Z, time, baseTranslation[2]),
      ];
      frameRotations.push(convertFbxEulerToProjectQuaternion(euler));
      framePositions.push(convertFbxVector(translation));
      if (boneName === "Pelvis") {
        pelvisPositions.push([0, 0, 0]);
      }
    }
    rotations.push(frameRotations);
    localPositions.push(framePositions);
    rootPositions.push([0, 0, 0]);
    if (pelvisPositions.length < frameIndex + 1) {
      pelvisPositions.push([0, 0, 0]);
    }
  }

  const appliedRootMotion = applyRootMotionMode(
    localPositions,
    context.bones.slice(1).map((bone) => bone.name),
    options.rootMotionMode ?? "preserve",
    options.rootMotionAnchor ?? "start"
  );
  const appliedFrameRange = applyAnimationFrameRange(
    rotations,
    localPositions,
    rootPositions,
    pelvisPositions,
    options.frameStart ?? 0,
    options.frameEnd
  );
  const appliedLoop = applyAnimationLoopMode(
    rotations,
    localPositions,
    options.loopMode ?? "preserve",
    options.loopBlendFrames ?? 8
  );

  return {
    format: "tripo-fbx-campaign-animation-v1",
    animationId,
    sourceStack: stackName,
    sourceFrameStart: appliedFrameRange.start,
    sourceFrameEnd: appliedFrameRange.end,
    rootMotionMode: appliedRootMotion.mode,
    rootMotionAnchor: appliedRootMotion.anchor,
    loopMode: appliedLoop.mode,
    loopBlendFrames: appliedLoop.blendFrames,
    fps: context.fps,
    numFrames: rotations.length,
    numAnimatedBones: context.bones.length - 1,
    animatedBoneNames: context.bones.slice(1).map((bone) => bone.name),
    rotations,
    localPositions,
    rootPositions,
    pelvisPositions,
  };
}

function applyRootMotionMode(
  localPositions,
  animatedBoneNames,
  rootMotionMode,
  rootMotionAnchor
) {
  if (rootMotionMode !== "in-place-horizontal") {
    return {
      mode: "preserve",
      anchor: "none",
    };
  }

  const rootMotionBoneIndex = findRootMotionBoneIndex(animatedBoneNames);
  const anchorFrameIndex = rootMotionAnchor === "end" ? localPositions.length - 1 : 0;
  const anchorRootPosition = localPositions[anchorFrameIndex]?.[rootMotionBoneIndex];
  if (rootMotionBoneIndex < 0 || anchorRootPosition == null) {
    return {
      mode: "preserve",
      anchor: "none",
    };
  }

  for (const framePositions of localPositions) {
    const rootPosition = framePositions[rootMotionBoneIndex];
    if (rootPosition == null) {
      continue;
    }

    rootPosition[0] = anchorRootPosition[0] ?? 0;
    rootPosition[1] = anchorRootPosition[1] ?? 0;
  }

  return {
    mode: rootMotionMode,
    anchor: rootMotionAnchor,
  };
}

function applyAnimationFrameRange(
  rotations,
  localPositions,
  rootPositions,
  pelvisPositions,
  requestedStart,
  requestedEnd
) {
  const frameCount = rotations.length;
  const start = Math.min(Math.max(Math.round(requestedStart), 0), Math.max(frameCount - 1, 0));
  const end = Math.min(
    Math.max(Math.round(requestedEnd ?? frameCount - 1), start),
    Math.max(frameCount - 1, 0)
  );
  if (start === 0 && end === frameCount - 1) {
    return {
      start,
      end,
    };
  }

  const deleteCount = end - start + 1;
  rotations.splice(0, rotations.length, ...rotations.slice(start, end + 1));
  localPositions.splice(0, localPositions.length, ...localPositions.slice(start, end + 1));
  rootPositions.splice(0, rootPositions.length, ...rootPositions.slice(start, end + 1));
  pelvisPositions.splice(0, pelvisPositions.length, ...pelvisPositions.slice(start, end + 1));

  if (rotations.length !== deleteCount) {
    throw new Error("Failed to crop animation frame range.");
  }

  return {
    start,
    end,
  };
}

function applyAnimationLoopMode(rotations, localPositions, loopMode, requestedBlendFrames) {
  if (loopMode !== "blend-tail") {
    return {
      mode: "preserve",
      blendFrames: 0,
    };
  }

  const frameCount = rotations.length;
  if (frameCount < 3) {
    return {
      mode: "preserve",
      blendFrames: 0,
    };
  }

  const blendFrames = Math.min(Math.max(Math.round(requestedBlendFrames), 1), frameCount - 1);
  const firstRotations = rotations[0];
  const firstPositions = localPositions[0];
  const blendStartIndex = frameCount - blendFrames;

  for (let frameIndex = blendStartIndex; frameIndex < frameCount; frameIndex += 1) {
    const amount = smoothstep((frameIndex - blendStartIndex + 1) / blendFrames);
    const frameRotations = rotations[frameIndex];
    const framePositions = localPositions[frameIndex];

    for (let boneIndex = 0; boneIndex < frameRotations.length; boneIndex += 1) {
      frameRotations[boneIndex] = nlerpQuaternion(
        frameRotations[boneIndex],
        firstRotations[boneIndex] ?? frameRotations[boneIndex],
        amount
      );
      framePositions[boneIndex] = lerpVector3(
        framePositions[boneIndex],
        firstPositions[boneIndex] ?? framePositions[boneIndex],
        amount
      );
    }
  }

  return {
    mode: loopMode,
    blendFrames,
  };
}

function findRootMotionBoneIndex(animatedBoneNames) {
  const candidateNames = ["Root", "Hips", "Pelvis", "mixamorig:Hips"];
  for (const candidateName of candidateNames) {
    const index = animatedBoneNames.indexOf(candidateName);
    if (index >= 0) {
      return index;
    }
  }

  return -1;
}

function smoothstep(value) {
  const clampedValue = Math.min(Math.max(value, 0), 1);
  return clampedValue * clampedValue * (3 - 2 * clampedValue);
}

function lerpVector3(from, to, amount) {
  return [
    (from[0] ?? 0) + ((to[0] ?? 0) - (from[0] ?? 0)) * amount,
    (from[1] ?? 0) + ((to[1] ?? 0) - (from[1] ?? 0)) * amount,
    (from[2] ?? 0) + ((to[2] ?? 0) - (from[2] ?? 0)) * amount,
  ];
}

function nlerpQuaternion(from, to, amount) {
  const dot =
    (from[0] ?? 0) * (to[0] ?? 0) +
    (from[1] ?? 0) * (to[1] ?? 0) +
    (from[2] ?? 0) * (to[2] ?? 0) +
    (from[3] ?? 1) * (to[3] ?? 1);
  const sign = dot < 0 ? -1 : 1;
  return normalizeQuaternion([
    (from[0] ?? 0) + ((to[0] ?? 0) * sign - (from[0] ?? 0)) * amount,
    (from[1] ?? 0) + ((to[1] ?? 0) * sign - (from[1] ?? 0)) * amount,
    (from[2] ?? 0) + ((to[2] ?? 0) * sign - (from[2] ?? 0)) * amount,
    (from[3] ?? 1) + ((to[3] ?? 1) * sign - (from[3] ?? 1)) * amount,
  ]);
}

function evaluateCurve(curve, time, fallback) {
  if (curve == null || curve.keyTimes.length === 0) {
    return fallback;
  }
  const { keyTimes, values } = curve;
  if (time <= keyTimes[0]) {
    return values[0] ?? fallback;
  }
  for (let index = 1; index < keyTimes.length; index += 1) {
    const nextTime = keyTimes[index];
    if (time <= nextTime) {
      const previousTime = keyTimes[index - 1] ?? nextTime;
      const amount = (time - previousTime) / Math.max(nextTime - previousTime, 1);
      const from = values[index - 1] ?? fallback;
      const to = values[index] ?? from;
      return from + (to - from) * amount;
    }
  }
  return values[values.length - 1] ?? fallback;
}

function convertFbxEulerToProjectQuaternion(eulerDegrees) {
  const fbxRotation = createEulerXyzMatrix(eulerDegrees.map((value) => value * Math.PI / 180));
  return quaternionFromMatrix(convertFbxRotationMatrixFromMatrix(fbxRotation));
}

function convertFbxRotationMatrix(eulerDegrees) {
  return convertFbxRotationMatrixFromMatrix(
    createEulerXyzMatrix(eulerDegrees.map((value) => value * Math.PI / 180))
  );
}

function convertFbxRotationMatrixFromMatrix(matrix) {
  const conversion = [
    1, 0, 0,
    0, 0, 1,
    0, 1, 0,
  ];
  return multiplyMatrices(multiplyMatrices(conversion, matrix), conversion);
}

function convertFbxMatrix4(values) {
  const source = new Array(16).fill(0).map((_, index) => Number(values[index] ?? 0));
  const conversion = [
    1, 0, 0, 0,
    0, 0, 1, 0,
    0, 1, 0, 0,
    0, 0, 0, 1,
  ];
  return multiplyMatrix4(multiplyMatrix4(conversion, source), conversion);
}

function createIdentityMatrix4() {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ];
}

function translateMatrix4(matrix, x, y, z) {
  const translated = matrix.slice();
  translated[12] = (translated[12] ?? 0) + x;
  translated[13] = (translated[13] ?? 0) + y;
  translated[14] = (translated[14] ?? 0) + z;
  return translated;
}

function multiplyMatrix4(a, b) {
  const result = new Array(16).fill(0);
  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      result[column * 4 + row] =
        (a[row] ?? 0) * (b[column * 4] ?? 0) +
        (a[4 + row] ?? 0) * (b[column * 4 + 1] ?? 0) +
        (a[8 + row] ?? 0) * (b[column * 4 + 2] ?? 0) +
        (a[12 + row] ?? 0) * (b[column * 4 + 3] ?? 0);
    }
  }
  return result;
}

function invertMatrix4(matrix) {
  const m = matrix;
  const inv = [];
  inv[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] +
    m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
  inv[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] -
    m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
  inv[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] +
    m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
  inv[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] -
    m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
  inv[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] -
    m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
  inv[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] +
    m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
  inv[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] -
    m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
  inv[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] +
    m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
  inv[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] +
    m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
  inv[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] -
    m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
  inv[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] +
    m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
  inv[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] -
    m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
  inv[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] -
    m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
  inv[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] +
    m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
  inv[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] -
    m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
  inv[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] +
    m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];
  const determinant = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];
  if (Math.abs(determinant) <= 0.0000001) {
    return createIdentityMatrix4();
  }
  return inv.map((value) => value / determinant);
}

function createEulerXyzMatrix([x, y, z]) {
  const cx = Math.cos(x);
  const sx = Math.sin(x);
  const cy = Math.cos(y);
  const sy = Math.sin(y);
  const cz = Math.cos(z);
  const sz = Math.sin(z);
  const rx = [
    1, 0, 0,
    0, cx, -sx,
    0, sx, cx,
  ];
  const ry = [
    cy, 0, sy,
    0, 1, 0,
    -sy, 0, cy,
  ];
  const rz = [
    cz, -sz, 0,
    sz, cz, 0,
    0, 0, 1,
  ];
  return multiplyMatrices(multiplyMatrices(rz, ry), rx);
}

function multiplyMatrices(a, b) {
  const result = new Array(9).fill(0);
  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 3; column += 1) {
      result[row * 3 + column] =
        a[row * 3] * b[column] +
        a[row * 3 + 1] * b[3 + column] +
        a[row * 3 + 2] * b[6 + column];
    }
  }
  return result;
}

function multiplyMatrixVector(matrix, vector) {
  return [
    matrix[0] * vector[0] + matrix[1] * vector[1] + matrix[2] * vector[2],
    matrix[3] * vector[0] + matrix[4] * vector[1] + matrix[5] * vector[2],
    matrix[6] * vector[0] + matrix[7] * vector[1] + matrix[8] * vector[2],
  ];
}

function quaternionFromMatrix(matrix) {
  const m00 = matrix[0];
  const m01 = matrix[1];
  const m02 = matrix[2];
  const m10 = matrix[3];
  const m11 = matrix[4];
  const m12 = matrix[5];
  const m20 = matrix[6];
  const m21 = matrix[7];
  const m22 = matrix[8];
  const trace = m00 + m11 + m22;
  let x;
  let y;
  let z;
  let w;
  if (trace > 0) {
    const scale = Math.sqrt(trace + 1) * 2;
    w = 0.25 * scale;
    x = (m21 - m12) / scale;
    y = (m02 - m20) / scale;
    z = (m10 - m01) / scale;
  } else if (m00 > m11 && m00 > m22) {
    const scale = Math.sqrt(1 + m00 - m11 - m22) * 2;
    w = (m21 - m12) / scale;
    x = 0.25 * scale;
    y = (m01 + m10) / scale;
    z = (m02 + m20) / scale;
  } else if (m11 > m22) {
    const scale = Math.sqrt(1 + m11 - m00 - m22) * 2;
    w = (m02 - m20) / scale;
    x = (m01 + m10) / scale;
    y = 0.25 * scale;
    z = (m12 + m21) / scale;
  } else {
    const scale = Math.sqrt(1 + m22 - m00 - m11) * 2;
    w = (m10 - m01) / scale;
    x = (m02 + m20) / scale;
    y = (m12 + m21) / scale;
    z = 0.25 * scale;
  }
  return normalizeQuaternion([x, y, z, w]);
}

function normalizeQuaternion(quaternion) {
  const length = Math.hypot(quaternion[0], quaternion[1], quaternion[2], quaternion[3]);
  if (length <= 0.000001) {
    return [0, 0, 0, 1];
  }
  return [
    quaternion[0] / length,
    quaternion[1] / length,
    quaternion[2] / length,
    quaternion[3] / length,
  ];
}

function normalizeVector(vector) {
  const length = Math.hypot(vector[0], vector[1], vector[2]);
  if (length <= 0.000001) {
    return [0, 0, 1];
  }
  return [vector[0] / length, vector[1] / length, vector[2] / length];
}

function computeBounds(positions) {
  const min = [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY];
  const max = [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY];
  for (let index = 0; index < positions.length; index += 3) {
    for (let axis = 0; axis < 3; axis += 1) {
      const value = positions[index + axis] ?? 0;
      min[axis] = Math.min(min[axis], value);
      max[axis] = Math.max(max[axis], value);
    }
  }
  return { min, max };
}
