import type { CharacterDefinition, SkillKey } from "./character";

export type PlayableSkillId = "accounting" | "debate" | "compounding";

export type PlayableSkillDefinition = {
  id: PlayableSkillId;
  label: string;
  skillKey: SkillKey;
};

export const PLAYABLE_SKILL_DEFINITIONS: PlayableSkillDefinition[] = [
  { id: "accounting", label: "绠楄处", skillKey: "accounting" },
  { id: "debate", label: "鑸屾垬", skillKey: "debate" },
  { id: "compounding", label: "閰嶈嵂", skillKey: "compounding" },
];

const PLAYABLE_SKILL_DEFINITION_BY_ID = new Map(
  PLAYABLE_SKILL_DEFINITIONS.map((definition) => [definition.id, definition])
);

export function getPlayableSkillDefinition(
  playableSkillId: PlayableSkillId
): PlayableSkillDefinition {
  const definition = PLAYABLE_SKILL_DEFINITION_BY_ID.get(playableSkillId);
  if (definition == null) {
    throw new Error(`Unknown playable skill "${playableSkillId}".`);
  }

  return definition;
}

export function getPlayableSkillLevel(
  characterDefinition: Pick<CharacterDefinition, "skills">,
  playableSkillId: PlayableSkillId
): number {
  const definition = getPlayableSkillDefinition(playableSkillId);
  const rawLevel = characterDefinition.skills?.[definition.skillKey] ?? 0;
  return Math.max(0, Math.floor(rawLevel));
}

export function formatPlayableSkillLevel(level: number): string {
  return `Lv${Math.max(0, Math.floor(level))}`;
}

export function formatPlayableSkillActionLabel(
  label: string,
  characterDefinition: Pick<CharacterDefinition, "skills">,
  playableSkillId: PlayableSkillId
): string {
  return `${label} ${formatPlayableSkillLevel(
    getPlayableSkillLevel(characterDefinition, playableSkillId)
  )}`;
}
