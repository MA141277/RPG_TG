import * as runtime from "./tavern-gambling-runtime";

export type TavernMahjongSuit = "wan" | "tiao" | "tong";
export type TavernMahjongHonor = "east" | "south" | "west" | "north" | "zhong" | "fa" | "bai";
export type TavernMahjongFlower =
  | "spring"
  | "summer"
  | "autumn"
  | "winter"
  | "plum"
  | "orchid"
  | "bamboo"
  | "chrysanthemum";

export type TavernMahjongTile =
  | { id: string; kind: "suited"; suit: TavernMahjongSuit; rank: number; copy: number }
  | { id: string; kind: "honor"; honor: TavernMahjongHonor; copy: number }
  | { id: string; kind: "flower"; flower: TavernMahjongFlower };
export type TavernGambleVariant = "short" | "long";
export type TavernGambleLimitMode = "no-limit" | "pot-limit" | "fixed-limit";
export type TavernGambleStreet = "pre-flop" | "flop" | "turn" | "river" | "showdown";
export type TavernGamblePhase =
  | "betting"
  | "meld-window"
  | "draw-discard"
  | "draw-bet"
  | "npc-thinking"
  | "showdown"
  | "finished";
export type TavernGambleActionKind = "check" | "call" | "raise" | "fold";
export type TavernGambleMeldKind = "chi" | "pong" | "public-kong" | "concealed-kong";
export type TavernGamblePlayedGroupKind = "sequence" | "triplet";
export type TavernGambleMeldWindowStage = "chi-pong-kong" | "pong-kong" | "kong";
export type TavernGamblePublicTileSlot = {
  id: string;
  tile: TavernMahjongTile;
  covered: boolean;
};

export type TavernGambleMeldWindow = {
  source: "public" | "draw" | "discard";
  stage: TavernGambleMeldWindowStage;
  discardTileId: string | null;
  resumeNpcAfterSeat: number | null;
};

export type TavernGambleMeld = {
  kind: TavernGambleMeldKind;
  tileKey: string;
  tileLabel: string;
  fan: number;
};

export type TavernGamblePlayedGroup = {
  id: string;
  kind: TavernGamblePlayedGroupKind;
  tileLabels: string[];
  ownTileCount: number;
  usesPublicTile: boolean;
  fan: number;
};

export type TavernGamblePlayer = {
  id: string;
  name: string;
  isHuman: boolean;
  seatIndex: number;
  hand: TavernMahjongTile[];
  flowers: TavernMahjongTile[];
  discarded: TavernMahjongTile[];
  exposedMelds: TavernGambleMeld[];
  playedGroups: TavernGamblePlayedGroup[];
  playedOwnTileCount: number;
  spentPublicTileIds: string[];
  publicTileSlots?: TavernGamblePublicTileSlot[];
  longTileOrder?: string[];
  folded: boolean;
  committed: number;
  skipsDraw: boolean;
};

export type TavernGambleScore = {
  totalFan: number;
  mainFan: number;
  mainPattern: string;
  selectedTiles: string[];
  purityRank: number;
  groupRank: number;
  pairRank: number;
  handContribution: number;
  flowerCount: number;
  kongCount: number;
  validHu: boolean;
  detailLines: string[];
};

export type TavernGambleShowdownResult = {
  playerId: string;
  playerName: string;
  bestScore: TavernGambleScore;
  totalFan: number;
  rankKey: number[];
  folded: boolean;
};

export type TavernGambleMeldOption = {
  id: string;
  kind: TavernGambleMeldKind;
  tileKey: string;
  tileLabel: string;
  fan: number;
  raiseAmount: number;
  claimTileIds?: string[];
};

export type TavernGambleSession = {
  id: string;
  variant: TavernGambleVariant;
  limitMode: TavernGambleLimitMode;
  street: TavernGambleStreet;
  phase: TavernGamblePhase;
  dealerSeat: number;
  smallBlindSeat: number;
  bigBlindSeat: number;
  actingSeat: number;
  currentBet: number;
  minRaise: number;
  pot: number;
  wager: number;
  wall: TavernMahjongTile[];
  deadWall: TavernMahjongTile[];
  publicTiles: TavernMahjongTile[];
  publicDiscards: TavernMahjongTile[];
  unclaimableDiscardTileIds?: string[];
  players: TavernGamblePlayer[];
  pendingDrawTile: TavernMahjongTile | null;
  pendingDiscardsRemaining: number;
  selectedPlayTileIds: string[];
  spentPublicTileIds: string[];
  pendingMelds: TavernGambleMeldOption[];
  meldWindow: TavernGambleMeldWindow | null;
  resolvedDiscardResponseTileIds: string[];
  meldCountdownTicks: number;
  npcThinkingSeat: number | null;
  npcThinkTicksRemaining: number;
  bettingRound: number;
  pendingHumanHu?: boolean;
  longPublicRevealTicks?: number;
  roundLog: string[];
  showdown: TavernGambleShowdownResult[] | null;
};

const mod = runtime as Record<string, any>;

export const TAVERN_GAMBLE_PLAYER_COUNT = mod.TAVERN_GAMBLE_PLAYER_COUNT as number;
export const TAVERN_GAMBLE_HAND_SIZE = mod.TAVERN_GAMBLE_HAND_SIZE as number;
export const TAVERN_GAMBLE_DRAW_DISCARD_COUNT = mod.TAVERN_GAMBLE_DRAW_DISCARD_COUNT as number;
export const TAVERN_GAMBLE_MELD_RESPONSE_SECONDS = mod.TAVERN_GAMBLE_MELD_RESPONSE_SECONDS as number;
export const TAVERN_GAMBLE_DISCARD_RESPONSE_SECONDS = mod.TAVERN_GAMBLE_DISCARD_RESPONSE_SECONDS as number;
export const TAVERN_GAMBLE_PUBLIC_TILE_COUNT = mod.TAVERN_GAMBLE_PUBLIC_TILE_COUNT as number;
export const TAVERN_GAMBLE_SHOWDOWN_SIZE = mod.TAVERN_GAMBLE_SHOWDOWN_SIZE as number;
export const TAVERN_LONG_GAMBLE_HAND_SIZE = mod.TAVERN_LONG_GAMBLE_HAND_SIZE as number;
export const TAVERN_LONG_GAMBLE_PUBLIC_TILE_COUNT = mod.TAVERN_LONG_GAMBLE_PUBLIC_TILE_COUNT as number;
export const TAVERN_LONG_GAMBLE_DRAW_DISCARD_COUNT = mod.TAVERN_LONG_GAMBLE_DRAW_DISCARD_COUNT as number;
export const TAVERN_LONG_GAMBLE_MELD_RESPONSE_SECONDS = mod.TAVERN_LONG_GAMBLE_MELD_RESPONSE_SECONDS as number;
export const TAVERN_GAMBLE_SMALL_BLIND = mod.TAVERN_GAMBLE_SMALL_BLIND as number;
export const TAVERN_GAMBLE_BIG_BLIND = mod.TAVERN_GAMBLE_BIG_BLIND as number;

export const createTavernMahjongDeck = mod.createTavernMahjongDeck as () => TavernMahjongTile[];
export const shuffleTavernMahjongDeck = mod.shuffleTavernMahjongDeck as (
  deck: TavernMahjongTile[],
  seed: number
) => TavernMahjongTile[];
export const getTavernMahjongTileLabel = mod.getTavernMahjongTileLabel as (tile: TavernMahjongTile) => string;
export const getTavernMahjongTileKey = mod.getTavernMahjongTileKey as (tile: TavernMahjongTile) => string;
export const getTavernGambleStreetLabel = mod.getTavernGambleStreetLabel as (street: TavernGambleStreet) => string;
export const getTavernGamblePhaseLabel = mod.getTavernGamblePhaseLabel as (phase: TavernGamblePhase) => string;
export const getMeldKindLabel = mod.getMeldKindLabel as (kind: TavernGambleMeldKind) => string;
export const getStreetLabel = mod.getStreetLabel as (street: TavernGambleStreet) => string;
export const createTavernGambleSession = mod.createTavernGambleSession as (input: {
  wager: number;
  seed: number;
  playerName: string;
  limitMode?: TavernGambleLimitMode;
}) => TavernGambleSession;
export const createTavernLongGambleSession = mod.createTavernLongGambleSession as (input: {
  wager: number;
  seed: number;
  playerName: string;
  limitMode?: TavernGambleLimitMode;
}) => TavernGambleSession;
export const resolveTavernGambleBettingAction = mod.resolveTavernGambleBettingAction as (
  session: TavernGambleSession,
  action: TavernGambleActionKind
) => TavernGambleSession;
export const skipTavernGambleMeld = mod.skipTavernGambleMeld as (session: TavernGambleSession) => TavernGambleSession;
export const declareTavernGambleMeld = mod.declareTavernGambleMeld as (
  session: TavernGambleSession,
  optionId: string
) => TavernGambleSession;
export const drawForTavernGamble = mod.drawForTavernGamble as (session: TavernGambleSession) => TavernGambleSession;
export const toggleTavernGamblePlayTile = mod.toggleTavernGamblePlayTile as (
  session: TavernGambleSession,
  tileId: string
) => TavernGambleSession;
export const confirmSelectedTavernGambleDiscards = mod.confirmSelectedTavernGambleDiscards as (
  session: TavernGambleSession
) => TavernGambleSession;
export const clearTavernGamblePlaySlot = mod.clearTavernGamblePlaySlot as (
  session: TavernGambleSession
) => TavernGambleSession;
export const passTavernGamblePlayGroups = mod.passTavernGamblePlayGroups as (
  session: TavernGambleSession
) => TavernGambleSession;
export const confirmTavernGamblePlayGroup = mod.confirmTavernGamblePlayGroup as (
  session: TavernGambleSession
) => TavernGambleSession;
export const discardForTavernGamble = mod.discardForTavernGamble as (
  session: TavernGambleSession,
  tileId: string
) => TavernGambleSession;
export const reorderTavernGambleHand = mod.reorderTavernGambleHand as (
  session: TavernGambleSession,
  fromTileId: string,
  toTileId: string | null
) => TavernGambleSession;
export const advanceTavernLongPublicReveal = mod.advanceTavernLongPublicReveal as (
  session: TavernGambleSession
) => TavernGambleSession;
export const advanceTavernGambleNpcThinking = mod.advanceTavernGambleNpcThinking as (
  session: TavernGambleSession
) => TavernGambleSession;
export const advanceTavernGambleMeldCountdown = mod.advanceTavernGambleMeldCountdown as (
  session: TavernGambleSession
) => TavernGambleSession;
export const resolveTavernGambleShowdown = mod.resolveTavernGambleShowdown as (
  session: TavernGambleSession
) => TavernGambleSession;
export const canHumanLongHu = mod.canHumanLongHu as (session: TavernGambleSession) => boolean;
export const pushHumanLongHu = mod.pushHumanLongHu as (session: TavernGambleSession) => TavernGambleSession;
export const passHumanLongHu = mod.passHumanLongHu as (session: TavernGambleSession) => TavernGambleSession;
export const getTavernGambleWinners = mod.getTavernGambleWinners as (
  session: TavernGambleSession
) => TavernGambleShowdownResult[];
export const scoreTavernGamblePlayer = mod.scoreTavernGamblePlayer as (
  player: TavernGamblePlayer,
  publicTiles: TavernMahjongTile[]
) => TavernGambleShowdownResult;
export const scoreTavernGambleSessionPlayer = mod.scoreTavernGambleSessionPlayer as (
  session: TavernGambleSession,
  player: TavernGamblePlayer
) => TavernGambleShowdownResult;
