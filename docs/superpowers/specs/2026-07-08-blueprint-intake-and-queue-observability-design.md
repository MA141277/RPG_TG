# Blueprint Intake And Queue Observability Design

**Goal:** Make Blueprint intake, candidate routing, and queue progress visibility internal workflow obligations so human operators can describe problems plainly while Blueprint truth continues to stay structured, single-writer, and resumable.

## Why This Design Exists

The current Blueprint model already enforces a strong truth chain:

`project-progress -> blueprint -> target plan -> active queue -> active task`

That chain protects execution truth, but it still leaves two operator-facing gaps:

1. Human input is too governance-shaped.
   - Operators often need to reason about item ids, classification, candidate records, admission fields, and queue creation order before Blueprint can continue.
   - This makes ordinary problem statements feel like governance work instead of work intake.
2. Queue progress is too opaque at the interaction boundary.
   - The system may ask a question without explaining what the active queue is trying to finish, how many tasks it contains, which task is active, or what each task is for.
   - Operators then need an extra side conversation to reconstruct progress and produce a usable next-step recommendation.

This design closes those two gaps without replacing the current single-writer ownership model.

## Non-Authority And Scope Boundary

This document is a design and governance-spec proposal, not live Blueprint truth.

- It does not itself authorize queue creation or implementation.
- It does not replace `docs/blueprints/project-progress.md`, `docs/blueprints/blueprint.md`, target plans, or queue docs as live governors.
- It does define how Blueprint workflow should evolve so intake, candidate handling, and queue observability become internal obligations rather than operator-side manual procedure.

## Design Goals

1. Human operators should be able to state a problem or requirement in plain language.
2. Blueprint must internalize truth-chain reading, absorption checks, item classification, candidate recording, and admission routing.
3. When Blueprint does not immediately proceed into implementation, it must return a standard receipt explaining what happened and why.
4. When an active queue exists, Blueprint must expose a stable queue summary that explains the queue purpose, task count, current task, and per-task role.
5. The design must not create a second resume chain or a second live execution owner.

## Non-Goals

- Replacing the current `project-progress -> blueprint -> target plan -> active queue -> active task` chain
- Allowing queue docs to exist as pre-admission speculation
- Turning human-facing summaries into new Control Block truth
- Creating a separate candidate-governor document family outside current Blueprint owners

## Current Workflow Failure Modes

### 1. Governance Leakage To Humans

Today the correct queue-admission flow is structurally sound but too exposed:

- read the truth chain
- test whether a new item can be absorbed by the active queue
- classify an `item.xxx`
- record `queue-candidate` truth in the target plan
- write admission fields before any queue doc becomes active truth

That is correct for governance, but it is the wrong abstraction boundary for ordinary operator interaction. Humans should describe the need; Blueprint should perform the classification and routing work itself.

### 2. Missing Queue Progress Summary

An active queue may be legally structured while still being difficult to operate because interaction output does not reliably answer:

- what this queue is doing
- how many tasks the queue currently contains
- which task is active
- what each task exists to accomplish

Without a mandatory summary, human decisions drift into ad hoc side analysis.

### 3. Decision Moments Lack Standard Recommendation Output

When a task reaches a point that needs:

- human decision
- scope narrowing
- next-step recommendation
- blocker routing

the current workflow can ask a question without first packaging the queue's current state into a reusable recommendation artifact.

## Core Design Principles

1. Human input stays plain-language first.
2. Blueprint internalizes routing and governance writes.
3. Control Blocks remain the only executable truth.
4. Human-facing summaries are derived views, not new governing state.
5. Active queues must remain understandable without reopening side analysis threads.

## Proposed Workflow Model

### 1. Internal Intake Model

Every new operator problem statement is treated as an intake event by default.

The operator does not need to:

- invent an `item.xxx` id first
- choose a classification first
- decide whether the work should be absorbed or promoted
- know whether queue creation is currently legal

Instead, Blueprint must internally perform this sequence:

1. read `project-progress -> blueprint -> target plan -> active queue -> active task`
2. test whether the new request can be absorbed into the active queue when one exists
3. classify the intake item
4. if needed, record candidate or admission truth in the target plan
5. return a standardized operator-facing receipt

This preserves the current governance order while removing governance leakage from the operator interaction layer.

### 2. Candidate Handling Stays Target-Owned

This design does **not** legalize speculative queue docs.

Candidate truth still belongs to the target plan until admission is legal. The change is operational:

- candidate creation becomes an internal Blueprint responsibility
- the operator no longer needs to manually express the candidate machinery
- Blueprint must tell the operator that the request has been queued as a candidate and explain what happens next

### 3. Queue Observability Becomes Mandatory

Whenever an active queue exists and Blueprint is about to:

- ask the operator a question
- report a blocker
- switch tasks
- intake a new request against that queue
- request a choice that depends on current queue progress

it must first expose a stable queue summary.

This summary is called `Queue Snapshot` in this design.

### 4. Decision-Dispatch Becomes A Legal Queue Task Shape

`decision-dispatch` is introduced as a queue-local task shape, not a new resume-layer.

It is used only when:

- an active queue exists
- the current active task cannot continue cleanly without a human decision, scope cut, next-step recommendation, or blocker routing

It is not a permanent background task and it is not a target-level replacement for `promotion-review`.

## Target Plan Changes

The target plan remains the only live governor for target-level truth, but it should gain a small intake state surface so Blueprint can internalize operator requests without losing structured traceability.

### Proposed Intake Fields

- `intake_status`
  - `none | evaluating | absorbed | candidate-recorded | admission-review`
- `intake_item_id`
  - current internally handled intake item id, or `none`
- `intake_summary`
  - one-line summary of the intake request, or `none`
- `intake_result`
  - `absorbed-into-active-queue | queued-as-candidate | promoted-to-admission | rejected | deferred | none`
- `intake_feedback_mode`
  - `short-receipt | queue-snapshot | admission-receipt | none`

### Ownership Rules

- These fields belong only to the target plan.
- They do not replace `review_subject_id`, `review_subject_classification`, `proposed_queue_id`, `review_basis`, or `admission_status`.
- They exist to model the operator-facing intake step before or alongside downstream candidate/admission truth.
- Once intake handling is complete, these fields should return to `none` unless an actively handled intake is still in progress.

## Queue Document Changes

Queue docs remain the live queue-level governor. They should be strengthened with a required derived-summary block for human observability.

### Queue Snapshot

Add a required `Queue Snapshot` section under Human Context. It is derived from queue truth and task truth, and must answer:

- what the queue is for
- how many tasks the queue contains
- which task is active
- how many tasks are complete
- how many tasks remain
- what each task does in one sentence

### Required Queue Snapshot Fields

- `queue_goal`
- `task_count`
- `completed_task_count`
- `remaining_task_count`
- `active_task_summary`
- `task_briefs`
  - one brief line per task, tied to the queue's Task Ledger / Task Definitions

### Authority Rule

`Queue Snapshot` is not a Control Block and must not become a second source of task truth. It is a mandatory summary view derived from:

- `queue_status`
- `active_task`
- `next_task`
- Task Ledger
- Task Definitions

## Task Definition Changes

Task Definitions should gain explicit operator-readable summary fields so queue summaries and decision receipts can be generated consistently.

### Required Task Summary Fields

- `task_brief`
  - one-sentence explanation of what the task exists to do
- `task_outcome_summary`
  - one-sentence statement of what has been produced so far or what terminal output the task should leave behind

These fields should exist for all queue tasks, not only `decision-dispatch`, because operators need visibility across the whole queue.

## Decision-Dispatch Task Design

`decision-dispatch` is a queue-local task form used when queue progress needs to be translated into a concrete operator recommendation.

### Trigger Boundary

It may activate only when:

- an active queue exists
- the current active task requires:
  - human decision
  - scope trimming
  - next-step recommendation
  - blocker routing

### It Must Produce

Before asking the operator to choose, the task must produce a structured recommendation package containing:

- current queue progress
- completed and remaining tasks
- current blocker or decision boundary
- candidate branches
- recommended branch
- recommendation rationale
- a concise next-step instruction suitable for reuse in the main conversation

### It Must Not Do

- become a new resume layer above queue tasks
- replace target-level `promotion-review`
- justify skipping queue auto-reconcile or target/queue truth synchronization

## Operator-Facing Feedback Model

Blueprint should produce short, standardized receipts instead of forcing operators to infer governance outcomes from raw target-plan fields.

### 1. Intake Receipt

Used after a new operator request is evaluated.

It should state:

- what Blueprint did with the request
- why it was absorbed / queued / promoted / deferred
- why Blueprint is not directly implementing something else yet
- what Blueprint will do next

### 2. Queue Snapshot

Used whenever an active queue exists and the next interaction depends on queue state.

It should state:

- queue purpose
- total task count
- active task
- per-task brief summaries

### 3. Admission Receipt

Used when the intake path reaches target-level admission handling.

It should state:

- that the request has reached admission review
- the proposed queue identity
- the current reason implementation is not yet authorized
- the next governance action Blueprint is taking internally

## State Transition Expectations

The minimal intended flow is:

1. operator describes a problem
2. target plan sets `intake_status = evaluating`
3. Blueprint reads the truth chain and tests absorption
4. Blueprint resolves one of:
   - `absorbed-into-active-queue`
   - `queued-as-candidate`
   - `promoted-to-admission`
   - `rejected`
   - `deferred`
5. Blueprint emits the matching receipt
6. Blueprint returns intake fields to `none` once the handling step is durably recorded

## Required Refresh Points

Blueprint must refresh `Queue Snapshot` and matching receipt output whenever:

- `active_task` changes
- a task completes and enters auto-reconcile
- the queue becomes blocked
- a `decision-dispatch` task becomes active
- a new intake item is evaluated against the current queue
- queue closeout or target-review handoff changes the interaction context

## Workflow Spec Changes Required

`docs/blueprints/blueprint-workflow-spec.md` should be updated to codify:

1. plain-language operator requests are valid intake inputs
2. Blueprint must internalize truth-chain reading, absorption tests, classification, candidate recording, and admission routing
3. candidate truth remains target-owned until admission
4. `Queue Snapshot` is mandatory whenever an active queue exists and the interaction depends on queue state
5. `decision-dispatch` is a legal queue-task shape but not a new resume layer
6. standardized operator receipts are mandatory when work is absorbed, queued, promoted, deferred, or blocked

## Template Changes Required

### Target Plan Template

`docs/blueprints/templates/target-plan-template.md` should gain:

- intake field templates
- intake lifecycle notes
- receipt-generation expectations

### Execution Queue Template

`docs/blueprints/templates/execution-queue-template.md` should gain:

- required `Queue Snapshot`
- required `task_brief`
- required `task_outcome_summary`
- a `decision-dispatch` task example

## Lint Changes Required

`tools/lint-blueprints.mjs` should be extended to reject:

1. active queues that omit `Queue Snapshot`
2. Task Ledgers whose task count does not match task definitions
3. queues whose `active_task` is missing from either the ledger or task definitions
4. task definitions that omit `task_brief`
5. intake field combinations that are structurally inconsistent
6. `decision-dispatch` tasks that lack recommendation-summary support fields

## Test Changes Required

Blueprint tests should cover:

1. legal target-plan intake state shapes
2. legal active-queue `Queue Snapshot` shapes
3. task-count consistency between snapshot, ledger, and task definitions
4. legal `decision-dispatch` task presence without resume-chain drift
5. candidate handling that remains target-owned before queue admission

## Migration Order

This change should land in this order:

1. update `docs/blueprints/blueprint-workflow-spec.md`
2. update Blueprint templates
3. extend blueprint lint rules
4. extend Blueprint governance tests
5. update current live Blueprint docs only where the new rules require current truth to expose the new fields or snapshots
6. mirror the governance change in `docs/change-log.md` if a historical summary is desired

## Acceptance Criteria

This design is successful only when:

- operators can describe new work in plain language without manually driving candidate machinery
- Blueprint internalizes classification and routing while keeping structured truth
- active queues always expose a stable summary of purpose, task count, active task, and per-task role
- decision moments always arrive with a recommendation package rather than a bare question
- no second live execution owner or alternate resume chain is introduced
