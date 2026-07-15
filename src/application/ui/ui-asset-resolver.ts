export type UiAssetAliasLayers = {
  builtin: Record<string, string> | undefined;
  pack: Record<string, string> | undefined;
  mod: Record<string, string> | undefined;
  user: Record<string, string> | undefined;
};

export type ResolvedUiAssetAlias = {
  alias: string;
  url: string;
};

export function resolveUiAssetAlias(
  alias: string,
  layers: UiAssetAliasLayers
): ResolvedUiAssetAlias | null {
  const url =
    layers.user?.[alias] ??
    layers.mod?.[alias] ??
    layers.pack?.[alias] ??
    layers.builtin?.[alias] ??
    null;

  return url == null ? null : { alias, url };
}
