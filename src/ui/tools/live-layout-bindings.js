export function applyLiveLayoutBindings(input) {
  const { root, layout, appState, bindings } = input;

  for (const binding of bindings) {
    const element = root.querySelector(binding.selector);
    const offsetComponent =
      binding.offsetComponentId == null
        ? null
        : getLayoutComponent(layout, binding.offsetComponentId);

    applyLayoutComponentStyle(
      element,
      layout,
      binding.componentId,
      offsetComponent,
      appState
    );
  }
}

function getLayoutComponent(layout, componentId) {
  return layout.components.find((component) => component.id === componentId) ?? null;
}

function applyLayoutComponentStyle(
  element,
  layout,
  componentId,
  offsetComponent = null,
  appState = null
) {
  if (element == null || typeof element.classList?.add !== "function") {
    return;
  }

  const component = getLayoutComponent(layout, componentId);
  if (component == null) {
    return;
  }

  const offsetX = offsetComponent?.rect.x ?? 0;
  const offsetY = offsetComponent?.rect.y ?? 0;
  element.classList.add("c-main-ui-layout-component");
  syncLayoutEditorHandleAttributes(element, layout, componentId, appState);
  element.style.left = `${component.rect.x - offsetX}px`;
  element.style.top = `${component.rect.y - offsetY}px`;
  element.style.width = `${component.rect.width}px`;
  element.style.height = `${component.rect.height}px`;

  if (component.background != null) {
    const backgroundSize =
      component.background.mode === "cover"
        ? "cover"
        : component.background.mode === "contain"
          ? "contain"
          : "100% 100%";
    element.style.backgroundImage = `url("${component.background.imageUrl}")`;
    element.style.backgroundPosition = "center";
    element.style.backgroundRepeat = "no-repeat";
    element.style.backgroundSize = backgroundSize;
  }
}

function syncLayoutEditorHandleAttributes(element, layout, componentId, appState) {
  const shouldEnable =
    appState?.layoutEditor?.isOpen === true &&
    appState.layoutEditor.selectedTargetId === layout.id;

  if (!shouldEnable) {
    element.removeAttribute("data-layout-component-handle");
    element.removeAttribute("data-layout-component-select");
    element.removeAttribute("data-layout-live-label");
    element.classList.remove("is-layout-editable", "is-selected-layout-component");
    syncLayoutResizeHandle(element, componentId, false);
    return;
  }

  const component = getLayoutComponent(layout, componentId);
  element.dataset.layoutComponentHandle = componentId;
  element.dataset.layoutComponentSelect = componentId;
  element.dataset.layoutLiveLabel = component?.label ?? componentId;
  element.classList.add("is-layout-editable");
  element.classList.toggle(
    "is-selected-layout-component",
    appState.layoutEditor.selectedComponentId === componentId
  );
  syncLayoutResizeHandle(element, componentId, true);
}

function syncLayoutResizeHandle(element, componentId, shouldEnable) {
  const existingHandle = element.querySelector(
    ":scope > .c-main-ui-layout-resize-handle"
  );

  if (!shouldEnable) {
    existingHandle?.remove();
    return;
  }

  const handle = existingHandle ?? element.ownerDocument.createElement("span");
  handle.className = "c-main-ui-layout-resize-handle";
  handle.dataset.layoutComponentResize = componentId;
  handle.dataset.layoutResizeAxis = "xy";
  handle.setAttribute("aria-hidden", "true");

  if (existingHandle == null) {
    element.append(handle);
  }
}
