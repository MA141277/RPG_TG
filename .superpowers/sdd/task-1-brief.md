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

- [ ] **Step 1: Promote this plan into the canonical progress entry before code work starts**

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

- [ ] **Step 2: Write the failing evaluator and pot tests**

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
  assert.equal(getTavernShortCardLabel(deck.find((card) => card.id === "wan-1")), "1‰∏?);
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

- [ ] **Step 3: Run the focused domain test and confirm it fails**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/tavern-short-gamble-domain.test.cjs }
```

Expected:

- `FAIL` because `src/domain/tavern-short-gambling.ts` and its exported helpers do not exist yet.

- [ ] **Step 4: Implement the public short card contract and evaluator helpers**

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
  const suitLabel = card.suit === "wan" ? "‰∏? : card.suit === "bing" ? "È•? : card.suit === "tong" ? "Á≠? : "Êù?;
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

- [ ] **Step 5: Re-run the focused domain test and confirm it passes**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/tavern-short-gamble-domain.test.cjs }
```

Expected:

- `PASS` for the three new evaluator/pot tests.

- [ ] **Step 6: Sync plan and governance state**

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

