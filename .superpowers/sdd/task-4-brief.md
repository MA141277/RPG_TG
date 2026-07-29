## Task 4: Regeneration And Runtime Verification

**Files:**
- Modify: `src/content/scenario-packs/zhuyuanzhang/assets/maps/yuanmo-campaign-hex-grid-map2-runtime.json`
- Modify: `src/content/scenario-packs/zhuyuanzhang/maps.json`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-28-campaign-hex-runtime-grid-architecture-plan.md`
- Optionally modify: `docs/superpowers/project-progress.md`

**Interfaces:**
- Consumes: Tasks 1-3.
- Produces: regenerated runtime assets and verified browser behavior.

- [ ] **Step 1: Regenerate map3 runtime data**

Run:

```bash
node tools\build-yuanmo-runtime-grid-from-editor-package.cjs --input map3
```

Expected:

- Uses `map3`.
- Runtime grid cell count remains `13512` unless explicit filler cells were intentionally added and documented.
- Runtime grid `coordinateSystem.hexTerrainScale` is `138`.
- `maps.json` nodes are rewritten from map3 settlements, not old map nodes.

- [ ] **Step 2: Add final data contract assertions**

In `tests/robustness.test.cjs`, ensure tests assert:

```js
assert.equal(runtimeGrid.coordinateSystem.hexTerrainScale, 138);
assert.equal(runtimeGrid.counts.cells, generatedGrid.counts.cells);
assert.equal(runtimeGrid.source.editorOverlay.projection, "editor-grid-one-to-one-runtime-hex");
assert.equal(runtimeGrid.cells.some((cell) => cell.land === false), true);
assert.equal(runtimeGrid.cells.some((cell) => cell.land === true), true);
```

Also assert `maps.json` has no old duplicate fort-only nodes for the active Yuanmo map if that can be checked with existing map IDs.

- [ ] **Step 3: Run full targeted verification**

Run:

```bash
node --test --test-name-pattern "map3 runtime export keeps gameplay hex size|campaign terrain renderer uses loaded hex point bounds|runtime grid paths do not use default hex conversion|dynamic shoreline|loaded hex grid coordinate system" tests\robustness.test.cjs
npm run typecheck --silent
npm run build:test --silent
npm run build
npm run lint:plans
```

Expected:

- All commands pass.
- Existing Vite warnings are acceptable only if they already existed and do not affect map runtime.

- [ ] **Step 4: Browser verify runtime map**

Start the dev server if needed:

```bash
npm run dev -- --host 127.0.0.1
```

In the in-app browser:

- Open `http://127.0.0.1:5173/`.
- Start or continue the campaign.
- Confirm terrain is visible.
- Confirm player starts on land near the current node.
- Confirm buildings/settlement ground are visible where nodes exist.
- Confirm visible city labels match map3 settlements and old duplicated fortress coordinates are gone.
- Confirm there is no old-grid parallelogram clipping.
- Confirm the camera shows a local gameplay area instead of fitting the whole map to screen.

- [ ] **Step 5: Record final progress**

Update this plan:

- Check off completed Task 4 steps.
- Set `Execution State.Status` to `completed-but-open`.
- Set `Execution State.Current Focus` to `Review and push`.
- Set `Execution State.Next Step` to `Run final code review and push/close according to project governance.`
- Append a `Progress Log` entry with all verification commands and browser result.

## Exit Check

- [ ] Runtime map3 export has `hexTerrainScale = 138`.
- [ ] Runtime map3 export is one-to-one with map3 generated cells unless explicitly documented filler cells are added.
- [ ] No map3 export path projects into old `8509`-cell grid.
- [ ] Renderer does not use `coordinateSystem.hexTerrainScale / HEX_TERRAIN_SCALE` as map-size compensation.
- [ ] Terrain UV/hex/world conversions use the loaded coordinate service.
- [ ] Shoreline generation does not use default 138 helpers on runtime-grid paths.
- [ ] map3 water/land overrides are visible in runtime data and WebGL.
- [ ] City/village coordinates are derived from map3/editor cells.
- [ ] Browser verification shows no old-grid parallelogram clipping.
- [ ] Project progress sync is updated if this child becomes the active governance target.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
- [ ] Final review completed
- [ ] Push/closeout handled according to governance

## Child Closeout

- Closed Child: `Campaign Hex Runtime Grid Architecture`
- Parent Task: `Map Renderer Architecture`
- Parent Stage: `Map Renderer Architecture`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Run final review, push, and close only after all verification and remote push succeed.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-28-campaign-hex-runtime-grid-architecture-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then this plan, and resume at the first unchecked task.`



