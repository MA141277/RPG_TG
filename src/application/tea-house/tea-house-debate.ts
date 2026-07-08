import type {
  TeaHouseDebateSummary,
  TeaHouseDebateWinner,
  TeaHouseTopicCard,
} from "../../domain/tea-house";
import { TEA_HOUSE_TOPIC_CARDS } from "../../domain/tea-house";
import { getTeaHouseContentDefaults } from "../house-modules/tea-house/tea-house-content-defaults";

type RandomSource = () => number;

export type TeaHouseDebateRoundState = {
  round: number;
  playerSpirit: number;
  npcSpirit: number;
  timeoutCount: number;
  consecutivePlayerWins: number;
};

export type TeaHouseDebateRoundResult = {
  nextState: TeaHouseDebateRoundState;
  winner: TeaHouseDebateWinner;
  playerTopic: TeaHouseTopicCard;
  npcTopic: TeaHouseTopicCard;
  lines: string[];
  didTimeout: boolean;
  isFinished: boolean;
  outcome: TeaHouseDebateSummary | null;
};

function getTotalWeight(weights: Record<TeaHouseTopicCard, number>): number {
  return TEA_HOUSE_TOPIC_CARDS.reduce(
    (sum, topic) => sum + weights[topic],
    0
  );
}

export function createInitialTeaHouseDebateState(): TeaHouseDebateRoundState {
  const { teaHouseInitialSpirit } = getTeaHouseContentDefaults();

  return {
    round: 1,
    playerSpirit: teaHouseInitialSpirit,
    npcSpirit: teaHouseInitialSpirit,
    timeoutCount: 0,
    consecutivePlayerWins: 0,
  };
}

export function pickTeaHouseAiTopic(
  personality: string,
  randomSource: RandomSource = Math.random
): TeaHouseTopicCard {
  const { teaHousePersonalityTopicWeights } = getTeaHouseContentDefaults();
  const defaultWeights = Object.values(teaHousePersonalityTopicWeights)[0];
  if (defaultWeights == null) {
    throw new Error("Missing default tea house debate weights.");
  }

  const weights: Record<TeaHouseTopicCard, number> =
    teaHousePersonalityTopicWeights[personality] ?? defaultWeights;
  const totalWeight = getTotalWeight(weights);
  let threshold = randomSource() * totalWeight;

  for (const topic of TEA_HOUSE_TOPIC_CARDS) {
    threshold -= weights[topic];
    if (threshold < 0) {
      return topic;
    }
  }

  return TEA_HOUSE_TOPIC_CARDS[0];
}

export function resolveTeaHouseDebateWinner(
  playerTopic: TeaHouseTopicCard,
  npcTopic: TeaHouseTopicCard
): TeaHouseDebateWinner {
  const { teaHouseTopicCounterMap } = getTeaHouseContentDefaults();

  if (playerTopic === npcTopic) {
    return "draw";
  }

  return teaHouseTopicCounterMap[playerTopic] === npcTopic ? "player" : "npc";
}

function createOutcome(
  roundState: TeaHouseDebateRoundState
): TeaHouseDebateSummary | null {
  if (roundState.playerSpirit > 0 && roundState.npcSpirit > 0) {
    return null;
  }

  const winner =
    roundState.playerSpirit <= 0 && roundState.npcSpirit <= 0
      ? "draw"
      : roundState.npcSpirit <= 0
        ? "player"
        : "npc";

  return {
    winner,
    rounds: roundState.round,
    playerSpiritRemaining: roundState.playerSpirit,
    npcSpiritRemaining: roundState.npcSpirit,
    timeoutCount: roundState.timeoutCount,
  };
}

export function resolveTeaHouseDebateRound(
  roundState: TeaHouseDebateRoundState,
  playerTopic: TeaHouseTopicCard,
  npcTopic: TeaHouseTopicCard,
  didTimeout: boolean
): TeaHouseDebateRoundResult {
  let playerSpirit = roundState.playerSpirit;
  let npcSpirit = roundState.npcSpirit;
  let consecutivePlayerWins = roundState.consecutivePlayerWins;
  const lines = [`Player used ${playerTopic}; opponent used ${npcTopic}.`];
  const winner = resolveTeaHouseDebateWinner(playerTopic, npcTopic);

  if (didTimeout) {
    playerSpirit -= 1;
    lines.push("Player timed out and loses 1 spirit.");
  }

  if (winner === "player") {
    npcSpirit -= 2;
    consecutivePlayerWins += 1;
    lines.push("Player wins the exchange and the opponent loses 2 spirit.");

    if (consecutivePlayerWins >= 2) {
      npcSpirit -= 1;
      lines.push("Player chains momentum and deals 1 bonus spirit damage.");
    }
  } else if (winner === "npc") {
    playerSpirit -= 2;
    consecutivePlayerWins = 0;
    lines.push("Opponent wins the exchange and the player loses 2 spirit.");
  } else {
    playerSpirit -= 1;
    npcSpirit -= 1;
    consecutivePlayerWins = 0;
    lines.push("The exchange is a draw and both sides lose 1 spirit.");
  }

  const nextState: TeaHouseDebateRoundState = {
    round: roundState.round + (playerSpirit > 0 && npcSpirit > 0 ? 1 : 0),
    playerSpirit,
    npcSpirit,
    timeoutCount: roundState.timeoutCount + (didTimeout ? 1 : 0),
    consecutivePlayerWins,
  };
  const outcome = createOutcome(nextState);

  return {
    nextState,
    winner,
    playerTopic,
    npcTopic,
    lines,
    didTimeout,
    isFinished: outcome != null,
    outcome,
  };
}

export function createDebateNextRoundTimer(): number {
  const { teaHouseTurnTimeLimitSec } = getTeaHouseContentDefaults();
  return teaHouseTurnTimeLimitSec;
}
