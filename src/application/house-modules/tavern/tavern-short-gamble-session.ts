import type {
  TavernShortClaimCountdownState,
  TavernShortTableDebugPresetMode,
  TavernShortTableSession,
  TavernShortTableSessionPrompt,
} from "../../../domain/house-modules/tavern-session";
import {
  createTavernShortHand,
  passTavernShortClaim,
  type TavernShortDebugHandPreset,
  type TavernShortHandState,
} from "../../../domain/tavern-short-gambling";

const SHORT_TABLE_SEAT_IDS = ["you", "traveler", "broker", "guard"] as const;
const SHORT_TABLE_CHIPS_PER_GOLD = 10;
const SHORT_TABLE_REBUY_THRESHOLD = 200;
const SHORT_TABLE_CLAIM_COUNTDOWN_SECONDS = 10;

function getPlayerName(session: TavernShortTableSession): string {
  return (
    session.currentHand?.players.find((player) => player.seatId === session.playerSeatId)?.name ??
    session.lastCompletedHand?.hand.players.find(
      (player) => player.seatId === session.playerSeatId
    )?.name ??
    "Player"
  );
}

function toBankrollBySeatId(players: TavernShortHandState["players"]): Record<string, number> {
  return Object.fromEntries(players.map((player) => [player.seatId, player.stack]));
}

function getLiveBankrollBySeatId(session: TavernShortTableSession): Record<string, number> {
  return session.currentHand == null
    ? { ...session.bankrollBySeatId }
    : toBankrollBySeatId(session.currentHand.players);
}

function toOpeningStacks(bankrollBySeatId: Record<string, number>): [number, number, number, number] {
  return SHORT_TABLE_SEAT_IDS.map((seatId) => bankrollBySeatId[seatId] ?? 0) as [
    number,
    number,
    number,
    number,
  ];
}

function getBetweenHandPrompt(playerChips: number): TavernShortTableSessionPrompt {
  return playerChips < SHORT_TABLE_REBUY_THRESHOLD
    ? "rebuy-or-cashout"
    : "continue-or-cashout";
}

function normalizeNpcBankrolls(
  bankrollBySeatId: Record<string, number>,
  playerSeatId: string,
  npcBaselineChips: number
): Record<string, number> {
  const nextBankrollBySeatId = { ...bankrollBySeatId };
  for (const seatId of SHORT_TABLE_SEAT_IDS) {
    if (seatId === playerSeatId) {
      continue;
    }
    nextBankrollBySeatId[seatId] = Math.max(
      nextBankrollBySeatId[seatId] ?? 0,
      npcBaselineChips
    );
  }
  return nextBankrollBySeatId;
}

function getPlayerSeatIndex(session: TavernShortTableSession): number {
  const seatIndex = SHORT_TABLE_SEAT_IDS.indexOf(
    session.playerSeatId as (typeof SHORT_TABLE_SEAT_IDS)[number]
  );
  return seatIndex >= 0 ? seatIndex : 0;
}

function isUpstreamDiscarder(
  session: TavernShortTableSession,
  discarderSeatId: string
): boolean {
  const playerSeatIndex = getPlayerSeatIndex(session);
  const upstreamSeatId =
    SHORT_TABLE_SEAT_IDS[
      (playerSeatIndex - 1 + SHORT_TABLE_SEAT_IDS.length) % SHORT_TABLE_SEAT_IDS.length
    ];
  return discarderSeatId === upstreamSeatId;
}

function createShortClaimCountdown(): TavernShortClaimCountdownState {
  return {
    totalSeconds: SHORT_TABLE_CLAIM_COUNTDOWN_SECONDS,
    remainingSeconds: SHORT_TABLE_CLAIM_COUNTDOWN_SECONDS,
  };
}

function shouldUseClaimCountdown(
  session: TavernShortTableSession,
  hand: TavernShortHandState
): boolean {
  if (hand.phase !== "claim-window" || hand.claimChain == null) {
    return false;
  }
  const playerOptions = hand.claimChain.options.filter(
    (option) => option.seatId === session.playerSeatId
  );
  if (playerOptions.length === 0) {
    return false;
  }
  if (isUpstreamDiscarder(session, hand.claimChain.discarderSeatId)) {
    return false;
  }
  return playerOptions.some(
    (option) => option.kind === "pong" || option.kind === "kong"
  );
}

function getDebugHandPreset(
  session: TavernShortTableSession
): TavernShortDebugHandPreset | null {
  if (session.debugPresetMode !== "claim-cycle") {
    return null;
  }
  switch (session.handCount % 3) {
    case 0:
      return "claim-pong";
    case 1:
      return "claim-kong";
    default:
      return "claim-chow";
  }
}

function startShortTableHand(
  session: TavernShortTableSession,
  input: {
    seed: number;
    dealerSeatIndex: number;
    bankrollBySeatId: Record<string, number>;
    playerName?: string;
  }
): TavernShortTableSession {
  const currentHand = createTavernShortHand({
    seed: input.seed,
    dealerSeatIndex: input.dealerSeatIndex,
    playerName: input.playerName ?? getPlayerName(session),
    openingStacks: toOpeningStacks(input.bankrollBySeatId),
    debugPreset: getDebugHandPreset(session),
  });
  return {
    ...session,
    dealerSeatIndex: input.dealerSeatIndex,
    handCount: session.handCount + 1,
    claimCountdown: null,
    bankrollBySeatId: toBankrollBySeatId(currentHand.players),
    currentHand,
    lastCompletedHand: null,
    prompt: null,
  };
}

export function createTavernShortTableSession(input: {
  playerName: string;
  buyInGold: number;
  seed: number;
  debugPresetMode?: TavernShortTableDebugPresetMode;
}): TavernShortTableSession {
  const buyInGold = Math.max(1, Math.floor(input.buyInGold));
  const openingChips = buyInGold * SHORT_TABLE_CHIPS_PER_GOLD;
  const bankrollBySeatId = Object.fromEntries(
    SHORT_TABLE_SEAT_IDS.map((seatId) => [seatId, openingChips])
  );
  const session: TavernShortTableSession = {
    variant: "short",
    playerSeatId: "you",
    debugPresetMode: input.debugPresetMode ?? "off",
    claimCountdown: null,
    bankrollBySeatId,
    npcBaselineChips: openingChips,
    dealerSeatIndex: 0,
    handCount: 0,
    buyInGoldTotal: buyInGold,
    currentHand: null,
    lastCompletedHand: null,
    prompt: null,
    staminaCharged: true,
  };
  return startShortTableHand(session, {
    seed: input.seed,
    dealerSeatIndex: 0,
    bankrollBySeatId,
    playerName: input.playerName,
  });
}

export function updateTavernShortTableSession(
  session: TavernShortTableSession,
  hand: TavernShortHandState
): TavernShortTableSession {
  const bankrollBySeatId = toBankrollBySeatId(hand.players);
  if (hand.phase !== "finished") {
    return {
      ...session,
      claimCountdown: shouldUseClaimCountdown(session, hand)
        ? createShortClaimCountdown()
        : null,
      bankrollBySeatId,
      currentHand: hand,
      prompt: null,
    };
  }
  const playerChips = bankrollBySeatId[session.playerSeatId] ?? 0;
  return {
    ...session,
    claimCountdown: null,
    bankrollBySeatId,
    currentHand: null,
    lastCompletedHand: {
      handNumber: session.handCount,
      hand,
    },
    prompt: getBetweenHandPrompt(playerChips),
  };
}

export function continueTavernShortTableSession(
  session: TavernShortTableSession,
  seed: number
): TavernShortTableSession {
  if (session.currentHand != null) {
    return session;
  }
  const liveBankrollBySeatId = getLiveBankrollBySeatId(session);
  const playerChips = liveBankrollBySeatId[session.playerSeatId] ?? 0;
  if (playerChips < SHORT_TABLE_REBUY_THRESHOLD) {
    return {
      ...session,
      bankrollBySeatId: liveBankrollBySeatId,
      prompt: "rebuy-or-cashout",
    };
  }
  const bankrollBySeatId = normalizeNpcBankrolls(
    liveBankrollBySeatId,
    session.playerSeatId,
    session.npcBaselineChips
  );
  return startShortTableHand(session, {
    seed,
    dealerSeatIndex: (session.dealerSeatIndex + 1) % SHORT_TABLE_SEAT_IDS.length,
    bankrollBySeatId,
  });
}

export function tickTavernShortClaimCountdown(
  session: TavernShortTableSession
): TavernShortTableSession {
  if (session.claimCountdown == null || session.currentHand == null) {
    return session;
  }
  if (session.claimCountdown.remainingSeconds > 1) {
    return {
      ...session,
      claimCountdown: {
        ...session.claimCountdown,
        remainingSeconds: session.claimCountdown.remainingSeconds - 1,
      },
    };
  }
  return updateTavernShortTableSession(
    session,
    passTavernShortClaim(session.currentHand, session.playerSeatId)
  );
}

export function rebuyTavernShortTableSession(
  session: TavernShortTableSession,
  additionalGold: number,
  seed: number
): TavernShortTableSession {
  const rebuyGold = Math.max(1, Math.floor(additionalGold));
  const bankrollBySeatId = getLiveBankrollBySeatId(session);
  bankrollBySeatId[session.playerSeatId] =
    (bankrollBySeatId[session.playerSeatId] ?? 0) +
    rebuyGold * SHORT_TABLE_CHIPS_PER_GOLD;
  return continueTavernShortTableSession(
    {
      ...session,
      bankrollBySeatId,
      buyInGoldTotal: session.buyInGoldTotal + rebuyGold,
      prompt: null,
    },
    seed
  );
}

export function cashOutTavernShortTableSession(session: TavernShortTableSession): {
  goldDelta: number;
  leftoverChips: number;
} {
  const playerChips = getLiveBankrollBySeatId(session)[session.playerSeatId] ?? 0;
  return {
    goldDelta: Math.floor(playerChips / SHORT_TABLE_CHIPS_PER_GOLD),
    leftoverChips: playerChips % SHORT_TABLE_CHIPS_PER_GOLD,
  };
}
