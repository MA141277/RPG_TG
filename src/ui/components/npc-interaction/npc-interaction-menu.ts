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

  return `
    <div class="c-npc-interaction-overlay" data-npc-menu="interaction">
      <section class="c-npc-interaction-menu" role="dialog" aria-modal="true" aria-label="${targetName}">
        <h2 class="c-npc-interaction-menu__title">${targetName}</h2>
        <div class="c-npc-interaction-menu__actions">
          ${menu.options
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
            .join("")}
        </div>
        <button
          type="button"
          class="c-button c-grain-shop-button c-grain-shop-button--paper"
          data-npc-action="close"
        >
          关闭
        </button>
      </section>
    </div>
  `;
}

export function renderNpcInteractionDialogue(input: {
  session: NpcInteractionSession;
  targetName: string | null;
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

  return `
    <div class="c-npc-interaction-overlay" data-npc-dialogue="default-talk">
      <section class="c-npc-interaction-menu" role="dialog" aria-modal="true" aria-label="${targetName} 谈话">
        <h2 class="c-npc-interaction-menu__title">${targetName}</h2>
        <div class="c-npc-interaction-menu__body">
          <p class="c-grain-shop-dialogue__speaker">${targetName}</p>
          <p class="c-grain-shop-dialogue__line">${greetingText}</p>
        </div>
        <div class="c-npc-interaction-menu__actions">
          <button
            type="button"
            class="c-button c-grain-shop-button c-grain-shop-button--gold"
            data-npc-action="continue"
          >
            继续
          </button>
          <button
            type="button"
            class="c-button c-grain-shop-button c-grain-shop-button--paper"
            data-npc-action="close"
          >
            关闭
          </button>
        </div>
      </section>
    </div>
  `;
}
