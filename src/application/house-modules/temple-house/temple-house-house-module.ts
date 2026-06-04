import {
  templeHouseGreetingLines,
  templeHouseMeetingIntroLines,
  templeHouseOpenLines,
  templeHouseRestMenuLines,
  templeHouseTaskDefinitions,
} from "../../../content/houses/temple-house-content";
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
import type { TempleHouseTaskDefinition } from "../../../domain/temple-house";
import { TEMPLE_HOUSE_VARIABLE_KEYS } from "../../../domain/temple-house";
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
import {
  formatGrainAsDou,
  formatGrainAsShiAndDou,
} from "../../../domain/grain-unit";
import { assertExists } from "../../../shared/assert";
import {
  ensurePlayerGrainInventory,
} from "../../inventory/trade-inventory";
import {
  mutatePlayerGrainDou,
  readPlayerGrainDou,
} from "../../inventory/trade-inventory";
import {
  ACTIVITY_COMPLETION_STAMINA_COST,
  spendPlayerStamina,
} from "../../player/player-stamina";
import { createInitialTempleHouseSessionState } from "./temple-house-session-state";

const DONATION_AMOUNT = 50;
const ASSIGN_TEMPLE_TASK_ACTION_PREFIX = "assign-temple-task:";
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
const TEMPLE_REST_BASE_RECOVERY = 12;
const TEMPLE_REST_RECOVERY_RATIO = 0.18;
const TEMPLE_REST_MAX_DAYS = 99;

type TempleRestInterruptionReason = "event" | "council-date";

type TempleRestSummary = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  daysRested: number;
  recoveredStamina: number;
  interruptedReason: TempleRestInterruptionReason | null;
  stoppedAtCouncilDate: boolean;
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

function readBooleanFlag(
  state: GameState,
  key: string
): boolean {
  return state.runtime.flags[key] === true;
}

function readStringVariable(
  state: GameState,
  key: string,
  fallback: string
): string {
  const value = state.runtime.variables[key];
  return typeof value === "string" ? value : fallback;
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

function formatTempleGrainAmount(totalDou: number): string {
  const douText = formatGrainAsDou(totalDou);
  const mixedText = formatGrainAsShiAndDou(totalDou);
  return douText === mixedText ? douText : `${douText}（折合${mixedText}）`;
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

function isSameDate(left: CalendarDate, right: CalendarDate): boolean {
  return (
    left.year === right.year &&
    left.month === right.month &&
    left.day === right.day
  );
}

function advanceCalendarOneDay(state: GameState): GameState {
  const currentNumber =
    state.calendar.year * 360 + (state.calendar.month - 1) * 30 + state.calendar.day;
  const nextNumber = currentNumber + 1;
  const nextYear = Math.floor((nextNumber - 1) / 360);
  const dayOfYear = nextNumber - nextYear * 360;
  const nextMonth = Math.floor((dayOfYear - 1) / 30) + 1;
  const nextDay = ((dayOfYear - 1) % 30) + 1;

  return {
    ...state,
    calendar: {
      ...state.calendar,
      year: nextYear,
      month: nextMonth,
      day: nextDay,
    },
  };
}

function formatReviewDateText(daysLeft: number): string {
  return daysLeft <= 0 ? "今日评定" : `距离评定 ${daysLeft} 天`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function calculateRecovery(current: number, max: number, base: number, ratio: number): number {
  if (current >= max) {
    return 0;
  }

  return Math.max(base, Math.ceil((max - current) * ratio));
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
    ...gameState,
    ui: {
      ...syncedState.ui,
      reviewDateText: formatReviewDateText(
        readNumericVariable(
          {
            ...syncedState,
            runtime: {
              ...syncedState.runtime,
              variables: nextVariables,
            },
          },
          KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown,
          0
        )
      ),
    },
    runtime: {
      ...syncedState.runtime,
      flags: nextFlags,
      variables: nextVariables,
    },
  };
}

function advanceTempleRestOneDay(
  gameState: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string
): {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  recoveredStamina: number;
} {
  const playerCharacter = getPlayerCharacter(characterDefinitions, playerCharacterId);
  const maxStamina = Math.max(100, playerCharacter.stamina);
  const recoveredStamina = Math.min(
    maxStamina - playerCharacter.stamina,
    calculateRecovery(
      playerCharacter.stamina,
      maxStamina,
      TEMPLE_REST_BASE_RECOVERY,
      TEMPLE_REST_RECOVERY_RATIO
    )
  );
  const nextPlayerCharacter: CharacterDefinition = {
    ...playerCharacter,
    stamina: clamp(playerCharacter.stamina + recoveredStamina, 0, maxStamina),
  };
  const nextCharacterDefinitions = replaceCharacter(
    characterDefinitions,
    nextPlayerCharacter
  );
  const advancedState = advanceCalendarOneDay(gameState);
  const nextCountdown = Math.max(
    0,
    readNumericVariable(advancedState, KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown, 0) - 1
  );

  return {
    state: {
      ...advancedState,
      world: {
        ...advancedState.world,
        timeOfDay: "morning",
      },
      ui: {
        ...advancedState.ui,
        reviewDateText: formatReviewDateText(nextCountdown),
      },
      runtime: {
        ...advancedState.runtime,
        variables: {
          ...advancedState.runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: nextCountdown,
        },
      },
    },
    characterDefinitions: nextCharacterDefinitions,
    recoveredStamina,
  };
}

function runTempleRestPlan(
  gameState: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  shouldContinue: (
    state: GameState,
    characterDefinitions: CharacterDefinition[],
    daysRested: number
  ) => boolean
): TempleRestSummary {
  let nextState = gameState;
  let nextCharacterDefinitions = characterDefinitions;
  let daysRested = 0;
  let recoveredStamina = 0;

  while (shouldContinue(nextState, nextCharacterDefinitions, daysRested)) {
    if (nextState.scene.activeEventId != null) {
      return {
        state: nextState,
        characterDefinitions: nextCharacterDefinitions,
        daysRested,
        recoveredStamina,
        interruptedReason: "event",
        stoppedAtCouncilDate: false,
      };
    }

    if (isSameDate(getCurrentDate(nextState), nextState.world.schedule.councilDate)) {
      return {
        state: nextState,
        characterDefinitions: nextCharacterDefinitions,
        daysRested,
        recoveredStamina,
        interruptedReason: "council-date",
        stoppedAtCouncilDate: true,
      };
    }

    const dailyResult = advanceTempleRestOneDay(
      nextState,
      nextCharacterDefinitions,
      playerCharacterId
    );
    nextState = dailyResult.state;
    nextCharacterDefinitions = dailyResult.characterDefinitions;
    recoveredStamina += dailyResult.recoveredStamina;
    daysRested += 1;

    if (isSameDate(getCurrentDate(nextState), nextState.world.schedule.councilDate)) {
      return {
        state: nextState,
        characterDefinitions: nextCharacterDefinitions,
        daysRested,
        recoveredStamina,
        interruptedReason: "council-date",
        stoppedAtCouncilDate: true,
      };
    }
  }

  return {
    state: nextState,
    characterDefinitions: nextCharacterDefinitions,
    daysRested,
    recoveredStamina,
    interruptedReason: null,
    stoppedAtCouncilDate: false,
  };
}

function createTemplePostRestSessionState(
  baseSessionState: TempleHouseSessionState,
  nextState: GameState,
  overlay: NonNullable<TempleHouseOverlayState>,
  beginMeeting: boolean
): TempleHouseSessionState {
  if (beginMeeting) {
    return {
      ...baseSessionState,
      mode: "meeting",
      meetingStage: "intro",
      dialogueLines: templeHouseMeetingIntroLines,
      dialogueOverride: null,
      dialoguePhase: "greeting",
      overlay,
      selectedTaskId: null,
      selectedWorkPlan: readTempleWorkPlan(nextState),
      dailyActionPanel: "root",
    };
  }

  return {
    ...baseSessionState,
    mode: "daily",
    meetingStage: "finished",
    dialogueLines: resolveTempleOpenLines(nextState),
    dialogueOverride: null,
    dialoguePhase: "open",
    overlay,
    selectedTaskId: null,
    selectedWorkPlan: readTempleWorkPlan(nextState),
    dailyActionPanel: "root",
  };
}

function getTempleRestInterruptParagraph(
  reason: TempleRestInterruptionReason
): string {
  switch (reason) {
    case "event":
      return "寺中静修途中忽有事情打断，只得先停下休息。";
    case "council-date":
      return "评定日期已到，该去偏殿听候住持发话了。";
    default:
      return "休息被打断。";
  }
}

function createTempleRestResultOverlay(
  summary: TempleRestSummary,
  title: string
): NonNullable<TempleHouseOverlayState> {
  if (summary.daysRested <= 0) {
    return createAlertOverlay(
      title,
      summary.interruptedReason == null
        ? ["还没来得及歇下，这次休息便作罢了。"]
        : [getTempleRestInterruptParagraph(summary.interruptedReason)],
      "warning"
    );
  }

  const paragraphs = [
    `在寺中静修了 ${summary.daysRested} 日。`,
    `体力恢复 ${summary.recoveredStamina}。`,
  ];

  if (summary.interruptedReason != null) {
    paragraphs.push(getTempleRestInterruptParagraph(summary.interruptedReason));
  }

  return createAlertOverlay(title, paragraphs, "success");
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

function getTempleWeek(gameState: GameState): number {
  return readNumericVariable(gameState, ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeWeek, 1);
}

function readTempleWorkPlan(gameState: GameState): TempleHouseWorkPlan {
  const value = gameState.runtime.variables[TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan];
  return value === "temple-help" || value === "beg-alms" ? value : null;
}

function isTempleBeggingWorkSubmitted(gameState: GameState): boolean {
  return (
    readTempleWorkPlan(gameState) === "beg-alms" &&
    readTempleBeggingSubmittedFood(gameState) > 0
  );
}

function isTempleBeggingFoodReadyForSubmission(gameState: GameState): boolean {
  return (
    readTempleWorkPlan(gameState) === "beg-alms" &&
    !isTempleBeggingWorkSubmitted(gameState) &&
    readTempleAvailableFood(gameState) > 0
  );
}

function isTempleBeggingDutyUnresolved(gameState: GameState): boolean {
  return (
    readTempleWorkPlan(gameState) === "beg-alms" &&
    !isTempleBeggingWorkSubmitted(gameState)
  );
}

function resolveTempleOpenLines(gameState: GameState): string[] {
  if (!isMonkStoryStage(gameState)) {
    return templeHouseOpenLines;
  }

  if (isTempleBeggingFoodReadyForSubmission(gameState)) {
    return [
      "住持看了看你身旁的粮袋，示意你上前回话。",
      "“既已筹到米粮，就从包里拣出要交寺里的数目，我好记入本期评定。”",
    ];
  }

  if (isTempleBeggingWorkSubmitted(gameState)) {
    return [
      "住持已经把你这一轮带回的粮食记在寺簿上。",
      "“离下次评定还有些时日，你先自行活动，到期再回来听差。”",
    ];
  }

  if (readTempleWorkPlan(gameState) === "beg-alms") {
    return [
      "住持合十而立，提醒你这一轮差事已定为外出化缘。",
      "“去城中奔走也好，去粮铺筹粮也好，备够米粮后再回来向我交代。”",
    ];
  }

  return templeHouseOpenLines;
}

function resolveTempleBeggingDelivery(foodGain: number): {
  grade: string;
  contribution: number;
  praiseLines: string[];
} {
  if (foodGain <= 2) {
    return {
      grade: "收获寥寥",
      contribution: 8,
      praiseLines: [
        "住持看了看袋中米粮，只道你这一趟还嫌生涩，勉强算把路子走通了。",
        "粮虽不多，总归没有空手而回，往后还需更稳当些。",
      ],
    };
  }

  if (foodGain <= 5) {
    return {
      grade: "略有所得",
      contribution: 12,
      praiseLines: [
        "住持点头道，这一趟已不算白跑，寺中粥锅也能多续几日。",
        "你既能把粮食带回，说明这条活路已经摸出些门道了。",
      ],
    };
  }

  if (foodGain <= 8) {
    return {
      grade: "满载而归",
      contribution: 16,
      praiseLines: [
        "住持掂了掂袋中分量，难得露出一丝赞许，说你这一趟着实替寺里解了急。",
        "有了这些米粮，寺中与灾民都能多撑一阵。",
      ],
    };
  }

  return {
    grade: "功德无量",
    contribution: 20,
    praiseLines: [
      "住持看着你带回的粮袋，合十低声道这一趟已不只是化缘，几乎是替寺中续了命脉。",
      "寺里上下都会记得你这一轮奔走的功劳。",
    ],
  };
}

function syncTempleBeggingState(gameState: GameState): GameState {
  const currentWorkPlan = readTempleWorkPlan(gameState);
  const availableFood = readTempleAvailableFood(gameState);
  const submittedFood = readTempleBeggingSubmittedFood(gameState);

  const nextMissionText =
    currentWorkPlan !== "beg-alms"
      ? gameState.ui.mainHouseMissionText
      : submittedFood > 0
        ? "静候下次评定"
        : availableFood > 0
          ? "回寺向方丈交粮"
          : "筹粮待交";

  if (nextMissionText === gameState.ui.mainHouseMissionText) {
    return gameState;
  }

  return {
    ...gameState,
    ui: {
      ...gameState.ui,
      mainHouseMissionText: nextMissionText,
    },
  };
}

function shouldStartTempleMeeting(gameState: GameState): boolean {
  return (
    isMonkStoryStage(gameState) &&
    readNumericVariable(gameState, KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown, 0) <= 0 &&
    !isTempleBeggingDutyUnresolved(gameState)
  );
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
    if (!isBeggingUnlocked(gameState)) {
      return [];
    }

    if (
      isTempleBeggingWorkSubmitted(gameState) ||
      isTempleBeggingFoodReadyForSubmission(gameState)
    ) {
      return [];
    }

    return getTaskDefinitionsByIds(["beg-alms"]);
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
    "beg-alms",
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
    {
      id: OPEN_TEMPLE_WORK_MENU_ACTION_ID,
      label: currentWorkPlan == null ? "工作（待评定）" : "工作",
      tone: "accent",
      disabled: currentWorkPlan == null,
    },
    ...(isTempleBeggingFoodReadyForSubmission(gameState)
      ? [
          {
            id: SUBMIT_TEMPLE_BEGGING_FOOD_ACTION_ID,
            label: `提交粮食：${formatTempleGrainAmount(readTempleAvailableFood(gameState))}`,
            tone: "accent",
          } satisfies HouseActionViewModel,
        ]
      : []),
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
    { id: TEMPLE_REST_ONE_DAY_ACTION_ID, label: "休息一天", tone: "accent" },
    { id: OPEN_TEMPLE_REST_DAYS_ACTION_ID, label: "休息指定天数" },
    { id: TEMPLE_REST_UNTIL_COUNCIL_ACTION_ID, label: "休息到评定日期" },
    { id: TEMPLE_REST_UNTIL_RECOVERED_ACTION_ID, label: "休息到恢复体力" },
    { id: CLOSE_TEMPLE_REST_MENU_ACTION_ID, label: "取消" },
  ];
}

function getTempleWorkMenuActions(
  dailyTasks: TempleHouseTaskDefinition[],
  currentWorkPlan: TempleHouseWorkPlan,
  gameState: GameState
): HouseActionViewModel[] {
  return [
    ...dailyTasks.map<HouseActionViewModel>((taskDefinition) => ({
      id: `${ASSIGN_TEMPLE_TASK_ACTION_PREFIX}${taskDefinition.id}`,
      label: taskDefinition.title,
      tone: taskDefinition.id === "beg-alms" ? "accent" : "default",
    })),
    ...(dailyTasks.length === 0
      ? [
          {
            id: "temple-work-unavailable",
            label:
              currentWorkPlan == null
                ? "本轮评定尚未安排工作"
                : currentWorkPlan === "beg-alms" &&
                    isTempleBeggingFoodReadyForSubmission(gameState)
                  ? `背包里已有 ${formatTempleGrainAmount(readTempleAvailableFood(gameState))} 粮食，先去见住持`
                  : currentWorkPlan === "beg-alms" &&
                      isTempleBeggingWorkSubmitted(gameState)
                    ? "本轮化缘已经交粮结算"
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
        [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 30,
        [TEMPLE_HOUSE_VARIABLE_KEYS.beggingSubmittedFood]: 0,
        [TEMPLE_HOUSE_VARIABLE_KEYS.beggingLastGrade]: "",
        [TEMPLE_HOUSE_VARIABLE_KEYS.lastAssignedTaskId]: "",
        [TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan]: workPlan,
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
              "先回寺中准备，之后再从寺庙事务里动身，不必在评定席前仓促出门。",
            ]
          : [
              "这一轮评定，先以寺内帮忙为主。",
              "评定到此为止，回到寺中事务里，再挑具体杂务去做。",
            ],
      overlay: createAlertOverlay(
        "本轮差事已定",
        [
          workPlan === "beg-alms"
            ? "本轮方向已定为外出化缘。无论在外化缘还是去粮铺买粮，最后都要回寺向住持交粮结算。"
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
        [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 30,
        [TEMPLE_HOUSE_VARIABLE_KEYS.lastAssignedTaskId]: taskDefinition.id,
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
          "离开寺庙后，可在城中打开化缘小游戏，也可去粮铺筹粮。备好粮食后，记得回寺向住持交粮。",
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
          "尚未带回粮食",
          [
            "这一轮既然领了外出化缘，就先去城中讨些米粮，或去粮铺买些粮食回来。",
            "备好粮食后，再来向住持交代这一轮的结果。",
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
  input: Pick<
    HouseModuleDispatchInput<"temple-house">,
    "gameState" | "characterDefinitions"
  >,
  sessionState: TempleHouseSessionState,
  quantity: number
): HouseModuleTransitionResult<"temple-house"> {
  const overlay = sessionState.overlay;
  if (overlay?.type !== "submit-food") {
    return createTransitionResult({
      ...input,
      sessionState,
    });
  }

  const maxQuantity = Math.max(1, readTempleAvailableFood(input.gameState));
  return withSessionState(input, sessionState, {
    overlay: {
      ...overlay,
      maxQuantity,
      quantity: Math.min(maxQuantity, Math.max(1, quantity)),
    },
  });
}

function confirmTempleBeggingFoodSubmission(
  input: HouseModuleDispatchInput<"temple-house">,
  sessionState: TempleHouseSessionState
): HouseModuleTransitionResult<"temple-house"> {
  const overlay = sessionState.overlay;
  const availableFood = readTempleAvailableFood(input.gameState);
  const submittedQuantity =
    overlay?.type === "submit-food"
      ? Math.min(availableFood, Math.max(1, overlay.quantity))
      : 0;

  if (submittedQuantity <= 0) {
    return openTempleBeggingFoodOverlay(input, sessionState);
  }

  const nextState = mutatePlayerGrainDou(
    input.gameState,
    -submittedQuantity
  );
  const resolution = resolveTempleBeggingDelivery(submittedQuantity);
  const nextContribution = getTempleContribution(nextState) + resolution.contribution;
  const staminaMutation = spendPlayerStamina(
    nextState,
    input.characterDefinitions,
    input.playerCharacterId
  );

  return {
    gameState: {
      ...staminaMutation.state,
      missions: {
        ...staminaMutation.state.missions,
        activeMissionId: null,
      },
      ui: {
        ...staminaMutation.state.ui,
        activeMissionId: null,
        mainHouseMissionText: "静候下次评定",
      },
      runtime: {
        ...staminaMutation.state.runtime,
        variables: {
          ...staminaMutation.state.runtime.variables,
          [TEMPLE_HOUSE_VARIABLE_KEYS.beggingSubmittedFood]: submittedQuantity,
          [TEMPLE_HOUSE_VARIABLE_KEYS.beggingLastGrade]: resolution.grade,
          [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution]: nextContribution,
        },
      },
    },
    characterDefinitions: staminaMutation.characterDefinitions,
    sessionState: {
      ...sessionState,
      dialoguePhase: "open",
      dailyActionPanel: "root",
      selectedTaskId: null,
      dialogueLines: resolution.praiseLines,
      overlay: {
        type: "result",
        title: "化缘结算",
        grade: resolution.grade,
        score: submittedQuantity,
        rewardLines: [
          `本轮上交粮食：${formatTempleGrainAmount(submittedQuantity)}`,
          `住持评语：${resolution.grade}`,
          `寺中贡献 +${resolution.contribution}`,
          `累计贡献 ${nextContribution}`,
          `体力 -${ACTIVITY_COMPLETION_STAMINA_COST}`,
        ],
      },
    },
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
    `体力 -${ACTIVITY_COMPLETION_STAMINA_COST}`,
    ...(unlockBegging
      ? ["方丈似乎已经留意到你的踏实，回到寺中后或许会有新的安排。"]
      : []),
  ];
  const staminaMutation = spendPlayerStamina(
    input.gameState,
    input.characterDefinitions,
    input.playerCharacterId
  );

  return {
    gameState: {
      ...staminaMutation.state,
      ui: {
        ...staminaMutation.state.ui,
        mainHouseMissionText: unlockBegging
          ? "休整至下次评定"
          : "继续寺内帮忙",
      },
      runtime: {
        ...staminaMutation.state.runtime,
        flags: {
          ...staminaMutation.state.runtime.flags,
          ...(unlockBegging
            ? {
                [ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked]: true,
              }
            : {}),
        },
        variables: nextVariables,
      },
    },
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

  if (input.request.fieldId === TEMPLE_REST_DAYS_FIELD_ID) {
    if (sessionState.overlay?.type !== "rest-days") {
      return createTransitionResult(input);
    }

    const sanitizedValue = input.request.value.replace(/[^\d]/g, "").slice(0, 2);
    return withSessionState(
      {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        overlay: {
          ...sessionState.overlay,
          inputValue: sanitizedValue,
        },
      }
    );
  }

  if (input.request.fieldId !== TEMPLE_BEGGING_SUBMIT_FIELD_ID) {
    return createTransitionResult(input);
  }

  const nextState = syncTempleBeggingState(
    ensureTempleRuntimeState(input.gameState)
  );
  const quantity = parseInt(input.request.value, 10) || 1;

  return updateTempleBeggingSubmitQuantity(
    {
      gameState: nextState,
      characterDefinitions: input.characterDefinitions,
    },
    sessionState,
    quantity
  );
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
  const nextState = syncTempleBeggingState(
    ensureTempleRuntimeState(input.gameState)
  );

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
        dialogueLines: resolveTempleOpenLines(nextState),
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
        dialogueLines: resolveTempleOpenLines(nextState),
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
        overlay: null,
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
        dialoguePhase: "open",
        dialogueLines: resolveTempleOpenLines(nextState),
        overlay: null,
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

  if (input.request.actionId === "ask-fortune") {
    const fortune = resolveFortuneLines(nextState, playerCharacter);
    return withSessionState(
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
    );
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
          return !isSameDate(getCurrentDate(state), state.world.schedule.councilDate);
        }

        const nextPlayerCharacter = getPlayerCharacter(
          characterDefinitions,
          input.playerCharacterId
        );
        return nextPlayerCharacter.stamina < Math.max(100, nextPlayerCharacter.stamina);
      }
    );
    const beginMeeting =
      summary.stoppedAtCouncilDate && shouldStartTempleMeeting(summary.state);

    return {
      gameState: summary.state,
      characterDefinitions: summary.characterDefinitions,
      sessionState: createTemplePostRestSessionState(
        sessionState,
        summary.state,
        createTempleRestResultOverlay(
          summary,
          actionId === TEMPLE_REST_ONE_DAY_ACTION_ID
            ? "静修一日"
            : actionId === TEMPLE_REST_UNTIL_COUNCIL_ACTION_ID
              ? "休息到评定日"
              : "休息到恢复体力"
        ),
        beginMeeting
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
    const beginMeeting =
      summary.stoppedAtCouncilDate && shouldStartTempleMeeting(summary.state);

    return {
      gameState: summary.state,
      characterDefinitions: summary.characterDefinitions,
      sessionState: createTemplePostRestSessionState(
        sessionState,
        summary.state,
        createTempleRestResultOverlay(summary, `静修 ${days} 日`),
        beginMeeting
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
      {
        overlay: null,
      }
    );
  }

  if (input.request.actionId === DECREMENT_TEMPLE_BEGGING_FOOD_ACTION_ID) {
    if (sessionState.overlay?.type !== "submit-food") {
      return createTransitionResult(input, {
        gameState: nextState,
      });
    }

    return updateTempleBeggingSubmitQuantity(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      sessionState.overlay.quantity - 1
    );
  }

  if (input.request.actionId === INCREMENT_TEMPLE_BEGGING_FOOD_ACTION_ID) {
    if (sessionState.overlay?.type !== "submit-food") {
      return createTransitionResult(input, {
        gameState: nextState,
      });
    }

    return updateTempleBeggingSubmitQuantity(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      sessionState.overlay.quantity + 1
    );
  }

  if (input.request.actionId === CONFIRM_TEMPLE_BEGGING_FOOD_ACTION_ID) {
    return confirmTempleBeggingFoodSubmission(
      {
        ...input,
        gameState: nextState,
      },
      sessionState
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
    };
  }

  if (input.request.actionId === "close-temple-result") {
    if (sessionState.overlay?.type === "result" && sessionState.overlay.title === "化缘结算") {
      return withSessionState(
        {
          gameState: nextState,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: null,
          dialoguePhase: "idle",
          dailyActionPanel: "root",
        }
      );
    }

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
      return startTempleWorkMinigame(
        {
          ...input,
          gameState: nextState,
        },
        sessionState,
        taskDefinition
      );
    }

    if (isMonkStoryStage(nextState) && taskDefinition.id === "beg-alms") {
      return startBegAlmsWork(
        {
          ...input,
          gameState: nextState,
        },
        sessionState
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
      title: "向住持交粮",
      paragraphs: [
        "住持会按你本轮实际上交的粮食数量评定化缘成绩。",
      ],
      quantityLabel: "上交数量（斗）",
      quantity: overlay.quantity,
      maxQuantity: overlay.maxQuantity,
      quantityFieldId: TEMPLE_BEGGING_SUBMIT_FIELD_ID,
      decrementActionId: DECREMENT_TEMPLE_BEGGING_FOOD_ACTION_ID,
      incrementActionId: INCREMENT_TEMPLE_BEGGING_FOOD_ACTION_ID,
      confirmActionId: CONFIRM_TEMPLE_BEGGING_FOOD_ACTION_ID,
      confirmLabel: "确认交粮",
      cancelActionId: CANCEL_TEMPLE_BEGGING_FOOD_ACTION_ID,
      cancelLabel: "暂缓",
      helperLines: [`当前可交 ${formatTempleGrainAmount(overlay.maxQuantity)}。`],
    };
  }

  if (overlay.type === "rest-days") {
    return {
      type: "rest-days",
      title: "休息指定天数",
      paragraphs: ["输入想在寺中静修的天数。期间若遇到评定或事件，会自动中断。"],
      dayCount: overlay.inputValue,
      quantityFieldId: TEMPLE_REST_DAYS_FIELD_ID,
      confirmActionId: CONFIRM_TEMPLE_REST_DAYS_ACTION_ID,
      confirmLabel: "开始休息",
      cancelActionId: "close-temple-overlay",
      cancelLabel: "取消",
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
    const nextState = completeFirstTempleWorkLockIfReviewArrived(
      syncTempleBeggingState(ensureTempleRuntimeState(input.gameState))
    );
    const selectedWorkPlan = readTempleWorkPlan(nextState);
    const shouldStartMeeting = shouldStartTempleMeeting(nextState);

    const sessionState = shouldStartMeeting
      ? createInitialTempleHouseSessionState(
          "meeting",
          "intro",
          templeHouseMeetingIntroLines
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
    const nextState = syncTempleBeggingState(
      ensureTempleRuntimeState(input.gameState)
    );
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
    const beggingSubmittedFood = readTempleBeggingSubmittedFood(nextState);
    const beggingLastGrade = readTempleBeggingLastGrade(nextState);
    const beggingFoodToSubmit = readTempleAvailableFood(nextState);
    const maxStamina = Math.max(100, playerCharacter.stamina);
    const currentWorkPlan =
      sessionState.selectedWorkPlan ?? readTempleWorkPlan(nextState);
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
                sessionState.dailyActionPanel === "work"
                  ? "工作"
                  : sessionState.dailyActionPanel === "rest"
                    ? "休息安排"
                    : "寺庙事务",
              actions:
                sessionState.dailyActionPanel === "work"
                  ? getTempleWorkMenuActions(dailyTasks, currentWorkPlan, nextState)
                  : sessionState.dailyActionPanel === "rest"
                    ? getTempleRestMenuActions()
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
                ...(currentWorkPlan === "beg-alms"
                  ? [
                      {
                        label: beggingSubmittedFood > 0 ? "本轮交粮" : "背包粮食",
                        value:
                          beggingSubmittedFood > 0
                            ? `${formatTempleGrainAmount(beggingSubmittedFood)} / ${beggingLastGrade}`
                            : formatTempleGrainAmount(beggingFoodToSubmit),
                      },
                    ]
                  : []),
              ]
            : [{ label: "香火累计", value: `${donationTotal} 文` }]),
          {
            label: "当前差事",
            value:
              selectedTask?.title ??
              (currentWorkPlan === "beg-alms" && beggingSubmittedFood > 0
                ? "静候评定"
                : currentWorkPlan === "beg-alms" && beggingFoodToSubmit > 0
                  ? "回寺交粮"
                : currentWorkPlan === "beg-alms"
                  ? "筹粮待交"
                : currentWorkPlan === "temple-help"
                  ? "寺内帮忙"
                  : null) ??
              (nextState.ui.mainHouseMissionText === ""
                ? "暂无"
                : nextState.ui.mainHouseMissionText),
          },
          { label: "玩家体力", value: `${playerCharacter.stamina} / ${maxStamina}` },
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

