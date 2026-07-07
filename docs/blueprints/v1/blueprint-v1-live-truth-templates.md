# Blueprint v1 Live Truth Templates

## Goal

These templates define the minimum live truth needed for Blueprint v1. They are intentionally smaller than the current Blueprint documents.

## Project Progress Template

```md
# Project Progress

## Control Block

- entry_id: `project-progress.replace-me`
- active_blueprint: `blueprint.replace-me`
- active_target: `target.replace-me`
- has_execution_queue: `true | false`
- next_file: `docs/blueprints/blueprint.md`

## Human Context

- Repository entry only. Do not mirror target or queue internals here.
```

## Blueprint Template

```md
# Blueprint

## Control Block

- blueprint_id: `blueprint.replace-me`
- active_target: `target.replace-me`
- execution_mode: `single-execution-slot`
- target_registry:
  - `target.replace-me`
- rule_refs:
  - `docs/blueprints/v1/blueprint-v1-hard-rules.md`

## Human Context

- Blueprint index only. Do not mirror target or queue-local truth here.
```

## Target Template

```md
# Target

## Control Block

- target_id: `target.replace-me`
- version_goal: `replace-with-version-goal`
- acceptance_criteria:
  - `replace-with-acceptance-criterion`
- in_scope:
  - `replace-with-in-scope-item`
- out_of_scope:
  - `replace-with-out-of-scope-item`
- execution_queue: `queue.replace-me | none`
- candidate_queues:
  - candidate_id: `queue.candidate-a`
    state: `candidate | prepared | active`
    goal: `replace-with-goal`
    entry_conditions: `replace-with-entry-condition`
    artifacts_needed:
      - `replace-with-required-artifact`
    drop_if: `replace-with-drop-condition`
    on_failure: `return-to-candidate | absorb-into-target | decision_required`
- transition_queue:
  - queue_id: `queue.transition-a | none`
  - state: `candidate | prepared | active | none`
  - binds_candidates:
    - `queue.candidate-a`
  - trigger_basis:
    - `replace-with-artifact-gap`
  - minimal_scope:
    - `replace-with-minimum-bridge-scope`
- absorb_resolution:
  - source_queue: `queue.replace-me | none`
  - failure_scope: `target-level | repository/global | none`
  - resolution_kind: `candidate-rewrite | new-candidate | unique-transition-queue | none`
  - resolution_target: `queue.candidate-a | queue.transition-a | none`
- constraints:
  - `replace-with-target-constraint`
  - `executing verify_with does not by itself assign failure ownership`
  - `a non-owner verification failure must be absorbed into target-owned follow-up work and must not remain on the original queue closeout`
- artifact_rules:
  - artifact_id: `artifact.replace-me`
    required_for:
      - `queue.candidate-a`
    transition_allowed_when_missing: `true | false`
    rule: `replace-with-formal-transition-basis`
  - artifact_id: `artifact.non-owner-verify-failure`
    required_for:
      - `queue.candidate-a`
    transition_allowed_when_missing: `true`
    rule: `if conservative verification shows the failure cannot be reasonably assigned to the current queue bounded goal, owner scope, or direct edit surface, target must absorb it into target-owned follow-up work as a candidate rewrite, a new candidate, or one unique necessary transition queue`
- done_when:
  - `replace-with-target-done-signal`
- closeout_condition:
  - `all acceptance criteria pass`
  - `execution_queue = none`
  - `no candidate remains executable`
  - `no transition queue is justified`
- decision_required:
  - `none | replace-with-human-facing-question`
  - `after answer, return control to target scheduling`

## Human Context

- The target is the single target-level live owner.
```

## Execution Queue Template

```md
# Execution Queue

## Control Block

- queue_id: `queue.replace-me`
- queue_role: `execution`
- target_id: `target.replace-me`
- status: `active | done | returned-to-candidate`
- active_task: `task.replace-me | none`
- goal_status: `in-progress | satisfied`
- failure_owner_scope: `none | queue-local | target-level | repository/global`
- tasks:
  - task_id: `task.replace-me`
    goal: `replace-with-task-goal`
    inputs:
      - `replace-with-input`
    constraints:
      - `replace-with-constraint`
    verify_with:
      - `replace-with-command`
    done_signal:
      - `replace-with-task-done-signal`
    next_on_success: `task.next | queue-complete`
    on_failure: `retry | return-to-candidate | absorb-into-target | decision_required`
- completion_effect: `promote-next-candidate | create-transition | stop`
- closeout_status: `in-progress | done | escalated-to-target`
- next_effect: `return-to-target-review | return-to-candidate | absorb-into-target | none`

## Human Context

- This is the one real execution slot.
- Executing verify_with does not by itself assign failure ownership.
- A non-owner verification failure must not remain on this queue closeout; if queue goal completion is already satisfied, it must instead move to `next_effect = absorb-into-target`.
- If `closeout_status = escalated-to-target`, the queue must already be in the unified terminal state: `queue_status = done`, `goal_status = satisfied`, `active_task = none`, and the blocker is no longer queue-owned.
```

## Candidate Queue Template

```md
# Candidate Queue

## Control Block

- candidate_id: `queue.candidate-a`
- queue_role: `candidate`
- state: `candidate | prepared | active`
- target_id: `target.replace-me`
- goal: `replace-with-candidate-goal`
- readiness_basis:
  - `replace-with-basis`
- entry_conditions: `replace-with-direct-entry-condition`
- artifacts_needed:
  - `replace-with-artifact`
- direct_activation_allowed: `true | false`
- drop_if: `replace-with-candidate-drop-condition`
- on_failure: `stay-candidate | absorb-into-target | transition-needed | decision_required`

## Human Context

- Candidate queues are staged target entries, not independent execution slots.
```

## Transition Queue Template

```md
# Transition Queue

## Control Block

- queue_id: `queue.transition-a`
- queue_role: `transition`
- state: `candidate | prepared | active`
- target_id: `target.replace-me`
- binds_candidates:
  - `queue.candidate-a`
- why_direct_activation_is_blocked:
  - `replace-with-blocking-artifact-gap`
- minimal_scope:
  - `replace-with-smallest-bridge-scope`
- done_when:
  - `bound candidate can move to prepared or active`
- on_failure: `return-candidates | absorb-into-target | decision_required`

## Human Context

- A transition queue is unique, necessary, minimal, and always candidate-bound.
```

## Recommended Defaults Still Requiring Final Signoff

1. `prepared` currently lives inside each target candidate entry and does not require a separate document until activation.
2. `decision_required` currently lives on the target as a human-facing question, not on every queue.
3. `transition_queue` is modeled as optional target-owned truth plus its own queue document only when it reaches prepared or active.
