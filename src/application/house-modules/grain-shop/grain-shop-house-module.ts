import { accountingGameDurationSec, accountingMaxWrongAnswers } from "../../../content/houses/grain-shop-content";
import type { CharacterDefinition } from "../../../domain/character";
import type { HouseActivityConfirmOverlayState } from "../../../domain/house-activity";
import type {
  HouseModuleDefinition,
  HouseModuleDispatchInput,
  HouseModuleTransitionResult,
  HouseModuleViewModel,
  HouseOverlayViewModel,
} from "../../../domain/house-module";
import type { GrainShopPlayerSnapshot } from "../../../domain/grain-shop";
import { formatGrainAsShiAndDou } from "../../../domain/grain-unit";
import type {
  GrainShopDialoguePhase,
  GrainShopSessionState,
} from "../../../domain/house-modules/grain-shop-session";
import { isHaozhouShortageDuringBeggingJourney } from "../../../domain/zhu-yuanzhang-story";
import { generateLedgerQuestion, getAccountingGradeReward, isLedgerAnswerCorrect, resolveAccountingGrade } from "../../grain-shop/accounting-minigame";
import { applyAccountingReward } from "../../grain-shop/apply-accounting-reward";
import { createGrainShopSnapshot } from "../../grain-shop/grain-shop-snapshot";
import { executeGrainTrade } from "../../grain-shop/grain-trade";
import { getQuotedGrainPrice, getTradeTotal, pickNpcDefaultLine, pickNpcGreeting } from "../../grain-shop/grain-market";
import { investigateGrainMarket } from "../../grain-shop/investigate-grain-market";
import { initGrainShopSession } from "../../grain-shop/init-grain-shop-session";
import { setGrainPrice } from "../../grain-shop/grain-shop-mutations";
import {
  convertHouseActivityDaysToSegments,
  formatHouseActivityCostLine,
  getHouseMinigameDurationDays,
} from "../../house/house-activity-costs";
import { getInsufficientDaysForTimedActivity } from "../../time/council-priority";
import {
  ACTIVITY_COMPLETION_STAMINA_COST,
  canAffordActivityCost,
} from "../../player/player-stamina";
import { defaultRuntimeContent } from "../../content/default-runtime-content";
import { resolveTextEntry, resolveTextTemplateEntry } from "../../content/text-resolution";
import {
  createExitPlayableRequest,
  createLaunchPlayableRequest,
  createPlayableActionRequest,
  runPlayableRuntime,
} from "../../../core/runtime/playable-runtime";
import { assertExists } from "../../../shared/assert";
import {
  createHousePlayableRuntimeState,
  readHousePlayableSessionState,
} from "../../playables/house-playable-runtime-bridge";
import { getGrainAccountingTimeAdvanceCost } from "../../playables/grain-accounting/grain-accounting-definition";
import { createInitialGrainShopSessionState } from "./grain-shop-session-state";

const ACCOUNTING_INTERVAL_ID = "grain-shop-accounting";
const TRADE_QUANTITY_FIELD_ID = "grain-shop-trade-quantity";
const CONFIRM_START_ACCOUNTING_ACTION_ID = "confirm-start-accounting";
const CANCEL_ACTIVITY_CONFIRM_ACTION_ID = "cancel-activity-confirm";

function getPlayerCharacter(
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string
): CharacterDefinition {
  const playerCharacter = characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assertExists(
    playerCharacter,
    `Player character not found for id "${playerCharacterId}" in grain shop module.`
  );
  return playerCharacter;
}

function getPlayerArithmeticSkill(playerCharacter: CharacterDefinition): number {
  return Math.max(1, playerCharacter.skills?.arithmetic ?? 1);
}

function getGrainShopTextEntries(
  textEntriesById?: Record<string, string>
): Record<string, string> {
  return textEntriesById ?? defaultRuntimeContent.textEntriesById ?? {};
}

function resolveGrainShopText(
  textEntriesById: Record<string, string>,
  textId: string,
  fallback?: string
): string {
  return resolveTextEntry(
    textEntriesById,
    textId,
    fallback ?? `MISSING_TEXT:${textId}`
  );
}

function resolveGrainShopTemplateText(
  textEntriesById: Record<string, string>,
  textId: string,
  values: Record<string, string | number | boolean | null | undefined>,
  fallback?: string
): string {
  return resolveTextTemplateEntry(
    textEntriesById,
    textId,
    values,
    fallback ?? `MISSING_TEXT:${textId}`
  );
}

function createTransitionResult(
  input: Pick<
    HouseModuleDispatchInput<"grain-shop">,
    "gameState" | "characterDefinitions" | "sessionState"
  >,
  patch?: Partial<HouseModuleTransitionResult<"grain-shop">>
): HouseModuleTransitionResult<"grain-shop"> {
  return {
    gameState: patch?.gameState ?? input.gameState,
    characterDefinitions: patch?.characterDefinitions ?? input.characterDefinitions,
    sessionState: patch?.sessionState ?? input.sessionState,
    ...(patch?.sideEffects == null ? {} : { sideEffects: patch.sideEffects }),
  };
}

function withDialoguePhase(
  input: Pick<
    HouseModuleDispatchInput<"grain-shop">,
    "gameState" | "characterDefinitions"
  >,
  sessionState: GrainShopSessionState | null,
  dialoguePhase: GrainShopDialoguePhase
): HouseModuleTransitionResult<"grain-shop"> {
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

function withOverlay(
  input: Pick<
    HouseModuleDispatchInput<"grain-shop">,
    "gameState" | "characterDefinitions"
  >,
  sessionState: GrainShopSessionState | null,
  overlay: GrainShopSessionState["overlay"],
  sideEffects?: HouseModuleTransitionResult<"grain-shop">["sideEffects"]
): HouseModuleTransitionResult<"grain-shop"> {
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

function runGrainAccountingPlayableRequest(
  input: HouseModuleDispatchInput<"grain-shop">,
  sessionState: GrainShopSessionState | null,
  request:
    | ReturnType<typeof createLaunchPlayableRequest>
    | ReturnType<typeof createPlayableActionRequest>
    | ReturnType<typeof createExitPlayableRequest>,
  sideEffects?: HouseModuleTransitionResult<"grain-shop">["sideEffects"]
): HouseModuleTransitionResult<"grain-shop"> {
  const runtimeResult = runPlayableRuntime({
    state: createHousePlayableRuntimeState({
      gameState: input.gameState,
      moduleId: "grain-shop",
      sessionState,
    }),
    request,
    characterDefinitions: input.characterDefinitions,
    playerCharacterId: input.playerCharacterId,
  });
  const nextSessionState = readHousePlayableSessionState(
    runtimeResult.state,
    "grain-shop"
  );
  const completed =
    sessionState?.overlay?.type === "minigame" &&
    nextSessionState?.overlay?.type === "result" &&
    runtimeResult.state.core.runtime.playableSession == null;

  return {
    gameState: runtimeResult.state.core,
    characterDefinitions:
      runtimeResult.characterDefinitions ?? input.characterDefinitions,
    sessionState: nextSessionState,
    ...((sideEffects == null && !completed)
      ? {}
      : {
          sideEffects: [
            ...(sideEffects ?? []),
            ...(completed
              ? [{ type: "stop-interval" as const, intervalId: ACCOUNTING_INTERVAL_ID }]
              : []),
          ],
        }),
    ...(completed
      ? {
          timeAdvanceCost: getGrainAccountingTimeAdvanceCost(
            input.characterDefinitions,
            input.playerCharacterId
          ),
        }
      : {}),
  };
}

function openTradeOverlay(
  input: Pick<
    HouseModuleDispatchInput<"grain-shop">,
    "gameState" | "characterDefinitions"
  >,
  sessionState: GrainShopSessionState | null,
  mode: "buy" | "sell"
): HouseModuleTransitionResult<"grain-shop"> {
  const marketQuote = getQuotedGrainPrice(input.gameState);
  const grainPrice = mode === "buy" ? marketQuote.buyPrice : marketQuote.sellPrice;
  const nextState = setGrainPrice(marketQuote.state, marketQuote.buyPrice);

  return withOverlay(
    {
      gameState: nextState,
      characterDefinitions: input.characterDefinitions,
    },
    sessionState,
    {
      type: "trade",
      mode,
      quantity: 1,
      grainPrice,
      tradeTotal: getTradeTotal(grainPrice, 1),
    }
  );
}

function updateTradeQuantity(
  input: Pick<
    HouseModuleDispatchInput<"grain-shop">,
    "gameState" | "characterDefinitions"
  >,
  sessionState: GrainShopSessionState | null,
  quantity: number
): HouseModuleTransitionResult<"grain-shop"> {
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
    tradeTotal: getTradeTotal(overlay.grainPrice, nextQuantity),
  });
}

function finalizeAccountingMinigame(
  input: Pick<
    HouseModuleDispatchInput<"grain-shop">,
    "gameState" | "characterDefinitions" | "playerCharacterId"
  >,
  sessionState: GrainShopSessionState | null
): HouseModuleTransitionResult<"grain-shop"> {
  const overlay = sessionState?.overlay;
  if (overlay?.type !== "minigame") {
    return {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      sessionState,
      sideEffects: [{ type: "stop-interval", intervalId: ACCOUNTING_INTERVAL_ID }],
    };
  }

  const playerCharacter = getPlayerCharacter(
    input.characterDefinitions,
    input.playerCharacterId
  );
  const durationDays = getHouseMinigameDurationDays(
    getPlayerArithmeticSkill(playerCharacter)
  );
  const grade = resolveAccountingGrade(overlay.score);
  const reward = getAccountingGradeReward(grade);
  const mutation = applyAccountingReward(
    input.gameState,
    input.characterDefinitions,
    input.playerCharacterId,
    grade,
    durationDays
  );

  return {
    ...withOverlay(
      {
        gameState: mutation.state,
        characterDefinitions: mutation.characterDefinitions,
      },
      sessionState,
      {
        type: "result",
        grade,
        score: overlay.score,
        reward,
        durationDays,
      },
      [{ type: "stop-interval", intervalId: ACCOUNTING_INTERVAL_ID }]
    ),
    timeAdvanceCost: convertHouseActivityDaysToSegments(durationDays),
  };
}

function handleTick(
  input: HouseModuleDispatchInput<"grain-shop">,
  sessionState: GrainShopSessionState | null
): HouseModuleTransitionResult<"grain-shop"> {
  const overlay = sessionState?.overlay;
  if (input.request.type !== "tick" || input.request.tickId !== ACCOUNTING_INTERVAL_ID) {
    return createTransitionResult(input);
  }

  if (overlay?.type !== "minigame") {
    return createTransitionResult(input, {
      sideEffects: [{ type: "stop-interval", intervalId: ACCOUNTING_INTERVAL_ID }],
    });
  }

  if (input.gameState.runtime.playableSession?.playableId === "grain-accounting") {
    return runGrainAccountingPlayableRequest(
      input,
      sessionState,
      createPlayableActionRequest("grain-accounting", "tick")
    );
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

function handleField(
  input: HouseModuleDispatchInput<"grain-shop">,
  sessionState: GrainShopSessionState | null
): HouseModuleTransitionResult<"grain-shop"> {
  if (input.request.type !== "field") {
    return createTransitionResult(input);
  }

  if (input.request.fieldId !== TRADE_QUANTITY_FIELD_ID) {
    return createTransitionResult(input);
  }

  const quantity = Math.max(1, parseInt(input.request.value, 10) || 1);
  return updateTradeQuantity(input, sessionState, quantity);
}

function toAlertOverlay(title: string, paragraphs: string[], tone?: "info" | "success" | "warning") {
  return {
    type: "alert" as const,
    title,
    paragraphs,
    ...(tone == null ? {} : { tone }),
  };
}

function createActivityConfirmOverlay(
  title: string,
  paragraphs: string[],
  confirmActionId: string
): HouseActivityConfirmOverlayState {
  return {
    type: "activity-confirm",
    title,
    paragraphs,
    confirmActionId,
    confirmLabel: "现在开始",
    cancelActionId: CANCEL_ACTIVITY_CONFIRM_ACTION_ID,
    cancelLabel: "稍后再说",
    tone: "info",
  };
}

function createCouncilTimeInsufficientOverlay(
  textEntriesById: Record<string, string> | undefined,
  durationDays: number,
  remainingDays: number
): GrainShopSessionState["overlay"] {
  const entries = getGrainShopTextEntries(textEntriesById);
  return toAlertOverlay(
    resolveGrainShopText(
      entries,
      "runtime.zhu_yuanzhang.grain_shop.accounting.blocked_by_council.title"
    ),
    remainingDays <= 0
      ? [
          resolveGrainShopText(
            entries,
            "runtime.zhu_yuanzhang.grain_shop.accounting.blocked_by_council.expired.001"
          ),
          resolveGrainShopTemplateText(
            entries,
            "runtime.zhu_yuanzhang.grain_shop.accounting.blocked_by_council.expired.002",
            { durationDays }
          ),
          resolveGrainShopText(
            entries,
            "runtime.zhu_yuanzhang.grain_shop.accounting.blocked_by_council.expired.003"
          ),
        ]
      : [
          resolveGrainShopText(
            entries,
            "runtime.zhu_yuanzhang.grain_shop.accounting.blocked_by_council.soon.001"
          ),
          resolveGrainShopTemplateText(
            entries,
            "runtime.zhu_yuanzhang.grain_shop.accounting.blocked_by_council.soon.002",
            { remainingDays, durationDays }
          ),
          resolveGrainShopText(
            entries,
            "runtime.zhu_yuanzhang.grain_shop.accounting.blocked_by_council.soon.003"
          ),
        ],
    "warning"
  );
}

function createGrainSoldOutOverlay(
  textEntriesById?: Record<string, string>
): GrainShopSessionState["overlay"] {
  const entries = getGrainShopTextEntries(textEntriesById);
  return toAlertOverlay(
    resolveGrainShopText(
      entries,
      "runtime.zhu_yuanzhang.grain_shop.sold_out.title"
    ),
    [
      resolveGrainShopText(
        entries,
        "runtime.zhu_yuanzhang.grain_shop.sold_out.001"
      ),
      resolveGrainShopText(
        entries,
        "runtime.zhu_yuanzhang.grain_shop.sold_out.002"
      ),
    ],
    "warning"
  );
}

function startAccountingMinigame(
  input: HouseModuleDispatchInput<"grain-shop">,
  sessionState: GrainShopSessionState | null
): HouseModuleTransitionResult<"grain-shop"> {
  const playerCharacter = getPlayerCharacter(
    input.characterDefinitions,
    input.playerCharacterId
  );
  const durationDays = getHouseMinigameDurationDays(
    getPlayerArithmeticSkill(playerCharacter)
  );
  const remainingDays = getInsufficientDaysForTimedActivity(
    input.gameState,
    durationDays
  );
  if (remainingDays != null) {
    return withOverlay(
      input,
      sessionState,
      createCouncilTimeInsufficientOverlay(
        input.textEntriesById,
        durationDays,
        remainingDays
      )
    );
  }

  return runGrainAccountingPlayableRequest(
    input,
    sessionState,
    createLaunchPlayableRequest("grain-accounting", {
      ownerContext: {
        ownerKind: "house",
        ownerId: input.houseDefinition.id,
        returnPolicy: "resume-owner",
      },
    }),
    [
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
    ]
  );
}

function handleAction(
  input: HouseModuleDispatchInput<"grain-shop">,
  sessionState: GrainShopSessionState | null
): HouseModuleTransitionResult<"grain-shop"> {
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
      if (isHaozhouShortageDuringBeggingJourney(input.gameState)) {
        return withOverlay(
          input,
          sessionState,
          createGrainSoldOutOverlay(input.textEntriesById)
        );
      }
      return openTradeOverlay(input, sessionState, "buy");
    case "sell":
      return openTradeOverlay(input, sessionState, "sell");
    case "close-alert":
    case "close-trade":
    case "close-result":
    case CANCEL_ACTIVITY_CONFIRM_ACTION_ID:
      return withOverlay(input, sessionState, null, [
        { type: "stop-interval", intervalId: ACCOUNTING_INTERVAL_ID },
      ]);
    case "investigate": {
      const result = investigateGrainMarket(
        input.gameState,
        input.characterDefinitions,
        input.playerCharacterId,
        input.textEntriesById
      );
      return {
        ...withOverlay(
          {
            gameState: result.mutation.state,
            characterDefinitions: result.mutation.characterDefinitions,
          },
          sessionState,
          toAlertOverlay("市场调查", [
            result.dialogue,
            `传闻：${result.rumor}`,
            `当前粮价约为每石 ${result.grainPrice} 文。`,
          ])
        ),
        timeAdvanceCost: 1,
      };
    }
    case "confirm-trade": {
      const overlay = sessionState?.overlay;
      if (overlay?.type !== "trade") {
        return createTransitionResult(input);
      }

      if (
        overlay.mode === "buy" &&
        isHaozhouShortageDuringBeggingJourney(input.gameState)
      ) {
        return withOverlay(
          input,
          sessionState,
          createGrainSoldOutOverlay(input.textEntriesById)
        );
      }

      const tradeResult = executeGrainTrade(
        input.gameState,
        input.characterDefinitions,
        input.playerCharacterId,
        overlay.mode,
        overlay.quantity,
        overlay.grainPrice
      );

      if (!tradeResult.ok) {
        return withOverlay(
          input,
          sessionState,
          toAlertOverlay(tradeResult.errorTitle, [tradeResult.errorMessage], "warning")
        );
      }

      return {
        ...withOverlay(
          {
            gameState: tradeResult.mutation.state,
            characterDefinitions: tradeResult.mutation.characterDefinitions,
          },
          sessionState,
          toAlertOverlay("成交", [tradeResult.message], "success")
        ),
        timeAdvanceCost: 1,
      };
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
      const playerCharacter = getPlayerCharacter(
        input.characterDefinitions,
        input.playerCharacterId
      );
      if (!canAffordActivityCost(playerCharacter)) {
        return withOverlay(
          input,
          sessionState,
          toAlertOverlay(
            "先歇一歇",
            [
              "（抬手按住了账册）你这会儿眼都发花，再算下去只会把账越算越乱。",
              `先去缓口气，攒够 ${ACTIVITY_COMPLETION_STAMINA_COST} 点体力，再回来拨算盘。`,
            ],
            "warning"
          )
        );
      }

      const durationDays = getHouseMinigameDurationDays(
        getPlayerArithmeticSkill(playerCharacter)
      );
      const remainingDays = getInsufficientDaysForTimedActivity(
        input.gameState,
        durationDays
      );
      if (remainingDays != null) {
        return withOverlay(
          input,
          sessionState,
          createCouncilTimeInsufficientOverlay(
            input.textEntriesById,
            durationDays,
            remainingDays
          )
        );
      }

      return withOverlay(
        input,
        sessionState,
        createActivityConfirmOverlay("帮忙算账", [
          `（把账册推到了你面前）照你现在的算术底子，这一轮账真要细细理顺，少说也得耗上 ${durationDays} 天。`,
          formatHouseActivityCostLine(durationDays),
        ], CONFIRM_START_ACCOUNTING_ACTION_ID)
      );
    }
    case CONFIRM_START_ACCOUNTING_ACTION_ID:
      return startAccountingMinigame(input, sessionState);
    case "ledger-correct":
    case "ledger-wrong": {
      const overlay = sessionState?.overlay;
      if (overlay?.type !== "minigame") {
        return createTransitionResult(input);
      }

      if (input.gameState.runtime.playableSession?.playableId === "grain-accounting") {
        return runGrainAccountingPlayableRequest(
          input,
          sessionState,
          createPlayableActionRequest("grain-accounting", "answer", {
            playerSaysCorrect: input.request.actionId === "ledger-correct",
          })
        );
      }

      const playerSaysCorrect = input.request.actionId === "ledger-correct";
      const isCorrect = isLedgerAnswerCorrect(overlay.question, playerSaysCorrect);
      const nextScore = isCorrect ? overlay.score + 1 : overlay.score;
      const nextWrongCount = isCorrect ? overlay.wrongCount : overlay.wrongCount + 1;

      if (nextWrongCount >= accountingMaxWrongAnswers) {
        const nextSessionState =
          sessionState == null
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
        question: generateLedgerQuestion(),
      });
    }
    default:
      return createTransitionResult(input);
  }
}

function selectOverlayViewModel(overlay: GrainShopSessionState["overlay"]): HouseOverlayViewModel | null {
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
    case "activity-confirm":
      return {
        type: "confirm",
        title: overlay.title,
        paragraphs: overlay.paragraphs,
        confirmActionId: overlay.confirmActionId,
        confirmLabel: overlay.confirmLabel,
        cancelActionId: overlay.cancelActionId,
        cancelLabel: overlay.cancelLabel,
        ...(overlay.tone == null ? {} : { tone: overlay.tone }),
      };
    case "minigame":
      return {
        type: "minigame",
        title: "帮忙算账",
        secondsLeft: overlay.secondsLeft,
        score: overlay.score,
        wrongsLeft: accountingMaxWrongAnswers - overlay.wrongCount,
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
        `时间 +${overlay.durationDays}天`,
        `体力 -${ACTIVITY_COMPLETION_STAMINA_COST}`,
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

function createStatusCard(snapshot: GrainShopPlayerSnapshot, title: string) {
  return {
    eyebrow: "屋敷",
    title,
    subtitle: "陈记粮行 / 南北通商",
    metrics: [
      { label: "金钱", value: `${snapshot.money} 文` },
      { label: "粮仓", value: formatGrainAsShiAndDou(snapshot.foodDou) },
      { label: "市价", value: `${snapshot.grainPrice} 文` },
    ],
  };
}

export const grainShopHouseModule: HouseModuleDefinition<"grain-shop"> = {
  moduleId: "grain-shop",
  enter(input) {
    const initResult = initGrainShopSession(input.gameState, input.characterDefinitions);

    return {
      gameState: initResult.state,
      characterDefinitions: initResult.characterDefinitions,
      sessionState: createInitialGrainShopSessionState(
        pickNpcGreeting(input.textEntriesById),
        pickNpcDefaultLine(input.textEntriesById)
      ),
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
    const nextGameState =
      input.gameState.runtime.playableSession?.playableId === "grain-accounting"
        ? runPlayableRuntime({
            state: createHousePlayableRuntimeState({
              gameState: input.gameState,
              moduleId: "grain-shop",
              sessionState: input.sessionState,
            }),
            request: createExitPlayableRequest("grain-accounting"),
            characterDefinitions: input.characterDefinitions,
            playerCharacterId: input.playerCharacterId,
          }).state.core
        : input.gameState;

    return {
      gameState: nextGameState,
      characterDefinitions: input.characterDefinitions,
      sessionState: null,
      sideEffects: [{ type: "stop-interval", intervalId: ACCOUNTING_INTERVAL_ID }],
    };
  },
  selectViewModel(input): HouseModuleViewModel {
    const sessionState =
      input.sessionState ?? createInitialGrainShopSessionState("", "");
    const playerCharacter = getPlayerCharacter(input.characterDefinitions, input.playerCharacterId);
    const npc =
      input.houseDefinition.defaultCharacterId == null
        ? null
        : input.characterDefinitions.find(
            (characterDefinition) => characterDefinition.id === input.houseDefinition.defaultCharacterId
          ) ?? null;
    const snapshot = createGrainShopSnapshot(input.gameState, playerCharacter);
    const isIdle = sessionState.dialoguePhase === "idle";
    const isGreeting = sessionState.dialoguePhase === "greeting";
    const isOpen = sessionState.dialoguePhase === "open";
    const isBuyBlocked = isHaozhouShortageDuringBeggingJourney(input.gameState);

    return {
      moduleId: "grain-shop",
      houseId: input.houseDefinition.id,
      sceneTitle: input.houseDefinition.name,
      sceneSubtitle: "陈记粮行 / 南北通商",
      standbyRoster:
        isIdle && npc != null
          ? [
              {
                characterId: npc.id,
                name: npc.name,
                ...(npc.title == null ? {} : { title: npc.title }),
                actionId: "open-npc-dialogue",
              },
            ]
          : [],
      dialogue:
        isIdle || npc == null
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
              {
                id: "buy",
                label: isBuyBlocked ? "买粮（断供）" : "买粮",
                ...(isBuyBlocked ? { disabled: true } : {}),
              },
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
