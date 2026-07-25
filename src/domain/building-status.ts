import type { HouseDefinition } from "./house";

export type BuildingStatus = {
  profilePatch?: Partial<Pick<HouseDefinition, "name" | "defaultCharacterId">>;
  runtimePatch?: Partial<
    Pick<HouseDefinition, "level" | "damaged" | "outputMultiplier">
  >;
};

export type BuildingStatusById = Record<string, BuildingStatus>;

export function materializeBuildingDefinition(
  definition: HouseDefinition,
  status?: BuildingStatus | null
): HouseDefinition {
  const nextDefinition: HouseDefinition = {
    ...definition,
    characterIds: [...definition.characterIds],
    backAction: { ...definition.backAction },
    ...(definition.visibleStoryStages == null
      ? {}
      : { visibleStoryStages: [...definition.visibleStoryStages] }),
    ...(definition.enterableStoryStages == null
      ? {}
      : { enterableStoryStages: [...definition.enterableStoryStages] }),
  };

  if (status == null) {
    return nextDefinition;
  }

  return {
    ...nextDefinition,
    ...(status.profilePatch ?? {}),
    ...(status.runtimePatch ?? {}),
  };
}

export function materializeBuildingDefinitions(
  definitions: readonly HouseDefinition[],
  statusById: BuildingStatusById = {}
): HouseDefinition[] {
  return definitions.map((definition) =>
    materializeBuildingDefinition(definition, statusById[definition.id])
  );
}

export function mergeBuildingStatusById(
  statusById: BuildingStatusById,
  buildingId: string,
  patch: BuildingStatus
): BuildingStatusById {
  const currentStatus = statusById[buildingId] ?? {};
  return {
    ...statusById,
    [buildingId]: {
      ...currentStatus,
      ...(patch.profilePatch == null
        ? {}
        : {
            profilePatch: {
              ...(currentStatus.profilePatch ?? {}),
              ...patch.profilePatch,
            },
          }),
      ...(patch.runtimePatch == null
        ? {}
        : {
            runtimePatch: {
              ...(currentStatus.runtimePatch ?? {}),
              ...patch.runtimePatch,
            },
          }),
    },
  };
}

export function mergeBuildingStatusMaps(
  statusById: BuildingStatusById,
  patchById: BuildingStatusById
): BuildingStatusById {
  return Object.entries(patchById).reduce(
    (nextStatusById, [buildingId, patch]) =>
      mergeBuildingStatusById(nextStatusById, buildingId, patch),
    statusById
  );
}

export function createBuildingStatusPatch(
  authoredDefinition: HouseDefinition,
  runtimeDefinition: HouseDefinition
): BuildingStatus | null {
  const profilePatch: NonNullable<BuildingStatus["profilePatch"]> = {};
  const runtimePatch: NonNullable<BuildingStatus["runtimePatch"]> = {};

  if (runtimeDefinition.name !== authoredDefinition.name) {
    profilePatch.name = runtimeDefinition.name;
  }
  if (runtimeDefinition.defaultCharacterId !== authoredDefinition.defaultCharacterId) {
    profilePatch.defaultCharacterId = runtimeDefinition.defaultCharacterId;
  }
  if (
    runtimeDefinition.level !== authoredDefinition.level &&
    runtimeDefinition.level !== undefined
  ) {
    runtimePatch.level = runtimeDefinition.level;
  }
  if (
    runtimeDefinition.damaged !== authoredDefinition.damaged &&
    runtimeDefinition.damaged !== undefined
  ) {
    runtimePatch.damaged = runtimeDefinition.damaged;
  }
  if (
    runtimeDefinition.outputMultiplier !== authoredDefinition.outputMultiplier &&
    runtimeDefinition.outputMultiplier !== undefined
  ) {
    runtimePatch.outputMultiplier = runtimeDefinition.outputMultiplier;
  }

  return Object.keys(profilePatch).length === 0 &&
    Object.keys(runtimePatch).length === 0
    ? null
    : {
        ...(Object.keys(profilePatch).length === 0 ? {} : { profilePatch }),
        ...(Object.keys(runtimePatch).length === 0 ? {} : { runtimePatch }),
      };
}

export function deriveBuildingStatusById(
  authoredDefinitionsById: Record<string, HouseDefinition>,
  runtimeDefinitions: readonly HouseDefinition[]
): BuildingStatusById {
  const nextStatusById: BuildingStatusById = {};

  for (const runtimeDefinition of runtimeDefinitions) {
    const authoredDefinition = authoredDefinitionsById[runtimeDefinition.id];
    if (authoredDefinition == null) {
      continue;
    }

    const patch = createBuildingStatusPatch(authoredDefinition, runtimeDefinition);
    if (patch != null) {
      nextStatusById[runtimeDefinition.id] = patch;
    }
  }

  return nextStatusById;
}
