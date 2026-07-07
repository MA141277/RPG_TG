import type { AppState } from "../app-shell";
import {
  selectLayoutEditorComponent,
  selectLayoutEditorElement,
  selectLayoutEditorTarget,
  setLayoutEditorBackgroundAsset,
  setLayoutEditorBackgroundAssetQuery,
  setLayoutEditorBackgroundMode,
  setLayoutEditorBackgroundSlice,
  setLayoutEditorComponentRectField,
  setLayoutEditorElementRectField,
  toggleLayoutEditor,
  updateLayoutEditorComponentPosition,
  updateLayoutEditorComponentSize,
  updateLayoutEditorElementPosition,
  updateLayoutEditorElementSize,
} from "./layout-editor-actions";
import { globalHudBackgroundOptions } from "../../content/layout-editor-presets";
import type {
  LayoutEditorTargetId,
  UiLayout,
  UiLayoutBackgroundMode,
  UiLayoutRect,
} from "../../domain/ui-layout";

type LayoutEditorDragState =
  | {
      mode: "component" | "element" | "component-size" | "element-size";
      componentId: string;
      elementId: string | null;
      pointerId: number;
      startClientX: number;
      startClientY: number;
      resizeAxis?: "x" | "y" | "xy";
    }
  | null;

export type LayoutEditorCoordinatorDependencies = {
  getAppState(): AppState;
  setAppState(appState: AppState): void;
  renderActiveSurface(): void;
  resolveOpenTargetId(appState: AppState): LayoutEditorTargetId;
  writeClipboardText(text: string): Promise<void>;
  queryDragHandle(selector: string): HTMLElement | null;
};

function getDragEventId(event: PointerEvent | MouseEvent): number {
  return "pointerId" in event ? event.pointerId : -1;
}

function setPointerCapture(
  element: HTMLElement,
  event: PointerEvent | MouseEvent
): void {
  if ("pointerId" in event) {
    element.setPointerCapture(event.pointerId);
  }
}

function releasePointerCapture(
  element: HTMLElement,
  event: PointerEvent | MouseEvent
): void {
  if ("pointerId" in event && element.hasPointerCapture(event.pointerId)) {
    element.releasePointerCapture(event.pointerId);
  }
}

export function createLayoutEditorCoordinator(
  dependencies: LayoutEditorCoordinatorDependencies
) {
  let dragState: LayoutEditorDragState = null;

  function getAppState(): AppState {
    return dependencies.getAppState();
  }

  function setAppState(appState: AppState): void {
    dependencies.setAppState(appState);
  }

  function renderActiveSurface(): void {
    dependencies.renderActiveSurface();
  }

  function getSelectedLayout(appState: AppState): UiLayout {
    return appState.uiLayouts[appState.layoutEditor.selectedTargetId];
  }

  function getDragHandleSelector(): string {
    if (dragState == null) {
      return "";
    }

    if (dragState.mode === "component-size") {
      return `[data-layout-component-resize="${dragState.componentId}"][data-layout-resize-axis="${dragState.resizeAxis}"]`;
    }

    if (dragState.mode === "element-size") {
      return `[data-layout-element-resize="${dragState.componentId}:${dragState.elementId}"][data-layout-resize-axis="${dragState.resizeAxis}"]`;
    }

    return dragState.mode === "component"
      ? `[data-layout-component-handle="${dragState.componentId}"]`
      : `[data-layout-element-handle="${dragState.componentId}:${dragState.elementId}"]`;
  }

  async function copyCurrentLayoutParams(): Promise<void> {
    const appState = getAppState();
    const payload = {
      targetId: appState.layoutEditor.selectedTargetId,
      selectedComponentId: appState.layoutEditor.selectedComponentId,
      selectedElementId: appState.layoutEditor.selectedElementId,
      layout: getSelectedLayout(appState),
    };
    await dependencies.writeClipboardText(`${JSON.stringify(payload, null, 2)}\n`);
  }

  function handleInput(targetElement: EventTarget | null): boolean {
    if (
      !(
        targetElement instanceof HTMLInputElement ||
        targetElement instanceof HTMLSelectElement
      )
    ) {
      return false;
    }

    let appState = getAppState();

    if (
      targetElement instanceof HTMLInputElement &&
      targetElement.hasAttribute("data-layout-background-asset-query")
    ) {
      appState = setLayoutEditorBackgroundAssetQuery(appState, targetElement.value);
      setAppState(appState);
      renderActiveSurface();
      return true;
    }

    const componentId = targetElement.dataset.layoutComponentId;
    if (componentId == null) {
      return false;
    }

    if (
      targetElement instanceof HTMLSelectElement &&
      targetElement.hasAttribute("data-layout-background-asset")
    ) {
      const selectedAsset = globalHudBackgroundOptions.find(
        (asset) => asset.id === targetElement.value
      );
      if (selectedAsset != null) {
        appState = setLayoutEditorBackgroundAsset(
          appState,
          componentId,
          selectedAsset
        );
        setAppState(appState);
        renderActiveSurface();
      }
      return true;
    }

    if (
      targetElement instanceof HTMLSelectElement &&
      targetElement.hasAttribute("data-layout-background-mode")
    ) {
      appState = setLayoutEditorBackgroundMode(
        appState,
        componentId,
        targetElement.value as UiLayoutBackgroundMode
      );
      setAppState(appState);
      renderActiveSurface();
      return true;
    }

    if (
      targetElement instanceof HTMLInputElement &&
      targetElement.dataset.layoutSliceEdge != null
    ) {
      appState = setLayoutEditorBackgroundSlice(
        appState,
        componentId,
        targetElement.dataset.layoutSliceEdge as
          | "top"
          | "right"
          | "bottom"
          | "left",
        Number(targetElement.value)
      );
      setAppState(appState);
      renderActiveSurface();
      return true;
    }

    if (
      targetElement instanceof HTMLInputElement &&
      targetElement.dataset.layoutComponentField != null
    ) {
      appState = setLayoutEditorComponentRectField(
        appState,
        componentId,
        targetElement.dataset.layoutComponentField as keyof UiLayoutRect,
        Number(targetElement.value)
      );
      setAppState(appState);
      renderActiveSurface();
      return true;
    }

    if (
      targetElement instanceof HTMLInputElement &&
      targetElement.dataset.layoutElementField != null &&
      targetElement.dataset.layoutElementId != null
    ) {
      appState = setLayoutEditorElementRectField(
        appState,
        componentId,
        targetElement.dataset.layoutElementId,
        targetElement.dataset.layoutElementField as keyof UiLayoutRect,
        Number(targetElement.value)
      );
      setAppState(appState);
      renderActiveSurface();
      return true;
    }

    return false;
  }

  function handleClick(targetElement: EventTarget | null): boolean {
    if (!(targetElement instanceof HTMLElement)) {
      return false;
    }

    let appState = getAppState();
    const openLayoutEditorButton = targetElement.closest<HTMLElement>(
      "[data-action='open-layout-editor']"
    );
    if (openLayoutEditorButton != null) {
      const nextTargetId = dependencies.resolveOpenTargetId(appState);
      appState =
        nextTargetId === appState.layoutEditor.selectedTargetId
          ? appState
          : selectLayoutEditorTarget(appState, nextTargetId);
      appState = toggleLayoutEditor(appState, true);
      setAppState(appState);
      renderActiveSurface();
      return true;
    }

    const closeLayoutEditorButton = targetElement.closest<HTMLElement>(
      "[data-action='close-layout-editor']"
    );
    if (closeLayoutEditorButton != null) {
      appState = toggleLayoutEditor(appState, false);
      setAppState(appState);
      renderActiveSurface();
      return true;
    }

    const layoutTargetButton = targetElement.closest<HTMLElement>(
      "[data-layout-target-id]"
    );
    if (layoutTargetButton != null) {
      const targetId = layoutTargetButton.dataset.layoutTargetId;
      if (
        targetId === "global-hud" ||
        targetId === "start-screen" ||
        targetId === "character-select-screen" ||
        targetId === "character-detail-screen"
      ) {
        appState = selectLayoutEditorTarget(
          appState,
          targetId as LayoutEditorTargetId
        );
        setAppState(appState);
        renderActiveSurface();
      }
      return true;
    }

    const layoutElementSelectButton = targetElement.closest<HTMLElement>(
      "[data-layout-element-select]"
    );
    if (layoutElementSelectButton != null) {
      const value = layoutElementSelectButton.dataset.layoutElementSelect;
      const [componentId, elementId] = value?.split(":") ?? [];
      if (componentId != null && elementId != null) {
        appState = selectLayoutEditorElement(appState, componentId, elementId);
        setAppState(appState);
        renderActiveSurface();
      }
      return true;
    }

    const layoutComponentSelectButton = targetElement.closest<HTMLElement>(
      "[data-layout-component-select]"
    );
    if (layoutComponentSelectButton != null) {
      const componentId = layoutComponentSelectButton.dataset.layoutComponentSelect;
      if (componentId != null) {
        appState = selectLayoutEditorComponent(appState, componentId);
        setAppState(appState);
        renderActiveSurface();
      }
      return true;
    }

    const copyLayoutParamsButton = targetElement.closest<HTMLElement>(
      "[data-action='copy-layout-params']"
    );
    if (copyLayoutParamsButton != null) {
      void copyCurrentLayoutParams();
      return true;
    }

    return false;
  }

  function handlePointerDown(event: PointerEvent | MouseEvent): boolean {
    const targetElement = event.target;
    if (!(targetElement instanceof HTMLElement)) {
      return false;
    }

    const componentResizeHandle = targetElement.closest<HTMLElement>(
      "[data-layout-component-resize]"
    );
    if (componentResizeHandle != null) {
      const componentId = componentResizeHandle.dataset.layoutComponentResize;
      const resizeAxis = componentResizeHandle.dataset.layoutResizeAxis;
      if (
        componentId != null &&
        (resizeAxis === "x" || resizeAxis === "y" || resizeAxis === "xy")
      ) {
        event.preventDefault();
        event.stopPropagation();
        dragState = {
          mode: "component-size",
          componentId,
          elementId: null,
          pointerId: getDragEventId(event),
          startClientX: event.clientX,
          startClientY: event.clientY,
          resizeAxis,
        };
        setPointerCapture(componentResizeHandle, event);
        return true;
      }
    }

    const elementResizeHandle = targetElement.closest<HTMLElement>(
      "[data-layout-element-resize]"
    );
    if (elementResizeHandle != null) {
      const [componentId, elementId] =
        elementResizeHandle.dataset.layoutElementResize?.split(":") ?? [];
      const resizeAxis = elementResizeHandle.dataset.layoutResizeAxis;
      if (
        componentId != null &&
        elementId != null &&
        (resizeAxis === "x" || resizeAxis === "y" || resizeAxis === "xy")
      ) {
        event.preventDefault();
        event.stopPropagation();
        dragState = {
          mode: "element-size",
          componentId,
          elementId,
          pointerId: getDragEventId(event),
          startClientX: event.clientX,
          startClientY: event.clientY,
          resizeAxis,
        };
        setPointerCapture(elementResizeHandle, event);
        return true;
      }
    }

    const elementHandle = targetElement.closest<HTMLElement>(
      "[data-layout-element-handle]"
    );
    if (elementHandle != null) {
      const [componentId, elementId] =
        elementHandle.dataset.layoutElementHandle?.split(":") ?? [];
      if (componentId != null && elementId != null) {
        dragState = {
          mode: "element",
          componentId,
          elementId,
          pointerId: getDragEventId(event),
          startClientX: event.clientX,
          startClientY: event.clientY,
        };
        setPointerCapture(elementHandle, event);
        return true;
      }
    }

    const componentHandle = targetElement.closest<HTMLElement>(
      "[data-layout-component-handle]"
    );
    if (componentHandle != null) {
      const componentId = componentHandle.dataset.layoutComponentHandle;
      if (componentId != null) {
        dragState = {
          mode: "component",
          componentId,
          elementId: null,
          pointerId: getDragEventId(event),
          startClientX: event.clientX,
          startClientY: event.clientY,
        };
        setPointerCapture(componentHandle, event);
        return true;
      }
    }

    return false;
  }

  function handlePointerMove(event: PointerEvent | MouseEvent): boolean {
    if (dragState == null || dragState.pointerId !== getDragEventId(event)) {
      return false;
    }

    const deltaX = event.clientX - dragState.startClientX;
    const deltaY = event.clientY - dragState.startClientY;
    dragState = {
      ...dragState,
      startClientX: event.clientX,
      startClientY: event.clientY,
    };

    let appState = getAppState();
    if (dragState.mode === "component") {
      appState = updateLayoutEditorComponentPosition(
        appState,
        dragState.componentId,
        deltaX,
        deltaY
      );
    } else if (dragState.mode === "component-size") {
      appState = updateLayoutEditorComponentSize(
        appState,
        dragState.componentId,
        dragState.resizeAxis ?? "xy",
        dragState.resizeAxis === "y" ? 0 : deltaX,
        dragState.resizeAxis === "x" ? 0 : deltaY
      );
    } else if (dragState.mode === "element-size" && dragState.elementId != null) {
      appState = updateLayoutEditorElementSize(
        appState,
        dragState.componentId,
        dragState.elementId,
        dragState.resizeAxis ?? "xy",
        dragState.resizeAxis === "y" ? 0 : deltaX,
        dragState.resizeAxis === "x" ? 0 : deltaY
      );
    } else if (dragState.elementId != null) {
      appState = updateLayoutEditorElementPosition(
        appState,
        dragState.componentId,
        dragState.elementId,
        deltaX,
        deltaY
      );
    }

    setAppState(appState);
    renderActiveSurface();
    return true;
  }

  function handlePointerUp(event: PointerEvent | MouseEvent): boolean {
    if (dragState == null || dragState.pointerId !== getDragEventId(event)) {
      return false;
    }

    const handle =
      dependencies.queryDragHandle(getDragHandleSelector()) ?? null;
    if (handle != null) {
      releasePointerCapture(handle, event);
    }
    dragState = null;
    return true;
  }

  function handleMouseDown(event: MouseEvent): boolean {
    if (dragState != null) {
      return false;
    }

    return handlePointerDown(event);
  }

  function cancelDrag(): void {
    dragState = null;
  }

  return {
    handleInput,
    handleClick,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleMouseDown,
    cancelDrag,
  };
}
