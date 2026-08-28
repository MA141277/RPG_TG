# Dialogue-Gated Mainline Progression Design

## 1. Goal

Refine the approved indoor AI conversation architecture so that eligible mainline progression does
not jump directly from a player utterance into execution.

The approved hard rule is:

1. AI must advance mainline through in-character asking, explanation, follow-up, and confirmation,
2. AI may not directly "decide the plot result" or immediately execute a mainline handoff on first
   contact,
3. local house modules remain the only authority for legality, settlement, persistent state
   mutation, time cost, rewards, task assignment, and story-flag progression,
4. the player-facing surface remains the existing hidden indoor AI conversation loop rather than a
   second visible console or a second mainline state machine,
5. no house-specific business branch is added to `src/main.ts`.

In short: AI must guide the player into the next legal story step through dialogue first. House
owners still execute the step.

This design refines and narrows:

- `docs/superpowers/specs/2026-08-28-temple-ai-mainline-design.md`
- `docs/superpowers/specs/2026-08-27-npc-ai-per-turn-intent-gate-design.md`
- `docs/superpowers/specs/2026-08-27-haozhou-house-hidden-ai-conversation-design.md`

## 2. Current Context And Mismatch

Current repository reality already gives us the correct low-level seams:

1. indoor AI talk already runs through the shared NPC interaction runtime,
2. each player utterance already goes through a hidden `chat / clarify / route` intent gate,
3. legal execution already routes through `HouseConversationRoute`,
4. house modules already own action execution, conversation-service settlement, and story
   negotiation settlement,
5. temple already has authored local rule owners for:
   - daily work,
   - weekly review,
   - early begging negotiation,
   - review-time work-plan negotiation,
   - begging-food submission,
   - rest and donation,
   - same-house observed-event memory.

However, the current architecture still lacks one explicit contract:

1. there is no shared typed concept of "this route is a mainline-sensitive route and must be
   dialogue-gated before execution",
2. the hidden intent gate can currently decide `route` as soon as the player line is concrete,
   even when the desired experience is "NPC asks first, player answers, NPC confirms, then handoff",
3. there is no written session-level gate state that distinguishes:
   - ordinary chat,
   - dialogue-led mainline setup,
   - final confirmation before execution,
4. temple has legal mainline owners, but those legal owners are not yet exposed to the shared AI
   layer as "dialogue-first progression opportunities".

That means the next slice must not be implemented as:

1. a prompt-only instruction with no local enforcement,
2. a temple-only special branch in `src/main.ts`,
3. a second plot runtime parallel to the current NPC dialogue session,
4. direct AI-side settlement of work, review, inventory, money, or flags.

## 3. Approved Behavior Contract

### 3.1 Dialogue-First Rule

When the next legal story beat is mainline-sensitive, AI must not immediately jump into execution.

Instead the required rhythm is:

1. NPC opens the topic in character, or responds to the player's opening in character,
2. player replies,
3. NPC asks or confirms if needed,
4. only after the player's meaning is explicit enough does the runtime allow handoff,
5. the existing local owner executes the handoff,
6. the next NPC line reacts to the actual local result instead of restarting from blank chatter.

### 3.2 Hard Distinction Between Guidance And Execution

AI owns:

1. choosing which currently legal mainline opportunity to talk about,
2. opening the topic,
3. explaining context,
4. asking a follow-up question,
5. confirming that the player's intent is explicit enough,
6. generating the short transition line immediately before handoff.

House and story owners keep authority over:

1. whether that opportunity is currently legal,
2. whether the player can actually perform it,
3. what persistent state changes,
4. whether persuasion succeeds,
5. what overlay / action / review panel / local result appears,
6. what observed event is emitted afterward.

### 3.3 No Direct First-Line Mainline Jump

For any route marked as `dialogue-gated mainline`, AI may not do this:

1. player clicks `谈话`,
2. AI immediately triggers `route`,
3. work / review / story negotiation starts without explicit dialogue setup.

The first line must remain conversational and in character.

### 3.4 Confirm Before Handoff

For a `dialogue-gated mainline` route, the runtime should require one of:

1. explicit choice,
2. explicit yes/no confirmation,
3. explicit permission request,
4. explicit submission phrase,
5. another local confirmation policy defined by the owning house.

If the player's meaning is still soft or ambiguous, the system stays in normal dialogue and asks a
short follow-up question rather than guessing.

## 4. Architecture

### 4.1 Reuse Existing Handoff Path

This feature does not introduce a second executor.

The execution path stays:

1. player utterance,
2. hidden AI intent gate,
3. validated `HouseConversationRoute`,
4. shared runtime dispatch,
5. local house / story owner execution.

The only new architecture is a gate layer that can say:

1. this route is ordinary and may execute now,
2. this route is mainline-sensitive and must remain in dialogue until confirmation,
3. this route is now confirmed and may execute through the existing path.

### 4.2 New Shared Capability Type

Add a shared typed concept next to the current house conversation capability snapshot.

Approved shape:

```ts
type HouseConversationDialogueGatedProgressionCapability = {
  progressionId: string;
  label: string;
  ownerCharacterId?: CharacterId | string | null;
  promptHint: string;
  priority: number;
  confirmationPolicy:
    | "explicit-choice"
    | "explicit-consent"
    | "explicit-request"
    | "explicit-submit";
  handoffRoute: HouseConversationRoute;
};
```

Field rules:

1. `progressionId` is the stable shared contract for this mainline opportunity,
2. `ownerCharacterId`, when present, means only that NPC may auto-open this progression,
3. `promptHint` is house-owned guidance text for how the NPC should open or follow up,
4. `priority` sorts ascending, so lower numbers open first,
5. `confirmationPolicy` is the local rule that decides when the player has committed clearly enough,
6. `handoffRoute` must already be a currently legal route under the latest house capability
   snapshot.

Approved snapshot addition:

```ts
type HouseConversationCapabilitySnapshot = {
  ...
  dialogueGatedProgressions: HouseConversationDialogueGatedProgressionCapability[];
};
```

Use `[]` when no gated progression is currently legal.

This is intentionally not a second action family. It is metadata over existing legal routes.

### 4.3 New House Hook

The owning house should expose these legal progression opportunities through a shared optional hook
instead of hardcoding them in the shell.

Approved contract:

```ts
type HouseModuleDefinition<ModuleId extends HouseModuleId = HouseModuleId> = {
  ...
  selectDialogueGatedProgressions?(
    input: HouseModuleViewModelInput<ModuleId>
  ): HouseConversationDialogueGatedProgressionCapability[];
};
```

This keeps the current legality owner local to the house module and preserves the house interface
contract.

### 4.4 Session-Local Gate State

Do not store this as a persistent plot branch. Store it inside the current shared NPC dialogue
session as conversation-local state.

Approved shape:

```ts
type NpcAiDialogueProgressionGateStage =
  | "idle"
  | "opening"
  | "awaiting-player-answer"
  | "clarifying"
  | "awaiting-confirmation"
  | "ready-to-handoff";

type NpcAiDialogueProgressionGateState = {
  activeProgressionId: string | null;
  stage: NpcAiDialogueProgressionGateStage;
  awaitingRoute: HouseConversationRoute | null;
  askedCount: number;
  lastPlayerAnswer: string | null;
  lastResolvedProgressionId: string | null;
};
```

This gate belongs under the existing AI dialogue session, not under persistent world state.

Repeat-suppression rule:

1. after one progression reaches execution in the current open conversation, the runtime should not
   auto-open the same `progressionId` again until either:
   - the house capability snapshot changes, or
   - the player reopens a fresh conversation and the house still exposes that progression as legal.

### 4.5 Request-Builder Context

The shared NPC AI request builder should include a human-readable summary of the current progression
gate:

1. currently active progression label,
2. current gate stage,
3. owner NPC,
4. confirmation policy,
5. current legal handoff target,
6. instruction that direct mainline execution is forbidden until confirmation.

This prompt guidance is useful but not authoritative. Local runtime validation remains authoritative.

### 4.6 Runtime Enforcement Layer

The runtime must enforce this locally before `dispatchResolvedRoute(...)`.

If a returned route matches an active `dialogueGatedProgression`:

1. when gate stage is not `ready-to-handoff`, execution is blocked,
2. the conversation falls back to a dialogue turn,
3. AI is asked to continue clarifying or confirming,
4. only when confirmation policy is satisfied may the route remain pending and execute.

This is the hard local guarantee that prevents prompt drift.

## 5. Runtime State Machine

### 5.1 Stages

The approved stages are:

1. `idle`
   - no gated mainline opportunity is active
2. `opening`
   - NPC starts the topic
3. `awaiting-player-answer`
   - the player has not yet made intent explicit
4. `clarifying`
   - the player seems to mean business, but intent is not unique or complete
5. `awaiting-confirmation`
   - a unique gated progression is identified, but explicit commitment is still required
6. `ready-to-handoff`
   - explicit commitment has been captured; the existing route may now execute after a short
     transition line

### 5.2 Transition Rules

1. on `start_talk`, if a high-priority gated progression exists for the current NPC and house
   state, the session enters `opening`,
2. after the first NPC line completes, the session enters `awaiting-player-answer`,
3. if the player's utterance does not target a gated progression, ordinary `chat / clarify / route`
   behavior remains unchanged,
4. if the utterance suggests a gated progression but is underspecified, enter `clarifying`,
5. if the utterance identifies a single gated progression but has not yet satisfied its
   confirmation policy, enter `awaiting-confirmation`,
6. if the utterance satisfies confirmation policy, enter `ready-to-handoff`,
7. once the short transition line completes, execute the existing route and clear or advance the
   gate state,
8. after local execution, the next opening line should react to the emitted local result rather than
   reopening the same topic blindly.

### 5.3 No Persistent Clarify Mode

The gate state exists only inside the current AI dialogue session. It is not a new persistent house
mode and should not replace house-owned `meetingStage`, `dailyActionPanel`, or local session state.

## 6. Temple Phase-1 Mapping

The first house to use this mechanism should be `temple-house`.

### 6.1 Phase-1 Temple Progressions

Approved first-batch temple progression opportunities:

1. `temple.assign-daily-work`
   - owner: abbot / main monk authority
   - purpose: ask or assign the player's current temple duty
   - handoff: current legal local work-selection or work-entry path
2. `temple.request-early-begging`
   - owner: abbot
   - purpose: player asks permission to go begging before the ordinary state already exposes it
   - handoff: current legal temple story negotiation node for early begging
3. `temple.review-opening`
   - owner: abbot
   - purpose: review day opening must be announced through dialogue before progressing
   - handoff: current local review / assignment entry path
4. `temple.review-reassign-to-begging`
   - owner: abbot
   - purpose: player argues during review for begging reassignment
   - handoff: current legal review-time negotiation node
5. `temple.submit-begging-food`
   - owner: abbot or responsible monk
   - purpose: acknowledge begging return and only then submit food
   - handoff: current legal food-submission path

### 6.2 Temple Opening Priority

When multiple temple progression opportunities are simultaneously legal, the approved opening
priority is:

1. `temple.review-opening`
2. `temple.submit-begging-food`
3. `temple.assign-daily-work`
4. `temple.request-early-begging`

This ensures the abbot opens from urgent temple reality rather than generic chatter.

### 6.3 Temple Dialogue Contract

Temple dialogue must stay background-correct:

1. after ordination, the abbot must not treat the player as `施主`,
2. the abbot should speak from temple duty, review cadence, contribution, and order,
3. the abbot may reject or defer begging requests through dialogue, but the actual success /
   failure remains temple-owned and local,
4. entering the temple should not pop a separate story console; the existing hidden indoor AI loop
   remains the surface.

## 7. End-To-End Data Flow

### 7.1 Start Talk

1. player clicks `谈话`,
2. shared runtime builds the current house capability snapshot,
3. shared runtime also asks the owning house for `dialogueGatedProgressions`,
4. runtime selects the highest-priority legal progression for the current NPC, if any,
5. request builder sends current gate summary to AI,
6. NPC opens the current mainline topic in character.

### 7.2 Player Turn

1. player clicks one generated option or submits custom text,
2. the hidden intent gate still resolves `chat / clarify / route`,
3. if no gated progression is implicated, ordinary current behavior continues,
4. if the route maps to a gated progression, the local gate validator checks current stage and
   confirmation policy,
5. if confirmation is not yet satisfied, execution is blocked and the conversation continues in
   `clarifying` or `awaiting-confirmation`,
6. if confirmation is satisfied, the route is stored as the pending handoff.

### 7.3 Handoff

1. AI emits one short in-character transition line,
2. the existing paging rule shows that line in the bottom dialogue box,
3. after paging finishes, the runtime executes the already validated route,
4. the local owner settles work, review, negotiation, or submission,
5. local owner emits observed events as needed.

### 7.4 Return

1. when control returns to free conversation, the latest relevant observed event is already in local
   NPC reaction memory,
2. the next NPC opening line acknowledges the result first,
3. the gate may then advance to the next legal progression opportunity or fall back to ordinary
   dialogue.

## 8. Fail-Closed Rules

This mechanism must fail closed.

1. if AI attempts to jump directly to a gated route before confirmation, the runtime blocks it,
2. if AI gives an opening line inconsistent with current gate stage, the runtime keeps the session
   in dialogue and does not execute,
3. if the route is not legal in the latest capability snapshot, do not execute,
4. if the owning house no longer exposes the progression opportunity, clear the stale gate and
   remain conversational,
5. if the current NPC is not the progression owner, the runtime should not auto-open that
   progression from this NPC unless the house explicitly allowed it,
6. provider timeout or malformed output must not mutate plot state.

## 9. Testing Strategy

Implementation should extend current shared families rather than create a one-off temple runtime.

### 9.1 Shared Capability And Runtime Coverage

Add coverage proving:

1. house capability snapshots can expose `dialogueGatedProgressions`,
2. the NPC dialogue session can hold progression gate state,
3. a gated route does not execute before confirmation,
4. after confirmation, the existing pending-route path still executes normally,
5. clearing the session, switching NPC, switching house, or leaving the house cancels stale gated
   progression state.

### 9.2 Request-Builder Coverage

Add request-builder coverage proving AI receives:

1. current active progression label,
2. current gate stage,
3. current owner NPC and prompt hint,
4. hard instruction that mainline-sensitive route execution is forbidden before confirmation.

### 9.3 Temple Coverage

Add temple-specific coverage proving:

1. temple openings prioritize review / food submission / daily duty in the approved order,
2. the abbot no longer treats the player as an outsider once monk-period context is active,
3. asking for early begging first enters dialogue-led persuasion rather than immediate execution,
4. review reassignment stays dialogue-led before the current local negotiation handoff,
5. food submission is acknowledged in dialogue before the current local submission path executes.

### 9.4 Regression Coverage

Existing non-mainline house routes should still work:

1. ordinary visible functions still route without unnecessary gating,
2. ordinary hidden services still use current clarify / settlement rules,
3. same-house NPC switching, legal travel, and leaving still use the existing route path unless a
   house explicitly marks them as dialogue-gated mainline.

## 10. Out Of Scope

This slice does not:

1. replace authored one-shot scenes with pure generation,
2. let AI decide legality or story success,
3. make every route in every house dialogue-gated,
4. add cross-building rumor propagation for this mechanism,
5. replace current local temple rule owners,
6. add a second visible dialogue UI.

## 11. Approved Implementation Order

1. extend the shared house conversation snapshot with dialogue-gated progression capability support,
2. add the optional house hook for exposing current progression opportunities,
3. extend the NPC AI dialogue session with local progression gate state,
4. extend the request builder with progression-gate summary text,
5. add runtime validation that blocks gated routes before confirmation,
6. map the first temple progression opportunities onto the new shared capability,
7. add temple-focused tests and shared regression tests.

That order preserves the current owner split while delivering the approved rule:

1. AI must ask and guide first,
2. the player must answer and confirm,
3. only then may existing local mainline execution run.
