import { BUILTIN_AUDIO_CUE_IDS } from "./audio-manager";

export class PachinkoCollisionSoundEffect {
  readonly cueIds: readonly string[];

  constructor(cueIds: readonly string[]) {
    this.cueIds = cueIds;
  }

  pickCueId(random: () => number = Math.random): string {
    const index = Math.min(
      this.cueIds.length - 1,
      Math.floor(random() * this.cueIds.length)
    );
    const cueId = this.cueIds[Math.max(0, index)];
    if (cueId == null) {
      throw new Error("PachinkoCollisionSoundEffect requires at least one cue id");
    }
    return cueId;
  }

  play(
    target: { playCue(cueId: string): void },
    random: () => number = Math.random
  ): string {
    const cueId = this.pickCueId(random);
    target.playCue(cueId);
    return cueId;
  }
}

export const PACHINKO_COLLISION_SOUND = new PachinkoCollisionSoundEffect([
  BUILTIN_AUDIO_CUE_IDS.activityPachinkoBounce1,
  BUILTIN_AUDIO_CUE_IDS.activityPachinkoBounce2,
]);
