# Tavern Short Gamble Design

## 1. Goal

Replace tavern `short` gambling with the approved hybrid ruleset:

- Texas Hold'em style blinds, no-limit betting, fold, pots, side pots, and `7` choose `5` showdown
- Mahjong-style discard claim interaction through `chow / pong / kong`
- fixed `4`-player table
- persistent chips across multiple hands inside one tavern table session

The implementation must keep the existing `tavern` house integration model and must not break the current `long` variant.

## 2. Current Context And Mismatch

The current tavern short implementation is structurally incompatible with the requested game:

- current short mode is a mahjong/fan-scoring ruleset
- current short mode uses a `144`-tile deck, `4` private tiles, `9` public tiles, played-group slots, and fan labels
- requested short mode requires a unique `52`-card deck, `5` private cards, `2` always-open public cards, `3` draw-discard rounds, standard poker ranking, and full side-pot handling

Because of that mismatch, the new short mode must not be added as more `variant` branches inside the existing mahjong short runtime. `long` remains on the current runtime; `short` gets its own isolated runtime and scoring path.

## 3. Approved Gameplay Contract

### 3.1 Currency And Chips

- tavern short uses `1 gold = 10 chips`
- entering a short table exchanges player gold into table chips
- the short table session persists chips across multiple hands until the player rebuys or cashes out
- leaving the short table converts remaining chips back to gold at `10:1`
- chip-to-gold conversion on exit rounds down to whole gold
- leftover chips below `10` are discarded on cash-out and do not persist outside the table session

### 3.2 Seats And Blinds

- table size is fixed at `4`
- dealer rotates clockwise each hand
- small blind is dealer `+1`
- big blind is dealer `+2`
- blind level is fixed at `100 / 200` chips
- opening action starts from the big blind's next seat
- post-draw betting rounds start from the dealer's next seat

### 3.3 Deck And Rank Mapping

- short mode uses a unique `52`-card deck
- suits are `wan / bing / tong / tiao`
- ranks are numeric `1..13`
- rank `1` is treated as Ace
- showdown ranking follows standard poker semantics:
  - `1-2-3-4-5` is the wheel straight
  - `10-11-12-13-1` is the Ace-high straight
  - `10-11-12-13-1` in one suit is the royal flush

### 3.4 Private Hand Size Invariant

The user requirement is strict: every player's hand must remain exactly `5` cards at all stable runtime states.

To satisfy that invariant:

- drawn cards are stored in a pending incoming slot, not immediately appended to the hand array
- claimed discard cards are stored in a pending incoming slot, not immediately appended to the hand array
- the stable private hand array remains length `5` throughout the entire hand
- once the player or AI chooses the discard, the runtime atomically resolves `pending incoming card + existing 5 cards -> next stable 5-card hand`

This rule applies to both human and AI seats.

### 3.5 Public Cards And Hand Flow

- each player starts each hand with `5` private cards
- there are `2` public cards visible from the start of the hand
- there are at most `3` draw-discard rounds
- in each draw-discard round, every non-folded player resolves one `draw 1 -> discard 1` turn
- after the third draw-discard round, the hand forces showdown unless it has already ended early

### 3.6 Normal Betting Schedule

- there are `4` normal betting rounds total
- round `0` happens immediately after blinds and initial deal
- after each full draw-discard round finishes, another normal betting round begins
- each betting round resets the round-local `currentBet` to `0`
- short mode remains `no-limit`
- explicit `check / call / raise / fold` buttons remain in the UI during normal betting rounds

### 3.7 Raise Semantics

- opening a betting round requires at least one big blind (`200`) unless the bettor is short and can only go all-in for less
- a raise must increase the total committed amount by at least the previous full raise size
- a short all-in that is smaller than a full raise does not reopen action

This keeps short mode aligned with standard no-limit Texas betting rather than the current simplified tavern runtime behavior.

### 3.8 Draw And Claim Interaction

The draw-discard phase has no manual betting popup between actions. Instead:

- `chow / pong / kong` remain draw-discard interactions
- when a claim succeeds, the claimer must immediately discard one card
- the claim action registers an auto-bet marker for the next normal betting round
- on that later betting round:
  - if nobody has opened betting before the claimant acts, the auto-bet resolves as `check`
  - if betting is already open, the auto-bet resolves as `call`
  - if the claimant lacks chips, the auto-bet resolves as an all-in call for the remaining stack
- auto-bet only replaces that seat's first default action in the next normal betting round
- if the round later comes back to that seat after a reopen, the seat acts normally
- if the claimant is already fully all-in with `0` available chips, the auto-bet marker is consumed with no chip movement because that seat is skipped by betting eligibility

### 3.9 Claim Rules

- `chow`:
  - only the discarder's clockwise next seat may use it
  - requires same-suit numeric sequence with the discard plus two private cards
  - wraparound sequences through `13 -> 1` are not valid chow sequences
- `pong`:
  - any other live seat may use it
  - requires two cards of the same rank as the discard
- `kong`:
  - any other live seat may use it
  - requires three cards of the same rank as the discard
  - no replacement draw occurs
  - after a successful kong, every other still-live seat commits one additional big blind if possible, otherwise goes all-in for the remaining stack

### 3.10 Claim Priority And Chain Resolution

- for the same discard, `kong / pong > chow`
- within the same priority level, the nearest clockwise eligible seat from the current discarder wins
- a claimer's forced discard opens a fresh claim window
- the entire chain shares one fixed resume seat: the original discarder's clockwise next seat
- when the chain ends, play resumes from that original resume seat and does not jump to the claimer's next seat

### 3.11 Fold, All-In, And Early End

- folded seats leave the current hand immediately
- if only one non-folded seat remains, that seat immediately wins every currently formed pot and the hand ends without showdown
- all-in seats remain in the hand for draw-discard and claim interaction
- all-in seats cannot voluntarily raise
- all-in seats can only win pots whose contribution cap includes them
- if an all-in seat has no chips left, later betting rounds skip that seat

### 3.12 Showdown

- each non-folded seat uses `5` private cards plus `2` public cards
- the evaluator selects the best `5`-card combination out of `7`
- ranking order is:
  - royal flush
  - straight flush
  - four of a kind
  - full house
  - flush
  - straight
  - three of a kind
  - two pair
  - one pair
  - high card
- tied hands split only the pots they are both eligible to win
- remainder chips from an uneven split are awarded clockwise from the dealer's next seat among that pot's tied winners

## 4. Architecture

### 4.1 High-Level Split

The implementation uses four layers:

1. `short rules runtime`
   - owns table-hand state transitions for short mode only
2. `short hand evaluator / pot builder`
   - owns `7` choose `5`, rank comparison, pot reconstruction, and payout distribution
3. `tavern house orchestration`
   - owns buy-in, rebuy, continue-next-hand, cash-out, and mapping domain state into tavern overlays
4. `view / animation`
   - renders short-mode specific table UI and bottom-to-top dealing/discard animation

### 4.2 Module Boundaries

Planned boundary split:

- `src/domain/tavern-gambling.ts` and the current runtime continue to serve `long`
- add a dedicated short runtime module, for example:
  - `src/domain/tavern-short-gambling.ts`
  - `src/domain/tavern-short-gambling-evaluator.ts`
- `src/application/house-modules/tavern/tavern-house-module.ts` remains the only house orchestration entry
- `src/ui/views/house/tavern-house-view.ts` keeps rendering `gamble-choice` and `gamble-table`, but short and long no longer share one giant field set

### 4.3 House Contract Constraints

The feature must continue to satisfy the repository house rules:

- no house-specific business branches in `src/main.ts`
- no ad hoc module-level persistent state
- no HTML returned from `application/*`
- all persistent tavern changes remain inside unified game state and house session structures
- the tavern registry/lifecycle path stays `enter -> dispatch -> selectViewModel -> leave`

Because tavern house session shape and gamble overlay shape will change, implementation must update:

- `docs/special-house-interface.md`
- `docs/change-log.md`

## 5. State Model

### 5.1 Tavern Session Layer

`TavernSessionState` remains the house-owned session root. It keeps:

- selected gamble variant before start
- selected buy-in amount
- current tavern overlay
- work / drink flow state
- one active gamble session wrapper

The gamble session wrapper becomes a discriminated union:

- `variant: "short"` holds a `TavernShortTableSession`
- `variant: "long"` holds the existing long session object

This avoids mixing long-specific mahjong fields with short-specific poker fields.

### 5.2 Short Table Session Layer

`TavernShortTableSession` owns the multi-hand chip session:

- persistent bankroll snapshot by seat
- player chip stack available for rebuy / continue / cash-out decisions
- total gold bought into the table during this visit
- NPC auto-rebuy baseline chips for future hands
- current dealer seat
- hand counter
- pending rebuy / continue / cash-out prompt state
- current hand snapshot
- last completed hand summary

This layer is what persists when the player chooses `continue next hand`.

Only the player bankroll is linked to campaign gold. NPC bankroll remains table-local and may auto-rebuy to the stored baseline between hands so the table stays `4`-handed.

### 5.3 Short Hand State Layer

`TavernShortHandState` owns one hand only:

- shuffled remaining deck
- public cards
- round-local phase
- draw round index
- betting round index
- acting seat
- players
- pending incoming card slot
- claim chain state
- total hand contributions by seat
- rebuilt pot state
- showdown result
- hand log

### 5.4 Player State

Each short seat keeps:

- seat identity and display name
- stable `5`-card private hand
- chip stack
- round-local committed amount
- hand-total committed amount
- folded flag
- all-in flag
- pending auto-bet marker
- discard history
- last action summary

### 5.5 Pending Incoming Card

To preserve the `5`-card invariant, the hand runtime carries one transient slot:

- `source: "draw" | "claim"`
- `ownerSeat`
- `card`

The active seat resolves discard choice against `stableHand + pendingIncomingCard`, then the runtime commits the next stable `5`-card hand in one transition.

### 5.6 Claim Chain

`ClaimChainState` keeps:

- current visible discard
- current discarder seat
- original resume seat
- ordered eligible claims
- claim priority stage
- chain depth for logging/debugging

The original resume seat never changes during one chain.

### 5.7 Pot State

Pot state should be derived rather than hand-mutated in many branches.

- each seat tracks hand-total committed chips
- after any chip-affecting action, a pure helper rebuilds:
  - main pot
  - ordered side pots
  - eligible winner seats per pot

This prevents desynchronization between betting, kong penalties, and showdown payout.

## 6. Hand Lifecycle

### 6.1 Starting A Short Table

When the player confirms short-mode buy-in:

- verify tavern activity stamina cost once
- verify enough gold for the selected buy-in
- deduct gold immediately
- convert gold to chips
- create `TavernShortTableSession`
- store NPC auto-rebuy baseline as the opening buy-in converted to chips, clamped to at least `200`
- start the first `TavernShortHandState`

### 6.2 Starting A Hand

Each hand:

- rotate dealer
- assign blinds
- deal `5` private cards per seat
- reveal `2` public cards
- seed round `0` betting

### 6.3 Per-Hand Flow

Per hand flow is fixed:

1. opening betting
2. draw-discard round `1`
3. betting round `1`
4. draw-discard round `2`
5. betting round `2`
6. draw-discard round `3`
7. betting round `3`
8. showdown or earlier finish

### 6.4 After A Hand

After payout:

- if the player has fewer than `200` chips, show `rebuy or cash out`
- any NPC seat below the blind threshold auto-rebuys to the stored NPC baseline before the next hand starts
- otherwise show `continue next hand or cash out`
- continuing reuses the same short table session and starts a new hand without charging stamina again
- cash-out ends only the short table session and returns control to the tavern house

## 7. House Integration And UI

### 7.1 Overlay Model

`gamble-table` remains the public tavern overlay entry point, but becomes a discriminated union by variant:

- `type: "gamble-table", variant: "short"` exposes short-specific fields
- `type: "gamble-table", variant: "long"` exposes long-specific fields

Short overlay fields should include:

- chip stack, current pot, side pot summary
- `2` public cards
- stable `5`-card private hand plus optional pending incoming card slot
- visible discard and claim options
- betting buttons during normal betting rounds
- hand log
- showdown rows with winning pots and chip deltas
- continue / rebuy / cash-out actions after each hand

Long overlay fields remain on the current mahjong-style model and must not depend on short-specific fields.

### 7.2 Rendering Rules

- dealing and discard animations move from bottom to top
- other players show card backs and discard history only
- claimed cards are never locked into a separate meld area after resolution
- short-mode result UI shows poker hand names and pot allocation, not mahjong fan labels

### 7.3 Existing Tavern Flow

The tavern interaction path remains:

- `open-gamble`
- choose `short` or `long`
- choose buy-in amount
- enter the selected table flow

The existing temporary tavern-entry debug bypass remains outside this design and must not be folded into short-game mechanics.

## 8. Error Handling And Validation

### 8.1 Illegal Action Policy

The short runtime should reject illegal requests and return the prior state unchanged, plus a reason suitable for logging or UI messaging.

It must not silently reinterpret:

- illegal check as call
- illegal claim as pass
- illegal discard as auto-select

### 8.2 Runtime Guards

The runtime should assert or validate:

- every stable private hand length is exactly `5`
- no duplicate cards exist in deck, public cards, pending incoming slot, or private hands
- chip stacks never go below `0`
- pot reconstruction total matches total committed chips
- claim chain resume seat remains fixed

### 8.3 Exhaustion

With `52` unique cards, the deck is sufficient for one hand's dealing and all `3` draw-discard rounds, so no special wall-exhaustion branch is needed.

## 9. Testing Strategy

### 9.1 Pure Rules Tests

Pure rules coverage should validate:

- unique `52`-card deck and rank mapping
- stable `5`-card hand invariant
- opening and post-draw betting order
- claim eligibility and priority
- chained claim resolution with fixed resume seat
- kong penalty and side-pot rebuild
- all-in continuation behavior
- evaluator ranking across all major poker hand classes
- tied pot splitting and remainder distribution

### 9.2 House Module Tests

House-level coverage should validate:

- short buy-in deducts gold and creates chips
- stamina cost is charged once per short table session
- continue-next-hand reuses chips and dealer rotation
- rebuy path increases chips without leaving the tavern
- cash-out returns floor-converted gold and clears the short table session
- short and long flows remain isolated from each other

### 9.3 View Model And Rendering Tests

View coverage should validate:

- short overlay exposes short-specific fields only
- normal betting buttons appear only in normal betting phases
- claim buttons appear only when the claim window is live
- showdown rows show hand labels, pot winners, and chip deltas
- long overlay rendering does not regress

## 10. Non-Goals

This design does not include:

- redesigning the current long gamble
- extracting a repository-wide generic gambling engine
- changing tavern work or drink flows
- removing the temporary tavern-access debug bypass
- changing unrelated house lifecycle wiring

## 11. Implementation Notes

- preferred implementation path is a dedicated short runtime plus dedicated evaluator module
- side pots should be rebuilt from contribution totals, not maintained through ad hoc manual pot arithmetic alone
- the first implementation should prioritize correctness and testability over AI sophistication
- if short overlay contract changes touch shared house interface documentation, update `docs/special-house-interface.md` together with code and changelog entries
