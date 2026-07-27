# Button Sound Cue Abstraction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two real mp3-backed reusable button sound abstractions, `LIGHT_BUTTON_SOUND` and `HEAVY_BUTTON_SOUND`, on top of the existing centralized app-audio cue system.

**Architecture:** Extend `src/application/audio/audio-manager.ts` with two asset-backed UI cues and add a small application-layer `ButtonSoundEffect` wrapper in `src/application/audio/button-sound.ts`. Keep `src/main.ts` limited to stable static asset URL resolution for the two new mp3 files, while tests lock both session-level queueing and shell-level asset wiring.

**Tech Stack:** TypeScript, Vite static asset imports (`?url`), Node test runner, PowerShell file copy commands for the source mp3 files, `npm.cmd run lint:plans`, `npm.cmd run build:test`, `node --test`, `npm.cmd run typecheck`, `npm.cmd run build`, `npm.cmd test`.

## Global Constraints

- `button code chooses a reusable sound abstraction, not a file path`
- `audio-manager.ts remains the owner of cue registry, queue semantics, cooldowns, and playback`
- `src/main.ts may own only stable runtime wiring and static asset URL resolution, not button-specific business mapping`
- `the two new mp3 files must live inside the repository under stable ASCII filenames`
- `this batch must be additive and non-breaking for existing generic ui.click behavior`
- `ui.button.light` and `ui.button.heavy` are the exact new cue ids
- `audio/ui/button-light.mp3` and `audio/ui/button-heavy.mp3` are the exact logical asset keys

---

## Execution State

- Status: `running`
- Last Updated: `2026-07-24`
- Current Focus: `Record docs and finish the verification sweep.`
- Next Step: `Start Task 2 from the shell seam test.`
- Verification: `npm.cmd run lint:plans`
- Notes: `This plan is intentionally separate from the still-open unified backpack governance line in docs/superpowers/project-progress.md. Task 1 is complete; this batch intentionally leaves src/main.ts and real mp3 asset wiring to Task 2.`

## Progress Log

- 2026-07-24
  - Summary: `Created the implementation plan for the approved button sound cue abstraction spec.`
  - Verification: `npm.cmd run lint:plans`
  - Next: `Choose an execution approach, then start Task 1 with the new failing tests.`
- 2026-07-24
  - Summary: `Added shared button cue ids ui.button.light and ui.button.heavy, created the ButtonSoundEffect wrapper module, and kept playback owned by the app-audio controller.`
  - Verification: `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' -p tsconfig.test.json`; `@' {"type":"commonjs"} '@ | Set-Content '.test-dist\package.json'`; `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test --test-isolation=none tests/button-sound.test.cjs tests/audio-manager.test.cjs`
  - Next: `Wire the real mp3 assets and static shell resolution.`
- 2026-07-24
  - Summary: `Copied the real light/heavy button mp3 assets into src/assets/audio/ui, added *.mp3?url typing, and wired src/main.ts through a narrow STATIC_AUDIO_ASSET_URLS map before the legacy asset fallback.`
  - Verification: `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' -p tsconfig.test.json`; `@' {"type":"commonjs"} '@ | Set-Content '.test-dist\package.json'`; `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test --test-isolation=none tests/audio-seam.test.cjs`; `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' --noEmit -p tsconfig.json`; `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\vite\bin\vite.js' build`
  - Next: `Record docs and finish the verification sweep.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-24-button-sound-cue-abstraction-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `src/application/audio/audio-manager.ts` already owns cue registry, session output, and the browser audio controller.
  - `src/main.ts` currently resolves audio asset paths with `new URL(\`../${assetPath}\`, import.meta.url).href` and queues only the generic generated `ui.click` sound for button activation.
  - `src/vite-env.d.ts` already supports `*.img?url`, `*.mp4?url`, and `*.json?url`, but not `*.mp3?url`.
  - `tests/audio-manager.test.cjs` and `tests/audio-seam.test.cjs` already guard the audio seam, so this batch should extend those tests instead of inventing a new harness.
  - `docs/superpowers/project-progress.md` currently points to unrelated `Unified Backpack Inventory` work, so this plan remains `waiting` until the user chooses execution.

## Implementation Scope

### In Scope

- Add `ui.button.light` and `ui.button.heavy` to the built-in audio cue registry.
- Create `src/application/audio/button-sound.ts` with `ButtonSoundEffect`, `LIGHT_BUTTON_SOUND`, and `HEAVY_BUTTON_SOUND`.
- Copy the provided desktop mp3 files into `src/assets/audio/ui/` under ASCII filenames.
- Add `*.mp3?url` typing and static asset URL resolution for the two new button sounds in `src/main.ts`.
- Add or extend tests proving the new abstraction queues cues and resolves to real asset-backed playback.
- Record the implementation in `docs/change-log.md`.

### Still Out Of Scope

- Reclassifying every existing button in the project as light or heavy.
- Removing or renaming the existing generated `ui.click` cue.
- Adding hover, focus, panel-open, page-turn, or confirmation sounds.
- Creating button-name-specific sound routing in `src/main.ts`.

## File Map

### Existing files to modify

- `src/application/audio/audio-manager.ts`
  - Add the two new built-in cue ids and asset-backed cue definitions.
- `src/main.ts`
  - Import the two mp3 files via `?url` and resolve the new logical asset keys through a narrow static asset map before legacy fallback.
- `src/vite-env.d.ts`
  - Add `*.mp3?url` typing.
- `tests/audio-manager.test.cjs`
  - Lock the new cue ids and asset-backed playback behavior.
- `tests/audio-seam.test.cjs`
  - Lock the `main.ts` static mp3 import and asset-map seam.
- `docs/change-log.md`
  - Record the new reusable button sound abstraction and real mp3 integration.

### Existing files expected to be deleted

- None.

### New files to create

- `src/application/audio/button-sound.ts`
  - Own the reusable `ButtonSoundEffect` wrapper and the canonical light/heavy sound instances.
- `tests/button-sound.test.cjs`
  - Lock the shared sound wrapper contract and session queue behavior.
- `src/assets/audio/ui/button-light.mp3`
  - Repository-owned copy of the provided light button sound.
- `src/assets/audio/ui/button-heavy.mp3`
  - Repository-owned copy of the provided heavy button sound.

## Verification Plan

- Targeted verification:
  - `npm.cmd run build:test && node --test tests/button-sound.test.cjs tests/audio-manager.test.cjs tests/audio-seam.test.cjs`
- Required commands:
  - `npm.cmd run lint:plans`
  - `npm.cmd run build:test && node --test tests/button-sound.test.cjs tests/audio-manager.test.cjs tests/audio-seam.test.cjs`
  - `npm.cmd run typecheck`
  - `npm.cmd run build`
  - `npm.cmd test`

## Task 1: Shared Button Sound Contract

**Files:**
- Create: `src/application/audio/button-sound.ts`
- Create: `tests/button-sound.test.cjs`
- Modify: `src/application/audio/audio-manager.ts`
- Modify: `tests/audio-manager.test.cjs`

**Interfaces:**
- Consumes:
  - `createAppAudioSession(): AppAudioSession`
  - `queueAppAudioCue(session: AppAudioSession, cueId: string): AppAudioSession`
- Produces:
  - `BUILTIN_AUDIO_CUE_IDS.uiButtonLight: "ui.button.light"`
  - `BUILTIN_AUDIO_CUE_IDS.uiButtonHeavy: "ui.button.heavy"`
  - `class ButtonSoundEffect { readonly cueId: string; constructor(cueId: string); queue(session: AppAudioSession): AppAudioSession; }`
  - `LIGHT_BUTTON_SOUND: ButtonSoundEffect`
  - `HEAVY_BUTTON_SOUND: ButtonSoundEffect`

- [x] **Step 1: Write the failing button-sound and audio-manager tests**

Add `tests/button-sound.test.cjs` and extend `tests/audio-manager.test.cjs` with these assertions:

```js
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  BUILTIN_AUDIO_CUE_IDS,
  createAppAudioController,
  createAppAudioSession,
} = require("../.test-dist/application/audio/audio-manager.js");
const {
  ButtonSoundEffect,
  LIGHT_BUTTON_SOUND,
  HEAVY_BUTTON_SOUND,
} = require("../.test-dist/application/audio/button-sound.js");

test("light and heavy button sound objects queue their shared cue ids", () => {
  let session = createAppAudioSession();
  session = LIGHT_BUTTON_SOUND.queue(session);
  session = HEAVY_BUTTON_SOUND.queue(session);

  assert.ok(LIGHT_BUTTON_SOUND instanceof ButtonSoundEffect);
  assert.ok(HEAVY_BUTTON_SOUND instanceof ButtonSoundEffect);
  assert.equal(LIGHT_BUTTON_SOUND.cueId, BUILTIN_AUDIO_CUE_IDS.uiButtonLight);
  assert.equal(HEAVY_BUTTON_SOUND.cueId, BUILTIN_AUDIO_CUE_IDS.uiButtonHeavy);
  assert.deepEqual(
    session.pendingCommands.map((command) => command.cueId),
    [BUILTIN_AUDIO_CUE_IDS.uiButtonLight, BUILTIN_AUDIO_CUE_IDS.uiButtonHeavy]
  );
});

test("audio controller plays asset-backed light and heavy button cues through the shared ui bus", () => {
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
    ],
  });

  assert.deepEqual(playedSources, [
    "asset://audio/ui/button-light.mp3",
    "asset://audio/ui/button-heavy.mp3",
  ]);
});
```

- [x] **Step 2: Run the targeted tests to verify they fail**

Run:

```bash
npm.cmd run build:test && node --test tests/button-sound.test.cjs tests/audio-manager.test.cjs
```

Expected:

- `FAIL` because `src/application/audio/button-sound.ts` does not exist yet and `BUILTIN_AUDIO_CUE_IDS` does not expose `uiButtonLight` or `uiButtonHeavy`.

- [x] **Step 3: Implement the minimal shared cue and wrapper contract**

Update `src/application/audio/audio-manager.ts` and create `src/application/audio/button-sound.ts` with these exact additions:

```ts
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

const BUILTIN_AUDIO_CUE_DEFINITIONS: readonly AudioCueDefinition[] = [
  // existing cues...
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
];
```

```ts
import type { AppAudioSession } from "./audio-manager";
import { BUILTIN_AUDIO_CUE_IDS, queueAppAudioCue } from "./audio-manager";

export class ButtonSoundEffect {
  readonly cueId: string;

  constructor(cueId: string) {
    this.cueId = cueId;
  }

  queue(session: AppAudioSession): AppAudioSession {
    return queueAppAudioCue(session, this.cueId);
  }
}

export const LIGHT_BUTTON_SOUND = new ButtonSoundEffect(
  BUILTIN_AUDIO_CUE_IDS.uiButtonLight
);

export const HEAVY_BUTTON_SOUND = new ButtonSoundEffect(
  BUILTIN_AUDIO_CUE_IDS.uiButtonHeavy
);
```

- [x] **Step 4: Run the targeted tests to verify they pass**

Run:

```bash
npm.cmd run build:test && node --test tests/button-sound.test.cjs tests/audio-manager.test.cjs
```

Expected:

- `PASS`

- [x] **Step 5: Sync this plan after the contract lands**

Update this plan in the same commit batch:

- mark Task 1 step checkboxes complete
- set `Execution State.Status` to `running`
- set `Execution State.Current Focus` to `Wire the real mp3 assets and static shell resolution.`
- append a `Progress Log` entry summarizing the new cue ids, wrapper module, and targeted test command

- [x] **Step 6: Commit the contract batch**

Run:

```bash
git add tests/button-sound.test.cjs tests/audio-manager.test.cjs src/application/audio/button-sound.ts src/application/audio/audio-manager.ts docs/superpowers/plans/2026-07-24-button-sound-cue-abstraction-plan.md
git commit -m "feat: add button sound cue contract"
```

## Task 2: Real Mp3 Asset Wiring In The Main Audio Seam

**Files:**
- Create: `src/assets/audio/ui/button-light.mp3`
- Create: `src/assets/audio/ui/button-heavy.mp3`
- Modify: `src/vite-env.d.ts`
- Modify: `src/main.ts`
- Modify: `tests/audio-seam.test.cjs`

**Interfaces:**
- Consumes:
  - `BUILTIN_AUDIO_CUE_IDS.uiButtonLight`
  - `BUILTIN_AUDIO_CUE_IDS.uiButtonHeavy`
  - logical asset keys `"audio/ui/button-light.mp3"` and `"audio/ui/button-heavy.mp3"`
- Produces:
  - `declare module "*.mp3?url"`
  - `buttonLightAudioUrl: string`
  - `buttonHeavyAudioUrl: string`
  - `STATIC_AUDIO_ASSET_URLS["audio/ui/button-light.mp3"]`
  - `STATIC_AUDIO_ASSET_URLS["audio/ui/button-heavy.mp3"]`

- [x] **Step 1: Write the failing shell seam test**

Extend `tests/audio-seam.test.cjs` with source-level assertions for `src/main.ts` and `src/vite-env.d.ts`:

```js
test("main resolves button audio assets through static mp3 URLs before legacy fallback", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.match(
    source,
    /import buttonLightAudioUrl from "\.\/assets\/audio\/ui\/button-light\.mp3\?url";/
  );
  assert.match(
    source,
    /import buttonHeavyAudioUrl from "\.\/assets\/audio\/ui\/button-heavy\.mp3\?url";/
  );
  assert.match(
    source,
    /"audio\/ui\/button-light\.mp3": buttonLightAudioUrl/
  );
  assert.match(
    source,
    /"audio\/ui\/button-heavy\.mp3": buttonHeavyAudioUrl/
  );
});

test("vite env types include mp3 url modules", () => {
  const viteEnv = fs.readFileSync(
    path.join(process.cwd(), "src/vite-env.d.ts"),
    "utf8"
  );

  assert.match(viteEnv, /declare module "\*\.mp3\?url"/);
});
```

- [x] **Step 2: Run the seam test and typecheck to verify they fail**

Run:

```bash
npm.cmd run build:test && node --test tests/audio-seam.test.cjs
npm.cmd run typecheck
```

Expected:

- `FAIL` because `src/main.ts` has no static mp3 imports or asset map for the new button sounds.
- `FAIL` or `PASS` on `typecheck` depending on whether the imports were added before the type declaration; keep the failure output in the task notes if it appears.

- [x] **Step 3: Copy the provided mp3 files into the repository and add mp3 typing**

Run these exact commands and stop if either source file is missing; do not substitute a different audio file:

```powershell
New-Item -ItemType Directory -Force 'src/assets/audio/ui' | Out-Null
Copy-Item 'C:\Users\29636\Desktop\工作用文件\2026.7\音频和音效\轻按钮.mp3' 'src/assets/audio/ui/button-light.mp3'
Copy-Item 'C:\Users\29636\Desktop\工作用文件\2026.7\音频和音效\重按钮.mp3' 'src/assets/audio/ui/button-heavy.mp3'
```

Then add this block to `src/vite-env.d.ts`:

```ts
declare module "*.mp3?url" {
  const assetUrl: string;
  export default assetUrl;
}
```

- [x] **Step 4: Wire the static mp3 URLs in `src/main.ts`**

Add the imports and asset map exactly in the app-audio wiring area:

```ts
import buttonLightAudioUrl from "./assets/audio/ui/button-light.mp3?url";
import buttonHeavyAudioUrl from "./assets/audio/ui/button-heavy.mp3?url";

const STATIC_AUDIO_ASSET_URLS: Readonly<Record<string, string>> = {
  "audio/ui/button-light.mp3": buttonLightAudioUrl,
  "audio/ui/button-heavy.mp3": buttonHeavyAudioUrl,
};

const appAudioController = createAppAudioController({
  resolveAssetPath: (assetPath) =>
    STATIC_AUDIO_ASSET_URLS[assetPath] ??
    new URL(`../${assetPath}`, import.meta.url).href,
});
```

Do not add button-name-specific branching here; this map is only for the two new logical asset keys.

- [x] **Step 5: Run the seam test, typecheck, and build to verify they pass**

Run:

```bash
npm.cmd run build:test && node --test tests/audio-seam.test.cjs
npm.cmd run typecheck
npm.cmd run build
```

Expected:

- `PASS`

- [x] **Step 6: Sync this plan after the asset seam lands**

Update this plan in the same commit batch:

- mark Task 2 step checkboxes complete
- set `Execution State.Current Focus` to `Record docs and finish the verification sweep.`
- append a `Progress Log` entry summarizing the copied mp3 assets, `*.mp3?url` typing, and `main.ts` static asset map

- [ ] **Step 7: Commit the asset wiring batch**

Run:

```bash
git add src/assets/audio/ui/button-light.mp3 src/assets/audio/ui/button-heavy.mp3 src/vite-env.d.ts src/main.ts tests/audio-seam.test.cjs docs/superpowers/plans/2026-07-24-button-sound-cue-abstraction-plan.md
git commit -m "feat: wire button sound audio assets"
```

## Task 3: Changelog, Full Verification, And Governance Sync

**Files:**
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-07-24-button-sound-cue-abstraction-plan.md`

**Interfaces:**
- Consumes:
  - `LIGHT_BUTTON_SOUND`
  - `HEAVY_BUTTON_SOUND`
  - `ui.button.light`
  - `ui.button.heavy`
  - `src/assets/audio/ui/button-light.mp3`
  - `src/assets/audio/ui/button-heavy.mp3`
- Produces:
  - changelog entry describing the reusable button sound abstraction batch
  - final `Execution State`, `Progress Log`, `Completion Checklist`, and `Child Closeout` updates for a `completed-but-open` plan

- [ ] **Step 1: Add the changelog entry for the batch**

Insert a new dated section near the top of `docs/change-log.md` using this exact level of detail:

```md
## 2026-07-24 Button Sound Cue Abstraction

- 新增 `src/application/audio/button-sound.ts`，提供 `LIGHT_BUTTON_SOUND` 与 `HEAVY_BUTTON_SOUND` 两个可复用按钮音效对象，后续按钮逻辑可按对象分配音效而不是直接绑定 mp3。
- `src/application/audio/audio-manager.ts` 新增 `ui.button.light` 与 `ui.button.heavy` 两个真实 mp3-backed UI cue，保留原有 `ui.click` 作为兼容路径。
- `src/main.ts` 为这两个按钮音效增加静态 `mp3?url` 资源映射，避免新增按钮音频继续依赖动态字符串路径解析。
```

- [ ] **Step 2: Run the full verification sweep**

Run:

```bash
npm.cmd run lint:plans
npm.cmd run build:test && node --test tests/button-sound.test.cjs tests/audio-manager.test.cjs tests/audio-seam.test.cjs
npm.cmd run typecheck
npm.cmd run build
npm.cmd test
```

Expected:

- `PASS`, or record the exact unrelated blocker before changing this plan's status.

- [ ] **Step 3: Finalize this plan's governance state**

Update `docs/superpowers/plans/2026-07-24-button-sound-cue-abstraction-plan.md` with these exact end-state values if all verification passes:

```md
- Status: `completed-but-open`
- Last Updated: `2026-07-24`
- Current Focus: `Implementation complete; waiting for repository sync/push and the follow-up button-assignment batch.`
- Next Step: `Review diff, decide whether to start the button-assignment follow-up, and push before marking the child closed.`
- Verification: `npm.cmd run lint:plans`; `npm.cmd run build:test && node --test tests/button-sound.test.cjs tests/audio-manager.test.cjs tests/audio-seam.test.cjs`; `npm.cmd run typecheck`; `npm.cmd run build`; `npm.cmd test`
- Notes: `This batch adds shared light/heavy button sound abstractions only; existing buttons may still use ui.click until the next integration batch.`
```

Append a final `Progress Log` entry with the verification output and set the `Completion Checklist` checkboxes to checked.

Then fill the `Child Closeout` block with:

```md
- Closed Child: `Button Sound Cue Abstraction`
- Parent Task: `UI Audio Cue Abstraction`
- Parent Stage: `UI Audio Integration`
- Closeout Status: `not-closed`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `choose-follow-up-or-push`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-24-button-sound-cue-abstraction-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then continue from this plan if the user wants button assignment or repository sync.`
```

- [ ] **Step 4: Commit the docs and verification batch**

Run:

```bash
git add docs/change-log.md docs/superpowers/plans/2026-07-24-button-sound-cue-abstraction-plan.md
git commit -m "docs: record button sound abstraction batch"
```

## Exit Check

- [ ] `BUILTIN_AUDIO_CUE_IDS` exports `uiButtonLight` and `uiButtonHeavy`.
- [ ] `ButtonSoundEffect`, `LIGHT_BUTTON_SOUND`, and `HEAVY_BUTTON_SOUND` exist in `src/application/audio/button-sound.ts`.
- [ ] The provided light and heavy button mp3 files are copied into `src/assets/audio/ui/` under ASCII filenames.
- [ ] `src/main.ts` resolves `audio/ui/button-light.mp3` and `audio/ui/button-heavy.mp3` through static `?url` imports before the legacy fallback.
- [ ] `src/vite-env.d.ts` supports `*.mp3?url`.
- [ ] Targeted tests, typecheck, build, and `npm.cmd test` all pass or any unrelated blocker is explicitly recorded.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `Button Sound Cue Abstraction`
- Parent Task: `UI Audio Cue Abstraction`
- Parent Stage: `UI Audio Integration`
- Closeout Status: `not-closed`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `choose-execution-mode`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-24-button-sound-cue-abstraction-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then execute this plan after the user chooses an execution approach.`
