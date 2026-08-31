import type {
  WorldNegotiationApproach,
  WorldStoryNegotiationCapability,
} from "../../domain/world-intent";

export const HAOZHOU_WORLD_INTENT_NEGOTIATION_NODE_IDS = {
  templeRequestEarlyBegging: "temple.request-early-begging",
  templeReviewWorkPlanNegotiation: "temple.review-work-plan-negotiation",
  keepAssignmentNegotiation: "keep.assignment-negotiation",
} as const;

export const TEMPLE_REQUEST_EARLY_BEGGING_ACTION_PREFIX =
  "world-intent:temple-request-early-begging:";
export const TEMPLE_REVIEW_WORK_PLAN_NEGOTIATION_ACTION_PREFIX =
  "world-intent:temple-review-work-plan-negotiation:";
export const KEEP_ASSIGNMENT_NEGOTIATION_ACTION_PREFIX =
  "world-intent:keep-assignment-negotiation:";

const TEMPLE_REQUEST_EARLY_BEGGING_APPROACHES: WorldNegotiationApproach[] = [
  "deferential",
  "plea",
  "pragmatic",
  "duty",
  "competence",
  "defiant",
];

const TEMPLE_REVIEW_WORK_PLAN_APPROACHES: WorldNegotiationApproach[] = [
  "deferential",
  "plea",
  "pragmatic",
  "duty",
  "competence",
  "defiant",
];

const KEEP_ASSIGNMENT_APPROACHES: WorldNegotiationApproach[] = [
  "deferential",
  "pragmatic",
  "duty",
  "competence",
  "defiant",
];

function withOptionalTargetCharacterId(
  node: Omit<WorldStoryNegotiationCapability, "targetCharacterId">,
  targetCharacterId?: string | null
): WorldStoryNegotiationCapability {
  return targetCharacterId == null
    ? node
    : {
        ...node,
        targetCharacterId,
      };
}

export function createTempleRequestEarlyBeggingNegotiationNode(input: {
  targetCharacterId?: string | null;
}): WorldStoryNegotiationCapability {
  return withOptionalTargetCharacterId(
    {
      nodeId: HAOZHOU_WORLD_INTENT_NEGOTIATION_NODE_IDS.templeRequestEarlyBegging,
      label: "说服住持提前外出化缘",
      allowedApproaches: TEMPLE_REQUEST_EARLY_BEGGING_APPROACHES,
    },
    input.targetCharacterId
  );
}

export function createTempleReviewWorkPlanNegotiationNode(input: {
  targetCharacterId?: string | null;
}): WorldStoryNegotiationCapability {
  return withOptionalTargetCharacterId(
    {
      nodeId:
        HAOZHOU_WORLD_INTENT_NEGOTIATION_NODE_IDS.templeReviewWorkPlanNegotiation,
      label: "说服住持把本轮差事改为化缘",
      allowedApproaches: TEMPLE_REVIEW_WORK_PLAN_APPROACHES,
    },
    input.targetCharacterId
  );
}

export function createKeepAssignmentNegotiationNode(input: {
  targetCharacterId?: string | null;
}): WorldStoryNegotiationCapability {
  return withOptionalTargetCharacterId(
    {
      nodeId: HAOZHOU_WORLD_INTENT_NEGOTIATION_NODE_IDS.keepAssignmentNegotiation,
      label: "向郭子兴请领差事",
      allowedApproaches: KEEP_ASSIGNMENT_APPROACHES,
    },
    input.targetCharacterId
  );
}

export function buildHaozhouWorldIntentNegotiationActionId(input: {
  nodeId: string;
  approach: WorldNegotiationApproach;
}): string | null {
  if (
    input.nodeId ===
    HAOZHOU_WORLD_INTENT_NEGOTIATION_NODE_IDS.templeRequestEarlyBegging
  ) {
    return `${TEMPLE_REQUEST_EARLY_BEGGING_ACTION_PREFIX}${input.approach}`;
  }

  if (
    input.nodeId ===
    HAOZHOU_WORLD_INTENT_NEGOTIATION_NODE_IDS.templeReviewWorkPlanNegotiation
  ) {
    return `${TEMPLE_REVIEW_WORK_PLAN_NEGOTIATION_ACTION_PREFIX}${input.approach}`;
  }

  if (
    input.nodeId ===
    HAOZHOU_WORLD_INTENT_NEGOTIATION_NODE_IDS.keepAssignmentNegotiation
  ) {
    return `${KEEP_ASSIGNMENT_NEGOTIATION_ACTION_PREFIX}${input.approach}`;
  }

  return null;
}
