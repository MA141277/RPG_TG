import {
  keepHouseDefaultContributions,
  keepHouseDefaultStrategy,
  keepHouseTaskDefinitions,
} from "../../../content/houses/keep-house-content";
import type { CharacterDefinition } from "../../../domain/character";
import type { CalendarDate, GameState } from "../../../domain/game-state";
import type {
  HouseActionViewModel,
  HouseModuleDefinition,
  HouseModuleDispatchInput,
  HouseModuleTransitionResult,
  HouseModuleViewModel,
  HouseOverlayViewModel,
} from "../../../domain/house-module";
import type {
  KeepHouseContributionEntry,
  KeepHouseOverlayState,
  KeepHouseSessionState,
} from "../../../domain/house-modules/keep-house-session";
import {
  getKeepHouseContributionVariableKey,
  KEEP_HOUSE_VARIABLE_KEYS,
  type KeepHouseTaskDefinition,
  type KeepHouseTaskTier,
} from "../../../domain/keep-house";
import { assertExists } from "../../../shared/assert";
import {
  markLateCouncilAttendancePenaltyProcessed,
  resolveLateCouncilAttendance,
} from "../../time/council-attendance";
import {
  formatCouncilStatusText,
  getCouncilStatusText,
} from "../../time/time-progression";
import { createInitialKeepHouseSessionState } from "./keep-house-session-state";

const ASSIGN_TASK_ACTION_PREFIX = "assign-keep-task:";

function getPlayerCharacter(
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string
): CharacterDefinition {
  const playerCharacter = characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assertExists(
    playerCharacter,
    `Player character not found for id "${playerCharacterId}" in keep house module.`
  );
  return playerCharacter;
}

function replaceCharacter(
  characterDefinitions: CharacterDefinition[],
  nextCharacter: CharacterDefinition
): CharacterDefinition[] {
  return characterDefinitions.map((characterDefinition) =>
    characterDefinition.id === nextCharacter.id ? nextCharacter : characterDefinition
  );
}

function getLordCharacter(
  characterDefinitions: CharacterDefinition[],
  lordCharacterId: string | null
): CharacterDefinition {
  assertExists(lordCharacterId, "Keep house is missing a default lord character.");
  const lordCharacter = characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === lordCharacterId
  );
  assertExists(
    lordCharacter,
    `Lord character not found for id "${lordCharacterId}" in keep house module.`
  );
  return lordCharacter;
}

function readNumericVariable(
  state: GameState,
  key: string,
  fallback: number
): number {
  const value = state.runtime.variables[key];
  return typeof value === "number" ? value : fallback;
}

function readStringVariable(
  state: GameState,
  key: string,
  fallback: string
): string {
  const value = state.runtime.variables[key];
  return typeof value === "string" ? value : fallback;
}

function formatReviewDateText(daysLeft: number): string {
  return formatCouncilStatusText(daysLeft);
}

function getCurrentDate(state: GameState): CalendarDate {
  return {
    year: state.calendar.year,
    month: state.calendar.month,
    day: state.calendar.day,
  };
}

function addDaysToDate(date: CalendarDate, days: number): CalendarDate {
  const currentNumber = date.year * 360 + (date.month - 1) * 30 + date.day;
  const nextNumber = currentNumber + days;
  const nextYear = Math.floor((nextNumber - 1) / 360);
  const dayOfYear = nextNumber - nextYear * 360;
  const nextMonth = Math.floor((dayOfYear - 1) / 30) + 1;
  const nextDay = ((dayOfYear - 1) % 30) + 1;

  return {
    year: nextYear,
    month: nextMonth,
    day: nextDay,
  };
}

function getTaskTier(character: CharacterDefinition): KeepHouseTaskTier {
  const title = character.title ?? "";
  if (title.includes("统领") || title.includes("偏将") || character.stats.fame >= 35) {
    return "commander";
  }
  if (title.includes("百户") || title.includes("队长") || character.stats.fame >= 18) {
    return "officer";
  }
  return "runner";
}

function ensureKeepRuntimeState(
  gameState: HouseModuleDispatchInput["gameState"],
  characterDefinitions: CharacterDefinition[]
): HouseModuleDispatchInput["gameState"] {
  const nextVariables = { ...gameState.runtime.variables };

  if (typeof nextVariables[KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown] !== "number") {
    nextVariables[KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown] = 0;
  }

  if (typeof nextVariables[KEEP_HOUSE_VARIABLE_KEYS.currentStrategy] !== "string") {
    nextVariables[KEEP_HOUSE_VARIABLE_KEYS.currentStrategy] = keepHouseDefaultStrategy.title;
  }

  keepHouseDefaultContributions.forEach((entry) => {
    const key = getKeepHouseContributionVariableKey(entry.characterId);
    if (typeof nextVariables[key] !== "number") {
      nextVariables[key] = entry.contribution;
    }
  });

  return {
    ...gameState,
    ui: {
      ...gameState.ui,
      reviewDateText: getCouncilStatusText(gameState),
      mainHouseMissionText:
        gameState.ui.mainHouseMissionText === "前往评定会场"
          ? "前往帅府听候差遣"
          : gameState.ui.mainHouseMissionText,
    },
    runtime: {
      ...gameState.runtime,
      variables: nextVariables,
    },
  };
}

function createContributionEntries(
  gameState: HouseModuleDispatchInput["gameState"],
  characterDefinitions: CharacterDefinition[],
  clanId: string | undefined
): KeepHouseContributionEntry[] {
  if (clanId == null) {
    return [];
  }

  return characterDefinitions
    .filter((characterDefinition) => characterDefinition.clanId === clanId)
    .map((characterDefinition) => ({
      characterId: characterDefinition.id,
      name: characterDefinition.name,
      ...(characterDefinition.title == null ? {} : { title: characterDefinition.title }),
      contribution: readNumericVariable(
        gameState,
        getKeepHouseContributionVariableKey(characterDefinition.id),
        0
      ),
    }))
    .sort((leftEntry, rightEntry) => rightEntry.contribution - leftEntry.contribution);
}

function createAlertOverlay(
  title: string,
  paragraphs: string[],
  tone?: "info" | "success" | "warning"
): KeepHouseOverlayState {
  return {
    type: "alert",
    title,
    paragraphs,
    ...(tone == null ? {} : { tone }),
  };
}

function createTransitionResult(
  input: Pick<
    HouseModuleDispatchInput<"keep-house">,
    "gameState" | "characterDefinitions" | "sessionState"
  >,
  patch?: Partial<HouseModuleTransitionResult<"keep-house">>
): HouseModuleTransitionResult<"keep-house"> {
  return {
    gameState: patch?.gameState ?? input.gameState,
    characterDefinitions: patch?.characterDefinitions ?? input.characterDefinitions,
    sessionState: patch?.sessionState ?? input.sessionState,
    ...(patch?.sideEffects == null ? {} : { sideEffects: patch.sideEffects }),
  };
}

function withSessionState(
  input: Pick<
    HouseModuleDispatchInput<"keep-house">,
    "gameState" | "characterDefinitions"
  >,
  sessionState: KeepHouseSessionState | null,
  patch: Partial<KeepHouseSessionState>
): HouseModuleTransitionResult<"keep-house"> {
  if (sessionState == null) {
    return {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      sessionState,
    };
  }

  return {
    gameState: input.gameState,
    characterDefinitions: input.characterDefinitions,
    sessionState: {
      ...sessionState,
      ...patch,
    },
  };
}

function isPlayersLord(
  playerCharacter: CharacterDefinition,
  lordCharacter: CharacterDefinition
): boolean {
  return (
    playerCharacter.clanId != null &&
    lordCharacter.clanId != null &&
    playerCharacter.clanId === lordCharacter.clanId
  );
}

function getAvailableTasks(
  playerCharacter: CharacterDefinition
): KeepHouseTaskDefinition[] {
  const tierOrder: KeepHouseTaskTier[] = ["runner", "officer", "commander"];
  const playerTier = getTaskTier(playerCharacter);

  return keepHouseTaskDefinitions.filter(
    (taskDefinition) =>
      tierOrder.indexOf(taskDefinition.minTier) <= tierOrder.indexOf(playerTier)
  );
}

function getAudienceGreetingLines(_lordCharacter: CharacterDefinition): string[] {
  return [
    "（抬了抬手）示意你上前。",
    "“有话就说，军中事务不喜拖沓。”",
  ];
}

function getAudienceOpenLines(_lordCharacter: CharacterDefinition): string[] {
  return [
    "（翻着案上的军报）仍分出神来看了你一眼。",
    "“军情、粮道、市面，凡是看见的，都可以报上来。”",
  ];
}

function getMeetingIntroLines(_lordCharacter: CharacterDefinition): string[] {
  return [
    "（端坐主位）厅中诸将已经依次列坐。",
    "“评定已到，今日先报功过，再定今后的方针与差事。”",
  ];
}

function getLateMeetingIntroLines(
  _lordCharacter: CharacterDefinition,
  lateDays: number,
  contributionPenalty: number
): string[] {
  return lateDays > 5
    ? [
        "（冷冷看了你一眼）堂中气氛一下子沉了下去。",
        `“评定过了 ${lateDays} 天，你才露面，还敢让众人等你？”`,
        `“先削去你 ${contributionPenalty} 点功劳，再把这轮评定补上。坐下听令。”`,
      ]
    : [
        "（敲了敲案角）目光没再挪开。",
        `“评定拖了 ${lateDays} 天才来，军中不养散漫之人。”`,
        `“先记你迟到，削去 ${contributionPenalty} 点功劳。坐下，把这轮评定补完。”`,
      ];
}

function getLateExpulsionLines(
  _lordCharacter: CharacterDefinition,
  lateDays: number,
  contributionPenalty: number
): string[] {
  return [
    "（把案上的军报一合）声音冷得发硬。",
    `“评定过了 ${lateDays} 天，你才来应声，还想继续混在营里？”`,
    `“功劳先削去 ${contributionPenalty} 点。从今日起，你不再算我营中之人。”`,
  ];
}

function applyKeepLateCouncilAttendancePenalty(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string
): {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  resolution: ReturnType<typeof resolveLateCouncilAttendance>;
} {
  const resolution = resolveLateCouncilAttendance(state);
  if (resolution == null) {
    return {
      state,
      characterDefinitions,
      resolution,
    };
  }

  const contributionKey = getKeepHouseContributionVariableKey(playerCharacterId);
  const currentContribution = readNumericVariable(state, contributionKey, 0);
  let nextState = markLateCouncilAttendancePenaltyProcessed({
    ...state,
    runtime: {
      ...state.runtime,
      variables: {
        ...state.runtime.variables,
        [contributionKey]: Math.max(0, currentContribution - resolution.contributionPenalty),
      },
    },
  });
  let nextCharacterDefinitions = characterDefinitions;

  if (resolution.expelled) {
    const playerCharacter = getPlayerCharacter(characterDefinitions, playerCharacterId);
    const expelledPlayer: CharacterDefinition = {
      ...playerCharacter,
      affiliationLabel: "无所属",
    };
    delete expelledPlayer.clanId;
    nextCharacterDefinitions = replaceCharacter(characterDefinitions, expelledPlayer);
    nextState = {
      ...nextState,
      world: {
        ...nextState.world,
        schedule: {
          ...nextState.world.schedule,
          councilDate: addDaysToDate(getCurrentDate(nextState), 60),
        },
      },
      ui: {
        ...nextState.ui,
        reviewDateText: formatReviewDateText(60),
        mainHouseMissionText: "另谋出路",
      },
      runtime: {
        ...nextState.runtime,
        variables: {
          ...nextState.runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 60,
        },
      },
    };
  }

  return {
    state: nextState,
    characterDefinitions: nextCharacterDefinitions,
    resolution,
  };
}

function getMeetingPraiseLines(
  lordCharacter: CharacterDefinition,
  contributionEntries: KeepHouseContributionEntry[]
): string[] {
  const topEntries = contributionEntries.slice(0, 2);
  if (topEntries.length === 0) {
    return [`${lordCharacter.name}扫视众人：“这期无人立功，诸位都该警醒。”`];
  }

  const praiseLines = topEntries.map(
    (entry, index) =>
      `“${index + 1 === 1 ? "首功" : "次功"}记在${entry.name}身上，${entry.contribution}点功劳，做得不错。”`
  );

  return [
    `${lordCharacter.name}点了点案上的名册。`,
    ...praiseLines,
  ];
}

function getMeetingStrategyLines(): string[] {
  return [
    "郭子兴展开舆图，手指城中仓廪与市集。",
    ...keepHouseDefaultStrategy.lines,
  ];
}

function getAssignTaskLines(
  playerCharacter: CharacterDefinition,
  availableTasks: KeepHouseTaskDefinition[]
): string[] {
  const availableTaskText =
    availableTasks.length === 0
      ? "你暂且在堂下听令，待以后再领差事。"
      : `照你现在的资历，可接的差事有：${availableTasks
          .map((taskDefinition) => taskDefinition.title)
          .join("、")}。`;

  return [
    `${playerCharacter.name}出列听令。`,
    availableTaskText,
    "“自己选一件，领了就立刻去办。”",
  ];
}

function parseTaskActionId(actionId: string): string | null {
  return actionId.startsWith(ASSIGN_TASK_ACTION_PREFIX)
    ? actionId.slice(ASSIGN_TASK_ACTION_PREFIX.length)
    : null;
}

function assignTaskToPlayer(
  input: HouseModuleDispatchInput<"keep-house">,
  taskDefinition: KeepHouseTaskDefinition
): HouseModuleTransitionResult<"keep-house"> {
  const nextState = {
    ...input.gameState,
    world: {
      ...input.gameState.world,
      schedule: {
        ...input.gameState.world.schedule,
        councilDate: addDaysToDate(getCurrentDate(input.gameState), 60),
      },
    },
    missions: {
      ...input.gameState.missions,
      activeMissionId: taskDefinition.missionId,
    },
    ui: {
      ...input.gameState.ui,
      activeMissionId: taskDefinition.missionId,
      reviewDateText: formatReviewDateText(60),
      mainHouseMissionText: taskDefinition.title,
    },
    runtime: {
      ...input.gameState.runtime,
      variables: {
        ...input.gameState.runtime.variables,
        [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 60,
        [KEEP_HOUSE_VARIABLE_KEYS.currentStrategy]: keepHouseDefaultStrategy.title,
        [KEEP_HOUSE_VARIABLE_KEYS.lastAssignedTaskId]: taskDefinition.id,
      },
    },
  };

  return withSessionState(
    {
      gameState: nextState,
      characterDefinitions: input.characterDefinitions,
    },
    input.sessionState,
    {
      mode: "meeting",
      meetingStage: "assigned",
      dialoguePhase: "open",
      selectedTaskId: taskDefinition.id,
      dialogueLines: [
        ...taskDefinition.orderLines,
        `“${taskDefinition.title}这件事，就由你去办。”`,
      ],
      overlay: createAlertOverlay(
        "军令下达",
        [
          taskDefinition.briefing,
          "本次评定结束，下一次评定倒计时已重置为 60 天。",
        ],
        "success"
      ),
    }
  );
}

function handleAction(
  input: HouseModuleDispatchInput<"keep-house">,
  sessionState: KeepHouseSessionState | null
): HouseModuleTransitionResult<"keep-house"> {
  if (input.request.type !== "action" || sessionState == null) {
    return createTransitionResult(input);
  }

  const lordCharacter = getLordCharacter(
    input.characterDefinitions,
    input.houseDefinition.defaultCharacterId
  );
  const playerCharacter = getPlayerCharacter(
    input.characterDefinitions,
    input.playerCharacterId
  );

  if (input.request.actionId === "advance-keep-dialogue") {
    if (sessionState.mode === "meeting") {
      switch (sessionState.meetingStage) {
        case "intro":
          return withSessionState(input, sessionState, {
            meetingStage: "contribution",
            dialoguePhase: "open",
            overlay: createAlertOverlay(
              "诸将贡献",
              sessionState.contributionEntries.map(
                (entry) => `${entry.name}：${entry.contribution} 点`
              )
            ),
          });
        case "praise":
          return withSessionState(input, sessionState, {
            meetingStage: "strategy",
            dialoguePhase: "open",
            dialogueLines: getMeetingStrategyLines(),
          });
        case "strategy":
          return withSessionState(input, sessionState, {
            meetingStage: "assign-task",
            dialoguePhase: "open",
            dialogueLines: getAssignTaskLines(
              playerCharacter,
              getAvailableTasks(playerCharacter)
            ),
          });
        default:
          return createTransitionResult(input);
      }
    }

    return withSessionState(input, sessionState, {
      meetingStage: "finished",
      dialoguePhase: "open",
      dialogueLines: getAudienceOpenLines(lordCharacter),
    });
  }

  if (input.request.actionId === "close-alert") {
    if (sessionState.mode === "meeting" && sessionState.meetingStage === "contribution") {
      return withSessionState(input, sessionState, {
        meetingStage: "praise",
        overlay: null,
        dialoguePhase: "open",
        dialogueLines: getMeetingPraiseLines(
          lordCharacter,
          sessionState.contributionEntries
        ),
      });
    }

    if (sessionState.mode === "meeting" && sessionState.meetingStage === "assigned") {
      return withSessionState(input, sessionState, {
        meetingStage: "finished",
        overlay: null,
        dialoguePhase: "idle",
      });
    }

    return withSessionState(input, sessionState, {
      overlay: null,
    });
  }

  if (input.request.actionId === "dismiss-dialogue") {
    return withSessionState(input, sessionState, {
      dialoguePhase: "idle",
    });
  }

  if (input.request.actionId === "open-lord-dialogue") {
    return withSessionState(input, sessionState, {
      dialoguePhase: "open",
      dialogueLines: getAudienceOpenLines(lordCharacter),
    });
  }

  const selectedTaskId = parseTaskActionId(input.request.actionId);
  if (selectedTaskId != null) {
    const taskDefinition = keepHouseTaskDefinitions.find(
      (taskCandidate) => taskCandidate.id === selectedTaskId
    );
    assertExists(taskDefinition, `Keep house task not found for id "${selectedTaskId}".`);
    return assignTaskToPlayer(input, taskDefinition);
  }

  return createTransitionResult(input);
}

function selectOverlayViewModel(
  overlay: KeepHouseOverlayState
): HouseOverlayViewModel | null {
  if (overlay == null) {
    return null;
  }

  return {
    type: "alert",
    title: overlay.title,
    paragraphs: overlay.paragraphs,
    ...(overlay.tone == null ? {} : { tone: overlay.tone }),
    confirmActionId: "close-alert",
    confirmLabel: "收下",
  };
}

export const keepHouseHouseModule: HouseModuleDefinition<"keep-house"> = {
  moduleId: "keep-house",
  enter(input) {
    const preparedState = ensureKeepRuntimeState(input.gameState, input.characterDefinitions);
    const lateAttendance = applyKeepLateCouncilAttendancePenalty(
      preparedState,
      input.characterDefinitions,
      input.playerCharacterId
    );
    const nextState = lateAttendance.state;
    const lordCharacter = getLordCharacter(
      lateAttendance.characterDefinitions,
      input.houseDefinition.defaultCharacterId
    );
    const playerCharacter = getPlayerCharacter(
      lateAttendance.characterDefinitions,
      input.playerCharacterId
    );
    const contributionEntries = createContributionEntries(
      nextState,
      lateAttendance.characterDefinitions,
      lordCharacter.clanId
    );
    const shouldStartMeeting =
      isPlayersLord(playerCharacter, lordCharacter) &&
      readNumericVariable(nextState, KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown, 0) <= 0;

    const lateExpelled = lateAttendance.resolution?.expelled === true;
    const baseSessionState = shouldStartMeeting
      ? createInitialKeepHouseSessionState(
          "meeting",
          "intro",
          lateAttendance.resolution == null
            ? getMeetingIntroLines(lordCharacter)
            : getLateMeetingIntroLines(
                lordCharacter,
                lateAttendance.resolution.lateDays,
                lateAttendance.resolution.contributionPenalty
              ),
          contributionEntries
        )
      : createInitialKeepHouseSessionState(
          "audience",
          "finished",
          lateExpelled && lateAttendance.resolution != null
            ? getLateExpulsionLines(
                lordCharacter,
                lateAttendance.resolution.lateDays,
                lateAttendance.resolution.contributionPenalty
              )
            : getAudienceGreetingLines(lordCharacter),
          contributionEntries
        );

    return {
      gameState: nextState,
      characterDefinitions: lateAttendance.characterDefinitions,
      sessionState: lateExpelled
        ? {
            ...baseSessionState,
            dialoguePhase: "open",
            overlay: createAlertOverlay(
              "逐出营门",
              [
                `你迟到了 ${lateAttendance.resolution?.lateDays ?? 0} 天。`,
                `军中先扣去 ${lateAttendance.resolution?.contributionPenalty ?? 0} 点功劳，再将你逐出营门。`,
              ],
              "warning"
            ),
          }
        : baseSessionState,
    };
  },
  dispatch(input) {
    return handleAction(input, input.sessionState);
  },
  leave(input) {
    return {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      sessionState: null,
    };
  },
  selectViewModel(input): HouseModuleViewModel {
    const nextState = ensureKeepRuntimeState(input.gameState, input.characterDefinitions);
    const lordCharacter = getLordCharacter(
      input.characterDefinitions,
      input.houseDefinition.defaultCharacterId
    );
    const playerCharacter = getPlayerCharacter(
      input.characterDefinitions,
      input.playerCharacterId
    );
    const sessionState =
      input.sessionState ??
      createInitialKeepHouseSessionState(
        "audience",
        "finished",
        getAudienceGreetingLines(lordCharacter),
        createContributionEntries(nextState, input.characterDefinitions, lordCharacter.clanId)
      );
    const currentStrategy = readStringVariable(
      nextState,
      KEEP_HOUSE_VARIABLE_KEYS.currentStrategy,
      keepHouseDefaultStrategy.title
    );
    const countdown = readNumericVariable(
      nextState,
      KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown,
      0
    );
    const availableTasks = getAvailableTasks(playerCharacter);
    const assignedTask =
      sessionState.selectedTaskId == null
        ? null
        : keepHouseTaskDefinitions.find(
            (taskDefinition) => taskDefinition.id === sessionState.selectedTaskId
          ) ?? null;
    const shouldShowMeetingTasks =
      sessionState.mode === "meeting" &&
      sessionState.meetingStage === "assign-task" &&
      sessionState.dialoguePhase === "open";
    const shouldShowDialogue = sessionState.dialoguePhase !== "idle";
    const rosterEntries =
      sessionState.mode === "meeting"
        ? sessionState.contributionEntries.filter(
            (entry) => entry.characterId !== lordCharacter.id
          )
        : sessionState.dialoguePhase === "idle"
          ? [
              {
                characterId: lordCharacter.id,
                name: lordCharacter.name,
                actionId: "open-lord-dialogue",
                ...(lordCharacter.title == null
                  ? {}
                  : { title: lordCharacter.title }),
              },
            ]
          : [];
    const statusTaskText =
      assignedTask?.title ??
      (nextState.ui.mainHouseMissionText === ""
        ? "暂无"
        : nextState.ui.mainHouseMissionText);
    const strategySubtitle =
      sessionState.mode === "meeting"
        ? "评定中 / 诸将列席"
        : `${lordCharacter.title ?? "城主"} / 发号施令`;

    return {
      moduleId: "keep-house",
      houseId: input.houseDefinition.id,
      sceneTitle: input.houseDefinition.name,
      sceneSubtitle: "城中中枢 / 评定与军令",
      standbyRoster: rosterEntries.map((entry) => ({
        characterId: entry.characterId,
        name: entry.name,
        ...("actionId" in entry && entry.actionId != null
          ? { actionId: entry.actionId }
          : {}),
        ...(entry.title == null ? {} : { title: entry.title }),
        ...(sessionState.mode === "meeting"
          ? { isSelected: sessionState.contributionEntries[0]?.characterId === entry.characterId }
          : {}),
      })),
      dialogue: !shouldShowDialogue
        ? null
        : {
            mode: "character",
            speakerName: lordCharacter.name,
            characterId: lordCharacter.id,
            position: "right",
            textLines: sessionState.dialogueLines,
            advanceActionId:
              sessionState.overlay == null &&
              ((sessionState.mode === "meeting" &&
                ["intro", "praise", "strategy"].includes(sessionState.meetingStage)) ||
                (sessionState.mode === "audience" &&
                  sessionState.meetingStage === "finished" &&
                  sessionState.dialoguePhase === "greeting"))
                ? "advance-keep-dialogue"
                : null,
            advanceHintText:
              sessionState.overlay == null &&
              ((sessionState.mode === "meeting" &&
                ["intro", "praise", "strategy"].includes(sessionState.meetingStage)) ||
                (sessionState.mode === "audience" &&
                  sessionState.meetingStage === "finished" &&
                  sessionState.dialoguePhase === "greeting"))
                ? "点击继续"
                : null,
          },
      actionContainer: shouldShowMeetingTasks
        ? {
            title: "本次可领差事",
            actions: availableTasks.map<HouseActionViewModel>((taskDefinition) => ({
              id: `${ASSIGN_TASK_ACTION_PREFIX}${taskDefinition.id}`,
              label: taskDefinition.title,
            })),
          }
        : sessionState.mode === "audience" && sessionState.dialoguePhase === "open"
          ? {
              title: "帅府事务",
              actions: [
                { id: "dismiss-dialogue", label: "退下" },
              ],
            }
          : null,
      statusCard: {
        eyebrow: "帅府",
        title: currentStrategy,
        subtitle: strategySubtitle,
        metrics: [
          { label: "主帅", value: lordCharacter.name },
          { label: "评定倒计时", value: `${countdown} 天` },
          { label: "本次首功", value: sessionState.contributionEntries[0]?.name ?? "暂无" },
          { label: "当前差事", value: statusTaskText },
        ],
      },
      overlay: selectOverlayViewModel(sessionState.overlay),
      leaveAction: {
        id: "leave-house",
        label: "离开帅府",
        ...(sessionState.dialoguePhase === "idle" ? { tone: "accent" } : {}),
      },
    };
  },
};
