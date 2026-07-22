# Superpowers Workflow Guide

This directory stores legacy repository-local governance docs for agentic implementation history.

For current Blueprint-governed work, use:

- [docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)

`docs/superpowers/**` is now historical or legacy-domain governance only. It is not the repository-wide live execution entry for Blueprint work.

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

## Legacy Resume Entry

Only use this section when the work is explicitly still governed inside `docs/superpowers/**`.

Always resume from:

- [project-progress.md](C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/project-progress.md)

Do not resume legacy work from:

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

If these fields do not uniquely determine what to do next, that legacy governance state is invalid and must be fixed before implementation resumes.

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
- repository sync result is recorded as `success` or `failed`

Without these conditions, a child may only be:

- `waiting`
- `running`
- `blocked`
- `completed-but-open`

It may not be `closed`.

Remote push failure must be recorded, but it must not by itself block child closeout or the next lawful handoff when the structured closeout, project progress update, and next child state are otherwise synchronized.

## Repository Commit Message Rule

Every git commit in this repository must use:

- a subject line in the form `<type>: <brief title>`
- a blank line
- a `Summary:` section with at least one bullet describing the landed content

Merge commits are not exempt.

Validation entrypoints:

- `npm run lint:commit-msg -- --edit .git/COMMIT_EDITMSG`
- `.githooks/commit-msg`
- `.github/workflows/validate-commit-messages.yml`

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
npm run lint:commit-msg -- --edit .git/COMMIT_EDITMSG
```

This structural lint checks plan shape, execution-state fields, and basic progress-log format.
It does not prove that governance semantics are correct; human or agent review is still required.
