import type { RuntimeRequest } from "../contracts/runtime-request";
import type { RuntimeResult } from "../contracts/runtime-result";
import type { RuntimeState } from "../contracts/runtime-state";
import type { RuntimeFollowUpContext } from "./runtime-router";
import type { RuntimeRouter } from "./runtime-router";
import { settleRuntimeEffects } from "./runtime-settlement";

export function dispatchRuntimeRequest(input: {
  state: RuntimeState;
  request: RuntimeRequest;
  context: {
    router: RuntimeRouter;
    followUp?: RuntimeFollowUpContext;
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
  const followUp = settleRuntimeFollowUp({
    state: settlement.state,
    interactive: routed.interactive,
    context: input.context.followUp,
  });

  return {
    ...routed,
    state: followUp.state,
    ...(followUp.interactive === undefined
      ? {}
      : { interactive: followUp.interactive }),
  };
}

function settleRuntimeFollowUp(input: {
  state: RuntimeState;
  interactive: RuntimeResult["interactive"];
  context: RuntimeFollowUpContext | undefined;
}): {
  state: RuntimeState;
  interactive: RuntimeResult["interactive"];
} {
  if (
    input.interactive == null ||
    input.interactive.type === "none" ||
    input.context?.handleInteractive == null
  ) {
    return {
      state: input.state,
      interactive: input.interactive,
    };
  }

  return {
    state: input.context.handleInteractive({
      state: input.state,
      interactive: input.interactive,
    }),
    interactive: { type: "none" },
  };
}
