# Playable Update Protocol

## Goal

Keep this skill extensible without bloating `SKILL.md`.

## Update Rules

- if only the operational checklist changes:
  - update `playable-change-checklist.md`
- if the repository boundary or top-level governance rule changes:
  - update `playable-governance-core.md`
- if the source-of-truth docs change:
  - update `playable-doc-index.md`
- if impact classification changes:
  - update `playable-impact-matrix.md`
- if trigger wording coverage needs to expand:
  - update `playable-trigger-examples.md`
- if trigger conditions or read order change:
  - update `SKILL.md`

## Source Of Truth Rule

- Repository specs under `docs/` remain the source of truth.
- Skill `references/` files are execution guides and classification helpers.
- Do not duplicate large spec text into `references/` unless the workflow would be unclear without it.

## When AGENTS.md Must Also Change

- new playable-related trigger phrases are introduced
- repository wants stricter mandatory behavior
- playable work now requires an additional contract before implementation

## Versioning Convention

Each reference file should keep:

- `Status`
- `Last Updated`
- `Source Of Truth` or `Related Docs` when useful
