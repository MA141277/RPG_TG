# Execution Queue Title

## Control Block

- queue_id: `queue.replace-me`
- belongs_to_target: `target.replace-me`
- queue_status: `active | blocked | done | dropped`
- queue_class: `required | conditional | transition`
- active_task: `task.replace-me | none`
- next_task: `task.replace-me-next | none`
- goal_status: `in-progress | satisfied`
- failure_owner_scope: `none | queue-local | target-level | repository/global`
- closeout_status: `in-progress | done | escalated-to-target`
- next_effect: `return-to-target-review | return-to-candidate | absorb-into-target | none`
- blocked_by: []
- allowed_item_classifications:
  - `execution-queue-work`
- reject_item_classifications:
  - `future-target-candidate`
  - `out-of-scope`

## Human Context

### Queue Role

- `This file is the only live execution governor once the target execution_queue points here.`
- `It owns task order, verification, queue-local outputs, and closeout evidence.`
- `Executing verify_with does not by itself assign failure ownership.`
- `A non-owner verification failure must not remain on this queue closeout; if queue goal completion is already satisfied, it must instead move to next_effect = absorb-into-target.`
- `If closeout_status = escalated-to-target, queue_status = done is required, active_task must be none, and the blocker is no longer queue-owned live truth.`

### Task Definitions

#### `task.replace-me`

##### Control Block

- task_id: `task.replace-me`
- goal: `Replace with the bounded task goal.`
- inputs:
  - `file-or-module-a`
  - `file-or-module-b`
- constraints:
  - `Replace with the task constraint.`
- verify_with:
  - `command-a`
  - `command-b`
- done_signal: `Replace with the concrete completion signal.`
- next_on_success: `task.replace-me-next | queue-closeout`
- on_failure: `retry | return-to-candidate | absorb-into-target | decision_required`

##### Human Context

- `Keep task prose minimal and execution-oriented.`
