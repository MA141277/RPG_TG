# Mod-First-Dev Residual Intent Backfill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Backfill the still-valid residual intent from the three unmerged `origin/mod-first-dev` commits into the current `merage-mod2ui-1` architecture without reviving stale owner files, retired route shapes, or old script-editor/runtime seams.

**Architecture:** Execute this child in three bounded lines. Line A audits and backfills the current playable registry/browser-safe intent in-place on the current runtime/catalog structure. Line B audits and backfills authored navigation so covered runtime/event/export paths route through the current navigation-runtime seam. Line C is governance confirmation only: prove the AI collaboration governance intent is already covered by the stronger current-branch entry rules, and only patch it if a real gap is found.

**Tech Stack:** TypeScript runtime/core registries, Script Editor runtime/export seams, scenario-pack event JSON, Node test runner, `pnpm run build:test`, targeted `node --test`, `pnpm run typecheck`, `pnpm run build`, `pnpm run lint:plans`, `git diff --check`.

## Execution State

- Status: `closed`
- Last Updated: `2026-08-08`
- Current Focus: `Residual intent backfill is implemented, verified, committed, and pushed. Governance state is synchronized so the branch returns to the canonical no-child state until the next approved stabilization child is opened.`
- Next Step: `Open docs/superpowers/project-progress.md and start the next approved child only when the user selects one. Startup remains frozen and review-system work stays paused unless explicitly resumed.`
- Verification: `Spec committed as 78d172a4. Implementation landed in 5d99cecd and branch push reached 874605fe. Task 1-3 verification passed with npm run build:test; node --test tests/script-editor-playable-catalog.test.cjs tests/script-editor-host-contract.test.cjs tests/playable-runtime-registries.test.cjs tests/navigation-runtime-access.test.cjs tests/event-binding-start-runtime.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/zhuyuanzhang-source-unification.test.cjs tests/ai-collaboration-governance.test.cjs; npm run typecheck; npm run build; npm run lint:plans; git diff --check. Governance closeout sync will additionally require clean plan lint and diff checks.`
- Notes: `This child intentionally targets intent parity, not old commit parity. Do not restore deleted runtime/navigation helper files or old blueprint queue history just to resemble origin/mod-first-dev.`

## Progress Log

- 2026-08-08
  - Summary: `Plan created from the approved residual-intent backfill spec. The child opens from the current canonical no-child state and will execute inline rather than waiting for a separate execution-mode choice, because the user explicitly requested one continuous spec -> plan -> implementation run.`
  - Verification: `Spec committed as 78d172a4; plan authoring only.`
  - Next: `Execute Task 1 and prove whether the current playable registry/browser-safe surface still has a real residual gap.`
- 2026-08-08
  - Summary: `Completed Task 1 on the current owner graph. Added a new focused script-editor playable catalog regression, proved the residual gap with a failing authoring-prefix assertion, then corrected the authoring-facing builtin playable definition registry to use canonical playable prefixes and removed retired building-flow builtin integration exposure. Runtime registry bootstrap was confirmed already browser-safe on the current branch, so no runtime bootstrap rewrite was needed.`
  - Verification: `npm run build:test; node --test tests/script-editor-playable-catalog.test.cjs tests/script-editor-host-contract.test.cjs tests/playable-runtime-registries.test.cjs tests/script-editor-runtime-preview-compat.test.cjs; git diff --check`
  - Next: `Execute Task 2 and audit authored navigation-through-runtime residual coverage on current owners.`
- 2026-08-08
  - Summary: `Completed Task 2 and Task 3 on the current owner graph. Added focused regressions for canonical navigate targets, backfilled event/runtime/export owners to route leaveBuilding and reenterBuilding through navigation-runtime, normalized legacy closeBuilding authoring into navigate.leaveBuilding, migrated zhuyuanzhang runtime/template/public event data to the canonical navigate shape, and confirmed AI governance was already covered by AGENTS.md + docs + the dedicated governance test.`
  - Verification: `npm run build:test; node --test tests/navigation-runtime-access.test.cjs tests/event-binding-start-runtime.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/zhuyuanzhang-source-unification.test.cjs tests/ai-collaboration-governance.test.cjs; npm run typecheck; npm run build; npm run lint:plans; git diff --check`
  - Next: `Review local diff, then commit/push before child closeout.`
- 2026-08-08
  - Summary: `Committed and pushed the residual-intent child, then synchronized plan-governance state so this child closes cleanly from the pushed merage-mod2ui-1 baseline. The branch now returns to the canonical no-child state while startup stays frozen and review-system work remains paused by user instruction.`
  - Verification: `git log --oneline -3; npm run lint:plans; git diff --check`
  - Next: `Open docs/superpowers/project-progress.md and choose the next approved stabilization child before any new implementation slice.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-08-mod-first-dev-residual-intent-backfill-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `The three unmerged origin/mod-first-dev commits are still 38213b34, 7dd7da11, and 4bef6cfb, but direct cherry-pick attempts collided with later current-branch owner refactors and deleted files.`
  - `Current branch evidence already suggests a residual Line A gap: src/core/registry/builtin-playable-definition-registry.ts still advertises interactive prefixes for activity-qte and city-begging, while current tests expect canonical playable prefixes and decoupled shell-backed definitions.`
  - `Current branch evidence also suggests Line B must be treated as a current-owner audit rather than an old-patch replay, because the old 7dd7da11 patch targeted files that have since been deleted or structurally replaced by aaad59af and 923a55a6.`
  - `AI governance is already present in docs/ai-collaboration-governance.md, AGENTS.md, and tests/ai-collaboration-governance.test.cjs, so Line C starts as coverage confirmation, not as a presumed code gap.`

## Implementation Scope

### In Scope

- Audit and backfill the current playable registry/browser-safe intent on the current owner graph.
- Audit and backfill the current authored-navigation-through-runtime intent on covered runtime/event/export seams.
- Confirm the current branch already covers the AI governance residual intent, and only patch governance if an actual coverage gap is found.
- Update current governance and change-log records if the child materially changes runtime ownership, registry semantics, or verification state.

### Still Out Of Scope

- Replaying the old unmerged commits as-is.
- Restoring deleted navigation helper files, old queue docs, or old script-editor/runtime seam files.
- Reopening startup-chain work, review-system work, or source-unification work.
- Broad playable-runtime redesign beyond the bounded residual intent backfill.
- Broad event-router/runtime migration unrelated to covered authored-navigation residual seams.

## File Map

### Existing files to modify

- `src/core/registry/builtin-playable-definition-registry.ts`
  - Current builtin definition owner likely needs canonical playable-family cleanup.
- `src/core/registry/builtin-playable-integration-registry.ts`
  - Current authoring-facing builtin integration owner may still leak retired builtin entries.
- `src/core/runtime/playable-runtime-registries.ts`
  - Line A audit owner; confirmed browser-safe already on current branch.
- `src/core/registry/builtin-playable-shell-registry.ts`
  - Audit owner only unless a later task finds a real gap.
- `src/core/runtime/navigation-runtime.ts`
  - Primary current owner for authored navigation-through-runtime behavior.
- `src/core/runtime/event-binding-runtime.ts`
  - Covered route activation path if Line B finds a bypass here.
- `src/application/building/building-container-event-runtime.ts`
  - Covered building-origin navigation path if it still emits or consumes a retired route shape.
- `src/application/story/story-runtime.ts`
  - Covered story follow-up path if it still bypasses navigation-runtime.
- `src/modules/script-editor/application/runtime-pack-export.ts`
  - Covered authored export seam if it still emits retired navigation action shapes.
- `src/domain/event.ts`
  - Covered event contract only if a current canonical authored navigation shape must be narrowed or clarified.
- `docs/change-log.md`
  - Record residual-intent backfill outcomes when implementation lands.
- `docs/superpowers/project-progress.md`
  - Keep canonical progress synchronized while this child is active and when it closes.
- `docs/superpowers/plans/2026-08-08-mod-first-dev-residual-intent-backfill-plan.md`
  - Track execution state, progress log, verification, and closeout.

### Existing files expected to be deleted

- `none by default`

### New files to create

- `tests/navigation-authored-runtime-backfill.test.cjs`
  - Only if no existing targeted suite can express the covered authored-navigation residual checks cleanly.
- `tests/script-editor-playable-catalog.test.cjs`
  - Focused Task 1 regression coverage for canonical authoring prefixes and retired builtin exposure.

## Verification Plan

- Targeted verification:
  - `playable registry bootstrap stays browser-safe and builtin playable definitions no longer advertise stale builtin families or legacy shell-coupled prefixes`
  - `covered authored navigation routes resolve through navigation-runtime and covered export/runtime seams no longer emit retired direct-navigation shapes`
  - `AI governance residual intent is confirmed as already covered, or the minimal real gap is proven and fixed`
- Required commands:
  - `npm run build:test`
  - `node --test tests/script-editor-playable-catalog.test.cjs tests/script-editor-host-contract.test.cjs tests/playable-runtime-registries.test.cjs tests/script-editor-runtime-preview-compat.test.cjs`
  - `node --test <covered navigation test selection chosen during Task 2>`
  - `node --test tests/ai-collaboration-governance.test.cjs`
  - `npm run typecheck`
  - `npm run build`
  - `npm run lint:plans`
  - `git diff --check`

## Task 1: Playable Registry / Browser-Safe Residual Backfill

**Files:**
- Modify: `src/core/registry/builtin-playable-definition-registry.ts`
- Modify: `src/core/registry/builtin-playable-integration-registry.ts`
- Audit: `src/core/runtime/playable-runtime-registries.ts`
- Audit: `src/core/registry/builtin-playable-shell-registry.ts`
- Modify: `docs/change-log.md`
- Test: `tests/script-editor-playable-catalog.test.cjs`
- Test: `tests/script-editor-host-contract.test.cjs`
- Test: `tests/playable-runtime-registries.test.cjs`
- Test: `tests/script-editor-runtime-preview-compat.test.cjs`
- Read: `docs/superpowers/specs/2026-08-08-mod-first-dev-residual-intent-backfill-design.md`

- [x] **Step 1: Audit the current Line A mismatch on the current owner graph**

Read the current builtin playable definition, builtin shell registry, and runtime registry bootstrap files together with the three focused tests. Record exactly which expectations already exist in tests and which current source surfaces still contradict them. The audit must explicitly answer:

- whether `activity-qte` and `city-begging` still expose legacy `interactive.*` prefixes in builtin definitions
- whether `building-flow` still leaks through builtin registry surfaces
- whether runtime registry bootstrap already avoids browser-hostile `require()` paths on the current branch
- whether shell-backed playable definitions still require shell-coupled source ownership

- [x] **Step 2: Add or tighten the failing focused assertions if the current tests do not fully prove the residual gap**

Use the existing three focused suites first. Only add assertions that prove the Line A residual gap on the current architecture; do not recreate deleted historical test files or old registry expectations.

- [x] **Step 3: Backfill the current registry implementation to match the canonical current playable family**

Implement the minimal current-architecture changes required so that:

- builtin playable definitions expose only the current canonical builtin playable family
- stale builtin `building-flow` exposure is removed from the covered definition surface
- shell-backed playables do not require definition-registry shell imports to advertise canonical ids/prefixes
- runtime preview / activated playable registry bootstrap remains browser-safe on the current owner graph

- [x] **Step 4: Run the focused Line A verification**

Run:

```bash
npm run build:test
node --test tests/script-editor-playable-catalog.test.cjs tests/script-editor-host-contract.test.cjs tests/playable-runtime-registries.test.cjs tests/script-editor-runtime-preview-compat.test.cjs
git diff --check
```

Expected:

- `PASS`
- no failing assertion about canonical authoring prefixes or retired `building-flow` builtin exposure
- no failing assertion about script-editor preview/runtime pack compatibility on the touched catalog seam
- current runtime registry bootstrap remains browser-safe without needing a bootstrap rewrite

- [x] **Step 5: Record the Line A outcome**

If Line A required code changes, add a concise change-log entry describing the residual-intent backfill and note the focused verification set. Update this plan’s `Execution State`, `Progress Log`, and verification note before moving to Task 2.

## Task 2: Authored Navigation Through Runtime Residual Backfill

**Files:**
- Modify: `src/core/runtime/navigation-runtime.ts`
- Modify: `src/core/runtime/event-binding-runtime.ts`
- Modify: `src/application/building/building-container-event-runtime.ts`
- Modify: `src/application/story/story-runtime.ts`
- Modify: `src/modules/script-editor/application/runtime-pack-export.ts`
- Modify: `src/domain/event.ts` only if the current canonical authored navigation shape needs clarification
- Modify: `src/content/scenario-packs/zhuyuanzhang/events.json` only if a covered authored route record truly still uses a retired shape
- Modify: `src/modules/script-editor/builtin-templates/zhuyuanzhang/events.json` only if runtime/template symmetry requires the same authored-shape correction
- Modify: `tests/robustness.test.cjs`
- Create: `tests/navigation-authored-runtime-backfill.test.cjs` only if no existing suite can prove the covered behavior cleanly
- Modify: `docs/change-log.md`
- Read: `docs/superpowers/specs/2026-08-08-mod-first-dev-residual-intent-backfill-design.md`
- Read: `src/core/runtime/navigation-runtime.ts`

- [x] **Step 1: Audit current authored navigation on the current owner graph**

Trace the covered navigation-producing paths that still matter on this branch:

- authored event / event-binding navigation
- building-container navigation
- story/runtime follow-up navigation
- exported authored navigation shapes used by Script Editor runtime/export

For each covered path, determine whether it already resolves through `navigation-runtime`, still emits a retired direct-navigation shape, or is already superseded by later current-branch dispatch seams.

- [x] **Step 2: Write or tighten focused regression coverage for any proved residual gap**

Prefer existing current suites first. If no existing suite cleanly proves the covered authored-navigation residual behavior, add one focused test file instead of inflating unrelated large suites. The assertions must prove current-owner behavior, not old file-level patch parity.

- [x] **Step 3: Backfill only the still-missing authored navigation intent on current owners**

Implement the minimal current-owner changes required so that covered authored navigation:

- resolves through the current `navigation-runtime` seam
- no longer depends on retired direct-navigation route shapes in covered export/runtime paths
- does not restore deleted historical dispatch helpers or reintroduce shell-local navigation mutation

- [x] **Step 4: Run the focused Line B verification**

Run the focused navigation/runtime tests selected by the audit, then run the shared build/typecheck guard:

```bash
npm run build:test
node --test tests/navigation-runtime-access.test.cjs tests/event-binding-start-runtime.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/zhuyuanzhang-source-unification.test.cjs
npm run typecheck
npm run build
git diff --check
```

Expected:

- `PASS` on the covered authored-navigation assertions
- canonical navigate leaveBuilding/reenterBuilding is accepted on current runtime/export owners
- no restored direct-navigation or retired route-shape regressions on the touched zhuyuanzhang runtime/template/public sources

- [x] **Step 5: Record the Line B outcome**

Update `docs/change-log.md` if Line B changed covered runtime/event/export ownership. Then update this plan’s `Execution State`, `Progress Log`, and verification note before moving to Task 3.

## Task 3: Governance Coverage Confirmation And Child Closeout

**Files:**
- Modify: `docs/change-log.md` only if a real governance gap is proven
- Modify: `docs/superpowers/project-progress.md`
- Modify: `docs/superpowers/plans/2026-08-08-mod-first-dev-residual-intent-backfill-plan.md`
- Test: `tests/ai-collaboration-governance.test.cjs`
- Read: `docs/ai-collaboration-governance.md`
- Read: `AGENTS.md`

- [x] **Step 1: Confirm the current branch already covers the residual AI governance intent**

Verify that the current branch’s governance surfaces already cover the old residual intent through:

- `docs/ai-collaboration-governance.md`
- `AGENTS.md`
- `tests/ai-collaboration-governance.test.cjs`

If a real coverage gap exists, patch only that gap. If not, explicitly record “already covered; no implementation needed.”

- [x] **Step 2: Run the final child verification batch**

Run:

```bash
node --test tests/ai-collaboration-governance.test.cjs
npm run build
npm run lint:plans
git diff --check
```

Expected:

- `PASS`
- clean plan lint
- no whitespace/conflict residue

- [x] **Step 3: Sync governance and close the child**

Update:

- this plan’s `Execution State`
- this plan’s `Progress Log`
- this plan’s closeout block
- `docs/superpowers/project-progress.md`

The canonical result should be:

- this child recorded as the latest closed item
- current child reset only if no immediately approved follow-up child exists

- [x] **Step 4: Commit and push the completed child**

Create one coherent checkpoint for the residual-intent backfill child and push it to `origin/merage-mod2ui-1`.

## Exit Check

- [x] Line A no longer has an unresolved current-architecture playable-registry/browser-safe residual gap.
- [x] Line B no longer has an unresolved covered authored-navigation-through-runtime residual gap.
- [x] AI governance residual intent is explicitly confirmed as already covered, or a real minimal gap is fixed and recorded.
- [x] Project progress sync is updated if the child state changed.
- [x] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Mod-First-Dev Residual Intent Backfill`
- Parent Task: `Post-Merge Branch Stabilization`
- Parent Stage: `Post-Merge Branch Stabilization`
- Closeout Status: `closed`
- Project Progress Synced: `yes`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `open-next-approved-child`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `none`
- Push Status: `success`
- Push Commit: `874605fe`
- Resume From: `Open docs/superpowers/project-progress.md, then open the next approved stabilization child from the pushed residual-intent baseline; startup remains frozen and review-system work stays paused unless explicitly resumed.`
