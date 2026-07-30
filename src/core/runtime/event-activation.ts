import type { EventRuntimeCandidate } from "../contracts/event-runtime";
import type { RuntimeTaskInput } from "../contracts/runtime-result";

export type ActivatedEvent = {
  eventId: string;
  activeEventId: string;
  sceneId: string | null;
  taskInputs: RuntimeTaskInput[];
};

export function activateEvent(
  candidate: EventRuntimeCandidate | null
): ActivatedEvent | null {
  if (candidate == null) {
    return null;
  }

  return {
    eventId: candidate.eventId,
    activeEventId: candidate.eventId,
    sceneId: candidate.sceneId ?? null,
    taskInputs: candidate.taskInputs ?? [],
  };
}
