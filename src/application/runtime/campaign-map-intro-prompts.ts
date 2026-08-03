import { resolveTextEntry } from "../content/text-resolution";

export function resolveInitialCampaignMapIntroTitle(input: {
  textEntriesById: Record<string, string>;
}): string {
  return resolveTextEntry(
    input.textEntriesById,
    "runtime.zhu_yuanzhang.chapter_intro.huai_xi_begging"
  );
}
