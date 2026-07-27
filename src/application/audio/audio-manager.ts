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
        | "battle.victory.basic";
    };

type GeneratedAudioGeneratorId = Extract<
  AudioSourceDefinition,
  { kind: "generated" }
>["generatorId"];

type AudioCueDefinition = {
  id: string;
  bus: AudioBusId;
  loop: boolean;
  defaultVolume: number;
  source: AudioSourceDefinition;
  cooldownMs?: number;
  maxInstances?: number;
};

export type AppAudioCommand = {
  commandId: string;
  cueId: string;
};

export type AppAudioOutput = {
  bgmCueId: string | null;
  commands: AppAudioCommand[];
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
  currentTime: number;
  src: string;
  load(): void;
  pause(): void;
  play(): Promise<unknown>;
};

type AppAudioController = {
  sync(output: AppAudioOutput): void;
  unlock(): void;
};

type AppAudioControllerInput = {
  cueDefinitions?: readonly AudioCueDefinition[];
  resolveAssetPath?: (assetPath: string) => string;
  createAudioElement?: () => ManagedAudioElement;
  now?: () => number;
};

export const BUILTIN_AUDIO_CUE_IDS = {
  bgmOpening: "bgm.opening",
  bgmInGame: "bgm.in_game",
  bgmBattle: "bgm.battle.default",
  bgmMidsummerDuel: "bgm.midsummer_duel",
  uiClick: "ui.click",
  uiButtonLight: "ui.button.light",
  uiButtonHeavy: "ui.button.heavy",
  battleCommand: "battle.command",
  battleImpact: "battle.impact",
  battleVictory: "battle.victory",
} as const;

const STORY_BATTLE_ACTION_CUE_ID_BY_ACTION_ID: Readonly<Record<string, string>> = {
  "player-advance": BUILTIN_AUDIO_CUE_IDS.battleCommand,
  "npc-resolve": BUILTIN_AUDIO_CUE_IDS.battleImpact,
  finish: BUILTIN_AUDIO_CUE_IDS.battleVictory,
  "embedded-victory": BUILTIN_AUDIO_CUE_IDS.battleVictory,
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
    defaultVolume: 0.35,
    source: {
      kind: "asset-path",
      assetPath: "BGM/娓告垙鍐?mp3",
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
    cooldownMs: 40,
    maxInstances: 2,
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
    cooldownMs: 40,
    maxInstances: 2,
    source: {
      kind: "asset-path",
      assetPath: "audio/ui/button-heavy.mp3",
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
    defaultVolume: 0.26,
    cooldownMs: 80,
    maxInstances: 1,
    source: {
      kind: "generated",
      generatorId: "battle.victory.basic",
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

function resolveCueSourceUrl(
  cueDefinition: AudioCueDefinition,
  resolveAssetPath: (assetPath: string) => string
): string {
  if (cueDefinition.source.kind === "generated") {
    return resolveGeneratedAudioSource(cueDefinition.source.generatorId);
  }

  return resolveAssetPath(cueDefinition.source.assetPath);
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
    state.runtime.playableSession.family === "battle"
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
    input.appState.gameState.ui.currentView === "battle" ||
    isBattlePlayableActive(input.appState.gameState)
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

  let bgmPlayer: ManagedAudioElement | null = null;
  let activeBgmCueId: string | null = null;
  const consumedCommandIds = new Set<string>();
  const lastPlayedAtByCueId = new Map<string, number>();
  const activeOneShotPlayersByCueId = new Map<string, ManagedAudioElement[]>();

  function syncBgmCue(nextCueId: string | null): void {
    if (nextCueId === activeBgmCueId) {
      if (bgmPlayer != null && bgmPlayer.paused) {
        playManagedAudio(bgmPlayer);
      }
      return;
    }

    activeBgmCueId = nextCueId;
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

    bgmPlayer.loop = cueDefinition.loop;
    bgmPlayer.volume = cueDefinition.defaultVolume;
    playManagedAudio(bgmPlayer);
  }

  function playOneShotCue(cueId: string): void {
    const cueDefinition = cueRegistry.get(cueId);
    if (cueDefinition == null || cueDefinition.loop) {
      return;
    }

    const currentTimeMs = now();
    const lastPlayedAt = lastPlayedAtByCueId.get(cueId);
    if (
      cueDefinition.cooldownMs != null &&
      lastPlayedAt != null &&
      currentTimeMs - lastPlayedAt < cueDefinition.cooldownMs
    ) {
      return;
    }

    const activePlayers =
      activeOneShotPlayersByCueId
        .get(cueId)
        ?.filter((player) => !player.paused) ?? [];
    const maxInstances = cueDefinition.maxInstances ?? Number.POSITIVE_INFINITY;
    if (activePlayers.length >= maxInstances) {
      return;
    }

    const player = createAudioElement();
    player.preload = "auto";
    player.loop = false;
    player.volume = cueDefinition.defaultVolume;
    player.src = resolveCueSourceUrl(cueDefinition, resolveAssetPath);
    player.currentTime = 0;
    player.load();
    activeOneShotPlayersByCueId.set(cueId, [...activePlayers, player]);
    lastPlayedAtByCueId.set(cueId, currentTimeMs);
    playManagedAudio(player);
  }

  return {
    sync(output: AppAudioOutput): void {
      syncBgmCue(output.bgmCueId);
      for (const command of output.commands) {
        if (consumedCommandIds.has(command.commandId)) {
          continue;
        }
        consumedCommandIds.add(command.commandId);
        playOneShotCue(command.cueId);
      }
    },
    unlock(): void {
      if (bgmPlayer != null && bgmPlayer.paused) {
        playManagedAudio(bgmPlayer);
      }
    },
  };
}
