import type { CharacterDefinition } from "./character";
import type { SkillKey } from "./character";

export const LEADER_RESIDENCE_VARIABLE_KEYS = {
  pendingCharacterId: "leaderResidence.pendingCharacterId",
  giftFavorBonus: "leaderResidence.giftFavorBonus",
} as const;

export function getLeaderResidenceRelationKey(characterId: string): string {
  return `leaderResidence.relation.${characterId}`;
}

export function getLeaderResidenceSkillKeys(
  characterDefinition: CharacterDefinition
): SkillKey[] {
  return characterDefinition.teachableSkillKeys ?? [];
}
