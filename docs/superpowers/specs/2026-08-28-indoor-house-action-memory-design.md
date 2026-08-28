# Indoor House Action Memory Design

## 1. Goal

Expand the approved indoor AI memory mechanism from the current tavern-focused pilot into a shared
`house action memory` architecture that can cover all meaningful building actions without creating
new house-specific shell branches.

The approved player-facing result is:

1. every meaningful indoor action is first recorded locally into the shared event ledger,
2. the game does **not** call AI immediately when the action happens,
3. the next time the player talks to a related NPC in the same building, that NPC can react to
   what the player just did,
4. this includes not only completed results, but also `looked at it and backed out` behavior,
5. behavior does **not** propagate across buildings for now.

Concrete examples this design must support:

1. the player opens a goods/buying flow, looks, then closes it without buying,
2. the player buys or sells goods in the market/grain/medicine flows,
3. the player opens a work/task detail flow, reads it, then leaves without taking the action,
4. the player enters a tavern table, looks, then leaves without really playing,
5. the player completes or cancels a supported indoor service,
6. the next related NPC opening line can react to that latest action in character.

## 2. Repository Constraints

This work must continue to follow the repository house interface contract:

1. no house-specific business branches in `src/main.ts`,
2. no shared runtime guessing based on renderer-only UI changes,
3. each `house module` remains the only authority for:
   - whether an action really happened,
   - whether it completed, was cancelled, or was abandoned,
   - which NPCs should remember it,
   - what legal service, trade, work, or story outcome occurred,
4. shared runtime may only transport, record, filter, and summarize the resulting typed events,
5. persistent memory must live under unified runtime state,
6. shared contract changes must update:
   - `docs/special-house-interface.md`
   - `docs/change-log.md`

## 3. Approved User Decisions

The following design choices are already approved:

1. actions are recorded into the local/shared event ledger first,
2. AI is **not** called at action time,
3. the next NPC opening line or next explicit `谈话` uses those recent actions as context,
4. recording granularity is `level 2`:
   - meaningful panel/service open,
   - meaningful close/abandon without settlement,
   - meaningful settlement/result,
   - but **not** pure UI micro-operations such as paging, sorting, dragging, or tab flicking,
5. propagation is currently limited to:
   - the current building,
   - the NPCs explicitly marked as related to that action,
6. no cross-building gossip/memory propagation is allowed in this phase.

## 4. Current Context And Mismatch

The repository already has the main shared pieces needed for this system:

1. a durable global `eventLedger` under shared world-intent runtime,
2. per-NPC `reactionMemoriesByCharacterId`,
3. `HouseModuleTransitionResult.observedEvents`,
4. `start_talk` prompt priority that can already open from the latest related reaction memory.

The current mismatch is scope and semantics:

1. the current ledger/reaction-memory path mostly covers tavern gambling pilot points,
2. most buildings still only update local `dialogueLines`, overlays, or module session state,
3. there is no shared semantic contract for:
   - panel opened,
   - panel closed without action,
   - service preview abandoned,
   - trade completed,
   - work preview exited,
   - house left after looking but doing nothing,
4. because of that, later NPC dialogue can still miss the player's most recent non-dialogue indoor
   action.

This design closes that mismatch without introducing a second gameplay runtime or a shell-side
intent switchboard.

## 5. Approaches Considered

### 5.1 A. Per-house ad hoc event strings

Each building directly emits one-off observed events with no shared taxonomy.

Why it was rejected:

1. fast at first, but quickly becomes inconsistent across buildings,
2. harder to test and filter reliably,
3. encourages event drift and duplicated summary logic,
4. makes later cross-house expansion harder.

### 5.2 B. Shared house-action memory contract plus per-house explicit reporting

Introduce one shared indoor action taxonomy and let each `house module` emit typed events through
the existing `observedEvents` seam.

Why it is approved:

1. preserves house ownership of real gameplay meaning,
2. keeps `src/main.ts` generic,
3. reuses the already approved event-ledger/reaction-memory architecture,
4. lets future buildings adopt the same mechanism without new shell logic.

### 5.3 C. Shared runtime infers actions from session/UI deltas

The runtime watches overlays/session transitions and guesses what the player did.

Why it was rejected:

1. violates house owner boundaries,
2. is brittle when UI/session structure changes,
3. cannot reliably distinguish preview, cancel, no-op, and completed settlement,
4. invites hidden business logic back into shared runtime or entrypoint code.

## 6. Approved Architecture

### 6.1 Reuse The Existing Shared Event Ledger

This system will **not** introduce a new ledger or a second memory runtime.

All indoor action memory continues through the existing shared path:

1. `house module` emits `observedEvents`,
2. shared house runtime forwards them,
3. shared world-intent runtime appends them to the durable ledger,
4. shared NPC dialogue runtime keeps related per-NPC reaction memories,
5. `start_talk` consumes those memories later.

### 6.2 Add A Shared Indoor Action Taxonomy

Every meaningful indoor action event should declare one shared semantic kind.

Approved shared kinds:

1. `panel-open`
2. `panel-close-without-action`
3. `service-preview`
4. `service-cancel`
5. `service-success`
6. `trade-buy-success`
7. `trade-sell-success`
8. `work-preview`
9. `work-preview-exit`
10. `work-complete`
11. `gamble-enter`
12. `gamble-leave-without-playing`
13. `gamble-settlement`
14. `house-leave`

Rules:

1. these are semantic house-action categories, not UI DOM events,
2. a house may emit only the kinds that fit its real gameplay flow,
3. houses must not invent near-duplicate ad hoc variants unless the shared contract is extended,
4. `panel-open` and `service-preview` may be recorded for history even when they are not ideal NPC
   reaction starters.

### 6.3 Differentiate Between Ledger Events And Commentable NPC Memories

Not every recorded action should automatically become an NPC opening remark.

Approved rule:

1. all meaningful indoor actions may be written into the durable ledger,
2. only events that include `reactionHints` become per-NPC reaction memories,
3. transient openings should usually remain ledger-only unless the opening itself is socially
   meaningful,
4. terminal or commentable outcomes should normally carry `reactionHints`, for example:
   - looked and backed out,
   - bought something,
   - sold something,
   - completed work,
   - entered a tavern table then left without playing,
   - won/lost at gambling,
   - left the building after inspecting something meaningful.

This keeps the ledger complete without forcing NPCs to open with noisy `you opened panel X` lines.

### 6.4 Scope Memory To Current Building And Related NPCs Only

The ledger remains global and durable, but NPC action memory use is narrower.

Approved scope rule:

1. `reactionHints.characterId` decides which NPCs remember the event,
2. `houseId` must be present on indoor action events,
3. `start_talk` for a building NPC only consumes reaction memories that belong to:
   - that NPC,
   - the current `houseId`,
4. no current-building event should trigger reactions from NPCs in other buildings.

### 6.5 Defer AI Consumption Until The Next NPC Opening

The visible UX must remain unchanged:

1. no hidden AI conversation starts when the action happens,
2. no extra AI panel appears,
3. the action is first recorded locally,
4. only the next NPC opening line or next explicit `谈话` reads that memory.

This preserves the existing house/service owner flows while still making the NPC feel aware.

## 7. Data Contract

The shared contract should extend `WorldObservedEvent` with one optional structured branch for
indoor action memory:

```ts
export type HouseActionMemoryKind =
  | "panel-open"
  | "panel-close-without-action"
  | "service-preview"
  | "service-cancel"
  | "service-success"
  | "trade-buy-success"
  | "trade-sell-success"
  | "work-preview"
  | "work-preview-exit"
  | "work-complete"
  | "gamble-enter"
  | "gamble-leave-without-playing"
  | "gamble-settlement"
  | "house-leave";

export type HouseActionMemoryContext = {
  kind: HouseActionMemoryKind;
  panelId?: string;
  panelLabel?: string;
  serviceId?: string;
  serviceLabel?: string;
  actionId?: string;
  itemId?: string;
  itemName?: string;
  offerId?: string;
  offerTitle?: string;
  quantity?: number;
  goldDelta?: number;
  resultKind?: "preview" | "cancel" | "success" | "failure" | "no-action";
};

export type WorldObservedEvent = {
  type: string;
  cityId?: string | null;
  houseId?: string | null;
  summary: string;
  reactionHints?: WorldObservedEventReactionHint[];
  houseActionMemory?: HouseActionMemoryContext;
};
```

Rules:

1. `summary` remains the AI-facing natural-language baseline,
2. `houseActionMemory` supplies stable typed semantics for future filtering, testing, and prompt
   shaping,
3. optional fields must reflect real local knowledge only,
4. houses must not fabricate fields they do not truly know.

## 8. Event Authoring Rules

### 8.1 House Modules Stay Authoritative

Each house must emit these events from stable owner-side result points:

1. after a meaningful panel/service becomes active,
2. after the player closes it without acting,
3. after a local service/trade/work/gamble settles,
4. after a meaningful inspection-then-leave outcome is known.

The shared runtime must **not** reconstruct these by watching overlays or DOM behavior.

### 8.2 Summary Style

Each event must supply:

1. a neutral ledger summary,
2. optional NPC-facing `reactionHints`.

Example pattern:

- ledger summary:
  - `玩家在货铺看了看货单，却没有买任何货物。`
- NPC hint:
  - `他方才翻了翻货单，却没下手买货。`

Example settlement pattern:

- ledger summary:
  - `玩家在货铺买入布 1 匹，花费 120 文。`
- NPC hint:
  - `他方才在你这里买走了 1 匹布，花了 120 文。`

### 8.3 Item/Offer Granularity Rule

Approved granularity:

1. if the player only reached a feature/panel but not a concrete item/offer, record at
   `feature/panel` level,
2. if the player selected a concrete item/offer and then abandoned it, record at that concrete
   object level when the house knows it,
3. if the player completed a trade/service/work, include concrete item/offer fields when
   available,
4. never record pure renderer micro-actions such as sorting, dragging, paging, or tab flicking.

## 9. NPC Consumption Rule

When a building NPC starts a new AI-led conversation:

1. load that NPC's `reactionMemoriesByCharacterId[currentNpcId]`,
2. filter to `houseId === currentHouseId`,
3. keep newest-first ordering,
4. provide the newest relevant memory as the primary opening cue,
5. optionally include a few older same-house memories as lower-priority context,
6. if no same-house related reaction memory exists, fall back to the current transcript/memory
   behavior.

Prompt rule:

1. if same-house reaction memory exists, the NPC should open by reacting to the newest one first,
2. transcript memory remains secondary,
3. no same-house reaction memory means ordinary opening behavior.

## 10. Building Rollout Matrix

The architecture covers all indoor houses, but implementation should land in batches.

### 10.1 Batch A: Transaction / Service Houses First

Initial rollout should prioritize:

1. `market-house`
2. `grain-shop`
3. `medicine-house`
4. `tea-house`
5. `tavern`

Required event coverage pattern:

1. open meaningful panel/service flow,
2. close/abandon without settlement,
3. settle success,
4. leave after looking where that distinction is meaningful.

Concrete examples:

1. market/grain:
   - opened buy flow,
   - closed without buying,
   - buy success,
   - sell success,
   - investigated goods then left,
2. medicine:
   - opened heal/medicine-related local flow,
   - cancelled after preview,
   - completed supported treatment/service,
3. tea-house:
   - previewed the currently supported local service,
   - cancelled it,
   - completed it,
4. tavern:
   - opened gamble choice,
   - entered table,
   - left without really playing,
   - settlement result.

### 10.2 Batch B: Work / Story Houses

Next rollout should cover:

1. `temple-house`
2. `keep-house`
3. `leader-residence`

Required event coverage pattern:

1. work/task preview,
2. preview exit without taking the action,
3. accepted/completed meaningful local work,
4. meaningful local leave-after-inspection outcomes.

### 10.3 Batch C: Remaining Fallback-Oriented Houses

Remaining houses should adopt the same contract only where they already expose:

1. a stable NPC owner,
2. a stable action/service entry point,
3. a meaningful local result the house can authoritatively describe.

Purely decorative or ownerless scenes remain out of scope until they gain a stable house owner flow.

## 11. Out Of Scope

This design does **not** approve:

1. cross-building reaction propagation,
2. immediate AI calls when actions happen,
3. per-frame or per-click UI telemetry in NPC memory,
4. shell/runtime guessing of house semantics,
5. direct AI settlement of trade, work, or story outcomes,
6. replacing current transcript memory with only action memory.

## 12. Verification Strategy

Implementation based on this design must prove:

1. durable ledger records the new action events,
2. only events with `reactionHints` become NPC reaction memories,
3. NPC opening memory is filtered to current building and current related NPC,
4. action memory noise does not reintroduce UI-micro-event spam,
5. transaction/service houses emit open / abandon / success events at stable owner points,
6. work/story houses emit preview / preview-exit / completion events at stable owner points,
7. no house-specific business branches are added to `src/main.ts`.

Minimum regression coverage should include:

1. shared runtime ledger + same-house filtering,
2. market buy/not-buy memory coverage,
3. tavern no-play and settlement memory coverage,
4. one work-preview-exit case from a work/story house,
5. house runtime forwarding of `observedEvents` without shell business logic.

## 13. Recommended Next Step

The next implementation plan should target the mechanism first, then the first building batch:

1. shared indoor action-memory contract,
2. same-house/current-NPC filtering in NPC opening context,
3. Batch A building integration,
4. then Batch B work/story integration.
