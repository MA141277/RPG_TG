import type { AppState } from "../app-shell";
import {
  resolveTextEntry,
  resolveTextTemplateEntry,
} from "../content/text-resolution";
import {
  getCouncilPriorityHouseModuleId,
  hasReachedCouncilDate,
} from "../time/council-priority";
import type { ActivityDefinition } from "../../domain/activity";
import type { SceneDefinition } from "../../domain/action";
import type { CharacterDefinition } from "../../domain/character";
import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { HouseDefinition } from "../../domain/house";
import type { HouseModuleTransitionResult } from "../../domain/house-module";
import type { RuntimeFollowUpOutcome } from "../../core/contracts/runtime-result";
import type { RuntimeState } from "../../core/contracts/runtime-state";
import { runStoryTriggerRuntime } from "../../core/runtime/scene-runtime";

export type NavigationTimeFollowUpStoryContent = {
  eventDefinitionsById: Record<string, EventDefinition>;
  sceneDefinitionsById: Record<string, SceneDefinition>;
  activityDefinitionsById?: Record<string, ActivityDefinition>;
  textEntriesById?: Record<string, string>;
};

export type NavigationTimeFollowUpDependencies = {
  getCharacterDefinitions(): CharacterDefinition[];
  getHouseDefinitions(): HouseDefinition[];
  getStoryContent(): NavigationTimeFollowUpStoryContent;
};

export type NavigationTimeFollowUpResult = {
  state: RuntimeState;
  characterDefinitions?: CharacterDefinition[];
  handled: boolean;
};

export type NavigationTimeFollowUpBridge = {
  applyOutcome(input: {
    state: RuntimeState;
    outcome: RuntimeFollowUpOutcome;
  }): NavigationTimeFollowUpResult;
};

export function createNavigationTimeFollowUpBridge(
  dependencies: NavigationTimeFollowUpDependencies
): NavigationTimeFollowUpBridge {
  return {
    applyOutcome(input) {
      if (input.outcome.type === "navigation.entered-city") {
        const storyContent = dependencies.getStoryContent();
        const result = runStoryTriggerRuntime({
          timing: "city-enter",
          state: input.state.core,
          characterDefinitions: dependencies.getCharacterDefinitions(),
          eventDefinitionsById: storyContent.eventDefinitionsById,
          sceneDefinitionsById: storyContent.sceneDefinitionsById,
          ...(storyContent.activityDefinitionsById == null
            ? {}
            : { activityDefinitionsById: storyContent.activityDefinitionsById }),
          ...(storyContent.textEntriesById == null
            ? {}
            : { textEntriesById: storyContent.textEntriesById }),
        });

        return {
          handled: true,
          state: {
            ...input.state,
            core: result.state,
          },
          characterDefinitions: result.characterDefinitions,
        };
      }

      if (input.outcome.type === "time.council-threshold-crossed") {
        return applyCouncilPriorityFollowUp({
          state: input.state,
          houseDefinitions: dependencies.getHouseDefinitions(),
          textEntriesById:
            dependencies.getStoryContent().textEntriesById ?? {},
        });
      }

      if (input.outcome.type === "time.advanced") {
        return {
          handled: false,
          state: input.state,
        };
      }

      return {
        handled: false,
        state: input.state,
      };
    },
  };
}

export function applyCouncilPriorityFollowUp(input: {
  previousGameState?: GameState;
  state: RuntimeState;
  houseDefinitions: HouseDefinition[];
  textEntriesById: Record<string, string>;
  councilArrivalNotice?: HouseModuleTransitionResult["councilArrivalNotice"];
}): NavigationTimeFollowUpResult {
  if (
    input.previousGameState != null &&
    (hasReachedCouncilDate(input.previousGameState) ||
      !hasReachedCouncilDate(input.state.core))
  ) {
    return {
      handled: false,
      state: input.state,
    };
  }

  const priorityHouse = getCouncilPriorityHouseDefinition(
    input.state.core,
    input.houseDefinitions
  );
  if (priorityHouse == null) {
    return {
      handled: false,
      state: input.state,
    };
  }

  return {
    handled: true,
    state: {
      ...input.state,
      app: {
        ...input.state.app,
        modalState: null,
        locationDialogueState: createCouncilArrivalDialogue({
          gameState: input.state.core,
          houseDefinitions: input.houseDefinitions,
          textEntriesById: input.textEntriesById,
          councilArrivalNotice: input.councilArrivalNotice,
        }),
        beggingMiniGameState: null,
        cityMenuState: null,
        cityDirectoryState: null,
        autoAdvanceState: null,
        campaignTravelState: null,
      },
    },
  };
}

function getCouncilPriorityHouseDefinition(
  gameState: GameState,
  houseDefinitions: HouseDefinition[]
): HouseDefinition | null {
  const priorityModuleId = getCouncilPriorityHouseModuleId(gameState);
  const currentCityId = gameState.world.currentCityId;

  return (
    houseDefinitions.find(
      (houseDefinition) =>
        houseDefinition.moduleId === priorityModuleId &&
        houseDefinition.cityId === currentCityId
    ) ??
    houseDefinitions.find(
      (houseDefinition) => houseDefinition.moduleId === priorityModuleId
    ) ??
    null
  );
}

function createCouncilArrivalDialogue(input: {
  gameState: GameState;
  houseDefinitions: HouseDefinition[];
  textEntriesById: Record<string, string>;
  councilArrivalNotice?: HouseModuleTransitionResult["councilArrivalNotice"];
}): NonNullable<AppState["locationDialogueState"]> | null {
  const priorityHouse = getCouncilPriorityHouseDefinition(
    input.gameState,
    input.houseDefinitions
  );
  if (priorityHouse == null) {
    return null;
  }

  const isTempleReview = priorityHouse.moduleId === "temple-house";
  const defaultSpeakerCharacterId =
    priorityHouse.defaultCharacterId ??
    (isTempleReview ? "char.kulan_temple_abbot" : "char.kulan_guard");
  const defaultTextLines = isTempleReview
    ? [
        resolveTextTemplateEntry(
          input.textEntriesById,
          "runtime.zhu_yuanzhang.council_arrival.temple.001",
          { targetHouseName: priorityHouse.name }
        ),
        resolveTextEntry(
          input.textEntriesById,
          "runtime.zhu_yuanzhang.council_arrival.temple.002"
        ),
      ]
    : [
        resolveTextTemplateEntry(
          input.textEntriesById,
          "runtime.zhu_yuanzhang.council_arrival.keep.001",
          { targetHouseName: priorityHouse.name }
        ),
        resolveTextEntry(
          input.textEntriesById,
          "runtime.zhu_yuanzhang.council_arrival.keep.002"
        ),
      ];

  return {
    type: "council-arrival-reminder",
    speakerCharacterId:
      input.councilArrivalNotice?.speakerCharacterId ??
      defaultSpeakerCharacterId,
    textLines: [
      ...defaultTextLines,
      ...(input.councilArrivalNotice?.textLines ?? []),
    ],
    advanceHintText:
      input.councilArrivalNotice?.advanceHintText ?? "\u77e5\u9053\u4e86",
    targetHouseId: priorityHouse.id,
  };
}
