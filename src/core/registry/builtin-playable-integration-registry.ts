import type { PlayableIntegrationDefinition } from "../contracts/playable-runtime";
import {
  createPlayableIntegrationRegistry,
  type PlayableIntegrationRegistry,
} from "./playable-integration-registry";

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
    integrationId: "playable.aibegging.external.default",
    playableId: "aibegging",
    ownerDefaults: {
      ownerKind: "external",
      ownerId: null,
      returnPolicy: "close-only",
    },
    trigger: {
      triggerId: "trigger.playable.aibegging.external.default",
      ownerKind: "external",
      trigger: "manual-launch",
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
  {
    integrationId: "playable.building-flow.house.default",
    playableId: "building-flow",
    ownerDefaults: {
      ownerKind: "house",
      returnPolicy: "resume-owner",
    },
    trigger: {
      triggerId: "trigger.playable.building-flow.house.default",
      ownerKind: "house",
      trigger: "building-container-item-action",
    },
    outcomeConfig: {},
  },
];

export function installBuiltinPlayableIntegrations(
  registry: PlayableIntegrationRegistry
): void {
  builtinPlayableIntegrations.forEach((integration) => {
    registry.register(integration);
  });
}

export function createBuiltinPlayableIntegrationRegistry(): PlayableIntegrationRegistry {
  const registry = createPlayableIntegrationRegistry();
  installBuiltinPlayableIntegrations(registry);
  return registry;
}

export const builtinPlayableIntegrationRegistry =
  createBuiltinPlayableIntegrationRegistry();
