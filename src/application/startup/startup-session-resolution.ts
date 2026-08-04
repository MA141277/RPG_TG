import type { AppState } from "../app-shell";
import type { ActiveGameContentContext } from "../content/active-game-content";
import type {
  ModActivationResult,
  ModSourceDescriptor,
} from "../../core/contracts/mod-runtime";
import { resolveScenarioProfileForCharacter } from "../../domain/scenario-profile";
import type { ScenarioPackDefinition } from "../../domain/scenario-pack";
import type { StartupStoryBootstrap } from "./startup-story-bootstrap";

export type StartupScenario = "default" | "haozhou-return-encounter";

export type ResolvedStartupSessionBootstrap = {
  activationResult: ModActivationResult;
  contentContext: ActiveGameContentContext;
  playerCharacterId: string;
  createAppState(): AppState;
};

export type ResolvedStartupSessionResult =
  | {
      ok: true;
      session: ResolvedStartupSessionBootstrap;
    }
  | {
      ok: false;
      error: Error;
    };

export type StartupSessionResolutionDeps = {
  createScenarioPackAppState(scenarioPack: ScenarioPackDefinition): AppState;
  createStartupContentContext(
    activationResult: ModActivationResult
  ): ActiveGameContentContext;
  bootstrapStartupStoryAppState(input: {
    appState: AppState;
    bootstrap: StartupStoryBootstrap | null;
  }): AppState;
};

export function createResolvedStartupSession(input: {
  activationResult: ModActivationResult;
  playerCharacterId: string;
  createBaseAppState(): AppState;
  bootstrap: StartupStoryBootstrap | null;
  deps: StartupSessionResolutionDeps;
}): ResolvedStartupSessionResult {
  if (!input.activationResult.ok) {
    return {
      ok: false,
      error: new Error(input.activationResult.failure.message),
    };
  }

  return {
    ok: true,
    session: {
      activationResult: input.activationResult,
      contentContext: input.deps.createStartupContentContext(
        input.activationResult
      ),
      playerCharacterId: input.playerCharacterId,
      createAppState: createStartupAppStateBuilder(
        input.createBaseAppState,
        input.bootstrap,
        input.deps
      ),
    },
  };
}

export function createResolvedScenarioPackStartupSession(input: {
  activationResult: ModActivationResult;
  scenarioPack: ScenarioPackDefinition;
  selectedCharacterId: string | null | undefined;
  deps: StartupSessionResolutionDeps;
}): ResolvedStartupSessionResult {
  const resolvedScenarioPack = resolveStartupScenarioPack(
    input.scenarioPack,
    input.selectedCharacterId
  );

  return createResolvedStartupSession({
    activationResult: input.activationResult,
    playerCharacterId: resolvedScenarioPack.scenarioProfile.playerCharacterId,
    createBaseAppState: () =>
      input.deps.createScenarioPackAppState(resolvedScenarioPack),
    bootstrap: readScenarioStartupStoryBootstrap(resolvedScenarioPack),
    deps: input.deps,
  });
}

export function readBuiltinStartupStoryBootstrap(
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

export function readActivatedContentSource(
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

export function createScenarioPackStartupRequestId(
  source: ModSourceDescriptor,
  scenarioPack: ScenarioPackDefinition
): string {
  return `startup:${source.kind}:${scenarioPack.id}`;
}

function createStartupAppStateBuilder(
  createBaseAppState: () => AppState,
  bootstrap: StartupStoryBootstrap | null,
  deps: StartupSessionResolutionDeps
): () => AppState {
  return () =>
    deps.bootstrapStartupStoryAppState({
      appState: createBaseAppState(),
      bootstrap,
    });
}

export function readScenarioStartupStoryBootstrap(
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

function resolveStartupScenarioPack(
  scenarioPack: ScenarioPackDefinition,
  selectedCharacterId?: string | null
): ScenarioPackDefinition {
  if (selectedCharacterId == null) {
    return scenarioPack;
  }

  const resolvedProfile = resolveScenarioProfileForCharacter(
    scenarioPack.scenarioProfile,
    selectedCharacterId
  );

  return {
    ...scenarioPack,
    scenarioProfile: {
      ...resolvedProfile,
      playerCharacterId: selectedCharacterId,
    },
  };
}
