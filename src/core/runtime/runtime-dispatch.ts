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
import { continueEventChain } from "./event-chain-runtime";
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
  const chained =
    routed.followUpEventIds == null ||
    routed.followUpEventIds.length === 0 ||
    input.context.router.routeEventChain == null
      ? null
      : continueEventChain({
          state: routed.state,
          followUpEventIds: routed.followUpEventIds,
          maxDepth: 16,
          router: {
            dispatchEventRoute: ({ state, eventId }) =>
              input.context.router.routeEventChain?.({
                state,
                eventId,
              }) ?? {
                state,
                event: {
                  id: eventId,
                  kind: "bridge",
                  payload: {},
                },
                effects: [],
              },
          },
        });
  const routedEffects = [...routed.effects, ...(chained?.effects ?? [])];
  const routedTaskInputs = [
    ...(routed.taskInputs ?? []),
    ...(chained?.taskInputs ?? []),
  ];
  const effectSettlement = settleRuntimeEffects({
    state: chained?.state ?? routed.state,
    effects: routedEffects,
    emittedBy: "runtime-router",
    appliedBy: "runtime-settlement",
    ...(routed.characterDefinitions == null
      ? {}
      : { characterDefinitions: routed.characterDefinitions }),
    ...(routed.characterStatusById == null
      ? {}
      : { characterStatusById: routed.characterStatusById }),
  });
  const taskSettlement = settleRuntimeTasks({
    state: effectSettlement.state,
    taskInputs: routedTaskInputs,
    taskDefinitionsById: input.context.taskDefinitionsById,
  });
  const taskEffectSettlement =
    taskSettlement.effects.length === 0
      ? null
      : settleRuntimeEffects({
          state: taskSettlement.state,
          effects: taskSettlement.effects,
          emittedBy: "task-runtime",
          appliedBy: "runtime-settlement",
          ...(effectSettlement.characterDefinitions == null
            ? {}
            : { characterDefinitions: effectSettlement.characterDefinitions }),
          ...(effectSettlement.characterStatusById == null
            ? {}
            : { characterStatusById: effectSettlement.characterStatusById }),
        });
  const settlement =
    taskEffectSettlement ??
    {
      state: taskSettlement.state,
      ...(effectSettlement.characterDefinitions == null
        ? {}
        : { characterDefinitions: effectSettlement.characterDefinitions }),
      ...(effectSettlement.characterStatusById == null
        ? {}
        : { characterStatusById: effectSettlement.characterStatusById }),
    };
  const runtimeSettlement = createRuntimeSettlementSummary({
    routedSettlement: routed.settlement,
    routedEffects: effectSettlement,
    taskEffects: taskEffectSettlement,
  });
  const followUp = settleRuntimeFollowUp({
    state: settlement.state,
    followUp: routed.followUp,
    outcome: routed.outcome,
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
    ...(followUp.characterDefinitions === undefined
      ? {}
      : { characterDefinitions: followUp.characterDefinitions }),
    ...(followUp.characterDefinitions !== undefined ||
    settlement.characterDefinitions === undefined
      ? {}
      : { characterDefinitions: settlement.characterDefinitions }),
    ...(settlement.characterStatusById === undefined
      ? {}
      : { characterStatusById: settlement.characterStatusById }),
    ...(followUp.cityStatusById === undefined
      ? {}
      : { cityStatusById: followUp.cityStatusById }),
    ...(followUp.buildingStatusById === undefined
      ? {}
      : { buildingStatusById: followUp.buildingStatusById }),
    ...(runtimeSettlement === undefined ? {} : { settlement: runtimeSettlement }),
    state: followUp.state,
    ...(followUp.outcome === undefined ? {} : { outcome: followUp.outcome }),
    ...(followUp.followUp === undefined ? {} : { followUp: followUp.followUp }),
    ...(followUp.interactive === undefined
      ? {}
      : { interactive: followUp.interactive }),
  };
}

function createRuntimeSettlementSummary(input: {
  routedSettlement: RuntimeResult["settlement"];
  routedEffects: ReturnType<typeof settleRuntimeEffects>;
  taskEffects: ReturnType<typeof settleRuntimeEffects> | null;
}): RuntimeResult["settlement"] | undefined {
  const settledEffects = [
    ...input.routedEffects.settledEffects,
    ...(input.taskEffects?.settledEffects ?? []),
  ];
  const unsupportedEffects = [
    ...input.routedEffects.unsupportedEffects,
    ...(input.taskEffects?.unsupportedEffects ?? []),
  ];
  const warnings = [
    ...input.routedEffects.warnings,
    ...(input.taskEffects?.warnings ?? []),
  ];

  if (
    settledEffects.length === 0 &&
    unsupportedEffects.length === 0 &&
    warnings.length === 0
  ) {
    return input.routedSettlement;
  }

  const routedSettlementMetadata =
    input.routedSettlement != null && typeof input.routedSettlement === "object"
      ? input.routedSettlement
      : null;
  const pendingSettlementEffects =
    routedSettlementMetadata != null &&
    Array.isArray(routedSettlementMetadata.effects)
      ? routedSettlementMetadata.effects
      : [];
  const summary = {
    ...(routedSettlementMetadata == null
      ? {}
      : omitRuntimeSettlementOwnership(routedSettlementMetadata)),
    effects: pendingSettlementEffects,
    appliedBy: "runtime-settlement",
    emittedBy:
      input.routedEffects.settledEffects.length > 0 ||
      input.routedEffects.unsupportedEffects.length > 0 ||
      input.routedEffects.warnings.length > 0
        ? "runtime-router"
        : "task-runtime",
    settledEffects,
    unsupportedEffects,
    warnings,
  };

  return summary;
}

function omitRuntimeSettlementOwnership(
  settlement: NonNullable<RuntimeResult["settlement"]>
): Record<string, unknown> {
  const {
    appliedBy: _appliedBy,
    emittedBy: _emittedBy,
    settledEffects: _settledEffects,
    unsupportedEffects: _unsupportedEffects,
    warnings: _warnings,
    effects: _effects,
    ...rest
  } = settlement as Record<string, unknown>;

  return rest;
}

function settleRuntimeTasks(input: {
  state: RuntimeState;
  taskInputs: RuntimeResult["taskInputs"];
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

  for (const taskInput of input.taskInputs ?? []) {
    if (isTaskRuntimeAction(taskInput)) {
      const result = applyTaskAction({
        state: nextTaskState,
        definitionsById: input.taskDefinitionsById,
        action: taskInput,
      });
      nextTaskState = result.state;
      taskUpdates.push(...result.taskUpdates);
      effects.push(...result.effects);
      continue;
    }

    if (isTaskRuntimeSignal(taskInput)) {
      const result = applyTaskSignal({
        state: nextTaskState,
        definitionsById: input.taskDefinitionsById,
        signal: taskInput,
      });
      nextTaskState = result.state;
      taskUpdates.push(...result.taskUpdates);
      effects.push(...result.effects);
    }
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

function isTaskRuntimeAction(value: unknown): value is TaskAction {
  if (value == null || typeof value !== "object") {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    (candidate.type === "start" ||
      candidate.type === "complete" ||
      candidate.type === "fail") &&
    typeof candidate.taskId === "string" &&
    typeof candidate.occurredAt === "string"
  );
}

function isTaskRuntimeSignal(value: unknown): value is TaskSignal {
  if (value == null || typeof value !== "object") {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.source === "string" &&
    typeof candidate.occurredAt === "string"
  );
}

function settleRuntimeFollowUp(input: {
  state: RuntimeState;
  followUp: RuntimeResult["followUp"];
  outcome: RuntimeResult["outcome"];
  interactive: RuntimeResult["interactive"];
  context: RuntimeFollowUpContext | undefined;
}): {
  state: RuntimeState;
  characterDefinitions?: RuntimeResult["characterDefinitions"];
  cityStatusById?: RuntimeResult["cityStatusById"];
  buildingStatusById?: RuntimeResult["buildingStatusById"];
  followUp: RuntimeResult["followUp"];
  outcome: RuntimeResult["outcome"];
  interactive: RuntimeResult["interactive"];
} {
  let state = input.state;
  let characterDefinitions: RuntimeResult["characterDefinitions"];
  let cityStatusById: RuntimeResult["cityStatusById"];
  let buildingStatusById: RuntimeResult["buildingStatusById"];
  let followUp = input.followUp;
  let outcome = input.outcome;
  let interactive = input.interactive;
  let handledModernFollowUp = false;

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
    handledModernFollowUp = true;
  }

  if (
    !handledModernFollowUp &&
    (followUp == null || followUp.type === "none") &&
    outcome != null &&
    input.context?.handleOutcome != null
  ) {
    const handled = input.context.handleOutcome({
      state,
      outcome,
    });
    state = handled.state;
    characterDefinitions = handled.characterDefinitions;
    cityStatusById = handled.cityStatusById;
    buildingStatusById = handled.buildingStatusById;
    outcome = null;
  }

  if (
    !handledModernFollowUp &&
    (followUp == null || followUp.type === "none") &&
    outcome == null &&
    interactive != null &&
    interactive.type !== "none" &&
    input.context?.handleInteractive != null
  ) {
    state = input.context.handleInteractive({
      state,
      interactive,
    });
    interactive = { type: "none" };
  }

  return {
    state,
    ...(characterDefinitions === undefined ? {} : { characterDefinitions }),
    ...(cityStatusById === undefined ? {} : { cityStatusById }),
    ...(buildingStatusById === undefined ? {} : { buildingStatusById }),
    followUp,
    outcome,
    interactive,
  };
}
