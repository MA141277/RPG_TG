<!-- GENERATED FILE: do not edit by hand -->
---
name: blueprint-governance
description: Use when work in RPG_TG may change Blueprint-governed routing, queue admission, queue closeout, version review, or governed documentation under docs/blueprints and docs/change-log.md.
---

# Blueprint Governance

Use this skill when a task may affect Blueprint-governed work in RPG_TG.
Blueprint documents remain the source of truth. This generated skill only tells Codex where to read, how to route work, what to synchronize, and which checks to run.

## Required Reading Order

1. `docs/blueprints/project-progress.md`
2. `docs/blueprints/blueprint.md`
3. the active version plan referenced by `blueprint.md`
4. the active queue doc referenced by the version plan when `active_queue != none`
5. the active task definition inside the active queue doc

## Routing Rules

- classify first, route second, promote later
- current execution truth still comes only from `project-progress -> blueprint -> version plan -> active queue -> active task`
- if classification concludes `queue-candidate`, return control to version-plan admission review before implementation
- route content or asset items through existing pipelines unless written evidence requires new governance structure
- low-confidence routing falls back to `uncertain-needs-review` unless a stronger written override exists

## Required Sync

- update the active queue doc when queue truth, active task truth, queue closeout truth, or queue-local verification truth changes
- update the active version plan when admission truth, routing truth, closure review truth, residue routing truth, or version closeout truth changes
- update `docs/blueprints/project-progress.md` when repository entry truth, active queue presence, or next-file pointer truth changes
- update `docs/blueprints/blueprint.md` when active version pointers, version registry truth, or routing references change
- update `docs/change-log.md` when code, runtime, data compatibility, shared interface, or user-visible behavior changes are recorded

## Verification

- `npm run lint:blueprints`
- `npm run lint:blueprint-skill`
- `npm run blueprint:governance:check` when governed queue or version shell truth changes

## Red Flags

- do not use `docs/change-log.md` as live execution truth
- do not start implementation for a `queue-candidate` before version-plan admission truth and queue truth both exist
- do not activate a second queue when Blueprint execution mode is single-active-task
- do not treat closed queues, old `docs/superpowers/**`, or version memos as default next-step truth
