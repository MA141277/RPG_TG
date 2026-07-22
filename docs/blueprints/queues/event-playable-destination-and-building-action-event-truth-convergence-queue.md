# Event Playable Destination And Building Action Event Truth Convergence Queue

## Control Block

- queue_id: `queue.event-playable-destination-and-building-action-event-truth-convergence`
- belongs_to_version: `target.script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-22`
- governance_sync_source: `docs/blueprints/plans/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target-plan.md`
- queue_status: `done`
- queue_class: `required-candidate`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `closed`
- closure_basis: `acc-event-only-routing-007-008-covered-and-repository-sync-recorded`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `success`
- sync_scope: `remote-sync`
- sync_summary: `Repository sync gate satisfied: the completed queue was committed on mod-first-dev and push to origin/mod-first-dev succeeded after closeout docs, bounded verification, and change-log sync were recorded.`
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
  - `Converge event-owned minigame/playable destinations and building action event selection onto one runnable event truth across authoring, export/import, loader, preview, and runtime.`
- Parent spec:
  - `docs/blueprints/specs/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target.md`
- Parent requirement role:
  - `This queue owns ACC-EVENT-ONLY-ROUTING-007 / 008 if admitted. It exists because fresh source/runtime audit proved the current version still diverges on event->minigame/playable lowering and on whether building action event selection is canonical runtime truth or dead duplicated metadata.`
- Admission status:
  - `This queue was admitted from same-version residue routing and is now closed. ACC-EVENT-ONLY-ROUTING-007 / 008 are covered without reopening portrait-resource or final-acceptance ownership.`
- Forbidden expansions:
  - `Do not reopen formal scene-retirement work already closed in earlier queues.`
  - `Do not absorb portrait-resource convergence into this queue.`
  - `Do not hide the current gap behind UI copy changes while export/runtime remain dialogue-only or binding-duplicated.`
  - `Do not reintroduce building-specific business branches in main.ts or any equivalent runtime hardcode seam.`

### Parent Spec Inheritance

- inherited_required_capabilities:
  - `Building creator-facing meaning remains function -> event -> dialogue/minigame/task/function.`
  - `Event remains the only formal routing owner.`
  - `Editor preview, runtime export/import, loader resolution, and runtime behavior must stay on one event-owned truth.`
  - `Event-owned minigame/playable launches must be runnable rather than authoring-only selectors.`
  - `Building interaction authoring must not require duplicate hidden binding truth once event selection is presented as creator-facing meaning.`
- inherited_compatibility_paths:
  - `Implementation may still route through arrangement / event-binding / flow / playable where appropriate.`
  - `Shared playable runtime mechanisms remain the lawful execution path for minigame/playable launch.`
  - `Normal start, JSON runtime-pack import, and Script Editor runtime preview must stay aligned.`
- inherited_legacy_replacements:
  - `Dialogue-only event destination export restriction when minigame/playable target selection is already creator-facing truth.`
  - `Building action event selection that is stored in authoring but ignored by runtime unless a second hidden event-binding truth also exists.`
- inherited_non_goals:
  - `Do not reframe this as a copy-only warning cleanup.`
  - `Do not solve the gap through temporary compatibility shims or dual-path truth.`
  - `Do not move routing ownership away from event/event-binding back into building modules.`
- parent_spec_change_policy:
  - `If implementation proves the parent spec must change, update the parent spec first, then reconcile every affected candidate queue and evidence entry before claiming any capability as removed, retired, or unsupported.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-EVENT-ONLY-ROUTING-007`
  - `ACC-EVENT-ONLY-ROUTING-008`
- acceptance_not_claimed:
  - `ACC-EVENT-CENTER-006`
  - `ACC-EVENT-CENTER-008`
- minimum_verification:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm run build:test`
  - `bounded runtime/export/import/building/story regression scripts`

### Claim Boundary

#### Can Claim

- `ACC-EVENT-ONLY-ROUTING-007: event destination family "minigame" lowers to runnable event-owned playable launch truth across authoring, export/import, loader, preview, and runtime.`
- `ACC-EVENT-ONLY-ROUTING-008: building action event selection and runtime trigger activation converge on one canonical event truth without duplicate hidden binding truth or dead creator-facing event selectors.`

#### Cannot Claim

- `ACC-EVENT-CENTER-006: portrait resource authoring/runtime convergence.`
- `ACC-EVENT-CENTER-008: final simulated-human acceptance for the whole version.`
- `Out-of-scope means not implemented by this queue; it does not mean retired, removed, or unsupported unless the parent spec was updated first.`

#### Capability Floor

- `If this queue is later admitted, the project must leave the queue with event-owned minigame/playable launches and building action event truth both runnable and aligned across editor/export/import/loader/preview/runtime, not merely better labeled in the UI.`

#### Parent Capability Coverage

- owned_closure:
  - `Event-owned minigame/playable lowering and building action event-truth convergence if admitted.`
- preserved_not_owned:
  - `Scene-retirement closure remains historical truth and is not reopened here.`
  - `Portrait-resource convergence remains owned by queue.portrait-resource-authoring-and-resource-mapping-convergence.`
  - `Final no-over-narrowing acceptance remains owned by queue.script-editor-event-centered-authoring-final-acceptance-and-residue-guard unless this queue is later admitted before closeout.`
- routed_elsewhere:
  - `Any portrait, final-acceptance, or broader future-target concerns stay routed to their existing owners.`

#### Over-Narrowing Guard

- parent_capabilities_not_owned_by_this_queue:
  - `Portrait resources, variants, and mapping remain outside this queue.`
  - `Version-wide final acceptance remains outside this queue.`
- forbidden_scope_shrinkage:
  - `Do not pass this queue by suppressing the unsupported warning while export/runtime still cannot run event-owned minigame destinations.`
  - `Do not pass this queue by keeping building action event selection as non-authoritative dead metadata.`
  - `Do not pass this queue by requiring creators to maintain both action-item event selection and a second hidden eventBinding truth for the same interaction.`
- unspecified_detail_policy:
  - `Prefer one event-owned truth, explicit lowering, and shared playable runtime reuse over copy-only cleanup, compatibility wrappers, or runtime-side reconstruction.`
- gap_routing_policy:
  - `If later admission finds additional same-family gaps, record same-family residue instead of pushing them into portrait or final-acceptance queues.`

#### Legacy Paths To Replace

- `Event destination export that treats dialogue as the only runnable destination family.`
- `Event runtime action contracts that lack a first-class event-owned playable/minigame launch shape.`
- `Building action authoring where action item eventId is creator-facing truth but runtime activation still depends on a second hidden binding path.`

#### Compatibility Paths To Preserve

- `Shared playable runtime as the lawful execution path for minigame/playable launch.`
- `Building interaction meaning and reachability.`
- `Event-binding trigger semantics where they remain the chosen implementation seam.`
- `Normal start, JSON runtime-pack import, and Script Editor runtime preview convergence.`

#### User Path Coverage Matrix

- primary_paths:
  - `Script Editor authors event destination -> minigame/playable and the authored target runs in preview/runtime through the same event-owned truth.`
- alternate_paths:
  - `Export/import/loader preserve the same event-owned target relationships without dialogue-only or flow-only fallback.`
- leave_return_or_followup_paths:
  - `Building action click, minigame/playable exit, and return routing remain reachable without hidden duplicate routing truth.`
- empty_or_fail_closed_paths:
  - `Missing playable binding, missing integration, or malformed action truth fail closed with explicit diagnostics rather than silently no-oping.`
- rejection_or_error_paths:
  - `Unsupported destination or mismatched building-action truth surfaces a truthful diagnostic instead of pretending the authored event is runnable.`
- forbidden_regressions:
  - `Do not break existing dialogue destinations or existing eventBinding-driven building interactions while converging the new canonical truth.`

#### Meaning Preservation

- creator_facing_meaning:
  - `Creators still think in function -> event -> dialogue/minigame/task/function; selecting a building action event or minigame destination must mean something runnable.`
- runtime_meaning:
  - `Runtime continues to treat event/event-binding as the formal router and shared playable runtime as the lawful minigame/playable executor.`
- trigger_timing_or_context:
  - `Building action trigger timing/context must not be silently narrowed or re-hardcoded during convergence.`
- consistency_surfaces:
  - `Editor authoring, preview, runtime export/import, loader resolution, and runtime execution must either agree or fail closed on the same truth.`

#### Functional Loss Budget

- budget: `zero`
- loss_accounting_rule:
  - `Any lost building interaction, minigame launch, or event reachability must be fixed or routed as residue/blocker rather than silently accepted.`

#### Implementation Anchors

- Must inspect:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/minigame-binding-authoring.ts`
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/application/building/building-container-event-runtime.ts`
  - `src/domain/event.ts`
  - `src/core/runtime/playable-runtime.ts`
  - `src/core/runtime/interactive-runtime.ts`
  - `src/main.ts`
  - `tests/**`
- Must modify:
  - `src/domain/event.ts`
  - `src/application/events/event-playable-runtime.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/building/building-container-event-runtime.ts`
  - `src/application/dialogue/dialogue-runner.ts`
  - `src/application/story/story-runtime.ts`
  - `src/main.ts`
  - `tests/**`
- Must preserve:
  - `No building-specific business branches in main.ts.`
  - `No compatibility layering or dual truth between event selection and event binding.`
  - `No regression of dialogue destinations or earlier closed routing-family retirement claims.`

#### Verification Coverage

- `Verification covered authoring/export diagnostics, export/import lowering, building runtime click paths, and story-trigger event-owned playable launch through focused runtime/export/import/building/story regression scripts plus bounded robustness guards.`

#### Replacement Proof

- previous_owner_or_path:
  - `Dialogue-only runnable destination lowering and duplicated building action event truth.`
- new_owner_or_path:
  - `Event-owned runnable playable launch truth and one canonical building action event truth.`
- behavior_preservation_expectation:
  - `Existing dialogue/event behavior keeps working while minigame/playable and building action event semantics become truthful and runnable.`
- old_truth_owner_exit_proof:
  - `The queue may only close after the old dialogue-only restriction and dead action-item event selector semantics are no longer required production truth.`
- verification_evidence:
  - `Must later prove that authoring, export/import, loader, preview, and runtime all agree on the same canonical event truth.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target-plan.md`

### Queue Snapshot

- queue_goal: `Make event-owned minigame/playable destinations runnable and make building action event selection authoritative on one event truth.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Completed. Event-owned minigame/playable destinations now lower into runnable launchPlayable runtime truth, building action clicks honor canonical eventId routing, and repository sync is recorded as successful.`
- task_briefs:
  - `task.event-playable-destination-and-building-action-event-truth-convergence.evidence-anchor-reconcile: Confirm the exact source/runtime divergence and lawful parent-spec boundary before implementation.`
  - `task.event-playable-destination-and-building-action-event-truth-convergence.contract-implementation: Land the bounded event-owned lowering and building-action truth convergence without dual truth or building hardcode.`
  - `task.event-playable-destination-and-building-action-event-truth-convergence.queue-closeout-and-handoff: Verify completeness and return to version review without over-claiming final acceptance.`

### Completion Completeness Review

- review_status: `done`
- can_claim_coverage:
  - `ACC-EVENT-ONLY-ROUTING-007 is covered: event destination family "minigame" now lowers to launchPlayable runtime actions during export, import reconstructs the authored minigame destination from launchPlayable.integrationId, and building/story/dialogue runtime entrypoints all reuse the shared event-playable runtime path instead of failing closed at dialogue-only truth.`
  - `ACC-EVENT-ONLY-ROUTING-008 is covered: building action event selection now passes rendered eventId into triggerBuildingContainerItemAction, EventBindingRuntime filters bindings against that canonical eventId when present, and focused building runtime coverage proves the clicked event remains authoritative even when higher-priority duplicate bindings exist.`
- parent_spec_preservation:
  - `The completed implementation preserves event-only routing, building creator-facing meaning, shared playable runtime reuse, export/import/loader/preview/runtime consistency, and the no-compatibility-residue direction without reopening scene or portrait ownership.`
- capability_floor_verification:
  - `Passed. Dialogue destinations still export/import normally, existing EventBindingRuntime-driven building interactions remain reachable, and shared playable runtime continuity is preserved by one event-playable helper used from building, story, and dialogue entrypoints.`
- out_of_scope_routing:
  - `ACC-EVENT-CENTER-006 remains historical truth owned by queue.portrait-resource-authoring-and-resource-mapping-convergence, and ACC-EVENT-CENTER-008 remains historical truth owned by queue.script-editor-event-centered-authoring-final-acceptance-and-residue-guard.`
- verification_sufficiency:
  - `Passed with npm run typecheck, npm run lint:blueprints, npm run build:test, and bounded regression scripts covering event destination minigame export/import lowering, building runtime playable launch, and story-trigger playable launch.`
- user_path_matrix_verification:
  - `Covered. Authoring/export/import preserve minigame event destinations, building action clicks launch the authored playable through the canonical eventId path, story-triggered event-owned playable launches no longer fall back to dialogue, and malformed/missing minigame bindings still fail closed during export diagnostics.`
- functional_loss_audit:
  - `Passed. The queue did not remove dialogue destinations, did not bypass EventBindingRuntime ownership, did not add building-specific main.ts branches, and did not split playable execution onto a second ad hoc runtime path.`
- replacement_proof_summary:
  - `Replacement proof is complete: dialogue-only runnable lowering is no longer the only export path because minigame destinations lower into launchPlayable runtime truth, and dead building-action event metadata is no longer required because the clicked eventId now selects the authoritative binding path directly.`
- placeholder_or_legacy_fallback_audit:
  - `Passed. The queue did not settle for copy-only warning cleanup, dead authoring selectors, or hidden duplicate eventBinding fallback; the canonical runtime path now consumes explicit launchPlayable actions and explicit rendered eventId truth.`
- gap_fill_decision: `not-needed`
- gap_fill_scope:
  - `none`
- remaining_gaps:
  - `none`

### Progress Log

- `2026-07-22`: `Recorded as a same-target candidate after fresh source/runtime audit proved two remaining same-family gaps inside the current parent spec: event destination family "minigame" was still authorable but not runnable in export/runtime, and building action event selection still diverged from canonical runtime trigger truth.`
- `2026-07-22`: `Evidence-anchor reconcile and contract implementation completed inside the admitted ACC-EVENT-ONLY-ROUTING-007 / 008 boundary. The queue added first-class launchPlayable event runtime actions, lowered event destination family "minigame" into runnable launchPlayable export truth, reconstructed authored minigame destinations during import, reused one shared event-playable runtime across building/story/dialogue entrypoints, and treated rendered building action eventId as canonical EventBindingRuntime truth without adding building-specific main.ts branches.`
- `2026-07-22`: `Focused verification passed with npm run typecheck, npm run lint:blueprints, npm run build:test, plus bounded runtime/export/import/building/story regression scripts. The required repository sync batch is now recorded as successful on mod-first-dev, so the queue is closed with no same-family residue and control returns to version review.`
