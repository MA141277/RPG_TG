import {
  hexToCoordinatePolygon,
  type CoordinateSpace,
  type HexCoordinate,
} from "../../../application/navigation/travel-to-coordinate";
import {
  getCampaignTerrainProjectionSignature,
  projectCampaignTerrainUvToClientPoint,
} from "./campaign-terrain-webgl";

const CLOUD_REVEAL_MASK_MAX_TEXTURE_SIZE = 1024;

// Reveal mask tuning table. This canvas stores a soft semantic field, not the
// final visible edge. The shader erodes this field with cloud noise.
const CLOUD_REVEAL_FIELD_HEX_RADIUS_SCALE = 1.04;
const CLOUD_REVEAL_FIELD_CLEAR_INNER_RATIO = 0.10;
const CLOUD_REVEAL_FIELD_CLEAR_OUTER_RATIO = 0.34;
const CLOUD_REVEAL_FIELD_SHALLOW_INNER_RATIO = 0.10;
const CLOUD_REVEAL_FIELD_SHALLOW_OUTER_RATIO = 1.45;
const CLOUD_REVEAL_FIELD_MAX_DISTANCE_PX = 512;

export type CloudRevealMaskDescriptor = {
  coordinateSpace: CoordinateSpace;
  revealedHexes: HexCoordinate[];
  revealedHexSignature: string;
  maskWidth: number;
  maskHeight: number;
  signature: string;
};

type RevealMaskPoint = {
  x: number;
  y: number;
};

type RevealMaskPolygon = {
  points: RevealMaskPoint[];
  radiusPx: number;
};

export function readCloudRevealMaskDescriptor(
  canvas: HTMLCanvasElement,
  projectionRoot: ParentNode
): CloudRevealMaskDescriptor {
  const coordinateWidth = Number.parseFloat(canvas.dataset.mapCoordinateWidth ?? "");
  const coordinateHeight = Number.parseFloat(canvas.dataset.mapCoordinateHeight ?? "");
  const coordinateSpace: CoordinateSpace = {
    width: Number.isFinite(coordinateWidth) && coordinateWidth > 0 ? coordinateWidth : 1,
    height:
      Number.isFinite(coordinateHeight) && coordinateHeight > 0
        ? coordinateHeight
        : 1,
  };
  const revealedHexes = (canvas.dataset.mapRevealedHexKeys ?? "")
    .split(/\s+/)
    .map(parseHexKey)
    .filter((hex): hex is HexCoordinate => hex != null);
  const maskSize = resolveRevealMaskTextureSize(canvas);
  const revealedHexSignature = revealedHexes
    .map((hex) => `${hex.x},${hex.y}`)
    .join("|");
  const signature = [
    coordinateSpace.width.toFixed(3),
    coordinateSpace.height.toFixed(3),
    maskSize.width,
    maskSize.height,
    getCampaignTerrainProjectionSignature(projectionRoot),
    revealedHexSignature,
  ].join("|");

  return {
    coordinateSpace,
    revealedHexes,
    revealedHexSignature,
    maskWidth: maskSize.width,
    maskHeight: maskSize.height,
    signature,
  };
}

export function createCloudRevealMaskCanvas(
  canvas: HTMLCanvasElement,
  projectionRoot: ParentNode,
  descriptor: CloudRevealMaskDescriptor
): HTMLCanvasElement {
  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = descriptor.maskWidth;
  maskCanvas.height = descriptor.maskHeight;
  const occupancyCanvas = document.createElement("canvas");
  occupancyCanvas.width = descriptor.maskWidth;
  occupancyCanvas.height = descriptor.maskHeight;
  const occupancyContext = occupancyCanvas.getContext("2d");
  if (occupancyContext == null) {
    return maskCanvas;
  }

  const polygons = buildRevealMaskPolygons({
    canvas,
    projectionRoot,
    descriptor,
    radiusScale: CLOUD_REVEAL_FIELD_HEX_RADIUS_SCALE,
  });
  occupancyContext.clearRect(0, 0, occupancyCanvas.width, occupancyCanvas.height);
  occupancyContext.globalCompositeOperation = "source-over";
  occupancyContext.fillStyle = "rgb(255, 255, 255)";
  for (const polygon of polygons) {
    drawRevealMaskPolygon(occupancyContext, polygon);
  }

  writeRevealDistanceTexture({
    outputCanvas: maskCanvas,
    occupancyCanvas,
    referenceHexRadiusPx: resolveRevealReferenceHexRadiusPx(polygons, descriptor),
  });

  return maskCanvas;
}

function resolveRevealMaskTextureSize(canvas: HTMLCanvasElement): {
  width: number;
  height: number;
} {
  const sourceWidth = Math.max(canvas.width, 1);
  const sourceHeight = Math.max(canvas.height, 1);
  const scale = Math.min(
    1,
    CLOUD_REVEAL_MASK_MAX_TEXTURE_SIZE / Math.max(sourceWidth, sourceHeight)
  );

  return {
    width: Math.max(1, Math.round(sourceWidth * scale)),
    height: Math.max(1, Math.round(sourceHeight * scale)),
  };
}

function writeRevealDistanceTexture(input: {
  outputCanvas: HTMLCanvasElement;
  occupancyCanvas: HTMLCanvasElement;
  referenceHexRadiusPx: number;
}): void {
  const outputContext = input.outputCanvas.getContext("2d");
  const occupancyContext = input.occupancyCanvas.getContext("2d");
  if (outputContext == null || occupancyContext == null) {
    return;
  }

  const width = input.outputCanvas.width;
  const height = input.outputCanvas.height;
  const occupancyImage = occupancyContext.getImageData(0, 0, width, height);
  const insideMask = new Uint8Array(width * height);
  for (let pixelIndex = 0; pixelIndex < insideMask.length; pixelIndex += 1) {
    insideMask[pixelIndex] = (occupancyImage.data[pixelIndex * 4 + 3] ?? 0) > 96 ? 1 : 0;
  }

  const distanceToBoundary = createRevealBoundaryDistanceField(
    insideMask,
    width,
    height
  );
  const clearInnerPx = clampNumber(
    input.referenceHexRadiusPx * CLOUD_REVEAL_FIELD_CLEAR_INNER_RATIO,
    2,
    18
  );
  const clearOuterPx = clampNumber(
    input.referenceHexRadiusPx * CLOUD_REVEAL_FIELD_CLEAR_OUTER_RATIO,
    8,
    42
  );
  const shallowInnerPx = clampNumber(
    input.referenceHexRadiusPx * CLOUD_REVEAL_FIELD_SHALLOW_INNER_RATIO,
    4,
    28
  );
  const shallowOuterPx = clampNumber(
    input.referenceHexRadiusPx * CLOUD_REVEAL_FIELD_SHALLOW_OUTER_RATIO,
    38,
    CLOUD_REVEAL_FIELD_MAX_DISTANCE_PX
  );
  const outputImage = outputContext.createImageData(width, height);
  for (let pixelIndex = 0; pixelIndex < insideMask.length; pixelIndex += 1) {
    const outputIndex = pixelIndex * 4;
    const isInside = (insideMask[pixelIndex] ?? 0) > 0;
    const boundaryDistance = distanceToBoundary[pixelIndex] ?? 0;
    const signedDistance = isInside ? boundaryDistance : -boundaryDistance;
    const outsideDistance = Math.max(0, -signedDistance);
    const clearField = smoothstepNumber(-clearOuterPx, clearInnerPx, signedDistance);
    const shallowField = isInside
      ? 0
      : 1 - smoothstepNumber(shallowInnerPx, shallowOuterPx, outsideDistance);
    outputImage.data[outputIndex] = Math.round(clampNumber(shallowField, 0, 1) * 255);
    outputImage.data[outputIndex + 1] = Math.round(clampNumber(clearField, 0, 1) * 255);
    outputImage.data[outputIndex + 2] = 0;
    outputImage.data[outputIndex + 3] = 255;
  }

  outputContext.putImageData(outputImage, 0, 0);
}

function buildRevealMaskPolygons(input: {
  canvas: HTMLCanvasElement;
  projectionRoot: ParentNode;
  descriptor: CloudRevealMaskDescriptor;
  radiusScale: number;
}): RevealMaskPolygon[] {
  const polygons: RevealMaskPolygon[] = [];
  for (const hex of input.descriptor.revealedHexes) {
    const polygon = hexToCoordinatePolygon({
      hex,
      coordinateSpace: input.descriptor.coordinateSpace,
      radiusScale: input.radiusScale,
    });
    const points = polygon
      .map((point) =>
        projectCoordinateToRevealMaskPoint({
          canvas: input.canvas,
          projectionRoot: input.projectionRoot,
          descriptor: input.descriptor,
          coordinate: point,
        })
      )
      .filter((point): point is RevealMaskPoint => point != null);
    if (points.length < 3) {
      continue;
    }

    polygons.push({
      points,
      radiusPx: resolveRevealPolygonRadiusPx(points),
    });
  }

  return polygons;
}

function resolveRevealPolygonRadiusPx(points: RevealMaskPoint[]): number {
  const center = points.reduce(
    (sum, point) => ({
      x: sum.x + point.x / points.length,
      y: sum.y + point.y / points.length,
    }),
    { x: 0, y: 0 }
  );
  const radiusSum = points.reduce((sum, point) => {
    const dx = point.x - center.x;
    const dy = point.y - center.y;
    return sum + Math.hypot(dx, dy);
  }, 0);

  return radiusSum / Math.max(points.length, 1);
}

function resolveRevealReferenceHexRadiusPx(
  polygons: RevealMaskPolygon[],
  descriptor: CloudRevealMaskDescriptor
): number {
  if (polygons.length <= 0) {
    return Math.max(12, Math.min(descriptor.maskWidth, descriptor.maskHeight) * 0.04);
  }

  const sortedRadii = polygons
    .map((polygon) => polygon.radiusPx)
    .filter((radius) => Number.isFinite(radius) && radius > 0)
    .sort((a, b) => a - b);
  if (sortedRadii.length <= 0) {
    return Math.max(12, Math.min(descriptor.maskWidth, descriptor.maskHeight) * 0.04);
  }

  return sortedRadii[Math.floor(sortedRadii.length / 2)] ?? sortedRadii[0] ?? 12;
}

function createRevealBoundaryDistanceField(
  insideMask: Uint8Array,
  width: number,
  height: number
): Float32Array {
  const distance = new Float32Array(width * height);
  const maxDistance = width + height;
  for (let index = 0; index < distance.length; index += 1) {
    distance[index] = isRevealBoundaryPixel(insideMask, width, height, index)
      ? 0
      : maxDistance;
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      let best = distance[index] ?? maxDistance;
      if (x > 0) {
        best = Math.min(best, (distance[index - 1] ?? maxDistance) + 1);
      }
      if (y > 0) {
        best = Math.min(best, (distance[index - width] ?? maxDistance) + 1);
      }
      if (x > 0 && y > 0) {
        best = Math.min(best, (distance[index - width - 1] ?? maxDistance) + Math.SQRT2);
      }
      if (x + 1 < width && y > 0) {
        best = Math.min(best, (distance[index - width + 1] ?? maxDistance) + Math.SQRT2);
      }
      distance[index] = best;
    }
  }

  for (let y = height - 1; y >= 0; y -= 1) {
    for (let x = width - 1; x >= 0; x -= 1) {
      const index = y * width + x;
      let best = distance[index] ?? maxDistance;
      if (x + 1 < width) {
        best = Math.min(best, (distance[index + 1] ?? maxDistance) + 1);
      }
      if (y + 1 < height) {
        best = Math.min(best, (distance[index + width] ?? maxDistance) + 1);
      }
      if (x + 1 < width && y + 1 < height) {
        best = Math.min(best, (distance[index + width + 1] ?? maxDistance) + Math.SQRT2);
      }
      if (x > 0 && y + 1 < height) {
        best = Math.min(best, (distance[index + width - 1] ?? maxDistance) + Math.SQRT2);
      }
      distance[index] = best;
    }
  }

  return distance;
}

function isRevealBoundaryPixel(
  insideMask: Uint8Array,
  width: number,
  height: number,
  index: number
): boolean {
  const state = insideMask[index] ?? 0;
  const x = index % width;
  const y = Math.floor(index / width);
  if (x <= 0 || y <= 0 || x + 1 >= width || y + 1 >= height) {
    return state > 0;
  }

  return (
    (insideMask[index - 1] ?? 0) !== state ||
    (insideMask[index + 1] ?? 0) !== state ||
    (insideMask[index - width] ?? 0) !== state ||
    (insideMask[index + width] ?? 0) !== state
  );
}

function smoothstepNumber(edge0: number, edge1: number, value: number): number {
  const t = clampNumber((value - edge0) / Math.max(edge1 - edge0, 0.0001), 0, 1);
  return t * t * (3 - 2 * t);
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function drawRevealMaskPolygon(
  context: CanvasRenderingContext2D,
  polygon: RevealMaskPolygon
): void {
  context.beginPath();
  polygon.points.forEach((point, index) => {
    if (index === 0) {
      context.moveTo(point.x, point.y);
      return;
    }

    context.lineTo(point.x, point.y);
  });
  context.closePath();
  context.fill();
}

function projectCoordinateToRevealMaskPoint(input: {
  canvas: HTMLCanvasElement;
  projectionRoot: ParentNode;
  descriptor: CloudRevealMaskDescriptor;
  coordinate: { x: number; y: number };
}): { x: number; y: number } | null {
  const u =
    input.coordinate.x / Math.max(input.descriptor.coordinateSpace.width, 1);
  const v =
    1 - input.coordinate.y / Math.max(input.descriptor.coordinateSpace.height, 1);
  const projectedPoint = projectCampaignTerrainUvToClientPoint(
    input.projectionRoot,
    u,
    v
  );
  if (projectedPoint == null || !Number.isFinite(projectedPoint.clientX)) {
    return null;
  }

  const canvasRect = input.canvas.getBoundingClientRect();
  if (canvasRect.width <= 0 || canvasRect.height <= 0) {
    return null;
  }

  return {
    x:
      ((projectedPoint.clientX - canvasRect.left) / canvasRect.width) *
      input.descriptor.maskWidth,
    y:
      ((projectedPoint.clientY - canvasRect.top) / canvasRect.height) *
      input.descriptor.maskHeight,
  };
}

function parseHexKey(hexKey: string): HexCoordinate | null {
  const match = /^(-?\d+),(-?\d+)$/.exec(hexKey.trim());
  if (match == null) {
    return null;
  }

  return {
    x: Number.parseInt(match[1] ?? "0", 10),
    y: Number.parseInt(match[2] ?? "0", 10),
  };
}
