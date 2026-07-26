import type { CharacterDefinition } from "../../../domain/character";
import type { CityModuleStage } from "../../../application/city/city-module-entry";
import type { AppState } from "../../../application/app-shell";
import type { CityMenuState } from "../../../application/city-menu/city-menu";
import type { CitySceneMapping } from "../../../domain/city-scene-mapping";
import { renderCityView } from "./city-view";

export function renderCityModuleView(input: {
  stage: CityModuleStage;
  playerCharacter: CharacterDefinition;
  cityMenuState: CityMenuState | null;
  cityDirectoryState: AppState["cityDirectoryState"];
  citySceneMapping: CitySceneMapping | null;
}): string {
  return renderCityView(
    input.stage.activeCityDefinition,
    input.playerCharacter,
    input.stage.activeCityHouseDefinitions,
    input.stage.activeCityEntries,
    input.stage.activeCityMenuEntries ?? [],
    input.cityMenuState,
    input.cityDirectoryState,
    input.citySceneMapping
  );
}
