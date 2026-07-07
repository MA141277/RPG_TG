# AI Classification Rule Layer Spec

## Control Block

- layer_id: `classification-layer.rpg-tg`
- status: `active`
- applies_to_blueprint: `blueprint.rpg-tg`
- canonical_resume_chain:
  - `project-progress`
  - `blueprint`
  - `target`
  - `execution-queue`
- default_low_confidence_classification: `decision-required`
- classification_outputs:
  - `execution-queue-work`
  - `candidate-queue-input`
  - `transition-queue-input`
  - `future-target-candidate`
  - `content-pipeline-item`
  - `asset-pipeline-item`
  - `historical-residue`
  - `out-of-scope`
  - `decision-required`

## Human Context

### Goal

- `Classify new work before it mutates target or queue truth.`
- `Keep routing separate from execution, and execution separate from historical narrative.`

### Placement In The Governance Stack

- `Classification is a routing layer, not a live execution controller.`
- `Current execution truth still comes only from project-progress -> blueprint -> target -> execution queue.`
- `Classification may recommend candidate_queues or transition_queue changes, but it cannot activate execution by itself.`

### Core Rules

1. `If work fits the current execution queue without widening scope, keep it inside execution.`
2. `If work belongs to the current target but requires bounded new execution, route it into candidate_queues.`
3. `If no candidate can directly execute and one minimal bridge artifact would unblock a specific candidate, route it into transition_queue evaluation.`
4. `If multiple mutually exclusive branches remain and target evidence cannot decide, use decision_required.`
5. `Human questions may ask only about priority, boundary, risk, or direction.`
6. `Change-log, old docs/superpowers/**, and closed queue prose may inform history but may not override current live truth.`
7. `Executing verify_with does not by itself assign failure ownership; if conservative verification shows the failure cannot be reasonably assigned to the current queue bounded goal, owner scope, or direct edit surface, route it to target absorption instead of blocked queue closeout.`

### Classification Outputs

- `execution-queue-work`
  - `Fits the current active execution queue and does not widen its bounded scope.`
- `candidate-queue-input`
  - `Requires a new bounded queue under the current target and should enter candidate_queues first.`
- `transition-queue-input`
  - `Requires minimal bridge work before a specific candidate can become prepared or active.`
- `future-target-candidate`
  - `Valuable, but not required for the current target acceptance.`
- `content-pipeline-item`
  - `Fits existing schema and runtime path and does not require governance expansion.`
- `asset-pipeline-item`
  - `Fits existing naming and contract rules and does not require behavior change.`
- `historical-residue`
  - `Accepted older structure that remains recorded but must not silently reactivate execution.`
- `decision-required`
  - `Evidence is incomplete or multiple legal branches remain after automatic routing.`
- `out-of-scope`
  - `Outside current repository governance.`

### Routing Contract

- `execution-queue-work`
  - `stay inside the execution queue`
- `candidate-queue-input`
  - `record or update candidate_queues on the target`
- `transition-queue-input`
  - `evaluate target artifact_rules and create one unique transition_queue only if justified`
- `future-target-candidate`
  - `record as future work, not current-target execution`
- `decision-required`
  - `ask one human-facing question only if target evidence cannot decide`

### Success Condition

- `Most new items route automatically without reopening thick governance prose.`
- `candidate_queues remain the default intake path for new bounded work.`
- `transition_queue stays unique, necessary, minimal, and candidate-bound.`
- `Classification never becomes a second live truth source beside the target and execution queue.`
