import type { CharacterDefinition } from "../../../domain/character";
import type { HouseActivityConfirmOverlayState } from "../../../domain/house-activity";
import type {
  AccountingGrade,
  AccountingGradeReward,
  GrainShopTradeMode,
  LedgerQuestion,
} from "../../../domain/grain-shop";
import type { RuntimeState } from "../../../core/contracts/runtime-state";
import { assertExists } from "../../../shared/assert";
import {
  convertHouseActivityDaysToSegments,
  getHouseMinigameDurationDays,
} from "../../house/house-activity-costs";
import { readNumericPersonAttributeBySemanticKey } from "../../character/person-attribute-runtime";
import { applyAccountingReward } from "../../grain-shop/apply-accounting-reward";
import {
  generateLedgerQuestion,
  getAccountingGradeReward,
  isLedgerAnswerCorrect,
  resolveAccountingGrade,
} from "../../grain-shop/accounting-minigame";
import { getGrainShopContentDefaults } from "../../grain-shop/grain-shop-content-defaults";
import {
  pickNpcDefaultLine,
  pickNpcGreeting,
} from "../../grain-shop/grain-market";

type GrainShopOverlayState =
  | {
      type: "alert";
      title: string;
      paragraphs: string[];
      tone?: "info" | "success" | "warning";
    }
  | HouseActivityConfirmOverlayState
  | {
      type: "trade";
      mode: GrainShopTradeMode;
      quantity: number;
      grainPrice: number;
      tradeTotal: number;
    }
  | {
      type: "minigame";
      score: number;
      wrongCount: number;
      secondsLeft: number;
      question: LedgerQuestion;
    }
  | {
      type: "result";
      grade: AccountingGrade;
      score: number;
      reward: AccountingGradeReward;
      durationDays: number;
    }
  | null;

type GrainShopSessionState = {
  npcGreeting: string;
  npcDefaultLine: string;
  dialoguePhase: "greeting" | "open" | "idle";
  overlay: GrainShopOverlayState;
};

function getActiveSession(state: RuntimeState): GrainShopSessionState | null {
  const houseSession = state.core.ui.houseSession;
  if (houseSession?.moduleId !== "grain-shop") {
    return null;
  }

  return houseSession.state as GrainShopSessionState;
}

function createExternalSession(): GrainShopSessionState {
  return {
    npcGreeting: pickNpcGreeting(),
    npcDefaultLine: pickNpcDefaultLine(),
    dialoguePhase: "open",
    overlay: null,
  };
}

function getPlayerArithmeticSkill(
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string
): number {
  const playerCharacter = characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assertExists(
    playerCharacter,
    `Player character not found for id "${playerCharacterId}" in grain accounting playable.`
  );
  return Math.max(
    1,
    readNumericPersonAttributeBySemanticKey(playerCharacter, "arithmetic", 1)
  );
}

function withSessionState(
  state: RuntimeState,
  sessionState: GrainShopSessionState
): RuntimeState {
  return {
    ...state,
    core: {
      ...state.core,
      ui: {
        ...state.core.ui,
        houseSession: {
          moduleId: "grain-shop",
          state: sessionState,
        },
      },
    },
  };
}

export function launchGrainAccountingPlayable(input: {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
  playerCharacterId: string;
  ownerId: string | null;
}): RuntimeState {
  const { accountingGameDurationSec } = getGrainShopContentDefaults();
  const sessionState = getActiveSession(input.state) ?? createExternalSession();

  const nextState = withSessionState(input.state, {
    ...sessionState,
    overlay: {
      type: "minigame",
      score: 0,
      wrongCount: 0,
      secondsLeft: accountingGameDurationSec,
      question: generateLedgerQuestion(),
    },
  });

  return {
    ...nextState,
    core: {
      ...nextState.core,
      runtime: {
        ...nextState.core.runtime,
        playableSession: {
          sessionId: "playable.grain-accounting",
          playableId: "grain-accounting",
          integrationId: "playable.grain-accounting.house.grain-shop",
          family: "minigame",
          ownerContext: {
            ownerKind: "house",
            ownerId: input.ownerId,
            returnPolicy: "resume-owner",
          },
          status: "active",
        },
      },
    },
  };
}

export function tickGrainAccountingPlayable(input: {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
  playerCharacterId: string;
}): {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
} {
  const sessionState = getActiveSession(input.state);
  const overlay = sessionState?.overlay;
  if (sessionState == null || overlay?.type !== "minigame") {
    return {
      state: input.state,
      characterDefinitions: input.characterDefinitions,
    };
  }

  if (overlay.secondsLeft <= 1) {
    return settleGrainAccountingPlayable(input);
  }

  return {
    state: withSessionState(input.state, {
      ...sessionState,
      overlay: {
        ...overlay,
        secondsLeft: overlay.secondsLeft - 1,
      },
    }),
    characterDefinitions: input.characterDefinitions,
  };
}

export function answerGrainAccountingPlayable(input: {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
  playerCharacterId: string;
  playerSaysCorrect: boolean;
}): {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
} {
  const { accountingMaxWrongAnswers } = getGrainShopContentDefaults();
  const sessionState = getActiveSession(input.state);
  const overlay = sessionState?.overlay;
  if (sessionState == null || overlay?.type !== "minigame") {
    return {
      state: input.state,
      characterDefinitions: input.characterDefinitions,
    };
  }

  const isCorrect = isLedgerAnswerCorrect(
    overlay.question,
    input.playerSaysCorrect
  );
  const nextScore = isCorrect ? overlay.score + 1 : overlay.score;
  const nextWrongCount = isCorrect ? overlay.wrongCount : overlay.wrongCount + 1;

  if (nextWrongCount >= accountingMaxWrongAnswers) {
    return settleGrainAccountingPlayable({
      ...input,
      state: withSessionState(input.state, {
        ...sessionState,
        overlay: {
          ...overlay,
          score: nextScore,
          wrongCount: nextWrongCount,
        },
      }),
    });
  }

  return {
    state: withSessionState(input.state, {
      ...sessionState,
      overlay: {
        ...overlay,
        score: nextScore,
        wrongCount: nextWrongCount,
        question: generateLedgerQuestion(),
      },
    }),
    characterDefinitions: input.characterDefinitions,
  };
}

export function settleGrainAccountingPlayable(input: {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
  playerCharacterId: string;
}): {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
} {
  const sessionState = getActiveSession(input.state);
  const overlay = sessionState?.overlay;
  if (sessionState == null || overlay?.type !== "minigame") {
    return {
      state: input.state,
      characterDefinitions: input.characterDefinitions,
    };
  }

  const durationDays = getHouseMinigameDurationDays(
    getPlayerArithmeticSkill(
      input.characterDefinitions,
      input.playerCharacterId
    )
  );
  const grade = resolveAccountingGrade(overlay.score);
  const reward = getAccountingGradeReward(grade);
  const mutation = applyAccountingReward(
    input.state.core,
    input.characterDefinitions,
    input.playerCharacterId,
    grade,
    durationDays
  );

  return {
    state: {
      ...withSessionState(
        {
          ...input.state,
          core: mutation.state,
        },
        {
          ...sessionState,
          overlay: {
            type: "result",
            grade,
            score: overlay.score,
            reward,
            durationDays,
          },
        }
      ),
      core: {
        ...mutation.state,
        ui: {
          ...mutation.state.ui,
          houseSession: {
            moduleId: "grain-shop",
            state: {
              ...sessionState,
              overlay: {
                type: "result",
                grade,
                score: overlay.score,
                reward,
                durationDays,
              },
            },
          },
        },
        runtime: {
          ...mutation.state.runtime,
          playableSession: null,
        },
      },
    },
    characterDefinitions: mutation.characterDefinitions,
  };
}

export function exitGrainAccountingPlayable(state: RuntimeState): RuntimeState {
  const sessionState = getActiveSession(state);
  const nextState =
    sessionState?.overlay?.type === "minigame"
      ? withSessionState(state, {
          ...sessionState,
          overlay: null,
        })
      : state;

  return {
    ...nextState,
    core: {
      ...nextState.core,
      runtime: {
        ...nextState.core.runtime,
        playableSession: null,
      },
    },
  };
}

export function getGrainAccountingTimeAdvanceCost(
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string
): number {
  return convertHouseActivityDaysToSegments(
    getHouseMinigameDurationDays(
      getPlayerArithmeticSkill(characterDefinitions, playerCharacterId)
    )
  );
}
