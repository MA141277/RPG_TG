import type { CharacterStatusById } from "../../../domain/character-status";
import type { Effect } from "../../../core/contracts/effect";
import type {
  ActivePlayableSession,
  PlayableCommand,
  PlayableLaunchRequest,
  PlayablePresenterModel,
  PlayableShell,
} from "../../../core/contracts/playable-runtime";
import { mergeCharacterStatusById } from "../../../domain/character-status";
import type {
  AccountingGrade,
  AccountingGradeReward,
  LedgerQuestion,
} from "../../../domain/grain-shop";
import {
  generateLedgerQuestion,
  isLedgerAnswerCorrect,
  resolveAccountingGrade,
} from "../../grain-shop/accounting-minigame";
import { getGrainShopContentDefaults } from "../../grain-shop/grain-shop-content-defaults";
import { GRAIN_SHOP_VARIABLE_KEYS } from "../../../domain/grain-shop";
import { GRAIN_ACCOUNTING_TEXT } from "../builtin/grain-accounting/texts";
import { ACTIVITY_COMPLETION_STAMINA_COST } from "../../player/player-stamina";
import { resolvePlayableResultRouting } from "../../../core/runtime/playable-result-routing";
import { getHouseMinigameDurationDays } from "../../house/house-activity-costs";

type GrainAccountingRuntimeConfig = {
  durationSec: number;
  maxWrongAnswers: number;
  staminaCost: number;
  rewardByGrade: Record<AccountingGrade, AccountingGradeReward>;
};

type GrainAccountingRuntimeContext = {
  playerCharacterId: string | null;
  playerStamina: number;
  arithmeticSkill: number;
  variables: Record<string, number | string>;
};

type GrainAccountingProgressState = {
  score: number;
  wrongCount: number;
  secondsLeft: number;
  question: LedgerQuestion;
};

type GrainAccountingCompletionState = {
  outcome: "success" | "failure";
  factStatus: "completed" | "failed";
  grade: AccountingGrade;
  score: number;
  reward: AccountingGradeReward;
  durationDays: number;
  effects: Effect[];
  characterStatusById: CharacterStatusById;
};

type GrainAccountingSessionState = {
  launchPayload: Record<string, unknown>;
  runtimeContext: GrainAccountingRuntimeContext;
  runtimeConfig: GrainAccountingRuntimeConfig;
  progress?: GrainAccountingProgressState | undefined;
  completion?: GrainAccountingCompletionState | undefined;
};

export const grainAccountingPlayableShell: PlayableShell = {
  manifest: {
    playableId: "grain-accounting",
    family: "minigame",
    commandPrefix: "playable.grain-accounting.",
  },
  createSession(input) {
    const launchPayload = readLaunchPayload(input.payload);
    const runtimeConfig = resolveRuntimeConfig(launchPayload);
    return {
      sessionId: "playable.grain-accounting",
      playableId: input.playableId,
      integrationId: input.integrationId,
      ownerContext: input.ownerContext,
      status: "active",
      state: {
        launchPayload,
        runtimeContext: readRuntimeContext(launchPayload),
        runtimeConfig,
        progress: {
          score: 0,
          wrongCount: 0,
          secondsLeft: runtimeConfig.durationSec,
          question: generateLedgerQuestion(),
        },
      } satisfies GrainAccountingSessionState,
    };
  },
  reduce(session, command) {
    const state = readSessionState(session);
    if (state == null) {
      return session;
    }

    if (command.type === "cancel") {
      return {
        ...session,
        status: "cancelled",
      };
    }

    if (session.status !== "active" || state.progress == null) {
      return session;
    }

    if (command.type !== "custom") {
      return session;
    }

    if (command.actionId === "tick") {
      if (state.progress.secondsLeft <= 1) {
        return finalizeSession(session, state, state.progress);
      }
      return writeSessionState(session, {
        ...state,
        progress: {
          ...state.progress,
          secondsLeft: state.progress.secondsLeft - 1,
        },
      });
    }

    if (
      command.actionId !== "answer-correct" &&
      command.actionId !== "answer-wrong"
    ) {
      return session;
    }

    const playerSaysCorrect = command.actionId === "answer-correct";
    const isCorrect = isLedgerAnswerCorrect(
      state.progress.question,
      playerSaysCorrect
    );
    const nextProgress: GrainAccountingProgressState = {
      score: isCorrect ? state.progress.score + 1 : state.progress.score,
      wrongCount: isCorrect
        ? state.progress.wrongCount
        : state.progress.wrongCount + 1,
      secondsLeft: state.progress.secondsLeft,
      question: generateLedgerQuestion(),
    };

    if (nextProgress.wrongCount >= state.runtimeConfig.maxWrongAnswers) {
      return finalizeSession(session, state, nextProgress);
    }

    return writeSessionState(session, {
      ...state,
      progress: nextProgress,
    });
  },
  present(session) {
    const state = readSessionState(session);
    if (state?.completion != null) {
      return createResultPresenter(session, state.completion);
    }
    return createActivePresenter(session, state?.progress ?? null);
  },
  complete(session) {
    const state = readSessionState(session);
    if (session.status === "cancelled") {
      return resolvePlayableResultRouting({
        session,
        outcome: "cancelled",
        factResult: {
          status: "cancelled",
        },
      });
    }
    if (state?.completion == null) {
      return null;
    }
    return resolvePlayableResultRouting({
      session,
      outcome: state.completion.outcome,
      factResult: {
        status: state.completion.factStatus,
        metrics: {
          score: state.completion.score,
          durationDays: state.completion.durationDays,
          rewardMoney: state.completion.reward.money,
          rewardMath: state.completion.reward.math,
          rewardRelationship: state.completion.reward.relationship,
        },
        detail: {
          grade: state.completion.grade,
        },
      },
      settlementEffects: state.completion.effects,
    });
  },
};

function createActivePresenter(
  session: ActivePlayableSession,
  progress: GrainAccountingProgressState | null
): PlayablePresenterModel {
  const question = progress?.question ?? {};
  return {
    playableId: session.playableId,
    layout: "panel",
    title: GRAIN_ACCOUNTING_TEXT.title,
    summaryLines: [
      GRAIN_ACCOUNTING_TEXT.describeTrade(question),
      GRAIN_ACCOUNTING_TEXT.describeDisplayedStock(question),
      GRAIN_ACCOUNTING_TEXT.describeScore({
        score: progress?.score ?? 0,
        wrongCount: progress?.wrongCount ?? 0,
        secondsLeft: progress?.secondsLeft ?? 0,
      }),
    ],
    actions: [
      {
        id: "answer-correct",
        label: GRAIN_ACCOUNTING_TEXT.answerCorrect,
        commandType: "custom",
      },
      {
        id: "answer-wrong",
        label: GRAIN_ACCOUNTING_TEXT.answerWrong,
        commandType: "custom",
      },
    ],
    detail: {
      autoTickMs: 1000,
    },
  };
}

function createResultPresenter(
  session: ActivePlayableSession,
  completion: GrainAccountingCompletionState
): PlayablePresenterModel {
  const rewardLine = `银两 ${formatSignedNumber(
    completion.reward.money
  )} / 算术 ${formatSignedNumber(
    completion.reward.math
  )} / 关系 ${formatSignedNumber(completion.reward.relationship)}`;
  return {
    playableId: session.playableId,
    layout: "panel",
    title: GRAIN_ACCOUNTING_TEXT.title,
    summaryLines: [
      `评级：${completion.grade}`,
      `得分：${completion.score}`,
      rewardLine,
      `耗时 ${completion.durationDays} 天`,
    ],
    actions: [
      {
        id: "close-result",
        label: "收起结果",
        commandType: "custom",
      },
    ],
  };
}

function finalizeSession(
  session: ActivePlayableSession,
  state: GrainAccountingSessionState,
  progress: GrainAccountingProgressState
): ActivePlayableSession {
  const completion = createCompletion(state, progress);
  return writeSessionState(
    {
      ...session,
      status: "completed",
    },
    {
      ...state,
      progress: undefined,
      completion,
    }
  );
}

function createCompletion(
  state: GrainAccountingSessionState,
  progress: GrainAccountingProgressState
): GrainAccountingCompletionState {
  const durationDays = resolveGrainAccountingDurationDays(
    state.runtimeContext.arithmeticSkill
  );
  const grade = resolveAccountingGrade(progress.score);
  const reward = state.runtimeConfig.rewardByGrade[grade];
  const playerCharacterId = state.runtimeContext.playerCharacterId;
  const characterStatusById =
    playerCharacterId == null
      ? {}
      : mergeCharacterStatusById({}, playerCharacterId, {
          stamina: Math.max(
            0,
            state.runtimeContext.playerStamina - state.runtimeConfig.staminaCost
          ),
        });
  const nextRelationship =
    readNumericVariable(
      state.runtimeContext.variables,
      GRAIN_SHOP_VARIABLE_KEYS.relationship,
      0
    ) + reward.relationship;
  const nextTime =
    readNumericVariable(
      state.runtimeContext.variables,
      GRAIN_SHOP_VARIABLE_KEYS.time,
      1
    ) + Math.max(0, durationDays);

  const effects: Effect[] = [
    ...(playerCharacterId == null || reward.money === 0
      ? []
      : [
          {
            type: "mutateCharacterNumericAttribute" as const,
            characterId: playerCharacterId,
            semanticKey: "gold",
            operation: reward.money >= 0 ? ("add" as const) : ("subtract" as const),
            value: Math.abs(reward.money),
          },
        ]),
    ...(playerCharacterId == null || reward.math === 0
      ? []
      : [
          {
            type: "mutateCharacterNumericAttribute" as const,
            characterId: playerCharacterId,
            semanticKey: "arithmetic",
            operation: reward.math >= 0 ? ("add" as const) : ("subtract" as const),
            value: Math.abs(reward.math),
          },
        ]),
    {
      type: "setVariable",
      key: GRAIN_SHOP_VARIABLE_KEYS.relationship,
      value: nextRelationship,
    },
    {
      type: "setVariable",
      key: GRAIN_SHOP_VARIABLE_KEYS.time,
      value: nextTime,
    },
  ];

  return {
    outcome: grade === "D" ? "failure" : "success",
    factStatus: grade === "D" ? "failed" : "completed",
    grade,
    score: progress.score,
    reward,
    durationDays,
    effects,
    characterStatusById,
  };
}

function readSessionState(
  session: ActivePlayableSession
): GrainAccountingSessionState | null {
  const state = session.state;
  if (state == null || typeof state !== "object" || Array.isArray(state)) {
    return null;
  }
  return state as GrainAccountingSessionState;
}

function writeSessionState(
  session: ActivePlayableSession,
  state: GrainAccountingSessionState
): ActivePlayableSession {
  return {
    ...session,
    state,
  };
}

function readLaunchPayload(
  payload: Record<string, unknown> | undefined
): Record<string, unknown> {
  return payload == null ? {} : payload;
}

function resolveRuntimeConfig(
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

function readRewardOverride(
  launchPayload: Record<string, unknown>,
  defaults: AccountingGradeReward,
  grade: AccountingGrade
): AccountingGradeReward {
  const suffix = grade;
  return {
    money: readFiniteNumber(launchPayload[`rewardMoney${suffix}`], defaults.money),
    math: readFiniteNumber(launchPayload[`rewardMath${suffix}`], defaults.math),
    relationship: readFiniteNumber(
      launchPayload[`rewardRelationship${suffix}`],
      defaults.relationship
    ),
  };
}

function readRuntimeContext(
  launchPayload: Record<string, unknown>
): GrainAccountingRuntimeContext {
  const runtimeContext = isRecord(launchPayload.__runtime)
    ? launchPayload.__runtime
    : null;
  const player = runtimeContext != null && isRecord(runtimeContext.player)
    ? runtimeContext.player
    : null;
  const numericAttributes =
    player != null && isRecord(player.numericAttributes)
      ? player.numericAttributes
      : null;
  return {
    playerCharacterId:
      typeof player?.characterId === "string" ? player.characterId : null,
    playerStamina:
      typeof player?.stamina === "number" && Number.isFinite(player.stamina)
        ? player.stamina
        : 0,
    arithmeticSkill: Math.max(
      1,
      typeof numericAttributes?.arithmetic === "number" &&
        Number.isFinite(numericAttributes.arithmetic)
        ? numericAttributes.arithmetic
        : 1
    ),
    variables:
      runtimeContext != null && isRecord(runtimeContext.variables)
        ? (Object.fromEntries(
            Object.entries(runtimeContext.variables).filter(
              ([, value]) =>
                typeof value === "string" ||
                (typeof value === "number" && Number.isFinite(value))
            )
          ) as Record<string, number | string>)
        : {},
  };
}

function readPositiveInteger(value: unknown, fallback: number): number {
  return typeof value === "number" &&
    Number.isFinite(value) &&
    Math.floor(value) > 0
    ? Math.floor(value)
    : fallback;
}

function readFiniteNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function readNumericVariable(
  variables: Record<string, number | string>,
  key: string,
  fallback: number
): number {
  const value = variables[key];
  return typeof value === "number" ? value : fallback;
}

function resolveGrainAccountingDurationDays(arithmeticSkill: number): number {
  const level = arithmeticSkill >= 9 ? 1 : arithmeticSkill >= 6 ? 2 : 3;
  return getHouseMinigameDurationDays(level);
}

function formatSignedNumber(value: number): string {
  return `${value >= 0 ? "+" : ""}${value}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}
