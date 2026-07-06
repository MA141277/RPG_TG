export type GridCoordinate = {
  x: number;
  y: number;
};

export type HexCoordinate = {
  x: number;
  y: number;
};

export type CoordinateSpace = {
  width: number;
  height: number;
};

export type HexTravelBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

export type HexTravelGrid = {
  passableHexKeys: ReadonlySet<string>;
  bounds: HexTravelBounds;
};

const HEX_TERRAIN_SCALE = 138;
const HEX_MAP_ASPECT = 1.1285;
const HEX_NEIGHBOR_DIRECTIONS = [
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 1 },
  { x: -1, y: 0 },
] as const;

export function travelToCoordinate(
  _currentCoordinate: GridCoordinate,
  targetCoordinate: GridCoordinate
): GridCoordinate {
  return {
    x: targetCoordinate.x,
    y: targetCoordinate.y,
  };
}

export function createHexTravelPath(input: {
  currentCoordinate: GridCoordinate;
  targetCoordinate: GridCoordinate;
  coordinateSpace: CoordinateSpace;
}): GridCoordinate[] {
  const startHex = coordinateToRoundedHex(
    input.currentCoordinate,
    input.coordinateSpace
  );
  const targetHex = coordinateToRoundedHex(
    input.targetCoordinate,
    input.coordinateSpace
  );
  const hexPath = createHexLinePath(startHex, targetHex);

  if (hexPath.length === 0) {
    return [input.currentCoordinate];
  }

  if (hexPath.length === 1) {
    if (getCoordinateDistance(input.currentCoordinate, input.targetCoordinate) < 0.001) {
      return [input.currentCoordinate];
    }

    return [input.currentCoordinate, input.targetCoordinate];
  }

  return hexPath.map((hex, index) => {
    if (index === 0) {
      return input.currentCoordinate;
    }

    if (index === hexPath.length - 1) {
      return input.targetCoordinate;
    }

    return hexToCoordinate(hex, input.coordinateSpace);
  });
}

export function createPassableHexTravelPath(input: {
  currentCoordinate: GridCoordinate;
  targetCoordinate: GridCoordinate;
  coordinateSpace: CoordinateSpace;
  travelGrid: HexTravelGrid;
}): GridCoordinate[] | null {
  const startHex = coordinateToRoundedHex(
    input.currentCoordinate,
    input.coordinateSpace
  );
  const targetHex = coordinateToRoundedHex(
    input.targetCoordinate,
    input.coordinateSpace
  );
  const hexPath = createPassableHexPath({
    startHex,
    targetHex,
    travelGrid: input.travelGrid,
  });

  if (hexPath == null) {
    return null;
  }

  return mapHexPathToCoordinates({
    hexPath,
    currentCoordinate: input.currentCoordinate,
    targetCoordinate: input.targetCoordinate,
    coordinateSpace: input.coordinateSpace,
  });
}

export function snapCoordinateToHexCenter(
  coordinate: GridCoordinate,
  coordinateSpace: CoordinateSpace
): GridCoordinate {
  return hexToCoordinate(
    coordinateToRoundedHex(coordinate, coordinateSpace),
    coordinateSpace
  );
}

export function coordinateToRoundedHex(
  coordinate: GridCoordinate,
  coordinateSpace: CoordinateSpace
): HexCoordinate {
  const terrainPoint = coordinateToHexTerrainPoint(coordinate, coordinateSpace);
  return pixelToRoundedHex(terrainPoint.x, terrainPoint.y);
}

export function hexToCoordinate(
  hex: HexCoordinate,
  coordinateSpace: CoordinateSpace
): GridCoordinate {
  const point = hexToPixel(hex);
  const u = clamp(point.x / (HEX_MAP_ASPECT * HEX_TERRAIN_SCALE) + 0.5, 0, 1);
  const terrainV = clamp(point.y / HEX_TERRAIN_SCALE + 0.5, 0, 1);

  return {
    x: u * coordinateSpace.width,
    y: (1 - terrainV) * coordinateSpace.height,
  };
}

function createHexLinePath(start: HexCoordinate, target: HexCoordinate): HexCoordinate[] {
  const distance = getHexDistance(start, target);
  if (distance === 0) {
    return [start];
  }

  const path: HexCoordinate[] = [];
  for (let step = 0; step <= distance; step += 1) {
    const ratio = step / distance;
    const rounded = roundCubeCoordinate({
      x: start.x + (target.x - start.x) * ratio,
      y: start.y + (target.y - start.y) * ratio,
      z: -start.x - start.y + (-target.x - target.y + start.x + start.y) * ratio,
    });
    const previous = path[path.length - 1];
    if (previous == null || previous.x !== rounded.x || previous.y !== rounded.y) {
      path.push(rounded);
    }
  }

  return path;
}

function createPassableHexPath(input: {
  startHex: HexCoordinate;
  targetHex: HexCoordinate;
  travelGrid: HexTravelGrid;
}): HexCoordinate[] | null {
  if (
    !isHexWithinBounds(input.startHex, input.travelGrid.bounds) ||
    !isHexWithinBounds(input.targetHex, input.travelGrid.bounds) ||
    !input.travelGrid.passableHexKeys.has(getHexKey(input.startHex)) ||
    !input.travelGrid.passableHexKeys.has(getHexKey(input.targetHex))
  ) {
    return null;
  }

  const startKey = getHexKey(input.startHex);
  const targetKey = getHexKey(input.targetHex);
  const openKeys = new Set([startKey]);
  const cameFrom = new Map<string, string>();
  const coordinateByKey = new Map<string, HexCoordinate>([
    [startKey, input.startHex],
    [targetKey, input.targetHex],
  ]);
  const gScore = new Map<string, number>([[startKey, 0]]);
  const fScore = new Map<string, number>([
    [startKey, getHexDistance(input.startHex, input.targetHex)],
  ]);

  while (openKeys.size > 0) {
    const currentKey = selectLowestScoreKey(openKeys, fScore);
    const current = coordinateByKey.get(currentKey);
    if (current == null) {
      openKeys.delete(currentKey);
      continue;
    }

    if (currentKey === targetKey) {
      return reconstructHexPath(cameFrom, coordinateByKey, currentKey);
    }

    openKeys.delete(currentKey);
    for (const neighbor of getHexNeighbors(current)) {
      if (
        !isHexWithinBounds(neighbor, input.travelGrid.bounds) ||
        !input.travelGrid.passableHexKeys.has(getHexKey(neighbor))
      ) {
        continue;
      }

      const neighborKey = getHexKey(neighbor);
      const nextGScore = (gScore.get(currentKey) ?? Number.POSITIVE_INFINITY) + 1;
      if (nextGScore >= (gScore.get(neighborKey) ?? Number.POSITIVE_INFINITY)) {
        continue;
      }

      coordinateByKey.set(neighborKey, neighbor);
      cameFrom.set(neighborKey, currentKey);
      gScore.set(neighborKey, nextGScore);
      fScore.set(neighborKey, nextGScore + getHexDistance(neighbor, input.targetHex));
      openKeys.add(neighborKey);
    }
  }

  return null;
}

function mapHexPathToCoordinates(input: {
  hexPath: HexCoordinate[];
  currentCoordinate: GridCoordinate;
  targetCoordinate: GridCoordinate;
  coordinateSpace: CoordinateSpace;
}): GridCoordinate[] {
  if (input.hexPath.length === 0) {
    return [input.currentCoordinate];
  }

  if (input.hexPath.length === 1) {
    if (getCoordinateDistance(input.currentCoordinate, input.targetCoordinate) < 0.001) {
      return [input.currentCoordinate];
    }

    return [input.currentCoordinate, input.targetCoordinate];
  }

  return input.hexPath.map((hex, index) => {
    if (index === 0) {
      return input.currentCoordinate;
    }

    if (index === input.hexPath.length - 1) {
      return input.targetCoordinate;
    }

    return hexToCoordinate(hex, input.coordinateSpace);
  });
}

function getHexDistance(start: HexCoordinate, target: HexCoordinate): number {
  return Math.max(
    Math.abs(start.x - target.x),
    Math.abs(start.y - target.y),
    Math.abs(-start.x - start.y + target.x + target.y)
  );
}

function getHexNeighbors(hex: HexCoordinate): HexCoordinate[] {
  return HEX_NEIGHBOR_DIRECTIONS.map((direction) => ({
    x: hex.x + direction.x,
    y: hex.y + direction.y,
  }));
}

function selectLowestScoreKey(
  keys: ReadonlySet<string>,
  scoreByKey: ReadonlyMap<string, number>
): string {
  let bestKey = "";
  let bestScore = Number.POSITIVE_INFINITY;
  for (const key of keys) {
    const score = scoreByKey.get(key) ?? Number.POSITIVE_INFINITY;
    if (score < bestScore) {
      bestKey = key;
      bestScore = score;
    }
  }

  return bestKey;
}

function reconstructHexPath(
  cameFrom: ReadonlyMap<string, string>,
  coordinateByKey: ReadonlyMap<string, HexCoordinate>,
  targetKey: string
): HexCoordinate[] {
  const path: HexCoordinate[] = [];
  let currentKey: string | undefined = targetKey;
  while (currentKey != null) {
    const coordinate = coordinateByKey.get(currentKey);
    if (coordinate == null) {
      break;
    }

    path.push(coordinate);
    currentKey = cameFrom.get(currentKey);
  }

  return path.reverse();
}

function isHexWithinBounds(hex: HexCoordinate, bounds: HexTravelBounds): boolean {
  return (
    hex.x >= bounds.minX &&
    hex.x <= bounds.maxX &&
    hex.y >= bounds.minY &&
    hex.y <= bounds.maxY
  );
}

function coordinateToHexTerrainPoint(
  coordinate: GridCoordinate,
  coordinateSpace: CoordinateSpace
): GridCoordinate {
  const u = coordinate.x / Math.max(coordinateSpace.width, 1);
  const terrainV = 1 - coordinate.y / Math.max(coordinateSpace.height, 1);

  return {
    x: (u - 0.5) * HEX_MAP_ASPECT * HEX_TERRAIN_SCALE,
    y: (terrainV - 0.5) * HEX_TERRAIN_SCALE,
  };
}

function hexToPixel(hex: HexCoordinate): GridCoordinate {
  return {
    x: Math.sqrt(3) * (hex.x + hex.y * 0.5),
    y: 1.5 * hex.y,
  };
}

function pixelToRoundedHex(x: number, y: number): HexCoordinate {
  const axialX = 0.5773503 * x - 0.3333333 * y;
  const axialY = 0.6666667 * y;

  return roundCubeCoordinate({
    x: axialX,
    y: axialY,
    z: -axialX - axialY,
  });
}

function roundCubeCoordinate(cube: {
  x: number;
  y: number;
  z: number;
}): HexCoordinate {
  let roundedX = Math.floor(cube.x + 0.5);
  let roundedY = Math.floor(cube.y + 0.5);
  let roundedZ = Math.floor(cube.z + 0.5);
  const diffX = Math.abs(roundedX - cube.x);
  const diffY = Math.abs(roundedY - cube.y);
  const diffZ = Math.abs(roundedZ - cube.z);

  if (diffX > diffY && diffX > diffZ) {
    roundedX = -roundedY - roundedZ;
  } else if (diffY > diffZ) {
    roundedY = -roundedX - roundedZ;
  } else {
    roundedZ = -roundedX - roundedY;
  }

  return { x: roundedX, y: roundedY };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getCoordinateDistance(left: GridCoordinate, right: GridCoordinate): number {
  return Math.hypot(left.x - right.x, left.y - right.y);
}

export function getHexKey(hex: HexCoordinate): string {
  return `${hex.x},${hex.y}`;
}

export function areHexNeighbors(left: HexCoordinate, right: HexCoordinate): boolean {
  return HEX_NEIGHBOR_DIRECTIONS.some(
    (direction) =>
      left.x + direction.x === right.x && left.y + direction.y === right.y
  );
}
