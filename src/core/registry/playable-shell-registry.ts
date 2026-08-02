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
  const shellsByPlayableId = new Map<PlayableId, PlayableShell>();

  const register = (shell: PlayableShell): void => {
    shellsByPlayableId.set(shell.manifest.playableId, shell);
  };

  shells.forEach(register);

  return {
    register,
    get(playableId) {
      return shellsByPlayableId.get(playableId) ?? null;
    },
  };
}
