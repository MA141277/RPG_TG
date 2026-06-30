import type { LoadedMod, ModRuntimeFailure } from "../contracts/mod-runtime";

export function validateModDependencies(input: {
  loadedMod: LoadedMod;
  availableModsById: Record<string, LoadedMod>;
  requestId: string;
}): ModRuntimeFailure | null {
  for (const dependencyId of input.loadedMod.manifest.dependencies ?? []) {
    if (input.availableModsById[dependencyId] == null) {
      return {
        code: "dependency-missing",
        message: `Missing dependency "${dependencyId}" for mod "${input.loadedMod.manifest.id}".`,
        modId: input.loadedMod.manifest.id,
        requestId: input.requestId,
      };
    }
  }

  for (const conflictId of input.loadedMod.manifest.conflictsWith ?? []) {
    if (input.availableModsById[conflictId] != null) {
      return {
        code: "dependency-conflict",
        message: `Conflicting mod "${conflictId}" is available for "${input.loadedMod.manifest.id}".`,
        modId: input.loadedMod.manifest.id,
        requestId: input.requestId,
      };
    }
  }

  return null;
}
