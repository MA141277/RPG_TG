import type { CharacterDefinition } from "../../domain/character";
import type { ScenarioPackSummary } from "../../domain/scenario-pack";
import type {
  StartupSaveData,
  StartupScenario,
  StartupSessionBootstrap,
  StartupSessionRequest,
  StartupSessionResult,
} from "./startup-session-coordinator";

export type ShellBootLifecycleCoordinatorDependencies = {
  beginLoadingScreen(): number;
  isLoadingRequestActive(requestId: number): boolean;
  simulateLoadingProgress(
    onProgress: (progress: number) => void
  ): Promise<void>;
  setActiveLoadingProgress(progress: number): void;
  runStartupSession(
    request: StartupSessionRequest
  ): Promise<StartupSessionResult>;
  unwrapStartupSession(result: StartupSessionResult): StartupSessionBootstrap;
  startupSessionApplyCoordinator: {
    applyStartupSession(session: StartupSessionBootstrap): void;
  };
  endLoadingScreen(requestId: number): void;
  showStartupError(error: unknown): void;
};

export function createShellBootLifecycleCoordinator(
  dependencies: ShellBootLifecycleCoordinatorDependencies
) {
  function runBootRequest(input: {
    request: StartupSessionRequest;
    handleError?: (error: unknown) => void;
  }): Promise<void> {
    const requestId = dependencies.beginLoadingScreen();

    return dependencies
      .simulateLoadingProgress((progress) => {
        if (!dependencies.isLoadingRequestActive(requestId)) {
          return;
        }

        dependencies.setActiveLoadingProgress(progress);
      })
      .then(async () => {
        if (!dependencies.isLoadingRequestActive(requestId)) {
          return;
        }

        const startupSession = dependencies.unwrapStartupSession(
          await dependencies.runStartupSession(input.request)
        );
        dependencies.startupSessionApplyCoordinator.applyStartupSession(
          startupSession
        );
        dependencies.endLoadingScreen(requestId);
      })
      .catch((error: unknown) => {
        dependencies.endLoadingScreen(requestId);
        (input.handleError ?? dependencies.showStartupError)(error);
      });
  }

  return {
    startContinue(input: {
      selectedCharacter: CharacterDefinition;
      saveData: StartupSaveData;
    }): Promise<void> {
      return runBootRequest({
        request: {
          type: "continue",
          selectedCharacter: input.selectedCharacter,
          saveData: input.saveData,
        },
      });
    },

    startRestore(input: {
      selectedCharacter: CharacterDefinition;
      saveData: StartupSaveData;
    }): Promise<void> {
      return runBootRequest({
        request: {
          type: "restore",
          selectedCharacter: input.selectedCharacter,
          saveData: input.saveData,
        },
      });
    },

    startBuiltin(input: {
      selectedCharacter: CharacterDefinition;
      startupScenario?: StartupScenario;
    }): Promise<void> {
      return runBootRequest({
        request: {
          type: "builtin",
          selectedCharacter: input.selectedCharacter,
          ...(input.startupScenario === undefined
            ? {}
            : { startupScenario: input.startupScenario }),
        },
      });
    },

    startScenarioPackRequest(input: {
      request:
        | { type: "scenario-summary"; scenarioPack: ScenarioPackSummary }
        | { type: "scenario-files"; files: File[] };
      handleError?: (error: unknown) => void;
    }): Promise<void> {
      return runBootRequest({
        request: input.request,
        ...(input.handleError === undefined
          ? {}
          : { handleError: input.handleError }),
      });
    },
  };
}
