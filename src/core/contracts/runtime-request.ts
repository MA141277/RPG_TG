export type RuntimeRequestFamily = "action" | "tick" | "external";

export type ActionRuntimeRequest = {
  family: "action";
  type: "action";
  actionId: string;
  payload?: Record<string, unknown>;
};

export type TickRuntimeRequest = {
  family: "tick";
  type: "tick";
  tickId: string;
  payload?: Record<string, unknown>;
};

export type ExternalRuntimeRequest = {
  family: "external";
  type: "external";
  eventId: string;
  payload?: Record<string, unknown>;
};

export type RuntimeRequest =
  | ActionRuntimeRequest
  | TickRuntimeRequest
  | ExternalRuntimeRequest;
