export type CampaignHexCoordinate = {
  x: number;
  y: number;
};

export type CampaignCoordinateSpace = {
  width: number;
  height: number;
};

export type CampaignMapCoordinate = {
  x: number;
  y: number;
};

export const CAMPAIGN_HEX_TERRAIN_SCALE = 138;
export const CAMPAIGN_HEX_MAP_ASPECT = 1.1285;

export const CAMPAIGN_HEX_CORNER_OFFSETS = [
  { x: 0, y: -1 },
  { x: Math.sqrt(3) / 2, y: -0.5 },
  { x: Math.sqrt(3) / 2, y: 0.5 },
  { x: 0, y: 1 },
  { x: -Math.sqrt(3) / 2, y: 0.5 },
  { x: -Math.sqrt(3) / 2, y: -0.5 },
] as const;

export const CAMPAIGN_HEX_NEIGHBOR_DIRECTIONS = [
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 1 },
  { x: -1, y: 0 },
] as const;

export function getCampaignHexCellKey(x: number, y: number): string {
  return `${x},${y}`;
}

export function campaignHexToPixel(hex: CampaignHexCoordinate): CampaignMapCoordinate {
  return {
    x: Math.sqrt(3) * (hex.x + hex.y * 0.5),
    y: 1.5 * hex.y,
  };
}

export function campaignPixelToRoundedHex(
  x: number,
  y: number
): CampaignHexCoordinate {
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

export function campaignTerrainUvToHexPoint(
  u: number,
  v: number
): CampaignMapCoordinate {
  return {
    x: (u - 0.5) * CAMPAIGN_HEX_MAP_ASPECT * CAMPAIGN_HEX_TERRAIN_SCALE,
    y: (v - 0.5) * CAMPAIGN_HEX_TERRAIN_SCALE,
  };
}

export function campaignHexPointToTerrainU(x: number): number {
  return clamp(x / (CAMPAIGN_HEX_MAP_ASPECT * CAMPAIGN_HEX_TERRAIN_SCALE) + 0.5);
}

export function campaignHexPointToTerrainV(y: number): number {
  return clamp(y / CAMPAIGN_HEX_TERRAIN_SCALE + 0.5);
}

export function campaignTerrainUvToHex(u: number, v: number): CampaignHexCoordinate {
  const hexPoint = campaignTerrainUvToHexPoint(u, v);
  return campaignPixelToRoundedHex(hexPoint.x, hexPoint.y);
}

export function campaignMapCoordinateToTerrainUv(
  coordinate: CampaignMapCoordinate,
  coordinateSpace: CampaignCoordinateSpace
): { u: number; v: number } {
  return {
    u: clamp(coordinate.x / Math.max(coordinateSpace.width, 1)),
    v: clamp(1 - coordinate.y / Math.max(coordinateSpace.height, 1)),
  };
}

export function campaignMapCoordinateToHex(
  coordinate: CampaignMapCoordinate,
  coordinateSpace: CampaignCoordinateSpace
): CampaignHexCoordinate {
  const uv = campaignMapCoordinateToTerrainUv(coordinate, coordinateSpace);
  return campaignTerrainUvToHex(uv.u, uv.v);
}

export function getCampaignHexRing(
  center: CampaignHexCoordinate,
  radius: number
): CampaignHexCoordinate[] {
  if (radius <= 0) {
    return [{ ...center }];
  }

  let cursor = {
    x: center.x + CAMPAIGN_HEX_NEIGHBOR_DIRECTIONS[4].x * radius,
    y: center.y + CAMPAIGN_HEX_NEIGHBOR_DIRECTIONS[4].y * radius,
  };
  const ring: CampaignHexCoordinate[] = [];

  for (const direction of CAMPAIGN_HEX_NEIGHBOR_DIRECTIONS) {
    for (let step = 0; step < radius; step += 1) {
      ring.push({ ...cursor });
      cursor = {
        x: cursor.x + direction.x,
        y: cursor.y + direction.y,
      };
    }
  }

  return ring;
}

export function getCampaignHexDisc(
  center: CampaignHexCoordinate,
  radius: number
): CampaignHexCoordinate[] {
  const cells = [{ ...center }];

  for (let ringRadius = 1; ringRadius <= radius; ringRadius += 1) {
    cells.push(...getCampaignHexRing(center, ringRadius));
  }

  return cells;
}

export function getCampaignHexCells(): CampaignHexCoordinate[] {
  const mapMinX = -CAMPAIGN_HEX_MAP_ASPECT * CAMPAIGN_HEX_TERRAIN_SCALE * 0.5;
  const mapMaxX = CAMPAIGN_HEX_MAP_ASPECT * CAMPAIGN_HEX_TERRAIN_SCALE * 0.5;
  const mapMinY = -CAMPAIGN_HEX_TERRAIN_SCALE * 0.5;
  const mapMaxY = CAMPAIGN_HEX_TERRAIN_SCALE * 0.5;
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
  const cells: CampaignHexCoordinate[] = [];

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

function clamp(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}
