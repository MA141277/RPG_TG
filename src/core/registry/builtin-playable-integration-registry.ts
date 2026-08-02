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
    integrationId:
      "playable.temple-copy-scripture.instance.template.temple-copy-scripture",
    playableId: "temple-copy-scripture",
    ownerDefaults: {
      ownerKind: "external",
      ownerId: null,
      returnPolicy: "close-only",
    },
    trigger: {
      triggerId:
        "trigger.playable.temple-copy-scripture.instance.template.temple-copy-scripture",
      ownerKind: "external",
      trigger: "event.building.house.kulan.temple.copy_scripture",
      launchPayload: {
        title: "抄写经卷",
        briefing:
          "在偏殿抄录残缺经卷，顺便替住持整理寺中的旧账与香火名册。",
        prompts: [
          {
            id: "prompt-1",
            text: "静坐抄经，先定你的心，再定你的字。",
            choices: [
              { id: "trace", label: "依字描摹" },
              { id: "balance", label: "稳腕正锋" },
              { id: "review", label: "核对残页" },
            ],
            expectedChoiceId: "trace",
          },
          {
            id: "prompt-2",
            text: "这桩事不见刀光，却最考验耐性。",
            choices: [
              { id: "trace", label: "依字描摹" },
              { id: "balance", label: "稳腕正锋" },
              { id: "review", label: "核对残页" },
            ],
            expectedChoiceId: "balance",
          },
        ],
        requiredScore: 1,
      },
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
