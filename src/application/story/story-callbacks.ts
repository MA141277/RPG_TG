import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import { KEEP_HOUSE_VARIABLE_KEYS } from "../../domain/keep-house";
import { TEMPLE_HOUSE_VARIABLE_KEYS } from "../../domain/temple-house";
import {
  ZHU_YUANZHANG_STORY_STAGES,
  ZHU_YUANZHANG_STORY_VARIABLE_KEYS,
} from "../../domain/zhu-yuanzhang-story";
import {
  addDaysToCalendarDate,
  formatCouncilStatusText,
} from "../time/time-progression";
import {
  createSundeyaRescueBattleSession,
  startStoryBattle,
} from "../story-battle/story-battle-runtime";
import { resolveTextEntry } from "../content/text-resolution";

type StoryCallbackPayload = Record<string, unknown> | undefined;

export type StoryCallbackRuntime = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  textEntriesById?: Record<string, string> | undefined;
};

function getStoryCallbackText(
  runtime: StoryCallbackRuntime,
  textId: string | undefined,
  fallback?: string
): string {
  return resolveTextEntry(runtime.textEntriesById ?? {}, textId, fallback);
}

function readStringPayloadValue(
  payload: StoryCallbackPayload,
  key: string
): string | null {
  const value = payload?.[key];
  return typeof value === "string" ? value : null;
}

function readBooleanPayloadValue(
  payload: StoryCallbackPayload,
  key: string
): boolean | null {
  const value = payload?.[key];
  return typeof value === "boolean" ? value : null;
}

function runPlaceholderBattleCallback(
  runtime: StoryCallbackRuntime,
  payload: StoryCallbackPayload
): StoryCallbackRuntime {
  // Reserve a stable hook for future battle integration; the story currently
  // auto-resolves to a scripted result so downstream scenes remain testable.
  const battleId = readStringPayloadValue(payload, "battleId") ?? "story.placeholder";
  const result = readStringPayloadValue(payload, "result") ?? "victory";
  const completedFlagKey = readStringPayloadValue(payload, "completedFlagKey");
  const winFlagKey = readStringPayloadValue(payload, "winFlagKey");
  const battleIdVariableKey = readStringPayloadValue(payload, "battleIdVariableKey");
  const resultVariableKey = readStringPayloadValue(payload, "resultVariableKey");
  const didWin = result === "victory";

  return {
    state: {
      ...runtime.state,
      runtime: {
        ...runtime.state.runtime,
        flags: {
          ...runtime.state.runtime.flags,
          ...(completedFlagKey == null ? {} : { [completedFlagKey]: true }),
          ...(winFlagKey == null ? {} : { [winFlagKey]: didWin }),
        },
        variables: {
          ...runtime.state.runtime.variables,
          ...(battleIdVariableKey == null ? {} : { [battleIdVariableKey]: battleId }),
          ...(resultVariableKey == null ? {} : { [resultVariableKey]: result }),
        },
      },
    },
    characterDefinitions: runtime.characterDefinitions,
  };
}

function runJoinGuoZixingCampCallback(
  runtime: StoryCallbackRuntime
): StoryCallbackRuntime {
  const nextCouncilDate = addDaysToCalendarDate(runtime.state.calendar, 60);

  return {
    state: {
      ...runtime.state,
      world: {
        ...runtime.state.world,
        currentHouseId: null,
        schedule: {
          councilDate: nextCouncilDate,
        },
      },
      missions: {
        ...runtime.state.missions,
        activeMissionId: null,
      },
      ui: {
        ...runtime.state.ui,
        activeMissionId: null,
        reviewDateText: formatCouncilStatusText(60),
        mainHouseMissionText: getStoryCallbackText(
          runtime,
          "runtime.zhu_yuanzhang.main_mission.guo_zixing_keep"
        ),
      },
      runtime: {
        ...runtime.state.runtime,
        variables: {
          ...runtime.state.runtime.variables,
          [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage]:
            ZHU_YUANZHANG_STORY_STAGES.guoZixingCamp,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 60,
          [TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan]: "",
          [TEMPLE_HOUSE_VARIABLE_KEYS.lastAssignedTaskId]: "",
          [TEMPLE_HOUSE_VARIABLE_KEYS.beggingSubmittedFood]: 0,
          [TEMPLE_HOUSE_VARIABLE_KEYS.beggingLastGrade]: "",
        },
      },
    },
    characterDefinitions: runtime.characterDefinitions.map((characterDefinition) =>
      characterDefinition.id !== runtime.state.player.characterId
        ? characterDefinition
        : {
            ...characterDefinition,
            title: getStoryCallbackText(
              runtime,
              "runtime.zhu_yuanzhang.player.title.guo_zixing_camp"
            ),
            occupation: getStoryCallbackText(
              runtime,
              "runtime.zhu_yuanzhang.player.occupation.guo_zixing_camp"
            ),
            affiliationLabel: getStoryCallbackText(
              runtime,
              "runtime.zhu_yuanzhang.player.affiliation.guo_zixing_camp"
            ),
            clanId: "clan.guo",
            houseId: "house.kulan.keep",
            biography: getStoryCallbackText(
              runtime,
              "runtime.zhu_yuanzhang.player.biography.guo_zixing_camp"
            ),
          }
    ),
  };
}

function runStartSundeyaRescueBattleCallback(
  runtime: StoryCallbackRuntime,
  payload: StoryCallbackPayload
): StoryCallbackRuntime {
  const completedFlagKey = readStringPayloadValue(payload, "completedFlagKey");
  const winFlagKey = readStringPayloadValue(payload, "winFlagKey");
  const battleIdVariableKey = readStringPayloadValue(payload, "battleIdVariableKey");
  const resultVariableKey = readStringPayloadValue(payload, "resultVariableKey");

  if (
    completedFlagKey == null ||
    winFlagKey == null ||
    battleIdVariableKey == null ||
    resultVariableKey == null
  ) {
    return runtime;
  }

  return {
    state: startStoryBattle(
      runtime.state,
      createSundeyaRescueBattleSession({
        completedFlagKey,
        winFlagKey,
        battleIdVariableKey,
        resultVariableKey,
        enterHouseId: "house.kulan.keep",
        mainMissionText: getStoryCallbackText(
          runtime,
          "runtime.zhu_yuanzhang.main_mission.sundeya_battle_review"
        ),
      }, {
        textEntriesById: runtime.textEntriesById,
      })
    ),
    characterDefinitions: runtime.characterDefinitions,
  };
}

export function runStoryCallback(
  handlerId: string,
  payload: StoryCallbackPayload,
  runtime: StoryCallbackRuntime
): StoryCallbackRuntime {
  switch (handlerId) {
    case "story.placeholder-battle":
      return runPlaceholderBattleCallback(runtime, payload);
    case "story.zhu_yuanzhang.join-guo-zixing-camp":
      return runJoinGuoZixingCampCallback(runtime);
    case "story.zhu_yuanzhang.start-sundeya-rescue-battle":
      return runStartSundeyaRescueBattleCallback(runtime, payload);
    default:
      return runtime;
  }
}
