import type { CharacterDefinition } from "../../domain/character";
import type { AppState } from "../../application/app-shell";

type SaveDataResult = {
  selectedCharacterId?: string | null;
} | null | void;

type MainUiFlowOptions = {
  overlayRoot: HTMLElement;
  characters: CharacterDefinition[];
  onStartGame(selectedCharacter: CharacterDefinition): void;
  onContinueGame?(
    selectedCharacter: CharacterDefinition,
    saveData: SaveDataResult
  ): void;
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
