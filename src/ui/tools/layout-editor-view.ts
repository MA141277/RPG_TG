import { globalHudBackgroundOptions } from "../../content/layout-editor-presets";
import type { AppState } from "../../application/app-shell";
import type {
  LayoutBackgroundAssetOption,
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

function getBackgroundPreviewStyle(component: UiLayoutComponent): string {
  const background = component.background;
  if (background == null) {
    return "";
  }

  const base: string[] = [];
  if (background.mode === "nine-slice") {
    base.push(
      `border-style:solid;`,
      `border-width:${background.slice.top}px ${background.slice.right}px ${background.slice.bottom}px ${background.slice.left}px;`,
      `border-image-source:url(${background.imageUrl});`,
      `border-image-slice:${background.slice.top} ${background.slice.right} ${background.slice.bottom} ${background.slice.left} fill;`,
      `border-image-width:${background.slice.top} ${background.slice.right} ${background.slice.bottom} ${background.slice.left};`
    );
  } else {
    const backgroundSize =
      background.mode === "contain"
        ? "contain"
        : background.mode === "cover"
          ? "cover"
          : "100% 100%";
    base.push(
      `background-image:url(${background.imageUrl});`,
      `background-position:center;`,
      `background-repeat:no-repeat;`,
      `background-size:${backgroundSize};`
    );
  }

  return base.join("");
}

function renderTargetList(appState: AppState): string {
  const isSelected = appState.layoutEditor.selectedTargetId === "global-hud";
  return `
    <div class="c-layout-editor__section">
      <h3 class="c-layout-editor__section-title">可编辑界面</h3>
      <button
        type="button"
        class="c-layout-editor__list-button ${isSelected ? "is-selected" : ""}"
        data-layout-target-id="global-hud"
      >
        顶部全局属性栏
      </button>
    </div>
  `;
}

function renderComponentList(appState: AppState): string {
  const layout = appState.uiLayouts.globalHud;
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
                ${component.label}
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
        <option value="${option.id}" ${option.id === selectedAssetId ? "selected" : ""}>
          ${option.label}
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

  return options.filter((option) =>
    option.label.toLowerCase().includes(normalizedQuery)
  );
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
            ${renderAssetOptions(
              visibleOptions,
              selectedAssetId
            )}
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
                ${element.label}
              </button>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderInspector(appState: AppState): string {
  const component =
    appState.uiLayouts.globalHud.components.find(
      (entry) => entry.id === appState.layoutEditor.selectedComponentId
    ) ?? appState.uiLayouts.globalHud.components[0] ?? null;
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
        ${getBackgroundPreviewStyle(component)}
      "
      data-layout-component-handle="${component.id}"
      data-layout-component-select="${component.id}"
      title="${escapeHtml(component.label)}"
    >
      <span class="c-layout-editor-preview__component-label">${component.label}</span>
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
              <span class="c-layout-editor-preview__element-label">${element.label}</span>
            </span>
          `;
        })
        .join("")}
    </button>
  `;
}

function renderPreview(appState: AppState): string {
  const layout = appState.uiLayouts.globalHud;
  return `
    <section class="c-layout-editor__preview-shell">
      <header class="c-layout-editor__preview-header">
        <div>
          <p class="c-layout-editor__eyebrow">布局预览</p>
          <h2 class="c-layout-editor__preview-title">${layout.label}</h2>
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
