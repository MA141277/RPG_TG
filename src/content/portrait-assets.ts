import type { CharacterDefinition } from "../domain/character";
import zhuStage20Url from "../../ui/user/20.png?url";
import zhuStage25Url from "../../ui/user/25.png?url";
import zhuStage26Url from "../../ui/user/26.png?url";
import zhuStage29Url from "../../ui/user/29.png?url";
import zhuStage34To39Url from "../../ui/user/34-39.png?url";
import zhuStage40Url from "../../ui/user/40.png?url";

const portraitAssetUrlById: Record<string, string> = {
  "portrait.player": zhuStage20Url,
  "portrait.player.stage.20": zhuStage20Url,
  "portrait.player.stage.25": zhuStage25Url,
  "portrait.player.stage.26": zhuStage26Url,
  "portrait.player.stage.29": zhuStage29Url,
  "portrait.player.stage.34_39": zhuStage34To39Url,
  "portrait.player.stage.40": zhuStage40Url,
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
