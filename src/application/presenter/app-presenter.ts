import type { AppState } from "../app-shell";
import type { SceneDefinition } from "../../domain/action";
import type { RuntimeDialogueDefinition } from "../../domain/dialogue";
import type { CityDefinition } from "../../domain/city";
import type { CityEntryDefinition } from "../../domain/city-entry";
import type { CityNpcPoolDefinition } from "../../domain/city-npc";
import type { CitySceneMapping } from "../../domain/city-scene-mapping";
import type { HouseDefinition } from "../../domain/house";
import type { HouseModuleRegistry } from "../../core/registry/house-module-registry";
import { createOverlayPresenterOutput } from "./overlay-presenters";
import type { AppPresenterOutput } from "./presenter-output";
import { createStagePresenterOutput } from "./stage-presenters";

export type AppPresenterInput = {
  appState: AppState;
  cityDefinition: CityDefinition;
  cityDefinitions?: CityDefinition[];
  houseDefinitions: HouseDefinition[];
  cityEntries: CityEntryDefinition[];
  cityNpcPoolDefinitions: CityNpcPoolDefinition[];
  playerCharacterId: string;
  cityNameById: Record<string, string>;
  textEntriesById?: Record<string, string>;
  citySceneMappingsByCityId?: Record<string, CitySceneMapping>;
  sceneDefinitionsById?: Record<string, SceneDefinition>;
  dialogueDefinitionsById?: Record<string, RuntimeDialogueDefinition>;
  houseModuleRegistry?: HouseModuleRegistry;
};

export function createAppPresenterOutput(
  input: AppPresenterInput
): AppPresenterOutput {
  const output: AppPresenterOutput = {
    stage: createStagePresenterOutput(input),
    overlay: createOverlayPresenterOutput(input),
  };

  if (input.sceneDefinitionsById != null) {
    output.sceneDefinitionsById = input.sceneDefinitionsById;
  }

  return output;
}
