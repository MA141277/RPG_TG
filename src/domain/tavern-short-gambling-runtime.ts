import {
  buildTavernShortPots,
  compareTavernShortBestFives,
  evaluateBestTavernShortShowdown,
  splitTavernShortPot,
} from "./tavern-short-gambling-evaluator";
import type {
  TavernShortBetActionKind,
  TavernShortCard,
  TavernShortClaimChainState,
  TavernShortClaimKind,
  TavernShortClaimOption,
  TavernShortClaimStage,
  TavernShortDebugHandPreset,
  TavernShortHandState,
  TavernShortPlayerState,
  TavernShortPot,
  TavernShortShowdownRow,
} from "./tavern-short-gambling";

export const TAVERN_SHORT_SMALL_BLIND = 100;
export const TAVERN_SHORT_BIG_BLIND = 200;

const SEAT_IDS = ["you", "traveler", "broker", "guard"] as const;
const NPC_NAMES = ["行脚客", "牙人", "护院"] as const;
type TavernShortSeatId = (typeof SEAT_IDS)[number];
type TavernShortDebugHandDefinition = {
  publicCardIds: [string, string];
  handCardIdsBySeatId: Record<
    TavernShortSeatId,
    [string, string, string, string, string]
  >;
};
const SHORT_SUIT_LABELS = {
  wan: "万",
  bing: "饼",
  tong: "筒",
  tiao: "条",
} as const;
const SHORT_SUIT_ORDER = {
  wan: 0,
  bing: 1,
  tong: 2,
  tiao: 3,
} as const;
const SEAT_NAME_FALLBACKS = {
  you: "你",
  traveler: "行脚客",
  broker: "牙人",
  guard: "护院",
} as const;
const DEBUG_HAND_PRESETS: Record<
  TavernShortDebugHandPreset,
  TavernShortDebugHandDefinition
> = {
  "claim-pong": {
    publicCardIds: ["bing-10", "tiao-10"],
    handCardIdsBySeatId: {
      you: ["bing-7", "tong-7", "wan-2", "bing-3", "tong-9"],
      traveler: ["wan-7", "tiao-2", "tiao-3", "tiao-8", "bing-11"],
      broker: ["wan-1", "wan-4", "bing-5", "tong-8", "tiao-12"],
      guard: ["wan-9", "bing-1", "tong-2", "tiao-5", "wan-13"],
    },
  },
  "claim-kong": {
    publicCardIds: ["tong-10", "tiao-10"],
    handCardIdsBySeatId: {
      you: ["wan-4", "bing-4", "tong-4", "wan-2", "bing-9"],
      traveler: ["wan-1", "bing-2", "tong-3", "tiao-5", "wan-7"],
      broker: ["tiao-4", "wan-6", "bing-8", "tong-11", "tiao-13"],
      guard: ["bing-1", "tong-2", "tiao-6", "wan-9", "bing-12"],
    },
  },
  "claim-chow": {
    publicCardIds: ["wan-4", "tiao-9"],
    handCardIdsBySeatId: {
      you: ["tong-4", "tong-5", "wan-2", "bing-9", "tiao-11"],
      traveler: ["wan-1", "bing-2", "tong-3", "tiao-7", "wan-9"],
      broker: ["bing-1", "tong-8", "tiao-3", "wan-10", "bing-13"],
      guard: ["tong-6", "wan-8", "bing-10", "tiao-12", "wan-13"],
    },
  },
};

function createDeck(seed: number): TavernShortCard[] {
  const deck: TavernShortCard[] = [];
  for (const suit of ["wan", "bing", "tong", "tiao"] as const) {
    for (let rank = 1; rank <= 13; rank += 1) {
      deck.push({ id: `${suit}-${rank}`, suit, rank });
    }
  }
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

function createCardFromId(id: string): TavernShortCard {
  const match = /^(wan|bing|tong|tiao)-(\d+)/u.exec(id);
  const suit = match?.[1];
  const rankText = match?.[2];
  if (suit !== "wan" && suit !== "bing" && suit !== "tong" && suit !== "tiao") {
    throw new Error(`Invalid tavern short suit in debug preset card "${id}".`);
  }
  const rank = Number.parseInt(rankText ?? "", 10);
  if (!Number.isInteger(rank) || rank < 1 || rank > 13) {
    throw new Error(`Invalid tavern short rank in debug preset card "${id}".`);
  }
  return { id, suit, rank };
}

function compareMeldCards(a: TavernShortCard, b: TavernShortCard): number {
  if (a.rank !== b.rank) {
    return a.rank - b.rank;
  }
  return SHORT_SUIT_ORDER[a.suit] - SHORT_SUIT_ORDER[b.suit];
}

function buildExposedMeldCards(
  player: TavernShortPlayerState,
  option: TavernShortClaimOption,
  visibleDiscard: TavernShortCard
): TavernShortCard[] {
  const consumedCards = option.consumeCardIds.map(
    (cardId) =>
      player.hand.find((card) => card.id === cardId) ?? createCardFromId(cardId)
  );
  return [visibleDiscard, ...consumedCards].sort(compareMeldCards);
}

function buildDebugPresetHandData(input: {
  playerName: string;
  openingStacks: [number, number, number, number];
  debugPreset: TavernShortDebugHandPreset;
}): {
  players: TavernShortPlayerState[];
  publicCards: TavernShortCard[];
  deck: TavernShortCard[];
} {
  const definition = DEBUG_HAND_PRESETS[input.debugPreset];
  const publicCards = definition.publicCardIds.map(createCardFromId);
  const players: TavernShortPlayerState[] = SEAT_IDS.map((seatId, index) => ({
    seatId,
    name: index === 0 ? input.playerName : NPC_NAMES[index - 1]!,
    isHuman: index === 0,
    seatIndex: index,
    hand: definition.handCardIdsBySeatId[seatId].map(createCardFromId),
    stack: input.openingStacks[index] ?? 0,
    committedThisRound: 0,
    committedThisHand: 0,
    folded: false,
    allIn: false,
    autoBetPending: false,
    discardHistory: [],
    meldHistory: [],
    lastAction: null,
  }));
  const usedCardIds = new Set([
    ...publicCards.map((card) => card.id),
    ...players.flatMap((player) => player.hand.map((card) => card.id)),
  ]);
  if (usedCardIds.size !== 22) {
    throw new Error(
      `Tavern short debug preset "${input.debugPreset}" must define 22 unique cards.`
    );
  }
  const deck = createDeck(1).filter((card) => !usedCardIds.has(card.id));
  return {
    players,
    publicCards,
    deck,
  };
}

function toRoundIndex(value: number): 0 | 1 | 2 | 3 {
  if (value <= 0) {
    return 0;
  }
  if (value === 1) {
    return 1;
  }
  if (value === 2) {
    return 2;
  }
  return 3;
}

function seatIdAt(index: number): string {
  return SEAT_IDS[((index % SEAT_IDS.length) + SEAT_IDS.length) % SEAT_IDS.length]!;
}

function seatIndexOf(seatId: string): number {
  const index = SEAT_IDS.indexOf(seatId as (typeof SEAT_IDS)[number]);
  return index >= 0 ? index : 0;
}

function getPlayersInOrder(players: readonly TavernShortPlayerState[], startIndex: number): TavernShortPlayerState[] {
  const ordered: TavernShortPlayerState[] = [];
  for (let offset = 0; offset < players.length; offset += 1) {
    ordered.push(players[(startIndex + offset) % players.length]!);
  }
  return ordered;
}

function replacePlayer(
  players: readonly TavernShortPlayerState[],
  nextPlayer: TavernShortPlayerState
): TavernShortPlayerState[] {
  return players.map((player) => (player.seatId === nextPlayer.seatId ? nextPlayer : player));
}

function appendLog(hand: TavernShortHandState, line: string): string[] {
  return [...hand.logLines, line].slice(-12);
}

function getBroadcastSeatName(hand: TavernShortHandState, seatId: string): string {
  if (seatId === "you") {
    return "你";
  }
  return (
    hand.players.find((player) => player.seatId === seatId)?.name ??
    SEAT_NAME_FALLBACKS[seatId as keyof typeof SEAT_NAME_FALLBACKS] ??
    seatId
  );
}

function getBroadcastCardLabel(card: TavernShortCard): string {
  return `${card.rank}${SHORT_SUIT_LABELS[card.suit]}`;
}

function getBroadcastClaimKindLabel(kind: TavernShortClaimKind): string {
  if (kind === "chow") {
    return "吃";
  }
  if (kind === "pong") {
    return "碰";
  }
  return "杠";
}

function getBroadcastBetActionLabel(action: string | null): string {
  if (action == null) {
    return "行动。";
  }
  if (action === "small-blind") {
    return `下小盲 ${TAVERN_SHORT_SMALL_BLIND}。`;
  }
  if (action === "big-blind") {
    return `下大盲 ${TAVERN_SHORT_BIG_BLIND}。`;
  }
  if (action === "fold") {
    return "弃牌。";
  }
  if (action === "call") {
    return "跟注。";
  }
  if (action === "call-all-in") {
    return "跟注并梭哈。";
  }
  if (action === "check") {
    return "过牌。";
  }
  if (action.startsWith("raise-")) {
    const raiseTo = Number.parseInt(action.slice("raise-".length), 10);
    return Number.isFinite(raiseTo) ? `加注到 ${raiseTo}。` : "加注。";
  }
  return "行动。";
}

function formatBroadcastBetActionLog(
  hand: TavernShortHandState,
  seatId: string,
  action: string | null
): string {
  return `${getBroadcastSeatName(hand, seatId)}${getBroadcastBetActionLabel(action)}`;
}

function formatBroadcastDrawLog(
  hand: TavernShortHandState,
  seatId: string,
  card: TavernShortCard
): string {
  return `${getBroadcastSeatName(hand, seatId)}摸入 ${getBroadcastCardLabel(card)}。`;
}

function formatBroadcastDiscardLog(
  hand: TavernShortHandState,
  seatId: string,
  card: TavernShortCard
): string {
  return `${getBroadcastSeatName(hand, seatId)}打出 ${getBroadcastCardLabel(card)}。`;
}

function formatBroadcastClaimWindowLog(
  hand: TavernShortHandState,
  seatId: string,
  card: TavernShortCard
): string {
  return `${getBroadcastSeatName(hand, seatId)}打出 ${getBroadcastCardLabel(card)}，进入抢牌窗口。`;
}

function formatBroadcastClaimResolutionLog(
  hand: TavernShortHandState,
  seatId: string,
  card: TavernShortCard,
  kind: TavernShortClaimKind
): string {
  return `${getBroadcastSeatName(hand, seatId)}抢得 ${getBroadcastCardLabel(card)}，并执行${getBroadcastClaimKindLabel(kind)}。`;
}

function rebuildPots(players: readonly TavernShortPlayerState[]): TavernShortPot[] {
  return buildTavernShortPots(
    players.map((player) => ({
      seatId: player.seatId,
      committed: player.committedThisHand,
      folded: player.folded,
    }))
  );
}

function getActiveSeatIds(players: readonly TavernShortPlayerState[]): string[] {
  return players.filter((player) => !player.folded).map((player) => player.seatId);
}

function getActionableBetSeatIds(
  players: readonly TavernShortPlayerState[],
  startIndex: number
): string[] {
  return getPlayersInOrder(players, startIndex)
    .filter((player) => !player.folded && !player.allIn)
    .map((player) => player.seatId);
}

function getDrawSeatIds(
  players: readonly TavernShortPlayerState[],
  startIndex: number
): string[] {
  return getPlayersInOrder(players, startIndex)
    .filter((player) => !player.folded)
    .map((player) => player.seatId);
}

function getNextPendingSeatId(pendingSeatIds: readonly string[], currentSeatId: string): string | null {
  if (pendingSeatIds.length === 0) {
    return null;
  }
  const currentIndex = pendingSeatIds.indexOf(currentSeatId);
  if (currentIndex < 0) {
    return pendingSeatIds[0] ?? null;
  }
  return pendingSeatIds[currentIndex + 1] ?? null;
}

function resetRoundCommitments(players: readonly TavernShortPlayerState[]): TavernShortPlayerState[] {
  return players.map((player) => ({
    ...player,
    committedThisRound: 0,
  }));
}

function getHighestPriorityStage(priority: number): TavernShortClaimStage {
  if (priority >= 3) {
    return "kong-pong-chow";
  }
  if (priority === 2) {
    return "pong-chow";
  }
  return "chow";
}

function normalizeClaimOptions(
  options: readonly TavernShortClaimOption[],
  discarderSeatId: string
): TavernShortClaimOption[] {
  if (options.length === 0) {
    return [];
  }
  const highestPriority = Math.max(...options.map((option) => option.priority));
  const topOptions = options.filter((option) => option.priority === highestPriority);
  const discarderSeatIndex = seatIndexOf(discarderSeatId);
  const nearestDistance = Math.min(
    ...topOptions.map((option) => {
      const optionSeatIndex = seatIndexOf(option.seatId);
      return (optionSeatIndex - discarderSeatIndex + SEAT_IDS.length) % SEAT_IDS.length;
    })
  );
  const winningSeatIds = new Set(
    topOptions
      .filter((option) => {
        const optionSeatIndex = seatIndexOf(option.seatId);
        return (
          (optionSeatIndex - discarderSeatIndex + SEAT_IDS.length) % SEAT_IDS.length ===
          nearestDistance
        );
      })
      .map((option) => option.seatId)
  );
  return topOptions.filter((option) => winningSeatIds.has(option.seatId));
}

function buildChowOptions(
  discardCard: TavernShortCard,
  player: TavernShortPlayerState
): TavernShortClaimOption[] {
  const options: TavernShortClaimOption[] = [];
  const sequences: Array<[number, number]> = [
    [discardCard.rank - 2, discardCard.rank - 1],
    [discardCard.rank - 1, discardCard.rank + 1],
    [discardCard.rank + 1, discardCard.rank + 2],
  ];
  for (const [leftRank, rightRank] of sequences) {
    if (leftRank < 1 || rightRank > 13) {
      continue;
    }
    const leftCard = player.hand.find(
      (card) => card.suit === discardCard.suit && card.rank === leftRank
    );
    const rightCard = player.hand.find(
      (card) => card.suit === discardCard.suit && card.rank === rightRank
    );
    if (leftCard == null || rightCard == null) {
      continue;
    }
    options.push({
      id: `chow:${player.seatId}:${discardCard.id}:${leftCard.id}:${rightCard.id}`,
      seatId: player.seatId,
      kind: "chow",
      discardCardId: discardCard.id,
      consumeCardIds: [leftCard.id, rightCard.id],
      priority: 1,
    });
  }
  return options;
}

function buildPongOrKongOption(
  discardCard: TavernShortCard,
  player: TavernShortPlayerState
): TavernShortClaimOption[] {
  const sameRankCards = player.hand.filter((card) => card.rank === discardCard.rank);
  if (sameRankCards.length >= 3) {
    return [
      {
        id: `kong:${player.seatId}:${discardCard.id}:${sameRankCards[0]!.id}:${sameRankCards[1]!.id}:${sameRankCards[2]!.id}`,
        seatId: player.seatId,
        kind: "kong",
        discardCardId: discardCard.id,
        consumeCardIds: [sameRankCards[0]!.id, sameRankCards[1]!.id, sameRankCards[2]!.id],
        priority: 3,
      },
    ];
  }
  if (sameRankCards.length >= 2) {
    return [
      {
        id: `pong:${player.seatId}:${discardCard.id}:${sameRankCards[0]!.id}:${sameRankCards[1]!.id}`,
        seatId: player.seatId,
        kind: "pong",
        discardCardId: discardCard.id,
        consumeCardIds: [sameRankCards[0]!.id, sameRankCards[1]!.id],
        priority: 2,
      },
    ];
  }
  return [];
}

function buildClaimOptions(
  hand: TavernShortHandState,
  discarderSeatId: string,
  discardCard: TavernShortCard
): TavernShortClaimOption[] {
  const discarderSeatIndex = seatIndexOf(discarderSeatId);
  const nextSeatId = seatIdAt(discarderSeatIndex + 1);
  const options = hand.players.flatMap((player) => {
    if (player.seatId === discarderSeatId || player.folded) {
      return [];
    }
    const pongOrKong = buildPongOrKongOption(discardCard, player);
    const chow =
      player.seatId === nextSeatId ? buildChowOptions(discardCard, player) : [];
    return [...pongOrKong, ...chow];
  });
  return normalizeClaimOptions(options, discarderSeatId);
}

function startBettingRound(
  hand: TavernShortHandState,
  nextBettingRoundIndex: 0 | 1 | 2 | 3
): TavernShortHandState {
  const players = resetRoundCommitments(hand.players);
  const pendingBetSeatIds = getActionableBetSeatIds(players, hand.dealerSeatIndex + 1);
  if (pendingBetSeatIds.length === 0) {
    if (nextBettingRoundIndex >= 3) {
      return {
        ...hand,
        players,
        bettingRoundIndex: nextBettingRoundIndex,
        phase: "showdown",
        currentBet: 0,
        pendingBetSeatIds: [],
        pendingIncomingCard: null,
        selectedDiscardCardId: null,
        claimChain: null,
        currentDrawTurnSeatId: null,
        logLines: appendLog(hand, "无人可继续下注，直接进入摊牌。"),
      };
    }
    return startDrawRound(
      {
        ...hand,
        players,
        bettingRoundIndex: nextBettingRoundIndex,
      },
      toRoundIndex(hand.drawRoundIndex + 1)
    );
  }
  return {
    ...hand,
    players,
    bettingRoundIndex: nextBettingRoundIndex,
    phase: "betting",
    actingSeatIndex: seatIndexOf(pendingBetSeatIds[0]!),
    currentBet: 0,
    lastFullRaise: TAVERN_SHORT_BIG_BLIND,
    pendingBetSeatIds,
    pendingIncomingCard: null,
    selectedDiscardCardId: null,
    claimChain: null,
    currentDrawTurnSeatId: null,
    logLines: appendLog(hand, `进入第 ${nextBettingRoundIndex + 1} 轮下注。`),
  };
}

function startDrawRound(
  hand: TavernShortHandState,
  nextDrawRoundIndex: 0 | 1 | 2 | 3
): TavernShortHandState {
  const players = resetRoundCommitments(hand.players);
  const pendingDrawSeatIds = getDrawSeatIds(players, hand.dealerSeatIndex + 1);
  return {
    ...hand,
    players,
    drawRoundIndex: nextDrawRoundIndex,
    phase: "draw-discard",
    actingSeatIndex: seatIndexOf(pendingDrawSeatIds[0] ?? seatIdAt(hand.dealerSeatIndex + 1)),
    currentBet: 0,
    pendingBetSeatIds: [],
    pendingDrawSeatIds,
    currentDrawTurnSeatId: pendingDrawSeatIds[0] ?? null,
    pendingIncomingCard: null,
    selectedDiscardCardId: null,
    claimChain: null,
    logLines: appendLog(hand, `进入第 ${nextDrawRoundIndex} 轮摸打。`),
  };
}

function completeResolvedDiscard(
  hand: TavernShortHandState,
  discarderSeatId: string,
  discardCard: TavernShortCard,
  originalResumeSeatId: string,
  turnOwnerSeatId: string
): TavernShortHandState {
  const pendingDrawSeatIds =
    hand.pendingDrawSeatIds.length === 0
      ? []
      : hand.pendingDrawSeatIds.filter((seatId) => seatId !== turnOwnerSeatId);
  const baseState: TavernShortHandState = {
    ...hand,
    pendingIncomingCard: null,
    selectedDiscardCardId: null,
    claimChain: null,
    lastVisibleDiscard: { seatId: discarderSeatId, card: discardCard },
  };

  if (hand.pendingDrawSeatIds.length === 0) {
    return {
      ...baseState,
      phase: "draw-discard",
      actingSeatIndex: seatIndexOf(originalResumeSeatId),
      logLines: appendLog(hand, formatBroadcastDiscardLog(hand, discarderSeatId, discardCard)),
    };
  }

  if (pendingDrawSeatIds.length === 0) {
    return startBettingRound(
      {
        ...baseState,
        pendingDrawSeatIds: [],
        currentDrawTurnSeatId: null,
        logLines: appendLog(hand, "本轮摸打结束，转入下一轮下注。"),
      },
      toRoundIndex(hand.bettingRoundIndex + 1)
    );
  }

  const nextSeatId = pendingDrawSeatIds.includes(originalResumeSeatId)
    ? originalResumeSeatId
    : pendingDrawSeatIds[0]!;
  return {
    ...baseState,
    phase: "draw-discard",
    actingSeatIndex: seatIndexOf(nextSeatId),
    pendingDrawSeatIds,
    currentDrawTurnSeatId: nextSeatId,
    logLines: appendLog(hand, formatBroadcastDiscardLog(hand, discarderSeatId, discardCard)),
  };
}

function commitChips(
  player: TavernShortPlayerState,
  amount: number
): TavernShortPlayerState {
  const commitAmount = Math.max(0, Math.min(amount, player.stack));
  return {
    ...player,
    stack: player.stack - commitAmount,
    committedThisRound: player.committedThisRound + commitAmount,
    committedThisHand: player.committedThisHand + commitAmount,
    allIn: player.stack - commitAmount <= 0,
  };
}

export function createTavernShortHand(input: {
  seed: number;
  dealerSeatIndex: number;
  playerName: string;
  openingStacks: [number, number, number, number];
  debugPreset?: TavernShortDebugHandPreset | null;
}): TavernShortHandState {
  const debugHandData =
    input.debugPreset == null
      ? null
      : buildDebugPresetHandData({
          playerName: input.playerName,
          openingStacks: input.openingStacks,
          debugPreset: input.debugPreset,
        });
  const shuffledDeck = debugHandData == null ? createDeck(input.seed) : null;
  const players =
    debugHandData?.players ??
    SEAT_IDS.map((seatId, index) => ({
      seatId,
      name: index === 0 ? input.playerName : NPC_NAMES[index - 1]!,
      isHuman: index === 0,
      seatIndex: index,
      hand: shuffledDeck!.slice(index * 5, index * 5 + 5),
      stack: input.openingStacks[index] ?? 0,
      committedThisRound: 0,
      committedThisHand: 0,
      folded: false,
      allIn: false,
      autoBetPending: false,
      discardHistory: [],
      meldHistory: [],
      lastAction: null,
    }));
  const publicCards =
    debugHandData?.publicCards ?? shuffledDeck!.slice(20, 22);
  const remainingDeck =
    debugHandData?.deck ?? shuffledDeck!.slice(22);
  const smallBlindSeatIndex = (input.dealerSeatIndex + 1) % SEAT_IDS.length;
  const bigBlindSeatIndex = (input.dealerSeatIndex + 2) % SEAT_IDS.length;
  let nextPlayers = players;
  nextPlayers = replacePlayer(
    nextPlayers,
    {
      ...commitChips(nextPlayers[smallBlindSeatIndex]!, TAVERN_SHORT_SMALL_BLIND),
      lastAction: "small-blind",
    }
  );
  nextPlayers = replacePlayer(
    nextPlayers,
    {
      ...commitChips(nextPlayers[bigBlindSeatIndex]!, TAVERN_SHORT_BIG_BLIND),
      lastAction: "big-blind",
    }
  );
  const pendingBetSeatIds = getActionableBetSeatIds(nextPlayers, bigBlindSeatIndex + 1);
  return {
    dealerSeatIndex: input.dealerSeatIndex,
    actingSeatIndex: pendingBetSeatIds.length > 0 ? seatIndexOf(pendingBetSeatIds[0]!) : 0,
    bettingRoundIndex: 0,
    drawRoundIndex: 0,
    phase: "betting",
    players: nextPlayers,
    publicCards,
    deck: remainingDeck,
    currentBet: Math.min(TAVERN_SHORT_BIG_BLIND, input.openingStacks[bigBlindSeatIndex] ?? TAVERN_SHORT_BIG_BLIND),
    lastFullRaise: TAVERN_SHORT_BIG_BLIND,
    pendingIncomingCard: null,
    selectedDiscardCardId: null,
    claimChain: null,
    pots: rebuildPots(nextPlayers),
    showdown: null,
    logLines: ["小盲 100 / 大盲 200 入池。", "每名牌手持有 5 张私牌，桌面公开 2 张牌。"],
    pendingBetSeatIds,
    pendingDrawSeatIds: [],
    currentDrawTurnSeatId: null,
    lastVisibleDiscard: null,
  };
}

export function resolveTavernShortBetAction(
  hand: TavernShortHandState,
  seatId: string,
  action: { kind: TavernShortBetActionKind; raiseTo?: number }
): TavernShortHandState {
  const player = hand.players.find((candidate) => candidate.seatId === seatId);
  if (player == null || player.folded) {
    return hand;
  }

  const owed = Math.max(0, hand.currentBet - player.committedThisRound);
  const previousCurrentBet = hand.currentBet;
  let nextPlayer = player;
  let nextCurrentBet = hand.currentBet;
  let nextLastFullRaise = hand.lastFullRaise;
  let nextPendingBetSeatIds = hand.pendingBetSeatIds.filter((pendingSeatId) => pendingSeatId !== seatId);

  if (action.kind === "fold") {
    nextPlayer = {
      ...player,
      folded: true,
      autoBetPending: false,
      lastAction: "fold",
    };
  } else if (action.kind === "raise" && !player.allIn) {
    const minimumRaiseTo = Math.max(
      hand.currentBet + Math.max(hand.lastFullRaise, TAVERN_SHORT_BIG_BLIND),
      action.raiseTo ?? 0
    );
    const maxRaiseTo = player.committedThisRound + player.stack;
    const actualRaiseTo = Math.min(maxRaiseTo, minimumRaiseTo);
    if (actualRaiseTo > hand.currentBet) {
      nextPlayer = commitChips(player, actualRaiseTo - player.committedThisRound);
      nextPlayer = {
        ...nextPlayer,
        autoBetPending: false,
        lastAction: `raise-${actualRaiseTo}`,
      };
      nextCurrentBet = actualRaiseTo;
      nextLastFullRaise = Math.max(hand.lastFullRaise, actualRaiseTo - previousCurrentBet);
      nextPendingBetSeatIds = getActionableBetSeatIds(hand.players, player.seatIndex + 1).filter(
        (pendingSeatId) => pendingSeatId !== seatId
      );
    } else {
      nextPlayer = commitChips(player, owed);
      nextPlayer = {
        ...nextPlayer,
        autoBetPending: false,
        lastAction: owed > 0 ? "call" : "check",
      };
    }
  } else {
    nextPlayer = commitChips(player, owed);
    nextPlayer = {
      ...nextPlayer,
      autoBetPending: false,
      lastAction:
        owed <= 0
          ? "check"
          : nextPlayer.allIn && nextPlayer.committedThisRound < hand.currentBet
            ? "call-all-in"
            : "call",
    };
  }

  const nextPlayers = replacePlayer(hand.players, nextPlayer);
  const activePlayers = nextPlayers.filter((candidate) => !candidate.folded);
  let nextHand: TavernShortHandState = {
    ...hand,
    players: nextPlayers,
    currentBet: nextCurrentBet,
    lastFullRaise: nextLastFullRaise,
    pendingBetSeatIds: nextPendingBetSeatIds.filter((pendingSeatId) => {
      const pendingPlayer = nextPlayers.find((candidate) => candidate.seatId === pendingSeatId);
      return pendingPlayer != null && !pendingPlayer.folded && !pendingPlayer.allIn;
    }),
    actingSeatIndex:
      nextPendingBetSeatIds.length > 0
        ? seatIndexOf(nextPendingBetSeatIds[0]!)
        : hand.actingSeatIndex,
    pots: rebuildPots(nextPlayers),
    logLines: appendLog(hand, formatBroadcastBetActionLog(hand, seatId, nextPlayer.lastAction)),
  };

  if (activePlayers.length <= 1) {
    return settleTavernShortShowdown({
      ...nextHand,
      phase: "showdown",
    });
  }

  if (nextHand.pendingBetSeatIds.length === 0) {
    if (nextHand.bettingRoundIndex >= 3) {
      return {
        ...nextHand,
        phase: "showdown",
        logLines: appendLog(nextHand, "下注结束，进入摊牌。"),
      };
    }
    return startDrawRound(nextHand, toRoundIndex(nextHand.drawRoundIndex + 1));
  }

  return nextHand;
}

export function drawTavernShortIncomingCard(
  hand: TavernShortHandState,
  seatId: string
): TavernShortHandState {
  if (hand.pendingIncomingCard != null || hand.deck.length === 0) {
    return hand;
  }
  const nextCard = hand.deck[0];
  if (nextCard == null) {
    return hand;
  }
  const nextPendingDrawSeatIds =
    hand.pendingDrawSeatIds.length > 0 ? hand.pendingDrawSeatIds : getDrawSeatIds(hand.players, seatIndexOf(seatId));
  return {
    ...hand,
    phase: "draw-discard",
    actingSeatIndex: seatIndexOf(seatId),
    deck: hand.deck.slice(1),
    pendingIncomingCard: {
      ownerSeatId: seatId,
      source: "draw",
      card: nextCard,
    },
    pendingDrawSeatIds: nextPendingDrawSeatIds,
    currentDrawTurnSeatId: hand.currentDrawTurnSeatId ?? seatId,
    selectedDiscardCardId: null,
    logLines: appendLog(hand, formatBroadcastDrawLog(hand, seatId, nextCard)),
  };
}

function getLockedClaimDiscardCardIds(
  hand: TavernShortHandState,
  seatId: string
): Set<string> {
  const incoming = hand.pendingIncomingCard;
  if (
    incoming == null ||
    incoming.ownerSeatId !== seatId ||
    incoming.source !== "claim"
  ) {
    return new Set();
  }
  return new Set(incoming.lockedCardIds ?? []);
}

function getSelectableDiscardCards(
  hand: TavernShortHandState,
  player: TavernShortPlayerState
): TavernShortCard[] {
  const incoming = hand.pendingIncomingCard;
  if (incoming == null || incoming.ownerSeatId !== player.seatId) {
    return [];
  }
  const lockedCardIds = getLockedClaimDiscardCardIds(hand, player.seatId);
  return [...player.hand, incoming.card].filter((card) => !lockedCardIds.has(card.id));
}

export function chooseTavernShortDiscardCandidate(
  hand: TavernShortHandState,
  seatId: string,
  cardId: string
): TavernShortHandState {
  const player = hand.players.find((candidate) => candidate.seatId === seatId);
  if (
    hand.phase !== "draw-discard" ||
    player == null ||
    hand.pendingIncomingCard?.ownerSeatId !== seatId
  ) {
    return hand;
  }
  const selectableCardIds = new Set(
    getSelectableDiscardCards(hand, player).map((card) => card.id)
  );
  if (!selectableCardIds.has(cardId)) {
    return hand;
  }
  return {
    ...hand,
    actingSeatIndex: seatIndexOf(seatId),
    selectedDiscardCardId: cardId,
  };
}

export function confirmTavernShortDiscard(
  hand: TavernShortHandState,
  seatId: string
): TavernShortHandState {
  const player = hand.players.find((candidate) => candidate.seatId === seatId);
  const incoming = hand.pendingIncomingCard;
  if (
    hand.phase !== "draw-discard" ||
    player == null ||
    incoming == null ||
    incoming.ownerSeatId !== seatId
  ) {
    return hand;
  }

  const selectableCards = getSelectableDiscardCards(hand, player);
  const selectedDiscardCardId = selectableCards.some(
    (card) => card.id === hand.selectedDiscardCardId
  )
    ? hand.selectedDiscardCardId
    : selectableCards[0]?.id;
  if (selectedDiscardCardId == null) {
    return hand;
  }

  const isDiscardingIncoming = selectedDiscardCardId === incoming.card.id;
  const discardedCard =
    isDiscardingIncoming
      ? incoming.card
      : player.hand.find((card) => card.id === selectedDiscardCardId) ?? incoming.card;
  const nextHandCards = isDiscardingIncoming
    ? player.hand
    : [...player.hand.filter((card) => card.id !== discardedCard.id), incoming.card];
  const nextPlayer: TavernShortPlayerState = {
    ...player,
    hand: nextHandCards,
    discardHistory: [...player.discardHistory, discardedCard],
    lastAction: incoming.source === "claim" ? "claim-discard" : "discard",
  };
  const nextPlayers = replacePlayer(hand.players, nextPlayer);
  const turnOwnerSeatId = hand.claimChain?.turnOwnerSeatId ?? hand.currentDrawTurnSeatId ?? seatId;
  const originalResumeSeatId =
    hand.claimChain?.originalResumeSeatId ??
    getNextPendingSeatId(
      hand.pendingDrawSeatIds.length > 0 ? hand.pendingDrawSeatIds : getDrawSeatIds(hand.players, player.seatIndex),
      turnOwnerSeatId
    ) ??
    turnOwnerSeatId;
  const interimHand: TavernShortHandState = {
    ...hand,
    players: nextPlayers,
    pendingIncomingCard: null,
    selectedDiscardCardId: null,
    pots: rebuildPots(nextPlayers),
  };
  const claimOptions = buildClaimOptions(interimHand, seatId, discardedCard);
  if (claimOptions.length > 0) {
    return {
      ...interimHand,
      phase: "claim-window",
      actingSeatIndex: seatIndexOf(claimOptions[0]!.seatId),
      claimChain: {
        discarderSeatId: seatId,
        visibleDiscard: discardedCard,
        originalResumeSeatId,
        turnOwnerSeatId,
        stage: getHighestPriorityStage(claimOptions[0]!.priority),
        chainDepth: hand.claimChain?.chainDepth ?? 0,
        passedSeatIds: [],
        options: claimOptions,
      },
      lastVisibleDiscard: { seatId, card: discardedCard },
      logLines: appendLog(hand, formatBroadcastClaimWindowLog(hand, seatId, discardedCard)),
    };
  }
  return completeResolvedDiscard(interimHand, seatId, discardedCard, originalResumeSeatId, turnOwnerSeatId);
}

export function passTavernShortClaim(
  hand: TavernShortHandState,
  seatId: string
): TavernShortHandState {
  const claimChain = hand.claimChain;
  if (hand.phase !== "claim-window" || claimChain == null) {
    return hand;
  }
  const remainingOptions = claimChain.options.filter((option) => option.seatId !== seatId);
  if (remainingOptions.length === 0) {
    return completeResolvedDiscard(
      hand,
      claimChain.discarderSeatId,
      claimChain.visibleDiscard,
      claimChain.originalResumeSeatId,
      claimChain.turnOwnerSeatId
    );
  }
  return {
    ...hand,
    actingSeatIndex: seatIndexOf(remainingOptions[0]!.seatId),
    claimChain: {
      ...claimChain,
      passedSeatIds: [...claimChain.passedSeatIds, seatId],
      options: remainingOptions,
    },
  };
}

export function claimTavernShortDiscard(
  hand: TavernShortHandState,
  optionId: string
): TavernShortHandState {
  const claimChain = hand.claimChain;
  if (hand.phase !== "claim-window" || claimChain == null) {
    return hand;
  }
  const normalizedOptions = normalizeClaimOptions(claimChain.options, claimChain.discarderSeatId);
  const option = normalizedOptions.find((candidate) => candidate.id === optionId);
  if (option == null) {
    return hand;
  }
  const lockedCardIds = [...new Set([claimChain.visibleDiscard.id, ...option.consumeCardIds])];

  let nextPlayers = hand.players.map((player) => {
    if (player.seatId !== option.seatId) {
      return player;
    }
    return {
      ...player,
      autoBetPending: true,
      meldHistory: [
        ...player.meldHistory,
        {
          kind: option.kind,
          cards: buildExposedMeldCards(player, option, claimChain.visibleDiscard),
        },
      ],
      lastAction: option.kind,
    };
  });

  if (option.kind === "kong") {
    nextPlayers = nextPlayers.map((player) => {
      if (player.folded || player.seatId === option.seatId) {
        return player;
      }
      const penalized = commitChips(player, TAVERN_SHORT_BIG_BLIND);
      return {
        ...penalized,
        lastAction: penalized.committedThisRound > player.committedThisRound ? "kong-penalty" : player.lastAction,
      };
    });
  }

  return {
    ...hand,
    players: nextPlayers,
    phase: "draw-discard",
    actingSeatIndex: seatIndexOf(option.seatId),
    pendingIncomingCard: {
      ownerSeatId: option.seatId,
      source: "claim",
      card: claimChain.visibleDiscard,
      lockedCardIds,
    },
    selectedDiscardCardId: null,
    claimChain: {
      ...claimChain,
      discarderSeatId: option.seatId,
      chainDepth: claimChain.chainDepth + 1,
      passedSeatIds: [],
      options: [option],
    },
    pots: rebuildPots(nextPlayers),
    logLines: appendLog(
      hand,
      formatBroadcastClaimResolutionLog(
        hand,
        option.seatId,
        claimChain.visibleDiscard,
        option.kind
      )
    ),
  };
}

export function advanceTavernShortNpcAction(hand: TavernShortHandState): TavernShortHandState {
  if (hand.phase === "showdown") {
    return settleTavernShortShowdown(hand);
  }

  if (hand.phase === "claim-window") {
    const option = hand.claimChain?.options[0];
    if (option == null || option.seatId === "you") {
      return hand;
    }
    return claimTavernShortDiscard(hand, option.id);
  }

  const actingSeatId = seatIdAt(hand.actingSeatIndex);
  const actingPlayer = hand.players.find((player) => player.seatId === actingSeatId);
  if (actingPlayer == null || actingPlayer.isHuman) {
    return hand;
  }

  if (hand.phase === "betting") {
    if (actingPlayer.stack <= 0 || actingPlayer.allIn) {
      return resolveTavernShortBetAction(hand, actingSeatId, { kind: "check" });
    }
    return resolveTavernShortBetAction(hand, actingSeatId, {
      kind: hand.currentBet > actingPlayer.committedThisRound ? "call" : "check",
    });
  }

  if (hand.phase === "draw-discard") {
    if (hand.pendingIncomingCard?.ownerSeatId !== actingSeatId) {
      return drawTavernShortIncomingCard(hand, actingSeatId);
    }
    const discardId = actingPlayer.hand[0]?.id ?? hand.pendingIncomingCard.card.id;
    const selected = chooseTavernShortDiscardCandidate(hand, actingSeatId, discardId);
    return confirmTavernShortDiscard(selected, actingSeatId);
  }

  return hand;
}

export function settleTavernShortShowdown(hand: TavernShortHandState): TavernShortHandState {
  const pots = rebuildPots(hand.players);
  const dealerNextSeatOrder = getPlayersInOrder(hand.players, hand.dealerSeatIndex + 1).map(
    (player) => player.seatId
  );
  const activePlayers = hand.players.filter((player) => !player.folded);
  const evaluated = hand.players.map((player) => ({
    player,
    bestFive: evaluateBestTavernShortShowdown([...player.hand, ...hand.publicCards]),
  }));
  const payouts = new Map<string, number>();
  const winningPotIds = new Map<string, string[]>();

  for (const pot of pots) {
    const contenders = evaluated.filter(
      (entry) => !entry.player.folded && pot.eligibleSeatIds.includes(entry.player.seatId)
    );
    if (contenders.length === 0) {
      continue;
    }
    const ordered = [...contenders].sort((left, right) =>
      compareTavernShortBestFives(right.bestFive, left.bestFive)
    );
    const top = ordered[0]!;
    const winnerSeatIds = ordered
      .filter(
        (entry) => compareTavernShortBestFives(entry.bestFive, top.bestFive) === 0
      )
      .map((entry) => entry.player.seatId);
    const split = splitTavernShortPot(pot, winnerSeatIds, dealerNextSeatOrder);
    for (const payout of split) {
      payouts.set(payout.seatId, (payouts.get(payout.seatId) ?? 0) + payout.amount);
      winningPotIds.set(payout.seatId, [...(winningPotIds.get(payout.seatId) ?? []), pot.id]);
    }
  }

  if (activePlayers.length === 1 && pots.length > 0) {
    const soleWinner = activePlayers[0]!;
    payouts.set(soleWinner.seatId, pots.reduce((sum, pot) => sum + pot.amount, 0));
    winningPotIds.set(soleWinner.seatId, pots.map((pot) => pot.id));
  }

  const settledPlayers = hand.players.map((player) => ({
    ...player,
    stack: player.stack + (payouts.get(player.seatId) ?? 0),
  }));

  const showdown: TavernShortShowdownRow[] = evaluated.map(({ player, bestFive }) => ({
    seatId: player.seatId,
    playerName: player.name,
    bestFive,
    winningPotIds: winningPotIds.get(player.seatId) ?? [],
    chipDelta: payouts.get(player.seatId) ?? 0,
    folded: player.folded,
    winner: (winningPotIds.get(player.seatId) ?? []).length > 0,
  }));

  return {
    ...hand,
    players: settledPlayers,
    phase: "finished",
    pots,
    showdown,
    pendingIncomingCard: null,
    selectedDiscardCardId: null,
    claimChain: null,
    pendingBetSeatIds: [],
    pendingDrawSeatIds: [],
    currentDrawTurnSeatId: null,
    logLines: appendLog(hand, "摊牌完成。"),
  };
}
