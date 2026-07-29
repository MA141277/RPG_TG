import { getCampaignHexCellKey } from "../domain/campaign-hex";
import type { MapNode } from "../domain/map";
import type {
  GeneratedHexGrid,
  RegionColor,
  RegionRecord,
  YuanmoHexRasterLayerData,
} from "./model";
import { YUANMO_SOURCE_COORDINATE_SPACE } from "./yuanmo-source";

type RegionMappingInput = {
  generated: GeneratedHexGrid;
  regionRaster: YuanmoHexRasterLayerData | null;
  nodes?: MapNode[];
};

type RegionBucket = {
  id: string;
  color: RegionColor;
  cells: Array<{ x: number; y: number }>;
  nodes: MapNode[];
};

export function createRegionsFromSourceMap(input: RegionMappingInput): RegionRecord[] {
  if (input.regionRaster == null) {
    return [];
  }

  const buckets = new Map<string, RegionBucket>();
  for (const cell of input.generated.cells) {
    if (cell.sourcePosition == null) {
      continue;
    }

    const color = sampleRegionColor(input.regionRaster, cell.sourcePosition);
    if (color == null || isIgnoredRegionColor(color)) {
      continue;
    }

    const id = createRegionId(color);
    const bucket =
      buckets.get(id) ??
      {
        id,
        color,
        cells: [],
        nodes: [],
      };
    bucket.cells.push({ x: cell.x, y: cell.y });
    buckets.set(id, bucket);
  }

  const sourceNodes = input.nodes ?? [];
  for (const node of sourceNodes) {
    const point = mapNodeToVisibleSourcePoint(node);
    const color = sampleRegionColor(input.regionRaster, point);
    if (color == null || isIgnoredRegionColor(color)) {
      continue;
    }

    buckets.get(createRegionId(color))?.nodes.push(node);
  }

  return [...buckets.values()]
    .map((bucket) => {
      const capitalSettlementId = resolveCapitalSettlementId(bucket.nodes);
      return {
        id: bucket.id,
        name: resolveRegionName(bucket),
        color: bucket.color,
        cells: sortCells(bucket.cells),
        ...(capitalSettlementId == null ? {} : { capitalSettlementId }),
      };
    })
    .sort((left, right) => left.id.localeCompare(right.id));
}

function sampleRegionColor(
  raster: YuanmoHexRasterLayerData,
  position: { x: number; y: number }
): (RegionColor & { alpha: number }) | null {
  if (raster.width <= 0 || raster.height <= 0) {
    return null;
  }

  const pixelX = Math.min(
    raster.width - 1,
    Math.max(
      0,
      Math.round((position.x / YUANMO_SOURCE_COORDINATE_SPACE.width) * (raster.width - 1))
    )
  );
  const pixelY = Math.min(
    raster.height - 1,
    Math.max(
      0,
      Math.round((position.y / YUANMO_SOURCE_COORDINATE_SPACE.height) * (raster.height - 1))
    )
  );
  const index = (pixelY * raster.width + pixelX) * 4;
  return {
    red: raster.data[index] ?? 0,
    green: raster.data[index + 1] ?? 0,
    blue: raster.data[index + 2] ?? 0,
    alpha: raster.data[index + 3] ?? 255,
  };
}

function isIgnoredRegionColor(color: RegionColor & { alpha: number }): boolean {
  return color.alpha === 0 || (color.red === 0 && color.green === 0 && color.blue === 0);
}

function createRegionId(color: RegionColor): string {
  return `region.rgb.${color.red}-${color.green}-${color.blue}`;
}

function mapNodeToVisibleSourcePoint(node: MapNode): { x: number; y: number } {
  return {
    x: node.x,
    y: YUANMO_SOURCE_COORDINATE_SPACE.height - node.y,
  };
}

function resolveRegionName(bucket: RegionBucket): string {
  const capitalNode = bucket.nodes.find((node) => hasCapitalMarker(node.label ?? ""));
  const capitalName = capitalNode == null ? null : parseRegionNameFromLabel(capitalNode.label ?? "");
  if (capitalName != null) {
    return capitalName;
  }

  const labelCandidates = bucket.nodes
    .map((node) => parseRegionNameFromLabel(node.label ?? ""))
    .filter((candidate): candidate is string => candidate != null);
  const mostCommonLabelCandidate = getMostCommonValue(labelCandidates);
  if (mostCommonLabelCandidate != null) {
    return mostCommonLabelCandidate;
  }

  const summaryCandidates = bucket.nodes
    .map((node) => parseRegionNameFromSummary(node.summary ?? ""))
    .filter((candidate): candidate is string => candidate != null);
  return getMostCommonValue(summaryCandidates) ?? bucket.id;
}

function resolveCapitalSettlementId(nodes: MapNode[]): string | undefined {
  return nodes.find((node) => hasCapitalMarker(node.label ?? ""))?.id;
}

function parseRegionNameFromLabel(label: string): string | null {
  const cleaned = label
    .replace(/[★☆✦✧✪＊*]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (cleaned.length === 0) {
    return null;
  }

  const firstToken = cleaned.split(" ")[0]?.trim();
  if (firstToken != null && firstToken.length > 0) {
    return firstToken;
  }

  const match = cleaned.match(/^(.+?(?:路|府|州|省|道|行省|地区|郡|国|岛|群岛|半岛))/);
  return match?.[1]?.trim() || null;
}

function parseRegionNameFromSummary(summary: string): string | null {
  const match = summary.match(/Region:\s*([^|]+)/i);
  const value = match?.[1]?.trim();
  return value == null || value.length === 0 ? null : value;
}

function hasCapitalMarker(label: string): boolean {
  return /[★☆✦✧✪＊*]/.test(label);
}

function getMostCommonValue(values: string[]): string | null {
  if (values.length === 0) {
    return null;
  }

  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return [...counts.entries()].sort((left, right) => {
    if (right[1] !== left[1]) {
      return right[1] - left[1];
    }
    return left[0].localeCompare(right[0]);
  })[0]?.[0] ?? null;
}

function sortCells(cells: Array<{ x: number; y: number }>): Array<{ x: number; y: number }> {
  return [...cells].sort((left, right) =>
    getCampaignHexCellKey(left.x, left.y).localeCompare(getCampaignHexCellKey(right.x, right.y))
  );
}
