# Playable Settlement Effects Compatibility Optional Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop `PlayableSettlement` and `createPlayableSettlementShell(...)` from emitting default empty `effects` arrays so playable settlement output matches the branch's command-first compatibility narrowing.

**Architecture:** Runtime commit flow is already command-only for settlement mutation, but `PlayableSettlement` still declares `effects` as required and `createPlayableSettlementShell(...)` still emits `effects: []` by default. This child narrows that playable-owned compatibility surface to optional, removes the default empty-array emission from production settlement shells, updates tests to require absence by default, and leaves explicit compatibility payload support intact when a caller really passes settlement effects.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime/playable contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Task 1 through Task 3 are complete locally. PlayableSettlement.effects is now optional compatibility metadata, createPlayableSettlementShell(...) no longer emits effects: [] by default, and playable completion results omit that field unless a caller explicitly provides compatibility effects.`
- Next Step: `Commit and push this child checkpoint, then choose the next adjacent runtime-only compatibility cleanup below playable-owned settlement metadata.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/flow-playable-runtime-dispatch.test.cjs` passed 2/2; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "playable settlement effects compatibility optional|runtime settlement effects fallback removal|runtime settlement effects compatibility optional|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 446/446; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
- Notes: `This child intentionally does not remove explicit compatibility effects payload support when createPlayableSettlementShell(...) is called with effects, and does not change runtime-settlement's lower-level Effect adapter. docs/superpowers/project-progress.md remains intentionally unrelated.`

## Progress Log

- 2026-07-30
  - Summary: `Created the next adjacent runtime-only child after runtime-flow settlement.effects fallback removal. Audit found that PlayableSettlement still requires effects and createPlayableSettlementShell(...) still emits default effects: [], making it a remaining production compatibility emitter even though runtime flow no longer consumes settlement.effects.`
  - Verification: `rg -n "createPlayableSettlementShell|effects: input\\.effects \\?\\? \\[\\]|type PlayableSettlement" src tests`; `sed -n '1100,1150p' src/core/runtime/playable-runtime.ts`; `sed -n '80,140p' src/core/contracts/playable-runtime.ts`; `sed -n '180,260p' tests/flow-playable-runtime-dispatch.test.cjs`.`
  - Next: `Add RED tests that require playable settlement effects to be optional and omitted by default.`
- 2026-07-30
  - Summary: `Completed Task 1 audit and Task 2 RED coverage. The child boundary stayed fixed on playable-owned settlement metadata, and the new tests required flow-playable completion to omit effects by default plus required playable-runtime source to stop defaulting effects to an empty array.`
  - Verification: `rg -n "createPlayableSettlementShell|effects: input\\.effects \\?\\? \\[\\]|type PlayableSettlement" src tests`; `sed -n '1100,1150p' src/core/runtime/playable-runtime.ts`; `sed -n '80,140p' src/core/contracts/playable-runtime.ts`; `sed -n '180,260p' tests/flow-playable-runtime-dispatch.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/flow-playable-runtime-dispatch.test.cjs` failed at `playable runtime launches and reduces flow playables` before implementation.`
  - Next: `Narrow PlayableSettlement.effects to optional and remove the default empty-array emission from createPlayableSettlementShell(...).`
- 2026-07-30
  - Summary: `Completed Task 3. PlayableSettlement.effects is now optional compatibility metadata, createPlayableSettlementShell(...) only carries effects when explicitly provided, and default playable completion results no longer emit compatibility-only empty arrays.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/flow-playable-runtime-dispatch.test.cjs` passed 2/2; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "playable settlement effects compatibility optional|runtime settlement effects fallback removal|runtime settlement effects compatibility optional|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 446/446; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit and push this playable-settlement compatibility checkpoint, then choose the next adjacent runtime-only compatibility cleanup.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related completed children:
  - `docs/superpowers/plans/2026-07-30-runtime-settlement-effects-compat-optional-plan.md`
  - `docs/superpowers/plans/2026-07-30-runtime-settlement-effects-fallback-removal-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The latest pushed checkpoint is `6510ac6`, which removed runtime-flow settlement.effects fallback from state-sync-runtime.
  - Audit now shows a remaining production compatibility emitter in `createPlayableSettlementShell(...)`, which still defaults `effects` to `[]`.
  - `pnpm run lint:plans` is still expected to fail only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is fixed separately.

## Implementation Scope

### In Scope

- make `PlayableSettlement.effects` optional compatibility metadata
- stop `createPlayableSettlementShell(...)` from emitting default empty `effects` arrays
- update playable/runtime contract tests to require omission by default
- sync this child plus the parent handoff after GREEN verification

### Still Out Of Scope

- removing explicit passed-in compatibility effects payload support from playable settlement shells
- removing `settleRuntimeEffects(...)` from runtime-settlement compatibility adapter
- changing runtime-dispatch routed effect settlement ownership
- UI, map, backpack, `src/main.ts`, or style changes

## File Map

### Existing files to modify

- `src/core/contracts/playable-runtime.ts`
  - Narrow `PlayableSettlement.effects` to an optional compatibility field.
- `src/core/runtime/playable-runtime.ts`
  - Stop default-emitting `effects: []` from `createPlayableSettlementShell(...)`.
- `tests/flow-playable-runtime-dispatch.test.cjs`
  - Require completed flow playable settlements to omit `effects` by default.
- `tests/robustness.test.cjs`
  - Guard that playable settlement shells no longer emit default `effects: []`.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync.
- `docs/superpowers/plans/2026-07-30-playable-settlement-effects-compat-optional-plan.md`
  - This child plan.

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - `PlayableSettlement.effects` is optional compatibility-only metadata
  - default playable completion no longer returns `effects: []`
  - explicit compatibility payload support can remain opt-in
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/flow-playable-runtime-dispatch.test.cjs tests/runtime-result-contract.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "playable settlement effects compatibility optional|runtime settlement effects fallback removal|runtime settlement effects compatibility optional|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit Playable Settlement Compatibility Surface

**Files:**
- Read: `src/core/contracts/playable-runtime.ts`
- Read: `src/core/runtime/playable-runtime.ts`
- Modify: `docs/superpowers/plans/2026-07-30-playable-settlement-effects-compat-optional-plan.md`

- [x] **Step 1: Record the remaining production emitter**

Document that playable settlement shells still emit default empty `effects` arrays.

- [x] **Step 2: Lock the child boundary**

Document that this child only narrows playable settlement compatibility metadata, not the lower-level effect-settlement adapter.

## Task 2: Add RED Coverage For Optional Playable Settlement Effects

**Files:**
- Modify: `tests/flow-playable-runtime-dispatch.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write failing optional-effects tests**

Cover:

- completed playable settlements omit `effects` by default
- playable-runtime source no longer contains `effects: input.effects ?? []`

- [x] **Step 2: Run RED verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/flow-playable-runtime-dispatch.test.cjs
```

Expected:

- the new playable-settlement assertions fail before implementation

## Task 3: Narrow Playable Settlement Effects To Optional

**Files:**
- Modify: `src/core/contracts/playable-runtime.ts`
- Modify: `src/core/runtime/playable-runtime.ts`
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-playable-settlement-effects-compat-optional-plan.md`

- [x] **Step 1: Stop default-emitting empty playable settlement effects**

Keep explicit passed-in compatibility payload support, but omit the field when no effects are provided.

- [x] **Step 2: Run GREEN verification and sync governance**

Run the verification set from `Verification Plan`, then update this child plan and the parent handoff with the exact local-or-pushed checkpoint state.

## Exit Check

- [x] `PlayableSettlement.effects` is optional compatibility metadata.
- [x] Default playable settlement shells no longer emit `effects: []`.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress intentionally remains unchanged for this isolated child.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Playable Settlement Effects Compatibility Optional`
- Parent Task: `mod-first runtime integration handoff`
- Parent Stage: `runtime-only event system migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `commit-and-push-playable-settlement-effects-compatibility`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-playable-settlement-effects-compat-optional-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Review the verified playable-settlement compatibility diff, commit and push it, then open the next adjacent runtime-only compatibility cleanup child.`
