import type { CoreGameState } from "../contracts/core-state";
import type { ModSourceDescriptor } from "../contracts/mod-runtime";
import { CURRENT_SAVE_ENVELOPE_VERSION, type SaveEnvelope } from "./save-envelope";

type SaveRecord = Record<string, unknown>;

function isRecord(value: unknown): value is SaveRecord {
  return typeof value === "object" && value !== null;
}

function readSelectedModId(input: SaveRecord): string {
  return typeof input.selectedModId === "string" && input.selectedModId.trim().length > 0
    ? input.selectedModId.trim()
    : "";
}

function readSelectedModSource(
  input: SaveRecord,
  selectedModId: string
): ModSourceDescriptor | null {
  const source = input.selectedModSource;
  if (!isRecord(source) || typeof source.kind !== "string") {
    return selectedModId.startsWith("builtin.")
      ? {
          kind: "builtin",
          modId: selectedModId,
        }
      : null;
  }

  if (source.kind === "builtin") {
    return {
      kind: "builtin",
      modId: selectedModId,
    };
  }

  if (
    source.kind === "file" &&
    typeof source.name === "string" &&
    typeof source.filePath === "string"
  ) {
    return {
      kind: "file",
      name: source.name,
      filePath: source.filePath,
    };
  }

  if (
    source.kind === "url" &&
    typeof source.name === "string" &&
    typeof source.url === "string"
  ) {
    return {
      kind: "url",
      name: source.name,
      url: source.url,
    };
  }

  throw new Error("Unsupported save format: selectedModSource.");
}

function readEngineState(
  input: SaveRecord,
  selectedModId: string
): CoreGameState["engine"] {
  if (!isRecord(input.engineState)) {
    throw new Error("Unsupported save format: engineState.");
  }

  const currentView = input.engineState.currentView;
  if (
    currentView !== "map" &&
    currentView !== "city" &&
    currentView !== "house" &&
    currentView !== "dialogue" &&
    currentView !== "interactive"
  ) {
    throw new Error("Unsupported save format: engineState.currentView.");
  }

  return {
    selectedModId,
    version:
      typeof input.engineState.version === "string"
        ? input.engineState.version
        : CURRENT_SAVE_ENVELOPE_VERSION,
    currentView,
  };
}

function readRuntimeState(input: SaveRecord): CoreGameState["runtime"] {
  if (!isRecord(input.runtimeState)) {
    throw new Error("Unsupported save format: runtimeState.");
  }

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

function readModState(input: SaveRecord): CoreGameState["modState"] {
  return isRecord(input.modState) ? (input.modState as CoreGameState["modState"]) : {};
}

export function normalizeSaveEnvelope(input: SaveRecord): SaveEnvelope {
  if (!isRecord(input)) {
    throw new Error("Unsupported save format.");
  }

  const selectedModId = readSelectedModId(input);
  if (selectedModId.length === 0) {
    throw new Error("Unsupported save format: selectedModId.");
  }

  return {
    version:
      typeof input.version === "string" && input.version.length > 0
        ? input.version
        : CURRENT_SAVE_ENVELOPE_VERSION,
    selectedModId,
    selectedModSource: readSelectedModSource(input, selectedModId),
    engineState: readEngineState(input, selectedModId),
    runtimeState: readRuntimeState(input),
    modState: readModState(input),
  };
}
