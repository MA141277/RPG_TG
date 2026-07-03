import type { RuntimeRequest } from "../contracts/runtime-request";
import type {
  ActivePlayableSession,
  PlayableDefinition,
  PlayableFamily,
  PlayableId,
  PlayableIntegrationDefinition,
  PlayableIntegrationId,
  PlayableLaunchInput,
  PlayableLaunchResolution,
  PlayableOwnerContext,
  PlayableSettlement,
} from "../contracts/playable-runtime";
import {
  builtinPlayableDefinitionRegistry,
  type PlayableDefinitionRegistry,
} from "../registry/playable-definition-registry";
import {
  builtinPlayableIntegrationRegistry,
  type PlayableIntegrationRegistry,
} from "../registry/playable-integration-registry";

export const PLAYABLE_LAUNCH_EVENT_ID = "playable.launch";

type LegacyPlayableKind = "activity-qte" | "city-begging" | "story-battle";

type LegacyInteractiveSource =
  | { type: "house"; houseId: string }
  | { type: "scene"; sceneId: string }
  | { type: "external"; id: string };

export function createLaunchPlayableRequest(
  playableId: PlayableId,
  options: {
    integrationId?: PlayableIntegrationId | undefined;
    ownerContext?: Partial<PlayableOwnerContext> | undefined;
    payload?: Record<string, unknown> | undefined;
  } = {}
): RuntimeRequest {
  return {
    family: "external",
    type: "external",
    eventId: PLAYABLE_LAUNCH_EVENT_ID,
    payload: {
      playableId,
      ...(options.integrationId == null
        ? {}
        : { integrationId: options.integrationId }),
      ...(options.ownerContext == null
        ? {}
        : { ownerContext: options.ownerContext }),
      ...(options.payload == null ? {} : { launchPayload: options.payload }),
    },
  };
}

export function resolvePlayableLaunchRequest(input: {
  request: RuntimeRequest;
  definitions?: PlayableDefinitionRegistry | undefined;
  integrations?: PlayableIntegrationRegistry | undefined;
}): PlayableLaunchResolution | null {
  const launchInput = toPlayableLaunchInput(input.request);
  if (launchInput == null) {
    return null;
  }

  return resolvePlayableLaunch({
    launch: launchInput,
    definitions: input.definitions,
    integrations: input.integrations,
  });
}

export function resolvePlayableLaunch(input: {
  launch: PlayableLaunchInput;
  definitions?: PlayableDefinitionRegistry | undefined;
  integrations?: PlayableIntegrationRegistry | undefined;
}): PlayableLaunchResolution {
  const definitions = input.definitions ?? builtinPlayableDefinitionRegistry;
  const integrations = input.integrations ?? builtinPlayableIntegrationRegistry;

  const integration = resolveIntegration({
    launch: input.launch,
    integrations,
  });
  if (!("integrationId" in integration)) {
    return integration;
  }

  const definition = definitions.get(integration.playableId);
  if (definition == null) {
    return {
      ok: false,
      code: "unknown-playable",
      message: `Unknown playable "${integration.playableId}".`,
    };
  }

  const ownerContext = normalizeOwnerContext({
    integration,
    ownerContext: input.launch.ownerContext,
  });
  if (!("ownerKind" in ownerContext)) {
    return ownerContext;
  }

  return {
    ok: true,
    definition,
    integration,
    launch: {
      playableId: definition.id,
      integrationId: integration.integrationId,
      family: definition.family,
      ownerContext,
      ...(input.launch.payload == null ? {} : { payload: input.launch.payload }),
    },
  };
}

export function createPlayableSessionShell(input: {
  sessionId: string;
  playableId: PlayableId;
  integrationId: PlayableIntegrationId;
  family: PlayableFamily;
  ownerContext: PlayableOwnerContext;
  status?: ActivePlayableSession["status"] | undefined;
}): ActivePlayableSession {
  return {
    sessionId: input.sessionId,
    playableId: input.playableId,
    integrationId: input.integrationId,
    family: input.family,
    ownerContext: input.ownerContext,
    status: input.status ?? "active",
  };
}

export function createLegacyPlayableSession(input: {
  kind: LegacyPlayableKind;
  source: LegacyInteractiveSource;
}): ActivePlayableSession | null {
  const definition =
    builtinPlayableDefinitionRegistry.getByLegacyInteractiveKind(input.kind);
  const integrationId = getLegacyIntegrationId(input.kind);
  const integration = builtinPlayableIntegrationRegistry.get(integrationId);

  if (definition == null || integration == null) {
    return null;
  }

  const ownerContext = createLegacyOwnerContext({
    kind: input.kind,
    source: input.source,
  });
  if (ownerContext == null) {
    return null;
  }

  return createPlayableSessionShell({
    sessionId: `playable.${definition.id}`,
    playableId: definition.id,
    integrationId: integration.integrationId,
    family: definition.family,
    ownerContext,
  });
}

export function createPlayableSettlementShell(input: {
  session: ActivePlayableSession;
  outcome: PlayableSettlement["outcome"];
  factResult: PlayableSettlement["factResult"];
  effects?: PlayableSettlement["effects"] | undefined;
}): PlayableSettlement {
  return {
    integrationId: input.session.integrationId,
    outcome: input.outcome,
    factResult: input.factResult,
    handoff: {
      type: input.session.ownerContext.returnPolicy,
      ownerKind: input.session.ownerContext.ownerKind,
      ownerId: input.session.ownerContext.ownerId,
      ...(input.session.ownerContext.sessionToken == null
        ? {}
        : { sessionToken: input.session.ownerContext.sessionToken }),
    },
    effects: input.effects ?? [],
  };
}

function toPlayableLaunchInput(request: RuntimeRequest): PlayableLaunchInput | null {
  if (request.type !== "external") {
    return null;
  }

  if (request.eventId === PLAYABLE_LAUNCH_EVENT_ID) {
    const payload = isRecord(request.payload) ? request.payload : null;
    const playableId =
      typeof payload?.playableId === "string"
        ? (payload.playableId as PlayableId)
        : undefined;
    const integrationId =
      typeof payload?.integrationId === "string"
        ? (payload.integrationId as PlayableIntegrationId)
        : undefined;
    const ownerContext = isRecord(payload?.ownerContext)
      ? (payload.ownerContext as Partial<PlayableOwnerContext>)
      : undefined;
    const launchPayload = isRecord(payload?.launchPayload)
      ? payload.launchPayload
      : undefined;

    return {
      ...(playableId == null ? {} : { playableId }),
      ...(integrationId == null ? {} : { integrationId }),
      ...(ownerContext == null ? {} : { ownerContext }),
      ...(launchPayload == null ? {} : { payload: launchPayload }),
    };
  }

  if (request.eventId === "interactive.city-begging.launch") {
    return {
      playableId: "city-begging",
      ...(request.payload == null ? {} : { payload: request.payload }),
    };
  }

  return null;
}

function resolveIntegration(input: {
  launch: PlayableLaunchInput;
  integrations: PlayableIntegrationRegistry;
}):
  | PlayableIntegrationDefinition
  | {
      ok: false;
      code:
        | "missing-playable-id"
        | "missing-integration"
        | "unknown-integration"
        | "ambiguous-integration"
        | "integration-mismatch";
      message: string;
    } {
  if (input.launch.integrationId != null) {
    const integration = input.integrations.get(input.launch.integrationId);
    if (integration == null) {
      return {
        ok: false,
        code: "unknown-integration",
        message: `Unknown playable integration "${input.launch.integrationId}".`,
      };
    }
    if (
      input.launch.playableId != null &&
      integration.playableId !== input.launch.playableId
    ) {
      return {
        ok: false,
        code: "integration-mismatch",
        message:
          `Playable integration "${input.launch.integrationId}" does not match ` +
          `playable "${input.launch.playableId}".`,
      };
    }
    return integration;
  }

  if (input.launch.playableId == null) {
    return {
      ok: false,
      code: "missing-playable-id",
      message:
        "Playable launch must provide either a playableId or an integrationId.",
    };
  }

  const matches = input.integrations.findByPlayableId(input.launch.playableId);
  if (matches.length === 0) {
    return {
      ok: false,
      code: "missing-integration",
      message:
        `Playable "${input.launch.playableId}" has no registered integration.`,
    };
  }
  if (matches.length > 1) {
    return {
      ok: false,
      code: "ambiguous-integration",
      message:
        `Playable "${input.launch.playableId}" has multiple integrations. ` +
        "Launch must specify integrationId explicitly.",
    };
  }

  const [match] = matches;
  if (match == null) {
    return {
      ok: false,
      code: "missing-integration",
      message:
        `Playable "${input.launch.playableId}" has no registered integration.`,
    };
  }

  return match;
}

function normalizeOwnerContext(input: {
  integration: PlayableIntegrationDefinition;
  ownerContext?: Partial<PlayableOwnerContext> | undefined;
}):
  | PlayableOwnerContext
  | {
      ok: false;
      code: "missing-owner-kind" | "missing-owner-id" | "missing-return-policy";
      message: string;
    } {
  const merged = {
    ...input.integration.ownerDefaults,
    ...(input.ownerContext ?? {}),
  };

  const ownerKind = merged.ownerKind;
  if (
    ownerKind !== "house" &&
    ownerKind !== "scene" &&
    ownerKind !== "task" &&
    ownerKind !== "external"
  ) {
    return {
      ok: false,
      code: "missing-owner-kind",
      message: "Playable launch is missing ownerKind.",
    };
  }

  const returnPolicy = merged.returnPolicy;
  if (
    returnPolicy !== "resume-owner" &&
    returnPolicy !== "reenter-owner" &&
    returnPolicy !== "close-only"
  ) {
    return {
      ok: false,
      code: "missing-return-policy",
      message: "Playable launch is missing returnPolicy.",
    };
  }

  if (ownerKind !== "external" && typeof merged.ownerId !== "string") {
    return {
      ok: false,
      code: "missing-owner-id",
      message: `Playable launch for ownerKind "${ownerKind}" is missing ownerId.`,
    };
  }

  return {
    ownerKind,
    ownerId: ownerKind === "external" ? null : merged.ownerId ?? null,
    returnPolicy,
    ...(typeof merged.sessionToken === "string"
      ? { sessionToken: merged.sessionToken }
      : {}),
  };
}

function createLegacyOwnerContext(input: {
  kind: LegacyPlayableKind;
  source: LegacyInteractiveSource;
}): PlayableOwnerContext | null {
  if (input.kind === "city-begging") {
    return {
      ownerKind: "external",
      ownerId: null,
      returnPolicy: "close-only",
    };
  }

  if (input.source.type !== "scene") {
    return null;
  }

  return {
    ownerKind: "scene",
    ownerId: input.source.sceneId,
    returnPolicy:
      input.kind === "activity-qte" ? "resume-owner" : "reenter-owner",
  };
}

function getLegacyIntegrationId(
  kind: LegacyPlayableKind
): PlayableIntegrationId {
  if (kind === "activity-qte") {
    return "playable.activity-qte.scene.default";
  }

  if (kind === "story-battle") {
    return "playable.story-battle.scene.default";
  }

  return "playable.city-begging.external.default";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value != null;
}
