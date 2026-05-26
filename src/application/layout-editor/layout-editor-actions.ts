import type { AppState } from "../app-shell";
import type {
  LayoutBackgroundAssetOption,
  UiLayoutBackgroundMode,
  UiLayoutRect,
  UiLayoutSlice,
} from "../../domain/ui-layout";

function clampNumber(value: number): number {
  return Number.isFinite(value) ? Math.round(value) : 0;
}

function updateComponentRect(
  appState: AppState,
  componentId: string,
  updater: (rect: UiLayoutRect) => UiLayoutRect
): AppState {
  return {
    ...appState,
    uiLayouts: {
      ...appState.uiLayouts,
      globalHud: {
        ...appState.uiLayouts.globalHud,
        components: appState.uiLayouts.globalHud.components.map((component) =>
          component.id === componentId
            ? {
                ...component,
                rect: updater(component.rect),
              }
            : component
        ),
      },
    },
  };
}

function updateElementRect(
  appState: AppState,
  componentId: string,
  elementId: string,
  updater: (rect: UiLayoutRect) => UiLayoutRect
): AppState {
  return {
    ...appState,
    uiLayouts: {
      ...appState.uiLayouts,
      globalHud: {
        ...appState.uiLayouts.globalHud,
        components: appState.uiLayouts.globalHud.components.map((component) =>
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
      },
    },
  };
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

export function setLayoutEditorComponentRectField(
  appState: AppState,
  componentId: string,
  field: keyof UiLayoutRect,
  value: number
): AppState {
  return updateComponentRect(appState, componentId, (rect) => ({
    ...rect,
    [field]: clampNumber(value),
  }));
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
  return {
    ...appState,
    uiLayouts: {
      ...appState.uiLayouts,
      globalHud: {
        ...appState.uiLayouts.globalHud,
        components: appState.uiLayouts.globalHud.components.map((component) =>
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
      },
    },
  };
}

export function setLayoutEditorBackgroundMode(
  appState: AppState,
  componentId: string,
  mode: UiLayoutBackgroundMode
): AppState {
  return {
    ...appState,
    uiLayouts: {
      ...appState.uiLayouts,
      globalHud: {
        ...appState.uiLayouts.globalHud,
        components: appState.uiLayouts.globalHud.components.map((component) =>
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
      },
    },
  };
}

export function setLayoutEditorBackgroundSlice(
  appState: AppState,
  componentId: string,
  edge: keyof UiLayoutSlice,
  value: number
): AppState {
  return {
    ...appState,
    uiLayouts: {
      ...appState.uiLayouts,
      globalHud: {
        ...appState.uiLayouts.globalHud,
        components: appState.uiLayouts.globalHud.components.map((component) =>
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
      },
    },
  };
}
