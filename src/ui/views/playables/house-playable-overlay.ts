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
  const playableId = resolvePlayableId(input.session, input.houseSession);
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
    return renderGrainAccountingResultBody(overlay);
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
    return renderMedicineCompoundingResultBody(overlay);
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
        <button class="c-button" data-playable-id="medicine-compounding" data-playable-action="clear">
          清空已选
        </button>
        <button class="c-button" data-playable-id="medicine-compounding" data-playable-action="finish">
          完成炼制
        </button>
      </div>
    </div>
  `;
}

function renderGrainAccountingResultBody(overlay: Record<string, unknown>): string {
  if (overlay.type !== "result") {
    return "";
  }

  const reward = readObject(overlay.reward);
  return `
    <div class="c-stage-header">
      <div>
        <p class="c-stage-header__eyebrow">${GRAIN_ACCOUNTING_TEXT.eyebrow}</p>
        <h1 class="c-stage-header__title">${GRAIN_ACCOUNTING_TEXT.title}</h1>
      </div>
    </div>
    <div class="c-house-interior">
      <div class="c-panel">
        <p>评级：${formatValue(overlay.grade)}</p>
        <p>得分：${formatValue(overlay.score)}</p>
        <p>银两 +${formatValue(reward.money)} / 算术 +${formatValue(reward.math)} / 关系 +${formatValue(reward.relationship)}</p>
        <p>耗时 ${formatValue(overlay.durationDays)} 天</p>
      </div>
      <div class="c-house-roster">
        <button class="c-button" data-playable-action="close-result">收起结果</button>
      </div>
    </div>
  `;
}

function renderMedicineCompoundingResultBody(overlay: Record<string, unknown>): string {
  if (overlay.type !== "result") {
    return "";
  }

  const summaryLines = Array.isArray(overlay.summaryLines)
    ? overlay.summaryLines
    : [];
  const rewardLines = Array.isArray(overlay.rewardLines)
    ? overlay.rewardLines
    : [];
  return `
    <div class="c-stage-header">
      <div>
        <p class="c-stage-header__eyebrow">玩法</p>
        <h1 class="c-stage-header__title">药材炼制</h1>
      </div>
    </div>
    <div class="c-house-interior">
      <div class="c-panel">
        <p>评级：${formatValue(overlay.grade)}</p>
        ${summaryLines.map((line) => `<p>${formatValue(line)}</p>`).join("")}
        ${rewardLines.map((line) => `<p>${formatValue(line)}</p>`).join("")}
      </div>
      <div class="c-house-roster">
        <button class="c-button" data-playable-action="close-result">收起结果</button>
      </div>
    </div>
  `;
}

function resolvePlayableId(
  session: ActivePlayableSession | null | undefined,
  houseSession: HouseSession | null | undefined
): string | null {
  if (session?.playableId != null) {
    return session.playableId;
  }

  if (houseSession?.moduleId === "grain-shop") {
    return "grain-accounting";
  }

  if (houseSession?.moduleId === "medicine-house") {
    return "medicine-compounding";
  }

  return null;
}

function readObject(value: unknown): Record<string, unknown> {
  return value != null && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function formatValue(value: unknown): string {
  return String(value ?? "");
}
