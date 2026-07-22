# Event Playable Destination And Building Action Event Truth Convergence Queue

## Control Block

- queue_id: `queue.event-playable-destination-and-building-action-event-truth-convergence`
- belongs_to_version: `target.script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-22`
- governance_sync_source: `docs/blueprints/plans/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target-plan.md`
- queue_status: `suspended`
- queue_class: `required-candidate`
- active_task: `none`
- next_task: `task.event-playable-destination-and-building-action-event-truth-convergence.evidence-anchor-reconcile`
- closeout_status: `in-progress`
- execution_closeout_status: `partial`
- topic_closure_status: `open-residue`
- closure_basis: `recorded-only-candidate-not-admitted`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `auto-routable`
- next_family_candidate: `queue.event-playable-destination-and-building-action-event-truth-convergence`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `pending`
- sync_scope: `none`
- sync_summary: `Recorded-only candidate. No implementation or repository sync is authorized until later admission.`
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
- Recorded-only status:
  - `This queue is not admitted. queue_status=suspended means governance holding state only; no implementation, no active task execution, and no queue-closeout claims are authorized.`
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
  - `npm test`

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
  - `Only if later admitted. No code or runtime changes are authorized at candidate-record time.`
- Must preserve:
  - `No building-specific business branches in main.ts.`
  - `No compatibility layering or dual truth between event selection and event binding.`
  - `No regression of dialogue destinations or earlier closed routing-family retirement claims.`

#### Verification Coverage

- `If later admitted, verification must cover authoring diagnostics, export/import/loader lowering, building runtime click paths, and at least one browser proof for authored event->minigame/playable launch plus one building action interaction.`

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
- completed_task_count: `0`
- remaining_task_count: `3`
- active_task_summary: `Recorded-only candidate; if later admitted, start by reconciling evidence and choosing the canonical convergence path without code changes yet.`
- task_briefs:
  - `task.event-playable-destination-and-building-action-event-truth-convergence.evidence-anchor-reconcile: Confirm the exact source/runtime divergence and lawful parent-spec boundary before implementation.`
  - `task.event-playable-destination-and-building-action-event-truth-convergence.contract-implementation: Land the bounded event-owned lowering and building-action truth convergence without dual truth or building hardcode.`
  - `task.event-playable-destination-and-building-action-event-truth-convergence.queue-closeout-and-handoff: Verify completeness and return to version review without over-claiming final acceptance.`

### Completion Completeness Review

- review_status: `pending`
- can_claim_coverage:
  - `Candidate-record only. No Can Claim item is implemented or verified yet, so this queue does not claim ACC-EVENT-ONLY-ROUTING-007 / 008 until lawful admission and later closeout verification.`
- parent_spec_preservation:
  - `The recorded boundary preserves event-only routing, building creator-facing meaning, shared playable runtime reuse, export/import/loader/preview/runtime consistency, and the no-compatibility-residue direction without reopening scene or portrait ownership.`
- capability_floor_verification:
  - `Not yet executed because the queue is not admitted; later admission must verify dialogue destinations, existing eventBinding-driven building interactions, and shared playable runtime continuity still hold after convergence.`
- out_of_scope_routing:
  - `ACC-EVENT-CENTER-006 remains routed to queue.portrait-resource-authoring-and-resource-mapping-convergence, and ACC-EVENT-CENTER-008 remains routed to queue.script-editor-event-centered-authoring-final-acceptance-and-residue-guard unless this queue is later admitted before version closeout.`
- verification_sufficiency:
  - `Current evidence is sufficient only for candidate recording: it proves the unresolved gap and preserves the bounded queue contract, but it is not execution proof.`
- user_path_matrix_verification:
  - `Not yet executed because the queue is not admitted; later verification must cover authoring, export/import/loader, preview/runtime execution, follow-up return paths, and fail-closed diagnostics for missing playable or malformed building-action truth.`
- functional_loss_audit:
  - `No functionality is claimed changed at candidate-record time. The queue remains open specifically to prevent event-owned minigame launch and building-action event meaning from being silently lost or misrepresented as already closed.`
- replacement_proof_summary:
  - `Replacement proof is deferred until admission: closeout must show that dialogue-only runnable lowering and dead building-action event metadata are no longer production truth.`
- placeholder_or_legacy_fallback_audit:
  - `Candidate evidence already rejects copy-only warning cleanup, dead authoring selectors, or hidden duplicate eventBinding fallback as acceptable completion paths.`
- gap_fill_decision: `not-needed`
- gap_fill_scope:
  - `none`
- remaining_gaps:
  - `The entire queue topic remains pending until lawful admission; unresolved implementation scope stays on this same-family candidate rather than being absorbed by portrait or final-acceptance queues.`

### Progress Log

- `2026-07-22`: `Recorded as a same-target candidate after fresh source/runtime audit proved two remaining same-family gaps inside the current parent spec: event destination family "minigame" is still authorable but not runnable in export/runtime, and building action event selection still diverges from canonical runtime trigger truth. The queue is not admitted; no implementation or repository sync is authorized yet.`
