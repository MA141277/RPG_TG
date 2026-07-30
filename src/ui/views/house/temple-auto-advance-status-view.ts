import type { AutoAdvanceStatusPanel } from "../../../application/app-shell";

const templePopupOverlayAttribute =
  ' data-house-overlay-variant="temple-utility-popup"';
const templePopupModalClassName =
  " c-assessment-popup c-house-contribution-settlement c-house-temple-utility-popup";

export function renderTempleAutoAdvanceStatusPanel(
  panel: AutoAdvanceStatusPanel
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="temple-auto-advance-status"${templePopupOverlayAttribute}>
      <div class="c-grain-shop-modal c-grain-shop-skin-panel c-temple-house-modal${templePopupModalClassName}" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${panel.title}</h3>
        <div class="c-grain-shop-modal__body">
          ${panel.lines.map((line) => `<p>${line}</p>`).join("")}
        </div>
      </div>
    </div>
  `;
}
