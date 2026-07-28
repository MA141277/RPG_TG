import type {
  ScriptEditorProjectCompletionState,
  ScriptEditorProjectDefinition,
} from "../domain/script-editor-project";

export function createDraftScriptEditorProjectCompletionState(): ScriptEditorProjectCompletionState {
  return {
    state: "draft",
  };
}

export function normalizeScriptEditorProjectCompletionState(
  value: unknown
): ScriptEditorProjectCompletionState {
  if (value == null) {
    return createDraftScriptEditorProjectCompletionState();
  }
  if (typeof value !== "object" || Array.isArray(value)) {
    throw new Error("script editor project completionState must be an object.");
  }

  const candidate = value as Record<string, unknown>;
  if (candidate.state === "draft") {
    return createDraftScriptEditorProjectCompletionState();
  }
  if (candidate.state !== "complete") {
    throw new Error(
      "script editor project completionState.state must be draft or complete."
    );
  }
  if (typeof candidate.completedAt !== "string" || candidate.completedAt.length === 0) {
    throw new Error(
      "script editor project completionState.completedAt must be a non-empty string."
    );
  }
  if (candidate.completedBy !== "runtime-export") {
    throw new Error(
      "script editor project completionState.completedBy must be runtime-export."
    );
  }

  return {
    state: "complete",
    completedAt: candidate.completedAt,
    completedBy: "runtime-export",
  };
}

export function markScriptEditorProjectCompleteForExport(
  project: ScriptEditorProjectDefinition,
  options: {
    completedAt?: string | undefined;
  } = {}
): ScriptEditorProjectDefinition {
  return {
    ...project,
    completionState: {
      state: "complete",
      completedAt: options.completedAt ?? new Date().toISOString(),
      completedBy: "runtime-export",
    },
  };
}
