export type WorldReachableHouseCapability = {
  houseId: string;
  houseName: string;
  moduleId?: string | null;
  refusalText?: string | null;
};

export type WorldTalkTargetCapability = {
  characterId: string;
  characterName: string;
};

export type WorldServiceActionCapability = {
  actionId: string;
  label: string;
  description?: string | null;
};

export type WorldNegotiationApproach =
  | "deferential"
  | "plea"
  | "pragmatic"
  | "duty"
  | "competence"
  | "defiant";

export type WorldStoryNegotiationCapability = {
  nodeId: string;
  label: string;
  targetCharacterId?: string | null;
  allowedApproaches?: WorldNegotiationApproach[];
};

export type WorldLeaveCapability = {
  actionId: string;
  label: string;
};

export type WorldCapabilitySnapshot = {
  cityId: string;
  currentHouseId: string | null;
  currentHouseModuleId?: string | null;
  storyStage?: string | null;
  reachableHouses: WorldReachableHouseCapability[];
  talkTargets: WorldTalkTargetCapability[];
  serviceActions: WorldServiceActionCapability[];
  negotiableStoryNodes: WorldStoryNegotiationCapability[];
  leaveAction?: WorldLeaveCapability | null;
};

export type WorldObservedEventReactionHint = {
  characterId: string;
  summary: string;
};

export type HouseActionMemoryKind =
  | "panel-open"
  | "panel-close-without-action"
  | "service-preview"
  | "service-cancel"
  | "service-success"
  | "trade-buy-success"
  | "trade-sell-success"
  | "work-preview"
  | "work-preview-exit"
  | "work-complete"
  | "gamble-enter"
  | "gamble-leave-without-playing"
  | "gamble-settlement"
  | "house-leave";

export type HouseActionMemoryContext = {
  kind: HouseActionMemoryKind;
  panelId?: string;
  panelLabel?: string;
  serviceId?: string;
  serviceLabel?: string;
  actionId?: string;
  itemId?: string;
  itemName?: string;
  offerId?: string;
  offerTitle?: string;
  quantity?: number;
  goldDelta?: number;
  resultKind?: "preview" | "cancel" | "success" | "failure" | "no-action";
};

export type WorldObservedEvent = {
  type: string;
  summary: string;
  cityId?: string;
  houseId?: string | null;
  reactionHints?: WorldObservedEventReactionHint[];
  houseActionMemory?: HouseActionMemoryContext;
  timestampMs?: number;
};

export type WorldObservedEventRecord = WorldObservedEvent & {
  eventId: string;
};

export type WorldAiIntentResponse =
  | {
      intent: "go-to-house";
      targetHouseId: string;
      shortNarration?: string;
      confidence: number;
    }
  | {
      intent: "leave-house";
      shortNarration?: string;
      confidence: number;
    }
  | {
      intent: "talk-to-npc";
      targetCharacterId: string;
      shortNarration?: string;
      confidence: number;
    }
  | {
      intent: "open-service-action";
      actionId: string;
      shortNarration?: string;
      confidence: number;
    }
  | {
      intent: "negotiate-story-node";
      nodeId: string;
      targetCharacterId?: string | null;
      approach: WorldNegotiationApproach;
      shortNarration?: string;
      confidence: number;
    }
  | {
      intent: "clarify";
      question: string;
      confidence: number;
    };

export type WorldIntentProviderMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type WorldIntentProviderRequest = {
  requestId: string;
  text: string;
  capabilitySnapshot: WorldCapabilitySnapshot;
  recentEvents: WorldObservedEvent[];
  system: string;
  messages: WorldIntentProviderMessage[];
};

export type WorldIntentProviderResolution = {
  requestId: string;
  result: WorldAiIntentResponse;
};

export type WorldIntentProvider = {
  classify(
    request: WorldIntentProviderRequest
  ): Promise<WorldIntentProviderResolution>;
  cancel?(requestId: string): void | Promise<void>;
};

export type WorldAiContextRuntimeState = {
  recentEvents: WorldObservedEvent[];
  eventLedger: WorldObservedEventRecord[];
  eventSequence: number;
  lastKnownCityId: string | null;
  lastKnownHouseId: string | null;
};

export function createInitialWorldIntentRuntimeState(): WorldAiContextRuntimeState {
  return {
    recentEvents: [],
    eventLedger: [],
    eventSequence: 0,
    lastKnownCityId: null,
    lastKnownHouseId: null,
  };
}
