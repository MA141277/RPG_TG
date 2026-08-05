# Event Router First Runtime Convergence Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge the current branch onto an event-router-first runtime shape where event-triggered functionality continues through the shared router/runtime-settlement pipeline, and the remaining direct caller / payload / authoring gaps are reduced to explicit, testable seams.

**Architecture:** Build on the existing `dispatchEventRoute(...)`, `continueEventChain(...)`, `dispatchRuntimeRequest(...)`, and `runtime-settlement` owners instead of inventing a second runtime. The next child should formalize which event-triggered capabilities stay modeled as event payload actions versus which require new runtime event kinds, then converge the remaining direct-entry callers and Script Editor/runtime-pack contracts onto that canonical shape.

**Tech Stack:** TypeScript runtime/application/domain modules, Script Editor import/export materializers, Node contract tests under `tests/*.test.cjs`, `pnpm run build:test`, targeted `node --test`, `pnpm run typecheck`, `pnpm run build`, `pnpm run lint:plans`.

## Execution State

- Status: `running`
- Last Updated: `2026-08-05`
- Current Focus: `Payload-first first slice chosen: keep runtime event kinds narrow for now, and converge authored event payload actions / Script Editor round-trip / router consumption onto the existing event-router + runtime-dispatch + runtime-settlement pipeline.`
- Next Step: `Write RED coverage that proves the current authored event payload surface cannot yet round-trip or route the chosen action-first contract cleanly, then implement the minimal payload convergence.`
- Verification: `Code audit completed across src/core/runtime/event-router.ts, src/core/runtime/event-chain-runtime.ts, src/core/runtime/runtime-dispatch.ts, src/core/runtime/runtime-settlement.ts, src/core/runtime/event-entity-projection.ts, src/domain/event.ts, src/application/story/story-runtime.ts, src/modules/script-editor/application/story-dialogue-event-authoring.ts, src/modules/script-editor/application/runtime-pack-import.ts, src/modules/script-editor/application/runtime-pack-export.ts, and tests/robustness.test.cjs.`
- Notes: `This is a branch-local follow-up plan. It should not overwrite docs/superpowers/project-progress.md until the branch owner explicitly promotes the current state to canonical governance.`

## Progress Log

- 2026-08-05
  - Summary: `Plan created after the generic meeting convergence line reached a branch-local closeout boundary. Initial audit confirmed the current branch already owns shared event-router, event-chain, runtime-dispatch, and runtime-settlement seams, so the next work is not greenfield runtime creation but convergence of remaining caller families, payload shape, and authoring contracts onto those existing owners.`
  - Verification: `sed -n '1,240p' src/core/runtime/event-router.ts; sed -n '1,220p' src/core/runtime/event-chain-runtime.ts; sed -n '1,260p' src/core/runtime/runtime-dispatch.ts; sed -n '1,260p' src/core/runtime/runtime-settlement.ts; sed -n '1,260p' src/core/runtime/event-entity-projection.ts; sed -n '1,260p' src/domain/event.ts; sed -n '160,240p' src/application/story/story-runtime.ts; rg -n "dispatchEventRoute|runEventBindingRuntime|event-router|runtime-settlement" src tests.`
  - Next: `Write down the concrete gap inventory and pick the first runtime-only convergence slice so implementation can resume without re-auditing.`
- 2026-08-05
  - Summary: `Completed Task 1 planning audit and chose the first slice. Concrete gap inventory: live runtime already centralizes routing, event chaining, task settlement, and runtime-settlement, but authored EventDefinition is still dialogue/settlement-first; RuntimeEventEntity projection only emits dialogue/settlement kinds from authored events; story runtime only registers dialogue/settlement handlers; and Script Editor round-trip currently centers `dialogueId / settlementId / nextEventId` rather than a fuller action-first payload surface. Because EventRouteCommand already carries `launchPlayable`, `launchFlow`, `openCityMenuPanel`, and `closeBuilding`, the narrowest first slice is `payload-first`: extend the existing event payload/authoring path instead of adding new runtime event kinds up front.`
  - Verification: `sed -n '1,260p' src/domain/event.ts; sed -n '1,260p' src/core/contracts/event-router.ts; sed -n '1,260p' src/core/runtime/event-entity-projection.ts; sed -n '160,240p' src/application/story/story-runtime.ts; sed -n '1,240p' src/modules/script-editor/application/story-dialogue-event-authoring.ts; sed -n '430,560p' src/modules/script-editor/application/runtime-pack-import.ts; sed -n '1980,2060p' src/modules/script-editor/application/runtime-pack-export.ts.`
  - Next: `Add RED tests for the payload-first contract: one behavior test for routed action payload survival and one ownership/source-level guard proving the chosen action-first seam stays on shared runtime owners.`

---

## Based On Spec

- Primary specs:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - `docs/scenario-pack-unified-format.md`
- Related runtime plans:
  - `docs/superpowers/plans/2026-07-30-event-router-runtime-core-phase-a-plan.md`
  - `docs/superpowers/plans/2026-07-30-event-trigger-runtime-route-convergence-plan.md`
  - `docs/superpowers/plans/2026-07-30-event-binding-runtime-route-convergence-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `Current working branch is merage-mod2ui-1, not the historical codex/migration-hot-tasks branch referenced by older runtime children.`
  - `The current branch already contains live event-router, event-chain-runtime, runtime-dispatch, and runtime-settlement owners; the next child must converge onto those assets instead of replaying historical route-convergence slices.`
  - `Current EventDefinition -> RuntimeEventEntity projection still effectively maps authored events to dialogue/settlement-first runtime entities, even though EventRouteCommand already carries launchPlayable / launchFlow / menu actions.`
  - `Story runtime currently registers only dialogue/settlement router handlers; the next slice must decide whether richer functionality should stay action-payload-driven or require new runtime event kinds.`

## Implementation Scope

### In Scope

- Audit and converge remaining event-triggered caller families onto the shared event-router/runtime-dispatch seam.
- Formalize the canonical boundary between runtime event kinds and event payload actions.
- Extend the minimum Script Editor/runtime-pack contracts needed to author and round-trip the chosen event-router-first shape.
- Keep settlement application on shared runtime-settlement ownership.

### Still Out Of Scope

- Redesigning generic meeting / temple review again.
- Reworking `src/main.ts` into a new gameplay owner.
- Canonical `project-progress.md` promotion unless explicitly requested.
- Broad house/module feature migration unrelated to event-triggered entry.
- One-off scenario content rewrites that bypass the shared runtime contract decision.

## File Map

### Existing files to modify

- `src/domain/event.ts`
  - Define the canonical authored event surface that the router-first runtime will consume.
- `src/core/contracts/event-router.ts`
  - Expand or clarify runtime event entity shape only if the first slice requires additional routed kinds.
- `src/core/runtime/event-entity-projection.ts`
  - Keep the single projection seam from authored event definitions into runtime event entities/payload.
- `src/core/runtime/event-router.ts`
  - Preserve the single runtime route owner while extending handler dispatch only if needed.
- `src/core/runtime/runtime-dispatch.ts`
  - Keep event follow-up chain + settlement/task settlement orchestration centralized.
- `src/application/story/story-runtime.ts`
  - Continue using the shared router/runtime-dispatch seam and remove any newly identified direct payload ownership drift.
- `src/modules/script-editor/application/story-dialogue-event-authoring.ts`
  - Align event authoring fields with the chosen router-first payload contract.
- `src/modules/script-editor/application/runtime-pack-import.ts`
  - Preserve round-trip import for the same canonical event shape.
- `src/modules/script-editor/application/runtime-pack-export.ts`
  - Preserve round-trip export for the same canonical event shape.
- `tests/event-router-runtime.test.cjs`
  - Add RED/GREEN coverage for the chosen router-first runtime slice.
- `tests/robustness.test.cjs`
  - Add ownership assertions so the new event-router-first seam cannot regress.

### Existing files expected to be deleted

- `None expected initially.`

### New files to create

- `None required for the first audit-driven slice unless a new narrow runtime helper proves necessary.`

## Verification Plan

- Targeted verification:
  - The chosen event-triggered caller family routes through the shared event-router/runtime-dispatch seam.
  - Settlement application remains centralized under `runtime-settlement`.
  - The authored event payload chosen for the slice round-trips through Script Editor import/export without hidden fallback ownership.
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/event-router-runtime.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/robustness.test.cjs --test-name-pattern "event router runtime core|event binding runtime route convergence|runtime event settlement id payload consumption|navigation enter-house convergence|story settlement runtime owner convergence"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Lock The First Router-First Slice

**Files:**
- Read: `src/domain/event.ts`
- Read: `src/core/contracts/event-router.ts`
- Read: `src/core/runtime/event-entity-projection.ts`
- Read: `src/core/runtime/event-router.ts`
- Read: `src/core/runtime/runtime-dispatch.ts`
- Read: `src/application/story/story-runtime.ts`
- Read: `src/modules/script-editor/application/story-dialogue-event-authoring.ts`
- Read: `src/modules/script-editor/application/runtime-pack-import.ts`
- Read: `src/modules/script-editor/application/runtime-pack-export.ts`
- Modify: `docs/superpowers/plans/2026-08-05-event-router-first-runtime-convergence-plan.md`

- [ ] **Step 1: Record the concrete gap inventory**

Summarize which of these are true in live code:

- authored events are still dialogue/settlement-first
- richer functionality already exists as payload actions
- some caller families still bypass router/runtime-dispatch
- Script Editor cannot yet round-trip the chosen payload surface cleanly

- [ ] **Step 2: Choose the narrowest first implementation slice**

Decide one of:

- `payload-first`: keep runtime kinds narrow and extend payload action authoring/consumption
- `kind-first`: add a new runtime event kind with explicit router handler support
- `caller-first`: converge one remaining direct-entry caller family onto the existing router/runtime-dispatch seam

Record the decision and explicitly list what stays out of scope for the first code batch.

- [ ] **Step 3: Sync progress and governance state**

Append the decision to `Progress Log`, update `Execution State`, and record the exact next code entrypoint so implementation can resume without another audit.

## Task 2: Add RED Coverage For The Chosen Slice

**Files:**
- Modify: `tests/event-router-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`
- Read: `src/core/runtime/event-router.ts`
- Read: `src/core/runtime/runtime-dispatch.ts`
- Read: `src/core/runtime/event-entity-projection.ts`

- [ ] **Step 1: Add a focused behavior test for the chosen runtime seam**

Add one RED test that proves the chosen slice currently fails without the new router-first convergence.

- [ ] **Step 2: Add one ownership/source-level guard**

Lock the new seam in `tests/robustness.test.cjs` so direct fallback ownership cannot quietly return.

- [ ] **Step 3: Run the targeted RED commands**

Run the smallest relevant test commands and record the expected failing assertion/output in `Progress Log`.

## Task 3: Implement The Minimal Router-First Convergence

**Files:**
- Modify: `src/domain/event.ts`
- Modify: `src/core/contracts/event-router.ts`
- Modify: `src/core/runtime/event-entity-projection.ts`
- Modify: `src/core/runtime/event-router.ts`
- Modify: `src/core/runtime/runtime-dispatch.ts`
- Modify: `src/application/story/story-runtime.ts`
- Modify only if required by the chosen slice: `src/modules/script-editor/application/story-dialogue-event-authoring.ts`
- Modify only if required by the chosen slice: `src/modules/script-editor/application/runtime-pack-import.ts`
- Modify only if required by the chosen slice: `src/modules/script-editor/application/runtime-pack-export.ts`

- [ ] **Step 1: Implement the minimal code change that makes the RED test pass**

Keep the change inside the chosen slice boundary and reuse the existing router/runtime-dispatch/runtime-settlement owners.

- [ ] **Step 2: Re-run targeted tests**

Run the focused event-router/runtime tests first, then the narrow robustness subset.

- [ ] **Step 3: Run required verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans
```

Expected:

- `PASS`

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
