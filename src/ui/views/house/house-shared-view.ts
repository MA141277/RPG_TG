import type {
  HouseModuleViewModel,
  HouseOverlayViewModel,
  HouseStandbyActorViewModel,
} from "../../../domain/house-module";

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
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="alert">
      <div class="c-grain-shop-modal c-grain-shop-skin-panel" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <div class="c-grain-shop-modal__body">
          ${overlay.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
        </div>
        <div class="c-grain-shop-modal__actions">
          <button
            type="button"
            class="c-button c-grain-shop-button c-grain-shop-button--gold"
            data-house-action="${overlay.confirmActionId}"
          >
            ${overlay.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  `;
}

export function renderHouseQuantityConfirmOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "quantity-confirm" }>
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="quantity-confirm">
      <div class="c-grain-shop-modal c-grain-shop-modal--trade c-grain-shop-skin-panel" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <div class="c-grain-shop-modal__body">
          ${overlay.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
          ${overlay.helperLines.map((line) => `<p>${line}</p>`).join("")}
        </div>
        <label class="c-grain-shop-trade__label" for="${overlay.quantityFieldId}">
          ${overlay.quantityLabel}
        </label>
        <div class="c-grain-shop-trade__quantity">
          <button type="button" class="c-grain-shop-qty-btn" data-house-action="${overlay.decrementActionId}" aria-label="减少">-</button>
          <input
            id="${overlay.quantityFieldId}"
            class="c-grain-shop-trade__input"
            type="number"
            min="1"
            max="${overlay.maxQuantity}"
            value="${overlay.quantity}"
            data-house-field="${overlay.quantityFieldId}"
          />
          <button type="button" class="c-grain-shop-qty-btn" data-house-action="${overlay.incrementActionId}" aria-label="增加">+</button>
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

  const clickable = viewModel.dialogue.advanceActionId != null;
  const footerClassName = options.footerClassName ?? "c-grain-shop-dialogue";
  const ariaLabel = options.ariaLabel ?? "对话";
  const isNarration = viewModel.dialogue.mode === "narration";

  return `
    <footer class="${footerClassName}" aria-label="${ariaLabel}">
      <div
        class="c-grain-shop-dialogue__text c-grain-shop-skin-card ${clickable ? "c-grain-shop-dialogue__text--clickable" : ""}"
        ${clickable ? `data-house-action="${viewModel.dialogue.advanceActionId}" role="button" tabindex="0"` : ""}
      >
        ${viewModel.dialogue.textLines
          .map((line) => `<p class="c-grain-shop-dialogue__line">${line}</p>`)
          .join("")}
        ${
          viewModel.dialogue.advanceHintText == null
            ? ""
            : `<p class="c-grain-shop-dialogue__hint">${viewModel.dialogue.advanceHintText}</p>`
        }
      </div>
      ${
        isNarration
          ? ""
          : `
            <div class="c-grain-shop-dialogue__npc">
              <div class="c-grain-shop-portrait" aria-hidden="true">
                ${
                  viewModel.dialogue.portraitImageUrl == null
                    ? `<span class="c-grain-shop-portrait__art ${viewModel.dialogue.portraitArtClassName ?? ""}"></span>`
                    : `<img class="c-grain-shop-portrait__image" src="${viewModel.dialogue.portraitImageUrl}" alt="">`
                }
              </div>
              <p class="c-grain-shop-portrait__name c-grain-shop-nameplate c-grain-shop-nameplate--small">
                ${viewModel.dialogue.speakerName ?? ""}
              </p>
            </div>
          `
      }
    </footer>
  `;
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
