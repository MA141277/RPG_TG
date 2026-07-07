# Shell Thinning And Final Ownerization Queue

## Control Block

- queue_id: `queue.shell-thinning-and-final-ownerization`
- belongs_to_target: `target.project-complete-modularization`
- queue_status: `done`
- queue_class: `required`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- next_effect: `return-to-target-review`
- allowed_task_states:
  - `candidate`
  - `queued`
  - `active`
  - `blocked`
  - `done`
  - `dropped`
- blocked_by: []
- allowed_item_classifications:
  - `current-target-item`
  - `historical-residue`
- reject_item_classifications:
  - `content-pipeline-item`
  - `asset-pipeline-item`
  - `future-target-candidate`
  - `out-of-scope`
- promotion_gate:
  - `baseline_recheck_complete`
  - `task_dependencies_satisfied`
- closeout_gate:
  - `all_required_tasks_done_or_dropped`
  - `queue_closeout_note_written`
  - `verification_recorded`
- promote_next_queue_candidates:
  - `queue.state-sync-and-runtime-canonicalization`
- must_not_expand_into:
  - `reopening_engine_save_runtime_owner_line_work`
  - `broad_presenter_or_layout_redesign`
  - `creating_a_second_blueprint_target`

## Human Context

### Phase

- Parent phase:
  - `Phase 1: Runtime Closure`

### Queue Goal

Remove the remaining unjustified production business orchestration from `src/main.ts` after core production integration has closed.

### Boundary

This queue covers:

- fresh baseline reconciliation against the still-direct `gameState` / `ui` / `world` mutations left in `src/main.ts`
- ownerization of view-transition, travel-completion, auto-advance framing, and render-prepass residue that should no longer stay in the browser shell
- queue closeout records needed to roll this shell-thinning work back into the current modularization target

This queue does not cover:

- reopening engine/save/runtime owner-line work already closed by `core-production-integration`
- presenter/layout redesign with no modular ownership impact
- full state-sync canonicalization unless a new production blocker is proven
- creating a second Blueprint target

### Parent Target

- Target spec:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Target plan:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`

### Closed Review Record

- Status: `done`
- Last Updated: `2026-07-06`
- Historical Summary: `Render-prepass ownerization is now closed, and queue closeout concluded that the remaining direct main.ts writes are either shell-owned UI/event orchestration, startup-time assembly, or narrow compatibility residue rather than a live Phase 1 runtime blocker.`
- Closed Task:
  - `none`
- Handoff At Closure:
  - `Return to the current target plan and decide whether Phase 1 can hand off to Phase 2 queue promotion. Do not reopen state-sync-and-runtime-canonicalization unless a new production blocker is proven.`
- Verification:
  - `Targeted shell-thinning regressions, full npm test, and a closeout residue audit of src/main.ts.`
- Notes:
  - `startup-builder-ownerization remains only a candidate backlog item because current startup assembly does not yet prove a live modularization blocker on the covered production path.`

### Baseline Recheck

- Recheck result: `narrowed`
- Notes:
  - `Covered gameplay write-back still routes through commitRuntimeRequest() -> dispatchRuntimeRequest() on the audited runtime paths.`
  - `The remaining direct mutations in main.ts are concentrated in shell/view transitions, campaign travel and auto-advance framing, and render-prepass state preparation rather than core runtime settlement.`
  - `Known hotspot families include leave-city / city-3d enter-leave view switching, campaign travel completion framing, map auto-advance framing, and render-time ensureCityNpcPoolsForCurrentDay() write-back.`
  - `First extraction order is view transitions first because those blocks still inline world/ui owner lines without needing deeper runtime settlement, which makes them the cleanest proof point for shell thinning.`
  - `A direct runtime.variables write for leader-residence pending-character handoff was observed during the baseline, but it is not the first queue-opening hotspot and should be reconsidered only if it blocks a cleaner owner seam during later tasks.`
  - `Current legal queue direction: move unjustified business owner lines out of main.ts, but keep truly shell-owned browser scheduling, DOM wiring, input listeners, and render triggering in place.`

### Historical Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.shell-thinning-and-final-ownerization.baseline-reconcile` | `done` | `Confirm the narrowed shell residue baseline and lock the legal owner split for the queue.` | `none` | `Closed by confirming the first extraction order as view transitions -> travel/auto-advance -> render-prepass.` |
| `task.shell-thinning-and-final-ownerization.view-transition-ownerization` | `done` | `Ownerize direct leave-city and city-3d view transition mutations that still live in main.ts.` | `task.shell-thinning-and-final-ownerization.baseline-reconcile` | `Closed by introducing application/runtime/city-view-transition.ts and removing the covered inline world/ui mutation blocks from main.ts.` |
| `task.shell-thinning-and-final-ownerization.travel-and-auto-advance-ownerization` | `done` | `Ownerize campaign travel completion and map auto-advance framing that still mutates production state directly in main.ts.` | `task.shell-thinning-and-final-ownerization.view-transition-ownerization` | `Closed by extracting covered campaign-travel and map-auto-advance state transitions into dedicated application/runtime seams, leaving only shell scheduling, runtime commit, and completion handoff in main.ts.` |
| `task.shell-thinning-and-final-ownerization.render-prepass-ownerization` | `done` | `Remove render-time state mutation residue such as city-NPC pool refresh from the main render prepass.` | `task.shell-thinning-and-final-ownerization.travel-and-auto-advance-ownerization` | `Closed by extracting render-prepass write-back into application/runtime/render-prepass-state.ts and removing the direct ensureCityNpcPoolsForCurrentDay() app-state mutation from renderAppFrame().` |
| `task.shell-thinning-and-final-ownerization.queue-closeout` | `done` | `Re-evaluate whether main.ts is now thin enough to count as shell-owned for Phase 1.` | `task.shell-thinning-and-final-ownerization.render-prepass-ownerization` | `Closed after the residue audit found no current need to promote state-sync-and-runtime-canonicalization or startup-builder-ownerization.` |

### Task Definitions

#### `task.shell-thinning-and-final-ownerization.baseline-reconcile`

##### Control Block

- task_id: `task.shell-thinning-and-final-ownerization.baseline-reconcile`
- state: `done`
- task_type: `baseline-recheck`
- depends_on: []
- blocked_by: []
- priority: `high`
- scope:
  - `src/main.ts`
  - `src/application/runtime/main-runtime-orchestrator.ts`
  - `src/application/house/house-runtime.ts`
  - `src/core/runtime/house-runtime.ts`
- must_inspect:
  - `src/main.ts`
  - `src/application/runtime/main-runtime-orchestrator.ts`
  - `src/application/house/house-runtime.ts`
  - `src/core/runtime/house-runtime.ts`
- must_not_change:
  - `phase_1_owner_lines_already_closed_by_core-production-integration`
  - `queue_scope_beyond_shell_owned_main_ts_residue`
- done_when:
  - `the remaining main.ts residue is classified into legal shell work versus unjustified business orchestration`
  - `the first justified extraction order is recorded`
- verify_with:
  - `fresh_source_baseline_recheck`
- if_blocked:
  - `record blocker in queue`
  - `do not silently widen task`
- promote_next_if_done: `task.shell-thinning-and-final-ownerization.view-transition-ownerization`
- drift_check_required: `true`
- drift_forbidden_expansions:
  - `state_sync_canonicalization_rewrite`
  - `presenter_redesign`
- drift_escalate_to:
  - `queue`
- stop_if:
  - `the residue cannot be cleanly classified without opening a new queue topic`

##### Human Context

- Purpose:
  - `Freeze the queue's starting truth against the current codebase and classify the remaining main.ts residue into legal shell ownership versus unjustified business orchestration.`
- Failure mode:
  - `If the residue cannot be cleanly classified, mark the task blocked and record the ambiguous boundary rather than widening the queue blindly.`

#### `task.shell-thinning-and-final-ownerization.view-transition-ownerization`

##### Control Block

- task_id: `task.shell-thinning-and-final-ownerization.view-transition-ownerization`
- state: `done`
- task_type: `execution`
- depends_on:
  - `task.shell-thinning-and-final-ownerization.baseline-reconcile`
- blocked_by: []
- priority: `high`
- scope:
  - `src/main.ts`
  - `src/application/runtime/**`
  - `src/application/house/house-runtime.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `src/main.ts`
  - `src/application/runtime/**`
  - `src/application/house/house-runtime.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `travel_auto_advance_scope`
  - `render_prepass_scope`
- done_when:
  - `covered city view transitions no longer rely on ad hoc main.ts business mutation blocks`
  - `one explicit owner seam exists for the covered leave-city and city-3d transitions`
- verify_with:
  - `targeted_source_path_checks`
  - `npm test`
- if_blocked:
  - `record blocker in queue`
  - `do not silently widen task`
- promote_next_if_done: `task.shell-thinning-and-final-ownerization.travel-and-auto-advance-ownerization`
- drift_check_required: `true`
- drift_forbidden_expansions:
  - `new_helper_branches_left_in_main_ts`
  - `runtime_settlement_redesign`
- drift_escalate_to:
  - `queue`
- stop_if:
  - `covered_transition_cleanup requires a different queue topic`

##### Human Context

- Purpose:
  - `Remove direct production state/view transition branches from main.ts where leaving city or entering/leaving city-3d still mutates gameState and UI state inline.`
- Failure mode:
  - `Do not replace one ad hoc main.ts branch with another helper in main.ts; move the owner line to a real application/runtime seam or stop and redesign.`

#### `task.shell-thinning-and-final-ownerization.travel-and-auto-advance-ownerization`

##### Control Block

- task_id: `task.shell-thinning-and-final-ownerization.travel-and-auto-advance-ownerization`
- state: `done`
- task_type: `execution`
- depends_on:
  - `task.shell-thinning-and-final-ownerization.view-transition-ownerization`
- blocked_by: []
- priority: `high`
- scope:
  - `src/main.ts`
  - `src/application/runtime/navigation-time-follow-up.ts`
  - `src/application/house/house-runtime.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `src/main.ts`
  - `src/application/runtime/navigation-time-follow-up.ts`
  - `src/application/house/house-runtime.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `render_prepass_scope`
  - `phase_1_engine_save_runtime_owner_lines`
- done_when:
  - `covered travel-completion and auto-advance residue no longer require main.ts to own business state transitions beyond browser scheduling concerns`
  - `travel and auto-advance owner lines move to explicit seams where justified`
- verify_with:
  - `targeted_source_path_checks`
  - `npm test`
- if_blocked:
  - `record blocker in queue`
  - `do not silently widen task`
- promote_next_if_done: `task.shell-thinning-and-final-ownerization.render-prepass-ownerization`
- drift_check_required: `true`
- drift_forbidden_expansions:
  - `animation_polish_scope_creep`
  - `fake_abstraction_for_pure_dom_timing`
- drift_escalate_to:
  - `queue`
- stop_if:
  - `travel_cleanup requires a broader runtime canonicalization queue`

##### Human Context

- Purpose:
  - `Ownerize the remaining production state mutations around campaign travel completion and map auto-advance framing that still live inline in main.ts.`
- Failure mode:
  - `If a branch is truly only animation scheduling or DOM timing, keep it in shell scope and record why instead of forcing fake abstraction.`

#### `task.shell-thinning-and-final-ownerization.render-prepass-ownerization`

##### Control Block

- task_id: `task.shell-thinning-and-final-ownerization.render-prepass-ownerization`
- state: `done`
- task_type: `execution`
- depends_on:
  - `task.shell-thinning-and-final-ownerization.travel-and-auto-advance-ownerization`
- blocked_by: []
- priority: `high`
- scope:
  - `src/main.ts`
  - `src/application/presenter/**`
  - `src/application/runtime/**`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `src/main.ts`
  - `src/application/presenter/**`
  - `src/application/runtime/**`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `broad_presenter_redesign`
  - `new_queue_topics_outside_render_prepass_residue`
- done_when:
  - `main render flow no longer quietly mutates production state in places that should be explicit runtime or pre-render owner lines`
  - `covered render-prepass residue is either ownerized or narrowly justified`
- verify_with:
  - `targeted_source_path_checks`
  - `npm test`
- if_blocked:
  - `record blocker in queue`
  - `do not silently widen task`
- promote_next_if_done: `task.shell-thinning-and-final-ownerization.queue-closeout`
- drift_check_required: `true`
- drift_forbidden_expansions:
  - `presenter_architecture_rewrite`
  - `phase_2_contribution_work`
- drift_escalate_to:
  - `queue`
- stop_if:
  - `render_prepass_cleanup proves a different queue should be promoted instead`

##### Human Context

- Purpose:
  - `Eliminate render-time state mutation residue in main.ts, especially write-back that still happens as part of the render prepass rather than explicit runtime or pre-render orchestration.`
- Failure mode:
  - `Do not turn this into a broad presenter redesign queue; only move residue that affects modular ownership claims.`

#### `task.shell-thinning-and-final-ownerization.queue-closeout`

##### Control Block

- task_id: `task.shell-thinning-and-final-ownerization.queue-closeout`
- state: `done`
- task_type: `closeout`
- depends_on:
  - `task.shell-thinning-and-final-ownerization.render-prepass-ownerization`
- blocked_by: []
- priority: `high`
- scope:
  - `src/main.ts`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/project-progress.md`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `src/main.ts`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/project-progress.md`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `historical_queue_truth`
  - `queue_promotion_without_evidence`
- done_when:
  - `the queue can close with a coherent shell-owned main.ts story or open one narrowly justified later queue with explicit residue`
  - `pointer updates for target-level artifacts are recorded`
- verify_with:
  - `document_consistency_check`
  - `targeted_source_path_and_regression_evidence`
- if_blocked:
  - `record blocker in queue`
  - `do not silently widen task`
- promote_next_if_done: `none`
- drift_check_required: `true`
- drift_forbidden_expansions:
  - `vague_main_ts_is_smaller_now_closeout`
  - `silent_reopening_of_phase_1`
- drift_escalate_to:
  - `target`
- stop_if:
  - `a new blocker proves the queue cannot honestly close`

##### Human Context

- Purpose:
  - `Decide whether main.ts is now thin enough to count as shell-owned for Phase 1 and record any narrow residue that still belongs in a later queue.`
- Failure mode:
  - `Do not close with a vague "main.ts is smaller now" claim; either prove the remaining shell boundary or record the exact blocker.`

## Historical Handoff Note

- Task ID:
  - `none`
- Recorded handoff at closure:
  - `Queue is closed. Return control to the target plan and promote a new queue only if a stronger current-period modularization need is proven.`
- Recorded expected output:
  - `A target-level decision on the next queue family, not more shell-thinning work by default.`

## Historical Candidate Notes

- `task.shell-thinning-and-final-ownerization.startup-builder-ownerization`
  - State:
    - `candidate`
  - Reason:
    - `May be useful later if startup app-state builders in main.ts still prove to be unjustified production owners after the first shell-thinning tasks land.`
  - Promote when:
    - `baseline-reconcile or queue-closeout proves startup app-state assembly still blocks the shell-owned main.ts claim.`
  - Reject when:
    - `later reviews keep startup assembly classified as accepted shell-side or compatibility residue.`
  - Required evidence:
    - `main_ts_source_audit`
    - `target_level_promotion_note`

- `task.shell-thinning-and-final-ownerization.passive-ui-reset-aggregation`
  - State:
    - `candidate`
  - Reason:
    - `May be useful later if scattered modal/dialogue/menu reset logic remains duplicated across main.ts after the main covered owner lines are removed.`
  - Promote when:
    - `covered ownerization tasks prove that duplicated UI reset framing is still hiding business flow in main.ts rather than harmless shell cleanup.`
  - Reject when:
    - `the residue remains harmless shell cleanup with no modular ownership impact.`
  - Required evidence:
    - `main_ts_source_audit`
    - `queue_or_target_promotion_note`

## Closeout Decision

- queue_id: `queue.shell-thinning-and-final-ownerization`
- closeout_status: `done`
- verification_status: `passed`
- residue_remaining: `yes`
- residue_classification:
  - `accepted-history`
  - `narrow-compatibility-residue`
- next_queue_recommendation: `none`
- promotion_justified: `false`
- evidence:
  - `targeted_shell_thinning_regressions`
  - `npm test`
  - `main.ts_residue_audit`
  - `target_pointer_sync`

## State Transition Rules

1. Queue tasks move through `candidate -> queued -> active -> done/blocked/dropped`.
2. Only one task in this queue may be `active` at a time.
3. Follow-up cleanup that does not change modular ownership claims should become later work, not be silently appended here.
4. Closed queue truth must remain historical; this document must not be rewritten to imply that the queue is still active.

## Progress Log

- 2026-07-06
  - Summary: `Created shell-thinning-and-final-ownerization as the next formal Phase 1 queue after core-production-integration closed without needing a separate state-sync canonicalization queue.`
  - Verification: `Queue creation based on the closed runtime ownership audit`
  - Next at that time: `Start task.shell-thinning-and-final-ownerization.baseline-reconcile.`
- 2026-07-06
  - Summary: `Closed baseline-reconcile after confirming that the remaining shell residue is best attacked in this order: leave-city / city-3d view transitions first, then travel and auto-advance framing, then any still-live render-prepass write-back.`
  - Verification: `Fresh main.ts hotspot recheck plus scope comparison against main-runtime-orchestrator`
  - Next at that time: `Start task.shell-thinning-and-final-ownerization.view-transition-ownerization.`
- 2026-07-06
  - Summary: `Closed view-transition-ownerization by extracting the covered leave-city / enter-city-3d / leave-city-3d state cleanup into application/runtime/city-view-transition.ts and removing those inline world/ui mutation blocks from main.ts.`
  - Verification: `npm test`
  - Next at that time: `Start task.shell-thinning-and-final-ownerization.travel-and-auto-advance-ownerization.`
- 2026-07-06
  - Summary: `Within travel-and-auto-advance-ownerization, extracted the covered campaign travel start/completion state transitions into application/runtime/campaign-travel-transition.ts and removed those inline app-state blocks from startCampaignTravel().`
  - Verification: `Targeted build:test + shell-thinning/campaign-travel regression`
  - Next: `Continue on the remaining map auto-advance owner lines in main.ts.`
- 2026-07-06
  - Summary: `Closed travel-and-auto-advance-ownerization by extracting the covered map auto-advance start/snapshot state transitions into application/runtime/map-auto-advance-transition.ts, leaving only shell scheduling, runtime commit, and completion handoff in main.ts.`
  - Verification: `npm test`
  - Next at that time: `Start task.shell-thinning-and-final-ownerization.render-prepass-ownerization.`
- 2026-07-06
  - Summary: `Closed render-prepass-ownerization by extracting the city-NPC refresh write-back from renderAppFrame() into application/runtime/render-prepass-state.ts, leaving the render prepass as an explicit seam instead of a quiet main.ts mutation block.`
  - Verification: `npm test`
  - Next: `Run queue-closeout and decide whether any later Phase 1 promotion is still justified.`
- 2026-07-06
  - Summary: `Closed shell-thinning-and-final-ownerization after the residue audit found that the remaining direct main.ts writes are shell-owned UI/event cleanup, startup-time assembly, or a narrow leader-residence compatibility handoff rather than a live runtime/state canonicalization blocker.`
  - Verification: `main.ts residue audit plus npm test`
  - Next: `Return to the target plan and decide whether Phase 1 can now hand off to Phase 2 contribution-closure work.`
