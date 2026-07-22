import { ensureCityNpcPoolsForCurrentDay } from "../city-npcs/refresh-city-npc-pools";
import type { ActiveGameContentContext } from "../content/active-game-content";
import { resolveTextEntry } from "../content/text-resolution";
import type { AppState } from "../app-shell";
import { createInitialState } from "../state/create-initial-state";
import { formatCouncilStatusText } from "../time/time-progression";
import { KEEP_HOUSE_VARIABLE_KEYS } from "../../domain/keep-house";
import {
  ZHU_YUANZHANG_STORY_FLAG_KEYS,
  ZHU_YUANZHANG_STORY_STAGES,
  ZHU_YUANZHANG_STORY_VARIABLE_KEYS,
  type ZhuYuanzhangStoryStage,
} from "../../domain/zhu-yuanzhang-story";
import { assertExists } from "../../shared/assert";

type PrototypeStartupAppStateBuilderDependencies = {
  getActiveContentContext(): ActiveGameContentContext;
  defaultPlayerCharacterId: string;
  createDefaultUiLayoutAppState(): Pick<AppState, "uiLayouts">;
  createPrototypeCharactersForStoryStage(
    storyStage: ZhuYuanzhangStoryStage
  ): AppState["characterDefinitions"];
};

export function createPrototypeStartupAppStateBuilder(
  dependencies: PrototypeStartupAppStateBuilderDependencies
) {
  function getRuntimeText(textId: string, fallback?: string): string {
    return resolveTextEntry(
      dependencies.getActiveContentContext().textEntriesById,
      textId,
      fallback
    );
  }

  function createPrototypeAppState(playerCharacterId: string): AppState {
    const activeContentContext = dependencies.getActiveContentContext();
    const defaultMapDefinition =
      activeContentContext.mapDefinitionById["map.yuanmo_campaign"] ??
      activeContentContext.maps[0];
    const defaultCityDefinition =
      activeContentContext.cityDefinitionById["city.kulan"] ??
      activeContentContext.cities[0];
    assertExists(defaultMapDefinition, "Missing default map definition.");
    assertExists(defaultCityDefinition, "Missing default city definition.");

    const storyStage: ZhuYuanzhangStoryStage =
      playerCharacterId === dependencies.defaultPlayerCharacterId
        ? ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
        : ZHU_YUANZHANG_STORY_STAGES.guoZixingCamp;

    let nextAppState: AppState = {
      gameState: ensureCityNpcPoolsForCurrentDay(
        createInitialState({
          currentMapId: defaultMapDefinition.id,
          currentCityId: defaultCityDefinition.id,
          currentHouseId: null,
          playerCharacterId,
          chapterId: "chapter.prototype",
          year: 1567,
          month: 1,
          day: 1,
          pinnedCharacterId: playerCharacterId,
          reviewDateText: formatCouncilStatusText(40),
          mainHouseMissionText: getRuntimeText(
            "runtime.zhu_yuanzhang.prototype.main_mission.review_hall"
          ),
          cards: {
            ownedCardIds: activeContentContext.cards.map(
              (cardDefinition) => cardDefinition.id
            ),
            selectedCardId: activeContentContext.cards[0]?.id ?? null,
          },
          valuables: {
            items: activeContentContext.gameContent.valuables,
            selectedItemId:
              activeContentContext.gameContent.valuables[0]?.id ?? null,
            equippedWeaponSet: {
              swordId:
                activeContentContext.gameContent.valuables.find(
                  (valuableDefinition) =>
                    valuableDefinition.category === "weapon"
                )?.id ?? null,
              armorId:
                activeContentContext.gameContent.valuables.find(
                  (valuableDefinition) =>
                    valuableDefinition.category === "armor"
                )?.id ?? null,
            },
          },
          currentView: "map",
        }),
        activeContentContext.cityNpcPools
      ),
      characterDefinitions:
        dependencies.createPrototypeCharactersForStoryStage(storyStage),
      playerCoordinate:
        defaultMapDefinition.initialPlayerCoordinate ?? { x: 0, y: 0 },
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
      ...dependencies.createDefaultUiLayoutAppState(),
    };

    nextAppState = {
      ...nextAppState,
      gameState: {
        ...nextAppState.gameState,
        ui: {
          ...nextAppState.gameState.ui,
          reviewDateText:
            storyStage === ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
              ? formatCouncilStatusText(0)
              : nextAppState.gameState.ui.reviewDateText,
          mainHouseMissionText:
            storyStage === ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
              ? getRuntimeText(
                  "runtime.zhu_yuanzhang.prototype.main_mission.temple_review"
                )
              : nextAppState.gameState.ui.mainHouseMissionText,
        },
        runtime: {
          ...nextAppState.gameState.runtime,
          variables: {
            ...nextAppState.gameState.runtime.variables,
            [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 0,
            [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage]: storyStage,
          },
        },
      },
    };

    return nextAppState;
  }

  function createHaozhouReturnEncounterAppState(baseState: AppState): AppState {
    return {
      ...baseState,
      gameState: {
        ...baseState.gameState,
        world: {
          ...baseState.gameState.world,
          currentCityId: "city.kulan",
          currentHouseId: null,
        },
        ui: {
          ...baseState.gameState.ui,
          currentView: "city",
          overlayView: null,
          houseSession: null,
          mainHouseMissionText: getRuntimeText(
            "runtime.zhu_yuanzhang.main_mission.haozhou_return"
          ),
        },
        runtime: {
          ...baseState.gameState.runtime,
          flags: {
            ...baseState.gameState.runtime.flags,
            [ZHU_YUANZHANG_STORY_FLAG_KEYS.ordinationCompleted]: true,
            [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted]: true,
            [ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked]: true,
            [ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked]: true,
            [ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingTransitionAssigned]: true,
            [ZHU_YUANZHANG_STORY_FLAG_KEYS.banditBattleCompleted]: true,
            [ZHU_YUANZHANG_STORY_FLAG_KEYS.banditBattleWon]: true,
            [ZHU_YUANZHANG_STORY_FLAG_KEYS.sundeyaRescueBattleCompleted]: false,
            [ZHU_YUANZHANG_STORY_FLAG_KEYS.sundeyaRescueBattleWon]: false,
          },
          variables: {
            ...baseState.gameState.runtime.variables,
            [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 0,
            [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage]:
              ZHU_YUANZHANG_STORY_STAGES.huangjueBeggingJourney,
            [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeWeek]: 4,
            [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution]: 30,
            [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.lastBattleId]:
              "story.zhu_yuanzhang.week4.roadside-bandits",
            [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.lastBattleResult]: "victory",
          },
        },
      },
      characterDefinitions:
        dependencies.createPrototypeCharactersForStoryStage(
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

  return {
    createPrototypeAppState,
    createHaozhouReturnEncounterAppState,
  };
}
