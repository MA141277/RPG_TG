# Script Editor City Mounted NPC Canonical Authoring Cleanup Queue

## Control Block

- queue_id: `queue.script-editor-city-mounted-npc-canonical-authoring-cleanup`
- belongs_to_version: `target.city-building-module-entry-and-project-startup-authoring`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-20`
- governance_sync_source: `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`
- queue_status: `done`
- queue_class: `required-priority`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `closed`
- closure_basis: `Standard runtime-pack import no longer manufactures city.mountedBuildings from cityEntries, houses.characterIds, or cityNpcPools; mounted NPC export now fails closed on missing project people references; old reverse-inference helper names are absent from production source; automated verification passed.`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `success`
- sync_scope: `local-record`
- sync_summary: `Queue closeout recorded locally after verification passed; no commit or push attempted.`
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
  - `Make city.mountedBuildings the single canonical Script Editor authoring source for city-mounted building/NPC assignment, remove standard-flow runtime-family reverse inference, and verify empty NPC plus empty primary-NPC cases.`
- Admission basis:
  - `MEMO-020 was promoted into the current version plan as a recorded-only queue-candidate on 2026-07-20.`
  - `The current version has no active queue and the operator explicitly requested candidate filtering and continuation.`
- Forbidden expansions:
  - `Do not enter version closeout.`
  - `Do not change EventBindingRuntime or LocationAccessRuntime semantics.`
  - `Do not redesign unrelated Script Editor city/building authoring surfaces.`
  - `Do not use runtime cityEntries, houses.characterIds, or cityNpcPools as canonical editor truth for mounted building/NPC assignment.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-CITY-MOUNTED-NPC-CANONICAL-001`
  - `ACC-CITY-MOUNTED-NPC-CANONICAL-002`
  - `ACC-CITY-MOUNTED-NPC-CANONICAL-003`
  - `ACC-CITY-MOUNTED-NPC-CANONICAL-004`
  - `ACC-CITY-MOUNTED-NPC-CANONICAL-005`
  - `ACC-CITY-MOUNTED-NPC-CANONICAL-006`
  - `ACC-CITY-MOUNTED-NPC-CANONICAL-007`
  - `ACC-CITY-MOUNTED-NPC-CANONICAL-008`
  - `ACC-CITY-MOUNTED-NPC-CANONICAL-009`
- acceptance_not_claimed: []
- minimum_verification:
  - `npm run lint:blueprints`

### Claim Boundary

#### Can Claim

- `ACC-CITY-MOUNTED-NPC-CANONICAL-001: The Script Editor city mounted-building/NPC panel displays rows from city.mountedBuildings rather than runtime cityNpcPools.`
- `ACC-CITY-MOUNTED-NPC-CANONICAL-002: Existing city.mountedBuildings[].npcIds values render as selected NPC rows.`
- `ACC-CITY-MOUNTED-NPC-CANONICAL-003: Matching cityNpcPools residents alone do not create extra standard authoring rows.`
- `ACC-CITY-MOUNTED-NPC-CANONICAL-004: Adding and removing NPC rows updates only the selected city's mountedBuildings data.`
- `ACC-CITY-MOUNTED-NPC-CANONICAL-005: A mounted building with npcIds: [] remains visible and survives save/load.`
- `ACC-CITY-MOUNTED-NPC-CANONICAL-006: A mounted building with primaryNpcId: null remains valid and survives save/load.`
- `ACC-CITY-MOUNTED-NPC-CANONICAL-007: Primary NPC selection is constrained to the same row's npcIds, with out-of-row values cleared or failed closed with diagnostics.`
- `ACC-CITY-MOUNTED-NPC-CANONICAL-008: Runtime export from canonical mounted authoring produces coherent houses.characterIds, houses.defaultCharacterId, cityEntries, and cityNpcPools.`
- `ACC-CITY-MOUNTED-NPC-CANONICAL-009: Standard runtime-pack import preserves explicit cities[].mountedBuildings and does not manufacture canonical mounted-authoring truth from cityEntries, houses.characterIds, or cityNpcPools.`

#### Cannot Claim

- `Version closeout.`
- `EventBindingRuntime or LocationAccessRuntime behavior changes.`
- `City-management, taxation, conquest, production, or building-upgrade gameplay loops.`
- `A broad runtime-pack compatibility policy rewrite outside mounted building/NPC authoring.`

#### Legacy Paths To Replace

- `applyImportedMountedBuildings-style reverse inference from cityEntries, houses.characterIds, or cityNpcPools in the standard editor flow.`
- `readImportedMountedNpcIds-style NPC row population from cityNpcPools as canonical authoring state.`
- `readImportedPrimaryNpcId-style primary NPC inference from runtime residents as canonical editor state.`

#### Compatibility Paths To Preserve

- `Explicit city.mountedBuildings authoring data.`
- `Runtime cityNpcPools as an export/runtime family, not an editor canonical source.`
- `Existing city/building module entry contracts.`
- `Existing EventBindingRuntime and LocationAccessRuntime semantics.`

#### Implementation Anchors

- Must inspect:
  - `docs/blueprints/version-memo.md`
  - `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/application/script-editor/city-building-runtime-materializer.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/domain/script-editor-project.ts`
  - `tests/city-building-mount-authoring.test.cjs`
  - `tests/robustness.test.cjs`
- Must modify:
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `tests/city-building-mount-authoring.test.cjs`
  - `tests/robustness.test.cjs`
- Must preserve:
  - `CityModule and BuildingModule entry contracts.`
  - `Runtime export lowering from explicit city.mountedBuildings.`
  - `Current save/load behavior for explicit mountedBuildings data unless evidence proves it is invalid.`

#### Verification Coverage

- `Focused source/UI tests proving the mounted-building/NPC panel reads from city.mountedBuildings and not cityNpcPools.`
- `Save/load tests for mounted buildings with no NPC and no primary NPC.`
- `Validation/export tests for missing NPC ids and primary NPC ids outside the row's npcIds.`
- `Runtime export tests proving canonical mounted authoring lowers into houses, cityEntries, and cityNpcPools.`
- `Import tests proving explicit cities[].mountedBuildings is preserved and runtime-family reverse inference is not used as canonical authoring truth.`
- `Source-search evidence for retired reverse-inference helpers or their removal from standard editor flow.`
- `npm run typecheck`
- `npm run lint:blueprints`
- `npm test`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-19-city-building-module-entry-and-project-startup-authoring-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`

### Queue Snapshot

- queue_goal: `Make city.mountedBuildings the canonical mounted building/NPC authoring source and remove runtime-family reverse inference from the standard editor flow.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `No active task remains; the queue closed after canonical mounted authoring import/export cleanup and verification.`
- task_briefs:
  - `task.script-editor-city-mounted-npc-canonical-authoring-cleanup.evidence-anchor-reconcile: Confirm source evidence, claim boundary, and whether import compatibility must split before implementation.`
  - `task.script-editor-city-mounted-npc-canonical-authoring-cleanup.implementation: Implement the locked canonical authoring cleanup with focused tests.`
  - `task.script-editor-city-mounted-npc-canonical-authoring-cleanup.queue-closeout-and-handoff: Verify the queue, classify residue, and return control to version review.`

### Operator Snapshot Contract

- `The fixed operator receipt must source current queue from queue_id.`
- `The fixed operator receipt must source current task from active_task.`
- `The fixed operator receipt must source current queue goal from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded execution slice landed and verified.`
- `topic_closure_status = closed is legal only when no still-blocking same-family residue remains inside the queue's bounded topic surface.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`

### Admission Preconditions

- `The current version plan records MEMO-020 as a queue-candidate.`
- `The current version had no active queue before admission.`
- `The operator explicitly requested candidate filtering and continuation.`
- `Version-plan admission fields were synchronized before this queue doc became active truth.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, record local repository sync state.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Default Blueprint governance/documentation refinement uses local-record during execution and one branch-commit at queue closeout.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Activation Order

1. `Version plan review subject and basis were written first.`
2. `Version-level admission review selected the recorded MEMO-020 candidate.`
3. `This queue doc was created and synchronized as the queue-level governor.`
4. `Only then may active_task be exposed and implementation begin.`

### Recovery Rule

- `Resume from this queue doc and the version-plan admission record unless new material evidence invalidates the admitted basis.`
- `Do not start implementation before evidence-anchor-reconcile records locked source evidence.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-city-mounted-npc-canonical-authoring-cleanup.evidence-anchor-reconcile` | `done` | `Confirmed source evidence, claim boundary, split risk, and minimum verification before implementation.` | `none` | `Completed after source review showed standard runtime-pack import was still manufacturing mountedBuildings from runtime families.` |
| `task.script-editor-city-mounted-npc-canonical-authoring-cleanup.implementation` | `done` | `Implemented the locked canonical authoring cleanup with focused tests.` | `task.script-editor-city-mounted-npc-canonical-authoring-cleanup.evidence-anchor-reconcile` | `Standard runtime-pack import no longer infers mountedBuildings from runtime families, and export now fails closed on missing mounted NPC references.` |
| `task.script-editor-city-mounted-npc-canonical-authoring-cleanup.queue-closeout-and-handoff` | `done` | `Verified the queue, classified residue, and returned control to version review.` | `task.script-editor-city-mounted-npc-canonical-authoring-cleanup.implementation` | `No same-family residue remains inside this queue's bounded topic; version remains open without closeout.` |

### Task Definitions

#### `task.script-editor-city-mounted-npc-canonical-authoring-cleanup.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.script-editor-city-mounted-npc-canonical-authoring-cleanup.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/version-memo.md`
  - `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/application/script-editor/city-building-runtime-materializer.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/domain/script-editor-project.ts`
  - `tests/city-building-mount-authoring.test.cjs`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `version candidate evidence matrix`
  - `MEMO-020 acceptance criteria`
  - `mountedBuildings normalization helpers`
  - `runtime-pack import mounted-building compatibility paths`
  - `runtime export lowering paths`
  - `city mounted-building UI rendering and action handlers`
  - `existing focused mounted-building/NPC tests`
- must_not_change:
  - `production code before evidence_lock_status is locked`
  - `EventBindingRuntime or LocationAccessRuntime semantics`
  - `version_status or version closeout truth`
  - `unrelated city/building authoring UI`
- done_when:
  - `Evidence Lock is locked or the queue is blocked with a concrete reason.`
  - `Can Claim and Cannot Claim are reconciled against source evidence.`
  - `Must inspect, must modify, must replace, must preserve, and minimum verification are concrete.`
  - `Split risk is decided for runtime-pack import compatibility versus standard project authoring canonicalization.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "applyImportedMountedBuildings|readImportedMountedNpcIds|readImportedPrimaryNpcId|mountedBuildings|cityNpcPools|primaryNpcId|characterIds|cityEntries" src tests docs/blueprints/version-memo.md`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening scope silently.`
  - `Return to version review if fresh evidence proves a different prerequisite queue must run first.`
- promote_next_if_done: `task.script-editor-city-mounted-npc-canonical-authoring-cleanup.implementation`
- stop_if:
  - `Fresh evidence proves import compatibility and standard authoring canonicalization require separate queues before implementation.`

##### Human Context

- task_brief:
  - `Lock source-backed evidence before changing mounted-building/NPC authoring behavior.`
- task_outcome_summary:
  - `Completed. Standard runtime-pack import no longer infers mountedBuildings from runtime families, and export now fails closed on missing mounted NPC references.`
- Purpose:
  - `Prevent the queue from confusing runtime compatibility tables with the canonical Script Editor authoring model.`
- Failure mode:
  - `Starting from MEMO text alone could remove useful compatibility import behavior or keep reverse-inference paths reachable as standard authoring truth.`

##### Progress Log

- `2026-07-20`: `Queue admitted from the current version plan after candidate filtering found no active queue and one remaining recorded-only candidate. Evidence-anchor-reconcile completed and implementation moved forward after source evidence confirmed the reverse-inference removal boundary.`

#### `task.script-editor-city-mounted-npc-canonical-authoring-cleanup.implementation`

##### Control Block

- task_id: `task.script-editor-city-mounted-npc-canonical-authoring-cleanup.implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `tests/city-building-mount-authoring.test.cjs`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `Evidence lock from task.script-editor-city-mounted-npc-canonical-authoring-cleanup.evidence-anchor-reconcile.`
- must_not_change:
  - `production behavior outside the locked implementation anchors`
  - `EventBindingRuntime or LocationAccessRuntime semantics`
  - `version closeout truth`
- done_when:
  - `Focused tests prove city.mountedBuildings remains the standard authoring source.`
  - `Focused tests prove empty npcIds and null primaryNpcId persist.`
  - `Focused tests prove reverse-inference runtime families do not create standard mounted authoring truth.`
  - `Export/validation behavior is coherent for missing NPC ids and out-of-row primaryNpcId values.`
- verify_with:
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- if_blocked:
  - `Record the blocker and return to version review if the selected implementation slice requires a different prerequisite queue.`
- promote_next_if_done: `task.script-editor-city-mounted-npc-canonical-authoring-cleanup.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires broad compatibility policy rewrite or unrelated runtime semantics changes.`

##### Human Context

- task_brief:
  - `Implement the mounted-building/NPC canonical authoring cleanup after the evidence lock is written.`
- task_outcome_summary:
  - `Completed. Standard runtime-pack import no longer manufactures mountedBuildings from runtime families, and runtime export fails closed on missing mounted NPC references.`
- Purpose:
  - `Make the Script Editor mounted-building/NPC panel and import/export behavior use a single explicit authoring source.`
- Failure mode:
  - `Keeping cityNpcPools-driven rows in the standard editor flow would let imported runtime residue masquerade as authoring data.`

##### Progress Log

- `2026-07-20`: `RED verified reverse-inference still populated cities[0].mountedBuildings from runtime families; GREEN removed the standard import helper path. RED verified missing mounted NPC ids exported silently; GREEN added mounted NPC export diagnostics. Focused tests and full verification passed.`

#### `task.script-editor-city-mounted-npc-canonical-authoring-cleanup.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-city-mounted-npc-canonical-authoring-cleanup.queue-closeout-and-handoff`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/queues/script-editor-city-mounted-npc-canonical-authoring-cleanup-queue.md`
  - `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`
  - `docs/blueprints/project-progress.md`
  - `docs/change-log.md`
- must_inspect:
  - `Implementation result from task.script-editor-city-mounted-npc-canonical-authoring-cleanup.implementation.`
  - `Version plan closure routing rules.`
- must_not_change:
  - `version_status without explicit version-level closeout confirmation`
  - `candidate queue ordering unrelated to this queue's residue`
- done_when:
  - `The queue implementation result is verified or honestly blocked.`
  - `Queue closeout classifies residue and names any next same-family candidate if still required.`
  - `Version plan and project-progress pointers are synchronized to the next lawful state.`
  - `Repository sync is attempted or explicitly recorded according to queue sync policy.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker in Progress Log and leave the queue active or blocked according to the queue closeout judgement rule.`
- promote_next_if_done: `version-review`
- stop_if:
  - `Closeout would infer full version completion without explicit version-level acceptance.`

##### Human Context

- task_brief:
  - `Close or route the mounted NPC canonical authoring cleanup queue after verified implementation.`
- task_outcome_summary:
  - `Completed. The queue closed locally with no same-family residue and returned the active version to promotion-review.`
- Purpose:
  - `Return control to version review without hiding import/export compatibility residue.`
- Failure mode:
  - `Closing without residue classification would make runtime compatibility cleanup look complete by implication.`

##### Progress Log

- `2026-07-20`: `Closed locally with residue_remaining=no after source search found applyImportedMountedBuildings/readImportedMountedNpcIds/readImportedPrimaryNpcId only in governance docs, and verification passed: npm run lint:blueprints, npm run typecheck, focused mounted tests, npm test, npm run lint:encoding, and npm run build.`
