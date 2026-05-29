import type {
  HouseModuleViewModel,
  HouseOverlayViewModel,
} from "../../../domain/house-module";
import {
  renderHouseActionContainer,
  renderHouseAlertOverlay,
  renderHouseDialogue,
  renderHouseLeaveButton,
  renderHouseStandbyRoster,
  renderHouseStatusCard,
} from "./house-shared-view";

function renderConfirmOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "confirm" }>
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="confirm">
      <div class="c-grain-shop-modal c-grain-shop-skin-panel" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <div class="c-grain-shop-modal__body">
          ${overlay.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
        </div>
        <div class="c-grain-shop-modal__actions c-grain-shop-modal__actions--split">
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-house-action="${overlay.cancelActionId}">
            ${overlay.cancelLabel}
          </button>
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-house-action="${overlay.confirmActionId}">
            ${overlay.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderOverlay(overlay: HouseOverlayViewModel | null): string {
  if (overlay == null) {
    return "";
  }

  if (overlay.type === "alert") {
    return renderHouseAlertOverlay(overlay);
  }

  if (overlay.type === "confirm") {
    return renderConfirmOverlay(overlay);
  }

  return "";
}

export function renderTempleHouseView(viewModel: HouseModuleViewModel): string {
  const isIdle = viewModel.dialogue == null;

  return `
    <section class="view-house-grain-shop view-house-temple" data-house-module="${viewModel.moduleId}">
      ${renderHouseActionContainer(viewModel)}
      ${renderHouseStandbyRoster(viewModel, {
        asideClassName: "c-grain-shop-npc-idle c-tea-house-npc-idle",
        asideLabel: "寺中人物",
        includeSelectedState: false,
        renderSecondaryText: (actor) =>
          actor.title == null
            ? ""
            : `<span class="c-tea-house-npc-idle__title">${actor.title}</span>`,
      })}
      ${renderHouseDialogue(viewModel, {
        footerClassName: "c-grain-shop-dialogue c-tea-house-dialogue c-temple-house-dialogue",
      })}
      ${isIdle ? renderHouseLeaveButton(viewModel) : ""}
      ${renderHouseStatusCard(viewModel)}
      ${renderOverlay(viewModel.overlay)}
    </section>
  `;
}
