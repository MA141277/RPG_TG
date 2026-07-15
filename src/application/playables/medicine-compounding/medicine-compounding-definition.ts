import type { CharacterDefinition } from "../../../domain/character";
import type { MedicineHouseActionOutcome } from "../../../domain/medicine-house";
import type { MedicineHouseSessionState } from "../../../domain/house-modules/medicine-house-session";
import type { RuntimeState } from "../../../core/contracts/runtime-state";
import { medicineHouseDoctorProfile } from "../../../content/houses/medicine-house-content";
import { assertExists } from "../../../shared/assert";
import {
  convertHouseActivityDaysToSegments,
  getHouseMinigameDurationDays,
} from "../../house/house-activity-costs";
import {
  addHerbSelection,
  getAvailableHerbsForSkill,
  getCompoundingLimits,
  pickCompoundingTarget,
  resolveCompoundingGrade,
} from "../../medicine-house/compounding-minigame";
import { applyMedicineHouseOutcome } from "../../medicine-house/medicine-house-mutations";
import {
  ACTIVITY_COMPLETION_STAMINA_COST,
  spendPlayerStamina,
} from "../../player/player-stamina";

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

  return houseSession.state;
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
  return playerCharacter.skills?.medicine ?? 0;
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
}): RuntimeState {
  const sessionState = getActiveSession(input.state);
  if (sessionState == null) {
    return input.state;
  }

  const medicineSkill = getPlayerMedicineSkill(
    input.characterDefinitions,
    input.playerCharacterId
  );
  const limits = getCompoundingLimits(medicineSkill);
  const nextState = withSessionState(input.state, {
    ...sessionState,
    overlay: {
      type: "compounding",
      target: pickCompoundingTarget(medicineSkill),
      availableHerbs: getAvailableHerbsForSkill(medicineSkill),
      selections: [],
      selectionsLeft: limits.maxTurns,
      secondsLeft: limits.durationSec,
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
          integrationId: "playable.medicine-compounding.house.medicine-house",
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

export function tickMedicineCompoundingPlayable(input: {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
  playerCharacterId: string;
}): {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
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
  const durationDays = getHouseMinigameDurationDays(
    getPlayerMedicineSkill(
      input.characterDefinitions,
      input.playerCharacterId
    )
  );
  const outcome: MedicineHouseActionOutcome = {
    relationshipChange: gradeResult.reward.relationship,
    attributeChange:
      gradeResult.reward.medicine === 0
        ? []
        : [
            {
              key: "medicine",
              label: "医术",
              delta: gradeResult.reward.medicine,
            },
          ],
    fatigueRecovery: 0,
    moneyChange: 0,
    inventoryChange: [],
    timeCost: durationDays,
  };
  const houseId = input.state.core.world.currentHouseId ?? "house.unknown";
  const mutation = applyMedicineHouseOutcome(
    input.state.core,
    input.characterDefinitions,
    input.playerCharacterId,
    houseId,
    medicineHouseDoctorProfile.actorId,
    outcome
  );
  const staminaMutation = spendPlayerStamina(
    mutation.state,
    mutation.characterDefinitions,
    input.playerCharacterId
  );
  const rewardLines = [
    ...formatOutcomeSummary(outcome),
    `体力 -${ACTIVITY_COMPLETION_STAMINA_COST}`,
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

  return {
    state: {
      ...withSessionState(
        {
          ...input.state,
          core: staminaMutation.state,
        },
        nextSessionState
      ),
      core: {
        ...staminaMutation.state,
        ui: {
          ...staminaMutation.state.ui,
          houseSession: {
            moduleId: "medicine-house",
            state: nextSessionState,
          },
        },
        runtime: {
          ...staminaMutation.state.runtime,
          playableSession: null,
        },
      },
    },
    characterDefinitions: staminaMutation.characterDefinitions,
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
