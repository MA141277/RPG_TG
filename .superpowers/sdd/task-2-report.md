# Task 2 Report: Character Detail Targeting For Any NPC

## Implementation

- Added `openPlayerDetail(appState)`, `openCharacterDetail(appState, characterId)`, and `closeGlobalOverlay(appState)` in `src/application/app-actions.ts`.
- Kept `updateOverlayView()` for existing cards and valuables callers.
- Updated the global click handler in `src/main.ts` so:
  - close overlay actions call `closeGlobalOverlay()` and clear `ui.detailCharacterId`;
  - player detail actions call `openPlayerDetail()` and clear `ui.detailCharacterId`;
  - generic NPC profile buttons with `[data-npc-action='profile'][data-character-id]` call `openCharacterDetail()`.
- Updated `src/ui/app-render.ts` detail overlay rendering to resolve `gameState.ui.detailCharacterId` against `appState.characterDefinitions`, falling back to the pinned/player detail character when no arbitrary target exists or the target cannot be found.
- Did not migrate house rosters and did not add NPC menu rendering.
- Did not modify player base stats, money, skills, inventory, or NPC persistent state.

## TDD RED Evidence

Command:

```powershell
npm run build:test; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }; node --test tests/robustness.test.cjs --test-name-pattern "character detail"
```

Result: failed as expected after adding tests before production code.

Expected failures:

- `global NPC interaction character detail can target a non-player NPC`
  - `TypeError: openCharacterDetail is not a function`
- `player detail clears the NPC detail target and uses the pinned player fallback`
  - `TypeError: openPlayerDetail is not a function`
- `closing global overlay clears the arbitrary character detail target`
  - `TypeError: closeGlobalOverlay is not a function`

## GREEN / Verification

Focused command:

```powershell
npm run build:test; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }; node --test tests/robustness.test.cjs --test-name-pattern "character detail"
```

Result: passed. The command ran `tests/robustness.test.cjs` with 311 tests passing, 0 failing.

Additional commands:

```powershell
npm run typecheck
```

Result: passed, exit 0.

```powershell
npm test
```

Result: passed, 312 tests passing, 0 failing.

## Modified Files

- `src/application/app-actions.ts`
- `src/ui/app-render.ts`
- `src/main.ts`
- `tests/robustness.test.cjs`
- `.superpowers/sdd/task-2-report.md`

## Self-Review Findings

- `src/main.ts` changes are generic UI event handling only; no house id, module id, or NPC id business checks were added.
- `closeGlobalOverlay()` only clears global overlay state and arbitrary detail target. It does not clear `npcInteractionSession`.
- Player detail opening clears `detailCharacterId`, preserving the existing player fallback path.
- Detail rendering reuses the existing character detail view and only changes the selected character input.
- `src/domain/global-ui.ts` already contained `GlobalUIState.detailCharacterId`, so no interface edit was required.

## Questions Or Risks

- The focused test examples from the brief were usable as-is with the current `AppState`/`createRuntimeState` factories; no behavior adaptation was needed.
- The new generic NPC profile click handler is in the existing `appElement` delegated click listener rather than a separate `document.body` listener, matching the current event structure while preserving the same selector and behavior.
