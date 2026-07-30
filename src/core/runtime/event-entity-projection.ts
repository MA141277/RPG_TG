import type { RuntimeEventEntity } from "../contracts/event-router";
import type { RuntimeTaskInput } from "../contracts/runtime-result";
import type { EventDefinition, EventRuntimeAction } from "../../domain/event";

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

export function readRuntimeEventTaskInputs(
  event: RuntimeEventEntity
): RuntimeTaskInput[] {
  const taskInputs = event.payload.taskInputs;
  return Array.isArray(taskInputs) ? (taskInputs as RuntimeTaskInput[]) : [];
}

export function readRuntimeEventActions(
  event: RuntimeEventEntity
): EventRuntimeAction[] {
  const actions = event.payload.actions;
  return Array.isArray(actions) ? (actions as EventRuntimeAction[]) : [];
}
