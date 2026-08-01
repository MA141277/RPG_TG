import type {
  ScriptEditorPersonAttributeMapping,
  ScriptEditorPersonAttributeValue,
} from "../../modules/script-editor";

export type RuntimePersonAttributeCarrier = {
  attributeMappings?: ScriptEditorPersonAttributeMapping[] | undefined;
  attributeValues?: ScriptEditorPersonAttributeValue[] | undefined;
  title?: string | undefined;
  occupation?: string | undefined;
  affiliationLabel?: string | undefined;
  clanId?: string | undefined;
  cityId?: string | undefined;
  houseId?: string | undefined;
  age?: number | undefined;
  birthYear?: number | undefined;
  deathYear?: number | null | undefined;
  stamina?: number | undefined;
  stats?: Record<string, number> | undefined;
  skills?: Record<string, number> | undefined;
  customProperties?: Record<string, string | number | boolean> | undefined;
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
  if (typeof resolvedAttribute?.value === "number") {
    return resolvedAttribute.value;
  }

  const fallbackValue = readDirectNumericSemanticValue(person, semanticKey);
  return fallbackValue ?? fallback;
}

export function readStringPersonAttributeBySemanticKey(
  person: RuntimePersonAttributeCarrier,
  semanticKey: string,
  fallback = ""
): string {
  const resolvedAttribute = resolvePersonAttributeBySemanticKey(person, semanticKey);
  if (typeof resolvedAttribute?.value === "string") {
    return resolvedAttribute.value;
  }

  const fallbackValue = readDirectStringSemanticValue(person, semanticKey);
  return fallbackValue ?? fallback;
}

export function readBooleanPersonAttributeBySemanticKey(
  person: RuntimePersonAttributeCarrier,
  semanticKey: string,
  fallback = false
): boolean {
  const resolvedAttribute = resolvePersonAttributeBySemanticKey(person, semanticKey);
  if (typeof resolvedAttribute?.value === "boolean") {
    return resolvedAttribute.value;
  }

  const fallbackValue = readDirectBooleanSemanticValue(person, semanticKey);
  return fallbackValue ?? fallback;
}

function normalizeSemanticKey(value: string): string {
  return value.trim();
}

function readDirectStringSemanticValue(
  person: RuntimePersonAttributeCarrier,
  semanticKey: string
): string | null {
  switch (normalizeSemanticKey(semanticKey)) {
    case "title":
      return typeof person.title === "string" ? person.title : null;
    case "occupation":
      return typeof person.occupation === "string" ? person.occupation : null;
    case "affiliationLabel":
      return typeof person.affiliationLabel === "string"
        ? person.affiliationLabel
        : null;
    case "clanId":
      return typeof person.clanId === "string" ? person.clanId : null;
    case "cityId":
      return typeof person.cityId === "string" ? person.cityId : null;
    case "houseId":
      return typeof person.houseId === "string" ? person.houseId : null;
    default: {
      const customProperty = person.customProperties?.[semanticKey];
      return typeof customProperty === "string" ? customProperty : null;
    }
  }
}

function readDirectNumericSemanticValue(
  person: RuntimePersonAttributeCarrier,
  semanticKey: string
): number | null {
  const normalizedSemanticKey = normalizeSemanticKey(semanticKey);

  switch (normalizedSemanticKey) {
    case "age":
      return typeof person.age === "number" ? person.age : null;
    case "birthYear":
      return typeof person.birthYear === "number" ? person.birthYear : null;
    case "deathYear":
      return typeof person.deathYear === "number" ? person.deathYear : null;
    case "stamina":
      return typeof person.stamina === "number" ? person.stamina : null;
    default: {
      const statValue = person.stats?.[normalizedSemanticKey];
      if (typeof statValue === "number") {
        return statValue;
      }

      const skillValue = person.skills?.[normalizedSemanticKey];
      if (typeof skillValue === "number") {
        return skillValue;
      }

      const customProperty = person.customProperties?.[normalizedSemanticKey];
      return typeof customProperty === "number" ? customProperty : null;
    }
  }
}

function readDirectBooleanSemanticValue(
  person: RuntimePersonAttributeCarrier,
  semanticKey: string
): boolean | null {
  const customProperty = person.customProperties?.[normalizeSemanticKey(semanticKey)];
  return typeof customProperty === "boolean" ? customProperty : null;
}
