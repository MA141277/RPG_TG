import type { ActivityDefinition, ActivityHandlerId } from "../../domain/activity";
import type {
  PlayableIntegrationId,
  PlayableOwnerContext,
} from "../../core/contracts/playable-runtime";
import type { RuntimeState } from "../../core/contracts/runtime-state";
import { createActivityQteSession } from "../../application/activity/activity-qte-runtime";
import { ACTIVITY_QTE_PLAYABLE_ID } from "./contract";

export function startActivityQtePlayable(input: {
  state: RuntimeState;
  activityDefinition: ActivityDefinition;
  handlerId: ActivityHandlerId;
  integrationId?: PlayableIntegrationId;
  ownerContext?: PlayableOwnerContext;
}): RuntimeState {
  const session = createActivityQteSession(
    input.activityDefinition,
    input.handlerId
  );

  return {
    ...input.state,
    core: {
      ...input.state.core,
      runtime: {
        ...input.state.core.runtime,
        playableSession: {
          sessionId: `playable.${ACTIVITY_QTE_PLAYABLE_ID}`,
          playableId: ACTIVITY_QTE_PLAYABLE_ID,
          integrationId:
            input.integrationId ?? "playable.activity-qte.dialogue.default",
          ownerContext:
            input.ownerContext ?? {
              ownerKind: "house",
              ownerId: input.state.core.world.currentHouseId,
              returnPolicy: "resume-owner",
            },
          status: "active",
        },
        activitySession: session,
      },
    },
  };
}
