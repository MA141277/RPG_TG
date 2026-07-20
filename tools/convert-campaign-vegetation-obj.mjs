/* global console, process */

import fs from "node:fs";
import path from "node:path";

const DEFAULT_SOURCES = [
  "PineTree_1",
  "PineTree_2",
  "PineTree_3",
  "PineTree_4",
  "PineTree_5",
];

const args = parseArgs(process.argv.slice(2));
const projectRoot = path.resolve(args.projectRoot ?? process.cwd());
const sourceDirectory = path.resolve(projectRoot, args.sourceDir ?? "src/3dasset/obj");
const outputDirectory = path.resolve(
  projectRoot,
  args.outDir ?? "src/content/scenario-packs/zhuyuanzhang/assets/vegetation"
);
const rulesPath = path.resolve(
  projectRoot,
  args.rules ?? "src/content/scenario-packs/zhuyuanzhang/assets/maps/yuanmo-campaign-vegetation-rules.json"
);
const sourceNames = (args.sources ?? DEFAULT_SOURCES.join(","))
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

fs.mkdirSync(outputDirectory, { recursive: true });
fs.mkdirSync(path.dirname(rulesPath), { recursive: true });

const variants = sourceNames.map((sourceName) => {
  const objPath = path.join(sourceDirectory, `${sourceName}.obj`);
  const mtlPath = path.join(sourceDirectory, `${sourceName}.mtl`);
  const asset = exportVegetationMesh({
    id: toKebabCase(sourceName),
    label: sourceName,
    objPath,
    mtlPath,
  });
  const outputPath = path.join(outputDirectory, `${asset.id}.json`);
  fs.writeFileSync(outputPath, `${JSON.stringify(asset)}\n`, "utf8");

  return {
    id: asset.id,
    meshUrl: path
      .relative(path.dirname(rulesPath), outputPath)
      .replaceAll("\\", "/"),
    weight: 1,
  };
});

const rules = {
  schemaVersion: 1,
  format: "campaign-vegetation-rules-v1",
  id: "yuanmo-temperate-forest",
  environment: "森林",
  profile: "temperate-pine-tree",
  seed: "hex-cell-and-instance-v1",
  variants,
  density: {
    far: { min: 1, max: 2 },
    medium: { min: 4, max: 6 },
    near: { min: 12, max: 18 },
  },
  lod: {
    mediumMinScale: 22,
    nearMinScale: 46,
    maxVisibleInstances: 840,
  },
  altitude: {
    maxTerrainHeight: 0.2,
  },
  placement: {
    innerRadius: 0.16,
    outerRadius: 0.78,
    scaleMin: 0.78,
    scaleMax: 1.12,
    baseWorldScale: 0.00105,
    lift: 0.00062,
  },
  avoidance: {
    markerRadius: 0.42,
    playerRadius: 0.34,
    pathRadius: 0.18,
    densityMultiplierNearAvoidance: 0.35,
  },
  shader: {
    ambient: 0.68,
    directional: 0.14,
  },
  shadow: {
    opacity: 0.56,
    radiusScaleX: 1.36,
    radiusScaleY: 0.82,
    lightOffsetScale: 0.34,
    lift: 0.00042,
  },
};

fs.writeFileSync(rulesPath, `${JSON.stringify(rules, null, 2)}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      sourceNames,
      meshCount: variants.length,
      outputDirectory,
      rulesPath,
    },
    null,
    2
  )
);

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

function exportVegetationMesh({ id, label, objPath, mtlPath }) {
  const materials = parseMtl(fs.readFileSync(mtlPath, "utf8"));
  const parsed = parseObj(fs.readFileSync(objPath, "utf8"), materials);
  const bounds = computeBounds(parsed.positions);
  const origin = [
    (bounds.min[0] + bounds.max[0]) * 0.5,
    (bounds.min[1] + bounds.max[1]) * 0.5,
    bounds.min[2],
  ];

  for (let index = 0; index < parsed.positions.length; index += 3) {
    parsed.positions[index] -= origin[0];
    parsed.positions[index + 1] -= origin[1];
    parsed.positions[index + 2] -= origin[2];
  }

  return {
    schemaVersion: 1,
    format: "campaign-vegetation-mesh-v1",
    id,
    label,
    source: {
      kind: "obj-mtl",
      objPath: path.relative(process.cwd(), objPath).replaceAll("\\", "/"),
      mtlPath: path.relative(process.cwd(), mtlPath).replaceAll("\\", "/"),
      materialNames: Array.from(materials.keys()).sort(),
    },
    origin,
    bounds: computeBounds(parsed.positions),
    positions: parsed.positions.map(roundFloat),
    normals: parsed.normals.map(roundFloat),
    colors: parsed.colors.map(roundFloat),
    indices: parsed.indices,
  };
}

function parseMtl(text) {
  const materials = new Map();
  let currentMaterialName = null;
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("#")) {
      continue;
    }

    const parts = trimmed.split(/\s+/);
    if (parts[0] === "newmtl") {
      currentMaterialName = parts.slice(1).join(" ");
      materials.set(currentMaterialName, [1, 1, 1]);
      continue;
    }

    if (parts[0] === "Kd" && currentMaterialName != null) {
      materials.set(currentMaterialName, mapVegetationMaterialColor(currentMaterialName, [
        clamp01(Number(parts[1] ?? 1)),
        clamp01(Number(parts[2] ?? 1)),
        clamp01(Number(parts[3] ?? 1)),
      ]));
    }
  }

  return materials;
}

function mapVegetationMaterialColor(materialName, sourceColor) {
  const lowerName = materialName.toLowerCase();
  if (
    lowerName.includes("green") ||
    lowerName.includes("leaf") ||
    lowerName.includes("leaves") ||
    sourceColor[1] >= Math.max(sourceColor[0], sourceColor[2])
  ) {
    return [0.34, 0.58, 0.18];
  }

  if (
    lowerName.includes("wood") ||
    lowerName.includes("trunk") ||
    sourceColor[0] >= sourceColor[1] * 1.25
  ) {
    return [0.42, 0.25, 0.13];
  }

  return sourceColor.map((value) => clamp01(Math.pow(value, 0.62) * 1.45));
}

function parseObj(text, materials) {
  const rawPositions = [];
  const positions = [];
  const normals = [];
  const colors = [];
  const indices = [];
  const vertexByKey = new Map();
  let currentMaterialName = "";

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("#")) {
      continue;
    }

    const parts = trimmed.split(/\s+/);
    if (parts[0] === "v") {
      rawPositions.push([
        Number(parts[1] ?? 0),
        Number(parts[2] ?? 0),
        Number(parts[3] ?? 0),
      ]);
      continue;
    }

    if (parts[0] === "usemtl") {
      currentMaterialName = parts.slice(1).join(" ");
      continue;
    }

    if (parts[0] !== "f" || parts.length < 4) {
      continue;
    }

    const faceVertices = parts.slice(1).map(parseFacePositionIndex);
    for (let index = 1; index < faceVertices.length - 1; index += 1) {
      const triangle = [faceVertices[0], faceVertices[index], faceVertices[index + 1]];
      const triangleIndices = triangle.map((positionIndex) =>
        getOrCreateVertex(
          positionIndex,
          currentMaterialName,
          rawPositions,
          positions,
          normals,
          colors,
          vertexByKey,
          materials
        )
      );
      accumulateTriangleNormal(triangleIndices, positions, normals);
      indices.push(...triangleIndices);
    }
  }

  for (let index = 0; index < normals.length; index += 3) {
    const normalized = normalize([
      normals[index] ?? 0,
      normals[index + 1] ?? 0,
      normals[index + 2] ?? 1,
    ]);
    normals[index] = normalized[0];
    normals[index + 1] = normalized[1];
    normals[index + 2] = normalized[2];
  }

  if (positions.length === 0 || indices.length === 0) {
    throw new Error("OBJ did not contain usable vegetation geometry.");
  }

  return { positions, normals, colors, indices };
}

function parseFacePositionIndex(token) {
  const [position] = token.split("/");
  return Number(position) - 1;
}

function getOrCreateVertex(
  positionIndex,
  materialName,
  rawPositions,
  positions,
  normals,
  colors,
  vertexByKey,
  materials
) {
  const key = `${positionIndex}/${materialName}`;
  const cached = vertexByKey.get(key);
  if (cached != null) {
    return cached;
  }

  const sourcePosition = rawPositions[positionIndex];
  if (sourcePosition == null) {
    throw new Error(`Face referenced missing position ${positionIndex}.`);
  }

  const color = materials.get(materialName) ?? [1, 1, 1];
  const vertexIndex = positions.length / 3;
  positions.push(
    sourcePosition[0] ?? 0,
    sourcePosition[2] ?? 0,
    sourcePosition[1] ?? 0
  );
  normals.push(0, 0, 0);
  colors.push(color[0], color[1], color[2]);
  vertexByKey.set(key, vertexIndex);
  return vertexIndex;
}

function accumulateTriangleNormal(indices, positions, normals) {
  const a = readPosition(positions, indices[0]);
  const b = readPosition(positions, indices[1]);
  const c = readPosition(positions, indices[2]);
  const normal = normalize(cross(subtract(b, a), subtract(c, a)));

  for (const vertexIndex of indices) {
    const offset = vertexIndex * 3;
    normals[offset] += normal[0];
    normals[offset + 1] += normal[1];
    normals[offset + 2] += normal[2];
  }
}

function readPosition(positions, vertexIndex) {
  const offset = vertexIndex * 3;
  return [
    positions[offset] ?? 0,
    positions[offset + 1] ?? 0,
    positions[offset + 2] ?? 0,
  ];
}

function subtract(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function normalize(vector) {
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
    min[0] = Math.min(min[0], positions[index] ?? 0);
    min[1] = Math.min(min[1], positions[index + 1] ?? 0);
    min[2] = Math.min(min[2], positions[index + 2] ?? 0);
    max[0] = Math.max(max[0], positions[index] ?? 0);
    max[1] = Math.max(max[1], positions[index + 1] ?? 0);
    max[2] = Math.max(max[2], positions[index + 2] ?? 0);
  }
  return { min, max };
}

function roundFloat(value) {
  return Math.round(value * 1000000) / 1000000;
}

function clamp01(value) {
  if (!Number.isFinite(value)) {
    return 1;
  }
  return Math.min(Math.max(value, 0), 1);
}

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();
}
