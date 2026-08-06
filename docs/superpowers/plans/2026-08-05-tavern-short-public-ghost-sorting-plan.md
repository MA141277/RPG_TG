# Tavern Short Public Ghost Sorting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend tavern short-table sorting so revealed public cards also appear as sortable ghost entries inside the player hand row while the center public-card lane stays visible, and keep those ghost entries permanently non-playable and non-discardable.

**Architecture:** Layer a short-owned `displayOrderEntries` state on top of the existing tavern short hand/session model, reconcile it centrally through `normalizeTavernShortActiveHand()` / `updateTavernShortTableSession()`, project typed hand-row roles in the tavern short view-model, and keep `src/ui/views/house/house-sortable-tile-runtime.ts` generic by passing opaque sortable entry ids through the existing `data-house-*` seam. No new tavern business branch lands in `src/main.ts`, and public ghosts never become real business hand cards.

**Tech Stack:** TypeScript tavern domain/application/view modules, the already-extracted shared house sortable runtime, CommonJS focused tests under `.test-dist`, `npm run lint:plans` intent satisfied through the bundled Node plan-lint script when needed, targeted `node --test` suites, and repository typechecks via bundled TypeScript.

## Global Constraints

- Do not add tavern business logic back into `src/main.ts`.
- Keep `house-sortable-tile-runtime` generic; it may move opaque payload strings only and must not learn tavern public-card semantics.
- Public ghosts remain display-order entries only. They must never be inserted into `player.hand`, `publicCards`, or `pendingIncomingCard`.
- The center public-card lane remains visible and is never user-reordered by hand-row sorting.
- Sorting must stay available during active short-hand phases, including `draw-discard`, while discard arming / confirm-discard continue to operate only on real discard candidates.
- Any sortable entry id serialized into `gamble-short-reorder:` must stay separator-safe for the current `prefix + payload + ":" + before` action format.
- The working tree is already dirty; do not revert unrelated local changes while preparing or later executing this child.
- Canonical project progress is already synchronized to this owner doc; if this child's status changes again, update `docs/superpowers/project-progress.md` in the same batch.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-08-06`
- Current Focus: `Closeout: Tavern Short Public Ghost Sorting is locally complete and fully verified.`
- Next Step: `Review the local diff, then decide whether to keep the tavern short public-ghost sorting batch local or commit/push it.`
- Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-display-order-domain.test.cjs tests/tavern-short-gamble-reorder-domain.test.cjs tests/tavern-short-gamble-house.test.cjs tests/tavern-short-gamble-ui-contract.test.cjs tests/house-sortable-tile-runtime.test.cjs` PASS (70 tests, 70 pass, 0 fail); `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json` PASS
- Notes: `Task 2 review gaps were addressed during closeout: public ghosts now have a dedicated ghost style hook, disabled sort markup is explicit, and renderer-level inertness is locked by UI contract coverage.`

## Progress Log

- 2026-08-06
  - Summary: `Applied a visual follow-up to the completed Tavern Short Public Ghost Sorting child: projected public ghost tiles in the short hand row no longer inherit the short-hand opaque overrides and now render as permanent whole-card semi-transparent placeholder ghosts across the whole tile stack, while keeping the existing non-playable/reorderable contract unchanged.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-ui-contract.test.cjs` PASS (30 tests, 30 pass, 0 fail)
  - Next: `Review the verified local diff, then decide whether to keep this completed-but-open child local or commit/push it.`

- 2026-08-05
  - Summary: `Addressed the scoped Task 2 review gaps and completed Task 3 locally for Tavern Short Public Ghost Sorting: public ghosts now render through a dedicated softer ghost class and stay render-layer inert, tavern short reorder actions now carry separator-safe display-order entry ids across betting/draw-discard/claim-window, shared sortable runtime coverage now proves those payloads stay opaque, and shared docs are synchronized to the final contract. The child now sits at completed-but-open because the verified batch is still local and not pushed.`
  - Verification: `Task 2 fix round -> C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-ui-contract.test.cjs` PASS (30 tests, 30 pass, 0 fail). Task 3 RED -> `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-reorder-domain.test.cjs tests/tavern-short-gamble-house.test.cjs` FAIL with tavern house dispatch still leaving `displayOrderEntries` unchanged under raw-card reorder parsing. Task 3 GREEN/full verification -> `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-display-order-domain.test.cjs tests/tavern-short-gamble-reorder-domain.test.cjs tests/tavern-short-gamble-house.test.cjs tests/tavern-short-gamble-ui-contract.test.cjs tests/house-sortable-tile-runtime.test.cjs` PASS (70 tests, 70 pass, 0 fail); `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json` PASS
  - Next: `Review the verified local diff, then decide whether to keep this completed-but-open child local or commit/push it.`

- 2026-08-05
  - Summary: `Completed Task 2 locally for Tavern Short Public Ghost Sorting: wrote the RED UI contract coverage for mixed short hand-row entries, active-phase sort gating, and public-ghost drag payloads; then projected separator-safe display-order entries into the short overlay while keeping the center public-card lane intact and leaving public ghosts non-playable.`
  - Verification: `RED -> C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-ui-contract.test.cjs` FAIL with missing `sortEntryId` / `role` projection, missing `public-ghost|...` drag payloads, and stale assumptions that post-claim hand rows contained only real hand cards. GREEN -> `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-ui-contract.test.cjs` PASS (30 tests, 30 pass, 0 fail)`
  - Next: `Write the failing reorder/house coverage for entry-id based short sorting before changing tavern-house dispatch.`

- 2026-08-05
  - Summary: `Completed Task 1 locally for Tavern Short Public Ghost Sorting: wrote the RED display-order domain/session tests, confirmed they failed on the missing display-order helpers, then added separator-safe mixed display-order state plus session normalization reconciliation until the focused suite turned green. The task review then required the plan-state sync, which is now recorded here.`
  - Verification: `RED -> C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-display-order-domain.test.cjs` FAIL with missing `syncTavernShortDisplayOrderEntries` and missing `displayOrderEntries` session state. GREEN -> `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-display-order-domain.test.cjs` PASS (4 tests, 4 pass, 0 fail); `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs` PASS
  - Next: `Write the failing short UI contract tests for mixed hand-row projection and confirm the current overlay fails RED before changing the view-model.`

- 2026-08-05
  - Summary: `Promoted this child from waiting to running after the user approved Subagent-Driven execution in the current workspace. Canonical project-progress now points at this plan, and the next concrete step is the Task 1 RED pass for tavern short display-order reconciliation.`
  - Verification: `docs/superpowers/project-progress.md` synced to Tavern Short Public Ghost Sorting; `.superpowers/sdd/2026-08-05-tavern-short-public-ghost-sorting-plan/` initialized with `progress.md` and `task-1-brief.md`
  - Next: `Dispatch the Task 1 implementer and confirm the missing display-order helpers fail RED.`

- 2026-08-05
  - Summary: `Created the governed implementation plan for tavern short public ghost sorting from the approved design spec, scoped it as a non-canonical waiting child, and anchored it to the already-landed shared sortable runtime plus current short reorder seam.`
  - Verification: `npm run lint:plans` intent satisfied via `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs` PASS because global `npm` is unavailable in this shell
  - Next: `Keep this child waiting until the user promotes it, then begin Task 1 RED on display-order state + reconciliation coverage.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-05-tavern-short-public-ghost-sorting-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `The repo already contains the shared house sortable runtime and the tavern short gamble-short-reorder seam from the earlier Tavern Short Tile Sorting child. This child reuses that runtime instead of reopening the extraction.`
  - `This child closed the baseline mismatches it was created to address: short overlay hand rows now project public ghosts through typed display-order entries, sorting stays active during draw-discard / claim-window, and short reorder dispatch now consumes separator-safe entry ids instead of raw card ids.`
  - `Canonical project progress is synchronized to this owner doc, and the child now remains completed-but-open pending a keep-local vs commit/push decision.`

## Implementation Scope

### In Scope

- Add a short-owned `displayOrderEntries` layer that can represent real hand entries, incoming-draw entries, and public-ghost entries for the current hand only.
- Reconcile that mixed display-order layer centrally when a short hand starts, when the human auto-draw normalization runs, and when revealed public-card or incoming-card visibility changes.
- Project typed tavern short hand-row entries with stable sortable entry ids, explicit roles, and non-playable public-ghost behavior while keeping the center public-card lane intact.
- Change tavern short sorting availability to remain enabled throughout active-hand phases, including `betting`, `draw-discard`, and `claim-window`.
- Upgrade the tavern short typed reorder path from raw hand-card ids to display-order entry ids without teaching the shared sortable runtime tavern semantics.
- Add focused domain/house/UI regressions that prove public ghosts can be reordered but can never be played/discarded.
- Update shared house/change-log documentation because this child changes shared short overlay/runtime ownership contracts.

### Still Out Of Scope

- Long-table public-card behavior or long-table hand sorting.
- Removing or visually replacing the existing center short-table public-card lane.
- Converting public cards into real player hand cards or changing showdown/scoring ownership.
- Reworking tavern short betting, claim resolution, NPC decision logic, or debug presets beyond what is necessary to surface the new mixed hand-row state.
- Replacing `house-sortable-tile-runtime` with a tavern-specific runtime.

## File Map

### Existing files to modify

- `src/domain/tavern-short-gambling.ts`
  - Export the new display-order types and pure helper signatures from the tavern short domain seam.
- `src/domain/tavern-short-gambling-runtime.ts`
  - Own separator-safe entry-id serialization, display-order reconciliation, and mixed-order reordering for tavern short hands.
- `src/application/house-modules/tavern/tavern-short-gamble-session.ts`
  - Reconcile the short display-order layer centrally through `normalizeTavernShortActiveHand()` / `updateTavernShortTableSession()`.
- `src/domain/house-module.ts`
  - Extend the short gamble overlay hand-card contract with typed sortable entry metadata and ghost role information.
- `src/application/house-modules/tavern/tavern-short-gamble-view-model.ts`
  - Project mixed hand-row entries, keep the center `publicCards` lane, and expose the new active-phase `handSortEnabled` rules.
- `src/application/house-modules/tavern/tavern-house-module.ts`
  - Parse `gamble-short-reorder:` payloads as display-order entry ids and route them to the new tavern short display-order mutation path.
- `src/ui/views/house/tavern-house-view.ts`
  - Render the mixed hand row using `sortEntryId` payloads and apply a dedicated ghost class without adding discard actions to public ghosts.
- `src/styles/tea-house.css`
  - Add/adjust the short-hand ghost treatment so public ghosts preserve tile depth styling but remain visibly softer than real hand cards.
- `tests/tavern-short-gamble-reorder-domain.test.cjs`
  - Lock mixed display-order reorder semantics, especially raw-hand stability versus ghost-entry movement.
- `tests/tavern-short-gamble-house.test.cjs`
  - Lock tavern-house dispatch of `gamble-short-reorder:` when the payload refers to public ghosts or draw-discard sorting.
- `tests/tavern-short-gamble-ui-contract.test.cjs`
  - Lock the overlay/markup contract for center public cards plus hand-row ghosts, active-phase sort gating, and ghost non-playability.
- `tests/house-sortable-tile-runtime.test.cjs`
  - Only adjust if needed to prove the shared runtime remains payload-opaque with the new tavern short entry-id strings.
- `docs/special-house-interface.md`
  - Record the shared short overlay/runtime contract changes because sortable house entries no longer imply playable tavern cards.
- `docs/change-log.md`
  - Record the new tavern short public-ghost sorting behavior and ownership boundary.
- `docs/superpowers/project-progress.md`
  - Update only if this child is later promoted, completed-but-open, or closed.
- `docs/superpowers/plans/2026-08-05-tavern-short-public-ghost-sorting-plan.md`
  - Keep execution state, progress log, and verification current.

### Existing files expected to be deleted

- `none`

### New files to create

- `tests/tavern-short-gamble-display-order-domain.test.cjs`
  - Focused pure-domain coverage for display-order initialization/reconciliation and separator-safe tavern short sortable entry ids.

## Verification Plan

- Targeted verification:
  - `normalizeTavernShortActiveHand()` / `updateTavernShortTableSession()` preserve mixed display order while appending/removing public ghosts as short-hand facts change.
  - The short overlay still renders the original center `publicCards` lane and now also projects public ghosts into `handCards` with stable `sortEntryId` values.
  - `gamble-short-reorder:` accepts separator-safe display-order entry ids and remains valid during `draw-discard` without making public ghosts playable.
  - Confirm-discard and armed-discard UI continue to use only true discard candidates.
  - `house-sortable-tile-runtime` remains generic and works with the new payload strings without tavern-specific branches.
- Required commands:
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json`
  - `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-display-order-domain.test.cjs tests/tavern-short-gamble-reorder-domain.test.cjs tests/tavern-short-gamble-house.test.cjs tests/tavern-short-gamble-ui-contract.test.cjs tests/house-sortable-tile-runtime.test.cjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`

## Task 1: Add Short Display-Order State And Central Reconciliation

**Files:**
- Modify: `src/domain/tavern-short-gambling.ts`
- Modify: `src/domain/tavern-short-gambling-runtime.ts`
- Modify: `src/application/house-modules/tavern/tavern-short-gamble-session.ts`
- Create: `tests/tavern-short-gamble-display-order-domain.test.cjs`

**Interfaces:**
- Consumes:
  - existing `TavernShortHandState`
  - existing `publicCards`, `pendingIncomingCard`, and human visible-hand ownership rules
  - `normalizeTavernShortActiveHand(session, hand)` as the session-level normalization seam
- Produces:

```ts
export type TavernShortDisplayOrderEntryKind =
  | "hand"
  | "incoming-draw"
  | "public-ghost";

export type TavernShortDisplayOrderEntry = {
  kind: TavernShortDisplayOrderEntryKind;
  cardId: string;
};

export type TavernShortDisplayOrderEntryId =
  `${TavernShortDisplayOrderEntryKind}|${string}`;

export function toTavernShortDisplayOrderEntryId(
  entry: TavernShortDisplayOrderEntry
): TavernShortDisplayOrderEntryId;

export function syncTavernShortDisplayOrderEntries(
  hand: TavernShortHandState,
  seatId: string
): TavernShortHandState;

export function reorderTavernShortDisplayOrderEntries(
  hand: TavernShortHandState,
  seatId: string,
  entryId: TavernShortDisplayOrderEntryId,
  beforeEntryId: TavernShortDisplayOrderEntryId | null
): TavernShortHandState;
```

- [x] **Step 1: Write the failing pure-domain tests for display-order state**

Add `tests/tavern-short-gamble-display-order-domain.test.cjs` with focused regressions that prove:

- a fresh short hand initializes `displayOrderEntries` from the human visible hand and appends currently revealed public ghosts;
- entry ids are separator-safe strings such as `hand|wan-2` and `public-ghost|tong-7`, not colon-bearing ids;
- when a new public card becomes visible, reconciliation appends the new public ghost without destroying the existing mixed order;
- when an incoming draw card becomes visible/hidden, the `incoming-draw` entry is added/removed while the rest of the order stays stable;
- if an unavailable ghost entry disappears, the remaining relative order is preserved.

Representative assertions:

```js
assert.deepEqual(
  hand.displayOrderEntries.map(toTavernShortDisplayOrderEntryId),
  ["hand|wan-2", "hand|tong-4", "public-ghost|wan-5", "public-ghost|tong-7"]
);
assert.equal(
  toTavernShortDisplayOrderEntryId({ kind: "public-ghost", cardId: "wan-5" }),
  "public-ghost|wan-5"
);
```

- [x] **Step 2: Run the focused display-order test to confirm RED**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-display-order-domain.test.cjs
```

Expected:

- `FAIL`
- The failure should point at the missing display-order types/helpers and reconciliation contract.

- [x] **Step 3: Implement display-order state and reconcile it centrally**

Make the minimal tavern short changes needed to satisfy the new state contract:

- extend `TavernShortHandState` with `displayOrderEntries: TavernShortDisplayOrderEntry[]`;
- implement the pure entry-id helpers and display-order reconciliation/reorder helpers in `src/domain/tavern-short-gambling-runtime.ts`;
- route `normalizeTavernShortActiveHand()` through `syncTavernShortDisplayOrderEntries()` after any auto-draw normalization so every `updateTavernShortTableSession()` result carries reconciled mixed order;
- ensure new short hands also start with initialized display-order state without relying on the view layer to synthesize it.

- [x] **Step 4: Re-run the focused display-order test**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-display-order-domain.test.cjs
```

Expected:

- `PASS`
- Taverns short hands now own a separator-safe mixed display-order layer independent from the view.

- [x] **Step 5: Sync plan state before view-model integration**

Update this plan:

- set `Execution State.Status` to `running` if the child has been promoted;
- set `Execution State.Current Focus` to `Task 2: project mixed hand-row entries and ghost styling`;
- append the RED/GREEN results to `Progress Log`.

## Task 2: Project Public Ghost Entries Into The Short Hand Row

**Files:**
- Modify: `src/domain/house-module.ts`
- Modify: `src/application/house-modules/tavern/tavern-short-gamble-view-model.ts`
- Modify: `src/ui/views/house/tavern-house-view.ts`
- Modify: `src/styles/tea-house.css`
- Modify: `tests/tavern-short-gamble-ui-contract.test.cjs`

**Interfaces:**
- Consumes:
  - `displayOrderEntries` from Task 1
  - existing short `publicCards` center-lane rendering
  - existing real discard-candidate ownership
- Produces:

```ts
type ShortGambleHandCardViewModel = {
  id: string;
  label: string;
  sortEntryId: TavernShortDisplayOrderEntryId;
  role: "hand" | "incoming-draw" | "public-ghost";
  selected: boolean;
  lifted?: boolean;
  dropping?: boolean;
  incoming?: boolean;
  actionId?: string;
};
```

- [x] **Step 1: Write the failing UI contract tests for mixed hand-row projection**

Extend `tests/tavern-short-gamble-ui-contract.test.cjs` to prove:

- the short overlay still exposes the center `publicCards` lane unchanged;
- `overlay.handCards` now includes public-ghost entries with `role === "public-ghost"` and separator-safe `sortEntryId` values;
- public ghosts never receive `gamble-play-tile:*` action ids even during `draw-discard`;
- `handSortEnabled` is true for active short phases `betting`, `draw-discard`, and `claim-window`, and false when no active hand exists or the short table is on a between-hand prompt;
- rendered hand-row markup uses `data-house-drag-payload="<sortEntryId>"` and a dedicated ghost class while the center public lane still renders the original public-card list.

Representative assertions:

```js
assert.equal(
  overlay.handCards.find((card) => card.role === "public-ghost")?.actionId,
  undefined
);
assert.equal(drawDiscardOverlay.handSortEnabled, true);
assert.match(markup, /data-house-drag-payload="public-ghost\\|wan-5"/u);
```

- [x] **Step 2: Run the focused UI contract test to confirm RED**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-ui-contract.test.cjs
```

Expected:

- `FAIL`
- The failure should show the missing `sortEntryId` / `role` projection, missing ghost markup, and the current draw-discard sort gate mismatch.

- [x] **Step 3: Implement mixed hand-row projection and ghost presentation**

Make the minimal short overlay/view changes needed to satisfy the contract:

- extend the short overlay hand-card contract in `src/domain/house-module.ts` with `sortEntryId` and `role`;
- in `tavern-short-gamble-view-model.ts`, project `displayOrderEntries` into `handCards` while keeping the original `publicCards` center lane;
- set `handSortEnabled` from active-hand / between-hand ownership instead of the current `phase !== "draw-discard"` gate;
- render `data-house-drag-payload` from `sortEntryId` in `tavern-house-view.ts`, keep public ghosts draggable, and omit discard actions from them;
- add a dedicated public-ghost style in `src/styles/tea-house.css` that preserves the short tile depth stack while giving ghosts a softer face treatment and lower opacity.

- [x] **Step 4: Re-run the focused UI contract test**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-ui-contract.test.cjs
```

Expected:

- `PASS`
- The short-table overlay now keeps the center public lane and also renders sortable public ghosts in the hand row.

## Task 3: Switch Tavern Short Reorder To Entry Ids And Preserve Discard Isolation

**Files:**
- Modify: `src/application/house-modules/tavern/tavern-house-module.ts`
- Modify: `tests/tavern-short-gamble-reorder-domain.test.cjs`
- Modify: `tests/tavern-short-gamble-house.test.cjs`
- Modify: `tests/house-sortable-tile-runtime.test.cjs`
- Modify: `docs/special-house-interface.md`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/project-progress.md`
- Modify: `docs/superpowers/plans/2026-08-05-tavern-short-public-ghost-sorting-plan.md`

**Interfaces:**
- Consumes:
  - `gamble-short-reorder:` existing action prefix
  - separator-safe `TavernShortDisplayOrderEntryId` payloads from Task 1 and Task 2
  - existing discard/confirm-discard ownership
- Produces:

```ts
const GAMBLE_SHORT_REORDER_ACTION_PREFIX = "gamble-short-reorder:";

// payload format:
// gamble-short-reorder:<entryId>:<beforeEntryId|end>
```

- [x] **Step 1: Write the failing reorder/house tests for entry-id actions**

Update `tests/tavern-short-gamble-reorder-domain.test.cjs` and `tests/tavern-short-gamble-house.test.cjs` so they prove:

- reordering `public-ghost|wan-5` before `hand|tong-4` updates only the short `displayOrderEntries` layer and does not mutate the true human hand cards;
- `gamble-short-reorder:` remains accepted during `draw-discard` and `claim-window`;
- dragging/reordering public ghosts does not arm, clear, or confirm a discard candidate;
- if runtime-specific coverage is needed, `tests/house-sortable-tile-runtime.test.cjs` still treats the payload as an opaque string and dispatches it unchanged.

Representative assertions:

```js
assert.deepEqual(
  reordered.currentHand.displayOrderEntries.map(toTavernShortDisplayOrderEntryId),
  ["hand|wan-2", "public-ghost|wan-5", "hand|tong-4", "incoming-draw|tong-9"]
);
assert.equal(reordered.currentHand.selectedDiscardCardId, null);
```

- [x] **Step 2: Run the focused reorder/house tests to confirm RED**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-display-order-domain.test.cjs tests/tavern-short-gamble-reorder-domain.test.cjs tests/tavern-short-gamble-house.test.cjs tests/house-sortable-tile-runtime.test.cjs
```

Expected:

- `FAIL`
- The failure should point at the current raw-card reorder parsing and draw-discard gating mismatch.

- [x] **Step 3: Implement entry-id reorder handling and doc sync**

Make the minimal follow-up changes needed to satisfy the contract:

- parse `gamble-short-reorder:` payloads as separator-safe display-order entry ids rather than raw card ids;
- route tavern short reorders through `reorderTavernShortDisplayOrderEntries()` and stop rejecting them solely because the hand is in `draw-discard`;
- keep discard arming / confirm-discard untouched by continuing to assign `gamble-play-tile:*` only to real playable entries in the overlay;
- update `docs/special-house-interface.md` and `docs/change-log.md` because this child changes shared tavern short overlay/runtime meaning;
- update `docs/superpowers/project-progress.md` only if this child is actually promoted or its canonical state changes.

- [x] **Step 4: Run full verification**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-display-order-domain.test.cjs tests/tavern-short-gamble-reorder-domain.test.cjs tests/tavern-short-gamble-house.test.cjs tests/tavern-short-gamble-ui-contract.test.cjs tests/house-sortable-tile-runtime.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json
```

Expected:

- `PASS`
- Tavern short public ghosts are sortable but never playable, and the shared sortable runtime remains generic.

- [x] **Step 5: Record the resulting governance state**

If the batch is done but not yet closed, set:

- `Execution State.Status` to `completed-but-open`;
- `Execution State.Next Step` to `Review the local diff, then decide whether to keep the tavern short public-ghost sorting batch local or commit/push it.`

If the child is closed later, add the full `## Child Closeout` block and synchronize `docs/superpowers/project-progress.md` before marking it `closed`.

## Exit Check

- [x] `Tavern short still renders the original center public-card lane.`
- [x] `Tavern short hand row also renders sortable public ghost entries with stable separator-safe entry ids.`
- [x] `Public ghost entries can be inserted into arbitrary hand gaps but never become playable/discardable cards.`
- [x] `Sorting remains enabled during active short-hand phases, including draw-discard.`
- [x] `Shared house sortable runtime remains tavern-agnostic.`
- [x] `Shared docs and governance state are synchronized when this child's canonical status changes.`

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Replace when closing.`
- Parent Task: `Replace when closing.`
- Parent Stage: `Replace when closing.`
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
