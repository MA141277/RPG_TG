import type { RuntimeRequest } from "../contracts/runtime-request";
import type { RuntimeResult } from "../contracts/runtime-result";
import type { EffectSettlementResult } from "../contracts/effect-settlement";
import type { RuntimeState } from "../contracts/runtime-state";
import type {
  TaskAction,
  TaskDefinition,
  TaskSignal,
} from "../contracts/task-runtime";
import type { RuntimeFollowUpContext } from "./runtime-router";
import type { RuntimeRouteResult } from "./runtime-router";
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
  return settleRoutedRuntimeResult({
    routed,
    followUp: input.context.followUp,
    taskDefinitionsById: input.context.taskDefinitionsById,
  });
}

function settleRoutedRuntimeResult(input: {
  routed: RuntimeRouteResult;
  followUp: RuntimeFollowUpContext | undefined;
  taskDefinitionsById: Record<string, TaskDefinition> | undefined;
}): RuntimeResult {
  const { routed, followUp, taskDefinitionsById } = input;
  const settledEffects = settleRuntimeEffects({
    state: routed.state,
    effects: routed.effects,
    emittedBy: "runtime-router",
    appliedBy: "runtime-settlement",
    ...(routed.characterDefinitions == null
      ? {}
      : { characterDefinitions: routed.characterDefinitions }),
    ...(routed.characterStatusById == null
      ? {}
      : { characterStatusById: routed.characterStatusById }),
  });
  const settledTasks = settleRuntimeTasks({
    state: settledEffects.state,
    taskInputs: routed.taskInputs,
    taskDefinitionsById,
  });
  const finalState: EffectSettlementResult =
    settledTasks.effects.length === 0
      ? {
          state: settledTasks.state,
          ...(settledEffects.characterDefinitions == null
            ? {}
            : { characterDefinitions: settledEffects.characterDefinitions }),
          ...(settledEffects.characterStatusById == null
            ? {}
            : { characterStatusById: settledEffects.characterStatusById }),
          settledEffects: [],
          unsupportedEffects: [],
          warnings: [],
        }
      : settleRuntimeEffects({
        state: settledTasks.state,
        effects: settledTasks.effects,
        emittedBy: "task-runtime",
        appliedBy: "runtime-settlement",
        ...(settledEffects.characterDefinitions == null
          ? {}
          : { characterDefinitions: settledEffects.characterDefinitions }),
        ...(settledEffects.characterStatusById == null
          ? {}
          : { characterStatusById: settledEffects.characterStatusById }),
      });
  const handledFollowUp = settleRuntimeFollowUp({
    state: finalState.state,
    followUp: routed.followUp,
    context: followUp,
  });

  return {
    ...routed,
    ...(handledFollowUp.characterDefinitions === undefined
      ? {}
      : { characterDefinitions: handledFollowUp.characterDefinitions }),
    ...(handledFollowUp.characterDefinitions !== undefined ||
    finalState.characterDefinitions === undefined
      ? {}
      : { characterDefinitions: finalState.characterDefinitions }),
    ...(finalState.characterStatusById === undefined
      ? {}
      : { characterStatusById: finalState.characterStatusById }),
    state: handledFollowUp.state,
    ...(handledFollowUp.followUp === undefined
      ? {}
      : { followUp: handledFollowUp.followUp }),
  };
}

function settleRuntimeTasks(input: {
  state: RuntimeState;
  taskInputs: RuntimeRouteResult["taskInputs"];
  taskDefinitionsById: Record<string, TaskDefinition> | undefined;
}): {
  state: RuntimeState;
  effects: RuntimeResult["effects"];
} {
  if (input.taskDefinitionsById == null) {
    return {
      state: input.state,
      effects: [],
    };
  }

  let nextTaskState =
    input.state.core.runtime.tasks ?? createEmptyTaskRuntimeState("");
  let didSettleTaskState = false;
  const effects: RuntimeResult["effects"] = [];

  for (const taskInput of input.taskInputs ?? []) {
    if (isTaskRuntimeAction(taskInput)) {
      const result = applyTaskAction({
        state: nextTaskState,
        definitionsById: input.taskDefinitionsById,
        action: taskInput,
      });
      nextTaskState = result.state;
      didSettleTaskState ||= result.taskUpdates.length > 0;
      effects.push(...result.effects);
      continue;
    }

    if (!isTaskRuntimeSignal(taskInput)) {
      continue;
    }

    const result = applyTaskSignal({
      state: nextTaskState,
      definitionsById: input.taskDefinitionsById,
      signal: taskInput,
    });
    nextTaskState = result.state;
    didSettleTaskState ||= result.taskUpdates.length > 0;
    effects.push(...result.effects);
  }

  if (!didSettleTaskState && effects.length === 0) {
    return {
      state: input.state,
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
    effects,
  };
}

function isTaskRuntimeAction(
  value: NonNullable<RuntimeResult["taskInputs"]>[number]
): value is TaskAction {
  const candidate = value as Record<string, unknown>;
  return (
    (value.type === "start" ||
      value.type === "complete" ||
      value.type === "fail") &&
    typeof candidate.taskId === "string" &&
    typeof candidate.occurredAt === "string"
  );
}

function isTaskRuntimeSignal(
  value: NonNullable<RuntimeResult["taskInputs"]>[number]
): value is TaskSignal {
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.source === "string" &&
    typeof candidate.occurredAt === "string"
  );
}

function settleRuntimeFollowUp(input: {
  state: RuntimeState;
  followUp: RuntimeResult["followUp"];
  context: RuntimeFollowUpContext | undefined;
}): {
  state: RuntimeState;
  characterDefinitions?: RuntimeResult["characterDefinitions"];
  followUp: RuntimeResult["followUp"];
} {
  let state = input.state;
  let characterDefinitions: RuntimeResult["characterDefinitions"];
  let followUp = input.followUp;

  if (
    followUp != null &&
    followUp.type !== "none" &&
    input.context?.handleFollowUp != null
  ) {
    const handled = input.context.handleFollowUp({
      state,
      followUp,
    });
    state = handled.state;
    characterDefinitions = handled.characterDefinitions;
    followUp = { type: "none" };
  }

  return {
    state,
    ...(characterDefinitions === undefined ? {} : { characterDefinitions }),
    followUp,
  };
}
