import type { ActivePlayableSession } from "../../../core/contracts/playable-runtime";
import { GRAIN_ACCOUNTING_TEXT } from "../../../application/playables/builtin/grain-accounting";

type HouseSession = {
  moduleId: string;
  state: unknown;
};

export function renderHousePlayableOverlay(input: {
  session: ActivePlayableSession | null | undefined;
  houseSession: HouseSession | null | undefined;
}): string {
  const playableId = input.session?.playableId;
  if (
    playableId !== "grain-accounting" &&
    playableId !== "medicine-compounding"
  ) {
    return "";
  }

  const overlay = readOverlay(input.houseSession);
  if (overlay == null) {
    return "";
  }

  const body =
    playableId === "grain-accounting"
      ? renderGrainAccountingBody(overlay)
      : renderMedicineCompoundingBody(overlay);
  if (body.length === 0) {
    return "";
  }

  return `
    <div class="c-grain-shop-overlay" data-playable-overlay="${playableId}">
      <div class="c-grain-shop-modal c-grain-shop-modal--game c-grain-shop-skin-panel c-temple-house-modal" role="dialog" aria-modal="true">
        ${body}
      </div>
    </div>
  `;
}

function readOverlay(houseSession: HouseSession | null | undefined): Record<string, unknown> | null {
  const sessionState = houseSession?.state;
  if (sessionState == null || typeof sessionState !== "object") {
    return null;
  }
  const overlay = (sessionState as { overlay?: unknown }).overlay;
  if (overlay == null || typeof overlay !== "object") {
    return null;
  }
  return overlay as Record<string, unknown>;
}

function renderGrainAccountingBody(overlay: Record<string, unknown>): string {
  if (overlay.type !== "minigame") {
    return "";
  }

  const question = readObject(overlay.question);
  return `
    <div class="c-stage-header">
      <div>
        <p class="c-stage-header__eyebrow">${GRAIN_ACCOUNTING_TEXT.eyebrow}</p>
        <h1 class="c-stage-header__title">${GRAIN_ACCOUNTING_TEXT.title}</h1>
      </div>
    </div>
    <div class="c-house-interior">
      <div class="c-panel">
        <p>${GRAIN_ACCOUNTING_TEXT.describeTrade(question)}</p>
        <p>${GRAIN_ACCOUNTING_TEXT.describeDisplayedStock(question)}</p>
        <p>${GRAIN_ACCOUNTING_TEXT.describeScore(overlay)}</p>
      </div>
      <div class="c-house-roster">
        <button class="c-button" data-playable-id="grain-accounting" data-playable-action="answer-correct">${GRAIN_ACCOUNTING_TEXT.answerCorrect}</button>
        <button class="c-button" data-playable-id="grain-accounting" data-playable-action="answer-wrong">${GRAIN_ACCOUNTING_TEXT.answerWrong}</button>
      </div>
    </div>
  `;
}

function renderMedicineCompoundingBody(overlay: Record<string, unknown>): string {
  if (overlay.type !== "compounding") {
    return "";
  }

  const target = readObject(overlay.target);
  const herbs = Array.isArray(overlay.availableHerbs) ? overlay.availableHerbs : [];
  return `
    <div class="c-stage-header">
      <div>
        <p class="c-stage-header__eyebrow">玩法</p>
        <h1 class="c-stage-header__title">药材炼制</h1>
      </div>
    </div>
    <div class="c-house-interior">
      <div class="c-panel">
        <p>目标病症：${formatValue(target.ailmentName)}</p>
        <p>剩余选择 ${formatValue(overlay.selectionsLeft)} 次 / 剩余 ${formatValue(overlay.secondsLeft)} 秒</p>
      </div>
      <div class="c-house-roster">
        ${herbs
          .map((herb) => {
            const herbRecord = readObject(herb);
            return `
              <button class="c-button" data-playable-id="medicine-compounding" data-playable-action="select-herb" data-herb-id="${formatValue(herbRecord.id)}">
                ${formatValue(herbRecord.name)}
              </button>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function readObject(value: unknown): Record<string, unknown> {
  return value != null && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function formatValue(value: unknown): string {
  return String(value ?? "");
}
