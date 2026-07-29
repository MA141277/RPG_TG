import type {
  CustomSettlementVisualKind,
  SettlementType,
  StructureOverlayCategory,
  YuanmoHexEnvironment,
  YuanmoHexTerrain,
} from "./model";
import {
  YUANMO_FOREST_ENVIRONMENT,
  YUANMO_GRASS_ENVIRONMENT,
  YUANMO_MOUNTAIN_TERRAIN,
  YUANMO_PLAIN_TERRAIN,
} from "./model";

export type EditorToolId =
  | "sampling"
  | "water"
  | "land"
  | "terrain"
  | "environment"
  | "settlement"
  | "structure";

export const editorToolDefinitions: Array<{
  id: EditorToolId;
  label: string;
  hint: string;
}> = [
  {
    id: "sampling",
    label: "采样",
    hint: "先设定源图裁切，再调整采样尺度、步长和偏移后重建基线。",
  },
  {
    id: "water",
    label: "水 / 陆",
    hint: "覆盖自动生成的海岸线与河流结果，把选中六边形改成水域。",
  },
  {
    id: "land",
    label: "陆地",
    hint: "把选中六边形恢复为可通行陆地。",
  },
  {
    id: "terrain",
    label: "地形",
    hint: "覆盖地形结果，当前只区分山脉与平原。",
  },
  {
    id: "environment",
    label: "地貌",
    hint: "覆盖地貌结果，当前只区分草地与森林。",
  },
  {
    id: "settlement",
    label: "城镇节点",
    hint: "放置可进入的城镇节点，当前只编辑名称与类型。",
  },
  {
    id: "structure",
    label: "建筑覆盖",
    hint: "绘制城镇地面、村庄地面和农田覆盖层。",
  },
];

export const terrainOptions: Array<{
  value: YuanmoHexTerrain;
  label: string;
}> = [
  { value: YUANMO_PLAIN_TERRAIN, label: "平原" },
  { value: YUANMO_MOUNTAIN_TERRAIN, label: "山脉" },
];

export const environmentOptions: Array<{
  value: YuanmoHexEnvironment;
  label: string;
}> = [
  { value: YUANMO_GRASS_ENVIRONMENT, label: "草地" },
  { value: YUANMO_FOREST_ENVIRONMENT, label: "森林" },
];

export const settlementTypeOptions: Array<{
  value: SettlementType;
  label: string;
}> = [
  { value: "city", label: "城" },
  { value: "village", label: "村" },
  { value: "custom", label: "自定义" },
];

export const customSettlementVisualOptions: Array<{
  value: CustomSettlementVisualKind;
  label: string;
}> = [
  { value: "city-ground", label: "城镇地面" },
  { value: "village-ground", label: "村庄地面" },
];

export const structureOverlayOptions: Array<{
  value: StructureOverlayCategory;
  label: string;
}> = [
  { value: "city-ground", label: "城镇地面" },
  { value: "village-ground", label: "村庄地面" },
  { value: "farmland", label: "农田" },
];

const editorToolDefinitionById = new Map(
  editorToolDefinitions.map((definition) => [definition.id, definition] as const)
);

export function getEditorToolDefinition(toolId: EditorToolId) {
  const fallbackDefinition = editorToolDefinitions[0];
  if (fallbackDefinition == null) {
    throw new Error("Yuanmo Hex Editor tool definitions are not initialized.");
  }
  return editorToolDefinitionById.get(toolId) ?? fallbackDefinition;
}

export function getTerrainLabel(terrain: YuanmoHexTerrain): string {
  return terrain === YUANMO_MOUNTAIN_TERRAIN ? "山脉" : "平原";
}

export function getEnvironmentLabel(environment: YuanmoHexEnvironment): string {
  return environment === YUANMO_FOREST_ENVIRONMENT ? "森林" : "草地";
}

export function getSettlementTypeLabel(type: SettlementType): string {
  return settlementTypeOptions.find((option) => option.value === type)?.label ?? type;
}

export function getStructureOverlayLabel(
  category: StructureOverlayCategory | CustomSettlementVisualKind
): string {
  return (
    structureOverlayOptions.find((option) => option.value === category)?.label ?? category
  );
}

export function createNextSettlementId(
  name: string,
  type: SettlementType,
  existingIds: string[]
): string {
  const baseId = slugify(name.trim()) || type;
  const prefix = `settlement.${type}.${baseId}`;
  if (!existingIds.includes(prefix)) {
    return prefix;
  }

  let suffix = 2;
  while (existingIds.includes(`${prefix}.${suffix}`)) {
    suffix += 1;
  }
  return `${prefix}.${suffix}`;
}

export function createNextStructureOverlayId(
  category: StructureOverlayCategory,
  existingIds: string[]
): string {
  const prefix = `structure.${category}`;
  if (!existingIds.includes(prefix)) {
    return prefix;
  }

  let suffix = 2;
  while (existingIds.includes(`${prefix}.${suffix}`)) {
    suffix += 1;
  }
  return `${prefix}.${suffix}`;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "");
}
