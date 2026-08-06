# Tavern Short NPC Hidden Hand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add real-time concealed-hand visuals for the three NPC seats in the tavern short table so the visible stack count always matches each NPC's live hidden hand count without revealing card identity.

**Architecture:** Introduce one dedicated tavern application class that converts live short-hand state into explicit NPC `hiddenHandTiles` view data, then extend the short seat renderer to consume that typed field without inferring count from domain state. Keep the player seat unchanged, render only NPC back-face tiles, and drive the palette by explicit `top` / `mid` / `base` tone values rather than hardcoded renderer branches.

**Tech Stack:** TypeScript tavern application/domain/UI modules, CommonJS `.test-dist` test flow, Node-based targeted contract tests, `tools/lint-superpowers-plans.mjs`, and repository docs under `docs/superpowers/`.

## Global Constraints

- Only the three NPC seats render the concealed-hand stack.
- The player seat keeps the existing explicit hand row and does not gain a second concealed-hand stack.
- Concealed-hand count must follow live short-hand state exactly, including NPC draw `+1` and immediate count reduction after chow / pong / kong.
- `pendingIncomingCard.source === "claim"` must not create a fake extra concealed tile.
- The renderer may consume only the new typed `hiddenHandTiles` field and must not inspect raw `player.hand.length` or tavern phase state directly.
- Use a new dedicated builder class; do not bury the hidden-hand count/tone logic inline inside `renderShortSeat()` or `selectTavernShortGambleOverlay()`.
- If the shared short overlay contract changes, update `docs/special-house-interface.md` and `docs/change-log.md`.
- Canonical project progress currently points at `docs/superpowers/plans/2026-08-05-tavern-short-tile-sorting-plan.md`, so this child remains `waiting` until explicitly promoted.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-08-05`
- Current Focus: `Implementation and final governance verification are complete locally: Task 1 builder + shared-doc sync landed in 42f88b4, Task 2 renderer/CSS/UI contract work landed in 9e5f3ad, and the final reviewer found no code-level requirement issues.`
- Next Step: `Decide whether to keep the two local commits local, cherry-pick them into the canonical tavern short child, or separately stage the still-local hidden-hand plan/spec docs before any push.`
- Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\tavern-short-gamble-house.test.cjs`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\tavern-short-gamble-ui-contract.test.cjs`; `git diff --check` all PASS, with `git diff --check` reporting only LF-to-CRLF working-copy warnings and no whitespace errors.`
- Notes: `Executed as a non-canonical local child while docs/superpowers/project-progress.md still points at Tavern Short Tile Sorting; docs/special-house-interface.md and docs/change-log.md were already updated during Task 1 because hiddenHandTiles changed the shared short overlay contract. Final review found no code-level regressions, but this child's plan/spec docs are still local-only until they are explicitly staged or committed.`

## Progress Log

- 2026-08-05
  - Summary: `Executed the full Tavern Short NPC Hidden Hand child locally: Task 1 added the dedicated TavernShortNpcHiddenHandStackBuilder plus shared hiddenHandTiles contract/docs updates in 42f88b4, and Task 2 added NPC concealed-hand seat rendering, token-backed back-face palette styling, and UI contract coverage in 9e5f3ad.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\tavern-short-gamble-house.test.cjs`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\tavern-short-gamble-ui-contract.test.cjs`; `git diff --check` all PASS, with `git diff --check` reporting only LF-to-CRLF working-copy warnings and no whitespace errors.`
  - Next: `Decide whether to keep the two local commits local, fold them into the canonical tavern short child, or explicitly stage the still-local hidden-hand plan/spec docs before any push.`

- 2026-08-05
  - Summary: `Created the NPC hidden-hand spec and implementation plan for tavern short, covering the new dedicated builder class, typed hidden-hand seat field, NPC-only seat rendering, and real-time concealed count synchronization.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs`
  - Next: `Promote or explicitly start this child, then write the Task 1 RED overlay/house tests.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-05-tavern-short-npc-hidden-hand-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `Short seat rows still expose summary, melds, and discards, but no concealed-hand visual field.`
  - `The current short seat renderer still owns only summary / meld / discard section placement.`
  - `The existing player-hand row remains the only visible hand surface for the human seat and must stay that way.`

## Implementation Scope

### In Scope

- Add one dedicated tavern application builder class that converts live NPC concealed hand state into typed hidden-hand tile view data.
- Extend the short-table seat overlay contract with `hiddenHandTiles`.
- Populate `hiddenHandTiles` only for NPC seats and keep the player seat empty.
- Render an NPC hidden-hand strip between seat summary and public rows.
- Add hidden-hand CSS for overlapping back-only tiles with explicit `top` / `mid` / `base` tone classes.
- Add RED/GREEN coverage for count synchronization, markup placement, and CSS contract.
- Update shared house/change-log docs if the short overlay contract change qualifies as a shared interface change.

### Still Out Of Scope

- Revealing NPC card labels or suit/rank identity.
- Adding a concealed-hand strip for the player seat.
- Changing tavern short game rules, betting flow, claim flow, or showdown layout.
- Extending the same visual to the long-table variant in this child.
- Repositioning discard lanes or meld lanes beyond what is required to insert the concealed-hand strip.

## File Map

### Existing files to modify

- `src/domain/house-module.ts`
  - Extend the short gamble-table `playerRows` contract with `hiddenHandTiles`.
- `src/application/house-modules/tavern/tavern-short-gamble-view-model.ts`
  - Build and attach the new NPC hidden-hand tile models.
- `src/ui/views/house/tavern-house-view.ts`
  - Render the new concealed-hand section for NPC seats.
- `src/styles/tea-house.css`
  - Add hidden-hand layout and tone styling.
- `tests/tavern-short-gamble-house.test.cjs`
  - Lock house-level view-model integration for NPC hidden-hand counts.
- `tests/tavern-short-gamble-ui-contract.test.cjs`
  - Lock overlay, markup, and CSS contract details.
- `docs/special-house-interface.md`
  - Record the new typed seat-facing hidden-hand field if the shared overlay contract changes.
- `docs/change-log.md`
  - Record the short-table NPC hidden-hand addition.
- `docs/superpowers/plans/2026-08-05-tavern-short-npc-hidden-hand-plan.md`
  - Keep execution state, progress log, and verification current.

### Existing files expected to be deleted

- `none`

### New files to create

- `src/application/house-modules/tavern/tavern-short-npc-hidden-hand-stack-builder.ts`
  - Dedicated builder class for live NPC concealed-hand counts and tone assignment.

## Verification Plan

- Targeted verification:
  - NPC seat `hiddenHandTiles` counts match the live concealed-hand count.
  - Pending NPC draw adds one temporary concealed tile, while `source === "claim"` does not.
  - Player seat does not expose a concealed-hand stack.
  - NPC short-seat markup renders blank back-only tiles with explicit tone classes.
  - CSS keeps the hidden-hand strip overlapped and free of visible face text.
- Required commands:
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\tavern-short-gamble-house.test.cjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\tavern-short-gamble-ui-contract.test.cjs`

## Task 1: Build The NPC Hidden-Hand View Model

**Files:**
- Create: `src/application/house-modules/tavern/tavern-short-npc-hidden-hand-stack-builder.ts`
- Modify: `src/domain/house-module.ts`
- Modify: `src/application/house-modules/tavern/tavern-short-gamble-view-model.ts`
- Modify: `tests/tavern-short-gamble-house.test.cjs`
- Modify: `tests/tavern-short-gamble-ui-contract.test.cjs`

**Interfaces:**
- Consumes:
  - `TavernShortHandState`
  - `TavernShortPlayerState`
  - `pendingIncomingCard`
- Produces:

```ts
export type TavernShortHiddenHandTone = "top" | "mid" | "base";

export type TavernShortHiddenHandTileViewModel = {
  id: string;
  tone: TavernShortHiddenHandTone;
};

export class TavernShortNpcHiddenHandStackBuilder {
  buildForSeat(input: {
    hand: TavernShortHandState;
    player: TavernShortPlayerState;
    viewerSeatId: string;
  }): TavernShortHiddenHandTileViewModel[];
}
```

```ts
hiddenHandTiles?: Array<{
  id: string;
  tone: "top" | "mid" | "base";
}>;
```

- [x] **Step 1: Write the failing overlay/house tests**

Add RED coverage that proves:

- NPC seats expose `hiddenHandTiles` with one item per concealed card;
- the player seat exposes `hiddenHandTiles: []` or omits the field;
- an NPC with `pendingIncomingCard.source === "draw"` gets one temporary extra hidden tile;
- an NPC with `pendingIncomingCard.source === "claim"` does not get that extra tile;
- tones are assigned `top`, `mid`, then `base` for third-and-beyond tiles.

Use representative assertions like:

```js
assert.deepEqual(
  travelerRow.hiddenHandTiles.map((tile) => tile.tone),
  ["top", "mid", "base", "base", "base"]
);
assert.equal(youRow.hiddenHandTiles?.length ?? 0, 0);
assert.equal(brokerRow.hiddenHandTiles.length, 4);
```

- [x] **Step 2: Run the targeted tests to confirm RED**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\tavern-short-gamble-house.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\tavern-short-gamble-ui-contract.test.cjs
```

Expected:

- `FAIL`
- failures point at the missing `hiddenHandTiles` contract and missing builder output

- [x] **Step 3: Implement the new builder class and view-model wiring**

Create `tavern-short-npc-hidden-hand-stack-builder.ts` with minimal logic:

```ts
function getNpcHiddenHandCount(...) {
  return pendingDraw ? player.hand.length + 1 : player.hand.length;
}

function toHiddenHandTone(index: number): "top" | "mid" | "base" {
  return index === 0 ? "top" : index === 1 ? "mid" : "base";
}
```

Then wire it into `selectTavernShortGambleOverlay()` so each NPC row receives:

```ts
hiddenHandTiles: builder.buildForSeat({
  hand,
  player,
  viewerSeatId: table.playerSeatId,
})
```

Keep the player row empty and avoid any renderer-local count inference.

- [x] **Step 4: Re-run the targeted tests to confirm GREEN**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\tavern-short-gamble-house.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\tavern-short-gamble-ui-contract.test.cjs
```

Expected:

- `PASS`
- the short overlay now exposes stable NPC hidden-hand tile data

- [x] **Step 5: Commit the builder slice**

Run:

```bash
git add src/application/house-modules/tavern/tavern-short-npc-hidden-hand-stack-builder.ts src/domain/house-module.ts src/application/house-modules/tavern/tavern-short-gamble-view-model.ts tests/tavern-short-gamble-house.test.cjs tests/tavern-short-gamble-ui-contract.test.cjs
git commit -m "feat: add tavern short npc hidden hand builder"
```

## Task 2: Render The NPC Hidden-Hand Seat Strip

**Files:**
- Modify: `src/ui/views/house/tavern-house-view.ts`
- Modify: `src/styles/tea-house.css`
- Modify: `tests/tavern-short-gamble-ui-contract.test.cjs`

**Interfaces:**
- Consumes:
  - `playerRows[].hiddenHandTiles`
- Produces:

```ts
function renderShortSeatHiddenHand(
  tiles: Array<{ id: string; tone: "top" | "mid" | "base" }>
): string;
```

- [x] **Step 1: Write the failing markup/CSS tests**

Add RED coverage that proves:

- NPC seat markup contains a dedicated hidden-hand container between summary and public rows;
- the player seat markup omits that container;
- hidden-hand tiles render no visible card label text;
- tone classes for `top`, `mid`, and `base` appear in the markup or CSS contract;
- hidden-hand CSS overlaps the tiles instead of spacing them apart like normal discard cards.

Use representative assertions like:

```js
assert.match(markup, /class="c-tavern-gamble__seat-hidden-hand"/u);
assert.doesNotMatch(markup, /class="c-tavern-gamble__seat--short-0"[\s\S]*c-tavern-gamble__seat-hidden-hand/u);
assert.match(teaHouseCss, /\.c-tavern-gamble__tile--hidden-hand-top/u);
```

- [x] **Step 2: Run the UI contract test to confirm RED**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\tavern-short-gamble-ui-contract.test.cjs
```

Expected:

- `FAIL`
- failures show the missing hidden-hand markup and CSS contract

- [x] **Step 3: Implement the seat helper and hidden-hand CSS**

Add `renderShortSeatHiddenHand()` and extend the short seat section order to include `hidden-hand`.

Render blank hidden tiles like:

```html
<div class="c-tavern-gamble__seat-hidden-hand">
  <span class="c-tavern-gamble__tile c-tavern-gamble__tile--hidden-hand c-tavern-gamble__tile--hidden-hand-top"></span>
</div>
```

Then add CSS classes for:

- `.c-tavern-gamble__seat-hidden-hand`
- `.c-tavern-gamble__tile--hidden-hand`
- `.c-tavern-gamble__tile--hidden-hand-top`
- `.c-tavern-gamble__tile--hidden-hand-mid`
- `.c-tavern-gamble__tile--hidden-hand-base`

Keep the tile face blank and use tokens for the blue / dark-blue / gray palette.

- [x] **Step 4: Re-run the UI contract suite**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\tavern-short-gamble-ui-contract.test.cjs
```

Expected:

- `PASS`
- NPC seats now render the concealed-hand strip with overlapping back-only tiles

- [x] **Step 5: Commit the renderer/CSS slice**

Run:

```bash
git add src/ui/views/house/tavern-house-view.ts src/styles/tea-house.css tests/tavern-short-gamble-ui-contract.test.cjs
git commit -m "feat: render tavern short npc hidden hands"
```

## Task 3: Sync Docs And Record Verification

**Files:**
- Modify: `docs/special-house-interface.md`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/project-progress.md`
- Modify: `docs/superpowers/plans/2026-08-05-tavern-short-npc-hidden-hand-plan.md`

**Interfaces:**
- Consumes:
  - finished NPC hidden-hand builder, renderer, and CSS work
- Produces:
  - synchronized docs and verification record

- [x] **Step 1: Write the shared-doc updates**

Record:

- the new seat-facing `hiddenHandTiles` structured field in `docs/special-house-interface.md` if the shared overlay contract changed;
- the tavern short NPC hidden-hand addition in `docs/change-log.md`;
- a local progress-log entry in `docs/superpowers/project-progress.md` if this child is executed without becoming the canonical current child.

- [x] **Step 2: Run full verification**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\tavern-short-gamble-house.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\tavern-short-gamble-ui-contract.test.cjs
git diff --check
```

Expected:

- `PASS`
- documentation and NPC hidden-hand contracts are synchronized

- [x] **Step 3: Record the execution state**

If implementation is complete but unpushed, set:

- `Execution State.Status` to `completed-but-open`
- `Execution State.Next Step` to `Review the local diff, then decide whether to commit/push the tavern short NPC hidden-hand batch or keep it local.`

If the child later becomes canonical and fully closes, add the required `## Child Closeout` block.

## Exit Check

- [x] The new builder class owns NPC hidden-hand count and tone mapping.
- [x] NPC seat rows expose `hiddenHandTiles` while the player seat does not.
- [x] NPC concealed-hand count stays synchronized with draw, discard, chow, pong, and kong.
- [x] Short seat markup renders a dedicated concealed-hand strip with blank back-only tiles.
- [x] Targeted house and UI contract tests pass.
- [x] Shared docs are updated if the interface/ownership wording changed.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `not closed`
- Parent Task: `Tavern Short NPC Hidden Hand`
- Parent Stage: `House Local Gameplay`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `yes`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Decide whether to keep the local commits as-is, fold them into the canonical tavern short child, or explicitly stage the still-local hidden-hand plan/spec docs before any push.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-08-05-tavern-short-tile-sorting-plan.md`
- Push Status: `not-pushed`
- Push Commit: `9e5f3ad`
- Resume From: `Open docs/superpowers/project-progress.md, confirm the canonical current child still stays on Tavern Short Tile Sorting, then decide whether the hidden-hand commits 42f88b4 and 9e5f3ad stay local, get cherry-picked, or get pushed together with the still-local hidden-hand plan/spec docs.`
