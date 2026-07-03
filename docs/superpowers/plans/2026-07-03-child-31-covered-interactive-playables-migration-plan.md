# Child 31 Covered Interactive Playables Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the already-runtime-adjacent short-form playables `activity-qte` and `city-begging` onto the unified playable runtime skeleton while preserving covered user-visible behavior.

**Architecture:** Child 31 starts only after Child 30 closes. It proves the new playable skeleton against the two safest migration targets: one generic activity QTE path and one stateful multi-variant minigame path. This child must keep compatibility stable, avoid reopening house-local mechanic promotion, and avoid absorbing battle-family migration.

**Tech Stack:** TypeScript, `src/core/runtime`, `src/application/activity`, `src/application/minigames`, `src/ui/views/minigames`, `tests/robustness.test.cjs`, `npm run lint:plans`, `npm run typecheck`, `npm test`, `npm run build`

## Execution State

- Status: `not-started`
- Last Updated: `2026-07-03`
- Current Focus: `Pre-authored future child only. This child remains locked until Child 30 closes and proves the playable runtime skeleton.`
- Next Step: `Run a fresh baseline recheck after Child 30 closeout and confirm that activity-qte and city-begging are still the safest first concrete migrations.`
- Verification: `Not run as part of this doc-only change`
- Notes: `Child 31 should preserve current user-visible behavior and should not absorb grain-accounting, medicine-compounding, or story-battle migration.`

## Progress Log

- 2026-07-03
  - Summary: `Plan created from the unified playable runtime contract spec and candidate queue. Child 31 remains non-executable until Child 30 closes with no unresolved P0/P1 in scope.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Recheck interactive-runtime-covered playable paths after Child 30 closes.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-03-child-31-covered-interactive-playables-migration-spec.md`
- Shared contract spec:
  - `docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md`
- Weekly set plan:
  - `docs/superpowers/plans/2026-07-03-playable-runtime-migration-weekly-orchestration-plan.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `The current covered short-form playables are activity-qte and city-begging under src/core/runtime/interactive-runtime.ts.`
  - `City-begging already has dedicated domain/application/view files and internal variants, so it is a meaningful proof of the shared minigame-family contract.`
  - `This child should leave story-battle to the later battle-family child.`

## Implementation Scope

### In Scope

- migrate `activity-qte` to a playable definition on the Child 30 skeleton
- migrate `city-begging` to a playable definition on the Child 30 skeleton
- resolve these playables through one `playableId` plus one `integrationId`
- preserve current presenter and completion behavior while moving lifecycle ownership into the shared playable runtime
- add targeted regression coverage for short-form migration parity

### Still Out Of Scope

- `grain-accounting`
- `medicine-compounding`
- `story-battle`
- scaffold/validator/CI closeout
- deleting all interactive-runtime compatibility code if later children still depend on it

## File Map

### Existing files to modify

- `src/main.ts`
  - Narrow concrete `interactive.activity-qte.*` and `interactive.city-begging.*` launch/result ownership after migration.
- `src/core/contracts/interactive-runtime.ts`
  - Keep transitional identifiers aligned while the new playable runtime takes over covered paths.
- `src/core/runtime/interactive-runtime.ts`
  - Remove or reduce concrete activity-qte and city-begging ownership once the shared playable runtime owns those paths.
- `src/application/activity/activity-qte-runtime.ts`
  - Reuse mechanism logic under a new playable definition rather than as a direct runtime owner.
- `src/application/minigames/city-begging-minigame.ts`
  - Reuse mechanism logic under a new playable definition.
- `src/application/minigames/city-begging-village-catching.ts`
  - Preserve internal variant behavior.
- `src/application/minigames/city-begging-granary-escort.ts`
  - Preserve internal variant behavior.
- `src/ui/views/minigames/city-begging-minigame-view.ts`
  - Keep feature-specific rendering while consuming the shared presenter path.
- `src/application/app-shell.ts`
  - Align overlay/session carriers if the shared playable session replaces direct app-local minigame state.
- `tests/robustness.test.cjs`
  - Add migration parity regressions for activity-qte and city-begging.
- `docs/change-log.md`
  - Record the covered short-form migration outcome.
- `docs/superpowers/plans/2026-07-03-child-31-covered-interactive-playables-migration-plan.md`
  - Record execution progress and closeout.

### Existing files to read

- `src/domain/city-begging-minigame.ts`
- `src/domain/minigames/city-begging-village-catching.ts`
- `src/domain/minigames/city-begging-granary-escort.ts`
- `src/application/activity/activity-runner.ts`

### New files to create

- `src/application/playables/activity-qte/activity-qte-definition.ts`
  - Playable-definition wrapper around the existing QTE mechanism.
- `src/application/playables/city-begging/city-begging-definition.ts`
  - Playable-definition wrapper around city-begging lifecycle and result facts.
- `src/application/playables/city-begging/city-begging-presenter.ts`
  - Shared presenter mapping if city-begging needs a thin adapter to the new shell.

## Verification Plan

- Targeted verification:
  - `node --test tests/robustness.test.cjs --test-name-pattern "activity qte playable|city begging playable|interactive runtime covered main write-back|minigame dispatch"`
- Required commands:
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`

## Task 1: Recheck Covered Short-Form Playables After Child 30

**Files:**
- Modify: `docs/superpowers/plans/2026-07-03-child-31-covered-interactive-playables-migration-plan.md`
- Read: `src/core/runtime/interactive-runtime.ts`
- Read: `src/application/activity/activity-qte-runtime.ts`
- Read: `src/application/minigames/city-begging-minigame.ts`

- [ ] **Step 1: Reconfirm that activity-qte and city-begging are still the next safest migration targets**

Lock the child boundary after Child 30 closes.

- [ ] **Step 2: Record any narrowed residue**

If Child 30 already moved some compatibility logic, update this plan before execution.

## Task 2: Migrate Activity QTE To A Playable Definition

**Files:**
- Create: `src/application/playables/activity-qte/activity-qte-definition.ts`
- Modify: `src/application/activity/activity-qte-runtime.ts`
- Modify: `src/core/runtime/interactive-runtime.ts`
- Modify: `src/main.ts`

- [ ] **Step 1: Wrap activity-qte mechanism logic in one playable definition**

Move launch/session/result ownership to the shared playable runtime while reusing the existing QTE mechanism.

- [ ] **Step 2: Keep current closeout behavior compatible**

Preserve the covered completion and return flow through the new settlement/handoff path.

## Task 3: Migrate City-Begging To A Playable Definition

**Files:**
- Create: `src/application/playables/city-begging/city-begging-definition.ts`
- Create: `src/application/playables/city-begging/city-begging-presenter.ts`
- Modify: `src/application/minigames/city-begging-minigame.ts`
- Modify: `src/application/minigames/city-begging-village-catching.ts`
- Modify: `src/application/minigames/city-begging-granary-escort.ts`
- Modify: `src/ui/views/minigames/city-begging-minigame-view.ts`
- Modify: `src/core/runtime/interactive-runtime.ts`
- Modify: `src/main.ts`

- [ ] **Step 1: Wrap city-begging lifecycle in one playable definition**

Preserve its internal variants as playable-local detail rather than new top-level runtime families.

- [ ] **Step 2: Move presentation and result reporting through the shared playable shell**

Keep the city-begging-specific UI while shifting lifecycle ownership to the new runtime.

## Task 4: Add Covered Migration Regressions And Artifact Sync

**Files:**
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/change-log.md`

- [ ] **Step 1: Add red-to-green parity regressions**

Prove the covered QTE and city-begging flows now resolve through the playable runtime while preserving expected behavior.

- [ ] **Step 2: Run the required verification commands**

Run:

```bash
npm run lint:plans
npm run typecheck
npm test
npm run build
```

Expected:

- `PASS`

## Exit Check

- [ ] `activity-qte` is owned by the shared playable runtime.
- [ ] `city-begging` is owned by the shared playable runtime.
- [ ] Variant behavior remains internal to `city-begging`.
- [ ] Covered return behavior remains correct.
- [ ] Shared docs are updated if boundaries changed.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
