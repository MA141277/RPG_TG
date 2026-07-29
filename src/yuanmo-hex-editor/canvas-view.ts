import { hexToCoordinatePolygon } from "../application/navigation/travel-to-coordinate";
import {
  campaignMapCoordinateToHex,
  getCampaignHexCellKey,
  type CampaignCoordinateSpace,
} from "../domain/campaign-hex";
import type { ValidationIssue } from "./validation";
import type { YuanmoHexEditorState } from "./editor-state";
import type { GeneratedHexGrid, RegionRecord, YuanmoHexSamplingConfig } from "./model";
import type { YuanmoHexEditorViewBox } from "./viewport-camera";

type CanvasViewInput = {
  mode: "crop" | "sampling" | "edit";
  viewportMode: "source-map" | "hex-fit" | "manual-hex";
  manualViewBox: YuanmoHexEditorViewBox | null;
  state: YuanmoHexEditorState;
  coordinateSpace: CampaignCoordinateSpace;
  sourceImage: HTMLImageElement | null;
  sourceImageOverlay: boolean;
  regionOverlay: boolean;
  sourceCropPreview: YuanmoHexEditorState["project"]["sampling"]["sourceCrop"];
  sampling: YuanmoHexSamplingConfig;
  previewGeneratedGrid: GeneratedHexGrid | null;
  selectedHexKey: string | null;
  showValidationOverlay: boolean;
  validationIssues: ValidationIssue[];
};

type CanvasViewport = {
  coordinateSpace: CampaignCoordinateSpace;
  canvasWidth: number;
  canvasHeight: number;
  drawWidth: number;
  drawHeight: number;
  offsetX: number;
  offsetY: number;
  viewBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  sourceHexRadius: number;
  hitCells: CanvasHexCell[];
};

type CanvasHit = {
  hexCell: { x: number; y: number };
  cellKey: string;
};

type CanvasHexCell =
  | YuanmoHexEditorState["resolved"]["cells"][number]
  | GeneratedHexGrid["cells"][number];

const canvasViewportByElement = new WeakMap<HTMLCanvasElement, CanvasViewport>();
const BASE_HEX_SOURCE_RADIUS_DIVISOR = 138;

export function drawYuanmoHexEditorCanvas(
  canvas: HTMLCanvasElement,
  input: CanvasViewInput
): void {
  const context = canvas.getContext("2d");
  if (context == null) {
    throw new Error("Canvas 2D context is unavailable.");
  }

  const visibleCells =
    input.mode === "crop"
      ? []
      : input.mode === "sampling" && input.previewGeneratedGrid != null
        ? input.previewGeneratedGrid.cells
        : input.state.resolved.cells;
  const sourceHexRadius = getVisualSourceHexRadius(input.coordinateSpace, input.sampling);
  const viewport = syncCanvasViewport(
    canvas,
    input.coordinateSpace,
    getCanvasViewBox(input, visibleCells, sourceHexRadius),
    sourceHexRadius,
    visibleCells
  );
  const invalidSettlementIds = new Set(
    input.showValidationOverlay
      ? input.validationIssues
          .filter((issue) => issue.entityId != null)
          .map((issue) => issue.entityId as string)
      : []
  );

  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#f0e6d0";
  context.fillRect(0, 0, canvas.width, canvas.height);

  if (input.sourceImage != null && input.mode === "crop") {
    context.save();
    context.globalAlpha = 0.78;
    const sourceViewBox = createSourceMapViewBox(input.coordinateSpace);
    const topLeft = projectPoint(viewport, sourceViewBox.x, sourceViewBox.y);
    const bottomRight = projectPoint(
      viewport,
      sourceViewBox.x + sourceViewBox.width,
      sourceViewBox.y + sourceViewBox.height
    );
    context.drawImage(input.sourceImage, topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
    context.restore();
  }

  if (input.mode === "crop") {
    drawSourceCropOverlay(context, viewport, input.sourceCropPreview);
    return;
  }

  if (input.sourceImage != null && input.sourceImageOverlay) {
    drawSourceImageCropOverlay(
      context,
      viewport,
      input.sourceImage,
      input.sourceCropPreview
    );
  }

  for (const cell of visibleCells) {
    drawResolvedCell(context, viewport, cell, input.selectedHexKey);
  }

  if (input.mode === "edit") {
    const visibleCellsByKey = new Map(
      visibleCells.map((cell) => [getCampaignHexCellKey(cell.x, cell.y), cell])
    );
    if (input.regionOverlay) {
      const regionByCellKey = createRegionByCellKey(input.state.regions);
      drawRegionOverlayCells(context, viewport, visibleCells, regionByCellKey);
      drawRegionLabels(context, viewport, input.state.regions, visibleCellsByKey);
    }

    for (const settlement of input.state.settlements) {
      drawSettlement(context, viewport, settlement, invalidSettlementIds, visibleCellsByKey);
    }
  }
}

export function hitTestHexCell(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number
): CanvasHit | null {
  const viewport = canvasViewportByElement.get(canvas);
  if (viewport == null) {
    return null;
  }

  const mapCoordinate = clientPointToMapCoordinate(canvas, viewport, clientX, clientY, false);
  if (mapCoordinate == null) {
    return null;
  }

  const sourceHit = hitTestSourceHexCell(
    mapCoordinate,
    viewport.hitCells,
    viewport.sourceHexRadius
  );
  if (sourceHit != null) {
    return {
      hexCell: { x: sourceHit.x, y: sourceHit.y },
      cellKey: "key" in sourceHit ? sourceHit.key : getCampaignHexCellKey(sourceHit.x, sourceHit.y),
    };
  }

  const hexCell = campaignMapCoordinateToHex(
    mapCoordinate,
    viewport.coordinateSpace
  );
  return {
    hexCell,
    cellKey: getCampaignHexCellKey(hexCell.x, hexCell.y),
  };
}

function clientPointToMapCoordinate(
  canvas: HTMLCanvasElement,
  viewport: CanvasViewport,
  clientX: number,
  clientY: number,
  clampToCoordinateSpace = true
): { x: number; y: number } | null {
  const rect = canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return null;
  }

  const canvasX = ((clientX - rect.left) / rect.width) * viewport.canvasWidth;
  const canvasY = ((clientY - rect.top) / rect.height) * viewport.canvasHeight;
  const mapX =
    viewport.viewBox.x +
    ((canvasX - viewport.offsetX) / Math.max(viewport.drawWidth, 1)) *
      viewport.viewBox.width;
  const mapY =
    viewport.viewBox.y +
    ((canvasY - viewport.offsetY) / Math.max(viewport.drawHeight, 1)) *
      viewport.viewBox.height;

  if (
    clampToCoordinateSpace &&
    (mapX < 0 ||
      mapY < 0 ||
      mapX > viewport.coordinateSpace.width ||
      mapY > viewport.coordinateSpace.height)
  ) {
    return null;
  }

  return {
    x: mapX,
    y: mapY,
  };
}

export function hitTestMapCoordinate(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number
): { x: number; y: number } | null {
  const viewport = canvasViewportByElement.get(canvas);
  if (viewport == null) {
    return null;
  }

  return clientPointToMapCoordinate(canvas, viewport, clientX, clientY);
}

export function clientPointToEditorMapCoordinate(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number
): { x: number; y: number } | null {
  const viewport = canvasViewportByElement.get(canvas);
  if (viewport == null) {
    return null;
  }

  return clientPointToMapCoordinate(canvas, viewport, clientX, clientY, false);
}

function syncCanvasViewport(
  canvas: HTMLCanvasElement,
  coordinateSpace: CampaignCoordinateSpace,
  viewBox: CanvasViewport["viewBox"],
  sourceHexRadius: number,
  hitCells: CanvasHexCell[]
): CanvasViewport {
  const devicePixelRatio = window.devicePixelRatio || 1;
  const displayWidth = Math.max(Math.floor(canvas.clientWidth), coordinateSpace.width);
  const displayHeight = Math.max(Math.floor(canvas.clientHeight), coordinateSpace.height);
  const canvasWidth = Math.max(1, Math.floor(displayWidth * devicePixelRatio));
  const canvasHeight = Math.max(1, Math.floor(displayHeight * devicePixelRatio));

  if (canvas.width !== canvasWidth) {
    canvas.width = canvasWidth;
  }
  if (canvas.height !== canvasHeight) {
    canvas.height = canvasHeight;
  }

  const scale = Math.min(
    canvasWidth / Math.max(viewBox.width, 1),
    canvasHeight / Math.max(viewBox.height, 1)
  );
  const drawWidth = viewBox.width * scale;
  const drawHeight = viewBox.height * scale;
  const viewport: CanvasViewport = {
    coordinateSpace,
    canvasWidth,
    canvasHeight,
    drawWidth,
    drawHeight,
    offsetX: (canvasWidth - drawWidth) * 0.5,
    offsetY: (canvasHeight - drawHeight) * 0.5,
    viewBox,
    sourceHexRadius,
    hitCells,
  };

  canvasViewportByElement.set(canvas, viewport);
  return viewport;
}

function getCanvasViewBox(
  input: CanvasViewInput,
  visibleCells: CanvasHexCell[],
  sourceHexRadius: number
): CanvasViewport["viewBox"] {
  if (input.viewportMode === "source-map") {
    return createSourceMapViewBox(input.coordinateSpace);
  }
  if (input.viewportMode === "manual-hex" && input.manualViewBox != null) {
    return input.manualViewBox;
  }

  return createHexFitViewBox(input.coordinateSpace, visibleCells, sourceHexRadius);
}

function drawSourceImageCropOverlay(
  context: CanvasRenderingContext2D,
  viewport: CanvasViewport,
  sourceImage: HTMLImageElement,
  sourceCrop: YuanmoHexEditorState["project"]["sampling"]["sourceCrop"]
): void {
  const imageWidth = sourceImage.naturalWidth || sourceImage.width;
  const imageHeight = sourceImage.naturalHeight || sourceImage.height;
  if (imageWidth <= 0 || imageHeight <= 0) {
    return;
  }

  const topLeft = projectPoint(viewport, sourceCrop.x, sourceCrop.y);
  const bottomRight = projectPoint(
    viewport,
    sourceCrop.x + sourceCrop.width,
    sourceCrop.y + sourceCrop.height
  );
  const sourceX = (sourceCrop.x / viewport.coordinateSpace.width) * imageWidth;
  const sourceY = (sourceCrop.y / viewport.coordinateSpace.height) * imageHeight;
  const sourceWidth = (sourceCrop.width / viewport.coordinateSpace.width) * imageWidth;
  const sourceHeight = (sourceCrop.height / viewport.coordinateSpace.height) * imageHeight;

  context.save();
  context.globalAlpha = 0.2;
  context.drawImage(
    sourceImage,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    topLeft.x,
    topLeft.y,
    bottomRight.x - topLeft.x,
    bottomRight.y - topLeft.y
  );
  context.restore();
}

function createSourceMapViewBox(
  coordinateSpace: CampaignCoordinateSpace
): CanvasViewport["viewBox"] {
  return {
    x: 0,
    y: 0,
    width: coordinateSpace.width,
    height: coordinateSpace.height,
  };
}

function createHexFitViewBox(
  coordinateSpace: CampaignCoordinateSpace,
  cells: CanvasHexCell[],
  sourceHexRadius: number
): CanvasViewport["viewBox"] {
  if (cells.length === 0) {
    return createSourceMapViewBox(coordinateSpace);
  }

  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const cell of cells) {
    const points = createCellPolygon(cell, coordinateSpace, sourceHexRadius, 1.02);
    for (const point of points) {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    }
  }

  const padding = Math.max((maxX - minX) * 0.04, (maxY - minY) * 0.04, 8);
  const x = minX - padding;
  const y = minY - padding;
  const right = maxX + padding;
  const bottom = maxY + padding;

  return {
    x,
    y,
    width: Math.max(1, right - x),
    height: Math.max(1, bottom - y),
  };
}

function drawSourceCropOverlay(
  context: CanvasRenderingContext2D,
  viewport: CanvasViewport,
  sourceCrop: YuanmoHexEditorState["project"]["sampling"]["sourceCrop"]
): void {
  const topLeft = projectPoint(viewport, sourceCrop.x, sourceCrop.y);
  const bottomRight = projectPoint(
    viewport,
    sourceCrop.x + sourceCrop.width,
    sourceCrop.y + sourceCrop.height
  );
  const width = bottomRight.x - topLeft.x;
  const height = bottomRight.y - topLeft.y;

  context.save();
  context.fillStyle = "rgba(18, 14, 10, 0.12)";
  context.fillRect(viewport.offsetX, viewport.offsetY, viewport.drawWidth, viewport.drawHeight);
  context.clearRect(topLeft.x, topLeft.y, width, height);
  context.strokeStyle = "rgba(214, 166, 64, 0.96)";
  context.lineWidth = 3;
  context.setLineDash([10, 6]);
  context.strokeRect(topLeft.x, topLeft.y, width, height);
  context.restore();
}

function drawResolvedCell(
  context: CanvasRenderingContext2D,
  viewport: CanvasViewport,
  cell: CanvasHexCell,
  selectedHexKey: string | null
): void {
  const cellKey = "key" in cell ? cell.key : getCampaignHexCellKey(cell.x, cell.y);
  const fillPolygon = createCellPolygon(
    cell,
    viewport.coordinateSpace,
    viewport.sourceHexRadius,
    1.04
  ).map((point) => projectPoint(viewport, point.x, point.y));
  const firstPoint = fillPolygon[0];
  if (firstPoint == null) {
    return;
  }

  context.beginPath();
  context.moveTo(firstPoint.x, firstPoint.y);
  for (let index = 1; index < fillPolygon.length; index += 1) {
    const point = fillPolygon[index];
    if (point == null) {
      continue;
    }
    context.lineTo(point.x, point.y);
  }
  context.closePath();
  context.fillStyle = resolveCellFill(cell);
  context.fill();

  if (cellKey !== selectedHexKey) {
    return;
  }

  const strokePolygon = createCellPolygon(
    cell,
    viewport.coordinateSpace,
    viewport.sourceHexRadius,
    1
  ).map((point) => projectPoint(viewport, point.x, point.y));
  const strokeFirstPoint = strokePolygon[0];
  if (strokeFirstPoint == null) {
    return;
  }

  context.beginPath();
  context.moveTo(strokeFirstPoint.x, strokeFirstPoint.y);
  for (let index = 1; index < strokePolygon.length; index += 1) {
    const point = strokePolygon[index];
    if (point == null) {
      continue;
    }
    context.lineTo(point.x, point.y);
  }
  context.closePath();
  context.strokeStyle = "rgba(246, 206, 121, 0.98)";
  context.lineWidth = 3;
  context.stroke();
}

function drawRegionOverlayCells(
  context: CanvasRenderingContext2D,
  viewport: CanvasViewport,
  visibleCells: CanvasHexCell[],
  regionByCellKey: Map<string, RegionRecord>
): void {
  for (const cell of visibleCells) {
    const region = regionByCellKey.get(getCampaignHexCellKey(cell.x, cell.y));
    if (region == null) {
      continue;
    }

    const polygon = createCellPolygon(
      cell,
      viewport.coordinateSpace,
      viewport.sourceHexRadius,
      0.92
    ).map((point) => projectPoint(viewport, point.x, point.y));
    const firstPoint = polygon[0];
    if (firstPoint == null) {
      continue;
    }

    context.beginPath();
    context.moveTo(firstPoint.x, firstPoint.y);
    for (let index = 1; index < polygon.length; index += 1) {
      const point = polygon[index];
      if (point != null) {
        context.lineTo(point.x, point.y);
      }
    }
    context.closePath();
    context.fillStyle = `rgba(${region.color.red}, ${region.color.green}, ${region.color.blue}, 0.42)`;
    context.fill();
    context.strokeStyle = "rgba(24, 18, 10, 0.18)";
    context.lineWidth = 1;
    context.stroke();
  }
}

function drawRegionLabels(
  context: CanvasRenderingContext2D,
  viewport: CanvasViewport,
  regions: RegionRecord[],
  visibleCellsByKey: Map<string, CanvasHexCell>
): void {
  context.save();
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "700 13px serif";

  for (const region of regions) {
    const center = calculateVisibleRegionCenter(region, visibleCellsByKey);
    if (center == null) {
      continue;
    }

    const point = projectPoint(viewport, center.x, center.y);
    const label = region.name;
    const metrics = context.measureText(label);
    const paddingX = 6;
    const paddingY = 4;
    context.fillStyle = "rgba(255, 248, 225, 0.82)";
    context.fillRect(
      point.x - metrics.width * 0.5 - paddingX,
      point.y - 9 - paddingY,
      metrics.width + paddingX * 2,
      18 + paddingY * 2
    );
    context.fillStyle = "rgba(44, 28, 12, 0.92)";
    context.fillText(label, point.x, point.y);
  }

  context.restore();
}

function createRegionByCellKey(regions: RegionRecord[]): Map<string, RegionRecord> {
  const result = new Map<string, RegionRecord>();
  for (const region of regions) {
    for (const cell of region.cells) {
      result.set(getCampaignHexCellKey(cell.x, cell.y), region);
    }
  }
  return result;
}

function calculateVisibleRegionCenter(
  region: RegionRecord,
  visibleCellsByKey: Map<string, CanvasHexCell>
): { x: number; y: number } | null {
  let totalX = 0;
  let totalY = 0;
  let count = 0;

  for (const regionCell of region.cells) {
    const visibleCell = visibleCellsByKey.get(getCampaignHexCellKey(regionCell.x, regionCell.y));
    const sourcePosition = visibleCell?.sourcePosition;
    if (sourcePosition == null) {
      continue;
    }
    totalX += sourcePosition.x;
    totalY += sourcePosition.y;
    count += 1;
  }

  if (count === 0) {
    return null;
  }

  return {
    x: totalX / count,
    y: totalY / count,
  };
}

function drawSettlement(
  context: CanvasRenderingContext2D,
  viewport: CanvasViewport,
  settlement: YuanmoHexEditorState["settlements"][number],
  invalidSettlementIds: Set<string>,
  visibleCellsByKey: Map<string, CanvasHexCell>
): void {
  const cell = visibleCellsByKey.get(getCampaignHexCellKey(settlement.hexCell.x, settlement.hexCell.y));
  const sourcePosition = cell?.sourcePosition ?? settlement.mapPosition;
  const point = projectPoint(
    viewport,
    sourcePosition.x,
    sourcePosition.y
  );
  const radius = settlement.type === "village" ? 7 : 9;

  context.beginPath();
  context.arc(point.x, point.y, radius, 0, Math.PI * 2);
  context.fillStyle =
    settlement.type === "village" ? "rgba(78, 116, 63, 0.94)" : "rgba(128, 58, 31, 0.94)";
  context.fill();
  context.strokeStyle = invalidSettlementIds.has(settlement.id)
    ? "rgba(208, 55, 47, 0.96)"
    : "rgba(255, 243, 220, 0.92)";
  context.lineWidth = invalidSettlementIds.has(settlement.id) ? 3 : 2;
  context.stroke();
}

function projectPoint(
  viewport: CanvasViewport,
  x: number,
  y: number
): { x: number; y: number } {
  return {
    x:
      viewport.offsetX +
      ((x - viewport.viewBox.x) / Math.max(viewport.viewBox.width, 1)) * viewport.drawWidth,
    y:
      viewport.offsetY +
      ((y - viewport.viewBox.y) / Math.max(viewport.viewBox.height, 1)) * viewport.drawHeight,
  };
}

function resolveCellFill(
  cell: CanvasHexCell
): string {
  if (!cell.land) {
    return "rgba(48, 96, 148, 0.88)";
  }
  if ("structureGround" in cell && cell.structureGround === "city-ground") {
    return "rgba(150, 84, 52, 0.90)";
  }
  if ("structureGround" in cell && cell.structureGround === "village-ground") {
    return "rgba(131, 140, 76, 0.88)";
  }
  if ("overlays" in cell && cell.overlays.includes("farmland")) {
    return "rgba(182, 154, 77, 0.88)";
  }
  if (cell.terrain === "山脉") {
    return "rgba(116, 100, 82, 0.90)";
  }
  if (cell.environment === "森林") {
    return "rgba(71, 119, 72, 0.88)";
  }
  return "rgba(195, 173, 124, 0.86)";
}

export function createSourceHexPolygon(
  center: { x: number; y: number },
  radius: number,
  radiusScale = 1
): Array<{ x: number; y: number }> {
  const scaledRadius = radius * radiusScale;
  const halfWidth = Math.sqrt(3) * scaledRadius * 0.5;
  return [
    { x: center.x, y: center.y - scaledRadius },
    { x: center.x + halfWidth, y: center.y - scaledRadius * 0.5 },
    { x: center.x + halfWidth, y: center.y + scaledRadius * 0.5 },
    { x: center.x, y: center.y + scaledRadius },
    { x: center.x - halfWidth, y: center.y + scaledRadius * 0.5 },
    { x: center.x - halfWidth, y: center.y - scaledRadius * 0.5 },
  ];
}

function createCellPolygon(
  cell: CanvasHexCell,
  coordinateSpace: CampaignCoordinateSpace,
  sourceHexRadius: number,
  radiusScale: number
): Array<{ x: number; y: number }> {
  if (cell.sourcePosition != null) {
    return createSourceHexPolygon(cell.sourcePosition, sourceHexRadius, radiusScale);
  }

  return hexToCoordinatePolygon({
    hex: { x: cell.x, y: cell.y },
    coordinateSpace,
    radiusScale,
  });
}

export function getVisualSourceHexRadius(
  coordinateSpace: CampaignCoordinateSpace,
  sampling: YuanmoHexSamplingConfig
): number {
  return (
    (coordinateSpace.height / BASE_HEX_SOURCE_RADIUS_DIVISOR) *
    sampling.scale *
    Math.max(sampling.step, 0.1)
  );
}

function hitTestSourceHexCell(
  mapCoordinate: { x: number; y: number },
  cells: CanvasHexCell[],
  sourceHexRadius: number
): CanvasHexCell | null {
  let nearestCell: CanvasHexCell | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const cell of cells) {
    if (cell.sourcePosition == null) {
      continue;
    }
    const deltaX = mapCoordinate.x - cell.sourcePosition.x;
    const deltaY = mapCoordinate.y - cell.sourcePosition.y;
    if (
      Math.abs(deltaY) + Math.abs(deltaX) / Math.sqrt(3) >
      sourceHexRadius + 0.0001
    ) {
      continue;
    }

    const distance = deltaX * deltaX + deltaY * deltaY;
    if (distance < nearestDistance) {
      nearestCell = cell;
      nearestDistance = distance;
    }
  }

  return nearestCell;
}
