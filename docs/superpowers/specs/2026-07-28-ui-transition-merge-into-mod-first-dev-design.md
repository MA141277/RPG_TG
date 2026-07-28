# UI Transition Merge Into mod-first-dev Design

## Status

- Status: `proposed`
- Date: `2026-07-28`
- Owner: `Codex`
- Scope: `Creates an isolated transition-merge environment that integrates the current UI-focused branch into mod-first-dev while keeping mod-first-dev as the canonical data and runtime architecture, preserving current-branch UI behavior and assets, and recording retained features plus temporary compatibility bridges.`

---

## 1. Purpose

The repository currently has two divergent lines of work:

- `mod-first-dev` as the architecture / runtime / schema branch
- `codex/sync-naqishuo-721ui-to-mmz` as the UI-heavy branch with visible interface work, assets, and temporary materials

The requested work is not a blind merge.

It is a transition merge with explicit ownership rules:

- architecture and data truth stay with `mod-first-dev`
- UI truth stays with the current UI branch
- incompatibilities are handled through removable compatibility bridges rather than by rolling back the new architecture

The result should be a dedicated integration environment that can be used to reconcile the two lines safely and produce a clear inventory of what UI-facing functionality was retained, adapted, replaced, or deferred.

---

## 2. Requested Outcome

1. Create an isolated worktree-based merge environment rooted on `mod-first-dev`.
2. Create a dedicated integration branch for the transition merge rather than working directly on either source branch.
3. Merge the current UI branch into that integration branch.
4. Resolve conflicts with these priorities:
   - data structure, runtime contracts, state shape, routing, schema, authoring truth: `mod-first-dev`
   - UI views, styles, presenter-facing view output, formal assets, temporary materials: current UI branch
5. Handle unsupported UI dependencies through explicit compatibility bridges instead of restoring legacy architecture.
6. Require every compatibility bridge to use the `jianrrong_` prefix so future cleanup can be systematic.
7. Produce a written feature inventory that distinguishes:
   - retained UI capabilities
   - compatibility bridges
   - architecture-owned equivalent replacements
   - deferred / intentionally unmerged items

---

## 3. Design Goals

1. Keep `mod-first-dev` as the canonical structural truth.
2. Preserve the current branch's user-visible UI behavior wherever it can be reattached safely.
3. Prevent UI retention from reintroducing retired runtime ownership or legacy state shape.
4. Make all compatibility seams easy to locate and delete later.
5. Record merge outcomes in a way that supports later cleanup work instead of hiding temporary decisions.
6. Prohibit hiding or downgrading current-branch UI functionality as a shortcut for merge completion.

---

## 4. Non-Goals

- rewriting `mod-first-dev` back toward the old UI branch data model
- using `src/main.ts` as a dumping ground for temporary business re-branches
- preserving `.tmp/**`, runtime caches, logs, review bundles, or other non-shipping process artifacts
- directly editing built-in scenario-pack content in `mod-first-dev`, especially `zhuyuanzhang`, just to satisfy old UI expectations
- hiding, disabling, silently dropping, or visually downgrading current-branch UI functionality because integration is difficult
- pretending compatibility code is permanent architecture
- treating this transition merge as the final cleanup pass for all technical debt

Temporary materials that live under the real UI asset tree remain in scope.

Temporary process outputs do not.

---

## 5. Canonical Branch Roles

### 5.1 `mod-first-dev`

This branch owns:

- runtime architecture
- state shape
- contracts and seams
- authoring / import / export structure
- canonical routing and runtime ownership

During conflict resolution, this branch remains the source of truth for all structural behavior.

### 5.2 Current UI Branch

The current UI branch owns:

- visible UI layout and composition
- view-layer interaction presentation
- style-layer choices
- retained UI-facing assets
- temporary materials stored under formal UI asset locations

During conflict resolution, this branch remains the source of truth for what the user should continue seeing and interacting with unless it contradicts the new canonical architecture.

### 5.3 Integration Branch

The integration branch is transitional.

It exists to:

- combine the two truth sources safely
- host explicit compatibility bridges
- document what survived the merge and what changed

It is not a new independent product direction.

---

## 6. Merge Environment Design

The merge must happen in a dedicated isolated worktree created from the repository-local worktree area.

Recommended branch shape:

- base: `mod-first-dev`
- integration branch: `codex/merge-ui-into-mod-first-dev`

The merge workflow is:

1. create isolated worktree from `mod-first-dev`
2. create integration branch from that base
3. merge the current UI branch into the integration branch
4. resolve conflicts by ownership category
5. run project verification
6. document retained and transitional functionality

This environment must remain separate from the already-created UI-branch worktree so conflict resolution and testing stay reproducible.

---

## 7. File Ownership Rules

### 7.1 Prefer `mod-first-dev`

These categories remain architecture-owned and should normally resolve toward `mod-first-dev`:

- `src/core/**`
- `src/domain/**`
- runtime coordinators and runtime seams
- authoring schema and format files
- import / export / loader contracts
- state creation and state migration code
- gameplay routing and settlement ownership

### 7.2 Prefer Current UI Branch

These categories remain UI-owned and should normally resolve toward the current UI branch:

- `src/ui/**`
- `src/styles/**`
- `ui/**`
- view presentation details
- temporary materials stored in the formal UI asset tree

### 7.3 Require Manual Synthesis

These categories are boundary files and should be merged manually rather than by directory-wide side selection:

- `src/application/presenter/**`
- `src/ui/app-render.ts`
- `src/main.ts`
- presenter-facing app output seams
- UI-oriented coordinators or view-model translation files

For these files, the structural side must keep the `mod-first-dev` ownership model while the display behavior should preserve the current UI branch result wherever possible.

---

## 8. Compatibility Bridge Design

### 8.1 When Compatibility Is Allowed

Compatibility is allowed only when:

- the current UI expects an older field, shape, or access path
- `mod-first-dev` has changed the canonical structure
- the UI behavior still needs to remain visible in this transition merge

Compatibility is therefore required whenever preserving current UI behavior would otherwise tempt the merge to hide, disable, or downgrade that behavior.

### 8.2 Compatibility Rule

Compatibility must adapt UI expectations to the new architecture.

Compatibility must not mutate the architecture back toward the old shape.
Compatibility must not rewrite built-in scenario-pack truth just to preserve old UI behavior.
Compatibility must be centralized in a dedicated compatibility module family rather than scattered across unrelated feature files.

Allowed examples:

- adapter readers that map old UI expectations to new state partitions
- translator functions that reshape presenter output for older view assumptions
- bridge functions that route legacy UI actions through new runtime seams
- transition-layer readers that derive UI-facing fields from canonical built-in pack data without editing the built-in pack itself

Disallowed examples:

- restoring deleted runtime ownership paths
- reviving old direct business branching in `main.ts`
- duplicating canonical state just to satisfy an old UI caller
- editing `src/content/scenario-packs/zhuyuanzhang/**` as a shortcut for UI compatibility
- scattering compatibility helpers across presenter, runtime, and view files without a centralized compatibility ownership point

### 8.3 Naming Rule

Every compatibility seam introduced by this transition merge must use the prefix:

- `jianrrong_`

This applies to the compatibility artifact's visible identifier, such as:

- file names
- exported functions
- adapter objects
- compatibility markers in code comments where needed

The purpose is explicit cleanup traceability.

### 8.4 Centralized Compatibility Module Rule

Transition compatibility must live in a dedicated compatibility module family with clear ownership rather than being embedded opportunistically in unrelated files.

That means:

- compatibility readers should be grouped in one dedicated compatibility area
- compatibility mappers should be imported from that area rather than re-authored inline
- boundary files should call into the compatibility module instead of carrying one-off compatibility logic directly

Small call sites in boundary files are acceptable.

The compatibility logic itself must remain centralized.

### 8.5 Removal Traceability

Each compatibility bridge must be written so future cleanup can answer:

1. which old UI dependency required it
2. which `mod-first-dev` canonical contract it targets
3. what UI rewrite condition would let it be deleted

That traceability may live in succinct code comments plus the feature inventory document.

---

## 9. Asset Retention Rules

### 9.1 Keep

Keep:

- formal UI assets under `ui/**`
- temporary materials that live under the formal UI asset tree and are still part of the UI branch surface
- styles and render-layer assets needed to preserve the current user-visible UI

### 9.2 Exclude

Exclude:

- `.tmp/**`
- logs
- browser profile caches
- generated runtime caches
- review package diffs
- process-only screenshots or ledgers outside the formal retained asset tree

The key distinction is:

- retained UI materials stay
- process residue does not

---

## 10. Built-In Scenario Pack Protection Rule

`mod-first-dev` built-in scenario packs remain canonical content truth during this transition merge.

This is a hard rule for:

- `src/content/scenario-packs/**`
- especially `src/content/scenario-packs/zhuyuanzhang/**`

If a retained UI surface needs:

- renamed fields
- reshaped data
- derived display helpers
- compatibility-only menu or label shaping

the adjustment must happen in a transition-layer adapter, presenter mapper, or `jianrrong_` compatibility seam.

It must not happen by directly changing built-in pack authored content unless there is an independent content-authoring reason unrelated to UI compatibility.

---

## 11. Conflict Resolution Rules

### 11.1 Structural Conflicts

When a conflict changes:

- state shape
- schema
- routing ownership
- runtime lifecycle
- import / export truth

resolve toward `mod-first-dev`.

If UI code relied on the older form, add a `jianrrong_` bridge.

### 11.2 UI Conflicts

When a conflict changes:

- visible screen composition
- styles
- asset references
- presenter-consumed display behavior
- front-end interaction affordances

resolve toward the current UI branch unless doing so would violate the new structural ownership model.

### 11.3 Boundary Conflicts

When a conflict sits at the architecture/UI seam, the correct result is usually hybrid:

- keep `mod-first-dev` contract ownership
- keep current UI display result
- connect them with either direct adaptation or a `jianrrong_` bridge

### 11.4 No Hide / No Downgrade Rule

Current-branch UI functionality that exists before the transition merge must not be:

- hidden
- disabled
- silently dropped
- replaced with a weaker placeholder flow
- visually downgraded as a shortcut for avoiding integration work

If the preserved UI depends on old structure, the correct response is to route that dependency through the centralized `jianrrong_` compatibility module family.

---

## 12. Documentation Outputs

### 12.1 Required

The merge work must update:

- `docs/change-log.md`

because the transition merge changes user-visible behavior, compatibility state, and cross-module integration.

### 12.2 Feature Inventory

The merge work must also produce a dedicated written inventory of transition results.

Recommended document categories:

1. `ui_retained_features`
2. `compatibility_bridge_features`
3. `architecture_absorbed_features`
4. `deferred_or_unmerged_items`

This inventory is part of the deliverable, not an optional note.

### 12.3 Blueprint Governance Note

Blueprint-governed docs should only be updated if the work changes active governance truth rather than merely producing code integration under existing truth.

This merge should not casually rewrite Blueprint execution records.

If implementation evidence later proves the merge changes governed current-state truth, governance updates must be routed deliberately at that time.

---

## 13. Feature Inventory Method

The requested "new feature inventory" should not be inferred from commit count alone.

It should be built from three inputs:

1. branch-level diff inspection
2. merge-result inspection
3. actual post-merge retained behavior

The inventory should be grouped by user-facing module, especially:

- backpack / overlay / panel UI
- city and building interface surfaces
- character detail and presentation
- entry rendering and transition visuals
- asset and temporary-material retention
- any interaction that now depends on `jianrrong_` adaptation

Each listed item should say whether it is:

- directly retained
- retained through compatibility
- replaced by architecture-owned equivalent behavior
- deferred for later follow-up

---

## 14. Verification Strategy

At minimum, the transition merge should verify:

1. dependencies install in the isolated worktree
2. test baseline still runs after merge resolution
3. the merged branch compiles and renders
4. retained UI surfaces remain reachable
5. compatibility bridges do not introduce structural regressions in the runtime-owned code

The exact command set can be finalized in planning, but verification cannot stop at a clean merge.

A conflict-free git state without runtime verification is not sufficient proof.

---

## 15. Risks

### 15.1 Hidden UI-Architecture Coupling

The current UI branch likely contains behavioral assumptions embedded in presenter and runtime-adjacent files, not only in `src/ui/**`.

This makes boundary synthesis the main risk area.

### 15.2 False UI Preservation

If a file is taken from the UI branch wholesale, it may appear visually correct while secretly bypassing `mod-first-dev` ownership boundaries.

That is not an acceptable resolution.

### 15.3 Compatibility Drift

If compatibility seams are scattered or unnamed, they will become permanent by accident.

The `jianrrong_` prefix is therefore mandatory and not cosmetic.

### 15.4 Asset Noise

The UI branch includes many non-code artifacts.

Without an explicit keep/exclude rule, the merge can easily absorb noise and make later cleanup harder.

### 15.5 Built-In Pack Drift

If UI compatibility is solved by editing built-in scenario-pack content, the transition merge will silently corrupt the architecture branch's canonical content truth.

That would make later cleanup ambiguous and hide whether a behavior came from:

- real authored content
- UI-only compatibility behavior
- accidental merge fallout

The merge must therefore keep built-in pack truth intact and push compatibility upward into explicit transition seams.

### 15.6 Compatibility Sprawl

If compatibility is implemented file-by-file wherever breakage appears, the repository will gain hidden transitional logic that is hard to audit and even harder to delete.

The merge must therefore prefer one explicit compatibility module family with `jianrrong_` ownership rather than many local patches.

### 15.7 Shortcut Regression Through UI Downgrade

If merge pressure leads to hiding or weakening current UI functionality, the repository will appear integrated while actually losing user-visible behavior.

That would violate the requested transition goal.

The merge must therefore treat compatibility implementation as mandatory work, not optional polish, whenever the alternative would be UI regression.

---

## 16. Recommended Execution Direction

The recommended execution order is:

1. create isolated integration worktree from `mod-first-dev`
2. create the dedicated integration branch
3. attempt the merge of the current UI branch
4. classify conflicts by structural / UI / boundary ownership
5. resolve structural files toward `mod-first-dev`
6. resolve UI files toward the current UI branch
7. create a dedicated `jianrrong_` compatibility module family and route all temporary UI-structure adaptation through it
8. run verification
9. write the feature inventory and update `docs/change-log.md`

This sequence preserves architectural truth while making UI retention explicit and auditable.
