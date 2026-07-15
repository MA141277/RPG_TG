import type { RuntimeRequest } from "../contracts/runtime-request";
import type {
  RuntimeFollowUpOutcome,
  RuntimeInteractiveSignal,
} from "../contracts/runtime-result";
import type { RuntimeResult } from "../contracts/runtime-result";
import type { RuntimeState } from "../contracts/runtime-state";

export type RuntimeRouteInput = {
  state: RuntimeState;
  request: RuntimeRequest;
};

export type RuntimeInteractiveFollowUpInput = {
  state: RuntimeState;
  interactive: Exclude<NonNullable<RuntimeInteractiveSignal>, { type: "none" }>;
};

export type RuntimeOutcomeFollowUpInput = {
  state: RuntimeState;
  outcome: RuntimeFollowUpOutcome;
};

export type RuntimeOutcomeFollowUpResult = {
  state: RuntimeState;
  characterDefinitions?: unknown;
};

export type RuntimeFollowUpContext = {
  handleInteractive?(input: RuntimeInteractiveFollowUpInput): RuntimeState;
  handleOutcome?(input: RuntimeOutcomeFollowUpInput): RuntimeOutcomeFollowUpResult;
};

export interface RuntimeRouter {
  route(input: RuntimeRouteInput): RuntimeResult;
}
