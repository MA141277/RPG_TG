# Runtime Layout Runtime Consumption Disable Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Disable runtime consumption of runtime-layout and building-layout display structure across normal startup, JSON import startup, built-in startup, and Script Editor runtime preview while preserving authored layout data.

**Architecture:** Keep layout data in authoring/export/import/runtime payloads, but move runtime display truth back to the old unified shell UI. Implement the rollback only at shared runtime consumption seams so every entrypoint converges on the same shell, while menu/event/playable routing stays on the current canonical chains.

**Tech Stack:** TypeScript runtime/UI modules, Node `--test` coverage in `tests/robustness.test.cjs`, optional browser smoke in `tests/browser-script-editor-deep-actions-smoke.test.cjs`, Blueprint governance docs, and `npm run lint:blueprints`, `npm run lint:blueprint-skill`, `npm run blueprint:governance:check`, `npm run lint:plans`.

## Global Constraints

- Runtime display truth must become the old unified shell UI only.
- Layout data must remain saved, loaded, exported, imported, and preserved.
- Runtime must ignore layout data instead of rejecting it or auto-cleaning it.
- Menu resource/instance routing, event-owned continuation, playable settlement, and building action dispatch must remain on the current canonical chains.
- Do not add building-specific fallback branches in `src/main.ts`.
- Normal startup, JSON import startup, built-in startup, and Script Editor runtime preview must all behave the same way.
- Update `docs/change-log.md` for the user-visible runtime rollback.
- Keep the rollback routed inside active ACC-FORMAT-006 governance unless new evidence forces a new queue.

---

## Execution State

- Status: `waiting`
- Last Updated: `2026-07-27`
- Current Focus: `Plan authored; waiting for execution mode selection before Task 1 starts.`
- Next Step: `Resume from docs/blueprints/project-progress.md, confirm ACC-FORMAT-006 is still active, then start Task 1.`
- Verification: `Not run as part of this plan-authoring batch`
- Notes: `This plan is subordinate to Blueprint governance and must not bypass the active required-final queue.`

## Progress Log

- 2026-07-27
  - Summary: `Plan created from the approved runtime-layout rollback design spec for ACC-FORMAT-006 contradiction repair.`
  - Verification: `npm run lint:plans`
  - Next: `Choose execution mode, then start Task 1 under the active Blueprint queue.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-27-runtime-layout-runtime-consumption-disable-design.md`
- Active Blueprint queue:
  - `docs/blueprints/queues/preview-runtime-loading-full-chain-consistency-and-final-acceptance-queue.md`
- Active Blueprint version plan:
  - `docs/blueprints/plans/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical Blueprint entry:
  - `docs/blueprints/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `The active queue is still ACC-FORMAT-006 full-chain-consistency-and-acceptance-proof after closeout review failed on manual Script Editor inspection.`
  - `One concrete contradiction is now the operator-requested rollback of runtime layout consumption back to the old unified shell UI while preserving layout data.`
  - `Current runtime layout consumption is not limited to building layout nodes; app-render also forwards appState.uiLayouts into runtime HUD/detail rendering.`

## Implementation Scope

### In Scope

- Absorb the rollback into ACC-FORMAT-006 contradiction repair governance.
- Disable runtime layout consumption in the UI contract registry path.
- Disable direct runtime consumption of `appState.uiLayouts` in runtime HUD/detail rendering.
- Replace building arrangement layout-node rendering with one fixed old-shell building renderer.
- Preserve layout data through authoring, export, import, built-in packs, and runtime loading.
- Update regression tests and change-log entries for the rollback.

### Still Out Of Scope

- Deleting layout fields from Script Editor projects or scenario packs.
- Hiding Script Editor layout authoring surfaces.
- Reopening editor-page layout governance.
- Reintroducing old hardcoded menu/event routing.
- Any new building-specific business branch in `src/main.ts`.

## File Map

### Existing files to modify

- `docs/blueprints/plans/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target-plan.md`
  - Record that the rollback is absorbed into active ACC-FORMAT-006 contradiction repair.
- `docs/blueprints/queues/preview-runtime-loading-full-chain-consistency-and-final-acceptance-queue.md`
  - Record the exact rollback contradiction and its in-queue repair route.
- `docs/change-log.md`
  - Record the user-visible runtime rollback after code lands.
- `src/application/ui/ui-contract-registry.ts`
  - Stop runtime screen contracts from exposing layout as active runtime truth.
- `src/application/ui/ui-layout-resolver.ts`
  - Make runtime layout resolution inert for runtime consumption.
- `src/ui/app-render.ts`
  - Stop passing runtime layout payloads into runtime HUD/detail rendering.
- `src/ui/panels/global-player-panel.ts`
  - Render the global HUD without requiring runtime layout input.
- `src/ui/views/building/building-module-view.ts`
  - Replace layout-node rendering with one fixed old-shell building renderer.
- `tests/robustness.test.cjs`
  - Replace layout-consumption assertions with rollback assertions and add full-chain regression coverage.
- `tests/browser-script-editor-deep-actions-smoke.test.cjs`
  - If the existing preview smoke needs one explicit assertion for old-shell runtime preview, add it here.

### Existing files expected to be deleted

- `none`

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - `node --test tests/robustness.test.cjs --test-name-pattern "ui contract registry ignores runtime layout payloads|runtime app render ignores persisted uiLayouts for runtime hud and detail surfaces|building module renderer ignores arrangement layout nodes and keeps canonical building actions reachable|script editor runtime preview keeps old shell building UI while preserved layout data survives export import"`
- Required commands:
  - `cmd /c npm run build:test`
  - `node --test tests/robustness.test.cjs`
  - `node --test tests/browser-script-editor-deep-actions-smoke.test.cjs`
  - `cmd /c npm run lint:blueprints`
  - `cmd /c npm run lint:blueprint-skill`
  - `cmd /c npm run blueprint:governance:check`
  - `cmd /c npm run lint:plans`

## Task 1: Route ACC-FORMAT-006 And Lock Failing Proof

**Files:**
- Modify: `docs/blueprints/plans/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target-plan.md`
- Modify: `docs/blueprints/queues/preview-runtime-loading-full-chain-consistency-and-final-acceptance-queue.md`
- Modify: `tests/robustness.test.cjs`
- Read: `docs/superpowers/specs/2026-07-27-runtime-layout-runtime-consumption-disable-design.md`

**Interfaces:**
- Consumes: `createUiContractRegistry(input: UiContractRegistryInput)`
- Consumes: `renderApp(input: AppRenderInput): string`
- Consumes: `renderBuildingModuleView(input: { stage: BuildingModuleStage; characterDefinitions: CharacterDefinition[]; characterManager: CharacterManager; }): string`
- Produces: `ACC-FORMAT-006 queue progress log entries that name the rollback contradiction explicitly`
- Produces: `Failing regression tests that define the rollback behavior before implementation`

- [ ] **Step 1: Write the failing governance and regression assertions**

```js
test("ui contract registry ignores runtime layout payloads", () => {
  const { createUiContractRegistry } = require("../.test-dist/application/ui/ui-contract-registry.js");
  const registry = createUiContractRegistry({
    builtinSchemasById: {},
    builtinLayoutsById: {
      "character-detail-screen": { screenId: "character-detail-screen", canvas: { width: 1600, height: 900 }, components: [] },
    },
    builtinSkinsById: {},
    builtinAssetCatalogs: [],
  });

  assert.equal(registry.getLayout("character-detail-screen"), null);
  assert.equal(
    registry.resolveScreenContract("character-detail-screen").layout,
    null
  );
});

test("runtime app render ignores persisted uiLayouts for runtime hud and detail surfaces", async () => {
  const source = await fs.promises.readFile(path.join(process.cwd(), "src/ui/app-render.ts"), "utf8");
  assert.doesNotMatch(source, /input\\.appState\\.uiLayouts\\["character-detail-screen"\\]/);
  assert.doesNotMatch(source, /input\\.appState\\.uiLayouts\\["global-hud"\\]/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/robustness.test.cjs --test-name-pattern "ui contract registry ignores runtime layout payloads|runtime app render ignores persisted uiLayouts for runtime hud and detail surfaces" --test-reporter spec`

Expected:

- `FAIL`
- `registry.getLayout("character-detail-screen")` still returns a layout object
- `src/ui/app-render.ts` still contains `input.appState.uiLayouts[...]`

- [ ] **Step 3: Record rollback routing in the active Blueprint docs**

```md
- `2026-07-27`: `ACC-FORMAT-006 contradiction inventory now explicitly includes the operator-requested rollback of runtime layout consumption across normal startup, JSON import startup, built-in startup, and Script Editor runtime preview while preserving authored layout data. The queue absorbs this as same-queue contradiction repair rather than reopening ACC-FORMAT-005 by default.`
```

- [ ] **Step 4: Add the failing building-shell proof**

```js
test("building module renderer ignores arrangement layout nodes and keeps canonical building actions reachable", () => {
  const { renderBuildingModuleView } = require("../.test-dist/ui/views/building/building-module-view.js");
  const markup = renderBuildingModuleView(/* existing building fixture with arrangement.layout nodes */);

  assert.doesNotMatch(markup, /c-building-layout-template/);
  assert.doesNotMatch(markup, /data-building-layout-node-id=/);
  assert.match(markup, /view-house-building-shell/);
  assert.match(markup, /data-action="building-container-item-action"/);
  assert.match(markup, /data-action="leave-house"/);
});
```

- [ ] **Step 5: Commit**

```bash
git add docs/blueprints/plans/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target-plan.md docs/blueprints/queues/preview-runtime-loading-full-chain-consistency-and-final-acceptance-queue.md tests/robustness.test.cjs
git commit -m "test: lock runtime layout rollback proof" -m "Summary:
- route the runtime layout rollback contradiction through ACC-FORMAT-006 governance
- add failing regression proof for layout-ignore runtime behavior"
```

## Task 2: Disable Runtime Layout Consumption In Shared Runtime Surfaces

**Files:**
- Modify: `src/application/ui/ui-contract-registry.ts`
- Modify: `src/application/ui/ui-layout-resolver.ts`
- Modify: `src/ui/app-render.ts`
- Modify: `src/ui/panels/global-player-panel.ts`
- Read: `src/ui/views/character/character-detail-view.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: `resolveScreenLayout(screenId: string, layers: UiLayoutLayers): ScreenLayoutPreset | null`
- Consumes: `renderGlobalPlayerPanel(model: GlobalPlayerPanelModel, layout: GlobalHudLayout): string`
- Produces: `getLayout(screenId: string): null`
- Produces: `renderGlobalPlayerPanel(model: GlobalPlayerPanelModel, layout?: GlobalHudLayout): string`
- Produces: `renderApp(input: AppRenderInput): string` without `appState.uiLayouts["character-detail-screen"]` and `appState.uiLayouts["global-hud"]`

- [ ] **Step 1: Write the failing runtime-consumption tests**

```js
test("global player panel renders task panel without runtime layout input", async () => {
  const { renderGlobalPlayerPanel } = await import("../.test-dist/ui/panels/global-player-panel.js");
  const markup = renderGlobalPlayerPanel(
    {
      portraitLabel: "default",
      portraitImageUrl: null,
      name: "Player",
      title: "Hero",
      currentDateText: "Date",
      locationText: "Beijing",
      goldText: "100",
      stamina: 80,
      fame: 50,
      reviewDateText: "Review",
      mainHouseMissionText: "Mission",
    }
  );

  assert.match(markup, /p-global-task-panel/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/robustness.test.cjs --test-name-pattern "global player panel renders task panel without runtime layout input" --test-reporter spec`

Expected:

- `FAIL`
- `renderGlobalPlayerPanel` still requires a second layout argument or omits the task panel

- [ ] **Step 3: Write the minimal implementation**

```ts
// src/application/ui/ui-layout-resolver.ts
export function resolveScreenLayout(
  screenId: string,
  layers: UiLayoutLayers
): ScreenLayoutPreset | null {
  void screenId;
  void layers;
  return null;
}

// src/ui/app-render.ts
const options: CharacterDetailViewOptions = {
  notoriety: typeof notorietyValue === "number" ? notorietyValue : 0,
  stipendText: `${playerCharacter.stats.gold} 文`,
};

// src/ui/panels/global-player-panel.ts
export function renderGlobalPlayerPanel(
  model: GlobalPlayerPanelModel,
  layout?: GlobalHudLayout
): string {
  const taskComponent = layout == null ? { id: "task-panel" } : getComponent(layout, "task-panel");
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/robustness.test.cjs --test-name-pattern "ui contract registry ignores runtime layout payloads|runtime app render ignores persisted uiLayouts for runtime hud and detail surfaces|global player panel renders task panel without runtime layout input" --test-reporter spec`

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/application/ui/ui-contract-registry.ts src/application/ui/ui-layout-resolver.ts src/ui/app-render.ts src/ui/panels/global-player-panel.ts tests/robustness.test.cjs
git commit -m "fix: disable shared runtime layout consumption" -m "Summary:
- stop runtime screen contracts from consuming layout presets as active runtime truth
- stop runtime HUD and detail rendering from depending on persisted uiLayouts"
```

## Task 3: Restore The Fixed Old Building Shell

**Files:**
- Modify: `src/ui/views/building/building-module-view.ts`
- Read: `src/application/building/building-module-entry.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: `selectBuildingModuleStage(input: BuildingModuleEntryInput): BuildingModuleStage`
- Consumes: `BuildingContainerViewModel`
- Produces: `renderBuildingModuleView(input: { stage: BuildingModuleStage; characterDefinitions: CharacterDefinition[]; characterManager: CharacterManager; }): string`
- Produces: fixed shell sections for title, description, roster, action list, and leave action without `arrangement.layout.nodes`

- [ ] **Step 1: Write the failing old-shell renderer test**

```js
test("building module renderer ignores arrangement layout nodes and keeps canonical building actions reachable", () => {
  const { renderBuildingModuleView } = require("../.test-dist/ui/views/building/building-module-view.js");
  const markup = renderBuildingModuleView(existingBuildingFixture);

  assert.doesNotMatch(markup, /c-building-layout-template--meeting-stage/);
  assert.doesNotMatch(markup, /c-building-layout-node--action-menu/);
  assert.doesNotMatch(markup, /data-building-layout-click-action-id=/);
  assert.match(markup, /Temple Shell/);
  assert.match(markup, /Explicit temple arrangement shell/);
  assert.match(markup, /data-building-container-action-id="review"/);
  assert.match(markup, /data-action="leave-house"/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/robustness.test.cjs --test-name-pattern "building module renderer ignores arrangement layout nodes and keeps canonical building actions reachable" --test-reporter spec`

Expected:

- `FAIL`
- current renderer still emits `c-building-layout-*` classes and layout-node attributes

- [ ] **Step 3: Write the minimal implementation**

```ts
export function renderBuildingModuleView(input: {
  stage: BuildingModuleStage;
  characterDefinitions: CharacterDefinition[];
  characterManager: CharacterManager;
}): string {
  if (input.stage.type !== "building") {
    return "";
  }

  const title = input.stage.arrangement.displayName ?? input.stage.activeHouse.name;
  const description = input.stage.arrangement.description ?? "";
  const seatContainer = input.stage.containerViewModels.find((container) => container.type === "character-seats");
  const actionContainer = input.stage.containerViewModels.find((container) => container.type === "action-menu");

  return `
    <section class="view-house view-house--arrangement view-house-building-shell" style="${createBuildingBackgroundStyle(...)}">
      <header class="c-stage-header">
        <div>
          <p class="c-stage-header__eyebrow">建筑</p>
          <h1 class="c-stage-header__title">${title}</h1>
        </div>
        <button class="c-button c-button--ghost" data-action="leave-house">${input.stage.activeHouse.backAction?.label ?? "返回"}</button>
      </header>
      ${description.length === 0 ? "" : `<div class="c-house-interior__hero c-panel"><p class="c-house-interior__hero-text">${description}</p></div>`}
      ${renderFixedRoster(seatContainer, input.characterDefinitions)}
      ${renderFixedActionMenu(input.stage.arrangement, actionContainer)}
    </section>
  `;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/robustness.test.cjs --test-name-pattern "building module renderer ignores arrangement layout nodes and keeps canonical building actions reachable" --test-reporter spec`

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/ui/views/building/building-module-view.ts tests/robustness.test.cjs
git commit -m "fix: restore fixed building shell runtime" -m "Summary:
- replace layout-node-driven building rendering with a fixed old-shell runtime view
- keep canonical menu and leave actions reachable without consuming arrangement layout nodes"
```

## Task 4: Prove Full-Chain Entry Consistency And Record The Rollback

**Files:**
- Modify: `docs/change-log.md`
- Modify: `tests/browser-script-editor-deep-actions-smoke.test.cjs`
- Modify: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: `previewScriptEditorProjectRuntime()` through existing workspace preview flow
- Consumes: `startLoadedScenarioPackWithLoading(...)`
- Produces: ACC-FORMAT-006 verification evidence covering built-in startup, JSON import startup, and Script Editor preview
- Produces: change-log entry for the rollback

- [ ] **Step 1: Add the final consistency assertions**

```js
test("script editor runtime preview keeps old shell building UI while preserved layout data survives export import", async () => {
  const { exportScriptEditorProjectToScenarioPackFiles } = await import("../.test-dist/application/script-editor/runtime-pack-export.js");
  const { loadScriptEditorProjectFromScenarioPackFiles } = await import("../.test-dist/application/script-editor/runtime-pack-import.js");
  const project = createExportableScriptEditorProjectDefinition();
  project.buildingArrangements[0].layout = {
    templateId: "meeting-stage",
    shellClassNames: ["view-house-temple"],
    nodes: [{ id: "node.actions", kind: "action-menu", regionId: "actions" }],
  };

  const exported = exportScriptEditorProjectToScenarioPackFiles(project);
  const imported = await loadScriptEditorProjectFromScenarioPackFiles(
    createImportedFilesFromSerializedJsonRecord(exported, "runtime-pack")
  );

  assert.deepEqual(imported.buildingArrangements[0].layout, project.buildingArrangements[0].layout);
});
```

- [ ] **Step 2: Run the bounded proof and browser smoke**

Run:

```bash
cmd /c npm run build:test
node --test tests/robustness.test.cjs
node --test tests/browser-script-editor-deep-actions-smoke.test.cjs
cmd /c npm run lint:blueprints
cmd /c npm run lint:blueprint-skill
cmd /c npm run blueprint:governance:check
cmd /c npm run lint:plans
```

Expected:

- `PASS`

- [ ] **Step 3: Perform manual in-app browser acceptance**

```text
1. 正常开局进入运行时，确认建筑页是旧 unified shell UI。
2. 走 JSON 导入开局，确认同一建筑页仍是同一套旧 shell UI。
3. 在 Script Editor 使用剧本模板，删除所有城市，新建北京，绑定建筑实例“帅府”，运行预览。
4. 进入北京 -> 选择“帅府”，确认页面不再出现 layout-node 结构 UI，且动作按钮与离开按钮正常。
5. 如果点击进入帅府后仍弹对话，记录对话绑定来源是菜单事件、建筑实例事件，还是其它 event chain，而不是 layout 节点。 
```

- [ ] **Step 4: Record the rollback in the change log**

```md
- `2026-07-27`: `Runtime no longer consumes runtime layout or arrangement layout as active display truth. Normal startup, JSON import startup, built-in startup, and Script Editor runtime preview now converge on the old unified shell UI while preserving authored layout data in packs and projects.`
```

- [ ] **Step 5: Commit**

```bash
git add docs/change-log.md tests/browser-script-editor-deep-actions-smoke.test.cjs tests/robustness.test.cjs
git commit -m "docs: record runtime layout rollback acceptance" -m "Summary:
- record ACC-FORMAT-006 verification for the runtime layout consumption rollback
- document the old-shell runtime convergence across startup, import, built-in, and preview"
```

## Exit Check

- [ ] `Runtime display truth is the old unified shell UI across all covered entrypoints.`
- [ ] `Layout data still survives project save, export, import, and built-in loading unchanged.`
- [ ] `Menu/event/playable routing remains on the current canonical chains.`
- [ ] Project progress sync is updated if the child state changed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

