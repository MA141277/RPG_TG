/* global console, process */

import fs from "node:fs";
import path from "node:path";

const DEFAULT_OUTPUT_DIRECTORY =
  "src/content/scenario-packs/zhuyuanzhang/assets/map-nodes/fort-city";
const DEFAULT_RULES_PATH =
  "src/content/scenario-packs/zhuyuanzhang/assets/map-nodes/fort-city/fort-city-rules.json";
const FORT_CITY_BASE_WORLD_SCALE = 0.00019;
const FORT_CITY_HEX_WORLD_UNIT = 2 / (1.1285 * 138);
const DEFAULT_SOURCES = [
  "D:/model/building_01_9352cd035676_Model/building_01_9352cd035676",
  "D:/model/building_03_e1e0e8793236_Model/building_03_e1e0e8793236",
  "D:/model/building_04_part_01_front_segment_Model/building_04_part_01_front_segment",
  "D:/model/building_10_25d33f33ab0d_Model/building_10_25d33f33ab0d",
  "D:/model/building_35_eab9d92f772c_Model/building_35_eab9d92f772c",
  "D:/model/building_42_126e96a0f4c9_Model/building_42_126e96a0f4c9",
  "D:/model/building_45_part_01_main_building_Model/building_45_part_01_main_building",
  "D:/model/building_46_1b59f0c93fa9_Model/building_46_1b59f0c93fa9",
];

const args = parseArgs(process.argv.slice(2));
const projectRoot = path.resolve(args.projectRoot ?? process.cwd());
const outputDirectory = path.resolve(projectRoot, args.outDir ?? DEFAULT_OUTPUT_DIRECTORY);
const rulesPath = path.resolve(projectRoot, args.rules ?? DEFAULT_RULES_PATH);
const sourceNames = (args.sources ?? DEFAULT_SOURCES.join(","))
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

fs.mkdirSync(outputDirectory, { recursive: true });
fs.mkdirSync(path.dirname(rulesPath), { recursive: true });

const variants = [];
for (const sourceBasePath of sourceNames) {
  const normalizedSourceBasePath = path.resolve(sourceBasePath);
  const sourceName = path.basename(normalizedSourceBasePath);
  const objPath = `${normalizedSourceBasePath}.obj`;
  const mtlPath = `${normalizedSourceBasePath}.mtl`;
  const asset = exportFortCityBuildingMesh({
    id: toKebabCase(sourceName),
    label: sourceName,
    objPath,
    mtlPath,
  });
  const outputPath = path.join(outputDirectory, `${asset.id}.json`);
  fs.writeFileSync(outputPath, `${JSON.stringify(asset)}\n`, "utf8");
  variants.push({
    id: asset.id,
    meshUrl: path.relative(path.dirname(rulesPath), outputPath).replaceAll("\\", "/"),
    weight: getVariantWeight(asset),
    placement: {
      footprintRadius: getVariantFootprintRadius(asset),
    },
  });
}

const rules = {
  schemaVersion: 1,
  format: "campaign-fort-city-rules-v1",
  id: "yuanmo-fort-city-buildings",
  seed: "fort-hex-city-buildings-v1",
  count: {
    min: 10,
    max: 15,
  },
  fortifiedNodeIds: [
    "settlement.fenyang_province",
  ],
  lod: {
    maxVisibleInstances: 180,
  },
  placement: {
    innerRadius: 0.08,
    outerRadius: 0.62,
    scaleMin: 0.82,
    scaleMax: 1.18,
    baseWorldScale: FORT_CITY_BASE_WORLD_SCALE,
    lift: 0.00265,
    footprintRadius: 0.12,
    minSpacing: 0.025,
    maxAttemptsPerBuilding: 120,
  },
  avoidance: {
    wallRadius: 0.64,
    buildingRadiusPadding: 0.08,
  },
  shader: {
    ambient: 0.72,
    directional: 0.16,
  },
  variants,
};

fs.writeFileSync(rulesPath, `${JSON.stringify(rules, null, 2)}\n`, "utf8");
console.log(
  JSON.stringify(
    {
      sourceCount: sourceNames.length,
      meshCount: variants.length,
      outputDirectory: path.relative(projectRoot, outputDirectory),
      rulesPath: path.relative(projectRoot, rulesPath),
    },
    null,
    2
  )
);

function exportFortCityBuildingMesh({ id, label, objPath, mtlPath }) {
  const materials = parseMtl(fs.readFileSync(mtlPath, "utf8"));
  const parsed = parseObj(fs.readFileSync(objPath, "utf8"), materials);
  const sourceBounds = computeBounds(parsed.positions);
  const origin = [
    (sourceBounds.min[0] + sourceBounds.max[0]) * 0.5,
    sourceBounds.min[1],
    (sourceBounds.min[2] + sourceBounds.max[2]) * 0.5,
  ];
  const positions = [];
  const normals = [];

  for (let index = 0; index < parsed.positions.length; index += 3) {
    positions.push(
      parsed.positions[index] - origin[0],
      parsed.positions[index + 2] - origin[2],
      parsed.positions[index + 1] - origin[1]
    );
    const normal = normalizeVector3([
      parsed.normals[index] ?? 0,
      parsed.normals[index + 2] ?? 0,
      parsed.normals[index + 1] ?? 1,
    ]);
    normals.push(normal[0], normal[1], normal[2]);
  }

  return {
    schemaVersion: 1,
    format: "campaign-vegetation-mesh-v1",
    id,
    label,
    source: {
      kind: "obj-mtl",
      objPath: path.relative(projectRoot, objPath).replaceAll("\\", "/"),
      mtlPath: path.relative(projectRoot, mtlPath).replaceAll("\\", "/"),
      materialNames: Array.from(materials.keys()).sort(),
    },
    origin: origin.map(roundFloat),
    bounds: computeBounds(positions),
    positions: positions.map(roundFloat),
    normals: normals.map(roundFloat),
    colors: parsed.colors.map(roundFloat),
    indices: parsed.indices,
  };
}

function parseMtl(text) {
  const materials = new Map();
  let currentMaterialName = null;
  let materialIndex = 0;

  for (const line of text.split(/\r?\n/u)) {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("#")) {
      continue;
    }

    const parts = trimmed.split(/\s+/u);
    if (parts[0] === "newmtl") {
      currentMaterialName = parts.slice(1).join(" ");
      materials.set(currentMaterialName, {
        color: mapBuildingMaterialColor(currentMaterialName, [0.68, 0.57, 0.45], materialIndex),
        index: materialIndex,
      });
      materialIndex += 1;
      continue;
    }

    if (parts[0] === "Kd" && currentMaterialName != null) {
      const material = materials.get(currentMaterialName);
      if (material != null) {
        material.color = mapBuildingMaterialColor(
          currentMaterialName,
          [
            clamp01(Number(parts[1] ?? 0.68)),
            clamp01(Number(parts[2] ?? 0.57)),
            clamp01(Number(parts[3] ?? 0.45)),
          ],
          material.index
        );
      }
    }
  }

  return materials;
}

function mapBuildingMaterialColor(materialName, sourceColor, materialIndex) {
  const palette = [
    [0.72, 0.38, 0.25],
    [0.70, 0.60, 0.46],
    [0.50, 0.45, 0.39],
    [0.36, 0.30, 0.25],
    [0.78, 0.70, 0.56],
    [0.42, 0.47, 0.50],
  ];
  const paletteColor =
    palette[(hashString(materialName) + materialIndex) % palette.length] ?? palette[0];

  return [
    clamp01((sourceColor[0] ?? 0.6) * 0.28 + paletteColor[0] * 0.72),
    clamp01((sourceColor[1] ?? 0.5) * 0.28 + paletteColor[1] * 0.72),
    clamp01((sourceColor[2] ?? 0.4) * 0.28 + paletteColor[2] * 0.72),
  ];
}

function parseObj(text, materials) {
  const sourcePositions = [];
  const sourceNormals = [];
  const vertexMap = new Map();
  const positions = [];
  const normals = [];
  const colors = [];
  const accumulatedNormals = [];
  const indices = [];
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
      const [positionToken, , normalToken] = token.split("/");
      const positionIndex = parseObjIndex(positionToken, sourcePositions.length);
      const normalIndex =
        normalToken == null || normalToken === ""
          ? -1
          : parseObjIndex(normalToken, sourceNormals.length);
      const key = `${positionIndex}/${normalIndex}/${currentMaterialName}`;
      const existingIndex = vertexMap.get(key);
      if (existingIndex != null) {
        return existingIndex;
      }

      const position = sourcePositions[positionIndex];
      if (position == null) {
        throw new Error(`OBJ face references missing position ${positionIndex + 1}.`);
      }
      const normal = sourceNormals[normalIndex] ?? null;
      const materialColor =
        materials.get(currentMaterialName)?.color ?? [0.68, 0.57, 0.45];
      const vertexIndex = positions.length / 3;
      positions.push(position[0], position[1], position[2]);
      normals.push(normal?.[0] ?? 0, normal?.[1] ?? 0, normal?.[2] ?? 0);
      colors.push(materialColor[0], materialColor[1], materialColor[2]);
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
      indices.push(...triangle);

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

  if (positions.length === 0 || indices.length === 0) {
    throw new Error("OBJ did not contain usable mesh geometry.");
  }

  for (let index = 0; index < normals.length; index += 3) {
    const hasSourceNormal =
      Math.hypot(normals[index] ?? 0, normals[index + 1] ?? 0, normals[index + 2] ?? 0) >
      0.000001;
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

  return { positions, normals, colors, indices };
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

function getVariantWeight(asset) {
  const footprintWidth = asset.bounds.max[0] - asset.bounds.min[0];
  const footprintDepth = asset.bounds.max[1] - asset.bounds.min[1];
  const footprint = Math.max(footprintWidth, footprintDepth, 0.001);
  return footprint > 34 ? 1 : footprint > 20 ? 2 : 3;
}

function getVariantFootprintRadius(asset) {
  const footprintWidth = asset.bounds.max[0] - asset.bounds.min[0];
  const footprintDepth = asset.bounds.max[1] - asset.bounds.min[1];
  const worldRadius =
    Math.max(footprintWidth, footprintDepth) * FORT_CITY_BASE_WORLD_SCALE * 0.5;
  return roundFloat(clamp(worldRadius / FORT_CITY_HEX_WORLD_UNIT * 0.62 + 0.012, 0.08, 0.22));
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

function parseObjIndex(value, length) {
  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue) || parsedValue === 0) {
    throw new Error(`Invalid OBJ index "${value}".`);
  }

  return parsedValue > 0 ? parsedValue - 1 : length + parsedValue;
}

function normalizeVector3(vector) {
  const length = Math.hypot(vector[0], vector[1], vector[2]) || 1;
  return [
    vector[0] / length,
    vector[1] / length,
    vector[2] / length,
  ];
}

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function clamp01(value) {
  return clamp(Number.isFinite(value) ? value : 0, 0, 1);
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
