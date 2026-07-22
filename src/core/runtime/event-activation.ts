import type { EventRuntimeCandidate } from "../contracts/event-runtime";
import type { RuntimeTaskInput } from "../contracts/runtime-result";

export type ActivatedEvent = {
  activeEventId: string;
  taskInputs: RuntimeTaskInput[];
};

export function activateEvent(
  candidate: EventRuntimeCandidate | null
): ActivatedEvent | null {
  if (candidate == null) {
    return null;
  }

  return {
    activeEventId: candidate.eventId,
    taskInputs: candidate.taskInputs ?? [],
  };
}
