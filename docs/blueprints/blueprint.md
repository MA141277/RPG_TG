# Current Blueprint

## Control Block

- blueprint_id: `blueprint.rpg-tg`
- active_target: `target.project-complete-modularization`
- active_target_plan: `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
- classification_rules_ref: `docs/blueprints/classification-rule-layer-spec.md`
- execution_mode: `single-active-task`
- allow_parallel: `false`

## Human Context

### Role

- `This file is the Blueprint index and target registry.`

### Target Registry

| Target ID | Plan | Notes |
| --- | --- | --- |
| `target.project-complete-modularization` | `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md` | `Current-period modularization target.` |

### Routing Layer

- Rule layer:
  - `docs/blueprints/classification-rule-layer-spec.md`
- Default behavior:
  - `Classify first, route second, promote later.`
- Low-confidence fallback:
  - `uncertain-needs-review`

### Historical Snapshot (2026-07-07)

- `Queue-local truth, active-task truth, and completed-target registries were removed from the Blueprint index.`
- `Closed queues remain historical evidence only and no longer act like current execution controllers.`
