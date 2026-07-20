# Script Editor Main UI Flow Mojibake Repair And Encoding Guard Hardening Queue

## Control Block

- queue_id: `queue.script-editor-main-ui-flow-mojibake-repair-and-encoding-guard-hardening`
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
- closure_basis: `Queue admitted after explicit operator reprioritization to handle encoding/mojibake repair before refusal runtime handoff.`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `success`
- sync_scope: `local-record`
- sync_summary: `Queue closed locally after bounded encoding repair, guard hardening, automated verification, and browser smoke proof.`
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
  - `Repair mojibake/corrupted Chinese hardcoded text in src/ui/main-ui/main-ui-flow.js and harden encoding guards so future Script Editor/Main UI encoding corruption is caught before browser-visible regressions.`
- Admission basis:
  - `The candidate was already recorded in the current version plan.`
  - `The operator explicitly asked to handle the encoding repair before the newly admitted refusal runtime handoff queue.`
- Forbidden expansions:
  - `Do not redesign unrelated Script Editor workflows.`
  - `Do not change gameplay/runtime semantics.`
  - `Do not enter version closeout.`
  - `Do not automatically activate memo items outside the version candidate backlog.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `complete`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-MAIN-UI-MOJIBAKE-001`
  - `ACC-MAIN-UI-MOJIBAKE-002`
  - `ACC-MAIN-UI-MOJIBAKE-003`
  - `ACC-MAIN-UI-MOJIBAKE-004`
  - `ACC-MAIN-UI-MOJIBAKE-005`
  - `ACC-MAIN-UI-MOJIBAKE-006`
- acceptance_not_claimed: []
- minimum_verification:
  - `npm run lint:blueprints`

### Claim Boundary

#### Can Claim

- `ACC-MAIN-UI-MOJIBAKE-001: Identify and repair hardcoded mojibake/corrupted Chinese UI strings in src/ui/main-ui/main-ui-flow.js that affect Script Editor/Main UI rendering.`
- `ACC-MAIN-UI-MOJIBAKE-002: Repair damaged HTML string fragments caused by mojibake, including broken option tags where found.`
- `ACC-MAIN-UI-MOJIBAKE-003: Harden encoding integrity checks so UTF-8 files containing already-corrupted mojibake text fail the guard.`
- `ACC-MAIN-UI-MOJIBAKE-004: Keep source encoding valid UTF-8 and avoid introducing non-governed charset conversions.`
- `ACC-MAIN-UI-MOJIBAKE-005: Browser smoke proof must show critical Script Editor pages render readable Chinese after repair.`
- `ACC-MAIN-UI-MOJIBAKE-006: Focused tests and full required verification pass without changing gameplay/runtime semantics.`

#### Cannot Claim

- `City/building locationAccess refusal runtime handoff.`
- `Script Editor condition picker completion.`
- `EventBindingRuntime semantics.`
- `Broad MainUiFlow architectural extraction unless required to repair encoding safely.`
- `Version closeout.`

#### Implementation Anchors

- Must inspect:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/script-editor/script-editor-workspace-view.ts`
  - `src/ui/views/script-editor/**`
  - `tools/check-ui-encoding-integrity.mjs`
  - `package.json`
  - `tests/robustness.test.cjs`
  - `browser simulated-human smoke flow`
- Must preserve:
  - `Main menu, Script Editor landing, workspace navigation, and runtime preview entry behavior.`
  - `Existing runtime/gameplay semantics.`
  - `Existing Blueprint no-memo-auto-execution rule.`

#### Verification Coverage

- `Focused encoding guard tests.`
- `npm run lint:encoding`
- `npm run typecheck`
- `npm run lint:blueprints`
- `npm test`
- `Browser smoke check for main menu and Script Editor workspace Chinese rendering.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-19-city-building-module-entry-and-project-startup-authoring-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`

### Queue Snapshot

- queue_goal: `Repair browser-visible mojibake and harden source guards against future encoded-text corruption.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `none`
- task_briefs:
  - `task.script-editor-main-ui-flow-mojibake-repair-and-encoding-guard-hardening.evidence-anchor-reconcile: Confirm mojibake evidence, guard gaps, and safe repair boundary.`
  - `task.script-editor-main-ui-flow-mojibake-repair-and-encoding-guard-hardening.implementation: Repair mojibake and harden encoding guard test-first.`
  - `task.script-editor-main-ui-flow-mojibake-repair-and-encoding-guard-hardening.queue-closeout-and-handoff: Verify the queue and return to version review without version closeout.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-main-ui-flow-mojibake-repair-and-encoding-guard-hardening.evidence-anchor-reconcile` | `done` | `Confirm mojibake evidence, guard gaps, and safe repair boundary.` | `none` | `Locked on 2026-07-20. PowerShell display mojibake was not treated as source corruption; Node UTF-8 source review found main-ui-flow.js readable and identified the real guard gap in the building fallback surface.` |
| `task.script-editor-main-ui-flow-mojibake-repair-and-encoding-guard-hardening.implementation` | `done` | `Repair mojibake and harden encoding guard test-first.` | `task.script-editor-main-ui-flow-mojibake-repair-and-encoding-guard-hardening.evidence-anchor-reconcile` | `Completed on 2026-07-20. Repaired building fallback Chinese copy and expanded lint:encoding/robustness coverage for that surface.` |
| `task.script-editor-main-ui-flow-mojibake-repair-and-encoding-guard-hardening.queue-closeout-and-handoff` | `done` | `Verify the queue and return to version review without version closeout.` | `task.script-editor-main-ui-flow-mojibake-repair-and-encoding-guard-hardening.implementation` | `Completed on 2026-07-20. Guard review and browser smoke passed; the queue is closed and the version remains open.` |

### Task Definitions

#### `task.script-editor-main-ui-flow-mojibake-repair-and-encoding-guard-hardening.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.script-editor-main-ui-flow-mojibake-repair-and-encoding-guard-hardening.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`
  - `docs/blueprints/queues/script-editor-main-ui-flow-mojibake-repair-and-encoding-guard-hardening-queue.md`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/script-editor/**`
  - `tools/check-ui-encoding-integrity.mjs`
  - `tests/robustness.test.cjs`
  - `package.json`
- must_inspect:
  - `current mojibake/corrupted hardcoded text evidence`
  - `existing encoding guard coverage`
  - `critical Script Editor/Main UI rendered labels`
  - `safe repair strategy that preserves UTF-8 and runtime semantics`
- must_not_change:
  - `Do not repair source before the evidence anchor is confirmed.`
  - `Do not widen into runtime behavior or unrelated UI redesign.`
- done_when:
  - `Evidence lock identifies exact source/guard gaps and the next implementation target.`
  - `The implementation task can proceed with test-first repair.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Record blocker in the queue and return to version review.`
- promote_next_if_done: `task.script-editor-main-ui-flow-mojibake-repair-and-encoding-guard-hardening.implementation`
- stop_if:
  - `Evidence shows no remaining mojibake or guard gap under this queue boundary.`

##### Human Context

- task_brief:
  - `Confirm mojibake evidence and encoding guard gaps before implementation.`
- task_outcome_summary:
  - `Completed on 2026-07-20. Evidence confirmed src/ui/main-ui/main-ui-flow.js is readable under Node UTF-8 and did not contain typical mojibake markers; PowerShell display output was not used as corruption evidence. The confirmed bounded gap was browser-visible building fallback copy plus missing lint:encoding coverage for src/ui/views/building/building-module-view.ts.`
- Purpose:
  - `Avoid blind charset conversion and repair only confirmed corrupted source/UI text.`
- Failure mode:
  - `Treating PowerShell display mojibake as source corruption or changing runtime behavior while repairing text.`

#### `task.script-editor-main-ui-flow-mojibake-repair-and-encoding-guard-hardening.implementation`

##### Control Block

- task_id: `task.script-editor-main-ui-flow-mojibake-repair-and-encoding-guard-hardening.implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/script-editor/**`
  - `tools/check-ui-encoding-integrity.mjs`
  - `tests/robustness.test.cjs`
  - `package.json`
- must_inspect:
  - `evidence-anchor reconcile outcome`
  - `existing source guard tests`
  - `browser-visible critical labels`
- must_modify:
  - `Only files required to repair confirmed mojibake and guard gaps.`
- must_preserve:
  - `runtime/gameplay semantics`
  - `Script Editor workflow behavior`
  - `valid UTF-8 source encoding`
- done_when:
  - `Confirmed mojibake text is repaired.`
  - `Encoding guard catches UTF-8 files containing mojibake markers.`
  - `Browser smoke and required verification pass.`
- verify_with:
  - `focused tests`
  - `npm run lint:encoding`
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- if_blocked:
  - `Record blocker and do not widen without admission review.`
- promote_next_if_done: `task.script-editor-main-ui-flow-mojibake-repair-and-encoding-guard-hardening.queue-closeout-and-handoff`
- stop_if:
  - `Repair requires broad MainUiFlow extraction rather than bounded encoding cleanup.`

##### Human Context

- task_brief:
  - `Repair mojibake and harden guard test-first.`
- task_outcome_summary:
  - `Completed on 2026-07-20. RED added robustness coverage proving the building fallback Chinese copy must be guarded. GREEN restored readable UTF-8 copy for 屋敷, 无人接待, 默认角色已展开, 这里是, and 在场人物, and extended tools/check-ui-encoding-integrity.mjs to check the building fallback surface.`
- Purpose:
  - `Restore readable Chinese UI and prevent recurrence.`
- Failure mode:
  - `Tests pass while browser-visible labels remain corrupted.`

#### `task.script-editor-main-ui-flow-mojibake-repair-and-encoding-guard-hardening.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-main-ui-flow-mojibake-repair-and-encoding-guard-hardening.queue-closeout-and-handoff`
- state: `done`
- task_kind: `execution`
- scope:
  - `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`
  - `docs/blueprints/queues/script-editor-main-ui-flow-mojibake-repair-and-encoding-guard-hardening-queue.md`
  - `tests/**`
- must_inspect:
  - `implementation task outcome`
  - `encoding guard evidence`
  - `browser smoke evidence`
- must_not_change:
  - `Do not enter version closeout.`
  - `Do not reopen unrelated queues.`
- done_when:
  - `Guard review passes and the queue can return to version review lawfully.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Return to implementation verification or version review as required.`
- promote_next_if_done: `none`
- stop_if:
  - `Implementation verification is incomplete.`

##### Human Context

- task_brief:
  - `Verify the queue and return to version review without version closeout.`
- task_outcome_summary:
  - `Completed on 2026-07-20. Guard review passed for UTF-8 source readability, bounded mojibake repair, expanded source guard coverage, browser-rendered main menu, Script Editor landing, and template workspace Chinese text. Verification passed: focused robustness test, npm run lint:encoding, npm run typecheck, npm run lint:blueprints, and npm test.`
- Purpose:
  - `Keep queue closeout separate from version closeout.`
- Failure mode:
  - `Closing the version instead of returning to review.`
