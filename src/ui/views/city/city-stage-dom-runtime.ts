import { createCityStageAmbientNpcRuntime } from "./city-stage-ambient-npc-runtime";
import {
  getAmbientNpcSpriteUrl,
  type CityStageAmbientNpcFacing,
} from "./city-stage-ambient-npc-sprites";
import { buildCityStageGeometry } from "./city-stage-geometry";
import { composeCityStageLayout } from "./city-stage-layout-data";
import {
  getAmbientNpcDescriptors,
  getCityStageBundleForCity,
} from "./city-stage-registry";

function createNpcNode(id: string): HTMLDivElement {
  const element = document.createElement("div");
  element.className = "c-city-stage-ambient-npc";
  element.dataset.cityAmbientNpcId = id;
  element.innerHTML = `
    <span class="c-city-stage-ambient-npc__shadow" aria-hidden="true"></span>
    <img class="c-city-stage-ambient-npc__sprite" alt="" aria-hidden="true" />
  `;
  return element;
}

function applyNpcFacing(
  node: HTMLDivElement,
  facing: CityStageAmbientNpcFacing
): void {
  node.dataset.cityAmbientNpcFacing = facing;
}

export function mountCityStageDomRuntime(
  root: HTMLElement,
  input: { cityId: string }
): { destroy(): void } {
  const bundle = getCityStageBundleForCity(input.cityId);
  const baseSpaceElement = root.querySelector<HTMLElement>(
    "[data-city-stage-base-space]"
  );
  if (bundle == null || baseSpaceElement == null) {
    return {
      destroy() {},
    };
  }

  const layout = {
    version: bundle.layoutSource.version,
    map: bundle.layoutSource.map,
    grid: bundle.layoutSource.grid,
    entities: composeCityStageLayout(bundle.layoutSource, bundle.prefabLibrary),
  };
  const geometry = buildCityStageGeometry(layout);
  const descriptors = getAmbientNpcDescriptors(bundle);
  const runtime = createCityStageAmbientNpcRuntime({ geometry, descriptors });
  const layer = document.createElement("div");
  layer.className = "c-city-stage-ambient-npc-layer";
  baseSpaceElement.append(layer);

  const nodeById = new Map<string, HTMLDivElement>();
  let animationFrameId: number | null = null;
  let lastTimestamp: number | null = null;
  let destroyed = false;

  function render(): void {
    const renderables = runtime.getRenderables();
    const liveIds = new Set(renderables.map((renderable) => renderable.id));

    for (const renderable of renderables) {
      let node = nodeById.get(renderable.id);
      if (node == null) {
        node = createNpcNode(renderable.id);
        nodeById.set(renderable.id, node);
        layer.append(node);
      }
      const spriteUrl = getAmbientNpcSpriteUrl(
        renderable.spriteSetId,
        renderable.facing
      );
      const spriteElement = node.querySelector<HTMLImageElement>(
        ".c-city-stage-ambient-npc__sprite"
      );
      if (spriteElement != null && spriteUrl != null) {
        if (spriteElement.getAttribute("src") !== spriteUrl) {
          spriteElement.src = spriteUrl;
        }
      }

      node.style.setProperty(
        "--npc-x",
        `${(renderable.x / geometry.baseSpaceWidth) * 100}%`
      );
      node.style.setProperty(
        "--npc-y",
        `${(renderable.y / geometry.baseSpaceHeight) * 100}%`
      );
      node.style.setProperty("--npc-z-index", `${Math.round(renderable.sortY)}`);
      applyNpcFacing(node, renderable.facing);
      node.style.transform = `translate(-50%, calc(-100% + ${renderable.bobOffset.toFixed(2)}px))`;
    }

    for (const [id, node] of nodeById.entries()) {
      if (liveIds.has(id)) {
        continue;
      }
      node.remove();
      nodeById.delete(id);
    }
  }

  function tick(timestamp: number): void {
    if (destroyed) {
      return;
    }

    const deltaMs =
      lastTimestamp == null ? 16 : Math.min(64, timestamp - lastTimestamp);
    lastTimestamp = timestamp;
    runtime.tick(deltaMs);
    render();
    animationFrameId = window.requestAnimationFrame(tick);
  }

  render();
  animationFrameId = window.requestAnimationFrame(tick);

  return {
    destroy() {
      destroyed = true;
      if (animationFrameId != null) {
        window.cancelAnimationFrame(animationFrameId);
      }
      runtime.destroy();
      nodeById.clear();
      layer.remove();
    },
  };
}
