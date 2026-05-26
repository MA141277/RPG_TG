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
                <span class="c-grain-shop-avatar__art"></span>
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
                <span class="c-grain-shop-portrait__art"></span>
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

export function renderHouseStatusCard(
  viewModel: HouseModuleViewModel
): string {
  if (viewModel.statusCard == null) {
    return "";
  }

  return `
    <aside class="c-grain-shop-scene-card c-grain-shop-skin-dark" aria-label="当前场景">
      <p class="c-grain-shop-scene-card__eyebrow">${viewModel.statusCard.eyebrow}</p>
      <h2 class="c-grain-shop-scene-card__title">${viewModel.statusCard.title}</h2>
      ${
        viewModel.statusCard.subtitle == null
          ? ""
          : `<p class="c-grain-shop-scene-card__subtitle">${viewModel.statusCard.subtitle}</p>`
      }
      <dl class="c-grain-shop-scene-card__stats">
        ${viewModel.statusCard.metrics
          .map(
            (metric) => `
              <div>
                <dt>${metric.label}</dt>
                <dd>${metric.value}</dd>
              </div>
            `
          )
          .join("")}
      </dl>
    </aside>
  `;
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
