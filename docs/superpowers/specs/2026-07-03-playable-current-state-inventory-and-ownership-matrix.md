# Playable Current-State Inventory And Ownership Matrix

## 1. Goal

Record the current pre-migration ownership of the repository's first playable-runtime queue so later Child 30-34 baseline rechecks can start from one shared truth instead of rediscovering launch, session, settlement, and return seams ad hoc.

This is a doc-only baseline artifact. It does not authorize execution of any queued child.

## 2. Scope

This inventory primarily covers the first playable-runtime migration queue:

- `activity-qte`
- `city-begging`
- `grain-accounting`
- `medicine-compounding`
- `story-battle`

It also records several additional playable-like mechanisms that remain outside Child 30-34 for now, so the queue is not mistaken for a complete repository inventory.

## 3. First-Queue Ownership Matrix

| Mechanic | Current host / entry owner | Current launch seam | Current active state carrier | Current result / settlement owner | Current return owner | First mapped child |
| --- | --- | --- | --- | --- | --- | --- |
| `activity-qte` | scene / activity flow plus `src/main.ts` | `src/application/activity/activity-runner.ts` creates QTE session; `src/main.ts` emits `interactive.activity-qte.*` actions into `src/core/runtime/interactive-runtime.ts` | `state.core.runtime.activitySession` | `stopActivityQte()` in `src/application/activity/activity-qte-runtime.ts`, applied through `runInteractiveRuntime()` | `src/main.ts` currently issues `createExitInteractiveRequest("activity-qte")`; no formal `integrationId` / ownerContext | `Child 31` |
| `city-begging` | external-style launch through covered runtime | `src/main.ts` emits `interactive.city-begging.launch` / pointer / tick / complete into `src/core/runtime/interactive-runtime.ts` | `state.app.beggingMiniGameState` | `applyCityBeggingMiniGameCompletion()` plus `settleRuntimeEffects()` inside `runInteractiveRuntime()` | runtime currently closes to `{ type: "none" }`; no formal `integrationId` / ownerContext / handoff contract | `Child 31` |
| `grain-accounting` | grain-shop house module | `src/application/house-modules/grain-shop/grain-shop-house-module.ts` action `"accounting"` -> confirm -> `startAccountingMinigame()` | grain-shop house session overlay with `overlay.type === "minigame"` plus interval side effects | `finalizeAccountingMinigame()` plus `applyAccountingReward()` inside grain-shop house module flow | grain-shop house module closes local result overlay and returns to the same house session | `Child 32` |
| `medicine-compounding` | medicine-house house module | `src/application/house-modules/medicine-house/medicine-house-house-module.ts` action `"start-compounding"` -> confirm -> compounding overlay | medicine-house house session overlay with `overlay.type === "compounding"` plus interval side effects | `finalizeCompounding()` plus medicine-house mutations and stamina spend inside medicine-house local flow | medicine-house house module closes local result overlay and returns to the same house session | `Child 32` |
| `story-battle` | story callback + covered runtime | `runStartSundeyaRescueBattleCallback()` in `src/application/story/story-callbacks.ts` calls `startStoryBattle()`; actions route through `interactive.story-battle.action` into `src/core/runtime/interactive-runtime.ts` | `state.core.storyBattle` | `dispatchStoryBattleAction()` in `src/application/story-battle/story-battle-runtime.ts`, wrapped by `runInteractiveRuntime()` | battle runtime returns `enterHouseId`; `interactive-runtime` maps it to `{ type: "reenter-house" }`; still no formal `integrationId` / ownerContext | `Child 33` |

## 4. Common Gaps Observed Across The First Queue

### 4.1 Launch Ownership Is Still Fragmented

- covered runtime playables still depend on concrete interactive ids
- house-local mechanics still launch from house module action handlers
- story-battle still launches from story callbacks plus interactive actions
- none of these paths currently normalize through one repository-owned `integrationId` seam

### 4.2 Active Session Carriers Still Differ Per Mechanic

- `activity-qte` uses `state.core.runtime.activitySession`
- `city-begging` uses `state.app.beggingMiniGameState`
- `grain-accounting` uses grain-shop overlay session state
- `medicine-compounding` uses medicine-house overlay session state
- `story-battle` uses `state.core.storyBattle`

That is precisely why Child 30 must establish the shared shell before later migrations.

### 4.3 Result Ownership Is Still Local To Host Families

- covered interactive playables still settle in `interactive-runtime`
- house-local mechanics still settle in house module logic
- battle still settles in story-battle runtime plus interactive-runtime wrapper

No current path emits one shared fact-result and then resolves scenario-owned outcome semantics through a formal integration instance.

### 4.4 Return Ownership Is Not Yet Formalized

- `activity-qte` currently exits through direct `main.ts` action flow
- `city-begging` currently closes to no formal owner handoff
- `grain-accounting` and `medicine-compounding` currently fall back to their host house session by local overlay closeout
- `story-battle` currently relies on `enterHouseId -> reenter-house`

These paths explain why the approved playable spec had to add explicit owner context, `sessionToken`, handoff policy, and recovery rules.

## 5. Additional Playable-Like Mechanisms Not Yet In Child 30-34

The repository also contains other playable-like or challenge-like flows that are not in the first queued set:

- temple house work QTE
  - currently house-local, overlay-based, and still outside the first child queue
- tea-house debate
  - currently house-local debate overlay and house module flow
- tavern work QTE
  - currently tavern-local overlay flow
- tavern gambling
  - currently tavern-local gambling flow with much larger state surface

These are intentionally excluded from Child 30-34 so the first queue stays bounded:

- first prove the shell
- then migrate the safest covered minigames
- then migrate the two house-local mechanics already named in the approved playable spec
- then migrate `story-battle`
- only after that decide whether a second playable queue should absorb later candidates such as tea-house, tavern, or temple-specific flows

## 6. Child Allocation Summary

- `Child 30`
  - shared shell only
  - no concrete mechanic migration
- `Child 31`
  - `activity-qte`
  - `city-begging`
- `Child 32`
  - `grain-accounting`
  - `medicine-compounding`
- `Child 33`
  - `story-battle`
- `Child 34`
  - scaffold / validator / closeout after earlier migrations prove parity

## 7. How To Use This Inventory

When Child 30-34 are later promoted:

1. recheck the target rows against the live code
2. record `unchanged`, `narrowed`, or `superseded`
3. update the child spec if the inventory truth changed
4. only then treat the child plan as executable
