import type { AppState } from "../app-shell";
import type { BuildingArrangementDefinition } from "../../domain/building-arrangement";
import type { CityDefinition } from "../../domain/city";
import type { CityEntryDefinition } from "../../domain/city-entry";
import type { CityNpcPoolDefinition } from "../../domain/city-npc";
import type { CitySceneMapping } from "../../domain/city-scene-mapping";
import type { RuntimeDialogueDefinition } from "../../domain/dialogue";
import type { HouseDefinition } from "../../domain/house";
import type {
  MenuInstanceDefinition,
  MenuResourceDefinition,
} from "../../domain/menu";
import type { PlayableIntegrationDefinition } from "../../core/contracts/playable-runtime";
import { createOverlayPresenterOutput } from "./overlay-presenters";
import type { AppPresenterOutput } from "./presenter-output";
import { createStagePresenterOutput } from "./stage-presenters";

export type AppPresenterInput = {
  appState: AppState;
  cityDefinition: CityDefinition;
  cityDefinitions?: CityDefinition[];
  houseDefinitions: HouseDefinition[];
  buildingArrangements?: BuildingArrangementDefinition[];
  cityEntries: CityEntryDefinition[];
  cityNpcPoolDefinitions: CityNpcPoolDefinition[];
  playerCharacterId: string;
  cityNameById: Record<string, string>;
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
  textEntriesById?: Record<string, string>;
  citySceneMappingsByCityId?: Record<string, CitySceneMapping>;
  dialogueDefinitionsById?: Record<string, RuntimeDialogueDefinition>;
};

export function createAppPresenterOutput(
  input: AppPresenterInput
): AppPresenterOutput {
  const output: AppPresenterOutput = {
    stage: createStagePresenterOutput(input),
    overlay: createOverlayPresenterOutput(input),
  };

  if (input.dialogueDefinitionsById != null) {
    output.dialogueDefinitionsById = input.dialogueDefinitionsById;
  }

  return output;
}
