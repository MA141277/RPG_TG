import { getCampaignHexCellKey } from "../domain/campaign-hex";
import type {
  ResolveHexSemanticInput,
  ResolvedHexCell,
  ResolvedHexPassability,
  ResolvedHexSemanticState,
  ResolvedHexVisualState,
  SettlementRecord,
  StructureGround,
} from "./model";

export function resolveHexSemanticState(
  input: ResolveHexSemanticInput
): ResolvedHexSemanticState {
  const cellsByKey = new Map<string, ResolvedHexCell>();

  for (const generatedCell of input.generated.cells) {
    const key = getCampaignHexCellKey(generatedCell.x, generatedCell.y);
    cellsByKey.set(key, {
      ...generatedCell,
      key,
      structureGround: null,
      overlays: [],
      settlementId: null,
      settlementType: null,
    });
  }

  for (const override of input.waterLandOverrides) {
    const cell = cellsByKey.get(getCampaignHexCellKey(override.x, override.y));
    if (cell != null) {
      cell.land = override.land;
    }
  }

  for (const override of input.terrainOverrides) {
    const cell = cellsByKey.get(getCampaignHexCellKey(override.x, override.y));
    if (cell != null) {
      cell.terrain = override.terrain;
    }
  }

  for (const override of input.environmentOverrides) {
    const cell = cellsByKey.get(getCampaignHexCellKey(override.x, override.y));
    if (cell != null) {
      cell.environment = override.environment;
    }
  }

  for (const settlement of input.settlements) {
    const cell = cellsByKey.get(getCampaignHexCellKey(settlement.hexCell.x, settlement.hexCell.y));
    if (cell == null) {
      continue;
    }
    cell.structureGround = getSettlementStructureGround(settlement);
    cell.settlementId = settlement.id;
    cell.settlementType = settlement.type;
  }

  for (const overlay of input.structureOverlays) {
    for (const overlayCell of overlay.cells) {
      const cell = cellsByKey.get(getCampaignHexCellKey(overlayCell.x, overlayCell.y));
      if (cell == null) {
        continue;
      }
      if (!cell.overlays.includes(overlay.category)) {
        cell.overlays.push(overlay.category);
      }
      if (overlay.category === "city-ground" || overlay.category === "village-ground") {
        cell.structureGround = overlay.category;
      }
    }
  }

  const cells = [...cellsByKey.values()];
  const landByCellKey = new Map<string, boolean>();
  const terrainByCellKey = new Map<ResolvedHexCell["key"], ResolvedHexCell["terrain"]>();
  const environmentByCellKey = new Map<ResolvedHexCell["key"], ResolvedHexCell["environment"]>();
  const structureGroundByCellKey = new Map<string, StructureGround>();
  const passabilityByCellKey = new Map<string, ResolvedHexPassability>();
  const visualStateByCellKey = new Map<string, ResolvedHexVisualState>();

  for (const cell of cells) {
    landByCellKey.set(cell.key, cell.land);
    terrainByCellKey.set(cell.key, cell.terrain);
    environmentByCellKey.set(cell.key, cell.environment);
    structureGroundByCellKey.set(cell.key, cell.structureGround);
    passabilityByCellKey.set(cell.key, {
      isPassable: cell.land,
      blockingReason: cell.land ? null : "water",
    });
    visualStateByCellKey.set(cell.key, {
      land: cell.land,
      terrain: cell.terrain,
      environment: cell.environment,
      structureGround: cell.structureGround,
      settlementId: cell.settlementId,
      settlementType: cell.settlementType,
    });
  }

  return {
    cells,
    cellsByKey,
    landByCellKey,
    terrainByCellKey,
    environmentByCellKey,
    structureGroundByCellKey,
    passabilityByCellKey,
    visualStateByCellKey,
  };
}

function getSettlementStructureGround(settlement: SettlementRecord): StructureGround {
  if (settlement.type === "village") {
    return "village-ground";
  }
  if (settlement.type === "custom") {
    return settlement.customVisualKind ?? "village-ground";
  }
  return "city-ground";
}
