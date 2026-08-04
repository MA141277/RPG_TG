import type {
  ScenarioPackDefinition,
  ScenarioPackSummary,
} from "../../domain/scenario-pack";
import type { CharacterDefinition } from "../../domain/character";
import type { ModSourceDescriptor } from "../../core/contracts/mod-runtime";
import type {
  StartupSaveData,
  StartupScenario,
  StartupSessionBootstrap,
  StartupSessionRequest,
} from "./startup-session-coordinator";

export type StartupLoadingLauncher = {
  startContinueGameWithLoading(selectedCharacter: CharacterDefinition): void;
  startRestoredGameWithLoading(
    selectedCharacter: CharacterDefinition,
    saveData: StartupSaveData
  ): Promise<void>;
  startMainGameWithLoading(
    selectedCharacter: CharacterDefinition,
    startupScenario?: StartupScenario
  ): void;
  startScenarioPackWithLoading(
    scenarioPack: ScenarioPackSummary
  ): Promise<void>;
  startScenarioPackFilesWithLoading(files: File[]): Promise<void>;
  startLoadedScenarioPackWithLoading(
    scenarioPack: ScenarioPackDefinition
  ): Promise<"started" | "failed">;
};

export function createStartupLoadingLauncher(input: {
  runStartupSession(
    request: StartupSessionRequest
  ): Promise<StartupSessionBootstrap>;
  loadSaveData(): StartupSaveData;
  beginLoadingScreen(): number;
  isLoadingRequestActive(requestId: number): boolean;
  setLoadingProgress(progress: number): void;
  simulateLoadingProgress(
    onProgress: (progress: number) => void
  ): Promise<void>;
  startupLoadingSimulatedProgressCap: number;
  preloadInitialMapViewAssets(requestId: number): Promise<void>;
  endLoadingScreen(requestId: number): void;
  applyActivatedModSession(session: StartupSessionBootstrap): void;
  showStartupError(error: unknown): void;
  showScenarioPackReadError(input: {
    error: unknown;
    importLabel?: string;
  }): void;
  createRuntimePreviewScenarioPackSource(
    scenarioPack: ScenarioPackDefinition
  ): ModSourceDescriptor;
  sanitizeScenarioPackForRuntimePreview(
    scenarioPack: ScenarioPackDefinition
  ): ScenarioPackDefinition;
}): StartupLoadingLauncher {
  function startContinueGameWithLoading(
    selectedCharacter: CharacterDefinition
  ): void {
    const saveData = input.loadSaveData();
    const requestId = input.beginLoadingScreen();

    input
      .simulateLoadingProgress((progress) => {
        if (!input.isLoadingRequestActive(requestId)) {
          return;
        }

        input.setLoadingProgress(
          progress * input.startupLoadingSimulatedProgressCap
        );
      })
      .then(async () => {
        if (!input.isLoadingRequestActive(requestId)) {
          return;
        }

        const startupSession = await input.runStartupSession({
          type: "continue",
          selectedCharacter,
          saveData,
        });
        input.applyActivatedModSession(startupSession);
        await input.preloadInitialMapViewAssets(requestId);
        input.endLoadingScreen(requestId);
      })
      .catch((error: unknown) => {
        input.endLoadingScreen(requestId);
        input.showStartupError(error);
      });
  }

  function startRestoredGameWithLoading(
    selectedCharacter: CharacterDefinition,
    saveData: StartupSaveData
  ): Promise<void> {
    const requestId = input.beginLoadingScreen();

    return input
      .simulateLoadingProgress((progress) => {
        if (!input.isLoadingRequestActive(requestId)) {
          return;
        }

        input.setLoadingProgress(
          progress * input.startupLoadingSimulatedProgressCap
        );
      })
      .then(async () => {
        if (!input.isLoadingRequestActive(requestId)) {
          return;
        }

        const startupSession = await input.runStartupSession({
          type: "restore",
          selectedCharacter,
          saveData,
        });
        input.applyActivatedModSession(startupSession);
        await input.preloadInitialMapViewAssets(requestId);
        input.endLoadingScreen(requestId);
      })
      .catch((error: unknown) => {
        input.endLoadingScreen(requestId);
        input.showStartupError(error);
      });
  }

  function startMainGameWithLoading(
    selectedCharacter: CharacterDefinition,
    startupScenario: StartupScenario = "default"
  ): void {
    const requestId = input.beginLoadingScreen();

    input
      .simulateLoadingProgress((progress) => {
        if (!input.isLoadingRequestActive(requestId)) {
          return;
        }

        input.setLoadingProgress(
          progress * input.startupLoadingSimulatedProgressCap
        );
      })
      .then(async () => {
        if (!input.isLoadingRequestActive(requestId)) {
          return "failed";
        }

        const startupSession = await input.runStartupSession({
          type: "builtin",
          selectedCharacter,
          startupScenario,
        });
        input.applyActivatedModSession(startupSession);
        await input.preloadInitialMapViewAssets(requestId);
        input.endLoadingScreen(requestId);
        return "started";
      })
      .catch((error: unknown) => {
        input.endLoadingScreen(requestId);
        input.showStartupError(error);
      });
  }

  function runScenarioPackStartupRequestWithLoading(
    request:
      | { type: "scenario-summary"; scenarioPack: ScenarioPackSummary }
      | { type: "scenario-files"; files: File[] }
      | {
          type: "loaded-scenario-pack";
          scenarioPack: ScenarioPackDefinition;
          source: ModSourceDescriptor;
        }
  ): Promise<"started" | "failed"> {
    const requestId = input.beginLoadingScreen();

    return input
      .simulateLoadingProgress((progress) => {
        if (!input.isLoadingRequestActive(requestId)) {
          return;
        }

        input.setLoadingProgress(
          progress * input.startupLoadingSimulatedProgressCap
        );
      })
      .then(async () => {
        if (!input.isLoadingRequestActive(requestId)) {
          return "failed";
        }

        const startupSession = await input.runStartupSession(request);
        input.applyActivatedModSession(startupSession);
        await input.preloadInitialMapViewAssets(requestId);
        input.endLoadingScreen(requestId);
        return "started";
      })
      .catch((error) => {
        input.endLoadingScreen(requestId);
        input.showScenarioPackReadError({
          error,
        });
        return "failed";
      });
  }

  async function startScenarioPackWithLoading(
    scenarioPack: ScenarioPackSummary
  ): Promise<void> {
    try {
      await runScenarioPackStartupRequestWithLoading({
        type: "scenario-summary",
        scenarioPack,
      });
    } catch (error) {
      input.showScenarioPackReadError({ error });
    }
  }

  async function startScenarioPackFilesWithLoading(files: File[]): Promise<void> {
    const importLabel =
      files.find((file) => file.name === "pack.json")?.name ??
      files[0]?.name ??
      "scenario-pack";

    try {
      await runScenarioPackStartupRequestWithLoading({
        type: "scenario-files",
        files,
      });
    } catch (error) {
      input.showScenarioPackReadError({
        error,
        importLabel,
      });
    }
  }

  async function startLoadedScenarioPackWithLoading(
    scenarioPack: ScenarioPackDefinition
  ): Promise<"started" | "failed"> {
    return runScenarioPackStartupRequestWithLoading({
      type: "loaded-scenario-pack",
      scenarioPack: input.sanitizeScenarioPackForRuntimePreview(scenarioPack),
      source: input.createRuntimePreviewScenarioPackSource(scenarioPack),
    });
  }

  return {
    startContinueGameWithLoading,
    startRestoredGameWithLoading,
    startMainGameWithLoading,
    startScenarioPackWithLoading,
    startScenarioPackFilesWithLoading,
    startLoadedScenarioPackWithLoading,
  };
}
