# Script Editor Items Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `items` as a first-class script-editor asset family with hidden numeric runtime IDs, optional menu-instance links, and scenario-pack import/export support.

**Architecture:** `items` are content definitions owned by the script editor and exported into runtime packs; inventory quantity and backpack behavior remain runtime concerns outside this child. The first implementation follows existing script-editor family patterns and keeps item authoring minimal: name, display, stack rule, and linked menu instances.

**Tech Stack:** TypeScript domain/application modules, CommonJS node tests through `npm run build:test`, structural plan lint through `npm run lint:plans`, and final checks through `npm run typecheck` and `npm run build`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Script-editor items first implementation is complete locally; closeout remains open because lint:plans has an unrelated existing failure and no push was requested.`
- Next Step: `Review diff, decide whether to fix the unrelated plan-lint baseline, then commit/push if requested.`
- Verification: `Targeted script-editor item tests passed; npm run typecheck passed; npm run build passed; npm.cmd run lint:plans failed on existing docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md missing heading.`
- Notes: `Project progress currently points at an unrelated completed-but-open map child; this plan is opened by direct user request and must not close that unrelated child.`

## Progress Log

- 2026-07-30
  - Summary: `Opened the script-editor items implementation child from the approved item design spec.`
  - Verification: `Not run`
  - Next: `Run npm run lint:plans, then execute Task 1 with TDD.`
- 2026-07-30
  - Summary: `Implemented the first script-editor items slice: project family, numeric 51xxxx IDs, minimal workflow creation/upsert/remove, scenario-pack import/export, content-pack loading, active content merge, and workspace label 道具.`
  - Verification: `npm.cmd run lint:plans failed on existing docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md missing heading; npm.cmd run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "script editor items" tests/robustness.test.cjs } passed 5/5; npm.cmd run typecheck passed; npm.cmd run build passed with existing Vite warnings; git diff --check passed with line-ending warnings.`
  - Next: `Review and commit/push if requested; do not mark this child closed until lint baseline and push/closeout gates are resolved.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-29-mod-item-editor-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `docs/superpowers/project-progress.md` still points at `docs/superpowers/plans/2026-07-28-campaign-hex-runtime-grid-architecture-plan.md` as completed-but-open and not pushed.
  - `items` does not yet exist in `SCRIPT_EDITOR_PROJECT_FILE_KEYS`, `ScriptEditorProjectDefinition`, the ID allocator, minimal workflow families, runtime-pack export/import, or runtime scenario-pack loaders.
  - Existing `valuables` remains a legacy compatibility family and must not be removed in this child.

## Implementation Scope

### In Scope

- Add `ItemDefinition` and script-editor item record types.
- Add `items` to script-editor project files with canonical `./items.json`.
- Add `items` to the numeric canonical ID allocator with family code `51`.
- Add `items` to the minimal workflow list/create/upsert/remove path.
- Add `items` to runtime pack export/import and scenario/content pack loading.
- Keep creator-facing item fields minimal: `name`, `display`, `stack`, `menuInstanceIds`, and `internalNote`.
- Preserve `valuables` as legacy compatibility data.

### Still Out Of Scope

- Backpack UI redesign.
- Inventory quantity state or item stack ownership runtime.
- Direct item-to-settlement execution.
- Classification/tag editing.
- Static component editing.
- Copy item, action preview, reverse-reference browsing, or a dedicated validation panel.

## File Map

### Existing files to modify

- `src/domain/content-pack.ts`
  - Add `ItemDefinition` and optional `items`.
- `src/domain/scenario-pack.ts`
  - Inherits `items` through `ContentPackDefinition`; no direct edit expected unless type constraints require it.
- `src/application/content/content-pack-loader.ts`
  - Hydrate `items` from content pack manifests.
- `src/application/scenario/scenario-pack-loader.ts`
  - Parse and hydrate `items` from scenario pack manifests and imported files.
- `src/application/content/active-game-content.ts`
  - Normalize and merge `items`.
- `src/modules/script-editor/domain/script-editor-project.ts`
  - Add `items` project key, canonical file, and `ScriptEditorItemRecord`.
- `src/modules/script-editor/application/editor-project-loader.ts`
  - Treat `items` as optional for old projects and parse it as an entity array.
- `src/modules/script-editor/application/editor-project-save.ts`
  - Serialize `items`.
- `src/modules/script-editor/application/script-editor-id-allocation.ts`
  - Reserve family code `51` and allocate item IDs from `project.items`.
- `src/modules/script-editor/application/minimal-workflow.ts`
  - Add `items` to visible workflow, draft creation, list, upsert, remove, and project default.
- `src/modules/script-editor/application/runtime-pack-export.ts`
  - Export `items` into scenario packs and validate pack contract.
- `src/modules/script-editor/application/runtime-pack-import.ts`
  - Import `items` from scenario packs into script-editor projects.
- `src/modules/script-editor/application/workspace-shell.ts`
  - Add display label and generic listing support if needed by the visible shell.

### Existing files expected to be deleted

- None.

### New files to create

- No new production module is required for this first child unless the implementation becomes clearer with a small `item-authoring.ts` helper.

## Verification Plan

- Targeted verification:
  - `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "script editor items" tests/robustness.test.cjs }`
- Required commands:
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm run build`

## Task 1: Project Family And ID Contract

**Files:**
- Modify: `tests/robustness.test.cjs`
- Modify: `src/modules/script-editor/domain/script-editor-project.ts`
- Modify: `src/modules/script-editor/application/editor-project-loader.ts`
- Modify: `src/modules/script-editor/application/editor-project-save.ts`
- Modify: `src/modules/script-editor/application/script-editor-id-allocation.ts`
- Modify: `src/modules/script-editor/application/minimal-workflow.ts`

- [x] **Step 1: Write failing project contract tests**

Add tests named:

```js
test("script editor items are a project family with hidden numeric canonical ids", async () => {
  const workflow = await import("../.test-dist/modules/script-editor/application/minimal-workflow.js");
  const ids = await import("../.test-dist/modules/script-editor/application/script-editor-id-allocation.js");
  const projectModule = await import("../.test-dist/modules/script-editor/domain/script-editor-project.js");
  const project = workflow.createDefaultScriptEditorProjectDefinition();
  assert.deepEqual(project.items, []);
  assert.equal(projectModule.SCRIPT_EDITOR_PROJECT_CANONICAL_FILES.items, "./items.json");
  assert.equal(ids.createDefaultScriptEditorCanonicalId("items", 0), "510001");
  const draft = workflow.createScriptEditorWorkflowRecordDraft("items", project);
  assert.equal(draft.id, "510001");
  assert.equal(draft.name, "道具 1");
  assert.deepEqual(draft.menuInstanceIds, []);
  assert.equal(Object.hasOwn(draft, "count"), false);
});

test("script editor items survive project parse and workflow upsert", async () => {
  const workflow = await import("../.test-dist/modules/script-editor/application/minimal-workflow.js");
  const loader = await import("../.test-dist/modules/script-editor/application/editor-project-loader.js");
  const project = workflow.createDefaultScriptEditorProjectDefinition();
  const draft = {
    ...workflow.createScriptEditorWorkflowRecordDraft("items", project),
    name: "小药水",
    display: { title: "小药水", iconId: "icon.potion" },
    stack: { stackable: true, maxStack: 99 },
    menuInstanceIds: ["280001"],
    internalNote: "作者备注",
  };
  const nextProject = workflow.upsertScriptEditorWorkflowRecord(project, "items", draft);
  const parsed = loader.parseScriptEditorProject(nextProject);
  assert.deepEqual(workflow.listScriptEditorWorkflowFamilyRecords(parsed, "items"), [draft]);
});
```

- [x] **Step 2: Run tests to verify they fail**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "script editor items" tests/robustness.test.cjs }
```

Expected:

- Fails because `items` is not a known project family and no `items` ID family exists.

- [x] **Step 3: Add minimal item project support**

Implement:

- `ScriptEditorItemRecord` with `id`, `name`, optional `description`, `internalNote`, `display`, `stack`, and `menuInstanceIds`.
- `items` in `SCRIPT_EDITOR_PROJECT_FILE_KEYS`.
- `items: "./items.json"` in `SCRIPT_EDITOR_PROJECT_CANONICAL_FILES`.
- `items: ScriptEditorItemRecord[]` in `ScriptEditorProjectDefinition`.
- Optional `items` parsing defaulting to `[]` for older projects.
- `items: []` in default project creation.
- ID family code `51` in `script-editor-id-allocation.ts`.
- Draft item:

```ts
{
  id: allocateNextScriptEditorProjectCanonicalId(project, "items"),
  name: `道具 ${(project.items.length ?? 0) + 1}`,
  display: { title: `道具 ${(project.items.length ?? 0) + 1}` },
  stack: { stackable: false },
  menuInstanceIds: [],
}
```

- List/upsert/remove support through existing workflow helpers.

- [x] **Step 4: Run tests to verify they pass**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "script editor items" tests/robustness.test.cjs }
```

Expected:

- PASS for both new script-editor item project tests.

## Task 2: Runtime Pack And Scenario Pack Round Trip

**Files:**
- Modify: `tests/robustness.test.cjs`
- Modify: `src/domain/content-pack.ts`
- Modify: `src/application/content/content-pack-loader.ts`
- Modify: `src/application/scenario/scenario-pack-loader.ts`
- Modify: `src/application/content/active-game-content.ts`
- Modify: `src/modules/script-editor/application/runtime-pack-export.ts`
- Modify: `src/modules/script-editor/application/runtime-pack-import.ts`

- [x] **Step 1: Write failing runtime round-trip tests**

Add tests named:

```js
test("script editor items export to scenario pack files without legacy valuables counts", async () => {
  const workflow = await import("../.test-dist/modules/script-editor/application/minimal-workflow.js");
  const exportModule = await import("../.test-dist/modules/script-editor/application/runtime-pack-export.js");
  const project = workflow.createDefaultScriptEditorProjectDefinition();
  const item = {
    ...workflow.createScriptEditorWorkflowRecordDraft("items", project),
    name: "命运硬币",
    display: { title: "命运硬币" },
    stack: { stackable: true, maxStack: 1 },
    menuInstanceIds: [],
  };
  const nextProject = workflow.upsertScriptEditorWorkflowRecord(project, "items", item);
  const files = exportModule.exportScriptEditorProjectToScenarioPackFiles(nextProject);
  const pack = JSON.parse(files["pack.json"]);
  const items = JSON.parse(files["items.json"]);
  assert.equal(pack.files.items, "items.json");
  assert.deepEqual(items, [item]);
  assert.equal(Object.hasOwn(items[0], "count"), false);
});

test("scenario pack loader hydrates items from manifest files", async () => {
  const loader = await import("../.test-dist/application/scenario/scenario-pack-loader.js");
  const files = [
    new File([JSON.stringify({
      id: "pack.test.items",
      title: "Items Pack",
      version: "1.0.0",
      files: { items: "items.json" },
    })], "pack.json", { type: "application/json" }),
    new File([JSON.stringify([{ id: "510001", name: "小药水", menuInstanceIds: [] }])], "items.json", { type: "application/json" }),
  ];
  const pack = await loader.loadScenarioPackFromFiles(files);
  assert.deepEqual(pack.items, [{ id: "510001", name: "小药水", menuInstanceIds: [] }]);
});
```

- [x] **Step 2: Run tests to verify they fail**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "script editor items" tests/robustness.test.cjs }
```

Expected:

- Fails because runtime pack files, content pack, and scenario loader do not recognize `items`.

- [x] **Step 3: Add runtime pack item support**

Implement:

- `ItemDefinition` in `src/domain/content-pack.ts`.
- `items?: ItemDefinition[]` in `ContentPackDefinition`.
- `items` manifest key hydration in content and scenario pack loaders.
- `items` normalization and merge in active game content.
- `RUNTIME_PACK_CANONICAL_FILES.items = "./items.json"`.
- `items` in runtime pack manifest files and serialized scenario-pack files.
- Scenario-pack import maps `rawPack.items` to `project.items`.

- [x] **Step 4: Run tests to verify they pass**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "script editor items" tests/robustness.test.cjs }
```

Expected:

- PASS for all script-editor item tests.

## Task 3: Shell Visibility And Guard Verification

**Files:**
- Modify: `tests/robustness.test.cjs`
- Modify: `src/modules/script-editor/application/workspace-shell.ts`
- Modify: `docs/superpowers/plans/2026-07-30-script-editor-items-implementation-plan.md`

- [x] **Step 1: Write failing visibility test if shell does not show items**

If Task 1 does not already make `items` visible in the workspace shell, add:

```js
test("script editor items are visible as 道具 without exposing ids as primary fields", async () => {
  const workflow = await import("../.test-dist/modules/script-editor/application/minimal-workflow.js");
  assert.equal(workflow.getScriptEditorWorkflowVisibleFamilies().includes("items"), true);
  const source = fs.readFileSync(path.join(process.cwd(), "src/modules/script-editor/application/workspace-shell.ts"), "utf8");
  assert.match(source, /items:\s*"道具"/);
  assert.doesNotMatch(source, /items:\s*"资产"/);
});
```

- [x] **Step 2: Run test to verify it fails when shell label is missing**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "script editor items" tests/robustness.test.cjs }
```

Expected:

- Fails only if shell visibility or label has not yet been wired.

- [x] **Step 3: Add shell label and generic family handling**

Implement:

- `items: "道具"` in the workspace shell family label map.
- Any required generic family list/count branches so `items` behaves like `quests` and other entity-array families.
- No item-specific business logic in `src/main.ts`.

- [x] **Step 4: Run final verification**

Run:

```bash
npm run lint:plans
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "script editor items" tests/robustness.test.cjs }
npm run typecheck
npm run build
```

Expected:

- `npm run lint:plans` exits 0.
- Targeted script-editor item tests pass.
- `npm run typecheck` exits 0.
- `npm run build` exits 0.

## Exit Check

- [x] `items` exists as a first-class script-editor project family.
- [x] Item IDs are numeric strings allocated from family code `51`.
- [x] Item runtime IDs are internal data and the minimal item authoring shape does not require creator-entered IDs.
- [x] Item records do not store inventory quantity.
- [x] Item menu groups are optional references to menu module instances.
- [x] Scenario-pack export writes `items.json` and keeps `valuables` compatibility.
- [x] Scenario-pack import and loading hydrate `items`.
- [x] No backpack runtime behavior or settlement dispatch shortcut was added.
- [x] Project progress sync is not falsely closed for the unrelated map child.
- [ ] Closeout block is added only after verification and push gates are resolved.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `not-closed`
- Parent Task: `Script Editor Items`
- Parent Stage: `Mod First Runtime Integration`
- Closeout Status: `not-closed`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `complete-script-editor-items-implementation`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-script-editor-items-implementation-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then this plan, and continue from the first unchecked checkbox.`
