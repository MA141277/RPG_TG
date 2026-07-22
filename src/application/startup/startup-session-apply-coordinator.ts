import type { StartupSessionBootstrap } from "./startup-session-coordinator";
import type { ModActivationResult } from "../../core/contracts/mod-runtime";

type ActivatedMod = Extract<ModActivationResult, { ok: true }>["activatedMod"];

export type StartupSessionApplyCoordinatorDependencies = {
  configureDefaultPlayableRuntimeRegistriesFromActivatedMod(
    activatedMod: ActivatedMod
  ): void;
  mainRuntimeOrchestrator: {
    execute(request: {
      type: "apply-startup-session";
      session: StartupSessionBootstrap;
    }): void;
  };
  persistSaveData(): void;
  renderApp(): void;
};

export function createStartupSessionApplyCoordinator(
  dependencies: StartupSessionApplyCoordinatorDependencies
) {
  return {
    applyStartupSession(session: StartupSessionBootstrap): void {
      if (session.activationResult.ok) {
        dependencies.configureDefaultPlayableRuntimeRegistriesFromActivatedMod(
          session.activationResult.activatedMod
        );
      }

      dependencies.mainRuntimeOrchestrator.execute({
        type: "apply-startup-session",
        session,
      });
      dependencies.persistSaveData();
      dependencies.renderApp();
    },
  };
}
