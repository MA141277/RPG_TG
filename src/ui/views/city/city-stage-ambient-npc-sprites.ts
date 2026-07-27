export type CityStageAmbientNpcFacing =
  | "left-up"
  | "right-up"
  | "left-down"
  | "right-down";

const facingBySuffix = {
  左上: "left-up",
  右上: "right-up",
  左下: "left-down",
  右下: "right-down",
} as const satisfies Record<string, CityStageAmbientNpcFacing>;

const npcSpriteModules = import.meta.glob(
  "../../../../ui/npc/city-ambient-walkers/*.png",
  {
    eager: true,
    import: "default",
    query: "?url",
  }
) as Record<string, string>;

function normalizeAssetModulePath(modulePath: string): string {
  const normalized = modulePath.replace(/\\/g, "/");
  const markerIndex = normalized.lastIndexOf("/ui/");

  if (markerIndex >= 0) {
    return normalized.slice(markerIndex + 1);
  }

  return normalized.replace(/^\.?\//, "");
}

type SpriteFacingMap = Partial<Record<CityStageAmbientNpcFacing, string>>;

const spriteUrlsBySetId = new Map<string, SpriteFacingMap>();

for (const [modulePath, url] of Object.entries(npcSpriteModules)) {
  const normalizedPath = normalizeAssetModulePath(modulePath);
  const filenameParts = normalizedPath.split("/");
  const filename = filenameParts[filenameParts.length - 1];
  if (filename == null) {
    continue;
  }

  const match = filename.match(/^(.*?)(左上|右上|左下|右下)\.png$/);
  if (match == null) {
    continue;
  }

  const spriteSetId = match[1];
  const facingSuffix = match[2] as keyof typeof facingBySuffix;
  if (spriteSetId == null) {
    continue;
  }
  const facing = facingBySuffix[facingSuffix];
  if (facing == null) {
    continue;
  }

  const facingMap = spriteUrlsBySetId.get(spriteSetId) ?? {};
  facingMap[facing] = url;
  spriteUrlsBySetId.set(spriteSetId, facingMap);
}

export const CITY_STAGE_AMBIENT_NPC_SPRITE_SET_IDS = [
  ...spriteUrlsBySetId.keys(),
].sort((left, right) => left.localeCompare(right, "zh-Hans-CN"));

export function isAmbientNpcSpriteSetId(value: unknown): value is string {
  return (
    typeof value === "string" && spriteUrlsBySetId.has(value.trim())
  );
}

export function getAmbientNpcSpriteUrl(
  spriteSetId: string,
  facing: CityStageAmbientNpcFacing
): string | null {
  const facingMap = spriteUrlsBySetId.get(spriteSetId);
  if (facingMap == null) {
    return null;
  }

  return facingMap[facing] ?? facingMap["left-down"] ?? null;
}
