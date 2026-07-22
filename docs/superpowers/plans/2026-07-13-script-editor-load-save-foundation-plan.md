# Script Editor Load Save Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Admit and execute the first script-editor implementation queue by landing a bounded editor-project manifest plus split-table load/save and validation foundation.

**Architecture:** Reuse the repository's manifest-driven pack loading pattern instead of inventing a separate persistence mechanism. The first slice stays inside authoring-project persistence only: define the editor-project contract, load hydrated projects from text or imported files, serialize the same structure back to split files, and validate the canonical manifest/file registry without widening into runtime export, compatibility import, or UI workflow.

**Tech Stack:** TypeScript domain/application modules, Node test runner via `tests/robustness.test.cjs`, Blueprint governance docs, `npm run typecheck`, `npm test`, `npm run lint:blueprints`, `npm run lint:plans`.

## Execution State

- Status: `running`
- Last Updated: `2026-07-13`
- Current Focus: `The bounded load/save foundation slice is complete and the queue is closed; the next repo-facing step is export-pipeline admission review in Blueprint truth.`
- Next Step: `Resume docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md and decide queue.authoring-runtime-export-pipeline admission.`
- Verification: `node --test --test-name-pattern "script editor project" tests/robustness.test.cjs; npm run typecheck; npm test; npm run lint:blueprints; npm run lint:plans`
- Notes: `Live repository resume control is owned by docs/blueprints/project-progress.md, and this plan records the completed first implementation batch only.`

## Progress Log

- 2026-07-13
  - Summary: `Plan created for the first bounded script-editor implementation queue: editor-project load/save foundation.`
  - Verification: `Not run`
  - Next: `Admit the queue in Blueprint truth and start TDD on the editor-project loader/save path.`
- 2026-07-13
  - Summary: `Admitted queue.editor-project-load-save-foundation, landed the manifest-driven editor-project persistence seam, passed targeted and full verification, and closed the queue back into version-level promotion review.`
  - Verification: `node --test --test-name-pattern "script editor project" tests/robustness.test.cjs; npm run typecheck; npm test; npm run lint:blueprints; npm run lint:plans`
  - Next: `Resume the implementation version at queue.authoring-runtime-export-pipeline admission review.`

---

## Based On Spec

- Primary spec:
  - `docs/blueprints/specs/2026-07-13-script-editor-implementation-target.md`
- Active version plan:
  - `docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md`
- Frozen baseline:
  - `docs/blueprints/specs/2026-07-10-script-editor-contract-freeze-target.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `The live version remains target.script-editor-implementation with active_queue = none and a pending admission review for queue.editor-project-load-save-foundation.`
  - `Current source truth already has manifest-driven scenario-pack/content-pack loaders that can be reused for the editor-project persistence seam.`
  - `No existing script-editor project loader or saver exists yet.`

## Implementation Scope

### In Scope

- Admit `queue.editor-project-load-save-foundation` as the first active implementation queue.
- Define the script-editor project manifest and split-table persistence contract.
- Add load/parse helpers for manifest text and imported project directories.
- Add save/serialize helpers that emit canonical split files for the editor project.
- Add bounded validation covering manifest shape, required file registry, and per-object id presence.
- Add targeted regression tests for hydration, validation failures, and save output.

### Still Out Of Scope

- Runtime export pipeline.
- Compatibility import from existing runtime scenario packs into authoring objects.
- Shared condition/effect authoring integration.
- Creator-facing script-editor UI workflow.
- Broad runtime/schema changes beyond the frozen baseline.

## File Map

### Existing files to modify

- `docs/blueprints/project-progress.md`
  - Sync repository entry to the admitted active queue.
- `docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md`
  - Conclude admission review and record active queue truth.
- `docs/change-log.md`
  - Record the queue admission and first implementation slice historically.
- `tests/robustness.test.cjs`
  - Add failing and passing regression coverage for project load/save foundation.

### New files to create

- `docs/blueprints/queues/editor-project-load-save-foundation-queue.md`
  - Queue-level governor for the admitted implementation queue.
- `src/domain/script-editor-project.ts`
  - Domain contract for the manifest-driven editor project and split tables.
- `src/application/script-editor/editor-project-loader.ts`
  - Load/parse/validate helpers for editor-project manifests and imported files.
- `src/application/script-editor/editor-project-save.ts`
  - Canonical split-file serialization for editor-project persistence.

## Verification Plan

- Targeted verification:
  - `node --test --test-name-pattern "script editor project" tests/robustness.test.cjs`
- Required commands:
  - `npm run typecheck`
  - `npm test`
  - `npm run lint:blueprints`
  - `npm run lint:plans`

## Task 1: Admit Queue And Freeze First Slice

**Files:**
- Modify: `docs/blueprints/project-progress.md`
- Modify: `docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md`
- Create: `docs/blueprints/queues/editor-project-load-save-foundation-queue.md`
- Modify: `docs/change-log.md`

- [x] **Step 1: Write the admission conclusion into the version plan**

Set `active_queue` to `queue.editor-project-load-save-foundation`, move the version into `active-execution`, flip `admission_status` to `admitted`, and update the queue promotion ledger plus candidate disposition so the queue is no longer only pending review.

- [x] **Step 2: Create the admitted queue doc with one live execution task**

Create the queue governor with `queue_status = active`, one active task for the first implementation slice, and a bounded scope centered on manifest-driven editor-project load/save plus validation foundation.

- [x] **Step 3: Sync repository entry docs**

Update `docs/blueprints/project-progress.md` to `has_active_queue: true` and point `next_file` at the new queue doc, then append a concise `docs/change-log.md` note for the admission.

- [x] **Step 4: Verify Blueprint governance state**

Run:

```bash
npm run lint:blueprints
```

Expected:

- `Blueprint lint passes with one active queue and matching queue doc.`

## Task 2: Add Failing Tests For Editor Project Load/Save Foundation

**Files:**
- Modify: `tests/robustness.test.cjs`
- Read: `src/application/scenario/scenario-pack-loader.ts`
- Read: `src/application/content/content-pack-loader.ts`

- [x] **Step 1: Write the failing manifest hydration test**

Add a test that imports the future editor-project loader, feeds it a manifest-driven imported file set, and expects the hydrated project to expose the canonical authoring split tables.

- [x] **Step 2: Run the targeted test to verify it fails**

Run:

```bash
node --test --test-name-pattern "script editor project" tests/robustness.test.cjs
```

Expected:

- `FAIL` because the loader module or exported functions do not exist yet.

- [x] **Step 3: Write the failing save-output test**

Add a second test that expects a save helper to emit a canonical manifest plus split JSON files with the required file keys for the editor project.

- [x] **Step 4: Run the targeted test again**

Run:

```bash
node --test --test-name-pattern "script editor project" tests/robustness.test.cjs
```

Expected:

- `FAIL` because save serialization is still missing.

## Task 3: Implement Editor Project Domain And Loader

**Files:**
- Create: `src/domain/script-editor-project.ts`
- Create: `src/application/script-editor/editor-project-loader.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add the editor-project domain contract**

Define the manifest-driven project shape and canonical split-table keys for:
`storyPack`, `people`, `cities`, `buildings`, `events`, `quests`, `dialogues`, `minigames`, `storyNodes`, `textEntries`, `conditionGroups`, and `effectBundles`.

- [x] **Step 2: Implement manifest parsing and imported-file hydration**

Mirror the scenario-pack file-indexing pattern so the loader can parse manifest text, parse imported files, require the canonical file registry, and return a hydrated authoring project.

- [x] **Step 3: Add bounded validation**

Validate `schemaVersion`, `kind`, top-level ids/titles, required file keys, and per-entry non-empty ids without widening into runtime export or shared-rule semantics.

- [x] **Step 4: Run the targeted tests**

Run:

```bash
node --test --test-name-pattern "script editor project" tests/robustness.test.cjs
```

Expected:

- `The hydration and validation tests now pass.`

## Task 4: Implement Save Serialization And Full Verification

**Files:**
- Create: `src/application/script-editor/editor-project-save.ts`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/blueprints/queues/editor-project-load-save-foundation-queue.md`
- Modify: `docs/superpowers/plans/2026-07-13-script-editor-load-save-foundation-plan.md`

- [x] **Step 1: Implement canonical save output**

Serialize the hydrated editor project back into `pack.json` plus canonical split-table JSON text entries without leaking runtime-export concerns into the authoring project.

- [x] **Step 2: Run the targeted test to confirm save output passes**

Run:

```bash
node --test --test-name-pattern "script editor project" tests/robustness.test.cjs
```

Expected:

- `PASS`

- [x] **Step 3: Sync queue and plan after-state**

Update the queue doc snapshot, task ledger, and this plan's `Execution State` / `Progress Log` to reflect the completed implementation slice and the next lawful queue-local step.

- [x] **Step 4: Run repository verification**

Run:

```bash
npm run typecheck
npm test
npm run lint:blueprints
npm run lint:plans
```

Expected:

- `PASS`

## Exit Check

- [x] `queue.editor-project-load-save-foundation is admitted and active in Blueprint truth.`
- [x] `The repository has a manifest-driven editor-project load/save foundation with validation coverage.`
- [x] `The first queue-local implementation slice is verified without widening into export, compatibility import, or UI workflow.`
- [x] Blueprint progress sync is updated if the queue state changed.
- [x] Queue closeout is not written until the queue-local closure judgement is actually satisfied.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
