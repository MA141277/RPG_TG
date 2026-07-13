# Script Editor UI Shell And Core Workflow Queue

## Control Block

- queue_id: `queue.script-editor-ui-shell-and-core-workflow`
- belongs_to_version: `target.script-editor-implementation`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-13`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `done`
- queue_class: `required`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `closed`
- closure_basis: `The bounded creator-shell topic is now converged: the repository has one reusable script-editor workspace shell view-model, one creator-facing object-tree and handoff summary render scaffold, and one shell-specific style surface that later workflow queues can consume without rebuilding editor chrome. No still-blocking same-family creator-shell continuation remains inside this queue topic surface, and the remaining version work now belongs to later minimal usable workflow or shared-rule/product-facing queue families rather than another same-family shell continuation.`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `success`
- sync_scope: `baseline-push`
- sync_summary: `Commit 3459ad6 on mod-first-dev was pushed successfully to origin/mod-first-dev after this closed script-editor creator-shell queue truth was written and staged in the same closeout batch.`
- blocked_by: []
- allowed_item_classifications:
  - `current-target-item`
- reject_item_classifications:
  - `content-pipeline-item`
  - `asset-pipeline-item`
  - `future-target-candidate`

## Human Context

### Queue Explanation

- Goal:
  - `Land one bounded creator-facing script-editor shell on top of the frozen project/export/import baseline by introducing a reusable workspace frame, object-tree scaffold, and handoff-status surface without widening into the full minimal usable workflow.`
- Forbidden expansions:
  - `Do not widen this queue into main-menu entry wiring, new/open/import project actions, shared condition/effect authoring, or the full minimal usable product loop.`
  - `Do not reopen frozen authoring, mapping, compatibility, shared-rule, or minimum-runtime-delta boundary decisions inside this queue.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-13-script-editor-implementation-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md`
- Frozen baseline:
  - `docs/blueprints/specs/2026-07-10-script-editor-contract-freeze-target.md`
  - `docs/blueprints/plans/2026-07-10-script-editor-contract-freeze-target-plan.md`

### Queue Snapshot

- queue_goal: `Turn the recorded creator-shell candidate into one reusable workspace shell, object-tree scaffold, and handoff summary without widening into the product-facing minimal workflow.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `No active task remains; the bounded creator-shell slice closed after the reusable workspace shell, object-tree scaffold, and handoff summary landed with verification.`
- task_briefs:
  - `task.script-editor-ui-shell-and-core-workflow.boundary-baseline-reconcile: confirm the admitted creator-shell boundary and freeze the first lawful shell-scaffold slice from current repository evidence.`
  - `task.script-editor-ui-shell-and-core-workflow.workspace-shell-scaffold: add the reusable workspace shell view-model, object-tree scaffold, creator-facing shell render, and handoff summary surface without absorbing the minimal usable workflow.`
  - `task.script-editor-ui-shell-and-core-workflow.queue-closeout-and-handoff: verify the queue-local shell slice, classify remaining residue, and hand control back to version review.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 当前执行队列 from queue_id.`
- `The fixed operator receipt must source 当前任务 from active_task.`
- `The fixed operator receipt must source 当前队列目标 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded creator-shell slice landed and verified.`
- `topic_closure_status = closed is legal only when no still-blocking same-family creator-shell residue remains inside this queue's bounded topic surface.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`
- `If residue_family = same-family and one lawful continuation exists, name it in next_family_candidate and allow automatic continuation instead of returning to open-ended human queue selection.`

### Admission Preconditions

- `This queue was admitted only after the version plan concluded that persistence, export, and compatibility import are already closed historical evidence and that creator-shell scaffolding remains the narrower lawful cut before the minimal usable workflow.`
- `Single-active-queue mode remains in force; no second queue may be promoted while this queue is active.`
- `This queue must stay on reusable workspace framing, object-tree shell, and handoff-status surfacing for the existing script-editor project/export substrate.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `A blocked queue still allows commit, push, and merge; repository sync is not forbidden just because execution is blocked.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Activation Order

1. `The version plan concluded the pending admission review for this queue first.`
2. `This queue doc then acted as the queue-level governor for the bounded creator-shell implementation work.`
3. `Only after queue-local truth was explicit did the shell-scaffold implementation and verification land.`

### Recovery Rule

- `Do not recreate or re-audit this queue from scratch while the recorded admission basis still holds.`
- `Resume from this queue doc plus the version-plan promotion ledger unless new material evidence invalidates the admitted boundary.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-ui-shell-and-core-workflow.boundary-baseline-reconcile` | `completed` | `Confirm the admitted creator-shell boundary and freeze the first lawful shell-scaffold slice from current repository truth.` | `none` | `Completed on 2026-07-13 after repository inspection confirmed that script-editor persistence/export/import seams already exist, but no creator-facing workspace shell, object-tree scaffold, or handoff summary module exists yet.` |
| `task.script-editor-ui-shell-and-core-workflow.workspace-shell-scaffold` | `completed` | `Add the reusable workspace shell view-model, object-tree scaffold, creator-facing shell render, and handoff summary surface without absorbing the minimal usable workflow.` | `task.script-editor-ui-shell-and-core-workflow.boundary-baseline-reconcile` | `Completed on 2026-07-13 after src/application/script-editor/workspace-shell.ts, src/ui/views/script-editor/script-editor-workspace-view.ts, and src/styles/script-editor.css landed one project-backed creator shell that reads existing export and compatibility seams without wiring main-menu product flow.` |
| `task.script-editor-ui-shell-and-core-workflow.queue-closeout-and-handoff` | `completed` | `Verify the queue-local shell slice, classify remaining residue, and hand control back to version review.` | `task.script-editor-ui-shell-and-core-workflow.workspace-shell-scaffold` | `Completed on 2026-07-13 after verification confirmed that the reusable shell scaffold is landed, no same-family creator-shell continuation remains, and later product-facing work can consume the shell without rebuilding editor chrome.` |

### Task Definitions

#### `task.script-editor-ui-shell-and-core-workflow.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-ui-shell-and-core-workflow.boundary-baseline-reconcile`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/specs/2026-07-13-script-editor-implementation-target.md`
  - `docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md`
  - `src/application/script-editor/**`
  - `src/main.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/app-render.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `docs/blueprints/specs/2026-07-13-script-editor-implementation-target.md`
  - `docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/application/script-editor/editor-project-save.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/main.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/app-render.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `main-menu product entry wiring`
  - `new/open/import project workflow`
  - `shared condition/effect authoring implementation`
  - `runtime export or compatibility policy by convenience`
- done_when:
  - `Queue-local truth names the smallest lawful creator-shell slice inside the admitted queue.`
  - `Current repository evidence still supports reusable workspace shell scaffolding as the next unique implementation cut.`
  - `The first implementation step is explicit about what this queue decides directly and what remains routed to later workflow queues.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "script-editor|main-menu|workspace|object tree|runtime-pack-export|runtime-pack-import" src/main.ts src/ui/main-ui/main-ui-flow.js src/ui/app-render.ts src/application/script-editor tests/robustness.test.cjs`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening into another queue family silently.`
  - `Return control to version review only if fresh evidence disproves the admitted creator-shell basis.`
- promote_next_if_done: `task.script-editor-ui-shell-and-core-workflow.workspace-shell-scaffold`
- stop_if:
  - `Fresh inspection proves the smallest remaining work belongs primarily to the full minimal usable workflow or shared-rule integration rather than this admitted queue.`

##### Human Context

- task_brief:
  - `Confirm the admitted creator-shell boundary and freeze the first implementation slice before code lands.`
- task_outcome_summary:
  - `Completed after repository inspection confirmed that the script-editor data substrate exists but no creator-facing workspace shell or object-tree scaffold exists yet, so one bounded shell-scaffold slice remains the smallest lawful next cut.`
- Purpose:
  - `Prevent the newly admitted queue from drifting into main-menu entry, project actions, or shared-rule work before the shell slice is explicit.`
- Failure mode:
  - `Do not silently widen from creator shell into the full minimal usable workflow.`

#### `task.script-editor-ui-shell-and-core-workflow.workspace-shell-scaffold`

##### Control Block

- task_id: `task.script-editor-ui-shell-and-core-workflow.workspace-shell-scaffold`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/application/script-editor/**`
  - `src/ui/views/script-editor/**`
  - `src/styles/**`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `main-menu entry wiring`
  - `startup or file-picker workflow`
  - `shared condition/effect compile semantics`
  - `full minimal object editing flow`
- done_when:
  - `The repository has one project-backed workspace shell view-model that can summarize the current script-editor project, object-tree shell, and export/compatibility handoff state.`
  - `The repository has one creator-facing shell render scaffold and style surface that later workflow queues can consume without rebuilding editor chrome.`
  - `Tests and typecheck pass without widening into the minimal usable workflow.`
- verify_with:
  - `npm run typecheck`
  - `npm test -- --test-name-pattern "script editor"`
  - `npm run lint:blueprints`
  - `npm run lint:plans`
- if_blocked:
  - `Record the blocker in this queue doc instead of widening into main-menu or shared-rule work.`
  - `Do not reopen frozen authoring or runtime mapping boundaries without explicit governance evidence.`
- promote_next_if_done: `task.script-editor-ui-shell-and-core-workflow.queue-closeout-and-handoff`
- stop_if:
  - `The required implementation expands into main-menu entry, project-first create/open/import flow, or shared-rule editing semantics.`

##### Human Context

- task_brief:
  - `Implement one reusable script-editor workspace shell, object-tree scaffold, and handoff summary on top of the existing project/export/import seams.`
- task_outcome_summary:
  - `Completed after the repository gained one project-backed workspace shell view-model, one shell render scaffold, one dedicated style surface, and shell-specific regression coverage for export blockers and compatibility residue surfacing.`
- Purpose:
  - `Give later product-facing workflow queues one stable editor frame instead of rebuilding chrome, object tree, and handoff status inside each user-visible slice.`
- Failure mode:
  - `Do not let this queue absorb main-menu product flow or pretend that placeholder shell cards already equal bounded field editing.`

#### `task.script-editor-ui-shell-and-core-workflow.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-ui-shell-and-core-workflow.queue-closeout-and-handoff`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/queues/script-editor-ui-shell-and-core-workflow-queue.md`
  - `docs/change-log.md`
- must_inspect:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/queues/script-editor-ui-shell-and-core-workflow-queue.md`
- must_not_change:
  - `version boundary without explicit residue evidence`
  - `new queue admission without written routing truth`
  - `repository sync truth before queue-local closeout truth is written`
- done_when:
  - `Queue truth, version truth, and project-progress truth are synchronized before control returns to version review.`
  - `Any same-family or cross-family residue is explicitly classified and routed.`
  - `Verification and queue-local handoff are written before any repository sync batch is recorded.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:plans`
- if_blocked:
  - `Record the blocker in this queue doc instead of pretending the queue is closed.`
  - `Do not route version control back to promotion review until queue closeout truth is written.`
- promote_next_if_done: `return-to-version-review`
- stop_if:
  - `Fresh evidence proves the queue still contains a same-family creator-shell continuation rather than a cross-family next step.`

##### Human Context

- task_brief:
  - `Close the queue only after shell verification and version-level routing truth are synchronized.`
- task_outcome_summary:
  - `Completed on 2026-07-13 after creator-shell verification passed, queue closure truth was written, and the next lawful continuation was routed back to version-level promotion review.`
- Purpose:
  - `Prevent a landed shell slice from remaining trapped in queue-local prose after the work is already converged.`
- Failure mode:
  - `Do not keep this queue active just because later product-facing workflow still remains elsewhere in the version.`
