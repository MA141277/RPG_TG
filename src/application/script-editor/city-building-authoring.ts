import type {
  ScriptEditorAccessRule,
  ScriptEditorAccessState,
  ScriptEditorBuildingEntryBinding,
  ScriptEditorBuildingRecord,
  ScriptEditorCityRecord,
  ScriptEditorMenuEntry,
  ScriptEditorMenuTargetFamily,
} from "../../domain/script-editor-project";

export const SCRIPT_EDITOR_CITY_DEFAULT_MENU_FAMILIES = [
  "风土人情",
  "情报",
  "地点",
  "管理",
] as const;

export const SCRIPT_EDITOR_BUILDING_DEFAULT_MENU_FAMILIES = [
  "对话",
  "交易",
  "工作",
  "休息",
  "情报",
  "小游戏",
  "管理",
  "离开",
] as const;

export const SCRIPT_EDITOR_ACCESS_STATES: readonly ScriptEditorAccessState[] = [
  "visible-enabled",
  "visible-disabled",
  "hidden",
] as const;

function createDefaultAccessRule(): ScriptEditorAccessRule {
  return {
    state: "visible-enabled",
    blockedMessage: "",
    blockedSpeaker: "",
    guidance: "",
  };
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

export function createDefaultScriptEditorCityRecord(index: number): ScriptEditorCityRecord {
  const suffix = index + 1;
  return {
    id: `city.new.${suffix}`,
    name: `新城市 ${suffix}`,
    description: "",
    menuEntries: SCRIPT_EDITOR_CITY_DEFAULT_MENU_FAMILIES.map((family) =>
      createDefaultMenuEntry(`city.new.${suffix}.menu`, family)
    ),
    access: createDefaultAccessRule(),
  };
}

export function createDefaultScriptEditorBuildingRecord(
  index: number,
  cityId = "city.start"
): ScriptEditorBuildingRecord {
  const suffix = index + 1;
  return {
    id: `building.new.${suffix}`,
    cityId,
    name: `新建筑 ${suffix}`,
    description: "",
    menuEntries: SCRIPT_EDITOR_BUILDING_DEFAULT_MENU_FAMILIES.map((family) =>
      createDefaultMenuEntry(`building.new.${suffix}.menu`, family)
    ),
    access: createDefaultAccessRule(),
    entryBinding: createDefaultBuildingEntryBinding(),
  };
}

export function normalizeScriptEditorCityRecord(
  city: Partial<ScriptEditorCityRecord> & { id: string }
): ScriptEditorCityRecord {
  return {
    ...city,
    name: normalizeString(city.name, city.id),
    description: normalizeOptionalString(city.description),
    menuEntries: normalizeMenuEntries(city.menuEntries, `${city.id}.menu`),
    access: normalizeAccessRule(city.access),
  };
}

export function normalizeScriptEditorBuildingRecord(
  building: Partial<ScriptEditorBuildingRecord> & { id: string }
): ScriptEditorBuildingRecord {
  return {
    ...building,
    cityId: normalizeString(building.cityId, "city.start"),
    name: normalizeString(building.name, building.id),
    description: normalizeOptionalString(building.description),
    menuEntries: normalizeMenuEntries(building.menuEntries, `${building.id}.menu`),
    access: normalizeAccessRule(building.access),
    entryBinding: normalizeBuildingEntryBinding(building.entryBinding),
  };
}

export function updateScriptEditorCityField(
  city: ScriptEditorCityRecord,
  field: "id" | "name" | "description",
  value: string
): ScriptEditorCityRecord {
  if (field === "description") {
    return { ...city, description: value };
  }
  return { ...city, [field]: value.trim() };
}

export function updateScriptEditorBuildingField(
  building: ScriptEditorBuildingRecord,
  field: "id" | "cityId" | "name" | "description",
  value: string
): ScriptEditorBuildingRecord {
  if (field === "description") {
    return { ...building, description: value };
  }
  return { ...building, [field]: value.trim() };
}

export function appendScriptEditorMenuEntry<
  TRecord extends ScriptEditorCityRecord | ScriptEditorBuildingRecord,
>(record: TRecord): TRecord {
  const nextIndex = (record.menuEntries?.length ?? 0) + 1;
  return {
    ...record,
    menuEntries: [
      ...(record.menuEntries ?? []),
      createDefaultMenuEntry(`${record.id}.menu`, `新入口 ${nextIndex}`),
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
  field: keyof ScriptEditorAccessRule,
  value: string
): TRecord {
  return {
    ...record,
    access: {
      ...normalizeAccessRule(record.access),
      [field]:
        field === "state" ? normalizeAccessState(value) : value,
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
  return {
    state: normalizeAccessState(access?.state),
    blockedMessage: normalizeOptionalString(access?.blockedMessage),
    blockedSpeaker: normalizeOptionalString(access?.blockedSpeaker),
    guidance: normalizeOptionalString(access?.guidance),
  };
}

function normalizeMenuEntries(
  entries: readonly ScriptEditorMenuEntry[] | undefined,
  idBase: string
): ScriptEditorMenuEntry[] {
  return (entries ?? []).map((entry, index) => ({
    id: normalizeString(entry.id, `${idBase}.${index + 1}`),
    label: normalizeString(entry.label, `入口 ${index + 1}`),
    menuFamily: normalizeString(entry.menuFamily, "管理"),
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

function normalizeAccessState(value?: string): ScriptEditorAccessState {
  return SCRIPT_EDITOR_ACCESS_STATES.includes(value as ScriptEditorAccessState)
    ? (value as ScriptEditorAccessState)
    : "visible-enabled";
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

function slugifyMenuFamily(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "") || "menu";
}
