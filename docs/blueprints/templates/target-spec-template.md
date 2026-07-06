# Target Title

## Control Block

- target_id: `target.replace-me`
- version_label: `replace-me`
- status: `in-progress`
- active_phase: `phase.replace-me`
- active_queue: `queue.replace-me | none`
- required_queues:
  - `queue.replace-me`
- conditional_queues: []
- optional_queues: []
- historical_queues: []
- blocked_by: []
- classification_overrides: []
- acceptance_gate:
  - `all_required_queues_done_or_dropped`
  - `no_active_task_remaining`
  - `target_acceptance_criteria_passed`
- promote_next_queue_when:
  - `active_queue_is_none_or_done`
  - `fresh_audit_proves_real_blocker`
  - `promotion_evidence_recorded`
- close_target_when:
  - `acceptance_gate_passed`

## Human Context

### Goal

Replace with the version delivery goal.

### Scope

Replace with what belongs to this target.

### Non-Goals

Replace with what must not be pulled into this target.

### Queue Portfolio

| Queue ID | Class | State | Promote When | Source |
| --- | --- | --- | --- | --- |
| `queue.replace-me` | `required` | `active` | `Replace with promotion rule.` | `docs/blueprints/queues/...` |

### Classification Overrides

- `Replace with target-specific routing overrides for current-target-item, queue-candidate, content-pipeline-item, asset-pipeline-item, future-target-candidate, historical-residue, and uncertain-needs-review.`

### Acceptance Criteria

- `Replace with acceptance criterion 1.`
- `Replace with acceptance criterion 2.`

### Exit Conditions

- `Replace with exit condition 1.`
- `Replace with exit condition 2.`

### Progress Log

- 2000-01-01
  - Summary: `Target spec created.`
  - Verification: `Not run`
  - Next: `Replace with the next real action.`
