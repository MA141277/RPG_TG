# Current Blueprint

## Control Block

- blueprint_id: `blueprint.rpg-tg`
- blueprint_version: `2026.07`
- active_version: `target.script-editor-authoring-data-structure-unification`
- active_version_plan: `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
- active_version_spec: `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
- classification_rules_ref: `docs/blueprints/classification-rule-layer-spec.md`
- execution_mode: `single-active-task`
- allow_parallel: `false`

## Human Context

### Role

- `This file is the Blueprint index, active version pointer, and version registry.`
- `The active_version* pointers resolve to the latest governed version record; when an open successor exists, they point to that open version's spec and plan.`

### Version Registry

| Version ID | Spec | Plan | Notes |
| --- | --- | --- | --- |
| `target.script-editor-authoring-data-structure-unification` | `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md` | `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md` | `Opened on 2026-07-15 as the live successor version after target.script-editor-runtime-pack-unification closed; governs script-editor package persistence, completion gating, unified field mapping, character/city/building/dialogue/story/event authoring data, typed conditions, launch policy, playable/minigame bindings, status overlays, legacy supersession, and final end-to-end authoring/runtime validation. The branching/event/task-chain convergence queue is active.` |
| `target.script-editor-runtime-pack-unification` | `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md` | `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md` | `Closed on 2026-07-15 after explicit human closeout confirmation; the runtime-family contract, authoring convergence, runtime-pack export, base-pack inheritance, fixed-pack consumer, compatibility-boundary, activities, non-activities runtime-family, narrative export, and scenarioProfile startup export queues are now all historical evidence with no remaining lawful same-version candidate queue.` |
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
