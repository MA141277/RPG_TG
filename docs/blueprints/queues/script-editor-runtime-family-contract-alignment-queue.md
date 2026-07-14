# Script Editor Runtime Family Contract Alignment Queue

## Control Block

- queue_id: `queue.script-editor-runtime-family-contract-alignment`
- belongs_to_version: `target.script-editor-runtime-pack-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-14`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `active`
- queue_class: `required`
- active_task: `task.script-editor-runtime-family-contract-alignment.boundary-baseline-reconcile`
- next_task: `task.script-editor-runtime-family-contract-alignment.boundary-baseline-reconcile`
- closeout_status: `in-progress`
- execution_closeout_status: `partial`
- topic_closure_status: `open-residue`
- closure_basis: `none`
- residue_remaining: `unknown`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `pending`
- sync_scope: `none`
- sync_summary: `No repository sync batch is recorded for this newly admitted runtime-family-contract queue yet.`
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
  - `Freeze one explicit runtime scenario-pack family contract for the script editor, startup loader, active-content resolution path, and runtime-pack export path so later convergence queues stop reasoning from bounded compatibility patches or implicit builtin fallback behavior.`
- Forbidden expansions:
  - `Do not widen this queue into full authoring-structure convergence, final export-path implementation, or active-content consumer rewiring by convenience.`
  - `Do not reopen closed PRD-alignment surfaces or silently redesign gameplay/runtime behavior outside the scenario-pack family contract boundary.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`

### Queue Snapshot

- queue_goal: `Turn the current bounded import/export residue, basePackId passthrough, and builtin content privilege into one explicit family contract that names mandatory runtime families, inheritable families, unsupported families, and fail-closed obligations before later convergence queues proceed.`
- task_count: `3`
- completed_task_count: `0`
- remaining_task_count: `3`
- active_task_summary: `The queue is newly admitted and starts with baseline reconcile: confirm that final runtime-family contract freeze is the smallest lawful first cut on current repository evidence and freeze the first bounded contract-writing slice.`
- task_briefs:
  - `task.script-editor-runtime-family-contract-alignment.boundary-baseline-reconcile: confirm that runtime-family contract freeze is the next smallest lawful successor cut and freeze the first bounded contract slice from current repository evidence.`
  - `task.script-editor-runtime-family-contract-alignment.final-runtime-family-contract-freeze: write the explicit mandatory-vs-inheritable runtime-family contract, unsupported-family rules, and fail-closed boundary for later convergence queues.`
  - `task.script-editor-runtime-family-contract-alignment.queue-closeout-and-handoff: verify the queue-local family-contract slice, classify remaining residue, and hand control back to version review with explicit routing truth.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 褰撳墠鎵ц闃熷垪 from queue_id.`
- `The fixed operator receipt must source 褰撳墠浠诲姟 from active_task.`
- `The fixed operator receipt must source 褰撳墠闃熷垪鐩爣 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded family-contract slice landed and verified.`
- `topic_closure_status = closed is legal only when no still-blocking same-family runtime-family-contract residue remains inside this queue's bounded topic surface.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`
- `If residue_family = same-family and one lawful continuation exists, name it in next_family_candidate and allow automatic continuation instead of returning to open-ended human queue selection.`

### Admission Preconditions

- `This queue was admitted only after the predecessor PRD-alignment version closed and the new runtime-pack-unification version plan recorded that final runtime-family contract freeze is the smallest lawful next cut on fresh repository evidence.`
- `Single-active-queue mode remains in force; no second queue may be promoted while this queue is active.`
- `This queue must stay on mandatory family truth, explicit inheritance eligibility, unsupported-family handling, and fail-closed obligations rather than widening into implementation-heavy export or consumer rewiring work.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `A blocked queue still allows commit, push, and merge; repository sync is not forbidden just because execution is blocked.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Activation Order

1. `The predecessor PRD-alignment version closed and returned control to successor version review first.`
2. `The runtime-pack-unification version plan then concluded the pending admission review for this runtime-family-contract queue.`
3. `This queue doc now acts as the queue-level governor for the admitted family-contract work.`
4. `Only then may active_task be exposed and contract-writing begin.`

### Recovery Rule

- `Do not recreate or re-audit this queue from scratch while the recorded runtime-family admission basis still holds.`
- `Resume from this queue doc plus the version-plan promotion ledger unless new material evidence invalidates the admitted contract boundary.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-runtime-family-contract-alignment.boundary-baseline-reconcile` | `active` | `Confirm the admitted runtime-family-contract queue boundary and freeze the first lawful contract task slice from current repository truth.` | `none` | `Active on 2026-07-14 because the successor version has just been promoted and current repository evidence still needs one explicit family contract before later convergence queues can proceed safely.` |
| `task.script-editor-runtime-family-contract-alignment.final-runtime-family-contract-freeze` | `pending` | `Write the explicit runtime-family contract for mandatory families, inheritable families, unsupported families, and fail-closed obligations.` | `task.script-editor-runtime-family-contract-alignment.boundary-baseline-reconcile` | `Pending until baseline reconcile confirms the first bounded contract-writing slice and its must-consume evidence set.` |
| `task.script-editor-runtime-family-contract-alignment.queue-closeout-and-handoff` | `pending` | `Verify the queue, route any remaining runtime-family residue, and return control to version review with explicit closeout truth.` | `task.script-editor-runtime-family-contract-alignment.final-runtime-family-contract-freeze` | `Pending until the bounded runtime-family contract lands and queue-local residue can be classified.` |

### Task Definitions

#### `task.script-editor-runtime-family-contract-alignment.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-runtime-family-contract-alignment.boundary-baseline-reconcile`
- state: `active`
- task_kind: `execution`
- scope:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `docs/scenario-pack-unified-format.md`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/content/pack-content-access.ts`
  - `src/application/content/active-game-content.ts`
- must_inspect:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
  - `docs/scenario-pack-unified-format.md`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/content/pack-content-access.ts`
  - `src/application/content/active-game-content.ts`
- must_not_change:
  - `closed PRD-alignment queue boundaries`
  - `full export-path implementation by convenience`
  - `active-content consumer rewiring beyond evidence gathering`
  - `new authoring-only family creation`
- done_when:
  - `Queue-local truth names the smallest lawful first runtime-family-contract slice inside the admitted queue.`
  - `Current repository evidence still supports freezing mandatory-vs-inheritable family truth before authoring convergence, export unification, or compatibility retirement.`
  - `The first contract-writing step is explicit about what this queue decides directly and what remains routed to later queue families.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "basePackId|compatibilityImport|unresolvedFamilies|activities|pack-content-access|scenario-pack" docs/scenario-pack-unified-format.md src/application/script-editor/runtime-pack-import.ts src/application/script-editor/runtime-pack-export.ts src/application/script-editor/workspace-shell.ts src/ui/main-ui/main-ui-flow.js src/content/pack-content-access.ts src/application/content/active-game-content.ts`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening into another queue family silently.`
  - `Return control to version review only if fresh evidence disproves the admitted runtime-family basis.`
- promote_next_if_done: `task.script-editor-runtime-family-contract-alignment.final-runtime-family-contract-freeze`
- stop_if:
  - `Fresh inspection proves the smallest remaining work belongs primarily to export implementation, inheritance implementation, or consumer deprivileging rather than this admitted family-contract queue.`

##### Human Context

- task_brief:
  - `Confirm the admitted runtime-family boundary and freeze the first contract-writing slice before the final family matrix is written.`
- task_outcome_summary:
  - `Active while the successor version baseline is being reconciled against current import/export residue, basePackId passthrough, and builtin content privilege so the queue can freeze one explicit runtime-family contract without widening into implementation-heavy downstream work.`
- Purpose:
  - `Prevent the newly admitted queue from drifting into export unification or consumer rewiring before the first bounded contract slice is explicitly frozen.`
- Failure mode:
  - `Do not backsolve the final family contract from whichever bounded compatibility or builtin fallback path currently happens to exist in the repository.`

#### `task.script-editor-runtime-family-contract-alignment.final-runtime-family-contract-freeze`

##### Control Block

- task_id: `task.script-editor-runtime-family-contract-alignment.final-runtime-family-contract-freeze`
- state: `pending`
- task_kind: `execution`
- scope:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-runtime-family-contract-alignment-queue.md`
  - `docs/scenario-pack-unified-format.md`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/content/active-game-content.ts`
  - `src/content/pack-content-access.ts`
- must_inspect:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
  - `docs/blueprints/queues/script-editor-runtime-family-contract-alignment-queue.md`
  - `docs/scenario-pack-unified-format.md`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/content/active-game-content.ts`
- must_not_change:
  - `export-path implementation details`
  - `consumer deprivileging implementation`
  - `new authoring-only runtime families`
  - `compatibility retirement implementation`
- done_when:
  - `The version truth names which runtime families are mandatory, which are explicitly inheritable, which remain unsupported, and what fail-closed behavior applies when resolution is incomplete.`
  - `The contract explicitly states what later queues must consume for authoring convergence, export unification, base-pack inheritance, consumer deprivileging, and compatibility retirement.`
  - `Any unresolved but still-needed downstream questions are clearly routed out instead of being absorbed here.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the concrete blocker in this queue doc.`
  - `Do not widen into implementation-heavy export or active-content rewiring just to force completion.`
- promote_next_if_done: `task.script-editor-runtime-family-contract-alignment.queue-closeout-and-handoff`
- stop_if:
  - `The remaining open question is actually an implementation-level export, inheritance, or consumer-routing problem rather than a family-contract boundary decision.`

##### Human Context

- task_brief:
  - `Write the explicit runtime-family contract and downstream routing boundaries.`
- task_outcome_summary:
  - `Pending until baseline reconcile freezes the first lawful contract slice and confirms the evidence set that the final mandatory-vs-inheritable family matrix must consume.`

#### `task.script-editor-runtime-family-contract-alignment.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-runtime-family-contract-alignment.queue-closeout-and-handoff`
- state: `pending`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/queues/script-editor-runtime-family-contract-alignment-queue.md`
  - `docs/change-log.md`
- must_inspect:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/queues/script-editor-runtime-family-contract-alignment-queue.md`
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
  - `Close the queue only after runtime-family contract verification and version-level routing truth are synchronized.`
- task_outcome_summary:
  - `Pending until the bounded runtime-family contract lands, queue-local residue is classified, and successor-version routing truth is synchronized.`
