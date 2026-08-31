# AI Event Ledger Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a shared AI event ledger plus related-NPC reaction memory pipeline, then wire tavern gambling into it so NPCs can react to recent player actions on the next conversation opening.

**Architecture:** Extend the existing observed-event seam instead of introducing a second gameplay runtime. Shared runtime records observed events into a ledger, derives capped per-NPC reaction memories from optional reaction hints, and feeds those memories into `start_talk` prompt construction. House modules stay authoritative for legality and settlement; Phase 1 only adds shared forwarding plus tavern gambling event emission.

**Tech Stack:** TypeScript runtime/domain modules, CommonJS `.test-dist` suites, focused `node --test --test-isolation=none` runs, cached Node commands, `tools/lint-superpowers-plans.mjs`, test compile, and repository typecheck.

## Execution State

- Status: `closed`
- Last Updated: `2026-08-28`
- Current Focus: `Phase 1 is now verified, pushed to origin/7/30main_trade at 814dc6b9, and formally closed so Indoor House Action Memory can become the active child.`
- Next Step: `Open docs/superpowers/plans/2026-08-28-indoor-house-action-memory-plan.md and start Task 1 from the shared contract RED tests.`
- Verification: `2026-08-28: tools/lint-superpowers-plans.mjs PASS; tsc -p tsconfig.test.json PASS; .test-dist/package.json CommonJS marker PASS; focused event-ledger/house-forwarding/npc-dialogue/world-intent/tavern batch PASS (48/48); tsc --noEmit -p tsconfig.json PASS; git push -u origin 7/30main_trade PASS; git ls-remote --heads origin 7/30main_trade shows 814dc6b936bd353a114086b9ea543decee92b5b1.`
- Notes: `This child intentionally superseded the older intent-gate child as the canonical execution target because the user pivoted to broader AI memory architecture. The push gate is now satisfied, so this child no longer blocks promotion of the next governed AI-memory slice.`

## Progress Log

- 2026-08-28
  - Summary: `Remote push succeeded for the Phase 1 branch state, so this child now satisfies its push gate and is formally closed. Indoor House Action Memory is promoted to the active governed child.`
  - Verification: `git push -u origin 7/30main_trade PASS; git ls-remote --heads origin 7/30main_trade -> 814dc6b936bd353a114086b9ea543decee92b5b1.`
  - Next: `Resume from the Indoor House Action Memory plan and start Task 1.`
- 2026-08-28
  - Summary: `Queued the approved Indoor House Action Memory child as the next governed slice. Phase 1 remains completed-but-open locally, while the new child stays waiting behind this unpushed handoff.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs PASS.`
  - Next: `Keep Phase 1 local completed-but-open until push or explicit governance override admits the next child.`
- 2026-08-28
  - Summary: `Created the Phase 1 governed spec/plan for the shared AI event ledger vertical slice and promoted it to the active child after the user approved Architecture C. The previous intent-gate child remains local completed-but-open history, but canonical resume now points at this new phase.`
  - Verification: `Spec/plan creation only; implementation verification has not started yet.`
  - Next: `Write RED tests for the shared ledger/reaction-memory/runtime-forwarding contracts before any production edits.`
- 2026-08-28
  - Summary: `Completed the full Phase 1 vertical slice locally. Shared world-intent now keeps a durable event ledger, related-NPC reaction memories are derived and capped at 5 entries, start_talk prioritizes the latest reaction memory, house runtime forwards observedEvents generically, and tavern gambling emits entry / no-play / win-loss / bust events for the innkeeper memory loop.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs PASS; C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json PASS; Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline PASS; C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/ai-event-ledger-runtime.test.cjs tests/house-observed-event-forwarding.test.cjs tests/npc-ai-dialogue-request-builder.test.cjs tests/npc-ai-dialogue-runtime.test.cjs tests/world-intent-runtime.test.cjs tests/tavern-short-gamble-house.test.cjs PASS (48 tests, 48 pass); C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json PASS.`
  - Next: `Keep the child at completed-but-open until the local diff is reviewed and a push / next-child decision is made.`
- 2026-08-28
  - Summary: `Applied the post-review fix round. The shared ledger no longer truncates at 60 events, and long-table immediate close now emits the same no-play tavern memory event as the short-table path.`
  - Verification: `RED: C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json PASS; Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline PASS; C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/ai-event-ledger-runtime.test.cjs tests/tavern-short-gamble-house.test.cjs FAIL (2 expected failures: ledger retention and long-table no-play event). GREEN: C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json PASS; Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline PASS; C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/ai-event-ledger-runtime.test.cjs tests/tavern-short-gamble-house.test.cjs PASS (25 tests, 25 pass); full focused batch PASS (48 tests, 48 pass); tools/lint-superpowers-plans.mjs PASS; tsc --noEmit -p tsconfig.json PASS; independent review rerun reported no remaining Critical/Important code issues.`
  - Next: `Keep the child at completed-but-open locally; only the workspace's broader VCS hygiene remains outside this feature slice.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-28-ai-event-ledger-phase-1-design.md`
- Related specs:
  - `docs/superpowers/specs/2026-08-27-npc-ai-per-turn-intent-gate-design.md`
  - `docs/superpowers/specs/2026-08-25-global-npc-ai-dialogue-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `The repository already has the shared observed-event seam under world-intent runtime; Phase 1 reuses that seam instead of creating a second event runtime.`
  - `The repository already has transcript memory and start_talk prompt building; Phase 1 adds a second reaction-memory branch rather than replacing transcript memory.`
  - `The shared house runtime already owns generic result application; Phase 1 extends that generic seam with observed-event forwarding instead of adding tavern branches to src/main.ts.`
  - `Tavern gambling already exposes stable settlement points for long settlement and short cash-out, so the first vertical slice can land without changing the visible house shell.`

## Implementation Scope

### In Scope

- Add shared event-ledger runtime state.
- Add shared related-NPC reaction-memory runtime state capped to the latest `5` entries per NPC.
- Extend `observe-event` handling so one observed event can both update the ledger and derive NPC reaction memories.
- Extend `start_talk` request construction so the latest reaction memory is prioritized.
- Extend `HouseModuleTransitionResult` plus house runtime forwarding for generic observed events.
- Emit tavern gambling observed events for entry, no-play exit, win/loss exit, and bust.
- Add focused regression tests for the above.

### Still Out Of Scope

- Migrating all other houses/services/playables in this child.
- Replacing transcript memory semantics.
- Rewriting visible house UI flow.
- Moving settlement/business rules out of house modules.

## File Map

### Existing files to modify

- `src/domain/world-intent.ts`
  - Extend observed-event / runtime-state contracts with ledger support and NPC reaction hints.
- `src/domain/npc-ai-dialogue.ts`
  - Add reaction-memory types and initial state support.
- `src/domain/game-state.ts`
  - Keep the new runtime branches typed in the unified game state.
- `src/application/state/create-initial-state.ts`
  - Seed the new runtime state.
- `src/core/runtime/world-intent-runtime.ts`
  - Append observed events into the ledger and derive per-NPC reaction memories.
- `src/application/npc-interaction/npc-ai-dialogue-request-builder.ts`
  - Include reaction-memory summaries and start-talk priority instructions.
- `src/core/runtime/npc-interaction-runtime.ts`
  - Feed the current NPC’s reaction memories into request building.
- `src/domain/house-module.ts`
  - Extend `HouseModuleTransitionResult` with observed-event forwarding.
- `src/core/runtime/house-runtime.ts`
  - Forward house-emitted observed events through generic runtime wiring.
- `src/application/house-modules/tavern/tavern-house-module.ts`
  - Emit tavern gambling observed events at stable settlement points.
- `docs/special-house-interface.md`
  - Document the new shared observed-event result seam.
- `docs/change-log.md`
  - Record the shared ledger/reaction-memory addition and tavern Phase 1 integration.
- `docs/superpowers/project-progress.md`
  - Synchronize canonical progress to this child.
- `docs/superpowers/plans/2026-08-28-ai-event-ledger-phase-1-plan.md`
  - Keep execution state, progress log, and checkbox state current.

### New files to create

- `tests/ai-event-ledger-runtime.test.cjs`
  - Focused RED/GREEN coverage for shared ledger append plus NPC reaction-memory derivation.
- `tests/house-observed-event-forwarding.test.cjs`
  - Focused coverage that house runtime forwards `observedEvents` generically.

## Verification Plan

- Targeted verification:
  - shared runtime appends observed events into a durable ledger and keeps recent events in sync,
  - related NPC reaction memories cap at `5`,
  - `start_talk` prompt explicitly prioritizes the latest reaction memory,
  - house runtime forwards generic observed events without tavern-specific shell branches,
  - tavern gambling emits the approved Phase 1 reactions.
- Required commands:
  - cached-node `tools/lint-superpowers-plans.mjs`
  - cached-node `node_modules/typescript/bin/tsc -p tsconfig.test.json`
  - package marker write for `.test-dist/package.json`
  - cached-node `--test --test-isolation=none tests/ai-event-ledger-runtime.test.cjs tests/house-observed-event-forwarding.test.cjs tests/npc-ai-dialogue-request-builder.test.cjs tests/npc-ai-dialogue-runtime.test.cjs tests/world-intent-runtime.test.cjs tests/tavern-short-gamble-house.test.cjs`
  - cached-node `node_modules/typescript/bin/tsc --noEmit -p tsconfig.json`

## Task 1: Shared Ledger And Reaction Memory Core

**Files:**
- Modify: `src/domain/world-intent.ts`
- Modify: `src/domain/npc-ai-dialogue.ts`
- Modify: `src/domain/game-state.ts`
- Modify: `src/application/state/create-initial-state.ts`
- Modify: `src/core/runtime/world-intent-runtime.ts`
- Create: `tests/ai-event-ledger-runtime.test.cjs`
- Modify: `tests/world-intent-runtime.test.cjs`

- [x] **Step 1: Write the failing runtime tests**

Add focused tests that prove:

- `observe-event` appends to a durable ledger,
- reaction hints are converted into per-NPC reaction memories,
- per-NPC reaction memories keep only the latest `5` entries.

- [x] **Step 2: Run the focused RED verification**

Run the cached test-compile command, write the CommonJS marker, then run:

```bash
cached-node --test --test-isolation=none tests/ai-event-ledger-runtime.test.cjs tests/world-intent-runtime.test.cjs
```

Expected:

- `FAIL` because the new ledger/reaction-memory contracts do not exist yet.

- [x] **Step 3: Implement the minimal shared runtime/domain changes**

Add the ledger/runtime contracts and the `observe-event` append logic that records ledger entries and derives capped reaction memories.

- [x] **Step 4: Run the focused GREEN verification**

Run the same focused suites again and confirm they pass.

## Task 2: Prompt Priority And House Runtime Forwarding

**Files:**
- Modify: `src/application/npc-interaction/npc-ai-dialogue-request-builder.ts`
- Modify: `src/core/runtime/npc-interaction-runtime.ts`
- Modify: `src/domain/house-module.ts`
- Modify: `src/core/runtime/house-runtime.ts`
- Create: `tests/house-observed-event-forwarding.test.cjs`
- Modify: `tests/npc-ai-dialogue-request-builder.test.cjs`
- Modify: `tests/npc-ai-dialogue-runtime.test.cjs`

- [x] **Step 1: Write the failing prompt/forwarding tests**

Add focused tests that prove:

- `start_talk` prompt includes reaction-memory priority instructions,
- house runtime forwards `observedEvents` generically through shared wiring.

- [x] **Step 2: Run the focused RED verification**

Run:

```bash
cached-node --test --test-isolation=none tests/house-observed-event-forwarding.test.cjs tests/npc-ai-dialogue-request-builder.test.cjs tests/npc-ai-dialogue-runtime.test.cjs
```

Expected:

- `FAIL` because the forwarding seam and prompt additions do not exist yet.

- [x] **Step 3: Implement the minimal shared wiring**

Add the observed-event result seam to house runtime and feed current-NPC reaction memories into `start_talk` request building.

- [x] **Step 4: Run the focused GREEN verification**

Run the same focused suites again and confirm they pass.

## Task 3: Tavern Gambling Phase 1 Integration

**Files:**
- Modify: `src/application/house-modules/tavern/tavern-house-module.ts`
- Modify: `tests/tavern-short-gamble-house.test.cjs`
- Modify: `docs/special-house-interface.md`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/project-progress.md`
- Modify: `docs/superpowers/plans/2026-08-28-ai-event-ledger-phase-1-plan.md`

- [x] **Step 1: Write the failing tavern tests**

Add focused tests that prove tavern gambling emits observed events for:

- table entry,
- no-play cash-out,
- winning/losing cash-out or settlement,
- bust / losing everything.

- [x] **Step 2: Run the focused RED verification**

Run:

```bash
cached-node --test --test-isolation=none tests/tavern-short-gamble-house.test.cjs
```

Expected:

- `FAIL` because tavern results do not emit observed events yet.

- [x] **Step 3: Implement tavern observed-event emission**

Emit shared observed events from stable tavern result points without adding tavern business to `src/main.ts`.

- [x] **Step 4: Run the full focused GREEN verification**

Run the required verification plan for this child and record the exact results in the plan/progress docs.

## Exit Check

- [x] Shared observed events are persisted into a durable ledger.
- [x] Related NPC reaction memories are capped to `5` entries per NPC.
- [x] `start_talk` prioritizes latest reaction memory when available.
- [x] House runtime forwards `observedEvents` generically.
- [x] Tavern gambling emits the approved Phase 1 reactions.
- [x] Focused verification is recorded.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `AI Event Ledger Phase 1`
- Parent Task: `House Local Gameplay`
- Parent Stage: `House Local Gameplay`
- Closeout Status: `closed`
- Project Progress Synced: `yes`
- Next Child: `Indoor House Action Memory`
- Next Child Status: `running`
- Next Required Action: `execute-task-1-shared-house-action-memory-contract`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-08-28-indoor-house-action-memory-plan.md`
- Push Status: `success`
- Push Commit: `814dc6b9`
- Resume From: `Open docs/superpowers/project-progress.md, then continue with docs/superpowers/plans/2026-08-28-indoor-house-action-memory-plan.md Task 1.`
