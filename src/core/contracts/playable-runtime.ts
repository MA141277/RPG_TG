import type { Effect } from "./effect";

export type PlayableId = string & {};

export type PlayableIntegrationId = string & {};

export type PlayableOwnerKind =
  | "house"
  | "scene"
  | "dialogue"
  | "task"
  | "external";

export type PlayableReturnPolicy =
  | "resume-owner"
  | "reenter-owner"
  | "close-only";

export type PlayableOwnerContext = {
  ownerKind: PlayableOwnerKind;
  ownerId: string | null;
  returnPolicy: PlayableReturnPolicy;
  sessionToken?: string | undefined;
};

export type PlayableTriggerDefinition = {
  triggerId: string;
  ownerKind: PlayableOwnerKind;
  trigger: string;
  launchPayload?: Record<string, unknown> | undefined;
};

export type PlayableOutcome = "success" | "failure" | "cancelled";

export type PlayableFactValue = string | number | boolean | null;

export type PlayableFactResult = {
  status: "completed" | "failed" | "cancelled" | "aborted";
  metrics?: Record<string, PlayableFactValue> | undefined;
  detail?: Record<string, unknown> | undefined;
};

export type PlayableOutcomeConfig = {
  successWhen?: Record<string, PlayableFactValue> | undefined;
  failureWhen?: Record<string, PlayableFactValue> | undefined;
  cancelledWhen?: Record<string, PlayableFactValue> | undefined;
  handoffByOutcome?:
    | Partial<Record<PlayableOutcome, PlayableReturnPolicy>>
    | undefined;
};

export type PlayableDefinition = {
  id: PlayableId;
  commandPrefix: string;
  legacyInteractiveKind?: string | undefined;
};

export type PlayableIntegrationDefinition = {
  integrationId: PlayableIntegrationId;
  playableId: PlayableId;
  ownerDefaults: Partial<PlayableOwnerContext>;
  trigger: PlayableTriggerDefinition;
  outcomeConfig: PlayableOutcomeConfig;
};

export type PlayableLaunchInput = {
  playableId?: PlayableId | undefined;
  integrationId?: PlayableIntegrationId | undefined;
  ownerContext?: Partial<PlayableOwnerContext> | undefined;
  payload?: Record<string, unknown> | undefined;
};

export type PlayableLaunchRequest = {
  playableId: PlayableId;
  integrationId: PlayableIntegrationId;
  ownerContext: PlayableOwnerContext;
  payload?: Record<string, unknown> | undefined;
};

export type PlayableCommand =
  | { type: "confirm" }
  | { type: "cancel" }
  | { type: "select"; value: string }
  | { type: "custom"; actionId: string; payload?: Record<string, unknown> };

export type ActivePlayableSession = {
  sessionId: string;
  playableId: PlayableId;
  integrationId: PlayableIntegrationId;
  ownerContext: PlayableOwnerContext;
  status: "active" | "completed" | "cancelled";
  state?: Record<string, unknown> | undefined;
};

export type PlayablePresenterModel = {
  playableId: PlayableId;
  layout: "compact" | "panel" | "battlefield";
  title: string;
  summaryLines: string[];
  actions: Array<{
    id: string;
    label: string;
    commandType: "confirm" | "cancel" | "custom";
  }>;
  viewModel?: Record<string, unknown> | undefined;
  detail?: Record<string, unknown> | undefined;
};

export type PlayableSettlement = {
  integrationId: PlayableIntegrationId;
  outcome: PlayableOutcome;
  factResult: PlayableFactResult;
  handoff: {
    type: PlayableReturnPolicy;
    ownerKind: PlayableOwnerKind;
    ownerId: string | null;
    sessionToken?: string | undefined;
  };
  effects?: Effect[];
};

export type PlayableResult = PlayableSettlement;

export type PlayableLaunchFailureCode =
  | "missing-playable-id"
  | "missing-integration"
  | "unknown-playable"
  | "unknown-integration"
  | "ambiguous-integration"
  | "missing-owner-kind"
  | "missing-owner-id"
  | "missing-return-policy"
  | "integration-mismatch";

export type PlayableLaunchFailure = {
  ok: false;
  code: PlayableLaunchFailureCode;
  message: string;
};

export type PlayableLaunchResolution =
  | {
      ok: true;
      definition: PlayableDefinition;
      integration: PlayableIntegrationDefinition;
      launch: PlayableLaunchRequest;
    }
  | PlayableLaunchFailure;
