# Target Title

## Control Block

- target_id: `target.replace-me`
- version_goal: `Replace with the current target version goal.`
- acceptance_criteria:
  - `Replace with acceptance criterion 1.`
  - `Replace with acceptance criterion 2.`
- in_scope:
  - `Replace with in-scope item 1.`
  - `Replace with in-scope item 2.`
- out_of_scope:
  - `Replace with out-of-scope item 1.`
  - `Replace with out-of-scope item 2.`
- execution_queue: `queue.replace-me | none`
- candidate_queues:
  - candidate_id: `queue.replace-me`
    state: `candidate | prepared | active`
    goal: `Replace with the bounded candidate goal.`
    entry_conditions: `Replace with the direct activation condition.`
    artifacts_needed:
      - `artifact.replace-me`
    drop_if: `Replace with the condition that removes or absorbs this candidate without execution.`
    on_failure: `return-to-candidate | absorb-into-target | decision_required`
- transition_queue:
  - queue_id: `queue.transition-replace-me | none`
  - state: `candidate | prepared | active | none`
  - binds_candidates:
    - `queue.replace-me`
  - trigger_basis:
    - `Replace with the minimal bridge reason.`
  - minimal_scope:
    - `Replace with the smallest bridge output.`
- absorb_resolution:
  - source_queue: `queue.replace-me | none`
  - failure_scope: `target-level | repository/global | none`
  - resolution_kind: `candidate-rewrite | new-candidate | unique-transition-queue | none`
  - resolution_target: `queue.replace-me | queue.transition-replace-me | none`
- constraints:
  - `Only one execution queue may be active at a time.`
  - `New work enters candidate_queues by default.`
  - `Executing verify_with does not by itself assign failure ownership.`
  - `A non-owner verification failure must be absorbed into target-owned follow-up work and must not remain on the original queue closeout.`
- artifact_rules:
  - artifact_id: `artifact.replace-me`
    required_for:
      - `queue.replace-me`
    transition_allowed_when_missing: `true | false`
    rule: `Replace with the artifact rule that decides direct activation versus transition work.`
  - artifact_id: `artifact.non-owner-verify-failure`
    required_for:
      - `queue.replace-me`
    transition_allowed_when_missing: `true`
    rule: `If conservative verification shows the failure cannot be reasonably assigned to the current queue bounded goal, owner scope, or direct edit surface, target must absorb it into target-owned follow-up work as a candidate rewrite, a new candidate, or one unique necessary transition queue.`
- done_when:
  - `execution_queue = none`
  - `no candidate has a proven entry_conditions match`
  - `no transition queue is justified`
- closeout_condition:
  - `Replace with the human-facing closeout condition.`
- decision_required: `none | Replace with one human-facing question when no unique automatic decision remains; after answer, return to target scheduling.`

## Human Context

### Role

- `This file is the single target-level live owner.`
- `It owns queue selection, queue continuity, and target closeout readiness.`

### Compatibility Notes

- Legacy target spec:
  - `docs/blueprints/specs/...`
- Legacy target plan:
  - `docs/blueprints/plans/... (compatibility shell only)`
