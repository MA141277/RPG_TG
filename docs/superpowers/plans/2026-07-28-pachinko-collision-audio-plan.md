# Pachinko Collision Audio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add shared pachinko collision audio so the temple work marble minigame plays randomized bounce sounds on real rebounds and a staggered two-hit burst on slot settlement without hardcoding audio ids into temple business logic.

**Architecture:** Keep collision detection inside the shared `pachinko-board` physics runtime, emit one per-tick audio pulse on the shared session, and let a dedicated pachinko collision sound class plus one small playback helper consume that pulse through the centralized app audio controller. The temple module stays a host only; `main.ts` stays on stable cross-system wiring and never hardcodes concrete bounce cue ids.

**Tech Stack:** TypeScript app runtime, shared `activity-qte` playable infrastructure, centralized `src/application/audio/*` cue registry, Vite static `mp3?url` asset imports, Node test runner via `tsconfig.test.json`, and plan linting through `tools/lint-superpowers-plans.mjs`.

## Global Constraints

- Keep `src/main.ts` limited to stable audio wiring; do not add temple-task string matching or one-off temple collision branches.
- Expose the bounce playback through a dedicated audio management class; gameplay code must not hardcode `activity.pachinko.bounce.*` cue ids or mp3 paths.
- Register both provided samples centrally under `src/application/audio/audio-manager.ts`.
- Reuse the existing playback humanization seam for pitch, volume, optional start offset, and optional fade-in variation.
- Audible collision means a rebound that changes velocity direction.
- Count these as one-hit collisions: side wall, pin, flipper, moving-gate pin, and bottom wall / slot-divider rebounds.
- Passing cleanly through the moving gate does not play a collision sound.
- Slot settlement must trigger two plays with an `80ms` gap so it reads as `哒哒`.
- Asset filenames under `src/assets/audio/` must stay ASCII-only.
- `docs/superpowers/project-progress.md` currently points at an unrelated open inventory child, so this plan remains a local `waiting` child unless governance resync is explicitly requested later.
- Do not commit or push as part of this child unless the user explicitly asks for it.

## Execution State

- Status: `completed`
- Last Updated: `2026-07-28`
- Current Focus: `Shared pachinko bounce playback is shipped and now hardened against ultra-short / decode-failing source assets.`
- Next Step: `Optional follow-up is broader gameplay QA inside the temple pachinko flow.`
- Verification: `tsc -p tsconfig.test.json; node --test --test-isolation=none tests/audio-manager.test.cjs tests/pachinko-collision-sound.test.cjs tests/pachinko-collision-runtime.test.cjs tests/pachinko-collision-playback.test.cjs tests/audio-seam.test.cjs; tsc --noEmit -p tsconfig.json; node tools/lint-superpowers-plans.mjs`
- Notes: `This child intentionally stays local because the canonical project-progress document currently points to a different owner doc.`

## Progress Log

- 2026-07-28
  - Summary: `Created the pachinko collision audio implementation plan from the approved shared playable audio spec.`
  - Verification: `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tools\lint-superpowers-plans.mjs`
  - Next: `Choose the execution mode, then begin the Task 1 red test cycle.`
- 2026-07-28
  - Summary: `Implemented shared pachinko bounce cue registration, runtime collision pulses, and the centralized 80ms slot-settlement playback bridge.`
  - Verification: `tsc -p tsconfig.test.json; node --test --test-isolation=none tests/pachinko-collision-sound.test.cjs tests/pachinko-collision-runtime.test.cjs tests/pachinko-collision-playback.test.cjs tests/audio-seam.test.cjs; tsc --noEmit -p tsconfig.json; vite build; node tools/lint-superpowers-plans.mjs`
  - Next: `Await gameplay QA or follow-up tuning requests.`
- 2026-07-28
  - Summary: `Debugged the still-silent bounce cues down to the current 32ms Layer-I source files, removed transient-eating start/fade variation for pachinko collisions, and added central generated fallbacks that replay automatically when the source asset errors.`
  - Verification: `tsc -p tsconfig.test.json; node --test --test-isolation=none tests/audio-manager.test.cjs tests/pachinko-collision-sound.test.cjs tests/pachinko-collision-runtime.test.cjs tests/pachinko-collision-playback.test.cjs tests/audio-seam.test.cjs; tsc --noEmit -p tsconfig.json; node tools/lint-superpowers-plans.mjs`
  - Next: `Have the user re-check the temple pachinko minigame in a live browser session and decide whether the fallback click timbre or gain still needs tuning.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-28-pachinko-collision-audio-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `The shared pachinko runtime already lives in src/application/activity/activity-qte-runtime.ts, not in temple-only business logic.`
  - `The cue registry in src/application/audio/audio-manager.ts already supports overlap caps and playback variation, so this child should extend that seam instead of adding a second audio subsystem.`
  - `src/application/audio/pachinko-launch-sound.ts already demonstrates the preferred small audio-wrapper pattern for a shared pachinko interaction.`
  - `syncActivityQteLoop()` in src/main.ts is already the stable app-level seam that sees every pachinko tick result and can host one helper call after runtime advancement.`
  - `The project-progress document still points at an unrelated inventory owner doc, so this plan must not pretend to become the canonical active child without an explicit governance resync request.`

## Implementation Scope

### In Scope

- Add two shared bounce cues and activity audio assets.
- Add a dedicated pachinko collision sound class that owns sample selection.
- Extend the shared pachinko session with one per-tick collision pulse.
- Emit pulse data from real runtime rebounds and slot settlement.
- Add one app-level playback helper that consumes each pulse token only once.
- Wire the helper into the existing `activity-qte` tick loop.
- Add regression tests for the audio class, runtime pulse emission, app playback bridge, and asset/cue registration seam.
- Record the shipped behavior in `docs/change-log.md`.

### Still Out Of Scope

- Pachinko launch audio.
- Temple review, scoring, contribution, or settlement balance.
- New UI controls or renderer markup for the pachinko board.
- New button-sound data attributes.
- Non-pachinko temple sounds.
- Repository governance resync for the unrelated inventory child.

## File Map

### Existing files to modify

- `src/application/audio/audio-manager.ts`
  - Register the two centralized bounce cue ids, their asset paths, and the shared bounce playback-variation profile.
- `src/domain/activity-session.ts`
  - Add the shared pachinko audio-pulse types and session fields.
- `src/application/activity/activity-qte-runtime.ts`
  - Aggregate audible rebound and slot-settlement counts into one per-tick pachinko audio pulse.
- `src/main.ts`
  - Import the new static activity audio assets, track the last consumed pachinko pulse token, and call the shared playback helper after each `activity-qte` tick.
- `tests/audio-seam.test.cjs`
  - Lock the cue registration plus static asset-import seam.
- `docs/change-log.md`
  - Record the new pachinko collision-audio behavior once the code ships.

### New files to create

- `src/application/audio/pachinko-collision-sound.ts`
  - Hold the dedicated collision sound class and shared singleton.
- `src/application/audio/pachinko-collision-playback.ts`
  - Hold the pulse-consumption helper so `main.ts` stays on stable orchestration only.
- `src/assets/audio/activity/pachinko-bounce-1.mp3`
  - ASCII-named copy of the user-provided `弹珠弹墙1.mp3`.
- `src/assets/audio/activity/pachinko-bounce-2.mp3`
  - ASCII-named copy of the user-provided `弹珠弹墙2.mp3`.
- `tests/pachinko-collision-sound.test.cjs`
  - Lock the dedicated audio class contract and sample-selection behavior.
- `tests/pachinko-collision-runtime.test.cjs`
  - Lock the shared pachinko runtime pulse behavior.
- `tests/pachinko-collision-playback.test.cjs`
  - Lock the one-time pulse consumption rule and the `80ms` slot-settlement burst behavior.

## Verification Plan

- Targeted verification:
  - `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\node_modules\typescript\bin\tsc -p tsconfig.test.json`
  - `Set-Content -Path .test-dist\package.json -Value '{"type":"commonjs"}'`
  - `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tests\pachinko-collision-sound.test.cjs`
  - `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tests\pachinko-collision-runtime.test.cjs`
  - `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tests\pachinko-collision-playback.test.cjs`
  - `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tests\audio-seam.test.cjs`
- Required commands:
  - `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`
  - `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\node_modules\vite\bin\vite.js build`
  - `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tools\lint-superpowers-plans.mjs`

## Task 1: Register Shared Bounce Cues And The Collision Sound Class

**Files:**
- Create: `src/application/audio/pachinko-collision-sound.ts`
- Create: `src/assets/audio/activity/pachinko-bounce-1.mp3`
- Create: `src/assets/audio/activity/pachinko-bounce-2.mp3`
- Create: `tests/pachinko-collision-sound.test.cjs`
- Modify: `src/application/audio/audio-manager.ts`
- Modify: `src/main.ts`
- Modify: `tests/audio-seam.test.cjs`

**Interfaces:**
- Consumes:
  - `queueAppAudioCue(session: AppAudioSession, cueId: string): AppAudioSession` from `src/application/audio/audio-manager.ts`
  - `playCue(cueId: string): void` from the centralized app audio controller
- Produces:
  - `BUILTIN_AUDIO_CUE_IDS.activityPachinkoBounce1: "activity.pachinko.bounce.1"`
  - `BUILTIN_AUDIO_CUE_IDS.activityPachinkoBounce2: "activity.pachinko.bounce.2"`
  - `export class PachinkoCollisionSoundEffect { readonly cueIds: readonly string[]; pickCueId(random?: () => number): string; play(target: { playCue(cueId: string): void }, random?: () => number): string; }`
  - `export const PACHINKO_COLLISION_SOUND: PachinkoCollisionSoundEffect`
  - `const PACHINKO_BOUNCE_PLAYBACK_VARIATION: AudioCuePlaybackVariation`

- [x] **Step 1: Write the failing sound-class and asset-seam tests**

Create `tests/pachinko-collision-sound.test.cjs` with the dedicated wrapper contract:

```js
test("pachinko collision sound chooses only from the two registered bounce cues", () => {
  const played = [];
  const target = {
    playCue(cueId) {
      played.push(cueId);
    },
  };

  const firstCueId = PACHINKO_COLLISION_SOUND.play(target, () => 0);
  const secondCueId = PACHINKO_COLLISION_SOUND.play(target, () => 0.999);

  assert.equal(firstCueId, BUILTIN_AUDIO_CUE_IDS.activityPachinkoBounce1);
  assert.equal(secondCueId, BUILTIN_AUDIO_CUE_IDS.activityPachinkoBounce2);
  assert.deepEqual(played, [firstCueId, secondCueId]);
});
```

Extend `tests/audio-seam.test.cjs` so it asserts:

```js
assert.match(audioManagerSource, /activityPachinkoBounce1: "activity\.pachinko\.bounce\.1"/);
assert.match(audioManagerSource, /activityPachinkoBounce2: "activity\.pachinko\.bounce\.2"/);
assert.match(audioManagerSource, /assetPath: "audio\/activity\/pachinko-bounce-1\.mp3"/);
assert.match(audioManagerSource, /assetPath: "audio\/activity\/pachinko-bounce-2\.mp3"/);
assert.match(audioManagerSource, /const PACHINKO_BOUNCE_PLAYBACK_VARIATION: AudioCuePlaybackVariation = \{/);
assert.match(mainSource, /import pachinkoBounce1AudioUrl from "\.\/assets\/audio\/activity\/pachinko-bounce-1\.mp3\?url";/);
assert.match(mainSource, /import pachinkoBounce2AudioUrl from "\.\/assets\/audio\/activity\/pachinko-bounce-2\.mp3\?url";/);
assert.match(mainSource, /"audio\/activity\/pachinko-bounce-1\.mp3": pachinkoBounce1AudioUrl/);
assert.match(mainSource, /"audio\/activity\/pachinko-bounce-2\.mp3": pachinkoBounce2AudioUrl/);
```

- [x] **Step 2: Run the red test cycle and confirm the shared bounce seam is missing**

Run:

```powershell
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -Path .test-dist\package.json -Value '{"type":"commonjs"}'
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tests\pachinko-collision-sound.test.cjs
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tests\audio-seam.test.cjs
```

Expected:

- `FAIL`
- first failures mention the missing `pachinko-collision-sound` module, missing `activityPachinkoBounce*` cue ids, or missing static asset imports

- [x] **Step 3: Implement the minimal centralized bounce registry and sound class**

Copy the provided files into ASCII asset paths:

```powershell
Copy-Item -LiteralPath "C:\Users\29636\Desktop\工作用文件\2026.7\音频和音效\弹珠弹墙1.mp3" -Destination "src\assets\audio\activity\pachinko-bounce-1.mp3"
Copy-Item -LiteralPath "C:\Users\29636\Desktop\工作用文件\2026.7\音频和音效\弹珠弹墙2.mp3" -Destination "src\assets\audio\activity\pachinko-bounce-2.mp3"
```

Create `src/application/audio/pachinko-collision-sound.ts` with the dedicated class:

```ts
import { BUILTIN_AUDIO_CUE_IDS } from "./audio-manager";

export class PachinkoCollisionSoundEffect {
  readonly cueIds: readonly string[];

  constructor(cueIds: readonly string[]) {
    this.cueIds = cueIds;
  }

  pickCueId(random: () => number = Math.random): string {
    const index = Math.min(
      this.cueIds.length - 1,
      Math.floor(random() * this.cueIds.length)
    );
    return this.cueIds[Math.max(0, index)];
  }

  play(
    target: { playCue(cueId: string): void },
    random: () => number = Math.random
  ): string {
    const cueId = this.pickCueId(random);
    target.playCue(cueId);
    return cueId;
  }
}

export const PACHINKO_COLLISION_SOUND = new PachinkoCollisionSoundEffect([
  BUILTIN_AUDIO_CUE_IDS.activityPachinkoBounce1,
  BUILTIN_AUDIO_CUE_IDS.activityPachinkoBounce2,
]);
```

Extend `src/application/audio/audio-manager.ts` and `src/main.ts` so the centralized registry and static asset map include:

```ts
activityPachinkoBounce1: "activity.pachinko.bounce.1",
activityPachinkoBounce2: "activity.pachinko.bounce.2",
assetPath: "audio/activity/pachinko-bounce-1.mp3",
assetPath: "audio/activity/pachinko-bounce-2.mp3",
import pachinkoBounce1AudioUrl from "./assets/audio/activity/pachinko-bounce-1.mp3?url";
import pachinkoBounce2AudioUrl from "./assets/audio/activity/pachinko-bounce-2.mp3?url";
```

- [x] **Step 4: Re-run the shared bounce tests until they pass**

Run:

```powershell
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -Path .test-dist\package.json -Value '{"type":"commonjs"}'
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tests\pachinko-collision-sound.test.cjs
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tests\audio-seam.test.cjs
```

Expected:

- `PASS`

## Task 2: Emit Shared Collision Pulses From Pachinko Physics

**Files:**
- Modify: `src/domain/activity-session.ts`
- Modify: `src/application/activity/activity-qte-runtime.ts`
- Create: `tests/pachinko-collision-runtime.test.cjs`

**Interfaces:**
- Consumes:
  - `ActivityPachinkoBoardBall`
  - `ActivityPachinkoBoardSession`
  - `createActivityQteSession(...)`
  - `tickActivityPachinkoBoard(...)`
- Produces:
  - `export type ActivityPachinkoBoardAudioPulse = { token: number; collisionCount: number; settleCount: number; }`
  - `ActivityPachinkoBoardSession["audioPulseCounter"]: number`
  - `ActivityPachinkoBoardSession["audioPulse"]: ActivityPachinkoBoardAudioPulse | null`
  - `stepSinglePachinkoBall(...): { session: ActivityPachinkoBoardSession; ball: ActivityPachinkoBoardBall | null; collisionCount: number; settleCount: number; }`

- [x] **Step 1: Write the failing runtime-pulse tests**

Create `tests/pachinko-collision-runtime.test.cjs` with focused runtime cases:

```js
test("pachinko side-wall rebound emits one collision pulse", () => {
  const activityDefinition = { id: "activity.test.pachinko.collision.side", label: "Side", outcome: {} };
  const baseSession = createActivityQteSession(activityDefinition, "generic.qte");

  const result = tickActivityPachinkoBoard(
    {
      runtime: {
        activitySession: {
          ...baseSession,
          phase: "dropping",
          remainingBalls: 0,
          activeBall: {
            x: 8,
            y: 240,
            previousX: 20,
            previousY: 236,
            vx: -18,
            vy: 4,
            radius: 17,
          },
          activeBalls: [
            {
              x: 8,
              y: 240,
              previousX: 20,
              previousY: 236,
              vx: -18,
              vy: 4,
              radius: 17,
            },
          ],
        },
        flags: {},
        variables: {},
      },
    },
    activityDefinition,
    []
  );

  const session = result.state.runtime.activitySession;
  assert.equal(session?.type, "pachinko-board");
  assert.deepEqual(session.audioPulse, { token: 1, collisionCount: 1, settleCount: 0 });
});
```

Also add:

- one case where a ball passes cleanly through the moving gate and leaves `audioPulse === null`
- one case where slot settlement leaves `audioPulse` with `settleCount: 1`

- [x] **Step 2: Run the red runtime-pulse tests and confirm the session contract is missing**

Run:

```powershell
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -Path .test-dist\package.json -Value '{"type":"commonjs"}'
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tests\pachinko-collision-runtime.test.cjs
```

Expected:

- `FAIL`
- first failures mention the missing `audioPulse` session fields or zero collision counts

- [x] **Step 3: Implement the minimal shared pulse aggregation**

Add the shared session contract in `src/domain/activity-session.ts`:

```ts
export type ActivityPachinkoBoardAudioPulse = {
  token: number;
  collisionCount: number;
  settleCount: number;
};
```

Seed the session with:

```ts
audioPulseCounter: 0,
audioPulse: null,
```

Aggregate per-tick counts in `tickActivityPachinkoBoard(...)`:

```ts
let tickCollisionCount = 0;
let tickSettleCount = 0;

activeBalls.forEach((activeBall) => {
  const result = stepSinglePachinkoBall(nextSession, activeBall);
  nextSession = result.session;
  tickCollisionCount += result.collisionCount;
  tickSettleCount += result.settleCount;
  if (result.ball != null) {
    nextActiveBalls.push(result.ball);
  }
});
```

Then write one pulse only when the tick produced audible events:

```ts
const hasAudioPulse = tickCollisionCount > 0 || tickSettleCount > 0;
const nextAudioPulseToken = hasAudioPulse
  ? nextSession.audioPulseCounter + 1
  : nextSession.audioPulseCounter;
```

`stepSinglePachinkoBall(...)` should return `collisionCount` increments for real rebounds and `settleCount: 1` when `settlePachinkoBall(...)` resolves a slot.

- [x] **Step 4: Re-run the runtime-pulse tests until they pass**

Run:

```powershell
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -Path .test-dist\package.json -Value '{"type":"commonjs"}'
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tests\pachinko-collision-runtime.test.cjs
```

Expected:

- `PASS`

## Task 3: Consume Each Pulse Once And Play The `80ms` Slot Burst

**Files:**
- Create: `src/application/audio/pachinko-collision-playback.ts`
- Create: `tests/pachinko-collision-playback.test.cjs`
- Modify: `src/main.ts`
- Modify: `docs/change-log.md`

**Interfaces:**
- Consumes:
  - `ActivityPachinkoBoardSession["audioPulse"]`
  - `PACHINKO_COLLISION_SOUND`
  - `playCue(cueId: string): void` from the app audio controller
- Produces:
  - `export function consumePachinkoCollisionAudioPulse(input: { session: ActivityPachinkoBoardSession | null; lastConsumedToken: number | null; sound: PachinkoCollisionSoundEffect; target: { playCue(cueId: string): void }; scheduleTask?: (callback: () => void, delayMs: number) => unknown; random?: () => number; settleDelayMs?: number; }): number | null`
  - `const PACHINKO_SETTLE_BURST_DELAY_MS = 80`
  - `let lastPachinkoCollisionAudioToken: number | null = null;` in `src/main.ts`

- [x] **Step 1: Write the failing playback-bridge tests**

Create `tests/pachinko-collision-playback.test.cjs` with one behavioral helper test and one main-wiring source contract:

```js
test("pachinko collision playback consumes each pulse token once and staggers slot bursts by 80ms", () => {
  const played = [];
  const scheduled = [];
  const nextToken = consumePachinkoCollisionAudioPulse({
    session: {
      type: "pachinko-board",
      audioPulse: { token: 3, collisionCount: 2, settleCount: 1 },
    },
    lastConsumedToken: 2,
    sound: PACHINKO_COLLISION_SOUND,
    target: {
      playCue(cueId) {
        played.push(cueId);
      },
    },
    scheduleTask(callback, delayMs) {
      scheduled.push({ callback, delayMs });
      return scheduled.length;
    },
    random: () => 0,
  });

  assert.equal(nextToken, 3);
  assert.equal(played.length, 3);
  assert.deepEqual(scheduled.map((task) => task.delayMs), [80]);
});
```

Also assert `src/main.ts` imports the helper and updates `lastPachinkoCollisionAudioToken` from the helper result.

- [x] **Step 2: Run the red playback-bridge tests and confirm the helper is missing**

Run:

```powershell
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -Path .test-dist\package.json -Value '{"type":"commonjs"}'
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tests\pachinko-collision-playback.test.cjs
```

Expected:

- `FAIL`
- first failures mention the missing playback helper or missing `main.ts` wiring

- [x] **Step 3: Implement the minimal pulse-consumption bridge**

Create `src/application/audio/pachinko-collision-playback.ts`:

```ts
export const PACHINKO_SETTLE_BURST_DELAY_MS = 80;

export function consumePachinkoCollisionAudioPulse(input: {
  session: ActivityPachinkoBoardSession | null;
  lastConsumedToken: number | null;
  sound: PachinkoCollisionSoundEffect;
  target: { playCue(cueId: string): void };
  scheduleTask?: (callback: () => void, delayMs: number) => unknown;
  random?: () => number;
  settleDelayMs?: number;
}): number | null {
  const pulse = input.session?.audioPulse ?? null;
  if (pulse == null || pulse.token === input.lastConsumedToken) {
    return input.lastConsumedToken;
  }

  for (let index = 0; index < pulse.collisionCount; index += 1) {
    input.sound.play(input.target, input.random);
  }

  for (let index = 0; index < pulse.settleCount; index += 1) {
    input.sound.play(input.target, input.random);
    (input.scheduleTask ?? setTimeout)(() => {
      input.sound.play(input.target, input.random);
    }, input.settleDelayMs ?? PACHINKO_SETTLE_BURST_DELAY_MS);
  }

  return pulse.token;
}
```

Wire it into `src/main.ts` right after the `interactive.activity-qte.tick` commit:

```ts
const activePachinkoSession =
  appState.gameState.runtime.activitySession?.type === "pachinko-board"
    ? appState.gameState.runtime.activitySession
    : null;

lastPachinkoCollisionAudioToken = consumePachinkoCollisionAudioPulse({
  session: activePachinkoSession,
  lastConsumedToken: lastPachinkoCollisionAudioToken,
  sound: PACHINKO_COLLISION_SOUND,
  target: appAudioController,
  scheduleTask: (callback, delayMs) => window.setTimeout(callback, delayMs),
});
```

Record the shipped behavior in `docs/change-log.md` with one concise entry.

- [x] **Step 4: Re-run targeted and baseline verification, then update the plan state**

Run:

```powershell
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -Path .test-dist\package.json -Value '{"type":"commonjs"}'
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tests\pachinko-collision-sound.test.cjs
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tests\pachinko-collision-runtime.test.cjs
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tests\pachinko-collision-playback.test.cjs
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tests\audio-seam.test.cjs
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\node_modules\vite\bin\vite.js build
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tools\lint-superpowers-plans.mjs
```

Expected:

- `PASS`
- plan checkboxes, `Execution State`, and `Progress Log` updated to reflect the completed work batch

## Exit Check

- [x] Both provided wall-hit samples are registered centrally with ASCII asset filenames.
- [x] Shared pachinko runtime emits one audio pulse token per audible tick and no pulse for clean gate passes.
- [x] Slot settlement produces the required two-hit `80ms` burst through the centralized playback helper.
- [x] No temple-only branch or raw bounce cue id was added to `src/main.ts`.
- [x] `docs/change-log.md` records the new behavior.
- [x] Project progress sync is updated if the child state changes beyond this local `waiting` plan.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
