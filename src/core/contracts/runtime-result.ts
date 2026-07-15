import type { Effect } from "./effect";
import type { NavigationTarget } from "./navigation";
import type { RuntimeState } from "./runtime-state";
import type { TaskAction, TaskSignal } from "./task-runtime";
import type { CharacterDefinition } from "../../domain/character";
import type { CharacterStatusById } from "../../domain/character-status";

export type RuntimeTaskSignal =
  | TaskSignal
  | {
      type: string;
      taskId: string;
    };

export type RuntimeTaskAction = TaskAction | {
  type: string;
  taskId: string;
};

export type RuntimeTaskInput =
  | RuntimeTaskAction
  | RuntimeTaskSignal;

export type RuntimeInteractiveSignal =
  | { type: "reenter-house"; houseId: string }
  | { type: "none" };

export type RuntimeFollowUpOutcome =
  | { type: "navigation.entered-city"; cityId: string }
  | { type: "time.advanced" }
  | { type: "time.council-threshold-crossed" };

export type RuntimeFollowUp =
  | RuntimeFollowUpOutcome
  | RuntimeInteractiveSignal;

export type RuntimeResult = {
  state: RuntimeState;
  effects: Effect[];
  characterDefinitions?: CharacterDefinition[];
  characterStatusById?: CharacterStatusById;
  navigation?: NavigationTarget | null;
  scene?:
    | {
        sceneId: string;
        currentNodeId?: string | null;
      }
    | null;
  taskInputs?: RuntimeTaskInput[];
  followUp?: RuntimeFollowUp | null;
};
