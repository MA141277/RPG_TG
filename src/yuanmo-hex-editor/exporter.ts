import type { YuanmoHexEditorPackageData, YuanmoHexEditorState } from "./editor-state";

export const YUANMO_HEX_EDITOR_PACKAGE_FILES = {
  project: "project.json",
  generated: "hex-grid.generated.json",
  waterLandOverrides: "hex-overrides.water-land.json",
  terrainOverrides: "hex-overrides.terrain.json",
  environmentOverrides: "hex-overrides.environment.json",
  settlements: "settlements.json",
  structureOverlays: "structure-overlays.json",
  regions: "regions.json",
} as const;

export function exportEditorPackage(
  state: YuanmoHexEditorState | YuanmoHexEditorPackageData
): Record<string, string> {
  const packageData = toPackageData(state);

  return {
    [YUANMO_HEX_EDITOR_PACKAGE_FILES.project]: stringifyJson(packageData.project),
    [YUANMO_HEX_EDITOR_PACKAGE_FILES.generated]: stringifyJson(packageData.generated),
    [YUANMO_HEX_EDITOR_PACKAGE_FILES.waterLandOverrides]: stringifyJson(
      packageData.waterLandOverrides
    ),
    [YUANMO_HEX_EDITOR_PACKAGE_FILES.terrainOverrides]: stringifyJson(packageData.terrainOverrides),
    [YUANMO_HEX_EDITOR_PACKAGE_FILES.environmentOverrides]: stringifyJson(
      packageData.environmentOverrides
    ),
    [YUANMO_HEX_EDITOR_PACKAGE_FILES.settlements]: stringifyJson(packageData.settlements),
    [YUANMO_HEX_EDITOR_PACKAGE_FILES.structureOverlays]: stringifyJson(
      packageData.structureOverlays
    ),
    [YUANMO_HEX_EDITOR_PACKAGE_FILES.regions]: stringifyJson(packageData.regions),
  };
}

function toPackageData(
  state: YuanmoHexEditorState | YuanmoHexEditorPackageData
): YuanmoHexEditorPackageData {
  return {
    project: state.project,
    generated: state.generated,
    waterLandOverrides: state.waterLandOverrides,
    terrainOverrides: state.terrainOverrides,
    environmentOverrides: state.environmentOverrides,
    settlements: state.settlements,
    structureOverlays: state.structureOverlays,
    regions: state.regions,
  };
}

function stringifyJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}
