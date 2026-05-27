import type { HouseModuleViewModel } from "../../../domain/house-module";
import {
  renderHouseActionContainer,
  renderHouseAlertOverlay,
  renderHouseDialogue,
  renderHouseLeaveButton,
  renderHouseStandbyRoster,
  renderHouseStatusCard,
} from "./house-shared-view";

export function renderLeaderResidenceHouseView(
  viewModel: HouseModuleViewModel
): string {
  return `
    <section class="view-house-grain-shop view-house-leader-residence" data-house-module="${viewModel.moduleId}">
      <div class="c-grain-shop-shell">
        <header class="c-grain-shop-header">
          <div>
            <p class="c-grain-shop-header__eyebrow">将领府邸</p>
            <h1 class="c-grain-shop-header__title">${viewModel.sceneSubtitle ?? viewModel.sceneTitle}</h1>
          </div>
          ${renderHouseLeaveButton(viewModel)}
        </header>
        <div class="c-grain-shop-stage">
          ${renderHouseStandbyRoster(viewModel, {
            includeSelectedState: true,
            renderSecondaryText: (actor) =>
              actor.title == null
                ? ""
                : `<p class="c-city-directory__option-subtitle">${actor.title}</p>`,
          })}
          ${renderHouseActionContainer(viewModel)}
          ${renderHouseStatusCard(viewModel)}
        </div>
        ${renderHouseDialogue(viewModel)}
        ${
          viewModel.overlay?.type === "alert"
            ? renderHouseAlertOverlay(viewModel.overlay)
            : ""
        }
      </div>
    </section>
  `;
}
