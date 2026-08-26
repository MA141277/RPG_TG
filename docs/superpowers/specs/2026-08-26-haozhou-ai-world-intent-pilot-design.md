# Haozhou AI World Intent Pilot Design

## 1. Goal

Add the first approved slice of a game-wide AI-driven interaction model by building a `濠州`
vertical pilot that lets the player use both existing buttons and natural-language intent while
keeping the current rules, house contracts, and story owners authoritative.

The approved result is:

1. the first slice covers `city.kulan` only,
2. the player may continue using the existing click-driven UI,
3. the player may also type intents such as `我要去商铺`, `我想见住持`, `带我去药铺`,
   `我要找郭子兴`, or `我想买点东西`,
4. non-dialogue actions use a short bottom-dialogue narration before execution instead of opening a
   new modal,
5. AI may interpret navigation, NPC targeting, service opening, and story negotiation intent,
6. local game rules remain the only authority for legality, state mutation, story advancement, and
   settlement,
7. no new concrete house business branch is added to `src/main.ts`.

This pilot is not "replace the whole game in one patch." It is the approved first step toward that
goal, constrained to a reusable mechanism and one city.

## 2. Current Context And Mismatch

Current repository and working-tree reality:

1. `city.kulan` currently contains the normal Haozhou building set:
   - `house.kulan.leader_residence`
   - `house.kulan.temple`
   - `home_001`
   - `house.kulan.keep`
   - `house.kulan.tea_house`
   - `house.kulan.market`
   - `house.kulan.grain_shop`
   - `house.kulan.medicine_house`
   - `house.kulan.inn`
2. `city.kulan` also contains the parallel experimental host
   `house.kulan.temple_txt_narrative`, which is already a separate AI/TXT path and should not be
   made the owner of world-intent routing for this pilot.
3. Zhu Yuanzhang story progression is currently split across:
   - story stages in `src/domain/zhu-yuanzhang-story.ts`
   - access refusal data in
     `src/content/scenario-packs/zhuyuanzhang/house-access-refusal-rules.json`
   - concrete house modules such as `temple-house` and `keep-house`
   - event/story callback wiring
4. The current working tree already has a shared NPC AI talk seam for `头像 -> 谈话`, but that seam
   begins only after entering the NPC talk flow. It does not own:
   - building entry,
   - house leaving,
   - switching to another building by text,
   - opening house service actions by text,
   - main-story negotiation outside the existing `谈话` loop.
5. There is no shared capability model that tells AI "what the player can legally do right now" in
   a structured way.
6. There is no shared contract that lets AI say "the player is trying to persuade the abbot to let
   him leave early" without also directly mutating story state.

That means this pilot must not be implemented as:

- a `main.ts` text-matching branch,
- a temple-only patch,
- a keep-only patch,
- a copy of the NPC dialogue router expanded with ad hoc world heuristics,
- a second AI-owned state machine that bypasses current house and story modules.

## 3. Approved Behavior Contract

### 3.1 Scope

The Haozhou pilot covers the standard Haozhou city/building loop only:

- entering buildings from the Haozhou city view,
- leaving the current building,
- switching from one Haozhou building to another by typed intent,
- targeting an NPC to talk,
- opening currently available house service actions by typed intent,
- AI-driven negotiation for selected Haozhou main-story gates.

The first pilot treats the following as in-scope building destinations:

- `house.kulan.leader_residence`
- `house.kulan.temple`
- `home_001`
- `house.kulan.keep`
- `house.kulan.tea_house`
- `house.kulan.market`
- `house.kulan.grain_shop`
- `house.kulan.medicine_house`
- `house.kulan.inn`

The pilot does not promote `house.kulan.temple_txt_narrative` into the shared world-intent owner.
That parallel host remains separate until a later convergence pass.

### 3.2 Dual-Mode Control

The user approved a dual-mode control model:

- existing buttons remain valid and remain the safest fallback,
- a new world-intent text path is added on top of the existing city/house UI,
- button clicks and text intents converge into one shared world-intent pipeline.

Important distinction:

- button clicks are already explicit and do not need AI to guess their meaning,
- typed input does need AI classification.

Therefore:

- button clicks execute through existing local routing first,
- the resulting world event is then synchronized into AI context,
- typed input is sent to the AI classifier first,
- the returned intent is then validated and executed by local routing.

### 3.3 Non-Dialogue Action Feedback

The user approved `light narration` for non-dialogue actions.

That means:

- no new popup window is created for world intent,
- the existing bottom dialogue box is reused as the narration surface,
- when a text intent resolves to a non-dialogue action, the game first shows a short in-world
  narration line in the bottom dialogue box,
- after the player advances or the short narration completes, the actual action executes and the
  normal destination UI takes over.

Examples:

- `我要去药铺` -> short transition narration -> enter `house.kulan.medicine_house`
- `带我去商铺` -> short transition narration -> enter `house.kulan.market`
- `我出去` -> short narration -> leave current house
- `我想看看这里卖什么` -> short narration -> open the currently available matching service action

### 3.4 AI-Driven Story Progression Boundary

This pilot also covers dialogue-led Haozhou main-story progression where the player is effectively
negotiating, persuading, or requesting permission through speech.

The approved boundary is:

- AI may determine which negotiation the player is attempting,
- AI may classify the player's approach/tone,
- AI may produce short narrative glue,
- AI may decide that the player is asking to continue a story gate,
- AI may not directly decide story success, mutate flags, or skip local gate rules.

Those outcomes remain local-rule owned.

Initial pilot negotiation targets:

- `temple.request-early-begging`
- `temple.review-work-plan-negotiation`
- `keep.assignment-negotiation`

These are not hardcoded shell branches. They are the first approved story-node set behind a shared
story-negotiation mechanism.

### 3.5 Out Of Scope

The first Haozhou pilot explicitly does not include:

- non-Haozhou cities,
- full-game cross-city freeform travel by AI,
- battle freeform AI control,
- rewriting the whole economy around AI,
- replacing every legacy authored scene with generative AI at once,
- converging the experimental `txt-narrative-place` host into the same world-intent owner yet.

## 4. Architecture

### 4.1 Shared World AI Intent Router

Add a shared mechanism, `AI World Intent Router`, that sits above existing local
navigation/house/story owners.

Its job is narrow:

1. normalize world-facing inputs,
2. build the current legal capability snapshot,
3. ask AI to classify only typed intent,
4. validate the returned intent against the current legal capability snapshot,
5. dispatch the validated result to the existing local owner.

It does not:

- hold canonical game state,
- bypass house modules,
- bypass access refusal rules,
- bypass story callbacks,
- bypass the existing shared NPC interaction runtime.

### 4.2 Capability Registry

The router depends on a shared, runtime-built capability snapshot instead of raw prompt guessing.

Recommended shape:

```ts
type WorldCapabilitySnapshot = {
  cityId: string;
  cityName: string;
  currentHouseId: string | null;
  currentHouseModuleId?: string | null;
  storyStage?: string | null;
  reachableHouses: WorldReachableHouseCapability[];
  talkTargets: WorldTalkTargetCapability[];
  serviceActions: WorldServiceActionCapability[];
  negotiableStoryNodes: WorldStoryNegotiationCapability[];
  leaveAction?: WorldLeaveCapability | null;
};
```

Capability sources for the Haozhou pilot:

1. city/building reachability from authored city/house content plus the current access rules,
2. current talk targets from the active house roster and NPC interaction context seam,
3. current service actions from the active house module's exposed action surface,
4. current negotiable story nodes from local story-owner resolvers,
5. leave/back capability from the current city/house shell.

This registry is the key mechanism-first boundary. It prevents the AI layer from guessing actions
that the current local state does not expose.

### 4.3 AI Request And Return Protocol

Typed world input and AI return should be strict and small.

Recommended input normalization:

```ts
type WorldIntentInput =
  | { type: "button-observed"; event: WorldObservedEvent }
  | { type: "text-intent"; text: string }
  | { type: "system-observed"; event: WorldObservedEvent };
```

Button and system events are synchronized into AI context, not classified for decision.

Typed AI classification result for text input:

```ts
type WorldAiIntentResponse =
  | {
      intent: "go-to-house";
      targetHouseId: string;
      shortNarration?: string;
      confidence: number;
    }
  | {
      intent: "leave-house";
      shortNarration?: string;
      confidence: number;
    }
  | {
      intent: "talk-to-npc";
      targetCharacterId: string;
      shortNarration?: string;
      confidence: number;
    }
  | {
      intent: "open-service-action";
      actionId: string;
      shortNarration?: string;
      confidence: number;
    }
  | {
      intent: "negotiate-story-node";
      nodeId: string;
      targetCharacterId?: string;
      approach:
        | "deferential"
        | "plea"
        | "pragmatic"
        | "duty"
        | "competence"
        | "defiant";
      shortNarration?: string;
      confidence: number;
    }
  | {
      intent: "clarify";
      question: string;
      confidence: number;
    };
```

Hard rules for the AI layer:

1. return exactly one top-level intent,
2. do not invent houses, NPCs, or actions outside the provided capability snapshot,
3. do not return direct state mutations,
4. do not decide success/failure of negotiable story gates,
5. use `clarify` instead of low-confidence guessing.

### 4.4 Local Execution Boundary

The router validates the returned intent against the current capability snapshot and then hands it
to the existing local owner:

- `go-to-house` -> current navigation owner / `enter-house` path
- `leave-house` -> current leave/back path
- `talk-to-npc` -> shared NPC interaction runtime
- `open-service-action` -> current house action dispatch owner
- `negotiate-story-node` -> current local story-node resolver

If validation fails:

- no state change happens,
- the bottom dialogue box shows an in-world refusal or clarification line,
- the player remains in control and may retry or click a button.

This keeps AI as an interpreter, not a state authority.

### 4.5 Story Negotiation Nodes

Negotiable Haozhou main-story gates should be formalized as local rule-owned nodes rather than
implicit prompt tricks.

Recommended shape:

```ts
type StoryNegotiationNode = {
  nodeId: string;
  owner: string;
  availableWhen: (input: StoryNegotiationAvailabilityInput) => boolean;
  speakerTargets: string[];
  allowedApproaches: Array<
    "deferential" | "plea" | "pragmatic" | "duty" | "competence" | "defiant"
  >;
  resolve: (
    input: StoryNegotiationResolveInput
  ) => StoryNegotiationResolveResult;
};
```

Resolution remains local and may produce:

- success,
- partial success,
- failure,
- follow-up narration,
- event trigger,
- callback handoff,
- a normal service/action opening,
- no state change.

The important boundary is:

- AI says what the player is trying to negotiate,
- the local node resolver decides what actually happens.

### 4.6 State Synchronization And AI Context

Local runtime state remains the source of truth. AI receives a synchronized context projection only.

After every real local action completes, append a world event into AI context, for example:

- player entered `house.kulan.temple`,
- player left `house.kulan.market`,
- player started talking to `char.kulan_temple_abbot`,
- player opened `investigate-market`,
- negotiation `temple.request-early-begging` failed,
- story gate advanced from temple review to begging permission.

Recommended persistent support state:

```ts
type WorldAiContextRuntimeState = {
  recentEvents: WorldObservedEvent[];
  lastKnownCityId: string | null;
  lastKnownHouseId: string | null;
};
```

This state is contextual support only. It does not replace existing gameplay state.

### 4.7 UI Flow

The world-intent pilot should not create a new detached dialogue window.

Approved UI behavior:

1. city view and house view keep their existing buttons,
2. a compact world-intent text entry is added to the shared city/house shell,
3. the existing bottom dialogue box is reused for:
   - light narration before non-dialogue execution,
   - clarification prompts,
   - invalid-action refusal feedback,
   - short story negotiation glue when needed,
4. explicit NPC `谈话` continues to enter the existing shared NPC AI dialogue flow,
5. once inside NPC AI dialogue, that specialized UI remains the owner until the player exits it.

This gives the player both deterministic buttons and freeform typed intent without replacing the
current UI shell.

### 4.8 Failure And Fallback

The pilot must fail closed.

If AI:

- times out,
- returns an invalid payload,
- returns an illegal target,
- cannot disambiguate user intent,

then the game must:

- keep the current city/house/session unchanged,
- show a short bottom-dialogue notice,
- keep buttons usable,
- allow the player to retry immediately.

This pilot must never soft-lock the player behind AI availability.

## 5. Interaction Flow

### 5.1 Button-Driven World Event

1. The player clicks an existing button such as `寺庙`, `药铺`, `返回濠州`, or a visible NPC avatar.
2. The current local owner executes the action through the existing route.
3. After execution, the runtime records a normalized observed event into AI context.
4. AI now "knows" where the player is and what just happened, but it did not decide the action.

### 5.2 Text-Driven Navigation Or Service Opening

1. The player types a world intent such as:
   - `我要去商铺`
   - `带我去茶馆`
   - `我想买点东西`
   - `我想看看这里都卖什么`
2. The router builds the current Haozhou capability snapshot.
3. The AI classifier returns exactly one intent.
4. The local router validates that intent.
5. If valid:
   - a short bottom-dialogue narration plays,
   - the real local action executes.
6. If invalid or ambiguous:
   - the bottom dialogue box asks for clarification or refuses the action,
   - no state change happens.

### 5.3 Text-Driven NPC Or Story Negotiation

1. The player types a speech-like intent such as:
   - `我想见住持`
   - `我想和郭子兴谈谈`
   - `能不能先让我出去化缘`
   - `住持，我干活可以更快，先让我出去吧`
2. The router decides whether the current legal target is:
   - a normal NPC talk target,
   - a negotiable story node,
   - a clarification case.
3. If the result is `talk-to-npc`, control enters the existing shared NPC AI dialogue flow.
4. If the result is `negotiate-story-node`, the local story-node resolver handles it and returns
   the actual outcome.
5. The resulting event is synchronized back into AI context.

### 5.4 Illegal Cross-Scope Requests

The router must reject cross-scope or non-existent actions instead of "being helpful" in a way that
breaks rules.

Examples:

- in the inn, `带我去商铺赌几把` must not jump to another scene or open a non-existent inn gamble
  path if the legal capability snapshot does not expose it,
- in temple-stage lock, `带我离开濠州` must still be blocked by the current story gate,
- if `帅府` is closed by current refusal rules, AI may narrate the refusal but cannot bypass it.

### 5.5 Exit And Recovery

At any time, the player may ignore text input and keep playing with buttons.

If the player leaves the current house, changes NPC, or otherwise moves the world state:

- pending AI world-intent work must be canceled or ignored as stale,
- current local UI becomes authoritative immediately,
- synchronized AI context catches up after the confirmed local change.

## 6. Testing And Verification

Implementation must prove:

1. the Haozhou world-intent router classifies only typed input and does not intercept explicit
   button meaning,
2. the capability registry reflects the current legal houses, NPCs, service actions, and
   negotiable story nodes,
3. illegal AI targets are rejected without state mutation,
4. bottom-dialogue light narration appears before valid non-dialogue execution,
5. Haozhou buttons remain usable as a full fallback path,
6. temple and keep negotiation nodes remain local-rule authoritative,
7. access refusal rules such as temple stay-lock and keep closure still block illegal movement,
8. `src/main.ts` changes remain shell-only dependency injection / wiring.

Minimum verification should include:

- focused capability-registry tests,
- world-intent request/response validation tests,
- Haozhou integration tests for:
  - city -> house typed navigation,
  - in-house typed leave,
  - typed NPC targeting,
  - typed service opening,
  - typed negotiation against temple/keep gates,
- stale-request / timeout / invalid-payload fallback tests,
- relevant shell guard tests if top-level wiring changes,
- `C:\\Users\\29636\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\bin\\node.exe .\\node_modules\\typescript\\bin\\tsc --noEmit -p tsconfig.json`.

## 7. Exit Conditions

This pilot is complete only when:

1. Haozhou keeps its existing button-driven gameplay intact,
2. the player can also type legal Haozhou world intents and reach the correct local destination or
   action,
3. AI cannot move the player into illegal buildings, illegal services, or illegal story states,
4. typed negotiation can participate in the selected Haozhou story gates while local rules still
   decide the result,
5. AI failure never soft-locks the player,
6. the pilot remains limited to Haozhou and does not silently widen scope to other cities,
7. the experimental `txt-narrative-place` path remains separate until an explicit convergence pass,
8. no new concrete house business branch lands in `src/main.ts`.
