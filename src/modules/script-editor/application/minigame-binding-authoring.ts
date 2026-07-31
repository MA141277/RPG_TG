import {
  builtinPlayableDefinitionRegistry,
} from "../../../core/registry/builtin-playable-definition-registry";
import {
  builtinPlayableIntegrationRegistry,
} from "../../../core/registry/builtin-playable-integration-registry";
import type {
  ScriptEditorKeyValueEntry,
  ScriptEditorPlayableConfigEntry,
  ScriptEditorPlayableSettlementRoute,
  ScriptEditorMinigameOutcome,
  ScriptEditorMinigameOutcomeRoute,
  ScriptEditorMinigameOwnerKind,
  ScriptEditorMinigameRecord,
  ScriptEditorMinigameReturnPolicy,
  ScriptEditorMinigameTriggerSource,
} from "../domain/script-editor-project";
import { createDefaultScriptEditorCanonicalId } from "./script-editor-id-allocation";

export const SCRIPT_EDITOR_MINIGAME_OWNER_KINDS: readonly ScriptEditorMinigameOwnerKind[] = [
  "house",
  "dialogue",
  "task",
  "external",
] as const;

export const SCRIPT_EDITOR_MINIGAME_RETURN_POLICIES: readonly ScriptEditorMinigameReturnPolicy[] = [
  "resume-owner",
  "reenter-owner",
  "close-only",
] as const;

export const SCRIPT_EDITOR_MINIGAME_TRIGGER_SOURCES: readonly ScriptEditorMinigameTriggerSource[] = [
  "manual",
  "dialogue-follow-up",
  "event-destination",
  "location-menu",
  "other",
] as const;

export const SCRIPT_EDITOR_MINIGAME_OUTCOMES: readonly ScriptEditorMinigameOutcome[] = [
  "success",
  "failure",
  "cancelled",
] as const;

const BUILTIN_PLAYABLE_DEFINITIONS = Array.from(
  builtinPlayableDefinitionRegistry.entries()
).filter((definition) => definition.family === "minigame");

const BUILTIN_PLAYABLE_INTEGRATIONS = Array.from(
  builtinPlayableIntegrationRegistry.entries()
).filter((integration) =>
  BUILTIN_PLAYABLE_DEFINITIONS.some(
    (definition) => definition.id === integration.playableId
  )
);

export function listScriptEditorBuiltinMinigamePlayableOptions(): Array<{
  id: string;
  label: string;
  commandPrefix: string;
}> {
  return BUILTIN_PLAYABLE_DEFINITIONS.map((definition) => ({
    id: definition.id,
    label: definition.id,
    commandPrefix: definition.commandPrefix,
  }));
}

export function listScriptEditorBuiltinMinigameIntegrationOptions(
  playableId?: string
): Array<{
  integrationId: string;
  playableId: string;
  ownerKind: string;
  returnPolicy: string;
  triggerId: string;
  triggerEvent: string;
}> {
  return BUILTIN_PLAYABLE_INTEGRATIONS
    .filter((integration) =>
      playableId == null || playableId.length === 0
        ? true
        : integration.playableId === playableId
    )
    .map((integration) => ({
      integrationId: integration.integrationId,
      playableId: integration.playableId,
      ownerKind: integration.ownerDefaults.ownerKind ?? integration.trigger.ownerKind,
      returnPolicy: integration.ownerDefaults.returnPolicy ?? "close-only",
      triggerId: integration.trigger.triggerId,
      triggerEvent: integration.trigger.trigger,
    }));
}

export function createDefaultScriptEditorMinigameRecord(
  indexOrId: number | string
): ScriptEditorMinigameRecord {
  const id =
    typeof indexOrId === "string"
      ? indexOrId
      : createDefaultScriptEditorCanonicalId("minigames", indexOrId);
  const suffix = readDefaultMinigameSequence(id, indexOrId);
  return {
    id,
    title: `玩法 ${suffix}`,
    description: "",
    playableId: "activity-qte",
    configEntries: [],
    settlementRoutes: [],
    notes: "",
  };
}

function readDefaultMinigameSequence(id: string, indexOrId: number | string): number {
  if (typeof indexOrId === "number") {
    return indexOrId + 1;
  }

  const firstId = Number(createDefaultScriptEditorCanonicalId("minigames", 0));
  const numericId = Number(id);
  if (!Number.isSafeInteger(numericId) || numericId < firstId) {
    return 1;
  }
  return numericId - firstId + 1;
}

export function normalizeScriptEditorMinigameRecord(
  record: Partial<ScriptEditorMinigameRecord> & { id: string }
): ScriptEditorMinigameRecord {
  return {
    id: record.id,
    title: normalizeString(record.title, record.id),
    description: normalizeOptionalString(record.description),
    playableId: normalizeOptionalString(record.playableId),
    configEntries: normalizeConfigEntries(record.configEntries),
    settlementRoutes: normalizeSettlementRoutes(record.settlementRoutes),
    notes: normalizeOptionalString(record.notes),
  };
}

export function appendScriptEditorMinigameConfigEntry(
  record: ScriptEditorMinigameRecord
): ScriptEditorMinigameRecord {
  return {
    ...record,
    configEntries: [
      ...(record.configEntries ?? []),
      createDefaultConfigEntry(record.configEntries?.length ?? 0),
    ],
  };
}

export function removeScriptEditorMinigameConfigEntry(
  record: ScriptEditorMinigameRecord,
  index: number
): ScriptEditorMinigameRecord {
  return {
    ...record,
    configEntries: (record.configEntries ?? []).filter(
      (_, entryIndex) => entryIndex !== index
    ),
  };
}

export function updateScriptEditorMinigameConfigEntryField(
  record: ScriptEditorMinigameRecord,
  index: number,
  field: keyof ScriptEditorPlayableConfigEntry,
  value: string
): ScriptEditorMinigameRecord {
  return {
    ...record,
    configEntries: (record.configEntries ?? []).map((entry, entryIndex) => {
      if (entryIndex !== index) {
        return entry;
      }
      if (field === "valueType") {
        return {
          ...entry,
          valueType: normalizeConfigValueType(value),
        };
      }
      if (field === "value") {
        return {
          ...entry,
          value: normalizeConfigEntryValue(entry.valueType, value),
        };
      }
      return {
        ...entry,
        [field]: value.trim(),
      };
    }),
  };
}

export function appendScriptEditorMinigameSettlementRoute(
  record: ScriptEditorMinigameRecord
): ScriptEditorMinigameRecord {
  return {
    ...record,
    settlementRoutes: [
      ...(record.settlementRoutes ?? []),
      createDefaultSettlementRoute(record.settlementRoutes?.length ?? 0),
    ],
  };
}

export function removeScriptEditorMinigameSettlementRoute(
  record: ScriptEditorMinigameRecord,
  index: number
): ScriptEditorMinigameRecord {
  return {
    ...record,
    settlementRoutes: (record.settlementRoutes ?? []).filter(
      (_, routeIndex) => routeIndex !== index
    ),
  };
}

export function updateScriptEditorMinigameSettlementRouteField(
  record: ScriptEditorMinigameRecord,
  index: number,
  field:
    | keyof ScriptEditorPlayableSettlementRoute
    | "outcomeIn"
    | "scoreMin"
    | "scoreMax",
  value: string
): ScriptEditorMinigameRecord {
  return {
    ...record,
    settlementRoutes: (record.settlementRoutes ?? []).map((route, routeIndex) => {
      if (routeIndex !== index) {
        return route;
      }
      if (field === "enabled") {
        return {
          ...route,
          enabled: value === "true",
        };
      }
      if (field === "outcomeIn") {
        return {
          ...route,
          conditions: {
            ...(route.conditions ?? {}),
            ...(value.trim().length === 0
              ? { outcomeIn: [] }
              : {
                  outcomeIn:
                    value === "success" || value === "failure" || value === "cancelled"
                      ? [value]
                      : [],
                }),
          },
        };
      }
      if (field === "scoreMin" || field === "scoreMax") {
        const numericValue =
          value.trim().length === 0 ? undefined : Number.parseFloat(value);
        return {
          ...route,
          conditions: {
            ...(route.conditions ?? {}),
            [field]:
              numericValue == null || Number.isNaN(numericValue)
                ? undefined
                : numericValue,
          },
        };
      }
      return {
        ...route,
        [field]: value.trim(),
      };
    }),
  };
}

export function updateScriptEditorMinigameField(
  record: ScriptEditorMinigameRecord,
  field:
    | "id"
    | "title"
    | "description"
    | "playableId"
    | "integrationId"
    | "settlementId"
    | "ownerKind"
    | "ownerId"
    | "returnPolicy"
    | "triggerId"
    | "triggerSource"
    | "triggerEvent"
    | "notes",
  value: string
): ScriptEditorMinigameRecord {
  if (field === "description" || field === "notes") {
    return { ...record, [field]: value };
  }
  if (field === "ownerKind") {
    return { ...record, ownerKind: normalizeOwnerKind(value) };
  }
  if (field === "returnPolicy") {
    return { ...record, returnPolicy: normalizeReturnPolicy(value) };
  }
  if (field === "triggerSource") {
    return { ...record, triggerSource: normalizeTriggerSource(value) };
  }

  return { ...record, [field]: value.trim() };
}

export function updateScriptEditorMinigameIntegration(
  record: ScriptEditorMinigameRecord,
  integrationId: string
): ScriptEditorMinigameRecord {
  const normalizedIntegrationId = integrationId.trim();
  const integration = BUILTIN_PLAYABLE_INTEGRATIONS.find(
    (candidate) => candidate.integrationId === normalizedIntegrationId
  );
  if (integration == null) {
    return {
      ...record,
      integrationId: normalizedIntegrationId,
    };
  }

  return {
    ...record,
    playableId: integration.playableId,
    integrationId: integration.integrationId,
    ownerKind: normalizeOwnerKind(
      integration.ownerDefaults.ownerKind ?? integration.trigger.ownerKind
    ),
    returnPolicy: normalizeReturnPolicy(
      integration.ownerDefaults.returnPolicy ?? "close-only"
    ),
    triggerId: integration.trigger.triggerId,
    triggerEvent: integration.trigger.trigger,
  };
}

export function appendScriptEditorMinigameLaunchPayloadEntry(
  record: ScriptEditorMinigameRecord
): ScriptEditorMinigameRecord {
  return {
    ...record,
    launchPayload: [
      ...(record.launchPayload ?? []),
      createDefaultKeyValueEntry(record.launchPayload?.length ?? 0),
    ],
  };
}

export function removeScriptEditorMinigameLaunchPayloadEntry(
  record: ScriptEditorMinigameRecord,
  index: number
): ScriptEditorMinigameRecord {
  return {
    ...record,
    launchPayload: (record.launchPayload ?? []).filter(
      (_, entryIndex) => entryIndex !== index
    ),
  };
}

export function updateScriptEditorMinigameLaunchPayloadField(
  record: ScriptEditorMinigameRecord,
  index: number,
  field: keyof ScriptEditorKeyValueEntry,
  value: string
): ScriptEditorMinigameRecord {
  return {
    ...record,
    launchPayload: (record.launchPayload ?? []).map((entry, entryIndex) =>
      entryIndex === index ? { ...entry, [field]: value.trim() } : entry
    ),
  };
}

export function appendScriptEditorMinigameOutcomeRoute(
  record: ScriptEditorMinigameRecord
): ScriptEditorMinigameRecord {
  return {
    ...record,
    outcomeRoutes: [
      ...(record.outcomeRoutes ?? []),
      createDefaultOutcomeRoute(record.outcomeRoutes?.length ?? 0, "success"),
    ],
  };
}

export function removeScriptEditorMinigameOutcomeRoute(
  record: ScriptEditorMinigameRecord,
  index: number
): ScriptEditorMinigameRecord {
  return {
    ...record,
    outcomeRoutes: (record.outcomeRoutes ?? []).filter(
      (_, routeIndex) => routeIndex !== index
    ),
  };
}

export function updateScriptEditorMinigameOutcomeRouteField(
  record: ScriptEditorMinigameRecord,
  index: number,
  field: keyof ScriptEditorMinigameOutcomeRoute,
  value: string
): ScriptEditorMinigameRecord {
  return {
    ...record,
    outcomeRoutes: (record.outcomeRoutes ?? []).map((route, routeIndex) => {
      if (routeIndex !== index) {
        return route;
      }
      if (field === "outcome") {
        return { ...route, outcome: normalizeOutcome(value) };
      }
      if (field === "handoffPolicy") {
        return { ...route, handoffPolicy: normalizeReturnPolicy(value) };
      }
      return {
        ...route,
        [field]: value.trim(),
      };
    }),
  };
}

function createDefaultKeyValueEntry(index: number): ScriptEditorKeyValueEntry {
  const suffix = index + 1;
  return {
    key: `payloadKey${suffix}`,
    value: "",
  };
}

function createDefaultOutcomeRoute(
  index: number,
  outcome: ScriptEditorMinigameOutcome
): ScriptEditorMinigameOutcomeRoute {
  const suffix = index + 1;
  return {
    id: `outcome-route.${suffix}`,
    outcome,
    handoffPolicy: "resume-owner",
    summary: "",
    effectHint: "",
  };
}

function normalizeOwnerKind(value: unknown): ScriptEditorMinigameOwnerKind {
  return SCRIPT_EDITOR_MINIGAME_OWNER_KINDS.includes(
    value as ScriptEditorMinigameOwnerKind
  )
    ? (value as ScriptEditorMinigameOwnerKind)
    : "external";
}

function normalizeReturnPolicy(
  value: unknown
): ScriptEditorMinigameReturnPolicy {
  return SCRIPT_EDITOR_MINIGAME_RETURN_POLICIES.includes(
    value as ScriptEditorMinigameReturnPolicy
  )
    ? (value as ScriptEditorMinigameReturnPolicy)
    : "close-only";
}

function normalizeTriggerSource(
  value: unknown
): ScriptEditorMinigameTriggerSource {
  return SCRIPT_EDITOR_MINIGAME_TRIGGER_SOURCES.includes(
    value as ScriptEditorMinigameTriggerSource
  )
    ? (value as ScriptEditorMinigameTriggerSource)
    : "manual";
}

function normalizeOutcome(value: unknown): ScriptEditorMinigameOutcome {
  return SCRIPT_EDITOR_MINIGAME_OUTCOMES.includes(
    value as ScriptEditorMinigameOutcome
  )
    ? (value as ScriptEditorMinigameOutcome)
    : "success";
}

function normalizeString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : fallback;
}

function normalizeOptionalString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeKeyValueEntries(
  entries: readonly ScriptEditorKeyValueEntry[] | undefined
): ScriptEditorKeyValueEntry[] {
  return (entries ?? []).map((entry) => ({
    key: normalizeOptionalString(entry?.key),
    value: normalizeOptionalString(entry?.value),
  }));
}

function normalizeOutcomeRoutes(
  routes: readonly ScriptEditorMinigameOutcomeRoute[] | undefined
): ScriptEditorMinigameOutcomeRoute[] {
  return (routes ?? []).map((route, index) => ({
    id: normalizeString(route?.id, `outcome-route.${index + 1}`),
    outcome: normalizeOutcome(route?.outcome),
    handoffPolicy: normalizeReturnPolicy(route?.handoffPolicy),
    summary: normalizeOptionalString(route?.summary),
    effectHint: normalizeOptionalString(route?.effectHint),
  }));
}

function createDefaultConfigEntry(index: number): ScriptEditorPlayableConfigEntry {
  return {
    id: `config.${index + 1}`,
    label: "",
    valueType: "text",
    value: "",
  };
}

function createDefaultSettlementRoute(
  index: number
): ScriptEditorPlayableSettlementRoute {
  return {
    id: `route.${index + 1}`,
    title: "",
    enabled: true,
    targetEventId: "",
    conditions: {},
  };
}

function normalizeConfigEntries(
  entries: readonly ScriptEditorPlayableConfigEntry[] | undefined
): ScriptEditorPlayableConfigEntry[] {
  return (entries ?? []).map((entry, index) => {
    const valueType = normalizeConfigValueType(entry?.valueType);
    const normalizedNotes = normalizeOptionalString(entry?.notes);
    const enumOptions = normalizeEnumOptions(entry?.enumOptions);
    return {
      id: normalizeString(entry?.id, `config.${index + 1}`),
      label: normalizeOptionalString(entry?.label),
      valueType,
      value: normalizeConfigEntryValue(valueType, entry?.value),
      ...(normalizedNotes.length === 0 ? {} : { notes: normalizedNotes }),
      ...(enumOptions == null ? {} : { enumOptions }),
    };
  });
}

function normalizeSettlementRoutes(
  routes: readonly ScriptEditorPlayableSettlementRoute[] | undefined
): ScriptEditorPlayableSettlementRoute[] {
  return (routes ?? []).map((route, index) => ({
    id: normalizeString(route?.id, `route.${index + 1}`),
    title: normalizeOptionalString(route?.title),
    enabled: route?.enabled !== false,
    targetEventId: normalizeOptionalString(route?.targetEventId),
    conditions:
      route?.conditions != null &&
      typeof route.conditions === "object" &&
      !Array.isArray(route.conditions)
        ? {
            ...(Array.isArray(route.conditions.outcomeIn)
              ? {
                  outcomeIn: route.conditions.outcomeIn.map((outcome) =>
                    normalizeOutcome(outcome)
                  ),
                }
              : {}),
            ...(typeof route.conditions.scoreMin === "number" &&
            Number.isFinite(route.conditions.scoreMin)
              ? { scoreMin: route.conditions.scoreMin }
              : {}),
            ...(typeof route.conditions.scoreMax === "number" &&
            Number.isFinite(route.conditions.scoreMax)
              ? { scoreMax: route.conditions.scoreMax }
              : {}),
            ...(Array.isArray(route.conditions.metricRules)
              ? {
                  metricRules: route.conditions.metricRules
                    .filter(
                      (rule) =>
                        rule != null &&
                        typeof rule.metricKey === "string" &&
                        ["<", "<=", "=", ">", ">="].includes(
                          String(rule.operator)
                        )
                    )
                    .map((rule) => ({
                      metricKey: rule.metricKey.trim(),
                      operator: rule.operator,
                      value:
                        typeof rule.value === "string" ||
                        typeof rule.value === "number" ||
                        typeof rule.value === "boolean"
                          ? rule.value
                          : "",
                    })),
                }
              : {}),
          }
        : {},
  }));
}

function normalizeConfigValueType(value: unknown): ScriptEditorPlayableConfigEntry["valueType"] {
  return value === "number" ||
    value === "text" ||
    value === "boolean" ||
    value === "enum"
    ? value
    : "text";
}

function normalizeConfigEntryValue(
  valueType: ScriptEditorPlayableConfigEntry["valueType"],
  value: unknown
): ScriptEditorPlayableConfigEntry["value"] {
  if (value == null) {
    return null;
  }
  if (valueType === "number") {
    return typeof value === "number"
      ? value
      : Number.isFinite(Number(value))
        ? Number(value)
        : 0;
  }
  if (valueType === "boolean") {
    return typeof value === "boolean" ? value : String(value).trim() === "true";
  }
  return typeof value === "string" ? value.trim() : String(value);
}

function normalizeEnumOptions(
  options:
    | ReadonlyArray<{ value: string; label: string }>
    | undefined
): Array<{ value: string; label: string }> | undefined {
  if (!Array.isArray(options)) {
    return undefined;
  }
  return options.map((option) => ({
    value: normalizeOptionalString(option?.value),
    label: normalizeOptionalString(option?.label),
  }));
}
