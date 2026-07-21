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
import {
  materializeCharacterDefinitions,
  type CharacterStatusById,
} from "../../domain/character-status";
import type { BuildingStatusById } from "../../domain/building-status";
import type { CityStatusById } from "../../domain/city-status";
import type {
  ScenarioPackDefinition,
  ScenarioPackSummary,
} from "../../domain/scenario-pack";
import { resolveScenarioProfileForCharacter } from "../../domain/scenario-profile";
import type { StartupStoryBootstrap } from "./startup-story-bootstrap";

export type StartupSaveData = {
  selectedCharacterId?: string | null;
  selectedModId?: string | null;
  selectedModSource?: ModSourceDescriptor | null;
  modState?: Record<string, unknown>;
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
      selectedCharacter?: CharacterDefinition;
    }
  | {
      type: "scenario-files";
      files: File[];
      selectedCharacter?: CharacterDefinition;
    }
  | {
      type: "scenario-pack";
      scenarioPack: ScenarioPackDefinition;
      source: ModSourceDescriptor;
      selectedCharacter?: CharacterDefinition;
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
  createScenarioPackAppState(
    scenarioPack: ScenarioPackDefinition,
    playerCharacterId?: string
  ): AppState;
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
        return createScenarioSummaryStartupSession(
          request.scenarioPack,
          deps,
          request.selectedCharacter
        );
      case "scenario-files":
        return createScenarioFilesStartupSession(
          request.files,
          deps,
          request.selectedCharacter
        );
      case "scenario-pack":
        return createLoadedScenarioPackStartupSession(
          request.scenarioPack,
          request.source,
          deps,
          request.selectedCharacter
        );
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

  const characterStatusById = readSavedCharacterStatusById(saveData);
  const cityStatusById = readSavedCityStatusById(saveData);
  const buildingStatusById = readSavedBuildingStatusById(saveData);
  const activatedContentSource = readActivatedContentSource(activationResult);
  if (isScenarioPackSource(activatedContentSource)) {
    const playerCharacterId =
      saveData?.selectedCharacterId ??
      activatedContentSource.scenarioProfile.playerCharacterId ??
      selectedCharacter.id;
    const effectiveScenarioPack = {
      ...activatedContentSource,
      scenarioProfile: resolveScenarioProfileForCharacter(
        activatedContentSource.scenarioProfile,
        playerCharacterId
      ),
    };
    return createStartupSessionResult({
      activationResult,
      contentContext: deps.createStartupContentContext(activationResult),
      playerCharacterId,
      createAppState: createStartupAppStateBuilder(
        () =>
          deps.createScenarioPackAppState(
            effectiveScenarioPack,
            playerCharacterId
          ),
        readScenarioStartupStoryBootstrap(effectiveScenarioPack),
        deps,
        createStartupStatusMaps({
          characterStatusById,
          cityStatusById,
          buildingStatusById,
        })
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
      deps,
      createStartupStatusMaps({
        characterStatusById,
        cityStatusById,
        buildingStatusById,
      })
    ),
  });
}

async function createScenarioSummaryStartupSession(
  scenarioPack: ScenarioPackSummary,
  deps: StartupSessionCoordinatorDeps,
  selectedCharacter?: CharacterDefinition
): Promise<StartupSessionResult> {
  const loadedScenarioPack = await loadScenarioPackFromUrl(scenarioPack.url);
  return createLoadedScenarioPackStartupSession(
    loadedScenarioPack,
    {
      kind: "url",
      name: scenarioPack.title,
      url: scenarioPack.url,
    },
    deps,
    selectedCharacter
  );
}

async function createScenarioFilesStartupSession(
  files: File[],
  deps: StartupSessionCoordinatorDeps,
  selectedCharacter?: CharacterDefinition
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
    deps,
    selectedCharacter
  );
}

async function createLoadedScenarioPackStartupSession(
  scenarioPack: ScenarioPackDefinition,
  source: ModSourceDescriptor,
  deps: StartupSessionCoordinatorDeps,
  selectedCharacter?: CharacterDefinition
): Promise<StartupSessionResult> {
  const activationResult = await deps.activateScenarioPackMod(
    scenarioPack,
    source,
    `startup:${source.kind}:${scenarioPack.id}`
  );
  const playerCharacterId =
    selectedCharacter?.id ?? scenarioPack.scenarioProfile.playerCharacterId;
  const effectiveScenarioPack = {
    ...scenarioPack,
    scenarioProfile: resolveScenarioProfileForCharacter(
      scenarioPack.scenarioProfile,
      playerCharacterId
    ),
  };
  return createStartupSessionResult({
    activationResult,
    contentContext: deps.createStartupContentContext(activationResult),
    playerCharacterId,
    createAppState: createStartupAppStateBuilder(
      () => deps.createScenarioPackAppState(effectiveScenarioPack, playerCharacterId),
      readScenarioStartupStoryBootstrap(effectiveScenarioPack),
      deps
    ),
  });
}

function createStartupAppStateBuilder(
  createBaseAppState: () => AppState,
  bootstrap: StartupStoryBootstrap | null,
  deps: StartupSessionCoordinatorDeps,
  statusMaps: {
    characterStatusById?: CharacterStatusById;
    cityStatusById?: CityStatusById;
    buildingStatusById?: BuildingStatusById;
  } = {}
): () => AppState {
  return () => {
    const appState = deps.bootstrapStartupStoryAppState({
      appState: createBaseAppState(),
      bootstrap,
    });

    const { characterStatusById, cityStatusById, buildingStatusById } =
      statusMaps;
    if (characterStatusById == null) {
      return {
        ...appState,
        ...(cityStatusById == null ? {} : { cityStatusById }),
        ...(buildingStatusById == null ? {} : { buildingStatusById }),
      };
    }

    return {
      ...appState,
      characterDefinitions: materializeCharacterDefinitions(
        appState.characterDefinitions,
        characterStatusById
      ),
      characterStatusById,
      ...(cityStatusById == null ? {} : { cityStatusById }),
      ...(buildingStatusById == null ? {} : { buildingStatusById }),
    };
  };
}

function readSavedCharacterStatusById(
  saveData: StartupSaveData
): CharacterStatusById | undefined {
  const value = saveData?.modState?.characterStatusById;
  return value != null && typeof value === "object"
    ? (value as CharacterStatusById)
    : undefined;
}

function readSavedCityStatusById(
  saveData: StartupSaveData
): CityStatusById | undefined {
  const value = saveData?.modState?.cityStatusById;
  return value != null && typeof value === "object"
    ? (value as CityStatusById)
    : undefined;
}

function readSavedBuildingStatusById(
  saveData: StartupSaveData
): BuildingStatusById | undefined {
  const value = saveData?.modState?.buildingStatusById;
  return value != null && typeof value === "object"
    ? (value as BuildingStatusById)
    : undefined;
}

function createStartupStatusMaps(input: {
  characterStatusById?: CharacterStatusById | undefined;
  cityStatusById?: CityStatusById | undefined;
  buildingStatusById?: BuildingStatusById | undefined;
}): {
  characterStatusById?: CharacterStatusById;
  cityStatusById?: CityStatusById;
  buildingStatusById?: BuildingStatusById;
} {
  return {
    ...(input.characterStatusById == null
      ? {}
      : { characterStatusById: input.characterStatusById }),
    ...(input.cityStatusById == null
      ? {}
      : { cityStatusById: input.cityStatusById }),
    ...(input.buildingStatusById == null
      ? {}
      : { buildingStatusById: input.buildingStatusById }),
  };
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
    sceneStatus: "playing",
  };
}

function readScenarioStartupStoryBootstrap(
  scenarioPack: ScenarioPackDefinition
): StartupStoryBootstrap | null {
  if (
    scenarioPack.scenarioProfile.launchPolicy?.entryEventTiming ===
    "after-map-entry"
  ) {
    return null;
  }

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

  const scenarioSource = activationResult.activatedMod.normalizedContentSources.find(
    (source) =>
      source != null &&
      typeof source === "object" &&
      "scenarioProfile" in source
  );

  return scenarioSource == null
    ? null
    : (scenarioSource as ScenarioPackDefinition);
}

function isScenarioPackSource(
  value: ScenarioPackDefinition | null
): value is ScenarioPackDefinition {
  return value != null;
}

function assertNeverRequest(request: never): never {
  throw new Error(`Unsupported startup request: ${String(request)}`);
}
