import type { HouseModuleViewModel, HouseOverlayViewModel } from "../../../domain/house-module";
import {
  renderHouseActionContainer,
  renderHouseAlertOverlay,
  renderHouseConfirmOverlay,
  renderHouseDialogue,
  renderHouseLeaveButton,
  renderHouseStandbyRoster,
  renderHouseStatusCard,
} from "./house-shared-view";

const MEDICINE_HERB_CARD_CLASS_NAMES = [
  "c-medicine-house-herb-card--frame-a",
  "c-medicine-house-herb-card--frame-b",
  "c-medicine-house-herb-card--frame-c",
  "c-medicine-house-herb-card--frame-d",
  "c-medicine-house-herb-card--frame-e",
  "c-medicine-house-herb-card--frame-f",
] as const;

const MEDICINE_HERB_ART_CLASS_BY_ID: Record<string, string> = {
  herb_ai_cao: "c-medicine-house-herb-art--ai-cao",
  herb_huang_lian: "c-medicine-house-herb-art--huang-lian",
  herb_sheng_jiang: "c-medicine-house-herb-art--sheng-jiang",
  herb_bo_he: "c-medicine-house-herb-art--bo-he",
  herb_dang_gui: "c-medicine-house-herb-art--dang-gui",
  herb_xing_ren: "c-medicine-house-herb-art--xing-ren",
  herb_gan_cao: "c-medicine-house-herb-art--gan-cao",
  herb_wu_tou: "c-medicine-house-herb-art--wu-tou",
};

type MedicineCompoundingOverlayViewModel = Extract<
  HouseOverlayViewModel,
  { type: "medicine-compounding" }
>;

type MedicineCompoundingHerbViewModel =
  MedicineCompoundingOverlayViewModel["herbs"][number];

type SelectedMedicineHerbViewModel = MedicineCompoundingHerbViewModel & {
  amount: number;
  coldBalance: number;
};

type MedicineMixTotals = {
  coldBalance: number;
  heal: number;
  poison: number;
};

function getHerbArtClassName(herbId: string): string {
  return MEDICINE_HERB_ART_CLASS_BY_ID[herbId] ?? "c-medicine-house-herb-art--generic";
}

function getHerbCardFrameClassName(index: number): string {
  return (
    MEDICINE_HERB_CARD_CLASS_NAMES[index % MEDICINE_HERB_CARD_CLASS_NAMES.length] ??
    MEDICINE_HERB_CARD_CLASS_NAMES[0]
  );
}

function parseSelectionAmount(line: string): { name: string; amount: number } | null {
  const match = /^(.*)\s×(\d+)$/.exec(line.trim());
  if (match == null) {
    return null;
  }

  const [, rawName = "", rawAmount = ""] = match;
  const amount = Number.parseInt(rawAmount, 10);
  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  return {
    name: rawName.trim(),
    amount,
  };
}

function deriveSelectedHerbs(
  overlay: MedicineCompoundingOverlayViewModel
): SelectedMedicineHerbViewModel[] {
  return overlay.selectionSummary.flatMap((line) => {
    const parsed = parseSelectionAmount(line);
    if (parsed == null) {
      return [];
    }

    const herb = overlay.herbs.find((entry) => entry.name === parsed.name);
    if (herb == null) {
      return [];
    }

    return [
      {
        ...herb,
        amount: parsed.amount,
        coldBalance: herb.cold - herb.heat,
      },
    ];
  });
}

function deriveMixTotals(selectedHerbs: SelectedMedicineHerbViewModel[]): MedicineMixTotals {
  return selectedHerbs.reduce<MedicineMixTotals>(
    (totals, herb) => ({
      coldBalance: totals.coldBalance + herb.coldBalance * herb.amount,
      heal: totals.heal + herb.heal * herb.amount,
      poison: totals.poison + herb.poison * herb.amount,
    }),
    { coldBalance: 0, heal: 0, poison: 0 }
  );
}

function createFixedSlots<T>(items: T[], slotCount: number): Array<T | null> {
  return Array.from({ length: slotCount }, (_, index) => items[index] ?? null);
}

function renderHerbPalette(
  overlay: MedicineCompoundingOverlayViewModel,
  selectedHerbs: SelectedMedicineHerbViewModel[]
): string {
  const selectedById = new Map(selectedHerbs.map((herb) => [herb.id, herb.amount]));
  const slots = createFixedSlots(overlay.herbs, 9);

  return slots
    .map((herb, index) => {
      if (herb == null) {
        return `
          <div class="c-medicine-house-herb-card c-medicine-house-herb-card--empty ${getHerbCardFrameClassName(index)}" aria-hidden="true">
            <span class="c-medicine-house-herb-card__empty-text">待配</span>
          </div>
        `;
      }

      const selectedAmount = selectedById.get(herb.id) ?? 0;
      const accentLabel =
        herb.cold > herb.heat
          ? `寒 ${herb.cold}`
          : herb.heat > herb.cold
            ? `热 ${herb.heat}`
            : "平";

      return `
        <button
          type="button"
          class="c-medicine-house-herb-card ${getHerbCardFrameClassName(index)}${
            selectedAmount > 0 ? " is-selected" : ""
          }"
          data-house-action="${herb.actionId}"
          aria-label="加入药材 ${herb.name}"
        >
          <span class="c-medicine-house-herb-card__name">${herb.name}</span>
          <span class="c-medicine-house-herb-card__amount">${selectedAmount > 0 ? selectedAmount : ""}</span>
          <span class="c-medicine-house-herb-art ${getHerbArtClassName(herb.id)}" aria-hidden="true"></span>
          <span class="c-medicine-house-herb-card__meta">
            <span>${accentLabel}</span>
            <span>效 ${herb.heal}</span>
            <span>毒 ${herb.poison}</span>
          </span>
        </button>
      `;
    })
    .join("");
}

function renderSelectedTray(selectedHerbs: SelectedMedicineHerbViewModel[]): string {
  return createFixedSlots(selectedHerbs, 8)
    .map((herb) => {
      if (herb == null) {
        return `<div class="c-medicine-house-tray__slot" aria-hidden="true"></div>`;
      }

      return `
        <div class="c-medicine-house-tray__slot c-medicine-house-tray__slot--filled">
          <span class="c-medicine-house-herb-art ${getHerbArtClassName(herb.id)}" aria-hidden="true"></span>
          <span class="c-medicine-house-tray__name">${herb.name}</span>
          <span class="c-medicine-house-tray__amount">${herb.amount}</span>
        </div>
      `;
    })
    .join("");
}

function renderCauldronContents(selectedHerbs: SelectedMedicineHerbViewModel[]): string {
  return selectedHerbs
    .map(
      (herb) => `
        <div class="c-medicine-house-cauldron__token">
          <span class="c-medicine-house-herb-art ${getHerbArtClassName(herb.id)}" aria-hidden="true"></span>
          <span class="c-medicine-house-cauldron__token-amount">${herb.amount}</span>
        </div>
      `
    )
    .join("");
}

function renderStatRow(input: {
  label: string;
  iconClassName: string;
  value: number;
  max: number;
  fillClassName: string;
}): string {
  const safeMax = Math.max(1, input.max);
  const fillPercent = Math.min(1, Math.abs(input.value) / safeMax);

  return `
    <div class="c-medicine-house-stats__row">
      <span class="c-medicine-house-stats__icon ${input.iconClassName}" aria-hidden="true"></span>
      <div class="c-medicine-house-stats__metric">
        <div class="c-medicine-house-stats__metric-head">
          <span>${input.label}</span>
        </div>
        <span class="c-medicine-house-stats__bar">
          <span
            class="c-medicine-house-stats__fill ${input.fillClassName}"
            style="--medicine-fill-scale:${fillPercent.toFixed(3)};"
          ></span>
        </span>
      </div>
      <span class="c-medicine-house-stats__value">${input.value}</span>
    </div>
  `;
}

function renderBuyOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "medicine-buy" }>
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="medicine-buy">
      <div class="c-grain-shop-modal c-grain-shop-modal--trade c-grain-shop-skin-panel c-house-trade-popup" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <div class="c-medicine-house-buy__list">
          ${overlay.items
            .map(
              (item) => `
                <button
                  type="button"
                  class="c-button c-grain-shop-button c-grain-shop-button--paper c-medicine-house-buy__item${
                    item.isSelected ? " is-selected" : ""
                  }"
                  data-house-action="${item.actionId}"
                  ${item.disabled ? "disabled" : ""}
                >
                  <span class="c-medicine-house-buy__name">${item.name}</span>
                  <span class="c-medicine-house-buy__meta">${item.typeLabel} · ${item.price} 文</span>
                </button>
              `
            )
            .join("")}
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

function renderCompoundingOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "medicine-compounding" }>
): string {
  const selectedHerbs = deriveSelectedHerbs(overlay);
  const totals = deriveMixTotals(selectedHerbs);

  return `
    <div class="c-grain-shop-overlay c-medicine-house-overlay" data-house-overlay="medicine-compounding">
      <div class="c-medicine-house-compounding" role="dialog" aria-modal="true" aria-label="${overlay.title}">
        <section class="c-medicine-house-scene">
          <header class="c-medicine-house-scene__top">
            <div class="c-medicine-house-top-panel">
              <div class="c-medicine-house-top-panel__segment c-medicine-house-top-panel__segment--label">
                <span class="c-medicine-house-top-panel__subtle">本回合</span>
                <strong>病症</strong>
              </div>
              <div class="c-medicine-house-top-panel__segment c-medicine-house-top-panel__segment--ailment">
                ${overlay.ailmentName}
              </div>
              <div class="c-medicine-house-top-panel__segment">
                <span class="c-medicine-house-top-panel__subtle">目标属性</span>
              </div>
              <div class="c-medicine-house-top-panel__segment">
                <span class="c-medicine-house-top-panel__metric-label">寒性</span>
                <strong>${overlay.coldRequired}</strong>
              </div>
              <div class="c-medicine-house-top-panel__segment">
                <span class="c-medicine-house-top-panel__metric-label">药效</span>
                <strong>${overlay.healRequired}</strong>
              </div>
              <div class="c-medicine-house-top-panel__segment">
                <span class="c-medicine-house-top-panel__metric-label">毒性</span>
                <strong>&le;${overlay.maxPoison}</strong>
              </div>
            </div>
            <div class="c-medicine-house-scene__meta">
              <span>剩余 <strong>${overlay.secondsLeft}</strong> 秒</span>
              <span>还可加药 <strong>${overlay.selectionsLeft}</strong> 次</span>
            </div>
          </header>

          <aside class="c-medicine-house-scene__herbs">
            <div class="c-medicine-house-herbs-panel">
              <span class="c-medicine-house-herbs-panel__tag">药材</span>
              <div class="c-medicine-house-herbs-panel__grid">
                ${renderHerbPalette(overlay, selectedHerbs)}
              </div>
              <div class="c-medicine-house-herbs-panel__pager" aria-hidden="true">
                <span class="c-medicine-house-herbs-panel__arrow">◀</span>
                <span>1/1</span>
                <span class="c-medicine-house-herbs-panel__arrow">▶</span>
              </div>
            </div>
          </aside>

          <div class="c-medicine-house-scene__cauldron">
            <div class="c-medicine-house-cauldron">
              <span class="c-medicine-house-cauldron__hint">点击药材加入药盘</span>
              <div class="c-medicine-house-cauldron__dropzone" aria-label="药盘投放区">
                ${
                  selectedHerbs.length === 0
                    ? '<p class="c-medicine-house-cauldron__empty">尚未投药</p>'
                    : `<div class="c-medicine-house-cauldron__contents">${renderCauldronContents(
                        selectedHerbs
                      )}</div>`
                }
              </div>
            </div>
          </div>

          <aside class="c-medicine-house-scene__stats">
            <div class="c-medicine-house-stats">
              <div class="c-medicine-house-stats__title">当前属性</div>
              <div class="c-medicine-house-stats__body">
                ${renderStatRow({
                  label: "寒性",
                  iconClassName: "c-medicine-house-stats__icon--cold",
                  value: totals.coldBalance,
                  max: Math.max(6, Math.abs(overlay.coldRequired), Math.abs(totals.coldBalance)),
                  fillClassName:
                    totals.coldBalance < 0
                      ? "c-medicine-house-stats__fill--warm"
                      : "c-medicine-house-stats__fill--cold",
                })}
                ${renderStatRow({
                  label: "药效",
                  iconClassName: "c-medicine-house-stats__icon--heal",
                  value: totals.heal,
                  max: Math.max(6, overlay.healRequired, totals.heal),
                  fillClassName: "c-medicine-house-stats__fill--heal",
                })}
                ${renderStatRow({
                  label: "毒性",
                  iconClassName: "c-medicine-house-stats__icon--poison",
                  value: totals.poison,
                  max: Math.max(3, overlay.maxPoison, totals.poison),
                  fillClassName: "c-medicine-house-stats__fill--poison",
                })}
              </div>
            </div>
          </aside>

          <div class="c-medicine-house-scene__drawer" aria-hidden="true"></div>

          <footer class="c-medicine-house-scene__tray">
            <div class="c-medicine-house-tray">
              <div class="c-medicine-house-tray__items">
                ${renderSelectedTray(selectedHerbs)}
              </div>
            </div>
          </footer>

          <button
            type="button"
            class="c-button c-grain-shop-button c-grain-shop-button--paper c-medicine-house-scene__clear"
            data-house-action="${overlay.clearActionId}"
            ${selectedHerbs.length === 0 ? "disabled" : ""}
          >
            ${overlay.clearLabel}
          </button>

          <button
            type="button"
            class="c-medicine-house-scene__finish"
            data-house-action="${overlay.finishActionId}"
          >
            ${overlay.finishLabel}
          </button>
        </section>
      </div>
    </div>
  `;
}

function renderResultOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "result" }>
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="result">
      <div class="c-grain-shop-modal c-grain-shop-skin-panel" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <div class="c-grain-shop-modal__body">
          <p class="c-grain-shop-result__grade">评级：<strong>${overlay.grade}</strong></p>
          ${overlay.rewardLines.map((line) => `<p>${line}</p>`).join("")}
        </div>
        <div class="c-grain-shop-modal__actions">
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-house-action="${overlay.confirmActionId}">
            ${overlay.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderOverlay(overlay: HouseOverlayViewModel | null): string {
  if (overlay == null) {
    return "";
  }

  if (overlay.type === "alert") {
    return renderHouseAlertOverlay(overlay);
  }

  if (overlay.type === "confirm") {
    return renderHouseConfirmOverlay(overlay);
  }

  if (overlay.type === "medicine-buy") {
    return renderBuyOverlay(overlay);
  }

  if (overlay.type === "medicine-compounding") {
    return renderCompoundingOverlay(overlay);
  }

  if (overlay.type === "result") {
    return renderResultOverlay(overlay);
  }

  return "";
}

export function renderMedicineHouseHouseView(viewModel: HouseModuleViewModel): string {
  const isIdle = viewModel.dialogue == null;

  return `
    <section class="view-house-grain-shop view-house-medicine-house" data-house-module="${viewModel.moduleId}">
      ${renderHouseActionContainer(viewModel)}
      ${renderHouseStandbyRoster(viewModel, {
        asideClassName: "c-grain-shop-npc-idle",
        asideLabel: "药铺",
      })}
      ${renderHouseDialogue(viewModel, {
        footerClassName: "c-grain-shop-dialogue",
      })}
      ${isIdle ? renderHouseLeaveButton(viewModel) : ""}
      ${renderHouseStatusCard(viewModel)}
      ${renderOverlay(viewModel.overlay)}
    </section>
  `;
}
