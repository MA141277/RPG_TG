import type {
  CanonicalRuntimeState,
  StateSyncContext,
  StateSyncResult,
  StateSyncTrigger,
} from "../contracts/state-sync-runtime";
import type { RuntimeRequest } from "../contracts/runtime-request";
import type { RuntimeResult } from "../contracts/runtime-result";
import type { TaskDefinition } from "../contracts/task-runtime";
import type { RuntimeFollowUpContext, RuntimeRouter } from "./runtime-router";
import { dispatchRuntimeRequest } from "./runtime-dispatch";
import {
  stateSyncCoreSeam,
  type RuntimeAppStateInput,
} from "./state-sync-core-seam";
import { rebuildAfterModActivation } from "./state-sync-mod-rebuild";
import { validateCanonicalRuntimeState } from "./state-sync-validation";

export type RuntimeCommitInput<TAppState extends RuntimeAppStateInput> = {
  state: TAppState;
  request: RuntimeRequest;
  context: {
    router: RuntimeRouter;
    followUp?: RuntimeFollowUpContext;
    taskDefinitionsById?: Record<string, TaskDefinition>;
  };
};

export type RuntimeCommitResult<TAppState extends RuntimeAppStateInput> = {
  state: TAppState;
  runtimeResult: RuntimeResult;
};

export function commitRuntimeRequest<
  TAppState extends RuntimeAppStateInput,
>(input: RuntimeCommitInput<TAppState>): RuntimeCommitResult<TAppState> {
  const runtimeResult = dispatchRuntimeRequest({
    state: stateSyncCoreSeam.createRuntimeStateFromAppState(input.state),
    request: input.request,
    context: input.context,
  });

  return {
    state: stateSyncCoreSeam.applyRuntimeStateToAppState(
      input.state,
      runtimeResult.state,
      runtimeResult.characterDefinitions,
      runtimeResult.characterStatusById,
      runtimeResult.cityStatusById,
      runtimeResult.buildingStatusById
    ),
    runtimeResult,
  };
}

export function syncState(
  trigger: StateSyncTrigger,
  context: StateSyncContext
): StateSyncResult {
  let runtimeState =
    context.runtimeState ??
    stateSyncCoreSeam.normalizeRuntimeState(
      stateSyncCoreSeam.hydrateRuntimeState(context.saveState)
    );

  if (trigger.type === "mod-activated") {
    runtimeState = rebuildAfterModActivation(
      runtimeState,
      trigger.modId,
      context.moduleState
    );
  }

  const appState =
    trigger.type === "session-rebuild"
      ? stateSyncCoreSeam.syncAppState(runtimeState, context.appState)
      : context.appState;
  const saveState =
    trigger.type === "pre-save"
      ? stateSyncCoreSeam.createSaveState(runtimeState, context.saveState)
      : context.saveState;

  const result: StateSyncResult = {
    runtimeState,
    warnings: validateConsistency(runtimeState),
  };

  if (appState !== undefined) {
    result.appState = appState;
  }
  if (saveState !== undefined) {
    result.saveState = saveState;
  }
  if (context.presentationInput !== undefined) {
    result.presentationInput = context.presentationInput;
  } else if (appState !== undefined) {
    result.presentationInput = stateSyncCoreSeam.createPresentationInput(
      runtimeState,
      appState
    );
  }

  return result;
}

function validateConsistency(runtimeState: CanonicalRuntimeState): string[] {
  return validateCanonicalRuntimeState(runtimeState).warnings;
}
