import type { EventRuntimeCandidate } from "../contracts/event-runtime";

export function selectEventCandidate(
  candidates: EventRuntimeCandidate[]
): EventRuntimeCandidate | null {
  if (candidates.length === 0) {
    return null;
  }

  return [...candidates].sort(
    (left, right) => right.priority - left.priority
  )[0]!;
}
