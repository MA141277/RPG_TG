# Superpowers Workflow Guide

This directory stores repository-local governance docs for agentic implementation.

- `specs/`
  - boundary specs, governance rules, and child specs
- `plans/`
  - executable child plans
- `templates/`
  - reusable governance templates

These files are not runtime code.
They are repository-local execution instructions for humans and agents.

Primary governance rules live in:

- [specs/plan-governance-spec.md](C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/plan-governance-spec.md)
- [specs/2026-07-06-fail-closed-progress-driven-governance-spec.md](C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-06-fail-closed-progress-driven-governance-spec.md)

## Canonical Resume Entry

Always resume from:

- [project-progress.md](C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/project-progress.md)

Do not resume new work from:

- weekly orchestration plans
- weekly review artifacts
- architecture reports
- old queue controller documents

Resume order:

1. open `docs/superpowers/project-progress.md`
2. read `Current Stage`
3. read `Current Task`
4. read `Next Child`
5. read `Next Required Action`
6. open the `Next Owner Document`

If these fields do not uniquely determine what to do next, the current governance state is invalid and must be fixed before implementation resumes.

## How To Execute A Child Plan

1. open `docs/superpowers/project-progress.md`
2. confirm the referenced child is really the next executable child
3. open the child plan under `docs/superpowers/plans/`
4. read linked specs first
5. check `Execution State`
6. resume from `Next Step` or the first unchecked checkbox
7. implement a small batch
8. before stopping, update:
   - checkbox state
   - `Execution State`
   - `Progress Log`
9. run listed verification commands
10. run `npm run lint:plans` after creating or materially restructuring a plan

## Required Closeout Discipline

Child closeout is invalid unless all of these are true:

- child plan is updated
- project progress document is updated
- next child plan is already rechecked and updated, or `Next Child` is `none`
- structured closeout block exists
- remote push succeeded

Without these conditions, a child may only be:

- `waiting`
- `running`
- `blocked`
- `completed-but-open`

It may not be `closed`.

## Canonical Templates

Use these templates for new work:

- Active child plan:
  - [plans/_plan-template.md](C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/plans/_plan-template.md)
- Playable child plan:
  - [plans/_playable-plan-template.md](C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/plans/_playable-plan-template.md)
- Project progress document:
  - [templates/project-progress-template.md](C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/templates/project-progress-template.md)
- Child closeout block:
  - [templates/child-closeout-template.md](C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/templates/child-closeout-template.md)
- Task closeout block:
  - [templates/task-closeout-template.md](C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/templates/task-closeout-template.md)
- Child spec:
  - [templates/queued-child-spec-template.md](C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/templates/queued-child-spec-template.md)

## Historical Weekly Artifacts

Weekly artifacts are now historical only.

They may remain in the repository, but they are no longer the active governance entry for new work:

- `docs/superpowers/plans/*weekly*.md`
- `docs/superpowers/weekly/*.md`
- `docs/superpowers/templates/weekly-*.md`

Use them only as historical reference during migration or audit.

## Validation

Use:

```bash
npm run lint:plans
```

This structural lint checks plan shape, execution-state fields, and basic progress-log format.
It does not prove that governance semantics are correct; human or agent review is still required.
