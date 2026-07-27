## Task 3: Verification, Visual QA, And Governance Sync

**Files:**
- Modify: `docs/superpowers/plans/2026-07-26-campaign-map-space-volumetric-cloud-plan.md`
- Modify: `docs/superpowers/project-progress.md`
- Modify: `docs/change-log.md`
- Read: `package.json`
- Read: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: completed Task 1 and Task 2 commits
- Produces: screenshot `.tmp/campaign-map-space-volumetric-cloud.png`
- Produces: plan `Execution State.Status = completed-but-open` unless push and closeout are explicitly completed

- [ ] **Step 1: Run plan lint**

Run:

```powershell
npm run lint:plans
```

Expected:

- `PASS`.

- [ ] **Step 2: Run targeted cloud tests**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud map-space volumetric slab|campaign cloud render keeps flowing cloud animation timing|campaign cloud freezes animation during map drag and zoom|campaign cloud stays frozen briefly after repeated zoom input stops|campaign fog exploration stays active without the removed shader renderer" tests/robustness.test.cjs }
```

Expected:

- `PASS`.

- [ ] **Step 3: Run typecheck and production build**

Run:

```powershell
npm run typecheck
npm run build
```

Expected:

- `PASS`.
- Existing Vite warnings are acceptable only if the build exits with code `0`.

- [ ] **Step 4: Start or reuse the dev server**

Run:

```powershell
npm run dev -- --host 127.0.0.1
```

Expected:

- Vite serves the app on a local port, usually `http://127.0.0.1:5173/`.
- If that port is occupied, use the printed Vite URL.

- [ ] **Step 5: Browser visual verification**

Use Playwright or the available browser tooling to:

1. Open the Vite URL.
2. Start or load the default campaign flow.
3. Wait for `[data-campaign-map-terrain]` and `[data-campaign-map-cloud]`.
4. Confirm both canvases have ready classes or nonzero dimensions.
5. Pan and zoom the map.
6. Capture `.tmp/campaign-map-space-volumetric-cloud.png`.

Expected:

- Cloud canvas is nonblank.
- Terrain remains visible below cloud.
- Cloud holes remain aligned to explored Hexes.
- Cloud body does not visually behave like a purely fixed screen texture during pan/zoom.
- Markers, hover overlays, and debug/global UI remain above the cloud layer.

- [ ] **Step 6: Update change log**

Append a dated entry near the top of `docs/change-log.md`:

```md
## 2026-07-26 Campaign Map-Space Volumetric Cloud Slab

- `campaign-cloud-webgl.ts` now uploads terrain-owned cloud projection uniforms so the cloud shader can render the campaign cloud body in terrain/map space while preserving the existing reveal texture lifecycle.
- `campaign-cloud.frag.glsl` replaces the primary screen-space cloud sea with a conservative fixed-budget map-space cloud slab raymarch using procedural density, wind drift, lightweight top/bottom lighting, and early alpha termination.
- The change keeps explored Hex reveal masks, drag/zoom animation freeze, terrain chunk reveal holds, and `window.rpgCloud` behavior within the existing cloud overlay boundary; it does not modify exploration state, terrain height, navigation, map nodes, save data, or `src/main.ts`.
```

- [ ] **Step 7: Update project progress and plan state**

Update `docs/superpowers/project-progress.md`:

- `Current Task`: `Campaign Map-Space Volumetric Cloud`
- `Current Task Status`: `completed-but-open`
- `Current Child`: `Campaign Map-Space Volumetric Cloud`
- `Current Child Status`: `completed-but-open`
- `Next Required Action`: `review-and-push-campaign-map-space-volumetric-cloud`
- `Next Owner Document`: `docs/superpowers/plans/2026-07-26-campaign-map-space-volumetric-cloud-plan.md`
- `Push Status`: `not-pushed`
- `Push Commit`: `none`
- `Resume From`: `Open docs/superpowers/project-progress.md, then review and push docs/superpowers/plans/2026-07-26-campaign-map-space-volumetric-cloud-plan.md; do not close until push succeeds and the known child 27 baseline is accepted or resolved.`

Update this plan:

- Mark Task 3 checkboxes complete except closeout-only items.
- Set `Execution State.Status` to `completed-but-open`.
- Set `Execution State.Current Focus` to `Implementation and verification complete locally; review/push remain before closeout.`
- Set `Execution State.Next Step` to `Review final diff and push when requested; do not mark closed while remote push is absent and known child 27 baseline remains unresolved.`
- Set `Execution State.Verification` to the exact command results from Steps 1-5.
- Append a `Progress Log` entry with verification and screenshot path.

- [ ] **Step 8: Commit Task 3**

Run:

```powershell
git add docs/superpowers/plans/2026-07-26-campaign-map-space-volumetric-cloud-plan.md docs/superpowers/project-progress.md docs/change-log.md .tmp/campaign-map-space-volumetric-cloud.png
git commit -m "docs: record campaign map-space cloud verification"
```

Expected:

- Commit succeeds.
- If `.tmp/` is ignored, do not force-add the screenshot; record its path in the plan progress log and commit the docs only.

