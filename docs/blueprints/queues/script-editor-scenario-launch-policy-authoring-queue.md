# Script Editor Scenario Launch Policy Authoring Queue

## Control Block

- queue_id: `queue.script-editor-scenario-launch-policy-authoring`
- belongs_to_version: `target.script-editor-authoring-data-structure-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-16`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `active`
- queue_class: `required-priority`
- active_task: `task.script-editor-scenario-launch-policy-authoring.launch-policy-contract-implementation`
- next_task: `task.script-editor-scenario-launch-policy-authoring.queue-closeout-and-handoff`
- closeout_status: `in-progress`
- execution_closeout_status: `partial`
- topic_closure_status: `open-residue`
- closure_basis: `none`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `execute-active-task`
- sync_status: `pending`
- sync_scope: `branch-push`
- sync_summary: `Queue admitted after scene runtime task input propagation closeout commit 80fdb34 was pushed; queue admission repository sync is pending.`
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
  - `Converge script-editor scenario launch policy authoring so exported packs can declare character-selection vs fixed-character startup, initial map/city/building/view, and entry event timing without manual JSON patching.`
- Forbidden expansions:
  - `Do not implement playable/minigame bindings in this queue.`
  - `Do not redesign the script editor workspace UI before the baseline proves the smallest required authoring surface.`
  - `Do not replace map assets or city/building content by convenience.`
  - `Do not bypass scenarioProfile as the runtime startup contract.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/script-editor-scene-runtime-task-input-propagation-queue.md`

### Queue Snapshot

- queue_goal: `Author and preserve startup launch policy fields required for editor-exported packs to enter the intended character-selection or map/city startup path.`
- task_count: `3`
- completed_task_count: `1`
- remaining_task_count: `2`
- active_task_summary: `Implement the selected storyPack.scenarioProfile launch policy authoring slice with tests.`
- task_briefs:
  - `task.script-editor-scenario-launch-policy-authoring.boundary-baseline-reconcile: inventory launch policy seams and select the smallest implementation slice.`
  - `task.script-editor-scenario-launch-policy-authoring.launch-policy-contract-implementation: implement the selected launch policy authoring/export/runtime slice with tests.`
  - `task.script-editor-scenario-launch-policy-authoring.queue-closeout-and-handoff: verify, classify residue, and return control to version review.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 褰撳墠鎵ц闃熷垪 from queue_id.`
- `The fixed operator receipt must source 褰撳墠浠诲姟 from active_task.`
- `The fixed operator receipt must source 褰撳墠闃熷垪鐩爣 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded execution slice landed and verified.`
- `topic_closure_status = closed is legal only when no still-blocking same-family residue remains inside the queue's bounded topic surface.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`
- `If residue_family = same-family and one lawful continuation exists, name it in next_family_candidate and allow automatic continuation instead of returning to open-ended human queue selection.`

### Admission Preconditions

- `Scene runtime taskInputs propagation closed with no same-family residue, so startup policy is now the smallest recorded required-priority blocker for editor-exported packs launching without manual JSON patching.`
- `Existing runtime startup already consumes scenarioProfile.launchPolicy, initialLocation, initialUi, initialRuntime, and entryEventId on the scenario pack path.`
- `The first task must prove which authoring/import/export seam is missing before production code changes.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Activation Order

1. `Version plan review subject and basis are written first.`
2. `Version-level admission review concludes before this queue becomes live execution truth.`
3. `This queue doc is created and synchronized as the queue-level governor.`
4. `Only then may active_task be exposed and implementation begin.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-scenario-launch-policy-authoring.boundary-baseline-reconcile` | `done` | `Inventoried launch policy seams and selected storyPack.scenarioProfile structured authoring as the smallest lawful slice.` | `none` | `No production code changed during baseline.` |
| `task.script-editor-scenario-launch-policy-authoring.launch-policy-contract-implementation` | `active` | `Implement the selected storyPack.scenarioProfile launch policy authoring slice with tests.` | `task.script-editor-scenario-launch-policy-authoring.boundary-baseline-reconcile` | `Must keep scenarioProfile as the startup contract.` |
| `task.script-editor-scenario-launch-policy-authoring.queue-closeout-and-handoff` | `pending` | `Verify, classify residue, and return control to version review.` | `task.script-editor-scenario-launch-policy-authoring.launch-policy-contract-implementation` | `Do not infer version closeout from this queue.` |

### Task Definitions

#### `task.script-editor-scenario-launch-policy-authoring.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-scenario-launch-policy-authoring.boundary-baseline-reconcile`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/domain/scenario-profile.ts`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/startup/startup-session-coordinator.ts`
  - `src/main.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-scenario-launch-policy-authoring-queue.md`
- must_inspect:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
  - `docs/blueprints/queues/script-editor-scene-runtime-task-input-propagation-queue.md`
  - `src/domain/scenario-profile.ts`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/startup/startup-session-coordinator.ts`
  - `src/main.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `production code before baseline reconciliation records the selected implementation slice`
  - `playable/minigame bindings`
  - `map asset files or content replacement`
  - `startup behavior outside scenarioProfile-owned launch policy semantics`
- done_when:
  - `Current launchPolicy, initialLocation, initialUi, initialRuntime, entryEventId, characterSelection, and selected-character startup seams are inventoried.`
  - `The smallest lawful implementation slice is selected, or the queue is blocked/routed to a narrower prerequisite.`
  - `A test-first implementation plan names exact files, expected startup behavior, residue posture, and verification commands for the next task.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "launchPolicy|initialLocation|entryEventId|characterSelection|scenarioProfile|startScenarioPack|startup" src tests/robustness.test.cjs`
- if_blocked:
  - `Record the blocker and return to version review if schema reference/migration freeze must precede the selected launch policy slice.`
- promote_next_if_done: `task.script-editor-scenario-launch-policy-authoring.launch-policy-contract-implementation`
- stop_if:
  - `Fresh evidence proves launch policy cannot be owned through scenarioProfile without a prerequisite schema freeze queue.`

##### Human Context

- task_brief:
  - `Find the smallest honest launch policy authoring boundary after runtime handoff queues closed.`
- task_outcome_summary:
  - `Done. Runtime scenarioProfile launch policy and startup consumption already exist; the smallest missing slice is explicit script-editor storyPack.scenarioProfile authoring/validation/export coverage for player character, initial location/view, launch policy, and entry event timing.`
- Purpose:
  - `Prevent editor-exported packs from losing startup intent such as character selection, initial map view, and entry event timing.`
- Failure mode:
  - `A compatibility-only JSON patch or main.ts special case would leave script-editor exports unable to author the startup contract directly.`

##### Progress Log

- `2026-07-16`: `Baseline found ScenarioProfileDefinition already owns playerCharacterId, initialLocation, initialUi, initialRuntime, launchPolicy, and entryEventId; runtime-pack export/import preserves valid launchPolicy and entryEventId through storyPack.scenarioProfile; startup-session-coordinator and main.ts already consume scenarioProfile launchPolicy for selected-character, initialView, and deferred entry-event behavior.`
- `2026-07-16`: `Mismatch recorded: script-editor authoring still treats storyPack.scenarioProfile as raw nested JSON plus readStringField previews/link checks, so creators lack a structured launch policy authoring surface for characterSelection, initial map/city/building/view, selected default player, and entry event timing.`
- `2026-07-16`: `Selected implementation slice: add typed script-editor scenarioProfile launch policy authoring helpers and focused storyPack workspace controls for playerCharacterId, initialLocation.mapId/cityId/houseId/view, launchPolicy.characterSelection/initialView/entryEventTiming, and entryEventId; verify export/import/runtime startup keep scenarioProfile as the single contract. main.ts compatibility branches, map asset replacement, playable/minigame binding, and schema-wide migration remain out of scope.`

#### `task.script-editor-scenario-launch-policy-authoring.launch-policy-contract-implementation`

##### Control Block

- task_id: `task.script-editor-scenario-launch-policy-authoring.launch-policy-contract-implementation`
- state: `active`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-scenario-launch-policy-authoring-queue.md`
- must_inspect:
  - `Boundary baseline evidence from task.script-editor-scenario-launch-policy-authoring.boundary-baseline-reconcile.`
  - `src/domain/scenario-profile.ts`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/startup/startup-session-coordinator.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `playable/minigame bindings`
  - `map asset files or content replacement`
  - `scenario startup paths not selected by the baseline`
- done_when:
  - `The selected launch policy slice is implemented test-first.`
  - `StoryPack scenarioProfile authoring exposes focused controls for selected launch policy fields without bypassing scenarioProfile.`
  - `Editor-authored or imported launch policy fields preserve startup intent through export/import/runtime load.`
  - `Queue documentation records implementation result and next task promotion.`
- verify_with:
  - `targeted failing robustness test for the selected launch policy slice`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
  - `npm run lint:blueprints`
  - `npm run lint:plans`
  - `npm run blueprint:governance:check`
  - `git diff --check`
- if_blocked:
  - `Record the blocker and route to version review if the baseline-selected slice requires a different prerequisite queue.`
- promote_next_if_done: `task.script-editor-scenario-launch-policy-authoring.queue-closeout-and-handoff`
- stop_if:
  - `Implementation would bypass scenarioProfile or require unrelated playable/schema/content work.`

##### Human Context

- task_brief:
  - `Implement the baseline-selected launch policy slice.`
- task_outcome_summary:
  - `Pending baseline.`
- Purpose:
  - `Make the editor-authored startup contract runtime-consumable without manual JSON patching.`
- Failure mode:
  - `Hardcoding startup behavior in main.ts would hide missing authoring data instead of fixing the exported pack contract.`

#### `task.script-editor-scenario-launch-policy-authoring.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-scenario-launch-policy-authoring.queue-closeout-and-handoff`
- state: `pending`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-scenario-launch-policy-authoring-queue.md`
- must_inspect:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-scenario-launch-policy-authoring-queue.md`
- must_not_change:
  - `version closeout state without explicit version-level acceptance`
  - `candidate queue ordering unrelated to this queue's residue`
- done_when:
  - `The queue implementation result is verified or honestly blocked.`
  - `Residue posture is recorded.`
  - `Version plan and project-progress pointers are synchronized to the next lawful state.`
  - `Repository sync is attempted and the result is recorded in queue sync fields.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:plans`
  - `npm run blueprint:governance:check`
  - `git diff --check`
- if_blocked:
  - `Record the blocker in Progress Log and leave the queue active or blocked according to the queue closeout judgement rule.`
- promote_next_if_done: `version-review`
- stop_if:
  - `Required implementation verification has not passed.`

##### Human Context

- task_brief:
  - `Verify, classify residue, and return control to version review.`
- task_outcome_summary:
  - `Pending implementation.`
- Purpose:
  - `Prevent launch policy authoring from being mistaken for full version completion.`
- Failure mode:
  - `Closing without residue classification would hide remaining startup or validation blockers.`
