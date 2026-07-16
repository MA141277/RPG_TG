# Script Editor City Building Mount NPC Authoring Queue

## Control Block

- queue_id: `queue.script-editor-city-building-mount-npc-authoring`
- belongs_to_version: `target.city-building-definition-location-access-convergence`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-16`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `done`
- queue_class: `required`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `open-residue`
- closure_basis: `The bounded city-owned mounting authoring slice landed and was reopened by operator regression evidence, then reclosed after fixing the mounted NPC add-row editing path: cities own mountedBuildings authoring data, the city profile exposes dropdown controls for mounted buildings, mounted NPCs, and primary NPC selection, add NPC now selects the first available unmounted NPC so the new row survives city-detail normalization, mounted-building removal remains covered, and runtime export/loading conversion remains routed as same-family residue.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `needs-version-review`
- next_family_candidate: `queue.script-editor-city-building-mount-export-runtime-convergence`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `success`
- sync_scope: `local-record`
- sync_summary: `Regression reopen and closeout truth recorded locally after focused mounted-building/NPC authoring tests passed; no commit or push attempted.`
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
  - `Add the city-side authoring surface that lets creators mount multiple buildings to a city, mount multiple NPCs under each mounted building, and select one primary NPC per mounted building through dropdown controls.`
- Forbidden expansions:
  - `Do not implement runtime-pack export/runtime loading conversion in this queue unless baseline proves a minimal authoring persistence seam requires it.`
  - `Do not move map coordinates, map nodes, mapBinding, mapNodeId, or cityCoordinatesById ownership.`
  - `Do not add city-management, taxation, conquest, production, or building-upgrade gameplay loops.`
  - `Do not redesign the wider script editor workspace beyond the bounded city/building/NPC mounting controls.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-16-city-building-definition-location-access-convergence-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-16-city-building-definition-location-access-convergence-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/map-city-list-compatibility-preservation-queue.md`

### Queue Snapshot

- queue_goal: `Implement bounded creator-facing city -> building -> NPC mounting authoring controls.`
- task_count: `4`
- completed_task_count: `4`
- remaining_task_count: `0`
- active_task_summary: `Queue reclosed after operator-reported add-NPC regression was fixed; same-family export/runtime convergence residue remains routed to version review.`
- task_briefs:
  - `task.script-editor-city-building-mount-npc-authoring.boundary-baseline-reconcile: inspect current authoring and persistence seams before selecting the bounded mounting-authoring slice.`
  - `task.script-editor-city-building-mount-npc-authoring.authoring-surface-implementation: implement the selected city-side building/NPC mounting authoring slice with tests.`
  - `task.script-editor-city-building-mount-npc-authoring.queue-closeout-and-handoff: verify the bounded slice, classify residue, and return control to version review.`
  - `task.script-editor-city-building-mount-npc-authoring.operator-regression-add-npc-delete-building-fix: reopen the queue for operator-reported add-NPC and delete-mounted-building regressions, fix the add-NPC editing path, and add focused coverage.`

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
- `If runtime export/loading conversion remains after authoring lands, classify it against queue.script-editor-city-building-mount-export-runtime-convergence rather than silently widening this queue.`

### Admission Preconditions

- `City/building definition restructuring, LocationAccessRuntime convergence, HouseRuntime adapter, city/building status save/runtime, custom attribute authoring, export/import validation, and map city-list compatibility queues are closed.`
- `The version plan records queue.script-editor-city-building-mount-npc-authoring as a deferred same-version candidate.`
- `No active queue currently blocks admission.`
- `The follow-up export/runtime convergence candidate remains separate unless baseline proves it must be absorbed into this queue's bounded authoring slice.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, record local repository sync state.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Default Blueprint governance/documentation refinement uses local-record during execution and branch-commit at task closeout.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Activation Order

1. `Version plan already recorded this queue as a deferred same-version candidate while the map compatibility queue was active.`
2. `The map compatibility queue closed and project-progress returned to version review.`
3. `Version-level routing promoted queue.script-editor-city-building-mount-npc-authoring as the next lawful same-version queue before the export/runtime follow-up candidate.`
4. `This queue doc is created and synchronized as the queue-level governor.`
5. `Only then may active_task be exposed and implementation begin.`

### Recovery Rule

- `Resume from this queue doc and the version-plan admission record unless new material evidence invalidates the admitted basis.`
- `Do not start implementation before boundary-baseline-reconcile records current source-backed evidence.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-city-building-mount-npc-authoring.boundary-baseline-reconcile` | `done` | `Inspected current authoring and persistence seams before selecting the bounded mounting-authoring slice.` | `none` | `Completed after source evidence selected city-owned mountedBuildings authoring without absorbing runtime export/loading conversion.` |
| `task.script-editor-city-building-mount-npc-authoring.authoring-surface-implementation` | `completed` | `Implemented the selected city-side building/NPC mounting authoring slice with tests.` | `task.script-editor-city-building-mount-npc-authoring.boundary-baseline-reconcile` | `Completed test-first with city-owned mountedBuildings data and city profile dropdown controls.` |
| `task.script-editor-city-building-mount-npc-authoring.queue-closeout-and-handoff` | `completed` | `Verified the bounded slice, classified residue, and returned control to version review.` | `task.script-editor-city-building-mount-npc-authoring.authoring-surface-implementation` | `Runtime export/loading conversion remains same-family residue for queue.script-editor-city-building-mount-export-runtime-convergence.` |
| `task.script-editor-city-building-mount-npc-authoring.operator-regression-add-npc-delete-building-fix` | `completed` | `Reopened for operator-reported add-NPC/delete-mounted-building regressions and fixed the add-NPC editing path with focused coverage.` | `task.script-editor-city-building-mount-npc-authoring.queue-closeout-and-handoff` | `Root cause was city-detail normalization dropping the empty NPC row after clicking add NPC; the UI now inserts the first available unmounted NPC id, and deletion helper coverage guards the mounted-building removal path.` |

### Task Definitions

#### `task.script-editor-city-building-mount-npc-authoring.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-city-building-mount-npc-authoring.boundary-baseline-reconcile`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/application/script-editor/city-building-runtime-materializer.ts`
  - `src/application/script-editor/editor-project-save.ts`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-city-building-mount-npc-authoring-queue.md`
- must_inspect:
  - `docs/blueprints/plans/2026-07-16-city-building-definition-location-access-convergence-target-plan.md`
  - `docs/blueprints/specs/2026-07-16-city-building-definition-location-access-convergence-target.md`
  - `docs/blueprints/queues/map-city-list-compatibility-preservation-queue.md`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/application/script-editor/city-building-runtime-materializer.ts`
  - `src/application/script-editor/editor-project-save.ts`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `production code before baseline reconciliation records the selected implementation slice`
  - `runtime-pack export/runtime loading conversion unless selected as a required minimal persistence seam`
  - `map coordinate ownership`
  - `city-management or building-upgrade gameplay loops`
- done_when:
  - `Existing city/building authoring record shape, building selection source, NPC/person selection source, selected-location UI panel, input/action routing, save/load persistence, and runtime materialization boundaries are inventoried with source-backed evidence.`
  - `The smallest lawful city-side mounting authoring boundary is selected, or a concrete blocker is recorded.`
  - `A test-first implementation plan names exact files, expected city/building/NPC mounting behavior, residue posture, and verification commands for the next task.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "mounted|mount|primaryNpc|primaryNpcId|npc|characterIds|cityIds|houseIds|selectedLocation|script-editor-location|city-building-authoring|city-building-runtime-materializer" src tests docs/blueprints/version-memo.md`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening into export/runtime conversion or unrelated editor redesign silently.`
  - `Return to version review if fresh evidence proves a different prerequisite queue must run first.`
- promote_next_if_done: `task.script-editor-city-building-mount-npc-authoring.authoring-surface-implementation`
- stop_if:
  - `Fresh evidence proves the city-side mounting authoring surface cannot be bounded without first implementing a different admitted candidate queue.`

##### Human Context

- task_brief:
  - `Find the smallest city-side building/NPC mounting authoring boundary before changing editor controls.`
- task_outcome_summary:
  - `Done. Baseline found no existing city-owned mounted-building/NPC/primaryNpc structure, confirmed existing city houseIds and building characterIds/defaultCharacterId runtime materialization boundaries, and selected a city-owned mountedBuildings authoring slice without runtime export/loading conversion.`
- Purpose:
  - `Give creators dropdown controls for city-mounted buildings, building-mounted NPCs, and one primary NPC per mounted building without hand-editing raw JSON.`
- Failure mode:
  - `Starting implementation without source-backed boundary evidence could duplicate existing city/building structures, mix runtime export conversion into authoring UI prematurely, or encode city-management gameplay instead of authoring data.`

##### Progress Log

- `2026-07-16`: `Queue admitted from the version plan's deferred same-version candidate record after map city-list compatibility closed. Boundary baseline reconciliation is now the active task.`
- `2026-07-16`: `Baseline evidence recorded: ScriptEditorCityRecord had houseIds but no mountedBuildings structure; ScriptEditorBuildingRecord owned baseAttributes.characterIds/defaultCharacterId; city-building-runtime-materializer derived runtime city houseIds and house character/default NPC data from existing fields; editor save/load preserve broad entity record fields; main-ui-flow exposed city/building tabs, menu/access/entry controls, location field routing, and custom attributes but no city-owned mounted building/NPC/primary NPC controls.`
- `2026-07-16`: `Selected implementation slice: add city-owned mountedBuildings authoring data plus city profile dropdown controls for building selection, mounted NPC selection, and primary NPC selection. Runtime export/loading conversion remains out of scope and routed to queue.script-editor-city-building-mount-export-runtime-convergence.`

#### `task.script-editor-city-building-mount-npc-authoring.authoring-surface-implementation`

##### Control Block

- task_id: `task.script-editor-city-building-mount-npc-authoring.authoring-surface-implementation`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/city-building-mount-authoring.test.cjs`
  - `package.json`
- must_inspect:
  - `Boundary baseline evidence from task.script-editor-city-building-mount-npc-authoring.boundary-baseline-reconcile.`
- must_not_change:
  - `scope outside the selected baseline implementation slice`
- done_when:
  - `The selected city-side building/NPC mounting authoring slice is implemented test-first.`
- verify_with:
  - `npm run typecheck`
  - `npm test`
  - `npm run lint:blueprints`
  - `npm run lint:plans`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record the blocker and return to version review if the selected implementation slice requires a different prerequisite queue.`
- promote_next_if_done: `task.script-editor-city-building-mount-npc-authoring.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires runtime export/loading conversion, map coordinate migration, or city-management gameplay outside the admitted queue.`

##### Human Context

- task_brief:
  - `Implement the mounting authoring slice selected by baseline reconciliation.`
- task_outcome_summary:
  - `Completed. City records now expose mountedBuildings, authoring helpers normalize and edit mounted building/NPC/primaryNpc data, and the city profile surface exposes dropdown controls for the bounded city-owned authoring slice.`
- Purpose:
  - `Persist creator-authored city -> building -> NPC mounting relationships through the script editor project surface.`
- Failure mode:
  - `Implementing before baseline could create incompatible authoring data that the follow-up export/runtime queue cannot lower cleanly.`

##### Progress Log

- `2026-07-16`: `RED verified with node --test tests/city-building-mount-authoring.test.cjs: mountedBuildings was undefined and city profile UI lacked mounted building/NPC/primary NPC controls.`
- `2026-07-16`: `GREEN implemented ScriptEditorCityMountedBuilding and city.mountedBuildings normalization/edit helpers, added city profile mounted-building/NPC/primaryNpc dropdown controls and routing, and added tests/city-building-mount-authoring.test.cjs to npm test.`
- `2026-07-16`: `Verification passed: npm run typecheck; npm test (564/564); npm run lint:blueprints; npm run lint:plans; npm run blueprint:governance:check.`

#### `task.script-editor-city-building-mount-npc-authoring.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-city-building-mount-npc-authoring.queue-closeout-and-handoff`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/plans/2026-07-16-city-building-definition-location-access-convergence-target-plan.md`
  - `docs/blueprints/queues/script-editor-city-building-mount-npc-authoring-queue.md`
  - `docs/blueprints/project-progress.md`
- must_inspect:
  - `Implementation result from task.script-editor-city-building-mount-npc-authoring.authoring-surface-implementation.`
  - `Version plan closure routing rules.`
- must_not_change:
  - `version_status without explicit version-level closeout confirmation`
  - `candidate queue ordering unrelated to this queue's residue`
- done_when:
  - `The queue implementation result is verified or honestly blocked.`
  - `Queue closeout classifies residue and names the export/runtime convergence candidate if still required.`
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
  - `Close or route the mounting authoring queue after verified implementation.`
- task_outcome_summary:
  - `Completed with same-family residue: runtime export/loading conversion for the authored city/building/NPC mounting data remains the next candidate for version review.`
- Purpose:
  - `Return control to version review without hiding export/runtime conversion residue.`
- Failure mode:
  - `Closing without residue classification would hide the recorded follow-up export/runtime convergence candidate.`

##### Progress Log

- `2026-07-16`: `Queue closeout classified residue as same-family because the bounded authoring surface now exists but exported scenario packs still need a separate conversion/loading queue for city-mounted buildings, per-building NPC lists, and primary NPC relationships. Returned control to version review without inferring full version closeout.`

#### `task.script-editor-city-building-mount-npc-authoring.operator-regression-add-npc-delete-building-fix`

##### Control Block

- task_id: `task.script-editor-city-building-mount-npc-authoring.operator-regression-add-npc-delete-building-fix`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/application/script-editor/city-building-authoring.ts`
  - `tests/city-building-mount-authoring.test.cjs`
  - `docs/blueprints/queues/script-editor-city-building-mount-npc-authoring-queue.md`
  - `docs/blueprints/plans/2026-07-16-city-building-definition-location-access-convergence-target-plan.md`
  - `docs/change-log.md`
- must_inspect:
  - `Operator regression report that add NPC had no effect and delete mounted building appeared ineffective in the script editor workspace.`
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/city-building-mount-authoring.test.cjs`
- must_not_change:
  - `runtime export/loading conversion`
  - `map coordinate ownership`
  - `city-management or building-upgrade gameplay loops`
- done_when:
  - `The add-NPC click path preserves a selectable NPC row after the city mounted-building edit helper runs.`
  - `The mounted-building deletion helper has focused regression coverage.`
  - `The queue records the operator-driven reopen and reclose truth without hiding the existing export/runtime residue.`
- verify_with:
  - `npm run build:test`
  - `node --test tests/city-building-mount-authoring.test.cjs`
- if_blocked:
  - `Record the blocker in Progress Log and leave this queue active or blocked.`
- promote_next_if_done: `version-review`
- stop_if:
  - `The fix requires runtime export/loading conversion or unrelated workspace redesign.`

##### Human Context

- task_brief:
  - `Repair the operator-reported mounted NPC add-row regression and cover mounted-building deletion.`
- task_outcome_summary:
  - `Completed. The root cause was that appendScriptEditorCityMountedBuildingNpc added an empty NPC id and immediately passed the city through full normalization, which filtered the empty row before the UI could render a selectable dropdown. Mounted-building deletion was verified at helper level and covered by a focused regression test.`
- Purpose:
  - `Make the city profile's mounted-building editor behave as an editable form instead of treating a newly added blank NPC row as persisted invalid data.`
- Failure mode:
  - `If full normalization runs during edit-row creation, the UI will keep showing no change when the operator clicks add NPC.`

##### Progress Log

- `2026-07-16`: `Operator regression evidence reopened this closed queue: 新增 NPC had no effect, and 删除挂载建筑 was reported ineffective in the script editor workspace.`
- `2026-07-16`: `RED confirmed with node --test tests/city-building-mount-authoring.test.cjs: appendScriptEditorCityMountedBuildingNpc returned npcIds=[] instead of preserving a selectable row. Mounted-building deletion helper coverage passed, separating the delete report from the add-row normalization root cause.`
- `2026-07-16`: `Fixed the mounted-building editing helpers so row-level edit operations preserve authoring/editing state instead of running full persistence normalization on each click. Follow-up UI hardening now makes the 新增 NPC button insert the first available unmounted NPC id so the row remains visible after city-detail normalization. Focused verification passed: npm run build:test; node --test tests/city-building-mount-authoring.test.cjs.`

### Historical Handoff Note

- Task ID:
  - `task.script-editor-city-building-mount-npc-authoring.queue-closeout-and-handoff`
- Recorded handoff at closure:
  - `Closed the bounded city-owned building/NPC mounting authoring queue and routed queue.script-editor-city-building-mount-export-runtime-convergence for export/runtime conversion.`
- Recorded expected output:
  - `A script-editor city authoring surface that can persist mounted building, mounted NPC, and primary NPC selections for a later runtime lowering queue.`

### Historical Candidate Notes

- `queue.script-editor-city-building-mount-export-runtime-convergence`
  - State:
    - `future-version-review`
  - Reason:
    - `Expected follow-up candidate after city-side mounting authoring lands, unless baseline proves export/runtime conversion must be absorbed into the same admitted slice.`

### Historical Snapshot (2026-07-16)

- `Queue admitted as the eighth execution queue for target.city-building-definition-location-access-convergence after the map city-list compatibility queue closed and version review found the deferred city-side mounting authoring candidate still lawful.`
