import type { RuntimeState as LegacyBridgeRuntimeState } from "./runtime-state";

export type CoreRuntimeState = LegacyBridgeRuntimeState["core"];
export type TaskRuntimeState = Record<string, unknown>;
export type EventRuntimeState = Record<string, unknown>;
export type NarrativeRuntimeState = Record<string, unknown>;
export type WorldRuntimeState = Record<string, unknown>;
export type InteractiveRuntimeState = Partial<LegacyBridgeRuntimeState["app"]> & {
  core?: LegacyBridgeRuntimeState["core"];
};
export type UIState = Record<string, unknown>;
export type SessionState = Record<string, unknown>;

export type CanonicalRuntimeState = {
  core: CoreRuntimeState;
  tasks: TaskRuntimeState;
  events: EventRuntimeState;
  narrative: NarrativeRuntimeState;
  world: WorldRuntimeState;
  interactive: InteractiveRuntimeState;
  modules: Record<string, unknown>;
};

export type AppStateBridge = {
  ui: UIState;
  session: SessionState;
  view: Record<string, unknown>;
};

export type SaveState = {
  version: string;
  timestamp: number;
  runtime: Partial<CanonicalRuntimeState>;
  meta?: Record<string, unknown>;
};

export type PresentationInput = {
  runtime: CanonicalRuntimeState;
  app: AppStateBridge;
};

export type StateSyncTrigger =
  | { type: "boot" }
  | { type: "load" }
  | { type: "runtime-commit"; source: string }
  | { type: "mod-activated"; modId: string }
  | { type: "session-rebuild" }
  | { type: "pre-save" };

export type StateSyncContext = {
  runtimeState?: CanonicalRuntimeState;
  legacyRuntimeState?: LegacyBridgeRuntimeState;
  appState?: AppStateBridge;
  saveState?: SaveState;
  presentationInput?: PresentationInput;
  moduleState?: Record<string, unknown>;
  meta?: Record<string, unknown>;
};

export type StateSyncResult = {
  runtimeState: CanonicalRuntimeState;
  appState?: AppStateBridge;
  saveState?: SaveState;
  presentationInput?: PresentationInput;
  warnings: string[];
};

export interface StateSyncRuntime {
  sync(trigger: StateSyncTrigger, context: StateSyncContext): StateSyncResult;
}
