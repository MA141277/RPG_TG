import type {
  NpcInteractionMenuViewModel,
  NpcInteractionSession,
} from "../../../domain/npc-interaction";
import { renderNpcInteractionDialoguePanel } from "./npc-interaction-dialogue-panel";

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
      const buttonSoundAttribute =
        option.buttonSound == null
          ? ""
          : ` data-button-sound="${option.buttonSound}"`;

      if (option.kind === "special") {
        return `
          <button
            type="button"
            class="c-button c-grain-shop-button ${buttonTone}"
            data-npc-action="special"
            data-house-action="${optionId}"
            ${buttonSoundAttribute}
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
          ${buttonSoundAttribute}
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
          data-button-sound="light"
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
  return renderNpcInteractionDialoguePanel({
    ...input,
    inlineHouseMode: false,
  });
}
