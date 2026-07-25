import type { Effect } from "./effect";
import type { RuntimeState } from "./runtime-state";
import type { ProgressionSettlementInstance } from "./progression-runtime";
import type { CharacterDefinition } from "../../domain/character";
import type { CharacterStatusById } from "../../domain/character-status";

export type EffectEmitter =
  | "runtime-router"
  | "interactive-runtime"
  | "house-runtime"
  | "task-runtime"
  | "event-runtime"
  | "progression-runtime"
  | "unknown";

export type EffectSettlementApplier = "runtime-settlement";

export type EffectSettlementInput = {
  state: RuntimeState;
  effects: Effect[];
  settlementInstances?: ProgressionSettlementInstance[];
  emittedBy: EffectEmitter;
  appliedBy: EffectSettlementApplier;
  characterDefinitions?: CharacterDefinition[];
  characterStatusById?: CharacterStatusById;
};

export type EffectSettlementResult = {
  state: RuntimeState;
  characterDefinitions?: CharacterDefinition[];
  characterStatusById?: CharacterStatusById;
  settledEffects: Effect[];
  unsupportedEffects: Effect[];
  warnings: string[];
};
