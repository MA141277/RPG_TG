import type { CharacterId } from "./character";
import type { WorldNegotiationApproach } from "./world-intent";

export type HouseConversationPilotReason =
  | "eligible"
  | "excluded-house"
  | "non-haozhou"
  | "blocking-owner"
  | "no-house";

export type HouseConversationPilotState = {
  enabled: boolean;
  cityId: string | null;
  houseId: string | null;
  hideActionContainer: boolean;
  hideWorldIntentBar: boolean;
  defaultTargetCharacterId: CharacterId | null;
  reason: HouseConversationPilotReason;
};

export type HouseConversationNpcTargetCapability = {
  characterId: CharacterId | string;
  characterName: string;
  available: boolean;
};

export type HouseConversationActionCapability = {
  actionId: string;
  label: string;
  available: boolean;
};

export type HouseConversationServiceCapability = {
  serviceId: string;
  label: string;
  description: string;
  enabled: boolean;
};

export type HouseConversationReachableHouseCapability = {
  houseId: string;
  houseName: string;
  available: boolean;
};

export type HouseConversationLeaveCapability = {
  actionId: string;
  label: string;
  available: boolean;
};

export type HouseConversationNegotiableStoryNodeCapability = {
  nodeId: string;
  label: string;
  allowedApproaches?: WorldNegotiationApproach[];
  targetCharacterId?: CharacterId | string | null;
};

export type HouseConversationCapabilitySnapshot = {
  cityId: string;
  houseId: string;
  moduleId?: string | null;
  targetCharacterId: CharacterId | string | null;
  targetCharacterName: string | null;
  switchableNpcTargets: HouseConversationNpcTargetCapability[];
  houseActions: HouseConversationActionCapability[];
  houseServices: HouseConversationServiceCapability[];
  reachableHouses: HouseConversationReachableHouseCapability[];
  leaveAction: HouseConversationLeaveCapability | null;
  negotiableStoryNodes: HouseConversationNegotiableStoryNodeCapability[];
};

export type HouseConversationRoute =
  | {
      kind: "continue-dialogue";
    }
  | {
      kind: "switch-target-npc";
      characterId: CharacterId | string;
    }
  | {
      kind: "open-house-action";
      actionId: string;
    }
  | {
      kind: "settle-house-service";
      serviceId: string;
      rawPlayerText: string;
    }
  | {
      kind: "go-to-house";
      houseId: string;
    }
  | {
      kind: "leave-house";
    }
  | {
      kind: "negotiate-story-node";
      nodeId: string;
      approach: WorldNegotiationApproach;
      targetCharacterId?: CharacterId | string | null;
    };
