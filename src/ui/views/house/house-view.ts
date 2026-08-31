import type { CharacterDefinition } from "../../../domain/character";
import type { HouseDefinition } from "../../../domain/house";

export type HouseViewModel = {
  houseId: string;
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
  characterDefinitions: CharacterDefinition[],
  cityNpcSummaries: HouseViewModel["characterSummaries"] = []
): HouseViewModel {
  const fixedCharacterSummaries = characterDefinitions
    .filter((characterDefinition) =>
      houseDefinition.characterIds.includes(characterDefinition.id)
    )
    .map((characterDefinition) => ({
      id: characterDefinition.id,
      name: characterDefinition.name,
      ...(characterDefinition.title == null
        ? {}
        : { title: characterDefinition.title }),
    }));

  return {
    houseId: houseDefinition.id,
    title: houseDefinition.name,
    defaultCharacterId: houseDefinition.defaultCharacterId,
    characterSummaries: [...fixedCharacterSummaries, ...cityNpcSummaries],
    backButtonLabel: houseDefinition.backAction.label,
  };
}
