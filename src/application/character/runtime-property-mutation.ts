import type { CharacterDefinition, CharacterStatKey, SkillKey } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import {
  materializeCharacterDefinition,
  mergeCharacterStatusById,
  type CharacterStatus,
  type CharacterStatusById,
} from "../../domain/character-status";
import {
  createPersonAttributeValuePatchBySemanticKey,
  readNumericPersonAttributeBySemanticKey,
  resolvePersonAttributeBySemanticKey,
} from "./person-attribute-runtime";

export type RuntimePropertyMutationOperation = "set" | "add" | "subtract";

export type RuntimePropertyMutationInput = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  characterId: string;
  propertyId: string;
  operation: RuntimePropertyMutationOperation;
  value: number;
  characterStatusById?: CharacterStatusById;
};

export type RuntimePropertyMutationResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  characterStatusById: CharacterStatusById;
};

type ResolvedCharacterProperty =
  | {
      kind: "stat";
      key: CharacterStatKey;
      currentValue: number;
    }
  | {
      kind: "skill";
      key: SkillKey;
      currentValue: number;
    }
  | {
      kind: "custom";
      key: string;
      currentValue: number;
    };

const CHARACTER_STAT_KEYS = new Set<CharacterStatKey>([
  "leadership",
  "martial",
  "intelligence",
  "politics",
  "charm",
  "fame",
  "gold",
]);

const CHARACTER_SKILL_KEYS = new Set<SkillKey>([
  "ashigaru",
  "horse",
  "teppo",
  "navy",
  "archery",
  "martial",
  "military",
  "ninjutsu",
  "construction",
  "development",
  "mining",
  "arithmetic",
  "etiquette",
  "rhetoric",
  "tea",
  "medicine",
  "accounting",
  "debate",
  "compounding",
]);

function applyNumericOperation(
  currentValue: number,
  operation: RuntimePropertyMutationOperation,
  value: number
): number {
  if (!Number.isFinite(value)) {
    throw new Error("Runtime property mutation value must be a finite number.");
  }

  if (operation === "set") {
    return value;
  }

  if (operation === "add") {
    return currentValue + value;
  }

  if (operation === "subtract") {
    return currentValue - value;
  }

  throw new Error(`Unsupported runtime property mutation operation "${operation}".`);
}

function readNumericCustomProperty(
  characterDefinition: CharacterDefinition,
  key: string
): number {
  const value = characterDefinition.customProperties?.[key];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Runtime custom property "${key}" must be a finite number.`);
  }
  return value;
}

function resolveCharacterProperty(
  characterDefinition: CharacterDefinition,
  propertyId: string
): ResolvedCharacterProperty {
  if (propertyId.startsWith("stats.")) {
    const key = propertyId.slice("stats.".length) as CharacterStatKey;
    if (!CHARACTER_STAT_KEYS.has(key)) {
      throw new Error(`Unsupported character stat property "${propertyId}".`);
    }
    return {
      kind: "stat",
      key,
      currentValue: characterDefinition.stats[key],
    };
  }

  if (propertyId.startsWith("skills.")) {
    const key = propertyId.slice("skills.".length) as SkillKey;
    if (!CHARACTER_SKILL_KEYS.has(key)) {
      throw new Error(`Unsupported character skill property "${propertyId}".`);
    }
    return {
      kind: "skill",
      key,
      currentValue: characterDefinition.skills?.[key] ?? 0,
    };
  }

  if (propertyId.startsWith("custom.")) {
    const key = propertyId.slice("custom.".length);
    if (key.length === 0) {
      throw new Error("Runtime custom property id must include a custom key.");
    }
    return {
      kind: "custom",
      key,
      currentValue: readNumericCustomProperty(characterDefinition, key),
    };
  }

  throw new Error(`Unsupported runtime character property "${propertyId}".`);
}

function createCharacterStatusPatch(
  property: ResolvedCharacterProperty,
  value: number
): CharacterStatus {
  if (property.kind === "stat") {
    return { statPatch: { [property.key]: value } };
  }

  if (property.kind === "skill") {
    return { skillPatch: { [property.key]: value } };
  }

  return { customPropertyPatch: { [property.key]: value } };
}

export function mutateCharacterNumericProperty(
  input: RuntimePropertyMutationInput
): RuntimePropertyMutationResult {
  const characterDefinition = input.characterDefinitions.find(
    (candidateCharacter) => candidateCharacter.id === input.characterId
  );
  if (characterDefinition == null) {
    throw new Error(`Character "${input.characterId}" does not exist.`);
  }

  const property = resolveCharacterProperty(characterDefinition, input.propertyId);
  const nextValue = applyNumericOperation(
    property.currentValue,
    input.operation,
    input.value
  );
  const patch = createCharacterStatusPatch(property, nextValue);
  const characterStatusById = mergeCharacterStatusById(
    input.characterStatusById ?? {},
    input.characterId,
    patch
  );
  const nextCharacterDefinition = materializeCharacterDefinition(
    characterDefinition,
    characterStatusById[input.characterId]
  );

  return {
    state: input.state,
    characterDefinitions: input.characterDefinitions.map((candidateCharacter) =>
      candidateCharacter.id === input.characterId
        ? nextCharacterDefinition
        : candidateCharacter
    ),
    characterStatusById,
  };
}

export function mutateCharacterNumericAttributeBySemanticKey(input: {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  characterId: string;
  semanticKey: string;
  operation: RuntimePropertyMutationOperation;
  value: number;
  characterStatusById?: CharacterStatusById;
}): RuntimePropertyMutationResult {
  const characterDefinition = input.characterDefinitions.find(
    (candidateCharacter) => candidateCharacter.id === input.characterId
  );
  if (characterDefinition == null) {
    throw new Error(`Character "${input.characterId}" does not exist.`);
  }

  const resolvedAttribute = resolvePersonAttributeBySemanticKey(
    characterDefinition,
    input.semanticKey
  );
  if (resolvedAttribute == null) {
    throw new Error(
      `Character "${input.characterId}" does not define semantic attribute "${input.semanticKey}".`
    );
  }
  if (resolvedAttribute.type !== "number") {
    throw new Error(
      `Character semantic attribute "${input.semanticKey}" must be a number attribute.`
    );
  }

  const nextValue = applyNumericOperation(
    readNumericPersonAttributeBySemanticKey(characterDefinition, input.semanticKey),
    input.operation,
    input.value
  );
  const attributeValuePatch = createPersonAttributeValuePatchBySemanticKey(
    characterDefinition,
    input.semanticKey,
    nextValue
  );
  if (attributeValuePatch == null) {
    throw new Error(
      `Character "${input.characterId}" does not define semantic attribute "${input.semanticKey}".`
    );
  }

  const characterStatusById = mergeCharacterStatusById(
    input.characterStatusById ?? {},
    input.characterId,
    { attributeValuePatch }
  );
  const nextCharacterDefinition = materializeCharacterDefinition(
    characterDefinition,
    characterStatusById[input.characterId]
  );

  return {
    state: input.state,
    characterDefinitions: input.characterDefinitions.map((candidateCharacter) =>
      candidateCharacter.id === input.characterId
        ? nextCharacterDefinition
        : candidateCharacter
    ),
    characterStatusById,
  };
}
