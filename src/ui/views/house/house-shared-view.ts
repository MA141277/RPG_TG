import type {
  HouseModuleViewModel,
  HouseOverlayViewModel,
  HouseStandbyActorViewModel,
} from "../../../domain/house-module";
import { renderSharedDialog } from "../../components/dialog/shared-dialog";

type StandbyRosterOptions = {
  asideClassName?: string;
  asideLabel?: string;
  includeSelectedState?: boolean;
  renderSecondaryText?: (actor: HouseStandbyActorViewModel) => string;
};

type DialogueOptions = {
  footerClassName?: string;
  ariaLabel?: string;
};

type LeaveButtonOptions = {
  className?: string;
};

type IdleOwnerOptions = {
  containerClassName?: string;
  buttonClassName?: string;
  renderSecondaryText?: (actor: HouseStandbyActorViewModel) => string;
};

export function renderHouseAlertOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "alert" }>
): string {
  return renderSharedDialog({
    layout: "modal",
    title: overlay.title,
    body: overlay.paragraphs,
    overlayClassName: "c-grain-shop-overlay",
    overlayAttributes: {
      "data-house-overlay": "alert",
    },
    panelClassName: "c-grain-shop-modal c-grain-shop-skin-panel",
    titleClassName: "c-grain-shop-modal__title c-grain-shop-nameplate",
    bodyClassName: "c-grain-shop-modal__body",
    actionsClassName: "c-grain-shop-modal__actions",
    actions: [
      {
        id: overlay.confirmActionId,
        label: overlay.confirmLabel,
        result: "confirm",
        className: "c-button c-grain-shop-button c-grain-shop-button--gold",
        attributes: {
          "data-house-action": overlay.confirmActionId,
        },
      },
    ],
  });
}

export function renderHouseConfirmOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "confirm" }>
): string {
  return renderSharedDialog({
    layout: "modal",
    title: overlay.title,
    body: overlay.paragraphs,
    overlayClassName: "c-grain-shop-overlay",
    overlayAttributes: {
      "data-house-overlay": "confirm",
    },
    panelClassName: "c-grain-shop-modal c-grain-shop-skin-panel",
    titleClassName: "c-grain-shop-modal__title c-grain-shop-nameplate",
    bodyClassName: "c-grain-shop-modal__body",
    actionsClassName: "c-grain-shop-modal__actions c-grain-shop-modal__actions--split",
    actions: [
      {
        id: overlay.cancelActionId,
        label: overlay.cancelLabel,
        result: "cancel",
        className: "c-button c-grain-shop-button c-grain-shop-button--paper",
        attributes: {
          "data-house-action": overlay.cancelActionId,
        },
      },
      {
        id: overlay.confirmActionId,
        label: overlay.confirmLabel,
        result: "confirm",
        className: "c-button c-grain-shop-button c-grain-shop-button--gold",
        attributes: {
          "data-house-action": overlay.confirmActionId,
        },
      },
    ],
  });
}

export function renderHouseQuantityConfirmOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "quantity-confirm" }>
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="quantity-confirm">
      <div class="c-grain-shop-modal c-grain-shop-skin-panel" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <div class="c-grain-shop-modal__body">
          ${overlay.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
          <label class="c-grain-shop-trade__field">
            <span>${overlay.quantityLabel}</span>
            <input
              type="number"
              min="1"
              max="${overlay.maxQuantity}"
              value="${overlay.quantity}"
              data-house-field="${overlay.quantityFieldId}"
            >
          </label>
        </div>
        <div class="c-grain-shop-modal__actions c-grain-shop-modal__actions--split">
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-house-action="${overlay.cancelActionId}">
            ${overlay.cancelLabel}
          </button>
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-house-action="${overlay.decrementActionId}">
            -1
          </button>
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-house-action="${overlay.incrementActionId}">
            +1
          </button>
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-house-action="${overlay.confirmActionId}">
            ${overlay.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  `;
}

export function renderHouseActionContainer(
  viewModel: HouseModuleViewModel
): string {
  if (viewModel.actionContainer == null) {
    return "";
  }

  return `
    <div class="c-grain-shop-center c-grain-shop-center--open">
      <nav
        class="c-grain-shop-actions"
        aria-label="${viewModel.actionContainer.title ?? "房屋操作"}"
      >
        ${viewModel.actionContainer.actions
          .map(
            (action) => `
              <button
                type="button"
                class="c-button c-grain-shop-button ${action.tone === "accent" ? "c-grain-shop-button--gold" : "c-grain-shop-button--paper"}"
                data-house-action="${action.id}"
                ${action.disabled ? "disabled" : ""}
              >
                ${action.label}
              </button>
            `
          )
          .join("")}
      </nav>
    </div>
  `;
}

export function renderHouseStandbyRoster(
  viewModel: HouseModuleViewModel,
  options: StandbyRosterOptions = {}
): string {
  if (viewModel.standbyRoster.length === 0) {
    return "";
  }

  const asideClassName = options.asideClassName ?? "c-grain-shop-npc-idle";
  const asideLabel = options.asideLabel ?? "待机角色";

  return `
    <aside class="${asideClassName}" aria-label="${asideLabel}">
      ${viewModel.standbyRoster
        .map((actor) => {
          const selectedClass =
            options.includeSelectedState && actor.isSelected ? " is-selected" : "";
          const secondaryText = options.renderSecondaryText?.(actor) ?? "";

          return `
            <button
              type="button"
              class="c-grain-shop-npc-idle__button${selectedClass}"
              ${actor.actionId == null ? "" : `data-house-action="${actor.actionId}"`}
              aria-label="与 ${actor.name} 交谈"
            >
              <div class="c-grain-shop-avatar" aria-hidden="true">
                ${
                  actor.avatarImageUrl == null
                    ? `<span class="c-grain-shop-avatar__art ${actor.avatarArtClassName ?? ""}"></span>`
                    : `<img class="c-grain-shop-avatar__image" src="${actor.avatarImageUrl}" alt="">`
                }
              </div>
              <p class="c-grain-shop-avatar__name c-grain-shop-nameplate c-grain-shop-nameplate--small">
                ${actor.name}
              </p>
              ${secondaryText}
            </button>
          `;
        })
        .join("")}
    </aside>
  `;
}

export function renderHouseDialogue(
  viewModel: HouseModuleViewModel,
  options: DialogueOptions = {}
): string {
  if (viewModel.dialogue == null) {
    return "";
  }

  const isNarration = viewModel.dialogue.mode === "narration";

  return renderSharedDialog({
    layout: "dialogue-card",
    body: viewModel.dialogue.textLines,
    hintText: viewModel.dialogue.advanceHintText,
    ariaLabel: options.ariaLabel ?? "对话",
    footerClassName: options.footerClassName ?? "c-grain-shop-dialogue",
    action:
      viewModel.dialogue.advanceActionId == null
        ? undefined
        : {
            id: viewModel.dialogue.advanceActionId,
            label: viewModel.dialogue.advanceHintText ?? "继续",
            result: "action",
            attributes: {
              "data-house-action": viewModel.dialogue.advanceActionId,
            },
          },
    speaker:
      isNarration
        ? {
            narration: true,
          }
        : {
            name: viewModel.dialogue.speakerName ?? "",
            ...(viewModel.dialogue.portraitImageUrl === undefined
              ? {}
              : {
                  portraitImageUrl: viewModel.dialogue.portraitImageUrl,
                }),
            ...(viewModel.dialogue.portraitArtClassName == null
              ? {}
              : {
                  portraitArtClassName: viewModel.dialogue.portraitArtClassName,
                }),
          },
  });
}

export function renderHouseIdleOwner(
  actor: HouseStandbyActorViewModel | null,
  options: IdleOwnerOptions = {}
): string {
  if (actor == null) {
    return "";
  }

  const secondaryText = options.renderSecondaryText?.(actor) ?? "";
  const containerClassName =
    options.containerClassName ?? "c-grain-shop-idle-owner";
  const buttonClassName =
    options.buttonClassName ?? "c-grain-shop-idle-owner__button";

  return `
    <aside class="${containerClassName}" aria-label="${actor.name}">
      <button
        type="button"
        class="${buttonClassName}"
        ${actor.actionId == null ? "" : `data-house-action="${actor.actionId}"`}
        aria-label="与 ${actor.name} 交谈"
      >
        <div class="c-grain-shop-portrait" aria-hidden="true">
          ${
            actor.portraitImageUrl == null
              ? `<span class="c-grain-shop-portrait__art ${actor.portraitArtClassName ?? ""}"></span>`
              : `<img class="c-grain-shop-portrait__image" src="${actor.portraitImageUrl}" alt="">`
          }
        </div>
        <p class="c-grain-shop-portrait__name c-grain-shop-nameplate c-grain-shop-nameplate--small">
          ${actor.name}
        </p>
        ${secondaryText}
      </button>
    </aside>
  `;
}

export function renderHouseStatusCard(
  viewModel: HouseModuleViewModel
): string {
  void viewModel;
  return "";
}

export function renderHouseLeaveButton(
  viewModel: HouseModuleViewModel,
  options: LeaveButtonOptions = {}
): string {
  const className =
    options.className ??
    "c-button c-grain-shop-button c-grain-shop-button--gold c-grain-shop-leave";

  return `
    <button
      type="button"
      class="${className}"
      data-action="${viewModel.leaveAction.id}"
    >
      ${viewModel.leaveAction.label}
    </button>
  `;
}
