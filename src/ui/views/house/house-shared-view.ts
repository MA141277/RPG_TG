import type {
  HouseCharacterCardLevel,
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

type OverlaySkinOptions = {
  overlayAttribute?: string;
  modalClassName?: string;
};

type IdleOwnerOptions = {
  containerClassName?: string;
  buttonClassName?: string;
  renderSecondaryText?: (actor: HouseStandbyActorViewModel) => string;
};

type CharacterCardOptions = {
  className?: string;
  secondaryText?: string;
  cardLevel?: HouseCharacterCardLevel;
};

function normalizeCardLevel(
  level: HouseStandbyActorViewModel["cardLevel"]
): HouseCharacterCardLevel {
  return level == null ? 1 : level;
}

export function renderHouseCharacterCard(
  actor: HouseStandbyActorViewModel,
  options: CharacterCardOptions = {}
): string {
  const cardLevel = options.cardLevel ?? normalizeCardLevel(actor.cardLevel);
  const className = options.className == null ? "" : ` ${options.className}`;
  const secondaryText = options.secondaryText ?? "";

  return `
    <article class="c-house-character-card${className}" data-house-card-level="${cardLevel}">
      <span class="c-house-character-card__banner" aria-hidden="true"></span>
      <span class="c-house-character-card__ornament" aria-hidden="true"></span>
      <span class="c-house-character-card__frame" aria-hidden="true"></span>
      <div class="c-house-character-card__portrait" aria-hidden="true">
        ${
          actor.avatarImageUrl == null
            ? `<span class="c-house-character-card__portrait-art ${actor.avatarArtClassName ?? ""}"></span>`
            : `<img class="c-house-character-card__portrait-image" src="${actor.avatarImageUrl}" alt="">`
        }
      </div>
      <div class="c-house-character-card__body">
        <strong class="c-house-character-card__name">${actor.name}</strong>
        ${secondaryText}
      </div>
    </article>
  `;
}

export function renderHouseAlertOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "alert" }>,
  options: OverlaySkinOptions = {}
): string {
  const isContributionSettlement =
    overlay.title.includes("贡献") &&
    overlay.paragraphs.length > 0 &&
    overlay.paragraphs.every((paragraph) => paragraph.includes("贡献"));
  const usesContributionSettlementSkin =
    isContributionSettlement ||
    overlay.title === "本轮差事已定" ||
    overlay.title === "寺务已定";
  const isAssessmentTaskPopup =
    overlay.title === "本轮差事已定" || overlay.title === "寺务已定";
  const overlayVariantAttribute = usesContributionSettlementSkin
    ? ' data-house-alert-variant="contribution-settlement"'
    : (options.overlayAttribute ?? "");
  const modalClassName = `c-grain-shop-modal c-grain-shop-skin-panel${
    usesContributionSettlementSkin ? " c-house-contribution-settlement" : ""
  }${isContributionSettlement ? " c-house-contribution-popup" : ""}${
    isAssessmentTaskPopup ? " c-house-assessment-task-popup" : ""
  }${options.modalClassName ?? ""}`;

  return `
    <div class="c-grain-shop-overlay" data-house-overlay="alert"${overlayVariantAttribute}>
      <div class="${modalClassName}" role="dialog" aria-modal="true">
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

export function renderHouseConfirmOverlay(
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

export function renderHouseQuantityConfirmOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "quantity-confirm" }>,
  options: OverlaySkinOptions = {}
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="quantity-confirm"${options.overlayAttribute ?? ""}>
      <div class="c-grain-shop-modal c-grain-shop-skin-panel${options.modalClassName ?? ""}" role="dialog" aria-modal="true">
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
              ${renderHouseCharacterCard(actor, { secondaryText })}
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

  return `
    <footer class="${footerClassName}" aria-label="${ariaLabel}">
      <div
        class="c-grain-shop-dialogue__text c-grain-shop-skin-card ${clickable ? "c-grain-shop-dialogue__text--clickable" : ""}"
        ${clickable ? `data-house-action="${viewModel.dialogue.advanceActionId}" role="button" tabindex="0"` : ""}
      >
        ${
          viewModel.dialogue.mode === "character" &&
          viewModel.dialogue.speakerName != null
            ? `<p class="c-grain-shop-dialogue__speaker">${viewModel.dialogue.speakerName}</p>`
            : ""
        }
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
        viewModel.dialogue.mode === "character"
          ? `
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
          : ""
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
        ${renderHouseCharacterCard(actor, {
          secondaryText,
          cardLevel: actor.cardLevel ?? 3,
        })}
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
