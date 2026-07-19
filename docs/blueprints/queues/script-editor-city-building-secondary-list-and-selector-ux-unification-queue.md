# Script Editor City Building Secondary List And Selector UX Unification Queue

## Control Block

- queue_id: `queue.script-editor-city-building-secondary-list-and-selector-ux-unification`
- belongs_to_version: `target.city-building-module-entry-and-project-startup-authoring`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-19`
- governance_sync_source: `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`
- queue_status: `active`
- queue_class: `future-target-candidate`
- active_task: `task.script-editor-city-building-secondary-list-and-selector-ux-unification.queue-closeout-and-handoff`
- next_task: `none`
- closeout_status: `not-started`
- execution_closeout_status: `partial`
- topic_closure_status: `open-residue`
- closure_basis: `none`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `none`
- sync_status: `pending`
- sync_scope: `local-record`
- sync_summary: `Implementation completed locally for secondary list search and project-backed selector UX; no implementation commit has been created for this queue.`
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
  - `Unify Script Editor secondary list/search/add/delete/pagination shells and detail-page selector UX across city, building, story node, dialogue, event, minigame, and text authoring surfaces.`
- Forbidden expansions:
  - `Do not reopen city/building enter-state authoring or locationAccess gate semantics.`
  - `Do not change EventBindingRuntime semantics.`
  - `Do not change runtime startup/module behavior unless evidence-anchor reconcile proves a selector UI requires a narrow authoring-only adapter.`
  - `Do not use this queue to fix unrelated encoding integrity guard work.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-CITY-BUILDING-ENTER-STATE-006`
  - `ACC-CITY-BUILDING-ENTER-STATE-007`
  - `ACC-CITY-BUILDING-ENTER-STATE-008`
- acceptance_not_claimed:
  - `ACC-CITY-BUILDING-ENTER-STATE-001`
  - `ACC-CITY-BUILDING-ENTER-STATE-002`
  - `ACC-CITY-BUILDING-ENTER-STATE-003`
  - `ACC-CITY-BUILDING-ENTER-STATE-004`
  - `ACC-CITY-BUILDING-ENTER-STATE-005`
- minimum_verification:
  - `npm run lint:blueprints`

### Claim Boundary

#### Can Claim

- `ACC-CITY-BUILDING-ENTER-STATE-006: City, building, story node, dialogue, event, minigame, and text secondary object lists share search, add, delete, list, and pagination behavior.`
- `ACC-CITY-BUILDING-ENTER-STATE-007: Detail-page internal selectors use a consistent selector interaction language instead of ad hoc free-text id entry where a project-backed data source exists.`
- `ACC-CITY-BUILDING-ENTER-STATE-008: Simulated-human tests execute every declared editor surface and selector flow, recording all failed steps before fixing and rerunning without skipping cases.`

#### Cannot Claim

- `City/building enter-state controls or locationAccess runtime semantics.`
- `Runtime preview green-frame browser proof from the prior queue.`
- `Encoding-integrity prevention for mojibake-sensitive UI files.`
- `New gameplay runtime support beyond authoring selector/list UX.`

#### Legacy Paths To Replace

- `Fragmented secondary list shells where some families lack search, add, delete, list, or pagination.`
- `Detail-page internal selectors that use free-text ids despite project data sources being available.`
- `Manual acceptance that samples only one editor family while claiming all families.`

#### Compatibility Paths To Preserve

- `Existing record ids and project data shapes.`
- `Existing runtime export/load/startup semantics.`
- `EventBindingRuntime semantics.`
- `City/building enter-state and locationAccess behavior from the closed predecessor queue.`

#### Implementation Anchors

- Must inspect:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/script-editor/**`
  - `src/application/script-editor/**`
  - `tests/**`
- Must modify:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/script-editor/**`
  - `src/application/script-editor/**`
  - `tests/**`
- Must preserve:
  - `CityModule and BuildingModule runtime entry contracts.`
  - `Scenario-pack export/load/startup semantics.`
  - `EventBindingRuntime semantics.`
  - `Existing city/building enter-condition behavior.`

#### Verification Coverage

- `Focused source/UI tests for all listed secondary surfaces.`
- `Focused selector tests for detail-page internal selectors that have project-backed data sources.`
- `Simulated-human browser flow covering every declared test case without skipping cases.`
- `npm run typecheck`
- `npm run lint:blueprints`
- `npm test`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-19-city-building-module-entry-and-project-startup-authoring-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`

### Queue Snapshot

- queue_goal: `Unify Script Editor secondary list/search/add/delete/pagination shells and detail-page selector UX across the remaining authoring families.`
- task_count: `3`
- completed_task_count: `2`
- remaining_task_count: `1`
- active_task_summary: `Verify the secondary list and selector UX queue and return to version review without version closeout.`
- task_briefs:
  - `task.script-editor-city-building-secondary-list-and-selector-ux-unification.evidence-anchor-reconcile: Confirm current secondary list and selector UX drift before implementation.`
  - `task.script-editor-city-building-secondary-list-and-selector-ux-unification.implementation: Implement shared secondary list/search/add/delete/pagination and selector UX normalization test-first.`
  - `task.script-editor-city-building-secondary-list-and-selector-ux-unification.queue-closeout-and-handoff: Verify the queue and return to version review without version closeout.`

### Operator Snapshot Contract

- `The fixed operator receipt must source current queue from queue_id.`
- `The fixed operator receipt must source current task from active_task.`
- `The fixed operator receipt must source current queue goal from queue_goal.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-city-building-secondary-list-and-selector-ux-unification.evidence-anchor-reconcile` | `done` | `Confirm current secondary list and selector UX drift before implementation.` | `none` | `Completed on 2026-07-19. Source review found people already has search/add/delete/list/pagination; city, building, story node, dialogue, event, minigame, and text have add/delete/list/pagination but lack the people-style search control. Detail selectors also remain inconsistent: examples include building cityId text entry, location menu targetId text entry, and building entry event id text entry where project-backed selectors should be used.` |
| `task.script-editor-city-building-secondary-list-and-selector-ux-unification.implementation` | `done` | `Implement shared secondary list/search/add/delete/pagination and selector UX normalization test-first.` | `task.script-editor-city-building-secondary-list-and-selector-ux-unification.evidence-anchor-reconcile` | `Completed on 2026-07-19. RED covered all-family secondary search controls, project-backed selector replacement, and clearing current search before adding a record. GREEN added shared search rendering/filtering, project-backed city/menu/building-entry selects, stale menu target clearing, and add-record search reset.` |
| `task.script-editor-city-building-secondary-list-and-selector-ux-unification.queue-closeout-and-handoff` | `active` | `Verify the queue and return to version review without version closeout.` | `task.script-editor-city-building-secondary-list-and-selector-ux-unification.implementation` | `Active. Requires queue closeout guard and final Blueprint sync; browser evidence is recorded in the implementation outcome.` |

### Task Definitions

#### `task.script-editor-city-building-secondary-list-and-selector-ux-unification.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.script-editor-city-building-secondary-list-and-selector-ux-unification.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/specs/2026-07-19-city-building-module-entry-and-project-startup-authoring-target.md`
  - `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/script-editor/**`
  - `src/application/script-editor/**`
  - `tests/**`
- must_inspect:
  - `current secondary list implementations for city, building, story node, dialogue, event, minigame, and text`
  - `current detail-page internal selectors`
  - `existing person secondary list pattern`
- must_not_change:
  - `Do not implement feature code before evidence_lock_status is locked.`
  - `Do not widen into runtime semantics, enter-state behavior, or encoding guards.`
- done_when:
  - `Evidence Lock is locked or the queue is blocked with a concrete reason.`
  - `Can Claim and Cannot Claim still match ACC-006..008.`
  - `Must inspect, must modify, must preserve, and minimum verification are recorded.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Return to version review or split a prerequisite queue.`
- promote_next_if_done: `task.script-editor-city-building-secondary-list-and-selector-ux-unification.implementation`
- stop_if:
  - `source evidence shows this queue must split into list-shell and detail-selector queues before implementation`
  - `selector normalization requires runtime contract changes`

##### Human Context

- task_brief:
  - `Confirm the secondary list and selector UX boundary before implementation.`
- task_outcome_summary:
  - `Done. Evidence confirmed the smallest lawful slice: keep runtime semantics unchanged, preserve city/building enter-state behavior, add people-style search to city/building/story/dialogue/event/minigame/text secondary lists, and normalize project-backed detail selectors that still use ad hoc ids. The implementation task is now active.`
- Purpose:
  - `Prevent the queue from hiding missing editor-surface coverage behind one narrow sampled path.`
- Failure mode:
  - `The implementation starts changing one family before the all-family list/selector inventory is locked.`

#### `task.script-editor-city-building-secondary-list-and-selector-ux-unification.implementation`

##### Control Block

- task_id: `task.script-editor-city-building-secondary-list-and-selector-ux-unification.implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/script-editor/**`
  - `src/application/script-editor/**`
  - `tests/**`
- must_inspect:
  - `evidence-anchor reconcile outcome`
  - `person secondary list pattern`
  - `all affected family renderers and selector handlers`
- must_modify:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/script-editor/**`
  - `src/application/script-editor/**`
  - `tests/**`
- must_preserve:
  - `runtime export/load/startup semantics`
  - `EventBindingRuntime semantics`
  - `city/building enter-state and locationAccess behavior`
- must_not_change:
  - `runtime support declarations`
  - `encoding-integrity guard scope`
- done_when:
  - `All declared secondary surfaces expose consistent search/add/delete/list/pagination behavior.`
  - `Project-backed internal selectors are normalized away from ad hoc text entry where supported.`
  - `Simulated-human test plan records all failed steps before fixes and reruns every case after fixes.`
- verify_with:
  - `focused tests`
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- if_blocked:
  - `Record the blocker and do not narrow the queue by silently dropping families.`
- promote_next_if_done: `task.script-editor-city-building-secondary-list-and-selector-ux-unification.queue-closeout-and-handoff`
- stop_if:
  - `the queue needs a runtime contract change`
  - `the browser test matrix cannot be enumerated before implementation`

##### Human Context

- task_brief:
  - `Implement secondary list/search/add/delete/pagination and selector UX normalization test-first.`
- task_outcome_summary:
  - `Done. RED first failed on missing all-family search controls and project-backed selectors, then failed on the browser-discovered add-record/search interaction where a new record stayed hidden under an unmatched search filter. GREEN added a shared search helper for people, cities, buildings, storyNodes, dialogues, events, minigames, and textEntries; generic filtering across id/name/title/text/description/summary; project-backed selects for building cityId, location menu targetId, building default person, and building enter/leave events; targetId clearing when targetFamily changes; and current-family search reset before adding a record. Focused tests, npm run typecheck, npm run lint:blueprints, and npm test passed. Browser simulated-human rerun covered all eight family list surfaces with search filtering, add, delete, visible buttons, pagination where data exceeds six records, and selector replacement checks. Browser keyboard-control clearing of the search input was inconclusive because Control/Backspace events did not change the focused input value in the automation layer; the product add-record path now clears search and was verified in browser. EventBindingRuntime and runtime semantics were not changed.`
- Purpose:
  - `Make Script Editor authoring surfaces complete and consistent instead of only fixing the city/building path.`
- Failure mode:
  - `A partial implementation claims all-family coverage after testing only one or two surfaces.`

#### `task.script-editor-city-building-secondary-list-and-selector-ux-unification.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-city-building-secondary-list-and-selector-ux-unification.queue-closeout-and-handoff`
- state: `pending`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/queues/script-editor-city-building-secondary-list-and-selector-ux-unification-queue.md`
  - `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`
  - `docs/blueprints/project-progress.md`
  - `tests/**`
- must_inspect:
  - `implementation task outcome`
  - `full verification output`
  - `simulated-human browser evidence for every declared case`
- must_not_change:
  - `version closeout`
  - `runtime semantics`
- done_when:
  - `Queue closeout records all-family list/selector coverage or explicit blockers.`
  - `Blueprint lint passes.`
  - `Version review remains separate unless explicitly requested.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker in queue and version truth.`
- promote_next_if_done: `version-promotion-review`

##### Human Context

- task_brief:
  - `Verify the secondary list/selector UX slice and return to version review without automatic version closeout.`
- task_outcome_summary:
  - `queued`
- Purpose:
  - `Prevent closeout from claiming complete authoring coverage without every declared browser test case.`
- Failure mode:
  - `Treating a subset of editor-surface tests as complete all-family evidence.`
