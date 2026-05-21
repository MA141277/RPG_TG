import workerUrl from "gdal3.js/dist/package/gdal3.js?url";
import dataUrl from "gdal3.js/dist/package/gdal3WebAssembly.data?url";
import wasmUrl from "gdal3.js/dist/package/gdal3WebAssembly.wasm?url";
import initGdalJs from "gdal3.js";

export type TerrainDatasetOption = {
  id: string;
  label: string;
  fileName: string;
  fileUrl: string;
};

export type TerrainBounds = {
  west: number;
  east: number;
  north: number;
  south: number;
};

export type TerrainRasterData = {
  width: number;
  height: number;
  heights: Float32Array;
  mask: Uint8Array;
  minElevation: number;
  maxElevation: number;
  previewUrl: string;
  sourceLabel: string;
  sourceFileName: string;
  bounds: TerrainBounds;
};

export type TerrainMosaicData = TerrainRasterData & {
  tileCount: number;
  frameColumns: number;
  frameRows: number;
  sourceFileNames: string[];
};

type GdalDataset = {
  path: string;
};

type GdalOpenResult = {
  datasets: GdalDataset[];
};

type GdalFilePath = {
  local: string;
  real: string;
};

type GdalInfoBand = {
  computedMin?: number;
  computedMax?: number;
  minimum?: number;
  maximum?: number;
};

type GdalCornerCoordinates = {
  upperLeft?: [number, number];
  lowerRight?: [number, number];
};

type GdalInfoResult = {
  bands?: GdalInfoBand[];
  cornerCoordinates?: GdalCornerCoordinates;
};

type GdalApi = {
  open(fileOrFiles: File): Promise<GdalOpenResult>;
  close(dataset: GdalDataset): Promise<void>;
  gdal_translate(
    dataset: GdalDataset,
    options?: string[],
    outputName?: string
  ): Promise<GdalFilePath>;
  getFileBytes(filePath: string | GdalFilePath): Promise<Uint8Array>;
  gdalinfo(dataset: GdalDataset, options?: string[]): Promise<GdalInfoResult>;
};

type LoadMosaicOptions = {
  tileResolution?: number;
  onTileLoaded?: (input: {
    loadedCount: number;
    totalCount: number;
    fileName: string;
  }) => void;
};

let gdalPromise: Promise<GdalApi> | null = null;

function getGdal(): Promise<GdalApi> {
  if (gdalPromise != null) {
    return gdalPromise;
  }

  gdalPromise = initGdalJs({
    useWorker: false,
    paths: {
      js: workerUrl,
      data: dataUrl,
      wasm: wasmUrl,
    },
  }) as Promise<GdalApi>;

  return gdalPromise;
}

function bytesToObjectUrl(bytes: Uint8Array, mimeType: string): string {
  const byteCopy = Uint8Array.from(bytes);
  return URL.createObjectURL(new Blob([byteCopy.buffer], { type: mimeType }));
}

function extractBandRange(info: GdalInfoResult): {
  minElevation: number;
  maxElevation: number;
} {
  const firstBand = info.bands?.[0];
  const rawMin = firstBand?.computedMin ?? firstBand?.minimum ?? 0;
  const rawMax = firstBand?.computedMax ?? firstBand?.maximum ?? rawMin + 1;
  const minElevation = Number.isFinite(rawMin) ? rawMin : 0;
  const maxElevation =
    Number.isFinite(rawMax) && rawMax > minElevation ? rawMax : minElevation + 1;

  return {
    minElevation,
    maxElevation,
  };
}

function extractBounds(info: GdalInfoResult, fileName: string): TerrainBounds {
  const upperLeft = info.cornerCoordinates?.upperLeft;
  const lowerRight = info.cornerCoordinates?.lowerRight;

  if (upperLeft == null || lowerRight == null) {
    throw new Error(`Missing corner coordinates for "${fileName}".`);
  }

  return {
    west: upperLeft[0],
    north: upperLeft[1],
    east: lowerRight[0],
    south: lowerRight[1],
  };
}

function decodeHeightmapFromPreview(
  previewUrl: string,
  minElevation: number,
  maxElevation: number
): Promise<{
  width: number;
  height: number;
  heights: Float32Array;
}> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      const width = image.naturalWidth;
      const height = image.naturalHeight;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");
      if (context == null) {
        reject(new Error("Failed to create preview canvas."));
        return;
      }

      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, width, height);
      const heights = new Float32Array(width * height);
      const elevationRange = Math.max(maxElevation - minElevation, 1);

      for (let index = 0; index < heights.length; index += 1) {
        const pixelOffset = index * 4;
        const normalizedHeight = (imageData.data[pixelOffset] ?? 0) / 255;
        heights[index] = minElevation + normalizedHeight * elevationRange;
      }

      resolve({
        width,
        height,
        heights,
      });
    };
    image.onerror = () => {
      reject(new Error("Failed to decode terrain preview PNG."));
    };
    image.src = previewUrl;
  });
}

async function createPreviewUrlFromMosaic(input: {
  heights: Float32Array;
  mask: Uint8Array;
  width: number;
  height: number;
  minElevation: number;
  maxElevation: number;
}): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = input.width;
  canvas.height = input.height;

  const context = canvas.getContext("2d");
  if (context == null) {
    throw new Error("Failed to create mosaic preview canvas.");
  }

  const imageData = context.createImageData(input.width, input.height);
  const elevationRange = Math.max(input.maxElevation - input.minElevation, 1);

  for (let index = 0; index < input.heights.length; index += 1) {
    const pixelOffset = index * 4;
    if ((input.mask[index] ?? 0) === 0) {
      imageData.data[pixelOffset] = 7;
      imageData.data[pixelOffset + 1] = 17;
      imageData.data[pixelOffset + 2] = 30;
      imageData.data[pixelOffset + 3] = 255;
      continue;
    }

    const normalizedHeight =
      ((input.heights[index] ?? input.minElevation) - input.minElevation) / elevationRange;
    const clamped = Math.max(0, Math.min(1, normalizedHeight));
    imageData.data[pixelOffset] = Math.round(45 + 190 * clamped);
    imageData.data[pixelOffset + 1] = Math.round(80 + 150 * clamped);
    imageData.data[pixelOffset + 2] = Math.round(35 + 110 * clamped);
    imageData.data[pixelOffset + 3] = 255;
  }

  context.putImageData(imageData, 0, 0);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((canvasBlob) => {
      if (canvasBlob == null) {
        reject(new Error("Failed to export mosaic preview PNG."));
        return;
      }

      resolve(canvasBlob);
    }, "image/png");
  });

  return URL.createObjectURL(blob);
}

async function loadSingleTerrainRasterData(
  datasetOption: TerrainDatasetOption,
  previewResolution: number
): Promise<TerrainRasterData> {
  const gdal = await getGdal();
  const response = await fetch(datasetOption.fileUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch "${datasetOption.fileName}".`);
  }

  const sourceFile = new File([await response.blob()], datasetOption.fileName);
  const openResult = await gdal.open(sourceFile);
  const dataset = openResult.datasets[0];

  if (dataset == null) {
    throw new Error(`GDAL could not open "${datasetOption.fileName}".`);
  }

  let previewUrl = "";

  try {
    const info = await gdal.gdalinfo(dataset, ["-json", "-stats"]);
    const bounds = extractBounds(info, datasetOption.fileName);
    const { minElevation, maxElevation } = extractBandRange(info);
    const previewOutput = await gdal.gdal_translate(
      dataset,
      [
        "-of",
        "PNG",
        "-outsize",
        `${previewResolution}`,
        "0",
        "-ot",
        "Byte",
        "-scale",
        `${minElevation}`,
        `${maxElevation}`,
        "0",
        "255",
      ],
      `${datasetOption.id}.png`
    );

    const previewBytes = await gdal.getFileBytes(previewOutput);
    previewUrl = bytesToObjectUrl(previewBytes, "image/png");
    const decodedHeightmap = await decodeHeightmapFromPreview(
      previewUrl,
      minElevation,
      maxElevation
    );

    return {
      ...decodedHeightmap,
      mask: new Uint8Array(decodedHeightmap.width * decodedHeightmap.height).fill(1),
      minElevation,
      maxElevation,
      previewUrl,
      sourceLabel: datasetOption.label,
      sourceFileName: datasetOption.fileName,
      bounds,
    };
  } catch (error) {
    if (previewUrl !== "") {
      URL.revokeObjectURL(previewUrl);
    }

    throw error;
  } finally {
    await gdal.close(dataset);
  }
}

export async function loadTerrainMosaicData(
  datasetOptions: TerrainDatasetOption[],
  options: LoadMosaicOptions = {}
): Promise<TerrainMosaicData> {
  const tileResolution = options.tileResolution ?? 64;
  const loadedTiles: TerrainRasterData[] = [];

  for (const [index, datasetOption] of datasetOptions.entries()) {
    const terrainTile = await loadSingleTerrainRasterData(datasetOption, tileResolution);
    loadedTiles.push(terrainTile);
    options.onTileLoaded?.({
      loadedCount: index + 1,
      totalCount: datasetOptions.length,
      fileName: datasetOption.fileName,
    });
  }

  const firstTile = loadedTiles[0];
  if (firstTile == null) {
    throw new Error("No terrain tiles were loaded.");
  }

  const tileWidth = firstTile.width;
  const tileHeight = firstTile.height;
  const tileLongitudeSpan = firstTile.bounds.east - firstTile.bounds.west;
  const tileLatitudeSpan = firstTile.bounds.north - firstTile.bounds.south;
  const mosaicBounds = loadedTiles.reduce<TerrainBounds>(
    (currentBounds, terrainTile) => ({
      west: Math.min(currentBounds.west, terrainTile.bounds.west),
      east: Math.max(currentBounds.east, terrainTile.bounds.east),
      north: Math.max(currentBounds.north, terrainTile.bounds.north),
      south: Math.min(currentBounds.south, terrainTile.bounds.south),
    }),
    { ...firstTile.bounds }
  );
  const minElevation = Math.min(
    ...loadedTiles.map((terrainTile) => terrainTile.minElevation)
  );
  const maxElevation = Math.max(
    ...loadedTiles.map((terrainTile) => terrainTile.maxElevation)
  );
  const frameColumns = Math.round(
    (mosaicBounds.east - mosaicBounds.west) / tileLongitudeSpan
  );
  const frameRows = Math.round(
    (mosaicBounds.north - mosaicBounds.south) / tileLatitudeSpan
  );
  const mosaicWidth = frameColumns * tileWidth;
  const mosaicHeight = frameRows * tileHeight;
  const heights = new Float32Array(mosaicWidth * mosaicHeight).fill(minElevation);
  const mask = new Uint8Array(mosaicWidth * mosaicHeight);

  for (const terrainTile of loadedTiles) {
    const columnIndex = Math.round(
      (terrainTile.bounds.west - mosaicBounds.west) / tileLongitudeSpan
    );
    const rowIndex = Math.round(
      (mosaicBounds.north - terrainTile.bounds.north) / tileLatitudeSpan
    );

    for (let y = 0; y < tileHeight; y += 1) {
      const destinationRow = rowIndex * tileHeight + y;
      for (let x = 0; x < tileWidth; x += 1) {
        const destinationColumn = columnIndex * tileWidth + x;
        const destinationIndex = destinationRow * mosaicWidth + destinationColumn;
        const sourceIndex = y * tileWidth + x;
        heights[destinationIndex] = terrainTile.heights[sourceIndex] ?? minElevation;
        mask[destinationIndex] = 1;
      }
    }
  }

  for (const terrainTile of loadedTiles) {
    URL.revokeObjectURL(terrainTile.previewUrl);
  }

  const previewUrl = await createPreviewUrlFromMosaic({
    heights,
    mask,
    width: mosaicWidth,
    height: mosaicHeight,
    minElevation,
    maxElevation,
  });

  return {
    width: mosaicWidth,
    height: mosaicHeight,
    heights,
    mask,
    minElevation,
    maxElevation,
    previewUrl,
    sourceLabel: `10-tile mosaic (${loadedTiles.length} loaded)`,
    sourceFileName: "terrain-mosaic",
    sourceFileNames: loadedTiles.map((terrainTile) => terrainTile.sourceFileName),
    bounds: mosaicBounds,
    tileCount: loadedTiles.length,
    frameColumns,
    frameRows,
  };
}
