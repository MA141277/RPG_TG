# Tavern Short Tile Sorting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract house tile dragging out of `src/main.ts` into a reusable sortable runtime, then add tavern short-table hand sorting with hover lift, long-press drag, placeholder-gap preview, and typed short-hand reorder actions that stay disabled during `draw-discard`.

**Architecture:** Build one shared `house-sortable-tile-runtime` under `src/ui/views/house/` that owns DOM-only hover/drag/placeholder behavior and dispatches generic reorder actions through the existing `data-house-*` seam. Keep tavern short persistent order in tavern domain/application modules by adding a short-specific reorder action plus a pure hand-reorder helper, and expose a typed `handSortEnabled` view-model flag so the renderer/runtime never infer short discard-phase rules from DOM state.

**Tech Stack:** TypeScript house UI/application/domain modules, CommonJS tests via `.test-dist`, `npm run lint:plans`, bundled Node/TypeScript CLI typechecks, and targeted runtime/UI/house/domain regression tests.

## Global Constraints

- Do not add tavern business branches back into `src/main.ts`.
- Keep the sortable runtime generic: it may understand generic `data-house-*` ordering metadata, but it must not know tavern short or tavern long semantics.
- Keep tavern short `draw-discard` authoritative for discard arming; sorting and hover lift must stay disabled in that phase.
- Do not use ad hoc globals for drag state; runtime-only pointer state must live inside the new sortable runtime instance.
- Preserve the existing tavern short lifted/dropping discard behavior outside the new sortable path.
- The working tree is already dirty; do not revert unrelated local changes while layering this child on top.
- Canonical progress currently points at `docs/superpowers/plans/2026-08-05-tavern-short-chow-kong-debug-entry-plan.md`, so this new child must remain `waiting` until execution is explicitly promoted and `docs/superpowers/project-progress.md` is synchronized.

## Execution State

- Status: `running`
- Last Updated: `2026-08-05`
- Current Focus: `Task 3: sync docs and record the focused-green tavern short tile-sorting verification without conflating it with older unrelated short-table test failures.`
- Next Step: `Review the local diff, then decide whether to absorb the unrelated existing short-table test baselines (hidden-hand stack/full-file house harness drift) into this child or keep this batch targeted-green and local.`
- Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none --test-name-pattern "shared house sortable runtime|typed hand reorder|hand sort gating|sort metadata|reorder moves only|reorder ignores" tests/house-sortable-tile-runtime.test.cjs tests/tavern-short-gamble-house.test.cjs tests/tavern-short-gamble-ui-contract.test.cjs tests/tavern-short-gamble-reorder-domain.test.cjs` PASS (9 tests, 9 pass, 0 fail); `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json` PASS
- Notes: `Task 2 RED->GREEN for the shared tavern short tile-sorting path is complete. Full-file short tavern suites still show unrelated existing drift outside this child, including the hidden-hand stack contract/harness path and older full-house short debug-cycle coverage.`

## Progress Log

- 2026-08-05
  - Summary: `Completed the tavern short tile-sorting implementation slice: added the pure short-hand reorder helper, tavern-owned gamble-short-reorder action handling, typed handSortEnabled view-model state, shared sortable metadata on the short hand root, and runtime-class-driven hover/placeholder styling so short-hand sorting stays disabled during draw-discard.`
  - Verification: `RED -> C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-ui-contract.test.cjs tests/tavern-short-gamble-house.test.cjs tests/tavern-short-gamble-reorder-domain.test.cjs` FAIL with missing short reorder helper/action/handSortEnabled. GREEN -> `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none --test-name-pattern "shared house sortable runtime|typed hand reorder|hand sort gating|sort metadata|reorder moves only|reorder ignores" tests/house-sortable-tile-runtime.test.cjs tests/tavern-short-gamble-house.test.cjs tests/tavern-short-gamble-ui-contract.test.cjs tests/tavern-short-gamble-reorder-domain.test.cjs` PASS (9 tests, 9 pass, 0 fail); `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json` PASS.`
  - Next: `Sync doc ownership notes and decide whether to pull the unrelated existing short-table full-file failures into this child or leave them outside the current targeted-green batch.`

- 2026-08-05
  - Summary: `Completed Task 1 locally: wrote the shared sortable-runtime RED tests, confirmed they failed because the new runtime module did not exist yet, then implemented src/ui/views/house/house-sortable-tile-runtime.ts and rewired src/main.ts off the old inline house drag state until the focused runtime suite turned green.`
  - Verification: `RED -> C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-sortable-tile-runtime.test.cjs` FAIL with missing `../.test-dist/ui/views/house/house-sortable-tile-runtime.js`. GREEN -> `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-sortable-tile-runtime.test.cjs` PASS (4 tests, 4 pass, 0 fail).`
  - Next: `Write the failing short-hand reorder domain/house/UI tests, then confirm Task 2 RED.`

- 2026-08-05
  - Summary: `Promoted this child from waiting to running after the user approved the written spec and allowed inline execution in the current workspace. Canonical project-progress now points at this child, and the next concrete step is the Task 1 RED pass for the missing shared sortable runtime.`
  - Verification: `docs/superpowers/project-progress.md` synced to Tavern Short Tile Sorting; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs` PASS
  - Next: `Write tests/house-sortable-tile-runtime.test.cjs, run the targeted .test-dist commands, and confirm the missing runtime fails RED.`

- 2026-08-05
  - Summary: `Created the tavern short tile-sorting spec and implementation plan around a shared sortable runtime extraction, short typed reorder actions, and draw-discard gating, then validated the new child with the repository plan-lint script.`
  - Verification: `npm run lint:plans` intent satisfied via `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs` PASS because global npm is unavailable in this shell
  - Next: `Wait for the user to approve the written spec and execution start before promoting the child.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-05-tavern-short-tile-sorting-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `The approved scope is still the tavern short-table player hand row plus the extraction of the existing generic house tile drag behavior out of src/main.ts.`
  - `Current canonical progress still points at the previous tavern short chow-kong child, so this child cannot become executable until project-progress is explicitly promoted to it.`
  - `The repository already exposes generic data-house reorder attributes and inline shell drag behavior; this child replaces that shell-owned implementation with a reusable runtime rather than introducing a second drag path.`

## Implementation Scope

### In Scope

- Extract the existing house tile reorder pointer logic into a reusable `house-sortable-tile-runtime`.
- Rewire the current long-table hand reorder to use that runtime instead of the inline `main.ts` drag code.
- Add tavern short typed reorder actions and pure hand-order mutation for the human player's stable hand.
- Expose typed short overlay/view-model state so the renderer can enable sorting outside `draw-discard` and disable it during `draw-discard`.
- Add runtime, UI, house, and domain regressions for hover-lift, long-press drag, placeholder-gap preview, and short reorder gating.
- Update shared house/change-log docs if interface ownership changes land during implementation.

### Still Out Of Scope

- Sorting NPC hands, public cards, discard lanes, or exposed meld rows.
- Reworking tavern short betting, claim, or scoring rules.
- Changing the visual design of non-tavern house tiles.
- Adding a second tavern-specific DOM runtime in parallel with the shared sortable runtime.

## File Map

### Existing files to modify

- `src/main.ts`
  - Remove the inline house tile drag state and replace it with one shared sortable runtime mount/wiring seam.
- `src/domain/house-module.ts`
  - Extend the tavern short gamble-table overlay contract with a typed hand-sort enable flag if needed by the renderer.
- `src/application/house-modules/tavern/tavern-house-module.ts`
  - Parse and apply the new short reorder action prefix through tavern-owned session/domain logic.
- `src/application/house-modules/tavern/tavern-short-gamble-view-model.ts`
  - Emit typed short hand-sort enabled state per phase.
- `src/ui/views/house/tavern-house-view.ts`
  - Render the short-hand sortable root attributes and keep draw-discard gating declarative.
- `src/styles/tea-house.css`
  - Add generic hover-lift / placeholder / drag-origin styles without hardcoding tavern business logic.
- `src/domain/tavern-short-gambling.ts`
  - Export the short-hand reorder helper from the short domain seam.
- `src/domain/tavern-short-gambling-runtime.ts`
  - Implement the pure short-hand reorder mutation and preserve draw-discard ownership rules.
- `tests/tavern-short-gamble-ui-contract.test.cjs`
  - Lock the short markup/CSS contract for hand-sort enablement and draw-discard disablement.
- `tests/tavern-short-gamble-house.test.cjs`
  - Lock tavern-house handling of the short reorder action.
- `tests/tavern-short-gamble-reorder-domain.test.cjs`
  - Lock the pure short-hand reorder mutation semantics without depending on the older broad short-domain suite.
- `docs/special-house-interface.md`
  - Record the shared sortable-runtime + generic reorder attribute rule if the implementation changes shared ownership wording.
- `docs/change-log.md`
  - Record the new shared sortable runtime extraction and tavern short hand-sorting contract.
- `docs/superpowers/project-progress.md`
  - Update only when this child is promoted for execution or later moves to `completed-but-open` / `closed`.
- `docs/superpowers/plans/2026-08-05-tavern-short-tile-sorting-plan.md`
  - Keep execution state, progress log, and verification current.

### Existing files expected to be deleted

- `none`

### New files to create

- `src/ui/views/house/house-sortable-tile-runtime.ts`
  - Shared DOM runtime for house hand hover/drag/placeholder reorder behavior.
- `tests/house-sortable-tile-runtime.test.cjs`
  - Focused regression coverage for the extracted shared runtime.
- `tests/tavern-short-gamble-reorder-domain.test.cjs`
  - Focused pure-domain regressions for tavern short hand reordering.

## Verification Plan

- Targeted verification:
  - `src/main.ts` no longer owns the house tile drag session logic.
  - The shared sortable runtime lifts enabled tiles, starts drag only after long press, creates a placeholder clone, and dispatches one generic reorder action on drop.
  - Tavern short exposes sorting outside `draw-discard` and blocks it during `draw-discard`.
  - Tavern short reorder actions mutate only the human stable hand order and preserve the discard-selection flow.
- Required commands:
  - `npm run lint:plans`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json`
  - `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-sortable-tile-runtime.test.cjs tests/tavern-short-gamble-ui-contract.test.cjs tests/tavern-short-gamble-house.test.cjs tests/tavern-short-gamble-reorder-domain.test.cjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`

## Task 1: Extract The Shared House Sortable Runtime

**Files:**
- Create: `src/ui/views/house/house-sortable-tile-runtime.ts`
- Modify: `src/main.ts`
- Create: `tests/house-sortable-tile-runtime.test.cjs`
- Read: `src/ui/views/city/city-stage-dom-runtime.ts`

**Interfaces:**
- Consumes:
  - generic sortable root attributes: `data-house-drop-action-prefix`, `data-house-drop-before`, `data-house-sort-enabled`
  - generic tile attributes: `data-house-sortable-tile`, `data-house-drag-payload`, `data-house-drop-before`
- Produces:

```ts
export type HouseSortableTileRuntimeDependencies = {
  appElement: HTMLElement;
  dispatchReorderAction(actionId: string): void;
  longPressMs?: number;
  clickSuppressionMs?: number;
};

export type HouseSortableTileRuntimeHandle = {
  destroy(): void;
};

export function mountHouseSortableTileRuntime(
  input: HouseSortableTileRuntimeDependencies
): HouseSortableTileRuntimeHandle;
```

- [x] **Step 1: Write the failing shared-runtime tests**

Add focused regressions in `tests/house-sortable-tile-runtime.test.cjs` that prove:

- hover on an enabled tile adds a generic lifted class and leaving clears it;
- quick click before the long-press threshold does not dispatch a reorder;
- long-press drag creates one placeholder node in the row, hides the source tile in-flow, and dispatches `prefix + payload + before` on drop;
- a disabled sortable root ignores hover lift and drag start.

Use a minimal HTML fixture similar to:

```js
document.body.innerHTML = `
  <div id="app">
    <div
      data-house-drop-action-prefix="gamble-reorder:"
      data-house-drop-before="end"
      data-house-sort-enabled="true"
    >
      <button data-house-sortable-tile="true" data-house-drag-payload="a" data-house-drop-before="a">A</button>
      <button data-house-sortable-tile="true" data-house-drag-payload="b" data-house-drop-before="b">B</button>
      <button data-house-sortable-tile="true" data-house-drag-payload="c" data-house-drop-before="c">C</button>
    </div>
  </div>
`;
```

- [x] **Step 2: Run the shared-runtime test to confirm RED**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-sortable-tile-runtime.test.cjs
```

Expected:

- `FAIL`
- The failure should point at the missing shared runtime module and behavior contract.

- [x] **Step 3: Implement the shared runtime and rewire main.ts**

Create `src/ui/views/house/house-sortable-tile-runtime.ts` with the minimal DOM-only runtime:

```ts
const HOVER_CLASS = "is-house-hover-lifted";
const PLACEHOLDER_CLASS = "is-house-drop-placeholder";

export function mountHouseSortableTileRuntime(...) {
  // attach pointer/hover listeners to appElement
  // long-press activates drag
  // placeholder clone moves between gaps
  // dispatchReorderAction(`${prefix}${payload}:${beforeId ?? "end"}`)
}
```

Then update `src/main.ts` so it:

- imports `mountHouseSortableTileRuntime`,
- creates it once with `appElement` and a generic house action dispatcher,
- removes the inline `houseTileDragState`, `clearHouseTileDropMarkers`, `endHouseTileDrag`,
  `updateHouseTileDropMarker`, and related pointer/drag handlers.

- [x] **Step 4: Re-run the shared-runtime test**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-sortable-tile-runtime.test.cjs
```

Expected:

- `PASS`
- The shared runtime now owns generic house hand hover/drag behavior without tavern-specific branches in `src/main.ts`.

- [x] **Step 5: Sync plan state before short-table integration**

Update this plan:

- set `Execution State.Status` to `running` once execution is promoted;
- set `Execution State.Current Focus` to `Task 2: short-table reorder integration`;
- append the RED/GREEN results to `Progress Log`.

- [ ] **Step 6: Commit the shared-runtime extraction slice**

Run:

```bash
git add docs/superpowers/plans/2026-08-05-tavern-short-tile-sorting-plan.md src/main.ts src/ui/views/house/house-sortable-tile-runtime.ts tests/house-sortable-tile-runtime.test.cjs
git commit -m "refactor: extract house sortable tile runtime"
```

## Task 2: Add Typed Tavern Short Hand Reordering

**Files:**
- Modify: `src/domain/house-module.ts`
- Modify: `src/domain/tavern-short-gambling.ts`
- Modify: `src/domain/tavern-short-gambling-runtime.ts`
- Modify: `src/application/house-modules/tavern/tavern-house-module.ts`
- Modify: `src/application/house-modules/tavern/tavern-short-gamble-view-model.ts`
- Modify: `src/ui/views/house/tavern-house-view.ts`
- Modify: `src/styles/tea-house.css`
- Create: `tests/tavern-short-gamble-reorder-domain.test.cjs`
- Modify: `tests/tavern-short-gamble-house.test.cjs`
- Modify: `tests/tavern-short-gamble-ui-contract.test.cjs`

**Interfaces:**
- Consumes:
  - shared sortable runtime from Task 1
  - existing tavern short `TavernShortHandState`
  - existing tavern short `draw-discard` selection flow
- Produces:

```ts
type GambleTableShortOverlay = Extract<
  HouseOverlayViewModel,
  { type: "gamble-table"; variant: "short" }
> & {
  handSortEnabled: boolean;
};

export function reorderTavernShortHand(
  hand: TavernShortHandState,
  seatId: string,
  cardId: string,
  beforeCardId: string | null
): TavernShortHandState;
```

```ts
const GAMBLE_SHORT_REORDER_ACTION_PREFIX = "gamble-short-reorder:";
```

- [x] **Step 1: Write the failing short-domain/house/UI tests**

Add regressions that prove:

- `reorderTavernShortHand` reorders only the human stable hand cards and ignores no-op / invalid ids;
- tavern house dispatching `gamble-short-reorder:<cardId>:<beforeId>` updates the short table hand when sorting is enabled;
- short `draw-discard` keeps `handSortEnabled === false`, while a non-discard short phase such as `betting` exposes `handSortEnabled === true`;
- short hand markup emits `data-house-sort-enabled="true"` only when `handSortEnabled` is true.

Representative assertions:

```js
assert.deepEqual(
  reordered.players.find((player) => player.seatId === "you").hand.map((card) => card.id),
  ["tong-4", "wan-2", "bing-3", "tiao-9", "wan-6"]
);
assert.equal(overlay.handSortEnabled, false);
assert.match(markup, /data-house-sort-enabled="true"/u);
```

- [x] **Step 2: Run the targeted tavern tests to confirm RED**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-ui-contract.test.cjs tests/tavern-short-gamble-house.test.cjs tests/tavern-short-gamble-reorder-domain.test.cjs
```

Expected:

- `FAIL`
- The failures should show the missing short reorder action, missing short domain helper, and missing `handSortEnabled` view contract.

- [x] **Step 3: Implement the short reorder path**

Make the minimal short-table changes needed to satisfy the contract:

- export `reorderTavernShortHand` from the short domain seam and implement it in the runtime file;
- add `handSortEnabled` to the short gamble overlay contract and set it to `hand.phase !== "draw-discard"` for active short hands;
- in `tavern-house-view.ts`, render the short hand root with:

```html
<div
  class="c-tavern-gamble__tiles c-tavern-gamble__tiles--hand"
  data-house-drop-action-prefix="gamble-short-reorder:"
  data-house-drop-before="end"
  data-house-sort-enabled="true"
>
```

only when the typed overlay says sorting is enabled;
- in `tavern-house-module.ts`, parse `gamble-short-reorder:` and apply it only when an active short table exists and its current hand is not in `draw-discard`;
- keep the existing `gamble-play-tile:` discard-selection path unchanged.

- [x] **Step 4: Add the generic hover/placeholder styles**

Update `src/styles/tea-house.css` so the shared runtime classes render correctly:

```css
.c-tavern-gamble__tile.is-house-hover-lifted {
  --tile-lift-y: -30px;
}

.c-tavern-gamble__tile.is-house-drag-origin {
  visibility: hidden;
}

.c-tavern-gamble__tile.is-house-drop-placeholder {
  opacity: 0.38;
}
```

Also keep short `draw-discard` visual ownership intact by not letting these generic classes override the existing armed-discard border/animation rules.

- [ ] **Step 5: Re-run the tavern short test suite**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-sortable-tile-runtime.test.cjs tests/tavern-short-gamble-ui-contract.test.cjs tests/tavern-short-gamble-house.test.cjs tests/tavern-short-gamble-reorder-domain.test.cjs
```

Expected:

- `PASS`
- Tavern short sorting now works outside `draw-discard`, and the existing discard-selection path remains green during `draw-discard`.

- [ ] **Step 6: Commit the tavern short integration slice**

Run:

```bash
git add src/domain/house-module.ts src/domain/tavern-short-gambling.ts src/domain/tavern-short-gambling-runtime.ts src/application/house-modules/tavern/tavern-house-module.ts src/application/house-modules/tavern/tavern-short-gamble-view-model.ts src/ui/views/house/tavern-house-view.ts src/styles/tea-house.css tests/tavern-short-gamble-ui-contract.test.cjs tests/tavern-short-gamble-house.test.cjs tests/tavern-short-gamble-reorder-domain.test.cjs
git commit -m "feat: add tavern short tile sorting"
```

## Task 3: Sync Shared Docs And Final Verification

**Files:**
- Modify: `docs/special-house-interface.md`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/project-progress.md`
- Modify: `docs/superpowers/plans/2026-08-05-tavern-short-tile-sorting-plan.md`

**Interfaces:**
- Consumes:
  - completed shared runtime and tavern short implementation
- Produces:
  - updated ownership/change-log documentation
  - synchronized project progress once this child is promoted and executed

- [ ] **Step 1: Write the doc updates**

Record:

- the new shared sortable-runtime ownership seam in `docs/special-house-interface.md`;
- the new tavern short tile-sorting contract in `docs/change-log.md`;
- the latest execution state / progress log details in this plan;
- canonical project-progress updates only after this child is actually promoted/executed.

- [ ] **Step 2: Run full verification**

Run:

```powershell
npm run lint:plans
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-sortable-tile-runtime.test.cjs tests/tavern-short-gamble-ui-contract.test.cjs tests/tavern-short-gamble-house.test.cjs tests/tavern-short-gamble-reorder-domain.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json
```

Expected:

- `PASS`
- Shared runtime extraction, tavern short reorder gating, and repository typecheck all remain green.

- [ ] **Step 3: Record closeout-or-open state**

If the batch is done but not committed/pushed, set:

- `Execution State.Status` to `completed-but-open`;
- `Execution State.Next Step` to `Review the local diff, then decide whether to commit/push this tavern short tile-sorting batch or keep it local.`

If the child is fully closed later, add the full `## Child Closeout` block required by plan governance.

## Exit Check

- [ ] `src/main.ts` no longer owns the old house tile drag session logic.
- [ ] The shared sortable runtime exists and is reused by tavern hand reordering.
- [ ] Tavern short sorting is enabled only outside `draw-discard`.
- [ ] Targeted runtime/UI/house/domain tests pass.
- [ ] Shared docs are updated if the interface/ownership wording changed.
- [ ] Project progress sync is updated if this child state changes.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

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
