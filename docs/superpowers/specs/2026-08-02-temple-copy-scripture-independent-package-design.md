# Temple Copy Scripture Independent Package Design

**Date:** 2026-08-02
**Status:** Superseded by `2026-08-02-unified-playable-shell-final-state-enforcement-design.md`
**Affected Playable:** `temple-copy-scripture`
**Task Classification:** `shared playable contract change` plus `house-hosted playable integration`
**Change Level:** shared-contract level
**House-Hosted Contract Rules Apply:** yes, but the historical `docs/special-house-interface.md` file referenced by skill docs has already been deleted from the repository; this design therefore follows the surviving playable/runtime/building-arrangement contracts plus the deletion record in `docs/change-log.md`.
**Governing References:**
- `AGENTS.md`
- `.codex/skills/playable-governance/SKILL.md`
- `.codex/skills/playable-governance/references/playable-doc-index.md`
- `.codex/skills/playable-governance/references/playable-governance-core.md`
- `.codex/skills/playable-governance/references/playable-change-checklist.md`
- `docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md`
- `docs/superpowers/specs/2026-07-03-playable-naming-and-artifact-conventions.md`
- `docs/superpowers/specs/2026-07-31-playable-minigame-independence-design.md`

## Goal

> Supersession note: this document captured an earlier same-day direction that split the temple mechanic package from a host adapter seam. That shape is no longer the accepted repository target because the later approved final-state rule forbids intermediate adapter layers, compatibility layers, and dual runnable paths. The active source of truth is [2026-08-02-unified-playable-shell-final-state-enforcement-design.md](/Users/ms/Desktop/workspace/RPG_TG/.worktrees/mod-first-dev/docs/superpowers/specs/2026-08-02-unified-playable-shell-final-state-enforcement-design.md:1).

Turn `temple-copy-scripture` into the first fully isolated minigame package under `src/minigames/temple-copy-scripture/`, with the gameplay package owning only its own launch contract, session state, command reducer, presenter model, and raw completion payload. RPG_TG host code must integrate it only through an adapter layer that maps runtime launch input, event/building context, settlement, and owner return.

After this slice:

- the minigame package no longer imports `RuntimeState`, `ActivityDefinition`, `CharacterDefinition`, `main.ts`, `appState`, or the old `activity-qte` playable internals
- the temple building flow still starts through Script Editor-authored building arrangement / event / playable launch content
- the shared playable runtime can fully launch, play, settle, and hand off the temple minigame in the browser
- Script Editor can keep treating it as an optional playable/integration record instead of a hardwired engine special case

## Why This Slice Exists

The repository already has the temple action routed through the new building behavior path:

- temple arrangement action menu
- event binding
- event `launchPlayable`
- playable runtime

That path is correct, but the actual `temple-copy-scripture` implementation is not yet an independent package. The current files under `src/minigames/temple-copy-scripture/` are only a thin wrapper around `activity-qte`, and runtime ownership still contains temple-specific branches. This makes the feature look independent in content while still being host-owned in code.

This slice fixes that mismatch and creates the first sample for future standalone minigame packages.

## Current Mismatch Snapshot

The current codebase diverges from the intended package boundary in four direct ways:

1. `src/minigames/temple-copy-scripture/runtime.ts` imports:
   - `RuntimeState`
   - `ActivityDefinition`
   - `CharacterDefinition`
   - `PlayableOwnerContext`
   - `activity-qte` implementation functions

2. `src/core/runtime/playable-runtime.ts` hardcodes `temple-copy-scripture` launch, action, tick, and exit branches instead of consuming a package adapter seam.

3. `src/main.ts` still special-cases `temple-copy-scripture` in `createActivityShellActionId()`, which means shell action wiring still knows about this one mechanic directly.

4. Script Editor and scenario-pack content already advertise `temple-copy-scripture` as a standalone playable template, but the package behind that template is not actually standalone.

## Design Principles

1. **Package owns mechanic only**
   - The package may know about scripture-copying rules, score, timing, prompts, mistakes, completion thresholds, and render-facing state.
   - The package may not know about building sessions, event routing, settlement effects, or RPG_TG runtime state shape.

2. **Host owns adaptation only**
   - The host adapter may read scenario payloads and activity definitions.
   - The host adapter may produce settlement effects and owner handoff.
   - The host adapter may not contain scripture-copying game rules.

3. **Content remains authored through shared playables**
   - Temple building behavior still goes through arrangement -> event binding -> `launchPlayable`.
   - No new `src/main.ts` business branch is allowed.
   - No direct building-specific lifecycle ownership returns to local code.

4. **Portable by default**
   - Another project should be able to reuse `src/minigames/temple-copy-scripture/` and replace only the adapter and shared runtime glue.

## Proposed Package Boundary

The isolated package lives entirely under:

```text
src/minigames/temple-copy-scripture/
```

### Package-Owned Exports

The package should export only package-local mechanics:

- `TEMPLE_COPY_SCRIPTURE_PACKAGE_ID`
- `TempleCopyScriptureLaunchConfig`
- `TempleCopyScriptureCommand`
- `TempleCopyScriptureSession`
- `TempleCopyScripturePresenterModel`
- `TempleCopyScriptureCompletion`
- `createTempleCopyScriptureSession()`
- `reduceTempleCopyScriptureSession()`
- `presentTempleCopyScriptureSession()`

Those types must be plain TypeScript data contracts. They must not depend on repository runtime types.

### Forbidden Package Imports

The package must not import:

- `../../core/contracts/runtime-state`
- `../../domain/activity`
- `../../domain/character`
- `../../application/playables/activity-qte/*`
- `../../main`
- any house/building/event/dialogue/session module

### Allowed Package Inputs

The package may accept launch data such as:

- prompt deck
- score target
- round count
- timing window
- UI labels
- difficulty knobs

All such data must arrive as package-local config or command payload, not via host state access.

## Host Adapter Boundary

The host integration layer should sit outside the package in a dedicated adapter seam, for example:

```text
src/application/playables/builtin/temple-copy-scripture/
  temple-copy-scripture-adapter.ts
  temple-copy-scripture-settlement.ts
  index.ts
```

The adapter owns:

- converting `launchPlayable` payload plus activity definition into `TempleCopyScriptureLaunchConfig`
- launching a package session
- translating shared playable commands into package commands
- converting package presenter state into `PlayablePresenterModel`
- translating package completion into shared `PlayableResult`
- mapping outcome and metrics into settlement effects and optional follow-up event

The adapter does **not** own:

- building trigger authoring
- event binding authoring
- package-internal minigame rules
- shell-specific button id guessing in `main.ts`

## Shared Runtime Change

This slice is a shared-contract change because the current playable runtime has no clean way to host a package-local mechanic without hardcoded branches.

The minimal allowed shared change is:

- add a registry or definition-backed adapter lookup for package-hosted playables
- route `temple-copy-scripture` through that seam
- remove the temple-specific branch from `src/main.ts`

This does **not** require a full rewrite of every playable family in one batch. It only needs a stable seam that the first standalone package can use without teaching `main.ts` and runtime shell code about temple-specific actions.

## Script Editor And Content Authoring

Script Editor support stays optional and content-facing:

- `playables.json` continues to define `temple-copy-scripture`
- `playable-integrations.json` continues to define concrete integration records
- `events.json` continues to launch the playable by `playableId` and `integrationId`
- the editor may list this package as a builtin playable option

What changes is the implementation behind that content:

- the editor should no longer imply that the standalone template is backed by `activity-qte`
- template/export tests should validate `temple-copy-scripture` as its own builtin option
- editor integration records remain authoring data, not implementation glue

## Browser Runtime Expectation

The browser path that must work end to end is:

1. open the Huangjue Temple building
2. choose `抄经`
3. trigger `event.building.house.kulan.temple.copy_scripture`
4. launch `temple-copy-scripture`
5. play through completion or cancel
6. receive shared settlement / owner handoff
7. return to the temple host state without shell-specific hacks

This acceptance path is mandatory because the playable is hosted from a building action and must prove the new package/adapter split does not break the authored route.

## Non-Goals

This slice does not attempt to:

- redesign every existing minigame into the same package form immediately
- add a new top-level playable family
- make Script Editor invent package code
- change temple building layout or unrelated monastery flows
- rewrite the whole playable runtime registry architecture beyond the minimum adapter seam needed here

## Allowed Layers To Change

- `src/minigames/temple-copy-scripture/**`
- shared playable runtime glue and registries
- temple playable adapter / settlement layer
- Script Editor builtin playable listing and export/import expectations
- scenario pack playable/integration/event records if they must be normalized
- browser/runtime regression tests
- `docs/change-log.md`

## Project Areas Potentially Impacted

- shared playable runtime dispatch
- playable definition / integration registries
- Script Editor builtin playable options and template export expectations
- temple event launch content
- browser smoke coverage for building-hosted playables

## Acceptance Criteria

1. `src/minigames/temple-copy-scripture/` is a self-contained package whose public API does not depend on RPG_TG runtime state, event/dialogue/main/appState internals, or `activity-qte` implementation helpers.
2. A host adapter layer outside the package owns launch mapping, presenter conversion, settlement, and return flow.
3. `src/main.ts` no longer contains `temple-copy-scripture` shell-action special handling.
4. Shared playable runtime launches `temple-copy-scripture` through the adapter seam rather than direct temple-specific logic.
5. Script Editor can still optionally export/import and list the temple playable as a standalone playable/integration record.
6. Browser verification proves temple building -> event -> playable -> play -> settlement -> return works end to end.

## Implementation Direction

Implement this in three steps:

1. lock the independence boundary with failing tests
2. extract the package and adapter seam
3. re-run runtime, Script Editor, and browser acceptance with change-log synchronization
