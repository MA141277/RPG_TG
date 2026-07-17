import type { AppState } from "../app-shell";
import { uiLayoutComponentBaseSizeById } from "../../domain/ui-layout";
import type { BattleUiEditorVariableName } from "../../domain/battle-ui-editor";
import type {
  LayoutBackgroundAssetOption,
  LayoutEditorTargetId,
  UiLayout,
  UiLayoutBackgroundMode,
  UiLayoutRect,
  UiLayoutSlice,
} from "../../domain/ui-layout";

function getSelectedLayout(appState: AppState): UiLayout {
  return appState.uiLayouts[appState.layoutEditor.selectedTargetId];
}

function updateSelectedLayout(
  appState: AppState,
  updater: (layout: UiLayout) => UiLayout
): AppState {
  const targetId = appState.layoutEditor.selectedTargetId;
  return {
    ...appState,
    uiLayouts: {
      ...appState.uiLayouts,
      [targetId]: updater(appState.uiLayouts[targetId]),
    },
  };
}

function clampNumber(value: number): number {
  return Number.isFinite(value) ? Math.round(value) : 0;
}

function resolveProportionalComponentRect(
  componentId: string,
  rect: UiLayoutRect,
  input: { width?: number; height?: number }
): UiLayoutRect {
  const baseSize = uiLayoutComponentBaseSizeById[componentId];
  if (baseSize == null) {
    return {
      ...rect,
      ...(input.width == null ? null : { width: Math.max(1, clampNumber(input.width)) }),
      ...(input.height == null ? null : { height: Math.max(1, clampNumber(input.height)) }),
    };
  }

  if (input.width != null) {
    const width = Math.max(1, clampNumber(input.width));
    const scale = width / Math.max(baseSize.width, 1);
    return {
      ...rect,
      width,
      height: Math.max(1, clampNumber(baseSize.height * scale)),
    };
  }

  if (input.height != null) {
    const height = Math.max(1, clampNumber(input.height));
    const scale = height / Math.max(baseSize.height, 1);
    return {
      ...rect,
      width: Math.max(1, clampNumber(baseSize.width * scale)),
      height,
    };
  }

  return rect;
}

function updateComponentRect(
  appState: AppState,
  componentId: string,
  updater: (rect: UiLayoutRect) => UiLayoutRect
): AppState {
  return updateSelectedLayout(appState, (layout) => ({
    ...layout,
    components: layout.components.map((component) =>
      component.id === componentId
        ? {
            ...component,
            rect: updater(component.rect),
          }
        : component
    ),
  }));
}

function updateElementRect(
  appState: AppState,
  componentId: string,
  elementId: string,
  updater: (rect: UiLayoutRect) => UiLayoutRect
): AppState {
  return updateSelectedLayout(appState, (layout) => ({
    ...layout,
    components: layout.components.map((component) =>
      component.id === componentId
        ? {
            ...component,
            elements: component.elements.map((element) =>
              element.id === elementId
                ? {
                    ...element,
                    rect: updater(element.rect),
                  }
                : element
            ),
          }
        : component
    ),
  }));
}

export function toggleLayoutEditor(appState: AppState, isOpen: boolean): AppState {
  return {
    ...appState,
    layoutEditor: {
      ...appState.layoutEditor,
      isOpen,
    },
  };
}

export function setLayoutEditorBackgroundAssetQuery(
  appState: AppState,
  query: string
): AppState {
  return {
    ...appState,
    layoutEditor: {
      ...appState.layoutEditor,
      backgroundAssetQuery: query,
    },
  };
}

export function setLayoutEditorBattleUiValue(
  appState: AppState,
  name: BattleUiEditorVariableName,
  value: string
): AppState {
  return {
    ...appState,
    layoutEditor: {
      ...appState.layoutEditor,
      battleUiValues: {
        ...appState.layoutEditor.battleUiValues,
        [name]: value,
      },
    },
  };
}

export function selectLayoutEditorComponent(
  appState: AppState,
  componentId: string
): AppState {
  return {
    ...appState,
    layoutEditor: {
      ...appState.layoutEditor,
      selectedComponentId: componentId,
      selectedElementId: null,
    },
  };
}

export function selectLayoutEditorTarget(
  appState: AppState,
  targetId: LayoutEditorTargetId
): AppState {
  const layout = appState.uiLayouts[targetId];
  return {
    ...appState,
    layoutEditor: {
      ...appState.layoutEditor,
      selectedTargetId: targetId,
      selectedComponentId: layout.components[0]?.id ?? "",
      selectedElementId: null,
    },
  };
}

export function selectLayoutEditorElement(
  appState: AppState,
  componentId: string,
  elementId: string
): AppState {
  return {
    ...appState,
    layoutEditor: {
      ...appState.layoutEditor,
      selectedComponentId: componentId,
      selectedElementId: elementId,
    },
  };
}

export function updateLayoutEditorComponentPosition(
  appState: AppState,
  componentId: string,
  deltaX: number,
  deltaY: number
): AppState {
  return updateComponentRect(appState, componentId, (rect) => ({
    ...rect,
    x: clampNumber(rect.x + deltaX),
    y: clampNumber(rect.y + deltaY),
  }));
}

export function updateLayoutEditorComponentSize(
  appState: AppState,
  componentId: string,
  resizeAxis: "x" | "y" | "xy",
  deltaWidth: number,
  deltaHeight: number
): AppState {
  return updateComponentRect(appState, componentId, (rect) => {
    const baseSize = uiLayoutComponentBaseSizeById[componentId];
    if (baseSize == null) {
      return {
        ...rect,
        width: Math.max(1, clampNumber(rect.width + deltaWidth)),
        height: Math.max(1, clampNumber(rect.height + deltaHeight)),
      };
    }

    const currentScale = rect.width / Math.max(baseSize.width, 1);
    const widthScaleDelta = deltaWidth / Math.max(baseSize.width, 1);
    const heightScaleDelta = deltaHeight / Math.max(baseSize.height, 1);
    const scaleDelta =
      resizeAxis === "x"
        ? widthScaleDelta
        : resizeAxis === "y"
          ? heightScaleDelta
          : Math.abs(widthScaleDelta) >= Math.abs(heightScaleDelta)
            ? widthScaleDelta
            : heightScaleDelta;
    const nextScale = Math.max(1 / Math.max(baseSize.width, baseSize.height), currentScale + scaleDelta);

    return {
      ...rect,
      width: Math.max(1, clampNumber(baseSize.width * nextScale)),
      height: Math.max(1, clampNumber(baseSize.height * nextScale)),
    };
  });
}

export function updateLayoutEditorElementPosition(
  appState: AppState,
  componentId: string,
  elementId: string,
  deltaX: number,
  deltaY: number
): AppState {
  return updateElementRect(appState, componentId, elementId, (rect) => ({
    ...rect,
    x: clampNumber(rect.x + deltaX),
    y: clampNumber(rect.y + deltaY),
  }));
}

export function updateLayoutEditorElementSize(
  appState: AppState,
  componentId: string,
  elementId: string,
  resizeAxis: "x" | "y" | "xy",
  deltaWidth: number,
  deltaHeight: number
): AppState {
  return updateElementRect(appState, componentId, elementId, (rect) => ({
    ...rect,
    width:
      resizeAxis === "y"
        ? rect.width
        : Math.max(1, clampNumber(rect.width + deltaWidth)),
    height:
      resizeAxis === "x"
        ? rect.height
        : Math.max(1, clampNumber(rect.height + deltaHeight)),
  }));
}

export function setLayoutEditorComponentRectField(
  appState: AppState,
  componentId: string,
  field: keyof UiLayoutRect,
  value: number
): AppState {
  return updateComponentRect(appState, componentId, (rect) => {
    if (field === "width") {
      return resolveProportionalComponentRect(componentId, rect, { width: value });
    }

    if (field === "height") {
      return resolveProportionalComponentRect(componentId, rect, { height: value });
    }

    return {
      ...rect,
      [field]: clampNumber(value),
    };
  });
}

export function setLayoutEditorElementRectField(
  appState: AppState,
  componentId: string,
  elementId: string,
  field: keyof UiLayoutRect,
  value: number
): AppState {
  return updateElementRect(appState, componentId, elementId, (rect) => ({
    ...rect,
    [field]: clampNumber(value),
  }));
}

export function setLayoutEditorBackgroundAsset(
  appState: AppState,
  componentId: string,
  asset: LayoutBackgroundAssetOption
): AppState {
  return updateSelectedLayout(appState, (layout) => ({
    ...layout,
    components: layout.components.map((component) =>
      component.id === componentId
        ? {
            ...component,
            background:
              component.background == null
                ? {
                    assetId: asset.id,
                    imageUrl: asset.imageUrl,
                    mode: "stretch",
                    slice: {
                      top: 24,
                      right: 24,
                      bottom: 24,
                      left: 24,
                    },
                  }
                : {
                    ...component.background,
                    assetId: asset.id,
                    imageUrl: asset.imageUrl,
                  },
          }
        : component
    ),
  }));
}

export function setLayoutEditorBackgroundMode(
  appState: AppState,
  componentId: string,
  mode: UiLayoutBackgroundMode
): AppState {
  return updateSelectedLayout(appState, (layout) => ({
    ...layout,
    components: layout.components.map((component) =>
      component.id === componentId && component.background != null
        ? {
            ...component,
            background: {
              ...component.background,
              mode,
            },
          }
        : component
    ),
  }));
}

export function setLayoutEditorBackgroundSlice(
  appState: AppState,
  componentId: string,
  edge: keyof UiLayoutSlice,
  value: number
): AppState {
  return updateSelectedLayout(appState, (layout) => ({
    ...layout,
    components: layout.components.map((component) =>
      component.id === componentId && component.background != null
        ? {
            ...component,
            background: {
              ...component.background,
              slice: {
                ...component.background.slice,
                [edge]: clampNumber(value),
              },
            },
          }
        : component
    ),
  }));
}

export function getSelectedLayoutForEditor(appState: AppState): UiLayout {
  return getSelectedLayout(appState);
}
