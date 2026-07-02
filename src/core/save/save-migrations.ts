import type { CoreGameState } from "../contracts/core-state";
import {
  CURRENT_SAVE_ENVELOPE_VERSION,
  type SaveEnvelope,
} from "./save-envelope";

type SaveRecord = Record<string, unknown>;

function isRecord(value: unknown): value is SaveRecord {
  return typeof value === "object" && value !== null;
}

function readSelectedModId(input: SaveRecord): string {
  return typeof input.selectedModId === "string"
    ? input.selectedModId
    : "builtin.default";
}

function migrateEngineState(
  input: SaveRecord,
  selectedModId: string
): CoreGameState["engine"] {
  if (isRecord(input.engineState)) {
    return {
      selectedModId,
      version:
        typeof input.engineState.version === "string"
          ? input.engineState.version
          : CURRENT_SAVE_ENVELOPE_VERSION,
      currentView:
        input.engineState.currentView === "city" ||
        input.engineState.currentView === "house" ||
        input.engineState.currentView === "scene" ||
        input.engineState.currentView === "interactive"
          ? input.engineState.currentView
          : "map",
    };
  }

  return {
    selectedModId,
    version: CURRENT_SAVE_ENVELOPE_VERSION,
    currentView: "map",
  };
}

function migrateRuntimeState(input: SaveRecord): CoreGameState["runtime"] {
  if (isRecord(input.runtimeState)) {
    return {
      flags: isRecord(input.runtimeState.flags)
        ? (input.runtimeState.flags as Record<string, boolean>)
        : {},
      variables: isRecord(input.runtimeState.variables)
        ? (input.runtimeState.variables as Record<string, string | number>)
        : {},
      activeEventId:
        typeof input.runtimeState.activeEventId === "string"
          ? input.runtimeState.activeEventId
          : null,
      activeTaskIds: Array.isArray(input.runtimeState.activeTaskIds)
        ? input.runtimeState.activeTaskIds.filter(
            (value): value is string => typeof value === "string"
          )
        : [],
    };
  }

  const legacyState = isRecord(input.state) ? input.state : {};
  return {
    flags: isRecord(legacyState.flags)
      ? (legacyState.flags as Record<string, boolean>)
      : {},
    variables: isRecord(legacyState.variables)
      ? (legacyState.variables as Record<string, string | number>)
      : {},
    activeEventId: null,
    activeTaskIds: [],
  };
}

function migrateModState(input: SaveRecord): CoreGameState["modState"] {
  return isRecord(input.modState)
    ? (input.modState as CoreGameState["modState"])
    : {};
}

export function migrateSaveEnvelope(input: SaveRecord): SaveEnvelope {
  const selectedModId = readSelectedModId(input);

  return {
    version: CURRENT_SAVE_ENVELOPE_VERSION,
    selectedModId,
    engineState: migrateEngineState(input, selectedModId),
    runtimeState: migrateRuntimeState(input),
    modState: migrateModState(input),
  };
}
