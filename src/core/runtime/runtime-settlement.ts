import type { Effect } from "../contracts/effect";
import type {
  EffectSettlementInput,
  EffectSettlementResult,
} from "../contracts/effect-settlement";
import type { RuntimeState } from "../contracts/runtime-state";

export function applyEffects(
  state: RuntimeState,
  effects: Effect[]
): RuntimeState {
  return settleRuntimeEffects({
    state,
    effects,
    emittedBy: "runtime-router",
    appliedBy: "runtime-settlement",
  }).state;
}

export function settleRuntimeEffects(
  input: EffectSettlementInput
): EffectSettlementResult {
  let nextState = input.state;
  const settledEffects: Effect[] = [];
  const unsupportedEffects: Effect[] = [];
  const warnings: string[] = [];

  for (const effect of input.effects) {
    if (effect.type === "setFlag") {
      nextState = {
        ...nextState,
        core: {
          ...nextState.core,
          runtime: {
            ...nextState.core.runtime,
            flags: {
              ...nextState.core.runtime.flags,
              [effect.key]: effect.value,
            },
          },
        },
      };
      settledEffects.push(effect);
      continue;
    }

    if (effect.type === "setVariable") {
      nextState = {
        ...nextState,
        core: {
          ...nextState.core,
          runtime: {
            ...nextState.core.runtime,
            variables: {
              ...nextState.core.runtime.variables,
              [effect.key]: effect.value,
            },
          },
        },
      };
      settledEffects.push(effect);
      continue;
    }

    unsupportedEffects.push(effect);
    warnings.push(
      `unsupported-effect:${effect.type}:emitted-by:${input.emittedBy}`
    );
  }

  return {
    state: nextState,
    settledEffects,
    unsupportedEffects,
    warnings,
  };
}
