import {
  medicineHouseDialoguePool,
  medicineHouseDoctorProfile,
  medicineHouseGreetingLines,
  medicineHouseHealService,
  medicineHousePreparedMedicines,
} from "../../../content/houses/medicine-house-content";
import type { CharacterDefinition } from "../../../domain/character";
import type {
  MedicineHouseDialoguePhase,
  MedicineHouseOverlayState,
  MedicineHouseSessionState,
} from "../../../domain/house-modules/medicine-house-session";
import type {
  HouseModuleDefinition,
  HouseModuleDispatchInput,
  HouseModuleTransitionResult,
  HouseModuleViewModel,
  HouseOverlayViewModel,
} from "../../../domain/house-module";
import type { MedicineHouseActionOutcome } from "../../../domain/medicine-house";
import {
  getMedicineHouseFavorabilityVariableKey,
  getMedicineHouseTimeVariableKey,
} from "../../../domain/medicine-house";
import { assertExists } from "../../../shared/assert";
import { pickRandom } from "../../../shared/random";
import {
  addHerbSelection,
  getAvailableHerbsForSkill,
  getCompoundingLimits,
  pickCompoundingTarget,
  resolveCompoundingGrade,
} from "../../medicine-house/compounding-minigame";
import {
  applyMedicineHouseOutcome,
  readMedicineInventoryQuantity,
  readPlayerFatigue,
  readReservedPlayerStatus,
} from "../../medicine-house/medicine-house-mutations";
import {
  ACTIVITY_COMPLETION_STAMINA_COST,
  spendPlayerStamina,
} from "../../player/player-stamina";
import { createInitialMedicineHouseSessionState } from "./medicine-house-session-state";

const COMPOUNDING_INTERVAL_ID = "medicine-house-compounding";
const BUY_SELECT_ACTION_PREFIX = "buy-select:";
const COMPOUND_HERB_ACTION_PREFIX = "compound-herb:";
const COMPOUND_CLEAR_ACTION_ID = "compound-clear";

function countCompoundingSelections(
  selections: Array<{ amount: number }>
): number {
  return selections.reduce(
    (total, selection) => total + Math.max(0, selection.amount),
    0
  );
}

function getPlayerCharacter(
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string
): CharacterDefinition {
  const playerCharacter = characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assertExists(
    playerCharacter,
    `Player character not found for id "${playerCharacterId}" in medicine house module.`
  );
  return playerCharacter;
}

function readNumericVariable(
  state: HouseModuleDispatchInput["gameState"],
  key: string,
  fallback: number
): number {
  const value = state.runtime.variables[key];
  return typeof value === "number" ? value : fallback;
}

function createTransitionResult(
  input: Pick<
    HouseModuleDispatchInput<"medicine-house">,
    "gameState" | "characterDefinitions" | "sessionState"
  >,
  patch?: Partial<HouseModuleTransitionResult<"medicine-house">>
): HouseModuleTransitionResult<"medicine-house"> {
  return {
    gameState: patch?.gameState ?? input.gameState,
    characterDefinitions: patch?.characterDefinitions ?? input.characterDefinitions,
    sessionState: patch?.sessionState ?? input.sessionState,
    ...(patch?.sideEffects == null ? {} : { sideEffects: patch.sideEffects }),
  };
}

function withSessionState(
  input: Pick<
    HouseModuleDispatchInput<"medicine-house">,
    "gameState" | "characterDefinitions"
  >,
  sessionState: MedicineHouseSessionState | null,
  patch: Partial<MedicineHouseSessionState>,
  sideEffects?: HouseModuleTransitionResult<"medicine-house">["sideEffects"]
): HouseModuleTransitionResult<"medicine-house"> {
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
      ...patch,
    },
    ...(sideEffects == null ? {} : { sideEffects }),
  };
}

function withDialoguePhase(
  input: Pick<
    HouseModuleDispatchInput<"medicine-house">,
    "gameState" | "characterDefinitions"
  >,
  sessionState: MedicineHouseSessionState | null,
  dialoguePhase: MedicineHouseDialoguePhase
): HouseModuleTransitionResult<"medicine-house"> {
  return withSessionState(input, sessionState, { dialoguePhase });
}

function createAlertOverlay(
  title: string,
  paragraphs: string[],
  tone?: "info" | "success" | "warning"
): MedicineHouseOverlayState {
  return {
    type: "alert",
    title,
    paragraphs,
    ...(tone == null ? {} : { tone }),
  };
}

function formatOutcomeSummary(outcome: MedicineHouseActionOutcome): string[] {
  const lines = [
    `关系 ${outcome.relationshipChange >= 0 ? "+" : ""}${outcome.relationshipChange}`,
    `金钱 ${outcome.moneyChange >= 0 ? "+" : ""}${outcome.moneyChange}`,
    `时间 +${outcome.timeCost}`,
  ];

  if (outcome.fatigueRecovery > 0) {
    lines.push(`疲劳 -${outcome.fatigueRecovery}`);
  }

  if (outcome.inventoryChange.length > 0) {
    lines.push(
      ...outcome.inventoryChange.map((change) => `成药 +${change.quantity}`)
    );
  }

  if (outcome.attributeChange.length > 0) {
    lines.push(
      ...outcome.attributeChange.map(
        (change) =>
          `${change.label} ${change.delta >= 0 ? "+" : ""}${change.delta}`
      )
    );
  }

  return lines;
}

function finalizeInteraction(
  input: HouseModuleDispatchInput<"medicine-house">,
  sessionState: MedicineHouseSessionState | null,
  title: string,
  dialogueLines: string[],
  outcome: MedicineHouseActionOutcome,
  tone?: "info" | "success" | "warning"
): HouseModuleTransitionResult<"medicine-house"> {
  const mutation = applyMedicineHouseOutcome(
    input.gameState,
    input.characterDefinitions,
    input.playerCharacterId,
    input.houseDefinition.id,
    medicineHouseDoctorProfile.actorId,
    outcome
  );

  return {
    gameState: mutation.state,
    characterDefinitions: mutation.characterDefinitions,
    sessionState:
      sessionState == null
        ? sessionState
        : {
            ...sessionState,
            dialoguePhase: "open",
            overlay: createAlertOverlay(
              title,
              [...dialogueLines, ...formatOutcomeSummary(outcome)],
              tone
            ),
          },
  };
}

function getPlayerMedicineSkill(playerCharacter: CharacterDefinition): number {
  return playerCharacter.skills?.medicine ?? 0;
}

function finalizeCompounding(
  input: HouseModuleDispatchInput<"medicine-house">,
  sessionState: MedicineHouseSessionState | null
): HouseModuleTransitionResult<"medicine-house"> {
  const overlay = sessionState?.overlay;
  if (overlay?.type !== "compounding") {
    return createTransitionResult(input, {
      sideEffects: [{ type: "stop-interval", intervalId: COMPOUNDING_INTERVAL_ID }],
    });
  }

  const gradeResult = resolveCompoundingGrade(
    overlay.target,
    overlay.selections,
    overlay.availableHerbs
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
    timeCost: 1,
  };
  const mutation = applyMedicineHouseOutcome(
    input.gameState,
    input.characterDefinitions,
    input.playerCharacterId,
    input.houseDefinition.id,
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

  return {
    gameState: staminaMutation.state,
    characterDefinitions: staminaMutation.characterDefinitions,
    sessionState:
      sessionState == null
        ? sessionState
        : {
            ...sessionState,
            dialoguePhase: "open",
            overlay: {
              type: "result",
              grade: gradeResult.grade,
              summaryLines: gradeResult.summaryLines,
              rewardLines,
            },
          },
    sideEffects: [{ type: "stop-interval", intervalId: COMPOUNDING_INTERVAL_ID }],
  };
}

function handleTick(
  input: HouseModuleDispatchInput<"medicine-house">,
  sessionState: MedicineHouseSessionState | null
): HouseModuleTransitionResult<"medicine-house"> {
  if (input.request.type !== "tick" || input.request.tickId !== COMPOUNDING_INTERVAL_ID) {
    return createTransitionResult(input);
  }

  const overlay = sessionState?.overlay;
  if (overlay?.type !== "compounding") {
    return createTransitionResult(input, {
      sideEffects: [{ type: "stop-interval", intervalId: COMPOUNDING_INTERVAL_ID }],
    });
  }

  if (overlay.secondsLeft <= 1) {
    return finalizeCompounding(input, sessionState);
  }

  return withSessionState(input, sessionState, {
    overlay: {
      ...overlay,
      secondsLeft: overlay.secondsLeft - 1,
    },
  });
}

function handleAction(
  input: HouseModuleDispatchInput<"medicine-house">,
  sessionState: MedicineHouseSessionState | null
): HouseModuleTransitionResult<"medicine-house"> {
  if (input.request.type !== "action") {
    return createTransitionResult(input);
  }

  const playerCharacter = getPlayerCharacter(
    input.characterDefinitions,
    input.playerCharacterId
  );

  switch (input.request.actionId) {
    case "advance-greeting":
    case "open-npc-dialogue":
      return withDialoguePhase(input, sessionState, "open");
    case "dismiss-dialogue":
      return withDialoguePhase(input, sessionState, "idle");
    case "close-alert":
    case "close-buy":
    case "close-result":
      return withSessionState(
        input,
        sessionState,
        { overlay: null },
        [{ type: "stop-interval", intervalId: COMPOUNDING_INTERVAL_ID }]
      );
    case "talk": {
      const line = pickRandom([...medicineHouseDialoguePool]);
      return finalizeInteraction(
        input,
        sessionState,
        "闲谈",
        [line],
        {
          relationshipChange: 1,
          attributeChange: [],
          fatigueRecovery: 0,
          moneyChange: 0,
          inventoryChange: [],
          timeCost: 1,
        }
      );
    }
    case "heal": {
      if (playerCharacter.stats.gold < medicineHouseHealService.cost) {
        return withSessionState(input, sessionState, {
          overlay: createAlertOverlay(
            "疗伤",
            ["你手头银两不够，陈郎中摇了摇头。"],
            "warning"
          ),
        });
      }

      return finalizeInteraction(
        input,
        sessionState,
        "疗伤",
        [
          "陈郎中为你把脉施针，气色渐渐平复。",
          `收费 ${medicineHouseHealService.cost} 文。`,
        ],
        {
          relationshipChange: 0,
          attributeChange: [],
          fatigueRecovery: medicineHouseHealService.fatigueRecovery,
          moneyChange: -medicineHouseHealService.cost,
          inventoryChange: [],
          timeCost: 1,
        },
        "success"
      );
    }
    case "open-buy":
      return withSessionState(input, sessionState, {
        overlay: {
          type: "buy",
          selectedItemId: medicineHousePreparedMedicines[0]?.id ?? null,
        },
      });
    case "confirm-buy": {
      const overlay = sessionState?.overlay;
      if (overlay?.type !== "buy" || overlay.selectedItemId == null) {
        return createTransitionResult(input);
      }

      const medicine = medicineHousePreparedMedicines.find(
        (entry) => entry.id === overlay.selectedItemId
      );
      if (medicine == null) {
        return createTransitionResult(input);
      }

      if (playerCharacter.stats.gold < medicine.price) {
        return withSessionState(input, sessionState, {
          overlay: createAlertOverlay(
            "买药",
            [`${medicine.name} 要价 ${medicine.price} 文，你手头不够。`],
            "warning"
          ),
        });
      }

      return finalizeInteraction(
        input,
        sessionState,
        "买药",
        [`你付银 ${medicine.price} 文，将 ${medicine.name} 收入囊中。`],
        {
          relationshipChange: 0,
          attributeChange: [],
          fatigueRecovery: 0,
          moneyChange: -medicine.price,
          inventoryChange: [{ itemId: medicine.id, quantity: 1 }],
          timeCost: 1,
        },
        "success"
      );
    }
    case "start-compounding": {
      const medicineSkill = getPlayerMedicineSkill(playerCharacter);
      const limits = getCompoundingLimits(medicineSkill);
      const target = pickCompoundingTarget(medicineSkill);
      const availableHerbs = getAvailableHerbsForSkill(medicineSkill);

      return withSessionState(
        input,
        sessionState,
        {
          overlay: {
            type: "compounding",
            target,
            availableHerbs,
            selections: [],
            selectionsLeft: limits.maxTurns,
            secondsLeft: limits.durationSec,
          },
        },
        [
          { type: "stop-interval", intervalId: COMPOUNDING_INTERVAL_ID },
          {
            type: "start-interval",
            intervalId: COMPOUNDING_INTERVAL_ID,
            everyMs: 1000,
            request: {
              type: "tick",
              tickId: COMPOUNDING_INTERVAL_ID,
            },
          },
        ]
      );
    }
    case COMPOUND_CLEAR_ACTION_ID: {
      const overlay = sessionState?.overlay;
      if (overlay?.type !== "compounding" || overlay.selections.length === 0) {
        return createTransitionResult(input);
      }

      const refundedSelections = countCompoundingSelections(overlay.selections);

      return withSessionState(input, sessionState, {
        overlay: {
          ...overlay,
          selections: [],
          selectionsLeft: overlay.selectionsLeft + refundedSelections,
        },
      });
    }
    case "compound-finish":
      return finalizeCompounding(input, sessionState);
    default: {
      if (input.request.actionId.startsWith(BUY_SELECT_ACTION_PREFIX)) {
        const itemId = input.request.actionId.slice(BUY_SELECT_ACTION_PREFIX.length);
        const overlay = sessionState?.overlay;
        if (overlay?.type !== "buy") {
          return createTransitionResult(input);
        }

        return withSessionState(input, sessionState, {
          overlay: {
            ...overlay,
            selectedItemId: itemId,
          },
        });
      }

      if (input.request.actionId.startsWith(COMPOUND_HERB_ACTION_PREFIX)) {
        const herbId = input.request.actionId.slice(COMPOUND_HERB_ACTION_PREFIX.length);
        const overlay = sessionState?.overlay;
        if (overlay?.type !== "compounding" || overlay.selectionsLeft <= 0) {
          return createTransitionResult(input);
        }

        const nextSelections = addHerbSelection(overlay.selections, herbId);
        const nextSelectionsLeft = overlay.selectionsLeft - 1;

        if (nextSelectionsLeft <= 0) {
          return finalizeCompounding(
            input,
            sessionState == null
              ? sessionState
              : {
                  ...sessionState,
                  overlay: {
                    ...overlay,
                    selections: nextSelections,
                    selectionsLeft: 0,
                  },
                }
          );
        }

        return withSessionState(input, sessionState, {
          overlay: {
            ...overlay,
            selections: nextSelections,
            selectionsLeft: nextSelectionsLeft,
          },
        });
      }

      return createTransitionResult(input);
    }
  }
}

function selectOverlayViewModel(
  overlay: MedicineHouseSessionState["overlay"],
  playerGold: number
): HouseOverlayViewModel | null {
  if (overlay == null) {
    return null;
  }

  if (overlay.type === "alert") {
    return {
      type: "alert",
      title: overlay.title,
      paragraphs: overlay.paragraphs,
      ...(overlay.tone == null ? {} : { tone: overlay.tone }),
      confirmActionId: "close-alert",
      confirmLabel: "知道了",
    };
  }

  if (overlay.type === "buy") {
    return {
      type: "medicine-buy",
      title: "购买成药",
      items: medicineHousePreparedMedicines.map((medicine) => ({
        id: medicine.id,
        name: medicine.name,
        price: medicine.price,
        typeLabel:
          medicine.type === "heal"
            ? "疗伤"
            : medicine.type === "fatigue"
              ? "安神"
              : "解毒",
        actionId: `${BUY_SELECT_ACTION_PREFIX}${medicine.id}`,
        isSelected: overlay.selectedItemId === medicine.id,
        disabled: playerGold < medicine.price,
      })),
      confirmActionId: "confirm-buy",
      confirmLabel: "付款购入",
      cancelActionId: "close-buy",
      cancelLabel: "取消",
    };
  }

  if (overlay.type === "compounding") {
    return {
      type: "medicine-compounding",
      title: "配药",
      ailmentName: overlay.target.ailmentName,
      coldRequired: overlay.target.coldRequired,
      healRequired: overlay.target.healRequired,
      maxPoison: overlay.target.maxPoison,
      secondsLeft: overlay.secondsLeft,
      selectionsLeft: overlay.selectionsLeft,
      herbs: overlay.availableHerbs.map((herb) => ({
        id: herb.id,
        name: herb.name,
        cold: herb.cold,
        heat: herb.heat,
        poison: herb.poison,
        heal: herb.heal,
        actionId: `${COMPOUND_HERB_ACTION_PREFIX}${herb.id}`,
      })),
      selectionSummary: overlay.selections.map((selection) => {
        const herb = overlay.availableHerbs.find(
          (entry) => entry.id === selection.herbId
        );
        return `${herb?.name ?? selection.herbId} ×${selection.amount}`;
      }),
      clearActionId: COMPOUND_CLEAR_ACTION_ID,
      clearLabel: "清空药盘",
      finishActionId: "compound-finish",
      finishLabel: "封炉成方",
    };
  }

  return {
    type: "result",
    title: "配药结算",
    grade: overlay.grade,
    score: 0,
    rewardLines: [...overlay.summaryLines, ...overlay.rewardLines],
    confirmActionId: "close-result",
    confirmLabel: "收工",
  };
}

export const medicineHouseHouseModule: HouseModuleDefinition<"medicine-house"> = {
  moduleId: "medicine-house",
  enter(input) {
    return {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      sessionState: createInitialMedicineHouseSessionState(
        pickRandom([...medicineHouseGreetingLines])
      ),
      sideEffects: [{ type: "stop-interval", intervalId: COMPOUNDING_INTERVAL_ID }],
    };
  },
  dispatch(input) {
    if (input.request.type === "tick") {
      return handleTick(input, input.sessionState);
    }

    return handleAction(input, input.sessionState);
  },
  leave(input) {
    return {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      sessionState: null,
      sideEffects: [{ type: "stop-interval", intervalId: COMPOUNDING_INTERVAL_ID }],
    };
  },
  selectViewModel(input): HouseModuleViewModel {
    const sessionState =
      input.sessionState ?? createInitialMedicineHouseSessionState("");
    const playerCharacter = getPlayerCharacter(
      input.characterDefinitions,
      input.playerCharacterId
    );
    const npc =
      input.characterDefinitions.find(
        (characterDefinition) =>
          characterDefinition.id === medicineHouseDoctorProfile.actorId
      ) ?? null;
    const favorability = readNumericVariable(
      input.gameState,
      getMedicineHouseFavorabilityVariableKey(
        input.houseDefinition.id,
        medicineHouseDoctorProfile.actorId
      ),
      medicineHouseDoctorProfile.favorability
    );
    const houseTime = readNumericVariable(
      input.gameState,
      getMedicineHouseTimeVariableKey(input.houseDefinition.id),
      0
    );
    const playerStatus = readReservedPlayerStatus(input.gameState);
    const fatigue = readPlayerFatigue(input.gameState, playerStatus.fatigue);
    const medicineInventorySummary = medicineHousePreparedMedicines
      .map(
        (medicine) =>
          `${medicine.name}×${readMedicineInventoryQuantity(input.gameState, medicine.id)}`
      )
      .join(" / ");
    const isIdle = sessionState.dialoguePhase === "idle";
    const isGreeting = sessionState.dialoguePhase === "greeting";
    const isOpen = sessionState.dialoguePhase === "open";
    const hasOverlay = sessionState.overlay != null;

    return {
      moduleId: "medicine-house",
      houseId: input.houseDefinition.id,
      sceneTitle: input.houseDefinition.name,
      sceneSubtitle: "陈记药铺 / 坐堂问诊",
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
              textLines: [isGreeting ? sessionState.npcGreeting : "陈郎中看着你，等你开口。"],
              advanceActionId: isGreeting ? "advance-greeting" : null,
              advanceHintText: isGreeting ? "点击继续" : null,
            },
      actionContainer:
        isOpen && !hasOverlay
          ? {
              title: "药铺操作",
              actions: [
                { id: "talk", label: "闲谈" },
                {
                  id: "heal",
                  label: "疗伤",
                  disabled: playerCharacter.stats.gold < medicineHouseHealService.cost,
                },
                { id: "open-buy", label: "买药" },
                { id: "start-compounding", label: "配药", tone: "accent" },
                { id: "dismiss-dialogue", label: "离开" },
              ],
            }
          : null,
      statusCard: {
        eyebrow: "屋敷",
        title: input.houseDefinition.name,
        subtitle: `${medicineHouseDoctorProfile.title} / ${medicineHouseDoctorProfile.personality}`,
        metrics: [
          { label: "金钱", value: `${playerCharacter.stats.gold} 文` },
          { label: "医术", value: `${getPlayerMedicineSkill(playerCharacter)}` },
          { label: "疲劳", value: `${fatigue}` },
          { label: "成药", value: medicineInventorySummary || "无" },
          { label: "交情", value: `${favorability}` },
          { label: "耗时", value: `${houseTime}` },
        ],
      },
      overlay: selectOverlayViewModel(
        sessionState.overlay,
        playerCharacter.stats.gold
      ),
      leaveAction: {
        id: "leave-house",
        label: "离开药铺",
        ...(isIdle ? { tone: "accent" } : {}),
      },
    };
  },
};
