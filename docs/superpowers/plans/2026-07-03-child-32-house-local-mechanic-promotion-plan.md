# Child 32 House-Local Mechanic Promotion Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promote `grain-accounting` and `medicine-compounding` from house-local mechanism ownership into full playable definitions that still return cleanly to their host house flows.

**Architecture:** Child 32 starts only after Child 31 proves the shared playable shell with covered short-form playables. This child promotes two existing house-local mechanics into unified playables without rewriting their houses into permanent gameplay owners. The houses may remain integration owners and trigger owners, but mechanic lifecycle, result emission, settlement, and handoff must move behind the shared playable runtime.

**Tech Stack:** TypeScript, `src/application/grain-shop`, `src/application/medicine-house`, house modules, house views, playable runtime skeleton, `tests/robustness.test.cjs`, `npm run lint:plans`, `npm run typecheck`, `npm test`, `npm run build`

## Execution State

- Status: `not-started`
- Last Updated: `2026-07-03`
- Current Focus: `Pre-authored future child only. This child remains candidate-only until Child 31 closes and the queue later promotes house-local mechanic migration.`
- Next Step: `Recheck grain-shop and medicine-house ownership after Child 31 closes and confirm that the shared playable shell can now absorb house-local mechanics safely.`
- Verification: `Not run as part of this doc-only change`
- Notes: `Child 32 must keep house-specific narrative and menu ownership in house modules while moving the mechanics themselves into the shared playable family.`

## Progress Log

- 2026-07-03
  - Summary: `Plan created for the later house-local mechanic promotion phase. Child 32 remains non-executable until the earlier playable skeleton and covered minigame migrations close.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Recheck house-local mechanic ownership after Child 31.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-03-child-32-house-local-mechanic-promotion-spec.md`
- Shared contract spec:
  - `docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md`
- Weekly set plan:
  - `docs/superpowers/plans/2026-07-03-playable-runtime-migration-weekly-orchestration-plan.md`
- Related host contract:
  - `docs/special-house-interface.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `grain-accounting` currently lives under src/application/grain-shop/accounting-minigame.ts and is still launched/settled through grain-shop house-local flow ownership.`
  - `medicine-compounding` currently lives under src/application/medicine-house/compounding-minigame.ts and is still rendered as a medicine-house overlay.`
  - `This child must keep house interface rules intact and must not push house-specific business into main.ts.`

## Implementation Scope

### In Scope

- promote `grain-accounting` to a playable definition
- promote `medicine-compounding` to a playable definition
- move lifecycle/result/settlement ownership behind the shared playable runtime
- keep house modules as integration owners and return destinations where appropriate
- add parity regressions for grain-shop and medicine-house playable return behavior
- update shared house/playable docs if boundaries move

### Still Out Of Scope

- migrating `story-battle`
- global scaffold/validator/CI closeout
- redesigning grain-shop or medicine-house narrative content
- adding brand-new house implementations

## File Map

### Existing files to modify

- `docs/special-house-interface.md`
  - Update only if the shared house-to-playable launch or return contract changes.
- `src/application/grain-shop/accounting-minigame.ts`
  - Reuse accounting mechanism logic under a new playable definition.
- `src/application/grain-shop/apply-accounting-reward.ts`
  - Reduce or relocate mechanism-local reward assumptions once outcome config owns story settlement.
- `src/application/house-modules/grain-shop/grain-shop-house-module.ts`
  - Convert house-local launch and result handling to the shared playable runtime path.
- `src/ui/views/house/grain-shop-house-view.ts`
  - Keep host-house UI compatible while the mechanic becomes a shared playable.
- `src/application/medicine-house/compounding-minigame.ts`
  - Reuse compounding mechanism logic under a new playable definition.
- `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
  - Convert house-local launch and result handling to the shared playable runtime path.
- `src/ui/views/house/medicine-house-house-view.ts`
  - Keep host-house UI compatible while the mechanic becomes a shared playable.
- `src/domain/house-module.ts`
  - Align overlay/session types if the house contract must reference the shared playable runtime instead of house-local overlays.
- `tests/robustness.test.cjs`
  - Add parity regressions for accounting and compounding migration.
- `docs/change-log.md`
  - Record the house-local mechanic promotion outcome.
- `docs/superpowers/plans/2026-07-03-child-32-house-local-mechanic-promotion-plan.md`
  - Record execution progress and closeout.

### Existing files to read

- `src/domain/grain-shop.ts`
- `src/domain/medicine-house.ts`
- `src/domain/house-modules/grain-shop-session.ts`
- `src/domain/house-modules/medicine-house-session.ts`

### New files to create

- `src/application/playables/grain-accounting/grain-accounting-definition.ts`
  - Playable-definition wrapper around the accounting mechanism.
- `src/application/playables/medicine-compounding/medicine-compounding-definition.ts`
  - Playable-definition wrapper around the compounding mechanism.

## Verification Plan

- Targeted verification:
  - `node --test tests/robustness.test.cjs --test-name-pattern "grain accounting playable|medicine compounding playable|special house interface|grain shop|medicine house"`
- Required commands:
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`

## Task 1: Recheck House-Local Mechanic Ownership

**Files:**
- Modify: `docs/superpowers/plans/2026-07-03-child-32-house-local-mechanic-promotion-plan.md`
- Read: `src/application/house-modules/grain-shop/grain-shop-house-module.ts`
- Read: `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
- Read: `docs/special-house-interface.md`

- [ ] **Step 1: Reconfirm the current grain-shop and medicine-house mechanic boundaries**

Lock what remains house-owned and what must move into the shared playable runtime.

- [ ] **Step 2: Confirm the house contract impact before execution**

If shared launch/return semantics change, plan the required doc sync before code work starts.

## Task 2: Promote Grain Accounting

**Files:**
- Create: `src/application/playables/grain-accounting/grain-accounting-definition.ts`
- Modify: `src/application/grain-shop/accounting-minigame.ts`
- Modify: `src/application/grain-shop/apply-accounting-reward.ts`
- Modify: `src/application/house-modules/grain-shop/grain-shop-house-module.ts`
- Modify: `src/ui/views/house/grain-shop-house-view.ts`

- [ ] **Step 1: Wrap the accounting mechanism in one playable definition**

Move mechanic lifecycle and fact-result emission behind the shared playable shell.

- [ ] **Step 2: Move settlement ownership out of house-local reward branches**

Keep scenario/house semantics in integration config or host integration logic rather than in the mechanic reducer.

## Task 3: Promote Medicine Compounding

**Files:**
- Create: `src/application/playables/medicine-compounding/medicine-compounding-definition.ts`
- Modify: `src/application/medicine-house/compounding-minigame.ts`
- Modify: `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
- Modify: `src/ui/views/house/medicine-house-house-view.ts`

- [ ] **Step 1: Wrap the compounding mechanism in one playable definition**

Move mechanic lifecycle and fact-result emission behind the shared playable shell.

- [ ] **Step 2: Keep house return behavior correct**

Ensure completion returns to the correct medicine-house session or reentry path through formal handoff.

## Task 4: Add House-Local Migration Regressions And Artifact Sync

**Files:**
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/special-house-interface.md` if shared boundaries moved
- Modify: `docs/change-log.md`

- [ ] **Step 1: Add red-to-green parity regressions**

Prove both mechanics became shared playables while their host houses still recover correctly.

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

- [ ] `grain-accounting` is a shared playable rather than a house-local mechanic owner.
- [ ] `medicine-compounding` is a shared playable rather than a house-local mechanic owner.
- [ ] Host houses still return to the correct owner/session.
- [ ] `docs/special-house-interface.md` is updated if shared launch/return boundaries changed.
- [ ] Shared docs are updated if boundaries changed.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
