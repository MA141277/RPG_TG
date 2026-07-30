import type { AppState } from "../app-shell";
import { resolveCityMenuEntries } from "../city-menu/city-menu";
import {
  isCityEntryVisibleForStoryStage,
  isHouseVisibleForStoryStage,
} from "../story/story-stage-access";
import type { CharacterDefinition } from "../../domain/character";
import type { CityDefinition } from "../../domain/city";
import type { CityEntryDefinition } from "../../domain/city-entry";
import type { CitySceneMapping } from "../../domain/city-scene-mapping";
import type { HouseDefinition } from "../../domain/house";
import type {
  MenuInstanceDefinition,
  MenuResourceDefinition,
} from "../../domain/menu";
import type { PlayableIntegrationDefinition } from "../../core/contracts/playable-runtime";
import type { AppPresenterStageOutput } from "../presenter/presenter-output";

export type CityModuleEntryInput = {
  appState: AppState;
  playerCharacter: CharacterDefinition;
  activeCityDefinition: CityDefinition;
  houseDefinitions: HouseDefinition[];
  cityEntries: CityEntryDefinition[];
  menuResourcesById: Record<string, MenuResourceDefinition>;
  menuInstancesById: Record<string, MenuInstanceDefinition>;
  playableIntegrationsByEditorRecordId?: Record<
    string,
    PlayableIntegrationDefinition
  > | undefined;
  playableIntegrationsById?: Record<
    string,
    PlayableIntegrationDefinition
  > | undefined;
  citySceneMapping: CitySceneMapping | null;
};

export type CityModuleStage = Extract<AppPresenterStageOutput, { type: "city" }>;
export type CityModuleUnderlay = NonNullable<
  Extract<AppPresenterStageOutput, { type: "dialogue" }>["cityUnderlay"]
>;

export function selectCityModuleUnderlay(
  input: CityModuleEntryInput
): CityModuleUnderlay {
  const activeCityEntries = input.cityEntries.filter(
    (cityEntry) =>
      cityEntry.cityId === input.activeCityDefinition.id &&
      isCityEntryVisibleForStoryStage(input.appState.gameState, cityEntry)
  );
  const cityEntryHouseIds = new Set(
    activeCityEntries.map((cityEntry) => cityEntry.targetHouseId)
  );
  const activeCityHouseDefinitions = input.houseDefinitions.filter(
    (houseDefinition) => {
      if (!cityEntryHouseIds.has(houseDefinition.id)) {
        return false;
      }

      return isHouseVisibleForStoryStage(
        input.appState.gameState,
        input.appState.characterDefinitions,
        houseDefinition
      );
    }
  );

  return {
    activeCityDefinition: input.activeCityDefinition,
    activeCityHouseDefinitions,
    activeCityEntries,
    activeCityMenuEntries: resolveCityMenuEntries({
      cityDefinition: input.activeCityDefinition,
      playerCharacter: input.playerCharacter,
      menuResourcesById: input.menuResourcesById,
      menuInstancesById: input.menuInstancesById,
      playableIntegrationsByEditorRecordId:
        input.playableIntegrationsByEditorRecordId,
      playableIntegrationsById: input.playableIntegrationsById,
    }),
    citySceneMapping: input.citySceneMapping,
  };
}

export function selectCityModuleStage(
  input: CityModuleEntryInput
): CityModuleStage {
  return {
    type: "city",
    ...selectCityModuleUnderlay(input),
  };
}
