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

## Required Domain Contract

Each special house must declare a stable module id.

Example:

```ts
export type HouseModuleId = "home-house" | "grain-shop" | "tea-house";
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
- `activityLocationId` is optional city-level roaming NPC slot metadata
- `moduleId` is behavior binding
- `onEnterEventId` / `onLeaveEventId` are event hooks, not house business implementations
- do not infer business behavior from `house.id` string matching in app entrypoints

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
    };

export type HouseModuleSessionStateMap = {
  "grain-shop": GrainShopSessionState;
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
  sideEffects?: HouseModuleSideEffect[];
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

Do not add parallel custom lifecycle methods for one-off houses unless the shared contract is intentionally being expanded and documented.

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

Temporary session state:

- current overlay
- selected tab
- local dialogue phase
- unsaved quantity input

Temporary session state must still live in a unified session branch, not loose globals.

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
(for example a module-specific trade picker, a rest-days input panel, or a market trade selector),
but the data must remain typed and UI-facing.
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

Use a registry to bind module ids to behavior.

Example:

```ts
export const houseModuleRegistry: Record<HouseModuleId, HouseModuleDefinition> = {
  "home-house": homeHouseHouseModule,
  "grain-shop": grainShopHouseModule,
  "market-house": marketHouseHouseModule,
  tavern: tavernHouseModule,
  "tea-house": teaHouseHouseModule,
};
```

UI renderers should follow the same rule:

```ts
export const houseModuleViewRegistry: Record<
  HouseModuleId,
  (viewModel: HouseModuleViewModel) => string
> = {
  "home-house": renderHomeHouseView,
  "grain-shop": renderGrainShopHouseView,
  "market-house": renderMarketHouseView,
  tavern: renderTavernHouseView,
  "tea-house": renderTeaHouseHouseView,
};
```

The app should:

1. read `currentHouseId`
2. find `HouseDefinition`
3. read `moduleId`
4. resolve registry entry
5. call generic module lifecycle methods
6. resolve the registered renderer for the returned view model

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

`content` may not define:

- reducer logic
- mutation logic
- HTML markup
- entrypoint routing

## Acceptance Checklist

A new house implementation is acceptable only if all are true:

- `main.ts` contains no house-specific business branch
- house behavior is resolved through `moduleId` + registry
- application layer returns structured data, not HTML
- persistent changes are written through unified state
- entering house does not reset player base stats
- session state is stored through a unified contract
- timer behavior, if any, runs through `tick` requests plus shared side-effect wiring
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
