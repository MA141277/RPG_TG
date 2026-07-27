import type {
  CityStageGrid,
  CityStageLayout,
  ComposedCityStageEntity,
} from "./city-stage-layout-data";

export type CityStageNode = {
  id: string;
  kind: "entrance" | "edge";
  tileX: number;
  tileY: number;
  worldX: number;
  worldY: number;
};

export type CityStageGeometry = {
  blockedTiles: Set<string>;
  entranceNodes: CityStageNode[];
  edgeNodes: CityStageNode[];
  stageWidth: number;
  stageHeight: number;
  baseSpaceWidth: number;
  baseSpaceHeight: number;
  gridCols: number;
  gridRows: number;
  cellWidth: number;
  cellHeight: number;
  originX: number;
  originY: number;
};

export type CityStageAmbientNpcDescriptor = {
  id: string;
  label: string;
  palette: "warm" | "cool" | "neutral";
  speed: number;
  spriteSetId: string;
};

function toTileKey(tileX: number, tileY: number): string {
  return `${tileX},${tileY}`;
}

function gridToPixel(
  tileX: number,
  tileY: number,
  grid: CityStageGrid
): { x: number; y: number } {
  const halfW = grid.cellWidth / 2;
  const halfH = grid.cellHeight / 2;

  return {
    x: grid.originX + (tileX - tileY) * halfW,
    y: grid.originY + (tileX + tileY) * halfH,
  };
}

function shouldBlockEntity(entity: ComposedCityStageEntity): boolean {
  return (
    entity.render?.visible !== false &&
    entity.category !== "ground-decoration"
  );
}

function createEntranceNode(
  entity: ComposedCityStageEntity,
  grid: CityStageGrid
): CityStageNode | null {
  if (!entity.interaction.clickable) {
    return null;
  }

  if (entity.entry.type !== "house" && entity.entry.type !== "city-entry") {
    return null;
  }

  const tileX = Math.max(0, entity.lot.gridX - 1);
  const tileY = Math.min(grid.rows - 1, entity.lot.gridY + entity.lot.rows - 1);
  const bottomLeftCellCenter = gridToPixel(tileX, tileY, grid);

  return {
    id: `entrance:${entity.id}`,
    kind: "entrance",
    tileX,
    tileY,
    worldX: bottomLeftCellCenter.x - grid.cellWidth / 4,
    worldY: bottomLeftCellCenter.y + grid.cellHeight / 4,
  };
}

function createEdgeNodes(layout: CityStageLayout): CityStageNode[] {
  const midCol = Math.floor(layout.grid.cols / 2);
  const midRow = Math.floor(layout.grid.rows / 2);
  const specs = [
    { id: "edge:top", tileX: midCol, tileY: 0 },
    { id: "edge:right", tileX: layout.grid.cols - 1, tileY: midRow },
    { id: "edge:bottom", tileX: midCol, tileY: layout.grid.rows - 1 },
    { id: "edge:left", tileX: 0, tileY: midRow },
  ];

  return specs.map((spec) => {
    const pixel = gridToPixel(spec.tileX, spec.tileY, layout.grid);
    return {
      id: spec.id,
      kind: "edge",
      tileX: spec.tileX,
      tileY: spec.tileY,
      worldX: pixel.x,
      worldY: pixel.y,
    };
  });
}

export function buildCityStageGeometry(layout: CityStageLayout): CityStageGeometry {
  const blockedTiles = new Set<string>();

  for (const entity of layout.entities) {
    if (!shouldBlockEntity(entity)) {
      continue;
    }

    for (let row = 0; row < entity.lot.rows; row += 1) {
      for (let col = 0; col < entity.lot.cols; col += 1) {
        blockedTiles.add(toTileKey(entity.lot.gridX + col, entity.lot.gridY + row));
      }
    }
  }

  return {
    blockedTiles,
    entranceNodes: layout.entities
      .map((entity) => createEntranceNode(entity, layout.grid))
      .filter((node): node is CityStageNode => node != null),
    edgeNodes: createEdgeNodes(layout),
    stageWidth: layout.map.stageWidth,
    stageHeight: layout.map.stageHeight,
    baseSpaceWidth: layout.map.baseSpace.width,
    baseSpaceHeight: layout.map.baseSpace.height,
    gridCols: layout.grid.cols,
    gridRows: layout.grid.rows,
    cellWidth: layout.grid.cellWidth,
    cellHeight: layout.grid.cellHeight,
    originX: layout.grid.originX,
    originY: layout.grid.originY,
  };
}
