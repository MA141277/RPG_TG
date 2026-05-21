"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grainShopHouseModule = void 0;
const grain_shop_content_1 = require("../../../content/houses/grain-shop-content");
const accounting_minigame_1 = require("../../grain-shop/accounting-minigame");
const apply_accounting_reward_1 = require("../../grain-shop/apply-accounting-reward");
const grain_shop_snapshot_1 = require("../../grain-shop/grain-shop-snapshot");
const grain_trade_1 = require("../../grain-shop/grain-trade");
const grain_market_1 = require("../../grain-shop/grain-market");
const investigate_grain_market_1 = require("../../grain-shop/investigate-grain-market");
const init_grain_shop_session_1 = require("../../grain-shop/init-grain-shop-session");
const grain_shop_mutations_1 = require("../../grain-shop/grain-shop-mutations");
const assert_1 = require("../../../shared/assert");
const grain_shop_session_state_1 = require("./grain-shop-session-state");
const ACCOUNTING_INTERVAL_ID = "grain-shop-accounting";
const TRADE_QUANTITY_FIELD_ID = "grain-shop-trade-quantity";
function getPlayerCharacter(characterDefinitions, playerCharacterId) {
    const playerCharacter = characterDefinitions.find((characterDefinition) => characterDefinition.id === playerCharacterId);
    (0, assert_1.assertExists)(playerCharacter, `Player character not found for id "${playerCharacterId}" in grain shop module.`);
    return playerCharacter;
}
function createTransitionResult(input, patch) {
    return {
        gameState: patch?.gameState ?? input.gameState,
        characterDefinitions: patch?.characterDefinitions ?? input.characterDefinitions,
        sessionState: patch?.sessionState ?? input.sessionState,
        ...(patch?.sideEffects == null ? {} : { sideEffects: patch.sideEffects }),
    };
}
function withDialoguePhase(input, sessionState, dialoguePhase) {
    if (sessionState == null) {
        return {
            gameState: input.gameState,
            characterDefinitions: input.characterDefinitions,
            sessionState,
        };
    }
    return {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
        sessionState: {
            ...sessionState,
            dialoguePhase,
        },
    };
}
function withOverlay(input, sessionState, overlay, sideEffects) {
    if (sessionState == null) {
        return {
            gameState: input.gameState,
            characterDefinitions: input.characterDefinitions,
            sessionState,
            ...(sideEffects == null ? {} : { sideEffects }),
        };
    }
    return {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
        sessionState: {
            ...sessionState,
            overlay,
        },
        ...(sideEffects == null ? {} : { sideEffects }),
    };
}
function openTradeOverlay(input, sessionState, mode) {
    const grainPrice = (0, grain_market_1.rollGrainPrice)();
    const nextState = (0, grain_shop_mutations_1.setGrainPrice)(input.gameState, grainPrice);
    return withOverlay({
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
    }, sessionState, {
        type: "trade",
        mode,
        quantity: 1,
        grainPrice,
        tradeTotal: (0, grain_market_1.getTradeTotal)(grainPrice, 1),
    });
}
function updateTradeQuantity(input, sessionState, quantity) {
    const overlay = sessionState?.overlay;
    if (overlay?.type !== "trade") {
        return {
            gameState: input.gameState,
            characterDefinitions: input.characterDefinitions,
            sessionState,
        };
    }
    const nextQuantity = Math.max(1, quantity);
    return withOverlay(input, sessionState, {
        ...overlay,
        quantity: nextQuantity,
        tradeTotal: (0, grain_market_1.getTradeTotal)(overlay.grainPrice, nextQuantity),
    });
}
function finalizeAccountingMinigame(input, sessionState) {
    const overlay = sessionState?.overlay;
    if (overlay?.type !== "minigame") {
        return {
            gameState: input.gameState,
            characterDefinitions: input.characterDefinitions,
            sessionState,
            sideEffects: [{ type: "stop-interval", intervalId: ACCOUNTING_INTERVAL_ID }],
        };
    }
    const grade = (0, accounting_minigame_1.resolveAccountingGrade)(overlay.score);
    const reward = (0, accounting_minigame_1.getAccountingGradeReward)(grade);
    const mutation = (0, apply_accounting_reward_1.applyAccountingReward)(input.gameState, input.characterDefinitions, input.playerCharacterId, grade);
    return withOverlay({
        gameState: mutation.state,
        characterDefinitions: mutation.characterDefinitions,
    }, sessionState, {
        type: "result",
        grade,
        score: overlay.score,
        reward,
    }, [{ type: "stop-interval", intervalId: ACCOUNTING_INTERVAL_ID }]);
}
function handleTick(input, sessionState) {
    const overlay = sessionState?.overlay;
    if (input.request.type !== "tick" || input.request.tickId !== ACCOUNTING_INTERVAL_ID) {
        return createTransitionResult(input);
    }
    if (overlay?.type !== "minigame") {
        return createTransitionResult(input, {
            sideEffects: [{ type: "stop-interval", intervalId: ACCOUNTING_INTERVAL_ID }],
        });
    }
    const nextSeconds = overlay.secondsLeft - 1;
    if (nextSeconds <= 0) {
        return finalizeAccountingMinigame(input, sessionState);
    }
    return withOverlay(input, sessionState, {
        ...overlay,
        secondsLeft: nextSeconds,
    });
}
function handleField(input, sessionState) {
    if (input.request.type !== "field") {
        return createTransitionResult(input);
    }
    if (input.request.fieldId !== TRADE_QUANTITY_FIELD_ID) {
        return createTransitionResult(input);
    }
    const quantity = Math.max(1, parseInt(input.request.value, 10) || 1);
    return updateTradeQuantity(input, sessionState, quantity);
}
function toAlertOverlay(title, paragraphs, tone) {
    return {
        type: "alert",
        title,
        paragraphs,
        ...(tone == null ? {} : { tone }),
    };
}
function handleAction(input, sessionState) {
    if (input.request.type !== "action") {
        return createTransitionResult(input);
    }
    switch (input.request.actionId) {
        case "advance-greeting":
        case "open-npc-dialogue":
            return withDialoguePhase(input, sessionState, "open");
        case "dismiss-dialogue":
            return withDialoguePhase(input, sessionState, "idle");
        case "buy":
            return openTradeOverlay(input, sessionState, "buy");
        case "sell":
            return openTradeOverlay(input, sessionState, "sell");
        case "close-alert":
        case "close-trade":
        case "close-result":
            return withOverlay(input, sessionState, null, [
                { type: "stop-interval", intervalId: ACCOUNTING_INTERVAL_ID },
            ]);
        case "investigate": {
            const result = (0, investigate_grain_market_1.investigateGrainMarket)(input.gameState, input.characterDefinitions, input.playerCharacterId);
            return withOverlay({
                gameState: result.mutation.state,
                characterDefinitions: result.mutation.characterDefinitions,
            }, sessionState, toAlertOverlay("市场调查", [
                result.dialogue,
                `传闻：${result.rumor}`,
                `当前粮价约为每石 ${result.grainPrice} 文。`,
            ]));
        }
        case "confirm-trade": {
            const overlay = sessionState?.overlay;
            if (overlay?.type !== "trade") {
                return createTransitionResult(input);
            }
            const tradeResult = (0, grain_trade_1.executeGrainTrade)(input.gameState, input.characterDefinitions, input.playerCharacterId, overlay.mode, overlay.quantity, overlay.grainPrice);
            if (!tradeResult.ok) {
                return withOverlay(input, sessionState, toAlertOverlay(tradeResult.errorTitle, [tradeResult.errorMessage], "warning"));
            }
            return withOverlay({
                gameState: tradeResult.mutation.state,
                characterDefinitions: tradeResult.mutation.characterDefinitions,
            }, sessionState, toAlertOverlay("成交", [tradeResult.message], "success"));
        }
        case "trade-qty-minus": {
            const overlay = sessionState?.overlay;
            if (overlay?.type !== "trade") {
                return createTransitionResult(input);
            }
            return updateTradeQuantity(input, sessionState, overlay.quantity - 1);
        }
        case "trade-qty-plus": {
            const overlay = sessionState?.overlay;
            if (overlay?.type !== "trade") {
                return createTransitionResult(input);
            }
            return updateTradeQuantity(input, sessionState, overlay.quantity + 1);
        }
        case "accounting": {
            const firstQuestion = (0, accounting_minigame_1.generateLedgerQuestion)();
            return withOverlay(input, sessionState, {
                type: "minigame",
                score: 0,
                wrongCount: 0,
                secondsLeft: grain_shop_content_1.accountingGameDurationSec,
                question: firstQuestion,
            }, [
                { type: "stop-interval", intervalId: ACCOUNTING_INTERVAL_ID },
                {
                    type: "start-interval",
                    intervalId: ACCOUNTING_INTERVAL_ID,
                    everyMs: 1000,
                    request: {
                        type: "tick",
                        tickId: ACCOUNTING_INTERVAL_ID,
                    },
                },
            ]);
        }
        case "ledger-correct":
        case "ledger-wrong": {
            const overlay = sessionState?.overlay;
            if (overlay?.type !== "minigame") {
                return createTransitionResult(input);
            }
            const playerSaysCorrect = input.request.actionId === "ledger-correct";
            const isCorrect = (0, accounting_minigame_1.isLedgerAnswerCorrect)(overlay.question, playerSaysCorrect);
            const nextScore = isCorrect ? overlay.score + 1 : overlay.score;
            const nextWrongCount = isCorrect ? overlay.wrongCount : overlay.wrongCount + 1;
            if (nextWrongCount >= grain_shop_content_1.accountingMaxWrongAnswers) {
                const nextSessionState = sessionState == null
                    ? sessionState
                    : {
                        ...sessionState,
                        overlay: {
                            ...overlay,
                            score: nextScore,
                            wrongCount: nextWrongCount,
                        },
                    };
                return finalizeAccountingMinigame(input, nextSessionState);
            }
            return withOverlay(input, sessionState, {
                ...overlay,
                score: nextScore,
                wrongCount: nextWrongCount,
                question: (0, accounting_minigame_1.generateLedgerQuestion)(),
            });
        }
        default:
            return createTransitionResult(input);
    }
}
function selectOverlayViewModel(overlay) {
    if (overlay == null) {
        return null;
    }
    switch (overlay.type) {
        case "alert":
            return {
                type: "alert",
                title: overlay.title,
                paragraphs: overlay.paragraphs,
                ...(overlay.tone == null ? {} : { tone: overlay.tone }),
                confirmActionId: "close-alert",
                confirmLabel: "知道了",
            };
        case "trade":
            return {
                type: "trade",
                title: overlay.mode === "buy" ? "买粮" : "卖粮",
                mode: overlay.mode,
                grainPrice: overlay.grainPrice,
                quantity: overlay.quantity,
                tradeTotal: overlay.tradeTotal,
                quantityFieldId: TRADE_QUANTITY_FIELD_ID,
                decrementActionId: "trade-qty-minus",
                incrementActionId: "trade-qty-plus",
                confirmActionId: "confirm-trade",
                confirmLabel: overlay.mode === "buy" ? "确认购买" : "确认卖出",
                cancelActionId: "close-trade",
                cancelLabel: "取消",
            };
        case "minigame":
            return {
                type: "minigame",
                title: "帮忙算账",
                secondsLeft: overlay.secondsLeft,
                score: overlay.score,
                wrongsLeft: grain_shop_content_1.accountingMaxWrongAnswers - overlay.wrongCount,
                ledgerRows: [
                    { label: "买入", value: `${overlay.question.bought} 石` },
                    { label: "卖出", value: `${overlay.question.sold} 石` },
                    { label: "库存", value: `${overlay.question.displayedStock} 石` },
                ],
                correctActionId: "ledger-correct",
                wrongActionId: "ledger-wrong",
            };
        case "result": {
            const rewardLines = [
                overlay.reward.math > 0 ? `算术 +${overlay.reward.math}` : overlay.reward.math < 0 ? `算术 ${overlay.reward.math}` : "算术 不变",
                overlay.reward.money > 0 ? `金钱 +${overlay.reward.money}` : "金钱 不变",
                overlay.reward.relationship > 0 ? `与掌柜关系 +${overlay.reward.relationship}` : "与掌柜关系 不变",
                "时间 +1",
            ];
            return {
                type: "result",
                title: "算账结算",
                grade: overlay.grade,
                score: overlay.score,
                rewardLines,
                confirmActionId: "close-result",
                confirmLabel: "收工",
            };
        }
        default:
            return null;
    }
}
function createStatusCard(snapshot, title) {
    return {
        eyebrow: "屋敷",
        title,
        subtitle: "陈记粮行 / 南北通商",
        metrics: [
            { label: "金钱", value: `${snapshot.money} 文` },
            { label: "粮仓", value: `${snapshot.food} 石` },
            { label: "市价", value: `${snapshot.grainPrice} 文` },
        ],
    };
}
exports.grainShopHouseModule = {
    moduleId: "grain-shop",
    enter(input) {
        const initResult = (0, init_grain_shop_session_1.initGrainShopSession)(input.gameState, input.characterDefinitions);
        return {
            gameState: initResult.state,
            characterDefinitions: initResult.characterDefinitions,
            sessionState: (0, grain_shop_session_state_1.createInitialGrainShopSessionState)((0, grain_market_1.pickNpcGreeting)(), (0, grain_market_1.pickNpcDefaultLine)()),
            sideEffects: [{ type: "stop-interval", intervalId: ACCOUNTING_INTERVAL_ID }],
        };
    },
    dispatch(input) {
        const sessionState = input.sessionState;
        if (input.request.type === "tick") {
            return handleTick(input, sessionState);
        }
        if (input.request.type === "field") {
            return handleField(input, sessionState);
        }
        return handleAction(input, sessionState);
    },
    leave(input) {
        return {
            gameState: input.gameState,
            characterDefinitions: input.characterDefinitions,
            sessionState: null,
            sideEffects: [{ type: "stop-interval", intervalId: ACCOUNTING_INTERVAL_ID }],
        };
    },
    selectViewModel(input) {
        const sessionState = input.sessionState ?? (0, grain_shop_session_state_1.createInitialGrainShopSessionState)("", "");
        const playerCharacter = getPlayerCharacter(input.characterDefinitions, input.playerCharacterId);
        const npc = input.houseDefinition.defaultCharacterId == null
            ? null
            : input.characterDefinitions.find((characterDefinition) => characterDefinition.id === input.houseDefinition.defaultCharacterId) ?? null;
        const snapshot = (0, grain_shop_snapshot_1.createGrainShopSnapshot)(input.gameState, playerCharacter);
        const isIdle = sessionState.dialoguePhase === "idle";
        const isGreeting = sessionState.dialoguePhase === "greeting";
        const isOpen = sessionState.dialoguePhase === "open";
        return {
            moduleId: "grain-shop",
            houseId: input.houseDefinition.id,
            sceneTitle: input.houseDefinition.name,
            sceneSubtitle: "陈记粮行 / 南北通商",
            standbyRoster: isIdle && npc != null
                ? [
                    {
                        characterId: npc.id,
                        name: npc.name,
                        ...(npc.title == null ? {} : { title: npc.title }),
                        actionId: "open-npc-dialogue",
                    },
                ]
                : [],
            dialogue: isIdle || npc == null
                ? null
                : {
                    mode: "character",
                    speakerName: npc.name,
                    characterId: npc.id,
                    position: "right",
                    textLines: [isGreeting ? sessionState.npcGreeting : sessionState.npcDefaultLine],
                    advanceActionId: isGreeting ? "advance-greeting" : null,
                    advanceHintText: isGreeting ? "点击继续" : null,
                },
            actionContainer: isOpen
                ? {
                    title: "粮行操作",
                    actions: [
                        { id: "buy", label: "买粮" },
                        { id: "sell", label: "卖粮" },
                        { id: "investigate", label: "调查" },
                        { id: "accounting", label: "算账", tone: "accent" },
                        { id: "dismiss-dialogue", label: "关闭" },
                    ],
                }
                : null,
            statusCard: createStatusCard(snapshot, input.houseDefinition.name),
            overlay: selectOverlayViewModel(sessionState.overlay),
            leaveAction: {
                id: "leave-house",
                label: "离开",
                ...(isIdle ? { tone: "accent" } : {}),
            },
        };
    },
};
