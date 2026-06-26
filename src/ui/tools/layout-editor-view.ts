import { globalHudBackgroundOptions } from "../../content/layout-editor-presets";
import type { AppState } from "../../application/app-shell";
import {
  getLayoutEditorTarget,
  layoutEditorTargets,
} from "../../application/layout-editor/layout-editor-target-registry";
import { uiLayoutComponentBaseSizeById } from "../../domain/ui-layout";
import type {
  LayoutBackgroundAssetOption,
  UiLayout,
  UiLayoutBackgroundMode,
  UiLayoutComponent,
  UiLayoutElement,
} from "../../domain/ui-layout";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getLayoutForEditor(appState: AppState): UiLayout {
  return appState.uiLayouts[appState.layoutEditor.selectedTargetId];
}

function getBackgroundPreviewStyle(component: UiLayoutComponent): string {
  const background = component.background;
  if (background == null) {
    return "";
  }

  if (background.mode === "nine-slice") {
    return [
      "border-style:solid",
      `border-width:${background.slice.top}px ${background.slice.right}px ${background.slice.bottom}px ${background.slice.left}px`,
      `border-image-source:url(${background.imageUrl})`,
      `border-image-slice:${background.slice.top} ${background.slice.right} ${background.slice.bottom} ${background.slice.left} fill`,
      `border-image-width:${background.slice.top} ${background.slice.right} ${background.slice.bottom} ${background.slice.left}`,
    ].join(";");
  }

  const backgroundSize =
    background.mode === "contain"
      ? "contain"
      : background.mode === "cover"
        ? "cover"
        : "100% 100%";

  return [
    `background-image:url(${background.imageUrl})`,
    "background-position:center",
    "background-repeat:no-repeat",
    `background-size:${backgroundSize}`,
  ].join(";");
}

function getPreviewContentStyle(component: UiLayoutComponent): string {
  const baseSize = uiLayoutComponentBaseSizeById[component.id];
  if (baseSize == null) {
    return "width:100%;height:100%;";
  }

  const scale = component.rect.width / Math.max(baseSize.width, 1);
  return [
    `width:${baseSize.width}px`,
    `height:${baseSize.height}px`,
    "transform-origin:top left",
    `transform:scale(${scale})`,
  ].join(";");
}

function renderTargetList(appState: AppState): string {
  return `
    <div class="c-layout-editor__section">
      <h3 class="c-layout-editor__section-title">可编辑界面</h3>
      <div class="c-layout-editor__list">
        ${layoutEditorTargets
          .map((target) => {
            const isSelected = appState.layoutEditor.selectedTargetId === target.id;
            return `
              <button
                type="button"
                class="c-layout-editor__list-button ${isSelected ? "is-selected" : ""}"
                data-layout-target-id="${target.id}"
              >
                ${escapeHtml(target.label)}
              </button>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function renderComponentList(appState: AppState): string {
  const layout = getLayoutForEditor(appState);
  return `
    <div class="c-layout-editor__section">
      <h3 class="c-layout-editor__section-title">组件列表</h3>
      <div class="c-layout-editor__list">
        ${layout.components
          .map(
            (component) => `
              <button
                type="button"
                class="c-layout-editor__list-button ${component.id === appState.layoutEditor.selectedComponentId ? "is-selected" : ""}"
                data-layout-component-select="${component.id}"
              >
                ${escapeHtml(component.label)}
              </button>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderAssetOptions(
  options: LayoutBackgroundAssetOption[],
  selectedAssetId: string | null
): string {
  return options
    .map(
      (option) => `
        <option value="${escapeHtml(option.id)}" ${option.id === selectedAssetId ? "selected" : ""}>
          ${escapeHtml(option.label)} [${escapeHtml(option.id)}]
        </option>
      `
    )
    .join("");
}

function filterAssetOptions(
  options: LayoutBackgroundAssetOption[],
  query: string
): LayoutBackgroundAssetOption[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length === 0) {
    return options;
  }

  return options.filter((option) => {
    const normalizedId = option.id.toLowerCase();
    const normalizedLabel = option.label.toLowerCase();
    return (
      normalizedLabel.includes(normalizedQuery) ||
      normalizedId.includes(normalizedQuery)
    );
  });
}

function renderModeOptions(selectedMode: UiLayoutBackgroundMode | null): string {
  const options: Array<{ id: UiLayoutBackgroundMode; label: string }> = [
    { id: "stretch", label: "拉伸" },
    { id: "contain", label: "完整包含" },
    { id: "cover", label: "覆盖裁切" },
    { id: "nine-slice", label: "九宫格切割" },
  ];

  return options
    .map(
      (option) => `
        <option value="${option.id}" ${option.id === selectedMode ? "selected" : ""}>
          ${option.label}
        </option>
      `
    )
    .join("");
}

function renderRectFieldGroup(input: {
  title: string;
  fieldPrefix: "component" | "element";
  componentId: string;
  elementId?: string | null;
  rect: UiLayoutComponent["rect"] | UiLayoutElement["rect"];
}): string {
  const elementAttribute =
    input.elementId == null ? "" : ` data-layout-element-id="${input.elementId}"`;

  return `
    <div class="c-layout-editor__section">
      <h3 class="c-layout-editor__section-title">${input.title}</h3>
      <div class="c-layout-editor__grid">
        ${(["x", "y", "width", "height"] as const)
          .map(
            (field) => `
              <label class="c-layout-editor__field">
                <span>${field}</span>
                <input
                  type="number"
                  value="${input.rect[field]}"
                  data-layout-${input.fieldPrefix}-field="${field}"
                  data-layout-component-id="${input.componentId}"
                  ${elementAttribute}
                />
              </label>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderBackgroundSection(
  appState: AppState,
  component: UiLayoutComponent
): string {
  const selectedAssetId = component.background?.assetId ?? null;
  const filteredOptions = filterAssetOptions(
    globalHudBackgroundOptions,
    appState.layoutEditor.backgroundAssetQuery
  );
  const visibleOptions =
    selectedAssetId != null &&
    !filteredOptions.some((option) => option.id === selectedAssetId)
      ? [
          ...globalHudBackgroundOptions.filter((option) => option.id === selectedAssetId),
          ...filteredOptions,
        ]
      : filteredOptions;

  return `
    <div class="c-layout-editor__section">
      <h3 class="c-layout-editor__section-title">底图</h3>
      <div class="c-layout-editor__stack">
        <label class="c-layout-editor__field">
          <span>项目文件筛选</span>
          <input
            type="text"
            value="${escapeHtml(appState.layoutEditor.backgroundAssetQuery)}"
            placeholder="输入文件名或路径"
            data-layout-background-asset-query
          />
        </label>
        <label class="c-layout-editor__field">
          <span>项目图片</span>
          <select data-layout-background-asset data-layout-component-id="${component.id}">
            ${renderAssetOptions(visibleOptions, selectedAssetId)}
          </select>
        </label>
        <label class="c-layout-editor__field">
          <span>模式</span>
          <select data-layout-background-mode data-layout-component-id="${component.id}">
            ${renderModeOptions(component.background?.mode ?? "stretch")}
          </select>
        </label>
        <div class="c-layout-editor__grid">
          ${(["top", "right", "bottom", "left"] as const)
            .map(
              (edge) => `
                <label class="c-layout-editor__field">
                  <span>slice-${edge}</span>
                  <input
                    type="number"
                    value="${component.background?.slice[edge] ?? 24}"
                    data-layout-slice-edge="${edge}"
                    data-layout-component-id="${component.id}"
                  />
                </label>
              `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

function renderElementList(
  appState: AppState,
  component: UiLayoutComponent
): string {
  return `
    <div class="c-layout-editor__section">
      <h3 class="c-layout-editor__section-title">内部元素</h3>
      <div class="c-layout-editor__list">
        ${component.elements
          .map(
            (element) => `
              <button
                type="button"
                class="c-layout-editor__list-button ${element.id === appState.layoutEditor.selectedElementId ? "is-selected" : ""}"
                data-layout-element-select="${component.id}:${element.id}"
              >
                ${escapeHtml(element.label)}
              </button>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderInspector(appState: AppState): string {
  const layout = getLayoutForEditor(appState);
  const component =
    layout.components.find(
      (entry) => entry.id === appState.layoutEditor.selectedComponentId
    ) ?? layout.components[0] ?? null;
  if (component == null) {
    return `
      <aside class="c-layout-editor__sidebar">
        <div class="c-layout-editor__section">
          <h3 class="c-layout-editor__section-title">没有可编辑组件</h3>
        </div>
      </aside>
    `;
  }
  const selectedElement =
    component.elements.find(
      (element) => element.id === appState.layoutEditor.selectedElementId
    ) ?? null;

  return `
    <aside class="c-layout-editor__sidebar">
      ${renderTargetList(appState)}
      ${renderComponentList(appState)}
      <div class="c-layout-editor__section c-layout-editor__section-actions">
        <button
          type="button"
          class="c-button c-button--ghost c-layout-editor__action-button"
          data-action="copy-layout-params"
        >
          复制完整布局参数
        </button>
      </div>
      ${renderBackgroundSection(appState, component)}
      ${renderRectFieldGroup({
        title: "组件位置",
        fieldPrefix: "component",
        componentId: component.id,
        rect: component.rect,
      })}
      ${renderElementList(appState, component)}
      ${
        selectedElement == null
          ? ""
          : renderRectFieldGroup({
              title: "元素位置",
              fieldPrefix: "element",
              componentId: component.id,
              elementId: selectedElement.id,
              rect: selectedElement.rect,
            })
      }
    </aside>
  `;
}

function renderPreviewComponent(
  appState: AppState,
  component: UiLayoutComponent
): string {
  const isSelected = component.id === appState.layoutEditor.selectedComponentId;

  return `
    <button
      type="button"
      class="c-layout-editor-preview__component ${isSelected ? "is-selected" : ""}"
      style="
        left:${component.rect.x}px;
        top:${component.rect.y}px;
        width:${component.rect.width}px;
        height:${component.rect.height}px;
      "
      data-layout-component-handle="${component.id}"
      data-layout-component-select="${component.id}"
      title="${escapeHtml(component.label)}"
    >
      <span class="c-layout-editor-preview__component-label">${escapeHtml(component.label)}</span>
      <span
        class="c-layout-editor-preview__resize-handle c-layout-editor-preview__resize-handle--corner"
        data-layout-component-resize="${component.id}"
        data-layout-resize-axis="xy"
        aria-hidden="true"
      ></span>
      <span
        class="c-layout-editor-preview__component-content"
        style="${getPreviewContentStyle(component)};${getBackgroundPreviewStyle(component)}"
      >
      ${component.elements
        .map((element) => {
          const elementSelected =
            isSelected && element.id === appState.layoutEditor.selectedElementId;

          return `
            <span
              class="c-layout-editor-preview__element ${elementSelected ? "is-selected" : ""}"
              style="
                left:${element.rect.x}px;
                top:${element.rect.y}px;
                width:${element.rect.width}px;
                height:${element.rect.height}px;
              "
              data-layout-element-handle="${component.id}:${element.id}"
              data-layout-element-select="${component.id}:${element.id}"
              title="${escapeHtml(element.label)}"
            >
              <span class="c-layout-editor-preview__element-label">${escapeHtml(element.label)}</span>
            </span>
          `;
        })
        .join("")}
      </span>
    </button>
  `;
}

function renderPreview(appState: AppState): string {
  const layout = getLayoutForEditor(appState);
  return `
    <section class="c-layout-editor__preview-shell">
      <header class="c-layout-editor__preview-header">
        <div>
          <p class="c-layout-editor__eyebrow">布局预览</p>
          <h2 class="c-layout-editor__preview-title">${escapeHtml(layout.label)}</h2>
        </div>
        <button type="button" class="c-button c-button--ghost" data-action="close-layout-editor">
          关闭编辑器
        </button>
      </header>
      <div class="c-layout-editor__preview-stage">
        <div
          class="c-layout-editor-preview"
          style="width:${layout.screenSize.width}px; height:${layout.screenSize.height}px;"
        >
          ${layout.components
            .map((component) => renderPreviewComponent(appState, component))
            .join("")}
        </div>
      </div>
    </section>
  `;
}

export function renderLayoutEditor(appState: AppState): string {
  if (!appState.layoutEditor.isOpen) {
    return `
      <button
        type="button"
        class="c-layout-editor-launch"
        data-action="open-layout-editor"
      >
        界面编辑器
      </button>
    `;
  }

  if (getLayoutEditorTarget(appState.layoutEditor.selectedTargetId).mode === "live") {
    return `
      <div class="c-layout-editor-live-panel">
        <button
          type="button"
          class="c-layout-editor-launch c-layout-editor-launch--open"
          data-action="close-layout-editor"
        >
          关闭编辑器
        </button>
        <div class="c-layout-editor-live-panel__body">
          ${renderInspector(appState)}
        </div>
      </div>
    `;
  }

  return `
    <div class="c-layout-editor-modal">
      <button
        type="button"
        class="c-layout-editor-launch c-layout-editor-launch--open"
        data-action="close-layout-editor"
      >
        关闭编辑器
      </button>
      <div class="c-layout-editor">
        ${renderInspector(appState)}
        ${renderPreview(appState)}
      </div>
    </div>
  `;
}
