export type ScreenSkinRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ScreenSkinSlice = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type ScreenSkinComponentStyle = {
  id: string;
  assetId?: string;
  imageUrl?: string;
  mode?: "stretch" | "contain" | "cover" | "nine-slice";
  slice?: ScreenSkinSlice;
  textStyleId?: string;
  rect?: ScreenSkinRect;
};

export type ScreenSkinPreset = {
  screenId: string;
  version: number;
  themeId: string;
  components: ScreenSkinComponentStyle[];
};

export function isScreenSkinPreset(value: unknown): value is ScreenSkinPreset {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.screenId === "string" &&
    typeof candidate.version === "number" &&
    typeof candidate.themeId === "string" &&
    Array.isArray(candidate.components)
  );
}
