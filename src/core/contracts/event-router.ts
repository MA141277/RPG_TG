import type { Effect } from "./effect";
import type { RuntimeResult } from "./runtime-result";
import type { RuntimeState } from "./runtime-state";

export type RuntimeEventKind =
  | "dialogue"
  | "navigation"
  | "menu"
  | "playable"
  | "settlement"
  | "composite"
  | "bridge";

export type RuntimeEventEntity = {
  id: string;
  kind: RuntimeEventKind;
  payload: Record<string, unknown>;
  nextEventId?: string | null;
  emitEventIds?: string[];
  metadata?: {
    title?: string;
    tags?: string[];
  };
};

export interface RuntimeEventRepository {
  resolveById(eventId: string): RuntimeEventEntity | null;
}

export type RuntimeEventRouteHandlerInput = {
  state: RuntimeState;
  event: RuntimeEventEntity;
};

export type RuntimeEventRouteResult = RuntimeResult & {
  event: RuntimeEventEntity;
  effects: Effect[];
  followUpEventIds?: string[];
  [key: string]: unknown;
};

export type RuntimeEventRouteHandlerResult = Omit<
  RuntimeEventRouteResult,
  "event" | "effects" | "followUpEventIds"
> & {
  effects?: Effect[];
  [key: string]: unknown;
};

export type RuntimeEventRouteContext = {
  repository: RuntimeEventRepository;
  handlers: Partial<
    Record<
      RuntimeEventKind,
      (input: RuntimeEventRouteHandlerInput) => RuntimeEventRouteHandlerResult
    >
  >;
};

export type RuntimeEventRouteInput = {
  state: RuntimeState;
  eventId: string;
  context: RuntimeEventRouteContext;
};
