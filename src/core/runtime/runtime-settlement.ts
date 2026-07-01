import type { Effect } from "../contracts/effect";
import type {
  EffectSettlementInput,
  EffectSettlementResult,
} from "../contracts/effect-settlement";
import type { RuntimeState } from "../contracts/runtime-state";
import { HOUSE_ACTIVITY_SEGMENTS_PER_DAY } from "../../application/house/house-activity-costs";
import { advanceGameStateTimeSegments } from "../../application/time/time-progression";

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

    if (effect.type === "advanceTime") {
      const totalSegments =
        Math.max(0, Math.floor(effect.days ?? 0)) *
          HOUSE_ACTIVITY_SEGMENTS_PER_DAY +
        Math.max(0, Math.floor(effect.hours ?? 0));
      nextState = {
        ...nextState,
        core: advanceGameStateTimeSegments(nextState.core, totalSegments),
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
