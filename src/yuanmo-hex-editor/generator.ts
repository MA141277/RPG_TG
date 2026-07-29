import { campaignMapCoordinateToHex } from "../domain/campaign-hex";
import type { CampaignHexGridCell } from "../domain/map";
import {
  YUANMO_FOREST_ENVIRONMENT,
  YUANMO_GRASS_ENVIRONMENT,
  YUANMO_MOUNTAIN_TERRAIN,
  YUANMO_PLAIN_TERRAIN,
  type GeneratedHexCell,
  type GeneratedHexGrid,
  type YuanmoHexEnvironment,
  type YuanmoHexRasterSource,
  type YuanmoHexSamplingConfig,
  type YuanmoHexTerrain,
} from "./model";
import {
  getYuanmoEditorSourceCell,
  getYuanmoEditorSourceHexGrid,
  normalizeYuanmoHexSamplingConfig,
  YUANMO_SOURCE_COORDINATE_SPACE,
} from "./yuanmo-source";

const BASE_HEX_SOURCE_RADIUS =
  YUANMO_SOURCE_COORDINATE_SPACE.height / 138;
const HEX_HORIZONTAL_SPACING = Math.sqrt(3);
const HEX_VERTICAL_SPACING = 1.5;

export function generateBaselineHexGrid(
  config: YuanmoHexSamplingConfig,
  rasterSource?: YuanmoHexRasterSource | null
): GeneratedHexGrid {
  const normalizedConfig = normalizeYuanmoHexSamplingConfig(config);
  const source = getYuanmoEditorSourceHexGrid();
  const cells = generateLocalHexCells(normalizedConfig).map((cell) =>
    generateHexCellFromSource(
      cell.x,
      cell.y,
      cell.sourcePosition,
      normalizedConfig,
      rasterSource ?? null,
      source.defaults.terrain,
      source.defaults.environment
    )
  );

  return {
    mapId: source.mapId,
    generation: normalizedConfig,
    bounds: calculateBounds(cells),
    counts: calculateCounts(cells),
    cells,
  };
}

export function countHexInnerSamplePoints(config: YuanmoHexSamplingConfig): number {
  const normalizedConfig = normalizeYuanmoHexSamplingConfig(config);
  return createHexSampleOffsets(getHexSourceRadius(normalizedConfig)).length;
}

function generateHexCellFromSource(
  x: number,
  y: number,
  sourcePosition: { x: number; y: number },
  config: YuanmoHexSamplingConfig,
  rasterSource: YuanmoHexRasterSource | null,
  fallbackTerrain: string,
  fallbackEnvironment: string
): GeneratedHexCell {
  const sampled = sampleSourcePosition(
    sourcePosition,
    getHexSourceRadius(config),
    config.sourceCrop,
    rasterSource,
    coerceTerrain(fallbackTerrain),
    coerceEnvironment(fallbackEnvironment)
  );
  const fallbackCell = createFallbackCell(
    x,
    y,
    coerceTerrain(fallbackTerrain),
    coerceEnvironment(fallbackEnvironment)
  );

  return {
    ...fallbackCell,
    ...sampled,
    sourcePosition,
  };
}

function generateLocalHexCells(
  config: YuanmoHexSamplingConfig
): Array<{ x: number; y: number; sourcePosition: { x: number; y: number } }> {
  const radius = getHexSourceRadius(config);
  const horizontalSpacing = HEX_HORIZONTAL_SPACING * radius;
  const verticalSpacing = HEX_VERTICAL_SPACING * radius;
  const halfWidth = horizontalSpacing * 0.5;
  const { sourceCrop } = config;
  const cropRight = sourceCrop.x + sourceCrop.width;
  const cropBottom = sourceCrop.y + sourceCrop.height;
  const firstRow =
    Math.floor((sourceCrop.y - config.offsetY - radius) / verticalSpacing) - 1;
  const lastRow =
    Math.ceil((cropBottom - config.offsetY - radius) / verticalSpacing) + 1;
  const cells: Array<{ x: number; y: number; sourcePosition: { x: number; y: number } }> = [];

  for (let row = firstRow; row <= lastRow; row += 1) {
    const centerY = config.offsetY + radius + row * verticalSpacing;
    if (centerY < sourceCrop.y || centerY > cropBottom) {
      continue;
    }

    const firstColumn =
      Math.floor(
        (sourceCrop.x - config.offsetX - halfWidth) / horizontalSpacing -
          row * 0.5
      ) - 1;
    const lastColumn =
      Math.ceil(
        (cropRight - config.offsetX - halfWidth) / horizontalSpacing -
          row * 0.5
      ) + 1;

    for (let column = firstColumn; column <= lastColumn; column += 1) {
      const centerX = config.offsetX + halfWidth + (column + row * 0.5) * horizontalSpacing;
      if (centerX < sourceCrop.x || centerX > cropRight) {
        continue;
      }

      cells.push({
        x: column + row,
        y: -row,
        sourcePosition: {
          x: roundSourcePosition(centerX),
          y: roundSourcePosition(centerY),
        },
      });
    }
  }

  return cells;
}

function sampleSourcePosition(
  sourcePosition: { x: number; y: number },
  radius: number,
  sourceCrop: YuanmoHexSamplingConfig["sourceCrop"],
  rasterSource: YuanmoHexRasterSource | null,
  fallbackTerrain: YuanmoHexTerrain,
  fallbackEnvironment: YuanmoHexEnvironment
): Pick<GeneratedHexCell, "land" | "referenceHeight" | "terrain" | "environment"> {
  const offsets = createHexSampleOffsets(radius);
  const samples: CampaignHexGridCell[] = [];

  for (const offset of offsets) {
    const samplePoint = {
      x: sourcePosition.x + offset.x,
      y: sourcePosition.y + offset.y,
    };
    if (!isVisibleSourcePointInsideCrop(samplePoint, sourceCrop)) {
      continue;
    }

    const sample =
      rasterSource == null
        ? sampleSourceCellAtVisiblePosition(samplePoint)
        : sampleRasterSourceAtVisiblePosition(samplePoint, rasterSource, fallbackEnvironment);
    if (sample != null) {
      samples.push(sample);
    }
  }

  if (samples.length === 0) {
    return {
      land: false,
      referenceHeight: 0,
      terrain: fallbackTerrain,
      environment: fallbackEnvironment,
    };
  }

  const landSamples = samples.filter((sample) => sample.land);
  const land = landSamples.length >= Math.ceil(samples.length * 0.5);
  const semanticSamples = landSamples.length > 0 ? landSamples : samples;
  const mountainHits = semanticSamples.filter((sample) => sample.terrain === YUANMO_MOUNTAIN_TERRAIN).length;
  const forestHits = semanticSamples.filter((sample) => sample.environment === YUANMO_FOREST_ENVIRONMENT).length;
  const referenceHeight =
    semanticSamples.reduce((sum, sample) => sum + sample.referenceHeight, 0) /
    Math.max(semanticSamples.length, 1);

  return {
    land,
    referenceHeight: land ? Number(referenceHeight.toFixed(6)) : 0,
    terrain:
      land && mountainHits >= Math.ceil(semanticSamples.length * 0.5)
        ? YUANMO_MOUNTAIN_TERRAIN
        : fallbackTerrain,
    environment:
      land && forestHits >= Math.ceil(semanticSamples.length * 0.5)
        ? YUANMO_FOREST_ENVIRONMENT
        : fallbackEnvironment,
  };
}

function sampleSourceCellAtVisiblePosition(
  position: { x: number; y: number }
): CampaignHexGridCell | null {
  if (
    position.x < 0 ||
    position.y < 0 ||
    position.x > YUANMO_SOURCE_COORDINATE_SPACE.width ||
    position.y > YUANMO_SOURCE_COORDINATE_SPACE.height
  ) {
    return null;
  }

  const sourceHex = campaignMapCoordinateToHex(
    {
      x: position.x,
      y: YUANMO_SOURCE_COORDINATE_SPACE.height - position.y,
    },
    YUANMO_SOURCE_COORDINATE_SPACE
  );
  return getYuanmoEditorSourceCell(sourceHex.x, sourceHex.y);
}

function sampleRasterSourceAtVisiblePosition(
  position: { x: number; y: number },
  rasterSource: YuanmoHexRasterSource,
  fallbackEnvironment: YuanmoHexEnvironment
): CampaignHexGridCell | null {
  if (
    position.x < 0 ||
    position.y < 0 ||
    position.x > YUANMO_SOURCE_COORDINATE_SPACE.width ||
    position.y > YUANMO_SOURCE_COORDINATE_SPACE.height
  ) {
    return null;
  }

  const pixel = sampleRasterPixel(rasterSource.groundTypes, position);
  if (pixel == null) {
    return null;
  }

  const land = !isWaterMaterialPixel(pixel);
  const heightPixel =
    rasterSource.heights == null ? null : sampleRasterPixel(rasterSource.heights, position);
  return {
    x: 0,
    y: 0,
    land,
    referenceHeight: land ? getPixelLuminance(heightPixel ?? pixel) : 0,
    terrain: land && isMountainMaterialPixel(pixel) ? YUANMO_MOUNTAIN_TERRAIN : YUANMO_PLAIN_TERRAIN,
    environment: fallbackEnvironment,
  };
}

function sampleRasterPixel(
  raster: YuanmoHexRasterSource["groundTypes"],
  position: { x: number; y: number }
): { red: number; green: number; blue: number; alpha: number } | null {
  if (raster.width <= 0 || raster.height <= 0) {
    return null;
  }

  const pixelX = Math.min(
    raster.width - 1,
    Math.max(
      0,
      Math.round((position.x / YUANMO_SOURCE_COORDINATE_SPACE.width) * (raster.width - 1))
    )
  );
  const pixelY = Math.min(
    raster.height - 1,
    Math.max(
      0,
      Math.round((position.y / YUANMO_SOURCE_COORDINATE_SPACE.height) * (raster.height - 1))
    )
  );
  const index = (pixelY * raster.width + pixelX) * 4;
  return {
    red: raster.data[index] ?? 0,
    green: raster.data[index + 1] ?? 0,
    blue: raster.data[index + 2] ?? 0,
    alpha: raster.data[index + 3] ?? 255,
  };
}

function isWaterMaterialPixel(pixel: { red: number; green: number; blue: number; alpha: number }): boolean {
  return pixel.alpha > 0 && pixel.red >= 56 && pixel.green < 31 && pixel.blue < 31;
}

function isMountainMaterialPixel(pixel: { red: number; green: number; blue: number }): boolean {
  return (
    (pixel.red === 128 && pixel.green === 128 && pixel.blue === 64) ||
    (pixel.red === 98 && pixel.green === 65 && pixel.blue === 65)
  );
}

function getPixelLuminance(pixel: { red: number; green: number; blue: number }): number {
  return Number(((pixel.red * 0.2126 + pixel.green * 0.7152 + pixel.blue * 0.0722) / 255).toFixed(6));
}

function createHexSampleOffsets(radius: number): Array<{ x: number; y: number }> {
  const halfWidth = HEX_HORIZONTAL_SPACING * radius * 0.5;
  const spacing = Math.max(radius / 5, 0.1);
  const offsets: Array<{ x: number; y: number }> = [];

  for (let y = -radius; y <= radius + 0.0001; y += spacing) {
    for (let x = -halfWidth; x <= halfWidth + 0.0001; x += spacing) {
      if (Math.abs(y) + Math.abs(x) / Math.sqrt(3) <= radius + 0.0001) {
        offsets.push({ x, y });
      }
    }
  }

  if (!offsets.some((offset) => Math.abs(offset.x) < 0.0001 && Math.abs(offset.y) < 0.0001)) {
    offsets.push({ x: 0, y: 0 });
  }

  return offsets;
}

function isVisibleSourcePointInsideCrop(
  point: { x: number; y: number },
  sourceCrop: YuanmoHexSamplingConfig["sourceCrop"]
): boolean {
  return (
    point.x >= sourceCrop.x &&
    point.y >= sourceCrop.y &&
    point.x <= sourceCrop.x + sourceCrop.width &&
    point.y <= sourceCrop.y + sourceCrop.height
  );
}

function getHexSourceRadius(config: YuanmoHexSamplingConfig): number {
  return BASE_HEX_SOURCE_RADIUS * config.scale * getSourceSamplingStep(config);
}

function getSourceSamplingStep(config: YuanmoHexSamplingConfig): number {
  return Math.max(config.step, 0.1);
}

function roundSourcePosition(value: number): number {
  return Number(value.toFixed(3));
}

function createFallbackCell(
  x: number,
  y: number,
  terrain: YuanmoHexTerrain,
  environment: YuanmoHexEnvironment
): GeneratedHexCell {
  return {
    x,
    y,
    land: false,
    referenceHeight: 0,
    terrain,
    environment,
  };
}

function calculateBounds(cells: CampaignHexGridCell[]): GeneratedHexGrid["bounds"] {
  if (cells.length === 0) {
    return {
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0,
    };
  }

  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  for (const cell of cells) {
    minX = Math.min(minX, cell.x);
    maxX = Math.max(maxX, cell.x);
    minY = Math.min(minY, cell.y);
    maxY = Math.max(maxY, cell.y);
  }

  return {
    minX,
    maxX,
    minY,
    maxY,
  };
}

function calculateCounts(cells: GeneratedHexCell[]): GeneratedHexGrid["counts"] {
  const terrains: GeneratedHexGrid["counts"]["terrains"] = {
    [YUANMO_PLAIN_TERRAIN]: 0,
    [YUANMO_MOUNTAIN_TERRAIN]: 0,
  };
  const environments: GeneratedHexGrid["counts"]["environments"] = {
    [YUANMO_GRASS_ENVIRONMENT]: 0,
    [YUANMO_FOREST_ENVIRONMENT]: 0,
  };

  let landCells = 0;
  for (const cell of cells) {
    if (cell.land) {
      landCells += 1;
    }
    terrains[cell.terrain] += 1;
    environments[cell.environment] += 1;
  }

  return {
    cells: cells.length,
    landCells,
    waterCells: cells.length - landCells,
    terrains,
    environments,
  };
}

function coerceTerrain(value: string): YuanmoHexTerrain {
  return value === YUANMO_MOUNTAIN_TERRAIN ? YUANMO_MOUNTAIN_TERRAIN : YUANMO_PLAIN_TERRAIN;
}

function coerceEnvironment(value: string): YuanmoHexEnvironment {
  return value === YUANMO_FOREST_ENVIRONMENT ? YUANMO_FOREST_ENVIRONMENT : YUANMO_GRASS_ENVIRONMENT;
}
