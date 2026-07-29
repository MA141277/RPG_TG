import type {
  EnvironmentOverride,
  GeneratedHexGrid,
  RegionRecord,
  ResolvedHexSemanticState,
  SettlementRecord,
  StructureOverlayRecord,
  TerrainOverride,
  WaterLandOverride,
  YuanmoHexRasterSource,
  YuanmoHexRasterLayerData,
  YuanmoHexEditorProject,
  YuanmoHexSamplingConfig,
} from "./model";
import type { MapNode } from "../domain/map";
import { generateBaselineHexGrid } from "./generator";
import { createRegionsFromSourceMap } from "./region-mapping";
import { resolveHexSemanticState } from "./resolver";
import { createSettlementsFromMapNodes } from "./settlement-mapping";
import {
  createDefaultYuanmoHexEditorProject,
  getYuanmoEditorSourceHexGrid,
  normalizeYuanmoHexSamplingConfig,
} from "./yuanmo-source";

export const YUANMO_HEX_EDITOR_RULE_VERSION = "yuanmo-hex-editor-v1";

export type YuanmoHexEditorSourceAssets = {
  terrainSourceImagePath: string;
  heightSourceImagePath: string | null;
  environmentSourceImagePath: string | null;
};

export type YuanmoHexEditorUiState = {
  activeToolId: string;
  selectedSettlementId: string | null;
  selectedHexCell: { x: number; y: number } | null;
  showValidationOverlay: boolean;
};

export type YuanmoHexEditorGenerationMetadata = {
  ruleVersion: string;
  generatedAt: string;
  sampling: YuanmoHexSamplingConfig;
};

export type YuanmoHexEditorProjectFile = YuanmoHexEditorProject & {
  sourceAssets: YuanmoHexEditorSourceAssets;
  uiState: YuanmoHexEditorUiState;
  generationMetadata: YuanmoHexEditorGenerationMetadata;
};

export type YuanmoHexEditorPackageData = {
  project: YuanmoHexEditorProjectFile;
  generated: GeneratedHexGrid;
  waterLandOverrides: WaterLandOverride[];
  terrainOverrides: TerrainOverride[];
  environmentOverrides: EnvironmentOverride[];
  settlements: SettlementRecord[];
  structureOverlays: StructureOverlayRecord[];
  regions: RegionRecord[];
};

export type YuanmoHexEditorState = YuanmoHexEditorPackageData & {
  resolved: ResolvedHexSemanticState;
};

type EditorStateBuildOptions = {
  sourceMapNodes?: MapNode[];
  regionRaster?: YuanmoHexRasterLayerData | null;
};

export function createEditorState(
  options: EditorStateBuildOptions = {}
): YuanmoHexEditorState {
  return createEditorStateFromPackageData({}, options);
}

export function createEditorStateFromPackageData(
  packageData: Partial<YuanmoHexEditorPackageData> & {
    project?: Partial<YuanmoHexEditorProjectFile>;
  },
  options: EditorStateBuildOptions = {}
): YuanmoHexEditorState {
  const project = buildProjectFile(packageData.project);
  const generated = packageData.generated ?? generateBaselineHexGrid(project.sampling);
  const settlements =
    packageData.settlements ??
    createSettlementsFromSourceMapNodes(options.sourceMapNodes, generated);
  const regions =
    packageData.regions ??
    createRegionsFromSourceMap({
      generated,
      regionRaster: options.regionRaster ?? null,
      nodes: options.sourceMapNodes ?? [],
    });

  return buildState({
    project,
    generated,
    waterLandOverrides: cloneArray(packageData.waterLandOverrides),
    terrainOverrides: cloneArray(packageData.terrainOverrides),
    environmentOverrides: cloneArray(packageData.environmentOverrides),
    settlements: cloneArray(settlements),
    structureOverlays: cloneArray(packageData.structureOverlays),
    regions: cloneArray(regions),
  });
}

export function regenerateEditorState(
  state: YuanmoHexEditorState,
  nextSampling: YuanmoHexSamplingConfig = state.project.sampling,
  rasterSource?: YuanmoHexRasterSource | null,
  options: EditorStateBuildOptions = {}
): YuanmoHexEditorState {
  const sampling = normalizeYuanmoHexSamplingConfig(nextSampling);
  const generated = generateBaselineHexGrid(sampling, rasterSource);
  const project = {
    ...state.project,
    sampling,
    generationMetadata: createGenerationMetadata(sampling),
  };

  return buildState({
    project,
    generated,
    waterLandOverrides: cloneArray(state.waterLandOverrides),
    terrainOverrides: cloneArray(state.terrainOverrides),
    environmentOverrides: cloneArray(state.environmentOverrides),
    settlements: createSettlementsFromSourceMapNodes(options.sourceMapNodes, generated),
    structureOverlays: cloneArray(state.structureOverlays),
    regions: createRegionsFromSourceMap({
      generated,
      regionRaster: options.regionRaster ?? null,
      nodes: options.sourceMapNodes ?? [],
    }),
  });
}

function buildState(packageData: YuanmoHexEditorPackageData): YuanmoHexEditorState {
  const resolved = resolveHexSemanticState({
    generated: packageData.generated,
    waterLandOverrides: packageData.waterLandOverrides,
    terrainOverrides: packageData.terrainOverrides,
    environmentOverrides: packageData.environmentOverrides,
    settlements: packageData.settlements,
    structureOverlays: packageData.structureOverlays,
  });

  return {
    ...packageData,
    resolved,
  };
}

function buildProjectFile(
  projectOverride: Partial<YuanmoHexEditorProjectFile> | undefined
): YuanmoHexEditorProjectFile {
  const defaultProject = createDefaultProjectFile();
  const sampling = normalizeYuanmoHexSamplingConfig(
    projectOverride?.sampling ?? defaultProject.sampling
  );

  return {
    ...defaultProject,
    ...projectOverride,
    sampling,
    sourceAssets: {
      ...defaultProject.sourceAssets,
      ...projectOverride?.sourceAssets,
    },
    uiState: {
      ...defaultProject.uiState,
      ...projectOverride?.uiState,
    },
    generationMetadata: {
      ...defaultProject.generationMetadata,
      ...projectOverride?.generationMetadata,
      sampling:
        projectOverride?.generationMetadata?.sampling == null
          ? sampling
          : normalizeYuanmoHexSamplingConfig(projectOverride.generationMetadata.sampling),
    },
  };
}

function createDefaultProjectFile(): YuanmoHexEditorProjectFile {
  const baseProject = createDefaultYuanmoHexEditorProject();

  return {
    ...baseProject,
    sourceAssets: getSourceAssets(),
    uiState: {
      activeToolId: "sampling",
      selectedSettlementId: null,
      selectedHexCell: null,
      showValidationOverlay: false,
    },
    generationMetadata: createGenerationMetadata(baseProject.sampling),
  };
}

function createGenerationMetadata(
  sampling: YuanmoHexSamplingConfig
): YuanmoHexEditorGenerationMetadata {
  return {
    ruleVersion: YUANMO_HEX_EDITOR_RULE_VERSION,
    generatedAt: new Date().toISOString(),
    sampling,
  };
}

function getSourceAssets(): YuanmoHexEditorSourceAssets {
  const source = getYuanmoEditorSourceHexGrid();
  return {
    terrainSourceImagePath: source.source.sourceImage.path,
    heightSourceImagePath: source.source.heightSampler?.sourceImage.path ?? null,
    environmentSourceImagePath: source.source.environmentSampler?.sourceImage.path ?? null,
  };
}

function cloneArray<T>(value: T[] | undefined): T[] {
  return value == null ? [] : value.map((entry) => structuredClone(entry));
}

function createSettlementsFromSourceMapNodes(
  sourceMapNodes: MapNode[] | undefined,
  generated: GeneratedHexGrid
): SettlementRecord[] {
  if (sourceMapNodes == null) {
    return [];
  }

  return createSettlementsFromMapNodes({
    nodes: sourceMapNodes,
    generated,
    sourceCrop: generated.generation.sourceCrop,
  });
}
