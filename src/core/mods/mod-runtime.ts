import type { GameModManifest } from "../contracts/mod-manifest";
import type {
  ActivatedMod,
  LoadedMod,
  ModActivationResult,
  ModRuntimeFailure,
  ModRuntimeRequest,
  ModRuntimeState,
  ModSourceDescriptor,
} from "../contracts/mod-runtime";
import type { ScenarioPackDefinition } from "../../domain/scenario-pack";
import {
  loadModSource,
  type ModSourceLoaderContext,
} from "./mod-source-loader";
import { normalizeModSource } from "./mod-source-registry";
import { validateModCapabilities } from "./mod-capability-guard";
import { validateModDependencies } from "./mod-dependency-resolver";

export type ModRuntimeContext = ModSourceLoaderContext & {
  allowedCapabilities?: readonly string[];
};

export function createEmptyModRuntimeState(): ModRuntimeState {
  return {
    availableModsById: {},
    activeModId: null,
    lastRequestId: null,
  };
}

export function createLoadedModFromManifest(input: {
  source: ModSourceDescriptor;
  manifest: GameModManifest;
  rawContent: unknown;
}): LoadedMod {
  return {
    source: normalizeModSource(input.source),
    manifest: input.manifest,
    rawContent: input.rawContent,
  };
}

export function createLoadedModFromScenarioPack(input: {
  source: ModSourceDescriptor;
  scenarioPack: ScenarioPackDefinition;
}): LoadedMod {
  const profile = input.scenarioPack.scenarioProfile;

  return createLoadedModFromManifest({
    source: input.source,
    manifest: {
      id: input.scenarioPack.id,
      schemaVersion: String(input.scenarioPack.schemaVersion),
      version: "1.0.0",
      title: input.scenarioPack.title,
      entryContentPackIds: [input.scenarioPack.id],
      defaultStart: {
        playerCharacterId: profile.playerCharacterId,
        mapId: profile.initialLocation.mapId,
        cityId: profile.initialLocation.cityId,
        houseId: profile.initialLocation.houseId,
        view: profile.initialLocation.view,
      },
    },
    rawContent: input.scenarioPack,
  });
}

export async function runModRuntime(input: {
  state: ModRuntimeState;
  request: ModRuntimeRequest;
  context?: ModRuntimeContext;
}): Promise<ModActivationResult> {
  const context = input.context ?? {};

  try {
    if (input.request.type === "mod.activate-loaded") {
      return activateLoadedMod({
        state: input.state,
        requestId: input.request.requestId,
        loadedMod: input.request.loadedMod,
        allowedCapabilities: context.allowedCapabilities ?? [],
      });
    }

    if (input.request.type === "mod.load-builtin") {
      const loadedMod = await loadModSource(
        { kind: "builtin", modId: input.request.modId },
        context
      );
      return activateLoadedMod({
        state: input.state,
        requestId: input.request.requestId,
        loadedMod,
        allowedCapabilities: context.allowedCapabilities ?? [],
      });
    }

    if (input.request.type === "mod.load-file") {
      const loadedMod = await loadModSource(
        {
          kind: "file",
          name: input.request.name,
          filePath: input.request.filePath,
        },
        context
      );
      return activateLoadedMod({
        state: input.state,
        requestId: input.request.requestId,
        loadedMod,
        allowedCapabilities: context.allowedCapabilities ?? [],
      });
    }

    if (input.request.type === "mod.load-url") {
      const loadedMod = await loadModSource(
        { kind: "url", name: input.request.name, url: input.request.url },
        context
      );
      return activateLoadedMod({
        state: input.state,
        requestId: input.request.requestId,
        loadedMod,
        allowedCapabilities: context.allowedCapabilities ?? [],
      });
    }

    if (
      input.request.type === "mod.activate" ||
      input.request.type === "mod.select"
    ) {
      const loadedMod = input.state.availableModsById[input.request.modId];
      if (loadedMod == null) {
        return failActivation({
          state: input.state,
          requestId: input.request.requestId,
          code: "mod-not-found",
          message: `Unknown mod: ${input.request.modId}`,
          modId: input.request.modId,
        });
      }

      return activateLoadedMod({
        state: input.state,
        requestId: input.request.requestId,
        loadedMod,
        allowedCapabilities: context.allowedCapabilities ?? [],
      });
    }

    if (input.request.type === "mod.discover") {
      const activeMod = readActiveLoadedMod(input.state);
      if (activeMod == null) {
        return failActivation({
          state: input.state,
          requestId: input.request.requestId,
          code: "mod-not-found",
          message: "No active mod is available after discovery.",
        });
      }

      return {
        ok: true,
        state: { ...input.state, lastRequestId: input.request.requestId },
        activatedMod: createActivatedMod(activeMod),
      };
    }

    if (input.request.type === "mod.deactivate") {
      return failActivation({
        state: {
          ...input.state,
          activeModId: null,
          lastRequestId: input.request.requestId,
        },
        requestId: input.request.requestId,
        code: "activation-failed",
        message: `Mod deactivation is not a bootable activation result for "${input.request.modId}".`,
        modId: input.request.modId,
      });
    }

    const loadedMod = input.state.availableModsById[input.request.modId];
    if (loadedMod == null) {
      return failActivation({
        state: input.state,
        requestId: input.request.requestId,
        code: "mod-not-found",
        message: `Cannot reload unknown mod: ${input.request.modId}`,
        modId: input.request.modId,
      });
    }

    return activateLoadedMod({
      state: input.state,
      requestId: input.request.requestId,
      loadedMod,
      allowedCapabilities: context.allowedCapabilities ?? [],
    });
  } catch (error) {
    return failActivation({
      state: input.state,
      requestId: input.request.requestId,
      code: "parse-failed",
      message:
        error instanceof Error
          ? error.message
          : "Mod source could not be parsed.",
    });
  }
}

function activateLoadedMod(input: {
  state: ModRuntimeState;
  requestId: string;
  loadedMod: LoadedMod;
  allowedCapabilities: readonly string[];
}): ModActivationResult {
  const previousActiveModId = input.state.activeModId;
  const nextAvailableModsById = {
    ...input.state.availableModsById,
    [input.loadedMod.manifest.id]: input.loadedMod,
  };

  const dependencyFailure = validateModDependencies({
    loadedMod: input.loadedMod,
    availableModsById: nextAvailableModsById,
    requestId: input.requestId,
  });
  if (dependencyFailure != null) {
    return rollbackActivation(input.state, input.requestId, dependencyFailure);
  }

  const capabilityFailure = validateModCapabilities({
    loadedMod: input.loadedMod,
    allowedCapabilities: input.allowedCapabilities,
    requestId: input.requestId,
  });
  if (capabilityFailure != null) {
    return rollbackActivation(input.state, input.requestId, capabilityFailure);
  }

  try {
    return {
      ok: true,
      state: {
        availableModsById: nextAvailableModsById,
        activeModId: input.loadedMod.manifest.id,
        lastRequestId: input.requestId,
      },
      activatedMod: createActivatedMod(input.loadedMod),
    };
  } catch (error) {
    return rollbackActivation(input.state, input.requestId, {
      code: "activation-failed",
      message:
        error instanceof Error ? error.message : "Mod activation failed.",
      modId: previousActiveModId ?? input.loadedMod.manifest.id,
      requestId: input.requestId,
    });
  }
}

function rollbackActivation(
  state: ModRuntimeState,
  requestId: string,
  failure: ModRuntimeFailure
): ModActivationResult {
  const previousActiveModId = state.activeModId;

  return {
    ok: false,
    state: {
      ...state,
      activeModId: previousActiveModId,
      lastRequestId: requestId,
    },
    failure,
  };
}

function failActivation(input: {
  state: ModRuntimeState;
  requestId: string;
  code: ModRuntimeFailure["code"];
  message: string;
  modId?: string;
}): ModActivationResult {
  return {
    ok: false,
    state: { ...input.state, lastRequestId: input.requestId },
    failure: {
      code: input.code,
      message: input.message,
      requestId: input.requestId,
      ...(input.modId == null ? {} : { modId: input.modId }),
    },
  };
}

function readActiveLoadedMod(state: ModRuntimeState): LoadedMod | null {
  if (state.activeModId == null) {
    return null;
  }

  return state.availableModsById[state.activeModId] ?? null;
}

function createActivatedMod(loadedMod: LoadedMod): ActivatedMod {
  return {
    modId: loadedMod.manifest.id,
    manifest: loadedMod.manifest,
    normalizedContentSources: [loadedMod.rawContent],
    registeredDefinitionIds: loadedMod.manifest.entryContentPackIds,
    startupProfile: {
      ...(loadedMod.manifest.defaultStart?.playerCharacterId == null
        ? {}
        : {
            playerCharacterId:
              loadedMod.manifest.defaultStart.playerCharacterId,
          }),
      ...(loadedMod.manifest.defaultStart?.mapId == null
        ? {}
        : { mapId: loadedMod.manifest.defaultStart.mapId }),
      ...(loadedMod.manifest.defaultStart?.cityId == null
        ? {}
        : { cityId: loadedMod.manifest.defaultStart.cityId }),
      ...(loadedMod.manifest.defaultStart?.houseId == null
        ? {}
        : { houseId: loadedMod.manifest.defaultStart.houseId }),
      ...(loadedMod.manifest.defaultStart?.view == null
        ? {}
        : { view: loadedMod.manifest.defaultStart.view }),
    },
  };
}
