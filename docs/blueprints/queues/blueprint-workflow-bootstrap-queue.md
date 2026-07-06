# Blueprint Workflow Bootstrap Queue

## Topic Goal

Bootstrap the Blueprint workflow into a usable repository governance system, then hand off to the single modularization target plus its first real queue.

## Boundary

This queue covers:

- the new rule-source spec
- the new global entry files
- the new owner document
- the new template family
- the handoff into the first real governed queue

This queue does not cover:

- implementation of a runtime/gameplay/system target
- retroactive full migration of all historical `docs/superpowers/**` files

## Execution State

- Status: `done`
- Last Updated: `2026-07-06`
- Current Focus: `Bootstrap documentation and first-topic handoff are complete. This queue is now historical bootstrap record only.`
- Active Task:
  - `none`
- Next Step:
  - `No further execution from this queue unless a separate blueprint-process topic is explicitly opened later.`
- Verification:
  - `Bootstrap documents, handoff queue, and first real queue artifacts exist.`
- Notes:
  - `This queue is closed. Use it only as the historical handoff record into core-production-integration.`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `The repository had no docs/blueprints/ workflow entry chain before this queue started.`
  - `The old superpowers workflow remains present but should now be treated as historical reference only.`

## Current Queue

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.workflow.bootstrap-spec` | `done` | Author the Blueprint workflow rule-source spec. | `none` | Completed by creating `docs/blueprints/blueprint-workflow-spec.md`. |
| `task.workflow.bootstrap-entry-docs` | `done` | Create the global entry files and core templates. | `task.workflow.bootstrap-spec` | Completed by creating the initial docs/blueprints/ entry chain. |
| `task.workflow.first-topic-onboarding` | `done` | Normalize the workflow so each period has one current target and onboard the first real queue under the current period target. | `task.workflow.bootstrap-entry-docs` | Completed by creating the modularization target and reclassifying `core-production-integration` as the first queue under it. |

## Next Executable Task

- Task ID:
  - `none`
- Required action before promotion:
  - `None.`
- Expected output:
  - `None.`

## Candidate Backlog

- `task.workflow.historical-superpowers-index`
  - State:
    - `candidate`
  - Reason:
    - `May be useful later if the repository wants a clean historical index from old superpowers governance into blueprint-era references.`

## State Transition Rules

1. This queue should remain `done` unless the repository explicitly opens a new blueprint-process topic.
2. Any additional blueprint-process refinement after bootstrap should be treated as a new topic, not silently appended here.
3. Historical bootstrap records must remain visible after handoff instead of being deleted.

## Progress Log

- 2026-07-06
  - Summary: `Opened the bootstrap queue for the new Blueprint workflow.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Author the workflow spec and the initial entry documents.`
- 2026-07-06
  - Summary: `Completed the workflow spec and entry-document bootstrap. The queue then waited for the current-target-per-period model and the first real queue onboarding decision.`
  - Verification: `Document existence check`
  - Next: `Promote task.workflow.first-topic-onboarding after selecting the first real queue structure.`
- 2026-07-06
  - Summary: `Closed the bootstrap queue by onboarding the current-period modularization target and reclassifying core-production-integration as its first queue.`
  - Verification: `Document existence check plus active-queue artifact creation`
  - Next: `Use the modularization target plus core-production-integration queue as the active execution source.`
