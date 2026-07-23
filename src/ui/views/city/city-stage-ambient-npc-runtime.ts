import type {
  CityStageAmbientNpcDescriptor,
  CityStageGeometry,
  CityStageNode,
} from "./city-stage-geometry";
import type { CityStageAmbientNpcFacing } from "./city-stage-ambient-npc-sprites";

type CityStageAmbientNpcTilePoint = {
  tileX: number;
  tileY: number;
  worldX: number;
  worldY: number;
};

type CityStageAmbientNpcWalker = {
  descriptor: CityStageAmbientNpcDescriptor;
  id: string;
  path: CityStageAmbientNpcTilePoint[];
  pathIndex: number;
  stepPhase: number;
  x: number;
  y: number;
  facing: CityStageAmbientNpcFacing;
};

export type CityStageAmbientNpcRenderable = {
  id: string;
  x: number;
  y: number;
  bobOffset: number;
  palette: "warm" | "cool" | "neutral";
  sortY: number;
  spriteSetId: string;
  facing: CityStageAmbientNpcFacing;
};

const MIN_AMBIENT_NPC_COUNT = 4;
const MAX_AMBIENT_NPC_COUNT = 8;
const AMBIENT_NPC_BASE_SPEED = 21;
const SPAWN_RETRY_LIMIT = 12;

function toTileKey(tileX: number, tileY: number): string {
  return `${tileX},${tileY}`;
}

function tileToWorld(
  tileX: number,
  tileY: number,
  geometry: CityStageGeometry
): CityStageAmbientNpcTilePoint {
  const halfW = geometry.cellWidth / 2;
  const halfH = geometry.cellHeight / 2;

  return {
    tileX,
    tileY,
    worldX: geometry.originX + (tileX - tileY) * halfW,
    worldY: geometry.originY + (tileX + tileY) * halfH,
  };
}

function isWalkableTile(
  tileX: number,
  tileY: number,
  geometry: CityStageGeometry,
  targetKey: string
): boolean {
  if (
    tileX < 0 ||
    tileY < 0 ||
    tileX >= geometry.gridCols ||
    tileY >= geometry.gridRows
  ) {
    return false;
  }

  const key = toTileKey(tileX, tileY);
  return key === targetKey || !geometry.blockedTiles.has(key);
}

function findTilePath(
  startNode: CityStageNode,
  endNode: CityStageNode,
  geometry: CityStageGeometry
): CityStageAmbientNpcTilePoint[] {
  const startKey = toTileKey(startNode.tileX, startNode.tileY);
  const targetKey = toTileKey(endNode.tileX, endNode.tileY);
  const queue: Array<[number, number]> = [[startNode.tileX, startNode.tileY]];
  const previous = new Map<string, string | null>([[startKey, null]]);

  while (queue.length > 0) {
    const current = queue.shift();
    if (current == null) {
      continue;
    }

    const [tileX, tileY] = current;
    const currentKey = toTileKey(tileX, tileY);
    if (currentKey === targetKey) {
      break;
    }

    const neighbors: Array<[number, number]> = [
      [tileX + 1, tileY],
      [tileX - 1, tileY],
      [tileX, tileY + 1],
      [tileX, tileY - 1],
    ];

    for (const [nextTileX, nextTileY] of neighbors) {
      const nextKey = toTileKey(nextTileX, nextTileY);
      if (previous.has(nextKey)) {
        continue;
      }
      if (!isWalkableTile(nextTileX, nextTileY, geometry, targetKey)) {
        continue;
      }
      previous.set(nextKey, currentKey);
      queue.push([nextTileX, nextTileY]);
    }
  }

  if (!previous.has(targetKey)) {
    return [];
  }

  const path: CityStageAmbientNpcTilePoint[] = [];
  let currentKey: string | null = targetKey;
  while (currentKey != null) {
    const [tileXText, tileYText] = currentKey.split(",");
    const tileX = Number(tileXText);
    const tileY = Number(tileYText);
    path.push(tileToWorld(tileX, tileY, geometry));
    currentKey = previous.get(currentKey) ?? null;
  }

  return path.reverse();
}

function pickRouteNodes(geometry: CityStageGeometry): [CityStageNode, CityStageNode] | null {
  const nodes = [...geometry.edgeNodes, ...geometry.entranceNodes];
  if (nodes.length < 2) {
    return null;
  }

  const startIndex = Math.floor(Math.random() * nodes.length);
  let endIndex = Math.floor(Math.random() * nodes.length);
  if (endIndex === startIndex) {
    endIndex = (endIndex + 1) % nodes.length;
  }

  const startNode = nodes[startIndex];
  const endNode = nodes[endIndex];
  if (startNode == null || endNode == null) {
    return null;
  }

  return [startNode, endNode];
}

function resolveFacingFromDelta(
  deltaX: number,
  deltaY: number,
  fallbackFacing: CityStageAmbientNpcFacing
): CityStageAmbientNpcFacing {
  if (Math.abs(deltaX) < 0.0001 && Math.abs(deltaY) < 0.0001) {
    return fallbackFacing;
  }

  if (deltaY < 0) {
    return deltaX < 0 ? "left-up" : "right-up";
  }

  return deltaX < 0 ? "left-down" : "right-down";
}

function createWalker(
  index: number,
  geometry: CityStageGeometry,
  descriptors: CityStageAmbientNpcDescriptor[]
): CityStageAmbientNpcWalker | null {
  const routeNodes = pickRouteNodes(geometry);
  const descriptor =
    descriptors[Math.floor(Math.random() * descriptors.length)] ??
    descriptors[index % descriptors.length];
  if (routeNodes == null || descriptor == null) {
    return null;
  }

  const path = findTilePath(routeNodes[0], routeNodes[1], geometry);
  const startPoint = path[0];
  if (startPoint == null) {
    return null;
  }

  return {
    descriptor,
    id: `${descriptor.id}-${index}-${Math.floor(Math.random() * 100000)}`,
    path,
    pathIndex: 0,
    stepPhase: Math.random() * Math.PI * 2,
    x: startPoint.worldX,
    y: startPoint.worldY,
    facing: "left-down",
  };
}

export function createCityStageAmbientNpcRuntime(input: {
  geometry: CityStageGeometry;
  descriptors: CityStageAmbientNpcDescriptor[];
}): {
  tick(deltaMs: number): void;
  getRenderables(): CityStageAmbientNpcRenderable[];
  destroy(): void;
} {
  const desiredPopulation =
    MIN_AMBIENT_NPC_COUNT +
    Math.floor(
      Math.random() * (MAX_AMBIENT_NPC_COUNT - MIN_AMBIENT_NPC_COUNT + 1)
    );
  const walkers: CityStageAmbientNpcWalker[] = [];
  let nextWalkerIndex = 0;
  let destroyed = false;

  function replenishPopulation(): void {
    let attempts = 0;
    while (
      !destroyed &&
      walkers.length < desiredPopulation &&
      input.descriptors.length > 0 &&
      attempts < desiredPopulation * SPAWN_RETRY_LIMIT
    ) {
      const walker = createWalker(
        nextWalkerIndex,
        input.geometry,
        input.descriptors
      );
      nextWalkerIndex += 1;
      attempts += 1;
      if (walker == null) {
        continue;
      }
      walkers.push(walker);
    }
  }

  function moveWalker(walker: CityStageAmbientNpcWalker, deltaMs: number): boolean {
    const speed = walker.descriptor.speed * AMBIENT_NPC_BASE_SPEED;
    let remainingDistance = (speed * deltaMs) / 1000;
    walker.stepPhase += (deltaMs / 1000) * walker.descriptor.speed * 7;

    while (remainingDistance > 0) {
      const nextPoint = walker.path[walker.pathIndex + 1];
      if (nextPoint == null) {
        return true;
      }

      const deltaX = nextPoint.worldX - walker.x;
      const deltaY = nextPoint.worldY - walker.y;
      const distance = Math.hypot(deltaX, deltaY);
      walker.facing = resolveFacingFromDelta(deltaX, deltaY, walker.facing);
      if (distance <= remainingDistance) {
        walker.x = nextPoint.worldX;
        walker.y = nextPoint.worldY;
        walker.pathIndex += 1;
        remainingDistance -= distance;
        continue;
      }

      const ratio = remainingDistance / distance;
      walker.x += deltaX * ratio;
      walker.y += deltaY * ratio;
      remainingDistance = 0;
    }

    return false;
  }

  replenishPopulation();

  return {
    tick(deltaMs: number) {
      if (destroyed) {
        return;
      }

      for (let index = walkers.length - 1; index >= 0; index -= 1) {
        const walker = walkers[index];
        if (walker == null) {
          continue;
        }
        if (moveWalker(walker, deltaMs)) {
          walkers.splice(index, 1);
        }
      }

      replenishPopulation();
    },
    getRenderables() {
      return walkers.map((walker) => ({
        id: walker.id,
        x: walker.x,
        y: walker.y,
        bobOffset: 0,
        palette: walker.descriptor.palette,
        sortY: walker.y,
        spriteSetId: walker.descriptor.spriteSetId,
        facing: walker.facing,
      }));
    },
    destroy() {
      destroyed = true;
      walkers.length = 0;
    },
  };
}
