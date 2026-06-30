# Mod Runtime Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract mod-related startup and restore decisions into a formal `Mod Runtime` that normalizes builtin/file/url sources, returns one activation handoff, and stops `src/main.ts` from directly owning mod parse/activate branching.

**Architecture:** Build Child 7 as a startup-facing runtime family centered on `src/core/contracts/mod-runtime.ts` and `src/core/mods/**`, with a thin adapter layer back into the current startup/content-assembly path. Keep content assembly, save/load IO, gameplay runtimes, and UI outside Child 7, while making restore-time mod re-activation pass through the same runtime boundary as builtin and imported startup flows.

**Tech Stack:** TypeScript, Vite, Node test runner via `tests/robustness.test.cjs`, existing `src/core/engine/**`, `src/core/save/**`, `src/core/registry/**`, repository plan governance

## Execution State

- Status: `completed`
- Last Updated: `2026-07-01`
- Current Focus: `Child 7 Mod Runtime is completed. Formal contracts, source normalization/loading/parsing seams, dependency/capability guards, atomic activation, startup adapter, and restore-time selected-mod re-activation are in production code.`
- Next Step: `Start Child 8 from docs/superpowers/plans/2026-06-30-state-sync-runtime-plan.md Task 1 Step 1 after committing the Child 7 closeout batch.`
- Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "mod runtime contract exports|mod runtime normalizes builtin file and url sources|mod runtime activation is atomic|mod runtime main adapter lets startup consume|save restore re-activates selected mod|mod runtime does not absorb content assembly"; npm run typecheck; npm test; npm run build; npm run lint:plans`
- Notes: `This is Child Plan 7 under the mod-first engine/runtime extraction roadmap. The public subsystem name is Mod Runtime. Loader, parser, dependency, capability, and adapter seams may exist internally, but they do not become separate child runtimes.`

## Progress Log

- 2026-06-30
  - Summary: `Formal Child 7 Mod Runtime implementation plan authored and queued behind Child 6. Scope is limited to discovery/load/parse/select/activate plus restore-time re-activation and startup handoff, without absorbing content assembly, save/load IO, or gameplay runtime execution.`
  - Verification: `npm run lint:plans`
  - Next: `Keep Child 5 as the next executable child, keep Child 6 queued behind it, and start Child 7 only after those queue gates are satisfied or explicitly deferred by updated governance.`
- 2026-07-01
  - Summary: `Started Child 7 after Child 5 and Child 6 were completed. The preflight confirmed main.ts still owned builtin/file/url startup branching, engine bootstrap still consumed raw selectedModId, and save loading still performs structural selected-mod validation rather than restore-time activation. Added the required Mod Runtime red tests and confirmed they failed before production implementation.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "mod runtime contract exports|mod runtime normalizes builtin file and url sources|mod runtime activation is atomic|mod runtime main adapter lets startup consume|save restore re-activates selected mod|mod runtime does not absorb content assembly" (expected failure before implementation)`
  - Next: `Implement the Mod Runtime contracts, runtime modules, adapter, startup bridge, and restore seam.`
- 2026-07-01
  - Summary: `Completed Child 7 Mod Runtime. src/core/contracts/mod-runtime.ts, src/core/mods/*, and src/core/adapters/mod-runtime-main-adapter.ts now provide source descriptors, loaded/activated mod contracts, runtime state, request/failure/result seams, source normalization/loading/parsing, dependency and capability validation, atomic activation with rollback, and a legacy bootstrap adapter. src/main.ts now activates builtin, file-imported, url-imported, and saved selected mods through Mod Runtime before downstream startup/content assembly, while content assembly, save/load IO, gameplay runtimes, UI, and presenter work remain outside Mod Runtime ownership.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "mod runtime contract exports|mod runtime normalizes builtin file and url sources|mod runtime activation is atomic|mod runtime main adapter lets startup consume|save restore re-activates selected mod|mod runtime does not absorb content assembly"; npm run typecheck; npm test; npm run build; npm run lint:plans`
  - Next: `Start Child 8 from docs/superpowers/plans/2026-06-30-state-sync-runtime-plan.md Task 1 Step 1 after committing the Child 7 closeout batch.`

---

## Source Documents

- Spec: `docs/superpowers/specs/2026-06-30-mod-runtime-spec.md`
- Parent orchestration plan: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
- Weekly orchestration plan: `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- Runtime subsystem authority: `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
- Child 1 boundary plan: `docs/superpowers/plans/2026-06-29-engine-runtime-boundary-plan.md`
- Child 2 save hardening plan: `docs/superpowers/plans/2026-06-29-save-migration-hardening-plan.md`
- Child 5 presenter plan: `docs/superpowers/plans/2026-06-29-presenter-render-decoupling-plan.md`
- Child 6 task-runtime plan: `docs/superpowers/plans/2026-06-30-task-runtime-plan.md`

## Parent Alignment

- This file is Child Plan 7 in the parent and weekly orchestration queues.
- Primary subsystem boundary:
  - `Mod Runtime`
- Secondary subsystem relationships:
  - consumes Boot Runtime and registry seams from Child 1
  - depends on Save / Load Runtime compatibility from Child 2
  - completed after Child 5 and Child 6 were closed
- Queue rule:
  - Child 5 is completed.
  - Child 6 is completed.
  - Child 7 is completed.
  - Child 8 StateSync Runtime remains queued behind this closeout and becomes the next executable child only after weekly/parent/artifact synchronization.

## Scope

This child plan includes:

- formal `Mod Runtime` contracts
- builtin/file/url source normalization
- mod discovery/load/parse/select/activate request handling
- dependency/conflict/capability validation
- atomic activation handoff
- startup-profile output for downstream bootstrap
- `main.ts` extraction of mod-related startup decisions
- restore-time mod re-activation through the same runtime seam
- typed diagnostics and compatibility rules for activation failures

This child plan does not include:

- final `ActiveGameContent` assembly
- final app-state construction
- gameplay runtime execution
- UI/menu/loading-screen implementation
- save-slot listing, deletion, or IO ownership
- save migration implementation details
- hot reload
- plugin sandboxing
- live mod-authoring tools

## File Map

### Existing Files To Modify

- `src/main.ts`
  - Remove direct ownership of mod parse/activate decisions and route builtin/import/restore decisions through a Child 7 seam.
- `src/core/contracts/mod-manifest.ts`
  - Clarify minimum manifest fields, including schema/version expectations needed by Mod Runtime validation.
- `src/core/registry/mod-registry.ts`
  - Align available-mod registry ownership with the Child 7 activation flow.
- `src/core/engine/engine-bootstrap.ts`
  - Consume a Child 7 activation handoff or its adapter output instead of relying only on raw selected-mod lookup.
- `src/core/engine/engine-factory.ts`
  - Keep initial engine state aligned with the activated mod output without reintroducing inline startup branching.
- `src/core/save/save-loader.ts`
  - Keep save-load boundary parse-only while exposing restore input compatible with Child 7 re-activation.
- `tests/robustness.test.cjs`
  - Add red tests and focused regression coverage for Mod Runtime contracts, activation rules, restore handoff, and boundary guards.
- `docs/superpowers/plans/2026-06-30-mod-runtime-plan.md`
  - Track execution state, progress, verification, and closeout notes.
- `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
  - Sync Child 7 status after any implementation batch.
- `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
  - Sync parent queue state after any implementation batch.
- `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
  - Keep Child 7 boundary ownership synchronized.
- `docs/change-log.md`
  - Record Mod Runtime once production code lands.

### New Files To Create

- `src/core/contracts/mod-runtime.ts`
  - Owns public Mod Runtime contracts: source kinds, loaded mod, activated mod, runtime state, requests, failures, and activation result.
- `src/core/mods/mod-source-registry.ts`
  - Normalizes builtin/file/url source descriptors into one internal registry shape.
- `src/core/mods/mod-source-loader.ts`
  - Loads builtin/file/url sources into one loaded-source shape.
- `src/core/mods/mod-parser.ts`
  - Parses source payload into normalized manifest/content metadata.
- `src/core/mods/mod-dependency-resolver.ts`
  - Validates dependency and conflict rules without activating gameplay systems.
- `src/core/mods/mod-capability-guard.ts`
  - Evaluates declared capabilities and returns typed rejection instead of implicit fallback.
- `src/core/mods/mod-runtime.ts`
  - Owns request handling, atomic activation, and unified activation handoff.
- `src/core/adapters/mod-runtime-main-adapter.ts`
  - Bridges Child 7 outputs back into the current startup/content-assembly path while bootstrap is still transitional.

## Required Verification Gate

For every production-code task in this plan, record at minimum:

- `npm run typecheck`
- `npm test`
- `npm run build`

For targeted Mod Runtime work, also record:

- `npm run build:test`
- exact `node --test tests/robustness.test.cjs --test-name-pattern "..."` commands

## Bug And Blocker Gate

- `P0`
  - build failure, type failure, startup dead path, save-restore corruption risk, activation path that leaves no bootable mod, or main boot regression
  - Rule: stop later tasks in this child plan until resolved.
- `P1`
  - Mod Runtime absorbs content assembly, gameplay runtime execution, or save/load IO ownership; restore bypasses Mod Runtime; activation leaves partial active-mod state; automatic fallback occurs without explicit policy
  - Rule: do not mark the affected task complete and do not mark this child `completed`.
- `P2`
  - broader authoring ergonomics, extra diagnostics, future manifest upgrades, or optional live-switch semantics
  - Rule: may be deferred only if logged in `Progress Log` with a follow-up action.

## Task 1: Reconcile Child 7 Scope Against Current Startup And Restore Paths

**Files:**
- Read: `docs/superpowers/specs/2026-06-30-mod-runtime-spec.md`
- Read: `src/main.ts`
- Read: `src/core/contracts/mod-manifest.ts`
- Read: `src/core/registry/mod-registry.ts`
- Read: `src/core/engine/engine-bootstrap.ts`
- Read: `src/core/engine/engine-factory.ts`
- Read: `src/core/save/save-loader.ts`
- Modify: `docs/superpowers/plans/2026-06-30-mod-runtime-plan.md`

- [x] **Step 1: Confirm current startup ownership**

Record that `src/main.ts` still owns builtin startup plus imported file/url branching and that Child 7 must extract mod-related parse/activate decisions without claiming menu, render, or gameplay execution ownership.

- [x] **Step 2: Confirm current bootstrap seam**

Record that `src/core/engine/engine-bootstrap.ts` currently selects a mod by raw `selectedModId`, so Child 7 must either widen bootstrap input or provide an adapter that maps `ModActivationResult` back into the current bootstrap contract during v1.

- [x] **Step 3: Confirm current save/load relationship**

Record that `src/core/save/save-loader.ts` still validates `selectedModId` structurally, and Child 7 must add restore-time re-activation without moving save envelope parsing or migration into Mod Runtime.

- [x] **Step 4: Record queue guard**

Update this plan's latest progress entry if needed so it still says Child 5 is next, Child 6 is ahead of Child 7, and Child 7 must not start production code until those queue gates are satisfied or explicitly deferred by updated weekly and parent governance.

## Task 2: Add Failing Mod Runtime Boundary Tests

**Files:**
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add a failing contract export test**

Add this red test:

```js
test("mod runtime contract exports source state request activation and failure seams", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/mod-runtime.ts"),
    "utf8"
  );

  assert.match(source, /export type ModSourceKind/);
  assert.match(source, /export type LoadedMod/);
  assert.match(source, /export type ActivatedMod/);
  assert.match(source, /export type ModRuntimeState/);
  assert.match(source, /export type ModRuntimeRequest/);
  assert.match(source, /export type ModActivationResult/);
  assert.match(source, /export type ModRuntimeFailure/);
});
```

- [x] **Step 2: Add a failing source-normalization test**

Add this red test:

```js
test("mod runtime normalizes builtin file and url sources through one source registry seam", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/mods/mod-source-registry.ts"),
    "utf8"
  );

  assert.match(source, /builtin/);
  assert.match(source, /file/);
  assert.match(source, /url/);
  assert.match(source, /normalizeModSource/);
});
```

- [x] **Step 3: Add a failing activation-transaction test**

Add this red test:

```js
test("mod runtime activation is atomic and leaves no partial active mod on failure", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/mods/mod-runtime.ts"),
    "utf8"
  );

  assert.match(source, /activation-failed/);
  assert.match(source, /previousActiveModId/);
  assert.match(source, /rollback/);
});
```

- [x] **Step 4: Add failing adapter and restore tests**

Add these red tests:

```js
test("mod runtime main adapter lets startup consume one unified activation result", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/adapters/mod-runtime-main-adapter.ts"),
    "utf8"
  );

  assert.match(source, /ModActivationResult/);
  assert.match(source, /toLegacyBootstrapInput/);
});

test("save restore re-activates selected mod through mod runtime", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.match(source, /restore/i);
  assert.match(source, /runModRuntime|activateSavedMod|restoreModFromSave/);
});
```

- [x] **Step 5: Add a failing boundary-guard test**

Add this red test:

```js
test("mod runtime does not absorb content assembly or gameplay execution ownership", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/mods/mod-runtime.ts"),
    "utf8"
  );

  assert.doesNotMatch(source, /ActiveGameContent/);
  assert.doesNotMatch(source, /renderApp/);
  assert.doesNotMatch(source, /runEventRuntime|runSceneFromEvent|runInteractiveRuntime/);
});
```

- [x] **Step 6: Run focused tests and confirm failure**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "mod runtime contract exports|mod runtime normalizes builtin file and url sources|mod runtime activation is atomic|mod runtime main adapter lets startup consume|save restore re-activates selected mod|mod runtime does not absorb content assembly"
```

Expected:

- tests fail because the new Mod Runtime files and wiring do not exist yet

## Task 3: Introduce Mod Runtime Contracts

**Files:**
- Create: `src/core/contracts/mod-runtime.ts`
- Modify: `src/core/contracts/mod-manifest.ts`
- Modify: `src/core/registry/mod-registry.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Expand manifest contract to support Child 7 validation**

Update `src/core/contracts/mod-manifest.ts` so the manifest can state at least:

```ts
export type GameModManifest = {
  id: string;
  schemaVersion: string;
  version: string;
  title: string;
  entryContentPackIds: string[];
  dependencies?: string[];
  conflictsWith?: string[];
  capabilities?: string[];
  defaultStart?: {
    playerCharacterId?: string;
    mapId?: string;
    cityId?: string;
    houseId?: string;
    view?: string;
  };
};
```

- [x] **Step 2: Create formal Mod Runtime contracts**

Create `src/core/contracts/mod-runtime.ts` with exported types for:

```ts
import type { GameModManifest } from "./mod-manifest";

export type ModSourceKind = "builtin" | "file" | "url";

export type ModSourceDescriptor =
  | { kind: "builtin"; modId: string }
  | { kind: "file"; name: string; filePath: string }
  | { kind: "url"; name: string; url: string };

export type LoadedMod = {
  source: ModSourceDescriptor;
  manifest: GameModManifest;
  rawContent: unknown;
};

export type ActivatedMod = {
  modId: string;
  manifest: GameModManifest;
  normalizedContentSources: unknown[];
  registeredDefinitionIds: string[];
  startupProfile: {
    playerCharacterId?: string;
    mapId?: string;
    cityId?: string;
    houseId?: string;
    view?: string;
  };
};

export type ModRuntimeState = {
  availableModsById: Record<string, LoadedMod>;
  activeModId: string | null;
  lastRequestId: string | null;
};

export type ModRuntimeRequest =
  | { type: "mod.discover"; requestId: string }
  | { type: "mod.load-builtin"; requestId: string; modId: string }
  | { type: "mod.load-file"; requestId: string; name: string; filePath: string }
  | { type: "mod.load-url"; requestId: string; name: string; url: string }
  | { type: "mod.select"; requestId: string; modId: string }
  | { type: "mod.activate"; requestId: string; modId: string }
  | { type: "mod.deactivate"; requestId: string; modId: string }
  | { type: "mod.reload"; requestId: string; modId: string };

export type ModRuntimeFailureCode =
  | "mod-not-found"
  | "parse-failed"
  | "dependency-missing"
  | "dependency-conflict"
  | "capability-rejected"
  | "activation-failed"
  | "save-not-found"
  | "save-read-failed"
  | "save-migration-failed"
  | "runtime-restore-failed";

export type ModRuntimeFailure = {
  code: ModRuntimeFailureCode;
  message: string;
  modId?: string;
  requestId: string;
};

export type ModActivationResult =
  | { ok: true; state: ModRuntimeState; activatedMod: ActivatedMod }
  | { ok: false; state: ModRuntimeState; failure: ModRuntimeFailure };
```

- [x] **Step 3: Align registry ownership**

Update `src/core/registry/mod-registry.ts` so builtin registry data remains the authoritative builtin source catalog while Child 7 runtime state can build `availableModsById` on top of it without duplicating manifest ownership.

- [x] **Step 4: Run focused contract verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "mod runtime contract exports source state request activation and failure seams"
```

Expected:

- contract export test passes

## Task 4: Implement Source Normalization, Loading, And Parsing

**Files:**
- Create: `src/core/mods/mod-source-registry.ts`
- Create: `src/core/mods/mod-source-loader.ts`
- Create: `src/core/mods/mod-parser.ts`
- Modify: `src/core/mods/mod-runtime.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Implement source normalization**

Create `src/core/mods/mod-source-registry.ts` with a pure source normalizer:

```ts
import type { ModSourceDescriptor } from "../contracts/mod-runtime";

export function normalizeModSource(input: ModSourceDescriptor): ModSourceDescriptor {
  return input;
}
```

The real implementation must normalize builtin, file, and url inputs into one internal source shape instead of branching ad hoc in `src/main.ts`.

- [x] **Step 2: Implement loading seam**

Create `src/core/mods/mod-source-loader.ts` with a loader entry such as:

```ts
import type { LoadedMod, ModSourceDescriptor } from "../contracts/mod-runtime";

export async function loadModSource(
  source: ModSourceDescriptor
): Promise<LoadedMod> {
  throw new Error(`Unsupported mod source loader: ${source.kind}`);
}
```

The finished implementation must distinguish source retrieval from parsing.

- [x] **Step 3: Implement parser seam**

Create `src/core/mods/mod-parser.ts` with a parser entry such as:

```ts
import type { GameModManifest } from "../contracts/mod-manifest";

export function parseModManifest(input: unknown): GameModManifest {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid mod manifest payload.");
  }

  return input as GameModManifest;
}
```

The finished implementation must classify parse failures as `parse-failed` instead of falling back silently.

- [x] **Step 4: Run source-focused verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "mod runtime normalizes builtin file and url sources"
```

Expected:

- source normalization test passes

## Task 5: Implement Validation And Atomic Activation

**Files:**
- Create: `src/core/mods/mod-dependency-resolver.ts`
- Create: `src/core/mods/mod-capability-guard.ts`
- Create: `src/core/mods/mod-runtime.ts`
- Modify: `src/core/engine/engine-bootstrap.ts`
- Modify: `src/core/engine/engine-factory.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Implement dependency and conflict validation**

Create `src/core/mods/mod-dependency-resolver.ts` with a pure validator that can return `dependency-missing` or `dependency-conflict` without entering boot/content assembly code.

- [x] **Step 2: Implement capability validation**

Create `src/core/mods/mod-capability-guard.ts` with a pure validator that can return `capability-rejected` without attempting sandboxing or gameplay execution.

- [x] **Step 3: Implement `runModRuntime()`**

Create `src/core/mods/mod-runtime.ts` with an orchestration entrypoint that:

- consumes `ModRuntimeState`
- routes `ModRuntimeRequest`
- loads and parses sources
- validates dependencies and capabilities
- performs activation as one atomic transaction
- retains `previousActiveModId` for rollback purposes
- returns one `ModActivationResult`

Include an explicit `rollback` path or marker so the atomic activation guard remains testable.

- [x] **Step 4: Keep bootstrap downstream of activation**

Update `src/core/engine/engine-bootstrap.ts` and `src/core/engine/engine-factory.ts` so engine boot consumes the activated-mod handoff or its adapter output, rather than recreating parse/activate decisions inline.

- [x] **Step 5: Run activation-focused verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "mod runtime activation is atomic and leaves no partial active mod on failure|mod runtime does not absorb content assembly or gameplay execution ownership"
```

Expected:

- atomic-activation and boundary-guard tests pass

## Task 6: Bridge `main.ts` Startup Through Mod Runtime

**Files:**
- Create: `src/core/adapters/mod-runtime-main-adapter.ts`
- Modify: `src/main.ts`
- Modify: `src/core/engine/engine-bootstrap.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Implement startup adapter**

Create `src/core/adapters/mod-runtime-main-adapter.ts` with a function such as:

```ts
import type { ModActivationResult } from "../contracts/mod-runtime";

export function toLegacyBootstrapInput(result: ModActivationResult) {
  if (!result.ok) {
    throw new Error(result.failure.message);
  }

  return {
    selectedModId: result.activatedMod.modId,
  };
}
```

The finished adapter must let current startup consume one unified activation result while bootstrap remains transitional.

- [x] **Step 2: Route builtin/file/url startup decisions through the adapter**

Update `src/main.ts` so builtin default startup, file import startup, and url import startup all call the Child 7 seam before content assembly or engine bootstrap proceeds.

- [x] **Step 3: Keep content assembly outside Mod Runtime**

Verify that content install/reset and final `ActiveGameContent` assembly stay outside `src/core/mods/mod-runtime.ts`, with only normalized activation handoff crossing the seam.

- [x] **Step 4: Run startup-focused verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "mod runtime main adapter lets startup consume one unified activation result"
```

Expected:

- startup adapter test passes

## Task 7: Route Restore-Time Re-Activation Through Mod Runtime

**Files:**
- Modify: `src/main.ts`
- Modify: `src/core/save/save-loader.ts`
- Modify: `src/core/contracts/mod-runtime.ts`
- Modify: `src/core/mods/mod-runtime.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Define restore input and failure typing**

Extend `src/core/contracts/mod-runtime.ts` if needed so restore flow has explicit input and failure contracts, for example:

```ts
export type SaveRestoreInput = {
  selectedModId: string;
  requestId: string;
};

export type RestoreFailure = ModRuntimeFailure;
```

- [x] **Step 2: Keep save loading structural**

Update `src/core/save/save-loader.ts` so it still owns envelope validation and migration output, but no longer acts as the final authority for restore-time active-mod recreation.

- [x] **Step 3: Re-activate saved mod through Child 7**

Update `src/main.ts` restore flow so the saved `selectedModId` must pass back through Mod Runtime before downstream bootstrap resumes. Do not add automatic builtin fallback.

- [x] **Step 4: Run restore-focused verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "save restore re-activates selected mod through mod runtime"
```

Expected:

- restore-path test passes

## Task 8: Verify Full Child 7 Boundary And Sync Governance

**Files:**
- Modify: `docs/superpowers/plans/2026-06-30-mod-runtime-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
- Modify: `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
- Modify: `docs/change-log.md`

- [x] **Step 1: Run full implementation verification**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- typecheck passes
- full test suite passes
- production build passes

- [x] **Step 2: Update this child plan state**

Update:

- task checkboxes
- `Execution State`
- `Progress Log`
- verification summary

- [x] **Step 3: Sync weekly orchestration**

Update the weekly plan so:

- Child 7 queue status is accurate
- any next executable child remains correct
- queue promotion does not occur unless Child 7 actually satisfies its own acceptance gate

- [x] **Step 4: Sync parent orchestration and subsystem mapping**

Update the parent plan and runtime-subsystems spec so:

- Child 7 completion state is correct
- Mod Runtime remains a distinct subsystem from Boot Runtime, Save / Load Runtime, and Presentation Bridge Runtime
- no old default-mod placeholder wording reappears as Child 7 scope

- [x] **Step 5: Record change log**

Add a concise entry to `docs/change-log.md` after production code lands:

```md
- Added formal Mod Runtime contracts and startup activation seams under `src/core`, normalizing builtin/file/url startup plus restore-time mod re-activation behind one activation handoff.
```

- [x] **Step 6: Run plan lint**

Run:

```bash
npm run lint:plans
```

Expected:

- plan lint passes

## Success Criteria

- `Mod Runtime` has formal contracts and runtime entrypoints.
- builtin, file, and url startup paths converge on one runtime-controlled activation seam.
- activation output is unified for downstream startup consumers.
- restore-time selected-mod re-activation goes through `Mod Runtime`.
- no automatic fallback occurs on activation failure.
- `src/main.ts` stops owning direct mod parse/activate branching.
- content assembly, save/load IO, gameplay runtimes, and UI remain outside Mod Runtime ownership.

## Self-Review

- Spec coverage:
  - runtime naming and goal are covered by the header, notes, and Task 1
  - manifest/source/request/result contracts are covered by Tasks 2 and 3
  - source normalization, loading, and parsing are covered by Task 4
  - activation transaction and validation are covered by Task 5
  - startup extraction is covered by Task 6
  - restore-time re-activation is covered by Task 7
  - governance sync is covered by Task 8
- Placeholder scan:
  - no `TBD`, `TODO`, or "implement later" placeholders remain in the plan body
  - all tasks list exact file paths and commands
- Type consistency:
  - `ModSourceKind`, `LoadedMod`, `ActivatedMod`, `ModRuntimeState`, `ModRuntimeRequest`, `ModActivationResult`, and `ModRuntimeFailure` are used consistently throughout

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Parent plan synchronized
- [x] Weekly orchestration synchronized
- [x] Runtime subsystem spec synchronized
- [x] Verification recorded
- [x] Change log updated after production code lands
