# Settlement Runtime Contract Rename Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the command-native settlement contract file away from `effect-settlement.ts` so the remaining codebase no longer uses a misleading effect-era contract name for command settlement ownership.

**Architecture:** The previous child removed the effect adapter and effect-specific settlement types, but the surviving command-native contract still lives in `src/core/contracts/effect-settlement.ts`. This child keeps scope narrow: create a command-native contract file name, repoint the active import sites and robustness guards, delete the legacy file, and leave runtime behavior unchanged.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `The command-native settlement contract now lives at src/core/contracts/settlement-runtime.ts and live code no longer imports the historical effect-settlement filename.`
- Next Step: `Commit/push this child, then continue with the next command-native settlement/test cleanup slice below the renamed contract surface.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-settlement-content.test.cjs tests/runtime-dispatch-settlement.test.cjs` passed 21/21; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "settlement runtime contract rename|runtime settlement effect adapter removal|runtime dispatch effect settlement contract removal|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 451/451; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
- Notes: `This child changes only contract file naming/wiring, not runtime behavior. docs/superpowers/project-progress.md remains intentionally unrelated.`

## Progress Log

- 2026-07-30
  - Summary: `Created the next runtime-only cleanup child after effect adapter removal. Audit found src/core/contracts/effect-settlement.ts now exports only command-native settlement types, while the active code import sites are runtime-settlement, active-game-content, and domain/content-pack plus robustness guards.`
  - Verification: `rg -n 'from \"\\.\\.?/.*/effect-settlement\"|from \"\\.\\.?/contracts/effect-settlement\"|core/contracts/effect-settlement' src tests`; `sed -n '1,120p' src/core/runtime/runtime-settlement.ts`; `sed -n '1,120p' src/application/content/active-game-content.ts`; `sed -n '1,120p' src/domain/content-pack.ts`.`
  - Next: `Add RED coverage that forces the command-native contract rename through the live import surface.`
- 2026-07-30
  - Summary: `Added RED guards for the legacy path, then moved the command-native settlement contract to src/core/contracts/settlement-runtime.ts, repointed runtime-settlement and content-pack consumers, updated robustness reads, and deleted src/core/contracts/effect-settlement.ts.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-settlement-content.test.cjs tests/runtime-dispatch-settlement.test.cjs` passed 21/21; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "settlement runtime contract rename|runtime settlement effect adapter removal|runtime dispatch effect settlement contract removal|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 451/451; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this child, then continue with the next command-native settlement/test cleanup slice below the renamed contract surface.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related completed children:
  - `docs/superpowers/plans/2026-07-30-runtime-settlement-effect-adapter-removal-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The latest pushed checkpoint is `7e279bb`, which removed `settleRuntimeEffects(...)` and the effect-specific settlement contract types.
  - Audit now shows `src/core/contracts/effect-settlement.ts` exports only command-native types and is therefore misnamed relative to current ownership.
  - `pnpm run lint:plans` is still expected to fail only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is fixed separately.

## Implementation Scope

### In Scope

- introduce a command-native settlement contract file name
- repoint active code imports and robustness guards
- delete the legacy `effect-settlement.ts` file
- sync this child plus the parent handoff after GREEN verification

### Still Out Of Scope

- changing runtime behavior
- renaming settlement data model types like `SettlementDefinition`
- changing `src/main.ts`, UI, map, backpack, or style paths

## File Map

### Existing files to modify

- `src/core/runtime/runtime-settlement.ts`
  - Repoint command-native contract import to the renamed file.
- `src/application/content/active-game-content.ts`
  - Repoint `SettlementDefinition` import.
- `src/domain/content-pack.ts`
  - Repoint `SettlementDefinition` import.
- `tests/robustness.test.cjs`
  - Repoint file reads and add a guard against lingering code imports from the legacy filename.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync.
- `docs/superpowers/plans/2026-07-30-settlement-runtime-contract-rename-plan.md`
  - This child plan.

### New files to create

- `src/core/contracts/settlement-runtime.ts`
  - New command-native settlement contract home.

### Existing files to delete

- `src/core/contracts/effect-settlement.ts`
  - Legacy filename removed after imports move.

## Verification Plan

- Targeted verification:
  - live code no longer imports `src/core/contracts/effect-settlement.ts`
  - command-native settlement contract remains intact under the new filename
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-settlement-content.test.cjs tests/runtime-dispatch-settlement.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "settlement runtime contract rename|runtime settlement effect adapter removal|runtime dispatch effect settlement contract removal|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit The Misnamed Command-Native Contract

**Files:**
- Read: `src/core/runtime/runtime-settlement.ts`
- Read: `src/application/content/active-game-content.ts`
- Read: `src/domain/content-pack.ts`
- Modify: `docs/superpowers/plans/2026-07-30-settlement-runtime-contract-rename-plan.md`

- [x] **Step 1: Record the remaining filename debt**

Document that the contract file is command-native already but still lives at an effect-era path.

- [x] **Step 2: Lock the child boundary**

Document that this child renames only the contract file/imports and does not change runtime behavior.

## Task 2: Add RED Coverage For The Rename

**Files:**
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write failing rename guards**

Cover:

- active code no longer imports `effect-settlement`
- robustness reads the renamed command-native contract file

- [x] **Step 2: Run RED verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "settlement runtime contract rename"
```

Expected:

- the new guard fails before implementation

## Task 3: Rehome The Command-Native Contract

**Files:**
- Create: `src/core/contracts/settlement-runtime.ts`
- Delete: `src/core/contracts/effect-settlement.ts`
- Modify: `src/core/runtime/runtime-settlement.ts`
- Modify: `src/application/content/active-game-content.ts`
- Modify: `src/domain/content-pack.ts`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-settlement-runtime-contract-rename-plan.md`

- [x] **Step 1: Move imports to the renamed command-native contract**

Keep runtime behavior unchanged and delete the legacy filename after all live imports move.

- [x] **Step 2: Run GREEN verification and sync governance**

Run the verification set from `Verification Plan`, then update this child plan and the parent handoff with the exact local-or-pushed checkpoint state.

## Exit Check

- [x] Live code no longer imports `src/core/contracts/effect-settlement.ts`.
- [x] The command-native settlement contract lives at the renamed file path.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress intentionally remains unchanged for this isolated child.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Settlement Runtime Contract Rename`
- Parent Task: `mod-first runtime integration handoff`
- Parent Stage: `runtime-only event system migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `not-started`
- Next Required Action: `commit-push-settlement-runtime-contract-rename`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-settlement-runtime-contract-rename-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `After commit/push, continue from the remaining command-native settlement/test cleanup surface and keep the next slice runtime-only.`
