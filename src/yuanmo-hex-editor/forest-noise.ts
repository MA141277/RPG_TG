import {
  YUANMO_FOREST_ENVIRONMENT,
  type EnvironmentOverride,
  type GeneratedHexCell,
} from "./model";

export type PerlinForestGenerationInput = {
  generated: {
    cells: Array<
      Pick<GeneratedHexCell, "x" | "y" | "land" | "environment"> & {
        sourcePosition?: { x: number; y: number };
      }
    >;
  };
  existingOverrides: EnvironmentOverride[];
  density: number;
  scale: number;
  seed: string;
  landOnly: boolean;
};

export type PerlinForestGenerationPreview = {
  generatedOverrides: EnvironmentOverride[];
  candidateCells: number;
  forestCells: number;
};

export function applyPerlinForestEnvironmentOverrides(
  input: PerlinForestGenerationInput
): EnvironmentOverride[] {
  return createPerlinForestEnvironmentOverrides(input).generatedOverrides;
}

export function createPerlinForestEnvironmentOverrides(
  input: PerlinForestGenerationInput
): PerlinForestGenerationPreview {
  const options = normalizeForestGenerationOptions(input);
  const generatedOverrides: EnvironmentOverride[] = [];
  let candidateCells = 0;

  for (const cell of input.generated.cells) {
    if (options.landOnly && !cell.land) {
      continue;
    }

    candidateCells += 1;
    const noisePoint = cell.sourcePosition ?? { x: cell.x, y: cell.y };
    const noiseValue = sampleForestNoise(
      noisePoint.x,
      noisePoint.y,
      options.scale,
      options.seedHash
    );
    if (noiseValue < options.density) {
      continue;
    }

    generatedOverrides.push({
      x: cell.x,
      y: cell.y,
      environment: YUANMO_FOREST_ENVIRONMENT,
    });
  }

  generatedOverrides.sort(compareEnvironmentOverride);

  return {
    generatedOverrides,
    candidateCells,
    forestCells: generatedOverrides.length,
  };
}

function normalizeForestGenerationOptions(input: PerlinForestGenerationInput): {
  density: number;
  scale: number;
  seedHash: number;
  landOnly: boolean;
} {
  return {
    density: 1 - clamp(input.density, 0, 1),
    scale: Math.max(0.1, input.scale),
    seedHash: hashSeed(input.seed.trim().length > 0 ? input.seed : "yuanmo-forest"),
    landOnly: input.landOnly,
  };
}

function sampleForestNoise(x: number, y: number, scale: number, seedHash: number): number {
  const frequency = 1 / (scale * 18);
  const value =
    perlin2(x * frequency, y * frequency, seedHash) * 0.62 +
    perlin2(x * frequency * 2.15 + 17.3, y * frequency * 2.15 - 9.7, seedHash) * 0.26 +
    perlin2(x * frequency * 4.1 - 5.2, y * frequency * 4.1 + 23.9, seedHash) * 0.12;

  return clamp((value + 1) * 0.5, 0, 1);
}

function perlin2(x: number, y: number, seedHash: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = x0 + 1;
  const y1 = y0 + 1;
  const sx = fade(x - x0);
  const sy = fade(y - y0);

  const n00 = gradientDot(x0, y0, x - x0, y - y0, seedHash);
  const n10 = gradientDot(x1, y0, x - x1, y - y0, seedHash);
  const n01 = gradientDot(x0, y1, x - x0, y - y1, seedHash);
  const n11 = gradientDot(x1, y1, x - x1, y - y1, seedHash);

  const ix0 = lerp(n00, n10, sx);
  const ix1 = lerp(n01, n11, sx);
  return lerp(ix0, ix1, sy);
}

function gradientDot(
  gridX: number,
  gridY: number,
  dx: number,
  dy: number,
  seedHash: number
): number {
  const angle = pseudoRandomUnit(gridX, gridY, seedHash) * Math.PI * 2;
  return Math.cos(angle) * dx + Math.sin(angle) * dy;
}

function pseudoRandomUnit(x: number, y: number, seedHash: number): number {
  const value = Math.sin(x * 127.1 + y * 311.7 + seedHash * 74.7) * 43758.5453123;
  return value - Math.floor(value);
}

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function compareEnvironmentOverride(
  left: EnvironmentOverride,
  right: EnvironmentOverride
): number {
  return left.y - right.y || left.x - right.x || left.environment.localeCompare(right.environment);
}

function fade(value: number): number {
  return value * value * value * (value * (value * 6 - 15) + 10);
}

function lerp(left: number, right: number, amount: number): number {
  return left + (right - left) * amount;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
