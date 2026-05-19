import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import {
  GRAIN_SHOP_HOUSE_ID,
  type GrainShopTradeMode,
} from "../../domain/grain-shop";
import {
  accountingGameDurationSec,
  accountingMaxWrongAnswers,
} from "../../content/houses/grain-shop-content";
import {
  generateLedgerQuestion,
  getAccountingGradeReward,
  isLedgerAnswerCorrect,
  resolveAccountingGrade,
} from "./accounting-minigame";
import { stopAccountingTimer } from "./accounting-timer";
import { applyAccountingReward } from "./apply-accounting-reward";
import { executeGrainTrade } from "./grain-trade";
import { getTradeTotal, pickNpcDefaultLine, pickNpcGreeting, rollGrainPrice } from "./grain-market";
import { investigateGrainMarket } from "./investigate-grain-market";
import { initGrainShopSession } from "./init-grain-shop-session";
import { setGrainPrice } from "./grain-shop-mutations";
import {
  createInitialGrainShopSessionUi,
  type GrainShopSessionUi,
} from "./grain-shop-session-ui";

export type GrainShopHostState = {
  gameState: GameState;
  characterDefinitions: CharacterDefinition[];
  grainShopSessionUi: GrainShopSessionUi | null;
};

export function isGrainShopHouse(houseId: string | null): boolean {
  return houseId === GRAIN_SHOP_HOUSE_ID;
}

export function enterGrainShop(hostState: GrainShopHostState, playerCharacterId: string): GrainShopHostState {
  const initResult = initGrainShopSession(
    hostState.gameState,
    hostState.characterDefinitions,
    playerCharacterId
  );

  return {
    gameState: initResult.state,
    characterDefinitions: initResult.characterDefinitions,
    grainShopSessionUi: createInitialGrainShopSessionUi(pickNpcGreeting(), pickNpcDefaultLine()),
  };
}

export function leaveGrainShopSession(hostState: GrainShopHostState): GrainShopHostState {
  stopAccountingTimer();
  return {
    ...hostState,
    grainShopSessionUi: null,
  };
}

export function finalizeAccountingMinigame(
  hostState: GrainShopHostState,
  playerCharacterId: string
): GrainShopHostState {
  stopAccountingTimer();
  const overlay = hostState.grainShopSessionUi?.overlay;
  if (overlay?.type !== "minigame") {
    return hostState;
  }

  const grade = resolveAccountingGrade(overlay.score);
  const reward = getAccountingGradeReward(grade);
  const mutation = applyAccountingReward(
    hostState.gameState,
    hostState.characterDefinitions,
    playerCharacterId,
    grade
  );

  return {
    gameState: mutation.state,
    characterDefinitions: mutation.characterDefinitions,
    grainShopSessionUi:
      hostState.grainShopSessionUi == null
        ? null
        : {
            ...hostState.grainShopSessionUi,
            overlay: {
              type: "result",
              grade,
              score: overlay.score,
              reward,
            },
          },
  };
}

function withOverlay(
  hostState: GrainShopHostState,
  overlay: GrainShopSessionUi["overlay"]
): GrainShopHostState {
  if (hostState.grainShopSessionUi == null) {
    return hostState;
  }

  return {
    ...hostState,
    grainShopSessionUi: {
      ...hostState.grainShopSessionUi,
      overlay,
    },
  };
}

function withDialoguePhase(
  hostState: GrainShopHostState,
  dialoguePhase: GrainShopSessionUi["dialoguePhase"]
): GrainShopHostState {
  if (hostState.grainShopSessionUi == null) {
    return hostState;
  }

  return {
    ...hostState,
    grainShopSessionUi: {
      ...hostState.grainShopSessionUi,
      dialoguePhase,
    },
  };
}

function openTradeOverlay(
  hostState: GrainShopHostState,
  mode: GrainShopTradeMode
): GrainShopHostState {
  const grainPrice = rollGrainPrice();
  const nextState = setGrainPrice(hostState.gameState, grainPrice);

  return withOverlay(
    {
      ...hostState,
      gameState: nextState,
    },
    {
      type: "trade",
      mode,
      quantity: 1,
      grainPrice,
      tradeTotal: getTradeTotal(grainPrice, 1),
    }
  );
}

export function updateGrainShopTradeQuantity(
  hostState: GrainShopHostState,
  quantity: number
): GrainShopHostState {
  const overlay = hostState.grainShopSessionUi?.overlay;
  if (overlay?.type !== "trade") {
    return hostState;
  }

  const nextQuantity = Math.max(1, quantity);
  return withOverlay(hostState, {
    ...overlay,
    quantity: nextQuantity,
    tradeTotal: getTradeTotal(overlay.grainPrice, nextQuantity),
  });
}

export function tickAccountingMinigame(
  hostState: GrainShopHostState,
  playerCharacterId: string
): GrainShopHostState {
  const overlay = hostState.grainShopSessionUi?.overlay;
  if (overlay?.type !== "minigame") {
    return hostState;
  }

  const nextSeconds = overlay.secondsLeft - 1;
  if (nextSeconds <= 0) {
    return finalizeAccountingMinigame(hostState, playerCharacterId);
  }

  return withOverlay(hostState, {
    ...overlay,
    secondsLeft: nextSeconds,
  });
}

export function handleGrainShopAction(
  hostState: GrainShopHostState,
  action: string,
  playerCharacterId: string
): GrainShopHostState {
  switch (action) {
    case "advance-greeting":
      return withDialoguePhase(hostState, "open");
    case "open-npc-dialogue":
      return withDialoguePhase(hostState, "open");
    case "dismiss-dialogue":
      return withDialoguePhase(hostState, "idle");
    case "buy":
      return openTradeOverlay(hostState, "buy");
    case "sell":
      return openTradeOverlay(hostState, "sell");
    case "close-alert":
    case "close-trade":
    case "close-result":
      return withOverlay(hostState, null);
    case "investigate": {
      const result = investigateGrainMarket(
        hostState.gameState,
        hostState.characterDefinitions,
        playerCharacterId
      );
      return withOverlay(
        {
          gameState: result.mutation.state,
          characterDefinitions: result.mutation.characterDefinitions,
          grainShopSessionUi: hostState.grainShopSessionUi,
        },
        {
          type: "alert",
          title: "陈掌柜",
          bodyHtml: `
            <p>「${result.dialogue}」</p>
            <p class="c-grain-shop-rumor">传闻：${result.rumor}</p>
            <p class="c-grain-shop-price-hint">当前粮价约 ${result.grainPrice} 文/石。</p>
          `,
        }
      );
    }
    case "confirm-trade": {
      const overlay = hostState.grainShopSessionUi?.overlay;
      if (overlay?.type !== "trade") {
        return hostState;
      }

      const tradeResult = executeGrainTrade(
        hostState.gameState,
        hostState.characterDefinitions,
        playerCharacterId,
        overlay.mode,
        overlay.quantity,
        overlay.grainPrice
      );

      if (!tradeResult.ok) {
        return withOverlay(hostState, {
          type: "alert",
          title: tradeResult.errorTitle,
          bodyHtml: `<p>${tradeResult.errorMessage}</p>`,
        });
      }

      return withOverlay(
        {
          gameState: tradeResult.mutation.state,
          characterDefinitions: tradeResult.mutation.characterDefinitions,
          grainShopSessionUi: hostState.grainShopSessionUi,
        },
        {
          type: "alert",
          title: "成交",
          bodyHtml: `<p>${tradeResult.message}</p>`,
        }
      );
    }
    case "trade-qty-minus": {
      const overlay = hostState.grainShopSessionUi?.overlay;
      if (overlay?.type !== "trade") {
        return hostState;
      }
      return updateGrainShopTradeQuantity(hostState, overlay.quantity - 1);
    }
    case "trade-qty-plus": {
      const overlay = hostState.grainShopSessionUi?.overlay;
      if (overlay?.type !== "trade") {
        return hostState;
      }
      return updateGrainShopTradeQuantity(hostState, overlay.quantity + 1);
    }
    case "accounting": {
      stopAccountingTimer();
      const firstQuestion = generateLedgerQuestion();
      return withOverlay(hostState, {
        type: "minigame",
        score: 0,
        wrongCount: 0,
        secondsLeft: accountingGameDurationSec,
        question: firstQuestion,
      });
    }
    case "ledger-correct":
    case "ledger-wrong": {
      const overlay = hostState.grainShopSessionUi?.overlay;
      if (overlay?.type !== "minigame") {
        return hostState;
      }

      const playerSaysCorrect = action === "ledger-correct";
      const isCorrect = isLedgerAnswerCorrect(overlay.question, playerSaysCorrect);
      const nextScore = isCorrect ? overlay.score + 1 : overlay.score;
      const nextWrongCount = isCorrect ? overlay.wrongCount : overlay.wrongCount + 1;

      if (nextWrongCount >= accountingMaxWrongAnswers) {
        return finalizeAccountingMinigame(
          withOverlay(hostState, {
            ...overlay,
            score: nextScore,
            wrongCount: nextWrongCount,
          }),
          playerCharacterId
        );
      }

      return withOverlay(hostState, {
        ...overlay,
        score: nextScore,
        wrongCount: nextWrongCount,
        question: generateLedgerQuestion(),
      });
    }
    default:
      return hostState;
  }
}
