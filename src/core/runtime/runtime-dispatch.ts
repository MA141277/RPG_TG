import type { CoreGameState } from "../contracts/core-state";
import type { RuntimeRequest } from "../contracts/runtime-request";
import type { RuntimeResult } from "../contracts/runtime-result";
import { applyEffects } from "./runtime-settlement";

export function dispatchRuntimeRequest(input: {
  state: CoreGameState;
  request: RuntimeRequest;
  context: {
    routeRequest: (input: {
      state: CoreGameState;
      request: RuntimeRequest;
    }) => RuntimeResult;
  };
}): RuntimeResult {
  const routed = input.context.routeRequest({
    state: input.state,
    request: input.request,
  });

  return {
    ...routed,
    state: applyEffects(routed.state, routed.effects),
  };
}
