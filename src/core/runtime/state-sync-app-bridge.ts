import type {
  AppStateBridge,
  CanonicalRuntimeState,
} from "../contracts/state-sync-runtime";

export function syncAppState(
  runtimeState: CanonicalRuntimeState,
  appState: AppStateBridge | undefined
): AppStateBridge {
  return {
    ui: appState?.ui ?? {},
    session: appState?.session ?? {},
    view: {
      ...(appState?.view ?? {}),
      currentView: runtimeState.core.ui.currentView,
    },
  };
}
