import type {
  CanonicalRuntimeState,
  StateSyncContext,
  StateSyncResult,
  StateSyncTrigger,
} from "../contracts/state-sync-runtime";
import type { RuntimeRequest } from "../contracts/runtime-request";
import type { RuntimeResult } from "../contracts/runtime-result";
import type { TaskDefinition } from "../contracts/task-runtime";
import type { RuntimeState as LegacyBridgeRuntimeState } from "../contracts/runtime-state";
import type { RuntimeFollowUpContext, RuntimeRouter } from "./runtime-router";
import {
  stateSyncCoreSeam,
  type RuntimeAppStateInput,
} from "./state-sync-core-seam";
import { dispatchRuntimeRequest } from "./runtime-dispatch";
import {
  settleRuntimeCommands,
  settleRuntimeEffects,
} from "./runtime-settlement";
import { syncAppState } from "./state-sync-app-bridge";
import { hydrateFromSave } from "./state-sync-hydration";
import { rebuildAfterModActivation } from "./state-sync-mod-rebuild";
import { normalizeRuntimeState } from "./state-sync-normalization";
import { preparePresentationInput } from "./state-sync-presentation";
import { prepareSaveState } from "./state-sync-save";
import { validateCanonicalRuntimeState } from "./state-sync-validation";

export type RuntimeStateBridgeInput = RuntimeAppStateInput & {
  gameState: LegacyBridgeRuntimeState["core"];
  beggingMiniGameState: LegacyBridgeRuntimeState["app"]["beggingMiniGameState"];
  autoAdvanceState: LegacyBridgeRuntimeState["app"]["autoAdvanceState"];
  campaignTravelState: LegacyBridgeRuntimeState["app"]["campaignTravelState"];
  cityDirectoryState: LegacyBridgeRuntimeState["app"]["cityDirectoryState"];
  cityMenuState: LegacyBridgeRuntimeState["app"]["cityMenuState"];
  locationDialogueState: LegacyBridgeRuntimeState["app"]["locationDialogueState"];
  modalState: LegacyBridgeRuntimeState["app"]["modalState"];
  characterDefinitions?: unknown;
};

export type RuntimeResultBridgeInput = {
  state: LegacyBridgeRuntimeState;
  characterDefinitions?: RuntimeResult["characterDefinitions"];
  characterStatusById?: RuntimeResult["characterStatusById"];
  cityStatusById?: RuntimeResult["cityStatusById"];
  buildingStatusById?: RuntimeResult["buildingStatusById"];
};

export type RuntimeCommitInput<TAppState extends RuntimeStateBridgeInput> = {
  state: TAppState;
  request: RuntimeRequest;
  context: {
    router: RuntimeRouter;
    followUp?: RuntimeFollowUpContext;
    taskDefinitionsById?: Record<string, TaskDefinition>;
  };
};

export type RuntimeCommitResult<TAppState extends RuntimeStateBridgeInput> = {
  state: TAppState;
  runtimeResult: RuntimeResult;
};

export function createRuntimeBridgeState(
  state: RuntimeStateBridgeInput
): LegacyBridgeRuntimeState {
  return stateSyncCoreSeam.createRuntimeStateFromAppState(state);
}

export function applyRuntimeBridgeState<
  TAppState extends RuntimeStateBridgeInput,
>(
  state: TAppState,
  runtimeState: LegacyBridgeRuntimeState,
  characterDefinitions?: RuntimeResult["characterDefinitions"],
  characterStatusById?: RuntimeResult["characterStatusById"],
  cityStatusById?: RuntimeResult["cityStatusById"],
  buildingStatusById?: RuntimeResult["buildingStatusById"]
): TAppState {
  return stateSyncCoreSeam.applyRuntimeStateToAppState(
    state,
    runtimeState,
    characterDefinitions,
    characterStatusById,
    cityStatusById,
    buildingStatusById
  );
}

export function applyRuntimeBridgeResult<
  TAppState extends RuntimeStateBridgeInput,
>(state: TAppState, result: RuntimeResultBridgeInput): TAppState {
  return applyRuntimeBridgeState(
    state,
    result.state,
    result.characterDefinitions,
    result.characterStatusById,
    result.cityStatusById,
    result.buildingStatusById
  );
}

export function createInteractiveRuntimeState(
  state: RuntimeStateBridgeInput
): LegacyBridgeRuntimeState {
  return createRuntimeBridgeState(state);
}

export function applyInteractiveRuntimeState<
  TAppState extends RuntimeStateBridgeInput,
>(
  state: TAppState,
  runtimeState: LegacyBridgeRuntimeState,
  characterDefinitions?: RuntimeResult["characterDefinitions"]
): TAppState {
  return applyRuntimeBridgeState(state, runtimeState, characterDefinitions);
}

export function applyInteractiveRuntimeResult<
  TAppState extends RuntimeStateBridgeInput,
>(state: TAppState, result: RuntimeResultBridgeInput): TAppState {
  return applyRuntimeBridgeResult(state, result);
}

export function commitRuntimeRequest<
  TAppState extends RuntimeStateBridgeInput,
>(input: RuntimeCommitInput<TAppState>): RuntimeCommitResult<TAppState> {
  const routedRuntimeResult = dispatchRuntimeRequest({
    state: createRuntimeBridgeState(input.state),
    request: input.request,
    context: input.context,
  });
  const runtimeResult = settleRuntimeResultSettlementEffects(routedRuntimeResult);

  return {
    state: applyRuntimeBridgeState(
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

function settleRuntimeResultSettlementEffects(
  runtimeResult: RuntimeResult
): RuntimeResult {
  const settlementCommands = runtimeResult.settlement?.commands ?? [];
  if (settlementCommands.length > 0) {
    const settled = settleRuntimeCommands({
      state: runtimeResult.state,
      commands: settlementCommands,
      emittedBy: "event-runtime",
      appliedBy: "runtime-settlement",
      ...(runtimeResult.characterDefinitions == null
        ? {}
        : { characterDefinitions: runtimeResult.characterDefinitions }),
      ...(runtimeResult.characterStatusById == null
        ? {}
        : { characterStatusById: runtimeResult.characterStatusById }),
    });

    return {
      ...runtimeResult,
      state: settled.state,
      ...(settled.characterDefinitions == null
        ? {}
        : { characterDefinitions: settled.characterDefinitions }),
      ...(settled.characterStatusById == null
        ? {}
        : { characterStatusById: settled.characterStatusById }),
      ...(runtimeResult.settlement === undefined
        ? {}
        : {
            settlement:
              runtimeResult.settlement === null
                ? null
                : {
                    ...runtimeResult.settlement,
                    commands: settled.settledCommands,
                  },
          }),
    };
  }

  const settlementEffects = runtimeResult.settlement?.effects ?? [];
  if (settlementEffects.length === 0) {
    return runtimeResult;
  }

  const settled = settleRuntimeEffects({
    state: runtimeResult.state,
    effects: settlementEffects,
    emittedBy: "event-runtime",
    appliedBy: "runtime-settlement",
    ...(runtimeResult.characterDefinitions == null
      ? {}
      : { characterDefinitions: runtimeResult.characterDefinitions }),
    ...(runtimeResult.characterStatusById == null
      ? {}
      : { characterStatusById: runtimeResult.characterStatusById }),
  });

  return {
    ...runtimeResult,
    state: settled.state,
    ...(settled.characterDefinitions == null
      ? {}
      : { characterDefinitions: settled.characterDefinitions }),
    ...(settled.characterStatusById == null
      ? {}
      : { characterStatusById: settled.characterStatusById }),
    ...(runtimeResult.settlement === undefined
      ? {}
      : {
          settlement:
            runtimeResult.settlement === null
              ? null
              : {
                  ...runtimeResult.settlement,
                  effects: settled.settledEffects,
                },
        }),
  };
}

export function syncState(
  trigger: StateSyncTrigger,
  context: StateSyncContext
): StateSyncResult {
  let runtimeState =
    context.runtimeState ??
    normalizeRuntimeState(
      hydrateFromSave(context.saveState) ??
        canonicalFromLegacyRuntimeState(context.legacyRuntimeState)
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
      ? syncAppState(runtimeState, context.appState)
      : context.appState;
  const saveState =
    trigger.type === "pre-save"
      ? prepareSaveState(runtimeState, context.saveState)
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
    result.presentationInput = preparePresentationInput(runtimeState, appState);
  }

  return result;
}

function canonicalFromLegacyRuntimeState(
  state: LegacyBridgeRuntimeState | undefined
): ReturnType<typeof normalizeRuntimeState> {
  if (state == null) {
    throw new Error("StateSync Runtime requires runtime state input.");
  }

  return {
    core: state.core,
    tasks: {},
    events: {},
    narrative: {},
    world: {},
    interactive: {
      ...state.app,
      core: state.core,
    },
    modules: {},
  };
}

function validateConsistency(runtimeState: CanonicalRuntimeState): string[] {
  return validateCanonicalRuntimeState(runtimeState).warnings;
}
