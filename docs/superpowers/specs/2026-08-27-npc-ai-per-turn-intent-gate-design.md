# NPC AI Per-Turn Intent Gate Design

## 1. Goal

Refine the approved `hidden AI-driven indoor conversation` model so that every player utterance
inside an AI-led house conversation is first judged as either:

1. ordinary chat,
2. ambiguous intent that requires one follow-up question, or
3. actionable intent that should hand off into an existing local function, service, transition, or
   story negotiation.

The approved result is:

1. every player-selected AI option and every custom text input goes through the same intent gate,
2. NPC-first indoor conversation remains the primary visible surface,
3. AI may decide that the player is chatting, asking for clarification-worthy intent, or expressing
   a concrete actionable intent,
4. if the player intent is actionable, the NPC may first answer in character with short dialogue
   glue and then jump into the existing local function or route,
5. if the player intent is ambiguous, the NPC asks one short follow-up question instead of guessing,
6. local owners remain authoritative for legality, settlement, inventory mutation, money mutation,
   story advancement, and building transfer,
7. no new house-specific business branch is added to `src/main.ts`,
8. no second visible AI console or second gameplay state machine is introduced.

This document is an approved refinement of:

- `docs/superpowers/specs/2026-08-27-haozhou-house-hidden-ai-conversation-design.md`
- `docs/superpowers/specs/2026-08-26-haozhou-ai-world-intent-pilot-design.md`

It narrows how `player turn -> AI interpretation -> local handoff` must behave inside AI-led house
conversation.

## 2. Current Context And Mismatch

Current repository reality already provides several pieces of the target mechanism:

1. the shared NPC AI seam already includes:
   - current place and NPC context,
   - current transcript summary,
   - per-NPC memory summary,
   - current available special actions,
   - strict visible reply-option validation,
   - paging of long NPC replies into the bottom dialogue box,
   - persistent per-NPC memory logging.
2. the shared house-conversation route contract already exists under `HouseConversationRoute`, with
   local route types such as:
   - `continue-dialogue`
   - `switch-target-npc`
   - `open-house-action`
   - `settle-house-service`
   - `go-to-house`
   - `leave-house`
   - `negotiate-story-node`
3. the current external NPC AI provider already has a hidden route-resolution phase for house
   conversation snapshots before falling back to ordinary generative dialogue.
4. current house modules already remain the authority for:
   - what actions are currently legal,
   - what service can actually settle,
   - whether a destination is reachable,
   - whether a story negotiation node is exposed,
   - how money, inventory, flags, and story state mutate.

However, the current seam still has a behavioral gap:

1. route resolution is not yet explicitly modeled as a per-turn `chat / clarify / route` gate,
2. ambiguous intent can still fall through to normal chat instead of producing a single follow-up
   question,
3. the system does not yet define one strong precedence order for:
   - ordinary chat,
   - visible function opening,
   - hidden service settlement,
   - NPC switching,
   - building movement,
   - leave behavior,
   - story negotiation,
4. the runtime contract does not yet explicitly state that both `quick option clicks` and `custom
   input` must use the exact same hidden intent interpretation pipeline,
5. there is no written contract that forbids implementing this as a second session-state machine or
   as shell-level branching in `main.ts`.

That means the next implementation step must not be:

- a keyword-only patch,
- a button-only branch separate from custom input,
- a direct AI settlement path that bypasses house modules,
- a new persistent `clarify mode` state machine,
- a `main.ts` intent switchboard,
- a duplicate house-specific interpreter per building.

## 3. Approved Player-Facing Behavior Contract

### 3.1 Per-Turn Intent Gate

During AI-led indoor conversation, every player utterance enters one shared hidden gate before the
next NPC reply is generated.

This applies equally to:

- clicking one of the `3 AI-generated reply options`,
- sending a custom freeform input.

The gate may produce only one of three decisions:

1. `chat`
2. `clarify`
3. `route`

### 3.2 Chat

If the utterance is ordinary chat:

- the system continues ordinary NPC dialogue generation,
- no route handoff is scheduled,
- no function UI opens,
- no building or NPC switch occurs,
- the reply remains inside the normal bottom dialogue flow.

Examples:

- `最近生意怎么样`
- `你今天看起来心情不错`
- `这几年世道不太平`

### 3.3 Clarify

If the utterance expresses a likely actionable intent but lacks enough precision or could map to
multiple legal targets, the NPC should not guess.

Instead:

1. the NPC asks one short in-character follow-up question,
2. the game remains in the same ordinary conversation loop,
3. no pending local action executes yet,
4. the player may answer via AI options or custom input,
5. the follow-up answer again goes through the same per-turn intent gate.

Examples:

- `我想买点东西`
  -> NPC asks what the player wants to buy.
- `带我去店里`
  -> NPC asks which currently reachable shop the player means.
- `我想办正事`
  -> NPC asks whether the player means buying, selling, investigating prices, lodging, gambling,
     or another currently legal service in that house.

Clarify is conversational glue, not a separate gameplay mode.

### 3.4 Route

If the utterance expresses a sufficiently concrete actionable intent, the AI may choose `route`.

When that happens:

1. the NPC first returns `1-2` short in-character transition lines,
2. those lines remain subject to the existing bottom-dialogue paging rule,
3. after the transition line finishes, the system executes the validated local handoff,
4. the existing local UI, service flow, or house transfer then becomes the visible owner.

Examples:

- `我想买一匹布`
  -> NPC answers briefly in character and then opens the current legal buying flow.
- `我去粮铺一趟`
  -> NPC answers briefly in character and then routes to `grain_shop` if reachable.
- `让我见见住持`
  -> if the target is present and legal, switch the active talk target.
- `我想出去化缘`
  -> if the current story node is exposed, hand off to the local story-negotiation owner.

### 3.5 AI Must Not Guess Across Illegal Boundaries

The per-turn intent gate must always operate against the current legal capability snapshot.

AI may not:

- jump to an unavailable building,
- open a house action that is not currently exposed,
- settle a service the current house does not support,
- switch to an NPC who is not currently present,
- advance a story node that is not currently negotiable,
- mutate inventory, money, flags, or story state by itself.

If the intent sounds real but does not match the current legal snapshot, the NPC stays in dialogue
and responds in character instead of fabricating execution.

## 4. Approved Route Precedence

When the utterance is not plain chat, the hidden AI gate should prefer the following interpretation
order.

### 4.1 First: Story Negotiation When Clearly Negotiation-Like

If the player is clearly persuading, requesting permission, arguing for a plot gate, or otherwise
trying to advance a currently exposed story conversation, prefer `negotiate-story-node`.

Examples:

- asking the abbot to allow early begging,
- trying to persuade a superior to permit a different assignment.

This remains valid only when the corresponding story negotiation node is currently exposed by the
local owner.

### 4.2 Second: Navigation And Social Target Switching

If the player is clearly trying to:

- leave the current house,
- go to another currently reachable house,
- switch to another currently present NPC,

prefer these route families before service settlement.

Reason:

- these are stronger world-facing intents than general house service chatter,
- they usually terminate or redirect the current conversation owner.

### 4.3 Third: Open A Visible House Action

If the player is clearly asking for a visible current-house function such as:

- buying,
- selling,
- lodging,
- gambling,
- investigating prices,
- bookkeeping,
- any other currently exposed house action,

prefer `open-house-action`.

This is the default outcome for player lines such as:

- `我想买点货`
- `你这都有什么卖`
- `给我开个房`
- `我想来两把`

when the corresponding action is currently exposed and the user intent is to enter that function
surface.

### 4.4 Fourth: Settle A Hidden House Service

Use `settle-house-service` only when both of the following are true:

1. the local house snapshot explicitly exposes a service that can settle semantically from dialogue,
2. the player utterance already contains enough information for local validation and settlement.

Examples:

- `我要买两匹布`
- `给我住一晚普通房`

If information is incomplete, prefer `clarify` instead of incorrect settlement.

### 4.5 Fifth: Clarify Instead Of Guessing

If multiple legal routes could fit or the utterance is too underspecified, prefer `clarify`.

The system should explicitly bias toward `clarify` over wrong execution.

## 5. Ownership And Module Boundaries

### 5.1 Shell Boundary

`src/main.ts` remains shell-only.

It may continue to:

- wire runtime coordinators,
- pass user input into the shared runtime,
- respond to validated execution signals,
- render the correct owner surface.

It must not become the owner of:

- AI intent classification rules,
- house-specific intent mapping,
- local service settlement,
- dialogue-vs-intent business logic,
- story gate legality.

### 5.2 Provider-Layer Ownership

The shared NPC AI provider layer should own the new hidden per-turn intent gate because it already
owns:

- request building,
- transport to the external model,
- response normalization,
- stale-request cancellation,
- current dialogue generation fallback.

Recommended extraction:

- keep transport/repair/timeout logic in the external provider,
- extract the per-turn hidden intent-gate decision logic into a focused helper module under
  `src/application/npc-interaction/`.

### 5.3 House And Story Ownership

House modules and story owners remain authoritative for:

- capability exposure,
- route legality,
- action opening,
- service settlement,
- story mutation,
- persistent gameplay mutation.

AI interpretation is advisory until a returned route is validated against the current capability
snapshot and executed by the local owner.

## 6. Runtime And State Contract

### 6.1 No Second State Machine

The approved design does not add a second NPC conversation runtime or a second persistent AI
session machine.

The existing dialogue session remains the only session owner.

### 6.2 No Persistent Clarify Status

The approved design does not require a new persistent status such as:

- `awaiting-clarify`
- `clarify-mode`
- `route-disambiguation`

Clarify is treated as an ordinary NPC reply turn that happens to ask a short follow-up question.

The next player turn simply re-enters the same hidden intent gate.

### 6.3 Shared Handling For Options And Custom Input

The runtime must not split interpretation rules between:

- clicking an AI-generated option,
- typing a custom sentence.

Both are normalized into the same hidden per-turn intent gate input.

### 6.4 Route Execution After Dialogue Glue

When the gate returns `route`:

1. the runtime stores the validated pending route using the existing pending-route handoff pattern,
2. the NPC transition line is shown through the normal bottom-dialogue paging flow,
3. only after that line completes does the runtime execute the pending route.

This preserves the approved player-facing rhythm:

- NPC talks briefly,
- then the game jumps.

## 7. AI Contract

### 7.1 Decision Space

The per-turn intent gate prompt should constrain the model to one of:

- `chat`
- `clarify`
- `route`

If `route` is chosen, the model should only classify into currently supported route families rather
than inventing a new action class.

### 7.2 Clarify Contract

If the decision is `clarify`, the AI must return:

1. one short in-character follow-up question,
2. no execution claim,
3. no fabricated settlement result.

### 7.3 Route Contract

If the decision is `route`, the AI may return:

1. one short in-character transition line,
2. one candidate route family,
3. route-specific identifying arguments only from the provided legal capability snapshot.

The AI must not return:

- direct inventory mutation text as if already committed,
- fabricated money deduction,
- illegal destination IDs,
- non-existent action IDs,
- unsupported story node IDs.

### 7.4 Fallback Rule

If the model output is malformed, contradictory, or points at an illegal target:

1. do not execute the route,
2. repair only when the repair still maps to a single legal interpretation,
3. otherwise fall back to ordinary in-character dialogue or a safe clarify question.

The failure mode must remain conversationally safe and must never fabricate successful execution.

## 8. Incremental Rollout

Recommended implementation order:

1. extract a dedicated hidden per-turn intent-gate helper,
2. route both quick options and custom input through that helper,
3. preserve current ordinary dialogue behavior for `chat`,
4. add `clarify` behavior without a new persistent runtime status,
5. reuse the existing strict house route validation for `route`,
6. keep transition-line display and pending-route execution on the current runtime path,
7. only then tighten prompts and malformed-output repair.

This keeps the change mechanism-first and avoids another ad hoc house branch.

## 9. Verification Targets

Minimum verification required before claiming the feature works:

1. a plain chat sentence remains in normal dialogue and produces no route handoff,
2. an underspecified service request produces one follow-up question and no execution,
3. a concrete visible-function request produces NPC glue and then opens the correct existing UI,
4. a concrete hidden-service request only settles when the local owner confirms it is complete and
   legal,
5. a building-switch request cannot jump to an unavailable house,
6. an NPC-switch request cannot target an absent NPC,
7. an illegal or malformed AI route never mutates state,
8. the same utterance sent via AI option click and custom input produces the same gate decision,
9. `src/main.ts` remains free of new house business logic.

## 10. Non-Goals

This design does not approve:

- whole-game freeform AI control in one pass,
- replacing local rule owners with direct model-side settlement,
- introducing a second visible AI panel,
- replacing all authored story scenes with pure generation,
- introducing a per-house bespoke interpreter that bypasses the shared route contract.

## 11. Exit Condition For This Design

This design is complete when implementation lands a shared per-turn hidden intent gate that:

1. runs before every player turn inside AI-led indoor conversation,
2. cleanly distinguishes `chat`, `clarify`, and `route`,
3. preserves house and story module ownership,
4. executes legal local handoffs only after short NPC dialogue glue,
5. avoids adding new shell-level business logic or a second runtime state machine.
