import type { CharacterDefinition } from "../domain/character";

const bundledPortraitModules = import.meta.glob<string>(
  ["../../ui/user/*.png", "../../ui/npc/*.png", "../../ui/family/*.png"],
  { eager: true, query: "?url", import: "default" }
);

const bundledPortraitUrlByKey = Object.fromEntries(
  Object.entries(bundledPortraitModules).map(([path, url]) => [
    normalizeBundledPortraitKey(path),
    url,
  ])
);

export function resolveCharacterPortraitImageUrl(
  character: CharacterDefinition
): string | null {
  const activeVariant =
    character.portraitVariants?.find(
      (variant) => variant.id === character.portraitVariantId
    ) ?? null;

  return (
    resolvePortraitAssetReference(activeVariant?.portraitImageUrl) ??
    resolvePortraitAssetReference(character.portraitImageUrl)
  );
}

export function resolveCharacterAvatarImageUrl(
  character: CharacterDefinition
): string | null {
  const activeVariant =
    character.portraitVariants?.find(
      (variant) => variant.id === character.portraitVariantId
    ) ?? null;

  return (
    resolvePortraitAssetReference(activeVariant?.avatarImageUrl) ??
    resolvePortraitAssetReference(character.avatarImageUrl)
  );
}

function resolvePortraitAssetReference(value: string | null | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();
  if (normalizedValue.length === 0) {
    return null;
  }

  if (/^(data:|https?:|file:|blob:|\/)/.test(normalizedValue)) {
    return normalizedValue;
  }

  return bundledPortraitUrlByKey[normalizeBundledPortraitKey(normalizedValue)] ?? null;
}

function normalizeBundledPortraitKey(value: string): string {
  return value
    .replace(/\\/g, "/")
    .replace(/^.*\/ui\//, "builtin:")
    .replace(/^builtin:\//, "builtin:")
    .trim();
}
