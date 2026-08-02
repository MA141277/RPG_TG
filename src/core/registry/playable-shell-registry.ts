import type {
  PlayableId,
  PlayableShell,
} from "../contracts/playable-runtime";

export type PlayableShellRegistry = {
  register(shell: PlayableShell): void;
  get(playableId: PlayableId): PlayableShell | null;
};

export function createPlayableShellRegistry(
  shells: PlayableShell[] = []
): PlayableShellRegistry {
  const entries = new Map<PlayableId, PlayableShell>();

  const register = (shell: PlayableShell): void => {
    entries.set(shell.manifest.playableId, shell);
  };

  shells.forEach(register);

  return {
    register,
    get(playableId) {
      return entries.get(playableId) ?? null;
    },
  };
}
