# Blueprint v1 Migration Map

## Purpose

This map defines how the current Blueprint owners and concepts migrate into Blueprint v1 without doing a destructive rewrite.

## Owner Mapping

| Current Owner / Structure | Current Role | Blueprint v1 Owner / Structure | Migration Rule |
| --- | --- | --- | --- |
| `docs/blueprints/project-progress.md` | Repository resume entry plus light mirror of active state | `project-progress` | Keep the file, reduce it to repository entry only |
| `docs/blueprints/blueprint.md` | Blueprint index and target pointer | `blueprint` | Keep the file, reduce it to target registry plus global execution rules |
| Current target spec | Target scope and acceptance contract | `target` | Merge its enduring target contract into the v1 target |
| Current target plan | Target live governor | `target` | Merge its live target execution truth into the v1 target |
| Current target spec + current target plan together | Split target ownership | `target` | Collapse into one target-level live owner |
| Active queue doc | Queue-local execution controller | `execution queue` | Rename by role, keep only one active at a time |
| Queue promotion ledger in target plan | Candidate list plus promotion history | `candidate_queues` | Convert from prose ledger rows into structured candidate entries |
| Candidate recovery ledger in target plan | Historical candidate re-entry hints | `candidate_queues` metadata | Keep only minimal candidate metadata needed for staged progression |
| Admission review fields in target plan | Thick target-level intake controller | `candidate_queues` + target next-step rule | Remove as first-class live truth unless still required during migration |
| `review_subject_id` / `review_subject_classification` / `proposed_queue_id` / `review_basis` / `admission_status` | Old admission chain | `candidate` entry | Replace with lighter candidate record fields |
| Closed queue handoff prose | Historical evidence | Historical note only | Keep as history, not live truth |
| `active_queue` in target plan | Current queue pointer | `execution_queue` in target | Keep, but rename and bind to one execution slot |
| Current queue task ledger | Task ordering and state | Execution queue task list | Keep in thinner form |
| `blocked` target or queue semantics | Stop-state for unresolved work | `decision_required` or target/candidate fallback | Downgrade and use only when no unique automatic path remains |
| Implicit structural gap handling | Informal bridge work | `transition_queue` | Introduce a unique formal bridge queue only when necessary |

## Queue Concept Mapping

| Current Concept | Blueprint v1 Concept | Notes |
| --- | --- | --- |
| `active queue` | `execution queue` | The one real execution slot |
| `candidate queue` in prose or ledger form | `candidate queue` | Now explicit and staged |
| no explicit ready state | `prepared` | New readiness stage before activation |
| ad hoc structural unblock work | `transition queue` | New unique and necessary bridge queue |
| queue closeout handoff | queue completion + auto-continue | Completion remains visible but does not imply stop |

## Task Mapping

| Current Task Structure | Blueprint v1 Task Structure | Migration Rule |
| --- | --- | --- |
| Thick task control block with many governance clauses | Minimal executable task entry | Preserve only data needed to execute, verify, and continue |
| `must_inspect`, `must_not_change`, `stop_if`, `if_blocked`, large prose sections | `inputs`, `constraints`, `on_failure` | Compress into operational semantics |
| `promote_next_if_done` | `next_on_success` | Keep outcome routing but simplify the field name and intent |

## Live Truth Consolidation

| Current Live Truth | Blueprint v1 Treatment |
| --- | --- |
| `project-progress` | Keep, thinner |
| `blueprint` | Keep, thinner |
| target spec live contract | Merge into `target` |
| target plan live control | Merge into `target` |
| active queue doc | Convert to `execution queue` |
| candidate ledger rows | Convert to `candidate_queues` |
| no transition queue owner | Add `transition_queue` only when necessary |

## Migration Sequence

1. Keep `project-progress` and `blueprint` as the repository entry pair.
2. Introduce v1 target structure without deleting old target docs yet.
3. Map the current active queue into the v1 `execution queue` role.
4. Convert ledger-based queue candidates into explicit `candidate_queues`.
5. Add `transition_queue` only if the target cannot activate any candidate directly.
6. Remove legacy admission fields only after equivalent candidate truth exists.
7. Retire thick prose and duplicate target owners after v1 truth is proven equivalent.

## Human Confirmation Points

The migration itself only requires human confirmation when one of these must be chosen:

1. conservative vs neutral vs aggressive removal of old admission fields
2. final `prepared` storage shape
3. final `decision_required` strictness
