export type ViewName = "map" | "city" | "house" | "scene" | "interactive";

export type EngineState = {
  selectedModId: string;
  version: string;
  currentView: ViewName;
};

export type RuntimeState = {
  flags: Record<string, boolean>;
  variables: Record<string, string | number>;
  activeEventId: string | null;
  activeTaskIds: string[];
};

export type CoreGameState = {
  engine: EngineState;
  runtime: RuntimeState;
  modState: Record<string, unknown>;
};
