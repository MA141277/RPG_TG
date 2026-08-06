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
  clearTavernShortSelectedDiscardCandidate,
  chooseTavernShortDiscardCandidate,
  confirmTavernShortDiscard,
  createTavernShortHand,
  drawTavernShortIncomingCard,
  passTavernShortClaim,
  reorderTavernShortDisplayOrderEntries,
  reorderTavernShortHand,
  resolveTavernShortBetAction,
  settleTavernShortShowdown,
  syncTavernShortDisplayOrderEntries,
  TAVERN_SHORT_BIG_BLIND,
  TAVERN_SHORT_SMALL_BLIND,
  toTavernShortDisplayOrderEntryId,
} from "./tavern-short-gambling-runtime";
export {
  createTavernShortDeck,
  getTavernShortCardKey,
  getTavernShortCardLabel,
  getTavernShortCardSortValue,
  isTavernShortSuitedCard,
  parseTavernShortCardId,
  shuffleTavernShortDeck,
  type TavernShortCard,
  type TavernShortHonor,
  type TavernShortSuit,
} from "./tavern-short-gambling-tiles";
import type { TavernShortCard } from "./tavern-short-gambling-tiles";

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
    | "straight-flush";
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
  | "claim-chow"
  | "claim-chow-then-kong";
export type TavernShortDisplayOrderEntryKind =
  | "hand"
  | "incoming-draw"
  | "public-ghost";
export type TavernShortDisplayOrderEntry = {
  kind: TavernShortDisplayOrderEntryKind;
  cardId: string;
};
export type TavernShortDisplayOrderEntryId =
  `${TavernShortDisplayOrderEntryKind}|${string}`;
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
  displayOrderEntries: TavernShortDisplayOrderEntry[];
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

export {
  advanceTavernShortNpcAction,
  buildTavernShortPots,
  claimTavernShortDiscard,
  clearTavernShortDroppingDiscardCandidate,
  clearTavernShortLiftedDiscardCandidate,
  clearTavernShortSelectedDiscardCandidate,
  chooseTavernShortDiscardCandidate,
  compareTavernShortBestFives,
  confirmTavernShortDiscard,
  createTavernShortHand,
  drawTavernShortIncomingCard,
  evaluateBestTavernShortShowdown,
  passTavernShortClaim,
  reorderTavernShortDisplayOrderEntries,
  reorderTavernShortHand,
  resolveTavernShortBetAction,
  settleTavernShortShowdown,
  syncTavernShortDisplayOrderEntries,
  splitTavernShortPot,
  TAVERN_SHORT_BIG_BLIND,
  TAVERN_SHORT_SMALL_BLIND,
  toTavernShortDisplayOrderEntryId,
};
