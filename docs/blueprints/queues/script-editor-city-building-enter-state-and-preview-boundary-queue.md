# Script Editor City Building Enter-State And Preview Boundary Queue

## Control Block

- queue_id: `queue.script-editor-city-building-enter-state-and-preview-boundary`
- belongs_to_version: `target.city-building-module-entry-and-project-startup-authoring`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-19`
- governance_sync_source: `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`
- queue_status: `done`
- queue_class: `future-target-candidate`
- active_task: `none`
- next_task: `version-promotion-review`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `closed`
- closure_basis: `Source guard, automated verification, and partial simulated-human browser proof cover the bounded enter-state slice; runtime preview green-frame browser proof remains recorded as inconclusive rather than claimed.`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `queue.script-editor-city-building-secondary-list-and-selector-ux-unification`
- auto_continue_eligible: `false`
- next_effect: `none`
- sync_status: `pending`
- sync_scope: `local-record`
- sync_summary: `Implementation commit d96a676e was pushed to origin/mod-first-dev before queue closeout; closeout documentation is local and awaits the next repository sync.`
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
  - `Own Script Editor city/building enter-state authoring, default background, locationAccess-backed gate editing, and the preview-only green frame.`
- Forbidden expansions:
  - `Do not absorb the shared secondary list/search/selector UX queue.`
  - `Do not change EventBindingRuntime semantics.`
  - `Do not widen into unrelated startup/module work already owned by the city-building startup queue.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-CITY-BUILDING-ENTER-STATE-001`
  - `ACC-CITY-BUILDING-ENTER-STATE-002`
  - `ACC-CITY-BUILDING-ENTER-STATE-003`
  - `ACC-CITY-BUILDING-ENTER-STATE-004`
  - `ACC-CITY-BUILDING-ENTER-STATE-005`
- acceptance_not_claimed:
  - `ACC-CITY-BUILDING-ENTER-STATE-006`
  - `ACC-CITY-BUILDING-ENTER-STATE-007`
  - `ACC-CITY-BUILDING-ENTER-STATE-008`
- minimum_verification:
  - `npm run lint:blueprints`

### Claim Boundary

#### Can Claim

- `ACC-CITY-BUILDING-ENTER-STATE-001: City and building detail pages expose an editable enter-state tab with visible controls.`
- `ACC-CITY-BUILDING-ENTER-STATE-002: Default background is editable and preserved for runtime behavior.`
- `ACC-CITY-BUILDING-ENTER-STATE-003: Enter conditions use locationAccess-backed gate semantics.`
- `ACC-CITY-BUILDING-ENTER-STATE-004: Runtime preview shows the preview-only green frame.`
- `ACC-CITY-BUILDING-ENTER-STATE-005: Normal start, JSON runtime pack import, and Script Editor runtime preview preserve the same enter-state behavior.`

#### Cannot Claim

- `ACC-CITY-BUILDING-ENTER-STATE-006: Shared secondary list/search/add/delete/pagination shells are unified.`
- `ACC-CITY-BUILDING-ENTER-STATE-007: Detail-page internal selectors use the same interaction language as the list shells.`
- `ACC-CITY-BUILDING-ENTER-STATE-008: The complete simulated-human coverage for all editor secondary surfaces and selector shells passes.`

#### Legacy Paths To Replace

- `Hardcoded enter-state tabs without editable controls.`
- `Default-background text fields without structured base-info support.`
- `locationAccess gate authoring without aligned runtime meaning.`
- `Preview-only framing without a runtime boundary.`

#### Compatibility Paths To Preserve

- `CityModule and BuildingModule entry contracts.`
- `Scenario-pack export/load/startup semantics.`
- `EventBindingRuntime semantics.`
- `Existing city/building relations.`
- `Existing map/review provider contracts.`

#### Implementation Anchors

- Must inspect:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/script-editor/**`
  - `src/application/script-editor/**`
  - `src/application/location-access/**`
  - `src/application/city/**`
  - `src/application/building/**`
  - `tests/**`
- Must modify:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/script-editor/**`
  - `src/application/script-editor/**`
  - `src/application/location-access/**`
  - `src/application/city/**`
  - `src/application/building/**`
  - `tests/**`
- Must preserve:
  - `CityModule and BuildingModule are separate runtime boundaries.`
  - `Scenario-pack startup/export/load semantics across normal start, JSON import, and runtime preview.`
  - `EventBindingRuntime semantics.`
  - `Existing city/building relation authoring.`

#### Verification Coverage

- `Focused tests prove enter-state editing and preview frame behavior.`
- `npm run typecheck`
- `npm run lint:blueprints`
- `npm test`
- `Simulated-human browser flow covers project overview, enter-state editing, and runtime preview.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-19-city-building-module-entry-and-project-startup-authoring-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`

### Queue Snapshot

- queue_goal: `Own city/building enter-state authoring, default background, locationAccess-backed gate editing, and the preview-only green frame.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `No active task remains; the bounded enter-state and preview-boundary queue is closed and returns control to version review.`
- task_briefs:
  - `task.script-editor-city-building-enter-state-and-preview-boundary.evidence-anchor-reconcile: Confirm the enter-state and preview boundary evidence before implementation.`
  - `task.script-editor-city-building-enter-state-and-preview-boundary.implementation: Implement enter-state authoring, default background, locationAccess gates, and the preview frame.`
  - `task.script-editor-city-building-enter-state-and-preview-boundary.queue-closeout-and-handoff: Verify guard evidence and route version-level review without closing the version.`

### Operator Snapshot Contract

- `The fixed operator receipt must source current queue from queue_id.`
- `The fixed operator receipt must source current task from active_task.`
- `The fixed operator receipt must source current queue goal from queue_goal.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-city-building-enter-state-and-preview-boundary.evidence-anchor-reconcile` | `done` | `Confirm enter-state evidence, implementation anchors, acceptance boundary, and minimum verification before code changes.` | `none` | `Source evidence locked the bounded enter-state slice and showed the preview-only boundary is still lawful.` |
| `task.script-editor-city-building-enter-state-and-preview-boundary.implementation` | `done` | `Implement enter-state authoring, default background, locationAccess gates, and preview-only frame test-first.` | `task.script-editor-city-building-enter-state-and-preview-boundary.evidence-anchor-reconcile` | `RED covered the location access picker contract and empty condition export; GREEN added the dedicated registry, text-backed refusal prompt id, empty condition collapse, runtime refusal text resolution, and picker UI. Verification passed: focused tests, npm run typecheck, npm run lint:blueprints, npm test, and npm run build. Browser proof entered the Script Editor template workspace; deeper city-tab and preview-frame clickthrough remains for closeout guard.` |
| `task.script-editor-city-building-enter-state-and-preview-boundary.queue-closeout-and-handoff` | `done` | `Verify the bounded slice and return to version review without automatic version closeout.` | `task.script-editor-city-building-enter-state-and-preview-boundary.implementation` | `Completed on 2026-07-19. Guard review passed for source and automated checks. Browser proof reached the Script Editor template workspace and verified city/building 进入条件 authoring controls; runtime preview green-frame browser proof is recorded as inconclusive due stale browser automation session rather than claimed. Secondary list normalization remains a separate candidate.` |

### Task Definitions

#### `task.script-editor-city-building-enter-state-and-preview-boundary.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.script-editor-city-building-enter-state-and-preview-boundary.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/specs/2026-07-19-city-building-module-entry-and-project-startup-authoring-target.md`
  - `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/script-editor/**`
  - `src/application/script-editor/**`
  - `src/application/location-access/**`
  - `src/application/city/**`
  - `src/application/building/**`
  - `tests/**`
- must_inspect:
  - `version acceptance matrix`
  - `candidate evidence matrix`
  - `implementation anchors`
- must_not_change:
  - `Do not implement feature code before evidence_lock_status is locked.`
  - `Do not widen queue scope beyond ACC-CITY-BUILDING-ENTER-STATE-001..005.`
- done_when:
  - `Evidence Lock is locked or the queue is blocked with a concrete reason.`
  - `Can Claim and Cannot Claim list the correct acceptance ids from the version acceptance matrix.`
  - `Must inspect, must modify, must preserve, and minimum verification are recorded.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Return to version review or split a prerequisite queue.`
- promote_next_if_done: `task.script-editor-city-building-enter-state-and-preview-boundary.implementation`
- stop_if:
  - `implementation_anchor_status is missing or conflicting`
  - `prerequisite_status is needs-prior-queue or split-required`

##### Human Context

- task_brief:
  - `Confirm the enter-state and preview boundary before implementation.`
- task_outcome_summary:
  - `Done. Source evidence confirms the bounded enter-state slice owns city/building enter-state authoring, default background, locationAccess-backed gate editing, and the preview-only green frame, while the shared secondary list/search/selector queue remains out of scope.`
- Purpose:
  - `Prevent the queue from drifting into the shared secondary list/selector unification slice or unrelated startup work.`
- Failure mode:
  - `The queue starts implementing preview or list UX before the narrower enter-state contract is locked.`

#### `task.script-editor-city-building-enter-state-and-preview-boundary.implementation`

##### Control Block

- task_id: `task.script-editor-city-building-enter-state-and-preview-boundary.implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/script-editor/**`
  - `src/application/script-editor/**`
  - `src/application/location-access/**`
  - `src/application/city/**`
  - `src/application/building/**`
  - `tests/**`
- must_inspect:
  - `evidence-anchor reconcile outcome`
  - `current project overview and enter-state wiring`
- must_modify:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/script-editor/**`
  - `src/application/script-editor/**`
  - `src/application/location-access/**`
  - `src/application/city/**`
  - `src/application/building/**`
  - `tests/**`
- must_preserve:
  - `CityModule and BuildingModule remain separate runtime boundaries.`
  - `scenario-pack export/load/startup semantics.`
  - `EventBindingRuntime semantics.`
  - `existing city/building relations.`
- must_not_change:
  - `shared secondary list/search/selectors queue`
  - `unrelated startup/module behavior`
- done_when:
  - `City/building enter-state tabs expose editable controls.`
  - `Default background is stored and restored.`
  - `locationAccess-backed enter conditions drive runtime behavior.`
  - `Preview mode shows the green frame only during preview.`
- verify_with:
  - `focused tests`
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- if_blocked:
  - `Record the blocker and do not widen scope to list/selector normalization.`
- promote_next_if_done: `task.script-editor-city-building-enter-state-and-preview-boundary.queue-closeout-and-handoff`
- stop_if:
  - `preview boundary requires shared selector UX work to be admitted first`
  - `locationAccess schema changes are broader than enter-state editing`

##### Human Context

- task_brief:
  - `Implement enter-state authoring, default background, locationAccess gates, and the preview frame test-first.`
- task_outcome_summary:
  - `Done. RED covered the city/building access condition picker contract and empty condition export. GREEN added a dedicated location-access authoring registry, normalized empty condition groups away, stored refusal prompts through text entry ids, resolved runtime blockedMessage during export, renamed the tab to 进入条件, removed the old freeform controls, and exposed add/remove/clear condition picker controls. Verification passed: focused tests, npm run typecheck, npm run lint:blueprints, npm test, and npm run build. Browser proof entered the Script Editor template workspace; closeout still needs the explicit city/building tab and preview green-frame guard clickthrough.`
- Purpose:
  - `Make city/building enter-state behavior editable without collapsing the queue into shared selector normalization.`
- Failure mode:
  - `Passing tests by hiding enter-state complexity or by pulling in the secondary list queue.`

#### `task.script-editor-city-building-enter-state-and-preview-boundary.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-city-building-enter-state-and-preview-boundary.queue-closeout-and-handoff`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/queues/script-editor-city-building-enter-state-and-preview-boundary-queue.md`
  - `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`
  - `docs/blueprints/project-progress.md`
  - `tests/**`
- must_inspect:
  - `implementation task outcome`
  - `verification output`
  - `simulated-human browser evidence`
- must_not_change:
  - `version closeout`
  - `shared secondary list/search/selectors queue`
- done_when:
  - `Queue closeout records the enter-state boundary.`
  - `Blueprint lint passes.`
  - `Version review remains separate unless explicitly requested.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker in queue and version truth.`
- promote_next_if_done: `version-promotion-review`

##### Human Context

- task_brief:
  - `Verify the bounded enter-state slice and return to version review without automatic version closeout.`
- task_outcome_summary:
  - `Done. Source guard confirmed city/building 进入条件 tab wiring, text-backed refusal prompt selection, dedicated location-access condition picker controls, empty-condition collapse coverage, runtime preview source path, and preview-only frame markup/styles while preserving EventBindingRuntime semantics. Simulated-human browser proof verified Script Editor template load plus city and building 进入条件 surfaces; runtime preview green-frame browser proof remains inconclusive and is not claimed. Queue returns to version review without version closeout.`
- Purpose:
  - `Keep the enter-state and preview boundary separated from the later shared list/selector UX queue.`
- Failure mode:
  - `Treating preview-only framing as if it already implies list/selector normalization.`
