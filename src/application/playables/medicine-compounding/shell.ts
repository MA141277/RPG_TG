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
  CompoundingHerbSelection,
  CompoundingSessionTarget,
  MedicineHouseCompoundingGrade,
  MedicineHouseHerbDefinition,
} from "../../../domain/medicine-house";
import {
  addHerbSelection,
  getAvailableHerbsForSkill,
  pickCompoundingTarget,
  resolveCompoundingGrade,
} from "../../medicine-house/compounding-minigame";
import {
  getMedicineHouseFavorabilityVariableKey,
  getMedicineHouseTimeVariableKey,
} from "../../../domain/medicine-house";
import { getMedicineHouseContentDefaults } from "../../medicine-house/medicine-house-content-defaults";
import { ACTIVITY_COMPLETION_STAMINA_COST } from "../../player/player-stamina";
import { resolvePlayableResultRouting } from "../../../core/runtime/playable-result-routing";
import { getHouseMinigameDurationDays } from "../../house/house-activity-costs";

type MedicineCompoundingRuntimeConfig = {
  durationSec: number;
  maxTurns: number;
  staminaCost: number;
  rewardByGrade: Record<
    MedicineHouseCompoundingGrade,
    { medicine: number; relationship: number }
  >;
};

type MedicineCompoundingRuntimeContext = {
  playerCharacterId: string | null;
  playerStamina: number;
  medicineSkill: number;
  currentHouseId: string | null;
  variables: Record<string, number | string>;
};

type MedicineCompoundingProgressState = {
  target: CompoundingSessionTarget;
  availableHerbs: MedicineHouseHerbDefinition[];
  selections: CompoundingHerbSelection[];
  selectionsLeft: number;
  secondsLeft: number;
};

type MedicineCompoundingCompletionState = {
  outcome: "success" | "failure";
  factStatus: "completed" | "failed";
  grade: MedicineHouseCompoundingGrade;
  reward: {
    medicine: number;
    relationship: number;
  };
  durationDays: number;
  summaryLines: string[];
  rewardLines: string[];
  effects: Effect[];
  characterStatusById: CharacterStatusById;
};

type MedicineCompoundingSessionState = {
  launchPayload: Record<string, unknown>;
  runtimeContext: MedicineCompoundingRuntimeContext;
  runtimeConfig: MedicineCompoundingRuntimeConfig;
  progress?: MedicineCompoundingProgressState | undefined;
  completion?: MedicineCompoundingCompletionState | undefined;
};

export const medicineCompoundingPlayableShell: PlayableShell = {
  manifest: {
    playableId: "medicine-compounding",
    family: "minigame",
    commandPrefix: "playable.medicine-compounding.",
  },
  createSession(input) {
    const launchPayload = readLaunchPayload(input.payload);
    const runtimeContext = readRuntimeContext(launchPayload);
    const runtimeConfig = resolveRuntimeConfig(launchPayload);
    return {
      sessionId: "playable.medicine-compounding",
      playableId: input.playableId,
      integrationId: input.integrationId,
      ownerContext: input.ownerContext,
      status: "active",
      state: {
        launchPayload,
        runtimeContext,
        runtimeConfig,
        progress: {
          target: pickCompoundingTarget(runtimeContext.medicineSkill),
          availableHerbs: getAvailableHerbsForSkill(runtimeContext.medicineSkill),
          selections: [],
          selectionsLeft: runtimeConfig.maxTurns,
          secondsLeft: runtimeConfig.durationSec,
        },
      } satisfies MedicineCompoundingSessionState,
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

    if (command.actionId === "clear") {
      return writeSessionState(session, {
        ...state,
        progress: {
          ...state.progress,
          selections: [],
          selectionsLeft:
            state.progress.selectionsLeft + countSelections(state.progress.selections),
        },
      });
    }

    if (command.actionId === "finish") {
      return finalizeSession(session, state, state.progress);
    }

    if (!command.actionId.startsWith("select-herb:")) {
      return session;
    }

    if (state.progress.selectionsLeft <= 0) {
      return finalizeSession(session, state, state.progress);
    }

    const herbId = command.actionId.slice("select-herb:".length);
    if (herbId.length === 0) {
      return session;
    }

    const nextSelections = addHerbSelection(state.progress.selections, herbId);
    const nextSelectionsLeft = Math.max(0, state.progress.selectionsLeft - 1);
    const nextProgress: MedicineCompoundingProgressState = {
      ...state.progress,
      selections: nextSelections,
      selectionsLeft: nextSelectionsLeft,
    };

    if (nextSelectionsLeft <= 0) {
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
          durationDays: state.completion.durationDays,
          rewardMedicine: state.completion.reward.medicine,
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
  progress: MedicineCompoundingProgressState | null
): PlayablePresenterModel {
  const selectedLine =
    progress == null || progress.selections.length === 0
      ? "当前药材：未选择"
      : `当前药材：${progress.selections
          .map((selection) => `${selection.herbId} x${selection.amount}`)
          .join("，")}`;

  return {
    playableId: session.playableId,
    layout: "panel",
    title: "药材炼制",
    summaryLines: [
      `目标病症：${String(progress?.target.ailmentName ?? "")}`,
      `剩余选择 ${String(progress?.selectionsLeft ?? 0)} 次 / 剩余 ${String(
        progress?.secondsLeft ?? 0
      )} 秒`,
      selectedLine,
    ],
    actions: [
      ...((progress?.availableHerbs ?? []).map((herb) => ({
        id: `select-herb:${herb.id}`,
        label: herb.name,
        commandType: "custom" as const,
      })) satisfies PlayablePresenterModel["actions"]),
      {
        id: "clear",
        label: "清空已选",
        commandType: "custom",
      },
      {
        id: "finish",
        label: "完成炼制",
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
  completion: MedicineCompoundingCompletionState
): PlayablePresenterModel {
  return {
    playableId: session.playableId,
    layout: "panel",
    title: "药材炼制",
    summaryLines: [
      `评级：${completion.grade}`,
      ...completion.summaryLines,
      ...completion.rewardLines,
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
  state: MedicineCompoundingSessionState,
  progress: MedicineCompoundingProgressState
): ActivePlayableSession {
  return writeSessionState(
    {
      ...session,
      status: "completed",
    },
    {
      ...state,
      progress: undefined,
      completion: createCompletion(state, progress),
    }
  );
}

function createCompletion(
  state: MedicineCompoundingSessionState,
  progress: MedicineCompoundingProgressState
): MedicineCompoundingCompletionState {
  const gradeResult = resolveCompoundingGrade(
    progress.target,
    progress.selections,
    progress.availableHerbs
  );
  const reward = state.runtimeConfig.rewardByGrade[gradeResult.grade];
  const durationDays = getMedicineCompoundingDurationDays(
    state.runtimeContext.medicineSkill
  );
  const houseId = state.runtimeContext.currentHouseId ?? "house.unknown";
  const { medicineHouseDoctorProfile } = getMedicineHouseContentDefaults();
  const favorabilityKey = getMedicineHouseFavorabilityVariableKey(
    houseId,
    medicineHouseDoctorProfile.actorId
  );
  const timeKey = getMedicineHouseTimeVariableKey(houseId);
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
  const rewardLines = [
    reward.relationship === 0
      ? "好感 不变"
      : `好感 ${formatSignedNumber(reward.relationship)}`,
    reward.medicine === 0
      ? "医术 不变"
      : `医术 ${formatSignedNumber(reward.medicine)}`,
    `时间 +${durationDays}天`,
    `体力 -${state.runtimeConfig.staminaCost}`,
  ];
  const effects: Effect[] = [
    ...(reward.relationship === 0
      ? []
      : [
          {
            type: "setVariable" as const,
            key: favorabilityKey,
            value:
              readNumericVariable(state.runtimeContext.variables, favorabilityKey, 0) +
              reward.relationship,
          },
        ]),
    ...(playerCharacterId == null || reward.medicine === 0
      ? []
      : [
          {
            type: "mutateCharacterNumericAttribute" as const,
            characterId: playerCharacterId,
            semanticKey: "medicine",
            operation:
              reward.medicine >= 0 ? ("add" as const) : ("subtract" as const),
            value: Math.abs(reward.medicine),
          },
        ]),
    ...(durationDays === 0
      ? []
      : [
          {
            type: "setVariable" as const,
            key: timeKey,
            value:
              readNumericVariable(state.runtimeContext.variables, timeKey, 0) +
              durationDays,
          },
        ]),
  ];

  return {
    outcome: gradeResult.grade === "D" ? "failure" : "success",
    factStatus: gradeResult.grade === "D" ? "failed" : "completed",
    grade: gradeResult.grade,
    reward,
    durationDays,
    summaryLines: gradeResult.summaryLines,
    rewardLines,
    effects,
    characterStatusById,
  };
}

function readSessionState(
  session: ActivePlayableSession
): MedicineCompoundingSessionState | null {
  const state = session.state;
  if (state == null || typeof state !== "object" || Array.isArray(state)) {
    return null;
  }
  return state as MedicineCompoundingSessionState;
}

function writeSessionState(
  session: ActivePlayableSession,
  state: MedicineCompoundingSessionState
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
): MedicineCompoundingRuntimeConfig {
  const defaults = getMedicineHouseContentDefaults();
  return {
    durationSec: readPositiveInteger(
      launchPayload.durationSec,
      defaults.medicineHouseCompoundingBaseDurationSec
    ),
    maxTurns: readPositiveInteger(
      launchPayload.maxTurns,
      defaults.medicineHouseCompoundingBaseTurns
    ),
    staminaCost: readPositiveInteger(
      launchPayload.staminaCost,
      ACTIVITY_COMPLETION_STAMINA_COST
    ),
    rewardByGrade: {
      S: readRewardOverride(
        launchPayload,
        defaults.medicineHouseCompoundingGradeRewards.S,
        "S"
      ),
      A: readRewardOverride(
        launchPayload,
        defaults.medicineHouseCompoundingGradeRewards.A,
        "A"
      ),
      B: readRewardOverride(
        launchPayload,
        defaults.medicineHouseCompoundingGradeRewards.B,
        "B"
      ),
      C: readRewardOverride(
        launchPayload,
        defaults.medicineHouseCompoundingGradeRewards.C,
        "C"
      ),
      D: readRewardOverride(
        launchPayload,
        defaults.medicineHouseCompoundingGradeRewards.D,
        "D"
      ),
    },
  };
}

function readRewardOverride(
  launchPayload: Record<string, unknown>,
  defaults: { medicine: number; relationship: number },
  grade: MedicineHouseCompoundingGrade
): { medicine: number; relationship: number } {
  const suffix = grade;
  return {
    medicine: readFiniteNumber(
      launchPayload[`rewardMedicine${suffix}`],
      defaults.medicine
    ),
    relationship: readFiniteNumber(
      launchPayload[`rewardRelationship${suffix}`],
      defaults.relationship
    ),
  };
}

function readRuntimeContext(
  launchPayload: Record<string, unknown>
): MedicineCompoundingRuntimeContext {
  const runtimeContext = isRecord(launchPayload.__runtime)
    ? launchPayload.__runtime
    : null;
  const player = runtimeContext != null && isRecord(runtimeContext.player)
    ? runtimeContext.player
    : null;
  const world = runtimeContext != null && isRecord(runtimeContext.world)
    ? runtimeContext.world
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
    medicineSkill:
      typeof numericAttributes?.medicine === "number" &&
      Number.isFinite(numericAttributes.medicine)
        ? numericAttributes.medicine
        : 0,
    currentHouseId:
      typeof world?.currentHouseId === "string" ? world.currentHouseId : null,
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

function countSelections(selections: Array<{ amount: number }>): number {
  return selections.reduce(
    (total, selection) => total + Math.max(0, selection.amount),
    0
  );
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

function getMedicineCompoundingDurationDays(medicineSkill: number): number {
  const level = medicineSkill >= 9 ? 1 : medicineSkill >= 6 ? 2 : 3;
  return getHouseMinigameDurationDays(level);
}

function formatSignedNumber(value: number): string {
  return `${value >= 0 ? "+" : ""}${value}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}
