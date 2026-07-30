import type { Effect } from "./effect";
import type { RuntimeEventEntity } from "./event-router";
import type { NavigationTarget } from "./navigation";
import type { ProgressionSettlementInstance } from "./progression-runtime";
import type { RuntimeState } from "./runtime-state";
import type { SettlementCommand } from "./settlement-command";
import type { TaskAction, TaskSignal, TaskUpdate } from "./task-runtime";
import type { BuildingStatusById } from "../../domain/building-status";
import type { CharacterDefinition } from "../../domain/character";
import type { CharacterStatusById } from "../../domain/character-status";
import type { CityStatusById } from "../../domain/city-status";
import type { LocationAccessResult } from "../../domain/location-access";

export type RuntimeTaskInput =
  | TaskAction
  | TaskSignal
  | {
      type: string;
      taskId: string;
    };

export type RuntimeInteractiveSignal =
  | { type: "reenter-house"; houseId: string }
  | { type: "none" };

export type RuntimeFollowUp = RuntimeInteractiveSignal;

export type RuntimeFollowUpOutcome =
  | { type: "navigation.entered-city"; cityId: string }
  | { type: "time.advanced" }
  | { type: "time.council-threshold-crossed" };

export type RuntimeSettlementResult = {
  commands?: SettlementCommand[];
  effects?: Effect[];
  [key: string]: unknown;
};

export type RuntimeResult = {
  state: RuntimeState;
  effects: Effect[];
  event?: RuntimeEventEntity;
  characterDefinitions?: CharacterDefinition[];
  characterStatusById?: CharacterStatusById;
  cityStatusById?: CityStatusById;
  buildingStatusById?: BuildingStatusById;
  access?: LocationAccessResult;
  navigation?: NavigationTarget | null;
  scene?:
    | {
        sceneId: string;
        currentNodeId?: string | null;
      }
    | null;
  taskInputs?: RuntimeTaskInput[];
  taskUpdates?: TaskUpdate[];
  settlementInstances?: ProgressionSettlementInstance[];
  settlement?: RuntimeSettlementResult | null;
  followUpEventIds?: string[];
  // canonical continuation surface
  followUp?: RuntimeFollowUp | null;
  // compatibility-only legacy continuation surfaces
  outcome?: RuntimeFollowUpOutcome | null;
  interactive?: RuntimeInteractiveSignal | null;
};
