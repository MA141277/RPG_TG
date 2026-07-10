/* global console, process */

import fs from "node:fs";
import path from "node:path";

const args = parseArgs(process.argv.slice(2));
const sourcePath = requireArg(args, "source");
const texturePath = requireArg(args, "texture");
const outputDirectory = requireArg(args, "out-dir");
const id = requireArg(args, "id");
const label = args.label ?? id;
const role = args.role ?? "friendly";
const scale = Number(args.scale ?? 1);
const textureExtension = path.extname(texturePath).toLowerCase() || ".jpg";
const textureFileName = `${id}${textureExtension}`;
const modelFileName = `${id}.json`;

if (!Number.isFinite(scale) || scale <= 0) {
  throw new Error(`Invalid scale "${args.scale}".`);
}

const parsedModel = parseObj(fs.readFileSync(sourcePath, "utf8"));
const exportedModel = exportActorModel(parsedModel, {
  id,
  label,
  role,
  scale,
  textureFileName,
  sourcePath,
});

fs.mkdirSync(outputDirectory, { recursive: true });
fs.copyFileSync(texturePath, path.join(outputDirectory, textureFileName));
fs.writeFileSync(
  path.join(outputDirectory, modelFileName),
  `${JSON.stringify(exportedModel)}\n`,
  "utf8"
);

console.log(
  JSON.stringify(
    {
      id,
      modelFile: modelFileName,
      textureFile: textureFileName,
      vertexCount: exportedModel.positions.length / 3,
      triangleCount: exportedModel.indices.length / 3,
      bounds: exportedModel.bounds,
      scale,
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

function requireArg(args, key) {
  const value = args[key];
  if (value == null || value === "") {
    throw new Error(`Missing --${key}.`);
  }
  return value;
}

function parseObj(text) {
  const rawPositions = [];
  const rawUvs = [];
  const positions = [];
  const uvs = [];
  const normals = [];
  const indices = [];
  const vertexByKey = new Map();

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

    if (parts[0] === "vt") {
      rawUvs.push([
        Number(parts[1] ?? 0),
        Number(parts[2] ?? 0),
      ]);
      continue;
    }

    if (parts[0] !== "f" || parts.length < 4) {
      continue;
    }

    const faceVertices = parts.slice(1).map((token) => parseFaceVertex(token));
    for (let index = 1; index < faceVertices.length - 1; index += 1) {
      const triangle = [faceVertices[0], faceVertices[index], faceVertices[index + 1]];
      const triangleIndices = triangle.map((faceVertex) =>
        getOrCreateVertex(faceVertex, rawPositions, rawUvs, positions, uvs, normals, vertexByKey)
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
    throw new Error("OBJ did not contain usable mesh geometry.");
  }

  if (positions.length / 3 > 65535) {
    throw new Error("Campaign actor renderer currently requires <= 65535 vertices.");
  }

  return {
    positions,
    normals,
    uvs,
    indices,
  };
}

function parseFaceVertex(token) {
  const [position, uv] = token.split("/");
  return {
    positionIndex: Number(position) - 1,
    uvIndex: uv == null || uv === "" ? null : Number(uv) - 1,
  };
}

function getOrCreateVertex(faceVertex, rawPositions, rawUvs, positions, uvs, normals, vertexByKey) {
  const key = `${faceVertex.positionIndex}/${faceVertex.uvIndex ?? ""}`;
  const cached = vertexByKey.get(key);
  if (cached != null) {
    return cached;
  }

  const sourcePosition = rawPositions[faceVertex.positionIndex];
  if (sourcePosition == null) {
    throw new Error(`Face referenced missing position ${faceVertex.positionIndex}.`);
  }

  const sourceUv = faceVertex.uvIndex == null ? null : rawUvs[faceVertex.uvIndex];
  const vertexIndex = positions.length / 3;
  positions.push(
    sourcePosition[0] ?? 0,
    sourcePosition[2] ?? 0,
    sourcePosition[1] ?? 0
  );
  uvs.push(sourceUv?.[0] ?? 0, sourceUv == null ? 0 : 1 - (sourceUv[1] ?? 0));
  normals.push(0, 0, 0);
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

function exportActorModel(parsedModel, metadata) {
  const positions = [...parsedModel.positions];
  const bounds = computeBounds(positions);
  const origin = [
    (bounds.min[0] + bounds.max[0]) * 0.5,
    (bounds.min[1] + bounds.max[1]) * 0.5,
    bounds.min[2],
  ];

  for (let index = 0; index < positions.length; index += 3) {
    positions[index] -= origin[0];
    positions[index + 1] -= origin[1];
    positions[index + 2] -= origin[2];
  }

  const centeredBounds = computeBounds(positions);
  const vertexCount = positions.length / 3;

  return {
    id: metadata.id,
    label: metadata.label,
    role: metadata.role,
    scale: metadata.scale,
    source: {
      kind: "obj",
      path: metadata.sourcePath,
    },
    textureFile: metadata.textureFileName,
    bones: [
      {
        name: "Scene Root",
        parentIndex: null,
        localPosition: [0, 0, 0],
      },
    ],
    origin,
    bounds: centeredBounds,
    meshes: [
      {
        name: metadata.id,
        vertexBase: 0,
        vertexCount,
        indexBase: 0,
        indexCount: parsedModel.indices.length,
        boneName: "Scene Root",
      },
    ],
    positions,
    normals: parsedModel.normals,
    uvs: parsedModel.uvs,
    boneIndices: Array.from({ length: vertexCount }, () => 0),
    indices: parsedModel.indices,
  };
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
