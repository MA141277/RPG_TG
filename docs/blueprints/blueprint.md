# Current Blueprint

## Control Block

- blueprint_id: `blueprint.rpg-tg`
- blueprint_version: `2026.07`
- active_version: `target.script-editor-implementation`
- active_version_plan: `docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md`
- active_version_spec: `docs/blueprints/specs/2026-07-13-script-editor-implementation-target.md`
- classification_rules_ref: `docs/blueprints/classification-rule-layer-spec.md`
- execution_mode: `single-active-task`
- allow_parallel: `false`

## Human Context

### Role

- `This file is the Blueprint index, active version pointer, and version registry.`
- `The active_version* pointers resolve to the latest governed version record even when that version is already closed historical evidence and no open successor exists yet.`

### Version Registry

| Version ID | Spec | Plan | Notes |
| --- | --- | --- | --- |
| `target.script-editor-implementation` | `docs/blueprints/specs/2026-07-13-script-editor-implementation-target.md` | `docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md` | `Opened on 2026-07-13 as the live successor implementation version on top of the frozen script-editor contract baseline; queue.shared-condition-effect-authoring-integration is now the single active queue after the first minimal workflow closed.` |
| `target.script-editor-contract-freeze` | `docs/blueprints/specs/2026-07-10-script-editor-contract-freeze-target.md` | `docs/blueprints/plans/2026-07-10-script-editor-contract-freeze-target-plan.md` | `Closed on 2026-07-10 after explicit human closeout confirmation; no open successor currently exists.` |
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
