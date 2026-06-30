import type { RuntimeRequest } from "../contracts/runtime-request";
import type { RuntimeResult } from "../contracts/runtime-result";
import type { RuntimeState } from "../contracts/runtime-state";

export type RuntimeRouter = (input: {
  state: RuntimeState;
  request: RuntimeRequest;
}) => RuntimeResult;
