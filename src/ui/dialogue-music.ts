export type DialogueMusicCue = {
  musicId: string;
  loop: boolean;
};

export type DialogueMusicAudioPlayer = {
  src: string;
  loop: boolean;
  currentTime: number;
  paused: boolean;
  pause(): void;
  load(): void;
  play(): Promise<unknown> | void;
};

export type DialogueMusicPlaybackState = "active" | "inactive" | "unresolved";

export function readDialogueMusicCue(
  root: ParentNode
): DialogueMusicCue | null {
  const cueElement = root.querySelector<HTMLElement>(
    '[data-dialogue-view="music"][data-dialogue-music-id]'
  );
  if (cueElement == null) {
    return null;
  }

  const musicId = cueElement.dataset.dialogueMusicId?.trim() ?? "";
  if (musicId.length === 0) {
    return null;
  }

  return {
    musicId,
    loop: cueElement.dataset.dialogueMusicLoop === "true",
  };
}

export function syncDialogueMusicPlayer(input: {
  root: ParentNode;
  player: DialogueMusicAudioPlayer;
  resolveSourceUrl(musicId: string): string | null;
}): DialogueMusicPlaybackState {
  const cue = readDialogueMusicCue(input.root);
  if (cue == null) {
    stopDialogueMusicPlayer(input.player);
    return "inactive";
  }

  const sourceUrl = input.resolveSourceUrl(cue.musicId);
  if (sourceUrl == null) {
    stopDialogueMusicPlayer(input.player);
    return "unresolved";
  }

  const shouldReload =
    input.player.src !== sourceUrl || input.player.loop !== cue.loop;
  if (shouldReload) {
    input.player.pause();
    input.player.src = sourceUrl;
    input.player.loop = cue.loop;
    input.player.currentTime = 0;
    input.player.load();
  }

  if (shouldReload || input.player.paused) {
    const playbackResult = input.player.play();
    if (
      playbackResult != null &&
      typeof (playbackResult as Promise<unknown>).catch === "function"
    ) {
      void (playbackResult as Promise<unknown>).catch(() => {
        // Browser autoplay policy may defer playback until the next user gesture.
      });
    }
  }

  return "active";
}

function stopDialogueMusicPlayer(player: DialogueMusicAudioPlayer): void {
  if (player.paused && player.src.length === 0 && player.currentTime === 0) {
    return;
  }

  player.pause();
  player.currentTime = 0;

  if (player.src.length > 0) {
    player.src = "";
    player.load();
  }
}
