# mod-first-dev Merge Ledger

- Source branch: `mod-first-dev`
- Target branch: `merage-mod2ui-1`
- Primary preservation rule: `Keep current branch for all existing UI/gameplay/map/building/layout behavior.`
- Selective retention rule: `Keep mod-first-dev only for script/skeleton editor behavior that does not force rollback of current branch runtime ownership.`
- Mandatory recording rule: `Every manual conflict choice must be written here before the file is considered resolved.`
- Centralized transition rule: `Any temporary merge bridge must live in src/application/runtime/transition/, src/application/runtime/compat/, or a centralized shared compatibility seam such as src/core/runtime/mod-first-compatibility.ts.`

## Conflict Classes

- `main-shell-and-render`
- `map-and-building-layout`
- `house-and-layout-editor`
- `script-editor-authoring`
- `contracts-and-runtime`
- `styles`
- `tests-and-docs`

## Merge Snapshot

- Merge command: `git merge --no-commit --no-ff mod-first-dev`
- Merge state: `resolved, committed as d5bb961b, and stabilized on merage-mod2ui-1`
- Snapshot note: `The real merge reproduced the earlier dry-run shape. Conflicts concentrated in main shell/render, map/building/layout, house/runtime, contracts/runtime, script-editor authoring, styles, and docs/tests; post-merge stabilization then closed the retained script-editor preview/round-trip gaps without changing current-branch shell ownership.`
- Ownership-class highlights:
  - `main-shell-and-render`
    - `src/main.ts`
    - `src/ui/app-render.ts`
    - `src/ui/main-ui/main-ui-flow.js`
    - `src/ui/main-ui/main-ui-flow.d.ts`
    - `src/application/presenter/*`
  - `map-and-building-layout`
    - `src/application/navigation/campaign-map-exploration.ts`
    - `src/ui/views/map/map-view.ts`
    - `src/application/building/building-container-event-runtime.ts`
    - `src/domain/map.ts`
  - `house-and-layout-editor`
    - `src/application/house/**`
    - `src/application/house-modules/**`
    - `src/application/layout-editor/**`
    - `src/ui/views/house/**`
    - `src/ui/tools/layout-editor-view.ts`
  - `script-editor-authoring`
    - `src/modules/script-editor/**`
  - `contracts-and-runtime`
    - `src/application/content/**`
    - `src/application/runtime/**`
    - `src/core/contracts/**`
    - `src/core/runtime/**`
    - `src/domain/content-pack.ts`
    - `src/domain/event.ts`
    - `src/domain/ui-layout.ts`
  - `styles`
    - `src/styles/main-ui.css`
    - `src/styles/prototype.css`
    - `src/styles/script-editor.css`
    - `src/styles/views.css`
  - `tests-and-docs`
    - `docs/change-log.md`
    - `AGENTS.md`
    - `tests/**`

## [resolved] src/main.ts

- Conflict type: `pending`
- Ownership class: `main-shell-and-render`
- Default policy: `keep-current`
- Final resolution: `keep-current`
- Reason:
  - `Main shell ownership stays on the current branch.`
- Current branch behavior to preserve:
  - `Current app shell, map entry flow, building/layout entry flow, and visible UI behavior.`
- mod-first-dev behavior to recover:
  - `Only editor entry-path wiring if it is required and safe.`
- Potential loss risk:
  - `A wrong resolution could revert current shell/runtime ownership or break the current UI flow.`
- Recovery source:
  - `merage-mod2ui-1:src/main.ts`
- Post-merge verification:
  - `build:test passed`
  - `typecheck passed`
  - `build passed`

## [resolved] src/ui/main-ui/main-ui-flow.js

- Conflict type: `pending`
- Ownership class: `main-shell-and-render`
- Default policy: `keep-current`
- Final resolution: `keep-current`
- Reason:
  - `Current branch owns the active UI flow and interactions.`
- Current branch behavior to preserve:
  - `Current map/building/UI flow behavior and current main UI event wiring.`
- mod-first-dev behavior to recover:
  - `Only script-editor entry or editor-facing UI hooks if they are required.`
- Potential loss risk:
  - `UI interaction regressions or a broken editor entry path.`
- Recovery source:
  - `merage-mod2ui-1:src/ui/main-ui/main-ui-flow.js`
- Post-merge verification:
  - `Manual navigation/UI smoke and editor-entry smoke.`

## [resolved] src/application/layout-editor/layout-editor-actions.ts

- Conflict type: `pending`
- Ownership class: `house-and-layout-editor`
- Default policy: `keep-current`
- Final resolution: `keep-current`
- Reason:
  - `Current branch layout-editor behavior must survive the merge.`
- Current branch behavior to preserve:
  - `Current building/layout editing behavior and all related action handling.`
- mod-first-dev behavior to recover:
  - `None by default; only if a bounded editor bridge absolutely needs it.`
- Potential loss risk:
  - `Building/layout editing regressions.`
- Recovery source:
  - `merage-mod2ui-1:src/application/layout-editor/layout-editor-actions.ts`
- Post-merge verification:
  - `Layout-editor smoke and building layout regression checks.`

## [resolved] src/application/house/house-runtime.ts

- Conflict type: `pending`
- Ownership class: `house-and-layout-editor`
- Default policy: `keep-current`
- Final resolution: `keep-current`
- Reason:
  - `Current branch house/runtime behavior is explicitly required to stay intact.`
- Current branch behavior to preserve:
  - `Current house lifecycle, house entry/leave behavior, and runtime routing.`
- mod-first-dev behavior to recover:
  - `None by default; use centralized compat seam instead of replacing the current owner.`
- Potential loss risk:
  - `House regressions across multiple modules.`
- Recovery source:
  - `merage-mod2ui-1:src/application/house/house-runtime.ts`
- Post-merge verification:
  - `House-flow smoke checks and targeted house runtime tests chosen during merge execution.`

## [resolved] src/modules/script-editor/ui/main-ui-script-editor-module.js

- Conflict type: `pending`
- Ownership class: `script-editor-authoring`
- Default policy: `keep-mod-first-dev`
- Final resolution: `keep-mod-first-dev`
- Reason:
  - `This is the main candidate surface for retaining mod-first-dev script/skeleton editor behavior.`
- Current branch behavior to preserve:
  - `No regression to current shell-level behavior when the editor is opened from the current branch UI.`
- mod-first-dev behavior to recover:
  - `Script/skeleton editor workspace and authoring surfaces.`
- Potential loss risk:
  - `Editor capabilities could be lost, or the retained editor could assume runtime contracts that no longer exist.`
- Recovery source:
  - `mod-first-dev:src/modules/script-editor/ui/main-ui-script-editor-module.js`
- Post-merge verification:
  - `Open editor, enter workspace, and inspect the retained editor surfaces.`

## [resolved] src/modules/script-editor/application/runtime-pack-export.ts

- Conflict type: `pending`
- Ownership class: `script-editor-authoring`
- Default policy: `manual-split`
- Final resolution: `manual-split`
- Reason:
  - `The file mixes editor-facing export behavior with runtime/schema convergence points, so the final result keeps mod-first-dev editor lowering but adds current-branch compatibility shims for EventDefinition, playable settlement routes, and trigger defaults.`
- Current branch behavior to preserve:
  - `Current branch runtime compatibility and any pack expectations still needed by the active shell/runtime path.`
- mod-first-dev behavior to recover:
  - `Script-editor export behavior required by the retained skeleton/script editor.`
- Potential loss risk:
  - `Half-migrated schema behavior that breaks either export or runtime loading.`
- Recovery source:
  - `merage-mod2ui-1 and mod-first-dev versions of src/modules/script-editor/application/runtime-pack-export.ts`
- Post-merge verification:
  - `build:test passed`
  - `typecheck passed`
  - `build passed`

## [resolved] src/modules/script-editor/application/runtime-pack-import.ts

- Conflict type: `pending`
- Ownership class: `script-editor-authoring`
- Default policy: `manual-split`
- Final resolution: `keep-mod-first-dev-with-compat`
- Reason:
  - `The file keeps mod-first-dev import behavior and relies on current-branch compatibility shims for content-pack audio settings and playable settlement route typing.`
- Current branch behavior to preserve:
  - `Current runtime/data assumptions outside the script-editor bounded slice.`
- mod-first-dev behavior to recover:
  - `Import behavior required by the intended retained editor flow.`
- Potential loss risk:
  - `Import succeeds but creates compatibility residue or breaks current runtime assumptions.`
- Recovery source:
  - `merage-mod2ui-1 and mod-first-dev versions of src/modules/script-editor/application/runtime-pack-import.ts`
- Post-merge verification:
  - `build:test passed`
  - `typecheck passed`

## [resolved] src/styles/script-editor.css

- Conflict type: `pending`
- Ownership class: `styles`
- Default policy: `manual-split`
- Final resolution: `keep-mod-first-dev`
- Reason:
  - `Editor styles must be retained without disturbing current app-shell/map/building surfaces.`
- Current branch behavior to preserve:
  - `Current global/main UI surfaces outside the editor.`
- mod-first-dev behavior to recover:
  - `Editor styles needed for the retained script/skeleton editor surfaces.`
- Potential loss risk:
  - `Editor becomes unusable or global UI styling regresses.`
- Recovery source:
  - `merage-mod2ui-1 and mod-first-dev versions of src/styles/script-editor.css`
- Post-merge verification:
  - `build passed`

## Final Compat Seams

- `src/core/runtime/mod-first-compatibility.ts`
  - `Extended centrally to accept openCityMenuPanel as a compatibility action instead of scattering action-shape fallbacks across editor/runtime call sites.`
- `src/core/registry/builtin-playable-shell-registry.ts`
  - `Added as a minimal centralized registry seam so imported editor authoring code can detect shell-backed builtins without rewriting feature modules.`
- `src/domain/content-pack.ts`
  - `Added ContentPackAudioSettings as a bounded compatibility contract for imported editor manifest handling.`
- `src/domain/event.ts`
  - `Added EventRouteCommand and openCityMenuPanel support as a shared contract seam already implied by existing editor export lowering.`
- `src/core/contracts/playable-runtime.ts`
  - `Added PlayableSettlementRoute compatibility types so imported editor export/import code can compile against the current runtime baseline.`

## Post-Merge Stabilization Notes (2026-08-03)

### Smoke Findings

- Passed: `http://localhost:5173/` loaded without framework overlay or console errors; current branch main menu still exposed `开始游戏 / 继续游戏 / JSON 开局 / 剧本编辑`.
- Passed: `剧本编辑 -> 使用模板 -> 运行预览` no longer failed closed in the editor and successfully entered the Zhu Yuanzhang temple opening flow.
- Passed: preserved current-branch temple/house surfaces remained intact through smoke, including council flow, assignment modal, task sidebar, character detail panel, and NPC interaction dialog shells.

### Fixed Compatibility Gaps

- `src/modules/script-editor/application/runtime-pack-export.ts` plus the active content/story/scene/dialogue/game-store runtime seams were stabilized so retained editor `launchFlow` actions can preview through runtime as derived flow-backed `launchPlayable` sessions.
- `src/modules/script-editor/application/runtime-pack-import.ts` now canonicalizes runtime `openCityMenuPanel` actions back into editor `destination.family = "menu"` records during runtime-pack import, preventing export -> import round trips from becoming non-exportable.

### Regression Coverage

- `tests/script-editor-runtime-preview-compat.test.cjs`
  - `imported zhuyuanzhang script-editor template stays exportable for runtime preview`
  - `runtime-pack round trip preserves menu destinations for retained template events`
  - `scene runner launches flow-backed event actions through runtime preview`

### Verification

- Browser smoke: `main menu -> script editor -> template workspace -> runtime preview -> temple opening / council / assignment / NPC dialog` passed with empty browser `error/warn` logs.
- `pnpm run build:test` passed.
- `node --test tests/script-editor-runtime-preview-compat.test.cjs` passed.
- `pnpm run typecheck` passed.
- `pnpm run build` passed with existing Vite asset/script warnings unrelated to this merge slice.
