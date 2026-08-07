# Mod-First Event Binding Candidate Task Input Payload Consumption Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move mod-first event-binding candidate task inputs onto `RuntimeEventEntity.payload.taskInputs` so the covered candidate seam no longer rereads authored `eventDefinition.taskInputs`.

**Architecture:** This child stays narrow and local to runtime/event ownership. It audits the remaining authored reread in `mod-first-compatibility.ts`, adds focused RED coverage for payload-owned candidate task-input projection, then updates the candidate builder to reuse the shared runtime-event projection seam without changing route activation, action handling, state-only classification, startup, review-system, source-unification, Script Editor, or playable behavior.

**Tech Stack:** TypeScript runtime modules, Node test runner, focused event-binding regression tests, `npm run build:test`, targeted `node --test`, `npm run typecheck`, `npm run build`, `npm run lint:plans`, and `git diff --check`.

## Execution State

- Status: `closed`
- Last Updated: `2026-08-08`
- Current Focus: `Child is closed after verified implementation checkpoint c5af4ea4 was pushed to origin/merage-mod2ui-1.`
- Next Step: `Return to docs/superpowers/project-progress.md and open the next approved stabilization child.`
- Verification: `npm run build:test; node --test --test-name-pattern "task input|candidate" tests/event-binding-start-runtime.test.cjs (RED before implementation, GREEN after implementation); node --test tests/event-binding-start-runtime.test.cjs; node --test --test-name-pattern "mod-first event binding candidate task input|runtime event binding action payload consumption|runtime event task input payload consumption|event binding runtime route convergence" tests/robustness.test.cjs; npm run typecheck; npm run lint:plans; git diff --check; npm run build`
- Notes: `This child is canonical-queue work for merage-mod2ui-1. Do not reuse historical runtime-only queue governance or reopen startup, source-unification, review-system, Script Editor, playable, closeBuilding, or launchFlow work through this slice.`

## Progress Log

- 2026-08-08
  - Summary: `Opened the mod-first event-binding candidate task-input child from the canonical no-child state after auditing current runtime/event residuals. Design chose a new narrow stabilization child instead of reviving the old event-runtime candidate plan, because the current residual is in mod-first event-binding candidate projection rather than event-runtime candidate projection.`
  - Verification: `rg -n "eventDefinition\\.(dialogueId|settlementId|taskInputs|actions|entrySceneId|nextEventId|emitEventIds)|fallbackEventDefinition|closeBuilding|launchFlow|readRuntimeEvent(DialogueId|SettlementId|TaskInputs|Actions)|createRuntimeEventEntity\\(" src/application src/core tests`
  - Next: `Add focused RED coverage that proves mod-first event-binding candidate task inputs must rely on runtime-event payload projection instead of eventDefinition.taskInputs.`
- 2026-08-08
  - Summary: `Completed Task 1 audit. The covered authored reread is limited to taskInputs: eventDefinition.taskInputs ?? [] inside toModFirstEventBindingRuntimeCandidate(...) in src/core/runtime/mod-first-compatibility.ts. Adjacent event-runtime candidate taskInputs, story routed taskInputs, event-binding action application, and state-only dialogue-id classification already consume runtime-event payload readers, so this child remains a narrow mod-first event-binding candidate projection cleanup.`
  - Verification: `rg -n "toModFirstEventBindingRuntimeCandidate|selectModFirstEventBindingCandidate|runModFirstEventBindingRuntime|taskInputs" tests/event-binding-start-runtime.test.cjs tests/event-router-runtime.test.cjs tests/robustness.test.cjs src/core/runtime/mod-first-compatibility.ts src/core/runtime/event-binding-runtime.ts`
  - Next: `Execute Task 2 and add focused RED coverage for payload-owned mod-first event-binding candidate taskInputs.`
- 2026-08-08
  - Summary: `Completed Task 2 RED coverage. tests/event-binding-start-runtime.test.cjs now proves candidate and activation taskInputs consume the routed runtime-event payload seam, and tests/robustness.test.cjs guards toModFirstEventBindingRuntimeCandidate(...) against reverting to eventDefinition.taskInputs.`
  - Verification: `npm run build:test; node --test --test-name-pattern "task input|candidate" tests/event-binding-start-runtime.test.cjs failed before implementation with candidate taskInputs [] instead of the payload seam value.`
  - Next: `Execute Task 3 by moving toModFirstEventBindingRuntimeCandidate(...) onto readRuntimeEventTaskInputs(createRuntimeEventEntity(...)).`
- 2026-08-08
  - Summary: `Completed Task 3 implementation. src/core/runtime/mod-first-compatibility.ts now creates a RuntimeEventEntity from the authored event and reads candidate taskInputs through readRuntimeEventTaskInputs(...), keeping the candidate projection on the shared payload-owned runtime/event seam.`
  - Verification: `node --test --test-name-pattern "task input|candidate" tests/event-binding-start-runtime.test.cjs passed after implementation.`
  - Next: `Run the full focused verification batch and sync governed state.`
- 2026-08-08
  - Summary: `Completed Task 4 verification for the implementation checkpoint. The verified slice changes only runtime/event candidate task-input projection plus focused tests, change log, and governed progress docs; startup, review-system, source-unification, Script Editor, playable runtime, closeBuilding, launchFlow, and scenario-pack JSON remain out of scope.`
  - Verification: `npm run build:test; node --test tests/event-binding-start-runtime.test.cjs; node --test --test-name-pattern "mod-first event binding candidate task input|runtime event binding action payload consumption|runtime event task input payload consumption|event binding runtime route convergence" tests/robustness.test.cjs; npm run typecheck; npm run lint:plans; git diff --check; npm run build`
  - Next: `Commit and push the verified implementation checkpoint, then record structured child closeout.`
- 2026-08-08
  - Summary: `Committed and pushed the verified implementation checkpoint c5af4ea4 to origin/merage-mod2ui-1, then closed the child with structured project-progress sync.`
  - Verification: `git push origin merage-mod2ui-1`
  - Next: `Return to docs/superpowers/project-progress.md and open the next approved stabilization child.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-08-mod-first-event-binding-candidate-task-input-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `Canonical governance is back to no active child after Story Settlement Canonical Settlement Id closed.`
  - `Current event-runtime candidate task-input projection is already canonicalized; the remaining covered residual is in mod-first event-binding candidate projection.`
  - `The user kept startup frozen and review-system work paused, so this child must remain entirely inside runtime/event ownership.`

## Implementation Scope

### In Scope

- Audit the remaining covered authored `taskInputs` reread in `toModFirstEventBindingRuntimeCandidate(...)`.
- Add focused RED/contract coverage for payload-owned mod-first event-binding candidate task-input projection.
- Update `src/core/runtime/mod-first-compatibility.ts` so candidate task inputs are read through:
  - `createRuntimeEventEntity(eventDefinition)`
  - `readRuntimeEventTaskInputs(runtimeEvent)`
- Update canonical governance state while this child is active and when it closes.

### Still Out Of Scope

- Startup-chain work.
- Review-system / temple-review work.
- Source-unification or Script Editor contract work.
- Broad event-router redesign.
- `closeBuilding` or `launchFlow` compatibility cleanup.
- Authored event JSON rewrites.
- Playable runtime, playable integration, or playable settlement work.
- UI, map, backpack, and style boundaries.

## File Map

### Existing files to modify

- `src/core/runtime/mod-first-compatibility.ts`
  - Move `toModFirstEventBindingRuntimeCandidate(...)` task-input projection onto the shared runtime-event payload seam.
- `tests/event-binding-start-runtime.test.cjs`
  - Add runtime assertions that candidate/activation task inputs come from the shared projection seam.
- `tests/robustness.test.cjs`
  - Add a source guard that the covered candidate projection no longer reads `eventDefinition.taskInputs`.
- `docs/superpowers/project-progress.md`
  - Open this child as the active canonical work item and sync closeout when complete.
- `docs/superpowers/plans/2026-08-08-mod-first-event-binding-candidate-task-input-plan.md`
  - Track execution state, progress log, verification, and closeout.

### Existing files expected to be deleted

- `none`

### New files to create

- `none by default`

## Verification Plan

- Targeted verification:
  - `mod-first event-binding candidate task inputs no longer depend on authored eventDefinition.taskInputs`
  - `event-binding activation still receives intended taskInputs through runtime-event payload projection`
  - `startup/review/source-unification/Script Editor/playable boundaries remain untouched`
- Required commands:
  - `npm run build:test`
  - `node --test tests/event-binding-start-runtime.test.cjs`
  - `node --test --test-name-pattern "mod-first event binding candidate task input|runtime event binding action payload consumption|runtime event task input payload consumption|event binding runtime route convergence" tests/robustness.test.cjs`
  - `npm run typecheck`
  - `npm run build`
  - `npm run lint:plans`
  - `git diff --check`

## Task 1: Audit The Covered Mod-First Candidate Task-Input Reread

**Files:**
- Read: `src/core/runtime/mod-first-compatibility.ts`
- Read: `src/core/runtime/event-entity-projection.ts`
- Read: `tests/event-binding-start-runtime.test.cjs`
- Modify: `docs/superpowers/plans/2026-08-08-mod-first-event-binding-candidate-task-input-plan.md`

- [x] **Step 1: Record the covered authored taskInputs reread**

Confirm that `toModFirstEventBindingRuntimeCandidate(...)` is the covered runtime/event candidate path that still consumes `eventDefinition.taskInputs ?? []` directly.

- [x] **Step 2: Lock the child boundary**

Record that this child changes only mod-first event-binding candidate task-input projection and does not widen into `closeBuilding`, `launchFlow`, Script Editor, startup, review-system, or playable work.

## Task 2: Add RED Coverage For Payload-Owned Mod-First Candidate Task Inputs

**Files:**
- Modify: `tests/event-binding-start-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add focused failing coverage**

Add coverage that proves:

- `runEventBindingRuntime(...)` candidate and activation taskInputs consume `readRuntimeEventTaskInputs(...)`
- the source guard no longer allows `taskInputs: eventDefinition.taskInputs ?? []` in `toModFirstEventBindingRuntimeCandidate(...)`

- [x] **Step 2: Run RED verification**

Run:

```bash
npm run build:test
node --test --test-name-pattern "task input|candidate" tests/event-binding-start-runtime.test.cjs
```

Expected:

- new canonical-first assertions fail before implementation

## Task 3: Move Candidate Task Inputs Onto Runtime-Event Payload Projection

**Files:**
- Modify: `src/core/runtime/mod-first-compatibility.ts`
- Modify: `tests/event-binding-start-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Update the candidate projection**

Import the shared projection helpers and make `toModFirstEventBindingRuntimeCandidate(...)` read task inputs from `readRuntimeEventTaskInputs(createRuntimeEventEntity(eventDefinition))`.

- [x] **Step 2: Keep event-binding activation behavior green**

If a test reveals a legitimate covered caller that is not yet compatible with runtime-event projection, fix that caller on the same runtime/event seam instead of reintroducing authored rereads.

## Task 4: Verify, Sync Governance, And Close Or Stage The Child

**Files:**
- Modify: `docs/superpowers/project-progress.md`
- Modify: `docs/superpowers/plans/2026-08-08-mod-first-event-binding-candidate-task-input-plan.md`

- [x] **Step 1: Run the focused verification batch**

Run the full verification set from `Verification Plan`.

- [x] **Step 2: Sync the child state**

Update this plan's `Execution State`, `Progress Log`, checklists, and canonical `project-progress` state so the next resume point is explicit whether the child is still running, completed-but-open, or closed.

- [x] **Step 3: Commit and push when the slice is complete**

Create one coherent checkpoint for this child and push it to `origin/merage-mod2ui-1`.

## Exit Check

- [x] Covered mod-first event-binding candidate task inputs no longer depend on authored `eventDefinition.taskInputs` reread.
- [x] Runtime-event payload metadata still reaches event-binding candidate and activation behavior.
- [x] Startup, review-system, source-unification, Script Editor, playable, UI, map, backpack, and style boundaries remain untouched.
- [x] Project progress sync is updated if the child state changed.
- [x] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Mod-First Event Binding Candidate Task Input Payload Consumption`
- Parent Task: `Post-Merge Branch Stabilization`
- Parent Stage: `Post-Merge Branch Stabilization`
- Closeout Status: `closed`
- Project Progress Synced: `yes`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `open-next-approved-child`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `none`
- Push Status: `success`
- Push Commit: `c5af4ea4`
- Resume From: `Open docs/superpowers/project-progress.md, then open the next approved stabilization child from the pushed mod-first event-binding task-input baseline; startup remains frozen and review-system work stays paused unless explicitly resumed.`
