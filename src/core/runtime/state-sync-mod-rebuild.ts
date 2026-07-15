import type { CanonicalRuntimeState } from "../contracts/state-sync-runtime";

export function rebuildAfterModActivation(
  runtimeState: CanonicalRuntimeState,
  modId: string,
  moduleState: Record<string, unknown> | undefined
): CanonicalRuntimeState {
  return {
    ...runtimeState,
    modules: {
      ...runtimeState.modules,
      [modId]: moduleState?.[modId] ?? runtimeState.modules[modId] ?? {},
    },
  };
}
