import type { RuntimeResult } from "./runtime-result";

export type InteractiveRuntimeKind =
  | "activity-qte"
  | "city-begging"
  | "story-battle";

export type InteractiveRuntimeSource =
  | { type: "house"; houseId: string }
  | { type: "scene"; sceneId: string }
  | { type: "external"; id: string };

export type ActiveInteractiveRuntimeSession = {
  kind: InteractiveRuntimeKind;
  sessionId: string;
  source: InteractiveRuntimeSource;
};

export type LaunchInteractiveRequest = {
  phase: "launch";
  kind: InteractiveRuntimeKind;
  interactiveId: string;
  source: InteractiveRuntimeSource;
  payload?: Record<string, unknown>;
};

export type InteractiveActionRequest = {
  phase: "action";
  kind: InteractiveRuntimeKind;
  sessionId: string;
  actionId: string;
  payload?: Record<string, unknown>;
};

export type ExitInteractiveRequest = {
  phase: "exit";
  kind: InteractiveRuntimeKind;
  sessionId: string;
  payload?: Record<string, unknown>;
};

export type InteractiveRuntimeRequest =
  | LaunchInteractiveRequest
  | InteractiveActionRequest
  | ExitInteractiveRequest;

export type InteractiveRuntimeHandoff =
  | { type: "none" }
  | { type: "reenter-house"; houseId: string };

export type InteractiveRuntimeResult = RuntimeResult & {
  session: ActiveInteractiveRuntimeSession | null;
  interactive: InteractiveRuntimeHandoff;
};
