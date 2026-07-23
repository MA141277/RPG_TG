/* global console, process */

import fs from "node:fs";
import path from "node:path";

const DEFAULT_SOURCE_DIRECTORY =
  "C:/Users/13568/Documents/Codex/2026-07-22/ni/outputs/part_02_left_middle_wall_large_hex_bent_subdiv_centered_tight_corner_large_battlements_uv_fixed";
const DEFAULT_OUTPUT_DIRECTORY =
  "src/content/scenario-packs/zhuyuanzhang/assets/map-nodes/fort-wall";
const DEFAULT_SOURCE_NAME = "part_02_left_middle_wall_large_hex_bent_subdiv_centered_tight_corner_large_battlements_uv_fixed";
const OUTPUT_NAME = "fort-hex-wall";
const HEX_TERRAIN_SCALE = 138;
const HEX_MAP_ASPECT = 1.1285;
const FORT_WALL_FIT_INNER_HEX_RADIUS = 1.0;
const FORT_WALL_UNIFORM_SCALE = 1.0;
const FORT_WALL_ROTATION_DEGREES = 30;
const FORT_WALL_OFFSET_X = 0;
const FORT_WALL_OFFSET_Y = -0.0015;

const args = parseArgs(process.argv.slice(2));
const projectRoot = path.resolve(args.projectRoot ?? process.cwd());
const sourceDirectory = path.resolve(args.sourceDir ?? DEFAULT_SOURCE_DIRECTORY);
const outputDirectory = path.resolve(projectRoot, args.outDir ?? DEFAULT_OUTPUT_DIRECTORY);
const sourceName = args.sourceName ?? DEFAULT_SOURCE_NAME;
const objPath = path.join(sourceDirectory, `${sourceName}.obj`);
const mtlPath = path.join(sourceDirectory, `${sourceName}.mtl`);
const outputPath = path.join(outputDirectory, `${OUTPUT_NAME}.json`);
const sourceArchiveDirectory = path.join(outputDirectory, "source");
const archivedObjPath = path.join(sourceArchiveDirectory, `${sourceName}.obj`);
const archivedMtlPath = path.join(sourceArchiveDirectory, `${sourceName}.mtl`);

fs.mkdirSync(outputDirectory, { recursive: true });
fs.rmSync(sourceArchiveDirectory, { recursive: true, force: true });
fs.mkdirSync(sourceArchiveDirectory, { recursive: true });
fs.copyFileSync(objPath, archivedObjPath);
fs.copyFileSync(mtlPath, archivedMtlPath);

const materials = parseMtl(fs.readFileSync(mtlPath, "utf8"));
for (const material of materials.values()) {
  if (material.texture == null) {
    continue;
  }

  const sourceTexturePath = path.resolve(sourceDirectory, material.texture);
  const textureOutputPath = path.join(outputDirectory, path.basename(material.texture));
  fs.copyFileSync(sourceTexturePath, textureOutputPath);
  material.texture = path.basename(material.texture);
}

const parsedObj = parseObj(fs.readFileSync(objPath, "utf8"));
const asset = createFortWallAsset({
  parsedObj,
  materials,
  source: {
    objPath: archivedObjPath,
    mtlPath: archivedMtlPath,
  },
});

fs.writeFileSync(outputPath, `${JSON.stringify(asset)}\n`, "utf8");
console.log(
  `Wrote ${path.relative(projectRoot, outputPath)} (${asset.counts.vertices} vertices, ${asset.counts.faces} faces).`
);

function createFortWallAsset({ parsedObj, materials, source }) {
  const sourceBounds = computeBounds(parsedObj.positions);
  const rotatedFootprint = computeRotatedFootprintBounds(
    parsedObj.positions,
    FORT_WALL_ROTATION_DEGREES
  );
  const sourceMinY = sourceBounds.min[1];
  const targetWidth =
    Math.sqrt(3) *
    FORT_WALL_FIT_INNER_HEX_RADIUS *
    (2 / (HEX_MAP_ASPECT * HEX_TERRAIN_SCALE));
  const targetDepth =
    2 *
    FORT_WALL_FIT_INNER_HEX_RADIUS *
    (2 / HEX_TERRAIN_SCALE);
  const fitScale = Math.min(
    targetWidth / rotatedFootprint.width,
    targetDepth / rotatedFootprint.depth
  );
  const uniformScale = fitScale * FORT_WALL_UNIFORM_SCALE;
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];
  const drawGroups = [];
  let indexOffset = 0;
  let groupStart = 0;
  let currentMaterialName = null;

  for (let vertexIndex = 0; vertexIndex < parsedObj.positions.length / 3; vertexIndex += 1) {
    const positionOffset = vertexIndex * 3;
    const normalOffset = vertexIndex * 3;
    const uvOffset = vertexIndex * 2;
    const sourceX = parsedObj.positions[positionOffset] ?? 0;
    const sourceY = parsedObj.positions[positionOffset + 1] ?? sourceMinY;
    const sourceZ = parsedObj.positions[positionOffset + 2] ?? 0;
    const sourceNormalX = parsedObj.normals[normalOffset] ?? 0;
    const sourceNormalY = parsedObj.normals[normalOffset + 1] ?? 1;
    const sourceNormalZ = parsedObj.normals[normalOffset + 2] ?? 0;
    const normal = normalizeVector3([sourceNormalX, sourceNormalZ, sourceNormalY]);

    positions.push(
      roundFloat(sourceX * uniformScale),
      roundFloat(sourceZ * uniformScale),
      roundFloat((sourceY - sourceMinY) * uniformScale)
    );
    normals.push(
      roundFloat(normal[0]),
      roundFloat(normal[1]),
      roundFloat(normal[2])
    );
    uvs.push(
      roundFloat(parsedObj.uvs[uvOffset] ?? 0),
      roundFloat(parsedObj.uvs[uvOffset + 1] ?? 0)
    );
  }

  for (const face of parsedObj.faces) {
    if (currentMaterialName !== face.materialName) {
      if (currentMaterialName != null) {
        drawGroups.push(createDrawGroup(currentMaterialName, materials, groupStart, indexOffset - groupStart));
      }
      currentMaterialName = face.materialName;
      groupStart = indexOffset;
    }

    for (const sourceIndex of face.indices) {
      indices.push(sourceIndex);
      indexOffset += 1;
    }
  }

  if (currentMaterialName != null) {
    drawGroups.push(createDrawGroup(currentMaterialName, materials, groupStart, indexOffset - groupStart));
  }

  return {
    schemaVersion: 1,
    format: "campaign-map-node-mesh-v1",
    id: OUTPUT_NAME,
    label: "Fort Hex Wall",
    source: {
      kind: "obj-mtl",
      objPath: path.relative(projectRoot, source.objPath).replaceAll("\\", "/"),
      mtlPath: path.relative(projectRoot, source.mtlPath).replaceAll("\\", "/"),
      localAxes: {
        horizontalX: "source x",
        horizontalY: "source z",
        height: "source y",
      },
    },
    placement: {
      innerHexRadius: FORT_WALL_FIT_INNER_HEX_RADIUS,
      uniformScale: FORT_WALL_UNIFORM_SCALE,
      baseWorldScale: 1,
      rotationDegrees: FORT_WALL_ROTATION_DEGREES,
      offsetX: FORT_WALL_OFFSET_X,
      offsetY: FORT_WALL_OFFSET_Y,
      lift: 0.0022,
    },
    counts: {
      vertices: positions.length / 3,
      faces: indices.length / 3,
    },
    bounds: computeBounds(positions),
    sourceBounds,
    positions,
    normals,
    uvs,
    indices,
    drawGroups,
    textures: Array.from(materials.values())
      .filter((material) => material.texture != null)
      .map((material) => material.texture)
      .sort(),
  };
}

function computeRotatedFootprintBounds(positions, rotationDegrees) {
  const rotation = rotationDegrees * Math.PI / 180;
  const rotationCos = Math.cos(rotation);
  const rotationSin = Math.sin(rotation);
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (let offset = 0; offset < positions.length; offset += 3) {
    const sourceX = positions[offset] ?? 0;
    const sourceZ = positions[offset + 2] ?? 0;
    const rotatedX = sourceX * rotationCos - sourceZ * rotationSin;
    const rotatedY = sourceX * rotationSin + sourceZ * rotationCos;
    minX = Math.min(minX, rotatedX);
    maxX = Math.max(maxX, rotatedX);
    minY = Math.min(minY, rotatedY);
    maxY = Math.max(maxY, rotatedY);
  }

  return {
    width: Math.max(maxX - minX, 0.0001),
    depth: Math.max(maxY - minY, 0.0001),
  };
}

function createDrawGroup(materialName, materials, start, count) {
  const material = materials.get(materialName);
  return {
    materialName,
    textureUrl: material?.texture ?? null,
    start,
    count,
  };
}

function parseObj(text) {
  const sourcePositions = [];
  const sourceUvs = [];
  const sourceNormals = [];
  const vertexMap = new Map();
  const positions = [];
  const uvs = [];
  const normals = [];
  const accumulatedNormals = [];
  const faces = [];
  let currentMaterialName = "default";

  for (const line of text.split(/\r?\n/u)) {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("#")) {
      continue;
    }

    const parts = trimmed.split(/\s+/u);
    if (parts[0] === "v") {
      sourcePositions.push([
        Number(parts[1] ?? 0),
        Number(parts[2] ?? 0),
        Number(parts[3] ?? 0),
      ]);
      continue;
    }

    if (parts[0] === "vt") {
      sourceUvs.push([
        Number(parts[1] ?? 0),
        1 - Number(parts[2] ?? 0),
      ]);
      continue;
    }

    if (parts[0] === "vn") {
      sourceNormals.push([
        Number(parts[1] ?? 0),
        Number(parts[2] ?? 1),
        Number(parts[3] ?? 0),
      ]);
      continue;
    }

    if (parts[0] === "usemtl") {
      currentMaterialName = parts.slice(1).join(" ") || "default";
      continue;
    }

    if (parts[0] !== "f") {
      continue;
    }

    const faceVertexIndices = parts.slice(1).map((token) => {
      const [positionToken, uvToken, normalToken] = token.split("/");
      const positionIndex = parseObjIndex(positionToken, sourcePositions.length);
      const uvIndex =
        uvToken == null || uvToken === ""
          ? -1
          : parseObjIndex(uvToken, sourceUvs.length);
      const normalIndex =
        normalToken == null || normalToken === ""
          ? -1
          : parseObjIndex(normalToken, sourceNormals.length);
      const key = `${positionIndex}/${uvIndex}/${normalIndex}`;
      const existingIndex = vertexMap.get(key);
      if (existingIndex != null) {
        return existingIndex;
      }

      const position = sourcePositions[positionIndex];
      if (position == null) {
        throw new Error(`OBJ face references missing position ${positionIndex + 1}.`);
      }
      const uv = sourceUvs[uvIndex] ?? [0, 0];
      const normal = sourceNormals[normalIndex] ?? null;
      const vertexIndex = positions.length / 3;
      positions.push(position[0], position[1], position[2]);
      uvs.push(uv[0], uv[1]);
      normals.push(normal?.[0] ?? 0, normal?.[1] ?? 0, normal?.[2] ?? 0);
      accumulatedNormals.push(0, 0, 0);
      vertexMap.set(key, vertexIndex);
      return vertexIndex;
    });

    for (let index = 1; index < faceVertexIndices.length - 1; index += 1) {
      const triangle = [
        faceVertexIndices[0],
        faceVertexIndices[index],
        faceVertexIndices[index + 1],
      ];
      faces.push({
        materialName: currentMaterialName,
        indices: triangle,
      });

      const faceNormal = createFaceNormal(positions, triangle);
      for (const vertexIndex of triangle) {
        const normalOffset = vertexIndex * 3;
        accumulatedNormals[normalOffset] =
          (accumulatedNormals[normalOffset] ?? 0) + faceNormal[0];
        accumulatedNormals[normalOffset + 1] =
          (accumulatedNormals[normalOffset + 1] ?? 0) + faceNormal[1];
        accumulatedNormals[normalOffset + 2] =
          (accumulatedNormals[normalOffset + 2] ?? 0) + faceNormal[2];
      }
    }
  }

  if (positions.length === 0 || faces.length === 0) {
    throw new Error("OBJ did not contain usable mesh geometry.");
  }

  for (let index = 0; index < normals.length; index += 3) {
    const hasSourceNormal =
      Math.hypot(normals[index] ?? 0, normals[index + 1] ?? 0, normals[index + 2] ?? 0) > 0.000001;
    const normal = hasSourceNormal
      ? normalizeVector3([
        normals[index] ?? 0,
        normals[index + 1] ?? 0,
        normals[index + 2] ?? 0,
      ])
      : normalizeVector3([
        accumulatedNormals[index] ?? 0,
        accumulatedNormals[index + 1] ?? 1,
        accumulatedNormals[index + 2] ?? 0,
      ]);
    normals[index] = normal[0];
    normals[index + 1] = normal[1];
    normals[index + 2] = normal[2];
  }

  return {
    positions,
    normals,
    uvs,
    faces,
  };
}

function createFaceNormal(positions, indices) {
  const a = readPosition(positions, indices[0]);
  const b = readPosition(positions, indices[1]);
  const c = readPosition(positions, indices[2]);
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  return normalizeVector3([
    ab[1] * ac[2] - ab[2] * ac[1],
    ab[2] * ac[0] - ab[0] * ac[2],
    ab[0] * ac[1] - ab[1] * ac[0],
  ]);
}

function readPosition(positions, vertexIndex) {
  const offset = vertexIndex * 3;
  return [
    positions[offset] ?? 0,
    positions[offset + 1] ?? 0,
    positions[offset + 2] ?? 0,
  ];
}

function parseMtl(text) {
  const materials = new Map();
  let currentMaterialName = null;

  for (const line of text.split(/\r?\n/u)) {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("#")) {
      continue;
    }

    const parts = trimmed.split(/\s+/u);
    if (parts[0] === "newmtl") {
      currentMaterialName = parts.slice(1).join(" ");
      materials.set(currentMaterialName, {
        name: currentMaterialName,
        texture: null,
      });
      continue;
    }

    if (parts[0] === "map_Kd" && currentMaterialName != null) {
      const material = materials.get(currentMaterialName);
      if (material != null) {
        material.texture = parts.slice(1).join(" ");
      }
    }
  }

  return materials;
}

function parseObjIndex(value, length) {
  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue) || parsedValue === 0) {
    throw new Error(`Invalid OBJ index "${value}".`);
  }

  return parsedValue > 0 ? parsedValue - 1 : length + parsedValue;
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

  return {
    min: min.map(roundFloat),
    max: max.map(roundFloat),
  };
}

function normalizeVector3(vector) {
  const length = Math.hypot(vector[0], vector[1], vector[2]) || 1;
  return [
    vector[0] / length,
    vector[1] / length,
    vector[2] / length,
  ];
}

function roundFloat(value) {
  return Number(value.toFixed(6));
}

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
