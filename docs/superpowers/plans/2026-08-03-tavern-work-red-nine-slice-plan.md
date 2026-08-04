# Tavern Work Red Nine-Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give only the tavern work branch the project's unified red nine-slice action/button/popup skin without changing drink/gamble UI or adding business branches to `src/main.ts`.

**Architecture:** Add small presentational hooks to the shared house action/confirm renderers, then let the tavern work branch opt into those hooks through its own view model and view renderer. Reuse the existing red nine-slice assets already used by assessment/review popups, keep tavern-specific layout in tavern-owned CSS, and leave the shell/runtime wiring untouched.

**Tech Stack:** TypeScript house modules/renderers, CSS in `src/styles`, CommonJS contract tests through `.test-dist`, `npm run build:test`, targeted `node --test`, `npm run typecheck`, `npm run build`, and `npm run lint:plans`.

## Global Constraints

- Do not add tavern business branches to `src/main.ts`.
- Do not change drink or gamble behavior or styling in this batch.
- Keep all house business state flowing through typed house module/view-model paths.
- Reuse the existing red nine-slice asset `20260709-205123_button-clean-anti-seam.png`; do not add tavern-only art.
- Because `HouseActionContainerViewModel` is a shared house interface, update both `docs/special-house-interface.md` and `docs/change-log.md`.
- Current canonical governance still points at `docs/superpowers/plans/2026-07-31-city-specialty-market-plan.md`; keep this new child in `waiting` until execution is explicitly chosen and governance is synchronized.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-08-03`
- Current Focus: `Awaiting review and push decision.`
- Next Step: `Review the diff and decide whether to push or keep this completed batch local.`
- Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools/lint-superpowers-plans.mjs` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-shared-view-style-hooks.test.cjs tests/tavern-work-ui-contract.test.cjs tests/tavern-short-gamble-ui-contract.test.cjs tests/house-button-sound-policy.test.cjs` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none --test-name-pattern "tavern copy resolves from text entries for work panel and drink prompts|tavern work flow accepts dishwashing qte and submits with confirmation" tests/robustness.test.cjs` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-work-ui-contract.test.cjs` PASS after the asset-path fix; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build` PASS again after the asset-path fix with the bad tavern-work button path warning removed; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS after the work-scope menu fix; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` PASS after the work-scope menu fix; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-shared-view-style-hooks.test.cjs tests/tavern-work-ui-contract.test.cjs tests/tavern-short-gamble-ui-contract.test.cjs tests/house-button-sound-policy.test.cjs` PASS after the work-scope menu fix; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none --test-name-pattern "tavern copy resolves from text entries for work panel and drink prompts|tavern work flow accepts dishwashing qte and submits with confirmation" tests/robustness.test.cjs` PASS after the work-scope menu fix; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json` PASS after the work-scope menu fix; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build` PASS after the work-scope menu fix; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs` PASS after the work-scope menu fix; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-repeatable-work.test.cjs` PASS after the repeatable-work fix; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-repeatable-work.test.cjs tests/tavern-work-ui-contract.test.cjs tests/house-button-sound-policy.test.cjs` PASS after the repeatable-work fix; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none --test-name-pattern "tavern work flow accepts dishwashing qte and submits with confirmation|tavern submitting unfinished work fails and clears active work|tavern copy resolves from text entries for work panel and drink prompts" tests/robustness.test.cjs` PASS after the repeatable-work fix; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json` PASS after the repeatable-work fix; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build` PASS after the repeatable-work fix; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS after the post-settlement UI fix; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` PASS after the post-settlement UI fix; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-repeatable-work.test.cjs` PASS after the post-settlement UI fix; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-repeatable-work.test.cjs tests/tavern-work-ui-contract.test.cjs tests/house-button-sound-policy.test.cjs` PASS after the post-settlement UI fix; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none --test-name-pattern "tavern work flow accepts dishwashing qte and submits with confirmation|tavern submitting unfinished work fails and clears active work|tavern copy resolves from text entries for work panel and drink prompts" tests/robustness.test.cjs` PASS after the post-settlement UI fix; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json` PASS after the post-settlement UI fix; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build` PASS after the post-settlement UI fix.
- Notes: `Canonical progress was promoted to this child on 2026-08-03 after the user chose Inline execution in the current workspace. PowerShell in this environment does not expose npm on PATH, so the final verification used equivalent direct node/vite commands instead of npm script shims. The first sandboxed Vite build hit spawn EPERM; the unsandboxed rerun passed.`

## Progress Log

- 2026-08-03
  - Summary: `Fixed the follow-up tavern work UI bug that remained after the repeatable-offer change: collecting a dishwashing settlement result no longer leaves the player on an empty submit panel, and the work branch now falls back to the accept list whenever no active jobs remain.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json`; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-repeatable-work.test.cjs`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-repeatable-work.test.cjs tests/tavern-work-ui-contract.test.cjs tests/house-button-sound-policy.test.cjs`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none --test-name-pattern "tavern work flow accepts dishwashing qte and submits with confirmation|tavern submitting unfinished work fails and clears active work|tavern copy resolves from text entries for work panel and drink prompts" tests/robustness.test.cjs`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build`
  - Next: `Refresh the local client, confirm that collecting dishwashing rewards immediately shows the repeatable accept list again, then decide whether to commit/push this completed-but-open batch or keep it local.`
- 2026-08-03
  - Summary: `Plan created from the approved tavern work red nine-slice spec.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools/lint-superpowers-plans.mjs`
  - Next: `Write the failing shared house presentation-hook tests in Task 1.`
- 2026-08-03
  - Summary: `Completed Task 1's shared presentation-hook slice: HouseActionContainerViewModel now carries optional action/button class hooks, renderHouseConfirmOverlay accepts modal/action/button skin hooks, and the new shared hook contract test passes alongside the existing house button-sound policy suite.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json`; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-shared-view-style-hooks.test.cjs tests/house-button-sound-policy.test.cjs`
  - Next: `Write the failing tavern work UI contract test in Task 2 before touching tavern logic or CSS.`
- 2026-08-03
  - Summary: `Completed Task 2: the non-closed tavern work branch now opts into the shared red nine-slice action/button classes, tavern work confirm/QTE/result overlays use tavern-work popup classes, and drink/gamble overlays remain outside that namespace.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json`; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-work-ui-contract.test.cjs`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-shared-view-style-hooks.test.cjs tests/tavern-short-gamble-ui-contract.test.cjs tests/house-button-sound-policy.test.cjs`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none --test-name-pattern "tavern copy resolves from text entries for work panel and drink prompts|tavern work flow accepts dishwashing qte and submits with confirmation" tests/robustness.test.cjs`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`
  - Next: `Sync docs/change-log plus final verification in Task 3.`
- 2026-08-03
  - Summary: `Completed Task 3's local verification-and-docs sync: shared-house docs now describe presentational skin hooks, the change log records the tavern-work-only boundary, project-progress reflects completed-but-open local state, and final build/lint/test verification passed.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json`; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-shared-view-style-hooks.test.cjs tests/tavern-work-ui-contract.test.cjs tests/tavern-short-gamble-ui-contract.test.cjs tests/house-button-sound-policy.test.cjs`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none --test-name-pattern "tavern copy resolves from text entries for work panel and drink prompts|tavern work flow accepts dishwashing qte and submits with confirmation" tests/robustness.test.cjs`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools/lint-superpowers-plans.mjs`
  - Next: `Review the verified diff, then decide whether to commit/push this completed-but-open batch or keep it local.`
- 2026-08-03
  - Summary: `Fixed a post-verification tavern work button visibility regression: the new red nine-slice utility was pointing at a mojibake asset folder path instead of reusing the existing assessment button asset path, so the work-branch button skin failed to load.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-work-ui-contract.test.cjs`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json`; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-shared-view-style-hooks.test.cjs tests/tavern-work-ui-contract.test.cjs tests/tavern-short-gamble-ui-contract.test.cjs tests/house-button-sound-policy.test.cjs`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none --test-name-pattern "tavern copy resolves from text entries for work panel and drink prompts|tavern work flow accepts dishwashing qte and submits with confirmation" tests/robustness.test.cjs`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools/lint-superpowers-plans.mjs`
  - Next: `Refresh the local client, confirm the tavern work buttons render again, then decide whether to commit/push this completed-but-open batch or keep it local.`
- 2026-08-03
  - Summary: `Tightened the tavern work-panel scope so work menus no longer surface non-work child choices: the work main menu now uses 接取/提交/返回, accept/submit subpanels keep only work actions plus 返回, and a dedicated return action id prevents the shared NPC default profile/talk/gift options from leaking into work-only panels.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json`; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-shared-view-style-hooks.test.cjs tests/tavern-work-ui-contract.test.cjs tests/tavern-short-gamble-ui-contract.test.cjs tests/house-button-sound-policy.test.cjs`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none --test-name-pattern "tavern copy resolves from text entries for work panel and drink prompts|tavern work flow accepts dishwashing qte and submits with confirmation" tests/robustness.test.cjs`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs`
  - Next: `Refresh the local client and confirm tavern work panels now only show work actions plus 返回, then decide whether to commit/push this completed-but-open batch or keep it local.`

- 2026-08-03
  - Summary: `Fixed the tavern work repeatability bug: completed or failed chores no longer disappear from the accept list after settlement, so the current tavern work loop now behaves like a reusable time-and-stamina-for-money activity instead of a one-shot task chain.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json`; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-repeatable-work.test.cjs`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-repeatable-work.test.cjs tests/tavern-work-ui-contract.test.cjs tests/house-button-sound-policy.test.cjs`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none --test-name-pattern "tavern work flow accepts dishwashing qte and submits with confirmation|tavern submitting unfinished work fails and clears active work|tavern copy resolves from text entries for work panel and drink prompts" tests/robustness.test.cjs`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build`
  - Next: `Refresh the local client, confirm tavern chores can be accepted again after settlement, then decide whether to commit/push this completed-but-open batch or keep it local.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-03-tavern-work-red-nine-slice-design.md`
- Shared house contract:
  - `docs/special-house-interface.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `governance-mismatch-recorded`
- Notes:
  - `docs/superpowers/project-progress.md` still points to `docs/superpowers/plans/2026-07-31-city-specialty-market-plan.md` as the active completed-but-open child with next action `review-city-specialty-market-and-push`.
  - No tavern work red nine-slice code has been implemented yet; current tavern work UI still renders through grain-shop/temple modal and button classes.
  - The plan refines one implementation detail from the spec: `renderHouseConfirmOverlay()` should also accept optional action-row/button class hooks so the submit-confirm overlay can reuse the same red utility classes as the work menu, QTE, and result views.

## Implementation Scope

### In Scope

- Add reusable presentational hooks to shared house action container and confirm overlay rendering.
- Add reusable red nine-slice utility classes for house action rows/buttons.
- Opt tavern `workPanelMode === "accept"` and `"submit"` into those classes.
- Retheme tavern work submit-confirm, QTE, and result overlays.
- Keep gamble overlays explicitly outside the tavern work skin.
- Add focused tests and update shared-house docs/change-log entries.

### Still Out Of Scope

- Tavern default `工作 / 喝酒 / 赌博 / 关闭` menu while `workPanelMode === "closed"`.
- Tavern drink confirm/result flows.
- Tavern gamble choice, wager, short-table, and long-table UI.
- Any `main.ts` wiring, runtime settlement, or state-machine changes.
- New art assets, new audio, or general house renderer redesign.

## File Map

### Existing files to modify

- `src/domain/house-module.ts`
  - Add optional presentational hooks to `HouseActionContainerViewModel`.
- `src/ui/views/house/house-shared-view.ts`
  - Append optional action-container/button classes and extend confirm overlay skin options.
- `src/application/house-modules/tavern/tavern-house-module.ts`
  - Opt only the work branch into the new class hooks.
- `src/ui/views/house/tavern-house-view.ts`
  - Retheme only tavern work overlays.
- `src/styles/grain-shop.css`
  - Define reusable red nine-slice action/button utility classes.
- `src/styles/tea-house.css`
  - Define tavern work popup sizing/layout overrides.
- `docs/special-house-interface.md`
  - Document the new optional presentational hooks on shared house view models/renderers.
- `docs/change-log.md`
  - Record the shared contract and tavern work UI change.

### Existing files expected to be deleted

- `none`

### New files to create

- `tests/house-shared-view-style-hooks.test.cjs`
  - Locks the shared action-container/confirm-overlay presentation hooks.
- `tests/tavern-work-ui-contract.test.cjs`
  - Locks tavern work red-skin behavior and gamble non-regression.

## Verification Plan

- Targeted verification:
  - `tests/house-shared-view-style-hooks.test.cjs`
  - `tests/tavern-work-ui-contract.test.cjs`
  - `tests/tavern-short-gamble-ui-contract.test.cjs`
  - `tests/house-button-sound-policy.test.cjs`
  - targeted `tests/robustness.test.cjs` tavern work/drink coverage
- Required commands:
  - `npm run build:test`
  - `node --test tests/house-shared-view-style-hooks.test.cjs tests/tavern-work-ui-contract.test.cjs tests/tavern-short-gamble-ui-contract.test.cjs tests/house-button-sound-policy.test.cjs`
  - `node --test --test-name-pattern "tavern copy resolves from text entries for work panel and drink prompts|tavern work flow accepts dishwashing qte and submits with confirmation" tests/robustness.test.cjs`
  - `npm run typecheck`
  - `npm run build`
  - `npm run lint:plans`

## Task 1: Add Shared House Presentation Hooks

**Files:**
- Create: `tests/house-shared-view-style-hooks.test.cjs`
- Modify: `src/domain/house-module.ts`
- Modify: `src/ui/views/house/house-shared-view.ts`
- Read: `tests/house-button-sound-policy.test.cjs`

**Interfaces:**
- Consumes:
  - `renderHouseActionContainer(viewModel: HouseModuleViewModel): string`
  - `renderHouseConfirmOverlay(overlay: Extract<HouseOverlayViewModel, { type: "confirm" }>): string`
- Produces:

```ts
type HouseActionContainerViewModel = {
  title?: string;
  className?: string;
  buttonClassName?: string;
  actions: HouseActionViewModel[];
};

type OverlaySkinOptions = {
  overlayAttribute?: string;
  modalClassName?: string;
  actionsClassName?: string;
  buttonClassName?: string;
};

function renderHouseConfirmOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "confirm" }>,
  options?: OverlaySkinOptions
): string;
```

- [x] **Step 1: Write the failing shared-hook contract test**

Create `tests/house-shared-view-style-hooks.test.cjs` with these two tests:

```js
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  renderHouseActionContainer,
  renderHouseConfirmOverlay,
} = require("../.test-dist/ui/views/house/house-shared-view.js");

test("house action container appends optional action-row and button class hooks", () => {
  const html = renderHouseActionContainer({
    moduleId: "tavern",
    houseId: "house.tavern",
    sceneTitle: "酒馆",
    standbyRoster: [],
    dialogue: null,
    statusCard: null,
    overlay: null,
    leaveAction: { id: "leave-house", label: "离开" },
    actionContainer: {
      title: "酒馆活计",
      className: "c-house-red-nine-slice-actions c-tavern-work-actions",
      buttonClassName: "c-house-red-nine-slice-button c-tavern-work-button",
      actions: [
        { id: "open-work-submit", label: "提交" },
        { id: "dismiss-dialogue", label: "关闭" },
      ],
    },
  });

  assert.match(html, /c-grain-shop-actions c-house-red-nine-slice-actions c-tavern-work-actions/);
  assert.match(html, /c-house-red-nine-slice-button c-tavern-work-button/);
});

test("house confirm overlay appends modal and button class hooks without dropping default sounds", () => {
  const html = renderHouseConfirmOverlay(
    {
      type: "confirm",
      title: "提交活计",
      paragraphs: ["确认交活。"],
      confirmActionId: "confirm-submit-work",
      confirmLabel: "确认提交",
      cancelActionId: "cancel-submit-work",
      cancelLabel: "再等等",
    },
    {
      overlayAttribute: ' data-house-overlay-variant="assessment-popup"',
      modalClassName: "c-assessment-popup c-house-tavern-work-popup c-house-tavern-work-confirm",
      actionsClassName: "c-house-red-nine-slice-actions",
      buttonClassName: "c-house-red-nine-slice-button c-tavern-work-button",
    }
  );

  assert.match(html, /c-house-tavern-work-popup/);
  assert.match(html, /c-house-red-nine-slice-actions/);
  assert.match(html, /data-house-action="confirm-submit-work"[\s\S]*c-house-red-nine-slice-button/);
  assert.match(html, /data-house-action="cancel-submit-work"[\s\S]*data-button-sound="light"/);
  assert.match(html, /data-house-action="confirm-submit-work"[\s\S]*data-button-sound="heavy"/);
});
```

- [x] **Step 2: Run the targeted test to verify it fails**

Run:

```bash
npm run build:test
node --test tests/house-shared-view-style-hooks.test.cjs
```

Expected:

- `FAIL`
- The failure should say the shared renderer markup does not yet contain the new class hooks.

- [x] **Step 3: Implement the minimal shared hook support**

Make these changes:

```ts
// src/domain/house-module.ts
export type HouseActionContainerViewModel = {
  title?: string;
  className?: string;
  buttonClassName?: string;
  actions: HouseActionViewModel[];
};
```

```ts
// src/ui/views/house/house-shared-view.ts
type OverlaySkinOptions = {
  overlayAttribute?: string;
  modalClassName?: string;
  actionsClassName?: string;
  buttonClassName?: string;
};

const navClassName = [
  "c-grain-shop-actions",
  viewModel.actionContainer.className,
].filter(Boolean).join(" ");

const buttonClassName = [
  "c-button",
  "c-grain-shop-button",
  toneClass,
  viewModel.actionContainer.buttonClassName,
].filter(Boolean).join(" ");
```

```ts
// src/ui/views/house/house-shared-view.ts
const actionRowClassName = [
  "c-grain-shop-modal__actions",
  "c-grain-shop-modal__actions--split",
  options.actionsClassName,
].filter(Boolean).join(" ");

const confirmButtonClassName = [
  "c-button",
  "c-grain-shop-button",
  "c-grain-shop-button--gold",
  options.buttonClassName,
].filter(Boolean).join(" ");
```

Apply the same button-class hook to:

- primary house action buttons
- appended default NPC action buttons
- confirm overlay cancel/confirm buttons

- [x] **Step 4: Re-run the shared-hook tests and the existing sound-policy guard**

Run:

```bash
npm run build:test
node --test tests/house-shared-view-style-hooks.test.cjs tests/house-button-sound-policy.test.cjs
```

Expected:

- `PASS`
- The new shared hook test passes.
- `tests/house-button-sound-policy.test.cjs` still passes, proving the new classes did not break shared button sound defaults.

- [x] **Step 5: Sync plan progress before moving on**

Update this plan:

- mark Task 1 checkboxes
- set `Execution State.Status` to `running`
- set `Execution State.Current Focus` to `Task 2: tavern work opt-in and styling`
- append a `Progress Log` entry with the exact verification commands and results

- [ ] **Step 6: Commit the shared-hook slice**

Run:

```bash
git add tests/house-shared-view-style-hooks.test.cjs src/domain/house-module.ts src/ui/views/house/house-shared-view.ts docs/superpowers/plans/2026-08-03-tavern-work-red-nine-slice-plan.md
git commit -m "feat: add shared house presentation hooks"
```

## Task 2: Retheme Only The Tavern Work Branch

**Files:**
- Create: `tests/tavern-work-ui-contract.test.cjs`
- Modify: `src/application/house-modules/tavern/tavern-house-module.ts`
- Modify: `src/ui/views/house/tavern-house-view.ts`
- Modify: `src/styles/grain-shop.css`
- Modify: `src/styles/tea-house.css`
- Read: `tests/tavern-short-gamble-ui-contract.test.cjs`
- Read: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes:
  - `HouseActionContainerViewModel.className`
  - `HouseActionContainerViewModel.buttonClassName`
  - `renderHouseConfirmOverlay(..., options?: OverlaySkinOptions)`
- Produces:

```ts
actionContainer: {
  title: `酒馆活计 / 已接 ${lists.acceptedOffers.length}/${capacity}`,
  className: "c-house-red-nine-slice-actions c-tavern-work-actions",
  buttonClassName: "c-house-red-nine-slice-button c-tavern-work-button",
  actions: createWorkActions(...),
}
```

```ts
// tavern work overlay classes expected in rendered markup
"c-house-tavern-work-popup"
"c-house-tavern-work-confirm"
"c-house-tavern-work-qte"
"c-house-tavern-work-result"
```

```css
.c-house-red-nine-slice-actions { /* reusable row layout */ }
.c-house-red-nine-slice-button { /* reusable red nine-slice asset */ }
```

- [x] **Step 1: Write the failing tavern work UI contract test**

Create `tests/tavern-work-ui-contract.test.cjs`. Copy the small local helper pattern from `tests/robustness.test.cjs` for:

- `playerCharacterId`
- `tavernHouse`
- `createBaseState()`
- `withCouncilInDays(state, days)`

Then add these focused tests:

```js
test("tavern work menus opt into red nine-slice classes while the closed tavern menu stays unchanged", () => {
  const enterResult = tavernHouseModule.enter({
    gameState: withCouncilInDays(createBaseState(), 30),
    characterDefinitions: prototypeCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
  });

  const openWork = tavernHouseModule.dispatch({
    ...enterResult,
    houseDefinition: tavernHouse,
    playerCharacterId,
    request: { type: "action", actionId: "open-work" },
  });
  const openAccept = tavernHouseModule.dispatch({
    ...openWork,
    houseDefinition: tavernHouse,
    playerCharacterId,
    request: { type: "action", actionId: "open-work-accept" },
  });

  const closedView = tavernHouseModule.selectViewModel({
    ...enterResult,
    houseDefinition: tavernHouse,
    playerCharacterId,
  });
  const workView = tavernHouseModule.selectViewModel({
    ...openAccept,
    houseDefinition: tavernHouse,
    playerCharacterId,
  });

  assert.equal(closedView.actionContainer?.className ?? null, null);
  assert.equal(workView.actionContainer?.className, "c-house-red-nine-slice-actions c-tavern-work-actions");
  assert.equal(workView.actionContainer?.buttonClassName, "c-house-red-nine-slice-button c-tavern-work-button");

  const closedMarkup = renderTavernHouseView(closedView);
  const workMarkup = renderTavernHouseView(workView);
  assert.doesNotMatch(closedMarkup, /c-house-red-nine-slice-actions/);
  assert.match(workMarkup, /c-house-red-nine-slice-actions/);
  assert.match(workMarkup, /c-house-red-nine-slice-button/);
});

test("tavern work overlays use tavern-work popup classes while gamble overlays do not", () => {
  const qteMarkup = renderTavernHouseView({
    moduleId: "tavern",
    houseId: "house.tavern",
    sceneTitle: "酒馆",
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    leaveAction: { id: "leave-house", label: "离开" },
    overlay: {
      type: "qte-bar",
      title: "刷盘子",
      taskLabel: "停在金色区间",
      round: 1,
      totalRounds: 3,
      successes: 0,
      markerPercent: 10,
      targetStartPercent: 20,
      targetWidthPercent: 16,
      helperLines: ["说明一", "说明二"],
      stopActionId: "tavern-work-stop",
    },
  });

  const resultMarkup = renderTavernHouseView({
    moduleId: "tavern",
    houseId: "house.tavern",
    sceneTitle: "酒馆",
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    leaveAction: { id: "leave-house", label: "离开" },
    overlay: {
      type: "result",
      title: "提交结果",
      grade: "甲",
      score: 3,
      rewardLines: ["赏钱 70 文"],
      confirmActionId: "close-tavern-result",
      confirmLabel: "收下",
    },
  });

  const confirmMarkup = renderTavernHouseView({
    moduleId: "tavern",
    houseId: "house.tavern",
    sceneTitle: "酒馆",
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    leaveAction: { id: "leave-house", label: "离开" },
    overlay: {
      type: "confirm",
      title: "提交活计",
      paragraphs: ["确认交活。"],
      confirmActionId: "confirm-submit-work",
      confirmLabel: "确认提交",
      cancelActionId: "cancel-submit-work",
      cancelLabel: "再等等",
    },
  });

  const gambleMarkup = renderTavernHouseView({
    moduleId: "tavern",
    houseId: "house.tavern",
    sceneTitle: "酒馆",
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    leaveAction: { id: "leave-house", label: "离开" },
    overlay: {
      type: "gamble",
      title: "下注",
      variantLabel: "短牌",
      wager: 100,
      options: [20, 100, 200],
      decrementActionId: "decrease-wager",
      incrementActionId: "increase-wager",
      confirmActionId: "confirm-gamble",
      confirmLabel: "开始赌局",
      cancelActionId: "cancel-overlay",
      cancelLabel: "取消",
    },
  });

  assert.match(qteMarkup, /c-house-tavern-work-popup/);
  assert.match(qteMarkup, /c-house-tavern-work-qte/);
  assert.match(resultMarkup, /c-house-tavern-work-popup/);
  assert.match(resultMarkup, /c-house-tavern-work-result/);
  assert.match(confirmMarkup, /c-house-tavern-work-popup/);
  assert.match(confirmMarkup, /c-house-tavern-work-confirm/);
  assert.doesNotMatch(gambleMarkup, /c-house-tavern-work-popup/);
});
```

- [x] **Step 2: Run the tavern work contract test to verify it fails**

Run:

```bash
npm run build:test
node --test tests/tavern-work-ui-contract.test.cjs
```

Expected:

- `FAIL`
- The failure should report missing tavern work class hooks and/or missing tavern-work popup classes.

- [x] **Step 3: Implement the tavern work opt-in and CSS**

Make these changes:

```ts
// src/application/house-modules/tavern/tavern-house-module.ts
actionContainer: !isOpen
  ? null
  : sessionState.workPanelMode === "closed"
    ? { title: `${tavernBossProfile.name} / ${tavernBossProfile.specialty}`, actions: [...] }
    : {
        title: `酒馆活计 / 已接 ${lists.acceptedOffers.length}/${capacity}`,
        className: "c-house-red-nine-slice-actions c-tavern-work-actions",
        buttonClassName: "c-house-red-nine-slice-button c-tavern-work-button",
        actions: createWorkActions(...),
      }
```

```ts
// src/ui/views/house/tavern-house-view.ts
case "confirm":
  return renderHouseConfirmOverlay(overlay, {
    overlayAttribute: ' data-house-overlay-variant="assessment-popup"',
    modalClassName: "c-assessment-popup c-house-tavern-work-popup c-house-tavern-work-confirm",
    actionsClassName: "c-house-red-nine-slice-actions",
    buttonClassName: "c-house-red-nine-slice-button c-tavern-work-button",
  });
```

```ts
// src/ui/views/house/tavern-house-view.ts
<div class="c-grain-shop-modal c-grain-shop-modal--game c-grain-shop-skin-panel c-assessment-popup c-house-tavern-work-popup c-house-tavern-work-qte" ...>
...
<div class="c-grain-shop-modal__actions c-house-red-nine-slice-actions">
  <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold c-house-red-nine-slice-button c-tavern-work-button" ...>
```

```css
/* src/styles/grain-shop.css */
.c-house-red-nine-slice-actions { justify-content: center; gap: 8px; }
.c-house-red-nine-slice-button {
  border-width: 10px 18px;
  border-image-source: url("../../ui/yuansu/评定/generated/20260709-205123_button-clean-anti-seam.png");
  border-image-slice: 10 18 fill;
  border-image-width: 10px 18px;
  border-image-repeat: stretch;
  color: #f7e6ba;
  --nine-slice-seam-fill: #783021;
}
```

```css
/* src/styles/tea-house.css */
.c-house-tavern-work-popup { --assessment-popup-field-width: 284px; --assessment-popup-content-side: 24px; }
.c-house-tavern-work-confirm .c-grain-shop-modal__actions,
.c-house-tavern-work-qte .c-grain-shop-modal__actions,
.c-house-tavern-work-result .c-grain-shop-modal__actions { width: 100%; justify-content: center; }
```

Do not touch any tavern gamble renderer branch or gamble CSS selector except where a negative assertion needs a safer selector boundary.

- [x] **Step 4: Re-run the tavern tests plus non-regression guards**

Run:

```bash
npm run build:test
node --test tests/tavern-work-ui-contract.test.cjs tests/tavern-short-gamble-ui-contract.test.cjs tests/house-button-sound-policy.test.cjs
node --test --test-name-pattern "tavern copy resolves from text entries for work panel and drink prompts|tavern work flow accepts dishwashing qte and submits with confirmation" tests/robustness.test.cjs
npm run typecheck
```

Expected:

- `PASS`
- The new tavern work UI contract passes.
- Short-gamble UI tests remain green.
- Existing tavern work/drink robustness coverage remains green.
- TypeScript passes with the extended shared view-model hooks.

- [x] **Step 5: Sync plan progress before final docs and build verification**

Update this plan:

- mark Task 2 checkboxes
- keep `Execution State.Status` at `running`
- set `Execution State.Current Focus` to `Task 3: docs sync and final verification`
- append a `Progress Log` entry with the exact test/typecheck commands and results

- [ ] **Step 6: Commit the tavern work slice**

Run:

```bash
git add tests/tavern-work-ui-contract.test.cjs src/application/house-modules/tavern/tavern-house-module.ts src/ui/views/house/tavern-house-view.ts src/styles/grain-shop.css src/styles/tea-house.css docs/superpowers/plans/2026-08-03-tavern-work-red-nine-slice-plan.md
git commit -m "feat: retheme tavern work ui"
```

## Task 3: Sync Shared-House Docs And Run Final Verification

**Files:**
- Modify: `docs/special-house-interface.md`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-08-03-tavern-work-red-nine-slice-plan.md`

**Interfaces:**
- Consumes:
  - shared hook implementation from Task 1
  - tavern work opt-in from Task 2
- Produces:

```md
docs/special-house-interface.md
- document that shared house action containers may carry optional presentational class hooks
- document that shared confirm overlays may accept presentational skin hooks without inspecting house business state
```

```md
docs/change-log.md
- record the shared renderer contract expansion
- record that only tavern work adopted the unified red nine-slice skin in this batch
```

- [x] **Step 1: Update the shared-house docs**

Add concise entries similar to:

```md
- `HouseActionContainerViewModel` may carry optional presentational class hooks such as `className` and `buttonClassName`; shared renderers may append those hooks but must not branch on concrete house business state.
- Shared confirm overlays may accept optional presentational skin hooks so one house flow can opt into a popup/button skin without moving business logic into shared UI or `main.ts`.
```

And prepend a `docs/change-log.md` entry describing:

```md
## 2026-08-03 Tavern Work Red Nine-Slice UI Contract

### Added
- Shared house action containers and confirm overlays now accept optional presentational class hooks for module-owned skins.

### Changed
- Only the tavern work branch now uses the unified red nine-slice buttons/popup treatment; tavern drink and gamble flows remain on their existing UI.
```

- [x] **Step 2: Run the full planned verification set**

Run:

```bash
npm run build:test
node --test tests/house-shared-view-style-hooks.test.cjs tests/tavern-work-ui-contract.test.cjs tests/tavern-short-gamble-ui-contract.test.cjs tests/house-button-sound-policy.test.cjs
node --test --test-name-pattern "tavern copy resolves from text entries for work panel and drink prompts|tavern work flow accepts dishwashing qte and submits with confirmation" tests/robustness.test.cjs
npm run typecheck
npm run build
npm run lint:plans
```

Expected:

- `PASS`
- All targeted UI contract, non-regression, typecheck, build, and plan-governance checks pass.

- [x] **Step 3: Update plan state to completed-but-open**

Update this plan:

- mark Task 3 checkboxes
- set `Execution State.Status` to `completed-but-open`
- set `Execution State.Last Updated` to the execution date
- set `Execution State.Current Focus` to `Awaiting review and push decision.`
- set `Execution State.Next Step` to `Review the diff and decide whether to push or keep local.`
- append a `Progress Log` entry with the exact final verification commands and results

- [ ] **Step 4: Commit the docs and final verification state**

Run:

```bash
git add docs/special-house-interface.md docs/change-log.md docs/superpowers/plans/2026-08-03-tavern-work-red-nine-slice-plan.md
git commit -m "docs: record tavern work ui contract"
```

## Exit Check

- [x] Shared house renderers accept optional presentational hooks without inspecting tavern business state.
- [x] Tavern work `accept`/`submit` menus use the red nine-slice action/button skin.
- [x] Tavern work submit-confirm, QTE, and result overlays render the tavern-work popup classes.
- [x] Tavern gamble UI remains outside the tavern-work popup/class namespace.
- [x] `docs/special-house-interface.md` and `docs/change-log.md` are updated.
- [x] Project progress sync is updated if this child is promoted or closed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Replace when closing.`
- Parent Task: `House Local Gameplay`
- Parent Stage: `House Local Gameplay`
- Closeout Status: `closed`
- Project Progress Synced: `yes/no`
- Next Child: `Replace when closing.`
- Next Child Status: `waiting/running/blocked/none`
- Next Required Action: `Replace when closing.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `Replace when closing.`
- Push Status: `success/failure/not-pushed`
- Push Commit: `commit-sha-or-none`
- Resume From: `Replace when closing.`
