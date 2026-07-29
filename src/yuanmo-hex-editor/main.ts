import { hexToCoordinate } from "../application/navigation/travel-to-coordinate";
import { yuanmoCampaignMap } from "../content/yuanmo-campaign-map";
import { getCampaignHexCellKey } from "../domain/campaign-hex";
import {
  clientPointToEditorMapCoordinate,
  drawYuanmoHexEditorCanvas,
  hitTestHexCell,
  hitTestMapCoordinate,
} from "./canvas-view";
import {
  createEditorState,
  createEditorStateFromPackageData,
  regenerateEditorState,
  type YuanmoHexEditorState,
} from "./editor-state";
import { countHexInnerSamplePoints, generateBaselineHexGrid } from "./generator";
import {
  exportEditorPackage,
  YUANMO_HEX_EDITOR_PACKAGE_FILES,
} from "./exporter";
import { importEditorPackage } from "./importer";
import type {
  CustomSettlementVisualKind,
  EnvironmentOverride,
  SettlementRecord,
  SettlementType,
  StructureOverlayCategory,
  StructureOverlayRecord,
  TerrainOverride,
  WaterLandOverride,
  YuanmoHexRasterLayerData,
  YuanmoHexRasterSource,
  YuanmoHexSamplingConfig,
} from "./model";
import {
  createNextSettlementId,
  createNextStructureOverlayId,
  customSettlementVisualOptions,
  editorToolDefinitions,
  environmentOptions,
  getEditorToolDefinition,
  getEnvironmentLabel,
  getSettlementTypeLabel,
  getStructureOverlayLabel,
  getTerrainLabel,
  settlementTypeOptions,
  structureOverlayOptions,
  terrainOptions,
  type EditorToolId,
} from "./tools";
import { validateEditorProject, type ValidationIssue } from "./validation";
import {
  createCropEditorViewBox,
  panEditorViewBox,
  zoomEditorViewBox,
  type YuanmoHexEditorViewBox,
} from "./viewport-camera";
import {
  getYuanmoEditorSourceHexGrid,
  normalizeYuanmoHexSamplingConfig,
} from "./yuanmo-source";
import "./yuanmo-hex-editor.css";

const SNAPSHOT_STORAGE_KEY = "yuanmo-hex-editor.snapshot.v1";

type EditorStep = "crop" | "sampling" | "edit";

type EditorCanvasDragState = {
  pointerId: number;
  startClientX: number;
  startClientY: number;
  previousMapPoint: { x: number; y: number };
  hasMoved: boolean;
};

type EditorSession = {
  state: YuanmoHexEditorState;
  draftSampling: YuanmoHexSamplingConfig;
  activeStep: EditorStep;
  activeSourceLayerId: string;
  customSourceLayer: SourceMapLayerOption | null;
  cropDragStart: { x: number; y: number } | null;
  canvasDragState: EditorCanvasDragState | null;
  editorViewBox: YuanmoHexEditorViewBox;
  showSourceOverlay: boolean;
  showRegionOverlay: boolean;
  settlementDraftName: string;
  settlementDraftType: SettlementType;
  settlementDraftCustomVisualKind: CustomSettlementVisualKind;
  activeStructureOverlayId: string | null;
  structureDraftId: string;
  structureDraftCategory: StructureOverlayCategory;
  packageFiles: Record<string, string>;
  selectedPackageFile: string;
  statusText: string;
  sourceImage: HTMLImageElement | null;
  sourceRaster: YuanmoHexRasterSource | null;
  sourceImageState: "loading" | "ready" | "error";
  regionRaster: YuanmoHexRasterLayerData | null;
  regionImageState: "loading" | "ready" | "error";
};

const appElement = document.querySelector<HTMLElement>("#app");

if (appElement == null) {
  throw new Error("缺少元末蜂巢地图编辑器的 #app 挂载点。");
}
const rootElement = appElement;
const coordinateSpace = yuanmoCampaignMap.coordinateSpace ?? { width: 509, height: 451 };

type SourceMapLayerOption = {
  id: string;
  label: string;
  imageUrl: string;
};

const projectSamplingLayerId = getYuanmoEditorSourceHexGrid().source.sourceLayerId;
const sourceLayerIds = [
  projectSamplingLayerId,
  "map_heights",
  "map_climates",
  "map_regions",
] as const;
const sourceMapLayerOptions: SourceMapLayerOption[] = [
  ...(yuanmoCampaignMap.layers ?? [])
    .filter((layer) => sourceLayerIds.includes(layer.id as (typeof sourceLayerIds)[number]))
    .map((layer) => ({
      id: layer.id,
      label: getSourceLayerLabel(layer.id),
      imageUrl: layer.imageUrl,
    })),
  {
    id: "primary",
    label: "原图 HD（参考）",
    imageUrl: yuanmoCampaignMap.primaryImageUrl ?? "",
  },
].filter((layer) => layer.imageUrl.length > 0);
const regionSourceLayer =
  sourceMapLayerOptions.find((option) => option.id === "map_regions") ?? null;
const initialState = createEditorState({ sourceMapNodes: yuanmoCampaignMap.nodes });

const session: EditorSession = {
  state: initialState,
  draftSampling: { ...initialState.project.sampling },
  activeStep: "crop",
  activeSourceLayerId: projectSamplingLayerId,
  customSourceLayer: null,
  cropDragStart: null,
  canvasDragState: null,
  editorViewBox: createCropEditorViewBox(initialState.project.sampling.sourceCrop, coordinateSpace),
  showSourceOverlay: false,
  showRegionOverlay: false,
  settlementDraftName: "新节点",
  settlementDraftType: "city",
  settlementDraftCustomVisualKind: "city-ground",
  activeStructureOverlayId: null,
  structureDraftId: "structure.city-ground",
  structureDraftCategory: "city-ground",
  packageFiles: {},
  selectedPackageFile: YUANMO_HEX_EDITOR_PACKAGE_FILES.project,
  statusText: "已就绪。",
  sourceImage: null,
  sourceRaster: null,
  sourceImageState: "loading",
  regionRaster: null,
  regionImageState: regionSourceLayer == null ? "error" : "loading",
};

session.state.project.uiState.activeToolId = "sampling";
session.draftSampling = { ...session.state.project.sampling };

rootElement.innerHTML = `
  <main class="yuanmo-hex-editor">
    <header class="yuanmo-hex-editor__toolbar">
      <div class="yuanmo-hex-editor__title-block">
        <p class="yuanmo-hex-editor__eyebrow">独立工具</p>
        <h1>元末蜂巢地图编辑器</h1>
        <p class="yuanmo-hex-editor__subtitle">
          俯视信息编辑页。先框定源图裁切区域，再调整元图到六边形的采样关系，随后映射并微调地形、地貌、城镇节点与建筑覆盖。
        </p>
      </div>
      <nav class="yuanmo-hex-editor__stepper" aria-label="编辑步骤">
        <button type="button" data-editor-step="crop">
          <strong>1 裁剪</strong>
          <span>选择源图并框选范围</span>
        </button>
        <button type="button" data-editor-step="sampling">
          <strong>2 采样</strong>
          <span>调整 yuanmo 到 hex 的步长</span>
        </button>
        <button type="button" data-editor-step="edit">
          <strong>3 微调</strong>
          <span>编辑水陆、地形、节点</span>
        </button>
      </nav>
      <div class="yuanmo-hex-editor__toolbar-groups">
        <section class="yuanmo-hex-editor__toolbar-group" aria-label="项目操作">
          <button type="button" data-action="open-project">打开项目</button>
          <button type="button" data-action="save-project">保存快照</button>
          <button type="button" data-action="export-package">导出包</button>
          <button type="button" data-action="download-package">下载文件</button>
        </section>
        <section class="yuanmo-hex-editor__toolbar-group" aria-label="采样操作">
          <button type="button" data-action="toggle-validation">显示校验覆盖</button>
          <button type="button" data-action="load-snapshot">读取已保存快照</button>
        </section>
      </div>
      <section class="yuanmo-hex-editor__sampling-panel">
        <div class="yuanmo-hex-editor__sampling-header">
          <h2>源图裁切与采样</h2>
          <p>默认使用项目 hex 生成时的项目采样图（map_ground_types），不是高清参考图。每一步确认后才进入下一步。</p>
        </div>
        <div class="yuanmo-hex-editor__step-panel" data-step-panel="crop">
          <div class="yuanmo-hex-editor__sampling-grid">
            <label>
              <span>显示底图</span>
              <select data-source-layer>
                ${sourceMapLayerOptions
                  .map((option) => `<option value="${option.id}">${option.label}</option>`)
                  .join("")}
              </select>
            </label>
            <label>
              <span>裁切 X</span>
              <input type="number" step="1" data-sampling="cropX" />
            </label>
            <label>
              <span>裁切 Y</span>
              <input type="number" step="1" data-sampling="cropY" />
            </label>
            <label>
              <span>裁切宽</span>
              <input type="number" step="1" min="1" data-sampling="cropWidth" />
            </label>
            <label>
              <span>裁切高</span>
              <input type="number" step="1" min="1" data-sampling="cropHeight" />
            </label>
          </div>
          <div class="yuanmo-hex-editor__sampling-actions">
            <button type="button" data-action="choose-source-image">选择图片</button>
            <button type="button" data-action="confirm-crop">确认裁剪</button>
            <span>在画布源图上拖拽矩形，只会在选中矩形源图区域内重新采样。</span>
          </div>
        </div>
        <div class="yuanmo-hex-editor__step-panel" data-step-panel="sampling">
          <div class="yuanmo-hex-editor__sampling-grid">
            <label>
              <span>Hex 尺寸倍率</span>
              <div class="yuanmo-hex-editor__number-control">
                <button type="button" data-sampling-adjust="scale:-0.1">-</button>
                <input type="number" step="0.1" min="0.1" data-sampling="scale" />
                <button type="button" data-sampling-adjust="scale:0.1">+</button>
              </div>
            </label>
            <label>
              <span>源图采样步长</span>
              <div class="yuanmo-hex-editor__number-control">
                <button type="button" data-sampling-adjust="step:-0.1">-</button>
                <input type="number" step="0.1" min="0.1" data-sampling="step" />
                <button type="button" data-sampling-adjust="step:0.1">+</button>
              </div>
            </label>
            <label>
              <span>偏移 X</span>
              <input type="number" step="1" data-sampling="offsetX" />
            </label>
            <label>
              <span>偏移 Y</span>
              <input type="number" step="1" data-sampling="offsetY" />
            </label>
          </div>
          <div class="yuanmo-hex-editor__sampling-actions">
            <button type="button" data-action="confirm-sampling">确认采样并进入微调</button>
            <span data-sampling-dirty></span>
          </div>
        </div>
        <div class="yuanmo-hex-editor__step-panel" data-step-panel="edit">
          <p>进入微调后，左侧工具才会启用。水陆、地形、地貌、城镇节点和建筑覆盖都写入同一个中间产物。</p>
        </div>
      </section>
    </header>

    <section class="yuanmo-hex-editor__workspace">
      <aside class="yuanmo-hex-editor__panel yuanmo-hex-editor__panel--tools" data-step-gated="edit" aria-label="工具栏">
        <h2>工具</h2>
        <nav class="yuanmo-hex-editor__tool-list" aria-label="编辑工具">
          ${editorToolDefinitions
            .map(
              (tool) => `
                <button type="button" data-tool="${tool.id}">
                  <strong>${tool.label}</strong>
                  <span>${tool.hint}</span>
                </button>
              `
            )
            .join("")}
        </nav>

        <section class="yuanmo-hex-editor__tool-panel" data-tool-panel="sampling">
          <h3>采样</h3>
          <p>黄色虚线是裁切草稿。源图采样步长越小，同一裁切区域会生成越多 hex；应用前只改变预览，不会改写生成基线。</p>
        </section>

        <section class="yuanmo-hex-editor__tool-panel" data-tool-panel="water">
          <h3>水 / 陆</h3>
          <p>左键把当前六边形标成水域，右键移除覆盖。</p>
        </section>

        <section class="yuanmo-hex-editor__tool-panel" data-tool-panel="land">
          <h3>陆地</h3>
          <p>左键把当前六边形标成陆地，右键移除覆盖。</p>
        </section>

        <section class="yuanmo-hex-editor__tool-panel" data-tool-panel="terrain">
          <h3>地形</h3>
          <label>
            <span>目标地形</span>
            <select data-terrain-value>
              ${terrainOptions
                .map((option) => `<option value="${option.value}">${option.label}</option>`)
                .join("")}
            </select>
          </label>
          <p>左键写入地形覆盖，右键移除地形覆盖。</p>
        </section>

        <section class="yuanmo-hex-editor__tool-panel" data-tool-panel="environment">
          <h3>地貌</h3>
          <label>
            <span>目标地貌</span>
            <select data-environment-value>
              ${environmentOptions
                .map((option) => `<option value="${option.value}">${option.label}</option>`)
                .join("")}
            </select>
          </label>
          <p>左键写入地貌覆盖，右键移除地貌覆盖。</p>
        </section>

        <section class="yuanmo-hex-editor__tool-panel" data-tool-panel="settlement">
          <h3>城镇节点</h3>
          <label>
            <span>名称</span>
            <input type="text" data-settlement-name maxlength="64" />
          </label>
          <label>
            <span>类型</span>
            <select data-settlement-type>
              ${settlementTypeOptions
                .map((option) => `<option value="${option.value}">${option.label}</option>`)
                .join("")}
            </select>
          </label>
          <label>
            <span>自定义视觉</span>
            <select data-settlement-visual>
              ${customSettlementVisualOptions
                .map((option) => `<option value="${option.value}">${option.label}</option>`)
                .join("")}
            </select>
          </label>
          <div class="yuanmo-hex-editor__inline-actions">
            <button type="button" data-action="new-settlement">新建草稿</button>
            <button type="button" data-action="delete-settlement">删除选中</button>
          </div>
          <p>左键放置或移动当前节点，右键删除节点。当前只维护名称和类型。</p>
        </section>

        <section class="yuanmo-hex-editor__tool-panel" data-tool-panel="structure">
          <h3>建筑覆盖</h3>
          <label>
            <span>覆盖层 ID</span>
            <input type="text" data-structure-id maxlength="80" />
          </label>
          <label>
            <span>类别</span>
            <select data-structure-category>
              ${structureOverlayOptions
                .map((option) => `<option value="${option.value}">${option.label}</option>`)
                .join("")}
            </select>
          </label>
          <div class="yuanmo-hex-editor__inline-actions">
            <button type="button" data-action="new-structure-overlay">新建覆盖层</button>
            <button type="button" data-action="delete-structure-overlay">删除当前覆盖层</button>
          </div>
          <p>左键切换当前覆盖层的格子归属，右键移除当前格子。</p>
        </section>
      </aside>

      <section class="yuanmo-hex-editor__canvas-shell" aria-label="俯视地图画布">
        <div class="yuanmo-hex-editor__canvas-toolbar">
          <span>源图</span>
          <span>解析结果</span>
          <span>城镇节点</span>
          <span>建筑覆盖</span>
          <label>
            <input type="checkbox" data-source-overlay-toggle />
            <span>叠加原图 20%</span>
          </label>
          <label>
            <input type="checkbox" data-region-overlay-toggle />
            <span>区域视图</span>
          </label>
        </div>
        <canvas
          class="yuanmo-hex-editor__canvas"
          data-editor-canvas
          aria-label="元末蜂巢地图编辑器画布"
        ></canvas>
        <div class="yuanmo-hex-editor__canvas-status" data-canvas-status></div>
      </section>

      <aside class="yuanmo-hex-editor__panel yuanmo-hex-editor__panel--inspector" data-step-gated="edit" aria-label="检查器">
        <h2>检查器</h2>
        <section class="yuanmo-hex-editor__panel-section">
          <h3>当前选择</h3>
          <pre data-selection-summary></pre>
        </section>
        <section class="yuanmo-hex-editor__panel-section">
          <h3>基线</h3>
          <pre data-baseline-summary></pre>
        </section>
        <section class="yuanmo-hex-editor__panel-section">
          <h3>覆盖层</h3>
          <pre data-override-summary></pre>
        </section>
        <section class="yuanmo-hex-editor__panel-section">
          <h3>最终结果</h3>
          <pre data-resolved-summary></pre>
        </section>
        <section class="yuanmo-hex-editor__panel-section">
          <h3>节点</h3>
          <pre data-settlement-summary></pre>
        </section>
        <section class="yuanmo-hex-editor__panel-section">
          <h3>校验</h3>
          <ul class="yuanmo-hex-editor__validation-list" data-validation-list></ul>
        </section>
      </aside>
    </section>

    <section class="yuanmo-hex-editor__package-panel" data-step-gated="edit">
      <div class="yuanmo-hex-editor__package-header">
        <div>
          <h2>中间产物</h2>
          <p>导出的文件会先展示在这里，确认结构后再回读进游戏流程。</p>
        </div>
        <div class="yuanmo-hex-editor__package-actions">
          <select data-package-file-select></select>
          <button type="button" data-action="refresh-export">刷新中间产物</button>
        </div>
      </div>
      <textarea class="yuanmo-hex-editor__package-output" data-package-output readonly spellcheck="false"></textarea>
      <div class="yuanmo-hex-editor__status" data-status-text></div>
    </section>

    <input type="file" data-open-input accept=".json,application/json" multiple hidden />
    <input type="file" data-crop-image-input accept="image/*" hidden />
  </main>
`;

const canvas = requireElement<HTMLCanvasElement>("[data-editor-canvas]");
const openInput = requireElement<HTMLInputElement>("[data-open-input]");
const cropImageInput = requireElement<HTMLInputElement>("[data-crop-image-input]");
const canvasStatus = requireElement<HTMLElement>("[data-canvas-status]");
const sourceOverlayToggle = requireElement<HTMLInputElement>("[data-source-overlay-toggle]");
const regionOverlayToggle = requireElement<HTMLInputElement>("[data-region-overlay-toggle]");
const packageFileSelect = requireElement<HTMLSelectElement>("[data-package-file-select]");
const packageOutput = requireElement<HTMLTextAreaElement>("[data-package-output]");
const statusTextElement = requireElement<HTMLElement>("[data-status-text]");
const validationList = requireElement<HTMLUListElement>("[data-validation-list]");
const selectionSummary = requireElement<HTMLElement>("[data-selection-summary]");
const baselineSummary = requireElement<HTMLElement>("[data-baseline-summary]");
const overrideSummary = requireElement<HTMLElement>("[data-override-summary]");
const resolvedSummary = requireElement<HTMLElement>("[data-resolved-summary]");
const settlementSummary = requireElement<HTMLElement>("[data-settlement-summary]");
const sourceLayerSelect = requireElement<HTMLSelectElement>("[data-source-layer]");
const samplingDirtyText = requireElement<HTMLElement>("[data-sampling-dirty]");
const terrainSelect = requireElement<HTMLSelectElement>("[data-terrain-value]");
const environmentSelect = requireElement<HTMLSelectElement>("[data-environment-value]");
const settlementNameInput = requireElement<HTMLInputElement>("[data-settlement-name]");
const settlementTypeSelect = requireElement<HTMLSelectElement>("[data-settlement-type]");
const settlementVisualSelect = requireElement<HTMLSelectElement>("[data-settlement-visual]");
const structureIdInput = requireElement<HTMLInputElement>("[data-structure-id]");
const structureCategorySelect = requireElement<HTMLSelectElement>("[data-structure-category]");
const toolButtons = [...rootElement.querySelectorAll<HTMLButtonElement>("[data-tool]")];
const toolPanels = [...rootElement.querySelectorAll<HTMLElement>("[data-tool-panel]")];
const stepButtons = [...rootElement.querySelectorAll<HTMLButtonElement>("[data-editor-step]")];
const stepPanels = [...rootElement.querySelectorAll<HTMLElement>("[data-step-panel]")];
const editOnlyElements = [...rootElement.querySelectorAll<HTMLElement>('[data-step-gated="edit"]')];
const samplingAdjustButtons = [
  ...rootElement.querySelectorAll<HTMLButtonElement>("[data-sampling-adjust]"),
];
const samplingInputs = {
  cropX: requireElement<HTMLInputElement>('[data-sampling="cropX"]'),
  cropY: requireElement<HTMLInputElement>('[data-sampling="cropY"]'),
  cropWidth: requireElement<HTMLInputElement>('[data-sampling="cropWidth"]'),
  cropHeight: requireElement<HTMLInputElement>('[data-sampling="cropHeight"]'),
  scale: requireElement<HTMLInputElement>('[data-sampling="scale"]'),
  step: requireElement<HTMLInputElement>('[data-sampling="step"]'),
  offsetX: requireElement<HTMLInputElement>('[data-sampling="offsetX"]'),
  offsetY: requireElement<HTMLInputElement>('[data-sampling="offsetY"]'),
};

const samplingInputBindings: Array<{
  input: HTMLInputElement;
  read: () => number;
  write: (value: number) => void;
}> = [
  {
    input: samplingInputs.cropX,
    read: () => session.draftSampling.sourceCrop.x,
    write: (value) => {
      session.draftSampling = {
        ...session.draftSampling,
        sourceCrop: { ...session.draftSampling.sourceCrop, x: value },
      };
    },
  },
  {
    input: samplingInputs.cropY,
    read: () => session.draftSampling.sourceCrop.y,
    write: (value) => {
      session.draftSampling = {
        ...session.draftSampling,
        sourceCrop: { ...session.draftSampling.sourceCrop, y: value },
      };
    },
  },
  {
    input: samplingInputs.cropWidth,
    read: () => session.draftSampling.sourceCrop.width,
    write: (value) => {
      session.draftSampling = {
        ...session.draftSampling,
        sourceCrop: { ...session.draftSampling.sourceCrop, width: value },
      };
    },
  },
  {
    input: samplingInputs.cropHeight,
    read: () => session.draftSampling.sourceCrop.height,
    write: (value) => {
      session.draftSampling = {
        ...session.draftSampling,
        sourceCrop: { ...session.draftSampling.sourceCrop, height: value },
      };
    },
  },
  {
    input: samplingInputs.scale,
    read: () => session.draftSampling.scale,
    write: (value) => {
      session.draftSampling = { ...session.draftSampling, scale: value };
    },
  },
  {
    input: samplingInputs.step,
    read: () => session.draftSampling.step,
    write: (value) => {
      session.draftSampling = { ...session.draftSampling, step: value };
    },
  },
  {
    input: samplingInputs.offsetX,
    read: () => session.draftSampling.offsetX,
    write: (value) => {
      session.draftSampling = { ...session.draftSampling, offsetX: value };
    },
  },
  {
    input: samplingInputs.offsetY,
    read: () => session.draftSampling.offsetY,
    write: (value) => {
      session.draftSampling = { ...session.draftSampling, offsetY: value };
    },
  },
];

for (const binding of samplingInputBindings) {
  const syncSamplingInput = () => {
    if (binding.input.value.trim().length === 0) {
      return;
    }
    const parsedValue = Number(binding.input.value);
    if (!Number.isFinite(parsedValue)) {
      return;
    }
    binding.write(parsedValue);
    render();
  };
  binding.input.addEventListener("input", syncSamplingInput);
  binding.input.addEventListener("change", syncSamplingInput);
  binding.input.addEventListener("blur", syncSamplingInput);
  binding.input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      syncSamplingInput();
    }
  });
}

for (const button of samplingAdjustButtons) {
  button.addEventListener("click", () => {
    const [fieldName, deltaText] = (button.dataset.samplingAdjust ?? "").split(":");
    const field = fieldName as "scale" | "step";
    const delta = Number(deltaText);
    if ((field !== "scale" && field !== "step") || !Number.isFinite(delta)) {
      return;
    }
    session.draftSampling = normalizeYuanmoHexSamplingConfig({
      ...session.draftSampling,
      [field]: session.draftSampling[field] + delta,
    });
    render();
  });
}

sourceLayerSelect.addEventListener("change", () => {
  session.activeSourceLayerId = sourceLayerSelect.value;
  loadSourceImage(getActiveSourceLayer().imageUrl);
  render();
});

sourceOverlayToggle.addEventListener("change", () => {
  session.showSourceOverlay = sourceOverlayToggle.checked;
  render();
});

regionOverlayToggle.addEventListener("change", () => {
  session.showRegionOverlay = regionOverlayToggle.checked;
  render();
});

terrainSelect.addEventListener("change", () => {
  render();
});

environmentSelect.addEventListener("change", () => {
  render();
});

settlementNameInput.addEventListener("input", () => {
  session.settlementDraftName = settlementNameInput.value;
  const selectedSettlement = getSelectedSettlement();
  if (selectedSettlement != null) {
    updateSettlement(selectedSettlement.id, {
      name: session.settlementDraftName,
    });
  } else {
    render();
  }
});

settlementTypeSelect.addEventListener("change", () => {
  session.settlementDraftType = settlementTypeSelect.value as SettlementType;
  const selectedSettlement = getSelectedSettlement();
  if (selectedSettlement != null) {
    const settlementPatch: Partial<SettlementRecord> = {
      type: session.settlementDraftType,
    };
    if (session.settlementDraftType === "custom") {
      settlementPatch.customVisualKind = session.settlementDraftCustomVisualKind;
    }
    updateSettlement(selectedSettlement.id, settlementPatch);
  } else {
    render();
  }
});

settlementVisualSelect.addEventListener("change", () => {
  session.settlementDraftCustomVisualKind =
    settlementVisualSelect.value as CustomSettlementVisualKind;
  const selectedSettlement = getSelectedSettlement();
  if (selectedSettlement?.type === "custom") {
    updateSettlement(selectedSettlement.id, {
      customVisualKind: session.settlementDraftCustomVisualKind,
    });
  } else {
    render();
  }
});

structureIdInput.addEventListener("input", () => {
  session.structureDraftId = structureIdInput.value.trim() || session.structureDraftId;
  if (session.activeStructureOverlayId != null) {
    renameActiveStructureOverlay(session.structureDraftId);
  } else {
    render();
  }
});

structureCategorySelect.addEventListener("change", () => {
  session.structureDraftCategory =
    structureCategorySelect.value as StructureOverlayCategory;
  if (session.activeStructureOverlayId != null) {
    updateActiveStructureOverlayCategory(session.structureDraftCategory);
  } else {
    render();
  }
});

for (const button of toolButtons) {
  button.addEventListener("click", () => {
    if (session.activeStep !== "edit") {
      return;
    }
    session.state.project.uiState.activeToolId = button.dataset.tool as EditorToolId;
    render();
  });
}

for (const button of stepButtons) {
  button.addEventListener("click", () => {
    const requestedStep = button.dataset.editorStep as EditorStep;
    if (requestedStep === "crop" || requestedStep === session.activeStep) {
      session.activeStep = requestedStep;
      render();
      return;
    }
    if (requestedStep === "sampling" && session.activeStep !== "edit") {
      confirmCropStep();
      return;
    }
    if (requestedStep === "edit") {
      session.statusText = "请先确认采样，才能进入微调。";
      render();
    }
  });
}

wireAction("open-project", () => {
  openInput.value = "";
  openInput.click();
});

wireAction("save-project", () => {
  const files = exportCurrentPackage();
  localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(files));
  session.statusText = "当前中间产物快照已保存到本地存储。";
  render();
});

wireAction("export-package", () => {
  exportCurrentPackage();
  session.statusText = "已把当前中间产物导出到页面下方的包预览区。";
  render();
});

wireAction("download-package", () => {
  const files = exportCurrentPackage();
  for (const [fileName, content] of Object.entries(files)) {
    downloadTextFile(fileName, content);
  }
  session.statusText = "当前中间产物文件已下载。";
  render();
});

wireAction("choose-source-image", () => {
  cropImageInput.value = "";
  cropImageInput.click();
});

wireAction("confirm-crop", () => {
  confirmCropStep();
});

wireAction("confirm-sampling", () => {
  confirmSamplingStep();
});

wireAction("toggle-validation", () => {
  session.state.project.uiState.showValidationOverlay =
    !session.state.project.uiState.showValidationOverlay;
  render();
});

wireAction("load-snapshot", () => {
  const snapshotSource = localStorage.getItem(SNAPSHOT_STORAGE_KEY);
  if (snapshotSource == null) {
    session.statusText = "本地存储中没有找到已保存快照。";
    render();
    return;
  }

  try {
    const files = JSON.parse(snapshotSource) as Record<string, string>;
    session.state = createEditorStateFromPackageData(importEditorPackage(files));
    session.packageFiles = files;
    session.selectedPackageFile = firstPackageFileName(files);
    session.draftSampling = { ...session.state.project.sampling };
    session.editorViewBox = createCropEditorViewBox(session.draftSampling.sourceCrop, coordinateSpace);
    session.activeStep = "edit";
    syncDraftsFromState();
    session.statusText = "已从本地存储读入快照。";
    render();
  } catch (error) {
    session.statusText = `读取已保存快照失败：${getErrorMessage(error)}`;
    render();
  }
});

wireAction("new-settlement", () => {
  session.state.project.uiState.selectedSettlementId = null;
  session.settlementDraftName = "新节点";
  session.settlementDraftType = "city";
  session.settlementDraftCustomVisualKind = "city-ground";
  session.statusText = "节点草稿已重置，点击六边形即可放置。";
  render();
});

wireAction("delete-settlement", () => {
  const selectedSettlement = getSelectedSettlement();
  if (selectedSettlement == null) {
    session.statusText = "当前没有选中节点。";
    render();
    return;
  }

  rebuildState({
    settlements: session.state.settlements.filter((entry) => entry.id !== selectedSettlement.id),
  });
  session.state.project.uiState.selectedSettlementId = null;
  session.statusText = `已删除节点 ${selectedSettlement.id}。`;
  render();
});

wireAction("new-structure-overlay", () => {
  session.activeStructureOverlayId = null;
  session.structureDraftId = createNextStructureOverlayId(
    session.structureDraftCategory,
    session.state.structureOverlays.map((overlay) => overlay.id)
  );
  session.statusText = "建筑覆盖草稿已重置，点击六边形开始绘制。";
  render();
});

wireAction("delete-structure-overlay", () => {
  if (session.activeStructureOverlayId == null) {
    session.statusText = "当前没有激活的建筑覆盖层。";
    render();
    return;
  }

  rebuildState({
    structureOverlays: session.state.structureOverlays.filter(
      (overlay) => overlay.id !== session.activeStructureOverlayId
    ),
  });
  session.statusText = `已删除建筑覆盖层 ${session.activeStructureOverlayId}。`;
  session.activeStructureOverlayId = null;
  render();
});

wireAction("refresh-export", () => {
  exportCurrentPackage();
  session.statusText = "已根据当前编辑状态刷新中间产物预览。";
  render();
});

packageFileSelect.addEventListener("change", () => {
  session.selectedPackageFile = packageFileSelect.value;
  render();
});

openInput.addEventListener("change", async () => {
  const fileList = openInput.files;
  if (fileList == null || fileList.length === 0) {
    return;
  }

  try {
    const files = Object.fromEntries(
      await Promise.all(
        [...fileList].map(async (file) => [file.name, await file.text()] as const)
      )
    );
    session.state = createEditorStateFromPackageData(importEditorPackage(files));
    session.packageFiles = files;
    session.selectedPackageFile = firstPackageFileName(files);
    session.draftSampling = { ...session.state.project.sampling };
    session.activeStep = "edit";
    syncDraftsFromState();
    session.statusText = `已载入 ${fileList.length} 个包文件。`;
    render();
  } catch (error) {
    session.statusText = `打开项目失败：${getErrorMessage(error)}`;
    render();
  }
});

cropImageInput.addEventListener("change", () => {
  const file = cropImageInput.files?.[0];
  if (file == null) {
    return;
  }

  const objectUrl = URL.createObjectURL(file);
  session.customSourceLayer = {
    id: "custom",
    label: `本地图片：${file.name}`,
    imageUrl: objectUrl,
  };
  session.activeSourceLayerId = "custom";
  ensureCustomSourceOption(session.customSourceLayer);
  loadSourceImage(objectUrl, "本地源图资源");
});

canvas.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) {
    return;
  }

  const mapPoint =
    session.activeStep === "crop"
      ? hitTestMapCoordinate(canvas, event.clientX, event.clientY)
      : clientPointToEditorMapCoordinate(canvas, event.clientX, event.clientY);
  if (mapPoint == null) {
    return;
  }

  event.preventDefault();
  canvas.setPointerCapture(event.pointerId);
  if (session.activeStep === "crop") {
    session.cropDragStart = mapPoint;
    updateDraftCropFromDrag(mapPoint, mapPoint);
    return;
  }

  session.canvasDragState = {
    pointerId: event.pointerId,
    startClientX: event.clientX,
    startClientY: event.clientY,
    previousMapPoint: mapPoint,
    hasMoved: false,
  };
});

canvas.addEventListener("pointermove", (event) => {
  if (session.activeStep === "crop") {
    if (session.cropDragStart == null) {
      return;
    }

    const mapPoint = hitTestMapCoordinate(canvas, event.clientX, event.clientY);
    if (mapPoint == null) {
      return;
    }

    event.preventDefault();
    updateDraftCropFromDrag(session.cropDragStart, mapPoint);
    return;
  }

  const dragState = session.canvasDragState;
  if (dragState == null || dragState.pointerId !== event.pointerId) {
    return;
  }

  const mapPoint = clientPointToEditorMapCoordinate(canvas, event.clientX, event.clientY);
  if (mapPoint == null) {
    return;
  }
  const movedDistance = Math.hypot(
    event.clientX - dragState.startClientX,
    event.clientY - dragState.startClientY
  );
  if (movedDistance < 3 && !dragState.hasMoved) {
    return;
  }

  event.preventDefault();
  dragState.hasMoved = true;
  session.editorViewBox = panEditorViewBox(
    session.editorViewBox,
    {
      x: dragState.previousMapPoint.x - mapPoint.x,
      y: dragState.previousMapPoint.y - mapPoint.y,
    },
    coordinateSpace
  );
  dragState.previousMapPoint = mapPoint;
  render();
});

canvas.addEventListener("pointerup", (event) => {
  if (session.activeStep === "crop") {
    session.cropDragStart = null;
  } else if (session.canvasDragState?.pointerId === event.pointerId) {
    session.canvasDragState = {
      ...session.canvasDragState,
      pointerId: -1,
    };
  }

  if (canvas.hasPointerCapture(event.pointerId)) {
    canvas.releasePointerCapture(event.pointerId);
  }
});

canvas.addEventListener("click", (event) => {
  if (session.canvasDragState?.hasMoved) {
    session.canvasDragState = null;
    return;
  }
  session.canvasDragState = null;
  handleCanvasInteraction(event.clientX, event.clientY, false);
});

canvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  handleCanvasInteraction(event.clientX, event.clientY, true);
});

canvas.addEventListener(
  "wheel",
  (event) => {
    if (session.activeStep === "crop") {
      return;
    }

    const anchor = clientPointToEditorMapCoordinate(canvas, event.clientX, event.clientY);
    if (anchor == null) {
      return;
    }

    event.preventDefault();
    const zoomFactor = event.deltaY < 0 ? 1.15 : 1 / 1.15;
    session.editorViewBox = zoomEditorViewBox(
      session.editorViewBox,
      anchor,
      zoomFactor,
      coordinateSpace
    );
    render();
  },
  { passive: false }
);

window.addEventListener("resize", () => {
  render();
});

loadSourceImage(getActiveSourceLayer().imageUrl);
loadRegionSourceImage();
render();

function render(): void {
  rootElement.dataset.activeStep = session.activeStep;
  const validationIssues = validateCurrentState();
  const selectedHexKey = getSelectedHexKey();
  const selectedCell = selectedHexKey == null ? null : session.state.resolved.cellsByKey.get(selectedHexKey) ?? null;
  const generatedCell =
    selectedHexKey == null
      ? null
      : session.state.generated.cells.find((cell) => getCampaignHexCellKey(cell.x, cell.y) === selectedHexKey) ??
        null;
  const selectedSettlement = getSelectedSettlement();
  const selectedStructureOverlay = getActiveStructureOverlay();

  samplingInputs.cropX.value = `${session.draftSampling.sourceCrop.x}`;
  samplingInputs.cropY.value = `${session.draftSampling.sourceCrop.y}`;
  samplingInputs.cropWidth.value = `${session.draftSampling.sourceCrop.width}`;
  samplingInputs.cropHeight.value = `${session.draftSampling.sourceCrop.height}`;
  samplingInputs.scale.value = `${session.draftSampling.scale}`;
  samplingInputs.step.value = `${session.draftSampling.step}`;
  samplingInputs.offsetX.value = `${session.draftSampling.offsetX}`;
  samplingInputs.offsetY.value = `${session.draftSampling.offsetY}`;
  sourceLayerSelect.value = getActiveSourceLayer().id;
  sourceOverlayToggle.checked = session.showSourceOverlay;
  sourceOverlayToggle.disabled = session.activeStep === "crop";
  regionOverlayToggle.checked = session.showRegionOverlay;
  regionOverlayToggle.disabled = session.activeStep !== "edit" || session.state.regions.length === 0;
  samplingDirtyText.textContent = isSamplingDirty()
    ? "有未应用的裁切或采样参数"
    : "当前基线已使用这些参数";

  for (const button of stepButtons) {
    const step = button.dataset.editorStep as EditorStep;
    button.classList.toggle("is-active", step === session.activeStep);
    button.disabled = step === "edit" && session.activeStep !== "edit";
  }

  for (const panel of stepPanels) {
    panel.hidden = panel.dataset.stepPanel !== session.activeStep;
  }

  for (const element of editOnlyElements) {
    element.hidden = session.activeStep !== "edit";
  }

  settlementNameInput.value = session.settlementDraftName;
  settlementTypeSelect.value = session.settlementDraftType;
  settlementVisualSelect.value = session.settlementDraftCustomVisualKind;
  structureIdInput.value = session.structureDraftId;
  structureCategorySelect.value = session.structureDraftCategory;

  const activeToolDefinition = getEditorToolDefinition(
    session.state.project.uiState.activeToolId as EditorToolId
  );

  for (const button of toolButtons) {
    const isActive = button.dataset.tool === session.state.project.uiState.activeToolId;
    button.classList.toggle("is-active", isActive);
  }

  for (const panel of toolPanels) {
    panel.hidden = panel.dataset.toolPanel !== session.state.project.uiState.activeToolId;
  }

  const previewGeneratedGrid =
    session.activeStep === "sampling"
      ? generateBaselineHexGrid(session.draftSampling, session.sourceRaster)
      : null;
  const previewInnerSamplePoints =
    session.activeStep === "sampling" ? countHexInnerSamplePoints(session.draftSampling) : null;

  drawYuanmoHexEditorCanvas(canvas, {
    mode: session.activeStep,
    viewportMode: session.activeStep === "crop" ? "source-map" : "manual-hex",
    manualViewBox: session.activeStep === "crop" ? null : session.editorViewBox,
    state: session.state,
    coordinateSpace,
    sourceImage:
      session.sourceImageState === "ready"
        ? session.sourceImage
        : null,
    sourceImageOverlay: session.activeStep !== "crop" && session.showSourceOverlay,
    regionOverlay: session.activeStep === "edit" && session.showRegionOverlay,
    sourceCropPreview: session.draftSampling.sourceCrop,
    sampling: session.activeStep === "sampling" ? session.draftSampling : session.state.project.sampling,
    previewGeneratedGrid,
    selectedHexKey,
    showValidationOverlay: session.state.project.uiState.showValidationOverlay,
    validationIssues,
  });

  canvasStatus.textContent = [
    `步骤：${getEditorStepLabel(session.activeStep)}`,
    `工具：${activeToolDefinition.label}`,
    `源图：${describeSourceImageState(session.sourceImageState)}`,
    `采样源：${session.sourceRaster == null ? "旧hex兜底" : "原图像素"}`,
    `区域图：${describeSourceImageState(session.regionImageState)}`,
    `区域数：${session.state.regions.length}`,
    `底图：${getActiveSourceLayer().label}`,
    `预览格数：${previewGeneratedGrid?.cells.length ?? session.state.resolved.cells.length}`,
    `单格判定取样点：${previewInnerSamplePoints ?? countHexInnerSamplePoints(session.draftSampling)}`,
    `源图步长：${session.draftSampling.step}`,
    `裁切：${formatCropRect(session.draftSampling.sourceCrop)}`,
  ].join(" | ");

  selectionSummary.textContent = formatSummary({
    当前工具: activeToolDefinition.label,
    选中六边形: selectedHexKey ?? "无",
    选中节点: session.state.project.uiState.selectedSettlementId ?? "无",
    当前建筑覆盖: session.activeStructureOverlayId ?? "无",
  });

  baselineSummary.textContent =
    generatedCell == null
      ? "选择一个六边形查看自动生成的基线信息。"
      : formatSummary({
          陆地: generatedCell.land,
          地形: getTerrainLabel(generatedCell.terrain),
          地貌: getEnvironmentLabel(generatedCell.environment),
          高度参考: generatedCell.referenceHeight,
        });

  overrideSummary.textContent =
    generatedCell == null
      ? "尚未选中六边形。"
      : formatSummary({
          水陆覆盖:
            session.state.waterLandOverrides.find(
              (override) =>
                override.x === generatedCell.x && override.y === generatedCell.y
            )?.land ?? "无",
          地形覆盖:
            session.state.terrainOverrides.find(
              (override) =>
                override.x === generatedCell.x && override.y === generatedCell.y
            )?.terrain ?? "无",
          地貌覆盖:
            session.state.environmentOverrides.find(
              (override) =>
                override.x === generatedCell.x && override.y === generatedCell.y
            )?.environment ?? "无",
          建筑覆盖: session.state.structureOverlays
            .filter((overlay) =>
              overlay.cells.some(
                (cell) => cell.x === generatedCell.x && cell.y === generatedCell.y
              )
            )
            .map((overlay) => overlay.id)
            .join(", ") || "无",
        });

  resolvedSummary.textContent =
    selectedCell == null
      ? "选择一个六边形查看最终语义结果。"
      : formatSummary({
          陆地: selectedCell.land,
          地形: getTerrainLabel(selectedCell.terrain),
          地貌: getEnvironmentLabel(selectedCell.environment),
          地块视觉:
            selectedCell.structureGround == null
              ? "无"
              : getStructureOverlayLabel(selectedCell.structureGround),
          节点: selectedCell.settlementId ?? "无",
          可通行:
            session.state.resolved.passabilityByCellKey.get(selectedCell.key)?.isPassable ?? false,
        });

  settlementSummary.textContent =
    selectedSettlement == null
      ? "当前没有选中节点。"
      : formatSummary({
          ID: selectedSettlement.id,
          名称: selectedSettlement.name,
          类型: getSettlementTypeLabel(selectedSettlement.type),
          自定义视觉: selectedSettlement.customVisualKind == null
            ? "无"
            : getStructureOverlayLabel(selectedSettlement.customVisualKind),
          地图坐标: `${Math.round(selectedSettlement.mapPosition.x)}, ${Math.round(selectedSettlement.mapPosition.y)}`,
          六边形: `${selectedSettlement.hexCell.x}, ${selectedSettlement.hexCell.y}`,
        });

  renderValidationList(validationIssues);
  renderPackagePanel();
  statusTextElement.textContent = session.statusText;

  if (selectedSettlement != null) {
    settlementNameInput.value = selectedSettlement.name;
    settlementTypeSelect.value = selectedSettlement.type;
    settlementVisualSelect.value =
      selectedSettlement.customVisualKind ?? session.settlementDraftCustomVisualKind;
  }

  if (selectedStructureOverlay != null) {
    structureIdInput.value = selectedStructureOverlay.id;
    structureCategorySelect.value = selectedStructureOverlay.category;
  }
}

function handleCanvasInteraction(clientX: number, clientY: number, removeMode: boolean): void {
  if (session.activeStep !== "edit") {
    return;
  }

  const hit = hitTestHexCell(canvas, clientX, clientY);
  if (hit == null) {
    return;
  }

  const resolvedCell = session.state.resolved.cellsByKey.get(hit.cellKey);
  if (resolvedCell == null) {
    return;
  }

  session.state.project.uiState.selectedHexCell = { ...hit.hexCell };
  if (
    (session.state.project.uiState.activeToolId as EditorToolId) !== "settlement" ||
    removeMode ||
    resolvedCell.settlementId != null
  ) {
    session.state.project.uiState.selectedSettlementId = resolvedCell.settlementId;
  }

  switch (session.state.project.uiState.activeToolId as EditorToolId) {
    case "water":
      if (removeMode) {
        removeWaterLandOverride(hit.hexCell.x, hit.hexCell.y);
      } else {
        setWaterLandOverride(hit.hexCell.x, hit.hexCell.y, false);
      }
      break;
    case "land":
      if (removeMode) {
        removeWaterLandOverride(hit.hexCell.x, hit.hexCell.y);
      } else {
        setWaterLandOverride(hit.hexCell.x, hit.hexCell.y, true);
      }
      break;
    case "terrain":
      if (removeMode) {
        removeTerrainOverride(hit.hexCell.x, hit.hexCell.y);
      } else {
        setTerrainOverride(hit.hexCell.x, hit.hexCell.y, terrainSelect.value as TerrainOverride["terrain"]);
      }
      break;
    case "environment":
      if (removeMode) {
        removeEnvironmentOverride(hit.hexCell.x, hit.hexCell.y);
      } else {
        setEnvironmentOverride(
          hit.hexCell.x,
          hit.hexCell.y,
          environmentSelect.value as EnvironmentOverride["environment"]
        );
      }
      break;
    case "settlement":
      if (removeMode) {
        removeSettlementAtHex(hit.hexCell.x, hit.hexCell.y);
      } else {
        placeSettlementAtHex(hit.hexCell.x, hit.hexCell.y);
      }
      break;
    case "structure":
      if (removeMode) {
        removeStructureOverlayCell(hit.hexCell.x, hit.hexCell.y);
      } else {
        toggleStructureOverlayCell(hit.hexCell.x, hit.hexCell.y);
      }
      break;
    default:
      session.statusText = `已选中六边形 ${hit.hexCell.x},${hit.hexCell.y}。`;
      syncDraftsFromState();
      render();
      break;
  }
}

function setWaterLandOverride(x: number, y: number, land: boolean): void {
  const generatedCell = session.state.generated.cells.find((cell) => cell.x === x && cell.y === y);
  if (generatedCell == null) {
    return;
  }

  const nextOverrides = upsertWaterLandOverride(session.state.waterLandOverrides, { x, y, land });
  const normalizedOverrides =
    generatedCell.land === land
      ? nextOverrides.filter((override) => !(override.x === x && override.y === y))
      : nextOverrides;

  rebuildState({ waterLandOverrides: normalizedOverrides });
  session.statusText = `已把 ${x},${y} 的水陆结果覆盖为${land ? "陆地" : "水域"}。`;
  render();
}

function removeWaterLandOverride(x: number, y: number): void {
  rebuildState({
    waterLandOverrides: session.state.waterLandOverrides.filter(
      (override) => !(override.x === x && override.y === y)
    ),
  });
  session.statusText = `已移除 ${x},${y} 的水陆覆盖。`;
  render();
}

function setTerrainOverride(x: number, y: number, terrain: TerrainOverride["terrain"]): void {
  const generatedCell = session.state.generated.cells.find((cell) => cell.x === x && cell.y === y);
  if (generatedCell == null) {
    return;
  }

  const nextOverrides = upsertTerrainOverride(session.state.terrainOverrides, { x, y, terrain });
  const normalizedOverrides =
    generatedCell.terrain === terrain
      ? nextOverrides.filter((override) => !(override.x === x && override.y === y))
      : nextOverrides;

  rebuildState({ terrainOverrides: normalizedOverrides });
  session.statusText = `已把 ${x},${y} 的地形覆盖为 ${getTerrainLabel(terrain)}。`;
  render();
}

function removeTerrainOverride(x: number, y: number): void {
  rebuildState({
    terrainOverrides: session.state.terrainOverrides.filter(
      (override) => !(override.x === x && override.y === y)
    ),
  });
  session.statusText = `已移除 ${x},${y} 的地形覆盖。`;
  render();
}

function setEnvironmentOverride(
  x: number,
  y: number,
  environment: EnvironmentOverride["environment"]
): void {
  const generatedCell = session.state.generated.cells.find((cell) => cell.x === x && cell.y === y);
  if (generatedCell == null) {
    return;
  }

  const nextOverrides = upsertEnvironmentOverride(session.state.environmentOverrides, {
    x,
    y,
    environment,
  });
  const normalizedOverrides =
    generatedCell.environment === environment
      ? nextOverrides.filter((override) => !(override.x === x && override.y === y))
      : nextOverrides;

  rebuildState({ environmentOverrides: normalizedOverrides });
  session.statusText = `已把 ${x},${y} 的地貌覆盖为 ${getEnvironmentLabel(environment)}。`;
  render();
}

function removeEnvironmentOverride(x: number, y: number): void {
  rebuildState({
    environmentOverrides: session.state.environmentOverrides.filter(
      (override) => !(override.x === x && override.y === y)
    ),
  });
  session.statusText = `已移除 ${x},${y} 的地貌覆盖。`;
  render();
}

function placeSettlementAtHex(x: number, y: number): void {
  const mapPosition = hexToCoordinate({ x, y }, coordinateSpace);
  const selectedSettlement = getSelectedSettlement();
  const name =
    session.settlementDraftName.trim().length > 0
      ? session.settlementDraftName.trim()
      : `节点 ${session.state.settlements.length + 1}`;

  if (selectedSettlement != null) {
    session.statusText = `已把节点 ${selectedSettlement.id} 移动到 ${x},${y}。`;
    const settlementPatch: Partial<SettlementRecord> = {
      name,
      type: session.settlementDraftType,
      mapPosition,
      hexCell: { x, y },
    };
    if (session.settlementDraftType === "custom") {
      settlementPatch.customVisualKind = session.settlementDraftCustomVisualKind;
    }
    updateSettlement(selectedSettlement.id, settlementPatch);
    return;
  }

  const nextSettlementBase = {
    id: createNextSettlementId(
      name,
      session.settlementDraftType,
      session.state.settlements.map((entry) => entry.id)
    ),
    name,
    type: session.settlementDraftType,
    mapPosition,
    hexCell: { x, y },
  };
  const nextSettlement = buildSettlementRecord(
    nextSettlementBase,
    session.settlementDraftType === "custom"
      ? session.settlementDraftCustomVisualKind
      : undefined
  );

  rebuildState({
    settlements: [...session.state.settlements, nextSettlement],
  });
  session.state.project.uiState.selectedSettlementId = nextSettlement.id;
  session.statusText = `已在 ${x},${y} 放置节点 ${nextSettlement.id}。`;
  syncDraftsFromState();
  render();
}

function removeSettlementAtHex(x: number, y: number): void {
  const settlement = session.state.settlements.find(
    (entry) => entry.hexCell.x === x && entry.hexCell.y === y
  );
  if (settlement == null) {
    session.statusText = `${x},${y} 没有节点。`;
    render();
    return;
  }

  rebuildState({
    settlements: session.state.settlements.filter((entry) => entry.id !== settlement.id),
  });
  if (session.state.project.uiState.selectedSettlementId === settlement.id) {
    session.state.project.uiState.selectedSettlementId = null;
  }
  session.statusText = `已删除节点 ${settlement.id}。`;
  render();
}

function toggleStructureOverlayCell(x: number, y: number): void {
  if (session.activeStructureOverlayId == null) {
    const clickedOverlay = getOverlayForHex(x, y);
    if (clickedOverlay != null) {
      session.activeStructureOverlayId = clickedOverlay.id;
      session.structureDraftId = clickedOverlay.id;
      session.structureDraftCategory = clickedOverlay.category;
    }
  }
  const activeOverlay = ensureActiveStructureOverlay();
  const cellKey = getCampaignHexCellKey(x, y);
  const hasCell = activeOverlay.cells.some(
    (entry) => getCampaignHexCellKey(entry.x, entry.y) === cellKey
  );
  const nextOverlay: StructureOverlayRecord = {
    ...activeOverlay,
    cells: hasCell
      ? activeOverlay.cells.filter(
          (entry) => getCampaignHexCellKey(entry.x, entry.y) !== cellKey
        )
      : [...activeOverlay.cells, { x, y }],
  };

  const nextOverlays = session.state.structureOverlays.map((overlay) =>
    overlay.id === activeOverlay.id ? nextOverlay : overlay
  );
  rebuildState({
    structureOverlays: nextOverlays.filter((overlay) => overlay.cells.length > 0),
  });
  session.activeStructureOverlayId = nextOverlay.cells.length === 0 ? null : nextOverlay.id;
  session.statusText = hasCell
    ? `已从建筑覆盖层 ${activeOverlay.id} 移除 ${x},${y}。`
    : `已把 ${x},${y} 加入建筑覆盖层 ${activeOverlay.id}。`;
  render();
}

function removeStructureOverlayCell(x: number, y: number): void {
  const overlay = getOverlayForHex(x, y) ?? getActiveStructureOverlay();
  if (overlay == null) {
    session.statusText = `${x},${y} 不在任何建筑覆盖层内。`;
    render();
    return;
  }

  const nextOverlay = {
    ...overlay,
    cells: overlay.cells.filter((entry) => !(entry.x === x && entry.y === y)),
  };
  rebuildState({
    structureOverlays: session.state.structureOverlays
      .map((entry) => (entry.id === overlay.id ? nextOverlay : entry))
      .filter((entry) => entry.cells.length > 0),
  });
  if (nextOverlay.cells.length === 0 && session.activeStructureOverlayId === overlay.id) {
    session.activeStructureOverlayId = null;
  }
  session.statusText = `已从建筑覆盖层 ${overlay.id} 移除 ${x},${y}。`;
  render();
}

function updateSettlement(
  settlementId: string,
  patch: Partial<SettlementRecord>
): void {
  const current = session.state.settlements.find((entry) => entry.id === settlementId);
  if (current == null) {
    return;
  }
  const nextType = patch.type ?? current.type;
  const nextSettlementBase = {
    ...current,
    ...patch,
  };
  const nextSettlement = buildSettlementRecord(
    nextSettlementBase,
    nextType === "custom"
      ? patch.customVisualKind ??
          current.customVisualKind ??
          session.settlementDraftCustomVisualKind
      : undefined
  );
  rebuildState({
    settlements: session.state.settlements.map((entry) =>
      entry.id === settlementId ? nextSettlement : entry
    ),
  });
  session.state.project.uiState.selectedSettlementId = settlementId;
  syncDraftsFromState();
  render();
}

function renameActiveStructureOverlay(nextId: string): void {
  const overlay = getActiveStructureOverlay();
  if (overlay == null || nextId.trim().length === 0) {
    render();
    return;
  }

  const trimmedId = nextId.trim();
  rebuildState({
    structureOverlays: session.state.structureOverlays.map((entry) =>
      entry.id === overlay.id ? { ...entry, id: trimmedId } : entry
    ),
  });
  session.activeStructureOverlayId = trimmedId;
  session.structureDraftId = trimmedId;
  render();
}

function updateActiveStructureOverlayCategory(category: StructureOverlayCategory): void {
  const overlay = getActiveStructureOverlay();
  if (overlay == null) {
    render();
    return;
  }

  rebuildState({
    structureOverlays: session.state.structureOverlays.map((entry) =>
      entry.id === overlay.id ? { ...entry, category } : entry
    ),
  });
  session.structureDraftCategory = category;
  render();
}

function ensureActiveStructureOverlay(): StructureOverlayRecord {
  const existing = getActiveStructureOverlay();
  if (existing != null) {
    return existing;
  }

  const overlayId =
    session.structureDraftId.trim().length > 0
      ? session.structureDraftId.trim()
      : createNextStructureOverlayId(
          session.structureDraftCategory,
          session.state.structureOverlays.map((overlay) => overlay.id)
        );
  const nextOverlay: StructureOverlayRecord = {
    id: overlayId,
    category: session.structureDraftCategory,
    cells: [],
  };

  rebuildState({
    structureOverlays: [...session.state.structureOverlays, nextOverlay],
  });
  session.activeStructureOverlayId = overlayId;
  session.structureDraftId = overlayId;
  return getActiveStructureOverlay() ?? nextOverlay;
}

function getActiveStructureOverlay(): StructureOverlayRecord | null {
  if (session.activeStructureOverlayId == null) {
    return null;
  }
  return (
    session.state.structureOverlays.find(
      (overlay) => overlay.id === session.activeStructureOverlayId
    ) ?? null
  );
}

function getOverlayForHex(x: number, y: number): StructureOverlayRecord | null {
  return (
    session.state.structureOverlays.find((overlay) =>
      overlay.cells.some((entry) => entry.x === x && entry.y === y)
    ) ?? null
  );
}

function rebuildState(
  patch: Partial<{
    generated: YuanmoHexEditorState["generated"];
    waterLandOverrides: WaterLandOverride[];
    terrainOverrides: TerrainOverride[];
    environmentOverrides: EnvironmentOverride[];
    settlements: SettlementRecord[];
    structureOverlays: StructureOverlayRecord[];
    regions: YuanmoHexEditorState["regions"];
  }>
): void {
  session.state = createEditorStateFromPackageData({
    project: session.state.project,
    generated: patch.generated ?? session.state.generated,
    waterLandOverrides: patch.waterLandOverrides ?? session.state.waterLandOverrides,
    terrainOverrides: patch.terrainOverrides ?? session.state.terrainOverrides,
    environmentOverrides: patch.environmentOverrides ?? session.state.environmentOverrides,
    settlements: patch.settlements ?? session.state.settlements,
    structureOverlays: patch.structureOverlays ?? session.state.structureOverlays,
    regions: patch.regions ?? session.state.regions,
  });
  syncDraftsFromState();
}

function exportCurrentPackage(): Record<string, string> {
  session.packageFiles = exportEditorPackage(session.state);
  session.selectedPackageFile = firstPackageFileName(session.packageFiles);
  return session.packageFiles;
}

function renderPackagePanel(): void {
  const packageFiles = session.packageFiles;
  const fileNames = Object.keys(packageFiles);
  packageFileSelect.innerHTML = "";

  if (fileNames.length === 0) {
    packageOutput.value = "还没有导出任何中间产物。点击“导出包”或“保存快照”后，这里会显示文件内容。";
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "暂无文件";
    packageFileSelect.append(option);
    packageFileSelect.disabled = true;
    return;
  }

  if (!fileNames.includes(session.selectedPackageFile)) {
    session.selectedPackageFile = firstPackageFileName(packageFiles);
  }

  packageFileSelect.disabled = false;
  for (const fileName of orderedPackageFileNames(fileNames)) {
    const option = document.createElement("option");
    option.value = fileName;
    option.textContent = fileName;
    option.selected = fileName === session.selectedPackageFile;
    packageFileSelect.append(option);
  }

  packageOutput.value = packageFiles[session.selectedPackageFile] ?? "";
}

function renderValidationList(validationIssues: ValidationIssue[]): void {
  validationList.innerHTML = "";
  if (validationIssues.length === 0) {
    const item = document.createElement("li");
    item.textContent = "当前没有校验问题。";
    validationList.append(item);
    return;
  }

  for (const issue of validationIssues) {
    const item = document.createElement("li");
    item.textContent = issue.message;
    validationList.append(item);
  }
}

function validateCurrentState(): ValidationIssue[] {
  return validateEditorProject({
    resolved: session.state.resolved,
    settlements: session.state.settlements,
    terrainOverrides: session.state.terrainOverrides,
    environmentOverrides: session.state.environmentOverrides,
    structureOverlays: session.state.structureOverlays,
  });
}

function syncDraftsFromState(): void {
  session.draftSampling = { ...session.state.project.sampling };
  const selectedSettlement = getSelectedSettlement();
  if (selectedSettlement != null) {
    session.settlementDraftName = selectedSettlement.name;
    session.settlementDraftType = selectedSettlement.type;
    session.settlementDraftCustomVisualKind =
      selectedSettlement.customVisualKind ?? session.settlementDraftCustomVisualKind;
  }

  const activeOverlay = getActiveStructureOverlay();
  if (activeOverlay != null) {
    session.structureDraftId = activeOverlay.id;
    session.structureDraftCategory = activeOverlay.category;
  } else if (session.structureDraftId.trim().length === 0) {
    session.structureDraftId = createNextStructureOverlayId(
      session.structureDraftCategory,
      session.state.structureOverlays.map((overlay) => overlay.id)
    );
  }
}

function confirmCropStep(): void {
  session.draftSampling = normalizeYuanmoHexSamplingConfig(session.draftSampling);
  session.editorViewBox = createCropEditorViewBox(session.draftSampling.sourceCrop, coordinateSpace);
  session.activeStep = "sampling";
  session.statusText = `已确认裁剪 ${formatCropRect(session.draftSampling.sourceCrop)}，现在调整采样尺度和步长。`;
  render();
}

function confirmSamplingStep(): void {
  session.draftSampling = normalizeYuanmoHexSamplingConfig(session.draftSampling);
  session.state = regenerateEditorState(
    session.state,
    session.draftSampling,
    session.sourceRaster,
    { sourceMapNodes: yuanmoCampaignMap.nodes, regionRaster: session.regionRaster }
  );
  session.activeStep = "edit";
  session.state.project.uiState.activeToolId = "water";
  session.statusText = `已确认采样并进入微调。裁切 ${formatCropRect(
    session.state.project.sampling.sourceCrop
  )}，尺度 ${session.state.project.sampling.scale}，步长 ${session.state.project.sampling.step}，偏移 (${session.state.project.sampling.offsetX}, ${session.state.project.sampling.offsetY})。`;
  render();
}

function updateDraftCropFromDrag(
  start: { x: number; y: number },
  end: { x: number; y: number }
): void {
  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  const width = Math.max(1, Math.abs(end.x - start.x));
  const height = Math.max(1, Math.abs(end.y - start.y));
  session.draftSampling = normalizeYuanmoHexSamplingConfig({
    ...session.draftSampling,
    sourceCrop: { x, y, width, height },
  });
  render();
}

function ensureCustomSourceOption(option: SourceMapLayerOption): void {
  const existingOption = sourceLayerSelect.querySelector<HTMLOptionElement>('option[value="custom"]');
  if (existingOption != null) {
    existingOption.textContent = option.label;
    return;
  }

  const element = document.createElement("option");
  element.value = option.id;
  element.textContent = option.label;
  sourceLayerSelect.append(element);
}

function getSelectedSettlement(): SettlementRecord | null {
  const settlementId = session.state.project.uiState.selectedSettlementId;
  if (settlementId == null) {
    return null;
  }
  return session.state.settlements.find((entry) => entry.id === settlementId) ?? null;
}

function getSelectedHexKey(): string | null {
  const selectedHexCell = session.state.project.uiState.selectedHexCell;
  if (selectedHexCell == null) {
    return null;
  }
  return getCampaignHexCellKey(selectedHexCell.x, selectedHexCell.y);
}

function wireAction(actionId: string, handler: () => void): void {
  const buttons = [...rootElement.querySelectorAll<HTMLButtonElement>(`[data-action="${actionId}"]`)];
  if (buttons.length === 0) {
    throw new Error(`缺少必要操作按钮：${actionId}`);
  }
  for (const button of buttons) {
    button.addEventListener("click", handler);
  }
}

function requireElement<TElement extends Element>(selector: string): TElement {
  const element = rootElement.querySelector<TElement>(selector);
  if (element == null) {
    throw new Error(`缺少必要元素：${selector}`);
  }
  return element;
}

function loadRegionSourceImage(): void {
  if (regionSourceLayer == null) {
    session.regionRaster = null;
    session.regionImageState = "error";
    return;
  }

  const image = new Image();
  image.decoding = "async";
  image.addEventListener("load", () => {
    session.regionRaster = createRasterLayerDataFromImage(image);
    session.regionImageState = session.regionRaster == null ? "error" : "ready";
    render();
  });
  image.addEventListener("error", () => {
    session.regionRaster = null;
    session.regionImageState = "error";
    render();
  });
  image.src = regionSourceLayer.imageUrl;
}

function loadSourceImage(url: string, label = "固定源图资源"): void {
  const image = new Image();
  image.decoding = "async";
  image.addEventListener("load", () => {
    session.sourceImage = image;
    session.sourceRaster = createRasterSourceFromImage(image);
    session.sourceImageState = "ready";
    session.statusText = `已载入${label}。`;
    render();
  });
  image.addEventListener("error", () => {
    session.sourceImage = null;
    session.sourceRaster = null;
    session.sourceImageState = "error";
    session.statusText = `${label}加载失败。`;
    render();
  });
  image.src = url;
}

function createRasterSourceFromImage(image: HTMLImageElement): YuanmoHexRasterSource | null {
  const layer = createRasterLayerDataFromImage(image);
  if (layer == null) {
    return null;
  }

  return {
    groundTypes: layer,
  };
}

function createRasterLayerDataFromImage(image: HTMLImageElement): YuanmoHexRasterLayerData | null {
  const rasterCanvas = document.createElement("canvas");
  rasterCanvas.width = Math.max(1, image.naturalWidth);
  rasterCanvas.height = Math.max(1, image.naturalHeight);
  const context = rasterCanvas.getContext("2d", { willReadFrequently: true });
  if (context == null) {
    return null;
  }

  context.drawImage(image, 0, 0, rasterCanvas.width, rasterCanvas.height);
  const imageData = context.getImageData(0, 0, rasterCanvas.width, rasterCanvas.height);
  return {
    width: imageData.width,
    height: imageData.height,
    data: imageData.data,
  };
}

function formatSummary(record: Record<string, unknown>): string {
  return Object.entries(record)
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join("\n");
}

function upsertWaterLandOverride(
  overrides: WaterLandOverride[],
  nextOverride: WaterLandOverride
): WaterLandOverride[] {
  return upsertByCoordinate(overrides, nextOverride, (entry) => entry.land === nextOverride.land);
}

function upsertTerrainOverride(
  overrides: TerrainOverride[],
  nextOverride: TerrainOverride
): TerrainOverride[] {
  return upsertByCoordinate(overrides, nextOverride, (entry) => entry.terrain === nextOverride.terrain);
}

function upsertEnvironmentOverride(
  overrides: EnvironmentOverride[],
  nextOverride: EnvironmentOverride
): EnvironmentOverride[] {
  return upsertByCoordinate(
    overrides,
    nextOverride,
    (entry) => entry.environment === nextOverride.environment
  );
}

function upsertByCoordinate<TEntry extends { x: number; y: number }>(
  entries: TEntry[],
  nextEntry: TEntry,
  isSameValue: (entry: TEntry) => boolean
): TEntry[] {
  const index = entries.findIndex(
    (entry) => entry.x === nextEntry.x && entry.y === nextEntry.y
  );
  if (index === -1) {
    return [...entries, nextEntry];
  }

  const currentEntry = entries[index];
  if (currentEntry != null && isSameValue(currentEntry)) {
    return [...entries];
  }

  return entries.map((entry, entryIndex) => (entryIndex === index ? nextEntry : entry));
}

function orderedPackageFileNames(fileNames: string[]): string[] {
  const preferredOrder = Object.values(YUANMO_HEX_EDITOR_PACKAGE_FILES);
  return [...fileNames].sort((left, right) => {
    const leftIndex = preferredOrder.indexOf(left as (typeof preferredOrder)[number]);
    const rightIndex = preferredOrder.indexOf(right as (typeof preferredOrder)[number]);
    return normalizeOrderIndex(leftIndex) - normalizeOrderIndex(rightIndex) || left.localeCompare(right);
  });
}

function firstPackageFileName(files: Record<string, string>): string {
  return orderedPackageFileNames(Object.keys(files))[0] ?? "";
}

function normalizeOrderIndex(index: number): number {
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function downloadTextFile(fileName: string, content: string): void {
  const blob = new Blob([content], { type: "application/json" });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function getActiveSourceLayer(): SourceMapLayerOption {
  if (session.customSourceLayer != null && session.activeSourceLayerId === session.customSourceLayer.id) {
    return session.customSourceLayer;
  }

  return (
    sourceMapLayerOptions.find((option) => option.id === session.activeSourceLayerId) ??
    sourceMapLayerOptions[0] ?? {
      id: "empty",
      label: "无底图",
      imageUrl: "",
    }
  );
}

function getSourceLayerLabel(layerId: string): string {
  switch (layerId) {
    case "map_ground_types":
      return "项目采样图（map_ground_types）";
    case "map_heights":
      return "高度图";
    case "map_climates":
      return "气候图";
    case "map_regions":
      return "区域图";
    default:
      return layerId;
  }
}

function getEditorStepLabel(step: EditorStep): string {
  switch (step) {
    case "crop":
      return "裁剪";
    case "sampling":
      return "采样";
    case "edit":
      return "微调";
  }
}

function isSamplingDirty(): boolean {
  const applied = session.state.project.sampling;
  const draft = session.draftSampling;

  return (
    applied.scale !== draft.scale ||
    applied.step !== draft.step ||
    applied.offsetX !== draft.offsetX ||
    applied.offsetY !== draft.offsetY ||
    applied.sourceCrop.x !== draft.sourceCrop.x ||
    applied.sourceCrop.y !== draft.sourceCrop.y ||
    applied.sourceCrop.width !== draft.sourceCrop.width ||
    applied.sourceCrop.height !== draft.sourceCrop.height
  );
}

function formatCropRect(crop: YuanmoHexSamplingConfig["sourceCrop"]): string {
  return `${crop.x},${crop.y},${crop.width}x${crop.height}`;
}

function describeSourceImageState(state: EditorSession["sourceImageState"]): string {
  switch (state) {
    case "ready":
      return "已载入";
    case "error":
      return "加载失败";
    default:
      return "加载中";
  }
}

function buildSettlementRecord(
  base: Omit<SettlementRecord, "customVisualKind">,
  customVisualKind: CustomSettlementVisualKind | undefined
): SettlementRecord {
  if (customVisualKind == null) {
    return base;
  }

  return {
    ...base,
    customVisualKind,
  };
}
