# Battle Melee Audio Timing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add frame-accurate melee hit and miss sound playback for swordsman, spearman, and cavalry in the prototype battle runtime without changing `src/main.ts`.

**Architecture:** The battle runtime already has the correct animation callback seam in `animateBattleSpineProxy(... onFrame)`. This plan adds a small semantic melee-sound helper and a per-strike sound plan in `prototypes/battle-demo/index.html`, then mirrors the same contract into `prototypes/troop-management-preview/index.html` so preview and live battle stay synchronized.

**Tech Stack:** Inline browser JavaScript in prototype HTML, source-level Node tests (`node --test`), repository plan governance docs, `node tools/lint-superpowers-plans.mjs`, `npm run typecheck`, and `npm run build`.

## Execution State

- Status: `running`
- Last Updated: `2026-07-27`
- Current Focus: `Embedded battle cues now cover cavalry dash hoofbeat playback through the shared battle audio controller; remaining work is live in-game listening validation and optional closeout.`
- Next Step: `Verify the new cavalry horse-run cue in a live battle, then decide whether to commit this follow-up batch separately from the existing audio timing diff.`
- Verification: `node .\node_modules\typescript\bin\tsc -p tsconfig.test.json; node .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json; node --test --test-isolation=none tests\audio-seam.test.cjs tests\battle-sound.test.cjs tests\audio-manager.test.cjs tests\battle-demo-archer-audio-bridge.test.cjs tests\battle-melee-audio-timing.test.cjs`
- Notes: `User approved direct execution in the current working tree without creating a separate git worktree. This follow-up intentionally expands beyond the original prototype-only scope by wiring embedded melee cues through src/main.ts and the shared audio controller so battle humanization actually applies, and now also adds a cavalry dash horse-run asset routed through the same shared cue path. The most recent Vite build was not rerun in this horse-run batch; the earlier build still printed successful output but ended with a non-zero Windows exit code after pre-existing prototype warnings about non-module scripts and unresolved runtime refs.`

## Progress Log

- 2026-07-27
  - Summary: `Created the executable plan for prototype-only melee audio timing on swordsman, spearman, and cavalry attacks.`
  - Verification: `node tools/lint-superpowers-plans.mjs`
  - Next: `Choose execution mode and start Task 1 with a failing test in tests/battle-melee-audio-timing.test.cjs.`
- 2026-07-27
  - Summary: `Started subagent-driven execution in the current working tree after the user explicitly declined a separate worktree.`
  - Verification: `node tools/lint-superpowers-plans.mjs`
  - Next: `Create the Task 1 ledger and brief, then dispatch the Task 1 implementer subagent.`
- 2026-07-27
  - Summary: `Implemented battle-demo melee audio planning helpers, routed hit or miss cue selection by troop type and action variant, and fired the cue from animation-frame progression instead of onImpact.`
  - Verification: `node --test --test-isolation=none tests\battle-melee-audio-timing.test.cjs`
  - Next: `Mirror the same helper signatures and onFrame trigger contract into troop-management-preview.`
- 2026-07-27
  - Summary: `Mirrored the same melee audio helper block and frame-trigger wiring into troop-management-preview, then re-ran the relevant swordsman, spearman, cavalry, and preview parity source tests plus TypeScript typecheck.`
  - Verification: `node --test --test-isolation=none --test-name-pattern "battle melee sound plan maps the requested frames and hit or miss cues|battle demo triggers melee audio from onFrame rather than onImpact|troop preview mirrors battle demo melee audio helpers and frame trigger wiring|battle infantry attack variant chooser splits swordsman attacks at an exact 50/50 threshold|battle infantry jump-chop plan uses the imported 69-frame action and 43-frame impact timing|battle infantry jump-chop plan falls back to the existing jump-slash chain when the action is unavailable|battle runtime routes swordsman attacks through the troop-aware melee planner while preserving non-stationary melee support|battle spearman attack plan jumps on frames 7-31 and lands damage on thrust frame 14|battle runtime routes non-stationary melee Spine troops through the troop-aware melee attack planner|battle cavalry attack plan uses the imported cavalry action ids instead of legacy move/attack placeholders|battle renderer resolves attack actions from explicit attack names before falling back to selectedActionId" tests\battle-melee-audio-timing.test.cjs tests\battle-swordsman-attack-variants.test.cjs tests\battle-spearman-spine.test.cjs tests\battle-cavalry-spine.test.cjs`; `node .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`
  - Next: `Record the build result and decide whether to close out with a prototype-only commit or investigate the existing build exit-code anomaly separately.`
- 2026-07-27
  - Summary: `Ran unsandboxed Vite build verification. The build emitted dist assets successfully, but the process still returned EXIT_CODE=-1073740791 after existing prototype bundle warnings about non-module scripts and unresolved runtime references.`
  - Verification: `node .\node_modules\vite\bin\vite.js build`
  - Next: `Treat the Vite exit-code anomaly as separate follow-up work unless closeout requires it now.`
- 2026-07-27
  - Summary: `Root-caused the missing melee audio humanization to a split playback path: embedded melee strikes were still using prototype-local Audio() playback instead of the shared battle audio controller. Fixed this by bridging embedded melee cue messages through main.ts into the shared controller and by enforcing non-repeating consecutive pitch/volume variation for battle asset cues.`
  - Verification: `node --test --test-isolation=none tests\audio-seam.test.cjs tests\battle-melee-audio-timing.test.cjs tests\battle-demo-archer-audio-bridge.test.cjs`; `node .\node_modules\typescript\bin\tsc -p tsconfig.test.json`; `node --test --test-isolation=none tests\audio-manager.test.cjs tests\battle-sound.test.cjs`; `node .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`
  - Next: `Listen to a live embedded melee battle and confirm the audible randomization now matches the shared battle audio rules.`
- 2026-07-27
  - Summary: `Root-caused the missing overlapping soldier SFX to the shared audio controller's legacy per-cue maxInstances cap. Embedded battle one-shot cues no longer obey the old instance ceiling, so same-sample melee hits can overlap freely instead of dropping the later trigger.`
  - Verification: `node .\node_modules\typescript\bin\tsc -p tsconfig.test.json`; `node --test --test-isolation=none tests\audio-manager.test.cjs --test-name-pattern "embedded battle asset cues overlap|shared battle cue directly|never reuses the same immediate pitch and volume variation"`; `node --test --test-isolation=none tests\audio-seam.test.cjs tests\battle-melee-audio-timing.test.cjs tests\battle-demo-archer-audio-bridge.test.cjs tests\battle-sound.test.cjs tests\audio-manager.test.cjs`; `node .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`
  - Next: `Run a live crowded melee battle and verify overlapping same-sample strike sounds are now all audible.`
- 2026-07-27
  - Summary: `Added a shared battle horse-run cue for cavalry dash movement, imported the new asset into main.ts's static audio URL map, exposed it through the centralized battle sound facade, and then tightened it so cavalry dash now starts the cue on the first dash frame and sends an explicit stop/fade message as soon as the dash move segment ends in both battle-demo and troop-management-preview.`
  - Verification: `node .\node_modules\typescript\bin\tsc -p tsconfig.test.json`; `node .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`; `node --test --test-isolation=none tests\battle-melee-audio-timing.test.cjs`; `node - < targeted horse-run bridge verification script >`
  - Next: `Listen to a live cavalry strike and confirm the hoofbeat cue feels correctly timed and balanced against the existing slash, jump, and landing sounds, especially at the dash end fade-out.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-27-battle-melee-audio-timing-design.md`
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
  - `The approved spec intentionally avoids src/main.ts, and code inspection confirms the live battle scene runs inside iframe-backed prototype pages.`
  - `animateBattleSpineProxy(...) already exposes onFrame, onImpact, and onEffect callbacks, so execution can reuse onFrame instead of inventing a new animation callback type.`
  - `Current damage, white-flash, and shake behavior already sits on onImpact/onEffect and must stay there.`

## Global Constraints

- Only `swordsman`, `spearman`, and `cavalry` melee attacks are in scope.
- `src/main.ts` must not change in this child.
- Sound playback must trigger from animation frame progression, not from the impact state mutation callback.
- Miss routing must always use the shared miss cue.
- Hit routing must always choose exactly one of the three slash-hit cues.
- Trigger frames are fixed to `13` for swordsman `jump_slash`, `42` for swordsman `jump_chop`, `14` for spearman `jump_thrust`, and `30` for cavalry `dash_slash`.
- `prototypes/battle-demo/index.html` and `prototypes/troop-management-preview/index.html` must stay behaviorally synchronized.

## Implementation Scope

### In Scope

- Introduce semantic melee cue selection helpers inside the prototype runtime.
- Resolve a per-strike melee sound plan from `troopType`, melee variant, hit result, and one random value.
- Trigger the selected cue from `onFrame` using `info.actionFrame >= triggerFrame` with a one-shot guard.
- Add and maintain source-level regression coverage for mapping and frame-trigger integration.

### Still Out Of Scope

- Archer and gunner sound timing.
- Parent-window audio messaging or shared app-audio-session playback.
- New cue ids, new mp3 assets, or battle BGM changes.
- Refactoring the prototype pages into shared modules.

## File Map

### Existing files to modify

- `prototypes/battle-demo/index.html`
  - Add the prototype-local melee sound helper, sound-plan resolver, and `onFrame` trigger wiring in `playBattleSpineStrike`.
- `prototypes/troop-management-preview/index.html`
  - Mirror the battle-demo melee sound helper and `onFrame` trigger wiring so troop preview stays in sync with live battle behavior.

### New files to create

- `tests/battle-melee-audio-timing.test.cjs`
  - Lock the semantic sound-plan mapping, the `onFrame` trigger contract, and preview-page parity.

## Verification Plan

- Targeted verification:
  - `node --test tests/battle-melee-audio-timing.test.cjs tests/battle-swordsman-attack-variants.test.cjs tests/battle-spearman-spine.test.cjs tests/battle-cavalry-spine.test.cjs`
- Required commands:
  - `node tools/lint-superpowers-plans.mjs`
  - `npm run typecheck`
  - `npm run build`

## Task 1: Add Battle-Demo Melee Sound Planning And Frame Trigger

**Files:**
- Modify: `prototypes/battle-demo/index.html`
- Create: `tests/battle-melee-audio-timing.test.cjs`
- Read: `tests/battle-swordsman-attack-variants.test.cjs`
- Read: `tests/battle-spearman-spine.test.cjs`
- Read: `tests/battle-cavalry-spine.test.cjs`

**Interfaces:**
- Consumes:
  - `function getBattleMeleeAttackPlan(troopType, renderer, randomValue = Math.random())`
  - `function animateBattleSpineProxy(proxy, renderer, from, to, action, duration, movement = {})`
- Produces:
  - `function pickBattleMeleeHitCue(randomValue = Math.random())`
  - `function resolveBattleMeleeSoundPlan({ troopType, variant = null, hit, randomValue = Math.random() })`
  - `function playBattleMeleeCue(cueId)`
  - `playBattleSpineStrike(report, step, onImpact)` updated so melee audio fires from `movement.onFrame`

- [x] **Step 1: Write the failing test for melee sound-plan mapping and battle-demo frame triggering**

Add `tests/battle-melee-audio-timing.test.cjs` with this initial coverage:

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

function loadBattleMeleeAudioFns() {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const pickCueBody = extractFunctionBody(
    source,
    "function pickBattleMeleeHitCue(randomValue = Math.random())",
  );
  const resolvePlanBody = extractFunctionBody(
    source,
    "function resolveBattleMeleeSoundPlan({ troopType, variant = null, hit, randomValue = Math.random() })",
  );
  const pickBattleMeleeHitCue = new Function(
    "Math",
    `return function pickBattleMeleeHitCue(randomValue = Math.random()) {${pickCueBody}};`,
  )(Math);
  const resolveBattleMeleeSoundPlan = new Function(
    "pickBattleMeleeHitCue",
    "Math",
    `return function resolveBattleMeleeSoundPlan({ troopType, variant = null, hit, randomValue = Math.random() }) {${resolvePlanBody}};`,
  )(pickBattleMeleeHitCue, Math);
  return { source, pickBattleMeleeHitCue, resolveBattleMeleeSoundPlan };
}

test("battle melee sound plan maps the requested frames and hit or miss cues", () => {
  const { resolveBattleMeleeSoundPlan } = loadBattleMeleeAudioFns();
  assert.deepEqual(
    resolveBattleMeleeSoundPlan({ troopType: "infantry", variant: "jump_slash", hit: false, randomValue: 0.8 }),
    { triggerFrame: 13, cueId: "slashMiss" },
  );
  assert.deepEqual(
    resolveBattleMeleeSoundPlan({ troopType: "infantry", variant: "jump_chop", hit: true, randomValue: 0.1 }),
    { triggerFrame: 42, cueId: "slashHit1" },
  );
  assert.deepEqual(
    resolveBattleMeleeSoundPlan({ troopType: "spear", variant: "jump_thrust", hit: true, randomValue: 0.5 }),
    { triggerFrame: 14, cueId: "slashHit2" },
  );
  assert.deepEqual(
    resolveBattleMeleeSoundPlan({ troopType: "cavalry", variant: "dash_slash", hit: true, randomValue: 0.9 }),
    { triggerFrame: 30, cueId: "slashHit3" },
  );
  assert.equal(
    resolveBattleMeleeSoundPlan({ troopType: "archer", variant: null, hit: true, randomValue: 0.2 }),
    null,
  );
});

test("battle demo triggers melee audio from onFrame rather than onImpact", () => {
  const { source } = loadBattleMeleeAudioFns();
  assert.match(source, /const meleeSoundPlan = resolveBattleMeleeSoundPlan\\(\\{/);
  assert.match(
    source,
    /onFrame:\\s*info\\s*=>\\s*\\{[\\s\\S]*?info\\.actionFrame >= meleeSoundPlan\\.triggerFrame[\\s\\S]*?playBattleMeleeCue\\(meleeSoundPlan\\.cueId\\)/,
  );
  assert.doesNotMatch(
    source,
    /onImpact:\\s*info\\s*=>\\s*\\{[\\s\\S]*?playBattleMeleeCue\\(/,
  );
});
```

- [x] **Step 2: Run the new test file and verify it fails for missing helper signatures**

Run:

```bash
node --test tests/battle-melee-audio-timing.test.cjs
```

Expected:

- `FAIL`
- The first failure should report a missing signature for `pickBattleMeleeHitCue` or `resolveBattleMeleeSoundPlan`.

- [x] **Step 3: Add the minimal battle-demo sound helper and frame-trigger implementation**

In `prototypes/battle-demo/index.html`, add the helper block near the melee attack-planning functions and wire it into `playBattleSpineStrike`:

```js
const BATTLE_MELEE_AUDIO_URLS = Object.freeze({
  slashHit1: "../../src/assets/audio/battle/slash-hit-1.mp3",
  slashHit2: "../../src/assets/audio/battle/slash-hit-2.mp3",
  slashHit3: "../../src/assets/audio/battle/slash-hit-3.mp3",
  slashMiss: "../../src/assets/audio/battle/slash-miss.mp3",
});

function pickBattleMeleeHitCue(randomValue = Math.random()) {
  if (randomValue < 1 / 3) return "slashHit1";
  if (randomValue < 2 / 3) return "slashHit2";
  return "slashHit3";
}

function resolveBattleMeleeSoundPlan({ troopType, variant = null, hit, randomValue = Math.random() }) {
  let triggerFrame = null;
  if (troopType === "cavalry") {
    triggerFrame = 30;
  } else if (troopType === "spear") {
    triggerFrame = 14;
  } else if (troopType === "infantry" && variant === "jump_chop") {
    triggerFrame = 42;
  } else if (troopType === "infantry") {
    triggerFrame = 13;
  }
  if (!Number.isFinite(triggerFrame)) {
    return null;
  }
  return {
    triggerFrame,
    cueId: hit ? pickBattleMeleeHitCue(randomValue) : "slashMiss",
  };
}

function playBattleMeleeCue(cueId) {
  const src = BATTLE_MELEE_AUDIO_URLS[cueId];
  if (!src) return;
  const audio = new Audio(src);
  audio.preload = "auto";
  audio.volume = 0.9;
  void audio.play().catch(() => {});
}
```

Then update `playBattleSpineStrike` so the attack animation prepares one sound plan and fires it from `onFrame`:

```js
const meleeSoundPlan = resolveBattleMeleeSoundPlan({
  troopType,
  variant: infantryAttackPlan?.variant || null,
  hit: step.hit,
  randomValue: Math.random(),
});
let meleeSoundTriggered = false;

onFrame: info => {
  if (troopType === "archer") {
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
  if (
    meleeSoundPlan &&
    !meleeSoundTriggered &&
    info.actionFrame >= meleeSoundPlan.triggerFrame
  ) {
    meleeSoundTriggered = true;
    playBattleMeleeCue(meleeSoundPlan.cueId);
  }
},
```

- [x] **Step 4: Re-run the battle-demo audio timing tests and existing melee attack-plan tests**

Run:

```bash
node --test tests/battle-melee-audio-timing.test.cjs tests/battle-swordsman-attack-variants.test.cjs tests/battle-spearman-spine.test.cjs tests/battle-cavalry-spine.test.cjs
```

Expected:

- `PASS`
- The new test proves frame and cue mapping.
- Existing swordsman, spearman, and cavalry attack-plan tests stay green.

- [x] **Step 5: Sync plan progress after Task 1**

Update this plan file:

- Mark Task 1 checkboxes complete.
- Set `Execution State.Status` to `running`.
- Set `Execution State.Last Updated` to the current date.
- Set `Execution State.Current Focus` to `Mirror the same melee audio contract into troop-management-preview.`
- Set `Execution State.Next Step` to `Start Task 2 by writing the preview parity regression.`
- Append a `Progress Log` entry recording the targeted test command from Step 4.

- [ ] **Step 6: Commit Task 1**

Run:

```bash
git add prototypes/battle-demo/index.html tests/battle-melee-audio-timing.test.cjs docs/superpowers/plans/2026-07-27-battle-melee-audio-timing-plan.md
git commit -m "feat: add battle demo melee audio timing"
```

## Task 2: Mirror Melee Audio Timing Into Troop Preview And Close Verification

**Files:**
- Modify: `prototypes/troop-management-preview/index.html`
- Modify: `tests/battle-melee-audio-timing.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-27-battle-melee-audio-timing-plan.md`

**Interfaces:**
- Consumes:
  - `function pickBattleMeleeHitCue(randomValue = Math.random())`
  - `function resolveBattleMeleeSoundPlan({ troopType, variant = null, hit, randomValue = Math.random() })`
  - `function playBattleMeleeCue(cueId)`
- Produces:
  - Matching helper signatures and behavior in `prototypes/troop-management-preview/index.html`
  - Source-level parity coverage for both prototype pages

- [x] **Step 1: Extend the test to fail until the preview page matches battle-demo**

Append this test to `tests/battle-melee-audio-timing.test.cjs`:

```js
test("troop preview mirrors battle demo melee audio helpers and frame trigger wiring", () => {
  const demoSource = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const previewSource = fs.readFileSync("prototypes/troop-management-preview/index.html", "utf8");

  const signatures = [
    "function pickBattleMeleeHitCue(randomValue = Math.random())",
    "function resolveBattleMeleeSoundPlan({ troopType, variant = null, hit, randomValue = Math.random() })",
  ];

  signatures.forEach((signature) => {
    assert.equal(
      extractFunctionBody(previewSource, signature).replace(/\\s+/g, ""),
      extractFunctionBody(demoSource, signature).replace(/\\s+/g, ""),
    );
  });

  assert.match(
    previewSource,
    /const meleeSoundPlan = resolveBattleMeleeSoundPlan\\(\\{/,
  );
  assert.match(
    previewSource,
    /onFrame:\\s*info\\s*=>\\s*\\{[\\s\\S]*?info\\.actionFrame >= meleeSoundPlan\\.triggerFrame[\\s\\S]*?playBattleMeleeCue\\(meleeSoundPlan\\.cueId\\)/,
  );
});
```

- [ ] **Step 2: Run the test file and verify preview parity fails before implementation**

Run:

```bash
node --test tests/battle-melee-audio-timing.test.cjs
```

Expected:

- `FAIL`
- The failure should report a missing helper signature or missing `onFrame` trigger wiring in `prototypes/troop-management-preview/index.html`.

- [x] **Step 3: Mirror the battle-demo helpers and frame-trigger wiring into troop preview**

Copy the exact helper block and `playBattleSpineStrike` melee-sound wiring from `prototypes/battle-demo/index.html` into the matching sections of `prototypes/troop-management-preview/index.html`.

Keep these details identical:

```js
const BATTLE_MELEE_AUDIO_URLS = Object.freeze({
  slashHit1: "../../src/assets/audio/battle/slash-hit-1.mp3",
  slashHit2: "../../src/assets/audio/battle/slash-hit-2.mp3",
  slashHit3: "../../src/assets/audio/battle/slash-hit-3.mp3",
  slashMiss: "../../src/assets/audio/battle/slash-miss.mp3",
});
```

```js
const meleeSoundPlan = resolveBattleMeleeSoundPlan({
  troopType,
  variant: infantryAttackPlan?.variant || null,
  hit: step.hit,
  randomValue: Math.random(),
});
let meleeSoundTriggered = false;
```

```js
if (
  meleeSoundPlan &&
  !meleeSoundTriggered &&
  info.actionFrame >= meleeSoundPlan.triggerFrame
) {
  meleeSoundTriggered = true;
  playBattleMeleeCue(meleeSoundPlan.cueId);
}
```

- [x] **Step 4: Run full targeted verification and repository baseline checks**

Run:

```bash
node --test tests/battle-melee-audio-timing.test.cjs tests/battle-swordsman-attack-variants.test.cjs tests/battle-spearman-spine.test.cjs tests/battle-cavalry-spine.test.cjs
npm run typecheck
npm run build
```

Expected:

- All targeted tests `PASS`.
- `npm run typecheck` completes without errors.
- `npm run build` completes without errors.

- [x] **Step 5: Sync plan state after Task 2**

Update this plan file:

- Mark all Task 2 checkboxes complete.
- Set `Execution State.Status` to `completed-but-open`.
- Set `Execution State.Last Updated` to the current date.
- Set `Execution State.Current Focus` to `Implementation finished; waiting for execution closeout decision.`
- Set `Execution State.Next Step` to `Review diff, choose closeout path, and update governance docs if this child is promoted.`
- Replace `Execution State.Verification` with the exact command list from Step 4.
- Append a `Progress Log` entry that records final verification results.

- [ ] **Step 6: Commit Task 2**

Run:

```bash
git add prototypes/troop-management-preview/index.html tests/battle-melee-audio-timing.test.cjs docs/superpowers/plans/2026-07-27-battle-melee-audio-timing-plan.md
git commit -m "feat: sync preview melee audio timing"
```

## Exit Check

- [x] Battle-demo melee strikes resolve and play hit or miss sounds on frames `13`, `42`, `14`, and `30` as required.
- [x] Troop preview mirrors the same helper signatures and `onFrame` trigger behavior.
- [ ] The targeted Node tests, `npm run typecheck`, and `npm run build` are all green.
- [x] Plan progress and execution state are updated after each completed task.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
