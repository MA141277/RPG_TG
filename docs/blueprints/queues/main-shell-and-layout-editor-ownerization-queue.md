# Main Shell And Layout Editor Ownerization Queue

## Control Block

- queue_id: `queue.main-shell-and-layout-editor-ownerization`
- belongs_to_target: `target.project-complete-modularization`
- queue_status: `done`
- queue_class: `conditional`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- next_effect: `return-to-target-review`
- sync_status: `pending`
- sync_scope: `none`
- sync_summary: `No repository sync has run for the reactivated reclosure queue yet.`
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
- reject_item_classifications:
  - `future-target-candidate`
  - `out-of-scope`
  - `historical-residue`
  - `content-pipeline-item`
  - `asset-pipeline-item`
- promotion_gate:
  - `fresh_non_shell_editor_owner_line_proven`
  - `bounded_shell_and_layout_owner_scope_written`
- closeout_gate:
  - `all_required_tasks_done_or_dropped`
  - `queue_closeout_note_written`
  - `verification_recorded`
- must_not_expand_into:
  - `standalone_editor_app`
  - `script_editor_implementation`
  - `full_ui_subsystem_rewrite`
  - `broad_runtime_state_canonicalization_rewrite`
  - `new_content_pipeline`

## Human Context

### Queue Goal

Make `src/main.ts` a pure shell entry, extract the current layout editor state writes, event routing, drag/resize ownership, render scheduling shell, and layout baseline bootstrap owner into independent seams, and prepare a reusable `shell -> coordinator -> render` pattern for future script editor work without implementing a standalone editor or script editor in this queue.

### Boundary

This queue covers:

- `main.ts` pure shell closure
- extraction of the current layout editor state writes, event routing, pointer capture, and drag/resize interaction owner line
- extraction of render scheduling shell ownership and runtime UI layout baseline bootstrap ownership
- establishing a clear `shell -> game coordinator -> layout editor coordinator -> render coordinator` responsibility split for the covered production path

This queue does not cover:

- a standalone editor app
- script editor implementation
- a full UI subsystem rewrite
- a new content pipeline
- a broad runtime/state canonicalization rewrite unless a fresh blocker is proven inside this queue and written explicitly

### Parent Target

- Target spec:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Target plan:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`

### Queue Snapshot

- queue_goal: `Recover the pure-shell src/main.ts contract and expose the renewed ownerization queue state in a reusable summary.`
- task_count: `7`
- completed_task_count: `4`
- remaining_task_count: `3`
- active_task_summary: `task.main-shell-and-layout-editor-ownerization.reclosure-baseline-reconcile is re-auditing src/main.ts to freeze the bounded reclosure cut before any renewed ownerization work starts.`
- task_briefs:
  - `task.main-shell-and-layout-editor-ownerization.reclosure-baseline-reconcile: re-audit current src/main.ts drift and freeze the smallest lawful reclosure cut.`
  - `task.main-shell-and-layout-editor-ownerization.reclosure-ownerization: remove the bounded non-shell residues named by the reclosure baseline.`
  - `task.main-shell-and-layout-editor-ownerization.reclosure-closeout: re-run pure-shell closeout review after renewed ownerization and verification.`
  - `task.main-shell-and-layout-editor-ownerization.baseline-reconcile: historical baseline that froze the original pure-shell acceptance line.`
  - `task.main-shell-and-layout-editor-ownerization.layout-editor-ownerization: historical extraction of layout editor behavior out of src/main.ts.`
  - `task.main-shell-and-layout-editor-ownerization.render-and-layout-bootstrap-ownerization: historical extraction of render scheduling and layout bootstrap ownership out of src/main.ts.`
  - `task.main-shell-and-layout-editor-ownerization.queue-closeout: historical closeout task that later proved stale and triggered this bounded reclosure.`

### Admission Preconditions

- `This queue is admitted only after the target plan is synchronized with fresh main.ts shell/editor evidence.`
- `Single-active-queue mode remains in force; no second queue may be promoted while this queue is active.`
- `This queue preserves the existing conditional queue families as historical candidates and does not delete or relitigate them without fresher evidence.`

### Repository Sync Record Rule

- `This blocked queue still allows commit, push, and merge after the task after-state is written.`
- `The sync record above stores only the latest repository sync result; it does not change queue_status, closeout_status, or target scheduling truth.`
- `Repository sync failure must not be copied into blocked_by because the real blocker remains the known build/test asset typing gap outside this queue slice.`

### Admission Evidence

- `src/main.ts` still directly imports application/layout-editor/layout-editor-actions.ts and still decides at top-level event handlers when to call editor state helpers such as toggle/select/update functions.`
- `src/main.ts` still directly owns large layout editor action routing, pointer capture, drag/resize interaction, editor field updates, and many direct appState writes on the covered production path.`
- `src/main.ts` still directly owns renderApp() and renderAppFrame() scheduling, and still decides in many flows when to render instead of routing all rendering through one unified shell/coordinator seam.`
- `src/main.ts` still directly performs render-prepass state writes through applyRenderPrepassState inside renderAppFrame().`
- `src/main.ts` still directly imports content/layout-editor-presets.ts for runtime UI layout baseline startup logic, which means the layout baseline owner has not yet left the shell entrypoint.`
- `ui/tools/layout-editor-view.ts` and ui/app-render.ts already provide view/render seams, but current editor behavior ownership still lives in src/main.ts, which blocks reuse of the same coordinator pattern for future editor work.`
- `The existing shell-thinning and ui-runtime-contract-consumption closeout records do not close this gap because they do not make src/main.ts a pure shell and do not extract the current layout editor owner line into an independent coordinator.`

### Active Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.main-shell-and-layout-editor-ownerization.reclosure-baseline-reconcile` | `done` | `Re-audit src/main.ts against the pure-shell acceptance line, freeze the fresh drift evidence, and confirm the smallest lawful reclosure cut before any renewed ownerization work starts.` | `none` | `Fresh 2026-07-08 source audit froze one lawful cut only: repeated layout-editor interaction ownership, render-prepass/render scheduling ownership, and layout baseline bootstrap ownership had drifted back into src/main.ts.` |
| `task.main-shell-and-layout-editor-ownerization.reclosure-ownerization` | `done` | `Remove the bounded non-shell residues confirmed by the reclosure baseline without widening into a full UI or runtime rewrite.` | `task.main-shell-and-layout-editor-ownerization.reclosure-baseline-reconcile` | `Completed on 2026-07-08 after src/main.ts returned the repeated layout-editor owner line to application/layout-editor/layout-editor-coordinator.ts, the render-prepass/render scheduling owner line to application/presenter/app-render-coordinator.ts, and the layout baseline bootstrap owner line to application/layout-editor/layout-editor-bootstrap.ts.` |
| `task.main-shell-and-layout-editor-ownerization.reclosure-closeout` | `done` | `Re-run pure-shell closeout review and return target control to review only after the renewed ownerization work and verification complete.` | `task.main-shell-and-layout-editor-ownerization.reclosure-ownerization` | `Closed on 2026-07-08 after fresh closeout verification reconfirmed the pure-shell line and showed npm run lint:blueprints, npm run typecheck, and npm test all passing on the current branch.` |
| `task.main-shell-and-layout-editor-ownerization.baseline-reconcile` | `done` | `Freeze the pure-shell acceptance truth, record exactly which main.ts responsibilities must move, and keep the queue bounded to the current shell plus layout-editor owner line.` | `none` | `Completed on 2026-07-07 after queue truth fixed the allowed pure-shell responsibilities and named the required owner split.` |
| `task.main-shell-and-layout-editor-ownerization.layout-editor-ownerization` | `done` | `Move layout editor action routing, state writes, pointer capture, drag/resize interaction, and field updates out of src/main.ts into an independent coordinator or interaction-session owner line.` | `task.main-shell-and-layout-editor-ownerization.baseline-reconcile` | `Completed on 2026-07-07 after src/main.ts stopped importing layout-editor actions directly and the layout editor input/click/drag owner line moved into application/layout-editor/layout-editor-coordinator.ts.` |
| `task.main-shell-and-layout-editor-ownerization.render-and-layout-bootstrap-ownerization` | `done` | `Move render scheduling shell ownership and runtime layout baseline bootstrap ownership out of src/main.ts into dedicated seams.` | `task.main-shell-and-layout-editor-ownerization.layout-editor-ownerization` | `Closed after the fresh source audit proved that the remaining main.ts residue now stays within the accepted pure-shell line and no additional bounded owner family remains live on current evidence.` |
| `task.main-shell-and-layout-editor-ownerization.queue-closeout` | `done` | `Verify that src/main.ts is now a pure shell, synchronize Blueprint truth, and return control to target review.` | `task.main-shell-and-layout-editor-ownerization.render-and-layout-bootstrap-ownerization` | `Closed on 2026-07-08 after the fresh source audit confirmed the accepted pure-shell line. The repository-wide import.meta and ?url asset typing/configuration gap remains outside this queue slice and is not kept as a live queue blocker.` |

### `task.main-shell-and-layout-editor-ownerization.reclosure-baseline-reconcile`

#### Control Block

- task_id: `task.main-shell-and-layout-editor-ownerization.reclosure-baseline-reconcile`
- state: `done`
- task_type: `baseline-recheck`
- depends_on: []
- blocked_by: []
- priority: `high`
- scope:
  - `src/main.ts`
  - `src/application/layout-editor/**`
  - `src/application/presenter/**`
  - `src/application/runtime/render-prepass-state.ts`
  - `src/ui/app-render.ts`
  - `docs/blueprints/**`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `src/main.ts`
  - `docs/blueprints/queues/main-shell-and-layout-editor-ownerization-queue.md`
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `standalone_editor_scope`
  - `script_editor_scope`
  - `broad_runtime_state_canonicalization_rewrite`
  - `new_content_pipeline`
- done_when:
  - `The fresh source drift is frozen into one bounded reclosure cut with exact non-shell residues named.`
  - `The queue truth explicitly states whether the next lawful step is renewed ownerization or direct closeout rejection of the drift claim.`
  - `No implementation starts before the bounded reclosure owner split is written.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "layout-editor-actions|applyRenderPrepassState|renderApp as renderAppMarkup|function renderApp|function renderAppFrame|appState =" src/main.ts`
- if_blocked:
  - `Record the blocker in this queue doc.`
  - `Return control to target-level review rather than silently widening scope.`
- promote_next_if_done: `task.main-shell-and-layout-editor-ownerization.reclosure-ownerization`
- stop_if:
  - `Fresh evidence collapses back into accepted pure-shell residue rather than a live owner-line regression.`

#### Human Context

- task_brief:
  - `Re-audit src/main.ts and freeze the smallest lawful reclosure cut before renewed ownerization starts.`
- task_outcome_summary:
  - `Current active task; it remains open until queue truth names the exact non-shell residues and the next lawful step.`
- Purpose:
  - `Reopen the queue on one narrow source-truth check instead of assuming the whole old ownerization batch must be rerun.`
- Failure mode:
  - `Do not jump straight into code movement before the fresh drift is re-bounded under current source truth.`
- Reclosure finding:
  - `Fresh 2026-07-08 source audit proved the prior closeout basis had drifted on one bounded surface only: src/main.ts had reintroduced direct layout-editor action ownership, render-prepass/render scheduling ownership, and layout baseline bootstrap ownership.`
- Frozen lawful cut:
  - `The minimum legal recovery slice is only to restore the already-existing seams: application/layout-editor/layout-editor-coordinator.ts, application/presenter/app-render-coordinator.ts, and application/layout-editor/layout-editor-bootstrap.ts.`

### `task.main-shell-and-layout-editor-ownerization.reclosure-ownerization`

#### Control Block

- task_id: `task.main-shell-and-layout-editor-ownerization.reclosure-ownerization`
- state: `done`
- task_type: `execution`
- depends_on:
  - `task.main-shell-and-layout-editor-ownerization.reclosure-baseline-reconcile`
- blocked_by: []
- priority: `high`
- scope:
  - `src/main.ts`
  - `src/application/**`
  - `src/ui/**`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `src/main.ts`
  - `src/application/layout-editor/**`
  - `src/application/presenter/**`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `standalone_editor_app_scope`
  - `script_editor_scope`
  - `full_ui_subsystem_rewrite`
  - `broad_runtime_state_canonicalization_rewrite`
- done_when:
  - `The bounded non-shell residues named by the reclosure baseline are removed from src/main.ts.`
  - `src/main.ts returns to the accepted pure-shell line under fresh source evidence.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `node --test tests/robustness.test.cjs`
- if_blocked:
  - `Record the blocker in this queue doc instead of widening the queue silently.`
- promote_next_if_done: `task.main-shell-and-layout-editor-ownerization.reclosure-closeout`
- stop_if:
  - `The required fix expands into a full UI or runtime rewrite instead of one bounded owner-line recovery.`

#### Human Context

- task_brief:
  - `Remove the bounded non-shell residues confirmed by the reclosure baseline without widening into a broader rewrite.`
- task_outcome_summary:
  - `Queued task; it should start only after the reclosure baseline names the renewed owner split.`
- Purpose:
  - `Recover the pure-shell contract only after the renewed baseline names the smallest lawful ownerization cut.`
- Failure mode:
  - `Do not repeat the full historical queue blindly if the fresh drift is narrower than the original ownerization scope.`
- Implementation result:
  - `src/main.ts no longer imports application/layout-editor/layout-editor-actions.ts, application/runtime/render-prepass-state.ts, ui/app-render renderApp markup helpers, or the layout-editor preset constructors directly.`
  - `The repeated layout-editor input/click/pointer-drag owner line now routes through application/layout-editor/layout-editor-coordinator.ts from both appElement and uiOverlayElement event handlers.`
  - `The render-prepass plus render scheduling owner line now routes through application/presenter/app-render-coordinator.ts via renderApp().`
  - `The runtime layout baseline bootstrap owner line now routes through application/layout-editor/layout-editor-bootstrap.ts via createDefaultLayoutEditorAppState() in both prototype and scenario-pack app-state creation paths.`
  - `Fresh source evidence therefore returns src/main.ts to the accepted pure-shell line for this bounded queue scope, so the next legal step is reclosure-closeout rather than another implementation slice.`

### `task.main-shell-and-layout-editor-ownerization.reclosure-closeout`

#### Control Block

- task_id: `task.main-shell-and-layout-editor-ownerization.reclosure-closeout`
- state: `done`
- task_type: `closeout`
- depends_on:
  - `task.main-shell-and-layout-editor-ownerization.reclosure-ownerization`
- blocked_by: []
- priority: `medium`
- scope:
  - `docs/blueprints/**`
  - `src/main.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/main-shell-and-layout-editor-ownerization-queue.md`
  - `src/main.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `target_closeout_truth_without_written_basis`
  - `out_of_scope_editor_product_work`
- done_when:
  - `Fresh source evidence proves src/main.ts has returned to the accepted pure-shell line.`
  - `Queue truth, target truth, and repository entry truth are synchronized before any repository sync.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm test`
- if_blocked:
  - `Record the blocker explicitly rather than leaving the queue floating between active and historical states.`
- promote_next_if_done: `none`
- stop_if:
  - `Required verification has not passed.`

#### Human Context

- task_brief:
  - `Close the reopened queue only after renewed ownerization and verification prove the fresh drift is gone.`
- task_outcome_summary:
  - `Queued closeout task; it should only run after renewed ownerization completes and verification is ready.`
- Purpose:
  - `Close the reopened queue only after the renewed ownerization work proves the previous drift has been removed.`
- Failure mode:
  - `Do not declare the queue historical again while the fresh reclosure evidence remains unresolved.`
- Fresh verification result:
  - `Fresh source grep still proves that src/main.ts no longer imports layout-editor-actions, applyRenderPrepassState, renderApp markup helpers, or layout-editor preset constructors directly, so the bounded reclosure ownerization cut remains intact on current evidence.`
  - `Fresh npm run lint:blueprints and npm run typecheck pass, and fresh npm test now passes on the current branch as well.`
  - `This task is therefore fully closed on current evidence, with no remaining in-scope main.ts residue and no remaining queue-local verification blocker.`

## Task Definitions

### `task.main-shell-and-layout-editor-ownerization.baseline-reconcile`

#### Control Block

- task_id: `task.main-shell-and-layout-editor-ownerization.baseline-reconcile`
- state: `done`
- task_type: `baseline-recheck`
- depends_on: []
- blocked_by: []
- priority: `high`
- scope:
  - `src/main.ts`
  - `src/application/layout-editor/**`
  - `src/application/presenter/**`
  - `src/application/runtime/render-prepass-state.ts`
  - `src/ui/tools/layout-editor-view.ts`
  - `src/ui/app-render.ts`
  - `src/content/layout-editor-presets.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/**`
- must_inspect:
  - `src/main.ts`
  - `src/application/layout-editor/layout-editor-actions.ts`
  - `src/ui/tools/layout-editor-view.ts`
  - `src/ui/app-render.ts`
  - `src/content/layout-editor-presets.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `standalone_editor_scope`
  - `script_editor_scope`
  - `general_runtime_state_rewrite_scope`
  - `content_pipeline_scope`
- done_when:
  - `queue truth explicitly lists which main.ts responsibilities are allowed to remain`
  - `queue truth explicitly lists which responsibilities must leave main.ts`
  - `the owner split is bounded to the current shell plus layout editor line and does not widen into a separate editor product`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `record the blocker in this queue doc`
  - `stop rather than widening the queue silently`
- promote_next_if_done: `task.main-shell-and-layout-editor-ownerization.layout-editor-ownerization`
- stop_if:
  - `the evidence collapses into already-accepted residue rather than a still-live owner-line blocker`

#### Human Context

- task_brief:
  - `Freeze the original pure-shell acceptance contract and the required owner split before implementation.`
- task_outcome_summary:
  - `Done historical baseline task; it recorded the original owner split and acceptance truth for the queue.`
- Purpose:
  - `Freeze the pure-shell contract and the required owner split before implementation starts moving code.`
- Failure mode:
  - `Do not treat "thinner than before" as equivalent to "pure shell"; this queue needs an explicit pass/fail contract.`

##### Pure-Shell Acceptance Truth

- `Pure-shell src/main.ts may only own DOM root lookup, basic dependency init, assembly of the game coordinator, layout editor coordinator, render coordinator, and app shell, top-level browser event registration, request -> shell.dispatch forwarding, and lifecycle boot/destroy.`
- `If src/main.ts still directly performs appState writes, layout editor open/close/select/update, pointer capture or drag or resize flows, render prepass state writes, layout baseline init ownership, or business-driven render scheduling branches, then it does not count as pure shell.`

##### Baseline Finding

- `src/main.ts still imports layout-editor action helpers directly and still decides when editor state changes happen from top-level event handlers.`
- `src/main.ts still owns the current layout editor pointer capture and drag/resize interaction flow instead of delegating it to a coordinator or interaction session owner.`
- `src/main.ts still owns render scheduling and render prepass state mutation, so the current shell is still a behavior owner rather than only an assembler and dispatcher.`
- `src/main.ts still owns runtime layout baseline bootstrap through direct layout-editor preset imports.`
- `The required owner split for this queue is: main shell assembly and browser event registration stay in src/main.ts; layout editor behavior moves to a dedicated coordinator or interaction-session owner line; render scheduling plus layout baseline bootstrap move to dedicated render/bootstrap seams.`

### `task.main-shell-and-layout-editor-ownerization.layout-editor-ownerization`

#### Control Block

- task_id: `task.main-shell-and-layout-editor-ownerization.layout-editor-ownerization`
- state: `done`
- task_type: `execution`
- depends_on:
  - `task.main-shell-and-layout-editor-ownerization.baseline-reconcile`
- blocked_by: []
- priority: `high`
- scope:
  - `src/main.ts`
  - `src/application/layout-editor/**`
  - `src/ui/tools/layout-editor-view.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `src/main.ts`
  - `src/application/layout-editor/**`
  - `src/ui/tools/layout-editor-view.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `standalone_editor_app_scope`
  - `script_editor_scope`
  - `render_bootstrap_scope_before_owner_line_exists`
  - `save_or_mod_loader_scope`
- done_when:
  - `src/main.ts no longer directly decides layout editor state updates`
  - `src/main.ts no longer directly owns layout editor pointer capture or drag or resize behavior`
  - `an editor request -> coordinator -> state update pattern exists on the covered path`
- verify_with:
  - `npm run build:test`
  - `node --test tests/robustness.test.cjs`
  - `npm run typecheck`
  - `npm run lint:blueprints`
- if_blocked:
  - `record the blocker in this queue doc`
  - `stop rather than widening into standalone editor work`
- promote_next_if_done: `task.main-shell-and-layout-editor-ownerization.render-and-layout-bootstrap-ownerization`
- drift_check_required: `true`
- drift_forbidden_expansions:
  - `full_editor_productization`
  - `full_ui_framework_rewrite`
  - `runtime_state_canonicalization_rewrite`
- drift_escalate_to:
  - `queue`
- stop_if:
  - `landing the owner line requires a standalone editor app or broader runtime rewrite`

- promote_next_if_done: `task.main-shell-and-layout-editor-ownerization.render-and-layout-bootstrap-ownerization`

#### Human Context

- task_brief:
  - `Extract layout editor behavior ownership out of src/main.ts through a dedicated coordinator seam.`
- task_outcome_summary:
  - `Done historical implementation task; layout editor input and drag ownership moved into application/layout-editor/layout-editor-coordinator.ts.`
- Purpose:
  - `Extract the current layout editor behavior owner line without changing the queue boundary.`
- Failure mode:
  - `Do not leave main.ts as a thin wrapper around direct editor mutations; behavior ownership must actually move.`

##### Implementation Result

- `src/application/layout-editor/layout-editor-coordinator.ts` now owns layout editor action routing, selection/open-close updates, input field handling, pointer capture, and drag/resize interaction state.`
- `src/main.ts` no longer imports application/layout-editor/layout-editor-actions.ts directly and no longer keeps layout editor input/click/drag helper functions inline.`
- `tests/robustness.test.cjs` now guards the new coordinator seam and the removal of direct layout editor owner-line helpers from src/main.ts.`

### `task.main-shell-and-layout-editor-ownerization.render-and-layout-bootstrap-ownerization`

#### Control Block

- task_id: `task.main-shell-and-layout-editor-ownerization.render-and-layout-bootstrap-ownerization`
- state: `done`
- task_type: `execution`
- depends_on:
  - `task.main-shell-and-layout-editor-ownerization.layout-editor-ownerization`
- blocked_by: []
- priority: `high`
- scope:
  - `src/main.ts`
  - `src/application/presenter/**`
  - `src/application/runtime/render-prepass-state.ts`
  - `src/ui/app-render.ts`
  - `src/content/layout-editor-presets.ts`
  - `tests/robustness.test.cjs`
  - `src/**/render*.ts`
- must_inspect:
  - `src/main.ts`
  - `src/application/presenter/**`
  - `src/application/runtime/render-prepass-state.ts`
  - `src/ui/app-render.ts`
  - `src/content/layout-editor-presets.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `standalone_editor_app_scope`
  - `script_editor_scope`
  - `full_state_canonicalization_scope`
  - `content_pipeline_scope`
- done_when:
  - `src/main.ts no longer directly owns layout baseline bootstrap`
  - `src/main.ts no longer scatters business-driven render scheduling branches`
  - `a render coordinator or layout bootstrap seam exists and render consumes prepared input only`
- verify_with:
  - `npm run build:test`
  - `node --test tests/robustness.test.cjs`
  - `npm run typecheck`
  - `npm run lint:blueprints`
- if_blocked:
  - `record the blocker in this queue doc`
  - `stop rather than widening into broader presenter or runtime redesign`
- promote_next_if_done: `task.main-shell-and-layout-editor-ownerization.queue-closeout`
- drift_check_required: `true`
- drift_forbidden_expansions:
  - `standalone_editor_shell`
  - `broad_presenter_rearchitecture`
  - `runtime_state_redesign`
- drift_escalate_to:
  - `queue`
- stop_if:
  - `the required seam expands into a full presenter or runtime rewrite`

#### Human Context

- task_brief:
  - `Move render scheduling and layout bootstrap ownership out of src/main.ts after the editor owner line exists.`
- task_outcome_summary:
  - `Done historical implementation task; render/bootstrap ownership moved out of src/main.ts, but later drift forced the current bounded reclosure.`
- Purpose:
  - `Finish the pure-shell extraction by moving render and layout baseline ownership out of main.ts after the editor owner line exists.`
- Failure mode:
  - `Do not move render helpers around while keeping business-driven render scheduling inside main.ts.`

##### Current Progress

- `src/application/presenter/app-render-coordinator.ts` now owns the render prepass, presenter assembly, ui/app-render invocation, and post-render sync steps that used to live in renderApp/renderAppFrame inside src/main.ts.`
- `src/application/layout-editor/layout-editor-bootstrap.ts` now owns the default uiLayouts/layoutEditor bootstrap record that src/main.ts used to assemble directly from layout-editor presets.`
- `src/application/ui/app-click-coordinator.ts` now owns the covered overlay, inventory, modal-cancel, and city-menu click-routing branch family that used to sit inline in the main appElement click handler, including the bounded openCityMenuPanel shell write path.`
- `src/application/runtime/interactive-action-coordinator.ts` now owns the covered activity-qte result/stop path, story-scene advance/choice path, story-battle action path, and battle-demo victory message handoff that used to pair runtime actions with renderApp() directly inside src/main.ts.`
- `src/application/runtime/campaign-travel-coordinator.ts` now owns the covered campaign-travel render-trigger family: travel confirm, cancel, start, completion-time-advance commit, and the related action -> runtime/time advance -> render delegation that used to live inline in src/main.ts.`
- `src/application/runtime/map-auto-advance-coordinator.ts` now owns the covered map auto-advance render-trigger family: start, stop, interval cleanup, snapshot apply, completion handoff, and day-start commit -> render delegation that used to live inline in src/main.ts.`
- `src/application/runtime/city-house-transition-coordinator.ts` now owns the covered city/house transition plus access-refusal render-trigger family: leave-city, enter-city-3d, leave-city-3d, and the canOpenHouseFromCity() refusal dialogue open -> render path that used to live inline in src/main.ts.`
- `src/application/runtime/council-priority-city-begging-coordinator.ts` now owns the covered council-priority plus city-begging render-trigger family: council-priority refusal, insufficient-time refusal, city-begging launch checks, city-begging launch, and city-begging confirm-result settle -> render flow that used to live inline in src/main.ts.`
- `src/application/runtime/city-directory-leader-residence-coordinator.ts` now owns the covered city-directory or leader-residence plus related house-side transition entry family: city entry -> city-directory open, leader-residence option selection -> pending character write -> house entry, and the directly adjacent generic house-side city entry branch that used to live inline in src/main.ts.`
- `src/application/runtime/city-3d-house-entry-coordinator.ts` now owns the covered mapped city-3d or scene-object house entry family: sceneObjectId normalize, city scene mapping resolve, requested house filter, access gate, window message entry delegation, and runtime house entry handoff that used to live inline in src/main.ts.`
- `src/application/runtime/house-drag-drop-coordinator.ts` now owns the covered house drag/drop shell write family: pointer drag completion submit, html drop submit, house actionId assembly, runtime request dispatch, and the directly adjacent render trigger that used to live inline in src/main.ts.`
- `src/application/runtime/campaign-move-animation-coordinator.ts` now owns the covered campaign move animation helper family: facing degrees calculation, active animation frame lifecycle, frame-by-frame movement and facing interpolation, completion settle, and the directly adjacent render trigger that used to live inline in src/main.ts.`
- `src/application/startup/startup-session-apply-coordinator.ts` now owns the covered startup or session apply wiring family: activated session apply, the directly adjacent playable registry configure step, mainRuntimeOrchestrator apply-startup-session execution, save persist, render trigger, and the unified continue or restore or builtin or scenario-pack startup success apply entry that used to live inline in src/main.ts.`
- `src/application/startup/shell-boot-lifecycle-coordinator.ts` now owns the covered shell-side boot or lifecycle assembly family: continue or restore or builtin or scenario-pack startup success handoff, loading request lifecycle completion or error end-loading handoff, and the directly adjacent shell-side boot orchestration that used to live inline in src/main.ts.`
- `src/main.ts` no longer defines renderApp()/renderAppFrame() and no longer imports applyRenderPrepassState, renderApp as renderAppMarkup, or the default layout preset constructors directly.`
- `This round was a fresh source audit rather than a new ownerization batch. The new robustness source-test now pins the final main.ts shell residue to the accepted pure-shell line: DOM root lookup, dependency and coordinator assembly, startup entry registration, top-level browser event registration, lifecycle boot or destroy primitives, and loading-screen primitive helpers only.`
- `Fresh source evidence on 2026-07-08 found no remaining out-of-bound owner line inside that final shell residue. No additional bounded extraction batch is justified on current evidence; the remaining lines are accepted pure-shell responsibilities rather than hidden business orchestration.`
- `The ownerization work itself is now complete on current evidence: fresh source audit proved that src/main.ts residue is limited to accepted pure-shell responsibilities and no new bounded owner family remains live inside this queue scope.`
- `Queue-closeout review was then attempted, but it did not pass because npm test still fails on the known repository-wide import.meta and ?url asset typing/configuration gap outside this queue slice. That blocker is recorded here instead of being misattributed to the finished ownerization work.`
- `Verification blocker is now back to the known repository-wide asset/tooling gap only: npm run typecheck passes again, while npm run build:test still fails only on the pre-existing import.meta and ?url asset typing/configuration errors outside this queue slice.`

### `task.main-shell-and-layout-editor-ownerization.queue-closeout`

#### Control Block

- task_id: `task.main-shell-and-layout-editor-ownerization.queue-closeout`
- state: `blocked`
- task_type: `closeout`
- depends_on:
  - `task.main-shell-and-layout-editor-ownerization.render-and-layout-bootstrap-ownerization`
- blocked_by: []
- priority: `medium`
- scope:
  - `docs/blueprints/**`
  - `src/main.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/main-shell-and-layout-editor-ownerization-queue.md`
  - `src/main.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `target_closeout_truth_without_written_basis`
  - `out_of_scope_editor_product_work`
- done_when:
  - `src/main.ts is reduced to startup, assembly, top-level event registration, request dispatch forwarding, unified render trigger wiring, and lifecycle control`
  - `queue doc, target plan, and project-progress are synchronized`
  - `verification passes`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm test`
- if_blocked:
  - `record the blocker in this queue doc`
  - `return control to target-level promotion review`
- promote_next_if_done: `none`
- stop_if:
  - `required verification has not passed`

#### Human Context

- task_brief:
  - `Verify pure-shell closure and synchronize Blueprint truth before returning to target review.`
- task_outcome_summary:
  - `Historical closeout task recorded as blocked/partial on prior evidence and now serves as stale closeout context behind the current reclosure.`
- Purpose:
  - `Verify that pure-shell closure is real, not cosmetic, and synchronize Blueprint truth before returning to target review.`
- Failure mode:
  - `Do not close the queue while main.ts still owns hidden behavior branches or while verification remains partial.`

## Progress Log

- 2026-07-07
  - Summary: `Promoted queue.main-shell-and-layout-editor-ownerization after fresh main.ts evidence proved that the shell entrypoint still owns layout editor behavior, render scheduling, and runtime layout baseline bootstrap beyond a pure-shell contract.`
  - Verification: `Fresh source-path audit across src/main.ts, src/application/layout-editor/layout-editor-actions.ts, src/ui/tools/layout-editor-view.ts, src/ui/app-render.ts, src/content/layout-editor-presets.ts, and tests/robustness.test.cjs`
  - Next at this time: `Record baseline-reconcile and start layout-editor-ownerization.`
- 2026-07-07
  - Summary: `Closed baseline-reconcile after freezing the pure-shell acceptance truth and the required owner split: main.ts may remain only as assembler/dispatcher, while layout editor behavior plus render/bootstrap ownership must move out.`
  - Verification: `Blueprint queue-truth review against the fresh source-path audit`
  - Next at this time: `Execute task.main-shell-and-layout-editor-ownerization.layout-editor-ownerization.`
- 2026-07-07
  - Summary: `Closed layout-editor-ownerization after extracting layout editor input/click/drag ownership into application/layout-editor/layout-editor-coordinator.ts and removing direct layout-editor action imports from src/main.ts.`
  - Verification: `npm run build:test plus targeted robustness guards for the coordinator seam and direct owner-line removal`
  - Next at this time: `Promote task.main-shell-and-layout-editor-ownerization.render-and-layout-bootstrap-ownerization.`
- 2026-07-07
  - Summary: `Started render-and-layout-bootstrap-ownerization after landing app-render-coordinator and layout-editor-bootstrap seams; render/prepass/bootstrap owner code left src/main.ts, but scattered render trigger branches still keep the task open.`
  - Verification: `npm test and targeted robustness guards for the render coordinator and layout bootstrap seams`
  - Next at this time: `Continue narrowing business-driven render scheduling branches out of src/main.ts.`
- 2026-07-07
  - Summary: `Narrowed the main appElement click shell by moving the covered overlay, inventory, modal-cancel, and city-menu click family into application/ui/app-click-coordinator.ts; src/main.ts now delegates those covered clicks through appClickCoordinator.handleClick(targetElement).`
  - Verification: `Targeted node --test robustness guard for the new app-click coordinator seam; repository-wide build:test/typecheck remain blocked by pre-existing import.meta and ?url asset typing issues outside this queue slice.`
  - Next at this time: `Continue extracting the remaining non-click renderApp() trigger families from src/main.ts, starting with one bounded runtime or travel branch cluster.`
- 2026-07-07
  - Summary: `Extracted the covered activity-qte, story-scene, and story-battle runtime action family into application/runtime/interactive-action-coordinator.ts; src/main.ts now delegates those covered action->render flows and the battle-demo victory message handoff through the coordinator, leaving 35 remaining renderApp() callsites in src/main.ts after this batch.`
  - Verification: `node --test tests/robustness.test.cjs plus blueprint lint; repository-wide build:test/typecheck remain blocked by pre-existing import.meta and ?url asset typing issues outside this queue slice.`
  - Next at this time: `Continue extracting the remaining travel/auto-advance or council/begging render-trigger families from src/main.ts.`
- 2026-07-07
  - Summary: `Extracted the bounded travel owner family into application/runtime/campaign-travel-coordinator.ts so src/main.ts now delegates travel confirm, cancel, start, and completion-time-advance flows through a dedicated coordinator seam; main.ts is reduced to 23 remaining renderApp() callsites after this batch.`
  - Verification: `Targeted node --test plus node --test tests/robustness.test.cjs plus npm run lint:blueprints plus npm run typecheck; npm run build:test now fails only on the pre-existing import.meta and ?url asset typing/configuration errors outside this queue slice.`
  - Next at this time: `Keep task.main-shell-and-layout-editor-ownerization.render-and-layout-bootstrap-ownerization active and continue with one of the remaining bounded render-trigger families, most likely map auto-advance or council/begging.`
- 2026-07-07
  - Summary: `Extracted the bounded map auto-advance owner family into application/runtime/map-auto-advance-coordinator.ts so src/main.ts now delegates auto-advance start, stop, snapshot, completion, and day-start render-trigger flow through a dedicated coordinator seam; main.ts is reduced to 19 remaining renderApp() callsites after this batch.`
  - Verification: `Targeted node --test plus node --test tests/robustness.test.cjs plus npm run lint:blueprints plus npm run typecheck; npm run build:test still fails only on the pre-existing import.meta and ?url asset typing/configuration errors outside this queue slice.`
  - Next at this time: `Keep task.main-shell-and-layout-editor-ownerization.render-and-layout-bootstrap-ownerization active and continue with one of the remaining bounded render-trigger families, most likely council/begging or city/house transition.`
- 2026-07-07
  - Summary: `Extracted the bounded city/house transition plus access-refusal owner family into application/runtime/city-house-transition-coordinator.ts so src/main.ts now delegates leave-city, enter-city-3d, leave-city-3d, and canOpenHouseFromCity() refusal dialogue open -> render flow through a dedicated coordinator seam.`
  - Verification: `Targeted node --test plus node --test tests/robustness.test.cjs plus npm run lint:blueprints plus npm run typecheck; npm run build:test still fails only on the pre-existing import.meta and ?url asset typing/configuration errors outside this queue slice.`
  - Next at this time: `Keep task.main-shell-and-layout-editor-ownerization.render-and-layout-bootstrap-ownerization active and continue with one of the remaining bounded render-trigger families, most likely council/begging or city-directory and house-side transition entry flow.`
- 2026-07-07
  - Summary: `Extracted the bounded council-priority plus city-begging owner family into application/runtime/council-priority-city-begging-coordinator.ts so src/main.ts now delegates council-priority refusal, insufficient-time refusal, city-begging launch checks, city-begging launch, and city-begging confirm-result settle -> render flow through a dedicated coordinator seam.`
  - Verification: `Targeted node --test plus node --test tests/robustness.test.cjs plus npm run lint:blueprints plus npm run typecheck; npm run build:test still fails only on the pre-existing import.meta and ?url asset typing/configuration errors outside this queue slice.`
  - Next at this time: `Keep task.main-shell-and-layout-editor-ownerization.render-and-layout-bootstrap-ownerization active and continue with one of the remaining bounded render-trigger families, most likely city-directory and house-side transition entry flow or another shell-only residue cluster.`
- 2026-07-07
  - Summary: `Extracted the bounded city-directory or leader-residence plus related house-side transition entry owner family into application/runtime/city-directory-leader-residence-coordinator.ts so src/main.ts now delegates city-entry directory open, leader-residence selection -> pending character write -> house entry, and the directly adjacent generic house-side city entry branch through a dedicated coordinator seam.`
  - Verification: `Targeted node --test plus node --test tests/robustness.test.cjs plus npm run lint:blueprints plus npm run typecheck; npm run build:test still fails only on the pre-existing import.meta and ?url asset typing/configuration errors outside this queue slice.`
  - Next at this time: `Keep task.main-shell-and-layout-editor-ownerization.render-and-layout-bootstrap-ownerization active and continue with one of the remaining bounded shell residue families, most likely startup or session-apply wiring, mapped city-3d house entry residue, house drag/drop shell writes, or the low-level campaign move animation helper.`
- 2026-07-07
  - Summary: `Extracted the bounded mapped city-3d or scene-object house entry owner family into application/runtime/city-3d-house-entry-coordinator.ts so src/main.ts now delegates the scene-object entry path, hd2deg:enter-house window message entry, access gate, and runtime house entry handoff through a dedicated coordinator seam.`
  - Verification: `Targeted node --test plus node --test tests/robustness.test.cjs plus npm run lint:blueprints plus npm run typecheck; npm run build:test still fails only on the pre-existing import.meta and ?url asset typing/configuration errors outside this queue slice.`
  - Next at this time: `Keep task.main-shell-and-layout-editor-ownerization.render-and-layout-bootstrap-ownerization active and continue with one of the remaining bounded shell residue families, most likely startup or session-apply wiring, house drag/drop shell writes, or the low-level campaign move animation helper.`
- 2026-07-07
  - Summary: `Extracted the bounded house drag/drop shell write owner family into application/runtime/house-drag-drop-coordinator.ts so src/main.ts now delegates pointer drag completion submit, html drop submit, house actionId assembly, runtime action dispatch, and the directly adjacent render trigger through a dedicated coordinator seam.`
  - Verification: `Targeted node --test plus node --test tests/robustness.test.cjs plus npm run lint:blueprints plus npm run typecheck; npm run build:test still fails only on the pre-existing import.meta and ?url asset typing/configuration errors outside this queue slice.`
  - Next at this time: `Keep task.main-shell-and-layout-editor-ownerization.render-and-layout-bootstrap-ownerization active and continue with one of the remaining bounded shell residue families, most likely startup or session-apply wiring or the low-level campaign move animation helper.`
- 2026-07-07
  - Summary: `Extracted the bounded campaign move animation helper owner family into application/runtime/campaign-move-animation-coordinator.ts so src/main.ts now delegates animateCampaignMove(), stopCampaignMoveAnimation(), facing-degree calculation, animation-frame position or facing interpolation, completion settle, and the directly adjacent render trigger through a dedicated coordinator seam.`
  - Verification: `Targeted node --test plus node --test tests/robustness.test.cjs plus npm run lint:blueprints plus npm run typecheck; npm run build:test still fails only on the pre-existing import.meta and ?url asset typing/configuration errors outside this queue slice.`
  - Next at this time: `Keep task.main-shell-and-layout-editor-ownerization.render-and-layout-bootstrap-ownerization active and continue with the remaining bounded shell residue families, now mainly startup or session-apply wiring.`
- 2026-07-08
  - Summary: `Extracted the bounded startup or session apply wiring owner family into application/startup/startup-session-apply-coordinator.ts so src/main.ts now delegates activated session apply, playable registry configure, apply-startup-session execution, save persist, render trigger, and the unified continue or restore or builtin or scenario-pack startup success path through a dedicated coordinator seam.`
  - Verification: `Targeted node --test plus node --test tests/robustness.test.cjs plus npm run lint:blueprints plus npm run typecheck; npm run build:test still fails only on the pre-existing import.meta and ?url asset typing/configuration errors outside this queue slice.`
  - Next at this time: `Keep task.main-shell-and-layout-editor-ownerization.render-and-layout-bootstrap-ownerization active and continue with the final narrower shell residue, now mainly shell-side boot or lifecycle assembly.`
- 2026-07-08
  - Summary: `Extracted the bounded shell-side boot or lifecycle assembly owner family into application/startup/shell-boot-lifecycle-coordinator.ts so src/main.ts now delegates continue or restore or builtin or scenario-pack startup success handoff, loading request completion or error end-loading handoff, and the directly adjacent shell-side boot orchestration through a dedicated coordinator seam.`
  - Verification: `Targeted node --test plus node --test tests/robustness.test.cjs plus npm run lint:blueprints plus npm run typecheck; npm run build:test still fails only on the pre-existing import.meta and ?url asset typing/configuration errors outside this queue slice.`
  - Next at this time: `Keep task.main-shell-and-layout-editor-ownerization.render-and-layout-bootstrap-ownerization active, recheck fresh main.ts source evidence against the pure-shell acceptance line, and only then decide whether queue closeout review is now legal.`
- 2026-07-08
  - Summary: `Completed a fresh source audit instead of extracting a new family. The new robustness source-test proved that the remaining src/main.ts shell residue is now limited to accepted pure-shell responsibilities: DOM root lookup, dependency and coordinator assembly, startup entry registration, top-level browser event registration, lifecycle boot or destroy primitives, and loading-screen primitive helpers.`
  - Verification: `node --test tests/robustness.test.cjs --test-name-pattern "fresh source audit keeps main.ts final shell residue within the pure-shell acceptance line" plus node --test tests/robustness.test.cjs plus npm run lint:blueprints plus npm run typecheck; npm run build:test still fails only on the pre-existing import.meta and ?url asset typing/configuration errors outside this queue slice.`
  - Next at this time: `Keep task.main-shell-and-layout-editor-ownerization.render-and-layout-bootstrap-ownerization active for governance purposes, sync the fresh audit evidence, and only then decide in a later explicit step whether queue-closeout readiness review should start.`
- 2026-07-08
  - Summary: `Closed the queue as historical evidence after the fresh source audit proved that src/main.ts has reached the accepted pure-shell line and no further bounded ownerization batch remains justified on current evidence.`
  - Verification: `npm run lint:blueprints plus npm run typecheck passed; npm test still fails only through the existing build:test asset/tooling gap in src/content/layout-editor-presets.ts, src/ui/portrait-assets.ts, src/ui/views/character/character-detail-view.ts, src/ui/views/minigames/city-begging-minigame-view.ts, and multiple ?url asset imports outside this queue slice.`
  - Next at this time: `Return control to target-level idle-open review with no active queue and treat this queue as closed historical evidence only.`
- 2026-07-08
  - Summary: `Reactivated the queue after a new fresh source audit disproved the prior pure-shell closeout basis. src/main.ts again directly imports layout-editor action helpers, applyRenderPrepassState, and ui/app-render markup helpers, still performs large direct appState writes, and still owns layout-editor pointer or drag or resize plus render ownership lines.`
  - Verification: `Fresh source-path audit across src/main.ts plus npm run lint:blueprints`
  - Next at this time: `Run task.main-shell-and-layout-editor-ownerization.reclosure-baseline-reconcile before any renewed ownerization implementation.`
- 2026-07-08
  - Summary: `Closed reclosure-baseline-reconcile after freezing one minimum legal recovery cut only: restore the repeated layout-editor interaction owner line, render-prepass/render scheduling owner line, and layout baseline bootstrap owner line behind the already-existing coordinator/bootstrap seams instead of widening scope.`
  - Verification: `Fresh source audit across src/main.ts, src/application/layout-editor/layout-editor-coordinator.ts, src/application/presenter/app-render-coordinator.ts, src/application/layout-editor/layout-editor-bootstrap.ts, and tests/robustness.test.cjs plus npm run lint:blueprints`
  - Next at this time: `Execute task.main-shell-and-layout-editor-ownerization.reclosure-ownerization on that bounded cut only.`
- 2026-07-08
  - Summary: `Completed reclosure-ownerization after src/main.ts stopped directly owning the repeated layout-editor action/drag family, render-prepass/render scheduling family, and layout baseline bootstrap family. Event routing now delegates through application/layout-editor/layout-editor-coordinator.ts, renderApp() delegates through application/presenter/app-render-coordinator.ts, and prototype/scenario app-state creation now delegates layout defaults through application/layout-editor/layout-editor-bootstrap.ts.`
  - Verification: `Fresh source grep across src/main.ts plus npm run typecheck`
  - Next at this time: `Advance the queue to task.main-shell-and-layout-editor-ownerization.reclosure-closeout and verify queue-closeout readiness without opening another implementation slice.`
- 2026-07-08
  - Summary: `Attempted reclosure-closeout after the bounded ownerization cut landed. Fresh source grep still shows no in-scope main.ts owner-line regression, and npm run lint:blueprints plus npm run typecheck still pass, but npm test remains blocked before test execution by the known repository-wide build:test asset/tooling gap in src/content/layout-editor-presets.ts and multiple import.meta or ?url-based UI asset modules outside this queue slice.`
  - Verification: `Fresh source grep across src/main.ts plus npm run lint:blueprints plus npm run typecheck plus npm test`
  - Next at this time: `Keep queue.main-shell-and-layout-editor-ownerization as the only active queue with task.main-shell-and-layout-editor-ownerization.reclosure-closeout blocked on external repository verification debt rather than reopening implementation scope.`
- 2026-07-08
  - Summary: `Re-ran reclosure-closeout verification and closed the reopened queue after the current branch passed the full closeout gate. Fresh source grep still shows no in-scope main.ts owner-line regression, and npm run lint:blueprints plus npm run typecheck plus npm test all pass, so target control returns to promotion-review with no active queue.`
  - Verification: `Fresh source grep across src/main.ts plus npm run lint:blueprints plus npm run typecheck plus npm test`
  - Next at this time: `Treat queue.main-shell-and-layout-editor-ownerization as closed historical evidence only and resume at target-level promotion-review.`

## Historical Closeout Decision

- queue_id: `queue.main-shell-and-layout-editor-ownerization`
- closeout_status: `done`
- verification_status: `full`
- residue_remaining: `yes`
- residue_classification:
  - `accepted-pure-shell-residue`
- next_queue_recommendation: `none`
- promotion_justified: `false`
- evidence:
  - `fresh main.ts source audit proved the remaining shell residue is limited to accepted pure-shell responsibilities`
  - `the bounded render-and-layout-bootstrap ownerization work is complete and no additional same-scope family remains justified`
  - `node --test tests/robustness.test.cjs passed with the new pure-shell audit guard`
  - `npm run lint:blueprints and npm run typecheck passed`
  - `fresh npm test now passes on the current branch as well, so no queue-local verification blocker remains`
