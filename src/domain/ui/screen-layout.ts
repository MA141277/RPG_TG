export type ScreenLayoutCanvas = {
  width: number;
  height: number;
};

export type ScreenLayoutRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ScreenLayoutComponentPlacement = {
  id: string;
  rect: ScreenLayoutRect;
  zIndex?: number;
  visible?: boolean;
};

export type ScreenLayoutPreset = {
  screenId: string;
  version: number;
  canvas: ScreenLayoutCanvas;
  components: ScreenLayoutComponentPlacement[];
};

export function isScreenLayoutPreset(
  value: unknown
): value is ScreenLayoutPreset {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.screenId === "string" &&
    typeof candidate.version === "number" &&
    candidate.canvas != null &&
    typeof candidate.canvas === "object" &&
    !Array.isArray(candidate.canvas) &&
    Array.isArray(candidate.components)
  );
}
