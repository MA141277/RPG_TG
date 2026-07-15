# House Primary Actor Flow Design

## 1. Goal

Define a shared house interaction rule for primary house actors.

For every special house with `HouseDefinition.defaultCharacterId`, entering the house should begin with that primary actor's dialogue, and the primary actor should appear as the first actor in the left-side house roster. The primary actor must not be rendered as a separate right-side owner card or nonstandard owner-only portrait. Ordinary character dialogue should still render the current speaker portrait on the dialogue box, matching the scene dialogue pattern.

This applies to examples such as the temple abbot and tavern boss, and should also cover other service or owner-like houses that have a stable `defaultCharacterId`.

## 2. Current Repository State

The existing house contract already provides the right metadata and lifecycle:

- `HouseDefinition.defaultCharacterId` identifies the stable default actor for a house.
- Special house modules enter through `moduleId` and registry wiring.
- House modules expose `HouseModuleViewModel`.
- `HouseModuleViewModel.standbyRoster` is the structured actor roster consumed by house UI.
- `HouseModuleViewModel.dialogue` carries the active dialogue speaker and text.

Current mismatches:

- Temple and tavern enter flows already create greeting dialogue, but their UI treatment is inconsistent.
- Temple currently removes the abbot from the left-side roster in normal idle mode and renders that actor through `renderHouseIdleOwner()` on the right.
- Tavern currently shows the boss in the left-side roster only when idle, while active dialogue relies on a portrait path that is not clearly distinguished from the owner-card special case.
- Shared `renderHouseDialogue()` must render the current speaker portrait as dialogue UI, not as a separate house owner surface.
- Other house modules may build rosters in module-specific ways, so primary actor ordering is not guaranteed by a shared rule.

## 3. House Contract Rule

For special houses with `defaultCharacterId`:

1. `defaultCharacterId` is the primary house actor.
2. `enter()` should initialize the house session so the first visible house state is dialogue from the primary actor unless a higher-priority lifecycle state takes over, such as a meeting, story event, refusal, or playable restoration.
3. `selectViewModel()` should include the primary actor in `standbyRoster`.
4. The primary actor should be the first `standbyRoster` entry.
5. Secondary fixed actors and city activity actors should follow the primary actor.
6. The primary actor may be marked selected while speaking, but must not be removed from the roster just because dialogue is active.
7. Ordinary house dialogue should render the active speaker portrait through the same dialogue-box portrait pattern used by scene dialogue.
8. Meeting or council views may keep dedicated seating layouts, but they still should not reintroduce a generic right-side owner card.

Houses without `defaultCharacterId` should continue to render their available roster without inventing a primary actor.

## 4. Architecture

The implementation should keep the existing special-house interface:

- Domain metadata remains on `HouseDefinition.defaultCharacterId`.
- Application modules continue to own `enter`, `dispatch`, `leave`, and `selectViewModel`.
- UI renderers consume `HouseModuleViewModel`.
- No house-specific business branch should be added to `src/main.ts`.
- No application module should return HTML.
- No new persistent house state is needed for this visual and flow rule.

The preferred implementation is a small shared helper for roster construction or ordering, used by modules that currently hand-build `standbyRoster`. This helper should:

- accept a primary character id, candidate actors, and any extra actor metadata;
- deduplicate actors by `characterId`;
- place the primary actor first when present;
- preserve stable ordering for remaining actors.

This keeps the rule in the application/view-model boundary instead of spreading it across renderers.

## 5. UI Rendering Rule

The left-side roster becomes the normal place to show house actors, including the primary actor.

Rendering changes should:

- stop using `renderHouseIdleOwner()` for primary house actors;
- render temple daily actors through `renderHouseStandbyRoster()` with the abbot first;
- render tavern actors through `renderHouseStandbyRoster()` with the boss first even during dialogue;
- update ordinary shared dialogue rendering so character dialogue shows the current speaker portrait on the dialogue box without reintroducing a separate owner card;
- preserve specialized overlays and minigame/table UI.

The dialogue view may keep `speakerName`, `characterId`, portrait metadata, and text lines. It should not depend on `position: "right"` for normal house scenes.

## 6. Scope

In scope:

- temple daily house flow and abbot roster placement;
- tavern boss roster placement and dialogue rendering;
- other special house modules that already use `defaultCharacterId` and `standbyRoster`;
- shared renderer cleanup for the right-side owner/portrait pattern;
- contract documentation updates in `docs/special-house-interface.md`;
- change-log entry in `docs/change-log.md`;
- focused tests for roster ordering and renderer behavior.

Out of scope:

- redesigning council or meeting seating layouts;
- changing house gameplay actions, prices, rewards, stamina, time costs, or activity rules;
- changing scene/dialogue runtime outside house views;
- replacing current portrait assets;
- adding new house modules.

## 7. Data Flow

Target flow:

1. The player enters a house.
2. Generic house runtime resolves `HouseDefinition` and `moduleId`.
3. The module `enter()` creates a typed session state with primary actor dialogue when appropriate.
4. The module `selectViewModel()` resolves actors and orders `standbyRoster` with `defaultCharacterId` first.
5. The house renderer draws the left roster, dialogue text, and dialogue-box speaker portrait from the view model.
6. User actions dispatch back through the existing generic house runtime.

No direct house-specific branch is required in `src/main.ts`.

## 8. Edge Cases

- If `defaultCharacterId` is `null`, the module should not synthesize a fake primary actor.
- If the primary character id is not found in character definitions, existing module assertions may continue to fail because house content is invalid.
- If a module has a higher-priority entry state, such as a scheduled review meeting, that state can replace the normal greeting.
- If a dialogue override uses the player as speaker, the left roster can still remain visible; the dialogue speaker metadata carries the speaker identity.
- If a playable overlay is active, overlays can cover the scene as they do today.

## 9. Verification

Implementation should include focused verification that:

- temple daily `standbyRoster[0]` is the abbot when the temple has `defaultCharacterId`;
- tavern `standbyRoster[0]` is the tavern boss while greeting/open dialogue is active;
- the temple renderer no longer calls `renderHouseIdleOwner()` for ordinary daily mode;
- ordinary house dialogue markup includes the current speaker portrait as dialogue UI and does not include a separate owner card;
- `src/main.ts` gains no new house-specific business branch for this rule.

Full verification should include:

- `npm run typecheck`
- focused relevant tests
- `npm test` when practical after focused tests pass

## 10. Documentation Updates

Because this changes shared house view-model and rendering expectations, implementation must update:

- `docs/special-house-interface.md`
- `docs/change-log.md`
