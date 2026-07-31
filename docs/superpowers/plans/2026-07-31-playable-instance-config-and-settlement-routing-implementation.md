# Playable Instance Config And Settlement Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the old script-editor `玩法绑定` authoring contract with a creator-facing `基础 / 配置组 / 结算组` model, route minigame completion through authored event/settlement chains, and align Script Editor workbenches to the shared tabbed layout used by `人物`.

**Architecture:** Keep launch ownership on playable instances, but move creator-authored runtime tuning into `configEntries` and authored completion routing into ordered `settlementRoutes`. The Script Editor shell should stop rendering the large top inspector summary band for authoring modules, and module-specific editing should move into consistent tab surfaces whose first tab is always `基础`. Runtime/export/import layers stay compatible by translating the new authoring model into existing playable integrations and settlement/event runtime seams instead of letting minigames persist rewards directly.

**Tech Stack:** TypeScript authoring/runtime modules under `src/modules/script-editor`, shared playable runtime in `src/core/runtime`, JS authoring UI in `src/modules/script-editor/ui/main-ui-script-editor-module.js`, shared Script Editor styles in `src/styles/script-editor.css`, regression coverage in `tests/robustness.test.cjs`, and governance verification with `npm run lint:plans`.

## Execution State

- Status: `running`
- Last Updated: `2026-07-31`
- Current Focus: `Task 4: rebuild the visible Script Editor tabs and shared workspace shell after the runtime/export/import chain converged on configEntries + settlementRoutes.`
- Next Step: `Remove the shared top summary band, rebuild playable/event tabs to the 人物-style shell, and update shared control sizing after the new runtime route path is already verified.`
- Verification: `Task 1 red-phase completed. Task 2 helper slice passes direct .test-dist verification. Task 3 now compiles: build:test is green, a direct round-trip check confirms configEntries + settlementRoutes export/import through playable-integrations.json, and a direct routing check confirms resolvePlayableResultRouting picks the first matching settlement route targetEventId.`
- Notes: `Legacy docs/superpowers progress remains explicitly pointed at the 2026-07-28 person child. This plan stays waiting until it is explicitly admitted for execution. The repository instruction references docs/main-shell-contract.md, but that file is currently absent in this worktree, so ownerization guidance must follow existing script-editor module boundaries directly.`

## Progress Log

- 2026-07-31
  - Summary: `Authored the implementation plan for playable-instance config routing, settlement-group authoring, and Script Editor workbench tab unification.`
  - Verification: `npm run lint:plans`
  - Next: `Choose execution mode, then start failing coverage for the new playable instance schema, tab layout, and top-summary-band removal.`
- 2026-07-31
  - Summary: `Completed Task 1 red phase by adding failing regressions for the new playable instance authoring contract, the retired workspace summary band, and the shared first-tab naming rule.`
  - Verification: `PATH=... pnpm run build:test; PATH=... node --test tests/robustness.test.cjs --test-name-pattern ... ; source inspection with rg confirmed the expected old seams still exist in minigame-binding-authoring.ts, script-editor-project.ts, main-ui-script-editor-module.js, and script-editor-workspace-view.ts.`
  - Next: `Replace the playable authoring record/helper contract with configEntries + settlementRoutes and make the first new helper regression pass.`
- 2026-07-31
  - Summary: `Replaced the minigame domain/helper normalization seam with configEntries + settlementRoutes, added creator-facing config/route helper mutators, and kept build:test green after fixing exactOptionalPropertyTypes normalization.`
  - Verification: `PATH=... pnpm run build:test; PATH=... node - <<EOF helper-check against .test-dist/modules/script-editor/application/minigame-binding-authoring.js EOF`
  - Next: `Update runtime-pack-export/import and workspace-shell to consume the new playable instance fields before rebuilding the visible editor tabs.`
- 2026-07-31
  - Summary: `Rewired runtime-pack-export/import and workspace diagnostics to treat minigame integration/trigger data as derived runtime artifacts, export configEntries as launch payload, round-trip settlementRoutes through outcomeConfig, and route event-owned playable completion through the first matching targetEventId.`
  - Verification: `PATH=... pnpm run build:test; PATH=... node - <<EOF roundtrip-check against runtime-pack-export/import EOF; PATH=... node - <<EOF routing-check against playable-result-routing EOF`
  - Next: `Rebuild the visible Script Editor tab shell, remove the shared top summary band, and align module-first-tab naming + control sizing to the 人物 baseline.`
- 2026-07-31
  - Summary: `Removed the shared top inspector summary band from the Script Editor workspace view, rebuilt the visible 事件 / 玩法 workbench headers into tabbed surfaces, replaced the playable page with 基础 / 配置组 / 结算组, rewired main-ui field handling to the new config/settlement datasets, and recorded the contract change in docs/change-log.md.`
  - Verification: `PATH=... pnpm run build:test; PATH=... node --check src/ui/main-ui/main-ui-flow.js; PATH=... node --check src/modules/script-editor/ui/main-ui-script-editor-module.js; PATH=... node - <<EOF ui-structure-check EOF; PATH=... node - <<EOF workspace-view-check EOF; PATH=... node - <<EOF helper-ui-contract-check EOF`
  - Next: `Continue cleaning stale robustness assertions that still hardcode the retired playable binding contract, then run a narrower verification pass around the updated authoring surface.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-31-playable-instance-config-and-settlement-routing-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `updated`
- Notes:
  - `玩法` 当前 UI 已被压缩成基础信息单页，但底层 record、helper、import/export、workspace diagnostic 仍然围绕旧的 binding contract：integrationId / ownerKind / returnPolicy / settlementId / launchPayload / outcomeRoutes。`
  - `菜单工作台` 顶部的“概述”并不是菜单模块私有，而是 Script Editor workspace inspector 统一壳层的一部分；要保持全模块一致，必须在 shared workspace view 上移除这一类顶部摘要带，而不是只改单个模块。`
  - `人物`、`城市/建筑`、`剧情/对话` 已经使用 inspector header slot + tabs 的模式，但 `事件` 仍是单页，`玩法` 当前也没有真正的 creator-facing 分组页，需要补齐到统一结构。`
  - `core/runtime/playable-result-routing.ts` 已经存在第一版 shared result shell，因此这次 runtime 变更应该是扩展其 routing inputs，而不是再引入第二套 completion carrier。`

## Implementation Scope

### In Scope

- Replace `ScriptEditorMinigameRecord` with a playable-instance authoring shape centered on `configEntries` and `settlementRoutes`.
- Remove creator-facing `接入方案` and explicit `结算实例` fields from the playable editor and stop requiring authoring users to think in owner-kind / return-policy jargon.
- Add `基础 / 配置组 / 结算组` tabs to the playable editor and align module workbenches to the shared tab-first layout whose first tab is `基础`.
- Remove the large top overview/summary inspector band from authoring modules and keep only local tabs plus editor content.
- Teach runtime export/import, workspace diagnostics, and runtime routing to consume the new playable-instance contract.
- Keep final stamina, reward, and persistent state mutation settlement-owned and event-routed.
- Update creator-facing defaults, built-in template assumptions, and change-log documentation for the new contract.

### Still Out Of Scope

- Inventing arbitrary scripting inside route conditions.
- Parallel multi-route firing for one playable completion.
- Reopening `main.ts` with new feature branches for minigame-specific business flow.
- Broad migration of all existing flow/battle authoring surfaces beyond the shared tab-shell rule required for consistency.
- Replacing runtime `PlayableIntegrationDefinition` itself with a brand-new transport format.

## File Map

### Existing files to modify

- `src/modules/script-editor/domain/script-editor-project.ts`
  - Replace the old `ScriptEditorMinigameRecord` authoring fields with `configEntries` and `settlementRoutes`, and define the ordered route condition/value types the UI and import/export layers will share.
- `src/modules/script-editor/application/minigame-binding-authoring.ts`
  - Replace default-record creation, normalization, and field mutators so playable instances no longer author `integrationId`, `ownerKind`, `returnPolicy`, `settlementId`, `launchPayload`, or legacy `outcomeRoutes`.
- `src/modules/script-editor/application/runtime-pack-export.ts`
  - Translate the new playable instance authoring model into runtime playable integrations and route-derived outcome config / trigger ownership without exposing the old creator-facing contract.
- `src/modules/script-editor/application/runtime-pack-import.ts`
  - Reconstruct `configEntries` and `settlementRoutes` from imported runtime playable integrations and imported playable outcome config.
- `src/modules/script-editor/application/workspace-shell.ts`
  - Update workspace summaries, diagnostics, and target-tab routing to use the new playable tabs and stop describing minigames in terms of launch payload count / outcomeRoutes count.
- `src/modules/script-editor/ui/views/script-editor-workspace-view.ts`
  - Remove the large top inspector summary band from authoring modules while preserving the existing shell, toolbar, sidebar, and optional inline header slots.
- `src/modules/script-editor/ui/main-ui-script-editor-module.js`
  - Rebuild the playable editor around `基础 / 配置组 / 结算组`, add any missing module tabs whose first tab is `基础`, and remove per-module reliance on the old summary band.
- `src/styles/script-editor.css`
  - Normalize tab shells and shared control heights, and remove styling that only exists to support the retired top summary band.
- `src/core/contracts/playable-runtime.ts`
  - Extend the runtime outcome config shape so ordered settlement/event routes can be represented without forcing rewards into the playable definition.
- `src/core/runtime/playable-result-routing.ts`
  - Resolve playable fact completion against authored ordered routes and emit settlement/event-owned follow-up routing metadata through the existing shared result seam.
- `src/core/runtime/playable-runtime.ts`
  - Pass route configuration into result routing and keep completion handoff/session clearing aligned with the new event/settlement path.
- `tests/robustness.test.cjs`
  - Add or update regressions for playable authoring tabs, route import/export, workspace summary-band removal, shared tab-shell consistency, and settlement-owned runtime completion.
- `docs/change-log.md`
  - Record the creator-facing contract change, workspace-shell alignment, and settlement-owned completion routing.

### Existing files expected to be read carefully

- `src/modules/script-editor/application/person-authoring.ts`
  - Preserve the established `人物` tab-shell style as the baseline for other modules.
- `src/modules/script-editor/application/menu-authoring.ts`
  - Keep menu-specific content logic separate from the shared workspace-shell summary-band removal.
- `src/modules/script-editor/application/minimal-workflow.ts`
  - Ensure new minigame defaults and record creation still flow through the canonical script-editor record lifecycle.
- `src/application/events/event-playable-runtime.ts`
  - Keep event-owned playable completion consumption aligned with the extended routing output.
- `src/application/scenario/scenario-pack-loader.ts`
  - Verify imported runtime payloads remain compatible with the existing runtime pack loader expectations.

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - `script editor playable instance authoring exposes 基础 / 配置组 / 结算组 and hides retired binding jargon`
  - `script editor workspace view removes the top inspector summary band while keeping tab headers inline`
  - `script editor module workbenches align first-tab naming to 基础`
  - `playable instance export/import round-trips configEntries and ordered settlementRoutes`
  - `playable runtime resolves first-match settlement route from fact completion without direct reward persistence`
- Required commands:
  - `npm run build:test`
  - `node --test tests/robustness.test.cjs --test-name-pattern "script editor playable instance|script editor workspace view|playable runtime resolves first-match settlement route|script editor module workbenches align first-tab naming"`
  - `npm run typecheck`
  - `npm run lint:plans`

## Task 1: Lock The New Authoring Contract With Failing Tests

**Files:**
- Modify: `tests/robustness.test.cjs`
- Read: `docs/superpowers/specs/2026-07-31-playable-instance-config-and-settlement-routing-design.md`
- Read: `src/modules/script-editor/domain/script-editor-project.ts`
- Read: `src/modules/script-editor/application/minigame-binding-authoring.ts`
- Read: `src/modules/script-editor/ui/main-ui-script-editor-module.js`

- [x] **Step 1: Add failing record-shape and helper assertions**

Add regression coverage that requires the old binding-only fields to disappear from creator-facing normalization while the new authored structures exist:

```js
test("script editor playable instance helpers normalize config entries and ordered settlement routes", () => {
  const {
    createDefaultScriptEditorMinigameRecord,
    normalizeScriptEditorMinigameRecord,
  } = require("../.test-dist/modules/script-editor/application/minigame-binding-authoring.js");

  const record = normalizeScriptEditorMinigameRecord(
    createDefaultScriptEditorMinigameRecord(0)
  );

  assert.equal(Array.isArray(record.configEntries), true);
  assert.equal(Array.isArray(record.settlementRoutes), true);
  assert.equal("integrationId" in record, false);
  assert.equal("settlementId" in record, false);
  assert.equal("launchPayload" in record, false);
  assert.equal("outcomeRoutes" in record, false);
});
```

- [x] **Step 2: Add failing UI-shell assertions**

Add source-level coverage that requires the playable editor and shared workspace shell to expose the approved tab structure and retire the top summary band:

```js
test("script editor playable instance authoring exposes 基础 / 配置组 / 结算组 and hides retired binding jargon", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/modules/script-editor/ui/main-ui-script-editor-module.js"),
    "utf8"
  );

  assert.match(source, /renderScriptEditorMinigameTabButton\\("basics", "基础"\\)/);
  assert.match(source, /renderScriptEditorMinigameTabButton\\("config", "配置组"\\)/);
  assert.match(source, /renderScriptEditorMinigameTabButton\\("settlement", "结算组"\\)/);
  assert.doesNotMatch(source, /接入方案/);
  assert.doesNotMatch(source, /结算实例/);
});
```

```js
test("script editor workspace view removes the top inspector summary band for authoring modules", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/modules/script-editor/ui/views/script-editor-workspace-view.ts"),
    "utf8"
  );

  assert.doesNotMatch(source, /c-script-editor-shell__stats/);
  assert.doesNotMatch(source, /c-script-editor-shell__cards/);
  assert.doesNotMatch(source, /renderInspectorCard/);
});
```

- [x] **Step 3: Add failing module-consistency assertions**

Lock the repository-wide tab rule instead of only the playable module:

```js
test("script editor module workbenches align first-tab naming to 基础", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/modules/script-editor/ui/main-ui-script-editor-module.js"),
    "utf8"
  );

  assert.match(source, /renderScriptEditorPersonTabButton\\("profile", "基础"\\)/);
  assert.match(source, /renderScriptEditorLocationTabButton\\("profile", "基础"\\)/);
  assert.match(source, /renderScriptEditorNarrativeTabButton\\("profile", "基础"\\)/);
  assert.match(source, /c-script-editor-event-editor__tabs/);
});
```

- [x] **Step 4: Run the targeted tests and confirm failure**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "script editor playable instance|script editor workspace view removes the top inspector summary band|script editor module workbenches align first-tab naming"
```

Expected:

- `FAIL`
- missing `configEntries` / `settlementRoutes`, missing new playable tabs, and the still-present workspace inspector summary markup should cause the failures

- [x] **Step 5: Sync child-local governance**

Update this plan only:

- `Execution State.Status` -> `running`
- `Current Focus` -> `Task 1 failing authoring regressions`
- append the failing-test result to `Progress Log`

Do not update `docs/superpowers/project-progress.md` yet because this plan is still waiting for explicit legacy admission.

## Task 2: Replace The Playable Authoring Data Contract

**Files:**
- Modify: `src/modules/script-editor/domain/script-editor-project.ts`
- Modify: `src/modules/script-editor/application/minigame-binding-authoring.ts`
- Modify: `src/modules/script-editor/application/minimal-workflow.ts`
- Modify: `src/modules/script-editor/application/script-editor-id-allocation.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Define the new authoring types**

Replace the old minigame authoring fields with explicit config and route types:

```ts
export type ScriptEditorPlayableConfigEntry = {
  id: string;
  label: string;
  valueType: "number" | "text" | "boolean" | "enum";
  value: string | number | boolean | null;
  notes?: string;
  enumOptions?: Array<{ value: string; label: string }>;
};

export type ScriptEditorPlayableSettlementRoute = {
  id: string;
  title: string;
  enabled: boolean;
  targetEventId: string;
  conditions: {
    outcomeIn?: Array<"success" | "failure" | "cancelled">;
    scoreMin?: number;
    scoreMax?: number;
    metricRules?: Array<{
      metricKey: string;
      operator: ">" | ">=" | "<" | "<=" | "=";
      value: string | number | boolean;
    }>;
  };
};
```

```ts
export type ScriptEditorMinigameRecord = ScriptEditorEntityRecord & {
  title: string;
  description?: string;
  playableId?: string;
  configEntries: ScriptEditorPlayableConfigEntry[];
  settlementRoutes: ScriptEditorPlayableSettlementRoute[];
  notes?: string;
};
```

- [ ] **Step 2: Rewrite defaults and normalization**

Make the helper layer create and normalize the new fields instead of the retired binding jargon:

```ts
return {
  id,
  title: `玩法 ${suffix}`,
  description: "",
  playableId: "activity-qte",
  configEntries: [],
  settlementRoutes: [],
  notes: "",
};
```

```ts
export function normalizeScriptEditorMinigameRecord(
  record: Partial<ScriptEditorMinigameRecord> & { id: string }
): ScriptEditorMinigameRecord {
  return {
    ...record,
    title: normalizeString(record.title, record.id),
    description: normalizeOptionalString(record.description),
    playableId: normalizeOptionalString(record.playableId),
    configEntries: normalizeConfigEntries(record.configEntries),
    settlementRoutes: normalizeSettlementRoutes(record.settlementRoutes),
    notes: normalizeOptionalString(record.notes),
  };
}
```

- [ ] **Step 3: Add mutators for config rows and ordered routes**

Replace the old launch-payload/outcome-route helpers with row-oriented creator helpers:

```ts
export function appendScriptEditorMinigameConfigEntry(
  record: ScriptEditorMinigameRecord
): ScriptEditorMinigameRecord {
  return {
    ...record,
    configEntries: [
      ...record.configEntries,
      { id: `config.${record.configEntries.length + 1}`, label: "", valueType: "text", value: "" },
    ],
  };
}
```

```ts
export function appendScriptEditorMinigameSettlementRoute(
  record: ScriptEditorMinigameRecord
): ScriptEditorMinigameRecord {
  return {
    ...record,
    settlementRoutes: [
      ...record.settlementRoutes,
      { id: `route.${record.settlementRoutes.length + 1}`, title: "", enabled: true, targetEventId: "", conditions: {} },
    ],
  };
}
```

- [ ] **Step 4: Run focused helper verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "script editor playable instance helpers normalize config entries and ordered settlement routes"
```

Expected:

- `PASS`

- [ ] **Step 5: Record progress**

Update this plan’s `Execution State`, checkboxes, and `Progress Log` with the helper-contract completion before touching export/import.

## Task 3: Rewire Export, Import, And Workspace Diagnostics

**Files:**
- Modify: `src/modules/script-editor/application/runtime-pack-export.ts`
- Modify: `src/modules/script-editor/application/runtime-pack-import.ts`
- Modify: `src/modules/script-editor/application/workspace-shell.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Export the new authoring model into runtime integrations**

Keep runtime integrations as the transport, but derive them from the new authoring surface:

```ts
const routeConfig = materializePlayableSettlementRoutes(
  minigame.settlementRoutes,
  fieldPath,
  diagnostics
);

playableIntegrations.push({
  editorRecordId: minigame.id,
  integrationId: derivePlayableIntegrationId(minigame),
  playableId,
  ownerDefaults: { ownerKind: "external", ownerId: null, returnPolicy: "close-only" },
  trigger: {
    triggerId: `trigger.playable.${playableId}.event.${eventLaunchEventId}`,
    ownerKind: "external",
    trigger: eventLaunchEventId,
    launchPayload: materializePlayableConfigPayload(minigame.configEntries),
  },
  outcomeConfig: routeConfig,
});
```

- [ ] **Step 2: Import runtime integrations back into configEntries and settlementRoutes**

Map imported launch payload and imported outcome config back into the new authoring fields:

```ts
return [
  {
    id: editorRecordId,
    title: integration.integrationId,
    description: "",
    playableId: integration.playableId,
    configEntries: mapImportedLaunchPayloadToConfigEntries(trigger?.launchPayload),
    settlementRoutes: mapImportedOutcomeConfigToSettlementRoutes(integration.outcomeConfig),
    notes: "Imported from runtime playable integration.",
  },
];
```

- [ ] **Step 3: Update workspace summaries and issue routing**

Stop describing minigames by `launch payload` and `outcomeRoutes` counts, and point diagnostics to the new tabs:

```ts
if (family === "minigames") {
  const minigame = project.minigames.find((record) => record.id === entityId);
  return `玩法配置项 ${(minigame?.configEntries ?? []).length} 条，结算路由 ${(minigame?.settlementRoutes ?? []).length} 条。`;
}
```

```ts
targetTab: "settlement",
message: `玩法 ${minigame.id} 的结算路由引用了缺失事件 ${targetEventId}。`,
```

- [ ] **Step 4: Add round-trip and diagnostic regressions**

Add tests shaped like:

```js
test("script editor playable instance export/import round-trips configEntries and ordered settlementRoutes", async () => {
  const files = exportScriptEditorProjectToScenarioPackFiles(project);
  const importedProject = await importScriptEditorProjectFromRuntimePackFiles(files, "playable-route-roundtrip");

  assert.deepEqual(importedProject.minigames[0]?.configEntries, project.minigames[0]?.configEntries);
  assert.equal(importedProject.minigames[0]?.settlementRoutes.length, 2);
  assert.equal(importedProject.minigames[0]?.settlementRoutes[0]?.targetEventId, "event.playable.success");
});
```

```js
test("script editor workspace shell routes playable settlement issues to the 结算组 tab", () => {
  const workspace = createScriptEditorWorkspaceShellViewModel({ project });
  const issue = workspace.auxiliaryPanel.issues.find((item) => item.targetFamily === "minigames");
  assert.equal(issue?.targetTab, "settlement");
});
```

- [ ] **Step 5: Run focused verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "playable instance export/import round-trips|workspace shell routes playable settlement issues"
```

Expected:

- `PASS`

## Task 4: Rebuild The Script Editor Workbench And Playable UI

**Files:**
- Modify: `src/modules/script-editor/ui/views/script-editor-workspace-view.ts`
- Modify: `src/modules/script-editor/ui/main-ui-script-editor-module.js`
- Modify: `src/styles/script-editor.css`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Remove the top summary band from the shared workspace view**

Retire the large stat/card inspector section and keep only the inline header slot surface:

```ts
return `
  <section class="c-script-editor-shell__inspector${compactClass}">
    <div class="c-script-editor-shell__inspector-header">
      ${headerTextMarkup}
      ${headerSlotMarkup}
    </div>
    ${inspectorDescriptionMarkup}
  </section>
`;
```

Delete the non-compact stats/cards branch and the now-unused `renderInspectorCard(...)` helper.

- [ ] **Step 2: Add missing tab shells and rename first tabs to 基础**

Keep the per-module header-slot model, but ensure all authoring modules use tabs and that the first tab is consistently named `基础`:

```js
<template data-script-editor-inspector-header-slot>
  <div class="c-script-editor-event-editor__tabs" role="tablist" aria-label="事件详情分栏">
    ${this.renderScriptEditorEventTabButton("basics", "基础")}
    ${this.renderScriptEditorEventTabButton("relations", "关联")}
    ${this.renderScriptEditorEventTabButton("routing", "路由")}
  </div>
</template>
```

For the playable module, restore a real tab list instead of a single plain panel:

```js
<template data-script-editor-inspector-header-slot>
  <div class="c-script-editor-minigame-editor__tabs" role="tablist" aria-label="玩法详情分栏">
    ${this.renderScriptEditorMinigameTabButton("basics", "基础")}
    ${this.renderScriptEditorMinigameTabButton("config", "配置组")}
    ${this.renderScriptEditorMinigameTabButton("settlement", "结算组")}
  </div>
</template>
```

- [ ] **Step 3: Render the playable basics/config/settlement panels**

The playable basics tab should contain only title + playable prototype:

```js
if (this.scriptEditorMinigameTab === "basics") {
  return `
    <section class="c-script-editor-minigame-panel" aria-label="玩法基础分栏">
      <div class="c-script-editor-form-grid">
        <label class="c-script-editor-form-field">
          <span>标题</span>
          <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(minigame.title)}" data-script-editor-minigame-field="title" />
        </label>
        <label class="c-script-editor-form-field">
          <span>玩法原型</span>
          <select class="c-script-editor-form-field__input" data-script-editor-minigame-field="playableId">
            ${/* playable options */ ""}
          </select>
        </label>
      </div>
    </section>
  `;
}
```

The config tab should render editable config rows; the settlement tab should render ordered route rows with target event selectors and route-condition controls.

- [ ] **Step 4: Normalize shared control heights and tab styling**

Move the height rule into shared Script Editor controls instead of a minigame-only override:

```css
.c-script-editor-form-field__input {
  min-height: 44px;
  padding: 10px 14px;
}

.c-script-editor-minigame-editor__tabs,
.c-script-editor-person-editor__tabs,
.c-script-editor-location-editor__tabs,
.c-script-editor-narrative-editor__tabs,
.c-script-editor-event-editor__tabs {
  display: flex;
  gap: 12px;
  align-items: center;
}
```

- [ ] **Step 5: Run the UI verification batch**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "script editor playable instance authoring exposes 基础 / 配置组 / 结算组|script editor workspace view removes the top inspector summary band|script editor module workbenches align first-tab naming"
```

Expected:

- `PASS`

## Task 5: Extend Shared Playable Result Routing To Ordered Settlement Routes

**Files:**
- Modify: `src/core/contracts/playable-runtime.ts`
- Modify: `src/core/runtime/playable-result-routing.ts`
- Modify: `src/core/runtime/playable-runtime.ts`
- Modify: `src/application/events/event-playable-runtime.ts`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/change-log.md`

- [ ] **Step 1: Extend runtime outcome config for ordered routes**

Keep the shared runtime seam but let integrations carry authored ordered settlement routes:

```ts
export type PlayableOutcomeRouteConfig = {
  targetEventId: string;
  conditions: {
    outcomeIn?: PlayableOutcome[];
    scoreMin?: number;
    scoreMax?: number;
    metricRules?: Array<{
      metricKey: string;
      operator: ">" | ">=" | "<" | "<=" | "=";
      value: PlayableFactValue;
    }>;
  };
};

export type PlayableOutcomeConfig = {
  routes?: PlayableOutcomeRouteConfig[];
};
```

- [ ] **Step 2: Resolve the first matching route in shared result routing**

Extend the existing routing helper instead of inventing a second runtime carrier:

```ts
const matchedRoute = (input.routes ?? []).find((route) =>
  doesPlayableRouteMatch({
    outcome: input.outcome,
    factResult: input.factResult,
    route,
  })
);

return createPlayableResultShell({
  session: input.session,
  outcome: input.outcome,
  factResult: input.factResult,
  followUpEventId: matchedRoute?.targetEventId,
  effects: input.settlementEffects,
});
```

The route matcher must fail closed when a referenced metric is absent or when a route is malformed.

- [ ] **Step 3: Add runtime regressions**

Add coverage shaped like:

```js
test("playable runtime resolves first-match settlement route from fact completion without direct reward persistence", () => {
  const result = resolvePlayableResultRouting({
    session,
    outcome: "success",
    factResult: { status: "completed", metrics: { score: 88, grade: "A" } },
    routes: [
      { targetEventId: "event.playable.high-score", conditions: { scoreMin: 80 } },
      { targetEventId: "event.playable.fallback", conditions: { outcomeIn: ["success"] } },
    ],
  });

  assert.equal(result.followUpEventId, "event.playable.high-score");
  assert.deepEqual(result.effects, []);
});
```

- [ ] **Step 4: Record the contract in docs**

Append a change-log entry that states:

- playable authoring now uses `配置组 / 结算组`
- workspace authoring modules retire the top overview band
- minigame completion remains fact-only and reward persistence remains event/settlement-owned

- [ ] **Step 5: Run final verification for the slice**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "script editor playable instance|workspace shell routes playable settlement issues|playable runtime resolves first-match settlement route"
npm run typecheck
npm run lint:plans
```

Expected:

- `PASS`

## Exit Check

- [ ] Playable instances author through `基础 / 配置组 / 结算组` instead of the retired binding surface.
- [ ] Creator-facing playable pages no longer expose `接入方案` or explicit `结算实例`.
- [ ] `configEntries` and ordered `settlementRoutes` round-trip through export/import.
- [ ] Shared Script Editor workbenches use tabs and keep the first tab named `基础`.
- [ ] The large top overview/summary band is removed from authoring modules.
- [ ] Playable completion routes the first matched event through the shared runtime seam without direct reward persistence.
- [ ] Verification results are recorded in this plan from fresh command output.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `Playable instance config and settlement routing`
- Parent Task: `Script Editor playable authoring contract unification`
- Parent Stage: `Historical Governance Migration`
- Closeout Status: `waiting`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Choose execution mode, explicitly admit this child if it becomes the active legacy target, then begin Task 1 from the first unchecked step.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-31-playable-instance-config-and-settlement-routing-implementation.md`
- Push Status: `none`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then resume this plan and continue from the first unchecked step after explicit admission.`
