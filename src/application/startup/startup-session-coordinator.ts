import type { AppState } from "../app-shell";
import type { ActiveGameContentContext } from "../content/active-game-content";
import {
  loadScenarioPackFromFiles,
  loadScenarioPackFromUrl,
} from "../scenario/scenario-pack-loader";
import type {
  ModActivationResult,
  ModSourceDescriptor,
} from "../../core/contracts/mod-runtime";
import type { CharacterDefinition } from "../../domain/character";
import type {
  ScenarioPackDefinition,
  ScenarioPackSummary,
} from "../../domain/scenario-pack";
import type { StartupStoryBootstrap } from "./startup-story-bootstrap";

export type StartupSaveData = {
  selectedCharacterId?: string | null;
  selectedModId?: string | null;
  selectedModSource?: ModSourceDescriptor | null;
} | null;

export type StartupScenario = "default" | "haozhou-return-encounter";

export type StartupSessionRequest =
  | {
      type: "builtin";
      selectedCharacter: CharacterDefinition;
      startupScenario?: StartupScenario;
    }
  | {
      type: "continue";
      selectedCharacter: CharacterDefinition;
      saveData: StartupSaveData;
    }
  | {
      type: "restore";
      selectedCharacter: CharacterDefinition;
      saveData: StartupSaveData;
    }
  | {
      type: "scenario-summary";
      scenarioPack: ScenarioPackSummary;
    }
  | {
      type: "scenario-files";
      files: File[];
    };

export type StartupSessionBootstrap = {
  activationResult: ModActivationResult;
  contentContext: ActiveGameContentContext;
  playerCharacterId: string;
  createAppState(): AppState;
};

export type StartupSessionResult =
  | {
      ok: true;
      session: StartupSessionBootstrap;
    }
  | {
      ok: false;
      error: Error;
    };

export type StartupSessionCoordinatorDeps = {
  activateBuiltinDefaultMod(requestId: string): Promise<ModActivationResult>;
  restoreModFromSave(
    saveData: StartupSaveData
  ): Promise<ModActivationResult | null>;
  activateScenarioPackMod(
    scenarioPack: ScenarioPackDefinition,
    source: ModSourceDescriptor,
    requestId: string
  ): Promise<ModActivationResult>;
  createPrototypeAppState(playerCharacterId: string): AppState;
  createHaozhouReturnEncounterAppState(appState: AppState): AppState;
  createScenarioPackAppState(scenarioPack: ScenarioPackDefinition): AppState;
  createStartupContentContext(
    activationResult: ModActivationResult
  ): ActiveGameContentContext;
  bootstrapStartupStoryAppState(input: {
    appState: AppState;
    bootstrap: StartupStoryBootstrap | null;
  }): AppState;
};

export async function runStartupSessionCoordinator(
  request: StartupSessionRequest,
  deps: StartupSessionCoordinatorDeps
): Promise<StartupSessionResult> {
  try {
    switch (request.type) {
      case "builtin":
        return createBuiltinStartupSession(
          request.selectedCharacter,
          request.startupScenario ?? "default",
          deps
        );
      case "continue":
        if (request.saveData?.selectedModId == null) {
          return createBuiltinStartupSession(
            request.selectedCharacter,
            "haozhou-return-encounter",
            deps
          );
        }

        return createRestoreStartupSession(
          request.selectedCharacter,
          request.saveData,
          deps
        );
      case "restore":
        return createRestoreStartupSession(
          request.selectedCharacter,
          request.saveData,
          deps
        );
      case "scenario-summary":
        return createScenarioSummaryStartupSession(request.scenarioPack, deps);
      case "scenario-files":
        return createScenarioFilesStartupSession(request.files, deps);
      default:
        return assertNeverRequest(request);
    }
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error : new Error("Startup session failed."),
    };
  }
}

async function createBuiltinStartupSession(
  selectedCharacter: CharacterDefinition,
  startupScenario: StartupScenario,
  deps: StartupSessionCoordinatorDeps
): Promise<StartupSessionResult> {
  const activationResult = await deps.activateBuiltinDefaultMod(
    `startup:builtin:${startupScenario}`
  );
  return createStartupSessionResult({
    activationResult,
    contentContext: deps.createStartupContentContext(activationResult),
    playerCharacterId: selectedCharacter.id,
    createAppState: createStartupAppStateBuilder(
      () =>
        startupScenario === "haozhou-return-encounter"
          ? deps.createHaozhouReturnEncounterAppState(
              deps.createPrototypeAppState(selectedCharacter.id)
            )
          : deps.createPrototypeAppState(selectedCharacter.id),
      readBuiltinStartupStoryBootstrap(startupScenario),
      deps
    ),
  });
}

async function createRestoreStartupSession(
  selectedCharacter: CharacterDefinition,
  saveData: StartupSaveData,
  deps: StartupSessionCoordinatorDeps
): Promise<StartupSessionResult> {
  const activationResult = await deps.restoreModFromSave(saveData);
  if (activationResult == null) {
    return createBuiltinStartupSession(
      selectedCharacter,
      "haozhou-return-encounter",
      deps
    );
  }

  const activatedContentSource = readActivatedContentSource(activationResult);
  if (isScenarioPackSource(activatedContentSource)) {
    return createStartupSessionResult({
      activationResult,
      contentContext: deps.createStartupContentContext(activationResult),
      playerCharacterId:
        saveData?.selectedCharacterId ??
        activatedContentSource.scenarioProfile.playerCharacterId ??
        selectedCharacter.id,
      createAppState: createStartupAppStateBuilder(
        () => deps.createScenarioPackAppState(activatedContentSource),
        readScenarioStartupStoryBootstrap(activatedContentSource),
        deps
      ),
    });
  }

  const playerCharacterId =
    saveData?.selectedCharacterId ?? selectedCharacter.id;
  return createStartupSessionResult({
    activationResult,
    contentContext: deps.createStartupContentContext(activationResult),
    playerCharacterId,
    createAppState: createStartupAppStateBuilder(
      () =>
        deps.createHaozhouReturnEncounterAppState(
          deps.createPrototypeAppState(playerCharacterId)
        ),
      readBuiltinStartupStoryBootstrap("haozhou-return-encounter"),
      deps
    ),
  });
}

async function createScenarioSummaryStartupSession(
  scenarioPack: ScenarioPackSummary,
  deps: StartupSessionCoordinatorDeps
): Promise<StartupSessionResult> {
  const loadedScenarioPack = await loadScenarioPackFromUrl(scenarioPack.url);
  return createLoadedScenarioPackStartupSession(
    loadedScenarioPack,
    {
      kind: "url",
      name: scenarioPack.title,
      url: scenarioPack.url,
    },
    deps
  );
}

async function createScenarioFilesStartupSession(
  files: File[],
  deps: StartupSessionCoordinatorDeps
): Promise<StartupSessionResult> {
  const importLabel =
    files.find((file) => file.name === "pack.json")?.name ??
    files[0]?.name ??
    "scenario-pack";
  const loadedScenarioPack = await loadScenarioPackFromFiles(files);
  return createLoadedScenarioPackStartupSession(
    loadedScenarioPack,
    {
      kind: "file",
      name: importLabel,
      filePath: importLabel,
    },
    deps
  );
}

async function createLoadedScenarioPackStartupSession(
  scenarioPack: ScenarioPackDefinition,
  source: ModSourceDescriptor,
  deps: StartupSessionCoordinatorDeps
): Promise<StartupSessionResult> {
  const activationResult = await deps.activateScenarioPackMod(
    scenarioPack,
    source,
    `startup:${source.kind}:${scenarioPack.id}`
  );
  return createStartupSessionResult({
    activationResult,
    contentContext: deps.createStartupContentContext(activationResult),
    playerCharacterId: scenarioPack.scenarioProfile.playerCharacterId,
    createAppState: createStartupAppStateBuilder(
      () => deps.createScenarioPackAppState(scenarioPack),
      readScenarioStartupStoryBootstrap(scenarioPack),
      deps
    ),
  });
}

function createStartupAppStateBuilder(
  createBaseAppState: () => AppState,
  bootstrap: StartupStoryBootstrap | null,
  deps: StartupSessionCoordinatorDeps
): () => AppState {
  return () =>
    deps.bootstrapStartupStoryAppState({
      appState: createBaseAppState(),
      bootstrap,
    });
}

function readBuiltinStartupStoryBootstrap(
  startupScenario: StartupScenario
): StartupStoryBootstrap | null {
  if (startupScenario !== "haozhou-return-encounter") {
    return null;
  }

  return {
    eventId: "event.story.zhu_yuanzhang.haozhou_return_encounter",
    sceneCursor: 4,
  };
}

function readScenarioStartupStoryBootstrap(
  scenarioPack: ScenarioPackDefinition
): StartupStoryBootstrap | null {
  const entryEventId = scenarioPack.scenarioProfile.entryEventId;
  return entryEventId == null
    ? null
    : {
        eventId: entryEventId,
      };
}

function createStartupSessionResult(
  session: StartupSessionBootstrap
): StartupSessionResult {
  if (!session.activationResult.ok) {
    return {
      ok: false,
      error: new Error(session.activationResult.failure.message),
    };
  }

  return {
    ok: true,
    session,
  };
}

function readActivatedContentSource(
  activationResult: ModActivationResult
): ScenarioPackDefinition | null {
  if (!activationResult.ok) {
    return null;
  }

  const primarySource = activationResult.activatedMod.normalizedContentSources[0];
  if (primarySource == null || typeof primarySource !== "object") {
    return null;
  }

  return "scenarioProfile" in primarySource
    ? (primarySource as ScenarioPackDefinition)
    : null;
}

function isScenarioPackSource(
  value: ScenarioPackDefinition | null
): value is ScenarioPackDefinition {
  return value != null;
}

function assertNeverRequest(request: never): never {
  throw new Error(`Unsupported startup request: ${String(request)}`);
}
