# Project Progress

## Current State

- Current Stage: `Map Renderer Architecture`
- Current Stage Status: `running`
- Current Task: `Campaign Fort City Model Renderer`
- Current Task Status: `completed-but-open`
- Current Child: `Campaign Fort City Model Renderer`
- Current Child Status: `completed-but-open`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `review-and-push-campaign-fort-city-model-renderer`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-25-campaign-fort-city-model-renderer-plan.md`
- Last Closed Item: `none`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then review and push docs/superpowers/plans/2026-07-25-campaign-fort-city-model-renderer-plan.md; do not close until push succeeds and the child 27 baseline is accepted or resolved.`

## Progress Log

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

## Latest Closeout

No structured child closeout has been recorded for this governance migration batch yet.
