import type { MapNode } from "../domain/map";
import type {
  GeneratedHexCell,
  GeneratedHexGrid,
  SettlementRecord,
  YuanmoHexSamplingConfig,
} from "./model";
import { YUANMO_SOURCE_COORDINATE_SPACE } from "./yuanmo-source";

type SettlementMappingInput = {
  nodes: MapNode[];
  generated: GeneratedHexGrid;
  sourceCrop: YuanmoHexSamplingConfig["sourceCrop"];
};

export function createSettlementsFromMapNodes(
  input: SettlementMappingInput
): SettlementRecord[] {
  const usedHexKeys = new Set<string>();
  const settlements: SettlementRecord[] = [];

  for (const node of input.nodes) {
    const sourcePoint = mapNodeToVisibleSourcePoint(node);
    if (!isSettlementNode(node) || !isPointInsideCrop(sourcePoint, input.sourceCrop)) {
      continue;
    }

    const nearestCell = findNearestGeneratedCell(sourcePoint, input.generated.cells, usedHexKeys);
    if (nearestCell == null) {
      continue;
    }

    usedHexKeys.add(getCellKey(nearestCell));
    settlements.push({
      id: node.id ?? `settlement.${settlements.length + 1}`,
      name: node.label ?? node.id ?? `节点 ${settlements.length + 1}`,
      type: getSettlementType(node),
      mapPosition: {
        x: node.x,
        y: node.y,
      },
      hexCell: {
        x: nearestCell.x,
        y: nearestCell.y,
      },
    });
  }

  return settlements;
}

function isSettlementNode(node: MapNode): boolean {
  return node.kind === "settlement" || node.kind === "city" || node.cityId != null;
}

function mapNodeToVisibleSourcePoint(node: MapNode): { x: number; y: number } {
  return {
    x: node.x,
    y: YUANMO_SOURCE_COORDINATE_SPACE.height - node.y,
  };
}

function isPointInsideCrop(
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

function findNearestGeneratedCell(
  point: { x: number; y: number },
  cells: GeneratedHexCell[],
  usedHexKeys: ReadonlySet<string>
): GeneratedHexCell | null {
  let nearestCell: GeneratedHexCell | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const cell of cells) {
    if (cell.sourcePosition == null || usedHexKeys.has(getCellKey(cell))) {
      continue;
    }

    const distance =
      (cell.sourcePosition.x - point.x) * (cell.sourcePosition.x - point.x) +
      (cell.sourcePosition.y - point.y) * (cell.sourcePosition.y - point.y);
    if (distance < nearestDistance) {
      nearestCell = cell;
      nearestDistance = distance;
    }
  }

  return nearestCell;
}

function getSettlementType(node: MapNode): SettlementRecord["type"] {
  if (node.summary?.includes("Level: village")) {
    return "village";
  }
  return "city";
}

function getCellKey(cell: { x: number; y: number }): string {
  return `${cell.x},${cell.y}`;
}
