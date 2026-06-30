import type { CanonicalRuntimeState } from "../contracts/state-sync-runtime";

export function normalizeRuntimeState(
  state: Partial<CanonicalRuntimeState> | undefined
): CanonicalRuntimeState {
  if (state?.core == null) {
    throw new Error("StateSync Runtime requires canonical core state.");
  }

  return {
    core: state.core,
    tasks: state.tasks ?? {},
    events: state.events ?? {},
    narrative: state.narrative ?? {},
    world: state.world ?? {},
    interactive: state.interactive ?? {},
    modules: state.modules ?? {},
  };
}
