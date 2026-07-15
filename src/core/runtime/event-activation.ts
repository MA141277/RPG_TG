import type { EventRuntimeCandidate } from "../contracts/event-runtime";
import type { RuntimeTaskAction } from "../contracts/runtime-result";

export type ActivatedEvent = {
  activeEventId: string;
  sceneId: string | null;
  taskActions: RuntimeTaskAction[];
};

export function activateEvent(
  candidate: EventRuntimeCandidate | null
): ActivatedEvent | null {
  if (candidate == null) {
    return null;
  }

  return {
    activeEventId: candidate.eventId,
    sceneId: candidate.sceneId ?? null,
    taskActions: candidate.taskActions ?? [],
  };
}
