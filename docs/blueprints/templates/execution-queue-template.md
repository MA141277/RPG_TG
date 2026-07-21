# Execution Queue Template

## Control Block

- queue_id: `queue.replace-me`
- belongs_to_version: `target.replace-me`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2000-01-01`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `active | blocked | suspended | done | dropped`
- queue_class: `required`
- active_task: `task.replace-me.evidence-anchor-reconcile | none`
- next_task: `task.replace-me | none`
- closeout_status: `in-progress | done | blocked`
- execution_closeout_status: `done | partial | blocked`
- topic_closure_status: `closed | open-residue | blocked`
- closure_basis: `replace-with-structured-closeout-basis`
- residue_remaining: `yes | no`
- residue_family: `same-family | cross-family | accepted-residue | none`
- residue_routing_status: `auto-routable | needs-version-review | needs-human-decision | none`
- next_family_candidate: `queue.replace-me-next | item.replace-me-next | none`
- auto_continue_eligible: `true | false`
- next_effect: `promote-next-queue | return-to-version-review | block-version | none`
- sync_status: `pending | success | failed`
- sync_scope: `local-record | branch-commit | branch-push | baseline-merge | baseline-push | remote-sync | none`
- sync_summary: `Replace with the latest repository sync result.`
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
  - `Replace with the bounded queue goal.`
- Parent spec:
  - `docs/blueprints/specs/... or docs/blueprints/version-memo.md#memo-...`
- Parent requirement role:
  - `This queue implements one bounded slice of the parent spec. The parent spec remains the total requirement contract.`
- Forbidden expansions:
  - `Replace with out-of-scope area 1.`
  - `Replace with out-of-scope area 2.`

### Parent Spec Inheritance

- inherited_required_capabilities:
  - `Replace with parent-spec capability this queue must preserve or implement.`
- inherited_compatibility_paths:
  - `Replace with compatibility path from parent spec that this queue must preserve.`
- inherited_legacy_replacements:
  - `Replace with old field, behavior, or mechanism from parent spec that this queue owns replacing.`
- inherited_non_goals:
  - `Replace with explicit parent-spec non-goal this queue must not violate.`
- parent_spec_change_policy:
  - `If implementation proves the parent spec must change, update the parent spec first, then reconcile every affected candidate queue and evidence matrix entry before treating any capability as removed, retired, or unsupported.`

### Evidence Lock

- evidence_lock_status: `pending | locked | blocked`
- implementation_anchor_status: `confirmed | missing | conflicting`
- prerequisite_status: `ready | needs-prior-queue | split-required`
- acceptance_claim_scope:
  - `ACC-REPLACE-001`
- acceptance_not_claimed:
  - `ACC-REPLACE-002`
- minimum_verification:
  - `Replace with command or proof required before implementation/closeout.`

### Claim Boundary

#### Can Claim

- `ACC-REPLACE-001: Replace with the acceptance this queue may close.`

#### Cannot Claim

- `ACC-REPLACE-002: Replace with related acceptance that remains outside this queue.`
- `Out-of-scope means not implemented by this queue; it does not mean retired, removed, or unsupported unless the parent spec was updated first.`

#### Capability Floor

- `Replace with inherited or adjacent functional surface that must still work after this queue closes, even if this queue is not the primary owner of that acceptance.`

#### Parent Capability Coverage

- owned_closure:
  - `Replace with the parent capability this queue actually closes.`
- preserved_not_owned:
  - `Replace with inherited capability this queue must not regress even though another queue owns final closure.`
- routed_elsewhere:
  - `Replace with parent capability intentionally routed to another queue, residue path, blocker, or explicit waiver.`

#### Over-Narrowing Guard

- parent_capabilities_not_owned_by_this_queue:
  - `Replace with inherited parent capability that remains owned by another queue or successor candidate.`
- forbidden_scope_shrinkage:
  - `Do not delete or declare unsupported any inherited capability merely because it is outside this queue.`
- unspecified_detail_policy:
  - `Fill unspecified implementation details as much as the parent spec reasonably allows, without drifting beyond, contradicting, or running sideways from the parent spec.`
- gap_routing_policy:
  - `If a required inherited capability cannot be completed here, record it as residue, prerequisite, blocker, or successor candidate rather than erasing it from the total spec.`

#### Legacy Paths To Replace

- `Replace with old field, file, behavior, or mechanism this queue owns replacing.`

#### Compatibility Paths To Preserve

- `Replace with compatibility behavior or path that must remain valid.`

#### User Path Coverage Matrix

- primary_paths:
  - `Replace with the main user-visible path this queue must keep working.`
- alternate_paths:
  - `Replace with import / preview / alternate entry / recovery path that must not regress.`
- leave_return_or_followup_paths:
  - `Replace with leave / return / follow-up / chained-routing path that must remain reachable.`
- empty_or_fail_closed_paths:
  - `Replace with empty-data / blocked / fail-closed path that must remain coherent.`
- rejection_or_error_paths:
  - `Replace with refusal / rejection / error-handling path that must remain truthful and reachable.`
- forbidden_regressions:
  - `Replace with a regression that this queue must explicitly avoid even if the primary path still works.`

#### Functional Loss Budget

- budget: `zero | explicit-waiver-only`
- loss_accounting_rule:
  - `Replace with how any lost functionality must be routed as residue, blocker, or explicit waiver rather than silently accepted.`

#### Implementation Anchors

- Must inspect:
  - `src/or/tests/path`
- Must modify:
  - `src/or/tests/path`
- Must preserve:
  - `src/or/tests/path-or-behavior`

#### Verification Coverage

- `Replace with proof or test that demonstrates the claimed acceptance.`

#### Replacement Proof

- previous_owner_or_path:
  - `Replace with the old owner/path if this queue migrates or replaces behavior.`
- new_owner_or_path:
  - `Replace with the new owner/path.`
- behavior_preservation_expectation:
  - `Replace with what must remain equivalent or intentionally different.`
- old_truth_owner_exit_proof:
  - `Replace with proof that the old owner/path is no longer the required truth unless dual ownership is explicitly preserved by the parent spec.`
- verification_evidence:
  - `Replace with proof that the replacement path is actually wired and reachable.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/...`
- Version plan:
  - `docs/blueprints/plans/...`

### Queue Snapshot

- queue_goal: `Replace with the bounded queue goal in one sentence.`
- task_count: `2`
- completed_task_count: `0`
- remaining_task_count: `2`
- active_task_summary: `Confirm evidence lock, implementation anchors, claim boundary, and minimum verification before feature implementation.`
- task_briefs:
  - `task.replace-me.evidence-anchor-reconcile: Confirm evidence lock before implementation.`
  - `task.replace-me: Replace with a one-line task brief.`

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
- `topic_closure_status = blocked means topic closure is impossible until a recorded blocker is resolved.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`
- `residue_family = accepted-residue means the remaining gap is explicitly accepted within the parent/version boundary and does not block closeout.`
- `Out-of-scope, Cannot Claim, and accepted residue are not retirement authority. Do not write retired/removed/unsupported unless the parent spec was updated first.`
- `If residue_family = same-family and one lawful continuation exists, name it in next_family_candidate and allow automatic continuation instead of returning to open-ended human queue selection.`
- `Active-task completion, queue closeout sync, active queue handoff, and state-only sync are execution transitions, not lawful pause points by themselves.`

### Completion Completeness Review

- review_status: `pending | passed | gap-fill-used | residue-recorded | blocked`
- can_claim_coverage:
  - `Replace with evidence that each Can Claim item is implemented and verified.`
- parent_spec_preservation:
  - `Replace with evidence that inherited capabilities, compatibility paths, legacy replacements, and non-goals were not over-narrowed.`
- capability_floor_verification:
  - `Replace with proof that non-owned-but-required inherited capability still works after this queue's change.`
- out_of_scope_routing:
  - `Replace with where every Cannot Claim / Out Of Scope item is owned, routed, accepted, or blocked.`
- verification_sufficiency:
  - `Replace with why verification covers functional behavior rather than only a representative happy path.`
- user_path_matrix_verification:
  - `Replace with proof that the primary, alternate, recovery, and fail-closed paths in the matrix were actually checked or intentionally routed.`
- functional_loss_audit:
  - `Replace with evidence that no user-visible functionality was lost, reduced to placeholder behavior, or left reachable only through legacy fallback.`
- replacement_proof_summary:
  - `Replace with a short summary of how migration/replacement claims were verified.`
- placeholder_or_legacy_fallback_audit:
  - `Replace with evidence that claimed behavior did not survive only through placeholder UI, dead routes, or legacy fallback truth.`
- gap_fill_decision:
  - `not-needed | used-once | not-used-recorded-as-residue | blocked`
- gap_fill_scope:
  - `If used-once, name the high-priority missing items repaired in the single permitted gap-fill pass.`
- remaining_gaps:
  - `If any remain, route each to same-family residue, cross-family residue, accepted residue, blocker, or successor candidate.`

### Admission Preconditions

- `This queue must not be created or treated as implementation authority until the version plan already records admission review truth.`
- `This queue must not expose queue_status=active or a live active_task before the version plan admission fields are synchronized.`
- `If this queue is admitted from a fresh queue-candidate, the version plan admission fields must be synchronized before any queue activation or code implementation starts.`
- `User scope approval alone must not be treated as queue admission.`
- `Candidate tracking belongs in the version plan; this queue doc is for admitted queue truth only.`

### Explicit Operator-Directed Closure Or Suspension

- `If the operator explicitly requests suspending this queue, set queue_status=suspended, remove live active_task execution, and synchronize the owning version plan in the same batch.`
- `If the operator explicitly requests closing this queue before Can Claim is actually satisfied, set queue_status=dropped rather than done and route remaining residue explicitly.`
- `Do not fabricate completed_acceptance, closure_basis, or topic_closure_status=closed merely because the operator asked to stop work.`

### Auto-Continue Stop Rule

- `Before ending a response while this queue still has a live active_task or while queue closeout has a uniquely lawful next action, run the workflow stop-condition self-check from the Blueprint workflow spec.`
- `If no lawful stop cause exists, do not stop at task completion, queue closeout sync, queue handoff, repository sync result recording, or status commentary; continue into the next lawful task or version-level action.`
- `If a lawful stop cause exists, the owning version plan must already contain stop_reason / stop_basis / next_unblocked_action / human_input_required before the response ends.`

### Queue Spec Integrity Rule

- `A queue spec is invalid if it can only pass by shrinking parent capability meaning down to one local seam, one golden path, or one convenient happy path.`
- `Admission must stop if Parent Capability Coverage, User Path Coverage Matrix, Functional Loss Budget, Replacement Proof, or Completion Completeness Review is missing or too vague to police over-narrowing.`
- `Queue closeout must fail if the queue cannot show that inherited non-owned capability, alternate paths, or replacement-truth exit were preserved or explicitly routed.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, record local repository sync state.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Default Blueprint governance/documentation refinement uses local-record during execution, one branch-commit at queue closeout, then attempted remote-sync toward mod-first-dev.`
- `Every completed execution queue should produce one local commit with a typed subject and Summary body before later Blueprint scheduling continues.`
- `Every completed execution queue should then attempt remote-sync toward mod-first-dev; if that remote-sync fails, record the failure and continue from written governance truth.`
- `Push and merge are remote-sync actions; once either starts, wait for its success or failure result before continuing queue activation, promotion review, or version scheduling.`
- `Once push starts, wait for its success or failure result before continuing queue activation, promotion review, or version scheduling.`
- `A blocked queue still allows local-record, branch-commit, and remote-sync; repository sync is not forbidden just because execution is blocked.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`
- `remote-sync failure must not block queue closeout, version review handoff, same-family continuation routing, or next lawful queue activation after the failure result is recorded.`
- `Recording the sync result is not a lawful pause point by itself.`

### Activation Order

1. `Version plan review subject and basis are written first.`
2. `Version-level admission review concludes before this queue becomes live execution truth.`
3. `This queue doc is created and synchronized as the queue-level governor.`
4. `Only then may active_task be exposed and implementation begin.`

### Recovery Rule

- `Do not recreate or reactivate this queue from scratch if the version plan already records its prior admission basis.`
- `Resume from the version-plan admission record unless new material evidence invalidates that prior basis.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.replace-me.evidence-anchor-reconcile` | `active` | `Confirm evidence lock, implementation anchors, claim boundary, and minimum verification before feature implementation.` | `none` | `This task may block or split the queue if anchors are missing or conflicting.` |
| `task.replace-me` | `queued` | `Replace with task summary.` | `task.replace-me.evidence-anchor-reconcile` | `Replace with task note.` |

### Task Definitions

#### `task.replace-me.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.replace-me.evidence-anchor-reconcile`
- state: `active`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/specs/...`
  - `docs/blueprints/plans/...`
  - `src/or/tests/path`
- must_inspect:
  - `version acceptance matrix`
  - `candidate evidence matrix`
  - `implementation anchors`
- must_not_change:
  - `Do not implement feature code before evidence_lock_status is locked.`
  - `Do not widen queue scope to close acceptance outside Can Claim.`
- done_when:
  - `Evidence Lock is locked or the queue is blocked with a concrete reason.`
  - `Can Claim and Cannot Claim list acceptance ids from the version acceptance matrix.`
  - `Must inspect, must modify, must replace, must preserve, and minimum verification are recorded.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Return to version review or split a prerequisite queue.`
- promote_next_if_done: `task.replace-me`
- stop_if:
  - `implementation_anchor_status is missing or conflicting`
  - `prerequisite_status is needs-prior-queue or split-required`

##### Human Context

- task_brief:
  - `Lock the queue evidence before implementation.`
- task_outcome_summary:
  - `Replace with evidence-lock result after completion.`
- Purpose:
  - `Prevent queue execution from drifting away from version acceptance and implementation anchors.`
- Failure mode:
  - `The queue starts implementing from its title rather than from acceptance ownership and source evidence.`

#### `task.replace-me`

##### Control Block

- task_id: `task.replace-me`
- state: `active`
- task_kind: `execution | decision-dispatch`
- scope:
  - `path/or/module/a`
  - `path/or/module/b`
- must_inspect:
  - `file-a`
  - `file-b`
- must_modify:
  - `file-a`
- must_replace:
  - `legacy field or behavior`
- must_preserve:
  - `compatibility path or behavior`
- must_not_change:
  - `Replace with forbidden change 1.`
  - `Replace with forbidden change 2.`
- done_when:
  - `Replace with done condition 1.`
  - `Replace with done condition 2.`
- verify_with:
  - `command-a`
  - `command-b`
- if_blocked:
  - `Record execution blockers in the queue doc, not repository sync failures.`
  - `Do not silently widen scope.`
- promote_next_if_done: `task.replace-me-next`
- stop_if:
  - `condition-a`
  - `condition-b`

##### Human Context

- task_brief:
  - `Replace with the one-sentence task responsibility.`
- task_outcome_summary:
  - `Replace with the expected or current task outcome in one sentence.`
- Purpose:
  - `Replace with the task purpose.`
- Failure mode:
  - `Replace with the main failure risk.`

##### Decision-Dispatch Notes

- `If task_kind=decision-dispatch, this task must summarize current queue progress and provide one concise recommendation.`
- `Default operator output should stay concise and should not dump candidate-set analysis, why-not-the-others detail, or other Blueprint internal reasoning unless the operator explicitly asks for it.`

### Historical Handoff Note

- Task ID:
  - `none`
- Recorded handoff at closure:
  - `Replace with the version-level handoff written at queue closeout.`
- Recorded expected output:
  - `Replace with the closed-queue outcome.`

### Historical Candidate Notes

- `task.replace-me-later`
  - State:
    - `candidate`
  - Reason:
    - `Replace with why this remains historical candidate residue only.`

### Historical Snapshot (2000-01-01)

- `Replace with queue history only when needed.`
- `When queue_status becomes done, convert any live-style closeout labels into historical labels such as Historical Handoff Note and Historical Candidate Notes.`
