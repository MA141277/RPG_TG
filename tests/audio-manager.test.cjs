const test = require("node:test");
const assert = require("node:assert/strict");

const {
  BUILTIN_AUDIO_CUE_IDS,
  createAppAudioController,
  createAppAudioOutput,
  createAppAudioSession,
  queueAppAudioCue,
  resolveStoryBattleActionCueId,
} = require("../.test-dist/application/audio/audio-manager.js");

function createFakeAudioElement(input) {
  const options =
    typeof input === "function"
      ? { onPlay: input }
      : input ?? {};
  const listenersByType = new Map();

  const audio = {
    paused: true,
    loop: false,
    preload: "none",
    volume: 1,
    playbackRate: 1,
    preservesPitch: true,
    mozPreservesPitch: true,
    webkitPreservesPitch: true,
    currentTime: 0,
    src: "",
    addEventListener(type, listener) {
      const listeners = listenersByType.get(type) ?? [];
      listeners.push(listener);
      listenersByType.set(type, listeners);
    },
    removeEventListener(type, listener) {
      const listeners = listenersByType.get(type) ?? [];
      listenersByType.set(
        type,
        listeners.filter((candidate) => candidate !== listener)
      );
    },
    dispatch(type, event = { type, target: audio }) {
      const listeners = [...(listenersByType.get(type) ?? [])];
      for (const listener of listeners) {
        listener.call(audio, event);
      }
    },
    load() {
      options.onLoad?.(audio);
    },
    pause() {
      this.paused = true;
    },
    play() {
      this.paused = false;
      options.onPlay?.(this);
      return options.onPlayResult?.(this) ?? Promise.resolve();
    },
  };

  return audio;
}

function createSequenceRandom(values) {
  let index = 0;
  return () => {
    const value =
      values[index] ?? values[Math.max(0, values.length - 1)] ?? 0;
    index += 1;
    return value;
  };
}

function gainFromDb(db) {
  return 10 ** (db / 20);
}

function createBattleDemoBridgeCueDefinitions() {
  return [
      {
        id: BUILTIN_AUDIO_CUE_IDS.battleHorseRun,
        bus: "sfx",
        loop: false,
        defaultVolume: 0.56,
        source: { kind: "asset-path", assetPath: "audio/battle/horse-run.mp3" },
      },
    {
      id: BUILTIN_AUDIO_CUE_IDS.battleBowDraw,
      bus: "sfx",
      loop: false,
      defaultVolume: 0.26,
      source: { kind: "asset-path", assetPath: "audio/battle/bow-draw.mp3" },
    },
    {
      id: BUILTIN_AUDIO_CUE_IDS.battleArrowRelease,
      bus: "sfx",
      loop: false,
      defaultVolume: 0.26,
      source: {
        kind: "asset-path",
        assetPath: "audio/battle/arrow-release.mp3",
      },
    },
    {
      id: BUILTIN_AUDIO_CUE_IDS.battleMusketeerReload,
      bus: "sfx",
      loop: false,
      defaultVolume: 0.26,
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
      source: { kind: "asset-path", assetPath: "audio/battle/impact.mp3" },
    },
  ];
}

function createAudioTestGameState(overrides = {}) {
  return {
    world: {
      currentMapId: "map.test",
      currentCityId: "city.test",
      currentHouseId: null,
      timeOfDay: "morning",
      schedule: {
        councilDate: { year: 1, month: 1, day: 1 },
      },
    },
    player: {
      characterId: "player.test",
    },
    calendar: {
      chapterId: "chapter.test",
      year: 1,
      month: 1,
      day: 1,
    },
    scene: {
      activeEventId: null,
      activeSceneId: null,
      cursor: 0,
      status: "idle",
    },
    storyBattle: null,
    ui: {
      currentView: "map",
    },
    missions: {
      activeMissionId: null,
      completedMissionIds: [],
    },
    cards: {
      owned: [],
      equipped: [],
    },
    valuables: {
      entries: [],
    },
    runtime: {
      flags: {},
      variables: {},
      tasks: {
        definitionsById: {},
        instancesById: {},
      },
      playableSession: null,
      cityNpcPools: {},
      cityMarkets: {},
      mapExplorationByMapId: {},
      activitySession: null,
      troops: {
        formationsByTroopId: {},
        playerTroopId: null,
      },
      mapExploration: {
        revealedHexesByMapId: {},
      },
      eventHistory: {},
    },
    ...overrides,
  };
}

test("app audio output defaults to opening BGM while the main game is hidden", () => {
  const result = createAppAudioOutput({
    isGameVisible: false,
    appState: {
      gameState: createAudioTestGameState(),
    },
    sceneDefinitionsById: {},
    session: createAppAudioSession(),
  });

  assert.equal(result.output.bgmCueId, BUILTIN_AUDIO_CUE_IDS.bgmOpening);
  assert.deepEqual(result.output.commands, []);
  assert.deepEqual(result.session.pendingCommands, []);
});

test("app audio output promotes scene music and drains queued UI commands", () => {
  let session = createAppAudioSession();
  session = queueAppAudioCue(session, BUILTIN_AUDIO_CUE_IDS.uiClick);

  const result = createAppAudioOutput({
    isGameVisible: true,
    appState: {
      gameState: createAudioTestGameState({
        scene: {
          activeEventId: null,
          activeSceneId: "intro",
          cursor: 0,
          status: "playing",
        },
      }),
    },
    sceneDefinitionsById: {
      intro: {
        id: "intro",
        name: "Intro",
        actions: [
          {
            type: "music",
            musicId: "bgm.midsummer_duel",
          },
        ],
      },
    },
    session,
  });

  assert.equal(result.output.bgmCueId, "bgm.midsummer_duel");
  assert.deepEqual(
    result.output.commands.map((command) => command.cueId),
    [BUILTIN_AUDIO_CUE_IDS.uiClick]
  );
  assert.deepEqual(result.session.pendingCommands, []);
});

test("battle playable session takes BGM ownership over the scene and restores the scene cue after exit", () => {
  const battleState = createAudioTestGameState({
    ui: {
      currentView: "battle",
    },
    scene: {
      activeEventId: null,
      activeSceneId: "intro",
      cursor: 0,
      status: "playing",
    },
    runtime: {
      flags: {},
      variables: {},
      tasks: {
        definitionsById: {},
        instancesById: {},
      },
      playableSession: {
        sessionId: "playable.story-battle",
        playableId: "story-battle",
        integrationId: "playable.story-battle.scene.default",
        family: "battle",
        ownerContext: {
          ownerKind: "scene",
          ownerId: "intro",
          returnPolicy: "reenter-owner",
        },
        status: "active",
      },
      cityNpcPools: {},
      cityMarkets: {},
      mapExplorationByMapId: {},
      activitySession: null,
      troops: {
        formationsByTroopId: {},
        playerTroopId: null,
      },
      mapExploration: {
        revealedHexesByMapId: {},
      },
      eventHistory: {},
    },
  });

  const battleResult = createAppAudioOutput({
    isGameVisible: true,
    appState: {
      gameState: battleState,
    },
    sceneDefinitionsById: {
      intro: {
        id: "intro",
        name: "Intro",
        actions: [{ type: "music", musicId: "bgm.midsummer_duel" }],
      },
    },
    session: createAppAudioSession(),
  });

  assert.equal(battleResult.output.bgmCueId, BUILTIN_AUDIO_CUE_IDS.bgmBattle);

  const restoredResult = createAppAudioOutput({
    isGameVisible: true,
    appState: {
      gameState: createAudioTestGameState({
        scene: {
          activeEventId: null,
          activeSceneId: "intro",
          cursor: 0,
          status: "playing",
        },
      }),
    },
    sceneDefinitionsById: {
      intro: {
        id: "intro",
        name: "Intro",
        actions: [{ type: "music", musicId: "bgm.midsummer_duel" }],
      },
    },
    session: battleResult.session,
  });

  assert.equal(restoredResult.output.bgmCueId, "bgm.midsummer_duel");
});

test("battle BGM falls back to in-game default when no outer scene cue exists", () => {
  const battleResult = createAppAudioOutput({
    isGameVisible: true,
    appState: {
      gameState: createAudioTestGameState({
        ui: {
          currentView: "battle",
        },
        runtime: {
          flags: {},
          variables: {},
          tasks: {
            definitionsById: {},
            instancesById: {},
          },
          playableSession: {
            sessionId: "playable.story-battle",
            playableId: "story-battle",
            integrationId: "playable.story-battle.scene.default",
            family: "battle",
            ownerContext: {
              ownerKind: "scene",
              ownerId: "intro",
              returnPolicy: "reenter-owner",
            },
            status: "active",
          },
          cityNpcPools: {},
          cityMarkets: {},
          mapExplorationByMapId: {},
          activitySession: null,
          troops: {
            formationsByTroopId: {},
            playerTroopId: null,
          },
          mapExploration: {
            revealedHexesByMapId: {},
          },
          eventHistory: {},
        },
      }),
    },
    sceneDefinitionsById: {},
    session: createAppAudioSession(),
  });

  assert.equal(battleResult.output.bgmCueId, BUILTIN_AUDIO_CUE_IDS.bgmBattle);

  const restoredResult = createAppAudioOutput({
    isGameVisible: true,
    appState: {
      gameState: createAudioTestGameState(),
    },
    sceneDefinitionsById: {},
    session: battleResult.session,
  });

  assert.equal(restoredResult.output.bgmCueId, BUILTIN_AUDIO_CUE_IDS.bgmInGame);
});

test("embedded battle-demo sessions stay on the ordinary stack until the explicit start bridge asks for battle BGM", () => {
  const result = createAppAudioOutput({
    isGameVisible: true,
    appState: {
      gameState: createAudioTestGameState({
        storyBattle: {
          battleId: "story-battle.demo",
          phase: "embedded-running",
          demoScenarioId: "battle.demo.test",
        },
        ui: {
          currentView: "battle",
        },
      }),
    },
    sceneDefinitionsById: {},
    session: createAppAudioSession(),
  });

  assert.equal(result.output.bgmCueId, BUILTIN_AUDIO_CUE_IDS.bgmInGame);
});

test("story battle action cue mapping keeps command impact and victory semantics centralized", () => {
  assert.equal(
    resolveStoryBattleActionCueId("player-advance"),
    BUILTIN_AUDIO_CUE_IDS.battleCommand
  );
  assert.equal(
    resolveStoryBattleActionCueId("npc-resolve"),
    BUILTIN_AUDIO_CUE_IDS.battleImpact
  );
  assert.equal(
    resolveStoryBattleActionCueId("embedded-victory"),
    BUILTIN_AUDIO_CUE_IDS.battleVictory
  );
  assert.equal(
    resolveStoryBattleActionCueId("finish"),
    BUILTIN_AUDIO_CUE_IDS.battleVictory
  );
  assert.equal(resolveStoryBattleActionCueId("unknown"), null);
});

test("audio controller throttles repeated oneshot playback inside the cue cooldown window", () => {
  const playedSources = [];
  let nowMs = 100;
  const controller = createAppAudioController({
    now: () => nowMs,
    createAudioElement: () =>
      createFakeAudioElement((audio) => {
        playedSources.push(audio.src);
      }),
  });

  controller.sync({
    bgmCueId: null,
    commands: [{ commandId: "cmd-1", cueId: BUILTIN_AUDIO_CUE_IDS.uiClick }],
  });
  controller.sync({
    bgmCueId: null,
    commands: [{ commandId: "cmd-2", cueId: BUILTIN_AUDIO_CUE_IDS.uiClick }],
  });

  assert.equal(playedSources.length, 1);

  nowMs = 200;
  controller.sync({
    bgmCueId: null,
    commands: [{ commandId: "cmd-3", cueId: BUILTIN_AUDIO_CUE_IDS.uiClick }],
  });

  assert.equal(playedSources.length, 2);
});

test("audio controller plays asset-backed light, heavy, enter, troop selection, and troop mutation cues through the shared ui bus", () => {
  const playedSources = [];
  const controller = createAppAudioController({
    resolveAssetPath: (assetPath) => `asset://${assetPath}`,
    createAudioElement: () =>
      createFakeAudioElement((audio) => {
        playedSources.push(audio.src);
      }),
  });

  controller.sync({
    bgmCueId: null,
    commands: [
      { commandId: "cmd-light", cueId: BUILTIN_AUDIO_CUE_IDS.uiButtonLight },
      { commandId: "cmd-heavy", cueId: BUILTIN_AUDIO_CUE_IDS.uiButtonHeavy },
      { commandId: "cmd-enter", cueId: BUILTIN_AUDIO_CUE_IDS.uiEnter },
      {
        commandId: "cmd-troop-selection",
        cueId: BUILTIN_AUDIO_CUE_IDS.uiTroopSelection,
      },
      {
        commandId: "cmd-troop-mutation",
        cueId: BUILTIN_AUDIO_CUE_IDS.uiTroopMutation,
      },
    ],
  });

  assert.deepEqual(playedSources, [
    "asset://audio/ui/button-light.mp3",
    "asset://audio/ui/button-heavy.mp3",
    "asset://audio/ui/enter.mp3",
    "asset://audio/ui/troop-selection.mp3",
    "asset://audio/ui/troop-mutation.mp3",
  ]);
});

test("audio controller applies the boosted default volume to troop selection and troop mutation cues", () => {
  const createdPlayers = [];
  const controller = createAppAudioController({
    resolveAssetPath: (assetPath) => `asset://${assetPath}`,
    createAudioElement: () => {
      const player = createFakeAudioElement();
      createdPlayers.push(player);
      return player;
    },
  });

  controller.sync({
    bgmCueId: null,
    commands: [
      {
        commandId: "cmd-troop-selection",
        cueId: BUILTIN_AUDIO_CUE_IDS.uiTroopSelection,
      },
      {
        commandId: "cmd-troop-mutation",
        cueId: BUILTIN_AUDIO_CUE_IDS.uiTroopMutation,
      },
    ],
  });

  assert.equal(createdPlayers.length, 2);
  assert.equal(createdPlayers[0].src, "asset://audio/ui/troop-selection.mp3");
  assert.equal(createdPlayers[1].src, "asset://audio/ui/troop-mutation.mp3");
  assert.ok(Math.abs(createdPlayers[0].volume - 0.54) < 1e-9);
  assert.ok(Math.abs(createdPlayers[1].volume - 0.54) < 1e-9);
});

test("audio controller plays asset-backed shared battle cues through the normal sfx bus", () => {
  const playedSources = [];
  const controller = createAppAudioController({
    resolveAssetPath: (assetPath) => `asset://${assetPath}`,
    createAudioElement: () =>
      createFakeAudioElement((audio) => {
        playedSources.push(audio.src);
      }),
  });

  controller.sync({
    bgmCueId: null,
    commands: [
      { commandId: "cmd-slash-1", cueId: BUILTIN_AUDIO_CUE_IDS.battleSlashHit1 },
      { commandId: "cmd-slash-2", cueId: BUILTIN_AUDIO_CUE_IDS.battleSlashHit2 },
      { commandId: "cmd-slash-3", cueId: BUILTIN_AUDIO_CUE_IDS.battleSlashHit3 },
      { commandId: "cmd-slash-miss", cueId: BUILTIN_AUDIO_CUE_IDS.battleSlashMiss },
      { commandId: "cmd-horse-run", cueId: BUILTIN_AUDIO_CUE_IDS.battleHorseRun },
      { commandId: "cmd-bow-draw", cueId: BUILTIN_AUDIO_CUE_IDS.battleBowDraw },
      {
        commandId: "cmd-arrow-release",
        cueId: BUILTIN_AUDIO_CUE_IDS.battleArrowRelease,
      },
      { commandId: "cmd-jump", cueId: BUILTIN_AUDIO_CUE_IDS.battleJump },
      { commandId: "cmd-landing", cueId: BUILTIN_AUDIO_CUE_IDS.battleLanding },
      { commandId: "cmd-impact", cueId: BUILTIN_AUDIO_CUE_IDS.battleImpactHit },
    ],
  });

  assert.deepEqual(playedSources, [
    "asset://audio/battle/slash-hit-1.mp3",
    "asset://audio/battle/slash-hit-2.mp3",
    "asset://audio/battle/slash-hit-3.mp3",
    "asset://audio/battle/slash-miss.mp3",
    "asset://audio/battle/horse-run.mp3",
    "asset://audio/battle/bow-draw.mp3",
    "asset://audio/battle/arrow-release.mp3",
    "asset://audio/battle/jump.mp3",
    "asset://audio/battle/landing.mp3",
    "asset://audio/battle/impact.mp3",
  ]);
});

test("audio controller humanizes battle asset cues with deterministic pitch volume and start offset variation", () => {
  const createdPlayers = [];
  const controller = createAppAudioController({
    random: createSequenceRandom([0.5, 0.8, 0.5, 0.8, 0.1, 0.5, 0.9]),
    resolveAssetPath: (assetPath) => `asset://${assetPath}`,
    scheduleTask: () => {
      throw new Error("Fade scheduling should stay idle in this variation path.");
    },
    createAudioElement: () => {
      const player = createFakeAudioElement();
      createdPlayers.push(player);
      return player;
    },
  });

  controller.sync({
    bgmCueId: null,
    commands: [
      { commandId: "cmd-humanized", cueId: BUILTIN_AUDIO_CUE_IDS.battleSlashHit1 },
    ],
  });

  assert.equal(createdPlayers.length, 1);
  assert.equal(createdPlayers[0].src, "asset://audio/battle/slash-hit-1.mp3");
  assert.ok(Math.abs(createdPlayers[0].playbackRate - 1.1) < 1e-9);
  assert.ok(
    Math.abs(createdPlayers[0].volume - 0.28 * gainFromDb(2.5)) < 1e-9
  );
  assert.ok(Math.abs(createdPlayers[0].currentTime - 0.012) < 1e-9);
  assert.equal(createdPlayers[0].preservesPitch, false);
  assert.equal(createdPlayers[0].mozPreservesPitch, false);
  assert.equal(createdPlayers[0].webkitPreservesPitch, false);
});

test("audio controller keeps pachinko bounce cues on the attack transient without random start offsets or fade-in", () => {
  const createdPlayers = [];
  const scheduledTasks = [];
  const controller = createAppAudioController({
    random: createSequenceRandom([0.5, 0.8, 0.1, 0.5]),
    resolveAssetPath: (assetPath) => `asset://${assetPath}`,
    scheduleTask: (callback, delayMs) => {
      scheduledTasks.push({ callback, delayMs });
      return scheduledTasks.length;
    },
    createAudioElement: () => {
      const player = createFakeAudioElement();
      createdPlayers.push(player);
      return player;
    },
  });

  controller.playCue(BUILTIN_AUDIO_CUE_IDS.activityPachinkoBounce1);

  assert.equal(createdPlayers.length, 1);
  assert.equal(
    createdPlayers[0].src,
    "asset://audio/activity/pachinko-bounce-1.mp3"
  );
  assert.ok(Math.abs(createdPlayers[0].playbackRate - 1.1) < 1e-9);
  assert.ok(createdPlayers[0].volume > 0.26);
  assert.ok(createdPlayers[0].volume <= 0.26 * gainFromDb(3));
  assert.equal(createdPlayers[0].currentTime, 0);
  assert.deepEqual(scheduledTasks, []);
});

test("audio controller retries pachinko bounce cues through a generated fallback when the asset source errors", async () => {
  const playedSources = [];
  const createdPlayers = [];
  const controller = createAppAudioController({
    resolveAssetPath: (assetPath) => `asset://${assetPath}`,
    createAudioElement: () => {
      const player = createFakeAudioElement({
        onLoad(audio) {
          if (audio.src === "asset://audio/activity/pachinko-bounce-1.mp3") {
            queueMicrotask(() => {
              audio.dispatch("error");
            });
          }
        },
        onPlay(audio) {
          playedSources.push(audio.src);
        },
      });
      createdPlayers.push(player);
      return player;
    },
  });

  controller.playCue(BUILTIN_AUDIO_CUE_IDS.activityPachinkoBounce1);
  await Promise.resolve();
  await Promise.resolve();

  assert.equal(createdPlayers.length, 1);
  assert.deepEqual(playedSources.length, 2);
  assert.equal(playedSources[0], "asset://audio/activity/pachinko-bounce-1.mp3");
  assert.match(playedSources[1], /^data:audio\/wav;base64,/);
  assert.match(createdPlayers[0].src, /^data:audio\/wav;base64,/);
});

test("audio controller can play a shared battle cue directly for embedded melee bridge requests", () => {
  const createdPlayers = [];
  const controller = createAppAudioController({
    random: createSequenceRandom([0.5, 0.8, 0.5, 0.8, 0.9, 0.9]),
    resolveAssetPath: (assetPath) => `asset://${assetPath}`,
    scheduleTask: () => {
      throw new Error("Fade scheduling should stay idle in this variation path.");
    },
    createAudioElement: () => {
      const player = createFakeAudioElement();
      createdPlayers.push(player);
      return player;
    },
  });

  controller.playCue(BUILTIN_AUDIO_CUE_IDS.battleSlashHit2);

  assert.equal(createdPlayers.length, 1);
  assert.equal(createdPlayers[0].src, "asset://audio/battle/slash-hit-2.mp3");
  assert.ok(Math.abs(createdPlayers[0].playbackRate - 1.1) < 1e-9);
});

test("audio controller lets embedded battle asset cues overlap beyond the legacy instance cap", () => {
  const createdPlayers = [];
  const controller = createAppAudioController({
    random: createSequenceRandom([
      0.5, 0.8, 0.5, 0.8, 0.9, 0.9,
      0.5, 0.8, 0.5, 0.8, 0.9, 0.9,
      0.5, 0.8, 0.5, 0.8, 0.9, 0.9,
      0.5, 0.8, 0.5, 0.8, 0.9, 0.9,
      0.5, 0.8, 0.5, 0.8, 0.9, 0.9,
      0.5, 0.8, 0.5, 0.8, 0.9, 0.9,
      0.5, 0.8, 0.5, 0.8, 0.9, 0.9,
    ]),
    resolveAssetPath: (assetPath) => `asset://${assetPath}`,
    scheduleTask: () => {
      throw new Error("Fade scheduling should stay idle in this variation path.");
    },
    createAudioElement: () => {
      const player = createFakeAudioElement();
      createdPlayers.push(player);
      return player;
    },
  });

  for (let index = 0; index < 7; index += 1) {
    controller.playCue(BUILTIN_AUDIO_CUE_IDS.battleSlashHit1);
  }

  assert.equal(createdPlayers.length, 7);
});

test("audio controller never reuses the same immediate pitch and volume variation for consecutive battle asset cues", () => {
  const createdPlayers = [];
  const controller = createAppAudioController({
    random: createSequenceRandom([
      0.5, 0.8, 0.5, 0.8, 0.9, 0.9,
      0.5, 0.8, 0.5, 0.8, 0.9, 0.9,
    ]),
    resolveAssetPath: (assetPath) => `asset://${assetPath}`,
    scheduleTask: () => {
      throw new Error("Fade scheduling should stay idle in this variation path.");
    },
    createAudioElement: () => {
      const player = createFakeAudioElement();
      createdPlayers.push(player);
      return player;
    },
  });

  controller.sync({
    bgmCueId: null,
    commands: [
      { commandId: "cmd-repeat-1", cueId: BUILTIN_AUDIO_CUE_IDS.battleSlashHit1 },
      { commandId: "cmd-repeat-2", cueId: BUILTIN_AUDIO_CUE_IDS.battleSlashHit2 },
    ],
  });

  assert.equal(createdPlayers.length, 2);
  assert.ok(Math.abs(createdPlayers[0].playbackRate - 1.1) < 1e-9);
  assert.ok(Math.abs(createdPlayers[1].playbackRate - 0.9) < 1e-9);
  assert.ok(createdPlayers[0].volume > createdPlayers[1].volume);
  assert.notEqual(createdPlayers[0].volume, createdPlayers[1].volume);
});

test("audio controller can apply a short deterministic fade-in to battle asset cues", () => {
  const createdPlayers = [];
  const scheduledTasks = [];
  const controller = createAppAudioController({
    random: createSequenceRandom([0.5, 0.8, 0.5, 0.8, 0.9, 0.1, 0.5]),
    resolveAssetPath: (assetPath) => `asset://${assetPath}`,
    scheduleTask: (callback, delayMs) => {
      scheduledTasks.push({ callback, delayMs });
      return scheduledTasks.length;
    },
    createAudioElement: () => {
      const player = createFakeAudioElement();
      createdPlayers.push(player);
      return player;
    },
  });

  controller.sync({
    bgmCueId: null,
    commands: [
      { commandId: "cmd-fade", cueId: BUILTIN_AUDIO_CUE_IDS.battleBowDraw },
    ],
  });

  assert.equal(createdPlayers.length, 1);
  assert.equal(createdPlayers[0].volume, 0);
  assert.equal(scheduledTasks.length, 4);
  assert.deepEqual(
    scheduledTasks.map((task) => task.delayMs),
    [5, 9, 14, 18]
  );

  for (const task of scheduledTasks) {
    task.callback();
  }

  assert.ok(
    Math.abs(createdPlayers[0].volume - 0.26 * gainFromDb(2.5)) < 1e-9
  );
});

test("audio controller leaves legacy generated battle cues untouched by battle asset humanization", () => {
  const createdPlayers = [];
  const scheduledTasks = [];
  const controller = createAppAudioController({
    random: createSequenceRandom([0.5, 0.8, 0.5, 0.8, 0.1, 0.5, 0.1, 0.5]),
    scheduleTask: (callback, delayMs) => {
      scheduledTasks.push({ callback, delayMs });
      return scheduledTasks.length;
    },
    createAudioElement: () => {
      const player = createFakeAudioElement();
      createdPlayers.push(player);
      return player;
    },
  });

  controller.sync({
    bgmCueId: null,
    commands: [
      { commandId: "cmd-legacy-impact", cueId: BUILTIN_AUDIO_CUE_IDS.battleImpact },
    ],
  });

  assert.equal(createdPlayers.length, 1);
  assert.equal(createdPlayers[0].playbackRate, 1);
  assert.equal(createdPlayers[0].currentTime, 0);
  assert.equal(createdPlayers[0].volume, 0.3);
  assert.equal(createdPlayers[0].preservesPitch, true);
  assert.deepEqual(scheduledTasks, []);
});

test("audio controller lets shared ui asset cues overlap immediately up to ten active instances", () => {
  for (const cueId of [
    BUILTIN_AUDIO_CUE_IDS.uiButtonLight,
    BUILTIN_AUDIO_CUE_IDS.uiButtonHeavy,
    BUILTIN_AUDIO_CUE_IDS.uiEnter,
    BUILTIN_AUDIO_CUE_IDS.uiTroopSelection,
    BUILTIN_AUDIO_CUE_IDS.uiTroopMutation,
  ]) {
    const playedSources = [];
    const controller = createAppAudioController({
      now: () => 100,
      resolveAssetPath: (assetPath) => `asset://${assetPath}`,
      createAudioElement: () =>
        createFakeAudioElement((audio) => {
          playedSources.push(audio.src);
        }),
    });

    for (let index = 1; index <= 11; index += 1) {
      controller.sync({
        bgmCueId: null,
        commands: [{ commandId: `${cueId}-${index}`, cueId }],
      });
    }

    const expectedSource =
      cueId === BUILTIN_AUDIO_CUE_IDS.uiButtonLight
        ? "asset://audio/ui/button-light.mp3"
        : cueId === BUILTIN_AUDIO_CUE_IDS.uiButtonHeavy
          ? "asset://audio/ui/button-heavy.mp3"
          : cueId === BUILTIN_AUDIO_CUE_IDS.uiEnter
            ? "asset://audio/ui/enter.mp3"
            : cueId === BUILTIN_AUDIO_CUE_IDS.uiTroopSelection
              ? "asset://audio/ui/troop-selection.mp3"
              : "asset://audio/ui/troop-mutation.mp3";
    assert.deepEqual(playedSources, Array.from({ length: 10 }, () => expectedSource));
  }
});

test("audio controller fades a draw cue over the remaining frame window before starting release for the same archer chain", () => {
  const createdPlayers = [];
  const scheduledTasks = [];
  const controller = createAppAudioController({
    cueDefinitions: createBattleDemoBridgeCueDefinitions(),
    resolveAssetPath: (assetPath) => `asset://${assetPath}`,
    scheduleTask: (callback, delayMs) => {
      scheduledTasks.push({ callback, delayMs });
      return scheduledTasks.length;
    },
    createAudioElement: () => {
      const player = createFakeAudioElement();
      createdPlayers.push(player);
      return player;
    },
  });

  controller.playBattleDemoBridgeMessage({
    chainId: "player:rear-center:120",
    phase: "draw",
    mode: "play",
    currentActionFrame: 18,
    frameDurationMs: 10,
  });

  const drawPlayer = createdPlayers[0];
  assert.equal(drawPlayer.src, "asset://audio/battle/bow-draw.mp3");

  controller.playBattleDemoBridgeMessage({
    chainId: "player:rear-center:120",
    phase: "release",
    mode: "transition",
    currentActionFrame: 37,
    frameDurationMs: 10,
    fadeFrames: 4,
    nextStartFrame: 41,
  });

  assert.deepEqual(
    scheduledTasks.map((task) => task.delayMs),
    [10, 20, 30, 40, 40],
  );

  for (const task of scheduledTasks) {
    task.callback();
  }

  assert.equal(drawPlayer.paused, true);
  assert.equal(createdPlayers.length, 2);
  assert.equal(createdPlayers[1].src, "asset://audio/battle/arrow-release.mp3");
});

test("audio controller starts the next archer bridge cue immediately when the transition arrives after the target frame", () => {
  const createdPlayers = [];
  const scheduledTasks = [];
  const controller = createAppAudioController({
    cueDefinitions: createBattleDemoBridgeCueDefinitions(),
    resolveAssetPath: (assetPath) => `asset://${assetPath}`,
    scheduleTask: (callback, delayMs) => {
      scheduledTasks.push({ callback, delayMs });
      return scheduledTasks.length;
    },
    createAudioElement: () => {
      const player = createFakeAudioElement();
      createdPlayers.push(player);
      return player;
    },
  });

  controller.playBattleDemoBridgeMessage({
    chainId: "player:rear-center:120",
    phase: "draw",
    mode: "play",
    currentActionFrame: 18,
    frameDurationMs: 10,
  });

  controller.playBattleDemoBridgeMessage({
    chainId: "player:rear-center:120",
    phase: "release",
    mode: "transition",
    currentActionFrame: 42,
    frameDurationMs: 10,
    fadeFrames: 4,
    nextStartFrame: 41,
  });

  assert.equal(scheduledTasks.length, 0);
  assert.equal(createdPlayers.length, 2);
  assert.equal(createdPlayers[1].src, "asset://audio/battle/arrow-release.mp3");
});

test("audio controller keeps different archer chains isolated during transition fades", () => {
  const createdPlayers = [];
  const scheduledTasks = [];
  const controller = createAppAudioController({
    cueDefinitions: createBattleDemoBridgeCueDefinitions(),
    resolveAssetPath: (assetPath) => `asset://${assetPath}`,
    scheduleTask: (callback, delayMs) => {
      scheduledTasks.push({ callback, delayMs });
      return scheduledTasks.length;
    },
    createAudioElement: () => {
      const player = createFakeAudioElement();
      createdPlayers.push(player);
      return player;
    },
  });

  controller.playBattleDemoBridgeMessage({
    chainId: "player:rear-center:120",
    phase: "draw",
    mode: "play",
    currentActionFrame: 18,
    frameDurationMs: 10,
  });
  controller.playBattleDemoBridgeMessage({
    chainId: "enemy:rear-center:220",
    phase: "draw",
    mode: "play",
    currentActionFrame: 18,
    frameDurationMs: 10,
  });

  const enemyDrawPlayer = createdPlayers[1];

  controller.playBattleDemoBridgeMessage({
    chainId: "player:rear-center:120",
    phase: "release",
    mode: "transition",
    currentActionFrame: 37,
    frameDurationMs: 10,
    fadeFrames: 4,
    nextStartFrame: 41,
  });

  for (const task of scheduledTasks) {
    task.callback();
  }

  assert.equal(enemyDrawPlayer.paused, false);
  assert.equal(enemyDrawPlayer.volume, 0.26);
});

test("audio controller fades a musketeer reload cue over the remaining frame window before starting fire for the same chain", () => {
  const createdPlayers = [];
  const scheduledTasks = [];
  const controller = createAppAudioController({
    cueDefinitions: createBattleDemoBridgeCueDefinitions(),
    resolveAssetPath: (assetPath) => `asset://${assetPath}`,
    scheduleTask: (callback, delayMs) => {
      scheduledTasks.push({ callback, delayMs });
      return scheduledTasks.length;
    },
    createAudioElement: () => {
      const player = createFakeAudioElement();
      createdPlayers.push(player);
      return player;
    },
  });

  controller.playBattleDemoBridgeMessage({
    chainId: "player:middle-right:210",
    phase: "reload",
    mode: "play",
    currentActionFrame: 9,
    frameDurationMs: 10,
  });

  controller.playBattleDemoBridgeMessage({
    chainId: "player:middle-right:210",
    phase: "fire",
    mode: "transition",
    currentActionFrame: 26,
    frameDurationMs: 10,
    fadeFrames: 3,
    nextStartFrame: 29,
  });

  assert.equal(createdPlayers.length, 1);
  assert.ok(scheduledTasks.some((task) => task.delayMs === 30));
});

test("audio controller fades a cavalry horse-run cue out without starting a replacement when the chain receives stop", () => {
  const createdPlayers = [];
  const scheduledTasks = [];
  const controller = createAppAudioController({
    cueDefinitions: createBattleDemoBridgeCueDefinitions(),
    resolveAssetPath: (assetPath) => `asset://${assetPath}`,
    scheduleTask: (callback, delayMs) => {
      scheduledTasks.push({ callback, delayMs });
      return scheduledTasks.length;
    },
    createAudioElement: () => {
      const player = createFakeAudioElement();
      createdPlayers.push(player);
      return player;
    },
  });

  controller.playBattleDemoBridgeMessage({
    chainId: "player:front-left:120:cavalry-run",
    phase: "horse-run",
    mode: "play",
    currentActionFrame: 1,
    frameDurationMs: 10,
  });

  const horseRunPlayer = createdPlayers[0];
  assert.equal(horseRunPlayer.src, "asset://audio/battle/horse-run.mp3");

  controller.playBattleDemoBridgeMessage({
    chainId: "player:front-left:120:cavalry-run",
    phase: "horse-run",
    mode: "stop",
    currentActionFrame: 29,
    frameDurationMs: 10,
    fadeFrames: 4,
  });

  assert.deepEqual(
    scheduledTasks.map((task) => task.delayMs),
    [10, 20, 30, 40, 40],
  );

  for (const task of scheduledTasks) {
    task.callback();
  }

  assert.equal(horseRunPlayer.paused, true);
  assert.equal(createdPlayers.length, 1);
});

test("audio controller can override the synced BGM with the shared battle track and loop its approved battle segment", () => {
  const players = [];
  const scheduledTasks = [];
  const controller = createAppAudioController({
    resolveAssetPath: (assetPath) => `asset://${assetPath}`,
    scheduleTask: (callback, delayMs) => {
      scheduledTasks.push({ callback, delayMs });
      return scheduledTasks.length;
    },
    createAudioElement: () => {
      const player = createFakeAudioElement();
      players.push(player);
      return player;
    },
  });

  controller.sync({
    bgmCueId: BUILTIN_AUDIO_CUE_IDS.bgmInGame,
    commands: [],
  });
  const inGameSrc = players[0].src;
  controller.setBgmOverrideCue(BUILTIN_AUDIO_CUE_IDS.bgmBattle);

  assert.equal(players.length, 1);
  assert.equal(players[0].src, "asset://audio/battle/battle-bgm.mp3");
  assert.equal(players[0].loop, false);
  assert.equal(players[0].volume, 0.7);
  assert.deepEqual(
    scheduledTasks.map((task) => task.delayMs),
    [91800],
  );

  const firstLoopTask = scheduledTasks.shift();
  players[0].currentTime = 91.8;
  firstLoopTask.callback();

  assert.deepEqual(
    scheduledTasks.map((task) => task.delayMs),
    [50, 100, 150, 200, 200, 250, 300, 350, 400, 74000],
  );

  const transitionTasks = scheduledTasks.splice(0, 9);
  for (const task of transitionTasks) {
    task.callback();
  }

  assert.equal(players[0].currentTime, 18);
  assert.equal(players[0].volume, 0.7);
  assert.equal(players[0].paused, false);

  assert.deepEqual(
    scheduledTasks.map((task) => task.delayMs),
    [74000],
  );

  controller.setBgmOverrideCue(null);
  assert.equal(players[0].src, inGameSrc);
});

test("audio controller fades the active battle BGM before playing the shared victory cue and only resumes ordinary BGM after that cue ends", () => {
  const players = [];
  const scheduledTasks = [];
  const controller = createAppAudioController({
    resolveAssetPath: (assetPath) => `asset://${assetPath}`,
    scheduleTask: (callback, delayMs) => {
      scheduledTasks.push({ callback, delayMs });
      return scheduledTasks.length;
    },
    createAudioElement: () => {
      const player = createFakeAudioElement();
      players.push(player);
      return player;
    },
  });

  controller.sync({
    bgmCueId: BUILTIN_AUDIO_CUE_IDS.bgmOpening,
    commands: [],
  });
  const openingSrc = players[0].src;
  controller.sync({
    bgmCueId: BUILTIN_AUDIO_CUE_IDS.bgmBattle,
    commands: [],
  });
  scheduledTasks.length = 0;

  controller.playCueWithBgmSuppressed(BUILTIN_AUDIO_CUE_IDS.battleVictory, {
    fadeOutMs: 200,
  });
  controller.sync({
    bgmCueId: BUILTIN_AUDIO_CUE_IDS.bgmOpening,
    commands: [],
  });

  assert.deepEqual(
    scheduledTasks.map((task) => task.delayMs),
    [50, 100, 150, 200, 200],
  );

  const fadeAndStartTasks = scheduledTasks.splice(0, 5);
  for (const task of fadeAndStartTasks) {
    task.callback();
  }

  assert.equal(players.length, 2);
  assert.equal(players[0].src, "asset://audio/battle/battle-bgm.mp3");
  assert.equal(players[0].paused, true);
  assert.equal(players[1].src, "asset://audio/battle/battle-victory.mp3");
  assert.equal(players[1].paused, false);
  assert.equal(players[1].volume, 0.52);

  assert.deepEqual(
    scheduledTasks.map((task) => task.delayMs),
    [50],
  );

  players[1].paused = true;
  scheduledTasks.shift().callback();

  assert.equal(players[0].src, openingSrc);
  assert.equal(players[0].paused, false);
});

test("audio controller keeps one looping BGM player and switches its source when the cue changes", () => {
  const players = [];
  const controller = createAppAudioController({
    resolveAssetPath: (assetPath) => `asset://${assetPath}`,
    createAudioElement: () => {
      const player = createFakeAudioElement();
      players.push(player);
      return player;
    },
  });

  controller.sync({
    bgmCueId: BUILTIN_AUDIO_CUE_IDS.bgmOpening,
    commands: [],
  });

  assert.equal(players.length, 1);
  const openingSrc = players[0].src;
  assert.equal(openingSrc, "asset://BGM/开局.mp3");
  assert.equal(players[0].loop, true);

  controller.sync({
    bgmCueId: BUILTIN_AUDIO_CUE_IDS.bgmInGame,
    commands: [],
  });

  assert.equal(players.length, 1);
  assert.equal(players[0].src, "asset://BGM/游戏内.mp3");
});

