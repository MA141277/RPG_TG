import type { HouseModuleViewModel, HouseOverlayViewModel } from "../../../domain/house-module";
import {
  renderHouseActionContainer,
  renderHouseAlertOverlay,
  renderHouseDialogue,
  renderHouseCharacterCard,
  renderHouseIdleOwner,
  renderHouseLeaveButton,
  renderHouseStandbyRoster,
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
    <section class="c-keep-house-meeting" aria-label="璇勫畾鍒楀腑璇稿皢">
      ${viewModel.standbyRoster
        .map((actor, index) => {
          const cardLevel = Math.max(1, 5 - index) as 1 | 2 | 3 | 4 | 5;
          const secondaryText =
            actor.title == null
              ? ""
              : `<span class="c-house-character-card__title">${actor.title}</span>`;

          return `
            <article class="c-keep-house-seat${actor.isSelected ? " is-selected" : ""}">
              ${renderHouseCharacterCard(actor, {
                className: "c-keep-house-seat__card",
                secondaryText,
                cardLevel,
              })}
            </article>
          `;
        })
        .join("")}
    </section>
  `;
}

export function renderKeepHouseView(viewModel: HouseModuleViewModel): string {
  const isMeeting = viewModel.standbyRoster.some(
    (actor) => actor.isSelected != null
  );
  const idleOwnerActor = isMeeting
    ? null
    : viewModel.standbyRoster.find((actor) => actor.actionId != null) ?? null;
  const sideActors =
    idleOwnerActor == null
      ? viewModel.standbyRoster
      : viewModel.standbyRoster.filter(
          (actor) => actor.characterId !== idleOwnerActor.characterId
        );

  return `
    <section class="view-house-grain-shop view-house-tea-house view-house-keep" data-house-module="${viewModel.moduleId}">
      ${renderHouseActionContainer(viewModel)}
      ${
        isMeeting
          ? renderMeetingRoster(viewModel)
          : renderHouseStandbyRoster(
              {
                ...viewModel,
                standbyRoster: sideActors,
              },
              {
                asideClassName: "c-grain-shop-npc-idle c-tea-house-npc-idle",
                asideLabel: "甯呭簻浜虹墿",
                includeSelectedState: false,
                renderSecondaryText: (actor) =>
                  actor.title == null
                    ? ""
                    : `<span class="c-tea-house-npc-idle__title">${actor.title}</span>`,
              }
            )
      }
      ${renderHouseDialogue(viewModel, {
        footerClassName: "c-grain-shop-dialogue c-tea-house-dialogue c-keep-house-dialogue",
        ariaLabel: "主帅训示",
      })}
      ${
        isMeeting
          ? ""
          : renderHouseIdleOwner(idleOwnerActor, {
              renderSecondaryText: (actor) =>
                actor.title == null
                  ? ""
                  : `<span class="c-tea-house-npc-idle__title">${actor.title}</span>`,
            })
      }
      ${renderHouseLeaveButton(viewModel)}
      ${renderHouseStatusCard(viewModel)}
      ${renderOverlay(viewModel.overlay)}
    </section>
  `;
}
