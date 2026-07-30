import {
  builtinPlayableDefinitionRegistry,
} from "../../../core/registry/builtin-playable-definition-registry";
import {
  builtinPlayableIntegrationRegistry,
} from "../../../core/registry/builtin-playable-integration-registry";
import type {
  ScriptEditorKeyValueEntry,
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
    title: `玩法绑定 ${suffix}`,
    description: "",
    playableId: "activity-qte",
    integrationId: `playable.activity-qte.external.${id}`,
    settlementId: "",
    ownerKind: "external",
    ownerId: "",
    returnPolicy: "close-only",
    triggerId: "trigger.playable.activity-qte.dialogue.default",
    triggerSource: "manual",
    triggerEvent: "legacy-activity-start",
    launchPayload: [createDefaultKeyValueEntry(0)],
    outcomeRoutes: SCRIPT_EDITOR_MINIGAME_OUTCOMES.map((outcome, outcomeIndex) =>
      createDefaultOutcomeRoute(outcomeIndex, outcome)
    ),
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
    ...record,
    title: normalizeString(record.title, record.id),
    description: normalizeOptionalString(record.description),
    playableId: normalizeOptionalString(record.playableId),
    integrationId: normalizeOptionalString(record.integrationId),
    settlementId: normalizeOptionalString(record.settlementId),
    ownerKind: normalizeOwnerKind(record.ownerKind),
    ownerId: normalizeOptionalString(record.ownerId),
    returnPolicy: normalizeReturnPolicy(record.returnPolicy),
    triggerId: normalizeOptionalString(record.triggerId),
    triggerSource: normalizeTriggerSource(record.triggerSource),
    triggerEvent: normalizeOptionalString(record.triggerEvent),
    launchPayload: normalizeKeyValueEntries(record.launchPayload),
    outcomeRoutes: normalizeOutcomeRoutes(record.outcomeRoutes),
    notes: normalizeOptionalString(record.notes),
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
