# Save Migration Hardening Plan

> **Legacy Governance Context:** This document was authored under the retired `weekly plan / weekly set / weekly orchestration` model. Keep its technical scope, but treat any weekly-governance references as historical context only. Resume governed work from `docs/superpowers/project-progress.md` instead.

> **For agentic workers:** Use this file to execute Child Plan 2 only after Child Plan 1 is completed. Follow the repository plan governance rules and update both this child plan and its parent/weekly orchestration plans after each work batch.

**Goal:** Harden the post-boundary save path so the minimal `SaveEnvelope` introduced by Child 1 can safely load older shapes, preserve mod-owned payload, reject missing selected mods explicitly, and round-trip back through engine-owned save files without redefining the boundary itself.

**Architecture:** Treat Child 1 as the owner of the first `SaveEnvelope` seam only. Child 2 owns everything after that seam becomes real: load normalization, ordered migrations, save writer behavior, load-time selected-mod validation, and compatibility tests. Keep this child plan inside `Save / Load Runtime` and `State Sync Runtime`; do not redesign presenter, navigation, runtime dispatch, or mod activation policy here.

**Tech Stack:** TypeScript, Node test runner via `tests/robustness.test.cjs`, `src/core/save/**`, existing state transition files, repository plan governance

## Execution State

- Status: `completed`
- Last Updated: `2026-06-29`
- Current Focus: `Child 2 acceptance is satisfied in the isolated worktree: save migration, load-time selected-mod validation, payload-preserving writer behavior, and compatibility tests now exist around Child 1's minimal SaveEnvelope seam.`
- Next Step: `Sync this completed save-hardening slice back into the main dev worktree, then use Child 3 as the next executable plan for navigation/time/event extraction.`
- Verification: `2026-06-29: npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "loadSaveEnvelope normalizes|missing selected mod|payload after load|save migration upgrades"; npm run typecheck; npm test; npm run build`
- Notes: `This file is Child Plan 2 under the mod-first engine runtime extraction roadmap. Child 2 is executing in the isolated worktree on branch codex/child2-save. Because Child 1 is not committed yet, this worktree was seeded from the validated dev working tree file set before implementation began.`

## Progress Log

- 2026-06-29
  - Summary: `Child Plan 2 authored as the dedicated save migration hardening workstream.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Wait for Child 1 completion, then begin Task 1 Step 1.`
- 2026-06-29
  - Summary: `Plan tightened so Child 2 exclusively owns save normalization, migration hooks, writer/loader behavior, and load-time selected-mod validation without absorbing mod activation or presentation concerns.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `After Child 1 completes, reconcile the actual SaveEnvelope output and start the failing save-compatibility tests.`
- 2026-06-29
  - Summary: `Completed Task 1 in the Child 2 isolated worktree by reconciling Child 1's actual save output: src/core/save/save-envelope.ts exists as the only save file, SaveEnvelope currently contains version/selectedModId/engineState/runtimeState/modState, and no loader/writer/migration files exist yet.`
  - Verification: `npm run typecheck`
  - Next: `Begin Task 2 by adding failing compatibility and migration tests for normalization, missing selected mod rejection, and payload-preserving round-trip behavior.`
- 2026-06-29
  - Summary: `Completed Task 2 and Task 3 in the Child 2 isolated worktree: added failing compatibility tests first, confirmed they failed because save-loader/save-writer/save-migrations were missing, then implemented migration, loader, and writer seams without redefining Child 1's envelope shape.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "loadSaveEnvelope normalizes|missing selected mod|payload after load|save migration upgrades"; npm run typecheck`
  - Next: `Run full verification and then close Child 2 with orchestration/doc synchronization.`
- 2026-06-29
  - Summary: `Completed Task 4 and Task 5 in the Child 2 isolated worktree: full verification passed, docs/change-log.md records the save hardening outcome, and Child 2 now meets its exit criteria with explicit missing-mod rejection plus payload-preserving round-trip coverage.`
  - Verification: `npm run typecheck; npm test; npm run build`
  - Next: `Promote Child 3 as the next executable child after this Child 2 slice is integrated.`

---

## Source Documents

- Parent orchestration plan: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
- Weekly orchestration plan: `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- Runtime subsystem authority: `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
- Child 1 implementation plan: `docs/superpowers/plans/2026-06-29-engine-runtime-boundary-plan.md`

## Parent Alignment

- This file is Child Plan 2 in the parent orchestration queue.
- Primary subsystem boundary:
  - `Save / Load Runtime`
  - `State Sync Runtime`
- Dependency gate:
  - Child 1 must be completed before any implementation step in this child may begin.
- Scope guard:
  - do not redefine the initial `SaveEnvelope` contract if Child 1 already introduced it
  - do not implement presenter/layout seams in this child
  - do not implement mod activation, dependency resolution, or capability policy in this child
  - do not move bootstrap, runtime dispatch, or `main.ts` handoff responsibilities back into this child
  - do not replace the existing `engineState` / `runtimeState` / `modState` envelope fields with a new shape for convenience

## Scope

This child plan includes:

- backward-compatible load normalization
- ordered save migration sequencing
- save-loader/save-writer implementation around the stabilized envelope seam
- selected mod id validation during load
- mod-owned payload preservation and round-trip checks

This child plan does not include:

- initial `src/core` boundary creation
- presenter/layout decoupling
- navigation runtime extraction
- interaction runtime extraction
- mod activation policy
- mod dependency resolution

## File Map

### Existing Files Likely To Change

- `tests/robustness.test.cjs`
  - Add save envelope compatibility, migration, and payload-preservation tests.
- `src/domain/game-state.ts`
  - Align only if the stabilized save boundary requires read/write-safe typing updates.
- `src/application/state/create-initial-state.ts`
  - Keep compatibility helpers aligned with normalized load behavior during transition.
- `docs/change-log.md`
  - Record save migration hardening once it lands.

### Files Child 1 Should Already Have Created

- `src/core/save/save-envelope.ts`
  - Child 1 owns the first envelope contract.

### Files Child 2 Owns

- `src/core/save/save-loader.ts`
- `src/core/save/save-writer.ts`
- `src/core/save/save-migrations.ts`
- `src/core/save/save-envelope.ts`
  - Modify only if the final Child 1 envelope requires additive metadata for migrations without breaking the seam ownership rule.

### Reconciled Child 1 Save Outputs

- `src/core/save/save-envelope.ts`
  - Present and exported from Child 1.
- `SaveEnvelope`
  - Current shape is:
    - `version`
    - `selectedModId`
    - `engineState`
    - `runtimeState`
    - `modState`
- `createSaveEnvelope()`
  - Present and currently converts `CoreGameState` into the minimal envelope.
- Missing by design after Child 1:
  - `src/core/save/save-loader.ts`
  - `src/core/save/save-writer.ts`
  - `src/core/save/save-migrations.ts`

### Child 2 Non-Overlap Rules

- Child 2 may extend `src/core/save/save-envelope.ts` only additively if migration metadata becomes necessary.
- Child 2 must keep `createSaveEnvelope()` as the write-side seam introduced by Child 1 rather than bypassing it with a parallel save shape.
- Child 2 must not redesign `CoreGameState`, bootstrap flow, runtime dispatch, or the `legacy-main-adapter` seam while hardening persistence.

### Remaining Hardening Inventory

- Legacy-save normalization into the current envelope when `engineState` / `runtimeState` are absent.
- Deterministic migration ordering for older save versions.
- Load-time rejection when `selectedModId` is not available.
- Round-trip preservation of unknown mod-owned payload inside `modState`.
- Writer behavior that serializes the normalized envelope without silently dropping payload.

## Required Verification Gate

For every production-code task in this plan, record at minimum:

- `npm run typecheck`
- `npm test`
- `npm run build`

If one of these commands is skipped, record the reason in `Progress Log` before marking the related step complete.

## Bug And Blocker Gate

- `P0`
  - build failure, type failure, boot failure, save corruption, unreadable existing saves
  - Rule: stop later tasks in this child plan until resolved
- `P1`
  - migration path loses payload, missing-mod load path breaks, normalized save cannot be written back correctly
  - Rule: do not mark the affected task complete and do not mark this child `completed`
- `P2`
  - non-critical envelope metadata mismatch, minor tooling friction, deferred cleanup of old-save helper paths
  - Rule: may be deferred only if logged in `Progress Log` with follow-up action

## Task 1: Reconcile Save Scope Against Child 1

**Files:**
- Read: `docs/superpowers/plans/2026-06-29-engine-runtime-boundary-plan.md`
- Read: `src/core/save/**` if present
- Modify: `docs/superpowers/plans/2026-06-29-save-migration-hardening-plan.md`

- [x] **Step 1: Confirm Child 1 save outputs**

Verify what Child 1 actually introduced:

- `SaveEnvelope` shape
- any save-related exports already present
- whether `save-loader.ts`, `save-writer.ts`, or `save-migrations.ts` exist despite the intended boundary

- [x] **Step 2: Record non-overlap rules**

Update this plan if needed so it explicitly excludes anything already completed and stabilized in Child 1 beyond the minimal envelope seam.

- [x] **Step 3: Define the remaining hardening inventory**

Write a short inventory in this plan or notes covering:

- old-save normalization
- migration ordering
- selected-mod load validation
- payload preservation
- writer round-trip behavior

## Task 2: Add Failing Compatibility And Migration Tests

**Files:**
- Modify: `tests/robustness.test.cjs`
- Read: `src/core/save/**`

- [x] **Step 1: Add focused failing tests for save compatibility**

Add tests shaped around:

- old save normalization into the current envelope
- selected mod id preservation
- unknown mod-owned payload round-trip
- missing selected mod rejection on load

Use concrete shapes like:

```js
test("loadSaveEnvelope normalizes a legacy save into the current envelope", async () => {
  const { loadSaveEnvelope } = require("../.test-dist/core/save/save-loader.js");
  const normalized = loadSaveEnvelope({
    version: "0.9.0",
    selectedModId: "builtin.default",
    state: {
      flags: { started: true },
    },
  });

  assert.equal(normalized.selectedModId, "builtin.default");
  assert.ok(normalized.runtimeState);
});

test("loadSaveEnvelope rejects a missing selected mod id", async () => {
  const { loadSaveEnvelope } = require("../.test-dist/core/save/save-loader.js");

  assert.throws(() =>
    loadSaveEnvelope(
      {
        version: "1.0.0",
        selectedModId: "missing.mod",
        engineState: { selectedModId: "missing.mod", version: "1.0.0", currentView: "map" },
        runtimeState: { flags: {}, variables: {}, activeEventId: null, activeTaskIds: [] },
        modState: {},
      },
      { availableModIds: ["builtin.default"] }
    )
  );
});
```

- [x] **Step 2: Run focused save tests and confirm failure**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "loadSaveEnvelope normalizes|missing selected mod|payload round-trip|save migration"
```

Expected:

- tests fail because compatibility or migration behavior is not fully hardened yet

## Task 3: Implement Save Loader, Writer, And Migration Hardening

**Files:**
- Modify if needed: `src/core/save/save-envelope.ts`
- Create or Modify: `src/core/save/save-loader.ts`
- Create or Modify: `src/core/save/save-writer.ts`
- Create or Modify: `src/core/save/save-migrations.ts`
- Modify if needed: `src/domain/game-state.ts`
- Modify if needed: `src/application/state/create-initial-state.ts`

- [x] **Step 1: Preserve stable envelope ownership**

Keep Child 1's envelope seam intact and extend only as needed for:

- additive migration metadata
- normalization helpers
- load-time compatibility paths

Do not rename or redesign the envelope fields merely for convenience in this child.

- [x] **Step 2: Implement ordered migration hooks**

Add a deterministic migration path that can:

- read older shapes
- normalize into the current engine envelope
- preserve mod-owned payload without understanding every mod-specific field

Use an implementation shape like:

```ts
import type { SaveEnvelope } from "./save-envelope";

type LegacySaveLike = Record<string, unknown>;

export function migrateSaveEnvelope(input: LegacySaveLike): SaveEnvelope {
  const selectedModId =
    typeof input.selectedModId === "string" ? input.selectedModId : "builtin.default";

  return {
    version: "1.0.0",
    selectedModId,
    engineState:
      typeof input.engineState === "object" && input.engineState
        ? (input.engineState as SaveEnvelope["engineState"])
        : { selectedModId, version: "1.0.0", currentView: "map" },
    runtimeState:
      typeof input.runtimeState === "object" && input.runtimeState
        ? (input.runtimeState as SaveEnvelope["runtimeState"])
        : { flags: {}, variables: {}, activeEventId: null, activeTaskIds: [] },
    modState:
      typeof input.modState === "object" && input.modState
        ? (input.modState as SaveEnvelope["modState"])
        : {},
  };
}
```

- [x] **Step 3: Implement loader and selected-mod validation**

Ensure load behavior can:

- reject missing selected mod ids from the provided available-mod list
- preserve payload for known mod ids
- avoid silently remapping incompatible mod payload

Use a seam shaped like:

```ts
import type { SaveEnvelope } from "./save-envelope";
import { migrateSaveEnvelope } from "./save-migrations";

export function loadSaveEnvelope(
  envelope: Record<string, unknown>,
  input: { availableModIds: string[] }
): SaveEnvelope {
  const migrated = migrateSaveEnvelope(envelope);
  if (!input.availableModIds.includes(migrated.selectedModId)) {
    throw new Error(`Missing selected mod: ${migrated.selectedModId}`);
  }
  return migrated;
}
```

- [x] **Step 4: Implement writer round-trip behavior**

Add a writer that serializes the normalized envelope without dropping unknown mod-owned payload.

Use a seam shaped like:

```ts
import type { SaveEnvelope } from "./save-envelope";

export function serializeSaveEnvelope(envelope: SaveEnvelope): string {
  return JSON.stringify(envelope);
}
```

- [x] **Step 5: Keep the transition path readable**

Maintain compatibility so current saves remain readable during migration even if rewritten into the new envelope on the next save.

## Task 4: Verify Full Save Hardening Path

**Files:**
- Modify: `tests/robustness.test.cjs`
- Modify if needed: `docs/change-log.md`

- [x] **Step 1: Run full verification**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- save compatibility tests pass
- no existing tests regress
- production build still passes

- [x] **Step 2: Record final save-runtime outcome**

Document what is now true:

- old saves normalize into the current envelope
- selected mod id survives round-trip
- mod-owned payload survives round-trip
- missing-mod loads fail explicitly rather than silently corrupting state

## Task 5: Sync Orchestration And Close Child 2

**Files:**
- Modify: `docs/superpowers/plans/2026-06-29-save-migration-hardening-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- Modify: `docs/change-log.md`

- [x] **Step 1: Update this child plan state**

Update:

- `Execution State`
- `Progress Log`
- task checkboxes

- [x] **Step 2: Sync parent and weekly orchestration**

Update:

- parent orchestration progress
- weekly status board
- weekly queue state

- [x] **Step 3: Record change log**

Add a concise entry summarizing save migration hardening and compatibility guarantees.

## Success Criteria

- Child 2 does not duplicate Child 1's initial save boundary work.
- Existing saves can be normalized into the new engine envelope.
- Selected mod id and mod-owned payload survive round-trip.
- Missing selected mod loads fail explicitly.
- Save/load hardening remains scoped to `Save / Load Runtime` and `State Sync Runtime`.
- Child 2 does not absorb presenter, navigation, or mod activation responsibilities.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Parent plan synchronized
- [x] Weekly orchestration synchronized
- [x] Verification recorded
- [x] Change log updated
