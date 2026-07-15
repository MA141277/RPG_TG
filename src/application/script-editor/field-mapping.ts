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
    id: "person.biography",
    canonicalKey: "biography",
    label: "人物传记",
    group: "profile",
    valueType: "text",
    order: 30,
  },
  {
    id: "person.cityId",
    canonicalKey: "cityId",
    label: "所在城市",
    group: "profile",
    valueType: "reference",
    order: 40,
    referenceFamily: "cities",
  },
  {
    id: "person.stats.leadership",
    canonicalKey: "stats.leadership",
    label: "统率",
    group: "stat",
    valueType: "number",
    order: 50,
    defaultValue: 0,
  },
  {
    id: "person.skills.strategy",
    canonicalKey: "skills.strategy",
    label: "军略",
    group: "skill",
    valueType: "number",
    order: 60,
    defaultValue: 0,
  },
  {
    id: "person.tradeBinding.enabled",
    canonicalKey: "tradeBinding.enabled",
    label: "启用交易",
    group: "trade",
    valueType: "boolean",
    order: 70,
    defaultValue: false,
  },
  {
    id: "person.dialogueIds",
    canonicalKey: "dialogueIds",
    label: "关联对话",
    group: "references",
    valueType: "reference-list",
    order: 80,
    referenceFamily: "dialogues",
  },
  {
    id: "person.eventIds",
    canonicalKey: "eventIds",
    label: "关联事件",
    group: "references",
    valueType: "reference-list",
    order: 90,
    referenceFamily: "events",
  },
  {
    id: "person.extendedAttributes",
    canonicalKey: "extendedAttributes",
    label: "自定义属性",
    group: "custom",
    valueType: "key-value-list",
    order: 100,
  },
];

export function listScriptEditorPersonFieldDefinitions(): ScriptEditorFieldDefinition[] {
  return PERSON_FIELD_DEFINITIONS.map(cloneFieldDefinition);
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
