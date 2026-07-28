import type {
  ScriptEditorPersonAttributeMapping,
  ScriptEditorPersonAttributeValue,
} from "../../modules/script-editor";

export type RuntimePersonAttributeCarrier = {
  attributeMappings?: ScriptEditorPersonAttributeMapping[] | undefined;
  attributeValues?: ScriptEditorPersonAttributeValue[] | undefined;
};

export type ResolvedRuntimePersonAttribute = {
  semanticKey: string;
  key: string;
  keyName: string;
  type: ScriptEditorPersonAttributeMapping["type"];
  value: string | number | boolean | undefined;
};

export function resolvePersonAttributeBySemanticKey(
  person: RuntimePersonAttributeCarrier,
  semanticKey: string
): ResolvedRuntimePersonAttribute | null {
  const normalizedSemanticKey = semanticKey.trim();
  if (normalizedSemanticKey.length === 0) {
    return null;
  }

  const mapping = (person.attributeMappings ?? []).find(
    (entry) => entry.semanticKey?.trim() === normalizedSemanticKey
  );
  if (mapping == null) {
    return null;
  }

  return {
    semanticKey: normalizedSemanticKey,
    key: mapping.key,
    keyName: mapping.keyName,
    type: mapping.type,
    value: (person.attributeValues ?? []).find((entry) => entry.key === mapping.key)
      ?.value,
  };
}

export function createPersonAttributeValuePatchBySemanticKey(
  person: RuntimePersonAttributeCarrier,
  semanticKey: string,
  value: string | number | boolean
): Record<string, string | number | boolean> | null {
  const resolvedAttribute = resolvePersonAttributeBySemanticKey(person, semanticKey);
  if (resolvedAttribute == null) {
    return null;
  }

  return {
    [resolvedAttribute.key]: value,
  };
}

export function readNumericPersonAttributeBySemanticKey(
  person: RuntimePersonAttributeCarrier,
  semanticKey: string,
  fallback = 0
): number {
  const resolvedAttribute = resolvePersonAttributeBySemanticKey(person, semanticKey);
  return typeof resolvedAttribute?.value === "number"
    ? resolvedAttribute.value
    : fallback;
}

export function readStringPersonAttributeBySemanticKey(
  person: RuntimePersonAttributeCarrier,
  semanticKey: string,
  fallback = ""
): string {
  const resolvedAttribute = resolvePersonAttributeBySemanticKey(person, semanticKey);
  return typeof resolvedAttribute?.value === "string"
    ? resolvedAttribute.value
    : fallback;
}

export function readBooleanPersonAttributeBySemanticKey(
  person: RuntimePersonAttributeCarrier,
  semanticKey: string,
  fallback = false
): boolean {
  const resolvedAttribute = resolvePersonAttributeBySemanticKey(person, semanticKey);
  return typeof resolvedAttribute?.value === "boolean"
    ? resolvedAttribute.value
    : fallback;
}
