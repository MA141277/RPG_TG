import type { CoreGameState } from "./core-state";
import type { Effect } from "./effect";
import type { NavigationTarget } from "./navigation";

export type RuntimeTaskSignal = {
  type: string;
  taskId: string;
};

export type RuntimeTaskAction = {
  type: string;
  taskId: string;
};

export type RuntimeResult = {
  state: CoreGameState;
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
};
