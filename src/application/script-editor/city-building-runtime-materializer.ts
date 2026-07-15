import type { CityEntryDefinition } from "../../domain/city-entry";
import type {
  CityNpcDefinition,
  CityNpcPoolDefinition,
} from "../../domain/city-npc";
import type {
  HouseAccessRefusalRule,
  HouseDefinition,
} from "../../domain/house";
import type {
  ScriptEditorAccessRule,
  ScriptEditorBuildingRecord,
  ScriptEditorPersonRecord,
  ScriptEditorProjectDefinition,
  ScriptEditorRuntimeRecord,
} from "../../domain/script-editor-project";
import { normalizeScriptEditorBuildingRecord } from "./city-building-authoring";
import { normalizeScriptEditorPersonRecord } from "./person-authoring";

export type ScriptEditorCityBuildingRuntimeFamilies = {
  houses: HouseDefinition[];
  cityEntries: CityEntryDefinition[];
  cityNpcPools: CityNpcPoolDefinition[];
  houseAccessRefusalRules: HouseAccessRefusalRule[];
};

export function materializeScriptEditorCityBuildingRuntimeFamilies(
  project: ScriptEditorProjectDefinition
): ScriptEditorCityBuildingRuntimeFamilies {
  const buildings = project.buildings.map((building) =>
    normalizeScriptEditorBuildingRecord(building)
  );
  const people = project.people.map((person) =>
    normalizeScriptEditorPersonRecord(person)
  );

  return {
    houses: materializeHouses(buildings, people),
    cityEntries: materializeCityEntries(project.cityEntries, buildings),
    cityNpcPools: materializeCityNpcPools(project.cityNpcPools, people),
    houseAccessRefusalRules: materializeHouseAccessRefusalRules(
      project.houseAccessRefusalRules,
      buildings
    ),
  };
}

function materializeHouses(
  buildings: readonly ScriptEditorBuildingRecord[],
  people: readonly ScriptEditorPersonRecord[]
): HouseDefinition[] {
  return buildings.map((building) => {
    const assignedPersonIds = uniqueStrings([
      ...readStringArray(building.characterIds),
      ...people
        .filter((person) => person.houseId === building.id)
        .map((person) => person.id),
    ]);
    const defaultPersonId = firstNonEmptyString(
      building.entryBinding?.defaultPersonId,
      readString(building.defaultCharacterId),
      assignedPersonIds[0] ?? ""
    );
    const onEnterEventId = firstNonEmptyString(
      building.entryBinding?.onEnterEventId,
      readString(building.onEnterEventId)
    );
    const onLeaveEventId = firstNonEmptyString(
      building.entryBinding?.onLeaveEventId,
      readString(building.onLeaveEventId)
    );
    const backAction = readBackAction(building.backAction);

    return {
      ...building,
      type: readHouseType(building.type),
      characterIds: assignedPersonIds,
      defaultCharacterId: defaultPersonId.length > 0 ? defaultPersonId : null,
      ...(onEnterEventId.length === 0 ? {} : { onEnterEventId }),
      ...(onLeaveEventId.length === 0 ? {} : { onLeaveEventId }),
      backAction,
      moduleId: building.moduleId ?? null,
      activityLocationId: readActivityLocationId(building.activityLocationId),
    };
  });
}

function materializeCityEntries(
  explicitEntries: readonly ScriptEditorRuntimeRecord[],
  buildings: readonly ScriptEditorBuildingRecord[]
): CityEntryDefinition[] {
  if (explicitEntries.length > 0) {
    return [...explicitEntries] as CityEntryDefinition[];
  }

  const entries = [...explicitEntries] as CityEntryDefinition[];
  const explicitHouseIds = new Set(
    explicitEntries
      .map((entry) => readString(entry.targetHouseId))
      .filter((targetHouseId) => targetHouseId.length > 0)
  );

  for (const building of buildings) {
    if (explicitHouseIds.has(building.id)) {
      continue;
    }
    entries.push({
      id: `city-entry.${slugifyIdSegment(building.id)}`,
      cityId: building.cityId,
      name: building.name,
      directoryType: "leader-residence",
      targetHouseId: building.id,
      artworkId: "leader-residence",
    });
  }

  return entries;
}

function materializeCityNpcPools(
  explicitPools: readonly Record<string, unknown>[],
  people: readonly ScriptEditorPersonRecord[]
): CityNpcPoolDefinition[] {
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

function materializeHouseAccessRefusalRules(
  explicitRules: readonly ScriptEditorRuntimeRecord[],
  buildings: readonly ScriptEditorBuildingRecord[]
): HouseAccessRefusalRule[] {
  if (explicitRules.length > 0) {
    return [...explicitRules] as HouseAccessRefusalRule[];
  }

  const rules = [...explicitRules] as HouseAccessRefusalRule[];
  const explicitHouseIds = new Set(
    explicitRules.flatMap((rule) => readStringArray(rule.houseIds))
  );

  for (const building of buildings) {
    const access = building.access;
    if (
      access == null ||
      access.state === "visible-enabled" ||
      access.blockedMessage.length === 0 ||
      explicitHouseIds.has(building.id)
    ) {
      continue;
    }

    rules.push(materializeHouseAccessRefusalRule(building, access));
  }

  return rules;
}

function materializeHouseAccessRefusalRule(
  building: ScriptEditorBuildingRecord,
  access: ScriptEditorAccessRule
): HouseAccessRefusalRule {
  return {
    id: `house-access-refusal.${slugifyIdSegment(building.id)}`,
    houseIds: [building.id],
    speakerCharacterId:
      access.blockedSpeaker.length > 0 ? access.blockedSpeaker : "player",
    title: building.name,
    text: access.blockedMessage,
    confirmLabel: access.guidance.length > 0 ? access.guidance : "返回",
  };
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
