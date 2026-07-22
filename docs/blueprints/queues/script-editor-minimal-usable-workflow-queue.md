# Script Editor Minimal Usable Workflow Queue

## Control Block

- queue_id: `queue.script-editor-minimal-usable-workflow`
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
- closure_basis: `The bounded minimal usable workflow topic is now converged: the repository exposes one main-menu script-editor entry, one landing page with new/open/import actions, one project-first workspace that consumes the landed creator shell, one bounded object-editing loop for project/people/text/story-node/event families, and one visible save/validate/export handoff. No still-blocking same-family minimal-workflow continuation remains inside this queue topic surface, and the remaining version work now belongs to later shared-rule integration or broader narrative compile families rather than another same-family first-loop continuation.`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `success`
- sync_scope: `baseline-push`
- sync_summary: `Commit 3459ad6 on mod-first-dev was pushed successfully to origin/mod-first-dev after this closed minimal workflow queue truth was written.`
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
  - `Land one bounded user-visible script-editor workflow from the main menu into a project-first editor workspace that can create, open, import, edit the bounded minimal object set, validate, and hand off to real runtime-pack export.`
- Forbidden expansions:
  - `Do not widen this queue into shared condition/effect authoring grammar, broad optional editor ergonomics, or a full editor product rewrite.`
  - `Do not reopen frozen authoring, mapping, compatibility, or minimum-runtime-delta boundary decisions inside this queue.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-13-script-editor-implementation-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md`

### Queue Snapshot

- queue_goal: `Consume the landed creator-shell, persistence, export, and compatibility seams to expose the first bounded user-visible script-editor loop from main menu entry through project-first edit/validate/export handoff.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `No active task remains; the bounded first user-visible script-editor workflow closed after the project-first loop, bounded editing surface, and visible save/validate/export handoff all landed with verification.`
- task_briefs:
  - `task.script-editor-minimal-usable-workflow.boundary-baseline-reconcile: confirm that the creator-shell scaffold and landed import/export/persistence seams make the minimal workflow the next lawful cut.`
  - `task.script-editor-minimal-usable-workflow.project-first-workflow-implementation: add the bounded main-menu entry, landing-page actions, project-backed workspace flow, bounded object editing, and visible save/validate/export handoff without widening into shared-rule or full product polish.`
  - `task.script-editor-minimal-usable-workflow.queue-closeout-and-handoff: verify the queue-local workflow slice, classify remaining residue, and hand control back to version review.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 当前执行队列 from queue_id.`
- `The fixed operator receipt must source 当前任务 from active_task.`
- `The fixed operator receipt must source 当前队列目标 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Admission Preconditions

- `This queue is admitted only after queue.editor-project-load-save-foundation, queue.authoring-runtime-export-pipeline, queue.compatibility-import-adapter, and queue.script-editor-ui-shell-and-core-workflow are all closed historical evidence.`
- `Single-active-queue mode remains in force; no second queue may be promoted while this queue is active.`
- `This queue must consume rather than re-own the already landed project persistence, export, compatibility-import, and creator-shell seams.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `A blocked queue still allows commit, push, and merge; repository sync is not forbidden just because execution is blocked.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-minimal-usable-workflow.boundary-baseline-reconcile` | `completed` | `Confirm that the creator-shell scaffold and landed import/export/persistence seams make the minimal workflow the next lawful cut.` | `none` | `Completed on 2026-07-13 after repository inspection confirmed that the main menu already has stable overlay/action wiring, the script-editor creator shell is landed, and no smaller same-family continuation remains ahead of the first user-visible workflow.` |
| `task.script-editor-minimal-usable-workflow.project-first-workflow-implementation` | `completed` | `Add the bounded main-menu entry, landing-page actions, project-backed workspace flow, bounded object editing, and visible save/validate/export handoff without widening into shared-rule or full product polish.` | `task.script-editor-minimal-usable-workflow.boundary-baseline-reconcile` | `Completed on 2026-07-13 after the repository gained a main-menu script-editor entry, landing-page new/open/import actions, one project-first workspace backed by the creator shell, bounded object editing helpers, and visible save/validate/export handoff wired to the landed project/export/import seams.` |
| `task.script-editor-minimal-usable-workflow.queue-closeout-and-handoff` | `completed` | `Verify the queue-local workflow slice, classify remaining residue, and hand control back to version review.` | `task.script-editor-minimal-usable-workflow.project-first-workflow-implementation` | `Completed on 2026-07-13 after verification confirmed the first user-visible minimal workflow is landed, no same-family minimal-workflow continuation remains inside this bounded queue surface, and control now returns to version-level promotion review.` |

### Task Definitions

#### `task.script-editor-minimal-usable-workflow.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-minimal-usable-workflow.boundary-baseline-reconcile`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/specs/2026-07-13-script-editor-implementation-target.md`
  - `docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md`
  - `src/main.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/application/script-editor/**`
  - `src/ui/views/script-editor/**`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md`
  - `src/main.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/application/script-editor/editor-project-save.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/workspace-shell.ts`
- must_not_change:
  - `shared condition/effect compile semantics`
  - `broad product polish`
  - `runtime schema growth by UI convenience`
- done_when:
  - `Queue-local truth names the first lawful user-visible workflow slice.`
  - `Current repository evidence still supports minimal workflow admission as the next unique implementation cut.`
  - `The implementation step is explicit about what this queue consumes and what remains routed to later queues.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "script-editor|main-menu|workspace|loadScriptEditorProjectFromFiles|loadScriptEditorProjectFromScenarioPackFiles|serializeScriptEditorProjectToFiles" src/main.ts src/ui/main-ui/main-ui-flow.js src/application/script-editor tests/robustness.test.cjs`
- promote_next_if_done: `task.script-editor-minimal-usable-workflow.project-first-workflow-implementation`

##### Human Context

- task_brief:
  - `Confirm the minimal workflow boundary before code lands.`
- task_outcome_summary:
  - `Completed after repository inspection confirmed that the main-menu overlay wiring, creator-shell scaffold, and landed project/export/import seams together make the first user-visible workflow the next smallest lawful cut.`

#### `task.script-editor-minimal-usable-workflow.project-first-workflow-implementation`

##### Control Block

- task_id: `task.script-editor-minimal-usable-workflow.project-first-workflow-implementation`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/main.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/application/script-editor/**`
  - `src/ui/views/script-editor/**`
  - `src/styles/**`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/application/script-editor/editor-project-save.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `shared condition/effect compile semantics`
  - `broad optional editor ergonomics`
  - `re-implementation of persistence/export/import seams already landed upstream`
- done_when:
  - `A user can enter the script editor from the main menu without developer-only affordances.`
  - `A user can create a project or open/import one and land on project-first workspace state.`
  - `A user can edit the bounded minimal object set, save/reopen through the landed project seam, and reach visible validation/export handoff from the same workflow.`
  - `Verification passes without widening into the shared-rule queue family.`
- verify_with:
  - `npm run typecheck`
  - `npm test`
  - `npm run lint:blueprints`
  - `npm run lint:plans`
- promote_next_if_done: `task.script-editor-minimal-usable-workflow.queue-closeout-and-handoff`

##### Human Context

- task_brief:
  - `Implement the first user-visible minimal script-editor workflow on top of the landed creator-shell and project/export/import seams.`
- task_outcome_summary:
  - `Completed after the repository gained one bounded main-menu script-editor entry, landing-page actions, project-first workspace flow, bounded object editing surface, and save/validate/export handoff that reuses the existing creator-shell, project persistence, compatibility import, and runtime export seams.`

#### `task.script-editor-minimal-usable-workflow.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-minimal-usable-workflow.queue-closeout-and-handoff`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/queues/script-editor-minimal-usable-workflow-queue.md`
  - `docs/change-log.md`
- must_inspect:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/queues/script-editor-minimal-usable-workflow-queue.md`
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
- promote_next_if_done: `return-to-version-review`

##### Human Context

- task_brief:
  - `Close the queue only after workflow verification and version-level routing truth are synchronized.`
- task_outcome_summary:
  - `Completed after verification confirmed the bounded first user-visible workflow is landed, no same-family minimal-workflow residue remains, and queue-local truth synchronized the handoff back to version review.`
