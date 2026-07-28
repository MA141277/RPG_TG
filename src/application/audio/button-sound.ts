import type { AppAudioSession } from "./audio-manager";
import { BUILTIN_AUDIO_CUE_IDS, queueAppAudioCue } from "./audio-manager";
import { resolveEnterSoundEffectFromTarget } from "./enter-sound";
import { resolvePachinkoLaunchSoundEffectFromTarget } from "./pachinko-launch-sound";

export class ButtonSoundEffect {
  readonly cueId: string;

  constructor(cueId: string) {
    this.cueId = cueId;
  }

  queue(session: AppAudioSession): AppAudioSession {
    return queueAppAudioCue(session, this.cueId);
  }
}

export type ButtonSoundTone = "light" | "heavy";

export const LIGHT_BUTTON_SOUND = new ButtonSoundEffect(
  BUILTIN_AUDIO_CUE_IDS.uiButtonLight
);

export const HEAVY_BUTTON_SOUND = new ButtonSoundEffect(
  BUILTIN_AUDIO_CUE_IDS.uiButtonHeavy
);

export function resolveButtonSoundEffectByTone(
  tone: string | null | undefined
): ButtonSoundEffect | null {
  if (tone === "light") {
    return LIGHT_BUTTON_SOUND;
  }

  if (tone === "heavy") {
    return HEAVY_BUTTON_SOUND;
  }

  return null;
}

export function resolveButtonSoundEffectFromTarget(target: {
  closest(selector: string): { dataset?: { buttonSound?: string } } | null;
}): ButtonSoundEffect | null {
  return resolveButtonSoundEffectByTone(
    target.closest("[data-button-sound]")?.dataset?.buttonSound
  );
}

export function resolveButtonHoverSoundEffectFromTarget(target: {
  closest(selector: string): { dataset?: { buttonHoverSound?: string } } | null;
}): ButtonSoundEffect | null {
  return resolveButtonSoundEffectByTone(
    target.closest("[data-button-hover-sound]")?.dataset?.buttonHoverSound
  );
}

function isUiClickExplicitlyMuted(target: {
  closest(selector: string): { dataset?: { uiClickSound?: string } } | null;
}): boolean {
  return target.closest("[data-ui-click-sound]")?.dataset?.uiClickSound === "none";
}

export function resolveUiClickCueIdFromTarget(input: {
  target: {
    closest(selector: string):
      | {
          dataset?: {
            buttonSound?: string;
            enterSound?: string;
            pachinkoSound?: string;
            uiClickSound?: string;
          };
        }
      | null;
  };
  allowFallbackUiClick?: boolean;
}): string | null {
  if (isUiClickExplicitlyMuted(input.target)) {
    return null;
  }

  const configuredPachinkoLaunchSoundEffect =
    resolvePachinkoLaunchSoundEffectFromTarget(input.target);
  if (configuredPachinkoLaunchSoundEffect != null) {
    return configuredPachinkoLaunchSoundEffect.cueId;
  }

  const configuredEnterSoundEffect = resolveEnterSoundEffectFromTarget(input.target);
  if (configuredEnterSoundEffect != null) {
    return configuredEnterSoundEffect.cueId;
  }

  const configuredButtonSoundEffect = resolveButtonSoundEffectFromTarget(input.target);
  if (configuredButtonSoundEffect != null) {
    return configuredButtonSoundEffect.cueId;
  }

  return input.allowFallbackUiClick === true ? BUILTIN_AUDIO_CUE_IDS.uiClick : null;
}
