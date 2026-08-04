# City Market Ambient Audio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reusable city-market ambient loop that plays only on the city screen, fades in and out over 1 second, resumes from the saved timeline after leaving the city, and crossfades the loop tail so playback stays smooth.

**Architecture:** Extend `src/application/audio/audio-manager.ts` with a parallel `ambient` loop path and a reusable `createAmbientLoopHandle(...)` seam instead of pushing city audio branches into `src/main.ts`. Add a reusable `ScopedAmbientLoopController` that consumes shell state and toggles the ambient handle, while `src/main.ts` stays limited to static asset URL wiring plus one city-scope controller instance.

**Tech Stack:** TypeScript app runtime, Vite static `mp3?url` asset imports, the centralized app audio controller, Node test runner through `tsconfig.test.json`, PowerShell asset copy commands, `npm.cmd run lint:plans`, `npm.cmd run build:test`, `node --test`, `npm.cmd run typecheck`, and `npm.cmd run build`.

## Global Constraints

- `use a dedicated reusable class instead of hardcoded city-audio branches`
- `avoid feature business branching in src/main.ts`
- `keep ambient playback separate from the existing main BGM track so both can play in parallel`
- `fade in over 1 second when entering the city interface`
- `fade out over 1 second when leaving the city interface for buildings, scenes, battles, or the campaign map`
- `preserve playback position when leaving the city interface and resume from that position when returning`
- `crossfade the ambient loop near the end of the file so repeated playback does not hard-cut`
- `audio-manager.ts owns browser audio objects and playback timing`
- `the caller owns only activation lifecycle`
- `src/main.ts must not add separate branches for entering a specific building, leaving a specific building, entering a specific story event, or returning from a specific story event`
- `audio/ambient/city-market.mp3` is the exact logical asset key
- `ambience.city.market` is the exact new cue id

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-08-03`
- Current Focus: `Implementation complete; local verification is green; this child remains open locally until the user requests review/push or a governance resync.`
- Next Step: `Review the diff, then choose whether to keep this as a local child or resync canonical project-progress before push.`
- Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools/lint-superpowers-plans.mjs` passed; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` passed; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` wrote the CommonJS marker; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/audio-manager.test.cjs tests/scoped-ambient-loop-controller.test.cjs tests/city-ambient-audio-source.test.cjs tests/audio-seam.test.cjs` passed; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json` passed; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build` passed after rerunning outside the sandbox because the sandboxed attempt hit `spawn EPERM`; build kept existing Vite warnings about non-module prototype scripts, unresolved runtime asset URLs, and chunk-size warnings.
- Notes: `docs/superpowers/project-progress.md still tracks the open 2026-07-31 City Specialty Market child, so this ambient-audio child remains local until governance resync is explicitly requested.`

## Progress Log

- 2026-08-03
  - Summary: `Adjusted the city market ambient entry/exit fade timing from 1 second to 3 seconds while keeping the 1-second loop-tail crossfade unchanged.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/city-ambient-audio-source.test.cjs tests/audio-seam.test.cjs` passed; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json` passed.
  - Next: `Keep the ambient-audio child open locally unless the user requests review/push or canonical progress resync.`
- 2026-08-03
  - Summary: `Created the city market ambient audio implementation plan from the approved design spec.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools/lint-superpowers-plans.mjs` passed.
  - Next: `Choose an execution mode, then start Task 1.`
- 2026-08-03
  - Summary: `Execution started in the current workspace under the local SDD flow; Task 1 was dispatched once, hit an upstream deployment 404, and was immediately re-dispatched with the same bounded write scope.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools/lint-superpowers-plans.mjs` remains the latest completed command while Task 1 is still running.
  - Next: `Wait for Task 1 completion, review its patch, and proceed to Task 2.`
- 2026-08-03
  - Summary: `Implemented the reusable city market ambient loop, including the parallel ambient handle, saved-position resume, tail crossfade, and city-scope shell wiring.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools/lint-superpowers-plans.mjs` passed; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` passed; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` wrote the CommonJS marker; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/audio-manager.test.cjs tests/scoped-ambient-loop-controller.test.cjs tests/city-ambient-audio-source.test.cjs tests/audio-seam.test.cjs` passed; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json` passed; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build` passed with the existing Vite warnings recorded in `Execution State`.
  - Next: `Keep the child open locally unless the user requests review/push or canonical progress resync.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-03-city-market-ambient-audio-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `src/application/audio/audio-manager.ts` already owns the cue registry, the main BGM player, one-shot cue playback, and the audio controller returned to the shell.`
  - `src/main.ts` already imports static audio assets for button, pachinko, battle, and card-draw cues, then resolves them through a narrow static asset URL map before the legacy fallback.`
  - `src/vite-env.d.ts` already declares *.mp3?url modules, so this child does not need a new typing seam.`
  - `tests/audio-manager.test.cjs` already contains the fake audio element helper and controller-focused playback assertions, so the ambient loop behavior should extend this harness instead of inventing a new playback test file.`
  - `docs/superpowers/project-progress.md` still points to the open City Specialty Market child with Push Status: not-pushed, so this ambient-audio plan must stay local and waiting until the user explicitly chooses execution.`

## Implementation Scope

### In Scope

- Add `ambience.city.market` as a centralized ambient cue owned by `src/application/audio/audio-manager.ts`.
- Add an `ambient` bus classification and a reusable `createAmbientLoopHandle(...)` controller seam that supports activation, deactivation, destroy, fade in, fade out, saved-position resume, and tail crossfade.
- Add `src/application/audio/scoped-ambient-loop-controller.ts` as a reusable shell-state-to-ambient activation adapter.
- Copy the user-provided city market mp3 into `src/assets/audio/ambient/city-market.mp3`.
- Wire `src/main.ts` to instantiate a single city-scope ambient controller based only on `{ isGameVisible, currentView }`.
- Add regression tests for the audio-manager playback seam, the scoped controller behavior, and the `src/main.ts` source boundary.
- Record the new ambient runtime contract in `docs/change-log.md`.

### Still Out Of Scope

- Replacing or redesigning the existing BGM stack.
- Adding city-specific ambient selection rules for multiple cities.
- Adding building-specific, scene-specific, or battle-specific ambient loops.
- Persisting ambient resume position into save data.
- Refactoring all legacy audio imports out of `src/main.ts`.
- Resyncing `docs/superpowers/project-progress.md` away from the currently open City Specialty Market child unless the user explicitly asks for that governance change.

## File Map

### Existing files to modify

- `src/application/audio/audio-manager.ts`
  - Add the ambient bus typing, the `ambience.city.market` cue definition, the reusable ambient loop handle factory, and the low-level fade/resume/crossfade logic.
- `src/main.ts`
  - Import the static city market ambient mp3, register the asset key in the static map, instantiate the reusable city ambient handle/controller, and sync it from the existing audio seam.
- `tests/audio-manager.test.cjs`
  - Extend the fake audio harness and lock the new ambient-handle playback behavior.
- `docs/change-log.md`
  - Record the new parallel ambient loop contract and city-scope wiring.

### Existing files expected to be deleted

- None.

### New files to create

- `src/application/audio/scoped-ambient-loop-controller.ts`
  - Own the reusable `ScopedAmbientLoopController<TSnapshot>` implementation.
- `src/assets/audio/ambient/city-market.mp3`
  - Repository-owned copy of the provided city market ambience track.
- `tests/scoped-ambient-loop-controller.test.cjs`
  - Lock the scope-controller activation/deactivation contract.
- `tests/city-ambient-audio-source.test.cjs`
  - Lock the `src/main.ts` asset import and thin-wiring boundary for the city ambient controller.

## Verification Plan

- Targeted verification:
  - `npm.cmd run build:test`
  - `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline`
  - `node --test --test-isolation=none tests/audio-manager.test.cjs tests/scoped-ambient-loop-controller.test.cjs tests/city-ambient-audio-source.test.cjs tests/audio-seam.test.cjs`
- Required commands:
  - `npm.cmd run lint:plans`
  - `npm.cmd run build:test`
  - `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline`
  - `node --test --test-isolation=none tests/audio-manager.test.cjs tests/scoped-ambient-loop-controller.test.cjs tests/city-ambient-audio-source.test.cjs tests/audio-seam.test.cjs`
  - `npm.cmd run typecheck`
  - `npm.cmd run build`

## Task 1: Add The Central Ambient Cue And Parallel Loop Handle Foundation

**Files:**
- Modify: `src/application/audio/audio-manager.ts`
- Modify: `tests/audio-manager.test.cjs`

**Interfaces:**
- Consumes:
  - `createAppAudioController(input?: AppAudioControllerInput): AppAudioController`
  - `createFakeAudioElement(input?: object | Function)` in `tests/audio-manager.test.cjs`
- Produces:
  - `BUILTIN_AUDIO_CUE_IDS.ambienceCityMarket: "ambience.city.market"`
  - `type AmbientLoopHandle = { activate(): void; deactivate(): void; destroy(): void; }`
  - `type CreateAmbientLoopHandleInput = { cueId: string; fadeInMs: number; fadeOutMs: number; crossfadeMs: number; }`
  - `AppAudioController["createAmbientLoopHandle"](input: CreateAmbientLoopHandleInput): AmbientLoopHandle`

- [x] **Step 1: Write the failing audio-manager tests for the new ambient cue and parallel handle**

Extend `tests/audio-manager.test.cjs` with a tiny scheduled-task helper and these assertions:

```js
// Extend the existing createFakeAudioElement helper with:
// duration: options.duration ?? 0,

function createScheduledTaskQueue() {
  const tasks = [];
  return {
    schedule(callback, delayMs) {
      tasks.push({ callback, delayMs, ran: false });
      return tasks.length;
    },
    runThrough(delayMs) {
      for (const task of tasks) {
        if (!task.ran && task.delayMs <= delayMs) {
          task.ran = true;
          task.callback();
        }
      }
    },
  };
}

test("audio controller can create a dedicated ambient loop handle that plays in parallel with bgm", () => {
  const createdPlayers = [];
  const scheduled = createScheduledTaskQueue();
  const controller = createAppAudioController({
    resolveAssetPath: (assetPath) => `asset://${assetPath}`,
    scheduleTask: scheduled.schedule,
    createAudioElement: () => {
      const audio = createFakeAudioElement({ duration: 120 });
      createdPlayers.push(audio);
      return audio;
    },
  });

  controller.sync({
    bgmCueId: BUILTIN_AUDIO_CUE_IDS.bgmInGame,
    commands: [],
  });

  const ambient = controller.createAmbientLoopHandle({
    cueId: BUILTIN_AUDIO_CUE_IDS.ambienceCityMarket,
    fadeInMs: 1000,
    fadeOutMs: 1000,
    crossfadeMs: 1000,
  });

  ambient.activate();

  const bgmPlayer = createdPlayers[0];
  const ambientPlayer = createdPlayers[1];

  assert.ok(bgmPlayer, "Expected the regular BGM player.");
  assert.ok(ambientPlayer, "Expected a dedicated ambient player.");
  assert.equal(ambientPlayer.src, "asset://audio/ambient/city-market.mp3");
  assert.equal(ambientPlayer.volume, 0);

  scheduled.runThrough(1000);

  assert.equal(ambientPlayer.volume, 0.24);
  assert.equal(bgmPlayer.paused, false);
  assert.equal(ambientPlayer.paused, false);
});

test("ambient loop handle fades out its own player without pausing bgm", () => {
  const createdPlayers = [];
  const scheduled = createScheduledTaskQueue();
  const controller = createAppAudioController({
    resolveAssetPath: (assetPath) => `asset://${assetPath}`,
    scheduleTask: scheduled.schedule,
    createAudioElement: () => {
      const audio = createFakeAudioElement({ duration: 120 });
      createdPlayers.push(audio);
      return audio;
    },
  });

  controller.sync({
    bgmCueId: BUILTIN_AUDIO_CUE_IDS.bgmInGame,
    commands: [],
  });

  const ambient = controller.createAmbientLoopHandle({
    cueId: BUILTIN_AUDIO_CUE_IDS.ambienceCityMarket,
    fadeInMs: 1000,
    fadeOutMs: 1000,
    crossfadeMs: 1000,
  });

  ambient.activate();
  scheduled.runThrough(1000);

  const bgmPlayer = createdPlayers[0];
  const ambientPlayer = createdPlayers[1];

  ambient.deactivate();
  scheduled.runThrough(2000);

  assert.equal(ambientPlayer.paused, true);
  assert.equal(ambientPlayer.volume, 0);
  assert.equal(bgmPlayer.paused, false);
});
```

- [x] **Step 2: Run the tests and confirm the missing ambient seam is red**

Run:

```bash
npm.cmd run build:test
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
node --test --test-isolation=none tests/audio-manager.test.cjs
```

Expected:

- `FAIL`
- the first failures should report that `BUILTIN_AUDIO_CUE_IDS.ambienceCityMarket` and `createAmbientLoopHandle(...)` do not exist yet.

- [x] **Step 3: Implement the minimal ambient cue and parallel handle foundation**

Update `src/application/audio/audio-manager.ts` with these exact additions:

```ts
type AudioBusId = "bgm" | "ambient" | "sfx" | "ui";

export type AmbientLoopHandle = {
  activate(): void;
  deactivate(): void;
  destroy(): void;
};

export type CreateAmbientLoopHandleInput = {
  cueId: string;
  fadeInMs: number;
  fadeOutMs: number;
  crossfadeMs: number;
};

export const BUILTIN_AUDIO_CUE_IDS = {
  bgmOpening: "bgm.opening",
  bgmInGame: "bgm.in_game",
  bgmBattle: "bgm.battle.default",
  bgmMidsummerDuel: "bgm.midsummer_duel",
  ambienceCityMarket: "ambience.city.market",
  uiClick: "ui.click",
  // existing ids...
} as const;

{
  id: BUILTIN_AUDIO_CUE_IDS.ambienceCityMarket,
  bus: "ambient",
  loop: true,
  defaultVolume: 0.24,
  source: {
    kind: "asset-path",
    assetPath: "audio/ambient/city-market.mp3",
  },
}
```

Extend the controller type and implementation with a dedicated ambient-handle factory:

```ts
type AppAudioController = {
  sync(output: AppAudioOutput): void;
  playCue(cueId: string): void;
  setBgmOverrideCue(cueId: string | null): void;
  playCueWithBgmSuppressed(cueId: string, options?: { fadeOutMs?: number }): void;
  playBattleDemoBridgeMessage(command: BattleDemoAudioBridgeCommand): void;
  createAmbientLoopHandle(input: CreateAmbientLoopHandleInput): AmbientLoopHandle;
  unlock(): void;
};

function createAmbientLoopHandle(
  input: CreateAmbientLoopHandleInput
): AmbientLoopHandle {
  let player: ManagedAudioElement | null = null;
  let savedTimeSeconds = 0;
  let generation = 0;

  const cueDefinition = cueRegistry.get(input.cueId);
  if (cueDefinition == null || cueDefinition.bus !== "ambient" || !cueDefinition.loop) {
    throw new Error(`Ambient cue ${input.cueId} is not a registered looping ambient cue.`);
  }

  const ensurePlayer = () => {
    if (player == null) {
      player = createAudioElement();
      player.preload = "auto";
      player.loop = false;
      player.src = resolveCueSourceUrl(cueDefinition, resolveAssetPath);
      player.load();
    }
    return player;
  };

  return {
    activate() {
      const nextPlayer = ensurePlayer();
      const nextGeneration = ++generation;
      nextPlayer.currentTime = savedTimeSeconds;
      nextPlayer.volume = 0;
      playManagedAudio(nextPlayer);
      for (let step = 1; step <= 4; step += 1) {
        const delayMs = Math.round((input.fadeInMs * step) / 4);
        scheduleTask(() => {
          if (generation !== nextGeneration || player == null) {
            return;
          }
          player.volume = cueDefinition.defaultVolume * (step / 4);
        }, delayMs);
      }
    },
    deactivate() {
      if (player == null) {
        return;
      }
      const nextGeneration = ++generation;
      const currentVolume = player.volume;
      savedTimeSeconds = player.currentTime;
      for (let step = 1; step <= 4; step += 1) {
        const delayMs = Math.round((input.fadeOutMs * step) / 4);
        scheduleTask(() => {
          if (generation !== nextGeneration || player == null) {
            return;
          }
          player.volume = currentVolume * (1 - step / 4);
          if (step === 4) {
            player.pause();
          }
        }, delayMs);
      }
    },
    destroy() {
      generation += 1;
      player?.pause();
      player = null;
      savedTimeSeconds = 0;
    },
  };
}
```

- [x] **Step 4: Re-run the audio-manager tests until Task 1 is green**

Run:

```bash
npm.cmd run build:test
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
node --test --test-isolation=none tests/audio-manager.test.cjs
```

Expected:

- `PASS`
- the new ambient cue and the minimal parallel handle assertions pass without changing existing BGM behavior.

- [ ] **Step 5: Commit the Task 1 foundation**

Run:

```bash
git add src/application/audio/audio-manager.ts tests/audio-manager.test.cjs
git commit -m "feat: add ambient loop handle foundation"
```

## Task 2: Add Saved-Position Resume And Tail Crossfade To The Ambient Handle

**Files:**
- Modify: `src/application/audio/audio-manager.ts`
- Modify: `tests/audio-manager.test.cjs`

**Interfaces:**
- Consumes:
  - `createAmbientLoopHandle(input: CreateAmbientLoopHandleInput): AmbientLoopHandle`
  - `createScheduledTaskQueue()` from Task 1 test harness additions
- Produces:
  - ambient handles preserve timeline position across `deactivate()` and `activate()`
  - ambient handles use a dual-player tail crossfade when the active player enters the final `crossfadeMs`

- [x] **Step 1: Write the failing resume and crossfade tests**

Extend `tests/audio-manager.test.cjs` with these assertions:

```js
test("ambient loop handle resumes from the saved position after reactivation", () => {
  const createdPlayers = [];
  const scheduled = createScheduledTaskQueue();
  const controller = createAppAudioController({
    resolveAssetPath: (assetPath) => `asset://${assetPath}`,
    scheduleTask: scheduled.schedule,
    createAudioElement: () => {
      const audio = createFakeAudioElement({ duration: 120 });
      createdPlayers.push(audio);
      return audio;
    },
  });

  const ambient = controller.createAmbientLoopHandle({
    cueId: BUILTIN_AUDIO_CUE_IDS.ambienceCityMarket,
    fadeInMs: 1000,
    fadeOutMs: 1000,
    crossfadeMs: 1000,
  });

  ambient.activate();
  scheduled.runThrough(1000);

  const firstPlayer = createdPlayers[0];
  firstPlayer.currentTime = 37.5;

  ambient.deactivate();
  scheduled.runThrough(2000);
  ambient.activate();

  assert.equal(createdPlayers[0].currentTime, 37.5);
  assert.equal(createdPlayers[0].paused, false);
});

test("ambient loop handle crossfades into a second player during the final crossfade window", () => {
  const createdPlayers = [];
  const scheduled = createScheduledTaskQueue();
  const controller = createAppAudioController({
    resolveAssetPath: (assetPath) => `asset://${assetPath}`,
    scheduleTask: scheduled.schedule,
    createAudioElement: () => {
      const audio = createFakeAudioElement({ duration: 60 });
      createdPlayers.push(audio);
      return audio;
    },
  });

  const ambient = controller.createAmbientLoopHandle({
    cueId: BUILTIN_AUDIO_CUE_IDS.ambienceCityMarket,
    fadeInMs: 1000,
    fadeOutMs: 1000,
    crossfadeMs: 1000,
  });

  ambient.activate();
  scheduled.runThrough(1000);

  const outgoingPlayer = createdPlayers[0];
  outgoingPlayer.currentTime = 59.2;

  scheduled.runThrough(1100);

  const incomingPlayer = createdPlayers[1];
  assert.ok(incomingPlayer, "Expected a second player for the tail crossfade.");
  assert.equal(incomingPlayer.currentTime, 0);
  assert.equal(incomingPlayer.paused, false);

  scheduled.runThrough(2200);

  assert.equal(outgoingPlayer.paused, true);
  assert.equal(incomingPlayer.volume, 0.24);
});
```

- [x] **Step 2: Run the tests and verify resume/crossfade are red**

Run:

```bash
npm.cmd run build:test
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
node --test --test-isolation=none tests/audio-manager.test.cjs
```

Expected:

- `FAIL`
- the new failures should show that the ambient handle does not preserve `currentTime` correctly or never creates a second player for the tail crossfade.

- [x] **Step 3: Implement saved-position resume and dual-player crossfade in audio-manager**

Replace the single-player ambient runtime with an internal two-player runtime:

```ts
type AmbientLoopRuntime = {
  primaryPlayer: ManagedAudioElement | null;
  secondaryPlayer: ManagedAudioElement | null;
  savedTimeSeconds: number;
  generation: number;
  crossfadeGeneration: number;
  active: boolean;
};
```

Add these private helpers inside `createAppAudioController(...)`:

```ts
function captureAmbientTimelineSeconds(runtime: AmbientLoopRuntime): number {
  if (runtime.secondaryPlayer != null && !runtime.secondaryPlayer.paused) {
    const secondaryTime = runtime.secondaryPlayer.currentTime;
    if (secondaryTime > 0) {
      return secondaryTime;
    }
  }
  return runtime.primaryPlayer?.currentTime ?? runtime.savedTimeSeconds;
}

function swapAmbientPlayers(runtime: AmbientLoopRuntime): void {
  runtime.primaryPlayer?.pause();
  runtime.primaryPlayer = runtime.secondaryPlayer;
  runtime.secondaryPlayer = null;
}

function maybeStartAmbientCrossfade(
  runtime: AmbientLoopRuntime,
  cueDefinition: AudioCueDefinition,
  input: CreateAmbientLoopHandleInput
): void {
  const primaryPlayer = runtime.primaryPlayer;
  if (
    primaryPlayer == null ||
    primaryPlayer.paused ||
    !Number.isFinite(primaryPlayer.duration)
  ) {
    return;
  }

  const remainingSeconds = primaryPlayer.duration - primaryPlayer.currentTime;
  if (remainingSeconds > input.crossfadeMs / 1000 || runtime.secondaryPlayer != null) {
    return;
  }

  const secondaryPlayer = createAudioElement();
  secondaryPlayer.preload = "auto";
  secondaryPlayer.loop = false;
  secondaryPlayer.src = resolveCueSourceUrl(cueDefinition, resolveAssetPath);
  secondaryPlayer.currentTime = 0;
  secondaryPlayer.volume = 0;
  secondaryPlayer.load();
  playManagedAudio(secondaryPlayer);
  runtime.secondaryPlayer = secondaryPlayer;
}
```

Then update `createAmbientLoopHandle(...)` so it:

```ts
const monitorCrossfade = () => {
  if (!runtime.active || runtime.primaryPlayer == null) {
    return;
  }
  maybeStartAmbientCrossfade(runtime, cueDefinition, input);
  scheduleTask(monitorCrossfade, 100);
};

// on activate:
runtime.active = true;
runtime.primaryPlayer.currentTime = runtime.savedTimeSeconds;
monitorCrossfade();

// on deactivate:
runtime.savedTimeSeconds = captureAmbientTimelineSeconds(runtime);
runtime.active = false;

// when the crossfade fade-out/fade-in completes:
swapAmbientPlayers(runtime);
```

Keep the public interface unchanged:

```ts
activate(): void
deactivate(): void
destroy(): void
```

- [x] **Step 4: Re-run the audio-manager tests until resume and crossfade pass**

Run:

```bash
npm.cmd run build:test
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
node --test --test-isolation=none tests/audio-manager.test.cjs
```

Expected:

- `PASS`
- the ambient handle now resumes from the saved timeline and crossfades with a second player during the tail window.

- [ ] **Step 5: Commit the Task 2 runtime behavior**

Run:

```bash
git add src/application/audio/audio-manager.ts tests/audio-manager.test.cjs
git commit -m "feat: add ambient loop resume and crossfade"
```

## Task 3: Add The Reusable Scope Controller And City-Screen Shell Wiring

**Files:**
- Create: `src/application/audio/scoped-ambient-loop-controller.ts`
- Create: `tests/scoped-ambient-loop-controller.test.cjs`
- Create: `tests/city-ambient-audio-source.test.cjs`
- Create: `src/assets/audio/ambient/city-market.mp3`
- Modify: `src/main.ts`

**Interfaces:**
- Consumes:
  - `AmbientLoopHandle`
  - `BUILTIN_AUDIO_CUE_IDS.ambienceCityMarket`
- Produces:
  - `export class ScopedAmbientLoopController<TSnapshot> { constructor(input: { target: AmbientLoopHandle; isActive(snapshot: TSnapshot): boolean; }); sync(snapshot: TSnapshot): void; destroy(): void; }`
  - one `city`-scoped ambient controller instance in `src/main.ts`

- [x] **Step 1: Write the failing controller and source-boundary tests**

Create `tests/scoped-ambient-loop-controller.test.cjs`:

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const {
  ScopedAmbientLoopController,
} = require("../.test-dist/application/audio/scoped-ambient-loop-controller.js");

test("scoped ambient controller only toggles the target when city activity changes", () => {
  const calls = [];
  const controller = new ScopedAmbientLoopController({
    target: {
      activate: () => calls.push("activate"),
      deactivate: () => calls.push("deactivate"),
      destroy: () => calls.push("destroy"),
    },
    isActive: (snapshot) => snapshot.isGameVisible && snapshot.currentView === "city",
  });

  controller.sync({ isGameVisible: true, currentView: "map" });
  controller.sync({ isGameVisible: true, currentView: "city" });
  controller.sync({ isGameVisible: true, currentView: "city" });
  controller.sync({ isGameVisible: true, currentView: "house" });

  assert.deepEqual(calls, ["activate", "deactivate"]);
});
```

Create `tests/city-ambient-audio-source.test.cjs`:

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("main wires the city market ambient controller through the shared audio seam", () => {
  const mainSource = fs.readFileSync(path.join(process.cwd(), "src/main.ts"), "utf8");

  assert.match(
    mainSource,
    /import cityMarketAmbientAudioUrl from "\.\/assets\/audio\/ambient\/city-market\.mp3\?url";/
  );
  assert.match(
    mainSource,
    /import \{ ScopedAmbientLoopController \} from "\.\/application\/audio\/scoped-ambient-loop-controller";/
  );
  assert.match(
    mainSource,
    /"audio\/ambient\/city-market\.mp3": cityMarketAmbientAudioUrl/
  );
  assert.match(
    mainSource,
    /createAmbientLoopHandle\(\{[\s\S]*cueId: BUILTIN_AUDIO_CUE_IDS\.ambienceCityMarket,[\s\S]*fadeInMs: 1000,[\s\S]*fadeOutMs: 1000,[\s\S]*crossfadeMs: 1000/
  );
  assert.match(
    mainSource,
    /isActive: \(snapshot\) => snapshot\.isGameVisible && snapshot\.currentView === "city"/
  );
  assert.doesNotMatch(mainSource, /new Audio\(/);
});
```

- [x] **Step 2: Run the tests and confirm the reusable controller/shell wiring is missing**

Run:

```bash
npm.cmd run build:test
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
node --test --test-isolation=none tests/scoped-ambient-loop-controller.test.cjs tests/city-ambient-audio-source.test.cjs
```

Expected:

- `FAIL`
- the first failures should report the missing `scoped-ambient-loop-controller` module and missing city-market ambient import/wiring in `src/main.ts`.

- [x] **Step 3: Implement the reusable scope controller and city-shell wiring**

Copy the provided asset into the repository:

```powershell
Copy-Item -LiteralPath "C:\Users\29636\Desktop\工作用文件\2026.7\音效3\市集.mp3" -Destination "src\assets\audio\ambient\city-market.mp3"
```

Create `src/application/audio/scoped-ambient-loop-controller.ts`:

```ts
import type { AmbientLoopHandle } from "./audio-manager";

export class ScopedAmbientLoopController<TSnapshot> {
  private active = false;

  constructor(
    private readonly input: {
      target: AmbientLoopHandle;
      isActive(snapshot: TSnapshot): boolean;
    }
  ) {}

  sync(snapshot: TSnapshot): void {
    const nextActive = this.input.isActive(snapshot);
    if (nextActive === this.active) {
      return;
    }
    this.active = nextActive;
    if (nextActive) {
      this.input.target.activate();
      return;
    }
    this.input.target.deactivate();
  }

  destroy(): void {
    if (this.active) {
      this.input.target.deactivate();
      this.active = false;
    }
    this.input.target.destroy();
  }
}
```

Update `src/main.ts` with this exact wiring shape:

```ts
import cityMarketAmbientAudioUrl from "./assets/audio/ambient/city-market.mp3?url";
import { ScopedAmbientLoopController } from "./application/audio/scoped-ambient-loop-controller";

const STATIC_AUDIO_ASSET_URLS: Record<string, string> = {
  // existing mappings...
  "audio/ambient/city-market.mp3": cityMarketAmbientAudioUrl,
};

const cityMarketAmbientHandle = appAudioController.createAmbientLoopHandle({
  cueId: BUILTIN_AUDIO_CUE_IDS.ambienceCityMarket,
  fadeInMs: 1000,
  fadeOutMs: 1000,
  crossfadeMs: 1000,
});

const cityMarketAmbientController = new ScopedAmbientLoopController({
  target: cityMarketAmbientHandle,
  isActive: (snapshot: {
    isGameVisible: boolean;
    currentView: AppState["gameState"]["ui"]["currentView"];
  }) => snapshot.isGameVisible && snapshot.currentView === "city",
});

function syncAppAudio(): void {
  const result = createAppAudioOutput({
    appState,
    isGameVisible,
    sceneDefinitionsById: activeContentContext.storyContent.sceneDefinitionsById,
    session: appAudioSession,
  });
  appAudioSession = result.session;
  appAudioController.sync(result.output);
  cityMarketAmbientController.sync({
    isGameVisible,
    currentView: appState.gameState.ui.currentView,
  });
}
```

- [x] **Step 4: Re-run the controller and source tests until Task 3 is green**

Run:

```bash
npm.cmd run build:test
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
node --test --test-isolation=none tests/scoped-ambient-loop-controller.test.cjs tests/city-ambient-audio-source.test.cjs tests/audio-seam.test.cjs
```

Expected:

- `PASS`
- the reusable scope controller compiles and `src/main.ts` stays limited to static asset resolution plus one city-scope ambient sync.

- [ ] **Step 5: Commit the Task 3 shell wiring**

Run:

```bash
git add src/application/audio/scoped-ambient-loop-controller.ts src/assets/audio/ambient/city-market.mp3 src/main.ts tests/scoped-ambient-loop-controller.test.cjs tests/city-ambient-audio-source.test.cjs tests/audio-seam.test.cjs
git commit -m "feat: wire city market ambient controller"
```

## Task 4: Record The Contract, Run Final Verification, And Leave The Child Ready For Review

**Files:**
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-08-03-city-market-ambient-audio-plan.md`

**Interfaces:**
- Consumes:
  - final ambient cue id, asset path, handle factory, and scope controller names from Tasks 1-3
- Produces:
  - `docs/change-log.md` entry for the city market ambient audio contract
  - plan `Execution State` updated to `completed-but-open`
  - plan `Progress Log` appended with the final verification command set

- [x] **Step 1: Add the change-log entry for the new ambient audio contract**

Append this block near the top of `docs/change-log.md`:

```md
## 2026-08-03 City Market Ambient Audio Contract

### Added
- `audio-manager` 新增共享 `ambient` loop 路径与 `createAmbientLoopHandle(...)` seam，可在不打断主 BGM 的情况下并行播放长时环境声。
- 新增 `ScopedAmbientLoopController<TSnapshot>`，让壳层只需提供 `isGameVisible + currentView` 这类 snapshot，就能复用同一套环境声启停边界。
- 新增 repository-owned 资源 `src/assets/audio/ambient/city-market.mp3` 与 cue id `ambience.city.market`。

### Changed
- 城市界面的市集环境声现在只在 `currentView === "city"` 时激活；离开到 `house / scene / battle / map / city-3d` 时 1 秒淡出并保留播放位置，回城后从上次时间点 1 秒淡入继续播放。
- 长时环境声循环改为尾声 1 秒双播放器 crossfade，而不是依赖浏览器原生硬重启 loop。

### Impact
- 后续若要增加建筑、地图或战场环境声，可以复用同一套 ambient handle + scoped controller，而不需要在 `src/main.ts` 继续堆业务分支。
```

- [x] **Step 2: Update this plan's execution state and progress log for a completed local child**

Update this plan's `## Execution State` to:

```md
- Status: `completed-but-open`
- Last Updated: `2026-08-03`
- Current Focus: `Implementation complete; local verification is green; child remains open until the user requests review/push or a governance resync.`
- Next Step: `Review the diff, then choose whether to keep this as a local child or resync canonical project-progress before push.`
- Verification: `npm.cmd run lint:plans` passed; `npm.cmd run build:test` passed; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` wrote the CommonJS marker; `node --test --test-isolation=none tests/audio-manager.test.cjs tests/scoped-ambient-loop-controller.test.cjs tests/city-ambient-audio-source.test.cjs tests/audio-seam.test.cjs` passed; `npm.cmd run typecheck` passed; `npm.cmd run build` passed
- Notes: `docs/superpowers/project-progress.md still points to City Specialty Market, so this ambient-audio child remains local unless the user explicitly requests governance resync.`
```

Append this `## Progress Log` entry:

```md
- 2026-08-03
  - Summary: `Implemented the reusable city market ambient loop, including the parallel ambient handle, saved-position resume, tail crossfade, and city-scope shell wiring.`
  - Verification: `npm.cmd run lint:plans` passed; `npm.cmd run build:test` passed; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` wrote the CommonJS marker; `node --test --test-isolation=none tests/audio-manager.test.cjs tests/scoped-ambient-loop-controller.test.cjs tests/city-ambient-audio-source.test.cjs tests/audio-seam.test.cjs` passed; `npm.cmd run typecheck` passed; `npm.cmd run build` passed
  - Next: `Keep the child open locally unless the user requests review/push or canonical progress resync.`
```

- [x] **Step 3: Run the full final verification sweep**

Run:

```bash
npm.cmd run lint:plans
npm.cmd run build:test
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
node --test --test-isolation=none tests/audio-manager.test.cjs tests/scoped-ambient-loop-controller.test.cjs tests/city-ambient-audio-source.test.cjs tests/audio-seam.test.cjs
npm.cmd run typecheck
npm.cmd run build
```

Expected:

- `PASS`
- if an unrelated pre-existing repo warning remains, record it exactly in `Execution State.Verification` instead of silently treating it as an ambient-audio failure.

- [ ] **Step 4: Commit the final docs and verification state**

Run:

```bash
git add docs/change-log.md docs/superpowers/plans/2026-08-03-city-market-ambient-audio-plan.md
git commit -m "docs: record city market ambient audio contract"
```

## Exit Check

- [x] `ambience.city.market` is registered centrally and resolves to `audio/ambient/city-market.mp3`.
- [x] The app audio controller can create a dedicated ambient loop handle that runs in parallel with main BGM.
- [x] The ambient loop handle fades in, fades out, preserves playback position, and crossfades its loop tail.
- [x] `ScopedAmbientLoopController<TSnapshot>` exists and toggles a target handle only when scope activity changes.
- [x] `src/main.ts` only wires one city-scope ambient controller using `{ isGameVisible, currentView }`.
- [x] `docs/change-log.md` records the new ambient runtime contract.
- [x] This plan's `Execution State` and `Progress Log` are updated before the child is considered complete.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `City Market Ambient Audio`
- Parent Task: `Untracked local city ambient audio batch`
- Parent Stage: `Untracked local city ambient audio batch`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Review the diff, then choose whether to keep this local child or resync canonical project-progress before push.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-08-03-city-market-ambient-audio-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, note that canonical progress still points to the open City Specialty Market child, then review this local ambient-audio diff and decide whether to keep it local or resync before push.`
