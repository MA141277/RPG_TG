import type {
  CanonicalRuntimeState,
  StateSyncContext,
  StateSyncResult,
  StateSyncTrigger,
} from "../contracts/state-sync-runtime";
import type { RuntimeState as LegacyBridgeRuntimeState } from "../contracts/runtime-state";
import { syncAppState } from "./state-sync-app-bridge";
import { hydrateFromSave } from "./state-sync-hydration";
import { rebuildAfterModActivation } from "./state-sync-mod-rebuild";
import { normalizeRuntimeState } from "./state-sync-normalization";
import { preparePresentationInput } from "./state-sync-presentation";
import { prepareSaveState } from "./state-sync-save";
import { validateCanonicalRuntimeState } from "./state-sync-validation";

export type RuntimeStateBridgeInput = {
  gameState: LegacyBridgeRuntimeState["core"];
  beggingMiniGameState: LegacyBridgeRuntimeState["app"]["beggingMiniGameState"];
  autoAdvanceState: LegacyBridgeRuntimeState["app"]["autoAdvanceState"];
  cityDirectoryState: LegacyBridgeRuntimeState["app"]["cityDirectoryState"];
  locationDialogueState: LegacyBridgeRuntimeState["app"]["locationDialogueState"];
  characterDefinitions?: unknown;
};

export type RuntimeResultBridgeInput = {
  state: LegacyBridgeRuntimeState;
  characterDefinitions?: unknown;
};

export function createRuntimeBridgeState(
  state: RuntimeStateBridgeInput
): LegacyBridgeRuntimeState {
  return {
    core: state.gameState,
    app: {
      beggingMiniGameState: state.beggingMiniGameState,
      autoAdvanceState: state.autoAdvanceState,
      cityDirectoryState: state.cityDirectoryState,
      locationDialogueState: state.locationDialogueState,
    },
    view: {},
  };
}

export function applyRuntimeBridgeState<
  TAppState extends RuntimeStateBridgeInput,
>(
  state: TAppState,
  runtimeState: LegacyBridgeRuntimeState,
  characterDefinitions?: unknown
): TAppState {
  return {
    ...state,
    gameState: runtimeState.core,
    beggingMiniGameState: runtimeState.app.beggingMiniGameState,
    autoAdvanceState: runtimeState.app.autoAdvanceState,
    cityDirectoryState: runtimeState.app.cityDirectoryState,
    locationDialogueState: runtimeState.app.locationDialogueState,
    ...(characterDefinitions == null
      ? {}
      : { characterDefinitions }),
  } as TAppState;
}

export function applyRuntimeBridgeResult<
  TAppState extends RuntimeStateBridgeInput,
>(state: TAppState, result: RuntimeResultBridgeInput): TAppState {
  return applyRuntimeBridgeState(
    state,
    result.state,
    result.characterDefinitions
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
  characterDefinitions?: unknown
): TAppState {
  return applyRuntimeBridgeState(state, runtimeState, characterDefinitions);
}

export function applyInteractiveRuntimeResult<
  TAppState extends RuntimeStateBridgeInput,
>(state: TAppState, result: RuntimeResultBridgeInput): TAppState {
  return applyRuntimeBridgeResult(state, result);
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
