# Script Editor Zhuyuanzhang Template Direct Load Queue

## Control Block

- queue_id: `queue.script-editor-zhuyuanzhang-template-direct-load`
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
- topic_closure_status: `closed`
- closure_basis: `The script editor 使用模板 entrypoint now loads the bundled zhuyuanzhang scenario pack directly from /scenario-packs/zhuyuanzhang/pack.json through the existing compatibility import path. The UI no longer clicks a hidden pack file input for this action, and the direct URL import path is covered by regression tests.`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `success`
- sync_scope: `baseline-push`
- sync_summary: `Queue truth committed on codex/mod-first-dev-20260716-sync-worktree, pushed to origin/codex/mod-first-dev-20260716-sync-worktree, and fast-forward pushed to origin/mod-first-dev after focused URL/template tests, typecheck, full tests, Blueprint lint, and governance check passed.`
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
  - `Make the script editor 使用模板 entrypoint directly load the bundled zhuyuanzhang scenario pack instead of opening a folder picker or requiring selected files.`
- Forbidden expansions:
  - `Do not redesign the script editor landing screen.`
  - `Do not change scenario pack manifest shape.`
  - `Do not add a template catalog, template chooser, or multi-template management flow.`
  - `Do not alter city/building runtime convergence behavior outside the import path needed for direct template loading.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-16-city-building-definition-location-access-convergence-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-16-city-building-definition-location-access-convergence-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/location-access-runtime-convergence-queue.md`

### Queue Snapshot

- queue_goal: `Load the built-in zhuyuanzhang scenario pack directly from the 使用模板 button.`
- task_count: `1`
- completed_task_count: `1`
- remaining_task_count: `0`
- active_task_summary: `Queue closed after direct built-in zhuyuanzhang template loading passed verification.`
- task_briefs:
  - `task.script-editor-zhuyuanzhang-template-direct-load.direct-template-load: route 使用模板 to the built-in zhuyuanzhang manifest URL and import it into the script editor without folder/file selection.`

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

- `The parent version is open with active_queue=none before admission.`
- `The version plan candidate recovery ledger records item.script-editor-zhuyuanzhang-template-direct-load as queue-candidate.`
- `All earlier current-version queues are done or reclosed, leaving this as the only remaining recorded same-version candidate.`
- `The queue is bounded to the script editor template entrypoint and can proceed without reopening previous city/building or LocationAccessRuntime queues.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, record local repository sync state.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Default Blueprint governance/documentation refinement uses local-record during execution and branch-commit at task closeout.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Activation Order

1. `Version plan review subject and basis were written first.`
2. `Version-level admission review admitted queue.script-editor-zhuyuanzhang-template-direct-load.`
3. `This queue doc is created and synchronized as the queue-level governor.`
4. `Only then may active_task be exposed and implementation continue.`

### Recovery Rule

- `Resume from this queue doc and the version-plan admission record unless new material evidence invalidates the admitted basis.`
- `Do not widen into a template catalog or project-selection redesign if direct zhuyuanzhang loading is sufficient.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-zhuyuanzhang-template-direct-load.direct-template-load` | `completed` | `Direct built-in zhuyuanzhang template loading is implemented and verified.` | `none` | `The 使用模板 action now loads the published zhuyuanzhang manifest URL without file selection.` |

### Task Definitions

#### `task.script-editor-zhuyuanzhang-template-direct-load.direct-template-load`

##### Control Block

- task_id: `task.script-editor-zhuyuanzhang-template-direct-load.direct-template-load`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-zhuyuanzhang-template-direct-load-queue.md`
  - `docs/blueprints/plans/2026-07-16-city-building-definition-location-access-convergence-target-plan.md`
  - `docs/blueprints/project-progress.md`
  - `docs/change-log.md`
- must_inspect:
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `scenario pack manifest shape`
  - `script editor landing screen layout beyond the action behavior`
  - `city/building runtime convergence behavior outside direct template import`
  - `house or playable runtime behavior`
- done_when:
  - `The 使用模板 button loads /scenario-packs/zhuyuanzhang/pack.json directly instead of clicking a file input or opening a directory picker.`
  - `The loaded built-in pack is converted into a ScriptEditorProjectDefinition through the existing compatibility import path.`
  - `Import failure reports a warning notice without leaving stale successful state.`
  - `Regression coverage proves the direct URL loader and UI action wiring.`
- verify_with:
  - `npm run build:test`
  - `node --test --test-name-pattern "script editor (template action directly loads|imports built-in zhuyuanzhang template)" tests/robustness.test.cjs`
  - `npm run typecheck`
  - `npm test`
  - `npm run lint:blueprints`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record the blocker in Progress Log and leave the queue active or blocked.`
- promote_next_if_done: `version-review`
- stop_if:
  - `The implementation requires a template catalog or broader project-selection redesign.`

##### Human Context

- task_brief:
  - `Make 使用模板 directly open the bundled zhuyuanzhang scenario pack as a script editor project.`
- task_outcome_summary:
  - `Completed. Runtime-pack import now exposes a URL import helper, and the main UI 使用模板 action loads /scenario-packs/zhuyuanzhang/pack.json directly into the script editor workspace.`
- Purpose:
  - `Let creators start from the built-in zhuyuanzhang baseline without selecting the package directory manually.`
- Failure mode:
  - `If the button still opens a picker, the bundled template remains inaccessible as a one-click authoring baseline.`

##### Progress Log

- `2026-07-16`: `Queue admitted from the remaining version candidate after the prior branch was pushed and fast-forwarded to origin/mod-first-dev.`
- `2026-07-16`: `RED coverage added. Focused test currently fails because main-ui lacks DEFAULT_SCRIPT_EDITOR_TEMPLATE_SCENARIO_PACK_URL / loadScriptEditorProjectFromScenarioPackUrl wiring and runtime-pack-import does not yet export the URL import helper.`
- `2026-07-16`: `Implemented loadScriptEditorProjectFromScenarioPackUrl by reusing loadScenarioPackFromUrl and importScenarioPackToScriptEditorProject. The main UI 使用模板 action now calls the helper with /scenario-packs/zhuyuanzhang/pack.json instead of clicking [data-script-editor-pack-file].`
- `2026-07-16`: `Focused verification passed with npm run build:test plus node --test --test-name-pattern "script editor (template action directly loads|imports built-in zhuyuanzhang template)" tests/robustness.test.cjs. Full verification passed with npm run typecheck, npm test (581 pass, 0 fail), npm run lint:blueprints, and npm run blueprint:governance:check.`
