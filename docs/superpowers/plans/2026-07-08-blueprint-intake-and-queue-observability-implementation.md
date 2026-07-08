# Blueprint Intake And Queue Observability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Land Blueprint intake automation rules, queue observability requirements, and decision-dispatch support across the workflow spec, templates, lint rules, tests, and any now-required live Blueprint docs.

**Architecture:** Keep the existing `project-progress -> blueprint -> target plan -> active queue -> active task` resume chain intact while adding target-plan intake fields, queue snapshot summary requirements, task summary fields, and queue-local decision-dispatch semantics. Enforcement should remain document-structural through `tools/lint-blueprints.mjs`, with current live docs updated only where the stronger rules make them mandatory.

**Tech Stack:** Markdown governance docs, Node.js lint tooling, Node test runner, `npm run lint:blueprints`, `npm test`, PowerShell shell, `apply_patch`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-08`
- Current Focus: `Blueprint governance changes are verified and ready to be committed, pushed, and merged into mod-first-dev, while preserving the known unrelated build:test baseline failure as recorded context.`
- Next Step: `Commit the Blueprint governance batch, push branch codex/blueprint-intake-observability-impl, merge it into mod-first-dev, and keep the unrelated npm test baseline failure explicitly recorded.`
- Verification: `npm run lint:blueprints passed; node --test tests/blueprint-governance-lint.test.cjs passed; npm run lint:plans passed; npm test failed in build:test on the existing import.meta and ?url asset typing/configuration errors outside this Blueprint change scope.`
- Notes: `Work happens in .worktrees/blueprint-intake-observability-impl on branch codex/blueprint-intake-observability-impl. Integration is user-requested despite the unchanged unrelated full-test baseline failure.`

## Progress Log

- 2026-07-08
  - Summary: `Created the clean implementation worktree from mod-first-dev, confirmed it is clean, and verified the baseline Blueprint lint passes before changing governance rules.`
  - Verification: `npm run lint:blueprints`
  - Next: `Implement workflow spec, template, lint, test, and live-doc updates for intake and queue observability.`
- 2026-07-08
  - Summary: `Implemented Blueprint intake fields, queue snapshot/task summary requirements, decision-dispatch template support, stricter lint rules, and new Blueprint governance tests; synced the active target plan and active queue to satisfy the stronger rules.`
  - Verification: `npm run lint:blueprints; node --test tests/blueprint-governance-lint.test.cjs; npm test (fails during build:test on existing import.meta/?url asset typing issues outside this change scope)`
  - Next: `Stop short of commit/push, report the verified Blueprint results, and let the user decide whether to tackle the unrelated build:test baseline next.`
- 2026-07-08
  - Summary: `Extended the Blueprint governance batch to enforce minimal operator intake plus fixed receipt output, updated live docs to expose queue observability, reran targeted verification, and prepared the branch for user-requested integration into mod-first-dev.`
  - Verification: `npm run lint:blueprints; node --test tests/blueprint-governance-lint.test.cjs; npm run lint:plans; npm test (still fails during build:test on existing import.meta/?url asset typing issues outside this change scope)`
  - Next: `Commit, push, and merge the verified Blueprint governance batch while preserving the unrelated full-test baseline failure as recorded context.`

---

## Based On Spec

- Primary spec:
  - `docs/blueprints/blueprint-workflow-spec.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `The clean implementation worktree is based on mod-first-dev branch state at commit 15a575f, which differs from the earlier local design branch and currently keeps queue.main-shell-and-layout-editor-ownerization active.`
  - `Because an active queue already exists in live Blueprint truth, any new queue-snapshot lint rule will need corresponding current-doc updates in docs/blueprints/project-progress.md, docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md, and docs/blueprints/queues/main-shell-and-layout-editor-ownerization-queue.md or equivalent owner files.`

## Implementation Scope

### In Scope

- Add intake automation semantics to the Blueprint workflow spec.
- Add target-plan intake fields and queue/task observability guidance to templates.
- Add queue snapshot, task summary, and intake consistency enforcement to Blueprint lint.
- Add automated tests for the new lint/document rules.
- Update any live Blueprint docs required to satisfy the stricter rules in the current active-queue state.

### Still Out Of Scope

- Implementing a new runtime/gameplay feature outside Blueprint governance docs and tooling.
- Changing the repository's core resume chain.
- Allowing speculative candidate queue docs before admission.
- Pushing, merging, or final closeout before implementation verification passes.

## File Map

### Existing files to modify

- `docs/blueprints/blueprint-workflow-spec.md`
  - Add internal intake, queue snapshot, and decision-dispatch rules.
- `docs/blueprints/templates/target-plan-template.md`
  - Add intake control fields and operator-feedback rules.
- `docs/blueprints/templates/execution-queue-template.md`
  - Add queue snapshot, task summary fields, and decision-dispatch task shape.
- `tools/lint-blueprints.mjs`
  - Enforce the new Blueprint structure rules.
- `tests/blueprint-governance-lint.test.cjs`
  - Add fixture coverage for queue snapshots, task summary fields, and intake consistency.
- `docs/blueprints/project-progress.md`
  - Sync operator-facing current-entry wording if needed by the new workflow rules.
- `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - Add any now-required intake fields or live owner updates.
- `docs/blueprints/queues/main-shell-and-layout-editor-ownerization-queue.md`
  - Add required queue snapshot and task summary data if lint requires it for the active queue.
- `docs/change-log.md`
  - Mirror the governance upgrade if the final rule change materially alters Blueprint operation.

### Existing files expected to be deleted

- `none`

### New files to create

- `docs/superpowers/plans/2026-07-08-blueprint-intake-and-queue-observability-implementation.md`
  - This execution plan.

## Verification Plan

- Targeted verification:
  - `npm run lint:blueprints`
  - `node --test tests/blueprint-governance-lint.test.cjs`
- Required commands:
  - `npm run lint:blueprints`
  - `node --test tests/blueprint-governance-lint.test.cjs`
  - `npm test`

## Task 1: Update Workflow Spec And Templates

**Files:**
- Modify: `docs/blueprints/blueprint-workflow-spec.md`
- Modify: `docs/blueprints/templates/target-plan-template.md`
- Modify: `docs/blueprints/templates/execution-queue-template.md`
- Read: `docs/superpowers/specs/2026-07-08-blueprint-intake-and-queue-observability-design.md`

- [x] **Step 1: Add workflow rules for internal intake and queue observability**

Update `docs/blueprints/blueprint-workflow-spec.md` so it explicitly requires:

- plain-language operator requests as intake inputs
- target-plan-owned intake state
- mandatory queue snapshots whenever an active queue interaction depends on queue state
- queue-local `decision-dispatch` as a legal task shape
- standardized operator receipts

- [x] **Step 2: Add intake fields to the target plan template**

Update `docs/blueprints/templates/target-plan-template.md` to include:

- `intake_status`
- `intake_item_id`
- `intake_summary`
- `intake_result`
- `intake_feedback_mode`

and template guidance showing that these fields return to `none` after intake handling is durably recorded.

- [x] **Step 3: Add queue snapshot and task summary structure to the queue template**

Update `docs/blueprints/templates/execution-queue-template.md` to include:

- `Queue Snapshot`
- `task_brief`
- `task_outcome_summary`
- a `decision-dispatch` example task

- [x] **Step 4: Run focused Blueprint lint after doc/template edits**

Run:

```bash
npm run lint:blueprints
```

Expected:

- `Blueprint lint passed.` or a controlled failure that identifies the first live-doc/tooling rule still missing.

## Task 2: Extend Blueprint Lint And Tests

**Files:**
- Modify: `tools/lint-blueprints.mjs`
- Modify: `tests/blueprint-governance-lint.test.cjs`
- Read: `docs/blueprints/blueprint-workflow-spec.md`
- Read: `docs/blueprints/templates/execution-queue-template.md`
- Read: `docs/blueprints/templates/target-plan-template.md`

- [x] **Step 1: Add failing tests for intake and queue observability rules**

Extend `tests/blueprint-governance-lint.test.cjs` with fixtures that fail when:

- an active queue omits `Queue Snapshot`
- task definitions omit `task_brief`
- `active_task` is missing from the task ledger/definitions
- intake fields are partially present or structurally inconsistent

- [x] **Step 2: Run the targeted test to verify the new cases fail first**

Run:

```bash
node --test tests/blueprint-governance-lint.test.cjs
```

Expected:

- one or more `FAIL` results pointing to the newly added assertions before lint implementation is updated

- [x] **Step 3: Implement the lint rules**

Teach `tools/lint-blueprints.mjs` to reject:

- active queues without `Queue Snapshot`
- task ledgers whose task count/active task cannot be reconciled
- missing `task_brief`
- invalid intake field combinations in target plans
- decision-dispatch tasks that lack recommendation-support summary fields, if that shape is made explicit in the template

- [x] **Step 4: Re-run the targeted Blueprint lint test**

Run:

```bash
node --test tests/blueprint-governance-lint.test.cjs
```

Expected:

- `PASS` for all Blueprint lint tests

## Task 3: Sync Current Live Blueprint Docs

**Files:**
- Modify: `docs/blueprints/project-progress.md`
- Modify: `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
- Modify: `docs/blueprints/queues/main-shell-and-layout-editor-ownerization-queue.md`
- Optional Modify: `docs/change-log.md`

- [x] **Step 1: Update the active target plan with the new intake fields**

Set the new intake fields in `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md` to the correct idle/default values unless a live intake is intentionally open.

- [x] **Step 2: Add queue snapshot and task summary fields to the active queue**

Update `docs/blueprints/queues/main-shell-and-layout-editor-ownerization-queue.md` so the currently active queue exposes:

- queue goal
- task count
- completed/remaining counts
- active task summary
- per-task briefs
- task-level `task_brief` / `task_outcome_summary`

- [x] **Step 3: Update current-entry narrative only where the new workflow requires it**

Adjust `docs/blueprints/project-progress.md` and optionally `docs/change-log.md` only if needed to explain the new intake/observability behavior without duplicating downstream truth.

- [x] **Step 4: Re-run Blueprint lint after live-doc synchronization**

Run:

```bash
npm run lint:blueprints
```

Expected:

- `Blueprint lint passed.`

## Task 4: Full Verification And Closeout Readiness

**Files:**
- Modify: `docs/superpowers/plans/2026-07-08-blueprint-intake-and-queue-observability-implementation.md`
- Read: `package.json`

- [x] **Step 1: Run targeted verification**

Run:

```bash
node --test tests/blueprint-governance-lint.test.cjs
npm run lint:blueprints
```

Expected:

- all targeted Blueprint governance checks pass

- [x] **Step 2: Run full repository tests**

Run:

```bash
npm test
```

Expected:

- full test suite passes, or any pre-existing unrelated failure is identified explicitly before closeout

- [x] **Step 3: Sync plan state**

Update this plan's checkboxes, `Execution State`, and `Progress Log` with the actual verification result and next action.

## Exit Check

- [x] Workflow spec, templates, lint, and tests all reflect internal intake and queue observability behavior.
- [x] Current active Blueprint docs satisfy the strengthened lint rules.
- [x] Targeted Blueprint verification passes.
- [x] Full test status is recorded.
- [x] No push/merge/extra commit is attempted before verification is complete.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `none`
- Parent Task: `none`
- Parent Stage: `none`
- Closeout Status: `not-closed`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Commit, push, and merge the verified Blueprint governance batch into mod-first-dev.`
- Next Required Action: `Keep the unrelated build:test asset/import.meta typing baseline failure explicitly recorded after integration.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-08-blueprint-intake-and-queue-observability-implementation.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open this implementation plan, review the verified Blueprint notes, and continue from integration or later build:test baseline follow-up as needed.`
