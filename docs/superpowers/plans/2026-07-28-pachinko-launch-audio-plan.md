# Pachinko Launch Audio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a shared pachinko launch sound so the temple work pachinko minigame plays the provided marble-launch mp3 whenever the player clicks the launch button.

**Architecture:** The change stays on the shared `pachinko-board` playable seam rather than inside temple-only business logic. A centralized `activity.pachinko.launch` cue will be registered in the app audio manager, wrapped by a dedicated audio class, and resolved from a shared `data-pachinko-sound="launch"` marker on both house and scene pachinko launch buttons through the existing global click-capture audio path.

**Tech Stack:** TypeScript app runtime, Vite static `mp3?url` asset imports, centralized app audio session/controller wiring, CommonJS source-contract tests via `tsconfig.test.json`, and `tools/lint-superpowers-plans.mjs` for governance linting.

## Global Constraints

- Keep `src/main.ts` limited to stable audio wiring; do not add temple-specific launch branches.
- The sound marker belongs to the shared `pachinko-board` interaction, not to `temple-house` settlement or playable runtime logic.
- Real playback must stay inside the centralized app audio controller and cue registry.
- Expose the cue through a dedicated audio class rather than inline string literals scattered across callers.
- Both `src/ui/views/house/temple-house-view.ts` and `src/ui/views/scene/scene-view.ts` must resolve to the same shared launch cue.
- Asset filenames under `src/assets/audio/` must stay ASCII-only.
- Do not change temple work scoring, board physics, dispatch semantics, or closeout flow in this child.
- `docs/superpowers/project-progress.md` currently tracks an unrelated open inventory child, so this plan remains a local child unless governance resync is explicitly requested later.
- Do not commit or push as part of this child unless the user explicitly asks for it.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-28`
- Current Focus: `Implementation is complete; verification evidence is recorded; the child remains local and open because project-progress sync was intentionally not performed.`
- Next Step: `Review the diff or request follow-up shared playable audio work.`
- Verification: `Passed: node tsc -p tsconfig.test.json; node -e pachinko/button/audio contract bundle (26 passing); node tsc --noEmit -p tsconfig.json; node tools/lint-superpowers-plans.mjs. Vite build emitted dist output but returned a non-zero exit code on existing prototype/resource warnings in prototypes/runtime assets unrelated to pachinko audio files.`
- Notes: `Subagent execution was attempted first, but the implementer path failed with a deployment 404 / no report, so the controller completed the child locally using the same brief, report, and ledger flow.`

## Progress Log

- 2026-07-28
  - Summary: `Created the pachinko launch audio implementation plan from the approved shared playable audio spec.`
  - Verification: `bundled node.exe .\tools\lint-superpowers-plans.mjs`
  - Next: `Choose execution mode, then start the Task 1 failing tests.`
- 2026-07-28
  - Summary: `Implemented the shared activity.pachinko.launch cue, added the dedicated audio wrapper and asset mapping, routed global click resolution through data-pachinko-sound="launch", and marked both pachinko launch buttons declaratively.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json; C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe -e "require('./tests/pachinko-launch-sound.test.cjs'); require('./tests/button-sound.test.cjs'); require('./tests/audio-seam.test.cjs'); require('./tests/pachinko-launch-ui-contract.test.cjs'); require('./tests/temple-button-sound-contract.test.cjs'); require('./tests/dialogue-button-sound-routing.test.cjs')"; C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json; C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\tools\lint-superpowers-plans.mjs`
  - Next: `Keep this child open locally unless project-progress sync or follow-up playable audio work is requested.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-28-pachinko-launch-audio-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `The temple work minigame is already hosted through the shared pachinko-board playable seam rather than a temple-only runtime.`
  - `The launch interaction already has stable action ids in both house and scene renderers, but neither renderer exposes a dedicated pachinko audio marker.`
  - `src/application/audio/audio-manager.ts`, src/application/audio/button-sound.ts, and src/main.ts already provide the central cue registry, click resolver seam, and static asset map needed for this child.`
  - `src/vite-env.d.ts` already declares *.mp3?url modules, so this child does not need a new asset typing seam.`
  - `docs/superpowers/project-progress.md currently points to an unrelated inventory owner doc, so this plan must stop at completed-but-open unless governance is intentionally resynced later.`

## Implementation Scope

### In Scope

- Add a centralized `activity.pachinko.launch` app audio cue and map it to `audio/activity/pachinko-launch.mp3`.
- Add a dedicated `pachinko-launch-sound.ts` audio wrapper class and target resolver helpers.
- Extend click cue resolution so `data-pachinko-sound="launch"` resolves before enter/button/fallback click sounds.
- Mark both house and scene pachinko launch buttons with the shared audio attribute.
- Add regression tests for the audio wrapper, cue registry, static asset seam, click resolver precedence, and shared UI marker contract.

### Still Out Of Scope

- Temple work task definitions, result overlays, contribution settlement, or review flow.
- `src/application/activity/activity-qte-runtime.ts` pachinko simulation behavior.
- New pointer-dispatch exceptions in `src/main.ts`.
- Non-pachinko temple sounds or generic UI button-sound policy changes.
- Project-progress resync for the unrelated inventory child.

## File Map

### Existing files to modify

- `src/application/audio/audio-manager.ts`
  - Register the shared `activity.pachinko.launch` cue id and its asset-backed cue definition.
- `src/application/audio/button-sound.ts`
  - Resolve `data-pachinko-sound="launch"` before the existing enter/button/fallback click audio flow.
- `src/main.ts`
  - Import the static `pachinko-launch.mp3?url` asset and add it to the centralized asset-path map.
- `src/ui/views/house/temple-house-view.ts`
  - Add the shared pachinko launch audio marker to the house overlay launch button.
- `src/ui/views/scene/scene-view.ts`
  - Add the shared pachinko launch audio marker to the scene overlay launch button.
- `tests/button-sound.test.cjs`
  - Lock the new pachinko launch cue precedence in the click resolver.
- `tests/audio-seam.test.cjs`
  - Lock the audio-manager cue registration and main asset import/map seam.

### New files to create

- `src/application/audio/pachinko-launch-sound.ts`
  - Hold the dedicated pachinko launch audio class and target resolver helpers.
- `src/assets/audio/activity/pachinko-launch.mp3`
  - Shared marble-launch asset copied from the user-provided source file.
- `tests/pachinko-launch-sound.test.cjs`
  - Lock the shared audio wrapper object and queued cue id contract.
- `tests/pachinko-launch-ui-contract.test.cjs`
  - Lock the shared `data-pachinko-sound="launch"` marker on both house and scene pachinko launch buttons.

## Verification Plan

- Targeted verification:
  - `bundled node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json`
  - `bundled node.exe -e "require('./tests/pachinko-launch-sound.test.cjs'); require('./tests/button-sound.test.cjs'); require('./tests/audio-seam.test.cjs'); require('./tests/pachinko-launch-ui-contract.test.cjs')"`
- Required commands:
  - `bundled node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`
  - `bundled node.exe .\node_modules\vite\bin\vite.js build`
  - `bundled node.exe .\tools\lint-superpowers-plans.mjs`

## Task 1: Add The Shared Pachinko Launch Cue And Audio Wrapper

**Files:**
- Create: `src/application/audio/pachinko-launch-sound.ts`
- Create: `src/assets/audio/activity/pachinko-launch.mp3`
- Create: `tests/pachinko-launch-sound.test.cjs`
- Modify: `src/application/audio/audio-manager.ts`
- Modify: `src/main.ts`
- Modify: `tests/audio-seam.test.cjs`

**Interfaces:**
- Consumes:
  - `queueAppAudioCue(session: AppAudioSession, cueId: string): AppAudioSession` from `src/application/audio/audio-manager.ts`
- Produces:
  - `BUILTIN_AUDIO_CUE_IDS.activityPachinkoLaunch: "activity.pachinko.launch"`
  - `export class PachinkoLaunchSoundEffect { readonly cueId: string; queue(session: AppAudioSession): AppAudioSession; }`
  - `export const PACHINKO_LAUNCH_SOUND: PachinkoLaunchSoundEffect`
  - `export function resolvePachinkoLaunchSoundEffectById(soundId: string | null | undefined): PachinkoLaunchSoundEffect | null`
  - `export function resolvePachinkoLaunchSoundEffectFromTarget(target: { closest(selector: string): { dataset?: { pachinkoSound?: string } } | null; }): PachinkoLaunchSoundEffect | null`

- [x] **Step 1: Write the failing cue-wrapper and asset-seam tests**

Create `tests/pachinko-launch-sound.test.cjs` with the shared wrapper contract:

```js
test("pachinko launch sound object queues the shared cue id", () => {
  let session = createAppAudioSession();
  session = PACHINKO_LAUNCH_SOUND.queue(session);

  assert.ok(PACHINKO_LAUNCH_SOUND instanceof PachinkoLaunchSoundEffect);
  assert.equal(
    PACHINKO_LAUNCH_SOUND.cueId,
    BUILTIN_AUDIO_CUE_IDS.activityPachinkoLaunch
  );
  assert.deepEqual(
    session.pendingCommands.map((command) => command.cueId),
    [BUILTIN_AUDIO_CUE_IDS.activityPachinkoLaunch]
  );
});
```

Extend `tests/audio-seam.test.cjs` so it asserts:

```js
assert.match(audioManagerSource, /activityPachinkoLaunch: "activity\.pachinko\.launch"/);
assert.match(audioManagerSource, /assetPath: "audio\/activity\/pachinko-launch\.mp3"/);
assert.match(mainSource, /import pachinkoLaunchAudioUrl from "\.\/assets\/audio\/activity\/pachinko-launch\.mp3\?url";/);
assert.match(mainSource, /"audio\/activity\/pachinko-launch\.mp3": pachinkoLaunchAudioUrl/);
```

- [x] **Step 2: Run the failing tests and confirm the missing cue seam is red**

Run:

```bash
bundled node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
bundled node.exe -e "require('./tests/pachinko-launch-sound.test.cjs'); require('./tests/audio-seam.test.cjs')"
```

Expected:

- `FAIL`
- first failures report the missing `pachinko-launch-sound` module, missing `activityPachinkoLaunch` cue id, or missing static asset import/map

- [x] **Step 3: Implement the minimal centralized cue and wrapper seam**

Copy the provided external audio file into the shared asset path:

```powershell
Copy-Item -LiteralPath "C:\Users\29636\Desktop\工作用文件\2026.7\音频和音效\弹珠.mp3" -Destination "src\assets\audio\activity\pachinko-launch.mp3"
```

Create `src/application/audio/pachinko-launch-sound.ts` with the minimal wrapper:

```ts
import type { AppAudioSession } from "./audio-manager";
import { BUILTIN_AUDIO_CUE_IDS, queueAppAudioCue } from "./audio-manager";

export class PachinkoLaunchSoundEffect {
  readonly cueId: string;

  constructor(cueId: string) {
    this.cueId = cueId;
  }

  queue(session: AppAudioSession): AppAudioSession {
    return queueAppAudioCue(session, this.cueId);
  }
}

export const PACHINKO_LAUNCH_SOUND = new PachinkoLaunchSoundEffect(
  BUILTIN_AUDIO_CUE_IDS.activityPachinkoLaunch
);
```

Extend `src/application/audio/audio-manager.ts` and `src/main.ts` so the centralized cue registry and static asset map include:

```ts
activityPachinkoLaunch: "activity.pachinko.launch"
assetPath: "audio/activity/pachinko-launch.mp3"
import pachinkoLaunchAudioUrl from "./assets/audio/activity/pachinko-launch.mp3?url";
"audio/activity/pachinko-launch.mp3": pachinkoLaunchAudioUrl
```

- [x] **Step 4: Re-run the cue-wrapper and asset-seam tests until they pass**

Run:

```bash
bundled node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
bundled node.exe -e "require('./tests/pachinko-launch-sound.test.cjs'); require('./tests/audio-seam.test.cjs')"
```

Expected:

- `PASS`

## Task 2: Resolve Launch Clicks Through Shared Pachinko Audio Markers

**Files:**
- Modify: `src/application/audio/button-sound.ts`
- Modify: `src/ui/views/house/temple-house-view.ts`
- Modify: `src/ui/views/scene/scene-view.ts`
- Modify: `tests/button-sound.test.cjs`
- Create: `tests/pachinko-launch-ui-contract.test.cjs`

**Interfaces:**
- Consumes:
  - `resolvePachinkoLaunchSoundEffectFromTarget(...)` from `src/application/audio/pachinko-launch-sound.ts`
  - existing `resolveUiClickCueIdFromTarget(input): string | null` signature in `src/application/audio/button-sound.ts`
- Produces:
  - `resolveUiClickCueIdFromTarget(...)` precedence: pachinko launch -> enter -> button -> fallback click
  - house pachinko launch button markup containing `data-pachinko-sound="launch"`
  - scene pachinko launch button markup containing `data-pachinko-sound="launch"`

- [x] **Step 1: Write the failing resolver and UI contract tests**

Extend `tests/button-sound.test.cjs` with a pachinko-priority case:

```js
const pachinkoTarget = {
  closest(selector) {
    if (selector === "[data-pachinko-sound]") {
      return { dataset: { pachinkoSound: "launch" } };
    }
    if (selector === "[data-button-sound]") {
      return { dataset: { buttonSound: "heavy" } };
    }
    return null;
  },
};

assert.equal(
  resolveUiClickCueIdFromTarget({
    target: pachinkoTarget,
    allowFallbackUiClick: true,
  }),
  BUILTIN_AUDIO_CUE_IDS.activityPachinkoLaunch
);
```

Create `tests/pachinko-launch-ui-contract.test.cjs` with source-level assertions such as:

```js
assert.match(
  houseSource,
  /c-pachinko-board__play[\s\S]*data-house-action="\$\{overlay\.playActionId\}"[\s\S]*data-pachinko-sound="launch"/
);
assert.match(
  sceneSource,
  /c-pachinko-board__play[\s\S]*data-pachinko-sound="launch"/
);
```

- [x] **Step 2: Run the failing resolver and UI contract tests**

Run:

```bash
bundled node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
bundled node.exe -e "require('./tests/button-sound.test.cjs'); require('./tests/pachinko-launch-ui-contract.test.cjs')"
```

Expected:

- `FAIL`
- first failures report missing pachinko priority resolution or missing `data-pachinko-sound="launch"` markers

- [x] **Step 3: Implement the minimal shared marker and click-resolution changes**

Update `src/application/audio/button-sound.ts` so it imports the new resolver and checks it first:

```ts
const configuredPachinkoLaunchSoundEffect =
  resolvePachinkoLaunchSoundEffectFromTarget(input.target);
if (configuredPachinkoLaunchSoundEffect != null) {
  return configuredPachinkoLaunchSoundEffect.cueId;
}
```

Update both pachinko launch button renderers so the launch button includes:

```html
data-pachinko-sound="launch"
```

Do not change:

- `data-house-action="${overlay.playActionId}"`
- `data-activity-action="play-board"`
- pachinko dispatch timing or board state transitions

- [x] **Step 4: Run the full verification for the child**

Run:

```bash
bundled node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
bundled node.exe -e "require('./tests/pachinko-launch-sound.test.cjs'); require('./tests/button-sound.test.cjs'); require('./tests/audio-seam.test.cjs'); require('./tests/pachinko-launch-ui-contract.test.cjs')"
bundled node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json
bundled node.exe .\node_modules\vite\bin\vite.js build
bundled node.exe .\tools\lint-superpowers-plans.mjs
```

Expected:

- `PASS`

- [x] **Step 5: Update child-local governance state after the implementation batch**

Update this plan file:

```md
- `Execution State.Status`: `completed-but-open`
- `Execution State.Verification`: paste the exact command set that passed
- append a `Progress Log` entry describing the centralized cue, shared marker, and verification result
```

Do not mark the child `closed` unless project-progress sync, structured closeout, and any requested push work are all explicitly handled later.

## Exit Check

- [x] `activity.pachinko.launch` exists in the centralized cue registry and resolves to `audio/activity/pachinko-launch.mp3`.
- [x] `PACHINKO_LAUNCH_SOUND.queue(...)` enqueues the shared pachinko launch cue.
- [x] `resolveUiClickCueIdFromTarget(...)` resolves `data-pachinko-sound="launch"` before enter/button/fallback click audio.
- [x] Both house and scene pachinko launch buttons render `data-pachinko-sound="launch"`.
- [x] Temple house runtime logic and pachinko simulation logic remain unchanged.
- [ ] Project progress sync is updated if the child state changes.
- [x] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Not closed`
- Parent Task: `Untracked local pachinko audio batch`
- Parent Stage: `Untracked local pachinko audio batch`
- Closeout Status: `not-closed`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Review the diff and request more shared playable audio only if needed.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-28-pachinko-launch-audio-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Continue from Task 1 Step 1 unless governance resync is explicitly requested.`
