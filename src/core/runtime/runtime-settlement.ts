import type { Effect } from "../contracts/effect";
import type { RuntimeState } from "../contracts/runtime-state";

export function applyEffects(
  state: RuntimeState,
  effects: Effect[]
): RuntimeState {
  return effects.reduce((current, effect) => {
    if (effect.type === "setFlag") {
      return {
        ...current,
        core: {
          ...current.core,
          runtime: {
            ...current.core.runtime,
            flags: {
              ...current.core.runtime.flags,
              [effect.key]: effect.value,
            },
          },
        },
      };
    }

    if (effect.type === "setVariable") {
      return {
        ...current,
        core: {
          ...current.core,
          runtime: {
            ...current.core.runtime,
            variables: {
              ...current.core.runtime.variables,
              [effect.key]: effect.value,
            },
          },
        },
      };
    }
    
    return current;
  }, state);
}
