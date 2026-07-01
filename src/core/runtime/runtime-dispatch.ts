import type { RuntimeRequest } from "../contracts/runtime-request";
import type { RuntimeResult } from "../contracts/runtime-result";
import type { RuntimeState } from "../contracts/runtime-state";
import type { RuntimeRouter } from "./runtime-router";
import { settleRuntimeEffects } from "./runtime-settlement";

export function dispatchRuntimeRequest(input: {
  state: RuntimeState;
  request: RuntimeRequest;
  context: {
    router: RuntimeRouter;
  };
}): RuntimeResult {
  const routed = input.context.router.route({
    state: input.state,
    request: input.request,
  });
  const settlement = settleRuntimeEffects({
    state: routed.state,
    effects: routed.effects,
    emittedBy: "runtime-router",
    appliedBy: "runtime-settlement",
  });

  return {
    ...routed,
    state: settlement.state,
  };
}
