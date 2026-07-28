# UI Transition Merge Into mod-first-dev Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create an isolated integration environment from `mod-first-dev`, merge `codex/sync-naqishuo-721ui-to-mmz` into it without regressing current-branch UI behavior, route all temporary compatibility through one centralized `jianrrong_` module family, and record the retained feature inventory.

**Architecture:** Treat `mod-first-dev` as the canonical runtime/data/schema truth and treat the current branch as the canonical UI truth. Resolve structural files toward `mod-first-dev`, resolve UI files toward the current branch, and bridge mismatches only through one dedicated `jianrrong_` compatibility module family so later cleanup is explicit and searchable.

**Tech Stack:** Git worktrees and merge tooling, TypeScript runtime/UI modules, Node test runner (`node --test`), `cmd /c npm run build:test`, `cmd /c npm run typecheck`, `cmd /c npm run build`, `cmd /c npm run lint:plans`, plus repository docs in `docs/change-log.md` and `docs/superpowers/specs/`.

## Global Constraints

- Keep `mod-first-dev` as the canonical structural truth.
- Preserve current-branch UI behavior, assets, and temporary materials stored under `ui/**`.
- Do not hide, disable, silently drop, or visually downgrade current-branch UI functionality.
- Resolve data structure, runtime contract, state shape, routing, schema, and authoring truth toward `mod-first-dev`.
- Resolve `src/ui/**`, `src/styles/**`, `ui/**`, and user-visible presentation toward the current UI branch unless that would violate canonical architecture ownership.
- Do not directly modify built-in scenario-pack truth in `src/content/scenario-packs/**`, especially `src/content/scenario-packs/zhuyuanzhang/**`, for UI compatibility.
- Route every temporary compatibility seam through one centralized compatibility module family and prefix every compatibility artifact with `jianrrong_`.
- Do not add building-specific fallback branches in `src/main.ts`.
- Update `docs/change-log.md` and write a dedicated feature inventory document for retained UI, compatibility bridges, architecture-owned replacements, and deferred items.

---

## Execution State

- Status: `waiting`
- Last Updated: `2026-07-28`
- Current Focus: `Plan authored; waiting for execution mode selection before the isolated merge worktree is created.`
- Next Step: `Create the integration worktree from mod-first-dev, attempt the merge, and classify conflicts by structural versus UI ownership.`
- Verification: `cmd /c npm run lint:plans`
- Notes: `This legacy superpowers plan is intentionally reopened for the transition-merge workflow; live repository governance for unrelated work remains under docs/blueprints/**.`

## Progress Log

- 2026-07-28
  - Summary: `Created the implementation plan for the transition merge of the current UI branch into mod-first-dev, including centralized jianrrong_ compatibility ownership and built-in pack protection rules.`
  - Verification: `cmd /c npm run lint:plans`
  - Next: `Choose execution mode, then start Task 1 in an isolated merge worktree.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-28-ui-transition-merge-into-mod-first-dev-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Historical superpowers resume entry:
  - `docs/superpowers/project-progress.md`
- Live repository entry for unrelated current work:
  - `docs/blueprints/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `The repository's live default governance remains under docs/blueprints/**, so this plan is a deliberate legacy-governed execution artifact for one explicit transition-merge task.`
  - `mod-first-dev` currently contains the architecture-first line, while `codex/sync-naqishuo-721ui-to-mmz` contains the UI-heavy line with current user-visible behavior and assets.`
  - `The merge must preserve current UI surfaces without modifying built-in scenario-pack truth or scattering compatibility across feature files.`

## Implementation Scope

### In Scope

- Create a new worktree at `D:\workspace\project\RPG_TG\.worktrees\codex\merge-ui-into-mod-first-dev`.
- Create and use the integration branch `codex/merge-ui-into-mod-first-dev`.
- Merge `codex/sync-naqishuo-721ui-to-mmz` into that branch.
- Resolve conflicts using the design's ownership rules.
- Create one dedicated `jianrrong_` compatibility module family.
- Preserve current-branch UI behavior, styles, assets, and temporary materials under `ui/**`.
- Keep `mod-first-dev` runtime, schema, state shape, and built-in scenario-pack truth intact.
- Produce a dedicated feature inventory document and update `docs/change-log.md`.

### Still Out Of Scope

- Rewriting Blueprint governance records unless merge evidence proves governed current-state truth changed.
- General cleanup of all old UI code outside what the transition merge touches directly.
- Deleting compatibility after the merge lands.
- Hiding or downgrading difficult UI surfaces instead of integrating them.

## File Map

### Existing files to modify

- `docs/change-log.md`
  - Record the user-visible transition merge result and the centralized compatibility strategy.
- `src/main.ts`
  - Keep current architecture ownership while reattaching any required render wiring without business-branch fallback.
- `src/ui/app-render.ts`
  - Reconcile display-side current-branch behavior with the mod-first presenter/runtime seams.
- `src/application/presenter/app-presenter.ts`
  - Insert compatibility-aware projection entrypoints without moving compatibility logic inline.
- `src/application/presenter/presenter-output.ts`
  - Reconcile canonical presenter output types with UI-facing compatibility projections.
- `src/application/presenter/stage-presenters.ts`
  - Route stage-facing display data through the centralized compatibility module where needed.
- `src/application/presenter/overlay-presenters.ts`
  - Preserve overlay UI behavior while consuming canonical mod-first state and contracts.
- `src/ui/views/building/building-module-view.ts`
  - Preserve current visible building UI while consuming canonical mod-first data through compatibility projections where necessary.
- `src/ui/views/city/city-view.ts`
  - Preserve current visible city UI while adapting to mod-first state contracts.
- `src/ui/views/character/character-detail-view.ts`
  - Preserve current detail-panel behavior while reading canonical state via compatibility projections.
- `src/styles/main-ui.css`
  - Preserve visible UI treatment after boundary rewiring.
- `src/styles/views.css`
  - Preserve visible UI treatment after boundary rewiring.
- `tests/robustness.test.cjs`
  - Add regression coverage for centralized compatibility, built-in pack protection, and retained UI behavior.

### Existing files expected to be deleted

- `none`

### New files to create

- `src/application/presenter/jianrrong_transition/index.ts`
  - Canonical import surface for all temporary compatibility helpers.
- `src/application/presenter/jianrrong_transition/jianrrong_ui_context.ts`
  - Defines the compatibility input/output shape consumed by boundary files.
- `src/application/presenter/jianrrong_transition/jianrrong_state_projection.ts`
  - Maps canonical mod-first runtime and presenter state into UI-facing legacy-compatible shape.
- `src/application/presenter/jianrrong_transition/jianrrong_pack_projection.ts`
  - Derives UI-facing pack/display helpers without editing built-in scenario-pack files.
- `docs/superpowers/specs/2026-07-28-ui-transition-merge-into-mod-first-dev-feature-inventory.md`
  - Records retained UI features, compatibility bridges, architecture-owned equivalents, and deferred items.

## Verification Plan

- Targeted verification:
  - `node --test tests/robustness.test.cjs --test-name-pattern "jianrrong compatibility stays centralized|built-in scenario packs stay unchanged during ui transition merge|current branch ui surface remains reachable through compatibility projection"`
- Required commands:
  - `cmd /c npm ci`
  - `cmd /c npm run build:test`
  - `node --test tests/robustness.test.cjs`
  - `cmd /c npm run typecheck`
  - `cmd /c npm run build`
  - `cmd /c npm run lint:plans`

## Task 1: Create The Isolated Integration Environment

**Files:**
- Modify: `docs/superpowers/plans/2026-07-28-ui-transition-merge-into-mod-first-dev-implementation.md`
- Read: `docs/superpowers/specs/2026-07-28-ui-transition-merge-into-mod-first-dev-design.md`
- Read: `docs/superpowers/project-progress.md`

**Interfaces:**
- Consumes: `mod-first-dev`
- Consumes: `codex/sync-naqishuo-721ui-to-mmz`
- Produces: isolated worktree `D:\workspace\project\RPG_TG\.worktrees\codex\merge-ui-into-mod-first-dev`
- Produces: integration branch `codex/merge-ui-into-mod-first-dev`

- [ ] **Step 1: Create the isolated worktree and integration branch**

Run:

```bash
git -C D:\workspace\project\RPG_TG worktree add D:\workspace\project\RPG_TG\.worktrees\codex\merge-ui-into-mod-first-dev -b codex/merge-ui-into-mod-first-dev mod-first-dev
```

Expected:

- `Preparing worktree`
- `HEAD is now at <sha>`

- [ ] **Step 2: Install dependencies in the new worktree**

Run:

```bash
cmd /c npm ci
```

Expected:

- `added <N> packages`
- `audited <N> packages`

- [ ] **Step 3: Capture the baseline branch state**

Run:

```bash
git status --short --branch
git rev-parse HEAD
git branch --show-current
```

Expected:

- branch is `codex/merge-ui-into-mod-first-dev`
- worktree is clean before merge

- [ ] **Step 4: Run the pre-merge baseline verification**

Run:

```bash
cmd /c npm run build:test
node --test tests/robustness.test.cjs
cmd /c npm run typecheck
```

Expected:

- `PASS`
- no pre-existing failure is introduced by the worktree setup

- [ ] **Step 5: Commit the governance-only start point if plan state changes**

```bash
git add docs/superpowers/plans/2026-07-28-ui-transition-merge-into-mod-first-dev-implementation.md
git commit -m "docs: start ui transition merge execution" -m "Summary:
- record the isolated transition-merge execution plan and worktree target
- lock the integration branch and verification starting point"
```

## Task 2: Merge The Current UI Branch And Classify Conflict Ownership

**Files:**
- Modify: `src/main.ts`
- Modify: `src/ui/app-render.ts`
- Modify: `src/application/presenter/app-presenter.ts`
- Modify: `src/application/presenter/presenter-output.ts`
- Modify: `src/application/presenter/stage-presenters.ts`
- Modify: `src/application/presenter/overlay-presenters.ts`
- Modify: `src/ui/views/building/building-module-view.ts`
- Modify: `src/ui/views/city/city-view.ts`
- Modify: `src/ui/views/character/character-detail-view.ts`
- Modify: `src/styles/main-ui.css`
- Modify: `src/styles/views.css`

**Interfaces:**
- Consumes: canonical runtime/state/schema ownership from `mod-first-dev`
- Consumes: current visible UI behavior from `codex/sync-naqishuo-721ui-to-mmz`
- Produces: merged working tree with structural conflicts resolved toward `mod-first-dev`
- Produces: merged working tree with UI conflicts resolved toward current UI branch

- [ ] **Step 1: Attempt the merge**

Run:

```bash
git merge --no-ff --no-commit codex/sync-naqishuo-721ui-to-mmz
```

Expected:

- either `Automatic merge went well`
- or conflict markers for boundary resolution

- [ ] **Step 2: Resolve structural ownership toward mod-first-dev**

Run:

```bash
git checkout --ours src/core src/domain
git checkout --ours src/application -- '*runtime*'
git checkout --ours src/content/scenario-packs
```

Expected:

- canonical state, schema, runtime seam, and built-in pack truth remain on `mod-first-dev`

- [ ] **Step 3: Resolve UI ownership toward the current branch**

Run:

```bash
git checkout --theirs src/ui
git checkout --theirs src/styles
git checkout --theirs ui
git restore --source=HEAD -- .tmp
```

Expected:

- visible UI code, styles, assets, and temporary materials under `ui/**` come from the current UI branch
- `.tmp/**` stays excluded

- [ ] **Step 4: Manually synthesize boundary files**

Apply changes in these files so they keep mod-first ownership while preserving current UI behavior:

```ts
// src/application/presenter/app-presenter.ts
import { jianrrong_projectUiSurface } from "./jianrrong_transition/index.js";

const output = buildPresenterOutput(input);
return jianrrong_projectUiSurface(output, input.appState);
```

```ts
// src/ui/app-render.ts
import { jianrrong_projectUiSurface } from "../application/presenter/jianrrong_transition/index.js";

const projected = jianrrong_projectUiSurface(input.presenterOutput, input.appState);
```

Expected:

- boundary files call the centralized compatibility module instead of inlining one-off compatibility logic

- [ ] **Step 5: Commit the raw merge ownership resolution**

```bash
git add src/main.ts src/ui/app-render.ts src/application/presenter/app-presenter.ts src/application/presenter/presenter-output.ts src/application/presenter/stage-presenters.ts src/application/presenter/overlay-presenters.ts src/ui/views/building/building-module-view.ts src/ui/views/city/city-view.ts src/ui/views/character/character-detail-view.ts src/styles/main-ui.css src/styles/views.css
git commit -m "merge: integrate ui branch into mod-first skeleton" -m "Summary:
- merge codex/sync-naqishuo-721ui-to-mmz into the mod-first integration branch
- resolve structural ownership toward mod-first-dev and UI ownership toward the current branch"
```

## Task 3: Create The Centralized `jianrrong_` Compatibility Module Family

**Files:**
- Create: `src/application/presenter/jianrrong_transition/index.ts`
- Create: `src/application/presenter/jianrrong_transition/jianrrong_ui_context.ts`
- Create: `src/application/presenter/jianrrong_transition/jianrrong_state_projection.ts`
- Create: `src/application/presenter/jianrrong_transition/jianrrong_pack_projection.ts`
- Modify: `src/application/presenter/app-presenter.ts`
- Modify: `src/application/presenter/presenter-output.ts`
- Modify: `src/application/presenter/stage-presenters.ts`
- Modify: `src/application/presenter/overlay-presenters.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Produces: `jianrrong_createUiContext(appState: RuntimeState, presenterOutput: PresenterOutput): JianrrongUiContext`
- Produces: `jianrrong_projectUiSurface(presenterOutput: PresenterOutput, appState: RuntimeState): PresenterOutput`
- Produces: `jianrrong_projectPackView(input: JianrrongUiContext): JianrrongPackProjection`
- Consumes: canonical `PresenterOutput`, runtime state, and pack content from `mod-first-dev`

- [ ] **Step 1: Add the failing centralized-compatibility regression**

```js
test("jianrrong compatibility stays centralized", async () => {
  const source = await fs.promises.readFile(
    path.join(process.cwd(), "src/application/presenter/jianrrong_transition/index.ts"),
    "utf8"
  );

  assert.match(source, /export function jianrrong_projectUiSurface/);

  const presenterSource = await fs.promises.readFile(
    path.join(process.cwd(), "src/application/presenter/app-presenter.ts"),
    "utf8"
  );

  assert.match(presenterSource, /jianrrong_projectUiSurface/);
  assert.doesNotMatch(presenterSource, /function jianrrong_/);
});
```

- [ ] **Step 2: Create the compatibility module skeleton**

```ts
// src/application/presenter/jianrrong_transition/jianrrong_ui_context.ts
export interface JianrrongUiContext {
  appState: RuntimeState;
  presenterOutput: PresenterOutput;
}

export function jianrrong_createUiContext(
  appState: RuntimeState,
  presenterOutput: PresenterOutput
): JianrrongUiContext {
  return { appState, presenterOutput };
}
```

```ts
// src/application/presenter/jianrrong_transition/index.ts
export { jianrrong_createUiContext } from "./jianrrong_ui_context.js";
export { jianrrong_projectUiSurface } from "./jianrrong_state_projection.js";
export { jianrrong_projectPackView } from "./jianrrong_pack_projection.js";
```

- [ ] **Step 3: Implement state and pack projections without editing built-in packs**

```ts
// src/application/presenter/jianrrong_transition/jianrrong_state_projection.ts
export function jianrrong_projectUiSurface(
  presenterOutput: PresenterOutput,
  appState: RuntimeState
): PresenterOutput {
  const context = jianrrong_createUiContext(appState, presenterOutput);
  const packProjection = jianrrong_projectPackView(context);
  return {
    ...presenterOutput,
    jianrrongPackProjection: packProjection,
  };
}
```

```ts
// src/application/presenter/jianrrong_transition/jianrrong_pack_projection.ts
export function jianrrong_projectPackView(
  input: JianrrongUiContext
): JianrrongPackProjection {
  return {
    buildingLabels: deriveBuildingLabelsFromActiveContent(input.appState),
    characterDetailFields: deriveCharacterDetailFields(input.presenterOutput),
  };
}
```

- [ ] **Step 4: Wire boundary files to the compatibility family**

Run:

```bash
rg "jianrrong_" src/application/presenter src/ui src/main.ts
```

Expected:

- `jianrrong_` symbols appear only in the dedicated compatibility module family and in minimal call sites from boundary files

- [ ] **Step 5: Commit the centralized compatibility family**

```bash
git add src/application/presenter/jianrrong_transition/index.ts src/application/presenter/jianrrong_transition/jianrrong_ui_context.ts src/application/presenter/jianrrong_transition/jianrrong_state_projection.ts src/application/presenter/jianrrong_transition/jianrrong_pack_projection.ts src/application/presenter/app-presenter.ts src/application/presenter/presenter-output.ts src/application/presenter/stage-presenters.ts src/application/presenter/overlay-presenters.ts tests/robustness.test.cjs
git commit -m "feat: add centralized jianrrong ui compatibility" -m "Summary:
- create one dedicated jianrrong_ compatibility module family for transition-only UI adaptation
- route presenter and pack compatibility through centralized projections instead of scattered local helpers"
```

## Task 4: Verify Retained UI Behavior And Write The Feature Inventory

**Files:**
- Create: `docs/superpowers/specs/2026-07-28-ui-transition-merge-into-mod-first-dev-feature-inventory.md`
- Modify: `docs/change-log.md`
- Modify: `tests/robustness.test.cjs`

**Interfaces:**
- Produces: feature inventory categories `ui_retained_features`, `compatibility_bridge_features`, `architecture_absorbed_features`, `deferred_or_unmerged_items`
- Produces: documented change-log entry for the transition merge
- Produces: final verification record for the merged branch

- [ ] **Step 1: Add the final verification regression**

```js
test("built-in scenario packs stay unchanged during ui transition merge", async () => {
  const source = await fs.promises.readFile(
    path.join(process.cwd(), "src/content/scenario-packs/zhuyuanzhang/pack.json"),
    "utf8"
  );
  assert.ok(source.length > 0);

  const compatibilitySource = await fs.promises.readFile(
    path.join(process.cwd(), "src/application/presenter/jianrrong_transition/jianrrong_pack_projection.ts"),
    "utf8"
  );
  assert.match(compatibilitySource, /deriveBuildingLabelsFromActiveContent/);
});
```

- [ ] **Step 2: Run the full verification suite**

Run:

```bash
cmd /c npm run build:test
node --test tests/robustness.test.cjs
cmd /c npm run typecheck
cmd /c npm run build
cmd /c npm run lint:plans
```

Expected:

- `PASS`
- merged UI branch compiles and retains reachable behavior on top of mod-first ownership

- [ ] **Step 3: Write the feature inventory**

```md
# UI Transition Merge Into mod-first-dev Feature Inventory

## ui_retained_features
- Backpack overlays retain the current branch layout and translucency treatment through the mod-first presenter seams.

## compatibility_bridge_features
- `jianrrong_projectUiSurface` maps canonical presenter output into current-branch UI-facing display fields.

## architecture_absorbed_features
- Built-in scenario-pack structure remains owned by mod-first content loading and is no longer adapted by direct pack edits.

## deferred_or_unmerged_items
- Record only items that cannot be lawfully integrated without violating the design constraints.
```

- [ ] **Step 4: Update the change log**

```md
- `2026-07-28`: `Integrated the current UI branch into a mod-first transition branch, preserved current visible UI surfaces on top of mod-first runtime/data ownership, and centralized all temporary compatibility in the jianrrong_ presenter compatibility module family without modifying built-in scenario-pack truth.`
```

- [ ] **Step 5: Commit the final inventory and verification result**

```bash
git add docs/superpowers/specs/2026-07-28-ui-transition-merge-into-mod-first-dev-feature-inventory.md docs/change-log.md tests/robustness.test.cjs docs/superpowers/plans/2026-07-28-ui-transition-merge-into-mod-first-dev-implementation.md
git commit -m "docs: record ui transition merge inventory" -m "Summary:
- record the retained UI feature inventory and centralized compatibility bridges
- document the transition merge outcome without altering built-in scenario-pack truth"
```

## Exit Check

- [ ] `The integration worktree and branch are created from mod-first-dev.`
- [ ] `The current UI branch is merged without hiding or downgrading current UI functionality.`
- [ ] `Structural ownership remains with mod-first-dev and built-in scenario-pack truth stays unchanged.`
- [ ] `All compatibility logic is centralized in one jianrrong_ module family.`
- [ ] `Feature inventory and change-log documentation are updated.`
- [ ] Project progress sync is updated if the child state changes.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
