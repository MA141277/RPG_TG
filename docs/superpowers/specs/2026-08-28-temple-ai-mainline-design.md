# Temple AI Mainline Design

## 1. Goal

Convert the `temple-house` monk-period mainline into an `AI-first guidance` flow while preserving
the current authoritative temple rule owners.

The approved outcome is:

1. the temple keeps its current hard gameplay rules,
2. NPC dialogue becomes the primary player-facing entry into temple mainline actions,
3. daily work choice, review assignment choice, and begging-food submission are all guided through
   the shared hidden indoor AI dialogue loop first,
4. local temple settlement, legality, flags, week progression, and contribution writes remain owned
   by `src/application/house-modules/temple-house/temple-house-house-module.ts`,
5. no temple-specific business branch is added to `src/main.ts`.

In short: AI speaks, explains, guides, and hands off. `temple-house` still decides what is legal,
what succeeds, and what mutates persistent state.

## 2. Current Context And Constraints

Current repository reality:

1. `temple-house` already owns the monk-period daily / meeting loop, weekly review cadence,
   begging unlock, work settlement, begging-food submission, rest, donation, and current
   negotiation outcomes.
2. Haozhou already has the approved hidden indoor AI conversation pilot:
   - shared NPC-first opening,
   - hidden route classification,
   - bottom dialogue box as the visible surface,
   - same-house NPC switching,
   - legal route dispatch to actions, services, house travel, leave, and story negotiation.
3. The current temple AI reach is still narrow:
   - authored story scenes still own core one-shot moments,
   - current temple free interaction is still primarily button-first,
   - only two temple story negotiations are exposed to AI,
   - temple-specific semantic services do not yet exist.

Repository constraints that must remain true:

1. house work must follow `docs/special-house-interface.md`,
2. `src/main.ts` remains shell-only per `docs/main-shell-contract.md`,
3. AI handoff must go through shared typed seams:
   - `HouseConversationCapabilitySnapshot`
   - `HouseModuleRequest { type: "conversation-service" }`
   - shared story negotiation nodes
   - `observedEvents` and downstream NPC memory
4. persistent gameplay mutation stays inside the owning house module.

## 3. Approved Scope

### 3.1 Hard Rules That Stay Local

These rules remain fully owned by `temple-house` and are not delegated to AI:

1. first week only allows temple-help work,
2. `templeContribution >= 30` is still the hard unlock for ordinary begging access,
3. weekly review cadence and `meetingStage` sequencing stay authored and local,
4. current legal work plans, review choices, leave blocking, time cost, stamina cost, grain
   deduction, and mission text remain local state transitions,
5. current negotiation success / failure authority remains local.

### 3.2 What Becomes AI-First

During eligible temple free-conversation phases, these player intents become AI-first and
dialogue-led:

1. asking what the temple currently expects from the player,
2. choosing daily work such as copying scripture, sweeping the courtyard, or carrying water,
3. asking to submit begging food,
4. asking to rest or donate,
5. choosing review-time assignment direction,
6. asking the abbot to allow or reassign begging through currently legal negotiation nodes.

### 3.3 What Stays Authored

These one-shot scenes remain their current authored owner in this slice:

1. `event.story.zhu_yuanzhang.ordination`
2. `event.story.zhu_yuanzhang.first_temple_review`
3. `event.story.zhu_yuanzhang.unlock_begging`

After these scenes finish and control returns to ordinary temple interaction, the shared hidden
house conversation loop resumes and the temple NPC should open from the latest local state.

## 4. Player-Facing Behavior Contract

### 4.1 Entering The Temple

When the player enters the temple and no higher-priority blocking owner is active:

1. the abbot remains the default AI target,
2. the abbot starts the first line automatically,
3. the existing bottom house dialogue box is the only visible conversation surface,
4. the center `actionContainer` is hidden during free conversation,
5. the left standby roster remains visible and can still switch targets.

### 4.2 Daily Phase

In `daily` mode:

1. the abbot or senior monk should explain the current expectation from the temple,
2. the player may continue ordinary talk,
3. the player may express actionable intent in natural language,
4. AI must route that intent only to currently legal temple actions, temple services, temple story
   negotiations, same-house NPC switches, legal same-city house travel, or leave.

### 4.3 Review Phase

In `meeting` mode:

1. the abbot should speak in assignment / policy language rather than free small talk,
2. if the player expresses a legal review choice directly, AI may hand off to the current review
   choice action,
3. if the player tries to argue for begging before or during assignment, AI may route to the
   currently exposed temple negotiation node only if that node is legal in the latest capability
   snapshot.

### 4.4 Result Follow-Up

After local temple settlement such as:

1. finishing a work task,
2. submitting food,
3. succeeding or failing a begging negotiation,
4. receiving a review assignment,

the next NPC opening line must acknowledge that recent result before shifting the player toward the
next legal mainline step.

## 5. Architecture

### 5.1 Owner Split

The owner split for this feature is:

1. shared hidden indoor AI conversation:
   - target selection,
   - AI opening,
   - chat / clarify / route classification,
   - visible bottom dialogue loop
2. `temple-house`:
   - legality,
   - settlement,
   - week / contribution / flag mutation,
   - review progression,
   - work and food submission authority,
   - emitted observed events
3. shared story negotiation seam:
   - route legality and handoff

No new temple-only async owner is introduced.

### 5.2 Required Shared Seams

This slice reuses and extends these existing shared seams:

1. `HouseConversationCapabilitySnapshot`
2. `HouseConversationRoute`
3. `HouseModuleRequest { type: "conversation-service" }`
4. Haozhou hidden indoor house conversation coordinator
5. shared NPC AI request builder / runtime
6. temple observed-event emission into NPC memory

### 5.3 Temple-Specific Local Service Resolver

Add temple-owned semantic service support inside `temple-house`, not in the shell.

Recommended service ids:

1. `temple.start-task`
2. `temple.submit-food`
3. `temple.rest`
4. `temple.donate`

Temple service resolution remains local and may produce one of four local outcomes:

```ts
type TempleConversationServiceResolution =
  | { kind: "settled" }
  | { kind: "handoff-action"; actionId: string }
  | { kind: "clarify"; promptLines: string[] }
  | { kind: "reject"; promptLines: string[] };
```

The exact helper type may remain temple-local. The important constraint is that AI never mutates
state directly; the temple service resolver either settles locally or returns a typed next step.

## 6. Temple Capability Surface

### 6.1 Reuse Existing Action Handoff

Reuse current temple action ids when the player intent already maps cleanly to an exposed action.

Examples:

1. review choice:
   - `select-review-work:temple-help`
   - `select-review-work:beg-alms`
2. advice stage:
   - `temple-review-give-advice`
   - `temple-review-stay-silent`
3. root actions when currently visible and legal:
   - `open-temple-work-menu`
   - `open-temple-rest-menu`
   - `submit-temple-begging-food`
   - `open-donate`

### 6.2 Add Temple Semantic Services

Use temple services for natural-language intents that need local parameter parsing or should bypass
the old menu click path without bypassing local legality.

#### `temple.start-task`

Used for:

1. `我去抄经`
2. `我去扫院`
3. `我去挑水`
4. `我去做今天那份寺务`

Resolution rules:

1. if the task is uniquely understood and currently legal, hand off to the local task-start path,
2. if the player only said `我去干活`, return a local clarify prompt,
3. if the requested task is not currently legal, return a local reject prompt.

#### `temple.submit-food`

Used for:

1. `我把这些米交回来`
2. `把化来的粮都给寺里`
3. `我先交粮`

Resolution rules:

1. if quantity is clear and legal, settle or hand off to the existing submit path,
2. if quantity is unclear, return a local clarify prompt,
3. if the player has no food to submit, return a local reject prompt.

#### `temple.rest`

Used for:

1. `我歇两天`
2. `先休息到评定`
3. `让我缓缓`

Resolution rules:

1. if the rest mode is uniquely understood, hand off to the current rest path,
2. if the player only said `我想休息`, return a local clarify prompt.

#### `temple.donate`

Used for:

1. `我添些香火`
2. `给寺里捐一点`
3. `我出五十文香火钱`

Resolution rules:

1. if amount is clear and legal, settle or hand off to the existing donation path,
2. if amount is missing, return a local clarify prompt,
3. if the player cannot afford it, return a local reject prompt.

### 6.3 Keep Story Negotiations Distinct

Do not collapse `select a legal assignment` and `try to persuade the abbot to change the rule`
into the same path.

Temple AI must keep these distinct:

1. ordinary legal assignment choice:
   - reuse current action handoff
2. story negotiation:
   - `temple.request-early-begging`
   - `temple.review-work-plan-negotiation`

Examples:

1. `这轮我领化缘` during legal review assignment -> route to current review choice action
2. `住持，能否先放我出去化缘` while begging is still not openly legal -> route to current
   legal negotiation node only if it exists in the latest snapshot

## 7. AI Context Contract

Each temple AI request must include temple-specific mainline context in addition to current shared
NPC conversation context.

Required temple context:

1. `mode`
2. `meetingStage`
3. `templeWeek`
4. `templeContribution`
5. `beggingUnlocked`
6. `currentWorkPlan`
7. `selectedTaskId`
8. `reviewCountdown`
9. `availableFoodToSubmit`
10. `mainHouseMissionText`
11. current legal temple actions
12. current legal temple services
13. current legal temple negotiation nodes

Temple AI must also receive hard background constraints:

1. this is Zhu Yuanzhang's monk-period temple stage,
2. the abbot prioritizes temple survival and order,
3. the abbot cannot casually waive first-week or contribution rules,
4. senior monks may explain or remind, but they do not outrank the abbot on mainline decisions.

## 8. Opening Strategy And Memory Priority

Temple NPC openings must be state-aware.

### 8.1 Opening Priority

The opening priority should be:

1. latest relevant temple reaction memory,
2. current blocking or urgent temple circumstance,
3. current mainline guidance,
4. ordinary flavor dialogue.

### 8.2 Expected Opening Behavior By State

1. `daily + begging not unlocked`
   - remind the player that temple-help remains the present duty
2. `daily + food available to submit`
   - prompt the player to submit food before drifting into generic chat
3. `meeting + assign-duty`
   - ask for the current round's assignment decision directly
4. `after a recent meaningful result`
   - acknowledge the result first, then guide the next legal step

### 8.3 Temple Memory Feed

Keep the existing recent-behavior memory approach and ensure temple-owned actions emit meaningful
observed events for:

1. finishing temple work,
2. reaching or crossing the begging unlock threshold,
3. submitting food,
4. receiving a review assignment,
5. succeeding or failing a temple begging-related negotiation.

Only the relevant temple NPCs should receive reaction hints from those events.

## 9. End-To-End Data Flow

### 9.1 Temple Entry

1. the shared house conversation coordinator detects eligible temple free-conversation state,
2. it selects the abbot as default target,
3. it starts `start_talk`,
4. the temple-specific request builder context and recent temple memory are included,
5. the abbot opens from current temple state.

### 9.2 Player Turn

1. the player chooses a quick reply or submits custom text,
2. the shared hidden route classifier resolves:
   - `chat`
   - `clarify`
   - `route`
3. if `chat`, ordinary dialogue continues,
4. if `clarify`, AI asks one short question,
5. if `route`, the route is revalidated against the latest capability snapshot.

### 9.3 Temple Route Dispatch

If the resolved route is temple-owned:

1. `open-house-action` -> dispatch existing temple action
2. `settle-house-service` -> dispatch temple conversation-service
3. `negotiate-story-node` -> dispatch current temple negotiation handoff
4. `switch-target-npc` / `go-to-house` / `leave-house` -> shared coordinator handles them as usual

### 9.4 Temple Local Resolution

The temple module then:

1. settles or rejects locally,
2. updates persistent state if the action is legal,
3. opens the existing overlay / playable / result model when appropriate,
4. emits `observedEvents` for meaningful player-facing results.

### 9.5 Return To Conversation

Once local temple ownership releases back to free interaction:

1. the shared hidden dialogue loop resumes,
2. the current temple NPC reopens from the latest local state,
3. the next line should react to the most recent temple result.

## 10. Fail-Closed Behavior

Temple AI must fail closed.

1. illegal route -> do not execute, remain in recoverable dialogue state
2. ambiguous service parameters -> return clarify, do not guess
3. unsupported request -> local reject or ordinary dialogue, never illegal settlement
4. AI tries to bypass hard temple rules -> local legality check refuses the route
5. provider timeout / failure -> keep current target and house state unchanged
6. changing NPC, opening a local overlay, leaving the house, or switching houses must cancel the
   stale request

## 11. Testing Strategy

The implementation should extend existing test families rather than create a second temple-only AI
runtime.

### 11.1 Temple Service Coverage

Add temple coverage to the shared house conversation service contract family, for example by
extending:

1. `tests/house-conversation-service-contract.test.cjs`
2. a new focused temple suite such as `tests/temple-house-ai-mainline.test.cjs`

Minimum cases:

1. task intent resolves to the correct local temple path,
2. food submission clarifies when quantity is missing,
3. food submission rejects when no food is available,
4. rest and donation return clarify / reject correctly,
5. service settlement never bypasses local legality.

### 11.2 Temple AI Request Context

Extend request-builder coverage to prove temple AI receives:

1. week / contribution / unlock state,
2. current work plan and review stage,
3. available food-to-submit summary,
4. latest temple reaction memory summary.

### 11.3 Runtime / Handoff Coverage

Extend hidden indoor AI runtime coverage for temple-specific flow:

1. temple entry auto-starts the abbot opening,
2. task intent routes into legal temple task handling,
3. review assignment intent routes into legal review action or legal negotiation node,
4. local result returns to AI dialogue with memory-aware reopening,
5. stale provider events are ignored after target switch, leave, or overlay takeover.

### 11.4 View Contract Coverage

Extend hidden indoor AI view coverage to prove:

1. temple free conversation hides the action container,
2. the bottom dialogue box remains the visible AI surface,
3. temple local overlays still take over normally,
4. returning from local temple ownership resumes hidden AI dialogue.

## 12. Out Of Scope

This slice does not:

1. replace temple one-shot authored scenes with generative scene writing,
2. globalize the same exact temple content logic to every house immediately,
3. let AI decide temple legality or persistent mutation,
4. let temple AI bypass current review cadence,
5. add new temple business branches to `src/main.ts`.

## 13. Recommended Implementation Direction

Implementation should follow this order:

1. enrich shared NPC AI temple request context,
2. add temple conversation-service capability exposure and local resolver,
3. wire temple intent-to-action / intent-to-service / intent-to-negotiation handoff,
4. emit temple observed events for meaningful mainline results,
5. verify temple reopenings acknowledge recent local actions.

That order preserves the repository's existing shared seams while delivering the approved user
experience:

1. temple hard rules remain stable,
2. AI becomes the visible driver of temple mainline guidance,
3. the abbot and monks speak in-character and push the player toward the next legal story step,
4. local temple state remains authoritative.
