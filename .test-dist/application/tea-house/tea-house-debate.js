"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInitialTeaHouseDebateState = createInitialTeaHouseDebateState;
exports.pickTeaHouseAiTopic = pickTeaHouseAiTopic;
exports.resolveTeaHouseDebateWinner = resolveTeaHouseDebateWinner;
exports.resolveTeaHouseDebateRound = resolveTeaHouseDebateRound;
exports.createDebateNextRoundTimer = createDebateNextRoundTimer;
const tea_house_content_1 = require("../../content/houses/tea-house-content");
const tea_house_1 = require("../../domain/tea-house");
function getTotalWeight(weights) {
    return tea_house_1.TEA_HOUSE_TOPIC_CARDS.reduce((sum, topic) => sum + weights[topic], 0);
}
function createInitialTeaHouseDebateState() {
    return {
        round: 1,
        playerSpirit: tea_house_content_1.teaHouseInitialSpirit,
        npcSpirit: tea_house_content_1.teaHouseInitialSpirit,
        timeoutCount: 0,
        consecutivePlayerWins: 0,
    };
}
function pickTeaHouseAiTopic(personality, randomSource = Math.random) {
    const defaultWeights = tea_house_content_1.teaHousePersonalityTopicWeights["圆滑"];
    if (defaultWeights == null) {
        throw new Error("Missing default tea house debate weights.");
    }
    const weights = tea_house_content_1.teaHousePersonalityTopicWeights[personality] ?? defaultWeights;
    const totalWeight = getTotalWeight(weights);
    let threshold = randomSource() * totalWeight;
    for (const topic of tea_house_1.TEA_HOUSE_TOPIC_CARDS) {
        threshold -= weights[topic];
        if (threshold < 0) {
            return topic;
        }
    }
    return "义";
}
function resolveTeaHouseDebateWinner(playerTopic, npcTopic) {
    if (playerTopic === npcTopic) {
        return "draw";
    }
    return tea_house_content_1.teaHouseTopicCounterMap[playerTopic] === npcTopic ? "player" : "npc";
}
function createOutcome(roundState) {
    if (roundState.playerSpirit > 0 && roundState.npcSpirit > 0) {
        return null;
    }
    const winner = roundState.playerSpirit <= 0 && roundState.npcSpirit <= 0
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
function resolveTeaHouseDebateRound(roundState, playerTopic, npcTopic, didTimeout) {
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
    }
    else if (winner === "npc") {
        playerSpirit -= 2;
        consecutivePlayerWins = 0;
        lines.push("对方顺势反压，你的气势 -2。");
    }
    else {
        playerSpirit -= 1;
        npcSpirit -= 1;
        consecutivePlayerWins = 0;
        lines.push("双方各执一词，气势各 -1。");
    }
    const nextState = {
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
function createDebateNextRoundTimer() {
    return tea_house_content_1.teaHouseTurnTimeLimitSec;
}
