# RPG_TG Agent Rules

This repository uses strict module-boundary rules for any new `house` implementation.

## Mandatory Trigger

If a user asks to:

- create a new house
- implement a house instance
- clone or prototype a house
- add a special house feature
- extend an existing house with minigame / trade / dialogue / service flow

you must stop and present the house interface contract first.

Do this before writing code, editing files, or proposing a concrete implementation.

The contract to present is defined in:

- `docs/special-house-interface.md`

## Hard Constraints For House Work

When implementing any special house module:

1. Do not hardcode house-specific business branches in `src/main.ts`.
2. Do not make `main.ts` import a concrete house business module directly unless the user explicitly asks for a temporary prototype-only exception.
3. Do not return HTML strings from `application/*` modules.
4. Do not store persistent house gameplay data in ad hoc top-level globals.
5. Do not overwrite player base stats, money, skills, or inventory as part of house-session initialization.
6. All persistent gameplay changes must flow through unified game state structures.
7. All house modules must conform to the interface and lifecycle rules in `docs/special-house-interface.md`.

## Required Response Pattern

For any request to add or build a house instance, the first response must:

1. Say that the house must follow the repository house interface contract.
2. Summarize the required interface sections.
3. State any current mismatch in the codebase if relevant.
4. Only then proceed with design or implementation.

## Documentation Update Rule

If a house module changes shared interfaces, runtime session structure, registry shape, or cross-module wiring, update:

- `docs/special-house-interface.md`
- `docs/change-log.md`

## Mechanism-First Design Rule

For gameplay loop, progression, review/council flow, timed skip, assignment, minigame, or story-driven system work:

1. Do not treat the current request as a one-off scene or one-off house patch by default.
2. First inspect whether the repo already has a similar mechanism, cadence, or lifecycle that should be extracted and reused.
3. Prefer refining a reusable mechanism component, shared state machine, or shared runtime contract over copying a flow into another module.
4. If an implementation feels like a temporary story insert, hand-written special branch, or duplicated house logic, stop and redesign the shared mechanism first.
5. When a feature is intentionally stage-specific, keep the stage-specific part in data/content, and keep the flow skeleton reusable.

Typical examples that should be treated this way include:

- periodic review / council flows
- contribution ranking and praise
- policy / strategy announcement
- work assignment and execution-cycle handoff
- map-based time skip / fast-forward
- reusable QTE or other minigame shells

## Genre Reference Rule

This project is a Taiko-like historical simulation game. Agents must not invent core gameplay concepts from scratch when established genre patterns already exist.

Before proposing or implementing a new gameplay loop, system concept, or pacing structure:

1. Check the existing repo for a corresponding mechanic first.
2. Align with classic Taiko-style and other proven historical simulation design patterns where applicable.
3. Reuse known genre concepts, cadence, and terminology unless the user explicitly asks for a deliberate deviation.
4. Only invent a new mechanic when existing repo structures and genre precedents both fail to fit the requirement.

In short:

- prefer extraction over duplication
- prefer reusable systems over temporary patches
- prefer genre-proven design over ad hoc invention
