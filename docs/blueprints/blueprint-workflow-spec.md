# Blueprint Workflow Spec

## 1. Goal

This spec defines the repository's authoritative AI-first Blueprint workflow for long-running `mod-first` modularization work.

The workflow must let an AI agent determine:

- the current execution truth
- the legal next action
- what is in scope
- what is forbidden
- what may be promoted
- what may be closed

without re-deriving intent from long narrative history.

## 2. Scope

This spec applies to:

- `docs/blueprints/project-progress.md`
- `docs/blueprints/blueprint.md`
- `docs/blueprints/classification-rule-layer-spec.md`
- target specs under `docs/blueprints/specs/`
- target plans under `docs/blueprints/plans/`
- queue documents under `docs/blueprints/queues/`
- blueprint templates under `docs/blueprints/templates/`

This spec governs workflow documentation only.

It does not define runtime game behavior.

## 3. Supersession

This spec supersedes the older `docs/superpowers/**` workflow as the repository's execution model for new work.

Rules:

- old `docs/superpowers/**` documents remain as historical reference
- old weekly plans, weekly reviews, queued-child specs, and related governance docs are not the source of truth for new execution
- new planning and resume work must start from `docs/blueprints/**`
- new work must not open another weekly orchestration plan under `docs/superpowers/plans/`

## 4. Governance Model

The canonical execution chain is:

```text
project-progress -> blueprint -> target -> queue -> task -> execution artifacts
```

Execution artifacts may include:

- code changes
- tests
- docs
- change-log updates
- screenshots or diagrams where relevant

The repository may keep both target spec and target plan files, but both must obey one target semantic model:

- Target spec = version delivery boundary and acceptance contract
- Target plan = target-level sequencing governor

Neither file may contradict the active Target Control Block truth.

The repository may additionally expose a classification enhancement layer that routes new items before they are promoted into the chain above.

## 5. Control Block Rule

Every active governance artifact must expose two top-level sections:

- `## Control Block`
- `## Human Context`

The `Control Block` is authoritative for execution truth.

The `Human Context` explains rationale, history, tradeoffs, and narrative support.

If Human Context conflicts with Control Block state, the Control Block wins.

## 6. Core Roles

### 6.1 Project Progress

`docs/blueprints/project-progress.md`

Owns:

- repository-wide resume entry
- current blueprint pointer
- current target pointer
- current active queue pointer
- current active task pointer
- repository-wide decision state when no queue is active

Must not own:

- queue-local task breakdown
- queue-task implementation checklists

### 6.2 Blueprint

`docs/blueprints/blueprint.md`

Blueprint is the repository-wide execution index.

It owns:

- target list
- target order
- active target pointer
- active queue pointer
- active task pointer
- repository-wide execution mode

It must not own:

- queue-local task checklists
- file-by-file implementation steps
- per-item classification history beyond stable rule references

### 6.3 Target

Target is the version delivery unit.

It owns:

- delivery goal
- scope
- non-goals
- acceptance criteria
- queue membership
- queue class
- target closeout conditions

It must not own:

- queue-local implementation checklists
- per-task execution details
- repository-wide default classification rules

### 6.4 Queue

Queue is the execution decomposition unit.

It owns:

- bounded problem topic
- task ordering
- task dependency graph
- active task
- next executable task
- queue closeout conditions
- queue-local progress record

It must not own:

- repository-wide target choice
- version-level delivery definitions
- unrelated backlog items
- items whose classification is incompatible with queue scope

### 6.5 Task

Task is the smallest executable governance unit.

It owns:

- concrete bounded problem
- required inspection surface
- forbidden expansion areas
- verification commands
- done conditions
- blocker handling
- legal next step

## 7. Required Control Block Fields

### 7.1 Blueprint

Blueprint Control Blocks must expose:

- `blueprint_id`
- `status`
- `active_target`
- `active_queue`
- `active_task`
- `resume_order`
- `next_step`
- `execution_mode`
- `allow_parallel`
- `blocked_by`
- `classification_rules_ref`
- `classification_low_confidence_fallback`
- `candidate_targets`
- `completed_targets`

### 7.2 Target

Target Control Blocks must expose:

- `target_id`
- `version_label`
- `status`
- `active_phase`
- `active_queue`
- `required_queues`
- `conditional_queues`
- `optional_queues`
- `historical_queues`
- `blocked_by`
- `classification_overrides`
- `acceptance_gate`
- `promote_next_queue_when`
- `close_target_when`

### 7.3 Queue

Queue Control Blocks must expose:

- `queue_id`
- `belongs_to_target`
- `status`
- `queue_class`
- `active_task`
- `next_task`
- `allowed_task_states`
- `blocked_by`
- `allowed_item_classifications`
- `reject_item_classifications`
- `promotion_gate`
- `closeout_gate`
- `promote_next_queue_candidates`
- `must_not_expand_into`

### 7.4 Task

Task Control Blocks must expose:

- `task_id`
- `state`
- `task_type`
- `depends_on`
- `blocked_by`
- `priority`
- `scope`
- `must_inspect`
- `must_not_change`
- `done_when`
- `verify_with`
- `if_blocked`
- `promote_next_if_done`
- `drift_check_required`
- `drift_forbidden_expansions`
- `drift_escalate_to`
- `stop_if`

## 8. Classification Rule Layer

The classification rule layer is an additive routing layer on top of the AI-first Blueprint model.

Its purpose is to classify new work items before AI tries to place them into:

- current target work
- future target work
- queue candidate work
- content pipeline work
- asset pipeline work
- historical residue
- uncertain review

The classification layer does not replace Blueprint, Target, Queue, or Task semantics.

It reduces manual triage.

### 8.1 Classification Outputs

Every new item must be classified into exactly one of:

- `current-target-item`
- `future-target-candidate`
- `queue-candidate`
- `content-pipeline-item`
- `asset-pipeline-item`
- `uncertain-needs-review`
- `historical-residue`
- `out-of-scope`

### 8.2 Low-Confidence Rule

If AI classifies an item with `confidence = low`, the item must become:

- `uncertain-needs-review`

unless a stronger written rule explicitly allows automatic classification.

### 8.3 Classification Record

For each new item, AI should emit a structured classification record containing:

- `item_id`
- `item_type`
- `classify_as`
- `confidence`
- `matched_rules`
- `why`
- `escalate_if`
- `reject_if`

### 8.4 Escalation Rule

If an item is classified as:

- `queue-candidate`
- `future-target-candidate`
- `uncertain-needs-review`

AI must not automatically begin implementation.

Promotion and execution remain separate from classification.

### 8.5 Integration Points

- Blueprint should point to the authoritative classification rule file.
- Target may define target-specific classification overrides.
- Queue may define which classifications are allowed inside it.
- Task execution must stop if a new item is classified incompatibly with queue scope.

## 9. Status Model

The allowed states for queue tasks are:

- `candidate`
- `queued`
- `active`
- `blocked`
- `done`
- `dropped`

Rules:

- a task moves from `candidate` to `queued` only when governance wants it visible in the ordered queue
- a task moves from `queued` to `active` only after a baseline recheck
- a task moves from `active` to `done`, `blocked`, or `dropped`
- a `blocked` task must record the blocker in the owning queue
- a `dropped` task must record why it was removed instead of disappearing silently

## 10. No-Active-Queue Rule

The repository is allowed to have:

- one current target
- zero active queues
- zero active tasks

when governance is in a legal promotion-review state.

In that state:

- `active_queue` must be `none`
- `active_task` must be `none`
- the target plan must record the next promotion decision
- AI must not invent a placeholder queue or speculative task

## 11. Candidate Handling Rule

Candidates must be explicit machine-readable items.

Blueprint, Target, and Queue candidates must include:

- candidate id
- candidate class or type
- promote_when
- reject_when
- required_evidence

Narrative phrases such as:

- `later if needed`
- `probably next`
- `might be useful`
- `should be reviewed`
- `could continue here`

are insufficient by themselves.

## 12. Resume Workflow

The required resume path is:

1. open `docs/blueprints/project-progress.md`
2. read the `Control Block`
3. open `docs/blueprints/blueprint.md`
4. read the `Control Block`
5. open the current target spec and current target plan
6. if `active_queue != none`, open the active queue and then the active task
7. if `active_queue = none`, resume from the target plan's promotion decision

No execution may begin from prose-only sections.

When new work appears during resume or execution:

1. classify it through the classification rule layer
2. reject incompatible queue placement
3. only then decide whether the item belongs to current execution, queue promotion, pipeline routing, or review

## 13. Promotion Workflow

### 12.1 Task Promotion

A queued task may become active only when:

- dependencies are satisfied
- baseline recheck is complete
- the queue Control Block records the promotion
- no stronger blocker is present

### 12.2 Queue Promotion

A candidate queue may become active only when:

- the current active queue is closed or the target is explicitly in paused promotion review
- the target Control Block says promotion is legal
- promotion evidence is recorded
- the promoted queue has a valid Control Block
- the promoted queue has at least one executable task

### 12.3 Target Promotion

A future target may become active only when:

- the current target is closed or explicitly frozen
- the Blueprint Control Block records the switch
- the new target has explicit required queues
- the new target has acceptance criteria
- the new target has an active or promotable queue

## 14. Drift Detection And Stop Rule

Before execution, during execution, and before closeout, AI must check:

- is the current work still inside active task scope
- did the work touch any `must_not_change` surface
- did the work require a new queue topic
- did the work require a new target boundary
- did the work depend on unpromoted candidate work
- did the work change queue or target meaning without record
- did the work introduce items whose classification is incompatible with current queue scope

If any answer is yes:

- stop scope expansion immediately
- record a structured drift note
- mark the task `blocked` or `needs-scope-review`
- return control to governance review

AI must not silently continue after drift is detected.

## 15. Closeout Workflow

Closed queues must include a structured closeout decision block containing:

- `queue_id`
- `closeout_status`
- `verification_status`
- `residue_remaining`
- `residue_classification`
- `next_queue_recommendation`
- `promotion_justified`
- `evidence`

Targets should record target-level closeout truth once closeout becomes realistic.

Closed queues remain historical truth:

- do not silently reopen them
- do not rewrite them as if they had never closed
- if residue invalidates the old conclusion, open a new queue or record a new historical clarification

## 16. Remote Integration Rule

Remote integration is part of governance, not optional cleanup.

When a queue task batch, queue closeout, or target checkpoint reaches a coherent verified integration point, AI should emit a structured remote integration recommendation that includes:

- current branch
- whether push is required
- merge target = `mod-first-dev`
- integration reason
- verification evidence
- continuation action after merge

If AI continues to stack multiple verified local-only batches, it must explicitly record why integration is deferred.

## 17. Acceptance Rules

### 16.1 Queue Task Acceptance

A task may be marked `done` only when:

- required work is complete
- required verification has passed or is explicitly waived with reason
- no unresolved in-scope `P0` or `P1` remains
- the queue history records the closeout state

### 16.2 Target Acceptance

The current target may be marked `done` only when:

- all required queues for the current target period are complete or intentionally dropped
- no active queue task remains
- `project-progress.md` and `blueprint.md` agree on final closeout state
- the target acceptance criteria pass

## 18. Migration Rules

Migration into the AI-first model must follow this order:

1. preserve existing documents
2. freeze current execution truth
3. add Control Blocks
4. normalize role boundaries
5. preserve active or paused execution continuity
6. reclassify future work carefully
7. keep closed queues as historical records
8. move files only after semantics are stable

Unsafe actions include:

- rewriting active or paused execution truth mid-stream without recording why
- reopening closed queues silently
- forcing a new active queue when governance is legitimately paused
- bypassing classification rules and stuffing unclassified work directly into the current queue

## 19. Directory Layout

The Blueprint workflow owns this directory family:

```text
docs/blueprints/
  blueprint-workflow-spec.md
  project-progress.md
  blueprint.md
  classification-rule-layer-spec.md
  queues/
  specs/
  plans/
  templates/
```

Meaning:

- top level
  - repository resume, owner, and classification rule documents
- `specs/`
  - target boundaries across different periods
- `plans/`
  - target-level sequencing governors across different periods
- `queues/`
  - modularization execution decomposition units
- `templates/`
  - repository-approved workflow templates

## 20. Success Condition

The AI-first Blueprint refactor is successful only when:

- the current active target, queue, and task can be identified from Control Blocks alone
- the legal next action can be determined from Control Blocks alone
- queue promotion no longer depends on narrative-only interpretation
- most new items can be routed through classification rules without manual boundary triage
- closeout decisions produce structured residue classification
- human intervention is reduced to scope-setting and conflict resolution
- AI can safely resume after interruption without re-deriving intent from long prose history
