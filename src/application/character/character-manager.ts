import type {
  CharacterDefinition,
  CharacterPersonType,
} from "../../domain/character";
import type { HouseDefinition } from "../../domain/house";

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
  getCharactersByPersonType(
    personType: CharacterPersonType
  ): CharacterDefinition[];
  getHouseNpcCharacters(
    houseDefinition: HouseDefinition
  ): CharacterDefinition[];
  getDefaultHouseNpcCharacterId(
    houseDefinition: HouseDefinition
  ): string | null;
};

export function resolveCharacterPersonType(
  characterDefinition: Pick<CharacterDefinition, "personType" | "role">
): CharacterPersonType {
  if (characterDefinition.personType === "角色") {
    return "角色";
  }
  if (characterDefinition.personType === "NPC") {
    return "NPC";
  }

  return characterDefinition.role === "playable" ? "角色" : "NPC";
}

export function selectHouseNpcCharacters(
  characterDefinitions: readonly CharacterDefinition[],
  houseDefinition: HouseDefinition
): CharacterDefinition[] {
  const houseOwnedNpcCharacters = characterDefinitions.filter(
    (characterDefinition) =>
      resolveCharacterPersonType(characterDefinition) === "NPC" &&
      characterDefinition.houseId === houseDefinition.id
  );

  if (houseOwnedNpcCharacters.length > 0) {
    return houseOwnedNpcCharacters;
  }

  const fallbackNpcCharacterIds = new Set(houseDefinition.characterIds);
  return characterDefinitions.filter(
    (characterDefinition) =>
      resolveCharacterPersonType(characterDefinition) === "NPC" &&
      fallbackNpcCharacterIds.has(characterDefinition.id)
  );
}

export function selectHouseNpcCharacterIds(
  characterDefinitions: readonly CharacterDefinition[],
  houseDefinition: HouseDefinition
): string[] {
  return selectHouseNpcCharacters(characterDefinitions, houseDefinition).map(
    (characterDefinition) => characterDefinition.id
  );
}

export function selectPlayableCharacters(
  characterDefinitions: readonly CharacterDefinition[],
  fallbackCharacterIds: readonly string[] = []
): CharacterDefinition[] {
  const fieldDrivenCharacters = characterDefinitions.filter(
    (characterDefinition) =>
      resolveCharacterPersonType(characterDefinition) === "角色"
  );

  if (fieldDrivenCharacters.length > 0) {
    return fieldDrivenCharacters;
  }

  const characterById = Object.fromEntries(
    characterDefinitions.map((characterDefinition) => [
      characterDefinition.id,
      characterDefinition,
    ])
  );
  return fallbackCharacterIds.flatMap((characterId) => {
    const characterDefinition = characterById[characterId];
    return characterDefinition == null ? [] : [characterDefinition];
  });
}

export function selectPlayableCharacterIds(
  characterDefinitions: readonly CharacterDefinition[],
  fallbackCharacterIds: readonly string[] = []
): string[] {
  return selectPlayableCharacters(characterDefinitions, fallbackCharacterIds).map(
    (characterDefinition) => characterDefinition.id
  );
}

export function createCharacterManager(
  characterDefinitions: readonly CharacterDefinition[]
): CharacterManager {
  const characters = [...characterDefinitions];
  const characterById = Object.fromEntries(
    characters.map((characterDefinition) => [
      characterDefinition.id,
      characterDefinition,
    ])
  );
  const playableCharacters = selectPlayableCharacters(characters);
  const npcCharacters = characters.filter(
    (characterDefinition) =>
      resolveCharacterPersonType(characterDefinition) === "NPC"
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
    getCharacterById(characterId) {
      return characterById[characterId] ?? null;
    },
    getPlayableCharacterById(characterId) {
      return playableCharacterById[characterId] ?? null;
    },
    getNpcCharacterById(characterId) {
      return npcCharacterById[characterId] ?? null;
    },
    getCharactersByPersonType(personType) {
      return personType === "角色" ? playableCharacters : npcCharacters;
    },
    getHouseNpcCharacters(houseDefinition) {
      return selectHouseNpcCharacters(npcCharacters, houseDefinition);
    },
    getDefaultHouseNpcCharacterId(houseDefinition) {
      if (houseDefinition.defaultCharacterId != null) {
        const defaultCharacter =
          npcCharacterById[houseDefinition.defaultCharacterId];
        if (defaultCharacter != null) {
          return defaultCharacter.id;
        }
      }

      return this.getHouseNpcCharacters(houseDefinition)[0]?.id ?? null;
    },
  };
}
