# TXT Narrative Place AI Integration Design

## 1. Goal

Add a new parallel `txt-narrative-place` house path that delivers TXT-driven AI narrative conversation
inside the existing house framework, starting from the Zhu Yuanzhang Huangjue Temple opening.

The approved result is:

- the existing `temple-house` remains intact and keeps its current gameplay,
- a new parallel TXT narrative host is added instead of replacing `house.kulan.temple`,
- the opening must begin at Huangjue Temple with the abbot ordering everyone to go out and beg
  for alms because famine, war, and refugees have pushed the temple beyond what it can feed,
- the AI integration point is reserved behind a provider seam modeled after the reference zip
  architecture instead of hardwiring one vendor SDK,
- the first slice is runnable with a deterministic local placeholder provider so the feature is
  testable before the user's internal AI is plugged in,
- TXT output drives narration, dialogue, choices, and code-owned scene/place transitions,
- no new house business branch is added to `src/main.ts`.

This child is house work and must continue to follow `docs/special-house-interface.md`.

## 2. Current Context And Mismatch

The repository and the handoff document are close, but not identical.

Current repo reality:

1. The actual Huangjue Temple house id is `house.kulan.temple`, not the handoff's suggested
   `house.huangjue_temple`.
2. `house.kulan.temple` is currently bound to the synchronous `temple-house` module and contains
   review / assessment / work gating that the handoff explicitly wants bypassed for the TXT
   opening flow.
3. `HouseModuleRequest` currently supports only:
   - `action`
   - `field`
   - `tick`
4. `HouseModuleSideEffect` currently supports only:
   - interval start/stop
   - map auto-advance start/stop
   - coin-reward playback
5. House rendering is currently built around:
   - one active dialogue card,
   - one action container,
   - one typed overlay,
   - no streamed transcript surface,
   - no custom-input narrative choice surface.
6. The builtin house registry has no TXT narrative module or renderer.

That means the handoff cannot be implemented by editing `temple-house` alone, and it cannot be
implemented as a pure view-only patch. The missing seam is an async narrative-provider bridge plus
house-owned transcript/session state.

## 3. Approved Behavior Contract

### 3.1 Scope

- This slice adds a new `txt-narrative-place` house module.
- The old `temple-house` stays registered and playable.
- The first authored narrative opening mirrors Huangjue Temple only.
- The first slice does not reconnect the old world map.
- Scene changes may resolve to exact existing places, fuzzy existing places, or temporary generated
  places without blocking the narrative.

### 3.2 Opening Hard Requirement

The first TXT narrative entry must open at Huangjue Temple and include:

- famine and war pressure,
- refugees around the temple,
- the abbot / host gathering the temple residents,
- the statement that the temple can no longer feed everyone,
- the instruction that people must leave and seek alms / a way to survive,
- follow-up choices such as accepting the order, asking where to go, talking to other monks, or
  leaving the proactive narrative loop.

The implementation must normalize the handoff's suggested temple identity onto the actual repo
content:

- `currentPlace.houseId = "house.kulan.temple"`
- `currentPlace.placeName = "皇觉寺"`

### 3.3 Parallel Rollout

This feature runs in parallel, not as a replacement.

The implementation should therefore add a dedicated narrative host entry for the opening slice,
tentatively:

- `house.kulan.temple_txt_narrative`

That host entry exists only to mount the TXT narrative module through the normal house registry.
Its runtime narrative context mirrors the real content-owned Huangjue Temple:

- source house: `house.kulan.temple`
- source place name: `皇觉寺`
- source visible NPCs: derived from the real temple house definition and current character data

This keeps `house.kulan.temple` untouched while still allowing a fully house-owned TXT experience.

### 3.4 AI Provider Boundary

The zip references show the right integration seam:

- prompt/context assembly stays in game/application logic,
- the provider exposes a generic `stream` / optional `complete` interface,
- the provider emits raw text plus structured steps/events,
- game code, not the model, owns flag writes, scene changes, metrics, and validation.

The RPG_TG implementation must preserve that boundary.

The first slice should ship with a deterministic local placeholder provider that implements the same
provider contract and emits the required opening plus a small follow-up loop. This placeholder is a
test harness only. The user's internal AI later plugs into the same provider interface.

### 3.5 Narrative Output Contract

Internally, the module should consume parsed typed steps rather than raw marker strings.

Core step contract:

```ts
type TxtNarrativeStep =
  | { type: "narration"; text: string }
  | { type: "dialogue"; speakerId: string; speakerName: string; text: string }
  | { type: "scene_change"; sceneId: string; placeName?: string; match?: TxtPlaceMatch }
  | { type: "transition"; text: string }
  | { type: "flag"; op: "set" | "clear" | "note"; key: string; value?: unknown }
  | { type: "choice"; prompt?: string; options: TxtNarrativeOption[] }
  | { type: "metrics"; value: Record<string, unknown> };
```

The raw marker text may still be stored for debugging/replay, but the house module and view layer
must render from the parsed typed contract.

### 3.6 Exit And Reactivation

- Exiting proactive TXT mode is a normal supported action, not an error case.
- Entering place, leaving place, talking to an NPC, choosing an option, or submitting custom text
  all count as narrative inputs.
- A reactivation action must rebuild the next request from the latest runtime + session state rather
  than restarting from a blank opening every time.

## 4. Architecture

### 4.1 New Domain And Runtime Types

Add a dedicated TXT narrative contract set under domain/application ownership.

At minimum:

```ts
type TxtNarrativeInput =
  | { type: "enter_place"; houseId: string; placeName: string; npcIds: string[] }
  | { type: "exit_place"; houseId: string; placeName: string }
  | { type: "talk_to_npc"; houseId: string; npcId: string; npcName: string; text?: string }
  | { type: "select_option"; optionId: string; actionText: string }
  | { type: "custom_input"; text: string }
  | { type: "reactivate_narrative"; houseId: string; placeName: string };

type TxtNarrativeOption = {
  id: string;
  label: string;
  actionText: string;
  kind:
    | "recommended"
    | "mainline"
    | "daily"
    | "npc_interaction"
    | "explore"
    | "custom"
    | "exit";
  recommended?: boolean;
};

type TxtResolvedPlace = {
  requestedName: string;
  resolvedHouseId?: string;
  resolvedPlaceName?: string;
  strategy: "exact" | "fuzzy_existing" | "temporary_generated";
  confidence: number;
  note?: string;
};
```

Add a dedicated `GameState.runtime.txtNarrative` branch for persistent narrative state. Do not hide
persistent flags/log/history inside ad hoc globals or renderer-local state.

### 4.2 Shared House Contract Expansion

The current house contract does not have an async/provider loop. This slice must add one through the
shared house runtime contract rather than bypassing it.

Recommended shared expansion:

```ts
type HouseModuleRequest =
  | { type: "action"; actionId: string }
  | { type: "field"; fieldId: string; value: string }
  | { type: "tick"; tickId: string }
  | {
      type: "txt-narrative-provider-event";
      requestId: string;
      event: TxtNarrativeProviderEvent;
    };

type HouseModuleSideEffect =
  | /* existing effects */
  | {
      type: "start-txt-narrative-stream";
      requestId: string;
      payload: TxtNarrativeProviderRequest;
    }
  | {
      type: "cancel-txt-narrative-stream";
      requestId: string;
    };
```

This is the key reusable mechanism change for the feature. It keeps the async provider loop inside
the shared house runtime boundary and prevents one-off temple or entrypoint branches.

### 4.3 Prompt Builder, Parser, And Provider Port

Mirror the reference zip layering:

1. `TxtNarrativeContextBuilder`
   - builds current place/NPC/story phase/history context from RPG_TG state
2. `TxtNarrativePromptBuilder`
   - converts that context plus the latest narrative input into provider-facing prompt/messages
3. `TxtNarrativeMarkerParser`
   - turns raw streamed marker output into typed `TxtNarrativeStep[]`
4. `TxtNarrativeProviderPort`
   - sends prompts to the provider and emits stream events

Recommended provider contract:

```ts
type TxtNarrativeProviderRequest = {
  requestId: string;
  system: string;
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  metadata: {
    phaseId: string;
    houseId: string;
    placeName: string;
  };
};

type TxtNarrativeProviderEvent =
  | { type: "start"; requestId: string }
  | { type: "raw_text"; requestId: string; delta: string }
  | { type: "step"; requestId: string; step: TxtNarrativeStep }
  | {
      type: "complete";
      requestId: string;
      rawText: string;
      allSteps: TxtNarrativeStep[];
    }
  | { type: "error"; requestId: string; message: string; retryable?: boolean };

type TxtNarrativeProviderPort = {
  stream(
    request: TxtNarrativeProviderRequest,
    onEvent: (event: TxtNarrativeProviderEvent) => void
  ): Promise<void>;
  complete?(
    request: TxtNarrativeProviderRequest
  ): Promise<{
    rawText: string;
    allSteps: TxtNarrativeStep[];
  }>;
};
```

No concrete AI SDK may be imported directly by the house module.

### 4.4 House Runtime Bridge

`createHouseRuntimeBridge()` becomes the owner of provider side effects for houses.

It should:

- receive an injected `txtNarrativeProvider` dependency,
- start provider streams when a house module emits `start-txt-narrative-stream`,
- translate provider events back into `dispatchCurrentHouseRequest()` as
  `txt-narrative-provider-event`,
- cancel active provider requests on leave or when a newer request supersedes the older one,
- ignore stale provider events if the player has already left the originating TXT host session.

If `src/main.ts` needs a change, it must be shell-only dependency injection for the new provider
dependency and not a new house branch. Add or update shell guard tests if that wiring changes.

### 4.5 Session Ownership

The new `TxtNarrativePlaceSessionState` should own session-local conversation state such as:

- the mirrored current place context,
- current visible NPC context,
- transcript turn list,
- pending raw stream text,
- parsed steps accumulated for the current request,
- currently available options,
- custom input field value,
- temporary NPC records,
- temporary place records,
- streaming/error/paused status,
- whether proactive narrative is currently active.

This session state is house-session state only. It must not become a new top-level singleton.

### 4.6 Persistent Runtime Ownership

`GameState.runtime.txtNarrative` should own persistent narrative data such as:

- current phase id,
- persistent narrative flags,
- narrative notes/metrics,
- visited place log,
- place resolution log,
- world log / turn history that should survive leaving and re-entering.

High-value story flags that other runtime systems may later need may also be mirrored into the
existing generic `runtime.flags`, for example:

- `story.zhu.opening.in_temple`
- `story.zhu.opening.abbot_sent_alms`
- `story.zhu.opening.alms_unlocked`

The first slice should keep the authoritative structured narrative state in the dedicated
`runtime.txtNarrative` branch and only mirror cross-system booleans when needed.

### 4.7 Rendering And UI Contract

Do not try to squeeze the full streamed transcript into the current single-card
`HouseDialogueViewModel` alone.

Add a dedicated typed overlay/view surface for the TXT narrative host, for example:

```ts
type HouseOverlayViewModel =
  | /* existing overlays */
  | {
      type: "txt-narrative";
      title: string;
      placeName: string;
      phaseLabel: string;
      isStreaming: boolean;
      paused: boolean;
      transcript: TxtNarrativeTranscriptEntryViewModel[];
      options: TxtNarrativeOptionViewModel[];
      customInput: {
        fieldId: string;
        submitActionId: string;
        value: string;
        placeholder: string;
      };
      controlActions: {
        exitActionId: string;
        reactivateActionId?: string;
      };
      statusNotice?: string;
      errorNotice?: string;
    };
```

Use a dedicated house renderer such as `renderTxtNarrativePlaceHouseView` and register it through
the existing house renderer registry. Reuse shared house shell pieces where practical, but keep the
transcript/choice layout inside the new renderer.

UI rules:

- narration shows no speaker,
- dialogue always shows speaker name,
- known NPCs use existing portraits,
- temporary NPCs use default portraits,
- recommended options are visually distinguished,
- custom input lives in the same panel as generated options,
- exit/reactivate are explicit typed actions, not DOM-only behavior.

### 4.8 Place And NPC Resolution

TXT output may refer to existing, fuzzy-matched, or temporary places/NPCs.

Place resolution rules:

1. `exact`
   - exact match against known house/place names
2. `fuzzy_existing`
   - fuzzy match to an existing house/place label
3. `temporary_generated`
   - create a temporary narrative place record in session/runtime log

NPC resolution rules:

- known NPC -> reuse current character definition
- unknown NPC -> create temporary session NPC record with:
  - generated temp id
  - display name
  - default portrait strategy
  - optional short profile note

The runtime adapter owns this resolution. The view must not guess speakers or destination identity.

### 4.9 Opening Content Ownership

The first slice should not broaden pack-loader scope more than necessary.

Use module-local authored opening content for:

- `storyPhases`
- `dynamicEntries`
- hard-required Huangjue opening prompt intent

But shape those definitions so they are directly movable into scenario-pack JSON later.

This is the pragmatic boundary for the first implementation:

- content-owned enough to avoid hardcoded strings in the renderer,
- small enough to avoid a broad pack loader refactor before the provider seam is proven.

## 5. Interaction Flow

### 5.1 Entering The TXT Host

On `enter()`:

1. resolve the source place as `house.kulan.temple`,
2. mirror its visible NPCs and place label,
3. initialize `runtime.txtNarrative` if missing,
4. initialize the session transcript/options state,
5. if no narrative transcript exists yet, emit `start-txt-narrative-stream` with an
   `enter_place` input for the Huangjue opening.

### 5.2 Stream Lifecycle

While a provider request is active:

- `start` marks the session as streaming,
- `raw_text` appends debug/typing text for the active request,
- `step` applies incremental parsed narrative steps,
- `complete` finalizes the turn and unlocks the next choice surface,
- `error` leaves the session recoverable and exposes a retry/reactivate path.

The module must not directly await network calls inside `dispatch()`.

### 5.3 Step Application

Applying steps should behave as follows:

- `narration` / `dialogue`
  - append transcript entries
- `flag`
  - update `runtime.txtNarrative.flags` and any mirrored runtime flags
- `metrics`
  - update `runtime.txtNarrative.notes` / metrics bucket
- `choice`
  - replace the active option list
- `scene_change`
  - resolve the target place by exact/fuzzy/temporary strategy
  - update current narrative place context through code
  - do not let the model mutate `world.currentHouseId` directly

### 5.4 Player Inputs

The host module translates these actions into `TxtNarrativeInput`:

- entering the host,
- leaving the mirrored place,
- talking to a selected NPC,
- clicking a generated option,
- submitting custom text,
- reactivating proactive narrative.

The model receives narrative inputs; the provider does not receive raw DOM or UI state.

### 5.5 Leaving The Host

On `leave()`:

- cancel any active provider request,
- persist runtime-owned narrative state,
- clear only session-local stream buffers,
- do not reset player stats, inventory, money, or unrelated runtime state.

## 6. Testing And Verification

Implementation must prove all of the following:

1. The new `txt-narrative-place` module is registered through the house registry without new
   `main.ts` business branches.
2. Entering the TXT narrative host produces the required Huangjue Temple opening through the
   placeholder provider.
3. The house runtime can start a narrative provider stream, feed provider events back into house
   dispatch, and ignore stale events after leave/cancel.
4. Parsed steps update transcript/options/runtime flags through code-owned application logic.
5. Exact, fuzzy, and temporary place resolution are covered by focused tests.
6. Temporary NPCs receive deterministic fallback portraits and stable temporary ids.
7. The TXT house view renders:
   - transcript entries,
   - generated choices,
   - custom input,
   - exit/reactivate controls,
   - speaker labels for dialogue lines.
8. Existing `temple-house` remains unchanged as the default temple module.

Minimum verification coverage should include:

- house-runtime/provider bridge tests
- TXT narrative parser/state tests
- TXT place/NPC resolution tests
- TXT house module tests
- TXT view contract tests
- `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`

## 7. Exit Conditions

This child is complete only when:

- `txt-narrative-place` exists as a new parallel house module,
- the first Huangjue Temple TXT opening is runnable through the house framework,
- the abbot alms-departure opening is the first generated narrative event,
- AI integration is reserved behind a provider port rather than a hardcoded vendor client,
- a deterministic local placeholder provider makes the feature testable before the real AI lands,
- the shared house runtime owns provider side effects and provider events,
- existing `temple-house` behavior remains intact,
- no new concrete house business branch lands in `src/main.ts`,
- shared interface changes are documented in `docs/special-house-interface.md` and
  `docs/change-log.md` when implementation lands.
