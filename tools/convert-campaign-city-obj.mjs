import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const inputPath = path.join(
  projectRoot,
  "src",
  "3dasset",
  "city_hun",
  "36ed5e377f373dce04dfa04e4c581930.obj"
);
const outputPath = path.join(
  projectRoot,
  "src",
  "3dasset",
  "city_hun",
  "city-hun-campaign-lowpoly.json"
);

const lines = fs.readFileSync(inputPath, "utf8").split(/\r?\n/u);
const sourcePositions = [];
const sourceUvs = [];
const vertexMap = new Map();
const positions = [];
const uvs = [];
const normalSums = [];
const indices = [];

for (const line of lines) {
  if (line.startsWith("v ")) {
    const [, x, y, z] = line.trim().split(/\s+/u);
    sourcePositions.push([Number(x), Number(y), Number(z)]);
    continue;
  }

  if (line.startsWith("vt ")) {
    const [, u, v] = line.trim().split(/\s+/u);
    sourceUvs.push([Number(u), Number(v)]);
    continue;
  }

  if (!line.startsWith("f ")) {
    continue;
  }

  const faceIndices = line
    .trim()
    .split(/\s+/u)
    .slice(1)
    .map((token) => {
      const [positionToken, uvToken] = token.split("/");
      const positionIndex = Number(positionToken) - 1;
      const uvIndex = uvToken == null || uvToken === "" ? positionIndex : Number(uvToken) - 1;
      const key = `${positionIndex}/${uvIndex}`;
      const existingIndex = vertexMap.get(key);
      if (existingIndex != null) {
        return existingIndex;
      }

      const position = sourcePositions[positionIndex];
      const uv = sourceUvs[uvIndex] ?? [0, 0];
      if (position == null) {
        throw new Error(`OBJ face references missing position index ${positionIndex + 1}.`);
      }

      const vertexIndex = positions.length / 3;
      positions.push(round(position[0]), round(position[1]), round(position[2]));
      uvs.push(round(uv[0]), round(1 - uv[1]));
      normalSums.push(0, 0, 0);
      vertexMap.set(key, vertexIndex);
      return vertexIndex;
    });

  for (let index = 1; index < faceIndices.length - 1; index += 1) {
    const a = faceIndices[0];
    const b = faceIndices[index];
    const c = faceIndices[index + 1];
    indices.push(a, b, c);
    accumulateFaceNormal(a, b, c);
  }
}

const normals = [];
for (let index = 0; index < normalSums.length; index += 3) {
  const x = normalSums[index] ?? 0;
  const y = normalSums[index + 1] ?? 0;
  const z = normalSums[index + 2] ?? 0;
  const length = Math.hypot(x, y, z) || 1;
  normals.push(round(x / length), round(y / length), round(z / length));
}

const asset = {
  format: "city-depth-mesh-lowpoly-v1",
  source: {
    mesh: "3dasset/city_hun/36ed5e377f373dce04dfa04e4c581930.obj",
    texture: "3dasset/city_hun/texture_pbr_20250901.png",
    mode: "obj",
  },
  counts: {
    vertices: positions.length / 3,
    faces: indices.length / 3,
  },
  positions,
  normals,
  uvs,
  indices,
};

fs.writeFileSync(outputPath, `${JSON.stringify(asset)}\n`);
console.log(
  `Wrote ${path.relative(projectRoot, outputPath)} (${asset.counts.vertices} vertices, ${asset.counts.faces} faces).`
);

function accumulateFaceNormal(a, b, c) {
  const ax = positions[a * 3] ?? 0;
  const ay = positions[a * 3 + 1] ?? 0;
  const az = positions[a * 3 + 2] ?? 0;
  const bx = positions[b * 3] ?? 0;
  const by = positions[b * 3 + 1] ?? 0;
  const bz = positions[b * 3 + 2] ?? 0;
  const cx = positions[c * 3] ?? 0;
  const cy = positions[c * 3 + 1] ?? 0;
  const cz = positions[c * 3 + 2] ?? 0;
  const abx = bx - ax;
  const aby = by - ay;
  const abz = bz - az;
  const acx = cx - ax;
  const acy = cy - ay;
  const acz = cz - az;
  const normalX = aby * acz - abz * acy;
  const normalY = abz * acx - abx * acz;
  const normalZ = abx * acy - aby * acx;

  for (const vertexIndex of [a, b, c]) {
    normalSums[vertexIndex * 3] += normalX;
    normalSums[vertexIndex * 3 + 1] += normalY;
    normalSums[vertexIndex * 3 + 2] += normalZ;
  }
}

function round(value) {
  return Number(value.toFixed(6));
}
