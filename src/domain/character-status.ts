import type {
  CharacterCustomProperties,
  CharacterDefinition,
  CharacterStatKey,
  SkillKey,
} from "./character";

export type CharacterStatus = {
  profilePatch?: Partial<
    Pick<
      CharacterDefinition,
      | "title"
      | "occupation"
      | "biography"
      | "houseId"
      | "clanId"
      | "affiliationLabel"
    >
  >;
  statPatch?: Partial<Record<CharacterStatKey, number>>;
  skillPatch?: Partial<Record<SkillKey, number>>;
  customPropertyPatch?: CharacterCustomProperties;
  stamina?: number;
};

export type CharacterStatusById = Record<string, CharacterStatus>;

export function materializeCharacterDefinition(
  definition: CharacterDefinition,
  status?: CharacterStatus | null
): CharacterDefinition {
  const nextDefinition: CharacterDefinition = {
    ...definition,
    stats: { ...definition.stats },
    ...(definition.skills == null ? {} : { skills: { ...definition.skills } }),
    availableFunctions: definition.availableFunctions.map((entry) => ({
      ...entry,
      ...(entry.effects == null
        ? {}
        : { effects: entry.effects.map((effect) => ({ ...effect })) }),
    })),
    ...(definition.portraitVariants == null
      ? {}
      : {
          portraitVariants: definition.portraitVariants.map((variant) => ({
            ...variant,
          })),
        }),
    ...(definition.flags == null ? {} : { flags: [...definition.flags] }),
    ...(definition.customProperties == null
      ? {}
      : { customProperties: { ...definition.customProperties } }),
    ...(definition.teachableSkillKeys == null
      ? {}
      : { teachableSkillKeys: [...definition.teachableSkillKeys] }),
  };

  if (status == null) {
    return nextDefinition;
  }

  if (status.profilePatch != null) {
    Object.assign(nextDefinition, status.profilePatch);
  }

  if (status.statPatch != null) {
    nextDefinition.stats = {
      ...nextDefinition.stats,
      ...status.statPatch,
    };
  }

  if (status.skillPatch != null) {
    const nextSkills: Record<SkillKey, number> = {
      ...(nextDefinition.skills ?? {}),
      ...status.skillPatch,
    } as Record<SkillKey, number>;
    nextDefinition.skills = nextSkills;
  }

  if (status.customPropertyPatch != null) {
    nextDefinition.customProperties = {
      ...(nextDefinition.customProperties ?? {}),
      ...status.customPropertyPatch,
    };
  }

  if (typeof status.stamina === "number" && Number.isFinite(status.stamina)) {
    nextDefinition.stamina = status.stamina;
  }

  return nextDefinition;
}

export function materializeCharacterDefinitions(
  definitions: readonly CharacterDefinition[],
  statusById: CharacterStatusById = {}
): CharacterDefinition[] {
  return definitions.map((definition) =>
    materializeCharacterDefinition(definition, statusById[definition.id])
  );
}

export function mergeCharacterStatusById(
  statusById: CharacterStatusById,
  characterId: string,
  patch: CharacterStatus
): CharacterStatusById {
  const currentStatus = statusById[characterId] ?? {};
  return {
    ...statusById,
    [characterId]: {
      ...currentStatus,
      ...(patch.profilePatch == null
        ? {}
        : {
            profilePatch: {
              ...(currentStatus.profilePatch ?? {}),
              ...patch.profilePatch,
            },
          }),
      ...(patch.statPatch == null
        ? {}
        : {
            statPatch: {
              ...(currentStatus.statPatch ?? {}),
              ...patch.statPatch,
            },
          }),
      ...(patch.skillPatch == null
        ? {}
        : {
            skillPatch: {
              ...(currentStatus.skillPatch ?? {}),
              ...patch.skillPatch,
            },
          }),
      ...(patch.customPropertyPatch == null
        ? {}
        : {
            customPropertyPatch: {
              ...(currentStatus.customPropertyPatch ?? {}),
              ...patch.customPropertyPatch,
            },
          }),
      ...(patch.stamina == null ? {} : { stamina: patch.stamina }),
    },
  };
}

export function mergeCharacterStatusMaps(
  statusById: CharacterStatusById,
  patchById: CharacterStatusById
): CharacterStatusById {
  return Object.entries(patchById).reduce(
    (nextStatusById, [characterId, patch]) =>
      mergeCharacterStatusById(nextStatusById, characterId, patch),
    statusById
  );
}
