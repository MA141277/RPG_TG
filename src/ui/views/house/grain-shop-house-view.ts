import { accountingMaxWrongAnswers } from "../../../content/houses/grain-shop-content";
import type { HouseDefinition } from "../../../domain/house";
import type { GrainShopPlayerSnapshot } from "../../../domain/grain-shop";
import type { GrainShopSessionUi } from "./grain-shop-ui-state";

export type GrainShopHouseViewModel = {
  houseDefinition: HouseDefinition;
  snapshot: GrainShopPlayerSnapshot;
  sessionUi: GrainShopSessionUi;
  npcName: string;
};

function renderAlertOverlay(overlay: Extract<GrainShopSessionUi["overlay"], { type: "alert" }>): string {
  return `
    <div class="c-grain-shop-overlay" data-grain-shop-overlay="alert">
      <div class="c-grain-shop-modal c-grain-shop-skin-panel" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <div class="c-grain-shop-modal__body">${overlay.bodyHtml}</div>
        <div class="c-grain-shop-modal__actions">
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-grain-shop-action="close-alert">知道了</button>
        </div>
      </div>
    </div>
  `;
}

function renderTradeOverlay(
  overlay: Extract<GrainShopSessionUi["overlay"], { type: "trade" }>
): string {
  const isBuy = overlay.mode === "buy";

  return `
    <div class="c-grain-shop-overlay" data-grain-shop-overlay="trade">
      <div class="c-grain-shop-modal c-grain-shop-modal--trade c-grain-shop-skin-panel" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${isBuy ? "买粮" : "卖粮"}</h3>
        <p class="c-grain-shop-trade__price">当前粮价：1石 = ${overlay.grainPrice}文</p>
        <label class="c-grain-shop-trade__label" for="grain-trade-quantity">数量（石）</label>
        <div class="c-grain-shop-trade__quantity">
          <button type="button" class="c-grain-shop-qty-btn" data-grain-shop-action="trade-qty-minus" aria-label="减少">−</button>
          <input
            id="grain-trade-quantity"
            class="c-grain-shop-trade__input"
            type="number"
            min="1"
            value="${overlay.quantity}"
            data-grain-shop-field="trade-quantity"
          />
          <button type="button" class="c-grain-shop-qty-btn" data-grain-shop-action="trade-qty-plus" aria-label="增加">+</button>
        </div>
        <p class="c-grain-shop-trade__total">合计：${overlay.tradeTotal}文</p>
        <div class="c-grain-shop-modal__actions c-grain-shop-modal__actions--split">
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-grain-shop-action="close-trade">取消</button>
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-grain-shop-action="confirm-trade">
            ${isBuy ? "确认购买" : "确认卖出"}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderMinigameOverlay(
  overlay: Extract<GrainShopSessionUi["overlay"], { type: "minigame" }>
): string {
  const { question } = overlay;
  const wrongsLeft = accountingMaxWrongAnswers - overlay.wrongCount;

  return `
    <div class="c-grain-shop-overlay" data-grain-shop-overlay="minigame">
      <div class="c-grain-shop-modal c-grain-shop-modal--game c-grain-shop-skin-panel" role="dialog" aria-modal="true">
        <header class="c-grain-shop-game__header">
          <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">帮忙算账</h3>
          <div class="c-grain-shop-game__hud">
            <span>剩余 <strong>${overlay.secondsLeft}</strong> 秒</span>
            <span>得分 <strong>${overlay.score}</strong></span>
            <span>还可错 <strong>${wrongsLeft}</strong> 次</span>
          </div>
        </header>
        <div class="c-grain-shop-ledger c-grain-shop-skin-card">
          <p>购入：${question.bought}石</p>
          <p>卖出：${question.sold}石</p>
          <p>库存：${question.displayedStock}石</p>
        </div>
        <div class="c-grain-shop-game__actions">
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-grain-shop-action="ledger-correct">账对</button>
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-grain-shop-action="ledger-wrong">账错</button>
        </div>
      </div>
    </div>
  `;
}

function renderResultOverlay(
  overlay: Extract<GrainShopSessionUi["overlay"], { type: "result" }>
): string {
  const { reward, grade, score } = overlay;
  const mathText =
    reward.math > 0
      ? `算术 +${reward.math}`
      : reward.math < 0
        ? `算术 ${reward.math}`
        : "算术 不变";
  const moneyText = reward.money > 0 ? `金钱 +${reward.money}` : "金钱 不变";
  const relText =
    reward.relationship > 0
      ? `与掌柜关系 +${reward.relationship}`
      : "与掌柜关系 不变";

  return `
    <div class="c-grain-shop-overlay" data-grain-shop-overlay="result">
      <div class="c-grain-shop-modal c-grain-shop-skin-panel" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">算账结算</h3>
        <div class="c-grain-shop-modal__body">
          <p class="c-grain-shop-result__grade">评级：<strong>${grade}</strong></p>
          <p>本局得分：${score} 分</p>
          <ul class="c-grain-shop-result__rewards">
            <li>${mathText}</li>
            <li>${moneyText}</li>
            <li>${relText}</li>
            <li>时间 +1</li>
          </ul>
        </div>
        <div class="c-grain-shop-modal__actions">
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-grain-shop-action="close-result">收工</button>
        </div>
      </div>
    </div>
  `;
}

function renderOverlays(sessionUi: GrainShopSessionUi): string {
  const { overlay } = sessionUi;
  if (overlay == null) {
    return "";
  }

  switch (overlay.type) {
    case "alert":
      return renderAlertOverlay(overlay);
    case "trade":
      return renderTradeOverlay(overlay);
    case "minigame":
      return renderMinigameOverlay(overlay);
    case "result":
      return renderResultOverlay(overlay);
    default:
      return "";
  }
}

function renderActionButtons(): string {
  return `
    <nav class="c-grain-shop-actions" aria-label="粮铺功能">
      <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-grain-shop-action="buy">买粮</button>
      <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-grain-shop-action="sell">卖粮</button>
      <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-grain-shop-action="investigate">调查市价</button>
      <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-grain-shop-action="accounting">帮忙算账</button>
      <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-grain-shop-action="dismiss-dialogue">关闭</button>
    </nav>
  `;
}

function renderDialogue(
  npcName: string,
  dialogueText: string,
  isGreeting: boolean
): string {
  const advanceAction = isGreeting ? "advance-greeting" : null;
  const dialogueAttrs =
    advanceAction != null
      ? `data-grain-shop-action="${advanceAction}" role="button" tabindex="0"`
      : "";

  return `
    <footer class="c-grain-shop-dialogue" aria-label="对话">
      <div class="c-grain-shop-dialogue__text c-grain-shop-skin-card ${isGreeting ? "c-grain-shop-dialogue__text--clickable" : ""}" ${dialogueAttrs}>
        <p class="c-grain-shop-dialogue__line">「${dialogueText}」</p>
        ${isGreeting ? `<p class="c-grain-shop-dialogue__hint">点击继续</p>` : ""}
      </div>
      <div class="c-grain-shop-dialogue__npc">
        <div class="c-grain-shop-portrait" aria-hidden="true">
          <span class="c-grain-shop-portrait__placeholder">掌柜</span>
        </div>
        <p class="c-grain-shop-portrait__name c-grain-shop-nameplate c-grain-shop-nameplate--small">${npcName}</p>
      </div>
    </footer>
  `;
}

function renderIdleNpcAvatar(npcName: string): string {
  return `
    <aside class="c-grain-shop-npc-idle" aria-label="${npcName}">
      <button
        type="button"
        class="c-grain-shop-npc-idle__button"
        data-grain-shop-action="open-npc-dialogue"
        aria-label="与${npcName}对话"
      >
        <div class="c-grain-shop-avatar" aria-hidden="true">
          <span class="c-grain-shop-avatar__placeholder">掌柜</span>
        </div>
        <p class="c-grain-shop-avatar__name c-grain-shop-nameplate c-grain-shop-nameplate--small">${npcName}</p>
      </button>
    </aside>
  `;
}

export function renderGrainShopHouseView(viewModel: GrainShopHouseViewModel): string {
  const { houseDefinition, snapshot, sessionUi, npcName } = viewModel;
  const { dialoguePhase } = sessionUi;
  const isIdle = dialoguePhase === "idle";
  const isGreeting = dialoguePhase === "greeting";
  const isOpen = dialoguePhase === "open";
  const dialogueText = isGreeting ? sessionUi.npcGreeting : sessionUi.npcDefaultLine;
  const viewClass = "view-house-grain-shop";

  return `
    <section class="${viewClass}">
      ${
        isOpen
          ? `
      <div class="c-grain-shop-center c-grain-shop-center--open">
        ${renderActionButtons()}
      </div>
      `
          : ""
      }

      ${isIdle ? renderIdleNpcAvatar(npcName) : ""}

      ${!isIdle ? renderDialogue(npcName, dialogueText, isGreeting) : ""}

      ${
        isIdle
          ? `
      <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold c-grain-shop-leave" data-action="leave-house">
        离开
      </button>
      `
          : ""
      }

      <aside class="c-grain-shop-scene-card c-grain-shop-skin-dark" aria-label="当前场景">
        <p class="c-grain-shop-scene-card__eyebrow">屋敷</p>
        <h2 class="c-grain-shop-scene-card__title">${houseDefinition.name}</h2>
        <p class="c-grain-shop-scene-card__subtitle">陈记杂粮 · 南北通商</p>
        <dl class="c-grain-shop-scene-card__stats">
          <div>
            <dt>银钱</dt>
            <dd>${snapshot.money} 文</dd>
          </div>
          <div>
            <dt>粮仓</dt>
            <dd>${snapshot.food} 石</dd>
          </div>
          <div>
            <dt>市价</dt>
            <dd>${snapshot.grainPrice} 文</dd>
          </div>
        </dl>
      </aside>

      ${renderOverlays(sessionUi)}
    </section>
  `;
}
