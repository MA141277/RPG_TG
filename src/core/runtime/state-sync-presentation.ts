import type {
  AppStateBridge,
  CanonicalRuntimeState,
  PresentationInput,
} from "../contracts/state-sync-runtime";

export function preparePresentationInput(
  runtimeState: CanonicalRuntimeState,
  appState: AppStateBridge
): PresentationInput {
  return {
    runtime: runtimeState,
    app: appState,
  };
}
