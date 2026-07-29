import type {
  PlayableId,
  PlayableIntegrationDefinition,
  PlayableIntegrationId,
} from "../contracts/playable-runtime";

export type PlayableIntegrationRegistry = {
  register(integration: PlayableIntegrationDefinition): void;
  get(integrationId: PlayableIntegrationId): PlayableIntegrationDefinition | null;
  findByPlayableId(playableId: PlayableId): PlayableIntegrationDefinition[];
  entries(): PlayableIntegrationDefinition[];
};

const builtinPlayableIntegrations: PlayableIntegrationDefinition[] = [
  {
    integrationId: "playable.city-begging.external.default",
    playableId: "city-begging",
    ownerDefaults: {
      ownerKind: "external",
      ownerId: null,
      returnPolicy: "close-only",
    },
    trigger: {
      triggerId: "trigger.playable.city-begging.external.default",
      ownerKind: "external",
      trigger: "manual-launch",
    },
    outcomeConfig: {},
  },
  {
    integrationId: "playable.activity-qte.scene.default",
    playableId: "activity-qte",
    ownerDefaults: {
      ownerKind: "scene",
      returnPolicy: "resume-owner",
    },
    trigger: {
      triggerId: "trigger.playable.activity-qte.scene.default",
      ownerKind: "scene",
      trigger: "legacy-activity-start",
    },
    outcomeConfig: {},
  },
  {
    integrationId: "playable.activity-qte.dialogue.default",
    playableId: "activity-qte",
    ownerDefaults: {
      ownerKind: "dialogue",
      returnPolicy: "resume-owner",
    },
    trigger: {
      triggerId: "trigger.playable.activity-qte.dialogue.default",
      ownerKind: "dialogue",
      trigger: "legacy-activity-start",
    },
    outcomeConfig: {},
  },
  {
    integrationId: "playable.activity-qte.house.temple",
    playableId: "activity-qte",
    ownerDefaults: {
      ownerKind: "house",
      returnPolicy: "resume-owner",
    },
    trigger: {
      triggerId: "trigger.playable.activity-qte.house.temple",
      ownerKind: "house",
      trigger: "house-action-temple-work",
    },
    outcomeConfig: {},
  },
  {
    integrationId: "playable.grain-accounting.house.grain-shop",
    playableId: "grain-accounting",
    ownerDefaults: {
      ownerKind: "house",
      returnPolicy: "resume-owner",
    },
    trigger: {
      triggerId: "trigger.playable.grain-accounting.house.grain-shop",
      ownerKind: "house",
      trigger: "house-action-accounting",
    },
    outcomeConfig: {},
  },
  {
    integrationId: "playable.medicine-compounding.house.medicine-house",
    playableId: "medicine-compounding",
    ownerDefaults: {
      ownerKind: "house",
      returnPolicy: "resume-owner",
    },
    trigger: {
      triggerId: "trigger.playable.medicine-compounding.house.medicine-house",
      ownerKind: "house",
      trigger: "house-action-start-compounding",
    },
    outcomeConfig: {},
  },
  {
    integrationId: "playable.story-battle.scene.default",
    playableId: "story-battle",
    ownerDefaults: {
      ownerKind: "scene",
      returnPolicy: "reenter-owner",
    },
    trigger: {
      triggerId: "trigger.playable.story-battle.scene.default",
      ownerKind: "scene",
      trigger: "legacy-story-battle-start",
    },
    outcomeConfig: {},
  },
  {
    integrationId: "playable.story-battle.dialogue.default",
    playableId: "story-battle",
    ownerDefaults: {
      ownerKind: "dialogue",
      returnPolicy: "reenter-owner",
    },
    trigger: {
      triggerId: "trigger.playable.story-battle.dialogue.default",
      ownerKind: "dialogue",
      trigger: "legacy-story-battle-start",
    },
    outcomeConfig: {},
  },
];

export function createPlayableIntegrationRegistry(
  integrations: PlayableIntegrationDefinition[] = []
): PlayableIntegrationRegistry {
  const integrationsById = new Map<
    PlayableIntegrationId,
    PlayableIntegrationDefinition
  >();
  const integrationsByPlayableId = new Map<
    PlayableId,
    PlayableIntegrationDefinition[]
  >();

  const register = (integration: PlayableIntegrationDefinition): void => {
    integrationsById.set(integration.integrationId, integration);
    const existing = integrationsByPlayableId.get(integration.playableId) ?? [];
    integrationsByPlayableId.set(integration.playableId, [
      ...existing.filter(
        (candidate) => candidate.integrationId !== integration.integrationId
      ),
      integration,
    ]);
  };

  integrations.forEach(register);

  return {
    register,
    get(integrationId) {
      return integrationsById.get(integrationId) ?? null;
    },
    findByPlayableId(playableId) {
      return integrationsByPlayableId.get(playableId) ?? [];
    },
    entries() {
      return Array.from(integrationsById.values());
    },
  };
}

export function createBuiltinPlayableIntegrationRegistry(): PlayableIntegrationRegistry {
  return createPlayableIntegrationRegistry(builtinPlayableIntegrations);
}

export const builtinPlayableIntegrationRegistry =
  createBuiltinPlayableIntegrationRegistry();
