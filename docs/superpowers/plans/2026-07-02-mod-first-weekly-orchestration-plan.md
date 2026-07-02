# Mod-First Weekly Orchestration Plan

> **Purpose:** Use this file to govern the fresh mod-first continuation set that begins after the closed `2026-07-02` Child 14/15/16 queue. This set exists to open a different problem type rather than to reopen the completed runtime-handoff children.

**Week Of:** `2026-07-02`

**Goal:** Govern the first mod-first continuation set through the post-Child-21 promotion point so later end-to-end closure work can be rechecked without reopening the closed runtime-handoff queue.

**Architecture:** The earlier `2026-07-02` weekly set is closed historical truth only. This fresh mod-first set starts from the roadmap in `docs/superpowers/specs/2026-07-02-mod-first-unified-contract-roadmap-design.md`, moved through Child 17, Child 18, Child 19, Child 20, Child 21, and Child 22, and now closes after the roadmap closure child is completed.

**Tech Stack:** Markdown governance docs, TypeScript repository tasks, `npm run lint:plans`, child-plan verification commands, weekly artifact bundle under `docs/superpowers/weekly/2026-07-02-mod-first-*`

## Execution State

- Status: `completed`
- Last Updated: `2026-07-03`
- Current Focus: `Weekly set closeout completed. Child 22 closed the roadmap closure boundary by adding save/source persistence and fresh restore source reload parity.`
- Next Step: `Do not append another executable child into this set. Any later roadmap continuation must begin from a fresh weekly review.`
- Verification: `Child 19 closeout batch: npm run build:test + node --test tests/robustness.test.cjs --test-name-pattern "task runtime contract|task contribution|task runtime load|task runtime signal|task runtime action|active game content indexes merged task definitions|createInitialState seeds runtime task state|runtime dispatch settles routed task actions and signals|main.ts keeps covered runtime commits supplied with active task definitions" + npm run typecheck + npm test + npm run build + npm run lint:plans; Child 20 closeout batch: node --test tests/robustness.test.cjs --test-name-pattern "house runtime|house module registry|special house interface|mod house registration|house renderer registry" + npm run typecheck + npm test + npm run build + npm run lint:plans; Child 21 closeout batch: node --test tests/robustness.test.cjs --test-name-pattern "gameplay contribution registry|mod manifest contribution|mod runtime contribution|dependency conflict|capability rejected" + npm run typecheck + npm test + npm run build + npm run lint:plans; Child 22 batch 1: npm run build:test + node --test tests/robustness.test.cjs --test-name-pattern "loadSaveEnvelope normalizes engine selected mod id|child 22 continue path|child 22 builtin and imported startup" + npm run typecheck + npm test + npm run build; Child 22 batch 2: npm run build:test + node --test tests/robustness.test.cjs --test-name-pattern "save envelope preserves selected mod id|loadSaveEnvelope normalizes a legacy save into the current envelope|serializeSaveEnvelope preserves unknown mod payload after load|loadSaveEnvelope preserves imported mod source descriptors for restore|child 22 restore path can reload imported mod sources after a fresh page load" + npm run typecheck + npm test + npm run build + npm run lint:plans`
- Notes: `This fresh set is now closed. Do not reopen it for same-type closure work.`

## Progress Log

- 2026-07-02
  - Summary: `Opened a fresh mod-first continuation set after the earlier 2026-07-02 runtime-handoff set closed. The new queue records Child 17 as active, Child 18 as the immediate queued follow-up, and Child 19 as the locked later follow-up. Child 20 through Child 22 remain roadmap candidates only.`
  - Verification: `npm run lint:plans`
  - Next: `Start Child 17 Task 1 Step 1 and refresh the mod-first weekly artifacts after the first implementation batch.`
- 2026-07-02
  - Summary: `Completed Child 17. Covered story, house-content, and keep-house/temple-house pack consumers now route through the shared pack-content access seam instead of direct zhuyuanzhang imports. Child 17 moves to completed history, the set temporarily has no active child, Child 18 remains queued pending baseline recheck, and Child 19 remains locked.`
  - Verification: `node --test tests/robustness.test.cjs --test-name-pattern "direct scenario import|story content registry|house content registry|pack content access"` + `npm run typecheck` + `npm test` + `npm run build`
  - Next: `Run Child 18 baseline recheck before any promotion decision.`
- 2026-07-02
  - Summary: `Ran the Child 18 baseline recheck and promoted Child 18 to active execution. The recheck narrowed scope to repeated main-owned runtime bridge commit glue in covered day-start, advance-segments, enter-city, and story-battle paths. Batch 1 added commitRuntimeRequest() under state-sync-runtime and migrated the covered main.ts paths to it.`
  - Verification: `node --test tests/robustness.test.cjs --test-name-pattern "runtime spine|main runtime orchestration|dispatchRuntimeRequest|runtime settlement|state sync|child 15 covered|child 16 covered"` + `npm run typecheck` + `npm test` + `npm run build`
  - Next: `Continue Child 18 Task 3 before considering Child 19 promotion.`
- 2026-07-02
  - Summary: `Completed Child 18. Covered city-begging and activity-qte write-back paths now also route through commitRuntimeRequest(), so the covered runtime spine no longer depends on repeated manual runtime bridge create/apply glue in main.ts. Child 19 was then rechecked against the post-Child-18 baseline and remains unchanged as the next candidate, but was not promoted in this batch.`
  - Verification: `node --test tests/robustness.test.cjs --test-name-pattern "interactive covered main write-back|runtime spine|main runtime orchestration|activity qte result close|minigame dispatch"` + `npm run typecheck` + `npm test` + `npm run build` + `npm run lint:plans`
  - Next: `Promote Child 19 only when ready to begin task-runtime contract execution.`
- 2026-07-02
  - Summary: `Promoted Child 19 to active execution. The first Child 19 batch landed shared pack/domain/loader support for optional task contributions and verified it end-to-end through targeted task-contribution regression coverage plus the full typecheck/test/build gate.`
  - Verification: `npm run build:test` + `node --test tests/robustness.test.cjs --test-name-pattern "task runtime contract|task contribution|task runtime load|task runtime signal|task runtime action|content pack loader|scenario pack loader"` + `npm run typecheck` + `npm test` + `npm run build` + `npm run lint:plans`
  - Next: `Keep Child 19 active and continue with Task 3 runtime wiring.`
- 2026-07-02
  - Summary: `Completed Child 19. Shared pack/domain/loaders, active content lookup, unified game state, and shared runtime dispatch now form one task-runtime mod-facing path. The set returns to no active child while Child 20 waits for a fresh baseline recheck rather than auto-promotion.`
  - Verification: `npm run build:test` + `node --test tests/robustness.test.cjs --test-name-pattern "task runtime contract|task contribution|task runtime load|task runtime signal|task runtime action|active game content indexes merged task definitions|createInitialState seeds runtime task state|runtime dispatch settles routed task actions and signals|main.ts keeps covered runtime commits supplied with active task definitions"` + `npm run typecheck` + `npm test` + `npm run build` + `npm run lint:plans`
  - Next: `Recheck Child 20 only when ready to open the next child.`
- 2026-07-02
  - Summary: `Ran the fresh post-Child-19 baseline recheck and promoted Child 20 to active execution. The recheck narrowed the work to one concrete seam: core runtime ownership, presenter lookup, and house renderer lookup still depend on the builtin application registry rather than a shared house registration surface. Task 1 added targeted red tests that fail on that exact residue and on the unsynchronized special-house registry contract.`
  - Verification: `node --test tests/robustness.test.cjs --test-name-pattern "house runtime|house module registry|special house interface|mod house registration|house renderer registry"`
  - Next: `Implement the shared house registration seam and migrate covered runtime/view lookup onto it.`
- 2026-07-02
  - Summary: `Completed Child 20. Covered house runtime, presenter, and renderer lookup now consume one core-owned shared house registration seam, while builtin module and renderer bindings are expressed as fallback contributions through that same seam. The set returns to no active child while Child 21 waits for a fresh baseline recheck.`
  - Verification: `node --test tests/robustness.test.cjs --test-name-pattern "house runtime|house module registry|special house interface|mod house registration|house renderer registry"` + `npm run typecheck` + `npm test` + `npm run build` + `npm run lint:plans`
  - Next: `Recheck Child 21 only when ready to open the next unified contribution-registry boundary.`
- 2026-07-02
  - Summary: `Ran the fresh post-Child-20 baseline recheck, promoted Child 21 to active execution, narrowed it to manifest/runtime/registry install policy, and then completed it. Mod activation now installs and validates one unified gameplay contribution registry instead of returning only manifest/source metadata.`
  - Verification: `node --test tests/robustness.test.cjs --test-name-pattern "gameplay contribution registry|mod manifest contribution|mod runtime contribution|dependency conflict|capability rejected"` + `npm run typecheck` + `npm test` + `npm run build` + `npm run lint:plans`
  - Next: `Recheck Child 22 only when ready to open the end-to-end closure boundary.`
- 2026-07-02
  - Summary: `Ran the fresh post-Child-21 baseline recheck, promoted Child 22 to active execution, and completed the first narrowed closure batch. Startup now shares one activated-session bootstrap seam across builtin/imported flows, and save restore no longer lets continue overwrite a restored selected mod by re-entering builtin startup.`
  - Verification: `npm run build:test` + `node --test tests/robustness.test.cjs --test-name-pattern "loadSaveEnvelope normalizes engine selected mod id|child 22 continue path|child 22 builtin and imported startup"` + `npm run typecheck` + `npm test` + `npm run build`
  - Next: `Keep Child 22 active and continue with later source persistence and resumed runtime-state closure work.`
- 2026-07-03
  - Summary: `Completed Child 22 and closed this fresh mod-first weekly set. Save envelope now preserves selectedModSource, fresh restore can reload imported file/url sources through mod runtime, and the final roadmap closure boundary no longer depends on imported mods still being present in in-memory runtime state.`
  - Verification: `npm run build:test` + `node --test tests/robustness.test.cjs --test-name-pattern "save envelope preserves selected mod id|loadSaveEnvelope normalizes a legacy save into the current envelope|serializeSaveEnvelope preserves unknown mod payload after load|loadSaveEnvelope preserves imported mod source descriptors for restore|child 22 restore path can reload imported mod sources after a fresh page load"` + `npm run typecheck` + `npm test` + `npm run build` + `npm run lint:plans`
  - Next: `Require a fresh weekly review before any later roadmap continuation.`

---

## Weekly Scope

### In Scope

- Child 17 execution and governance
- queue truth for Child 17 active / Child 18 queued / Child 19 locked
- fresh mod-first artifact bundle updates under `docs/superpowers/weekly/2026-07-02-mod-first-*`
- promotion discipline for later children under the mod-first roadmap

### Out Of Scope

- reopening the closed `docs/superpowers/plans/2026-07-02-weekly-orchestration-plan.md`
- treating completed Child 15 or Child 16 as executable again
- auto-promoting Child 20 through Child 22 into the visible queue before baseline recheck and later review
- unrelated runtime redesign outside the active child boundary

## Queue

Keep the visible queue intentionally shallow. Recommended maximum:

- one `active child`
- one `queued child`
- one `locked child`

Status meaning:

- `active`: executable now, must have a plan and current baseline truth
- `queued`: next promotion candidate after the current active child closes
- `locked`: recorded in this set but not yet the next promotion candidate
- `completed`: closed inside this set and kept only as queue history
- `blocked`: cannot continue until the recorded blocker is cleared

### Slot 1: Active Child

- Child: `None currently`
- Queue status: `completed`
- Primary boundary: `Child 22 closed the final visible roadmap boundary in this set, so no active child remains.`
- Depends on: `Child 22 completed`
- Resume point: `Do not resume this set; require a fresh weekly review.`

### Slot 2: Queued Child

- Child: `None currently`
- Queue status: `queued`
- Primary boundary: `No queued child remains because the visible queue has been fully consumed.`
- Depends on: `Not applicable`
- Promotion note: `Do not append a new queued child into a completed set.`

### Slot 3: Locked Child

- Child: `None currently`
- Queue status: `locked`
- Primary boundary: `No additional locked child remains after weekly closeout.`
- Depends on: `Not applicable`
- Promotion note: `Do not append a new locked child without opening a fresh weekly set.`

## Promotion Rule

When the active child closes:

1. update the `2026-07-02-mod-first` weekly artifact bundle
2. recheck the next queued child against the latest code + artifact baseline
3. record one result:
   - `unchanged`
   - `narrowed`
   - `superseded`
4. only then promote the next child to `active`
5. only after promotion begin execution from that child plan

If the recheck result is `superseded`, do not auto-create a replacement child in the same work batch.

## Close Rule

Close this weekly set when any of these becomes true:

- Child 17 closes and governance decides not to keep the same set open for Child 18
- the visible queue has been consumed
- no remaining queued child is still executable after baseline recheck

After closeout:

- later roadmap children may still exist as candidates
- no new executable child may be appended into this same set without explicit fresh review
- a later continuation must begin from a fresh weekly review if the remaining work becomes a different problem type

## Weekly Deliverables

- [x] Child 17 active plan exists
- [x] Child 18 queued plan exists
- [x] Child 19 locked plan exists
- [x] fresh mod-first artifact bundle exists
- [x] weekly review index reflects the new queue truth
- [x] weekly architecture report reflects the new queue truth and maturity snapshot

## Deliverable Files

- Weekly review index:
  - `docs/superpowers/weekly/2026-07-02-mod-first-weekly-review-index.md`
- Module map:
  - `docs/superpowers/weekly/2026-07-02-mod-first-weekly-module-map.md`
- Call flows:
  - `docs/superpowers/weekly/2026-07-02-mod-first-weekly-call-flows.md`
- Next split review:
  - `docs/superpowers/weekly/2026-07-02-mod-first-weekly-next-split-review.md`
- Architecture report:
  - `docs/superpowers/weekly/2026-07-02-mod-first-weekly-architecture-report.md`

Merged ownership:

- boundary checklist ownership lives in `weekly-module-map`
- change impact ownership lives in `weekly-review-index`
- module backlog ownership lives in `weekly-next-split-review`

## Verification Policy

- The active child plan owns detailed verification commands.
- This weekly plan summarizes set-opening governance verification or the current active-child verification state.
- Doc-only governance batches may record `Not run as part of this doc-only change`.

## Blocker Rules

- If the active child hits `P0`, stop later queue promotion and record the blocker here.
- If the active child hits `P1`, do not promote dependent queued children.
- `P2` may be deferred only if explicitly recorded and the next promotion does not depend on the unresolved area.

## Acceptance Gate

Do not mark this weekly plan `completed` until:

- the set goal is complete or the queue is explicitly closed with no remaining executable child
- no unresolved `P0` or `P1` remains in weekly scope
- the active child result and queue state are synchronized across the weekly artifacts
- the latest `Progress Log` records the weekly outcome

## Completion Checklist

- [x] Queue state updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
- [x] Weekly review index updated
- [x] Required visibility deliverables linked and present
