# Runtime Settlement Effects Compatibility Optional Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Narrow `RuntimeResult.settlement.effects` from an always-present field to an explicit optional compatibility-only field.

**Architecture:** The branch is already command-first for runtime settlement ownership: `runtime-settlement` is canonical on commands, `RuntimeResult.settlement.commands` is canonical upstream, and the remaining direct production time-advance callers also use commands. Audit now shows no production source still emits `settlement.effects`; the only remaining references are the compatibility fallback in `state-sync-runtime` plus tests/contract assertions. This child makes `settlement.effects` optional, keeps the fallback behavior for legacy inputs, and stops projecting an always-present empty `effects` field as if it were canonical.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Task 1 through Task 3 are complete locally. RuntimeSettlementResult.effects is now optional, runtime-dispatch only carries settlement.effects when a legacy compatibility payload actually exists, and state-sync-runtime still honors explicit legacy settlement.effects fallback when present.`
- Next Step: `Commit and push this child checkpoint, then open the next adjacent runtime-only compatibility-narrowing child if further settlement fallback removal is desired.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-result-contract.test.cjs tests/runtime-dispatch-settlement.test.cjs tests/state-sync-runtime-commit.test.cjs` passed 13/13; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime result settlement payload exposes canonical settlement commands|runtime settlement effects compatibility optional|runtime settlement uses explicit contract|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 444/444; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` still fails only on unrelated pre-existing docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md missing the required top-level title heading.`
- Notes: `This child intentionally keeps legacy settlement.effects fallback behavior in state-sync-runtime and does not remove settleRuntimeEffects(...) itself. docs/superpowers/project-progress.md remains intentionally unrelated.`

## Progress Log

- 2026-07-30
  - Summary: `Created the next adjacent runtime-only child after direct time-advance caller lowering. Audit shows no production code still emits settlement.effects; the remaining seam is a compatibility-only fallback in state-sync-runtime plus contract/tests that still model effects as required canonical surface.`
  - Verification: `rg -n "settlement:\\s*\\{" src --glob '!**/*.test.*'`; `rg -n "settlement\\?\\.effects|result\\.settlement\\.effects|settlement\\.effects|effects:\\s*settled\\.settledEffects" src tests`; `sed -n '1,260p' src/core/runtime/state-sync-runtime.ts`; `sed -n '1,260p' src/core/runtime/runtime-dispatch.ts`; `sed -n '1,120p' tests/runtime-result-contract.test.cjs`.`
  - Next: `Add RED contract coverage for optional settlement.effects compatibility surface.`
- 2026-07-30
  - Summary: `Completed Task 1 audit. Production code is already command-first and no longer emits settlement.effects; the only remaining seam is compatibility-only summary/fallback handling plus tests that still treated effects as canonical required field.`
  - Verification: `rg -n "settlement:\\s*\\{" src --glob '!**/*.test.*'`; `rg -n "settlement\\?\\.effects|result\\.settlement\\.effects|settlement\\.effects|effects:\\s*settled\\.settledEffects" src tests`; `sed -n '1,260p' src/core/runtime/state-sync-runtime.ts`; `sed -n '1,260p' src/core/runtime/runtime-dispatch.ts`.`
  - Next: `Add RED tests that force the field to become optional compatibility surface.`
- 2026-07-30
  - Summary: `Completed Task 2 RED coverage. Contract and settlement summary tests now require RuntimeSettlementResult.effects to be optional and require runtime-dispatch to stop fabricating canonical empty settlement.effects arrays, while state-sync legacy fallback coverage stays in place for explicit effect payloads.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-result-contract.test.cjs tests/runtime-dispatch-settlement.test.cjs tests/state-sync-runtime-commit.test.cjs` failed as expected before implementation because RuntimeSettlementResult still required effects and runtime-dispatch still projected effects: [] into command-first settlement summaries.`
  - Next: `Make settlement.effects optional and carry it only when a legacy payload is actually present.`
- 2026-07-30
  - Summary: `Completed Task 3. RuntimeSettlementResult.effects is now optional, runtime-dispatch only includes settlement.effects when routed compatibility metadata actually provides it, and state-sync-runtime still settles explicit legacy settlement.effects payloads when present.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-result-contract.test.cjs tests/runtime-dispatch-settlement.test.cjs tests/state-sync-runtime-commit.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime result settlement payload exposes canonical settlement commands|runtime settlement effects compatibility optional|runtime settlement uses explicit contract|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md missing the required top-level title heading.`
  - Next: `Commit and push this child, then choose whether the next adjacent runtime-only child should remove settlement.effects fallback outright or narrow another compatibility seam first.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related completed children:
  - `docs/superpowers/plans/2026-07-30-runtime-settlement-commands-caller-phase-one-plan.md`
  - `docs/superpowers/plans/2026-07-30-time-advance-settlement-command-direct-callers-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The latest pushed checkpoint is `91e9ab6`, which lowered the last direct production advanceTime effect callers to canonical settlement commands.
  - Current audit shows production code no longer emits `settlement.effects`; only `state-sync-runtime` fallback and tests/contracts still keep `effects` as a required settlement field.
  - `pnpm run lint:plans` is still expected to fail only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is fixed separately.

## Implementation Scope

### In Scope

- make `RuntimeSettlementResult.effects` optional
- treat `settlement.effects` as explicit compatibility-only payload in runtime-dispatch/state-sync-runtime
- keep legacy fallback behavior for callers that still pass `settlement.effects`
- update focused contract/compatibility tests and sync this child plus the parent handoff

### Still Out Of Scope

- removing the `settlement.effects` fallback path entirely
- changing routed runtime `effects` ownership in runtime-dispatch
- removing `settleRuntimeEffects(...)` compatibility adapter
- UI, map, backpack, `src/main.ts`, or style changes

## File Map

### Existing files to modify

- `src/core/contracts/runtime-result.ts`
  - Make `RuntimeSettlementResult.effects` optional compatibility surface.
- `src/core/runtime/runtime-dispatch.ts`
  - Stop projecting `effects: []` as always-present summary metadata when no compatibility payload exists.
- `src/core/runtime/state-sync-runtime.ts`
  - Keep fallback behavior, but read optional compatibility effects cleanly.
- `tests/runtime-result-contract.test.cjs`
  - Guard the optional compatibility contract.
- `tests/runtime-dispatch-settlement.test.cjs`
  - Update settlement summary expectations for command-first/optional-effect compatibility behavior.
- `tests/state-sync-runtime-commit.test.cjs`
  - Keep explicit legacy settlement.effects fallback coverage while allowing the field to be optional generally.
- `tests/robustness.test.cjs`
  - Guard that the runtime settlement contract treats effects as optional compatibility-only field.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync.
- `docs/superpowers/plans/2026-07-30-runtime-settlement-effects-compat-optional-plan.md`
  - This child plan.

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - runtime settlement contract treats `effects` as optional compatibility-only field
  - runtime-dispatch keeps command-first summary behavior without fabricating canonical empty effects arrays
  - state-sync-runtime still settles explicit legacy settlement.effects payloads correctly
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-result-contract.test.cjs tests/runtime-dispatch-settlement.test.cjs tests/state-sync-runtime-commit.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime result settlement payload exposes canonical settlement commands|runtime settlement effects compatibility optional|runtime settlement uses explicit contract|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit Optional Compatibility Surface

**Files:**
- Read: `src/core/contracts/runtime-result.ts`
- Read: `src/core/runtime/runtime-dispatch.ts`
- Read: `src/core/runtime/state-sync-runtime.ts`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-settlement-effects-compat-optional-plan.md`

- [x] **Step 1: Record the remaining compatibility-only seam**

Document that production emitters are command-first and `settlement.effects` now survives only as compatibility fallback plus contract/test surface.

- [x] **Step 2: Lock the child boundary**

Document that this child makes the field optional and compatibility-only, but does not yet remove fallback settlement of explicit legacy effects.

## Task 2: Add RED Coverage For Optional Compatibility Effects

**Files:**
- Modify: `tests/runtime-result-contract.test.cjs`
- Modify: `tests/runtime-dispatch-settlement.test.cjs`
- Modify: `tests/state-sync-runtime-commit.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write failing optional-compatibility tests**

Cover:

- `RuntimeSettlementResult.effects` is optional rather than canonical required
- command-first settlement summaries no longer require fabricated empty `effects`
- explicit legacy settlement.effects fallback still works when actually present

- [x] **Step 2: Run RED verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-result-contract.test.cjs tests/runtime-dispatch-settlement.test.cjs tests/state-sync-runtime-commit.test.cjs
```

Expected:

- the new optional-compatibility assertions fail before implementation

## Task 3: Narrow settlement.effects To Optional Compatibility

**Files:**
- Modify: `src/core/contracts/runtime-result.ts`
- Modify: `src/core/runtime/runtime-dispatch.ts`
- Modify: `src/core/runtime/state-sync-runtime.ts`
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-settlement-effects-compat-optional-plan.md`

- [x] **Step 1: Make the shared runtime settlement effects payload optional**

Lower the contract so `settlement.commands` stays canonical and `settlement.effects` becomes optional compatibility surface.

- [x] **Step 2: Keep runtime-dispatch/state-sync-runtime compatibility behavior without treating effects as canonical**

Only carry and settle `settlement.effects` when a legacy payload is actually present.

- [x] **Step 3: Run GREEN verification and sync governance**

Run the verification set from `Verification Plan`, then update this child plan and the parent handoff with the exact local-or-pushed checkpoint state.

## Exit Check

- [x] `RuntimeSettlementResult.effects` is optional compatibility-only field.
- [x] `runtime-dispatch` no longer fabricates canonical empty settlement.effects arrays in command-first summaries.
- [x] `state-sync-runtime` still settles explicit legacy settlement.effects payloads correctly.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress intentionally remains unchanged for this isolated child.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Runtime Settlement Effects Compatibility Optional`
- Parent Task: `mod-first runtime integration handoff`
- Parent Stage: `runtime-only event system migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `commit-push-runtime-settlement-effects-compat-optional-and-open-next-runtime-only-child`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-runtime-settlement-effects-compat-optional-plan.md`
- Push Status: `pending`
- Push Commit: `none`
- Resume From: `Promote this completed-but-open compatibility-narrowing checkpoint into branch history, then open the next adjacent runtime-only settlement/event-system child from the pushed commit.`
