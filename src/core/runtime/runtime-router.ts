import type { RuntimeRequest } from "../contracts/runtime-request";
import type { RuntimeResult } from "../contracts/runtime-result";
import type { RuntimeState } from "../contracts/runtime-state";

export type RuntimeRouteInput = {
  state: RuntimeState;
  request: RuntimeRequest;
};

export interface RuntimeRouter {
  route(input: RuntimeRouteInput): RuntimeResult;
}
