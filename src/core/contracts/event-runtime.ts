import type { RuntimeTaskInput } from "./runtime-result";

export type EventRuntimeCandidate = {
  eventId: string;
  priority: number;
  sceneId?: string | null;
  taskInputs?: RuntimeTaskInput[];
};
