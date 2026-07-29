import type { CityDefinition } from "../../../domain/city";
import type { CitySceneMapping } from "../../../domain/city-scene-mapping";

export function renderCity3dView(
  cityDefinition: CityDefinition,
  mapping: CitySceneMapping | null
): string {
  if (mapping == null) {
    return `
      <section class="view-city-3d">
        <div class="c-city-3d-empty">
          <p>当前城市还没有 3D 场景映射。</p>
          <button type="button" data-action="leave-city-3d" data-button-sound="light">返回城市</button>
        </div>
      </section>
    `;
  }

  return `
    <section class="view-city-3d" data-city-3d-id="${cityDefinition.id}">
      <iframe
        class="c-city-3d-engine"
        src="${mapping.hd2degScenePath}"
        title="${cityDefinition.name} 3D scene"
        loading="eager"
      ></iframe>
      <div class="c-city-3d-bridge" aria-label="3D scene controls">
        <button type="button" class="c-city-3d-bridge__back" data-action="leave-city-3d" data-button-sound="light">
          返回城市
        </button>
      </div>
    </section>
  `;
}
