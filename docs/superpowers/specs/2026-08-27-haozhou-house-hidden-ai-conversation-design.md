# Haozhou Hidden AI House Conversation Design

## 1. Goal

Build the first approved slice of a `hidden AI-driven indoor interaction` model for `濠州`
(`city.kulan`) while keeping the current game shell, house contracts, and local rule owners
authoritative.

The approved result is:

1. the pilot applies only to standard Haozhou indoor houses,
2. no new visible AI popup or upper-left AI panel is introduced,
3. the existing house shell remains the presentation owner,
4. NPCs initiate the first line automatically after the player enters an eligible Haozhou house,
5. the bottom in-house dialogue box becomes the visible conversation surface,
6. AI may semantically route player speech to legal local actions, house changes, NPC switches,
   leave actions, and approved story negotiation nodes,
7. local house modules and story owners remain the only authority for legality, settlement,
   persistent mutation, and story advancement,
8. no concrete Haozhou business branch is added to `src/main.ts`.

This is not a whole-game replacement pass. It is the approved Haozhou-only pilot for a reusable
shared mechanism that may later be promoted into a global rule.

## 2. Current Context And Mismatch

Current repository and working-tree reality:

1. Haozhou already contains the standard indoor building set:
   - `house.kulan.temple`
   - `house.kulan.keep`
   - `house.kulan.tea_house`
   - `house.kulan.market`
   - `house.kulan.grain_shop`
   - `house.kulan.medicine_house`
   - `house.kulan.inn`
   - `house.kulan.leader_residence`
   - `home_001`
2. Haozhou also contains the parallel experimental host `house.kulan.temple_txt_narrative`, which
   already serves as a dedicated TXT/AI reference path and should not become the owner of this
   shared indoor pilot.
3. The current working tree already has two separate AI-facing seams:
   - shared NPC AI dialogue under `npcInteractionSession`,
   - shared world-intent classification with a visible `world-intent-bar`.
4. The current shared NPC AI dialogue seam already supports:
   - automatic `start_talk` request construction,
   - inclusion of current place, NPC, player, transcript summary, memory summary, and currently
     available special actions,
   - strict `3 choice` validation,
   - page splitting in the bottom dialogue format,
   - stale-request cancellation,
   - persistent per-NPC memory storage under `GameState.runtime.npcDialogue`.
5. The current NPC AI dialogue seam does not yet own:
   - entering a house and immediately starting the conversation,
   - leaving the current house by natural language,
   - switching to another Haozhou house by natural language,
   - switching to another NPC in the same room by natural language,
   - direct semantic service settlement such as `我想买一匹布`,
   - inline reuse of the current house shell instead of the standalone NPC overlay.
6. The current visible `world-intent-bar` is the wrong player-facing surface for this pilot. The
   approved goal is hidden AI behind the existing house UI, not a second visible AI console.
7. Current Haozhou house modules already expose stable local actions such as:
   - `market-house`: `buy-goods`, `sell-goods`, `investigate-market`
   - `grain-shop`: `buy`, `sell`, `investigate`, `accounting`
   - tavern, tea house, temple, and keep each expose their own legal action surface
   but those actions are still primarily opened through the current center action container.

That means this pilot must not be implemented as:

- a `main.ts` text-matching branch,
- a visible second AI bar layered over Haozhou houses,
- a copy of the old keyword matcher,
- a house-by-house duplicated AI subsystem,
- a TXT host promotion that bypasses the normal house lifecycle,
- an AI-owned settlement path that writes money, goods, flags, or story state directly.

## 3. Approved Scope

### 3.1 Pilot Buildings

The pilot covers the standard Haozhou indoor buildings that already use the normal house shell:

- `house.kulan.temple`
- `house.kulan.keep`
- `house.kulan.tea_house`
- `house.kulan.market`
- `house.kulan.grain_shop`
- `house.kulan.medicine_house`
- `house.kulan.inn`
- `house.kulan.leader_residence`

The first slice does not promote these into the pilot owner:

- `house.kulan.temple_txt_narrative`
- `home_001`

Reason:

- `house.kulan.temple_txt_narrative` is an explicit parallel AI/TXT reference host,
- `home_001` is not the primary NPC-service path the user wants to evaluate first.

### 3.2 In Scope

The Haozhou pilot covers:

1. entering an eligible Haozhou house and immediately falling into NPC-first AI dialogue,
2. using the existing bottom dialogue box as the only visible conversation surface,
3. hiding the current central house action buttons during free conversation,
4. switching among currently present house NPCs through direct click or natural language,
5. routing natural-language player speech to currently legal local actions,
6. routing natural-language player speech to another legal Haozhou house,
7. routing natural-language player speech to the current `leaveAction`,
8. routing natural-language player speech to currently exposed story negotiation nodes,
9. direct semantic settlement for supported Haozhou house services when the player gives enough
   information,
10. automatic return from local overlay/playable/service UI back into the same conversation-primary
    shell.

### 3.3 Out Of Scope

This pilot does not include:

- non-Haozhou cities,
- outdoor/city-square/world-map AI control,
- promoting `temple_txt_narrative` into the shared owner,
- rewriting every authored scene into generative AI,
- bypassing existing story scenes, playables, overlays, or house-owned settlements,
- globalizing the rule to every building before Haozhou pilot validation.

## 4. Approved Player-Facing Behavior Contract

### 4.1 Entering An Eligible Haozhou House

When the player enters an eligible Haozhou house and no blocking higher-priority flow is active:

1. the shared controller automatically selects `HouseDefinition.defaultCharacterId` as the current
   conversation target,
2. the target NPC immediately initiates the first spoken line,
3. no extra NPC menu or dedicated AI popup is shown,
4. the player sees the reply in the original bottom house dialogue box,
5. the center action container is hidden for that free-conversation phase.

If the house is currently occupied by a blocking state such as:

- story dialogue,
- meeting/review,
- overlay/modal,
- playable/minigame,
- message window,
- forced refusal or house-owned interruption,

the controller does not force AI-primary mode yet. The house remains the owner until it returns to
free interaction.

### 4.2 Bottom Dialogue As The Only Visible Conversation Surface

During free conversation:

- NPC speech appears in the original bottom dialogue box,
- long NPC speech continues to use the existing page split rule and click-to-advance behavior,
- the right-side speaker portrait remains the existing house dialogue portrait,
- the bottom area may show `3 AI-generated quick replies` plus a `custom input` path,
- the quick replies are shortcuts, not the only legal player response path,
- the player may type any direct sentence instead of choosing a shortcut.

There is no visible `AI意图` bar in these pilot houses. The hidden AI capability remains active,
but the player-facing input surface moves into the bottom house dialogue flow.

### 4.3 NPC Switching

The left standby roster remains visible.

Clicking another NPC in the same Haozhou house:

1. does not open the old `谈话` menu first,
2. changes the current conversation target,
3. cancels the previous pending AI request,
4. makes the newly selected NPC start the first line.

The pilot still allows the old `谈话` button path to exist as a compatibility route, but it is no
longer the primary intended Haozhou indoor flow.

### 4.4 Leaving And House Switching

The player may leave the current house in two ways:

- click the existing leave control,
- say a natural sentence such as `我先走了`, `我出去看看`, or `我去粮铺`.

Natural-language switching is allowed only when the target is:

- the current Haozhou city,
- currently reachable,
- presently legal under access rules,
- part of the active capability snapshot.

The pilot never allows AI to jump across city boundaries or into unavailable buildings.

### 4.5 House Service Handoff

When the player talks about a supported current-house service:

- the AI may continue ordinary dialogue,
- or the AI may route into an existing house service,
- or the AI may settle a supported house service directly if local rules confirm that the request is
  complete and legal.

Examples of approved outcomes:

- `这里都卖什么` -> open or narrate the existing investigation/report flow,
- `我想买一匹布` -> direct market purchase settlement if item and quantity are understood and legal,
- `你这卖米吗` in the market -> local reject with an in-character explanation,
- `我去粮铺一趟` -> route to `house.kulan.grain_shop`,
- `我想出去化缘` in the temple -> route to an exposed story negotiation only if that negotiation is
  currently legal.

## 5. Architecture

### 5.1 Shared Owner

This pilot is a shared indoor interaction mechanism, not a concrete house module.

The shared owners are:

- current conversation target and transcript: `npcInteractionSession`,
- persistent per-NPC memory: `GameState.runtime.npcDialogue`,
- semantic routing and action dispatch: a new shared house conversation coordinator,
- local service legality and settlement: current house modules,
- story progression legality and outcome: current story negotiation owners.

`src/main.ts` remains shell-only. It may assemble the new coordinator and forward generic events,
but it must not regain Haozhou business branches.

### 5.2 New Shared Coordinator

Add a shared coordinator under `src/application/runtime/`, tentatively:

```ts
type HouseConversationCoordinator = {
  onHouseStageEntered(): void;
  onHouseStageUpdated(): void;
  dispatch(input: HouseConversationRequest): void;
  closeActiveRequest(): void;
};
```

Responsibilities:

1. decide whether the current stage is eligible for Haozhou hidden conversation mode,
2. automatically seed or restore the active NPC conversation target,
3. request `start_talk` from the shared NPC runtime when the current target should initiate speech,
4. build the current legal conversation capability snapshot,
5. route player input to:
   - ordinary NPC dialogue,
   - house action handoff,
   - direct service settlement,
   - same-house NPC switching,
   - Haozhou house switching,
   - leave-house,
   - story negotiation,
6. suspend itself whenever a higher-priority house-owned blocking state becomes active,
7. resume free conversation when local owners return control.

This coordinator is a shared seam. Haozhou pilot eligibility is data/policy, not a hardcoded owner.

### 5.3 Eligibility Policy

Add a dedicated policy helper, for example:

```ts
type HouseConversationPilotPolicy = {
  enabledCityIds: string[];
  excludedHouseIds: string[];
};
```

The first approved policy is:

- enabled city: `city.kulan`,
- excluded houses:
  - `house.kulan.temple_txt_narrative`
  - `home_001`

The coordinator may activate only when:

1. the current stage is a house stage,
2. the current house is covered by the pilot policy,
3. no blocking overlay/modal/playable/message/story state is active,
4. the active house module currently exposes a free interaction state.

### 5.4 Capability Snapshot

The coordinator builds one current `conversation capability snapshot` instead of letting multiple AI
paths guess independently.

Recommended shape:

```ts
type HouseConversationCapabilitySnapshot = {
  cityId: string;
  houseId: string;
  moduleId?: string | null;
  targetCharacterId: string | null;
  targetCharacterName: string | null;
  switchableNpcTargets: Array<{
    characterId: string;
    characterName: string;
    available: boolean;
  }>;
  houseActions: Array<{
    actionId: string;
    label: string;
    available: boolean;
  }>;
  houseServices: HouseConversationServiceCapability[];
  reachableHouses: Array<{
    houseId: string;
    houseName: string;
    available: boolean;
  }>;
  leaveAction: {
    actionId: string;
    label: string;
    available: boolean;
  } | null;
  negotiableStoryNodes: Array<{
    nodeId: string;
    label: string;
    allowedApproaches?: string[];
    targetCharacterId?: string | null;
  }>;
};
```

Sources:

1. current target NPC and standby roster from the active house view model,
2. current house action surface from the active house module view model,
3. semantic services from a new optional house-owned service capability contract,
4. reachable Haozhou houses from current access rules,
5. leave action from the active house view model,
6. negotiable story nodes from the current negotiation registry.

This snapshot is the authoritative legal boundary for AI routing.

### 5.5 Unified Semantic Route Contract

All free-text player input inside the pilot houses goes through one route contract first.

Recommended result:

```ts
type HouseConversationRoute =
  | { kind: "continue-dialogue" }
  | {
      kind: "switch-target-npc";
      characterId: string;
    }
  | {
      kind: "open-house-action";
      actionId: string;
    }
  | {
      kind: "settle-house-service";
      serviceId: string;
      rawPlayerText: string;
    }
  | {
      kind: "go-to-house";
      houseId: string;
    }
  | {
      kind: "leave-house";
    }
  | {
      kind: "negotiate-story-node";
      nodeId: string;
      approach: string;
      targetCharacterId?: string | null;
    };
```

Important rules:

1. `start_talk` is still NPC-first and skips semantic route classification.
2. Every later player turn goes through route resolution before ordinary dialogue continuation.
3. The route resolver may only return snapshot-legal targets.
4. Any illegal or missing route resolves to `continue-dialogue` or explicit clarification, not to a
   direct action.

### 5.6 Reuse Of Existing AI Route Stage

The current external NPC AI provider already performs a hidden `route-only` pass for current
special house actions. This pilot should extend that shared route-only phase instead of restoring
keyword matching or reviving the visible `world-intent-bar`.

Approved direction:

1. keep one hidden semantic route owner inside the indoor conversation flow,
2. extend the route-only prompt/response contract from `special actions only` to the broader
   `HouseConversationRoute` set,
3. keep the player-visible NPC reply generation separate from route resolution,
4. after a route is resolved:
   - if `continue-dialogue`, run the ordinary reply generation request,
   - if actionable, run a short in-character transition reply and then dispatch the local route.

This preserves the current `lead-in line before handoff` behavior while broadening what can be
handed off.

### 5.7 House-Owned Semantic Service Contract

Direct settlement requires a new stable house-owned contract instead of AI guessing game state
mutations.

Recommended capability and resolution seam:

```ts
type HouseConversationServiceCapability = {
  serviceId: string;
  label: string;
  mode: "direct-settlement" | "handoff-action";
  description: string;
};

type HouseConversationServiceResolutionRequest = {
  serviceId: string;
  rawPlayerText: string;
  targetCharacterId: string | null;
};

type HouseConversationServiceResolutionResult =
  | {
      kind: "settled";
      resultDialogueLines: string[];
    }
  | {
      kind: "handoff-action";
      actionId: string;
    }
  | {
      kind: "clarify";
      question: string;
    }
  | {
      kind: "reject";
      reason: string;
    };
```

Rules:

1. the shared coordinator may ask a house to resolve a semantic service request,
2. the house module remains the only owner that maps natural-language content to local typed
   business parameters,
3. the house module remains the only owner that mutates money, inventory, favorability, runtime
   market state, or any other persistent gameplay data,
4. if direct settlement is not yet appropriate, the house may return `handoff-action` and reuse the
   existing overlay/playable/action path.

This is the mechanism that enables requests such as:

- `买一匹布`
- `卖两斗粮`
- `来赌几把`
- `我想配一点药`

without moving the settlement rules into the AI layer.

### 5.8 Story Negotiation Boundary

Story negotiation remains a legal route kind, but only behind the current shared negotiation
registry.

The AI layer may:

- identify that the player is trying to continue a conversation-led main-story gate,
- classify the approach,
- produce transition dialogue.

The AI layer may not:

- decide success or failure,
- mutate flags directly,
- skip local gate checks,
- invent new story nodes.

The route is legal only if the current capability snapshot already exposes that negotiation node and
its approach.

## 6. UI Contract

### 6.1 What Remains Visible

The pilot keeps these existing house-shell elements:

- the current house scene and art,
- the current right-side dialogue portrait pattern,
- the left standby NPC roster,
- the house status card,
- the current leave control.

### 6.2 What Changes In Free Conversation Mode

During free conversation mode:

- the central `actionContainer` is hidden,
- the standalone NPC interaction overlay is not shown,
- the visible `world-intent-bar` is not shown,
- the bottom dialogue area becomes the only visible speech/input surface.

The existing house shell remains the layout owner. The pilot should not create a second modal
window or floating AI console.

### 6.3 Overlay And Playable Re-entry

If a routed action opens a current house-owned overlay or playable:

1. that local UI takes over normally,
2. the shared conversation controller suspends itself,
3. when the local owner returns to a free interaction state, the controller restores the current NPC
   conversation-primary shell.

This preserves current visual and gameplay owners while making dialogue the default entry path.

## 7. Fail-Closed Error Handling

The pilot must fail closed.

### 7.1 Route Legality

The coordinator may execute a route only when it is still legal against the latest capability
snapshot at dispatch time.

If legality drift occurs, the result is:

- a local in-character clarification,
- or an error/notice line in the bottom dialogue,
- but never an unsafe jump or settlement.

### 7.2 Provider Failure

If the provider times out or errors:

- the current conversation target remains selected,
- the player may retry from the same bottom dialogue surface,
- no action/route/settlement is executed.

### 7.3 Stale Streams

Changing NPCs, leaving a house, switching houses, or opening a blocking local owner must cancel the
old active request. Later stale provider events must be ignored.

### 7.4 Invalid AI Output

If the AI returns:

- an illegal route target,
- malformed route data,
- an action not in the current capability snapshot,
- an invalid number of reply options for ordinary dialogue,

the runtime must refuse execution and remain in a recoverable dialogue state.

### 7.5 Unsupported Requests

If the player asks for something unavailable in the current place, the house or route layer should
return one of:

- clarification,
- local rejection,
- or normal NPC dialogue continuation.

It must not jump across building/city boundaries or guess a settlement target from a different
house.

## 8. Testing Strategy

The pilot should extend existing repository test families rather than inventing a new isolated
testing style.

### 8.1 Shared Coordinator Tests

Add a dedicated coordinator suite, for example:

- `tests/house-conversation-coordinator.test.cjs`

Minimum coverage:

1. Haozhou-only eligibility gate,
2. excluded-house behavior for `temple_txt_narrative` and `home_001`,
3. auto-start on eligible house entry,
4. suspension while overlay/playable/story/message states are active,
5. resume into free conversation after local ownership releases.

### 8.2 NPC Runtime Tests

Extend `tests/npc-ai-dialogue-runtime.test.cjs` to cover:

1. automatic NPC-first line after house entry,
2. cancellation and stale-event suppression during NPC switch/leave/house jump,
3. hidden route-only resolution before ordinary reply generation,
4. fail-closed handling when route output is illegal,
5. continued memory persistence under `memoriesByCharacterId`.

### 8.3 Route Contract Tests

Add or extend route-level tests to cover:

1. `continue-dialogue`,
2. `switch-target-npc`,
3. `open-house-action`,
4. `settle-house-service`,
5. `go-to-house`,
6. `leave-house`,
7. `negotiate-story-node`,
8. invalid route refusal.

These may extend existing `world-intent-action-coordinator` style assertions, but the new indoor
conversation route should remain a distinct contract from the old visible world-intent UI.

### 8.4 House Service Resolution Tests

For Haozhou houses that support direct semantic settlement, add or extend house-local tests for:

- successful direct settlement,
- required clarification when parameters are incomplete,
- rejection when the current place does not support the request,
- fallback `handoff-action` when the service should still open an existing overlay/playable.

Examples:

- `market-house` service resolution tests,
- `grain-shop` service resolution tests,
- `tavern` service resolution tests.

### 8.5 View Contract Tests

Add a view contract suite, for example:

- `tests/house-hidden-ai-conversation-view-contract.test.cjs`

Minimum coverage:

1. eligible Haozhou houses hide `actionContainer` during free conversation mode,
2. visible `world-intent-bar` is absent for pilot houses,
3. the original bottom dialogue surface remains present,
4. existing portrait/standby roster rendering remains intact,
5. non-pilot houses remain unchanged.

### 8.6 Main Shell Guard

If any shell wiring is touched, update shell guard coverage to ensure:

- no concrete Haozhou market/grain/temple/tavern business branch returns to `src/main.ts`,
- `main.ts` remains coordinator assembly and event forwarding only.

## 9. Rollout Notes

The Haozhou pilot should be implemented in this order:

1. shared eligibility policy and coordinator seam,
2. free-conversation auto-start and shell UI integration,
3. extended indoor route contract,
4. house-owned semantic service resolution for the first Haozhou houses,
5. story negotiation convergence inside the same route pipeline,
6. Haozhou-only verification and regression passes.

This keeps the pilot incremental while preserving the final approved direction:

- hidden AI,
- one visible house shell,
- one indoor route owner,
- local authoritative house and story settlement.
