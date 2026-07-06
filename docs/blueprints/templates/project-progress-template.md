# Project Progress

## Control Block

- entry_id: `project-progress.replace-me`
- status: `in-progress`
- active_blueprint: `blueprint.replace-me`
- active_target: `target.replace-me`
- active_phase: `phase.replace-me`
- active_queue: `queue.replace-me | none`
- active_task: `task.replace-me | none`
- decision_state: `active-execution | promotion-review | blocked`
- execution_mode: `single-active-task`
- allow_parallel: `false`
- blocked_by: []
- resume_order:
  - `project-progress`
  - `blueprint`
  - `target`
  - `queue`
  - `task`
- next_file: `docs/blueprints/...`
- next_step: `Replace with the next explicit resume action.`
- candidate_queues: []
- completed_queues: []
- classification_layer: `docs/blueprints/classification-rule-layer-spec.md`

## Human Context

### Current Source Of Truth

- Workflow spec:
  - `docs/blueprints/blueprint-workflow-spec.md`
- Current owner document:
  - `docs/blueprints/blueprint.md`

### Global State

- Status: `in-progress`
- Last Updated: `2000-01-01`
- Current Focus: `Replace this line with the current focus.`
- Active Blueprint:
  - `docs/blueprints/blueprint.md`
- Current Target Spec:
  - `docs/blueprints/specs/...`
- Current Target Plan:
  - `docs/blueprints/plans/...`
- Active Phase:
  - `Replace with the active phase.`
- Active Queue:
  - `docs/blueprints/queues/... | none`
- Active Queue Task:
  - `task.... | none`
- Next Step:
  - `Replace with the next repository-wide action.`
- Verification:
  - `Replace with the latest known verification state.`
- Notes:
  - `Replace with current caveats.`

### Resume Protocol

1. Open `docs/blueprints/project-progress.md`.
2. Read the `## Control Block`.
3. Open `docs/blueprints/blueprint.md`.
4. Open the current target spec and current target plan.
5. If `active_queue = none`, resume from target-level promotion review.
6. Only open a queue after its promotion gate is recorded.

### Queue Snapshot

| Queue | Current State | Current Source | Next Action |
| --- | --- | --- | --- |
| `queue.replace-me` | `active` | `docs/blueprints/queues/...` | `Replace with the next action.` |

### Progress Log

- 2000-01-01
  - Summary: `Project progress entry created.`
  - Verification: `Not run`
  - Next: `Replace with the next real action.`
