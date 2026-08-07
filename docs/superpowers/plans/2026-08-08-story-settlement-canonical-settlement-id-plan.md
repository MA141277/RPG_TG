# Story Settlement Canonical Settlement Id Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove covered authored `settlementId` fallback from story settlement runtime handling so this runtime/event seam becomes canonical-first on the current `merage-mod2ui-1` branch.

**Architecture:** This child stays narrow and local to story runtime ownership. It audits the remaining fallback reads in `story-runtime` and `story-settlement-continuation`, adds focused regressions that prove canonical routed settlement metadata is required on the covered path, then removes the covered fallback without reopening startup, review, source-unification, or broad event-router work.

**Tech Stack:** TypeScript story/runtime modules, Node test runner, focused runtime regression suites, `npm run build:test`, targeted `node --test`, `npm run typecheck`, `npm run build`, `npm run lint:plans`, and `git diff --check`.

## Execution State

- Status: `running`
- Last Updated: `2026-08-08`
- Current Focus: `Plan created from the new stabilization spec. The active child is now the story settlement canonical-settlement-id slice, and the next implementation step is to prove the remaining authored fallback reads with focused RED coverage.`
- Next Step: `Execute Task 1 and Task 2, then remove the covered authored settlement-id fallback from story-runtime and story-settlement-continuation.`
- Verification: `Spec committed as b9ab4805. Implementation verification has not run yet for this child.`
- Notes: `This child is canonical-queue work for merage-mod2ui-1. Do not reuse historical runtime-only queue governance or reopen B/C/D lines through this slice.`

## Progress Log

- 2026-08-08
  - Summary: `Opened the story settlement canonical-settlement-id child from the canonical no-child state after auditing current runtime/event residuals. Design chose a new narrow stabilization child instead of reviving the old runtime-only settlement-id payload plan, because the old line intentionally preserved authored fallback and belonged to a different queue.`
  - Verification: `Spec committed as b9ab4805; source audit confirmed direct authored fallback remains in src/application/story/story-runtime.ts and src/application/story/story-settlement-continuation.ts.`
  - Next: `Add focused RED coverage that proves the covered story settlement path must rely on routed settlement metadata instead of eventDefinition.settlementId fallback.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-08-story-settlement-canonical-settlement-id-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `Canonical governance is now back on merage-mod2ui-1 rather than the historical runtime-only queue; the next child must open from docs/superpowers/project-progress.md instead of reviving a completed-but-open 2026-07-30 runtime-only plan.`
  - `Current source still preserves authored settlement-id fallback on the covered path in readStorySettlement(...) and applyStorySettlementEvent(...), even though readRuntimeEventSettlementId(...) already exists and routed events already thread settlement metadata through story runtime.`
  - `The user explicitly kept startup frozen and review-system work paused, so this child must remain entirely inside runtime/event/story ownership.`

## Implementation Scope

### In Scope

- Audit the remaining covered authored settlement-id fallback reads on the current story runtime path.
- Add focused RED/contract coverage for canonical routed settlement metadata consumption.
- Remove the covered authored `eventDefinition.settlementId` fallback from:
  - `src/application/story/story-runtime.ts`
  - `src/application/story/story-settlement-continuation.ts`
- Update canonical governance state while this child is active and when it closes.

### Still Out Of Scope

- Startup-chain work.
- Review-system / temple-review work.
- Source-unification or Script Editor contract work.
- Broad event-router redesign or adjacent runtime-event payload migrations.
- Authored event data rewrites unless the audit proves the current runtime path cannot stay green without them.

## File Map

### Existing files to modify

- `src/application/story/story-runtime.ts`
  - Remove covered authored fallback in `readStorySettlement(...)` and keep routed settlement continuation green.
- `src/application/story/story-settlement-continuation.ts`
  - Remove covered authored fallback in `applyStorySettlementEvent(...)`.
- `tests/story-settlement-continuation.test.cjs`
  - Add focused runtime assertions for canonical settlement-id consumption behavior.
- `tests/indoor-screen-story-runtime.test.cjs`
  - Add or tighten runtime coverage proving routed settlement metadata still drives story continuation on a covered path.
- `tests/robustness.test.cjs`
  - Replace the old “fallback preserved” structure guard with a canonical-first guard.
- `docs/superpowers/project-progress.md`
  - Open this child as the active canonical work item.
- `docs/superpowers/plans/2026-08-08-story-settlement-canonical-settlement-id-plan.md`
  - Track execution state, progress log, verification, and closeout.

### Existing files expected to be deleted

- `none`

### New files to create

- `none by default`

## Verification Plan

- Targeted verification:
  - `story settlement continuation no longer depends on authored eventDefinition.settlementId on the covered runtime path`
  - `routed settlement metadata still applies the intended settlement definition and continuation behavior`
  - `startup/review/source-unification boundaries remain untouched`
- Required commands:
  - `npm run build:test`
  - `node --test tests/story-settlement-continuation.test.cjs tests/indoor-screen-story-runtime.test.cjs`
  - `node --test tests/robustness.test.cjs --test-name-pattern "story settlement canonical settlement id|runtime event settlement id payload consumption|story settlement runtime owner convergence|story settlement next-event convergence"`
  - `npm run typecheck`
  - `npm run build`
  - `npm run lint:plans`
  - `git diff --check`

## Task 1: Audit The Covered Authored Settlement-Id Fallback

**Files:**
- Read: `src/application/story/story-runtime.ts`
- Read: `src/application/story/story-settlement-continuation.ts`
- Read: `tests/story-settlement-continuation.test.cjs`
- Read: `tests/indoor-screen-story-runtime.test.cjs`
- Modify: `docs/superpowers/plans/2026-08-08-story-settlement-canonical-settlement-id-plan.md`

- [ ] **Step 1: Record every covered authored settlement-id fallback read**

Confirm exactly which runtime path still consumes `eventDefinition.settlementId` directly and which routed runtime tests already cover settlement application/continuation behavior.

- [ ] **Step 2: Lock the child boundary**

Record in this plan that the child removes covered authored fallback only on the story settlement runtime path and does not widen into a generic payload/fallback migration batch.

## Task 2: Add RED Coverage For Canonical Story Settlement Consumption

**Files:**
- Modify: `tests/story-settlement-continuation.test.cjs`
- Modify: `tests/indoor-screen-story-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Add focused failing coverage**

Add coverage that proves:

- `applyStorySettlementEvent(...)` no longer accepts authored fallback as the covered contract
- a covered routed story path still applies settlement data through routed settlement metadata
- robustness guards no longer allow `typeof eventDefinition.settlementId` fallback in the covered functions

- [ ] **Step 2: Run RED verification**

Run:

```bash
npm run build:test
node --test tests/story-settlement-continuation.test.cjs tests/indoor-screen-story-runtime.test.cjs --test-name-pattern "settlement"
```

Expected:

- new canonical-first assertions fail before implementation

## Task 3: Remove Covered Authored Settlement-Id Fallback

**Files:**
- Modify: `src/application/story/story-runtime.ts`
- Modify: `src/application/story/story-settlement-continuation.ts`
- Modify: `tests/story-settlement-continuation.test.cjs`
- Modify: `tests/indoor-screen-story-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Remove fallback from story settlement lookup/application**

Make the covered story settlement runtime path consume routed settlement metadata only, and keep settlement application ownership on the shared runtime-settlement seam.

- [ ] **Step 2: Keep covered continuation behavior green**

If a test reveals a legitimate covered caller that is not yet threading routed settlement metadata, fix that caller on the same story runtime seam instead of reintroducing authored fallback.

## Task 4: Verify, Sync Governance, And Close Or Stage The Child

**Files:**
- Modify: `docs/superpowers/project-progress.md`
- Modify: `docs/superpowers/plans/2026-08-08-story-settlement-canonical-settlement-id-plan.md`

- [ ] **Step 1: Run the focused verification batch**

Run the full verification set from `Verification Plan`.

- [ ] **Step 2: Sync the child state**

Update this plan’s `Execution State`, `Progress Log`, checklists, and canonical `project-progress` state so the next resume point is explicit whether the child is still running, completed-but-open, or closed.

- [ ] **Step 3: Commit and push when the slice is complete**

Create one coherent checkpoint for this child and push it to `origin/merage-mod2ui-1`.

## Exit Check

- [ ] Covered story settlement runtime no longer depends on authored `eventDefinition.settlementId` fallback.
- [ ] Routed settlement metadata still drives the intended covered settlement application and continuation behavior.
- [ ] Startup, review-system, and source-unification boundaries remain untouched.
- [ ] Project progress sync is updated if the child state changed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `Replace when closing.`
- Parent Task: `Replace when closing.`
- Parent Stage: `Replace when closing.`
- Closeout Status: `closed`
- Project Progress Synced: `yes/no`
- Next Child: `Replace when closing.`
- Next Child Status: `waiting/running/blocked/none`
- Next Required Action: `Replace when closing.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `Replace when closing.`
- Push Status: `success/failure/not-pushed`
- Push Commit: `commit-sha-or-none`
- Resume From: `Replace when closing.`
