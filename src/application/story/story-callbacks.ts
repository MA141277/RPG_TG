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
  launchStoryBattlePlayable,
} from "../playables/story-battle/story-battle-definition";
import { resolveTextEntry } from "../content/text-resolution";
import {
  resolveJoinGuoZixingCampStoryCallbackSeed,
  resolveSundeyaRescueBattleStoryCallbackSeed,
} from "./zhu-yuanzhang-story-callback-defaults";

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
  const seed = resolveJoinGuoZixingCampStoryCallbackSeed();
  const nextCouncilDate = addDaysToCalendarDate(
    runtime.state.calendar,
    seed.reviewCountdownDays
  );

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
        reviewDateText: formatCouncilStatusText(seed.reviewCountdownDays),
        mainHouseMissionText: getStoryCallbackText(
          runtime,
          seed.missionTextId
        ),
      },
      runtime: {
        ...runtime.state.runtime,
        variables: {
          ...runtime.state.runtime.variables,
          [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage]: seed.stage,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: seed.reviewCountdownDays,
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
              seed.titleTextId
            ),
            occupation: getStoryCallbackText(
              runtime,
              seed.occupationTextId
            ),
            affiliationLabel: getStoryCallbackText(
              runtime,
              seed.affiliationTextId
            ),
            clanId: seed.clanId,
            houseId: seed.houseId,
            biography: getStoryCallbackText(
              runtime,
              seed.biographyTextId
            ),
          }
    ),
  };
}

function runStartSundeyaRescueBattleCallback(
  runtime: StoryCallbackRuntime,
  payload: StoryCallbackPayload
): StoryCallbackRuntime {
  const seed = resolveSundeyaRescueBattleStoryCallbackSeed();
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
    state: launchStoryBattlePlayable({
      state: runtime.state,
      ownerId: runtime.state.scene.activeSceneId ?? "scene.unknown",
      completion: {
        completedFlagKey,
        winFlagKey,
        battleIdVariableKey,
        resultVariableKey,
        enterHouseId: seed.enterHouseId,
        mainMissionText: getStoryCallbackText(
          runtime,
          seed.mainMissionTextId
        ),
      },
      textEntriesById: runtime.textEntriesById,
    }),
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
