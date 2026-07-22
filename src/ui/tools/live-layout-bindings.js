export function applyStaticLayoutBindings(input) {
  const { root, layout, bindings } = input;

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
      offsetComponent
    );

    if (element == null) {
      continue;
    }

    for (const elementBinding of binding.elements ?? []) {
      const layoutElement = element.querySelector(elementBinding.selector);
      applyLayoutElementStyle(
        layoutElement,
        layout,
        binding.componentId,
        elementBinding.elementId
      );
    }
  }
}

function getLayoutComponent(layout, componentId) {
  return layout.components.find((component) => component.id === componentId) ?? null;
}

function getLayoutElement(component, elementId) {
  return component?.elements.find((element) => element.id === elementId) ?? null;
}

function applyLayoutComponentStyle(
  element,
  layout,
  componentId,
  offsetComponent = null
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

function applyLayoutElementStyle(element, layout, componentId, elementId) {
  if (element == null || typeof element.classList?.add !== "function") {
    return;
  }

  const component = getLayoutComponent(layout, componentId);
  const layoutElement = getLayoutElement(component, elementId);
  if (component == null || layoutElement == null) {
    return;
  }

  element.classList.add("c-main-ui-layout-element");
  element.style.left = `${layoutElement.rect.x}px`;
  element.style.top = `${layoutElement.rect.y}px`;
  element.style.width = `${layoutElement.rect.width}px`;
  element.style.height = `${layoutElement.rect.height}px`;
}
