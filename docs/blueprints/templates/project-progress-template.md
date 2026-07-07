# Project Progress

## Control Block

- entry_id: `project-progress.replace-me`
- active_blueprint: `blueprint.replace-me`
- active_target: `target.replace-me`
- has_active_queue: `true | false`
- next_file: `docs/blueprints/blueprint.md`
- entry_action: `open-next-file`

## Human Context

### Source Of Truth

- Canonical resume chain:
  - `project-progress -> blueprint -> target -> execution queue`
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
- Current Target:
  - `docs/blueprints/targets/...`
- Current Execution Queue:
  - `docs/blueprints/queues/... | none`

### Historical Snapshot (2000-01-01)

- `Replace with a short historical note when needed.`
