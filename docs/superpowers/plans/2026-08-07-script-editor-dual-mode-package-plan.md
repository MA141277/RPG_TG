# Script Editor Dual-Mode Package Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the script editor into a reusable dual-mode module that can run standalone or be mounted by another project, while runtime preview remains an injected host capability rather than an editor-owned subsystem.

**Architecture:** Keep the current repository terminology and frozen design boundaries from `2026-08-07-script-editor-dual-mode-package-design.md`. The implementation removes editor ownership from `MainUiFlow`, moves runtime-consumed contracts to neutral owners, introduces a real script editor session owner plus standalone entry, and requires preview/template/publication behavior to arrive through injected host capabilities.

**Tech Stack:** TypeScript, Vite multi-entry build, existing `src/modules/script-editor/**` authoring/runtime-pack code, `node:test` CJS source-contract tests, `npm run build:test`, `npm run typecheck`, `npm run build`, browser smoke at `http://localhost:5173/`.

## Execution State

- Status: `running`
- Last Updated: `2026-08-07`
- Current Focus: `Task 2: move script editor session ownership out of MainUiFlow.`
- Next Step: `Continue Task 2 by moving script editor click/change ownership out of MainUiFlow and into the session path.`
- Verification: `Task 1 passed: npm run build:test; node --test tests/script-editor-host-contract.test.cjs; npm run typecheck. Task 2 checkpoint passed: npm run build:test; node --test tests/script-editor-embedded-session.test.cjs; npm run typecheck`
- Notes: `Boundary and terminology are frozen by the approved design spec; do not add compatibility seams or new top-level terminology during implementation. Task 1 is complete and the shared person-attribute contract now lives under core/contracts. Task 2 has cut over workflow/session construction into script-editor/kernel, but MainUiFlow still owns direct editor event routing that must be removed in the next slice.`

## Progress Log

- 2026-08-07
  - Summary: `Plan created from the approved script editor dual-mode package design.`
  - Verification: `Not run`
  - Next: `Choose an execution mode and start Task 1.`
- 2026-08-07
  - Summary: `Completed Task 1 by locking the script editor host contract to injected previewHost/templateCatalog/publicationCatalog fields and keeping shared person-attribute contract ownership under core/contracts.`
  - Verification: `npm run build:test`; `node --test tests/script-editor-host-contract.test.cjs`; `npm run typecheck`
  - Next: `Start Task 2 and move script editor session ownership out of MainUiFlow.`
- 2026-08-07
  - Summary: `Started Task 2 by introducing script-editor/kernel/script-editor-session, moving workflow-controller construction out of MainUiFlow, and routing entry helpers through the session file.`
  - Verification: `npm run build:test`; `node --test tests/script-editor-embedded-session.test.cjs`; `npm run typecheck`
  - Next: `Continue Task 2 by removing direct script editor event-routing ownership from MainUiFlow.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-07-script-editor-dual-mode-package-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `The approved design freezes boundaries and terminology; implementation must not introduce a compatibility seam.`
  - `Canonical project-progress is still on an older child; this plan therefore owns the package migration execution boundary locally until promoted into the canonical queue.`

## Implementation Scope

### In Scope

- Move script editor session ownership out of `MainUiFlow`.
- Make the script editor host contract explicit, with optional preview/template/publication capabilities.
- Keep runtime preview external by injected host capability only.
- Add a standalone script editor entry.
- Remove runtime/shared reverse imports from `modules/script-editor`.
- Stop using `src/modules/script-editor/**` as the accidental owner of runtime publication registration.

### Still Out Of Scope

- Rewriting scenario-pack content families or editor project schema beyond what the package boundary requires.
- Redesigning the current script editor UI layout or authoring workflow.
- Changing the approved boundary or repository terminology from the design spec.
- Moving gameplay runtime preview implementation itself into the script editor.

## File Map

### Existing files to modify

- `src/modules/script-editor/host/script-editor-host.ts`
  - Replace the old preview runtime field with the frozen injected host capability shape.
- `src/modules/script-editor/host/browser-script-editor-host.ts`
  - Adapt browser host construction to the new host contract.
- `src/modules/script-editor/kernel/script-editor-workflow-controller.ts`
  - Remove main-shell vocabulary and route preview through injected capability checks.
- `src/modules/script-editor/entries/mount-script-editor.ts`
  - Upgrade the current placeholder mount helper into a real session mount owner.
- `src/modules/script-editor/entries/open-script-editor.ts`
  - Return a real embedded session handle instead of only toggling dataset state.
- `src/modules/script-editor/index.ts`
  - Export the package-shaped session and host contract surfaces.
- `src/modules/script-editor/main-ui-bridge.ts`
  - Stop exposing package internals only for `MainUiFlow` giant-module consumption.
- `src/modules/script-editor/ui/main-ui-script-editor-module.js`
  - Reduce this file to an embedded host adapter instead of the primary editor owner.
- `src/ui/main-ui/main-ui-flow.js`
  - Remove direct script editor DOM/event/state ownership and mount the embedded session instead.
- `src/application/character/person-attribute-runtime.ts`
  - Move shared contract ownership to a neutral contract file.
- `src/application/scenario/registered-scenario-pack-publications.ts`
  - Stop importing runtime publication data directly from the editor package.
- `src/modules/script-editor/application/default-template-project-loader.ts`
  - Route default template loading through an injected template capability path.
- `vite.config.ts`
  - Add a standalone script editor build entry.

### Existing files expected to be deleted

- `src/modules/script-editor/ui/main-ui-script-editor-module.d.ts`
  - Delete if it only exists to support the old main-ui giant-module shape after the embedded adapter shrinks.

### New files to create

- `src/core/contracts/script-editor-person-attributes.ts`
  - Neutral owner for runtime-consumed person attribute contract types.
- `src/modules/script-editor/kernel/script-editor-session.ts`
  - Real script editor session owner for standalone and embedded modes.
- `src/modules/script-editor/standalone/script-editor-standalone.ts`
  - Standalone bootstrap using the same session owner.
- `src/modules/script-editor/standalone/script-editor-standalone-host.ts`
  - Standalone host implementation and capability wiring.
- `src/modules/script-editor/host/script-editor-template-catalog.ts`
  - Host-facing template catalog contract and repository-local default implementation seam.
- `src/modules/script-editor/host/script-editor-publication-catalog.ts`
  - Host-facing publication catalog contract and repository-local default implementation seam.
- `prototypes/script-editor/index.html`
  - Standalone entry HTML for the script editor.
- `tests/script-editor-host-contract.test.cjs`
  - Source-level contract test for host capability injection and neutral contract ownership.
- `tests/script-editor-embedded-session.test.cjs`
  - Source-level ownership test proving `MainUiFlow` no longer owns script editor DOM/actions.
- `tests/script-editor-standalone-entry.test.cjs`
  - Source-level/build-entry test for standalone mode.
- `tests/script-editor-publication-boundary.test.cjs`
  - Source-level boundary test for template/publication ownership.

## Verification Plan

- Targeted verification:
  - `tests/script-editor-host-contract.test.cjs`
  - `tests/script-editor-embedded-session.test.cjs`
  - `tests/script-editor-standalone-entry.test.cjs`
  - `tests/script-editor-publication-boundary.test.cjs`
  - `tests/script-editor-runtime-preview-compat.test.cjs`
- Required commands:
  - `npm run build:test`
  - `node --test tests/script-editor-host-contract.test.cjs tests/script-editor-embedded-session.test.cjs tests/script-editor-standalone-entry.test.cjs tests/script-editor-publication-boundary.test.cjs tests/script-editor-runtime-preview-compat.test.cjs`
  - `npm run typecheck`
  - `npm run build`
- Runtime/browser smoke:
  - `http://localhost:5173/` embedded path still opens `剧本编辑`
  - standalone path loads its own shell
  - embedded mode with injected preview host can still enter runtime preview
  - standalone mode without preview host fails closed on preview action

## Task 1: Lock Host Contract And Neutral Shared Contract Ownership

**Files:**
- Create: `src/core/contracts/script-editor-person-attributes.ts`
- Modify: `src/modules/script-editor/host/script-editor-host.ts`
- Modify: `src/modules/script-editor/host/browser-script-editor-host.ts`
- Modify: `src/application/character/person-attribute-runtime.ts`
- Modify: `src/modules/script-editor/index.ts`
- Test: `tests/script-editor-host-contract.test.cjs`

- [x] **Step 1: Write the failing host-boundary test**

Create `tests/script-editor-host-contract.test.cjs` with checks like:

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("script editor host contract uses injected previewHost/templateCatalog/publicationCatalog fields", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/modules/script-editor/host/script-editor-host.ts"),
    "utf8"
  );

  assert.match(source, /previewHost\\?: ScriptEditorPreviewHost/);
  assert.match(source, /templateCatalog\\?: ScriptEditorTemplateCatalog/);
  assert.match(source, /publicationCatalog\\?: ScriptEditorPublicationCatalog/);
  assert.doesNotMatch(source, /previewRuntime/);
});

test("runtime person attribute support no longer imports from modules\\/script-editor", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/application/character/person-attribute-runtime.ts"),
    "utf8"
  );

  assert.doesNotMatch(source, /modules\\/script-editor/);
  assert.match(source, /core\\/contracts\\/script-editor-person-attributes/);
});
```

- [x] **Step 2: Run the test to verify it fails**

Run:

```bash
npm run build:test
node --test tests/script-editor-host-contract.test.cjs
```

Expected:

- `FAIL`
- `previewRuntime` still exists in the host contract
- `person-attribute-runtime.ts` still imports from `modules/script-editor`

- [x] **Step 3: Implement the neutral shared contract and new host fields**

Create and wire the neutral contract:

```ts
// src/core/contracts/script-editor-person-attributes.ts
export type ScriptEditorPersonAttributeMapping = {
  key: string;
  type: "number" | "boolean" | "string";
  semanticKey?: string | null;
};

export type ScriptEditorPersonAttributeValue = {
  key: string;
  value: unknown;
};
```

Update the host contract:

```ts
export type ScriptEditorPreviewHost = {
  startPreview(
    request: ScriptEditorPreviewRequest
  ): Promise<ScriptEditorPreviewSession>;
};

export type ScriptEditorHost = {
  projectStorage: ScriptEditorProjectStorage;
  previewHost?: ScriptEditorPreviewHost;
  templateCatalog?: ScriptEditorTemplateCatalog;
  publicationCatalog?: ScriptEditorPublicationCatalog;
  notify?: (...args: unknown[]) => void;
  confirm?: (message: string) => Promise<boolean>;
};
```

Update `person-attribute-runtime.ts` to import from the neutral contract file instead of `modules/script-editor`.

- [x] **Step 4: Run the focused contract tests again**

Run:

```bash
npm run build:test
node --test tests/script-editor-host-contract.test.cjs
```

Expected:

- `PASS`

- [x] **Step 5: Commit the boundary lock**

```bash
git add src/core/contracts/script-editor-person-attributes.ts src/modules/script-editor/host/script-editor-host.ts src/modules/script-editor/host/browser-script-editor-host.ts src/application/character/person-attribute-runtime.ts src/modules/script-editor/index.ts tests/script-editor-host-contract.test.cjs
git commit -m "refactor: freeze script editor host contract"
```

## Task 2: Move Script Editor Session Ownership Out Of MainUiFlow

**Files:**
- Create: `src/modules/script-editor/kernel/script-editor-session.ts`
- Modify: `src/modules/script-editor/entries/mount-script-editor.ts`
- Modify: `src/modules/script-editor/entries/open-script-editor.ts`
- Modify: `src/modules/script-editor/ui/main-ui-script-editor-module.js`
- Modify: `src/ui/main-ui/main-ui-flow.js`
- Test: `tests/script-editor-embedded-session.test.cjs`

- [ ] **Step 1: Write the failing embedded-ownership test**

Create `tests/script-editor-embedded-session.test.cjs` with checks like:

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("MainUiFlow mounts the script editor instead of owning its DOM action vocabulary", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/ui/main-ui/main-ui-flow.js"),
    "utf8"
  );

  assert.match(source, /openScriptEditor|mountScriptEditor/);
  assert.doesNotMatch(source, /data-script-editor-action/);
  assert.doesNotMatch(source, /applyScriptEditor[A-Z]/);
});
```

- [ ] **Step 2: Run the failing ownership test**

Run:

```bash
npm run build:test
node --test tests/script-editor-embedded-session.test.cjs
```

Expected:

- `FAIL`
- `MainUiFlow` still contains script editor action selectors and direct apply handlers

- [ ] **Step 3: Implement the real script editor session owner**

Create a session owner that holds editor-local state and event handling:

```ts
export type ScriptEditorSession = {
  mount(): void;
  dispose(): void;
  getSelection(): { family: string; entityId: string | null };
};

export function createScriptEditorSession(input: {
  host: ScriptEditorHost;
  container: HTMLElement;
  initialProject?: ScriptEditorProjectDefinition | null;
}): ScriptEditorSession {
  // Own DOM listeners, internal screen state, and workflow/controller wiring here.
}
```

Update `mount-script-editor.ts` and `open-script-editor.ts` to construct and return this session, and reduce `main-ui-script-editor-module.js` to an embedded adapter that delegates into the session instead of owning editor-local workflow itself.

- [ ] **Step 4: Simplify MainUiFlow to host-only behavior**

Update `MainUiFlow` so the script editor path only:

```js
this.scriptEditorSession = await openScriptEditor({
  host: this.scriptEditorHost,
  mountPoint: this.overlayRoot,
  initialAction: "landing",
});
```

And remove:

- direct `data-script-editor-*` event handling
- direct `applyScriptEditor...` state mutation methods
- editor-local screen ownership outside the mounted session

- [ ] **Step 5: Re-run the embedded ownership test**

Run:

```bash
npm run build:test
node --test tests/script-editor-embedded-session.test.cjs
```

Expected:

- `PASS`

- [ ] **Step 6: Commit the session-owner cutover**

```bash
git add src/modules/script-editor/kernel/script-editor-session.ts src/modules/script-editor/entries/mount-script-editor.ts src/modules/script-editor/entries/open-script-editor.ts src/modules/script-editor/ui/main-ui-script-editor-module.js src/ui/main-ui/main-ui-flow.js tests/script-editor-embedded-session.test.cjs
git commit -m "refactor: move script editor ownership out of MainUiFlow"
```

## Task 3: Keep Runtime Preview External Through Injected Preview Host

**Files:**
- Modify: `src/modules/script-editor/kernel/script-editor-workflow-controller.ts`
- Modify: `src/modules/script-editor/host/script-editor-host.ts`
- Modify: `src/modules/script-editor/host/browser-script-editor-host.ts`
- Test: `tests/script-editor-runtime-preview-compat.test.cjs`

- [ ] **Step 1: Write the failing preview-injection test**

Add a focused test case to `tests/script-editor-runtime-preview-compat.test.cjs` similar to:

```js
test("script editor preview fails closed when no previewHost is injected", async () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/modules/script-editor/kernel/script-editor-workflow-controller.ts"),
    "utf8"
  );

  assert.match(source, /previewHost/);
  assert.doesNotMatch(source, /setScreen\\(\"runtime-preview\"\\)/);
  assert.doesNotMatch(source, /captureRuntimePreviewReturnContext/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm run build:test
node --test --test-name-pattern "preview fails closed when no previewHost is injected" tests/script-editor-runtime-preview-compat.test.cjs
```

Expected:

- `FAIL`
- workflow controller still references main-shell preview vocabulary

- [ ] **Step 3: Change preview flow to injected capability only**

Refactor `previewProjectRuntime()` toward:

```ts
async previewProjectRuntime(): Promise<void> {
  const project = this.environment.getProject();
  const previewHost = this.environment.getPreviewHost();
  if (project == null || previewHost == null) {
    this.environment.recordNotice({
      tone: "warning",
      message: "当前宿主未提供运行预览能力。",
    });
    return;
  }

  const serializedPackFiles = exportScriptEditorProjectToScenarioPackFiles(project);
  await previewHost.startPreview({
    project,
    serializedPackFiles,
  });
}
```

Remove main-shell concepts such as:

- `setScreen("runtime-preview")`
- preview return-context capture/restore
- direct startup result switching in the controller

- [ ] **Step 4: Re-run preview compatibility tests**

Run:

```bash
npm run build:test
node --test tests/script-editor-runtime-preview-compat.test.cjs --test-name-pattern "preview fails closed when no previewHost is injected|runtime preview can load exported zhuyuanzhang template packs that inline map assets as data urls"
```

Expected:

- `PASS`

- [ ] **Step 5: Commit the preview-host change**

```bash
git add src/modules/script-editor/kernel/script-editor-workflow-controller.ts src/modules/script-editor/host/script-editor-host.ts src/modules/script-editor/host/browser-script-editor-host.ts tests/script-editor-runtime-preview-compat.test.cjs
git commit -m "refactor: inject script editor preview host"
```

## Task 4: Add A Real Standalone Script Editor Entry

**Files:**
- Create: `prototypes/script-editor/index.html`
- Create: `src/modules/script-editor/standalone/script-editor-standalone.ts`
- Create: `src/modules/script-editor/standalone/script-editor-standalone-host.ts`
- Modify: `vite.config.ts`
- Test: `tests/script-editor-standalone-entry.test.cjs`

- [ ] **Step 1: Write the failing standalone-entry test**

Create `tests/script-editor-standalone-entry.test.cjs`:

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("vite exposes a standalone script editor entry", () => {
  const viteConfig = fs.readFileSync(path.join(process.cwd(), "vite.config.ts"), "utf8");
  assert.match(viteConfig, /scriptEditor:\\s*resolve\\(__dirname, \"prototypes\\/script-editor\\/index.html\"\\)/);
});

test("standalone script editor prototype exists", () => {
  assert.equal(
    fs.existsSync(path.join(process.cwd(), "prototypes", "script-editor", "index.html")),
    true
  );
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm run build:test
node --test tests/script-editor-standalone-entry.test.cjs
```

Expected:

- `FAIL`
- no standalone script editor entry exists yet

- [ ] **Step 3: Create the standalone bootstrap**

Create the entry and standalone host:

```ts
// src/modules/script-editor/standalone/script-editor-standalone.ts
import { openScriptEditor } from "../entries/open-script-editor";
import { createStandaloneScriptEditorHost } from "./script-editor-standalone-host";

const mountPoint = document.getElementById("app");
if (mountPoint == null) {
  throw new Error("Standalone script editor mount point is missing.");
}

void openScriptEditor({
  host: createStandaloneScriptEditorHost(),
  mountPoint,
  initialAction: "landing",
});
```

Add a Vite input:

```ts
input: {
  main: resolve(__dirname, "index.html"),
  battleDemo: resolve(__dirname, "prototypes/battle-demo/index.html"),
  yuanmoHexEditor: resolve(__dirname, "prototypes/yuanmo-hex-editor/index.html"),
  scriptEditor: resolve(__dirname, "prototypes/script-editor/index.html"),
},
```

- [ ] **Step 4: Re-run the standalone-entry test and build**

Run:

```bash
npm run build:test
node --test tests/script-editor-standalone-entry.test.cjs
npm run build
```

Expected:

- `PASS`
- Vite builds the standalone script editor entry

- [ ] **Step 5: Commit the standalone entry**

```bash
git add prototypes/script-editor/index.html src/modules/script-editor/standalone/script-editor-standalone.ts src/modules/script-editor/standalone/script-editor-standalone-host.ts vite.config.ts tests/script-editor-standalone-entry.test.cjs
git commit -m "feat: add standalone script editor entry"
```

## Task 5: Move Template And Publication Behavior Behind Injected Catalogs

**Files:**
- Create: `src/modules/script-editor/host/script-editor-template-catalog.ts`
- Create: `src/modules/script-editor/host/script-editor-publication-catalog.ts`
- Modify: `src/modules/script-editor/application/default-template-project-loader.ts`
- Modify: `src/application/scenario/registered-scenario-pack-publications.ts`
- Modify: `src/modules/script-editor/host/script-editor-host.ts`
- Test: `tests/script-editor-publication-boundary.test.cjs`

- [ ] **Step 1: Write the failing publication-boundary test**

Create `tests/script-editor-publication-boundary.test.cjs`:

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("runtime publication registration no longer imports built-in template files from modules/script-editor", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/application/scenario/registered-scenario-pack-publications.ts"),
    "utf8"
  );

  assert.doesNotMatch(source, /modules\\/script-editor\\/builtin-templates/);
});
```

- [ ] **Step 2: Run the failing publication-boundary test**

Run:

```bash
npm run build:test
node --test tests/script-editor-publication-boundary.test.cjs
```

Expected:

- `FAIL`
- publication registration still imports editor-owned built-in template files

- [ ] **Step 3: Introduce template/publication catalogs and repository-local adapters**

Create host-facing catalog files:

```ts
export type ScriptEditorTemplateCatalog = {
  loadDefaultTemplate(): Promise<ScriptEditorProjectDefinition>;
};

export type ScriptEditorPublicationCatalog = {
  exportRuntimePackage(
    project: ScriptEditorProjectDefinition
  ): Promise<Record<string, string>>;
};
```

Change default template loading so the editor uses `host.templateCatalog` instead of a hardwired built-in load path, and move repository-local built-in content/publication wiring behind host/provider code rather than direct editor-package ownership.

- [ ] **Step 4: Re-run the publication boundary test**

Run:

```bash
npm run build:test
node --test tests/script-editor-publication-boundary.test.cjs
```

Expected:

- `PASS`

- [ ] **Step 5: Commit the catalog cutover**

```bash
git add src/modules/script-editor/host/script-editor-template-catalog.ts src/modules/script-editor/host/script-editor-publication-catalog.ts src/modules/script-editor/application/default-template-project-loader.ts src/application/scenario/registered-scenario-pack-publications.ts src/modules/script-editor/host/script-editor-host.ts tests/script-editor-publication-boundary.test.cjs
git commit -m "refactor: inject script editor template and publication catalogs"
```

## Task 6: Final Verification And Governance Sync

**Files:**
- Modify: `docs/superpowers/plans/2026-08-07-script-editor-dual-mode-package-plan.md`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/project-progress.md` if this child is promoted into canonical execution

- [ ] **Step 1: Run the focused verification set**

Run:

```bash
npm run build:test
node --test tests/script-editor-host-contract.test.cjs tests/script-editor-embedded-session.test.cjs tests/script-editor-standalone-entry.test.cjs tests/script-editor-publication-boundary.test.cjs tests/script-editor-runtime-preview-compat.test.cjs
npm run typecheck
npm run build
```

Expected:

- all targeted tests `PASS`
- typecheck `PASS`
- build `PASS`

- [ ] **Step 2: Run browser smoke for both modes**

Verify:

- embedded path still opens `剧本编辑`
- embedded path with injected preview host can still enter runtime preview
- standalone path loads its own script editor shell
- standalone path without preview host fails closed on preview action

- [ ] **Step 3: Sync governance docs**

Update:

```md
- Execution State
- Progress Log
- Verification
- docs/change-log.md
```

If this child becomes the canonical active child, also update `docs/superpowers/project-progress.md`.

- [ ] **Step 4: Commit the verified package migration batch**

```bash
git add docs/superpowers/plans/2026-08-07-script-editor-dual-mode-package-plan.md docs/change-log.md docs/superpowers/project-progress.md
git commit -m "docs: record script editor dual-mode package migration"
```

## Exit Check

- [ ] `MainUiFlow` no longer owns script editor internal DOM/state behavior.
- [ ] Script editor can run through a standalone entry.
- [ ] Script editor can run through an embedded session.
- [ ] Runtime preview is only available through injected host capability.
- [ ] Runtime/shared code no longer import `modules/script-editor` as a shared contract owner.
- [ ] Template/publication behavior is no longer hardwired as editor-owned runtime registration.
- [ ] Project progress sync is updated if the child state changed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `Script Editor Dual-Mode Package`
- Parent Task: `Script Editor Package Migration`
- Parent Stage: `Script Editor Package Migration`
- Closeout Status: `closed`
- Project Progress Synced: `yes/no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `close-task`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `none`
- Push Status: `success/failure/not-pushed`
- Push Commit: `commit-sha-or-none`
- Resume From: `Open docs/superpowers/project-progress.md, then close the task or promote the next approved child.`
