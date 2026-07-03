import type { Effect } from "./effect";
import type { NavigationTarget } from "./navigation";
import type { RuntimeState } from "./runtime-state";
import type { TaskAction, TaskSignal, TaskUpdate } from "./task-runtime";

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

export type RuntimeInteractiveSignal =
  | { type: "reenter-house"; houseId: string }
  | { type: "none" };

export type RuntimeFollowUpOutcome =
  | { type: "navigation.entered-city"; cityId: string }
  | { type: "time.advanced" }
  | { type: "time.council-threshold-crossed" };

export type RuntimeResult = {
  state: RuntimeState;
  effects: Effect[];
  characterDefinitions?: unknown;
  navigation?: NavigationTarget | null;
  scene?:
    | {
        sceneId: string;
        currentNodeId?: string | null;
      }
    | null;
  taskActions?: RuntimeTaskAction[];
  taskSignals?: RuntimeTaskSignal[];
  taskUpdates?: TaskUpdate[];
  outcome?: RuntimeFollowUpOutcome | null;
  interactive?: RuntimeInteractiveSignal | null;
};
