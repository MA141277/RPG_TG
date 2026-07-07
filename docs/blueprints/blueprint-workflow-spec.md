# Blueprint Workflow Spec

## Role

This file is the repository entry spec for Blueprint v1 during migration.

The canonical execution model is defined by:

- `docs/blueprints/v1/blueprint-v1-hard-rules.md`
- `docs/blueprints/v1/blueprint-v1-migration-map.md`
- `docs/blueprints/v1/blueprint-v1-live-truth-templates.md`

## Canonical Resume Chain

The only legal live resume chain is:

```text
project-progress -> blueprint -> target -> execution queue
```

## Live Truth Owners

- `project-progress`
  - repository entry only
- `blueprint`
  - target pointer, rule references, execution mode
- `target`
  - `version_goal`
  - `acceptance_criteria`
  - `in_scope`
  - `out_of_scope`
  - `execution_queue`
  - `candidate_queues`
  - `transition_queue`
  - `constraints`
  - `artifact_rules`
  - `done_when`
  - `closeout_condition`
  - `decision_required`
- `execution queue`
  - queue-local tasks, verification, outputs, completion evidence

## Verification Ownership

- Executing `verify_with` does not by itself assign failure ownership.
- If conservative verification shows a failure cannot be reasonably assigned to the current queue bounded goal, owner scope, or direct edit surface, the failure must be absorbed into the target.
- Once absorbed, the target must continue through a candidate rewrite, a new candidate, or one unique necessary transition queue instead of leaving the original queue in blocked closeout.

## Required Templates

- `docs/blueprints/templates/project-progress-template.md`
- `docs/blueprints/templates/blueprint-template.md`
- `docs/blueprints/templates/target-template.md`
- `docs/blueprints/templates/execution-queue-template.md`
- `docs/blueprints/templates/candidate-queue-template.md`
- `docs/blueprints/templates/transition-queue-template.md`

## Compatibility

- `docs/blueprints/specs/**` and `docs/blueprints/plans/**` are migration-era compatibility shells.
- They must not become the primary target-level truth once a v1 target owner exists.
- The active Blueprint should point directly at the v1 target owner through `active_target_file`.

## Enforcement

- `npm run lint:blueprints` validates current Blueprint document consistency.
- `tests/blueprint-v1-docs.test.cjs` validates the v1 document surface and migration posture.
- Historical workflow prose under `docs/superpowers/**` remains reference-only and must not override current live truth.
