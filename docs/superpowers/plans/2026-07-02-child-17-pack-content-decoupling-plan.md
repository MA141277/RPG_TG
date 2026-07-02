# Child 17 Pack Content Decoupling Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove scenario-specific direct imports from production runtime consumers so builtin `zhuyuanzhang` data is consumed through active runtime content or shared selectors instead of static file-path coupling.

**Architecture:** Child 17 is the first executable child under the next fresh mod-first weekly set. Its job is not to redesign runtime ownership; its job is to clean the content access boundary so later mod-facing task/house/registry work is not built on top of hardcoded `zhuyuanzhang` imports. Child 17 must stay focused on content access and must not reopen the closed Child 15/16 runtime handoff problem.

**Tech Stack:** TypeScript, existing content-pack loaders, active-game-content assembly, house/content adapters, Node test runner (`tests/robustness.test.cjs`), `npm run typecheck`, `npm test`, `npm run build`, `npm run lint:plans`

---

## Execution State

- Status: `completed`
- Last Updated: `2026-07-02`
- Current Focus: `Child 17 is closed. The covered story, house-content, and keep/temple module consumers now read default zhuyuanzhang content through the shared pack-content access seam instead of hard-importing scenario-pack files directly.`
- Next Step: `No further execution inside Child 17. Recheck Child 18 against the post-Child-17 baseline before any promotion decision.`
- Verification: `node --test tests/robustness.test.cjs --test-name-pattern "direct scenario import|story content registry|house content registry|pack content access"` + `npm run typecheck` + `npm test` + `npm run build`
- Notes: `Child 17 stayed inside content-access decoupling scope. It did not reopen Child 15/16 runtime-handoff work and did not expand task/house/registry contracts.`

## Progress Log

- 2026-07-02
  - Summary: `Plan created from the mod-first unified contract roadmap. Child 17 is pre-authored but not yet promoted by a fresh weekly set.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Run a fresh weekly review and baseline audit of direct scenario-pack imports.`
- 2026-07-02
  - Summary: `Child 17 is now active under the fresh mod-first weekly set. Audited the covered direct-import hotspots and confirmed the current production consumers still hard-import zhuyuanzhang content in three categories: story registry (src/content/story/index.ts), house-content adapters (grain-shop, home-house, keep-house, market-house, medicine-house, tavern, and tea-house content files), and house-module pack text/activity imports (keep-house-house-module.ts and temple-house-house-module.ts). Added red regression tests first and watched them fail for exactly those hotspots.`
  - Verification: `node --test tests/robustness.test.cjs --test-name-pattern "direct scenario import|story content registry|house content registry|pack content access"`
  - Next: `Introduce the shared pack-content access seam and migrate the covered consumers onto it.`
- 2026-07-02
  - Summary: `Completed Child 17. Added the shared pack-content access seam under src/content/pack-content-access.ts plus an application-layer re-export seam, migrated covered story and house-content consumers off direct zhuyuanzhang imports, and rewired covered keep-house/temple-house module fallback activities/text to read through the shared seam. The direct-import regression guards turned green, and full verification passed.`
  - Verification: `node --test tests/robustness.test.cjs --test-name-pattern "direct scenario import|story content registry|house content registry|pack content access"` + `npm run typecheck` + `npm test` + `npm run build`
  - Next: `Keep Child 18 queued until its post-Child-17 baseline recheck is recorded.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-02-mod-first-unified-contract-roadmap-design.md`
- Weekly set plan:
  - `docs/superpowers/plans/2026-07-02-mod-first-weekly-orchestration-plan.md`

## Baseline Recheck

- Recheck result: `narrowed`
- Notes:
  - `The known direct-import hotspots are src/content/story/index.ts, src/content/houses/*.ts, and some src/application/house-modules/** files that still import zhuyuanzhang tables directly.`
  - `Child 17 should prefer shared selectors/loaders over one-off replacement shims.`
  - `This child must leave runtime request/dispatch ownership unchanged except where a consumer needs a shared content lookup seam.`

## Implementation Scope

### In Scope

- audit of direct `scenario-packs/zhuyuanzhang` imports in production runtime consumers
- creation of shared active-pack content access helpers where needed
- migration of story and house content consumers off scenario-specific imports
- targeted regression coverage proving those consumers no longer hard-import pack content
- governance/doc sync for the new child outcome

### Still Out Of Scope

- runtime router redesign
- task contract redesign
- house registration redesign
- mod manifest expansion
- save/load redesign
- presenter/UI redesign

## File Map

### Existing files to modify

- `src/content/story/index.ts`
  - Remove direct `zhuyuanzhang` event/scene/text imports and route story content through active content access.
- `src/content/houses/home-house-content.ts`
  - Stop hard-importing `zhuyuanzhang` house content JSON.
- `src/content/houses/grain-shop-content.ts`
  - Stop hard-importing `zhuyuanzhang` house content JSON.
- `src/content/houses/keep-house-content.ts`
  - Stop hard-importing `zhuyuanzhang` house content JSON.
- `src/content/houses/market-house-content.ts`
  - Stop hard-importing `zhuyuanzhang` house content JSON.
- `src/content/houses/medicine-house-content.ts`
  - Stop hard-importing `zhuyuanzhang` house content JSON.
- `src/content/houses/tea-house-content.ts`
  - Stop hard-importing `zhuyuanzhang` house content JSON.
- `src/content/houses/tavern-content.ts`
  - Stop hard-importing `zhuyuanzhang` house content JSON.
- `src/application/content/default-runtime-content.ts`
  - Expose or consume a shared builtin active-content access seam instead of pack-specific shortcuts.
- `src/application/content/active-game-content.ts`
  - Add any shared selectors needed for pack-owned story/house content lookup.
- `src/application/house-modules/keep-house/keep-house-house-module.ts`
  - Remove direct `zhuyuanzhang` activity/text imports.
- `src/application/house-modules/temple-house/temple-house-house-module.ts`
  - Remove direct `zhuyuanzhang` activity/text imports.
- `tests/robustness.test.cjs`
  - Add red-to-green coverage for direct-import regression guards.
- `docs/change-log.md`
  - Record the boundary change after Child 17 closes.
- `docs/superpowers/plans/2026-07-02-child-17-pack-content-decoupling-plan.md`
  - Record execution progress and closeout.

### Existing files to read

- `src/content/base-game-content-pack.ts`
- `src/application/content/content-pack-loader.ts`
- `src/application/scenario/scenario-pack-loader.ts`
- `docs/scenario-pack-unified-format.md`
- `docs/hardcoded-text-audit.md`

### New files to create

- `src/application/content/pack-content-access.ts`
  - Shared content selectors/loaders if the existing files do not provide a clean seam.

## Verification Plan

- Targeted verification:
  - `node --test tests/robustness.test.cjs --test-name-pattern "direct scenario import|story content registry|house content registry|pack content access"`
- Required commands:
  - `npm run typecheck`
  - `npm test`
  - `npm run build`

## Task 1: Audit Direct Scenario-Pack Imports

**Files:**
- Read: `src/content/story/index.ts`
- Read: `src/content/houses/*.ts`
- Read: `src/application/house-modules/**`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Enumerate every direct production import of `scenario-packs/zhuyuanzhang`**

Record each remaining direct import that still makes builtin content special-case by source path.

- [x] **Step 2: Add failing regression tests for forbidden direct-import hotspots**

Write red tests that lock the current direct-import hotspots before implementation.

- [x] **Step 3: Run the targeted red tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "direct scenario import|story content registry|house content registry|pack content access"
```

Expected:

- at least one direct-import guard fails before implementation

- [x] **Step 4: Record the audit result in plan state**

Update this plan's `Execution State` and `Progress Log` with the audited direct-import baseline.

## Task 2: Introduce Shared Pack Content Access Seams

**Files:**
- Modify: `src/application/content/active-game-content.ts`
- Modify: `src/application/content/default-runtime-content.ts`
- Create: `src/application/content/pack-content-access.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add shared access helpers for pack-owned story and house content**

Create the minimum shared selector/lookup seam needed to stop importing pack tables directly from production consumers.

- [x] **Step 2: Re-run the targeted helper tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "pack content access|active game content|default runtime content"
```

Expected:

- the new access helpers and loader assumptions pass targeted tests

- [x] **Step 3: Run the full verification gate for Task 2**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass without reopening unrelated runtime-ownerization failures

## Task 3: Migrate Story And House Consumers Off Direct Imports

**Files:**
- Modify: `src/content/story/index.ts`
- Modify: `src/content/houses/*.ts`
- Modify: `src/application/house-modules/keep-house/keep-house-house-module.ts`
- Modify: `src/application/house-modules/temple-house/temple-house-house-module.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Move story and house production consumers onto the shared content seam**

Replace scenario-path imports with runtime content lookup or pack-owned adapters.

- [x] **Step 2: Re-run the targeted consumer tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "direct scenario import|story content registry|house content registry"
```

Expected:

- the direct-import guards pass

- [x] **Step 3: Run the full verification gate for Task 3**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass

## Task 4: Close Out Child 17 Governance

**Files:**
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-07-02-child-17-pack-content-decoupling-plan.md`

- [x] **Step 1: Record the final direct-import boundary**

Document which consumers were migrated and which adjacent areas remain intentionally outside Child 17.

- [x] **Step 2: Run governance verification**

Run:

```bash
npm run lint:plans
```

Expected:

- `Superpowers plan lint passed`

## Exit Check

- [x] Production story consumers no longer hard-import `zhuyuanzhang` pack files.
- [x] Production house content consumers no longer hard-import `zhuyuanzhang` pack files.
- [x] Shared pack-content access seam exists for later mod-facing work.
- [x] Child 17 does not redesign runtime dispatch ownership.
- [x] Targeted regression coverage passes.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
