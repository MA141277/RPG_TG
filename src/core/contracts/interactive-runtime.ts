import type { RuntimeResult } from "./runtime-result";
import type { ActivePlayableSession, PlayableLaunchRequest } from "./playable-runtime";

export type InteractiveRuntimeKind =
  | "story-battle";

export type InteractiveRuntimeSource =
  | { type: "house"; houseId: string }
  | { type: "dialogue"; dialogueId: string }
  | { type: "external"; id: string };

export type ActiveInteractiveRuntimeSession = {
  kind: InteractiveRuntimeKind;
  sessionId: string;
  source: InteractiveRuntimeSource;
  playable: ActivePlayableSession;
};

export type LaunchInteractiveRequest = {
  phase: "launch";
  kind: InteractiveRuntimeKind;
  interactiveId: string;
  source: InteractiveRuntimeSource;
  playableLaunch: PlayableLaunchRequest;
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
  followUp: InteractiveRuntimeHandoff;
};
