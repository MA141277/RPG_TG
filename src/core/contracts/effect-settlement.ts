import type { Effect } from "./effect";
import type { ProgressionSettlementInstance } from "./progression-runtime";
import type { RuntimeState } from "./runtime-state";
import type { CharacterDefinition } from "../../domain/character";
import type { CharacterStatusById } from "../../domain/character-status";

export type SettlementContentDefinition = {
  targetFamily: "person" | "city" | "building";
  targetId: string;
  attributeKey: string;
  attributeType: "number" | "boolean" | "enum";
  operation: "add" | "subtract" | "set";
  value: string | number | boolean;
};

export type SettlementDefinition = {
  contents?: readonly SettlementContentDefinition[];
};

export type EffectEmitter =
  | "runtime-router"
  | "interactive-runtime"
  | "house-runtime"
  | "task-runtime"
  | "event-runtime"
  | "scene-runtime"
  | "progression-runtime"
  | "unknown";

export type EffectSettlementApplier = "runtime-settlement";

export type EffectSettlementInput = {
  state: RuntimeState;
  effects: Effect[];
  settlementInstances?: ProgressionSettlementInstance[];
  settlementDefinitionsById?: Record<string, SettlementDefinition | undefined>;
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
