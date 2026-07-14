# Script Editor Runtime Family Authoring Convergence Queue

## Control Block

- queue_id: `queue.script-editor-runtime-family-authoring-convergence`
- belongs_to_version: `target.script-editor-runtime-pack-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-14`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `done`
- queue_class: `required`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `open-residue`
- closure_basis: `The bounded authoring-convergence slice is complete: the queue verified current authoring/runtime parallel surfaces, wrote an explicit retirement map, and classified direct runtime-owned surfaces, export-deferred narrative/playable authoring surfaces, shared-rule compiler inputs, and compatibility residue without reopening export, inheritance, consumer, or compatibility implementation. Remaining work belongs to downstream export unification, base-pack inheritance governance, fixed-pack consumer deprivileging, and compatibility retirement queues rather than another same-family authoring-convergence task.`
- residue_remaining: `yes`
- residue_family: `cross-family`
- residue_routing_status: `needs-version-review`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `pending`
- sync_scope: `none`
- sync_summary: `Queue has been admitted but no repository sync batch has yet been recorded for the authoring-convergence queue.`
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
  - `Retire the long-lived authoring-only parallel families that still shadow the frozen runtime family contract so the script editor can converge on one runtime-owned authoring surface before export unification and base-pack inheritance governance proceed.`
- Forbidden expansions:
  - `Do not widen this queue into export unification, base-pack inheritance implementation, fixed-pack consumer rewiring, or compatibility-boundary retirement.`
  - `Do not reopen the frozen runtime-family contract or rewrite it under the guise of authoring cleanup.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`

### Queue Snapshot

- queue_goal: `Collapse transitional authoring-only runtime editor structures into the frozen runtime family ownership model without widening into export or consumer work.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `No active task remains; the bounded authoring-convergence slice is closed and returns control to version review for downstream runtime-pack-unification queue routing.`
- task_briefs:
  - `task.script-editor-runtime-family-authoring-convergence.boundary-baseline-reconcile: confirm the smallest lawful authoring-convergence slice from current repository evidence and identify the transitional structures that still shadow runtime ownership.`
  - `task.script-editor-runtime-family-authoring-convergence.authoring-parallel-structure-retirement-map: write the retirement map for authoring-only parallel families and classify what can be collapsed now versus what must wait for downstream queues.`
  - `task.script-editor-runtime-family-authoring-convergence.queue-closeout-and-handoff: verify the queue-local convergence slice, classify remaining residue, and hand control to the next lawful queue family.`

### Admission Preconditions

- `The runtime-family contract must already be frozen before this queue can become active.`
- `Single-active-queue mode remains in force; no second queue may be promoted while this queue is active.`
- `This queue must stay on authoring convergence and transitional-structure retirement rather than drifting into export or consumer implementation.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-runtime-family-authoring-convergence.boundary-baseline-reconcile` | `completed` | `Confirm the admitted authoring-convergence boundary and freeze the first lawful retirement slice from current repository truth.` | `none` | `Completed on 2026-07-14 after fresh repository evidence confirmed that authoring-only parallel families still shadow runtime ownership in src/domain/script-editor-project.ts, src/application/script-editor/runtime-pack-import.ts, src/application/script-editor/runtime-pack-export.ts, src/application/script-editor/workspace-shell.ts, and src/ui/main-ui/main-ui-flow.js. The smallest lawful next cut remains authoring convergence rather than export unification, base-pack inheritance, fixed-pack consumer deprivileging, or compatibility retirement.` |
| `task.script-editor-runtime-family-authoring-convergence.authoring-parallel-structure-retirement-map` | `completed` | `Map the authoring-only parallel structures that can be retired or collapsed after the baseline slice is frozen.` | `task.script-editor-runtime-family-authoring-convergence.boundary-baseline-reconcile` | `Completed on 2026-07-14 after the queue wrote the retirement map: direct runtime-owned families can collapse toward scenario-pack ownership, narrative/playable authoring families must lower into scenes/activities through downstream export work, shared-rule helper families remain compiler inputs only, and compatibility residue must stay migration evidence rather than daily authoring truth.` |
| `task.script-editor-runtime-family-authoring-convergence.queue-closeout-and-handoff` | `completed` | `Verify the queue-local convergence slice and return control to the version plan with explicit residue routing.` | `task.script-editor-runtime-family-authoring-convergence.authoring-parallel-structure-retirement-map` | `Completed on 2026-07-14 after verification passed, queue-local authoring-convergence residue was classified as cross-family, and control returned to version review with export unification as the next lawful downstream recommendation to inspect.` |

### Authoring Parallel Structure Retirement Map

| Authoring Surface | Runtime Family Owner | Queue Disposition | Downstream Boundary |
| --- | --- | --- | --- |
| `storyPack.scenarioProfile` | `scenarioProfile` | `collapse-now-contract` | `Keep as project metadata only while export/startup still use current bounded seams; no new project-only scenario-profile dialect is allowed.` |
| `people` | `characters` | `collapse-now-contract` | `Already exports directly to characters.json; later implementation may rename or adapter-collapse only under runtime-pack export unification.` |
| `cities` | `cities` | `collapse-now-contract` | `Already exports directly to cities.json; menu/access authoring must not become a separate city shadow family.` |
| `buildings` | `houses` | `collapse-now-contract` | `Already exports directly to houses.json; house entry binding remains part of house/runtime ownership rather than a private authoring family.` |
| `events` | `events` | `collapse-now-contract` | `Already exports directly to events.json; relation and destination helpers are authoring UI affordances, not standalone runtime families.` |
| `quests` | `tasks` | `collapse-now-contract` | `Tasks now lower through the shared-rule compiler; no separate long-lived quest runtime family may be introduced.` |
| `textEntries` | `textEntries` | `collapse-now-contract` | `Already exports directly to text-entries.json; dialogue text must lower into this family rather than a dialogue-private text store.` |
| `dialogues` | `scenes` + `textEntries` | `defer-to-export-unification` | `Must lower into formal scene/text-entry output; remains authoring-only until export unification owns the lowering contract.` |
| `storyNodes` | `events` + `scenes` + runtime config | `defer-to-export-unification` | `May organize authoring workflow, but must not become a runtime family or a startup-only reconstruction path.` |
| `minigames` | `activities` + owner bindings | `defer-to-export-unification` | `Must lower into formal activity/playable ownership or owner bindings; no new minigame runtime table is allowed in this version.` |
| `conditionGroups` | shared condition compiler inputs | `compiler-input-only` | `Remain reusable authoring inputs until lowered by owning runtime families; must not export as a scenario-pack family.` |
| `effectBundles` | shared effect compiler inputs | `compiler-input-only` | `Remain reusable authoring inputs until lowered by owning runtime families; must not export as a scenario-pack family.` |
| `storyPack.compatibilityImport.unresolvedFamilies` | migration evidence only | `retire-from-daily-authoring` | `Must block runtime export until resolved; compatibility retirement owns final migration-only enforcement after formal export exists.` |

### Task Definitions

#### `task.script-editor-runtime-family-authoring-convergence.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-runtime-family-authoring-convergence.boundary-baseline-reconcile`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-runtime-family-authoring-convergence-queue.md`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `docs/scenario-pack-unified-format.md`
- must_inspect:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `docs/scenario-pack-unified-format.md`
- must_not_change:
  - `frozen runtime-family contract`
  - `export-path implementation`
  - `consumer deprivileging implementation`
  - `compatibility retirement implementation`
- done_when:
  - `Queue-local truth names the smallest lawful first authoring-convergence slice inside the admitted queue.`
  - `Current repository evidence still supports retiring transitional authoring-only parallel families before export unification or base-pack inheritance work.`
  - `The first task step is explicit about what this queue decides directly and what remains routed to later queue families.`
- verify_with:
  - `rg -n "storyPack|people|cities|buildings|events|quests|dialogues|minigames|storyNodes|textEntries|compatibilityImport|unresolvedFamilies|basePackId" src/domain/script-editor-project.ts src/application/script-editor/runtime-pack-import.ts src/application/script-editor/runtime-pack-export.ts src/application/script-editor/workspace-shell.ts src/ui/main-ui/main-ui-flow.js docs/scenario-pack-unified-format.md`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening into another queue family silently.`
  - `Return control to version review only if fresh evidence disproves the admitted authoring-convergence basis.`
- promote_next_if_done: `task.script-editor-runtime-family-authoring-convergence.authoring-parallel-structure-retirement-map`
- stop_if:
  - `Fresh inspection proves the smallest remaining work belongs primarily to export unification, base-pack inheritance, fixed-pack consumer deprivileging, or compatibility retirement rather than this admitted queue.`

##### Human Context

- task_brief:
  - `Confirm the admitted authoring-convergence boundary and freeze the first retirement slice before any collapse map is written.`
- task_outcome_summary:
  - `Completed after fresh repository evidence confirmed that authoring-only parallel families still shadow runtime ownership and that the smallest lawful next cut remains authoring convergence rather than downstream implementation work.`
- Purpose:
  - `Prevent the newly admitted queue from drifting into export or consumer work before the bounded authoring-convergence slice is explicit.`
- Failure mode:
  - `Do not silently widen from authoring convergence into compatibility import policy, runtime export implementation, or editor workflow implementation.`

#### `task.script-editor-runtime-family-authoring-convergence.authoring-parallel-structure-retirement-map`

##### Control Block

- task_id: `task.script-editor-runtime-family-authoring-convergence.authoring-parallel-structure-retirement-map`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-runtime-family-authoring-convergence-queue.md`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/ui/main-ui/main-ui-flow.js`
- must_inspect:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/ui/main-ui/main-ui-flow.js`
- must_not_change:
  - `frozen runtime-family contract`
  - `export-path implementation`
  - `consumer deprivileging implementation`
  - `compatibility retirement implementation`
- done_when:
  - `The authoring-only parallel families that still shadow runtime ownership are mapped as explicit retirement candidates.`
  - `The queue distinguishes what can collapse now from what must wait for export unification or later consumer-routing work.`
  - `The map is written without inventing new editor-only families or queue-local fallback semantics.`
- verify_with:
  - `rg -n "storyPack|people|cities|buildings|events|quests|dialogues|minigames|storyNodes|textEntries|compatibilityImport|unresolvedFamilies|basePackId" src/domain/script-editor-project.ts src/application/script-editor/runtime-pack-import.ts src/application/script-editor/runtime-pack-export.ts src/application/script-editor/workspace-shell.ts src/ui/main-ui/main-ui-flow.js`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening into another queue family silently.`
  - `Do not move to export or consumer implementation just to force a retirement map.`
- promote_next_if_done: `task.script-editor-runtime-family-authoring-convergence.queue-closeout-and-handoff`

##### Human Context

- task_brief:
  - `Write the retirement map for authoring-only parallel families once the baseline slice is explicit.`
- task_outcome_summary:
  - `Completed after the queue wrote a retirement map that classifies direct runtime-owned authoring surfaces, export-deferred narrative/playable surfaces, shared-rule compiler inputs, and compatibility residue separately.`

#### `task.script-editor-runtime-family-authoring-convergence.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-runtime-family-authoring-convergence.queue-closeout-and-handoff`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-runtime-family-authoring-convergence-queue.md`
  - `docs/change-log.md`
- must_inspect:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-runtime-family-authoring-convergence-queue.md`
- must_not_change:
  - `version boundary without explicit residue evidence`
  - `new queue admission without written routing truth`
  - `repository sync truth before queue-local closeout truth is written`
- done_when:
  - `Queue truth, version truth, and project-progress truth are synchronized before control returns to version review.`
  - `Any same-family or cross-family residue is explicitly classified and routed.`
  - `Verification and queue-local handoff are written before any repository sync batch is recorded.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:plans`
- if_blocked:
  - `Record the blocker explicitly in this queue doc rather than silently keeping ambiguous active truth.`
  - `Do not claim closeout while bounded authoring convergence or residue routing still lacks written evidence.`
- promote_next_if_done: `return-to-version-review`

##### Human Context

- task_brief:
  - `Close the queue with explicit residue routing and hand control back to version review only after governance truth is synchronized.`
- task_outcome_summary:
  - `Completed after the queue-local convergence slice was verified, residue was classified as cross-family, and control returned to version review for downstream runtime-pack-unification routing.`
