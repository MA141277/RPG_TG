# Current Blueprint

## Control Block

- blueprint_id: `blueprint.replace-me`
- status: `in-progress`
- active_target: `target.replace-me`
- active_queue: `queue.replace-me | none`
- active_task: `task.replace-me | none`
- active_phase: `phase.replace-me`
- decision_state: `active-execution | promotion-review | blocked`
- resume_order:
  - `blueprint`
  - `target`
  - `queue`
  - `task`
- next_step: `Replace with the next explicit resume action.`
- next_file: `docs/blueprints/...`
- execution_mode: `single-active-task`
- allow_parallel: `false`
- blocked_by: []
- classification_rules_ref: `docs/blueprints/classification-rule-layer-spec.md`
- classification_low_confidence_fallback: `uncertain-needs-review`
- candidate_targets: []
- completed_targets: []

## Human Context

### Role

This Blueprint is the repository-wide execution index.

### Current Status

- Status: `in-progress`
- Last Updated: `2000-01-01`
- Current Focus: `Replace this line with the current focus.`
- Current Target Spec:
  - `docs/blueprints/specs/...`
- Current Target Plan:
  - `docs/blueprints/plans/...`
- Active Queue:
  - `docs/blueprints/queues/... | none`
- Active Queue Task:
  - `task.... | none`
- Next Step:
  - `Replace this line with the next real action.`
- Verification:
  - `Replace this line with the latest known verification state.`
- Notes:
  - `Replace this line with current owner-level caveats.`

### Current Target

- Target:
  - `Replace with the current-period target name.`
- Target id:
  - `target.replace-me`
- Governing artifacts:
  - `docs/blueprints/specs/...`
  - `docs/blueprints/plans/...`

### Classification Layer

- Rule layer:
  - `docs/blueprints/classification-rule-layer-spec.md`
- Default behavior:
  - `Classify first, route second, promote later.`
- Low-confidence fallback:
  - `uncertain-needs-review`

### Queue Portfolio

| Queue ID | Class | State | Role | Source |
| --- | --- | --- | --- | --- |
| `queue.replace-me` | `required` | `active` | `Replace with queue role.` | `docs/blueprints/queues/...` |

### Resume Notes

1. Read the `## Control Block` first.
2. Open the current target spec and plan.
3. If `active_queue = none`, resume from target-level promotion review instead of inventing a placeholder queue.

### Progress Log

- 2000-01-01
  - Summary: `Blueprint created.`
  - Verification: `Not run`
  - Next: `Replace with the next real action.`
