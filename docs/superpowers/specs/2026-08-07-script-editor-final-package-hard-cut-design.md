# Script Editor Final Package Hard-Cut Design

## 1. Goal

Turn the script editor into a true package-shaped module that satisfies both of these outcomes at the same time:

- it can run as its own standalone application surface
- it can be mounted by the current project or another project through the same public package entry and host contract

The target is not "a mostly modular editor that still depends on current-project shell knowledge."
The target is "a self-owned script editor package whose host only injects capabilities and mount lifecycle."

## 2. Final Outcome

The redesign is complete only when all of the following are true at once:

1. the script editor has one formal public mount/open surface
2. standalone mode and embedded mode use the same kernel, workflow, and view ownership
3. the current project no longer installs editor-owned methods onto `MainUiFlow`
4. the current project no longer interprets editor-local DOM actions, local state, or preview return-context state
5. runtime preview remains host-injected only
6. template, publication, file-system, project-storage, notification, and confirm behavior all arrive through explicit host capabilities
7. `src/modules/script-editor/index.ts` exposes package surfaces rather than current-project bridge internals
8. another project can theoretically consume the editor by implementing `ScriptEditorHost` without importing current-project shell concepts

## 3. Non-Goals

This design does not require:

- moving gameplay runtime preview implementation into the script editor package
- preserving any current compatibility seam, transition layer, old entry path, or dual ownership model
- keeping `main-ui-script-editor-module` alive if its remaining responsibilities can be absorbed by final host/session ownership
- staged migration through coexisting old/new entry paths

This design explicitly rejects transitional architecture.

## 4. Problem Statement

The current repository already completed the dual-mode baseline, but it has not yet finished the final package hard-cut.

The remaining problem is not "missing editor features." The remaining problem is "residual ownership drift."

Current symptoms:

- `src/ui/main-ui/main-ui-flow.js` still knows concrete script-editor installation shape instead of only consuming a package entry
- `src/modules/script-editor/ui/main-ui-script-editor-module.js` still exists as a large current-project-oriented editor surface instead of a minimal host adapter or no adapter at all
- `src/modules/script-editor/main-ui-bridge.ts` and related exports still preserve internal package surfaces for current-project consumption
- package exposure is still broader and more current-project-shaped than a final reusable package boundary should allow

This means the repository has reached "strong module baseline" but not yet "final package hard-cut."

## 5. Frozen Principles

### 5.1 Package-Owns-Editor Principle

All editor-local responsibilities must remain inside the script editor package:

- session lifecycle
- workspace UI state
- record selection
- record editing interactions
- toolbar actions
- project workflow
- view rendering ownership
- preview request creation

The host must not own or interpret editor-local internal state.

### 5.2 Host-Injects-Capabilities Principle

The host may provide:

- project storage
- file-system behavior
- preview startup
- template loading
- runtime package publication/export behavior
- notifications
- confirmation dialogs

The host may not provide editor-local ownership.

### 5.3 Dual-Mode-Same-Kernel Principle

Standalone mode and embedded mode must share:

- the same session owner
- the same workflow/controller
- the same view/render owner
- the same public package entry semantics

They may differ only in injected host capabilities and mount container.

### 5.4 Fail-Closed Principle

If a host capability is missing, the editor must disable or fail closed explicitly.

No feature may silently reach back into the current project shell.

### 5.5 Boundary-And-Terminology Freeze Principle

The repository terminology and owner boundaries used in this design are frozen for downstream execution.

Do not:

- introduce a new architecture vocabulary for the same responsibilities
- rename existing repository concepts to make the spec sound cleaner
- reframe the package migration as a different subsystem migration

Required vocabulary stays:

- script editor
- standalone mode
- embedded mode
- host
- runtime preview
- template catalog
- publication catalog
- file-system host
- project storage
- mount/open entry

## 6. Hard-Cut Execution Rule

### 6.1 No Transitional Execution Rule

The execution plan derived from this spec must not introduce or preserve any transitional architecture state.

Forbidden examples:

- old entry and new entry coexisting as active supported paths
- old owner and new owner coexisting for the same responsibility
- `MainUiFlow` and script-editor session both understanding editor-local DOM vocabulary
- standalone mode and embedded mode temporarily using different kernels or different view owners
- package public exports that exist only to support a soon-to-be-deleted current-project path

### 6.2 No Slice-Induced Split Rule

The implementation may be committed in batches for verification, but each batch must preserve one coherent final direction and must not create a repository-visible split owner state.

That means:

- a batch may remove one final ownership surface and wire the next final owner in the same batch
- a batch may not leave both old and new owners active "for now"
- a batch may not introduce a temporary bridge whose only purpose is to let both sides survive together
- a batch may not create a temporary public API intended only for mid-migration coexistence

In short:

- batching for execution is allowed
- split ownership is not allowed

### 6.3 No Compatibility Layer Rule

The final package hard-cut must not rely on:

- compatibility wrappers
- fallback bridge exports
- transition adapters that preserve old shell vocabulary
- shadow public APIs for legacy callers

If a responsibility has a final owner, the old owner must be removed rather than wrapped.

## 7. Target Architecture

### 7.1 Public Package Surface

The final reusable package surface must be centered on:

- `mountScriptEditor(...)`
- `openScriptEditor(...)`
- `ScriptEditorHost`
- standalone bootstrap entry

Optional supporting exports may remain only when they are part of the real package contract for external consumers.

### 7.2 Embedded Ownership

In embedded mode, the current project must only:

- allocate a mount container
- construct and inject `ScriptEditorHost`
- call the package entry
- dispose the returned session handle when closing

The current project must not:

- install editor-local methods onto `MainUiFlow`
- store editor-local workflow state
- handle editor-local click/change/input/composition routing
- understand editor-local screen ids or preview return context

### 7.3 Standalone Ownership

In standalone mode, the standalone bootstrap must:

- construct the same editor package entry
- inject standalone host capabilities
- mount the same kernel/UI/session owner

Standalone mode must not own a second editor logic path.

### 7.4 Internal Package Shape

The final ownership intent is:

- `src/modules/script-editor/kernel/**`
  - session, workflow, controller, package-owned runtime-facing authoring logic
- `src/modules/script-editor/host/**`
  - host contracts and repository-local host implementations
- `src/modules/script-editor/entries/**`
  - formal package entry points
- `src/modules/script-editor/standalone/**`
  - standalone bootstrap and standalone host
- `src/modules/script-editor/ui/**`
  - editor-owned views and render helpers only

No current-project shell file should remain the owner of script-editor internals.

## 8. Required Owner Corrections

### 8.1 MainUiFlow Hard-Cut

`src/ui/main-ui/main-ui-flow.js` must be reduced to host behavior only.

Allowed responsibilities:

- open editor
- close editor
- provide host capabilities

Forbidden responsibilities:

- install script-editor internal methods
- own editor-local render methods
- own editor-local state fields
- own editor-local DOM routing

### 8.2 main-ui-script-editor-module Hard-Cut

`src/modules/script-editor/ui/main-ui-script-editor-module.js` must either:

- be deleted entirely, or
- be reduced to a thin current-project host adapter/factory that does not own editor internals

It must not remain a giant mixed owner file.

### 8.3 Bridge Export Hard-Cut

`src/modules/script-editor/main-ui-bridge.ts` and any similar export surface must not continue exposing internal package details only because the current project historically depended on them.

If an export is not part of the real package contract for external hosts, it must be removed.

### 8.4 Public Index Hard-Cut

`src/modules/script-editor/index.ts` must expose only real package surfaces.

It must not remain a convenience barrel for current-project internal reach-through.

## 9. Acceptance Criteria

The hard-cut is accepted only when all of the following pass together:

1. current-project embedded path still supports `剧本编辑 -> 使用模板 -> 运行预览`
2. standalone path at `http://localhost:5173/prototypes/script-editor/` opens and works through the same package kernel
3. standalone mode without `previewHost` fails closed on preview action
4. no current-project shell file owns editor-local DOM/state/render vocabulary
5. no compatibility layer or split owner remains in the codebase
6. package public API is reduced to the final reusable host/entry contract

## 10. Verification Requirements

Verification must include both:

- source-level boundary tests proving old owners and bridge paths are gone
- browser-level smoke proving both embedded and standalone behavior still work

At minimum:

- `npm run build:test`
- targeted `node --test` source-contract suites
- `npm run typecheck`
- `npm run build`
- embedded browser smoke
- standalone browser smoke

## 11. Risks

### 11.1 White-Screen Risk

Removing shell-installed editor methods and mixed owner wiring can break boot and render immediately if a hidden dependency remains.

### 11.2 Hidden Ownership Risk

The largest remaining coupling is likely not only explicit imports but implicit ownership assumptions across render, state, and host setup paths.

### 11.3 False-Package Risk

If the final public API is not narrowed, the repository may claim package completion while still leaking current-project internals as its real contract.

## 12. Final Decision

The repository should execute a one-shot final package hard-cut with these explicit constraints:

- no transitional architecture
- no compatibility layer
- no split ownership
- no old/new entry coexistence
- no shell-owned editor internals

The script editor must end this work as a real reusable package surface that can both run standalone and be mounted by the current project or another project through the same host-driven contract.
