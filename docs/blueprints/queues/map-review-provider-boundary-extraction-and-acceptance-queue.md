# Map Review Provider Boundary Extraction And Acceptance Queue

## Control Block

- queue_id: `queue.map-review-provider-boundary-extraction-and-acceptance`
- belongs_to_version: `target.map-review-provider-boundary-extraction`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-18`
- governance_sync_source: `docs/blueprints/plans/2026-07-18-map-review-provider-boundary-extraction-target-plan.md`
- queue_status: `active`
- queue_class: `required`
- active_task: `task.map-review-provider-boundary-extraction-and-acceptance.interface-and-adapter`
- next_task: `task.map-review-provider-boundary-extraction-and-acceptance.consumer-cutover-and-inventory`
- closeout_status: `in-progress`
- execution_closeout_status: `partial`
- topic_closure_status: `open-residue`
- closure_basis: `Queue newly admitted; implementation has not started.`
- residue_remaining: `yes`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `none`
- sync_status: `pending`
- sync_scope: `local-record`
- sync_summary: `Queue admitted locally and evidence-anchor reconcile completed; no business code implementation has started.`
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
  - `Extract map location data and in-game review lifecycle dependencies behind provider-backed module interfaces, migrate consumers, inventory and remove old direct paths, and verify complete behavior across normal start, JSON import, and Script Editor runtime preview.`
- Forbidden expansions:
  - `Do not merge map and review into one runtime mechanism.`
  - `Do not move house-specific review copy into the shared review module.`
  - `Do not change EventBindingRuntime semantics.`
  - `Do not count Zhu Yuanzhang-only behavior as general provider-backed support.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-MAP-REVIEW-PROVIDER-001`
  - `ACC-MAP-REVIEW-PROVIDER-002`
  - `ACC-MAP-REVIEW-PROVIDER-003`
  - `ACC-MAP-REVIEW-PROVIDER-004`
  - `ACC-MAP-REVIEW-PROVIDER-005`
- acceptance_not_claimed:
  - `none`
- minimum_verification:
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
  - `source guards for removed direct map/review paths`
  - `simulated human flow or browser-backed acceptance where practical`

### Claim Boundary

#### Can Claim

- `ACC-MAP-REVIEW-PROVIDER-001: map rendering consumes provider-backed markers.`
- `ACC-MAP-REVIEW-PROVIDER-002: review lifecycle truth is consumed through shared provider/policy seams.`
- `ACC-MAP-REVIEW-PROVIDER-003: removal inventory is written before cleanup and drives cleanup.`
- `ACC-MAP-REVIEW-PROVIDER-004: simulated human flow covers visible map/review behavior.`
- `ACC-MAP-REVIEW-PROVIDER-005: normal start, JSON import, and Script Editor runtime preview preserve behavior through the module contracts.`

#### Cannot Claim

- `New gameplay loop design or content expansion.`
- `House-specific review copy consolidation into the shared review module.`
- `EventBindingRuntime semantic changes.`

#### Legacy Paths To Replace

- `Map UI direct use of CityDefinition and cityCoordinatesById as marker assembly inputs.`
- `City coordinate/info assembly exposed to the map view instead of provider output.`
- `Shell code directly combining clicked map cells with city names where marker payload should drive outer navigation.`
- `Review lifecycle truth duplicated in house/time/navigation paths where provider/policy should own the decision.`

#### Compatibility Paths To Preserve

- `Existing map display, city marker visibility, city information, city click/entry, and exploration/fog behavior.`
- `Existing review countdown, due trigger, lateness/insufficient-time behavior, host entry, completion, and next-cycle update.`
- `House-local review presentation and text ownership.`
- `Normal start, JSON runtime pack import, and Script Editor runtime preview.`

#### Implementation Anchors

- Must inspect:
  - `src/ui/views/map/map-view.ts`
  - `src/application/map/map-city-marker-view-model.ts`
  - `src/application/content/active-game-content.ts`
  - `src/application/navigation/campaign-map-exploration.ts`
  - `src/application/review/review-cycle.ts`
  - `src/application/time/council-priority.ts`
  - `src/application/time/council-attendance.ts`
  - `src/application/runtime/navigation-time-follow-up.ts`
  - `src/application/house-modules/**`
  - `tests/**`
- Must modify:
  - `src/application/map/**`
  - `src/ui/views/map/map-view.ts`
  - `src/application/review/**`
  - `docs/refactor/map-review-boundary-removal-inventory.md`
  - `tests/**`
- Must preserve:
  - `map exploration/fog behavior`
  - `city entry behavior`
  - `house-specific review presentation copy`
  - `all supported runtime entrypoints`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-18-map-review-provider-boundary-extraction-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-18-map-review-provider-boundary-extraction-target-plan.md`

### Queue Snapshot

- queue_goal: `Extract map and review dependencies behind provider-backed module boundaries and prove complete behavior across all supported entrypoints.`
- task_count: `5`
- completed_task_count: `1`
- remaining_task_count: `4`
- active_task_summary: `Define provider interfaces and adapters without changing runtime behavior.`
- task_briefs:
  - `task.map-review-provider-boundary-extraction-and-acceptance.evidence-anchor-reconcile: lock anchors and confirm no prerequisite split is needed.`
  - `task.map-review-provider-boundary-extraction-and-acceptance.interface-and-adapter: define provider interfaces and adapters without behavior change.`
  - `task.map-review-provider-boundary-extraction-and-acceptance.consumer-cutover-and-inventory: migrate consumers and write removal inventory.`
  - `task.map-review-provider-boundary-extraction-and-acceptance.residue-removal: remove old direct paths listed in the inventory.`
  - `task.map-review-provider-boundary-extraction-and-acceptance.acceptance-and-guard: prove behavior, entrypoint consistency, and no over-narrowing.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.map-review-provider-boundary-extraction-and-acceptance.evidence-anchor-reconcile` | `done` | `Confirm evidence lock, implementation anchors, claim boundary, and verification before implementation.` | `none` | `Completed after source review confirmed map and review anchors are present and no prerequisite split is required before Step 1.` |
| `task.map-review-provider-boundary-extraction-and-acceptance.interface-and-adapter` | `active` | `Define map/review provider interfaces and adapters without changing behavior.` | `task.map-review-provider-boundary-extraction-and-acceptance.evidence-anchor-reconcile` | `Step 1.` |
| `task.map-review-provider-boundary-extraction-and-acceptance.consumer-cutover-and-inventory` | `queued` | `Cut consumers to provider outputs and write removal inventory.` | `task.map-review-provider-boundary-extraction-and-acceptance.interface-and-adapter` | `Step 2.` |
| `task.map-review-provider-boundary-extraction-and-acceptance.residue-removal` | `queued` | `Remove old direct paths only as listed in the inventory.` | `task.map-review-provider-boundary-extraction-and-acceptance.consumer-cutover-and-inventory` | `Step 3.` |
| `task.map-review-provider-boundary-extraction-and-acceptance.acceptance-and-guard` | `queued` | `Run source guards, simulated human acceptance, entrypoint consistency, and completeness review.` | `task.map-review-provider-boundary-extraction-and-acceptance.residue-removal` | `Step 4.` |

### Task Definitions

#### `task.map-review-provider-boundary-extraction-and-acceptance.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.map-review-provider-boundary-extraction-and-acceptance.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/specs/2026-07-18-map-review-provider-boundary-extraction-target.md`
  - `docs/blueprints/plans/2026-07-18-map-review-provider-boundary-extraction-target-plan.md`
  - `src/ui/views/map/map-view.ts`
  - `src/application/map/**`
  - `src/application/content/active-game-content.ts`
  - `src/application/review/**`
  - `src/application/time/**`
  - `src/application/runtime/navigation-time-follow-up.ts`
  - `src/application/house-modules/**`
- must_inspect:
  - `version acceptance matrix`
  - `candidate evidence matrix`
  - `implementation anchors`
- must_not_change:
  - `Do not implement feature code before evidence_lock_status is locked.`
  - `Do not widen queue scope beyond the five acceptance ids.`
- done_when:
  - `Evidence lock is locked or the queue is blocked with a concrete reason.`
  - `Must inspect, modify, replace, preserve, and minimum verification remain synchronized.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Return to version review or split a prerequisite queue.`
- promote_next_if_done: `task.map-review-provider-boundary-extraction-and-acceptance.interface-and-adapter`
- stop_if:
  - `implementation_anchor_status is missing or conflicting`
  - `prerequisite_status is needs-prior-queue or split-required`

##### Human Context

- task_brief:
  - `Lock the evidence and implementation anchors before implementation.`
- task_outcome_summary:
  - `Completed after source review confirmed map direct dependencies, review distributed consumers, and entrypoint test anchors are present; evidence lock is now locked and Step 1 can begin.`

#### `task.map-review-provider-boundary-extraction-and-acceptance.interface-and-adapter`

##### Control Block

- task_id: `task.map-review-provider-boundary-extraction-and-acceptance.interface-and-adapter`
- state: `active`
- task_kind: `execution`
- scope:
  - `src/application/map/**`
  - `src/application/review/**`
  - `src/application/content/active-game-content.ts`
  - `tests/**`
- must_inspect:
  - `src/ui/views/map/map-view.ts`
  - `src/application/map/map-city-marker-view-model.ts`
  - `src/application/content/active-game-content.ts`
  - `src/application/review/review-cycle.ts`
  - `src/application/time/council-priority.ts`
  - `src/application/time/council-attendance.ts`
- must_modify:
  - `src/application/map/**`
  - `src/application/review/**`
  - `tests/**`
- must_preserve:
  - `existing map marker output`
  - `existing review schedule and compatibility mirror behavior`
- done_when:
  - `Map location marker/provider interfaces and adapters exist without changing runtime behavior.`
  - `Review provider or policy interfaces exist without moving house-specific presentation copy.`
- verify_with:
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- promote_next_if_done: `task.map-review-provider-boundary-extraction-and-acceptance.consumer-cutover-and-inventory`

##### Human Context

- task_brief:
  - `Define provider interfaces and adapters without behavior change.`
- task_outcome_summary:
  - `pending`

#### `task.map-review-provider-boundary-extraction-and-acceptance.consumer-cutover-and-inventory`

##### Control Block

- task_id: `task.map-review-provider-boundary-extraction-and-acceptance.consumer-cutover-and-inventory`
- state: `queued`
- task_kind: `execution`
- scope:
  - `src/ui/views/map/map-view.ts`
  - `src/application/map/**`
  - `src/application/review/**`
  - `src/application/runtime/navigation-time-follow-up.ts`
  - `src/application/house-modules/**`
  - `docs/refactor/map-review-boundary-removal-inventory.md`
  - `tests/**`
- must_inspect:
  - `provider interfaces from the previous task`
  - `map rendering and click handling`
  - `review runtime and house consumers`
- must_modify:
  - `src/ui/views/map/map-view.ts`
  - `src/application/map/**`
  - `src/application/review/**`
  - `docs/refactor/map-review-boundary-removal-inventory.md`
  - `tests/**`
- must_preserve:
  - `city entry behavior`
  - `map exploration/fog behavior`
  - `review countdown and due behavior`
- done_when:
  - `Map consumers use provider outputs as the primary path.`
  - `Review consumers use shared provider/policy seams where covered.`
  - `Removal inventory records remaining direct paths and their Step 3 disposition.`
- verify_with:
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- promote_next_if_done: `task.map-review-provider-boundary-extraction-and-acceptance.residue-removal`

##### Human Context

- task_brief:
  - `Cut consumers to provider outputs and write removal inventory.`
- task_outcome_summary:
  - `pending`

#### `task.map-review-provider-boundary-extraction-and-acceptance.residue-removal`

##### Control Block

- task_id: `task.map-review-provider-boundary-extraction-and-acceptance.residue-removal`
- state: `queued`
- task_kind: `execution`
- scope:
  - `docs/refactor/map-review-boundary-removal-inventory.md`
  - `src/ui/views/map/map-view.ts`
  - `src/application/map/**`
  - `src/application/review/**`
  - `src/application/runtime/navigation-time-follow-up.ts`
  - `src/application/house-modules/**`
  - `tests/**`
- must_inspect:
  - `docs/refactor/map-review-boundary-removal-inventory.md`
- must_modify:
  - `only files required by the removal inventory`
  - `tests/**`
- must_preserve:
  - `all behavior explicitly marked keep or waiver in the inventory`
- done_when:
  - `Old direct paths listed for removal are removed.`
  - `Preserved residues are marked as keep or waiver with reason.`
- verify_with:
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- promote_next_if_done: `task.map-review-provider-boundary-extraction-and-acceptance.acceptance-and-guard`

##### Human Context

- task_brief:
  - `Remove old direct paths only as listed in the inventory.`
- task_outcome_summary:
  - `pending`

#### `task.map-review-provider-boundary-extraction-and-acceptance.acceptance-and-guard`

##### Control Block

- task_id: `task.map-review-provider-boundary-extraction-and-acceptance.acceptance-and-guard`
- state: `queued`
- task_kind: `execution`
- scope:
  - `tests/**`
  - `docs/refactor/map-review-boundary-removal-inventory.md`
  - `src/**`
- must_inspect:
  - `normal start path`
  - `JSON runtime pack import path`
  - `Script Editor runtime preview path`
  - `map/review source guards`
- must_modify:
  - `tests/**`
  - `docs/refactor/map-review-boundary-removal-inventory.md`
- must_preserve:
  - `normal start`
  - `JSON runtime pack import`
  - `Script Editor runtime preview`
  - `complete map and review behavior`
- done_when:
  - `Source guards prove removed direct paths stay removed or waived.`
  - `Simulated human flow proves map and review behavior.`
  - `Completeness review proves functionality was not over-narrowed.`
- verify_with:
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- promote_next_if_done: `none`

##### Human Context

- task_brief:
  - `Run source guards, simulated human acceptance, entrypoint consistency, and completeness review.`
- task_outcome_summary:
  - `pending`
