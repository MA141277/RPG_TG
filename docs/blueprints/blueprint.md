# Current Blueprint

## Control Block

- blueprint_id: `blueprint.rpg-tg`
- blueprint_version: `2026.07`
- active_version: `target.building-arrangement-container-flow-refactor`
- active_version_plan: `docs/blueprints/plans/2026-07-20-building-arrangement-container-flow-refactor-target-plan.md`
- active_version_spec: `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-target.md`
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
| `target.building-arrangement-container-flow-refactor` | `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-target.md` | `docs/blueprints/plans/2026-07-20-building-arrangement-container-flow-refactor-target-plan.md` | `Open successor refactor target created on 2026-07-20 from MEMO-022 and the reviewed evidence draft. It admits queue.building-arrangement-canonical-schema first, then continues through Script Editor building arrangement UX, runtime container shell, event trigger integration, flow playable runtime, flow authoring UX, Zhu Yuanzhang pack migration, legacy house retirement, and final acceptance without entering version closeout unless explicitly requested.` |
| `target.entry-shell-ui-module-extraction` | `docs/blueprints/specs/2026-07-19-entry-shell-ui-module-extraction-target.md` | `docs/blueprints/plans/2026-07-19-entry-shell-ui-module-extraction-target-plan.md` | `Closed on 2026-07-19 after queue.entry-shell-ui-module-extraction extracted startup/pre-game Entry Shell rendering from MainUiFlow while preserving start game, continue game, JSON start, Script Editor entry, and character-selection behavior.` |
| `target.city-building-module-entry-and-project-startup-authoring` | `docs/blueprints/specs/2026-07-19-city-building-module-entry-and-project-startup-authoring-target.md` | `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md` | `Open successor startup/module version created on 2026-07-19 from the operator-approved 项目信息 startup authoring and city/building module entry draft. It admits queue.city-building-module-entry-and-project-startup-authoring to add project overview startup controls, converge flexible startup paths, extract separate city/building module entry seams, and prove behavior through simulated-human acceptance.` |
| `target.script-editor-event-runtime-production-hardening` | `docs/blueprints/specs/2026-07-18-script-editor-event-runtime-production-hardening-target.md` | `docs/blueprints/plans/2026-07-18-script-editor-event-runtime-production-hardening-target-plan.md` | `Open successor event-runtime hardening version created on 2026-07-18 from the operator's production-readiness draft after source audit found old event-system residues and Liu Bang pack trigger/conditions data. It admits queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration to clean/guard old event residues, migrate Liu Bang to event-bindings.json, and prove Script Editor simulated-human authoring plus runtime triggering.` |
| `target.map-review-provider-boundary-extraction` | `docs/blueprints/specs/2026-07-18-map-review-provider-boundary-extraction-target.md` | `docs/blueprints/plans/2026-07-18-map-review-provider-boundary-extraction-target-plan.md` | `Open successor modularization version created on 2026-07-18 from MEMO-010 and operator-approved map/review boundary design. It admits queue.map-review-provider-boundary-extraction-and-acceptance to extract provider-backed map and in-game review module boundaries, inventory and remove old direct paths, and verify complete behavior across normal start, JSON import, and Script Editor runtime preview.` |
| `target.script-editor-event-binding-post-closeout-fixups` | `docs/blueprints/specs/2026-07-17-script-editor-event-binding-post-closeout-fixups-target.md` | `docs/blueprints/plans/2026-07-17-script-editor-event-binding-post-closeout-fixups-target-plan.md` | `Closed on 2026-07-18 after destination selector completion, destination content-entry correction, runtime preview-from-memory, save/export confusion fix, and final version closeout were recorded. Broader map/review provider-boundary work is routed to target.map-review-provider-boundary-extraction rather than this Script Editor fixup version.` |
| `target.script-editor-event-binding-runtime-replacement` | `docs/blueprints/specs/2026-07-16-script-editor-event-binding-runtime-replacement-target.md` | `docs/blueprints/plans/2026-07-16-script-editor-event-binding-runtime-replacement-target-plan.md` | `Closed on 2026-07-17 after explicit final closeout confirmation; the events.json/event-bindings.json split, script-editor double-table UI/import/export, built-in zhuyuanzhang event-binding migration, EventBindingRuntime cutover with sub-runtime handoff compatibility, old event runtime retirement, owner-local event binding authoring, condition editor completion, condition export lowering, TriggerContext entrypoint fail-closed guards, and event-body triggerTiming retirement are now historical evidence with no remaining lawful same-version candidate queue.` |
| `target.city-building-definition-location-access-convergence` | `docs/blueprints/specs/2026-07-16-city-building-definition-location-access-convergence-target.md` | `docs/blueprints/plans/2026-07-16-city-building-definition-location-access-convergence-target-plan.md` | `Closed on 2026-07-16 after explicit human closeout confirmation; city/building definition restructure, LocationAccessRuntime convergence, HouseRuntime adapter, status save/runtime, custom attribute authoring, export/import validation, map compatibility, city-mounted building/NPC authoring/export/runtime, and zhuyuanzhang template direct-load queues are now historical evidence with no remaining lawful same-version candidate queue.` |
| `target.script-editor-authoring-data-structure-unification` | `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md` | `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md` | `Closed on 2026-07-16 after explicit closeout continuation; package persistence, completion gating, field mapping, character/city/building/dialogue/story/event authoring data, typed conditions, launch policy, playable/minigame bindings, legacy supersession, and final end-to-end authoring/runtime validation queues are now historical evidence with no active same-version queue.` |
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
