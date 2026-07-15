/* global console, process */

import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const DEFAULTS = {
  mapPath: "src/content/scenario-packs/zhuyuanzhang/maps.json",
  mapId: "map.yuanmo_campaign",
  sourceLayerId: "map_ground_types",
  outputPath: "src/content/scenario-packs/zhuyuanzhang/assets/maps/yuanmo-campaign-hex-grid.json",
  terrain: "平原",
  environment: "草地",
};

const HEX_TERRAIN_SCALE = 138;
const HEX_MAP_ASPECT = 1.1285;

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
const cells = getCampaignHexCells().map((cell) => {
  const center = campaignHexToPixel(cell);
  const u = campaignHexPointToTerrainU(center.x);
  const v = campaignHexPointToTerrainV(center.y);
  const pixelX = Math.min(Math.max(Math.round(u * (png.width - 1)), 0), png.width - 1);
  const pixelY = Math.min(Math.max(Math.round(v * (png.height - 1)), 0), png.height - 1);
  const offset = (pixelY * png.width + pixelX) * 4;
  const red = png.data[offset] ?? 0;
  const green = png.data[offset + 1] ?? red;
  const blue = png.data[offset + 2] ?? red;
  const land = !isWaterMaterialColor(red, green, blue);

  return {
    x: cell.x,
    y: cell.y,
    land,
    terrain: options.terrain,
    environment: options.environment,
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
        "pixelX = round(u * (sourceWidth - 1)); pixelY = round(v * (sourceHeight - 1))",
      waterMaterialRule: "red >= 56 && green < 31 && blue < 31",
      landRule: "land = !waterMaterialRule",
    },
  },
  bounds,
  counts: {
    cells: cells.length,
    landCells,
    waterCells: cells.length - landCells,
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
    } else if (key === "--out") {
      parsed.outputPath = value;
    } else if (key === "--terrain") {
      parsed.terrain = value;
    } else if (key === "--environment") {
      parsed.environment = value;
    } else {
      throw new Error(`Unknown argument ${key}.`);
    }

    index += 1;
  }

  return parsed;
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
  return clamp(x / (HEX_MAP_ASPECT * HEX_TERRAIN_SCALE) + 0.5);
}

function campaignHexPointToTerrainV(y) {
  return clamp(y / HEX_TERRAIN_SCALE + 0.5);
}

function clamp(value) {
  return Math.min(Math.max(value, 0), 1);
}

function isWaterMaterialColor(red, green, blue) {
  return red >= 56 && green < 31 && blue < 31;
}
