import type { CharacterDefinition } from "../domain/character";
import playerPortraitNormalUrl from "../../ui/user/25.png?url";
import playerPortraitAltUrl from "../../ui/user/26.png?url";

const portraitAssetUrlById: Record<string, string> = {
  "portrait.player": playerPortraitNormalUrl,
  "portrait.player.normal": playerPortraitNormalUrl,
  "portrait.player.smile": playerPortraitAltUrl,
};

export function resolveCharacterPortraitImageUrl(
  character: CharacterDefinition
): string | null {
  const activeVariantPortraitId =
    character.portraitVariants?.find(
      (variant) => variant.id === character.portraitVariantId
    )?.portraitId ?? null;

  return (
    (activeVariantPortraitId == null
      ? null
      : portraitAssetUrlById[activeVariantPortraitId]) ??
    portraitAssetUrlById[character.portraitId] ??
    null
  );
}
