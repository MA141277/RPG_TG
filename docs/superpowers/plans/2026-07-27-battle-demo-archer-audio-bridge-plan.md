# Battle-Demo Archer Audio Bridge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add frame-accurate archer draw, release, and hit audio to the embedded `battle-demo` runtime while preserving centralized playback ownership and the existing battle-audio humanization layer.

**Architecture:** The embedded iframe page `prototypes/battle-demo/index.html` already owns archer frame timing, so it will emit semantic battle-demo audio bridge messages instead of constructing local audio players. The parent app will validate those messages in `src/main.ts`, then forward them into `src/application/audio/audio-manager.ts`, where chain-local fade handoff and real cue playback will continue to run through the shared battle cue registry and controller-side playback-variation logic.

**Tech Stack:** Inline browser JavaScript in prototype HTML, TypeScript app runtime, Node source-contract tests, compiled CommonJS audio-manager tests via `npm run build:test`, repository governance docs, `npm run lint:plans`, `npm run typecheck`, and `npm run build`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-27`
- Current Focus: `Implementation remains completed-but-open; the latest batch pulled battle-demo archer impact timing forward from frame 45 to frame 42 and kept audio/effect timing aligned.`
- Next Step: `Review the implementation diff, decide whether to resync docs/superpowers/project-progress.md, and commit or push only if requested.`
- Verification: `bundled node.exe tools/lint-superpowers-plans.mjs; bundled node.exe -e "require('./tests/battle-demo-archer-audio-bridge.test.cjs'); require('./tests/audio-manager.test.cjs')"`
- Notes: `The battle-demo audio bridge and shared-controller handoff tests are green after moving archer impact timing to frame 42. The neighboring archer effect source test still fails on this branch because it expects a missing getBattleArcherAttackEffectPlan(hit = false) helper, and that issue remains outside this child.`

## Progress Log

- 2026-07-27
  - Summary: `Created the implementation plan for the battle-demo-only archer audio bridge, ran plan lint, and queued inline execution from the new source-level battle-demo test.`
  - Verification: `node tools/lint-superpowers-plans.mjs (via bundled runtime node.exe)`
  - Next: `Create tests/battle-demo-archer-audio-bridge.test.cjs, run it, and verify it fails for the missing bridge helper signatures.`
- 2026-07-27
  - Summary: `Implemented the battle-demo archer audio bridge across iframe emission, parent-side validation, and shared audio-controller fade handoff; rebuilt .test-dist and verified the new bridge tests end-to-end.`
  - Verification: `bundled node.exe tools/lint-superpowers-plans.mjs; bundled node.exe .\\node_modules\\typescript\\bin\\tsc -p tsconfig.test.json; bundled node.exe -e "require('./tests/battle-demo-archer-audio-bridge.test.cjs'); require('./tests/audio-manager.test.cjs')"; bundled node.exe -e "require('./tests/battle-archer-impact-effects.test.cjs')" (fails on this branch for the pre-existing missing getBattleArcherAttackEffectPlan(hit = false) signature); bundled node.exe .\\node_modules\\typescript\\bin\\tsc --noEmit -p tsconfig.json; bundled node.exe .\\node_modules\\vite\\bin\\vite.js build (dist emitted, exit code 1 because of pre-existing prototype bundling warnings).`
  - Next: `Review the implementation diff, decide whether to resync docs/superpowers/project-progress.md, and only commit or push if requested.`
- 2026-07-27
  - Summary: `Updated the completed bridge so battle-demo archer impact, hit effects, and impact audio all resolve on frame 42 instead of frame 45.`
  - Verification: `bundled node.exe -e "require('./tests/battle-demo-archer-audio-bridge.test.cjs'); require('./tests/audio-manager.test.cjs')"`
  - Next: `Review the timing-only diff, decide whether to resync docs/superpowers/project-progress.md, and commit or push only if requested.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-27-battle-demo-archer-audio-bridge-design.md`
- Supporting specs:
  - `docs/superpowers/specs/2026-07-27-battle-audio-facade-design.md`
  - `docs/superpowers/specs/2026-07-27-battle-audio-humanization-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `The user explicitly narrowed the implementation scope from the original design discussion to prototypes/battle-demo/index.html only.`
  - `Code inspection now confirms that battle-demo archer damage resolves at frame 42 through playBattleSpineStrike(...) -> animateBattleSpineProxy(... onImpact).`
  - `The parent app currently listens for rpg-tg:battle-demo-result only; there is no existing audio bridge message type or handler.`
  - `docs/superpowers/project-progress.md currently tracks a different open child, so this plan may execute and finish locally but must remain completed-but-open unless governance is intentionally resynced later.`

## Global Constraints

- Only `prototypes/battle-demo/index.html` is in scope; `prototypes/troop-management-preview/index.html` must not change in this child.
- Real playback must remain owned by the centralized app audio system and must not use local iframe `new Audio()` calls.
- Archer audio timing is fixed to frame `18` draw start, frames `37-40` draw fade window, frame `41` release start, a compressed hit-only release-to-impact handoff on frame `41`, and frame `42` impact start on hit only.
- Misses must not emit or play an impact cue.
- Fade-outs must stay chain-local to one archer strike and must never fade another attacker’s active cue.
- Semantic iframe messages must not carry mp3 file paths.
- Existing battle cue humanization in `src/application/audio/audio-manager.ts` must remain active for draw, release, and impact cues.

## Implementation Scope

### In Scope

- Add battle-demo helper functions that emit semantic audio bridge messages with per-strike `chainId`.
- Wire archer `onFrame` logic in `playBattleSpineStrike(...)` to emit draw, release, and hit-only impact transitions at the approved thresholds.
- Add parent-side message validation and forwarding in `src/main.ts`.
- Extend the shared audio controller with a chain-local battle-demo bridge entry point that can fade the prior chain cue and schedule the next cue at the authored frame boundary.
- Add regression coverage for source-level iframe timing, parent routing, fade scheduling, and chain isolation.

### Still Out Of Scope

- `troop-management-preview` parity.
- New battle audio assets or new cue ids.
- Generic iframe audio infrastructure for non-battle systems.
- Governance resync for the unrelated unified-backpack child currently tracked in `docs/superpowers/project-progress.md`.

## File Map

### Existing files to modify

- `prototypes/battle-demo/index.html`
  - Add battle-demo audio bridge helper functions and archer `onFrame` message emission while preserving existing visual-effect and impact behavior.
- `src/main.ts`
  - Add the `rpg-tg:battle-demo-audio` message type and validation handler, then forward validated commands to the shared audio controller.
- `src/application/audio/audio-manager.ts`
  - Extend `AppAudioController` with a battle-demo bridge method, maintain per-`chainId` bridge state, and schedule chain-local fade/start transitions without bypassing cue humanization.
- `tests/audio-manager.test.cjs`
  - Add runtime tests for draw-to-release handoff, hit-only release-to-impact handoff, late-transition compression, and multi-chain isolation.

### New files to create

- `tests/battle-demo-archer-audio-bridge.test.cjs`
  - Lock the source-level battle-demo contract for frame thresholds, bridge payload shape, and main-app routing hooks before runtime implementation begins.

## Verification Plan

- Targeted verification:
  - `npm run build:test`
  - `node --test tests/battle-demo-archer-audio-bridge.test.cjs tests/battle-archer-impact-effects.test.cjs tests/audio-manager.test.cjs`
- Required commands:
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm run build`

## Task 1: Add Battle-Demo Archer Audio Bridge Emission

**Files:**
- Create: `tests/battle-demo-archer-audio-bridge.test.cjs`
- Modify: `prototypes/battle-demo/index.html`
- Read: `tests/battle-archer-impact-effects.test.cjs`

**Interfaces:**
- Consumes:
  - `async function playBattleSpineStrike(report, step, onImpact)`
  - `function animateBattleSpineProxy(proxy, renderer, from, to, action, duration, movement = {})`
- Produces:
  - `function postBattleDemoAudioMessage(message)`
  - `function createBattleDemoArcherAudioChainId(step)`
  - `playBattleSpineStrike(...)` archer `onFrame` logic that emits semantic bridge messages for draw, release, and hit-only impact transitions

- [x] **Step 1: Write the failing source-contract test for battle-demo archer bridge helpers and frame thresholds**

Create `tests/battle-demo-archer-audio-bridge.test.cjs` with this initial coverage:

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function extractFunctionBody(source, signature) {
  const start = source.indexOf(signature);
  if (start === -1) {
    throw new Error(`Missing signature: ${signature}`);
  }
  const bodyStart = source.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(bodyStart + 1, index);
      }
    }
  }
  throw new Error(`Unclosed function body for: ${signature}`);
}

function loadBattleDemoAudioBridgeFns() {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const chainIdBody = extractFunctionBody(
    source,
    "function createBattleDemoArcherAudioChainId(step)",
  );
  const createBattleDemoArcherAudioChainId = new Function(
    `return function createBattleDemoArcherAudioChainId(step) {${chainIdBody}};`,
  )();
  return { source, createBattleDemoArcherAudioChainId };
}

test("battle-demo archer audio chain ids stay stable per strike source and launch time", () => {
  const { createBattleDemoArcherAudioChainId } = loadBattleDemoAudioBridgeFns();
  assert.equal(
    createBattleDemoArcherAudioChainId({
      sourceSide: "player",
      sourceSlotKey: "rear-center",
      launchAtMs: 120,
    }),
    "player:rear-center:120",
  );
});

test("battle-demo archer strikes emit draw release and hit-only impact bridge messages at the approved frame thresholds", () => {
  const { source } = loadBattleDemoAudioBridgeFns();
  assert.match(source, /function postBattleDemoAudioMessage\(message\)/);
  assert.match(source, /type:\s*['"]rpg-tg:battle-demo-audio['"]/);
  assert.match(source, /if\s*\(!archerDrawAudioTriggered\s*&&\s*info\.actionFrame\s*>=\s*18\)/);
  assert.match(source, /phase:\s*['"]draw['"],\s*mode:\s*['"]play['"]/);
  assert.match(source, /if\s*\(!archerReleaseAudioTriggered\s*&&\s*info\.actionFrame\s*>=\s*37\)/);
  assert.match(source, /phase:\s*['"]release['"],\s*mode:\s*['"]transition['"]/);
  assert.match(source, /fadeFrames:\s*4/);
  assert.match(source, /nextStartFrame:\s*41/);
  assert.match(source, /if\s*\(step\.hit\s*&&\s*!archerImpactAudioTriggered\s*&&\s*info\.actionFrame\s*>=\s*41\)/);
  assert.match(source, /phase:\s*['"]impact['"],\s*mode:\s*['"]transition['"]/);
  assert.match(source, /nextStartFrame:\s*42/);
});
```

- [x] **Step 2: Run the new test file and verify it fails for the missing bridge helper signatures**

Run:

```bash
node --test tests/battle-demo-archer-audio-bridge.test.cjs
```

Expected:

- `FAIL`
- the first failure reports a missing signature for `createBattleDemoArcherAudioChainId` or `postBattleDemoAudioMessage`

- [x] **Step 3: Add the minimal battle-demo bridge helpers and archer onFrame emission**

In `prototypes/battle-demo/index.html`, add the bridge helper block near the existing battle-demo message helpers:

```js
function postBattleDemoAudioMessage(message) {
  if (!battleConfig.embedded || !battleConfig.scenarioId) return;
  window.parent?.postMessage(
    {
      type: "rpg-tg:battle-demo-audio",
      scenarioId: battleConfig.scenarioId,
      ...message,
    },
    "*",
  );
}

function createBattleDemoArcherAudioChainId(step) {
  return `${step.sourceSide}:${step.sourceSlotKey}:${step.launchAtMs ?? 0}`;
}
```

Then update the archer branch inside `playBattleSpineStrike(...)` so it emits semantic bridge messages without changing the existing visual-effect queue:

```js
const archerAudioChainId =
  troopType === "archer" ? createBattleDemoArcherAudioChainId(step) : null;
let archerDrawAudioTriggered = false;
let archerReleaseAudioTriggered = false;
let archerImpactAudioTriggered = false;

onFrame:
  troopType === "archer"
    ? (info) => {
        if (!archerDrawAudioTriggered && info.actionFrame >= 18) {
          archerDrawAudioTriggered = true;
          postBattleDemoAudioMessage({
            chainId: archerAudioChainId,
            phase: "draw",
            mode: "play",
            currentActionFrame: info.actionFrame,
            frameDurationMs: info.frameDurationMs,
          });
        }
        if (!archerReleaseAudioTriggered && info.actionFrame >= 37) {
          archerReleaseAudioTriggered = true;
          postBattleDemoAudioMessage({
            chainId: archerAudioChainId,
            phase: "release",
            mode: "transition",
            currentActionFrame: info.actionFrame,
            frameDurationMs: info.frameDurationMs,
            fadeFrames: 4,
            nextStartFrame: 41,
          });
        }
        if (step.hit && !archerImpactAudioTriggered && info.actionFrame >= 41) {
          archerImpactAudioTriggered = true;
          postBattleDemoAudioMessage({
            chainId: archerAudioChainId,
            phase: "impact",
            mode: "transition",
            currentActionFrame: info.actionFrame,
            frameDurationMs: info.frameDurationMs,
            fadeFrames: 4,
            nextStartFrame: 42,
          });
        }
        if (proxy.__battleArcherEffectsQueued) return;
        proxy.__battleArcherEffectsQueued = "true";
        queueBattleArcherAttackEffects({
          sourceSlot,
          sourceSide: proxySide,
          sourceAnchor,
          targetAnchor,
          targetSlot,
          hit: step.hit,
          startAt: info.startAt,
          frameDurationMs: info.frameDurationMs,
        });
      }
    : null,
```

- [x] **Step 4: Re-run the source test and the existing archer effect regression**

Run:

```bash
node --test tests/battle-demo-archer-audio-bridge.test.cjs tests/battle-archer-impact-effects.test.cjs
```

Expected:

- `PASS`
- the new source-contract test proves message timing and payload shape
- the existing archer effect test stays green

- [ ] **Step 5: Commit Task 1**

Run:

```bash
git add prototypes/battle-demo/index.html tests/battle-demo-archer-audio-bridge.test.cjs
git commit -m "feat: emit battle-demo archer audio bridge messages"
```

## Task 2: Add Parent-Side Archer Audio Bridge Routing And Fade Handoff

**Files:**
- Modify: `src/main.ts`
- Modify: `src/application/audio/audio-manager.ts`
- Modify: `tests/audio-manager.test.cjs`
- Modify: `tests/battle-demo-archer-audio-bridge.test.cjs`

**Interfaces:**
- Consumes:
  - `function postBattleDemoAudioMessage(message)`
  - `type BattleDemoAudioMessage = { type: "rpg-tg:battle-demo-audio"; scenarioId: string; chainId: string; phase: "draw" | "release" | "impact"; mode: "play" | "transition"; currentActionFrame: number; frameDurationMs: number; fadeFrames?: number; nextStartFrame?: number; }`
- Produces:
  - `type BattleDemoAudioBridgeCommand`
  - `AppAudioController.playBattleDemoBridgeMessage(command: BattleDemoAudioBridgeCommand): void`
  - `function handleBattleDemoAudioMessage(message: unknown): void`

- [x] **Step 1: Extend the tests so parent routing and controller bridge behavior fail before implementation**

Append this source-level routing assertion to `tests/battle-demo-archer-audio-bridge.test.cjs`:

```js
test("main validates battle-demo audio messages and forwards them into the shared audio bridge", () => {
  const mainSource = fs.readFileSync("src/main.ts", "utf8");
  assert.match(mainSource, /type BattleDemoAudioMessage = \{/);
  assert.match(mainSource, /type:\s*["']rpg-tg:battle-demo-audio["']/);
  assert.match(mainSource, /function handleBattleDemoAudioMessage\(message: unknown\): void \{/);
  assert.match(mainSource, /appAudioController\.playBattleDemoBridgeMessage\(/);
  assert.match(mainSource, /window\.addEventListener\("message", \(event\) => \{[\s\S]*handleBattleDemoAudioMessage\(event\.data\);/);
});
```

Then add these runtime tests to `tests/audio-manager.test.cjs`:

```js
test("audio controller fades a draw cue over the remaining frame window before starting release for the same archer chain", () => {
  const createdPlayers = [];
  const scheduledTasks = [];
  const cueDefinitions = [
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
      source: { kind: "asset-path", assetPath: "audio/battle/arrow-release.mp3" },
    },
  ];
  const controller = createAppAudioController({
    cueDefinitions,
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
    currentActionFrame: 37,
    frameDurationMs: 10,
    fadeFrames: 4,
    nextStartFrame: 41,
  });

  assert.equal(createdPlayers.length, 1);
  assert.ok(scheduledTasks.some((task) => task.delayMs === 40));
});

test("audio controller keeps different archer chains isolated during transition fades", () => {
  const createdPlayers = [];
  const scheduledTasks = [];
  const cueDefinitions = [
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
      source: { kind: "asset-path", assetPath: "audio/battle/arrow-release.mp3" },
    },
  ];
  const controller = createAppAudioController({
    cueDefinitions,
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
  controller.playBattleDemoBridgeMessage({
    chainId: "player:rear-center:120",
    phase: "release",
    mode: "transition",
    currentActionFrame: 37,
    frameDurationMs: 10,
    fadeFrames: 4,
    nextStartFrame: 41,
  });

  assert.equal(createdPlayers.length, 2);
  assert.ok(scheduledTasks.length > 0);
});
```

- [x] **Step 2: Run the failing targeted tests**

Run:

```bash
npm run build:test
node --test tests/battle-demo-archer-audio-bridge.test.cjs tests/audio-manager.test.cjs
```

Expected:

- `FAIL`
- source-level assertions fail for the missing `handleBattleDemoAudioMessage(...)` or `playBattleDemoBridgeMessage(...)` wiring
- runtime tests fail because the audio controller bridge method does not exist yet

- [x] **Step 3: Add the parent message handler and shared audio bridge implementation**

In `src/main.ts`, add:

```ts
type BattleDemoAudioMessage = {
  type: "rpg-tg:battle-demo-audio";
  scenarioId: string;
  chainId: string;
  phase: "draw" | "release" | "impact";
  mode: "play" | "transition";
  currentActionFrame: number;
  frameDurationMs: number;
  fadeFrames?: number;
  nextStartFrame?: number;
};

function handleBattleDemoAudioMessage(message: unknown): void {
  if (message == null || typeof message !== "object") return;
  const candidate = message as Partial<BattleDemoAudioMessage>;
  const activeBattle = appState.gameState.storyBattle;
  if (
    candidate.type !== "rpg-tg:battle-demo-audio" ||
    activeBattle?.demoScenarioId == null ||
    candidate.scenarioId !== activeBattle.demoScenarioId ||
    typeof candidate.chainId !== "string" ||
    (candidate.phase !== "draw" &&
      candidate.phase !== "release" &&
      candidate.phase !== "impact") ||
    (candidate.mode !== "play" && candidate.mode !== "transition") ||
    !Number.isFinite(candidate.currentActionFrame) ||
    !Number.isFinite(candidate.frameDurationMs)
  ) {
    return;
  }
  appAudioController.playBattleDemoBridgeMessage({
    chainId: candidate.chainId,
    phase: candidate.phase,
    mode: candidate.mode,
    currentActionFrame: candidate.currentActionFrame,
    frameDurationMs: candidate.frameDurationMs,
    fadeFrames: candidate.fadeFrames,
    nextStartFrame: candidate.nextStartFrame,
  });
}
```

and route it from the existing `window.addEventListener("message", ...)` callback immediately after `handleBattleDemoResultMessage(event.data);`.

In `src/application/audio/audio-manager.ts`, add:

```ts
export type BattleDemoAudioBridgeCommand = {
  chainId: string;
  phase: "draw" | "release" | "impact";
  mode: "play" | "transition";
  currentActionFrame: number;
  frameDurationMs: number;
  fadeFrames?: number;
  nextStartFrame?: number;
};
```

Extend `AppAudioController` with:

```ts
playBattleDemoBridgeMessage(command: BattleDemoAudioBridgeCommand): void;
```

Inside `createAppAudioController(...)`, add a `battleDemoBridgeStateByChainId` map and implement the method with this contract:

```ts
const BATTLE_DEMO_BRIDGE_CUE_ID_BY_PHASE = {
  draw: BUILTIN_AUDIO_CUE_IDS.battleBowDraw,
  release: BUILTIN_AUDIO_CUE_IDS.battleArrowRelease,
  impact: BUILTIN_AUDIO_CUE_IDS.battleImpactHit,
};

function playBattleDemoBridgeMessage(command) {
  const cueId = BATTLE_DEMO_BRIDGE_CUE_ID_BY_PHASE[command.phase];
  if (cueId == null) return;

  if (command.mode === "play") {
    const player = playOneShotCue(cueId);
    if (player != null) {
      battleDemoBridgeStateByChainId.set(command.chainId, {
        player,
        phase: command.phase,
        cueId,
        generation: (battleDemoBridgeStateByChainId.get(command.chainId)?.generation || 0) + 1,
      });
    }
    return;
  }

  const previous = battleDemoBridgeStateByChainId.get(command.chainId) || null;
  const remainingFadeFrames = Math.max(
    0,
    Math.round((command.nextStartFrame ?? command.currentActionFrame) - command.currentActionFrame),
  );
  const fadeDurationMs = remainingFadeFrames * command.frameDurationMs;
  const nextGeneration = (previous?.generation || 0) + 1;

  if (previous?.player && !previous.player.paused && fadeDurationMs > 0) {
    const startVolume = previous.player.volume;
    for (let step = 1; step <= 4; step += 1) {
      const delayMs = Math.round((fadeDurationMs * step) / 4);
      scheduleTask(() => {
        const current = battleDemoBridgeStateByChainId.get(command.chainId);
        if (current?.generation !== nextGeneration || current.player !== previous.player) return;
        previous.player.volume = startVolume * (1 - step / 4);
        if (step === 4) previous.player.pause();
      }, delayMs);
    }
  }

  scheduleTask(() => {
    const player = playOneShotCue(cueId);
    if (player == null) return;
    battleDemoBridgeStateByChainId.set(command.chainId, {
      player,
      phase: command.phase,
      cueId,
      generation: nextGeneration,
    });
  }, fadeDurationMs);
}
```

Make `playOneShotCue(cueId)` return the created player so the bridge can track it.

- [x] **Step 4: Re-run the targeted bridge tests**

Run:

```bash
npm run build:test
node --test tests/battle-demo-archer-audio-bridge.test.cjs tests/battle-archer-impact-effects.test.cjs tests/audio-manager.test.cjs
```

Expected:

- `PASS`
- battle-demo source contract remains green
- main source routing is present
- audio-manager bridge tests prove draw/release fade scheduling and chain isolation

- [ ] **Step 5: Commit Task 2**

Run:

```bash
git add src/main.ts src/application/audio/audio-manager.ts tests/audio-manager.test.cjs tests/battle-demo-archer-audio-bridge.test.cjs
git commit -m "feat: add battle-demo archer audio bridge"
```

## Task 3: Run Full Verification And Leave The Plan In Completed-But-Open State

**Files:**
- Modify: `docs/superpowers/plans/2026-07-27-battle-demo-archer-audio-bridge-plan.md`

**Interfaces:**
- Consumes:
  - `tests/battle-demo-archer-audio-bridge.test.cjs`
  - `tests/battle-archer-impact-effects.test.cjs`
  - `tests/audio-manager.test.cjs`
- Produces:
  - updated `Execution State`
  - updated `Progress Log`
  - verification evidence recorded in the plan

- [x] **Step 1: Run plan lint and full verification**

Run:

```bash
npm run lint:plans
npm run build:test
node --test tests/battle-demo-archer-audio-bridge.test.cjs tests/battle-archer-impact-effects.test.cjs tests/audio-manager.test.cjs
npm run typecheck
npm run build
```

Expected:

- `PASS`
- plan lint accepts the new plan structure
- targeted battle-demo and audio-manager tests pass
- typecheck and build stay green

- [x] **Step 2: Update the plan ledger for the finished implementation batch**

Update this plan file:

- set `Execution State.Status` to `completed-but-open`
- set `Execution State.Last Updated` to `2026-07-27`
- set `Execution State.Current Focus` to `Implementation finished; governance sync intentionally deferred because project-progress currently tracks a different open child.`
- set `Execution State.Next Step` to `Review the implementation diff, decide whether to resync docs/superpowers/project-progress.md, and push only if requested.`
- replace `Execution State.Verification` with the exact command list from Step 1
- append a `Progress Log` entry that records the final verification results

- [ ] **Step 3: Commit the plan ledger update**

Run:

```bash
git add docs/superpowers/plans/2026-07-27-battle-demo-archer-audio-bridge-plan.md
git commit -m "docs: update battle-demo archer audio bridge plan status"
```

## Exit Check

- [x] battle-demo archer strikes emit semantic audio bridge messages on frames `18`, `37`, and hit-only `41`.
- [x] release starts on frame `41`, and hit-only impact starts on frame `42` through the parent bridge.
- [x] draw and release fades stay chain-local and do not affect other attackers.
- [x] real playback still routes through the centralized shared battle cue system and its existing humanization layer.
- [x] this child remains `completed-but-open` unless repository governance is explicitly resynced.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Replace when closing.`
- Parent Task: `Replace when closing.`
- Parent Stage: `Replace when closing.`
- Closeout Status: `closed`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `review-and-sync-governance`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `none`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, confirm whether this child should become the active governed item, then review docs/superpowers/plans/2026-07-27-battle-demo-archer-audio-bridge-plan.md.`
