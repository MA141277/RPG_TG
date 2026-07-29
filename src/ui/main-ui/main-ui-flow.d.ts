import type { CharacterDefinition } from "../../domain/character";
import type { AppState } from "../../application/app-shell";
import type { ButtonSoundEffect } from "../../application/audio/button-sound";
import type { ScenarioPackSummary } from "../../domain/scenario-pack";

type SaveDataResult = {
  selectedCharacterId?: string | null;
} | null | void;

type MainUiFlowOptions = {
  overlayRoot: HTMLElement;
  characters: CharacterDefinition[];
  scenarioPacks?: ScenarioPackSummary[];
  onStartGame(selectedCharacter: CharacterDefinition): void;
  onContinueGame?(
    selectedCharacter: CharacterDefinition,
    saveData: SaveDataResult
  ): void;
  onStartScenarioPack?(scenarioPack: ScenarioPackSummary): void | Promise<void>;
  onImportScenarioPackFiles?(files: File[]): void | Promise<void>;
  onQueueButtonSound?(effect: ButtonSoundEffect): void;
  loadSaveData(): Promise<SaveDataResult> | SaveDataResult;
  getAppState(): AppState;
};

export class MainUiFlow {
  constructor(options: MainUiFlowOptions);
  mount(): void;
  destroy(): void;
  render(): void;
  showMainMenu(): void;
  hide(): void;
}
