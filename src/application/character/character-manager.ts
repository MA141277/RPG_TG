import type { CharacterDefinition } from "../../domain/character";
import type { HouseDefinition } from "../../domain/house";

export type CharacterPersonType = "角色" | "NPC";

export type CharacterManager = {
  characters: CharacterDefinition[];
  characterById: Record<string, CharacterDefinition>;
  playableCharacters: CharacterDefinition[];
  npcCharacters: CharacterDefinition[];
  playableCharacterById: Record<string, CharacterDefinition>;
  npcCharacterById: Record<string, CharacterDefinition>;
  getCharacterById(characterId: string): CharacterDefinition | null;
  getPlayableCharacterById(characterId: string): CharacterDefinition | null;
  getNpcCharacterById(characterId: string): CharacterDefinition | null;
  getCharactersByPersonType(personType: CharacterPersonType): CharacterDefinition[];
  getHouseNpcCharacters(houseDefinition: HouseDefinition): CharacterDefinition[];
  getDefaultHouseNpcCharacterId(houseDefinition: HouseDefinition): string | null;
};

export function resolveCharacterPersonType(
  characterDefinition: Pick<CharacterDefinition, "personType" | "role">
): CharacterPersonType {
  if (characterDefinition.personType === "角色") {
    return "角色";
  }

  return characterDefinition.role === "playable" ? "角色" : "NPC";
}

export function selectHouseNpcCharacters(
  characterDefinitions: CharacterDefinition[],
  houseDefinition: HouseDefinition
): CharacterDefinition[] {
  const managerDrivenCharacters = characterDefinitions.filter(
    (characterDefinition) =>
      resolveCharacterPersonType(characterDefinition) === "NPC" &&
      characterDefinition.houseId === houseDefinition.id
  );

  if (managerDrivenCharacters.length > 0) {
    return managerDrivenCharacters;
  }

  const fallbackNpcCharacterIds = new Set(houseDefinition.characterIds);
  return characterDefinitions.filter(
    (characterDefinition) =>
      resolveCharacterPersonType(characterDefinition) === "NPC" &&
      fallbackNpcCharacterIds.has(characterDefinition.id)
  );
}

export function selectHouseNpcCharacterIds(
  characterDefinitions: CharacterDefinition[],
  houseDefinition: HouseDefinition
): string[] {
  return selectHouseNpcCharacters(characterDefinitions, houseDefinition).map(
    (characterDefinition) => characterDefinition.id
  );
}

export function createCharacterManager(
  characterDefinitions: CharacterDefinition[]
): CharacterManager {
  const characters = [...characterDefinitions];
  const characterById = Object.fromEntries(
    characters.map((characterDefinition) => [characterDefinition.id, characterDefinition])
  );
  const playableCharacters = characters.filter(
    (characterDefinition) => resolveCharacterPersonType(characterDefinition) === "角色"
  );
  const npcCharacters = characters.filter(
    (characterDefinition) => resolveCharacterPersonType(characterDefinition) === "NPC"
  );
  const playableCharacterById = Object.fromEntries(
    playableCharacters.map((characterDefinition) => [
      characterDefinition.id,
      characterDefinition,
    ])
  );
  const npcCharacterById = Object.fromEntries(
    npcCharacters.map((characterDefinition) => [
      characterDefinition.id,
      characterDefinition,
    ])
  );

  return {
    characters,
    characterById,
    playableCharacters,
    npcCharacters,
    playableCharacterById,
    npcCharacterById,
    getCharacterById(characterId: string) {
      return characterById[characterId] ?? null;
    },
    getPlayableCharacterById(characterId: string) {
      return playableCharacterById[characterId] ?? null;
    },
    getNpcCharacterById(characterId: string) {
      return npcCharacterById[characterId] ?? null;
    },
    getCharactersByPersonType(personType: CharacterPersonType) {
      return personType === "角色" ? playableCharacters : npcCharacters;
    },
    getHouseNpcCharacters(houseDefinition: HouseDefinition) {
      return selectHouseNpcCharacters(npcCharacters, houseDefinition);
    },
    getDefaultHouseNpcCharacterId(houseDefinition: HouseDefinition) {
      if (houseDefinition.defaultCharacterId != null) {
        const defaultCharacter = npcCharacterById[houseDefinition.defaultCharacterId];
        if (defaultCharacter != null) {
          return defaultCharacter.id;
        }
      }

      return this.getHouseNpcCharacters(houseDefinition)[0]?.id ?? null;
    },
  };
}
