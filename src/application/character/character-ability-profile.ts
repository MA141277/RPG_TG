import type { CharacterDefinition } from "../../domain/character";
import { readNumericPersonAttributeBySemanticKey } from "./person-attribute-runtime";

export type CharacterDetailAbilityValueKey =
  | "martial"
  | "strength"
  | "physique"
  | "agility"
  | "intelligence"
  | "adaptability"
  | "judgment"
  | "awareness"
  | "politics"
  | "governance"
  | "livelihood"
  | "finance"
  | "charm"
  | "presence"
  | "learning"
  | "eloquence";

export type CharacterDetailAbilityValues = Partial<
  Record<CharacterDetailAbilityValueKey, number>
>;

const MINOR_ABILITY_SEMANTIC_KEYS: Array<{
  key: CharacterDetailAbilityValueKey;
  semanticKey: string;
}> = [
  { key: "strength", semanticKey: "ability.martial.strength" },
  { key: "physique", semanticKey: "ability.martial.physique" },
  { key: "agility", semanticKey: "ability.martial.agility" },
  { key: "adaptability", semanticKey: "ability.intelligence.adaptability" },
  { key: "judgment", semanticKey: "ability.intelligence.judgment" },
  { key: "awareness", semanticKey: "ability.intelligence.awareness" },
  { key: "governance", semanticKey: "ability.politics.governance" },
  { key: "livelihood", semanticKey: "ability.politics.livelihood" },
  { key: "finance", semanticKey: "ability.politics.finance" },
  { key: "presence", semanticKey: "ability.charm.presence" },
  { key: "learning", semanticKey: "ability.charm.learning" },
  { key: "eloquence", semanticKey: "ability.charm.eloquence" },
];

export function buildCharacterDetailAbilityValues(
  character: CharacterDefinition
): CharacterDetailAbilityValues {
  const values: CharacterDetailAbilityValues = {
    martial: character.stats.martial,
    intelligence: character.stats.intelligence,
    politics: character.stats.politics,
    charm: character.stats.charm,
  };

  for (const definition of MINOR_ABILITY_SEMANTIC_KEYS) {
    const resolvedValue = readNumericPersonAttributeBySemanticKey(
      character,
      definition.semanticKey,
      Number.NaN
    );
    if (Number.isFinite(resolvedValue)) {
      values[definition.key] = resolvedValue;
    }
  }

  return values;
}
