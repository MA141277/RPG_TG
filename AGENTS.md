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
