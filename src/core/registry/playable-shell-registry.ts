import type { PlayableId, PlayableShell } from "../contracts/playable-runtime";

export type PlayableShellRegistry = {
  register(shell: PlayableShell): void;
  get(playableId: PlayableId): PlayableShell | null;
};

export function createPlayableShellRegistry(): PlayableShellRegistry {
  const entries = new Map<PlayableId, PlayableShell>();

  return {
    register(shell) {
      entries.set(shell.manifest.playableId, shell);
    },
    get(playableId) {
      return entries.get(playableId) ?? null;
    },
  };
}
