import {
  campaignMapCoordinateToHex,
  campaignHexPointToTerrainU,
  campaignHexPointToTerrainV,
  campaignHexToPixel,
  getCampaignHexCellKey,
  type CampaignCoordinateSpace,
  type CampaignHexCoordinate,
  type CampaignMapCoordinate,
} from "../domain/campaign-hex";
import type { CampaignHexGridCell, CampaignHexGridDefinition } from "../domain/map";
import type {
  EnvironmentOverride,
  GeneratedHexCell,
  GeneratedHexGrid,
  TerrainOverride,
  WaterLandOverride,
} from "./model";

type RuntimeGridEditorOverlayMetadata = {
  source: "yuanmo-hex-editor";
  projection: "source-position-to-runtime-hex" | "editor-grid-one-to-one-runtime-hex";
  editorCellsApplied: number;
  runtimeCellsChanged: number;
  settlementCellsApplied?: number;
};

export type RuntimeCampaignHexGridFromEditor = CampaignHexGridDefinition & {
  source: CampaignHexGridDefinition["source"] & {
    editorOverlay: RuntimeGridEditorOverlayMetadata;
  };
};

export type RuntimeGridExportInput = {
  runtimeGrid: CampaignHexGridDefinition;
  editorGenerated: GeneratedHexGrid;
  waterLandOverrides?: WaterLandOverride[];
  terrainOverrides?: TerrainOverride[];
  environmentOverrides?: EnvironmentOverride[];
  settlementAnchors?: RuntimeSettlementAnchor[];
};

export type RuntimeSettlementAnchor = {
  id: string;
  name?: string;
  type?: string;
  mapPosition: CampaignMapCoordinate;
  hexCell?: CampaignHexCoordinate;
};

type RuntimeCellBucket = {
  runtimeCell: CampaignHexGridCell;
  editorCells: GeneratedHexCell[];
};

type OneToOneRuntimeGridTransform = {
  offsetX: number;
  offsetY: number;
};

export function mapEditorSourcePositionToRuntimeHex(
  sourcePosition: { x: number; y: number },
  coordinateSpace: CampaignCoordinateSpace,
  sourceCrop?: { x: number; y: number; width: number; height: number }
): CampaignHexCoordinate {
  if (sourceCrop != null) {
    return campaignMapCoordinateToHex(
      {
        x: sourcePosition.x - sourceCrop.x,
        y: sourceCrop.height - (sourcePosition.y - sourceCrop.y),
      },
      {
        width: sourceCrop.width,
        height: sourceCrop.height,
      }
    );
  }

  return campaignMapCoordinateToHex(
    {
      x: sourcePosition.x,
      y: coordinateSpace.height - sourcePosition.y,
    },
    coordinateSpace
  );
}

export function mapEditorGameCoordinateToRuntimeHex(
  mapPosition: CampaignMapCoordinate,
  coordinateSpace: CampaignCoordinateSpace,
  sourceCrop?: { x: number; y: number; width: number; height: number }
): CampaignHexCoordinate {
  if (sourceCrop != null) {
    const sourcePosition = {
      x: mapPosition.x,
      y: coordinateSpace.height - mapPosition.y,
    };

    return mapEditorSourcePositionToRuntimeHex(sourcePosition, coordinateSpace, sourceCrop);
  }

  return campaignMapCoordinateToHex(mapPosition, coordinateSpace);
}

export function mapRuntimeHexToGameCoordinate(
  hex: CampaignHexCoordinate,
  coordinateSpace: CampaignCoordinateSpace,
  hexCoordinateSystem?: Pick<
    CampaignHexGridDefinition["coordinateSystem"],
    "hexTerrainScale" | "hexMapAspect" | "hexPointBounds"
  >
): CampaignMapCoordinate {
  const point = campaignHexToPixel(hex);
  const hexPointBounds = hexCoordinateSystem?.hexPointBounds ?? null;
  const u =
    hexCoordinateSystem == null
      ? campaignHexPointToTerrainU(point.x)
      : hexPointBounds == null
        ? clamp01(
            point.x /
              Math.max(hexCoordinateSystem.hexMapAspect * hexCoordinateSystem.hexTerrainScale, 1) +
              0.5
          )
        : clamp01(
            (point.x - hexPointBounds.minX) /
              Math.max(hexPointBounds.maxX - hexPointBounds.minX, 1)
          );
  const terrainV =
    hexCoordinateSystem == null
      ? campaignHexPointToTerrainV(point.y)
      : hexPointBounds == null
        ? clamp01(point.y / Math.max(hexCoordinateSystem.hexTerrainScale, 1) + 0.5)
        : clamp01(
            (point.y - hexPointBounds.minY) /
              Math.max(hexPointBounds.maxY - hexPointBounds.minY, 1)
          );

  return {
    x: u * coordinateSpace.width,
    y: (1 - terrainV) * coordinateSpace.height,
  };
}

export function createOneToOneRuntimeCampaignHexGridFromEditorPackage(
  input: RuntimeGridExportInput
): RuntimeCampaignHexGridFromEditor {
  const transform = createOneToOneRuntimeGridTransform(input.editorGenerated);
  const coordinateSystem = createOneToOneRuntimeCoordinateSystem(
    input.editorGenerated,
    input.runtimeGrid,
    transform
  );
  const resolvedEditorCells = resolveEditorCells(input);
  const cellsByRuntimeKey = new Map<string, CampaignHexGridCell>();
  let editorCellsApplied = 0;

  for (const editorCell of resolvedEditorCells) {
    const runtimeHex = mapEditorCellToOneToOneRuntimeHex(editorCell, transform);
    cellsByRuntimeKey.set(getCampaignHexCellKey(runtimeHex.x, runtimeHex.y), {
      x: runtimeHex.x,
      y: runtimeHex.y,
      land: editorCell.land,
      referenceHeight: editorCell.land ? editorCell.referenceHeight : 0,
      terrain: editorCell.terrain,
      environment: editorCell.environment,
    });
    editorCellsApplied += 1;
  }

  for (const settlement of input.settlementAnchors ?? []) {
    const runtimeHex =
      settlement.hexCell == null
        ? mapEditorGameCoordinateToOneToOneRuntimeHex(
            settlement.mapPosition,
            input.editorGenerated,
            input.runtimeGrid,
            transform
          )
        : mapEditorHexCellToOneToOneRuntimeHex(settlement.hexCell, input.editorGenerated, transform);
    const key = getCampaignHexCellKey(runtimeHex.x, runtimeHex.y);
    const current = cellsByRuntimeKey.get(key);
    if (current == null || current.land) {
      continue;
    }
    cellsByRuntimeKey.set(key, {
      ...current,
      land: true,
      referenceHeight: Math.max(current.referenceHeight, 0.15),
    });
  }

  const cells = [...cellsByRuntimeKey.values()].sort((left, right) =>
    left.y === right.y ? left.x - right.x : left.y - right.y
  );

  return {
    ...input.runtimeGrid,
    coordinateSystem,
    source: {
      ...input.runtimeGrid.source,
      editorOverlay: {
        source: "yuanmo-hex-editor",
        projection: "editor-grid-one-to-one-runtime-hex",
        editorCellsApplied,
        runtimeCellsChanged: cells.length,
        settlementCellsApplied: input.settlementAnchors?.length ?? 0,
      },
    },
    bounds: calculateRuntimeBounds(cells),
    counts: countRuntimeCells(cells),
    cells,
  };
}

export function mapEditorSourcePositionToOneToOneRuntimeHex(
  sourcePosition: { x: number; y: number },
  editorGenerated: GeneratedHexGrid
): CampaignHexCoordinate | null {
  const transform = createOneToOneRuntimeGridTransform(editorGenerated);
  const editorCell = findNearestEditorCellToSourcePosition(editorGenerated.cells, sourcePosition);
  if (editorCell == null) {
    return null;
  }

  return mapEditorCellToOneToOneRuntimeHex(editorCell, transform);
}

export function mapEditorGameCoordinateToOneToOneRuntimeHex(
  mapPosition: CampaignMapCoordinate,
  editorGenerated: GeneratedHexGrid,
  runtimeGrid: CampaignHexGridDefinition,
  transform = createOneToOneRuntimeGridTransform(editorGenerated)
): CampaignHexCoordinate {
  const sourcePosition = {
    x: mapPosition.x,
    y: runtimeGrid.coordinateSystem.coordinateSpace.height - mapPosition.y,
  };
  const editorCell =
    findNearestEditorCellToSourcePosition(editorGenerated.cells, sourcePosition) ??
    findNearestEditorCellToSourcePosition(
      editorGenerated.cells,
      clampSourcePositionToCrop(sourcePosition, editorGenerated.generation.sourceCrop)
    );

  if (editorCell == null) {
    return { x: 0, y: 0 };
  }

  return mapEditorCellToOneToOneRuntimeHex(editorCell, transform);
}

export function mapEditorHexCellToOneToOneRuntimeHex(
  hexCell: CampaignHexCoordinate,
  editorGenerated: GeneratedHexGrid,
  transform = createOneToOneRuntimeGridTransform(editorGenerated)
): CampaignHexCoordinate {
  const editorCellsByKey = new Map(
    editorGenerated.cells.map((cell) => [
      getCampaignHexCellKey(cell.x, cell.y),
      cell,
    ])
  );
  const editorCell =
    editorCellsByKey.get(getCampaignHexCellKey(hexCell.x, hexCell.y)) ?? hexCell;

  return mapEditorCellToOneToOneRuntimeHex(editorCell, transform);
}

function createOneToOneRuntimeGridTransform(
  editorGenerated: GeneratedHexGrid
): OneToOneRuntimeGridTransform {
  return {
    offsetX: Math.round((editorGenerated.bounds.minX + editorGenerated.bounds.maxX) / 2),
    offsetY: Math.round((editorGenerated.bounds.minY + editorGenerated.bounds.maxY) / 2),
  };
}

function mapEditorCellToOneToOneRuntimeHex(
  editorCell: Pick<GeneratedHexCell, "x" | "y">,
  transform: OneToOneRuntimeGridTransform
): CampaignHexCoordinate {
  const centeredHex = {
    x: editorCell.x - transform.offsetX,
    y: editorCell.y - transform.offsetY,
  };

  // The editor samples source-image rows downward, while axial hex pixels use +y upward
  // in the current renderer path. Mirror in axial space without shearing rows.
  return {
    x: centeredHex.x + centeredHex.y,
    y: -centeredHex.y,
  };
}

function createOneToOneRuntimeCoordinateSystem(
  editorGenerated: GeneratedHexGrid,
  runtimeGrid: CampaignHexGridDefinition,
  transform: OneToOneRuntimeGridTransform
): CampaignHexGridDefinition["coordinateSystem"] {
  const centeredCells = editorGenerated.cells.map((cell) =>
    mapEditorCellToOneToOneRuntimeHex(cell, transform)
  );
  const pixelBounds = calculateHexPixelBounds(centeredCells);
  const hexRadiusX = Math.sqrt(3) * 0.5;
  const hexRadiusY = 1;

  return {
    ...runtimeGrid.coordinateSystem,
    hexMapAspect: runtimeGrid.coordinateSystem.hexMapAspect,
    hexTerrainScale: runtimeGrid.coordinateSystem.hexTerrainScale,
    hexPointBounds: {
      minX: roundCoordinateScale(pixelBounds.minX - hexRadiusX),
      maxX: roundCoordinateScale(pixelBounds.maxX + hexRadiusX),
      minY: roundCoordinateScale(pixelBounds.minY - hexRadiusY),
      maxY: roundCoordinateScale(pixelBounds.maxY + hexRadiusY),
    },
  };
}

function findNearestEditorCellToSourcePosition(
  cells: GeneratedHexCell[],
  sourcePosition: { x: number; y: number }
): GeneratedHexCell | null {
  let bestCell: GeneratedHexCell | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const cell of cells) {
    if (cell.sourcePosition == null) {
      continue;
    }
    const distance =
      (cell.sourcePosition.x - sourcePosition.x) ** 2 +
      (cell.sourcePosition.y - sourcePosition.y) ** 2;
    if (distance < bestDistance) {
      bestDistance = distance;
      bestCell = cell;
    }
  }

  return bestCell;
}

function clampSourcePositionToCrop(
  sourcePosition: { x: number; y: number },
  sourceCrop?: { x: number; y: number; width: number; height: number }
): { x: number; y: number } {
  if (sourceCrop == null) {
    return sourcePosition;
  }

  return {
    x: Math.min(Math.max(sourcePosition.x, sourceCrop.x), sourceCrop.x + sourceCrop.width),
    y: Math.min(Math.max(sourcePosition.y, sourceCrop.y), sourceCrop.y + sourceCrop.height),
  };
}

function calculateHexPixelBounds(cells: CampaignHexCoordinate[]): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
  if (cells.length === 0) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  }

  const points = cells.map((cell) => campaignHexToPixel(cell));

  return {
    minX: Math.min(...points.map((point) => point.x)),
    maxX: Math.max(...points.map((point) => point.x)),
    minY: Math.min(...points.map((point) => point.y)),
    maxY: Math.max(...points.map((point) => point.y)),
  };
}

export function createRuntimeCampaignHexGridFromEditorPackage(
  input: RuntimeGridExportInput
): RuntimeCampaignHexGridFromEditor {
  const runtimeCellsByKey = new Map(
    input.runtimeGrid.cells.map((cell) => [getCampaignHexCellKey(cell.x, cell.y), cell] as const)
  );
  const resolvedEditorCells = resolveEditorCells(input);
  const editorCellsByKey = new Map(
    input.editorGenerated.cells.map((cell) => [getCampaignHexCellKey(cell.x, cell.y), cell] as const)
  );
  const sourceCrop = input.editorGenerated.generation.sourceCrop;
  const bucketsByRuntimeCellKey = new Map<string, RuntimeCellBucket>();
  const hardOverridesByRuntimeCellKey = resolveHardRuntimeOverrides({
    input,
    editorCellsByKey,
    sourceCrop,
  });
  const settlementLandByRuntimeCellKey = resolveSettlementLandRuntimeCells({
    input,
    sourceCrop,
  });
  let editorCellsApplied = 0;

  for (const editorCell of resolvedEditorCells) {
    if (editorCell.sourcePosition == null) {
      continue;
    }

    const runtimeHex = mapEditorSourcePositionToRuntimeHex(
      editorCell.sourcePosition,
      input.runtimeGrid.coordinateSystem.coordinateSpace,
      sourceCrop
    );
    const runtimeKey = getCampaignHexCellKey(runtimeHex.x, runtimeHex.y);
    const runtimeCell = runtimeCellsByKey.get(runtimeKey);
    if (runtimeCell == null) {
      continue;
    }

    const bucket = bucketsByRuntimeCellKey.get(runtimeKey) ?? {
      runtimeCell,
      editorCells: [],
    };
    bucket.editorCells.push(editorCell);
    bucketsByRuntimeCellKey.set(runtimeKey, bucket);
    editorCellsApplied += 1;
  }

  let runtimeCellsChanged = 0;
  const cells = input.runtimeGrid.cells.map((runtimeCell) => {
    const bucket = bucketsByRuntimeCellKey.get(getCampaignHexCellKey(runtimeCell.x, runtimeCell.y));
    const mergedCell = bucket == null
      ? { ...runtimeCell }
      : mergeEditorBucketIntoRuntimeCell(bucket, input.runtimeGrid.defaults);
    const hardOverride = hardOverridesByRuntimeCellKey.get(
      getCampaignHexCellKey(runtimeCell.x, runtimeCell.y)
    );
    const settlementLand = settlementLandByRuntimeCellKey.get(
      getCampaignHexCellKey(runtimeCell.x, runtimeCell.y)
    );
    const finalCell = applyRuntimeCellHardOverride(
      applyRuntimeCellSettlementLand(mergedCell, settlementLand, input.runtimeGrid.defaults),
      hardOverride,
      input.runtimeGrid.defaults
    );

    if (!areCampaignHexCellsEqual(runtimeCell, finalCell)) {
      runtimeCellsChanged += 1;
    }
    return finalCell;
  });

  return {
    ...input.runtimeGrid,
    source: {
      ...input.runtimeGrid.source,
      editorOverlay: {
        source: "yuanmo-hex-editor",
        projection: "source-position-to-runtime-hex",
        editorCellsApplied,
        runtimeCellsChanged,
        settlementCellsApplied: settlementLandByRuntimeCellKey.size,
      },
    },
    counts: countRuntimeCells(cells),
    cells,
  };
}

type RuntimeCellHardOverride = {
  land?: boolean;
  referenceHeight?: number;
  terrain?: string;
  environment?: string;
};

function resolveHardRuntimeOverrides(input: {
  input: RuntimeGridExportInput;
  editorCellsByKey: Map<string, GeneratedHexCell>;
  sourceCrop?: { x: number; y: number; width: number; height: number };
}): Map<string, RuntimeCellHardOverride> {
  const overridesByRuntimeKey = new Map<string, RuntimeCellHardOverride>();

  for (const override of input.input.waterLandOverrides ?? []) {
    const editorCell = input.editorCellsByKey.get(getCampaignHexCellKey(override.x, override.y));
    const runtimeKey = getEditorCellRuntimeKey(
      editorCell,
      input.input.runtimeGrid.coordinateSystem.coordinateSpace,
      input.sourceCrop
    );
    if (runtimeKey == null) {
      continue;
    }
    const current = overridesByRuntimeKey.get(runtimeKey) ?? {};
    const next: RuntimeCellHardOverride = {
      ...current,
      land: override.land,
    };
    if (override.land) {
      const referenceHeight = editorCell?.referenceHeight ?? current.referenceHeight;
      if (referenceHeight != null) {
        next.referenceHeight = referenceHeight;
      }
    } else {
      next.referenceHeight = 0;
    }
    if (override.land && editorCell?.terrain != null) {
      next.terrain = editorCell.terrain;
    } else if (current.terrain != null) {
      next.terrain = current.terrain;
    }
    if (override.land && editorCell?.environment != null) {
      next.environment = editorCell.environment;
    } else if (current.environment != null) {
      next.environment = current.environment;
    }
    overridesByRuntimeKey.set(runtimeKey, next);
  }

  for (const override of input.input.terrainOverrides ?? []) {
    const editorCell = input.editorCellsByKey.get(getCampaignHexCellKey(override.x, override.y));
    const runtimeKey = getEditorCellRuntimeKey(
      editorCell,
      input.input.runtimeGrid.coordinateSystem.coordinateSpace,
      input.sourceCrop
    );
    if (runtimeKey == null) {
      continue;
    }
    const current = overridesByRuntimeKey.get(runtimeKey) ?? {};
    overridesByRuntimeKey.set(runtimeKey, { ...current, terrain: override.terrain });
  }

  for (const override of input.input.environmentOverrides ?? []) {
    const editorCell = input.editorCellsByKey.get(getCampaignHexCellKey(override.x, override.y));
    const runtimeKey = getEditorCellRuntimeKey(
      editorCell,
      input.input.runtimeGrid.coordinateSystem.coordinateSpace,
      input.sourceCrop
    );
    if (runtimeKey == null) {
      continue;
    }
    const current = overridesByRuntimeKey.get(runtimeKey) ?? {};
    overridesByRuntimeKey.set(runtimeKey, { ...current, environment: override.environment });
  }

  return overridesByRuntimeKey;
}

function getEditorCellRuntimeKey(
  editorCell: GeneratedHexCell | undefined,
  coordinateSpace: CampaignCoordinateSpace,
  sourceCrop?: { x: number; y: number; width: number; height: number }
): string | null {
  if (editorCell?.sourcePosition == null) {
    return null;
  }

  const runtimeHex = mapEditorSourcePositionToRuntimeHex(
    editorCell.sourcePosition,
    coordinateSpace,
    sourceCrop
  );
  return getCampaignHexCellKey(runtimeHex.x, runtimeHex.y);
}

function resolveSettlementLandRuntimeCells(input: {
  input: RuntimeGridExportInput;
  sourceCrop?: { x: number; y: number; width: number; height: number };
}): Map<string, RuntimeSettlementAnchor> {
  const settlementsByRuntimeKey = new Map<string, RuntimeSettlementAnchor>();

  for (const settlement of input.input.settlementAnchors ?? []) {
    const runtimeHex = mapEditorGameCoordinateToRuntimeHex(
      settlement.mapPosition,
      input.input.runtimeGrid.coordinateSystem.coordinateSpace,
      input.sourceCrop
    );
    settlementsByRuntimeKey.set(
      getCampaignHexCellKey(runtimeHex.x, runtimeHex.y),
      settlement
    );
  }

  return settlementsByRuntimeKey;
}

function applyRuntimeCellSettlementLand(
  cell: CampaignHexGridCell,
  settlement: RuntimeSettlementAnchor | undefined,
  defaults: CampaignHexGridDefinition["defaults"]
): CampaignHexGridCell {
  if (settlement == null || cell.land) {
    return cell;
  }

  return {
    ...cell,
    land: true,
    referenceHeight: Math.max(cell.referenceHeight, 0.02),
    terrain: cell.terrain || defaults.terrain,
    environment: cell.environment || defaults.environment,
  };
}

function applyRuntimeCellHardOverride(
  cell: CampaignHexGridCell,
  override: RuntimeCellHardOverride | undefined,
  defaults: CampaignHexGridDefinition["defaults"]
): CampaignHexGridCell {
  if (override == null) {
    return cell;
  }

  const land = override.land ?? cell.land;
  if (!land) {
    return {
      ...cell,
      land: false,
      referenceHeight: 0,
      terrain: defaults.terrain,
      environment: defaults.environment,
    };
  }

  return {
    ...cell,
    land: true,
    referenceHeight: roundReferenceHeight(override.referenceHeight ?? cell.referenceHeight),
    terrain: override.terrain ?? cell.terrain,
    environment: override.environment ?? cell.environment,
  };
}

function resolveEditorCells(input: RuntimeGridExportInput): GeneratedHexCell[] {
  const waterLandByKey = new Map(
    (input.waterLandOverrides ?? []).map((override) => [
      getCampaignHexCellKey(override.x, override.y),
      override,
    ])
  );
  const terrainByKey = new Map(
    (input.terrainOverrides ?? []).map((override) => [
      getCampaignHexCellKey(override.x, override.y),
      override,
    ])
  );
  const environmentByKey = new Map(
    (input.environmentOverrides ?? []).map((override) => [
      getCampaignHexCellKey(override.x, override.y),
      override,
    ])
  );

  return input.editorGenerated.cells.map((cell) => {
    const key = getCampaignHexCellKey(cell.x, cell.y);
    const waterLandOverride = waterLandByKey.get(key);
    const terrainOverride = terrainByKey.get(key);
    const environmentOverride = environmentByKey.get(key);
    const land = waterLandOverride?.land ?? cell.land;

    return {
      ...cell,
      land,
      referenceHeight: land ? cell.referenceHeight : 0,
      terrain: terrainOverride?.terrain ?? cell.terrain,
      environment: environmentOverride?.environment ?? cell.environment,
    };
  });
}

function mergeEditorBucketIntoRuntimeCell(
  bucket: RuntimeCellBucket,
  defaults: CampaignHexGridDefinition["defaults"]
): CampaignHexGridCell {
  const landSamples = bucket.editorCells.filter((cell) => cell.land);
  const land = landSamples.length >= Math.ceil(bucket.editorCells.length * 0.5);
  if (!land) {
    return {
      ...bucket.runtimeCell,
      land: false,
      referenceHeight: 0,
      terrain: defaults.terrain,
      environment: defaults.environment,
    };
  }

  return {
    ...bucket.runtimeCell,
    land: true,
    referenceHeight: roundReferenceHeight(average(landSamples.map((cell) => cell.referenceHeight))),
    terrain: mostCommonString(landSamples.map((cell) => cell.terrain), bucket.runtimeCell.terrain),
    environment: mostCommonString(
      landSamples.map((cell) => cell.environment),
      bucket.runtimeCell.environment
    ),
  };
}

function mostCommonString(values: string[], fallback: string): string {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  let bestValue = fallback;
  let bestCount = 0;
  for (const [value, count] of counts) {
    if (count > bestCount) {
      bestValue = value;
      bestCount = count;
    }
  }
  return bestValue;
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function roundReferenceHeight(value: number): number {
  return Number(Math.min(Math.max(value, 0), 1).toFixed(6));
}

function roundCoordinateScale(value: number): number {
  return Number(value.toFixed(6));
}

function clamp01(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

function calculateRuntimeBounds(cells: CampaignHexGridCell[]): CampaignHexGridDefinition["bounds"] {
  if (cells.length === 0) {
    return {
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0,
    };
  }

  return {
    minX: Math.min(...cells.map((cell) => cell.x)),
    maxX: Math.max(...cells.map((cell) => cell.x)),
    minY: Math.min(...cells.map((cell) => cell.y)),
    maxY: Math.max(...cells.map((cell) => cell.y)),
  };
}

function countRuntimeCells(cells: CampaignHexGridCell[]): CampaignHexGridDefinition["counts"] {
  const terrains: NonNullable<CampaignHexGridDefinition["counts"]["terrains"]> = {};
  const environments: NonNullable<CampaignHexGridDefinition["counts"]["environments"]> = {};
  const counts: CampaignHexGridDefinition["counts"] = {
    cells: cells.length,
    landCells: 0,
    waterCells: 0,
    terrains,
    environments,
  };

  for (const cell of cells) {
    if (cell.land) {
      counts.landCells += 1;
    } else {
      counts.waterCells += 1;
    }
    terrains[cell.terrain] = (terrains[cell.terrain] ?? 0) + 1;
    environments[cell.environment] = (environments[cell.environment] ?? 0) + 1;
  }

  return counts;
}

function areCampaignHexCellsEqual(
  left: CampaignHexGridCell,
  right: CampaignHexGridCell
): boolean {
  return (
    left.x === right.x &&
    left.y === right.y &&
    left.land === right.land &&
    left.referenceHeight === right.referenceHeight &&
    left.terrain === right.terrain &&
    left.environment === right.environment
  );
}
