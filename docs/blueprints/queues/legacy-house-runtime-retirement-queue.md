# Legacy House Runtime Retirement Queue

## Control Block

- queue_id: `queue.legacy-house-runtime-retirement`
- belongs_to_version: `target.building-arrangement-container-flow-refactor`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-21`
- governance_sync_source: `docs/blueprints/plans/2026-07-20-building-arrangement-container-flow-refactor-target-plan.md`
- queue_status: `done`
- queue_class: `required`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `open-residue`
- closure_basis: `Successor queue for removing superseded house runtime after explicit building arrangements, container rendering, event trigger integration, and authored flow launch have replaced the relevant migrated behavior.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `auto-routable`
- next_family_candidate: `queue.building-arrangement-final-acceptance-and-removal-guard`
- auto_continue_eligible: `true`
- next_effect: `promote-next-queue`
- sync_status: `success`
- sync_scope: `branch-push`
- sync_summary: `Repository sync after implementation closeout succeeded against origin/mod-first-dev on 2026-07-21; the queue closeout changes were pushed on the development trunk before continuing to the final guard candidate.`
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
  - `Delete the superseded house runtime path, module registries, legacy house UI views, and obsolete house-specific lifecycle code once replacement behavior is proven by the migrated building arrangement and flow path.`
- Parent spec:
  - `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-target.md`
- Parent requirement role:
  - `This queue implements ACC-BUILDING-FLOW-008. The parent spec remains the total requirement contract.`
- Forbidden expansions:
  - `Do not remove behavior that is still the canonical replacement path.`
  - `Do not claim final acceptance or version closeout.`

### Parent Spec Inheritance

- inherited_required_capabilities:
  - `Retire legacy house runtime only after replacement behavior is fully available through explicit arrangements, containers, events, and flows.`
- inherited_legacy_replacements:
  - `Concrete house module runtime ownership and superseded house-specific fallbacks.`
- inherited_non_goals:
  - `Do not add new gameplay while deleting legacy code.`
- parent_spec_change_policy:
  - `If implementation proves the parent spec must change, update the parent spec first, then reconcile every affected queue before treating any capability as removed, retired, or unsupported.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-BUILDING-FLOW-008`
- acceptance_not_claimed:
  - `ACC-BUILDING-FLOW-009`
- minimum_verification:
  - `npm run typecheck`
  - `npm test`

### Claim Boundary

#### Can Claim

- `ACC-BUILDING-FLOW-008: Superseded house runtime code can be retired after replacement behavior is proven.`

#### Cannot Claim

- `Final acceptance or version closeout.`
- `Any deletion that would remove the only replacement path.`

#### Over-Narrowing Guard

- parent_capabilities_not_owned_by_this_queue:
  - `Final acceptance remains owned by queue.building-arrangement-final-acceptance-and-removal-guard.`
- forbidden_scope_shrinkage:
  - `Do not delete or declare unsupported any inherited capability merely because it is outside this queue.`
- unspecified_detail_policy:
  - `Delete only the legacy path actually superseded by the explicit building arrangement and flow runtime path.`
- gap_routing_policy:
  - `If a required legacy residue cannot be removed here, record it as residue or blocker rather than erasing it from the total spec.`

### Prerequisite Routing Decisions

- `2026-07-21`: `Queue completeness audit found the previous migration closeout overclaimed executable behavior coverage: the Zhu Yuanzhang pack has 630 action-menu item eventIds, while events.json/event-bindings.json do not define or bind those menu events and flow-definitions.json only covers three house.kulan.temple actions. Because ACC-BUILDING-FLOW-007 requires built-in building functions and leave behavior to be represented as authored data before old house runtime deletion, this is an in-parent-spec replacement-parity gap rather than a product decision.`
- `2026-07-21`: `Under the version-local temporary execution rule, this queue must absorb or route the gap before deleting old runtime paths: add or require explicit menu event definitions, building-container-item-action bindings, and runtime-reachable flow/closeBuilding actions for migrated built-in menus, without compatibility inference from old house fields and without preserving old house modules as fallback.`
- `2026-07-21`: `Retirement implementation must not delete any old house behavior that remains the only executable path until the replacement authored event/flow/closeBuilding path is recorded and verified. If the gap cannot be completed inside this queue, record it as same-family residue/blocker instead of declaring the old capability unsupported.`
- `2026-07-21`: `Gap fill completed: all 630 migrated action-menu item eventIds now have explicit event definitions and building-container-item-action bindings; all non-leave menu actions have authored flow definitions; all leave menu actions have closeBuilding event actions. The replacement path passed npm run typecheck, npm run lint:blueprints, and npm test.`

### Implementation Anchors

- Must inspect:
  - `src/application/house-modules/**`
  - `src/core/registry/house-module-*`
  - `src/core/runtime/house-runtime*`
  - `src/ui/views/house/**`
  - `docs/special-house-interface.md`
  - `AGENTS.md`
- Must modify:
  - `src/application/house-modules/**`
  - `src/core/registry/**`
  - `src/core/runtime/**`
  - `src/ui/views/house/**`
  - `docs/change-log.md`
- Must preserve:
  - `Replacement building arrangement and flow runtime path remains canonical.`

### Queue Snapshot

- queue_goal: `Retire superseded house runtime after replacement behavior is proven.`
- task_count: `2`
- completed_task_count: `2`
- remaining_task_count: `0`
- active_task_summary: `none`
- task_briefs:
  - `task.legacy-house-runtime-retirement.evidence-anchor-reconcile: Confirm the legacy runtime residues and replacement anchors.`
  - `task.legacy-house-runtime-retirement.implementation: Remove superseded house runtime code and update references.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.legacy-house-runtime-retirement.evidence-anchor-reconcile` | `done` | `Confirmed legacy runtime residues, replacement anchors, and action-menu event/flow parity gap.` | `none` | `Closed after filling the in-parent-spec menu event/flow parity gap: 630 action-menu eventIds now have explicit events, event bindings, and either flow or closeBuilding paths.` |
| `task.legacy-house-runtime-retirement.implementation` | `done` | `Removed superseded house runtime code and references while preserving the building arrangement/event/flow path.` | `task.legacy-house-runtime-retirement.evidence-anchor-reconcile` | `Closed after verification: npm run typecheck, npm run lint:blueprints, and npm test.` |

### Task Definitions

#### `task.legacy-house-runtime-retirement.evidence-anchor-reconcile`

- state: `done`
- task_kind: `decision-dispatch`
- task_brief:
  - `Confirm the legacy runtime residues, replacement anchors, and action-menu event/flow parity gap before implementation.`
- task_outcome_summary:
  - `Evidence lock confirmed. Legacy house runtime residues remain, and the inherited action-menu parity gap was filled before deletion work: every migrated built-in action-menu eventId now maps to explicit event data, building-container-item-action binding data, and either authored flow or closeBuilding runtime behavior.`
- done_when:
  - `Evidence lock is confirmed and every legacy house runtime residue is mapped to deletion, routing, or explicit blocker.`
  - `Every migrated built-in action-menu eventId is mapped to an explicit event/binding/flow/closeBuilding replacement path, or the missing replacement parity is recorded as same-family residue/blocker before old runtime deletion.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm test`

#### `task.legacy-house-runtime-retirement.implementation`

- state: `done`
- task_kind: `execution`
- task_brief:
  - `Remove superseded house runtime code and update references.`
- task_outcome_summary:
  - `Deleted the superseded house runtime directories, registries, core/application runtime bridges, legacy house UI views, special-house interface document, and old AGENTS house-module governance. Runtime building entry now only renders explicit building arrangements and otherwise shows no old fallback. Building entry/exit uses generic city-view/navigation state transitions, and migrated action-menu behavior remains on EventBindingRuntime -> flow/closeBuilding paths. Reusable non-house defaults used by remaining grain/medicine/tea mechanics were moved under their mechanic folders.`
- done_when:
  - `Legacy house runtime code, registries, and views are removed or routed without losing the replacement path.`
- verify_with:
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`

### Closeout Record

- closed_at: `2026-07-21`
- closed_by: `AI execution under target.building-arrangement-container-flow-refactor version-local temporary execution rule`
- completed_acceptance:
  - `ACC-BUILDING-FLOW-008: superseded house runtime code retired after replacement authored arrangement/event/flow paths were proven.`
- implementation_summary:
  - `Removed src/application/house-modules/**, src/core/registry/house-module-*, src/core/runtime/house-runtime.ts, src/application/house/house-runtime.ts, src/core/adapters/legacy-house-adapter.ts, src/ui/views/house/**, and docs/special-house-interface.md.`
  - `Removed AGENTS.md special-house contract triggers and replaced them with Script Editor building arrangement/event/playable-flow guidance.`
  - `Changed building presentation to render only explicit building arrangements and return empty output when no arrangement exists, matching the no-compat/no-empty-data-display rule.`
  - `Retired old house-runtime tests as skipped legacy assertions and added/kept removal guards proving old paths are gone.`
- verification:
  - `npm run typecheck: passed`
  - `npm run lint:blueprints: passed`
  - `npm test: passed`
- completeness_assessment:
  - `No parent capability was narrowed: migrated Zhu Yuanzhang action menus already have explicit event bindings, flow definitions, and closeBuilding events before deletion.`
  - `No legacy fallback remains for the removed paths named by this queue.`
  - `One high-priority test-maintenance gap fill was used: old house-runtime tests were retired/skipped and replacement removal guards were kept so the suite no longer asserts deleted behavior.`
- routed_residue:
  - `Final end-to-end acceptance, browser proof, and broader source-removal guard review remain routed to queue.building-arrangement-final-acceptance-and-removal-guard.`
