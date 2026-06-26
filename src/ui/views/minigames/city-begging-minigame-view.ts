import type { CityBeggingMiniGameState } from "../../../domain/city-begging-minigame";
import type { CityBeggingGranaryEscortPlayingState } from "../../../domain/minigames/city-begging-granary-escort";
import type {
  CityBeggingVillageFeedbackState,
  CityBeggingVillageItemState,
  CityBeggingVillagePlayingState,
} from "../../../domain/minigames/city-begging-village-catching";
import { CITY_BEGGING_DURATION_DAYS } from "../../../application/minigames/city-begging-minigame";
import { ACTIVITY_COMPLETION_STAMINA_COST } from "../../../application/player/player-stamina";
import { CITY_BEGGING_GRANARY_ESCORT_CONFIG } from "../../../application/minigames/city-begging-granary-escort";
import { CITY_BEGGING_VILLAGE_CATCHING_CONFIG } from "../../../application/minigames/city-begging-village-catching";

const BEGGING_VILLAGE_ITEM_ASSETS = {
  monk: new URL(
    "../../../../ui/化缘UI/material-202606031551-015.png",
    import.meta.url
  ).href,
  comboToast: new URL(
    "../../../../ui/化缘UI/material-202606031551-010.png",
    import.meta.url
  ).href,
  riceBag: [
    new URL(
      "../../../../ui/化缘UI/material-202606031551-019.png",
      import.meta.url
    ).href,
    new URL(
      "../../../../ui/化缘UI/material-202606031551-020.png",
      import.meta.url
    ).href,
  ],
  steamedBun: [
    new URL(
      "../../../../ui/化缘UI/material-202606031551-023.png",
      import.meta.url
    ).href,
    new URL(
      "../../../../ui/化缘UI/material-202606031551-024.png",
      import.meta.url
    ).href,
  ],
  coin: new URL(
    "../../../../ui/化缘UI/material-202606031551-026.png",
    import.meta.url
  ).href,
  rat: [
    new URL(
      "../../../../ui/化缘UI/material-202606031551-025.png",
      import.meta.url
    ).href,
    new URL(
      "../../../../ui/化缘UI/material-202606031551-027.png",
      import.meta.url
    ).href,
    new URL(
      "../../../../ui/化缘UI/material-202606031551-029.png",
      import.meta.url
    ).href,
  ],
  brokenBowl: new URL(
    "../../../../ui/化缘UI/material-202606031551-028.png",
    import.meta.url
  ).href,
  beam: [
    new URL(
      "../../../../ui/化缘UI/material-202606031551-033.png",
      import.meta.url
    ).href,
    new URL(
      "../../../../ui/化缘UI/material-202606031551-050.png",
      import.meta.url
    ).href,
    new URL(
      "../../../../ui/化缘UI/material-202606031551-051.png",
      import.meta.url
    ).href,
    new URL(
      "../../../../ui/化缘UI/material-202606031551-052.png",
      import.meta.url
    ).href,
  ],
} as const;

const beggingVillageImageCache = new Map<string, HTMLImageElement>();

function formatTimeLabel(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatSecondsLabel(remainingMs: number): string {
  return Math.max(0, Math.ceil(remainingMs / 1000)).toString().padStart(2, "0");
}

function formatVillageScore(rawScore: number, effectiveScore: number): string {
  const scoreValue = Math.max(rawScore, effectiveScore);
  return Math.round(scoreValue * 100).toString();
}

function formatVillageFoodLabel(previewFoodGain: number): string {
  return `${previewFoodGain}斗`;
}

function renderResultStats(
  entries: Array<{ label: string; value: string }>
): string {
  return `
    <dl class="c-begging-game__result-stats">
      ${entries
        .map(
          (entry) => `
            <div>
              <dt>${entry.label}</dt>
              <dd>${entry.value}</dd>
            </div>
          `
        )
        .join("")}
    </dl>
  `;
}

function getBeggingVillageImage(source: string): HTMLImageElement {
  let image = beggingVillageImageCache.get(source);
  if (image != null) {
    return image;
  }

  image = new Image();
  image.decoding = "async";
  image.src = source;
  beggingVillageImageCache.set(source, image);
  return image;
}

function drawBeggingVillageImage(
  context: CanvasRenderingContext2D,
  source: string,
  x: number,
  y: number,
  width: number,
  height: number,
  alpha = 1
): void {
  const image = getBeggingVillageImage(source);
  if (!image.complete || image.naturalWidth <= 0 || image.naturalHeight <= 0) {
    return;
  }

  context.save();
  context.globalAlpha = alpha;
  context.drawImage(image, x, y, width, height);
  context.restore();
}

function renderVillageComboPips(): string {
  return Array.from({ length: 10 }, (_, index) => {
    const pipIndex = index + 1;
    return `<span class="c-begging-game__village-combo-pip" data-begging-game-combo-pip="${pipIndex}"></span>`;
  }).join("");
}

function renderGranaryEscortOverlay(state: CityBeggingMiniGameState): string {
  if (state.variantId !== "granary-escort") {
    return "";
  }

  if (state.variantState.status === "result") {
    return `
      <div class="c-begging-game" role="dialog" aria-modal="true" aria-label="化缘小游戏结算">
        <div class="c-begging-game__veil"></div>
        <div class="c-begging-game__panel c-begging-game__panel--result">
          <section class="c-begging-game__result-card">
            <p class="c-begging-game__eyebrow">化缘结束</p>
            <h2 class="c-begging-game__result-title">本次获得粮食：${state.variantState.result.foodGain}斗</h2>
            ${renderResultStats([
              { label: "成功送达米袋", value: `${state.variantState.successCount}个` },
              { label: "最高连击", value: `${state.variantState.maxCombo}` },
              { label: "耗时", value: `${CITY_BEGGING_DURATION_DAYS}天` },
              { label: "体力", value: `-${ACTIVITY_COMPLETION_STAMINA_COST}` },
            ])}
            <button
              type="button"
              class="c-begging-game__confirm"
              data-action="confirm-begging-game-result"
            >
              确定
            </button>
          </section>
        </div>
      </div>
    `;
  }

  return `
    <div class="c-begging-game" role="dialog" aria-modal="true" aria-label="化缘小游戏">
      <div class="c-begging-game__veil"></div>
      <div class="c-begging-game__panel c-begging-game__panel--battle">
        <main class="c-begging-game__shell">
          <section class="c-begging-game__play-area" aria-label="化缘护粮区域">
            <header class="c-begging-game__hud">
              <div class="c-begging-game__hud-item">
                <span class="c-begging-game__hud-label">剩余时间</span>
                <strong class="c-begging-game__hud-value" data-begging-game-time>${formatTimeLabel(
                  state.variantState.remainingMs
                )}</strong>
              </div>
              <div class="c-begging-game__hud-item">
                <span class="c-begging-game__hud-label">当前获得粮食</span>
                <strong class="c-begging-game__hud-value" data-begging-game-food>${formatVillageFoodLabel(
                  state.variantState.previewFoodGain
                )}</strong>
              </div>
            </header>
            <div class="c-begging-game__board-wrap">
              <div class="c-begging-game__board">
                <canvas
                  class="c-begging-game__canvas"
                  data-begging-game-canvas
                  width="${CITY_BEGGING_GRANARY_ESCORT_CONFIG.world.width}"
                  height="${CITY_BEGGING_GRANARY_ESCORT_CONFIG.world.height}"
                ></canvas>
                <div class="c-begging-game__combo" data-begging-game-combo></div>
              </div>
            </div>
          </section>
          <aside class="c-begging-game__side-panel" aria-label="化缘提示">
            <section class="c-begging-game__side-card">
              <h2 class="c-begging-game__side-title">护送米袋</h2>
              <p class="c-begging-game__side-copy">左右移动，避开鼠患，把米袋送到目的地。</p>
            </section>
          </aside>
        </main>
      </div>
    </div>
  `;
}

function renderVillageStatusPanel(state: CityBeggingVillagePlayingState): string {
  return `
    <aside class="c-begging-game__village-side-panel c-begging-game__village-side-panel--left" aria-label="化缘状态">
      <section class="c-begging-game__village-card c-begging-game__village-card--score">
        <span class="c-begging-game__village-card-label">积分</span>
        <strong class="c-begging-game__village-card-value" data-begging-game-score>${formatVillageScore(
          state.rawScore,
          state.effectiveScore
        )}</strong>
      </section>
      <section class="c-begging-game__village-card c-begging-game__village-card--combo">
        <span class="c-begging-game__village-card-label">连击</span>
        <strong
          class="c-begging-game__village-card-value c-begging-game__village-card-value--combo"
          data-begging-game-current-combo
        >${state.combo}</strong>
        <div class="c-begging-game__village-combo-pips" data-begging-game-combo-pips>
          ${renderVillageComboPips()}
        </div>
      </section>
      <section class="c-begging-game__village-card c-begging-game__village-card--food">
        <span class="c-begging-game__village-card-label">换算粮食</span>
        <span class="c-begging-game__village-food-bag" aria-hidden="true"></span>
        <strong
          class="c-begging-game__village-card-value c-begging-game__village-card-value--food"
          data-begging-game-food
        >${formatVillageFoodLabel(state.previewFoodGain)}</strong>
      </section>
    </aside>
  `;
}

function renderVillageEventPanel(state: CityBeggingVillagePlayingState): string {
  const eventActive = state.benevolenceRemainingMs > 0;

  return `
    <aside class="c-begging-game__village-side-panel c-begging-game__village-side-panel--right" aria-label="化缘事件">
      <section class="c-begging-game__village-card c-begging-game__village-card--timer">
        <div class="c-begging-game__village-timer-dial">
          <span class="c-begging-game__village-timer-label">时</span>
          <strong class="c-begging-game__village-timer-value" data-begging-game-time>${formatSecondsLabel(
            state.remainingMs
          )}</strong>
          <span class="c-begging-game__village-timer-label">秒</span>
        </div>
      </section>
      <section
        class="c-begging-game__village-card c-begging-game__village-card--event ${eventActive ? "is-active" : ""}"
        data-begging-game-event-panel
      >
        <div class="c-begging-game__village-event-scroll">
          <span class="c-begging-game__village-event-text" data-begging-game-event>${eventActive ? "善人施舍" : "暂无施舍"}</span>
        </div>
        <strong class="c-begging-game__village-event-time" data-begging-game-event-time>${eventActive ? `${formatSecondsLabel(
          state.benevolenceRemainingMs
        )}秒` : "--秒"}</strong>
      </section>
    </aside>
  `;
}

function renderVillageCatchingOverlay(state: CityBeggingMiniGameState): string {
  if (state.variantId !== "village-catching") {
    return "";
  }

  if (state.variantState.status === "result") {
    return `
      <div class="c-begging-game" role="dialog" aria-modal="true" aria-label="化缘小游戏结算">
        <div class="c-begging-game__veil"></div>
        <div class="c-begging-game__panel c-begging-game__panel--result">
          <section class="c-begging-game__result-card c-begging-game__result-card--animated">
            <p class="c-begging-game__eyebrow">化缘结束</p>
            <h2 class="c-begging-game__result-title">获得粮食：${state.variantState.result.foodGain}斗</h2>
            ${renderResultStats([
              { label: "接住米袋", value: `${state.variantState.riceBagCaughtCount}个` },
              { label: "最高连击", value: `${state.variantState.maxCombo}` },
              { label: "评价", value: state.variantState.evaluation },
              { label: "耗时", value: `${CITY_BEGGING_DURATION_DAYS}天` },
              { label: "体力", value: `-${ACTIVITY_COMPLETION_STAMINA_COST}` },
            ])}
            <button
              type="button"
              class="c-begging-game__confirm"
              data-action="confirm-begging-game-result"
            >
              确定
            </button>
          </section>
        </div>
      </div>
    `;
  }

  return `
    <div class="c-begging-game c-begging-game--village" role="dialog" aria-modal="true" aria-label="化缘小游戏">
      <div class="c-begging-game__veil"></div>
      <div class="c-begging-game__panel c-begging-game__panel--village">
        <main class="c-begging-game__village-shell">
          ${renderVillageStatusPanel(state.variantState)}
          <section class="c-begging-game__village-battle-area" aria-label="化缘接物区域">
            <div class="c-begging-game__village-stage">
              <div class="c-begging-game__village-top-border" aria-hidden="true"></div>
              <div class="c-begging-game__village-floor" aria-hidden="true"></div>
              <section class="c-begging-game__village-board" aria-hidden="true"></section>
              <div class="c-begging-game__village-playzone">
                <canvas
                  class="c-begging-game__canvas c-begging-game__canvas--village"
                  data-begging-game-canvas
                  width="${CITY_BEGGING_VILLAGE_CATCHING_CONFIG.world.width}"
                  height="${CITY_BEGGING_VILLAGE_CATCHING_CONFIG.world.height}"
                ></canvas>
                <div class="c-begging-game__combo c-begging-game__combo--village" data-begging-game-combo></div>
              </div>
              <div class="c-begging-game__village-control" aria-hidden="true"></div>
            </div>
          </section>
          ${renderVillageEventPanel(state.variantState)}
        </main>
      </div>
    </div>
  `;
}

export function renderCityBeggingMiniGameOverlay(
  state: CityBeggingMiniGameState | null
): string {
  if (state == null) {
    return "";
  }

  return state.variantId === "granary-escort"
    ? renderGranaryEscortOverlay(state)
    : renderVillageCatchingOverlay(state);
}

function drawGranaryEscortScene(
  canvas: HTMLCanvasElement,
  state: CityBeggingGranaryEscortPlayingState
): void {
  const context = canvas.getContext("2d");
  if (context == null) {
    return;
  }

  const { width, height } = CITY_BEGGING_GRANARY_ESCORT_CONFIG.world;
  context.clearRect(0, 0, width, height);
  const sky = context.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#dfe5d0");
  sky.addColorStop(0.5, "#d7bf8e");
  sky.addColorStop(1, "#84603e");
  context.fillStyle = sky;
  context.fillRect(0, 0, width, height);
  context.fillStyle = "#caa16c";
  context.fillRect(0, 280, width, height - 280);
  context.fillStyle = "#6c4930";
  context.fillRect(792, 134, 164, 246);
  context.strokeStyle = "rgba(255, 244, 211, 0.8)";
  context.lineWidth = 3;
  context.strokeRect(812, 144, 130, 224);

  for (const rat of state.rats) {
    context.fillStyle = "#5d524d";
    context.beginPath();
    context.ellipse(rat.x, rat.y, 24, 12, 0, 0, Math.PI * 2);
    context.fill();
  }

  for (const bag of state.bags) {
    context.fillStyle = "#d8c39a";
    context.beginPath();
    context.ellipse(bag.x, bag.y, 18, 22, 0, 0, Math.PI * 2);
    context.fill();
  }

  context.fillStyle = "#722d21";
  context.beginPath();
  context.moveTo(state.playerX - 32, 452);
  context.lineTo(state.playerX - 20, 380);
  context.lineTo(state.playerX, 346);
  context.lineTo(state.playerX + 20, 380);
  context.lineTo(state.playerX + 32, 452);
  context.closePath();
  context.fill();
}

function resolveVillageItemSprite(
  item: CityBeggingVillageItemState
): { source: string; width: number; height: number; beamHeight?: number } {
  switch (item.kind) {
    case "rice-bag":
      return {
        source:
          BEGGING_VILLAGE_ITEM_ASSETS.riceBag[
            item.id % BEGGING_VILLAGE_ITEM_ASSETS.riceBag.length
          ] ?? BEGGING_VILLAGE_ITEM_ASSETS.riceBag[0],
        width: 70,
        height: 76,
        beamHeight: 154,
      };
    case "steamed-bun":
      return {
        source:
          BEGGING_VILLAGE_ITEM_ASSETS.steamedBun[
            item.id % BEGGING_VILLAGE_ITEM_ASSETS.steamedBun.length
          ] ?? BEGGING_VILLAGE_ITEM_ASSETS.steamedBun[0],
        width: 56,
        height: 48,
        beamHeight: 136,
      };
    case "coin":
      return {
        source: BEGGING_VILLAGE_ITEM_ASSETS.coin,
        width: 50,
        height: 50,
        beamHeight: 140,
      };
    case "rat":
      return {
        source:
          BEGGING_VILLAGE_ITEM_ASSETS.rat[
            item.id % BEGGING_VILLAGE_ITEM_ASSETS.rat.length
          ] ?? BEGGING_VILLAGE_ITEM_ASSETS.rat[0],
        width: 66,
        height: 50,
      };
    case "broken-bowl":
      return {
        source: BEGGING_VILLAGE_ITEM_ASSETS.brokenBowl,
        width: 62,
        height: 50,
      };
  }
}

function drawVillageItem(
  context: CanvasRenderingContext2D,
  item: CityBeggingVillageItemState
): void {
  const sprite = resolveVillageItemSprite(item);
  if (item.kind !== "rat" && item.kind !== "broken-bowl") {
    const beamSource =
      BEGGING_VILLAGE_ITEM_ASSETS.beam[
        item.id % BEGGING_VILLAGE_ITEM_ASSETS.beam.length
      ] ?? BEGGING_VILLAGE_ITEM_ASSETS.beam[0];
    drawBeggingVillageImage(
      context,
      beamSource,
      item.x - 15,
      item.y - (sprite.beamHeight ?? 140) + 18,
      30,
      sprite.beamHeight ?? 140,
      item.kind === "coin" ? 0.82 : 0.74
    );
  }

  drawBeggingVillageImage(
    context,
    sprite.source,
    item.x - sprite.width / 2,
    item.y - sprite.height / 2,
    sprite.width,
    sprite.height
  );
}

function drawVillagePlayer(
  context: CanvasRenderingContext2D,
  playerX: number,
  slowed: boolean
): void {
  const height = slowed ? 226 : 252;
  const width = Math.round((height * 175) / 260);
  drawBeggingVillageImage(
    context,
    BEGGING_VILLAGE_ITEM_ASSETS.monk,
    playerX - width / 2,
    CITY_BEGGING_VILLAGE_CATCHING_CONFIG.world.height - height + 24,
    width,
    height,
    slowed ? 0.82 : 1
  );
}

function drawVillageFeedbacks(
  context: CanvasRenderingContext2D,
  feedbacks: CityBeggingVillageFeedbackState[]
): void {
  context.font = '700 24px "KaiTi", "STKaiti", "Noto Serif SC", serif';
  context.textAlign = "center";
  context.textBaseline = "middle";
  for (const feedback of feedbacks) {
    context.globalAlpha = Math.max(0.25, feedback.ttlMs / 760);
    context.lineWidth = 5;
    context.strokeStyle = "rgba(37, 17, 5, 0.35)";
    context.strokeText(feedback.label, feedback.x, feedback.y);
    context.fillStyle = feedback.color;
    context.fillText(feedback.label, feedback.x, feedback.y);
  }
  context.globalAlpha = 1;
}

function drawVillageScene(
  canvas: HTMLCanvasElement,
  state: CityBeggingVillagePlayingState
): void {
  const context = canvas.getContext("2d");
  if (context == null) {
    return;
  }

  const { width, height } = CITY_BEGGING_VILLAGE_CATCHING_CONFIG.world;
  context.clearRect(0, 0, width, height);

  for (const item of state.items) {
    drawVillageItem(context, item);
  }

  drawVillagePlayer(context, state.playerX, state.slowedRemainingMs > 0);
  drawVillageFeedbacks(context, state.feedbacks);
}

export function syncCityBeggingMiniGameOverlay(
  root: ParentNode,
  state: CityBeggingMiniGameState | null
): void {
  if (state == null || state.variantState.status !== "playing") {
    return;
  }

  const timeValue = root.querySelector<HTMLElement>("[data-begging-game-time]");
  if (timeValue != null) {
    timeValue.textContent =
      state.variantId === "village-catching"
        ? formatSecondsLabel(state.variantState.remainingMs)
        : formatTimeLabel(state.variantState.remainingMs);
  }

  const foodValue = root.querySelector<HTMLElement>("[data-begging-game-food]");
  if (foodValue != null) {
    foodValue.textContent = formatVillageFoodLabel(state.variantState.previewFoodGain);
  }

  const scoreValue = root.querySelector<HTMLElement>("[data-begging-game-score]");
  if (scoreValue != null && state.variantId === "village-catching") {
    scoreValue.textContent = formatVillageScore(
      state.variantState.rawScore,
      state.variantState.effectiveScore
    );
  }

  const currentComboValue = root.querySelector<HTMLElement>(
    "[data-begging-game-current-combo]"
  );
  if (currentComboValue != null && state.variantId === "village-catching") {
    currentComboValue.textContent = `${state.variantState.combo}`;
  }

  const comboValue = root.querySelector<HTMLElement>("[data-begging-game-combo]");
  if (comboValue != null) {
    comboValue.textContent =
      state.variantState.comboToastValue == null
        ? ""
        : `连击 x${state.variantState.comboToastValue}`;
    comboValue.classList.toggle(
      "is-visible",
      state.variantState.comboToastValue != null
    );
  }

  const eventValue = root.querySelector<HTMLElement>("[data-begging-game-event]");
  if (eventValue != null && state.variantId === "village-catching") {
    const benevolenceActive = state.variantState.benevolenceRemainingMs > 0;
    eventValue.textContent = benevolenceActive ? "善人施舍" : "暂无施舍";
    eventValue.classList.toggle("is-visible", benevolenceActive);
  }

  const eventPanel = root.querySelector<HTMLElement>("[data-begging-game-event-panel]");
  if (eventPanel != null && state.variantId === "village-catching") {
    eventPanel.classList.toggle(
      "is-active",
      state.variantState.benevolenceRemainingMs > 0
    );
  }

  const eventTimeValue = root.querySelector<HTMLElement>(
    "[data-begging-game-event-time]"
  );
  if (eventTimeValue != null && state.variantId === "village-catching") {
    eventTimeValue.textContent =
      state.variantState.benevolenceRemainingMs > 0
        ? `${formatSecondsLabel(state.variantState.benevolenceRemainingMs)}秒`
        : "--秒";
  }

  if (state.variantId === "village-catching") {
    const comboPips = root.querySelectorAll<HTMLElement>(
      "[data-begging-game-combo-pip]"
    );
    const activePipCount = Math.min(10, state.variantState.combo);
    comboPips.forEach((pip, index) => {
      pip.classList.toggle("is-active", index < activePipCount);
    });
  }

  const canvas = root.querySelector<HTMLCanvasElement>("[data-begging-game-canvas]");
  if (canvas == null) {
    return;
  }

  if (state.variantId === "granary-escort") {
    drawGranaryEscortScene(canvas, state.variantState);
  } else {
    drawVillageScene(canvas, state.variantState);
  }
}
