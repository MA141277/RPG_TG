import type { CharacterDefinition } from "../../domain/character";
import type { CharacterStatusById } from "../../domain/character-status";
import type { RuntimeState } from "./runtime-state";

export type SettlementCommand =
  | { type: "flag.set"; key: string; value: boolean }
  | { type: "variable.set"; key: string; value: string | number }
  | { type: "time.advance"; hours?: number; days?: number }
  | {
      type: "character.numeric-property.mutate";
      characterId: string;
      propertyId: string;
      operation: "set" | "add" | "subtract";
      value: number;
    };

export type SettlementCommandRuntimeInput = {
  state: RuntimeState;
  commands: SettlementCommand[];
  characterDefinitions?: CharacterDefinition[];
  characterStatusById?: CharacterStatusById;
};

export type SettlementCommandRuntimeResult = {
  state: RuntimeState;
  characterDefinitions?: CharacterDefinition[];
  characterStatusById?: CharacterStatusById;
  settledCommands: SettlementCommand[];
  unsupportedCommands: SettlementCommand[];
  warnings: string[];
};
