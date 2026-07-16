# Execution Queue Template

## Control Block

- queue_id: `queue.replace-me`
- belongs_to_version: `target.replace-me`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2000-01-01`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `active | blocked | done | dropped`
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
- Forbidden expansions:
  - `Replace with out-of-scope area 1.`
  - `Replace with out-of-scope area 2.`

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

#### Legacy Paths To Replace

- `Replace with old field, file, behavior, or mechanism this queue owns replacing.`

#### Compatibility Paths To Preserve

- `Replace with compatibility behavior or path that must remain valid.`

#### Implementation Anchors

- Must inspect:
  - `src/or/tests/path`
- Must modify:
  - `src/or/tests/path`
- Must preserve:
  - `src/or/tests/path-or-behavior`

#### Verification Coverage

- `Replace with proof or test that demonstrates the claimed acceptance.`

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
- `topic_closure_status = closed is legal only when no still-blocking same-family residue remains inside the queue's bounded topic surface.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`
- `If residue_family = same-family and one lawful continuation exists, name it in next_family_candidate and allow automatic continuation instead of returning to open-ended human queue selection.`

### Admission Preconditions

- `This queue must not be created or treated as implementation authority until the version plan already records admission review truth.`
- `This queue must not expose queue_status=active or a live active_task before the version plan admission fields are synchronized.`
- `If this queue is admitted from a fresh queue-candidate, the version plan admission fields must be synchronized before any queue activation or code implementation starts.`
- `User scope approval alone must not be treated as queue admission.`
- `Candidate tracking belongs in the version plan; this queue doc is for admitted queue truth only.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, record local repository sync state.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Default Blueprint governance/documentation refinement uses local-record during execution and one branch-commit at queue closeout.`
- `Every completed execution queue should produce one local commit with a typed subject and Summary body before later Blueprint scheduling continues.`
- `Push is optional per queue and may be batched after multiple queue commits.`
- `Push and baseline merge are remote-sync actions; run them only when requested, when collaboration requires remote visibility, or when a queue/version closeout contract explicitly requires them.`
- `Once push starts, wait for its success or failure result before continuing queue activation, promotion review, or version scheduling.`
- `A blocked queue still allows local-record, branch-commit, and remote-sync; repository sync is not forbidden just because execution is blocked.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`
- `remote-sync failure must not block queue closeout, version review handoff, same-family continuation routing, or next lawful queue activation after the failure result is recorded.`

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
