# Weekly Orchestration Plan

> **Historical Artifact:** Deprecated under `fail-closed progress-driven governance`. This file records the retired weekly-governance model and must not be used as the active resume entry for new work.


> **For agentic workers:** Use this file as the queue-level controller for the week's implementation plans. Execute concrete code work from child plans only. Update both the child plan and this weekly orchestration plan after each work batch.

**Goal:** Govern this week's repository plan execution so child plans run in the correct order, active work is visible, pending work is queued, interrupted work can resume from a single weekly source of truth, and the post-Child-13 queue closeout state is explicit before any later continuation work opens a new weekly set.

**Architecture:** Use one weekly parent plan to orchestrate plan sequencing and one weekly visibility companion to force de-black-box outputs. Keep concrete implementation in child plans. Reconcile inherited legacy plans separately from the active weekly queue so historical ambiguity does not corrupt the execution order of current work. After Child 13 closeout, keep this file as the authoritative record that the current queue is closed and that any later continuation must begin as a newly reviewed iteration rather than as an implicit extension of the closed queue.

**Tech Stack:** Markdown plan governance, TypeScript repository tasks, `npm run lint:plans`, child-plan verification commands

## Execution State

- Status: `completed`
- Last Updated: `2026-07-02`
- Current Focus: `Child 13 is now completed. The remaining in-scope Bucket A path was the story-battle action -> reenter-house follow-up still branched inline in src/main.ts, and that path now converges through houseRuntime.applyInteractiveFollowUp() without reopening Child 11 or Child 12 scope.`
- Next Step: `Do not resume another executable child from this weekly queue. Any later continuation work now requires a fresh weekly review, explicit spec/plan authoring, and queue-governance updates before implementation starts.`
- Verification: `Child 13 closeout: npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "child 13|follow-up|reentry|shared dispatch"; npm run typecheck; npm test; npm run build; npm run lint:plans`
- Notes: `This weekly plan governed the current execution order and that queue is now closed. Child 4 is complete on the approved minimum RuntimeState carrier, Child 5 is complete on the presenter output bridge, Child 6 is complete on the formal Task Runtime contract/lifecycle/progression slice, Child 7 is complete on the formal Mod Runtime activation/startup seam, Child 8 is complete on the first formal StateSync Runtime canonical boundary, Child 9 is complete on the shared contract-hardening baseline, Child 10 is complete on the runtime ownerization review/baseline artifact, Child 11 is complete on the approved ownerization slices, Child 12 is complete on the additive UI contract reserve landing, and Child 13 is complete on the remaining same-type shared-dispatch follow-up/reentry convergence audit. Bucket A = one remaining covered story-battle -> reenter-house follow-up path; Bucket B = none; Bucket C = none in the remaining in-scope audit. characterDefinitions remains outside RuntimeState.core unless a later weekly promotion gate updates the governing docs first. Several older plans still have inherited or uncertain state and remain in reconciliation scope until individually reviewed.`

## Current Iteration Phase

- Iteration label: `engine-first / runtime-first foundation iteration`
- Current phase: `queue closeout and next-iteration review preparation`
- Completed in this iteration:
  - `Child 4` minimum RuntimeState carrier + interactive integration under core
  - `Child 5` presenter/render decoupling
  - `Child 6` Task Runtime first slice
  - `Child 7` Mod Runtime first slice
  - `Child 8` StateSync Runtime first canonical boundary
  - `Child 9` shared runtime contract hardening
  - `Child 10` runtime ownerization review / baseline
  - `Child 11` approved sub-runtime ownerization slices
  - `Child 12` additive UI contract reserve
  - `Child 13` remaining same-type shared-dispatch follow-up / reentry closeout
- Current iteration outcome:
  - the active weekly queue is closed
  - no executable child remains in this weekly set
  - the repository is no longer blocked on missing runtime contracts; the remaining issue is controlled continuation decomposition for later ownerization work
- Next iteration entry trigger:
  - a fresh weekly review is written
  - the new iteration states its own concrete goal and boundary
  - any newly proposed child has explicit spec/plan authoring and queue-governance updates before implementation starts

## Post-Queue Continuation Goals

The next weekly iteration must treat governance work as controlled continuation, not as automatic queue growth.

- 鏀归€犵洰鏍?1: keep the weekly plan as the single source of truth for which child is executable, which child is only a candidate, and which work remains outside the queue
- 鏀归€犵洰鏍?2: separate `architecture candidate` from `unlocked child` so architecture-report follow-up ideas are not mistaken for implementation permission
- 鏀归€犵洰鏍?3: make the current iteration/phase explicit so later work can distinguish `closed queue`, `review/prep`, and `active execution` states without relying on historical inference
- 鏀归€犵洰鏍?4: prevent infinite child splitting by requiring every new child to justify why it is a separate reviewable boundary instead of residual cleanup inside the current closeout
- 鏀归€犵洰鏍?5: keep later runtime continuation decomposed by subsystem boundary and verification gate, rather than reopening one large undifferentiated ownerization program

## Post-Queue Continuation Rules

These rules apply after the current weekly queue closeout.

- No later continuation child may be treated as executable until a fresh weekly review records it as the next executable child.
- Recording a candidate next split in `weekly-architecture-report.md` does not unlock that work.
- A later child may be authored only if it has:
  - one primary subsystem boundary
  - one primary verification story
  - a clear reason it should not remain as residual debt or architecture backlog
- A later child must not be created merely because the previous child discovered adjacent cleanup.
- In a future weekly set, keep queue depth controlled:
  - at most one `active executable child`
  - at most one `immediate queued follow-up`
  - at most one `locked follow-up child`
  - anything beyond that stays in architecture review/backlog until promoted by a later weekly review
- If a candidate continuation would mix `interactive legacy cleanup`, `navigation/time convergence`, and `event/scene handoff convergence` into one child, stop and split it before queue promotion.

## Progress Log

- 2026-06-29
  - Summary: `Created the first weekly orchestration layer and queued current child plans under explicit dependency rules.`
  - Verification: `npm run lint:plans`
  - Next: `Start Child 1 and update both child and weekly status after the first work batch.`
- 2026-06-29
  - Summary: `Authored Child 2 as a formal save migration hardening plan and bound it to Save / Load Runtime plus State Sync Runtime responsibilities.`
  - Verification: `npm run lint:plans`
  - Next: `Keep Child 1 as the active next implementation target; use Child 2 after Child 1 completes.`
- 2026-06-29
  - Summary: `Weekly orchestration wording tightened so Child 1 owns the first core boundary plus minimal save seam, while Child 2 exclusively owns save hardening after that seam.`
  - Verification: `npm run lint:plans`
  - Next: `Start Child 1 from Task 1 Step 1, then use Child 2 only after Child 1 reaches its acceptance gate.`
- 2026-06-29
  - Summary: `Authored the formal Child 3 plan and queued it behind Child 1 and Child 2 with explicit scope guards for event activation, scene handoff, and task seams only.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Keep Child 1 as the only executable next target; Child 3 remains queued until its dependency gate is satisfied.`
- 2026-06-29
  - Summary: `Refined weekly dependency rules so Child 3 can only bypass Child 2 through a recorded waiver in both the parent and weekly logs, and corrected queue formatting for Child 2.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Start Child 1; if Child 3 is ever considered before Child 2 completes, record an explicit waiver reason in both parent and weekly progress logs first.`
- 2026-06-29
  - Summary: `Added a weekly visibility companion so each implementation batch must also update module, flow, and architecture understanding artifacts.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `After the first Child 1 work batch, update both the weekly orchestration plan and docs/superpowers/plans/2026-06-29-weekly-implementation-visibility-plan.md.`
- 2026-06-29
  - Summary: `Created the initial weekly artifact bundle under docs/superpowers/weekly and synchronized the weekly governance files to treat those artifacts as the active visibility baseline.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Start Child 1, then update the weekly orchestration plan, visibility companion, and weekly artifact bundle together after the first implementation batch.`
- 2026-06-29
  - Summary: `Executed the first Child 1 batch and synchronized weekly governance: Task 1 landed src/core/contracts, tests now cover the initial boundary, and the weekly artifact bundle was updated from baseline/planned state to implementation-backed state.`
  - Verification: `Child 1 Task 1: npm run typecheck; npm test; npm run build`
  - Next: `Continue Child 1 with Task 2 engine-session composition and then repeat the same synchronization cycle.`
- 2026-06-29
  - Summary: `Executed the second Child 1 batch in an isolated worktree: Task 2 landed src/core/engine, upgraded the registry seam, and refreshed the weekly artifact bundle to reflect the first real selected-mod bootstrap path.`
  - Verification: `Child 1 Task 2: npm run typecheck; npm test; npm run build`
  - Next: `Continue Child 1 with Task 3 runtime dispatch and repeat the same synchronization cycle after that batch.`
- 2026-06-29
  - Summary: `Executed the third Child 1 batch in an isolated worktree: Task 3 landed src/core/runtime, validated routed effect settlement, and refreshed the weekly artifact bundle to reflect the first runtime-owned state transition seam.`
  - Verification: `Child 1 Task 3: npm run typecheck; npm test; npm run build`
  - Next: `Continue Child 1 with Task 4 save-envelope work and repeat the same synchronization cycle after that batch.`
- 2026-06-29
  - Summary: `Executed the Child 1 closeout batch in an isolated worktree: Task 4 landed src/core/save/save-envelope.ts, Task 5 routed src/main.ts through src/core/adapters/legacy-main-adapter.ts, and the weekly artifact bundle now reflects a completed first core boundary instead of a planned handoff.`
  - Verification: `Child 1 closeout: npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "main.ts delegates boot through legacy-main-adapter"; npm run typecheck; npm test; npm run build`
  - Next: `Promote Child 2 as the next executable weekly target after Child 1 review/merge, then repeat the same weekly/visibility synchronization cycle.`
- 2026-06-29
  - Summary: `Executed the Child 2 save-hardening batch in an isolated worktree: src/core/save gained migration/loader/writer seams, regression tests now cover legacy normalization plus missing-mod rejection, and the weekly artifact bundle now reflects a hardened persistence boundary rather than a minimal save seam.`
  - Verification: `Child 2 closeout: npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "loadSaveEnvelope normalizes|missing selected mod|payload after load|save migration upgrades"; npm run typecheck; npm test; npm run build`
  - Next: `Promote Child 3 as the next executable weekly target after Child 2 review/merge, then repeat the same weekly/visibility synchronization cycle.`
- 2026-06-29
  - Summary: `Executed the Child 3 navigation/time/event batch in an isolated worktree: src/core/runtime gained navigation/time/event/scene seam files, regression tests now cover the new runtime entry surfaces, and the weekly artifact bundle now reflects runtime-owned navigation/time/event entry plus the first event-to-scene handoff seam.`
  - Verification: `Child 3 closeout: npm run lint:plans; npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "navigation external entry ids|typed day-start request|candidate selection and activation seams|activated event handoff"; npm run typecheck; npm test; npm run build`
  - Next: `Promote Child 4 as the next executable weekly target after Child 3 review/merge, then repeat the same weekly/visibility synchronization cycle.`
- 2026-06-29
  - Summary: `Authored the formal Child 4 and Child 5 plan files plus their supporting specs. Queue state is now explicit: Child 4 is the next executable weekly target, while Child 5 is queued behind Child 4 so presentation work does not stabilize against the current mixed interaction ownership.`
  - Verification: `npm run lint:plans`
  - Next: `Start Child 4 from docs/superpowers/plans/2026-06-29-interactive-runtime-integration-under-core-plan.md and sync weekly visibility artifacts after the first Child 4 batch.`
- 2026-06-30
  - Summary: `Executed the first Child 4 batch in an isolated worktree: src/core/runtime gained interactive-runtime.ts and house-runtime.ts, src/core/adapters gained legacy house/interactive adapter files, covered city-begging/activity-qte/story-battle entry in src/main.ts now flows through those core seams, and the weekly artifact bundle has been refreshed to describe the new interactive-runtime ownership picture.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "application house-runtime directly|interactive runtime exports launch and action seams|core house runtime bridge exports enter leave and dispatch seams|covered interactive flows through core runtime"; npm run typecheck; npm test; npm run build; npm run lint:plans`
  - Next: `Keep Child 4 active, record the shared-dispatch follow-up explicitly in the child plan, and do not promote Child 5 until Child 4 completes.`
- 2026-06-30
  - Summary: `Realigned weekly governance after reconciling the actual type boundary in the Child 4 worktree. The active widening target is now a minimum carrier over the current application-layer GameState: RuntimeState.core maps the existing domain GameState, RuntimeState.app carries beggingMiniGameState/autoAdvanceState/cityDirectoryState/locationDialogueState, RuntimeState.view stays empty, and both characterDefinitions plus Child 1 CoreGameState convergence remain deferred behind a later weekly promotion gate.`
  - Verification: `npm test; npm run lint:plans`
  - Next: `Resume Child 4 at the GameState-based minimum carrier implementation steps, sync child/weekly/visibility after each implementation batch, and recheck Child 4 exit plus Child 5 start conditions before any queue promotion.`
- 2026-06-30
  - Summary: `Executed the second Child 4 batch in the isolated worktree and synchronized weekly governance around the landed minimum carrier. src/core/contracts/runtime-state.ts now defines the minimum RuntimeState shape, runtime-result/router/dispatch/settlement now route over RuntimeState, interactive-runtime now returns RuntimeResult.state plus RuntimeResult.interactive with characterDefinitions kept on an additive compatibility path, and main.ts now proves at least one covered interactive path can re-enter through dispatchRuntimeRequest() without merging characterDefinitions into RuntimeState.core.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "runtime state contract exports core app and view partitions|runtime result state is widened to RuntimeState|shared runtime dispatch routes RuntimeState instead of CoreGameState only|interactive runtime returns shared RuntimeResult"; npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "interactive runtime returns shared RuntimeResult|covered interactive flows through core runtime"; npm run typecheck; npm test; npm run build; npm run lint:plans`
  - Next: `Use the synced child/weekly/visibility state to re-evaluate whether Child 4 can close on the minimum carrier slice. If it cannot, continue only with wider shared-dispatch coverage and signal normalization before revisiting any convergence gate.`
- 2026-06-30
  - Summary: `Completed the Child 4 exit/start-condition recheck and advanced the weekly queue legally. Child 4 satisfies its approved exit condition on the minimum RuntimeState carrier, Child 5's dependency gate is now satisfied, and the weekly controller now promotes Child 5 as the next executable child without reopening the characterDefinitions convergence decision.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "application house-runtime directly|interactive runtime exports launch and action seams|core house runtime bridge exports enter leave and dispatch seams|covered interactive flows through core runtime|runtime state contract exports core app and view partitions|runtime result state is widened to RuntimeState|shared runtime dispatch routes RuntimeState instead of CoreGameState only|interactive runtime returns shared RuntimeResult"; npm run typecheck; npm test; npm run build; npm run lint:plans`
  - Next: `Start Child 5 from docs/superpowers/plans/2026-06-29-presenter-render-decoupling-plan.md Task 1 Step 1.`
- 2026-06-30
  - Summary: `Expanded the weekly controller so it explicitly records the long-term mod-first game-framework direction, this week's engine-first/runtime-first objectives, the full target runtime and functional-module split inventory, maturity categories, minimum cooperative data structures, non-goals, deliverables, acceptance conditions, and next-week unlock gates. The repository/doc consistency check confirms Child 4 is completed and Child 5 is unlocked but still queued/not-started.`
  - Verification: `npm run lint:plans`
  - Next: `Start Child 5 from docs/superpowers/plans/2026-06-29-presenter-render-decoupling-plan.md Task 1 Step 1; do not expand Child 5 beyond its presenter/render boundary.`
- 2026-06-30
  - Summary: `Added the closeout sync rule and simplified the weekly visibility artifact scheme from eight independently governed artifacts to five core artifacts. Boundary checklist ownership is now folded into the module map, change impact ownership into the review index, and module backlog ownership into the next split review.`
  - Verification: `npm run lint:plans`
  - Next: `Use the five core artifacts plus the closeout sync review before treating any future child as formally unlocked.`
- 2026-06-30
  - Summary: `Repaired the weekly narrative after the artifact consolidation: the old generic Weekly Goal was folded into one mod-first weekly goal, Child 4/Child 5 status wording was normalized, legacy artifact identity was clarified as historical-only, and a review-before-new-child rule was added for all post-Child-5 work.`
  - Verification: `npm run lint:plans`
  - Next: `Start Child 5 from its existing plan; before any additional child is created, review the five core artifacts and decide whether the target module deserves its own spec and plan.`
- 2026-06-30
  - Summary: `Promoted Task Runtime into the formal Child 6 slot by creating its spec and child plan, while keeping Child 5 as the next executable child. The older default-mod migration direction is now a later candidate rather than Child 6.`
  - Verification: `npm run lint:plans`
  - Next: `Start Child 5 from docs/superpowers/plans/2026-06-29-presenter-render-decoupling-plan.md Task 1 Step 1; keep docs/superpowers/plans/2026-06-30-task-runtime-plan.md queued behind Child 5.`
- 2026-06-30
  - Summary: `Completed the required review for one additional post-Child-6 child, then created formal Child 7 Mod Runtime spec and plan. Queue order stays unchanged: Child 5 remains next, Child 6 stays behind Child 5, and Child 7 is now queued behind Child 6.`
  - Verification: `npm run lint:plans`
  - Next: `Start Child 5 from docs/superpowers/plans/2026-06-29-presenter-render-decoupling-plan.md Task 1 Step 1; keep docs/superpowers/plans/2026-06-30-task-runtime-plan.md queued behind Child 5 and docs/superpowers/plans/2026-06-30-mod-runtime-plan.md queued behind Child 6.`
- 2026-06-30
  - Summary: `Created formal Child 8 StateSync Runtime spec and plan from the approved state-sync checklist. Queue order stays unchanged: Child 5 remains next, Child 6 stays behind Child 5, Child 7 stays behind Child 6, and Child 8 is queued behind Child 7.`
  - Verification: `npm run lint:plans`
  - Next: `Start Child 5 from docs/superpowers/plans/2026-06-29-presenter-render-decoupling-plan.md Task 1 Step 1; keep Child 6, Child 7, and Child 8 queued in order.`
- 2026-06-30
  - Summary: `Completed Child 5 presenter/render decoupling and closeout sync. src/application/presenter now owns presenter output contracts and app/stage/overlay presenters, src/main.ts calls createAppPresenterOutput() before render, src/ui/app-render.ts consumes presenterOutput instead of importing gameplay selection helpers directly, and all five core weekly artifacts were reviewed for queue-state wording.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "no longer imports gameplay selection helpers directly|top-level presenter output seam|assembles render input through application presenter output"; npm run typecheck; npm test; npm run build; npm run lint:plans`
  - Next: `Start Child 6 from docs/superpowers/plans/2026-06-30-task-runtime-plan.md Task 1 Step 1; keep Child 7 and Child 8 queued in order.`
- 2026-07-01
  - Summary: `Completed Child 6 Task Runtime. src/core/contracts/task-runtime.ts now defines TaskDefinition, TaskInstance, TaskRuntimeState, TaskAction, TaskSignal, TaskUpdate, and TaskRuntimeResult; src/core/runtime/task-runtime.ts now owns minimum task creation, duplicate active start handling, terminal failed/completed guards, signal-driven progression across multiple active tasks, and returned taskUpdates/effects/signals without applying effects. RuntimeResult now carries taskUpdates while preserving legacy task action/signal compatibility.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "task runtime contract exports|task runtime exports lifecycle|starts one instance per task id|broadcasts one signal|failed tasks as terminal|task runtime result carries|progresses active tasks|signal-only failure conditions"; npm run typecheck; npm test; npm run build; npm run lint:plans`
  - Next: `Run Child 6 closeout artifact sync and npm run lint:plans, then start Child 7 from docs/superpowers/plans/2026-06-30-mod-runtime-plan.md Task 1 Step 1 after the closeout commit.`
- 2026-07-01
  - Summary: `Completed Child 7 Mod Runtime. The repository now has formal mod runtime contracts, source normalization/loading/parsing seams, dependency and capability guards, atomic activation with rollback, a main adapter, and startup/restore calls from src/main.ts through Mod Runtime for builtin, file-imported, url-imported, and saved selected mods. Content assembly, save/load IO, gameplay runtimes, UI, and presenter work remain outside Mod Runtime ownership.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "mod runtime contract exports|mod runtime normalizes builtin file and url sources|mod runtime activation is atomic|mod runtime main adapter lets startup consume|save restore re-activates selected mod|mod runtime does not absorb content assembly"; npm run typecheck; npm test; npm run build; npm run lint:plans`
  - Next: `Run Child 7 closeout artifact sync, then start Child 8 from docs/superpowers/plans/2026-06-30-state-sync-runtime-plan.md Task 1 Step 1 after the closeout commit.`
- 2026-07-01
  - Summary: `Completed Child 8 StateSync Runtime. src/core/contracts/state-sync-runtime.ts now defines CanonicalRuntimeState, AppStateBridge, SaveState, PresentationInput, StateSyncTrigger, StateSyncResult, StateSyncContext, and StateSyncRuntime; src/core/runtime/state-sync-* now owns syncState plus validation, normalization, hydration, app bridge sync, pre-save snapshot preparation, mod activation rebuild, and presentation input preparation. src/main.ts no longer declares the interactive RuntimeState bridge helpers directly.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "state sync runtime contract exports|state sync trigger contract includes|state sync runtime exports one small sync entrypoint|main.ts does not add new feature-specific state sync branches"; npm run typecheck; npm test; npm run build; npm run lint:plans`
  - Next: `Do not promote any child beyond Child 8 until a fresh runtime/module/artifact review creates an explicit next spec and plan.`
- 2026-07-01
  - Summary: `Completed the required post-Child-8 review and created formal Child 9 Runtime Contract Hardening spec and plan. Child 9 scope is limited to typed RuntimeRequest/Router, formal Interactive/Minigame Dispatch, formal Effect Settlement, and minimum House Runtime Request contracts; Child 10 ownerization remains blocked behind Child 9 closeout and a later preflight review.`
  - Verification: `npm run lint:plans`
  - Next: `Start Child 9 from docs/superpowers/plans/2026-07-01-runtime-contract-hardening-plan.md Task 1 Step 1.`
- 2026-07-01
  - Summary: `Created formal Child 10 Runtime Ownerization Review And Baseline spec/plan, upgraded the Child 10 baseline document into the controlling unlock artifact, and scheduled Child 11 as the locked sub-runtime ownerization implementation child behind Child 10.`
  - Verification: `npm run lint:plans`
  - Next: `Keep Child 9 as the only executable next child. After Child 9 closes, execute Child 10 and do not unlock Child 11 until the Child 10 baseline is complete and Child 11 spec/plan are authored against it.`
- 2026-07-01
  - Summary: `Started Child 9 execution. The active plan now records the current shared request/router, interactive dispatch, effect-settlement, and house-request deficiencies directly in Task 1, so Child 9 implementation can proceed from explicit contract gaps instead of implied context.`
  - Verification: `npm run lint:plans`
  - Next: `Run Child 9 Task 2 Step 1 and add failing RuntimeRequest / Router contract tests.`
- 2026-07-01
  - Summary: `Completed Child 9 Task 2. The shared runtime seam now has typed RuntimeRequest families, a formal RuntimeRouter contract, and a dispatch entrypoint aligned to that router seam without expanding Child 9 into ownerization work.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "runtime request contract|runtime router contract|shared dispatch"`
  - Next: `Run Child 9 Task 3 Step 1 and add failing Interactive / Minigame Dispatch contract tests.`
- 2026-07-01
  - Summary: `Completed Child 9 Task 3. The public interactive runtime language is now explicit, session/result handoff is formalized, and the three covered interactive flows converge through one normalizer without promoting Child 9 into ownerization.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "interactive runtime contract|minigame dispatch contract"`
  - Next: `Run Child 9 Task 4 Step 1 and add failing Effect Settlement contract tests.`
- 2026-07-01
  - Summary: `Completed Child 9 Task 4 and Task 5, then closed Child 9. Effect Settlement now has a formal ownership/I-O seam, House Runtime now has a core-owned public request boundary, and queue governance is ready to promote Child 10 as the next executable child.`
  - Verification: `npm run typecheck; npm test; npm run build; npm run lint:plans`
  - Next: `Start Child 10 Runtime Ownerization Review And Baseline and keep Child 11 locked until the Child 10 baseline is complete.`
- 2026-07-01
  - Summary: `Completed Child 10. The runtime ownerization baseline is finalized, current owner vs bridge status is now explicit, adapter disposition and main.ts coupling are frozen for Child 11, and Child 11 remains locked until its spec/plan are authored against that baseline.`
  - Verification: `npm run lint:plans`
  - Next: `Author Child 11 spec and plan against the finalized baseline, then record the weekly unlock before any Child 11 implementation work starts.`
- 2026-07-01
  - Summary: `Authored the formal Child 11 implementation spec and plan against the finalized Child 10 baseline, completed the weekly unlock sync, and promoted Child 11 from locked candidate state to the next executable child.`
  - Verification: `npm run lint:plans`
  - Next: `Start Child 11 from docs/superpowers/plans/2026-07-01-sub-runtime-ownerization-implementation-plan.md Task 1 Step 1.`
- 2026-07-01
  - Summary: `Reviewed the future UI/resource direction after the current runtime queue and authored Child 12 UI Contract Reserve as a future queued child. Child 11 remains the next executable child; Child 12 is recorded only as a later candidate and does not change the current ownerization execution order.`
  - Verification: `npm run lint:plans`
  - Next: `Keep Child 11 as the active next executable child. Revisit Child 12 only after Child 11 completion and a later weekly unlock review.`
- 2026-07-01
  - Summary: `Authored the formal Child 13 post-Child-11 convergence-audit spec and plan, but kept Child 12 in the original UI layout/interface-reserve queue slot immediately after Child 11.`
  - Verification: `npm run lint:plans`
  - Next: `Keep Child 11 as the active next executable child. After Child 11 completes, complete Child 12 first and use its closeout to unlock Child 13.`
- 2026-07-01
  - Summary: `Started Child 11 and completed Task 1 shared dispatch convergence. tests/robustness.test.cjs now proves covered shared runtime reentry is runtime-owned, src/core/runtime/runtime-dispatch.ts now owns the covered follow-up hook on top of the hardened router seam, src/core/runtime/runtime-router.ts now defines the typed follow-up contract, and src/main.ts no longer branches on the covered story-battle reenter-house result after dispatch returns.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "shared dispatch consumes the hardened runtime router contract|runtime dispatch settles effects after routing|covered shared runtime reentry is runtime-owned"; npm run typecheck; npm test; npm run build`
  - Next: `Continue Child 11 from Task 2 Step 1 and keep Child 12 locked behind Child 11 completion.`
- 2026-07-01
  - Summary: `Completed Child 11 Task 2 interactive ownerization on the covered city-begging path. src/core/runtime/interactive-runtime.ts now owns launch, pointer/tick, completion follow-up, time advance, and session cleanup for that covered flow; src/core/adapters/legacy-interactive-adapter.ts has been narrowed by removing the city-begging lifecycle wrappers; and src/main.ts no longer performs the covered city-begging completion-time advance/cleanup branch directly.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "interactive runtime exports launch and action seams|interactive runtime contract exports launch action exit and result seams|covered interactive flow is runtime-owned"; npm run typecheck; npm test; npm run build`
  - Next: `Continue Child 11 from Task 3 Step 1 and keep Child 12 locked behind Child 11 completion.`
- 2026-07-01
  - Summary: `Completed Child 11 Task 3 house ownerization on the covered grain-shop path. src/core/runtime/house-runtime.ts now owns enter, dispatch, leave, session mutation, and covered house side-effect handling for that flow; src/core/adapters/legacy-house-adapter.ts has been reduced to a compatibility placeholder; and the covered house lifecycle no longer routes through a legacy adapter-owned dispatch helper.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "house runtime request contract exports enter leave and dispatch variants|core house runtime bridge exports enter leave and dispatch seams|covered house flow is runtime-owned"; npm run typecheck; npm test; npm run build`
  - Next: `Continue Child 11 from Task 4 Step 1 and keep Child 12 locked behind Child 11 completion.`
- 2026-07-01
  - Summary: `Completed Child 11 Task 4 and Child 11 closeout. src/core/runtime/runtime-settlement.ts now owns the covered advanceTime settlement path used by both interactive-runtime.ts and house-runtime.ts, the covered city-begging completion path no longer calls runTimeRuntime(), the covered grain-shop path no longer applies time progression through a direct advanceGameStateTimeSegments() call, and weekly governance now records Child 11 as completed while Child 12 remains the immediate queued follow-up and Child 13 stays locked behind Child 12.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "effect settlement contract exports emitter applier input and result seams|runtime dispatch settles effects after routing|covered settlement path stays on shared runtime ownership"; npm run typecheck; npm test; npm run build; npm run lint:plans`
  - Next: `Keep Child 11 closed. When implementation resumes, start Child 12 and do not bypass it to unlock Child 13.`
- 2026-07-02
  - Summary: `Reconciled stale post-Child-11 queue wording across the weekly controller. Child 11 is now consistently treated as completed, Child 12 is now recorded as the immediate next executable child rather than a future candidate, and Child 13 remains the locked follow-up after Child 12.`
  - Verification: `npm run lint:plans`
  - Next: `Start Child 12 from its own plan when implementation resumes.`
- 2026-07-02
  - Summary: `Completed Child 12 closeout and weekly queue sync. Formal UI contract reserve types, additive UI reserve seams, builtin reserve content, optional pack UI split-table support, and inactive-by-default protection are now landed; Child 12 is now closed and Child 13 is explicitly unlocked as the next executable child.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "ui contract modules export the reserve contract families|ui asset resolver prefers higher-priority layered aliases|ui reserve registry returns builtin-only defaults when no overrides exist|builtin ui reserve content covers the current layout-editor targets|content pack definition accepts optional ui reserve fields|content pack loader ignores missing optional ui reserve files|main runtime path does not import the ui reserve registry yet|existing layout editor target registry still stays on the current ui-layout path"; npm run typecheck; npm test; npm run build; npm run lint:plans`
  - Next: `When implementation resumes, start Child 13 from its own plan and keep Child 12 closed.`
- 2026-07-02
  - Summary: `Completed Child 13 and closed the active weekly queue. The remaining in-scope post-Child-11 audit found one Bucket A path: the story-battle action -> reenter-house follow-up still handled inline in src/main.ts after shared dispatch returned. Child 13 added red-to-green regression coverage, moved that follow-up behind houseRuntime.applyInteractiveFollowUp(), recorded no Bucket B backfill and no Bucket C new-boundary remainder, and synchronized the five-core weekly artifacts to a no-active-child state.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "child 13|follow-up|reentry|shared dispatch"; npm run typecheck; npm test; npm run build; npm run lint:plans`
  - Next: `No active queued child remains in this weekly set. Require a fresh weekly review before authoring any later continuation child.`
- 2026-07-02
  - Summary: `Completed the post-closeout governance audit for the current weekly set. README, weekly orchestration/governance specs, shared plan templates, weekly visibility templates, and the active weekly architecture/report artifacts were rechecked against the new weekly-set rule: a closed queue may record candidate continuation work, but it must not append a new executable child without a fresh weekly review and new orchestration-plan authoring. Template sync is now complete, and the only remaining legacy references are intentional historical-template notes for boundary checklist, change impact, and module backlog ownership.`
  - Verification: `npm run lint:plans`
  - Next: `Keep this weekly plan as the closeout record for the finished weekly set; if later continuation is approved, start from a fresh weekly review and a new weekly orchestration plan rather than extending this closed queue.`

---

## Weekly Goal

This weekly plan has one governing narrative: move the project toward a `mod-first` game framework by shrinking `src/main.ts` black-box orchestration and stabilizing reusable engine, runtime, state, module, and presentation seams.

### Long-Term Direction

- 灏嗗綋鍓嶉」鐩€愭鏀归€犳垚浠?mod 涓轰富鐨勬父鎴忔鏋躲€?- 璁╀笉鍚屾父鎴忓唴瀹归€氳繃缁熶竴鐨勬暟鎹€佸紩鎿庛€乺untime銆佹ā鍧楁帴鍙ｆ帴鍏ャ€?- 闄嶄綆 `src/main.ts` 涓庡崟浣撲笟鍔℃祦绋嬬殑榛戠洅鑰﹀悎銆?- 涓哄悗缁唴瀹硅縼绉汇€佸皬娓告垙缁熶竴鎺ュ叆銆佷换鍔＄郴缁熴€佷簨浠剁郴缁熴€乁I/presenter 瑙ｈ€︽彁渚涚ǔ瀹氭灦鏋勯鏋躲€?
### This Week Scope

- 缁х画鎸?engine-first / mod-first 璺嚎鎺ㄨ繘 `src/core` 鏋舵瀯鎷嗗垎銆?- 鏈懆閲嶇偣涓嶆槸瀹屾垚鎵€鏈夊姛鑳芥ā鍧楁帴鍏ワ紝鑰屾槸瀹屾垚鏍稿績妯″潡鐨勮竟鐣屾敹鏁涖€佸崗鍚岄鏋跺拰鍏煎鎺ョ偣銆?- 鏈懆闇€瑕佽鐩栨墍鏈夌洰鏍囧瓙 runtime 涓庡姛鑳芥ā鍧楃殑鐩樼偣銆佸垎绫汇€佽亴璐ｅ垝鍒嗐€佽竟鐣岃鏄庡拰鍚庣画鎺ュ叆椤哄簭銆?- 浼樺厛鏀舵暃 Shared Runtime / Runtime Dispatch / Router / Interaction Runtime / House Runtime integration seam / Shared Runtime State carrier銆?- 淇濇寔褰撳墠鍔熻兘鍏煎鐜版湁鐘舵€侊紝涓嶈姹傛湰鍛ㄥ畬鎴愬叏閲忚縼绉汇€?- 閫氳繃璁″垝鏂囨。銆佷簲浠芥牳蹇?weekly artifact銆佽竟鐣岃鏄庨檷浣庨」鐩粦鐩掔▼搴︺€?- 褰撳墠闃熷垪鍙ｅ緞锛欳hild 4 宸插畬鎴愶紝Child 5 宸插畬鎴?presenter/render decoupling锛孋hild 6 宸插畬鎴?Task Runtime 棣栫増鎶界锛孋hild 7 宸插畬鎴?Mod Runtime 棣栫増鎶界锛孋hild 8 宸插畬鎴?StateSync Runtime 棣栫増 canonical boundary锛孋hild 9 宸叉寮忓畾涔変负 Runtime Contract Hardening锛孋hild 10 宸叉寮忓畾涔変负 Runtime Ownerization Review And Baseline锛孋hild 11 宸蹭綔涓洪攣瀹氫腑鐨?ownerization 瀹炴柦 child 缂栨帓杩涢槦鍒楋紱Child 11 涔嬪悗濡傞渶鏂板 child锛屼粛蹇呴』鍏堝鐩樺啀鍐冲畾鏄惁鎷嗗嚭鐙珛 spec + plan銆?
## Weekly Focus Modules

- `Engine / Boot Runtime`
- `Shared Runtime`
- `Runtime Dispatch / Router`
- `Interaction Runtime`
- `House Runtime integration seam`
- `Navigation / Time / Event / Scene seams`
- `Task Runtime`
- `Minigame dispatch interface`
- `Presentation / Render Bridge`
- `Mod Runtime`
- `StateSync Runtime`
- `Effect Settlement Runtime`
## Full Runtime And Module Coverage Inventory

鏈竻鍗曟槸鏈懆蹇呴』瑕嗙洊鍜岀紪鎺掔殑鎷嗗垎瑙嗗浘锛屼笉浠ｈ〃鏈懆蹇呴』瀹屾垚鎵€鏈変唬鐮佺骇鎶界銆侰hild 6 closeout 鍚庯紝Task Runtime 宸蹭粠鈥滃緟姝ｅ紡鍖栤€濇彁鍗囦负宸茶惤鍦扮殑棣栫増 runtime seam銆?
### Target Sub-Runtimes

- `Engine / Boot Runtime`
- `Shared Runtime`
- `Runtime Dispatch / Router`
- `Interaction Runtime`
- `House Runtime`
- `Navigation Runtime`
- `Time Runtime`
- `Event Runtime`
- `Scene Runtime`
- `Effect Settlement Runtime`
- `Task Runtime`
- `Minigame Runtime / Dispatch Interface`
- `Save / Load Runtime`
- `StateSync Runtime`
- `Mod Runtime`
- `Presentation / Render Bridge`

### Target Functional Modules

- `house modules`
- `minigame modules`
- `story-battle module`
- `task module` (`Mission` 浠呬綔涓哄唴瀹瑰眰鎴栧睍绀哄眰鍛藉悕)
- `event module`
- `scene / dialogue module`
- `UI / layout / presenter module`
- `mod content loading / content-pack module`
- `mod loader / activation / capability / dependency module`

## Runtime Maturity Classification

### Landed

- `Engine / Boot Runtime`: Child 1 宸茶惤鍦扮涓€鏉?selected-mod bootstrap seam锛屼絾杩樹笉鏄畬鏁?mod activation銆?- `Shared Runtime`: Child 1/3/4 宸茶惤鍦版渶灏?shared runtime skeleton锛汣hild 6 缁х画鎶?taskUpdates 鎺ュ叆 RuntimeResult銆?- `Runtime Dispatch / Router`: Child 1 宸茶惤鍦帮紝Child 4 宸叉墿鍒版渶灏?`RuntimeState` carrier銆?- `Effect Settlement Runtime`: Child 1 宸茶惤鍦帮紝Child 4 宸叉帴鍏?`RuntimeState`锛汣hild 6 鍙繑鍥?task effects锛屼笉搴旂敤 effects銆?- `Save / Load Runtime`: Child 1/2 宸茶惤鍦?envelope銆乵igration銆乴oader銆亀riter銆乻elected-mod validation銆?- `Navigation Runtime`: Child 3 宸茶惤鍦?typed navigation entry seam銆?- `Time Runtime`: Child 3 宸茶惤鍦?day/time trigger seam銆?- `Event Runtime`: Child 3 宸茶惤鍦?candidate selection and activation seam銆?- `Scene Runtime`: Child 3 宸茶惤鍦?first event-to-scene handoff seam銆?- `Interaction Runtime`: Child 4 宸茶惤鍦?covered interaction entry/action seam 涓庢渶灏?shared result path銆?- `House Runtime integration seam`: Child 4 宸茶惤鍦?core-owned bridge 涓?legacy adapter銆?- `Task Runtime`: Child 6 宸茶惤鍦伴鐗堟寮?contracts銆乵inimum lifecycle銆乨uplicate active guard銆乼erminal failed/completed guard銆乻ignal-driven progression銆乼askUpdates/effects/signals result seam銆?- `Presentation / Render Bridge`: Child 5 宸插畬鎴愰鐗?presenter output bridge銆?
### Partially Landed / Compatibility Bridge

- `House Runtime`: core seam 宸叉湁锛屼絾鍏蜂綋 house modules 浠嶄富瑕佸湪 `src/application/house*` 閫氳繃 legacy adapter 鎵ц銆?- `Minigame Runtime / Dispatch Interface`: covered activity-qte/city-begging/story-battle 璺緞宸叉湁 bridge锛岀粺涓€ dispatch interface 灏氭湭姝ｅ紡鍖栥€?- `Task Runtime`: Child 6 鏄鐗堟渶灏忓彲鍗忓悓 runtime锛屽皻鏈帴鍏ュ畬鏁?task authoring DSL銆乁I/presenter 鎴?mod 鑷畾涔?evaluator 鎻掍欢銆?- `Presentation / Render Bridge`: Child 5 宸插畬鎴愰鐗?presenter output bridge锛涘綋鍓嶄负 provisional bridge锛宭ayout renderer 浠嶆湭姝ｅ紡鍖栥€?- `Mod Runtime`: Child 7 宸插畬鎴愰鐗?formal runtime seam锛屽寘鍚?source normalization/loading/parsing銆乤ctivation result handoff銆乧apability/dependency guard銆乤tomic rollback銆乵ain adapter锛屼互鍙?builtin/file/url/restore selected-mod activation 鎺ュ叆锛涘悗缁洿瀹屾暣鐨?capability/dependency 绯荤粺浠嶆槸 later hardening銆?- `StateSync Runtime`: Child 8 宸插畬鎴愰鐗?formal runtime seam锛屽寘鍚?canonical state contract銆乵andatory triggers銆乻yncState銆乭ydrate/normalize/app bridge/pre-save/mod rebuild/presentation input helpers锛屼互鍙?main.ts bridge helper 澶栫Щ銆?- `mod content loading / content-pack module`: 鐜版湁 content-pack 鍙敤锛屼絾灏氭湭瀹屽叏杩佸叆 mod-first loader/capability 浣撶郴銆?
### Missing / Not Formalized

- 瀹屾暣 `Minigame Runtime / Dispatch Interface`銆?- 瀹屾暣 `Presentation / Render Bridge` layout/schema 浠ｇ爜鍒囨崲銆?- 瀹屾暣 `Mod Runtime`銆乧apability銆乨ependency 浣撶郴锛汣hild 7 宸插畬鎴愰鐗?activation/startup seam锛屼絾鏇村畬鏁寸殑 capability/dependency policy銆乭ot reload銆乻andboxing 鍜?authoring tooling 浠嶉潪鏈懆鐩爣銆?- 鏇村畬鏁寸殑 `StateSync Runtime` hardening锛汣hild 8 宸插畬鎴愰鐗?canonical boundary锛屼絾 deeper save IO integration銆乺untime dispatch auto-commit integration 鍜?full legacy state migration 浠嶆槸鍚庣画宸ヤ綔銆?- 瀹屾暣 `mod schema` 涓庡叏閲?mod 鏁版嵁杩佺Щ銆?- `characterDefinitions -> RuntimeState.core` 鏀舵暃锛涘綋鍓嶆槑纭?deferred銆?
## Minimum Cooperative Data Structures

鏈懆涓嶈姹傚畾涔夋渶缁堝畬鏁寸増棰嗗煙妯″瀷锛屽彧瑕佹眰瀹氫箟鏈€灏忓彲鍗忓悓鏁版嵁缁撴瀯锛岃宸茶惤鍦?runtime 鑳藉叡浜?state/result/signal 杈圭晫骞剁户缁吋瀹圭幇鏈夊姛鑳姐€?
- `RuntimeState`: 鏈€灏?carrier 宸茶惤鍦帮紱`core` 褰撳墠鏄犲皠 application-layer `GameState`锛宍app` 鍙惡甯?Child 4 dispatch-critical app fields锛宍view` 鏆備负绌恒€?- `RuntimeRequest`: 缁х画浣滀负 shared dispatch/router 杈撳叆璇锋眰褰㈢姸銆?- `RuntimeResult`: 宸叉墿鍒?`RuntimeState`锛屽苟鎼哄甫 effects銆乶avigation銆乻cene銆乼askActions/taskSignals銆乼askUpdates銆乮nteractive 绛夊吋瀹硅緭鍑恒€?- `RuntimeInteractiveSignal`: 宸叉湁 `reenter-house` / `none` 鐨勬渶灏?signal銆?- `TaskRuntimeState`: Child 6 宸插畾涔?`instancesByTaskId`銆乣completedTaskIds`銆乣failedTaskIds`銆乣updatedAt`銆?- `TaskRuntimeResult`: Child 6 宸插畾涔夊苟杩斿洖 `state`銆乣taskUpdates`銆乣effects`銆乣signals`锛沞ffect 搴旂敤浠嶅睘浜?shared runtime settlement銆?- `Runtime <-> AppState bridge`: 褰撳墠閫氳繃 `RuntimeState.app` 鐨勬渶灏?pick 涓?main/app-shell 鍏煎妗ユ帴锛涗笉鎶婂畬鏁?AppState 骞跺叆 runtime銆?- `Interaction Runtime I/O`: covered launch/action 閫氳繃 core runtime seam 涓?`RuntimeResult` 杩斿洖銆?- `House Runtime integration seam I/O`: house enter/leave/dispatch 閫氳繃 core bridge 杩涘叆 legacy house adapter銆?- `Runtime Dispatch / Router input-output boundary`: 杈撳叆涓?`RuntimeState + RuntimeRequest`锛岃緭鍑轰负 `RuntimeResult`锛宻ettlement 鍙仛 additive compatibility銆?- `characterDefinitions deferred strategy`: `characterDefinitions` 缁х画鐙珛浼犻€掞紝涓嶅苟鍏?`RuntimeState.core`锛涙湭鏉ユ槸鍚﹀苟鍏ュ彈 weekly promotion gate 绾︽潫锛屽繀椤诲厛鏇存柊 child spec銆乧hild plan銆亀eekly plan銆?
## Weekly Non-Goals

- 涓嶈姹傛墍鏈夊姛鑳芥ā鍧楁湰鍛ㄥ叏閮ㄦ帴鍏?shared runtime銆?- 涓嶈姹傛墍鏈夌洰鏍囧瓙 runtime 鏈懆鍏ㄩ儴瀹屾垚浠ｇ爜绾ф娊绂汇€?- 涓嶈姹傛湰鍛ㄥ畬鎴愬叏閮ㄥ皬娓告垙缁熶竴璋冨害銆?- 涓嶈姹傛湰鍛ㄥ畬鎴?presenter/render 鐨勬渶缁?layout/schema 瑙ｈ€︼紱Child 5 棣栫増 presenter output bridge 宸插畬鎴愶紝浣嗕笉寰楁墿灞曞埌鍚庣画 layout renderer 宸ヤ綔銆?- 涓嶈姹傛湰鍛ㄥ畬鎴愬叏閲?mod 鏁版嵁杩佺Щ銆?- 涓嶈姹傛湰鍛ㄥ畬鎴?`characterDefinitions -> RuntimeState.core`銆?- 涓嶈姹傛湰鍛ㄥ畬鎴愬畬鏁?task UI銆乤uthoring DSL 鎴?mod 鑷畾涔?evaluator 鎻掍欢锛汣hild 6 鍙惤鍦伴鐗?Task Runtime contract/lifecycle/progression銆?- 涓嶈姹傛湰鍛ㄥ畬鎴愬畬鏁?mod loader / activation / capability / dependency 浣撶郴锛汣hild 7 宸插畬鎴愰鐗?activation/startup seam锛屽畬鏁?capability/dependency policy銆乻andboxing 鍜?hot reload 浠嶇暀缁欏悗缁瘎浼般€?- 涓嶈姹傛湰鍛ㄥ畾涔夋渶缁堝畬鏁寸増 mod schema銆?
## Weekly Deliverables

- Child 4 杈圭晫鏀舵暃鍚庣殑 spec / plan / weekly governance 鍚屾銆?- shared runtime 涓庡悇瀛?runtime 鐨勮竟鐣岃鏄庛€?- 鍏ㄩ儴鐩爣瀛?runtime 涓庡姛鑳芥ā鍧楃殑鎷嗗垎娓呭崟銆?- runtime 鎴愮啛搴﹀垎绫绘竻鍗曘€?- 鍚勬ā鍧楀綋鍓嶇姸鎬佸垎绫伙細宸叉媶鍒?/ 閮ㄥ垎鎷嗗垎 / 鍏煎妗ユ帴 / 鏈紑濮嬨€?- 褰撳墠宸叉媶 / 鏈媶妯″潡鍒楄〃銆?- call flow / runtime flow 鏇存柊鍏ュ彛璇存槑銆?- Child 8 StateSync Runtime 瀹屾垚璁板綍锛屼互鍙?Child 8 涔嬪悗鏄惁闇€瑕佹柊澧?child 鐨勫鐩樺垽鏂褰曘€?- visibility companion / five-core-artifact bundle 鍚屾缁撴灉銆?
## Weekly Acceptance Criteria

- engine / runtime / 瀛?runtime 鐨勮亴璐ｈ竟鐣屽彲浠ヨ鏄庣‘鎻忚堪銆?- 鍏ㄩ儴鐩爣瀛?runtime 涓庡姛鑳芥ā鍧楃殑娓呭崟銆佺姸鎬併€佸悗缁帹杩涢『搴忓凡鏄庣‘銆?- shared runtime state/result carrier 宸插紑濮嬫敹鏁涳紝骞朵笖 Child 6 宸茶ˉ涓?taskUpdates carrier銆?- interaction / house integration / runtime dispatch / task runtime 璺緞鏇存竻鏅般€?- `main.ts` 榛戠洅缂栨帓缁х画鏀剁缉銆?- 鐜版湁鍔熻兘淇濇寔鍏煎锛屼笉鍑虹幇鏄庢樉鍥為€€銆?- 鏂囨。銆乸lan銆乿isibility artifacts 鍚屾銆?- Child 7 宸叉寜鏃㈡湁 spec/plan 瀹屾垚锛屼笉鎵╁睍鍒?content assembly銆乻ave/load IO銆乬ameplay runtime execution銆乁I/menu/loading-screen銆乭ot reload 鎴?sandboxing 杈圭晫涔嬪锛汣hild 8 鏄笅涓€涓彲鎵ц child銆?
## Next-Week Unlock Conditions

- Child 6 宸插畬鎴愶紝骞跺凡閫氳繃 closeout sync 瑙ｉ攣骞跺畬鎴?Child 7銆?- Child 7 宸叉寮忓畾涔変负 Mod Runtime锛屽苟宸插畬鎴愰鐗?activation/startup seam銆?- Child 8 宸叉寮忓畾涔変负 StateSync Runtime锛屽苟鎴愪负褰撳墠 next executable child銆?- Child 8 涔嬪锛屽鏋?shared runtime carrier銆乺untime dispatch 杈圭晫銆佹ā鍧楁垚鐔熷害鍜屼簲浠芥牳蹇?artifact 鐘舵€佺ǔ瀹氾紝鍒欏厑璁歌瘎浼帮細
  - `characterDefinitions` 鏄惁杩涘叆 shared carrier
  - `minigame dispatch interface`
  - `presentation / render bridge`
  - Child 8 涔嬪悗鏄惁杩橀渶瑕佺户缁媶鍒嗘洿缁嗙矑搴︾殑 mod capability / dependency / state-sync follow-up
- 濡傛灉杈圭晫浠嶄笉绋冲畾锛屽垯涓嬪懆缁х画鍏堟敹鏁?runtime锛屼笉鎵╂柊妯″潡銆?- 浠讳綍 Child 8 涔嬪鐨勬彁鍓嶈В閿佹垨鏂板 child 閮藉繀椤诲厛鏇存柊锛?  - child spec
  - child plan
  - weekly plan

## Review Before New Child Rule

- Child 5 presenter/render decoupling is completed from its existing spec and plan.
- Child 6 Task Runtime has now been completed from its existing spec and plan.
- The required review was completed for Child 7, and Child 7 Mod Runtime has now completed its first activation/startup seam.
- The required review was completed for the state-boundary child, and Child 8 StateSync Runtime has now completed its first canonical boundary slice.
- The required review was completed for Child 9, and Child 9 Runtime Contract Hardening is now the next executable child.
- The required review was completed for Child 10, and Child 10 Runtime Ownerization Review And Baseline is now the formal post-Child-9 review child.
- Child 11 Sub-Runtime Ownerization Implementation now has a formal spec and plan, and weekly unlock sync records it as the next executable child rather than a locked candidate.
- Any new child after Child 11 must begin with a review of:
  - the five core weekly artifacts
  - current runtime/module maturity
  - current `src/main.ts` coupling
  - known compatibility bridges
  - unresolved promotion gates such as `characterDefinitions`
- Only after that review may the weekly controller decide which module deserves an independent child.
- A new child must then get its own spec and plan before production code work starts.
- Do not treat Child 7, Child 8, Child 9, or Child 10 authoring as permission to batch-create additional immature children just because their modules are listed in the weekly inventory.
## Weekly Constraints

- Execute concrete code changes from child plans only.
- Do not execute production code from the weekly visibility companion.
- Only one implementation child plan may be `in-progress` at a time unless this weekly plan is explicitly updated to allow parallel work.
- Do not start any dependent child plan before its prerequisite child plan is `completed`.
- If an active child's execution boundary, landing scope, or convergence target changes, update the governing spec, the active child plan, and this weekly plan before continuing implementation.
- If a new defer rule, promotion rule, or convergence condition affects more than one child plan, record it in this weekly plan before treating it as active governance.
- A dependency waiver is valid only if:
  - the waived dependency and affected queue item are named explicitly
  - the reason is recorded in both this weekly plan's `Progress Log` and the parent orchestration plan's `Progress Log`
  - the active child plan repeats that waiver in its own `Execution State` or `Progress Log` before implementation starts
- After each child-plan batch, update:
  - the child plan's `Execution State`
  - the child plan's `Progress Log`
  - this weekly plan's `Execution State`
  - this weekly plan's `Plan Status Board`
  - this weekly plan's `Progress Log`
  - `docs/superpowers/plans/2026-06-29-weekly-implementation-visibility-plan.md`
- Treat the child-plan, weekly orchestration plan, and weekly visibility companion as one synchronization set after every implementation batch; do not leave one of the three stale.
- If a child plan hits `P0` or `P1`, do not advance the queue until the blocker rule allows it.
- Before promoting or starting the next child, recheck the active child's exit condition and the next child's start condition against the latest child log plus this weekly plan.
- Runtime subsystem boundaries for active queue items are governed by `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`.

## Closeout Sync Rule

When an active child is marked `completed`, the completion batch must also perform a weekly closeout sync before the next child is treated as formally unlocked.

### Required Artifact Scope

The closeout sync must review and, when needed, update:

- `docs/superpowers/plans/2026-06-29-weekly-implementation-visibility-plan.md`
- `docs/superpowers/weekly/2026-06-29-weekly-review-index.md`
- `docs/superpowers/weekly/2026-06-29-weekly-module-map.md`
- `docs/superpowers/weekly/2026-06-29-weekly-call-flows.md`
- `docs/superpowers/weekly/2026-06-29-weekly-next-split-review.md`
- `docs/superpowers/weekly/2026-06-29-weekly-architecture-report.md`

### Required State Review

The closeout sync must check these terms across the required artifact scope:

- active child
- next executable child
- queue state
- `Next Step`
- resume point
- wording such as `next target`, `currently active`, `active next child`, `blocked`, `queued`, `unlocked`, or `completed`

Any artifact that still references the old queue state must be updated before queue promotion is recorded. If this review is not completed, the next child may be described as a candidate or pending target, but it must not be treated as formally unlocked in the weekly controller.

## Iteration Direction Governance

- Child 4 is completed on the approved minimum unified `RuntimeState` carrier. For this weekly iteration, `RuntimeState.core` remains limited to the current application-layer `GameState`; `characterDefinitions` remains outside `RuntimeState.core`.
- Child 4 was not required to converge onto Child 1 `src/core/contracts/core-state.ts` `CoreGameState`. That remains a separate future convergence decision, not part of the completed minimum landing.
- `characterDefinitions` may be promoted into `RuntimeState.core`, or a later child may promote runtime carriage beyond domain `GameState` toward Child 1 `CoreGameState`, only after the weekly promotion gate is satisfied and the resulting boundary update is written back into the affected child spec, the affected child plan, and this weekly plan before implementation starts.
- Promotion gate for those convergence steps:
  - shared dispatch coverage has expanded beyond the first minimum carrier slice
  - shared `RuntimeResult.interactive` signaling is already normalized enough that the extra convergence step is isolated and reviewable
  - the affected child plan and this weekly plan both state why the new convergence step is lower risk than keeping compatibility carriage in place
  - any affected downstream child start/exit conditions are updated before promotion
- Child 4 completion does not require either `characterDefinitions` inside `RuntimeState.core` or convergence onto Child 1 `CoreGameState`. Child 4 may complete on the minimum carrier slice if its own exit condition is satisfied.

## Weekly Visibility Companion

- Companion file:
  - `docs/superpowers/plans/2026-06-29-weekly-implementation-visibility-plan.md`
- Role:
  - force weekly visibility outputs so implementation progress also produces readable module boundaries and control-flow snapshots
- Rule:
  - do not mark this weekly orchestration plan `completed` until the companion file also satisfies its own acceptance gate

## Weekly Visibility Outputs

The weekly visibility companion governs the update process for five core weekly outputs:

- `docs/superpowers/weekly/2026-06-29-weekly-review-index.md`
- `docs/superpowers/weekly/2026-06-29-weekly-module-map.md`
- `docs/superpowers/weekly/2026-06-29-weekly-call-flows.md`
- `docs/superpowers/weekly/2026-06-29-weekly-next-split-review.md`
- `docs/superpowers/weekly/2026-06-29-weekly-architecture-report.md`

Merged ownership:

- `weekly-boundary-checklist` is folded into `weekly-module-map`
- `weekly-change-impact` is folded into `weekly-review-index`
- `weekly-module-backlog` is folded into `weekly-next-split-review`

The five core outputs are part of the weekly acceptance gate even though their detailed update rules live in the visibility companion. The three merged legacy files may remain as historical references only. They are no longer independent weekly acceptance artifacts, and closeout sync must not require maintaining them as separate deliverables.

## Plan Status Board

### Queue Closeout

- `docs/superpowers/plans/2026-06-29-save-migration-hardening-plan.md`
  - Role: Child 2 save normalization, loader/writer/migration, and selected-mod validation workstream
  - Resume point: `Completed`

- `docs/superpowers/plans/2026-06-29-navigation-time-event-runtime-extraction-plan.md`
  - Role: Child 3 navigation/time trigger entry, event activation, and scene handoff workstream
  - Resume point: `Completed`

- `docs/superpowers/plans/2026-06-29-interactive-runtime-integration-under-core-plan.md`
  - Role: Child 4
  - Resume point: `Completed on the approved minimum RuntimeState carrier slice.`

- `docs/superpowers/plans/2026-06-29-presenter-render-decoupling-plan.md`
  - Role: Child 5
  - Resume point: `Completed on the first presenter output bridge.`

- `docs/superpowers/plans/2026-06-30-task-runtime-plan.md`
  - Role: Child 6 Task Runtime
  - Resume point: `Completed on the first formal Task Runtime contract, lifecycle, and signal progression slice.`

- `docs/superpowers/plans/2026-06-30-mod-runtime-plan.md`
  - Role: Child 7 Mod Runtime
  - Resume point: `Completed on the first formal Mod Runtime activation/startup seam.`

- `docs/superpowers/plans/2026-07-01-runtime-contract-hardening-plan.md`
  - Role: Child 9 Runtime Contract Hardening
  - Resume point: `Completed. Child 9 closeout sync and verification are recorded.`

  - `docs/superpowers/plans/2026-07-01-runtime-ownerization-review-plan.md`
  - Role: Child 10 Runtime Ownerization Review And Baseline
  - Resume point: `Completed on the finalized owner/bridge baseline. Child 11 spec/plan authoring and unlock sync are now complete.`

### In Progress

- `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
  - Role: parent direction/spec inventory plan
  - Resume point: `Parent planning context remains available, but the active weekly executable child queue is now closed after Child 13.`

### Completed

- `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
  - Role: active queue controller
  - Resume point: `Completed. Child 13 closed the last active queued child in this weekly set; require a fresh weekly review before opening another child.`

- `docs/superpowers/plans/2026-06-29-weekly-implementation-visibility-plan.md`
  - Role: active weekly visibility companion
  - Resume point: `Completed. The five core artifacts now record Child 13 closeout and no active queued child remains.`

- `docs/superpowers/plans/2026-07-01-sub-runtime-ownerization-implementation-plan.md`
  - Role: Child 11 Sub-Runtime Ownerization Implementation
  - Resume point: `Completed. Covered shared follow-up, covered interactive, covered house, and covered settlement ownerization slices are all landed.`

- `docs/superpowers/plans/2026-07-01-ui-contract-reserve-plan.md`
  - Role: Child 12 UI Contract Reserve
  - Resume point: `Completed on the additive UI contract reserve landing. Child 13 unlock is now recorded separately.`

- `docs/superpowers/plans/2026-07-01-post-child-11-shared-dispatch-follow-up-reentry-convergence-audit-plan.md`
  - Role: Child 13 Post-Child-11 Shared Dispatch Follow-Up / Reentry Convergence Audit
  - Resume point: `Completed. Bucket A converged the remaining story-battle -> reenter-house follow-up; Bucket B and Bucket C were both empty in the remaining in-scope audit.`

### Not Started

- None currently recorded in the active weekly queue.

### Blocked

- None currently recorded in the active weekly queue.

### Needs Reconciliation

- `docs/superpowers/plans/2026-06-25-story-text-externalization.md`
  - Current file status: `unknown`
  - Reason: inherited progress does not yet reflect verified current repository state

- `docs/superpowers/plans/2026-06-25-zhuyuanzhang-pack-loader-unification.md`
  - Current file status: `unknown`
  - Reason: repository may contain already-landed partial work; verify before promoting into queue

- `docs/superpowers/plans/2026-06-25-zhuyuanzhang-pack-migration-phase1.md`
  - Current file status: `unknown`
  - Reason: legacy phase plan needs explicit reconciliation against current codebase reality

- `docs/superpowers/plans/2026-06-26-hardcoded-text-migration.md`
  - Current file status: `unknown`
  - Reason: not currently in the engine-runtime weekly queue

- `docs/superpowers/plans/2026-06-26-interactive-module-modularization-plan.md`
  - Current file status: `unknown`
  - Reason: high-level predecessor plan must be reconciled against engine-first sequencing before execution

- `docs/superpowers/plans/2026-06-26-interactive-module-modularization-task-plan.md`
  - Current file status: `not-started`
  - Reason: not active this week until engine child queue unlocks it

- `docs/superpowers/plans/2026-06-26-pack-content-migration-remainder.md`
  - Current file status: `unknown`
  - Reason: outside current weekly priority; reconcile only if reprioritized

- `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
  - Current file status: `in-progress`
  - Reason: orchestration parent is active and synchronized through Child 8 StateSync Runtime completion, but remains outside the executable child queue because concrete code work belongs to child plans

## Execution Queue

1. `docs/superpowers/plans/2026-06-29-engine-runtime-boundary-plan.md`
   - Queue status: `completed`
   - Depends on: approved design only
   - Start condition: satisfied
   - Exit condition:
      - child plan marked `completed`
      - first `src/core` bootstrap seam exists
      - runtime dispatch and effect-settlement seam exists
      - minimal `SaveEnvelope` seam exists
      - `main.ts` hands off into the core boundary

2. `docs/superpowers/plans/2026-06-29-save-migration-hardening-plan.md`
   - Queue status: `completed`
   - Primary subsystem boundary: `Save / Load Runtime`, `StateSync Runtime`
   - Depends on: Queue Item 1 completed
   - Start condition: Child 1 completed with the minimal `SaveEnvelope` seam in place
   - Exit condition:
      - loader, writer, and migration entrypoints exist on top of the Child 1 seam
      - selected-mod validation exists during load
      - mod-owned payload round-trip is covered
      - current save path remains readable during transition

3. `docs/superpowers/plans/2026-06-29-navigation-time-event-runtime-extraction-plan.md`
   - Queue status: `completed`
   - Primary subsystem boundary: `Navigation Runtime`, `Time Runtime`, `Event Runtime`, `Scene Runtime handoff seam`
   - Depends on: Queue Item 1 completed and Queue Item 2 completed, or a recorded Child 2 waiver in both parent and weekly logs
   - Start condition: Child 1 completed and Child 2 completed, or a recorded Child 2 waiver in both parent and weekly logs
   - Exit condition:
      - navigation and time entry flow through typed runtime requests
      - event candidate selection and activation are runtime-owned
      - at least one event path hands off into a scene seam
      - task action and task signal seams exist without full task-runtime extraction

4. `docs/superpowers/plans/2026-06-29-interactive-runtime-integration-under-core-plan.md`
   - Queue status: `completed`
   - Primary subsystem boundary: `Interaction Runtime`, `House Runtime integration seam`
   - Depends on: Queue Item 1 completed and Queue Item 3 completed
   - Start condition: satisfied
   - Exit condition:
     - interactive runtime is integrated under the shared runtime state/result path for the approved minimum carrier slice
     - `RuntimeResult.state` and `RuntimeResult.interactive` are unified for the approved Child 4 scope
     - `RuntimeState.core` remains the current domain `GameState` unless a later weekly promotion gate explicitly records a different convergence step first
     - `characterDefinitions` remains outside `RuntimeState.core` unless the weekly promotion gate is explicitly satisfied and recorded first
   - Promotion rule:
     - Child 4 completion does not require converging either `characterDefinitions` or Child 1 `CoreGameState` into the current minimum carrier

5. `docs/superpowers/plans/2026-06-29-presenter-render-decoupling-plan.md`
   - Queue status: `completed`
   - Primary subsystem boundary: `Presentation Bridge Runtime`
   - Depends on: Queue Item 1 completed and Queue Item 4 completed
   - Start condition: satisfied
   - Exit condition:
      - `app-render` consumes presenter output for stage/overlay/HUD selection
      - `src/main.ts` creates presenter output before rendering
      - gameplay selection helper imports moved out of `src/ui/app-render.ts`

6. `docs/superpowers/plans/2026-06-30-task-runtime-plan.md`
   - Queue status: `completed`
   - Primary subsystem boundary: `Task Runtime`
   - Depends on: Queue Item 1, Queue Item 3, Queue Item 4, and Queue Item 5 completed
   - Start condition: satisfied
   - Exit condition:
      - formal task contracts exist
      - minimum task lifecycle exists
      - signal-driven progression supports multiple active tasks
      - task runtime returns taskUpdates, effects, and signals without applying effects

7. `docs/superpowers/plans/2026-06-30-mod-runtime-plan.md`
   - Queue status: `completed`
   - Primary subsystem boundary: `Mod Runtime`
   - Depends on: Queue Item 1 completed, Queue Item 2 completed, Queue Item 5 completed, and Queue Item 6 completed
   - Start condition: satisfied after Child 6 closeout sync
   - Exit condition:
      - builtin, file, and url startup paths converge on a formal Mod Runtime seam
      - restore-time selected-mod activation runs through Mod Runtime
      - downstream startup consumes one unified activation handoff
      - Mod Runtime does not absorb content assembly, save/load IO, or gameplay execution ownership

8. `docs/superpowers/plans/2026-06-30-state-sync-runtime-plan.md`
   - Queue status: `completed`
   - Primary subsystem boundary: `StateSync Runtime`
   - Depends on: Queue Item 2 completed, Queue Item 4 completed, and Queue Items 5, 6, and 7 completed or explicitly deferred by updated weekly governance
   - Start condition: satisfied after Child 5, Child 6, and Child 7 were closed
   - Exit condition:
      - canonical runtime state authority is defined
      - runtime/app/save/presentation source-of-truth rules are explicit
      - mandatory sync triggers exist
      - StateSync does not absorb gameplay dispatch, save IO, mod activation, or presentation ownership

9. `docs/superpowers/plans/2026-07-01-runtime-contract-hardening-plan.md`
   - Queue status: `completed`
   - Primary subsystem boundary: `Shared Runtime contract layer`
   - Depends on: Queue Item 8 completed and a recorded post-Child-8 review
   - Start condition: satisfied after Child 8 closeout review created the Child 9 spec and plan
   - Exit condition:
      - typed `RuntimeRequest / Router` contract baseline exists
      - formal `Interactive / Minigame Dispatch` contract baseline exists
      - formal `Effect Settlement` contract baseline exists
      - minimum `House Runtime Request` contract baseline exists
      - Child 9 does not absorb runtime ownerization, UI/layout work, or resource planning

10. `docs/superpowers/plans/2026-07-01-runtime-ownerization-review-plan.md`
   - Queue status: `completed`
   - Primary subsystem boundary: `Runtime ownerization review / baseline governance`
   - Depends on: Queue Item 9 completed and Child 9 closeout sync recorded
   - Start condition: satisfied only after Child 9 completes and the queue promotes Child 10 as the active review child
   - Exit condition:
      - `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md` is finalized as the Child 11 unlock artifact
      - current runtime owner vs bridge status is explicit
      - bridge/adapter disposition is explicit
      - `src/main.ts` coupling for Child 11 is explicit
      - Child 11 batch order, forbidden changes, verification mapping, and residual debt are explicit
      - Child 10 does not absorb production ownerization, UI/layout work, or resource planning

11. `Child 11 Sub-Runtime Ownerization Implementation`
   - Queue status: `completed`
   - Primary subsystem boundary: `Shared dispatch convergence`, `Interaction Runtime ownerization`, `House Runtime ownerization`, `Effect Settlement alignment`
   - Depends on: Queue Item 10 completed, Child 10 closeout sync recorded, and Child 11 spec/plan authored against the Child 10 baseline
   - Start condition: satisfied; Child 10 is complete, Child 11 spec/plan now exist, and the weekly plan explicitly records Child 11 as unlocked
   - Exit condition:
        - covered shared runtime entry converges on dispatch/router ownership
        - covered interactive flows are runtime-owned with any retained adapter reduced to an explicitly justified thin seam
        - covered house flows are runtime-owned with any retained adapter reduced to an explicitly justified thin seam
        - effect settlement is aligned with the approved shared runtime path
        - Child 11 does not absorb boot/mod/save/presenter/UI/resource planning work
   - Current progress:
        - Task 1 completed on shared dispatch convergence for the covered story-battle reentry path
        - Task 4 covered settlement alignment is completed and Child 11 closeout is recorded

12. `docs/superpowers/plans/2026-07-01-ui-contract-reserve-plan.md`
   - Queue status: `completed`
   - Primary subsystem boundary: `Future UI Contract Reserve`, `Pack UI split-table reserve`, `Asset layering reserve`, `Executor / future Editor boundary reserve`
   - Depends on: Queue Item 11 completed and the recorded Child 11 closeout sync that promotes Child 12 into the executable queue
   - Start condition: satisfied; Child 11 is completed, weekly governance promoted Child 12 into the executable queue, and Child 12 implementation stayed additive without reopening current runtime ownerization scope
   - Exit condition:
      - formal future UI contract reserve exists under `src/domain/ui/**`
      - optional pack UI reserve fields and loader support exist without forcing current packs to migrate
      - asset layering rules are explicit and additive
      - current default runtime/render/layout-editor behavior remains unchanged
      - Child 12 does not enable Editor mode or absorb current renderer/runtime redesign

13. `docs/superpowers/plans/2026-07-01-post-child-11-shared-dispatch-follow-up-reentry-convergence-audit-plan.md`
   - Queue status: `not-started`
   - Primary subsystem boundary: `Shared dispatch convergence`, `Runtime-owned follow-up / reentry convergence audit`
   - Depends on: Queue Item 12 completed and a recorded later Child 13 review/unlock
   - Start condition: satisfied; Child 11 completed, Child 12 completed, weekly governance now explicitly unlocks Child 13, and the later review baseline already records Bucket A convergence work without reopening Child 11 completion scope
   - Exit condition:
      - every remaining reviewed path is classified into Bucket A, Bucket B, or Bucket C
      - every Bucket A path converges through shared dispatch
      - `src/main.ts` no longer owns Bucket A follow-up or reentry branching
      - no same-type Bucket A path is intentionally deferred
      - Child 13 does not become Child 11 backfill or new-boundary ownerization

## Verification Policy

- Child plans must record their own required verification commands.
- Weekly orchestration must summarize child verification outcomes in its `Progress Log`.
- For weekly orchestration doc-only updates, record:
  - `npm run lint:plans`

## Blocker Rules

- If the active child plan encounters `P0`, stop lower-priority queue execution and record the blocker here immediately.
- If the active child plan encounters `P1`, do not advance any dependent queue item.
- If a queue item lacks a child plan file, the next legal action is to author that child plan, not to start production code edits for its scope.
- If a legacy plan from `Needs Reconciliation` becomes urgent, reconcile its actual repository state before adding it to the active queue.

## Resume Rules

When resuming weekly work:

1. read this weekly plan's `Execution State`
2. read the latest weekly `Progress Log`
3. inspect the `In Progress` and `Not Started` groups in `Plan Status Board`
4. if no child implementation plan is `in-progress`, choose the first queue item whose dependencies are satisfied
   - A waived dependency counts as satisfied only after the waiver rule above is recorded in both required logs
5. then open that child plan and resume according to `plan-governance-spec`

If this weekly plan and a child plan disagree:

1. child plan actual state
2. latest weekly `Progress Log`
3. weekly status board
4. weekly execution queue

Then update this weekly plan before continuing code work.

## Acceptance Gate

Do not mark this weekly plan `completed` until:

- the intended weekly queue items are completed or explicitly deferred with recorded reason
- no unresolved `P0` or `P1` remains in weekly scope
- child plan states and weekly status board agree
- the weekly visibility companion is updated and satisfies its own acceptance gate
- closeout sync has reviewed the five core artifacts and corrected stale queue-state wording
- the latest weekly `Progress Log` records the weekly outcome

## Completion Checklist

- [x] Active child plan status synchronized back into this weekly plan
- [x] Weekly visibility companion synchronized
- [x] Queue order still reflects real dependency order
- [x] Blockers, if any, recorded
- [x] Weekly `Progress Log` updated
- [x] Weekly orchestration acceptance re-evaluated
- [x] Closeout sync rule and five-core-artifact scope recorded

