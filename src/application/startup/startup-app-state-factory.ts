import type { AppState } from "../app-shell";
import type { ActiveGameContentContext } from "../content/active-game-content";
import { resolveTextEntry } from "../content/text-resolution";
import { ensureCityNpcPoolsForCurrentDay } from "../city-npcs/refresh-city-npc-pools";
import { revealCampaignMapHexesForCoordinate } from "../map/campaign-map-exploration";
import { revealCampaignMapAroundCoordinate } from "../navigation/campaign-map-exploration";
import { createInitialState } from "../state/create-initial-state";
import { formatCouncilStatusText } from "../time/time-progression";
import { createHaozhouReturnEncounterBattleState } from "./haozhou-return-battle-state";
import { resolvePrototypeStartupSeed } from "./prototype-startup-defaults";
import { applyStartupStoryBootstrap, type StartupStoryBootstrap } from "./startup-story-bootstrap";
import type { ScenarioPackDefinition } from "../../domain/scenario-pack";
import type { CharacterDefinition } from "../../domain/character";
import {
  resolveScenarioProfileStartupDefaults,
  resolveScenarioProfileStartupPresentation,
} from "../../domain/scenario-profile";
import { KEEP_HOUSE_VARIABLE_KEYS } from "../../domain/keep-house";
import {
  ZHU_YUANZHANG_STORY_STAGES,
  ZHU_YUANZHANG_STORY_VARIABLE_KEYS,
  type ZhuYuanzhangStoryStage,
} from "../../domain/zhu-yuanzhang-story";
import { createPrototypeCharactersForStoryStage } from "../../content/prototype-world";
import { assertExists } from "../../shared/assert";

export type StartupAppStateFactory = {
  bootstrapStartupStoryAppState(input: {
    appState: AppState;
    bootstrap: StartupStoryBootstrap | null;
  }): AppState;
  createPrototypeAppState(playerCharacterId: string): AppState;
  createScenarioPackAppState(scenarioPack: ScenarioPackDefinition): AppState;
  createHaozhouReturnEncounterAppState(baseState: AppState): AppState;
};

export function createStartupAppStateFactory(input: {
  getContentContext(): ActiveGameContentContext;
  defaultPlayerCharacterId: string;
  createDefaultUiLayouts(): AppState["uiLayouts"];
  createDefaultBattleUiValues(): AppState["layoutEditor"]["battleUiValues"];
}): StartupAppStateFactory {
  function getContentContext(): ActiveGameContentContext {
    return input.getContentContext();
  }

  function getRuntimeText(textId: string, fallback?: string): string {
    return resolveTextEntry(getContentContext().textEntriesById, textId, fallback);
  }

  function revealCampaignMapAroundStartupCoordinate(
    state: AppState,
    coordinate: AppState["playerCoordinate"],
    options?: {
      animateNewHexes?: boolean;
      revealedAtMs?: number;
    }
  ): AppState {
    const contentContext = getContentContext();
    const mapDefinition =
      contentContext.mapDefinitionById[state.gameState.world.currentMapId] ?? null;
    if (
      mapDefinition?.mode !== "campaign" ||
      mapDefinition.coordinateSpace == null
    ) {
      return state;
    }

    const nextGameState = revealCampaignMapAroundCoordinate({
      state: state.gameState,
      mapId: mapDefinition.id,
      coordinate,
      coordinateSpace: mapDefinition.coordinateSpace,
      ...(options?.animateNewHexes == null
        ? {}
        : { animateNewHexes: options.animateNewHexes }),
      ...(options?.revealedAtMs == null
        ? {}
        : { revealedAtMs: options.revealedAtMs }),
    });
    if (nextGameState === state.gameState) {
      return state;
    }

    return {
      ...state,
      gameState: nextGameState,
    };
  }

  function createBaseStartupAppState(baseInput: {
    gameState: AppState["gameState"];
    characterDefinitions: CharacterDefinition[];
    playerCoordinate: AppState["playerCoordinate"];
  }): AppState {
    return {
      gameState: baseInput.gameState,
      characterDefinitions: baseInput.characterDefinitions,
      playerCoordinate: baseInput.playerCoordinate,
      campaignActorState: {
        facingDegrees: 0,
        isMoving: false,
      },
      campaignTravelState: null,
      modalState: null,
      locationDialogueState: null,
      beggingMiniGameState: null,
      cityMenuState: null,
      cityDirectoryState: null,
      autoAdvanceState: null,
      uiLayouts: input.createDefaultUiLayouts(),
      layoutEditor: {
        isOpen: false,
        selectedTargetId: "global-hud",
        selectedComponentId: "status-board",
        selectedElementId: null,
        backgroundAssetQuery: "",
        battleUiValues: input.createDefaultBattleUiValues(),
      },
    };
  }

  function createPrototypeAppState(playerCharacterId: string): AppState {
    const contentContext = getContentContext();
    const defaultMapDefinition =
      contentContext.mapDefinitionById["map.yuanmo_campaign"] ??
      contentContext.maps[0];
    const defaultCityDefinition =
      contentContext.cityDefinitionById["city.kulan"] ??
      contentContext.cities[0];
    assertExists(defaultMapDefinition, "Missing default map definition.");
    assertExists(defaultCityDefinition, "Missing default city definition.");
    const startupSeed = resolvePrototypeStartupSeed({
      playerCharacterId,
      defaultPlayerCharacterId: input.defaultPlayerCharacterId,
      defaultMapId: defaultMapDefinition.id,
      defaultCityId: defaultCityDefinition.id,
    });
    const storyStage: ZhuYuanzhangStoryStage = startupSeed.storyStage;
    const storyCharacterDefinitions =
      createPrototypeCharactersForStoryStage(storyStage);
    let nextAppState = createBaseStartupAppState({
      gameState: ensureCityNpcPoolsForCurrentDay(
        createInitialState({
          currentMapId: startupSeed.currentMapId,
          currentCityId: startupSeed.currentCityId,
          currentHouseId: startupSeed.currentHouseId,
          playerCharacterId,
          chapterId: startupSeed.chapterId,
          year: startupSeed.calendar.year,
          month: startupSeed.calendar.month,
          day: startupSeed.calendar.day,
          pinnedCharacterId: playerCharacterId,
          reviewDateText: formatCouncilStatusText(
            startupSeed.reviewCountdownDaysForUi
          ),
          mainHouseMissionText: getRuntimeText(startupSeed.missionTextId),
          cards: {
            ownedCardIds: contentContext.cards.map(
              (cardDefinition) => cardDefinition.id
            ),
            selectedCardId: contentContext.cards[0]?.id ?? null,
          },
          valuables: {
            items: contentContext.gameContent.valuables,
            selectedItemId: contentContext.gameContent.valuables[0]?.id ?? null,
            equippedWeaponSet: {
              swordId:
                contentContext.gameContent.valuables.find(
                  (valuableDefinition) => valuableDefinition.category === "weapon"
                )?.id ?? null,
              armorId:
                contentContext.gameContent.valuables.find(
                  (valuableDefinition) => valuableDefinition.category === "armor"
                )?.id ?? null,
            },
          },
          currentView: startupSeed.currentView,
        }),
        contentContext.cityNpcPools
      ),
      characterDefinitions: storyCharacterDefinitions,
      playerCoordinate: defaultMapDefinition.initialPlayerCoordinate ?? { x: 0, y: 0 },
    });

    nextAppState = {
      ...nextAppState,
      gameState: revealCampaignMapHexesForCoordinate(
        nextAppState.gameState,
        defaultMapDefinition,
        nextAppState.playerCoordinate
      ),
    };

    nextAppState = {
      ...nextAppState,
      gameState: {
        ...nextAppState.gameState,
        runtime: {
          ...nextAppState.gameState.runtime,
          variables: {
            ...nextAppState.gameState.runtime.variables,
            [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]:
              startupSeed.runtimeReviewCountdown,
            [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage]: storyStage,
          },
        },
      },
    };

    return revealCampaignMapAroundStartupCoordinate(
      nextAppState,
      nextAppState.playerCoordinate,
      {
        animateNewHexes: false,
      }
    );
  }

  function createScenarioPackAppState(
    scenarioPack: ScenarioPackDefinition
  ): AppState {
    const contentContext = getContentContext();
    const profile = scenarioPack.scenarioProfile;
    const startupPresentation = resolveScenarioProfileStartupPresentation(profile);
    const scenarioMapDefinition =
      contentContext.mapDefinitionById[profile.initialLocation.mapId] ??
      contentContext.maps[0];
    assertExists(
      scenarioMapDefinition,
      `Missing scenario map "${profile.initialLocation.mapId}".`
    );
    const startupDefaults = resolveScenarioProfileStartupDefaults(profile, {
      fallbackMissionText: scenarioPack.title,
    });
    const playerCoordinate =
      profile.initialPlayerCoordinate ??
      contentContext.cityCoordinatesById[profile.initialLocation.cityId] ??
      scenarioMapDefinition.initialPlayerCoordinate ??
      { x: 0, y: 0 };

    let nextAppState = createBaseStartupAppState({
      gameState: ensureCityNpcPoolsForCurrentDay(
        createInitialState({
          currentMapId: profile.initialLocation.mapId,
          currentCityId: profile.initialLocation.cityId,
          currentHouseId: startupPresentation.currentHouseId,
          playerCharacterId: profile.playerCharacterId,
          chapterId: profile.chapterId,
          year: startupDefaults.calendar.year,
          month: startupDefaults.calendar.month,
          day: startupDefaults.calendar.day,
          pinnedCharacterId: profile.playerCharacterId,
          reviewDateText: startupDefaults.reviewDateText,
          mainHouseMissionText: startupDefaults.mainHouseMissionText,
          cards: {
            ownedCardIds: contentContext.cards.map(
              (cardDefinition) => cardDefinition.id
            ),
            selectedCardId: contentContext.cards[0]?.id ?? null,
          },
          valuables: {
            items: contentContext.gameContent.valuables,
            selectedItemId:
              contentContext.gameContent.valuables[0]?.id ?? null,
            equippedWeaponSet: {
              swordId:
                contentContext.gameContent.valuables.find(
                  (valuableDefinition) => valuableDefinition.category === "weapon"
                )?.id ?? null,
              armorId:
                contentContext.gameContent.valuables.find(
                  (valuableDefinition) => valuableDefinition.category === "armor"
                )?.id ?? null,
            },
          },
          currentView: startupPresentation.currentView,
        }),
        contentContext.cityNpcPools
      ),
      characterDefinitions: mergeCharacterDefinitions(
        contentContext.gameContent.characters,
        scenarioPack.characters ?? []
      ),
      playerCoordinate,
    });

    nextAppState = {
      ...nextAppState,
      gameState: revealCampaignMapHexesForCoordinate(
        nextAppState.gameState,
        scenarioMapDefinition,
        nextAppState.playerCoordinate
      ),
    };

    nextAppState = {
      ...nextAppState,
      gameState: {
        ...nextAppState.gameState,
        runtime: {
          ...nextAppState.gameState.runtime,
          flags: {
            ...nextAppState.gameState.runtime.flags,
            ...(profile.initialRuntime?.flags ?? {}),
          },
          variables: {
            ...nextAppState.gameState.runtime.variables,
            ...(profile.initialRuntime?.variables ?? {}),
          },
        },
      },
    };

    return revealCampaignMapAroundStartupCoordinate(
      nextAppState,
      nextAppState.playerCoordinate,
      {
        animateNewHexes: false,
      }
    );
  }

  function createHaozhouReturnEncounterAppState(baseState: AppState): AppState {
    const contentContext = getContentContext();
    return {
      ...baseState,
      gameState: createHaozhouReturnEncounterBattleState({
        state: baseState.gameState,
        textEntriesById: contentContext.textEntriesById,
      }),
      characterDefinitions: createPrototypeCharactersForStoryStage(
        ZHU_YUANZHANG_STORY_STAGES.huangjueBeggingJourney
      ),
      modalState: null,
      locationDialogueState: null,
      cityMenuState: null,
      cityDirectoryState: null,
      beggingMiniGameState: null,
      campaignTravelState: null,
    };
  }

  function bootstrapStartupStoryAppState(input: {
    appState: AppState;
    bootstrap: StartupStoryBootstrap | null;
  }): AppState {
    const contentContext = getContentContext();
    return applyStartupStoryBootstrap({
      appState: input.appState,
      bootstrap: input.bootstrap,
      content: {
        eventDefinitionsById: contentContext.storyContent.eventDefinitionsById,
        sceneDefinitionsById: contentContext.storyContent.sceneDefinitionsById,
        activityDefinitionsById:
          contentContext.storyContent.activityDefinitionsById,
        textEntriesById: contentContext.storyContent.textEntriesById,
      },
    });
  }

  return {
    bootstrapStartupStoryAppState,
    createPrototypeAppState,
    createScenarioPackAppState,
    createHaozhouReturnEncounterAppState,
  };
}

function mergeCharacterDefinitions(
  baseCharacters: CharacterDefinition[],
  scenarioCharacters: CharacterDefinition[]
): CharacterDefinition[] {
  const scenarioCharacterIds = new Set(
    scenarioCharacters.map((characterDefinition) => characterDefinition.id)
  );

  return [
    ...baseCharacters.filter(
      (characterDefinition) => !scenarioCharacterIds.has(characterDefinition.id)
    ),
    ...scenarioCharacters,
  ];
}
