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
  ActiveHouseModuleSession,
  HouseActionViewModel,
  HouseModuleTransitionResult,
  HouseModuleDefinition,
  HouseModuleDispatchInput,
  HouseModuleViewModel,
  HouseOverlayViewModel,
  MapAutoAdvanceSnapshot,
} from "../../../domain/house-module";
import type {
  HomeHouseOverlayState,
  HomeHouseSessionState,
} from "../../../domain/house-modules/home-house-session";
import { KEEP_HOUSE_VARIABLE_KEYS } from "../../../domain/keep-house";
import {
  getCouncilPriorityHouseModuleId,
  hasReachedCouncilDate,
} from "../../time/council-priority";
import {
  advanceGameStateOneDay,
  getCouncilStatusText,
} from "../../time/time-progression";
import { HOUSE_MAP_AUTO_ADVANCE_DAY_INTERVAL_MS } from "../../house/map-auto-advance";
import { defaultRuntimeContent } from "../../content/default-runtime-content";
import { getHouseModuleDefaults } from "../../content/house-module-defaults";
import {
  resolveTextEntry,
  resolveTextTemplateEntry,
} from "../../content/text-resolution";
import { assertExists } from "../../../shared/assert";
import { createInitialHomeHouseSessionState } from "./home-house-session-state";

const REST_DAYS_FIELD_ID = "home-house-rest-days";
const HOME_REST_AUTO_ADVANCE_INTERVAL_ID = "home-house-rest-auto-advance";

type HomeHouseContentDefaults = {
  homeHouseIntroLines: string[];
  homeHouseMainLines: string[];
  homeHouseRestMenuLines: string[];
  homeHouseRecoveryTuning: {
    hpBase: number;
    hpRatio: number;
    fatigueBase: number;
    fatigueRatio: number;
    customRestMaxDays: number;
  };
};

const FALLBACK_HOME_HOUSE_CONTENT: HomeHouseContentDefaults = {
  homeHouseIntroLines: [],
  homeHouseMainLines: [],
  homeHouseRestMenuLines: [],
  homeHouseRecoveryTuning: {
    hpBase: 10,
    hpRatio: 0.15,
    fatigueBase: 12,
    fatigueRatio: 0.18,
    customRestMaxDays: 99,
  },
};

type HomeRestSummary = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  daysRested: number;
  recoveredHp: number;
  recoveredFatigue: number;
  interruptedReason: HomeRestInterruptionReason | null;
  stoppedAtCouncilDate: boolean;
  snapshots: MapAutoAdvanceSnapshot[];
};

function getHomeHouseContentDefaults(): HomeHouseContentDefaults {
  return (
    getHouseModuleDefaults<HomeHouseContentDefaults>(
      defaultRuntimeContent.houseModuleDefaults,
      "home-house"
    ) ?? FALLBACK_HOME_HOUSE_CONTENT
  );
}

function getHomeTextEntries(
  textEntriesById?: Record<string, string>
): Record<string, string> {
  return textEntriesById ?? defaultRuntimeContent.textEntriesById ?? {};
}

function resolveHomeText(
  textEntriesById: Record<string, string> | undefined,
  textId: string
): string {
  return resolveTextEntry(
    getHomeTextEntries(textEntriesById),
    textId,
    `MISSING_TEXT:${textId}`
  );
}

function resolveHomeTemplateText(
  textEntriesById: Record<string, string> | undefined,
  textId: string,
  values: Record<string, string | number | boolean | null | undefined>
): string {
  return resolveTextTemplateEntry(
    getHomeTextEntries(textEntriesById),
    textId,
    values,
    `MISSING_TEXT:${textId}`
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

function getCurrentDate(state: GameState): CalendarDate {
  return {
    year: state.calendar.year,
    month: state.calendar.month,
    day: state.calendar.day,
  };
}

function advanceCalendarOneDay(state: GameState): GameState {
  return advanceGameStateOneDay(state);
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

function getRestInterruptParagraph(
  reason: HomeRestInterruptionReason,
  textEntriesById?: Record<string, string>
): string {
  switch (reason) {
    case "event":
      return resolveHomeText(
        textEntriesById,
        "runtime.zhu_yuanzhang.home.rest_interrupt.event.001"
      );
    case "forced-plot":
      return resolveHomeText(
        textEntriesById,
        "runtime.zhu_yuanzhang.home.rest_interrupt.forced_plot.001"
      );
    case "war-summons":
      return resolveHomeText(
        textEntriesById,
        "runtime.zhu_yuanzhang.home.rest_interrupt.war_summons.001"
      );
    case "council-date":
      return resolveHomeText(
        textEntriesById,
        "runtime.zhu_yuanzhang.home.rest_interrupt.council_date.001"
      );
    default:
      return resolveHomeText(
        textEntriesById,
        "runtime.zhu_yuanzhang.home.rest_interrupt.default.001"
      );
  }
}

function getCouncilLateChoiceParagraphs(
  state: GameState,
  textEntriesById?: Record<string, string>
): string[] {
  if (getCouncilPriorityHouseModuleId(state) === "temple-house") {
    return [
      resolveHomeText(
        textEntriesById,
        "runtime.zhu_yuanzhang.home.council.late_choice.temple.001"
      ),
      resolveHomeText(
        textEntriesById,
        "runtime.zhu_yuanzhang.home.council.late_choice.temple.002"
      ),
      resolveHomeText(
        textEntriesById,
        "runtime.zhu_yuanzhang.home.council.late_choice.temple.003"
      ),
    ];
  }

  return [
    resolveHomeText(
      textEntriesById,
      "runtime.zhu_yuanzhang.home.council.late_choice.keep.001"
    ),
    resolveHomeText(
      textEntriesById,
      "runtime.zhu_yuanzhang.home.council.late_choice.keep.002"
    ),
    resolveHomeText(
      textEntriesById,
      "runtime.zhu_yuanzhang.home.council.late_choice.keep.003"
    ),
  ];
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
      reviewDateText: getCouncilStatusText(gameState),
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
      getHomeHouseContentDefaults().homeHouseRecoveryTuning.hpBase,
      getHomeHouseContentDefaults().homeHouseRecoveryTuning.hpRatio
    )
  );
  const recoveredFatigue = Math.min(
    maxFatigue - currentFatigue,
    calculateRecovery(
      currentFatigue,
      maxFatigue,
      getHomeHouseContentDefaults().homeHouseRecoveryTuning.fatigueBase,
      getHomeHouseContentDefaults().homeHouseRecoveryTuning.fatigueRatio
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
  const nextCountdown = readNumericVariable(
    advancedState,
    KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown,
    0
  );
  const stateWithRest: GameState = {
    ...advancedState,
    world: {
      ...advancedState.world,
      timeOfDay: "morning",
    },
    ui: {
      ...advancedState.ui,
      reviewDateText: getCouncilStatusText(advancedState),
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
  const snapshots: MapAutoAdvanceSnapshot[] = [];

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
        snapshots,
      };
    }

    if (hasReachedCouncilDate(nextState)) {
      return {
        state: nextState,
        characterDefinitions: nextCharacterDefinitions,
        daysRested,
        recoveredHp,
        recoveredFatigue,
        interruptedReason: "council-date",
        stoppedAtCouncilDate: true,
        snapshots,
      };
    }

    const dailyResult = advanceRestOneDay(nextState, nextCharacterDefinitions, playerCharacterId);
    nextState = dailyResult.state;
    nextCharacterDefinitions = dailyResult.characterDefinitions;
    snapshots.push({
      gameState: nextState,
      characterDefinitions: nextCharacterDefinitions,
    });
    recoveredHp += dailyResult.recoveredHp;
    recoveredFatigue += dailyResult.recoveredFatigue;
    daysRested += 1;

    if (hasReachedCouncilDate(nextState)) {
      return {
        state: nextState,
        characterDefinitions: nextCharacterDefinitions,
        daysRested,
        recoveredHp,
        recoveredFatigue,
        interruptedReason: "council-date",
        stoppedAtCouncilDate: true,
        snapshots,
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
    snapshots,
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

function createRestResultOverlay(
  summary: HomeRestSummary,
  title: string,
  playerCharacterId: string,
  textEntriesById?: Record<string, string>
): NonNullable<HomeHouseOverlayState> {
  const playerCharacter = getPlayerCharacter(
    summary.characterDefinitions,
    playerCharacterId
  );
  const currentHp = readNumericVariable(
    summary.state,
    HOME_HOUSE_VARIABLE_KEYS.hp,
    playerCharacter.stamina
  );
  const maxHp = readNumericVariable(summary.state, HOME_HOUSE_VARIABLE_KEYS.maxHp, currentHp);
  if (summary.daysRested <= 0) {
    const paragraphs =
      summary.interruptedReason == null
        ? [
            resolveHomeText(
              textEntriesById,
              "runtime.zhu_yuanzhang.home.rest.summary.none.001"
            ),
          ]
        : summary.interruptedReason === "council-date"
          ? getCouncilLateChoiceParagraphs(summary.state, textEntriesById)
          : [getRestInterruptParagraph(summary.interruptedReason, textEntriesById)];
    return createAlertOverlay(
      title,
      paragraphs,
      summary.interruptedReason == null ? "info" : "warning"
    );
  }

  const paragraphs = [
    resolveHomeTemplateText(
      textEntriesById,
      "runtime.zhu_yuanzhang.home.rest.summary.days.001",
      { daysRested: summary.daysRested }
    ),
    resolveHomeTemplateText(
      textEntriesById,
      "runtime.zhu_yuanzhang.home.rest.summary.recovery.001",
      {
        recoveredHp: summary.recoveredHp,
        recoveredFatigue: summary.recoveredFatigue,
      }
    ),
    resolveHomeTemplateText(
      textEntriesById,
      "runtime.zhu_yuanzhang.home.rest.summary.current.001",
      {
        stamina: playerCharacter.stamina,
        currentHp,
        maxHp,
      }
    ),
  ];

  if (summary.interruptedReason != null) {
    paragraphs.push(getRestInterruptParagraph(summary.interruptedReason, textEntriesById));
    if (summary.interruptedReason === "council-date") {
      paragraphs.push(...getCouncilLateChoiceParagraphs(summary.state, textEntriesById));
    }
  } else {
    paragraphs.push(
      resolveHomeText(
        textEntriesById,
        "runtime.zhu_yuanzhang.home.rest.summary.normal.001"
      )
    );
  }

  return createAlertOverlay(
    title,
    paragraphs,
    summary.interruptedReason == null ? "success" : "warning"
  );
}

function createHomeRestCompletionSession(
  sessionState: HomeHouseSessionState,
  summary: HomeRestSummary,
  title: string,
  playerCharacterId: string,
  textEntriesById?: Record<string, string>
): ActiveHouseModuleSession {
  return {
    moduleId: "home-house",
    state: {
      ...sessionState,
      mode: "main",
      descriptionLines: getHomeHouseContentDefaults().homeHouseMainLines,
      overlay: createRestResultOverlay(summary, title, playerCharacterId, textEntriesById),
    },
  };
}

function createHomeRestAutoAdvanceResult(
  input: HouseModuleDispatchInput<"home-house">,
  sessionState: HomeHouseSessionState,
  summary: HomeRestSummary,
  title: string,
  currentState: GameState
): HouseModuleTransitionResult<"home-house"> {
  return {
    gameState: currentState,
    characterDefinitions: input.characterDefinitions,
    sessionState,
    sideEffects: [
      {
        type: "start-map-auto-advance",
        intervalId: HOME_REST_AUTO_ADVANCE_INTERVAL_ID,
        everyMs: HOUSE_MAP_AUTO_ADVANCE_DAY_INTERVAL_MS,
        targetHouseId: input.houseDefinition.id,
        label: title,
        snapshots: summary.snapshots,
        completion: {
          type: "restore-house-session",
          houseId: input.houseDefinition.id,
          houseSession: createHomeRestCompletionSession(
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
        descriptionLines: getHomeHouseContentDefaults().homeHouseRestMenuLines,
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
        descriptionLines: getHomeHouseContentDefaults().homeHouseMainLines,
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
        overlay: createAlertOverlay(
          "当前状态",
          createStatusParagraphs(
            ensuredState,
            input.characterDefinitions,
            input.playerCharacterId
          )
        ),
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

    return createHomeRestAutoAdvanceResult(
      input,
      sessionState,
      summary,
      input.request.actionId === "end-day" ? "今日已过" : "静养一日",
      ensuredState
    );
  }

  if (input.request.actionId === "rest-until-council") {
    const summary = runRestPlan(
      ensuredState,
      input.characterDefinitions,
      input.playerCharacterId,
      (state) => !hasReachedCouncilDate(state)
    );

    return createHomeRestAutoAdvanceResult(
      input,
      sessionState,
      summary,
      "休息到评定日",
      ensuredState
    );
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

    return createHomeRestAutoAdvanceResult(
      input,
      sessionState,
      summary,
      "休息到恢复体力",
      ensuredState
    );
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
          overlay: createAlertOverlay(
            "休息天数无效",
            ["请输入 1 到 99 之间的天数。"],
            "warning"
          ),
        }
      );
    }

    const days = clamp(
      parsedDays,
      1,
      getHomeHouseContentDefaults().homeHouseRecoveryTuning.customRestMaxDays
    );
    const summary = runRestPlan(
      ensuredState,
      input.characterDefinitions,
      input.playerCharacterId,
      (_state, _characterDefinitions, daysRested) => daysRested < days
    );

    return createHomeRestAutoAdvanceResult(
      input,
      sessionState,
      summary,
      `静养 ${days} 日`,
      ensuredState
    );
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
      sessionState: createInitialHomeHouseSessionState(
        "main",
        getHomeHouseContentDefaults().homeHouseIntroLines
      ),
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
      input.sessionState ??
      createInitialHomeHouseSessionState(
        "main",
        getHomeHouseContentDefaults().homeHouseIntroLines
      );
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
            value: getCouncilStatusText(ensuredState),
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
