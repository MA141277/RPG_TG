# Script Editor Scenario Profile Startup Export Convergence Queue

## Control Block

- queue_id: `queue.script-editor-scenario-profile-startup-export-convergence`
- belongs_to_version: `target.script-editor-runtime-pack-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-14`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `done`
- queue_class: `required`
- active_task: `none`
- next_task: `return-to-version-review`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `closed`
- closure_basis: `The scenarioProfile startup export gap is closed: script-editor export now preserves declared runtime startup fields, and regression coverage proves a Zhu Yuanzhang import -> script-editor export -> JSON startup coordinator path bootstraps event.story.zhu_yuanzhang.ordination.`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `none`
- sync_status: `pending`
- sync_scope: `none`
- sync_summary: `Queue implementation and governance closeout are written; repository sync is pending until the verified batch is committed and pushed.`
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
  - `Preserve scenarioProfile runtime startup fields through script-editor import/export so a runtime pack exported from the editor can be imported from the main JSON button and start its opening event normally.`
- Forbidden expansions:
  - `Do not introduce a compatibility fallback that guesses an opening event from scenes or events.`
  - `Do not reopen closed activities, 12-family export, or minimal narrative lowering queues unless fresh evidence proves same-family regression.`
  - `Do not add startup-only reconstruction logic to hide missing exported scenarioProfile truth.`
  - `Do not widen into unrelated editor UI, asset pipeline, or gameplay changes.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`

### Queue Snapshot

- queue_goal: `Make script-editor-exported scenarioProfile data remain startup-complete, including entryEventId and other declared runtime bootstrap fields, so JSON-imported packs can run instead of merely parsing.`
- task_count: `2`
- completed_task_count: `2`
- remaining_task_count: `0`
- active_task_summary: `none; queue is closed and returns control to the version plan.`
- task_briefs:
  - `task.script-editor-scenario-profile-startup-export-convergence.profile-runtime-field-preservation: reproduce the missing startup field, preserve declared profile runtime fields in export, and verify JSON-import startup behavior.`
  - `task.script-editor-scenario-profile-startup-export-convergence.queue-closeout-and-handoff: synchronize queue, version, and project-progress truth after verification.`

### Admission Preconditions

- `The active version is target.script-editor-runtime-pack-unification and currently has no active queue.`
- `Fresh user evidence supplies a runtime pack exported from the script editor that loadScenarioPackFromFiles accepts, but JSON startup cannot run normally.`
- `Inspection shows the exported scenario-profile.json lost entryEventId while the events and scenes families still contain the opening story content.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-scenario-profile-startup-export-convergence.profile-runtime-field-preservation` | `completed` | `Preserved scenarioProfile startup fields and proved the exported pack can bootstrap its opening event after JSON import.` | `none` | `Root cause was export-side profile field narrowing in src/application/script-editor/runtime-pack-export.ts.` |
| `task.script-editor-scenario-profile-startup-export-convergence.queue-closeout-and-handoff` | `completed` | `Closed the queue after verification and synced version/project-progress truth.` | `task.script-editor-scenario-profile-startup-export-convergence.profile-runtime-field-preservation` | `No version closeout is implied by this queue alone.` |

### Task Definitions

#### `task.script-editor-scenario-profile-startup-export-convergence.profile-runtime-field-preservation`

##### Control Block

- task_id: `task.script-editor-scenario-profile-startup-export-convergence.profile-runtime-field-preservation`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/startup/startup-session-coordinator.ts`
  - `src/domain/scenario-profile.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/startup/startup-session-coordinator.ts`
  - `src/domain/scenario-profile.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `activities import/export behavior`
  - `closed 12 runtime-family ownership behavior`
  - `minimal dialogue/storyNode lowering rules`
  - `startup fallback behavior that guesses missing entry events`
- done_when:
  - `Script-editor export preserves declared scenarioProfile startup/runtime fields such as entryEventId, initialCalendar, initialPlayerCoordinate, initialUi, initialRuntime, openingFlowId, and tags.`
  - `A Zhu Yuanzhang import -> script-editor export -> JSON startup coordinator regression bootstraps event.story.zhu_yuanzhang.ordination.`
  - `The user-provided exported pack root cause is explained by the missing exported entryEventId.`
- verify_with:
  - `npm run build:test`
  - `node --test tests/robustness.test.cjs --test-name-pattern "scenario profile startup fields"`
  - `npm run typecheck`
  - `npm run test`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker in this queue doc instead of adding startup guessing or compatibility fallback.`
- promote_next_if_done: `task.script-editor-scenario-profile-startup-export-convergence.queue-closeout-and-handoff`
- stop_if:
  - `Fresh reproduction proves the failure is not caused by exported scenarioProfile startup field loss.`

##### Human Context

- task_brief:
  - `Make the exported scenarioProfile startup-complete rather than merely schema-valid.`
- task_outcome_summary:
  - `Completed after export preserved declared scenarioProfile runtime startup fields and the Zhu Yuanzhang JSON-import startup regression bootstrapped event.story.zhu_yuanzhang.ordination.`
- Purpose:
  - `Close the gap between editor export success and main JSON import runtime usability.`
- Failure mode:
  - `Do not make startup guess an opening event when export has dropped explicit runtime truth.`

#### `task.script-editor-scenario-profile-startup-export-convergence.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-scenario-profile-startup-export-convergence.queue-closeout-and-handoff`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-scenario-profile-startup-export-convergence-queue.md`
  - `docs/change-log.md`
- must_inspect:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-scenario-profile-startup-export-convergence-queue.md`
- must_not_change:
  - `version closeout without explicit acceptance evidence`
  - `repository sync truth before verification`
- done_when:
  - `Queue truth, version truth, and project-progress truth are synchronized.`
  - `Verification evidence is recorded.`
  - `Any remaining residue is explicitly classified and routed.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker explicitly in this queue doc.`
- promote_next_if_done: `return-to-version-review`

##### Human Context

- task_brief:
  - `Close or hand back the scenarioProfile startup export queue after verification.`
- task_outcome_summary:
  - `Completed after npm run typecheck, npm run lint:blueprints, and npm run test passed, and the queue returned control to version review.`

### Family Disposition And Closeout Evidence

- Disposition:
  - `scenarioProfile startup/runtime fields are no longer narrowed away during script-editor runtime export. The exporter preserves validated JSON-compatible values for entryEventId, initialCalendar, initialPlayerCoordinate, initialUi, initialRuntime, openingFlowId, and tags while still rebuilding required id/title/player/location fields from validated contract truth.`
- Implementation evidence:
  - `src/application/script-editor/runtime-pack-export.ts now clones declared optional scenarioProfile runtime fields before emitting scenario-profile.json.`
  - `tests/robustness.test.cjs now proves a real Zhu Yuanzhang scenario pack can be imported into the script editor, exported, loaded through the same file-import path, and handed to runStartupSessionCoordinator with entryEventId preserved.`
- Verification evidence:
  - `npm run build:test passed.`
  - `node --test tests/robustness.test.cjs --test-name-pattern "scenario profile startup fields" passed.`
  - `npm run typecheck passed.`
  - `npm run lint:blueprints passed.`
  - `npm run test passed with 490 passing tests.`
