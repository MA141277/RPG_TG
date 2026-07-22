import {
  SKILL_LABELS,
  type CharacterStatKey,
  type SkillKey,
} from "../../domain/character";

export const SCRIPT_EDITOR_FIELD_VALUE_TYPES = [
  "string",
  "text",
  "number",
  "boolean",
  "enum",
  "reference",
  "reference-list",
  "key-value-list",
] as const;

export type ScriptEditorFieldValueType =
  (typeof SCRIPT_EDITOR_FIELD_VALUE_TYPES)[number];

export type ScriptEditorFieldEnumOption = {
  value: string;
  label: string;
};

export type ScriptEditorFieldDefinition = {
  id: string;
  canonicalKey: string;
  label: string;
  group: string;
  valueType: ScriptEditorFieldValueType;
  order: number;
  editable?: boolean;
  runtimeMutable?: boolean;
  required?: boolean;
  validationHint?: string;
  defaultValue?: unknown;
  enumOptions?: ScriptEditorFieldEnumOption[];
  referenceFamily?: string;
};

export type ScriptEditorFieldDefinitionDiagnostic = {
  code:
    | "duplicate-field-id"
    | "missing-field-id"
    | "missing-canonical-key"
    | "missing-label"
    | "invalid-value-type"
    | "invalid-order";
  fieldPath: string;
  message: string;
};

const FIELD_VALUE_TYPE_SET = new Set<string>(SCRIPT_EDITOR_FIELD_VALUE_TYPES);

const CHARACTER_STAT_LABELS: Record<CharacterStatKey, string> = {
  leadership: "统率",
  martial: "武勇",
  intelligence: "智略",
  politics: "政务",
  charm: "魅力",
  fame: "名声",
  gold: "金钱",
};

const CHARACTER_STAT_KEYS = Object.keys(
  CHARACTER_STAT_LABELS
) as CharacterStatKey[];

const CHARACTER_SKILL_KEYS = Object.keys(SKILL_LABELS) as SkillKey[];

const PERSON_FIELD_DEFINITIONS: readonly ScriptEditorFieldDefinition[] = [
  {
    id: "person.name",
    canonicalKey: "name",
    label: "姓名",
    group: "base",
    valueType: "string",
    order: 10,
    required: true,
  },
  {
    id: "person.personType",
    canonicalKey: "personType",
    label: "人物类型",
    group: "base",
    valueType: "enum",
    order: 20,
    defaultValue: "NPC",
    enumOptions: [
      { value: "角色", label: "角色" },
      { value: "NPC", label: "NPC" },
    ],
  },
  {
    id: "person.role",
    canonicalKey: "role",
    label: "角色定位",
    group: "base",
    valueType: "string",
    order: 30,
  },
  {
    id: "person.biography",
    canonicalKey: "biography",
    label: "人物传记",
    group: "profile",
    valueType: "text",
    order: 100,
  },
  {
    id: "person.birthYear",
    canonicalKey: "birthYear",
    label: "出生年",
    group: "profile",
    valueType: "number",
    order: 110,
  },
  {
    id: "person.deathYear",
    canonicalKey: "deathYear",
    label: "去世年",
    group: "profile",
    valueType: "number",
    order: 120,
  },
  {
    id: "person.age",
    canonicalKey: "age",
    label: "年龄",
    group: "profile",
    valueType: "number",
    order: 130,
  },
  {
    id: "person.clanId",
    canonicalKey: "clanId",
    label: "所属势力",
    group: "profile",
    valueType: "string",
    order: 140,
  },
  {
    id: "person.title",
    canonicalKey: "title",
    label: "正式身份",
    group: "profile",
    valueType: "string",
    order: 150,
  },
  {
    id: "person.occupation",
    canonicalKey: "occupation",
    label: "职业/定位",
    group: "profile",
    valueType: "string",
    order: 160,
  },
  {
    id: "person.affiliationLabel",
    canonicalKey: "affiliationLabel",
    label: "所属显示名",
    group: "profile",
    valueType: "string",
    order: 170,
  },
  {
    id: "person.cityId",
    canonicalKey: "cityId",
    label: "所在城市",
    group: "profile",
    valueType: "reference",
    order: 180,
    referenceFamily: "cities",
  },
  {
    id: "person.houseId",
    canonicalKey: "houseId",
    label: "所在建筑",
    group: "profile",
    valueType: "reference",
    order: 190,
    referenceFamily: "buildings",
  },
  {
    id: "person.portraitId",
    canonicalKey: "portraitId",
    label: "立绘 ID",
    group: "profile",
    valueType: "reference",
    order: 200,
    referenceFamily: "portraits",
  },
  {
    id: "person.portraitVariantId",
    canonicalKey: "portraitVariantId",
    label: "立绘变体",
    group: "profile",
    valueType: "reference",
    order: 210,
    referenceFamily: "portraitVariants",
  },
  {
    id: "person.isHistoricalFigure",
    canonicalKey: "isHistoricalFigure",
    label: "历史人物",
    group: "profile",
    valueType: "boolean",
    order: 220,
    defaultValue: false,
  },
  ...CHARACTER_STAT_KEYS.map<ScriptEditorFieldDefinition>((key, index) => ({
    id: `person.stats.${key}`,
    canonicalKey: `stats.${key}`,
    label: CHARACTER_STAT_LABELS[key],
    group: "stat",
    valueType: "number",
    order: 300 + index * 10,
    defaultValue: 0,
    runtimeMutable: true,
  })),
  {
    id: "person.stamina",
    canonicalKey: "stamina",
    label: "体力",
    group: "stat",
    valueType: "number",
    order: 370,
    defaultValue: 100,
    runtimeMutable: true,
  },
  ...CHARACTER_SKILL_KEYS.map<ScriptEditorFieldDefinition>((key, index) => ({
    id: `person.skills.${key}`,
    canonicalKey: `skills.${key}`,
    label: SKILL_LABELS[key],
    group: "skill",
    valueType: "number",
    order: 400 + index * 10,
    defaultValue: 0,
    runtimeMutable: true,
  })),
  {
    id: "person.tradeBinding.enabled",
    canonicalKey: "tradeBinding.enabled",
    label: "启用交易",
    group: "trade",
    valueType: "boolean",
    order: 600,
    defaultValue: false,
  },
  {
    id: "person.tradeBinding.entryId",
    canonicalKey: "tradeBinding.entryId",
    label: "交易入口",
    group: "trade",
    valueType: "reference",
    order: 610,
    referenceFamily: "buildings",
  },
  {
    id: "person.dialogueIds",
    canonicalKey: "dialogueIds",
    label: "关联对话",
    group: "references",
    valueType: "reference-list",
    order: 700,
    referenceFamily: "dialogues",
  },
  {
    id: "person.eventIds",
    canonicalKey: "eventIds",
    label: "关联事件",
    group: "references",
    valueType: "reference-list",
    order: 710,
    referenceFamily: "events",
  },
  {
    id: "person.extendedAttributes",
    canonicalKey: "extendedAttributes",
    label: "自定义属性",
    group: "custom",
    valueType: "key-value-list",
    order: 800,
  },
];

export function listScriptEditorPersonFieldDefinitions(): ScriptEditorFieldDefinition[] {
  return PERSON_FIELD_DEFINITIONS.map(cloneFieldDefinition);
}

export function findScriptEditorPersonFieldDefinition(
  canonicalKey: string
): ScriptEditorFieldDefinition | null {
  const normalizedKey = canonicalKey.trim();
  const definition = PERSON_FIELD_DEFINITIONS.find(
    (candidate) => candidate.canonicalKey === normalizedKey
  );

  return definition == null ? null : cloneFieldDefinition(definition);
}

export function validateScriptEditorFieldDefinitions(
  definitions: readonly ScriptEditorFieldDefinition[]
): ScriptEditorFieldDefinitionDiagnostic[] {
  const diagnostics: ScriptEditorFieldDefinitionDiagnostic[] = [];
  const seenIds = new Set<string>();

  definitions.forEach((definition, index) => {
    const basePath = `fieldDefinitions[${index}]`;
    const normalizedId = normalizeRequiredString(definition.id);
    if (normalizedId.length === 0) {
      diagnostics.push({
        code: "missing-field-id",
        fieldPath: `${basePath}.id`,
        message: "Field definition id must be a non-empty string.",
      });
    } else if (seenIds.has(normalizedId)) {
      diagnostics.push({
        code: "duplicate-field-id",
        fieldPath: `${basePath}.id`,
        message: `Field definition id ${normalizedId} is duplicated.`,
      });
    } else {
      seenIds.add(normalizedId);
    }

    if (normalizeRequiredString(definition.canonicalKey).length === 0) {
      diagnostics.push({
        code: "missing-canonical-key",
        fieldPath: `${basePath}.canonicalKey`,
        message: "Field definition canonicalKey must be a non-empty string.",
      });
    }

    if (normalizeRequiredString(definition.label).length === 0) {
      diagnostics.push({
        code: "missing-label",
        fieldPath: `${basePath}.label`,
        message: "Field definition label must be a non-empty string.",
      });
    }

    if (!FIELD_VALUE_TYPE_SET.has(definition.valueType)) {
      diagnostics.push({
        code: "invalid-value-type",
        fieldPath: `${basePath}.valueType`,
        message: `Field definition valueType ${String(
          definition.valueType
        )} is not supported.`,
      });
    }

    if (!Number.isFinite(definition.order)) {
      diagnostics.push({
        code: "invalid-order",
        fieldPath: `${basePath}.order`,
        message: "Field definition order must be a finite number.",
      });
    }
  });

  return diagnostics;
}

function normalizeRequiredString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function cloneFieldDefinition(
  definition: ScriptEditorFieldDefinition
): ScriptEditorFieldDefinition {
  return {
    ...definition,
    ...(definition.enumOptions == null
      ? {}
      : { enumOptions: definition.enumOptions.map((option) => ({ ...option })) }),
  };
}
