import type { CityDefinition } from "./city";

export type CityStatus = {
  valuePatch?: Partial<
    Pick<CityDefinition, "prosperity" | "danger" | "specialDemand">
  >;
};

export type CityStatusById = Record<string, CityStatus>;

export function materializeCityDefinition(
  definition: CityDefinition,
  status?: CityStatus | null
): CityDefinition {
  const nextDefinition: CityDefinition = {
    ...definition,
    houseIds: [...definition.houseIds],
    neighbourCityIds: [...definition.neighbourCityIds],
    tags: [...definition.tags],
    specialDemand: [...definition.specialDemand],
  };

  if (status?.valuePatch == null) {
    return nextDefinition;
  }

  return {
    ...nextDefinition,
    ...status.valuePatch,
    ...(status.valuePatch.specialDemand == null
      ? {}
      : { specialDemand: [...status.valuePatch.specialDemand] }),
  };
}

export function materializeCityDefinitions(
  definitions: readonly CityDefinition[],
  statusById: CityStatusById = {}
): CityDefinition[] {
  return definitions.map((definition) =>
    materializeCityDefinition(definition, statusById[definition.id])
  );
}

export function mergeCityStatusById(
  statusById: CityStatusById,
  cityId: string,
  patch: CityStatus
): CityStatusById {
  const currentStatus = statusById[cityId] ?? {};
  return {
    ...statusById,
    [cityId]: {
      ...currentStatus,
      ...(patch.valuePatch == null
        ? {}
        : {
            valuePatch: {
              ...(currentStatus.valuePatch ?? {}),
              ...patch.valuePatch,
              ...(patch.valuePatch.specialDemand == null
                ? {}
                : { specialDemand: [...patch.valuePatch.specialDemand] }),
            },
          }),
    },
  };
}

export function mergeCityStatusMaps(
  statusById: CityStatusById,
  patchById: CityStatusById
): CityStatusById {
  return Object.entries(patchById).reduce(
    (nextStatusById, [cityId, patch]) =>
      mergeCityStatusById(nextStatusById, cityId, patch),
    statusById
  );
}
