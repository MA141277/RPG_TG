# Current Blueprint

## Control Block

- blueprint_id: `blueprint.rpg-tg`
- blueprint_version: `2026.07`
- active_version: `target.script-editor-runtime-pack-unification`
- active_version_plan: `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
- active_version_spec: `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
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
| `target.script-editor-runtime-pack-unification` | `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md` | `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md` | `Opened on 2026-07-14 as the live successor version after target.script-editor-prd-alignment closed; this version governs final scenario-pack family truth, runtime-pack export unification, base-pack inheritance governance, fixed-pack consumer deprivileging, and compatibility-boundary retirement on top of the closed bounded editor and PRD-alignment baselines, and is currently back at promotion-review after all recorded runtime-pack-unification contract-governance queues closed as historical evidence.` |
| `target.script-editor-prd-alignment` | `docs/blueprints/specs/2026-07-13-script-editor-prd-alignment-target.md` | `docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md` | `Closed on 2026-07-14 after explicit human closeout confirmation; the workspace/navigation, project-selection/layout, person-authoring, city-building, dialogue-event-story, minigame-binding, preview-validation-export, and final workbench-ui-visual queues are now all historical evidence for the successor runtime-pack-unification version.` |
| `target.script-editor-implementation` | `docs/blueprints/specs/2026-07-13-script-editor-implementation-target.md` | `docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md` | `Closed on 2026-07-13 after explicit human closeout confirmation; the frozen-baseline implementation path, six bounded implementation queues, first user-visible workflow, and bounded shared-rule compile/export slice are now all historical evidence.` |
| `target.script-editor-contract-freeze` | `docs/blueprints/specs/2026-07-10-script-editor-contract-freeze-target.md` | `docs/blueprints/plans/2026-07-10-script-editor-contract-freeze-target-plan.md` | `Closed on 2026-07-10 after explicit human closeout confirmation; its successor implementation version is also now closed historical evidence.` |
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
