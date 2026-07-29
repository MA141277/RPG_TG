import type { CampaignCoordinateSpace } from "../domain/campaign-hex";
import type { YuanmoHexSamplingConfig } from "./model";

export type YuanmoHexEditorViewBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const MIN_VIEWBOX_SIZE = 12;
const VIEWBOX_OVERSCAN_RATIO = 0.18;

export function createCropEditorViewBox(
  sourceCrop: YuanmoHexSamplingConfig["sourceCrop"],
  coordinateSpace: CampaignCoordinateSpace
): YuanmoHexEditorViewBox {
  const padding = Math.max(sourceCrop.width * 0.08, sourceCrop.height * 0.08, 8);
  return clampEditorViewBox(
    {
      x: sourceCrop.x - padding,
      y: sourceCrop.y - padding,
      width: sourceCrop.width + padding * 2,
      height: sourceCrop.height + padding * 2,
    },
    coordinateSpace
  );
}

export function panEditorViewBox(
  viewBox: YuanmoHexEditorViewBox,
  delta: { x: number; y: number },
  coordinateSpace: CampaignCoordinateSpace
): YuanmoHexEditorViewBox {
  return clampEditorViewBox(
    {
      ...viewBox,
      x: viewBox.x + delta.x,
      y: viewBox.y + delta.y,
    },
    coordinateSpace
  );
}

export function zoomEditorViewBox(
  viewBox: YuanmoHexEditorViewBox,
  anchor: { x: number; y: number },
  zoomFactor: number,
  coordinateSpace: CampaignCoordinateSpace
): YuanmoHexEditorViewBox {
  const safeZoomFactor = Math.max(0.1, Math.min(zoomFactor, 10));
  const nextWidth = Math.max(MIN_VIEWBOX_SIZE, Math.min(coordinateSpace.width, viewBox.width / safeZoomFactor));
  const nextHeight = Math.max(MIN_VIEWBOX_SIZE, Math.min(coordinateSpace.height, viewBox.height / safeZoomFactor));
  const anchorRatioX = (anchor.x - viewBox.x) / Math.max(viewBox.width, 1);
  const anchorRatioY = (anchor.y - viewBox.y) / Math.max(viewBox.height, 1);

  return clampEditorViewBox(
    {
      x: anchor.x - nextWidth * anchorRatioX,
      y: anchor.y - nextHeight * anchorRatioY,
      width: nextWidth,
      height: nextHeight,
    },
    coordinateSpace
  );
}

function clampEditorViewBox(
  viewBox: YuanmoHexEditorViewBox,
  coordinateSpace: CampaignCoordinateSpace
): YuanmoHexEditorViewBox {
  const overscanX = coordinateSpace.width * VIEWBOX_OVERSCAN_RATIO;
  const overscanY = coordinateSpace.height * VIEWBOX_OVERSCAN_RATIO;
  const width = Math.max(MIN_VIEWBOX_SIZE, Math.min(coordinateSpace.width + overscanX * 2, viewBox.width));
  const height = Math.max(MIN_VIEWBOX_SIZE, Math.min(coordinateSpace.height + overscanY * 2, viewBox.height));
  const minX = -overscanX;
  const minY = -overscanY;
  const maxX = coordinateSpace.width + overscanX - width;
  const maxY = coordinateSpace.height + overscanY - height;

  return {
    x: Math.min(maxX, Math.max(minX, viewBox.x)),
    y: Math.min(maxY, Math.max(minY, viewBox.y)),
    width,
    height,
  };
}
