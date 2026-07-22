import {
  createActiveGameContentContextFromModActivation,
  type ActiveGameContentContext,
} from "../content/active-game-content";
import { loadDefaultRuntimeContent } from "../content/default-runtime-content";
import { createBaseGameContentPack } from "../../content/base-game-content-pack";
import { builtInScenarioPacks } from "../../content/scenario-packs/scenario-pack-catalog";
import type { GameModManifest } from "../../core/contracts/mod-manifest";
import type {
  LoadedMod,
  ModActivationResult,
  ModRuntimeState,
  ModSourceDescriptor,
} from "../../core/contracts/mod-runtime";
import {
  createEmptyModRuntimeState,
  createLoadedModFromScenarioPack,
  runModRuntime,
} from "../../core/mods/mod-runtime";
import type { BuiltinModSourceRecord } from "../../core/mods/mod-source-loader";
import type {
  ScenarioPackDefinition,
  ScenarioPackSummary,
} from "../../domain/scenario-pack";

export type EntryShellBootstrapState = {
  baseGameContentPack: Awaited<ReturnType<typeof createBaseGameContentPack>>;
  builtinDefaultModId: string;
  builtinDefaultModManifest: GameModManifest;
  scenarioPacks: ScenarioPackSummary[];
  builtinStartupActivation: ModActivationResult;
  createStartupContentContext(
    activationResult: ModActivationResult
  ): ActiveGameContentContext;
  activateBuiltinDefaultMod(requestId: string): Promise<ModActivationResult>;
  activateScenarioPackMod(
    scenarioPack: ScenarioPackDefinition,
    source: ModSourceDescriptor,
    requestId: string
  ): Promise<ModActivationResult>;
  activateSavedMod(
    selectedModId: string,
    requestId: string
  ): Promise<ModActivationResult>;
  activateSavedModSource(
    source: ModSourceDescriptor,
    requestId: string
  ): Promise<ModActivationResult>;
  getModRuntimeState(): ModRuntimeState;
};

export async function createEntryShellBootstrapState(): Promise<EntryShellBootstrapState> {
  const builtinDefaultModId = "builtin.default";
  const baseGameContentPack = await createBaseGameContentPack();
  const builtinDefaultModManifest: GameModManifest = {
    id: builtinDefaultModId,
    schemaVersion: "1",
    version: "1.0.0",
    title: "Default Builtin Mod",
    entryContentPackIds: [baseGameContentPack.id],
  };
  const builtinModSourceRecordsById: Record<string, BuiltinModSourceRecord> = {
    [builtinDefaultModId]: {
      manifest: builtinDefaultModManifest,
      rawContent: baseGameContentPack,
    },
  };

  await loadDefaultRuntimeContent(() => Promise.resolve(baseGameContentPack));

  let modRuntimeState: ModRuntimeState = createEmptyModRuntimeState();

  function createModRuntimeContext() {
    return {
      allowedCapabilities: [] as const,
      builtinModsById: builtinModSourceRecordsById,
    };
  }

  async function activateLoadedModForStartup(
    loadedMod: LoadedMod,
    requestId: string
  ): Promise<ModActivationResult> {
    const result = await runModRuntime({
      state: modRuntimeState,
      request: {
        type: "mod.activate-loaded",
        requestId,
        loadedMod,
      },
      context: createModRuntimeContext(),
    });
    modRuntimeState = result.state;
    return result;
  }

  async function activateBuiltinDefaultMod(
    requestId: string
  ): Promise<ModActivationResult> {
    const result = await runModRuntime({
      state: modRuntimeState,
      request: {
        type: "mod.load-builtin",
        requestId,
        modId: builtinDefaultModId,
      },
      context: createModRuntimeContext(),
    });
    modRuntimeState = result.state;
    return result;
  }

  async function activateScenarioPackMod(
    scenarioPack: ScenarioPackDefinition,
    source: ModSourceDescriptor,
    requestId: string
  ): Promise<ModActivationResult> {
    return activateLoadedModForStartup(
      createLoadedModFromScenarioPack({
        source,
        scenarioPack,
        baseContentPack: baseGameContentPack,
      }),
      requestId
    );
  }

  async function activateSavedMod(
    selectedModId: string,
    requestId: string
  ): Promise<ModActivationResult> {
    const result = await runModRuntime({
      state: modRuntimeState,
      request: {
        type: "mod.activate",
        requestId,
        modId: selectedModId,
      },
      context: createModRuntimeContext(),
    });
    modRuntimeState = result.state;
    return result;
  }

  async function activateSavedModSource(
    source: ModSourceDescriptor,
    requestId: string
  ): Promise<ModActivationResult> {
    const request =
      source.kind === "builtin"
        ? {
            type: "mod.load-builtin" as const,
            requestId,
            modId: source.modId,
          }
        : source.kind === "file"
          ? {
              type: "mod.load-file" as const,
              requestId,
              name: source.name,
              filePath: source.filePath,
            }
          : {
              type: "mod.load-url" as const,
              requestId,
              name: source.name,
              url: source.url,
            };
    const result = await runModRuntime({
      state: modRuntimeState,
      request,
      context: createModRuntimeContext(),
    });
    modRuntimeState = result.state;
    return result;
  }

  const builtinStartupActivation = await activateBuiltinDefaultMod(
    "startup:builtin.default"
  );

  return {
    baseGameContentPack,
    builtinDefaultModId,
    builtinDefaultModManifest,
    scenarioPacks: [...builtInScenarioPacks],
    builtinStartupActivation,
    createStartupContentContext: (activationResult) =>
      createActiveGameContentContextFromModActivation({
        activationResult,
      }),
    activateBuiltinDefaultMod,
    activateScenarioPackMod,
    activateSavedMod,
    activateSavedModSource,
    getModRuntimeState: () => modRuntimeState,
  };
}
