export type InteractiveRuntimeKind =
  | "activity-qte"
  | "city-begging"
  | "story-battle";

export type InteractiveRuntimeSource =
  | { type: "house"; houseId: string }
  | { type: "scene"; sceneId: string }
  | { type: "external"; id: string };

export type ActiveInteractiveRuntimeSession = {
  kind: InteractiveRuntimeKind;
  sessionId: string;
  source: InteractiveRuntimeSource;
};
