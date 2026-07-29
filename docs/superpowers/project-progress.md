# Project Progress

## Current State

- Current Stage: `House Local Gameplay`
- Current Stage Status: `running`
- Current Task: `Tavern Short Gamble`
- Current Task Status: `running`
- Current Child: `Tavern Short Gamble`
- Current Child Status: `running`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `review-tavern-short-gamble-claim-locking`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-28-tavern-short-gamble-plan.md`
- Last Closed Item: `none`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then review docs/superpowers/plans/2026-07-28-tavern-short-gamble-plan.md and the current diff.`

## Progress Log

- 2026-07-29
  - Summary: `Locked short-table post-claim discard flow behind typed runtime state: the claimed discard plus consumed claim cards now stay visible but non-discardable through pendingIncomingCard.lockedCardIds, duplicate claim clicks are ignored outside claim-window, and the short renderer no longer auto-wires discard actions for cards without an explicit actionId.`
  - Verification: `C:\\Users\\29636\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\bin\\node.exe .\\node_modules\\typescript\\bin\\tsc -p tsconfig.test.json passed; C:\\Users\\29636\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\bin\\node.exe --test --test-isolation=none tests/tavern-short-gamble-domain.test.cjs tests/tavern-short-gamble-house.test.cjs tests/tavern-short-gamble-ui-contract.test.cjs passed 33/33; C:\\Users\\29636\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\bin\\node.exe --test --test-isolation=none --test-name-pattern "tavern short gamble|tavern long gamble|tavern gamble" tests/robustness.test.cjs passed 13/13; C:\\Users\\29636\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\bin\\node.exe .\\node_modules\\typescript\\bin\\tsc --noEmit -p tsconfig.json passed.`
  - Next: `Keep the temporary tavern-entry debug bypass unchanged, then review/commit the tavern short-table claim-locking follow-up when requested.`

- 2026-07-29
  - Summary: `Added a dedicated exposed-meld row for each tavern short-table player by persisting typed short-session meldHistory, mapping it into per-player meldLabels, and rendering that row separately from the existing discard strip.`
  - Verification: `C:\\Users\\29636\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\bin\\node.exe .\\node_modules\\typescript\\bin\\tsc -p tsconfig.test.json passed; node --test --test-isolation=none tests/tavern-short-gamble-domain.test.cjs tests/tavern-short-gamble-house.test.cjs tests/tavern-short-gamble-ui-contract.test.cjs passed 29/29; node --test --test-isolation=none --test-name-pattern "tavern short gamble|tavern long gamble|tavern gamble" tests/robustness.test.cjs passed 13/13; C:\\Users\\29636\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\bin\\node.exe .\\node_modules\\typescript\\bin\\tsc --noEmit -p tsconfig.json passed; C:\\Users\\29636\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\bin\\node.exe .\\tools\\lint-superpowers-plans.mjs passed for 75 files.`
  - Next: `Keep the temporary tavern-entry debug bypass unchanged, then review/commit the tavern short-table exposed-meld-row follow-up when requested.`

- 2026-07-29
  - Summary: `Added a short-table claim countdown owned by the tavern short session and house tick wiring: non-upstream pong/kong claim windows now start at 10 seconds, auto-pass on expiry, skip the timer for chow-only or upstream exceptions, and clear the countdown immediately once the player accepts pong/kong and enters discard selection.`
  - Verification: `C:\\Users\\29636\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\bin\\node.exe .\\node_modules\\typescript\\bin\\tsc -p tsconfig.test.json passed; node --test --test-isolation=none tests/tavern-short-gamble-domain.test.cjs tests/tavern-short-gamble-house.test.cjs tests/tavern-short-gamble-ui-contract.test.cjs passed 27/27; node --test --test-isolation=none --test-name-pattern "tavern short gamble|tavern long gamble|tavern gamble" tests/robustness.test.cjs passed 13/13; C:\\Users\\29636\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\bin\\node.exe .\\node_modules\\typescript\\bin\\tsc --noEmit -p tsconfig.json passed; C:\\Users\\29636\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\bin\\node.exe .\\tools\\lint-superpowers-plans.mjs passed for 75 files.`
  - Next: `Keep the temporary tavern-entry debug bypass unchanged, then review/commit the tavern short-table claim-countdown follow-up when requested.`

- 2026-07-29
  - Summary: `Added an explicit short-table debug preset toggle to the tavern wager overlay, stored the selected debug mode under the tavern short table session, and introduced a deterministic pong -> kong -> chow hand cycle so consecutive debug hands reliably expose 碰 / 杠 / 吃 claim windows without touching normal shuffle flow or the temporary tavern-entry debug bypass.`
  - Verification: `C:\\Users\\29636\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\bin\\node.exe .\\node_modules\\typescript\\bin\\tsc -p tsconfig.test.json passed; node --test --test-isolation=none tests/tavern-short-gamble-house.test.cjs tests/tavern-short-gamble-ui-contract.test.cjs passed 15/15; node --test --test-isolation=none tests/tavern-short-gamble-domain.test.cjs tests/tavern-short-gamble-house.test.cjs tests/tavern-short-gamble-ui-contract.test.cjs passed 21/21; node --test --test-isolation=none --test-name-pattern "tavern short gamble|tavern long gamble|tavern gamble" tests/robustness.test.cjs passed 13/13; C:\\Users\\29636\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\bin\\node.exe .\\tools\\lint-superpowers-plans.mjs passed for 75 files; C:\\Users\\29636\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\bin\\node.exe .\\node_modules\\typescript\\bin\\tsc --noEmit -p tsconfig.json passed.`
  - Next: `Keep the temporary tavern-entry debug bypass unchanged, then review/commit the tavern short-table debug claim-cycle follow-up when requested.`

- 2026-07-28
  - Summary: `Completed the unified player item inventory migration locally after subagent implementer/reviewer dispatch failed with external deployment 404s; medicine-house and market-house inventory now normalize into var.player_inventory.item.*, and backpack projection reads the shared helper while grain stays on var.player_inventory.grain_dou.`
  - Verification: `bundled node .\tools\lint-superpowers-plans.mjs` passed; `bundled node .\node_modules\typescript\bin\tsc -p tsconfig.test.json` + `Set-Content .test-dist\package.json {"type":"commonjs"}` + `bundled node --test --test-isolation=none tests/unified-backpack-inventory.test.cjs tests/backpack-ui-contract.test.cjs` passed 16/16; `bundled node .\node_modules\typescript\bin\tsc -p tsconfig.test.json` + `Set-Content .test-dist\package.json {"type":"commonjs"}` + `bundled node --test --test-isolation=none --test-name-pattern "market house can open trade overlay and execute buy flow|market house can sell legacy-only goods through normalized player item inventory|medicine house heal and buy update fatigue inventory and gold" tests/robustness.test.cjs` passed 3/3; `bundled node .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json` passed; `bundled node .\node_modules\vite\bin\vite.js build` failed with sandbox `spawn EPERM`.
  - Next: `Review the diff, push when requested, and keep the child completed-but-open until remote push succeeds and the blocked Vite build path is rerun or explicitly accepted.`

- 2026-07-28
  - Summary: `Opened the superseding unified player item inventory migration child from the approved migration design and moved canonical resume ownership away from the compatibility-only backpack projection plan.`
  - Verification: `bundled node .\tools\lint-superpowers-plans.mjs`
  - Next: `Wait for the user to choose Subagent-Driven or Inline execution, then execute docs/superpowers/plans/2026-07-28-unified-player-item-inventory-migration-plan.md from Task 1.`

- 2026-07-28
  - Summary: `Projected prepared medicine and shop trade goods into the unified backpack while preserving the existing shop runtime ownership and the shared single-row grain view.`
  - Verification: `bundled node .\tools\lint-superpowers-plans.mjs`; `bundled node .\node_modules\typescript\bin\tsc -p tsconfig.test.json` + `Set-Content .test-dist\package.json {"type":"commonjs"}` + `bundled node --test --test-isolation=none tests/unified-backpack-inventory.test.cjs tests/backpack-ui-contract.test.cjs`; `bundled node .\node_modules\typescript\bin\tsc -p tsconfig.test.json` + `Set-Content .test-dist\package.json {"type":"commonjs"}` + `bundled node --test --test-isolation=none --test-name-pattern "market house can open trade overlay and execute buy flow|medicine house heal and buy update fatigue inventory and gold" tests/robustness.test.cjs`; `bundled node .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`; `bundled node .\node_modules\vite\bin\vite.js build` blocked by sandbox `spawn EPERM`, and escalation could not proceed because the approval/deployment path returned 404.
  - Next: `Rerun the unsandboxed build when approval works, then review diff, push if requested, and close or continue the backpack child.`

- 2026-07-06
  - Summary: `Created the first fail-closed progress-driven governance spec and started replacing the old weekly-governance entry surfaces.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Finish central governance docs, templates, and lint alignment, then re-audit repository references.`
- 2026-07-21
  - Summary: `Opened the user-requested unified backpack inventory child to replace the visible valuables workflow with a shared item system.`
  - Verification: `Not run`
  - Next: `Run npm run lint:plans, then execute docs/superpowers/plans/2026-07-21-unified-backpack-inventory-plan.md from Task 1.`
- 2026-07-21
  - Summary: `Implemented the unified backpack inventory first batch with compatibility projection for valuables and grain, backpack overlay UI, bottom-HUD entry, and safe item action dispatch.`
  - Verification: `npm run lint:plans`; `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/unified-backpack-inventory.test.cjs tests/backpack-ui-contract.test.cjs }`; `npm run typecheck`; `npm run build`; `npm test`
  - Next: `Review diff, commit/push if requested, then close or continue the inventory child.`
- 2026-07-21
  - Summary: `Fixed backpack icon and filter layout regressions: non-image icon ids no longer render as text, and category filters keep the overlay rows stable even when the filtered list is short or empty.`
  - Verification: `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/unified-backpack-inventory.test.cjs tests/backpack-ui-contract.test.cjs }`; `npm run typecheck`; `npm run build`; `npm run lint:plans`
  - Next: `Review diff, commit/push if requested, then close or continue the inventory child.`
- 2026-07-21
  - Summary: `Added the requested backpack entry directly to the campaign main-map bottom action layer so the map screen no longer depends on the generic HUD shortcut being visible.`
  - Verification: `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/backpack-ui-contract.test.cjs }`; `npm run typecheck`; `npm run build`
  - Next: `Review diff, commit/push if requested, then close or continue the inventory child.`
- 2026-07-24
  - Summary: `Opened the faction review flow child to normalize temple and keep review cadence, contribution tables, policy announcement, advice prompt, and rank-gated assignment choices.`
  - Verification: `npm run lint:plans`
  - Next: `Execute docs/superpowers/plans/2026-07-24-faction-review-flow-plan.md from Task 1.`
- 2026-07-24
  - Summary: `Completed temple review normalization for Task 4 with shared assignment table, policy panel, advice prompt, and rank-gated temple work choices; implementation remains completed-but-open pending review, push, and known unrelated full-suite failure resolution.`
  - Verification: `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-domain.test.cjs tests/faction-review-ui-contract.test.cjs }`; `node --test --test-name-pattern "temple house review|temple review|global NPC interaction does not append default choices to temple review" tests/robustness.test.cjs`; `npm run lint:plans`; `npm run typecheck`; `$env:TEMP='D:\RPG_TG\.tmp'; $env:TMP='D:\RPG_TG\.tmp'; npm test` failed only known unrelated `child 27 startup coordinator exposes bootstrap-complete createAppState for builtin startup`, expected `event.story.zhu_yuanzhang.haozhou_return_encounter`, actual `null`; `$env:TEMP='D:\RPG_TG\.tmp'; $env:TMP='D:\RPG_TG\.tmp'; $env:npm_config_cache='D:\RPG_TG\.npm-cache'; npm run build`
  - Next: `Commit Task 4 changes, then push/review before child closeout; do not close while the known unrelated full-suite failure remains unresolved.`
- 2026-07-24
  - Summary: `Committed the Task 4 review fix for temple review task gates: disabled choices are enforced in dispatch, unlocked begging remains available, and actionContainer/forced-dispatch regressions are covered.`
  - Verification: `node --test --test-name-pattern "temple review|temple house review|unlocked begging|disabled work choice|global NPC interaction does not append default choices to temple review" tests/robustness.test.cjs`; `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-domain.test.cjs tests/faction-review-ui-contract.test.cjs }`; `npm run typecheck`; `npm run lint:plans`
  - Next: `Run final review if agent capacity is available, then push/review before child closeout; do not close while the known unrelated full-suite failure remains unresolved.`
- 2026-07-25
  - Summary: `Promoted the campaign map visual profile foundation child after user selected Subagent-Driven execution.`
  - Verification: `Not run as part of this governance-only update`
  - Next: `Execute docs/superpowers/plans/2026-07-25-campaign-map-visual-profile-plan.md from Task 1.`
- 2026-07-25
  - Summary: `Completed the campaign map visual profile foundation implementation: MapDefinition now selects an engine-owned campaign structure profile, Yuanmo map nodes drive settlement-building visuals, map-view resolves profile URLs without scenario-pack imports, and renderer canvas attributes are emitted from campaignStructureProfile.`
  - Verification: `Targeted campaign visual profile contracts passed; npm run lint:plans passed; npm run typecheck passed after nullable marker narrowing fix 92db0c15; npm run build passed with existing Vite warnings; $env:TEMP='D:\RPG_TG\.tmp'; $env:TMP='D:\RPG_TG\.tmp'; npm test failed only known unrelated child 27 startup coordinator failure, expected event.story.zhu_yuanzhang.haozhou_return_encounter, actual null.`
  - Next: `Run final branch review, then push/review before child closeout; do not close while remote push is absent or the child 27 baseline remains unresolved/unaccepted.`
- 2026-07-25
  - Summary: `Resolved final review coverage issues for the campaign map visual profile foundation by guarding map-view against direct city_hun and Yuanmo settlement image imports and rerunning all four targeted campaign visual profile contracts.`
  - Verification: `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign structure visual profiles|campaign map view resolves structure profiles|campaign map structures are node-driven|campaign terrain canvas receives structure profile" tests/robustness.test.cjs }` passed 4 tests.
  - Next: `Push/review before child closeout; do not close while remote push is absent or the child 27 baseline remains unresolved/unaccepted.`
- 2026-07-25
  - Summary: `Opened the campaign fort/city model renderer child to port the cyh WebGL modeled building pipeline without copying its UI hard imports from scenario-pack model assets.`
  - Verification: `Compared HEAD against codex/inspect-shoreamend-cyh for map-view, map-view-model, domain map types, campaign-terrain-webgl, shaders, and model asset paths.`
  - Next: `Execute docs/superpowers/plans/2026-07-25-campaign-fort-city-model-renderer-plan.md from Task 1.`
- 2026-07-25
  - Summary: `Completed the local campaign fort/city model renderer port: engine-owned model asset registry, terrain canvas profile attributes, cyh instanced building/wall/shadow renderer path, runtime Yuanmo map enablement, and terrain/cloud contract reconciliation.`
  - Verification: `Targeted fort/city contracts passed; npm run lint:plans passed; npm run typecheck passed; npm run build passed with existing Vite warnings; Edge runtime on http://127.0.0.1:5173/ started default adventure and screenshot D:\RPG_TG\.tmp\campaign-fort-city-model-renderer.png visually shows modeled structures. Full npm test passed 355/356 and failed only known unrelated child 27 startup coordinator failure, expected event.story.zhu_yuanzhang.haozhou_return_encounter, actual null.`
  - Next: `Review final diff and push when requested; do not close while remote push is absent or the child 27 baseline remains unresolved/unaccepted.`
- 2026-07-25
  - Summary: `Extended the shoreamend/cyh map visual port by extracting cloud reveal mask logic into its own renderer module, preserving current cloud drag-freeze controls, adding reveal-transition terrain chunk load holds, wiring city/village ground textures plus marker-source-driven terrain semantics, and removing the old 2D settlement PNG fallback from UI/profile/resources.`
  - Verification: `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign map structures|campaign map uses shoreamend visual renderer|campaign map includes shoreamend settlement ground texture layers|campaign map marker runtime source feeds terrain structure ground overlay|campaign fog exploration stays active without the removed shader renderer|content pack loader resolves zhuyuanzhang map asset urls" tests/robustness.test.cjs }`; `npm run typecheck`; `npm run build`; `npm run lint:plans`; Edge runtime on `http://127.0.0.1:5173/` reached campaign map with terrain/cloud ready, 404 marker-source entries with UVs, and city/village ground texture URLs on the terrain canvas; `$env:TEMP='D:\RPG_TG\.tmp'; $env:TMP='D:\RPG_TG\.tmp'; npm test` passed 358/359 and failed only known unrelated child 27 startup coordinator failure, expected `event.story.zhu_yuanzhang.haozhou_return_encounter`, actual `null`.`
  - Next: `Review final diff and push when requested; do not close while remote push is absent or the child 27 baseline remains unresolved/unaccepted.`
- 2026-07-25
  - Summary: `Finished the shoreamend map cleanup pass by correcting the city marker start-dot/text style to shoreamend's geometric 10px circle markers instead of the old zhen.png/cheng.png texture icons, deleting the obsolete src/3dasset/city_hun lowpoly model and PBR textures, and removing the old city depth mesh renderer/debug/preload channel from map-view, campaign-terrain-webgl, main.ts, and startup asset preloading.`
  - Verification: `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "startup asset preloader gathers first-screen map webgl and image assets|campaign map removes legacy city depth mesh model and texture assets|campaign fort city model assets are engine-owned and not imported by map UI|campaign terrain canvas receives fort city model profile attributes|campaign map uses shoreamend visual renderer|campaign map includes shoreamend settlement ground texture layers|campaign map marker runtime source feeds terrain structure ground overlay" tests/robustness.test.cjs }`; `npm run typecheck`; `npm run build`; `npm run lint:plans`; `$env:TEMP='D:\RPG_TG\.tmp'; $env:TMP='D:\RPG_TG\.tmp'; $env:npm_config_cache='D:\RPG_TG\.npm-cache'; npm test` passed 358/359 and failed only known unrelated child 27 startup coordinator failure, expected `event.story.zhu_yuanzhang.haozhou_return_encounter`, actual `null`.
  - Next: `Review final diff and push when requested; do not close while remote push is absent or the child 27 baseline remains unresolved/unaccepted.`
- 2026-07-25
  - Summary: `Removed the campaign map render stats/perf panel debug path: window.rpgMapPerf, the perf panel DOM/CSS, and cloud/terrain render stats APIs and per-frame timing counters are gone, while current cloud idle animation, drag/zoom freeze, and terrain chunk hold behavior remain covered.`
  - Verification: `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign map removes render stats performance debug panel path" tests/robustness.test.cjs }`; `node --test --test-name-pattern "campaign map removes render stats performance debug panel path|campaign cloud render keeps flowing cloud animation timing|campaign cloud freezes animation during map drag and zoom instead of using a css proxy|campaign cloud stays frozen briefly after repeated zoom input stops|campaign map zoom uses a persistent target-chasing controller|campaign map uses shoreamend visual renderer" tests/robustness.test.cjs`; `npm run typecheck`; `npm run build`; `npm run lint:plans`; `rg -n "rpgMapPerf|CampaignMapPerf|getCampaignTerrainRenderStats|getCampaignCloudRenderStats|CampaignTerrainRenderStats|CampaignCloudRenderStats|campaignTerrainRenderStats|campaignCloudRenderStats|c-campaign-map-perf-panel|data-campaign-map-perf-panel|lastRenderDurationMs|lastDrawCalls" src tests` reports only negative assertions in tests/robustness.test.cjs.`
  - Next: `Review final diff and push when requested; do not close while remote push is absent or the child 27 baseline remains unresolved/unaccepted.`
- 2026-07-25
  - Summary: `Added camera-scale LOD for the campaign structure model renderer so far zoom levels skip or reduce fort/city and village building allocations before expensive placement, shadow, instanced-buffer, and draw work.`
  - Verification: `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign fort city model renderer applies camera-scale LOD before building placement" tests/robustness.test.cjs }`; `node --test --test-name-pattern "campaign fort city model renderer ports cyh instanced draw path|campaign fort city model renderer applies camera-scale LOD before building placement|campaign fort city model assets are engine-owned and not imported by map UI|campaign terrain canvas receives fort city model profile attributes|campaign map removes legacy city depth mesh model and texture assets|campaign map uses shoreamend visual renderer" tests/robustness.test.cjs`; `npm run typecheck`; `npm run build`; `npm run lint:plans`; `git diff --check` passed with only existing LF-to-CRLF working-copy warnings.`
  - Next: `Review final diff and push when requested; do not close while remote push is absent or the child 27 baseline remains unresolved/unaccepted.`
- 2026-07-26
  - Summary: `Opened the campaign map-space volumetric cloud child after user selected the conservative terrain-aligned slab option and requested subagent-driven execution.`
  - Verification: `npm run lint:plans passed for 69 files.`
  - Next: `Execute docs/superpowers/plans/2026-07-26-campaign-map-space-volumetric-cloud-plan.md from Task 1 using subagent-driven development.`
- 2026-07-26
  - Summary: `Completed local Task 3 verification and governance sync for the campaign map-space volumetric cloud child; child remains completed-but-open pending review, push, and known child 27 baseline resolution.`
  - Verification: `npm run lint:plans` passed for 69 files; `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud map-space volumetric slab|campaign cloud render keeps flowing cloud animation timing|campaign cloud freezes animation during map drag and zoom|campaign cloud stays frozen briefly after repeated zoom input stops|campaign fog exploration stays active without the removed shader renderer" tests/robustness.test.cjs }` passed 5/5 tests; `npm run typecheck` passed; `npm run build` passed with existing Vite asset/chunk warnings; Edge/Playwright visual QA on `http://127.0.0.1:5173/` reached ready terrain/cloud canvases, panned/zoomed the map, and captured `D:\RPG_TG\.tmp\campaign-map-space-volumetric-cloud.png`.
  - Next: `Review final diff and push when requested; do not close while remote push is absent and the known child 27 baseline remains unresolved.`
- 2026-07-26
  - Summary: `Fixed final-review issues for campaign map-space volumetric cloud alignment: shader ray reconstruction now follows terrain camera offset-unit, terrain-scale, height-scale, screen-scale, perspective, and tilt conventions; raw 0.0025 offset math and the no-op projection uniform retention were removed.`
  - Verification: `RED npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud map-space volumetric slab|campaign cloud pan basis" tests/robustness.test.cjs }` failed on missing cameraOffsetUnit as expected; `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud map-space volumetric slab|campaign cloud render keeps flowing cloud animation timing|campaign cloud freezes animation during map drag and zoom|campaign cloud stays frozen briefly after repeated zoom input stops|campaign fog exploration stays active without the removed shader renderer" tests/robustness.test.cjs }` passed 6/6; `npm run typecheck` passed; `npm run build` passed with existing Vite asset/chunk warnings.
  - Next: `Commit final-review fix and report; keep child completed-but-open until remote push/review and known child 27 baseline resolution.`
- 2026-07-28
  - Summary: `Promoted the tavern short gamble child and completed Task 1 with the short deck contract, card labels, 7-choose-5 showdown evaluator, and side-pot split helpers.`
  - Verification: `RED bundled node + tsc + node --test --test-isolation=none failed with MODULE_NOT_FOUND after removing stale .test-dist tavern-short outputs; GREEN the same command passed 3/3 tests in tests/tavern-short-gamble-domain.test.cjs.`
  - Next: `Execute docs/superpowers/plans/2026-07-28-tavern-short-gamble-plan.md from Task 2 and build the short hand runtime.`
- 2026-07-28
  - Summary: `Completed Task 2 for the tavern short gamble child by adding the short hand runtime, claim-chain flow, auto-bet consumption, and showdown helpers.`
  - Verification: `RED bundled node + tsc + node --test --test-isolation=none failed because createTavernShortHand is not a function; GREEN the same command passed 6/6 tests in tests/tavern-short-gamble-domain.test.cjs.`
  - Next: `Execute docs/superpowers/plans/2026-07-28-tavern-short-gamble-plan.md from Task 3 and wire the tavern short table session into the house module.`
- 2026-07-28
  - Summary: `Completed Task 3 by wiring the tavern short-table session union, buy-in/rebuy/cash-out economy flow, and one-time stamina charge into the tavern house module.`
  - Verification: `bundled node + tsc + node --test --test-isolation=none passed 3/3 tests in tests/tavern-short-gamble-house.test.cjs after the initial red house-session failures.`
  - Next: `Execute docs/superpowers/plans/2026-07-28-tavern-short-gamble-plan.md from Task 4 and split the public gamble-table overlay by variant.`
- 2026-07-28
  - Summary: `Completed Task 4 by adding the tavern short overlay mapper, variant-specific gamble-table public contract, short renderer path, and short-table layout styling while preserving the long renderer flow.`
  - Verification: `bundled node + tsc + node --test --test-isolation=none passed 3/3 tests in tests/tavern-short-gamble-ui-contract.test.cjs after the expected MODULE_NOT_FOUND red on the missing view-model helper.`
  - Next: `Execute docs/superpowers/plans/2026-07-28-tavern-short-gamble-plan.md from Task 5 and replace the old short-mode robustness assumptions.`
- 2026-07-28
  - Summary: `Completed the tavern short gamble code/doc rollout and targeted tavern verification; the remaining follow-up is a bundled-node Vite CLI exit anomaly after successful dist emission.`
  - Verification: `Plan lint passed for 73 files; tavern-short domain + house + UI suites passed 12/12; tavern robustness pattern passed 13/13; tsconfig typecheck passed; Vite build emitted dist output but the bundled-node CLI exited with Windows code -1073740791 after warning-only output.`
  - Next: `Confirm whether the bundled-node Vite build exit is acceptable in this environment, then commit/push or continue build-exit investigation.`

## Latest Closeout

No structured child closeout has been recorded for this governance migration batch yet.
