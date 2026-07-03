# Child 33 Battle-Family Playable Migration Spec

**Goal:** Move `story-battle` onto the unified playable runtime as `family: "battle"` without flattening battle-specific semantics into ordinary minigame language.

## Why This Child Exists

The top-level playable runtime includes `battle` and `minigame` families under one shell, but `story-battle` should not move until the shell has already been proven by minigame-family work. This child exists to migrate shared ownership while keeping battle-specific semantics explicit.

Without a dedicated battle child, the queue would either:

- force battle into a minigame-shaped migration too early
- or leave battle outside the shared shell and preserve duplicated launch/result/handoff seams

## Baseline Snapshot

At baseline:

- story start callbacks still launch battle through `startStoryBattle()` from `src/application/story/story-callbacks.ts`
- active battle session still lives under `state.core.storyBattle`
- battle actions still route through `interactive.story-battle.action` and `src/core/runtime/interactive-runtime.ts`
- post-battle follow-up currently depends on battle runtime returning `enterHouseId`, which `interactive-runtime` maps to `{ type: "reenter-house" }`
- the current path has no formal `integrationId` and no shared battle-family playable definition

Detailed current ownership mapping is recorded in:

- `docs/superpowers/specs/2026-07-03-playable-current-state-inventory-and-ownership-matrix.md`

## In Scope

- migrating `story-battle` to the shared playable runtime
- registering `story-battle` as `family: "battle"`
- preserving battle-specific commands, layout, view model, and completion facts
- moving settlement and handoff ownership behind the shared playable shell
- proving that shared shell ownership does not require battle-semantic flattening

## Out Of Scope

- redesigning battle mechanics or content
- minigame-family migration already owned by earlier children
- scaffold / validator / CI closeout
- broader story runtime redesign beyond what the battle migration directly needs

## Expected End State

The target shape after Child 33 is:

```text
story callback / integration owner -> shared playable runtime -> story-battle (family: battle)
```

At end state:

- `story-battle` shares top-level runtime shell ownership with other playables
- battle-family semantics remain explicit in commands, presenter, and result detail
- post-battle return behavior is still correct

## Exit Conditions

- `story-battle` is owned by the shared playable runtime
- `story-battle` remains `family: "battle"`
- battle-specific command and presenter semantics remain explicit
- post-battle return behavior remains correct
- targeted regressions prove parity
- `npm run typecheck`
- `npm run build`

## Verification Story

Implementation must include:

- targeted checks for story-battle launch/action/completion routing
- targeted checks that battle-family presenter semantics remain intact
- checks that post-battle return still reaches the correct owner/house/session path

## Risk Notes

- The main risk is flattening battle into fake minigame vocabulary just to match earlier children.
- Another risk is moving battle launch onto the shared shell but leaving post-battle return logic implicit or guessed.
