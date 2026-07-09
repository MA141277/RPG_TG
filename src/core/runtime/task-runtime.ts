import type {
  TaskAction,
  TaskCondition,
  TaskDefinition,
  TaskInstance,
  TaskRuntimeResult,
  TaskRuntimeState,
  TaskSignal,
  TaskStatus,
  TaskUpdate,
} from "../contracts/task-runtime";

export type TaskDefinitionRegistry = Record<string, TaskDefinition>;

export type TaskRuntimeActionInput = {
  state: TaskRuntimeState;
  definitionsById: TaskDefinitionRegistry;
  action: TaskAction;
};

export type TaskRuntimeSignalInput = {
  state: TaskRuntimeState;
  definitionsById: TaskDefinitionRegistry;
  signal: TaskSignal;
};

export function createEmptyTaskRuntimeState(
  updatedAt: string
): TaskRuntimeState {
  return {
    instancesByTaskId: {},
    completedTaskIds: [],
    failedTaskIds: [],
    updatedAt,
  };
}

export function startTask(input: TaskRuntimeActionInput): TaskRuntimeResult {
  const definition = input.definitionsById[input.action.taskId];
  if (definition == null) {
    return createIgnoredResult(input.state, input.action.taskId, {
      reason: "missing-task-definition",
      occurredAt: input.action.occurredAt,
    });
  }

  const existing = input.state.instancesByTaskId[input.action.taskId];
  if (existing?.status === "active") {
    return createIgnoredResult(input.state, input.action.taskId, {
      previousStatus: "active",
      nextStatus: "active",
      reason: "duplicate-active-task",
      occurredAt: input.action.occurredAt,
    });
  }

  if (
    existing?.status === "completed" ||
    input.state.completedTaskIds.includes(input.action.taskId)
  ) {
    return createIgnoredResult(input.state, input.action.taskId, {
      previousStatus: "completed",
      nextStatus: "completed",
      reason: "completed-is-terminal",
      occurredAt: input.action.occurredAt,
    });
  }

  // failed-is-terminal
  if (
    existing?.status === "failed" ||
    input.state.failedTaskIds.includes(input.action.taskId)
  ) {
    return createIgnoredResult(input.state, input.action.taskId, {
      previousStatus: "failed",
      nextStatus: "failed",
      reason: "failed-is-terminal",
      occurredAt: input.action.occurredAt,
    });
  }

  if (!areConditionsMet(definition.startConditions ?? [], input.state)) {
    return createIgnoredResult(input.state, definition.id, {
      reason: "start-conditions-not-met",
      occurredAt: input.action.occurredAt,
    });
  }

  const instance: TaskInstance = {
    taskId: definition.id,
    status: "active",
    startedAt: input.action.occurredAt,
    updatedAt: input.action.occurredAt,
    progress: createInitialProgress(definition),
    flags: {},
    ...(input.action.source == null ? {} : { source: input.action.source }),
  };
  const nextState = {
    ...input.state,
    instancesByTaskId: {
      ...input.state.instancesByTaskId,
      [definition.id]: instance,
    },
    updatedAt: input.action.occurredAt,
  };

  return {
    state: nextState,
    taskUpdates: [
      {
        taskId: definition.id,
        type: "started",
        previousStatus: "inactive",
        nextStatus: "active",
      },
    ],
    effects: [...(definition.onStartEffects ?? [])],
  };
}

export function applyTaskAction(
  input: TaskRuntimeActionInput
): TaskRuntimeResult {
  if (input.action.type === "start") {
    return startTask(input);
  }

  const instance = input.state.instancesByTaskId[input.action.taskId];
  if (instance == null) {
    return createIgnoredResult(input.state, input.action.taskId, {
      reason: "missing-task-instance",
      occurredAt: input.action.occurredAt,
    });
  }

  if (instance.status === "failed") {
    // failed-is-terminal
    return createIgnoredResult(input.state, input.action.taskId, {
      previousStatus: "failed",
      nextStatus: "failed",
      reason: "failed-is-terminal",
      occurredAt: input.action.occurredAt,
    });
  }

  if (instance.status === "completed") {
    return createIgnoredResult(input.state, input.action.taskId, {
      previousStatus: "completed",
      nextStatus: "completed",
      reason: "completed-is-terminal",
      occurredAt: input.action.occurredAt,
    });
  }

  const definition = input.definitionsById[input.action.taskId];
  if (definition == null) {
    return createIgnoredResult(input.state, input.action.taskId, {
      previousStatus: instance.status,
      nextStatus: instance.status,
      reason: "missing-task-definition",
      occurredAt: input.action.occurredAt,
    });
  }

  if (input.action.type === "complete") {
    return transitionTask({
      state: input.state,
      definition,
      instance,
      nextStatus: "completed",
      occurredAt: input.action.occurredAt,
      updateType: "completed",
      effects: definition.onCompleteEffects ?? [],
    });
  }

  return transitionTask({
    state: input.state,
    definition,
    instance,
    nextStatus: "failed",
    occurredAt: input.action.occurredAt,
    updateType: "failed",
    effects: definition.onFailEffects ?? [],
    ...(input.action.reason == null ? {} : { reason: input.action.reason }),
  });
}

export function applyTaskSignal(
  input: TaskRuntimeSignalInput
): TaskRuntimeResult {
  const state = input.state;
  let nextState = cloneTaskRuntimeState(input.state);
  const taskUpdates: TaskUpdate[] = [];
  const effects: TaskRuntimeResult["effects"] = [];

  for (const instance of Object.values(state.instancesByTaskId)) {
    if (instance.status !== "active") {
      continue;
    }

    const definition = input.definitionsById[instance.taskId];
    if (definition == null) {
      taskUpdates.push({
        taskId: instance.taskId,
        type: "ignored",
        previousStatus: instance.status,
        nextStatus: instance.status,
        reason: "missing-task-definition",
      });
      continue;
    }

    const progressDelta = getProgressDelta(definition, input.signal);
    const hasProgressDelta = Object.keys(progressDelta).length > 0;

    const progressedInstance = hasProgressDelta
      ? applyProgressDelta(instance, progressDelta, input.signal.occurredAt)
      : { ...instance, updatedAt: input.signal.occurredAt };
    if (hasProgressDelta) {
      nextState = replaceTaskInstance(nextState, progressedInstance);
    }

    const failed = isTaskFailed(
      definition,
      progressedInstance,
      nextState,
      input.signal
    );
    if (failed) {
      const failedResult = transitionTask({
        state: nextState,
        definition,
        instance: progressedInstance,
        nextStatus: "failed",
        occurredAt: input.signal.occurredAt,
        updateType: "failed",
        effects: definition.onFailEffects ?? [],
        ...(hasProgressDelta ? { progressDelta } : {}),
        reason: "failure-conditions-met",
      });
      nextState = failedResult.state;
      taskUpdates.push(...failedResult.taskUpdates);
      effects.push(...failedResult.effects);
      continue;
    }

    const completed = isTaskComplete(
      definition,
      progressedInstance,
      nextState,
      input.signal
    );
    if (completed) {
      const completedResult = transitionTask({
        state: nextState,
        definition,
        instance: progressedInstance,
        nextStatus: "completed",
        occurredAt: input.signal.occurredAt,
        updateType: "completed",
        effects: definition.onCompleteEffects ?? [],
        ...(hasProgressDelta ? { progressDelta } : {}),
      });
      nextState = completedResult.state;
      taskUpdates.push(...completedResult.taskUpdates);
      effects.push(...completedResult.effects);
      continue;
    }

    if (hasProgressDelta) {
      taskUpdates.push({
        taskId: instance.taskId,
        type: "progressed",
        previousStatus: "active",
        nextStatus: "active",
        progressDelta,
      });
      effects.push(...(definition.onProgressEffects ?? []));
    }
  }

  return {
    state: {
      ...nextState,
      updatedAt: input.signal.occurredAt,
    },
    taskUpdates,
    effects,
  };
}

function cloneTaskRuntimeState(state: TaskRuntimeState): TaskRuntimeState {
  return {
    instancesByTaskId: Object.fromEntries(
      Object.entries(state.instancesByTaskId).map(([taskId, instance]) => [
        taskId,
        {
          ...instance,
          progress: { ...instance.progress },
          flags: { ...instance.flags },
        },
      ])
    ),
    completedTaskIds: [...state.completedTaskIds],
    failedTaskIds: [...state.failedTaskIds],
    updatedAt: state.updatedAt,
  };
}

function createInitialProgress(
  definition: TaskDefinition
): Record<string, number> {
  return Object.fromEntries(
    definition.objectives.map((objective) => [objective.id, 0])
  );
}

function createIgnoredResult(
  state: TaskRuntimeState,
  taskId: string,
  input: {
    previousStatus?: TaskStatus;
    nextStatus?: TaskStatus;
    reason: string;
    occurredAt: string;
  }
): TaskRuntimeResult {
  return {
    state: {
      ...state,
      updatedAt: input.occurredAt,
    },
    taskUpdates: [
      {
        taskId,
        type: "ignored",
        previousStatus: input.previousStatus ?? "inactive",
        nextStatus: input.nextStatus ?? "inactive",
        reason: input.reason,
      },
    ],
    effects: [],
  };
}

function transitionTask(input: {
  state: TaskRuntimeState;
  definition: TaskDefinition;
  instance: TaskInstance;
  nextStatus: "completed" | "failed";
  occurredAt: string;
  updateType: "completed" | "failed";
  effects: TaskRuntimeResult["effects"];
  progressDelta?: Record<string, number>;
  reason?: string;
}): TaskRuntimeResult {
  const nextInstance: TaskInstance = {
    ...input.instance,
    status: input.nextStatus,
    updatedAt: input.occurredAt,
    ...(input.nextStatus === "completed"
      ? { completedAt: input.occurredAt }
      : { failedAt: input.occurredAt }),
  };
  const nextState = replaceTaskInstance(input.state, nextInstance);

  return {
    state: {
      ...nextState,
      completedTaskIds:
        input.nextStatus === "completed"
          ? appendUnique(nextState.completedTaskIds, input.definition.id)
          : nextState.completedTaskIds,
      failedTaskIds:
        input.nextStatus === "failed"
          ? appendUnique(nextState.failedTaskIds, input.definition.id)
          : nextState.failedTaskIds,
      updatedAt: input.occurredAt,
    },
    taskUpdates: [
      {
        taskId: input.definition.id,
        type: input.updateType,
        previousStatus: input.instance.status,
        nextStatus: input.nextStatus,
        ...(input.progressDelta == null
          ? {}
          : { progressDelta: input.progressDelta }),
        ...(input.reason == null ? {} : { reason: input.reason }),
      },
    ],
    effects: [...input.effects],
  };
}

function replaceTaskInstance(
  state: TaskRuntimeState,
  instance: TaskInstance
): TaskRuntimeState {
  return {
    ...state,
    instancesByTaskId: {
      ...state.instancesByTaskId,
      [instance.taskId]: instance,
    },
    updatedAt: instance.updatedAt,
  };
}

function appendUnique(values: string[], value: string): string[] {
  return values.includes(value) ? values : [...values, value];
}

function getProgressDelta(
  definition: TaskDefinition,
  signal: TaskSignal
): Record<string, number> {
  const amount = getSignalAmount(signal);
  return Object.fromEntries(
    definition.objectives
      .filter((objective) => objective.signalType === signal.type)
      .map((objective) => [objective.id, amount])
  );
}

function getSignalAmount(signal: TaskSignal): number {
  const amount = signal.payload?.["amount"];
  return typeof amount === "number" && Number.isFinite(amount) ? amount : 1;
}

function applyProgressDelta(
  instance: TaskInstance,
  progressDelta: Record<string, number>,
  occurredAt: string
): TaskInstance {
  const progress = { ...instance.progress };
  for (const [objectiveId, amount] of Object.entries(progressDelta)) {
    progress[objectiveId] = (progress[objectiveId] ?? 0) + amount;
  }

  return {
    ...instance,
    progress,
    updatedAt: occurredAt,
  };
}

function isTaskFailed(
  definition: TaskDefinition,
  instance: TaskInstance,
  state: TaskRuntimeState,
  signal: TaskSignal
): boolean {
  if (definition.failureConditions == null) {
    return false;
  }

  return areConditionsMet(
    definition.failureConditions,
    replaceTaskInstance(state, instance),
    signal
  );
}

function isTaskComplete(
  definition: TaskDefinition,
  instance: TaskInstance,
  state: TaskRuntimeState,
  signal: TaskSignal
): boolean {
  if (definition.completionConditions != null) {
    return areConditionsMet(definition.completionConditions, state, signal);
  }

  return definition.objectives.every(
    (objective) => (instance.progress[objective.id] ?? 0) >= objective.target
  );
}

function areConditionsMet(
  conditions: TaskCondition[],
  state: TaskRuntimeState,
  signal?: TaskSignal
): boolean {
  return conditions.every((condition) =>
    evaluateCondition(condition, state, signal)
  );
}

function evaluateCondition(
  condition: TaskCondition,
  state: TaskRuntimeState,
  signal?: TaskSignal
): boolean {
  if (condition.type === "task-status") {
    const instance = state.instancesByTaskId[condition.taskId];
    return (instance?.status ?? "inactive") === condition.status;
  }

  if (condition.type === "flag") {
    return Object.values(state.instancesByTaskId).some(
      (instance) => instance.flags[condition.flag] === condition.value
    );
  }

  if (condition.type === "counter") {
    return Object.values(state.instancesByTaskId).some(
      (instance) => (instance.progress[condition.counterId] ?? 0) >= condition.atLeast
    );
  }

  if (condition.type === "signal") {
    return signal?.type === condition.signalType;
  }

  return signal == null
    ? false
    : getElapsedDays(condition.since, signal.occurredAt) >=
        condition.atLeastDays;
}

function getElapsedDays(start: string, end: string): number {
  const startDate = Date.parse(start);
  const endDate = Date.parse(end);
  if (!Number.isFinite(startDate) || !Number.isFinite(endDate)) {
    return 0;
  }

  return Math.floor((endDate - startDate) / 86_400_000);
}
