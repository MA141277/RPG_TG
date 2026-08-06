# Tavern Short Chow-Kong Debug Entry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a tavern-owned pre-short-table test entry that starts one fixed short hand demonstrating `chow` first and `kong` later in the same hand, while keeping the normal short wager flow, the existing persistent `claim-cycle` debug toggle, and `src/main.ts` ownership unchanged.

**Architecture:** Keep the new entry inside the tavern `gamble-choice` overlay, store a one-shot `pendingShortDebugPreset` in tavern session state, consume it only through `confirm-gamble`, and pass it into short-table startup as a first-hand-only override. Extend the short debug preset definition with optional `deckTopCardIds` so the domain/runtime can deterministically reach `chow` first and `kong` later without introducing a script engine or global scratch state. Shared `gamble` overlay UI stays unchanged; only tavern-owned option/session/runtime seams move.

**Tech Stack:** TypeScript tavern house/session/domain modules, CommonJS contract tests through `.test-dist`, bundled Node/TypeScript CLI commands, and `tools/lint-superpowers-plans.mjs` for governance validation.

## Global Constraints

- Do not add tavern business branches to `src/main.ts`.
- Keep the existing `toggle-short-debug-claim-cycle` path and its multi-hand `pong -> kong -> chow` behavior intact.
- Add the new entry to tavern `gamble-choice` options; do not add a second debug button to the shared `gamble` overlay contract.
- The one-shot preset must clear immediately after the first short hand is created; later hands must not reuse it unless the player explicitly picks the entry again.
- Keep the implementation typed and reusable: no DOM-only debug state, no ad hoc globals, and no direct renderer-owned hand bootstrapping.
- Because canonical governance still points at `docs/superpowers/plans/2026-08-03-tavern-work-red-nine-slice-plan.md`, keep this child in `waiting` until the user explicitly chooses an execution mode and `docs/superpowers/project-progress.md` is synchronized.
- The working tree already contains local changes in `tests/tavern-short-gamble-ui-contract.test.cjs` and `src/styles/tea-house.css`; layer this child on top of them and do not revert unrelated edits.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-08-05`
- Current Focus: `Local implementation complete; waiting for review/push decision.`
- Next Step: `Review the local diff, then decide whether to commit/push this completed-but-open tavern short chow-kong batch or keep it local.`
- Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-ui-contract.test.cjs tests/tavern-short-gamble-house.test.cjs tests/tavern-short-gamble-domain.test.cjs` PASS (53 tests, 53 pass, 0 fail); `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json` PASS
- Notes: `This child intentionally avoids widening the shared wager overlay contract. The new debug entry must stay tavern-owned through gamble-choice option data plus one-shot tavern session state. The user explicitly chose Subagent-Driven execution in the current workspace, so governance is synchronized in place rather than via a new worktree.`

## Progress Log

- 2026-08-05
  - Summary: `Updated shared docs for the tavern short chow-kong debug entry contract, then completed the final local verification sweep: plan lint passed, targeted tavern short UI/house/domain regressions all passed together, and repository TypeScript no-emit typecheck stayed green. This child now remains completed-but-open only because the current batch has not been committed or pushed.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-ui-contract.test.cjs tests/tavern-short-gamble-house.test.cjs tests/tavern-short-gamble-domain.test.cjs` PASS (53 tests, 53 pass, 0 fail); `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json` PASS
  - Next: `Review the local diff, then decide whether to commit/push this completed-but-open tavern short chow-kong batch or keep it local.`
- 2026-08-05
  - Summary: `Completed Task 2 locally: short-table startup now supports a first-hand-only debug preset, short debug hand definitions can pin a deck-top prefix, and the new claim-chow-then-kong preset deterministically reaches a human chow window first and a human kong window later in the same hand while the persistent claim-cycle path stays green.`
  - Verification: `RED -> C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-domain.test.cjs` FAIL with missing debug preset definition (`publicCardIds` read on undefined). GREEN -> C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-ui-contract.test.cjs tests/tavern-short-gamble-house.test.cjs tests/tavern-short-gamble-domain.test.cjs` PASS (53 tests, 53 pass, 0 fail).`
  - Next: `Update shared docs, sync governance state, and run the final local verification sweep.`
- 2026-08-05
  - Summary: `Completed Task 1 locally: the tavern gamble-choice overlay now exposes a tavern-owned short debug chow-kong entry, selecting it arms a one-shot pending short debug preset for the next short hand only, selecting normal short clears that preset, and confirm-gamble consumes and clears it while leaving the persistent claim-cycle toggle unchanged.`
  - Verification: `RED -> C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-ui-contract.test.cjs tests/tavern-short-gamble-house.test.cjs` FAIL with the missing `choose-short-table-debug-chow-kong` gamble-choice entry and missing `pendingShortDebugPreset === "claim-chow-then-kong"` session contract. GREEN -> C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-ui-contract.test.cjs tests/tavern-short-gamble-house.test.cjs` PASS (39 tests, 39 pass, 0 fail).`
  - Next: `Write the failing domain regression for the new preset and deck-prefix support.`
- 2026-08-05
  - Summary: `Promoted this child to running after the user selected Subagent-Driven execution in the current workspace, created the plan-scoped SDD workspace, and generated the Task 1 brief.`
  - Verification: `git rev-parse --git-dir` and `git rev-parse --git-common-dir` both resolved to `.git` in the current checkout; plan-scoped workspace `.superpowers/sdd/2026-08-05-tavern-short-chow-kong-debug-entry-plan/` created; Task 1 brief generated at `.superpowers/sdd/2026-08-05-tavern-short-chow-kong-debug-entry-plan/task-1-brief.md`
  - Next: `Dispatch the Task 1 implementer subagent and begin the RED test pass for the gamble-choice entry plus one-shot tavern session contract.`
- 2026-08-05
  - Summary: `Plan created from the approved tavern short chow-then-kong debug-entry spec and validated with plan lint.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs` PASS
  - Next: `Offer execution mode choices; keep this child in waiting until the user explicitly selects Subagent-Driven or Inline execution.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-05-tavern-short-chow-kong-debug-entry-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `The approved design still targets the gamble-choice entry plus one-shot tavern session preset; no new scope was added after spec signoff.`
  - `Canonical project progress still points at the completed-but-open tavern work child, so this plan must remain waiting until execution is explicitly promoted.`
  - `Current local changes in tests/tavern-short-gamble-ui-contract.test.cjs and src/styles/tea-house.css must be preserved while this child layers new coverage on top.`

## Implementation Scope

### In Scope

- Add one new tavern gamble-choice option that opens the normal short wager flow while arming a one-shot `claim-chow-then-kong` preset.
- Add typed tavern session support for storing and clearing a one-shot pending short debug preset.
- Extend short-table startup so the first hand can consume a one-shot preset independently from the existing persistent `debugPresetMode`.
- Extend tavern short debug preset definitions with optional `deckTopCardIds` and add the deterministic `claim-chow-then-kong` preset.
- Add focused UI contract, house-session, and domain regression coverage for the new entry and one-shot preset behavior.
- Update shared house governance docs if the tavern runtime/session structure changes during execution.

### Still Out Of Scope

- Replacing the existing `claim-cycle` debug toggle.
- Changing normal short-table or long-table rules, stakes, renderer layout, or button styling.
- Adding a general debug scripting language or hand authoring pipeline.
- Adding any tavern-specific branch to `src/main.ts`.
- Changing canonical project progress before an execution mode is explicitly chosen.

## File Map

### Existing files to modify

- `src/domain/house-modules/tavern-session.ts`
  - Add the typed one-shot pending short debug preset field and widen tavern gamble-choice option ids beyond just `short` / `long`.
- `src/application/house-modules/tavern/tavern-house-module.ts`
  - Add the new gamble-choice action, store/clear the one-shot preset, and keep `confirm-gamble` as the only short-hand start path.
- `src/application/house-modules/tavern/tavern-short-gamble-session.ts`
  - Accept a first-hand-only preset input and keep the persistent `claim-cycle` logic unchanged for later hands.
- `src/domain/tavern-short-gambling.ts`
  - Extend the short debug preset union with `claim-chow-then-kong`.
- `src/domain/tavern-short-gambling-runtime.ts`
  - Add optional `deckTopCardIds` support and define the new deterministic debug preset.
- `tests/tavern-short-gamble-ui-contract.test.cjs`
  - Lock the new gamble-choice entry while preserving the current button-skin contract.
- `tests/tavern-short-gamble-house.test.cjs`
  - Lock tavern session behavior for selecting, consuming, and clearing the one-shot preset.
- `tests/tavern-short-gamble-domain.test.cjs`
  - Lock the new preset so the same hand reaches `chow` first and `kong` later.
- `docs/special-house-interface.md`
  - Record the house-owned session/startup rule if the tavern session structure changes during execution.
- `docs/change-log.md`
  - Record the new tavern debug-entry/session/runtime behavior after implementation lands.
- `docs/superpowers/project-progress.md`
  - Update only if this child is promoted for execution or later moved to `completed-but-open` / `closed`.
- `docs/superpowers/plans/2026-08-05-tavern-short-chow-kong-debug-entry-plan.md`
  - Keep execution state, progress log, and verification current.

### Existing files expected to be deleted

- `none`

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - `The gamble-choice overlay exposes the new tavern-owned test entry without changing the shared wager debug-toggle contract.`
  - `Selecting the new entry stores a one-shot pending preset, confirm-gamble consumes and clears it, and the persistent claim-cycle mode still works unchanged.`
  - `The new deterministic debug preset reaches a human chow window first and a human kong window later in the same hand.`
- Required commands:
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json`
  - `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-ui-contract.test.cjs tests/tavern-short-gamble-house.test.cjs tests/tavern-short-gamble-domain.test.cjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`

## Task 1: Lock The Gamble-Choice Entry And One-Shot Tavern Session Contract

**Files:**
- Modify: `tests/tavern-short-gamble-ui-contract.test.cjs`
- Modify: `tests/tavern-short-gamble-house.test.cjs`
- Modify: `src/domain/house-modules/tavern-session.ts`
- Modify: `src/application/house-modules/tavern/tavern-house-module.ts`
- Read: `src/application/house-modules/tavern/tavern-short-gamble-session.ts`

**Interfaces:**
- Consumes:
  - existing tavern `gamble-choice` overlay option array
  - existing `toggle-short-debug-claim-cycle` wager-overlay toggle
  - existing `confirm-gamble` short-table startup path
- Produces:

```ts
export type TavernPendingShortDebugPreset = "claim-chow-then-kong" | null;

export type TavernGambleChoiceOptionId =
  | TavernGambleVariant
  | "short-debug-chow-kong";

type TavernSessionState = {
  pendingShortDebugPreset: TavernPendingShortDebugPreset;
  // existing fields unchanged
};
```

```ts
const SELECT_SHORT_DEBUG_CHOW_KONG_ACTION_ID =
  "choose-short-table-debug-chow-kong";
```

- [x] **Step 1: Add failing UI and house-session tests**

Write these focused regressions before implementation:

- in `tests/tavern-short-gamble-ui-contract.test.cjs`, add a gamble-choice assertion that the new `choose-short-table-debug-chow-kong` option renders through the existing typed option loop and still carries the current `c-tavern-gamble__button-skin` class;
- in `tests/tavern-short-gamble-house.test.cjs`, add a tavern flow test that:
  - opens `open-gamble`;
  - selects `choose-short-table-debug-chow-kong`;
  - asserts `currentGambleVariant === "short"` and `pendingShortDebugPreset === "claim-chow-then-kong"`;
  - confirms the wager;
  - asserts `pendingShortDebugPreset === null`, `shortDebugPresetMode === "off"`, and `gambleSession.variant === "short"`;
- keep the existing `toggle-short-debug-claim-cycle` regression intact so this new one-shot path cannot silently replace the multi-hand cycle.

- [x] **Step 2: Run the targeted tests to confirm they fail**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-ui-contract.test.cjs tests/tavern-short-gamble-house.test.cjs
```

Expected:

- `FAIL`
- The failure should report the missing gamble-choice entry and missing one-shot pending preset/session behavior.

- [x] **Step 3: Implement the tavern-owned choice and pending preset state**

Make the minimal house/session changes needed to satisfy the new contract:

- add a tavern-owned action id for the chow-then-kong debug choice;
- widen `TavernGambleChoiceOverlayState.options[*].id` beyond only `short` / `long`;
- add `pendingShortDebugPreset` to `TavernSessionState`;
- when the new choice is selected:
  - set `currentGambleVariant` to `short`;
  - set `pendingShortDebugPreset` to `claim-chow-then-kong`;
  - open the normal short wager overlay;
- when the normal `short` option is selected, explicitly clear `pendingShortDebugPreset`;
- do not add any new shared wager-overlay button or shared renderer branch;
- leave the existing `debugToggle` contract and `TOGGLE_SHORT_DEBUG_PRESET_ACTION_ID` behavior untouched.

- [x] **Step 4: Re-run the UI and house tests**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-ui-contract.test.cjs tests/tavern-short-gamble-house.test.cjs
```

Expected:

- `PASS`
- The new gamble-choice entry is fully tavern-owned and the one-shot pending preset is consumed through `confirm-gamble`.

- [x] **Step 5: Sync plan state before moving to the domain preset work**

Update this plan:

- set `Execution State.Status` to `running`;
- set `Execution State.Current Focus` to `Task 2: deterministic chow-then-kong preset`;
- set `Execution State.Next Step` to `Write the failing domain regression for the new preset and deck-prefix support.`;
- append a `Progress Log` entry with the exact RED/GREEN command results;
- check the completed Task 1 boxes.

- [ ] **Step 6: Commit the house/session slice**

Run:

```bash
git add docs/superpowers/plans/2026-08-05-tavern-short-chow-kong-debug-entry-plan.md src/domain/house-modules/tavern-session.ts src/application/house-modules/tavern/tavern-house-module.ts tests/tavern-short-gamble-ui-contract.test.cjs tests/tavern-short-gamble-house.test.cjs
git commit -m "feat: add tavern short debug entry state"
```

## Task 2: Add The Deterministic Chow-Then-Kong Debug Preset

**Files:**
- Modify: `tests/tavern-short-gamble-domain.test.cjs`
- Modify: `src/application/house-modules/tavern/tavern-short-gamble-session.ts`
- Modify: `src/domain/tavern-short-gambling.ts`
- Modify: `src/domain/tavern-short-gambling-runtime.ts`
- Read: `tests/tavern-short-gamble-house.test.cjs`

**Interfaces:**
- Consumes:
  - `pendingShortDebugPreset` from Task 1
  - existing persistent `debugPresetMode` cycle in `tavern-short-gamble-session.ts`
- Produces:

```ts
export type TavernShortDebugHandPreset =
  | "claim-pong"
  | "claim-kong"
  | "claim-chow"
  | "claim-chow-then-kong";
```

```ts
type TavernShortDebugHandDefinition = {
  publicCardIds: [string, string];
  handCardIdsBySeatId: Record<TavernShortSeatId, [string, string, string, string, string]>;
  deckTopCardIds?: string[];
};
```

```ts
export function createTavernShortTableSession(input: {
  playerName: string;
  buyInGold: number;
  seed: number;
  debugPresetMode?: TavernShortTableDebugPresetMode;
  firstHandDebugPreset?: TavernShortDebugHandPreset | null;
}): TavernShortTableSession;
```

- [x] **Step 1: Add the failing domain regression**

In `tests/tavern-short-gamble-domain.test.cjs`, add a deterministic regression that:

- creates a hand with `debugPreset: "claim-chow-then-kong"`;
- advances play until the first human claim window;
- asserts the available human claim kinds are exactly `["chow"]`;
- resolves that chow claim and continues advancing the same hand;
- asserts the later human claim window includes exactly `["kong"]`;
- fails if the preset cannot reliably reach both claim windows in one hand.

Use the existing short-domain helpers (`advanceTavernShortNpcAction`, `resolveTavernShortBetAction`, `claimTavernShortDiscard`, `passTavernShortClaim`, `confirmTavernShortDiscard`) rather than test-only runtime shortcuts.

- [x] **Step 2: Run the domain regression to confirm it fails**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-domain.test.cjs
```

Expected:

- `FAIL`
- The failure should show that the current debug preset family cannot yet guarantee the later `kong` window in the same hand.

- [x] **Step 3: Implement the first-hand preset plumbing and runtime definition**

Make these changes:

- add `claim-chow-then-kong` to `TavernShortDebugHandPreset`;
- extend `TavernShortDebugHandDefinition` with optional `deckTopCardIds`;
- in debug-preset deck construction:
  - keep the existing `22` unique-card validation for public cards plus starting hands;
  - validate any `deckTopCardIds` against duplicate use;
  - move `deckTopCardIds` to the front of the remaining deck in declared order;
  - preserve the existing remaining-deck order after removing the declared cards;
- extend `createTavernShortTableSession(...)` and `startShortTableHand(...)` so the first hand can prefer `firstHandDebugPreset` over the persistent `debugPresetMode`, while later hands still use the existing `claim-cycle` logic only;
- clear the one-shot preset immediately after first-hand creation so later `continue` flows cannot reuse it by accident;
- keep the existing `claim-cycle` mapping logic and tests unchanged.

- [x] **Step 4: Re-run the targeted tavern tests**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-ui-contract.test.cjs tests/tavern-short-gamble-house.test.cjs tests/tavern-short-gamble-domain.test.cjs
```

Expected:

- `PASS`
- The new first-hand-only preset works, the gamble-choice/house-session coverage stays green, and the persistent claim-cycle coverage still passes unchanged.

- [x] **Step 5: Sync plan state before docs and final verification**

Update this plan:

- keep `Execution State.Status` at `running`;
- set `Execution State.Current Focus` to `Task 3: docs sync and final verification`;
- set `Execution State.Next Step` to `Update docs/change-log plus final tavern verification.`;
- append a `Progress Log` entry with the exact RED/GREEN command results;
- check the completed Task 2 boxes.

- [ ] **Step 6: Commit the preset/runtime slice**

Run:

```bash
git add docs/superpowers/plans/2026-08-05-tavern-short-chow-kong-debug-entry-plan.md src/application/house-modules/tavern/tavern-short-gamble-session.ts src/domain/tavern-short-gambling.ts src/domain/tavern-short-gambling-runtime.ts tests/tavern-short-gamble-domain.test.cjs
git commit -m "feat: add tavern chow-kong debug preset"
```

## Task 3: Update Docs, Recheck Governance, And Run Final Verification

**Files:**
- Modify: `docs/special-house-interface.md`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/project-progress.md`
- Modify: `docs/superpowers/plans/2026-08-05-tavern-short-chow-kong-debug-entry-plan.md`

**Interfaces:**
- Consumes:
  - tavern-owned gamble-choice + one-shot session behavior from Task 1
  - first-hand-only debug preset support from Task 2
- Produces:

```md
docs/special-house-interface.md
- clarify that house-owned debug/test entry points must flow through typed overlay options plus house session state, and one-shot startup overrides must be consumed inside the house/session boundary rather than globals or main.ts branches
```

```md
docs/change-log.md
- record the new tavern short chow-then-kong test entry, one-shot pending preset flow, and deterministic deck-top debug preset support
```

- [x] **Step 1: Update the shared governance docs**

Add concise entries describing:

- the tavern short debug entry remains house-owned through typed overlay and session state;
- one-shot startup overrides must be consumed inside the house/session boundary and must not leak into global runtime state;
- the short runtime now supports a debug-only `deckTopCardIds` prefix for deterministic preset setup.

- [x] **Step 2: Run the final verification sweep**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-ui-contract.test.cjs tests/tavern-short-gamble-house.test.cjs tests/tavern-short-gamble-domain.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json
```

Expected:

- `PASS`
- Plan lint passes, the targeted tavern regressions pass, and the full source typecheck remains green.

- [x] **Step 3: Sync plan and project-progress state**

Update this plan:

- set `Execution State.Status` to `completed-but-open` after local verification succeeds;
- set `Execution State.Last Updated` to the execution date;
- set `Execution State.Current Focus` to `Local implementation complete; waiting for review/push decision.`;
- set `Execution State.Next Step` to `Review the diff, decide whether to push, and only then close the child.`;
- set `Execution State.Verification` to the exact final command results;
- append a `Progress Log` entry with the final verification summary;
- check the completed Task 3 boxes.

If this child is promoted for execution, also update `docs/superpowers/project-progress.md` so:

- `Current Child` / `Current Task` point at this tavern short chow-kong child while it is active;
- `Current Child Status` / `Current Task Status` become `completed-but-open` after verification;
- `Next Required Action` points at review/push;
- `Next Owner Document` stays on this plan until closeout.

- [ ] **Step 4: Commit the docs and final verification state**

Run:

```bash
git add docs/special-house-interface.md docs/change-log.md docs/superpowers/project-progress.md docs/superpowers/plans/2026-08-05-tavern-short-chow-kong-debug-entry-plan.md
git commit -m "docs: record tavern chow-kong debug entry"
```

## Exit Check

- [x] The new chow-then-kong test entry renders through tavern gamble-choice option data instead of a shared wager-overlay branch.
- [x] Selecting the new entry stores a typed one-shot pending preset and `confirm-gamble` clears it after first-hand creation.
- [x] The new `claim-chow-then-kong` preset deterministically reaches a human `chow` window first and a human `kong` window later in the same hand.
- [x] The existing persistent `toggle-short-debug-claim-cycle` coverage remains green and unchanged.
- [x] `docs/special-house-interface.md` and `docs/change-log.md` are updated if execution changes tavern runtime/session structure.
- [x] Project progress sync is updated if this child is promoted or later closed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Replace when closing.`
- Parent Task: `House Local Gameplay`
- Parent Stage: `House Local Gameplay`
- Closeout Status: `closed`
- Project Progress Synced: `yes/no`
- Next Child: `Replace when closing.`
- Next Child Status: `waiting/running/blocked/none`
- Next Required Action: `Replace when closing.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `Replace when closing.`
- Push Status: `success/failure/not-pushed`
- Push Commit: `commit-sha-or-none`
- Resume From: `Replace when closing.`
