# Script Editor Event-Centered Authoring Model Unification Queue

## Control Block

- queue_id: `queue.script-editor-event-centered-authoring-model-unification`
- belongs_to_version: `target.script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-22`
- governance_sync_source: `docs/blueprints/plans/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target-plan.md`
- queue_status: `active`
- queue_class: `required`
- active_task: `task.script-editor-event-centered-authoring-model-unification.evidence-anchor-reconcile`
- next_task: `task.script-editor-event-centered-authoring-model-unification.model-contract-and-authoring-surface`
- closeout_status: `in-progress`
- execution_closeout_status: `partial`
- topic_closure_status: `open-residue`
- closure_basis: `admitted-first-queue-not-yet-closed`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `none`
- sync_status: `pending`
- sync_scope: `local-record`
- sync_summary: `Queue admission was recorded after remote sync toward origin/mod-first-dev succeeded at the version layer. Queue-local closeout sync is pending because execution has just started.`
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
  - `Unify Script Editor creator-facing content ownership and destination semantics so dialogue / function / minigame / task are authored through one event-centered model without scene wrappers or family-local routing truth.`
- Parent spec:
  - `docs/blueprints/specs/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target.md`
- Parent requirement role:
  - `This queue owns the first bounded implementation slice of MEMO-025 and closes only ACC-EVENT-CENTER-001. The parent spec remains the total requirement contract for later trigger freeze, scene retirement, runtime convergence, portrait resources, and final acceptance.`
- Forbidden expansions:
  - `Do not retire scene runtime or export truth in this queue.`
  - `Do not freeze trigger timing or trigger-context contracts in this queue.`
  - `Do not route portrait resources into this queue as hidden secondary scope.`
  - `Do not weaken building creator-facing meaning function -> event -> dialogue/minigame/task/function.`

### Parent Spec Inheritance

- inherited_required_capabilities:
  - `Creator-facing semantics must become event-centered across dialogue / function / minigame / task.`
  - `Building creator-facing meaning must remain function -> event -> dialogue/minigame/task/function.`
  - `Implementation-facing seams may still travel through arrangement / event-binding / flow / playable.`
  - `Normal start, JSON runtime pack import, and Script Editor runtime preview must remain routeable toward one later converged model.`
- inherited_compatibility_paths:
  - `Existing arrangement / event-binding / flow / playable implementation seams remain valid while creator-facing semantics are unified.`
  - `Current authored ids for events, dialogues, functions, tasks, and minigames must remain stable unless the parent spec is updated first.`
- inherited_legacy_replacements:
  - `Creator-facing scene wrappers as the semantic owner of follow-up content selection.`
  - `Family-local destination semantics that bypass event as the future formal router.`
- inherited_non_goals:
  - `Do not keep scene as hidden compatibility truth by merely relabeling tabs.`
  - `Do not introduce hardcoded building business routing in runtime modules.`
  - `Do not split portrait resource convergence into this queue.`
- parent_spec_change_policy:
  - `If implementation proves the parent spec must change, update the parent spec first, then reconcile every affected child queue and acceptance entry before treating any capability as removed, retired, or unsupported.`

### Evidence Lock

- evidence_lock_status: `pending`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-EVENT-CENTER-001`
- acceptance_not_claimed:
  - `ACC-EVENT-CENTER-002`
  - `ACC-EVENT-CENTER-003`
  - `ACC-EVENT-CENTER-004`
  - `ACC-EVENT-CENTER-005`
  - `ACC-EVENT-CENTER-006`
  - `ACC-EVENT-CENTER-007`
  - `ACC-EVENT-CENTER-008`
- minimum_verification:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm test`

### Claim Boundary

#### Can Claim

- `ACC-EVENT-CENTER-001: Script Editor creator-facing semantics unify dialogue / function / minigame / task under event-centered authoring with clear destination-family ownership and no scene-wrapper requirement.`

#### Cannot Claim

- `ACC-EVENT-CENTER-002: event-only routing truth and trigger timing/context freeze.`
- `ACC-EVENT-CENTER-003: formal scene family retirement from authoring/project/runtime/startup/presenter truth.`
- `ACC-EVENT-CENTER-004: building-function meaning preservation proof after later scene migration.`
- `ACC-EVENT-CENTER-005: runtime pack / loader / preview / export convergence on the no-scene model.`
- `ACC-EVENT-CENTER-006: portrait resource authoring and resource mapping convergence.`
- `ACC-EVENT-CENTER-008: final simulated-human acceptance across trigger environments and portrait creator path.`
- `Out-of-scope means not implemented by this queue; it does not mean retired, removed, or unsupported unless the parent spec was updated first.`

#### Capability Floor

- `This queue must leave the project with one clearer creator-facing event-centered model, without silently preserving scene wrappers or weakening building function meaning.`

#### Over-Narrowing Guard

- parent_capabilities_not_owned_by_this_queue:
  - `Event-only routing truth remains owned by queue.event-router-only-trigger-contract-freeze.`
  - `Scene retirement and content migration remain owned by queue.scene-family-retirement-and-content-migration.`
  - `Portrait resource convergence remains owned by queue.portrait-resource-authoring-and-resource-mapping-convergence.`
- forbidden_scope_shrinkage:
  - `Do not pass this queue by renaming labels while creators still author through scene-shaped wrappers or indirect family-local routing semantics.`
  - `Do not claim success if destination-family ownership remains ambiguous between dialogue/function/minigame/task and event.`
  - `Do not reduce building creator-facing meaning to a generic action bucket that hides function -> event -> dialogue/minigame/task/function.`
- unspecified_detail_policy:
  - `Prefer explicit destination-family contracts, creator-facing model ownership, and stable id-based references that later queues can freeze and migrate without reinterpretation.`
- gap_routing_policy:
  - `If a required creator-facing capability cannot be completed here, record it as same-family residue, blocker, or prerequisite rather than pushing hidden scope into later queues without governance truth.`

#### Legacy Paths To Replace

- `Scene-shaped creator-facing destination wrappers.`
- `Family-local direct follow-up ownership that prevents event-centered authoring semantics from being the main creator model.`

#### Compatibility Paths To Preserve

- `arrangement -> event-binding -> flow / playable implementation seams remain legal.`
- `Existing event, dialogue, function, task, and minigame ids remain stable across authoring state.`

#### User Path Coverage Matrix

- primary_paths:
  - `Script Editor creators can understand and author destination ownership through one event-centered model instead of scene wrappers.`
- alternate_paths:
  - `Building creator-facing flows still read as function -> event -> dialogue/minigame/task/function even before later runtime migration queues land.`
- empty_or_fail_closed_paths:
  - `Incomplete or unsupported destination-family combinations fail closed in authoring rather than falling back to hidden scene wrappers.`
- forbidden_regressions:
  - `Do not keep event-centered naming while runtime/export-facing authoring still depends on scene-local wrapper truth.`

#### Functional Loss Budget

- budget: `zero`
- loss_accounting_rule:
  - `Any lost creator-facing capability must be fixed or routed as residue, blocker, or explicit waiver. It cannot be erased by calling scene retirement or portrait work out-of-scope for this queue.`

#### Implementation Anchors

- Must inspect:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/**`
  - `src/ui/main-ui/main-ui-flow.js`
  - `docs/blueprints/specs/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target.md`
  - `tests/**`
- Must modify:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/**`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/**`
  - `docs/change-log.md`
- Must preserve:
  - `No hidden scene-wrapper ownership as creator-facing truth.`
  - `No building business hardcoding in src/main.ts.`
  - `No drift away from arrangement / event-binding / flow / playable as allowed implementation path.`

#### Verification Coverage

- `Authoring-model tests, UI/source review, and end-to-end regression coverage must prove that creator-facing destination ownership is unified without over-narrowing later queues.`

#### Replacement Proof

- previous_owner_or_path:
  - `Scene-shaped or family-local creator-facing destination ownership.`
- new_owner_or_path:
  - `Event-centered creator-facing content model with explicit destination-family ownership.`
- behavior_preservation_expectation:
  - `Creators gain a clearer single routing model while existing building-function meaning and stable content ids are preserved.`
- verification_evidence:
  - `Tests and source inspection must show the new model is the formal creator-facing owner rather than documentation-only relabeling.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target-plan.md`

### Queue Snapshot

- queue_goal: `Admit and execute the first MEMO-025 slice that unifies creator-facing dialogue / function / minigame / task semantics under one event-centered model.`
- task_count: `3`
- completed_task_count: `0`
- remaining_task_count: `3`
- active_task_summary: `Confirm evidence lock, creator-facing contract boundaries, implementation anchors, and verification floor before implementation.` 
- task_briefs:
  - `task.script-editor-event-centered-authoring-model-unification.evidence-anchor-reconcile: Confirm ACC-EVENT-CENTER-001 evidence lock and no-over-narrowing boundaries before implementation.`
  - `task.script-editor-event-centered-authoring-model-unification.model-contract-and-authoring-surface: Land the event-centered creator-facing model and destination-family ownership in authoring surfaces.`
  - `task.script-editor-event-centered-authoring-model-unification.queue-closeout-and-handoff: Verify, review completeness, and route the next lawful queue without claiming later acceptances.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 当前执行队列 from queue_id.`
- `The fixed operator receipt must source 当前任务 from active_task.`
- `The fixed operator receipt must source 当前队列目标 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded execution slice landed and verified.`
- `execution_closeout_status = partial means some admitted queue work landed, but part of Can Claim remains unimplemented or unverified and must route to residue, blocker, or successor queue.`
- `execution_closeout_status = blocked means execution cannot continue without resolving a concrete blocker recorded in blocked_by.`
- `topic_closure_status = closed is legal only when no still-blocking same-family residue remains inside the queue's bounded topic surface.`
- `topic_closure_status = open-residue means the bounded execution may be done or partial, but remaining capability must be routed before version closeout.`
- `Out-of-scope, Cannot Claim, and accepted residue are not retirement authority.`

### Completion Completeness Review

- review_status: `pending`
- can_claim_coverage:
  - `Pending execution. ACC-EVENT-CENTER-001 is not yet verified.`
- parent_spec_preservation:
  - `Pending execution. The queue must prove it did not weaken building meaning, later trigger-freeze ownership, or later scene-retirement obligations.`
- out_of_scope_routing:
  - `Later acceptances remain owned by the next recorded queues in the version plan.`
- verification_sufficiency:
  - `Pending execution. Verification must prove creator-facing ownership changed in real authoring surfaces, not only in docs or type definitions.`
- functional_loss_audit:
  - `Pending execution. No creator-facing destination capability may be lost or silently reduced to placeholders.`
- replacement_proof_summary:
  - `Pending execution.`
- gap_fill_decision:
  - `not-needed`
- gap_fill_scope:
  - `none`
- remaining_gaps:
  - `Pending execution.`

### Admission Preconditions

- `This queue was admitted only after the version plan switched to active_queue=queue.script-editor-event-centered-authoring-model-unification and project-progress entry pointers switched to this queue doc.`
- `Implementation must not start outside this queue's admitted scope.`
- `Candidate tracking remains in the version plan; this queue doc is the queue-level execution governor.`

### Explicit Operator-Directed Closure Or Suspension

- `If the operator explicitly requests suspending this queue, set queue_status=suspended, remove live active_task execution, and synchronize the owning version plan in the same batch.`
- `If the operator explicitly requests closing this queue before Can Claim is actually satisfied, set queue_status=dropped rather than done and route remaining residue explicitly.`
- `Do not fabricate completed acceptance or topic_closure_status=closed merely because the operator asked to stop work.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, record local repository sync state.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Default Blueprint governance/documentation refinement uses local-record during execution, one branch-commit at queue closeout, then attempted remote-sync toward mod-first-dev.`
- `Every completed execution queue should produce one local commit with a typed subject and Summary body before later Blueprint scheduling continues.`
- `Push and merge are remote-sync actions; once either starts, wait for its success or failure result before continuing queue activation, promotion review, or version scheduling.`

### Activation Order

1. `Version plan admission review concludes before this queue becomes live execution truth.`
2. `This queue doc is created and synchronized as the queue-level governor.`
3. `Only then may active_task be exposed and implementation begin.`

### Recovery Rule

- `Do not recreate or reactivate this queue from scratch if the version plan already records its admission basis.`
- `Resume from the version-plan admission record unless new material evidence invalidates that prior basis.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-event-centered-authoring-model-unification.evidence-anchor-reconcile` | `active` | `Confirm ACC-EVENT-CENTER-001 evidence lock, creator-facing contract boundaries, implementation anchors, and verification floor before implementation.` | `none` | `This task may still split or block the queue if the current model or anchors prove wider than the admitted boundary.` |
| `task.script-editor-event-centered-authoring-model-unification.model-contract-and-authoring-surface` | `queued` | `Land the event-centered creator-facing model and destination-family ownership in authoring surfaces.` | `task.script-editor-event-centered-authoring-model-unification.evidence-anchor-reconcile` | `This task must stay inside ACC-EVENT-CENTER-001 and must not absorb later router-freeze or scene-retirement work.` |
| `task.script-editor-event-centered-authoring-model-unification.queue-closeout-and-handoff` | `queued` | `Verify, review completeness, and route the next lawful queue without claiming later acceptances.` | `task.script-editor-event-centered-authoring-model-unification.model-contract-and-authoring-surface` | `Expected next lawful queue is queue.event-router-only-trigger-contract-freeze if no blocker or residue changes that routing.` |

### Task Definitions

#### `task.script-editor-event-centered-authoring-model-unification.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.script-editor-event-centered-authoring-model-unification.evidence-anchor-reconcile`
- state: `active`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/specs/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target.md`
  - `docs/blueprints/plans/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target-plan.md`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/**`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/**`
- must_inspect:
  - `Current creator-facing dialogue / function / minigame / task ownership and selector semantics.`
  - `Any remaining scene-wrapper expectations in Script Editor authoring surfaces.`
  - `Current destination-family contracts and id ownership.`
  - `Building creator-facing meaning boundaries that later queues must preserve.`
- must_not_change:
  - `Do not implement scene retirement or runtime-pack cutover during evidence-anchor reconcile.`
  - `Do not widen this queue into portrait-resource ownership.`
- done_when:
  - `Evidence lock is recorded with confirmed implementation anchors and no-over-narrowing boundaries.`
  - `The queue records exactly what counts as ACC-EVENT-CENTER-001 completion and what remains routed to later queues.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Return to version review or route a lawful split/blocker.`
- promote_next_if_done: `task.script-editor-event-centered-authoring-model-unification.model-contract-and-authoring-surface`

##### Human Context

- task_brief:
  - `Lock the first queue's creator-facing scope before implementation.`
- task_outcome_summary:
  - `Pending.`

#### `task.script-editor-event-centered-authoring-model-unification.model-contract-and-authoring-surface`

##### Control Block

- task_id: `task.script-editor-event-centered-authoring-model-unification.model-contract-and-authoring-surface`
- state: `queued`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/**`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/**`
- must_inspect:
  - `Evidence-anchor reconcile outcome.`
  - `Current creator-facing authoring UI and destination selectors.`
- must_modify:
  - `Authoring model, destination-family, and selector files proven necessary by evidence lock.`
  - `tests/**`
- must_preserve:
  - `Stable ids for existing authored content where still canonical.`
  - `Building creator-facing meaning and allowed arrangement / event-binding / flow / playable implementation seams.`
- verify_with:
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- promote_next_if_done: `task.script-editor-event-centered-authoring-model-unification.queue-closeout-and-handoff`

##### Human Context

- task_brief:
  - `Land the event-centered creator-facing model and destination-family ownership in authoring surfaces.`
- task_outcome_summary:
  - `Pending.`

#### `task.script-editor-event-centered-authoring-model-unification.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-event-centered-authoring-model-unification.queue-closeout-and-handoff`
- state: `queued`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/plans/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target-plan.md`
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/queues/script-editor-event-centered-authoring-model-unification-queue.md`
  - `tests/**`
- must_inspect:
  - `Implementation proof and claim boundary coverage.`
  - `Whether any same-family residue remains inside ACC-EVENT-CENTER-001.`
- must_preserve:
  - `Later queues remain fully owned and not prematurely claimed closed.`
- done_when:
  - `Verification passes or is honestly blocked.`
  - `Completeness review proves ACC-EVENT-CENTER-001 closed without over-narrowing later queues.`
  - `The next lawful queue routing is written back to the version plan.`
- verify_with:
  - `npm run lint:blueprints`

##### Human Context

- task_brief:
  - `Verify, review completeness, and hand off to the next lawful queue.`
- task_outcome_summary:
  - `Pending.`

### Progress Log

- `2026-07-22`: `Queue admitted as the first lawful execution slice under target.script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor after remote sync toward origin/mod-first-dev succeeded and no-over-narrowing review confirmed that later trigger freeze, scene retirement, runtime cutover, and portrait convergence all depend on stable creator-facing event-centered semantics. Active execution begins with evidence-anchor reconciliation rather than direct feature implementation.`
