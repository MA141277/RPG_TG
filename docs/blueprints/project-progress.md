# Project Progress

## Control Block

- entry_id: `project-progress.rpg-tg`
- active_blueprint: `blueprint.rpg-tg`
- active_version: `target.script-editor-runtime-pack-unification`
- has_active_queue: `true`
- next_file: `docs/blueprints/queues/script-editor-runtime-family-contract-alignment-queue.md`
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
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
- Current Version Plan:
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
- Current Active Queue:
  - `docs/blueprints/queues/script-editor-runtime-family-contract-alignment-queue.md`

### Live Entry Guardrails

- `This file only states the current resume entry and downstream pointer set.`
- `Admission history, queue closeout history, and review narrative must stay in the version plan, queue docs, or docs/change-log.md rather than living here as competing current-state prose.`
- `The pointed version is now the live successor runtime-pack-unification version and currently has one active queue, so resume must continue from the admitted queue doc rather than re-running version-level promotion review.`
- `The latest governance action both closes target.script-editor-prd-alignment as historical evidence and admits queue.script-editor-runtime-family-contract-alignment as the first active successor queue on top of the new runtime-pack-unification version.`

### Historical References

- `docs/change-log.md` stores the human-readable cross-session history.`
- `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md` stores the current runtime-pack-unification version's admission history, candidate record, and promotion ledger.
- `docs/blueprints/queues/script-editor-runtime-family-contract-alignment-queue.md` stores the current active runtime-family-contract queue truth.
- `docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md` and `docs/blueprints/queues/script-editor-prd-workbench-ui-visual-alignment-queue.md` now store closed historical truth for the predecessor version.
