import type { AppState } from "../app-shell";
import {
  resolveTextEntry,
  resolveTextTemplateEntry,
} from "../content/text-resolution";

export function createHaozhouShortageBeggingRefusalDialogue(input: {
  textEntriesById: Record<string, string>;
}): NonNullable<AppState["locationDialogueState"]> {
  return {
    type: "house-access-refusal",
    speakerCharacterId: "char.kulan_temple_abbot",
    textLines: [
      resolveTextEntry(
        input.textEntriesById,
        "runtime.zhu_yuanzhang.haozhou_shortage.001"
      ),
      resolveTextEntry(
        input.textEntriesById,
        "runtime.zhu_yuanzhang.haozhou_shortage.002"
      ),
    ],
    advanceHintText: resolveTextEntry(
      input.textEntriesById,
      "runtime.zhu_yuanzhang.haozhou_shortage.advance_hint"
    ),
  };
}

export function createBeggingStaminaRefusalDialogue(input: {
  textEntriesById: Record<string, string>;
  requiredStamina: number;
}): NonNullable<AppState["locationDialogueState"]> {
  return {
    type: "house-access-refusal",
    speakerCharacterId: "char.kulan_temple_abbot",
    textLines: [
      resolveTextEntry(
        input.textEntriesById,
        "runtime.zhu_yuanzhang.begging_stamina_refusal.001"
      ),
      resolveTextTemplateEntry(
        input.textEntriesById,
        "runtime.zhu_yuanzhang.begging_stamina_refusal.002",
        { requiredStamina: input.requiredStamina }
      ),
    ],
    advanceHintText: resolveTextEntry(
      input.textEntriesById,
      "runtime.zhu_yuanzhang.begging_stamina_refusal.advance_hint"
    ),
  };
}
