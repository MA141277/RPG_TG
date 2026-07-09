import type { Effect } from "./effect";

export type TaskStatus = "inactive" | "active" | "completed" | "failed";

export type TaskDefinition = {
  id: string;
  title: string;
  description?: string;
  initialState?: "inactive" | "active";
  objectives: TaskObjectiveDefinition[];
  startConditions?: TaskCondition[];
  completionConditions?: TaskCondition[];
  failureConditions?: TaskCondition[];
  onStartEffects?: Effect[];
  onProgressEffects?: Effect[];
  onCompleteEffects?: Effect[];
  onFailEffects?: Effect[];
  tags?: string[];
};

export type TaskObjectiveDefinition = {
  id: string;
  description?: string;
  target: number;
  signalType: string;
};

export type TaskCondition =
  | { type: "task-status"; taskId: string; status: TaskStatus }
  | { type: "flag"; flag: string; value: boolean }
  | { type: "counter"; counterId: string; atLeast: number }
  | { type: "signal"; signalType: string }
  | { type: "elapsed-time"; since: string; atLeastDays: number };

export type TaskInstance = {
  taskId: string;
  status: Exclude<TaskStatus, "inactive">;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  failedAt?: string;
  progress: Record<string, number>;
  flags: Record<string, boolean>;
  source?: string;
};

export type TaskRuntimeState = {
  instancesByTaskId: Record<string, TaskInstance>;
  completedTaskIds: string[];
  failedTaskIds: string[];
  updatedAt: string;
};

export type TaskAction =
  | { type: "start"; taskId: string; occurredAt: string; source?: string }
  | { type: "complete"; taskId: string; occurredAt: string; source?: string }
  | {
      type: "fail";
      taskId: string;
      occurredAt: string;
      source?: string;
      reason?: string;
    };

export type TaskSignal = {
  type: string;
  source: string;
  occurredAt: string;
  payload?: Record<string, unknown>;
};

export type TaskUpdate = {
  taskId: string;
  type: "started" | "progressed" | "completed" | "failed" | "ignored";
  previousStatus: TaskStatus;
  nextStatus: TaskStatus;
  progressDelta?: Record<string, number>;
  reason?: string;
};

export type TaskRuntimeResult = {
  state: TaskRuntimeState;
  taskUpdates: TaskUpdate[];
  effects: Effect[];
};
