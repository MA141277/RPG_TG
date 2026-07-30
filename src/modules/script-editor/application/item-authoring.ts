import type {
  ScriptEditorItemRecord,
  ScriptEditorTypedAttributeRecord,
  ScriptEditorTypedAttributeType,
} from "../domain/script-editor-project";

export const SCRIPT_EDITOR_ITEM_CUSTOM_PROPERTY_TYPES = [
  "string",
  "number",
  "boolean",
] as const satisfies readonly ScriptEditorTypedAttributeType[];

function normalizeItemCustomPropertyType(
  value: unknown
): ScriptEditorTypedAttributeType {
  return SCRIPT_EDITOR_ITEM_CUSTOM_PROPERTY_TYPES.includes(
    value as (typeof SCRIPT_EDITOR_ITEM_CUSTOM_PROPERTY_TYPES)[number]
  )
    ? (value as ScriptEditorTypedAttributeType)
    : "string";
}

function normalizeItemCustomPropertyValue(
  type: ScriptEditorTypedAttributeType,
  value: unknown
): string | number | boolean {
  if (type === "number") {
    const numericValue =
      typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));
    return Number.isFinite(numericValue) ? numericValue : 0;
  }

  if (type === "boolean") {
    return value === true || String(value).trim() === "true";
  }

  return String(value ?? "");
}

function normalizeItemCustomProperty(
  property: Partial<ScriptEditorTypedAttributeRecord> | undefined
): ScriptEditorTypedAttributeRecord {
  const type = normalizeItemCustomPropertyType(property?.type);
  return {
    key: String(property?.key ?? "").trim(),
    label: String(property?.label ?? ""),
    type,
    value: normalizeItemCustomPropertyValue(type, property?.value),
  };
}

function normalizeItemCustomProperties(
  properties: ScriptEditorItemRecord["customProperties"]
): ScriptEditorTypedAttributeRecord[] {
  return Array.isArray(properties)
    ? properties.map((property) => normalizeItemCustomProperty(property))
    : [];
}

function normalizeItemMenuInstanceIds(
  menuInstanceIds: ScriptEditorItemRecord["menuInstanceIds"]
): string[] {
  return Array.from(
    new Set(
      (Array.isArray(menuInstanceIds) ? menuInstanceIds : [])
        .map((menuInstanceId) => String(menuInstanceId).trim())
        .filter((menuInstanceId) => menuInstanceId.length > 0)
    )
  );
}

export function updateScriptEditorItemField(
  item: ScriptEditorItemRecord,
  field: "name" | "description" | "internalNote",
  value: string
): ScriptEditorItemRecord {
  if (field === "name") {
    return {
      ...item,
      name: value,
    };
  }

  return {
    ...item,
    [field]: value,
  };
}

export function updateScriptEditorItemDisplayField(
  item: ScriptEditorItemRecord,
  field: "title" | "iconId" | "imageId",
  value: string
): ScriptEditorItemRecord {
  const normalizedValue = value.trim();
  const display = {
    ...(item.display ?? {}),
    [field]: normalizedValue.length === 0 ? undefined : normalizedValue,
  };

  return {
    ...item,
    display,
  };
}

export function updateScriptEditorItemStackField(
  item: ScriptEditorItemRecord,
  field: "stackable" | "maxStack" | "unit",
  value: string
): ScriptEditorItemRecord {
  const stack = {
    stackable: item.stack?.stackable === true,
    ...(item.stack?.maxStack == null ? {} : { maxStack: item.stack.maxStack }),
    ...(item.stack?.unit == null ? {} : { unit: item.stack.unit }),
  };

  if (field === "stackable") {
    return {
      ...item,
      stack: {
        ...stack,
        stackable: value === "true",
      },
    };
  }

  if (field === "maxStack") {
    const maxStack = Number.parseInt(value, 10);
    return {
      ...item,
      stack: {
        ...stack,
        ...(Number.isFinite(maxStack) && maxStack > 0
          ? { maxStack }
          : { maxStack: undefined }),
      },
    };
  }

  return {
    ...item,
    stack: {
      ...stack,
      unit: value.trim().length === 0 ? undefined : value,
    },
  };
}

export function toggleScriptEditorItemMenuInstance(
  item: ScriptEditorItemRecord,
  menuInstanceId: string,
  enabled: boolean
): ScriptEditorItemRecord {
  const normalizedMenuInstanceId = menuInstanceId.trim();
  if (normalizedMenuInstanceId.length === 0) {
    return item;
  }

  const currentIds = normalizeItemMenuInstanceIds(item.menuInstanceIds);
  return {
    ...item,
    menuInstanceIds: enabled
      ? Array.from(new Set([...currentIds, normalizedMenuInstanceId]))
      : currentIds.filter((currentId) => currentId !== normalizedMenuInstanceId),
  };
}

export function appendScriptEditorItemCustomProperty(
  item: ScriptEditorItemRecord
): ScriptEditorItemRecord {
  return {
    ...item,
    customProperties: [
      ...normalizeItemCustomProperties(item.customProperties),
      {
        key: "",
        label: "",
        type: "string",
        value: "",
      },
    ],
  };
}

export function removeScriptEditorItemCustomProperty(
  item: ScriptEditorItemRecord,
  index: number
): ScriptEditorItemRecord {
  return {
    ...item,
    customProperties: normalizeItemCustomProperties(item.customProperties).filter(
      (_, propertyIndex) => propertyIndex !== index
    ),
  };
}

export function updateScriptEditorItemCustomProperty(
  item: ScriptEditorItemRecord,
  index: number,
  field: "key" | "label" | "type" | "value",
  value: string
): ScriptEditorItemRecord {
  return {
    ...item,
    customProperties: normalizeItemCustomProperties(item.customProperties).map(
      (property, propertyIndex) => {
        if (propertyIndex !== index) {
          return property;
        }

        const nextType =
          field === "type" ? normalizeItemCustomPropertyType(value) : property.type;
        return normalizeItemCustomProperty({
          ...property,
          [field]: field === "type" ? nextType : value,
          value:
            field === "value" || field === "type"
              ? normalizeItemCustomPropertyValue(
                  nextType,
                  field === "value" ? value : property.value
                )
              : property.value,
        });
      }
    ),
  };
}
