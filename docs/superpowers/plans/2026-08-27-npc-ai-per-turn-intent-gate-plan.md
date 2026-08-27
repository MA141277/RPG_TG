# NPC AI Per-Turn Intent Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a shared per-turn indoor NPC intent gate so every player utterance inside AI-led house conversation is classified as `chat`, `clarify`, or `route` before the next visible reply is generated, while keeping house/story owners authoritative for legality and settlement.

**Architecture:** Extract the house-only intent-gate prompts, marker parsing, route validation, and follow-up request builders into a dedicated helper under `src/application/npc-interaction/`, then let `external-npc-ai-dialogue-provider.ts` run that helper before every house `select_option` / `custom_input` turn. Reuse the existing house capability snapshot, pending-route handoff, bottom-dialogue paging, and `awaiting-choice` / `awaiting-action-jump` runtime flow instead of introducing a second session state machine or new shell business branches.

**Tech Stack:** TypeScript application/runtime modules, existing CommonJS `.test-dist` test pipeline, focused `node --test --test-isolation=none` suites, `npm run lint:plans`, `npm run build:test`, `npm run typecheck`, and `npm run build`.

**Spec:** `docs/superpowers/specs/2026-08-27-npc-ai-per-turn-intent-gate-design.md`

## Global Constraints

- Every player-selected AI option and every custom text input goes through the same intent gate.
- If the player intent is ambiguous, the NPC asks one short follow-up question instead of guessing.
- If the player intent is actionable, the NPC first answers in character with short dialogue glue and then jumps into the existing local function or route.
- Local owners remain authoritative for legality, settlement, inventory mutation, money mutation, story advancement, and building transfer.
- No new house-specific business branch is added to `src/main.ts`.
- No second visible AI console or second gameplay state machine is introduced.
- `HouseConversationRoute` remains the only executable indoor handoff contract; `clarify` is not promoted into a new persistent runtime status or a new route kind.
- The current working tree is already dirty; do not revert unrelated local changes while executing this child.
- Canonical project progress now points at this owner doc; keep `docs/superpowers/project-progress.md` synchronized whenever this child's status or next action changes.
- If implementation ends up changing a shared house-module interface, runtime session shape, or cross-module house wiring beyond the approved helper extraction, update `docs/special-house-interface.md` and `docs/change-log.md` in the same batch before claiming completion.

## Execution State

- Status: `running`
- Last Updated: `2026-08-27`
- Current Focus: `Task 2 provider tri-state orchestration is implemented locally and ready for review; Task 3 documentation/final verification remains next.`
- Next Step: `Review the Task 2 diff, then execute Task 3 change-log and final verification work.`
- Verification: `Task 2 GREEN used the cached Node equivalent path: C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/npc-ai-house-intent-gate.test.cjs tests/npc-ai-dialogue-external-provider.test.cjs tests/npc-ai-dialogue-runtime.test.cjs` PASS (45 tests, 45 pass); `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json` PASS. `npm run build:test` and `npm run typecheck` could not run directly because `npm` is unavailable in this PowerShell PATH.
- Notes: `Promoted to the active child after the user selected Subagent-Driven execution. The repo remains in the current checkout because the live AI conversation code and the approved spec/plan exist only as local uncommitted state.`

## Progress Log

- 2026-08-27
  - Summary: `Created the governed implementation plan for the NPC AI per-turn house intent gate from the approved design spec. The plan stays waiting/non-canonical because docs/superpowers/project-progress.md still points at the completed-but-open tavern child.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools/lint-superpowers-plans.mjs` PASS
  - Next: `Keep this child waiting until the user chooses execution mode and decides whether to promote/switch canonical progress away from the tavern child.`

- 2026-08-27
  - Summary: `Promoted this plan to the active running child after the user selected Subagent-Driven execution. The next batch is Task 1 preflight: set up the plan-scoped SDD workspace/ledger, record the preflight rulings, and dispatch the helper-extraction implementer.`
  - Verification: `Governance-only sync; implementation verification has not started yet.`
  - Next: `Create the plan-scoped SDD workspace and Task 1 brief, then dispatch the Task 1 implementer.`

- 2026-08-27
  - Summary: `Completed Task 1 helper extraction locally: added tests/npc-ai-house-intent-gate.test.cjs, created src/application/npc-interaction/npc-ai-house-intent-gate.ts, and moved the house-only intent prompt, route description/examples, route validation parser, and transition request builder out of the external provider while leaving the provider on the existing visible dialogue/route path.`
  - Verification: `RED: C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/npc-ai-house-intent-gate.test.cjs` FAIL with `Cannot find module '../.test-dist/application/npc-interaction/npc-ai-house-intent-gate.js'`. GREEN: same compile/package-marker commands PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/npc-ai-house-intent-gate.test.cjs` PASS (5 tests, 5 pass); `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs` PASS. `npm run build:test` could not run directly because `npm` is unavailable in this PowerShell PATH.`
  - Next: `Proceed to Task 2 provider tri-state orchestration only after Task 1 review/approval.`

- 2026-08-27
  - Summary: `Task 1 review found the helper parser too permissive. Fix round 1 closed the extra-prose acceptance bug, but scoped re-review still found one remaining exact-marker bypass where empty pipe segments can collapse into a valid route; fix round 2 is now running against that single open finding.`
  - Verification: `Fix round 1 GREEN used the cached Node equivalent path: C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/npc-ai-house-intent-gate.test.cjs` PASS (7 tests, 7 pass). Scoped re-review verdict: extra-prose finding addressed; empty-pipe exact-marker bypass still open.`
  - Next: `Finish Task 1 fix round 2 and rerun scoped re-review before starting Task 2.`

- 2026-08-27
  - Summary: `Task 1 reached review-clean after two fix rounds. The helper parser now rejects extra prose around `[INTENT: ...]`, surplus route pipe fields, and empty pipe-segment variants while keeping the extraction scoped to Task 1 only.`
  - Verification: `Fix round 2 GREEN used the cached Node equivalent path: C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/npc-ai-house-intent-gate.test.cjs` PASS (8 tests, 8 pass). Scoped re-review accepted fix round 2 with no new breakage.`
  - Next: `Generate the Task 2 brief and dispatch the provider tri-state implementer.`

- 2026-08-27
  - Summary: `Dispatched the Task 2 implementer against the review-clean Task 1 helper seam. This batch now owns the provider-side `chat / clarify / route` orchestration plus the focused external-provider/runtime regressions.`
  - Verification: `Governance-only dispatch update; Task 2 implementation verification has not completed yet.`
  - Next: `Wait for the Task 2 implementer report and review the resulting diff.`

- 2026-08-27
  - Summary: `Completed Task 2 locally: provider house select-option/custom-input turns now resolve the hidden intent gate first, then route chat through the dedicated chat choice-loop request, clarify through the one-question clarify request, and route through the existing transition-line plus pending-route handoff path. Added regressions for ambiguous tavern intent clarifying with the exact three-option loop, concrete grain-shop intent routing after dialogue glue, chat staying in ordinary choices, malformed/illegal gate output failing closed after one repair, clarify retaining awaiting-choice/no pendingRoute, and selected-option/custom-input parity for the same spoken route text.`
  - Verification: `RED: C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json` PASS; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline` PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/npc-ai-dialogue-external-provider.test.cjs tests/npc-ai-dialogue-runtime.test.cjs` FAIL because the clarify gate still fell through to the generic visible request instead of a dedicated clarify continuation. GREEN: cached `tsc -p tsconfig.test.json` PASS; package marker PASS; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/npc-ai-house-intent-gate.test.cjs tests/npc-ai-dialogue-external-provider.test.cjs tests/npc-ai-dialogue-runtime.test.cjs` PASS (45 tests, 45 pass); `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json` PASS.`
  - Next: `Review the Task 2 provider/runtime diff, then proceed to Task 3 documentation and full verification.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-27-npc-ai-per-turn-intent-gate-design.md`
- Related approved specs:
  - `docs/superpowers/specs/2026-08-27-haozhou-house-hidden-ai-conversation-design.md`
  - `docs/superpowers/specs/2026-08-26-haozhou-ai-world-intent-pilot-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `The repo already has the hidden indoor route snapshot, fail-closed HouseConversationRoute validation, and pendingRoute runtime handoff. This child must reuse those seams instead of creating a second dialogue/session runtime.`
  - `The current external provider already performs a house-only route classification pass, but it still collapses ambiguous intent into continue-dialogue and does not yet model the approved chat / clarify / route tri-state.`
  - `The current runtime already routes both select-option and custom-input through the same provider request pipeline, so this child should keep runtime changes minimal and prefer provider/helper extraction first.`
  - `Canonical governance is occupied by the tavern completed-but-open child, so this plan starts as a local waiting child until the user promotes or intentionally supersedes that work.`

## Implementation Scope

### In Scope

- Add a shared house-only intent-gate helper that can build prompts, parse/repair gate results, and validate route outcomes against the current `HouseConversationCapabilitySnapshot`.
- Introduce an explicit provider-local `chat / clarify / route` tri-state for house `select_option` and `custom_input` turns.
- Generate a dedicated clarify reply path that asks one short in-character follow-up question and still returns exactly three direct spoken reply options.
- Generate a dedicated chat-continuation path for house turns that keeps the conversation in the normal bottom-dialogue loop and forbids accidental direct handoff markers after the gate decided `chat`.
- Keep the current route-transition path for actionable intent, including short NPC glue plus existing pending-route execution after the final page advances.
- Add focused helper/provider/runtime regressions that prove ambiguous requests clarify, concrete requests route, illegal targets fail closed, and no new runtime status is introduced.
- Update shared change-log documentation for the new conversation behavior.

### Still Out Of Scope

- Replacing all outdoor/world-map AI control in this child.
- Rewriting house module settlement logic or moving money/inventory/story mutation into the provider.
- Adding a new shell-owned state machine, upper-left AI console, or `main.ts` intent switchboard.
- Changing `HouseConversationRoute` into a larger generic world-action union.
- Globalizing the rule to every non-house conversation surface in the same child.

## File Map

### Existing files to modify

- `src/application/npc-interaction/external-npc-ai-dialogue-provider.ts`
  - Replace the direct house-route-only orchestration with helper-driven `chat / clarify / route` gating while keeping transport, timeout, model fallback, format repair, and diagnostics in the provider.
- `tests/npc-ai-dialogue-external-provider.test.cjs`
  - Lock the clarify branch, the route branch, chat-branch no-handoff behavior, and fail-closed illegal route handling.
- `tests/npc-ai-dialogue-runtime.test.cjs`
  - Lock the runtime contract that clarify falls back to ordinary `awaiting-choice`, route handoff still executes only after dialogue glue, and option/custom-input paths remain behaviorally aligned.
- `docs/change-log.md`
  - Record the new hidden indoor `chat / clarify / route` gate and the “ask one follow-up instead of guessing” behavior.
- `docs/superpowers/plans/2026-08-27-npc-ai-per-turn-intent-gate-plan.md`
  - Keep `Execution State`, `Progress Log`, verification, and checkboxes synchronized during execution.
- `docs/superpowers/project-progress.md`
  - Update only if this child is later promoted, completed-but-open, blocked, or closed.

### Existing files expected to be deleted

- `none`

### New files to create

- `src/application/npc-interaction/npc-ai-house-intent-gate.ts`
  - Own the house-only prompt builders, marker parsers, route validation glue, and response-request builders for `chat`, `clarify`, and `route`.
- `tests/npc-ai-house-intent-gate.test.cjs`
  - Focused pure helper coverage for intent-gate parsing, repair, route validation, prompt-shape contracts, and clarify-vs-route fail-closed behavior.

## Verification Plan

- Targeted verification:
  - The house helper accepts only one gate decision and reduces it to `chat`, `clarify`, or a validated `HouseConversationRoute`.
  - Ambiguous player intent produces a short clarify question plus exactly three spoken reply options and no pending route.
  - Concrete visible-action, semantic-service, NPC-switch, building-switch, leave, and story-negotiation requests produce a short transition line plus the correct validated route handoff.
  - Illegal or malformed gate output never mutates state and never bypasses the current capability snapshot.
  - House `select_option` and `custom_input` remain on the same provider/runtime seam and do not require a new runtime status.
  - `src/main.ts` remains untouched by this child.
- Required commands:
  - `npm run lint:plans`
  - `npm run build:test`
  - `node --test --test-isolation=none tests/npc-ai-house-intent-gate.test.cjs tests/npc-ai-dialogue-external-provider.test.cjs tests/npc-ai-dialogue-runtime.test.cjs`
  - `npm run typecheck`
  - `npm run build`

### Task 1: Extract The House Intent-Gate Helper

**Files:**
- Create: `src/application/npc-interaction/npc-ai-house-intent-gate.ts`
- Create: `tests/npc-ai-house-intent-gate.test.cjs`
- Modify: `src/application/npc-interaction/external-npc-ai-dialogue-provider.ts`

**Interfaces:**
- Consumes:
  - `NpcAiDialogueProviderRequest`
  - `HouseConversationCapabilitySnapshot`
  - `HouseConversationRoute`
  - `resolveAvailableHouseConversationRoute(...)`
- Produces:

```ts
export type HouseConversationIntentGateDecision =
  | { kind: "chat" }
  | { kind: "clarify" }
  | { kind: "route"; route: HouseConversationRoute };

export function buildHouseConversationIntentGateRequest(
  request: NpcAiDialogueProviderRequest
): NpcAiDialogueProviderRequest;

export function buildHouseConversationIntentGateRepairRequest(
  request: NpcAiDialogueProviderRequest,
  issue: string
): NpcAiDialogueProviderRequest;

export function resolveHouseConversationIntentGateDecision(input: {
  rawText: string;
  request: NpcAiDialogueProviderRequest;
}):
  | { decision: HouseConversationIntentGateDecision; issue?: undefined }
  | { decision?: undefined; issue: string };

export function buildHouseConversationChatResponseRequest(
  request: NpcAiDialogueProviderRequest
): NpcAiDialogueProviderRequest;

export function buildHouseConversationClarifyResponseRequest(
  request: NpcAiDialogueProviderRequest
): NpcAiDialogueProviderRequest;

export function buildHouseConversationRouteTransitionRequest(input: {
  request: NpcAiDialogueProviderRequest;
  route: HouseConversationRoute;
}): NpcAiDialogueProviderRequest;
```

- [x] **Step 1: Write the failing helper contract tests**

Add `tests/npc-ai-house-intent-gate.test.cjs` with focused cases for:

- parsing a direct chat decision:

```js
assert.deepEqual(
  resolveHouseConversationIntentGateDecision({
    rawText: "[INTENT: chat]",
    request: createHouseRequest({ customInputText: "最近生意怎么样" }),
  }),
  {
    decision: {
      kind: "chat",
    },
  }
);
```

- parsing a direct clarify decision:

```js
assert.deepEqual(
  resolveHouseConversationIntentGateDecision({
    rawText: "[INTENT: clarify]",
    request: createHouseRequest({ customInputText: "我想买点东西" }),
  }),
  {
    decision: {
      kind: "clarify",
    },
  }
);
```

- parsing and validating a legal route decision:

```js
assert.deepEqual(
  resolveHouseConversationIntentGateDecision({
    rawText: "[INTENT: route|go-to-house|house.kulan.grain_shop]",
    request: createHouseRequest({ customInputText: "我去粮铺一趟" }),
  }),
  {
    decision: {
      kind: "route",
      route: {
        kind: "go-to-house",
        houseId: "house.kulan.grain_shop",
      },
    },
  }
);
```

- rejecting an illegal route target outside the current snapshot:

```js
assert.match(
  resolveHouseConversationIntentGateDecision({
    rawText: "[INTENT: route|go-to-house|house.kulan.keep]",
    request: createHouseRequest({ customInputText: "我去帅府" }),
  }).issue,
  /当前合法的室内能力快照/u
);
```

- prompt-shape coverage that the clarify/chat response builders forbid direct handoff markers and keep the reply inside one visible choice loop.

- [x] **Step 2: Run the focused helper test to confirm RED**

Run:

```powershell
npm run build:test
node --test --test-isolation=none tests/npc-ai-house-intent-gate.test.cjs
```

Expected:

- `FAIL`
- The failure should point at the missing helper module/exports or missing `[INTENT: ...]` parsing contract.

- [x] **Step 3: Implement the helper and move the house-only prompt/parse logic into it**

Make the minimal extraction needed to satisfy the helper contract:

- create `src/application/npc-interaction/npc-ai-house-intent-gate.ts`;
- move the existing house-only summary/route-description/example builders out of `external-npc-ai-dialogue-provider.ts` and keep them house-scoped there instead of leaving them embedded in the transport file;
- define one explicit gate marker family:

```ts
// accepted raw forms
"[INTENT: chat]"
"[INTENT: clarify]"
"[INTENT: route|open-house-action|buy-goods]"
"[INTENT: route|settle-house-service|market-buy]"
"[INTENT: route|go-to-house|house.kulan.grain_shop]"
"[INTENT: route|switch-target-npc|char.kulan_apothecary]"
"[INTENT: route|leave-house]"
"[INTENT: route|negotiate-story-node|temple.request-early-begging|plea]"
```

- keep route validation fail-closed by passing any route branch back through `resolveAvailableHouseConversationRoute(...)`;
- build dedicated chat/clarify response requests that require ordinary `[DIALOGUE] + [CHOICE] + exactly 3 [OPTION]` output and explicitly forbid `[ACTION]` / `[ROUTE]`.

- [x] **Step 4: Re-run the helper test and focused compile step**

Run:

```powershell
npm run build:test
node --test --test-isolation=none tests/npc-ai-house-intent-gate.test.cjs
```

Expected:

- `PASS`
- The helper now accepts only the approved tri-state and rejects illegal route targets.

- [x] **Step 5: Sync plan state after Task 1**

Update this plan file immediately after Task 1 lands:

- mark Task 1 checkboxes accurately;
- update `Execution State` if the child moved from waiting to running;
- append a `Progress Log` entry that records the helper extraction, the exact RED failure, and the GREEN verification commands.

### Task 2: Wire The External Provider Through The Intent Gate

**Files:**
- Modify: `src/application/npc-interaction/external-npc-ai-dialogue-provider.ts`
- Modify: `tests/npc-ai-dialogue-external-provider.test.cjs`
- Modify: `tests/npc-ai-dialogue-runtime.test.cjs`
- Read: `src/application/npc-interaction/npc-ai-house-intent-gate.ts`

**Interfaces:**
- Consumes:
  - `HouseConversationIntentGateDecision`
  - `buildHouseConversationIntentGateRequest(...)`
  - `buildHouseConversationIntentGateRepairRequest(...)`
  - `resolveHouseConversationIntentGateDecision(...)`
  - `buildHouseConversationChatResponseRequest(...)`
  - `buildHouseConversationClarifyResponseRequest(...)`
  - `buildHouseConversationRouteTransitionRequest(...)`
- Produces:

```ts
async function resolveOpenAiHouseConversationIntentGate(input: {
  config: OpenAiCompatibleConfig;
  request: NpcAiDialogueProviderRequest;
  fetchImplementation: FetchImplementation;
  requestTimeoutMs: number;
}): Promise<HouseConversationIntentGateDecision | null>;
```

- [x] **Step 1: Write the failing provider/runtime regressions**

Extend the focused tests with these cases:

- ambiguous house intent clarifies instead of guessing:

```js
assert.deepEqual(events[1].allSteps, [
  {
    type: "dialogue",
    speakerId: "char.test.tavern_boss",
    speakerName: "酒馆掌柜",
    text: "成，你是想开赌局，还是先问问规矩与玩法？",
  },
  {
    type: "choice",
    prompt: "你想怎么接话？",
    options: [
      { id: "option.ask_rules", label: "先说说规矩。", actionText: "先说说规矩。" },
      { id: "option.open_short", label: "我想先玩几句短局。", actionText: "我想先玩几句短局。" },
      { id: "option.leave", label: "那我先看看别的。", actionText: "那我先看看别的。" },
    ],
  },
]);
```

- concrete route intent still becomes short dialogue glue plus a validated route step:

```js
assert.deepEqual(events[1].allSteps, [
  {
    type: "dialogue",
    speakerId: "char.test.npc",
    speakerName: "钱掌柜",
    text: "城南粮铺今日正开着门，你若要去看米价，现在过去正好。",
  },
  {
    type: "route",
    route: {
      kind: "go-to-house",
      houseId: "house.kulan.grain_shop",
    },
  },
]);
```

- clarify keeps runtime on the ordinary choice loop with no new status:

```js
assert.equal(
  appState.gameState.ui.npcInteractionSession?.dialogue?.status,
  "awaiting-choice"
);
assert.equal(
  appState.gameState.ui.npcInteractionSession?.dialogue?.pendingRoute,
  null
);
```

- option click and custom input remain behaviorally aligned by feeding the same spoken text through the same house snapshot and observing the same route result after page advance.

- [x] **Step 2: Run the focused provider/runtime suites to confirm RED**

Run:

```powershell
npm run build:test
node --test --test-isolation=none tests/npc-ai-dialogue-external-provider.test.cjs tests/npc-ai-dialogue-runtime.test.cjs
```

Expected:

- `FAIL`
- The failures should show that the provider still only knows `continue-dialogue` vs direct route and has no clarify branch or dedicated chat-continuation path.

- [x] **Step 3: Implement the provider-side tri-state flow**

Update `src/application/npc-interaction/external-npc-ai-dialogue-provider.ts` so that:

- house `select_option` / `custom_input` turns run `resolveOpenAiHouseConversationIntentGate(...)` before any visible reply request;
- `decision.kind === "chat"` switches to `buildHouseConversationChatResponseRequest(...)` instead of the generic unrestricted dialogue request;
- `decision.kind === "clarify"` switches to `buildHouseConversationClarifyResponseRequest(...)`, producing one short follow-up question plus the normal 3-option loop;
- `decision.kind === "route"` keeps the existing route-transition request path and forced pending-route metadata;
- legacy non-house `[ACTION]` routing remains intact only for requests that do not carry a house conversation snapshot;
- malformed/illegal gate output repairs once, then fails closed without fabricating execution;
- no new session status or `main.ts` branch is introduced while satisfying the new tests.

- [x] **Step 4: Re-run the focused provider/runtime suites and the repository typecheck**

Run:

```powershell
npm run build:test
node --test --test-isolation=none tests/npc-ai-house-intent-gate.test.cjs tests/npc-ai-dialogue-external-provider.test.cjs tests/npc-ai-dialogue-runtime.test.cjs
npm run typecheck
```

Expected:

- `PASS`
- The new clarify branch stays inside ordinary dialogue, actionable routes still hand off only after dialogue glue, and the repo typecheck remains clean.

- [x] **Step 5: Sync plan state after Task 2**

Update this plan file immediately after Task 2 lands:

- mark Task 2 checkboxes accurately;
- append a `Progress Log` entry that records the exact clarify/route regressions added, the RED failure reason, and the GREEN verification results;
- if the child is now functionally complete but still local/unpushed, move `Execution State.Status` to `completed-but-open` instead of `closed`.

### Task 3: Record The Shared Behavior Change And Run Full Verification

**Files:**
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-08-27-npc-ai-per-turn-intent-gate-plan.md`
- Modify: `docs/superpowers/project-progress.md` (only if this child is promoted or its canonical status changes)

**Interfaces:**
- Consumes:
  - the verified helper/provider/runtime behavior from Tasks 1-2
- Produces:
  - a durable change-log entry and synchronized governance state for the completed batch

- [ ] **Step 1: Update the change log**

Add a concrete entry to `docs/change-log.md` that records:

- house AI player turns now pass through a hidden `chat / clarify / route` gate;
- ambiguous requests now trigger a one-question follow-up instead of an unsafe jump;
- actionable requests still use short NPC dialogue glue before opening an existing local function or route;
- legality and settlement remain owned by existing house/story modules.

- [ ] **Step 2: Run the full verification batch**

Run:

```powershell
npm run lint:plans
npm run build:test
node --test --test-isolation=none tests/npc-ai-house-intent-gate.test.cjs tests/npc-ai-dialogue-external-provider.test.cjs tests/npc-ai-dialogue-runtime.test.cjs
npm run typecheck
npm run build
```

Expected:

- `PASS`
- If any command is skipped, record the exact reason in `Execution State.Verification` and the latest `Progress Log` entry.

- [ ] **Step 3: Sync governance before any closeout or handoff**

Before marking anything complete:

- update `Execution State.Last Updated`, `Current Focus`, `Next Step`, and `Verification`;
- append the final `Progress Log` entry with the exact verification results;
- if this child became canonical during execution, synchronize `docs/superpowers/project-progress.md` in the same batch;
- do not mark the child `closed` unless push/closeout rules from `docs/superpowers/specs/plan-governance-spec.md` are satisfied.

## Exit Check

- [ ] Every house `select_option` / `custom_input` turn now runs the hidden intent gate before the visible reply request.
- [ ] The helper and provider cleanly distinguish `chat`, `clarify`, and `route` without adding a second runtime state machine.
- [ ] Ambiguous intent asks one short follow-up question and remains in the ordinary bottom-dialogue choice loop.
- [ ] Concrete legal intent still produces short NPC glue and then executes the validated local route.
- [ ] Illegal or malformed gate output never bypasses the capability snapshot.
- [ ] `src/main.ts` remains untouched by this child.
- [ ] Project progress sync is updated if this child's canonical status changes.
- [ ] Closeout data is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
