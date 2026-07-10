import type { ActivityDefinition } from "../../../domain/activity";
import type { ActivityFortuneBoardSession } from "../../../domain/activity-session";
import {
  FORTUNE_BOARD_DEFAULT_ANIMATION_TICK_MS,
  FORTUNE_BOARD_MAX_ANIMATION_TICK_MS,
  FORTUNE_BOARD_MIN_ANIMATION_TICK_MS,
} from "../../../domain/activity-session";
import type { CharacterDefinition } from "../../../domain/character";
import type { CalendarDate, GameState } from "../../../domain/game-state";
import type { HouseActivityConfirmOverlayState } from "../../../domain/house-activity";
import type {
  ActiveHouseModuleSession,
  HouseActionViewModel,
  HouseModuleDefinition,
  HouseModuleDispatchInput,
  HouseModuleTransitionResult,
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
} from "../../time/time-progression";
import {
  resolveTextEntry,
  resolveTextTemplateEntry,
} from "../../content/text-resolution";
import {
  applyReviewCycleSchedule,
  getReviewCycleCountdown,
  syncReviewCycleCompatibilityMirrors,
} from "../../review/review-cycle";
import {
  getDefaultTempleTaskActivityDefinitions,
  isTempleTaskActivityDefinition,
  getTempleTextEntries,
  type TempleTaskActivityDefinition,
} from "./temple-house-active-content";
import { createInitialTempleHouseSessionState } from "./temple-house-session-state";

const DONATION_AMOUNT = 50;
const ASSIGN_TEMPLE_TASK_ACTION_PREFIX = "assign-temple-task:";
const CONFIRM_START_TEMPLE_TASK_ACTION_PREFIX = "confirm-start-temple-task:";
const TEMPLE_WORK_PLAY_ACTION_ID = "temple-work-board-play";
const TEMPLE_WORK_WAGER_MINUS_ACTION_ID = "temple-work-board-wager-minus";
const TEMPLE_WORK_WAGER_PLUS_ACTION_ID = "temple-work-board-wager-plus";
const TEMPLE_WORK_SPEED_FIELD_ID = "temple-work-board-speed";
const SELECT_REVIEW_WORK_ACTION_PREFIX = "select-review-work:";
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
const TEMPLE_REST_MAX_DAYS = 99;
const TEMPLE_REST_BASE_RECOVERY = 12;
const CANCEL_ACTIVITY_CONFIRM_ACTION_ID = "cancel-activity-confirm";

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

function getTempleGreetingLines(
  textEntriesById?: Record<string, string>
): string[] {
  return [
    resolveTempleText(textEntriesById, "runtime.zhu_yuanzhang.temple.greeting.001"),
    resolveTempleText(textEntriesById, "runtime.zhu_yuanzhang.temple.greeting.002"),
  ];
}

function getTempleOpenLines(
  textEntriesById?: Record<string, string>
): string[] {
  return [
    resolveTempleText(textEntriesById, "runtime.zhu_yuanzhang.temple.open.001"),
    resolveTempleText(textEntriesById, "runtime.zhu_yuanzhang.temple.open.002"),
  ];
}

function getTempleRestMenuLines(
  textEntriesById?: Record<string, string>
): string[] {
  return [
    resolveTempleText(textEntriesById, "runtime.zhu_yuanzhang.temple.rest_menu.001"),
    resolveTempleText(textEntriesById, "runtime.zhu_yuanzhang.temple.rest_menu.002"),
  ];
}

function getTempleMeetingIntroLines(
  textEntriesById?: Record<string, string>
): string[] {
  return [
    resolveTempleText(textEntriesById, "runtime.zhu_yuanzhang.temple.review.intro.001"),
    resolveTempleText(textEntriesById, "runtime.zhu_yuanzhang.temple.review.intro.002"),
  ];
}

function getTempleLeaveRefusalLines(
  textEntriesById?: Record<string, string>
): string[] {
  return [
    resolveTempleText(textEntriesById, "runtime.zhu_yuanzhang.temple.leave_refusal.001"),
  ];
}

function getTempleBegAlmsWorkPlanTextId(
  gameState: GameState,
  allowLockedLabel = false
): string {
  if (
    isFourthTempleWeekAssignmentPending(gameState) ||
    (isBeggingJourneyStage(gameState) && getTempleWeek(gameState) >= 4)
  ) {
    return "runtime.zhu_yuanzhang.temple.work_plan.beg_alms.fourth_week.label";
  }

  if (
    isThirdTempleWeekAssignmentPending(gameState) ||
    (isBeggingJourneyStage(gameState) && getTempleWeek(gameState) < 4)
  ) {
    return "runtime.zhu_yuanzhang.temple.work_plan.beg_alms.third_week.label";
  }

  if (!allowLockedLabel && !isBeggingUnlocked(gameState)) {
    return "runtime.zhu_yuanzhang.temple.work_plan.beg_alms.default.label";
  }

  return isBeggingUnlocked(gameState)
    ? "runtime.zhu_yuanzhang.temple.work_plan.beg_alms.default.label"
    : "runtime.zhu_yuanzhang.temple.work_plan.beg_alms.locked.label";
}

function getTempleWorkPlanLabel(
  gameState: GameState,
  workPlan: TempleHouseWorkPlan,
  textEntriesById?: Record<string, string>
): string {
  if (workPlan === "temple-help") {
    return resolveTempleText(
      textEntriesById,
      "runtime.zhu_yuanzhang.temple.work_plan.temple_help.label"
    );
  }

  if (workPlan === "beg-alms") {
    return resolveTempleText(
      textEntriesById,
      getTempleBegAlmsWorkPlanTextId(gameState, true)
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
  textEntriesById?: Record<string, string>
): string {
  return resolveTempleText(
    textEntriesById,
    `runtime.zhu_yuanzhang.temple.work.start_beg_alms.overlay.${getTempleBegAlmsStartOverlayVariant(
      gameState
    )}.title`
  );
}

function getTempleBegAlmsStartOverlayLines(
  gameState: GameState,
  taskDefinition: TempleHouseTaskDefinition,
  textEntriesById?: Record<string, string>
): string[] {
  const variant = getTempleBegAlmsStartOverlayVariant(gameState);
  if (variant === "default") {
    return [
      taskDefinition.briefing,
      resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.work.start_beg_alms.overlay.default.001"
      ),
    ];
  }

  return [
    resolveTempleText(
      textEntriesById,
      `runtime.zhu_yuanzhang.temple.work.start_beg_alms.overlay.${variant}.001`
    ),
    resolveTempleText(
      textEntriesById,
      `runtime.zhu_yuanzhang.temple.work.start_beg_alms.overlay.${variant}.002`
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
  };
}

function getTempleTaskDefinitions(
  activityDefinitionsById?: Record<string, ActivityDefinition>,
  textEntriesById?: Record<string, string>
): TempleHouseTaskDefinition[] {
  const defaultTempleTaskActivityDefinitions =
    getDefaultTempleTaskActivityDefinitions();
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
  const defaultTaskActivityDefinitions = getDefaultTempleTaskActivityDefinitions();
  const activityDefinition =
    Object.values(activityDefinitionsById ?? {}).find(
      (candidateActivity: ActivityDefinition) =>
        isTempleTaskActivityDefinition(candidateActivity) &&
        candidateActivity.taskId === taskId
    ) ??
    defaultTaskActivityDefinitions.find(
      (candidateActivity) => candidateActivity.taskId === taskId
    );

  assertExists(
    activityDefinition,
    `Temple house task activity not found for task id "${taskId}".`
  );
  return activityDefinition as TempleTaskActivityDefinition;
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
  textEntriesById?: Record<string, string>
): string[] {
  return [
    resolveTempleText(textEntriesById, "runtime.zhu_yuanzhang.temple.review.late.choice.001"),
    resolveTempleText(textEntriesById, "runtime.zhu_yuanzhang.temple.review.late.choice.002"),
    resolveTempleText(textEntriesById, "runtime.zhu_yuanzhang.temple.review.late.choice.003"),
  ];
}

function getTempleLateMeetingIntroLines(
  lateDays: number,
  contributionPenalty: number,
  textEntriesById?: Record<string, string>
): string[] {
  return lateDays > 5
    ? [
        resolveTempleTemplateText(
          textEntriesById,
          "runtime.zhu_yuanzhang.temple.review.late.heavy.001",
          { lateDays }
        ),
        resolveTempleTemplateText(
          textEntriesById,
          "runtime.zhu_yuanzhang.temple.review.late.heavy.002",
          { contributionPenalty }
        ),
      ]
    : [
        resolveTempleTemplateText(
          textEntriesById,
          "runtime.zhu_yuanzhang.temple.review.late.light.001",
          { lateDays }
        ),
        resolveTempleTemplateText(
          textEntriesById,
          "runtime.zhu_yuanzhang.temple.review.late.light.002",
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
    "gameState" | "characterDefinitions" | "sessionState"
  >,
  patch?: Partial<HouseModuleTransitionResult<"temple-house">>
): HouseModuleTransitionResult<"temple-house"> {
  return {
    gameState: patch?.gameState ?? input.gameState,
    characterDefinitions: patch?.characterDefinitions ?? input.characterDefinitions,
    sessionState: patch?.sessionState ?? input.sessionState,
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
  confirmActionId: string
): HouseActivityConfirmOverlayState {
  return {
    type: "activity-confirm",
    title,
    paragraphs,
    confirmActionId,
    confirmLabel: "现在开始",
    cancelActionId: CANCEL_ACTIVITY_CONFIRM_ACTION_ID,
    cancelLabel: "稍后再领",
    tone: "info",
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

function resolveTempleWorkContribution(successes: number): {
  grade: string;
  contribution: number;
  praiseLines: string[];
} {
  if (successes <= 1) {
    return {
      grade: "偷懒",
      contribution: 5,
      praiseLines: [
        "（皱起眉）你这几日心神散乱，手上并未真正用力。",
        "虽未把差事彻底误了，但还远称不上踏实。",
      ],
    };
  }

  if (successes === 2) {
    return {
      grade: "合格",
      contribution: 10,
      praiseLines: [
        "（点了点头）做事虽还生涩，至少已经肯下力气。",
        "乱世里先把眼前活计做稳，比空谈志气更要紧。",
      ],
    };
  }

  return {
    grade: "勤勉",
      contribution: 15,
      praiseLines: [
        "（露出赞许神色）你这几日倒真肯吃苦。",
        "寺中众人都看在眼里，这份踏实不是装出来的。",
      ],
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
  textEntriesById?: Record<string, string>
): NonNullable<TempleHouseOverlayState> {
  const playerCharacter = getPlayerCharacter(
    summary.characterDefinitions,
    playerCharacterId
  );
  if (summary.daysRested <= 0) {
    return {
      type: "alert",
      title,
      paragraphs: summary.interruptedByCouncilDate
        ? [
            resolveTempleText(
              textEntriesById,
              "runtime.zhu_yuanzhang.temple.rest.interrupted.council.001"
            ),
            resolveTempleTemplateText(
              textEntriesById,
              "runtime.zhu_yuanzhang.temple.rest.interrupted.council.002",
              { currentStamina: playerCharacter.stamina }
            ),
            ...getTempleLateChoiceParagraphs(textEntriesById),
          ]
        : [
            resolveTempleText(
              textEntriesById,
              "runtime.zhu_yuanzhang.temple.rest.summary.none.001"
            ),
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
        "runtime.zhu_yuanzhang.temple.rest.summary.days.001",
        {
          daysRested: summary.daysRested,
          totalRecovered: summary.totalRecovered,
        }
      ),
      resolveTempleTemplateText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.rest.summary.current.001",
        { stamina: playerCharacter.stamina }
      ),
      summary.interruptedByCouncilDate
        ? resolveTempleText(
            textEntriesById,
            "runtime.zhu_yuanzhang.temple.rest.interrupted.council.001"
          )
        : resolveTempleText(
            textEntriesById,
            "runtime.zhu_yuanzhang.temple.rest.summary.normal.001"
          ),
      ...(summary.interruptedByCouncilDate
        ? getTempleLateChoiceParagraphs(textEntriesById)
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
  textEntriesById?: Record<string, string>
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
        textEntriesById
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
                input.textEntriesById
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

  const reviewSyncedState = syncReviewCycleCompatibilityMirrors(syncedState);
  return {
    ...reviewSyncedState,
    runtime: {
      ...reviewSyncedState.runtime,
      flags: nextFlags,
      variables: nextVariables,
    },
  };
}

function createLowStaminaOverlay(actionLabel: string): NonNullable<TempleHouseOverlayState> {
  return createAlertOverlay(
    "先去歇息",
    [
      `（合十）你这会儿心力已竭，今日不必强撑着去${actionLabel}。`,
      `先回禅房静养，体力至少缓到 ${ACTIVITY_COMPLETION_STAMINA_COST} 点，再来继续。`,
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

function parseReviewWorkActionId(actionId: string): "temple-help" | "beg-alms" | null {
  if (!actionId.startsWith(SELECT_REVIEW_WORK_ACTION_PREFIX)) {
    return null;
  }

  const workPlan = actionId.slice(SELECT_REVIEW_WORK_ACTION_PREFIX.length);
  return workPlan === "temple-help" || workPlan === "beg-alms" ? workPlan : null;
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
  return withSessionState(
    {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
    },
    sessionState,
    {
      overlay: createAlertOverlay(
        "时日不够",
        remainingDays <= 0
          ? [
              `（合十）评定日期已到，这轮${activityLabel}少说也要 ${durationDays} 天，眼下已经来不及了。`,
              "先去前殿把评定应下，等过了这桩大事，再回来继续。",
            ]
          : [
              `（合十）离评定只剩 ${remainingDays} 天，这轮${activityLabel}少说也要 ${durationDays} 天，眼下已经来不及了。`,
              "先去前殿把评定应下，等过了这桩大事，再回来继续。",
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
    getReviewCycleCountdown(gameState) > 0;

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
    getReviewCycleCountdown(gameState) > 0
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
      ...houseCharacterIds.filter((characterId) => characterId !== abbotCharacterId),
    ])
  );
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

function getTempleContributionReportLines(
  contributionEntries: Array<{
    name: string;
    contribution: number;
  }>
): string[] {
  return contributionEntries.map(
    (entry, index) => `${index + 1}. ${entry.name}：${entry.contribution} 点贡献`
  );
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
  textEntriesById?: Record<string, string>
): string[] {
  const availableLabels = reviewWorkChoices
    .filter((workChoice) => workChoice.disabled !== true)
    .map((workChoice) => workChoice.label);

  if (isThirdTempleWeekAssignmentPending(gameState)) {
    return [
      resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.review.assign.third_week.001"
      ),
      resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.review.assign.third_week.002"
      ),
      resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.review.assign.third_week.003"
      ),
    ];
  }

  if (isFourthTempleWeekAssignmentPending(gameState)) {
    return [
      resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.review.assign.fourth_week.001"
      ),
      resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.review.assign.fourth_week.002"
      ),
      resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.review.assign.fourth_week.003"
      ),
    ];
  }

  return [
    resolveTempleText(
      textEntriesById,
      "runtime.zhu_yuanzhang.temple.review.assign.default.001"
    ),
    availableLabels.length === 0
      ? resolveTempleText(
          textEntriesById,
          "runtime.zhu_yuanzhang.temple.review.assign.default.empty.001"
        )
      : resolveTempleTemplateText(
          textEntriesById,
          "runtime.zhu_yuanzhang.temple.review.assign.default.002",
          { availableTaskList: availableLabels.join("、") }
        ),
    resolveTempleText(
      textEntriesById,
      "runtime.zhu_yuanzhang.temple.review.assign.default.003"
    ),
  ];
}

function getReviewWorkChoices(
  gameState: GameState,
  textEntriesById?: Record<string, string>
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
          "runtime.zhu_yuanzhang.temple.work_plan.beg_alms.third_week.label"
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
          "runtime.zhu_yuanzhang.temple.work_plan.beg_alms.fourth_week.label"
        ),
        tone: "accent",
      },
    ];
  }

  const choices: Array<{
    id: "temple-help" | "beg-alms";
    label: string;
    disabled?: boolean;
    tone?: HouseActionViewModel["tone"];
  }> = [
    {
      id: "temple-help",
      label: resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.work_plan.temple_help.label"
      ),
    },
    {
      id: "beg-alms",
      label: resolveTempleText(
        textEntriesById,
        getTempleBegAlmsWorkPlanTextId(gameState, true)
      ),
      tone: "accent",
      disabled: !isBeggingUnlocked(gameState),
    },
  ];

  return choices;
}

function getTempleRootActions(
  gameState: GameState,
  currentWorkPlan: TempleHouseWorkPlan,
  dialoguePhase: TempleHouseSessionState["dialoguePhase"]
): HouseActionViewModel[] {
  if (!isMonkStoryStage(gameState)) {
    return [
      { id: OPEN_TEMPLE_REST_MENU_ACTION_ID, label: "休息", tone: "accent" },
      { id: "ask-fortune", label: "测运势", tone: "accent" },
      { id: "open-donate", label: "捐香火" },
      ...(dialoguePhase === "idle"
        ? []
        : [{ id: "dismiss-dialogue", label: "先退下" }]),
    ];
  }

  return [
    ...(isTempleBeggingFoodReadyForSubmission(gameState)
      ? [
          {
            id: SUBMIT_TEMPLE_BEGGING_FOOD_ACTION_ID,
            label: `提交粮食：${formatTempleGrainAmount(readTempleAvailableFood(gameState))}`,
            tone: "accent",
          } satisfies HouseActionViewModel,
        ]
      : []),
    {
      id: OPEN_TEMPLE_WORK_MENU_ACTION_ID,
      label: currentWorkPlan == null ? "工作（待评定）" : "工作",
      tone: "accent",
      disabled: currentWorkPlan == null,
    },
    { id: OPEN_TEMPLE_REST_MENU_ACTION_ID, label: "休息" },
    { id: "ask-fortune", label: "测运势" },
    { id: "open-donate", label: "捐香火" },
    ...(dialoguePhase === "idle"
      ? []
      : [{ id: "dismiss-dialogue", label: "先退下" }]),
  ];
}

function getTempleRestMenuActions(): HouseActionViewModel[] {
  return [
    { id: TEMPLE_REST_ONE_DAY_ACTION_ID, label: "休息一日", tone: "accent" },
    { id: OPEN_TEMPLE_REST_DAYS_ACTION_ID, label: "指定天数" },
    { id: TEMPLE_REST_UNTIL_COUNCIL_ACTION_ID, label: "休至评定日" },
    { id: TEMPLE_REST_UNTIL_RECOVERED_ACTION_ID, label: "休至体力恢复" },
    { id: CLOSE_TEMPLE_REST_MENU_ACTION_ID, label: "返回" },
  ];
}

function getTempleWorkMenuActions(
  dailyTasks: TempleHouseTaskDefinition[],
  currentWorkPlan: TempleHouseWorkPlan,
  textEntriesById?: Record<string, string>
): HouseActionViewModel[] {
  return [
    ...dailyTasks.map<HouseActionViewModel>((taskDefinition) => ({
      id: `${ASSIGN_TEMPLE_TASK_ACTION_PREFIX}${taskDefinition.id}`,
      label: taskDefinition.title,
      tone: "default",
    })),
    ...(dailyTasks.length === 0
      ? [
          {
            id: "temple-work-unavailable",
            label:
              currentWorkPlan == null
                ? "本轮评定尚未安排工作"
                : currentWorkPlan === "beg-alms"
                  ? resolveTempleText(
                      textEntriesById,
                      "runtime.zhu_yuanzhang.temple.work.unavailable.beg_alms.001"
                    )
                : "当前没有可执行的工作",
            disabled: true,
          } satisfies HouseActionViewModel,
        ]
      : []),
    {
      id: CLOSE_TEMPLE_WORK_MENU_ACTION_ID,
      label: "返回",
    },
  ];
}

function submitReviewWorkPlan(
  input: HouseModuleDispatchInput<"temple-house">,
  sessionState: TempleHouseSessionState,
  workPlan: "temple-help" | "beg-alms"
): HouseModuleTransitionResult<"temple-house"> {
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

  if (workPlan === "beg-alms" && !isBeggingUnlocked(input.gameState)) {
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
            "runtime.zhu_yuanzhang.temple.work_plan.beg_alms.locked.label"
          ),
          [
            resolveTempleText(
              input.textEntriesById,
              "runtime.zhu_yuanzhang.temple.review.assignment.locked.001"
            ),
            resolveTempleText(
              input.textEntriesById,
              "runtime.zhu_yuanzhang.temple.review.assignment.locked.002"
            ),
          ],
          "warning"
        ),
      }
    );
  }

  const reviewMissionText =
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
                [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage]: thirdTempleWeekAssignment
                  ? ZHU_YUANZHANG_STORY_STAGES.huangjueBeggingJourney
                  : readZhuYuanzhangStoryStage(input.gameState),
                [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeWeek]:
                  thirdTempleWeekAssignment
                    ? 3
                    : fourthTempleWeekAssignment
                      ? 4
                      : getTempleWeek(input.gameState),
              },
            },
          },
          nextWorkPlan,
          input.textEntriesById
        );
  const reviewSyncedState = applyReviewCycleSchedule(input.gameState, {
    scheduledDate: addDaysToDate(getCurrentDate(input.gameState), 30),
    missionText: reviewMissionText,
  });
  const nextState = {
    ...reviewSyncedState,
    missions: {
      ...reviewSyncedState.missions,
      activeMissionId: workPlan === "beg-alms" ? "mission.temple.beg-alms" : null,
    },
    ui: {
      ...reviewSyncedState.ui,
      activeMissionId:
        nextWorkPlan === "beg-alms" ? "mission.temple.beg-alms" : null,
      },
      runtime: {
      ...reviewSyncedState.runtime,
      flags: {
        ...reviewSyncedState.runtime.flags,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted]: true,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked]: true,
        ...(secondTempleWeekTransition
          ? {
              [ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingTransitionAssigned]: true,
            }
          : {}),
      },
      variables: {
        ...reviewSyncedState.runtime.variables,
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution]: 0,
          [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage]: thirdTempleWeekAssignment
            ? ZHU_YUANZHANG_STORY_STAGES.huangjueBeggingJourney
            : readZhuYuanzhangStoryStage(input.gameState),
          [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeWeek]:
            thirdTempleWeekAssignment
              ? 3
              : fourthTempleWeekAssignment
                ? 4
                : getTempleWeek(input.gameState),
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
      dialogueLines:
        nextWorkPlan === "beg-alms"
          ? [
              resolveTempleText(
                input.textEntriesById,
                thirdTempleWeekAssignment
                  ? "runtime.zhu_yuanzhang.temple.review.assignment.beg_alms.third_week.001"
                  : fourthTempleWeekAssignment
                    ? "runtime.zhu_yuanzhang.temple.review.assignment.beg_alms.fourth_week.001"
                    : "runtime.zhu_yuanzhang.temple.review.assignment.beg_alms.default.001"
              ),
              resolveTempleText(
                input.textEntriesById,
                thirdTempleWeekAssignment
                  ? "runtime.zhu_yuanzhang.temple.review.assignment.beg_alms.third_week.002"
                  : fourthTempleWeekAssignment
                    ? "runtime.zhu_yuanzhang.temple.review.assignment.beg_alms.fourth_week.002"
                    : "runtime.zhu_yuanzhang.temple.review.assignment.beg_alms.default.002"
              ),
            ]
          : [
              resolveTempleText(
                input.textEntriesById,
                "runtime.zhu_yuanzhang.temple.review.assignment.indoor.001"
              ),
              resolveTempleText(
                input.textEntriesById,
                "runtime.zhu_yuanzhang.temple.review.assignment.indoor.002"
              ),
            ],
      overlay: createAlertOverlay(
        resolveTempleText(
          input.textEntriesById,
          "runtime.zhu_yuanzhang.temple.review.assignment.overlay.title"
        ),
        [
          resolveTempleText(
            input.textEntriesById,
            nextWorkPlan === "beg-alms"
              ? thirdTempleWeekAssignment
                ? "runtime.zhu_yuanzhang.temple.review.assignment.overlay.beg_alms.third_week.001"
                : fourthTempleWeekAssignment
                  ? "runtime.zhu_yuanzhang.temple.review.assignment.overlay.beg_alms.fourth_week.001"
                  : "runtime.zhu_yuanzhang.temple.review.assignment.overlay.beg_alms.default.001"
              : "runtime.zhu_yuanzhang.temple.review.assignment.overlay.indoor.001"
          ),
          resolveTempleText(
            input.textEntriesById,
            "runtime.zhu_yuanzhang.temple.review.assignment.overlay.shared.001"
          ),
        ],
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
  const taskDefinition = findTempleTaskDefinition(
    taskId,
    input.activityDefinitionsById,
    input.textEntriesById
  );

  const reviewSyncedState = applyReviewCycleSchedule(input.gameState, {
    scheduledDate: addDaysToDate(getCurrentDate(input.gameState), 30),
    missionText: taskDefinition.title,
  });
  const nextState = {
    ...reviewSyncedState,
    missions: {
      ...reviewSyncedState.missions,
      activeMissionId: taskDefinition.missionId,
    },
    ui: {
      ...reviewSyncedState.ui,
      activeMissionId: taskDefinition.missionId,
    },
    runtime: {
      ...reviewSyncedState.runtime,
      variables: {
        ...reviewSyncedState.runtime.variables,
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution]: 0,
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
          "runtime.zhu_yuanzhang.temple.review.task_assignment.order.001",
          { taskTitle: taskDefinition.title }
        ),
      ],
      overlay: createAlertOverlay(
        resolveTempleText(
          input.textEntriesById,
          "runtime.zhu_yuanzhang.temple.review.task_assignment.overlay.title"
        ),
        [
          taskDefinition.briefing,
          resolveTempleText(
            input.textEntriesById,
            "runtime.zhu_yuanzhang.temple.review.task_assignment.overlay.shared.001"
          ),
        ],
        "success"
      ),
    },
  };
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
                getTempleBegAlmsWorkPlanTextId(input.gameState)
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
        getTempleBegAlmsStartOverlayTitle(input.gameState, input.textEntriesById),
        getTempleBegAlmsStartOverlayLines(
          input.gameState,
          taskDefinition,
          input.textEntriesById
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
  if (availableFood <= 0) {
    return withSessionState(
      {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        overlay: createAlertOverlay(
          "暂无可交粮食",
          [
            resolveTempleText(
              input.textEntriesById,
              "runtime.zhu_yuanzhang.temple.begging_food.empty.001"
            ),
            resolveTempleText(
              input.textEntriesById,
              "runtime.zhu_yuanzhang.temple.begging_food.empty.002"
            ),
          ],
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
          "暂无可交粮食",
          [
            resolveTempleText(
              input.textEntriesById,
              "runtime.zhu_yuanzhang.temple.begging_food.empty.001"
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
      "交粮回寺"
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
        "runtime.zhu_yuanzhang.temple.main_mission.begging_submitted.label"
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
          "runtime.zhu_yuanzhang.temple.main_mission.begging_submitted.label"
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
    [
      { type: "stop-interval", intervalId: TEMPLE_WORK_INTERVAL_ID },
      {
        type: "start-interval",
        intervalId: TEMPLE_WORK_INTERVAL_ID,
        everyMs: FORTUNE_BOARD_DEFAULT_ANIMATION_TICK_MS,
        request: {
          type: "tick",
          tickId: TEMPLE_WORK_INTERVAL_ID,
        },
      },
    ]
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
  const resolution = resolveTempleWorkContribution(score);
  const currentContribution = getTempleContribution(input.gameState);
  const nextContribution = currentContribution + score;
  const unlockBegging =
    !isBeggingUnlocked(input.gameState) && nextContribution >= 30;

  const nextVariables = {
    ...input.gameState.runtime.variables,
    [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution]: nextContribution,
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
        title: unlockBegging ? "寺中有了新的安排" : "寺务结算",
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

    const activeTaskId = sessionState.selectedTaskId;
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
    const activeTaskId = sessionState.selectedTaskId;
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

  if (input.request.actionId === "advance-temple-dialogue") {
    if (sessionState.mode === "meeting") {
      const contributionEntries = getTempleContributionEntries(
        nextState,
        playerCharacter,
        seniorMonkCharacter
      );
      const reviewWorkChoices = getReviewWorkChoices(
        nextState,
        input.textEntriesById
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
              meetingStage: "contribution",
              dialoguePhase: "open",
              overlay: createAlertOverlay(
                "上期寺中贡献",
                getTempleContributionReportLines(contributionEntries)
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
              meetingStage: "policy",
              dialoguePhase: "open",
              dialogueLines: getTempleMeetingPolicyLines(
                nextState,
                input.textEntriesById
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
              meetingStage: "assign-duty",
              dialoguePhase: "open",
              dialogueLines: getTempleAssignDutyLines(
                nextState,
                reviewWorkChoices,
                input.textEntriesById
              ),
            }
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
        dialogueLines: getTempleOpenLines(input.textEntriesById),
      }
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
        dialogueLines: getTempleOpenLines(input.textEntriesById),
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
        dialogueLines: getTempleRestMenuLines(input.textEntriesById),
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
        ? "休息一日"
        : actionId === TEMPLE_REST_UNTIL_COUNCIL_ACTION_ID
          ? "休至评定日"
          : "休至体力恢复",
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
            "休息天数无效",
            ["请输入 1 到 99 之间的天数。"],
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
      `休息 ${days} 天`,
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
          overlay: createLowStaminaOverlay("交粮回寺"),
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
    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        overlay: {
          type: "donate-confirm",
          title: resolveTempleText(
            input.textEntriesById,
            "runtime.zhu_yuanzhang.temple.donation.confirm.title"
          ),
          paragraphs: [
            resolveTempleTemplateText(
              input.textEntriesById,
              "runtime.zhu_yuanzhang.temple.donation.confirm.001",
              { donationAmount: DONATION_AMOUNT }
            ),
            resolveTempleText(
              input.textEntriesById,
              "runtime.zhu_yuanzhang.temple.donation.confirm.002"
            ),
          ],
          amount: DONATION_AMOUNT,
        },
      }
    );
  }

  if (input.request.actionId === "confirm-donate") {
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
            resolveTempleText(
              input.textEntriesById,
              "runtime.zhu_yuanzhang.temple.donation.insufficient.title"
            ),
            [
              resolveTempleTemplateText(
                input.textEntriesById,
                "runtime.zhu_yuanzhang.temple.donation.insufficient.001",
                { currentGold: playerCharacter.stats.gold }
              ),
              resolveTempleText(
                input.textEntriesById,
                "runtime.zhu_yuanzhang.temple.donation.insufficient.002"
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
          resolveTempleText(
            input.textEntriesById,
            "runtime.zhu_yuanzhang.temple.donation.result.title"
          ),
          fameGain > 0
            ? [
                resolveTempleTemplateText(
                  input.textEntriesById,
                  "runtime.zhu_yuanzhang.temple.donation.result.fame.001",
                  { donationAmount }
                ),
                resolveTempleTemplateText(
                  input.textEntriesById,
                  "runtime.zhu_yuanzhang.temple.donation.result.fame.002",
                  { nextDonationTotal }
                ),
              ]
            : [
                resolveTempleTemplateText(
                  input.textEntriesById,
                  "runtime.zhu_yuanzhang.temple.donation.result.normal.001",
                  { donationAmount }
                ),
                resolveTempleTemplateText(
                  input.textEntriesById,
                  "runtime.zhu_yuanzhang.temple.donation.result.normal.002",
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
      sessionState.overlay.title === "寺中有了新的安排"
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

  if (
    input.request.actionId === "close-temple-overlay" &&
    sessionState.meetingStage === "contribution"
  ) {
    const contributionEntries = getTempleContributionEntries(
      nextState,
      playerCharacter,
      seniorMonkCharacter
    );

    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        meetingStage: "praise",
        dialoguePhase: "open",
        dialogueLines: getTempleMeetingPraiseLines(
          contributionEntries,
          input.playerCharacterId,
          input.textEntriesById
        ),
        overlay: null,
      }
    );
  }

  if (
    input.request.actionId === "close-temple-overlay" &&
    sessionState.meetingStage === "assigned"
  ) {
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

  const selectedReviewWorkPlan = parseReviewWorkActionId(input.request.actionId);
  if (selectedReviewWorkPlan != null) {
    return submitReviewWorkPlan(
      {
        ...input,
        gameState: nextState,
      },
      sessionState,
      selectedReviewWorkPlan
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
            overlay: createLowStaminaOverlay(taskDefinition.title),
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
      return withSessionState(
        {
          gameState: nextState,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: createActivityConfirmOverlay(
            taskDefinition.title,
            [
              taskDefinition.briefing,
              ...taskDefinition.orderLines,
              formatHouseActivityCostLine(durationDays),
            ],
            `${CONFIRM_START_TEMPLE_TASK_ACTION_PREFIX}${taskDefinition.id}`
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
            overlay: createLowStaminaOverlay(taskDefinition.title),
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
      return withSessionState(
        {
          gameState: nextState,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: createActivityConfirmOverlay(
            taskDefinition.title,
            [
              taskDefinition.briefing,
              ...taskDefinition.orderLines,
              formatHouseActivityCostLine(durationDays),
            ],
            `${CONFIRM_START_TEMPLE_TASK_ACTION_PREFIX}${taskDefinition.id}`
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
    input.gameState.runtime.activitySession?.type === "fortune-board"
  ) {
    const activeTaskId = sessionState.selectedTaskId;
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
    gameState.runtime.playableSession.integrationId ===
      TEMPLE_ACTIVITY_QTE_INTEGRATION_ID &&
    gameState.runtime.playableSession.ownerContext.ownerKind === "house" &&
    gameState.runtime.playableSession.ownerContext.ownerId === houseId &&
    gameState.runtime.activitySession?.type === "fortune-board"
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
  textEntriesById?: Record<string, string>
): HouseOverlayViewModel | null {
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
      confirmLabel: "收下",
    };
  }

  if (overlay.type === "activity-confirm") {
    return {
      type: "confirm",
      title: overlay.title,
      paragraphs: overlay.paragraphs,
      confirmActionId: overlay.confirmActionId,
      confirmLabel: overlay.confirmLabel,
      cancelActionId: overlay.cancelActionId,
      cancelLabel: overlay.cancelLabel,
      ...(overlay.tone == null ? {} : { tone: overlay.tone }),
    };
  }

  if (overlay.type === "donate-confirm") {
    return {
      type: "confirm",
      title: overlay.title,
      paragraphs: overlay.paragraphs,
      confirmActionId: "confirm-donate",
      confirmLabel: `捐 ${overlay.amount} 文`,
      cancelActionId: "close-temple-overlay",
      cancelLabel: "暂缓",
      tone: "info",
    };
  }

  if (overlay.type === "submit-food") {
    return {
      type: "quantity-confirm",
      title: resolveTempleText(
        textEntriesById,
        "runtime.zhu_yuanzhang.temple.begging_food.submit.title"
      ),
      paragraphs: [
        resolveTempleText(
          textEntriesById,
          "runtime.zhu_yuanzhang.temple.begging_food.submit.001"
        ),
        resolveTempleText(
          textEntriesById,
          "runtime.zhu_yuanzhang.temple.begging_food.submit.002"
        ),
      ],
      quantityLabel: "交粮数量（斗）",
      quantity: overlay.quantity,
      maxQuantity: overlay.maxQuantity,
      quantityFieldId: TEMPLE_BEGGING_SUBMIT_FIELD_ID,
      decrementActionId: DECREMENT_TEMPLE_BEGGING_FOOD_ACTION_ID,
      incrementActionId: INCREMENT_TEMPLE_BEGGING_FOOD_ACTION_ID,
      confirmActionId: CONFIRM_TEMPLE_BEGGING_FOOD_ACTION_ID,
      confirmLabel: "交给寺里",
      cancelActionId: CANCEL_TEMPLE_BEGGING_FOOD_ACTION_ID,
      cancelLabel: "暂缓",
    };
  }

  if (overlay.type === "rest-days") {
    return {
      type: "rest-days",
      title: "指定休息天数",
      paragraphs: ["输入要在寺中休息的天数。若评定日先到，休息会立刻中断并按已休天数结算。"],
      dayCount: overlay.inputValue,
      quantityFieldId: TEMPLE_REST_DAYS_FIELD_ID,
      confirmActionId: CONFIRM_TEMPLE_REST_DAYS_ACTION_ID,
      confirmLabel: "开始休息",
      cancelActionId: "close-temple-overlay",
      cancelLabel: "返回",
    };
  }

  if (overlay.type === "qte-bar") {
    return {
      type: "qte-bar",
      title: "寺内帮忙",
      taskLabel: overlay.taskLabel,
      round: overlay.round,
      totalRounds: overlay.totalRounds,
      successes: overlay.successes,
      markerPercent: overlay.markerPercent,
      targetStartPercent: overlay.targetStartPercent,
      targetWidthPercent: overlay.targetWidthPercent,
      helperLines: [
        "指针会来回移动，点击“停手”将其停下。",
        "停在金色区间内算成功，共判定三次。",
      ],
      stopActionId: "temple-work-stop",
    };
  }

  return {
    type: "result",
    title: overlay.title,
    grade: overlay.grade,
    score: overlay.score,
    rewardLines: overlay.rewardLines,
    confirmActionId: "close-temple-result",
    confirmLabel: "收工",
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
      getReviewCycleCountdown(nextState) <= 0;

    const sessionState = shouldStartMeeting
      ? createInitialTempleHouseSessionState(
          "meeting",
          "intro",
          lateAttendance.resolution == null
            ? getTempleMeetingIntroLines(input.textEntriesById)
            : getTempleLateMeetingIntroLines(
                lateAttendance.resolution.lateDays,
                lateAttendance.resolution.contributionPenalty,
                input.textEntriesById
              )
        )
      : createInitialTempleHouseSessionState(
          "daily",
          "finished",
          getTempleGreetingLines(input.textEntriesById)
        );

    return {
      gameState: nextState,
      characterDefinitions: input.characterDefinitions,
      sessionState: {
        ...sessionState,
        selectedWorkPlan,
      },
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
          getTempleMeetingIntroLines(input.textEntriesById)
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
            textLines: getTempleLeaveRefusalLines(input.textEntriesById),
            advanceActionId: CLOSE_TEMPLE_LEAVE_REFUSAL_ACTION_ID,
            advanceHintText: "知道了",
          },
        },
        navigation: { type: "stay-in-house" },
      };
    }

    return {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      sessionState: null,
      sideEffects: [{ type: "stop-interval", intervalId: TEMPLE_WORK_INTERVAL_ID }],
    };
  },
  selectViewModel(input): HouseModuleViewModel {
    const nextState = ensureTempleRuntimeState(input.gameState);
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
          getTempleGreetingLines(input.textEntriesById)
        ),
        selectedWorkPlan: readTempleWorkPlan(nextState),
      };
    const activeFortuneBoardSession = isTempleFortuneBoardSession(
      nextState,
      input.houseDefinition.id
    )
      ? nextState.runtime.activitySession
      : null;
    const donationTotal = readNumericVariable(
      nextState,
      TEMPLE_HOUSE_VARIABLE_KEYS.donationTotal,
      0
    );
    const countdown = getReviewCycleCountdown(nextState);
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
      input.textEntriesById
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
      activeFortuneBoardSession == null &&
      sessionState.dialoguePhase === "open";
    const shouldShowMeetingTasks =
      sessionState.mode === "meeting" &&
      sessionState.meetingStage === "assign-duty" &&
      sessionState.overlay == null &&
      activeFortuneBoardSession == null;
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
      standbyRoster: standbyCharacterIds.map((characterId) => {
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
            characterDefinition.id === abbotCharacter.id &&
            sessionState.dialoguePhase === "idle"
              ? { actionId: "open-abbot-dialogue" }
              : {}),
            ...(sessionState.mode === "meeting" &&
            characterDefinition.id === input.playerCharacterId
              ? { isSelected: true }
              : sessionState.mode === "meeting"
                ? { isSelected: false }
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
        }),
      dialogue:
        sessionState.dialoguePhase === "idle"
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
                    ["intro", "praise", "policy"].includes(sessionState.meetingStage)))
                  ? "advance-temple-dialogue"
                  : null),
              advanceHintText:
                sessionState.dialogueOverride?.advanceHintText ??
                (sessionState.overlay == null &&
                ((sessionState.mode === "daily" &&
                  sessionState.dialoguePhase === "greeting") ||
                  (sessionState.mode === "meeting" &&
                    ["intro", "praise", "policy"].includes(sessionState.meetingStage)))
                  ? "点击继续"
                  : null),
            },
      actionContainer: shouldShowMeetingTasks
        ? {
            title: isMonkStoryStage(nextState) ? "本轮安排" : "本次寺中差事",
            actions: reviewWorkChoices.map<HouseActionViewModel>((workChoice) => ({
              id: `${SELECT_REVIEW_WORK_ACTION_PREFIX}${workChoice.id}`,
              label: workChoice.label,
              ...(workChoice.disabled == null ? {} : { disabled: workChoice.disabled }),
              ...(workChoice.tone == null ? {} : { tone: workChoice.tone }),
            })),
          }
        : shouldShowDailyActions
          ? {
              title:
                sessionState.dailyActionPanel === "rest"
                  ? "休息"
                  : isMonkStoryStage(nextState) && sessionState.dailyActionPanel === "work"
                  ? "工作"
                  : "寺庙事务",
              actions:
                sessionState.dailyActionPanel === "rest"
                  ? getTempleRestMenuActions()
                  : sessionState.dailyActionPanel === "work"
                  ? getTempleWorkMenuActions(
                      dailyTasks,
                      currentWorkPlan,
                      input.textEntriesById
                    )
                  : getTempleRootActions(
                      nextState,
                      currentWorkPlan,
                      sessionState.dialoguePhase
                    ),
            }
          : null,
      statusCard: {
        eyebrow: resolveTempleText(
          input.textEntriesById,
          "runtime.zhu_yuanzhang.temple.status.eyebrow"
        ),
        title: isMonkStoryStage(nextState)
          ? resolveTempleText(
              input.textEntriesById,
              "runtime.zhu_yuanzhang.temple.status.title.monk"
            )
          : resolveTempleText(
              input.textEntriesById,
              "runtime.zhu_yuanzhang.temple.status.title.daily"
            ),
        subtitle:
          sessionState.mode === "meeting"
            ? resolveTempleText(
                input.textEntriesById,
                "runtime.zhu_yuanzhang.temple.status.subtitle.meeting"
              )
            : resolveTempleText(
                input.textEntriesById,
                "runtime.zhu_yuanzhang.temple.status.subtitle.daily"
              ),
        metrics: [
          {
            label: resolveTempleText(
              input.textEntriesById,
              "runtime.zhu_yuanzhang.temple.status.metric.abbot"
            ),
            value: abbotCharacter.name,
          },
          { label: "评定倒计时", value: `${countdown} 天` },
          ...(isMonkStoryStage(nextState)
            ? [
                { label: "寺中贡献", value: `${contribution} / 30` },
                { label: "当前周次", value: `第 ${templeWeek} 周` },
              ]
            : [{ label: "香火累计", value: `${donationTotal} 文` }]),
          {
            label: "当前差事",
            value:
              (isBeggingJourneyStage(nextState)
                ? resolveTempleText(
                    input.textEntriesById,
                    getTempleBegAlmsWorkPlanTextId(nextState)
                  )
                : null) ??
              selectedTask?.title ??
              (currentWorkPlan === "beg-alms"
                ? getTempleWorkPlanLabel(
                    nextState,
                    currentWorkPlan,
                    input.textEntriesById
                  )
                : currentWorkPlan === "temple-help"
                  ? getTempleWorkPlanLabel(
                      nextState,
                      currentWorkPlan,
                      input.textEntriesById
                    )
                  : null) ??
              (nextState.ui.mainHouseMissionText === ""
                ? "暂无"
                : nextState.ui.mainHouseMissionText),
          },
          ...(isMonkStoryStage(nextState)
            ? [
                { label: "玩家体力", value: `${playerCharacter.stamina} / 100` },
                {
                  label: "随身粮食",
                  value: formatTempleGrainAmount(beggingFoodToSubmit),
                },
                ...(currentWorkPlan === "beg-alms" && beggingSubmittedFood > 0
                  ? [
                      {
                        label: "本轮交粮",
                        value: `${formatTempleGrainAmount(beggingSubmittedFood)} / ${beggingLastGrade}`,
                      },
                    ]
                  : []),
              ]
            : []),
          { label: "玩家金钱", value: `${playerCharacter.stats.gold} 文` },
        ],
      },
      overlay: selectOverlayViewModel(
        sessionState.overlay,
        activeFortuneBoardSession,
        input.textEntriesById
      ),
      leaveAction: {
        id: "leave-house",
        label: "离开寺庙",
        tone: "accent",
      },
    };
  },
};


