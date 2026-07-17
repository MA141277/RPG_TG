/* global console, process */

import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const DEFAULTS = {
  mapPath: "src/content/scenario-packs/zhuyuanzhang/maps.json",
  mapId: "map.yuanmo_campaign",
  sourceLayerId: "map_ground_types",
  heightSourceLayerId: "map_heights",
  environmentSourceLayerId: "map_climates",
  outputPath: "src/content/scenario-packs/zhuyuanzhang/assets/maps/yuanmo-campaign-hex-grid.json",
  terrain: "平原",
  mountainTerrain: "山脉",
  mountainColors: "128,128,64;98,65,65",
  mountainMinHits: 3,
  environment: "草地",
  forestEnvironment: "森林",
  forestColors: "0,166,81;57,181,74",
  forestMinHits: 3,
};

const HEX_TERRAIN_SCALE = 138;
const HEX_MAP_ASPECT = 1.1285;
const ENVIRONMENT_SAMPLE_OFFSETS = [
  { x: 0, y: 0 },
  { x: -0.36, y: -0.22 },
  { x: 0.36, y: -0.22 },
  { x: -0.36, y: 0.22 },
  { x: 0.36, y: 0.22 },
  { x: 0, y: -0.42 },
  { x: 0, y: 0.42 },
];
const TERRAIN_SAMPLE_OFFSETS = ENVIRONMENT_SAMPLE_OFFSETS;

const options = parseArgs(process.argv.slice(2));
const projectRoot = process.cwd();
const mapPath = path.resolve(projectRoot, options.mapPath);
const maps = JSON.parse(fs.readFileSync(mapPath, "utf8"));
const mapDefinition = maps.find((entry) => entry.id === options.mapId);

if (mapDefinition == null) {
  throw new Error(`Map "${options.mapId}" was not found in ${options.mapPath}.`);
}

const sourceLayer = mapDefinition.layers?.find((layer) => layer.id === options.sourceLayerId);
if (sourceLayer == null) {
  throw new Error(`Layer "${options.sourceLayerId}" was not found on map "${options.mapId}".`);
}

const sourceImagePath = path.resolve(path.dirname(mapPath), sourceLayer.imageUrl);
const png = PNG.sync.read(fs.readFileSync(sourceImagePath));
const environmentSource =
  options.environmentSourceLayerId === "none"
    ? null
    : loadEnvironmentSource(mapDefinition, mapPath, options.environmentSourceLayerId);
const heightSource =
  options.heightSourceLayerId === "none"
    ? null
    : loadRasterSource(mapDefinition, mapPath, options.heightSourceLayerId);
const forestColors = parseColorPalette(options.forestColors);
const mountainColors = parseColorPalette(options.mountainColors);
const cells = getCampaignHexCells().map((cell) => {
  const center = campaignHexToPixel(cell);
  const u = campaignHexPointToTerrainU(center.x);
  const v = campaignHexPointToTerrainV(center.y);
  const isInsideMap = u >= 0 && u <= 1 && v >= 0 && v <= 1;
  const pixelX = Math.min(Math.max(Math.round(u * (png.width - 1)), 0), png.width - 1);
  const pixelY = Math.min(Math.max(Math.round(v * (png.height - 1)), 0), png.height - 1);
  const offset = (pixelY * png.width + pixelX) * 4;
  const red = png.data[offset] ?? 0;
  const green = png.data[offset + 1] ?? red;
  const blue = png.data[offset + 2] ?? red;
  const land = isInsideMap && !isWaterMaterialColor(red, green, blue);
  const terrain = land
    ? sampleTerrain({
      cellCenter: center,
      source: {
        image: png,
      },
      mountainColors,
      fallbackTerrain: options.terrain,
      mountainTerrain: options.mountainTerrain,
      mountainMinHits: options.mountainMinHits,
    })
    : options.terrain;
  const environment =
    land && environmentSource != null
      ? sampleEnvironment({
        cellCenter: center,
        source: environmentSource,
        forestColors,
        fallbackEnvironment: options.environment,
        forestEnvironment: options.forestEnvironment,
        forestMinHits: options.forestMinHits,
      })
      : options.environment;
  const referenceHeight =
    land && heightSource != null
      ? sampleReferenceHeight({
        cellCenter: center,
        source: heightSource,
      })
      : 0;

  return {
    x: cell.x,
    y: cell.y,
    land,
    referenceHeight,
    terrain,
    environment,
  };
});
const bounds = cells.reduce(
  (nextBounds, cell) => ({
    minX: Math.min(nextBounds.minX, cell.x),
    maxX: Math.max(nextBounds.maxX, cell.x),
    minY: Math.min(nextBounds.minY, cell.y),
    maxY: Math.max(nextBounds.maxY, cell.y),
  }),
  {
    minX: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
  }
);
const landCells = cells.filter((cell) => cell.land).length;
const terrainCounts = cells.reduce((counts, cell) => {
  counts[cell.terrain] = (counts[cell.terrain] ?? 0) + 1;
  return counts;
}, {});
const environmentCounts = cells.reduce((counts, cell) => {
  counts[cell.environment] = (counts[cell.environment] ?? 0) + 1;
  return counts;
}, {});
const output = {
  schemaVersion: 1,
  format: "campaign-hex-grid-v1",
  mapId: options.mapId,
  defaults: {
    terrain: options.terrain,
    environment: options.environment,
  },
  coordinateSystem: {
    hexTerrainScale: HEX_TERRAIN_SCALE,
    hexMapAspect: HEX_MAP_ASPECT,
    coordinateSpace: mapDefinition.coordinateSpace,
  },
  source: {
    kind: "sampled-raster-layer",
    sourceLayerId: options.sourceLayerId,
    sourceImage: {
      path: path.relative(path.dirname(path.resolve(projectRoot, options.outputPath)), sourceImagePath).replaceAll("\\", "/"),
      width: png.width,
      height: png.height,
    },
    sampler: {
      method: "hex-center-nearest-pixel",
      hexCellSource: "src/domain/campaign-hex.ts:getCampaignHexCells",
      terrainUvFormula:
        "u = x / (hexMapAspect * hexTerrainScale) + 0.5; v = y / hexTerrainScale + 0.5",
      pixelFormula:
        "pixelX = clamp(round(u * (sourceWidth - 1)), 0, sourceWidth - 1); pixelY = clamp(round(v * (sourceHeight - 1)), 0, sourceHeight - 1)",
      waterMaterialRule: "red >= 56 && green < 31 && blue < 31",
      landRule: "land = mapInside && !waterMaterialRule",
      mapOutsideRule: "hex centers outside terrain UV [0, 1] are water / non-land",
    },
    terrainSampler: {
      method: "hex-multi-point-color-palette",
      sourceLayerId: options.sourceLayerId,
      sampleOffsets: TERRAIN_SAMPLE_OFFSETS,
      matchRule:
        "terrain = mountainTerrain when land && mountainColorHits >= mountainMinHits; otherwise fallbackTerrain",
      fallbackTerrain: options.terrain,
      matches: [
        {
          terrain: options.mountainTerrain,
          colors: [...mountainColors].map(formatColor),
          minHits: options.mountainMinHits,
        },
      ],
    },
    ...(heightSource == null
      ? {}
      : {
        heightSampler: {
          method: "hex-multi-point-height-average",
          sourceLayerId: options.heightSourceLayerId,
          sourceImage: {
            path: path.relative(path.dirname(path.resolve(projectRoot, options.outputPath)), heightSource.path).replaceAll("\\", "/"),
            width: heightSource.image.width,
            height: heightSource.image.height,
          },
          sampleOffsets: TERRAIN_SAMPLE_OFFSETS,
          colorFormula: "luminance",
          fallbackHeight: 0,
        },
      }),
    ...(environmentSource == null
      ? {}
      : {
        environmentSampler: {
          method: "hex-multi-point-color-palette",
          sourceLayerId: options.environmentSourceLayerId,
          sourceImage: {
            path: path.relative(path.dirname(path.resolve(projectRoot, options.outputPath)), environmentSource.path).replaceAll("\\", "/"),
            width: environmentSource.image.width,
            height: environmentSource.image.height,
          },
          sampleOffsets: ENVIRONMENT_SAMPLE_OFFSETS,
          matchRule:
            "environment = forestEnvironment when land && forestColorHits >= forestMinHits; otherwise fallbackEnvironment",
          fallbackEnvironment: options.environment,
          matches: [
            {
              environment: options.forestEnvironment,
              colors: [...forestColors].map(formatColor),
              minHits: options.forestMinHits,
            },
          ],
        },
      }),
  },
  bounds,
  counts: {
    cells: cells.length,
    landCells,
    waterCells: cells.length - landCells,
    terrains: terrainCounts,
    environments: environmentCounts,
  },
  cells,
};

const outputPath = path.resolve(projectRoot, options.outputPath);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(
  `Wrote ${path.relative(projectRoot, outputPath)} (${output.counts.cells} cells, ${output.counts.landCells} land).`
);

function parseArgs(args) {
  const parsed = { ...DEFAULTS };

  for (let index = 0; index < args.length; index += 1) {
    const key = args[index];
    const value = args[index + 1];
    if (value == null) {
      throw new Error(`Missing value for ${key}.`);
    }

    if (key === "--map") {
      parsed.mapPath = value;
    } else if (key === "--mapId") {
      parsed.mapId = value;
    } else if (key === "--sourceLayer") {
      parsed.sourceLayerId = value;
    } else if (key === "--heightSourceLayer") {
      parsed.heightSourceLayerId = value;
    } else if (key === "--environmentSourceLayer") {
      parsed.environmentSourceLayerId = value;
    } else if (key === "--out") {
      parsed.outputPath = value;
    } else if (key === "--terrain") {
      parsed.terrain = value;
    } else if (key === "--mountainTerrain") {
      parsed.mountainTerrain = value;
    } else if (key === "--mountainColors") {
      parsed.mountainColors = value;
    } else if (key === "--mountainMinHits") {
      parsed.mountainMinHits = Number.parseInt(value, 10);
      if (!Number.isFinite(parsed.mountainMinHits) || parsed.mountainMinHits <= 0) {
        throw new Error(`Invalid --mountainMinHits value "${value}".`);
      }
    } else if (key === "--environment") {
      parsed.environment = value;
    } else if (key === "--forestEnvironment") {
      parsed.forestEnvironment = value;
    } else if (key === "--forestColors") {
      parsed.forestColors = value;
    } else if (key === "--forestMinHits") {
      parsed.forestMinHits = Number.parseInt(value, 10);
      if (!Number.isFinite(parsed.forestMinHits) || parsed.forestMinHits <= 0) {
        throw new Error(`Invalid --forestMinHits value "${value}".`);
      }
    } else {
      throw new Error(`Unknown argument ${key}.`);
    }

    index += 1;
  }

  return parsed;
}

function sampleTerrain({
  cellCenter,
  source,
  mountainColors,
  fallbackTerrain,
  mountainTerrain,
  mountainMinHits,
}) {
  let mountainHits = 0;

  for (const offset of TERRAIN_SAMPLE_OFFSETS) {
    const u = campaignHexPointToTerrainU(cellCenter.x + offset.x);
    const v = campaignHexPointToTerrainV(cellCenter.y + offset.y);
    if (u < 0 || u > 1 || v < 0 || v > 1) {
      continue;
    }

    const pixelX = Math.min(
      Math.max(Math.round(u * (source.image.width - 1)), 0),
      source.image.width - 1
    );
    const pixelY = Math.min(
      Math.max(Math.round(v * (source.image.height - 1)), 0),
      source.image.height - 1
    );
    const pixelOffset = (pixelY * source.image.width + pixelX) * 4;
    const colorKey = getColorKey(
      source.image.data[pixelOffset] ?? 0,
      source.image.data[pixelOffset + 1] ?? 0,
      source.image.data[pixelOffset + 2] ?? 0
    );

    if (mountainColors.has(colorKey)) {
      mountainHits += 1;
    }
  }

  return mountainHits >= mountainMinHits ? mountainTerrain : fallbackTerrain;
}

function loadRasterSource(mapDefinition, mapPath, sourceLayerId) {
  const sourceLayer = mapDefinition.layers?.find((layer) => layer.id === sourceLayerId);
  if (sourceLayer == null) {
    throw new Error(`Layer "${sourceLayerId}" was not found on map "${mapDefinition.id}".`);
  }

  const sourceImagePath = path.resolve(path.dirname(mapPath), sourceLayer.imageUrl);
  return {
    path: sourceImagePath,
    image: PNG.sync.read(fs.readFileSync(sourceImagePath)),
  };
}

function loadEnvironmentSource(mapDefinition, mapPath, sourceLayerId) {
  return loadRasterSource(mapDefinition, mapPath, sourceLayerId);
}

function sampleReferenceHeight({ cellCenter, source }) {
  let heightSum = 0;
  let sampleCount = 0;

  for (const offset of TERRAIN_SAMPLE_OFFSETS) {
    const u = campaignHexPointToTerrainU(cellCenter.x + offset.x);
    const v = campaignHexPointToTerrainV(cellCenter.y + offset.y);
    if (u < 0 || u > 1 || v < 0 || v > 1) {
      continue;
    }

    const pixelX = Math.min(
      Math.max(Math.round(u * (source.image.width - 1)), 0),
      source.image.width - 1
    );
    const pixelY = Math.min(
      Math.max(Math.round(v * (source.image.height - 1)), 0),
      source.image.height - 1
    );
    const pixelOffset = (pixelY * source.image.width + pixelX) * 4;
    heightSum += getHeightFromHeightmapColor(
      source.image.data[pixelOffset] ?? 0,
      source.image.data[pixelOffset + 1] ?? 0,
      source.image.data[pixelOffset + 2] ?? 0
    );
    sampleCount += 1;
  }

  return sampleCount > 0 ? Number((heightSum / sampleCount).toFixed(6)) : 0;
}

function sampleEnvironment({
  cellCenter,
  source,
  forestColors,
  fallbackEnvironment,
  forestEnvironment,
  forestMinHits,
}) {
  let forestHits = 0;

  for (const offset of ENVIRONMENT_SAMPLE_OFFSETS) {
    const u = campaignHexPointToTerrainU(cellCenter.x + offset.x);
    const v = campaignHexPointToTerrainV(cellCenter.y + offset.y);
    if (u < 0 || u > 1 || v < 0 || v > 1) {
      continue;
    }

    const pixelX = Math.min(
      Math.max(Math.round(u * (source.image.width - 1)), 0),
      source.image.width - 1
    );
    const pixelY = Math.min(
      Math.max(Math.round(v * (source.image.height - 1)), 0),
      source.image.height - 1
    );
    const pixelOffset = (pixelY * source.image.width + pixelX) * 4;
    const colorKey = getColorKey(
      source.image.data[pixelOffset] ?? 0,
      source.image.data[pixelOffset + 1] ?? 0,
      source.image.data[pixelOffset + 2] ?? 0
    );

    if (forestColors.has(colorKey)) {
      forestHits += 1;
    }
  }

  return forestHits >= forestMinHits ? forestEnvironment : fallbackEnvironment;
}

function parseColorPalette(value) {
  const colors = new Set();
  for (const colorText of value.split(";")) {
    const channels = colorText.split(",").map((channel) => Number.parseInt(channel.trim(), 10));
    if (
      channels.length !== 3 ||
      channels.some((channel) => !Number.isFinite(channel) || channel < 0 || channel > 255)
    ) {
      throw new Error(`Invalid RGB color "${colorText}". Expected "red,green,blue".`);
    }
    colors.add(getColorKey(channels[0], channels[1], channels[2]));
  }
  return colors;
}

function getColorKey(red, green, blue) {
  return `${red},${green},${blue}`;
}

function formatColor(colorKey) {
  return colorKey;
}

function getCampaignHexCells() {
  const mapMinX = -HEX_MAP_ASPECT * HEX_TERRAIN_SCALE * 0.5;
  const mapMaxX = HEX_MAP_ASPECT * HEX_TERRAIN_SCALE * 0.5;
  const mapMinY = -HEX_TERRAIN_SCALE * 0.5;
  const mapMaxY = HEX_TERRAIN_SCALE * 0.5;
  const axialBounds = [
    campaignPixelToRoundedHex(mapMinX, mapMinY),
    campaignPixelToRoundedHex(mapMaxX, mapMinY),
    campaignPixelToRoundedHex(mapMinX, mapMaxY),
    campaignPixelToRoundedHex(mapMaxX, mapMaxY),
  ];
  const minX = Math.min(...axialBounds.map((cell) => cell.x)) - 2;
  const maxX = Math.max(...axialBounds.map((cell) => cell.x)) + 2;
  const minY = Math.min(...axialBounds.map((cell) => cell.y)) - 2;
  const maxY = Math.max(...axialBounds.map((cell) => cell.y)) + 2;
  const cells = [];

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const center = campaignHexToPixel({ x, y });
      if (
        center.x < mapMinX - Math.sqrt(3) ||
        center.x > mapMaxX + Math.sqrt(3) ||
        center.y < mapMinY - 1 ||
        center.y > mapMaxY + 1
      ) {
        continue;
      }
      cells.push({ x, y });
    }
  }

  return cells;
}

function campaignHexToPixel(hex) {
  return {
    x: Math.sqrt(3) * (hex.x + hex.y * 0.5),
    y: 1.5 * hex.y,
  };
}

function campaignPixelToRoundedHex(x, y) {
  const axialX = Math.sqrt(3) / 3 * x - 1 / 3 * y;
  const axialY = 2 / 3 * y;
  const cubeX = axialX;
  const cubeZ = axialY;
  const cubeY = -cubeX - cubeZ;
  let roundedX = Math.round(cubeX);
  let roundedY = Math.round(cubeY);
  let roundedZ = Math.round(cubeZ);
  const xDiff = Math.abs(roundedX - cubeX);
  const yDiff = Math.abs(roundedY - cubeY);
  const zDiff = Math.abs(roundedZ - cubeZ);

  if (xDiff > yDiff && xDiff > zDiff) {
    roundedX = -roundedY - roundedZ;
  } else if (yDiff > zDiff) {
    roundedY = -roundedX - roundedZ;
  } else {
    roundedZ = -roundedX - roundedY;
  }

  return {
    x: roundedX,
    y: roundedZ,
  };
}

function campaignHexPointToTerrainU(x) {
  return x / (HEX_MAP_ASPECT * HEX_TERRAIN_SCALE) + 0.5;
}

function campaignHexPointToTerrainV(y) {
  return y / HEX_TERRAIN_SCALE + 0.5;
}

function isWaterMaterialColor(red, green, blue) {
  return red >= 56 && green < 31 && blue < 31;
}

function getHeightFromHeightmapColor(red, green, blue) {
  if (isWaterHeightColor(red, green, blue)) {
    return 0;
  }

  const luminance = (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255;
  return Math.max(0, Math.min(luminance, 1));
}

function isWaterHeightColor(red, green, blue) {
  return red < 12 && green < 12 && blue < 12;
}
