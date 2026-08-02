import type { RuntimeState } from "../../core/contracts/runtime-state";

export function exitActivityQtePlayable(state: RuntimeState): RuntimeState {
  return {
    ...state,
    core: {
      ...state.core,
      runtime: {
        ...state.core.runtime,
        playableSession: null,
        activitySession: null,
      },
    },
  };
}
