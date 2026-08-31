# Indoor House Action Memory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the existing AI event-ledger pipeline into a shared indoor `house action memory` system so meaningful same-building actions are recorded locally first, then drive the next related NPC opening line only when the player talks again.

**Architecture:** Reuse the existing `observedEvents -> world-intent ledger -> related-NPC reaction memories -> start_talk` seam instead of introducing a second gameplay runtime. Add typed `houseActionMemory` semantics to observed events, keep house modules authoritative for action meaning and related NPC selection, filter NPC opening memory to the current `houseId` plus current NPC, and roll the contract out in two batches: Batch A transaction/service houses, then Batch B work/story houses. No immediate AI call, no cross-building propagation, no UI-delta inference, and no new house business in `src/main.ts`.

**Tech Stack:** TypeScript domain/runtime/house modules, CommonJS `.test-dist` suites, focused `node --test --test-isolation=none` runs, cached Node commands, `tools/lint-superpowers-plans.mjs`, test compile, and repository typecheck.

## Global Constraints

- Follow the repository house interface contract in `docs/special-house-interface.md`.
- Keep `src/main.ts` free of house-specific business branches.
- Let each house module remain authoritative for preview/cancel/success/no-action meaning.
- Do not infer gameplay meaning from renderer-only or DOM/UI deltas.
- Do not call AI immediately when the action happens.
- Do not propagate action memory across buildings in this child.
- Preserve unrelated local working-tree changes.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-08-28`
- Current Focus: `Task 4 is complete: Batch B work/story houses now emit typed temple/keep/leader action memories, shared docs are synced, and the remaining governance step is push/closeout so Temple AI Mainline can be admitted.`
- Next Step: `Push the current child and re-check Temple AI Mainline admission under the next-child gate.`
- Verification: `2026-08-28: tools/lint-superpowers-plans.mjs PASS; prerequisite branch push confirmed at 814dc6b9 via git ls-remote; Task 1 focused RED then GREEN on tests/house-action-memory-runtime.test.cjs + tests/ai-event-ledger-runtime.test.cjs (5/5 pass); Task 2 focused RED then GREEN on tests/npc-ai-dialogue-request-builder.test.cjs + tests/npc-ai-dialogue-runtime.test.cjs (20/20 pass); Task 3 RED on tests/house-action-memory-batch-a.test.cjs plus focused market/tavern assertions showed the expected missing producer-side events; Task 3 GREEN on tests/house-action-memory-batch-a.test.cjs PASS (6/6), focused market settlement tests PASS (3/3), focused market investigation memory tests PASS (2/2), focused tavern memory tests PASS (4/4), shared ledger/request-builder/runtime regression batch PASS (31/31), and tsc --noEmit -p tsconfig.json PASS. Task 4 RED: cached-node tsc -p tsconfig.test.json PASS; .test-dist/package.json CommonJS marker PASS; cached-node --test --test-isolation=none tests/house-action-memory-batch-b.test.cjs tests/npc-ai-dialogue-request-builder.test.cjs tests/npc-ai-dialogue-runtime.test.cjs FAIL with the expected missing Batch B action-memory assertions. Task 4 GREEN: same compile/package-marker steps PASS; same focused Batch B/request-builder/runtime batch PASS (25/25). Child full verification: tools/lint-superpowers-plans.mjs PASS; cached-node tsc -p tsconfig.test.json PASS; .test-dist/package.json CommonJS marker PASS; cached-node --test --test-isolation=none tests/house-action-memory-runtime.test.cjs tests/house-action-memory-batch-a.test.cjs tests/house-action-memory-batch-b.test.cjs tests/ai-event-ledger-runtime.test.cjs tests/npc-ai-dialogue-request-builder.test.cjs tests/npc-ai-dialogue-runtime.test.cjs tests/market-house-settlement-trade.test.cjs tests/market-house-investigation.test.cjs tests/tavern-short-gamble-house.test.cjs PASS (84/84); cached-node tsc --noEmit -p tsconfig.json PASS. Package test-script equivalent still fails with the pre-existing 18 unrelated baseline failures in robustness/hardcoded-scenario-pack-boundary coverage, so merge/push closeout remains blocked under branch-finishing rules.`
- Notes: `This child was promoted only after the prerequisite AI Event Ledger Phase 1 child satisfied its push gate and closeout sync. Standard per-task SDD commit/review-package loops remain deferred in this dirty working tree by ledger ruling.`

## Progress Log

- 2026-08-28
  - Summary: `Completed Task 4 inline under TDD: temple-house now emits work preview / preview-exit / completion memories, keep-house emits task-assignment completion memory, and leader-residence emits learning plus leave memories through the shared house-action seam. Shared docs are synced, so the child is locally complete and now waits only on push/closeout before Temple AI Mainline can be admitted.`
  - Verification: `Task 4 RED: cached-node tsc -p tsconfig.test.json PASS; .test-dist/package.json CommonJS marker PASS; cached-node --test --test-isolation=none tests/house-action-memory-batch-b.test.cjs tests/npc-ai-dialogue-request-builder.test.cjs tests/npc-ai-dialogue-runtime.test.cjs FAIL with the expected missing Batch B producer-side events. Task 4 GREEN: same compile/package-marker steps PASS; same focused batch PASS (25/25). Child full verification: tools/lint-superpowers-plans.mjs PASS; cached-node tsc -p tsconfig.test.json PASS; .test-dist/package.json CommonJS marker PASS; cached-node --test --test-isolation=none tests/house-action-memory-runtime.test.cjs tests/house-action-memory-batch-a.test.cjs tests/house-action-memory-batch-b.test.cjs tests/ai-event-ledger-runtime.test.cjs tests/npc-ai-dialogue-request-builder.test.cjs tests/npc-ai-dialogue-runtime.test.cjs tests/market-house-settlement-trade.test.cjs tests/market-house-investigation.test.cjs tests/tavern-short-gamble-house.test.cjs PASS (84/84); cached-node tsc --noEmit -p tsconfig.json PASS. Package test-script equivalent still fails with the pre-existing 18 unrelated baseline failures in robustness/hardcoded-scenario-pack-boundary coverage.`
  - Next: `Keep Temple AI Mainline waiting and either fix or explicitly accept the unrelated project-suite baseline before attempting push/closeout.`
- 2026-08-28
  - Summary: `Completed Task 3 inline under TDD: added the shared house-action-memory event helper and rolled typed producer-side emission across Batch A houses. Market, grain, medicine, tea, and tavern now emit stable preview/cancel/success/gamble events with same-house NPC reaction hints at the socially meaningful result points, so the next AI opening can remember what the player just did in the same building.`
  - Verification: `Task 3 RED: cached-node tsc -p tsconfig.test.json PASS; .test-dist/package.json CommonJS marker PASS; cached-node --test --test-isolation=none tests/house-action-memory-batch-a.test.cjs tests/market-house-settlement-trade.test.cjs tests/market-house-investigation.test.cjs tests/tavern-short-gamble-house.test.cjs FAIL with the expected missing action-memory assertions (plus unrelated existing market-investigation content drift). Task 3 GREEN: cached-node tsc -p tsconfig.test.json PASS; .test-dist/package.json CommonJS marker PASS; cached-node --test --test-isolation=none tests/house-action-memory-batch-a.test.cjs PASS (6/6); cached-node --test --test-isolation=none --test-name-pattern "market house specialty goods buy result overlay uses readable Chinese summaries|market house conversation service can directly settle a generic cloth purchase into the backpack|market house closing the buy overlay without settling emits a no-action memory event" tests/market-house-settlement-trade.test.cjs PASS (3/3); cached-node --test --test-isolation=none --test-name-pattern "market house conversation-service investigation reuses the shopkeeper report flow|market house investigate market emits a typed service-success memory event" tests/market-house-investigation.test.cjs PASS (2/2); cached-node --test --test-isolation=none --test-name-pattern "tavern short table entry emits an observed event for related NPC memory|tavern short cash out without playing emits a no-play reaction event|tavern short bust cash out emits a lost-all reaction event|tavern long close without playing emits a no-play reaction event" tests/tavern-short-gamble-house.test.cjs PASS (4/4); cached-node --test --test-isolation=none tests/house-action-memory-runtime.test.cjs tests/ai-event-ledger-runtime.test.cjs tests/npc-ai-dialogue-request-builder.test.cjs tests/npc-ai-dialogue-runtime.test.cjs tests/house-action-memory-batch-a.test.cjs PASS (31/31); cached-node tsc --noEmit -p tsconfig.json PASS.`
  - Next: `Begin Task 4 from Batch B RED tests and then implement temple-house / keep-house / leader-residence producer-side action memory emission plus the required docs sync.`
- 2026-08-28
  - Summary: `Completed Task 1 inline under TDD: the shared observed-event contract now exposes typed house-action memory payloads and reaction memories preserve that context while keeping ledger-only events out of NPC openings. Also completed the consumer-side same-house filter slice of Task 2 so start_talk no longer drags different-house reaction memories into the current NPC opening.`
  - Verification: `Task 1 RED: cached-node tsc -p tsconfig.test.json PASS; .test-dist/package.json CommonJS marker PASS; cached-node --test --test-isolation=none tests/house-action-memory-runtime.test.cjs tests/ai-event-ledger-runtime.test.cjs FAIL (3 expected failures: missing typed contract + missing reaction-memory context). Task 1 GREEN: same compile/package-marker steps PASS; same focused pair PASS (5/5); cached-node tsc --noEmit -p tsconfig.json PASS. Task 2 RED: cached-node tsc -p tsconfig.test.json PASS; .test-dist/package.json CommonJS marker PASS; cached-node --test --test-isolation=none tests/npc-ai-dialogue-request-builder.test.cjs tests/npc-ai-dialogue-runtime.test.cjs FAIL (3 expected same-house filter failures). Task 2 consumer-side GREEN: same compile/package-marker steps PASS; same focused pair PASS (20/20); cached-node tsc --noEmit -p tsconfig.json PASS.`
  - Next: `Carry the helper deferral ruling into Task 3 and start Batch A house-emission RED tests.`
- 2026-08-28
  - Summary: `Promoted Indoor House Action Memory to the active governed child after AI Event Ledger Phase 1 was pushed to origin/7/30main_trade and closed under canonical governance.`
  - Verification: `git push -u origin 7/30main_trade PASS; git ls-remote --heads origin 7/30main_trade -> 814dc6b936bd353a114086b9ea543decee92b5b1; C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs PASS.`
  - Next: `Set up the SDD workspace and begin Task 1 from the shared contract RED tests.`
- 2026-08-28
  - Summary: `Created the governed waiting plan for the approved Indoor House Action Memory design. This child extends the already-implemented Phase 1 event-ledger pipeline with typed same-house action semantics plus Batch A and Batch B house rollout.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs PASS.`
  - Next: `Keep this child waiting until admission rules are satisfied, then begin Task 1 from the shared contract RED tests.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-28-indoor-house-action-memory-design.md`
- Prerequisite child:
  - `docs/superpowers/plans/2026-08-28-ai-event-ledger-phase-1-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `AI Event Ledger Phase 1 already landed the durable ledger, related-NPC reaction memories, generic observed-event forwarding, and tavern pilot, so this child extends an existing seam instead of creating a new runtime.`
  - `The approved design now adds typed house-action semantics and same-house filtering rather than broadening transcript memory generically.`
  - `The rollout boundary is now explicit: Batch A for transaction/service houses, then Batch B for work/story houses, with no cross-building gossip in this child.`
  - `The workspace is already dirty, so this child must stay scoped to the shared action-memory mechanism, house modules, tests, and required docs only.`

## Implementation Scope

### In Scope

- Extend `WorldObservedEvent` and related NPC reaction-memory entries with typed `houseActionMemory` context.
- Preserve the rule that ledger events without `reactionHints` stay ledger-only and do not become NPC opening memories.
- Filter `start_talk` memory consumption to the current `houseId` and current NPC, newest-first.
- Add a shared helper/convention for house modules to author typed action-memory events without summary drift.
- Integrate Batch A houses:
  - `market-house`
  - `grain-shop`
  - `medicine-house`
  - `tea-house`
  - `tavern`
- Integrate Batch B houses:
  - `temple-house`
  - `keep-house`
  - `leader-residence`
- Update shared docs and governance records required by the new contract.

### Still Out Of Scope

- Cross-building propagation or gossip.
- Immediate AI calls when a non-dialogue action occurs.
- AI-driven settlement of trade, work, gambling, or story outcomes.
- Pure UI micro-actions such as paging, dragging, sorting, or tab flicking.
- Batch C fallback/decorative houses.
- Replacing transcript memory with only action memory.

## File Map

### Existing files to modify

- `src/domain/world-intent.ts`
  - Add typed `houseActionMemory` semantics to shared observed events.
- `src/domain/npc-ai-dialogue.ts`
  - Preserve the typed same-house reaction-memory payload used at NPC opening time.
- `src/core/runtime/world-intent-runtime.ts`
  - Keep ledger append and reaction-memory derivation aligned with the new ledger-only versus commentable rule.
- `src/core/runtime/npc-interaction-runtime.ts`
  - Feed same-house/current-NPC filtered reaction memories into `start_talk`.
- `src/application/npc-interaction/npc-ai-dialogue-request-builder.ts`
  - Prioritize the newest same-house reaction memory in the NPC opening cue.
- `src/application/house-modules/market-house/market-house-house-module.ts`
  - Emit typed trade/investigation action-memory events.
- `src/application/house-modules/grain-shop/grain-shop-house-module.ts`
  - Emit typed buy/sell/preview action-memory events.
- `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
  - Emit typed preview/cancel/success action-memory events for the supported medicine flow.
- `src/application/house-modules/tea-house/tea-house-house-module.ts`
  - Emit typed preview/cancel/success action-memory events for the supported tea-house flow.
- `src/application/house-modules/tavern/tavern-house-module.ts`
  - Refine the tavern pilot to the shared typed house-action taxonomy.
- `src/application/house-modules/temple-house/temple-house-house-module.ts`
  - Emit typed work/story preview, preview-exit, and completion events.
- `src/application/house-modules/keep-house/keep-house-house-module.ts`
  - Emit typed work/story preview, preview-exit, and completion events.
- `src/application/house-modules/leader-residence/leader-residence-house-module.ts`
  - Emit typed work/story preview, preview-exit, and completion events.
- `tests/ai-event-ledger-runtime.test.cjs`
  - Keep the Phase 1 ledger baseline green while the typed contract is introduced.
- `tests/npc-ai-dialogue-request-builder.test.cjs`
  - Prove same-house/current-NPC prompt shaping.
- `tests/npc-ai-dialogue-runtime.test.cjs`
  - Prove the runtime feeds the correct same-house memory set into request building.
- `tests/market-house-settlement-trade.test.cjs`
  - Add market trade action-memory assertions.
- `tests/market-house-investigation.test.cjs`
  - Add market investigation/no-action assertions.
- `tests/tavern-short-gamble-house.test.cjs`
  - Align tavern emission coverage to the shared taxonomy.
- `docs/special-house-interface.md`
  - Document the shared house-action-memory contract and owner-side authoring rules.
- `docs/change-log.md`
  - Record the new shared typed house-action-memory mechanism and rollout.
- `docs/superpowers/project-progress.md`
  - Keep canonical progress synchronized with this queued child.
- `docs/superpowers/plans/2026-08-28-ai-event-ledger-phase-1-plan.md`
  - Update the current child’s next-child fields so governance points at this waiting plan.
- `docs/superpowers/plans/2026-08-28-indoor-house-action-memory-plan.md`
  - Keep execution state, progress log, and checkbox state current.

### Existing files expected to be deleted

- `none`

### New files to create

- `src/application/house/house-action-memory-event.ts`
  - Shared helper for authoring typed house-action observed events with consistent summary/hint shape.
- `tests/house-action-memory-runtime.test.cjs`
  - Focused shared-contract coverage for typed ledger events and ledger-only versus commentable derivation.
- `tests/house-action-memory-batch-a.test.cjs`
  - Focused Batch A contract coverage for transaction/service/gamble houses that do not already have dedicated house tests.
- `tests/house-action-memory-batch-b.test.cjs`
  - Focused Batch B contract coverage for work/story houses.

## Verification Plan

- Targeted verification:
  - typed `houseActionMemory` survives ledger append without breaking the existing durable event ledger,
  - ledger-only events with no `reactionHints` do not become NPC opening memories,
  - `start_talk` only consumes the newest same-house memories for the current NPC,
  - Batch A houses emit open/abandon/success/no-play events at stable owner-side points,
  - Batch B houses emit preview/preview-exit/completion events at stable owner-side points,
  - no house-specific business branches are added to `src/main.ts`.
- Required commands:
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json`
  - `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-action-memory-runtime.test.cjs tests/house-action-memory-batch-a.test.cjs tests/house-action-memory-batch-b.test.cjs tests/ai-event-ledger-runtime.test.cjs tests/npc-ai-dialogue-request-builder.test.cjs tests/npc-ai-dialogue-runtime.test.cjs tests/market-house-settlement-trade.test.cjs tests/market-house-investigation.test.cjs tests/tavern-short-gamble-house.test.cjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`

## Task 1: Shared House-Action Memory Contract

**Files:**
- Modify: `src/domain/world-intent.ts`
- Modify: `src/domain/npc-ai-dialogue.ts`
- Modify: `src/core/runtime/world-intent-runtime.ts`
- Create: `tests/house-action-memory-runtime.test.cjs`
- Modify: `tests/ai-event-ledger-runtime.test.cjs`

- [x] **Step 1: Write the failing shared-contract tests**

Add focused tests that prove:

- typed `houseActionMemory` payload is preserved in ledger entries,
- events with no `reactionHints` stay ledger-only,
- reaction memories keep `houseId` plus the typed action-memory context needed for same-house filtering.

- [x] **Step 2: Run the focused RED verification**

Run the cached test-compile command, write the CommonJS marker, then run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-action-memory-runtime.test.cjs tests/ai-event-ledger-runtime.test.cjs
```

Expected:

- `FAIL` because the typed indoor action-memory contract does not exist yet.

- [x] **Step 3: Implement the minimal shared contract/runtime changes**

Add the typed `houseActionMemory` branch and keep the ledger-only versus commentable derivation rule explicit inside the shared runtime.

- [x] **Step 4: Run the focused GREEN verification**

Run the same focused suites again and confirm they pass.

## Task 2: Same-House NPC Opening Filter And Authoring Helper

**Files:**
- Create: `src/application/house/house-action-memory-event.ts`
- Modify: `src/core/runtime/npc-interaction-runtime.ts`
- Modify: `src/application/npc-interaction/npc-ai-dialogue-request-builder.ts`
- Modify: `tests/npc-ai-dialogue-request-builder.test.cjs`
- Modify: `tests/npc-ai-dialogue-runtime.test.cjs`

- [x] **Step 1: Write the failing same-house prompt tests**

Add focused tests that prove:

- `start_talk` prefers the newest same-house reaction memory for the current NPC,
- different-house memories for the same NPC are ignored at opening time,
- the shared helper can author neutral ledger summaries plus optional NPC-facing hints without ad hoc per-house drift.

- [x] **Step 2: Run the focused RED verification**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/npc-ai-dialogue-request-builder.test.cjs tests/npc-ai-dialogue-runtime.test.cjs tests/house-action-memory-runtime.test.cjs
```

Expected:

- `FAIL` because same-house filtering and the helper contract do not exist yet.

- [x] **Step 3: Implement the helper and same-house filtering**

Add the shared authoring helper and feed only the newest same-house/current-NPC memories into `start_talk` request construction.

- [x] **Step 4: Run the focused GREEN verification**

Run the same focused suites again and confirm they pass.

## Task 3: Batch A Transaction And Service House Rollout

**Files:**
- Modify: `src/application/house-modules/market-house/market-house-house-module.ts`
- Modify: `src/application/house-modules/grain-shop/grain-shop-house-module.ts`
- Modify: `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
- Modify: `src/application/house-modules/tea-house/tea-house-house-module.ts`
- Modify: `src/application/house-modules/tavern/tavern-house-module.ts`
- Create: `tests/house-action-memory-batch-a.test.cjs`
- Modify: `tests/market-house-settlement-trade.test.cjs`
- Modify: `tests/market-house-investigation.test.cjs`
- Modify: `tests/tavern-short-gamble-house.test.cjs`

- [x] **Step 1: Write the failing Batch A tests**

Add focused tests that prove Batch A houses emit the approved events for:

- meaningful panel/service open,
- close or abandon without settlement,
- trade/service success,
- tavern enter/no-play/settlement.

- [x] **Step 2: Run the focused RED verification**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-action-memory-batch-a.test.cjs tests/market-house-settlement-trade.test.cjs tests/market-house-investigation.test.cjs tests/tavern-short-gamble-house.test.cjs
```

Expected:

- `FAIL` because Batch A houses do not fully emit the shared typed action-memory events yet.

- [x] **Step 3: Implement Batch A event emission**

Emit the approved typed action-memory events from stable owner-side result points, and keep transient open/preview events ledger-only unless they are socially meaningful enough to merit `reactionHints`.

- [x] **Step 4: Run the focused GREEN verification**

Run the same focused suites again and confirm they pass.

## Task 4: Batch B Work And Story House Rollout Plus Docs Sync

**Files:**
- Modify: `src/application/house-modules/temple-house/temple-house-house-module.ts`
- Modify: `src/application/house-modules/keep-house/keep-house-house-module.ts`
- Modify: `src/application/house-modules/leader-residence/leader-residence-house-module.ts`
- Create: `tests/house-action-memory-batch-b.test.cjs`
- Modify: `docs/special-house-interface.md`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/project-progress.md`
- Modify: `docs/superpowers/plans/2026-08-28-ai-event-ledger-phase-1-plan.md`
- Modify: `docs/superpowers/plans/2026-08-28-indoor-house-action-memory-plan.md`

- [x] **Step 1: Write the failing Batch B tests**

Add focused tests that prove work/story houses emit the approved events for:

- preview,
- preview exit without taking the action,
- meaningful completion,
- same-building related-NPC opening consumption.

- [x] **Step 2: Run the focused RED verification**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-action-memory-batch-b.test.cjs tests/npc-ai-dialogue-request-builder.test.cjs tests/npc-ai-dialogue-runtime.test.cjs
```

Expected:

- `FAIL` because Batch B houses do not emit the shared typed action-memory events yet.

- [x] **Step 3: Implement Batch B event emission and shared docs updates**

Emit preview/preview-exit/completion events from stable owner-side points, then document the contract/lifecycle changes in the required shared docs.

- [x] **Step 4: Run the full verification plan and sync governance**

Run the full verification plan for this child, update plan/project-progress state, and leave the child `completed-but-open` until push or explicit closeout gates pass.

## Exit Check

- [x] `WorldObservedEvent` supports typed `houseActionMemory` without breaking the durable ledger path.
- [x] Ledger-only transient events do not become NPC reaction memories unless `reactionHints` exist.
- [x] `start_talk` uses the newest same-house reaction memory for the current NPC only.
- [x] Batch A houses emit the approved transaction/service/gamble action memories.
- [x] Batch B houses emit the approved work/story action memories.
- [x] `docs/special-house-interface.md`, `docs/change-log.md`, and governance docs are updated.
- [x] No house-specific business branches are added to `src/main.ts`.
- [x] Verification is recorded.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Indoor House Action Memory`
- Parent Task: `House Local Gameplay`
- Parent Stage: `House Local Gameplay`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `yes`
- Next Child: `Temple AI Mainline`
- Next Child Status: `waiting`
- Next Required Action: `push-current-child-and-recheck-temple-admission`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-08-28-indoor-house-action-memory-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then finish Indoor House Action Memory push/closeout before promoting Temple AI Mainline.`
