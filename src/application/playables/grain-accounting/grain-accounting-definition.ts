import type { CharacterDefinition } from "../../../domain/character";
import type { CharacterStatusById } from "../../../domain/character-status";
import type { GrainShopSessionState } from "../../../domain/house-modules/grain-shop-session";
import type { RuntimeState } from "../../../core/contracts/runtime-state";
import {
  accountingGameDurationSec,
  accountingMaxWrongAnswers,
} from "../../../content/houses/grain-shop-content";
import { assertExists } from "../../../shared/assert";
import {
  convertHouseActivityDaysToSegments,
  getHouseMinigameDurationDays,
} from "../../house/house-activity-costs";
import { applyAccountingReward } from "../../grain-shop/apply-accounting-reward";
import {
  generateLedgerQuestion,
  getAccountingGradeReward,
  isLedgerAnswerCorrect,
  resolveAccountingGrade,
} from "../../grain-shop/accounting-minigame";

function getActiveSession(state: RuntimeState): GrainShopSessionState | null {
  const houseSession = state.core.ui.houseSession;
  if (houseSession?.moduleId !== "grain-shop") {
    return null;
  }

  return houseSession.state;
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
  return Math.max(0, playerCharacter.skills?.arithmetic ?? 0);
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
  const sessionState = getActiveSession(input.state);
  if (sessionState == null) {
    return input.state;
  }

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
  characterStatusById?: CharacterStatusById;
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
  characterStatusById?: CharacterStatusById;
} {
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
  characterStatusById?: CharacterStatusById;
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
    ...(mutation.characterStatusById == null
      ? {}
      : { characterStatusById: mutation.characterStatusById }),
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
