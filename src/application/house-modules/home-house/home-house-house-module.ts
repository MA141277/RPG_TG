import { homeHouseIntroLines, homeHouseMainLines, homeHouseRecoveryTuning, homeHouseRestMenuLines } from "../../../content/houses/home-house-content";
import type { CharacterDefinition } from "../../../domain/character";
import type {
  CalendarDate,
  GameState,
  TimeOfDay,
} from "../../../domain/game-state";
import {
  HOME_HOUSE_VARIABLE_KEYS,
  HOME_HOUSE_FLAG_KEYS,
  resolveHomeRestHook,
  selectHomePersistentState,
  type HomeRestInterruptionReason,
} from "../../../domain/home-house";
import type {
  HouseActionViewModel,
  HouseModuleDefinition,
  HouseModuleDispatchInput,
  HouseModuleTransitionResult,
  HouseModuleViewModel,
  HouseOverlayViewModel,
} from "../../../domain/house-module";
import type {
  HomeHouseOverlayState,
  HomeHouseSessionState,
} from "../../../domain/house-modules/home-house-session";
import { KEEP_HOUSE_VARIABLE_KEYS } from "../../../domain/keep-house";
import { assertExists } from "../../../shared/assert";
import { createInitialHomeHouseSessionState } from "./home-house-session-state";

const REST_DAYS_FIELD_ID = "home-house-rest-days";

type HomeRestSummary = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  daysRested: number;
  recoveredHp: number;
  recoveredFatigue: number;
  interruptedReason: HomeRestInterruptionReason | null;
  stoppedAtCouncilDate: boolean;
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
    `Player character not found for id "${playerCharacterId}" in home house module.`
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

function readNumericVariable(state: GameState, key: string, fallback: number): number {
  const value = state.runtime.variables[key];
  return typeof value === "number" ? value : fallback;
}

function readDateNumber(date: CalendarDate): number {
  return date.year * 360 + (date.month - 1) * 30 + date.day;
}

function getCurrentDate(state: GameState): CalendarDate {
  return {
    year: state.calendar.year,
    month: state.calendar.month,
    day: state.calendar.day,
  };
}

function isSameDate(left: CalendarDate, right: CalendarDate): boolean {
  return (
    left.year === right.year &&
    left.month === right.month &&
    left.day === right.day
  );
}

function addDays(date: CalendarDate, days: number): CalendarDate {
  let totalDays = readDateNumber(date) + days;
  const year = Math.floor(totalDays / 360);
  totalDays -= year * 360;
  const month = Math.floor(totalDays / 30) + 1;
  const day = (totalDays % 30) || 30;

  return {
    year,
    month: day === 30 && totalDays % 30 === 0 ? month - 1 : month,
    day,
  };
}

function advanceCalendarOneDay(state: GameState): GameState {
  const currentNumber = readDateNumber(getCurrentDate(state));
  const nextNumber = currentNumber + 1;
  const nextYear = Math.floor(nextNumber / 360);
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

function formatDateText(date: CalendarDate): string {
  return `${date.year}年${date.month}月${date.day}日`;
}

function formatTimeOfDay(timeOfDay: TimeOfDay): string {
  switch (timeOfDay) {
    case "morning":
      return "早晨";
    case "afternoon":
      return "午后";
    case "night":
      return "夜晚";
    default:
      return timeOfDay;
  }
}

function getCouncilCountdown(state: GameState): number {
  return Math.max(0, readDateNumber(state.world.schedule.councilDate) - readDateNumber(getCurrentDate(state)));
}

function formatCouncilCountdownText(daysLeft: number): string {
  return daysLeft <= 0 ? "今日评定" : `距离评定 ${daysLeft} 天`;
}

function calculateRecovery(current: number, max: number, base: number, ratio: number): number {
  if (current >= max) {
    return 0;
  }

  return Math.max(base, Math.ceil((max - current) * ratio));
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function createAlertOverlay(
  title: string,
  paragraphs: string[],
  tone?: "info" | "success" | "warning"
): NonNullable<HomeHouseOverlayState> {
  return {
    type: "alert",
    title,
    paragraphs,
    ...(tone == null ? {} : { tone }),
  };
}

function getRestInterruptParagraph(reason: HomeRestInterruptionReason): string {
  switch (reason) {
    case "event":
      return "宅中静养途中有事件打断，只得先停下休息。";
    case "forced-plot":
      return "外头忽然传来强制剧情的动静，无法继续安心静养。";
    case "war-summons":
      return "军中召集忽至，休息被迫中断。";
    case "council-date":
      return "评定日期已到，继续躺着也该起身准备了。";
    default:
      return "休息被打断。";
  }
}

function ensureHomeRuntimeState(
  gameState: GameState,
  playerCharacter: CharacterDefinition
): GameState {
  const spouseNpcIdVariable = gameState.runtime.variables[HOME_HOUSE_VARIABLE_KEYS.spouseNpcId];
  const spouseSupportActionsVariable =
    gameState.runtime.variables[HOME_HOUSE_VARIABLE_KEYS.spouseSupportActions];
  const homeDecorationVariable =
    gameState.runtime.variables[HOME_HOUSE_VARIABLE_KEYS.homeDecoration];
  const maxHp = readNumericVariable(
    gameState,
    HOME_HOUSE_VARIABLE_KEYS.maxHp,
    Math.max(100, playerCharacter.stamina)
  );
  const maxFatigue = readNumericVariable(gameState, HOME_HOUSE_VARIABLE_KEYS.maxFatigue, 100);
  const currentHp = clamp(
    readNumericVariable(gameState, HOME_HOUSE_VARIABLE_KEYS.hp, playerCharacter.stamina),
    0,
    maxHp
  );
  const currentFatigue = clamp(
    readNumericVariable(gameState, HOME_HOUSE_VARIABLE_KEYS.fatigue, playerCharacter.stamina),
    0,
    maxFatigue
  );

  return {
    ...gameState,
    ui: {
      ...gameState.ui,
      reviewDateText: formatCouncilCountdownText(getCouncilCountdown(gameState)),
    },
    runtime: {
      ...gameState.runtime,
      flags: {
        ...gameState.runtime.flags,
        [HOME_HOUSE_FLAG_KEYS.spouseEnabled]:
          gameState.runtime.flags[HOME_HOUSE_FLAG_KEYS.spouseEnabled] ?? false,
        [HOME_HOUSE_FLAG_KEYS.guestRoom]:
          gameState.runtime.flags[HOME_HOUSE_FLAG_KEYS.guestRoom] ?? false,
      },
      variables: {
        ...gameState.runtime.variables,
        [HOME_HOUSE_VARIABLE_KEYS.hp]: currentHp,
        [HOME_HOUSE_VARIABLE_KEYS.maxHp]: maxHp,
        [HOME_HOUSE_VARIABLE_KEYS.fatigue]: currentFatigue,
        [HOME_HOUSE_VARIABLE_KEYS.maxFatigue]: maxFatigue,
        [HOME_HOUSE_VARIABLE_KEYS.homeLevel]: readNumericVariable(
          gameState,
          HOME_HOUSE_VARIABLE_KEYS.homeLevel,
          1
        ),
        [HOME_HOUSE_VARIABLE_KEYS.storageSize]: readNumericVariable(
          gameState,
          HOME_HOUSE_VARIABLE_KEYS.storageSize,
          20
        ),
        [HOME_HOUSE_VARIABLE_KEYS.spouseAffection]: readNumericVariable(
          gameState,
          HOME_HOUSE_VARIABLE_KEYS.spouseAffection,
          0
        ),
        [HOME_HOUSE_VARIABLE_KEYS.spouseNpcId]:
          typeof spouseNpcIdVariable === "string" ? spouseNpcIdVariable : "",
        [HOME_HOUSE_VARIABLE_KEYS.spouseSupportActions]:
          typeof spouseSupportActionsVariable === "string"
            ? spouseSupportActionsVariable
            : "",
        [HOME_HOUSE_VARIABLE_KEYS.homeDecoration]:
          typeof homeDecorationVariable === "string"
            ? homeDecorationVariable
            : "",
      },
    },
  };
}

function advanceRestOneDay(
  gameState: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string
): {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  recoveredHp: number;
  recoveredFatigue: number;
} {
  const playerCharacter = getPlayerCharacter(characterDefinitions, playerCharacterId);
  const ensuredState = ensureHomeRuntimeState(gameState, playerCharacter);
  const maxHp = readNumericVariable(ensuredState, HOME_HOUSE_VARIABLE_KEYS.maxHp, 100);
  const currentHp = readNumericVariable(ensuredState, HOME_HOUSE_VARIABLE_KEYS.hp, playerCharacter.stamina);
  const maxFatigue = readNumericVariable(ensuredState, HOME_HOUSE_VARIABLE_KEYS.maxFatigue, 100);
  const currentFatigue = readNumericVariable(
    ensuredState,
    HOME_HOUSE_VARIABLE_KEYS.fatigue,
    playerCharacter.stamina
  );
  const recoveredHp = Math.min(
    maxHp - currentHp,
    calculateRecovery(
      currentHp,
      maxHp,
      homeHouseRecoveryTuning.hpBase,
      homeHouseRecoveryTuning.hpRatio
    )
  );
  const recoveredFatigue = Math.min(
    maxFatigue - currentFatigue,
    calculateRecovery(
      currentFatigue,
      maxFatigue,
      homeHouseRecoveryTuning.fatigueBase,
      homeHouseRecoveryTuning.fatigueRatio
    )
  );
  const nextHp = clamp(currentHp + recoveredHp, 0, maxHp);
  const nextFatigue = clamp(currentFatigue + recoveredFatigue, 0, maxFatigue);
  const nextPlayerCharacter: CharacterDefinition = {
    ...playerCharacter,
    stamina: nextFatigue,
  };
  const nextCharacterDefinitions = replaceCharacter(characterDefinitions, nextPlayerCharacter);
  const advancedState = advanceCalendarOneDay(ensuredState);
  const nextCountdown = Math.max(
    0,
    readNumericVariable(advancedState, KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown, 0) - 1
  );
  const stateWithRest: GameState = {
    ...advancedState,
    world: {
      ...advancedState.world,
      timeOfDay: "morning",
    },
    ui: {
      ...advancedState.ui,
      reviewDateText: formatCouncilCountdownText(getCouncilCountdown(advancedState)),
    },
    runtime: {
      ...advancedState.runtime,
      variables: {
        ...advancedState.runtime.variables,
        [HOME_HOUSE_VARIABLE_KEYS.hp]: nextHp,
        [HOME_HOUSE_VARIABLE_KEYS.maxHp]: maxHp,
        [HOME_HOUSE_VARIABLE_KEYS.fatigue]: nextFatigue,
        [HOME_HOUSE_VARIABLE_KEYS.maxFatigue]: maxFatigue,
        [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: nextCountdown,
      },
    },
  };

  return {
    state: stateWithRest,
    characterDefinitions: nextCharacterDefinitions,
    recoveredHp,
    recoveredFatigue,
  };
}

function runRestPlan(
  gameState: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  shouldContinue: (
    state: GameState,
    characterDefinitions: CharacterDefinition[],
    daysRested: number
  ) => boolean
): HomeRestSummary {
  let nextState = gameState;
  let nextCharacterDefinitions = characterDefinitions;
  let daysRested = 0;
  let recoveredHp = 0;
  let recoveredFatigue = 0;

  while (shouldContinue(nextState, nextCharacterDefinitions, daysRested)) {
    const hookResult = resolveHomeRestHook(nextState);
    if (hookResult.interrupted) {
      return {
        state: nextState,
        characterDefinitions: nextCharacterDefinitions,
        daysRested,
        recoveredHp,
        recoveredFatigue,
        interruptedReason: hookResult.reason,
        stoppedAtCouncilDate: false,
      };
    }

    if (isSameDate(getCurrentDate(nextState), nextState.world.schedule.councilDate)) {
      return {
        state: nextState,
        characterDefinitions: nextCharacterDefinitions,
        daysRested,
        recoveredHp,
        recoveredFatigue,
        interruptedReason: "council-date",
        stoppedAtCouncilDate: true,
      };
    }

    const dailyResult = advanceRestOneDay(nextState, nextCharacterDefinitions, playerCharacterId);
    nextState = dailyResult.state;
    nextCharacterDefinitions = dailyResult.characterDefinitions;
    recoveredHp += dailyResult.recoveredHp;
    recoveredFatigue += dailyResult.recoveredFatigue;
    daysRested += 1;

    if (isSameDate(getCurrentDate(nextState), nextState.world.schedule.councilDate)) {
      return {
        state: nextState,
        characterDefinitions: nextCharacterDefinitions,
        daysRested,
        recoveredHp,
        recoveredFatigue,
        interruptedReason: "council-date",
        stoppedAtCouncilDate: true,
      };
    }
  }

  return {
    state: nextState,
    characterDefinitions: nextCharacterDefinitions,
    daysRested,
    recoveredHp,
    recoveredFatigue,
    interruptedReason: null,
    stoppedAtCouncilDate: false,
  };
}

function createTransitionResult(
  input: Pick<
    HouseModuleDispatchInput<"home-house">,
    "gameState" | "characterDefinitions" | "sessionState"
  >,
  patch?: Partial<HouseModuleTransitionResult<"home-house">>
): HouseModuleTransitionResult<"home-house"> {
  return {
    gameState: patch?.gameState ?? input.gameState,
    characterDefinitions: patch?.characterDefinitions ?? input.characterDefinitions,
    sessionState: patch?.sessionState ?? input.sessionState,
    ...(patch?.sideEffects == null ? {} : { sideEffects: patch.sideEffects }),
  };
}

function withSessionState(
  input: Pick<
    HouseModuleDispatchInput<"home-house">,
    "gameState" | "characterDefinitions"
  >,
  sessionState: HomeHouseSessionState | null,
  patch: Partial<HomeHouseSessionState>
): HouseModuleTransitionResult<"home-house"> {
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

function createRestResultOverlay(summary: HomeRestSummary, title: string): NonNullable<HomeHouseOverlayState> {
  if (summary.daysRested <= 0) {
    return createAlertOverlay(
      title,
      summary.interruptedReason == null
        ? ["今日本就无需继续静养。"]
        : [getRestInterruptParagraph(summary.interruptedReason)],
      summary.interruptedReason == null ? "info" : "warning"
    );
  }

  const paragraphs = [
    `在自宅中静养了 ${summary.daysRested} 日。`,
    `HP 恢复 ${summary.recoveredHp}，疲劳恢复 ${summary.recoveredFatigue}。`,
  ];

  if (summary.interruptedReason != null) {
    paragraphs.push(getRestInterruptParagraph(summary.interruptedReason));
  } else {
    paragraphs.push("身体恢复了些许，疲劳也慢慢消退。");
  }

  return createAlertOverlay(
    title,
    paragraphs,
    summary.interruptedReason == null ? "success" : "warning"
  );
}

function createStatusParagraphs(
  gameState: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string
): string[] {
  const playerCharacter = getPlayerCharacter(characterDefinitions, playerCharacterId);
  const ensuredState = ensureHomeRuntimeState(gameState, playerCharacter);
  const hp = readNumericVariable(ensuredState, HOME_HOUSE_VARIABLE_KEYS.hp, playerCharacter.stamina);
  const maxHp = readNumericVariable(ensuredState, HOME_HOUSE_VARIABLE_KEYS.maxHp, 100);
  const fatigue = readNumericVariable(
    ensuredState,
    HOME_HOUSE_VARIABLE_KEYS.fatigue,
    playerCharacter.stamina
  );
  const maxFatigue = readNumericVariable(ensuredState, HOME_HOUSE_VARIABLE_KEYS.maxFatigue, 100);

  return [
    `${playerCharacter.name} / ${playerCharacter.title ?? "旅人"}`,
    `HP：${hp} / ${maxHp}`,
    `疲劳：${fatigue} / ${maxFatigue}`,
    `金钱：${playerCharacter.stats.gold} 文`,
    `统率 ${playerCharacter.stats.leadership} / 武勇 ${playerCharacter.stats.martial} / 智谋 ${playerCharacter.stats.intelligence}`,
    `政务 ${playerCharacter.stats.politics} / 魅力 ${playerCharacter.stats.charm} / 名声 ${playerCharacter.stats.fame}`,
    `当前时段：${formatTimeOfDay(ensuredState.world.timeOfDay)}`,
    `当前日期：${formatDateText(getCurrentDate(ensuredState))}`,
  ];
}

function createInventoryParagraphs(state: GameState): string[] {
  const items = [...state.valuables.items]
    .filter((item) => item.ownedCount > 0)
    .sort((left, right) => {
      if (left.category !== right.category) {
        return left.category.localeCompare(right.category);
      }
      return left.name.localeCompare(right.name);
    });

  if (items.length === 0) {
    return ["行囊里暂时没有可整理的物件。"];
  }

  return items.map(
    (item) => `${item.name} x${item.ownedCount} / ${item.kindText}`
  );
}

function handleAction(
  input: HouseModuleDispatchInput<"home-house">,
  sessionState: HomeHouseSessionState | null
): HouseModuleTransitionResult<"home-house"> {
  if (input.request.type !== "action" || sessionState == null) {
    return createTransitionResult(input);
  }

  const playerCharacter = getPlayerCharacter(input.characterDefinitions, input.playerCharacterId);
  const ensuredState = ensureHomeRuntimeState(input.gameState, playerCharacter);

  if (input.request.actionId === "open-rest-menu") {
    return {
      gameState: ensuredState,
      characterDefinitions: input.characterDefinitions,
      sessionState: {
        ...sessionState,
        mode: "rest-menu",
        descriptionLines: homeHouseRestMenuLines,
        overlay: null,
      },
    };
  }

  if (input.request.actionId === "back-home-menu") {
    return {
      gameState: ensuredState,
      characterDefinitions: input.characterDefinitions,
      sessionState: {
        ...sessionState,
        mode: "main",
        descriptionLines: homeHouseMainLines,
        overlay: null,
      },
    };
  }

  if (input.request.actionId === "close-home-overlay") {
    return {
      gameState: ensuredState,
      characterDefinitions: input.characterDefinitions,
      sessionState: {
        ...sessionState,
        overlay: null,
      },
    };
  }

  if (input.request.actionId === "open-status") {
    return {
      gameState: ensuredState,
      characterDefinitions: input.characterDefinitions,
      sessionState: {
        ...sessionState,
        overlay: createAlertOverlay("当前状态", createStatusParagraphs(ensuredState, input.characterDefinitions, input.playerCharacterId)),
      },
    };
  }

  if (input.request.actionId === "open-inventory") {
    return {
      gameState: ensuredState,
      characterDefinitions: input.characterDefinitions,
      sessionState: {
        ...sessionState,
        overlay: createAlertOverlay("持有物品", createInventoryParagraphs(ensuredState)),
      },
    };
  }

  if (input.request.actionId === "open-rest-days") {
    return {
      gameState: ensuredState,
      characterDefinitions: input.characterDefinitions,
      sessionState: {
        ...sessionState,
        overlay: {
          type: "rest-days",
          inputValue: "3",
        },
      },
    };
  }

  if (input.request.actionId === "rest-one-day" || input.request.actionId === "end-day") {
    const summary = runRestPlan(
      ensuredState,
      input.characterDefinitions,
      input.playerCharacterId,
      (_state, _characterDefinitions, daysRested) => daysRested < 1
    );

    return {
      gameState: summary.state,
      characterDefinitions: summary.characterDefinitions,
      sessionState: {
        ...sessionState,
        mode: "main",
        descriptionLines: homeHouseMainLines,
        overlay: createRestResultOverlay(
          summary,
          input.request.actionId === "end-day" ? "今日已过" : "静养一日"
        ),
      },
    };
  }

  if (input.request.actionId === "rest-until-council") {
    const summary = runRestPlan(
      ensuredState,
      input.characterDefinitions,
      input.playerCharacterId,
      (state) => !isSameDate(getCurrentDate(state), state.world.schedule.councilDate)
    );

    return {
      gameState: summary.state,
      characterDefinitions: summary.characterDefinitions,
      sessionState: {
        ...sessionState,
        mode: "main",
        descriptionLines: homeHouseMainLines,
        overlay: createRestResultOverlay(summary, "休息到评定日"),
      },
    };
  }

  if (input.request.actionId === "rest-until-recovered") {
    const summary = runRestPlan(
      ensuredState,
      input.characterDefinitions,
      input.playerCharacterId,
      (state, characterDefinitions) => {
        const nextPlayerCharacter = getPlayerCharacter(characterDefinitions, input.playerCharacterId);
        const hp = readNumericVariable(state, HOME_HOUSE_VARIABLE_KEYS.hp, nextPlayerCharacter.stamina);
        const maxHp = readNumericVariable(state, HOME_HOUSE_VARIABLE_KEYS.maxHp, 100);
        const fatigue = readNumericVariable(
          state,
          HOME_HOUSE_VARIABLE_KEYS.fatigue,
          nextPlayerCharacter.stamina
        );
        const maxFatigue = readNumericVariable(state, HOME_HOUSE_VARIABLE_KEYS.maxFatigue, 100);

        return hp < maxHp || fatigue < maxFatigue;
      }
    );

    return {
      gameState: summary.state,
      characterDefinitions: summary.characterDefinitions,
      sessionState: {
        ...sessionState,
        mode: "main",
        descriptionLines: homeHouseMainLines,
        overlay: createRestResultOverlay(summary, "休息到恢复体力"),
      },
    };
  }

  if (input.request.actionId === "confirm-rest-days") {
    const inputValue =
      sessionState.overlay?.type === "rest-days" ? sessionState.overlay.inputValue : "";
    const parsedDays = Number.parseInt(inputValue, 10);
    if (!Number.isFinite(parsedDays) || parsedDays <= 0) {
      return withSessionState(
        {
          gameState: ensuredState,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: createAlertOverlay("休息天数无效", ["请输入 1 到 99 之间的天数。"], "warning"),
        }
      );
    }

    const days = clamp(parsedDays, 1, homeHouseRecoveryTuning.customRestMaxDays);
    const summary = runRestPlan(
      ensuredState,
      input.characterDefinitions,
      input.playerCharacterId,
      (_state, _characterDefinitions, daysRested) => daysRested < days
    );

    return {
      gameState: summary.state,
      characterDefinitions: summary.characterDefinitions,
      sessionState: {
        ...sessionState,
        mode: "main",
        descriptionLines: homeHouseMainLines,
        overlay: createRestResultOverlay(summary, `静养 ${days} 日`),
      },
    };
  }

  return createTransitionResult(
    {
      gameState: ensuredState,
      characterDefinitions: input.characterDefinitions,
      sessionState,
    }
  );
}

function handleField(
  input: HouseModuleDispatchInput<"home-house">,
  sessionState: HomeHouseSessionState | null
): HouseModuleTransitionResult<"home-house"> {
  if (input.request.type !== "field" || sessionState == null) {
    return createTransitionResult(input);
  }

  if (
    input.request.fieldId === REST_DAYS_FIELD_ID &&
    sessionState.overlay?.type === "rest-days"
  ) {
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

  return createTransitionResult(input);
}

function selectOverlayViewModel(
  overlay: HomeHouseOverlayState
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
      confirmActionId: "close-home-overlay",
      confirmLabel: "知道了",
    };
  }

  return {
    type: "rest-days",
    title: "休息指定天数",
    paragraphs: ["输入想在自宅里静养的天数。期间若遇到评定、事件或召集，会自动中断。"],
    dayCount: overlay.inputValue,
    quantityFieldId: REST_DAYS_FIELD_ID,
    confirmActionId: "confirm-rest-days",
    confirmLabel: "开始休息",
    cancelActionId: "close-home-overlay",
    cancelLabel: "取消",
  };
}

function createActionContainer(sessionState: HomeHouseSessionState): {
  title: string;
  actions: HouseActionViewModel[];
} {
  if (sessionState.mode === "rest-menu") {
    return {
      title: "休息安排",
      actions: [
        { id: "rest-one-day", label: "休息一天", tone: "accent" },
        { id: "open-rest-days", label: "休息指定天数" },
        { id: "rest-until-council", label: "休息到评定日期" },
        { id: "rest-until-recovered", label: "休息到恢复体力" },
        { id: "back-home-menu", label: "取消" },
      ],
    };
  }

  return {
    title: "自宅事务",
    actions: [
      { id: "open-rest-menu", label: "休息", tone: "accent" },
      { id: "open-status", label: "查看状态" },
      { id: "open-inventory", label: "整理道具" },
      { id: "end-day", label: "结束当天" },
    ],
  };
}

export const homeHouseHouseModule: HouseModuleDefinition<"home-house"> = {
  moduleId: "home-house",
  enter(input) {
    const playerCharacter = getPlayerCharacter(input.characterDefinitions, input.playerCharacterId);
    const nextState = ensureHomeRuntimeState(input.gameState, playerCharacter);

    return {
      gameState: nextState,
      characterDefinitions: input.characterDefinitions,
      sessionState: createInitialHomeHouseSessionState("main", homeHouseIntroLines),
    };
  },
  dispatch(input) {
    if (input.request.type === "field") {
      return handleField(input, input.sessionState);
    }

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
    const playerCharacter = getPlayerCharacter(input.characterDefinitions, input.playerCharacterId);
    const ensuredState = ensureHomeRuntimeState(input.gameState, playerCharacter);
    const sessionState =
      input.sessionState ?? createInitialHomeHouseSessionState("main", homeHouseIntroLines);
    const hp = readNumericVariable(ensuredState, HOME_HOUSE_VARIABLE_KEYS.hp, playerCharacter.stamina);
    const maxHp = readNumericVariable(ensuredState, HOME_HOUSE_VARIABLE_KEYS.maxHp, 100);
    const fatigue = readNumericVariable(
      ensuredState,
      HOME_HOUSE_VARIABLE_KEYS.fatigue,
      playerCharacter.stamina
    );
    const maxFatigue = readNumericVariable(ensuredState, HOME_HOUSE_VARIABLE_KEYS.maxFatigue, 100);
    const persistentState = selectHomePersistentState(ensuredState);

    return {
      moduleId: "home-house",
      houseId: input.houseDefinition.id,
      sceneTitle: input.houseDefinition.name,
      sceneSubtitle: "个人据点 / 静养 / 整理",
      standbyRoster: [],
      dialogue: {
        mode: "narration",
        textLines: sessionState.descriptionLines,
      },
      actionContainer: createActionContainer(sessionState),
      statusCard: {
        eyebrow: "自宅",
        title: `${formatDateText(getCurrentDate(ensuredState))} / ${formatTimeOfDay(
          ensuredState.world.timeOfDay
        )}`,
        subtitle: "外出归来后歇脚整备的地方",
        metrics: [
          { label: "HP", value: `${hp} / ${maxHp}` },
          { label: "疲劳", value: `${fatigue} / ${maxFatigue}` },
          { label: "金钱", value: `${playerCharacter.stats.gold} 文` },
          {
            label: "评定",
            value: formatCouncilCountdownText(getCouncilCountdown(ensuredState)),
          },
          { label: "宅邸等级", value: `${persistentState.growth.homeLevel}` },
          {
            label: "配偶接口",
            value: persistentState.spouse.enabled ? "已预留" : "未启用",
          },
        ],
      },
      overlay: selectOverlayViewModel(sessionState.overlay),
      leaveAction: {
        id: "leave-house",
        label: "离开",
        tone: "accent",
      },
    };
  },
};
