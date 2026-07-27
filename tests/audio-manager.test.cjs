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

function createFakeAudioElement(onPlay) {
  return {
    paused: true,
    loop: false,
    preload: "none",
    volume: 1,
    currentTime: 0,
    src: "",
    load() {},
    pause() {
      this.paused = true;
    },
    play() {
      this.paused = false;
      onPlay?.(this);
      return Promise.resolve();
    },
  };
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
  assert.equal(players[0].src, "asset://BGM/开局.mp3");
  assert.equal(players[0].loop, true);

  controller.sync({
    bgmCueId: BUILTIN_AUDIO_CUE_IDS.bgmInGame,
    commands: [],
  });

  assert.equal(players.length, 1);
  assert.equal(players[0].src, "asset://BGM/游戏内.mp3");

  controller.sync({
    bgmCueId: BUILTIN_AUDIO_CUE_IDS.bgmBattle,
    commands: [],
  });

  assert.equal(players.length, 1);
  assert.equal(players[0].src, "asset://BGM/战斗背景音乐.mp3");
});
