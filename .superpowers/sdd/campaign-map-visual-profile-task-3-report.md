# Campaign Map Visual Profile Task 3 Report

Status: DONE

## Files Changed

- `src/domain/map.ts`
- `src/content/yuanmo-campaign-map.ts`
- `src/ui/views/map/map-view.ts`
- `tests/robustness.test.cjs`

## Commit Hashes

- `0902d110206eaa3a71ce01a4428908d88bdad1cc` - `refactor: drive campaign structure visuals from map nodes`

## RED

Command:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign map structures are node-driven instead of hardcoded Yuanmo building state" tests/robustness.test.cjs }
```

Observed failure summary:

- `npm run build:test` completed successfully.
- The targeted test failed as expected.
- Failure reason: `assert.match(mapDomainSource, /structureVisual\?:/)` failed because `MapNode.structureVisual` was not yet declared.

## GREEN

Command:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign map structures are node-driven instead of hardcoded Yuanmo building state" tests/robustness.test.cjs }
```

Observed pass summary:

- `npm run build:test` completed successfully.
- The targeted test passed: 1 test, 1 pass, 0 failures.

## Self-Review Notes

- `MapNode` now supports `structureVisual?: { kind: "settlement-building" }`.
- The Yuanmo Haizhou/Fenyang settlement node declares the settlement building visual in map data.
- `CampaignMarker` carries `structureVisual` from the node model.
- `renderCampaignStructureVisuals` consumes `campaignStructureProfile.settlementBuildingImageUrl`.
- The old `YUANMO_HEX_BUILDING` constant, `renderCampaignHexBuilding`, direct map-view building asset import, and duplicate hotspot button are removed.
- Semantic marker interaction remains in `renderCampaignMarkers`.
- No Task 4 canvas profile URL attribute refactor was implemented.

## Concerns

- None.

## Review Fix: visualKind Contract

### Files Changed

- `src/domain/map.ts`
- `src/content/yuanmo-campaign-map.ts`
- `tests/robustness.test.cjs`

### Commit Hash

- `9054e5774d6e95d2032078b272ff4d2c7196ddf9` - `fix: add campaign structure visual kind contract`

### RED

Command:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign map structures are node-driven instead of hardcoded Yuanmo building state" tests/robustness.test.cjs }
```

Observed failure summary:

- `npm run build:test` completed successfully.
- The targeted test failed as expected.
- Failure reason: `assert.match(mapDomainSource, /visualKind\?:\s*"structure"/)` failed because `MapNode.visualKind` was not yet declared.

### GREEN

Command:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign map structures are node-driven instead of hardcoded Yuanmo building state" tests/robustness.test.cjs }
```

Observed pass summary:

- `npm run build:test` completed successfully.
- The targeted test passed: 1 test, 1 pass, 0 failures.

### Self-Review

- `MapNode` now declares `visualKind?: "structure"` alongside the existing `structureVisual` metadata.
- The Yuanmo `settlement.fenyang_province` node now sets `visualKind: "structure"` and keeps the existing `structureVisual: { kind: "settlement-building" }`.
- The focused robustness test now proves both the interface contract and the Yuanmo node data contract.
- `src/ui/views/map/map-view.ts` was not changed, so no duplicate hotspot button was added.
- No Task 4 canvas profile URL attribute refactor was implemented.
