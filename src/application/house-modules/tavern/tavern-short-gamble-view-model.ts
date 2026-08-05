import type { TavernShortTableSession } from "../../../domain/house-modules/tavern-session";
import type { HouseOverlayViewModel } from "../../../domain/house-module";
import {
  getTavernShortCardLabel,
  type TavernShortCard,
} from "../../../domain/tavern-short-gambling";
import {
  getTavernShortClaimCountdownProgressPercent,
  getTavernShortClaimCountdownRemainingMs,
  getTavernShortClaimCountdownRemainingSeconds,
} from "./tavern-short-claim-countdown";
import { TavernShortNpcHiddenHandStackBuilder } from "./tavern-short-npc-hidden-hand-stack-builder";

const SHORT_CHECK_ACTION_ID = "gamble-check";
const SHORT_CALL_ACTION_ID = "gamble-call";
const SHORT_RAISE_ACTION_ID = "gamble-raise";
const SHORT_FOLD_ACTION_ID = "gamble-fold";
const SHORT_DRAW_ACTION_ID = "gamble-draw";
const SHORT_CONFIRM_DISCARD_ACTION_ID = "gamble-confirm-discard";
const SHORT_CLEAR_SELECTED_DISCARD_ACTION_ID = "gamble-clear-selected-discard";
const SHORT_CASH_OUT_ACTION_ID = "gamble-short-cash-out";
const SHORT_CONTINUE_ACTION_ID = "gamble-short-continue-hand";
const SHORT_REBUY_ACTION_ID = "gamble-short-rebuy";
const SHORT_CLAIM_ACTION_PREFIX = "gamble-meld:";
const SHORT_CLEAR_LIFTED_TILE_ACTION_PREFIX = "gamble-clear-lifted-tile:";
const SHORT_SKIP_CLAIM_ACTION_ID = "gamble-skip-meld";
const hiddenHandStackBuilder = new TavernShortNpcHiddenHandStackBuilder();

type TavernShortActiveHand = NonNullable<TavernShortTableSession["currentHand"]>;

function getShortLockedDiscardCardIds(
  hand: TavernShortActiveHand,
  playerSeatId: string
): Set<string> {
  const player = hand.players.find((candidate) => candidate.seatId === playerSeatId);
  const lockedCardIds = new Set(
    player?.meldHistory.flatMap((meld) => meld.cards.map((card) => card.id)) ?? []
  );
  if (
    hand.pendingIncomingCard?.ownerSeatId === playerSeatId &&
    hand.pendingIncomingCard.source === "claim"
  ) {
    for (const cardId of hand.pendingIncomingCard.lockedCardIds ?? []) {
      lockedCardIds.add(cardId);
    }
  }
  return lockedCardIds;
}

function getShortVisibleHandCards(
  hand: TavernShortActiveHand,
  playerSeatId: string
) {
  const player = hand.players.find((candidate) => candidate.seatId === playerSeatId);
  if (player == null) {
    return [];
  }
  const lockedCardIds = getShortLockedDiscardCardIds(hand, playerSeatId);
  return player.hand.filter((card) => !lockedCardIds.has(card.id));
}

function getShortSelectableDiscardCardIds(
  hand: TavernShortActiveHand,
  playerSeatId: string
): Set<string> {
  const player = hand.players.find((candidate) => candidate.seatId === playerSeatId);
  if (player == null || hand.pendingIncomingCard?.ownerSeatId !== playerSeatId) {
    return new Set();
  }
  const lockedCardIds = getShortLockedDiscardCardIds(hand, playerSeatId);
  return new Set(
    [...player.hand, hand.pendingIncomingCard.card]
      .filter((card) => !lockedCardIds.has(card.id))
      .map((card) => card.id)
  );
}

function getArmedShortDiscardCardId(
  hand: TavernShortActiveHand,
  playerSeatId: string
): string | null {
  const selectableDiscardCardIds = getShortSelectableDiscardCardIds(
    hand,
    playerSeatId
  );
  return hand.selectedDiscardCardId != null &&
    selectableDiscardCardIds.has(hand.selectedDiscardCardId)
    ? hand.selectedDiscardCardId
    : null;
}

function getLiftedShortDiscardCardId(
  hand: TavernShortActiveHand,
  playerSeatId: string
): string | null {
  const selectableDiscardCardIds = getShortSelectableDiscardCardIds(
    hand,
    playerSeatId
  );
  return hand.liftedDiscardCardId != null &&
    selectableDiscardCardIds.has(hand.liftedDiscardCardId)
    ? hand.liftedDiscardCardId
    : null;
}

function getDroppingShortDiscardCardId(
  hand: TavernShortActiveHand,
  playerSeatId: string
): string | null {
  const selectableDiscardCardIds = getShortSelectableDiscardCardIds(
    hand,
    playerSeatId
  );
  return hand.droppingDiscardCardId != null &&
    selectableDiscardCardIds.has(hand.droppingDiscardCardId)
    ? hand.droppingDiscardCardId
    : null;
}

function getShortBettingActions(
  hand: TavernShortActiveHand,
  playerSeatId: string
): Extract<
  HouseOverlayViewModel,
  { type: "gamble-table"; variant: "short" }
>["availableActions"] {
  const player = hand.players.find((candidate) => candidate.seatId === playerSeatId);
  if (player == null || player.folded || player.allIn) {
    return [];
  }
  const owed = Math.max(0, hand.currentBet - player.committedThisRound);
  return owed > 0 ? ["fold", "call", "raise"] : ["check", "raise"];
}

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
    return getShortBettingActions(hand, table.playerSeatId);
  }
  if (hand.phase === "draw-discard") {
    return getArmedShortDiscardCardId(hand, table.playerSeatId) == null
      ? []
      : ["confirm-discard"];
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
    return "\u7ed3\u7b97";
  }
  if (hand?.phase === "betting") {
    return "\u4e0b\u6ce8";
  }
  if (hand?.phase === "draw-discard") {
    return "\u51fa\u724c";
  }
  if (hand?.phase === "claim-window") {
    return "\u78b0\u6760";
  }
  return "NPC\u601d\u8003";
}

function formatPotLabel(potId: string, amount: number): string {
  return `${potId === "main" ? "\u4e3b\u6c60" : "\u8fb9\u6c60"} ${amount}`;
}

function getShortMeldLabel(input: {
  kind: "chow" | "pong" | "kong";
  cards: TavernShortCard[];
}): string {
  const prefix =
    input.kind === "chow"
      ? "\u5403"
      : input.kind === "pong"
        ? "\u78b0"
        : "\u6760";
  return `${prefix} ${input.cards.map(getTavernShortCardLabel).join("")}`;
}

function getShortTablePosition(
  seatIndex: number
): "bottom" | "left" | "top" | "right" {
  if (seatIndex === 1) {
    return "left";
  }
  if (seatIndex === 2) {
    return "top";
  }
  if (seatIndex === 3) {
    return "right";
  }
  return "bottom";
}

function getShortSeatStatusLabel(input: {
  committed: number;
  folded: boolean;
  allIn: boolean;
  autoBetPending: boolean;
}): string {
  if (input.folded) {
    return "\u5df2\u5f03\u724c";
  }
  if (input.allIn) {
    return "All-in";
  }
  if (input.autoBetPending) {
    return "\u81ea\u52a8\u4e0b\u6ce8";
  }
  return `\u5df2\u6295 ${input.committed}`;
}

export function selectTavernShortGambleOverlay(
  table: TavernShortTableSession
): Extract<HouseOverlayViewModel, { type: "gamble-table"; variant: "short" }> {
  const nowMs = Date.now();
  const hand = table.currentHand ?? table.lastCompletedHand?.hand ?? null;
  const handSortEnabled =
    table.currentHand != null &&
    table.currentHand.phase !== "draw-discard" &&
    table.currentHand.phase !== "finished";
  const isHumanClaimWindow = hand?.phase === "claim-window";
  const humanPendingIncoming =
    hand?.pendingIncomingCard?.ownerSeatId === table.playerSeatId
      ? hand.pendingIncomingCard
      : null;
  const visibleHandCards =
    hand == null ? [] : getShortVisibleHandCards(hand, table.playerSeatId);
  const pendingIncomingCard =
    humanPendingIncoming == null
      ? null
      : {
          source: humanPendingIncoming.source,
          label: getTavernShortCardLabel(humanPendingIncoming.card),
        };
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
  const selectableDiscardCardIds =
    hand == null
      ? new Set<string>()
      : getShortSelectableDiscardCardIds(hand, table.playerSeatId);
  const armedDiscardCardId =
    hand == null ? null : getArmedShortDiscardCardId(hand, table.playerSeatId);
  const liftedDiscardCardId =
    hand == null ? null : getLiftedShortDiscardCardId(hand, table.playerSeatId);
  const droppingDiscardCardId =
    hand == null ? null : getDroppingShortDiscardCardId(hand, table.playerSeatId);
  const claimOptions =
    !isHumanClaimWindow
      ? []
      : hand?.claimChain?.options
          .filter((option) => option.seatId === table.playerSeatId)
          .map((option) => ({
            id: option.id,
            kind: option.kind,
            label: `${
              option.kind === "chow"
                ? "\u5403"
                : option.kind === "pong"
                  ? "\u78b0"
                  : "\u6760"
            } ${getTavernShortCardLabel(hand.claimChain!.visibleDiscard)}`,
            actionId: `${SHORT_CLAIM_ACTION_PREFIX}${option.id}`,
            flashing: true,
          })) ?? [];
  const claimCountdown =
    table.claimCountdown == null
      ? null
      : (() => {
          const remainingMs = getTavernShortClaimCountdownRemainingMs(
            table.claimCountdown,
            nowMs
          );
          const remainingSeconds = getTavernShortClaimCountdownRemainingSeconds(
            table.claimCountdown,
            nowMs
          );
          return {
            totalSeconds: table.claimCountdown.totalSeconds,
            remainingSeconds,
            remainingMs,
            progressPercent: getTavernShortClaimCountdownProgressPercent(
              table.claimCountdown,
              nowMs
            ),
            label: `\u5269\u4f59 ${remainingSeconds} \u79d2`,
          };
        })();

  return {
    type: "gamble-table",
    variant: "short",
    title: "\u9152\u9986\u77ed\u724c",
    ...(armedDiscardCardId == null
      ? {}
      : { clickawayActionId: SHORT_CLEAR_SELECTED_DISCARD_ACTION_ID }),
    phase: getShortPhaseLabel(table),
    pot: hand?.pots.reduce((sum, pot) => sum + pot.amount, 0) ?? 0,
    currentBet: hand?.currentBet ?? 0,
    chipLabel: "\u7b79\u7801",
    publicCards: (hand?.publicCards ?? []).map((card) => ({
      id: card.id,
      label: getTavernShortCardLabel(card),
    })),
    handSortEnabled,
    handCards: [
      ...visibleHandCards,
      ...(humanPendingIncoming?.source === "draw" ? [humanPendingIncoming.card] : []),
    ].map((card) => ({
      id: card.id,
      label: getTavernShortCardLabel(card),
      selected: armedDiscardCardId === card.id,
      lifted: liftedDiscardCardId === card.id,
      dropping: droppingDiscardCardId === card.id,
      incoming: humanPendingIncoming?.card.id === card.id,
      ...(liftedDiscardCardId === card.id &&
      droppingDiscardCardId == null &&
      armedDiscardCardId !== card.id
        ? {
            mouseleaveActionId: `${SHORT_CLEAR_LIFTED_TILE_ACTION_PREFIX}${card.id}`,
          }
        : {}),
      ...(droppingDiscardCardId != null ||
      selectableDiscardCardIds.size === 0 ||
      !selectableDiscardCardIds.has(card.id)
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
            label: "\u8df3\u8fc7",
          },
    availableActions: getShortAvailableActions(table),
    highlightAvailableActions: shouldHighlightShortAvailableActions(table),
    playerRows: (hand?.players ?? []).map((player) => ({
      id: player.seatId,
      name: player.name,
      seatIndex: player.seatIndex,
      tablePosition: getShortTablePosition(player.seatIndex),
      hiddenHandTiles:
        hand == null
          ? []
          : hiddenHandStackBuilder.buildForSeat({
              hand,
              player,
              viewerSeatId: table.playerSeatId,
            }),
      stack: player.stack,
      committed: player.committedThisHand,
      folded: player.folded,
      allIn: player.allIn,
      autoBetPending: player.autoBetPending,
      statusLabel: getShortSeatStatusLabel({
        committed: player.committedThisHand,
        folded: player.folded,
        allIn: player.allIn,
        autoBetPending: player.autoBetPending,
      }),
      meldGroups: player.meldHistory.map((meld) => ({
        kind: meld.kind,
        cards: meld.cards.map((card) => ({
          id: card.id,
          label: getTavernShortCardLabel(card),
        })),
      })),
      discardTiles: player.discardHistory.map((card) => ({
        id: card.id,
        label: getTavernShortCardLabel(card),
      })),
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
