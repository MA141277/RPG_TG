# Project Progress

## Control Block

- entry_id: `project-progress.replace-me`
- active_blueprint: `blueprint.replace-me`
- active_version: `target.replace-me`
- has_active_queue: `true | false`
- next_file: `docs/blueprints/blueprint.md`
- entry_action: `open-next-file`

## Human Context

### Source Of Truth

- Canonical resume chain:
  - `project-progress -> blueprint -> version plan -> active queue -> active task`
- Allowed `entry_action` values:
  - `open-next-file`
  - `stop`
  - `blocked`
- Historical-only sources:
  - `docs/change-log.md`
  - `docs/superpowers/**`
  - closed queue records

### Current Repository Entry

- Current Blueprint:
  - `docs/blueprints/blueprint.md`
- Current Version Spec:
  - `docs/blueprints/specs/...`
- Current Version Plan:
  - `docs/blueprints/plans/...`
- Current Active Queue:
  - `docs/blueprints/queues/... | none`

### Live Entry Guardrails

- `This file only states the current resume entry and downstream pointer set.`
- `Admission history, queue closeout history, and review narrative belong in the version plan, queue docs, or docs/change-log.md rather than here.`

### Historical References

- `docs/change-log.md`
- `current version plan ledgers`
