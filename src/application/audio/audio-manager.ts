import type { SceneDefinition } from "../../domain/action";
import type { GameState } from "../../domain/game-state";
import { getCurrentSceneAction } from "../story/story-runtime";

type AudioBusId = "bgm" | "sfx" | "ui";

type AudioSourceDefinition =
  | {
      kind: "asset-path";
      assetPath: string;
    }
  | {
      kind: "generated";
      generatorId:
        | "ui.click.basic"
        | "battle.command.basic"
        | "battle.impact.basic"
        | "battle.victory.basic"
        | "activity.pachinko.bounce.basic.1"
        | "activity.pachinko.bounce.basic.2";
    };

type GeneratedAudioGeneratorId = Extract<
  AudioSourceDefinition,
  { kind: "generated" }
>["generatorId"];

type AudioVariationRange = {
  min: number;
  max: number;
};

type AudioVariationChanceRange = AudioVariationRange & {
  chance: number;
};

type AudioCuePlaybackVariation = {
  pitchOffsetRatioRange?: AudioVariationRange;
  volumeOffsetDbRange?: AudioVariationRange;
  startOffsetSeconds?: AudioVariationChanceRange;
  fadeInSeconds?: AudioVariationChanceRange & {
    steps?: number;
  };
};

type AudioLoopSegment = {
  startSeconds: number;
  endSeconds: number;
};

type AudioCueDefinition = {
  id: string;
  bus: AudioBusId;
  loop: boolean;
  defaultVolume: number;
  source: AudioSourceDefinition;
  fallbackSource?: AudioSourceDefinition;
  cooldownMs?: number;
  maxInstances?: number;
  playbackVariation?: AudioCuePlaybackVariation;
  bgmLoopSegment?: AudioLoopSegment;
};

export type AppAudioCommand = {
  commandId: string;
  cueId: string;
};

export type AppAudioOutput = {
  bgmCueId: string | null;
  commands: AppAudioCommand[];
};

export type BattleDemoAudioBridgeCommand = {
  chainId: string;
  phase: "draw" | "release" | "reload" | "fire" | "impact" | "horse-run";
  mode: "play" | "transition" | "stop";
  currentActionFrame: number;
  frameDurationMs: number;
  fadeFrames?: number;
  nextStartFrame?: number;
};

export type AppAudioBgmLayer = {
  ownerKind: "visibility" | "scene" | "playable-battle";
  ownerId: string | null;
  cueId: string;
};

export type AppAudioSession = {
  nextCommandId: number;
  pendingCommands: AppAudioCommand[];
  bgmStack: AppAudioBgmLayer[];
};

type AppAudioOutputInput = {
  appState: {
    gameState: GameState;
  };
  isGameVisible: boolean;
  sceneDefinitionsById?: Record<string, SceneDefinition>;
  session: AppAudioSession;
};

type ManagedAudioElement = {
  paused: boolean;
  loop: boolean;
  preload: string;
  volume: number;
  playbackRate: number;
  currentTime: number;
  src: string;
  preservesPitch?: boolean;
  mozPreservesPitch?: boolean;
  webkitPreservesPitch?: boolean;
  addEventListener?(type: string, listener: (event?: unknown) => void): void;
  load(): void;
  pause(): void;
  play(): Promise<unknown>;
};

type AppAudioController = {
  sync(output: AppAudioOutput): void;
  playCue(cueId: string): void;
  setBgmOverrideCue(cueId: string | null): void;
  playCueWithBgmSuppressed(
    cueId: string,
    options?: {
      fadeOutMs?: number;
    }
  ): void;
  playBattleDemoBridgeMessage(command: BattleDemoAudioBridgeCommand): void;
  unlock(): void;
};

type AppAudioControllerInput = {
  cueDefinitions?: readonly AudioCueDefinition[];
  resolveAssetPath?: (assetPath: string) => string;
  createAudioElement?: () => ManagedAudioElement;
  now?: () => number;
  random?: () => number;
  scheduleTask?: (callback: () => void, delayMs: number) => unknown;
};

type BattleDemoAudioBridgeChainState = {
  generation: number;
  phase: BattleDemoAudioBridgeCommand["phase"];
  cueId: string;
  activePlayer: ManagedAudioElement | null;
};

type BattleAssetVariationMemory = {
  pitchOffsetRatio: number | null;
  volumeOffsetDb: number | null;
};

export const BUILTIN_AUDIO_CUE_IDS = {
  bgmOpening: "bgm.opening",
  bgmInGame: "bgm.in_game",
  bgmBattle: "bgm.battle.default",
  bgmMidsummerDuel: "bgm.midsummer_duel",
  uiClick: "ui.click",
  uiButtonLight: "ui.button.light",
  uiButtonHeavy: "ui.button.heavy",
  uiEnter: "ui.enter",
  uiTroopSelection: "ui.troop.selection",
  uiTroopMutation: "ui.troop.mutation",
  activityPachinkoLaunch: "activity.pachinko.launch",
  activityPachinkoBounce1: "activity.pachinko.bounce.1",
  activityPachinkoBounce2: "activity.pachinko.bounce.2",
  gameMoney: "game.money",
  gameTaskVictory: "game.task.victory",
  gameTaskFailure: "game.task.failure",
  battleSlashHit1: "battle.slash.hit.1",
  battleSlashHit2: "battle.slash.hit.2",
  battleSlashHit3: "battle.slash.hit.3",
  battleSlashMiss: "battle.slash.miss",
  battleBowDraw: "battle.bow.draw",
  battleArrowRelease: "battle.arrow.release",
  battleJump: "battle.jump",
  battleLanding: "battle.landing",
  battleHorseRun: "battle.horse.run",
  battleMusketeerReload: "battle.musketeer.reload",
  battleMusketeerFire: "battle.musketeer.fire",
  battleImpactHit: "battle.impact.hit",
  battleCommand: "battle.command",
  battleImpact: "battle.impact",
  battleVictory: "battle.victory",
} as const;

const BATTLE_DEMO_BRIDGE_CUE_ID_BY_PHASE: Readonly<
  Record<BattleDemoAudioBridgeCommand["phase"], string>
> = {
  draw: BUILTIN_AUDIO_CUE_IDS.battleBowDraw,
  release: BUILTIN_AUDIO_CUE_IDS.battleArrowRelease,
  reload: BUILTIN_AUDIO_CUE_IDS.battleMusketeerReload,
  fire: BUILTIN_AUDIO_CUE_IDS.battleMusketeerFire,
  impact: BUILTIN_AUDIO_CUE_IDS.battleImpactHit,
  "horse-run": BUILTIN_AUDIO_CUE_IDS.battleHorseRun,
};

const STORY_BATTLE_ACTION_CUE_ID_BY_ACTION_ID: Readonly<Record<string, string>> = {
  "player-advance": BUILTIN_AUDIO_CUE_IDS.battleCommand,
  "npc-resolve": BUILTIN_AUDIO_CUE_IDS.battleImpact,
  finish: BUILTIN_AUDIO_CUE_IDS.battleVictory,
  "embedded-victory": BUILTIN_AUDIO_CUE_IDS.battleVictory,
};

const BATTLE_ASSET_PLAYBACK_VARIATION: AudioCuePlaybackVariation = {
  pitchOffsetRatioRange: {
    min: 0.05,
    max: 0.15,
  },
  volumeOffsetDbRange: {
    min: 2,
    max: 3,
  },
  startOffsetSeconds: {
    chance: 0.2,
    min: 0.006,
    max: 0.018,
  },
  fadeInSeconds: {
    chance: 0.2,
    min: 0.012,
    max: 0.024,
    steps: 4,
  },
};

const PACHINKO_BOUNCE_PLAYBACK_VARIATION: AudioCuePlaybackVariation = {
  pitchOffsetRatioRange: {
    min: 0.05,
    max: 0.15,
  },
  volumeOffsetDbRange: {
    min: 2,
    max: 3,
  },
};

const BUILTIN_AUDIO_CUE_DEFINITIONS: readonly AudioCueDefinition[] = [
  {
    id: BUILTIN_AUDIO_CUE_IDS.bgmOpening,
    bus: "bgm",
    loop: true,
    defaultVolume: 0.35,
    source: {
      kind: "asset-path",
      assetPath: "BGM/开局.mp3",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.bgmInGame,
    bus: "bgm",
    loop: true,
    defaultVolume: 0.35,
    source: {
      kind: "asset-path",
      assetPath: "BGM/游戏内.mp3",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.bgmMidsummerDuel,
    bus: "bgm",
    loop: true,
    defaultVolume: 0.35,
    source: {
      kind: "asset-path",
      assetPath: "BGM/游戏内.mp3",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.bgmBattle,
    bus: "bgm",
    loop: true,
    defaultVolume: 0.7,
    bgmLoopSegment: {
      startSeconds: 18,
      endSeconds: 92,
    },
    source: {
      kind: "asset-path",
      assetPath: "audio/battle/battle-bgm.mp3",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.uiClick,
    bus: "ui",
    loop: false,
    defaultVolume: 0.22,
    cooldownMs: 40,
    maxInstances: 2,
    source: {
      kind: "generated",
      generatorId: "ui.click.basic",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.uiButtonLight,
    bus: "ui",
    loop: false,
    defaultVolume: 0.22,
    maxInstances: 10,
    source: {
      kind: "asset-path",
      assetPath: "audio/ui/button-light.mp3",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.uiButtonHeavy,
    bus: "ui",
    loop: false,
    defaultVolume: 0.24,
    maxInstances: 10,
    source: {
      kind: "asset-path",
      assetPath: "audio/ui/button-heavy.mp3",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.uiEnter,
    bus: "ui",
    loop: false,
    defaultVolume: 0.24,
    maxInstances: 10,
    source: {
      kind: "asset-path",
      assetPath: "audio/ui/enter.mp3",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.uiTroopSelection,
    bus: "ui",
    loop: false,
    defaultVolume: 0.54,
    maxInstances: 10,
    source: {
      kind: "asset-path",
      assetPath: "audio/ui/troop-selection.mp3",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.uiTroopMutation,
    bus: "ui",
    loop: false,
    defaultVolume: 0.54,
    maxInstances: 10,
    source: {
      kind: "asset-path",
      assetPath: "audio/ui/troop-mutation.mp3",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.activityPachinkoLaunch,
    bus: "sfx",
    loop: false,
    defaultVolume: 0.28,
    cooldownMs: 25,
    maxInstances: 6,
    source: {
      kind: "asset-path",
      assetPath: "audio/activity/pachinko-launch.mp3",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.activityPachinkoBounce1,
    bus: "sfx",
    loop: false,
    defaultVolume: 0.26,
    maxInstances: 10,
    playbackVariation: PACHINKO_BOUNCE_PLAYBACK_VARIATION,
    source: {
      kind: "asset-path",
      assetPath: "audio/activity/pachinko-bounce-1.mp3",
    },
    fallbackSource: {
      kind: "generated",
      generatorId: "activity.pachinko.bounce.basic.1",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.activityPachinkoBounce2,
    bus: "sfx",
    loop: false,
    defaultVolume: 0.26,
    maxInstances: 10,
    playbackVariation: PACHINKO_BOUNCE_PLAYBACK_VARIATION,
    source: {
      kind: "asset-path",
      assetPath: "audio/activity/pachinko-bounce-2.mp3",
    },
    fallbackSource: {
      kind: "generated",
      generatorId: "activity.pachinko.bounce.basic.2",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.gameMoney,
    bus: "sfx",
    loop: false,
    defaultVolume: 0.28,
    maxInstances: 6,
    source: {
      kind: "asset-path",
      assetPath: "audio/game-events/money.mp3",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.gameTaskVictory,
    bus: "sfx",
    loop: false,
    defaultVolume: 0.28,
    cooldownMs: 60,
    maxInstances: 2,
    source: {
      kind: "asset-path",
      assetPath: "audio/game-events/task-victory.mp3",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.gameTaskFailure,
    bus: "sfx",
    loop: false,
    defaultVolume: 0.28,
    cooldownMs: 60,
    maxInstances: 2,
    source: {
      kind: "asset-path",
      assetPath: "audio/game-events/task-failure.mp3",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.battleSlashHit1,
    bus: "sfx",
    loop: false,
    defaultVolume: 0.28,
    maxInstances: 6,
    playbackVariation: BATTLE_ASSET_PLAYBACK_VARIATION,
    source: {
      kind: "asset-path",
      assetPath: "audio/battle/slash-hit-1.mp3",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.battleSlashHit2,
    bus: "sfx",
    loop: false,
    defaultVolume: 0.28,
    maxInstances: 6,
    playbackVariation: BATTLE_ASSET_PLAYBACK_VARIATION,
    source: {
      kind: "asset-path",
      assetPath: "audio/battle/slash-hit-2.mp3",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.battleSlashHit3,
    bus: "sfx",
    loop: false,
    defaultVolume: 0.28,
    maxInstances: 6,
    playbackVariation: BATTLE_ASSET_PLAYBACK_VARIATION,
    source: {
      kind: "asset-path",
      assetPath: "audio/battle/slash-hit-3.mp3",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.battleSlashMiss,
    bus: "sfx",
    loop: false,
    defaultVolume: 0.24,
    maxInstances: 6,
    playbackVariation: BATTLE_ASSET_PLAYBACK_VARIATION,
    source: {
      kind: "asset-path",
      assetPath: "audio/battle/slash-miss.mp3",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.battleBowDraw,
    bus: "sfx",
    loop: false,
    defaultVolume: 0.26,
    maxInstances: 6,
    playbackVariation: BATTLE_ASSET_PLAYBACK_VARIATION,
    source: {
      kind: "asset-path",
      assetPath: "audio/battle/bow-draw.mp3",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.battleArrowRelease,
    bus: "sfx",
    loop: false,
    defaultVolume: 0.26,
    maxInstances: 6,
    playbackVariation: BATTLE_ASSET_PLAYBACK_VARIATION,
    source: {
      kind: "asset-path",
      assetPath: "audio/battle/arrow-release.mp3",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.battleJump,
    bus: "sfx",
    loop: false,
    defaultVolume: 0.26,
    maxInstances: 6,
    playbackVariation: BATTLE_ASSET_PLAYBACK_VARIATION,
    source: {
      kind: "asset-path",
      assetPath: "audio/battle/jump.mp3",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.battleLanding,
    bus: "sfx",
    loop: false,
    defaultVolume: 0.28,
    maxInstances: 6,
    playbackVariation: BATTLE_ASSET_PLAYBACK_VARIATION,
    source: {
      kind: "asset-path",
      assetPath: "audio/battle/landing.mp3",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.battleHorseRun,
    bus: "sfx",
    loop: false,
    defaultVolume: 0.56,
    maxInstances: 6,
    playbackVariation: BATTLE_ASSET_PLAYBACK_VARIATION,
    source: {
      kind: "asset-path",
      assetPath: "audio/battle/horse-run.mp3",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.battleMusketeerReload,
    bus: "sfx",
    loop: false,
    defaultVolume: 0.26,
    maxInstances: 6,
    playbackVariation: BATTLE_ASSET_PLAYBACK_VARIATION,
    source: {
      kind: "asset-path",
      assetPath: "audio/battle/musketeer-reload.mp3",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.battleMusketeerFire,
    bus: "sfx",
    loop: false,
    defaultVolume: 0.28,
    maxInstances: 6,
    playbackVariation: BATTLE_ASSET_PLAYBACK_VARIATION,
    source: {
      kind: "asset-path",
      assetPath: "audio/battle/musketeer-fire.mp3",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.battleImpactHit,
    bus: "sfx",
    loop: false,
    defaultVolume: 0.3,
    maxInstances: 6,
    playbackVariation: BATTLE_ASSET_PLAYBACK_VARIATION,
    source: {
      kind: "asset-path",
      assetPath: "audio/battle/impact.mp3",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.battleCommand,
    bus: "sfx",
    loop: false,
    defaultVolume: 0.28,
    cooldownMs: 30,
    maxInstances: 2,
    source: {
      kind: "generated",
      generatorId: "battle.command.basic",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.battleImpact,
    bus: "sfx",
    loop: false,
    defaultVolume: 0.3,
    cooldownMs: 45,
    maxInstances: 2,
    source: {
      kind: "generated",
      generatorId: "battle.impact.basic",
    },
  },
  {
    id: BUILTIN_AUDIO_CUE_IDS.battleVictory,
    bus: "sfx",
    loop: false,
    defaultVolume: 0.52,
    cooldownMs: 80,
    maxInstances: 1,
    source: {
      kind: "asset-path",
      assetPath: "audio/battle/battle-victory.mp3",
    },
  },
];

const GENERATED_AUDIO_SOURCE_CACHE = new Map<string, string>();

function createAudioCueRegistry(
  cueDefinitions: readonly AudioCueDefinition[]
): Map<string, AudioCueDefinition> {
  return new Map(cueDefinitions.map((cueDefinition) => [cueDefinition.id, cueDefinition]));
}

function createGeneratedAudioSamples(
  generatorId: GeneratedAudioGeneratorId,
  sampleRate: number
): Int16Array {
  if (generatorId === "battle.command.basic") {
    const sampleCount = Math.floor(sampleRate * 0.05);
    const samples = new Int16Array(sampleCount);
    for (let index = 0; index < sampleCount; index += 1) {
      const progress = index / sampleCount;
      const envelope = Math.max(0, 1 - progress);
      const waveform =
        Math.sin(progress * Math.PI * 26) * 0.7 +
        Math.sin(progress * Math.PI * 52) * 0.3;
      samples[index] = Math.floor(waveform * envelope * 11000);
    }
    return samples;
  }

  if (generatorId === "battle.impact.basic") {
    const sampleCount = Math.floor(sampleRate * 0.07);
    const samples = new Int16Array(sampleCount);
    for (let index = 0; index < sampleCount; index += 1) {
      const progress = index / sampleCount;
      const envelope = Math.max(0, 1 - progress) ** 1.8;
      const waveform =
        Math.sin(progress * Math.PI * 15) * 0.55 +
        Math.sin(progress * Math.PI * 6) * 0.45;
      samples[index] = Math.floor(waveform * envelope * 15000);
    }
    return samples;
  }

  if (generatorId === "battle.victory.basic") {
    const sampleCount = Math.floor(sampleRate * 0.14);
    const samples = new Int16Array(sampleCount);
    for (let index = 0; index < sampleCount; index += 1) {
      const progress = index / sampleCount;
      const envelope = Math.max(0, 1 - progress * 0.75);
      const waveform =
        Math.sin(progress * Math.PI * 10) * 0.45 +
        Math.sin(progress * Math.PI * 15) * 0.35 +
        Math.sin(progress * Math.PI * 21) * 0.2;
      samples[index] = Math.floor(waveform * envelope * 10500);
    }
    return samples;
  }

  if (generatorId === "activity.pachinko.bounce.basic.1") {
    const sampleCount = Math.floor(sampleRate * 0.045);
    const samples = new Int16Array(sampleCount);
    for (let index = 0; index < sampleCount; index += 1) {
      const progress = index / sampleCount;
      const envelope = Math.max(0, 1 - progress) ** 2.4;
      const waveform =
        Math.sin(progress * Math.PI * 42) * 0.72 +
        Math.sin(progress * Math.PI * 78) * 0.28;
      samples[index] = Math.floor(waveform * envelope * 21000);
    }
    return samples;
  }

  if (generatorId === "activity.pachinko.bounce.basic.2") {
    const sampleCount = Math.floor(sampleRate * 0.042);
    const samples = new Int16Array(sampleCount);
    for (let index = 0; index < sampleCount; index += 1) {
      const progress = index / sampleCount;
      const envelope = Math.max(0, 1 - progress) ** 2.1;
      const waveform =
        Math.sin(progress * Math.PI * 36) * 0.5 +
        Math.sin(progress * Math.PI * 68) * 0.35 +
        Math.sin(progress * Math.PI * 96) * 0.15;
      samples[index] = Math.floor(waveform * envelope * 19000);
    }
    return samples;
  }

  const sampleCount = Math.floor(sampleRate * 0.03);
  const samples = new Int16Array(sampleCount);
  for (let index = 0; index < sampleCount; index += 1) {
    const progress = index / sampleCount;
    const envelope = Math.max(0, 1 - progress);
    const waveform = Math.sin(progress * Math.PI * 18);
    samples[index] = Math.floor(waveform * envelope * 12000);
  }

  return samples;
}

function resolveGeneratedAudioSource(
  generatorId: GeneratedAudioGeneratorId
): string {
  const cached = GENERATED_AUDIO_SOURCE_CACHE.get(generatorId);
  if (cached != null) {
    return cached;
  }

  const sampleRate = 8000;
  const samples = createGeneratedAudioSamples(generatorId, sampleRate);

  const byteLength = 44 + samples.length * 2;
  const buffer = new ArrayBuffer(byteLength);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  function writeAscii(offset: number, value: string): void {
    for (let index = 0; index < value.length; index += 1) {
      view.setUint8(offset + index, value.charCodeAt(index));
    }
  }

  writeAscii(0, "RIFF");
  view.setUint32(4, byteLength - 8, true);
  writeAscii(8, "WAVE");
  writeAscii(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeAscii(36, "data");
  view.setUint32(40, samples.length * 2, true);
  for (let index = 0; index < samples.length; index += 1) {
    view.setInt16(44 + index * 2, samples[index]!, true);
  }

  let base64 = "";
  if (typeof btoa === "function") {
    let binary = "";
    for (let index = 0; index < bytes.length; index += 1) {
      binary += String.fromCharCode(bytes[index]!);
    }
    base64 = btoa(binary);
  } else {
    const bufferCtor = (globalThis as {
      Buffer?: {
        from(input: Uint8Array): { toString(encoding: string): string };
      };
    }).Buffer;
    if (bufferCtor == null) {
      throw new Error("Missing base64 encoder for generated audio source.");
    }
    base64 = bufferCtor.from(bytes).toString("base64");
  }

  const dataUrl = `data:audio/wav;base64,${base64}`;
  GENERATED_AUDIO_SOURCE_CACHE.set(generatorId, dataUrl);
  return dataUrl;
}

export function resolveStoryBattleActionCueId(actionId: string): string | null {
  return STORY_BATTLE_ACTION_CUE_ID_BY_ACTION_ID[actionId] ?? null;
}

function resolveAudioSourceUrl(
  sourceDefinition: AudioSourceDefinition,
  resolveAssetPath: (assetPath: string) => string
): string {
  if (sourceDefinition.kind === "generated") {
    return resolveGeneratedAudioSource(sourceDefinition.generatorId);
  }

  return resolveAssetPath(sourceDefinition.assetPath);
}

function resolveCueSourceUrl(
  cueDefinition: AudioCueDefinition,
  resolveAssetPath: (assetPath: string) => string
): string {
  return resolveAudioSourceUrl(cueDefinition.source, resolveAssetPath);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function sampleRange(random: () => number, range: AudioVariationRange): number {
  return range.min + (range.max - range.min) * random();
}

function sampleSignedRange(
  random: () => number,
  range: AudioVariationRange
): number {
  const magnitude = sampleRange(random, range);
  return (random() < 0.5 ? -1 : 1) * magnitude;
}

function sampleOptionalRange(
  random: () => number,
  range: AudioVariationChanceRange | undefined
): number {
  if (range == null || random() >= range.chance) {
    return 0;
  }

  return sampleRange(random, range);
}

function numbersAlmostEqual(left: number, right: number): boolean {
  return Math.abs(left - right) < 1e-9;
}

function avoidImmediateRepeat(
  value: number,
  previous: number | null
): number {
  if (previous == null || !numbersAlmostEqual(value, previous)) {
    return value;
  }

  if (!numbersAlmostEqual(value, 0)) {
    return -value;
  }

  return value;
}

function disableAudioPitchPreservation(audio: ManagedAudioElement): void {
  if ("preservesPitch" in audio) {
    audio.preservesPitch = false;
  }
  if ("mozPreservesPitch" in audio) {
    audio.mozPreservesPitch = false;
  }
  if ("webkitPreservesPitch" in audio) {
    audio.webkitPreservesPitch = false;
  }
}

function applyOneShotCuePlaybackVariation(
  audio: ManagedAudioElement,
  cueDefinition: AudioCueDefinition,
  random: () => number,
  scheduleTask: (callback: () => void, delayMs: number) => unknown,
  battleAssetVariationMemory?: BattleAssetVariationMemory
): void {
  const variation = cueDefinition.playbackVariation;
  if (variation == null) {
    audio.volume = cueDefinition.defaultVolume;
    return;
  }

  let targetVolume = cueDefinition.defaultVolume;
  if (variation.pitchOffsetRatioRange != null) {
    const sampledPitchOffsetRatio = sampleSignedRange(
      random,
      variation.pitchOffsetRatioRange
    );
    const pitchOffsetRatio = avoidImmediateRepeat(
      sampledPitchOffsetRatio,
      battleAssetVariationMemory?.pitchOffsetRatio ?? null
    );
    if (battleAssetVariationMemory != null) {
      battleAssetVariationMemory.pitchOffsetRatio = pitchOffsetRatio;
    }
    audio.playbackRate = clamp(1 + pitchOffsetRatio, 0.5, 4);
    disableAudioPitchPreservation(audio);
  }

  if (variation.volumeOffsetDbRange != null) {
    const sampledVolumeOffsetDb = sampleSignedRange(
      random,
      variation.volumeOffsetDbRange
    );
    const volumeOffsetDb = avoidImmediateRepeat(
      sampledVolumeOffsetDb,
      battleAssetVariationMemory?.volumeOffsetDb ?? null
    );
    if (battleAssetVariationMemory != null) {
      battleAssetVariationMemory.volumeOffsetDb = volumeOffsetDb;
    }
    targetVolume = clamp(
      cueDefinition.defaultVolume * 10 ** (volumeOffsetDb / 20),
      0,
      1
    );
  }

  const startOffsetSeconds = sampleOptionalRange(
    random,
    variation.startOffsetSeconds
  );
  if (startOffsetSeconds > 0) {
    try {
      audio.currentTime = startOffsetSeconds;
    } catch {
      audio.currentTime = 0;
    }
  }

  const fadeInSeconds = sampleOptionalRange(random, variation.fadeInSeconds);
  const fadeInSteps = variation.fadeInSeconds?.steps ?? 4;
  if (fadeInSeconds > 0 && fadeInSteps > 0) {
    audio.volume = 0;
    for (let step = 1; step <= fadeInSteps; step += 1) {
      const nextVolume = targetVolume * (step / fadeInSteps);
      const delayMs = Math.round((fadeInSeconds * 1000 * step) / fadeInSteps);
      scheduleTask(() => {
        audio.volume = nextVolume;
      }, delayMs);
    }
    return;
  }

  audio.volume = targetVolume;
}

function playManagedAudio(audio: ManagedAudioElement): void {
  void audio.play().catch(() => {
    // Browser autoplay policy may defer playback until the next user gesture.
  });
}

export function createAppAudioSession(): AppAudioSession {
  return {
    nextCommandId: 1,
    pendingCommands: [],
    bgmStack: [],
  };
}

export function queueAppAudioCue(
  session: AppAudioSession,
  cueId: string
): AppAudioSession {
  return {
    nextCommandId: session.nextCommandId + 1,
    pendingCommands: [
      ...session.pendingCommands,
      {
        commandId: `audio-command-${session.nextCommandId}`,
        cueId,
      },
    ],
    bgmStack: session.bgmStack,
  };
}

function isBattlePlayableActive(state: GameState): boolean {
  return (
    state.runtime.playableSession?.status === "active" &&
    state.runtime.playableSession.playableId === "story-battle"
  );
}

function isEmbeddedBattleDemoActive(state: GameState): boolean {
  return (
    state.storyBattle?.demoScenarioId != null &&
    state.storyBattle.phase === "embedded-running"
  );
}

function createBgmStack(input: AppAudioOutputInput): AppAudioBgmLayer[] {
  if (!input.isGameVisible) {
    return [
      {
        ownerKind: "visibility",
        ownerId: "hidden",
        cueId: BUILTIN_AUDIO_CUE_IDS.bgmOpening,
      },
    ];
  }

  const stack: AppAudioBgmLayer[] = [
    {
      ownerKind: "visibility",
      ownerId: "visible",
      cueId: BUILTIN_AUDIO_CUE_IDS.bgmInGame,
    },
  ];

  const currentAction = getCurrentSceneAction(
    input.appState.gameState,
    input.sceneDefinitionsById ?? {}
  );
  if (currentAction?.type === "music") {
    stack.push({
      ownerKind: "scene",
      ownerId: input.appState.gameState.scene.activeSceneId,
      cueId: currentAction.musicId,
    });
  }

  if (
    !isEmbeddedBattleDemoActive(input.appState.gameState) &&
    (
      input.appState.gameState.ui.currentView === "battle" ||
      isBattlePlayableActive(input.appState.gameState)
    )
  ) {
    stack.push({
      ownerKind: "playable-battle",
      ownerId: input.appState.gameState.runtime.playableSession?.sessionId ?? null,
      cueId: BUILTIN_AUDIO_CUE_IDS.bgmBattle,
    });
  }

  return stack;
}

export function createAppAudioOutput(input: AppAudioOutputInput): {
  output: AppAudioOutput;
  session: AppAudioSession;
} {
  const nextBgmStack = createBgmStack(input);
  const nextBgmCueId = nextBgmStack[nextBgmStack.length - 1]?.cueId ?? null;

  return {
    output: {
      bgmCueId: nextBgmCueId,
      commands: input.session.pendingCommands,
    },
    session: {
      nextCommandId: input.session.nextCommandId,
      pendingCommands: [],
      bgmStack: nextBgmStack,
    },
  };
}

export function createAppAudioController(
  input: AppAudioControllerInput = {}
): AppAudioController {
  const cueRegistry = createAudioCueRegistry(
    input.cueDefinitions ?? BUILTIN_AUDIO_CUE_DEFINITIONS
  );
  const resolveAssetPath =
    input.resolveAssetPath ?? ((assetPath: string) => assetPath);
  const createAudioElement =
    input.createAudioElement ?? (() => new Audio());
  const now = input.now ?? (() => Date.now());
  const random = input.random ?? (() => Math.random());
  const scheduleTask =
    input.scheduleTask ??
    ((callback: () => void, delayMs: number) => setTimeout(callback, delayMs));

  let bgmPlayer: ManagedAudioElement | null = null;
  let activeBgmCueId: string | null = null;
  let requestedBgmCueId: string | null = null;
  let bgmOverrideCueId: string | null = null;
  let isBgmSyncSuppressed = false;
  let bgmGeneration = 0;
  const consumedCommandIds = new Set<string>();
  const lastPlayedAtByCueId = new Map<string, number>();
  const activeOneShotPlayersByCueId = new Map<string, ManagedAudioElement[]>();
  const battleAssetVariationMemory: BattleAssetVariationMemory = {
    pitchOffsetRatio: null,
    volumeOffsetDb: null,
  };
  const battleDemoBridgeChains = new Map<
    string,
    BattleDemoAudioBridgeChainState
  >();

  function shouldTrackBattleAssetVariation(
    cueDefinition: AudioCueDefinition
  ): boolean {
    return (
      cueDefinition.bus === "sfx" &&
      cueDefinition.source.kind === "asset-path" &&
      cueDefinition.id.startsWith("battle.") &&
      cueDefinition.playbackVariation != null
    );
  }

  function shouldAllowUnlimitedBattleOverlap(
    cueDefinition: AudioCueDefinition
  ): boolean {
    return cueDefinition.bus === "sfx" && cueDefinition.id.startsWith("battle.");
  }

  function isBgmGenerationCurrent(generation: number): boolean {
    return bgmGeneration === generation;
  }

  function scheduleBgmLoopSegment(
    cueDefinition: AudioCueDefinition,
    generation: number
  ): void {
    const loopSegment = cueDefinition.bgmLoopSegment;
    if (bgmPlayer == null || loopSegment == null) {
      return;
    }

    const fadeDurationMs = 200;
    const fadeSteps = 4;
    const loopDurationMs = Math.max(
      10,
      Math.round((loopSegment.endSeconds - loopSegment.startSeconds) * 1000)
    );

    const scheduleLoopCheck = (delayMs: number) => {
      const nextDelayMs =
        delayMs > fadeDurationMs ? delayMs - fadeDurationMs : 10;
      scheduleTask(runLoopSegment, Math.max(10, nextDelayMs));
    };

    const runLoopSegment = () => {
      if (
        bgmPlayer == null ||
        !isBgmGenerationCurrent(generation) ||
        activeBgmCueId !== cueDefinition.id
      ) {
        return;
      }

      if (bgmPlayer.paused) {
        scheduleTask(runLoopSegment, 50);
        return;
      }

      const remainingMs = Math.round(
        (loopSegment.endSeconds - bgmPlayer.currentTime) * 1000
      );
      if (remainingMs > fadeDurationMs) {
        scheduleLoopCheck(remainingMs);
        return;
      }

      const startVolume = clamp(
        bgmPlayer.volume,
        0,
        cueDefinition.defaultVolume
      );

      for (let step = 1; step <= fadeSteps; step += 1) {
        const delayMsOut = Math.round((fadeDurationMs * step) / fadeSteps);
        scheduleTask(() => {
          if (
            bgmPlayer == null ||
            !isBgmGenerationCurrent(generation) ||
            activeBgmCueId !== cueDefinition.id ||
            bgmPlayer.paused
          ) {
            return;
          }
          bgmPlayer.volume = clamp(
            startVolume * (1 - step / fadeSteps),
            0,
            cueDefinition.defaultVolume
          );
        }, delayMsOut);
      }

      scheduleTask(() => {
        if (
          bgmPlayer == null ||
          !isBgmGenerationCurrent(generation) ||
          activeBgmCueId !== cueDefinition.id
        ) {
          return;
        }
        bgmPlayer.currentTime = loopSegment.startSeconds;
        bgmPlayer.volume = 0;
        playManagedAudio(bgmPlayer);
      }, fadeDurationMs);

      for (let step = 1; step <= fadeSteps; step += 1) {
        const delayMsIn =
          fadeDurationMs + Math.round((fadeDurationMs * step) / fadeSteps);
        scheduleTask(() => {
          if (
            bgmPlayer == null ||
            !isBgmGenerationCurrent(generation) ||
            activeBgmCueId !== cueDefinition.id
          ) {
            return;
          }
          bgmPlayer.volume = clamp(
            cueDefinition.defaultVolume * (step / fadeSteps),
            0,
            cueDefinition.defaultVolume
          );
        }, delayMsIn);
      }

      scheduleLoopCheck(loopDurationMs + fadeDurationMs);
    };

    scheduleLoopCheck(
      Math.round((loopSegment.endSeconds - bgmPlayer.currentTime) * 1000)
    );
  }

  function syncBgmCue(nextCueId: string | null): void {
    if (nextCueId === activeBgmCueId) {
      if (nextCueId != null && bgmPlayer != null) {
        const cueDefinition = cueRegistry.get(nextCueId);
        if (cueDefinition != null) {
          bgmPlayer.loop =
            cueDefinition.loop && cueDefinition.bgmLoopSegment == null;
          bgmPlayer.volume = cueDefinition.defaultVolume;
        }
      }
      if (bgmPlayer != null && bgmPlayer.paused) {
        playManagedAudio(bgmPlayer);
      }
      return;
    }

    activeBgmCueId = nextCueId;
    const generation = ++bgmGeneration;
    if (bgmPlayer == null) {
      bgmPlayer = createAudioElement();
      bgmPlayer.preload = "auto";
    }

    if (nextCueId == null) {
      bgmPlayer.pause();
      return;
    }

    const cueDefinition = cueRegistry.get(nextCueId);
    if (cueDefinition == null) {
      return;
    }

    const nextSourceUrl = resolveCueSourceUrl(cueDefinition, resolveAssetPath);
    if (bgmPlayer.src !== nextSourceUrl) {
      bgmPlayer.pause();
      bgmPlayer.src = nextSourceUrl;
      bgmPlayer.currentTime = 0;
      bgmPlayer.load();
    }

    bgmPlayer.loop = cueDefinition.loop && cueDefinition.bgmLoopSegment == null;
    bgmPlayer.volume = cueDefinition.defaultVolume;
    playManagedAudio(bgmPlayer);
    scheduleBgmLoopSegment(cueDefinition, generation);
  }

  function syncRequestedBgmCue(): void {
    if (isBgmSyncSuppressed) {
      return;
    }

    syncBgmCue(bgmOverrideCueId ?? requestedBgmCueId);
  }

  function setBgmOverrideCue(cueId: string | null): void {
    bgmOverrideCueId = cueId;
    syncRequestedBgmCue();
  }

  function playCueWithBgmSuppressed(
    cueId: string,
    options: {
      fadeOutMs?: number;
    } = {}
  ): void {
    bgmOverrideCueId = null;
    isBgmSyncSuppressed = true;
    const generation = ++bgmGeneration;
    const fadeOutMs = Math.max(0, Math.round(options.fadeOutMs ?? 0));

    const resumeRequestedCue = () => {
      if (!isBgmGenerationCurrent(generation)) {
        return;
      }

      isBgmSyncSuppressed = false;
      activeBgmCueId = null;
      syncRequestedBgmCue();
    };

    const monitorCueEnd = (player: ManagedAudioElement) => {
      scheduleTask(() => {
        if (!isBgmGenerationCurrent(generation)) {
          return;
        }
        if (!player.paused) {
          monitorCueEnd(player);
          return;
        }
        resumeRequestedCue();
      }, 50);
    };

    const startCue = () => {
      if (!isBgmGenerationCurrent(generation)) {
        return;
      }

      const player = playOneShotCue(cueId);
      if (player == null) {
        resumeRequestedCue();
        return;
      }

      monitorCueEnd(player);
    };

    if (bgmPlayer == null || bgmPlayer.paused) {
      startCue();
      return;
    }

    const currentVolume = bgmPlayer.volume;
    if (fadeOutMs === 0) {
      bgmPlayer.pause();
      startCue();
      return;
    }

    const fadeSteps = 4;
    for (let step = 1; step <= fadeSteps; step += 1) {
      const nextVolume = clamp(
        currentVolume * (1 - step / fadeSteps),
        0,
        currentVolume
      );
      const delayMs = Math.round((fadeOutMs * step) / fadeSteps);
      scheduleTask(() => {
        if (
          bgmPlayer == null ||
          !isBgmGenerationCurrent(generation) ||
          bgmPlayer.paused
        ) {
          return;
        }
        bgmPlayer.volume = nextVolume;
        if (step === fadeSteps) {
          bgmPlayer.pause();
        }
      }, delayMs);
    }

    scheduleTask(startCue, fadeOutMs);
  }

  function playOneShotCue(cueId: string): ManagedAudioElement | null {
    const cueDefinition = cueRegistry.get(cueId);
    if (cueDefinition == null || cueDefinition.loop) {
      return null;
    }

    const currentTimeMs = now();
    const lastPlayedAt = lastPlayedAtByCueId.get(cueId);
    if (
      cueDefinition.cooldownMs != null &&
      lastPlayedAt != null &&
      currentTimeMs - lastPlayedAt < cueDefinition.cooldownMs
    ) {
      return null;
    }

    const activePlayers =
      activeOneShotPlayersByCueId
        .get(cueId)
        ?.filter((player) => !player.paused) ?? [];
    const maxInstances = shouldAllowUnlimitedBattleOverlap(cueDefinition)
      ? Number.POSITIVE_INFINITY
      : cueDefinition.maxInstances ?? Number.POSITIVE_INFINITY;
    if (activePlayers.length >= maxInstances) {
      return null;
    }

    const player = createAudioElement();
    const trackBattleVariation = shouldTrackBattleAssetVariation(cueDefinition)
      ? battleAssetVariationMemory
      : undefined;
    const primarySourceUrl = resolveCueSourceUrl(cueDefinition, resolveAssetPath);
    const fallbackSourceUrl =
      cueDefinition.fallbackSource == null
        ? null
        : resolveAudioSourceUrl(cueDefinition.fallbackSource, resolveAssetPath);
    let isUsingFallbackSource = false;

    const playResolvedSource = (sourceUrl: string): void => {
      player.preload = "auto";
      player.loop = false;
      player.src = sourceUrl;
      player.currentTime = 0;
      player.load();
      applyOneShotCuePlaybackVariation(
        player,
        cueDefinition,
        random,
        scheduleTask,
        trackBattleVariation
      );
      playManagedAudio(player);
    };

    if (fallbackSourceUrl != null && typeof player.addEventListener === "function") {
      player.addEventListener("error", () => {
        if (isUsingFallbackSource) {
          return;
        }
        isUsingFallbackSource = true;
        playResolvedSource(fallbackSourceUrl);
      });
    }

    activeOneShotPlayersByCueId.set(cueId, [...activePlayers, player]);
    lastPlayedAtByCueId.set(cueId, currentTimeMs);
    playResolvedSource(primarySourceUrl);
    return player;
  }

  function getBattleDemoBridgeGeneration(chainId: string): number {
    return battleDemoBridgeChains.get(chainId)?.generation ?? 0;
  }

  function isBattleDemoBridgeGenerationCurrent(
    chainId: string,
    generation: number
  ): boolean {
    return battleDemoBridgeChains.get(chainId)?.generation === generation;
  }

  function playBattleDemoBridgeMessage(
    command: BattleDemoAudioBridgeCommand
  ): void {
    const nextCueId = BATTLE_DEMO_BRIDGE_CUE_ID_BY_PHASE[command.phase];
    const currentChain = battleDemoBridgeChains.get(command.chainId) ?? null;
    const currentPlayer = currentChain?.activePlayer ?? null;
    const nextGeneration = getBattleDemoBridgeGeneration(command.chainId) + 1;

    if (command.mode === "play") {
      if (currentPlayer != null && !currentPlayer.paused) {
        currentPlayer.pause();
      }
      const nextPlayer = playOneShotCue(nextCueId);
      if (nextPlayer == null) {
        battleDemoBridgeChains.delete(command.chainId);
        return;
      }
      battleDemoBridgeChains.set(command.chainId, {
        generation: nextGeneration,
        phase: command.phase,
        cueId: nextCueId,
        activePlayer: nextPlayer,
      });
      return;
    }

    battleDemoBridgeChains.set(command.chainId, {
      generation: nextGeneration,
      phase: currentChain?.phase ?? command.phase,
      cueId: currentChain?.cueId ?? nextCueId,
      activePlayer: currentPlayer,
    });

    const fadeSteps = Math.max(1, Math.round(command.fadeFrames ?? 4));
    const fadeDurationMs =
      command.mode === "stop"
        ? Math.max(
            0,
            Math.round(fadeSteps * Math.max(0, command.frameDurationMs))
          )
        : Math.max(
            0,
            Math.round(
              Math.max(
                0,
                (command.nextStartFrame ?? command.currentActionFrame) -
                  command.currentActionFrame
              ) * Math.max(0, command.frameDurationMs)
            )
          );
    const currentVolume =
      currentPlayer != null && !currentPlayer.paused ? currentPlayer.volume : 0;

    const startNextCue = () => {
      if (
        !isBattleDemoBridgeGenerationCurrent(command.chainId, nextGeneration)
      ) {
        return;
      }
      const nextPlayer = playOneShotCue(nextCueId);
      if (nextPlayer == null) {
        battleDemoBridgeChains.delete(command.chainId);
        return;
      }
      battleDemoBridgeChains.set(command.chainId, {
        generation: nextGeneration,
        phase: command.phase,
        cueId: nextCueId,
        activePlayer: nextPlayer,
      });
    };

    if (currentPlayer != null && !currentPlayer.paused && fadeDurationMs > 0) {
      for (let step = 1; step <= fadeSteps; step += 1) {
        const nextVolume = clamp(
          currentVolume * (1 - step / fadeSteps),
          0,
          currentVolume
        );
        const delayMs = Math.round((fadeDurationMs * step) / fadeSteps);
        scheduleTask(() => {
          if (
            !isBattleDemoBridgeGenerationCurrent(command.chainId, nextGeneration)
          ) {
            return;
          }
          if (currentPlayer.paused) {
            return;
          }
          currentPlayer.volume = nextVolume;
          if (step === fadeSteps) {
            currentPlayer.pause();
          }
        }, delayMs);
      }
    } else if (
      currentPlayer != null &&
      !currentPlayer.paused &&
      fadeDurationMs === 0
    ) {
      currentPlayer.pause();
    }

    if (command.mode === "stop") {
      if (fadeDurationMs === 0) {
        battleDemoBridgeChains.delete(command.chainId);
        return;
      }

      scheduleTask(() => {
        if (
          !isBattleDemoBridgeGenerationCurrent(command.chainId, nextGeneration)
        ) {
          return;
        }
        battleDemoBridgeChains.delete(command.chainId);
      }, fadeDurationMs);
      return;
    }

    if (fadeDurationMs === 0) {
      startNextCue();
      return;
    }

    scheduleTask(startNextCue, fadeDurationMs);
  }

  return {
    sync(output: AppAudioOutput): void {
      requestedBgmCueId = output.bgmCueId;
      syncRequestedBgmCue();
      for (const command of output.commands) {
        if (consumedCommandIds.has(command.commandId)) {
          continue;
        }
        consumedCommandIds.add(command.commandId);
        playOneShotCue(command.cueId);
      }
    },
    playCue(cueId: string): void {
      playOneShotCue(cueId);
    },
    setBgmOverrideCue(cueId: string | null): void {
      setBgmOverrideCue(cueId);
    },
    playCueWithBgmSuppressed(
      cueId: string,
      options?: {
        fadeOutMs?: number;
      }
    ): void {
      playCueWithBgmSuppressed(cueId, options);
    },
    playBattleDemoBridgeMessage(command: BattleDemoAudioBridgeCommand): void {
      playBattleDemoBridgeMessage(command);
    },
    unlock(): void {
      if (!isBgmSyncSuppressed && bgmPlayer != null && bgmPlayer.paused) {
        playManagedAudio(bgmPlayer);
      }
    },
  };
}
