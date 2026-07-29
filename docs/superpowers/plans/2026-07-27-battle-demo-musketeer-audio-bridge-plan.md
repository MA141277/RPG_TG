# Battle-Demo Musketeer Audio Bridge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add frame-accurate musketeer reload and fire audio to the embedded `battle-demo` runtime while preserving centralized playback ownership and the existing battle-audio humanization layer.

**Architecture:** The embedded iframe page `prototypes/battle-demo/index.html` already owns musketeer frame timing, so it will emit semantic battle-demo audio bridge messages instead of constructing local audio players. The parent app will validate those messages in `src/main.ts`, then forward them into `src/application/audio/audio-manager.ts`, where chain-local fade handoff and real cue playback will continue to run through the shared battle cue registry and controller-side playback-variation logic.

**Tech Stack:** Inline browser JavaScript in prototype HTML, TypeScript app runtime, Node source-contract tests, compiled CommonJS audio-manager tests via `npm run build:test`, repository governance docs, `npm run lint:plans`, `npm run typecheck`, and `npm run build`.

## Global Constraints

- Only `battle-demo` is in scope; `prototypes/troop-management-preview/index.html` must not change in this child.
- Real playback must remain owned by the centralized app audio system and must not use local iframe `new Audio()` calls.
- Musketeer audio timing is fixed to frame `9` reload start, frames `26-28` reload fade window, and frame `29` fire start; frame `30` remains gameplay damage timing only and must not trigger a musketeer-specific audio cue.
- Fire must play on both hit and miss.
- Fade-outs must stay chain-local to one musketeer strike and must never fade another attacker's active cue.
- Semantic iframe messages must not carry mp3 file paths.
- New mp3 assets must use ASCII filenames under `src/assets/audio/battle/`.
- Existing battle cue humanization in `src/application/audio/audio-manager.ts` must remain active for reload and fire cues.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-27`
- Current Focus: `Implementation remains completed-but-open; the mistaken musketeer impact-audio bridge has been removed, leaving reload/fire playback only.`
- Next Step: `Review the implementation diff, decide whether to resync docs/superpowers/project-progress.md, and commit or push only if requested.`
- Verification: `bundled node.exe -e "require('./tests/battle-demo-archer-audio-bridge.test.cjs'); require('./tests/battle-demo-musketeer-audio-bridge.test.cjs'); require('./tests/audio-seam.test.cjs'); require('./tests/audio-manager.test.cjs')"; bundled node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json; bundled node.exe tools/lint-superpowers-plans.mjs. Prior known build state from the previous batch remains: vite build emitted dist and exited 1 on pre-existing prototype warnings; that build was not rerun in this bugfix-only batch.`
- Notes: `docs/superpowers/project-progress.md currently tracks a different open child, so this plan may execute locally but should remain completed-but-open unless governance is intentionally resynced later.`

## Progress Log

- 2026-07-27
  - Summary: `Created the battle-demo musketeer audio bridge spec and implementation plan from the approved frame contract.`
  - Verification: `bundled node.exe tools/lint-superpowers-plans.mjs`
  - Next: `Write and run the failing musketeer source, asset, and runtime bridge tests before touching production code.`
- 2026-07-27
  - Summary: `Copied the provided musketeer reload/fire mp3 assets into src/assets/audio/battle, extended the battle-demo bridge for reload/fire phases, and wired the shared cue registry plus main asset resolver to own the new sounds.`
  - Verification: `bundled node.exe -e "require('./tests/battle-demo-archer-audio-bridge.test.cjs'); require('./tests/battle-demo-musketeer-audio-bridge.test.cjs'); require('./tests/audio-seam.test.cjs'); require('./tests/audio-manager.test.cjs')"; bundled node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json; bundled node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json; bundled node.exe .\node_modules\vite\bin\vite.js build (dist emitted, exit code 1 after pre-existing prototype HTML/script warnings).`
  - Next: `Review the implementation diff, decide whether to resync docs/superpowers/project-progress.md, and commit or push only if requested.`
- 2026-07-27
  - Summary: `Removed the mistaken musketeer impact-audio bridge after user review; musketeer attacks now emit reload and fire only, while frame 30 remains gameplay damage timing without a separate hit cue.`
  - Verification: `bundled node.exe -e "require('./tests/battle-demo-archer-audio-bridge.test.cjs'); require('./tests/battle-demo-musketeer-audio-bridge.test.cjs'); require('./tests/audio-seam.test.cjs'); require('./tests/audio-manager.test.cjs')"; bundled node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json; bundled node.exe tools/lint-superpowers-plans.mjs`
  - Next: `Review the no-impact bugfix diff, decide whether to resync docs/superpowers/project-progress.md, and commit or push only if requested.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-27-battle-demo-musketeer-audio-bridge-design.md`
- Supporting specs:
  - `docs/superpowers/specs/2026-07-27-battle-demo-archer-audio-bridge-design.md`
  - `docs/superpowers/specs/2026-07-27-battle-audio-humanization-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `The repository already has an archer-only battle-demo audio bridge that validates rpg-tg:battle-demo-audio messages and maps draw/release/impact in the shared controller.`
  - `Code inspection confirms musketeer strikes already resolve impact on frame 30 through BATTLE_SPINE_TROOP_ASSETS.musketeer.attackImpactFrame.`
  - `The provided reload and fire mp3 files currently live outside the repository and are not yet wired through src/main.ts.`
  - `docs/superpowers/project-progress.md currently tracks a different open child, so this plan should stop at completed-but-open unless governance is intentionally resynced later.`

## Implementation Scope

### In Scope

- Copy the provided musketeer reload and fire mp3 assets into the repository with stable ASCII filenames.
- Extend the shared cue registry and static asset resolver with musketeer reload and fire cues.
- Extend the battle-demo iframe bridge contract, message validation, and phase map to support musketeer reload/fire while preserving archer behavior.
- Wire `playBattleSpineStrike(...)` so musketeer attacks emit reload and fire transitions only.
- Add regression coverage for source timing, asset imports, cue mapping, fade scheduling, and chain isolation.

### Still Out Of Scope

- `troop-management-preview` parity.
- New musketeer hit visual effects.
- Any change to musketeer hit timing beyond the existing frame 30 contract.
- Governance resync for the unrelated child currently tracked in `docs/superpowers/project-progress.md`.

## File Map

### Existing files to modify

- `prototypes/battle-demo/index.html`
  - Add musketeer battle-demo audio chain helpers and `onFrame` message emission while preserving the existing archer bridge and visual behavior.
- `src/application/audio/audio-manager.ts`
  - Add musketeer cue ids/definitions and extend the shared battle-demo bridge phase map.
- `src/main.ts`
  - Import the new mp3 assets, extend the static battle asset URL map, and validate `reload`/`fire` phases.
- `tests/audio-manager.test.cjs`
  - Add runtime tests for musketeer reload-to-fire fade handoff and keep the bridge coverage aligned with the no-impact requirement.
- `tests/audio-seam.test.cjs`
  - Lock the new battle asset imports and static URL mapping.

### New files to create

- `tests/battle-demo-musketeer-audio-bridge.test.cjs`
  - Lock the source-level musketeer frame thresholds, chain-id helper, and no-impact contract.
- `src/assets/audio/battle/musketeer-reload.mp3`
  - Repository copy of the provided musketeer reload sound.
- `src/assets/audio/battle/musketeer-fire.mp3`
  - Repository copy of the provided musketeer fire sound.

## Verification Plan

- Targeted verification:
  - `node --test tests/battle-demo-musketeer-audio-bridge.test.cjs tests/audio-seam.test.cjs`
  - `npm run build:test`
  - `node --test tests/audio-manager.test.cjs`
- Required commands:
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm run build`

### Task 1: Add The Musketeer Asset And Source Contract Tests

**Files:**
- Create: `tests/battle-demo-musketeer-audio-bridge.test.cjs`
- Modify: `tests/audio-seam.test.cjs`
- Read: `prototypes/battle-demo/index.html`
- Read: `src/main.ts`

**Interfaces:**
- Consumes:
  - `function postBattleDemoAudioMessage(message)`
  - `type BattleDemoAudioMessage`
- Produces:
  - `function createBattleDemoMusketeerAudioChainId(step)`
  - source-level assertions for reload/fire/impact frame thresholds
  - asset-wiring assertions for `musketeer-reload.mp3` and `musketeer-fire.mp3`

- [x] **Step 1: Write the failing musketeer source-contract test**

Create `tests/battle-demo-musketeer-audio-bridge.test.cjs` with this initial coverage:

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

function loadBattleDemoMusketeerAudioBridgeFns() {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const chainIdBody = extractFunctionBody(
    source,
    "function createBattleDemoMusketeerAudioChainId(step)",
  );
  const createBattleDemoMusketeerAudioChainId = new Function(
    `return function createBattleDemoMusketeerAudioChainId(step) {${chainIdBody}};`,
  )();
  return { source, createBattleDemoMusketeerAudioChainId };
}

test("battle-demo musketeer audio chain ids stay stable per strike source and launch time", () => {
  const { createBattleDemoMusketeerAudioChainId } = loadBattleDemoMusketeerAudioBridgeFns();
  assert.equal(
    createBattleDemoMusketeerAudioChainId({
      sourceSide: "player",
      sourceSlotKey: "middle-right",
      launchAtMs: 210,
    }),
    "player:middle-right:210",
  );
});

test("battle-demo musketeer strikes emit reload and fire bridge messages but never emit impact audio", () => {
  const { source } = loadBattleDemoMusketeerAudioBridgeFns();
  assert.match(source, /if\\s*\\(!musketeerReloadAudioTriggered\\s*&&\\s*info\\.actionFrame\\s*>=\\s*9\\)/);
  assert.match(source, /phase:\\s*['"]reload['"],\\s*mode:\\s*['"]play['"]/);
  assert.match(source, /if\\s*\\(!musketeerFireAudioTriggered\\s*&&\\s*info\\.actionFrame\\s*>=\\s*26\\)/);
  assert.match(source, /phase:\\s*['"]fire['"],\\s*mode:\\s*['"]transition['"]/);
  assert.match(source, /fadeFrames:\\s*3/);
  assert.match(source, /nextStartFrame:\\s*29/);
  assert.doesNotMatch(source, /musketeerImpactAudioTriggered/);
  assert.match(source, /attackImpactFrame:\\s*30/);
});
```

- [x] **Step 2: Extend the battle asset seam test so it fails before implementation**

Append these assertions to `tests/audio-seam.test.cjs`:

```js
assert.match(
  source,
  /import battleMusketeerReloadAudioUrl from "\\.\\/assets\\/audio\\/battle\\/musketeer-reload\\.mp3\\?url";/
);
assert.match(
  source,
  /import battleMusketeerFireAudioUrl from "\\.\\/assets\\/audio\\/battle\\/musketeer-fire\\.mp3\\?url";/
);
assert.match(
  source,
  /"audio\\/battle\\/musketeer-reload\\.mp3": battleMusketeerReloadAudioUrl/
);
assert.match(
  source,
  /"audio\\/battle\\/musketeer-fire\\.mp3": battleMusketeerFireAudioUrl/
);
```

- [x] **Step 3: Run the new targeted tests and verify they fail**

Run:

```bash
node --test tests/battle-demo-musketeer-audio-bridge.test.cjs tests/audio-seam.test.cjs
```

Expected:

- `FAIL`
- the first failures report the missing `createBattleDemoMusketeerAudioChainId(...)` helper and the missing musketeer asset imports

- [x] **Step 4: Copy the provided musketeer mp3 assets into the repository with ASCII filenames**

Run:

```powershell
Copy-Item 'C:\Users\29636\Desktop\工作用文件\2026.7\音频和音效\火枪换弹.mp3' 'src\assets\audio\battle\musketeer-reload.mp3'
Copy-Item 'C:\Users\29636\Desktop\工作用文件\2026.7\音频和音效\火枪射击.mp3' 'src\assets\audio\battle\musketeer-fire.mp3'
```

Expected:

- both files exist under `src/assets/audio/battle/`
- filenames stay ASCII-only

- [x] **Step 5: Record the failing source output and proceed to the runtime bridge tests before production edits**

Result:

- the initial single-process targeted test run failed on the missing musketeer chain helper, missing `reload` / `fire` phase validation, and missing main-asset imports
- asset copying completed before the production-code batch, and the remaining missing behavior was then locked by the runtime bridge tests in Task 2

### Task 2: Implement The Musketeer Bridge Wiring

**Files:**
- Modify: `prototypes/battle-demo/index.html`
- Modify: `src/main.ts`
- Modify: `src/application/audio/audio-manager.ts`
- Modify: `tests/audio-manager.test.cjs`
- Modify: `tests/battle-demo-musketeer-audio-bridge.test.cjs`

**Interfaces:**
- Consumes:
  - `type BattleDemoAudioBridgeCommand`
  - `AppAudioController.playBattleDemoBridgeMessage(command)`
  - existing archer bridge helpers and controller fade behavior
- Produces:
  - `BUILTIN_AUDIO_CUE_IDS.battleMusketeerReload`
  - `BUILTIN_AUDIO_CUE_IDS.battleMusketeerFire`
  - `function createBattleDemoMusketeerAudioChainId(step)`
  - musketeer `onFrame` bridge messages for reload and fire only

- [x] **Step 1: Extend the runtime bridge tests so they fail before implementation**

Add these tests to `tests/audio-manager.test.cjs`:

```js
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

  assert.ok(scheduledTasks.some((task) => task.delayMs === 30));
});

```

- [x] **Step 2: Run `npm run build:test` and the targeted runtime test file to verify the new musketeer bridge tests fail**

Run:

```bash
bundled node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
bundled node.exe -e "require('./tests/audio-manager.test.cjs')"
```

Expected:

- `FAIL`
- the new tests fail because `reload` and `fire` are not yet valid bridge phases or cue ids

- [x] **Step 3: Implement the musketeer cue ids, asset imports, validator expansion, and iframe timing**

In `src/application/audio/audio-manager.ts`, add:

```ts
battleMusketeerReload: "battle.musketeer.reload",
battleMusketeerFire: "battle.musketeer.fire",
```

Extend the bridge phase map:

```ts
reload: BUILTIN_AUDIO_CUE_IDS.battleMusketeerReload,
fire: BUILTIN_AUDIO_CUE_IDS.battleMusketeerFire,
```

Register the new cue definitions with the same `BATTLE_ASSET_PLAYBACK_VARIATION` used by other battle mp3 cues:

```ts
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
```

In `src/main.ts`, import and map the new assets:

```ts
import battleMusketeerReloadAudioUrl from "./assets/audio/battle/musketeer-reload.mp3?url";
import battleMusketeerFireAudioUrl from "./assets/audio/battle/musketeer-fire.mp3?url";
```

and:

```ts
"audio/battle/musketeer-reload.mp3": battleMusketeerReloadAudioUrl,
"audio/battle/musketeer-fire.mp3": battleMusketeerFireAudioUrl,
```

Then expand `BattleDemoAudioMessage["phase"]` validation in `src/main.ts` to accept `reload` and `fire`.

In `prototypes/battle-demo/index.html`, add:

```js
function createBattleDemoMusketeerAudioChainId(step) {
  return `${step.sourceSide}:${step.sourceSlotKey}:${step.launchAtMs ?? 0}`;
}
```

Then extend `playBattleSpineStrike(...)` so the musketeer branch emits:

```js
const musketeerAudioChainId =
  troopType === "musketeer" ? createBattleDemoMusketeerAudioChainId(step) : null;
let musketeerReloadAudioTriggered = false;
let musketeerFireAudioTriggered = false;

if (troopType === "musketeer") {
  if (!musketeerReloadAudioTriggered && info.actionFrame >= 9) {
    musketeerReloadAudioTriggered = true;
    postBattleDemoAudioMessage({
      chainId: musketeerAudioChainId,
      phase: "reload",
      mode: "play",
      currentActionFrame: info.actionFrame,
      frameDurationMs: info.frameDurationMs,
    });
  }
  if (!musketeerFireAudioTriggered && info.actionFrame >= 26) {
    musketeerFireAudioTriggered = true;
    postBattleDemoAudioMessage({
      chainId: musketeerAudioChainId,
      phase: "fire",
      mode: "transition",
      currentActionFrame: info.actionFrame,
      frameDurationMs: info.frameDurationMs,
      fadeFrames: 3,
      nextStartFrame: 29,
    });
  }
}
```

- [x] **Step 4: Re-run the targeted tests and confirm the musketeer bridge goes green**

Run:

```bash
bundled node.exe -e "require('./tests/battle-demo-musketeer-audio-bridge.test.cjs'); require('./tests/audio-seam.test.cjs')"
bundled node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
bundled node.exe -e "require('./tests/audio-manager.test.cjs')"
```

Expected:

- `PASS`
- source tests prove musketeer frame thresholds and the no-impact contract
- audio seam tests prove new mp3 imports and mappings
- runtime tests prove reload-to-fire fade scheduling

### Task 3: Run Verification And Update The Plan Ledger

**Files:**
- Modify: `docs/superpowers/plans/2026-07-27-battle-demo-musketeer-audio-bridge-plan.md`

**Interfaces:**
- Consumes:
  - `tests/battle-demo-musketeer-audio-bridge.test.cjs`
  - `tests/audio-seam.test.cjs`
  - `tests/audio-manager.test.cjs`
- Produces:
  - updated `Execution State`
  - updated `Progress Log`
  - verification evidence recorded in the plan

- [x] **Step 1: Run plan lint and the fresh verification set**

Run:

```bash
bundled node.exe tools/lint-superpowers-plans.mjs
bundled node.exe -e "require('./tests/battle-demo-archer-audio-bridge.test.cjs'); require('./tests/battle-demo-musketeer-audio-bridge.test.cjs'); require('./tests/audio-seam.test.cjs'); require('./tests/audio-manager.test.cjs')"
bundled node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
bundled node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json
bundled node.exe .\node_modules\vite\bin\vite.js build
```

Expected:

- targeted source and runtime tests pass
- typecheck passes
- `vite build` emits `dist/` and includes the new musketeer mp3 assets, but still exits `1` on this branch after pre-existing prototype HTML/script warnings

- [x] **Step 2: Update this plan file for the finished implementation batch**

Update:

- `Execution State.Status` -> `completed-but-open`
- `Execution State.Last Updated` -> `2026-07-27`
- `Execution State.Current Focus` -> `Implementation remains completed-but-open; musketeer reload/fire bridge timing is finished and the shared cue registry now owns the new assets.`
- `Execution State.Next Step` -> `Review the implementation diff, decide whether to resync docs/superpowers/project-progress.md, and commit or push only if requested.`
- `Execution State.Verification` -> the exact command list from Step 1

Append a `Progress Log` entry that records the verification results and the fact that governance sync remains deferred.

- [x] **Step 3: Update the checklist states to reflect actual execution**

Mark the completed implementation and verification steps above with `[x]` and leave the child in `completed-but-open`.

## Exit Check

- [x] battle-demo musketeer strikes emit semantic audio bridge messages on frames `9` and `26`, with fire starting on `29`.
- [x] frame `30` remains gameplay damage timing only and does not trigger a musketeer-specific impact cue.
- [x] reload and fire fades stay chain-local and do not affect other attackers.
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
- Resume From: `Open docs/superpowers/project-progress.md, confirm whether this child should become the active governed item, then review docs/superpowers/plans/2026-07-27-battle-demo-musketeer-audio-bridge-plan.md.`
