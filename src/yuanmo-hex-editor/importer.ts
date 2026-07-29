import type { GeneratedHexGrid } from "./model";
import type { YuanmoHexEditorPackageData, YuanmoHexEditorProjectFile } from "./editor-state";
import { YUANMO_HEX_EDITOR_PACKAGE_FILES } from "./exporter";

export function importEditorPackage(files: Record<string, string>): YuanmoHexEditorPackageData {
  return {
    project: parseRequiredJson<YuanmoHexEditorProjectFile>(
      files,
      YUANMO_HEX_EDITOR_PACKAGE_FILES.project
    ),
    generated: parseRequiredJson<GeneratedHexGrid>(
      files,
      YUANMO_HEX_EDITOR_PACKAGE_FILES.generated
    ),
    waterLandOverrides: parseOptionalJson(files, YUANMO_HEX_EDITOR_PACKAGE_FILES.waterLandOverrides),
    terrainOverrides: parseOptionalJson(files, YUANMO_HEX_EDITOR_PACKAGE_FILES.terrainOverrides),
    environmentOverrides: parseOptionalJson(
      files,
      YUANMO_HEX_EDITOR_PACKAGE_FILES.environmentOverrides
    ),
    settlements: parseOptionalJson(files, YUANMO_HEX_EDITOR_PACKAGE_FILES.settlements),
    structureOverlays: parseOptionalJson(
      files,
      YUANMO_HEX_EDITOR_PACKAGE_FILES.structureOverlays
    ),
    regions: parseOptionalJson(files, YUANMO_HEX_EDITOR_PACKAGE_FILES.regions),
  };
}

function parseRequiredJson<T>(files: Record<string, string>, fileName: string): T {
  const source = files[fileName];
  if (source == null) {
    throw new Error(`Missing Yuanmo Hex Editor package file: ${fileName}`);
  }
  return JSON.parse(source) as T;
}

function parseOptionalJson<T>(files: Record<string, string>, fileName: string): T[] {
  const source = files[fileName];
  if (source == null) {
    return [];
  }
  return JSON.parse(source) as T[];
}
