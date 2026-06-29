export type RuntimeRequest =
  | { type: "action"; actionId: string; payload?: Record<string, unknown> }
  | { type: "tick"; tickId: string; payload?: Record<string, unknown> }
  | { type: "external"; eventId: string; payload?: Record<string, unknown> };
