Original prompt: D:\model，这个文件夹下放了一些城市建筑，你需要：在fort中放随机的放置一些这些建筑，以让该格子看起来更像一个城市；树木需要对建筑和城墙进行避障，以防止二者穿模

## 2026-07-23

- Added generated, designer-editable fort city mesh assets and rules under the zhuyuanzhang scenario pack.
- Added deterministic fort city placement in the campaign terrain renderer.
- Added tree avoidance against fort wall centers and fort building footprints.
- Verification run so far: typecheck and production build pass; full test suite still fails on three pre-existing static asset expectation tests unrelated to fort city rendering.
- Browser smoke check entered the Zhu Yuanzhang campaign map on the Vite dev server. The terrain canvas reached `is-ready`, no DOM error class or console error was observed, and inspected screenshots showed buildings inside the Haozhou fort cell without obvious wall/tree clipping.
- Follow-up changed built-in fort city buildings from post-map mesh fetches to a pre-registered in-memory asset keyed by `builtin.zhuyuanzhang.fort-city`.
- Fort city rules now target 10-15 buildings per visible city/fort, cap same-screen buildings with `lod.maxVisibleInstances`, and include `settlement.fenyang_province` so Haozhou uses the wall+building treatment instead of the old `city_hun` depth model.
- Verified with Playwright that fort-city JSON requests happen before entering the map, no post-start-adventure building mesh fetches occur, `data-campaign-city-mesh-url` is absent, and Haozhou renders as a fortified wall+building city. Build and typecheck pass; full tests still fail only on the known three static assertions.
- Follow-up fixed fort-city building overlap by replacing pure random scatter with deterministic random best-candidate sampling inside the hex range, checking spacing against scaled building footprints, keeping the original building scale, and removing the no-spacing fallback placement path.
- Follow-up changed fort-city variant selection from one weighted pick per slot to a per-city variant attempt queue that prioritizes unused or less-used building variants, so uncommon or large models get a real chance to appear before a slot is skipped.
- Follow-up split fort-city buildings into their own fragment shader pass, keeping tree lighting separate and using building model normals directly so the lit and backlit sides are no longer reversed by vegetation double-sided shading.
- Follow-up added settlement villages: ordinary settlement hexes now generate 2-6 building clusters from the same preloaded building mesh pool, while city/fort/fortified settlement visuals win when they share a hex.
- Added village/city ground texture layers from the provided `field.png` and `land.png`, with the terrain semantic texture B channel driving village farmland and city bare-ground replacement over the original grass.
- Verification: `npm run typecheck` and `npm run build` pass. No screenshot verification was run for this follow-up.
- Follow-up changed village/city ground texture sampling from global land tiling to per-hex local UVs, so each structured ground tile roughly uses one full source image instead of stretching one image across many map cells.
- Follow-up increased campaign terrain hex grid stroke width from `0.026` to `0.042` while keeping the existing border color and opacity path unchanged.
- Follow-up removed the current `land.png` city ground layer registrations and copied city ground PNG assets, so city/fort/fortified settlement cells fall back to the original terrain surface while village farmland remains active.
- Follow-up doubled campaign marker label font size to `20px` and widened label truncation to `256px`; marker dot size remains unchanged.
