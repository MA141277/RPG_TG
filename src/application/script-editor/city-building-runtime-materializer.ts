import type { CityEntryDefinition } from "../../domain/city-entry";
import type { CityDefinition } from "../../domain/city";
import type {
  LocationAccessDefinition,
  LocationAccessTargetFamily,
} from "../../domain/location-access";
import type {
  CityNpcDefinition,
  CityNpcPoolDefinition,
} from "../../domain/city-npc";
import type { HouseDefinition } from "../../domain/house";
import type {
  ScriptEditorAccessRule,
  ScriptEditorBuildingRecord,
  ScriptEditorCityRecord,
  ScriptEditorDialogueRecord,
  ScriptEditorPersonRecord,
  ScriptEditorProjectDefinition,
  ScriptEditorRuntimeRecord,
  ScriptEditorTextEntryRecord,
} from "../../domain/script-editor-project";
import { normalizeScriptEditorBuildingRecord } from "./city-building-authoring";
import { normalizeScriptEditorCityRecord } from "./city-building-authoring";
import { normalizeScriptEditorPersonRecord } from "./person-authoring";

export type ScriptEditorCityBuildingRuntimeFamilies = {
  cities: CityDefinition[];
  houses: HouseDefinition[];
  cityEntries: CityEntryDefinition[];
  cityNpcPools: CityNpcPoolDefinition[];
  locationAccess: LocationAccessDefinition[];
};

export function materializeScriptEditorCityBuildingRuntimeFamilies(
  project: ScriptEditorProjectDefinition
): ScriptEditorCityBuildingRuntimeFamilies {
  const buildings = project.buildings.map((building) =>
    normalizeScriptEditorBuildingRecord(building)
  );
  const cities = project.cities.map((city) =>
    normalizeScriptEditorCityRecord(city)
  );
  const people = project.people.map((person) =>
    normalizeScriptEditorPersonRecord(person)
  );

  return {
    cities: materializeCities(cities, buildings),
    houses: materializeHouses(buildings, people, cities),
    cityEntries: materializeCityEntries(project.cityEntries, cities, buildings),
    cityNpcPools: materializeCityNpcPools(project.cityNpcPools, people, cities),
    locationAccess: materializeLocationAccess(
      cities,
      buildings,
      project.dialogues,
      project.textEntries
    ),
  };
}

function materializeCities(
  cities: readonly ScriptEditorCityRecord[],
  buildings: readonly ScriptEditorBuildingRecord[]
): CityDefinition[] {
  return cities.map((city) => {
    const baseAttributes = city.baseAttributes ?? {};
    const security =
      typeof baseAttributes.security === "number"
        ? clampNumber(baseAttributes.security, 0, 100)
        : 100;
    return {
      id: city.id,
      name: city.name,
      backgroundId: readString(city.backgroundId),
      regionId: readString(city.regionId) || "region.default",
      mapNodeId: readString(city.mapNodeId) || city.id,
      houseIds:
        city.mountedBuildings != null && city.mountedBuildings.length > 0
          ? readStringArray(
              city.mountedBuildings.map((mountedBuilding) => mountedBuilding.buildingId)
            )
          : city.houseIds != null && city.houseIds.length > 0
          ? readStringArray(city.houseIds)
          : buildings
              .filter((building) => building.cityId === city.id)
              .map((building) => building.id),
      neighbourCityIds: readStringArray(city.neighbourCityIds),
      travelCost:
        typeof city.travelCost === "number" && Number.isFinite(city.travelCost)
          ? city.travelCost
          : 1,
      tags: readStringArray(city.profileMap?.tags),
      prosperity:
        typeof baseAttributes.prosperity === "number"
          ? baseAttributes.prosperity
          : 50,
      danger: 100 - security,
      specialDemand: readStringArray(
        city.extendedAttributes
          ?.filter((entry) => entry.key === "specialDemand")
          .flatMap((entry) => entry.value)
      ),
    };
  });
}

function materializeHouses(
  buildings: readonly ScriptEditorBuildingRecord[],
  people: readonly ScriptEditorPersonRecord[],
  cities: readonly ScriptEditorCityRecord[]
): HouseDefinition[] {
  const mountedBuildingById = indexMountedBuildings(cities);
  return buildings.map((building) => {
    const mountedBuilding = mountedBuildingById.get(building.id);
    const baseAttributes = building.baseAttributes ?? {
      houseType: "custom",
      characterIds: [],
      defaultCharacterId: null,
    };
    const assignedPersonIds = uniqueStrings([
      ...readStringArray(baseAttributes.characterIds),
      ...people
        .filter((person) => person.houseId === building.id)
        .map((person) => person.id),
      ...(mountedBuilding?.npcIds ?? []),
    ]);
    const defaultPersonId = firstNonEmptyString(
      mountedBuilding?.primaryNpcId,
      building.entryBinding?.defaultPersonId,
      readString(baseAttributes.defaultCharacterId),
      assignedPersonIds[0] ?? ""
    );
    const onEnterEventId = firstNonEmptyString(
      building.entryBinding?.onEnterEventId,
      readString(building.eventBindings?.onEnterEventId)
    );
    const onLeaveEventId = firstNonEmptyString(
      building.entryBinding?.onLeaveEventId,
      readString(building.eventBindings?.onLeaveEventId)
    );
    const backAction = readBackAction(building.backAction);

    return {
      id: building.id,
      cityId: mountedBuilding?.cityId ?? building.cityId,
      name: building.name,
      backgroundId: readString(building.backgroundId),
      type: readHouseType(baseAttributes.houseType),
      characterIds: assignedPersonIds,
      defaultCharacterId: defaultPersonId.length > 0 ? defaultPersonId : null,
      ...(onEnterEventId.length === 0 ? {} : { onEnterEventId }),
      ...(onLeaveEventId.length === 0 ? {} : { onLeaveEventId }),
      backAction,
      visibleStoryStages: readStringArray(baseAttributes.visibleStoryStages),
      enterableStoryStages: readStringArray(baseAttributes.enterableStoryStages),
      requiresPlayerCurrentCityMatch:
        baseAttributes.requiresPlayerCurrentCityMatch === true,
      moduleId: baseAttributes.moduleId ?? null,
      activityLocationId: readActivityLocationId(baseAttributes.activityLocationId),
    };
  });
}

function materializeCityEntries(
  explicitEntries: readonly ScriptEditorRuntimeRecord[],
  cities: readonly ScriptEditorCityRecord[],
  buildings: readonly ScriptEditorBuildingRecord[]
): CityEntryDefinition[] {
  const mountedEntries = materializeMountedCityEntries(
    explicitEntries,
    cities,
    buildings
  );
  if (mountedEntries.length > 0) {
    return mountedEntries;
  }

  if (explicitEntries.length > 0) {
    return [...explicitEntries] as CityEntryDefinition[];
  }

  return [];
}

function materializeCityNpcPools(
  explicitPools: readonly Record<string, unknown>[],
  people: readonly ScriptEditorPersonRecord[],
  cities: readonly ScriptEditorCityRecord[]
): CityNpcPoolDefinition[] {
  const mountedPools = materializeMountedCityNpcPools(cities, people, explicitPools);
  if (mountedPools.length > 0) {
    return mountedPools;
  }

  if (explicitPools.length > 0) {
    return [...explicitPools] as CityNpcPoolDefinition[];
  }

  const pools = explicitPools.map((pool) => ({
    cityId: readString(pool.cityId),
    residents: Array.isArray(pool.residents) ? [...pool.residents] : [],
  })) as CityNpcPoolDefinition[];

  for (const person of people) {
    if (person.personType !== "NPC" || person.cityId == null || person.cityId.length === 0) {
      continue;
    }

    let pool = pools.find((candidate) => candidate.cityId === person.cityId);
    if (pool == null) {
      pool = {
        cityId: person.cityId,
        residents: [],
      };
      pools.push(pool);
    }

    if (pool.residents.some((resident) => resident.id === person.id)) {
      continue;
    }

    pool.residents.push(materializeCityNpcResident(person));
  }

  return pools;
}

function materializeCityNpcResident(
  person: ScriptEditorPersonRecord
): CityNpcDefinition {
  return {
    id: person.id,
    cityId: person.cityId ?? "",
    name: person.name,
    title: readString(person.title),
    personality: "",
    specialty: "",
    favorability: 0,
    activityWeight: { custom: 1 },
    dialoguePool: readStringArray(person.dialogueIds),
    intelPool: [],
  };
}

function materializeMountedCityEntries(
  explicitEntries: readonly ScriptEditorRuntimeRecord[],
  cities: readonly ScriptEditorCityRecord[],
  buildings: readonly ScriptEditorBuildingRecord[]
): CityEntryDefinition[] {
  const buildingById = new Map(buildings.map((building) => [building.id, building]));
  const entries: CityEntryDefinition[] = [];

  for (const city of cities) {
    for (const mountedBuilding of city.mountedBuildings ?? []) {
      const building = buildingById.get(mountedBuilding.buildingId);
      if (building == null) {
        continue;
      }
      const explicitEntry = explicitEntries.find(
        (entry) =>
          readString(entry.cityId) === city.id &&
          readString(entry.targetHouseId) === building.id
      );
      entries.push({
        id:
          readString(explicitEntry?.id) ||
          `city-entry.${slugifyIdSegment(city.id)}.${slugifyIdSegment(building.id)}`,
        cityId: city.id,
        name: building.name,
        directoryType: getCityEntryDirectoryType(building),
        targetHouseId: building.id,
        artworkId: getCityEntryArtworkId(building),
      });
    }
  }

  return entries;
}

function getCityEntryDirectoryType(
  building: ScriptEditorBuildingRecord
): CityEntryDefinition["directoryType"] {
  const moduleId = building.baseAttributes?.moduleId;
  return moduleId === "leader-residence" ? "leader-residence" : "building";
}

function getCityEntryArtworkId(
  building: ScriptEditorBuildingRecord
): CityEntryDefinition["artworkId"] {
  const moduleId = building.baseAttributes?.moduleId;
  if (moduleId != null && moduleId.length > 0) {
    return moduleId;
  }

  switch (readHouseType(building.baseAttributes?.houseType)) {
    case "merchant":
      return "market-house";
    case "inn":
      return "tavern";
    case "tea-house":
      return "tea-house";
    case "temple":
      return "temple-house";
    case "medicine-house":
      return "medicine-house";
    case "residence":
      return "home-house";
    case "castle":
      return "keep-house";
    case "dojo":
      return "dojo";
    case "custom":
    default:
      return "building";
  }
}

function materializeMountedCityNpcPools(
  cities: readonly ScriptEditorCityRecord[],
  people: readonly ScriptEditorPersonRecord[],
  explicitPools: readonly Record<string, unknown>[]
): CityNpcPoolDefinition[] {
  const personById = new Map(people.map((person) => [person.id, person]));
  const explicitResidentByCityAndId = indexExplicitCityNpcResidents(explicitPools);
  const pools: CityNpcPoolDefinition[] = [];

  for (const city of cities) {
    const npcIds = uniqueStrings(
      (city.mountedBuildings ?? []).flatMap((mountedBuilding) => mountedBuilding.npcIds)
    );
    if (npcIds.length === 0) {
      continue;
    }

    pools.push({
      cityId: city.id,
      residents: npcIds.flatMap((npcId) => {
        const person = personById.get(npcId);
        if (person == null) {
          return [];
        }
        return [
          explicitResidentByCityAndId.get(`${city.id}\u0000${npcId}`) ??
            materializeCityNpcResident({ ...person, cityId: city.id }),
        ];
      }),
    });
  }

  return pools.filter((pool) => pool.residents.length > 0);
}

function indexExplicitCityNpcResidents(
  explicitPools: readonly Record<string, unknown>[]
): Map<string, CityNpcDefinition> {
  const residentByCityAndId = new Map<string, CityNpcDefinition>();

  for (const pool of explicitPools) {
    const cityId = readString(pool.cityId);
    if (!Array.isArray(pool.residents)) {
      continue;
    }
    for (const resident of pool.residents) {
      if (resident == null || typeof resident !== "object" || Array.isArray(resident)) {
        continue;
      }
      const residentRecord = resident as CityNpcDefinition & Record<string, unknown>;
      const id = readString(residentRecord.id);
      if (cityId.length === 0 || id.length === 0) {
        continue;
      }
      residentByCityAndId.set(`${cityId}\u0000${id}`, {
        ...residentRecord,
        id,
        cityId,
      });
    }
  }

  return residentByCityAndId;
}

function indexMountedBuildings(
  cities: readonly ScriptEditorCityRecord[]
): Map<string, { cityId: string; npcIds: string[]; primaryNpcId: string | null }> {
  const mountedBuildingById = new Map<
    string,
    { cityId: string; npcIds: string[]; primaryNpcId: string | null }
  >();

  for (const city of cities) {
    for (const mountedBuilding of city.mountedBuildings ?? []) {
      if (mountedBuilding.buildingId.length === 0) {
        continue;
      }
      mountedBuildingById.set(mountedBuilding.buildingId, {
        cityId: city.id,
        npcIds: readStringArray(mountedBuilding.npcIds),
        primaryNpcId: mountedBuilding.primaryNpcId,
      });
    }
  }

  return mountedBuildingById;
}

function materializeLocationAccess(
  cities: readonly ScriptEditorCityRecord[],
  buildings: readonly ScriptEditorBuildingRecord[],
  dialogues: readonly ScriptEditorDialogueRecord[],
  textEntries: readonly ScriptEditorTextEntryRecord[]
): LocationAccessDefinition[] {
  return [
    ...cities.flatMap((city) =>
      materializeLocationAccessDefinition(
        "city",
        city.id,
        city.name,
        city.access,
        dialogues,
        textEntries
      )
    ),
    ...buildings.flatMap((building) =>
      materializeLocationAccessDefinition(
        "building",
        building.id,
        building.name,
        building.access,
        dialogues,
        textEntries
      )
    ),
  ];
}

function materializeLocationAccessDefinition(
  targetFamily: LocationAccessTargetFamily,
  targetId: string,
  _targetName: string,
  access: ScriptEditorAccessRule | undefined,
  dialogues: readonly ScriptEditorDialogueRecord[],
  textEntries: readonly ScriptEditorTextEntryRecord[]
): LocationAccessDefinition[] {
  if (access?.conditionExpression == null) {
    return [];
  }
  const blockedMessage = resolveAccessBlockedMessage(access, dialogues, textEntries);

  return [
    {
      id: `location-access.${targetFamily}.${slugifyIdSegment(targetId)}`,
      targetFamily,
      targetId,
      conditionExpression: access.conditionExpression,
      ...pickOptionalString("blockedReason", access.blockedReason),
      ...pickOptionalString("blockedTitle", access.blockedTitle),
      ...pickOptionalString("blockedMessage", blockedMessage),
      ...pickOptionalString("blockedSpeakerId", access.blockedSpeakerId),
      ...pickOptionalString("guidance", access.guidance),
    },
  ];
}

function resolveAccessBlockedMessage(
  access: ScriptEditorAccessRule,
  dialogues: readonly ScriptEditorDialogueRecord[],
  textEntries: readonly ScriptEditorTextEntryRecord[]
): string | undefined {
  const dialogueId = access.blockedDialogueId?.trim() ?? "";
  if (dialogueId.length > 0) {
    const dialogue = dialogues.find((entry) => entry.id === dialogueId);
    if (dialogue == null) {
      return access.blockedMessage;
    }
    const textEntryId = dialogue.nodes?.find((node) => node.textId.length > 0)?.textId ?? "";
    if (textEntryId.length > 0) {
      const textEntry = textEntries.find((entry) => entry.id === textEntryId);
      if (textEntry?.text != null && textEntry.text.length > 0) {
        return textEntry.text;
      }
      const rawTextEntry = textEntry as
        | (ScriptEditorTextEntryRecord & { body?: unknown; title?: unknown })
        | undefined;
      if (typeof rawTextEntry?.body === "string" && rawTextEntry.body.length > 0) {
        return rawTextEntry.body;
      }
    }
    if (dialogue.title.length > 0) {
      return dialogue.title;
    }
  }
  const legacyTextEntryId = (access as ScriptEditorAccessRule & {
    blockedMessageTextEntryId?: string;
  }).blockedMessageTextEntryId?.trim() ?? "";
  if (legacyTextEntryId.length > 0) {
    const textEntry = textEntries.find((entry) => entry.id === legacyTextEntryId);
    if (textEntry?.text != null && textEntry.text.length > 0) {
      return textEntry.text;
    }
    const rawTextEntry = textEntry as
      | (ScriptEditorTextEntryRecord & { body?: unknown; title?: unknown })
      | undefined;
    if (typeof rawTextEntry?.body === "string" && rawTextEntry.body.length > 0) {
      return rawTextEntry.body;
    }
  }
  return access.blockedMessage;
}


function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function readBackAction(value: unknown): HouseDefinition["backAction"] {
  if (value != null && typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    if (record.targetView === "city") {
      return {
        label: firstNonEmptyString(record.label, "返回"),
        targetView: "city",
      };
    }
  }

  return { label: "返回", targetView: "city" };
}

function readHouseType(value: unknown): HouseDefinition["type"] {
  switch (value) {
    case "castle":
    case "merchant":
    case "inn":
    case "dojo":
    case "tea-house":
    case "temple":
    case "medicine-house":
    case "residence":
    case "custom":
      return value;
    default:
      return "custom";
  }
}

function readActivityLocationId(
  value: unknown
): NonNullable<HouseDefinition["activityLocationId"]> {
  switch (value) {
    case "tea-house":
    case "tavern":
    case "market":
    case "street":
    case "custom":
      return value;
    default:
      return "custom";
  }
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}


function pickOptionalString<K extends string>(
  key: K,
  value: unknown
): Partial<Record<K, string>> {
  const text = readString(value);
  return text.length === 0 ? {} : { [key]: text } as Partial<Record<K, string>>;
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((entry) => readString(entry))
    .filter((entry) => entry.length > 0);
}

function firstNonEmptyString(...values: readonly unknown[]): string {
  for (const value of values) {
    const text = readString(value);
    if (text.length > 0) {
      return text;
    }
  }
  return "";
}

function uniqueStrings(values: readonly string[]): string[] {
  return [...new Set(values.filter((value) => value.length > 0))];
}

function slugifyIdSegment(value: string): string {
  const slug = value.replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return slug.length > 0 ? slug : "generated";
}
