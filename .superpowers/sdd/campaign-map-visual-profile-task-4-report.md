# Campaign Map Visual Profile Task 4 Report

## Status

DONE

## Files Changed

- `src/ui/views/map/map-view.ts`
- `tests/robustness.test.cjs`

## Commit Hashes

- `5847d1db` - `refactor: pass campaign structure profile urls to renderer`

## RED Command And Observed Failure Summary

Command:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign terrain canvas receives structure profile urls as renderer attributes" tests/robustness.test.cjs }
```

Observed result:

- `npm run build:test` completed successfully.
- Targeted test failed as expected.
- Failure was `AssertionError [ERR_ASSERTION]` because `map-view.ts` did not match `/data-campaign-structure-profile-id/`, confirming the missing renderer profile attribute.

## GREEN Command And Observed Pass Summary

Command:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign terrain canvas receives structure profile urls as renderer attributes" tests/robustness.test.cjs }
```

Observed result:

- `npm run build:test` completed successfully.
- Targeted test passed: `1` test, `1` pass, `0` fail.

## Self-Review Notes

- `renderCampaignMapVisualLayer` now derives canvas city mesh attributes from `model.campaignStructureProfile`.
- Canvas markup now emits `data-campaign-structure-profile-id`, `data-campaign-city-mesh-url`, and `data-campaign-city-texture-url`.
- Removed obsolete `cityDepthMeshAssetUrl` and `cityDepthTextureUrl` fields from `MapViewModel` and `createMapViewModel`.
- Did not port the shoreamend renderer or add fort/city/wall rendering logic.
- `git diff --check -- src/ui/views/map/map-view.ts tests/robustness.test.cjs` reported only checkout line-ending warnings, with no whitespace errors.

## Concerns

- No Task 4 implementation concerns.
- SDD subagent review could not be performed because no subagent dispatch tool is exposed in this session; a manual self-review was performed instead.
