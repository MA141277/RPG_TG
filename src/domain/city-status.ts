import type { CityDefinition } from "./city";

export type CityStatus = {
  valuePatch?: Partial<
    Pick<CityDefinition, "travelCost" | "prosperity" | "danger" | "specialDemand">
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

export function createCityStatusPatch(
  authoredDefinition: CityDefinition,
  runtimeDefinition: CityDefinition
): CityStatus | null {
  const valuePatch: NonNullable<CityStatus["valuePatch"]> = {};

  if (runtimeDefinition.travelCost !== authoredDefinition.travelCost) {
    valuePatch.travelCost = runtimeDefinition.travelCost;
  }
  if (runtimeDefinition.prosperity !== authoredDefinition.prosperity) {
    valuePatch.prosperity = runtimeDefinition.prosperity;
  }
  if (runtimeDefinition.danger !== authoredDefinition.danger) {
    valuePatch.danger = runtimeDefinition.danger;
  }
  if (
    runtimeDefinition.specialDemand.length !== authoredDefinition.specialDemand.length ||
    runtimeDefinition.specialDemand.some(
      (entry, index) => entry !== authoredDefinition.specialDemand[index]
    )
  ) {
    valuePatch.specialDemand = [...runtimeDefinition.specialDemand];
  }

  return Object.keys(valuePatch).length === 0 ? null : { valuePatch };
}

export function deriveCityStatusById(
  authoredDefinitionsById: Record<string, CityDefinition>,
  runtimeDefinitions: readonly CityDefinition[]
): CityStatusById {
  const nextStatusById: CityStatusById = {};

  for (const runtimeDefinition of runtimeDefinitions) {
    const authoredDefinition = authoredDefinitionsById[runtimeDefinition.id];
    if (authoredDefinition == null) {
      continue;
    }

    const patch = createCityStatusPatch(authoredDefinition, runtimeDefinition);
    if (patch != null) {
      nextStatusById[runtimeDefinition.id] = patch;
    }
  }

  return nextStatusById;
}
