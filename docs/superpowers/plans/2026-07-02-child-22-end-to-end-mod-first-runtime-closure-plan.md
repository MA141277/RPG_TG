# Child 22 End-to-End Mod-First Runtime Closure Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove one end-to-end mod-first runtime closure where builtin content and external mods share the same activation, runtime play, save, restore, and presentation path.

**Architecture:** Child 22 starts only after Child 21 closes and the unified contribution registry exists. This is the closure child for the roadmap. It must prove real parity across builtin startup, imported-pack activation, save restore, and gameplay runtime execution without reopening lower-level contract debates that should already be settled by Child 17 through Child 21.

**Tech Stack:** TypeScript, mod runtime activation, content/runtime assembly, save/load envelope, `src/main.ts`, Node test runner (`tests/robustness.test.cjs`), `npm run typecheck`, `npm test`, `npm run build`, `npm run lint:plans`

## Execution State

- Status: `not-started`
- Last Updated: `2026-07-02`
- Current Focus: `Pre-authored plan only. Await fresh weekly promotion before execution.`
- Next Step: `Promote Child 22 only after Child 21 closeout and baseline recheck.`
- Verification: `Not run as part of this doc-only change`
- Notes: `Child 22 is the closure child for the roadmap; do not pull lower-level contract work back into it.`

## Progress Log

- 2026-07-02
  - Summary: `Plan created from the mod-first unified contract roadmap. Child 22 remains non-executable until the next weekly set promotes it after Child 21.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Recheck builtin activation, imported-pack activation, save restore, and runtime presentation paths after Child 21 closes.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-02-mod-first-unified-contract-roadmap-design.md`
- Weekly set plan:
  - `To be authored by the next fresh weekly review. Promote only after Child 21 closes.`

## Baseline Recheck

- Recheck result: `narrowed`
- Notes:
  - `The existing activation/startup path already uses createBaseGameContentPack(), builtInScenarioPacks, loadScenarioPackFromUrl(), and runModRuntime(), but builtin and imported sources do not yet prove full parity.`
  - `The save path already carries selectedModId and modState, but Child 22 must verify round-trip behavior through the unified contribution registry.`
  - `Child 22 should not invent new contribution families; it should only close the loop on the finalized ones.`

## Implementation Scope

### In Scope

- audit of builtin startup, imported-pack activation, and save/restore parity
- final activation/runtime/play/save/restore wiring needed for mod-first closure
- end-to-end verification flow that covers map/city/event/scene/task/house/save/restore
- presenter/runtime read-model alignment where closure requires it
- governance/doc sync for the new child outcome

### Still Out Of Scope

- new gameplay systems
- editor tooling
- unrelated UI redesign
- reopening lower-level manifest/contract disputes already settled by prior children

## File Map

### Existing files to modify

- `src/main.ts`
  - Close any remaining activation/runtime/play/write-back gaps that block mod-first parity.
- `src/core/mods/mod-runtime.ts`
  - Keep activation output aligned with the final unified contribution install path.
- `src/core/adapters/mod-runtime-main-adapter.ts`
  - Preserve one startup handoff seam from activation into main/bootstrap.
- `src/core/save/save-envelope.ts`
  - Keep saved mod/runtime payload aligned with the final closure path.
- `src/core/save/save-loader.ts`
  - Keep restore validation aligned with the final closure path.
- `src/core/save/save-migrations.ts`
  - Preserve forward-compatible mod payload behavior where needed.
- `src/application/content/default-runtime-content.ts`
  - Remove any remaining builtin-only shortcut that bypasses unified activation assumptions.
- `src/application/content/active-game-content.ts`
  - Keep runtime read-model assembly aligned with final activation/runtime closure.
- `src/application/scenario/scenario-pack-loader.ts`
  - Keep imported pack hydration aligned with final activation/runtime closure.
- `tests/robustness.test.cjs`
  - Add end-to-end regression coverage for builtin/imported/save-restore parity.
- `docs/change-log.md`
  - Record the Child 22 closure outcome.
- `docs/superpowers/plans/2026-07-02-child-22-end-to-end-mod-first-runtime-closure-plan.md`
  - Record execution progress and closeout.

### Existing files to read

- `docs/superpowers/weekly/2026-06-29-weekly-call-flows.md`
- `docs/superpowers/weekly/2026-07-02-weekly-call-flows.md`
- `src/core/engine/engine-bootstrap.ts`
- `src/core/engine/engine-factory.ts`

## Verification Plan

- Targeted verification:
  - `node --test tests/robustness.test.cjs --test-name-pattern "mod-first closure|builtin activation|imported pack activation|save restore|task runtime|house runtime|story trigger"`
- Required commands:
  - `npm run typecheck`
  - `npm test`
  - `npm run build`

## Task 1: Audit The End-To-End Parity Gaps

**Files:**
- Read: `src/main.ts`
- Read: `src/core/mods/mod-runtime.ts`
- Read: `src/core/save/save-loader.ts`
- Read: `src/core/save/save-envelope.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Enumerate the remaining builtin-vs-imported-vs-restored parity gaps**

Record the exact places where one source path still bypasses the unified runtime path.

- [ ] **Step 2: Add failing end-to-end regression tests**

Write red tests that prove one shared mod-first runtime flow is not yet fully closed.

- [ ] **Step 3: Run the targeted red tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "mod-first closure|builtin activation|imported pack activation|save restore|task runtime|house runtime|story trigger"
```

Expected:

- at least one end-to-end closure guard fails before implementation

- [ ] **Step 4: Record the audit result in plan state**

Update `Execution State` and `Progress Log` with the enumerated end-to-end baseline.

## Task 2: Align Builtin And Imported Activation Paths

**Files:**
- Modify: `src/main.ts`
- Modify: `src/core/mods/mod-runtime.ts`
- Modify: `src/core/adapters/mod-runtime-main-adapter.ts`
- Modify: `src/application/content/default-runtime-content.ts`
- Modify: `src/application/scenario/scenario-pack-loader.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Remove any remaining builtin-only or imported-only activation shortcuts**

Keep source differences only in discovery/loading, not in activation/runtime ownership.

- [ ] **Step 2: Re-run the targeted activation tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "mod-first closure|builtin activation|imported pack activation"
```

Expected:

- builtin and imported activation parity tests pass

- [ ] **Step 3: Run the full verification gate for Task 2**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass

## Task 3: Align Save/Restore And Runtime Play Closure

**Files:**
- Modify: `src/core/save/save-envelope.ts`
- Modify: `src/core/save/save-loader.ts`
- Modify: `src/core/save/save-migrations.ts`
- Modify: `src/application/content/active-game-content.ts`
- Modify: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Preserve one shared runtime path through save, restore, and resumed play**

Verify that selected mod id, mod-owned payload, and activated contributions survive round-trip and resume correctly.

- [ ] **Step 2: Re-run the targeted closure tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "mod-first closure|save restore|task runtime|house runtime|story trigger"
```

Expected:

- end-to-end closure tests pass

- [ ] **Step 3: Run the full verification gate for Task 3**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass

## Task 4: Close Out Child 22 Governance

**Files:**
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-07-02-child-22-end-to-end-mod-first-runtime-closure-plan.md`

- [ ] **Step 1: Record the final mod-first closure boundary**

Document the verified end-to-end runtime flow and any later tooling/editor follow-up that remains outside the roadmap.

- [ ] **Step 2: Run governance verification**

Run:

```bash
npm run lint:plans
```

Expected:

- `Superpowers plan lint passed`

## Exit Check

- [ ] Builtin content and imported mods share the same activation path after source loading.
- [ ] Save and restore preserve selected mod identity and mod-owned payload through the unified path.
- [ ] Covered runtime play paths for map/city/event/scene/task/house remain on the unified runtime spine.
- [ ] `src/main.ts` remains browser shell plus startup/render orchestration rather than gameplay ownership center.
- [ ] Targeted regression coverage passes.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
