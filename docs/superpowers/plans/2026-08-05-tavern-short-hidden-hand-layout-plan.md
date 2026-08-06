# Tavern Short Hidden-Hand Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-anchor tavern short-table NPC concealed-hand and public tile lanes so side-seat concealed stacks use vertical outer lanes, side public lanes shift slightly inward, and the top-seat concealed stack sits to the right of the summary block without changing gameplay or overlay data.

**Architecture:** Keep the existing short-table seat data contract and renderer section order intact, and implement the approved layout as a CSS-first seat-position-specific presentation pass. Lock the new behavior with UI contract tests before changing `src/styles/tea-house.css`, then finish with the required governance sync and verification record.

**Tech Stack:** Tavern short-table HTML/CSS presentation under `src/ui/views/house/` and `src/styles/`, CommonJS UI contract tests via `.test-dist`, bundled Node/TypeScript CLI verification, and `tools/lint-superpowers-plans.mjs`.

## Global Constraints

- Only tavern short-table presentation changes.
- No change is allowed in `src/main.ts`, short-table domain rules, tavern short runtime mutations, `hiddenHandTiles` data shape, or discard/meld payload structure.
- Left and right NPC summary blocks stay fixed at their current anchors.
- Left and right NPC concealed-hand strips must become vertical stacks.
- Left and right public discard and chow/pong/kong lanes must move inward only slightly toward the center felt.
- The top NPC concealed-hand strip must move to the immediate right of the summary block.
- The top NPC discard and meld lanes must remain below the summary area.
- The bottom player seat remains unchanged.
- The current canonical progress entry still points at `docs/superpowers/plans/2026-08-05-tavern-short-tile-sorting-plan.md`, so this child must stay `waiting` until it is explicitly promoted or intentionally executed as a local non-canonical child.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-08-05`
- Current Focus: `Implementation and targeted verification are complete in the local working tree; the batch still needs clean staging or fold-in with the canonical short-table child before any commit/push decision.`
- Next Step: `Decide whether to split the overlapping short-table file changes into a clean hidden-hand-layout commit or fold this local batch into the canonical Tavern Short Tile Sorting child.`
- Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\tavern-short-gamble-ui-contract.test.cjs`; `git diff --check` all PASS, with `git diff --check` reporting only LF-to-CRLF working-copy warnings and no whitespace errors.`
- Notes: `This child intentionally kept the existing short-table data/renderer seam and finished as a CSS-first layout pass plus UI contract updates only; the task-local commit steps were deferred because the same files already contain unrelated local short-table changes.`

## Progress Log

- 2026-08-05
  - Summary: `Created the implementation plan for the approved tavern short hidden-hand layout pass, kept the work CSS-first, preserved the current hiddenHandTiles contract, and finished the required self-review plus plan lint before execution handoff.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs (PASS)`
  - Next: `Wait for the user to choose an execution mode, then start Task 1 RED.`
- 2026-08-05
  - Summary: `Executed the local hidden-hand layout batch without changing the canonical current child: Task 1 added a top-seat broker fixture plus side/top hidden-hand layout assertions, confirmed RED against the missing CSS anchors, and then updated the short-table CSS so side concealed stacks turn vertical, side public rows move inward, and the top concealed stack sits to the right of the summary block. Task 2 synchronized change-log/project-progress and recorded the child as completed-but-open because the affected files already carry unrelated local short-table edits that still need clean staging strategy.`
  - Verification: `RED -> C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\tavern-short-gamble-ui-contract.test.cjs` FAIL on the new hidden-hand layout CSS assertion. GREEN -> `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\tavern-short-gamble-ui-contract.test.cjs` PASS (29/29). Final -> `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs`; `git diff --check` PASS with only LF-to-CRLF warnings.`
  - Next: `Decide whether to isolate these verified hidden-hand layout hunks into their own commit or fold them into the canonical Tavern Short Tile Sorting batch before any push.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-05-tavern-short-hidden-hand-layout-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `The current short-table renderer already emits summary, hiddenHand, melds, and discards, so the approved layout can stay CSS-first without adding a new overlay field.`
  - `Side-seat concealed-hand strips are still horizontal, and side-seat public rows are still anchored close to the outer seat edge.`
  - `The current UI contract fixture still lacks a top-seat NPC row, so Task 1 must add one before it can lock the top-seat hidden-hand-right-of-summary behavior.`
  - `The current canonical progress entry still points at Tavern Short Tile Sorting, so this child cannot become canonical until project-progress is explicitly synchronized.`

## Implementation Scope

### In Scope

- Add RED/GREEN UI contract coverage for:
  - side-seat vertical concealed-hand stacks,
  - side-seat inward public-row anchors,
  - a top-seat summary + concealed-hand header row,
  - unchanged player-seat hidden-hand behavior.
- Re-anchor the short-table seat layout in `src/styles/tea-house.css` without changing the short-table data contract.
- Keep the current `renderShortSeatHiddenHand()` markup and current seat section order unless a blocker forces a renderer change.
- Record the resulting UI capability and governance state in the required docs after implementation.

### Still Out Of Scope

- Changing tavern short betting, drawing, claim, showdown, or payout rules.
- Changing `hiddenHandTiles`, `meldGroups`, or `discardTiles` payload shape.
- Changing concealed-hand count logic or hidden-hand palette tokens.
- Repositioning the bottom player seat.
- Changing tavern long-table layout.
- Refactoring `src/main.ts` or adding a new runtime owner for this layout-only pass.

## File Map

### Existing files to modify

- `src/styles/tea-house.css`
  - Holds the short-table seat anchors, concealed-hand strip flow, and seat-position-specific public-row placement.
- `tests/tavern-short-gamble-ui-contract.test.cjs`
  - Holds the existing short-table markup/CSS contract assertions and the fixture that must gain a top-seat NPC row.
- `docs/change-log.md`
  - Records the new short-table concealed-hand/public-row layout capability once the implementation lands.
- `docs/superpowers/project-progress.md`
  - Records the child execution batch if this work is executed locally without becoming the canonical current child.
- `docs/superpowers/plans/2026-08-05-tavern-short-hidden-hand-layout-plan.md`
  - Tracks execution state, progress log, verification, and closeout status during implementation.

### Existing files expected to be deleted

- `none`

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - side-seat concealed-hand stacks render as vertical overlapping columns,
  - side-seat public discard/meld lanes shift inward without moving summary text,
  - the top-seat summary and concealed-hand strip share one horizontal band,
  - the player seat still omits the concealed-hand strip.
- Required commands:
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\tavern-short-gamble-ui-contract.test.cjs`
  - `git diff --check`

## Task 1: Lock And Implement The Short-Seat Layout Contract

**Files:**
- Modify: `tests/tavern-short-gamble-ui-contract.test.cjs`
- Modify: `src/styles/tea-house.css`
- Read: `src/ui/views/house/tavern-house-view.ts`

**Interfaces:**
- Consumes:
  - current short-table seat markup from `renderShortSeat()`
  - current selectors:
    - `.c-tavern-gamble__seat--short-1`
    - `.c-tavern-gamble__seat--short-2`
    - `.c-tavern-gamble__seat--short-3`
    - `.c-tavern-gamble__seat-summary`
    - `.c-tavern-gamble__seat-hidden-hand`
    - `.c-tavern-gamble__seat-discards`
    - `.c-tavern-gamble__seat-melds`
- Produces:
  - a CSS-only layout contract where side concealed-hand strips become vertical columns, side public rows move inward, and the top seat becomes a summary+hidden-hand header row without adding a new overlay field

- [x] **Step 1: Write the failing UI contract assertions**

Extend `tests/tavern-short-gamble-ui-contract.test.cjs` in two places:

1. Add a top-seat NPC fixture row to the large short-table markup contract test:

```js
        {
          id: "broker",
          name: "broker",
          seatIndex: 2,
          tablePosition: "top",
          stack: 1050,
          committed: 200,
          folded: false,
          allIn: false,
          autoBetPending: false,
          statusLabel: "已投 200",
          hiddenHandTiles: [
            { id: "broker-hidden-top", tone: "top" },
            { id: "broker-hidden-mid", tone: "mid" },
            { id: "broker-hidden-base", tone: "base" },
          ],
          meldGroups: [
            {
              kind: "chow",
              cards: [
                { id: "broker-meld-1", label: "B1" },
                { id: "broker-meld-2", label: "B2" },
                { id: "broker-meld-3", label: "B3" },
              ],
            },
          ],
          discardTiles: [{ id: "wan-3", label: "3万" }],
        },
```

2. Add the new seat/CSS contract assertions:

```js
  const brokerSeatIndex = markup.indexOf('data-seat-id="broker"', travelerSeatIndex);
  const brokerSummaryIndex = markup.indexOf(
    'class="c-tavern-gamble__seat-summary"',
    brokerSeatIndex
  );
  const brokerHiddenHandIndex = markup.indexOf(
    'class="c-tavern-gamble__seat-hidden-hand"',
    brokerSeatIndex
  );
  const brokerDiscardRowIndex = markup.indexOf(
    'class="c-tavern-gamble__seat-discards"',
    brokerSeatIndex
  );
  const brokerSeatMarkup = markup.slice(brokerSeatIndex, guardSeatIndex);

  assert.ok(brokerSeatIndex > travelerSeatIndex);
  assert.ok(brokerSummaryIndex >= 0);
  assert.ok(brokerHiddenHandIndex > brokerSummaryIndex);
  assert.ok(brokerDiscardRowIndex > brokerHiddenHandIndex);
  assert.match(brokerSeatMarkup, /c-tavern-gamble__tile--hidden-hand-top/u);
```

```js
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__seat--short-1\s+\.c-tavern-gamble__seat-hidden-hand,\s*\.c-tavern-gamble__seat--short-3\s+\.c-tavern-gamble__seat-hidden-hand\s*\{[^}]*flex-direction:\s*column;[^}]*align-items:\s*center;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__seat--short-1\s+\.c-tavern-gamble__seat-hidden-hand\s+\.c-tavern-gamble__tile--hidden-hand,\s*\.c-tavern-gamble__seat--short-3\s+\.c-tavern-gamble__seat-hidden-hand\s+\.c-tavern-gamble__tile--hidden-hand\s*\{[^}]*margin-inline-end:\s*0;[^}]*margin-block-end:\s*calc\(var\(--tavern-short-hidden-hand-overlap\)\s*\*\s*-1\);[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__seat--short-1\s+\.c-tavern-gamble__seat-discards,\s*\.c-tavern-gamble__seat--short-1\s+\.c-tavern-gamble__seat-melds\s*\{[^}]*left:\s*30px;[^}]*right:\s*0;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__seat--short-3\s+\.c-tavern-gamble__seat-discards,\s*\.c-tavern-gamble__seat--short-3\s+\.c-tavern-gamble__seat-melds\s*\{[^}]*left:\s*0;[^}]*right:\s*30px;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__seat--short-2\s*\{[^}]*grid-template-columns:\s*auto\s+auto;[^}]*grid-template-areas:\s*"summary hidden"\s*"discards discards"\s*"melds melds";[^}]*column-gap:\s*12px;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__seat--short-2\s+\.c-tavern-gamble__seat-summary\s*\{[^}]*grid-area:\s*summary;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__seat--short-2\s+\.c-tavern-gamble__seat-hidden-hand\s*\{[^}]*grid-area:\s*hidden;[^}]*justify-self:\s*start;[^}]*\}/su
  );
```

- [x] **Step 2: Run the contract test to confirm RED**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\tavern-short-gamble-ui-contract.test.cjs
```

Expected:

- `tsc` PASS
- `tests\tavern-short-gamble-ui-contract.test.cjs` FAIL
- failures point at the missing top-seat fixture/CSS contract and the missing side-seat vertical/inward layout rules

- [x] **Step 3: Implement the minimal CSS layout change**

Update `src/styles/tea-house.css` without changing the renderer contract. Keep the current short-table seat markup and add the seat-position-specific rules below:

```css
.c-tavern-gamble__seat--short-1 .c-tavern-gamble__seat-hidden-hand,
.c-tavern-gamble__seat--short-3 .c-tavern-gamble__seat-hidden-hand {
  top: 20px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.c-tavern-gamble__seat--short-1 .c-tavern-gamble__seat-hidden-hand {
  left: -18px;
}

.c-tavern-gamble__seat--short-3 .c-tavern-gamble__seat-hidden-hand {
  right: -18px;
}

.c-tavern-gamble__seat--short-1 .c-tavern-gamble__seat-hidden-hand .c-tavern-gamble__tile--hidden-hand,
.c-tavern-gamble__seat--short-3 .c-tavern-gamble__seat-hidden-hand .c-tavern-gamble__tile--hidden-hand {
  margin-inline-end: 0;
  margin-block-end: calc(var(--tavern-short-hidden-hand-overlap) * -1);
}

.c-tavern-gamble__seat--short-1 .c-tavern-gamble__seat-hidden-hand .c-tavern-gamble__tile--hidden-hand:last-child,
.c-tavern-gamble__seat--short-3 .c-tavern-gamble__seat-hidden-hand .c-tavern-gamble__tile--hidden-hand:last-child {
  margin-block-end: 0;
}

.c-tavern-gamble__seat--short-1 .c-tavern-gamble__seat-discards,
.c-tavern-gamble__seat--short-1 .c-tavern-gamble__seat-melds {
  left: 30px;
  right: 0;
}

.c-tavern-gamble__seat--short-3 .c-tavern-gamble__seat-discards,
.c-tavern-gamble__seat--short-3 .c-tavern-gamble__seat-melds {
  left: 0;
  right: 30px;
}

.c-tavern-gamble__seat--short-2 {
  display: grid;
  grid-template-columns: auto auto;
  grid-template-areas:
    "summary hidden"
    "discards discards"
    "melds melds";
  column-gap: 12px;
  align-items: start;
  justify-content: center;
}

.c-tavern-gamble__seat--short-2 .c-tavern-gamble__seat-summary {
  grid-area: summary;
}

.c-tavern-gamble__seat--short-2 .c-tavern-gamble__seat-hidden-hand {
  grid-area: hidden;
  margin-top: 20px;
  justify-self: start;
}

.c-tavern-gamble__seat--short-2 .c-tavern-gamble__seat-discards {
  grid-area: discards;
}

.c-tavern-gamble__seat--short-2 .c-tavern-gamble__seat-melds {
  grid-area: melds;
}
```

Add the matching mobile-safe adjustments under `@media (width <= 760px)`:

```css
  .c-tavern-gamble__seat--short-1 .c-tavern-gamble__seat-hidden-hand,
  .c-tavern-gamble__seat--short-3 .c-tavern-gamble__seat-hidden-hand {
    top: 16px;
  }

  .c-tavern-gamble__seat--short-1 .c-tavern-gamble__seat-discards,
  .c-tavern-gamble__seat--short-1 .c-tavern-gamble__seat-melds {
    left: 24px;
    right: 0;
  }

  .c-tavern-gamble__seat--short-3 .c-tavern-gamble__seat-discards,
  .c-tavern-gamble__seat--short-3 .c-tavern-gamble__seat-melds {
    left: 0;
    right: 24px;
  }

  .c-tavern-gamble__seat--short-2 {
    grid-template-columns: minmax(0, 1fr) auto;
    column-gap: 8px;
  }
```

- [x] **Step 4: Re-run the UI contract to confirm GREEN**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\tavern-short-gamble-ui-contract.test.cjs
```

Expected:

- `tsc` PASS
- `tests\tavern-short-gamble-ui-contract.test.cjs` PASS
- side-seat concealed-hand CSS now proves vertical overlap, side public lanes prove inward anchors, and the top-seat header row proves summary-left / hidden-hand-right placement

- [ ] **Step 5: Commit the layout slice**

Run:

```bash
git add tests/tavern-short-gamble-ui-contract.test.cjs src/styles/tea-house.css
git commit -m "feat: adjust tavern short hidden-hand layout"
```

## Task 2: Sync Governance Records And Final Verification

**Files:**
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/project-progress.md`
- Modify: `docs/superpowers/plans/2026-08-05-tavern-short-hidden-hand-layout-plan.md`

**Interfaces:**
- Consumes:
  - completed CSS/layout implementation from Task 1
  - final verification results
- Produces:
  - a recorded tavern short layout capability entry
  - synchronized child execution state for either local non-canonical execution or canonical promotion
  - a resumable `completed-but-open` governance state until push/branch handling is explicitly decided

- [x] **Step 1: Write the doc updates**

1. Add a short change-log entry near the top of `docs/change-log.md`:

```md
## 2026-08-05 Tavern Short Hidden-Hand Layout

### Changed
- 酒馆短牌左右两侧 NPC 的暗牌 stack 现在改为纵向重叠排列，并利用名称区外侧的留白区域显示。
- 酒馆短牌左右两侧 NPC 的公开出牌区与吃/碰/杠区现在轻微向桌面中心内收，而名称与筹码锚点保持不变。
- 酒馆短牌顶部 NPC 的暗牌 stack 现在显示在名称区右侧，公开出牌区与吃/碰/杠区继续保留在名称区下方。

### Impact
- 这次改动仍然是 short-table CSS-owned 布局调整；`hiddenHandTiles`、`meldGroups`、`discardTiles` 和 tavern short runtime 规则均未改变。
```

2. Update `docs/superpowers/project-progress.md` only if this child is actually executed:

- if the child stays non-canonical, append one local progress-log entry that explicitly says the canonical current child remains Tavern Short Tile Sorting;
- if the child is promoted before execution, synchronize `Current Task`, `Current Child`, `Next Owner Document`, and `Resume From` to this child before any implementation continues.

3. Update this child plan:

- `Execution State.Status` -> `completed-but-open`
- `Execution State.Verification` -> final command list + PASS summary
- `Progress Log` -> append the completed implementation batch
- `Completion Checklist` -> mark everything done except push/closeout

- [x] **Step 2: Run the final verification set**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\tavern-short-gamble-ui-contract.test.cjs
git diff --check
```

Expected:

- `PASS`
- `git diff --check` may report LF-to-CRLF working-copy warnings, but no whitespace errors

- [x] **Step 3: Record the child state as completed-but-open**

Write the final child-local governance state:

```md
## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-08-05`
- Current Focus: `Implementation and verification are complete locally; waiting for branch/push direction.`
- Next Step: `Decide whether to keep this layout batch local, fold it into the canonical tavern short child, or push it after branch hygiene is settled.`
- Verification: `tools/lint-superpowers-plans.mjs`, `tsc -p tsconfig.test.json`, `tests\tavern-short-gamble-ui-contract.test.cjs`, and `git diff --check` all PASS.`
```

Keep `## Child Closeout` in `completed-but-open`, not `closed`, until remote push and canonical governance rules are fully satisfied.

- [ ] **Step 4: Commit the doc/governance slice**

Run:

```bash
git add docs/change-log.md docs/superpowers/project-progress.md docs/superpowers/plans/2026-08-05-tavern-short-hidden-hand-layout-plan.md
git commit -m "docs: record tavern short hidden-hand layout"
```

## Exit Check

- [x] Side-seat concealed-hand stacks render vertically.
- [x] Side-seat public discard and meld lanes move inward without moving summary text.
- [x] The top-seat concealed-hand strip sits to the right of the summary block.
- [x] The top-seat discard and meld lanes remain below the summary area.
- [x] The player seat remains unchanged.
- [x] Final verification commands pass.
- [x] Project progress is synchronized if child execution status changed.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `not closed`
- Parent Task: `Tavern Short Hidden-Hand Layout`
- Parent Stage: `House Local Gameplay`
- Closeout Status: `not-closed`
- Project Progress Synced: `yes`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Split or fold the verified hidden-hand layout hunks into a clean commit strategy before any push or canonical closeout.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-08-05-tavern-short-hidden-hand-layout-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, confirm the canonical child is still Tavern Short Tile Sorting, then decide whether to split these verified hidden-hand layout edits into their own commit or fold them into that canonical local batch.`
