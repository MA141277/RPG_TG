import type { Effect } from "./effect";
import type { RuntimeState } from "./runtime-state";

export type EffectEmitter =
  | "runtime-router"
  | "interactive-runtime"
  | "house-runtime"
  | "task-runtime"
  | "event-runtime"
  | "scene-runtime"
  | "unknown";

export type EffectSettlementApplier = "runtime-settlement";

export type EffectSettlementInput = {
  state: RuntimeState;
  effects: Effect[];
  emittedBy: EffectEmitter;
  appliedBy: EffectSettlementApplier;
};

export type EffectSettlementResult = {
  state: RuntimeState;
  settledEffects: Effect[];
  unsupportedEffects: Effect[];
  warnings: string[];
};
