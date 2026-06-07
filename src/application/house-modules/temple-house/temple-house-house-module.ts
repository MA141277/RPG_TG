import {
  templeHouseGreetingLines,
  templeHouseMeetingIntroLines,
  templeHouseOpenLines,
  templeHouseRestMenuLines,
  templeHouseTaskDefinitions,
} from "../../../content/houses/temple-house-content";
import type { CharacterDefinition } from "../../../domain/character";
import type { CalendarDate, GameState } from "../../../domain/game-state";
import type { HouseActivityConfirmOverlayState } from "../../../domain/house-activity";
import type {
  HouseActionViewModel,
  HouseModuleDefinition,
  HouseModuleDispatchInput,
  HouseModuleTransitionResult,
  HouseModuleViewModel,
  HouseOverlayViewModel,
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
import { createInitialTempleHouseSessionState } from "./temple-house-session-state";

const DONATION_AMOUNT = 50;
const ASSIGN_TEMPLE_TASK_ACTION_PREFIX = "assign-temple-task:";
const CONFIRM_START_TEMPLE_TASK_ACTION_PREFIX = "confirm-start-temple-task:";
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
const TEMPLE_WORK_TOTAL_ROUNDS = 3;
const TEMPLE_WORK_MARKER_STEP = 7;
const TEMPLE_REST_MAX_DAYS = 99;
const TEMPLE_REST_BASE_RECOVERY = 12;
const CANCEL_ACTIVITY_CONFIRM_ACTION_ID = "cancel-activity-confirm";

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

function getTempleLateChoiceParagraphs(): string[] {
  return [
    "你现在可以立刻去前殿听候方丈安排，也可以先不去。",
    "若在评定后的五天内赶到，会被斥责并扣掉寺中贡献。",
    "若拖得更久，贡献会扣得更多，住持也会当众严词训斥你。",
  ];
}

function getTempleLateMeetingIntroLines(lateDays: number, contributionPenalty: number): string[] {
  return lateDays > 5
    ? [
        "方丈抬眼看你，语气已沉了下去。",
        `“评定过了 ${lateDays} 天，你才来应声，寺中规矩不是给你看的？”`,
        `“先记你迟到重过，扣去 ${contributionPenalty} 点寺中贡献。坐下，把这一轮评定补完。”`,
      ]
    : [
        "方丈看了你一眼，先把木鱼搁在了一旁。",
        `“评定拖了 ${lateDays} 天才来，终究不像话。”`,
        `“先记你迟到，扣去 ${contributionPenalty} 点寺中贡献。坐下，把这一轮评定补完。”`,
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
  return (
    readZhuYuanzhangStoryStage(gameState) ===
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
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
        "方丈皱眉道，你这几日心神散乱，手上并未真正用力。",
        "虽未把差事彻底误了，但还远称不上踏实。",
      ],
    };
  }

  if (successes === 2) {
    return {
      grade: "合格",
      contribution: 10,
      praiseLines: [
        "方丈点头道，做事虽还生涩，至少已经肯下力气。",
        "乱世里先把眼前活计做稳，比空谈志气更要紧。",
      ],
    };
  }

  return {
    grade: "勤勉",
    contribution: 15,
    praiseLines: [
      "方丈难得露出赞许神色，说你这几日倒真肯吃苦。",
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

function resolveTempleBeggingDelivery(quantityDou: number): {
  grade: string;
  contribution: number;
  praiseLines: string[];
} {
  if (quantityDou >= 30) {
    return {
      grade: "功德充盈",
      contribution: 15,
      praiseLines: [
        "方丈让知客僧接过粮袋，神色终于松了几分。",
        "这一趟化缘能接济寺众，也能分出些许给山门外的饥民。",
      ],
    };
  }

  if (quantityDou >= 15) {
    return {
      grade: "足以交差",
      contribution: 10,
      praiseLines: [
        "方丈点头道，粮虽不算多，至少能撑过眼前几日。",
        "乱世中愿意把求来的粮带回寺里，便不是空走一遭。",
      ],
    };
  }

  return {
    grade: "杯水车薪",
    contribution: 5,
    praiseLines: [
      "方丈收下粮食，只叮嘱你下回多留意村口与粮仓差事。",
      "粮少也是粮，能交回来便算有一分心力。",
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
): {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  daysRested: number;
  totalRecovered: number;
  interruptedByCouncilDate: boolean;
} {
  let nextState = state;
  let nextCharacters = characterDefinitions;
  let daysRested = 0;
  let totalRecovered = 0;

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
      };
    }

    const result = advanceTempleRestOneDay(
      nextState,
      nextCharacters,
      playerCharacterId
    );
    nextState = result.state;
    nextCharacters = result.characterDefinitions;
    daysRested += 1;
    totalRecovered += result.recovered;

    if (hasReachedCouncilDate(nextState)) {
      return {
        state: nextState,
        characterDefinitions: nextCharacters,
        daysRested,
        totalRecovered,
        interruptedByCouncilDate: true,
      };
    }
  }

  return {
    state: nextState,
    characterDefinitions: nextCharacters,
    daysRested,
    totalRecovered,
    interruptedByCouncilDate: false,
  };
}

function createTempleRestResultOverlay(
  summary: {
    daysRested: number;
    totalRecovered: number;
    interruptedByCouncilDate: boolean;
    state: GameState;
    characterDefinitions: CharacterDefinition[];
  },
  title: string,
  playerCharacterId: string
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
            "评定日期已到，今日先去听候方丈安排，不能再继续休息。",
            `当前体力为 ${playerCharacter.stamina}。`,
            ...getTempleLateChoiceParagraphs(),
          ]
        : ["今日本就无需继续休息。"],
      tone: summary.interruptedByCouncilDate ? "warning" : "info",
    };
  }

  return {
    type: "alert",
    title,
    paragraphs: [
      `共休息 ${summary.daysRested} 天，恢复体力 ${summary.totalRecovered}。`,
      `当前体力 ${playerCharacter.stamina}。`,
      summary.interruptedByCouncilDate
        ? "评定日期先到一步，休息在这里中断，不能再继续静养。"
        : "寺中钟鼓照常，评定日程也随日子推进。",
      ...(summary.interruptedByCouncilDate ? getTempleLateChoiceParagraphs() : []),
    ],
    tone: summary.interruptedByCouncilDate ? "warning" : "success",
  };
}

function createTempleRestCouncilArrivalNotice(
  summary: {
    daysRested: number;
    interruptedByCouncilDate: boolean;
    characterDefinitions: CharacterDefinition[];
  },
  playerCharacterId: string
): NonNullable<HouseModuleTransitionResult["councilArrivalNotice"]> | undefined {
  if (!summary.interruptedByCouncilDate) {
    return undefined;
  }

  const playerCharacter = getPlayerCharacter(
    summary.characterDefinitions,
    playerCharacterId
  );

  return {
    textLines:
      summary.daysRested > 0
        ? [
            `这次静养共休了 ${summary.daysRested} 天，体力已恢复到 ${playerCharacter.stamina}。`,
            "评定日程已经压到眼前，先去前殿应评。",
          ]
        : [
            `休息尚未来得及继续，当前体力为 ${playerCharacter.stamina}。`,
            "先去把今日评定办完，之后再回来歇息。",
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

function createLowStaminaOverlay(actionLabel: string): NonNullable<TempleHouseOverlayState> {
  return createAlertOverlay(
    "先去歇息",
    [
      `住持合十道：“你这会儿心力已竭，今日不必强撑着去${actionLabel}。”`,
      `“先回禅房静养，体力至少缓到 ${ACTIVITY_COMPLETION_STAMINA_COST} 点，再来继续。”`,
    ],
    "warning"
  );
}

function resolveFortuneLines(
  gameState: GameState,
  playerCharacter: CharacterDefinition
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
      title: "上签",
      paragraphs: [
        "签纸一展开，墨痕清正。住持说你近来的路虽绕，终究会有人相助。",
        isMonkStoryStage(gameState)
          ? "你眼下还在寺门之内，可真正的去处，已经在寺门之外等你。"
          : "兵尘未定，但你若守得住节制，前路反倒比旁人更稳。",
      ],
      tone: "success",
    };
  }

  if (seed === 1) {
    return {
      title: "中签",
      paragraphs: [
        "住持将签纸放回案上，只道凡事莫急，急则生乱。",
        "眼前未必有捷径，但一步一步走，未必比旁人慢。",
      ],
      tone: "info",
    };
  }

  return {
    title: "下签",
    paragraphs: [
      "签文并不吉利。住持却摇头说，凶签不是坏事，是让人知道哪里该避。",
      "少争一口闲气，多护一分性命。先熬过眼前，才谈得上转机。",
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
              `知客僧合十道：“评定日期已到，这轮${activityLabel}少说也要 ${durationDays} 天，眼下已经来不及了。”`,
              "“先去前殿把评定应下，等过了这桩大事，再回来继续。”",
            ]
          : [
              `知客僧合十道：“离评定只剩 ${remainingDays} 天，这轮${activityLabel}少说也要 ${durationDays} 天，眼下已经来不及了。”`,
              "“先去前殿把评定应下，等过了这桩大事，再回来继续。”",
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

function getTaskDefinitionsByIds(taskIds: readonly string[]): TempleHouseTaskDefinition[] {
  return taskIds.map((taskId) => {
    const taskDefinition = templeHouseTaskDefinitions.find(
      (candidateTask) => candidateTask.id === taskId
    );
    assertExists(taskDefinition, `Temple house task not found for id "${taskId}".`);
    return taskDefinition;
  });
}

function getDailyTempleTasks(
  gameState: GameState,
  selectedWorkPlan: TempleHouseSessionState["selectedWorkPlan"]
): TempleHouseTaskDefinition[] {
  if (!isMonkStoryStage(gameState)) {
    return getTaskDefinitionsByIds([
      "beg-alms",
      "copy-scripture",
      "relief-refugees",
    ]);
  }

  if (selectedWorkPlan === "beg-alms") {
    return [];
  }

  if (selectedWorkPlan === "temple-help") {
    if (!isBeggingUnlocked(gameState) || getTempleWeek(gameState) <= 1) {
      return getTaskDefinitionsByIds(FIRST_WEEK_TEMPLE_TASK_IDS);
    }

    return getTaskDefinitionsByIds([
      "copy-scripture",
      "sweep-courtyard",
      "carry-water",
    ]);
  }

  if (!readBooleanFlag(gameState, ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked)) {
    return [];
  }

  if (!isBeggingUnlocked(gameState) || getTempleWeek(gameState) <= 1) {
    return getTaskDefinitionsByIds(FIRST_WEEK_TEMPLE_TASK_IDS);
  }

  return getTaskDefinitionsByIds([
    "copy-scripture",
    "sweep-courtyard",
    "carry-water",
  ]);
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
  playerCharacterId: string
): string[] {
  const topEntries = contributionEntries.slice(0, 2);

  if (topEntries.length === 0) {
    return ["方丈合十道，本期无人立功，寺里上下都该再自省。"];
  }

  return topEntries.map((entry, index) => {
    if (entry.characterId === playerCharacterId && entry.contribution >= 30) {
      return index === 0
        ? "方丈看向朱重八，道：你这一个月来倒算踏实，这份苦功众人都看在眼里。"
        : "方丈点名朱重八，道：你这一个月来倒算踏实，手上活计没有白做。";
    }

    if (entry.characterId === playerCharacterId && entry.contribution <= 0) {
      return "方丈又看了朱重八一眼，道：你初来挂单，暂不论功，先看今后肯不肯做实事。";
    }

    return `方丈道：${index === 0 ? "首功" : "次功"}记在${entry.name}名下，${entry.contribution}点贡献，做得扎实。`;
  });
}

function getTempleMeetingPolicyLines(gameState: GameState): string[] {
  if (!readBooleanFlag(gameState, ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted)) {
    return [
      "方丈将木鱼轻轻一扣，道：这一轮寺中方针只有一条，先维持寺庙运转。",
      "你初来乍到，第一周不许乱走，只准在寺内帮忙。",
    ];
  }

  if (isBeggingUnlocked(gameState)) {
    return [
      "方丈道：这一轮仍以维持寺庙运转为先，院中缺人手，院外也缺米粮。",
      "寺内帮忙与外出化缘都已可领，选哪一份，就把哪一份做踏实。",
    ];
  }

  return [
    "方丈翻过簿册，道：这一轮先照旧维持寺庙运转，院里活计不能断。",
    "外出化缘尚未开放，先把寺内杂务一件件做稳再说。",
  ];
}

function getTempleAssignDutyLines(
  reviewWorkChoices: ReturnType<typeof getReviewWorkChoices>
): string[] {
  const availableLabels = reviewWorkChoices
    .filter((workChoice) => workChoice.disabled !== true)
    .map((workChoice) => workChoice.label);

  return [
    "方丈抬手点了点案前木牌，示意你自选这一轮的差事。",
    availableLabels.length === 0
      ? "这一轮暂时没有可领的寺务。"
      : `这一轮可领的差事有：${availableLabels.join("、")}。`,
    "领了之后，便回寺中按次第去做。",
  ];
}

function getReviewWorkChoices(gameState: GameState): Array<{
  id: "temple-help" | "beg-alms";
  label: string;
  disabled?: boolean;
  tone?: HouseActionViewModel["tone"];
}> {
  if (!isMonkStoryStage(gameState)) {
    return [];
  }

  const choices: Array<{
    id: "temple-help" | "beg-alms";
    label: string;
    disabled?: boolean;
    tone?: HouseActionViewModel["tone"];
  }> = [
    {
      id: "temple-help",
      label: "寺内帮忙",
    },
    {
      id: "beg-alms",
      label: isBeggingUnlocked(gameState) ? "外出化缘" : "外出化缘（未解锁）",
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
  currentWorkPlan: TempleHouseWorkPlan
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
                  ? "本轮外出化缘请直接离寺，在城中进行"
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
  if (workPlan === "beg-alms" && !isBeggingUnlocked(input.gameState)) {
    return withSessionState(
      {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        overlay: createAlertOverlay(
          "外出化缘尚未解锁",
          [
            "这一轮评定里，方丈还不准你离寺化缘。",
            "先在寺内帮忙积攒贡献，等满三十后再说。",
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
      activeMissionId: workPlan === "beg-alms" ? "mission.temple.beg-alms" : null,
    },
    ui: {
      ...input.gameState.ui,
      activeMissionId: workPlan === "beg-alms" ? "mission.temple.beg-alms" : null,
      reviewDateText: formatReviewDateText(30),
      mainHouseMissionText: workPlan === "beg-alms" ? "外出化缘" : "寺内帮忙",
    },
    runtime: {
      ...input.gameState.runtime,
      flags: {
        ...input.gameState.runtime.flags,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted]: true,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked]: true,
      },
      variables: {
        ...input.gameState.runtime.variables,
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution]: 0,
        [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 30,
        [TEMPLE_HOUSE_VARIABLE_KEYS.lastAssignedTaskId]: "",
        [TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan]: workPlan,
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
      selectedWorkPlan: workPlan,
      dailyActionPanel: "root",
      dialogueLines:
        workPlan === "beg-alms"
          ? [
              "这一轮评定，你改去寺外化缘。",
              "离寺后直接在城中按化缘流程推进，不必再回寺里点这份工作。",
            ]
          : [
              "这一轮评定，先以寺内帮忙为主。",
              "评定到此为止，回到寺中事务里，再挑具体杂务去做。",
            ],
      overlay: createAlertOverlay(
        "本轮差事已定",
        [
          workPlan === "beg-alms"
            ? "本轮方向已定为外出化缘。离寺后直接去城中化缘，不再从寺庙工作菜单进入。"
            : "本轮方向已定为寺内帮忙。离开评定后，可在寺庙事务中选择抄经、扫院或挑水。",
          "本次寺中评定结束，下次评定倒计时已重置为 30 天。",
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
  const taskDefinition = templeHouseTaskDefinitions.find(
    (candidateTask) => candidateTask.id === taskId
  );
  assertExists(taskDefinition, `Temple house task not found for id "${taskId}".`);

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
      reviewDateText: formatReviewDateText(30),
      mainHouseMissionText: taskDefinition.title,
    },
    runtime: {
      ...input.gameState.runtime,
      variables: {
        ...input.gameState.runtime.variables,
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution]: 0,
        [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 30,
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
        `“${taskDefinition.title}这份寺务，就由你去办。”`,
      ],
      overlay: createAlertOverlay(
        "寺务已定",
        [
          taskDefinition.briefing,
          "本次寺中评定结束，下次评定倒计时已重置为 30 天。",
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
  const taskDefinition = templeHouseTaskDefinitions.find(
    (candidateTask) => candidateTask.id === "beg-alms"
  );
  assertExists(taskDefinition, 'Temple house task not found for id "beg-alms".');

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
        mainHouseMissionText: taskDefinition.title,
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
        "准备外出化缘",
        [
          taskDefinition.briefing,
          "这次不走寺内杂务考校。离开寺庙后，你便可按外出赚钱的流程推进。",
        ],
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
            "你身上还没有可交给寺里的化缘粮。",
            "先离寺去城中化缘，完成后再回寺提交。",
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
          ["你身上还没有可交给寺里的化缘粮。"],
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

  const resolution = resolveTempleBeggingDelivery(submittedQuantity);
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
      mainHouseMissionText: "化缘粮食已交",
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
        title: "化缘粮食已交",
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

function startTempleWorkMinigame(
  input: HouseModuleDispatchInput<"temple-house">,
  sessionState: TempleHouseSessionState,
  taskDefinition: TempleHouseTaskDefinition
): HouseModuleTransitionResult<"temple-house"> {
  return withSessionState(
    {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
    },
    sessionState,
    {
      mode: "daily",
      meetingStage: "finished",
      dialoguePhase: "idle",
      selectedTaskId: taskDefinition.id,
      dailyActionPanel: "work",
      overlay: createTempleWorkOverlay(taskDefinition, 1, 0),
    },
    [
      { type: "stop-interval", intervalId: TEMPLE_WORK_INTERVAL_ID },
      {
        type: "start-interval",
        intervalId: TEMPLE_WORK_INTERVAL_ID,
        everyMs: 90,
        request: {
          type: "tick",
          tickId: TEMPLE_WORK_INTERVAL_ID,
        },
      },
    ]
  );
}

function finalizeTempleWork(
  input: HouseModuleDispatchInput<"temple-house">,
  sessionState: TempleHouseSessionState,
  overlay: TempleHouseQteOverlayState
): HouseModuleTransitionResult<"temple-house"> {
  const durationDays = getHouseWorkDurationDays();
  const resolution = resolveTempleWorkContribution(overlay.successes);
  const currentContribution = getTempleContribution(input.gameState);
  const nextContribution = currentContribution + resolution.contribution;
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
    `本次评定：${overlay.taskLabel}`,
    `命中 ${overlay.successes} / ${overlay.totalRounds} 次`,
    `寺中贡献 +${resolution.contribution}`,
    `累计贡献 ${nextContribution} / 30`,
    `时间 +${durationDays}天`,
    `体力 -${ACTIVITY_COMPLETION_STAMINA_COST}`,
    ...(unlockBegging
      ? ["方丈似乎已经留意到你的踏实，回到寺中后或许会有新的安排。"]
      : []),
  ];
  const nextState = {
    ...input.gameState,
    ui: {
      ...input.gameState.ui,
      mainHouseMissionText: unlockBegging
        ? "休整至下次评定"
        : "继续寺内帮忙",
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
            "你这一个月来倒算踏实。",
            "先回寺中听候方丈发话，看看下一轮评定会如何安排你。",
          ]
        : resolution.praiseLines,
      overlay: {
        type: "result",
        title: unlockBegging ? "寺中有了新的安排" : "寺务结算",
        grade: resolution.grade,
        score: overlay.successes,
        rewardLines,
      },
      selectedTaskId: overlay.taskId,
    },
    sideEffects: [{ type: "stop-interval", intervalId: TEMPLE_WORK_INTERVAL_ID }],
    timeAdvanceCost: convertHouseActivityDaysToSegments(durationDays),
  };
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

  const taskDefinition = templeHouseTaskDefinitions.find(
    (candidateTask) => candidateTask.id === overlay.taskId
  );
  assertExists(taskDefinition, `Temple work task not found for id "${overlay.taskId}".`);

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
      const reviewWorkChoices = getReviewWorkChoices(nextState);
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
              dialogueLines: getTempleMeetingPolicyLines(nextState),
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
              dialogueLines: getTempleAssignDutyLines(reviewWorkChoices),
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
        dialogueLines: templeHouseOpenLines,
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
        dialogueLines: templeHouseOpenLines,
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
        dialogueLines: templeHouseRestMenuLines,
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

    return {
      gameState: summary.state,
      characterDefinitions: summary.characterDefinitions,
      sessionState: {
        ...sessionState,
        dailyActionPanel: "root",
        overlay: createTempleRestResultOverlay(
          summary,
          actionId === TEMPLE_REST_ONE_DAY_ACTION_ID
            ? "休息一日"
            : actionId === TEMPLE_REST_UNTIL_COUNCIL_ACTION_ID
              ? "休至评定日"
              : "休至体力恢复",
          input.playerCharacterId
        ),
      },
      councilArrivalNotice: createTempleRestCouncilArrivalNotice(
        summary,
        input.playerCharacterId
      ),
    };
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

    return {
      gameState: summary.state,
      characterDefinitions: summary.characterDefinitions,
      sessionState: {
        ...sessionState,
        dailyActionPanel: "root",
        overlay: createTempleRestResultOverlay(
          summary,
          `休息 ${days} 天`,
          input.playerCharacterId
        ),
      },
      councilArrivalNotice: createTempleRestCouncilArrivalNotice(
        summary,
        input.playerCharacterId
      ),
    };
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
    const fortune = resolveFortuneLines(nextState, playerCharacter);
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
          title: "布施香火",
          paragraphs: [
            `寺中正缺米面灯油。本次布施 ${DONATION_AMOUNT} 文，是否愿意捐下？`,
            "住持说，布施贵在心诚，多少都该量力而行。",
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
            "香火钱不够",
            [
              `你身上只剩 ${playerCharacter.stats.gold} 文，还不够这次布施。`,
              "住持并不催促，只让你先把日子过稳。",
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
          "香火已受",
          fameGain > 0
            ? [
                `你捐了 ${donationAmount} 文香火，寺里暂且又能多撑几日。`,
                `香火累计已到 ${nextDonationTotal} 文，乡里对你的名声也多了一分敬重。`,
              ]
            : [
                `你捐了 ${donationAmount} 文香火，寺里账上总算又添了一笔。`,
                `目前累计香火 ${nextDonationTotal} 文。`,
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
            everyMs: 450,
            targetHouseId: input.houseDefinition.id,
            label: "休整至评定期",
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
          input.playerCharacterId
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
    const taskDefinition = templeHouseTaskDefinitions.find(
      (candidateTask) => candidateTask.id === selectedTaskId
    );
    assertExists(taskDefinition, `Temple house task not found for id "${selectedTaskId}".`);

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
    const taskDefinition = templeHouseTaskDefinitions.find(
      (candidateTask) => candidateTask.id === confirmedTaskId
    );
    assertExists(taskDefinition, `Temple house task not found for id "${confirmedTaskId}".`);
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

  return handleTempleWorkTick(input, sessionState);
}

function selectOverlayViewModel(
  overlay: TempleHouseOverlayState
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
      title: "提交化缘粮食",
      paragraphs: [
        "选择要交给寺里的粮食数量。",
        "提交后会扣除随身粮食，结算本轮化缘贡献。",
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
      readNumericVariable(nextState, KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown, 0) <= 0;

    const sessionState = shouldStartMeeting
      ? createInitialTempleHouseSessionState(
          "meeting",
          "intro",
          lateAttendance.resolution == null
            ? templeHouseMeetingIntroLines
            : getTempleLateMeetingIntroLines(
                lateAttendance.resolution.lateDays,
                lateAttendance.resolution.contributionPenalty
              )
        )
      : createInitialTempleHouseSessionState(
          "daily",
          "finished",
          templeHouseGreetingLines
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
          templeHouseMeetingIntroLines
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
            textLines: ["既然答应了主持，就先不要离开寺院吧。"],
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
          templeHouseGreetingLines
        ),
        selectedWorkPlan: readTempleWorkPlan(nextState),
      };
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
    const dailyTasks = getDailyTempleTasks(nextState, currentWorkPlan);
    const reviewWorkChoices = getReviewWorkChoices(nextState);
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
      sessionState.dialoguePhase === "open";
    const shouldShowMeetingTasks =
      sessionState.mode === "meeting" &&
      sessionState.meetingStage === "assign-duty" &&
      sessionState.overlay == null;
    const selectedTask =
      sessionState.selectedTaskId == null
        ? null
        : templeHouseTaskDefinitions.find(
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
        ? "皇觉寺 / 挂单修行 / 寺中评定"
        : "古寺清修 / 卜签 / 香火",
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
                  ? getTempleWorkMenuActions(dailyTasks, currentWorkPlan)
                  : getTempleRootActions(
                      nextState,
                      currentWorkPlan,
                      sessionState.dialoguePhase
                    ),
            }
          : null,
      statusCard: {
        eyebrow: "皇觉寺",
        title: isMonkStoryStage(nextState) ? "寺中评定" : "清修香火",
        subtitle:
          sessionState.mode === "meeting"
            ? "住持主持 / 寺中差事"
            : "住持接待 / 问签布施",
        metrics: [
          { label: "住持", value: abbotCharacter.name },
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
              selectedTask?.title ??
              (currentWorkPlan === "beg-alms"
                ? "外出化缘"
                : currentWorkPlan === "temple-help"
                  ? "寺内帮忙"
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
      overlay: selectOverlayViewModel(sessionState.overlay),
      leaveAction: {
        id: "leave-house",
        label: "离开寺庙",
        tone: "accent",
      },
    };
  },
};

