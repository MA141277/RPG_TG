# Location Access Runtime Convergence Queue

## Control Block

- queue_id: `queue.location-access-runtime-convergence`
- belongs_to_version: `target.city-building-definition-location-access-convergence`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-16`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `active`
- queue_class: `required-priority`
- active_task: `task.location-access-runtime-convergence.boundary-baseline-reconcile`
- next_task: `task.location-access-runtime-convergence.runtime-contract-implementation`
- closeout_status: `in-progress`
- execution_closeout_status: `partial`
- topic_closure_status: `open-residue`
- closure_basis: `Queue just admitted from the closed definition restructure queue's same-family residue; bounded execution has not landed yet.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `needs-version-review`
- next_family_candidate: `queue.script-editor-building-house-runtime-adapter`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `success`
- sync_scope: `local-record`
- sync_summary: `Queue admitted locally from the verified city/building definition restructure closeout; no commit or push attempted.`
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
  - `Introduce the runtime access seam for city/building conditionExpression evaluation and before-mutation entry enforcement now that city/building definitions carry no-visibility access data.`
- Forbidden expansions:
  - `Do not adapt HouseRuntime ownership beyond the entry guard handoff needed to preserve current house entry behavior.`
  - `Do not implement city/building status overlays or save persistence in this queue.`
  - `Do not move map coordinates, map nodes, mapBinding, mapNodeId, or cityCoordinatesById ownership into city definitions.`
  - `Do not implement custom-attribute authoring controls or broad export/import schema validation unless baseline proves a smaller evaluator cannot work without them.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-16-city-building-definition-location-access-convergence-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-16-city-building-definition-location-access-convergence-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/script-editor-city-building-definition-restructure-queue.md`

### Queue Snapshot

- queue_goal: `Evaluate script-editor-authored city/building conditionExpression values and guard city/building entry before runtime state mutation.`
- task_count: `3`
- completed_task_count: `0`
- remaining_task_count: `3`
- active_task_summary: `Inspect current city click, building entry, refusal, map, and condition evaluation seams before selecting the smallest LocationAccessRuntime implementation slice.`
- task_briefs:
  - `task.location-access-runtime-convergence.boundary-baseline-reconcile: inspect existing condition evaluators, map city entry, city building entry, and refusal flows before choosing the runtime access boundary.`
  - `task.location-access-runtime-convergence.runtime-contract-implementation: implement the selected LocationAccessRuntime evaluation and before-mutation guard slice test-first.`
  - `task.location-access-runtime-convergence.queue-closeout-and-handoff: verify, classify residue, and return control to version review.`

### Operator Snapshot Contract

- `The fixed operator receipt must source current queue from queue_id.`
- `The fixed operator receipt must source current task from active_task.`
- `The fixed operator receipt must source current queue goal from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded execution slice landed and verified.`
- `topic_closure_status = closed is legal only when no still-blocking same-family residue remains inside the queue's bounded topic surface.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`
- `If residue_family = same-family and one lawful continuation exists, name it in next_family_candidate and allow automatic continuation instead of returning to open-ended human queue selection.`

### Admission Preconditions

- `queue.script-editor-city-building-definition-restructure closed after the no-visibility city/building definition contract slice landed and verified.`
- `The version plan closure routing record marks queue.location-access-runtime-convergence as the unique same-family continuation because conditionExpression data now exists but runtime evaluation and before-mutation entry enforcement do not.`
- `This queue is admitted as the next required-priority slice; implementation must start with baseline reconciliation.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, record local repository sync state.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Default Blueprint governance/documentation refinement uses local-record during execution and branch-commit at task closeout.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.location-access-runtime-convergence.boundary-baseline-reconcile` | `active` | `Inspect current condition evaluators, city/map entry mutation, building entry/refusal flow, and tests before selecting the implementation slice.` | `none` | `Must record source-backed evidence before production code changes.` |
| `task.location-access-runtime-convergence.runtime-contract-implementation` | `pending` | `Implement the selected LocationAccessRuntime evaluation and before-mutation guard slice with tests.` | `task.location-access-runtime-convergence.boundary-baseline-reconcile` | `Must not widen into HouseRuntime ownership, status overlays, or map coordinate migration.` |
| `task.location-access-runtime-convergence.queue-closeout-and-handoff` | `pending` | `Verify the bounded slice, classify residue, and return control to version review.` | `task.location-access-runtime-convergence.runtime-contract-implementation` | `Does not infer version closeout from this queue.` |

### Task Definitions

#### `task.location-access-runtime-convergence.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.location-access-runtime-convergence.boundary-baseline-reconcile`
- state: `active`
- task_kind: `execution`
- scope:
  - `src/application/navigation`
  - `src/application/city`
  - `src/application/script-editor`
  - `src/core`
  - `src/main.ts`
  - `src/ui/main-ui`
  - `tests`
  - `docs/blueprints/queues/location-access-runtime-convergence-queue.md`
- must_inspect:
  - `docs/blueprints/queues/script-editor-city-building-definition-restructure-queue.md`
  - `src/application/navigation/enter-city.ts`
  - `src/application/city/city-building-placement-resolver.ts`
  - `src/application/script-editor/city-building-runtime-materializer.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/core`
  - `src/main.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `production code before baseline reconciliation records the selected implementation slice`
  - `HouseRuntime deprivileging beyond entry guard handoff requirements`
  - `city/building status overlays or save persistence`
  - `map coordinate ownership`
- done_when:
  - `Current city entry, map click, city building entry, refusal rule, condition evaluation, state mutation, and test seams are inventoried with source-backed evidence.`
  - `The smallest lawful LocationAccessRuntime implementation boundary is selected, or a concrete blocker is recorded.`
  - `A test-first implementation plan names exact files, expected before-mutation behavior, compatibility behavior, residue posture, and verification commands for the next task.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "conditionExpression|EventCondition|enterCity|currentCityId|cityEntries|houseAccessRefusalRules|canEnterCityBuilding|resolveCityBuilding|mapNodeId|cityCoordinatesById" src tests`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening into HouseRuntime adapter, status overlay, export/import validation, or map compatibility work silently.`
  - `Return to version review if fresh evidence proves a different prerequisite queue must run first.`
- promote_next_if_done: `task.location-access-runtime-convergence.runtime-contract-implementation`
- stop_if:
  - `Fresh evidence proves conditionExpression cannot be evaluated without first implementing a different admitted candidate queue.`

##### Human Context

- task_brief:
  - `Find the smallest LocationAccessRuntime boundary before changing runtime entry behavior.`
- task_outcome_summary:
  - `Active. The predecessor queue supplied conditionExpression data but intentionally deferred runtime evaluation and before-mutation enforcement.`
- Purpose:
  - `Prevent city/map/building entry guards from being duplicated across UI, navigation, and house flows.`
- Failure mode:
  - `Starting implementation without source-backed boundary evidence could mutate location state before access checks or bury access evaluation inside HouseRuntime branches.`

##### Progress Log

- `2026-07-16`: `Queue admitted from the verified definition restructure closeout. Baseline reconciliation is now the active task.`

#### `task.location-access-runtime-convergence.runtime-contract-implementation`

##### Control Block

- task_id: `task.location-access-runtime-convergence.runtime-contract-implementation`
- state: `pending`
- task_kind: `execution`
- scope:
  - `to-be-selected-by-baseline`
- must_inspect:
  - `Boundary baseline evidence from task.location-access-runtime-convergence.boundary-baseline-reconcile.`
- must_not_change:
  - `scope outside the selected baseline implementation slice`
- done_when:
  - `The selected LocationAccessRuntime evaluation and before-mutation guard slice is implemented test-first.`
- verify_with:
  - `npm run typecheck`
  - `npm test`
  - `npm run lint:blueprints`
  - `npm run lint:plans`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record the blocker and return to version review if the selected implementation slice requires a different prerequisite queue.`
- promote_next_if_done: `task.location-access-runtime-convergence.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires broad HouseRuntime adapter, city/building status overlay, export/import validation, or map coordinate migration work outside the admitted queue.`

##### Human Context

- task_brief:
  - `Implement the LocationAccessRuntime slice selected by baseline reconciliation.`
- task_outcome_summary:
  - `Pending baseline.`
- Purpose:
  - `Create a reusable runtime entry guard for city and building access.`
- Failure mode:
  - `Implementing before baseline could duplicate condition evaluation in multiple entry flows.`

#### `task.location-access-runtime-convergence.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.location-access-runtime-convergence.queue-closeout-and-handoff`
- state: `pending`
- task_kind: `execution`
- scope:
  - `docs/blueprints/plans/2026-07-16-city-building-definition-location-access-convergence-target-plan.md`
  - `docs/blueprints/queues/location-access-runtime-convergence-queue.md`
  - `docs/blueprints/project-progress.md`
- must_inspect:
  - `Implementation result from task.location-access-runtime-convergence.runtime-contract-implementation.`
  - `Version plan closure routing rules.`
- must_not_change:
  - `version_status without explicit version-level closeout confirmation`
  - `candidate queue ordering unrelated to this queue's residue`
- done_when:
  - `The queue implementation result is verified or honestly blocked.`
  - `Queue closeout classifies residue and names the next same-family candidate if uniquely supported.`
  - `Version plan and project-progress pointers are synchronized to the next lawful state.`
  - `Repository sync is attempted or explicitly recorded according to queue sync policy.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:plans`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record the blocker in Progress Log and leave the queue active or blocked according to the queue closeout judgement rule.`
- promote_next_if_done: `version-review`
- stop_if:
  - `Closeout would infer full version completion without explicit version-level acceptance.`

##### Human Context

- task_brief:
  - `Close or route the LocationAccessRuntime queue after verified implementation.`
- task_outcome_summary:
  - `Pending implementation.`
- Purpose:
  - `Return control to version review without hiding HouseRuntime adapter, status, editor, export/import, or map compatibility residue.`
- Failure mode:
  - `Closing without residue classification would hide later city/building convergence queues.`

### Historical Handoff Note

- Task ID:
  - `none`
- Recorded handoff at closure:
  - `none`
- Recorded expected output:
  - `none`

### Historical Candidate Notes

- `queue.script-editor-building-house-runtime-adapter`
  - State:
    - `same-version-candidate`
  - Reason:
    - `Expected next candidate after runtime access evaluation exists, unless baseline evidence proves HouseRuntime adapter must precede before-mutation access enforcement.`
