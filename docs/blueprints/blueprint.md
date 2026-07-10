# Current Blueprint

## Control Block

- blueprint_id: `blueprint.rpg-tg`
- blueprint_version: `2026.07`
- active_version: `target.script-editor-contract-freeze`
- active_version_plan: `docs/blueprints/plans/2026-07-10-script-editor-contract-freeze-target-plan.md`
- active_version_spec: `docs/blueprints/specs/2026-07-10-script-editor-contract-freeze-target.md`
- classification_rules_ref: `docs/blueprints/classification-rule-layer-spec.md`
- execution_mode: `single-active-task`
- allow_parallel: `false`

## Human Context

### Role

- `This file is the Blueprint index, active version pointer, and version registry.`

### Version Registry

| Version ID | Spec | Plan | Notes |
| --- | --- | --- | --- |
| `target.script-editor-contract-freeze` | `docs/blueprints/specs/2026-07-10-script-editor-contract-freeze-target.md` | `docs/blueprints/plans/2026-07-10-script-editor-contract-freeze-target-plan.md` | `Current active version for script-editor design and contract freeze only.` |
| `target.project-complete-modularization` | `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md` | `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md` | `Closed on 2026-07-10 after current-period modularization closeout.` |

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
