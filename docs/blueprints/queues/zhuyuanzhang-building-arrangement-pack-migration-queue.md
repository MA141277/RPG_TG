# Zhuyuanzhang Building Arrangement Pack Migration Queue

## Control Block

- queue_id: `queue.zhuyuanzhang-building-arrangement-pack-migration`
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
- closure_basis: `Closed after explicit arrangement migration, authored flow metadata, generic action-to-event-to-flow launch, and focused/full verification. Legacy house runtime deletion remains routed to the successor retirement queue and is not claimed removed here.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `auto-routable`
- next_family_candidate: `queue.legacy-house-runtime-retirement`
- auto_continue_eligible: `true`
- next_effect: `promote-next-queue`
- sync_status: `success`
- sync_scope: `local-record`
- sync_summary: `Queue closeout recorded locally after migration and one high-priority event-to-flow gap fill; no commit or push attempted.`
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
  - `Migrate built-in Zhu Yuanzhang buildings and their existing functions into explicit buildingArrangements, containers, events, flow definitions, and mounted NPC data.`
- Parent spec:
  - `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-target.md`
- Parent requirement role:
  - `This queue implements ACC-BUILDING-FLOW-007. The parent spec remains the total requirement contract.`
- Forbidden expansions:
  - `Do not infer arrangements from houses.characterIds, defaultCharacterId, cityEntries, or cityNpcPools.`
  - `Do not keep old house modules as the migrated runtime path.`
  - `Do not delete legacy house modules before replacement parity is verified by the later retirement queue.`

### Parent Spec Inheritance

- inherited_required_capabilities:
  - `Built-in buildings use explicit city-local buildingArrangements with mounted NPCs, containers, enter/exit rules, and authored flow references.`
  - `Existing temple, grain, medicine, tea/tavern, and leave behavior remains represented as authored data.`
- inherited_legacy_replacements:
  - `Concrete house module behavior and old house roster fields as canonical runtime truth.`
- inherited_non_goals:
  - `Do not add compatibility inference or broad permissions/security restrictions.`
  - `Do not narrow an existing function into unsupported merely because migration data is incomplete.`
- parent_spec_change_policy:
  - `If implementation proves the parent spec must change, update the parent spec first, then reconcile every affected queue before treating any capability as removed, retired, or unsupported.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-BUILDING-FLOW-007`
- acceptance_not_claimed:
  - `ACC-BUILDING-FLOW-008`
  - `ACC-BUILDING-FLOW-009`
- minimum_verification:
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`

### Claim Boundary

#### Can Claim

- `ACC-BUILDING-FLOW-007: Built-in Zhu Yuanzhang building behavior and rosters are explicit arrangement/container/event/flow data with no compatibility fallback.`

#### Cannot Claim

- `Legacy house runtime deletion or documentation retirement.`
- `Final cross-entrypoint acceptance or version closeout.`
- `Any new gameplay beyond preserving the existing built-in behavior.`

#### Over-Narrowing Guard

- parent_capabilities_not_owned_by_this_queue:
  - `Legacy deletion remains owned by queue.legacy-house-runtime-retirement.`
  - `Final acceptance remains owned by queue.building-arrangement-final-acceptance-and-removal-guard.`
- forbidden_scope_shrinkage:
  - `Do not omit existing building functions, NPC seats, leave behavior, or flow routes to make migration smaller.`
  - `Do not convert missing migration data into unsupported or retired capability.`
- unspecified_detail_policy:
  - `Use explicit pack data and generic arrangement/container/flow contracts; resolve unspecified fixture details from existing content and runtime evidence without adding house-specific runtime branches.`
- gap_routing_policy:
  - `A fixture or materialization gap inside the parent spec is absorbed in this queue; a true parent conflict is recorded as blocker rather than silently narrowing migration.`

### Implementation Anchors

- Must inspect:
  - `src/content/scenario-packs/zhuyuanzhang/**`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/building/**`
  - `src/application/house-modules/**`
  - `tests/robustness.test.cjs`
- Must modify:
  - `src/content/scenario-packs/zhuyuanzhang/**`
  - `tests/robustness.test.cjs`
  - `docs/change-log.md`
- Must preserve:
  - `Explicit arrangement/container/flow contracts and no-inference import behavior.`

### Queue Snapshot

- queue_goal: `Migrate built-in Zhu Yuanzhang building behavior and rosters into explicit arrangement/container/event/flow data without old fallback.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Queue closed; next lawful candidate is legacy house runtime retirement.`
- task_briefs:
  - `task.zhuyuanzhang-building-arrangement-pack-migration.evidence-anchor-reconcile: Confirm pack fixtures, existing behavior coverage, and migration anchors.`
  - `task.zhuyuanzhang-building-arrangement-pack-migration.implementation: Migrate explicit arrangements, containers, events, flow definitions, and NPC seats with focused regressions.`
  - `task.zhuyuanzhang-building-arrangement-pack-migration.queue-closeout-and-handoff: Verify parity, perform one completeness review, and route legacy retirement without version closeout.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 当前执行队列 from queue_id.`
- `The fixed operator receipt must source 当前任务 from active_task.`
- `The fixed operator receipt must source 当前队列目标 from queue_goal.`

### Closeout Judgement Rule

- `Queue execution closeout is not version closeout.`
- `Out-of-scope is not retired, removed, or unsupported.`
- `If a required migration fixture gap remains inside the parent spec, absorb it once as high-priority gap fill or route it to the next lawful queue.`

### Completion Completeness Review

- review_status: `gap-fill-used`
- can_claim_coverage:
  - `All 189 explicit arrangements contain mounted NPC data, character-seat containers, and action-menu containers; authored temple flows are preserved and action events launch matching flow definitions.`
- parent_spec_preservation:
  - `No old house-field inference or compatibility fallback was added; legacy runtime deletion remains owned by the successor queue; no capability was marked unsupported or retired.`
- out_of_scope_routing:
  - `Legacy house runtime deletion is routed to queue.legacy-house-runtime-retirement; final cross-entrypoint acceptance is routed to queue.building-arrangement-final-acceptance-and-removal-guard.`
- verification_sufficiency:
  - `Typecheck, focused migration/runtime tests, and full robustness verification passed; the flow launch regression covers action -> EventBindingRuntime -> authored flow session.`
- gap_fill_decision:
  - `used-once`
- gap_fill_scope:
  - `Added the generic action-event-flow runtime handoff, flow view rendering, and unified playable action dispatch so migrated building functions are executable rather than static pack data.`
- remaining_gaps:
  - `Legacy house modules and registries remain and are explicitly routed to the retirement queue; no version closeout is entered.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.zhuyuanzhang-building-arrangement-pack-migration.evidence-anchor-reconcile` | `done` | `Confirm built-in pack fixtures, behavior coverage, and migration anchors.` | `none` | `Closed automatically under the version-local temporary execution rule.` |
| `task.zhuyuanzhang-building-arrangement-pack-migration.implementation` | `done` | `Migrate explicit arrangement/container/event/flow data and mounted NPC seats.` | `task.zhuyuanzhang-building-arrangement-pack-migration.evidence-anchor-reconcile` | `Closed after explicit pack migration, generic flow handoff, and verification.` |
| `task.zhuyuanzhang-building-arrangement-pack-migration.queue-closeout-and-handoff` | `done` | `Verify migration parity and route legacy retirement.` | `task.zhuyuanzhang-building-arrangement-pack-migration.implementation` | `Closed with one high-priority gap fill; version remains open.` |

### Progress Log

- `2026-07-20`: `Queue admitted automatically after queue.script-editor-flow-playable-authoring-ux closed. Prerequisite review confirmed explicit flow authoring, runtime shell, event integration, and flow runtime contracts are available.`
- `2026-07-21`: `Evidence anchor reconciliation completed: the built-in pack contains 21 cities and 189 explicit building arrangements; every arrangement has mounted NPC data plus generic seat/menu containers, and existing temple behavior is represented by authored flow metadata.`
- `2026-07-21`: `Implementation completed. Added the generic action -> EventBindingRuntime -> authored flow launch path, flow view rendering, and unified playable action dispatch. No house-specific branch or compatibility inference was added.`
- `2026-07-21`: `Completeness review passed with one permitted high-priority gap fill. Typecheck, focused building flow tests, and full robustness verification passed. Legacy house runtime deletion is routed to queue.legacy-house-runtime-retirement; queue closed without version closeout.`

### Task Definitions

#### `task.zhuyuanzhang-building-arrangement-pack-migration.evidence-anchor-reconcile`

- state: `done`
- task_kind: `decision-dispatch`
- task_brief:
  - `Confirm built-in pack fixtures, existing building behavior coverage, and migration anchors before implementation.`
- task_outcome_summary:
  - `Evidence lock confirmed and all built-in building behavior mapped to explicit migration records or routed in-scope fixture gaps.`
- done_when:
  - `Evidence lock is confirmed and all existing built-in building behavior is mapped to explicit migration records or routed as an in-scope fixture gap.`
- verify_with:
  - `npm run lint:blueprints`

#### `task.zhuyuanzhang-building-arrangement-pack-migration.implementation`

- state: `done`
- task_kind: `execution`
- task_brief:
  - `Migrate explicit arrangement, container, event, flow, and mounted NPC data for the built-in Zhu Yuanzhang pack.`
- task_outcome_summary:
  - `Explicit arrangement/container/flow migration and generic action-to-flow runtime handoff completed and verified.`
- done_when:
  - `Built-in arrangements, containers, events, flow definitions, and mounted NPCs export/import and runtime-materialize without old inference.`
  - `Focused tests prove existing built-in functions remain represented.`
- verify_with:
  - `npm run typecheck`
  - `npm test`

#### `task.zhuyuanzhang-building-arrangement-pack-migration.queue-closeout-and-handoff`

- state: `done`
- task_kind: `decision-dispatch`
- task_brief:
  - `Verify migrated behavior completeness, use at most one high-priority gap fill, and route legacy retirement.`
- task_outcome_summary:
  - `Parity review, one high-priority gap fill, residue routing, and queue closeout completed.`
- done_when:
  - `Completeness review passes with at most one high-priority gap fill, residue is routed, and version plan/project-progress are synchronized.`
- verify_with:
  - `npm run lint:blueprints`
