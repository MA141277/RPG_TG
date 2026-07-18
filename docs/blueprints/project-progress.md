# Project Progress

## Control Block

- entry_id: `project-progress.rpg-tg`
- active_blueprint: `blueprint.rpg-tg`
- active_version: `target.city-building-module-entry-and-project-startup-authoring`
- has_active_queue: `true`
- active_queue: `queue.city-building-module-entry-and-project-startup-authoring`
- active_task: `task.city-building-module-entry-and-project-startup-authoring.acceptance-and-guard`
- next_file: `docs/blueprints/queues/city-building-module-entry-and-project-startup-authoring-queue.md`
- entry_action: `open-next-file`

## Human Context

### Source Of Truth

- Canonical resume chain:
  - `project-progress -> blueprint -> version plan -> active queue -> active task`
- Historical-only sources:
  - `docs/change-log.md`
  - `docs/superpowers/**`
  - closed queue records

### Current Repository Entry

- Current Blueprint:
  - `docs/blueprints/blueprint.md`
- Current Version Spec:
  - `docs/blueprints/specs/2026-07-19-city-building-module-entry-and-project-startup-authoring-target.md`
- Current Version Plan:
  - `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`
- Current Active Queue:
  - `docs/blueprints/queues/city-building-module-entry-and-project-startup-authoring-queue.md`

### Live Entry Guardrails

- `This file only states the current resume entry and downstream pointer set.`
- `Admission history, queue closeout history, and review narrative must stay in the version plan, queue docs, or docs/change-log.md rather than living here as competing current-state prose.`
- `The pointed version is now the open city/building module entry and project startup authoring successor version created after the operator approved the 项目信息 startup authoring and city/building module draft.`
- `target.city-building-module-entry-and-project-startup-authoring is open with active queue queue.city-building-module-entry-and-project-startup-authoring. Active task is acceptance-and-guard; evidence-anchor reconcile, project-info-authoring, city-building-module-entry, and runtime-startup-convergence are complete.`
- `queue.city-building-module-entry-and-project-startup-authoring has been admitted under the successor version after the prior event-runtime/city-context work was pushed to origin/mod-first-dev.`
- `target.map-review-provider-boundary-extraction remains open with no active queue after its single queue closed; it was not reopened or modified as the active execution target for event-runtime hardening.`
- `target.script-editor-event-binding-post-closeout-fixups is closed and must not be reopened for map/review modularization work.`
- `queue.map-review-provider-boundary-extraction-and-acceptance is closed after residue-removal and acceptance-and-guard passed. target.map-review-provider-boundary-extraction remains open with no active queue and awaits same-version admission review or version closeout review.`
- `target.script-editor-event-binding-runtime-replacement remains done and must not be reopened for these fixups.`
- `queue.script-editor-event-destination-selector-completion is closed after guard review and queue closeout/handoff.`
- `queue.script-editor-event-destination-selector-family-coverage-correction is closed after guard review and queue closeout/handoff.`
- `queue.script-editor-event-destination-content-entry-family-correction is closed after guard review and queue closeout/handoff.`
- `queue.script-editor-runtime-preview-from-memory is closed after guard review and queue closeout/handoff.`
- `The latest governance action created target.script-editor-event-binding-runtime-replacement from docs/script-editor-event-trigger-binding-design.md after the previous city/building version had already closed.`
- `queue.old-event-runtime-retirement is complete; the operator then explicitly confirmed admission of queue.script-editor-event-binding-authoring-ui-completion.`
- `queue.event-binding-condition-export-lowering is closed after basic flag/variable EventBinding.conditions export lowering landed.`
- `queue.event-binding-trigger-context-entrypoint-completion is closed after TriggerContext entrypoint audit and export fail-closed guards landed.`
- `queue.script-editor-event-binding-owner-local-authoring-surfaces is closed after guard review and queue closeout.`
- `queue.script-editor-event-binding-condition-editor-completion is closed after final guard review, queue closeout/handoff, and the owner-local events tab selector closeout regression fix.`
- `queue.script-editor-event-body-trigger-field-retirement is closed after guard review and queue closeout/handoff.`
- `The destination content-entry family correction queue is done. Runtime preview-from-memory is done. The fixup version remains open with no active queue; do not enter version closeout, commit, push, merge, or admit another queue unless explicitly requested.`

### Historical References

- `docs/change-log.md` stores code and behavior change history only; it is not a default Blueprint search target or governance resume source.`
- `docs/blueprints/plans/2026-07-16-script-editor-event-binding-runtime-replacement-target-plan.md` stores the open event-binding runtime replacement version's candidate record, admission truth, routing truth, and future closeout truth.
- `docs/blueprints/queues/script-editor-event-binding-contract-loader-queue.md` stores the active contract/loader queue truth for EventBinding contracts, eventBindings manifest hydration, and registered extension-field boundaries.
- `docs/blueprints/queues/script-editor-event-binding-authoring-ui-queue.md` stores the closed script-editor authoring UI/model queue truth for project-level eventBindings and double-table visibility.
- `docs/blueprints/queues/script-editor-event-binding-export-convergence-queue.md` stores the active script-editor event binding export convergence queue truth for runtime-pack events.json/event-bindings.json split export.
- `docs/blueprints/queues/zhuyuanzhang-event-binding-pack-migration-queue.md` stores the active built-in zhuyuanzhang event binding pack migration queue truth.
- `docs/blueprints/queues/event-binding-runtime-convergence-queue.md` stores the active EventBindingRuntime convergence queue truth.
- `docs/blueprints/queues/old-event-runtime-retirement-queue.md` stores the active old event runtime retirement queue truth.
- `docs/blueprints/queues/script-editor-event-binding-authoring-ui-completion-queue.md` stores the required same-version candidate truth for full event binding authoring UI completion before version closeout.
- `docs/blueprints/queues/event-binding-condition-export-lowering-queue.md` stores the active condition export lowering queue truth for supported basic flag/variable EventBinding.conditions export.
- `docs/blueprints/queues/event-binding-trigger-context-entrypoint-completion-queue.md` stores the active TriggerContext entrypoint completion queue truth for supported EventBinding trigger action runtime entrypoints and fail-closed guards.
- `docs/blueprints/queues/script-editor-event-binding-owner-local-authoring-surfaces-queue.md` stores the active owner-local authoring surfaces queue truth for correcting event detail, dedicated event-bindings, and owner-local binding edit ownership.
- `docs/blueprints/queues/script-editor-event-body-trigger-field-retirement-queue.md` stores the active event-body triggerTiming retirement queue truth.
- `docs/blueprints/plans/2026-07-17-script-editor-event-binding-post-closeout-fixups-target-plan.md` stores the open post-closeout fixup version truth for destination selector completion and runtime preview from memory.
- `docs/blueprints/queues/script-editor-event-destination-selector-completion-queue.md` stores the active destination selector completion queue truth.
- `docs/blueprints/queues/script-editor-runtime-preview-from-memory-queue.md` stores the active runtime preview-from-memory queue truth.
- `docs/blueprints/queues/script-editor-event-destination-content-entry-family-correction-queue.md` stores the active destination content-entry family correction queue truth.
- `docs/blueprints/specs/2026-07-16-script-editor-event-binding-runtime-replacement-target.md` stores the target contract for events.json/event-bindings.json split, editor double-table support, built-in zhuyuanzhang migration, EventBindingRuntime cutover with sub-runtime handoff compatibility, and old event runtime retirement.
- `docs/blueprints/plans/2026-07-16-city-building-definition-location-access-convergence-target-plan.md` stores the closed city/building definition and LocationAccessRuntime convergence version's candidate record, admission truth, routing truth, and closeout truth.
- `docs/blueprints/queues/script-editor-city-building-definition-restructure-queue.md` stores the closed city/building definition restructure queue truth.
- `docs/blueprints/queues/location-access-runtime-convergence-queue.md` stores the closed LocationAccessRuntime convergence queue truth.
- `docs/blueprints/queues/script-editor-building-house-runtime-adapter-queue.md` stores the closed Building-to-HouseRuntime adapter queue truth.
- `docs/blueprints/queues/city-building-status-save-runtime-convergence-queue.md` stores the closed city/building status save/runtime queue truth.
- `docs/blueprints/queues/script-editor-city-building-custom-attribute-authoring-queue.md` stores the closed city/building custom-attribute authoring queue truth.
- `docs/blueprints/queues/script-editor-city-building-export-import-validation-queue.md` stores the closed city/building export/import validation queue truth.
- `docs/blueprints/queues/map-city-list-compatibility-preservation-queue.md` stores the closed map city-list compatibility preservation queue truth.
- `docs/blueprints/queues/script-editor-city-building-mount-npc-authoring-queue.md` stores the closed city-side building/NPC mounting authoring queue truth.
- `docs/blueprints/queues/script-editor-city-building-mount-export-runtime-convergence-queue.md` stores the closed city-mounted building/NPC export/runtime convergence queue truth.
- `docs/blueprints/queues/script-editor-zhuyuanzhang-template-direct-load-queue.md` stores the closed built-in zhuyuanzhang template direct-load queue truth.
- `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md` stores the closed authoring/data-structure unification version's activation truth, candidate record, promotion ledger, queue closeout history, and version closeout truth.
- `docs/blueprints/queues/script-editor-project-cache-save-export-preview-queue.md` stores the closed first project cache/save/export/preview execution truth.
- `docs/blueprints/queues/script-editor-project-cache-save-export-preview-continuation-queue.md` stores the closed continuation truth for durable save-location recording and stale continue gating.
- `docs/blueprints/queues/script-editor-durable-package-workflow-continuation-queue.md` stores the closed continuation truth for package skeleton/imported edit-in-place/runtime preview-from-disk semantics.
- `docs/blueprints/queues/script-editor-project-completion-state-gating-queue.md` stores the closed completion-state gating truth.
- `docs/blueprints/queues/script-editor-unified-field-mapping-table-freeze-queue.md` stores the closed unified field mapping table freeze truth.
- `docs/blueprints/queues/script-editor-character-definition-status-convergence-queue.md` stores the closed character definition/status convergence execution truth.
- `docs/blueprints/queues/script-editor-character-status-save-runtime-continuation-queue.md` stores the closed durable CharacterStatus save/runtime continuation truth.
- `docs/blueprints/queues/script-editor-character-authoring-surface-completion-queue.md` stores the closed creator-facing character authoring surface completion truth.
- `docs/blueprints/queues/script-editor-runtime-property-mutation-and-status-convergence-queue.md` stores the closed runtime property mutation and status convergence truth.
- `docs/blueprints/queues/script-editor-event-effect-activation-convergence-queue.md` stores the closed event effect activation convergence truth.
- `docs/blueprints/queues/script-editor-event-structure-convergence-queue.md` stores the closed event structure convergence baseline truth.
- `docs/blueprints/queues/script-editor-branching-event-task-chain-convergence-queue.md` stores the closed fail-closed node progression guard truth and same-family continuation routing.
- `docs/blueprints/version-memo.md` stores the current version's non-scheduling memo.
- `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md` stores the closed runtime-pack-unification version's admission history, candidate record, promotion ledger, and closeout truth.
- `docs/blueprints/queues/script-editor-scenario-profile-startup-export-convergence-queue.md` stores the closed scenarioProfile startup export convergence queue truth.
- `docs/blueprints/queues/script-editor-narrative-authoring-export-convergence-queue.md` stores the closed narrative authoring export convergence queue truth.
- `docs/blueprints/queues/script-editor-non-activities-runtime-family-export-convergence-queue.md` stores the closed non-activities runtime-family export convergence queue truth.
- `docs/blueprints/queues/script-editor-activities-authoring-export-convergence-queue.md` stores the closed activities authoring/export convergence queue truth.
- `docs/blueprints/queues/script-editor-compatibility-boundary-retirement-queue.md` stores the closed compatibility-boundary-retirement queue truth.
- `docs/blueprints/queues/script-editor-fixed-pack-consumer-deprivileging-queue.md` stores the closed fixed-pack-consumer-deprivileging queue truth.
- `docs/blueprints/queues/script-editor-base-pack-inheritance-governance-queue.md` stores the closed base-pack-inheritance-governance queue truth.
- `docs/blueprints/queues/script-editor-runtime-pack-export-unification-queue.md` stores the closed runtime-pack-export-unification queue truth.
- `docs/blueprints/queues/script-editor-runtime-family-authoring-convergence-queue.md` stores the closed runtime-family-authoring-convergence queue truth.
- `docs/blueprints/queues/script-editor-runtime-family-contract-alignment-queue.md` stores the closed runtime-family-contract queue truth.
- `docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md` and `docs/blueprints/queues/script-editor-prd-workbench-ui-visual-alignment-queue.md` now store closed historical truth for the predecessor version.
