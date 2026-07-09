# Playable Governance Core

## Status

- Status: `active`
- Last Updated: `2026-07-09`

## Goal

Define the repository-default governance for playable, minigame, QTE, and story-battle work.

## Source Of Truth

- `docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md`
- `docs/superpowers/specs/2026-07-03-playable-naming-and-artifact-conventions.md`
- `docs/special-house-interface.md`

## Core Rules

- All minigame-like mechanics are governed as `playable`.
- Allowed playable families today:
  - `minigame`
  - `battle`
- New gameplay loops should reuse an existing playable family and shared runtime seam unless repository-level evidence proves a new family is necessary.
- Playable lifecycle belongs to shared runtime ownership.
- House modules may host or launch a playable but must not privately own its lifecycle.
- `src/main.ts` must not gain new playable-specific business branches.
- Persistent gameplay effects must flow through unified state and settlement paths.

## Layer Boundary

- `domain`
  - ids, contracts, pure rules
- `application/playables`
  - playable definitions, launch/session logic, settlement logic
- `core/runtime`
  - shared runtime launch/session/handoff seams
- `house modules`
  - host-side launch and result consumption only
- `ui/views`
  - render-facing views only
- `content`
  - tunable data, text ids, assets, scenario-owned integration data

## Default Interpretation Rules

- If a request sounds like "add a house minigame", interpret it as playable work first and house-hosting work second.
- If a request only changes prompts, tuning, questions, or local result thresholds, treat it as local-only unless launch, settlement, or handoff changes too.
- If a request changes session shape, launch identity, runtime command routing, settlement, or owner return, treat it as shared-contract work by default.

## Default Prohibitions

- no ad hoc playable lifecycle in house-local code
- no playable-specific `main.ts` branch
- no hidden write-back outside unified settlement or state
- no owner-specific identity baked into `playableId`
- no new integration path that skips the shared registry or runtime line
