import type { Effect } from "./effect";
import type { ProgressionSettlementInstance } from "./progression-runtime";
import type { RuntimeState } from "./runtime-state";
import type { SettlementCommand } from "./settlement-command";
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

export type SettlementRuntimeApplier = "runtime-settlement";

export type SettlementRuntimeInput = {
  state: RuntimeState;
  commands: SettlementCommand[];
  settlementInstances?: ProgressionSettlementInstance[];
  settlementDefinitionsById?: Record<string, SettlementDefinition | undefined>;
  emittedBy: EffectEmitter;
  appliedBy: SettlementRuntimeApplier;
  characterDefinitions?: CharacterDefinition[];
  characterStatusById?: CharacterStatusById;
};

export type SettlementRuntimeResult = {
  state: RuntimeState;
  characterDefinitions?: CharacterDefinition[];
  characterStatusById?: CharacterStatusById;
  settledCommands: SettlementCommand[];
  unsupportedCommands: SettlementCommand[];
  warnings: string[];
};

export type EffectSettlementApplier = SettlementRuntimeApplier;

export type EffectSettlementInput = Omit<SettlementRuntimeInput, "commands"> & {
  effects: Effect[];
};

export type EffectSettlementResult = Omit<
  SettlementRuntimeResult,
  "settledCommands" | "unsupportedCommands"
> & {
  settledEffects: Effect[];
  unsupportedEffects: Effect[];
};
