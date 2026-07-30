# Special House Interface

This document is the required contract for any non-trivial `house` implementation.

Use it for:

- grain shop
- tea house
- home house
- dojo
- forge
- merchant sub-systems
- minigame houses
- any house with custom dialogue, session state, trading, or scripted flow

## Goal

All special houses must plug into the project through a stable interface.

The goal is:

- no business-specific branches in `main.ts`
- no house-specific state globals
- no hidden mutations to unrelated player data
- no UI markup generated inside `application`
- builtin houses and mod-owned houses enter through the same shared registration seam
- future houses can be added by following the same module contract

## Layer Split

House modules must stay inside the existing layer model:

- `content/house-modules/*`: static content only
- `domain/house-modules/*`: types, ids, pure rules, stable contracts
- `application/house-modules/*`: state transitions, selectors, orchestration
- `ui/views/house/*`: rendering and input binding
- `styles/*`: styles only

Do not place special-house business logic in:

- `src/main.ts`
- generic `ui/views/house/house-view.ts`
- `shared/*`

except for stable registry wiring.

Registry wiring rules:

- the shared registration seam may assemble builtin and mod-owned house contributions
- builtin fallback registrations may exist, but they must still be expressed through the same shared registration seam
- core runtime, presenter lookup, and house renderer lookup must not each keep their own unrelated static table

## Required Domain Contract

Each special house must declare a stable module id.

Example:

```ts
export type HouseModuleId =
  | "home-house"
  | "grain-shop"
  | "tea-house"
  | "keep-house"
  | "leader-residence"
  | "temple-house";
```

`HouseDefinition` should point to a module through stable metadata, for example:

```ts
type HouseDefinition = {
  id: HouseId;
  cityId: string;
  name: string;
  type: HouseType;
  characterIds: CharacterId[];
  defaultCharacterId: CharacterId | null;
  visibleStoryStages?: string[];
  enterableStoryStages?: string[];
  requiresPlayerCurrentCityMatch?: boolean;
  activityLocationId?: CityNpcActivityLocationId | null;
  moduleId?: HouseModuleId | null;
  onEnterEventId?: EventId;
  onLeaveEventId?: EventId;
  backAction: {
    label: string;
    targetView: "city";
  };
};
```

Rules:

- `type` is presentation/category metadata
- `visibleStoryStages` / `enterableStoryStages` are optional generic story-stage gates
- `requiresPlayerCurrentCityMatch` is generic access metadata, not house business logic
- `activityLocationId` is optional city-level roaming NPC slot metadata
- `moduleId` is behavior binding
- `onEnterEventId` / `onLeaveEventId` are event hooks, not house business implementations
- do not infer business behavior from `house.id` string matching in app entrypoints

If a visible city location should reject entry with dialogue, define the rejection as
content data and resolve it through a generic selector. A refusal rule may match by
house id, `moduleId`, story stage, and runtime flags, then return structured
dialogue data such as speaker character, title, text, and confirm label. The
entrypoint may display that returned model through the shared dialogue component,
but it must not contain the house-specific reason or branch.

Shared story/event timing may observe house lifecycle generically, for example:

- `house-enter`
- `indoor-screen-shown`

These timings must be wired through shared runtime trigger evaluation. Do not
implement them as house-specific branches in `main.ts` or inside one concrete
house module.

If a grouped city entry also needs story-stage gating, keep that metadata on
`CityEntryDefinition.visibleStoryStages` and resolve it through a generic selector
rather than adding city-entry branches in `main.ts`.

## Required Application Contract

Each special house must implement a consistent lifecycle.

Recommended interface:

```ts
export type HouseModuleRequest =
  | { type: "action"; actionId: string }
  | { type: "field"; fieldId: string; value: string }
  | { type: "tick"; tickId: string };

export type HouseModuleSideEffect =
  | {
      type: "start-interval";
      intervalId: string;
      everyMs: number;
      request: HouseModuleRequest;
    }
  | {
      type: "stop-interval";
      intervalId: string;
    }
  | {
      type: "start-map-auto-advance";
      intervalId: string;
      everyMs: number;
      targetHouseId: string;
      label: string;
      snapshots?: MapAutoAdvanceSnapshot[];
      completion?: HouseMapAutoAdvanceCompletion;
    }
  | {
      type: "stop-map-auto-advance";
      intervalId: string;
    }
  | {
      type: "play-coin-reward";
      playerCharacterId: string;
      delta: number;
      source: "request-pointer";
    };

export type MapAutoAdvanceSnapshot = {
  gameState: GameState;
  characterDefinitions: CharacterDefinition[];
};

export type HouseMapAutoAdvanceCompletion =
  | {
      type: "enter-house";
      houseId: string;
    }
  | {
      type: "restore-house-session";
      houseId: string;
      houseSession: ActiveHouseModuleSession;
    };

export type HouseModuleSessionStateMap = {
  "home-house": HomeHouseSessionState;
  "grain-shop": GrainShopSessionState;
  "keep-house": KeepHouseSessionState;
  "leader-residence": LeaderResidenceSessionState;
  "temple-house": TempleHouseSessionState;
  "tea-house": TeaHouseSessionState;
};

export type HouseModuleSessionState<ModuleId extends HouseModuleId> =
  HouseModuleSessionStateMap[ModuleId];

export type HouseModuleTransitionResult<
  ModuleId extends HouseModuleId = HouseModuleId
> = {
  gameState: GameState;
  characterDefinitions: CharacterDefinition[];
  sessionState: HouseModuleSessionState<ModuleId> | null;
  timeAdvanceCost?: number;
  councilArrivalNotice?: {
    speakerCharacterId?: string;
    textLines: string[];
    advanceHintText?: string;
  };
  sideEffects?: HouseModuleSideEffect[];
  navigation?: { type: "stay-in-house" };
};

export type HouseModuleDefinition<
  ModuleId extends HouseModuleId = HouseModuleId
> = {
  moduleId: ModuleId;
  enter(
    input: HouseModuleEnterInput<ModuleId>
  ): HouseModuleTransitionResult<ModuleId>;
  dispatch(
    input: HouseModuleDispatchInput<ModuleId>
  ): HouseModuleTransitionResult<ModuleId>;
  leave(
    input: HouseModuleLeaveInput<ModuleId>
  ): HouseModuleTransitionResult<ModuleId>;
  selectViewModel(input: HouseModuleViewModelInput<ModuleId>): HouseModuleViewModel;
};
```

Typing rules:

- do not leave shipped house `sessionState` as bare `unknown`
- represent shared house session through a `moduleId -> sessionState` map
- keep `GameState.ui.houseSession` as a discriminated union keyed by `moduleId`
- generic wiring may pass the active session through runtime boundaries, but should not recover type safety with ad hoc `as` casting in the entrypoint

Minimum required lifecycle:

- `enter`
- `dispatch`
- `leave`
- `selectViewModel`

If a module needs timer-driven behavior, use:

- `HouseModuleRequest` with `type: "tick"`
- `HouseModuleSideEffect` with `start-interval` / `stop-interval`

If a module needs to hand control back to the world layer for reusable time-skip / wait-until-review behavior, use shared side effects such as:

- `start-map-auto-advance`
- `stop-map-auto-advance`

If a module needs a shared HUD-owned coin / ingot flight or other player-money pickup feedback, emit a shared house side effect such as:

- `play-coin-reward`

The module should describe the reward in typed data and let shared runtime / UI layers resolve the current request pointer, HUD anchor, and animation playback. Do not hardcode one concrete house branch in `main.ts` just to play a settlement animation.

This path is for generic map-view time progression and automatic re-entry, not for house-specific logic inside `main.ts`.

If a module needs the player to visibly watch several days pass on the world map and then return to a house scene, it should supply:

- `snapshots`: one entry per skipped day, so shared runtime can update HUD time and any daily state changes during playback
- `completion: { type: "restore-house-session" }` when the target scene should resume a prepared house session after playback
- `completion: { type: "enter-house" }` when playback should end by re-entering the target house and letting that module's `enter()` lifecycle decide the next flow, such as immediately starting a review meeting

Do not emulate this by:

- mutating calendar inside `main.ts`
- manually switching `currentView` in one concrete house branch
- showing fake house-local rest results while world time is supposed to be advancing on the map

If a module completes one player activity and should consume shared world time,
return `timeAdvanceCost` on `HouseModuleTransitionResult`.

Rules:

- `timeAdvanceCost` is generic world-time metadata, not house-local UI state
- the shared house runtime advances `world.timeOfDay` and rolls into the next day when needed
- if a house result causes world time to cross into the review date, the shared runtime will immediately route into the current priority review house; if the player is already inside that house, the runtime will re-enter it so `enter()` can switch straight into the meeting flow
- if a module needs to attach extra reminder text when review day arrives during that result (for example, interrupted rest summary), return `councilArrivalNotice`; the shared runtime will carry it into the reminder dialogue before handing control to the review house
- use `timeAdvanceCost` for common actions such as trade, inquiry, work settlement, study, donation, or debate
- do not manually patch `calendar` / `timeOfDay` inside each module for single-step activity costs
- if a module intentionally skips whole days, it may still mutate date directly or use shared map auto-advance, but that should be the exception and remain explicit

Do not add parallel custom lifecycle methods for one-off houses unless the shared contract is intentionally being expanded and documented.

If a module must reject the shared leave action, keep the player in the active
house by returning `navigation: { type: "stay-in-house" }` from `leave()`.
The module should update its typed session state with structured dialogue or
overlay data explaining the rejection. The runtime may honor the navigation
result, but it must not contain house-specific leave reasons.

If a house hosts a reusable playable mechanic:

- the house module may remain the trigger owner and integration owner
- the playable launch must still resolve through the shared playable runtime contract
- active mechanic lifecycle, result emission, and settlement must not stay as ad hoc house-local timer branches once a shared playable exists
- the house session may remain the host shell and return target, but it should recover through typed house session state plus shared playable handoff semantics rather than a second hidden state path
- do not rebuild a one-off mini runtime in the house module after the repository already has a shared playable runtime

## State Rules

Persistent state must be stored in unified runtime structures.

Allowed:

- `GameState.runtime.variables`
- `GameState.runtime.flags`
- `GameState.runtime.cityMarkets`
- `GameState.runtime.cityNpcPools`
- dedicated unified `GameState.ui.houseSession`
- a future `GameState.modules` branch if introduced as shared architecture

Not allowed:

- top-level `let grainShopSessionUi`
- top-level `let characterDefinitions`
- top-level per-house globals outside the unified app state

### Persistent vs Temporary

Persistent:

- inventory changes
- money changes
- relationship changes
- progress flags
- unlock state
- timers that matter after leaving and re-entering
- accepted/completed/failed task state for house-specific jobs

Temporary session state:

- current overlay
- selected tab
- local dialogue phase
- unsaved quantity input

Temporary session state must still live in a unified session branch, not loose globals.

### Shared Runtime Inventory

When multiple systems read or write the same player-owned resource, add or reuse a shared
runtime inventory key instead of keeping one copy per house.

Current shared keys:

- `var.player_inventory.grain_dou`: player grain measured in dou
- `var.player_inventory.item.<itemId>`: generic runtime item quantities for non-equipment gameplay rewards

Rules:

- house modules may migrate legacy house-local inventory variables on enter, but must not reset
  existing player-owned resources
- grain shop, market inventory, city begging rewards, and temple work submission must read and
  mutate the shared grain key
- review/council rewards must use shared inventory keys or typed inventory helpers instead of
  storing one-off reward counts inside a house session
- unit conversion belongs in shared domain helpers, not in one concrete house renderer
- house-local variables may store derived progress such as submitted amount or last grade, but
  not an independent copy of the player inventory

### Shared Review Settlement

Periodic review/council flows may award items, update faction merit, and announce personnel
changes after the assignment-completion table.

Rules:

- reward eligibility, reward item definitions, and personnel-change queues belong in shared
  review domain/application helpers
- concrete house modules may select faction-specific reward tables or rank labels, but must not
  hardcode settlement branches in `src/main.ts`
- item rewards must mutate unified runtime inventory before the overlay is shown
- faction entry and office/rank progression must be settled through
  `GameState.runtime.factionMemberships`, keyed by faction id and character id. Do not infer the
  previous faction identity from a character's visible `title`; that title may describe the
  character's pre-faction social state, such as refugee.
- review task rank gates must flow through shared review task helpers such as
  `ReviewTaskGate` / `createReviewTaskChoiceViewModels()`. Content may provide
  `reviewMinRankId`, and modules may pass additional lock flags into the shared gate, but they must
  not bypass the minimum-rank result with faction-specific story branches.
- personnel changes that affect a character's visible identity or office must update
  `characterDefinitions` or another explicit unified character runtime structure, not a
  house-local session-only label
- reward and personnel announcements must be typed overlays or dialogue view models; application
  modules must not return HTML strings

## Mutation Rules

A house module must never silently reset player base data on enter.

Forbidden on enter:

- set player gold to a default number
- overwrite player skill levels
- replace inventory
- reset permanent relationship data unless explicitly requested by system design

Allowed on enter:

- initialize missing module-specific variables
- ensure session-local defaults
- derive current prices or prompts from runtime state

## UI Contract

`application` returns structured data only.

Do not return:

- `bodyHtml`
- arbitrary template strings
- pre-rendered DOM snippets

Instead return data like:

```ts
type AlertOverlayModel = {
  type: "alert";
  title: string;
  paragraphs: string[];
  tone?: "info" | "success" | "warning";
  confirmActionId: string;
  confirmLabel: string;
};
```

Then `ui/views/*` converts that into markup.

Shared overlay unions may grow when a special house needs a richer structured interaction
(for example a module-specific trade picker, a rest-days input panel, a quantity confirmation
panel, or a market trade selector),
but the data must remain typed and UI-facing.
If a house needs a scrollable market/intel report instead of a one-shot alert, extend the shared
overlay union with a structured report variant (for example `grain-price-report`) that carries
row data, comparison labels, relative-location fields, paired buy/sell prices, and explicit
confirm/back action ids. The renderer may decide how to scroll or highlight the current city, but
the report content, button ids, and staged return flow must stay in typed session/view-model data
rather than DOM-only popup logic.
Use `quantity-confirm` for reusable numeric submissions where a module needs min/max bounded
quantity input plus increment/decrement actions. The temporary input stays in the module session;
confirmation performs the persistent mutation through the module lifecycle.
Use an `activity-confirm` style session overlay when a house needs to warn the player about
world-time and stamina costs before starting a minigame or work loop. The overlay should stay
typed, dispatch through normal house action ids, and the actual persistent time/stamina mutation
should still happen only inside the module lifecycle when the activity resolves.
If a house-owned work entry supports the shared work-minigame confirmation standard, the same
typed overlay may include `workDescriptionLines`, `relatedAbilityLines`, `costLines`, `bestScore`,
`quickCompleteScore`, `quickCompleteActionId`, and `quickCompleteLabel`. Entry-specific persistent
best scores must be stored in `GameState.runtime.variables` using `var.activity.<activityId>.best_score`,
so different work entries that share one playable implementation do not overwrite each other.
Quick-complete actions must still dispatch through the house module and settle through the same
activity completion path as normal play.
For staged table overlays such as tavern gambling, per-player public summaries may include
current best pattern data and visible discard history, while private hand tiles remain hidden
from other players in the view model.
If the table has a timed response window, expose the remaining countdown and shared discard pool
as typed overlay fields so the view can render them without reading runtime state directly.
If that timed response can auto-expire, keep the countdown itself under the typed house or table
session and advance it through shared `tick` requests plus `start-interval` / `stop-interval`
side effects. Seat-priority exceptions and immediate teardown after the player accepts the staged
response must stay in module rules, not in renderer-local timers or DOM callbacks.
If a table flow has a mode picker before configuration, expose that picker as a structured overlay
such as `gamble-choice`; the UI may render mode buttons, but the selected mode must be dispatched
through normal house action ids and stored in the typed module session.
If a table configuration overlay needs a temporary debug or QA-only preset switch, expose it as
typed overlay data such as `debugToggle` with a normal action id and helper text. The selected
debug mode must still persist under the typed house or table session with an explicit default such
as `off`; do not hide deterministic test decks or preset cycles behind globals, URL-only flags,
or entrypoint-local scratch state.
If one house table supports materially different variants, keep the public table overlay and the
typed table session discriminated by `variant` rather than reusing one oversized shape with
mostly-unused fields. Each variant may expose only the fields its renderer actually consumes.
If one table variant persists chips, bankroll, or between-hand prompts across multiple rounds,
that persistent state must still live under the owning house session branch as typed session data.
Do not move it into top-level globals, entrypoint scratch state, or a second hidden runtime cache.
If a table response window has staged priority, expose the current stage and each available
action kind as structured fields. Visual emphasis such as flashing buttons must be driven by
typed overlay data from the module, not inferred from button text in the view.
If a temporary claim window must share the same on-felt action panel as persistent controls,
expose the temporary claim actions and any explicit pass action as structured overlay fields
such as `claimOptions` and `claimPassAction`; the renderer may place them in a dedicated upper
row, but it must not hardcode hidden action ids or infer claim layout from button text.
If a table player's public summary needs to distinguish exposed meld history from ordinary
discards, expose them as separate structured fields such as `meldLabels` and `discardLabels`.
Do not ask the renderer to reverse-engineer exposed melds from discard order or private hand
state.
If a temporary incoming-card slot must keep some cards visible but unavailable for the follow-up
discard step, expose that lock state as typed session data such as
`pendingIncomingCard.lockedCardIds`, and omit discard `actionId`s for those locked cards in the
overlay. The renderer must not recreate or bypass those locks by inferring actions from layout or
button text.
If a table overlay needs local reordering, expose it through generic house action ids and
data attributes; the entrypoint may dispatch the generic action, but must not understand the
house-specific reorder semantics.
If a table overlay supports staged tile selection, public tiles that are temporarily selected or
permanently consumed must be exposed as structured tile view data such as `selected` and `spent`,
with confirm/clear/pass action ids on the overlay. The UI may render selected public tiles as
transparent or disabled, but the application module must own the selection and lock state.
For shared table resources, `spent` should describe the current viewer/player's availability,
not a global table lock, unless the domain rules explicitly make that resource global.
For per-player public table resources, expose each viewer-facing tile with explicit `covered`
and `spent` state. A covered public slot may render like a facedown hand tile, but the application
module owns whether that slot is still usable, claimable, or unavailable to opponents.
If a table player can finish their action quota before the full table resolves, expose that
state explicitly in the overlay, such as `completedPlayedGroups`, so the view can disable
further betting or draw controls without reading private session rules.
If a module-specific overlay needs extra controls, extend the shared typed contract
(for example a medicine compounding clear action or a shared QTE bar-stop minigame overlay)
instead of relying on DOM-only behavior.
For house-owned activity work that reuses the generic activity playable, expose a structured
shared activity overlay such as `fortune-board` or `pachinko-board` from the shared activity
session rather than rebuilding a separate house-local QTE timer. The house module may still own
settlement, rewards, time cost, and return-to-house result copy after the shared playable emits
its result.
If that shared activity overlay has staged visual phases, expose the phase and stable animation
version fields as typed data. For example `fortune-board` carries `phase`, highlighted cell ids,
selected cell ids, flash state fields such as `flashActive` / `pickFlashActive`,
`rerollCount`, and speed control fields such as `animationTickMs` / `speedFieldId`;
renderers use those fields to animate current state and must not infer reroll timing from
button text, DOM order, or whether a visible label changed.
For physics-like shared overlays such as `pachinko-board`, expose render-facing positions,
active ball state, fixed and moving collision pins, gate counters, event log, slot values,
and launch action ids as typed data. The house renderer may draw those positions, but the
application/playable runtime owns simulation, scoring, random event selection, and completion.
If the board supports continuous launches, expose `activeBalls` as the canonical render list;
`activeBall` may exist only as a compatibility field while older consumers are migrated. Runtime-owned
layout variation such as lower slot refresh timing must be exposed through typed fields such as
`layoutRefreshElapsedMs`, `layoutRefreshPeriodMs`, and `layoutVersion`; views may render the updated
slot values, but must not shuffle or rescore the board themselves.
If `pachinko-board` includes staged rewards such as a wheel spin, expose the queue and animation
state as typed fields such as `rewardQueue` and `wheelState`. The runtime owns reward selection,
weighted probabilities, spin/slow/flash timing, and reward application. Renderers may draw the
wheel, pointer, selected segment, and dimmed board state, but must not apply score, ball, or
encounter effects themselves.
If one overlay contains a staged interaction
(for example "select a topic, then confirm"),
extend the shared overlay contract with the staged control fields first
(for example `selectedTopic`, `confirmActionId`, `confirmDisabled`)
and keep the temporary selection in the module session state.
Do not fall back to raw HTML strings in `application`.

## Main Entry Rules

`src/main.ts` may do only stable wiring.

Allowed:

- resolve current house definition
- look up `moduleId`
- call generic house runtime wiring
- pass dispatched actions into a generic house module dispatcher

Not allowed:

- `if (isGrainShopHouse(houseId))`
- custom imports for each house business flow from the entrypoint
- special render branches for individual house ids

If `main.ts` needs to know a concrete house name, the interface is wrong.

### Grouped Entry Rule

Some special house flows may be reached through a grouped city entry instead of a direct `house-id` button.

Example:

- `将领府邸` card
- open a same-city character directory
- pick one character
- enter a shared `leader-residence` module with the selected character bound through unified runtime state

Rules:

- grouped entry selection happens before entering the house module
- the grouped entry is a city-level navigation concern, not a house-specific branch in `main.ts`
- the selected target must still be passed into the house module through unified state / metadata
- do not bypass the special-house lifecycle just because the card first opens a list

## Registry Pattern

Use one shared registration seam to bind module ids to behavior and rendering.

Builtin and mod-owned houses must both contribute through the same seam.

Recommended shared registration shape:

```ts
type HouseModuleRegistration = {
  moduleId: HouseModuleId;
  module?: HouseModuleDefinition;
  render?: HouseModuleViewRenderer;
};

type HouseModuleRegistry = {
  register(registration: HouseModuleRegistration): void;
  getModule(moduleId: HouseModuleId): HouseModuleDefinition | null;
  getRenderer(moduleId: HouseModuleId): HouseModuleViewRenderer | null;
};
```

Rules:

- builtin fallback registrations may be preloaded into the shared registration seam
- later mod-owned houses must add to the same seam instead of introducing a second registry path
- runtime ownership, presenter lookup, and renderer lookup must all consume the same shared registration seam
- `src/main.ts` may pass a shared registry dependency through stable wiring, but it must not author house-specific registration branches

Example:

```ts
const houseModuleRegistry = createBuiltinHouseModuleRegistry();

houseModuleRegistry.register({
  moduleId: "grain-shop",
  module: grainShopHouseModule,
  render: renderGrainShopHouseView,
});
```

The app should:

1. read `currentHouseId`
2. find `HouseDefinition`
3. read `moduleId`
4. resolve the shared registration seam
5. call generic module lifecycle methods
6. resolve the registered renderer for the returned view model through the same seam

If a city entry first opens a directory, that directory should still resolve to a stable target house id and then continue through the same registry path.

## View Model Contract

UI house views should accept view models, not raw `GameState`.

Recommended shape:

```ts
type HouseModuleViewModel = {
  moduleId: HouseModuleId;
  houseId: string;
  sceneTitle: string;
  sceneSubtitle?: string;
  standbyRoster: HouseStandbyActorViewModel[];
  dialogue: HouseDialogueViewModel | null;
  actionContainer: HouseActionContainerViewModel | null;
  statusCard: HouseStatusCardViewModel | null;
  overlay: HouseOverlayViewModel | null;
  leaveAction: HouseActionViewModel;
};
```

### Shared NPC Interaction Rule

Any actor exposed in a normal house NPC pool should be eligible for the shared NPC interaction menu when no blocking dialogue, modal, overlay, minigame, or message window is active.

The shared menu owns default actions:

- `角色情报`
- `谈话`
- `送礼`

House modules may contribute special actions for the selected actor, and those special actions must render above the default actions. The generic NPC shell must not understand house-specific business rules. Special actions dispatch back through the owning house module lifecycle.

Default `谈话` replaces visible `闲谈` labels as the baseline conversation behavior. Default `送礼` must use shared inventory and must not mutate relationship or inventory until an item is selected and confirmed. Until shared gift inventory settlement exists, `送礼` must stay disabled or render an empty state that performs no persistent mutation.

### Primary Actor Roster Rule

For any special house with `HouseDefinition.defaultCharacterId`, that character is the house primary actor.

Rules:

- `enter()` should default to primary-actor dialogue unless a higher-priority lifecycle state takes over, such as a meeting, story event, refusal, or playable restoration.
- `selectViewModel()` must include the primary actor in `standbyRoster`.
- the primary actor must be the first `standbyRoster` entry.
- secondary fixed actors and city activity actors follow the primary actor.
- ordinary house dialogue must not render the primary actor as a separate right-side owner card or nonstandard owner-only portrait.
- ordinary character dialogue must render the active speaker portrait through the shared dialogue-box portrait pattern when portrait metadata is available.
- meeting/council layouts may use dedicated seating, but they must not reintroduce generic owner-card special casing.

The view should not:

- read runtime variables directly
- mutate state directly
- know storage keys

## Content Rules

`content` may define:

- dialogue lines
- reward tables
- random pools
- min/max tuning values
- house art ids
- unified character records where playable roles and NPCs both use
  `CharacterDefinition`; use `personType: "角色"` / `role: "playable"` for
  selectable player candidates and `personType: "NPC"` for house residents
- `buildingArrangements` records that bind a concrete `cityId + buildingId`
  pair to mounted NPC ids, a primary NPC id, layout metadata, and generic
  containers

`content` may not define:

- reducer logic
- mutation logic
- HTML markup
- entrypoint routing

When a house needs fixed NPC ownership, prefer the mod-first compatible
`CharacterDefinition.houseId` and `buildingArrangements[].mountedNpcIds`
storage shape. `HouseDefinition.characterIds` remains a legacy fallback and
presentation/compatibility field, not the primary authoring surface for new
NPC placement work.

## Acceptance Checklist

A new house implementation is acceptable only if all are true:

- `main.ts` contains no house-specific business branch
- house behavior is resolved through `moduleId` + registry
- builtin and mod-owned houses share one registration seam
- application layer returns structured data, not HTML
- persistent changes are written through unified state
- entering house does not reset player base stats
- session state is stored through a unified contract
- timer behavior, if any, runs through `tick` requests plus shared side-effect wiring
- map-based time skip, if any, runs through shared side-effect wiring instead of entrypoint special cases
- single-step activity time costs, if any, are returned through shared `timeAdvanceCost` instead of ad hoc `calendar` mutations
- house-owned reusable playables, if any, launch and settle through the shared playable runtime while keeping the house module as host integration owner
- `docs/change-log.md` is updated for shared-interface changes

## Review Checklist

When reviewing a house implementation, check these first:

1. Did it add a new special-case branch in `main.ts`?
2. Did it create new top-level globals for session state?
3. Did it return HTML from `application`?
4. Did it overwrite player baseline stats on enter?
5. Did it introduce a stable `moduleId` and registry path?
6. Did it bypass shared `tick` / interval side-effect wiring with custom runtime hooks?

If any answer is yes for 1 to 4, reject the implementation.
