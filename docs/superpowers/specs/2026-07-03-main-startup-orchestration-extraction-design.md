# Main Startup Orchestration Extraction Design

> **Legacy Governance Context:** This document was authored under the retired `weekly plan / weekly set / weekly orchestration` model. Keep its technical scope, but treat any weekly-governance references as historical context only. If this legacy artifact is explicitly resumed, use `docs/superpowers/project-progress.md`; otherwise use `docs/blueprints/project-progress.md` for current repository work.

**Goal:** Open a fresh post-Child-22 continuation line that extracts `startup / continue / restore / scenario import` orchestration from `src/main.ts` into one explicit coordinator seam without reopening runtime spine, render orchestration, or other already-closed roadmap boundaries.

## Why This Needs A Fresh Weekly Review

The `2026-07-02` mod-first weekly set is closed after Child 22. That set already proved:

- builtin, imported, and restored mod activation share one verified end-to-end closure path
- save/load now preserves `selectedModSource` and can restore imported mods after a fresh page load
- no active, queued, or locked child remains in the closed set

That means later work cannot be framed as â€œcontinue Child 22.â€?Any new execution must begin from a fresh weekly review and must prove that it is solving a different problem type.

The next different problem type is not save/restore parity. It is the remaining startup-family orchestration black box in `src/main.ts`.

## Current Problem

`src/main.ts` still directly owns the main browser-entry orchestration for:

- builtin startup
- continue-game startup
- restore startup
- scenario-pack import and start

Even after Child 22, the file still mixes:

- UI-trigger entry handling
- activation request selection
- save/load entry routing
- activated-content synchronization
- session bootstrap selection

This is now the clearest remaining ownerization debt that can be extracted without reopening render or runtime-settlement boundaries.

## Recommended Approach

### Option A: Extract A Narrow Startup Coordinator

Create one coordinator seam that owns only:

- `startup`
- `continue`
- `restore`
- `scenario import / scenario start`

`main.ts` keeps browser shell responsibilities and hands these entry requests to the coordinator.

**Pros**

- smallest boundary
- least likely to reopen Child 18 or Child 22 conclusions
- easiest to verify with targeted startup/restore regressions

**Cons**

- `main.ts` remains large overall
- render orchestration and general UI dispatch still stay in place

### Option B: Extract A Larger Session Coordinator

Move startup-family orchestration plus broader bootstrap and some shell decisions into a larger session-level coordinator.

**Pros**

- `main.ts` shrinks more visibly in one pass

**Cons**

- much easier to absorb render handoff, follow-up, or UI concerns by accident
- weakens the single-problem boundary

### Option C: Force `main.ts` To Become A Minimal Shell Immediately

Treat this as a broad â€œthin shellâ€?rewrite and pull multiple orchestration families out at once.

**Pros**

- closest to long-term end state

**Cons**

- highest scope-creep risk
- likely to reopen already-closed runtime and render seams
- expensive verification surface

## Recommendation

Use **Option A**.

The fresh weekly set should open with one active child that extracts only startup-family orchestration. This keeps the new continuation line narrow, testable, and governance-safe.

## Target Boundary

The first active child must be scoped to exactly these entry families:

1. `startup`
2. `continue`
3. `restore`
4. `scenario import / scenario start`

The child goal is:

```text
src/main.ts startup-family entry -> startup coordinator -> mod activation/bootstrap decision -> activated content sync -> session bootstrap result -> existing render path
```

## In Scope

- extraction of startup-family orchestration out of `src/main.ts`
- one explicit coordinator seam for builtin/imported/restored entry routing
- activation request selection and dispatch for those entry families
- save/load entry orchestration for continue/restore
- consolidation of startup-bound `active content sync` and session bootstrap helper usage
- targeted tests proving all three startup families still converge through one seam

## Out Of Scope

- `renderApp()` redesign
- presenter structure changes
- runtime follow-up or settlement redesign
- `MainUiFlow` redesign or public contract expansion
- task / house / event / scene runtime contract changes
- new save-envelope family design
- broad â€œmake `main.ts` smallâ€?refactors unrelated to startup-family orchestration

## Hard Scope Guardrails

The active child must stop and reopen review if any of these becomes necessary:

1. editing the main `renderApp()` path as part of the extraction
2. changing runtime commit or settlement semantics
3. introducing a second coordinator for render or follow-up ownership
4. redesigning `MainUiFlow` instead of consuming it as-is
5. adding a new save contract family beyond consuming the already-closed `selectedModSource` path

These are not â€œadjacent improvements.â€?They are proof that the work has crossed into a different problem type.

## Proposed Architecture

### New Seam

Introduce one coordinator module responsible for startup-family entry execution. Its responsibilities should be limited to:

- accept a narrow startup request
- choose the correct activation source
- invoke the existing activation/runtime seam
- normalize activated content/session bootstrap selection
- return a bootstrap result consumable by `main.ts`

### `main.ts` After Extraction

`src/main.ts` should still own:

- browser shell wiring
- `MainUiFlow` hookup
- loading-screen display
- final render orchestration
- generic UI event handling

It should no longer own the decision tree for builtin vs imported vs restored startup-family entry routing.

### Coordinator Contract Shape

The exact type names can be chosen during planning, but the coordinator must expose a contract equivalent to:

- startup request input
- startup result output
- explicit success/failure surface

It must not absorb render ownership. It should return enough bootstrap information for `main.ts` to keep its existing render path unchanged.

## Data Flow

### Builtin Startup

```text
MainUiFlow start action -> main.ts shell entry -> startup coordinator -> builtin activation -> activated content sync/bootstrap selection -> main.ts applies returned session
```

### Imported Scenario Start

```text
scenario import/start action -> main.ts shell entry -> startup coordinator -> imported pack activation -> activated content sync/bootstrap selection -> main.ts applies returned session
```

### Continue / Restore

```text
continue action -> main.ts shell entry -> load save data -> startup coordinator -> restore activation selection -> activated content sync/bootstrap selection -> main.ts applies returned session
```

## Error Handling

- coordinator must return explicit failure information rather than silently falling back across unrelated paths
- existing startup/loading-screen error presentation may remain in `main.ts`
- builtin fallback is allowed only where current behavior already defines it, not as a new hidden retry path

## Verification Strategy

The active child plan must require:

### Targeted Regression Coverage

- builtin startup still works
- imported scenario start still works
- continue/restore still works
- startup-family paths now share one coordinator seam
- `main.ts` no longer directly owns the extracted entry decision tree

### Full Gate

- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run lint:plans` when weekly/plan governance docs are updated

## Weekly Governance Design

The fresh weekly set should begin with:

- one `active` child: startup-family orchestration extraction
- no initial `queued` child
- no initial `locked` child

Reason:

- this prevents speculative queue growth
- the next child, if any, must be justified only after the startup-family extraction closes
- later continuation must prove it is a different boundary, not just â€œmore `main.ts` cleanupâ€?

## Exit Conditions For The First Active Child

The child is complete only when:

1. `src/main.ts` no longer directly owns the primary orchestration for `startup / continue / restore / scenario import`
2. builtin, imported, and restored startup-family paths converge through one coordinator seam
3. startup-bound `active content sync` and session bootstrap usage are no longer scattered across multiple `main.ts` entry functions
4. `renderApp()` main path and runtime commit/settlement semantics remain unchanged
5. targeted regression coverage plus full verification pass

## What This Does Not Promise

This design does **not** promise that `src/main.ts` becomes a tiny final shell in one child.

It only opens the next safe continuation line:

- extract startup-family orchestration cleanly
- keep other closed seams closed
- prevent infinite scope growth

If later work still wants to thin `main.ts` further, that work must begin from a new weekly review and must prove it is not re-entering this same startup-family boundary.

