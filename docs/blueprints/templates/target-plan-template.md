# Target Plan Title

## Control Block

- document_role: `target-governor`
- target_id: `target.replace-me`
- status: `in-progress`
- active_phase: `phase.replace-me`
- active_queue: `queue.replace-me | none`
- active_task: `task.replace-me | none`
- decision_state: `active-execution | promotion-review | blocked`
- next_decision: `queue.replace-me | none`
- blocked_by: []
- classification_review_policy:
  - `new_items_must_be_classified_before_queue_promotion_or_pipeline_routing`
- promotion_gate:
  - `active_queue_is_none_or_done`
  - `fresh_audit_proves_real_blocker`
  - `promotion_note_written`
  - `promoted_queue_has_valid_control_block`
- closeout_gate:
  - `all_required_queues_done_or_dropped`
  - `no_active_task_remaining`
  - `target_acceptance_criteria_passed`
- remote_integration_policy:
  - `verified_batch_or_queue_closeout_should_trigger_remote_integration_recommendation`

## Human Context

### Goal

Replace with the target-level sequencing goal.

### Architecture

Replace with the target-level boundary and queue promotion approach.

### Tech Stack

Replace with the relevant workflow docs and verification tools.

### Execution State

- Status: `in-progress`
- Last Updated: `2000-01-01`
- Current Focus: `Replace this line with the current focus.`
- Next Step: `Replace this line with the next target-level action.`
- Verification: `Replace this line with the latest known verification state.`
- Notes: `Replace this line with current caveats.`

### Queue Policy

- There is one current target in the current execution period.
- Concrete work enters through queue documents.
- Only one queue task may be `active` repository-wide unless a stronger written reason says otherwise.
- If `active_queue = none`, resume from promotion review rather than inventing work.

### Classification Review

- Rule layer:
  - `docs/blueprints/classification-rule-layer-spec.md`
- Promotion review order:
  1. `classify the new item`
  2. `check target-specific overrides`
  3. `route before promotion`

### Queue Family Cards

#### `queue.replace-me`

- Goal:
  - `Replace with queue role.`
- Promote when:
  - `Replace with explicit promote rule.`

### Progress Log

- 2000-01-01
  - Summary: `Target plan created.`
  - Verification: `Not run`
  - Next: `Replace with the next real action.`
