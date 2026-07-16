import type {
  LocationAccessConditionExpression,
  ScriptEditorAccessRule,
  ScriptEditorBuildingEntryBinding,
  ScriptEditorBuildingRecord,
  ScriptEditorCityRecord,
  ScriptEditorCustomAttributeEntry,
  ScriptEditorMenuEntry,
  ScriptEditorMenuTargetFamily,
} from "../../domain/script-editor-project";
import type { HouseDefinition } from "../../domain/house";

export const SCRIPT_EDITOR_CITY_DEFAULT_MENU_FAMILIES = [
  "overview",
  "intel",
  "locations",
  "management",
] as const;

export const SCRIPT_EDITOR_BUILDING_DEFAULT_MENU_FAMILIES = [
  "dialogue",
  "trade",
  "work",
  "rest",
  "intel",
  "minigame",
  "management",
  "leave",
] as const;

function createDefaultAccessRule(): ScriptEditorAccessRule {
  return {};
}

function createDefaultMenuEntry(idBase: string, menuFamily: string): ScriptEditorMenuEntry {
  return {
    id: `${idBase}.${slugifyMenuFamily(menuFamily)}`,
    label: menuFamily,
    menuFamily,
    targetFamily: "info",
    targetId: "",
    isVisible: true,
    isEnabled: true,
    disabledHint: "",
  };
}

function createDefaultBuildingEntryBinding(): ScriptEditorBuildingEntryBinding {
  return {
    defaultPersonId: "",
    onEnterEventId: "",
    onLeaveEventId: "",
    returnTarget: "city",
  };
}

function createDefaultBackAction(): HouseDefinition["backAction"] {
  return {
    label: "返回",
    targetView: "city",
  };
}

export function createDefaultScriptEditorCityRecord(index: number): ScriptEditorCityRecord {
  const suffix = index + 1;
  const id = `city.new.${suffix}`;
  const name = `New City ${suffix}`;
  return {
    id,
    name,
    baseAttributes: {},
    profileMap: { displayName: name, description: "", tags: [] },
    extendedAttributes: [],
    description: "",
    menuEntries: SCRIPT_EDITOR_CITY_DEFAULT_MENU_FAMILIES.map((family) =>
      createDefaultMenuEntry(`${id}.menu`, family)
    ),
    access: createDefaultAccessRule(),
  };
}

export function createDefaultScriptEditorBuildingRecord(
  index: number,
  cityId = "city.start"
): ScriptEditorBuildingRecord {
  const suffix = index + 1;
  const id = `building.new.${suffix}`;
  const name = `New Building ${suffix}`;
  return {
    id,
    cityId,
    name,
    baseAttributes: {
      houseType: "custom",
      characterIds: [],
      defaultCharacterId: null,
      activityLocationId: "custom",
    },
    profileMap: { displayName: name, description: "", tags: [] },
    extendedAttributes: [],
    backAction: createDefaultBackAction(),
    description: "",
    menuEntries: SCRIPT_EDITOR_BUILDING_DEFAULT_MENU_FAMILIES.map((family) =>
      createDefaultMenuEntry(`${id}.menu`, family)
    ),
    access: createDefaultAccessRule(),
    entryBinding: createDefaultBuildingEntryBinding(),
  };
}

export function normalizeScriptEditorCityRecord(
  city: Partial<ScriptEditorCityRecord> & { id: string }
): ScriptEditorCityRecord {
  const rawCity = city as Partial<ScriptEditorCityRecord> & Record<string, unknown>;
  return {
    id: city.id,
    name: normalizeString(city.name, city.id),
    ...(normalizeOptionalString(rawCity.regionId).length === 0
      ? {}
      : { regionId: normalizeOptionalString(rawCity.regionId) }),
    ...(normalizeOptionalString(rawCity.mapNodeId).length === 0
      ? {}
      : { mapNodeId: normalizeOptionalString(rawCity.mapNodeId) }),
    houseIds: normalizeStringArray(rawCity.houseIds),
    neighbourCityIds: normalizeStringArray(rawCity.neighbourCityIds),
    ...(typeof rawCity.travelCost === "number" ? { travelCost: rawCity.travelCost } : {}),
    baseAttributes: normalizeCityBaseAttributes(city.baseAttributes),
    profileMap: normalizeProfileMap(city.profileMap, city.description),
    extendedAttributes: normalizeCustomAttributes(city.extendedAttributes),
    description: normalizeOptionalString(city.description),
    menuEntries: normalizeMenuEntries(city.menuEntries, `${city.id}.menu`),
    access: normalizeAccessRule(city.access),
  };
}

export function normalizeScriptEditorBuildingRecord(
  building: Partial<ScriptEditorBuildingRecord> & { id: string }
): ScriptEditorBuildingRecord {
  const rawBuilding = building as Partial<ScriptEditorBuildingRecord> &
    Record<string, unknown>;
  const eventBindings = normalizeEventBindings(rawBuilding);
  return {
    id: building.id,
    cityId: normalizeString(building.cityId, "city.start"),
    name: normalizeString(building.name, building.id),
    baseAttributes: normalizeBuildingBaseAttributes(rawBuilding),
    profileMap: normalizeProfileMap(building.profileMap, building.description),
    extendedAttributes: normalizeCustomAttributes(building.extendedAttributes),
    description: normalizeOptionalString(building.description),
    menuEntries: normalizeMenuEntries(building.menuEntries, `${building.id}.menu`),
    access: normalizeAccessRule(building.access),
    entryBinding: normalizeBuildingEntryBinding(building.entryBinding),
    ...(eventBindings == null ? {} : { eventBindings }),
    backAction: normalizeBackAction(building.backAction),
  };
}

export function updateScriptEditorCityField(
  city: ScriptEditorCityRecord,
  field: "id" | "name" | "description",
  value: string
): ScriptEditorCityRecord {
  if (field === "description") {
    return normalizeScriptEditorCityRecord({ ...city, description: value });
  }
  return normalizeScriptEditorCityRecord({ ...city, [field]: value.trim() });
}

export function updateScriptEditorBuildingField(
  building: ScriptEditorBuildingRecord,
  field: "id" | "cityId" | "name" | "description",
  value: string
): ScriptEditorBuildingRecord {
  if (field === "description") {
    return normalizeScriptEditorBuildingRecord({ ...building, description: value });
  }
  return normalizeScriptEditorBuildingRecord({ ...building, [field]: value.trim() });
}

export function appendScriptEditorMenuEntry<
  TRecord extends ScriptEditorCityRecord | ScriptEditorBuildingRecord,
>(record: TRecord): TRecord {
  const nextIndex = (record.menuEntries?.length ?? 0) + 1;
  return {
    ...record,
    menuEntries: [
      ...(record.menuEntries ?? []),
      createDefaultMenuEntry(`${record.id}.menu`, `entry-${nextIndex}`),
    ],
  };
}

export function removeScriptEditorMenuEntry<
  TRecord extends ScriptEditorCityRecord | ScriptEditorBuildingRecord,
>(record: TRecord, index: number): TRecord {
  return {
    ...record,
    menuEntries: (record.menuEntries ?? []).filter((_, itemIndex) => itemIndex !== index),
  };
}

export function updateScriptEditorMenuEntryField<
  TRecord extends ScriptEditorCityRecord | ScriptEditorBuildingRecord,
>(
  record: TRecord,
  index: number,
  field:
    | "id"
    | "label"
    | "menuFamily"
    | "targetFamily"
    | "targetId"
    | "disabledHint",
  value: string
): TRecord {
  return {
    ...record,
    menuEntries: (record.menuEntries ?? []).map((entry, itemIndex) => {
      if (itemIndex !== index) {
        return entry;
      }
      if (field === "targetFamily") {
        return {
          ...entry,
          targetFamily: normalizeMenuTargetFamily(value),
        };
      }
      return {
        ...entry,
        [field]: value.trim(),
      };
    }),
  };
}

export function toggleScriptEditorMenuEntryFlag<
  TRecord extends ScriptEditorCityRecord | ScriptEditorBuildingRecord,
>(
  record: TRecord,
  index: number,
  field: "isVisible" | "isEnabled",
  checked: boolean
): TRecord {
  return {
    ...record,
    menuEntries: (record.menuEntries ?? []).map((entry, itemIndex) =>
      itemIndex === index ? { ...entry, [field]: checked } : entry
    ),
  };
}

export function updateScriptEditorAccessField<
  TRecord extends ScriptEditorCityRecord | ScriptEditorBuildingRecord,
>(
  record: TRecord,
  field: keyof ScriptEditorAccessRule | "state" | "blockedSpeaker",
  value: string
): TRecord {
  const access = normalizeAccessRule(record.access);
  if (field === "state") {
    return {
      ...record,
      access: {
        ...access,
        ...(value === "visible-disabled" || value === "hidden"
          ? { conditionExpression: { type: "literal", value: false } as const }
          : {}),
      },
    };
  }
  if (field === "conditionExpression") {
    return record;
  }
  return {
    ...record,
    access: {
      ...access,
      [field === "blockedSpeaker" ? "blockedSpeakerId" : field]: value,
    },
  };
}

export function updateScriptEditorBuildingEntryBindingField(
  building: ScriptEditorBuildingRecord,
  field: keyof ScriptEditorBuildingEntryBinding,
  value: string
): ScriptEditorBuildingRecord {
  return {
    ...building,
    entryBinding: {
      ...normalizeBuildingEntryBinding(building.entryBinding),
      [field]: value.trim(),
    },
  };
}

function normalizeAccessRule(access?: ScriptEditorAccessRule): ScriptEditorAccessRule {
  const rawAccess = access as (ScriptEditorAccessRule & Record<string, unknown>) | undefined;
  const conditionExpression =
    normalizeLocationAccessConditionExpression(rawAccess?.conditionExpression) ??
    normalizeLegacyAccessCondition(rawAccess?.state);
  return {
    ...(conditionExpression == null ? {} : { conditionExpression }),
    ...pickOptionalString("blockedReason", rawAccess?.blockedReason),
    ...pickOptionalString("blockedMessage", rawAccess?.blockedMessage),
    ...pickOptionalString("blockedSpeakerId", rawAccess?.blockedSpeakerId ?? rawAccess?.blockedSpeaker),
    ...pickOptionalString("guidance", rawAccess?.guidance),
    ...pickOptionalString("refusalEventId", rawAccess?.refusalEventId),
  };
}

function normalizeLegacyAccessCondition(
  value: unknown
): LocationAccessConditionExpression | undefined {
  return value === "visible-disabled" || value === "hidden"
    ? { type: "literal", value: false }
    : undefined;
}

function normalizeMenuEntries(
  entries: readonly ScriptEditorMenuEntry[] | undefined,
  idBase: string
): ScriptEditorMenuEntry[] {
  return (entries ?? []).map((entry, index) => ({
    id: normalizeString(entry.id, `${idBase}.${index + 1}`),
    label: normalizeString(entry.label, `Entry ${index + 1}`),
    menuFamily: normalizeString(entry.menuFamily, "management"),
    targetFamily: normalizeMenuTargetFamily(entry.targetFamily),
    targetId: normalizeOptionalString(entry.targetId),
    isVisible: entry.isVisible !== false,
    isEnabled: entry.isEnabled !== false,
    disabledHint: normalizeOptionalString(entry.disabledHint),
  }));
}

function normalizeBuildingEntryBinding(
  binding?: ScriptEditorBuildingEntryBinding
): ScriptEditorBuildingEntryBinding {
  return {
    defaultPersonId: normalizeOptionalString(binding?.defaultPersonId),
    onEnterEventId: normalizeOptionalString(binding?.onEnterEventId),
    onLeaveEventId: normalizeOptionalString(binding?.onLeaveEventId),
    returnTarget: normalizeString(binding?.returnTarget, "city"),
  };
}

function normalizeCityBaseAttributes(
  value: ScriptEditorCityRecord["baseAttributes"]
): NonNullable<ScriptEditorCityRecord["baseAttributes"]> {
  return {
    ...pickOptionalString("ownerFactionId", value?.ownerFactionId),
    ...(typeof value?.prosperity === "number" ? { prosperity: value.prosperity } : {}),
    ...(typeof value?.security === "number" ? { security: value.security } : {}),
    ...(typeof value?.population === "number" ? { population: value.population } : {}),
  };
}

function normalizeBuildingBaseAttributes(
  building: Partial<ScriptEditorBuildingRecord> & Record<string, unknown>
): NonNullable<ScriptEditorBuildingRecord["baseAttributes"]> {
  const base = (building.baseAttributes ?? {}) as Partial<
    NonNullable<ScriptEditorBuildingRecord["baseAttributes"]>
  >;
  return {
    houseType: normalizeHouseType(base.houseType ?? building.type),
    activityLocationId: normalizeActivityLocationId(
      base.activityLocationId ?? building.activityLocationId
    ),
    ...pickHouseModuleId(base.moduleId ?? building.moduleId),
    characterIds: normalizeStringArray(base.characterIds ?? building.characterIds),
    defaultCharacterId: normalizeNullableString(
      base.defaultCharacterId ?? building.defaultCharacterId
    ),
    ...(typeof base.level === "number" ? { level: base.level } : {}),
    ...(typeof base.damaged === "boolean" ? { damaged: base.damaged } : {}),
    ...(typeof base.outputMultiplier === "number"
      ? { outputMultiplier: base.outputMultiplier }
      : {}),
    visibleStoryStages: normalizeStringArray(
      base.visibleStoryStages ?? building.visibleStoryStages
    ),
    enterableStoryStages: normalizeStringArray(
      base.enterableStoryStages ?? building.enterableStoryStages
    ),
    requiresPlayerCurrentCityMatch:
      base.requiresPlayerCurrentCityMatch === true ||
      building.requiresPlayerCurrentCityMatch === true,
  };
}

function normalizeProfileMap<T extends { displayName?: string; description?: string; tags?: string[] }>(
  value: T | undefined,
  legacyDescription?: string
): T {
  return {
    ...pickOptionalString("displayName", value?.displayName),
    description:
      normalizeOptionalString(value?.description).length > 0
        ? normalizeOptionalString(value?.description)
        : normalizeOptionalString(legacyDescription),
    tags: normalizeStringArray(value?.tags),
  } as T;
}

function normalizeCustomAttributes(
  entries: readonly ScriptEditorCustomAttributeEntry[] | undefined
): ScriptEditorCustomAttributeEntry[] {
  return (entries ?? [])
    .map((entry) => ({
      key: normalizeOptionalString(entry.key),
      ...pickOptionalString("label", entry.label),
      value: normalizeCustomAttributeValue(entry.value),
    }))
    .filter((entry) => entry.key.length > 0);
}

function normalizeCustomAttributeValue(
  value: ScriptEditorCustomAttributeEntry["value"]
): ScriptEditorCustomAttributeEntry["value"] {
  if (
    value == null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string")
    : null;
}

function normalizeEventBindings(
  building: Partial<ScriptEditorBuildingRecord> & Record<string, unknown>
): ScriptEditorBuildingRecord["eventBindings"] | undefined {
  const eventBindings = building.eventBindings ?? {};
  const onEnterEventId = normalizeOptionalString(
    eventBindings.onEnterEventId ?? building.onEnterEventId
  );
  const onLeaveEventId = normalizeOptionalString(
    eventBindings.onLeaveEventId ?? building.onLeaveEventId
  );
  return onEnterEventId.length === 0 && onLeaveEventId.length === 0
    ? undefined
    : {
        ...(onEnterEventId.length === 0 ? {} : { onEnterEventId }),
        ...(onLeaveEventId.length === 0 ? {} : { onLeaveEventId }),
      };
}

function normalizeLocationAccessConditionExpression(
  value: unknown
): LocationAccessConditionExpression | undefined {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }
  const expression = value as Record<string, unknown>;
  if (expression.type === "literal" && typeof expression.value === "boolean") {
    return { type: "literal", value: expression.value };
  }
  return value as LocationAccessConditionExpression;
}

function readBackAction(value: unknown): HouseDefinition["backAction"] | undefined {
  if (value != null && typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    if (record.targetView === "city") {
      return {
        label: normalizeString(record.label, "返回"),
        targetView: "city",
      };
    }
  }
  return undefined;
}

function normalizeBackAction(value: unknown): HouseDefinition["backAction"] {
  return readBackAction(value) ?? createDefaultBackAction();
}

function normalizeHouseType(value: unknown): HouseDefinition["type"] {
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

function normalizeActivityLocationId(
  value: unknown
): HouseDefinition["activityLocationId"] {
  if (value === null) {
    return null;
  }
  switch (value) {
    case "tea-house":
    case "tavern":
    case "market":
    case "street":
    case "custom":
      return value as NonNullable<HouseDefinition["activityLocationId"]>;
    default:
      return "custom";
  }
}

function normalizeHouseModuleId(value: unknown): HouseDefinition["moduleId"] {
  switch (value) {
    case "home-house":
    case "keep-house":
    case "leader-residence":
    case "grain-shop":
    case "market-house":
    case "tea-house":
    case "tavern":
    case "temple-house":
    case "medicine-house":
      return value;
    default:
      return null;
  }
}

function pickHouseModuleId(value: unknown): Pick<
  NonNullable<ScriptEditorBuildingRecord["baseAttributes"]>,
  "moduleId"
> {
  const moduleId = normalizeHouseModuleId(value);
  return moduleId == null ? {} : { moduleId };
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((entry) => normalizeOptionalString(entry).trim())
    .filter((entry) => entry.length > 0);
}

function normalizeNullableString(value: unknown): string | null {
  const normalized = normalizeOptionalString(value).trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeMenuTargetFamily(value?: string): ScriptEditorMenuTargetFamily {
  return ["dialogue", "event", "trade", "minigame", "info"].includes(value ?? "")
    ? (value as ScriptEditorMenuTargetFamily)
    : "info";
}

function normalizeString(value: unknown, fallback: string): string {
  if (typeof value !== "string") {
    return fallback;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : fallback;
}

function normalizeOptionalString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function pickOptionalString<TKey extends string>(
  key: TKey,
  value: unknown
): Partial<Record<TKey, string>> {
  const normalized = normalizeOptionalString(value);
  return normalized.length === 0 ? {} : { [key]: normalized } as Partial<Record<TKey, string>>;
}

function slugifyMenuFamily(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "") || "menu"
  );
}
