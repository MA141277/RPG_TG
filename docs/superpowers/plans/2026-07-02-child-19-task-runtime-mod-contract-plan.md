# Child 19 Task Runtime Mod Contract Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promote task runtime from a first-slice internal subsystem to a mod-facing contract that can be declared by content packs/mods, loaded through shared pack/runtime paths, and progressed only through typed runtime actions and signals.

**Architecture:** Child 19 starts only after Child 18 closes and the runtime spine is stable. The child extends task-runtime ownership into authoring/load/persistence boundaries without absorbing house registration or general registry policy. The preferred path is to add stable task contribution fields to the shared content-pack/mod surfaces and teach runtime producers to communicate through typed task actions/signals rather than ad hoc task mutation.

**Tech Stack:** TypeScript, `src/core/contracts/task-runtime.ts`, `src/core/runtime/task-runtime.ts`, content-pack domain/loaders, Node test runner (`tests/robustness.test.cjs`), `npm run typecheck`, `npm test`, `npm run build`, `npm run lint:plans`

## Execution State

- Status: `completed`
- Last Updated: `2026-07-02`
- Current Focus: `Child 19 is closed. Shared pack contracts, active content lookup, unified game state, and shared runtime dispatch now all carry the task-runtime mod-facing surface for this child.`
- Next Step: `Do not append more work into Child 19. Recheck Child 20 against the new baseline before any later promotion decision.`
- Verification: `npm run build:test + node --test tests/robustness.test.cjs --test-name-pattern "task runtime contract|task contribution|task runtime load|task runtime signal|task runtime action|active game content indexes merged task definitions|createInitialState seeds runtime task state|runtime dispatch settles routed task actions and signals|main.ts keeps covered runtime commits supplied with active task definitions" + npm run typecheck + npm test + npm run build + npm run lint:plans`
- Notes: `Child 19 stayed inside task-runtime contract scope. It did not redesign house registration, general contribution registry policy, or task authoring DSL.`

## Progress Log

- 2026-07-02
  - Summary: `Plan created from the mod-first unified contract roadmap. Child 19 remains non-executable until the next weekly set promotes it after Child 18.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Recheck task runtime and content-pack schema assumptions after Child 18 closes.`
- 2026-07-02
  - Summary: `Post-Child-18 baseline recheck completed. The Child 18 runtime commit seam cleanup did not materially change Child 19 scope: task runtime is still a first-slice subsystem with no shared content-pack task contribution surface, and Child 19 remains the next executable candidate but is not yet promoted in this batch.`
  - Verification: `Plan/doc recheck only`
  - Next: `Promote Child 19 from the fresh weekly queue when ready to begin task-runtime contract execution.`
- 2026-07-02
  - Summary: `Promoted Child 19 and completed Task 1 plus Task 2. The batch enumerated the missing mod-facing seams, added red tests, widened content-pack/scenario-pack task contribution contracts, and taught the shared content-pack loaders to carry optional task definitions through manifest-driven pack loading.`
  - Verification: `npm run build:test` + `node --test tests/robustness.test.cjs --test-name-pattern "task runtime contract|task contribution|task runtime load|task runtime signal|task runtime action|content pack loader|scenario pack loader"` + `npm run typecheck` + `npm test` + `npm run build`
  - Next: `Start Task 3 by connecting registered task definitions to active runtime consumption and by defining where shared runtime dispatch will settle taskActions/taskSignals.`
- 2026-07-02
  - Summary: `Completed Task 3 and Child 19 closeout. Active content now indexes task definitions, unified game state now persists task runtime state under gameState.runtime.tasks, and shared runtime dispatch now settles routed taskActions/taskSignals through task runtime when covered commit contexts supply active task definitions.`
  - Verification: `npm run build:test` + `node --test tests/robustness.test.cjs --test-name-pattern "task runtime contract|task contribution|task runtime load|task runtime signal|task runtime action|active game content indexes merged task definitions|createInitialState seeds runtime task state|runtime dispatch settles routed task actions and signals|main.ts keeps covered runtime commits supplied with active task definitions"` + `npm run typecheck` + `npm test` + `npm run build` + `npm run lint:plans`
  - Next: `Recheck Child 20 against the post-Child-19 baseline before opening the next executable child.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-02-mod-first-unified-contract-roadmap-design.md`
- Weekly set plan:
  - `docs/superpowers/plans/2026-07-02-mod-first-weekly-orchestration-plan.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `The current first-slice task runtime lives in src/core/contracts/task-runtime.ts and src/core/runtime/task-runtime.ts.`
  - `src/domain/content-pack.ts does not yet expose a task contribution surface.`
  - `Child 19 must not redesign house registry or mod dependency policy; it only prepares task contribution and runtime ownership.`

## Implementation Scope

### In Scope

- audit of the current task runtime contract and its missing mod-facing surfaces
- additive task contribution fields in shared pack/domain/loaders
- typed task definition registration and runtime loading
- migration of runtime producers to use typed task actions/signals rather than ad hoc mutation where the covered path exists
- targeted regression coverage for task contribution loading and runtime progression
- governance/doc sync for the new child outcome

### Still Out Of Scope

- house registration redesign
- generalized gameplay contribution registry redesign
- external mod dependency policy redesign
- full task authoring DSL
- presenter/UI overhaul

## File Map

### Existing files to modify

- `src/domain/content-pack.ts`
  - Add additive task contribution fields.
- `src/domain/scenario-pack.ts`
  - Keep scenario-pack typing aligned with the new task contribution surface.
- `src/application/content/content-pack-loader.ts`
  - Load optional task contribution split tables if introduced.
- `src/application/scenario/scenario-pack-loader.ts`
  - Load optional task contribution split tables for scenario packs.
- `src/core/contracts/task-runtime.ts`
  - Extend task contract fields only where needed for mod-facing registration.
- `src/core/runtime/task-runtime.ts`
  - Consume registered task definitions through the new contract shape.
- `src/core/contracts/mod-manifest.ts`
  - Reference task contribution registration if the manifest needs explicit task entry points.
- `src/core/contracts/mod-runtime.ts`
  - Keep activated-mod output aligned with task contribution registration.
- `src/core/mods/mod-runtime.ts`
  - Preserve task contribution identifiers in activation output if needed.
- `src/main.ts`
  - Remove any covered ad hoc task mutation path in favor of typed task signals/actions.
- `tests/robustness.test.cjs`
  - Add red-to-green coverage for task contribution loading and runtime progression.
- `docs/change-log.md`
  - Record the Child 19 contract outcome.
- `docs/superpowers/plans/2026-07-02-child-19-task-runtime-mod-contract-plan.md`
  - Record execution progress and closeout.

### Existing files to read

- `docs/superpowers/specs/2026-06-30-task-runtime-spec.md`
- `docs/superpowers/weekly/2026-06-29-weekly-module-map.md`
- `src/core/contracts/effect.ts`

## Verification Plan

- Targeted verification:
  - `node --test tests/robustness.test.cjs --test-name-pattern "task runtime contract|task contribution|task runtime load|task runtime signal|task runtime action"`
- Required commands:
  - `npm run typecheck`
  - `npm test`
  - `npm run build`

## Task 1: Audit The Existing Task Runtime And Missing Mod-Facing Seams

**Files:**
- Read: `src/core/contracts/task-runtime.ts`
- Read: `src/core/runtime/task-runtime.ts`
- Read: `src/domain/content-pack.ts`
- Read: `src/application/content/content-pack-loader.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Enumerate the missing task contribution and loading seams**

Record the exact gaps between the current first-slice task runtime and a mod-facing task contract.

- [x] **Step 2: Add failing regression tests for task contribution loading**

Write red tests that prove tasks cannot yet be loaded/registered through the shared pack/mod path.

- [x] **Step 3: Run the targeted red tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "task runtime contract|task contribution|task runtime load|task runtime signal|task runtime action"
```

Expected:

- at least one mod-facing task contract test fails before implementation

- [x] **Step 4: Record the audit result in plan state**

Update `Execution State` and `Progress Log` with the enumerated task-runtime baseline.

## Task 2: Add Shared Task Contribution Loading

**Files:**
- Modify: `src/domain/content-pack.ts`
- Modify: `src/domain/scenario-pack.ts`
- Modify: `src/application/content/content-pack-loader.ts`
- Modify: `src/application/scenario/scenario-pack-loader.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add additive task contribution fields and loader support**

Keep the change additive so existing packs remain valid if they do not ship tasks yet.

- [x] **Step 2: Re-run the targeted loader tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "task contribution|content pack loader|scenario pack loader"
```

Expected:

- task contribution loading tests pass

- [x] **Step 3: Run the full verification gate for Task 2**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass

## Task 3: Promote Task Runtime To A Mod-Facing Registration Surface

**Files:**
- Modify: `src/core/contracts/task-runtime.ts`
- Modify: `src/core/runtime/task-runtime.ts`
- Modify: `src/core/contracts/mod-manifest.ts`
- Modify: `src/core/contracts/mod-runtime.ts`
- Modify: `src/core/mods/mod-runtime.ts`
- Modify: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Register and consume task definitions through shared task contracts**

Use typed task actions/signals as the only covered progression path for this child.

- [x] **Step 2: Re-run the targeted task-runtime tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "task runtime contract|task runtime signal|task runtime action|task contribution"
```

Expected:

- task runtime and task contribution tests pass

- [x] **Step 3: Run the full verification gate for Task 3**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass

## Task 4: Close Out Child 19 Governance

**Files:**
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-07-02-child-19-task-runtime-mod-contract-plan.md`

- [x] **Step 1: Record the final task contract boundary**

Document what task surfaces are now mod-facing and what later DSL/editor work remains outside Child 19.

- [x] **Step 2: Run governance verification**

Run:

```bash
npm run lint:plans
```

Expected:

- `Superpowers plan lint passed`

## Exit Check

- [x] Shared pack/domain/loaders can carry task contributions.
- [x] Task runtime consumes registered task definitions through typed contracts.
- [x] Covered runtime producers use typed task actions/signals instead of ad hoc task mutation.
- [x] Child 19 does not redesign house registration or general contribution registry policy.
- [x] Targeted regression coverage passes.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
