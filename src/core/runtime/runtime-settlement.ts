import type { CoreGameState } from "../contracts/core-state";
import type { Effect } from "../contracts/effect";

export function applyEffects(
  state: CoreGameState,
  effects: Effect[]
): CoreGameState {
  return effects.reduce((current, effect) => {
    if (effect.type === "setFlag") {
      return {
        ...current,
        runtime: {
          ...current.runtime,
          flags: {
            ...current.runtime.flags,
            [effect.key]: effect.value,
          },
        },
      };
    }

    if (effect.type === "setVariable") {
      return {
        ...current,
        runtime: {
          ...current.runtime,
          variables: {
            ...current.runtime.variables,
            [effect.key]: effect.value,
          },
        },
      };
    }

    return current;
  }, state);
}
