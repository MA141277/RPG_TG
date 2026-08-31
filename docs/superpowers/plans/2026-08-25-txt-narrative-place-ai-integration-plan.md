# TXT Narrative Place AI Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a parallel `txt-narrative-place` house host that delivers the Huangjue Temple TXT narrative opening through a reusable AI-provider seam, while preserving the existing `temple-house` implementation untouched.

**Architecture:** Extend the shared house contract with TXT provider request/event side effects, add a dedicated TXT narrative runtime domain with parser/resolver/provider contracts plus a deterministic local placeholder provider, keep persistent narrative data under a unified `GameState.runtime.txtNarrative` branch, keep transcript/session data under a typed `txt-narrative-place` house session, and render the feature through a dedicated house renderer registered via the normal house registry. Scene/place changes remain code-owned; the provider produces structured narrative steps only. No new house business branch lands in `src/main.ts`.

**Tech Stack:** TypeScript house/runtime/domain/view modules, scenario-pack JSON house content, focused CommonJS tests under `.test-dist`, `tools/lint-superpowers-plans.mjs`, repository `tsconfig.test.json` and `tsconfig.json`, and bundled Node-powered verification.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-08-25`
- Current Focus: `Local closeout only: docs and verification are synchronized for the TXT narrative place slice, while canonical governance remains on the separate tavern child.`
- Next Step: `When the team is ready to connect the real internal AI, swap the shared TXT narrative provider implementation behind the existing seam instead of reopening main-shell or temple-house business branches.`
- Verification: `PASS - plan lint; TypeScript test build; focused TXT narrative suite (14/14); repository tsc --noEmit.`
- Notes: `docs/superpowers/project-progress.md currently tracks a different completed-but-open tavern child. This plan is executing locally in the current workspace and must remain local/completed-but-open unless governance is intentionally resynced later. The user approved the spec and approved continuing in the current workspace without creating a separate worktree.`

## Progress Log

- 2026-08-25
  - Summary: `Created the governed implementation plan from the approved TXT narrative place AI integration design and scoped it as a local non-canonical child that may execute now but must not overwrite the existing tavern governance owner doc.`
  - Verification: `Plan/spec authoring only; implementation verification not run yet.`
  - Next: `Run plan lint, then add the RED test batch for the provider seam, parser/resolver contract, and host opening behavior.`
- 2026-08-25
  - Summary: `Added the RED contract tests, expanded the shared house contract/runtime seam for TXT provider events and start/cancel side effects, and confirmed the focused batch failed only on the missing TXT narrative implementation.`
  - Verification: `PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json; FAIL (expected) - focused TXT narrative test batch before implementation.`
  - Next: `Implement the placeholder provider, host house module, dedicated renderer, scenario-pack entry, and shared doc sync.`
- 2026-08-25
  - Summary: `Implemented the parallel Huangjue Temple TXT host, typed transcript overlay, placeholder provider seam, parser/resolver helpers, runtime wiring, city/house content entry, and shared doc updates without replacing temple-house.`
  - Verification: `PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/txt-narrative-house-runtime-provider.test.cjs tests/txt-narrative-marker-parser.test.cjs tests/txt-narrative-place-resolution.test.cjs tests/txt-narrative-place-house.test.cjs tests/txt-narrative-place-view-contract.test.cjs; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json.`
  - Next: `Keep the slice local/completed-but-open until canonical governance is intentionally resynced, then replace the placeholder provider with the real internal AI adapter behind the same contract.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-25-txt-narrative-place-ai-integration-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `The existing repo already has a stable house registry, house runtime bridge, and typed house overlay contract, so the new feature can reuse those seams instead of opening a one-off page branch.`
  - `The current repo has no async house-provider seam, no TXT narrative module, and no transcript overlay surface, so those shared contracts must be expanded.`
  - `The actual Huangjue Temple house id is house.kulan.temple, not the handoff's suggested house.huangjue_temple, and the current temple module remains in place because the user selected the parallel rollout.`
  - `docs/superpowers/project-progress.md still points at the tavern completed-but-open child, so this plan executes locally and must stop at completed-but-open unless governance is intentionally resynced later.`

## Global Constraints

- Do not replace or rebind the existing `house.kulan.temple -> temple-house` module path.
- Do not add house-specific AI logic or concrete TXT house branches to `src/main.ts`.
- Provider integration must remain behind a generic port similar to the reference zips' `stream` / `complete` seam.
- The shared house runtime, not the house module, owns provider side-effect dispatch and stale-stream cancellation.
- `application/*` must not return HTML strings.
- Persistent narrative data must flow through unified runtime state, not top-level globals.
- New styles must use design tokens and follow the repository style governance.
- The current workspace is already dirty; do not revert unrelated user/local changes.
- Because canonical governance currently tracks another child, this plan may execute locally but must remain `completed-but-open` unless project-progress is intentionally resynchronized later.

## Implementation Scope

### In Scope

- Add the new `txt-narrative-place` house module id, session type, overlay type, and registry wiring.
- Add a dedicated TXT narrative runtime contract, parser, place resolver, temporary NPC handling, and persistent runtime branch.
- Extend the shared house runtime contract with provider start/cancel side effects and provider-event requests.
- Implement a deterministic local placeholder TXT provider that emits the required Huangjue Temple opening and a small follow-up loop.
- Render the TXT transcript/choice/custom-input surface through a dedicated house renderer.
- Add a new parallel Huangjue Temple TXT host house entry in the Zhu Yuanzhang scenario-pack content.
- Update shared docs and add focused runtime/module/view/content tests.

### Still Out Of Scope

- Wiring the feature into the old world map travel loop.
- Replacing the existing `temple-house` module or its review/work loop.
- Integrating the user's real internal AI client in this slice.
- Broad scenario-pack loader refactors for generalized `storyPhases` / `dynamicEntries` authoring.
- A second non-house chat UI outside the house system.

## File Map

### Existing files to modify

- `src/domain/house-module.ts`
  - Add the new module id, session mapping, provider-event request, new side effects, and TXT narrative overlay contract.
- `src/core/contracts/house-runtime.ts`
  - Expand the runtime request contract to allow TXT provider events through the shared house runtime seam.
- `src/core/runtime/house-runtime.ts`
  - Add provider dependency wiring, provider side-effect handling, stale-event guards, and stream cancellation on leave/supersession.
- `src/domain/game-state.ts`
  - Add the dedicated `runtime.txtNarrative` branch.
- `src/application/state/create-initial-state.ts`
  - Initialize the TXT runtime state.
- `src/application/house-modules/builtin-house-module-registrations.ts`
  - Register the new module.
- `src/ui/views/house/builtin-house-module-renderers.ts`
  - Register the new renderer.
- `src/content/scenario-packs/zhuyuanzhang/houses.json`
  - Add the parallel Huangjue Temple TXT host entry.
- `src/content/scenario-packs/zhuyuanzhang/cities.json`
  - Make the TXT host reachable from city content.
- `src/main.ts`
  - Only if needed for shell-only dependency injection of the shared TXT narrative provider into `createHouseRuntimeBridge(...)`.
- `docs/special-house-interface.md`
  - Document the new shared async house-provider seam and typed transcript overlay contract.
- `docs/change-log.md`
  - Record the new TXT narrative host, provider seam, and shared contract expansion.
- `docs/superpowers/plans/2026-08-25-txt-narrative-place-ai-integration-plan.md`
  - Keep execution state, progress log, and verification current.

### New files to create

- `src/domain/txt-narrative.ts`
  - Core TXT narrative types, provider contracts, runtime state, and parsed step contracts.
- `src/domain/house-modules/txt-narrative-place-session.ts`
  - Typed session state for the new host house.
- `src/application/txt-narrative/txt-narrative-marker-parser.ts`
  - Marker-to-step parser compatible with the reserved provider seam.
- `src/application/txt-narrative/txt-narrative-place-resolver.ts`
  - Exact/fuzzy/temporary place resolution helpers.
- `src/application/txt-narrative/local-placeholder-txt-narrative-provider.ts`
  - Deterministic placeholder provider for the approved Huangjue Temple opening.
- `src/application/txt-narrative/txt-narrative-provider-request-builder.ts`
  - Prompt/context builder for the provider request seam.
- `src/application/house-modules/txt-narrative-place/txt-narrative-place-house-module.ts`
  - The new house host module.
- `src/ui/views/house/txt-narrative-place-house-view.ts`
  - Dedicated transcript/choice/custom-input renderer.
- `src/styles/txt-narrative-place.css`
  - Dedicated styles for the transcript/choice UI using tokens.
- `tests/txt-narrative-house-runtime-provider.test.cjs`
  - Shared house runtime/provider seam coverage.
- `tests/txt-narrative-marker-parser.test.cjs`
  - Parser contract coverage.
- `tests/txt-narrative-place-resolution.test.cjs`
  - Exact/fuzzy/temporary place resolution coverage.
- `tests/txt-narrative-place-house.test.cjs`
  - Module opening/session/flag/choice flow coverage.
- `tests/txt-narrative-place-view-contract.test.cjs`
  - Renderer contract coverage.

## Verification Plan

- Targeted verification:
  - The shared house runtime starts TXT provider streams, forwards provider events back into house dispatch, and ignores stale events after leave/cancel.
  - The parser converts reserved marker text into typed steps.
  - The local placeholder provider produces the required Huangjue Temple opening.
  - The TXT host module persists flags/runtime notes through the unified runtime branch and maintains session transcript/options cleanly.
  - The new house renderer emits transcript entries, choice buttons, custom input, and reactivate controls through typed view data.
  - The new house content remains parallel to `temple-house`.
- Required commands:
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json`
  - `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/txt-narrative-house-runtime-provider.test.cjs tests/txt-narrative-marker-parser.test.cjs tests/txt-narrative-place-resolution.test.cjs tests/txt-narrative-place-house.test.cjs tests/txt-narrative-place-view-contract.test.cjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`

## Task 1: Add Shared TXT Narrative Contracts And RED Provider Seam Tests

**Files:**
- Create: `tests/txt-narrative-house-runtime-provider.test.cjs`
- Create: `tests/txt-narrative-marker-parser.test.cjs`
- Create: `tests/txt-narrative-place-resolution.test.cjs`
- Modify: `src/domain/house-module.ts`
- Modify: `src/core/contracts/house-runtime.ts`
- Modify: `src/core/runtime/house-runtime.ts`
- Read: `tests/house-runtime-coin-reward-contract.test.cjs`

**Interfaces:**
- Consumes:
  - current `HouseModuleRequest`
  - current `HouseModuleSideEffect`
  - current `createHouseRuntimeBridge(...)`
- Produces:

```ts
type HouseModuleRequest =
  | { type: "action"; actionId: string }
  | { type: "field"; fieldId: string; value: string }
  | { type: "tick"; tickId: string }
  | {
      type: "txt-narrative-provider-event";
      requestId: string;
      event: TxtNarrativeProviderEvent;
    };

type HouseModuleSideEffect =
  | /* existing effects */
  | {
      type: "start-txt-narrative-stream";
      requestId: string;
      payload: TxtNarrativeProviderRequest;
    }
  | {
      type: "cancel-txt-narrative-stream";
      requestId: string;
    };
```

- [x] **Step 1: Write the failing contract tests for the provider seam and parser/resolver entry points**

Add focused RED tests that prove:

- `src/domain/house-module.ts` contains the new `txt-narrative-place` module id, provider-event request, and provider start/cancel side effects.
- `src/core/contracts/house-runtime.ts` allows the new provider-event request through the shared runtime contract.
- `src/core/runtime/house-runtime.ts` wires a `txtNarrativeProvider` dependency and handles `start-txt-narrative-stream` / `cancel-txt-narrative-stream`.
- the marker parser file exports a parser entry point for marker text.
- the place resolver file exports exact/fuzzy/temporary resolution helpers.

- [x] **Step 2: Run the focused RED tests**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/txt-narrative-house-runtime-provider.test.cjs tests/txt-narrative-marker-parser.test.cjs tests/txt-narrative-place-resolution.test.cjs
```

Expected:

- `FAIL`
- the failures should point at the missing TXT contract files and missing shared runtime/provider seam.

- [x] **Step 3: Implement the minimal shared contract and helper stubs**

Add the new domain types, parser entry point, resolver entry point, runtime contract expansion, and
shared house runtime provider-dependency seam with the smallest code needed to satisfy the RED tests.

- [x] **Step 4: Re-run the focused seam tests**

Run the same commands from Step 2.

Expected:

- `PASS`
- the repository now has the shared TXT contract and provider seam in place before host-specific logic lands.

- [x] **Step 5: Sync the plan ledger after Task 1**

Update this plan:

- keep `Execution State.Status` at `running`
- set `Execution State.Current Focus` to `Task 2: RED host module opening/session/view coverage`
- append the RED/GREEN results to `Progress Log`

## Task 2: Add The Local Placeholder Provider, Runtime State, And TXT Host RED Tests

**Files:**
- Create: `tests/txt-narrative-place-house.test.cjs`
- Create: `tests/txt-narrative-place-view-contract.test.cjs`
- Create: `src/domain/txt-narrative.ts`
- Create: `src/domain/house-modules/txt-narrative-place-session.ts`
- Create: `src/application/txt-narrative/txt-narrative-provider-request-builder.ts`
- Create: `src/application/txt-narrative/local-placeholder-txt-narrative-provider.ts`
- Modify: `src/domain/game-state.ts`
- Modify: `src/application/state/create-initial-state.ts`

**Interfaces:**
- Consumes:
  - the shared TXT provider seam from Task 1
  - `GameState.runtime`
  - the approved Huangjue Temple opening requirements
- Produces:
  - the TXT runtime state branch
  - a deterministic local provider
  - host-session/runtime helper functions

- [x] **Step 1: Write the failing RED tests for the host opening and renderer contract**

Add RED tests that prove:

- the host module can open with `house.kulan.temple` mirrored as `皇觉寺`,
- the placeholder provider emits the hard-required opening content and first choice set,
- runtime flags such as `story.zhu.opening.in_temple` and follow-up alms flags live in unified runtime state,
- the new view contract renders transcript entries, speaker labels, choice buttons, custom input, and reactivate controls.

- [x] **Step 2: Run the RED host tests**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/txt-narrative-place-house.test.cjs tests/txt-narrative-place-view-contract.test.cjs
```

Expected:

- `FAIL`
- the failures should show the missing host module/session/view/runtime state behavior.

- [x] **Step 3: Implement runtime state, placeholder provider, and the host module/renderer**

Make the minimal changes needed to satisfy the contract:

- add `runtime.txtNarrative` initialization,
- add placeholder provider and prompt builder,
- add the new session state type,
- add the new house module,
- add the new renderer and style file,
- register the module and renderer,
- inject the provider through `createHouseRuntimeBridge(...)` only if shell-only wiring is required.

- [x] **Step 4: Re-run the focused host tests**

Run the same commands from Step 2.

Expected:

- `PASS`
- the Huangjue Temple TXT opening is now runnable through the new parallel host.

## Task 3: Add Parallel House Content, Doc Sync, And Full Verification

**Files:**
- Modify: `src/content/scenario-packs/zhuyuanzhang/houses.json`
- Modify: `src/content/scenario-packs/zhuyuanzhang/cities.json`
- Modify: `docs/special-house-interface.md`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-08-25-txt-narrative-place-ai-integration-plan.md`

**Interfaces:**
- Consumes:
  - the new module/renderer
  - current Zhu Yuanzhang scenario-pack city/house content
- Produces:
  - a reachable parallel TXT house host
  - synchronized documentation and verification evidence

- [x] **Step 1: Add the parallel Huangjue Temple TXT host content**

Add the scenario-pack house entry and wire it into the relevant city content so the new host can be
reached without disturbing the old temple entry.

- [x] **Step 2: Run full targeted verification**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/txt-narrative-house-runtime-provider.test.cjs tests/txt-narrative-marker-parser.test.cjs tests/txt-narrative-place-resolution.test.cjs tests/txt-narrative-place-house.test.cjs tests/txt-narrative-place-view-contract.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json
```

Expected:

- `PASS`
- the new parallel host works through the shared contracts and the focused TXT narrative suites stay green.

- [x] **Step 3: Record the resulting governance state**

If the local implementation batch is complete but not governance-resynced or pushed, set:

- `Execution State.Status` to `completed-but-open`
- `Execution State.Current Focus` to `Implementation finished locally; governance resync and keep-local vs commit/push decision remain open.`
- `Execution State.Next Step` to `Review the verified TXT narrative diff, decide whether to keep it local or resync governance, and only commit/push if requested.`

Append the final verification results to `Progress Log`.

## Exit Check

- [x] `A new parallel txt-narrative-place host exists without replacing temple-house.`
- [x] `The first Huangjue Temple TXT opening runs through the house framework and includes the abbot alms-departure scene.`
- [x] `The shared house runtime owns TXT provider side effects and provider events.`
- [x] `Persistent narrative data lives under unified runtime state instead of top-level globals.`
- [x] `The local placeholder provider keeps the seam testable before the real AI lands.`
- [x] `No new house-specific business branch lands in src/main.ts.`
- [x] `Shared docs and local plan state are synchronized.`

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
- Next Required Action: `review-and-decide-governance-resync`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `none`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, confirm whether this TXT narrative child should become the active governed item, then review docs/superpowers/plans/2026-08-25-txt-narrative-place-ai-integration-plan.md.`
