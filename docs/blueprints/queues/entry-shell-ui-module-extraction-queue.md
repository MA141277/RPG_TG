# Entry Shell UI Module Extraction Queue

## Control Block

- queue_id: `queue.entry-shell-ui-module-extraction`
- belongs_to_version: `target.entry-shell-ui-module-extraction`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-19`
- governance_sync_source: `docs/blueprints/plans/2026-07-19-entry-shell-ui-module-extraction-target-plan.md`
- queue_status: `done`
- queue_class: `future-target-candidate`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `closed`
- closure_basis: `bounded entry-shell extraction, automation verification, and browser simulated-human evidence`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `pending`
- sync_scope: `local-record`
- sync_summary: `Implementation completed locally with focused test, typecheck, blueprint lint, browser simulated-human verification, and full npm test passing; queue closeout/handoff is complete and control returns to version review.`
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
  - `Extract startup/pre-game Entry Shell rendering from MainUiFlow behind a bounded module contract while preserving visible behavior and current startup semantics.`
- Forbidden expansions:
  - `Do not change game runtime startup/load semantics.`
  - `Do not extract in-game map, city, building, dialogue, review/council, or Script Editor workspace internals.`
  - `Do not change EventBindingRuntime semantics.`
  - `Do not introduce a new routing framework or move MainUiFlow state/persistence ownership.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `locked`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-ENTRY-SHELL-001`
  - `ACC-ENTRY-SHELL-002`
  - `ACC-ENTRY-SHELL-003`
  - `ACC-ENTRY-SHELL-004`
  - `ACC-ENTRY-SHELL-005`
- acceptance_not_claimed: []
- minimum_verification:
  - `npm run lint:blueprints`

### Claim Boundary

#### Can Claim

- `Startup/pre-game entry shell rendering is delegated through a bounded module contract.`
- `Main menu, JSON start selection, Script Editor entry, and character-selection entry visible behavior is preserved.`
- `MainUiFlow remains the state, handler, persistence, file-picker, and startup callback owner.`

#### Cannot Claim

- `Runtime startup/load semantics changes.`
- `In-game map, city, building, dialogue, review/council, or Script Editor workspace extraction.`
- `EventBindingRuntime behavior changes.`
- `A new global routing framework.`

#### Legacy Paths To Replace

- `Pre-game entry markup embedded directly in src/ui/main-ui/main-ui-flow.js.`
- `Action id definitions that are implicit in duplicated markup rather than protected by a narrow entry-shell contract.`

#### Compatibility Paths To Preserve

- `Existing MainUiFlow state and handler ownership.`
- `Existing start game, continue game, JSON start, Script Editor entry, and character-selection behavior.`
- `Existing JSON import diagnostics and file picker flow.`
- `Existing Script Editor workspace behavior after entry.`

#### Implementation Anchors

- Must inspect:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/**`
  - `tests/**`
- Must modify:
  - `src/ui/**`
  - `tests/**`
  - `docs/blueprints/**`
- Must preserve:
  - `Runtime startup/load semantics.`
  - `MainUiFlow orchestration responsibilities.`
  - `EventBindingRuntime semantics.`

#### Verification Coverage

- `Focused tests for entry-shell module contract and stable action ids.`
- `Source guard proving MainUiFlow delegates extracted startup/pre-game markup.`
- `Browser simulated-human smoke for start game, continue game, JSON start, Script Editor entry, and character selection where available.`
- `npm run typecheck`
- `npm run lint:blueprints`
- `npm test`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-19-entry-shell-ui-module-extraction-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-19-entry-shell-ui-module-extraction-target-plan.md`

### Queue Snapshot

- queue_goal: `Extract bounded startup/pre-game Entry Shell rendering from MainUiFlow while preserving behavior.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `none`
- task_briefs:
  - `task.entry-shell-ui-module-extraction.evidence-anchor-reconcile: Confirm current startup/pre-game render ownership, action ids, and split boundaries.`
  - `task.entry-shell-ui-module-extraction.implementation: Implement bounded Entry Shell extraction test-first.`
  - `task.entry-shell-ui-module-extraction.queue-closeout-and-handoff: Verify the queue and return to version review without version closeout.`

### Operator Snapshot Contract

- `The fixed operator receipt must source current queue from queue_id.`
- `The fixed operator receipt must source current task from active_task.`
- `The fixed operator receipt must source current queue goal from queue_goal.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.entry-shell-ui-module-extraction.evidence-anchor-reconcile` | `done` | `Confirm current startup/pre-game render ownership, action ids, and split boundaries.` | `none` | `Locked on 2026-07-19. Main menu, JSON start selection, Script Editor entry, and character-selection entry markup are embedded in MainUiFlow; handlers and state ownership also remain in MainUiFlow and must be preserved.` |
| `task.entry-shell-ui-module-extraction.implementation` | `done` | `Implement bounded Entry Shell extraction test-first.` | `task.entry-shell-ui-module-extraction.evidence-anchor-reconcile` | `Completed on 2026-07-19. RED source guard failed before src/ui/entry-shell/entry-shell-view.js existed; GREEN added the bounded Entry Shell module, delegated MainUiFlow pre-game rendering through it, preserved MainUiFlow orchestration ownership, and updated source/encoding guards for the moved Chinese UI copy.` |
| `task.entry-shell-ui-module-extraction.queue-closeout-and-handoff` | `done` | `Verify the queue and return to version review without version closeout.` | `task.entry-shell-ui-module-extraction.implementation` | `Completed on 2026-07-19 after focused verification, full test coverage, and browser simulated-human evidence across the entry shell surfaces.` |

### Task Definitions

#### `task.entry-shell-ui-module-extraction.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.entry-shell-ui-module-extraction.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/**`
  - `tests/**`
- must_inspect:
  - `current main menu render ownership`
  - `current JSON start selection render ownership`
  - `current Script Editor entry render ownership`
  - `current character-selection entry render ownership`
  - `stable action ids and handlers`
- must_not_change:
  - `Do not implement before evidence_lock_status is locked.`
  - `Do not widen into runtime startup semantics or in-game screen extraction.`
- done_when:
  - `Evidence Lock is locked or the queue is blocked with a concrete reason.`
  - `Implementation anchors and acceptance scope remain bounded to startup/pre-game Entry Shell rendering.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Return to version review or split a prerequisite queue.`
- promote_next_if_done: `task.entry-shell-ui-module-extraction.implementation`

##### Human Context

- task_brief:
  - `Confirm the Entry Shell extraction boundary before implementation.`
- task_outcome_summary:
  - `Evidence confirms MainUiFlow directly renders main menu, JSON scenario selection, Script Editor landing/entry, scenario pack cards, character selection, character shelf/card, and character detail markup. MainUiFlow also owns screen state, layout sync, file picker integration, persistence/startup callbacks, and action dispatch; implementation must preserve those orchestration responsibilities and extract only bounded startup/pre-game render markup behind an Entry Shell contract. Existing tests cover startup shell wiring in main.ts but do not cover an Entry Shell render contract or stable action id module.`

#### `task.entry-shell-ui-module-extraction.implementation`

##### Control Block

- task_id: `task.entry-shell-ui-module-extraction.implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/**`
  - `tests/**`
  - `docs/blueprints/**`
- must_inspect:
  - `evidence-anchor reconcile outcome`
  - `existing MainUiFlow render and handler structure`
  - `existing startup/pre-game tests`
- must_modify:
  - `tests/**`
  - `src/ui/**`
  - `docs/blueprints/**`
- must_preserve:
  - `Runtime startup/load semantics`
  - `MainUiFlow orchestration responsibilities`
  - `EventBindingRuntime semantics`
- must_not_change:
  - `in-game screen extraction`
  - `Script Editor workspace internals`
  - `runtime startup/load semantics`
- done_when:
  - `Focused tests fail before implementation and pass after implementation.`
  - `Entry Shell module owns the bounded startup/pre-game rendering surfaces.`
  - `Required verification passes.`
- verify_with:
  - `focused tests`
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- if_blocked:
  - `Record the blocker and do not claim coverage by narrowing away entry flows.`
- promote_next_if_done: `task.entry-shell-ui-module-extraction.queue-closeout-and-handoff`

##### Human Context

- task_brief:
  - `Implement bounded Entry Shell extraction test-first.`
- task_outcome_summary:
  - `RED: focused source guard failed because src/ui/entry-shell/entry-shell-view.js did not exist and MainUiFlow still owned the bounded pre-game rendering surfaces directly. GREEN: added src/ui/entry-shell/entry-shell-view.js with main menu, scenario select, Script Editor landing, scenario pack card, and character-select render contracts; MainUiFlow delegates those render surfaces while retaining screen state, handlers, persistence, file picker, and startup callback ownership. Verification passed: focused robustness test, npm run typecheck, npm run lint:blueprints, browser simulated-human smoke on localhost:5173, and npm test.`

#### `task.entry-shell-ui-module-extraction.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.entry-shell-ui-module-extraction.queue-closeout-and-handoff`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/queues/entry-shell-ui-module-extraction-queue.md`
  - `docs/blueprints/plans/2026-07-19-entry-shell-ui-module-extraction-target-plan.md`
  - `docs/blueprints/project-progress.md`
  - `tests/**`
- must_inspect:
  - `implementation task outcome`
  - `verification output`
  - `browser simulated-human evidence`
- must_not_change:
  - `version closeout`
  - `runtime semantics`
- done_when:
  - `Queue closeout records bounded Entry Shell extraction coverage or explicit blockers.`
  - `Blueprint lint passes.`
  - `Version review remains separate unless explicitly requested.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker in queue and version truth.`
- promote_next_if_done: `version-promotion-review`

##### Human Context

- task_brief:
  - `Verify the Entry Shell extraction slice and return to version review without automatic version closeout.`
- task_outcome_summary:
  - `Queue closed after guard review confirmed bounded startup/pre-game Entry Shell render ownership moved to src/ui/entry-shell/entry-shell-view.js, MainUiFlow still owns state/handlers/persistence/file picker/startup callbacks, runtime startup/load semantics were not changed, and EventBindingRuntime semantics were not changed. Browser simulated-human evidence on localhost:5173 verified the main menu, JSON 开局 scenario selection, Script Editor landing entry, and 开始游戏 -> character selection entry surfaces. Verification passed: npm run lint:blueprints.`
