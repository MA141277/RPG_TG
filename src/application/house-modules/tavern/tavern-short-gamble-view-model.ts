import type { TavernShortTableSession } from "../../../domain/house-modules/tavern-session";
import type { HouseOverlayViewModel } from "../../../domain/house-module";
import { getTavernShortCardLabel } from "../../../domain/tavern-short-gambling";

const SHORT_CHECK_ACTION_ID = "gamble-check";
const SHORT_CALL_ACTION_ID = "gamble-call";
const SHORT_RAISE_ACTION_ID = "gamble-raise";
const SHORT_FOLD_ACTION_ID = "gamble-fold";
const SHORT_DRAW_ACTION_ID = "gamble-draw";
const SHORT_CONFIRM_DISCARD_ACTION_ID = "gamble-confirm-discard";
const SHORT_CASH_OUT_ACTION_ID = "gamble-short-cash-out";
const SHORT_CONTINUE_ACTION_ID = "gamble-short-continue-hand";
const SHORT_REBUY_ACTION_ID = "gamble-short-rebuy";
const SHORT_CLAIM_ACTION_PREFIX = "gamble-meld:";
const SHORT_SKIP_CLAIM_ACTION_ID = "gamble-skip-meld";

function getShortAvailableActions(
  table: TavernShortTableSession
): Extract<
  HouseOverlayViewModel,
  { type: "gamble-table"; variant: "short" }
>["availableActions"] {
  if (table.prompt === "continue-or-cashout") {
    return ["continue", "cash-out"];
  }
  if (table.prompt === "rebuy-or-cashout") {
    return ["rebuy", "cash-out"];
  }

  const hand = table.currentHand ?? table.lastCompletedHand?.hand ?? null;
  if (hand == null) {
    return [];
  }

  if (hand.phase === "betting") {
    return ["check", "call", "raise", "fold"];
  }
  if (hand.phase === "draw-discard") {
    return hand.pendingIncomingCard == null ? ["draw"] : ["confirm-discard"];
  }
  return [];
}

function shouldHighlightShortAvailableActions(table: TavernShortTableSession): boolean {
  if (table.prompt != null) {
    return true;
  }

  const hand = table.currentHand ?? table.lastCompletedHand?.hand ?? null;
  if (hand == null) {
    return false;
  }
  if (
    hand.phase !== "betting" &&
    hand.phase !== "draw-discard" &&
    hand.phase !== "claim-window"
  ) {
    return false;
  }

  const actingPlayer =
    hand.players.find((player) => player.seatIndex === hand.actingSeatIndex) ?? null;
  return actingPlayer?.seatId === table.playerSeatId;
}

function getShortPhaseLabel(table: TavernShortTableSession): string {
  const hand = table.currentHand ?? table.lastCompletedHand?.hand ?? null;
  if (table.prompt != null || hand?.phase === "finished") {
    return "结算";
  }
  if (hand?.phase === "betting") {
    return "下注";
  }
  if (hand?.phase === "draw-discard") {
    return "摸打";
  }
  if (hand?.phase === "claim-window") {
    return "碰杠";
  }
  return "NPC思考";
}

function formatPotLabel(potId: string, amount: number): string {
  return `${potId === "main" ? "主池" : "边池"} ${amount}`;
}

function getShortMeldLabel(input: {
  kind: "chow" | "pong" | "kong";
  cards: Array<{ id: string; suit: "wan" | "bing" | "tong" | "tiao"; rank: number }>;
}): string {
  const prefix =
    input.kind === "chow" ? "吃" : input.kind === "pong" ? "碰" : "杠";
  return `${prefix} ${input.cards.map(getTavernShortCardLabel).join("")}`;
}

export function selectTavernShortGambleOverlay(
  table: TavernShortTableSession
): Extract<HouseOverlayViewModel, { type: "gamble-table"; variant: "short" }> {
  const hand = table.currentHand ?? table.lastCompletedHand?.hand ?? null;
  const human = hand?.players.find((player) => player.seatId === table.playerSeatId) ?? null;
  const isHumanClaimWindow = hand?.phase === "claim-window";
  const pendingIncomingCard =
    hand?.pendingIncomingCard?.ownerSeatId === table.playerSeatId
      ? {
          source: hand.pendingIncomingCard.source,
          label: getTavernShortCardLabel(hand.pendingIncomingCard.card),
        }
      : null;
  const visibleDiscard =
    hand?.lastVisibleDiscard == null
      ? null
      : {
          seatName:
            hand.players.find((player) => player.seatId === hand.lastVisibleDiscard?.seatId)
              ?.name ?? hand.lastVisibleDiscard.seatId,
          label: getTavernShortCardLabel(hand.lastVisibleDiscard.card),
        };
  const betweenHandActions =
    table.prompt == null
      ? undefined
      : table.prompt === "continue-or-cashout"
        ? {
            continueActionId: SHORT_CONTINUE_ACTION_ID,
            cashOutActionId: SHORT_CASH_OUT_ACTION_ID,
          }
        : {
            rebuyActionId: SHORT_REBUY_ACTION_ID,
            cashOutActionId: SHORT_CASH_OUT_ACTION_ID,
          };
  const potAmountById = new Map((hand?.pots ?? []).map((pot) => [pot.id, pot.amount]));
  const lockedDiscardCardIds = new Set(
    hand?.pendingIncomingCard?.ownerSeatId === table.playerSeatId &&
    hand.pendingIncomingCard.source === "claim"
      ? hand.pendingIncomingCard.lockedCardIds ?? []
      : []
  );
  const claimOptions =
    !isHumanClaimWindow
      ? []
      : hand?.claimChain?.options
      .filter((option) => option.seatId === table.playerSeatId)
      .map((option) => ({
        id: option.id,
        kind: option.kind,
        label: `${
          option.kind === "chow" ? "吃" : option.kind === "pong" ? "碰" : "杠"
        } ${getTavernShortCardLabel(hand.claimChain!.visibleDiscard)}`,
        actionId: `${SHORT_CLAIM_ACTION_PREFIX}${option.id}`,
        flashing: true,
      })) ?? [];
  const claimCountdown =
    table.claimCountdown == null
      ? null
      : {
          totalSeconds: table.claimCountdown.totalSeconds,
          remainingSeconds: table.claimCountdown.remainingSeconds,
          progressPercent: Math.max(
            0,
            Math.min(
              100,
              Math.round(
                (table.claimCountdown.remainingSeconds /
                  table.claimCountdown.totalSeconds) *
                  100
              )
            )
          ),
          label: `剩余 ${table.claimCountdown.remainingSeconds} 秒`,
        };

  return {
    type: "gamble-table",
    variant: "short",
    title: "酒馆短牌",
    phase: getShortPhaseLabel(table),
    pot: hand?.pots.reduce((sum, pot) => sum + pot.amount, 0) ?? 0,
    currentBet: hand?.currentBet ?? 0,
    chipLabel: "筹码",
    publicCards: (hand?.publicCards ?? []).map((card) => ({
      id: card.id,
      label: getTavernShortCardLabel(card),
    })),
    handCards: [
      ...(human?.hand ?? []),
      ...(pendingIncomingCard == null || hand?.pendingIncomingCard == null
        ? []
        : [hand.pendingIncomingCard.card]),
    ].map((card) => ({
      id: card.id,
      label: getTavernShortCardLabel(card),
      selected: hand?.selectedDiscardCardId === card.id,
      ...(pendingIncomingCard == null || lockedDiscardCardIds.has(card.id)
        ? {}
        : { actionId: `gamble-play-tile:${card.id}` }),
    })),
    sidePotLabels: (hand?.pots ?? []).map((pot) => formatPotLabel(pot.id, pot.amount)),
    pendingIncomingCard,
    visibleDiscard,
    claimOptions,
    claimCountdown,
    claimPassAction:
      claimOptions.length === 0
        ? null
        : {
            actionId: SHORT_SKIP_CLAIM_ACTION_ID,
            label: "跳过",
          },
    availableActions: getShortAvailableActions(table),
    highlightAvailableActions: shouldHighlightShortAvailableActions(table),
    playerRows: (hand?.players ?? []).map((player) => ({
      id: player.seatId,
      name: player.name,
      seatIndex: player.seatIndex,
      stack: player.stack,
      committed: player.committedThisHand,
      folded: player.folded,
      allIn: player.allIn,
      autoBetPending: player.autoBetPending,
      meldLabels: player.meldHistory.map(getShortMeldLabel),
      discardLabels: player.discardHistory.map(getTavernShortCardLabel),
    })),
    logLines: hand?.logLines.slice(-5) ?? [],
    showdownRows: (hand?.showdown ?? []).map((row) => ({
      playerName: row.playerName,
      bestLabel: row.bestFive.label,
      winningPotLabels: row.winningPotIds.map(
        (potId) => formatPotLabel(potId, potAmountById.get(potId) ?? 0)
      ),
      chipDelta: row.chipDelta,
      folded: row.folded,
      winner: row.winner,
    })),
    ...(betweenHandActions == null ? {} : { betweenHandActions }),
    actionIds: {
      check: SHORT_CHECK_ACTION_ID,
      call: SHORT_CALL_ACTION_ID,
      raise: SHORT_RAISE_ACTION_ID,
      fold: SHORT_FOLD_ACTION_ID,
      draw: SHORT_DRAW_ACTION_ID,
      confirmDiscard: SHORT_CONFIRM_DISCARD_ACTION_ID,
      close: SHORT_CASH_OUT_ACTION_ID,
    },
  };
}
