# Stage Configuration Creator UI Reorg Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize Script Editor progression authoring into one creator-facing `阶段配置` module that leads with authored usage objects, embeds rule editing on the same page, removes the workbench summary strip, and adds a help modal.

**Architecture:** Keep `progressTracks` and `progressTrackBindings` as the runtime/resource truth, but collapse the creator-facing navigation and page composition into one synthetic UI surface. The left list should be driven by binding records as the concrete authored subject, while the right editor composes object configuration and referenced rule editing into one panel without changing progression or settlement runtime boundaries.

**Tech Stack:** TypeScript authoring helpers, `src/application/script-editor/*`, `src/ui/main-ui/main-ui-flow.js`, existing Script Editor workspace-shell navigation/view-model seams, Node test runner in `tests/robustness.test.cjs`

## Global Constraints

- `event` remains the only formal routing owner
- progression must not introduce a second router
- all final property and state changes must execute only through settlement instances
- progress-value changes must also execute only through settlement instances
- `ProgressionRuntime` may emit settlement instances only
- the current Event-routing call chain must immediately hand those settlement instances to `SettlementRuntime`
- first version supports one metric per track, optional demotion, no per-owner threshold overrides, and no multi-track linked convergence rules
- Script Editor authoring must use Chinese creator-facing labels and must not expose raw ids/keys as the primary UI language
- the creator-facing module name must be `阶段配置`
- the page must use the editor’s standard `左侧列表 + 右侧编辑区` layout and must not keep the prior workbench summary strip
- the left list must be organized by `应用对象`
- the module must include a `帮助` button and modal with `功能说明` and `操作流程`

---

## Execution State

- Status: `running`
- Last Updated: `2026-07-25`
- Current Focus: `Creator-facing navigation and merged stage-configuration editor are implemented; remaining work is broader closeout/review only.`
- Next Step: `Inspect final diff quality, decide whether to run broader suite coverage, and prepare closeout/commit when requested.`
- Verification: `npm.cmd run build:test; node --test tests/robustness.test.cjs --test-name-pattern "script editor workspace shell exposes progression authoring families in gameplay navigation|script editor workspace shell exposes stage configuration creator module|script editor no longer exposes progression tracks and bindings as parallel first-level creator entries|script editor progression authoring exposes Chinese track and binding controls|script editor stage configuration creator module merges object binding rule editing and help into one surface"`
- Notes: `This is a follow-up UI-only slice on top of the completed generic progression runtime work.`

## Progress Log

- 2026-07-25
  - Summary: `Created the implementation plan for the creator-facing stage configuration module reorganization.`
  - Verification: `npm.cmd run lint:plans`
  - Next: `Execute Task 1 to collapse navigation and selection onto one creator-facing module.`
- 2026-07-25
  - Summary: `Collapsed creator navigation into one synthetic stage-configuration entry, merged progression binding/rule editing into one creator-facing panel, removed the old top summary strip from this page, and added an inline help modal plus regression coverage.`
  - Verification: `npm.cmd run build:test; node --test tests/robustness.test.cjs --test-name-pattern "script editor workspace shell exposes progression authoring families in gameplay navigation|script editor workspace shell exposes stage configuration creator module|script editor no longer exposes progression tracks and bindings as parallel first-level creator entries|script editor progression authoring exposes Chinese track and binding controls|script editor stage configuration creator module merges object binding rule editing and help into one surface"`
  - Next: `Review final diff quality and decide closeout/commit timing.`

## File Structure

- Modify `src/application/script-editor/workspace-shell.ts`
  - Collapse creator-facing family labels/navigation from dual progression entries into one `阶段配置` surface.
- Modify `src/application/script-editor/minimal-workflow.ts`
  - Keep progression records available to the synthetic UI surface without exposing both families as separate creator-facing entries.
- Modify `src/ui/main-ui/main-ui-flow.js`
  - Replace the separate progression track and binding editors with one composite `阶段配置` editor, add help modal state/actions, and remove the workbench summary strip.
- Modify `src/ui/main-ui/main-ui-flow.d.ts`
  - Keep any Script Editor UI state additions typed if the file currently mirrors `main-ui-flow.js` additions.
- Modify `src/application/script-editor/story-dialogue-event-authoring.ts`
  - Add any helper needed to normalize creator-facing object labels or safe default records for the composite editor.
- Modify `tests/robustness.test.cjs`
  - Add creator-facing navigation, composite editor, help modal, and terminology regression coverage.
- Modify `docs/change-log.md`
  - Record the creator-facing module reorganization once landed.

## Verification Plan

- Targeted verification:
  - `node --test tests/robustness.test.cjs --test-name-pattern "stage configuration|progression authoring|help modal|应用对象|阶段配置"`
- Required commands:
  - `npm.cmd run build:test`
  - `node --test tests/robustness.test.cjs --test-name-pattern "script editor workspace shell exposes stage configuration creator module|script editor stage configuration editor is organized around authored usage objects|script editor stage configuration help modal explains functionality and workflow|script editor no longer exposes progression tracks and bindings as parallel first-level creator entries"`
  - `npm.cmd run typecheck`
  - `npm.cmd test`

### Task 1: Collapse Creator Navigation To One Stage Configuration Module

**Files:**
- Modify: `src/application/script-editor/workspace-shell.ts`
- Modify: `src/application/script-editor/minimal-workflow.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes:
  - `getScriptEditorWorkflowVisibleFamilies()`
  - workspace-shell `FAMILY_LABELS` / tree-group construction
- Produces:
  - one creator-facing navigation entry labeled `阶段配置`
  - no parallel first-level creator entries for `progressTracks` and `progressTrackBindings`
  - selection/view-model truth that still reaches progression resources behind the unified surface

- [x] **Step 1: Write the failing workspace-shell navigation tests**

```js
test("script editor workspace shell exposes stage configuration creator module", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/application/script-editor/workspace-shell.ts"),
    "utf8"
  );

  assert.match(source, /stageConfiguration|阶段配置/);
});

test("script editor no longer exposes progression tracks and bindings as parallel first-level creator entries", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/application/script-editor/workspace-shell.ts"),
    "utf8"
  );

  assert.doesNotMatch(source, /families:\s*\[[^\]]*"progressTracks"[^\]]*"progressTrackBindings"[^\]]*\]/s);
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `node --test tests/robustness.test.cjs --test-name-pattern "script editor workspace shell exposes stage configuration creator module|script editor no longer exposes progression tracks and bindings as parallel first-level creator entries"`

Expected: FAIL because the current shell still exposes both progression families directly.

- [x] **Step 3: Write minimal implementation**

```ts
// workspace-shell shape intent
const FAMILY_LABELS: Record<string, string> = {
  stageConfiguration: "阶段配置",
  progressTracks: "阶段规则",
  progressTrackBindings: "阶段配置",
};

// gameplay group intent
gameplayTreeGroup.families = ["events", "stageConfiguration"];
```

```ts
// minimal-workflow intent
export function getScriptEditorWorkflowVisibleFamilies(): ScriptEditorProjectFileKey[] {
  return [
    "people",
    "cities",
    "buildings",
    "events",
    "progressTracks",
    "progressTrackBindings",
    // ...existing visible families
  ];
}

// The creator-visible shell groups `progressTracks` and `progressTrackBindings`
// under one synthetic `stageConfiguration` entry instead of removing the resources.
```

- [x] **Step 4: Run test to verify it passes**

Run: `node --test tests/robustness.test.cjs --test-name-pattern "script editor workspace shell exposes stage configuration creator module|script editor no longer exposes progression tracks and bindings as parallel first-level creator entries"`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/robustness.test.cjs src/application/script-editor/workspace-shell.ts src/application/script-editor/minimal-workflow.ts
git commit -m "feat: collapse progression navigation into stage configuration"
```

### Task 2: Replace The Dual Progression Editors With One Composite Creator Panel

**Files:**
- Modify: `src/ui/main-ui/main-ui-flow.js`
- Modify: `src/ui/main-ui/main-ui-flow.d.ts`
- Modify: `src/application/script-editor/story-dialogue-event-authoring.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes:
  - `normalizeScriptEditorProgressTrackRecord(...)`
  - `normalizeScriptEditorProgressTrackBindingRecord(...)`
  - current Script Editor selection state in `main-ui-flow.js`
- Produces:
  - `renderScriptEditorStageConfigurationEditor(...)`
  - creator-facing left list organized by binding/object rows
  - right editor sections `配置对象` / `使用规则` / `阶段规则`
  - no workbench summary strip

- [x] **Step 1: Write the failing composite-editor tests**

```js
test("script editor stage configuration editor is organized around authored usage objects", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/ui/main-ui/main-ui-flow.js"),
    "utf8"
  );

  assert.match(source, /阶段配置/);
  assert.match(source, /应用对象/);
  assert.match(source, /配置对象/);
  assert.match(source, /使用规则/);
  assert.match(source, /阶段规则/);
});

test("script editor stage configuration editor removes the workbench summary strip", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/ui/main-ui/main-ui-flow.js"),
    "utf8"
  );

  assert.doesNotMatch(source, /工作台|记录摘要|后续队列交接/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `node --test tests/robustness.test.cjs --test-name-pattern "script editor stage configuration editor is organized around authored usage objects|script editor stage configuration editor removes the workbench summary strip"`

Expected: FAIL because the current UI still renders separate progression editors.

- [x] **Step 3: Write minimal implementation**

```js
// main-ui-flow intent
if (family === "stageConfiguration") {
  return this.renderScriptEditorStageConfigurationEditor({
    bindings: this.scriptEditorProject.progressTrackBindings ?? [],
    tracks: this.scriptEditorProject.progressTracks ?? [],
  });
}
```

```js
renderScriptEditorStageConfigurationEditor({ bindings, tracks }) {
  return `
    <div class="c-script-editor-editor-card">
      <div class="c-script-editor-record-layout c-script-editor-record-layout--narrative">
        <!-- 左侧：应用对象列表 -->
        <!-- 右侧：配置对象 / 使用规则 / 阶段规则 -->
      </div>
    </div>
  `;
}
```

```ts
// authoring-helper intent
export function describeScriptEditorStageConfigurationObject(binding: ScriptEditorProgressTrackBindingRecord): string {
  return binding.owner?.ownerId?.trim() || "未设置对象";
}
```

- [x] **Step 4: Run test to verify it passes**

Run: `node --test tests/robustness.test.cjs --test-name-pattern "script editor stage configuration editor is organized around authored usage objects|script editor stage configuration editor removes the workbench summary strip"`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/robustness.test.cjs src/ui/main-ui/main-ui-flow.js src/ui/main-ui/main-ui-flow.d.ts src/application/script-editor/story-dialogue-event-authoring.ts
git commit -m "feat: merge progression editors into stage configuration panel"
```

### Task 3: Add The Help Modal And Creator-Facing Terminology Guards

**Files:**
- Modify: `src/ui/main-ui/main-ui-flow.js`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/change-log.md`

**Interfaces:**
- Consumes:
  - the composite stage configuration editor from Task 2
- Produces:
  - module-local `帮助` button
  - modal titled `阶段配置使用说明`
  - creator-facing text for functionality and workflow
  - changelog entry for the UI reorganization

- [x] **Step 1: Write the failing help-modal and terminology tests**

```js
test("script editor stage configuration help modal explains functionality and workflow", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/ui/main-ui/main-ui-flow.js"),
    "utf8"
  );

  assert.match(source, /帮助/);
  assert.match(source, /阶段配置使用说明/);
  assert.match(source, /功能说明/);
  assert.match(source, /操作流程/);
  assert.match(source, /我知道了/);
});

test("script editor stage configuration surface avoids developer terminology as primary labels", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/ui/main-ui/main-ui-flow.js"),
    "utf8"
  );

  assert.doesNotMatch(source, /轨道绑定/);
  assert.doesNotMatch(source, /metricKey/);
  assert.doesNotMatch(source, /ownerKind/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `node --test tests/robustness.test.cjs --test-name-pattern "script editor stage configuration help modal explains functionality and workflow|script editor stage configuration surface avoids developer terminology as primary labels"`

Expected: FAIL because the current panel has no help modal and still uses progression-split wording.

- [x] **Step 3: Write minimal implementation**

```js
// main-ui-flow intent
renderScriptEditorStageConfigurationHelpModal() {
  return `
    <div class="c-modal-overlay">
      <div class="c-confirm-modal">
        <div class="c-confirm-modal__content">
          <p class="c-confirm-modal__eyebrow">帮助</p>
          <h3 class="c-confirm-modal__title">阶段配置使用说明</h3>
          <div class="c-confirm-modal__body">
            <p><strong>功能说明</strong></p>
            <p>阶段配置用于给人物、城市或建筑设置阶段变化规则。</p>
            <p><strong>操作流程</strong></p>
            <p>1. 选择对象 2. 选择规则 3. 配置阶段 4. 保存生效</p>
          </div>
          <div class="c-confirm-modal__actions">
            <button type="button" class="c-button" data-script-editor-action="close-stage-configuration-help">我知道了</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
```

```md
## 2026-07-25 Stage Configuration Creator UI Reorg

### Changed
- Reorganized Script Editor progression authoring into one creator-facing `阶段配置` module with object-led navigation and an embedded rule editor.
- Removed the earlier workbench summary strip from the progression authoring surface and added a creator help modal with functionality and workflow guidance.

### Impact
- Creators now configure progression by starting from the authored object they care about instead of reasoning about separate rule and binding entrypoints.
```

- [x] **Step 4: Run test to verify it passes**

Run: `node --test tests/robustness.test.cjs --test-name-pattern "script editor stage configuration help modal explains functionality and workflow|script editor stage configuration surface avoids developer terminology as primary labels"`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/robustness.test.cjs src/ui/main-ui/main-ui-flow.js docs/change-log.md
git commit -m "feat: add stage configuration help guidance"
```

## Self-Review

- Spec coverage check:
  - creator-facing module rename to `阶段配置`: Task 1
  - no dual first-level creator entry for tracks/bindings: Task 1
  - object-led left list and merged editor structure: Task 2
  - remove workbench summary strip: Task 2
  - help button and modal with workflow guidance: Task 3
  - creator-facing terminology guard: Task 3
- Placeholder scan:
  - each task includes explicit files, tests, commands, and intended code seams
  - no `TODO`/`TBD` placeholders remain
- Type consistency:
  - runtime/resource boundaries stay on `progressTracks` and `progressTrackBindings`
  - the creator-facing synthetic entry is consistently referred to as `stageConfiguration` / `阶段配置`

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
