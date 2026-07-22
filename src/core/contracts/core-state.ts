export type ViewName =
  | "map"
  | "city"
  | "house"
  | "dialogue"
  | "interactive";

export type EngineState = {
  selectedModId: string;
  version: string;
  currentView: ViewName;
};

export type CoreStateRuntimeSlice = {
  flags: Record<string, boolean>;
  variables: Record<string, string | number>;
  activeEventId: string | null;
  activeTaskIds: string[];
};

export type RuntimeState = CoreStateRuntimeSlice;

export type CoreGameState = {
  engine: EngineState;
  runtime: RuntimeState;
  modState: Record<string, unknown>;
};
