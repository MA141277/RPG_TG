import {
  teaHouseDebateHandSize,
  teaHouseInitialSpirit,
  teaHouseNpcHintAccuracy,
  teaHouseProudRepeatChance,
  teaHousePersonalityTopicWeights,
  teaHouseTopicCounterMap,
  teaHouseTurnTimeLimitSec,
} from "../../content/houses/tea-house-content";
import type {
  TeaHouseDebateEmotion,
  TeaHouseDebateSummary,
  TeaHouseDebateWinner,
  TeaHouseTopicCard,
} from "../../domain/tea-house";
import { TEA_HOUSE_TOPIC_CARDS } from "../../domain/tea-house";

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

export type TeaHouseAiTopicPick = {
  handIndex: number;
  topic: TeaHouseTopicCard;
};

function randomIndex(length: number, randomSource: RandomSource): number {
  return Math.floor(randomSource() * length);
}

function pickRandomTopic(
  topics: readonly TeaHouseTopicCard[],
  randomSource: RandomSource
): TeaHouseTopicCard {
  return topics[randomIndex(topics.length, randomSource)]!;
}

function getWeightedHandIndex(
  hand: readonly TeaHouseTopicCard[],
  personality: string,
  randomSource: RandomSource
): number {
  const defaultWeights = teaHousePersonalityTopicWeights["圆滑"];
  if (defaultWeights == null) {
    throw new Error("Missing default tea house debate weights.");
  }

  const weights: Record<TeaHouseTopicCard, number> =
    teaHousePersonalityTopicWeights[personality] ?? defaultWeights;
  const totalWeight = hand.reduce((sum, topic) => sum + weights[topic], 0);
  let threshold = randomSource() * totalWeight;

  for (let index = 0; index < hand.length; index += 1) {
    threshold -= weights[hand[index]!]!;
    if (threshold < 0) {
      return index;
    }
  }

  return hand.length - 1;
}

export function createInitialTeaHouseDebateState(): TeaHouseDebateRoundState {
  return {
    round: 1,
    playerSpirit: teaHouseInitialSpirit,
    npcSpirit: teaHouseInitialSpirit,
    timeoutCount: 0,
    consecutivePlayerWins: 0,
  };
}

export function drawTeaHouseTopicCard(
  randomSource: RandomSource = Math.random
): TeaHouseTopicCard {
  return TEA_HOUSE_TOPIC_CARDS[randomIndex(TEA_HOUSE_TOPIC_CARDS.length, randomSource)]!;
}

export function createTeaHouseDebateHand(
  handSize = teaHouseDebateHandSize,
  randomSource: RandomSource = Math.random
): TeaHouseTopicCard[] {
  return Array.from({ length: handSize }, () => drawTeaHouseTopicCard(randomSource));
}

export function removeTeaHouseHandCard(
  hand: readonly TeaHouseTopicCard[],
  handIndex: number
): TeaHouseTopicCard[] {
  return hand.filter((_, index) => index !== handIndex);
}

export function refillTeaHouseDebateHand(
  hand: readonly TeaHouseTopicCard[],
  handSize = teaHouseDebateHandSize,
  randomSource: RandomSource = Math.random
): TeaHouseTopicCard[] {
  const nextHand = [...hand];
  while (nextHand.length < handSize) {
    nextHand.push(drawTeaHouseTopicCard(randomSource));
  }

  return nextHand;
}

export function pickTeaHouseRandomHandIndex(
  hand: readonly TeaHouseTopicCard[],
  randomSource: RandomSource = Math.random
): number {
  if (hand.length === 0) {
    return -1;
  }

  return randomIndex(hand.length, randomSource);
}

export function getTeaHouseDebateEmotion(
  lastRoundWinner: TeaHouseDebateWinner | null
): TeaHouseDebateEmotion {
  if (lastRoundWinner === "npc") {
    return "得意";
  }

  if (lastRoundWinner === "player") {
    return "愤怒";
  }

  return "冷静";
}

export function pickTeaHouseAiHandCard(
  personality: string,
  hand: readonly TeaHouseTopicCard[],
  emotion: TeaHouseDebateEmotion,
  lastNpcTopic: TeaHouseTopicCard | null,
  randomSource: RandomSource = Math.random
): TeaHouseAiTopicPick {
  if (hand.length === 0) {
    throw new Error("Tea house AI cannot pick from an empty hand.");
  }

  if (emotion === "得意" && lastNpcTopic != null && randomSource() < teaHouseProudRepeatChance) {
    const repeatedIndex = hand.findIndex((topic) => topic === lastNpcTopic);
    if (repeatedIndex >= 0) {
      return {
        handIndex: repeatedIndex,
        topic: hand[repeatedIndex]!,
      };
    }
  }

  if (emotion === "愤怒") {
    const handIndex = pickTeaHouseRandomHandIndex(hand, randomSource);
    return {
      handIndex,
      topic: hand[handIndex]!,
    };
  }

  const handIndex = getWeightedHandIndex(hand, personality, randomSource);
  return {
    handIndex,
    topic: hand[handIndex]!,
  };
}

export function createTeaHouseNpcHintTopic(
  actualTopic: TeaHouseTopicCard,
  randomSource: RandomSource = Math.random
): TeaHouseTopicCard {
  if (randomSource() < teaHouseNpcHintAccuracy) {
    return actualTopic;
  }

  const alternativeTopics = TEA_HOUSE_TOPIC_CARDS.filter(
    (topic) => topic !== actualTopic
  );
  return pickRandomTopic(alternativeTopics, randomSource);
}

export function resolveTeaHouseDebateWinner(
  playerTopic: TeaHouseTopicCard,
  npcTopic: TeaHouseTopicCard
): TeaHouseDebateWinner {
  if (teaHouseTopicCounterMap[playerTopic] === npcTopic) {
    return "player";
  }

  if (teaHouseTopicCounterMap[npcTopic] === playerTopic) {
    return "npc";
  }

  return "draw";
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
  const lines = [`你出「${playerTopic}」，对手出「${npcTopic}」。`];
  const winner = resolveTeaHouseDebateWinner(playerTopic, npcTopic);

  if (didTimeout) {
    playerSpirit -= 1;
    lines.push("你犹疑超时，气势先失 1 点。");
  }

  if (winner === "player") {
    npcSpirit -= 2;
    consecutivePlayerWins += 1;
    lines.push("你抓住话头压过了对方，敌方气势 -2。");

    if (consecutivePlayerWins >= 2) {
      npcSpirit -= 1;
      lines.push("你连续压制成功，追加伤害 1 点。");
    }
  } else if (winner === "npc") {
    playerSpirit -= 2;
    consecutivePlayerWins = 0;
    lines.push("对方顺势反压，你的气势 -2。");
  } else {
    consecutivePlayerWins = 0;
    lines.push("双方论点并无明确克制，僵持不下，气势不变。");
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
  return teaHouseTurnTimeLimitSec;
}
