import type {
  CoordinateSpace,
  GridCoordinate,
  HexCoordinateSystem,
} from "../navigation/travel-to-coordinate";
import { coordinateToRoundedHex } from "../navigation/travel-to-coordinate";
import type { MapDefinition, MapNode } from "../../domain/map";

type CampaignMapNodeHitInput = {
  mapDefinition: MapDefinition;
  coordinate: GridCoordinate;
  coordinateSystem?: HexCoordinateSystem;
};

export function resolveCampaignMapNodeAtCoordinate(
  input: CampaignMapNodeHitInput
): MapNode | null {
  const coordinateSpace = getCampaignCoordinateSpace(input.mapDefinition);
  if (coordinateSpace == null) {
    return null;
  }

  const targetHex = coordinateToRoundedHex(
    input.coordinate,
    coordinateSpace,
    input.coordinateSystem
  );
  let bestNode: MapNode | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const node of input.mapDefinition.nodes) {
    const nodeHex = coordinateToRoundedHex(
      { x: node.x, y: node.y },
      coordinateSpace,
      input.coordinateSystem
    );
    if (nodeHex.x !== targetHex.x || nodeHex.y !== targetHex.y) {
      continue;
    }

    const distance = Math.hypot(node.x - input.coordinate.x, node.y - input.coordinate.y);
    const bestNodeHasCity = bestNode?.cityId != null;
    const nodeHasCity = node.cityId != null;
    if (
      bestNode == null ||
      (nodeHasCity && !bestNodeHasCity) ||
      (nodeHasCity === bestNodeHasCity && distance < bestDistance)
    ) {
      bestNode = node;
      bestDistance = distance;
    }
  }

  return bestNode;
}

function getCampaignCoordinateSpace(
  mapDefinition: MapDefinition
): CoordinateSpace | null {
  if (mapDefinition.mode !== "campaign" || mapDefinition.coordinateSpace == null) {
    return null;
  }

  return mapDefinition.coordinateSpace;
}
