# Event-Owned Routing Dialogue Playable Settlement Convergence Queue

## Control Block

- queue_id: `queue.event-owned-routing-dialogue-playable-settlement-convergence`
- belongs_to_version: `target.script-editor-content-format-runtime-layout-and-module-capability-convergence`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-27`
- governance_sync_source: `docs/blueprints/plans/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target-plan.md`
- queue_status: `done`
- queue_class: `required`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `open-residue`
- closure_basis: `Queue execution and closeout review are complete. ACC-FORMAT-004 is now covered on the converged path: dialogue-runner/story-runtime and dialogue-choice-resolver nextEvent continuation both route through the shared event-continuation seam, runtime dialogue presentation consumes portrait/side truth, background/music nodes render explicit presentation truth instead of the generic transition placeholder, dedicated dialogue-music playback consumes authored music cues, current shipped story background ids used by the zhuyuanzhang and liu-bang packs resolve preview images, and covered event-owned playable completion preserves formal settlement plus event-owned follow-up parity. The remaining sample-scenario bg.council_room preview gap is accepted fail-closed residue rather than queue-owned implementation debt.`
- residue_remaining: `yes`
- residue_family: `accepted-residue`
- residue_routing_status: `needs-version-review`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- auto_continue_policy: `required`
- idle_after_task_completion: `forbidden`
- queue_close_handoff: `version-plan-routing`
- sync_status: `pending`
- sync_scope: `local-record`
- sync_summary: `Queue closeout proof is now recorded locally. The minimum repository-sync gate for the completed ACC-FORMAT-004 batch is the next lawful action before later-queue admission can be written.`
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
  - `Converge all covered follow-up behavior onto event-owned routing so dialogue, playable, settlement, and related runtime chains consume one canonical event-owned continuation truth without private continuation/result paths.`
- Parent spec:
  - `docs/blueprints/specs/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target.md`
- Parent requirement role:
  - `This queue is the required third execution slice under the active version. It owns ACC-FORMAT-004 only; runtime-layout persistence and final full-chain acceptance remain version-owned follow-up queues.`
- Admission status:
  - `Admitted after queue.stage-host-binding-and-menu-resource-runtime-convergence closed honestly with accepted compatibility residue recorded and no active task remaining.`
- Forbidden expansions:
  - `Do not absorb runtime-layout registry persistence or runtime UI layering into this queue.`
  - `Do not absorb final export/import/loading/preview/runtime acceptance into this queue.`
  - `Do not reopen ACC-FORMAT-003 stage/menu ownership or ACC-FORMAT-001 / 002 authoring-format baseline except where direct continuity is required for ACC-FORMAT-004.`
  - `Do not introduce a second router, private continuation owner, settlement-owned routing owner, or building-specific business branch in src/main.ts.`

### Parent Spec Inheritance

- inherited_required_capabilities:
  - `All covered follow-up flow must converge onto event-owned routing; no module may keep a private continuation chain, private jump rule, or private result-routing rule beside event.`
  - `Playable results must not bypass settlement or event-owned follow-up routing when write-back is required.`
  - `Settlement owns mutation/write-back only and must not become a second routing owner.`
  - `Dialogue runtime presentation must consume creator-configured dialogue truth, including visible composition settings such as portrait placement.`
  - `Authoring, export/import, preview, runtime loading, and runtime execution must agree on the same event-owned routing truth rather than reconstructing retired private continuation seams.`
- inherited_compatibility_paths:
  - `The settled ACC-FORMAT-003 stage/menu reference model remains the prerequisite baseline for entry surfaces that trigger events.`
  - `Menu, dialogue, playable, settlement, and stage configuration may still trigger or reference events, but event remains the sole routing owner.`
  - `Normal start, JSON/runtime-pack import, and Script Editor runtime preview must stay aligned while routing ownership converges.`
- inherited_legacy_replacements:
  - `Dialogue, playable, settlement, stage, or runtime helper seams that still own follow-up continuation, result-destination, or return-strategy truth outside event.`
  - `Dialogue presentation paths that ignore creator-configured runtime presentation truth even when the authoring surface exposes it.`
  - `Playable output handling that bypasses settlement or event-owned follow-up routing through private result protocols.`
- inherited_non_goals:
  - `Do not treat runtime-layout persistence, layout save-back, or runtime UI layering as part of this queue.`
  - `Do not claim final fail-closed full-chain acceptance here.`
  - `Do not preserve private continuation logic as compatibility fallback once the event-owned path is landed.`
- parent_spec_change_policy:
  - `If implementation proves the parent spec must change, update the parent spec first and then reconcile the version plan and every affected queue before treating any inherited capability as removed, unsupported, or deferred.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-FORMAT-004`
- acceptance_not_claimed:
  - `ACC-FORMAT-005`
  - `ACC-FORMAT-006`
- minimum_verification:
  - `npm run build:test`
  - `node --test tests/robustness.test.cjs`
  - `npm run lint:blueprints`
  - `npm run lint:blueprint-skill`
  - `npm run blueprint:governance:check`

### Claim Boundary

#### Can Claim

- `ACC-FORMAT-004: all covered follow-up flow converges onto event-owned routing; playable output formally reaches settlement when needed; dialogue runtime truly consumes author-configured presentation; and no covered module retains a private continuation chain.`

#### Cannot Claim

- `ACC-FORMAT-005: runtime-layout registry persistence and runtime UI layering convergence.`
- `ACC-FORMAT-006: final export/import/loading/preview/runtime full-chain acceptance and fail-closed rejection proof.`
- `Closed ACC-FORMAT-003 stage/menu work remains historical queue evidence and must not be silently reopened here.`

#### Capability Floor

- `When this queue closes, event must be the only routing owner across the covered follow-up chains, dialogue runtime must visibly honor creator-configured presentation truth, playable output that needs write-back must reach settlement through the formal path, and no private continuation/result protocol may remain as production truth.`

#### Parent Capability Coverage

- owned_closure:
  - `Event-owned routing convergence, private continuation retirement, playable-to-settlement handoff when meaning requires it, and dialogue runtime presentation truth completion.`
- preserved_not_owned:
  - `ACC-FORMAT-001 / 002 authoring-format and numeric-id baseline remain closed prerequisite truth.`
  - `ACC-FORMAT-003 stage/menu ownership convergence remains closed prerequisite truth with accepted compatibility residue already recorded.`
  - `ACC-FORMAT-005 runtime-layout persistence and ACC-FORMAT-006 final acceptance remain fully owned by later queues.`
- routed_elsewhere:
  - `Runtime-layout persistence plus runtime UI layering stays with queue.runtime-layout-registry-and-ui-layering-convergence.`
  - `Full-chain acceptance stays with queue.preview-runtime-loading-full-chain-consistency-and-final-acceptance.`

#### Over-Narrowing Guard

- parent_capabilities_not_owned_by_this_queue:
  - `Runtime-layout registry persistence and runtime UI layering remain outside this queue.`
  - `Final export/import/loading/preview/runtime acceptance remains outside this queue.`
- forbidden_scope_shrinkage:
  - `Do not pass this queue by only relabeling routing fields while runtime still follows private continuation, result, or return paths outside event.`
  - `Do not pass this queue by only wiring settlement write-back while dialogue runtime still ignores creator-configured presentation truth.`
  - `Do not pass this queue by preserving playable-, dialogue-, or settlement-owned continuation helpers as hidden fallback after event-owned routing is claimed complete.`
- unspecified_detail_policy:
  - `Prefer explicit event-owned routing truth, fail-closed rejection, and shared runtime seams over compatibility wrappers, hidden continuation reconstruction, or module-local callback chains.`
- gap_routing_policy:
  - `If any remaining continuation or settlement-routing gap still belongs to ACC-FORMAT-004, keep it inside this queue as same-family residue rather than pushing it into runtime-layout or final-acceptance queues.`

#### Legacy Paths To Replace

- `Dialogue, playable, settlement, stage, or building/runtime entry helpers that preserve private continuation, return, or result-routing truth beside event.`
- `Dialogue runtime presentation paths that disregard creator-authored presentation settings at runtime.`
- `Playable result handling that writes back or continues without formal settlement/event-owned routing.`

#### Compatibility Paths To Preserve

- `The closed stage/menu reference model from ACC-FORMAT-003.`
- `Normal start, JSON/runtime-pack import, and Script Editor runtime preview convergence.`
- `Event-trigger reachability from menus, dialogue, playables, stage, and other covered surfaces while ownership of follow-up routing stays with event.`

#### User Path Coverage Matrix

- semantic_dimensions:
  - `event-owned routing`
  - `dialogue presentation truth`
  - `playable settlement handoff`
  - `private continuation retirement`
  - `entrypoint parity`
- primary_paths:
  - `Creators author dialogue/playable/settlement/event relationships once and runtime follows the same event-owned continuation truth during normal execution.`
  - `Dialogue runtime renders creator-configured presentation settings instead of a hardcoded/private presentation path.`
- alternate_paths:
  - `Normal start, JSON/runtime-pack import, and Script Editor runtime preview preserve the same event-owned follow-up behavior without module-private reconstruction.`
- leave_return_or_followup_paths:
  - `Playable exit, dialogue end, settlement follow-up, and stage/menu-triggered event continuation remain reachable through event-owned routing only.`
- empty_or_fail_closed_paths:
  - `Missing event-owned continuation, missing settlement linkage, or unsupported dialogue presentation configuration must fail closed rather than silently reusing a private continuation path.`
- rejection_or_error_paths:
  - `Any second router, private continuation chain, or settlement-bypassing result path must surface as explicit validation, import, or runtime failure during queue closeout.`
- forbidden_regressions:
  - `Do not regress the closed stage/menu chain, and do not let runtime-layout work leak into this queue under the label of routing convergence.`

#### Meaning Preservation

- creator_facing_meaning:
  - `Creators still author events, dialogue, playables, and settlement meaning in the same covered modules, but authored follow-up semantics now resolve through one event-owned routing truth.`
- runtime_meaning:
  - `Runtime treats event as the sole router, settlement as mutation-only write-back, and dialogue/playable/stage/menu as producers or consumers of event-owned continuation truth rather than private routing owners.`
- trigger_timing_or_context:
  - `Covered runtime entrypoints may still trigger or reference events, but trigger timing must not smuggle continuation ownership back into module-local callback chains.`
- consistency_surfaces:
  - `Authoring, save/load, export/import, preview, runtime loading, and runtime execution must stay on one event-owned routing direction.`

#### Functional Loss Budget

- budget: `zero`
- loss_accounting_rule:
  - `Any lost follow-up reachability, settlement write-back, or dialogue presentation capability must be repaired in-queue or routed explicitly as residue/blocker. It cannot be erased by declaring the capability a later runtime-layout or final-acceptance concern.`

#### Implementation Anchors

- Must inspect:
  - `src/application/events/event-runner.ts`
  - `src/application/events/event-playable-runtime.ts`
  - `src/application/dialogue/dialogue-runner.ts`
  - `src/application/dialogue/dialogue-presentation.ts`
  - `src/application/story/story-runtime.ts`
  - `src/application/story/story-callbacks.ts`
  - `src/application/runtime/indoor-screen-story-follow-up.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/**`
- Must modify:
  - `src/application/events/**`
  - `src/application/dialogue/**`
  - `src/application/story/**`
  - `src/application/runtime/**`
  - `src/application/script-editor/**`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/**`
  - `docs/change-log.md`
- Must preserve:
  - `No second routing owner beside event.`
  - `No settlement-owned routing owner.`
  - `No runtime-layout ownership drift into this queue.`

#### Verification Coverage

- `Verification must prove that covered follow-up chains route through event only, dialogue runtime consumes creator-configured presentation truth, playable output reaches settlement when required, and entrypoint parity survives across export/import/preview/runtime.`

#### Replacement Proof

- previous_owner_or_path:
  - `Private continuation, return, or result-routing seams outside event plus dialogue runtime presentation paths that do not consume creator-configured truth.`
- new_owner_or_path:
  - `Event-owned continuation truth across covered follow-up chains, with settlement as mutation-only write-back and dialogue runtime consuming creator-authored presentation truth.`
- behavior_preservation_expectation:
  - `Covered follow-up behavior remains reachable across entrypoints while private continuation ownership disappears.`
- old_truth_owner_exit_proof:
  - `The queue may close only after covered runtime paths no longer depend on private continuation or settlement-bypassing result protocols as production truth.`
- verification_evidence:
  - `Runtime tests, authoring/runtime parity tests, and source-removal guards must prove one event-owned routing truth rather than UI-only cleanup or one happy-path wiring.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/stage-host-binding-and-menu-resource-runtime-convergence-queue.md`

### Queue Snapshot

- queue_goal: `Make event the sole routing owner across dialogue/playable/settlement follow-up behavior and complete dialogue/runtime truth on the converged model.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `No active task remains; bounded ACC-FORMAT-004 implementation and closeout proof are complete locally, with accepted fail-closed residue recorded and repository-sync gating now pending before version-plan handoff.`
- task_briefs:
  - `task.event-owned-routing-dialogue-playable-settlement-convergence.evidence-anchor-reconcile: freeze the exact private-continuation, dialogue-presentation, and playable-settlement seams that still keep ACC-FORMAT-004 open.`
  - `task.event-owned-routing-dialogue-playable-settlement-convergence.event-owned-routing-and-runtime-chain-implementation: land the bounded event-owned routing, dialogue/runtime, and settlement handoff convergence without introducing a second router.`
  - `task.event-owned-routing-dialogue-playable-settlement-convergence.queue-closeout-review-and-sync-gate: verify ACC-FORMAT-004 coverage, classify residue honestly, and run the repository-sync gate before handoff to the runtime-layout queue.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded execution slice landed and verified.`
- `execution_closeout_status = partial means the queue is actively landing ACC-FORMAT-004 work and cannot claim closeout yet.`
- `execution_closeout_status = blocked means execution cannot continue without a concrete blocker recorded in blocked_by.`
- `topic_closure_status = closed is legal only when no still-blocking same-family residue remains inside the queue's bounded topic surface.`
- `topic_closure_status = open-residue means the queue still owns unfinished same-family work or explicitly routed residue.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`
- `Active-task completion, queue closeout sync, and active queue handoff are transitions, not lawful pause points by themselves.`

### Completion Completeness Review

- review_status: `accepted-residue`
- can_claim_coverage:
  - `Implementation coverage is now sufficient to enter closeout review. The covered routing slices retired direct nextEvent continuation ownership from dialogue-runner/story-runtime and dialogue-choice-resolver into the shared event-continuation seam, runtime dialogue presentation consumes portrait/side truth, background/music nodes render explicit authored presentation truth instead of the generic transition placeholder, dedicated dialogue-music playback now consumes authored music cues, current shipped story background ids used by the zhuyuanzhang and liu-bang packs resolve preview images, and covered event-owned playable completion preserves formal settlement plus event-owned follow-up parity.`
- parent_spec_preservation:
  - `Preserved so far. Runtime-layout persistence and final acceptance remain routed to later queues.`
- capability_floor_verification:
  - `Implementation proof now covers the queue capability floor on the converged path: the shared continuation seam is verified for dialogue-runner/story-runtime and dialogue-choice-resolver, runtime dialogue presentation consumes portrait/side truth, background/music nodes render explicit authored presentation truth instead of the generic transition placeholder, dedicated dialogue-music playback consumes authored music cues, and covered event-owned playable completion preserves formal settlement plus event-owned follow-up parity. Closeout review still must judge whether the remaining unmapped authored background ids are accepted fail-closed residue or same-family follow-up work.`
- out_of_scope_routing:
  - `ACC-FORMAT-005 and ACC-FORMAT-006 remain routed to their recorded follow-up queues in the version plan.`
- verification_sufficiency:
  - `Queue-level closeout proof is now sufficient. The bounded verification set is green, accepted residue is classified, and only the repository-sync gate result remains to be recorded before handoff.`
- user_path_matrix_verification:
  - `Implementation coverage now includes the shared continuation seam across dialogue-runner/story-runtime and dialogue-choice-resolver, portrait/side runtime dialogue presentation consumption, explicit background/music presentation, dedicated dialogue-music playback, current shipped story background preview mapping, and covered event-owned playable completion parity. The remaining sample-scenario bg.council_room preview gap is now explicitly classified as accepted fail-closed residue outside the queue capability floor.`
- functional_loss_audit:
  - `No loss is accepted; any discovered follow-up regression must stay inside this queue as repair or residue.`
- replacement_proof_summary:
  - `Implementation proof is now complete enough for closeout review. dialogue-runner, story-runtime, and dialogue-choice-resolver no longer own direct nextEvent continuation as production truth because those paths now pass through the shared fail-closed event-continuation seam, runtime dialogue presentation consumes portrait/side truth, background/music nodes surface explicit authored presentation truth rather than the generic transition placeholder, dedicated dialogue-music playback consumes authored music cues, and covered event-owned playable completion preserves formal settlement plus event-owned follow-up parity. The remaining judgement is whether partial preview coverage for other authored background ids is accepted fail-closed residue or same-family work.`
- placeholder_or_legacy_fallback_audit:
  - `Private continuation or settlement-bypassing fallback is not authorized as a passing state for this queue.`
- gap_fill_decision:
  - `not-needed`
- gap_fill_scope:
  - `none`
- remaining_gaps:
  - `none inside queue-owned implementation scope; sample-scenario bg.council_room remains accepted fail-closed preview residue outside the current shipped authored background-preview map.`
  - `Repository-sync gate result is still pending.`

### Admission Preconditions

- `This queue was admitted only after queue.stage-host-binding-and-menu-resource-runtime-convergence closed honestly with no active task remaining and with its accepted compatibility residue already recorded.`
- `Implementation must not start outside this queue's admitted ACC-FORMAT-004 boundary.`
- `Candidate tracking remains in the version plan; this queue doc is now the queue-level execution governor.`

### Blueprint Lint Failure Handling

- `If npm run lint:blueprints fails while this queue is active, repair the queue doc, version-plan linkage, or in-scope governing structure before continuing implementation or closeout.`
- `If the failure shows this queue's spec is under-structured or over-narrowed, revise the queue spec inside this queue first; do not mark the issue as accepted residue or silently hand it to later queues.`
- `If the failure cannot be resolved inside this queue's admitted boundary without changing the parent spec or lawful ownership, record a real blocker or route the change back to version-level governance instead of proceeding through a failed lint gate.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, record local repository sync state.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Task-level after-state uses local-record only; task completion does not by itself require commit, push, or merge.`
- `Under the current version-level repository sync gate, queue closeout must first synchronize queue closeout docs and routing truth, then attempt one local branch-commit, then attempt remote push, then attempt merge if current repository workflow requires merge for development-trunk synchronization.`
- `The next queue must not be admitted or activated until that minimum sync batch has returned a recorded result.`

### Activation Order

1. `queue.stage-host-binding-and-menu-resource-runtime-convergence closes and returns control to version-plan routing.`
2. `The version plan switches active_queue to this queue and records the handoff basis.`
3. `This queue doc is created, evidence lock is reconciled, and only then may live implementation continue.`

### Recovery Rule

- `Do not recreate or reactivate this queue from scratch if the version plan already records its admission basis.`
- `Resume from the version-plan admission record unless new material evidence invalidates that prior basis.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.event-owned-routing-dialogue-playable-settlement-convergence.evidence-anchor-reconcile` | `done` | `Freeze the exact private-continuation, dialogue-presentation, and playable-settlement seams that still keep ACC-FORMAT-004 open.` | `queue.stage-host-binding-and-menu-resource-runtime-convergence closed` | `Done. Admission reconciled the queue boundary against ACC-FORMAT-004 and locked the routing/dialogue/settlement implementation anchors without widening into runtime-layout or final-acceptance work.` |
| `task.event-owned-routing-dialogue-playable-settlement-convergence.event-owned-routing-and-runtime-chain-implementation` | `done` | `Land the bounded event-owned routing, dialogue/runtime, and settlement handoff convergence without introducing a second router.` | `task.event-owned-routing-dialogue-playable-settlement-convergence.evidence-anchor-reconcile` | `Done. The covered routing slices now move dialogue-runner/story-runtime and dialogue-choice-resolver direct nextEvent continuation into the shared fail-closed event-continuation seam, runtime dialogue presentation consumes portrait/side truth, background/music nodes no longer fall through the generic transition placeholder, dedicated dialogue-music playback consumes authored cues, current shipped story background ids resolve preview images, and covered event-owned playable completion preserves formal settlement plus event-owned follow-up parity.` |
| `task.event-owned-routing-dialogue-playable-settlement-convergence.queue-closeout-review-and-sync-gate` | `done` | `Verify ACC-FORMAT-004 coverage, classify residue honestly, and run the repository-sync gate before handoff to the runtime-layout queue.` | `task.event-owned-routing-dialogue-playable-settlement-convergence.event-owned-routing-and-runtime-chain-implementation` | `Done locally. Closeout review records sample-scenario bg.council_room as accepted fail-closed residue and returns the queue to version-level repository-sync handling.` |

### Task Definitions

#### `task.event-owned-routing-dialogue-playable-settlement-convergence.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.event-owned-routing-dialogue-playable-settlement-convergence.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/specs/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target.md`
  - `docs/blueprints/plans/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target-plan.md`
  - `src/application/events/**`
  - `src/application/dialogue/**`
  - `src/application/story/**`
  - `src/application/runtime/**`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `tests/**`
- must_inspect:
  - `Current non-event routing owners and private continuation/result seams.`
  - `Current dialogue runtime presentation gaps against creator-authored dialogue truth.`
  - `Current playable output paths that still bypass settlement or event-owned follow-up routing when write-back is required.`
- must_not_change:
  - `Do not begin implementation before the queue records exact ACC-FORMAT-004 ownership and replacement proof anchors.`
  - `Do not widen this queue into runtime-layout persistence, runtime UI layering, or final acceptance work.`
- done_when:
  - `Evidence lock is recorded with concrete source anchors for ACC-FORMAT-004.`
  - `Can Claim and Cannot Claim list the exact version acceptance this queue owns.`
  - `The queue records the exact routing/dialogue/settlement changes that belong to the implementation batch.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:blueprint-skill`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Return to version review and record the blocker rather than starting implementation on a drifting boundary.`
- promote_next_if_done: `task.event-owned-routing-dialogue-playable-settlement-convergence.event-owned-routing-and-runtime-chain-implementation`
- human_input_required: `false`
- next_lawful_action_if_done: `task.event-owned-routing-dialogue-playable-settlement-convergence.event-owned-routing-and-runtime-chain-implementation`
- next_lawful_action_if_blocked: `write-version-stop-truth-and-record-blocker`
- auto_promote_if_done: `true`
- stop_if:
  - `The parent spec must change before any bounded ACC-FORMAT-004 implementation can be selected.`
  - `The queue would have to absorb runtime-layout or final-acceptance work just to land ACC-FORMAT-004.`

##### Human Context

- task_brief:
  - `Lock the event-owned routing, dialogue runtime truth, and settlement handoff implementation boundary before code changes start.`
- task_outcome_summary:
  - `Done. Admission reconciled ACC-FORMAT-004 against the current version boundary and confirmed that the live queue ownership is the remaining event-owned routing, dialogue runtime presentation, and playable-settlement continuation surface rather than stage/menu, runtime-layout, or final-acceptance work.`

#### `task.event-owned-routing-dialogue-playable-settlement-convergence.event-owned-routing-and-runtime-chain-implementation`

##### Control Block

- task_id: `task.event-owned-routing-dialogue-playable-settlement-convergence.event-owned-routing-and-runtime-chain-implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/application/events/**`
  - `src/application/dialogue/**`
  - `src/application/story/**`
  - `src/application/runtime/**`
  - `src/application/script-editor/**`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/**`
  - `docs/change-log.md`
- must_inspect:
  - `Evidence-anchor reconcile outcome.`
  - `Every covered routing/dialogue/settlement seam that still owns private continuation or non-event result truth.`
  - `Current creator-facing dialogue presentation and follow-up surfaces that do not yet survive into runtime.`
- must_modify:
  - `Covered event-owned routing/runtime seams.`
  - `Dialogue runtime presentation consumption seams.`
  - `Playable-to-settlement handoff seams proven necessary by the evidence lock.`
  - `Regression tests and change-log entries for landed code/runtime/editor behavior changes.`
- must_replace:
  - `Private continuation, return, or result-routing truth outside event for covered surfaces.`
  - `Dialogue runtime presentation fallback that ignores creator-configured truth.`
- must_preserve:
  - `The closed ACC-FORMAT-003 stage/menu chain and earlier authoring-format baseline.`
  - `Event as the sole routing owner.`
  - `No runtime-layout or final-acceptance scope expansion.`
- must_not_change:
  - `Do not widen into runtime-layout persistence or UI layering work.`
  - `Do not widen into final full-chain acceptance work.`
  - `Do not preserve dual old/new routing truth as a compatibility layer.`
- done_when:
  - `Covered follow-up chains route through event only.`
  - `Dialogue runtime consumes creator-configured presentation truth on the covered surfaces.`
  - `Playable output reaches settlement when required by meaning instead of bypassing it through a private result protocol.`
  - `Build, regression, and Blueprint verification pass.`
- verify_with:
  - `npm run build:test`
  - `node --test tests/robustness.test.cjs`
  - `npm run lint:blueprints`
  - `npm run lint:blueprint-skill`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record the blocker without inventing a compatibility fallback or silently narrowing queue ownership.`
- promote_next_if_done: `task.event-owned-routing-dialogue-playable-settlement-convergence.queue-closeout-review-and-sync-gate`
- human_input_required: `false`
- next_lawful_action_if_done: `task.event-owned-routing-dialogue-playable-settlement-convergence.queue-closeout-review-and-sync-gate`
- next_lawful_action_if_blocked: `write-version-stop-truth-and-record-blocker`
- auto_promote_if_done: `true`
- stop_if:
  - `Implementation requires parent-spec widening into later queue ownership.`
  - `Implementation can only proceed by preserving a second routing owner or private continuation fallback.`

##### Human Context

- task_brief:
  - `Land the event-owned routing, dialogue runtime truth, and settlement handoff batch for ACC-FORMAT-004.`
- task_outcome_summary:
  - `Done. The covered routing slices now move dialogue-runner/story-runtime and dialogue-choice-resolver direct nextEvent continuation through the shared fail-closed event-continuation seam, the latest dialogue presentation slices make runtime honor creator-authored/runtime-defined portrait/side truth and explicit background/music presentation truth, dedicated dialogue-music playback now consumes authored cues, current shipped story background ids used by the zhuyuanzhang and liu-bang packs resolve preview images, and the landed event-owned playable completion parity fix keeps covered completion entrypoints on the formal settlement plus event-owned follow-up path. The lawful next step is queue closeout review rather than more ACC-FORMAT-004 implementation.`

#### `task.event-owned-routing-dialogue-playable-settlement-convergence.queue-closeout-review-and-sync-gate`

##### Control Block

- task_id: `task.event-owned-routing-dialogue-playable-settlement-convergence.queue-closeout-review-and-sync-gate`
- state: `done`
- task_kind: `queue-closeout`
- scope:
  - `docs/blueprints/queues/event-owned-routing-dialogue-playable-settlement-convergence-queue.md`
  - `docs/blueprints/plans/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target-plan.md`
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/change-log.md`
  - `src/application/**`
  - `src/ui/**`
  - `tests/**`
- must_inspect:
  - `Proof that ACC-FORMAT-004 is actually covered.`
  - `Whether any same-family residue remains inside event-owned routing, dialogue runtime truth, or playable-settlement convergence.`
  - `Repository-sync readiness after queue closeout proof.`
- must_modify:
  - `Queue closeout truth`
  - `Version-plan next routing truth`
  - `Project-progress active queue truth`
- must_preserve:
  - `Single-active-task governance`
  - `The current version boundary`
  - `Honest routing for later queues`
- done_when:
  - `Queue closeout proof is recorded honestly.`
  - `Repository-sync gate has been attempted and recorded truthfully.`
- verify_with:
  - `npm run build:test`
  - `node --test tests/robustness.test.cjs`
  - `npm run lint:blueprints`
  - `npm run lint:blueprint-skill`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record the blocker in queue/version truth before any stop decision.`
- promote_next_if_done: `none`
- human_input_required: `false`
- next_lawful_action_if_done: `return-to-version-review`
- next_lawful_action_if_blocked: `write-version-stop-truth-and-record-blocker`
- auto_promote_if_done: `false`
- stop_if:
  - `ACC-FORMAT-004 is not honestly covered.`

##### Human Context

- task_brief:
  - `Close out the event-owned routing queue after verified implementation and route the next lawful queue.`
- task_outcome_summary:
  - `Done locally. Closeout review now records sample-scenario bg.council_room as accepted fail-closed residue rather than queue-owned implementation debt, confirms the bounded verification floor, and returns the queue to version-level repository-sync handling before later-queue admission.`

### Progress Log

- `2026-07-27`: `queue.stage-host-binding-and-menu-resource-runtime-convergence is now closed honestly with accepted compatibility residue recorded and no active task remaining, so queue.event-owned-routing-dialogue-playable-settlement-convergence becomes the uniquely lawful next admission under the approved phase order.`
- `2026-07-27`: `Evidence-anchor reconcile completed during admission. ACC-FORMAT-004 is now locked against the remaining private continuation, dialogue runtime presentation, and playable-settlement handoff seams without widening into runtime-layout or final-acceptance ownership.`
- `2026-07-27`: `The queue auto-promotes task.event-owned-routing-dialogue-playable-settlement-convergence.event-owned-routing-and-runtime-chain-implementation as the live active task. The next lawful action is bounded ACC-FORMAT-004 implementation rather than queue closeout or later-queue admission.`
- `2026-07-27`: `The first ACC-FORMAT-004 implementation slice landed and was verified. At that point, dialogue-runner and story-runtime direct nextEvent recursion had been moved into the shared fail-closed event-continuation seam, but dialogue-choice-resolver had not yet been moved and runtime dialogue presentation consumption remained incomplete.`
- `2026-07-27`: `Governance truth is now reconciled with the already-landed second ACC-FORMAT-004 routing slice. dialogue-choice-resolver option nextEvent continuation now also routes through the shared fail-closed event-continuation seam, but the queue stays on the same live implementation task because runtime dialogue presentation consumption remains incomplete and playable-to-settlement/event-owned follow-up parity is still not yet proven.`
- `2026-07-27`: `Governance truth is now reconciled with the newly landed dialogue presentation slice. Runtime dialogue presentation now consumes dialogue-node portrait and side placement truth on the converged path, so portrait/side is no longer an open ACC-FORMAT-004 gap. Background/music presentation remains incomplete, playable-to-settlement/event-owned follow-up parity is still not yet proven, and the queue therefore stays on the same live implementation task with closeout/sync still pending.`
- `2026-07-27`: `Governance truth is now reconciled with the landed event-owned playable completion parity fix. Covered event-owned entrypoints now preserve formal playable-to-settlement handoff plus event-owned follow-up parity on the converged path, so that parity gap is no longer an open ACC-FORMAT-004 implementation item. The queue stays on the same live implementation task because runtime dialogue background/music presentation remains incomplete, and queue closeout, residue classification, and repository-sync are still pending.`
- `2026-07-27`: `Governance truth is now reconciled with the latest background/music presentation slice on top of the already-landed playable completion parity fix. Background/music dialogue nodes no longer fall through the generic transition placeholder and now render explicit authored presentation truth, while covered event-owned entrypoints still preserve formal playable-to-settlement handoff plus event-owned follow-up parity. ACC-FORMAT-004 nevertheless remains open on bounded same-task residue because authored story background ids still depend on unmapped preview resolution in the current location-background seam and dialogue music still lacks a dedicated playback consumer, so queue closeout, residue classification, and repository-sync remain out of scope.`
- `2026-07-27`: `Governance truth is now reconciled with the later ACC-FORMAT-004 presentation follow-up slice too. Dedicated dialogue-music playback is now wired through src/ui/dialogue-music.ts and main.ts, current shipped story background ids used by the zhuyuanzhang and liu-bang packs resolve preview images, and the queue therefore resumes task.event-owned-routing-dialogue-playable-settlement-convergence.queue-closeout-review-and-sync-gate rather than staying on implementation. The remaining honest gap is partial preview coverage for other authored background ids such as sample-scenario bg.council_room, which currently fail closed without a preview image and must be classified during closeout review before repository-sync.`
- `2026-07-27`: `Closeout review is now complete locally. The bounded ACC-FORMAT-004 verification set is green, sample-scenario bg.council_room is recorded as accepted fail-closed residue outside the current shipped preview map, no active implementation task remains in this queue, and the next lawful action is the version-level repository-sync gate before runtime-layout queue admission.`
