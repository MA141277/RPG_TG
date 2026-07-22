# Script Editor Character Definition Status Convergence Queue

## Control Block

- queue_id: `queue.script-editor-character-definition-status-convergence`
- belongs_to_version: `target.script-editor-authoring-data-structure-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-15`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `done`
- queue_class: `required`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `open-residue`
- closure_basis: `The bounded character definition/status slice landed and passed fresh verification. CharacterStatus materialization, editor person runtime CharacterDefinition import/export, and covered mutation patch outputs are complete; durable save-envelope aggregation and startup restore remain one unique same-family continuation.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `auto-routable`
- next_family_candidate: `queue.script-editor-character-status-save-runtime-continuation`
- auto_continue_eligible: `true`
- next_effect: `promote-next-queue`
- sync_status: `success`
- sync_scope: `branch-push`
- sync_summary: `Commit 9707412 was pushed to origin/mod-first-dev, carrying queue closeout, same-family residue routing, and continuation admission.`
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
  - `Converge script-editor character authoring records, runtime CharacterDefinition data, optional CharacterStatus save overlays, and covered runtime character reads/writes behind explicit selectors or materialized views.`
- Forbidden expansions:
  - `Do not migrate city, building, dialogue, story, event, condition, launch-policy, playable, or minigame families in this queue.`
  - `Do not redesign the script-editor visual layout or complete all character UI polish if that belongs to queue.script-editor-character-authoring-surface-completion.`
  - `Do not edit real save status from the normal authoring surface.`
  - `Do not change gameplay formulas except where a covered runtime consumer must read through a character selector or materialized view.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/script-editor-unified-field-mapping-table-freeze-queue.md`

### Queue Snapshot

- queue_goal: `Unify authored character definitions, runtime character views, and save-time CharacterStatus overlays without creating a second durable character truth.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Queue closed with same-family save/runtime residue routed to queue.script-editor-character-status-save-runtime-continuation.`
- task_briefs:
  - `task.script-editor-character-definition-status-convergence.boundary-baseline-reconcile: completed after current character schemas, old-shape adapters, save/status ownership, and direct mutation seams were reconciled.`
  - `task.script-editor-character-definition-status-convergence.character-definition-status-contract-implementation: completed after CharacterStatus overlay helpers, editor person runtime materialization, and covered mutation status patch outputs landed with tests.`
  - `task.script-editor-character-definition-status-convergence.queue-closeout-and-handoff: completed after fresh verification and unique same-family continuation routing.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 褰撳墠鎵ц闃熷垪 from queue_id.`
- `The fixed operator receipt must source 褰撳墠浠诲姟 from active_task.`
- `The fixed operator receipt must source 褰撳墠闃熷垪鐩爣 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded execution slice landed and verified.`
- `topic_closure_status = closed is legal only when no still-blocking same-family residue remains inside the queue's bounded topic surface.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`
- `If residue_family = same-family and one lawful continuation exists, name it in next_family_candidate and allow automatic continuation instead of returning to open-ended human queue selection.`

### Admission Preconditions

- `queue.script-editor-project-cache-save-export-preview, queue.script-editor-project-cache-save-export-preview-continuation, and queue.script-editor-durable-package-workflow-continuation closed with stable editable package persistence, save, export, import, and preview boundaries.`
- `queue.script-editor-project-completion-state-gating closed with durable draft/complete project truth and no same-family residue.`
- `queue.script-editor-unified-field-mapping-table-freeze closed with a bounded shared field-definition contract that later object-family queues can consume.`
- `The current version plan recommends queue.script-editor-character-definition-status-convergence as the next lawful queue because character data is the first object-family migration needed after field mapping.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-character-definition-status-convergence.boundary-baseline-reconcile` | `completed` | `Reconciled current character authoring, runtime definitions, save/status structures, selectors, materializers, and direct runtime consumers before implementation.` | `none` | `Completed on 2026-07-15 after source evidence identified the smallest lawful implementation slice.` |
| `task.script-editor-character-definition-status-convergence.character-definition-status-contract-implementation` | `completed` | `Implemented the bounded CharacterDefinition/CharacterStatus contract slice and tests chosen by baseline reconciliation.` | `task.script-editor-character-definition-status-convergence.boundary-baseline-reconcile` | `Completed on 2026-07-15 after typecheck and full tests passed.` |
| `task.script-editor-character-definition-status-convergence.queue-closeout-and-handoff` | `completed` | `Verified, classified residue, synchronized Blueprint truth, and routed the unique same-family continuation.` | `task.script-editor-character-definition-status-convergence.character-definition-status-contract-implementation` | `Completed on 2026-07-15 after fresh typecheck, 512 tests, Blueprint lint, plan lint, and governance check passed.` |

### Task Definitions

#### `task.script-editor-character-definition-status-convergence.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-character-definition-status-convergence.boundary-baseline-reconcile`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/domain/character.ts`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor`
  - `src/application/scenario-pack`
  - `src/domain/save`
  - `src/runtime`
  - `src/main.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-character-definition-status-convergence-queue.md`
- must_inspect:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
  - `docs/blueprints/specs/2026-07-14-script-editor-authoring-data-structure-unification-draft.md`
  - `src/domain/character.ts`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/person-authoring.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/field-mapping.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `city/building/dialogue/story/event/condition/playable data structures`
  - `normal authoring UI status-editing behavior`
  - `broad runtime gameplay formulas`
  - `full character authoring UI completion if it outgrows this convergence queue`
- done_when:
  - `Current authored people shape, runtime CharacterDefinition shape, import/export lowering, save/status ownership, and direct character consumer seams are identified.`
  - `The queue records whether the first implementation slice should define selectors/materializers only, migrate the durable character schema, or split authoring-surface work to queue.script-editor-character-authoring-surface-completion.`
  - `A bounded test-first implementation plan is recorded for absence of status, empty status, stat/skill patch overlay, mutation ownership, and any required old-shape migration behavior.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "CharacterDefinition|characterDefinitions|characters.json|people|CharacterStatus|characterStatus|SaveEnvelope|stats\\.|skills\\.|baseAttributes|profileMap|statMap|skillMap|customMap" src tests`
- if_blocked:
  - `Record the blocker in this queue doc and return to version review if a schema-reference queue must run before character convergence can lawfully continue.`
  - `Do not silently widen into city/building/narrative/event migration.`
- promote_next_if_done: `task.script-editor-character-definition-status-convergence.character-definition-status-contract-implementation`
- stop_if:
  - `Fresh evidence proves character convergence cannot start before schema-reference-and-migration-freeze.`
  - `Fresh evidence proves the smallest lawful next queue is only character authoring UI completion rather than definition/status convergence.`

##### Human Context

- task_brief:
  - `Reconcile character data ownership before changing the runtime or editor character contract.`
- task_outcome_summary:
  - `Completed with a bounded implementation boundary: add a character definition/status selector-materializer contract, materialize editor people into runtime CharacterDefinition shape for import/export, and cover a small set of shared mutation helpers without migrating every direct runtime consumer.`
- Purpose:
  - `Prevent the version from creating parallel authoring-only and runtime-only character truths while migrating character data.`
- Failure mode:
  - `A direct implementation could mutate authored character definitions during gameplay or bury compatibility-only lowering as final behavior.`

##### Progress Log

- `2026-07-15`: `Queue admitted from version promotion review after the field mapping contract freeze closed and routed field-mapping consumption to later object-family queues. Baseline reconciliation is now the active task.`
- `2026-07-15`: `Inspected target/draft specs, src/domain/character.ts, src/domain/script-editor-project.ts, src/application/script-editor/person-authoring.ts, runtime-pack import/export, field-mapping, SaveEnvelope/CoreGameState, AppState/startup wiring, effect-applier, grain-shop mutations, and existing robustness tests. Current durable editor people records are imported from pack.characters and exported back to characters.json mostly unchanged; person-authoring stores runtime-only leaves such as stats, skills, stamina, age, birthYear, and clanId through extendedAttributes; runtime CharacterDefinition still requires fixed stats/skills/stamina fields; no CharacterStatus or characterStatusById save overlay exists yet; runtime mutations currently clone and mutate CharacterDefinition arrays directly.`
- `2026-07-15`: `Chose the smallest lawful implementation slice: create a shared CharacterStatus overlay contract plus selector/materializer helpers, use it to prove absence-of-status and empty-status behavior, stat/skill/stamina patch overlays, and legacy/editor people materialization into runtime CharacterDefinition shape. First covered mutation ownership should start with reusable helpers used by effect-applier, player-stamina, and grain-shop style stat/skill/stamina changes; broad house/playable consumer migration and full character authoring UI completion remain out of this task unless the implementation stays bounded.`

#### `task.script-editor-character-definition-status-convergence.character-definition-status-contract-implementation`

##### Control Block

- task_id: `task.script-editor-character-definition-status-convergence.character-definition-status-contract-implementation`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/domain/character.ts`
  - `src/application/character`
  - `src/application/script-editor/person-authoring.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/effects/effect-applier.ts`
  - `src/application/player/player-stamina.ts`
  - `src/application/grain-shop/grain-shop-mutations.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-character-definition-status-convergence-queue.md`
- must_inspect:
  - `Boundary baseline evidence from the active task.`
- must_not_change:
  - `unreconciled object-family schemas`
  - `broad visual redesign`
  - `gameplay formula changes unrelated to selector/materializer consumption`
- done_when:
  - `A CharacterStatus overlay type and shared selector/materializer helpers exist for covered stat, skill, stamina, and profile patch fields.`
  - `New games can materialize character views without any status object and with an empty status object.`
  - `Covered save/restore-style status patches overlay authored definitions for stat, skill, and stamina fields without mutating the input definition.`
  - `Script-editor imported people can be normalized/materialized into runtime CharacterDefinition shape for characters.json validation/export instead of relying on ad hoc extendedAttributes only.`
  - `Covered shared runtime mutations use the status-aware helper seam or explicitly record why migration must continue in a later same-family task.`
- verify_with:
  - `npm run typecheck`
  - `npm run test`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker in this queue doc and return to version review if the implementation requires a prior schema-reference queue.`
- promote_next_if_done: `task.script-editor-character-definition-status-convergence.queue-closeout-and-handoff`
- stop_if:
  - `Implementation scope requires full city/building/narrative/event migration.`

##### Human Context

- task_brief:
  - `Implement the bounded character definition/status convergence slice chosen by baseline reconciliation.`
- task_outcome_summary:
  - `Completed with CharacterStatus overlay/materializer helpers, editor person runtime CharacterDefinition materialization for import/export, and covered stamina/gold/arithmetic mutation helpers emitting status patches while preserving materialized compatibility output.`
- Purpose:
  - `Move character reads and runtime mutations toward explicit definition plus status-overlay ownership.`
- Failure mode:
  - `Implementing before baseline could either be too narrow to prove status ownership or too broad to remain a bounded queue.`

##### Progress Log

- `2026-07-15`: `Added src/application/character/character-status.ts with CharacterStatus, CharacterStatusById, materializeCharacterDefinition, materializeCharacterDefinitions, and mergeCharacterStatusById. Added editor person runtime materialization so minimal script-editor people export to characters.json with required CharacterDefinition fields, defaults, stats, skills, stamina, and availableFunctions. Runtime pack import now normalizes imported characters through person-authoring helpers. Covered player stamina, grain-shop gold, and grain-shop arithmetic mutations now expose CharacterStatus patches while preserving existing characterDefinitions materialized output for compatibility.`
- `2026-07-15`: `Verified RED/GREEN target tests for runtime export character shape, CharacterStatus overlay materialization, and shared mutation status patches; then ran npm run typecheck and npm run test with 512 passing tests.`

#### `task.script-editor-character-definition-status-convergence.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-character-definition-status-convergence.queue-closeout-and-handoff`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-character-definition-status-convergence-queue.md`
  - `docs/change-log.md`
- must_inspect:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-character-definition-status-convergence-queue.md`
- must_not_change:
  - `version closeout without explicit human confirmation`
  - `new queue admission without written routing truth`
  - `repository sync truth before queue-local closeout truth is written`
- done_when:
  - `Queue truth, version truth, and project-progress truth are synchronized before control returns to version review or a lawful continuation.`
  - `Any same-family or cross-family residue is explicitly classified and routed.`
  - `Verification and queue-local handoff are written before any repository sync batch is recorded.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:plans`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record execution blockers in this queue doc and do not mark queue_status done.`
- promote_next_if_done: `return-to-version-review`
- stop_if:
  - `Character definition/status convergence acceptance has not been verified or explicitly blocked.`

##### Human Context

- task_brief:
  - `Close or route the character definition/status convergence queue after verified implementation.`
- task_outcome_summary:
  - `Completed with same-family residue: durable CharacterStatus save-envelope aggregation and startup restore are routed to queue.script-editor-character-status-save-runtime-continuation; full character authoring UI remains a separate candidate.`
- Purpose:
  - `Keep version scheduling honest after the bounded character convergence slice lands.`
- Failure mode:
  - `Closing without residue classification could hide remaining character authoring UI or schema migration work.`

##### Progress Log

- `2026-07-15`: `Fresh closeout verification passed with npm run typecheck, npm run test (512 pass, 0 fail), npm run lint:blueprints, npm run lint:plans, and npm run blueprint:governance:check. Classified residue as same-family because CharacterStatus patches are not yet aggregated into canonical save state or restored at startup. Routed the unique continuation to queue.script-editor-character-status-save-runtime-continuation; kept full creator-facing character controls in queue.script-editor-character-authoring-surface-completion.`

### Historical Handoff Note

- Task ID:
  - `none`
- Recorded handoff at closure:
  - `Closed the bounded definition/materializer slice and promoted queue.script-editor-character-status-save-runtime-continuation for durable status save/restore.`
- Recorded expected output:
  - `A bounded CharacterDefinition/CharacterStatus convergence slice that later authoring and runtime queues can consume.`

### Historical Candidate Notes

- `queue.script-editor-character-authoring-surface-completion`
  - State:
    - `candidate`
  - Reason:
    - `If baseline reconciliation proves full creator-facing character controls are larger than the definition/status contract slice, UI/control completion remains a separate same-version queue candidate.`
