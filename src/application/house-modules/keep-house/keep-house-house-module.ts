import {
  keepHouseDefaultContributions,
  keepHouseDefaultStrategy,
} from "../../../content/houses/keep-house-content";
import {
  defaultPackActivities,
  defaultPackTextEntries,
} from "../../content/pack-content-access";
import type { ActivityDefinition } from "../../../domain/activity";
import type { CharacterDefinition } from "../../../domain/character";
import type { CalendarDate, GameState } from "../../../domain/game-state";
import type {
  HouseActionViewModel,
  HouseModuleDefinition,
  HouseModuleDispatchInput,
  HouseModuleEnterInput,
  HouseModuleTransitionResult,
  HouseModuleViewModelInput,
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
import {
  createReviewTaskChoiceViewModels,
  readFactionMerit,
  RED_TURBAN_FACTION_RANKS,
  resolveFactionMeritRank,
  resolveReviewCompletionGrade,
} from "../../review/faction-review";
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
import {
  completeMeetingToHost,
  launchMeetingFromHostAction,
  resumeMeetingFromHostSession,
} from "../../meeting/meeting-host-bridge";
import { matchHostedMeetingSettlementHandoff } from "../../meeting/meeting-host-settlement-handoff";
import { createInitialKeepHouseSessionState } from "./keep-house-session-state";
import {
  resolveKeepReviewExpulsionSeed,
  resolveKeepReviewTaskAssignmentSeed,
} from "./keep-review-assignment-defaults";

const ASSIGN_TASK_ACTION_PREFIX = "assign-keep-task:";

const defaultZhuyuanzhangActivities =
  defaultPackActivities as ActivityDefinition[];
const defaultZhuyuanzhangTextEntries = defaultPackTextEntries;
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
  reviewMinRankId?: string;
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

function getFallbackKeepTaskRankId(minTier: KeepHouseTaskTier): string {
  switch (minTier) {
    case "commander":
      return "red_turban.zhenfu";
    case "officer":
      return "red_turban.guard_captain";
    case "runner":
      return "red_turban.bodyguard";
  }
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
    reviewMinRankId,
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
    minRankId: reviewMinRankId ?? getFallbackKeepTaskRankId(keepMinTier),
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

function createKeepHostedReviewAssignmentRows(
  contributionEntries: KeepHouseContributionEntry[]
) {
  return contributionEntries.map((entry) => ({
    characterId: entry.characterId,
    characterName: entry.name,
    assignmentTitle: entry.title ?? "本期军务",
    contribution: entry.contribution,
    grade: resolveReviewCompletionGrade(entry.contribution),
  }));
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

function getKeepMeetingParticipantIds(
  houseCharacterIds: string[],
  playerCharacterId: string,
  lordCharacterId: string
): string[] {
  return [...new Set([playerCharacterId, lordCharacterId, ...houseCharacterIds])];
}

function tryLaunchKeepReviewMeeting(
  input: HouseModuleEnterInput<"keep-house">,
  gameState: GameState,
  sessionState: KeepHouseSessionState
): HouseModuleTransitionResult<"keep-house"> | null {
  if (
    input.meetingDefinitionsById == null ||
    input.meetingBindings == null ||
    input.houseDefinition.defaultCharacterId == null
  ) {
    return null;
  }

  const lordCharacter = getLordCharacter(
    input.characterDefinitions,
    input.houseDefinition.defaultCharacterId
  );
  const reviewMeetingDefinition =
    input.meetingDefinitionsById?.["meeting.keep.review"] ?? null;
  const reviewAssignmentRowsByPanelId =
    reviewMeetingDefinition == null
      ? null
      : Object.fromEntries(
          Object.values(reviewMeetingDefinition.stagesById)
            .filter(
              (stage) => stage.type === "assignment-table" && stage.panelId != null
            )
            .map((stage) => [
              stage.panelId,
              createKeepHostedReviewAssignmentRows(sessionState.contributionEntries),
            ])
        );
  const launchedMeeting = launchMeetingFromHostAction({
    hostContext: {
      hostFamily: "building",
      hostId: input.houseDefinition.id,
      returnTarget: {
        type: "building",
        id: input.houseDefinition.id,
      },
      primarySpeakerCharacterId: lordCharacter.id,
      participantCharacterIds: getKeepMeetingParticipantIds(
        input.houseDefinition.characterIds,
        input.playerCharacterId,
        lordCharacter.id
      ),
    },
    trigger: {
      action: "building-container-item-action",
      itemId: "review",
    },
    ...(reviewAssignmentRowsByPanelId == null
      ? {}
      : {
          initialDerivedState: {
            reviewAssignmentRowsByPanelId,
          },
        }),
    hostSessionState: sessionState,
    sharedSessionState: input.sharedSessionState ?? null,
    gameState,
    characterDefinitions: input.characterDefinitions,
    meetingsById: input.meetingDefinitionsById,
    meetingBindings: input.meetingBindings,
    meetingPanelsById: input.meetingPanelsById,
    meetingChoiceSetsById: input.meetingChoiceSetsById,
    meetingActionSetsById: input.meetingActionSetsById,
  });

  if (launchedMeeting.sharedSessionState?.hostedMeeting == null) {
    return null;
  }

  return {
    gameState: launchedMeeting.gameState,
    characterDefinitions: launchedMeeting.characterDefinitions,
    sessionState: launchedMeeting.hostSessionState,
    sharedSessionState: launchedMeeting.sharedSessionState,
  };
}

function createKeepMeetingHostContext(
  input: Pick<
    HouseModuleViewModelInput<"keep-house">,
    "houseDefinition" | "playerCharacterId" | "characterDefinitions"
  >
) {
  if (input.houseDefinition.defaultCharacterId == null) {
    return null;
  }

  const lordCharacter = getLordCharacter(
    input.characterDefinitions,
    input.houseDefinition.defaultCharacterId
  );
  return {
    hostFamily: "building" as const,
    hostId: input.houseDefinition.id,
    returnTarget: {
      type: "building" as const,
      id: input.houseDefinition.id,
    },
    primarySpeakerCharacterId: lordCharacter.id,
    participantCharacterIds: getKeepMeetingParticipantIds(
      input.houseDefinition.characterIds,
      input.playerCharacterId,
      lordCharacter.id
    ),
  };
}

function resumeKeepHostedMeeting(
  input: Pick<
    HouseModuleViewModelInput<"keep-house">,
    | "gameState"
    | "characterDefinitions"
    | "houseDefinition"
    | "playerCharacterId"
    | "sharedSessionState"
    | "meetingDefinitionsById"
    | "meetingBindings"
    | "meetingPanelsById"
    | "meetingChoiceSetsById"
    | "meetingActionSetsById"
  >,
  sessionState: KeepHouseSessionState,
  request?: { type: "advance" } | { type: "select-choice"; choiceId: string }
) {
  if (
    input.sharedSessionState?.hostedMeeting == null ||
    input.meetingDefinitionsById == null ||
    input.meetingBindings == null
  ) {
    return null;
  }

  const hostContext = createKeepMeetingHostContext(input);
  if (hostContext == null) {
    return null;
  }

  return resumeMeetingFromHostSession({
    hostContext,
    hostSessionState: sessionState,
    sharedSessionState: input.sharedSessionState,
    gameState: input.gameState,
    characterDefinitions: input.characterDefinitions,
    meetingsById: input.meetingDefinitionsById,
    meetingBindings: input.meetingBindings,
    meetingPanelsById: input.meetingPanelsById,
    meetingChoiceSetsById: input.meetingChoiceSetsById,
    meetingActionSetsById: input.meetingActionSetsById,
    ...(request == null ? {} : { request }),
  });
}

function resolveKeepHostedMeetingRequest(
  actionId: string,
  actionContainer:
    | HouseModuleViewModel["actionContainer"]
    | null
    | undefined
): { type: "advance" } | { type: "select-choice"; choiceId: string } | null {
  if (
    actionId === "advance-meeting-stage" ||
    actionId === "close-review-assignment-table" ||
    actionId === "close-review-policy-panel"
  ) {
    return { type: "advance" };
  }

  if (actionContainer?.actions.some((action) => action.id === actionId)) {
    return {
      type: "select-choice",
      choiceId: actionId,
    };
  }

  return null;
}

function getReviewTaskChoices(
  input: {
    activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
    textEntriesById?: Record<string, string> | undefined;
    gameState: GameState;
  },
  playerCharacter: CharacterDefinition
): ReturnType<typeof createReviewTaskChoiceViewModels> {
  const playerMerit = readFactionMerit(
    input.gameState,
    "red_turban",
    playerCharacter.id
  );
  const playerRank = resolveFactionMeritRank(
    RED_TURBAN_FACTION_RANKS,
    playerMerit
  );

  return createReviewTaskChoiceViewModels({
    currentRankId: playerRank.id,
    ranks: RED_TURBAN_FACTION_RANKS,
    tasks: getKeepTaskDefinitions(input).map((taskDefinition) => ({
      id: taskDefinition.id,
      label: taskDefinition.title,
      minRankId: taskDefinition.minRankId,
    })),
  });
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
    const expulsionSeed = resolveKeepReviewExpulsionSeed();
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
        reviewDateText: formatReviewDateText(expulsionSeed.reviewCountdownDays),
        mainHouseMissionText: expulsionSeed.fallbackMissionText,
      },
      runtime: {
        ...nextState.runtime,
        variables: {
          ...nextState.runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]:
            expulsionSeed.reviewCountdownDays,
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

function parseTaskActionId(actionId: string): string | null {
  return actionId.startsWith(ASSIGN_TASK_ACTION_PREFIX)
    ? actionId.slice(ASSIGN_TASK_ACTION_PREFIX.length)
    : null;
}

function assignTaskToPlayer(
  input: HouseModuleDispatchInput<"keep-house">,
  taskDefinition: KeepHouseTaskDefinition
): HouseModuleTransitionResult<"keep-house"> {
  const assignmentSeed = resolveKeepReviewTaskAssignmentSeed();
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
      reviewDateText: formatReviewDateText(assignmentSeed.reviewCountdownDays),
      mainHouseMissionText: taskDefinition.title,
    },
    runtime: {
      ...input.gameState.runtime,
      variables: {
        ...input.gameState.runtime.variables,
        [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]:
          assignmentSeed.reviewCountdownDays,
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
          assignmentSeed.orderSummaryTextId,
          {
            taskTitle: taskDefinition.title,
          }
        ),
      ],
      overlay: createAlertOverlay(
        resolveKeepText(
          textEntriesById,
          assignmentSeed.overlayTitleTextId
        ),
        [
          resolveKeepTemplateText(
            textEntriesById,
            assignmentSeed.overlayBodyTemplateTextId,
            {
              taskTitle: taskDefinition.title,
              taskBriefing: taskDefinition.briefing,
            }
          ),
          resolveKeepText(
            textEntriesById,
            assignmentSeed.overlaySharedTextId
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
  const hostedSettlementResult = matchHostedMeetingSettlementHandoff({
    input,
    sessionState,
    hostedMeetingId: "meeting.keep.review",
    resolvePayload: parseTaskActionId,
    settle: (selectedTaskId) => {
      const taskDefinition = resolveKeepTaskDefinition(input, selectedTaskId);
      const taskChoice = getReviewTaskChoices(input, playerCharacter).find(
        (choice) => choice.id === selectedTaskId
      );
      if (taskChoice?.disabled === true) {
        return withSessionState(input, sessionState, {
          overlay: createAlertOverlay(
            "身份不足",
            [`此委任最低身份为${taskChoice.minRankLabel}。`],
            "warning"
          ),
        });
      }

      return assignTaskToPlayer(input, taskDefinition);
    },
  });
  if (hostedSettlementResult != null) {
    return hostedSettlementResult;
  }
  const hostedMeetingResult = resumeKeepHostedMeeting(
    {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      houseDefinition: input.houseDefinition,
      playerCharacterId: input.playerCharacterId,
      sharedSessionState: input.sharedSessionState ?? null,
      meetingDefinitionsById: input.meetingDefinitionsById,
      meetingBindings: input.meetingBindings,
      meetingPanelsById: input.meetingPanelsById,
      meetingChoiceSetsById: input.meetingChoiceSetsById,
      meetingActionSetsById: input.meetingActionSetsById,
    },
    sessionState
  );
  const hostedMeetingRequest =
    hostedMeetingResult == null
      ? null
      : resolveKeepHostedMeetingRequest(
          input.request.actionId,
          hostedMeetingResult.presenterModel?.actionContainer
        );
  if (hostedMeetingResult != null && hostedMeetingRequest != null) {
    const advancedMeetingResult = completeMeetingToHost(
      resumeKeepHostedMeeting(
        {
          gameState: input.gameState,
          characterDefinitions: input.characterDefinitions,
          houseDefinition: input.houseDefinition,
          playerCharacterId: input.playerCharacterId,
          sharedSessionState: input.sharedSessionState ?? null,
          meetingDefinitionsById: input.meetingDefinitionsById,
          meetingBindings: input.meetingBindings,
          meetingPanelsById: input.meetingPanelsById,
          meetingChoiceSetsById: input.meetingChoiceSetsById,
          meetingActionSetsById: input.meetingActionSetsById,
        },
        sessionState,
        hostedMeetingRequest
      ) ?? hostedMeetingResult
    );

    return {
      gameState: advancedMeetingResult.gameState,
      characterDefinitions: advancedMeetingResult.characterDefinitions,
      sessionState:
        advancedMeetingResult.sharedSessionState == null &&
        advancedMeetingResult.completion?.type === "return-to-host"
          ? {
              ...createInitialKeepHouseSessionState(
                "audience",
                "finished",
                getAudienceGreetingLines(textEntriesById),
                sessionState.contributionEntries
              ),
              dialoguePhase: "idle",
            }
          : advancedMeetingResult.hostSessionState,
      sharedSessionState: advancedMeetingResult.sharedSessionState,
    };
  }

  if (input.request.actionId === "close-alert") {
    return withSessionState(input, sessionState, {
      overlay: null,
      ...(sessionState.mode === "meeting" && sessionState.meetingStage === "assigned"
        ? {
            meetingStage: "finished",
            dialoguePhase: "idle",
          }
        : {}),
    });
  }

  if (
    input.request.actionId === "advance-keep-dialogue" &&
    sessionState.mode === "audience" &&
    sessionState.meetingStage === "finished" &&
    sessionState.dialoguePhase === "greeting"
  ) {
    return withSessionState(input, sessionState, {
      meetingStage: "finished",
      dialoguePhase: "open",
      dialogueLines: getAudienceOpenLines(textEntriesById),
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
    confirmLabel: "关闭",
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
    const reviewHostSessionState = createInitialKeepHouseSessionState(
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
    );
    const audienceSessionState = createInitialKeepHouseSessionState(
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

    if (shouldStartMeeting) {
      const launchedMeetingResult = tryLaunchKeepReviewMeeting(
        input,
        nextState,
        reviewHostSessionState
      );
      if (launchedMeetingResult != null) {
        return launchedMeetingResult;
      }
    }

    const baseSessionState = shouldStartMeeting
      ? audienceSessionState
      : audienceSessionState;

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
    const sessionState =
      input.sessionState ??
      createInitialKeepHouseSessionState(
        "audience",
        "finished",
        getAudienceGreetingLines(getKeepTextEntries(input)),
        createContributionEntries(nextState, input.characterDefinitions, lordCharacter.clanId)
      );
    const isHostedMeetingActive = input.sharedSessionState?.hostedMeeting != null;
    const hostedMeetingPresenter = resumeKeepHostedMeeting(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
        houseDefinition: input.houseDefinition,
        playerCharacterId: input.playerCharacterId,
        sharedSessionState: input.sharedSessionState ?? null,
        meetingDefinitionsById: input.meetingDefinitionsById,
        meetingBindings: input.meetingBindings,
        meetingPanelsById: input.meetingPanelsById,
        meetingChoiceSetsById: input.meetingChoiceSetsById,
        meetingActionSetsById: input.meetingActionSetsById,
      },
      sessionState
    )?.presenterModel;
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
    const assignedTask =
      sessionState.selectedTaskId == null
        ? null
        : resolveKeepTaskDefinition(input, sessionState.selectedTaskId);
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
      dialogue: isHostedMeetingActive
        ? hostedMeetingPresenter?.dialogue ?? null
        : !shouldShowDialogue
          ? null
          : {
              mode: "character",
              speakerName: lordCharacter.name,
              characterId: lordCharacter.id,
              position: "right",
              textLines: sessionState.dialogueLines,
              advanceActionId:
                sessionState.overlay == null &&
                sessionState.mode === "audience" &&
                sessionState.meetingStage === "finished" &&
                sessionState.dialoguePhase === "greeting"
                  ? "advance-keep-dialogue"
                  : null,
              advanceHintText:
                sessionState.overlay == null &&
                sessionState.mode === "audience" &&
                sessionState.meetingStage === "finished" &&
                sessionState.dialoguePhase === "greeting"
                  ? "继续"
                  : null,
            },
      actionContainer: isHostedMeetingActive
        ? hostedMeetingPresenter?.actionContainer ?? null
        : sessionState.mode === "audience" && sessionState.dialoguePhase === "open"
          ? {
              title: "Audience Actions",
              actions: [
                { id: "dismiss-dialogue", label: "离开" },
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
      overlay: isHostedMeetingActive
        ? hostedMeetingPresenter?.overlay ?? null
        : selectOverlayViewModel(sessionState.overlay),
      leaveAction: {
        id: "leave-house",
        label: "Leave",
        ...(sessionState.dialoguePhase === "idle" ? { tone: "accent" } : {}),
      },
    };
  },
};
