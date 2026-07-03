# Child 32 House-Local Mechanic Promotion Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promote `grain-accounting` and `medicine-compounding` from house-local mechanism ownership into full playable definitions that still return cleanly to their host house flows.

**Architecture:** Child 32 starts only after Child 31 proves the shared playable shell with covered short-form playables. This child promotes two existing house-local mechanics into unified playables without rewriting their houses into permanent gameplay owners. The houses may remain integration owners and trigger owners, but mechanic lifecycle, result emission, settlement, and handoff must move behind the shared playable runtime.

**Tech Stack:** TypeScript, `src/application/grain-shop`, `src/application/medicine-house`, house modules, house views, playable runtime skeleton, `tests/robustness.test.cjs`, `npm run lint:plans`, `npm run typecheck`, `npm test`, `npm run build`

## Execution State

- Status: `completed`
- Last Updated: `2026-07-03`
- Current Focus: `Child 32 is closed. Grain-accounting and medicine-compounding now launch and settle through shared playable-runtime house integrations while grain-shop and medicine-house remain the host trigger/return owners.`
- Next Step: `Run a fresh baseline recheck for Child 33 before promoting story-battle migration.`
- Verification: `npm run lint:plans`, `npm run typecheck`, `npm test`, `npm run build`
- Notes: `Child 32 preserved current house UIs and action ids, so the migration stayed inside runtime/application boundaries without forcing a house-view redesign.`

## Progress Log

- 2026-07-03
  - Summary: `Plan created for the later house-local mechanic promotion phase. Child 32 remains non-executable until the earlier playable skeleton and covered minigame migrations close.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Recheck house-local mechanic ownership after Child 31.`
- 2026-07-03
  - Summary: `Completed Child 32 after a fresh baseline recheck. Added house-to-playable runtime bridging, promoted grain-accounting and medicine-compounding into shared playable definitions, registered both integrations, and reduced the host house modules to trigger/return owners that delegate lifecycle and settlement into playable-runtime.`
  - Verification: `npm run lint:plans`, `npm run typecheck`, `npm test`, `npm run build`
  - Next: `Keep Child 33 non-executable until a fresh baseline recheck promotes the battle-family migration.`

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

- Recheck result: `narrowed`
- Notes:
  - `Child 31 already proved the shared playable shell and shared playableSession carrier, so Child 32 no longer needed to reopen top-level runtime skeleton questions.`
  - `The remaining migration surface was narrowed to two house-local mechanics: grain-accounting under grain-shop and medicine-compounding under medicine-house.`
  - `This child still had to keep house interface rules intact and avoid pushing any house-specific business back into main.ts.`

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
- `src/application/house-modules/grain-shop/grain-shop-house-module.ts`
  - Convert house-local launch and result handling to the shared playable runtime path.
- `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
  - Convert house-local launch and result handling to the shared playable runtime path.
- `src/core/registry/playable-definition-registry.ts`
  - Register the two new house-local playable definitions.
- `src/core/registry/playable-integration-registry.ts`
  - Register the two new house-owned integration ids.
- `src/core/runtime/playable-runtime.ts`
  - Own the shared launch/action/tick/finish/exit flow for the promoted house-local playables.
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
- `src/core/runtime/playable-runtime.ts`

### New files to create

- `src/application/playables/grain-accounting/grain-accounting-definition.ts`
  - Playable-definition wrapper around the accounting mechanism.
- `src/application/playables/medicine-compounding/medicine-compounding-definition.ts`
  - Playable-definition wrapper around the compounding mechanism.
- `src/application/playables/house-playable-runtime-bridge.ts`
  - Shared bridge for house-session-backed playable runtime dispatch.

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

- [x] **Step 1: Reconfirm the current grain-shop and medicine-house mechanic boundaries**

Lock what remains house-owned and what must move into the shared playable runtime.

- [x] **Step 2: Confirm the house contract impact before execution**

If shared launch/return semantics change, plan the required doc sync before code work starts.

## Task 2: Promote Grain Accounting

**Files:**
- Create: `src/application/playables/grain-accounting/grain-accounting-definition.ts`
- Modify: `src/application/grain-shop/accounting-minigame.ts`
- Modify: `src/application/grain-shop/apply-accounting-reward.ts`
- Modify: `src/application/house-modules/grain-shop/grain-shop-house-module.ts`
- Modify: `src/ui/views/house/grain-shop-house-view.ts`

- [x] **Step 1: Wrap the accounting mechanism in one playable definition**

Move mechanic lifecycle and fact-result emission behind the shared playable shell.

- [x] **Step 2: Move settlement ownership out of house-local reward branches**

Keep scenario/house semantics in integration config or host integration logic rather than in the mechanic reducer.

## Task 3: Promote Medicine Compounding

**Files:**
- Create: `src/application/playables/medicine-compounding/medicine-compounding-definition.ts`
- Modify: `src/application/medicine-house/compounding-minigame.ts`
- Modify: `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
- Modify: `src/ui/views/house/medicine-house-house-view.ts`

- [x] **Step 1: Wrap the compounding mechanism in one playable definition**

Move mechanic lifecycle and fact-result emission behind the shared playable shell.

- [x] **Step 2: Keep house return behavior correct**

Ensure completion returns to the correct medicine-house session or reentry path through formal handoff.

## Task 4: Add House-Local Migration Regressions And Artifact Sync

**Files:**
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/special-house-interface.md` if shared boundaries moved
- Modify: `docs/change-log.md`

- [x] **Step 1: Add red-to-green parity regressions**

Prove both mechanics became shared playables while their host houses still recover correctly.

- [x] **Step 2: Run the required verification commands**

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

- [x] `grain-accounting` is a shared playable rather than a house-local mechanic owner.
- [x] `medicine-compounding` is a shared playable rather than a house-local mechanic owner.
- [x] Host houses still return to the correct owner/session.
- [x] `docs/special-house-interface.md` is updated if shared launch/return boundaries changed.
- [x] Shared docs are updated if boundaries changed.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
