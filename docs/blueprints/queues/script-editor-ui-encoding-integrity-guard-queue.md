# Script Editor UI Encoding Integrity Guard Queue

## Control Block

- queue_id: `queue.script-editor-ui-encoding-integrity-guard`
- belongs_to_version: `target.city-building-module-entry-and-project-startup-authoring`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-19`
- governance_sync_source: `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`
- queue_status: `active`
- queue_class: `future-target-candidate`
- active_task: `task.script-editor-ui-encoding-integrity-guard.queue-closeout-and-handoff`
- next_task: `version-promotion-review`
- closeout_status: `pending`
- execution_closeout_status: `done`
- topic_closure_status: `open-residue`
- closure_basis: `none`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `none`
- sync_status: `pending`
- sync_scope: `local-record`
- sync_summary: `Encoding guard implementation is local and verified; repository sync is pending queue closeout.`
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
  - `Prevent future mojibake or invalid-JS encoding corruption in critical Script Editor and main UI source files, with automated source guards and browser smoke evidence for rendered Chinese UI surfaces.`
- Forbidden expansions:
  - `Do not perform a repo-wide charset migration unless evidence-anchor reconcile proves the bounded guard cannot work.`
  - `Do not redesign Script Editor UX or gameplay runtime behavior.`
  - `Do not change EventBindingRuntime semantics.`
  - `Do not use this queue to repair unrelated content or asset data.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `locked`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-ENCODING-GUARD-001`
  - `ACC-ENCODING-GUARD-002`
  - `ACC-ENCODING-GUARD-003`
  - `ACC-ENCODING-GUARD-004`
  - `ACC-ENCODING-GUARD-005`
- acceptance_not_claimed: []
- minimum_verification:
  - `npm run lint:blueprints`

### Claim Boundary

#### Can Claim

- `Critical Script Editor and main UI source files have automated checks for invalid JavaScript syntax caused by encoding damage.`
- `Critical Chinese UI strings have source-level or rendered-browser smoke coverage sufficient to catch mojibake regressions in the covered surfaces.`
- `The tested Script Editor landing/workspace surfaces render expected Chinese copy without mojibake in the browser smoke path.`

#### Cannot Claim

- `A full repository charset migration.`
- `Coverage for every Chinese string in every source file.`
- `Gameplay/runtime behavior changes.`
- `EventBindingRuntime changes.`

#### Legacy Paths To Replace

- `Manual source edits that can silently introduce mojibake in critical Script Editor UI files.`
- `Tests that pass logic while rendered Chinese UI text is corrupted.`
- `Encoding damage that only surfaces as Vite import-analysis parse failures after the browser loads.`

#### Compatibility Paths To Preserve

- `Normal UTF-8 Chinese UI source text.`
- `Existing Script Editor navigation and authoring behavior.`
- `Existing robustness tests and browser smoke paths.`
- `Existing runtime semantics.`

#### Implementation Anchors

- Must inspect:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/script-editor/script-editor-workspace-view.ts`
  - `tests/robustness.test.cjs`
  - `package.json`
  - `tools/**`
- Must modify:
  - `tests/**`
  - `tools/**`
  - `package.json`
  - `docs/blueprints/**`
- Must preserve:
  - `Script Editor runtime/export behavior.`
  - `EventBindingRuntime semantics.`
  - `Existing lint/test commands.`

#### Verification Coverage

- `Focused encoding/source integrity tests.`
- `Browser smoke test for critical Script Editor Chinese UI surfaces.`
- `npm run typecheck`
- `npm run lint:blueprints`
- `npm test`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-19-city-building-module-entry-and-project-startup-authoring-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`

### Queue Snapshot

- queue_goal: `Add bounded encoding-integrity guards for critical Script Editor and main UI source/rendered Chinese surfaces.`
- task_count: `3`
- completed_task_count: `2`
- remaining_task_count: `1`
- active_task_summary: `Close out the bounded encoding guard queue and return to version review without version closeout.`
- task_briefs:
  - `task.script-editor-ui-encoding-integrity-guard.evidence-anchor-reconcile: Confirm current encoding-risk surfaces, existing coverage, and bounded guard approach.`
  - `task.script-editor-ui-encoding-integrity-guard.implementation: Implement source/browser encoding guards test-first without widening into unrelated UI/runtime work.`
  - `task.script-editor-ui-encoding-integrity-guard.queue-closeout-and-handoff: Verify the queue and return to version review without version closeout.`

### Operator Snapshot Contract

- `The fixed operator receipt must source current queue from queue_id.`
- `The fixed operator receipt must source current task from active_task.`
- `The fixed operator receipt must source current queue goal from queue_goal.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-ui-encoding-integrity-guard.evidence-anchor-reconcile` | `done` | `Confirm current encoding-risk surfaces, existing coverage, and bounded guard approach.` | `none` | `Locked on 2026-07-19. Critical source surfaces are valid now, but there is no dedicated bounded encoding/mojibake guard or browser Chinese-render smoke proof.` |
| `task.script-editor-ui-encoding-integrity-guard.implementation` | `done` | `Implement source/browser encoding guards test-first without widening into unrelated UI/runtime work.` | `task.script-editor-ui-encoding-integrity-guard.evidence-anchor-reconcile` | `RED failed on missing tools/check-ui-encoding-integrity.mjs. GREEN added lint:encoding, the bounded guard tool, and robustness tests for clean source and mojibake rejection.` |
| `task.script-editor-ui-encoding-integrity-guard.queue-closeout-and-handoff` | `active` | `Verify the queue and return to version review without version closeout.` | `task.script-editor-ui-encoding-integrity-guard.implementation` | `Automated verification passed. Browser smoke confirmed main menu and Script Editor landing Chinese text render without mojibake; workspace rendered-source coverage is automated, and full workspace browser traversal remains closeout evidence to record if available.` |

### Task Definitions

#### `task.script-editor-ui-encoding-integrity-guard.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.script-editor-ui-encoding-integrity-guard.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/script-editor/script-editor-workspace-view.ts`
  - `tests/robustness.test.cjs`
  - `package.json`
  - `tools/**`
- must_inspect:
  - `critical Script Editor and main UI source files that previously showed mojibake or invalid JS syntax`
  - `existing test coverage for source syntax and Chinese rendered UI copy`
  - `available package scripts and tools for encoding/source checks`
- must_not_change:
  - `Do not implement guard code before evidence_lock_status is locked.`
  - `Do not widen into repo-wide migration or runtime behavior changes.`
- done_when:
  - `Evidence Lock is locked or the queue is blocked with a concrete reason.`
  - `Can Claim and Cannot Claim still match ACC-ENCODING-GUARD-001..005.`
  - `Implementation anchors and minimum verification are recorded.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Return to version review or split a prerequisite queue.`
- promote_next_if_done: `task.script-editor-ui-encoding-integrity-guard.implementation`
- stop_if:
  - `source evidence shows a repo-wide charset migration is required before bounded guard implementation`
  - `browser smoke cannot be made deterministic enough for this queue`

##### Human Context

- task_brief:
  - `Confirm the encoding guard boundary before implementation.`
- task_outcome_summary:
  - `Source review confirmed the previously affected critical files are currently syntactically valid and do not contain typical mojibake markers. Existing tests assert some Chinese source strings, but there is no dedicated bounded guard over critical UI source files and no browser-rendered Chinese smoke proof.`
- Purpose:
  - `Prevent future visible Chinese UI mojibake and invalid JavaScript syntax from critical Script Editor/UI source encoding damage.`
- Failure mode:
  - `Claiming encoding protection from logic-only tests that do not inspect source text or rendered Chinese browser output.`

#### `task.script-editor-ui-encoding-integrity-guard.implementation`

##### Control Block

- task_id: `task.script-editor-ui-encoding-integrity-guard.implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `tests/**`
  - `tools/**`
  - `package.json`
  - `docs/blueprints/**`
- must_inspect:
  - `evidence-anchor reconcile outcome`
  - `existing source syntax and robustness tests`
  - `critical UI files selected by the evidence lock`
- must_modify:
  - `tests/**`
  - `tools/**`
  - `package.json`
  - `docs/blueprints/**`
- must_preserve:
  - `runtime behavior`
  - `Script Editor authoring semantics`
  - `EventBindingRuntime semantics`
- must_not_change:
  - `unrelated UI layout or gameplay behavior`
  - `repo-wide encoding policy beyond the locked critical surface`
- done_when:
  - `Focused encoding/source integrity tests fail before implementation and pass after implementation.`
  - `Browser smoke evidence verifies covered Chinese UI surfaces render without mojibake.`
  - `Required verification passes.`
- verify_with:
  - `focused tests`
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- if_blocked:
  - `Record the blocker and do not claim protection by narrowing away visible UI surfaces.`
- promote_next_if_done: `task.script-editor-ui-encoding-integrity-guard.queue-closeout-and-handoff`
- stop_if:
  - `the guard requires a repo-wide migration`
  - `implementation would alter gameplay/runtime semantics`

##### Human Context

- task_brief:
  - `Implement bounded encoding/source/browser guards test-first.`
- task_outcome_summary:
  - `Implemented a bounded UI encoding integrity guard command and tests. The guard checks locked critical UI source files for required Chinese text, typical mojibake markers, and JS syntax where applicable; it also rejects a generated corrupt fixture.`
- Purpose:
  - `Catch mojibake and encoding-induced invalid JS before they reach the browser.`
- Failure mode:
  - `A source-only check passes while the browser still renders corrupted Chinese UI text.`

#### `task.script-editor-ui-encoding-integrity-guard.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-ui-encoding-integrity-guard.queue-closeout-and-handoff`
- state: `active`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/queues/script-editor-ui-encoding-integrity-guard-queue.md`
  - `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`
  - `docs/blueprints/project-progress.md`
  - `tests/**`
- must_inspect:
  - `implementation task outcome`
  - `verification output`
  - `browser smoke evidence`
- must_not_change:
  - `version closeout`
  - `runtime semantics`
- done_when:
  - `Queue closeout records bounded encoding guard coverage or explicit blockers.`
  - `Blueprint lint passes.`
  - `Version review remains separate unless explicitly requested.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker in queue and version truth.`
- promote_next_if_done: `version-promotion-review`

##### Human Context

- task_brief:
  - `Verify the encoding guard slice and return to version review without automatic version closeout.`
- task_outcome_summary:
  - `queued`
- Purpose:
  - `Avoid claiming encoding safety without both source and browser evidence.`
- Failure mode:
  - `Closing the queue after only logic tests pass while Chinese UI copy remains vulnerable to mojibake.`
