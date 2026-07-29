import {
  YUANMO_FOREST_ENVIRONMENT,
  YUANMO_GRASS_ENVIRONMENT,
  YUANMO_MOUNTAIN_TERRAIN,
  YUANMO_PLAIN_TERRAIN,
  type StructureOverlayCategory,
} from "./model";
import type { YuanmoHexEditorState } from "./editor-state";

const SUPPORTED_SETTLEMENT_TYPES = new Set(["city", "village", "custom"]);
const KNOWN_TERRAINS = new Set([YUANMO_PLAIN_TERRAIN, YUANMO_MOUNTAIN_TERRAIN]);
const KNOWN_ENVIRONMENTS = new Set([YUANMO_GRASS_ENVIRONMENT, YUANMO_FOREST_ENVIRONMENT]);
const KNOWN_STRUCTURE_OVERLAY_CATEGORIES = new Set<StructureOverlayCategory>([
  "city-ground",
  "village-ground",
  "farmland",
]);

type ValidationSettlement = {
  id: string;
  name: string;
  type: string;
  hexCell: {
    x: number;
    y: number;
  };
};

type ValidationTerrainOverride = {
  x: number;
  y: number;
  terrain: string;
};

type ValidationEnvironmentOverride = {
  x: number;
  y: number;
  environment: string;
};

type ValidationStructureOverlay = {
  id: string;
  category: string;
};

export type ValidationIssue = {
  code:
    | "settlement-name-required"
    | "settlement-id-required"
    | "settlement-id-duplicate"
    | "settlement-type-unsupported"
    | "settlement-on-resolved-water"
    | "terrain-category-unknown"
    | "environment-category-unknown"
    | "structure-overlay-category-unknown";
  severity: "error";
  message: string;
  entityId?: string;
};

export function validateEditorProject(
  state: Pick<YuanmoHexEditorState, "resolved"> & {
    settlements: ValidationSettlement[];
    terrainOverrides: ValidationTerrainOverride[];
    environmentOverrides: ValidationEnvironmentOverride[];
    structureOverlays: ValidationStructureOverlay[];
  }
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const settlementIdCounts = new Map<string, number>();

  for (const settlement of state.settlements) {
    if (settlement.name.trim().length === 0) {
      issues.push({
        code: "settlement-name-required",
        severity: "error",
        message: `节点 "${settlement.id}" 必须填写名称。`,
        entityId: settlement.id,
      });
    }

    const normalizedId = settlement.id.trim();
    if (normalizedId.length === 0) {
      issues.push({
        code: "settlement-id-required",
        severity: "error",
        message: "节点 ID 不能为空。",
      });
    } else {
      settlementIdCounts.set(normalizedId, (settlementIdCounts.get(normalizedId) ?? 0) + 1);
    }

    if (!SUPPORTED_SETTLEMENT_TYPES.has(settlement.type)) {
      issues.push({
        code: "settlement-type-unsupported",
        severity: "error",
        message: `节点 "${settlement.id}" 使用了不支持的类型 "${settlement.type}"。`,
        entityId: settlement.id,
      });
    }

    const resolvedCell = state.resolved.cellsByKey.get(`${settlement.hexCell.x},${settlement.hexCell.y}`);
    if (resolvedCell == null || resolvedCell.land !== true) {
      issues.push({
        code: "settlement-on-resolved-water",
        severity: "error",
        message: `节点 "${settlement.id}" 位于水域结果上。`,
        entityId: settlement.id,
      });
    }
  }

  for (const [settlementId, count] of settlementIdCounts.entries()) {
    if (count > 1) {
      issues.push({
        code: "settlement-id-duplicate",
        severity: "error",
        message: `节点 ID "${settlementId}" 必须唯一。`,
        entityId: settlementId,
      });
    }
  }

  for (const override of state.terrainOverrides) {
    if (!KNOWN_TERRAINS.has(override.terrain)) {
      issues.push({
        code: "terrain-category-unknown",
        severity: "error",
        message: `${override.x},${override.y} 使用了未知地形 "${override.terrain}"。`,
      });
    }
  }

  for (const override of state.environmentOverrides) {
    if (!KNOWN_ENVIRONMENTS.has(override.environment)) {
      issues.push({
        code: "environment-category-unknown",
        severity: "error",
        message: `${override.x},${override.y} 使用了未知地貌 "${override.environment}"。`,
      });
    }
  }

  for (const overlay of state.structureOverlays) {
    if (!KNOWN_STRUCTURE_OVERLAY_CATEGORIES.has(overlay.category as StructureOverlayCategory)) {
      issues.push({
        code: "structure-overlay-category-unknown",
        severity: "error",
        message: `建筑覆盖层 "${overlay.id}" 使用了未知类别 "${overlay.category}"。`,
        entityId: overlay.id,
      });
    }
  }

  return issues;
}
