import type { RuntimeRequest } from "../contracts/runtime-request";
import type { RuntimeInteractiveSignal } from "../contracts/runtime-result";
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

export type RuntimeFollowUpContext = {
  handleInteractive?(input: RuntimeInteractiveFollowUpInput): RuntimeState;
};

export interface RuntimeRouter {
  route(input: RuntimeRouteInput): RuntimeResult;
}
