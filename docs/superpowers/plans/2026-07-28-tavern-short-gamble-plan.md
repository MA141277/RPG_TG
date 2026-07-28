# Tavern Short Gamble Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace tavern `short` gambling with the approved Texas Hold'em + discard-claim hybrid while preserving the current `long` variant and the temporary tavern-access debug bypass.

**Architecture:** Add a dedicated short-mode domain runtime and evaluator under `src/domain/tavern-short-gambling*`, wrap them in a persistent tavern short table session owned by `tavern-house-module`, and split the `gamble-table` overlay into short-vs-long payloads. Keep `long` on the existing mahjong runtime, do not add tavern-specific branches to `src/main.ts`, and update the tavern renderer and docs only where the new short session contract requires it.

**Tech Stack:** TypeScript, Vite, Node test runner, structured tavern house modules, `tests/robustness.test.cjs`, `npm run build:test`, `node --test --test-isolation=none`, `npm run typecheck`, `npm run build`, `npm run lint:plans`.

## Global Constraints

- Use a unique `52`-card short deck with suits `wan / bing / tong / tiao` and ranks `1..13`, with rank `1` treated as Ace.
- Table size remains fixed at `4`; short-mode blind level is fixed at `100 / 200` chips.
- Keep every stable private hand array at exactly `5` cards; draw and claim cards must move through a pending incoming slot until discard resolution.
- Short-mode chip exchange is `1 gold = 10 chips`; cash-out rounds down to whole gold and drops chip remainders below `10`.
- Short mode remains `no-limit` and keeps explicit `check / call / raise / fold` actions during normal betting rounds.
- Do not add tavern-specific business branches to `src/main.ts`.
- Do not store persistent tavern or gambling state in ad hoc module-level globals.
- Keep tavern session state flowing through the existing house session lifecycle and structured view-model path only.
- Preserve the existing temporary tavern-access debug bypass until the user explicitly asks to remove it.
- Update `docs/special-house-interface.md` and `docs/change-log.md` when session or overlay wiring changes.
- Long gamble must remain on the current runtime and must not regress.

## Execution State

- Status: `running`
- Last Updated: `2026-07-28`
- Current Focus: `Task 1 complete; Task 2 runtime transitions next.`
- Next Step: `Write Task 2 failing runtime tests.`
- Verification: `RED: bundled node + tsc + node --test --test-isolation=none failed with MODULE_NOT_FOUND after removing stale .test-dist tavern-short outputs. GREEN: the same command passed 3/3 tests in tests/tavern-short-gamble-domain.test.cjs.`
- Notes: `This child is now the active governance target in docs/superpowers/project-progress.md. Stale .test-dist tavern-short outputs had to be removed before RED so the new tests exercised real missing-module behavior instead of cached build artifacts.`

## Progress Log

- 2026-07-28
  - Summary: `Created the tavern short gamble implementation plan after the design spec was approved.`
  - Verification: `Not run yet`
  - Next: `Run plan lint, then wait for the user to choose Subagent-Driven or Inline execution.`
- 2026-07-28
  - Summary: `Promoted the tavern short gamble child into project-progress and completed Task 1 with the short deck contract, card labels, 7-choose-5 showdown evaluator, and side-pot split helpers.`
  - Verification: `RED bundled node + tsc + node --test --test-isolation=none failed with MODULE_NOT_FOUND after removing stale .test-dist tavern-short outputs; GREEN the same command passed 3/3 tests in tests/tavern-short-gamble-domain.test.cjs.`
  - Next: `Write Task 2 failing runtime tests for draw-discard, claim-chain, and betting progression behavior.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-28-tavern-short-gamble-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `Current short tavern gambling is still the old mahjong/fan runtime in src/domain/tavern-gambling.ts and src/domain/tavern-gambling-runtime.ts.`
  - `Current tavern house session stores gambleSession as one mahjong-shaped object in src/domain/house-modules/tavern-session.ts; this must become a short-vs-long union instead of more short branches inside the old structure.`
  - `Current tavern renderer in src/ui/views/house/tavern-house-view.ts still assumes short mode has played groups, fan labels, and the old play-slot workflow.`
  - `Current tests in tests/robustness.test.cjs still assert old short-mode facts such as 4-card starting hands and immediate settle semantics. Those assertions must be replaced, not patched around.`
  - `Current working tree already contains temporary tavern/temple debug-access edits in src/application/house-modules/temple-house/temple-house-house-module.ts, src/content/prototype-world.ts, src/content/scenario-packs/zhuyuanzhang/house-access-refusal-rules.json, and tests/robustness.test.cjs; short-gamble work must preserve them until the user asks to remove them.`
  - `Current docs/superpowers/project-progress.md points at an unrelated campaign map child, so the first execution step must explicitly promote this plan before implementation starts.`

## Implementation Scope

### In Scope

- Dedicated short-mode card types, deck generation, label helpers, evaluator, side-pot builder, and payout splitter.
- Dedicated short-mode hand runtime for betting, draw-discard, claim chains, all-in handling, kong penalties, and showdown.
- Persistent tavern short table session with buy-in, continue-next-hand, rebuy, and cash-out semantics.
- Short-vs-long tavern gamble session union and short-specific house action dispatch.
- Variant-specific `gamble-table` overlay payloads and short renderer/styling updates.
- Short-mode tavern copy updates for buy-in, continue, rebuy, cash-out, and settlement prompts.
- Focused domain, house, UI-contract, and robustness regression coverage.
- `docs/special-house-interface.md` and `docs/change-log.md` updates for the new tavern short contract.

### Still Out Of Scope

- Redesigning the current `long` gamble rules.
- Extracting a repository-wide generic gambling engine.
- Removing the temporary tavern-entry debug bypass.
- Changing tavern work or drink flows beyond the shared tavern session union they already consume.
- Adding tavern-specific control flow to `src/main.ts`.
- Deep AI sophistication beyond a deterministic, testable short-mode action policy.

## File Map

### Existing files to modify

- `src/domain/house-modules/tavern-session.ts`
  - Replace the single `gambleSession` shape with a short-vs-long union and short-table overlay wrapper.
- `src/domain/house-module.ts`
  - Split the public `gamble-table` overlay contract into variant-specific payloads.
- `src/application/house-modules/tavern/tavern-session-state.ts`
  - Initialize the new gamble session union without breaking work/drink flow setup.
- `src/application/house-modules/tavern/tavern-house-module.ts`
  - Route short-mode buy-in, rebuy, continue, cash-out, and action dispatch through the new short session helpers while preserving long mode.
- `src/ui/views/house/tavern-house-view.ts`
  - Render the new short overlay payload and keep long rendering intact.
- `src/styles/tea-house.css`
  - Add short-specific tavern table layout, pending incoming card slot, side-pot summary, and between-hand actions while preserving long layout.
- `src/content/scenario-packs/zhuyuanzhang/text-entries.json`
  - Add short-table prompt, rebuy, cash-out, and updated settlement copy.
- `tests/robustness.test.cjs`
  - Replace old short-mode assumptions with high-level short-table regressions and long-isolation checks.
- `docs/special-house-interface.md`
  - Document the updated tavern `gamble-table` variant contract and tavern house-session union.
- `docs/change-log.md`
  - Record the short-mode runtime/session/rendering changes.
- `docs/superpowers/project-progress.md`
  - Promote this plan when execution starts and keep current/next pointers synchronized while work is active.
- `docs/superpowers/plans/2026-07-28-tavern-short-gamble-plan.md`
  - Keep checkboxes, execution state, and progress log synchronized during execution.

### Existing files expected to be deleted

- None.

### New files to create

- `src/domain/tavern-short-gambling.ts`
  - Public short-mode types and re-exports for evaluator/runtime helpers.
- `src/domain/tavern-short-gambling-evaluator.ts`
  - Pure `7`-choose-`5` evaluator, hand comparison, side-pot construction, and split helpers.
- `src/domain/tavern-short-gambling-runtime.ts`
  - Pure short-mode hand state transitions, claim chain handling, betting progression, and deterministic NPC actions.
- `src/application/house-modules/tavern/tavern-short-gamble-session.ts`
  - Short table session helpers for buy-in, continue-next-hand, rebuy, settlement, and cash-out.
- `src/application/house-modules/tavern/tavern-short-gamble-view-model.ts`
  - Short-only overlay mapping from `TavernShortTableSession` to `HouseOverlayViewModel`.
- `tests/tavern-short-gamble-domain.test.cjs`
  - Focused deck/evaluator/runtime tests that do not require the full tavern house module.
- `tests/tavern-short-gamble-house.test.cjs`
  - Focused tavern house integration tests for short buy-in, stamina, continue, rebuy, and cash-out.
- `tests/tavern-short-gamble-ui-contract.test.cjs`
  - Focused short overlay/rendering contract tests and long-variant no-regression assertions.

## Verification Plan

- Targeted verification:
  - `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/tavern-short-gamble-domain.test.cjs tests/tavern-short-gamble-house.test.cjs tests/tavern-short-gamble-ui-contract.test.cjs }`
  - `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none --test-name-pattern "tavern short gamble|tavern long gamble|tavern gamble" tests/robustness.test.cjs }`
- Required commands:
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm run build`
- Optional broad verification:
  - `npm test`
- Known baseline risk:
  - `If npm test still fails only the known unrelated child 27 startup coordinator baseline, record the exact expected/actual failure and keep the child completed-but-open instead of closed.`
- Codex sandbox note:
  - `When running targeted Node suites inside the Windows Codex sandbox, prefer node --test --test-isolation=none after npm run build:test to avoid subprocess spawn failures.`

## Task 1: Short Deck, Evaluator, And Pot Helpers

**Files:**
- Modify: `docs/superpowers/project-progress.md`
- Create: `src/domain/tavern-short-gambling.ts`
- Create: `src/domain/tavern-short-gambling-evaluator.ts`
- Create: `tests/tavern-short-gamble-domain.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-28-tavern-short-gamble-plan.md`

**Interfaces:**
- Produces: `type TavernShortSuit = "wan" | "bing" | "tong" | "tiao"`
- Produces: `type TavernShortCard = { id: string; suit: TavernShortSuit; rank: number }`
- Produces: `type TavernShortBestFive = { category: "high-card" | "one-pair" | "two-pair" | "three-of-a-kind" | "straight" | "flush" | "full-house" | "four-of-a-kind" | "straight-flush" | "royal-flush"; label: string; scoreKey: number[]; cards: TavernShortCard[] }`
- Produces: `type TavernShortPot = { id: string; amount: number; eligibleSeatIds: string[] }`
- Produces: `createTavernShortDeck(): TavernShortCard[]`
- Produces: `shuffleTavernShortDeck(deck: readonly TavernShortCard[], seed: number): TavernShortCard[]`
- Produces: `getTavernShortCardLabel(card: TavernShortCard): string`
- Produces: `evaluateBestTavernShortShowdown(cards: readonly TavernShortCard[]): TavernShortBestFive`
- Produces: `compareTavernShortBestFives(left: TavernShortBestFive, right: TavernShortBestFive): number`
- Produces: `buildTavernShortPots(contributions: ReadonlyArray<{ seatId: string; committed: number; folded: boolean }>): TavernShortPot[]`
- Produces: `splitTavernShortPot(pot: TavernShortPot, orderedWinnerSeatIds: readonly string[], dealerNextSeatOrder: readonly string[]): Array<{ seatId: string; amount: number }>`

- [x] **Step 1: Promote this plan into the canonical progress entry before code work starts**

Update `docs/superpowers/project-progress.md` so implementation resumes from this plan instead of the unrelated cloud child. Use this exact block shape in `Current State`:

```md
- Current Stage: `House Local Gameplay`
- Current Stage Status: `running`
- Current Task: `Tavern Short Gamble`
- Current Task Status: `running`
- Current Child: `Tavern Short Gamble`
- Current Child Status: `running`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `execute-tavern-short-gamble-task-1`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-28-tavern-short-gamble-plan.md`
- Last Closed Item: `none`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then execute docs/superpowers/plans/2026-07-28-tavern-short-gamble-plan.md from Task 1.`
```

- [x] **Step 2: Write the failing evaluator and pot tests**

Create `tests/tavern-short-gamble-domain.test.cjs` with these initial tests:

```js
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createTavernShortDeck,
  getTavernShortCardLabel,
  evaluateBestTavernShortShowdown,
  compareTavernShortBestFives,
  buildTavernShortPots,
  splitTavernShortPot,
} = require("../.test-dist/domain/tavern-short-gambling.js");

const byId = () =>
  Object.fromEntries(createTavernShortDeck().map((card) => [card.id, card]));

test("tavern short deck is a unique 52-card set with four suits and thirteen ranks", () => {
  const deck = createTavernShortDeck();
  assert.equal(deck.length, 52);
  assert.equal(new Set(deck.map((card) => card.id)).size, 52);
  assert.deepEqual(
    [...new Set(deck.map((card) => card.suit))].sort(),
    ["bing", "tiao", "tong", "wan"]
  );
  assert.deepEqual(
    [...new Set(deck.map((card) => card.rank))],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  );
  assert.equal(getTavernShortCardLabel(deck.find((card) => card.id === "wan-1")), "1万");
});

test("tavern short evaluator treats rank 1 as Ace for wheel and royal flush", () => {
  const cards = byId();
  const wheel = evaluateBestTavernShortShowdown([
    cards["wan-1"],
    cards["bing-2"],
    cards["tong-3"],
    cards["tiao-4"],
    cards["wan-5"],
    cards["bing-9"],
    cards["tong-13"],
  ]);
  const royal = evaluateBestTavernShortShowdown([
    cards["wan-10"],
    cards["wan-11"],
    cards["wan-12"],
    cards["wan-13"],
    cards["wan-1"],
    cards["bing-3"],
    cards["tong-7"],
  ]);
  assert.equal(wheel.category, "straight");
  assert.equal(royal.category, "royal-flush");
  assert.equal(compareTavernShortBestFives(royal, wheel) > 0, true);
});

test("tavern short pot helpers build side pots and split remainders from dealer-next order", () => {
  const pots = buildTavernShortPots([
    { seatId: "you", committed: 1200, folded: false },
    { seatId: "traveler", committed: 1200, folded: false },
    { seatId: "broker", committed: 400, folded: false },
    { seatId: "guard", committed: 200, folded: true },
  ]);
  assert.deepEqual(
    pots.map((pot) => ({ amount: pot.amount, eligibleSeatIds: pot.eligibleSeatIds })),
    [
      { amount: 800, eligibleSeatIds: ["you", "traveler", "broker"] },
      { amount: 600, eligibleSeatIds: ["you", "traveler", "broker"] },
      { amount: 1600, eligibleSeatIds: ["you", "traveler"] },
    ]
  );
  assert.deepEqual(
    splitTavernShortPot(
      { id: "main", amount: 5, eligibleSeatIds: ["you", "traveler"] },
      ["traveler", "you"],
      ["you", "traveler", "broker", "guard"]
    ),
    [
      { seatId: "traveler", amount: 2 },
      { seatId: "you", amount: 3 },
    ]
  );
});
```

- [x] **Step 3: Run the focused domain test and confirm it fails**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/tavern-short-gamble-domain.test.cjs }
```

Expected:

- `FAIL` because `src/domain/tavern-short-gambling.ts` and its exported helpers do not exist yet.

- [x] **Step 4: Implement the public short card contract and evaluator helpers**

Create `src/domain/tavern-short-gambling.ts` as the public entry and `src/domain/tavern-short-gambling-evaluator.ts` as the pure helper module. Use these exact exported signatures:

```ts
export type TavernShortSuit = "wan" | "bing" | "tong" | "tiao";

export type TavernShortCard = {
  id: string;
  suit: TavernShortSuit;
  rank: number;
};

export type TavernShortBestFive = {
  category:
    | "high-card"
    | "one-pair"
    | "two-pair"
    | "three-of-a-kind"
    | "straight"
    | "flush"
    | "full-house"
    | "four-of-a-kind"
    | "straight-flush"
    | "royal-flush";
  label: string;
  scoreKey: number[];
  cards: TavernShortCard[];
};

export type TavernShortPot = {
  id: string;
  amount: number;
  eligibleSeatIds: string[];
};
```

```ts
export function createTavernShortDeck(): TavernShortCard[] {
  const suits: TavernShortSuit[] = ["wan", "bing", "tong", "tiao"];
  return suits.flatMap((suit) =>
    Array.from({ length: 13 }, (_, index) => ({
      id: `${suit}-${index + 1}`,
      suit,
      rank: index + 1,
    }))
  );
}

export function getTavernShortCardLabel(card: TavernShortCard): string {
  const suitLabel = card.suit === "wan" ? "万" : card.suit === "bing" ? "饼" : card.suit === "tong" ? "筒" : "条";
  return `${card.rank}${suitLabel}`;
}
```

```ts
export function evaluateBestTavernShortShowdown(cards: readonly TavernShortCard[]): TavernShortBestFive { /* 7 choose 5 */ }
export function compareTavernShortBestFives(left: TavernShortBestFive, right: TavernShortBestFive): number { /* scoreKey comparison */ }
export function buildTavernShortPots(
  contributions: ReadonlyArray<{ seatId: string; committed: number; folded: boolean }>
): TavernShortPot[] { /* sorted contribution tiers */ }
export function splitTavernShortPot(
  pot: TavernShortPot,
  orderedWinnerSeatIds: readonly string[],
  dealerNextSeatOrder: readonly string[]
): Array<{ seatId: string; amount: number }> { /* equal split + clockwise remainder */ }
```

Keep all side-pot, remainder, and rank comparison logic in `tavern-short-gambling-evaluator.ts`. Re-export only the public API from `tavern-short-gambling.ts`.

- [x] **Step 5: Re-run the focused domain test and confirm it passes**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/tavern-short-gamble-domain.test.cjs }
```

Expected:

- `PASS` for the three new evaluator/pot tests.

- [x] **Step 6: Sync plan and governance state**

Update this plan:

- set `Execution State.Status` to `running`
- set `Execution State.Last Updated` to the current date
- set `Execution State.Current Focus` to `Task 1 complete; Task 2 runtime transitions next.`
- set `Execution State.Next Step` to `Write Task 2 failing runtime tests.`
- append a `Progress Log` entry with the exact verification command output summary
- check the completed Task 1 boxes

Update `docs/superpowers/project-progress.md` so `Next Required Action` points at `execute-tavern-short-gamble-task-2`.

- [ ] **Step 7: Commit Task 1**

Run:

```bash
git add docs/superpowers/project-progress.md docs/superpowers/plans/2026-07-28-tavern-short-gamble-plan.md src/domain/tavern-short-gambling.ts src/domain/tavern-short-gambling-evaluator.ts tests/tavern-short-gamble-domain.test.cjs
git commit -m "feat: add tavern short evaluator foundations"
```

## Task 2: Short Hand Runtime, Claim Chains, And Auto-Bet

**Files:**
- Create: `src/domain/tavern-short-gambling-runtime.ts`
- Modify: `src/domain/tavern-short-gambling.ts`
- Modify: `tests/tavern-short-gamble-domain.test.cjs`
- Modify: `docs/superpowers/project-progress.md`
- Modify: `docs/superpowers/plans/2026-07-28-tavern-short-gamble-plan.md`

**Interfaces:**
- Consumes: `TavernShortCard`, `TavernShortBestFive`, `buildTavernShortPots()`, `evaluateBestTavernShortShowdown()`
- Produces: `type TavernShortBetActionKind = "check" | "call" | "raise" | "fold"`
- Produces: `type TavernShortClaimKind = "chow" | "pong" | "kong"`
- Produces: `type TavernShortPendingIncomingCard = { ownerSeatId: string; source: "draw" | "claim"; card: TavernShortCard }`
- Produces: `type TavernShortClaimOption = { id: string; seatId: string; kind: TavernShortClaimKind; discardCardId: string; consumeCardIds: string[]; priority: number }`
- Produces: `type TavernShortHandState = { dealerSeatIndex: number; actingSeatIndex: number; bettingRoundIndex: 0 | 1 | 2 | 3; drawRoundIndex: 0 | 1 | 2 | 3; phase: "betting" | "draw-discard" | "claim-window" | "npc-thinking" | "showdown" | "finished"; players: TavernShortPlayerState[]; publicCards: TavernShortCard[]; deck: TavernShortCard[]; currentBet: number; lastFullRaise: number; pendingIncomingCard: TavernShortPendingIncomingCard | null; selectedDiscardCardId: string | null; claimChain: TavernShortClaimChainState | null; pots: TavernShortPot[]; showdown: TavernShortShowdownRow[] | null; logLines: string[] }`
- Produces: `createTavernShortHand(input: { seed: number; dealerSeatIndex: number; playerName: string; openingStacks: [number, number, number, number] }): TavernShortHandState`
- Produces: `resolveTavernShortBetAction(hand: TavernShortHandState, seatId: string, action: { kind: TavernShortBetActionKind; raiseTo?: number }): TavernShortHandState`
- Produces: `drawTavernShortIncomingCard(hand: TavernShortHandState, seatId: string): TavernShortHandState`
- Produces: `chooseTavernShortDiscardCandidate(hand: TavernShortHandState, seatId: string, cardId: string): TavernShortHandState`
- Produces: `confirmTavernShortDiscard(hand: TavernShortHandState, seatId: string): TavernShortHandState`
- Produces: `passTavernShortClaim(hand: TavernShortHandState, seatId: string): TavernShortHandState`
- Produces: `claimTavernShortDiscard(hand: TavernShortHandState, optionId: string): TavernShortHandState`
- Produces: `advanceTavernShortNpcAction(hand: TavernShortHandState): TavernShortHandState`
- Produces: `settleTavernShortShowdown(hand: TavernShortHandState): TavernShortHandState`

- [ ] **Step 1: Extend the domain test file with failing runtime invariants**

Append these tests to `tests/tavern-short-gamble-domain.test.cjs`:

```js
const {
  createTavernShortHand,
  resolveTavernShortBetAction,
  drawTavernShortIncomingCard,
  chooseTavernShortDiscardCandidate,
  confirmTavernShortDiscard,
  claimTavernShortDiscard,
} = require("../.test-dist/domain/tavern-short-gambling.js");

test("tavern short hand keeps stable five-card hands through draw and discard", () => {
  const hand = createTavernShortHand({
    seed: 7,
    dealerSeatIndex: 0,
    playerName: "tester",
    openingStacks: [1200, 1200, 1200, 1200],
  });
  const drawn = drawTavernShortIncomingCard(hand, "you");
  assert.equal(drawn.players[0].hand.length, 5);
  assert.ok(drawn.pendingIncomingCard);
  const selected = chooseTavernShortDiscardCandidate(
    drawn,
    "you",
    drawn.players[0].hand[0].id
  );
  const confirmed = confirmTavernShortDiscard(selected, "you");
  assert.equal(confirmed.players[0].hand.length, 5);
  assert.equal(confirmed.pendingIncomingCard, null);
});

test("tavern short claim chains keep original resume seat and highest priority option", () => {
  const base = createTavernShortHand({
    seed: 11,
    dealerSeatIndex: 0,
    playerName: "tester",
    openingStacks: [1200, 1200, 1200, 1200],
  });
  const forced = {
    ...base,
    phase: "claim-window",
    actingSeatIndex: 2,
    claimChain: {
      discarderSeatId: "traveler",
      visibleDiscard: { id: "wan-7", suit: "wan", rank: 7 },
      originalResumeSeatId: "broker",
      stage: "kong-pong-chow",
      chainDepth: 0,
      passedSeatIds: [],
      options: [
        { id: "chow-you", seatId: "you", kind: "chow", discardCardId: "wan-7", consumeCardIds: ["wan-5", "wan-6"], priority: 1 },
        { id: "pong-broker", seatId: "broker", kind: "pong", discardCardId: "wan-7", consumeCardIds: ["bing-7", "tong-7"], priority: 2 },
      ],
    },
  };
  const claimed = claimTavernShortDiscard(forced, "pong-broker");
  assert.equal(claimed.claimChain.originalResumeSeatId, "broker");
  assert.equal(claimed.pendingIncomingCard.ownerSeatId, "broker");
});

test("tavern short auto-bet is consumed once and a short all-in kong penalty rebuilds pots", () => {
  const hand = createTavernShortHand({
    seed: 21,
    dealerSeatIndex: 0,
    playerName: "tester",
    openingStacks: [400, 400, 200, 150],
  });
  const withAutoBet = {
    ...hand,
    phase: "betting",
    bettingRoundIndex: 1,
    currentBet: 200,
    players: hand.players.map((player) =>
      player.seatId === "you" ? { ...player, autoBetPending: true } : player
    ),
  };
  const resolved = resolveTavernShortBetAction(withAutoBet, "you", { kind: "call" });
  assert.equal(resolved.players[0].autoBetPending, false);
  assert.equal(resolved.players[0].allIn || resolved.players[0].committedThisRound >= 200, true);
});
```

- [ ] **Step 2: Run the focused domain test and confirm the runtime cases fail**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/tavern-short-gamble-domain.test.cjs }
```

Expected:

- `FAIL` because the runtime transitions and state types are not implemented yet.

- [ ] **Step 3: Implement the short hand runtime**

Create `src/domain/tavern-short-gambling-runtime.ts` and re-export its public API from `src/domain/tavern-short-gambling.ts`. Use these structural rules:

```ts
export type TavernShortPendingIncomingCard = {
  ownerSeatId: string;
  source: "draw" | "claim";
  card: TavernShortCard;
};

export type TavernShortPlayerState = {
  seatId: string;
  name: string;
  isHuman: boolean;
  seatIndex: number;
  hand: TavernShortCard[];
  stack: number;
  committedThisRound: number;
  committedThisHand: number;
  folded: boolean;
  allIn: boolean;
  autoBetPending: boolean;
  discardHistory: TavernShortCard[];
  lastAction: string | null;
};
```

```ts
export function createTavernShortHand(input: {
  seed: number;
  dealerSeatIndex: number;
  playerName: string;
  openingStacks: [number, number, number, number];
}): TavernShortHandState { /* post blinds, 5-card hands, 2 public cards, currentBet 200 */ }
```

```ts
export function resolveTavernShortBetAction(
  hand: TavernShortHandState,
  seatId: string,
  action: { kind: TavernShortBetActionKind; raiseTo?: number }
): TavernShortHandState { /* no-limit, all-in, reopen rules */ }

export function drawTavernShortIncomingCard(hand: TavernShortHandState, seatId: string): TavernShortHandState { /* pendingIncomingCard only */ }
export function chooseTavernShortDiscardCandidate(hand: TavernShortHandState, seatId: string, cardId: string): TavernShortHandState { /* 5 stable + pending */ }
export function confirmTavernShortDiscard(hand: TavernShortHandState, seatId: string): TavernShortHandState { /* write discard, rebuild claim window */ }
export function claimTavernShortDiscard(hand: TavernShortHandState, optionId: string): TavernShortHandState { /* priority, kong penalty, autoBetPending */ }
export function advanceTavernShortNpcAction(hand: TavernShortHandState): TavernShortHandState { /* deterministic betting/draw/discard/claim */ }
```

Required runtime rules:

- stable hand arrays stay length `5`
- claim chains preserve the original resume seat
- `kong / pong > chow`, and same-priority ties use clockwise-nearest order
- `autoBetPending` is consumed only on the next default betting action for that seat
- all-in seats stay eligible for draw-discard and claims but cannot raise
- any chip-affecting transition rebuilds `pots` from total hand contributions

- [ ] **Step 4: Re-run the focused domain test and confirm the runtime cases pass**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/tavern-short-gamble-domain.test.cjs }
```

Expected:

- `PASS` for the evaluator tests plus the new runtime invariant tests.

- [ ] **Step 5: Sync plan and governance state**

Update this plan:

- set `Execution State.Last Updated` to the current date
- set `Execution State.Current Focus` to `Task 2 complete; Task 3 tavern house session wiring next.`
- set `Execution State.Next Step` to `Write Task 3 short-table house tests.`
- append a `Progress Log` entry with both the RED and GREEN test results
- check the completed Task 2 boxes

Update `docs/superpowers/project-progress.md` so `Next Required Action` points at `execute-tavern-short-gamble-task-3`.

- [ ] **Step 6: Commit Task 2**

Run:

```bash
git add docs/superpowers/project-progress.md docs/superpowers/plans/2026-07-28-tavern-short-gamble-plan.md src/domain/tavern-short-gambling.ts src/domain/tavern-short-gambling-runtime.ts tests/tavern-short-gamble-domain.test.cjs
git commit -m "feat: add tavern short hand runtime"
```

## Task 3: Tavern Short Table Session And Economy Integration

**Files:**
- Create: `src/application/house-modules/tavern/tavern-short-gamble-session.ts`
- Modify: `src/domain/house-modules/tavern-session.ts`
- Modify: `src/application/house-modules/tavern/tavern-session-state.ts`
- Modify: `src/application/house-modules/tavern/tavern-house-module.ts`
- Modify: `src/content/scenario-packs/zhuyuanzhang/text-entries.json`
- Create: `tests/tavern-short-gamble-house.test.cjs`
- Modify: `docs/superpowers/project-progress.md`
- Modify: `docs/superpowers/plans/2026-07-28-tavern-short-gamble-plan.md`

**Interfaces:**
- Consumes: `createTavernShortHand()`, `advanceTavernShortNpcAction()`, `settleTavernShortShowdown()`
- Produces: `type TavernActiveGambleSession = { variant: "long"; session: TavernGambleSession } | { variant: "short"; table: TavernShortTableSession }`
- Produces: `type TavernShortTableSession = { variant: "short"; playerSeatId: string; bankrollBySeatId: Record<string, number>; npcBaselineChips: number; dealerSeatIndex: number; handCount: number; buyInGoldTotal: number; currentHand: TavernShortHandState | null; lastCompletedHand: TavernShortCompletedHand | null; prompt: "continue-or-cashout" | "rebuy-or-cashout" | null; staminaCharged: boolean }`
- Produces: `createTavernShortTableSession(input: { playerName: string; buyInGold: number; seed: number }): TavernShortTableSession`
- Produces: `continueTavernShortTableSession(session: TavernShortTableSession, seed: number): TavernShortTableSession`
- Produces: `rebuyTavernShortTableSession(session: TavernShortTableSession, additionalGold: number, seed: number): TavernShortTableSession`
- Produces: `cashOutTavernShortTableSession(session: TavernShortTableSession): { goldDelta: number; leftoverChips: number }`

- [ ] **Step 1: Write the failing tavern short house-session tests**

Create `tests/tavern-short-gamble-house.test.cjs` with these focused cases:

```js
const test = require("node:test");
const assert = require("node:assert/strict");

const { prototypeCharacters, prototypeHouses } = require("../.test-dist/content/prototype-world.js");
const { tavernHouseModule } = require("../.test-dist/application/house-modules/tavern/tavern-house-module.js");
const { ACTIVITY_COMPLETION_STAMINA_COST } = require("../.test-dist/application/player/player-stamina.js");

const tavernHouse = prototypeHouses.find((house) => house.moduleId === "tavern");
const playerCharacterId = "char.player";

function openShortTable(baseState, characters, buyInGold) {
  const entered = tavernHouseModule.enter({
    gameState: baseState,
    characterDefinitions: characters,
    houseDefinition: tavernHouse,
    playerCharacterId,
  });
  const opened = tavernHouseModule.dispatch({
    gameState: entered.gameState,
    characterDefinitions: entered.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: entered.sessionState,
    request: { type: "action", actionId: "open-gamble" },
  });
  const selected = tavernHouseModule.dispatch({
    gameState: opened.gameState,
    characterDefinitions: opened.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: opened.sessionState,
    request: { type: "action", actionId: "select-gamble-variant:short" },
  });
  return tavernHouseModule.dispatch({
    gameState: selected.gameState,
    characterDefinitions: selected.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: { ...selected.sessionState, currentWager: buyInGold },
    request: { type: "action", actionId: "confirm-gamble" },
  });
}

test("tavern short buy-in exchanges gold to chips and charges stamina once per table", () => {
  const started = openShortTable(createBaseState(), prototypeCharacters, 100);
  const player = getPlayerCharacter(started.characterDefinitions);
  assert.equal(started.sessionState.gambleSession.variant, "short");
  assert.equal(player.stats.gold, 20);
  assert.equal(player.stamina, getPlayerCharacter(prototypeCharacters).stamina - ACTIVITY_COMPLETION_STAMINA_COST);
});

test("tavern short continue next hand reuses bankroll instead of charging gold again", () => {
  const started = openShortTable(createBaseState(), prototypeCharacters, 100);
  const afterContinue = tavernHouseModule.dispatch({
    gameState: started.gameState,
    characterDefinitions: started.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: started.sessionState,
    request: { type: "action", actionId: "gamble-short-continue-hand" },
  });
  assert.equal(afterContinue.sessionState.gambleSession.variant, "short");
  assert.equal(
    getPlayerCharacter(afterContinue.characterDefinitions).stats.gold,
    getPlayerCharacter(started.characterDefinitions).stats.gold
  );
});

test("tavern short cash-out floors chips back to gold and clears the short table session", () => {
  const started = openShortTable(createBaseState(), prototypeCharacters, 100);
  const cashout = tavernHouseModule.dispatch({
    gameState: started.gameState,
    characterDefinitions: started.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: started.sessionState,
    request: { type: "action", actionId: "gamble-short-cash-out" },
  });
  assert.equal(cashout.sessionState.gambleSession, null);
  assert.equal(cashout.sessionState.overlay.type, "alert");
});
```

- [ ] **Step 2: Run the focused tavern house test and confirm it fails**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/tavern-short-gamble-house.test.cjs }
```

Expected:

- `FAIL` because the tavern house module still creates the old short mahjong session and has no short-table session actions.

- [ ] **Step 3: Implement the short-table session union and tavern economy wiring**

Create `src/application/house-modules/tavern/tavern-short-gamble-session.ts` and wire it through `tavern-session.ts`, `tavern-session-state.ts`, and `tavern-house-module.ts`.

Add this union to `src/domain/house-modules/tavern-session.ts`:

```ts
export type TavernActiveGambleSession =
  | { variant: "long"; session: TavernGambleSession }
  | { variant: "short"; table: TavernShortTableSession };

export type TavernGambleTableOverlayState = {
  type: "gamble-table";
  session: TavernActiveGambleSession;
};
```

Create short-table helpers with these signatures:

```ts
export function createTavernShortTableSession(input: {
  playerName: string;
  buyInGold: number;
  seed: number;
}): TavernShortTableSession { /* gold -> chips, baseline NPC bankroll, first hand */ }

export function continueTavernShortTableSession(
  session: TavernShortTableSession,
  seed: number
): TavernShortTableSession { /* rotate dealer and start next hand */ }

export function rebuyTavernShortTableSession(
  session: TavernShortTableSession,
  additionalGold: number,
  seed: number
): TavernShortTableSession { /* add chips, restart prompt flow */ }

export function cashOutTavernShortTableSession(
  session: TavernShortTableSession
): { goldDelta: number; leftoverChips: number } { /* floor(chips / 10) */ }
```

In `tavern-house-module.ts`, add short-session action ids:

```ts
const GAMBLE_SHORT_CONTINUE_ACTION_ID = "gamble-short-continue-hand";
const GAMBLE_SHORT_REBUY_ACTION_ID = "gamble-short-rebuy";
const GAMBLE_SHORT_CASH_OUT_ACTION_ID = "gamble-short-cash-out";
```

Required behavior:

- `confirm-gamble` for short mode deducts gold immediately and charges stamina once when the table session starts
- the same short table can continue multiple hands without additional stamina charges
- if the player bankroll drops below `200` chips after a hand, prompt `rebuy-or-cashout`
- otherwise prompt `continue-or-cashout`
- NPC bankroll is table-local only and auto-rebuys to the stored baseline between hands
- long mode still uses the old `TavernGambleSession` path unchanged

Add or replace tavern text ids for:

- short start
- rebuy prompt
- continue prompt
- cash-out result
- short settlement summary

- [ ] **Step 4: Re-run the focused tavern house test and confirm it passes**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/tavern-short-gamble-house.test.cjs }
```

Expected:

- `PASS` for buy-in, continue, and cash-out integration.

- [ ] **Step 5: Sync plan and governance state**

Update this plan:

- set `Execution State.Last Updated` to the current date
- set `Execution State.Current Focus` to `Task 3 complete; Task 4 overlay and renderer work next.`
- set `Execution State.Next Step` to `Write Task 4 UI contract tests.`
- append a `Progress Log` entry with the RED and GREEN house-test results
- check the completed Task 3 boxes

Update `docs/superpowers/project-progress.md` so `Next Required Action` points at `execute-tavern-short-gamble-task-4`.

- [ ] **Step 6: Commit Task 3**

Run:

```bash
git add docs/superpowers/project-progress.md docs/superpowers/plans/2026-07-28-tavern-short-gamble-plan.md src/domain/house-modules/tavern-session.ts src/application/house-modules/tavern/tavern-session-state.ts src/application/house-modules/tavern/tavern-short-gamble-session.ts src/application/house-modules/tavern/tavern-house-module.ts src/content/scenario-packs/zhuyuanzhang/text-entries.json tests/tavern-short-gamble-house.test.cjs
git commit -m "feat: wire tavern short table session"
```

## Task 4: Variant-Specific Overlay Contract And Tavern Short Renderer

**Files:**
- Modify: `src/domain/house-module.ts`
- Create: `src/application/house-modules/tavern/tavern-short-gamble-view-model.ts`
- Modify: `src/application/house-modules/tavern/tavern-house-module.ts`
- Modify: `src/ui/views/house/tavern-house-view.ts`
- Modify: `src/styles/tea-house.css`
- Create: `tests/tavern-short-gamble-ui-contract.test.cjs`
- Modify: `docs/superpowers/project-progress.md`
- Modify: `docs/superpowers/plans/2026-07-28-tavern-short-gamble-plan.md`

**Interfaces:**
- Consumes: `TavernShortTableSession`, `TavernActiveGambleSession`
- Produces: `selectTavernShortGambleOverlay(table: TavernShortTableSession): Extract<HouseOverlayViewModel, { type: "gamble-table"; variant: "short" }>`
- Produces short overlay fields:
  - `sidePotLabels: string[]`
  - `pendingIncomingCard: { source: "draw" | "claim"; label: string } | null`
  - `visibleDiscard: { seatName: string; label: string } | null`
  - `claimOptions: Array<{ id: string; kind: "chow" | "pong" | "kong"; label: string; actionId: string; flashing: boolean }>`
  - `betweenHandActions?: { continueActionId?: string; rebuyActionId?: string; cashOutActionId: string }`
  - `playerRows: Array<{ id: string; name: string; seatIndex: number; stack: number; committed: number; folded: boolean; allIn: boolean; autoBetPending: boolean; discardLabels: string[] }>`
- Produces long overlay compatibility by leaving the existing long-specific render path intact

- [ ] **Step 1: Write the failing short overlay and renderer contract tests**

Create `tests/tavern-short-gamble-ui-contract.test.cjs` with these checks:

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const { renderTavernHouseView } = require("../.test-dist/ui/views/house/tavern-house-view.js");
const { selectTavernShortGambleOverlay } = require("../.test-dist/application/house-modules/tavern/tavern-short-gamble-view-model.js");
const { createTavernShortTableSession } = require("../.test-dist/application/house-modules/tavern/tavern-short-gamble-session.js");
const { createTavernLongGambleSession } = require("../.test-dist/domain/tavern-gambling.js");

test("tavern short overlay exposes pending incoming card, side pots, and between-hand actions", () => {
  const table = createTavernShortTableSession({
    playerName: "tester",
    buyInGold: 100,
    seed: 17,
  });
  const overlay = selectTavernShortGambleOverlay({
    ...table,
    currentHand: {
      ...table.currentHand,
      pendingIncomingCard: {
        ownerSeatId: "you",
        source: "draw",
        card: { id: "wan-1", suit: "wan", rank: 1 },
      },
      pots: [
        { id: "main", amount: 800, eligibleSeatIds: ["you", "traveler"] },
        { id: "side-1", amount: 400, eligibleSeatIds: ["you"] },
      ],
    },
    prompt: "continue-or-cashout",
  });

  assert.equal(overlay.variant, "short");
  assert.equal(overlay.pendingIncomingCard.label, "1万");
  assert.deepEqual(overlay.sidePotLabels, ["主池 800", "边池 400"]);
  assert.equal(overlay.betweenHandActions.cashOutActionId, "gamble-short-cash-out");
});

test("tavern house view renders short pending slot and between-hand buttons without long-only play-slot copy", () => {
  const markup = renderTavernHouseView({
    moduleId: "tavern",
    title: "酒馆",
    actionContainer: { sections: [] },
    overlay: {
      type: "gamble-table",
      variant: "short",
      title: "酒馆短牌",
      phase: "摸打",
      pot: 800,
      currentBet: 200,
      chipLabel: "筹码",
      publicCards: [{ id: "wan-1", label: "1万" }, { id: "wan-13", label: "13万" }],
      handCards: [{ id: "tong-8", label: "8筒", selected: false, actionId: "pick" }],
      sidePotLabels: ["主池 800"],
      pendingIncomingCard: { source: "draw", label: "5条" },
      visibleDiscard: { seatName: "行脚客", label: "7万" },
      claimOptions: [],
      playerRows: [],
      logLines: [],
      showdownRows: [],
      betweenHandActions: {
        continueActionId: "gamble-short-continue-hand",
        cashOutActionId: "gamble-short-cash-out",
      },
      actionIds: { check: "check", call: "call", raise: "raise", fold: "fold", close: "close" },
    },
    dialogue: null,
    standbyRoster: [],
    statusCards: [],
    leaveAction: { actionId: "leave-house", label: "离开" },
  });

  assert.match(markup, /待入手 5条/u);
  assert.match(markup, /继续下一局/u);
  assert.match(markup, /退出结算/u);
  assert.doesNotMatch(markup, /选择 3 张顺\/刻/u);
});

test("tavern long overlay still renders existing long-mode structure", () => {
  const session = createTavernLongGambleSession({ wager: 100, seed: 33, playerName: "tester" });
  assert.equal(session.variant, "long");
  assert.equal(session.players[0].publicTileSlots.length, 9);
});
```

- [ ] **Step 2: Run the focused UI contract test and confirm it fails**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/tavern-short-gamble-ui-contract.test.cjs }
```

Expected:

- `FAIL` because the public overlay contract, view-model helper, and short renderer do not exist yet.

- [ ] **Step 3: Implement the short overlay contract, mapper, renderer, and styling**

Modify `src/domain/house-module.ts` to split `gamble-table` by variant. Add a short payload with exact field names used in the tests:

```ts
type ShortGambleTableOverlay = {
  type: "gamble-table";
  variant: "short";
  title: string;
  phase: string;
  pot: number;
  currentBet: number;
  chipLabel: string;
  publicCards: Array<{ id: string; label: string }>;
  handCards: Array<{ id: string; label: string; selected: boolean; actionId?: string }>;
  sidePotLabels: string[];
  pendingIncomingCard: { source: "draw" | "claim"; label: string } | null;
  visibleDiscard: { seatName: string; label: string } | null;
  claimOptions: Array<{ id: string; kind: "chow" | "pong" | "kong"; label: string; actionId: string; flashing: boolean }>;
  playerRows: Array<{ id: string; name: string; seatIndex: number; stack: number; committed: number; folded: boolean; allIn: boolean; autoBetPending: boolean; discardLabels: string[] }>;
  logLines: string[];
  showdownRows: Array<{ playerName: string; bestLabel: string; winningPotLabels: string[]; chipDelta: number; folded: boolean; winner: boolean }>;
  betweenHandActions?: { continueActionId?: string; rebuyActionId?: string; cashOutActionId: string };
  actionIds: { check: string; call: string; raise: string; fold: string; draw?: string; confirmDiscard?: string; close: string };
};
```

Create `src/application/house-modules/tavern/tavern-short-gamble-view-model.ts`:

```ts
export function selectTavernShortGambleOverlay(
  table: TavernShortTableSession
): Extract<HouseOverlayViewModel, { type: "gamble-table"; variant: "short" }> {
  /* map currentHand + prompt + player bankroll into short UI payload */
}
```

Renderer requirements:

- show the `2` public cards in a short-specific public-card row
- show the pending incoming card as `待入手 {label}`
- show `主池 / 边池` summaries
- show `继续下一局 / 再次兑换 / 退出结算` actions only when the prompt is active
- keep bottom-to-top enter animation for short cards
- keep long-mode markup path unchanged except for the new discriminated union branch

- [ ] **Step 4: Re-run the focused UI contract test and confirm it passes**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/tavern-short-gamble-ui-contract.test.cjs }
```

Expected:

- `PASS` for short overlay mapping, short markup rendering, and long no-regression.

- [ ] **Step 5: Sync plan and governance state**

Update this plan:

- set `Execution State.Last Updated` to the current date
- set `Execution State.Current Focus` to `Task 4 complete; Task 5 docs and final regressions next.`
- set `Execution State.Next Step` to `Replace old short-mode robustness assertions and update docs.`
- append a `Progress Log` entry with the RED and GREEN UI-contract results
- check the completed Task 4 boxes

Update `docs/superpowers/project-progress.md` so `Next Required Action` points at `execute-tavern-short-gamble-task-5`.

- [ ] **Step 6: Commit Task 4**

Run:

```bash
git add docs/superpowers/project-progress.md docs/superpowers/plans/2026-07-28-tavern-short-gamble-plan.md src/domain/house-module.ts src/application/house-modules/tavern/tavern-short-gamble-view-model.ts src/application/house-modules/tavern/tavern-house-module.ts src/ui/views/house/tavern-house-view.ts src/styles/tea-house.css tests/tavern-short-gamble-ui-contract.test.cjs
git commit -m "feat: render tavern short gamble table"
```

## Task 5: Replace Old Short Regressions, Update Docs, And Run Final Verification

**Files:**
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/special-house-interface.md`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/project-progress.md`
- Modify: `docs/superpowers/plans/2026-07-28-tavern-short-gamble-plan.md`

**Interfaces:**
- Consumes: `TavernActiveGambleSession`, `selectTavernShortGambleOverlay()`, short-table action ids, long-session no-regression expectations
- Produces robustness coverage for:
  - short buy-in creates a persistent table session instead of the old mahjong short hand
  - short settlement prompts continue/rebuy/cash-out instead of immediate old `gamble-settle`
  - long start path still creates the existing long session
  - `src/main.ts` still has no tavern-specific branch

- [ ] **Step 1: Replace the old short-mode robustness assumptions with failing high-level regressions**

In `tests/robustness.test.cjs`, replace the old short-only assertions near the existing tavern gamble tests with these high-level checks:

```js
test("tavern short gamble start creates a persistent short table session", () => {
  const started = openShortTable(createBaseState(), prototypeCharacters, 100);
  assert.equal(started.sessionState.overlay.type, "gamble-table");
  assert.equal(started.sessionState.gambleSession.variant, "short");
  assert.equal(started.sessionState.gambleSession.table.currentHand.players[0].hand.length, 5);
  assert.equal(started.sessionState.gambleSession.table.currentHand.publicCards.length, 2);
  assert.equal(started.sessionState.gambleSession.table.currentHand.currentBet, 200);
});

test("tavern short and long sessions stay isolated behind the tavern gamble session union", () => {
  const shortStarted = openShortTable(createBaseState(), prototypeCharacters, 100);
  const longStarted = openLongTable(createBaseState(), prototypeCharacters, 100);
  assert.equal(shortStarted.sessionState.gambleSession.variant, "short");
  assert.equal(longStarted.sessionState.gambleSession.variant, "long");
  assert.equal(longStarted.sessionState.gambleSession.session.variant, "long");
});
```

Also keep or add a source-level guard:

```js
assert.doesNotMatch(readSource("src/main.ts"), /tavern-short|gamble-short/u);
```

- [ ] **Step 2: Run the focused robustness pattern and confirm it fails**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none --test-name-pattern "tavern short gamble|tavern long gamble|tavern gamble" tests/robustness.test.cjs }
```

Expected:

- `FAIL` because the old short assumptions in robustness do not match the new table-session model yet.

- [ ] **Step 3: Update docs and finish the new high-level regressions**

Update `tests/robustness.test.cjs`, `docs/special-house-interface.md`, and `docs/change-log.md`.

Add changelog bullets like:

```md
- Tavern short gamble now uses a dedicated `52`-card short runtime with `5` private cards, `2` public cards, claim-chain interaction, no-limit side pots, and persistent chips across multiple hands.
- `tavern` house session now stores a short-vs-long gamble session union; short mode cashes chips in/out at `10:1` and long mode remains on the previous mahjong runtime.
- `gamble-table` overlay is now variant-specific, so short mode exposes chip/pot/claim payloads while long mode keeps its existing mahjong contract.
```

In `docs/special-house-interface.md`, add the tavern-specific note that staged table overlays may be discriminated by variant and that short-mode persistent table sessions are still owned under the house session branch instead of globals.

- [ ] **Step 4: Run the final verification sweep**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools/lint-superpowers-plans.mjs
npm run build:test
if ($LASTEXITCODE -eq 0) {
  node --test --test-isolation=none tests/tavern-short-gamble-domain.test.cjs tests/tavern-short-gamble-house.test.cjs tests/tavern-short-gamble-ui-contract.test.cjs
  node --test --test-isolation=none --test-name-pattern "tavern short gamble|tavern long gamble|tavern gamble" tests/robustness.test.cjs
}
npm run typecheck
npm run build
```

Optional:

```powershell
npm test
```

Expected:

- plan lint passes
- all new targeted short tests pass
- targeted tavern robustness tests pass
- typecheck passes
- build passes
- if `npm test` fails only the known unrelated child 27 baseline, record the exact failure and keep the child `completed-but-open`

- [ ] **Step 5: Sync plan and governance state**

Update this plan:

- set `Execution State.Status` to `completed-but-open` after local verification succeeds
- set `Execution State.Last Updated` to the current date
- set `Execution State.Current Focus` to `Local implementation complete; waiting for review/push or explicit acceptance of any unrelated baseline failure.`
- set `Execution State.Next Step` to `Review final diff, push when requested, and only then close the child.`
- set `Execution State.Verification` to the exact final command results
- append a `Progress Log` entry with the final verification summary
- check the completed Task 5 boxes

Update `docs/superpowers/project-progress.md` so `Current Child Status` and `Current Task Status` are `completed-but-open`, `Next Required Action` points at review/push, and `Next Owner Document` stays on this plan until closeout.

- [ ] **Step 6: Commit Task 5**

Run:

```bash
git add docs/change-log.md docs/special-house-interface.md docs/superpowers/project-progress.md docs/superpowers/plans/2026-07-28-tavern-short-gamble-plan.md tests/robustness.test.cjs
git commit -m "docs: finalize tavern short gamble rollout"
```

## Exit Check

- [ ] `Short mode runs on a dedicated domain runtime and evaluator instead of the old mahjong short branches.`
- [ ] `Tavern short tables persist chips across hands with continue/rebuy/cash-out behavior and one-time stamina charge per table session.`
- [ ] `The tavern gamble session and gamble-table overlay are split into short-vs-long variant contracts without regressing long mode.`
- [ ] `docs/special-house-interface.md` and `docs/change-log.md` are updated for the new session and overlay wiring.`
- [ ] Project progress sync is updated if execution was promoted to this child.
- [ ] Closeout block is added before the child is marked `closed`.

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
