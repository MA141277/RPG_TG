# Builtin Startup Scenario-Pack Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify the `开始游戏` and `剧本编辑器 -> 运行预览` startup chain onto one shared startup contract and runtime bootstrap seam, while preserving the current UI, feature surface, and pre-merge scenario order/content.

**Architecture:** Keep `src/main.ts` as a shell-level loader/dispatcher, preserve the current character-selection and preview entry shells, and execute the startup-chain unification in two phases. Phase 1 converges the covered builtin default start onto the existing scenario-pack startup/app-state seam without changing visible flow order; Phase 2 unifies the remaining startup contract owners, follow-up ownership, and source-of-truth boundaries without changing UI, features, or scenario sequencing.

**Tech Stack:** TypeScript app shell and startup coordinator, builtin `src/content/scenario-packs/zhuyuanzhang/**` JSON data, Node test runner, `pnpm run build:test`, targeted `node --test`, `pnpm run typecheck`, `pnpm run build`, `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-08-03`
- Current Focus: `The approved scope for this child is complete: 开始游戏 and 剧本编辑器运行预览 now share the covered startup seam, and the remaining follow-up work belongs to source unification rather than startup-chain/owner cleanup.`
- Next Step: `Use docs/superpowers/plans/2026-08-03-scenario-pack-source-unification-plan.md for the next branch-local phase: unify runtime source, builtin source, and template source ownership without changing UI, features, or pre-merge scenario content/order.`
- Verification: `pnpm run build:test; pnpm exec tsc -p tsconfig.json --noEmit; node --test tests/haozhou-return-battle-state.test.cjs tests/campaign-map-intro-prompts.test.cjs tests/city-begging-refusal-dialogues.test.cjs tests/navigation-time-follow-up.test.cjs tests/temple-review-assignment-defaults.test.cjs tests/keep-review-assignment-defaults.test.cjs tests/startup-session-coordinator.test.cjs tests/scenario-preview-sanitizer.test.cjs tests/script-editor-runtime-preview-compat.test.cjs; node --test --test-name-pattern "main.ts haozhou return entry no longer owns the sundeya battle review mission text id|main.ts map intro shell no longer owns the zhuyuanzhang chapter intro text id|main.ts city begging refusal shell no longer owns zhuyuanzhang shortage or stamina dialogue seeds|main.ts council dialogue shell no longer owns temple or keep default copy branches" tests/robustness.test.cjs; manual browser smoke for 开始游戏 and 模板运行预览.`
- Notes: `Branch-local plan for the approved builtin startup convergence slice. It remains completed-but-open as a handoff record, and the next branch-local child is the source-unification follow-up plan rather than more startup-chain cleanup.`

## Progress Log

- 2026-08-03
  - Summary: `Created the implementation plan for converging builtin default startup onto the scenario-pack startup seam while preserving the current start-button UI flow.`
  - Verification: `Spec approved; implementation not started.`
  - Next: `Run Task 1 and lock the covered builtin-default startup regression tests before editing startup logic.`
- 2026-08-03
  - Summary: `Completed the covered convergence slice: builtin default startup now resolves the activated builtin scenario pack, rewrites it for the selected character, and builds app state through the shared scenario-pack seam; the zhuyuanzhang runtime source and both editor template sources were aligned so 开始游戏 and 使用模板 -> 运行预览 land on the same visible monk-opening startup presentation.`
  - Verification: `pnpm run build:test; pnpm exec tsc -p tsconfig.json --noEmit; node --test tests/startup-session-coordinator.test.cjs tests/scenario-preview-sanitizer.test.cjs; node --test tests/script-editor-runtime-preview-compat.test.cjs; node --test --test-name-pattern "child 2(2|3|7|8|9)|startup loading waits for initial map view assets before hiding loading screen|startup asset preloader gathers first-screen map webgl and image assets" tests/robustness.test.cjs; browser smoke confirmed 开始游戏 and 模板运行预览 both show 朱元璋 / 流民 / 1567年1月1日 / 今日评定 / 前往皇觉寺听候住持训示.`
  - Next: `Review residual startup-content cleanup and decide whether to commit this convergence slice as-is or continue into deeper data-source unification.`
- 2026-08-03
  - Summary: `Reframed the plan into a two-phase startup-chain unification roadmap so the remaining work can converge contract ownership without changing visible UI flow, feature behavior, or scenario sequencing/content.`
  - Verification: `Governance/documentation-only update; implementation remains as verified in the previous log entry.`
  - Next: `Use the Phase 2 task list below to remove the remaining split startup owners in bounded, testable slices.`
- 2026-08-03
  - Summary: `Executed the first Phase 2 startup-contract slice: the startup coordinator now builds builtin default and loaded scenario-pack sessions through the same shared scenario-pack helper, and loaded scenario-pack requests can optionally normalize a selected character into the resolved startup context without changing current UI entry flows.`
  - Verification: `pnpm run build:test; node --test tests/startup-session-coordinator.test.cjs; node --test tests/script-editor-runtime-preview-compat.test.cjs tests/scenario-preview-sanitizer.test.cjs; pnpm exec tsc -p tsconfig.json --noEmit.`
  - Next: `Unify startup follow-up ownership and reduce startup-visible data drift now that selected-character normalization is shared on the scenario-pack path.`
- 2026-08-03
  - Summary: `Moved deferred startup follow-up timing ownership back into the shared startup coordinator path: scenario-pack startup now suppresses immediate bootstrap when launchPolicy.entryEventTiming is after-map-entry, and runtime preview no longer strips deferred entry metadata ahead of startup.`
  - Verification: `pnpm run build:test; node --test tests/startup-session-coordinator.test.cjs tests/scenario-preview-sanitizer.test.cjs; node --test tests/script-editor-runtime-preview-compat.test.cjs; pnpm exec tsc -p tsconfig.json --noEmit.`
  - Next: `Reduce remaining startup source drift and add broader first-follow-up equivalence checks for builtin start vs runtime preview.`
- 2026-08-03
  - Summary: `Added a dedicated zhuyuanzhang startup-template sync tool so runtime scenario-profile.json is treated as canonical and startup-facing character identity fields are derived into builtin/public script-editor templates while preserving template-only metadata such as editor roles and template house ids.`
  - Verification: `pnpm run build:test; node --test tests/startup-session-coordinator.test.cjs tests/scenario-preview-sanitizer.test.cjs tests/script-editor-runtime-preview-compat.test.cjs; pnpm exec tsc -p tsconfig.json --noEmit.`
  - Next: `Use the remaining startup equivalence slice to cover the first follow-up transition after startup, since the core startup request, timing, and startup-visible source drift are now bounded.`
- 2026-08-03
  - Summary: `Added a dedicated regression proving builtin default startup and runtime-preview startup keep deferred first-follow-up timing on the same contract for the same scenario pack and selected character, so startup-chain parity now extends past the initial screen boundary.`
  - Verification: `pnpm run build:test; node --test tests/startup-session-coordinator.test.cjs tests/scenario-preview-sanitizer.test.cjs tests/script-editor-runtime-preview-compat.test.cjs; pnpm exec tsc -p tsconfig.json --noEmit.`
  - Next: `Review whether any remaining startup-owned data should move under the sync tool, or pivot to the next cleanup target now that startup request, timing, source drift, and deferred follow-up parity are all covered.`
- 2026-08-03
  - Summary: `Moved scenario-pack startup fallback calendar/review/mission defaults out of createScenarioPackAppState and into scenario-profile owner helpers, so main.ts no longer hardcodes the covered scenario-pack startup seed values inline.`
  - Verification: `pnpm run build:test; node --test tests/scenario-profile-startup-contract.test.cjs tests/startup-session-coordinator.test.cjs tests/scenario-preview-sanitizer.test.cjs tests/script-editor-runtime-preview-compat.test.cjs; pnpm exec tsc -p tsconfig.json --noEmit.`
  - Next: `Decide whether to normalize the remaining prototype-only fallback startup residue, or move on to broader content hardcoding cleanup now that the primary scenario-pack startup path is substantially ownerized.`
- 2026-08-03
  - Summary: `Moved prototype-only fallback startup stage/countdown/mission seed selection out of createPrototypeAppState and into a dedicated startup helper, so main.ts no longer decides the monk-opening vs guo-zixing-camp seed values inline.`
  - Verification: `pnpm run build:test; node --test tests/prototype-startup-seed.test.cjs tests/scenario-profile-startup-contract.test.cjs tests/startup-session-coordinator.test.cjs tests/scenario-preview-sanitizer.test.cjs tests/script-editor-runtime-preview-compat.test.cjs; pnpm exec tsc -p tsconfig.json --noEmit.`
  - Next: `Consider switching from startup-owner cleanup to broader scenario-content hardcoding cleanup, because the major startup seed owners are now extracted out of main.ts for both covered scenario-pack and prototype fallback paths.`
- 2026-08-03
  - Summary: `Started the broader scenario-content cleanup pass by extracting Zhu Yuanzhang camp-transition and Sundeya rescue callback seeds out of story-callbacks.ts into a dedicated zhuyuanzhang callback-defaults helper, leaving callback order and text behavior unchanged while removing more scenario-owned ids from the callback owner.`
  - Verification: `pnpm run build:test; node --test tests/zhu-yuanzhang-story-callback-defaults.test.cjs tests/prototype-startup-seed.test.cjs tests/scenario-profile-startup-contract.test.cjs tests/startup-session-coordinator.test.cjs tests/scenario-preview-sanitizer.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/interactive-runtime-status.test.cjs; pnpm exec tsc -p tsconfig.json --noEmit.`
  - Next: `Pick the next scenario-owned runtime branch with visible startup/mission impact, likely temple review assignment or keep review mission-state transitions, and extract its content defaults without changing current flow order.`
- 2026-08-03
  - Summary: `Extracted temple and keep review assignment/reset seeds into dedicated house-owner helpers so the 30/60-day countdowns, beg-alms/grain fallback mission defaults, and review assignment overlay/order text ids no longer live inline inside the temple/keep house runtime modules.`
  - Verification: `pnpm run build:test; node --test tests/temple-review-assignment-defaults.test.cjs tests/keep-review-assignment-defaults.test.cjs; node --test --test-name-pattern "temple review assignment scenario seeds are owned by a dedicated temple helper|keep review assignment scenario seeds are owned by a dedicated keep helper" tests/robustness.test.cjs; node --test tests/startup-session-coordinator.test.cjs tests/scenario-preview-sanitizer.test.cjs tests/script-editor-runtime-preview-compat.test.cjs; pnpm exec tsc -p tsconfig.json --noEmit.`
  - Next: `Continue with the next startup-adjacent scenario-owned follow-up branch, likely council-arrival/refusal or other opening mission-state defaults that still live inline outside the centralized startup/transition helpers.`
- 2026-08-03
  - Summary: `Moved council priority refusal and insufficient-time reminder defaults out of main.ts into the shared navigation-time follow-up owner, so temple/keep speaker selection and council reminder text-id branching now live alongside the covered council arrival owner instead of in the shell.`
  - Verification: `pnpm run build:test; node --test tests/navigation-time-follow-up.test.cjs; node --test --test-name-pattern "main.ts council dialogue shell no longer owns temple or keep default copy branches" tests/robustness.test.cjs; pnpm exec tsc -p tsconfig.json --noEmit.`
  - Next: `Continue removing other startup-adjacent zhuyuanzhang prompt seeds still owned by main.ts, such as city-begging refusal or chapter-intro prompt defaults.`
- 2026-08-03
  - Summary: `Moved zhuyuanzhang city-begging shortage/stamina refusal defaults out of main.ts into a dedicated city-begging refusal helper, so the shell no longer owns the abbot speaker id or the related refusal text ids for those two gates.`
  - Verification: `pnpm run build:test; node --test tests/city-begging-refusal-dialogues.test.cjs tests/navigation-time-follow-up.test.cjs tests/temple-review-assignment-defaults.test.cjs tests/keep-review-assignment-defaults.test.cjs tests/startup-session-coordinator.test.cjs tests/scenario-preview-sanitizer.test.cjs tests/script-editor-runtime-preview-compat.test.cjs; node --test --test-name-pattern "main.ts city begging refusal shell no longer owns zhuyuanzhang shortage or stamina dialogue seeds|main.ts council dialogue shell no longer owns temple or keep default copy branches|temple review assignment scenario seeds are owned by a dedicated temple helper|keep review assignment scenario seeds are owned by a dedicated keep helper" tests/robustness.test.cjs; pnpm exec tsc -p tsconfig.json --noEmit.`
  - Next: `Inspect the remaining startup-adjacent zhuyuanzhang prompt ownership in main.ts, likely chapter-intro / begging-route prompt defaults, before deciding whether the startup-chain and owner cleanup is finally ready to be called done.`
- 2026-08-03
  - Summary: `Moved the map chapter-intro title and the haozhou-return encounter mission-text default out of main.ts into dedicated runtime/startup helpers, so the shell no longer directly references the huai-xi-begging intro text id or the sundeya battle review mission text id.`
  - Verification: `pnpm run build:test; node --test tests/haozhou-return-battle-state.test.cjs tests/campaign-map-intro-prompts.test.cjs tests/city-begging-refusal-dialogues.test.cjs tests/navigation-time-follow-up.test.cjs tests/temple-review-assignment-defaults.test.cjs tests/keep-review-assignment-defaults.test.cjs tests/startup-session-coordinator.test.cjs tests/scenario-preview-sanitizer.test.cjs tests/script-editor-runtime-preview-compat.test.cjs; node --test --test-name-pattern "main.ts haozhou return entry no longer owns the sundeya battle review mission text id|main.ts map intro shell no longer owns the zhuyuanzhang chapter intro text id|main.ts city begging refusal shell no longer owns zhuyuanzhang shortage or stamina dialogue seeds|main.ts council dialogue shell no longer owns temple or keep default copy branches" tests/robustness.test.cjs; pnpm exec tsc -p tsconfig.json --noEmit.`
  - Next: `Run one final audit to decide whether the startup-chain and owner cleanup phase can now be declared complete before touching any runtime/template/source unification work.`
- 2026-08-03
  - Summary: `Final ownership audit completed: the startup-chain and owner cleanup phase is done within the approved scope, and follow-up work has been explicitly handed off to a new runtime/builtin/template source unification child plan.`
  - Verification: `Audit based on the verified regressions already recorded above; no new runtime behavior was introduced during this handoff-only update.`
  - Next: `Continue in docs/superpowers/plans/2026-08-03-scenario-pack-source-unification-plan.md and keep startup-chain behavior frozen while consolidating source ownership.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-03-builtin-startup-scenario-pack-unification-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `The spec is now committed as 930d26d5 on merage-mod2ui-1.`
  - `Current normal builtin start still reaches runStartupSessionCoordinator({ type: "builtin" ... }) and then createPrototypeAppState(...) for startupScenario "default".`
  - `Runtime preview already uses loaded-scenario-pack startup and must remain unchanged during this slice.`
  - `The builtin zhuyuanzhang scenario-profile currently starts in house view, so preserving the current map-first builtin visible result requires either pack-data updates or a minimal startup-time pack adaptation.`

## Implementation Scope

### Non-Negotiable Constraints

- Do not change the current UI shell, page order, button order, or visible entry surfaces.
- Do not change existing feature behavior for `开始游戏`, `角色选择`, `地图`, `模板运行预览`, map/house interactions, building layout, or editor tooling.
- Do not reorder, rewrite, or replace the pre-merge scenario sequence or content.
- Do not move feature business logic into `src/main.ts`; keep startup ownership in startup/runtime seams.

### Two-Phase Delivery

#### Phase 1: Covered Bootstrap Convergence

- Status: `completed`
- Purpose: `Make 开始游戏 -> 角色选择 -> 地图 build runtime state through the builtin scenario-pack seam while preserving the visible flow and current startup presentation.`
- Output:
  - `开始游戏` covered default startup no longer depends on direct prototype-state construction.
  - `开始游戏` and `使用模板 -> 运行预览` now share the covered scenario-pack bootstrap seam and aligned first-screen presentation.

#### Phase 2: Full Startup-Chain Unification

- Status: `pending`
- Purpose: `Unify the remaining startup-contract owners so both entry shells resolve through the same startup request, startup presentation contract, and startup follow-up ownership without changing UI/feature behavior or scenario order/content.`
- Required outcomes:
  - A single startup request model covers builtin start and runtime preview.
  - Character-selection results and pack/profile startup data are normalized into one resolved startup context.
  - Startup presentation fields (`map/house/view/date/mission/review text`) are derived from one owner path.
  - Startup follow-up ownership (for example first entry follow-ups) is owned by one explicit startup mechanism rather than split across profile hints and house-enter fallbacks.
  - Startup-related data copies are reduced to a canonical source plus derivation path.

### In Scope

- Converge the covered builtin default startup path (`开始游戏 -> 角色选择 -> 地图`) away from direct prototype-state construction.
- Reuse the scenario-pack startup/app-state seam for the covered builtin default path.
- Preserve the current character-selection UI and visible map-first result.
- Update builtin scenario-pack data only as needed to express the current covered startup-visible defaults.
- Add targeted regressions for coordinator semantics and covered builtin start behavior.
- Define and execute the remaining Phase 2 startup-chain unification slices under the non-negotiable constraints above.

### Still Out Of Scope

- Broad cleanup of scenario-owned hardcoded content outside the covered startup slice.
- UI redesign, button/order changes, or replacing the current role-selection shell.
- Rewriting scenario story content, text ordering, or opening event sequence to “fit” the new startup chain.
- House/map/story mechanism refactors unrelated to covered builtin default startup.
- Any broad hardcoding cleanup that is not directly required to unify startup ownership.

## Remaining Problems And Phase 2 Solution Map

### Problem 1: Pre-runtime entry flow is still split

- Current state:
  - `开始游戏` uses `主菜单 -> 角色选择 -> 启动请求`
  - `运行预览` uses `编辑器 -> 直接启动请求`
- Risk:
  - Even if both land in similar runtime state, the request semantics can still drift.
- Solution:
  - Keep both visible entry shells unchanged.
  - Introduce one normalized startup request builder that accepts either `builtin + selectedCharacter` or `loaded-scenario-pack + fixed/default character`.
  - Make both entry flows call the same request normalizer before the startup coordinator.

### Problem 2: Startup request ownership is still split between builtin and loaded-pack semantics

- Current state:
  - The covered builtin default path is unified at app-state creation time, but request shape and fallback handling are still branch-specific.
- Risk:
  - New startup fields will be added in one branch and silently missed in the other.
- Solution:
  - Define a single resolved startup context shape in the startup layer.
  - Normalize selected character, scenario pack, profile, startup scenario, presentation, and follow-up fields before app-state creation.

### Problem 3: Startup presentation data has multiple owners

- Current state:
  - First-screen map/view/date/mission/review text are aligned for the covered path, but still depend on multiple JSON copies and startup-time adaptation.
- Risk:
  - Runtime source, builtin template source, and public template source can drift again.
- Solution:
  - Keep one canonical runtime startup source under `src/content/scenario-packs/zhuyuanzhang`.
  - Add a derivation/sync path so builtin/public template startup-visible fields are generated from the canonical source instead of hand-maintained.

### Problem 4: Startup follow-up ownership is still split

- Current state:
  - The first runtime screen is aligned, but later opening follow-up behavior can still depend on house-enter triggers or legacy startup assumptions.
- Risk:
  - “首屏一致” but “开场流程不一致”.
- Solution:
  - Choose one owner for startup follow-up:
    - either a startup-coordinator-owned follow-up contract
    - or an explicit scenario-pack startup follow-up definition
  - Remove duplicate semantic ownership so the same opening chain runs regardless of entry shell.

### Problem 5: Character-selection semantics are not fully shared with preview

- Current state:
  - `开始游戏` resolves the character interactively; preview more often inherits pack/profile defaults.
- Risk:
  - Different player id, startup variables, or opening text under the same scenario pack.
- Solution:
  - Normalize character resolution into the shared startup request builder.
  - Add tests for non-default selectable characters to confirm startup variables and presentation are identical after normalization.

### Problem 6: Regression coverage is incomplete for the full chain

- Current state:
  - Covered first-screen behavior is tested, but full opening-chain equivalence is not.
- Risk:
  - Later cleanups can reintroduce startup drift without failing CI.
- Solution:
  - Add regression coverage for:
    - builtin start vs runtime preview startup-context equivalence
    - non-default character startup equivalence
    - opening follow-up equivalence after first map/house transition

## Phase 2 Execution Order

### Task A: Consolidate the startup request contract

- Goal: `开始游戏` and `运行预览` produce one normalized startup request shape before entering the coordinator.
- Files likely involved:
  - `src/application/startup/startup-session-coordinator.ts`
  - `src/main.ts`
  - any existing startup request/helper owner already used by menu and preview wiring
- Acceptance:
  - No UI changes.
  - No feature-order changes.
  - Both paths call the same request normalizer.

### Task B: Consolidate resolved startup context ownership

- Goal: selected character, scenario pack, scenario profile, startup presentation, and startup follow-up fields are assembled once in the startup layer.
- Files likely involved:
  - `src/application/startup/startup-session-coordinator.ts`
  - `src/domain/scenario-profile.ts`
  - existing startup helper modules if a dedicated compat/transition seam is warranted
- Acceptance:
  - `createScenarioPackAppState(...)` receives one fully resolved startup context.
  - No new business branches are added to `src/main.ts`.

### Task C: Unify startup follow-up ownership

- Goal: opening follow-up behavior is owned by one explicit mechanism.
- Files likely involved:
  - startup coordinator owner
  - scenario-profile / scenario-pack startup metadata owner
  - house-enter compatibility seam only if needed as a temporary bridge
- Acceptance:
  - The opening sequence runs in the same order for builtin start and preview.
  - No duplicated fallback semantics remain active for the covered opening path.

### Task D: Canonicalize startup source data

- Goal: remove hand-maintained startup-visible drift between runtime pack and editor templates.
- Files likely involved:
  - `src/content/scenario-packs/zhuyuanzhang/**`
  - `src/modules/script-editor/builtin-templates/zhuyuanzhang/**`
  - `public/script-editor-templates/zhuyuanzhang/**`
  - generation/sync tooling if the repository already has an appropriate owner
- Acceptance:
  - One canonical source feeds startup-visible template data.
  - Manual triple-editing is no longer required for the covered startup fields.

### Task E: Add full-chain startup regressions

- Goal: lock the unified startup chain so later cleanup cannot silently split it again.
- Files likely involved:
  - `tests/startup-session-coordinator.test.cjs`
  - `tests/script-editor-runtime-preview-compat.test.cjs`
  - `tests/robustness.test.cjs`
- Acceptance:
  - Tests cover first-screen equivalence, non-default character equivalence, and opening follow-up equivalence.

## File Map

### Existing files to modify

- `tests/startup-session-coordinator.test.cjs`
  - Add a focused coordinator contract showing builtin default startup uses scenario-pack app-state creation instead of prototype-state creation when a builtin scenario-pack source is available.
- `tests/robustness.test.cjs`
  - Update/add source-level regressions proving the covered builtin default path no longer depends on direct prototype-state construction and that the shared startup/app-state seam remains deferred until content context is applied.
- `src/application/startup/startup-session-coordinator.ts`
  - Converge builtin default startup semantics onto the scenario-pack path for the covered normal start flow while leaving non-default fallback scenarios alone.
- `src/main.ts`
  - Keep shell wiring intact; only update startup dependencies or helper wiring that the coordinator needs for the covered path.
- `src/content/scenario-packs/zhuyuanzhang/scenario-profile.json`
  - Encode the builtin covered start’s map-first visible defaults where the current pack schema already supports them.
- `src/content/scenario-packs/zhuyuanzhang/text-entries.json`
  - Only if the covered start’s visible review/mission copy needs to be pack-owned to preserve the current HUD text.
- `docs/change-log.md`
  - Record the startup convergence boundary after implementation.
- `docs/superpowers/plans/2026-08-03-builtin-startup-scenario-pack-unification-plan.md`
  - Track execution state, progress log, and verification.

### Existing files expected to be deleted

- `none in this slice`

### New files to create

- `none by default; keep this batch inside existing startup/test/data owners unless a tiny startup helper file becomes necessary during execution`

## Verification Plan

- Targeted verification:
  - `开始游戏 -> 角色选择 -> 地图` still holds.
  - Covered builtin default startup uses scenario-pack app-state creation instead of direct prototype-state construction.
  - Runtime preview still starts successfully.
  - Current UI shell and feature surface remain unchanged.
- Required commands:
  - `pnpm run build:test`
  - `node --test tests/startup-session-coordinator.test.cjs`
  - `node --test tests/script-editor-runtime-preview-compat.test.cjs`
  - `node --test --test-name-pattern "builtin startup|scenario-pack startup|startMainGameWithLoading" tests/robustness.test.cjs`
  - `pnpm run typecheck`
  - `pnpm run build`
  - `pnpm run lint:plans`

## Task 1: Lock The Failing Builtin-Startup Contracts

**Files:**
- Modify: `tests/startup-session-coordinator.test.cjs`
- Modify: `tests/robustness.test.cjs`
- Read: `src/application/startup/startup-session-coordinator.ts`
- Read: `src/main.ts`

- [ ] **Step 1: Add a focused failing coordinator test for builtin default startup**

Extend `tests/startup-session-coordinator.test.cjs` with a builtin-default case that throws if `createPrototypeAppState()` is touched and records calls to `createScenarioPackAppState()`:

```js
test("builtin default startup reuses builtin scenario-pack app-state creation when activated content exposes a scenario pack", async () => {
  const builtinScenarioPack = {
    schemaVersion: 1,
    id: "scenario-pack.zhu_yuanzhang.builtin",
    title: "Builtin Start",
    scenarioProfile: {
      id: "scenario.zhu_yuanzhang.builtin",
      title: "Builtin Start",
      playerCharacterId: "char.pack.default",
      chapterId: "chapter.zhu-yuanzhang-rise",
      initialLocation: {
        mapId: "map.yuanmo_campaign",
        cityId: "city.kulan",
        houseId: null,
        view: "map",
      },
    },
  };
  const selectedCharacter = { id: "char.selected", name: "Selected" };
  const log = [];

  const result = await runStartupSessionCoordinator(
    {
      type: "builtin",
      selectedCharacter,
      startupScenario: "default",
    },
    {
      activateBuiltinDefaultMod: async () => ({
        ok: true,
        modId: "mod.builtin",
        activatedMod: {
          normalizedContentSources: [builtinScenarioPack],
        },
      }),
      restoreModFromSave: async () => null,
      activateScenarioPackMod: async () => {
        throw new Error("scenario-pack activation should not run for builtin start");
      },
      createPrototypeAppState: () => {
        throw new Error("covered builtin default startup should not use prototype state");
      },
      createHaozhouReturnEncounterAppState: () => {
        throw new Error("haozhou-return overlay should not run for builtin default start");
      },
      createScenarioPackAppState: (pack) => {
        log.push(pack);
        return { sourcePackId: pack.id, playerId: pack.scenarioProfile.playerCharacterId };
      },
      createStartupContentContext: () => ({ packId: "pack.base", storyContent: {} }),
      bootstrapStartupStoryAppState: ({ appState }) => appState,
    }
  );

  assert.equal(result.ok, true);
  const appState = result.session.createAppState();
  assert.equal(appState.sourcePackId, builtinScenarioPack.id);
  assert.equal(appState.playerId, selectedCharacter.id);
  assert.equal(log).not; // replace with assert.equal(log.length, 1) in the actual edit
});
```

- [ ] **Step 2: Add/adjust a source-level regression in `tests/robustness.test.cjs`**

Add a targeted assertion that the covered builtin default path in `startup-session-coordinator.ts` now references `createScenarioPackAppState(...)` under builtin startup rather than only `createPrototypeAppState(...)`:

```js
test("builtin default startup can route through scenario-pack app-state creation", () => {
  const coordinatorSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src",
      "application",
      "startup",
      "startup-session-coordinator.ts"
    ),
    "utf8"
  );

  assert.match(
    coordinatorSource,
    /createBuiltinStartupSession[\s\S]*createScenarioPackAppState/
  );
});
```

- [ ] **Step 3: Run the targeted tests and confirm they fail for the right reason**

Run:

```bash
pnpm run build:test
node --test tests/startup-session-coordinator.test.cjs
node --test --test-name-pattern "builtin default startup can route through scenario-pack app-state creation" tests/robustness.test.cjs
```

Expected:

- `build:test` passes
- the new startup coordinator test fails because builtin default startup still calls `createPrototypeAppState(...)`
- the new robustness assertion fails because `createBuiltinStartupSession(...)` does not yet route through `createScenarioPackAppState(...)`

- [ ] **Step 4: Sync plan progress before implementation**

Update this plan:

- `Execution State.Status` -> `running`
- `Current Focus` -> `Task 2 builtin default startup convergence`
- `Verification` -> include the failing targeted test names
- append a `Progress Log` entry capturing the intentional failing-test baseline

## Task 2: Converge Covered Builtin Default Startup Onto The Scenario-Pack Seam

**Files:**
- Modify: `src/application/startup/startup-session-coordinator.ts`
- Modify: `src/main.ts`
- Read: `src/application/startup/startup-session-coordinator.ts`
- Read: `src/main.ts`

- [ ] **Step 1: Narrow builtin default startup to scenario-pack app-state creation**

Change `createBuiltinStartupSession(...)` so the covered `startupScenario === "default"` path first inspects the activated builtin content source and, when it resolves to a scenario pack, builds app state through `createScenarioPackAppState(...)` instead of `createPrototypeAppState(...)`.

The target shape is:

```ts
async function createBuiltinStartupSession(
  selectedCharacter: CharacterDefinition,
  startupScenario: StartupScenario,
  deps: StartupSessionCoordinatorDeps
): Promise<StartupSessionResult> {
  const activationResult = await deps.activateBuiltinDefaultMod(
    `startup:builtin:${startupScenario}`
  );
  const contentContext = deps.createStartupContentContext(activationResult);
  const activatedContentSource = readActivatedContentSource(activationResult);

  if (startupScenario === "default" && activatedContentSource != null) {
    const builtinScenarioPack = {
      ...activatedContentSource,
      scenarioProfile: {
        ...activatedContentSource.scenarioProfile,
        playerCharacterId: selectedCharacter.id,
      },
    };

    return createStartupSessionResult({
      activationResult,
      contentContext,
      playerCharacterId: selectedCharacter.id,
      createAppState: createStartupAppStateBuilder(
        () => deps.createScenarioPackAppState(builtinScenarioPack),
        readScenarioStartupStoryBootstrap(builtinScenarioPack),
        deps
      ),
    });
  }

  return createStartupSessionResult({
    activationResult,
    contentContext,
    playerCharacterId: selectedCharacter.id,
    createAppState: createStartupAppStateBuilder(
      () =>
        startupScenario === "haozhou-return-encounter"
          ? deps.createHaozhouReturnEncounterAppState(
              deps.createPrototypeAppState(selectedCharacter.id)
            )
          : deps.createPrototypeAppState(selectedCharacter.id),
      readBuiltinStartupStoryBootstrap(startupScenario),
      deps
    ),
  });
}
```

Keep `haozhou-return-encounter` and uncovered fallback behavior unchanged in this batch.

- [ ] **Step 2: Keep `src/main.ts` limited to shell wiring**

If `startupSessionCoordinatorDeps` needs a small signature or dependency adjustment, keep it shell-only. The target is to preserve this shape:

```ts
const startupSessionCoordinatorDeps = {
  activateBuiltinDefaultMod,
  restoreModFromSave,
  activateScenarioPackMod,
  createPrototypeAppState,
  createHaozhouReturnEncounterAppState,
  createScenarioPackAppState,
  createStartupContentContext: (activationResult: ModActivationResult) =>
    createActiveGameContentContextFromModActivation({
      basePack: baseGameContentPack,
      activationResult,
    }),
  bootstrapStartupStoryAppState,
};
```

Do not add new gameplay branches to `startMainGameWithLoading(...)`.

- [ ] **Step 3: Rerun the targeted startup tests**

Run:

```bash
pnpm run build:test
node --test tests/startup-session-coordinator.test.cjs
node --test --test-name-pattern "builtin default startup can route through scenario-pack app-state creation|child 23 scenario-pack startup defers app-state bootstrap until after active content sync" tests/robustness.test.cjs
```

Expected:

- all targeted startup coordinator tests pass
- the content-context-before-app-state regression still passes
- no runtime-preview tests are touched yet

- [ ] **Step 4: Commit the coordinator convergence**

Run:

```bash
git add tests/startup-session-coordinator.test.cjs tests/robustness.test.cjs src/application/startup/startup-session-coordinator.ts src/main.ts
git commit -m "Converge builtin default startup onto scenario pack app state"
```

Expected:

- commit succeeds with only the covered startup/test files

## Task 3: Preserve The Current Map-First Visible Builtin Start Through Pack Data

**Files:**
- Modify: `src/content/scenario-packs/zhuyuanzhang/scenario-profile.json`
- Modify: `src/content/scenario-packs/zhuyuanzhang/text-entries.json`
- Modify: `tests/robustness.test.cjs`
- Read: `src/main.ts`

- [ ] **Step 1: Move the covered builtin visible start defaults into the builtin scenario profile where supported**

Update `src/content/scenario-packs/zhuyuanzhang/scenario-profile.json` so the builtin pack expresses the covered visible start result instead of the current house-first opening values. The intended target is:

```json
{
  "id": "scenario.zhu_yuanzhang.monk_opening",
  "title": "朱元璋：皇觉寺开局",
  "playerCharacterId": "char.player",
  "chapterId": "chapter.zhu-yuanzhang-rise",
  "initialLocation": {
    "mapId": "map.yuanmo_campaign",
    "cityId": "city.kulan",
    "houseId": null,
    "view": "map"
  },
  "initialCalendar": {
    "year": 1567,
    "month": 1,
    "day": 1
  },
  "initialUi": {
    "reviewDateText": "__REPLACE_WITH_CURRENT_VISIBLE_START_REVIEW_TEXT__",
    "mainHouseMissionText": "__REPLACE_WITH_CURRENT_VISIBLE_START_MISSION_TEXT__"
  },
  "initialRuntime": {
    "variables": {
      "var.story.zhu_yuanzhang.stage": "huangjue-temple"
    }
  }
}
```

Use the exact currently visible builtin start text values rather than placeholder strings in the real edit. Remove `entryEventId` and `openingFlowId` from the covered builtin profile only if they would otherwise reintroduce a non-map first landing on the normal start path.

- [ ] **Step 2: Only update pack-owned text when the current visible HUD text cannot be expressed inline**

If the current start HUD copy already belongs in text entries, add/update the concrete ids in `text-entries.json` and wire those ids into `initialUi` or existing startup text lookup. If inline `initialUi` strings are sufficient for this slice, leave `text-entries.json` unchanged and record that choice in the progress log.

The only acceptable edits here are the ones needed to preserve the current visible builtin start result.

- [ ] **Step 3: Add a data-level regression proving the builtin scenario profile stays map-first**

Add a targeted regression in `tests/robustness.test.cjs`:

```js
test("builtin zhuyuanzhang scenario profile keeps the covered start button landing on the map", () => {
  const profile = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "content",
        "scenario-packs",
        "zhuyuanzhang",
        "scenario-profile.json"
      ),
      "utf8"
    )
  );

  assert.equal(profile.initialLocation.view, "map");
  assert.equal(profile.initialLocation.houseId, null);
  assert.equal(profile.initialLocation.cityId, "city.kulan");
});
```

- [ ] **Step 4: Run targeted verification for the covered visible start data**

Run:

```bash
pnpm run build:test
node --test --test-name-pattern "builtin zhuyuanzhang scenario profile keeps the covered start button landing on the map|builtin default startup can route through scenario-pack app-state creation" tests/robustness.test.cjs
node --test tests/startup-session-coordinator.test.cjs
```

Expected:

- all targeted regressions pass
- no fallback to prototype-state creation is needed for the covered default builtin start

## Task 4: Smoke The Preserved UI Flow And Close Out Documentation

**Files:**
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-08-03-builtin-startup-scenario-pack-unification-plan.md`
- Read: `docs/superpowers/specs/2026-08-03-builtin-startup-scenario-pack-unification-design.md`

- [ ] **Step 1: Manually smoke the two preserved entry flows**

Validate:

1. `开始游戏 -> 角色选择界面 -> 地图`
2. `剧本编辑 -> 使用模板 -> 运行预览 -> 成功进入运行时`

Record:

- whether current UI order stayed unchanged
- whether the first gameplay screen after builtin start is still the map
- whether runtime preview still starts
- any console/runtime errors observed

- [ ] **Step 2: Run final verification**

Run:

```bash
pnpm run build:test
node --test tests/startup-session-coordinator.test.cjs
node --test tests/script-editor-runtime-preview-compat.test.cjs
node --test --test-name-pattern "builtin startup|scenario-pack startup|startMainGameWithLoading" tests/robustness.test.cjs
pnpm run typecheck
pnpm run build
pnpm run lint:plans
```

Expected:

- targeted startup tests pass
- runtime preview compatibility tests pass
- typecheck/build pass
- `lint:plans` may still fail only because unrelated `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` is malformed

- [ ] **Step 3: Update change log and plan state**

Add a `docs/change-log.md` entry covering:

- builtin default startup now routes through the scenario-pack app-state seam
- covered normal `开始游戏` still lands on the map after character selection
- runtime preview remains intact

Then update this plan:

- `Execution State`
- `Progress Log`
- `Completion Checklist`

- [ ] **Step 4: Commit the covered startup unification slice**

Run:

```bash
git add docs/change-log.md docs/superpowers/plans/2026-08-03-builtin-startup-scenario-pack-unification-plan.md src/content/scenario-packs/zhuyuanzhang/scenario-profile.json src/content/scenario-packs/zhuyuanzhang/text-entries.json tests/robustness.test.cjs
git commit -m "Unify builtin startup with scenario pack flow"
```

Expected:

- commit succeeds with covered startup/data/test/doc changes

## Exit Check

- [ ] `开始游戏` still presents the current character-selection UI.
- [ ] After character selection, the covered builtin default start still first lands on the map.
- [ ] The covered builtin default startup path no longer depends on direct prototype-state construction.
- [ ] `使用模板 -> 运行预览` still works.
- [ ] No new startup business branching was added to `src/main.ts` beyond shell wiring.
- [ ] Project progress sync is intentionally unchanged because this branch-local child is not promoted into the unrelated canonical governance track.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `Builtin Startup Scenario-Pack Unification`
- Parent Task: `Branch-local startup convergence`
- Parent Stage: `none`
- Closeout Status: `closed`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `none`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `none`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md only if this branch-local child is later promoted into the canonical governance track; otherwise continue from this plan file.`
