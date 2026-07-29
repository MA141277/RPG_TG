import { getCampaignHexCellKey } from "../domain/campaign-hex";
import type { CampaignHexGridCell, CampaignHexGridDefinition } from "../domain/map";
import sourceHexGrid from "../content/scenario-packs/zhuyuanzhang/assets/maps/yuanmo-campaign-hex-grid.json";
import type {
  YuanmoHexEditorProject,
  YuanmoHexSamplingConfig,
  YuanmoSourceCropRect,
} from "./model";

const yuanmoSourceHexGrid = sourceHexGrid as CampaignHexGridDefinition;
export const YUANMO_SOURCE_COORDINATE_SPACE = { width: 509, height: 451 } as const;
const sourceCellsByKey = new Map(
  yuanmoSourceHexGrid.cells.map((cell) => [getCampaignHexCellKey(cell.x, cell.y), cell] as const)
);

export function getYuanmoEditorSourceHexGrid(): CampaignHexGridDefinition {
  return yuanmoSourceHexGrid;
}

export function getYuanmoEditorSourceCell(x: number, y: number): CampaignHexGridCell | null {
  return sourceCellsByKey.get(getCampaignHexCellKey(x, y)) ?? null;
}

export function createDefaultYuanmoHexSamplingConfig(): YuanmoHexSamplingConfig {
  return {
    scale: 1,
    step: 1,
    offsetX: 0,
    offsetY: 0,
    sourceCrop: createDefaultYuanmoSourceCropRect(),
  };
}

export function createDefaultYuanmoHexEditorProject(): YuanmoHexEditorProject {
  return {
    mapId: yuanmoSourceHexGrid.mapId,
    sampling: createDefaultYuanmoHexSamplingConfig(),
  };
}

export function normalizeYuanmoHexSamplingConfig(
  sampling: YuanmoHexSamplingConfig
): YuanmoHexSamplingConfig {
  return {
    scale: normalizeScale(sampling.scale),
    step: normalizeStep(sampling.step),
    offsetX: normalizeOffset(sampling.offsetX),
    offsetY: normalizeOffset(sampling.offsetY),
    sourceCrop: normalizeSourceCrop(sampling.sourceCrop),
  };
}

export function createDefaultYuanmoSourceCropRect(): YuanmoSourceCropRect {
  return {
    x: 0,
    y: 0,
    width: YUANMO_SOURCE_COORDINATE_SPACE.width,
    height: YUANMO_SOURCE_COORDINATE_SPACE.height,
  };
}

function normalizeScale(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }
  return Math.max(0.1, value);
}

function normalizeStep(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }
  return Math.max(0.1, Number(value.toFixed(3)));
}

function normalizeOffset(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return value;
}

function normalizeSourceCrop(value: YuanmoSourceCropRect | undefined): YuanmoSourceCropRect {
  const full = createDefaultYuanmoSourceCropRect();
  const x = clampFiniteNumber(value?.x, full.x, 0, full.width - 1);
  const y = clampFiniteNumber(value?.y, full.y, 0, full.height - 1);
  const requestedWidth = normalizeCropExtent(value?.width, full.width);
  const requestedHeight = normalizeCropExtent(value?.height, full.height);

  return {
    x,
    y,
    width: Math.min(requestedWidth, full.width - x),
    height: Math.min(requestedHeight, full.height - y),
  };
}

function normalizeCropExtent(value: number | undefined, fallback: number): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(1, Math.round(value as number));
}

function clampFiniteNumber(
  value: number | undefined,
  fallback: number,
  min: number,
  max: number
): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, Math.round(value as number)));
}
