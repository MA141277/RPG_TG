# Mod-First-Dev Residual Intent Backfill Design

## Goal

Backfill the still-valid intent from the remaining `origin/mod-first-dev` residual commits into the current `merage-mod2ui-1` architecture without reviving the old owner graph, deleted files, or retired compatibility seams.

This design intentionally does **not** treat commit parity as the goal. The goal is:

- keep the current branch architecture authoritative
- identify which residual intent is still missing
- implement only the missing intent in the current owner structure

The residual intent inventory is:

1. playable registry / browser-safe bootstrap intent
2. authored navigation routed through runtime intent
3. AI collaboration governance intent

Only the first two are implementation lines in this design. The third is treated as an existing-governance coverage confirmation item, not as a default code workstream.

## Hard Constraints

- Do not cherry-pick the old commits as-is.
- Do not restore deleted legacy owner files just to satisfy old patches.
- Do not reintroduce retired route or navigation shapes such as old direct navigation mutations, `closeBuilding`, or other pre-runtime navigation shortcuts.
- Do not expand `src/main.ts` with new feature business logic.
- Do not undo the current script-editor package boundary work.
- Keep startup-chain behavior frozen unless this work proves a real runtime regression.
- Keep review-system work paused; this design must not reopen the `D` line.
- If a residual intent is already covered by later current-branch work, record that explicitly instead of manufacturing new implementation.

## Current Branch Context

### 1. Commit parity and intent parity are no longer the same

The remaining `origin/mod-first-dev` commits that are not present on the current branch are:

- `38213b34` `fix: make playable registries browser safe`
- `7dd7da11` `fix: route authored navigation through runtime`
- `4bef6cfb` `docs: add AI collaboration governance`

Directly cherry-picking them is no longer the right operation because the current branch has already moved the owner graph forward:

- runtime continuation and navigation entry seams were later refactored on the current branch
- script-editor boundaries were later hard-cut on the current branch
- AI governance already landed later on the current branch as a different but stronger repository entry rule

### 2. Residual intent still matters

Even though the old commit shapes are stale, two signals show that some intent may still need current-branch backfill:

- `src/core/registry/builtin-playable-definition-registry.ts` still carries a mixed canonical surface:
  - `activity-qte` and `city-begging` still advertise `interactive.*` command prefixes
  - `building-flow` still appears in the builtin definition file
- current tests already expect a more canonical playable shape:
  - shell-backed playables should not force definition registries to import shell modules
  - `activity-qte` / `temple-copy-scripture` should be represented through canonical playable definitions
  - runtime-preview registry setup should stay browser-safe

On the navigation side, the current branch already contains later work such as:

- `923a55a6` `refactor: converge runtime continuation dispatch seams`
- `aaad59af` `refactor: route navigation event entry through dispatch`

but the unmerged old navigation commit indicates there may still be residual authored route/export/runtime seams that were never rechecked after those later refactors.

### 3. AI governance is already present

The current branch already contains:

- `docs/ai-collaboration-governance.md`
- `tests/ai-collaboration-governance.test.cjs`
- repository entry wiring through `AGENTS.md`

Therefore the AI governance line should be treated as:

- coverage confirmation
- evidence synchronization if needed
- no default implementation batch unless a concrete gap is proven

## Problem Statement

The current branch risks keeping a false sense of completion if it treats “old commits are stale” as equivalent to “their intent is fully covered.”

The real problem is narrower:

1. determine whether the current branch still has missing **playable registry / browser-safe** intent
2. determine whether the current branch still has missing **authored navigation through runtime** intent
3. confirm that **AI governance** is already covered by later current-branch work

The solution must operate on the current owner graph rather than attempting to reconstruct the old one.

## Chosen Approach

Use a two-line implementation design plus one confirmation note:

1. **Implementation Line A:** playable registry / browser-safe intent backfill
2. **Implementation Line B:** authored navigation through runtime intent backfill
3. **Coverage Confirmation:** AI governance already covered by later repository governance

This is intentionally not a “merge the old residual branch” design. It is a “backfill residual intent into the current architecture” design.

## Design Line A: Playable Registry / Browser-Safe Backfill

### Intent To Preserve

The old residual commit carried two valid principles:

- runtime preview and playable registry bootstrap must be browser-safe
- builtin playable definition ownership must not depend on shell import cycles

Those principles remain valid in the current branch.

### Current Risk Shape

The current branch appears to have a split between:

- tests that already expect canonical shell-backed playable definitions
- source files that still advertise mixed legacy prefixes or stale builtin families

This means the branch may currently be “functionally passing in many places” while still holding inconsistent playable registry ownership.

### Required Outcome

After this line:

- builtin playable definition ownership must reflect the current canonical playable family only
- stale builtin `building-flow` exposure must not remain in the builtin definition surface
- shell-backed playables must not require definition-registry shell imports to resolve canonical ids/prefixes
- runtime preview / activated playable registry setup must remain browser-safe in the current architecture
- no old `require()`-style browser-hostile runtime bootstrap path may remain in the affected registry setup

### Boundary Rules

Allowed owners for this line include:

- `src/core/registry/builtin-playable-definition-registry.ts`
- `src/core/runtime/playable-runtime-registries.ts`
- `src/core/registry/builtin-playable-shell-registry.ts`
- adjacent playable registry contracts or tests if required by the current branch architecture

Disallowed moves:

- do not recreate old registry helper files only because they existed on `mod-first-dev`
- do not downgrade the current script-editor playable catalog boundaries
- do not widen this line into a general playable-runtime rewrite

### Expected Verification

At minimum, this line must prove:

- registry setup remains browser-safe for runtime preview
- builtin playable definition source no longer advertises retired builtin families
- canonical shell-backed playables still launch and settle correctly

## Design Line B: Authored Navigation Through Runtime Backfill

### Intent To Preserve

The old residual navigation commit carried one valid architectural rule:

- authored navigation should resolve through runtime navigation seams instead of feature-local or shell-local direct mutation

That rule is already reflected by current governance, but it still needs a current-branch residual audit because later refactors may have left partial seams behind.

### Current Risk Shape

The current branch already moved navigation entry and continuation routing forward, but the old commit collided with files that were later deleted or replaced. That means:

- the old patch shape is obsolete
- the old architectural concern may still partially exist under new owners

The risk is not “missing the exact old file edits.” The risk is:

- a remaining authored route path still bypasses the current runtime seam
- export/materialization still emits a retired route shape
- a fallback owner still mutates navigation state directly

### Required Outcome

After this line:

- authored navigation must resolve through the current runtime navigation seam
- no current authored export path should emit retired direct-navigation route shapes
- event/story/building/playable follow-up paths covered by this line must not bypass navigation runtime
- any remaining shell-level or feature-local direct navigation mutation in the covered surface must be retired or intentionally documented as out of scope

### Boundary Rules

Allowed owners for this line include:

- `src/core/runtime/navigation-runtime.ts`
- `src/core/runtime/event-binding-runtime.ts`
- `src/application/building/building-container-event-runtime.ts`
- `src/application/story/story-runtime.ts`
- `src/modules/script-editor/application/runtime-pack-export.ts`
- `src/domain/event.ts`
- scenario data/tests only where the current authored route contract genuinely requires it

Disallowed moves:

- do not restore deleted legacy files such as old event-route dispatch helpers purely to satisfy historical patch shape
- do not move navigation business logic back into `src/main.ts`
- do not reopen startup or review-system work through this line

### Expected Verification

At minimum, this line must prove:

- current authored navigation routes resolve through runtime on the covered paths
- export/runtime-preview no longer emit or depend on retired direct-navigation authored shapes
- the later current-branch dispatch seams still pass after the backfill

## AI Governance Coverage Confirmation

This design does **not** open a third implementation line for AI governance.

Instead, implementation must confirm that the current branch already covers the residual governance intent through:

- `docs/ai-collaboration-governance.md`
- `AGENTS.md`
- `tests/ai-collaboration-governance.test.cjs`

Allowed outcomes:

- record “already covered; no implementation needed”
- or, if a concrete gap is found, record it as a small follow-up adjustment inside the existing governance surface

Disallowed outcome:

- inventing new governance work merely to make the residual commit look merged in spirit

## Non-Goals

This design does not:

- make the current branch commit-identical to `origin/mod-first-dev`
- reopen source-unification work
- reopen startup-chain work
- reopen review-system work
- restore historical blueprint queue files that the current branch intentionally deleted
- perform a broad playable-runtime architecture rewrite
- perform a broad event-router migration beyond the bounded authored-navigation residual audit

## Expected File Impact

### Likely implementation files

- `src/core/registry/builtin-playable-definition-registry.ts`
- `src/core/runtime/playable-runtime-registries.ts`
- `src/core/registry/builtin-playable-shell-registry.ts`
- `src/core/runtime/navigation-runtime.ts`
- `src/core/runtime/event-binding-runtime.ts`
- `src/application/building/building-container-event-runtime.ts`
- `src/application/story/story-runtime.ts`
- `src/modules/script-editor/application/runtime-pack-export.ts`
- `src/domain/event.ts`

### Likely verification files

- `tests/activity-qte-shell-runtime.test.cjs`
- `tests/temple-copy-scripture-shell-runtime.test.cjs`
- `tests/event-flow-playable-runtime.test.cjs`
- one or more current navigation/runtime regression suites
- `tests/ai-collaboration-governance.test.cjs` only if governance confirmation finds a real coverage gap

### Likely documentation sync

- `docs/change-log.md`
- current owner plan / queue docs only if implementation materially changes runtime ownership or verification state

## Verification Strategy

### For Line A

- targeted playable-registry/browser-safe tests
- targeted shell-backed playable runtime tests
- build/test compilation guard sufficient for the touched registry surface

### For Line B

- targeted navigation/runtime route tests
- targeted export/runtime-preview route-shape checks if authoring/export code changes
- regression checks around the current dispatch seams already landed on the branch

### For Governance Confirmation

- static confirmation of existing doc + AGENTS + focused governance test coverage

## Success Criteria

This design is complete when all of the following are true:

1. the current branch no longer has an unresolved playable-registry/browser-safe residual gap relative to its own architecture
2. the current branch no longer has an unresolved authored-navigation-through-runtime residual gap on the audited current-path surface
3. AI governance residual intent is explicitly confirmed as already covered, or a concrete minimal gap is documented and fixed
4. none of the old residual commits needed to be resurrected in their historical file/owner shape

## Failure Conditions

The implementation should be considered wrong if it does any of the following:

- restores deleted legacy runtime or queue files
- expands `src/main.ts` with new business routing
- reopens review-system or startup work without a fresh runtime regression
- changes the current script-editor package boundary for reasons unrelated to the residual intent
- optimizes for “old commit parity” instead of “current-architecture intent parity”
