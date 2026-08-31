import type { CharacterDefinition, SkillKey } from "../../../domain/character";
import { SKILL_LABELS } from "../../../domain/character";
import {
  getLeaderResidenceRelationKey,
  getLeaderResidenceSkillKeys,
  LEADER_RESIDENCE_VARIABLE_KEYS,
} from "../../../domain/leader-residence";
import type {
  HouseActionViewModel,
  HouseModuleDefinition,
  HouseModuleDispatchInput,
  HouseModuleTransitionResult,
  HouseModuleViewModel,
} from "../../../domain/house-module";
import type { LeaderResidenceSessionState } from "../../../domain/house-modules/leader-residence-session";
import { assertExists } from "../../../shared/assert";
import { resolveCharacterFactionLabel } from "../../faction/faction-affiliation-runtime";
import { createHouseActionMemoryObservedEvent } from "../../house/house-action-memory-event";
import { createInitialLeaderResidenceSessionState } from "./leader-residence-session-state";

const ACTION_GREETING = "leader-residence:greeting";
const ACTION_GIFT = "leader-residence:gift";
const ACTION_LEARN = "leader-residence:learn";
const ACTION_CLOSE_ALERT = "leader-residence:close-alert";
const ACTION_LEAVE = "leave-house";

const EMPTY_SKILLS: Record<SkillKey, number> = {
  ashigaru: 0,
  horse: 0,
  teppo: 0,
  navy: 0,
  archery: 0,
  martial: 0,
  military: 0,
  ninjutsu: 0,
  construction: 0,
  development: 0,
  mining: 0,
  arithmetic: 0,
  etiquette: 0,
  rhetoric: 0,
  tea: 0,
  medicine: 0,
  accounting: 0,
  debate: 0,
  compounding: 0,
};

function getPlayerCharacter(
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string
): CharacterDefinition {
  const playerCharacter = characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assertExists(
    playerCharacter,
    `Player character not found for id "${playerCharacterId}" in leader residence module.`
  );
  return playerCharacter;
}

function getVisitedCharacter(
  characterDefinitions: CharacterDefinition[],
  characterId: string
): CharacterDefinition {
  const characterDefinition = characterDefinitions.find(
    (candidateCharacter) => candidateCharacter.id === characterId
  );
  assertExists(
    characterDefinition,
    `Visited character not found for id "${characterId}" in leader residence module.`
  );
  return characterDefinition;
}

function createTransitionResult(
  input: Pick<
    HouseModuleDispatchInput<"leader-residence">,
    "gameState" | "characterDefinitions" | "sessionState"
  >,
  patch?: Partial<HouseModuleTransitionResult<"leader-residence">>
): HouseModuleTransitionResult<"leader-residence"> {
  return {
    gameState: patch?.gameState ?? input.gameState,
    characterDefinitions: patch?.characterDefinitions ?? input.characterDefinitions,
    sessionState: patch?.sessionState ?? input.sessionState,
    ...(patch?.timeAdvanceCost == null
      ? {}
      : { timeAdvanceCost: patch.timeAdvanceCost }),
    ...(patch?.observedEvents == null
      ? {}
      : { observedEvents: patch.observedEvents }),
    ...(patch?.councilArrivalNotice == null
      ? {}
      : { councilArrivalNotice: patch.councilArrivalNotice }),
    ...(patch?.sideEffects == null ? {} : { sideEffects: patch.sideEffects }),
    ...(patch?.navigation == null ? {} : { navigation: patch.navigation }),
  };
}

function createAlertState(
  sessionState: LeaderResidenceSessionState,
  title: string,
  paragraphs: string[],
  tone: "info" | "success" | "warning" = "info"
): LeaderResidenceSessionState {
  return {
    ...sessionState,
    overlay: {
      type: "alert",
      title,
      paragraphs,
      tone,
    },
  };
}

function getPendingCharacterId(input: {
  gameState: HouseModuleDispatchInput<"leader-residence">["gameState"];
  sessionState: LeaderResidenceSessionState | null;
}): string | null {
  if (input.sessionState != null) {
    return input.sessionState.selectedCharacterId;
  }

  const value =
    input.gameState.runtime.variables[
      LEADER_RESIDENCE_VARIABLE_KEYS.pendingCharacterId
    ];
  return typeof value === "string" ? value : null;
}

function getGreetingLine(_characterDefinition: CharacterDefinition): string {
  return "（抬手一礼）请你入座叙话。";
}

function getRelationValue(
  gameState: HouseModuleDispatchInput<"leader-residence">["gameState"],
  characterId: string
): number {
  const relationValue =
    gameState.runtime.variables[getLeaderResidenceRelationKey(characterId)];
  return typeof relationValue === "number" ? relationValue : 0;
}

function updateRelationValue(
  gameState: HouseModuleDispatchInput<"leader-residence">["gameState"],
  characterId: string,
  delta: number
): HouseModuleDispatchInput<"leader-residence">["gameState"] {
  return {
    ...gameState,
    runtime: {
      ...gameState.runtime,
      variables: {
        ...gameState.runtime.variables,
        [getLeaderResidenceRelationKey(characterId)]:
          getRelationValue(gameState, characterId) + delta,
      },
    },
  };
}

function incrementSkill(
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  skillKey: SkillKey
): CharacterDefinition[] {
  return characterDefinitions.map((characterDefinition) => {
    if (characterDefinition.id !== playerCharacterId) {
      return characterDefinition;
    }

    const currentSkills = characterDefinition.skills ?? EMPTY_SKILLS;
    const currentSkillValue = currentSkills[skillKey] ?? 0;

    return {
      ...characterDefinition,
      skills: {
        ...currentSkills,
        [skillKey]: currentSkillValue + 1,
      },
    };
  });
}

function getPreferredSkillKey(characterDefinition: CharacterDefinition): SkillKey | null {
  const skillKeys = getLeaderResidenceSkillKeys(characterDefinition);
  return skillKeys[0] ?? null;
}

function createLeaderResidenceObservedEvent(input: {
  houseDefinition: HouseModuleDispatchInput<"leader-residence">["houseDefinition"];
  characterId: string;
  type: string;
  summary: string;
  reactionSummary?: string;
  houseActionMemory: NonNullable<
    ReturnType<typeof createHouseActionMemoryObservedEvent>["houseActionMemory"]
  >;
}) {
  return createHouseActionMemoryObservedEvent({
    houseDefinition: input.houseDefinition,
    type: input.type,
    summary: input.summary,
    reactionSummary: input.reactionSummary,
    reactionCharacterId: input.characterId,
    houseActionMemory: input.houseActionMemory,
  });
}

function createLeaderResidenceLearnObservedEvent(input: {
  houseDefinition: HouseModuleDispatchInput<"leader-residence">["houseDefinition"];
  visitedCharacter: CharacterDefinition;
  skillKey: SkillKey;
}) {
  const skillLabel = SKILL_LABELS[input.skillKey] ?? input.skillKey;

  return createLeaderResidenceObservedEvent({
    houseDefinition: input.houseDefinition,
    characterId: input.visitedCharacter.id,
    type: "leader-residence:learn:complete",
    summary: `玩家在将领府向${input.visitedCharacter.name}请教了${skillLabel}。`,
    reactionSummary: `他刚向我请教了${skillLabel}。`,
    houseActionMemory: {
      kind: "work-complete",
      actionId: ACTION_LEARN,
      offerId: input.skillKey,
      offerTitle: skillLabel,
      resultKind: "success",
    },
  });
}

function shouldEmitLeaderResidenceLeaveObservedEvent(
  gameState: HouseModuleDispatchInput<"leader-residence">["gameState"],
  sessionState: LeaderResidenceSessionState,
  visitedCharacter: CharacterDefinition
): boolean {
  return (
    sessionState.mode === "learning" ||
    sessionState.overlay != null ||
    getRelationValue(gameState, visitedCharacter.id) > 0
  );
}

function createLeaderResidenceLeaveObservedEvent(input: {
  houseDefinition: HouseModuleDispatchInput<"leader-residence">["houseDefinition"];
  visitedCharacter: CharacterDefinition;
}) {
  return createLeaderResidenceObservedEvent({
    houseDefinition: input.houseDefinition,
    characterId: input.visitedCharacter.id,
    type: "leader-residence:leave",
    summary: `玩家从${input.visitedCharacter.name}的府邸告辞离开。`,
    reactionSummary: "他刚从我府上告辞离开。",
    houseActionMemory: {
      kind: "house-leave",
      actionId: ACTION_LEAVE,
      offerId: input.visitedCharacter.id,
      offerTitle: input.visitedCharacter.name,
    },
  });
}

function createActionContainer(
  characterDefinition: CharacterDefinition
): { title: string; actions: HouseActionViewModel[] } {
  const teachableSkillKeys = getLeaderResidenceSkillKeys(characterDefinition);

  return {
    title: "拜访交互",
    actions: [
      {
        id: ACTION_GREETING,
        label: "问候",
      },
      {
        id: ACTION_LEARN,
        label: "学习",
        disabled: teachableSkillKeys.length === 0,
        tone: "accent",
      },
    ],
  };
}

function buildStatusMetrics(
  input: HouseModuleDispatchInput<"leader-residence">,
  visitedCharacter: CharacterDefinition
): Array<{ label: string; value: string }> {
  const teachableSkills = getLeaderResidenceSkillKeys(visitedCharacter);

  return [
    {
      label: "阵营",
      value:
        resolveCharacterFactionLabel({
          state: input.gameState,
          character: visitedCharacter,
        }) ?? "无所属",
    },
    {
      label: "关系",
      value: `${getRelationValue(input.gameState, visitedCharacter.id)}`,
    },
    {
      label: "可教学",
      value:
        teachableSkills.length === 0
          ? "无"
          : teachableSkills
              .map((skillKey) => SKILL_LABELS[skillKey] ?? skillKey)
              .join(" / "),
    },
  ];
}

export const leaderResidenceHouseModule: HouseModuleDefinition<"leader-residence"> = {
  moduleId: "leader-residence",
  enter(input) {
    const selectedCharacterId = getPendingCharacterId({
      gameState: input.gameState,
      sessionState: null,
    });
    assertExists(
      selectedCharacterId,
      "Leader residence module requires a pending selected character id."
    );
    const visitedCharacter = getVisitedCharacter(
      input.characterDefinitions,
      selectedCharacterId
    );

    return {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      sessionState: createInitialLeaderResidenceSessionState(
        selectedCharacterId,
        getGreetingLine(visitedCharacter)
      ),
    };
  },
  dispatch(input) {
    const sessionState = input.sessionState;
    if (sessionState == null) {
      return createTransitionResult(input);
    }

    const visitedCharacter = getVisitedCharacter(
      input.characterDefinitions,
      sessionState.selectedCharacterId
    );
    const playerCharacter = getPlayerCharacter(
      input.characterDefinitions,
      input.playerCharacterId
    );

    if (input.request.type !== "action") {
      return createTransitionResult(input);
    }

    if (input.request.actionId === ACTION_CLOSE_ALERT) {
      return createTransitionResult(input, {
        sessionState: {
          ...sessionState,
          overlay: null,
        },
      });
    }

    if (input.request.actionId === ACTION_GREETING) {
      return createTransitionResult(input, {
        sessionState: {
          ...sessionState,
          dialogueLines: ["（与你寒暄了几句）气氛比初见时和缓了些。"],
          overlay: null,
        },
        gameState: updateRelationValue(input.gameState, visitedCharacter.id, 1),
        timeAdvanceCost: 1,
      });
    }

    if (input.request.actionId === ACTION_GIFT) {
      return createTransitionResult(input, {
        sessionState: createAlertState(
          sessionState,
          "\u9001\u793c",
          [
            `${visitedCharacter.name} \u6682\u672a\u5f00\u653e\u76f4\u63a5\u6536\u793c\u3002`,
            "\u9001\u793c\u5c06\u5728\u5171\u4eab\u7269\u54c1\u9009\u62e9\u4e0e\u786e\u8ba4\u6d41\u7a0b\u5b8c\u6210\u540e\u7ed3\u7b97\u3002",
          ],
          "warning"
        ),
      });
    }

    if (input.request.actionId === ACTION_LEARN) {
      const skillKey = getPreferredSkillKey(visitedCharacter);
      if (skillKey == null) {
        return createTransitionResult(input, {
          sessionState: createAlertState(
            sessionState,
            "无法学习",
            [`${visitedCharacter.name} 当前没有可传授的技艺。`],
            "warning"
          ),
        });
      }

      return createTransitionResult(input, {
        characterDefinitions: incrementSkill(
          input.characterDefinitions,
          playerCharacter.id,
          skillKey
        ),
        sessionState: createAlertState(
          {
            ...sessionState,
            mode: "learning",
            dialogueLines: [
              `${visitedCharacter.name} 向你讲解 ${SKILL_LABELS[skillKey] ?? skillKey} 的门径。`,
            ],
          },
          "学习心得",
          [
            `${visitedCharacter.name} 指点了你一番。`,
            `${SKILL_LABELS[skillKey] ?? skillKey} 提升 1 级。`,
          ],
          "success"
        ),
        timeAdvanceCost: 1,
        observedEvents: [
          createLeaderResidenceLearnObservedEvent({
            houseDefinition: input.houseDefinition,
            visitedCharacter,
            skillKey,
          }),
        ],
      });
    }

    return createTransitionResult(input);
  },
  leave(input) {
    const sessionState = input.sessionState;
    if (sessionState == null) {
      return {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
        sessionState: null,
      };
    }

    const visitedCharacter = getVisitedCharacter(
      input.characterDefinitions,
      sessionState.selectedCharacterId
    );
    const leaveResult = {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      sessionState: null,
    };

    if (
      !shouldEmitLeaderResidenceLeaveObservedEvent(
        input.gameState,
        sessionState,
        visitedCharacter
      )
    ) {
      return leaveResult;
    }

    return {
      ...leaveResult,
      observedEvents: [
        createLeaderResidenceLeaveObservedEvent({
          houseDefinition: input.houseDefinition,
          visitedCharacter,
        }),
      ],
    };
  },
  selectViewModel(input): HouseModuleViewModel {
    const sessionState = input.sessionState;
    assertExists(
      sessionState,
      "Leader residence session state is required to select view model."
    );
    const visitedCharacter = getVisitedCharacter(
      input.characterDefinitions,
      sessionState.selectedCharacterId
    );
    const teachableSkillKeys = getLeaderResidenceSkillKeys(visitedCharacter);

    return {
      moduleId: "leader-residence",
      houseId: input.houseDefinition.id,
      sceneTitle: "将领府邸",
      sceneSubtitle: visitedCharacter.name,
      standbyRoster: [
        {
          characterId: visitedCharacter.id,
          name: visitedCharacter.name,
          ...(visitedCharacter.title == null &&
          visitedCharacter.occupation == null
            ? {}
            : {
                title:
                  visitedCharacter.title ?? visitedCharacter.occupation,
              }),
          isSelected: true,
          interactionActions: [
            {
              id: ACTION_LEARN,
              label: "学习",
              kind: "special",
              disabled: teachableSkillKeys.length === 0,
              tone: "accent",
              triggerKeywords: [
                "学习",
                "请教",
                "受教",
                "学本事",
                "指点",
              ],
            },
          ],
        },
      ],
      dialogue: {
        mode: "character",
        textLines: sessionState.dialogueLines,
        speakerName: visitedCharacter.name,
        characterId: visitedCharacter.id,
        position: "right",
        advanceActionId: null,
        advanceHintText: null,
      },
      actionContainer: createActionContainer(visitedCharacter),
      statusCard: {
        eyebrow: "人物拜访",
        title: visitedCharacter.name,
        ...(visitedCharacter.title == null &&
        visitedCharacter.occupation == null
          ? {}
          : {
              subtitle:
                visitedCharacter.title ?? visitedCharacter.occupation,
            }),
        metrics: buildStatusMetrics(
          {
            ...input,
            request: { type: "action", actionId: "" },
          },
          visitedCharacter
        ),
      },
      overlay:
        sessionState.overlay == null
          ? null
          : {
              ...sessionState.overlay,
              confirmActionId: ACTION_CLOSE_ALERT,
              confirmLabel: "知道了",
            },
      leaveAction: {
        id: ACTION_LEAVE,
        label: input.houseDefinition.backAction.label,
      },
    };
  },
};
