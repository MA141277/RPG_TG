# Work Minigame And Pachinko Standard Design

Date: 2026-07-13

## Purpose

Define a shared standard for house-owned work minigames that can reuse the same playable mechanic while preserving distinct work identity, confirmation copy, cost display, score history, and quick-complete behavior per work entry.

This spec also records the next required changes for the current `defaultgame` pachinko board.

## Interface Boundary

This work must follow `docs/special-house-interface.md`.

- House modules own work entry semantics, confirmation overlays, settlement, rewards, stamina cost, time cost, and return flow.
- Shared playables own the active minigame runtime, scoring during play, physics, random layout changes, result emission, and replay-safe session state.
- UI views render typed view models only.
- `src/main.ts` may only perform stable dispatch and interval wiring. It must not contain temple-specific or work-specific business branches.
- Persistent score history must be stored through unified runtime state, not top-level globals.

## Work Entry Identity

A work entry is distinct from the playable mechanic it uses.

Example:

- Sweeping the temple and copying scripture may both use the same `generic.qte` / pachinko playable.
- They still have separate `activityId` values.
- Their highest scores, confirmation copy, quick-complete prompts, and settlement records are stored per `activityId`.

The score history key should be derived from the entry identity, not the playable handler:

```text
var.activity.<activityId>.best_score
```

## Start Confirmation Standard

Before starting a work minigame, show a confirmation overlay with three required sections.

1. Immersive work description

   Describes the work in-world, such as sweeping the temple courtyard, copying scripture, carrying water, or organizing sutra shelves.

2. Related attributes and minor skills

   Shows the five core attributes and minor skills involved in this work. For the first implementation, this section may render an empty state:

   ```text
   相关能力：待接入
   ```

3. Cost

   Shows stamina and time cost before the player commits.

   Example:

   ```text
   体力 -8，时间 +1 天
   ```

Opening or cancelling this confirmation overlay must not spend stamina, advance time, or mutate score history.

## Quick Complete Standard

If the work entry has a stored highest score, the confirmation overlay must offer a quick-complete path before launching the minigame.

The overlay should display:

- historical highest score
- quick-complete score
- quick-complete action
- replay action

Quick-complete score:

```text
floor(bestScore * 0.9)
```

Quick completion:

- does not launch the playable
- uses the calculated quick-complete score as this run's score
- spends the same stamina and time as normal completion
- triggers the same settlement path as normal completion
- may update last-run variables, but should not lower the stored highest score

Replay:

- launches the minigame normally
- may update highest score only if the new score is greater than the stored score

## Settlement Standard

When a work minigame completes, settlement should:

- read the score emitted by the playable or quick-complete path
- update the entry-specific highest score with `max(oldBest, currentScore)`
- spend stamina
- apply work-specific rewards
- advance time through the shared house/runtime time-cost path
- return to the owning house flow

The playable result should remain visible until the player confirms the result. The house module should not consume the result in the same tick that the final ball settles.

## Pachinko Board Changes

The current `defaultgame` pachinko board should change as follows.

1. Remove the first two fixed pin rows.

   The previous top rows in the 6/7/6 layout are removed. The board starts from the former third row, while preserving the lower moving gate, repeated 6/7/6 rows, and bottom slot structure.

2. Allow continuous ball release.

   The player may click the play button repeatedly to release another ball while previous balls are still in the board. This supports rapid feel testing and makes the board more active.

   The runtime should support multiple active balls in the session rather than replacing the current active ball.

3. Bottom random elements change every 20 seconds.

   Lower-board random elements, including shuffled bottom slot values and any configured lower random features, should refresh every 20 seconds during the active session.

   This must be driven by runtime tick state, not CSS-only or DOM-only timers.

4. Current in-flight balls continue after refresh.

   If bottom values or lower random elements refresh while balls are in play, existing balls continue interacting with the current board state.

5. Final state requires confirmation.

   After the final available ball settles, the board remains visible in a final settling state. It shows the run score, last slot, and score-history outcome. The player confirms before the owning work settles.

## State Model Implications

The pachinko session will need to evolve from a single active ball to multiple active balls.

Current shape:

```text
activeBall: ActivityPachinkoBoardBall | null
```

Target shape:

```text
activeBalls: ActivityPachinkoBoardBall[]
```

For compatibility, UI view models may expose only `activeBalls`, or temporarily derive `activeBall` from the newest ball if a staged migration is needed. The preferred final contract is explicit multiple-ball rendering.

The 20-second refresh requires session-owned timing fields, such as:

```text
layoutRefreshElapsedMs
layoutRefreshPeriodMs
layoutVersion
```

The refresh cadence should use the same tick interval mechanism as the playable runtime.

## View Model Implications

The work confirmation overlay needs typed fields for:

- work description lines
- related attribute and minor-skill lines
- cost lines
- best score, if present
- quick-complete score, if present
- start/replay action id
- quick-complete action id, if present
- cancel action id

The pachinko board overlay needs typed fields for:

- multiple active balls
- layout refresh timing or version
- refreshed bottom slot values
- final settling state
- score-history display fields when final

No renderer should infer these behaviors from button text or DOM state.

## Testing Requirements

Add regression coverage for:

- a work with no highest score shows normal start confirmation only
- a work with a highest score shows quick-complete at 90 percent
- quick completion settles with the 90 percent score and preserves the higher best score
- replay completion updates best score only when the new score is higher
- two work entries sharing the same playable keep separate highest scores
- pachinko no longer renders or collides with the removed first two pin rows
- pachinko can run multiple balls simultaneously
- bottom random elements refresh after 20 seconds of runtime ticks
- final pachinko state remains visible until explicit confirmation

## Open Decisions

The following items are intentionally deferred but should not block the first implementation:

- the exact five-attribute and minor-skill contribution formula
- special ball reward definitions
- event reward effects for great, good, plain, minor-bad, and timing events
- whether continuous release consumes official balls immediately or can support a separate non-scoring test mode later

For the first implementation, continuous release should consume official available balls, because it matches the current score loop and avoids introducing a separate practice economy.
