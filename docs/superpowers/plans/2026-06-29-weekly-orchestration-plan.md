# Weekly Orchestration Plan

> **For agentic workers:** Use this file as the queue-level controller for the week's implementation plans. Execute concrete code work from child plans only. Update both the child plan and this weekly orchestration plan after each work batch.

**Goal:** Govern this week's repository plan execution so child plans run in the correct order, active work is visible, pending work is queued, and interrupted work can resume from a single weekly source of truth.

**Architecture:** Use one weekly parent plan to orchestrate plan sequencing and one weekly visibility companion to force de-black-box outputs. Keep concrete implementation in child plans. Reconcile inherited legacy plans separately from the active weekly queue so historical ambiguity does not corrupt the execution order of current work.

**Tech Stack:** Markdown plan governance, TypeScript repository tasks, `npm run lint:plans`, child-plan verification commands

## Execution State

- Status: `in-progress`
- Last Updated: `2026-07-01`
- Current Focus: `Child 10 Runtime Ownerization Review And Baseline is completed, Child 11 spec/plan authoring plus weekly unlock sync are complete, Child 11 is now the next executable ownerization child, Child 12 remains the immediate UI layout/interface-reserve follow-up, and Child 13 stays locked behind Child 12.`
- Next Step: `Start Child 11 from docs/superpowers/plans/2026-07-01-sub-runtime-ownerization-implementation-plan.md Task 1 Step 1. Keep characterDefinitions outside RuntimeState.core unless a later weekly promotion explicitly reopens that convergence step through updated spec/child/weekly docs first, and keep Child 12 ahead of Child 13 in execution order.`
- Verification: `Child 11 authoring + unlock sync: npm run lint:plans`
- Notes: `This weekly plan governs current execution order. Child 4 is complete on the approved minimum RuntimeState carrier, Child 5 is complete on the presenter output bridge, Child 6 is complete on the formal Task Runtime contract/lifecycle/progression slice, Child 7 is complete on the formal Mod Runtime activation/startup seam, Child 8 is complete on the first formal StateSync Runtime canonical boundary, Child 9 is complete on the shared contract-hardening baseline, Child 10 is now complete on the runtime ownerization review/baseline artifact, and Child 11 is now formally unlocked because its spec/plan exist against the finalized baseline and weekly unlock sync is recorded. The older default-mod migration placeholder is superseded by the broader Child 7 Mod Runtime scope. characterDefinitions remains outside RuntimeState.core unless a later weekly promotion gate updates the child spec, child plan, baseline, and this weekly plan first. Several older plans still have inherited or uncertain state and remain in reconciliation scope until individually reviewed.`

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

---

## Weekly Goal

This weekly plan has one governing narrative: move the project toward a `mod-first` game framework by shrinking `src/main.ts` black-box orchestration and stabilizing reusable engine, runtime, state, module, and presentation seams.

### Long-Term Direction

- 将当前项目逐步改造成以 mod 为主的游戏框架。
- 让不同游戏内容通过统一的数据、引擎、runtime、模块接口接入。
- 降低 `src/main.ts` 与单体业务流程的黑盒耦合。
- 为后续内容迁移、小游戏统一接入、任务系统、事件系统、UI/presenter 解耦提供稳定架构骨架。

### This Week Scope

- 继续按 engine-first / mod-first 路线推进 `src/core` 架构拆分。
- 本周重点不是完成所有功能模块接入，而是完成核心模块的边界收敛、协同骨架和兼容接点。
- 本周需要覆盖所有目标子 runtime 与功能模块的盘点、分类、职责划分、边界说明和后续接入顺序。
- 优先收敛 Shared Runtime / Runtime Dispatch / Router / Interaction Runtime / House Runtime integration seam / Shared Runtime State carrier。
- 保持当前功能兼容现有状态，不要求本周完成全量迁移。
- 通过计划文档、五份核心 weekly artifact、边界说明降低项目黑盒程度。
- 当前队列口径：Child 4 已完成，Child 5 已完成 presenter/render decoupling，Child 6 已完成 Task Runtime 首版抽离，Child 7 已完成 Mod Runtime 首版抽离，Child 8 已完成 StateSync Runtime 首版 canonical boundary，Child 9 已正式定义为 Runtime Contract Hardening，Child 10 已正式定义为 Runtime Ownerization Review And Baseline，Child 11 已作为锁定中的 ownerization 实施 child 编排进队列；Child 11 之后如需新增 child，仍必须先复盘再决定是否拆出独立 spec + plan。

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

本清单是本周必须覆盖和编排的拆分视图，不代表本周必须完成所有代码级抽离。Child 6 closeout 后，Task Runtime 已从“待正式化”提升为已落地的首版 runtime seam。

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
- `task module` (`Mission` 仅作为内容层或展示层命名)
- `event module`
- `scene / dialogue module`
- `UI / layout / presenter module`
- `mod content loading / content-pack module`
- `mod loader / activation / capability / dependency module`

## Runtime Maturity Classification

### Landed

- `Engine / Boot Runtime`: Child 1 已落地第一条 selected-mod bootstrap seam，但还不是完整 mod activation。
- `Shared Runtime`: Child 1/3/4 已落地最小 shared runtime skeleton；Child 6 继续把 taskUpdates 接入 RuntimeResult。
- `Runtime Dispatch / Router`: Child 1 已落地，Child 4 已扩到最小 `RuntimeState` carrier。
- `Effect Settlement Runtime`: Child 1 已落地，Child 4 已接入 `RuntimeState`；Child 6 只返回 task effects，不应用 effects。
- `Save / Load Runtime`: Child 1/2 已落地 envelope、migration、loader、writer、selected-mod validation。
- `Navigation Runtime`: Child 3 已落地 typed navigation entry seam。
- `Time Runtime`: Child 3 已落地 day/time trigger seam。
- `Event Runtime`: Child 3 已落地 candidate selection and activation seam。
- `Scene Runtime`: Child 3 已落地 first event-to-scene handoff seam。
- `Interaction Runtime`: Child 4 已落地 covered interaction entry/action seam 与最小 shared result path。
- `House Runtime integration seam`: Child 4 已落地 core-owned bridge 与 legacy adapter。
- `Task Runtime`: Child 6 已落地首版正式 contracts、minimum lifecycle、duplicate active guard、terminal failed/completed guard、signal-driven progression、taskUpdates/effects/signals result seam。
- `Presentation / Render Bridge`: Child 5 已完成首版 presenter output bridge。

### Partially Landed / Compatibility Bridge

- `House Runtime`: core seam 已有，但具体 house modules 仍主要在 `src/application/house*` 通过 legacy adapter 执行。
- `Minigame Runtime / Dispatch Interface`: covered activity-qte/city-begging/story-battle 路径已有 bridge，统一 dispatch interface 尚未正式化。
- `Task Runtime`: Child 6 是首版最小可协同 runtime，尚未接入完整 task authoring DSL、UI/presenter 或 mod 自定义 evaluator 插件。
- `Presentation / Render Bridge`: Child 5 已完成首版 presenter output bridge；当前为 provisional bridge，layout renderer 仍未正式化。
- `Mod Runtime`: Child 7 已完成首版 formal runtime seam，包含 source normalization/loading/parsing、activation result handoff、capability/dependency guard、atomic rollback、main adapter，以及 builtin/file/url/restore selected-mod activation 接入；后续更完整的 capability/dependency 系统仍是 later hardening。
- `StateSync Runtime`: Child 8 已完成首版 formal runtime seam，包含 canonical state contract、mandatory triggers、syncState、hydrate/normalize/app bridge/pre-save/mod rebuild/presentation input helpers，以及 main.ts bridge helper 外移。
- `mod content loading / content-pack module`: 现有 content-pack 可用，但尚未完全迁入 mod-first loader/capability 体系。

### Missing / Not Formalized

- 完整 `Minigame Runtime / Dispatch Interface`。
- 完整 `Presentation / Render Bridge` layout/schema 代码切换。
- 完整 `Mod Runtime`、capability、dependency 体系；Child 7 已完成首版 activation/startup seam，但更完整的 capability/dependency policy、hot reload、sandboxing 和 authoring tooling 仍非本周目标。
- 更完整的 `StateSync Runtime` hardening；Child 8 已完成首版 canonical boundary，但 deeper save IO integration、runtime dispatch auto-commit integration 和 full legacy state migration 仍是后续工作。
- 完整 `mod schema` 与全量 mod 数据迁移。
- `characterDefinitions -> RuntimeState.core` 收敛；当前明确 deferred。

## Minimum Cooperative Data Structures

本周不要求定义最终完整版领域模型，只要求定义最小可协同数据结构，让已落地 runtime 能共享 state/result/signal 边界并继续兼容现有功能。

- `RuntimeState`: 最小 carrier 已落地；`core` 当前映射 application-layer `GameState`，`app` 只携带 Child 4 dispatch-critical app fields，`view` 暂为空。
- `RuntimeRequest`: 继续作为 shared dispatch/router 输入请求形状。
- `RuntimeResult`: 已扩到 `RuntimeState`，并携带 effects、navigation、scene、taskActions/taskSignals、taskUpdates、interactive 等兼容输出。
- `RuntimeInteractiveSignal`: 已有 `reenter-house` / `none` 的最小 signal。
- `TaskRuntimeState`: Child 6 已定义 `instancesByTaskId`、`completedTaskIds`、`failedTaskIds`、`updatedAt`。
- `TaskRuntimeResult`: Child 6 已定义并返回 `state`、`taskUpdates`、`effects`、`signals`；effect 应用仍属于 shared runtime settlement。
- `Runtime <-> AppState bridge`: 当前通过 `RuntimeState.app` 的最小 pick 与 main/app-shell 兼容桥接；不把完整 AppState 并入 runtime。
- `Interaction Runtime I/O`: covered launch/action 通过 core runtime seam 与 `RuntimeResult` 返回。
- `House Runtime integration seam I/O`: house enter/leave/dispatch 通过 core bridge 进入 legacy house adapter。
- `Runtime Dispatch / Router input-output boundary`: 输入为 `RuntimeState + RuntimeRequest`，输出为 `RuntimeResult`，settlement 只做 additive compatibility。
- `characterDefinitions deferred strategy`: `characterDefinitions` 继续独立传递，不并入 `RuntimeState.core`；未来是否并入受 weekly promotion gate 约束，必须先更新 child spec、child plan、weekly plan。

## Weekly Non-Goals

- 不要求所有功能模块本周全部接入 shared runtime。
- 不要求所有目标子 runtime 本周全部完成代码级抽离。
- 不要求本周完成全部小游戏统一调度。
- 不要求本周完成 presenter/render 的最终 layout/schema 解耦；Child 5 首版 presenter output bridge 已完成，但不得扩展到后续 layout renderer 工作。
- 不要求本周完成全量 mod 数据迁移。
- 不要求本周完成 `characterDefinitions -> RuntimeState.core`。
- 不要求本周完成完整 task UI、authoring DSL 或 mod 自定义 evaluator 插件；Child 6 只落地首版 Task Runtime contract/lifecycle/progression。
- 不要求本周完成完整 mod loader / activation / capability / dependency 体系；Child 7 已完成首版 activation/startup seam，完整 capability/dependency policy、sandboxing 和 hot reload 仍留给后续评估。
- 不要求本周定义最终完整版 mod schema。

## Weekly Deliverables

- Child 4 边界收敛后的 spec / plan / weekly governance 同步。
- shared runtime 与各子 runtime 的边界说明。
- 全部目标子 runtime 与功能模块的拆分清单。
- runtime 成熟度分类清单。
- 各模块当前状态分类：已拆分 / 部分拆分 / 兼容桥接 / 未开始。
- 当前已拆 / 未拆模块列表。
- call flow / runtime flow 更新入口说明。
- Child 8 StateSync Runtime 完成记录，以及 Child 8 之后是否需要新增 child 的复盘判断记录。
- visibility companion / five-core-artifact bundle 同步结果。

## Weekly Acceptance Criteria

- engine / runtime / 子 runtime 的职责边界可以被明确描述。
- 全部目标子 runtime 与功能模块的清单、状态、后续推进顺序已明确。
- shared runtime state/result carrier 已开始收敛，并且 Child 6 已补上 taskUpdates carrier。
- interaction / house integration / runtime dispatch / task runtime 路径更清晰。
- `main.ts` 黑盒编排继续收缩。
- 现有功能保持兼容，不出现明显回退。
- 文档、plan、visibility artifacts 同步。
- Child 7 已按既有 spec/plan 完成，不扩展到 content assembly、save/load IO、gameplay runtime execution、UI/menu/loading-screen、hot reload 或 sandboxing 边界之外；Child 8 是下一个可执行 child。

## Next-Week Unlock Conditions

- Child 6 已完成，并已通过 closeout sync 解锁并完成 Child 7。
- Child 7 已正式定义为 Mod Runtime，并已完成首版 activation/startup seam。
- Child 8 已正式定义为 StateSync Runtime，并成为当前 next executable child。
- Child 8 之外，如果 shared runtime carrier、runtime dispatch 边界、模块成熟度和五份核心 artifact 状态稳定，则允许评估：
  - `characterDefinitions` 是否进入 shared carrier
  - `minigame dispatch interface`
  - `presentation / render bridge`
  - Child 8 之后是否还需要继续拆分更细粒度的 mod capability / dependency / state-sync follow-up
- 如果边界仍不稳定，则下周继续先收敛 runtime，不扩新模块。
- 任何 Child 8 之外的提前解锁或新增 child 都必须先更新：
  - child spec
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

### Completed

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

- `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
  - Role: active queue controller
  - Resume point: `Child 11 is unlocked and not started. Resume from its own plan Task 1 Step 1.`

- `docs/superpowers/plans/2026-06-29-weekly-implementation-visibility-plan.md`
  - Role: active weekly visibility companion
  - Resume point: `Refresh the five core artifacts after Child 11 unlock sync or after the first Child 11 implementation batch lands.`

### Not Started

- `docs/superpowers/plans/2026-07-01-sub-runtime-ownerization-implementation-plan.md`
  - Role: Child 11 Sub-Runtime Ownerization Implementation
  - Resume point: `Start Task 1 Step 1 on shared dispatch convergence.`

### Future Candidates

- `docs/superpowers/plans/2026-07-01-ui-contract-reserve-plan.md`
  - Role: Child 12 UI Contract Reserve
  - Resume point: `Queued immediately behind Child 11 as the UI layout/interface-reserve child. Complete it first, then unlock Child 13.`

- `docs/superpowers/plans/2026-07-01-post-child-11-shared-dispatch-follow-up-reentry-convergence-audit-plan.md`
  - Role: Child 13 Post-Child-11 Shared Dispatch Follow-Up / Reentry Convergence Audit
  - Resume point: `Locked behind Child 12. Unlock only after Child 11 completes, Child 12 completes, and a later weekly review confirms Bucket A convergence work exists.`

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
   - Queue status: `not-started`
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
   - Queue status: `not-started`
   - Primary subsystem boundary: `Shared dispatch convergence`, `Interaction Runtime ownerization`, `House Runtime ownerization`, `Effect Settlement alignment`
   - Depends on: Queue Item 10 completed, Child 10 closeout sync recorded, and Child 11 spec/plan authored against the Child 10 baseline
   - Start condition: satisfied; Child 10 is complete, Child 11 spec/plan now exist, and the weekly plan explicitly records Child 11 as unlocked
   - Exit condition:
        - covered shared runtime entry converges on dispatch/router ownership
        - covered interactive flows are runtime-owned with any retained adapter reduced to an explicitly justified thin seam
        - covered house flows are runtime-owned with any retained adapter reduced to an explicitly justified thin seam
        - effect settlement is aligned with the approved shared runtime path
        - Child 11 does not absorb boot/mod/save/presenter/UI/resource planning work

12. `docs/superpowers/plans/2026-07-01-ui-contract-reserve-plan.md`
   - Queue status: `future-candidate`
   - Primary subsystem boundary: `Future UI Contract Reserve`, `Pack UI split-table reserve`, `Asset layering reserve`, `Executor / future Editor boundary reserve`
   - Depends on: Queue Item 11 completed and a recorded post-Child-11 review/unlock
   - Start condition: Child 11 completed, weekly governance explicitly unlocks Child 12, and Child 12 implementation stays additive without reopening current runtime ownerization scope
   - Exit condition:
      - formal future UI contract reserve exists under `src/domain/ui/**`
      - optional pack UI reserve fields and loader support exist without forcing current packs to migrate
      - asset layering rules are explicit and additive
      - current default runtime/render/layout-editor behavior remains unchanged
      - Child 12 does not enable Editor mode or absorb current renderer/runtime redesign

13. `docs/superpowers/plans/2026-07-01-post-child-11-shared-dispatch-follow-up-reentry-convergence-audit-plan.md`
   - Queue status: `future-candidate`
   - Primary subsystem boundary: `Shared dispatch convergence`, `Runtime-owned follow-up / reentry convergence audit`
   - Depends on: Queue Item 12 completed and a recorded later Child 13 review/unlock
   - Start condition: Child 11 completed, Child 12 completed, weekly governance explicitly unlocks Child 13, and the later review confirms Bucket A convergence work exists without reopening Child 11 completion scope
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
