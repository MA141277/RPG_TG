const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

function requireSourceModule(entryPath, overrides = {}) {
  const source = fs.readFileSync(entryPath, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2021,
    },
    fileName: entryPath,
  });
  const module = { exports: {} };
  const dirname = path.dirname(entryPath);

  const localRequire = (specifier) => {
    if (Object.hasOwn(overrides, specifier)) {
      return overrides[specifier];
    }
    if (!specifier.startsWith(".")) {
      return require(specifier);
    }

    const resolvedPath = resolveTsModulePath(dirname, specifier);
    const compiledPath = path.join(
      process.cwd(),
      ".test-dist",
      path
        .relative(path.join(process.cwd(), "src"), resolvedPath)
        .replace(/\\/g, "/")
        .replace(/\.ts$/, ".js")
    );
    if (fs.existsSync(compiledPath)) {
      return require(compiledPath);
    }

    return requireSourceModule(resolvedPath, overrides);
  };

  const evaluator = new Function(
    "exports",
    "require",
    "module",
    "__filename",
    "__dirname",
    outputText
  );
  evaluator(module.exports, localRequire, module, entryPath, dirname);
  return module.exports;
}

function resolveTsModulePath(dirname, specifier) {
  const basePath = path.resolve(dirname, specifier);
  const candidates = [`${basePath}.ts`, path.join(basePath, "index.ts")];
  const resolvedPath = candidates.find((candidate) => fs.existsSync(candidate));
  if (resolvedPath == null) {
    throw new Error(`Unable to resolve TypeScript module for ${specifier}.`);
  }
  return resolvedPath;
}

function createAudioPlayerStub() {
  return {
    src: "",
    loop: false,
    currentTime: 12,
    paused: true,
    pauseCalls: 0,
    loadCalls: 0,
    playCalls: 0,
    pause() {
      this.pauseCalls += 1;
      this.paused = true;
    },
    load() {
      this.loadCalls += 1;
    },
    play() {
      this.playCalls += 1;
      this.paused = false;
      return Promise.resolve();
    },
  };
}

function createRootWithMusicCue(musicId, loop = false) {
  return {
    querySelector(selector) {
      if (
        selector ===
        '[data-dialogue-view="music"][data-dialogue-music-id]'
      ) {
        return {
          dataset: {
            dialogueMusicId: musicId,
            dialogueMusicLoop: loop ? "true" : "false",
          },
        };
      }
      return null;
    },
  };
}

test("syncDialogueMusicPlayer plays resolved dialogue music cues", async () => {
  const {
    readDialogueMusicCue,
    syncDialogueMusicPlayer,
  } = requireSourceModule(
    path.join(process.cwd(), "src/ui/dialogue-music.ts")
  );

  const root = createRootWithMusicCue("bgm.temple.night", true);
  const player = createAudioPlayerStub();

  assert.deepEqual(readDialogueMusicCue(root), {
    musicId: "bgm.temple.night",
    loop: true,
  });

  const playbackState = syncDialogueMusicPlayer({
    root,
    player,
    resolveSourceUrl: (musicId) =>
      musicId === "bgm.temple.night" ? "builtin:bgm/night.mp3" : null,
  });

  await Promise.resolve();

  assert.equal(playbackState, "active");
  assert.equal(player.src, "builtin:bgm/night.mp3");
  assert.equal(player.loop, true);
  assert.equal(player.currentTime, 0);
  assert.equal(player.loadCalls, 1);
  assert.equal(player.playCalls, 1);
  assert.equal(player.paused, false);
});

test("syncDialogueMusicPlayer fails closed when the cue is unresolved or absent", () => {
  const { syncDialogueMusicPlayer } = requireSourceModule(
    path.join(process.cwd(), "src/ui/dialogue-music.ts")
  );

  const unresolvedRoot = createRootWithMusicCue("bgm.unknown", false);
  const unresolvedPlayer = createAudioPlayerStub();
  unresolvedPlayer.src = "builtin:bgm/previous.mp3";
  unresolvedPlayer.paused = false;

  const unresolvedState = syncDialogueMusicPlayer({
    root: unresolvedRoot,
    player: unresolvedPlayer,
    resolveSourceUrl: () => null,
  });

  assert.equal(unresolvedState, "unresolved");
  assert.equal(unresolvedPlayer.pauseCalls, 1);
  assert.equal(unresolvedPlayer.src, "");
  assert.equal(unresolvedPlayer.currentTime, 0);

  const inactivePlayer = createAudioPlayerStub();
  inactivePlayer.src = "builtin:bgm/previous.mp3";
  inactivePlayer.paused = false;

  const inactiveState = syncDialogueMusicPlayer({
    root: {
      querySelector() {
        return null;
      },
    },
    player: inactivePlayer,
    resolveSourceUrl: () => "builtin:bgm/night.mp3",
  });

  assert.equal(inactiveState, "inactive");
  assert.equal(inactivePlayer.pauseCalls, 1);
  assert.equal(inactivePlayer.src, "");
  assert.equal(inactivePlayer.currentTime, 0);
});
