import type { CoreGameState } from "../contracts/core-state";
import type { RuntimeRequest } from "../contracts/runtime-request";
import type { RuntimeResult } from "../contracts/runtime-result";

export type RuntimeRouter = (input: {
  state: CoreGameState;
  request: RuntimeRequest;
}) => RuntimeResult;
