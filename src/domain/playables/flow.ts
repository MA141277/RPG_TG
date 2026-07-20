export type FlowNode =
  | {
      id: string;
      type: "text";
      text: string;
      nextNodeId: string | null;
    }
  | {
      id: string;
      type: "choice";
      prompt: string;
      options: Array<{
        id: string;
        label: string;
        nextNodeId: string | null;
      }>;
    }
  | {
      id: string;
      type: "complete";
      outcome: "success" | "failure" | "cancelled";
      metrics?: Record<string, string | number | boolean | null> | undefined;
      detail?: Record<string, unknown> | undefined;
    };

export type FlowPlayableDefinition = {
  id: string;
  title: string;
  description?: string;
  playableId?: string;
  integrationId?: string;
  ownerKind?: "building" | "house" | "scene" | "task" | "external";
  ownerId?: string | null;
  returnPolicy?: "resume-owner" | "reenter-owner" | "close-only";
  eventStartTarget?: {
    eventId?: string;
    bindingId?: string;
  };
  launchPayload?: Array<{
    key: string;
    value: string;
  }>;
  initialNodeId: string;
  nodes: FlowNode[];
  outcomeRoutes?: Array<{
    id: string;
    outcome: "success" | "failure" | "cancelled";
    handoffPolicy: "resume-owner" | "reenter-owner" | "close-only";
    summary?: string;
    effectHint?: string;
  }>;
  notes?: string;
};

export type FlowPlayableSessionState = {
  currentNodeId: string;
};
