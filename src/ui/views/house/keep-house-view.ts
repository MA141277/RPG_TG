import type { HouseModuleViewModel, HouseOverlayViewModel } from "../../../domain/house-module";
import {
  renderHouseActionContainer,
  renderHouseAlertOverlay,
  renderHouseDialogue,
  renderHouseLeaveButton,
  renderHouseStatusCard,
} from "./house-shared-view";

function renderOverlay(overlay: HouseOverlayViewModel | null): string {
  if (overlay == null) {
    return "";
  }

  if (overlay.type === "alert") {
    return renderHouseAlertOverlay(overlay);
  }

  return "";
}

function renderMeetingRoster(viewModel: HouseModuleViewModel): string {
  if (viewModel.standbyRoster.length === 0) {
    return "";
  }

  return `
    <section class="c-keep-house-meeting" aria-label="评定列席诸将">
      ${viewModel.standbyRoster
        .map(
          (actor) => `
            <article class="c-keep-house-seat${actor.isSelected ? " is-selected" : ""}">
              <div class="c-grain-shop-avatar c-keep-house-seat__avatar" aria-hidden="true">
                <span class="c-grain-shop-avatar__art"></span>
              </div>
              <div class="c-keep-house-seat__nameplate">
                <span class="c-keep-house-seat__name">${actor.name}</span>
                ${
                  actor.title == null
                    ? ""
                    : `<span class="c-keep-house-seat__title">${actor.title}</span>`
                }
              </div>
            </article>
          `
        )
        .join("")}
    </section>
  `;
}

export function renderKeepHouseView(viewModel: HouseModuleViewModel): string {
  const isMeeting = viewModel.standbyRoster.length > 0;

  return `
    <section class="view-house-grain-shop view-house-tea-house view-house-keep" data-house-module="${viewModel.moduleId}">
      ${renderHouseActionContainer(viewModel)}
      ${isMeeting ? renderMeetingRoster(viewModel) : ""}
      ${renderHouseDialogue(viewModel, {
        footerClassName: "c-grain-shop-dialogue c-tea-house-dialogue c-keep-house-dialogue",
        ariaLabel: "主帅训示",
      })}
      ${renderHouseLeaveButton(viewModel)}
      ${renderHouseStatusCard(viewModel)}
      ${renderOverlay(viewModel.overlay)}
    </section>
  `;
}
