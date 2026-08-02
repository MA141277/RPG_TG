# Unified Playable Shell Final-State Enforcement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert all runnable playables to one final-state shell architecture under `src/playables/<playable-id>/`, remove adapter/compatibility residue, and enforce fail-closed loading for any playable that does not satisfy the shared shell contract.

**Architecture:** The shared playable runtime becomes the only lifecycle owner and loads a direct `PlayableShell` package registry instead of host adapters, feature-local launch code, or legacy minigame directories. Every runnable playable moves into `src/playables/<id>/`, Script Editor/tooling validates the same canonical path, and the migration deletes old runnable paths in the same batch rather than preserving compatibility shims.

**Tech Stack:** TypeScript, Node test runner, Vite runtime, shared playable runtime under `src/core/runtime/**`, Script Editor tooling under `tools/**` and `src/modules/script-editor/**`, targeted guards in `tests/robustness.test.cjs`, browser acceptance via a new playable-shell smoke test, plus `npm run build:test`, `npm run typecheck`, `npm run validate:playables`, `npm test`, and `npm run lint:plans`.

## Execution State

- Status: `running`
- Last Updated: `2026-08-02`
- Current Focus: `Task 4 is now split: building-flow residue is being retired because authored flow-playables are empty, while activity-qte and the remaining runnable builtins still need canonical shell migration.`
- Next Step: `Finish deleting retired building-flow builtin/runtime residue, then move activity-qte and the remaining runnable builtins into canonical src/playables roots.`
- Verification: `Task 1/2/3 targeted verification passed in the real mod-first-dev worktree; full tests/robustness.test.cjs file still reports unrelated pre-existing failures outside the playable-shell migration scope.`
- Notes: `This plan is fail-closed. No task may introduce compatibility re-exports, dual runnable directories, or per-playable host adapters.`

## Progress Log

- 2026-08-02
  - Summary: `Authored the final-state implementation plan for unified playable shell enforcement after the repository direction was narrowed to "no intermediate state, no compatibility layer, no dual path".`
  - Verification: `Not run`
  - Next: `Choose execution mode and begin Task 1 with failing guards for canonical src/playables packaging and forbidden adapter residue.`
- 2026-08-02
  - Summary: `Completed Task 1 in the real mod-first-dev worktree: tooling now scaffolds canonical src/playables packages, validator enforces the 7-file shell plus exact artifact.paths truth, and scaffold/validator/integration scaffold all share the stricter playable-id rule.`
  - Verification: `'/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node' node_modules/typescript/bin/tsc -p tsconfig.test.json' passed; Task 1 target robustness cases passed; full tests/robustness.test.cjs file still reports unrelated pre-existing failures.`
  - Next: `Begin Task 2 with failing guards for PlayableShell contract, shell registry installation, and removal of host-adapter ownership.`
- 2026-08-02
  - Summary: `Completed Task 2 in the real mod-first-dev worktree: added the runtime-owned PlayableShell contract, introduced dedicated shell registries, exposed default shell-registry reads from playable-runtime-registries, and strengthened robustness coverage with behavior-level shell-registry tests instead of source regex checks alone.`
  - Verification: `'/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node' node_modules/typescript/bin/tsc -p tsconfig.test.json' passed; the four Task 2 robustness cases passed in /tmp/mod-first-dev-task2-robustness.log; full tests/robustness.test.cjs file still reports unrelated pre-existing failures.`
  - Next: `Begin Task 3 by cutting playable runtime ownership over from host adapters to direct shell lookup and deleting the host-adapter seam in the same batch.`
- 2026-08-02
  - Summary: `Completed the Task 3 shell-ownership cutover for the temple path: deleted the playable-host-adapter registry seam, rewired playable-runtime and house-playable-overlay to consume direct shell state, moved temple-copy-scripture into src/playables/temple-copy-scripture, and normalized the retained Huangjue Temple temple-copy-scripture payloads so launch no longer depends on host-side activity/text translation.`
  - Verification: `'/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node' node_modules/typescript/bin/tsc -p tsconfig.test.json' passed; Task 2/3 target robustness cases passed in /tmp/mod-first-dev-task23.log; full tests/robustness.test.cjs file still reports unrelated pre-existing failures.`
  - Next: `Continue Task 4 by migrating the remaining builtin playables and deleting the leftover feature-owned runnable roots beyond temple-copy-scripture.`
- 2026-08-02
  - Summary: `While starting Task 4, confirmed both retained zhuyuanzhang flow-playables tables are already empty and therefore retired the leftover built-in building-flow residue instead of migrating it into src/playables: removed its builtin definition/integration registration, deleted its runtime special-case, and removed its Script Editor builtin labels.`
  - Verification: `'/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node' node_modules/typescript/bin/tsc --noEmit -p tsconfig.json' passed; '/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node' node_modules/typescript/bin/tsc -p tsconfig.test.json' passed; targeted building-flow retirement guards passed in tests/robustness.test.cjs.`
  - Next: `Continue Task 4 by migrating activity-qte and the remaining actually-runnable builtins; do not create a src/playables/building-flow package for already-retired content.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-02-unified-playable-shell-final-state-enforcement-design.md`
- Superseded context being replaced:
  - `docs/superpowers/specs/2026-08-02-temple-copy-scripture-independent-package-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `mod-first-dev` already contains a partially completed temple package split, but that split still uses `src/minigames/temple-copy-scripture/**`, `src/application/playables/builtin/temple-copy-scripture/**`, and the new `playable-host-adapter` registry seam. All three are residue under the approved final-state spec.
  - The repository still has no `src/playables/**` root, and `tools/scaffold-playable.mjs` plus `tools/validate-playables.mjs` still enforce the retired `src/application/playables/**` / `src/ui/views/playables/**` / `src/domain/playables/**` spread instead of the new package-root rule.
  - Builtin runnable playable ids currently visible in registry/runtime scope are `activity-qte`, `temple-copy-scripture`, `city-begging`, `grain-accounting`, `medicine-compounding`, and `story-battle`. `building-flow` is no longer treated as runnable scope because authored flow-playables are already empty and the leftover builtin/runtime residue is being deleted instead of migrated.

## Implementation Scope

### In Scope

- Define one runtime-owned `PlayableShell` contract and direct shell registry.
- Move every runnable playable package into `src/playables/<playable-id>/`.
- Delete the `playable-host-adapter` seam and all temple adapter files.
- Delete legacy runnable ownership from `src/minigames/**`, `src/application/playables/**`, `src/application/minigames/**`, `src/application/story-battle/**`, and feature-owned `src/ui/views/minigames/**` once their logic is moved.
- Update Script Editor/tooling validation so non-shell-compliant playables fail closed before export or runtime launch.
- Add targeted source/runtime/browser guards for canonical path, forbidden adapter residue, and end-to-end authored launch/settlement/return.

### Still Out Of Scope

- Introducing a new playable family beyond the existing runtime taxonomy.
- Rewriting authored scenario content beyond what is necessary to keep existing retained playable routes working.
- General repository-wide blueprint work unrelated to playable shell finalization.
- Shipping new gameplay mechanics beyond migration of the current runnable playable set.

## File Map

### Existing files to modify

- `src/core/contracts/playable-runtime.ts`
  - Add the canonical `PlayableShell` contract, shell manifest typing, and fail-closed launch failure codes for missing shell packages.
- `src/core/runtime/playable-runtime.ts`
  - Replace host-adapter / feature-branch loading with direct shell loading, lifecycle ownership, and shell-driven presenter/completion handling.
- `src/core/runtime/playable-runtime-registries.ts`
  - Replace `hostAdapters` with `shells`, and load shell contributions from the builtin registry plus activated mod content.
- `src/core/registry/builtin-playable-definition-registry.ts`
  - Stop importing `src/minigames/temple-copy-scripture/**`; read builtin ids from the new `src/playables/**` package entrypoints.
- `src/core/registry/builtin-playable-integration-registry.ts`
  - Keep integration ids stable while pointing all builtins at shell-compliant package ids only.
- `src/core/runtime/interactive-runtime.ts`
  - Remove any remaining feature-owned launch/action routing that duplicates the shell runtime.
- `src/main.ts`
  - Delete any playable-specific dispatch, closeout, or return logic that survives outside the runtime.
- `src/ui/views/playables/house-playable-overlay.ts`
  - Consume presenter data from the shared shell path only; no temple-specific or feature-owned render routing.
- `src/modules/script-editor/application/runtime-pack-export.ts`
  - Fail closed when a playable instance targets a non-shell-compliant package id.
- `src/modules/script-editor/application/runtime-pack-import.ts`
  - Fail closed on retired playable packaging truth if imported data tries to reference a non-canonical builtin shell.
- `src/modules/script-editor/application/workspace-shell.ts`
  - Surface creator-facing diagnostics when a playable package is missing or invalid.
- `tools/scaffold-playable.mjs`
  - Scaffold only the final-state `src/playables/<id>/` package shape.
- `tools/validate-playables.mjs`
  - Validate shell package presence and canonical root files instead of the retired multi-directory shape.
- `tests/robustness.test.cjs`
  - Add source guards, registry guards, tool guards, and launch-failure guards.
- `docs/change-log.md`
  - Record the final-state migration and the deleted adapter/compatibility seams.

### Existing files expected to be deleted

- `src/core/contracts/playable-host-adapter.ts`
- `src/core/registry/playable-host-adapter-registry.ts`
- `src/core/registry/builtin-playable-host-adapter-registry.ts`
- `src/application/playables/builtin/temple-copy-scripture/**`
- `src/minigames/temple-copy-scripture/**`
- `src/application/playables/activity-qte/**`
- `src/application/playables/flow/**`
- `src/application/playables/city-begging/**`
- `src/application/playables/grain-accounting/**`
- `src/application/playables/medicine-compounding/**`
- `src/application/playables/story-battle/**`
- `src/application/minigames/city-begging-minigame.ts`
- `src/application/minigames/city-begging-granary-escort.ts`
- `src/application/minigames/city-begging-village-catching.ts`
- `src/application/story-battle/story-battle-runtime.ts`
- Any leftover feature-owned minigame view file that still acts as a runnable lifecycle seam after migration.

### New files to create

- `src/core/registry/playable-shell-registry.ts`
  - Runtime registry for direct `PlayableShell` install and lookup.
- `src/core/registry/builtin-playable-shell-registry.ts`
  - Canonical builtin installation point for all runnable shells.
- `src/playables/activity-qte/**`
- `src/playables/temple-copy-scripture/**`
- `src/playables/city-begging/**`
- `src/playables/grain-accounting/**`
- `src/playables/medicine-compounding/**`
- `src/playables/story-battle/**`
  - Each package owns its manifest, contract, session, reducer, presenter, settlement, and `index.ts` shell export.
- `tests/browser-playable-shell-smoke.test.cjs`
  - Browser acceptance for authored launch -> play -> settle -> return on the retained Huangjue Temple route.

## Verification Plan

- Targeted verification:
  - `tests/robustness.test.cjs` source/runtime guards for canonical `src/playables/**`, no host adapter registry, no temple-specific runtime branches, and fail-closed launch for missing shells.
  - `tests/browser-playable-shell-smoke.test.cjs` authored browser flow for `皇觉寺 -> 抄经 -> 游玩 -> 结算 -> 返回`.
  - `npm run validate:playables` to enforce authoring/tooling intake on the same shell rule.
- Required commands:
  - `npm run lint:plans`
  - `npm run build:test`
  - `node --test tests/robustness.test.cjs --test-name-pattern "playable shell|host adapter|canonical playable path"`
  - `npm run typecheck`
  - `npm run validate:playables`
  - `node --test tests/browser-playable-shell-smoke.test.cjs`
  - `npm test`

## Task 1: Lock Canonical Path And Tooling Guards

**Files:**
- Modify: `tests/robustness.test.cjs`
- Modify: `tools/scaffold-playable.mjs`
- Modify: `tools/validate-playables.mjs`
- Read: `package.json`

- [x] **Step 1: Write the failing guard tests**

Add source/tooling guards that describe the final-state intake rule before changing any implementation:

```js
test("playable tooling only scaffolds canonical src/playables packages", () => {
  const scaffoldSource = fs.readFileSync(
    path.join(repoRoot, "tools/scaffold-playable.mjs"),
    "utf8"
  );

  assert.match(scaffoldSource, /src\",\\s*\"playables\"/);
  assert.doesNotMatch(scaffoldSource, /src\",\\s*\"application\",\\s*\"playables\"/);
  assert.doesNotMatch(scaffoldSource, /src\",\\s*\"ui\",\\s*\"views\",\\s*\"playables\"/);
});

test("playable validator requires shell package files under src/playables", () => {
  const validatorSource = fs.readFileSync(
    path.join(repoRoot, "tools/validate-playables.mjs"),
    "utf8"
  );

  assert.match(validatorSource, /src\\/playables\\/\\$\\{artifact\\.playableId\\}/);
  assert.match(validatorSource, /manifest\\.ts/);
  assert.match(validatorSource, /index\\.ts/);
  assert.doesNotMatch(validatorSource, /src\\/application\\/playables/);
});
```

- [x] **Step 2: Run the guard tests and confirm they fail on the current retired paths**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "playable tooling only scaffolds canonical src/playables packages|playable validator requires shell package files under src/playables"
```

Expected:

- `FAIL`
- failure shows `tools/scaffold-playable.mjs` still writes `src/application/playables/**`
- failure shows `tools/validate-playables.mjs` still validates the retired multi-directory layout

- [x] **Step 3: Rewrite the tooling to the final-state package root**

Update the scaffold output root and validator required files so both tools enforce the same package shell:

```js
const playableDir = path.join(outputRoot, "src", "playables", playableId);
```

```js
const requiredPaths = [
  `src/playables/${artifact.playableId}/manifest.ts`,
  `src/playables/${artifact.playableId}/contract.ts`,
  `src/playables/${artifact.playableId}/session.ts`,
  `src/playables/${artifact.playableId}/reducer.ts`,
  `src/playables/${artifact.playableId}/presenter.ts`,
  `src/playables/${artifact.playableId}/settlement.ts`,
  `src/playables/${artifact.playableId}/index.ts`,
];
```

Also update scaffolded file contents so the generated package exports `manifest`, `createSession`, `reduce`, `present`, and `complete` from one root package.

- [x] **Step 4: Re-run the same tooling guards**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "playable tooling only scaffolds canonical src/playables packages|playable validator requires shell package files under src/playables"
```

Expected:

- `PASS`

- [x] **Step 5: Commit the tooling gate**

Run:

```bash
git add tests/robustness.test.cjs tools/scaffold-playable.mjs tools/validate-playables.mjs
git commit -m "test: guard canonical playable package tooling" -m "Summary:
- add failing-then-passing guards for src/playables package scaffolding and validation
- shift playable tooling to the final-state shell package root"
```

## Task 2: Introduce The Shared Playable Shell Contract And Registry

**Files:**
- Modify: `src/core/contracts/playable-runtime.ts`
- Create: `src/core/registry/playable-shell-registry.ts`
- Create: `src/core/registry/builtin-playable-shell-registry.ts`
- Modify: `src/core/runtime/playable-runtime-registries.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write the failing runtime contract tests**

Add guards that require a direct shell registry and forbid new host-adapter ownership:

```js
test("playable runtime registries install builtin shells instead of host adapters", () => {
  const registrySource = fs.readFileSync(
    path.join(repoRoot, "src/core/runtime/playable-runtime-registries.ts"),
    "utf8"
  );

  assert.match(registrySource, /installBuiltinPlayableShells/);
  assert.doesNotMatch(registrySource, /installBuiltinPlayableHostAdapters/);
  assert.match(registrySource, /shells:/);
  assert.doesNotMatch(registrySource, /hostAdapters:/);
});

test("playable runtime contract exposes a direct PlayableShell surface", () => {
  const contractSource = fs.readFileSync(
    path.join(repoRoot, "src/core/contracts/playable-runtime.ts"),
    "utf8"
  );

  assert.match(contractSource, /export type PlayableShell =/);
  assert.match(contractSource, /createSession:/);
  assert.match(contractSource, /reduce:/);
  assert.match(contractSource, /present:/);
  assert.match(contractSource, /complete:/);
});
```

- [x] **Step 2: Run the contract tests to confirm the current registry still points at host adapters**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "playable runtime registries install builtin shells instead of host adapters|playable runtime contract exposes a direct PlayableShell surface"
```

Expected:

- `FAIL`
- failure mentions missing `PlayableShell` type and existing `installBuiltinPlayableHostAdapters`

- [x] **Step 3: Implement the shell contract and registry**

Add the new contract and registry in one pass:

```ts
export type PlayableShell = {
  manifest: {
    playableId: PlayableId;
    family: "minigame" | "battle" | "flow";
    commandPrefix: string;
  };
  createSession: (input: PlayableLaunchRequest) => ActivePlayableSession;
  reduce: (
    session: ActivePlayableSession,
    command: PlayableCommand
  ) => ActivePlayableSession;
  present: (
    session: ActivePlayableSession
  ) => PlayablePresenterModel;
  complete: (
    session: ActivePlayableSession
  ) => PlayableResult | null;
};
```

```ts
export function createPlayableShellRegistry(): PlayableShellRegistry {
  const entries = new Map<PlayableId, PlayableShell>();
  return {
    register(shell) {
      entries.set(shell.manifest.playableId, shell);
    },
    get(playableId) {
      return entries.get(playableId) ?? null;
    },
  };
}
```

Update `playable-runtime-registries.ts` so it installs builtin shells and exports `readDefaultPlayableShellRegistry()`.

- [x] **Step 4: Re-run the shell contract tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "playable runtime registries install builtin shells instead of host adapters|playable runtime contract exposes a direct PlayableShell surface"
```

Expected:

- `PASS`

- [ ] **Step 5: Commit the shell contract foundation**

Run:

```bash
git add src/core/contracts/playable-runtime.ts src/core/registry/playable-shell-registry.ts src/core/registry/builtin-playable-shell-registry.ts src/core/runtime/playable-runtime-registries.ts tests/robustness.test.cjs
git commit -m "refactor: add unified playable shell registry" -m "Summary:
- define the runtime-owned PlayableShell contract
- install builtin shells through a dedicated shell registry instead of host-adapter ownership"
```

## Task 3: Make Playable Runtime Fail Closed And Delete Adapter Ownership

**Files:**
- Modify: `src/core/runtime/playable-runtime.ts`
- Modify: `src/core/runtime/interactive-runtime.ts`
- Modify: `src/main.ts`
- Modify: `src/ui/views/playables/house-playable-overlay.ts`
- Delete: `src/core/contracts/playable-host-adapter.ts`
- Delete: `src/core/registry/playable-host-adapter-registry.ts`
- Delete: `src/core/registry/builtin-playable-host-adapter-registry.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write the failing runtime-ownership tests**

Add guards that require the runtime to load shells directly and fail closed on missing shells:

```js
test("playable runtime fails closed when a playable shell is missing", () => {
  const runtimeSource = fs.readFileSync(
    path.join(repoRoot, "src/core/runtime/playable-runtime.ts"),
    "utf8"
  );

  assert.match(runtimeSource, /readDefaultPlayableShellRegistry\\(\\)\\.get/);
  assert.match(runtimeSource, /code: \"missing-playable-shell\"/);
  assert.doesNotMatch(runtimeSource, /readDefaultPlayableHostAdapterRegistry/);
});

test("shared runtime and main entry stay free of temple or host-adapter branches", () => {
  const runtimeSource = fs.readFileSync(
    path.join(repoRoot, "src/core/runtime/playable-runtime.ts"),
    "utf8"
  );
  const mainSource = fs.readFileSync(
    path.join(repoRoot, "src/main.ts"),
    "utf8"
  );

  assert.doesNotMatch(runtimeSource, /temple-copy-scripture/);
  assert.doesNotMatch(runtimeSource, /host-adapter/i);
  assert.doesNotMatch(mainSource, /temple-copy-scripture/);
});
```

- [x] **Step 2: Run the failing runtime-ownership tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "playable runtime fails closed when a playable shell is missing|shared runtime and main entry stay free of temple or host-adapter branches"
```

Expected:

- `FAIL`
- current runtime still imports or references the host-adapter seam

- [x] **Step 3: Rewrite runtime ownership to use shells only**

Refactor the runtime and overlay entrypoints so they consume direct shell output:

```ts
const shell = readDefaultPlayableShellRegistry().get(resolvedRequest.playableId);
if (shell == null) {
  return {
    ok: false,
    code: "missing-playable-shell",
    message: `Playable '${resolvedRequest.playableId}' is not backed by a shell package.`,
  };
}

const session = shell.createSession(resolvedRequest);
const presenter = shell.present(session);
const completion = shell.complete(session);
```

Delete the host-adapter registry files in the same change and remove any remaining special-case closeout or overlay branch in `main.ts` and `house-playable-overlay.ts`.

- [x] **Step 4: Re-run the runtime-ownership tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "playable runtime fails closed when a playable shell is missing|shared runtime and main entry stay free of temple or host-adapter branches"
```

Expected:

- `PASS`

- [ ] **Step 5: Commit the runtime ownership cutover**

Run:

```bash
git add src/core/runtime/playable-runtime.ts src/core/runtime/interactive-runtime.ts src/main.ts src/ui/views/playables/house-playable-overlay.ts src/core/runtime/playable-runtime-registries.ts tests/robustness.test.cjs
git rm src/core/contracts/playable-host-adapter.ts src/core/registry/playable-host-adapter-registry.ts src/core/registry/builtin-playable-host-adapter-registry.ts
git commit -m "refactor: make playable runtime shell-owned" -m "Summary:
- route playable launch and lifecycle through direct shell loading
- delete the host-adapter registry seam and related special-case runtime ownership"
```

## Task 4: Migrate Activity QTE While Retiring Empty Building-Flow Residue

**Files:**
- Create: `src/playables/activity-qte/**`
- Create: `src/playables/temple-copy-scripture/**`
- Modify: `src/core/registry/builtin-playable-shell-registry.ts`
- Modify: `src/core/registry/builtin-playable-definition-registry.ts`
- Modify: `src/core/registry/builtin-playable-integration-registry.ts`
- Delete: `src/application/playables/activity-qte/**`
- Delete: `src/minigames/temple-copy-scripture/**`
- Delete: `src/application/playables/builtin/temple-copy-scripture/**`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Write the failing canonical-path tests for the first three packages**

Add file-presence/source guards that name the three packages explicitly:

```js
for (const playableId of ["activity-qte", "temple-copy-scripture"]) {
  test(`canonical shell package exists for ${playableId}`, () => {
    const packageRoot = path.join(repoRoot, "src/playables", playableId);
    assert.ok(fs.existsSync(path.join(packageRoot, "manifest.ts")));
    assert.ok(fs.existsSync(path.join(packageRoot, "index.ts")));
  });
}
```

Add paired guards that the old runnable roots are gone after migration:

```js
test("retired runnable roots are removed for temple and flow packages", () => {
  assert.equal(
    fs.existsSync(path.join(repoRoot, "src/minigames/temple-copy-scripture")),
    false
  );
  assert.equal(
    builtinPlayableDefinitionRegistry.get("building-flow"),
    null
  );
});
```

- [ ] **Step 2: Run the canonical-path tests and confirm `src/playables/**` does not exist yet**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "canonical shell package exists for activity-qte|canonical shell package exists for temple-copy-scripture|retired runnable roots are removed for temple and flow packages"
```

Expected:

- `FAIL`
- missing `src/playables/activity-qte` and `src/playables/temple-copy-scripture`

- [ ] **Step 3: Move the three packages and export direct shells**

Create the new package roots and expose direct shells from `index.ts`:

```ts
export const templeCopyScriptureShell: PlayableShell = {
  manifest: {
    playableId: "temple-copy-scripture",
    family: "minigame",
    commandPrefix: "playable.temple-copy-scripture.",
  },
  createSession: createTempleCopyScriptureSession,
  reduce: reduceTempleCopyScriptureSession,
  present: presentTempleCopyScriptureSession,
  complete: completeTempleCopyScriptureSession,
};
```

Install the new shells in `builtin-playable-shell-registry.ts` and delete the leftover built-in `building-flow` registry/runtime residue in the same task instead of migrating a package for already-retired content.

- [ ] **Step 4: Re-run the canonical-path tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "canonical shell package exists for activity-qte|canonical shell package exists for temple-copy-scripture|retired runnable roots are removed for temple and flow packages"
```

Expected:

- `PASS`

- [ ] **Step 5: Commit the first package migration slice**

Run:

```bash
git add src/playables/activity-qte src/playables/temple-copy-scripture src/core/registry/builtin-playable-shell-registry.ts src/core/registry/builtin-playable-definition-registry.ts src/core/registry/builtin-playable-integration-registry.ts tests/robustness.test.cjs
git rm -r src/application/playables/activity-qte src/minigames/temple-copy-scripture src/application/playables/builtin/temple-copy-scripture
git commit -m "refactor: migrate core minigame shells to src/playables" -m "Summary:
- move activity-qte and temple-copy-scripture into canonical playable packages
- delete the retired temple runnable roots and leftover building-flow builtin residue"
```

## Task 5: Migrate City Begging, Grain Accounting, And Medicine Compounding

**Files:**
- Create: `src/playables/city-begging/**`
- Create: `src/playables/grain-accounting/**`
- Create: `src/playables/medicine-compounding/**`
- Modify: `src/core/registry/builtin-playable-shell-registry.ts`
- Delete: `src/application/playables/builtin/city-begging/**`
- Delete: `src/application/playables/builtin/grain-accounting/**`
- Delete: `src/application/playables/medicine-compounding/**`
- Delete: `src/application/minigames/city-begging-minigame.ts`
- Delete: `src/application/minigames/city-begging-granary-escort.ts`
- Delete: `src/application/minigames/city-begging-village-catching.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Write the failing tests for the house-playable package roots**

Add guards for the three house-oriented playables:

```js
for (const playableId of [
  "city-begging",
  "grain-accounting",
  "medicine-compounding",
]) {
  test(`canonical shell package exists for ${playableId}`, () => {
    const packageRoot = path.join(repoRoot, "src/playables", playableId);
    assert.ok(fs.existsSync(path.join(packageRoot, "manifest.ts")));
    assert.ok(fs.existsSync(path.join(packageRoot, "index.ts")));
  });
}
```

Add deletion guards for the city-begging local runtime roots:

```js
test("city begging no longer depends on application/minigames ownership", () => {
  assert.equal(
    fs.existsSync(path.join(repoRoot, "src/application/minigames/city-begging-minigame.ts")),
    false
  );
});
```

- [ ] **Step 2: Run the new house-playable guards**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "canonical shell package exists for city-begging|canonical shell package exists for grain-accounting|canonical shell package exists for medicine-compounding|city begging no longer depends on application/minigames ownership"
```

Expected:

- `FAIL`

- [ ] **Step 3: Move the house playables into canonical shell packages**

Create the three package roots and expose shell entrypoints:

```ts
export const grainAccountingShell: PlayableShell = {
  manifest: {
    playableId: "grain-accounting",
    family: "minigame",
    commandPrefix: "playable.grain-accounting.",
  },
  createSession: createGrainAccountingSession,
  reduce: reduceGrainAccountingSession,
  present: presentGrainAccountingSession,
  complete: completeGrainAccountingSession,
};
```

```ts
export const cityBeggingShell: PlayableShell = {
  manifest: {
    playableId: "city-begging",
    family: "minigame",
    commandPrefix: "interactive.city-begging.",
  },
  createSession: createCityBeggingSession,
  reduce: reduceCityBeggingSession,
  present: presentCityBeggingSession,
  complete: completeCityBeggingSession,
};
```

Move any currently used assets/text manifests under each new package root and delete the retired `application/minigames` ownership files in the same task.

- [ ] **Step 4: Re-run the house-playable guards**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "canonical shell package exists for city-begging|canonical shell package exists for grain-accounting|canonical shell package exists for medicine-compounding|city begging no longer depends on application/minigames ownership"
```

Expected:

- `PASS`

- [ ] **Step 5: Commit the house-playable migration**

Run:

```bash
git add src/playables/city-begging src/playables/grain-accounting src/playables/medicine-compounding src/core/registry/builtin-playable-shell-registry.ts tests/robustness.test.cjs
git rm -r src/application/playables/builtin/city-begging src/application/playables/builtin/grain-accounting src/application/playables/medicine-compounding
git rm src/application/minigames/city-begging-minigame.ts src/application/minigames/city-begging-granary-escort.ts src/application/minigames/city-begging-village-catching.ts
git commit -m "refactor: migrate house playables to canonical shell packages" -m "Summary:
- move city-begging, grain-accounting, and medicine-compounding into src/playables packages
- delete the retired application/minigames ownership path for city-begging"
```

## Task 6: Migrate Story Battle, Enforce Editor Diagnostics, And Finish Acceptance

**Files:**
- Create: `src/playables/story-battle/**`
- Modify: `src/core/registry/builtin-playable-shell-registry.ts`
- Modify: `src/modules/script-editor/application/runtime-pack-export.ts`
- Modify: `src/modules/script-editor/application/runtime-pack-import.ts`
- Modify: `src/modules/script-editor/application/workspace-shell.ts`
- Create: `tests/browser-playable-shell-smoke.test.cjs`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/change-log.md`
- Delete: `src/application/playables/story-battle/**`
- Delete: `src/application/story-battle/story-battle-runtime.ts`

- [ ] **Step 1: Write the failing battle/editor/browser acceptance tests**

Add one source guard, one authoring guard, and one browser acceptance test:

```js
test("story battle exists as a canonical shell package", () => {
  const packageRoot = path.join(repoRoot, "src/playables", "story-battle");
  assert.ok(fs.existsSync(path.join(packageRoot, "manifest.ts")));
  assert.ok(fs.existsSync(path.join(packageRoot, "index.ts")));
});

test("script editor diagnostics mention missing playable shell packages", () => {
  const workspaceShellSource = fs.readFileSync(
    path.join(repoRoot, "src/modules/script-editor/application/workspace-shell.ts"),
    "utf8"
  );

  assert.match(workspaceShellSource, /缺少可加载的玩法外壳/);
});
```

Create `tests/browser-playable-shell-smoke.test.cjs` around the retained temple route:

```js
test("huangjue temple playable shell path works end to end", async () => {
  await page.goto("http://127.0.0.1:5173/");
  await page.getByText("皇觉寺").click();
  await page.getByText("抄经").click();
  await page.getByRole("button", { name: /继续|开始|确认/ }).click();
  await page.getByRole("button", { name: /关闭|返回|完成/ }).click();
  await expect(page.getByText("皇觉寺")).toBeVisible();
});
```

- [ ] **Step 2: Run the final failing tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "story battle exists as a canonical shell package|script editor diagnostics mention missing playable shell packages"
node --test tests/browser-playable-shell-smoke.test.cjs
```

Expected:

- `FAIL`
- `story-battle` package root is missing
- no creator-facing shell diagnostic exists yet
- browser smoke is absent or failing on the current retired path

- [ ] **Step 3: Move story battle, add editor fail-closed diagnostics, and record the cleanup**

Create the battle package shell:

```ts
export const storyBattleShell: PlayableShell = {
  manifest: {
    playableId: "story-battle",
    family: "battle",
    commandPrefix: "interactive.story-battle.",
  },
  createSession: createStoryBattleSession,
  reduce: reduceStoryBattleSession,
  present: presentStoryBattleSession,
  complete: completeStoryBattleSession,
};
```

Update editor/export diagnostics so shell-invalid playables are rejected with creator-facing language:

```ts
issues.push({
  level: "error",
  family: "minigames",
  entityId: playable.id,
  message: "缺少可加载的玩法外壳，当前玩法不能导出或运行预览。",
});
```

Add the browser smoke, update `docs/change-log.md`, and delete the retired `application/playables/story-battle` and `application/story-battle` runtime files in the same batch.

- [ ] **Step 4: Run the final targeted verification and full repository checks**

Run:

```bash
npm run lint:plans
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "playable shell|canonical shell package exists|missing playable shell"
npm run typecheck
npm run validate:playables
node --test tests/browser-playable-shell-smoke.test.cjs
npm test
```

Expected:

- `PASS` for `lint:plans`
- `PASS` for targeted robustness guards
- `PASS` for `typecheck`
- `PASS` for `validate:playables`
- `PASS` for browser playable-shell smoke
- `PASS` for the full repository test suite, or a clearly recorded unrelated pre-existing failure if one remains

- [ ] **Step 5: Commit the final-state closeout batch**

Run:

```bash
git add src/playables/story-battle src/core/registry/builtin-playable-shell-registry.ts src/modules/script-editor/application/runtime-pack-export.ts src/modules/script-editor/application/runtime-pack-import.ts src/modules/script-editor/application/workspace-shell.ts tests/browser-playable-shell-smoke.test.cjs tests/robustness.test.cjs docs/change-log.md docs/superpowers/plans/2026-08-02-unified-playable-shell-final-state-enforcement-implementation.md
git rm -r src/application/playables/story-battle
git rm src/application/story-battle/story-battle-runtime.ts
git commit -m "refactor: enforce final-state playable shell loading" -m "Summary:
- migrate story-battle and the remaining builtin playables onto canonical shell packages
- fail closed in runtime and Script Editor when a playable shell is missing
- record the final-state cleanup and browser acceptance coverage"
```

## Exit Check

- [ ] `src/playables/<playable-id>/` is the only runnable implementation root for every builtin playable.
- [ ] `src/core/contracts/playable-host-adapter.ts` and related registries are deleted.
- [ ] `src/main.ts` and `src/core/runtime/playable-runtime.ts` contain no playable-specific business branches or host-adapter loading seams.
- [ ] `tools/scaffold-playable.mjs` and `tools/validate-playables.mjs` enforce the same canonical shell package rule.
- [ ] Script Editor/export/runtime all fail closed when a playable shell is missing or invalid.
- [ ] The retained temple browser route proves launch -> play -> settle -> return through the shared shell path.
- [ ] `docs/change-log.md` records the deleted compatibility/adapter residue.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
- [ ] `npm run lint:plans` recorded

## Child Closeout

- Closed Child: `Unified Playable Shell Final-State Enforcement`
- Parent Task: `Playable final-state shell convergence`
- Parent Stage: `Historical Governance Migration`
- Closeout Status: `waiting`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Choose execution mode and implement this child plan.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-08-02-unified-playable-shell-final-state-enforcement-implementation.md`
- Push Status: `failed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then continue docs/superpowers/plans/2026-08-02-unified-playable-shell-final-state-enforcement-implementation.md from Task 1.`
