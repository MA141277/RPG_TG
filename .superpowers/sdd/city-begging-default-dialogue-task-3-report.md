# Task 3 Report: Runtime Actions And Settlement Effects

## Status

DONE

## Summary

Implemented default-dialogue runtime action routing for `city-begging` without touching `src/main.ts`.

Added default-dialogue playable actions:

- `select-location`
- `select-option`
- `confirm-fortune`
- `tick`
- `confirm-outcome`

Added settlement support for selected option effects:

- `set_flag` writes the requested flag value to `state.core.runtime.variables[flagId]`.
- `add_grain` mutates shared player grain inventory through the existing grain inventory helper.
- `injure`, `restore_stamina`, and `restore_stamina_full` use player stamina helpers when a player id and character data are available.
- `add_bond`, `mod_attr`, `mod_weight`, `add_item`, and unsupported risk effects are persisted as explicit `var.city_begging.*` runtime variables.

Settlement is guarded to apply only from the `outcome` phase, then clears `beggingMiniGameState` and `core.runtime.playableSession`. Early `confirm-outcome` is handled but leaves the session active and does not apply settlement.

Legacy arcade city-begging `pointer`, `tick`, and `complete` behavior remains routed through the existing minigame path.

## Files Changed

- `tests/city-begging-default-runtime.test.cjs`
- `src/application/playables/city-begging/city-begging-default-dialogue.ts`
- `src/application/playables/city-begging/city-begging-default-settlement.ts`
- `src/application/playables/city-begging/city-begging-definition.ts`
- `src/core/runtime/playable-runtime.ts`

## TDD Evidence

Red 1:

```text
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-runtime.test.cjs }
```

Result: failed because `confirm-outcome` was unhandled (`false !== true`).

Red 2:

```text
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-runtime.test.cjs }
```

Result: failed because early `confirm-outcome` cleared the session before outcome.

Green:

```text
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-runtime.test.cjs }
```

Result: 6/6 tests passed.

Targeted verification:

```text
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-runtime.test.cjs tests/city-begging-runtime-status.test.cjs tests/interactive-runtime-status.test.cjs tests/runtime-dispatch-settlement.test.cjs }
```

Result: 14/14 tests passed.

## Notes

- Task 4 city entry placement was not implemented.
- Task 5 UI was not implemented.
- `src/main.ts` was not touched.
- Unrelated dirty files were not staged or committed.
