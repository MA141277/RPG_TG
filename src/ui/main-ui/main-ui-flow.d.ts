import type { CharacterDefinition } from "../../domain/character";

type SaveDataResult = {
  selectedCharacterId?: string | null;
} | null | void;

type MainUiFlowOptions = {
  overlayRoot: HTMLElement;
  characters: CharacterDefinition[];
  onStartGame(selectedCharacter: CharacterDefinition): void;
  loadSaveData(): Promise<SaveDataResult> | SaveDataResult;
};

export class MainUiFlow {
  constructor(options: MainUiFlowOptions);
  mount(): void;
  destroy(): void;
  showMainMenu(): void;
  hide(): void;
}
