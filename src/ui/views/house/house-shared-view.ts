import type {
  HouseActionViewModel,
  HouseCharacterCardLevel,
  HouseModuleViewModel,
  HouseOverlayViewModel,
  HouseStandbyActorViewModel,
} from "../../../domain/house-module";
import { getReviewCompletionGradeLabel } from "../../../application/review/faction-review";
import { NPC_INTERACTION_DEFAULT_OPTIONS } from "../../../domain/npc-interaction";
import {
  renderDialogueTypewriterHint,
  renderDialogueTypewriterLines,
} from "../../dialogue-typewriter";

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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getAssessmentPopupClassName(
  fieldCount: number,
  extraClassName = ""
): string {
  const classNames = [
    "c-assessment-popup",
    "c-house-contribution-settlement",
    ...(fieldCount >= 4 ? ["c-assessment-popup--wide"] : []),
    ...extraClassName.trim().split(/\s+/u).filter(Boolean),
  ];

  return ` ${[...new Set(classNames)].join(" ")}`;
}

function normalizeCardLevel(
  level: HouseStandbyActorViewModel["cardLevel"]
): HouseCharacterCardLevel {
  return level == null ? 1 : level;
}

function isDismissHouseAction(action: HouseActionViewModel): boolean {
  const normalizedId = action.id.toLowerCase();

  return (
    normalizedId === "dismiss-dialogue" ||
    normalizedId === "close" ||
    normalizedId.endsWith(":close") ||
    action.label === "关闭" ||
    action.label.includes("退下") ||
    action.label.includes("离开")
  );
}

function renderHouseActionButton(action: HouseActionViewModel): string {
  return `
    <button
      type="button"
      class="c-button c-grain-shop-button ${action.tone === "accent" ? "c-grain-shop-button--gold" : "c-grain-shop-button--paper"}"
      data-house-action="${escapeHtml(action.id)}"
      ${action.disabled ? "disabled" : ""}
    >
      ${escapeHtml(action.label)}
    </button>
  `;
}

function renderHouseReviewOverlayButton(input: {
  actionId: string;
  label: string;
  tone?: "paper" | "gold";
}): string {
  const buttonTone =
    input.tone === "paper" ? "c-grain-shop-button--paper" : "c-grain-shop-button--gold";

  return `
    <button
      type="button"
      class="c-button c-grain-shop-button ${buttonTone} c-house-review-button"
      data-house-action="${escapeHtml(input.actionId)}"
    >
      ${escapeHtml(input.label)}
    </button>
  `;
}

function shouldAppendDefaultNpcActions(
  actions: HouseActionViewModel[],
  targetActor: HouseStandbyActorViewModel | null
): boolean {
  if (targetActor?.interactionActions == null) {
    return false;
  }

  const targetActionIds = new Set(
    targetActor.interactionActions.map((action) => action.id)
  );

  return actions.some((action) => targetActionIds.has(action.id));
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
  const isAssessmentTaskPopup =
    overlay.title === "本轮差事已定" || overlay.title === "寺务已定";
  const overlayVariantAttribute =
    options.overlayAttribute ?? ' data-house-alert-variant="assessment-popup"';
  const modalClassName = `c-grain-shop-modal c-grain-shop-skin-panel${
    getAssessmentPopupClassName(overlay.paragraphs.length, options.modalClassName)
  }${isContributionSettlement ? " c-house-contribution-popup" : ""}${
    isAssessmentTaskPopup ? " c-house-assessment-task-popup" : ""
  }`;

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
  const modalClassName = `c-grain-shop-modal c-grain-shop-skin-panel${getAssessmentPopupClassName(
    overlay.paragraphs.length
  )}`;

  return `
    <div class="c-grain-shop-overlay" data-house-overlay="confirm" data-house-overlay-variant="assessment-popup">
      <div class="${modalClassName}" role="dialog" aria-modal="true">
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
  const modalClassName = `c-grain-shop-modal c-grain-shop-skin-panel${getAssessmentPopupClassName(
    overlay.paragraphs.length + 4,
    options.modalClassName
  )}`;
  const overlayVariantAttribute =
    options.overlayAttribute ?? ' data-house-overlay-variant="assessment-popup"';

  return `
    <div class="c-grain-shop-overlay" data-house-overlay="quantity-confirm"${overlayVariantAttribute}>
      <div class="${modalClassName}" role="dialog" aria-modal="true">
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

export function renderHouseReviewAssignmentTableOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "review-assignment-table" }>
): string {
  const rows = overlay.rows
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.characterName)}</td>
          <td>${escapeHtml(row.assignmentTitle)}</td>
          <td>${escapeHtml(getReviewCompletionGradeLabel(row.grade))}</td>
        </tr>
      `
    )
    .join("");

  return `
    <div class="c-grain-shop-overlay" data-house-overlay="review-assignment-table" data-house-overlay-variant="review-assignment-table">
      <div class="c-grain-shop-modal c-grain-shop-skin-panel c-assessment-popup c-house-review-popup c-house-review-popup--table c-assessment-popup--wide" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${escapeHtml(overlay.title)}</h3>
        <div class="c-grain-shop-modal__body">
          <table class="c-house-review-table">
            <thead><tr><th>人物</th><th>委任</th><th>完成情况</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <div class="c-grain-shop-modal__actions c-house-review-actions">
          ${renderHouseReviewOverlayButton({
            actionId: overlay.confirmActionId,
            label: overlay.confirmLabel,
          })}
        </div>
      </div>
    </div>
  `;
}

export function renderHouseReviewPolicyPanelOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "review-policy-panel" }>
): string {
  const closeAction =
    overlay.closeActionId == null
      ? ""
      : `
        <div class="c-grain-shop-modal__actions c-house-review-actions">
          ${renderHouseReviewOverlayButton({
            actionId: overlay.closeActionId,
            label: overlay.closeLabel ?? "关闭",
            tone: "paper",
          })}
        </div>
      `;

  return `
    <div class="c-grain-shop-overlay" data-house-overlay="review-policy-panel" data-house-overlay-variant="review-policy-panel">
      <div class="c-grain-shop-modal c-grain-shop-skin-panel c-assessment-popup c-house-review-popup c-house-review-popup--policy" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${escapeHtml(overlay.title)}</h3>
        <div class="c-grain-shop-modal__body">
          <dl class="c-house-review-policy">
            <dt>总目标</dt>
            <dd>${escapeHtml(overlay.policy.overallGoal)}</dd>
            <dt>阶段目标</dt>
            <dd>${escapeHtml(overlay.policy.phaseGoal)}</dd>
            <dt>执行计划</dt>
            <dd>${escapeHtml(overlay.policy.executionPlan)}</dd>
          </dl>
        </div>
        ${closeAction}
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

  const targetActor =
    viewModel.standbyRoster.find((actor) => actor.isSelected === true) ??
    viewModel.standbyRoster[0] ??
    null;
  const targetCharacterId =
    targetActor == null ? null : escapeHtml(targetActor.characterId);
  const primaryHouseActions = viewModel.actionContainer.actions.filter(
    (action) => !isDismissHouseAction(action)
  );
  const dismissHouseActions = viewModel.actionContainer.actions.filter(
    isDismissHouseAction
  );
  const appendDefaultNpcActions = shouldAppendDefaultNpcActions(
    viewModel.actionContainer.actions,
    targetActor
  );
  const defaultNpcActions =
    targetCharacterId == null || !appendDefaultNpcActions
      ? ""
      : NPC_INTERACTION_DEFAULT_OPTIONS.map((option) => {
          const buttonTone =
            option.tone === "accent"
              ? "c-grain-shop-button--gold"
              : "c-grain-shop-button--paper";
          const disabled = option.kind === "gift" || option.disabled === true;

          return `
            <button
              type="button"
              class="c-button c-grain-shop-button ${buttonTone}"
              data-npc-action="${escapeHtml(option.kind)}"
              data-character-id="${targetCharacterId}"
              ${disabled ? "disabled" : ""}
            >
              ${escapeHtml(option.label)}
            </button>
          `;
        }).join("");

  return `
    <div class="c-grain-shop-center c-grain-shop-center--open">
      <nav
        class="c-grain-shop-actions"
        aria-label="${viewModel.actionContainer.title ?? "房屋操作"}"
      >
        ${primaryHouseActions.map(renderHouseActionButton).join("")}
        ${defaultNpcActions}
        ${dismissHouseActions.map(renderHouseActionButton).join("")}
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
          const targetAttributes = renderHouseNpcTargetAttributes(viewModel, actor);
          const ariaLabel = escapeHtml(`与 ${actor.name} 交谈`);

          return `
            <button
              type="button"
              class="c-grain-shop-npc-idle__button${selectedClass}"
              ${targetAttributes}
              aria-label="${ariaLabel}"
            >
              ${renderHouseCharacterCard(actor, { secondaryText })}
            </button>
          `;
        })
        .join("")}
    </aside>
  `;
}

export function renderHouseNpcTargetAttributes(
  viewModel: HouseModuleViewModel,
  actor: HouseStandbyActorViewModel
): string {
  const houseId = escapeHtml(viewModel.houseId);
  const moduleId = escapeHtml(viewModel.moduleId);

  if (actor.disabled === true) {
    return `
      data-npc-context-type="house"
      data-house-id="${houseId}"
      data-house-module-id="${moduleId}"
      disabled
    `;
  }

  const npcContext = JSON.stringify({
    type: "house",
    houseId: viewModel.houseId,
    moduleId: viewModel.moduleId,
  });

  return `
    data-npc-target="${escapeHtml(actor.characterId)}"
    data-npc-context="${escapeHtml(npcContext)}"
    data-npc-context-type="house"
    data-house-id="${houseId}"
    data-house-module-id="${moduleId}"
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
  const typewriterLines = renderDialogueTypewriterLines(viewModel.dialogue.textLines);

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
        ${typewriterLines.markup}
        ${
          viewModel.dialogue.advanceHintText == null
            ? ""
            : renderDialogueTypewriterHint(
                viewModel.dialogue.advanceHintText,
                typewriterLines.totalDurationMs
              )
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
