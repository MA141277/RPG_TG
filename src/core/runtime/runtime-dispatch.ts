import type { RuntimeRequest } from "../contracts/runtime-request";
import type { RuntimeResult } from "../contracts/runtime-result";
import type { RuntimeState } from "../contracts/runtime-state";
import type {
  TaskAction,
  TaskDefinition,
  TaskSignal,
} from "../contracts/task-runtime";
import type { RuntimeFollowUpContext } from "./runtime-router";
import type { RuntimeRouter } from "./runtime-router";
import { settleRuntimeEffects } from "./runtime-settlement";
import {
  applyTaskAction,
  applyTaskSignal,
  createEmptyTaskRuntimeState,
} from "./task-runtime";

export function dispatchRuntimeRequest(input: {
  state: RuntimeState;
  request: RuntimeRequest;
  context: {
    router: RuntimeRouter;
    followUp?: RuntimeFollowUpContext;
    taskDefinitionsById?: Record<string, TaskDefinition>;
  };
}): RuntimeResult {
  const routed = input.context.router.route({
    state: input.state,
    request: input.request,
  });
  const effectSettlement = settleRuntimeEffects({
    state: routed.state,
    effects: routed.effects,
    emittedBy: "runtime-router",
    appliedBy: "runtime-settlement",
  });
  const taskSettlement = settleRuntimeTasks({
    state: effectSettlement.state,
    taskActions: routed.taskActions,
    taskSignals: routed.taskSignals,
    taskDefinitionsById: input.context.taskDefinitionsById,
  });
  const settlement =
    taskSettlement.effects.length === 0
      ? { state: taskSettlement.state }
      : settleRuntimeEffects({
          state: taskSettlement.state,
          effects: taskSettlement.effects,
          emittedBy: "task-runtime",
          appliedBy: "runtime-settlement",
        });
  const followUp = settleRuntimeFollowUp({
    state: settlement.state,
    interactive: routed.interactive,
    context: input.context.followUp,
  });

  return {
    ...routed,
    ...(taskSettlement.taskUpdates.length === 0
      ? {}
      : {
          taskUpdates: [
            ...(routed.taskUpdates ?? []),
            ...taskSettlement.taskUpdates,
          ],
        }),
    state: followUp.state,
    ...(followUp.interactive === undefined
      ? {}
      : { interactive: followUp.interactive }),
  };
}

function settleRuntimeTasks(input: {
  state: RuntimeState;
  taskActions: RuntimeResult["taskActions"];
  taskSignals: RuntimeResult["taskSignals"];
  taskDefinitionsById: Record<string, TaskDefinition> | undefined;
}): {
  state: RuntimeState;
  taskUpdates: NonNullable<RuntimeResult["taskUpdates"]>;
  effects: RuntimeResult["effects"];
} {
  if (input.taskDefinitionsById == null) {
    return {
      state: input.state,
      taskUpdates: [],
      effects: [],
    };
  }

  let nextTaskState =
    input.state.core.runtime.tasks ?? createEmptyTaskRuntimeState("");
  const taskUpdates: NonNullable<RuntimeResult["taskUpdates"]> = [];
  const effects: RuntimeResult["effects"] = [];

  for (const taskAction of input.taskActions ?? []) {
    if (!isTaskRuntimeAction(taskAction)) {
      continue;
    }

    const result = applyTaskAction({
      state: nextTaskState,
      definitionsById: input.taskDefinitionsById,
      action: taskAction,
    });
    nextTaskState = result.state;
    taskUpdates.push(...result.taskUpdates);
    effects.push(...result.effects);
  }

  for (const taskSignal of input.taskSignals ?? []) {
    if (!isTaskRuntimeSignal(taskSignal)) {
      continue;
    }

    const result = applyTaskSignal({
      state: nextTaskState,
      definitionsById: input.taskDefinitionsById,
      signal: taskSignal,
    });
    nextTaskState = result.state;
    taskUpdates.push(...result.taskUpdates);
    effects.push(...result.effects);
  }

  if (taskUpdates.length === 0 && effects.length === 0) {
    return {
      state: input.state,
      taskUpdates,
      effects,
    };
  }

  return {
    state: {
      ...input.state,
      core: {
        ...input.state.core,
        runtime: {
          ...input.state.core.runtime,
          tasks: nextTaskState,
        },
      },
    },
    taskUpdates,
    effects,
  };
}

function isTaskRuntimeAction(
  value: NonNullable<RuntimeResult["taskActions"]>[number]
): value is TaskAction {
  const candidate = value as Record<string, unknown>;
  return (
    (value.type === "start" ||
      value.type === "complete" ||
      value.type === "fail") &&
    typeof value.taskId === "string" &&
    typeof candidate.occurredAt === "string"
  );
}

function isTaskRuntimeSignal(
  value: NonNullable<RuntimeResult["taskSignals"]>[number]
): value is TaskSignal {
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.source === "string" &&
    typeof candidate.occurredAt === "string"
  );
}

function settleRuntimeFollowUp(input: {
  state: RuntimeState;
  interactive: RuntimeResult["interactive"];
  context: RuntimeFollowUpContext | undefined;
}): {
  state: RuntimeState;
  interactive: RuntimeResult["interactive"];
} {
  if (
    input.interactive == null ||
    input.interactive.type === "none" ||
    input.context?.handleInteractive == null
  ) {
    return {
      state: input.state,
      interactive: input.interactive,
    };
  }

  return {
    state: input.context.handleInteractive({
      state: input.state,
      interactive: input.interactive,
    }),
    interactive: { type: "none" },
  };
}
