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
