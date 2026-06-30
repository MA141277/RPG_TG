import type { Effect } from "./effect";
import type { NavigationTarget } from "./navigation";
import type { RuntimeState } from "./runtime-state";

export type RuntimeTaskSignal = {
  type: string;
  taskId: string;
};

export type RuntimeTaskAction = {
  type: string;
  taskId: string;
};

export type RuntimeInteractiveSignal =
  | { type: "reenter-house"; houseId: string }
  | { type: "none" };

export type RuntimeResult = {
  state: RuntimeState;
  effects: Effect[];
  navigation?: NavigationTarget | null;
  scene?:
    | {
        sceneId: string;
        currentNodeId?: string | null;
      }
    | null;
  taskActions?: RuntimeTaskAction[];
  taskSignals?: RuntimeTaskSignal[];
  interactive?: RuntimeInteractiveSignal | null;
};
