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

function renderGambleChoiceOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "gamble-choice" }>
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="gamble-choice">
      <div class="c-grain-shop-modal c-grain-shop-modal--trade c-grain-shop-skin-panel c-house-trade-popup" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <div class="c-grain-shop-modal__body">
          ${overlay.options
            .map(
              (option) => `
                <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper c-tavern-gamble__choice" data-house-action="${option.actionId}">
                  <strong>${option.label}</strong>
                  <span>${option.description}</span>
                </button>
              `
            )
            .join("")}
        </div>
        <div class="c-grain-shop-modal__actions">
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-house-action="${overlay.cancelActionId}">
            ${overlay.cancelLabel}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderGambleOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "gamble" }>
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="gamble">
      <div class="c-grain-shop-modal c-grain-shop-modal--trade c-grain-shop-skin-panel c-house-trade-popup" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <p class="c-grain-shop-trade__price">选择本次赌本</p>
        ${overlay.variantLabel == null ? "" : `<p class="c-grain-shop-trade__price">${overlay.variantLabel} / 选择本次赌本</p>`}
        <div class="c-grain-shop-trade__quantity">
          <button type="button" class="c-grain-shop-qty-btn" data-house-action="${overlay.decrementActionId}" aria-label="减少赌本">-</button>
          <div class="c-grain-shop-trade__input">${overlay.wager}</div>
          <button type="button" class="c-grain-shop-qty-btn" data-house-action="${overlay.incrementActionId}" aria-label="增加赌本">+</button>
        </div>
        <p class="c-grain-shop-trade__total">候选档位：${overlay.options.join(" / ")} 文</p>
        ${
          overlay.debugToggle == null
            ? ""
            : `
              <div class="c-grain-shop-modal__actions">
                <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-house-action="${overlay.debugToggle.actionId}">
                  ${overlay.debugToggle.label}
                </button>
              </div>
              <p class="c-grain-shop-trade__total">${overlay.debugToggle.helperText}</p>
            `
        }
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

function renderTile(tile: string): string {
  return `<span class="c-tavern-gamble__tile">${tile}</span>`;
}

function renderDiscardTile(tile: string | { label: string; fromPublicTile?: boolean }): string {
  const label = typeof tile === "string" ? tile : tile.label;
  const fromPublicTile = typeof tile === "string" ? false : tile.fromPublicTile === true;
  return `<span class="c-tavern-gamble__tile c-tavern-gamble__tile--discard${fromPublicTile ? " c-tavern-gamble__tile--discard-public" : ""}">${label}</span>`;
}

function renderPublicTileButton(
  tile: { id: string; label: string; selected: boolean; spent: boolean; covered?: boolean; actionId: string },
  canSelect: boolean
): string {
  return `
    <button
      type="button"
      class="c-tavern-gamble__tile c-tavern-gamble__tile--public${tile.selected ? " is-selected" : ""}${tile.spent ? " is-spent" : ""}${tile.covered ? " is-covered" : ""}"
      ${tile.actionId.length > 0 ? `data-house-action="${tile.actionId}"` : ""}
      ${canSelect && !tile.spent && tile.actionId.length > 0 ? "" : "disabled"}
    >
      ${tile.covered ? "盖牌" : tile.label}
    </button>
  `;
}

function renderTileButton(
  tile: {
    id: string;
    label: string;
    selected: boolean;
    covered?: boolean;
    tone?: "hand" | "public";
    entering?: boolean;
    revealIndex?: number;
    actionId?: string | undefined;
  },
  mode: "select" | "discard" | "idle"
): string {
  const action =
    tile.actionId ??
    (mode === "select"
      ? `gamble-play-tile:${tile.id}`
      : "");
  return `
    <button
      type="button"
      class="c-tavern-gamble__tile c-tavern-gamble__tile--hand${tile.tone === "public" ? " c-tavern-gamble__tile--hand-public" : ""}${tile.selected ? " is-selected" : ""}${tile.covered ? " is-covered" : ""}${tile.entering ? " is-entering" : ""}"
      data-house-sortable-tile="true"
      data-house-drag-payload="${tile.id}"
      data-house-drop-before="${tile.id}"
      ${action.length > 0 ? `data-house-action="${action}"` : ""}
      ${mode === "idle" || action.length === 0 ? 'aria-disabled="true"' : ""}
      ${tile.entering ? `style="--tile-enter-index:${tile.revealIndex ?? 0}"` : ""}
    >
      ${tile.covered ? "盖牌" : tile.label}
    </button>
  `;
}

function renderShortActionButton(input: {
  actionId: string;
  label: string;
  tone?: "paper" | "gold";
  available?: boolean;
  highlighted?: boolean;
  disabled?: boolean;
  extraClassName?: string;
}): string {
  const toneClass =
    input.tone === "gold"
      ? "c-grain-shop-button--gold"
      : "c-grain-shop-button--paper";
  const available = input.available === true;
  const disabled = input.disabled ?? !available;
  return `
    <button
      type="button"
      class="c-button c-grain-shop-button ${toneClass} c-tavern-gamble__action-button${input.extraClassName == null ? "" : ` ${input.extraClassName}`}"
      data-house-action="${input.actionId}"
      ${disabled ? "disabled" : ""}
    >
      ${input.label}
    </button>
  `;
}

function renderShortGambleTableOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "gamble-table"; variant: "short" }>
): string {
  const betweenHandActions = overlay.betweenHandActions ?? null;
  const isActionAvailable = (
    action: (typeof overlay.availableActions)[number]
  ): boolean => overlay.availableActions.includes(action);
  const shortClaimRowMarkup =
    overlay.claimOptions.length === 0
      ? ""
      : `
          <div class="c-tavern-gamble__actions-row c-tavern-gamble__actions-row--claim">
            ${overlay.claimOptions
              .map((option) =>
                renderShortActionButton({
                  actionId: option.actionId,
                  label: option.label,
                  available: overlay.highlightAvailableActions,
                  extraClassName: `c-tavern-gamble__meld-action${option.flashing ? " is-flashing" : ""}`,
                })
              )
              .join("")}
            ${
              overlay.claimPassAction == null
                ? ""
                : renderShortActionButton({
                    actionId: overlay.claimPassAction.actionId,
                    label: overlay.claimPassAction.label,
                    available: overlay.highlightAvailableActions,
                  })
            }
          </div>
        `;
  const shortClaimCountdownMarkup =
    overlay.claimCountdown == null
      ? ""
      : `
          <div class="c-tavern-gamble__claim-countdown">
            <div class="c-tavern-gamble__claim-countdown-copy">
              <span>碰 / 杠倒计时</span>
              <strong class="c-tavern-gamble__claim-countdown-value">${overlay.claimCountdown.label}</strong>
            </div>
            <div
              class="c-tavern-gamble__claim-countdown-track"
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="${overlay.claimCountdown.totalSeconds}"
              aria-valuenow="${overlay.claimCountdown.remainingSeconds}"
            >
              <span
                class="c-tavern-gamble__claim-countdown-fill"
                style="width: ${overlay.claimCountdown.progressPercent}%;"
              ></span>
            </div>
          </div>
        `;
  const shortPrimaryActionRowMarkup = `
          <div class="c-tavern-gamble__actions-row c-tavern-gamble__actions-row--primary">
            ${renderShortActionButton({
              actionId: overlay.actionIds.check,
              label: "让牌",
              available: overlay.highlightAvailableActions && isActionAvailable("check"),
            })}
            ${renderShortActionButton({
              actionId: overlay.actionIds.call,
              label: "跟注",
              available: overlay.highlightAvailableActions && isActionAvailable("call"),
            })}
            ${renderShortActionButton({
              actionId: overlay.actionIds.raise,
              label: "加注",
              available: overlay.highlightAvailableActions && isActionAvailable("raise"),
            })}
            ${renderShortActionButton({
              actionId: overlay.actionIds.fold,
              label: "弃牌",
              available: overlay.highlightAvailableActions && isActionAvailable("fold"),
            })}
            ${
              overlay.actionIds.draw == null
                ? ""
                : renderShortActionButton({
                    actionId: overlay.actionIds.draw,
                    label: "摸牌",
                    tone: "gold",
                    available: overlay.highlightAvailableActions && isActionAvailable("draw"),
                  })
            }
            ${
              overlay.actionIds.confirmDiscard == null
                ? ""
                : renderShortActionButton({
                    actionId: overlay.actionIds.confirmDiscard,
                    label: "打出",
                    tone: "gold",
                    available:
                      overlay.highlightAvailableActions &&
                      isActionAvailable("confirm-discard"),
                  })
            }
          </div>
        `;
  const shortSettlementActionsMarkup =
    betweenHandActions == null
      ? ""
      : `
                <footer class="c-tavern-gamble__actions c-tavern-gamble__showdown-actions">
                  ${
                    betweenHandActions.continueActionId == null
                      ? ""
                      : renderShortActionButton({
                          actionId: betweenHandActions.continueActionId,
                          label: "开始下一轮",
                          tone: "gold",
                          available:
                            overlay.highlightAvailableActions &&
                            isActionAvailable("continue"),
                        })
                  }
                  ${
                    betweenHandActions.rebuyActionId == null
                      ? ""
                      : renderShortActionButton({
                          actionId: betweenHandActions.rebuyActionId,
                          label: "补码再战",
                          tone: "gold",
                          available:
                            overlay.highlightAvailableActions &&
                            isActionAvailable("rebuy"),
                        })
                  }
                  ${renderShortActionButton({
                    actionId: betweenHandActions.cashOutActionId,
                    label: "结束对局",
                    tone: "gold",
                    available:
                      overlay.highlightAvailableActions &&
                      isActionAvailable("cash-out"),
                  })}
                </footer>
              `;

  return `
    <div class="c-grain-shop-overlay c-tavern-gamble-overlay c-tavern-gamble-overlay--short" data-house-overlay="gamble-table">
      <div class="c-grain-shop-modal c-grain-shop-skin-panel c-tavern-gamble c-tavern-gamble--short" role="dialog" aria-modal="true">
        <div class="c-grain-shop-modal__actions c-tavern-gamble__actions c-tavern-gamble__actions--top">
          ${renderShortActionButton({
            actionId: overlay.actionIds.close,
            label: "关闭",
            disabled: false,
          })}
        </div>
        <div class="c-tavern-gamble__table c-tavern-gamble__table--short">
          <aside class="c-tavern-gamble__sidebar" aria-label="短牌桌玩家">
            <h3>${overlay.title}</h3>
            ${overlay.playerRows
              .map(
                (player) => `
                  <div class="c-tavern-gamble__player${player.folded ? " is-folded" : ""}">
                    <div class="c-tavern-gamble__player-summary">
                      <strong>${player.name}</strong>
                      <span>${player.folded ? "已弃牌" : player.allIn ? "All-in" : player.autoBetPending ? "待自动下注" : "在局中"}</span>
                    </div>
                    <small>${overlay.chipLabel} ${player.stack} · 已投 ${player.committed}</small>
                    ${
                      (player.meldLabels ?? []).length === 0
                        ? ""
                        : `<div class="c-tavern-gamble__meld-strip">${(player.meldLabels ?? [])
                            .map((label) => `<span>${label}</span>`)
                            .join("")}</div>`
                    }
                    ${
                      player.discardLabels.length === 0
                        ? ""
                        : `<div class="c-tavern-gamble__discard-strip c-tavern-gamble__discard-strip--narrow">${player.discardLabels
                            .map(renderDiscardTile)
                            .join("")}</div>`
                    }
                  </div>
                `
              )
              .join("")}
          </aside>
          <section class="c-tavern-gamble__felt">
            <header class="c-tavern-gamble__header">
              <div class="c-tavern-gamble__meta">
                <span>${overlay.phase}</span>
                <span>底池 ${overlay.pot}</span>
                <span>当前注 ${overlay.currentBet}</span>
                ${overlay.sidePotLabels.map((label) => `<span>${label}</span>`).join("")}
              </div>
            </header>
            <div class="c-tavern-gamble__center c-tavern-gamble__center--short">
              <p>公共牌</p>
              <div class="c-tavern-gamble__tiles c-tavern-gamble__tiles--public">
                ${overlay.publicCards.map((card) => renderTile(card.label)).join("")}
              </div>
              ${
                overlay.pendingIncomingCard == null
                  ? ""
                  : `<p class="c-tavern-gamble__short-note">待入手 ${overlay.pendingIncomingCard.label}</p>`
              }
              ${
                overlay.visibleDiscard == null
                  ? ""
                  : `<p class="c-tavern-gamble__short-note">${overlay.visibleDiscard.seatName} 打出 ${overlay.visibleDiscard.label}</p>`
              }
            </div>
            <section class="c-tavern-gamble__log">
              ${overlay.logLines.map((line) => `<p>${line}</p>`).join("")}
            </section>
            <div class="c-tavern-gamble__actions c-tavern-gamble__actions--short-play${overlay.claimOptions.length === 0 ? "" : " has-claim-row"}">
              ${shortClaimCountdownMarkup}
              ${shortClaimRowMarkup}
              ${shortPrimaryActionRowMarkup}
            </div>
            <section class="c-tavern-gamble__hand-on-felt" aria-label="我的手牌">
              <p>我的手牌</p>
              <div class="c-tavern-gamble__tiles c-tavern-gamble__tiles--hand">
                ${overlay.handCards
                  .map((tile) =>
                    renderTileButton(
                      tile,
                      overlay.pendingIncomingCard == null ? "idle" : "discard"
                    )
                  )
                  .join("")}
              </div>
            </section>
          </section>
        </div>
        ${
          overlay.showdownRows.length === 0 && betweenHandActions == null
            ? ""
            : `<section class="c-tavern-gamble__showdown">
                ${overlay.showdownRows
                  .map(
                    (row) => `
                      <div class="${row.winner ? "is-winner" : ""}">
                        <header>
                          <strong>${row.playerName}</strong>
                          <span>${row.bestLabel}</span>
                          <span>${row.chipDelta >= 0 ? "+" : ""}${row.chipDelta} 筹码</span>
                        </header>
                        ${
                          row.winningPotLabels.length === 0
                            ? ""
                            : `<div class="c-tavern-gamble__showdown-detail">${row.winningPotLabels
                                .map((line) => `<span>${line}</span>`)
                                .join("")}</div>`
                        }
                      </div>
                    `
                  )
                  .join("")}
                ${shortSettlementActionsMarkup}
              </section>`
        }
      </div>
    </div>
  `;
}

function renderLongGambleTableOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "gamble-table"; variant: "long" }>
): string {
  const isWaitingSettlement = overlay.completedPlayedGroups;
  const isLong = overlay.variant === "long";
  const canBet = overlay.phase === "下注" && !isWaitingSettlement;
  const canDrawBet = overlay.phase === "摸后下注" && !isWaitingSettlement;
  const canMeld = overlay.phase === "碰杠" && !isWaitingSettlement;
  const canDiscard = overlay.phase === "摸打" && overlay.pendingDiscardsRemaining > 0 && !isWaitingSettlement;
  const canSelectPlay =
    overlay.phase === "摸打" && overlay.hasPendingDraw && overlay.pendingDiscardsRemaining === 0 && !isWaitingSettlement;
  const canDraw = overlay.phase === "摸打" && !overlay.hasPendingDraw && overlay.pendingDiscardsRemaining === 0 && !isWaitingSettlement;
  const selectedDiscardCount = canDiscard
    ? new Set(
        [...overlay.handTiles, ...overlay.publicTiles]
          .filter((tile) => tile.selected)
          .map((tile) => tile.id)
      ).size
    : 0;
  const canConfirmDiscard = canDiscard && selectedDiscardCount >= overlay.pendingDiscardsRemaining;
  const canPushHu = overlay.pendingHuChoice === true;
  const isNpcThinking = overlay.phase === "NPC思考";
  const isFinished = overlay.phase === "结算";
  const longPublicStage = overlay.longPublicStage ?? null;
  const renderPublicTileControl = (tile: (typeof overlay.publicTiles)[number]) =>
    renderPublicTileButton(tile, tile.actionId.startsWith("gamble-play-tile:") ? canDiscard || canSelectPlay : false);
  const publicTilesMarkup = overlay.publicTiles.map(renderPublicTileControl).join("");
  const privateBackTiles = (count: number) =>
    new Array(count).fill(0).map((_, index) => `<span class="c-tavern-gamble__tile c-tavern-gamble__tile--hand is-covered" data-private-back="${index}">盖牌</span>`).join("");

  return `
    <div class="c-grain-shop-overlay c-tavern-gamble-overlay${isLong ? " c-tavern-gamble-overlay--long" : ""}" data-house-overlay="gamble-table">
      <div class="c-grain-shop-modal c-grain-shop-skin-panel c-tavern-gamble" role="dialog" aria-modal="true">
        <div class="c-tavern-gamble__table">
          <aside class="c-tavern-gamble__sidebar" aria-label="玩家牌型">
            <h3>${overlay.title}</h3>
            ${overlay.playerRows
              .map(
                (player) => `
                  <div class="c-tavern-gamble__player${player.folded ? " is-folded" : ""}">
                    <div class="c-tavern-gamble__player-summary">
                      <strong>${player.name}</strong>
                      <span>${player.folded ? "已弃牌" : player.completedPlayedGroups ? "已出两组，等待结算" : `${player.bestPattern} / ${player.bestFan} 番`}</span>
                    </div>
                    <small>下注 ${player.committed} · 手牌 ${player.handCount} · 弃牌 ${player.discardCount}</small>
                    <small>${player.lastDiscard == null ? "尚未出牌" : `最近打出 ${player.lastDiscard}`}</small>
                    <small>剩余筹码 ${player.remainingChips}</small>
                    ${
                      player.discardLabels.length === 0
                        ? ""
                        : `<div class="c-tavern-gamble__discard-strip">${player.discardLabels.map(renderDiscardTile).join("")}</div>`
                    }
                    ${
                      player.playedGroupLabels.length === 0
                        ? ""
                        : `<div class="c-tavern-gamble__played-groups">${player.playedGroupLabels
                            .map((group) => `<span>${group}</span>`)
                            .join("")}</div>`
                    }
                  </div>
                `
              )
              .join("")}
          </aside>
          <section class="c-tavern-gamble__felt">
            <header class="c-tavern-gamble__header">
              <div class="c-tavern-gamble__meta">
                <span>${overlay.street}</span>
                <span>${overlay.phase}</span>
                <span>入场 ${overlay.wager}</span>
                <span>盲注 ${overlay.smallBlind}/${overlay.bigBlind}</span>
                <span>底池 ${overlay.pot}</span>
                <span>当前注 ${overlay.currentBet}</span>
                <span>牌墙 ${overlay.wallCount}</span>
              </div>
            </header>
            <div class="c-tavern-gamble__seats" aria-label="玩家弃牌">
              ${overlay.playerRows
                .map(
                  (player) => `
                    <div class="c-tavern-gamble__seat c-tavern-gamble__seat--${player.seatIndex}">
                      <strong>${player.name}</strong>
                      <div class="c-tavern-gamble__seat-discards">
                        ${player.discardLabels.map(renderDiscardTile).join("")}
                      </div>
                      ${
                        (player.privateBackCount ?? 0) > 0 || (player.publicTileLabels?.length ?? 0) > 0
                          ? `<div class="c-tavern-gamble__seat-discards">
                              ${privateBackTiles(player.privateBackCount ?? 0)}
                              ${(player.publicTileLabels ?? [])
                                .map((tile) => `<span class="c-tavern-gamble__tile c-tavern-gamble__tile--public">${tile}</span>`)
                                .join("")}
                            </div>`
                          : ""
                      }
                      <div class="c-tavern-gamble__seat-groups">
                        ${player.playedGroupLabels.map((group) => `<span>${group}</span>`).join("")}
                      </div>
                    </div>
                  `
                )
                .join("")}
            </div>
            <div class="c-tavern-gamble__center${isLong ? " c-tavern-gamble__center--long" : ""}">
              <p>公共牌</p>
              ${
                isLong
                  ? longPublicStage === "centered"
                    ? `<div class="c-tavern-gamble__tiles c-tavern-gamble__tiles--public c-tavern-gamble__tiles--long-window">
                        ${overlay.publicTiles.map((tile) => `<span class="c-tavern-gamble__tile c-tavern-gamble__tile--public">${tile.label}</span>`).join("")}
                      </div>`
                    : ""
                  : `<div class="c-tavern-gamble__tiles c-tavern-gamble__tiles--public">${publicTilesMarkup}</div>`
              }
              <div class="c-tavern-gamble__play-slot${isLong ? " is-hidden" : ""}">
                <strong>出牌槽</strong>
                <div class="c-tavern-gamble__tiles">
                  ${
                    overlay.playSlotTiles.length === 0
                      ? `<span class="c-tavern-gamble__slot-empty">选择 3 张顺/刻</span>`
                      : overlay.playSlotTiles.map(renderTile).join("")
                  }
                </div>
                <small>已打出自牌 ${overlay.playedOwnTileCount} 张</small>
              </div>
              <div class="c-tavern-gamble__notes">
                ${[...overlay.flowers, ...overlay.melds].map((line) => `<span>${line}</span>`).join("")}
              </div>
              ${
                canMeld
                  ? `<strong class="c-tavern-gamble__countdown">碰杠判定 ${overlay.meldCountdownTicks}s</strong>`
                  : ""
              }
            </div>
            <section class="c-tavern-gamble__log">
              ${overlay.logLines.map((line) => `<p>${line}</p>`).join("")}
            </section>
            <section class="c-tavern-gamble__hand-on-felt" aria-label="我的手牌">
              <p>我的手牌${isWaitingSettlement ? " · 已出两组，等待结算" : canPushHu ? " · 可推胡" : overlay.pendingDiscardsRemaining > 0 ? ` · 还需弃 ${overlay.pendingDiscardsRemaining} 张${selectedDiscardCount > 0 ? ` · 已选 ${selectedDiscardCount}` : ""}` : canSelectPlay ? " · 选择顺/刻" : ""}</p>
              <div
                class="c-tavern-gamble__tiles c-tavern-gamble__tiles--hand"
                data-house-drop-action-prefix="gamble-reorder:"
                data-house-drop-before="end"
              >
                ${overlay.handTiles
                  .map((tile) => renderTileButton(tile, canSelectPlay ? "select" : canDiscard ? "discard" : "idle"))
                  .join("")}
              </div>
            </section>
          </section>
        </div>
        ${
          overlay.showdownRows.length === 0
            ? ""
            : `<section class="c-tavern-gamble__showdown">
                ${overlay.showdownRows
                  .map(
                    (row) => `
                      <div class="${row.winner ? "is-winner" : ""}">
                        <header>
                          <strong>${row.playerName}</strong>
                          <span>${row.folded ? "已弃牌" : `${row.totalFan} 番`}</span>
                          <span>${row.best}</span>
                        </header>
                        ${
                          row.selectedTiles.length === 0
                            ? ""
                            : `<div class="c-tavern-gamble__showdown-tiles">${row.selectedTiles.map(renderTile).join("")}</div>`
                        }
                        <div class="c-tavern-gamble__showdown-detail">
                          ${row.detailLines.map((line) => `<span>${line}</span>`).join("")}
                        </div>
                      </div>
                    `
                  )
                  .join("")}
              </section>`
        }
        <div class="c-grain-shop-modal__actions c-tavern-gamble__actions">
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-house-action="${overlay.actionIds.check}" ${canBet || canDrawBet ? "" : "disabled"}>让牌</button>
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-house-action="${overlay.actionIds.call}" ${canBet || canDrawBet ? "" : "disabled"}>跟注</button>
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-house-action="${overlay.actionIds.raise}" ${canBet || canDrawBet ? "" : "disabled"}>加注</button>
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-house-action="${overlay.actionIds.fold}" ${canBet || canDrawBet ? "" : "disabled"}>弃牌</button>
          ${overlay.meldOptions
            .map(
              (option) =>
                `<button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper c-tavern-gamble__meld-action${option.flashing ? " is-flashing" : ""}" data-meld-kind="${option.kind}" data-house-action="${option.actionId}" ${canMeld ? "" : "disabled"}>${option.label}</button>`
            )
            .join("")}
          ${
            canMeld && overlay.meldOptions.length > 0
              ? `<button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-house-action="${overlay.actionIds.skipMeld}">不碰杠</button>`
              : ""
          }
          ${
            canPushHu && overlay.actionIds.pushHu != null && overlay.actionIds.passHu != null
              ? `<button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-house-action="${overlay.actionIds.pushHu}">推胡</button>
                 <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-house-action="${overlay.actionIds.passHu}">不推胡</button>`
              : ""
          }
          ${
            canDiscard && overlay.actionIds.confirmDiscard != null
              ? `<button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-house-action="${overlay.actionIds.confirmDiscard}" ${canConfirmDiscard ? "" : "disabled"}>打出</button>`
              : ""
          }
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-house-action="${overlay.actionIds.draw}" ${canDraw ? "" : "disabled"}>摸牌</button>
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-house-action="${overlay.actionIds.clearPlay}" ${canSelectPlay ? "" : "disabled"}>清空出牌槽</button>
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-house-action="${overlay.actionIds.confirmPlay}" ${canSelectPlay && overlay.canConfirmPlayGroup ? "" : "disabled"}>打出顺/刻</button>
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-house-action="${overlay.actionIds.passPlay}" ${canSelectPlay ? "" : "disabled"}>不再出组</button>
          ${isNpcThinking ? `<button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" disabled>NPC思考中</button>` : ""}
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-house-action="${overlay.actionIds.settle}" ${isFinished ? "" : "disabled"}>结算</button>
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-house-action="${overlay.actionIds.close}">关闭</button>
        </div>
      </div>
    </div>
  `;
}

function renderGambleTableOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "gamble-table" }>
): string {
  return overlay.variant === "short"
    ? renderShortGambleTableOverlay(overlay)
    : renderLongGambleTableOverlay(overlay);
}

function renderQteOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "qte-bar" }>
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="qte-bar">
      <div class="c-grain-shop-modal c-grain-shop-modal--game c-grain-shop-skin-panel c-temple-house-modal" role="dialog" aria-modal="true">
        <div class="c-temple-house-qte__header">
          <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
          <p class="c-temple-house-qte__task">${overlay.taskLabel}</p>
          <p class="c-temple-house-qte__meta">第 ${overlay.round} / ${overlay.totalRounds} 轮 · 已中 ${overlay.successes} 次</p>
        </div>
        <div class="c-grain-shop-modal__body">
          ${overlay.helperLines.map((line) => `<p>${line}</p>`).join("")}
          <div class="c-temple-house-qte__track" aria-hidden="true">
            <span
              class="c-temple-house-qte__target"
              style="left:${overlay.targetStartPercent}%; width:${overlay.targetWidthPercent}%;"
            ></span>
            <span
              class="c-temple-house-qte__marker"
              style="left:${overlay.markerPercent}%;"
            ></span>
          </div>
        </div>
        <div class="c-grain-shop-modal__actions">
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-house-action="${overlay.stopActionId}">
            停手
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderResultOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "result" }>
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="result">
      <div class="c-grain-shop-modal c-grain-shop-skin-panel c-temple-house-modal" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <div class="c-grain-shop-modal__body">
          <p class="c-temple-house-result__grade">评定：${overlay.grade}</p>
          <p class="c-temple-house-result__grade">命中：${overlay.score}</p>
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

  switch (overlay.type) {
    case "alert":
      return renderHouseAlertOverlay(overlay);
    case "confirm":
      return renderHouseConfirmOverlay(overlay);
    case "gamble-choice":
      return renderGambleChoiceOverlay(overlay);
    case "gamble":
      return renderGambleOverlay(overlay);
    case "gamble-table":
      return renderGambleTableOverlay(overlay);
    case "qte-bar":
      return renderQteOverlay(overlay);
    case "result":
      return renderResultOverlay(overlay);
    default:
      return "";
  }
}

export function renderTavernHouseView(viewModel: HouseModuleViewModel): string {
  const isIdle = viewModel.dialogue == null;

  return `
    <section class="view-house-grain-shop view-house-tavern" data-house-module="${viewModel.moduleId}">
      ${renderHouseActionContainer(viewModel)}
      ${renderHouseStandbyRoster(viewModel, {
        asideClassName: "c-grain-shop-npc-idle c-tea-house-npc-idle",
        asideLabel: "酒馆老板",
        includeSelectedState: true,
        renderSecondaryText: (actor) =>
          actor.title == null ? "" : `<span class="c-tea-house-npc-idle__title">${actor.title}</span>`,
      })}
      ${renderHouseDialogue(viewModel, {
        footerClassName: "c-grain-shop-dialogue c-tea-house-dialogue",
      })}
      ${isIdle ? renderHouseLeaveButton(viewModel) : ""}
      ${renderHouseStatusCard(viewModel)}
      ${renderOverlay(viewModel.overlay)}
    </section>
  `;
}
