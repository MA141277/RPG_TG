import type { RuntimeEventEntity } from "../contracts/event-router";
import type { EventDefinition } from "../../domain/event";

export function createRuntimeEventEntity(
  eventDefinition: EventDefinition
): RuntimeEventEntity {
  return {
    id: eventDefinition.id,
    kind: eventDefinition.type === "settlement" ? "settlement" : "dialogue",
    payload: {
      entrySceneId: eventDefinition.entrySceneId,
      ...(eventDefinition.dialogueId == null
        ? {}
        : { dialogueId: eventDefinition.dialogueId }),
      ...(eventDefinition.settlementId == null
        ? {}
        : { settlementId: eventDefinition.settlementId }),
      ...(eventDefinition.taskInputs == null
        ? {}
        : { taskInputs: eventDefinition.taskInputs }),
      ...(eventDefinition.actions == null
        ? {}
        : { actions: eventDefinition.actions }),
    },
    ...(eventDefinition.nextEventId == null
      ? {}
      : { nextEventId: eventDefinition.nextEventId }),
    ...(eventDefinition.emitEventIds == null
      ? {}
      : { emitEventIds: eventDefinition.emitEventIds }),
    metadata: {
      title: eventDefinition.name,
      ...(eventDefinition.tags == null ? {} : { tags: eventDefinition.tags }),
    },
  };
}
