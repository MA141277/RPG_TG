import type { CharacterDefinition } from "../../../domain/character";
import type { Effect } from "../../../core/contracts/effect";
import type {
  PlayableIntegrationId,
  PlayableOwnerContext,
} from "../../../core/contracts/playable-runtime";
import type { CharacterStatusById } from "../../../domain/character-status";
import type { HouseActivityConfirmOverlayState } from "../../../domain/house-activity";
import type { MedicineHouseActionOutcome } from "../../../domain/medicine-house";
import type {
  CompoundingHerbSelection,
  CompoundingSessionTarget,
  MedicineHouseCompoundingGrade,
  MedicineHouseHerbDefinition,
} from "../../../domain/medicine-house";
import type { RuntimeState } from "../../../core/contracts/runtime-state";
import { mergeCharacterStatusById } from "../../../domain/character-status";
import {
  getMedicineHouseFavorabilityVariableKey,
  getMedicineHouseTimeVariableKey,
} from "../../../domain/medicine-house";
import { assertExists } from "../../../shared/assert";
import {
  convertHouseActivityDaysToSegments,
  getHouseMinigameDurationDays,
} from "../../house/house-activity-costs";
import { readNumericPersonAttributeBySemanticKey } from "../../character/person-attribute-runtime";
import { getMedicineHouseContentDefaults } from "../../medicine-house/medicine-house-content-defaults";
import {
  addHerbSelection,
  getAvailableHerbsForSkill,
  getCompoundingLimits,
  pickCompoundingTarget,
  resolveCompoundingGrade,
} from "../../medicine-house/compounding-minigame";
import {
  ACTIVITY_COMPLETION_STAMINA_COST,
} from "../../player/player-stamina";

type MedicineHouseOverlayState =
  | {
      type: "alert";
      title: string;
      paragraphs: string[];
      tone?: "info" | "success" | "warning";
    }
  | HouseActivityConfirmOverlayState
  | {
      type: "buy";
      selectedItemId: string | null;
    }
  | {
      type: "compounding";
      target: CompoundingSessionTarget;
      availableHerbs: MedicineHouseHerbDefinition[];
      selections: CompoundingHerbSelection[];
      selectionsLeft: number;
      secondsLeft: number;
    }
  | {
      type: "result";
      grade: MedicineHouseCompoundingGrade;
      summaryLines: string[];
      rewardLines: string[];
    }
  | null;

type MedicineHouseSessionState = {
  npcGreeting: string;
  dialoguePhase: "greeting" | "open" | "idle";
  overlay: MedicineHouseOverlayState;
};

type MedicineCompoundingSettlement = {
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

type MedicineCompoundingRuntimeConfig = {
  durationSec: number;
  maxTurns: number;
  staminaCost: number;
  rewardByGrade: Record<
    MedicineHouseCompoundingGrade,
    { medicine: number; relationship: number }
  >;
};

function countSelections(
  selections: Array<{ amount: number }>
): number {
  return selections.reduce(
    (total, selection) => total + Math.max(0, selection.amount),
    0
  );
}

function getActiveSession(state: RuntimeState): MedicineHouseSessionState | null {
  const houseSession = state.core.ui.houseSession;
  if (houseSession?.moduleId !== "medicine-house") {
    return null;
  }

  return houseSession.state as MedicineHouseSessionState;
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

function resolveRuntimeConfigFromPayload(
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

function resolveRuntimeConfig(state: RuntimeState): MedicineCompoundingRuntimeConfig {
  return resolveRuntimeConfigFromPayload(readLaunchPayload(state));
}

function readNumericVariable(
  state: RuntimeState["core"],
  key: string,
  fallback: number
): number {
  const value = state.runtime.variables[key];
  return typeof value === "number" ? value : fallback;
}

function createExternalSession(): MedicineHouseSessionState {
  const { medicineHouseDoctorProfile } = getMedicineHouseContentDefaults();
  return {
    npcGreeting: medicineHouseDoctorProfile.name,
    dialoguePhase: "open",
    overlay: null,
  };
}

function withSessionState(
  state: RuntimeState,
  sessionState: MedicineHouseSessionState
): RuntimeState {
  return {
    ...state,
    core: {
      ...state.core,
      ui: {
        ...state.core.ui,
        houseSession: {
          moduleId: "medicine-house",
          state: sessionState,
        },
      },
    },
  };
}

function getPlayerMedicineSkill(
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string
): number {
  const playerCharacter = characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assertExists(
    playerCharacter,
    `Player character not found for id "${playerCharacterId}" in medicine compounding playable.`
  );
  return readNumericPersonAttributeBySemanticKey(playerCharacter, "medicine", 0);
}

function formatOutcomeSummary(outcome: MedicineHouseActionOutcome): string[] {
  const lines: string[] = [];

  if (outcome.relationshipChange !== 0) {
    lines.push(`好感 ${outcome.relationshipChange > 0 ? "+" : ""}${outcome.relationshipChange}`);
  } else {
    lines.push("好感 不变");
  }

  if (outcome.attributeChange.length === 0) {
    lines.push("医术 不变");
  } else {
    outcome.attributeChange.forEach((attributeChange) => {
      lines.push(
        `${attributeChange.label} ${
          attributeChange.delta > 0 ? "+" : ""
        }${attributeChange.delta}`
      );
    });
  }

  if (outcome.moneyChange !== 0) {
    lines.push(`金钱 ${outcome.moneyChange > 0 ? "+" : ""}${outcome.moneyChange}`);
  } else {
    lines.push("金钱 不变");
  }

  lines.push(`时间 +${outcome.timeCost}天`);

  return lines;
}

export function launchMedicineCompoundingPlayable(input: {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
  playerCharacterId: string;
  ownerId: string | null;
  integrationId?: PlayableIntegrationId | undefined;
  ownerContext?: PlayableOwnerContext | undefined;
  launchPayload?: Record<string, unknown>;
}): RuntimeState {
  const sessionState = getActiveSession(input.state) ?? createExternalSession();
  const runtimeConfig = resolveRuntimeConfigFromPayload(
    input.launchPayload ?? {}
  );

  const medicineSkill = getPlayerMedicineSkill(
    input.characterDefinitions,
    input.playerCharacterId
  );
  const nextState = withSessionState(input.state, {
    ...sessionState,
    overlay: {
      type: "compounding",
      target: pickCompoundingTarget(medicineSkill),
      availableHerbs: getAvailableHerbsForSkill(medicineSkill),
      selections: [],
      selectionsLeft: runtimeConfig.maxTurns,
      secondsLeft: runtimeConfig.durationSec,
    },
  });

  return {
    ...nextState,
    core: {
      ...nextState.core,
      runtime: {
        ...nextState.core.runtime,
        playableSession: {
          sessionId: "playable.medicine-compounding",
          playableId: "medicine-compounding",
          integrationId:
            input.integrationId ??
            "playable.medicine-compounding.house.medicine-house",
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

export function tickMedicineCompoundingPlayable(input: {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
  playerCharacterId: string;
}): {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
  settlement?: MedicineCompoundingSettlement;
} {
  const sessionState = getActiveSession(input.state);
  const overlay = sessionState?.overlay;
  if (sessionState == null || overlay?.type !== "compounding") {
    return {
      state: input.state,
      characterDefinitions: input.characterDefinitions,
    };
  }

  if (overlay.secondsLeft <= 1) {
    return settleMedicineCompoundingPlayable(input);
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

export function clearMedicineCompoundingPlayable(state: RuntimeState): RuntimeState {
  const sessionState = getActiveSession(state);
  const overlay = sessionState?.overlay;
  if (sessionState == null || overlay?.type !== "compounding") {
    return state;
  }

  return withSessionState(state, {
    ...sessionState,
    overlay: {
      ...overlay,
      selections: [],
      selectionsLeft: overlay.selectionsLeft + countSelections(overlay.selections),
    },
  });
}

export function selectMedicineCompoundingHerbPlayable(input: {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
  playerCharacterId: string;
  herbId: string;
}): {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
  settlement?: MedicineCompoundingSettlement;
} {
  const sessionState = getActiveSession(input.state);
  const overlay = sessionState?.overlay;
  if (
    sessionState == null ||
    overlay?.type !== "compounding" ||
    overlay.selectionsLeft <= 0
  ) {
    return {
      state: input.state,
      characterDefinitions: input.characterDefinitions,
    };
  }

  const nextSelections = addHerbSelection(overlay.selections, input.herbId);
  const nextSelectionsLeft = overlay.selectionsLeft - 1;
  const nextState = withSessionState(input.state, {
    ...sessionState,
    overlay: {
      ...overlay,
      selections: nextSelections,
      selectionsLeft: Math.max(0, nextSelectionsLeft),
    },
  });

  if (nextSelectionsLeft <= 0) {
    return settleMedicineCompoundingPlayable({
      ...input,
      state: nextState,
    });
  }

  return {
    state: nextState,
    characterDefinitions: input.characterDefinitions,
  };
}

export function settleMedicineCompoundingPlayable(input: {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
  playerCharacterId: string;
}): {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
  settlement?: MedicineCompoundingSettlement;
} {
  const sessionState = getActiveSession(input.state);
  const overlay = sessionState?.overlay;
  if (sessionState == null || overlay?.type !== "compounding") {
    return {
      state: input.state,
      characterDefinitions: input.characterDefinitions,
    };
  }

  const gradeResult = resolveCompoundingGrade(
    overlay.target,
    overlay.selections,
    overlay.availableHerbs
  );
  const runtimeConfig = resolveRuntimeConfig(input.state);
  const durationDays = getHouseMinigameDurationDays(
    getPlayerMedicineSkill(
      input.characterDefinitions,
      input.playerCharacterId
    )
  );
  const reward = runtimeConfig.rewardByGrade[gradeResult.grade];
  const outcome: MedicineHouseActionOutcome = {
    relationshipChange: reward.relationship,
    attributeChange:
      reward.medicine === 0
        ? []
        : [
            {
              key: "medicine",
              label: "医术",
              delta: reward.medicine,
            },
          ],
    fatigueRecovery: 0,
    moneyChange: 0,
    inventoryChange: [],
    timeCost: durationDays,
  };
  const playerCharacter = input.characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === input.playerCharacterId
  );
  assertExists(
    playerCharacter,
    `Player character not found for id "${input.playerCharacterId}" in medicine compounding settlement.`
  );
  const houseId = input.state.core.world.currentHouseId ?? "house.unknown";
  const { medicineHouseDoctorProfile } = getMedicineHouseContentDefaults();
  const characterStatusById = mergeCharacterStatusById(
    {},
    input.playerCharacterId,
    {
      stamina: Math.max(0, playerCharacter.stamina - runtimeConfig.staminaCost),
    }
  );
  const effects: Effect[] = [
    ...(outcome.relationshipChange === 0
      ? []
      : [
          {
            type: "setVariable" as const,
            key: getMedicineHouseFavorabilityVariableKey(
              houseId,
              medicineHouseDoctorProfile.actorId
            ),
            value:
              readNumericVariable(
                input.state.core,
                getMedicineHouseFavorabilityVariableKey(
                  houseId,
                  medicineHouseDoctorProfile.actorId
                ),
                0
              ) + outcome.relationshipChange,
          },
        ]),
    ...outcome.attributeChange.flatMap((attributeChange) =>
      attributeChange.delta === 0
        ? []
        : [
            {
              type: "mutateCharacterNumericAttribute" as const,
              characterId: input.playerCharacterId,
              semanticKey: attributeChange.key,
              operation:
                attributeChange.delta >= 0
                  ? ("add" as const)
                  : ("subtract" as const),
              value: Math.abs(attributeChange.delta),
            },
          ]
    ),
    ...(outcome.timeCost === 0
      ? []
      : [
          {
            type: "setVariable" as const,
            key: getMedicineHouseTimeVariableKey(houseId),
            value:
              readNumericVariable(
                input.state.core,
                getMedicineHouseTimeVariableKey(houseId),
                0
              ) + outcome.timeCost,
          },
        ]),
  ];
  const rewardLines = [
    ...formatOutcomeSummary(outcome),
    `体力 -${runtimeConfig.staminaCost}`,
  ];
  const nextSessionState: MedicineHouseSessionState = {
    ...sessionState,
    dialoguePhase: "open",
    overlay: {
      type: "result",
      grade: gradeResult.grade,
      summaryLines: gradeResult.summaryLines,
      rewardLines,
    },
  };
  const settlement: MedicineCompoundingSettlement = {
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

  return {
    state: {
      ...withSessionState(
        input.state,
        nextSessionState
      ),
      core: {
        ...input.state.core,
        ui: {
          ...input.state.core.ui,
          houseSession: {
            moduleId: "medicine-house",
            state: nextSessionState,
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

export function exitMedicineCompoundingPlayable(state: RuntimeState): RuntimeState {
  const sessionState = getActiveSession(state);
  const nextState =
    sessionState?.overlay?.type === "compounding"
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

export function getMedicineCompoundingTimeAdvanceCost(
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string
): number {
  return convertHouseActivityDaysToSegments(
    getHouseMinigameDurationDays(
      getPlayerMedicineSkill(characterDefinitions, playerCharacterId)
    )
  );
}
