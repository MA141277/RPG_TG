import type {
  CharacterDefinition,
  CharacterStats,
  SkillKey,
} from "../../../domain/character";
import type {
  ScriptEditorPersonRecord,
  ScriptEditorPersonLegacyFieldSet,
  ScriptEditorTypedAttributeRecord,
  ScriptEditorTypedAttributeType,
} from "../domain/script-editor-project";
import { createDefaultScriptEditorCanonicalId } from "./script-editor-id-allocation";

export const SCRIPT_EDITOR_PERSON_TAB_KEYS = [
  "profile",
  "attribute-group",
  "dialogues",
  "trade",
  "events",
] as const;

export type ScriptEditorPersonTabKey =
  (typeof SCRIPT_EDITOR_PERSON_TAB_KEYS)[number];

const SCRIPT_EDITOR_PERSON_ATTRIBUTE_EXCLUDED_ROOT_KEYS = new Set([
  "id",
  "name",
  "personType",
  "role",
  "biography",
  "cityId",
  "houseId",
  "portraitId",
  "portraitVariantId",
  "portraitVariants",
  "attributeGroup",
  "attributeGroups",
  "attributeMappings",
  "attributeValues",
  "extendedAttributes",
  "dialogueIds",
  "eventIds",
  "tradeBinding",
]);

const SCRIPT_EDITOR_PERSON_FIXED_ATTRIBUTE_KEYS = new Set([
  "cityId",
  "houseId",
  "portraitId",
  "portraitVariantId",
]);

const SCRIPT_EDITOR_PERSON_ATTRIBUTE_LABELS: Record<string, string> = {
  title: "正式身份",
  occupation: "职业/定位",
  age: "年龄",
  birthYear: "出生年",
  deathYear: "去世年",
  clanId: "所属",
  stamina: "体力",
  "stats.leadership": "统率",
  "stats.martial": "武勇",
  "stats.intelligence": "智略",
  "stats.politics": "政务",
  "stats.charm": "魅力",
  "stats.fame": "名声",
};

const DEFAULT_CHARACTER_STATS: CharacterStats = {
  leadership: 0,
  martial: 0,
  intelligence: 0,
  politics: 0,
  charm: 0,
  fame: 0,
  gold: 0,
};

const DEFAULT_CHARACTER_SKILLS: Record<SkillKey, number> = {
  ashigaru: 0,
  horse: 0,
  teppo: 0,
  navy: 0,
  archery: 0,
  martial: 0,
  military: 0,
  ninjutsu: 0,
  construction: 0,
  development: 0,
  mining: 0,
  arithmetic: 0,
  etiquette: 0,
  rhetoric: 0,
  tea: 0,
  medicine: 0,
};

export type ScriptEditorPersonRuntimeDefaults = {
  cityId?: string;
  portraitId?: string;
};

export type NormalizeScriptEditorPersonRecordOptions = {
  portraitVariants?: CharacterDefinition["portraitVariants"];
};

export function normalizeScriptEditorPersonRecord(
  value: Record<string, unknown>,
  _options: NormalizeScriptEditorPersonRecordOptions = {}
): ScriptEditorPersonRecord {
  const { portraitVariants: _portraitVariants, ...valueWithoutPortraitVariants } =
    value as Record<string, unknown>;
  const personType = value.personType === "角色" ? "角色" : "NPC";
  const role =
    typeof value.role === "string" && value.role.length > 0
      ? value.role
      : personType === "角色"
        ? "playable"
        : "support";

  return materializeScriptEditorPersonExtendedAttributes({
    ...valueWithoutPortraitVariants,
    id: readString(value.id, "person.unknown"),
    name: readString(value.name, "未命名人物"),
    personType,
    attributeGroup: normalizePersonAttributeGroupRecord(
      value.attributeGroup,
      value.attributeGroups
    ),
    attributeMappings: mergePersonAttributeMappings(
      normalizePersonAttributeMappings(value.attributeMappings),
      mergeScriptEditorPersonExtendedAttributes(
        normalizeKeyValueEntries(value.extendedAttributes),
        collectScriptEditorPersonImportedAttributes(valueWithoutPortraitVariants)
      )
    ),
    attributeValues: mergePersonAttributeValues(
      normalizePersonAttributeValues(value.attributeValues),
      mergeScriptEditorPersonExtendedAttributes(
        normalizeKeyValueEntries(value.extendedAttributes),
        collectScriptEditorPersonImportedAttributes(valueWithoutPortraitVariants)
      )
    ),
    role,
    title: readString(value.title, ""),
    occupation: readString(value.occupation, ""),
    biography: readString(value.biography, ""),
    cityId: readString(value.cityId, ""),
    houseId: readString(value.houseId, ""),
    portraitId: readString(value.portraitId, ""),
    portraitVariantId: readString(value.portraitVariantId, ""),
    dialogueIds: normalizeStringArray(value.dialogueIds),
    eventIds: normalizeStringArray(value.eventIds),
    tradeBinding: normalizeTradeBinding(value.tradeBinding),
  });
}

export function readScriptEditorPersonStringField(
  person: ScriptEditorPersonRecord,
  field: string,
  fallback = ""
): string {
  const value = person[field];
  return typeof value === "string" ? value : fallback;
}

export function readScriptEditorPersonStringArrayField(
  person: ScriptEditorPersonRecord,
  field: string
): string[] {
  return normalizeStringArray(person[field]);
}

export function readScriptEditorPersonTypedAttributes(
  person: ScriptEditorPersonRecord
): ScriptEditorTypedAttributeRecord[] {
  return readScriptEditorPersonAuthoringAttributes(person);
}

export function createDefaultScriptEditorPersonRecord(
  indexOrId: number | string
): ScriptEditorPersonRecord {
  const suffix =
    typeof indexOrId === "number" ? indexOrId + 1 : 1;
  return {
    id:
      typeof indexOrId === "string"
        ? indexOrId
        : createDefaultScriptEditorCanonicalId("people", indexOrId),
    attributeGroup: {},
    attributeMappings: [],
    attributeValues: [],
    name: `人物 ${suffix}`,
    personType: suffix === 1 ? "角色" : "NPC",
    role: suffix === 1 ? "playable" : "support",
    title: "",
    occupation: "",
    biography: "",
    cityId: "",
    houseId: "",
    portraitId: "",
    portraitVariantId: "",
    dialogueIds: [],
    eventIds: [],
    tradeBinding: {
      enabled: false,
      entryId: "",
    },
  };
}

export function materializeScriptEditorPersonRuntimeCharacter(
  person: ScriptEditorPersonRecord,
  defaults: ScriptEditorPersonRuntimeDefaults = {}
): CharacterDefinition {
  const normalizedPerson = normalizeScriptEditorPersonRecord(
    person as Record<string, unknown>
  ) as ScriptEditorPersonRecord & Partial<CharacterDefinition>;
  const {
    attributeGroup: authoringAttributeGroup,
    attributeGroups: _legacyAttributeGroups,
    ...runtimeCompatiblePerson
  } = normalizedPerson as ScriptEditorPersonRecord &
    Partial<CharacterDefinition> & { attributeGroups?: CharacterDefinition["attributeGroups"] };
  const stats = normalizeCharacterStats(normalizedPerson.stats);
  const skills = normalizeCharacterSkills(normalizedPerson.skills);
  const runtimeAttributeGroups = convertAuthoringAttributeGroupToRuntimeGroups(
    authoringAttributeGroup ?? {}
  );

  return {
    ...runtimeCompatiblePerson,
    id: normalizedPerson.id,
    name: normalizedPerson.name,
    birthYear: readFiniteNumber(normalizedPerson.birthYear, 0),
    deathYear:
      normalizedPerson.deathYear == null
        ? null
        : readFiniteNumber(normalizedPerson.deathYear, 0),
    age: readFiniteNumber(normalizedPerson.age, 0),
    cityId:
      typeof normalizedPerson.cityId === "string" &&
      normalizedPerson.cityId.length > 0
        ? normalizedPerson.cityId
        : (defaults.cityId ?? ""),
    portraitId:
      typeof normalizedPerson.portraitId === "string" &&
      normalizedPerson.portraitId.length > 0
        ? normalizedPerson.portraitId
        : (defaults.portraitId ?? ""),
    stats,
    stamina: readFiniteNumber(normalizedPerson.stamina, 100),
    availableFunctions: Array.isArray(normalizedPerson.availableFunctions)
      ? normalizedPerson.availableFunctions
      : [],
    ...(runtimeAttributeGroups.length > 0
      ? {
          attributeGroups: runtimeAttributeGroups,
        }
      : {}),
    skills,
    ...(normalizedPerson.personType == null
      ? {}
      : { personType: normalizedPerson.personType }),
    ...(normalizedPerson.role == null ? {} : { role: normalizedPerson.role }),
    ...(normalizedPerson.houseId == null
      ? {}
      : { houseId: normalizedPerson.houseId }),
    portraitVariantId: normalizedPerson.portraitVariantId ?? null,
  } as CharacterDefinition;
}

export function updateScriptEditorPersonField(
  person: ScriptEditorPersonRecord,
  field: string,
  value: string
): ScriptEditorPersonRecord {
  const normalizedValue = value.trim();

  switch (field) {
    case "id":
      return materializeScriptEditorPersonExtendedAttributes({
        ...person,
        id: normalizedValue,
      });
    case "name":
      return materializeScriptEditorPersonExtendedAttributes({
        ...person,
        name: value,
      });
    case "personType":
      return materializeScriptEditorPersonExtendedAttributes({
        ...person,
        personType: normalizedValue === "角色" ? "角色" : "NPC",
        role: normalizedValue === "角色" ? "playable" : "support",
      });
    case "title":
      return updateScriptEditorPersonMappedAttribute(person, "title", value);
    case "birthYear":
      return updateScriptEditorPersonMappedAttribute(person, "birthYear", normalizedValue);
    case "deathYear":
      return updateScriptEditorPersonMappedAttribute(person, "deathYear", normalizedValue);
    case "age":
      return updateScriptEditorPersonMappedAttribute(person, "age", normalizedValue);
    case "clanId":
      return updateScriptEditorPersonMappedAttribute(person, "clanId", value);
    case "occupation":
      return updateScriptEditorPersonMappedAttribute(person, "occupation", value);
    case "affiliationLabel":
      return updateScriptEditorPersonMappedAttribute(
        person,
        "affiliationLabel",
        value
      );
    case "biography":
      return materializeScriptEditorPersonExtendedAttributes({
        ...person,
        biography: value,
      });
    case "cityId":
      return materializeScriptEditorPersonExtendedAttributes({
        ...person,
        cityId: normalizedValue,
        houseId: "",
      });
    case "houseId":
      return materializeScriptEditorPersonExtendedAttributes({
        ...person,
        houseId: normalizedValue,
      });
    case "portraitId":
      return materializeScriptEditorPersonExtendedAttributes({
        ...person,
        portraitId: normalizedValue,
        portraitVariantId: "",
      });
    case "portraitVariantId":
      return materializeScriptEditorPersonExtendedAttributes({
        ...person,
        portraitVariantId: normalizedValue,
      });
    case "isHistoricalFigure":
      return updateScriptEditorPersonMappedAttribute(
        person,
        "isHistoricalFigure",
        normalizedValue
      );
    case "stamina":
      return updateScriptEditorPersonMappedAttribute(person, "stamina", normalizedValue);
    case "stats.leadership":
    case "stats.martial":
    case "stats.intelligence":
    case "stats.politics":
    case "stats.charm":
    case "stats.fame":
    case "skills.ashigaru":
    case "skills.horse":
    case "skills.teppo":
    case "skills.navy":
    case "skills.archery":
    case "skills.martial":
    case "skills.military":
    case "skills.ninjutsu":
    case "skills.construction":
    case "skills.development":
    case "skills.mining":
    case "skills.etiquette":
    case "skills.tea":
      return updateScriptEditorPersonMappedAttribute(person, field, normalizedValue);
    case "tradeBinding.entryId":
      return materializeScriptEditorPersonExtendedAttributes({
        ...person,
        tradeBinding: {
          ...normalizeTradeBinding(person.tradeBinding),
          entryId: normalizedValue,
        },
      });
    default:
      return person;
  }
}

export function toggleScriptEditorPersonTradeEnabled(
  person: ScriptEditorPersonRecord,
  enabled: boolean
): ScriptEditorPersonRecord {
  return materializeScriptEditorPersonExtendedAttributes({
    ...person,
    tradeBinding: {
      ...normalizeTradeBinding(person.tradeBinding),
      enabled,
    },
  });
}

export function appendScriptEditorPersonAttribute(
  person: ScriptEditorPersonRecord,
  type: ScriptEditorTypedAttributeType = "string"
): ScriptEditorPersonRecord {
  const nextKey = allocateNextScriptEditorPersonAttributeKey(person);
  const nextValue =
    type === "number" ? 0 : type === "boolean" ? false : "";
  return materializeScriptEditorPersonExtendedAttributes({
    ...person,
    attributeMappings: [
      ...normalizePersonAttributeMappings(person.attributeMappings),
      {
        key: nextKey,
        keyName: "",
        type: normalizeTypedAttributeType(type),
      },
    ],
    attributeValues: [
      ...normalizePersonAttributeValues(person.attributeValues),
      { key: nextKey, value: nextValue },
    ],
  });
}

export function removeScriptEditorPersonAttribute(
  person: ScriptEditorPersonRecord,
  index: number
): ScriptEditorPersonRecord {
  const mappings = normalizePersonAttributeMappings(person.attributeMappings);
  const removedKey = mappings[index]?.key ?? "";
  const nextAttributeGroup = removeScriptEditorPersonAttributeGroupKey(
    normalizePersonAttributeGroupRecord(person.attributeGroup),
    removedKey
  );

  return materializeScriptEditorPersonExtendedAttributes({
    ...person,
    attributeGroup: nextAttributeGroup,
    attributeMappings: mappings.filter((_, entryIndex) => entryIndex !== index),
    attributeValues: normalizePersonAttributeValues(person.attributeValues).filter(
      (entry) => entry.key !== removedKey
    ),
  });
}

export function updateScriptEditorPersonAttribute(
  person: ScriptEditorPersonRecord,
  index: number,
  field: keyof ScriptEditorTypedAttributeRecord | "key" | "key-name",
  value: string
): ScriptEditorPersonRecord {
  const mappings = normalizePersonAttributeMappings(person.attributeMappings);
  const mapping = mappings[index];
  if (mapping == null) {
    return person;
  }
  const normalizedField = field === "label" ? "key-name" : field;
  const normalizedType =
    normalizedField === "type"
      ? normalizeTypedAttributeType(value)
      : mapping.type;
  const nextMappings = mappings.map((entry, entryIndex) =>
    entryIndex === index
      ? {
          ...entry,
          ...(normalizedField === "key"
            ? { key: value.trim() }
            : normalizedField === "key-name"
              ? { keyName: value }
              : normalizedField === "type"
                ? { type: normalizedType }
                : {}),
        }
      : entry
  );
  const currentKey = mapping.key;
  const nextKey = nextMappings[index]?.key ?? currentKey;
  const existingValues = normalizePersonAttributeValues(person.attributeValues).filter(
    (entry) => entry.key !== currentKey
  );
  const currentValue =
    normalizePersonAttributeValues(person.attributeValues).find(
      (entry) => entry.key === currentKey
    )?.value ?? "";
  const nextRawValue =
    normalizedField === "value"
      ? normalizeTypedAttributeValue(normalizedType, value)
      : normalizedField === "type"
        ? normalizeTypedAttributeValue(normalizedType, currentValue)
        : currentValue;

  return materializeScriptEditorPersonExtendedAttributes({
    ...person,
    attributeMappings: nextMappings,
    attributeValues: [...existingValues, { key: nextKey, value: nextRawValue }],
    attributeGroup: renameScriptEditorPersonAttributeGroupKey(
      normalizePersonAttributeGroupRecord(person.attributeGroup),
      currentKey,
      nextKey
    ),
  });
}

export function appendScriptEditorPersonAttributeGroup(
  person: ScriptEditorPersonRecord
): ScriptEditorPersonRecord {
  const attributeGroup = normalizePersonAttributeGroupRecord(person.attributeGroup);
  const numericKeys = Object.keys(attributeGroup)
    .map((entry) => Number.parseInt(entry, 10))
    .filter((entry) => Number.isInteger(entry) && entry >= 0);
  const nextGroupId = String((numericKeys.length === 0 ? 1000 : Math.max(...numericKeys)) + 1);

  return materializeScriptEditorPersonExtendedAttributes({
    ...person,
    attributeGroup: {
      ...attributeGroup,
      [nextGroupId]: {
        title: "",
        order: Object.keys(attributeGroup).length,
        attributeKeys: [],
      },
    },
  });
}

export function removeScriptEditorPersonAttributeGroup(
  person: ScriptEditorPersonRecord,
  groupId: string
): ScriptEditorPersonRecord {
  const attributeGroup = { ...normalizePersonAttributeGroupRecord(person.attributeGroup) };
  delete attributeGroup[groupId];
  return materializeScriptEditorPersonExtendedAttributes({
    ...person,
    attributeGroup,
  });
}

export function updateScriptEditorPersonAttributeGroupField(
  person: ScriptEditorPersonRecord,
  groupId: string,
  field: "title",
  value: string
): ScriptEditorPersonRecord {
  const currentGroup = normalizePersonAttributeGroupRecord(person.attributeGroup)[groupId];
  if (currentGroup == null) {
    return person;
  }

  return materializeScriptEditorPersonExtendedAttributes({
    ...person,
    attributeGroup: {
      ...normalizePersonAttributeGroupRecord(person.attributeGroup),
      [groupId]: {
        ...currentGroup,
        [field]: value,
      },
    },
  });
}

export function toggleScriptEditorPersonAttributeGroupItem(
  person: ScriptEditorPersonRecord,
  groupId: string,
  attributeKey: string,
  enabled: boolean
): ScriptEditorPersonRecord {
  const attributeGroup = normalizePersonAttributeGroupRecord(person.attributeGroup);
  const currentGroup = attributeGroup[groupId];
  if (currentGroup == null || attributeKey.trim().length === 0) {
    return person;
  }

  const nextKeys = enabled
    ? Array.from(new Set([...currentGroup.attributeKeys, attributeKey]))
    : currentGroup.attributeKeys.filter((key) => key !== attributeKey);

  return materializeScriptEditorPersonExtendedAttributes({
    ...person,
    attributeGroup: {
      ...attributeGroup,
      [groupId]: {
        ...currentGroup,
        attributeKeys: nextKeys,
      },
    },
  });
}

export function appendScriptEditorPersonRelation(
  person: ScriptEditorPersonRecord,
  family: "dialogueIds" | "eventIds"
): ScriptEditorPersonRecord {
  return {
    ...person,
    [family]: [...normalizeStringArray(person[family]), ""],
  };
}

export function removeScriptEditorPersonRelation(
  person: ScriptEditorPersonRecord,
  family: "dialogueIds" | "eventIds",
  index: number
): ScriptEditorPersonRecord {
  return {
    ...person,
    [family]: normalizeStringArray(person[family]).filter(
      (_, entryIndex) => entryIndex !== index
    ),
  };
}

export function updateScriptEditorPersonRelation(
  person: ScriptEditorPersonRecord,
  family: "dialogueIds" | "eventIds",
  index: number,
  value: string
): ScriptEditorPersonRecord {
  return {
    ...person,
    [family]: normalizeStringArray(person[family]).map((entry, entryIndex) =>
      entryIndex === index ? value.trim() : entry
    ),
  };
}

function updateScriptEditorPersonMappedAttribute(
  person: ScriptEditorPersonRecord,
  keyPath: string,
  value: string
): ScriptEditorPersonRecord {
  const normalizedKey = keyPath.trim();
  if (normalizedKey.length === 0) {
    return person;
  }

  const mappings = normalizePersonAttributeMappings(person.attributeMappings);
  const existingIndex = mappings.findIndex(
    (entry) => entry.key.trim() === normalizedKey
  );
  const nextMapping = {
    key: normalizedKey,
    keyName: getScriptEditorPersonAttributeLabel(normalizedKey),
    type: inferScriptEditorPersonAttributeType(normalizedKey, value),
  };
  const nextMappings =
    existingIndex >= 0
      ? mappings.map((entry, index) =>
          index === existingIndex
            ? {
                ...entry,
                key: normalizedKey,
              }
            : entry
        )
      : [...mappings, nextMapping];
  const nextValues = normalizePersonAttributeValues(person.attributeValues).filter(
    (entry) => entry.key !== normalizedKey
  );
  nextValues.push({
    key: normalizedKey,
    value: normalizeTypedAttributeValue(nextMapping.type, value),
  });

  return materializeScriptEditorPersonExtendedAttributes({
    ...person,
    attributeMappings: nextMappings,
    attributeValues: nextValues,
  });
}

function normalizeTradeBinding(value: unknown) {
  const tradeBinding =
    value != null && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  return {
    enabled: tradeBinding.enabled === true,
    entryId: readString(tradeBinding.entryId, ""),
  };
}

function collectScriptEditorPersonImportedAttributes(
  value: Record<string, unknown>
): ScriptEditorTypedAttributeRecord[] {
  const entries: ScriptEditorTypedAttributeRecord[] = [];

  for (const [key, nestedValue] of Object.entries(value)) {
    if (SCRIPT_EDITOR_PERSON_ATTRIBUTE_EXCLUDED_ROOT_KEYS.has(key)) {
      continue;
    }

    appendScriptEditorPersonImportedAttribute(entries, key, nestedValue);
  }

  return entries;
}

function appendScriptEditorPersonImportedAttribute(
  entries: ScriptEditorTypedAttributeRecord[],
  keyPath: string,
  value: unknown
): void {
  if (value == null || Array.isArray(value)) {
    return;
  }

  if (typeof value === "object") {
    for (const [nestedKey, nestedValue] of Object.entries(
      value as Record<string, unknown>
    )) {
      appendScriptEditorPersonImportedAttribute(
        entries,
        `${keyPath}.${nestedKey}`,
        nestedValue
      );
    }
    return;
  }

  const type = inferScriptEditorPersonAttributeType(keyPath, value);
  entries.push({
    key: keyPath,
    label: getScriptEditorPersonAttributeLabel(keyPath),
    type,
    value: normalizeTypedAttributeValue(type, value),
  });
}

function mergeScriptEditorPersonExtendedAttributes(
  existing: ScriptEditorTypedAttributeRecord[],
  imported: ScriptEditorTypedAttributeRecord[]
): ScriptEditorTypedAttributeRecord[] {
  const merged = normalizeKeyValueEntries(existing);
  const existingEntryIndexByKey = new Map<string, number>();

  merged.forEach((entry, index) => {
    const normalizedKey = entry.key.trim();
    if (normalizedKey.length === 0) {
      return;
    }

    existingEntryIndexByKey.set(normalizedKey, index);
  });

  for (const entry of imported) {
    const normalizedKey = entry.key.trim();
    if (normalizedKey.length === 0) {
      continue;
    }

    const existingIndex = existingEntryIndexByKey.get(normalizedKey);
    if (existingIndex != null) {
      const existingEntry = merged[existingIndex];
      if (
        existingEntry != null &&
        (existingEntry.label ?? "").trim().length === 0 &&
        (entry.label ?? "").trim().length > 0
      ) {
        merged[existingIndex] = {
          ...existingEntry,
          label: entry.label,
        };
      }
      continue;
    }

    merged.push({
      key: normalizedKey,
      label: entry.label,
      type: entry.type,
      value: entry.value,
    });
    existingEntryIndexByKey.set(normalizedKey, merged.length - 1);
  }

  return merged;
}

function readScriptEditorPersonAuthoringAttributes(
  person: Pick<
    ScriptEditorPersonRecord,
    "attributeMappings" | "attributeValues"
  >
): ScriptEditorTypedAttributeRecord[] {
  const valuesByKey = new Map(
    normalizePersonAttributeValues(person.attributeValues).map((entry) => [
      entry.key,
      entry.value,
    ])
  );

  return normalizePersonAttributeMappings(person.attributeMappings).map((entry) => ({
    key: entry.key,
    label: entry.keyName,
    type: entry.type,
    value: normalizeTypedAttributeValue(entry.type, valuesByKey.get(entry.key)),
    ...(entry.type === "enum" && entry.options != null
      ? { options: [...entry.options] }
      : {}),
  }));
}

function mergePersonAttributeMappings(
  existing: ScriptEditorPersonRecord["attributeMappings"],
  imported: ScriptEditorTypedAttributeRecord[]
): ScriptEditorPersonRecord["attributeMappings"] {
  const normalizedExisting = normalizePersonAttributeMappings(existing);
  const existingKeys = new Set(normalizedExisting.map((entry) => entry.key.trim()));
  const merged = [...normalizedExisting];

  for (const entry of imported) {
    const key = entry.key.trim();
    if (key.length === 0 || existingKeys.has(key)) {
      continue;
    }
    merged.push({
      key,
      keyName: entry.label ?? getScriptEditorPersonAttributeLabel(key),
      type: entry.type,
      ...(entry.type === "enum" && entry.options != null
        ? { options: [...entry.options] }
        : {}),
    });
    existingKeys.add(key);
  }

  return merged;
}

function mergePersonAttributeValues(
  existing: ScriptEditorPersonRecord["attributeValues"],
  imported: ScriptEditorTypedAttributeRecord[]
): ScriptEditorPersonRecord["attributeValues"] {
  const valuesByKey = new Map(
    normalizePersonAttributeValues(existing).map((entry) => [entry.key.trim(), entry.value])
  );

  for (const entry of imported) {
    const key = entry.key.trim();
    if (key.length === 0 || valuesByKey.has(key)) {
      continue;
    }
    valuesByKey.set(key, normalizeTypedAttributeValue(entry.type, entry.value));
  }

  return Array.from(valuesByKey.entries()).map(([key, value]) => ({ key, value }));
}

function materializeScriptEditorPersonExtendedAttributes(
  person: ScriptEditorPersonRecord & ScriptEditorPersonLegacyFieldSet
): ScriptEditorPersonRecord {
  const attributeMappings = normalizePersonAttributeMappings(person.attributeMappings);
  const attributeValues = normalizePersonAttributeValues(person.attributeValues);
  const attributeGroup = normalizePersonAttributeGroupRecord(person.attributeGroup);
  const extendedAttributes = readScriptEditorPersonAuthoringAttributes({
    ...person,
    attributeMappings,
    attributeValues,
    attributeGroup,
  } as ScriptEditorPersonRecord);
  const nextPerson = {
    ...person,
    attributeGroup,
    attributeMappings,
    attributeValues,
    extendedAttributes,
  } as ScriptEditorPersonRecord;
  const existingLeafEntries = collectScriptEditorPersonImportedAttributes(
    nextPerson as Record<string, unknown>
  );
  const previousValues = new Map(
    existingLeafEntries.map((entry) => [
      entry.key,
      readScriptEditorPersonValueAtPath(
        nextPerson as Record<string, unknown>,
        entry.key
      ),
    ])
  );

  for (const entry of existingLeafEntries) {
    deleteScriptEditorPersonValueAtPath(
      nextPerson as Record<string, unknown>,
      entry.key
    );
  }

  for (const entry of extendedAttributes) {
    const normalizedKey = entry.key.trim();
    if (normalizedKey.length === 0 || /^\d+$/.test(normalizedKey)) {
      continue;
    }

    const parsedValue = parseScriptEditorPersonAttributeValue(
      normalizedKey,
      entry.value,
      previousValues.get(normalizedKey)
    );
    if (parsedValue === undefined) {
      continue;
    }

    writeScriptEditorPersonValueAtPath(
      nextPerson as Record<string, unknown>,
      normalizedKey,
      parsedValue
    );
  }

  return nextPerson;
}

function parseScriptEditorPersonAttributeValue(
  keyPath: string,
  value: string | number | boolean | undefined,
  previousValue: unknown
): string | number | boolean | null | undefined {
  const normalizedValue = String(value ?? "").trim();

  if (
    typeof previousValue === "number" ||
    isScriptEditorPersonNumericAttribute(keyPath)
  ) {
    if (normalizedValue.length === 0) {
      return undefined;
    }

    const numericValue = Number(normalizedValue);
    return Number.isFinite(numericValue) ? numericValue : value;
  }

  if (typeof previousValue === "boolean" || typeof value === "boolean") {
    if (typeof value === "boolean") {
      return value;
    }
    if (normalizedValue === "true") {
      return true;
    }
    if (normalizedValue === "false") {
      return false;
    }
  }

  if (previousValue === null && normalizedValue.length === 0) {
    return null;
  }

  return value;
}

function isScriptEditorPersonNumericAttribute(keyPath: string): boolean {
  return (
    keyPath === "birthYear" ||
    keyPath === "deathYear" ||
    keyPath === "age" ||
    keyPath === "stamina" ||
    keyPath.startsWith("stats.") ||
    keyPath.startsWith("skills.")
  );
}

function normalizeCharacterStats(value: unknown): CharacterStats {
  const source =
    value != null && typeof value === "object" && !Array.isArray(value)
      ? (value as Partial<Record<keyof CharacterStats, unknown>>)
      : {};

  return Object.fromEntries(
    Object.entries(DEFAULT_CHARACTER_STATS).map(([key, fallback]) => [
      key,
      readFiniteNumber(source[key as keyof CharacterStats], fallback),
    ])
  ) as CharacterStats;
}

function normalizeCharacterSkills(value: unknown): Record<SkillKey, number> {
  const source =
    value != null && typeof value === "object" && !Array.isArray(value)
      ? (value as Partial<Record<SkillKey, unknown>>)
      : {};

  return Object.fromEntries(
    Object.entries(DEFAULT_CHARACTER_SKILLS).map(([key, fallback]) => [
      key,
      readFiniteNumber(source[key as SkillKey], fallback),
    ])
  ) as Record<SkillKey, number>;
}

function readFiniteNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function readScriptEditorPersonValueAtPath(
  value: Record<string, unknown>,
  keyPath: string
): unknown {
  return keyPath.split(".").reduce<unknown>((currentValue, segment) => {
    if (
      currentValue == null ||
      typeof currentValue !== "object" ||
      Array.isArray(currentValue)
    ) {
      return undefined;
    }

    return (currentValue as Record<string, unknown>)[segment];
  }, value);
}

function writeScriptEditorPersonValueAtPath(
  target: Record<string, unknown>,
  keyPath: string,
  value: unknown
): void {
  const segments = keyPath.split(".");
  let currentTarget: Record<string, unknown> = target;

  for (const segment of segments.slice(0, -1)) {
    const nextTarget =
      currentTarget[segment] != null &&
      typeof currentTarget[segment] === "object" &&
      !Array.isArray(currentTarget[segment])
        ? (currentTarget[segment] as Record<string, unknown>)
        : {};
    currentTarget[segment] = nextTarget;
    currentTarget = nextTarget;
  }

  currentTarget[segments.at(-1) ?? keyPath] = value;
}

function deleteScriptEditorPersonValueAtPath(
  target: Record<string, unknown>,
  keyPath: string
): void {
  const segments = keyPath.split(".");
  const parents: Record<string, unknown>[] = [target];
  let currentTarget: Record<string, unknown> | null = target;

  for (const segment of segments.slice(0, -1)) {
    const nextTarget: Record<string, unknown> | null =
      currentTarget != null &&
      currentTarget[segment] != null &&
      typeof currentTarget[segment] === "object" &&
      !Array.isArray(currentTarget[segment])
        ? (currentTarget[segment] as Record<string, unknown>)
        : null;
    if (nextTarget == null) {
      return;
    }

    parents.push(nextTarget);
    currentTarget = nextTarget;
  }

  if (currentTarget == null) {
    return;
  }

  delete currentTarget[segments.at(-1) ?? keyPath];

  for (let index = segments.length - 2; index >= 0; index -= 1) {
    const parent = parents[index];
    const segment = segments[index];
    if (parent == null || segment == null) {
      continue;
    }
    const nestedValue = parent[segment];
    if (
      nestedValue != null &&
      typeof nestedValue === "object" &&
      !Array.isArray(nestedValue) &&
      Object.keys(nestedValue as Record<string, unknown>).length === 0
    ) {
      delete parent[segment];
    }
  }
}

function normalizeKeyValueEntries(value: unknown): ScriptEditorTypedAttributeRecord[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (entry) => entry != null && typeof entry === "object" && !Array.isArray(entry)
    )
    .map((entry) =>
      normalizeScriptEditorPersonAttributeEntry(entry as Record<string, unknown>)
    )
    .filter(
      (entry) => !SCRIPT_EDITOR_PERSON_FIXED_ATTRIBUTE_KEYS.has(entry.key.trim())
    );
}

function normalizeScriptEditorPersonAttributeEntry(
  entry: Record<string, unknown>
): ScriptEditorTypedAttributeRecord {
  const key = readString(entry.key, "");
  const type = normalizeTypedAttributeType(entry.type);
  const value = normalizeTypedAttributeValue(type, entry.value);
  return {
    key,
    label: readString(entry.label, ""),
    type,
    value,
    ...(type === "enum" && Array.isArray(entry.options)
      ? {
          options: entry.options
            .filter((option) => typeof option === "string")
            .map((option) => option.trim())
            .filter((option) => option.length > 0),
        }
      : {}),
  };
}

function normalizeTypedAttributeType(value: unknown): ScriptEditorTypedAttributeType {
  return value === "number" ||
    value === "boolean" ||
    value === "enum" ||
    value === "string"
    ? value
    : "string";
}

function normalizeTypedAttributeValue(
  type: ScriptEditorTypedAttributeType,
  value: unknown
): string | number | boolean {
  if (type === "number") {
    const numberValue = Number(String(value ?? "").trim());
    return Number.isFinite(numberValue) ? numberValue : 0;
  }
  if (type === "boolean") {
    return value === true || String(value).trim() === "true";
  }
  return readString(value, "");
}

function inferScriptEditorPersonAttributeType(
  keyPath: string,
  value: unknown
): ScriptEditorTypedAttributeType {
  if (typeof value === "number" || isScriptEditorPersonNumericAttribute(keyPath)) {
    return "number";
  }
  if (typeof value === "boolean") {
    return "boolean";
  }
  return "string";
}

function getScriptEditorPersonAttributeLabel(keyPath: string): string {
  const mappedLabel = SCRIPT_EDITOR_PERSON_ATTRIBUTE_LABELS[keyPath];
  if (typeof mappedLabel === "string" && mappedLabel.length > 0) {
    return mappedLabel;
  }

  const normalizedPath = keyPath.trim();
  if (normalizedPath.length === 0) {
    return "";
  }

  const leafSegment = normalizedPath.split(".").at(-1) ?? normalizedPath;
  const spacedLeaf = leafSegment
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();

  return spacedLeaf.length > 0 ? spacedLeaf : normalizedPath;
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry) => typeof entry === "string")
    .map((entry) => entry.trim());
}

function normalizePersonAttributeGroupRecord(
  value: unknown,
  legacyValue?: unknown
): ScriptEditorPersonRecord["attributeGroup"] {
  if (value != null && typeof value === "object" && !Array.isArray(value)) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key]) => key.trim().length > 0)
        .map(([key, entry]) => {
          const record =
            entry != null && typeof entry === "object" && !Array.isArray(entry)
              ? (entry as Record<string, unknown>)
              : {};
          return [
            key,
            {
              title: readString(record.title, ""),
              order:
                typeof record.order === "number" && Number.isFinite(record.order)
                  ? record.order
                  : 0,
              attributeKeys: normalizeStringArray(record.attributeKeys),
            },
          ];
        })
    );
  }

  if (!Array.isArray(legacyValue)) {
    return {};
  }

  return Object.fromEntries(
    legacyValue
      .filter(
        (entry) => entry != null && typeof entry === "object" && !Array.isArray(entry)
      )
      .flatMap((entry) => {
        const record = entry as Record<string, unknown>;
        const key = readString(record.key, "").trim();
        if (key.length === 0) {
          return [];
        }
        return [
          [
            key,
            {
              title: readString(record.keyName, ""),
              order:
                typeof record.order === "number" && Number.isFinite(record.order)
                  ? record.order
                  : 0,
              attributeKeys: normalizeStringArray(record.itemKeys),
            },
          ],
        ];
      })
  );
}

function normalizePersonAttributeMappings(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (entry) => entry != null && typeof entry === "object" && !Array.isArray(entry)
    )
    .map((entry) => {
      const record = entry as Record<string, unknown>;
      const type = normalizeTypedAttributeType(record.type);
      return {
        key: readString(record.key, ""),
        keyName: readString(record.keyName, ""),
        ...(readString(record.semanticKey, "").length > 0
          ? { semanticKey: readString(record.semanticKey, "") }
          : {}),
        type,
        ...(type === "enum" ? { options: normalizeStringArray(record.options) } : {}),
      };
    });
}

function normalizePersonAttributeValues(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (entry) => entry != null && typeof entry === "object" && !Array.isArray(entry)
    )
    .flatMap((entry) => {
      const record = entry as Record<string, unknown>;
      const key = readString(record.key, "");
      const rawValue = record.value;
      if (key.length === 0) {
        return [];
      }
      if (
        typeof rawValue !== "string" &&
        typeof rawValue !== "number" &&
        typeof rawValue !== "boolean"
      ) {
        return [];
      }
      return [{ key, value: rawValue }];
    });
}

function allocateNextScriptEditorPersonAttributeKey(
  person: ScriptEditorPersonRecord
): string {
  const numericKeys = normalizePersonAttributeMappings(person.attributeMappings)
    .map((entry) => Number.parseInt(entry.key, 10))
    .filter((value) => Number.isInteger(value) && value >= 0);
  return String((numericKeys.length === 0 ? 0 : Math.max(...numericKeys)) + 1);
}

function removeScriptEditorPersonAttributeGroupKey(
  attributeGroup: ScriptEditorPersonRecord["attributeGroup"],
  removedKey: string
): ScriptEditorPersonRecord["attributeGroup"] {
  if (removedKey.trim().length === 0) {
    return attributeGroup;
  }

  return Object.fromEntries(
    Object.entries(attributeGroup).map(([groupId, entry]) => [
      groupId,
      {
        ...entry,
        attributeKeys: entry.attributeKeys.filter((key) => key !== removedKey),
      },
    ])
  );
}

function renameScriptEditorPersonAttributeGroupKey(
  attributeGroup: ScriptEditorPersonRecord["attributeGroup"],
  previousKey: string,
  nextKey: string
): ScriptEditorPersonRecord["attributeGroup"] {
  if (previousKey === nextKey || previousKey.trim().length === 0 || nextKey.trim().length === 0) {
    return attributeGroup;
  }

  return Object.fromEntries(
    Object.entries(attributeGroup).map(([groupId, entry]) => [
      groupId,
      {
        ...entry,
        attributeKeys: entry.attributeKeys.map((key) =>
          key === previousKey ? nextKey : key
        ),
      },
    ])
  );
}

function convertAuthoringAttributeGroupToRuntimeGroups(
  attributeGroup: ScriptEditorPersonRecord["attributeGroup"] | undefined
): NonNullable<CharacterDefinition["attributeGroups"]> {
  return Object.entries(normalizePersonAttributeGroupRecord(attributeGroup))
    .sort(([, left], [, right]) => left.order - right.order)
    .map(([key, entry]) => ({
      key,
      keyName: entry.title,
      order: entry.order,
      itemKeys: [...entry.attributeKeys],
    }));
}

function readString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}
