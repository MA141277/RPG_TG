# Script Editor Final Package Hard-Cut Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the script editor into a real reusable package surface that can both run standalone and be mounted by the current project or another project through the same host-driven public entry, with no transitional architecture or split ownership left behind.

**Architecture:** Execute the approved hard-cut from `2026-08-07-script-editor-final-package-hard-cut-design.md`. The implementation removes current-project ownership of editor internals, collapses embedded and standalone onto the same package kernel, narrows package exports to the final public contract, and forbids any batch from leaving old/new owner paths active together.

**Tech Stack:** TypeScript, Vite multi-entry build, existing `src/modules/script-editor/**` package code, `src/ui/main-ui/**` host integration, `node:test` CJS source-contract tests, `npm run lint:plans`, `npm run build:test`, `npm run typecheck`, `npm run build`, in-app browser smoke at `http://localhost:5173/` and `http://localhost:5173/prototypes/script-editor/`.

## Execution State

- Status: `running`
- Last Updated: `2026-08-07`
- Current Focus: `Task 4 final verification and browser smoke close the hard-cut batch with governance sync.`
- Next Step: `Run the full focused verification set, then verify embedded and standalone editor behavior in the browser before writing final docs sync.`
- Verification: `npm run lint:plans`; `npm run build:test`; `node --test tests/script-editor-host-contract.test.cjs tests/script-editor-embedded-session.test.cjs tests/script-editor-standalone-entry.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/script-editor-final-package-boundary.test.cjs`; `npm run typecheck`; `npm run build`
- Notes: `This child inherits the spec hard rules: no transitional architecture, no compatibility layer, no split ownership, no old/new entry coexistence. Batches may be committed separately only if each batch already reflects one coherent final owner state.`

## Progress Log

- 2026-08-07
  - Summary: `Plan created from the approved script editor final package hard-cut spec.`
  - Verification: `Not run`
  - Next: `Choose execution mode and start Task 1.`
- 2026-08-07
  - Summary: `Task 1 added the failing hard-cut boundary tests and confirmed the current red state: MainUiFlow still installs the old script-editor module surface, and the package index still exports bridge/install internals.`
  - Verification: `npm run build:test`; `node --test tests/script-editor-embedded-session.test.cjs tests/script-editor-final-package-boundary.test.cjs` (failed as expected: main-ui-flow.js still references installMainUiFlowScriptEditorModule/captureScriptEditorScrollPosition/renderScriptEditorWorkspace, and src/modules/script-editor/index.ts still exports installMainUiFlowScriptEditorModule, scriptEditorMainUiBridge, and ./main-ui-bridge)`
  - Next: `Start Task 2 and remove the old owner/install surfaces in one hard-cut batch without leaving split ownership behind.`
- 2026-08-07
  - Summary: `Task 2 hard-cut current-project ownership: MainUiFlow now opens the script editor through the package entry, package-owned mounted session logic now owns render/input handling, standalone host mounts through the same package entry, runtime-preview adaptation moved out of the ui install path, and the public index no longer exports install/bridge internals.`
  - Verification: `npm run build:test`; `node --test tests/script-editor-embedded-session.test.cjs tests/script-editor-final-package-boundary.test.cjs tests/script-editor-host-contract.test.cjs tests/script-editor-standalone-entry.test.cjs tests/script-editor-runtime-preview-compat.test.cjs`; `npm run typecheck`; `npm run build`
  - Next: `Start Task 3 and remove the remaining main-ui-bridge/internal bridge file without reintroducing any split owner state.`
- 2026-08-07
  - Summary: `Task 3 removed src/modules/script-editor/main-ui-bridge.ts from the package path, switched the remaining package-owned ui owner to src/modules/script-editor/internal.ts, and tightened boundary tests so the deleted bridge file cannot silently reappear.`
  - Verification: `npm run build:test`; `node --test tests/script-editor-host-contract.test.cjs tests/script-editor-final-package-boundary.test.cjs`; `npm run typecheck`; `npm run build`
  - Next: `Start Task 4, run the full focused verification set, then perform embedded and standalone browser smoke before final governance sync.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-07-script-editor-final-package-hard-cut-design.md`
- Prior completed baseline:
  - `docs/superpowers/plans/2026-08-07-script-editor-dual-mode-package-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `The dual-mode baseline is already pushed on origin/merage-mod2ui-1; this child starts from that verified state rather than reopening the old child.`
  - `The approved hard-cut spec adds one stricter rule beyond the old baseline: execution batches may not leave repository-visible split owner states behind.`
  - `Canonical docs/superpowers/project-progress.md is still on an older queue; this child owns its own execution state locally unless it is later promoted.`

## Implementation Scope

### In Scope

- Remove current-project ownership of script-editor internal methods, local state, render paths, and DOM vocabulary.
- Replace `installMainUiFlowScriptEditorModule` style ownership with direct host-driven `openScriptEditor(...)` / `mountScriptEditor(...)` usage.
- Collapse embedded and standalone paths onto one package kernel and one package-owned view/render owner.
- Delete or reduce `main-ui-script-editor-module.js` to a thin host factory only if any current-project-specific host assembly truly remains.
- Remove `main-ui-bridge.ts` and related current-project-only reach-through exports if they are not part of the final reusable contract.
- Narrow `src/modules/script-editor/index.ts` to the final reusable package public API.
- Add/adjust source-contract tests that prove old owners, bridge exports, and split paths are gone.
- Re-run embedded and standalone browser smoke as final acceptance.

### Still Out Of Scope

- Rewriting editor content schema beyond what the package boundary requires.
- Redesigning the editor visual layout or authoring workflow.
- Moving gameplay runtime preview implementation itself into the script editor package.
- Introducing a second package extraction such as a physical monorepo package split in this child.

### Execution Constraint

- A task may delete an old owner and wire the final owner in the same batch.
- A task may not leave both old and new owners active after the batch ends.
- A task may not introduce a temporary adapter, bridge, wrapper, or shadow export to preserve legacy callers.
- If a step cannot land without leaving a split state, the step design is invalid and must be rewritten before implementation.

## File Map

### Existing files to modify

- `src/modules/script-editor/index.ts`
  - Narrow the public package surface to final reusable entries/contracts only.
- `src/modules/script-editor/kernel/script-editor-session.ts`
  - Promote the session owner into the only embedded/standalone interaction owner and remove remaining host-shaped drift from its public surface.
- `src/modules/script-editor/entries/open-script-editor.ts`
  - Keep the embedded entry as the one formal current-project/external host opening surface.
- `src/modules/script-editor/entries/mount-script-editor.ts`
  - Keep the formal mount entry aligned with the same session owner semantics.
- `src/modules/script-editor/standalone/script-editor-standalone-host.ts`
  - Align standalone host injection with the same final package entry and no alternative owner path.
- `src/modules/script-editor/standalone/script-editor-standalone.ts`
  - Keep standalone bootstrap on the same package entry.
- `src/modules/script-editor/ui/main-ui-script-editor-module.js`
  - Either delete it or reduce it to a thin current-project host factory with no editor-local owner logic.
- `src/modules/script-editor/ui/main-ui-script-editor-module.d.ts`
  - Delete if the JS file is removed or no longer exports the old module-install surface.
- `src/modules/script-editor/main-ui-bridge.ts`
  - Delete if its exports are only historical bridge exposure for current-project giant-module reach-through.
- `src/ui/main-ui/main-ui-flow.js`
  - Remove editor method installation and convert current-project usage to direct package host invocation only.
- `tests/script-editor-host-contract.test.cjs`
  - Extend the package boundary assertions to the final hard-cut public API.
- `tests/script-editor-embedded-session.test.cjs`
  - Extend current-project ownership assertions so MainUiFlow no longer installs or owns editor-local methods/state.
- `tests/script-editor-standalone-entry.test.cjs`
  - Prove standalone still boots through the same package contract.
- `docs/change-log.md`
  - Record the final hard-cut package migration.

### Existing files expected to be deleted

- `src/modules/script-editor/main-ui-bridge.ts`
  - Delete if no final public contract needs these bridge exports.
- `src/modules/script-editor/ui/main-ui-script-editor-module.d.ts`
  - Delete with the old install surface.
- `src/modules/script-editor/ui/main-ui-script-editor-module.js`
  - Delete if host factory extraction makes the file unnecessary.

### New files to create

- `tests/script-editor-final-package-boundary.test.cjs`
  - Final source-contract test proving no compatibility layer, no bridge export dependence, and one public package entry shape.
- `src/modules/script-editor/host/current-project-script-editor-host.ts`
  - Only if current-project-specific host assembly still needs a dedicated thin factory after deleting `main-ui-script-editor-module.js`; this file is allowed only as host assembly, never as editor owner.

## Verification Plan

- Targeted verification:
  - `tests/script-editor-host-contract.test.cjs`
  - `tests/script-editor-embedded-session.test.cjs`
  - `tests/script-editor-standalone-entry.test.cjs`
  - `tests/script-editor-runtime-preview-compat.test.cjs`
  - `tests/script-editor-final-package-boundary.test.cjs`
- Required commands:
  - `npm run lint:plans`
  - `npm run build:test`
  - `node --test tests/script-editor-host-contract.test.cjs tests/script-editor-embedded-session.test.cjs tests/script-editor-standalone-entry.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/script-editor-final-package-boundary.test.cjs`
  - `npm run typecheck`
  - `npm run build`
- Runtime/browser smoke:
  - embedded path at `http://localhost:5173/` still opens `剧本编辑`
  - embedded path still supports `使用模板 -> 运行预览`
  - standalone path at `http://localhost:5173/prototypes/script-editor/` still opens through the same package kernel
  - standalone path without `previewHost` fails closed on preview action

## Task 1: Lock The Final Hard-Cut Boundary In Tests

**Files:**
- Create: `tests/script-editor-final-package-boundary.test.cjs`
- Modify: `tests/script-editor-host-contract.test.cjs`
- Modify: `tests/script-editor-embedded-session.test.cjs`
- Read: `src/modules/script-editor/index.ts`
- Read: `src/modules/script-editor/main-ui-bridge.ts`
- Read: `src/modules/script-editor/ui/main-ui-script-editor-module.js`
- Read: `src/ui/main-ui/main-ui-flow.js`

- [ ] **Step 1: Add the failing final-boundary test file**

Create `tests/script-editor-final-package-boundary.test.cjs` with exact assertions that capture the hard-cut rules:

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

function readSource(relativePath) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

test("script editor index exposes final package surfaces and not bridge/install internals", () => {
  const source = readSource("src/modules/script-editor/index.ts");

  assert.match(source, /entries\\/mount-script-editor/);
  assert.match(source, /entries\\/open-script-editor/);
  assert.doesNotMatch(source, /installMainUiFlowScriptEditorModule/);
  assert.doesNotMatch(source, /scriptEditorMainUiBridge/);
});

test("current project shell no longer depends on script editor bridge or install surface", () => {
  const source = readSource("src/ui/main-ui/main-ui-flow.js");

  assert.doesNotMatch(source, /installMainUiFlowScriptEditorModule/);
  assert.doesNotMatch(source, /captureScriptEditorScrollPosition/);
  assert.doesNotMatch(source, /renderScriptEditorWorkspace/);
});

test("main-ui bridge is removed or no longer referenced by package public surfaces", () => {
  const indexSource = readSource("src/modules/script-editor/index.ts");
  assert.doesNotMatch(indexSource, /main-ui-bridge/);
});
```

- [ ] **Step 2: Tighten the embedded ownership test so it rejects method installation**

Append an assertion like this to `tests/script-editor-embedded-session.test.cjs`:

```js
assert.doesNotMatch(source, /installMainUiFlowScriptEditorModule/);
assert.doesNotMatch(source, /scriptEditorRuntimePreviewSession/);
```

- [ ] **Step 3: Run the focused failing tests**

Run:

```bash
npm run build:test
node --test tests/script-editor-embedded-session.test.cjs tests/script-editor-final-package-boundary.test.cjs
```

Expected:

- `FAIL`
- `MainUiFlow` still imports/installs `installMainUiFlowScriptEditorModule`
- `index.ts` still exports bridge/install surfaces

- [ ] **Step 4: Record the failure point in the plan before implementation**

Update this plan:

- set `Execution State.Status` to `running`
- set `Current Focus` to `Task 1 failing tests confirm old owner/install surfaces still exist`
- append a `Progress Log` entry with the exact failing commands

## Task 2: Replace Current-Project Installation With Final Host Invocation

**Files:**
- Modify: `src/ui/main-ui/main-ui-flow.js`
- Modify: `src/modules/script-editor/entries/open-script-editor.ts`
- Modify: `src/modules/script-editor/kernel/script-editor-session.ts`
- Modify: `src/modules/script-editor/host/script-editor-host.ts`
- Create or Modify: `src/modules/script-editor/host/current-project-script-editor-host.ts`
- Delete or Modify: `src/modules/script-editor/ui/main-ui-script-editor-module.js`
- Delete: `src/modules/script-editor/ui/main-ui-script-editor-module.d.ts`

- [ ] **Step 1: Add a thin current-project host factory only if host assembly cannot live inline**

If current-project-specific host assembly remains necessary, create `src/modules/script-editor/host/current-project-script-editor-host.ts` with a package-facing factory like:

```ts
import type { ScriptEditorHost } from "./script-editor-host";

export function createCurrentProjectScriptEditorHost(input: {
  projectStorage: ScriptEditorHost["projectStorage"];
  fileSystemHost: NonNullable<ScriptEditorHost["fileSystemHost"]>;
  previewHost?: ScriptEditorHost["previewHost"];
  templateCatalog?: ScriptEditorHost["templateCatalog"];
  publicationCatalog?: ScriptEditorHost["publicationCatalog"];
  notify?: ScriptEditorHost["notify"];
  confirm?: ScriptEditorHost["confirm"];
}): ScriptEditorHost {
  return {
    projectStorage: input.projectStorage,
    fileSystemHost: input.fileSystemHost,
    previewHost: input.previewHost,
    templateCatalog: input.templateCatalog,
    publicationCatalog: input.publicationCatalog,
    notify: input.notify,
    confirm: input.confirm,
  };
}
```

If no dedicated file is needed, skip file creation and construct the same shape inline in `MainUiFlow`.

- [x] **Step 2: Change MainUiFlow to import only final package entry/host assembly**

Replace the current script-editor import at the top of `src/ui/main-ui/main-ui-flow.js` with only final package usage:

```js
import {
  createEmbeddedScriptEditorSession,
  openScriptEditor,
} from "../../modules/script-editor";
```

Then remove:

```js
installMainUiFlowScriptEditorModule(this, options);
```

And replace direct current-project editor setup with host creation plus package entry invocation from the editor-open path, for example:

```js
this.scriptEditorHost = createCurrentProjectScriptEditorHost({
  projectStorage: this.createScriptEditorProjectStorage(),
  fileSystemHost: this.createScriptEditorFileSystemHost(),
  previewHost: this.createScriptEditorPreviewHost(),
  templateCatalog: this.createScriptEditorTemplateCatalog(),
  publicationCatalog: this.createScriptEditorPublicationCatalog(),
  notify: this.notifyScriptEditorMessage,
  confirm: this.confirmScriptEditorAction,
});
```

The exact helper names may differ, but the resulting `MainUiFlow` state must not store editor-local render/state/install methods anymore.

- [x] **Step 3: Remove editor-local render/state/install methods from MainUiFlow**

Delete remaining shell-owned editor methods/fields such as:

```js
this.captureScriptEditorScrollPosition
this.restoreScriptEditorScrollPosition
this.renderScriptEditorLanding
this.renderScriptEditorWorkspace
this.renderRuntimePreviewOverlay
this.renderRuntimePreviewSessionBanner
```

And delete any matching `scriptEditor*` local state fields that are meaningful only inside the editor package rather than as host capabilities.

- [x] **Step 4: Rework script-editor-session so embedded and standalone still use one owner without MainUiFlow install hooks**

Update `src/modules/script-editor/kernel/script-editor-session.ts` so the package-owned session continues to own click/change/input/composition handling, but no longer expects shell-installed methods to exist on the host. Replace implicit host method calls with explicit package-owned methods and only keep host capability calls for:

```ts
getFileSystemHost()
getPreviewHost()
getTemplateCatalog()
getPlayableCatalog()
recordNotice(...)
```

- [ ] **Step 5: Delete or thin `main-ui-script-editor-module.js` in the same batch**

Either:

- delete `src/modules/script-editor/ui/main-ui-script-editor-module.js` and `src/modules/script-editor/ui/main-ui-script-editor-module.d.ts`, or
- reduce the JS file to host-assembly-only code with no render/state/interaction owner logic

The batch must not end with both `MainUiFlow` final host invocation and the old install-module owner path active together.

- [x] **Step 6: Run the ownership tests and typecheck**

Run:

```bash
npm run build:test
node --test tests/script-editor-embedded-session.test.cjs tests/script-editor-final-package-boundary.test.cjs
npm run typecheck
```

Expected:

- `PASS`
- `MainUiFlow` no longer imports/uses the old install surface
- no split owner state remains

- [ ] **Step 7: Commit the hard-cut of current-project ownership**

Run:

```bash
git add src/ui/main-ui/main-ui-flow.js src/modules/script-editor/entries/open-script-editor.ts src/modules/script-editor/kernel/script-editor-session.ts src/modules/script-editor/host/script-editor-host.ts src/modules/script-editor/host/current-project-script-editor-host.ts src/modules/script-editor/ui/main-ui-script-editor-module.js src/modules/script-editor/ui/main-ui-script-editor-module.d.ts tests/script-editor-embedded-session.test.cjs tests/script-editor-final-package-boundary.test.cjs
git commit -m "refactor: hard-cut script editor host ownership"
```

If `current-project-script-editor-host.ts` or the old module files do not exist in the final diff, omit them from `git add`.

## Task 3: Remove Bridge Exports And Narrow The Final Package API

**Files:**
- Modify: `src/modules/script-editor/index.ts`
- Delete: `src/modules/script-editor/main-ui-bridge.ts`
- Modify: `tests/script-editor-host-contract.test.cjs`
- Modify: `tests/script-editor-final-package-boundary.test.cjs`

- [x] **Step 1: Narrow index.ts to final reusable surfaces only**

Rewrite `src/modules/script-editor/index.ts` so it no longer exports bridge/install internals. The final shape should resemble:

```ts
export * from "./config";
export * from "./host/script-editor-host";
export * from "./host/browser-script-editor-host";
export * from "./entries/mount-script-editor";
export * from "./entries/open-script-editor";
export * from "./kernel/script-editor-session";
export * from "./kernel/script-editor-workflow-controller";
export * from "./standalone/script-editor-standalone-host";
export type {
  ScriptEditorPersonAttributeMapping,
  ScriptEditorPersonAttributeValue,
  ScriptEditorPersonSemanticBinding,
} from "./domain/script-editor-person-attribute-contract";
```

Do not leave:

```ts
export { installMainUiFlowScriptEditorModule } ...
export * as scriptEditorMainUiBridge ...
```

- [x] **Step 2: Delete `main-ui-bridge.ts`**

Remove:

```bash
rm src/modules/script-editor/main-ui-bridge.ts
```

Only do this in the same batch where all remaining imports have already moved to final package surfaces.

- [x] **Step 3: Re-run boundary tests and build**

Run:

```bash
npm run build:test
node --test tests/script-editor-host-contract.test.cjs tests/script-editor-final-package-boundary.test.cjs
npm run typecheck
npm run build
```

Expected:

- `PASS`
- package public API no longer leaks bridge/install internals
- build still succeeds with standalone and embedded entries

- [ ] **Step 4: Commit the package API hard-cut**

Run:

```bash
git add src/modules/script-editor/index.ts src/modules/script-editor/main-ui-bridge.ts tests/script-editor-host-contract.test.cjs tests/script-editor-final-package-boundary.test.cjs
git commit -m "refactor: narrow script editor package api"
```

## Task 4: Final Verification, Browser Smoke, And Governance Sync

**Files:**
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-08-07-script-editor-final-package-hard-cut-plan.md`
- Optionally Modify: `docs/superpowers/project-progress.md`

- [ ] **Step 1: Run the full focused verification set**

Run:

```bash
npm run lint:plans
npm run build:test
node --test tests/script-editor-host-contract.test.cjs tests/script-editor-embedded-session.test.cjs tests/script-editor-standalone-entry.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/script-editor-final-package-boundary.test.cjs
npm run typecheck
npm run build
```

Expected:

- `PASS`
- all source-contract suites green
- typecheck green
- build green

- [ ] **Step 2: Re-run embedded browser smoke**

Verify in the in-app browser at `http://localhost:5173/`:

- `剧本编辑` opens from the current project shell
- `使用模板` still enters the editor workspace
- `运行预览` still reaches the runtime map flow

Record any runtime errors from the browser logs and fix them before continuing.

- [ ] **Step 3: Re-run standalone browser smoke**

Verify at `http://localhost:5173/prototypes/script-editor/`:

- standalone shell loads
- `使用模板` still opens the workspace
- preview action fails closed if no `previewHost` is injected

- [ ] **Step 4: Record governance and change-log updates**

Update:

- this plan `Execution State`
- this plan `Progress Log`
- `docs/change-log.md`

If this child is promoted into canonical queue ownership, also update:

- `docs/superpowers/project-progress.md`

- [ ] **Step 5: Commit and push the verified hard-cut batch**

Run:

```bash
git add docs/change-log.md docs/superpowers/plans/2026-08-07-script-editor-final-package-hard-cut-plan.md docs/superpowers/project-progress.md
git commit -m "docs: record script editor final package hard-cut"
git push origin merage-mod2ui-1
```

If `docs/superpowers/project-progress.md` was intentionally not changed, omit it from `git add`.

## Exit Check

- [ ] `MainUiFlow` no longer installs or owns script editor internal methods, state, or DOM vocabulary.
- [ ] `main-ui-script-editor-module.js` is either deleted or reduced to pure host assembly with no editor ownership.
- [ ] `main-ui-bridge.ts` is deleted or no longer part of any final public package path.
- [ ] `src/modules/script-editor/index.ts` exposes only final reusable package surfaces.
- [ ] Embedded and standalone still run through the same package kernel.
- [ ] Embedded browser smoke still supports `剧本编辑 -> 使用模板 -> 运行预览`.
- [ ] Standalone browser smoke still boots and fail-closes preview when preview host is absent.
- [ ] No compatibility layer or split owner state remains in the repository.
- [ ] Project progress sync is updated if the child state changed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `Script Editor Final Package Hard-Cut`
- Parent Task: `Script Editor Package Migration`
- Parent Stage: `Script Editor Package Migration`
- Closeout Status: `closed`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `open-next-approved-child`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `none`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then continue from this child-local plan until the hard-cut package boundary is fully verified and pushed.`
