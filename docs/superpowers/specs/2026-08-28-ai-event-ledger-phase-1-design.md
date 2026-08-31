# AI Event Ledger Phase 1 Design

## 1. Goal

Introduce a shared AI-facing event ledger for indoor gameplay so the game can remember meaningful
player actions outside the visible dialogue transcript, then let related NPCs react to those
actions on the next `start_talk`.

Phase 1 must deliver one complete vertical slice:

1. a shared ledger that records meaningful observed events,
2. a shared related-NPC reaction-memory branch capped to the latest `5` result memories per NPC,
3. NPC `start_talk` prompt construction that prioritizes the latest related reaction memory,
4. tavern gambling integration for:
   - entering the table,
   - leaving without really playing,
   - leaving after winning or losing,
   - losing everything at the table.

The player-facing target is:

1. if the player goes to the tavern table, looks, then leaves, the tavern boss remembers it,
2. if the player loses badly, the tavern boss remembers it,
3. the next time the player talks to that NPC, the first NPC line should react to that latest
   result instead of blindly resuming the previous idle small talk.

## 2. Repository Constraints

This work must follow the existing house interface contract:

1. no house-specific business branch in `src/main.ts`,
2. house modules remain the only authority for legality, settlement, inventory, money, flags, and
   story mutation,
3. shared runtime wiring may transport observed events, but may not decide concrete tavern,
   market, grain, medicine, tea-house, or temple business outcomes,
4. persistent data must live under unified runtime state,
5. if shared house/runtime contracts change, `docs/special-house-interface.md` and
   `docs/change-log.md` must be updated in the same batch.

## 3. Current Context And Mismatch

The repository already has two useful AI context seams:

1. `GameState.runtime.worldIntent.recentEvents`
   - holds recent observed events,
   - is already fed by world-intent navigation/talk/action transitions.
2. `GameState.runtime.npcDialogue.memoriesByCharacterId`
   - stores per-NPC dialogue transcript memories.

The current mismatch is that most indoor gameplay outcomes are still local-only house text:

1. tavern gambling settlement updates `dialogueLines`,
2. tavern short-table cash-out updates `dialogueLines`,
3. these outcomes are not yet promoted into a shared AI-readable event ledger,
4. related NPCs therefore do not receive a durable “reaction memory” for those results.

That is why later NPC talk can continue an old transcript thread instead of reacting to what the
player just did.

## 4. Approved Architecture

Phase 1 uses one shared mechanism, not prompt-only patches:

### 4.1 Shared Event Ledger

Observed gameplay events will be recorded through the existing shared `observe-event` runtime seam.

Each event may now additionally carry:

1. durable ledger metadata,
2. optional tags / structured fields for downstream AI context,
3. optional related-NPC reaction hints.

The ledger is global and chronological. It is not limited to visible dialogue turns.

### 4.2 Shared Related-NPC Reaction Memory

The runtime will maintain a second NPC-facing memory branch separate from transcript memories:

- `reactionMemoriesByCharacterId`

Rules:

1. only related NPCs receive these entries,
2. each NPC keeps only the latest `5` entries,
3. new entries overwrite the oldest,
4. transcript memory and reaction memory stay distinct.

### 4.3 Prompt Priority Rule

When building a `start_talk` request:

1. include recent observed-event context,
2. include ordinary transcript-derived memory summary,
3. include related reaction-memory summary,
4. if at least one related reaction memory exists, explicitly instruct the model that the NPC
   should begin by reacting to the latest relevant memory before ordinary small talk.

This is a prompt priority rule, not a new runtime mode.

### 4.4 Shared House Runtime Wiring

House modules may emit observed events through a shared typed result field on
`HouseModuleTransitionResult`.

Rules:

1. the house module chooses when a meaningful result occurred,
2. the shared house runtime forwards those events generically,
3. the shared observed-event runtime records them and derives related-NPC reaction memories,
4. `src/main.ts` remains limited to stable runtime wiring.

## 5. Phase 1 Scope

### In Scope

1. add shared event-ledger runtime storage,
2. add shared reaction-memory runtime storage,
3. add shared runtime logic that converts observed events plus reaction hints into per-NPC capped
   reaction memories,
4. extend NPC AI request building so `start_talk` prioritizes latest reaction memory,
5. add shared house-runtime forwarding for house-emitted observed events,
6. emit tavern gambling events for:
   - table entry,
   - cash out without playing,
   - cash out after winning or losing,
   - total bust / losing everything at the table,
7. add focused regression tests for the runtime, prompt builder, house-runtime forwarding, and
   tavern behavior.

### Out Of Scope

1. migrating every other house/service/playable in the same batch,
2. replacing transcript memory with ledger memory,
3. moving existing house settlement logic into shared AI runtime,
4. introducing a second AI runtime for non-house UI surfaces,
5. changing the current visible indoor conversation shell.

## 6. Data Contract

Phase 1 introduces or extends these shared contracts:

1. `WorldObservedEvent`
   - may carry optional reaction hints for related NPCs.
2. `WorldAiContextRuntimeState`
   - stores the recent event window plus the longer-lived ledger.
3. `NpcAiDialogueRuntimeState`
   - stores transcript memories plus `reactionMemoriesByCharacterId`.
4. `HouseModuleTransitionResult`
   - may emit observed events through a stable typed field.

These changes are shared-contract changes and therefore must be documented.

## 7. Exit Conditions

Phase 1 is complete when all of the following are true:

1. shared observed events are persisted into a global ledger,
2. related NPC reaction memories are capped to `5` entries per NPC,
3. `start_talk` requests visibly include a “react first to latest related memory” instruction when
   such memory exists,
4. house-runtime forwarding works without adding tavern logic to `src/main.ts`,
5. tavern gambling emits reaction-worthy events for the approved scenarios,
6. focused tests prove the new behavior.

## 8. Verification

Minimum required verification for this phase:

1. plan lint,
2. test compile,
3. focused event-ledger / NPC builder / house-runtime / tavern suites,
4. repository typecheck.

Recommended commands:

- cached-node `tools/lint-superpowers-plans.mjs`
- cached-node `node_modules/typescript/bin/tsc -p tsconfig.test.json`
- package marker write for `.test-dist/package.json`
- cached-node `--test --test-isolation=none` on the focused suites
- cached-node `node_modules/typescript/bin/tsc --noEmit -p tsconfig.json`
