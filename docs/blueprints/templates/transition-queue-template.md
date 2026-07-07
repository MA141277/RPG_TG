# Transition Queue Template

## Control Block

- queue_id: `queue.transition-replace-me`
- state: `candidate | prepared | active`
- binds_candidates:
  - `queue.replace-me`
- trigger_basis:
  - `Replace with the missing artifact or bridge condition.`
- minimal_scope:
  - `Replace with the smallest bridge output.`
- done_when:
  - `bound candidate can move to prepared or active`
- on_failure: `return-candidates | absorb-into-target | decision_required`

## Human Context

- `A transition queue is unique, necessary, minimal, and candidate-bound.`
- `Create it only when no candidate can directly execute.`
- `It still uses the same single execution slot as every other active queue.`
