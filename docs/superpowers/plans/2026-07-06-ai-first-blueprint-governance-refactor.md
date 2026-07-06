# AI-First Blueprint Governance Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `docs/blueprints/**` so current Blueprint/Target/Queue execution truth is machine-readable first, without rewriting history or disturbing the already-closed queue chain.

**Architecture:** Keep the current Blueprint target and queue history intact, then layer AI-first `Control Block` state on top of the existing documents before tightening the authoritative workflow spec and templates. Do not reopen closed queues or fabricate a new active queue; the repository-wide execution truth remains `active_queue = none` until a later promotion decision is explicitly recorded.

**Tech Stack:** Markdown governance docs under `docs/blueprints/**`, plan governance rules under `docs/superpowers/**`, `rg`, `npm run lint:plans`

## Execution State

- Status: `completed`
- Last Updated: `2026-07-06`
- Current Focus: `The AI-first Blueprint governance refactor is complete for the current active truth documents, closed promotion-bearing queues, authoritative workflow spec, and templates.`
- Next Step: `Use the current target plan to decide whether queue.unified-contribution-intake-closeout should be promoted next under the new AI-first governance model.`
- Verification: `npm run lint:plans`
- Notes: `This batch preserved the current no-active-queue truth and did not reopen any closed queue.`

## Progress Log

- 2026-07-06
  - Summary: `Plan created for the AI-first Blueprint governance refactor after the active queue chain closed and the repository moved to a no-active-queue promotion-decision state.`
  - Verification: `Not run`
  - Next: `Freeze the current governance truth and map the exact files that now carry repository execution state.`
- 2026-07-06
  - Summary: `Completed the AI-first Blueprint governance refactor by adding Control Blocks to current truth documents and promotion-bearing closed queues, rewriting the authoritative workflow spec, updating templates, and recording the migration in docs/change-log.md.`
  - Verification: `npm run lint:plans`
  - Next: `Resume from the target-level promotion review under the new Control Block-driven workflow.`

---

## Based On Spec

- Primary spec:
  - `docs/blueprints/blueprint-workflow-spec.md`
- Supporting requirements:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/shell-thinning-and-final-ownerization-queue.md`
  - `docs/blueprints/queues/builtin-content-deprivileging-closeout-queue.md`
  - `docs/change-log.md`

## Baseline Recheck

- Recheck result: `narrowed`
- Notes:
  - `Repository-wide governance truth is already synchronized to current target = project complete modularization, active phase = Phase 2 Contribution Closure, active queue = none, active task = none, and next decision = whether unified-contribution-intake-closeout should be promoted.`
  - `The current risk is not pointer contradiction; it is that execution still depends on prose-first reading because the docs do not yet expose AI-first Control Blocks, explicit candidate gates, drift enforcement, or remote integration checkpoints.`
  - `Two new queue files and several blueprint docs are already modified in the workspace. This refactor must build on that state rather than restoring older queue pointers.`

## Implementation Scope

### In Scope

- Add AI-first `Control Block` sections to the current Blueprint, current Target artifacts, and relevant closed queues that still define current promotion truth.
- Update Blueprint workflow definitions so Control Blocks become the authoritative execution layer without erasing human-readable context.
- Normalize candidate queue gating, closeout decision structure, drift-control hooks, and remote-integration governance inside `docs/blueprints/**`.
- Update repository-approved Blueprint templates so future governance artifacts are created in the AI-first shape.
- Record the governance refactor in `docs/change-log.md`.

### Still Out Of Scope

- Runtime code refactors outside any doc pointer synchronization that is already present in the workspace.
- Reopening or re-executing closed queues.
- Promoting a new queue as part of this batch.
- Deleting historical prose or collapsing the current target spec/plan into a new file model in the same batch.

## File Map

### Existing files to modify

- `docs/blueprints/project-progress.md`
  - Add repository-level Control Block and explicit paused promotion-decision state.
- `docs/blueprints/blueprint.md`
  - Convert the current owner document into the AI-first execution index with authoritative structured pointers and candidate target metadata.
- `docs/blueprints/blueprint-workflow-spec.md`
  - Rewrite the authoritative workflow rules around Control Blocks, Human Context, paused promotion states, drift stops, and machine-readable candidate handling.
- `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
  - Add Target Control Block, queue class metadata, acceptance gates, and target-level closeout semantics.
- `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - Narrow this file to target-level sequencing, promotion, and migration notes while aligning it to the AI-first Target role.
- `docs/blueprints/queues/shell-thinning-and-final-ownerization-queue.md`
  - Add Queue Control Block, structured task control blocks, and queue closeout decision data without changing its closed historical truth.
- `docs/blueprints/queues/builtin-content-deprivileging-closeout-queue.md`
  - Add Queue Control Block, structured task control blocks, and queue closeout decision data without changing its closed historical truth.
- `docs/blueprints/templates/blueprint-template.md`
  - Update to AI-first Blueprint structure.
- `docs/blueprints/templates/project-progress-template.md`
  - Update to AI-first repository resume structure.
- `docs/blueprints/templates/target-spec-template.md`
  - Update to AI-first Target structure and queue classification rules.
- `docs/blueprints/templates/target-plan-template.md`
  - Update to AI-first target-governor shape that no longer competes with Control Block truth.
- `docs/blueprints/templates/topic-queue-template.md`
  - Update to AI-first Queue and Task structure, including drift hooks and closeout decision blocks.
- `docs/change-log.md`
  - Record the governance refactor and the preservation of current no-active-queue truth.

### Existing files expected to be deleted

- `none`

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - `The current active target, active queue, active task, next legal action, and candidate queue gates can all be read from Control Blocks alone.`
  - `Closed queue history remains intact and no active pointer is rewritten into a false active state.`
- Required commands:
  - `npm run lint:plans`

## Task 1: Freeze Current Governance Truth

**Files:**
- Modify: `docs/superpowers/plans/2026-07-06-ai-first-blueprint-governance-refactor.md`
- Read: `docs/blueprints/project-progress.md`
- Read: `docs/blueprints/blueprint.md`
- Read: `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Read: `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
- Read: `docs/blueprints/queues/shell-thinning-and-final-ownerization-queue.md`
- Read: `docs/blueprints/queues/builtin-content-deprivileging-closeout-queue.md`

- [x] **Step 1: Reconfirm the frozen execution truth in the current docs**

Verify these facts before changing any governance wording:

- current target = `project complete modularization`
- current phase = `Phase 2: Contribution Closure`
- active queue = `none`
- active task = `none`
- next decision = `whether unified-contribution-intake-closeout should be promoted`

- [x] **Step 2: Update this plan with the recheck result**

Record the exact baseline result in:

- `## Execution State`
- `## Progress Log`

- [x] **Step 3: Verify plan structure**

Run:

```bash
npm run lint:plans
```

Expected:

- `PASS`

## Task 2: Add AI-First Control Blocks To Current Truth Documents

**Files:**
- Modify: `docs/blueprints/project-progress.md`
- Modify: `docs/blueprints/blueprint.md`
- Modify: `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Modify: `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`

- [x] **Step 1: Add repository-level Control Blocks without changing meaning**

Add `## Control Block` sections that explicitly encode:

- Blueprint id
- active target
- active queue = `none`
- active task = `none`
- execution mode = `single-active-task`
- decision state = paused promotion review
- next step = target-level promotion decision

- [x] **Step 2: Add Target-level Control Blocks and queue classes**

Add structured Target fields for:

- required / conditional / optional / historical queues
- active phase
- candidate queues
- acceptance gate
- promote-next-queue gate

- [x] **Step 3: Preserve narrative context under Human Context-style sections**

Restructure headings so narrative rationale and progress remain available, but execution truth is carried by Control Blocks first.

- [x] **Step 4: Verify only current truth changed, not history**

Read the edited files and confirm:

- no closed queue was reopened
- no new active queue was invented
- no historical progress log entry was rewritten into a false state

## Task 3: Refactor Queue Definitions Into AI-First Execution Units

**Files:**
- Modify: `docs/blueprints/queues/shell-thinning-and-final-ownerization-queue.md`
- Modify: `docs/blueprints/queues/builtin-content-deprivileging-closeout-queue.md`

- [x] **Step 1: Add Queue Control Blocks**

For each queue, add structured fields for:

- queue id
- target id
- queue class
- status
- active task
- next task
- allowed task states
- closeout gate
- next queue candidates

- [x] **Step 2: Add structured task control blocks**

For each task section, add explicit:

- `task_id`
- `state`
- `depends_on`
- `scope`
- `must_inspect`
- `must_not_change`
- `done_when`
- `verify_with`
- `promote_next_if_done`

- [x] **Step 3: Add queue closeout decision blocks**

Encode current closed truth for both queues in a machine-readable block that includes:

- closeout status
- verification status
- residue remaining
- residue classification
- next queue recommendation
- promotion justified

- [x] **Step 4: Add drift and blocker hooks without widening scope**

Add queue/task-level drift-control fields and stop conditions, but keep them aligned to the already-closed queue boundaries.

## Task 4: Rewrite The Authoritative Workflow Spec And Templates

**Files:**
- Modify: `docs/blueprints/blueprint-workflow-spec.md`
- Modify: `docs/blueprints/templates/blueprint-template.md`
- Modify: `docs/blueprints/templates/project-progress-template.md`
- Modify: `docs/blueprints/templates/target-spec-template.md`
- Modify: `docs/blueprints/templates/target-plan-template.md`
- Modify: `docs/blueprints/templates/topic-queue-template.md`

- [x] **Step 1: Rewrite the workflow spec around AI-first authority**

Make `Control Block` the execution source of truth and define:

- Blueprint = execution index
- Target = version delivery unit
- Queue = execution decomposition unit
- Task = smallest executable governance unit

- [x] **Step 2: Add paused-promotion and no-active-queue semantics**

The spec must explicitly support:

- `active_queue = none`
- target-level promotion decision mode
- candidate gating without forcing a fake active queue

- [x] **Step 3: Add drift detection and remote integration governance**

Formalize:

- drift checkpoints
- stop rules
- structured drift note fields
- remote integration recommendation blocks

- [x] **Step 4: Update all templates to the same AI-first shape**

Ensure new governance docs will be created with:

- `## Control Block`
- `## Human Context`
- structured task blocks
- structured closeout blocks

## Task 5: Sync Repository Record And Verify

**Files:**
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-07-06-ai-first-blueprint-governance-refactor.md`
- Read: `docs/blueprints/project-progress.md`
- Read: `docs/blueprints/blueprint.md`
- Read: `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Read: `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
- Read: `docs/blueprints/queues/shell-thinning-and-final-ownerization-queue.md`
- Read: `docs/blueprints/queues/builtin-content-deprivileging-closeout-queue.md`

- [x] **Step 1: Record the governance refactor in the change log**

Document that the repository has migrated to AI-first Blueprint definitions while preserving the current no-active-queue truth and closed queue history.

- [x] **Step 2: Update this plan’s execution tracking**

Mark completed checkboxes, update `Execution State`, and append a `Progress Log` entry that records what changed and what residue remains.

- [x] **Step 3: Run final verification**

Run:

```bash
npm run lint:plans
```

Expected:

- `PASS`

## Exit Check

- [x] The current target, active queue, and active task can be identified from Control Blocks alone.
- [x] The current no-active-queue promotion-review state is explicit and does not require prose inference.
- [x] Closed queue history remains closed and structurally readable.
- [x] Templates now generate AI-first governance docs.
- [x] `docs/change-log.md` records the refactor.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
