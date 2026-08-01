import type { CharacterDefinition } from "../../../../domain/character";
import type { Effect } from "../../../../core/contracts/effect";
import type {
  PlayableIntegrationId,
  PlayableOwnerContext,
} from "../../../../core/contracts/playable-runtime";
import type { HouseActivityConfirmOverlayState } from "../../../../domain/house-activity";
import type {
  AccountingGrade,
  AccountingGradeReward,
  GrainShopTradeMode,
  LedgerQuestion,
} from "../../../../domain/grain-shop";
import type { RuntimeState } from "../../../../core/contracts/runtime-state";
import type { CharacterStatusById } from "../../../../domain/character-status";
import { mergeCharacterStatusById } from "../../../../domain/character-status";
import { assertExists } from "../../../../shared/assert";
import {
  convertHouseActivityDaysToSegments,
  getHouseMinigameDurationDays,
} from "../../../house/house-activity-costs";
import { readNumericPersonAttributeBySemanticKey } from "../../../character/person-attribute-runtime";
import {
  generateLedgerQuestion,
  isLedgerAnswerCorrect,
  resolveAccountingGrade,
} from "../../../grain-shop/accounting-minigame";
import { getGrainShopContentDefaults } from "../../../grain-shop/grain-shop-content-defaults";
import { GRAIN_SHOP_VARIABLE_KEYS as GRAIN_SHOP_RUNTIME_KEYS } from "../../../../domain/grain-shop";
import {
  pickNpcDefaultLine,
  pickNpcGreeting,
} from "../../../grain-shop/grain-market";
import { ACTIVITY_COMPLETION_STAMINA_COST } from "../../../player/player-stamina";

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

type GrainAccountingSettlement = {
  outcome: "success" | "failure";
  factStatus: "completed" | "failed";
  score: number;
  grade: AccountingGrade;
  reward: AccountingGradeReward;
  durationDays: number;
  effects: Effect[];
  characterStatusById: CharacterStatusById;
};

type GrainAccountingRuntimeConfig = {
  durationSec: number;
  maxWrongAnswers: number;
  staminaCost: number;
  rewardByGrade: Record<AccountingGrade, AccountingGradeReward>;
};

function getActiveSession(state: RuntimeState): GrainShopSessionState | null {
  const houseSession = state.core.ui.houseSession;
  if (houseSession?.moduleId !== "grain-shop") {
    return null;
  }

  return houseSession.state as GrainShopSessionState;
}

function readLaunchPayload(state: RuntimeState): Record<string, unknown> {
  const sessionState = state.core.runtime.playableSession?.state;
  if (
    sessionState == null ||
    typeof sessionState !== "object" ||
    Array.isArray(sessionState)
  ) {
    return {};
  }
  const launchPayload = (sessionState as Record<string, unknown>).launchPayload;
  return launchPayload != null &&
    typeof launchPayload === "object" &&
    !Array.isArray(launchPayload)
    ? (launchPayload as Record<string, unknown>)
    : {};
}

function readPositiveInteger(
  value: unknown,
  fallback: number
): number {
  return typeof value === "number" &&
    Number.isFinite(value) &&
    Math.floor(value) > 0
    ? Math.floor(value)
    : fallback;
}

function readFiniteNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function readRewardOverride(
  launchPayload: Record<string, unknown>,
  defaults: AccountingGradeReward,
  grade: AccountingGrade
): AccountingGradeReward {
  const suffix = grade;
  return {
    money: readFiniteNumber(
      launchPayload[`rewardMoney${suffix}`],
      defaults.money
    ),
    math: readFiniteNumber(
      launchPayload[`rewardMath${suffix}`],
      defaults.math
    ),
    relationship: readFiniteNumber(
      launchPayload[`rewardRelationship${suffix}`],
      defaults.relationship
    ),
  };
}

function resolveRuntimeConfigFromPayload(
  launchPayload: Record<string, unknown>
): GrainAccountingRuntimeConfig {
  const defaults = getGrainShopContentDefaults();
  return {
    durationSec: readPositiveInteger(
      launchPayload.durationSec,
      defaults.accountingGameDurationSec
    ),
    maxWrongAnswers: readPositiveInteger(
      launchPayload.maxWrongAnswers,
      defaults.accountingMaxWrongAnswers
    ),
    staminaCost: readPositiveInteger(
      launchPayload.staminaCost,
      ACTIVITY_COMPLETION_STAMINA_COST
    ),
    rewardByGrade: {
      S: readRewardOverride(
        launchPayload,
        defaults.accountingGradeRewards.S,
        "S"
      ),
      A: readRewardOverride(
        launchPayload,
        defaults.accountingGradeRewards.A,
        "A"
      ),
      B: readRewardOverride(
        launchPayload,
        defaults.accountingGradeRewards.B,
        "B"
      ),
      C: readRewardOverride(
        launchPayload,
        defaults.accountingGradeRewards.C,
        "C"
      ),
      D: readRewardOverride(
        launchPayload,
        defaults.accountingGradeRewards.D,
        "D"
      ),
    },
  };
}

function resolveRuntimeConfig(state: RuntimeState): GrainAccountingRuntimeConfig {
  return resolveRuntimeConfigFromPayload(readLaunchPayload(state));
}

function createExternalSession(): GrainShopSessionState {
  return {
    npcGreeting: pickNpcGreeting(),
    npcDefaultLine: pickNpcDefaultLine(),
    dialoguePhase: "open",
    overlay: null,
  };
}

function readNumericVariable(
  state: RuntimeState["core"],
  key: string,
  fallback: number
): number {
  const value = state.runtime.variables[key];
  return typeof value === "number" ? value : fallback;
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
  integrationId?: PlayableIntegrationId | undefined;
  ownerContext?: PlayableOwnerContext | undefined;
  launchPayload?: Record<string, unknown>;
}): RuntimeState {
  const runtimeConfig = resolveRuntimeConfigFromPayload(
    input.launchPayload ?? {}
  );
  const sessionState = getActiveSession(input.state) ?? createExternalSession();

  const nextState = withSessionState(input.state, {
    ...sessionState,
    overlay: {
      type: "minigame",
      score: 0,
      wrongCount: 0,
      secondsLeft: runtimeConfig.durationSec,
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
          integrationId:
            input.integrationId ?? "playable.grain-accounting.house.grain-shop",
          ownerContext:
            input.ownerContext ?? {
              ownerKind: "house",
              ownerId: input.ownerId,
              returnPolicy: "resume-owner",
            },
          status: "active",
          state: {
            launchPayload: input.launchPayload ?? {},
          },
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
  settlement?: GrainAccountingSettlement;
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
  settlement?: GrainAccountingSettlement;
} {
  const runtimeConfig = resolveRuntimeConfig(input.state);
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

  if (nextWrongCount >= runtimeConfig.maxWrongAnswers) {
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
  settlement?: GrainAccountingSettlement;
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
  const reward = resolveRuntimeConfig(input.state).rewardByGrade[grade];
  const playerCharacter = input.characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === input.playerCharacterId
  );
  assertExists(
    playerCharacter,
    `Player character not found for id "${input.playerCharacterId}" in grain accounting settlement.`
  );
  const nextRelationship =
    readNumericVariable(
      input.state.core,
      GRAIN_SHOP_RUNTIME_KEYS.relationship,
      0
    ) + reward.relationship;
  const nextGrainShopTime =
    readNumericVariable(input.state.core, GRAIN_SHOP_RUNTIME_KEYS.time, 1) +
    Math.max(0, durationDays);
  const characterStatusById = mergeCharacterStatusById(
    {},
    input.playerCharacterId,
    {
      stamina: Math.max(
        0,
        playerCharacter.stamina - resolveRuntimeConfig(input.state).staminaCost
      ),
    }
  );
  const settlement: GrainAccountingSettlement = {
    outcome: grade === "D" ? "failure" : "success",
    factStatus: grade === "D" ? "failed" : "completed",
    score: overlay.score,
    grade,
    reward,
    durationDays,
    effects: [
      ...(reward.money === 0
        ? []
        : [
            {
              type: "mutateCharacterNumericAttribute" as const,
              characterId: input.playerCharacterId,
              semanticKey: "gold",
              operation: reward.money >= 0 ? ("add" as const) : ("subtract" as const),
              value: Math.abs(reward.money),
            },
          ]),
      ...(reward.math === 0
        ? []
        : [
            {
              type: "mutateCharacterNumericAttribute" as const,
              characterId: input.playerCharacterId,
              semanticKey: "arithmetic",
              operation: reward.math >= 0 ? ("add" as const) : ("subtract" as const),
              value: Math.abs(reward.math),
            },
          ]),
      {
        type: "setVariable",
        key: GRAIN_SHOP_RUNTIME_KEYS.relationship,
        value: nextRelationship,
      },
      {
        type: "setVariable",
        key: GRAIN_SHOP_RUNTIME_KEYS.time,
        value: nextGrainShopTime,
      },
    ],
    characterStatusById,
  };

  return {
    state: {
      ...withSessionState(input.state, {
        ...sessionState,
        overlay: {
          type: "result",
          grade,
          score: overlay.score,
          reward,
          durationDays,
        },
      }),
      core: {
        ...input.state.core,
        ui: {
          ...input.state.core.ui,
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
          ...input.state.core.runtime,
          playableSession: null,
        },
      },
    },
    characterDefinitions: input.characterDefinitions,
    settlement,
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
