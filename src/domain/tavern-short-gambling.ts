import {
  buildTavernShortPots,
  compareTavernShortBestFives,
  evaluateBestTavernShortShowdown,
  splitTavernShortPot,
} from "./tavern-short-gambling-evaluator";
import {
  advanceTavernShortNpcAction,
  claimTavernShortDiscard,
  clearTavernShortDroppingDiscardCandidate,
  clearTavernShortLiftedDiscardCandidate,
  chooseTavernShortDiscardCandidate,
  confirmTavernShortDiscard,
  createTavernShortHand,
  drawTavernShortIncomingCard,
  passTavernShortClaim,
  resolveTavernShortBetAction,
  settleTavernShortShowdown,
  TAVERN_SHORT_BIG_BLIND,
  TAVERN_SHORT_SMALL_BLIND,
} from "./tavern-short-gambling-runtime";

export type TavernShortSuit = "wan" | "bing" | "tong" | "tiao";

export type TavernShortCard = {
  id: string;
  suit: TavernShortSuit;
  rank: number;
};

export type TavernShortBestFive = {
  category:
    | "high-card"
    | "one-pair"
    | "two-pair"
    | "three-of-a-kind"
    | "straight"
    | "flush"
    | "full-house"
    | "four-of-a-kind"
    | "straight-flush"
    | "royal-flush";
  label: string;
  scoreKey: number[];
  cards: TavernShortCard[];
};

export type TavernShortPot = {
  id: string;
  amount: number;
  eligibleSeatIds: string[];
};

export type TavernShortBetActionKind = "check" | "call" | "raise" | "fold";
export type TavernShortClaimKind = "chow" | "pong" | "kong";
export type TavernShortClaimStage = "kong-pong-chow" | "pong-chow" | "chow";
export type TavernShortDebugHandPreset =
  | "claim-pong"
  | "claim-kong"
  | "claim-chow";
export type TavernShortHandPhase =
  | "betting"
  | "draw-discard"
  | "claim-window"
  | "npc-thinking"
  | "showdown"
  | "finished";

export type TavernShortPendingIncomingCard = {
  ownerSeatId: string;
  source: "draw" | "claim";
  card: TavernShortCard;
  lockedCardIds?: string[];
};

export type TavernShortClaimOption = {
  id: string;
  seatId: string;
  kind: TavernShortClaimKind;
  discardCardId: string;
  consumeCardIds: string[];
  priority: number;
};

export type TavernShortExposedMeld = {
  kind: TavernShortClaimKind;
  cards: TavernShortCard[];
};

export type TavernShortPlayerState = {
  seatId: string;
  name: string;
  isHuman: boolean;
  seatIndex: number;
  hand: TavernShortCard[];
  stack: number;
  committedThisRound: number;
  committedThisHand: number;
  folded: boolean;
  allIn: boolean;
  autoBetPending: boolean;
  discardHistory: TavernShortCard[];
  meldHistory: TavernShortExposedMeld[];
  lastAction: string | null;
};

export type TavernShortClaimChainState = {
  discarderSeatId: string;
  visibleDiscard: TavernShortCard;
  originalResumeSeatId: string;
  turnOwnerSeatId: string;
  stage: TavernShortClaimStage;
  chainDepth: number;
  passedSeatIds: string[];
  options: TavernShortClaimOption[];
};

export type TavernShortShowdownRow = {
  seatId: string;
  playerName: string;
  bestFive: TavernShortBestFive;
  winningPotIds: string[];
  chipDelta: number;
  folded: boolean;
  winner: boolean;
};

export type TavernShortHandState = {
  dealerSeatIndex: number;
  actingSeatIndex: number;
  bettingRoundIndex: 0 | 1 | 2 | 3;
  drawRoundIndex: 0 | 1 | 2 | 3;
  phase: TavernShortHandPhase;
  players: TavernShortPlayerState[];
  publicCards: TavernShortCard[];
  deck: TavernShortCard[];
  currentBet: number;
  lastFullRaise: number;
  pendingIncomingCard: TavernShortPendingIncomingCard | null;
  selectedDiscardCardId: string | null;
  liftedDiscardCardId: string | null;
  droppingDiscardCardId: string | null;
  claimChain: TavernShortClaimChainState | null;
  pots: TavernShortPot[];
  showdown: TavernShortShowdownRow[] | null;
  logLines: string[];
  pendingBetSeatIds: string[];
  pendingDrawSeatIds: string[];
  currentDrawTurnSeatId: string | null;
  lastVisibleDiscard: { seatId: string; card: TavernShortCard } | null;
};

const SUITS: TavernShortSuit[] = ["wan", "bing", "tong", "tiao"];

const SUIT_LABELS: Record<TavernShortSuit, string> = {
  wan: "万",
  bing: "饼",
  tong: "筒",
  tiao: "条",
};

export function createTavernShortDeck(): TavernShortCard[] {
  return SUITS.flatMap((suit) =>
    Array.from({ length: 13 }, (_, index) => ({
      id: `${suit}-${index + 1}`,
      suit,
      rank: index + 1,
    }))
  );
}

export function shuffleTavernShortDeck(
  deck: readonly TavernShortCard[],
  seed: number
): TavernShortCard[] {
  const shuffled = [...deck];
  let cursor = seed <= 0 ? 1 : seed;
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    cursor = (cursor * 1664525 + 1013904223) >>> 0;
    const swapIndex = cursor % (index + 1);
    const current = shuffled[index];
    const swap = shuffled[swapIndex];
    if (current != null && swap != null) {
      shuffled[index] = swap;
      shuffled[swapIndex] = current;
    }
  }
  return shuffled;
}

export function getTavernShortCardLabel(card: TavernShortCard): string {
  return `${card.rank}${SUIT_LABELS[card.suit]}`;
}

export {
  advanceTavernShortNpcAction,
  buildTavernShortPots,
  claimTavernShortDiscard,
  clearTavernShortDroppingDiscardCandidate,
  clearTavernShortLiftedDiscardCandidate,
  chooseTavernShortDiscardCandidate,
  compareTavernShortBestFives,
  confirmTavernShortDiscard,
  createTavernShortHand,
  drawTavernShortIncomingCard,
  evaluateBestTavernShortShowdown,
  passTavernShortClaim,
  resolveTavernShortBetAction,
  settleTavernShortShowdown,
  splitTavernShortPot,
  TAVERN_SHORT_BIG_BLIND,
  TAVERN_SHORT_SMALL_BLIND,
};
