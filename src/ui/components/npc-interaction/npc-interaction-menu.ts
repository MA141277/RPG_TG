import type { NpcInteractionMenuViewModel } from "../../../domain/npc-interaction";

export function renderNpcInteractionMenu(
  menu: NpcInteractionMenuViewModel | null
): string {
  if (menu == null) {
    return "";
  }

  return `
    <div class="c-npc-interaction-overlay" data-npc-menu="interaction">
      <section class="c-npc-interaction-menu" role="dialog" aria-modal="true" aria-label="${menu.targetName}">
        <h2 class="c-npc-interaction-menu__title">${menu.targetName}</h2>
        <div class="c-npc-interaction-menu__actions">
          ${menu.options
            .map((option) => {
              const buttonTone =
                option.tone === "accent"
                  ? "c-grain-shop-button--gold"
                  : "c-grain-shop-button--paper";
              const disabled = option.disabled === true ? "disabled" : "";

              if (option.kind === "special") {
                return `
                  <button
                    type="button"
                    class="c-button c-grain-shop-button ${buttonTone}"
                    data-npc-action="special"
                    data-house-action="${option.id}"
                    ${disabled}
                  >
                    ${option.label}
                  </button>
                `;
              }

              return `
                <button
                  type="button"
                  class="c-button c-grain-shop-button ${buttonTone}"
                  data-npc-action="${option.kind}"
                  data-character-id="${menu.targetCharacterId}"
                  ${disabled}
                >
                  ${option.label}
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
