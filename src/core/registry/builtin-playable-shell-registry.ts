const builtinPlayableShellIds = new Set([
  "activity-qte",
  "city-begging",
  "grain-accounting",
  "medicine-compounding",
  "temple-copy-scripture",
]);

export const builtinPlayableShellRegistry = {
  get(playableId: string) {
    return builtinPlayableShellIds.has(playableId)
      ? { playableId }
      : null;
  },
};
