import {
  keepHouseDefaultContributions,
  keepHouseDefaultStrategy,
} from "../../../content/houses/keep-house-content";
import * as defaultZhuyuanzhangActivitiesModule from "../../../content/scenario-packs/zhuyuanzhang/activities.json";
import * as defaultZhuyuanzhangTextEntriesModule from "../../../content/scenario-packs/zhuyuanzhang/text-entries.json";
import type { ActivityDefinition } from "../../../domain/activity";
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
import {
  resolveTextEntry,
  resolveTextTemplateEntry,
} from "../../content/text-resolution";
import { createInitialKeepHouseSessionState } from "./keep-house-session-state";

const ASSIGN_TASK_ACTION_PREFIX = "assign-keep-task:";
function unwrapJsonModule<T>(moduleValue: unknown): T {
  if (
    moduleValue != null &&
    typeof moduleValue === "object" &&
    "default" in moduleValue
  ) {
    return (moduleValue as { default: T }).default;
  }

  return moduleValue as T;
}

const defaultZhuyuanzhangActivities = unwrapJsonModule<ActivityDefinition[]>(
  defaultZhuyuanzhangActivitiesModule
);
const defaultZhuyuanzhangTextEntries = unwrapJsonModule<Record<string, string>>(
  defaultZhuyuanzhangTextEntriesModule
);
const defaultKeepActivityDefinitionsById = Object.fromEntries(
  defaultZhuyuanzhangActivities.map((activityDefinition) => [
    activityDefinition.id,
    activityDefinition,
  ])
);

function getKeepTextEntries(
  input: {
    textEntriesById?: Record<string, string> | undefined;
  }
): Record<string, string> {
  return {
    ...defaultZhuyuanzhangTextEntries,
    ...(input.textEntriesById ?? {}),
  };
}

function resolveKeepText(
  textEntriesById: Record<string, string>,
  textId: string
): string {
  return resolveTextEntry(textEntriesById, textId, `MISSING_TEXT:${textId}`);
}

function resolveKeepTemplateText(
  textEntriesById: Record<string, string>,
  textId: string,
  values: Record<string, string | number | boolean | null | undefined>
): string {
  return resolveTextTemplateEntry(
    textEntriesById,
    textId,
    values,
    `MISSING_TEXT:${textId}`
  );
}

function getKeepActivityDefinitionsById(
  input: {
    activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
  }
): Record<string, ActivityDefinition> {
  return {
    ...defaultKeepActivityDefinitionsById,
    ...(input.activityDefinitionsById ?? {}),
  };
}

function isKeepTaskActivityDefinition(
  activityDefinition: ActivityDefinition
): activityDefinition is ActivityDefinition & {
  houseModuleId: "keep-house";
  taskId: string;
  missionId: string;
  titleTextId: string;
  briefingTextId: string;
  orderLineTextIds: string[];
  keepMinTier: KeepHouseTaskTier;
} {
  return (
    activityDefinition.houseModuleId === "keep-house" &&
    typeof activityDefinition.taskId === "string" &&
    typeof activityDefinition.missionId === "string" &&
    typeof activityDefinition.titleTextId === "string" &&
    typeof activityDefinition.briefingTextId === "string" &&
    Array.isArray(activityDefinition.orderLineTextIds) &&
    typeof activityDefinition.keepMinTier === "string"
  );
}

function resolveKeepDefaultStrategyTitle(textEntriesById: Record<string, string>): string {
  return resolveKeepText(textEntriesById, keepHouseDefaultStrategy.titleTextId);
}

function resolveKeepTaskDefinition(
  input: {
    activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
    textEntriesById?: Record<string, string> | undefined;
  },
  taskId: string
): KeepHouseTaskDefinition {
  const textEntriesById = getKeepTextEntries(input);
  const taskActivityDefinition = Object.values(getKeepActivityDefinitionsById(input))
    .filter(
      (activityDefinition) =>
        isKeepTaskActivityDefinition(activityDefinition) &&
        activityDefinition.taskId === taskId
    )
    .at(-1);
  assertExists(taskActivityDefinition, `Keep house task not found for id "${taskId}".`);
  const {
    taskId: resolvedTaskId,
    missionId,
    titleTextId,
    briefingTextId,
    orderLineTextIds,
    keepMinTier,
  } = taskActivityDefinition;
  assertExists(resolvedTaskId, `Keep house task is missing taskId for "${taskId}".`);
  assertExists(missionId, `Keep house task is missing missionId for "${taskId}".`);
  assertExists(titleTextId, `Keep house task is missing titleTextId for "${taskId}".`);
  assertExists(
    briefingTextId,
    `Keep house task is missing briefingTextId for "${taskId}".`
  );
  assertExists(
    orderLineTextIds,
    `Keep house task is missing orderLineTextIds for "${taskId}".`
  );
  assertExists(
    keepMinTier,
    `Keep house task is missing keepMinTier for "${taskId}".`
  );

  return {
    id: resolvedTaskId,
    missionId,
    title: resolveKeepText(textEntriesById, titleTextId),
    briefing: resolveKeepText(textEntriesById, briefingTextId),
    orderLines: orderLineTextIds.map((textId) =>
      resolveKeepText(textEntriesById, textId)
    ),
    minTier: keepMinTier,
  };
}

function getKeepTaskDefinitions(
  input: {
    activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
    textEntriesById?: Record<string, string> | undefined;
  }
): KeepHouseTaskDefinition[] {
  const byTaskId = new Map<string, KeepHouseTaskDefinition>();

  for (const activityDefinition of Object.values(getKeepActivityDefinitionsById(input))) {
    if (!isKeepTaskActivityDefinition(activityDefinition)) {
      continue;
    }

    byTaskId.set(
      activityDefinition.taskId,
      resolveKeepTaskDefinition(input, activityDefinition.taskId)
    );
  }

  return [...byTaskId.values()];
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
  if (character.stats.fame >= 35) {
    return "commander";
  }
  if (character.stats.fame >= 18) {
    return "officer";
  }
  return "runner";
}

function ensureKeepRuntimeState(
  gameState: HouseModuleDispatchInput["gameState"],
  characterDefinitions: CharacterDefinition[],
  textEntriesById?: Record<string, string> | undefined
): HouseModuleDispatchInput["gameState"] {
  const nextVariables = { ...gameState.runtime.variables };
  const resolvedTextEntriesById = textEntriesById ?? {};

  if (typeof nextVariables[KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown] !== "number") {
    nextVariables[KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown] = 0;
  }

  if (typeof nextVariables[KEEP_HOUSE_VARIABLE_KEYS.currentStrategy] !== "string") {
    nextVariables[KEEP_HOUSE_VARIABLE_KEYS.currentStrategy] = resolveKeepDefaultStrategyTitle(
      resolvedTextEntriesById
    );
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
        gameState.ui.mainHouseMissionText === "review-hall"
          ? "report-to-keep"
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
  input: {
    activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
    textEntriesById?: Record<string, string> | undefined;
  },
  playerCharacter: CharacterDefinition
): KeepHouseTaskDefinition[] {
  const tierOrder: KeepHouseTaskTier[] = ["runner", "officer", "commander"];
  const playerTier = getTaskTier(playerCharacter);

  return getKeepTaskDefinitions(input).filter(
    (taskDefinition) =>
      tierOrder.indexOf(taskDefinition.minTier) <= tierOrder.indexOf(playerTier)
  );
}

function getAudienceGreetingLines(textEntriesById: Record<string, string>): string[] {
  return [
    resolveKeepText(textEntriesById, "runtime.zhu_yuanzhang.keep.audience.greeting.001"),
    resolveKeepText(textEntriesById, "runtime.zhu_yuanzhang.keep.audience.greeting.002"),
  ];
}

function getAudienceOpenLines(textEntriesById: Record<string, string>): string[] {
  return [
    resolveKeepText(textEntriesById, "runtime.zhu_yuanzhang.keep.audience.open.001"),
    resolveKeepText(textEntriesById, "runtime.zhu_yuanzhang.keep.audience.open.002"),
  ];
}

function getMeetingIntroLines(textEntriesById: Record<string, string>): string[] {
  return [
    resolveKeepText(textEntriesById, "runtime.zhu_yuanzhang.keep.review.intro.001"),
    resolveKeepText(textEntriesById, "runtime.zhu_yuanzhang.keep.review.intro.002"),
  ];
}

function getLateMeetingIntroLines(
  textEntriesById: Record<string, string>,
  lateDays: number,
  contributionPenalty: number
): string[] {
  return lateDays > 5
    ? [
        resolveKeepText(textEntriesById, "runtime.zhu_yuanzhang.keep.review.late.heavy.001"),
        resolveKeepTemplateText(
          textEntriesById,
          "runtime.zhu_yuanzhang.keep.review.late.heavy.002",
          { lateDays }
        ),
        resolveKeepTemplateText(
          textEntriesById,
          "runtime.zhu_yuanzhang.keep.review.late.heavy.003",
          { contributionPenalty }
        ),
      ]
    : [
        resolveKeepText(textEntriesById, "runtime.zhu_yuanzhang.keep.review.late.light.001"),
        resolveKeepTemplateText(
          textEntriesById,
          "runtime.zhu_yuanzhang.keep.review.late.light.002",
          { lateDays }
        ),
        resolveKeepTemplateText(
          textEntriesById,
          "runtime.zhu_yuanzhang.keep.review.late.light.003",
          { contributionPenalty }
        ),
      ];
}

function getLateExpulsionLines(
  textEntriesById: Record<string, string>,
  lateDays: number,
  contributionPenalty: number
): string[] {
  return [
    resolveKeepText(textEntriesById, "runtime.zhu_yuanzhang.keep.review.expulsion.001"),
    resolveKeepTemplateText(
      textEntriesById,
      "runtime.zhu_yuanzhang.keep.review.expulsion.002",
      { lateDays }
    ),
    resolveKeepTemplateText(
      textEntriesById,
      "runtime.zhu_yuanzhang.keep.review.expulsion.003",
      { contributionPenalty }
    ),
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
  const effectiveContributionPenalty =
    resolution.severity === "minor"
      ? Math.min(
          resolution.contributionPenalty,
          Math.max(1, resolution.lateDays * 2)
        )
      : resolution.contributionPenalty;
  let nextState = markLateCouncilAttendancePenaltyProcessed({
    ...state,
    runtime: {
      ...state.runtime,
      variables: {
        ...state.runtime.variables,
        [contributionKey]: Math.max(0, currentContribution - effectiveContributionPenalty),
      },
    },
  });
  let nextCharacterDefinitions = characterDefinitions;

  if (resolution.expelled) {
    const playerCharacter = getPlayerCharacter(characterDefinitions, playerCharacterId);
    const expelledPlayer: CharacterDefinition = {
      ...playerCharacter,
      affiliationLabel: "unaffiliated",
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
        mainHouseMissionText: "grain-procurement",
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
    resolution: {
      ...resolution,
      contributionPenalty: effectiveContributionPenalty,
    },
  };
}

function getMeetingPraiseLines(
  lordCharacter: CharacterDefinition,
  contributionEntries: KeepHouseContributionEntry[],
  textEntriesById: Record<string, string>
): string[] {
  const topEntries = contributionEntries.slice(0, 2);
  if (topEntries.length === 0) {
    return [
      resolveKeepTemplateText(
        textEntriesById,
        "runtime.zhu_yuanzhang.keep.review.praise.none.001",
        {
          lordName: lordCharacter.name,
        }
      ),
    ];
  }

  const praiseLines = topEntries.map((entry, index) =>
    resolveKeepTemplateText(
      textEntriesById,
      `runtime.zhu_yuanzhang.keep.review.praise.rank.${String(index + 1).padStart(3, "0")}`,
      {
        lordName: lordCharacter.name,
        entryName: entry.name,
        contribution: entry.contribution,
      }
    )
  );

  return [
    resolveKeepTemplateText(
      textEntriesById,
      "runtime.zhu_yuanzhang.keep.review.praise.header.001",
      {
        lordName: lordCharacter.name,
      }
    ),
    ...praiseLines,
  ];
}

function getMeetingStrategyLines(textEntriesById: Record<string, string>): string[] {
  return keepHouseDefaultStrategy.lineTextIds.map((textId) =>
    resolveKeepText(textEntriesById, textId)
  );
}

function getAssignTaskLines(
  textEntriesById: Record<string, string>,
  playerCharacter: CharacterDefinition,
  availableTasks: KeepHouseTaskDefinition[]
): string[] {
  return [
    resolveKeepTemplateText(
      textEntriesById,
      "runtime.zhu_yuanzhang.keep.review.assign.001",
      {
        playerName: playerCharacter.name,
      }
    ),
    resolveKeepTemplateText(
      textEntriesById,
      "runtime.zhu_yuanzhang.keep.review.assign.002",
      {
        playerName: playerCharacter.name,
        availableTaskList:
          availableTasks.length === 0
            ? "none"
            : availableTasks.map((taskDefinition) => taskDefinition.title).join(", "),
      }
    ),
    resolveKeepText(textEntriesById, "runtime.zhu_yuanzhang.keep.review.assign.003"),
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
  const textEntriesById = getKeepTextEntries(input);
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
        [KEEP_HOUSE_VARIABLE_KEYS.currentStrategy]:
          resolveKeepDefaultStrategyTitle(textEntriesById),
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
        resolveKeepTemplateText(
          textEntriesById,
          "runtime.zhu_yuanzhang.keep.review.assignment.order.001",
          {
            taskTitle: taskDefinition.title,
          }
        ),
      ],
      overlay: createAlertOverlay(
        resolveKeepText(
          textEntriesById,
          "runtime.zhu_yuanzhang.keep.review.assignment.overlay.title"
        ),
        [
          resolveKeepTemplateText(
            textEntriesById,
            "runtime.zhu_yuanzhang.keep.review.assignment.overlay.001",
            {
              taskTitle: taskDefinition.title,
              taskBriefing: taskDefinition.briefing,
            }
          ),
          resolveKeepText(
            textEntriesById,
            "runtime.zhu_yuanzhang.keep.review.assignment.overlay.002"
          ),
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
  const textEntriesById = getKeepTextEntries(input);

  if (input.request.actionId === "advance-keep-dialogue") {
    if (sessionState.mode === "meeting") {
      switch (sessionState.meetingStage) {
        case "intro":
          return withSessionState(input, sessionState, {
            meetingStage: "contribution",
            dialoguePhase: "open",
            overlay: createAlertOverlay(
              "Contribution Report",
              sessionState.contributionEntries.map(
                (entry) => `${entry.name}: ${entry.contribution} contribution`
              )
            ),
          });
        case "praise":
          return withSessionState(input, sessionState, {
            meetingStage: "strategy",
            dialoguePhase: "open",
            dialogueLines: getMeetingStrategyLines(textEntriesById),
          });
        case "strategy":
          return withSessionState(input, sessionState, {
            meetingStage: "assign-task",
            dialoguePhase: "open",
            dialogueLines: getAssignTaskLines(
              textEntriesById,
              playerCharacter,
              getAvailableTasks(input, playerCharacter)
            ),
          });
        default:
          return createTransitionResult(input);
      }
    }

    return withSessionState(input, sessionState, {
      meetingStage: "finished",
      dialoguePhase: "open",
      dialogueLines: getAudienceOpenLines(textEntriesById),
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
          sessionState.contributionEntries,
          textEntriesById
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
      dialogueLines: getAudienceOpenLines(textEntriesById),
    });
  }

  const selectedTaskId = parseTaskActionId(input.request.actionId);
  if (selectedTaskId != null) {
    const taskDefinition = resolveKeepTaskDefinition(input, selectedTaskId);
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
    confirmLabel: "Close",
  };
}

export const keepHouseHouseModule: HouseModuleDefinition<"keep-house"> = {
  moduleId: "keep-house",
  enter(input) {
    const textEntriesById = getKeepTextEntries(input);
    const preparedState = ensureKeepRuntimeState(
      input.gameState,
      input.characterDefinitions,
      input.textEntriesById
    );
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
            ? getMeetingIntroLines(textEntriesById)
            : getLateMeetingIntroLines(
                textEntriesById,
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
                textEntriesById,
                lateAttendance.resolution.lateDays,
                lateAttendance.resolution.contributionPenalty
              )
            : getAudienceGreetingLines(textEntriesById),
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
              "expelled",
              [
                `Late by ${lateAttendance.resolution?.lateDays ?? 0} days.`, 
                `Penalty ${lateAttendance.resolution?.contributionPenalty ?? 0} contribution, then expelled from the camp.`, 
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
    const nextState = ensureKeepRuntimeState(
      input.gameState,
      input.characterDefinitions,
      input.textEntriesById
    );
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
        getAudienceGreetingLines(getKeepTextEntries(input)),
        createContributionEntries(nextState, input.characterDefinitions, lordCharacter.clanId)
      );
    const currentStrategy = readStringVariable(
      nextState,
      KEEP_HOUSE_VARIABLE_KEYS.currentStrategy,
      resolveKeepDefaultStrategyTitle(getKeepTextEntries(input))
    );
    const countdown = readNumericVariable(
      nextState,
      KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown,
      0
    );
    const availableTasks = getAvailableTasks(input, playerCharacter);
    const assignedTask =
      sessionState.selectedTaskId == null
        ? null
        : resolveKeepTaskDefinition(input, sessionState.selectedTaskId);
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
        ? "none"
        : nextState.ui.mainHouseMissionText);
    const strategySubtitle =
      sessionState.mode === "meeting"
        ? "review / assembled officers"
        : `${lordCharacter.title ?? "lord"} / command`;

    return {
      moduleId: "keep-house",
      houseId: input.houseDefinition.id,
      sceneTitle: input.houseDefinition.name,
      sceneSubtitle: "keep / review and command",
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
                ? "Continue"
                : null,
          },
      actionContainer: shouldShowMeetingTasks
        ? {
            title: "Current Orders",
            actions: availableTasks.map<HouseActionViewModel>((taskDefinition) => ({
              id: `${ASSIGN_TASK_ACTION_PREFIX}${taskDefinition.id}`,
              label: taskDefinition.title,
            })),
          }
        : sessionState.mode === "audience" && sessionState.dialoguePhase === "open"
          ? {
              title: "Audience Actions",
              actions: [
                { id: "dismiss-dialogue", label: "Dismiss" },
              ],
            }
          : null,
      statusCard: {
        eyebrow: "Keep",
        title: currentStrategy,
        subtitle: strategySubtitle,
        metrics: [
          { label: "Commander", value: lordCharacter.name },
          { label: "Review Countdown", value: `${countdown} days` },
          { label: "Top Merit", value: sessionState.contributionEntries[0]?.name ?? "none" },
          { label: "Current Duty", value: statusTaskText },
        ],
      },
      overlay: selectOverlayViewModel(sessionState.overlay),
      leaveAction: {
        id: "leave-house",
        label: "Leave",
        ...(sessionState.dialoguePhase === "idle" ? { tone: "accent" } : {}),
      },
    };
  },
};

