import type { NpcInteractionMenuViewModel } from "../../../domain/npc-interaction";
import type { NpcInteractionSession } from "../../../domain/npc-interaction";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderNpcInteractionMenu(
  menu: NpcInteractionMenuViewModel | null
): string {
  if (menu == null) {
    return "";
  }

  const targetName = escapeHtml(menu.targetName);
  const targetCharacterId = escapeHtml(menu.targetCharacterId);
  const actions = menu.options
    .map((option) => {
      const buttonTone =
        option.tone === "accent"
          ? "c-grain-shop-button--gold"
          : "c-grain-shop-button--paper";
      const disabled = option.disabled === true ? "disabled" : "";
      const optionId = escapeHtml(option.id);
      const optionKind = escapeHtml(option.kind);
      const optionLabel = escapeHtml(option.label);

      if (option.kind === "special") {
        return `
          <button
            type="button"
            class="c-button c-grain-shop-button ${buttonTone}"
            data-npc-action="special"
            data-house-action="${optionId}"
            ${disabled}
          >
            ${optionLabel}
          </button>
        `;
      }

      return `
        <button
          type="button"
          class="c-button c-grain-shop-button ${buttonTone}"
          data-npc-action="${optionKind}"
          data-character-id="${targetCharacterId}"
          ${disabled}
        >
          ${optionLabel}
        </button>
      `;
    })
    .join("");

  return `
    <div
      class="c-grain-shop-center c-grain-shop-center--open c-npc-interaction-overlay"
      data-npc-menu="interaction"
      role="dialog"
      aria-modal="true"
      aria-label="${targetName}"
    >
      <nav class="c-grain-shop-actions c-npc-interaction-actions" aria-label="${targetName}">
        ${actions}
        <button
          type="button"
          class="c-button c-grain-shop-button c-grain-shop-button--paper c-npc-interaction-dismiss"
          data-npc-action="close"
        >
          关闭
        </button>
      </nav>
    </div>
  `;
}

export function renderNpcInteractionDialogue(input: {
  session: NpcInteractionSession;
  targetName: string | null;
  portraitImageUrl?: string | null;
  portraitArtClassName?: string | null;
}): string {
  if (
    input.session == null ||
    input.session.mode !== "dialogue" ||
    input.targetName == null
  ) {
    return "";
  }

  const targetName = escapeHtml(input.targetName);
  const greetingText = escapeHtml(`你与 ${input.targetName} 简短交谈。`);
  const portraitImageUrl =
    input.portraitImageUrl == null ? null : escapeHtml(input.portraitImageUrl);
  const portraitArtClassName =
    input.portraitArtClassName == null
      ? ""
      : ` ${escapeHtml(input.portraitArtClassName)}`;

  return `
    <div
      class="c-grain-shop-center c-grain-shop-center--open c-npc-interaction-overlay"
      data-npc-dialogue="default-talk"
      role="dialog"
      aria-modal="true"
      aria-label="${targetName} 谈话"
    >
      <div class="c-npc-interaction-stack">
        <div class="c-grain-shop-dialogue__text c-grain-shop-skin-card c-npc-interaction-dialogue-text">
          <p class="c-grain-shop-dialogue__speaker">${targetName}</p>
          <p class="c-grain-shop-dialogue__line">${greetingText}</p>
        </div>
        <div class="c-grain-shop-dialogue__npc c-npc-interaction-dialogue-npc">
          <div class="c-grain-shop-portrait" aria-hidden="true">
            ${
              portraitImageUrl == null
                ? `<span class="c-grain-shop-portrait__art${portraitArtClassName}"></span>`
                : `<img class="c-grain-shop-portrait__image" src="${portraitImageUrl}" alt="">`
            }
          </div>
          <p class="c-grain-shop-portrait__name c-grain-shop-nameplate c-grain-shop-nameplate--small">
            ${targetName}
          </p>
        </div>
        <nav class="c-grain-shop-actions c-npc-interaction-actions" aria-label="${targetName} 谈话选项">
          <button
            type="button"
            class="c-button c-grain-shop-button c-grain-shop-button--gold"
            data-npc-action="continue"
          >
            继续
          </button>
          <button
            type="button"
            class="c-button c-grain-shop-button c-grain-shop-button--paper c-npc-interaction-dismiss"
            data-npc-action="close"
          >
            关闭
          </button>
        </nav>
      </div>
    </div>
  `;
}
