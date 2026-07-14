import type { CharacterManager } from "../../../application/character/character-manager";
import type { HouseDefinition } from "../../../domain/house";

export type HouseViewModel = {
  title: string;
  defaultCharacterId: string | null;
  characterSummaries: Array<{
    id: string;
    name: string;
    title?: string;
  }>;
  backButtonLabel: string;
};

export function createHouseViewModel(
  houseDefinition: HouseDefinition,
  characterManager: CharacterManager,
  cityNpcSummaries: HouseViewModel["characterSummaries"] = []
): HouseViewModel {
  const fixedCharacterSummaries = characterManager
    .getHouseNpcCharacters(houseDefinition)
    .map((characterDefinition) => ({
      id: characterDefinition.id,
      name: characterDefinition.name,
      ...(characterDefinition.title == null
        ? {}
        : { title: characterDefinition.title }),
    }));

  return {
    title: houseDefinition.name,
    defaultCharacterId:
      characterManager.getDefaultHouseNpcCharacterId(houseDefinition) ??
      houseDefinition.defaultCharacterId,
    characterSummaries: [...fixedCharacterSummaries, ...cityNpcSummaries],
    backButtonLabel: houseDefinition.backAction.label,
  };
}
