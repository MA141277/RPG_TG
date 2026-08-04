import {
  defaultPackActivities,
  defaultPackTextEntries,
} from "../../content/pack-content-access";
import type { ActivityDefinition } from "../../../domain/activity";
import type {
  ActivityFortuneBoardSession,
  ActivityPachinkoBoardSession,
} from "../../../domain/activity-session";
import {
  FORTUNE_BOARD_DEFAULT_ANIMATION_TICK_MS,
  FORTUNE_BOARD_MAX_ANIMATION_TICK_MS,
  FORTUNE_BOARD_MIN_ANIMATION_TICK_MS,
  PACHINKO_BOARD_DEFAULT_ANIMATION_TICK_MS,
} from "../../../domain/activity-session";
import type { CharacterDefinition } from "../../../domain/character";
import type { RuntimeDialogueDefinition } from "../../../domain/dialogue";
import type { CalendarDate, GameState } from "../../../domain/game-state";
import type { HouseDefinition } from "../../../domain/house";
import type { HouseActivityConfirmOverlayState } from "../../../domain/house-activity";
import type { MeetingSessionState } from "../../../domain/meeting/meeting-session";
import type {
  ReviewAssignmentRow,
  ReviewPersonnelChange,
  ReviewPolicyPanel,
} from "../../../domain/review";
import type {
  ActiveHouseModuleSession,
  HouseActionContainerViewModel,
  HouseActionViewModel,
  HouseModuleDefinition,
  HouseModuleDispatchInput,
  HouseModuleEnterInput,
  HouseModuleSideEffect,
  HouseModuleTransitionResult,
  HouseModuleViewModelInput,
  HouseModuleViewModel,
  HouseOverlayViewModel,
  MapAutoAdvanceSnapshot,
} from "../../../domain/house-module";
import type { TempleHouseTaskDefinition } from "../../../domain/temple-house";
import { TEMPLE_HOUSE_VARIABLE_KEYS } from "../../../domain/temple-house";
import {
  formatGrainAsDou,
  formatGrainAsShiAndDou,
} from "../../../domain/grain-unit";
import type {
  TempleHouseMeetingStage,
  TempleHouseOverlayState,
  TempleHouseQteOverlayState,
  TempleHouseSessionState,
  TempleHouseWorkPlan,
} from "../../../domain/house-modules/temple-house-session";
import { KEEP_HOUSE_VARIABLE_KEYS } from "../../../domain/keep-house";
import {
  createLaunchPlayableRequest,
  createPlayableActionRequest,
  runPlayableRuntime,
} from "../../../core/runtime/playable-runtime";
import {
  isZhuYuanzhangBeggingJourneyStage,
  isZhuYuanzhangMonkStoryStage,
  ZHU_YUANZHANG_STORY_FLAG_KEYS,
  ZHU_YUANZHANG_STORY_STAGES,
  ZHU_YUANZHANG_STORY_VARIABLE_KEYS,
  readZhuYuanzhangStoryStage,
} from "../../../domain/zhu-yuanzhang-story";
import { assertExists } from "../../../shared/assert";
import {
  ensurePlayerGrainInventory,
  mutatePlayerGrainDou,
  readPlayerGrainDou,
} from "../../inventory/trade-inventory";
import {
  ACTIVITY_COMPLETION_STAMINA_COST,
  canAffordActivityCost,
  spendPlayerStamina,
} from "../../player/player-stamina";
import {
  convertHouseActivityDaysToSegments,
  formatHouseActivityCostLine,
  getHouseWorkDurationDays,
} from "../../house/house-activity-costs";
import {
  applyHouseModulePackEventById,
  applyHouseModulePackEventByItemId,
  launchHouseModulePackPlayableByItemId,
  readHouseModulePackEventByItemId,
} from "../../house/house-module-pack-event-runtime";
import { orderHouseStandbyRoster } from "../../house/house-primary-actor-roster";
import { HOUSE_MAP_AUTO_ADVANCE_DAY_INTERVAL_MS } from "../../house/map-auto-advance";
import {
  createHousePlayableRuntimeState,
  readHousePlayableSessionState,
} from "../../playables/house-playable-runtime-bridge";
import {
  markLateCouncilAttendancePenaltyProcessed,
  resolveLateCouncilAttendance,
} from "../../time/council-attendance";
import {
  getInsufficientDaysForTimedActivity,
  hasReachedCouncilDate,
} from "../../time/council-priority";
import {
  advanceGameStateOneDay,
  formatCouncilStatusText,
  getCouncilStatusText,
} from "../../time/time-progression";
import {
  resolveTextEntry,
  resolveTextTemplateEntry,
} from "../../content/text-resolution";
import {
  applyReviewItemReward,
  createReviewTaskChoiceViewModels,
  formatReviewPersonnelChangeLines,
  getFactionRankPersonnelTitle,
  getDefaultReviewSpecialTaskHookResult,
  isReviewTopRankRewardEligible,
  readFactionMerit,
  resolveFactionMeritRank,
  resolveReviewCompletionGrade,
  settleFactionReviewPersonnel,
  TEMPLE_TOP_RANK_REWARD,
  TEMPLE_FACTION_RANKS,
  writeFactionMerit,
} from "../../review/faction-review";
import {
  completeMeetingToHost,
  launchMeetingFromHostAction,
  resumeMeetingFromHostSession,
} from "../../meeting/meeting-host-bridge";
import { matchHostedMeetingStageHandoff } from "../../meeting/meeting-host-stage-handoff";
import { matchHostedMeetingSettlementHandoff } from "../../meeting/meeting-host-settlement-handoff";
import { createInitialTempleHouseSessionState } from "./temple-house-session-state";
import {
  resolveTempleReviewTaskAssignmentSeed,
  resolveTempleReviewWorkPlanAssignmentSeed,
} from "./temple-review-assignment-defaults";
import { resolveTempleStaticTextDefaults } from "./temple-house-static-defaults";

const DONATION_AMOUNT = 50;
const ASSIGN_TEMPLE_TASK_ACTION_PREFIX = "assign-temple-task:";
const CONFIRM_START_TEMPLE_TASK_ACTION_PREFIX = "confirm-start-temple-task:";
const QUICK_COMPLETE_TEMPLE_TASK_ACTION_PREFIX = "quick-complete-temple-task:";
const TEMPLE_WORK_PLAY_ACTION_ID = "temple-work-board-play";
const TEMPLE_WORK_WAGER_MINUS_ACTION_ID = "temple-work-board-wager-minus";
const TEMPLE_WORK_WAGER_PLUS_ACTION_ID = "temple-work-board-wager-plus";
const TEMPLE_WORK_SPEED_FIELD_ID = "temple-work-board-speed";
const SELECT_REVIEW_WORK_ACTION_PREFIX = "select-review-work:";
const TEMPLE_REVIEW_GIVE_ADVICE_ACTION_ID = "temple-review-give-advice";
const TEMPLE_REVIEW_STAY_SILENT_ACTION_ID = "temple-review-stay-silent";
const OPEN_TEMPLE_WORK_MENU_ACTION_ID = "open-temple-work-menu";
const CLOSE_TEMPLE_WORK_MENU_ACTION_ID = "close-temple-work-menu";
const OPEN_TEMPLE_REST_MENU_ACTION_ID = "open-temple-rest-menu";
const CLOSE_TEMPLE_REST_MENU_ACTION_ID = "close-temple-rest-menu";
const OPEN_TEMPLE_REST_DAYS_ACTION_ID = "open-temple-rest-days";
const CONFIRM_TEMPLE_REST_DAYS_ACTION_ID = "confirm-temple-rest-days";
const TEMPLE_REST_ONE_DAY_ACTION_ID = "temple-rest-one-day";
const TEMPLE_REST_UNTIL_COUNCIL_ACTION_ID = "temple-rest-until-council";
const TEMPLE_REST_UNTIL_RECOVERED_ACTION_ID = "temple-rest-until-recovered";
const TEMPLE_REST_DAYS_FIELD_ID = "temple-house-rest-days";
const CLOSE_TEMPLE_LEAVE_REFUSAL_ACTION_ID = "close-temple-leave-refusal";
const SUBMIT_TEMPLE_BEGGING_FOOD_ACTION_ID = "submit-temple-begging-food";
const TEMPLE_BEGGING_SUBMIT_FIELD_ID = "temple-begging-submit-quantity";
const CONFIRM_TEMPLE_BEGGING_FOOD_ACTION_ID = "confirm-temple-begging-food";
const CANCEL_TEMPLE_BEGGING_FOOD_ACTION_ID = "cancel-temple-begging-food";
const DECREMENT_TEMPLE_BEGGING_FOOD_ACTION_ID = "decrement-temple-begging-food";
const INCREMENT_TEMPLE_BEGGING_FOOD_ACTION_ID = "increment-temple-begging-food";
const TEMPLE_WORK_INTERVAL_ID = "temple-house-work-qte";
const TEMPLE_REVIEW_AUTO_ADVANCE_INTERVAL_ID = "temple-review-auto-advance";
const TEMPLE_REST_AUTO_ADVANCE_INTERVAL_ID = "temple-rest-auto-advance";
const TEMPLE_WORK_TOTAL_ROUNDS = 3;
const TEMPLE_WORK_MARKER_STEP = 7;
const TEMPLE_WORK_REQUIRED_SUCCESSES = 2;
const TEMPLE_ACTIVITY_QTE_INTEGRATION_ID = "playable.activity-qte.house.temple";
const TEMPLE_LEAVE_EVENT_ID = "event.building.template.house.temple.leave";
const TEMPLE_REST_MAX_DAYS = 99;
const TEMPLE_REST_BASE_RECOVERY = 12;
const CANCEL_ACTIVITY_CONFIRM_ACTION_ID = "cancel-activity-confirm";

const defaultZhuyuanzhangActivities =
  defaultPackActivities as ActivityDefinition[];
const defaultZhuyuanzhangTextEntries = defaultPackTextEntries;

function getTempleTextEntries(
  textEntriesById?: Record<string, string>
): Record<string, string> {
  return textEntriesById == null
    ? defaultZhuyuanzhangTextEntries
    : {
        ...defaultZhuyuanzhangTextEntries,
        ...textEntriesById,
      };
}

function resolveTempleText(
  textEntriesById: Record<string, string> | undefined,
  textId: string
): string {
  return resolveTextEntry(
    getTempleTextEntries(textEntriesById),
    textId,
    `MISSING_TEXT:${textId}`
  );
}

function resolveTempleTemplateText(
  textEntriesById: Record<string, string> | undefined,
  textId: string,
  values: Record<string, string | number | boolean | null | undefined>
): string {
  return resolveTextTemplateEntry(
    getTempleTextEntries(textEntriesById),
    textId,
    values,
    `MISSING_TEXT:${textId}`
  );
}

function resolveTempleDialogueTextLine(
  textEntriesById: Record<string, string> | undefined,
  textId: string | undefined,
  text: string | undefined
): string | null {
  if (typeof text === "string" && text.trim().length > 0) {
    return text.trim();
  }
  if (typeof textId === "string" && textId.trim().length > 0) {
    return resolveTempleText(textEntriesById, textId.trim());
  }
  return null;
}

function readTempleDialogueParagraphs(
  dialogueDefinition: RuntimeDialogueDefinition | null,
  textEntriesById: Record<string, string> | undefined
): string[] {
  if (dialogueDefinition == null) {
    return [];
  }

  if (Array.isArray(dialogueDefinition.nodes)) {
    const nodeLines = dialogueDefinition.nodes.flatMap((node) => {
      if (node.type !== "narration" && node.type !== "dialogue") {
        return [];
      }

      const line = resolveTempleDialogueTextLine(
        textEntriesById,
        node.textId,
        node.text
      );
      return line == null ? [] : [line];
    });
    if (nodeLines.length > 0) {
      return nodeLines;
    }
  }

  const screen = dialogueDefinition.screen;
  if (screen == null) {
    return [];
  }

  const screenLine = resolveTempleDialogueTextLine(
    textEntriesById,
    screen.textId,
    undefined
  );
  return screenLine == null ? [] : [screenLine];
}

function readTemplePackBoundDialogueParagraphs(
  input: Pick<
    HouseModuleViewModelInput<"temple-house">,
    | "gameState"
    | "houseDefinition"
    | "eventDefinitionsById"
    | "eventBindings"
    | "dialogueDefinitionsById"
    | "textEntriesById"
  >,
  itemId: string
): string[] | null {
  const eventDefinition = readHouseModulePackEventByItemId({
    state: input.gameState,
    eventDefinitionsById: input.eventDefinitionsById,
    eventBindings: input.eventBindings,
    houseId: input.houseDefinition.id,
    itemId,
  });
  const dialogueId =
    typeof eventDefinition?.dialogueId === "string" &&
    eventDefinition.dialogueId.trim().length > 0
      ? eventDefinition.dialogueId.trim()
      : null;
  if (dialogueId == null) {
    return null;
  }

  const paragraphs = readTempleDialogueParagraphs(
    input.dialogueDefinitionsById?.[dialogueId] ?? null,
    input.textEntriesById
  );
  return paragraphs.length > 0 ? paragraphs : null;
}

function getTempleReviewEntryLines(
  input: Pick<
    HouseModuleViewModelInput<"temple-house">,
    | "gameState"
    | "houseDefinition"
    | "eventDefinitionsById"
    | "eventBindings"
    | "dialogueDefinitionsById"
    | "textEntriesById"
    | "houseModuleDefaults"
  >
): string[] {
  return (
    readTemplePackBoundDialogueParagraphs(input, "review") ??
    getTempleMeetingIntroLines(
      input.textEntriesById,
      input.houseModuleDefaults
    )
  );
}

type TempleTaskActivityDefinition = ActivityDefinition & {
  houseModuleId: "temple-house";
  taskId: string;
  missionId: string;
  titleTextId: string;
  briefingTextId: string;
  orderLineTextIds: string[];
  reviewMinRankId?: string;
};

function isTempleTaskActivityDefinition(
  activityDefinition: ActivityDefinition
): activityDefinition is TempleTaskActivityDefinition {
  return (
    activityDefinition.houseModuleId === "temple-house" &&
    typeof activityDefinition.taskId === "string" &&
    typeof activityDefinition.missionId === "string" &&
    typeof activityDefinition.titleTextId === "string" &&
    typeof activityDefinition.briefingTextId === "string" &&
    Array.isArray(activityDefinition.orderLineTextIds)
  );
}

const defaultTempleTaskActivityDefinitions =
  defaultZhuyuanzhangActivities.filter(isTempleTaskActivityDefinition);

function getTempleGreetingLines(
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): string[] {
  return resolveTempleStaticTextDefaults(houseModuleDefaults).greetingTextIds.map(
    (textId) => resolveTempleText(textEntriesById, textId)
  );
}

function getTempleOpenLines(
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): string[] {
  return resolveTempleStaticTextDefaults(houseModuleDefaults).openTextIds.map(
    (textId) => resolveTempleText(textEntriesById, textId)
  );
}

function getTempleRestMenuLines(
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): string[] {
  return resolveTempleStaticTextDefaults(houseModuleDefaults).restMenuTextIds.map(
    (textId) => resolveTempleText(textEntriesById, textId)
  );
}

function getTempleMeetingIntroLines(
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): string[] {
  return resolveTempleStaticTextDefaults(
    houseModuleDefaults
  ).meetingIntroTextIds.map((textId) => resolveTempleText(textEntriesById, textId));
}

function getTempleLeaveRefusalLines(
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): string[] {
  return resolveTempleStaticTextDefaults(
    houseModuleDefaults
  ).leaveRefusalTextIds.map((textId) => resolveTempleText(textEntriesById, textId));
}

function getTempleBegAlmsWorkPlanTextId(
  gameState: GameState,
  allowLockedLabel = false,
  houseModuleDefaults?: Record<string, unknown>
): string {
  const workPlanTextIds = resolveTempleStaticTextDefaults(
    houseModuleDefaults
  ).workPlanTextIds;
  if (
    isFourthTempleWeekAssignmentPending(gameState) ||
    (isBeggingJourneyStage(gameState) && getTempleWeek(gameState) >= 4)
  ) {
    return workPlanTextIds.begAlmsFourthWeek;
  }

  if (
    isThirdTempleWeekAssignmentPending(gameState) ||
    (isBeggingJourneyStage(gameState) && getTempleWeek(gameState) < 4)
  ) {
    return workPlanTextIds.begAlmsThirdWeek;
  }

  if (!allowLockedLabel && !isBeggingUnlocked(gameState)) {
    return workPlanTextIds.begAlmsDefault;
  }

  return isBeggingUnlocked(gameState)
    ? workPlanTextIds.begAlmsDefault
    : workPlanTextIds.begAlmsLocked;
}

function getTempleWorkPlanLabel(
  gameState: GameState,
  workPlan: TempleHouseWorkPlan,
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): string {
  const workPlanTextIds = resolveTempleStaticTextDefaults(
    houseModuleDefaults
  ).workPlanTextIds;
  if (workPlan === "temple-help") {
    return resolveTempleText(textEntriesById, workPlanTextIds.templeHelp);
  }

  if (workPlan === "beg-alms") {
    return resolveTempleText(
      textEntriesById,
      getTempleBegAlmsWorkPlanTextId(gameState, true, houseModuleDefaults)
    );
  }

  return "";
}

function getTempleBegAlmsStartOverlayVariant(
  gameState: GameState
): "default" | "third_week" | "fourth_week" {
  if (
    isFourthTempleWeekAssignmentPending(gameState) ||
    (isBeggingJourneyStage(gameState) && getTempleWeek(gameState) >= 4)
  ) {
    return "fourth_week";
  }

  if (
    isThirdTempleWeekAssignmentPending(gameState) ||
    isBeggingJourneyStage(gameState)
  ) {
    return "third_week";
  }

  return "default";
}

function getTempleBegAlmsStartOverlayTitle(
  gameState: GameState,
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): string {
  const overlayTextIds = resolveTempleStaticTextDefaults(
    houseModuleDefaults
  ).begAlmsStartOverlayTextIds;
  const variant = getTempleBegAlmsStartOverlayVariant(gameState);
  return resolveTempleText(
    textEntriesById,
    variant === "fourth_week"
      ? overlayTextIds.fourthWeekTitle
      : variant === "third_week"
        ? overlayTextIds.thirdWeekTitle
        : overlayTextIds.defaultTitle
  );
}

function getTempleBegAlmsStartOverlayLines(
  gameState: GameState,
  taskDefinition: TempleHouseTaskDefinition,
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): string[] {
  const variant = getTempleBegAlmsStartOverlayVariant(gameState);
  const overlayTextIds = resolveTempleStaticTextDefaults(
    houseModuleDefaults
  ).begAlmsStartOverlayTextIds;
  if (variant === "default") {
    return [
      taskDefinition.briefing,
      resolveTempleText(
        textEntriesById,
        overlayTextIds.defaultFollowup
      ),
    ];
  }

  const lineTextIds =
    variant === "fourth_week"
      ? overlayTextIds.fourthWeekLines
      : overlayTextIds.thirdWeekLines;

  return [
    resolveTempleText(
      textEntriesById,
      lineTextIds[0]
    ),
    resolveTempleText(
      textEntriesById,
      lineTextIds[1]
    ),
  ];
}

function resolveTempleTaskDefinition(
  activityDefinition: TempleTaskActivityDefinition,
  textEntriesById?: Record<string, string>
): TempleHouseTaskDefinition {
  return {
    id: activityDefinition.taskId,
    activityId: activityDefinition.id,
    missionId: activityDefinition.missionId,
    title: resolveTempleText(textEntriesById, activityDefinition.titleTextId),
    briefing: resolveTempleText(textEntriesById, activityDefinition.briefingTextId),
    orderLines: activityDefinition.orderLineTextIds.map((textId) =>
      resolveTempleText(textEntriesById, textId)
    ),
    minRankId: activityDefinition.reviewMinRankId ?? "temple.laborer",
  };
}

function getTempleTaskDefinitions(
  activityDefinitionsById?: Record<string, ActivityDefinition>,
  textEntriesById?: Record<string, string>
): TempleHouseTaskDefinition[] {
  const taskActivityDefinitionsById = new Map<
    string,
    TempleTaskActivityDefinition
  >(
    defaultTempleTaskActivityDefinitions.map((activityDefinition) => [
      activityDefinition.taskId,
      activityDefinition,
    ])
  );
  const orderedTaskIds = defaultTempleTaskActivityDefinitions.map(
    (activityDefinition) => activityDefinition.taskId
  );

  for (const activityDefinition of Object.values(activityDefinitionsById ?? {})) {
    if (!isTempleTaskActivityDefinition(activityDefinition)) {
      continue;
    }

    if (!taskActivityDefinitionsById.has(activityDefinition.taskId)) {
      orderedTaskIds.push(activityDefinition.taskId);
    }

    taskActivityDefinitionsById.set(activityDefinition.taskId, activityDefinition);
  }

  return orderedTaskIds.map((taskId) =>
    resolveTempleTaskDefinition(
      taskActivityDefinitionsById.get(taskId) as TempleTaskActivityDefinition,
      textEntriesById
    )
  );
}

function findTempleTaskDefinition(
  taskId: string,
  activityDefinitionsById?: Record<string, ActivityDefinition>,
  textEntriesById?: Record<string, string>
): TempleHouseTaskDefinition {
  const taskDefinition = getTempleTaskDefinitions(
    activityDefinitionsById,
    textEntriesById
  ).find((candidateTask) => candidateTask.id === taskId);
  assertExists(taskDefinition, `Temple house task not found for id "${taskId}".`);
  return taskDefinition;
}

function findTempleTaskActivityDefinition(
  taskId: string,
  activityDefinitionsById?: Record<string, ActivityDefinition>
): TempleTaskActivityDefinition {
  const activityDefinition =
    Object.values(activityDefinitionsById ?? {}).find(
      (candidateActivity) =>
        isTempleTaskActivityDefinition(candidateActivity) &&
        candidateActivity.taskId === taskId
    ) ??
    defaultTempleTaskActivityDefinitions.find(
      (candidateActivity) => candidateActivity.taskId === taskId
    );

  assertExists(
    activityDefinition,
    `Temple house task activity not found for task id "${taskId}".`
  );
  return activityDefinition as TempleTaskActivityDefinition;
}

function findActiveTempleWorkTaskId(
  gameState: GameState,
  activityDefinitionsById?: Record<string, ActivityDefinition>
): string | null {
  const activitySession = gameState.runtime.activitySession;
  if (
    activitySession?.type !== "fortune-board" &&
    activitySession?.type !== "pachinko-board"
  ) {
    return null;
  }

  const activityDefinition =
    Object.values(activityDefinitionsById ?? {}).find(
      (candidateActivity) =>
        candidateActivity.id === activitySession.activityId &&
        isTempleTaskActivityDefinition(candidateActivity)
    ) ??
    defaultTempleTaskActivityDefinitions.find(
      (candidateActivity) => candidateActivity.id === activitySession.activityId
    );

  return activityDefinition?.taskId ?? null;
}

function createTempleWorkPlayableActivityDefinitionsById(
  activityDefinition: TempleTaskActivityDefinition,
  activityDefinitionsById?: Record<string, ActivityDefinition>
): Record<string, ActivityDefinition> {
  const activityWithoutSettlement: ActivityDefinition = { ...activityDefinition };
  delete activityWithoutSettlement.outcome;
  delete activityWithoutSettlement.timeAdvanceCost;

  return {
    ...(activityDefinitionsById ?? {}),
    [activityDefinition.id]: {
      ...activityWithoutSettlement,
      handlerId: "generic.qte",
      fallbackHandlerId: "generic.qte",
      qte: {
        totalRounds: TEMPLE_WORK_TOTAL_ROUNDS,
        requiredSuccesses: TEMPLE_WORK_REQUIRED_SUCCESSES,
      },
      timeAdvanceCost: 0,
    },
  };
}

type TempleRestSummary = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  daysRested: number;
  totalRecovered: number;
  interruptedByCouncilDate: boolean;
  snapshots: MapAutoAdvanceSnapshot[];
};

const FIRST_WEEK_TEMPLE_TASK_IDS = [
  "copy-scripture",
  "sweep-courtyard",
  "carry-water",
] as const;

const TEMPLE_HELP_QTE_TASK_IDS = new Set<string>([
  ...FIRST_WEEK_TEMPLE_TASK_IDS,
]);

function getPlayerCharacter(
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string
): CharacterDefinition {
  const playerCharacter = characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assertExists(
    playerCharacter,
    `Player character not found for id "${playerCharacterId}" in temple house module.`
  );
  return playerCharacter;
}

function getAbbotCharacter(
  characterDefinitions: CharacterDefinition[],
  abbotCharacterId: string | null
): CharacterDefinition {
  assertExists(abbotCharacterId, "Temple house is missing a default abbot character.");
  const abbotCharacter = characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === abbotCharacterId
  );
  assertExists(
    abbotCharacter,
    `Abbot character not found for id "${abbotCharacterId}" in temple house module.`
  );
  return abbotCharacter;
}

function replaceCharacter(
  characterDefinitions: CharacterDefinition[],
  nextCharacter: CharacterDefinition
): CharacterDefinition[] {
  return characterDefinitions.map((characterDefinition) =>
    characterDefinition.id === nextCharacter.id ? nextCharacter : characterDefinition
  );
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

function getTempleLateChoiceParagraphs(
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): string[] {
  return resolveTempleStaticTextDefaults(
    houseModuleDefaults
  ).lateReviewTextIds.choiceLines.map((textId) =>
    resolveTempleText(textEntriesById, textId)
  );
}

function getTempleLateMeetingIntroLines(
  lateDays: number,
  contributionPenalty: number,
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): string[] {
  const lateReviewTextIds = resolveTempleStaticTextDefaults(
    houseModuleDefaults
  ).lateReviewTextIds;
  return lateDays > 5
    ? [
        resolveTempleTemplateText(
          textEntriesById,
          lateReviewTextIds.heavyLines[0],
          { lateDays }
        ),
        resolveTempleTemplateText(
          textEntriesById,
          lateReviewTextIds.heavyLines[1],
          { contributionPenalty }
        ),
      ]
    : [
        resolveTempleTemplateText(
          textEntriesById,
          lateReviewTextIds.lightLines[0],
          { lateDays }
        ),
        resolveTempleTemplateText(
          textEntriesById,
          lateReviewTextIds.lightLines[1],
          { contributionPenalty }
        ),
      ];
}

function applyTempleLateCouncilAttendancePenalty(
  state: GameState
): {
  state: GameState;
  resolution: ReturnType<typeof resolveLateCouncilAttendance>;
} {
  const resolution = resolveLateCouncilAttendance(state);
  if (resolution == null) {
    return {
      state,
      resolution,
    };
  }

  const currentContribution = readNumericVariable(
    state,
    ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution,
    0
  );
  const nextState = markLateCouncilAttendancePenaltyProcessed({
    ...state,
    runtime: {
      ...state.runtime,
      variables: {
        ...state.runtime.variables,
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution]: Math.max(
          0,
          currentContribution - resolution.contributionPenalty
        ),
      },
    },
  });

  return {
    state: nextState,
    resolution: {
      ...resolution,
      expelled: false,
    },
  };
}

function readBooleanFlag(
  state: GameState,
  key: string
): boolean {
  return state.runtime.flags[key] === true;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
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

function formatReviewDateText(daysLeft: number): string {
  return formatCouncilStatusText(daysLeft);
}

function createTransitionResult(
  input: Pick<
    HouseModuleDispatchInput<"temple-house">,
    "gameState" | "characterDefinitions" | "sessionState" | "sharedSessionState"
  >,
  patch?: Partial<HouseModuleTransitionResult<"temple-house">>
): HouseModuleTransitionResult<"temple-house"> {
  return {
    gameState: patch?.gameState ?? input.gameState,
    characterDefinitions: patch?.characterDefinitions ?? input.characterDefinitions,
    sessionState: patch?.sessionState ?? input.sessionState,
    ...(patch?.sharedSessionState !== undefined
      ? { sharedSessionState: patch.sharedSessionState }
      : input.sharedSessionState === undefined
        ? {}
        : { sharedSessionState: input.sharedSessionState }),
    ...(patch?.sideEffects == null ? {} : { sideEffects: patch.sideEffects }),
  };
}

function withSessionState(
  input: Pick<
    HouseModuleDispatchInput<"temple-house">,
    "gameState" | "characterDefinitions"
  >,
  sessionState: TempleHouseSessionState | null,
  patch: Partial<TempleHouseSessionState>,
  sideEffects?: HouseModuleTransitionResult<"temple-house">["sideEffects"]
): HouseModuleTransitionResult<"temple-house"> {
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

function createAlertOverlay(
  title: string,
  paragraphs: string[],
  tone?: "info" | "success" | "warning"
): NonNullable<TempleHouseOverlayState> {
  return {
    type: "alert",
    title,
    paragraphs,
    ...(tone == null ? {} : { tone }),
  };
}

function createActivityConfirmOverlay(
  title: string,
  paragraphs: string[],
  confirmActionId: string,
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>,
  details?: Partial<
    Pick<
      HouseActivityConfirmOverlayState,
      | "workDescriptionLines"
      | "relatedAbilityLines"
      | "costLines"
      | "bestScore"
      | "quickCompleteScore"
      | "quickCompleteActionId"
      | "quickCompleteLabel"
    >
  >
): HouseActivityConfirmOverlayState {
  const uiTextIds = resolveTempleStaticTextDefaults(houseModuleDefaults).uiTextIds;
  return {
    type: "activity-confirm",
    title,
    paragraphs,
    ...(details?.workDescriptionLines == null
      ? {}
      : { workDescriptionLines: details.workDescriptionLines }),
    ...(details?.relatedAbilityLines == null
      ? {}
      : { relatedAbilityLines: details.relatedAbilityLines }),
    ...(details?.costLines == null ? {} : { costLines: details.costLines }),
    ...(details?.bestScore == null ? {} : { bestScore: details.bestScore }),
    ...(details?.quickCompleteScore == null
      ? {}
      : { quickCompleteScore: details.quickCompleteScore }),
    ...(details?.quickCompleteActionId == null
      ? {}
      : { quickCompleteActionId: details.quickCompleteActionId }),
    ...(details?.quickCompleteLabel == null
      ? {}
      : { quickCompleteLabel: details.quickCompleteLabel }),
    confirmActionId,
    confirmLabel: resolveTempleText(textEntriesById, uiTextIds.activityConfirmLabel),
    cancelActionId: CANCEL_ACTIVITY_CONFIRM_ACTION_ID,
    cancelLabel: resolveTempleText(textEntriesById, uiTextIds.activityCancelLabel),
    tone: "info",
  };
}

function getActivityBestScoreVariableKey(activityId: string): string {
  return `var.activity.${activityId}.best_score`;
}

function readActivityBestScore(
  gameState: GameState,
  activityId: string
): number | null {
  const value = gameState.runtime.variables[getActivityBestScoreVariableKey(activityId)];
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : null;
}

function createTempleWorkConfirmDetails(
  gameState: GameState,
  taskDefinition: TempleHouseTaskDefinition,
  taskActivityDefinition: TempleTaskActivityDefinition,
  durationDays: number,
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): Partial<
  Pick<
    HouseActivityConfirmOverlayState,
    | "workDescriptionLines"
    | "relatedAbilityLines"
    | "costLines"
    | "bestScore"
    | "quickCompleteScore"
    | "quickCompleteActionId"
    | "quickCompleteLabel"
  >
> {
  const uiTextIds = resolveTempleStaticTextDefaults(houseModuleDefaults).uiTextIds;
  const bestScore = readActivityBestScore(gameState, taskActivityDefinition.id);
  const quickCompleteScore =
    bestScore == null ? null : Math.floor(bestScore * 0.9);
  return {
    workDescriptionLines: [taskDefinition.briefing],
    relatedAbilityLines: [
      resolveTempleText(textEntriesById, uiTextIds.activityRelatedAbilityPending),
    ],
    costLines: [
      `体力 -${ACTIVITY_COMPLETION_STAMINA_COST}`,
      `时间 +${durationDays}天`,
    ],
    ...(bestScore == null ? {} : { bestScore }),
    ...(quickCompleteScore == null ? {} : { quickCompleteScore }),
    ...(quickCompleteScore == null
      ? {}
      : {
          quickCompleteActionId: `${QUICK_COMPLETE_TEMPLE_TASK_ACTION_PREFIX}${taskDefinition.id}`,
          quickCompleteLabel: resolveTempleText(
            textEntriesById,
            uiTextIds.activityQuickCompleteLabel
          ),
        }),
  };
}

function isMonkStoryStage(gameState: GameState): boolean {
  return isZhuYuanzhangMonkStoryStage(gameState);
}

function isBeggingJourneyStage(gameState: GameState): boolean {
  return isZhuYuanzhangBeggingJourneyStage(gameState);
}

function isThirdTempleWeekAssignmentPending(gameState: GameState): boolean {
  return (
    readZhuYuanzhangStoryStage(gameState) ===
      ZHU_YUANZHANG_STORY_STAGES.huangjueTemple &&
    isBeggingUnlocked(gameState) &&
    readBooleanFlag(
      gameState,
      ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingTransitionAssigned
    )
  );
}

function isFourthTempleWeekAssignmentPending(gameState: GameState): boolean {
  return (
    isBeggingJourneyStage(gameState) &&
    getTempleWeek(gameState) === 3
  );
}

function randomTargetStart(round: number): number {
  const seed = (round * 17 + 13) % 55;
  return 15 + seed;
}

function randomTargetWidth(round: number): number {
  return round === 3 ? 16 : round === 2 ? 18 : 22;
}

function createTempleWorkOverlay(
  taskDefinition: TempleHouseTaskDefinition,
  round: number,
  successes: number,
  markerPercent = 8
): TempleHouseQteOverlayState {
  return {
    type: "qte-bar",
    taskId: taskDefinition.id,
    taskLabel: taskDefinition.title,
    round,
    totalRounds: TEMPLE_WORK_TOTAL_ROUNDS,
    successes,
    markerPercent,
    markerDirection: 1,
    targetStartPercent: randomTargetStart(round),
    targetWidthPercent: randomTargetWidth(round),
  };
}

function resolveTempleWorkContribution(
  successes: number,
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): {
  grade: string;
  contribution: number;
  praiseLines: string[];
} {
  const workResultTextIds = resolveTempleStaticTextDefaults(
    houseModuleDefaults
  ).workResultTextIds;
  if (successes <= 1) {
    return {
      grade: resolveTempleText(textEntriesById, workResultTextIds.lazyGrade),
      contribution: 5,
      praiseLines: workResultTextIds.lazyLines.map((textId) =>
        resolveTempleText(textEntriesById, textId)
      ),
    };
  }

  if (successes === 2) {
    return {
      grade: resolveTempleText(textEntriesById, workResultTextIds.passGrade),
      contribution: 10,
      praiseLines: workResultTextIds.passLines.map((textId) =>
        resolveTempleText(textEntriesById, textId)
      ),
    };
  }

  return {
    grade: resolveTempleText(textEntriesById, workResultTextIds.diligentGrade),
    contribution: 15,
    praiseLines: workResultTextIds.diligentLines.map((textId) =>
      resolveTempleText(textEntriesById, textId)
    ),
  };
}

function readTempleAvailableFood(state: GameState): number {
  return readPlayerGrainDou(state);
}

function readTempleBeggingSubmittedFood(state: GameState): number {
  return readNumericVariable(
    state,
    TEMPLE_HOUSE_VARIABLE_KEYS.beggingSubmittedFood,
    0
  );
}

function readTempleBeggingLastGrade(state: GameState): string {
  return readStringVariable(
    state,
    TEMPLE_HOUSE_VARIABLE_KEYS.beggingLastGrade,
    ""
  );
}

function isTempleBeggingWorkSubmitted(state: GameState): boolean {
  return readTempleBeggingSubmittedFood(state) > 0;
}

function isTempleBeggingFoodReadyForSubmission(state: GameState): boolean {
  return (
    readTempleWorkPlan(state) === "beg-alms" &&
    !isTempleBeggingWorkSubmitted(state) &&
    readTempleAvailableFood(state) > 0
  );
}

function formatTempleGrainAmount(quantityDou: number): string {
  return quantityDou >= 10
    ? formatGrainAsShiAndDou(quantityDou)
    : formatGrainAsDou(quantityDou);
}

function resolveTempleBeggingDelivery(
  quantityDou: number,
  textEntriesById?: Record<string, string>
): {
  grade: string;
  contribution: number;
  praiseLines: string[];
} {
  if (quantityDou >= 30) {
    return {
      grade: resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.begging_delivery.high.grade"
      ),
      contribution: 15,
      praiseLines: [
        resolveTempleText(
          textEntriesById,
          "runtime.zhu_yuanzhang.temple.begging_delivery.high.001"
        ),
        resolveTempleText(
          textEntriesById,
          "runtime.zhu_yuanzhang.temple.begging_delivery.high.002"
        ),
      ],
    };
  }

  if (quantityDou >= 15) {
    return {
      grade: resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.begging_delivery.medium.grade"
      ),
      contribution: 10,
      praiseLines: [
        resolveTempleText(
          textEntriesById,
          "runtime.zhu_yuanzhang.temple.begging_delivery.medium.001"
        ),
        resolveTempleText(
          textEntriesById,
          "runtime.zhu_yuanzhang.temple.begging_delivery.medium.002"
        ),
      ],
    };
  }

  return {
    grade: resolveTempleText(
      textEntriesById,
      "runtime.zhu_yuanzhang.temple.begging_delivery.low.grade"
    ),
    contribution: 5,
    praiseLines: [
      resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.begging_delivery.low.001"
      ),
      resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.begging_delivery.low.002"
      ),
    ],
  };
}

function recoverTempleStamina(playerCharacter: CharacterDefinition): CharacterDefinition {
  const maxStamina = Math.max(100, playerCharacter.stamina);
  return {
    ...playerCharacter,
    stamina: Math.min(
      maxStamina,
      playerCharacter.stamina + TEMPLE_REST_BASE_RECOVERY
    ),
  };
}

function advanceTempleRestOneDay(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string
): {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  recovered: number;
} {
  const playerCharacter = getPlayerCharacter(characterDefinitions, playerCharacterId);
  const nextPlayerCharacter = recoverTempleStamina(playerCharacter);
  const nextState = advanceGameStateOneDay(state);

  return {
    state: nextState,
    characterDefinitions: replaceCharacter(characterDefinitions, nextPlayerCharacter),
    recovered: nextPlayerCharacter.stamina - playerCharacter.stamina,
  };
}

function runTempleRestPlan(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  shouldContinue: (
    state: GameState,
    characterDefinitions: CharacterDefinition[],
    daysRested: number
  ) => boolean
): TempleRestSummary {
  let nextState = state;
  let nextCharacters = characterDefinitions;
  let daysRested = 0;
  let totalRecovered = 0;
  const snapshots: MapAutoAdvanceSnapshot[] = [];

  while (
    daysRested < TEMPLE_REST_MAX_DAYS &&
    shouldContinue(nextState, nextCharacters, daysRested)
  ) {
    if (hasReachedCouncilDate(nextState)) {
      return {
        state: nextState,
        characterDefinitions: nextCharacters,
        daysRested,
        totalRecovered,
        interruptedByCouncilDate: true,
        snapshots,
      };
    }

    const result = advanceTempleRestOneDay(
      nextState,
      nextCharacters,
      playerCharacterId
    );
    nextState = result.state;
    nextCharacters = result.characterDefinitions;
    snapshots.push({
      gameState: nextState,
      characterDefinitions: nextCharacters,
    });
    daysRested += 1;
    totalRecovered += result.recovered;

    if (hasReachedCouncilDate(nextState)) {
      return {
        state: nextState,
        characterDefinitions: nextCharacters,
        daysRested,
        totalRecovered,
        interruptedByCouncilDate: true,
        snapshots,
      };
    }
  }

  return {
    state: nextState,
    characterDefinitions: nextCharacters,
    daysRested,
    totalRecovered,
    interruptedByCouncilDate: false,
    snapshots,
  };
}

function createTempleRestResultOverlay(
  summary: TempleRestSummary,
  title: string,
  playerCharacterId: string,
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): NonNullable<TempleHouseOverlayState> {
  const playerCharacter = getPlayerCharacter(
    summary.characterDefinitions,
    playerCharacterId
  );
  const restSummaryTextIds = resolveTempleStaticTextDefaults(
    houseModuleDefaults
  ).restSummaryTextIds;
  if (summary.daysRested <= 0) {
    return {
      type: "alert",
      title,
      paragraphs: summary.interruptedByCouncilDate
        ? [
            resolveTempleText(
              textEntriesById,
              restSummaryTextIds.interruptedCouncilTitle
            ),
            resolveTempleTemplateText(
              textEntriesById,
              restSummaryTextIds.interruptedCouncilBody,
              { currentStamina: playerCharacter.stamina }
            ),
            ...getTempleLateChoiceParagraphs(
              textEntriesById,
              houseModuleDefaults
            ),
          ]
        : [
            resolveTempleText(textEntriesById, restSummaryTextIds.none),
          ],
      tone: summary.interruptedByCouncilDate ? "warning" : "info",
    };
  }

  return {
    type: "alert",
    title,
    paragraphs: [
      resolveTempleTemplateText(
        textEntriesById,
        restSummaryTextIds.days,
        {
          daysRested: summary.daysRested,
          totalRecovered: summary.totalRecovered,
        }
      ),
      resolveTempleTemplateText(
        textEntriesById,
        restSummaryTextIds.current,
        { stamina: playerCharacter.stamina }
      ),
      summary.interruptedByCouncilDate
        ? resolveTempleText(
            textEntriesById,
            restSummaryTextIds.interruptedCouncilTitle
          )
        : resolveTempleText(textEntriesById, restSummaryTextIds.normal),
      ...(summary.interruptedByCouncilDate
        ? getTempleLateChoiceParagraphs(textEntriesById, houseModuleDefaults)
        : []),
    ],
    tone: summary.interruptedByCouncilDate ? "warning" : "success",
  };
}

function createTempleRestCompletionSession(
  sessionState: TempleHouseSessionState,
  summary: TempleRestSummary,
  title: string,
  playerCharacterId: string,
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): ActiveHouseModuleSession {
  return {
    moduleId: "temple-house",
    state: {
      ...sessionState,
      mode: "daily",
      meetingStage: "finished",
      dialoguePhase: "idle",
      dialogueOverride: null,
      dailyActionPanel: "root",
      overlay: createTempleRestResultOverlay(
        summary,
        title,
        playerCharacterId,
        textEntriesById,
        houseModuleDefaults
      ),
    },
  };
}

function createTempleRestAutoAdvanceResult(
  input: HouseModuleDispatchInput<"temple-house">,
  sessionState: TempleHouseSessionState,
  summary: TempleRestSummary,
  title: string,
  currentState: GameState
): HouseModuleTransitionResult<"temple-house"> {
  return {
    gameState: currentState,
    characterDefinitions: input.characterDefinitions,
    sessionState,
    sideEffects: [
      {
        type: "start-map-auto-advance",
        intervalId: TEMPLE_REST_AUTO_ADVANCE_INTERVAL_ID,
        everyMs: HOUSE_MAP_AUTO_ADVANCE_DAY_INTERVAL_MS,
        targetHouseId: input.houseDefinition.id,
        label: title,
        snapshots: summary.snapshots,
        completion: summary.interruptedByCouncilDate
          ? {
              type: "enter-house",
              houseId: input.houseDefinition.id,
            }
          : {
              type: "restore-house-session",
              houseId: input.houseDefinition.id,
              houseSession: createTempleRestCompletionSession(
                sessionState,
                summary,
                title,
                input.playerCharacterId,
                input.textEntriesById,
                input.houseModuleDefaults
              ),
            },
      },
    ],
  };
}

function ensureTempleRuntimeState(gameState: GameState): GameState {
  const syncedState = ensurePlayerGrainInventory(gameState);
  const nextFlags = { ...syncedState.runtime.flags };
  const nextVariables = { ...syncedState.runtime.variables };

  if (typeof nextVariables[KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown] !== "number") {
    nextVariables[KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown] = 0;
  }

  if (typeof nextVariables[TEMPLE_HOUSE_VARIABLE_KEYS.donationTotal] !== "number") {
    nextVariables[TEMPLE_HOUSE_VARIABLE_KEYS.donationTotal] = 0;
  }

  if (typeof nextVariables[TEMPLE_HOUSE_VARIABLE_KEYS.lastAssignedTaskId] !== "string") {
    nextVariables[TEMPLE_HOUSE_VARIABLE_KEYS.lastAssignedTaskId] = "";
  }

  if (typeof nextVariables[TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan] !== "string") {
    nextVariables[TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan] = "";
  }

  if (typeof nextVariables[TEMPLE_HOUSE_VARIABLE_KEYS.beggingSubmittedFood] !== "number") {
    nextVariables[TEMPLE_HOUSE_VARIABLE_KEYS.beggingSubmittedFood] = 0;
  }

  if (typeof nextVariables[TEMPLE_HOUSE_VARIABLE_KEYS.beggingLastGrade] !== "string") {
    nextVariables[TEMPLE_HOUSE_VARIABLE_KEYS.beggingLastGrade] = "";
  }

  if (typeof nextVariables[ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution] !== "number") {
    nextVariables[ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution] = 0;
  }

  if (typeof nextVariables[ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeWeek] !== "number") {
    nextVariables[ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeWeek] = 1;
  }

  if (nextFlags[ZHU_YUANZHANG_STORY_FLAG_KEYS.ordinationCompleted] == null) {
    nextFlags[ZHU_YUANZHANG_STORY_FLAG_KEYS.ordinationCompleted] = false;
  }

  if (nextFlags[ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted] == null) {
    nextFlags[ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted] = false;
  }

  if (nextFlags[ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleWorkLockCompleted] == null) {
    nextFlags[ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleWorkLockCompleted] = false;
  }

  if (nextFlags[ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked] == null) {
    nextFlags[ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked] = false;
  }

  if (nextFlags[ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked] == null) {
    nextFlags[ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked] = false;
  }

  return {
    ...syncedState,
    ui: {
      ...syncedState.ui,
      reviewDateText: getCouncilStatusText(syncedState),
    },
    runtime: {
      ...syncedState.runtime,
      flags: nextFlags,
      variables: nextVariables,
    },
  };
}

function createLowStaminaOverlay(
  actionLabel: string,
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): NonNullable<TempleHouseOverlayState> {
  const alertTextIds = resolveTempleStaticTextDefaults(houseModuleDefaults).alertTextIds;
  return createAlertOverlay(
    resolveTempleText(textEntriesById, alertTextIds.lowStaminaTitle),
    [
      resolveTempleTemplateText(textEntriesById, alertTextIds.lowStaminaBody, {
        actionLabel,
      }),
      resolveTempleTemplateText(
        textEntriesById,
        alertTextIds.lowStaminaFollowup,
        {
          requiredStamina: ACTIVITY_COMPLETION_STAMINA_COST,
        }
      ),
    ],
    "warning"
  );
}

function resolveFortuneLines(
  gameState: GameState,
  playerCharacter: CharacterDefinition,
  textEntriesById?: Record<string, string>
): {
  title: string;
  paragraphs: string[];
  tone: "info" | "success" | "warning";
} {
  const seed =
    (gameState.calendar.year +
      gameState.calendar.month * 3 +
      gameState.calendar.day +
      playerCharacter.stats.fame) %
    3;

  if (seed === 0) {
    return {
      title: resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.fortune.upper.title"
      ),
      paragraphs: [
        resolveTempleText(
          textEntriesById,
          "runtime.zhu_yuanzhang.temple.fortune.upper.001"
        ),
        isMonkStoryStage(gameState)
          ? resolveTempleText(
              textEntriesById,
              "runtime.zhu_yuanzhang.temple.fortune.upper.monk.002"
            )
          : resolveTempleText(
              textEntriesById,
              "runtime.zhu_yuanzhang.temple.fortune.upper.default.002"
            ),
      ],
      tone: "success",
    };
  }

  if (seed === 1) {
    return {
      title: resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.fortune.middle.title"
      ),
      paragraphs: [
        resolveTempleText(
          textEntriesById,
          "runtime.zhu_yuanzhang.temple.fortune.middle.001"
        ),
        resolveTempleText(
          textEntriesById,
          "runtime.zhu_yuanzhang.temple.fortune.middle.002"
        ),
      ],
      tone: "info",
    };
  }

  return {
    title: resolveTempleText(
      textEntriesById,
      "runtime.zhu_yuanzhang.temple.fortune.lower.title"
    ),
    paragraphs: [
      resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.fortune.lower.001"
      ),
      resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.fortune.lower.002"
      ),
    ],
    tone: "warning",
  };
}

function parseTempleTaskActionId(actionId: string): string | null {
  return actionId.startsWith(ASSIGN_TEMPLE_TASK_ACTION_PREFIX)
    ? actionId.slice(ASSIGN_TEMPLE_TASK_ACTION_PREFIX.length)
    : null;
}

function parseConfirmTempleTaskActionId(actionId: string): string | null {
  return actionId.startsWith(CONFIRM_START_TEMPLE_TASK_ACTION_PREFIX)
    ? actionId.slice(CONFIRM_START_TEMPLE_TASK_ACTION_PREFIX.length)
    : null;
}

function parseQuickCompleteTempleTaskActionId(actionId: string): string | null {
  return actionId.startsWith(QUICK_COMPLETE_TEMPLE_TASK_ACTION_PREFIX)
    ? actionId.slice(QUICK_COMPLETE_TEMPLE_TASK_ACTION_PREFIX.length)
    : null;
}

function createTempleWorkPlayableSideEffects(): HouseModuleSideEffect[] {
  return [
    { type: "stop-interval", intervalId: TEMPLE_WORK_INTERVAL_ID },
    {
      type: "start-interval",
      intervalId: TEMPLE_WORK_INTERVAL_ID,
      everyMs: PACHINKO_BOARD_DEFAULT_ANIMATION_TICK_MS,
      request: {
        type: "tick",
        tickId: TEMPLE_WORK_INTERVAL_ID,
      },
    },
  ];
}

function tryLaunchTemplePackOwnedWorkPlayable(
  input: HouseModuleDispatchInput<"temple-house">,
  sessionState: TempleHouseSessionState,
  taskDefinition: TempleHouseTaskDefinition
): HouseModuleTransitionResult<"temple-house"> | null {
  const nextSessionState = {
    ...sessionState,
    mode: "daily" as const,
    meetingStage: "finished" as const,
    dialoguePhase: "idle" as const,
    selectedTaskId: taskDefinition.id,
    dailyActionPanel: "work" as const,
    overlay: null,
  };
  const launchResult = launchHouseModulePackPlayableByItemId({
    gameState: input.gameState,
    moduleId: "temple-house",
    sessionState: nextSessionState,
    characterDefinitions: input.characterDefinitions,
    playerCharacterId: input.playerCharacterId,
    eventDefinitionsById: input.eventDefinitionsById,
    eventBindings: input.eventBindings,
    activityDefinitionsById: input.activityDefinitionsById,
    textEntriesById: input.textEntriesById,
    houseId: input.houseDefinition.id,
    itemId: taskDefinition.id,
  });
  if (!launchResult.handled) {
    return null;
  }

  return {
    gameState: launchResult.gameState,
    characterDefinitions: launchResult.characterDefinitions,
    sessionState: launchResult.sessionState,
    sideEffects: createTempleWorkPlayableSideEffects(),
  };
}

function parseReviewWorkActionId(actionId: string): "temple-help" | "beg-alms" | null {
  if (!actionId.startsWith(SELECT_REVIEW_WORK_ACTION_PREFIX)) {
    return null;
  }

  const workPlan = actionId.slice(SELECT_REVIEW_WORK_ACTION_PREFIX.length);
  return workPlan === "temple-help" || workPlan === "beg-alms" ? workPlan : null;
}

function resolveTempleHostedReviewWorkPlanChoice(
  actionId: string
): "temple-help" | "beg-alms" | null {
  if (actionId === "temple-review-assign-indoor") {
    return "temple-help";
  }

  if (actionId === "temple-review-assign-beg-alms") {
    return "beg-alms";
  }

  return null;
}

function isBeggingUnlocked(gameState: GameState): boolean {
  return readBooleanFlag(gameState, ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked);
}

function getTempleContribution(gameState: GameState): number {
  return readNumericVariable(
    gameState,
    ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution,
    0
  );
}

function shouldRouteTempleActivityToCouncil(
  gameState: GameState,
  durationDays: number
): number | null {
  if (!isMonkStoryStage(gameState)) {
    return null;
  }

  return getInsufficientDaysForTimedActivity(gameState, durationDays);
}

function createTempleInsufficientTimeResult(
  input: HouseModuleDispatchInput<"temple-house">,
  sessionState: TempleHouseSessionState,
  remainingDays: number,
  durationDays: number,
  activityLabel: string
): HouseModuleTransitionResult<"temple-house"> {
  const alertTextIds = resolveTempleStaticTextDefaults(
    input.houseModuleDefaults
  ).alertTextIds;
  return withSessionState(
    {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
    },
    sessionState,
    {
      overlay: createAlertOverlay(
        resolveTempleText(input.textEntriesById, alertTextIds.insufficientTimeTitle),
        remainingDays <= 0
          ? [
              resolveTempleTemplateText(
                input.textEntriesById,
                alertTextIds.insufficientTimeReached,
                {
                  activityLabel,
                  durationDays,
                }
              ),
              resolveTempleText(
                input.textEntriesById,
                alertTextIds.insufficientTimeFollowup
              ),
            ]
          : [
              resolveTempleTemplateText(
                input.textEntriesById,
                alertTextIds.insufficientTimeRemaining,
                {
                  remainingDays,
                  activityLabel,
                  durationDays,
                }
              ),
              resolveTempleText(
                input.textEntriesById,
                alertTextIds.insufficientTimeFollowup
              ),
            ],
        "warning"
      ),
    }
  );
}

function getTempleWeek(gameState: GameState): number {
  return readNumericVariable(gameState, ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeWeek, 1);
}

function readTempleWorkPlan(gameState: GameState): TempleHouseWorkPlan {
  const value = gameState.runtime.variables[TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan];
  return value === "temple-help" || value === "beg-alms" ? value : null;
}

function shouldBlockTempleLeave(gameState: GameState): boolean {
  const firstReviewCompleted = readBooleanFlag(
    gameState,
    ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted
  );
  const firstTutorialWorkPeriodLocked =
    firstReviewCompleted &&
    !readBooleanFlag(
      gameState,
      ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleWorkLockCompleted
    ) &&
    readNumericVariable(gameState, KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown, 0) > 0;

  return (
    isMonkStoryStage(gameState) &&
    (!firstReviewCompleted || firstTutorialWorkPeriodLocked)
  );
}

function completeFirstTempleWorkLockIfReviewArrived(gameState: GameState): GameState {
  if (
    !isMonkStoryStage(gameState) ||
    !readBooleanFlag(
      gameState,
      ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted
    ) ||
    readBooleanFlag(
      gameState,
      ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleWorkLockCompleted
    ) ||
    readNumericVariable(gameState, KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown, 0) > 0
  ) {
    return gameState;
  }

  return {
    ...gameState,
    runtime: {
      ...gameState.runtime,
      flags: {
        ...gameState.runtime.flags,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleWorkLockCompleted]: true,
      },
    },
  };
}

function getTaskDefinitionsByIds(
  taskIds: readonly string[],
  activityDefinitionsById?: Record<string, ActivityDefinition>,
  textEntriesById?: Record<string, string>
): TempleHouseTaskDefinition[] {
  return taskIds.map((taskId) =>
    findTempleTaskDefinition(taskId, activityDefinitionsById, textEntriesById)
  );
}

function getDailyTempleTasks(
  gameState: GameState,
  selectedWorkPlan: TempleHouseSessionState["selectedWorkPlan"],
  activityDefinitionsById?: Record<string, ActivityDefinition>,
  textEntriesById?: Record<string, string>
): TempleHouseTaskDefinition[] {
  if (!isMonkStoryStage(gameState)) {
    return getTaskDefinitionsByIds([
      "beg-alms",
      "copy-scripture",
      "relief-refugees",
    ], activityDefinitionsById, textEntriesById);
  }

  if (selectedWorkPlan === "beg-alms") {
    return [];
  }

  if (selectedWorkPlan === "temple-help") {
    if (!isBeggingUnlocked(gameState) || getTempleWeek(gameState) <= 1) {
      return getTaskDefinitionsByIds(
        FIRST_WEEK_TEMPLE_TASK_IDS,
        activityDefinitionsById,
        textEntriesById
      );
    }

    return getTaskDefinitionsByIds([
      "copy-scripture",
      "sweep-courtyard",
      "carry-water",
    ], activityDefinitionsById, textEntriesById);
  }

  if (!readBooleanFlag(gameState, ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked)) {
    return [];
  }

  if (!isBeggingUnlocked(gameState) || getTempleWeek(gameState) <= 1) {
    return getTaskDefinitionsByIds(
      FIRST_WEEK_TEMPLE_TASK_IDS,
      activityDefinitionsById,
      textEntriesById
    );
  }

  return getTaskDefinitionsByIds([
    "copy-scripture",
    "sweep-courtyard",
    "carry-water",
  ], activityDefinitionsById, textEntriesById);
}

function getTempleMeetingParticipantIds(
  houseCharacterIds: string[],
  playerCharacterId: string,
  abbotCharacterId: string
): string[] {
  return Array.from(
    new Set([
      playerCharacterId,
      abbotCharacterId,
      ...houseCharacterIds,
    ])
  );
}

function tryLaunchTempleReviewMeeting(
  input: HouseModuleEnterInput<"temple-house">,
  gameState: GameState,
  sessionState: TempleHouseSessionState
): HouseModuleTransitionResult<"temple-house"> | null {
  if (
    input.meetingDefinitionsById == null ||
    input.meetingBindings == null ||
    input.houseDefinition.defaultCharacterId == null
  ) {
    return null;
  }

  const abbotCharacter = getAbbotCharacter(
    input.characterDefinitions,
    input.houseDefinition.defaultCharacterId
  );
  const seniorMonkCharacter = input.characterDefinitions.find(
    (characterDefinition) =>
      characterDefinition.id !== abbotCharacter.id &&
      input.houseDefinition.characterIds.includes(characterDefinition.id)
  );
  assertExists(
    seniorMonkCharacter,
    "Temple house is missing a senior monk participant for review."
  );
  const reviewMeetingDefinition =
    input.meetingDefinitionsById["meeting.temple.review"] ?? null;
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
              createTempleReviewAssignmentRows(
                gameState,
                getTempleContributionEntries(
                  gameState,
                  getPlayerCharacter(input.characterDefinitions, input.playerCharacterId),
                  seniorMonkCharacter
                ),
                input.textEntriesById,
                input.houseModuleDefaults
              ),
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
      primarySpeakerCharacterId: abbotCharacter.id,
      participantCharacterIds: getTempleMeetingParticipantIds(
        input.houseDefinition.characterIds,
        input.playerCharacterId,
        abbotCharacter.id
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

function createTempleMeetingHostContext(
  input: Pick<
    HouseModuleViewModelInput<"temple-house">,
    "houseDefinition" | "playerCharacterId" | "characterDefinitions"
  >
) {
  if (input.houseDefinition.defaultCharacterId == null) {
    return null;
  }

  const abbotCharacter = getAbbotCharacter(
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
    primarySpeakerCharacterId: abbotCharacter.id,
    participantCharacterIds: getTempleMeetingParticipantIds(
      input.houseDefinition.characterIds,
      input.playerCharacterId,
      abbotCharacter.id
    ),
  };
}

function resumeTempleHostedMeeting(
  input: Pick<
    HouseModuleViewModelInput<"temple-house">,
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
  sessionState: TempleHouseSessionState,
  request?: { type: "advance" } | { type: "select-choice"; choiceId: string }
) {
  if (
    input.sharedSessionState?.hostedMeeting == null ||
    input.meetingDefinitionsById == null ||
    input.meetingBindings == null
  ) {
    return null;
  }

  const hostContext = createTempleMeetingHostContext(input);
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

function resolveTempleHostedMeetingRequest(
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

function isTempleHostedReviewMeetingActive(
  sharedSessionState: HouseModuleDispatchInput<"temple-house">["sharedSessionState"]
): boolean {
  return sharedSessionState?.hostedMeeting?.meetingId === "meeting.temple.review";
}

type TempleHostedReviewStageProjection = {
  meetingStage: TempleHouseMeetingStage;
  dialogueLines: string[];
  overlay: TempleHouseOverlayState;
};

type TempleHostedReviewProjectionResult = {
  gameState: GameState;
  characterDefinitions: CharacterDefinition[];
  projection: TempleHostedReviewStageProjection;
};

function projectTempleHostedReviewStage(input: {
  hostedSessionState: MeetingSessionState;
  projection: TempleHostedReviewStageProjection;
  gameState: GameState;
  playerCharacterId: string;
  activityDefinitionsById?: Record<string, ActivityDefinition>;
  textEntriesById?: Record<string, string>;
  houseModuleDefaults?: Record<string, unknown>;
}): MeetingSessionState {
  const nextStageId = input.projection.meetingStage;
  const uiTextIds = resolveTempleStaticTextDefaults(input.houseModuleDefaults).uiTextIds;
  const nextStageDialogueLinesByStageId = {
    ...((input.hostedSessionState.derivedState ?? {}).dialogueLinesByStageId ?? {}),
    [nextStageId]: [...input.projection.dialogueLines],
  } as Record<string, string[]>;
  const nextStageOverlaysByStageId = {
    ...((input.hostedSessionState.derivedState ?? {}).stageOverlaysByStageId ?? {}),
    [nextStageId]: selectOverlayViewModel(
      input.projection.overlay,
      null,
      null,
      input.textEntriesById,
      input.houseModuleDefaults
    ),
  } as Record<string, HouseOverlayViewModel | null>;
  const nextActionContainersByStageId = {
    ...((input.hostedSessionState.derivedState ?? {}).actionContainersByStageId ?? {}),
  } as Record<string, HouseActionContainerViewModel | null>;

  if (nextStageId === "praise") {
    const policyLines = getTempleMeetingPolicyLines(
      input.gameState,
      input.textEntriesById
    );
    nextStageDialogueLinesByStageId.situation = [
      resolveTempleText(input.textEntriesById, uiTextIds.reviewPraiseLead),
      ...policyLines.slice(0, 1),
    ];
    nextStageDialogueLinesByStageId.policy = [
      resolveTempleText(input.textEntriesById, uiTextIds.reviewPolicyLead),
    ];
    nextStageDialogueLinesByStageId.advice = [
      resolveTempleText(input.textEntriesById, uiTextIds.reviewAdvicePrompt),
    ];
    nextStageOverlaysByStageId.policy = selectOverlayViewModel(
      createTempleReviewPolicyPanelOverlay(
        createTempleReviewPolicyPanel(
          input.gameState,
          input.textEntriesById,
          input.houseModuleDefaults
        ),
        input.textEntriesById,
        input.houseModuleDefaults
      ),
      null,
      null,
      input.textEntriesById,
      input.houseModuleDefaults
    );
  }

  if (nextStageId === "assign-duty") {
    const uiTextIds = resolveTempleStaticTextDefaults(input.houseModuleDefaults).uiTextIds;
    const reviewWorkChoices = getReviewWorkChoices(
      input.gameState,
      input.playerCharacterId,
      input.activityDefinitionsById,
      input.textEntriesById,
      input.houseModuleDefaults
    );
    nextActionContainersByStageId["assign-duty"] = {
      title: resolveTempleText(
        input.textEntriesById,
        isMonkStoryStage(input.gameState)
          ? uiTextIds.actionPanelTitleMeetingMonk
          : uiTextIds.actionPanelTitleMeetingDaily
      ),
      actions: reviewWorkChoices.map<HouseActionViewModel>((workChoice) => ({
        id:
          workChoice.id === "temple-help"
            ? "temple-review-assign-indoor"
            : "temple-review-assign-beg-alms",
        label: workChoice.label,
        ...(workChoice.disabled == null ? {} : { disabled: workChoice.disabled }),
        ...(workChoice.tone == null ? {} : { tone: workChoice.tone }),
        buttonSound: "light",
      })),
    };
  }

  const nextDerivedState = {
    ...(input.hostedSessionState.derivedState ?? {}),
    stageOverlaysByStageId: nextStageOverlaysByStageId,
    dialogueLinesByStageId: nextStageDialogueLinesByStageId,
    actionContainersByStageId: nextActionContainersByStageId,
  };

  return {
    ...input.hostedSessionState,
    currentStageId: nextStageId,
    visitedStageIds:
      input.hostedSessionState.currentStageId === nextStageId
        ? input.hostedSessionState.visitedStageIds
        : [...input.hostedSessionState.visitedStageIds, nextStageId],
    derivedState: nextDerivedState,
    status: "running",
  };
}

function applyTempleHostedReviewProjectionToSessionState(
  input: Pick<
    HouseModuleDispatchInput<"temple-house">,
    "gameState" | "characterDefinitions"
  >,
  sessionState: TempleHouseSessionState,
  projection: TempleHostedReviewStageProjection
): HouseModuleTransitionResult<"temple-house"> {
  return withSessionState(input, sessionState, {
    meetingStage: projection.meetingStage,
    dialoguePhase: "open",
    dialogueLines: projection.dialogueLines,
    overlay: projection.overlay,
  });
}

function getTempleContributionEntries(
  gameState: GameState,
  playerCharacter: CharacterDefinition,
  seniorMonkCharacter: CharacterDefinition
): Array<{
  characterId: string;
  name: string;
  contribution: number;
}> {
  const playerContribution = getTempleContribution(gameState);
  const seniorMonkContribution = isBeggingUnlocked(gameState) ? 12 : 18;

  return [
    {
      characterId: seniorMonkCharacter.id,
      name: seniorMonkCharacter.name,
      contribution: seniorMonkContribution,
    },
    {
      characterId: playerCharacter.id,
      name: playerCharacter.name,
      contribution: playerContribution,
    },
  ].sort((leftEntry, rightEntry) => rightEntry.contribution - leftEntry.contribution);
}

function createTempleReviewAssignmentRows(
  gameState: GameState,
  contributionEntries: Array<{
    characterId: string;
    name: string;
    contribution: number;
  }>,
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): ReviewAssignmentRow[] {
  const currentWorkPlan = readTempleWorkPlan(gameState);
  const uiTextIds = resolveTempleStaticTextDefaults(houseModuleDefaults).uiTextIds;
  const assignmentTitle =
    getTempleWorkPlanLabel(
      gameState,
      currentWorkPlan,
      textEntriesById,
      houseModuleDefaults
    ) || resolveTempleText(textEntriesById, uiTextIds.reviewAssignmentDefaultTitle);

  return contributionEntries.map((entry) => ({
    characterId: entry.characterId,
    characterName: entry.name,
    assignmentTitle,
    contribution: entry.contribution,
    grade: resolveReviewCompletionGrade(entry.contribution),
  }));
}

function createTempleReviewPolicyPanel(
  gameState: GameState,
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): ReviewPolicyPanel {
  const policyLines = getTempleMeetingPolicyLines(gameState, textEntriesById);
  const uiTextIds = resolveTempleStaticTextDefaults(houseModuleDefaults).uiTextIds;

  return {
    overallGoal: resolveTempleText(textEntriesById, uiTextIds.reviewPolicyOverallGoal),
    phaseGoal: policyLines[0] ?? "",
    executionPlan: policyLines[1] ?? policyLines[0] ?? "",
  };
}

function createTempleReviewAssignmentTableOverlay(
  rows: ReviewAssignmentRow[],
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): TempleHouseOverlayState {
  const uiTextIds = resolveTempleStaticTextDefaults(houseModuleDefaults).uiTextIds;
  return {
    type: "review-assignment-table",
    title: resolveTempleText(textEntriesById, uiTextIds.reviewAssignmentOverlayTitle),
    rows,
    confirmActionId: "close-review-assignment-table",
    confirmLabel: resolveTempleText(
      textEntriesById,
      uiTextIds.reviewAssignmentOverlayConfirmLabel
    ),
  };
}

function createTempleReviewPolicyPanelOverlay(
  policy: ReviewPolicyPanel,
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): TempleHouseOverlayState {
  const uiTextIds = resolveTempleStaticTextDefaults(houseModuleDefaults).uiTextIds;
  return {
    type: "review-policy-panel",
    title: resolveTempleText(textEntriesById, uiTextIds.reviewPolicyOverlayTitle),
    policy,
    closeActionId: "close-review-policy-panel",
    closeLabel: resolveTempleText(
      textEntriesById,
      uiTextIds.reviewPolicyOverlayCloseLabel
    ),
  };
}

function createTempleReviewRewardOverlay(
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): TempleHouseOverlayState {
  const uiTextIds = resolveTempleStaticTextDefaults(houseModuleDefaults).uiTextIds;
  return createAlertOverlay(
    resolveTempleText(textEntriesById, uiTextIds.reviewRewardTitle),
    [`${TEMPLE_TOP_RANK_REWARD.label} x${TEMPLE_TOP_RANK_REWARD.quantity}`],
    "success"
  );
}

function applyTemplePersonnelChanges(
  characterDefinitions: CharacterDefinition[],
  changes: ReviewPersonnelChange[]
): CharacterDefinition[] {
  return changes.reduce((nextDefinitions, change) => {
    if (change.type !== "rank-changed") {
      return nextDefinitions;
    }

    const targetCharacter = nextDefinitions.find(
      (characterDefinition) => characterDefinition.id === change.characterId
    );
    if (targetCharacter == null) {
      return nextDefinitions;
    }

    return replaceCharacter(nextDefinitions, {
      ...targetCharacter,
      title: change.nextTitle,
    });
  }, characterDefinitions);
}

function getTempleReviewId(gameState: GameState): string {
  return `temple:${gameState.calendar.year}-${gameState.calendar.month}-${gameState.calendar.day}`;
}

function settleTemplePersonnelChanges(input: {
  gameState: GameState;
  factionLabel: string;
  playerCharacter: CharacterDefinition;
  playerCharacterId: string;
}): { gameState: GameState; changes: ReviewPersonnelChange[] } {
  const playerMerit = readFactionMerit(
    input.gameState,
    "temple",
    input.playerCharacterId
  );
  const playerContribution = getTempleContribution(input.gameState);
  const settlement = settleFactionReviewPersonnel({
    state: input.gameState,
    factionId: "temple",
    factionLabel: input.factionLabel,
    characterId: input.playerCharacterId,
    characterName: input.playerCharacter.name,
    reviewId: getTempleReviewId(input.gameState),
    entryRankId: "temple.laborer",
    previousMerit: Math.max(0, playerMerit - playerContribution),
    nextMerit: playerMerit,
    ranks: TEMPLE_FACTION_RANKS,
    formatRankLabel: (rank) => getFactionRankPersonnelTitle("temple", rank),
  });

  return {
    gameState: settlement.state,
    changes: settlement.changes,
  };
}

function createTemplePraiseProjection(input: {
  gameState: GameState;
  characterDefinitions: CharacterDefinition[];
  playerCharacter: CharacterDefinition;
  seniorMonkCharacter: CharacterDefinition;
  playerCharacterId: string;
  textEntriesById: Record<string, string> | undefined;
}): TempleHostedReviewProjectionResult {
  const contributionEntries = getTempleContributionEntries(
    input.gameState,
    input.playerCharacter,
    input.seniorMonkCharacter
  );

  return {
    gameState: input.gameState,
    characterDefinitions: input.characterDefinitions,
    projection: {
      meetingStage: "praise",
      dialogueLines: getTempleMeetingPraiseLines(
        contributionEntries,
        input.playerCharacterId,
        input.textEntriesById
      ),
      overlay: null,
    },
  };
}

function createTemplePersonnelOrPraiseProjection(input: {
  gameState: GameState;
  characterDefinitions: CharacterDefinition[];
  houseDefinition: HouseDefinition;
  playerCharacter: CharacterDefinition;
  seniorMonkCharacter: CharacterDefinition;
  playerCharacterId: string;
  textEntriesById: Record<string, string> | undefined;
  houseModuleDefaults?: Record<string, unknown>;
}): TempleHostedReviewProjectionResult {
  const personnelSettlement = settleTemplePersonnelChanges({
    ...input,
    factionLabel: input.houseDefinition.name,
  });
  const changes = personnelSettlement.changes;

  const nextCharacterDefinitions = applyTemplePersonnelChanges(
    input.characterDefinitions,
    changes
  );

  return {
    gameState: personnelSettlement.gameState,
    characterDefinitions: nextCharacterDefinitions,
    projection: {
      meetingStage: "personnel",
      dialogueLines:
        changes.length === 0
          ? formatReviewPersonnelChangeLines(changes)
          : [
              resolveTempleText(
                input.textEntriesById,
                resolveTempleStaticTextDefaults(input.houseModuleDefaults).uiTextIds
                  .reviewPersonnelNarration
              ),
            ],
      overlay:
        changes.length === 0
          ? null
          : createAlertOverlay(
              resolveTempleText(
                input.textEntriesById,
                resolveTempleStaticTextDefaults(input.houseModuleDefaults).uiTextIds
                  .reviewPersonnelOverlayTitle
              ),
              formatReviewPersonnelChangeLines(changes),
              "success"
            ),
    },
  };
}

function settleTempleReviewAssignmentTable(input: {
  gameState: GameState;
  characterDefinitions: CharacterDefinition[];
  houseDefinition: HouseDefinition;
  playerCharacter: CharacterDefinition;
  seniorMonkCharacter: CharacterDefinition;
  playerCharacterId: string;
  textEntriesById: Record<string, string> | undefined;
  houseModuleDefaults?: Record<string, unknown>;
}): TempleHostedReviewProjectionResult {
  const contributionEntries = getTempleContributionEntries(
    input.gameState,
    input.playerCharacter,
    input.seniorMonkCharacter
  );
  const rows = createTempleReviewAssignmentRows(
    input.gameState,
    contributionEntries,
    input.textEntriesById,
    input.houseModuleDefaults
  );
  const uiTextIds = resolveTempleStaticTextDefaults(input.houseModuleDefaults).uiTextIds;
  const playerContribution =
    contributionEntries.find(
      (entry) => entry.characterId === input.playerCharacterId
    )?.contribution ?? 0;
  const previousMerit = readFactionMerit(
    input.gameState,
    "temple",
    input.playerCharacterId
  );
  let nextState = writeFactionMerit(
    input.gameState,
    "temple",
    input.playerCharacterId,
    previousMerit + playerContribution
  );

  if (isReviewTopRankRewardEligible(rows, input.playerCharacterId)) {
    nextState = applyReviewItemReward(nextState, TEMPLE_TOP_RANK_REWARD);
    return {
      gameState: nextState,
      characterDefinitions: input.characterDefinitions,
      projection: {
        meetingStage: "reward",
        dialogueLines: [
          resolveTempleText(
            input.textEntriesById,
            uiTextIds.reviewAssignmentSettledLine
          ),
        ],
        overlay: createTempleReviewRewardOverlay(
          input.textEntriesById,
          input.houseModuleDefaults
        ),
      },
    };
  }

  return createTemplePersonnelOrPraiseProjection({
    ...input,
    gameState: nextState,
  });
}

function getTempleMeetingPraiseLines(
  contributionEntries: Array<{
    characterId: string;
    name: string;
    contribution: number;
  }>,
  playerCharacterId: string,
  textEntriesById?: Record<string, string>
): string[] {
  const topEntries = contributionEntries.slice(0, 2);

  if (topEntries.length === 0) {
    return [
      resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.review.praise.none.001"
      ),
    ];
  }

  return topEntries.map((entry, index) => {
    if (entry.characterId === playerCharacterId && entry.contribution >= 30) {
      return resolveTempleText(
        textEntriesById,
        index === 0
          ? "runtime.zhu_yuanzhang.temple.review.praise.player.top.001"
          : "runtime.zhu_yuanzhang.temple.review.praise.player.top.002"
      );
    }

    if (entry.characterId === playerCharacterId && entry.contribution <= 0) {
      return resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.review.praise.player.idle.001"
      );
    }

    return resolveTempleTemplateText(
      textEntriesById,
      index === 0
        ? "runtime.zhu_yuanzhang.temple.review.praise.rank.001"
        : "runtime.zhu_yuanzhang.temple.review.praise.rank.002",
      {
        entryName: entry.name,
        contribution: entry.contribution,
      }
    );
  });
}

function getTempleMeetingPolicyLines(
  gameState: GameState,
  textEntriesById?: Record<string, string>
): string[] {
  if (!readBooleanFlag(gameState, ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted)) {
    return [
      resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.review.policy.first.001"
      ),
      resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.review.policy.first.002"
      ),
    ];
  }

  if (isThirdTempleWeekAssignmentPending(gameState)) {
    return [
      resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.review.policy.third_week.001"
      ),
      resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.review.policy.third_week.002"
      ),
    ];
  }

  if (isFourthTempleWeekAssignmentPending(gameState)) {
    return [
      resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.review.policy.fourth_week.001"
      ),
      resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.review.policy.fourth_week.002"
      ),
    ];
  }

  if (isBeggingUnlocked(gameState)) {
    return [
      resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.review.policy.unlocked.001"
      ),
      resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.review.policy.unlocked.002"
      ),
    ];
  }

  return [
    resolveTempleText(
      textEntriesById,
      "runtime.zhu_yuanzhang.temple.review.policy.locked.001"
    ),
    resolveTempleText(
      textEntriesById,
      "runtime.zhu_yuanzhang.temple.review.policy.locked.002"
    ),
  ];
}

function getTempleAssignDutyLines(
  gameState: GameState,
  reviewWorkChoices: ReturnType<typeof getReviewWorkChoices>,
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): string[] {
  const reviewAssignmentTextIds = resolveTempleStaticTextDefaults(
    houseModuleDefaults
  ).reviewAssignmentTextIds;
  const availableLabels = reviewWorkChoices
    .filter((workChoice) => workChoice.disabled !== true)
    .map((workChoice) => workChoice.label);

  if (isThirdTempleWeekAssignmentPending(gameState)) {
    return reviewAssignmentTextIds.thirdWeek.map((textId) =>
      resolveTempleText(textEntriesById, textId)
    );
  }

  if (isFourthTempleWeekAssignmentPending(gameState)) {
    return reviewAssignmentTextIds.fourthWeek.map((textId) =>
      resolveTempleText(textEntriesById, textId)
    );
  }

  return [
    resolveTempleText(textEntriesById, reviewAssignmentTextIds.defaultIntro),
    availableLabels.length === 0
      ? resolveTempleText(
          textEntriesById,
          reviewAssignmentTextIds.defaultEmpty
        )
      : resolveTempleTemplateText(
          textEntriesById,
          reviewAssignmentTextIds.defaultAvailableTemplate,
          { availableTaskList: availableLabels.join("、") }
        ),
    resolveTempleText(textEntriesById, reviewAssignmentTextIds.defaultOutro),
  ];
}

function getReviewWorkChoices(
  gameState: GameState,
  playerCharacterId: string,
  activityDefinitionsById?: Record<string, ActivityDefinition>,
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): Array<{
  id: "temple-help" | "beg-alms";
  label: string;
  disabled?: boolean;
  tone?: HouseActionViewModel["tone"];
}> {
  if (!isMonkStoryStage(gameState)) {
    return [];
  }

  if (isThirdTempleWeekAssignmentPending(gameState)) {
    return [
      {
        id: "beg-alms",
        label: resolveTempleText(
          textEntriesById,
          getTempleBegAlmsWorkPlanTextId(gameState, true, houseModuleDefaults)
        ),
        tone: "accent",
      },
    ];
  }

  if (isFourthTempleWeekAssignmentPending(gameState)) {
    return [
      {
        id: "beg-alms",
        label: resolveTempleText(
          textEntriesById,
          getTempleBegAlmsWorkPlanTextId(gameState, true, houseModuleDefaults)
        ),
        tone: "accent",
      },
    ];
  }

  const choices: Array<{
    id: "temple-help" | "beg-alms";
    label: string;
    tone?: HouseActionViewModel["tone"];
  }> = [
    {
      id: "temple-help",
      label: getTempleWorkPlanLabel(
        gameState,
        "temple-help",
        textEntriesById,
        houseModuleDefaults
      ),
    },
    {
      id: "beg-alms",
      label: resolveTempleText(
        textEntriesById,
        getTempleBegAlmsWorkPlanTextId(gameState, true, houseModuleDefaults)
      ),
      tone: "accent",
    },
  ];

  const playerMerit = readFactionMerit(gameState, "temple", playerCharacterId);
  const playerRank = resolveFactionMeritRank(TEMPLE_FACTION_RANKS, playerMerit);
  const templeHelpRankId =
    getTaskDefinitionsByIds(
      FIRST_WEEK_TEMPLE_TASK_IDS,
      activityDefinitionsById,
      textEntriesById
    )[0]?.minRankId ?? "temple.laborer";
  const begAlmsRankId = findTempleTaskDefinition(
    "beg-alms",
    activityDefinitionsById,
    textEntriesById
  ).minRankId;
  const choiceViewModels = createReviewTaskChoiceViewModels({
    currentRankId: playerRank.id,
    ranks: TEMPLE_FACTION_RANKS,
    tasks: choices.map((choice) => ({
      id: choice.id,
      label: choice.label,
      minRankId:
        choice.id === "beg-alms" ? begAlmsRankId : templeHelpRankId,
      disabled: choice.id === "beg-alms" && !isBeggingUnlocked(gameState),
    })),
  });

  return choiceViewModels.map((choiceViewModel) => {
    const baseChoice = choices.find((choice) => choice.id === choiceViewModel.id);

    return {
      id: choiceViewModel.id as "temple-help" | "beg-alms",
      label: choiceViewModel.label,
      disabled: choiceViewModel.disabled,
      ...(baseChoice?.tone == null ? {} : { tone: baseChoice.tone }),
    };
  });
}

function findReviewWorkChoice(
  gameState: GameState,
  workPlan: "temple-help" | "beg-alms",
  playerCharacterId: string,
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined,
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): ReturnType<typeof getReviewWorkChoices>[number] | null {
  return (
    getReviewWorkChoices(
      gameState,
      playerCharacterId,
      activityDefinitionsById,
      textEntriesById,
      houseModuleDefaults
    ).find((choice) => choice.id === workPlan) ?? null
  );
}

function getTempleRootActions(
  gameState: GameState,
  currentWorkPlan: TempleHouseWorkPlan,
  dialoguePhase: TempleHouseSessionState["dialoguePhase"],
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): HouseActionViewModel[] {
  const uiTextIds = resolveTempleStaticTextDefaults(houseModuleDefaults).uiTextIds;
  if (!isMonkStoryStage(gameState)) {
    return [
      {
        id: OPEN_TEMPLE_REST_MENU_ACTION_ID,
        label: resolveTempleText(textEntriesById, uiTextIds.rootActionRest),
        tone: "accent",
        buttonSound: "light",
      },
      {
        id: "open-donate",
        label: resolveTempleText(textEntriesById, uiTextIds.rootActionDonate),
        buttonSound: "light",
      } satisfies HouseActionViewModel,
      ...(dialoguePhase === "idle"
        ? []
        : [
            {
              id: "dismiss-dialogue",
              label: resolveTempleText(textEntriesById, uiTextIds.rootActionDismiss),
              buttonSound: "light",
            } satisfies HouseActionViewModel,
          ]),
    ];
  }

  return [
    ...(isTempleBeggingFoodReadyForSubmission(gameState)
      ? [
          {
            id: SUBMIT_TEMPLE_BEGGING_FOOD_ACTION_ID,
            label: resolveTempleTemplateText(
              textEntriesById,
              uiTextIds.rootActionSubmitFoodTemplate,
              {
                amount: formatTempleGrainAmount(readTempleAvailableFood(gameState)),
              }
            ),
            tone: "accent",
            buttonSound: "light",
          } satisfies HouseActionViewModel,
        ]
      : []),
    {
      id: OPEN_TEMPLE_WORK_MENU_ACTION_ID,
      label:
        currentWorkPlan == null
          ? resolveTempleText(textEntriesById, uiTextIds.rootActionWorkPending)
          : resolveTempleText(textEntriesById, uiTextIds.rootActionWorkReady),
      tone: "accent",
      disabled: currentWorkPlan == null,
      buttonSound: "light",
    },
    {
      id: OPEN_TEMPLE_REST_MENU_ACTION_ID,
      label: resolveTempleText(textEntriesById, uiTextIds.rootActionRest),
      buttonSound: "light",
    },
    {
      id: "open-donate",
      label: resolveTempleText(textEntriesById, uiTextIds.rootActionDonate),
      buttonSound: "light",
    } satisfies HouseActionViewModel,
    ...(dialoguePhase === "idle"
      ? []
      : [
          {
            id: "dismiss-dialogue",
            label: resolveTempleText(textEntriesById, uiTextIds.rootActionDismiss),
            buttonSound: "light",
          } satisfies HouseActionViewModel,
        ]),
  ];
}

function getTempleRestMenuActions(
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): HouseActionViewModel[] {
  const uiTextIds = resolveTempleStaticTextDefaults(houseModuleDefaults).uiTextIds;
  return [
    {
      id: TEMPLE_REST_ONE_DAY_ACTION_ID,
      label: resolveTempleText(textEntriesById, uiTextIds.restMenuOneDay),
      tone: "accent",
      buttonSound: "light",
    },
    {
      id: OPEN_TEMPLE_REST_DAYS_ACTION_ID,
      label: resolveTempleText(textEntriesById, uiTextIds.restMenuCustomDays),
      buttonSound: "light",
    },
    {
      id: TEMPLE_REST_UNTIL_COUNCIL_ACTION_ID,
      label: resolveTempleText(textEntriesById, uiTextIds.restMenuUntilCouncil),
      buttonSound: "light",
    },
    {
      id: TEMPLE_REST_UNTIL_RECOVERED_ACTION_ID,
      label: resolveTempleText(textEntriesById, uiTextIds.restMenuUntilRecovered),
      buttonSound: "light",
    },
    {
      id: CLOSE_TEMPLE_REST_MENU_ACTION_ID,
      label: resolveTempleText(textEntriesById, uiTextIds.menuBack),
      buttonSound: "light",
    },
  ];
}

function getTempleWorkMenuActions(
  dailyTasks: TempleHouseTaskDefinition[],
  currentWorkPlan: TempleHouseWorkPlan,
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): HouseActionViewModel[] {
  const uiTextIds = resolveTempleStaticTextDefaults(houseModuleDefaults).uiTextIds;
  return [
    ...dailyTasks.map<HouseActionViewModel>((taskDefinition) => ({
      id: `${ASSIGN_TEMPLE_TASK_ACTION_PREFIX}${taskDefinition.id}`,
      label: taskDefinition.title,
      tone: "default",
      buttonSound: "light",
    })),
    ...(dailyTasks.length === 0
      ? [
          {
            id: "temple-work-unavailable",
            label:
              currentWorkPlan == null
                ? resolveTempleText(
                    textEntriesById,
                    uiTextIds.workMenuUnavailablePending
                  )
                : currentWorkPlan === "beg-alms"
                  ? resolveTempleText(
                      textEntriesById,
                      "runtime.zhu_yuanzhang.temple.work.unavailable.beg_alms.001"
                    )
                : resolveTempleText(
                    textEntriesById,
                    uiTextIds.workMenuUnavailableIdle
                  ),
            disabled: true,
          } satisfies HouseActionViewModel,
        ]
      : []),
    {
      id: CLOSE_TEMPLE_WORK_MENU_ACTION_ID,
      label: resolveTempleText(textEntriesById, uiTextIds.menuBack),
      buttonSound: "light",
    },
  ];
}

function submitReviewWorkPlan(
  input: HouseModuleDispatchInput<"temple-house">,
  sessionState: TempleHouseSessionState,
  workPlan: "temple-help" | "beg-alms"
): HouseModuleTransitionResult<"temple-house"> {
  // This remains a host-owned settlement seam on purpose: choosing the next
  // temple work plan also writes back story-stage/week/countdown state and
  // shows the existing assigned-result shell. We keep that owner in the host
  // instead of forcing it into shared meeting summary/complete.
  const currentStoryStage = readZhuYuanzhangStoryStage(input.gameState);
  const currentTempleWeek = getTempleWeek(input.gameState);
  const thirdTempleWeekAssignment = isThirdTempleWeekAssignmentPending(
    input.gameState
  );
  const fourthTempleWeekAssignment = isFourthTempleWeekAssignmentPending(
    input.gameState
  );
  const secondTempleWeekTransition =
    !thirdTempleWeekAssignment &&
    !fourthTempleWeekAssignment &&
    readZhuYuanzhangStoryStage(input.gameState) ===
      ZHU_YUANZHANG_STORY_STAGES.huangjueTemple &&
    isBeggingUnlocked(input.gameState) &&
    getTempleWeek(input.gameState) === 2;
  const nextWorkPlan =
    thirdTempleWeekAssignment || fourthTempleWeekAssignment
      ? "beg-alms"
      : workPlan;
  const assignmentPhase = thirdTempleWeekAssignment
    ? "third-week"
    : fourthTempleWeekAssignment
      ? "fourth-week"
      : "default";
  const requestedAssignmentSeed = resolveTempleReviewWorkPlanAssignmentSeed({
    workPlan,
    assignmentPhase,
    currentStage: currentStoryStage,
    currentTempleWeek,
  }, input.houseModuleDefaults);
  const resolvedAssignmentSeed =
    nextWorkPlan === workPlan
      ? requestedAssignmentSeed
      : resolveTempleReviewWorkPlanAssignmentSeed({
          workPlan: nextWorkPlan,
          assignmentPhase,
          currentStage: currentStoryStage,
          currentTempleWeek,
        }, input.houseModuleDefaults);

  if (workPlan === "beg-alms" && !isBeggingUnlocked(input.gameState)) {
    const reviewAssignmentTextIds = resolveTempleStaticTextDefaults(
      input.houseModuleDefaults
    ).reviewAssignmentTextIds;
    return withSessionState(
      {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        overlay: createAlertOverlay(
          resolveTempleText(
            input.textEntriesById,
            getTempleBegAlmsWorkPlanTextId(
              input.gameState,
              true,
              input.houseModuleDefaults
            )
          ),
          [
            resolveTempleText(
              input.textEntriesById,
              reviewAssignmentTextIds.locked[0]
            ),
            resolveTempleText(
              input.textEntriesById,
              reviewAssignmentTextIds.locked[1]
            ),
          ],
          "warning"
        ),
      }
    );
  }

  const nextState = {
    ...input.gameState,
    world: {
      ...input.gameState.world,
      schedule: {
        ...input.gameState.world.schedule,
        councilDate: addDaysToDate(getCurrentDate(input.gameState), 30),
      },
    },
    missions: {
      ...input.gameState.missions,
      activeMissionId: requestedAssignmentSeed.activeMissionId,
    },
    ui: {
      ...input.gameState.ui,
      activeMissionId: resolvedAssignmentSeed.activeMissionId,
      reviewDateText: formatReviewDateText(
        resolvedAssignmentSeed.reviewCountdownDays
      ),
      mainHouseMissionText:
        nextWorkPlan == null
          ? ""
          : getTempleWorkPlanLabel(
              {
                ...input.gameState,
                runtime: {
                  ...input.gameState.runtime,
                  flags: {
                    ...input.gameState.runtime.flags,
                    ...(nextWorkPlan === "beg-alms"
                      ? {
                          [ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked]: true,
                        }
                      : {}),
                  },
                  variables: {
                    ...input.gameState.runtime.variables,
                    [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage]:
                      resolvedAssignmentSeed.stage,
                    [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeWeek]:
                      resolvedAssignmentSeed.templeWeek,
                  },
                },
              },
              nextWorkPlan,
              input.textEntriesById,
              input.houseModuleDefaults
            ),
      },
    runtime: {
      ...input.gameState.runtime,
      flags: {
        ...input.gameState.runtime.flags,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted]: true,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked]: true,
        ...(secondTempleWeekTransition
          ? {
              [ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingTransitionAssigned]: true,
            }
          : {}),
      },
      variables: {
        ...input.gameState.runtime.variables,
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution]: 0,
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage]: resolvedAssignmentSeed.stage,
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeWeek]:
          resolvedAssignmentSeed.templeWeek,
        [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]:
          resolvedAssignmentSeed.reviewCountdownDays,
        [TEMPLE_HOUSE_VARIABLE_KEYS.lastAssignedTaskId]: "",
        [TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan]: nextWorkPlan,
        [TEMPLE_HOUSE_VARIABLE_KEYS.beggingSubmittedFood]: 0,
        [TEMPLE_HOUSE_VARIABLE_KEYS.beggingLastGrade]: "",
      },
    },
  };

  return {
    gameState: nextState,
    characterDefinitions: input.characterDefinitions,
    sessionState: {
      ...sessionState,
      mode: "daily",
      meetingStage: "assigned",
      dialoguePhase: "open",
      selectedTaskId: null,
      selectedWorkPlan: nextWorkPlan,
      dailyActionPanel: "root",
      dialogueLines: resolvedAssignmentSeed.dialogueTextIds.map((textId) =>
        resolveTempleText(input.textEntriesById, textId)
      ),
      overlay: createAlertOverlay(
        resolveTempleText(
          input.textEntriesById,
          resolvedAssignmentSeed.overlayTitleTextId
        ),
        resolvedAssignmentSeed.overlayBodyTextIds.map((textId) =>
          resolveTempleText(input.textEntriesById, textId)
        ),
        "success"
      ),
    },
  };
}

function assignTempleTask(
  input: HouseModuleDispatchInput<"temple-house">,
  sessionState: TempleHouseSessionState,
  taskId: string
): HouseModuleTransitionResult<"temple-house"> {
  const assignmentSeed = resolveTempleReviewTaskAssignmentSeed(
    input.houseModuleDefaults
  );
  const taskDefinition = findTempleTaskDefinition(
    taskId,
    input.activityDefinitionsById,
    input.textEntriesById
  );

  const nextState = {
    ...input.gameState,
    world: {
      ...input.gameState.world,
      schedule: {
        ...input.gameState.world.schedule,
        councilDate: addDaysToDate(getCurrentDate(input.gameState), 30),
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
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution]: 0,
        [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]:
          assignmentSeed.reviewCountdownDays,
        [TEMPLE_HOUSE_VARIABLE_KEYS.lastAssignedTaskId]: taskDefinition.id,
        [TEMPLE_HOUSE_VARIABLE_KEYS.beggingSubmittedFood]: 0,
        [TEMPLE_HOUSE_VARIABLE_KEYS.beggingLastGrade]: "",
      },
    },
  };

  return {
    gameState: nextState,
    characterDefinitions: input.characterDefinitions,
    sessionState: {
      ...sessionState,
      mode: "meeting",
      meetingStage: "assigned",
      dialoguePhase: "open",
      selectedTaskId: taskDefinition.id,
      dialogueLines: [
        ...taskDefinition.orderLines,
        resolveTempleTemplateText(
          input.textEntriesById,
          assignmentSeed.orderSummaryTextId,
          { taskTitle: taskDefinition.title }
        ),
      ],
      overlay: createAlertOverlay(
        resolveTempleText(
          input.textEntriesById,
          assignmentSeed.overlayTitleTextId
        ),
        [
          taskDefinition.briefing,
          resolveTempleText(
            input.textEntriesById,
            assignmentSeed.overlaySharedTextId
          ),
        ],
        "success"
      ),
    },
  };
}

function handleLegacyTempleReviewFallback(
  input: HouseModuleDispatchInput<"temple-house">,
  actionId: string,
  nextState: GameState,
  sessionState: TempleHouseSessionState,
  playerCharacter: CharacterDefinition,
  seniorMonkCharacter: CharacterDefinition
): HouseModuleTransitionResult<"temple-house"> | null {
  if (actionId === "advance-temple-dialogue") {
    if (sessionState.mode === "meeting") {
      const contributionEntries = getTempleContributionEntries(
        nextState,
        playerCharacter,
        seniorMonkCharacter
      );
      switch (sessionState.meetingStage) {
        case "intro":
          return withSessionState(
            {
              gameState: nextState,
              characterDefinitions: input.characterDefinitions,
            },
            sessionState,
            {
              meetingStage: "assignment-table",
              dialoguePhase: "open",
              dialogueLines: [
                resolveTempleText(
                  input.textEntriesById,
                  resolveTempleStaticTextDefaults(input.houseModuleDefaults).uiTextIds
                    .reviewProgressLead
                ),
              ],
              overlay: createTempleReviewAssignmentTableOverlay(
                createTempleReviewAssignmentRows(
                  nextState,
                  contributionEntries,
                  input.textEntriesById,
                  input.houseModuleDefaults
                ),
                input.textEntriesById,
                input.houseModuleDefaults
              ),
            }
          );
        case "praise":
          return withSessionState(
            {
              gameState: nextState,
              characterDefinitions: input.characterDefinitions,
            },
            sessionState,
            {
              meetingStage: "situation",
              dialoguePhase: "open",
              dialogueLines: [
                resolveTempleText(
                  input.textEntriesById,
                  resolveTempleStaticTextDefaults(input.houseModuleDefaults).uiTextIds
                    .reviewPraiseLead
                ),
                ...getTempleMeetingPolicyLines(
                  nextState,
                  input.textEntriesById
                ).slice(0, 1),
              ],
            }
          );
        case "situation":
          return withSessionState(
            {
              gameState: nextState,
              characterDefinitions: input.characterDefinitions,
            },
            sessionState,
            {
              meetingStage: "policy",
              dialoguePhase: "open",
              dialogueLines: [
                resolveTempleText(
                  input.textEntriesById,
                  resolveTempleStaticTextDefaults(input.houseModuleDefaults).uiTextIds
                    .reviewPolicyLead
                ),
              ],
              overlay: createTempleReviewPolicyPanelOverlay(
                createTempleReviewPolicyPanel(
                  nextState,
                  input.textEntriesById,
                  input.houseModuleDefaults
                ),
                input.textEntriesById,
                input.houseModuleDefaults
              ),
            }
          );
        case "policy":
          return withSessionState(
            {
              gameState: nextState,
              characterDefinitions: input.characterDefinitions,
            },
            sessionState,
            {
              meetingStage: "advice",
              dialoguePhase: "open",
              dialogueLines: [
                resolveTempleText(
                  input.textEntriesById,
                  resolveTempleStaticTextDefaults(input.houseModuleDefaults).uiTextIds
                    .reviewAdvicePrompt
                ),
              ],
              overlay: null,
            }
          );
        case "personnel":
          const praiseProjection = createTemplePraiseProjection({
            gameState: nextState,
            characterDefinitions: input.characterDefinitions,
            playerCharacter,
            seniorMonkCharacter,
            playerCharacterId: input.playerCharacterId,
            textEntriesById: input.textEntriesById,
          });
          return applyTempleHostedReviewProjectionToSessionState(
            {
              gameState: praiseProjection.gameState,
              characterDefinitions: praiseProjection.characterDefinitions,
            },
            sessionState,
            praiseProjection.projection
          );
        default:
          return createTransitionResult(input, {
            gameState: nextState,
          });
      }
    }

    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        meetingStage: "finished",
        dialoguePhase: "open",
        dialogueLines: getTempleOpenLines(
          input.textEntriesById,
          input.houseModuleDefaults
        ),
      }
    );
  }

  if (
    actionId === TEMPLE_REVIEW_GIVE_ADVICE_ACTION_ID ||
    actionId === TEMPLE_REVIEW_STAY_SILENT_ACTION_ID
  ) {
    if (sessionState.mode === "meeting" && sessionState.meetingStage === "advice") {
      const reviewWorkChoices = getReviewWorkChoices(
        nextState,
        input.playerCharacterId,
        input.activityDefinitionsById,
        input.textEntriesById,
        input.houseModuleDefaults
      );
      const adviceResponseLines =
        actionId === TEMPLE_REVIEW_GIVE_ADVICE_ACTION_ID
          ? [
              resolveTempleText(
                input.textEntriesById,
                resolveTempleStaticTextDefaults(input.houseModuleDefaults).uiTextIds
                  .reviewAdviceAcknowledge
              ),
            ]
          : [];
      const specialTaskHookResult = getDefaultReviewSpecialTaskHookResult();
      const specialTaskLines =
        specialTaskHookResult.type === "none"
          ? []
          : specialTaskHookResult.descriptionLines;

      return withSessionState(
        {
          gameState: nextState,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          meetingStage: "assign-duty",
          dialoguePhase: "open",
          overlay: null,
          dialogueLines: [
            ...adviceResponseLines,
            ...specialTaskLines,
            ...getTempleAssignDutyLines(
              nextState,
              reviewWorkChoices,
              input.textEntriesById,
              input.houseModuleDefaults
            ),
          ],
        }
      );
    }

    return createTransitionResult(input, {
      gameState: nextState,
    });
  }

  if (
    actionId === "close-review-assignment-table" &&
    sessionState.meetingStage === "assignment-table"
  ) {
    const settlementResult = settleTempleReviewAssignmentTable({
      gameState: nextState,
      characterDefinitions: input.characterDefinitions,
      houseDefinition: input.houseDefinition,
      playerCharacter,
      seniorMonkCharacter,
      playerCharacterId: input.playerCharacterId,
      textEntriesById: input.textEntriesById,
    });
    return applyTempleHostedReviewProjectionToSessionState(
      {
        gameState: settlementResult.gameState,
        characterDefinitions: settlementResult.characterDefinitions,
      },
      sessionState,
      settlementResult.projection
    );
  }

  if (actionId === "close-review-policy-panel") {
    if (sessionState.mode === "meeting" && sessionState.meetingStage === "policy") {
      return withSessionState(
        {
          gameState: nextState,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          meetingStage: "advice",
          dialoguePhase: "open",
          dialogueLines: [
            resolveTempleText(
              input.textEntriesById,
              resolveTempleStaticTextDefaults(input.houseModuleDefaults).uiTextIds
                .reviewAdvicePrompt
            ),
          ],
          overlay: null,
        }
      );
    }

    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        overlay: null,
      }
    );
  }

  if (actionId === "close-temple-overlay" && sessionState.meetingStage === "reward") {
    const personnelProjection = createTemplePersonnelOrPraiseProjection({
      gameState: nextState,
      characterDefinitions: input.characterDefinitions,
      houseDefinition: input.houseDefinition,
      playerCharacter,
      seniorMonkCharacter,
      playerCharacterId: input.playerCharacterId,
      textEntriesById: input.textEntriesById,
      ...(input.houseModuleDefaults == null
        ? {}
        : { houseModuleDefaults: input.houseModuleDefaults }),
    });
    return applyTempleHostedReviewProjectionToSessionState(
      {
        gameState: personnelProjection.gameState,
        characterDefinitions: personnelProjection.characterDefinitions,
      },
      sessionState,
      personnelProjection.projection
    );
  }

  if (actionId === "close-temple-overlay" && sessionState.meetingStage === "personnel") {
    const praiseProjection = createTemplePraiseProjection({
      gameState: nextState,
      characterDefinitions: input.characterDefinitions,
      playerCharacter,
      seniorMonkCharacter,
      playerCharacterId: input.playerCharacterId,
      textEntriesById: input.textEntriesById,
    });
    return applyTempleHostedReviewProjectionToSessionState(
      {
        gameState: praiseProjection.gameState,
        characterDefinitions: praiseProjection.characterDefinitions,
      },
      sessionState,
      praiseProjection.projection
    );
  }

  if (actionId === "close-temple-overlay" && sessionState.meetingStage === "assigned") {
    // Host-owned closeout for the settlement seam above. The review covered
    // path already reached shared meeting assign-duty; this final assigned
    // result shell intentionally returns to daily host ownership.
    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        mode: "daily",
        meetingStage: "finished",
        dialoguePhase: "idle",
        dailyActionPanel: "root",
        overlay: null,
      }
    );
  }

  const selectedReviewWorkPlan = parseReviewWorkActionId(actionId);
  if (selectedReviewWorkPlan == null) {
    return null;
  }

  const selectedReviewWorkChoice = findReviewWorkChoice(
    nextState,
    selectedReviewWorkPlan,
    input.playerCharacterId,
    input.activityDefinitionsById,
    input.textEntriesById,
    input.houseModuleDefaults
  );
  if (selectedReviewWorkChoice?.disabled === true) {
    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        overlay: createAlertOverlay(
          resolveTempleText(
            input.textEntriesById,
            resolveTempleStaticTextDefaults(input.houseModuleDefaults).alertTextIds
              .insufficientRankTitle
          ),
          resolveTempleStaticTextDefaults(
            input.houseModuleDefaults
          ).alertTextIds.insufficientRankLines.map((textId) =>
            resolveTempleText(input.textEntriesById, textId)
          ),
          "warning"
        ),
      }
    );
  }

  return submitReviewWorkPlan(
    {
      ...input,
      gameState: nextState,
    },
    sessionState,
    selectedReviewWorkPlan
  );
}

function startBegAlmsWork(
  input: HouseModuleDispatchInput<"temple-house">,
  sessionState: TempleHouseSessionState
): HouseModuleTransitionResult<"temple-house"> {
  const taskDefinition = findTempleTaskDefinition(
    "beg-alms",
    input.activityDefinitionsById,
    input.textEntriesById
  );

  return {
    gameState: {
      ...input.gameState,
      missions: {
        ...input.gameState.missions,
        activeMissionId: taskDefinition.missionId,
      },
        ui: {
          ...input.gameState.ui,
          activeMissionId: taskDefinition.missionId,
          mainHouseMissionText: isBeggingJourneyStage(input.gameState)
            ? resolveTempleText(
                input.textEntriesById,
                getTempleBegAlmsWorkPlanTextId(
                  input.gameState,
                  false,
                  input.houseModuleDefaults
                )
              )
            : taskDefinition.title,
        },
      runtime: {
        ...input.gameState.runtime,
        variables: {
          ...input.gameState.runtime.variables,
          [TEMPLE_HOUSE_VARIABLE_KEYS.lastAssignedTaskId]: taskDefinition.id,
        },
      },
    },
    characterDefinitions: input.characterDefinitions,
    sessionState: {
      ...sessionState,
      dialoguePhase: "open",
      selectedTaskId: taskDefinition.id,
      dailyActionPanel: "work",
      overlay: createAlertOverlay(
        getTempleBegAlmsStartOverlayTitle(
          input.gameState,
          input.textEntriesById,
          input.houseModuleDefaults
        ),
        getTempleBegAlmsStartOverlayLines(
          input.gameState,
          taskDefinition,
          input.textEntriesById,
          input.houseModuleDefaults
        ),
        "info"
      ),
    },
  };
}

function openTempleBeggingFoodOverlay(
  input: HouseModuleDispatchInput<"temple-house">,
  sessionState: TempleHouseSessionState
): HouseModuleTransitionResult<"temple-house"> {
  const availableFood = readTempleAvailableFood(input.gameState);
  const beggingFoodTextIds = resolveTempleStaticTextDefaults(
    input.houseModuleDefaults
  ).beggingFoodTextIds;
  if (availableFood <= 0) {
    return withSessionState(
      {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        overlay: createAlertOverlay(
          resolveTempleText(input.textEntriesById, beggingFoodTextIds.emptyTitle),
          beggingFoodTextIds.emptyLines.map((textId) =>
            resolveTempleText(input.textEntriesById, textId)
          ),
          "warning"
        ),
      }
    );
  }

  return withSessionState(
    {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
    },
    sessionState,
    {
      overlay: {
        type: "submit-food",
        quantity: availableFood,
        maxQuantity: availableFood,
      },
    }
  );
}

function updateTempleBeggingSubmitQuantity(
  input: HouseModuleDispatchInput<"temple-house">,
  sessionState: TempleHouseSessionState,
  quantity: number
): HouseModuleTransitionResult<"temple-house"> {
  const overlay = sessionState.overlay;
  if (overlay?.type !== "submit-food") {
    return createTransitionResult(input);
  }

  const maxQuantity = Math.max(1, readTempleAvailableFood(input.gameState));
  return withSessionState(input, sessionState, {
    overlay: {
      ...overlay,
      quantity: clamp(quantity, 1, maxQuantity),
      maxQuantity,
    },
  });
}

function confirmTempleBeggingFoodSubmission(
  input: HouseModuleDispatchInput<"temple-house">,
  sessionState: TempleHouseSessionState
): HouseModuleTransitionResult<"temple-house"> {
  const durationDays = getHouseWorkDurationDays();
  const beggingFoodTextIds = resolveTempleStaticTextDefaults(
    input.houseModuleDefaults
  ).beggingFoodTextIds;
  const overlay = sessionState.overlay;
  const availableFood = readTempleAvailableFood(input.gameState);
  const submittedQuantity =
    overlay?.type === "submit-food"
      ? Math.min(availableFood, Math.max(1, overlay.quantity))
      : 0;

  if (submittedQuantity <= 0) {
    return withSessionState(
      {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        overlay: createAlertOverlay(
          resolveTempleText(input.textEntriesById, beggingFoodTextIds.emptyTitle),
          [
            resolveTempleText(
              input.textEntriesById,
              beggingFoodTextIds.emptyLines[0]
            ),
          ],
          "warning"
        ),
      }
    );
  }

  const remainingDays = shouldRouteTempleActivityToCouncil(
    input.gameState,
    durationDays
  );
  if (remainingDays != null) {
    return createTempleInsufficientTimeResult(
      input,
      sessionState,
      remainingDays,
      durationDays,
      resolveTempleText(
        input.textEntriesById,
        resolveTempleStaticTextDefaults(input.houseModuleDefaults).uiTextIds
          .submitFoodActionLabel
      )
    );
  }

  const resolution = resolveTempleBeggingDelivery(
    submittedQuantity,
    input.textEntriesById
  );
  const currentContribution = getTempleContribution(input.gameState);
  const nextContribution = currentContribution + resolution.contribution;
  let nextState = mutatePlayerGrainDou(input.gameState, -submittedQuantity);
  const staminaMutation = spendPlayerStamina(
    nextState,
    input.characterDefinitions,
    input.playerCharacterId
  );
  nextState = staminaMutation.state;

  nextState = {
    ...nextState,
    ui: {
      ...nextState.ui,
      mainHouseMissionText: resolveTempleText(
        input.textEntriesById,
        beggingFoodTextIds.submittedMissionLabel
      ),
    },
    runtime: {
      ...nextState.runtime,
      variables: {
        ...nextState.runtime.variables,
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution]: nextContribution,
        [TEMPLE_HOUSE_VARIABLE_KEYS.beggingSubmittedFood]: submittedQuantity,
        [TEMPLE_HOUSE_VARIABLE_KEYS.beggingLastGrade]: resolution.grade,
      },
    },
  };

  return {
    gameState: nextState,
    characterDefinitions: staminaMutation.characterDefinitions,
    sessionState: {
      ...sessionState,
      dialoguePhase: "open",
      dailyActionPanel: "root",
      overlay: {
        type: "result",
        title: resolveTempleText(
          input.textEntriesById,
          beggingFoodTextIds.submittedMissionLabel
        ),
        grade: resolution.grade,
        score: resolution.contribution,
        rewardLines: [
          `交粮 ${formatTempleGrainAmount(submittedQuantity)}`,
          `寺中贡献 +${resolution.contribution}`,
          `累计贡献 ${nextContribution} / 30`,
          `时间 +${durationDays}天`,
          `体力 -${ACTIVITY_COMPLETION_STAMINA_COST}`,
          ...resolution.praiseLines,
        ],
      },
    },
    timeAdvanceCost: convertHouseActivityDaysToSegments(durationDays),
  };
}

function runTempleWorkPlayableRequest(
  input: HouseModuleDispatchInput<"temple-house">,
  sessionState: TempleHouseSessionState,
  taskActivityDefinition: TempleTaskActivityDefinition,
  request:
    | ReturnType<typeof createLaunchPlayableRequest>
    | ReturnType<typeof createPlayableActionRequest>,
  sideEffects?: HouseModuleTransitionResult<"temple-house">["sideEffects"]
): HouseModuleTransitionResult<"temple-house"> {
  const runtimeResult = runPlayableRuntime({
    state: createHousePlayableRuntimeState({
      gameState: input.gameState,
      moduleId: "temple-house",
      sessionState,
    }),
    request,
    characterDefinitions: input.characterDefinitions,
    playerCharacterId: input.playerCharacterId,
    activityDefinitionsById: createTempleWorkPlayableActivityDefinitionsById(
      taskActivityDefinition,
      input.activityDefinitionsById
    ),
  });
  const nextSessionState =
    readHousePlayableSessionState(runtimeResult.state, "temple-house") ??
    sessionState;
  const activitySession = runtimeResult.state.core.runtime.activitySession;

  if (activitySession?.type === "result") {
    const score = activitySession.score;
    const clearedGameState = {
      ...runtimeResult.state.core,
      runtime: {
        ...runtimeResult.state.core.runtime,
        activitySession: null,
        playableSession: null,
      },
    };

    return finalizeTempleWorkScore(
      {
        ...input,
        gameState: clearedGameState,
        characterDefinitions:
          runtimeResult.characterDefinitions ?? input.characterDefinitions,
      },
      nextSessionState,
      taskActivityDefinition.taskId,
      score
    );
  }

  return {
    gameState: runtimeResult.state.core,
    characterDefinitions:
      runtimeResult.characterDefinitions ?? input.characterDefinitions,
    sessionState: nextSessionState,
    ...(sideEffects == null ? {} : { sideEffects }),
  };
}

function startTempleWorkMinigame(
  input: HouseModuleDispatchInput<"temple-house">,
  sessionState: TempleHouseSessionState,
  taskDefinition: TempleHouseTaskDefinition
): HouseModuleTransitionResult<"temple-house"> {
  const taskActivityDefinition = findTempleTaskActivityDefinition(
    taskDefinition.id,
    input.activityDefinitionsById
  );
  const nextSessionState = {
    ...sessionState,
    mode: "daily" as const,
    meetingStage: "finished" as const,
    dialoguePhase: "idle" as const,
    selectedTaskId: taskDefinition.id,
    dailyActionPanel: "work" as const,
    overlay: null,
  };

  return runTempleWorkPlayableRequest(
    input,
    nextSessionState,
    taskActivityDefinition,
    createLaunchPlayableRequest("activity-qte", {
      integrationId: TEMPLE_ACTIVITY_QTE_INTEGRATION_ID,
      ownerContext: {
        ownerKind: "house",
        ownerId: input.houseDefinition.id,
        returnPolicy: "resume-owner",
      },
      payload: {
        activityId: taskActivityDefinition.id,
        handlerId: "generic.qte",
      },
    }),
    createTempleWorkPlayableSideEffects()
  );
}

function finalizeTempleWorkScore(
  input: HouseModuleDispatchInput<"temple-house">,
  sessionState: TempleHouseSessionState,
  taskId: string,
  score: number
): HouseModuleTransitionResult<"temple-house"> {
  const durationDays = getHouseWorkDurationDays();
  const taskDefinition = findTempleTaskDefinition(
    taskId,
    input.activityDefinitionsById,
    input.textEntriesById
  );
  const taskActivityDefinition = findTempleTaskActivityDefinition(
    taskId,
    input.activityDefinitionsById
  );
  const bestScoreKey = getActivityBestScoreVariableKey(taskActivityDefinition.id);
  const existingBestScore = readActivityBestScore(
    input.gameState,
    taskActivityDefinition.id
  );
  const nextBestScore = Math.max(existingBestScore ?? 0, score);
  const resolution = resolveTempleWorkContribution(
    score,
    input.textEntriesById,
    input.houseModuleDefaults
  );
  const currentContribution = getTempleContribution(input.gameState);
  const nextContribution = currentContribution + score;
  const unlockBegging =
    !isBeggingUnlocked(input.gameState) && nextContribution >= 30;

  const nextVariables = {
    ...input.gameState.runtime.variables,
    [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution]: nextContribution,
    [bestScoreKey]: nextBestScore,
    ...(unlockBegging
      ? {
          [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeWeek]: 2,
        }
      : {}),
  };

  const rewardLines = [
    `本次评定：${taskDefinition.title}`,
    `玩法分数 ${score}`,
    `贡献值 +${score}（1:1）`,
    `寺中贡献 +${score}`,
    `累计贡献 ${nextContribution} / 30`,
    `时间 +${durationDays}天`,
    `体力 -${ACTIVITY_COMPLETION_STAMINA_COST}`,
    ...(unlockBegging
      ? [
          resolveTempleText(
            input.textEntriesById,
            "runtime.zhu_yuanzhang.temple.main_mission.unlock_begging.001"
          ),
        ]
      : []),
  ];
  const nextState = {
    ...input.gameState,
    ui: {
      ...input.gameState.ui,
      mainHouseMissionText: unlockBegging
        ? resolveTempleText(
            input.textEntriesById,
            "runtime.zhu_yuanzhang.temple.main_mission.review_wait.label"
          )
        : resolveTempleText(
            input.textEntriesById,
            "runtime.zhu_yuanzhang.temple.main_mission.continue_help.label"
          ),
    },
    runtime: {
      ...input.gameState.runtime,
      flags: {
        ...input.gameState.runtime.flags,
        ...(unlockBegging
          ? {
              [ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked]: true,
            }
          : {}),
      },
      variables: nextVariables,
    },
  };
  const staminaMutation = spendPlayerStamina(
    nextState,
    input.characterDefinitions,
    input.playerCharacterId
  );

  return {
    gameState: staminaMutation.state,
    characterDefinitions: staminaMutation.characterDefinitions,
    sessionState: {
      ...sessionState,
      dialoguePhase: "open",
      dialogueLines: unlockBegging
        ? [
            resolveTempleText(
              input.textEntriesById,
              "runtime.zhu_yuanzhang.temple.review.unlock_dialogue.001"
            ),
            resolveTempleText(
              input.textEntriesById,
              "runtime.zhu_yuanzhang.temple.review.unlock_dialogue.002"
            ),
          ]
        : resolution.praiseLines,
      overlay: {
        type: "result",
        title: resolveTempleText(
          input.textEntriesById,
          resolveTempleStaticTextDefaults(input.houseModuleDefaults).workResultTextIds[
            unlockBegging ? "unlockTitle" : "normalTitle"
          ]
        ),
        grade: resolution.grade,
        score,
        rewardLines,
      },
      selectedTaskId: taskId,
    },
    sideEffects: [{ type: "stop-interval", intervalId: TEMPLE_WORK_INTERVAL_ID }],
    timeAdvanceCost: convertHouseActivityDaysToSegments(durationDays),
  };
}

function finalizeTempleWork(
  input: HouseModuleDispatchInput<"temple-house">,
  sessionState: TempleHouseSessionState,
  overlay: TempleHouseQteOverlayState
): HouseModuleTransitionResult<"temple-house"> {
  return finalizeTempleWorkScore(
    input,
    sessionState,
    overlay.taskId,
    overlay.successes
  );
}

function handleTempleWorkTick(
  input: HouseModuleDispatchInput<"temple-house">,
  sessionState: TempleHouseSessionState
): HouseModuleTransitionResult<"temple-house"> {
  if (
    input.request.type !== "tick" ||
    input.request.tickId !== TEMPLE_WORK_INTERVAL_ID
  ) {
    return createTransitionResult(input);
  }

  const overlay = sessionState.overlay;
  if (overlay?.type !== "qte-bar") {
    return createTransitionResult(input, {
      sideEffects: [{ type: "stop-interval", intervalId: TEMPLE_WORK_INTERVAL_ID }],
    });
  }

  const nextMarker = overlay.markerPercent + overlay.markerDirection * TEMPLE_WORK_MARKER_STEP;
  if (nextMarker >= 100) {
    return withSessionState(
      input,
      sessionState,
      {
        overlay: {
          ...overlay,
          markerPercent: 100,
          markerDirection: -1,
        },
      }
    );
  }

  if (nextMarker <= 0) {
    return withSessionState(
      input,
      sessionState,
      {
        overlay: {
          ...overlay,
          markerPercent: 0,
          markerDirection: 1,
        },
      }
    );
  }

  return withSessionState(input, sessionState, {
    overlay: {
      ...overlay,
      markerPercent: nextMarker,
    },
  });
}

function handleTempleWorkStop(
  input: HouseModuleDispatchInput<"temple-house">,
  sessionState: TempleHouseSessionState
): HouseModuleTransitionResult<"temple-house"> {
  const overlay = sessionState.overlay;
  if (overlay?.type !== "qte-bar") {
    return createTransitionResult(input);
  }

  const hit =
    overlay.markerPercent >= overlay.targetStartPercent &&
    overlay.markerPercent <= overlay.targetStartPercent + overlay.targetWidthPercent;
  const nextSuccesses = hit ? overlay.successes + 1 : overlay.successes;

  if (overlay.round >= overlay.totalRounds) {
    return finalizeTempleWork(
      input,
      sessionState,
      {
        ...overlay,
        successes: nextSuccesses,
      }
    );
  }

  const taskDefinition = findTempleTaskDefinition(
    overlay.taskId,
    input.activityDefinitionsById,
    input.textEntriesById
  );

  return withSessionState(
    input,
    sessionState,
    {
      overlay: createTempleWorkOverlay(
        taskDefinition,
        overlay.round + 1,
        nextSuccesses
      ),
    }
  );
}

function handleField(
  input: HouseModuleDispatchInput<"temple-house">,
  sessionState: TempleHouseSessionState | null
): HouseModuleTransitionResult<"temple-house"> {
  if (input.request.type !== "field" || sessionState == null) {
    return createTransitionResult(input);
  }

  const nextState = ensureTempleRuntimeState(input.gameState);

  if (input.request.fieldId === TEMPLE_REST_DAYS_FIELD_ID) {
    if (sessionState.overlay?.type !== "rest-days") {
      return createTransitionResult(input, { gameState: nextState });
    }

    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        overlay: {
          ...sessionState.overlay,
          inputValue: input.request.value,
        },
      }
    );
  }

  if (input.request.fieldId === TEMPLE_WORK_SPEED_FIELD_ID) {
    if (
      input.gameState.runtime.playableSession?.playableId !== "activity-qte" ||
      input.gameState.runtime.activitySession?.type !== "fortune-board"
    ) {
      return createTransitionResult(input, { gameState: nextState });
    }

    const activeTaskId =
      sessionState.selectedTaskId ??
      findActiveTempleWorkTaskId(input.gameState, input.activityDefinitionsById);
    if (activeTaskId == null) {
      return createTransitionResult(input, { gameState: nextState });
    }

    const nextTickMs = clampTempleFortuneBoardTickMs(Number(input.request.value));
    return runTempleWorkPlayableRequest(
      {
        ...input,
        gameState: nextState,
      },
      sessionState,
      findTempleTaskActivityDefinition(activeTaskId, input.activityDefinitionsById),
      createPlayableActionRequest("activity-qte", "speed", {
        tickMs: nextTickMs,
      }),
      [
        { type: "stop-interval", intervalId: TEMPLE_WORK_INTERVAL_ID },
        {
          type: "start-interval",
          intervalId: TEMPLE_WORK_INTERVAL_ID,
          everyMs: nextTickMs,
          request: {
            type: "tick",
            tickId: TEMPLE_WORK_INTERVAL_ID,
          },
        },
      ]
    );
  }

  if (input.request.fieldId === TEMPLE_BEGGING_SUBMIT_FIELD_ID) {
    const quantity = Number.parseInt(input.request.value, 10) || 1;
    return updateTempleBeggingSubmitQuantity(
      {
        ...input,
        gameState: nextState,
      },
      sessionState,
      quantity
    );
  }

  return createTransitionResult(input, { gameState: nextState });
}

function handleAction(
  input: HouseModuleDispatchInput<"temple-house">,
  sessionState: TempleHouseSessionState | null
): HouseModuleTransitionResult<"temple-house"> {
  if (input.request.type !== "action" || sessionState == null) {
    return createTransitionResult(input);
  }

  const abbotCharacter = getAbbotCharacter(
    input.characterDefinitions,
    input.houseDefinition.defaultCharacterId
  );
  const playerCharacter = getPlayerCharacter(
    input.characterDefinitions,
    input.playerCharacterId
  );
  const seniorMonkCharacter = input.characterDefinitions.find(
    (characterDefinition) =>
      characterDefinition.id !== abbotCharacter.id &&
      input.houseDefinition.characterIds.includes(characterDefinition.id)
  );
  assertExists(
    seniorMonkCharacter,
    "Temple house is missing a senior monk participant for review."
  );
  const nextState = ensureTempleRuntimeState(input.gameState);
  const actionId = input.request.actionId;
  const templeHostedReviewMeetingActive = isTempleHostedReviewMeetingActive(
    input.sharedSessionState
  );
  const hostedSettlementResult = matchHostedMeetingSettlementHandoff({
    input,
    sessionState,
    hostedMeetingId: "meeting.temple.review",
    resolvePayload: resolveTempleHostedReviewWorkPlanChoice,
    settle: (workPlan) => submitReviewWorkPlan(input, sessionState, workPlan),
  });
  if (hostedSettlementResult != null) {
    return hostedSettlementResult;
  }

  const hostedAssignmentTableHandoff = matchHostedMeetingStageHandoff({
    sharedSessionState: input.sharedSessionState ?? null,
    hostedMeetingId: "meeting.temple.review",
    currentStageId: "assignment-table",
    actionId,
    expectedActionId: "close-review-assignment-table",
    gameState: nextState,
    characterDefinitions: input.characterDefinitions,
    handoff: (hostedSessionState) => {
      const settlementResult = settleTempleReviewAssignmentTable({
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
        houseDefinition: input.houseDefinition,
        playerCharacter,
        seniorMonkCharacter,
        playerCharacterId: input.playerCharacterId,
        textEntriesById: input.textEntriesById,
        ...(input.houseModuleDefaults == null
          ? {}
          : { houseModuleDefaults: input.houseModuleDefaults }),
      });
      return {
        gameState: settlementResult.gameState,
        characterDefinitions: settlementResult.characterDefinitions,
        sessionState: projectTempleHostedReviewStage({
          hostedSessionState,
          projection: settlementResult.projection,
          gameState: settlementResult.gameState,
          ...(input.textEntriesById == null
            ? {}
            : { textEntriesById: input.textEntriesById }),
          ...(input.activityDefinitionsById == null
            ? {}
            : { activityDefinitionsById: input.activityDefinitionsById }),
          ...(input.houseModuleDefaults == null
            ? {}
            : { houseModuleDefaults: input.houseModuleDefaults }),
          playerCharacterId: input.playerCharacterId,
        }),
      };
    },
  });
  if (hostedAssignmentTableHandoff != null) {
    return {
      gameState: hostedAssignmentTableHandoff.gameState,
      characterDefinitions: hostedAssignmentTableHandoff.characterDefinitions,
      sessionState,
      sharedSessionState: hostedAssignmentTableHandoff.sharedSessionState,
    };
  }

  const hostedRewardStageHandoff = matchHostedMeetingStageHandoff({
    sharedSessionState: input.sharedSessionState ?? null,
    hostedMeetingId: "meeting.temple.review",
    currentStageId: "reward",
    actionId,
    expectedActionId: "close-temple-overlay",
    gameState: nextState,
    characterDefinitions: input.characterDefinitions,
    handoff: (hostedSessionState) => {
      const personnelProjection = createTemplePersonnelOrPraiseProjection({
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
        houseDefinition: input.houseDefinition,
        playerCharacter,
        seniorMonkCharacter,
        playerCharacterId: input.playerCharacterId,
        textEntriesById: input.textEntriesById,
        ...(input.houseModuleDefaults == null
          ? {}
          : { houseModuleDefaults: input.houseModuleDefaults }),
      });
      return {
        gameState: personnelProjection.gameState,
        characterDefinitions: personnelProjection.characterDefinitions,
        sessionState: projectTempleHostedReviewStage({
          hostedSessionState,
          projection: personnelProjection.projection,
          gameState: personnelProjection.gameState,
          ...(input.textEntriesById == null
            ? {}
            : { textEntriesById: input.textEntriesById }),
          ...(input.activityDefinitionsById == null
            ? {}
            : { activityDefinitionsById: input.activityDefinitionsById }),
          ...(input.houseModuleDefaults == null
            ? {}
            : { houseModuleDefaults: input.houseModuleDefaults }),
          playerCharacterId: input.playerCharacterId,
        }),
      };
    },
  });
  if (hostedRewardStageHandoff != null) {
    return {
      gameState: hostedRewardStageHandoff.gameState,
      characterDefinitions: hostedRewardStageHandoff.characterDefinitions,
      sessionState,
      sharedSessionState: hostedRewardStageHandoff.sharedSessionState,
    };
  }

  const hostedPersonnelStageHandoff = matchHostedMeetingStageHandoff({
    sharedSessionState: input.sharedSessionState ?? null,
    hostedMeetingId: "meeting.temple.review",
    currentStageId: "personnel",
    actionId,
    expectedActionId: "close-temple-overlay",
    gameState: nextState,
    characterDefinitions: input.characterDefinitions,
    handoff: (hostedSessionState) => {
      const praiseProjection = createTemplePraiseProjection({
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
        playerCharacter,
        seniorMonkCharacter,
        playerCharacterId: input.playerCharacterId,
        textEntriesById: input.textEntriesById,
      });
      return {
        gameState: praiseProjection.gameState,
        characterDefinitions: praiseProjection.characterDefinitions,
        sessionState: projectTempleHostedReviewStage({
          hostedSessionState,
          projection: praiseProjection.projection,
          gameState: praiseProjection.gameState,
          ...(input.textEntriesById == null
            ? {}
            : { textEntriesById: input.textEntriesById }),
          ...(input.activityDefinitionsById == null
            ? {}
            : { activityDefinitionsById: input.activityDefinitionsById }),
          ...(input.houseModuleDefaults == null
            ? {}
            : { houseModuleDefaults: input.houseModuleDefaults }),
          playerCharacterId: input.playerCharacterId,
        }),
      };
    },
  });
  if (hostedPersonnelStageHandoff != null) {
    return {
      gameState: hostedPersonnelStageHandoff.gameState,
      characterDefinitions: hostedPersonnelStageHandoff.characterDefinitions,
      sessionState,
      sharedSessionState: hostedPersonnelStageHandoff.sharedSessionState,
    };
  }

  const hostedAdviceStageHandoff = matchHostedMeetingStageHandoff({
    sharedSessionState: input.sharedSessionState ?? null,
    hostedMeetingId: "meeting.temple.review",
    currentStageId: "advice",
    actionId,
    matchesAction: (actionId) =>
      actionId === TEMPLE_REVIEW_GIVE_ADVICE_ACTION_ID ||
      actionId === TEMPLE_REVIEW_STAY_SILENT_ACTION_ID,
    gameState: nextState,
    characterDefinitions: input.characterDefinitions,
    handoff: (hostedSessionState) => {
      const reviewWorkChoices = getReviewWorkChoices(
        nextState,
        input.playerCharacterId,
        input.activityDefinitionsById,
        input.textEntriesById,
        input.houseModuleDefaults
      );
      const adviceResponseLines =
        actionId === TEMPLE_REVIEW_GIVE_ADVICE_ACTION_ID
          ? [
              resolveTempleText(
                input.textEntriesById,
                resolveTempleStaticTextDefaults(input.houseModuleDefaults).uiTextIds
                  .reviewAdviceAcknowledge
              ),
            ]
          : [];
      const specialTaskHookResult = getDefaultReviewSpecialTaskHookResult();
      const specialTaskLines =
        specialTaskHookResult.type === "none"
          ? []
          : specialTaskHookResult.descriptionLines;
      const projection: TempleHostedReviewStageProjection = {
        meetingStage: "assign-duty",
        overlay: null,
        dialogueLines: [
          ...adviceResponseLines,
          ...specialTaskLines,
          ...getTempleAssignDutyLines(
            nextState,
            reviewWorkChoices,
            input.textEntriesById,
            input.houseModuleDefaults
          ),
        ],
      };
      return {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
        sessionState: projectTempleHostedReviewStage({
          hostedSessionState,
          projection,
          gameState: nextState,
          playerCharacterId: input.playerCharacterId,
          ...(input.activityDefinitionsById == null
            ? {}
            : { activityDefinitionsById: input.activityDefinitionsById }),
          ...(input.textEntriesById == null
            ? {}
            : { textEntriesById: input.textEntriesById }),
          ...(input.houseModuleDefaults == null
            ? {}
            : { houseModuleDefaults: input.houseModuleDefaults }),
        }),
      };
    },
  });
  if (hostedAdviceStageHandoff != null) {
    return {
      gameState: hostedAdviceStageHandoff.gameState,
      characterDefinitions: hostedAdviceStageHandoff.characterDefinitions,
      sessionState,
      sharedSessionState: hostedAdviceStageHandoff.sharedSessionState,
    };
  }
  const hostedMeetingResult = resumeTempleHostedMeeting(
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
  );
  const hostedMeetingRequest =
    hostedMeetingResult == null
      ? null
      : resolveTempleHostedMeetingRequest(
          input.request.actionId,
          hostedMeetingResult.presenterModel?.actionContainer
        );
  if (hostedMeetingResult != null && hostedMeetingRequest != null) {
    const advancedMeetingResult = completeMeetingToHost(
      resumeTempleHostedMeeting(
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
              ...createInitialTempleHouseSessionState(
                "daily",
                "finished",
                getTempleGreetingLines(
                  input.textEntriesById,
                  input.houseModuleDefaults
                )
              ),
              selectedWorkPlan: sessionState.selectedWorkPlan,
            }
          : advancedMeetingResult.hostSessionState,
      sharedSessionState: advancedMeetingResult.sharedSessionState,
    };
  }

  if (!templeHostedReviewMeetingActive) {
    const legacyReviewFallbackResult = handleLegacyTempleReviewFallback(
      input,
      input.request.actionId,
      nextState,
      sessionState,
      playerCharacter,
      seniorMonkCharacter
    );
    if (legacyReviewFallbackResult != null) {
      return legacyReviewFallbackResult;
    }
  }

  if (input.request.actionId === CLOSE_TEMPLE_LEAVE_REFUSAL_ACTION_ID) {
    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      { dialogueOverride: null }
    );
  }

  if (
    input.request.actionId === TEMPLE_WORK_PLAY_ACTION_ID ||
    input.request.actionId === TEMPLE_WORK_WAGER_MINUS_ACTION_ID ||
    input.request.actionId === TEMPLE_WORK_WAGER_PLUS_ACTION_ID
  ) {
    const activeTaskId =
      sessionState.selectedTaskId ??
      findActiveTempleWorkTaskId(input.gameState, input.activityDefinitionsById);
    if (activeTaskId == null) {
      return createTransitionResult(input, { gameState: nextState });
    }

    const taskActivityDefinition = findTempleTaskActivityDefinition(
      activeTaskId,
      input.activityDefinitionsById
    );

    return runTempleWorkPlayableRequest(
      {
        ...input,
        gameState: nextState,
      },
      sessionState,
      taskActivityDefinition,
      createPlayableActionRequest(
        "activity-qte",
        input.request.actionId === TEMPLE_WORK_PLAY_ACTION_ID
          ? "play"
          : input.request.actionId === TEMPLE_WORK_WAGER_MINUS_ACTION_ID
            ? "wager-minus"
            : "wager-plus"
      )
    );
  }

  if (input.request.actionId === "temple-work-stop") {
    return handleTempleWorkStop(
      {
        ...input,
        gameState: nextState,
      },
      sessionState
    );
  }

  if (input.request.actionId === "dismiss-dialogue") {
    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        dialoguePhase: "idle",
        dailyActionPanel: "root",
      }
    );
  }

  if (input.request.actionId === "open-abbot-dialogue") {
    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        dialoguePhase: "open",
        dialogueLines: getTempleOpenLines(
          input.textEntriesById,
          input.houseModuleDefaults
        ),
      }
    );
  }

  if (input.request.actionId === OPEN_TEMPLE_WORK_MENU_ACTION_ID) {
    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        dialoguePhase: "open",
        dialogueLines: getTempleOpenLines(
          input.textEntriesById,
          input.houseModuleDefaults
        ),
        dailyActionPanel: "work",
      }
    );
  }

  if (input.request.actionId === CLOSE_TEMPLE_WORK_MENU_ACTION_ID) {
    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        dailyActionPanel: "root",
      }
    );
  }

  if (input.request.actionId === OPEN_TEMPLE_REST_MENU_ACTION_ID) {
    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        dailyActionPanel: "rest",
        dialoguePhase: "open",
        dialogueLines: getTempleRestMenuLines(
          input.textEntriesById,
          input.houseModuleDefaults
        ),
      }
    );
  }

  if (input.request.actionId === CLOSE_TEMPLE_REST_MENU_ACTION_ID) {
    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        dailyActionPanel: "root",
      }
    );
  }

  if (input.request.actionId === OPEN_TEMPLE_REST_DAYS_ACTION_ID) {
    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        overlay: {
          type: "rest-days",
          inputValue: "3",
        },
      }
    );
  }

  if (
    input.request.actionId === TEMPLE_REST_ONE_DAY_ACTION_ID ||
    input.request.actionId === TEMPLE_REST_UNTIL_COUNCIL_ACTION_ID ||
    input.request.actionId === TEMPLE_REST_UNTIL_RECOVERED_ACTION_ID
  ) {
    const actionId = input.request.actionId;
    const summary = runTempleRestPlan(
      nextState,
      input.characterDefinitions,
      input.playerCharacterId,
      (state, characterDefinitions, daysRested) => {
        if (actionId === TEMPLE_REST_ONE_DAY_ACTION_ID) {
          return daysRested < 1;
        }

        if (actionId === TEMPLE_REST_UNTIL_COUNCIL_ACTION_ID) {
          return !hasReachedCouncilDate(state);
        }

        const nextPlayerCharacter = getPlayerCharacter(
          characterDefinitions,
          input.playerCharacterId
        );
        return nextPlayerCharacter.stamina < 100;
      }
    );

    return createTempleRestAutoAdvanceResult(
      input,
      sessionState,
      summary,
      actionId === TEMPLE_REST_ONE_DAY_ACTION_ID
        ? resolveTempleText(
            input.textEntriesById,
            resolveTempleStaticTextDefaults(input.houseModuleDefaults).uiTextIds
              .restMenuOneDay
          )
        : actionId === TEMPLE_REST_UNTIL_COUNCIL_ACTION_ID
          ? resolveTempleText(
              input.textEntriesById,
              resolveTempleStaticTextDefaults(input.houseModuleDefaults).uiTextIds
                .restMenuUntilCouncil
            )
          : resolveTempleText(
              input.textEntriesById,
              resolveTempleStaticTextDefaults(input.houseModuleDefaults).uiTextIds
                .restMenuUntilRecovered
            ),
      nextState
    );
  }

  if (input.request.actionId === CONFIRM_TEMPLE_REST_DAYS_ACTION_ID) {
    const inputValue =
      sessionState.overlay?.type === "rest-days" ? sessionState.overlay.inputValue : "";
    const parsedDays = Number.parseInt(inputValue, 10);
    if (!Number.isFinite(parsedDays) || parsedDays <= 0) {
      return withSessionState(
        {
          gameState: nextState,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: createAlertOverlay(
            resolveTempleText(
              input.textEntriesById,
              resolveTempleStaticTextDefaults(input.houseModuleDefaults).alertTextIds
                .invalidRestDaysTitle
            ),
            [
              resolveTempleText(
                input.textEntriesById,
                resolveTempleStaticTextDefaults(input.houseModuleDefaults).alertTextIds
                  .invalidRestDaysBody
              ),
            ],
            "warning"
          ),
        }
      );
    }

    const days = clamp(parsedDays, 1, TEMPLE_REST_MAX_DAYS);
    const summary = runTempleRestPlan(
      nextState,
      input.characterDefinitions,
      input.playerCharacterId,
      (_state, _characterDefinitions, daysRested) => daysRested < days
    );

    return createTempleRestAutoAdvanceResult(
      input,
      sessionState,
      summary,
      resolveTempleTemplateText(
        input.textEntriesById,
        resolveTempleStaticTextDefaults(input.houseModuleDefaults).restSummaryTextIds
          .autoAdvanceTitleTemplate,
        { days }
      ),
      nextState
    );
  }

  if (input.request.actionId === SUBMIT_TEMPLE_BEGGING_FOOD_ACTION_ID) {
    return openTempleBeggingFoodOverlay(
      {
        ...input,
        gameState: nextState,
      },
      sessionState
    );
  }

  if (input.request.actionId === CANCEL_TEMPLE_BEGGING_FOOD_ACTION_ID) {
    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      { overlay: null }
    );
  }

  if (input.request.actionId === DECREMENT_TEMPLE_BEGGING_FOOD_ACTION_ID) {
    const quantity =
      sessionState.overlay?.type === "submit-food"
        ? sessionState.overlay.quantity - 1
        : 1;
    return updateTempleBeggingSubmitQuantity(
      {
        ...input,
        gameState: nextState,
      },
      sessionState,
      quantity
    );
  }

  if (input.request.actionId === INCREMENT_TEMPLE_BEGGING_FOOD_ACTION_ID) {
    const quantity =
      sessionState.overlay?.type === "submit-food"
        ? sessionState.overlay.quantity + 1
        : 1;
    return updateTempleBeggingSubmitQuantity(
      {
        ...input,
        gameState: nextState,
      },
      sessionState,
      quantity
    );
  }

  if (input.request.actionId === CONFIRM_TEMPLE_BEGGING_FOOD_ACTION_ID) {
    if (!canAffordActivityCost(playerCharacter)) {
      return withSessionState(
        {
          gameState: nextState,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: createLowStaminaOverlay(
            resolveTempleText(
              input.textEntriesById,
              resolveTempleStaticTextDefaults(input.houseModuleDefaults).uiTextIds
                .submitFoodActionLabel
            ),
            input.textEntriesById,
            input.houseModuleDefaults
          ),
        }
      );
    }

    return confirmTempleBeggingFoodSubmission(
      {
        ...input,
        gameState: nextState,
      },
      sessionState
    );
  }

  if (input.request.actionId === "ask-fortune") {
    const fortune = resolveFortuneLines(
      nextState,
      playerCharacter,
      input.textEntriesById
    );
    return {
      ...withSessionState(
        {
          gameState: nextState,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: createAlertOverlay(
            fortune.title,
            fortune.paragraphs,
            fortune.tone
          ),
        }
      ),
      timeAdvanceCost: 1,
    };
  }

  if (input.request.actionId === "open-donate") {
    const donationTextIds = resolveTempleStaticTextDefaults(
      input.houseModuleDefaults
    ).donationTextIds;
    const packDialogueParagraphs =
      readTemplePackBoundDialogueParagraphs(input, "donate");
    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        overlay: {
          type: "donate-confirm",
          title: resolveTempleText(input.textEntriesById, donationTextIds.confirmTitle),
          paragraphs:
            packDialogueParagraphs ??
            [
              resolveTempleTemplateText(
                input.textEntriesById,
                donationTextIds.confirmBodyTemplate,
                { donationAmount: DONATION_AMOUNT }
              ),
              resolveTempleText(
                input.textEntriesById,
                donationTextIds.confirmBodyFollowup
              ),
            ],
          amount: DONATION_AMOUNT,
        },
      }
    );
  }

  if (input.request.actionId === "confirm-donate") {
    const donationTextIds = resolveTempleStaticTextDefaults(
      input.houseModuleDefaults
    ).donationTextIds;
    const donationAmount =
      sessionState.overlay?.type === "donate-confirm"
        ? sessionState.overlay.amount
        : DONATION_AMOUNT;
    if (playerCharacter.stats.gold < donationAmount) {
      return withSessionState(
        {
          gameState: nextState,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: createAlertOverlay(
            resolveTempleText(input.textEntriesById, donationTextIds.insufficientTitle),
            [
              resolveTempleTemplateText(
                input.textEntriesById,
                donationTextIds.insufficientBodyTemplate,
                { currentGold: playerCharacter.stats.gold }
              ),
              resolveTempleText(
                input.textEntriesById,
                donationTextIds.insufficientBodyFollowup
              ),
            ],
            "warning"
          ),
        }
      );
    }

    const currentDonationTotal = readNumericVariable(
      nextState,
      TEMPLE_HOUSE_VARIABLE_KEYS.donationTotal,
      0
    );
    const nextDonationTotal = currentDonationTotal + donationAmount;
    const fameGain = nextDonationTotal % 200 === 0 ? 1 : 0;
    const nextPlayerCharacter: CharacterDefinition = {
      ...playerCharacter,
      stats: {
        ...playerCharacter.stats,
        gold: playerCharacter.stats.gold - donationAmount,
        fame: playerCharacter.stats.fame + fameGain,
      },
    };
    const nextCharacterDefinitions = replaceCharacter(
      input.characterDefinitions,
      nextPlayerCharacter
    );

    return {
      gameState: {
        ...nextState,
        runtime: {
          ...nextState.runtime,
          variables: {
            ...nextState.runtime.variables,
            [TEMPLE_HOUSE_VARIABLE_KEYS.donationTotal]: nextDonationTotal,
          },
        },
      },
      characterDefinitions: nextCharacterDefinitions,
      sessionState: {
        ...sessionState,
        overlay: createAlertOverlay(
          resolveTempleText(input.textEntriesById, donationTextIds.resultTitle),
          fameGain > 0
            ? [
                resolveTempleTemplateText(
                  input.textEntriesById,
                  donationTextIds.resultFameTemplate,
                  { donationAmount }
                ),
                resolveTempleTemplateText(
                  input.textEntriesById,
                  donationTextIds.resultFameFollowup,
                  { nextDonationTotal }
                ),
              ]
            : [
                resolveTempleTemplateText(
                  input.textEntriesById,
                  donationTextIds.resultNormalTemplate,
                  { donationAmount }
                ),
                resolveTempleTemplateText(
                  input.textEntriesById,
                  donationTextIds.resultNormalFollowup,
                  { nextDonationTotal }
                ),
              ],
          fameGain > 0 ? "success" : "info"
        ),
      },
      timeAdvanceCost: 1,
    };
  }

  if (input.request.actionId === "close-temple-result") {
    if (
      sessionState.overlay?.type === "result" &&
      sessionState.overlay.title ===
        resolveTempleText(
          input.textEntriesById,
          resolveTempleStaticTextDefaults(input.houseModuleDefaults).workResultTextIds
            .unlockTitle
        )
    ) {
      return {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
        sessionState: null,
        sideEffects: [
          { type: "stop-interval", intervalId: TEMPLE_WORK_INTERVAL_ID },
          {
            type: "start-map-auto-advance",
            intervalId: TEMPLE_REVIEW_AUTO_ADVANCE_INTERVAL_ID,
            everyMs: HOUSE_MAP_AUTO_ADVANCE_DAY_INTERVAL_MS,
            targetHouseId: input.houseDefinition.id,
            label: resolveTempleText(
              input.textEntriesById,
              "runtime.zhu_yuanzhang.temple.review.auto_advance.label"
            ),
            completion: {
              type: "enter-house",
              houseId: input.houseDefinition.id,
            },
          },
        ],
      };
    }

    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        overlay: null,
      },
      [{ type: "stop-interval", intervalId: TEMPLE_WORK_INTERVAL_ID }]
    );
  }

  if (input.request.actionId === "close-temple-overlay") {
    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        overlay: null,
      },
      [{ type: "stop-interval", intervalId: TEMPLE_WORK_INTERVAL_ID }]
    );
  }

  if (input.request.actionId === CANCEL_ACTIVITY_CONFIRM_ACTION_ID) {
    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        overlay: null,
      }
    );
  }

  const selectedTaskId = parseTempleTaskActionId(input.request.actionId);
  if (selectedTaskId != null) {
    const taskDefinition = findTempleTaskDefinition(
      selectedTaskId,
      input.activityDefinitionsById,
      input.textEntriesById
    );

    if (isMonkStoryStage(nextState) && TEMPLE_HELP_QTE_TASK_IDS.has(taskDefinition.id)) {
      if (!canAffordActivityCost(playerCharacter)) {
        return withSessionState(
          {
            gameState: nextState,
            characterDefinitions: input.characterDefinitions,
          },
          sessionState,
          {
            overlay: createLowStaminaOverlay(
              taskDefinition.title,
              input.textEntriesById,
              input.houseModuleDefaults
            ),
          }
        );
      }

      const durationDays = getHouseWorkDurationDays();
      const remainingDays = shouldRouteTempleActivityToCouncil(
        nextState,
        durationDays
      );
      if (remainingDays != null) {
        return createTempleInsufficientTimeResult(
          {
            ...input,
            gameState: nextState,
          },
          sessionState,
          remainingDays,
          durationDays,
          taskDefinition.title
        );
      }
      const taskActivityDefinition = findTempleTaskActivityDefinition(
        taskDefinition.id,
        input.activityDefinitionsById
      );
      return withSessionState(
        {
          gameState: nextState,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: createActivityConfirmOverlay(
            taskDefinition.title,
            [],
            `${CONFIRM_START_TEMPLE_TASK_ACTION_PREFIX}${taskDefinition.id}`,
            input.textEntriesById,
            input.houseModuleDefaults,
            createTempleWorkConfirmDetails(
              nextState,
              taskDefinition,
              taskActivityDefinition,
              durationDays,
              input.textEntriesById,
              input.houseModuleDefaults
            )
          ),
        }
      );
    }

    if (isMonkStoryStage(nextState) && taskDefinition.id === "beg-alms") {
      if (!canAffordActivityCost(playerCharacter)) {
        return withSessionState(
          {
            gameState: nextState,
            characterDefinitions: input.characterDefinitions,
          },
          sessionState,
          {
            overlay: createLowStaminaOverlay(
              taskDefinition.title,
              input.textEntriesById,
              input.houseModuleDefaults
            ),
          }
        );
      }

      const durationDays = getHouseWorkDurationDays();
      const remainingDays = shouldRouteTempleActivityToCouncil(
        nextState,
        durationDays
      );
      if (remainingDays != null) {
        return createTempleInsufficientTimeResult(
          {
            ...input,
            gameState: nextState,
          },
          sessionState,
          remainingDays,
          durationDays,
          taskDefinition.title
        );
      }
      const taskActivityDefinition = findTempleTaskActivityDefinition(
        taskDefinition.id,
        input.activityDefinitionsById
      );
      return withSessionState(
        {
          gameState: nextState,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: createActivityConfirmOverlay(
            taskDefinition.title,
            [],
            `${CONFIRM_START_TEMPLE_TASK_ACTION_PREFIX}${taskDefinition.id}`,
            input.textEntriesById,
            input.houseModuleDefaults,
            createTempleWorkConfirmDetails(
              nextState,
              taskDefinition,
              taskActivityDefinition,
              durationDays,
              input.textEntriesById,
              input.houseModuleDefaults
            )
          ),
        }
      );
    }

    return assignTempleTask(
      {
        ...input,
        gameState: nextState,
      },
      sessionState,
      selectedTaskId
    );
  }

  const confirmedTaskId = parseConfirmTempleTaskActionId(input.request.actionId);
  if (confirmedTaskId != null) {
    const taskDefinition = findTempleTaskDefinition(
      confirmedTaskId,
      input.activityDefinitionsById,
      input.textEntriesById
    );
    const durationDays = getHouseWorkDurationDays();
    const remainingDays = shouldRouteTempleActivityToCouncil(
      nextState,
      durationDays
    );
    if (remainingDays != null) {
      return createTempleInsufficientTimeResult(
        {
          ...input,
          gameState: nextState,
        },
        sessionState,
        remainingDays,
        durationDays,
        taskDefinition.title
      );
    }

    if (TEMPLE_HELP_QTE_TASK_IDS.has(taskDefinition.id)) {
      const packOwnedLaunchResult = tryLaunchTemplePackOwnedWorkPlayable(
        {
          ...input,
          gameState: nextState,
        },
        sessionState,
        taskDefinition
      );
      if (packOwnedLaunchResult != null) {
        return packOwnedLaunchResult;
      }

      return startTempleWorkMinigame(
        {
          ...input,
          gameState: nextState,
        },
        sessionState,
        taskDefinition
      );
    }

    if (taskDefinition.id === "beg-alms") {
      return startBegAlmsWork(
        {
          ...input,
          gameState: nextState,
        },
        sessionState
      );
    }
  }

  const quickCompleteTaskId = parseQuickCompleteTempleTaskActionId(
    input.request.actionId
  );
  if (quickCompleteTaskId != null) {
    const taskDefinition = findTempleTaskDefinition(
      quickCompleteTaskId,
      input.activityDefinitionsById,
      input.textEntriesById
    );
    const taskActivityDefinition = findTempleTaskActivityDefinition(
      quickCompleteTaskId,
      input.activityDefinitionsById
    );
    const bestScore = readActivityBestScore(nextState, taskActivityDefinition.id);
    if (bestScore == null) {
      return withSessionState(
        {
          gameState: nextState,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: createAlertOverlay(
            resolveTempleText(
              input.textEntriesById,
              resolveTempleStaticTextDefaults(input.houseModuleDefaults).alertTextIds
                .noBestScoreTitle
            ),
            [
              resolveTempleText(
                input.textEntriesById,
                resolveTempleStaticTextDefaults(input.houseModuleDefaults).alertTextIds
                  .noBestScoreBody
              ),
            ],
            "warning"
          ),
        }
      );
    }

    const durationDays = getHouseWorkDurationDays();
    if (!canAffordActivityCost(playerCharacter)) {
      return withSessionState(
        {
          gameState: nextState,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: createLowStaminaOverlay(
            taskDefinition.title,
            input.textEntriesById,
            input.houseModuleDefaults
          ),
        }
      );
    }

    const remainingDays = shouldRouteTempleActivityToCouncil(
      nextState,
      durationDays
    );
    if (remainingDays != null) {
      return createTempleInsufficientTimeResult(
        {
          ...input,
          gameState: nextState,
        },
        sessionState,
        remainingDays,
        durationDays,
        taskDefinition.title
      );
    }

    return finalizeTempleWorkScore(
      {
        ...input,
        gameState: nextState,
      },
      {
        ...sessionState,
        selectedTaskId: quickCompleteTaskId,
        dailyActionPanel: "work",
        overlay: null,
      },
      quickCompleteTaskId,
      Math.floor(bestScore * 0.9)
    );
  }

  return createTransitionResult(input, {
    gameState: nextState,
  });
}

function handleTick(
  input: HouseModuleDispatchInput<"temple-house">,
  sessionState: TempleHouseSessionState | null
): HouseModuleTransitionResult<"temple-house"> {
  if (input.request.type !== "tick" || sessionState == null) {
    return createTransitionResult(input);
  }

  if (
    input.request.tickId === TEMPLE_WORK_INTERVAL_ID &&
    input.gameState.runtime.playableSession?.playableId === "activity-qte" &&
    (input.gameState.runtime.activitySession?.type === "fortune-board" ||
      input.gameState.runtime.activitySession?.type === "pachinko-board")
  ) {
    if (
      input.gameState.runtime.activitySession.type === "pachinko-board" &&
      input.gameState.runtime.activitySession.phase === "settling"
    ) {
      return createTransitionResult(input, {
        sideEffects: [{ type: "stop-interval", intervalId: TEMPLE_WORK_INTERVAL_ID }],
      });
    }

    const activeTaskId =
      sessionState.selectedTaskId ??
      findActiveTempleWorkTaskId(input.gameState, input.activityDefinitionsById);
    if (activeTaskId == null) {
      return createTransitionResult(input, {
        sideEffects: [{ type: "stop-interval", intervalId: TEMPLE_WORK_INTERVAL_ID }],
      });
    }

    return runTempleWorkPlayableRequest(
      input,
      sessionState,
      findTempleTaskActivityDefinition(activeTaskId, input.activityDefinitionsById),
      createPlayableActionRequest("activity-qte", "tick")
    );
  }

  return handleTempleWorkTick(input, sessionState);
}

function isTempleFortuneBoardSession(
  gameState: GameState,
  houseId: string
): gameState is GameState & {
  runtime: GameState["runtime"] & {
    activitySession: ActivityFortuneBoardSession;
  };
} {
  return (
    gameState.runtime.playableSession?.playableId === "activity-qte" &&
    gameState.runtime.playableSession.ownerContext.ownerKind === "house" &&
    gameState.runtime.playableSession.ownerContext.ownerId === houseId &&
    gameState.runtime.activitySession?.type === "fortune-board"
  );
}

function isTemplePachinkoBoardSession(
  gameState: GameState,
  houseId: string
): gameState is GameState & {
  runtime: GameState["runtime"] & {
    activitySession: ActivityPachinkoBoardSession;
  };
} {
  return (
    gameState.runtime.playableSession?.playableId === "activity-qte" &&
    gameState.runtime.playableSession.ownerContext.ownerKind === "house" &&
    gameState.runtime.playableSession.ownerContext.ownerId === houseId &&
    gameState.runtime.activitySession?.type === "pachinko-board"
  );
}

function selectFortuneBoardOverlayViewModel(
  session: ActivityFortuneBoardSession
): HouseOverlayViewModel {
  return {
    type: "fortune-board",
    title: session.title,
    taskLabel: session.taskLabel,
    board: session.board,
    remainingPieces: session.remainingPieces,
    wager: session.wager,
    phase: session.phase,
    highlightedColumn: session.highlightedColumn,
    selectedColumn: session.selectedColumn,
    flashActive: session.phase === "column-flash" && session.flashTicks % 2 === 0,
    pickFlashActive: session.phase === "cell-pick" && session.flashTicks % 2 === 0,
    highlightedCellKey: session.highlightedCellKey,
    pickedCellKey: session.pickedCellKey,
    selectedCellKeys: session.selectedCellKeys,
    score: session.score,
    baseScore: session.baseScore,
    tripletRewards: session.tripletRewards,
    resonanceCount: session.resonanceCount,
    rumorCount: session.rumorCount,
    rerollCount: session.rerollCount,
    animationTickMs: session.animationTickMs,
    speedFieldId: TEMPLE_WORK_SPEED_FIELD_ID,
    playActionId: TEMPLE_WORK_PLAY_ACTION_ID,
    decreaseWagerActionId: TEMPLE_WORK_WAGER_MINUS_ACTION_ID,
    increaseWagerActionId: TEMPLE_WORK_WAGER_PLUS_ACTION_ID,
  };
}

function selectPachinkoBoardOverlayViewModel(
  session: ActivityPachinkoBoardSession
): HouseOverlayViewModel {
  return {
    type: "pachinko-board",
    title: session.title,
    taskLabel: session.taskLabel,
    boardWidth: session.boardWidth,
    boardHeight: session.boardHeight,
    remainingBalls: session.remainingBalls,
    totalBalls: session.totalBalls,
    phase: session.phase,
    activeBall: session.activeBall,
    activeBalls: session.activeBalls,
    pins: session.pins,
    movingGatePins: session.movingGatePins,
    gatePassCount: session.gatePassCount,
    eventCharge: session.eventCharge,
    eventLog: session.eventLog,
    score: session.score,
    lastSlotIndex: session.lastSlotIndex,
    slotValues: session.slotValues,
    rewardQueue: session.rewardQueue,
    wheelState: session.wheelState,
    flipperAngle: session.flipperAngle,
    movingGateX: session.movingGateX,
    layoutRefreshElapsedMs: session.layoutRefreshElapsedMs,
    layoutRefreshPeriodMs: session.layoutRefreshPeriodMs,
    layoutVersion: session.layoutVersion,
    playActionId: TEMPLE_WORK_PLAY_ACTION_ID,
  };
}

function clampTempleFortuneBoardTickMs(tickMs: number): number {
  if (!Number.isFinite(tickMs)) {
    return FORTUNE_BOARD_DEFAULT_ANIMATION_TICK_MS;
  }

  return Math.max(
    FORTUNE_BOARD_MIN_ANIMATION_TICK_MS,
    Math.min(FORTUNE_BOARD_MAX_ANIMATION_TICK_MS, Math.round(tickMs))
  );
}

function selectOverlayViewModel(
  overlay: TempleHouseOverlayState,
  activeFortuneBoardSession: ActivityFortuneBoardSession | null,
  activePachinkoBoardSession: ActivityPachinkoBoardSession | null,
  textEntriesById?: Record<string, string>,
  houseModuleDefaults?: Record<string, unknown>
): HouseOverlayViewModel | null {
  const uiTextIds = resolveTempleStaticTextDefaults(houseModuleDefaults).uiTextIds;
  if (activePachinkoBoardSession != null) {
    return selectPachinkoBoardOverlayViewModel(activePachinkoBoardSession);
  }

  if (activeFortuneBoardSession != null) {
    return selectFortuneBoardOverlayViewModel(activeFortuneBoardSession);
  }

  if (overlay == null) {
    return null;
  }

  if (overlay.type === "alert") {
    return {
      type: "alert",
      title: overlay.title,
      paragraphs: overlay.paragraphs,
      ...(overlay.tone == null ? {} : { tone: overlay.tone }),
      confirmActionId: "close-temple-overlay",
      confirmLabel: resolveTempleText(textEntriesById, uiTextIds.alertConfirmLabel),
      confirmButtonSound: "light",
    };
  }

  if (overlay.type === "activity-confirm") {
    return {
      type: "confirm",
      title: overlay.title,
      paragraphs: overlay.paragraphs,
      ...(overlay.workDescriptionLines == null
        ? {}
        : { workDescriptionLines: overlay.workDescriptionLines }),
      ...(overlay.relatedAbilityLines == null
        ? {}
        : { relatedAbilityLines: overlay.relatedAbilityLines }),
      ...(overlay.costLines == null ? {} : { costLines: overlay.costLines }),
      ...(overlay.bestScore == null ? {} : { bestScore: overlay.bestScore }),
      ...(overlay.quickCompleteScore == null
        ? {}
        : { quickCompleteScore: overlay.quickCompleteScore }),
      ...(overlay.quickCompleteActionId == null
        ? {}
        : { quickCompleteActionId: overlay.quickCompleteActionId }),
      ...(overlay.quickCompleteLabel == null
        ? {}
        : { quickCompleteLabel: overlay.quickCompleteLabel }),
      ...(overlay.quickCompleteActionId == null
        ? {}
        : { quickCompleteButtonSound: "heavy" }),
      confirmActionId: overlay.confirmActionId,
      confirmLabel: overlay.confirmLabel,
      cancelActionId: overlay.cancelActionId,
      cancelLabel: overlay.cancelLabel,
      ...(overlay.tone == null ? {} : { tone: overlay.tone }),
      confirmButtonSound: "heavy",
      cancelButtonSound: "light",
    };
  }

  if (overlay.type === "donate-confirm") {
    return {
      type: "confirm",
      title: overlay.title,
      paragraphs: overlay.paragraphs,
      confirmActionId: "confirm-donate",
      confirmLabel: resolveTempleTemplateText(
        textEntriesById,
        uiTextIds.donateConfirmLabelTemplate,
        { amount: overlay.amount }
      ),
      cancelActionId: "close-temple-overlay",
      cancelLabel: resolveTempleText(textEntriesById, uiTextIds.donateCancelLabel),
      tone: "info",
      confirmButtonSound: "light",
      cancelButtonSound: "light",
    };
  }

  if (overlay.type === "submit-food") {
    const beggingFoodTextIds = resolveTempleStaticTextDefaults(
      houseModuleDefaults
    ).beggingFoodTextIds;
    return {
      type: "quantity-confirm",
      title: resolveTempleText(textEntriesById, beggingFoodTextIds.submitTitle),
      paragraphs: beggingFoodTextIds.submitLines.map((textId) =>
        resolveTempleText(textEntriesById, textId)
      ),
      quantityLabel: resolveTempleText(
        textEntriesById,
        beggingFoodTextIds.quantityLabel
      ),
      quantity: overlay.quantity,
      maxQuantity: overlay.maxQuantity,
      quantityFieldId: TEMPLE_BEGGING_SUBMIT_FIELD_ID,
      decrementActionId: DECREMENT_TEMPLE_BEGGING_FOOD_ACTION_ID,
      incrementActionId: INCREMENT_TEMPLE_BEGGING_FOOD_ACTION_ID,
      confirmActionId: CONFIRM_TEMPLE_BEGGING_FOOD_ACTION_ID,
      confirmLabel: resolveTempleText(
        textEntriesById,
        beggingFoodTextIds.confirmLabel
      ),
      cancelActionId: CANCEL_TEMPLE_BEGGING_FOOD_ACTION_ID,
      cancelLabel: resolveTempleText(
        textEntriesById,
        beggingFoodTextIds.cancelLabel
      ),
      confirmButtonSound: "light",
      cancelButtonSound: "light",
      decrementButtonSound: "light",
      incrementButtonSound: "light",
    };
  }

  if (overlay.type === "rest-days") {
    const restDaysOverlayTextIds = resolveTempleStaticTextDefaults(
      houseModuleDefaults
    ).restDaysOverlayTextIds;
    return {
      type: "rest-days",
      title: resolveTempleText(textEntriesById, restDaysOverlayTextIds.title),
      paragraphs: [
        resolveTempleText(textEntriesById, restDaysOverlayTextIds.body),
      ],
      dayCount: overlay.inputValue,
      quantityFieldId: TEMPLE_REST_DAYS_FIELD_ID,
      confirmActionId: CONFIRM_TEMPLE_REST_DAYS_ACTION_ID,
      confirmLabel: resolveTempleText(
        textEntriesById,
        restDaysOverlayTextIds.confirmLabel
      ),
      cancelActionId: "close-temple-overlay",
      cancelLabel: resolveTempleText(
        textEntriesById,
        restDaysOverlayTextIds.cancelLabel
      ),
      confirmButtonSound: "light",
      cancelButtonSound: "light",
    };
  }

  if (overlay.type === "qte-bar") {
    const qteOverlayTextIds = resolveTempleStaticTextDefaults(
      houseModuleDefaults
    ).qteOverlayTextIds;
    return {
      type: "qte-bar",
      title: resolveTempleText(textEntriesById, qteOverlayTextIds.title),
      taskLabel: overlay.taskLabel,
      round: overlay.round,
      totalRounds: overlay.totalRounds,
      successes: overlay.successes,
      markerPercent: overlay.markerPercent,
      targetStartPercent: overlay.targetStartPercent,
      targetWidthPercent: overlay.targetWidthPercent,
      helperLines: qteOverlayTextIds.helperLines.map((textId) =>
        resolveTempleText(textEntriesById, textId)
      ),
      stopActionId: "temple-work-stop",
    };
  }

  if (overlay.type === "review-assignment-table") {
    return overlay;
  }

  if (overlay.type === "review-policy-panel") {
    return overlay;
  }

  return {
    type: "result",
    title: overlay.title,
    grade: overlay.grade,
    score: overlay.score,
    rewardLines: overlay.rewardLines,
    confirmActionId: "close-temple-result",
    confirmLabel: resolveTempleText(textEntriesById, uiTextIds.resultConfirmLabel),
    confirmButtonSound: "light",
  };
}

export const templeHouseHouseModule: HouseModuleDefinition<"temple-house"> = {
  moduleId: "temple-house",
  enter(input) {
    const preparedState = completeFirstTempleWorkLockIfReviewArrived(
      ensureTempleRuntimeState(input.gameState)
    );
    const lateAttendance = applyTempleLateCouncilAttendancePenalty(preparedState);
    const nextState = lateAttendance.state;
    const selectedWorkPlan = readTempleWorkPlan(nextState);
    const shouldStartMeeting =
      isMonkStoryStage(nextState) &&
      readNumericVariable(nextState, KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown, 0) <= 0;

    const sessionState = shouldStartMeeting
      ? createInitialTempleHouseSessionState(
          "meeting",
          "intro",
          lateAttendance.resolution == null
            ? getTempleReviewEntryLines(input)
            : getTempleLateMeetingIntroLines(
                lateAttendance.resolution.lateDays,
                lateAttendance.resolution.contributionPenalty,
                input.textEntriesById,
                input.houseModuleDefaults
              )
        )
      : createInitialTempleHouseSessionState(
          "daily",
          "finished",
          getTempleGreetingLines(
            input.textEntriesById,
            input.houseModuleDefaults
          )
        );
    const nextSessionState = {
      ...sessionState,
      selectedWorkPlan,
    };
    if (shouldStartMeeting) {
      const launchedMeetingResult = tryLaunchTempleReviewMeeting(
        input,
        nextState,
        nextSessionState
      );
      if (launchedMeetingResult != null) {
        return {
          ...launchedMeetingResult,
          sideEffects: [
            { type: "stop-interval", intervalId: TEMPLE_WORK_INTERVAL_ID },
          ],
        };
      }
    }

    return {
      gameState: nextState,
      characterDefinitions: input.characterDefinitions,
      sessionState: nextSessionState,
      sideEffects: [{ type: "stop-interval", intervalId: TEMPLE_WORK_INTERVAL_ID }],
    };
  },
  dispatch(input) {
    if (input.request.type === "tick") {
      return handleTick(input, input.sessionState);
    }

    if (input.request.type === "field") {
      return handleField(input, input.sessionState);
    }

    return handleAction(input, input.sessionState);
  },
  leave(input) {
    if (shouldBlockTempleLeave(input.gameState)) {
      const sessionState =
        input.sessionState ??
        createInitialTempleHouseSessionState(
          "meeting",
          "intro",
          getTempleReviewEntryLines(input)
        );

      return {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
        sessionState: {
          ...sessionState,
          dialoguePhase: "open",
          overlay: null,
          dialogueOverride: {
            speakerCharacterId: input.playerCharacterId,
            textLines: getTempleLeaveRefusalLines(
              input.textEntriesById,
              input.houseModuleDefaults
            ),
            advanceActionId: CLOSE_TEMPLE_LEAVE_REFUSAL_ACTION_ID,
            advanceHintText: resolveTempleText(
              input.textEntriesById,
              resolveTempleStaticTextDefaults(input.houseModuleDefaults).uiTextIds
                .leaveRefusalAdvanceHint
            ),
          },
        },
        navigation: { type: "stay-in-house" },
      };
    }

    const leaveEventResult = applyHouseModulePackEventByItemId({
      state: input.gameState,
      eventDefinitionsById: input.eventDefinitionsById,
      eventBindings: input.eventBindings,
      houseId: input.houseDefinition.id,
      itemId: "leave",
    });
    const finalLeaveEventResult = leaveEventResult.handled
      ? leaveEventResult
      : applyHouseModulePackEventById({
          state: input.gameState,
          eventDefinitionsById: input.eventDefinitionsById,
          eventId: TEMPLE_LEAVE_EVENT_ID,
        });

    return {
      gameState: finalLeaveEventResult.state,
      characterDefinitions: input.characterDefinitions,
      sessionState: null,
      sideEffects: [{ type: "stop-interval", intervalId: TEMPLE_WORK_INTERVAL_ID }],
    };
  },
  selectViewModel(input): HouseModuleViewModel {
    const nextState = ensureTempleRuntimeState(input.gameState);
    const templeStaticTextDefaults = resolveTempleStaticTextDefaults(
      input.houseModuleDefaults
    );
    const uiTextIds = templeStaticTextDefaults.uiTextIds;
    const abbotCharacter = getAbbotCharacter(
      input.characterDefinitions,
      input.houseDefinition.defaultCharacterId
    );
    const playerCharacter = getPlayerCharacter(
      input.characterDefinitions,
      input.playerCharacterId
    );
    const sessionState =
      input.sessionState ??
      {
        ...createInitialTempleHouseSessionState(
          "daily",
          "finished",
          getTempleGreetingLines(
            input.textEntriesById,
            input.houseModuleDefaults
          )
        ),
        selectedWorkPlan: readTempleWorkPlan(nextState),
      };
    const isHostedMeetingActive = input.sharedSessionState?.hostedMeeting != null;
    const hostedMeetingPresenter = resumeTempleHostedMeeting(
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
    const activeFortuneBoardSession = isTempleFortuneBoardSession(
      nextState,
      input.houseDefinition.id
    )
      ? nextState.runtime.activitySession
      : null;
    const activePachinkoBoardSession = isTemplePachinkoBoardSession(
      nextState,
      input.houseDefinition.id
    )
      ? nextState.runtime.activitySession
      : null;
    const hasActiveTempleWorkPlayable =
      activeFortuneBoardSession != null || activePachinkoBoardSession != null;
    const donationTotal = readNumericVariable(
      nextState,
      TEMPLE_HOUSE_VARIABLE_KEYS.donationTotal,
      0
    );
    const countdown = readNumericVariable(
      nextState,
      KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown,
      0
    );
    const contribution = getTempleContribution(nextState);
    const templeWeek = getTempleWeek(nextState);
    const currentWorkPlan =
      sessionState.selectedWorkPlan ?? readTempleWorkPlan(nextState);
    const beggingSubmittedFood = readTempleBeggingSubmittedFood(nextState);
    const beggingLastGrade = readTempleBeggingLastGrade(nextState);
    const beggingFoodToSubmit = readTempleAvailableFood(nextState);
    const dailyTasks = getDailyTempleTasks(
      nextState,
      currentWorkPlan,
      input.activityDefinitionsById,
      input.textEntriesById
    );
    const reviewWorkChoices = getReviewWorkChoices(
      nextState,
      input.playerCharacterId,
      input.activityDefinitionsById,
      input.textEntriesById,
      input.houseModuleDefaults
    );
    const templeTaskDefinitions = getTempleTaskDefinitions(
      input.activityDefinitionsById,
      input.textEntriesById
    );
    const dialogueOverrideSpeaker =
      sessionState.dialogueOverride == null
        ? null
        : input.characterDefinitions.find(
            (characterDefinition) =>
              characterDefinition.id ===
              sessionState.dialogueOverride?.speakerCharacterId
          ) ?? null;
    const dialogueSpeaker = dialogueOverrideSpeaker ?? abbotCharacter;
    const dialoguePortraitArtClassName =
      dialogueSpeaker.id === input.playerCharacterId
        ? "c-temple-house-portrait-art--player"
        : dialogueSpeaker.id === abbotCharacter.id
          ? "c-temple-house-portrait-art--abbot"
          : "c-temple-house-portrait-art--senior-monk";
    const shouldShowDailyActions =
      sessionState.mode === "daily" &&
      sessionState.overlay == null &&
      !hasActiveTempleWorkPlayable &&
      sessionState.dialoguePhase === "open";
    const shouldShowMeetingTasks =
      sessionState.mode === "meeting" &&
      sessionState.meetingStage === "assign-duty" &&
      sessionState.overlay == null &&
      !hasActiveTempleWorkPlayable;
    const shouldShowMeetingAdvice =
      sessionState.mode === "meeting" &&
      sessionState.meetingStage === "advice" &&
      !hasActiveTempleWorkPlayable;
    const selectedTask =
      sessionState.selectedTaskId == null
        ? null
        : templeTaskDefinitions.find(
            (taskDefinition) => taskDefinition.id === sessionState.selectedTaskId
          ) ?? null;
    const meetingParticipantIds = getTempleMeetingParticipantIds(
      input.houseDefinition.characterIds,
      input.playerCharacterId,
      abbotCharacter.id
    );
    const standbyCharacterIds =
      sessionState.mode === "meeting"
        ? meetingParticipantIds
        : input.houseDefinition.characterIds;
    const standbyActors = standbyCharacterIds.map((characterId) => {
      const characterDefinition = input.characterDefinitions.find(
        (candidateCharacter) => candidateCharacter.id === characterId
      );
      assertExists(
        characterDefinition,
        `Temple standby character not found for id "${characterId}".`
      );
      return {
        characterId: characterDefinition.id,
        name: characterDefinition.name,
        ...(sessionState.mode === "daily" &&
        characterDefinition.id === abbotCharacter.id
          ? { actionId: "open-abbot-dialogue" }
          : {}),
        ...(characterDefinition.id === abbotCharacter.id
          ? {
              interactionActions: getTempleRootActions(
                nextState,
                currentWorkPlan,
                sessionState.dialoguePhase,
                input.textEntriesById,
                input.houseModuleDefaults
              )
                .filter((action) => action.id !== "dismiss-dialogue")
                .map((action) => ({
                  ...action,
                  kind: "special" as const,
                })),
            }
          : {}),
        ...(sessionState.mode === "meeting" &&
        characterDefinition.id === input.playerCharacterId
          ? { isSelected: true }
          : sessionState.mode === "meeting"
            ? { isSelected: false }
            : characterDefinition.id === dialogueSpeaker.id
              ? { isSelected: true }
              : {}),
        ...(characterDefinition.id === abbotCharacter.id
          ? {
              avatarArtClassName: "c-temple-house-avatar-art--abbot",
              portraitArtClassName: "c-temple-house-portrait-art--abbot",
            }
          : characterDefinition.id === input.playerCharacterId
            ? {
                avatarArtClassName: "c-temple-house-avatar-art--player",
                portraitArtClassName: "c-temple-house-portrait-art--player",
              }
            : {
                avatarArtClassName: "c-temple-house-avatar-art--senior-monk",
                portraitArtClassName: "c-temple-house-portrait-art--senior-monk",
              }),
        ...(characterDefinition.title == null
          ? {}
          : { title: characterDefinition.title }),
      };
    });
    const orderedStandbyActors = orderHouseStandbyRoster({
      primaryCharacterId: input.houseDefinition.defaultCharacterId,
      actors: standbyActors,
    });

    return {
      moduleId: "temple-house",
      houseId: input.houseDefinition.id,
      sceneTitle: input.houseDefinition.name,
      sceneSubtitle: isMonkStoryStage(nextState)
        ? resolveTempleText(
            input.textEntriesById,
            "runtime.zhu_yuanzhang.temple.scene.monk.subtitle"
          )
        : resolveTempleText(
            input.textEntriesById,
            "runtime.zhu_yuanzhang.temple.scene.daily.subtitle"
          ),
      standbyRoster: orderedStandbyActors,
      dialogue: isHostedMeetingActive
        ? hostedMeetingPresenter?.dialogue ?? null
        : sessionState.dialoguePhase === "idle"
          ? null
          : {
              mode: "character",
              speakerName: dialogueSpeaker.name,
              characterId: dialogueSpeaker.id,
              portraitArtClassName: dialoguePortraitArtClassName,
              position: "right",
              textLines:
                sessionState.dialogueOverride?.textLines ??
                sessionState.dialogueLines,
              advanceActionId:
                sessionState.dialogueOverride?.advanceActionId ??
                (sessionState.overlay == null &&
                ((sessionState.mode === "daily" &&
                  sessionState.dialoguePhase === "greeting") ||
                  (sessionState.mode === "meeting" &&
                    ["intro", "personnel", "praise", "situation", "policy"].includes(sessionState.meetingStage)))
                  ? "advance-temple-dialogue"
                  : null),
              advanceHintText:
                sessionState.dialogueOverride?.advanceHintText ??
                (sessionState.overlay == null &&
                ((sessionState.mode === "daily" &&
                  sessionState.dialoguePhase === "greeting") ||
                  (sessionState.mode === "meeting" &&
                    ["intro", "personnel", "praise", "situation", "policy"].includes(sessionState.meetingStage)))
                  ? resolveTempleText(
                      input.textEntriesById,
                      uiTextIds.dialogueAdvanceHint
                    )
                  : null),
            },
      actionContainer: isHostedMeetingActive
        ? hostedMeetingPresenter?.actionContainer ?? null
        : shouldShowMeetingTasks
          ? {
              title: resolveTempleText(
                input.textEntriesById,
                isMonkStoryStage(nextState)
                  ? uiTextIds.actionPanelTitleMeetingMonk
                  : uiTextIds.actionPanelTitleMeetingDaily
              ),
              actions: reviewWorkChoices.map<HouseActionViewModel>((workChoice) => ({
                id: `${SELECT_REVIEW_WORK_ACTION_PREFIX}${workChoice.id}`,
                label: workChoice.label,
                ...(workChoice.disabled == null
                  ? {}
                  : { disabled: workChoice.disabled }),
                ...(workChoice.tone == null ? {} : { tone: workChoice.tone }),
                buttonSound: "light",
              })),
            }
          : shouldShowMeetingAdvice
            ? {
                title: resolveTempleText(
                  input.textEntriesById,
                  uiTextIds.actionPanelTitleAdvice
                ),
                actions: [
                  {
                    id: TEMPLE_REVIEW_GIVE_ADVICE_ACTION_ID,
                    label: resolveTempleText(
                      input.textEntriesById,
                      uiTextIds.adviceActionGive
                    ),
                  },
                  {
                    id: TEMPLE_REVIEW_STAY_SILENT_ACTION_ID,
                    label: resolveTempleText(
                      input.textEntriesById,
                      uiTextIds.adviceActionSilent
                    ),
                  },
                ],
              }
            : shouldShowDailyActions
              ? {
                  title:
                    sessionState.dailyActionPanel === "rest"
                      ? resolveTempleText(
                          input.textEntriesById,
                          uiTextIds.actionPanelTitleRest
                        )
                      : isMonkStoryStage(nextState) &&
                          sessionState.dailyActionPanel === "work"
                        ? resolveTempleText(
                            input.textEntriesById,
                            uiTextIds.actionPanelTitleWork
                          )
                        : resolveTempleText(
                            input.textEntriesById,
                            uiTextIds.actionPanelTitleTempleDaily
                          ),
                  actions:
                    sessionState.dailyActionPanel === "rest"
                      ? getTempleRestMenuActions(
                          input.textEntriesById,
                          input.houseModuleDefaults
                        )
                      : sessionState.dailyActionPanel === "work"
                        ? getTempleWorkMenuActions(
                            dailyTasks,
                            currentWorkPlan,
                            input.textEntriesById,
                            input.houseModuleDefaults
                          )
                        : getTempleRootActions(
                            nextState,
                            currentWorkPlan,
                            sessionState.dialoguePhase,
                            input.textEntriesById,
                            input.houseModuleDefaults
                          ),
              }
            : null,
      statusCard: {
        eyebrow: resolveTempleText(
          input.textEntriesById,
          resolveTempleStaticTextDefaults(input.houseModuleDefaults).statusCardTextIds
            .eyebrow
        ),
        title: isMonkStoryStage(nextState)
          ? resolveTempleText(
              input.textEntriesById,
              resolveTempleStaticTextDefaults(input.houseModuleDefaults)
                .statusCardTextIds.titleMonk
            )
          : resolveTempleText(
              input.textEntriesById,
              resolveTempleStaticTextDefaults(input.houseModuleDefaults)
                .statusCardTextIds.titleDaily
            ),
        subtitle:
          sessionState.mode === "meeting"
            ? resolveTempleText(
                input.textEntriesById,
                resolveTempleStaticTextDefaults(input.houseModuleDefaults)
                  .statusCardTextIds.subtitleMeeting
              )
            : resolveTempleText(
                input.textEntriesById,
                resolveTempleStaticTextDefaults(input.houseModuleDefaults)
                  .statusCardTextIds.subtitleDaily
              ),
        metrics: [
          {
            label: resolveTempleText(
              input.textEntriesById,
              templeStaticTextDefaults.statusCardTextIds.metricAbbot
            ),
            value: abbotCharacter.name,
          },
          {
            label: resolveTempleText(input.textEntriesById, uiTextIds.statusCountdown),
            value: resolveTempleTemplateText(
              input.textEntriesById,
              uiTextIds.statusCountdownValueTemplate,
              { countdown }
            ),
          },
          ...(isMonkStoryStage(nextState)
            ? [
                {
                  label: resolveTempleText(
                    input.textEntriesById,
                    uiTextIds.statusContribution
                  ),
                  value: resolveTempleTemplateText(
                    input.textEntriesById,
                    uiTextIds.statusContributionValueTemplate,
                    { contribution, threshold: 30 }
                  ),
                },
                {
                  label: resolveTempleText(input.textEntriesById, uiTextIds.statusWeek),
                  value: resolveTempleTemplateText(
                    input.textEntriesById,
                    uiTextIds.statusWeekValueTemplate,
                    { week: templeWeek }
                  ),
                },
              ]
            : [
                {
                  label: resolveTempleText(
                    input.textEntriesById,
                    uiTextIds.statusDonationTotal
                  ),
                  value: resolveTempleTemplateText(
                    input.textEntriesById,
                    uiTextIds.statusDonationTotalValueTemplate,
                    { donationTotal }
                  ),
                },
              ]),
          {
            label: resolveTempleText(input.textEntriesById, uiTextIds.statusCurrentTask),
            value:
              (isBeggingJourneyStage(nextState)
                ? resolveTempleText(
                    input.textEntriesById,
                    getTempleBegAlmsWorkPlanTextId(
                      nextState,
                      false,
                      input.houseModuleDefaults
                    )
                  )
                : null) ??
              selectedTask?.title ??
              (currentWorkPlan === "beg-alms"
                ? getTempleWorkPlanLabel(
                    nextState,
                    currentWorkPlan,
                    input.textEntriesById,
                    input.houseModuleDefaults
                  )
                : currentWorkPlan === "temple-help"
                  ? getTempleWorkPlanLabel(
                      nextState,
                      currentWorkPlan,
                      input.textEntriesById,
                      input.houseModuleDefaults
                    )
                  : null) ??
              (nextState.ui.mainHouseMissionText === ""
                ? resolveTempleText(
                    input.textEntriesById,
                    uiTextIds.statusCurrentTaskNone
                  )
                : nextState.ui.mainHouseMissionText),
          },
          ...(isMonkStoryStage(nextState)
            ? [
                {
                  label: resolveTempleText(
                    input.textEntriesById,
                    uiTextIds.statusPlayerStamina
                  ),
                  value: `${playerCharacter.stamina} / 100`,
                },
                {
                  label: resolveTempleText(
                    input.textEntriesById,
                    uiTextIds.statusPlayerFood
                  ),
                  value: formatTempleGrainAmount(beggingFoodToSubmit),
                },
                ...(currentWorkPlan === "beg-alms" && beggingSubmittedFood > 0
                  ? [
                      {
                        label: resolveTempleText(
                          input.textEntriesById,
                          uiTextIds.statusSubmittedFood
                        ),
                        value: `${formatTempleGrainAmount(beggingSubmittedFood)} / ${beggingLastGrade}`,
                      },
                    ]
                  : []),
              ]
            : []),
          {
            label: resolveTempleText(input.textEntriesById, uiTextIds.statusPlayerGold),
            value: resolveTempleTemplateText(
              input.textEntriesById,
              uiTextIds.statusPlayerGoldValueTemplate,
              { gold: playerCharacter.stats.gold }
            ),
          },
        ],
      },
      overlay: isHostedMeetingActive
        ? hostedMeetingPresenter?.overlay ?? null
        : selectOverlayViewModel(
            sessionState.overlay,
            activeFortuneBoardSession,
            activePachinkoBoardSession,
            input.textEntriesById,
            input.houseModuleDefaults
          ),
      leaveAction: {
        id: "leave-house",
        label: resolveTempleText(input.textEntriesById, uiTextIds.leaveActionLabel),
        tone: "accent",
        buttonSound: "light",
      },
    };
  },
};
