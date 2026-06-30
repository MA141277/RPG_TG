import type { RuntimeRequest } from "../contracts/runtime-request";
import type { RuntimeResult } from "../contracts/runtime-result";
import type { RuntimeState } from "../contracts/runtime-state";
import { applyEffects } from "./runtime-settlement";

export function dispatchRuntimeRequest(input: {
  state: RuntimeState;
  request: RuntimeRequest;
  context: {
    routeRequest: (input: {
      state: RuntimeState;
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
