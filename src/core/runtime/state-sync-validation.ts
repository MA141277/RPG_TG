import type { CanonicalRuntimeState } from "../contracts/state-sync-runtime";

export type StateSyncValidationResult = {
  valid: boolean;
  warnings: string[];
};

export function validateCanonicalRuntimeState(
  state: CanonicalRuntimeState
): StateSyncValidationResult {
  const warnings: string[] = [];

  if (state.core.runtime == null) {
    warnings.push("missing-runtime-slice");
  }

  return {
    valid:
      state.core != null &&
      state.tasks != null &&
      state.events != null &&
      state.narrative != null &&
      state.world != null &&
      state.interactive != null &&
      state.modules != null,
    warnings,
  };
}
