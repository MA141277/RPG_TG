import type { AppState } from "../app-shell";
import type { BuildingArrangementDefinition } from "../../domain/building-arrangement";
import type { BuildingStatusById } from "../../domain/building-status";
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
import type { CityDefinition } from "../../domain/city";
import type { CityStatusById } from "../../domain/city-status";
import type {
  EventBinding,
  EventDefinition,
} from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { HouseDefinition } from "../../domain/house";
import type { HouseModuleTransitionResult } from "../../domain/house-module";
import type {
  ProgressTrackBinding,
  ProgressTrackDefinition,
} from "../../core/contracts/progression-runtime";
import type { RuntimeFollowUpOutcome } from "../../core/contracts/runtime-result";
import type { RuntimeState } from "../../core/contracts/runtime-state";
import { matchesCanonicalBuildingOwnerId } from "../../core/runtime/building-owner-canonicalization";
import {
  buildStoryTriggerInput,
  triggerStoryEvents,
} from "../story/story-runtime";
import {
  applyStoryRuntimeResultToAppState,
  createStoryRuntimeDefinitionContext,
} from "../story/story-runtime-state-bridge";
import type { StorySettlementDefinition } from "../story/story-settlement-continuation";

export type NavigationTimeFollowUpStoryContent = {
  eventDefinitionsById: Record<string, EventDefinition>;
  sceneDefinitionsById: Record<string, SceneDefinition>;
  activityDefinitionsById?: Record<string, ActivityDefinition>;
  eventBindingsById?: Record<string, EventBinding>;
  settlementDefinitionsById?: Record<
    string,
    StorySettlementDefinition | undefined
  >;
  progressTrackDefinitionsById?: Record<string, ProgressTrackDefinition>;
  progressTrackBindingsById?: Record<string, ProgressTrackBinding>;
  cityDefinitionsById?: Record<string, CityDefinition>;
  houseDefinitionsById?: Record<string, HouseDefinition>;
  textEntriesById?: Record<string, string>;
};

export type NavigationTimeFollowUpAppState = AppState & {
  cityStatusById?: CityStatusById;
  buildingStatusById?: BuildingStatusById;
};

export type NavigationTimeFollowUpDependencies = {
  getCharacterDefinitions(): CharacterDefinition[];
  getHouseDefinitions(): HouseDefinition[];
  getStoryContent(): NavigationTimeFollowUpStoryContent;
  getAppState?(): NavigationTimeFollowUpAppState;
};

export type NavigationTimeFollowUpResult = {
  state: RuntimeState;
  characterDefinitions?: CharacterDefinition[];
  cityStatusById?: CityStatusById;
  buildingStatusById?: BuildingStatusById;
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
        const characterDefinitions = dependencies.getCharacterDefinitions();
        const storyContent = dependencies.getStoryContent();
        const runtimeBridgeState = createNavigationTimeFollowUpAppState({
          runtimeState: input.state,
          appState: dependencies.getAppState?.(),
          characterDefinitions,
        });
        const runtimeDefinitionContext = createStoryRuntimeDefinitionContext(
          runtimeBridgeState,
          storyContent
        );
        const result = triggerStoryEvents(
          {
            state: input.state.core,
            characterDefinitions,
            ...runtimeDefinitionContext,
          },
          {
            eventDefinitionsById: storyContent.eventDefinitionsById,
            sceneDefinitionsById: storyContent.sceneDefinitionsById,
            eventBindingsById: storyContent.eventBindingsById,
            activityDefinitionsById: storyContent.activityDefinitionsById,
            settlementDefinitionsById: storyContent.settlementDefinitionsById,
            progressTrackDefinitionsById:
              storyContent.progressTrackDefinitionsById,
            progressTrackBindingsById: storyContent.progressTrackBindingsById,
            cityDefinitionsById: storyContent.cityDefinitionsById,
            houseDefinitionsById: storyContent.houseDefinitionsById,
            textEntriesById: storyContent.textEntriesById,
          },
          buildStoryTriggerInput("city-enter", input.state.core)
        );
        const nextAppState = applyStoryRuntimeResultToAppState(
          runtimeBridgeState,
          storyContent,
          result
        );

        return {
          handled: true,
          state: {
            ...input.state,
            core: nextAppState.gameState,
            app: {
              beggingMiniGameState: nextAppState.beggingMiniGameState,
              autoAdvanceState: nextAppState.autoAdvanceState,
              campaignTravelState: nextAppState.campaignTravelState,
              cityDirectoryState: nextAppState.cityDirectoryState,
              cityMenuState: nextAppState.cityMenuState,
              locationDialogueState: nextAppState.locationDialogueState,
              modalState: nextAppState.modalState,
            },
          },
          characterDefinitions: nextAppState.characterDefinitions,
          ...(nextAppState.cityStatusById == null
            ? {}
            : { cityStatusById: nextAppState.cityStatusById }),
          ...(nextAppState.buildingStatusById == null
            ? {}
            : { buildingStatusById: nextAppState.buildingStatusById }),
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

function createNavigationTimeFollowUpAppState(input: {
  runtimeState: RuntimeState;
  appState: NavigationTimeFollowUpAppState | undefined;
  characterDefinitions: CharacterDefinition[];
}): NavigationTimeFollowUpAppState {
  if (input.appState == null) {
    throw new Error(
      "Navigation time follow-up requires app state context for city-enter story projection."
    );
  }

  return {
    ...input.appState,
    gameState: input.runtimeState.core,
    characterDefinitions: input.characterDefinitions,
    beggingMiniGameState: input.runtimeState.app.beggingMiniGameState,
    autoAdvanceState: input.runtimeState.app.autoAdvanceState,
    campaignTravelState: input.runtimeState.app.campaignTravelState,
    cityDirectoryState: input.runtimeState.app.cityDirectoryState,
    cityMenuState: input.runtimeState.app.cityMenuState,
    locationDialogueState: input.runtimeState.app.locationDialogueState,
    modalState: input.runtimeState.app.modalState,
  };
}

export function applyCouncilPriorityFollowUp(input: {
  previousGameState?: GameState;
  state: RuntimeState;
  houseDefinitions: HouseDefinition[];
  buildingArrangements?: readonly BuildingArrangementDefinition[];
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

  const priorityHouse = resolveCouncilPriorityHouseDefinition(
    input.state.core,
    input.houseDefinitions,
    input.buildingArrangements
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
          ...(input.buildingArrangements == null
            ? {}
            : { buildingArrangements: input.buildingArrangements }),
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

export function resolveCouncilPriorityHouseDefinition(
  gameState: GameState,
  houseDefinitions: HouseDefinition[],
  buildingArrangements?: readonly BuildingArrangementDefinition[]
): HouseDefinition | null {
  const priorityModuleId = getCouncilPriorityHouseModuleId(gameState);
  const currentCityId = gameState.world.currentCityId;

  const priorityHouse =
    houseDefinitions.find(
      (houseDefinition) =>
        houseDefinition.moduleId === priorityModuleId &&
        houseDefinition.cityId === currentCityId
    ) ??
    houseDefinitions.find(
      (houseDefinition) => houseDefinition.moduleId === priorityModuleId
    ) ??
    null;
  if (priorityHouse == null) {
    return null;
  }

  if (currentCityId == null) {
    return priorityHouse;
  }

  const cityScopedArrangement =
    buildingArrangements?.find(
      (arrangement) =>
        arrangement.cityId === currentCityId &&
        matchesCanonicalBuildingOwnerId(arrangement.buildingId, priorityHouse.id)
    ) ?? null;
  if (cityScopedArrangement?.primaryNpcId == null) {
    return priorityHouse.cityId === currentCityId
      ? priorityHouse
      : { ...priorityHouse, cityId: currentCityId };
  }

  return {
    ...priorityHouse,
    cityId: currentCityId,
    defaultCharacterId: cityScopedArrangement.primaryNpcId,
  };
}

function createCouncilArrivalDialogue(input: {
  gameState: GameState;
  houseDefinitions: HouseDefinition[];
  buildingArrangements?: readonly BuildingArrangementDefinition[];
  textEntriesById: Record<string, string>;
  councilArrivalNotice?: HouseModuleTransitionResult["councilArrivalNotice"];
}): NonNullable<AppState["locationDialogueState"]> | null {
  const priorityHouse = resolveCouncilPriorityHouseDefinition(
    input.gameState,
    input.houseDefinitions,
    input.buildingArrangements
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
