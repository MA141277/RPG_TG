# Child 22 End-to-End Mod-First Runtime Closure Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove one end-to-end mod-first runtime closure where builtin content and external mods share the same activation, runtime play, save, restore, and presentation path.

**Architecture:** Child 22 starts only after Child 21 closes and the unified contribution registry exists. This is the closure child for the roadmap. It must prove real parity across builtin startup, imported-pack activation, save restore, and gameplay runtime execution without reopening lower-level contract debates that should already be settled by Child 17 through Child 21.

**Tech Stack:** TypeScript, mod runtime activation, content/runtime assembly, save/load envelope, `src/main.ts`, Node test runner (`tests/robustness.test.cjs`), `npm run typecheck`, `npm test`, `npm run build`, `npm run lint:plans`

## Execution State

- Status: `completed`
- Last Updated: `2026-07-03`
- Current Focus: `Child 22 closeout completed after save/source persistence, fresh restore source reload, and full verification passed without reopening lower-level contract work.`
- Next Step: `No further executable step remains inside Child 22. Any later work must start from a fresh weekly review rather than append another same-type closure batch.`
- Verification: `npm run build:test` + `node --test tests/robustness.test.cjs --test-name-pattern "save envelope preserves selected mod id|loadSaveEnvelope normalizes a legacy save into the current envelope|serializeSaveEnvelope preserves unknown mod payload after load|loadSaveEnvelope preserves imported mod source descriptors for restore|child 22 restore path can reload imported mod sources after a fresh page load"` + `npm run typecheck` + `npm test` + `npm run build` + `npm run lint:plans`
- Notes: `Child 22 now records selectedModSource in the save envelope, restores imported file/url sources after a fresh page load, and keeps the covered runtime spine on the shared mod-first path.`

## Progress Log

- 2026-07-02
  - Summary: `Plan created from the mod-first unified contract roadmap. Child 22 remains non-executable until the next weekly set promotes it after Child 21.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Recheck builtin activation, imported-pack activation, save restore, and runtime presentation paths after Child 21 closes.`
- 2026-07-02
  - Summary: `Ran the fresh post-Child-21 baseline recheck and promoted Child 22 to active execution. The recheck narrowed the first executable batch to three concrete gaps: save migration allowed engine selectedModId to drift from envelope selectedModId, builtin/imported startup did not share one activated-session bootstrap helper, and continue/restore could still overwrite a restored mod by re-entering builtin startup.`
  - Verification: `npm run build:test` + `node --test tests/robustness.test.cjs --test-name-pattern "loadSaveEnvelope normalizes engine selected mod id|child 22 continue path|child 22 builtin and imported startup"`
  - Next: `Implement the shared activated-session bootstrap seam and close the selected-mod restore overwrite path before attempting deeper save/source persistence.`
- 2026-07-02
  - Summary: `Completed Child 22 batch 1. Save migration now normalizes engine selectedModId to the envelope value, builtin/imported startup now share one activated-session bootstrap helper, and continue/restore no longer re-enters builtin startup after a successful mod restore.`
  - Verification: `npm run build:test` + `node --test tests/robustness.test.cjs --test-name-pattern "loadSaveEnvelope normalizes engine selected mod id|child 22 continue path|child 22 builtin and imported startup"` + `npm run typecheck` + `npm test` + `npm run build`
  - Next: `Keep Child 22 active for later source persistence and resumed runtime-state closure work.`
- 2026-07-03
  - Summary: `Completed Child 22 batch 2 and closed the child. Save envelope round-trip now persists selectedModSource, legacy builtin saves normalize to a builtin source descriptor, imported file/url saves preserve restorable source identity, and restore now reloads the saved source through mod runtime instead of assuming imported mods still exist in memory after a fresh page load.`
  - Verification: `npm run build:test` + `node --test tests/robustness.test.cjs --test-name-pattern "save envelope preserves selected mod id|loadSaveEnvelope normalizes a legacy save into the current envelope|serializeSaveEnvelope preserves unknown mod payload after load|loadSaveEnvelope preserves imported mod source descriptors for restore|child 22 restore path can reload imported mod sources after a fresh page load"` + `npm run typecheck` + `npm test` + `npm run build` + `npm run lint:plans`
  - Next: `Close the weekly set and require a fresh review before opening any later roadmap continuation.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-02-mod-first-unified-contract-roadmap-design.md`
- Weekly set plan:
  - `docs/superpowers/plans/2026-07-02-mod-first-weekly-orchestration-plan.md`

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

- [x] **Step 1: Enumerate the remaining builtin-vs-imported-vs-restored parity gaps**

Record the exact places where one source path still bypasses the unified runtime path.

- [x] **Step 2: Add failing end-to-end regression tests**

Write red tests that prove one shared mod-first runtime flow is not yet fully closed.

- [x] **Step 3: Run the targeted red tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "mod-first closure|builtin activation|imported pack activation|save restore|task runtime|house runtime|story trigger"
```

Expected:

- at least one end-to-end closure guard fails before implementation

- [x] **Step 4: Record the audit result in plan state**

Update `Execution State` and `Progress Log` with the enumerated end-to-end baseline.

## Task 2: Align Builtin And Imported Activation Paths

**Files:**
- Modify: `src/main.ts`
- Modify: `src/core/mods/mod-runtime.ts`
- Modify: `src/core/adapters/mod-runtime-main-adapter.ts`
- Modify: `src/application/content/default-runtime-content.ts`
- Modify: `src/application/scenario/scenario-pack-loader.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Remove any remaining builtin-only or imported-only activation shortcuts**

Keep source differences only in discovery/loading, not in activation/runtime ownership.

- [x] **Step 2: Re-run the targeted activation tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "mod-first closure|builtin activation|imported pack activation"
```

Expected:

- builtin and imported activation parity tests pass

- [x] **Step 3: Run the full verification gate for Task 2**

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

- [x] **Step 1: Preserve one shared runtime path through save, restore, and resumed play**

Verify that selected mod id, mod-owned payload, and activated contributions survive round-trip and resume correctly.

- [x] **Step 2: Re-run the targeted closure tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "mod-first closure|save restore|task runtime|house runtime|story trigger"
```

Expected:

- end-to-end closure tests pass

- [x] **Step 3: Run the full verification gate for Task 3**

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

- [x] **Step 1: Record the final mod-first closure boundary**

Document the verified end-to-end runtime flow and any later tooling/editor follow-up that remains outside the roadmap.

- [x] **Step 2: Run governance verification**

Run:

```bash
npm run lint:plans
```

Expected:

- `Superpowers plan lint passed`

## Exit Check

- [x] Builtin content and imported mods share the same activation path after source loading.
- [x] Save and restore preserve selected mod identity and mod-owned payload through the unified path.
- [x] Covered runtime play paths for map/city/event/scene/task/house remain on the unified runtime spine.
- [x] `src/main.ts` remains browser shell plus startup/render orchestration rather than gameplay ownership center.
- [x] Targeted regression coverage passes.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
