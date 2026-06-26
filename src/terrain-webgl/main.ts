import img5102Url from "../../map/srtm_51_02.img?url";
import img5103Url from "../../map/srtm_51_03.img?url";
import img5104Url from "../../map/srtm_51_04.img?url";
import img5105Url from "../../map/srtm_51_05.img?url";
import img5106Url from "../../map/srtm_51_06.img?url";
import img5107Url from "../../map/srtm_51_07.img?url";
import img5108Url from "../../map/srtm_51_08.img?url";
import img5811Url from "../../map/srtm_58_11.img?url";
import img5812Url from "../../map/srtm_58_12.img?url";
import img5813Url from "../../map/srtm_58_13.img?url";
import {
  loadTerrainMosaicData,
  type TerrainDatasetOption,
} from "./gdal-terrain-loader";
import { renderTerrainWithWebGl } from "./terrain-webgl-renderer";
import "./terrain-webgl.css";

const terrainDatasetOptions: TerrainDatasetOption[] = [
  {
    id: "srtm_51_02",
    label: "Tile 51_02",
    fileName: "srtm_51_02.img",
    fileUrl: img5102Url,
  },
  {
    id: "srtm_51_03",
    label: "Tile 51_03",
    fileName: "srtm_51_03.img",
    fileUrl: img5103Url,
  },
  {
    id: "srtm_51_04",
    label: "Tile 51_04",
    fileName: "srtm_51_04.img",
    fileUrl: img5104Url,
  },
  {
    id: "srtm_51_05",
    label: "Tile 51_05",
    fileName: "srtm_51_05.img",
    fileUrl: img5105Url,
  },
  {
    id: "srtm_51_06",
    label: "Tile 51_06",
    fileName: "srtm_51_06.img",
    fileUrl: img5106Url,
  },
  {
    id: "srtm_51_07",
    label: "Tile 51_07",
    fileName: "srtm_51_07.img",
    fileUrl: img5107Url,
  },
  {
    id: "srtm_51_08",
    label: "Tile 51_08",
    fileName: "srtm_51_08.img",
    fileUrl: img5108Url,
  },
  {
    id: "srtm_58_11",
    label: "Tile 58_11",
    fileName: "srtm_58_11.img",
    fileUrl: img5811Url,
  },
  {
    id: "srtm_58_12",
    label: "Tile 58_12",
    fileName: "srtm_58_12.img",
    fileUrl: img5812Url,
  },
  {
    id: "srtm_58_13",
    label: "Tile 58_13",
    fileName: "srtm_58_13.img",
    fileUrl: img5813Url,
  },
];

const appElement = document.querySelector<HTMLElement>("#app");

if (appElement == null) {
  throw new Error("Missing #app mount point for terrain page.");
}

appElement.innerHTML = `
  <main class="view-terrain">
    <section class="c-terrain-shell">
      <header class="c-terrain-header">
        <div>
          <p class="c-terrain-header__eyebrow">10-tile terrain mosaic</p>
          <h1 class="c-terrain-header__title">East Asia elevation atlas</h1>
          <p class="c-terrain-header__body">
            The page reads all 10 ERDAS IMG tiles, aligns them by GDAL geographic bounds,
            fills the missing cells as gaps, and renders the stitched terrain in WebGL.
          </p>
        </div>
      </header>
      <section class="c-terrain-stage">
        <canvas
          class="c-terrain-canvas"
          data-terrain-canvas
          aria-label="Terrain WebGL canvas"
        ></canvas>
        <div class="c-terrain-overlay">
          <p class="c-terrain-overlay__status" data-terrain-status>Preparing 10-tile mosaic...</p>
          <dl class="c-terrain-metrics">
            <div>
              <dt>Tiles</dt>
              <dd data-terrain-file>Not loaded</dd>
            </div>
            <div>
              <dt>Grid</dt>
              <dd data-terrain-grid>Not loaded</dd>
            </div>
            <div>
              <dt>Frame</dt>
              <dd data-terrain-frame>Not loaded</dd>
            </div>
            <div>
              <dt>Elevation</dt>
              <dd data-terrain-range>Not loaded</dd>
            </div>
          </dl>
        </div>
      </section>
      <section class="c-terrain-preview">
        <div class="c-terrain-preview__panel">
          <p class="c-terrain-preview__label">Mosaic preview</p>
          <img data-terrain-preview alt="Terrain mosaic preview" />
        </div>
        <div class="c-terrain-preview__panel">
          <p class="c-terrain-preview__label">Notes</p>
          <ul class="c-terrain-notes">
            <li>All 10 tiles are stitched by their real WGS84 corners from GDAL metadata.</li>
            <li>Missing tile slots stay empty instead of being bridged into fake terrain.</li>
            <li>The atlas is downsampled before rendering so the browser can handle the full mosaic.</li>
          </ul>
        </div>
      </section>
    </section>
  </main>
`;

const canvasCandidate = appElement.querySelector<HTMLCanvasElement>("[data-terrain-canvas]");
const statusCandidate = appElement.querySelector<HTMLElement>("[data-terrain-status]");
const fileCandidate = appElement.querySelector<HTMLElement>("[data-terrain-file]");
const gridCandidate = appElement.querySelector<HTMLElement>("[data-terrain-grid]");
const frameCandidate = appElement.querySelector<HTMLElement>("[data-terrain-frame]");
const rangeCandidate = appElement.querySelector<HTMLElement>("[data-terrain-range]");
const previewCandidate = appElement.querySelector<HTMLImageElement>("[data-terrain-preview]");

if (canvasCandidate == null) {
  throw new Error("Missing terrain canvas element.");
}

if (statusCandidate == null) {
  throw new Error("Missing terrain status element.");
}

if (fileCandidate == null) {
  throw new Error("Missing terrain file element.");
}

if (gridCandidate == null) {
  throw new Error("Missing terrain grid element.");
}

if (frameCandidate == null) {
  throw new Error("Missing terrain frame element.");
}

if (rangeCandidate == null) {
  throw new Error("Missing terrain range element.");
}

if (previewCandidate == null) {
  throw new Error("Missing terrain preview element.");
}

const canvasElement = canvasCandidate;
const statusElement = statusCandidate;
const fileElement = fileCandidate;
const gridElement = gridCandidate;
const frameElement = frameCandidate;
const rangeElement = rangeCandidate;
const previewElement = previewCandidate;

let disposeRenderer: (() => void) | null = null;
let currentPreviewUrl: string | null = null;

async function renderTerrainMosaic(): Promise<void> {
  statusElement.textContent = "Loading terrain tiles 0/10 ...";
  fileElement.textContent = "Loading";
  gridElement.textContent = "Processing";
  frameElement.textContent = "Processing";
  rangeElement.textContent = "Processing";

  try {
    const terrain = await loadTerrainMosaicData(terrainDatasetOptions, {
      tileResolution: 64,
      onTileLoaded: ({ loadedCount, totalCount, fileName }) => {
        statusElement.textContent = `Loading terrain tiles ${loadedCount}/${totalCount}: ${fileName}`;
      },
    });

    if (disposeRenderer != null) {
      disposeRenderer();
      disposeRenderer = null;
    }

    if (currentPreviewUrl != null) {
      URL.revokeObjectURL(currentPreviewUrl);
    }

    currentPreviewUrl = terrain.previewUrl;
    previewElement.src = terrain.previewUrl;
    fileElement.textContent = `${terrain.tileCount} tiles`;
    gridElement.textContent = `${terrain.width} x ${terrain.height}`;
    frameElement.textContent = `${terrain.frameColumns} columns x ${terrain.frameRows} rows`;
    rangeElement.textContent =
      `${terrain.minElevation.toFixed(0)} m to ${terrain.maxElevation.toFixed(0)} m`;
    statusElement.textContent = "10-tile mosaic loaded";
    disposeRenderer = renderTerrainWithWebGl({
      canvas: canvasElement,
      heights: terrain.heights,
      mask: terrain.mask,
      width: terrain.width,
      height: terrain.height,
      minElevation: terrain.minElevation,
      maxElevation: terrain.maxElevation,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown terrain loading error.";
    statusElement.textContent = `Load failed: ${message}`;
    fileElement.textContent = "Failed";
    gridElement.textContent = "Failed";
    frameElement.textContent = "Failed";
    rangeElement.textContent = "Failed";
  }
}

window.addEventListener("beforeunload", () => {
  if (disposeRenderer != null) {
    disposeRenderer();
  }

  if (currentPreviewUrl != null) {
    URL.revokeObjectURL(currentPreviewUrl);
  }
});

void renderTerrainMosaic();
