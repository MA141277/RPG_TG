# Script Editor Dual-Mode Package Design

## 1. Goal

Turn the script editor into a self-owned product module that can run in two modes without architectural drift:

- standalone mode: the editor runs as its own application surface
- embedded mode: another project mounts the editor and injects host capabilities

The target is not "a large editor feature inside the current game shell." The target is "a reusable editor product that the current game can host."

The editor must not own gameplay runtime preview. It may compile preview data and request preview startup, but an injected external host must own preview lifecycle.

## 2. Target Outcome

After this redesign, the script editor should satisfy all of the following at the same time:

1. it can open without the current `MainUiFlow`
2. it can be mounted by the current game as one host among many
3. it can be mounted by a different project without importing the current game's screen model
4. it can run with no preview capability injected
5. it can request preview startup when a preview capability is injected
6. runtime and shared application code no longer import editor-owned types as contract owners

## 3. Non-Goals

This design does not require:

- moving gameplay runtime preview implementation into the editor package
- preserving today's internal `MainUiFlow` ownership shape as a compatibility seam
- keeping legacy screen ids, return-context helpers, or hidden fallback startup paths alive
- retaining editor-specific ownership over runtime publication registries

This design intentionally prefers a one-shot owner correction over a staged compatibility transition.

## 4. Problem Statement

The current repository already contains editor-oriented files and entry shells, but the effective owner is still the main game shell.

Current symptoms:

- `src/ui/main-ui/main-ui-flow.js` still owns editor screen switching, controller creation, and a large volume of `data-script-editor-*` DOM event handling.
- `src/modules/script-editor/kernel/script-editor-workflow-controller.ts` still speaks in main-shell concepts such as screen changes, preview return context, and host-owned preview startup.
- runtime/shared code still imports editor-owned contract types, for example `src/application/character/person-attribute-runtime.ts`.
- scenario/publication registration still imports built-in template data from the editor directory, for example `src/application/scenario/registered-scenario-pack-publications.ts`.

This means the editor is still a repository-local feature cluster rather than a reusable package-shaped product.

## 5. Design Principles

### 5.1 Editor-Owns-Editor Principle

All editor-local concerns must be owned by the editor:

- workspace state
- selection state
- record editing state
- toolbar actions
- project open/save/import/export flow
- editor-local notices and confirmation flow
- template selection and loading

The host must not interpret editor-local DOM actions or keep editor-local state machines.

### 5.2 Host Capability Injection Principle

The editor must consume host capabilities only through explicit injected interfaces.

Examples:

- project storage
- notifications
- confirmation dialogs
- optional preview host
- optional template/publication catalogs

If a capability is not injected, the feature must fail closed rather than implicitly reaching back into the current game shell.

### 5.3 Preview-Is-External Principle

Preview is not an editor-owned subsystem.

The editor may:

- validate whether the current project can be previewed
- compile preview payloads
- call an injected preview host

The editor must not own:

- gameplay startup
- runtime session lifecycle
- runtime render loop
- preview exit navigation

### 5.4 Shared-Contracts-Are-Neutral Principle

Any type that runtime, startup, scenario loading, or shared systems consume must live in a neutral contract/domain layer rather than under `modules/script-editor`.

The editor may depend on shared contracts. Shared runtime code must not depend on the editor package as the owner of those contracts.

### 5.5 Dual-Mode-Same-Kernel Principle

Standalone mode and embedded mode must reuse the same editor kernel and UI state model.

The only intended difference between the two modes is which host implementation gets injected.

## 6. Target Architecture

### 6.1 Package Shape

The target logical structure is:

- `script-editor-core`
  - project model normalization
  - authoring logic
  - import/export
  - validation
  - preview payload compilation
- `script-editor-ui`
  - workspace session
  - selection
  - record list state
  - toolbar actions
  - rendered editor views
- `script-editor-host-contract`
  - host interfaces and capability contracts
- `script-editor-standalone`
  - standalone bootstrap
  - standalone shell
  - standalone host injection
- `script-editor-embed-adapter`
  - current game host adapter
  - future external project adapters

These names describe ownership and responsibility, not necessarily the final directory names.

### 6.2 Ownership Split

Editor-owned:

- editor session lifecycle
- editor UI state
- project workflow
- project serialization/deserialization
- runtime package export
- preview request creation

Host-owned:

- app shell integration
- mount point lifecycle
- file picker and persistent storage implementation
- notifications
- confirmation dialogs
- preview runtime startup and exit
- cross-app navigation outside the editor session

Shared neutral layer owned:

- runtime-consumed contracts
- content graph-neutral schema
- common ids and typed payload envelopes consumed by runtime or startup

## 7. Host Contract

### 7.1 Required Host Capabilities

The editor cannot run without these injected capabilities:

```ts
type ScriptEditorHost = {
  projectStorage: ScriptEditorProjectStorage;
  notify?: (
    message: string,
    kind?: "info" | "success" | "warning" | "error"
  ) => void;
  confirm?: (message: string) => Promise<boolean>;
  previewHost?: ScriptEditorPreviewHost;
  templateCatalog?: ScriptEditorTemplateCatalog;
  publicationCatalog?: ScriptEditorPublicationCatalog;
};
```

Required meaning:

- `projectStorage` is the only hard requirement
- `notify` and `confirm` remain optional helpers; the editor must render sensible local fallback messaging if they are absent
- `previewHost`, `templateCatalog`, and `publicationCatalog` are optional capabilities

### 7.2 Preview Capability

Preview must be represented as an injected optional capability:

```ts
type ScriptEditorPreviewHost = {
  startPreview(
    request: ScriptEditorPreviewRequest
  ): Promise<ScriptEditorPreviewSession>;
};
```

The editor must behave as follows:

- if `previewHost` is not injected, the preview action is hidden or disabled
- if the preview action is triggered anyway, it fails closed with an editor-owned notice
- if `previewHost` exists, the editor compiles the request and delegates startup

### 7.3 Preview Request Shape

The editor should only hand the host bounded preview data:

```ts
type ScriptEditorPreviewRequest = {
  project: ScriptEditorProjectDefinition;
  serializedPackFiles: Record<string, string>;
};
```

The editor may later add a more reduced compiled payload, but it must not hand off shell-specific screen or return-context state.

### 7.4 Template and Publication Catalogs

Template loading and runtime package publication should also move behind host-facing catalogs rather than remain hardwired to the current repository shell.

Recommended direction:

```ts
type ScriptEditorTemplateCatalog = {
  loadDefaultTemplate(): Promise<ScriptEditorProjectDefinition>;
};

type ScriptEditorPublicationCatalog = {
  exportRuntimePackage(
    project: ScriptEditorProjectDefinition
  ): Promise<Record<string, string>>;
};
```

The current game may provide default implementations backed by local built-in content. A future external project may provide different implementations without changing the editor kernel.

## 8. Standalone and Embedded Modes

### 8.1 Standalone Mode

Standalone mode must provide:

- its own shell
- its own mount point
- a concrete `projectStorage` implementation
- optional `previewHost`
- optional template/publication catalogs

It must not require:

- `MainUiFlow`
- current game screen ids
- current game startup routing

### 8.2 Embedded Mode

Embedded mode must allow a host project to:

- mount one editor session into a container
- inject host capabilities
- receive close/dispose control through a returned session handle

The embedded host must not:

- handle the editor's internal DOM command vocabulary
- own the editor's record selection state
- own editor screen names

## 9. One-Shot Owner Corrections Required

### 9.1 Remove Main Shell Ownership of Editor State

`src/ui/main-ui/main-ui-flow.js` must stop:

- creating the effective editor state machine
- owning editor screen transitions
- directly interpreting editor-local DOM action attributes
- storing editor-local workflow/session state as first-class main-shell state

After the redesign, the main shell should only:

- open an editor session
- pass host capabilities
- dispose the editor session

### 9.2 Remove Main Shell Vocabulary From Editor Kernel

The editor kernel must stop depending on concepts such as:

- `setScreen("script-editor-workspace")`
- `setScreen("runtime-preview")`
- preview return-context capture/restore

Those are current-shell concepts, not package-level editor contracts.

### 9.3 Remove Runtime Reverse Imports From Editor Package

Any runtime/shared code currently importing from `modules/script-editor` as a contract owner must be corrected.

Typical target families:

- person attribute mappings
- any runtime-consumed authoring payload shape
- any shared schema that startup/runtime/content loaders consume

The neutral owner should become `src/core/contracts/**` or `src/domain/**`, depending on existing repository conventions.

### 9.4 Remove Publication Ownership Drift

Built-in templates and publication assets may still be consumed by the editor, but the editor package must not remain the accidental owner of runtime publication registration.

The target rule is:

- editor consumes template/publication catalogs
- the host or content-publication layer owns repository-local registrations

## 10. Directory and Layer Intent

The exact final folders may vary, but the architectural intent should be:

- `src/modules/script-editor/**`
  - editor-only kernel, UI, and host contracts
- `src/application/**` / `src/core/**` / `src/domain/**`
  - neutral shared contracts only
- `src/application/scenario/**`
  - runtime publication/registration ownership
- `src/ui/main-ui/**`
  - host adapter only, not editor internal logic
- standalone entry
  - its own bootstrap surface outside the main game shell lifecycle

## 11. Failure Policy

This redesign should fail closed.

Examples:

- no injected preview host -> preview unavailable
- no template catalog -> template action unavailable
- missing publication catalog where export requires it -> export unavailable with explicit error

The editor must not silently fallback to current-game global state, hidden default imports, or implicit main-shell behavior.

## 12. Acceptance Criteria

The redesign is complete only when all of the following are true:

1. the current main shell no longer directly handles editor-local DOM actions
2. the editor can boot through a standalone entry without `MainUiFlow`
3. the editor can also be mounted by the current game as an embedded session
4. preview is optional and entirely host-injected
5. the editor can run without preview injection
6. runtime/shared code no longer import `modules/script-editor` as a shared contract owner
7. built-in template/publication usage no longer forces the editor package to own runtime registration
8. the same editor kernel serves standalone and embedded modes

## 13. Risks

### 13.1 Large Cutover Risk

Because this design avoids a compatibility seam, the cutover is broad:

- session lifecycle
- host contracts
- UI ownership
- preview delegation
- contract ownership

This is intentional, but it means the implementation should be treated as a full architecture migration rather than a local refactor.

### 13.2 Hidden Main-Shell Coupling Risk

The current editor likely depends on more shell-local assumptions than the obvious `setScreen(...)` calls and event handlers reveal. The implementation must audit for hidden coupling rather than only visible coupling.

### 13.3 Shared Contract Drift Risk

If runtime-consumed types are only partially moved out of the editor package, the repository will retain a disguised reverse dependency and the package boundary will remain fake.

## 14. Final Decision

The project should adopt this final model:

- the script editor becomes a reusable dual-mode product module
- standalone and embedded operation reuse one kernel
- preview is provided only through optional host capability injection
- runtime preview implementation remains outside the editor package
- shared runtime contracts move to neutral ownership
- the current main shell becomes one host adapter, not the editor owner
