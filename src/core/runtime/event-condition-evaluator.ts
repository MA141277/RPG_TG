import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";

export function canActivateEvent(input: {
  candidateId: string | null;
  eventDefinitionsById: Record<string, EventDefinition>;
  state: GameState;
}): boolean {
  if (input.candidateId == null) {
    return false;
  }

  const eventDefinition = input.eventDefinitionsById[input.candidateId];
  if (eventDefinition == null) {
    return false;
  }

  if (eventDefinition.occurrence === "repeatable") {
    return true;
  }

  const firedCount =
    input.state.runtime.eventHistory[input.candidateId]?.firedCount ?? 0;

  if (eventDefinition.occurrence === "once") {
    return firedCount === 0;
  }

  const chapterKey = `${eventDefinition.id}:${input.state.calendar.chapterId}`;
  return (input.state.runtime.variables[chapterKey] ?? 0) === 0;
}
