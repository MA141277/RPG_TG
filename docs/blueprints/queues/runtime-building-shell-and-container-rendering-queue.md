# Runtime Building Shell And Container Rendering Queue

## Control Block

- queue_id: `queue.runtime-building-shell-and-container-rendering`
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
- closure_basis: `Runtime building shell now consumes explicit buildingArrangements from runtime packs, selects a generic building stage for matching city/building arrangements, renders generic containers with no old-data inference, and preserves system leave while event dispatch, flow runtime, pack migration, and legacy deletion remain downstream residue.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `auto-routable`
- next_family_candidate: `queue.building-container-event-trigger-integration`
- auto_continue_eligible: `true`
- next_effect: `promote-next-queue`
- sync_status: `success`
- sync_scope: `local-record`
- sync_summary: `Queue closeout recorded locally after focused RED/GREEN tests, npm run typecheck, npm run lint:blueprints, and npm test passed; no commit or push attempted because the worktree contains pre-existing unrelated dirty files.`
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
  - `Render a generic runtime building shell from city-local buildingArrangements and containers, expose no-crash empty data behavior, support system leave, and preserve current runtime entrypoints while old house runtime remains available until later retirement.`
- Parent spec:
  - `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-target.md`
- Parent requirement role:
  - `This queue implements ACC-BUILDING-FLOW-006 and absorbs the required runtime pack/export/import/materialization fixture work needed for runtime shell inputs. The parent spec remains the total requirement contract.`
- Forbidden expansions:
  - `Do not wire container item actions to EventBindingRuntime in this queue.`
  - `Do not implement flow playable runtime or flow authoring UX in this queue.`
  - `Do not migrate the Zhu Yuanzhang pack in this queue.`
  - `Do not delete legacy house modules in this queue.`
  - `Do not introduce compatibility fallback from old house fields or runtime city families into buildingArrangements.`

### Parent Spec Inheritance

- inherited_required_capabilities:
  - `Runtime building shell renders from arrangement containers.`
  - `Normal start, JSON runtime pack import, and Script Editor runtime preview eventually consume the same building arrangement contract.`
  - `Missing mounted NPCs or containers means no corresponding UI, not a crash or old-data inference.`
  - `System leave remains available.`
- inherited_compatibility_paths:
  - `Existing city/building entrypoints must remain available while generic arrangements are introduced.`
  - `Old house runtime remains until later migration and legacy retirement queues prove replacement parity.`
- inherited_legacy_replacements:
  - `HouseRuntime session/render dependency as the only building entry rendering path.`
  - `cityEntries and cityNpcPools as canonical runtime building shell input.`
- inherited_non_goals:
  - `Do not keep compatibility fallback from old house fields.`
  - `Do not infer buildingArrangements from houses.characterIds, defaultCharacterId, cityEntries, or cityNpcPools.`
  - `Do not create one runtime branch per building type.`
  - `Do not move gameplay logic back into building runtime shell code.`
- parent_spec_change_policy:
  - `If implementation proves the parent spec must change, update the parent spec first, then reconcile every affected candidate queue and evidence matrix entry before treating any capability as removed, retired, or unsupported.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-BUILDING-FLOW-006`
- acceptance_not_claimed:
  - `ACC-BUILDING-FLOW-001`
  - `ACC-BUILDING-FLOW-002`
  - `ACC-BUILDING-FLOW-003`
  - `ACC-BUILDING-FLOW-004`
  - `ACC-BUILDING-FLOW-005`
  - `ACC-BUILDING-FLOW-007`
  - `ACC-BUILDING-FLOW-008`
  - `ACC-BUILDING-FLOW-009`
  - `ACC-BUILDING-FLOW-010`
- minimum_verification:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm test`

### Claim Boundary

#### Can Claim

- `ACC-BUILDING-FLOW-006: Runtime building shell renders from arrangement containers, preserves active building entry through existing current house/building navigation state until the final naming cutover, supports system leave, and applies no-crash empty mounted data behavior.`
- `Runtime pack and Script Editor export/import paths carry explicit buildingArrangements as runtime shell fixtures without inference from old families.`

#### Cannot Claim

- `Container item action dispatch through EventBindingRuntime.`
- `flow playable runtime/presenter or Script Editor flow authoring.`
- `Built-in Zhu Yuanzhang pack migration to arrangements/events/playables.`
- `Legacy house runtime/module/view deletion.`
- `Final end-to-end acceptance or version closeout.`
- `Out-of-scope means not implemented by this queue; it does not mean retired, removed, or unsupported unless the parent spec was updated first.`

#### Capability Floor

- `Entering a building must still open a runtime shell that can render authored containers, preserve activeBuilding state, and fail closed when arrangement data is missing.`

#### Over-Narrowing Guard

- parent_capabilities_not_owned_by_this_queue:
  - `Container event integration remains owned by queue.building-container-event-trigger-integration.`
  - `flow runtime remains owned by queue.flow-playable-runtime-and-presenter.`
  - `flow authoring UX remains owned by queue.script-editor-flow-playable-authoring-ux.`
  - `Built-in pack migration remains owned by queue.zhuyuanzhang-building-arrangement-pack-migration.`
  - `Legacy removal remains owned by queue.legacy-house-runtime-retirement.`
- forbidden_scope_shrinkage:
  - `Do not pass this queue by rendering only the old house view.`
  - `Do not render only one hardcoded container type.`
  - `Do not treat event/flow/migration/deletion gaps as unsupported.`
  - `Do not keep old house runtime as a fallback after this version's later retirement proof; in this queue it is only a preserved compatibility path for unmigrated data.`
- unspecified_detail_policy:
  - `Fill runtime view model and content-pack fixture details as much as the parent spec reasonably allows, without drifting into event dispatch or authored gameplay implementation.`
- gap_routing_policy:
  - `If a required runtime shell capability cannot be completed here, record it as residue, prerequisite, blocker, or successor candidate rather than erasing it from the total spec.`

#### Legacy Paths To Replace

- `HouseRuntime session/render dependency as the only building UI path.`
- `cityEntries/cityNpcPools as the only runtime source for building visible entries and rosters.`

#### Compatibility Paths To Preserve

- `Existing house runtime for unmigrated content until migration and retirement queues complete.`
- `Existing city/building entry navigation using currentHouseId until activeBuilding naming is fully cut over.`
- `Existing leave-house action behavior.`

#### User Path Coverage Matrix

- primary_paths:
  - `Runtime path: normal entry into an authored building renders the generic shell and its containers.`
- alternate_paths:
  - `Save/restore path: activeBuilding and its rendered arrangement survive state persistence and reload.`
- empty_or_fail_closed_paths:
  - `Buildings without arrangement data fail closed or show the bounded empty state without falling back to old house presentation.`
- forbidden_regressions:
  - `Do not keep building entry functional only because a legacy house view still intercepts the route.`

#### Functional Loss Budget

- budget: `zero`
- loss_accounting_rule:
  - `Any lost entry/render/save behavior must be fixed or routed as residue before queue closeout; generic shell conversion is not permission to drop non-happy-path behavior.`

#### Implementation Anchors

- Must inspect:
  - `src/domain/content-pack.ts`
  - `src/application/content/active-game-content.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/city-building-runtime-materializer.ts`
  - `src/application/building/building-module-entry.ts`
  - `src/application/presenter/stage-presenters.ts`
  - `src/ui/views/building/building-module-view.ts`
  - `src/ui/app-render.ts`
  - `tests/robustness.test.cjs`
- Must modify:
  - `src/domain/content-pack.ts`
  - `src/application/content/active-game-content.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/city-building-runtime-materializer.ts`
  - `src/application/building/building-module-entry.ts`
  - `src/application/presenter/stage-presenters.ts`
  - `src/ui/views/building/building-module-view.ts`
  - `tests/robustness.test.cjs`
- Must preserve:
  - `No old-data inference into buildingArrangements.`
  - `Existing old house runtime path for content that lacks explicit buildingArrangements.`
  - `No event dispatch or flow runtime implementation.`

#### Verification Coverage

- `RED/GREEN tests prove runtime pack export/import carries explicit buildingArrangements without inference.`
- `RED/GREEN tests prove active game content exposes buildingArrangements from loaded packs.`
- `RED/GREEN tests prove building module stage selects a generic building shell when an explicit arrangement matches the active city/building.`
- `RED/GREEN tests prove generic shell renders empty mounted NPC/container data without fallback rows or crashes.`
- `Source guard proves this queue does not implement container event dispatch, flow runtime, built-in migration, or legacy house deletion.`

#### Replacement Proof

- previous_owner_or_path:
  - `House-specific runtime shell/view composition and ad hoc building presentation branches.`
- new_owner_or_path:
  - `Generic runtime building shell and container rendering pipeline backed by buildingArrangements.`
- behavior_preservation_expectation:
  - `Players can still enter, view, leave, and restore buildings through the new shell without hidden house fallback.`
- verification_evidence:
  - `Automated save/restore coverage plus runtime shell verification prove generic rendering owns the path.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-20-building-arrangement-container-flow-refactor-target-plan.md`
- Version-local temporary execution rule:
  - `For target.building-arrangement-container-flow-refactor only, eligible candidate admission review after queue closeout is an AI-internal execution step and should auto-continue after recording no-over-narrowing and in-scope fixture/materialization/export-import gap decisions, unless the version plan's blocker criteria apply.`
  - `This queue must still close only its bounded implementation slice and must not enter version closeout.`

### Queue Snapshot

- queue_goal: `Render generic runtime building shell from explicit buildingArrangements and carry arrangements through runtime pack fixture paths.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `No active task remains; the queue closed after runtime building shell and explicit buildingArrangements pack fixture implementation and verification.`
- task_briefs:
  - `task.runtime-building-shell-and-container-rendering.evidence-anchor-reconcile: Confirm source evidence, runtime fixture ownership, and no-over-narrowing guard before implementation.`
  - `task.runtime-building-shell-and-container-rendering.implementation: Add bounded runtime pack fixture support, generic stage selection, generic building rendering, and tests.`
  - `task.runtime-building-shell-and-container-rendering.queue-closeout-and-handoff: Verify, review completeness, classify residue, and continue without version closeout.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded execution slice landed and verified.`
- `topic_closure_status = closed is legal only when no still-blocking same-family residue remains inside the queue's bounded topic surface.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.runtime-building-shell-and-container-rendering.evidence-anchor-reconcile` | `done` | `Confirmed source evidence, runtime fixture ownership, and no-over-narrowing guard before implementation.` | `none` | `Editor authoring is closed and runtime shell input fixture ownership belongs in this queue.` |
| `task.runtime-building-shell-and-container-rendering.implementation` | `done` | `Added bounded runtime pack fixture support, generic stage selection, generic building rendering, and tests.` | `task.runtime-building-shell-and-container-rendering.evidence-anchor-reconcile` | `No event dispatch, flow runtime, built-in migration, or legacy deletion work was performed.` |
| `task.runtime-building-shell-and-container-rendering.queue-closeout-and-handoff` | `done` | `Verified, reviewed completeness, classified residue, and continued without version closeout.` | `task.runtime-building-shell-and-container-rendering.implementation` | `Container event dispatch and later capabilities remain routed to downstream queues.` |

### Task Definitions

#### `task.runtime-building-shell-and-container-rendering.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.runtime-building-shell-and-container-rendering.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-target.md`
  - `docs/blueprints/queues/script-editor-building-arrangement-authoring-ux-queue.md`
  - `src/domain/content-pack.ts`
  - `src/application/content/active-game-content.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/building/building-module-entry.ts`
  - `src/ui/views/building/building-module-view.ts`
  - `tests/robustness.test.cjs`
- done_when:
  - `Evidence Lock is locked or the queue is blocked with a concrete reason.`
  - `Runtime fixture ownership is confirmed as absorbed in this queue.`
  - `Can Claim and Cannot Claim list acceptance ids from the version acceptance matrix.`
- verify_with:
  - `npm run lint:blueprints`
- promote_next_if_done: `task.runtime-building-shell-and-container-rendering.implementation`
- stop_if:
  - `implementation would require event action dispatch, flow runtime, pack migration, or legacy house deletion before generic shell can render`

##### Human Context

- task_brief:
  - `Lock runtime shell evidence before implementation.`
- task_outcome_summary:
  - `Completed. Source review confirmed ContentPackDefinition and ActiveGameContent do not yet expose buildingArrangements, Script Editor export/import does not yet carry them as runtime files, and building stage selection still renders through HouseDefinition/HouseRuntime unless a later generic shell is added.`
- Purpose:
  - `Prevent runtime shell work from either staying on old house rendering or jumping ahead into event/flow/migration work.`
- Failure mode:
  - `The queue passes by using old house modules as hidden fallback or by rendering a named building-specific screen.`

##### Progress Log

- `2026-07-21`: `Queue admitted after promotion-review confirmed schema and Script Editor authoring queues are closed. Evidence review is active.`
- `2026-07-21`: `Evidence locked. Runtime fixture ownership is absorbed in this queue because generic shell rendering needs explicit buildingArrangements input for normal start, JSON import, and Script Editor preview without old-data inference.`

#### `task.runtime-building-shell-and-container-rendering.implementation`

##### Control Block

- task_id: `task.runtime-building-shell-and-container-rendering.implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/domain/content-pack.ts`
  - `src/application/content/active-game-content.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/city-building-runtime-materializer.ts`
  - `src/application/building/building-module-entry.ts`
  - `src/application/presenter/stage-presenters.ts`
  - `src/ui/views/building/building-module-view.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `EventBindingRuntime semantics`
  - `flow playable runtime or authoring`
  - `built-in pack migration`
  - `legacy house runtime deletion`
- done_when:
  - `Explicit buildingArrangements can load/export/import as runtime pack data without inference.`
  - `Building stage selection returns a generic building shell for a matching active city/building arrangement.`
  - `Generic shell renders mounted NPC seats and container menu/panel placeholders without crashing on empty data.`
  - `System leave remains available through the existing leave-house action.`
- verify_with:
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- promote_next_if_done: `task.runtime-building-shell-and-container-rendering.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires event dispatch or flow runtime to prove generic shell rendering.`

##### Human Context

- task_brief:
  - `Add bounded runtime pack fixture support, generic stage selection, generic building rendering, and tests.`
- task_outcome_summary:
  - `Completed. Runtime packs now export, import, parse, and expose explicit buildingArrangements without inference. Active building presentation selects a generic building shell for matching city/building arrangements and renders arrangement containers with empty data producing no fallback roster rows.`
- Purpose:
  - `Make authored arrangements visible in runtime without depending on concrete house modules.`
- Failure mode:
  - `The runtime still crashes or falls back to old NPC data when arrangements have empty rosters or containers.`

#### `task.runtime-building-shell-and-container-rendering.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.runtime-building-shell-and-container-rendering.queue-closeout-and-handoff`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/queues/runtime-building-shell-and-container-rendering-queue.md`
  - `docs/blueprints/plans/2026-07-20-building-arrangement-container-flow-refactor-target-plan.md`
  - `docs/blueprints/project-progress.md`
- done_when:
  - `The queue implementation result is verified or honestly blocked.`
  - `Completion Completeness Review is passed, gap-fill-used, residue-recorded, or blocked.`
  - `Queue closeout classifies residue and names any next same-family candidate if still required.`
  - `Version plan and project-progress pointers are synchronized to the next lawful state.`
- verify_with:
  - `npm run lint:blueprints`
- promote_next_if_done: `version-review`
- stop_if:
  - `Closeout would infer full version completion without explicit version-level acceptance.`

##### Human Context

- task_brief:
  - `Close or route the runtime building shell queue after verified implementation.`
- task_outcome_summary:
  - `Completed. Queue closed locally after automated verification; downstream parent capabilities remain routed without version closeout.`
- Purpose:
  - `Return control to version review or auto-continue without hiding event/flow/migration/deletion residue.`
- Failure mode:
  - `Closing this queue as if the whole building refactor were done.`

##### Progress Log

- `2026-07-21`: `Closeout completed after npm run typecheck, npm run lint:blueprints, npm test, and focused buildingArrangements/runtime shell RED-GREEN tests passed. No high-priority in-queue gap fill was needed; container event dispatch remains the next same-family queue.`

### Completion Completeness Review

- review_status: `passed`
- can_claim_coverage:
  - `ACC-BUILDING-FLOW-006 is covered for the bounded runtime shell slice: explicit buildingArrangements flow through runtime pack export/import/load, ActiveGameContent exposes them, matching city/building arrangements select a generic building stage, and generic container rendering handles empty data without fallback rosters.`
  - `System leave remains available through the existing data-action="leave-house" control.`
- parent_spec_preservation:
  - `No parent capability was narrowed, retired, or marked unsupported; container event dispatch, flow runtime, flow authoring, built-in pack migration, legacy deletion, and final acceptance remain downstream responsibilities.`
  - `No old-data inference was added from houses.characterIds, defaultCharacterId, cityEntries, cityNpcPools, or city.mountedBuildings into buildingArrangements.`
- out_of_scope_routing:
  - `ACC-BUILDING-FLOW-004 remains owned by queue.building-container-event-trigger-integration.`
  - `ACC-BUILDING-FLOW-005 remains owned by queue.flow-playable-runtime-and-presenter.`
  - `ACC-BUILDING-FLOW-007 remains owned by queue.zhuyuanzhang-building-arrangement-pack-migration.`
  - `ACC-BUILDING-FLOW-008 remains owned by queue.legacy-house-runtime-retirement.`
  - `ACC-BUILDING-FLOW-009 remains owned by queue.building-arrangement-final-acceptance-and-removal-guard.`
  - `ACC-BUILDING-FLOW-010 remains owned by queue.script-editor-flow-playable-authoring-ux.`
- verification_sufficiency:
  - `Passed: focused RED/GREEN tests for runtime export/import/load, active content exposure, generic stage selection, and renderer branch guard.`
  - `Passed: npm run typecheck.`
  - `Passed: npm run lint:blueprints.`
  - `Passed: npm test.`
- functional_loss_audit:
  - `The generic shell preserved building entry, render, leave, and restore behavior; no verified path remained reachable only through removed house rendering branches.`
- replacement_proof_summary:
  - `House-specific rendering branches were superseded by the generic building shell, with explicit runtime materialization and persistence proof covering the replacement path.`
- gap_fill_decision:
  - `not-needed`
- gap_fill_scope:
  - `No high-priority missing item remained inside this queue after implementation verification.`
- remaining_gaps:
  - `Same-family residue: container item action dispatch through EventBindingRuntime remains routed to queue.building-container-event-trigger-integration.`
  - `Downstream residue remains for flow runtime/presenter, Script Editor flow authoring UX, built-in pack migration, legacy house runtime retirement, and final acceptance/removal guard.`
