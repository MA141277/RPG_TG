# Script Editor City Building Mount Export Runtime Convergence Queue

## Control Block

- queue_id: `queue.script-editor-city-building-mount-export-runtime-convergence`
- belongs_to_version: `target.city-building-definition-location-access-convergence`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-16`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `done`
- queue_class: `required`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `closed`
- closure_basis: `The script editor city-mounted building/NPC authoring data now lowers into runtime city, house, city-entry, and city-NPC-pool structures during scenario-pack export. When city.mountedBuildings exists, export no longer preserves imported template city-entries/city-npc-pools as the authoritative runtime relationship table for that authored city mounting surface.`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `success`
- sync_scope: `local-record`
- sync_summary: `Queue truth recorded locally after focused runtime export verification passed; no commit or push attempted.`
- blocked_by: []
- allowed_item_classifications:
  - `current-target-item`
- reject_item_classifications:
  - `content-pipeline-item`
  - `asset-pipeline-item`
  - `future-target-candidate`

## Human Context

### Queue Explanation

- Goal:
  - `Convert city-owned mountedBuildings authoring data into runtime cities, houses, city-entries, and city-npc-pools so exported scenario packs load the authored city/building/NPC relationships instead of stale imported template tables.`
- Forbidden expansions:
  - `Do not redesign the city/building authoring UI.`
  - `Do not change map coordinate ownership.`
  - `Do not add city-management, taxation, conquest, production, or building-upgrade gameplay loops.`
  - `Do not absorb unrelated template loading or LocationAccessRuntime business-line work.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-16-city-building-definition-location-access-convergence-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-16-city-building-definition-location-access-convergence-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/script-editor-city-building-mount-npc-authoring-queue.md`

### Queue Snapshot

- queue_goal: `Lower city-mounted building/NPC authoring data into runtime export structures.`
- task_count: `1`
- completed_task_count: `1`
- remaining_task_count: `0`
- active_task_summary: `Queue closed after mountedBuildings export/runtime lowering passed focused verification.`
- task_briefs:
  - `task.script-editor-city-building-mount-export-runtime-convergence.export-runtime-lowering: implement runtime export lowering for city-mounted buildings and NPCs over stale imported runtime tables.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-city-building-mount-export-runtime-convergence.export-runtime-lowering` | `completed` | `Implemented mountedBuildings export/runtime lowering with focused regression coverage.` | `queue.script-editor-city-building-mount-npc-authoring` | `Fixes the reported issue where exported city-entries.json still contained imported template records instead of authored city-mounted buildings.` |

### Task Definitions

#### `task.script-editor-city-building-mount-export-runtime-convergence.export-runtime-lowering`

##### Control Block

- task_id: `task.script-editor-city-building-mount-export-runtime-convergence.export-runtime-lowering`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/application/script-editor/city-building-runtime-materializer.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-city-building-mount-export-runtime-convergence-queue.md`
  - `docs/blueprints/plans/2026-07-16-city-building-definition-location-access-convergence-target-plan.md`
  - `docs/change-log.md`
- must_inspect:
  - `src/application/script-editor/city-building-runtime-materializer.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `script editor city/building authoring UI`
  - `map coordinate ownership`
  - `unrelated runtime families`
- done_when:
  - `Exported cities.json uses city.mountedBuildings as houseIds when present.`
  - `Exported houses.json assigns mounted buildings to the mounting city and carries mounted NPC ids plus primary NPC.`
  - `Exported city-entries.json is generated from mounted city/building relationships instead of stale imported template entries when mountedBuildings exists.`
  - `Exported city-npc-pools.json is generated from mounted NPC ids when mountedBuildings exists.`
- verify_with:
  - `npm run build:test`
  - `node --test --test-name-pattern "script editor runtime export materializes city mounted buildings" tests/robustness.test.cjs`
- if_blocked:
  - `Record the blocker in Progress Log and leave the queue active or blocked.`
- promote_next_if_done: `version-review`
- stop_if:
  - `The implementation requires unrelated template-entry or map-coordinate changes.`

##### Human Context

- task_brief:
  - `Make exported runtime city/building/NPC files reflect city-mounted authoring data.`
- task_outcome_summary:
  - `Completed. Runtime materialization now indexes city.mountedBuildings and uses it to derive city houseIds, house city ownership, house character/default NPC data, city entries, and city NPC pools.`
- Purpose:
  - `Ensure a script editor export is runnable with the authored city-mounted buildings and NPCs instead of retaining imported zhuyuanzhang/template runtime relationship tables.`
- Failure mode:
  - `If explicit imported runtime tables stay authoritative after mountedBuildings authoring, city-entries.json and city-npc-pools.json remain stale and the authored city mounting surface has no runtime effect.`

##### Progress Log

- `2026-07-16`: `Operator reported that exported packs did not reflect city-mounted buildings at runtime and city-entries.json still contained imported template content.`
- `2026-07-16`: `RED confirmed with node --test --test-name-pattern "script editor runtime export materializes city mounted buildings" tests/robustness.test.cjs: exported cities.json had houseIds=[] instead of the mounted building id.`
- `2026-07-16`: `Implemented mountedBuildings lowering in city-building-runtime-materializer for cities, houses, cityEntries, and cityNpcPools. Focused verification passed after npm run build:test.`
- `2026-07-16`: `Follow-up runtime activation regression fixed after operator reported exported city-entries.json was overwritten but runtime still showed default/template entries. Root cause was active content merging cityEntries by entry id, which preserved base entries for the same city when the scenario pack used different entry ids. Active content now replaces base city entries by cityId whenever the override pack supplies entries for that city.`
- `2026-07-16`: `Operator clarified that old house-id entry paths should be removed entirely and city building lists must come only from city-entries.json. The runtime city context and city presenter now derive visible buildings from cityEntries.targetHouseId, the city location deck emits only data-city-entry-id buttons, the data-house-id direct entry protocol was removed, and the regression fixture no longer uses default-pack-looking city ids.`
