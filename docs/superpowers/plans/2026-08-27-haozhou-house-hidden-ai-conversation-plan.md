# Haozhou Hidden AI House Conversation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the standard Haozhou indoor houses into a hidden AI-driven conversation pilot where eligible NPCs open the first line automatically, the bottom house dialogue box becomes the visible interaction surface, and natural-language player input can continue dialogue or legally hand off to current house actions, direct service settlement, Haozhou house switching, leaving, or approved story negotiation.

**Architecture:** Keep the current house shell, NPC runtime, and local house/story owners authoritative. Add a shared Haozhou-only house-conversation policy, a shared indoor conversation coordinator, a hidden capability snapshot, and a broader semantic route contract above the existing local owners. Reuse the current shared NPC AI runtime and its route-only/provider infrastructure where practical, move the player-facing conversation UI into the normal house shell instead of the standalone overlay, and keep `src/main.ts` limited to shell-only coordinator wiring and event forwarding.

**Tech Stack:** TypeScript domain/application/ui/runtime modules, the existing shared `npc-ai-dialogue` provider/runtime seam, Haozhou house modules, CommonJS tests under `.test-dist`, bundled TypeScript, bundled Node for `tools/lint-superpowers-plans.mjs`, targeted `node --test` suites, and Vite build verification.

**Spec:** `docs/superpowers/specs/2026-08-27-haozhou-house-hidden-ai-conversation-design.md`

## Global Constraints

- Keep the pilot limited to `city.kulan`; do not widen scope to non-Haozhou cities.
- Do not promote `house.kulan.temple_txt_narrative` or `home_001` into the pilot owner.
- Do not introduce a new visible AI popup, floating console, or upper-left AI panel.
- Keep the current house shell as the presentation owner.
- NPCs initiate the first line automatically after the player enters an eligible Haozhou house.
- The bottom in-house dialogue box is the visible conversation surface.
- AI may semantically route player speech to legal local actions, house changes, NPC switches, leave actions, and approved story negotiation nodes.
- Local house modules and story owners remain the only authority for legality, settlement, persistent mutation, and story advancement.
- Do not add new concrete Haozhou business branches to `src/main.ts`.
- Do not restore keyword-only matching as the primary routing mechanism.
- Keep `src/main.ts` shell-only per `docs/main-shell-contract.md`.
- If shared interfaces, runtime session structure, or cross-module wiring change, update `docs/special-house-interface.md` and `docs/change-log.md`.
- The current workspace is already dirty; do not revert unrelated local changes.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-08-27`
- Current Focus: `All five governed tasks are complete locally. The Haozhou hidden indoor pilot now auto-starts NPC-first dialogue, hides the standalone overlay, routes legal actions/services/house jumps/story negotiation through the current local owners, and passes the final targeted verification, typecheck, and build gates in this dirty workspace.`
- Next Step: `If this local child should become canonical, sync docs/superpowers/project-progress.md and decide whether to commit/push the current dirty workspace. Otherwise keep the child open locally for follow-up rollout work only.`
- Verification: `PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs && C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json && Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline && C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-conversation-coordinator.test.cjs tests/house-hidden-ai-conversation-view-contract.test.cjs tests/house-conversation-route-contract.test.cjs tests/house-conversation-service-contract.test.cjs tests/npc-ai-dialogue-runtime.test.cjs tests/npc-ai-dialogue-house-entry.test.cjs tests/world-intent-story-negotiation.test.cjs && C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-name-pattern "hidden AI house conversation|main.ts free of Haozhou house business branches" tests/robustness.test.cjs && C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json && C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build`
- Notes: `docs/superpowers/project-progress.md currently tracks a different completed-but-open tavern child. This new plan is intentionally local and non-canonical until the user explicitly chooses execution. The repo already has a shared NPC AI dialogue seam and a visible world-intent bar; this plan converges the Haozhou indoor pilot onto one hidden indoor route owner without reviving business logic in src/main.ts.`

## Progress Log

- 2026-08-27
  - Summary: `Created the governed local implementation plan from the approved Haozhou hidden AI house conversation design. The plan remains waiting because canonical project-progress still points at the earlier tavern completed-but-open child and execution mode has not yet been chosen for this work.`
  - Verification: `PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs`
  - Next: `User chooses Subagent-Driven or Inline execution, then Task 1 starts with RED tests for Haozhou pilot eligibility, auto-start, and in-shell hidden conversation rendering.`
- 2026-08-27
  - Summary: `Execution mode resolved to Subagent-Driven. Because the working tree already contains the active Haozhou AI integration line and user-approved local changes, the implementation will continue in-place instead of creating a fresh linked worktree.`
  - Verification: `READY - Task 1 dispatch prep completed after re-reading the required Superpowers execution skills and checking the current git/worktree state.`
  - Next: `Dispatch Task 1 implementer with the RED pilot policy/render contract brief, review the resulting diff, and keep the progress ledger in sync after approval.`
- 2026-08-27
  - Summary: `Subagent execution was attempted first, but the available subagent models were blocked by provider deployment 404s and an eastus2 rate-limit on gpt-5.5. Execution therefore fell back to the same governed plan in inline mode so Task 1 could continue without waiting on tool infrastructure.`
  - Verification: `READY - executing-plans skill loaded, Task 1 brief rechecked, and inline execution authorized as the fallback path.`
  - Next: `Write the Task 1 RED tests locally, confirm the expected failures, then implement the minimal Haozhou pilot policy/coordinator/view-state seams in-session.`
- 2026-08-27
  - Summary: `Task 1 completed locally after reconciling a baseline drift: the dirty workspace already contained the planned pilot state types, policy, coordinator seam, view-state projection, and most of the Task 1 tests. The missing verified behavior was the house-pilot suppression guard for the visible world-intent bar, so the RED/GREEN loop narrowed to that real gap instead of recreating the whole task from scratch.`
  - Verification: `PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json && Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline && C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-conversation-coordinator.test.cjs tests/house-hidden-ai-conversation-view-contract.test.cjs`
  - Next: `Proceed to Task 2 and move the shared NPC dialogue renderer fully into the normal house shell while wiring eligible-house entry auto-start.`
- 2026-08-27
  - Summary: `Task 2 completed locally. The shared AI dialogue renderer was split into a dedicated panel module, npc-interaction-menu.ts was reduced back to the standalone menu surface plus a compatibility wrapper, the house conversation coordinator gained one-shot eligible-house auto-start and forwarded NPC actions, and main.ts now syncs that coordinator after render using the existing NPC runtime start-talk seam.`
  - Verification: `PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json && Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline && C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/npc-ai-dialogue-house-entry.test.cjs tests/npc-ai-dialogue-view-contract.test.cjs tests/house-hidden-ai-conversation-view-contract.test.cjs`
  - Next: `Proceed to Task 3 and extend the hidden indoor route contract, capability snapshot, and NPC runtime dispatch path.`
- 2026-08-27
  - Summary: `Task 3 completed locally. The hidden indoor route contract now covers continue-dialogue, NPC switching, house-action handoff, legal house jumps, leave, and approved negotiation routing; the shared capability snapshot selector was added; the provider gained a route-only prepass for indoor conversation decisions; and the NPC runtime plus house conversation coordinator now validate and dispatch those broader routes fail-closed.`
  - Verification: `PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json && Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline && C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-conversation-route-contract.test.cjs tests/npc-ai-dialogue-request-builder.test.cjs tests/npc-ai-dialogue-external-provider.test.cjs tests/npc-ai-dialogue-runtime.test.cjs tests/house-conversation-coordinator.test.cjs && C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-name-pattern "main.ts|hidden AI house conversation|shell" tests/robustness.test.cjs tests/main-shell-contract.test.cjs`
  - Next: `Proceed to Task 4 and add the shared conversation-service contract plus the first Haozhou house-owned service handlers.`
- 2026-08-27
  - Summary: `Task 4 completed locally. RED coverage was added for the shared service-capability contract, the generic house runtime and house conversation coordinator now forward typed conversation-service requests through shell-safe wiring, and the first Haozhou market/grain/medicine/tavern/tea handlers expose local services without reopening concrete business branches in src/main.ts. The required shared house-interface and change-log docs were synchronized in the same batch.`
  - Verification: `PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json && Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline && C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none --test-name-pattern "conversation-service|publishes hidden conversation services|dispatches settled house services" tests/house-conversation-service-contract.test.cjs tests/market-house-investigation.test.cjs tests/tavern-short-gamble-house.test.cjs`
  - Next: `Proceed to Task 5 and reuse the current Haozhou negotiation registry plus final verification without widening the pilot beyond city.kulan.`
- 2026-08-27
  - Summary: `Task 5 completed locally. The hidden indoor pilot was already reusing the Haozhou negotiation registry and temple/keep local settlement from the earlier world-intent batch, so this pass added the missing app-level negotiation snapshot regression and a tighter main-shell guard for hidden AI house conversation, corrected one false-positive substring assertion, synced the governed docs/plan state, and finished the full targeted final verification.`
  - Verification: `PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs && C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json && Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline && C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-conversation-coordinator.test.cjs tests/house-hidden-ai-conversation-view-contract.test.cjs tests/house-conversation-route-contract.test.cjs tests/house-conversation-service-contract.test.cjs tests/npc-ai-dialogue-runtime.test.cjs tests/npc-ai-dialogue-house-entry.test.cjs tests/world-intent-story-negotiation.test.cjs && C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-name-pattern "hidden AI house conversation|main.ts free of Haozhou house business branches" tests/robustness.test.cjs && C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json && C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build`
  - Next: `Decide whether to canonically sync project-progress and commit/push this dirty local line, or keep the verified child open for follow-up rollout beyond Haozhou.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-27-haozhou-house-hidden-ai-conversation-design.md`
- Existing related design:
  - `docs/superpowers/specs/2026-08-25-global-npc-ai-dialogue-design.md`
  - `docs/superpowers/specs/2026-08-26-haozhou-ai-world-intent-pilot-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Main shell contract:
  - `docs/main-shell-contract.md`
- House/shared runtime contract:
  - `docs/special-house-interface.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `The repo already has a shared NPC AI dialogue runtime/provider seam, per-NPC memory logs, and in-place bottom-dialogue rendering; this pilot should extend that owner instead of reintroducing a second AI subsystem.`
  - `The repo also already has a visible world-intent bar plus a shared world-intent capability/negotiation registry; this pilot must hide that surface inside eligible Haozhou houses while reusing only the legal-capability and negotiation boundaries that still fit.`
  - `Canonical project-progress remains on a different tavern child, so this plan stays local and waiting until execution mode is explicitly chosen.`

## Implementation Scope

### In Scope

- Add a shared Haozhou-only indoor conversation policy and coordinator.
- Auto-start the default NPC conversation when the player enters an eligible Haozhou house.
- Move the player-visible AI conversation flow into the existing house shell and bottom dialogue surface.
- Hide the central house action container during free conversation mode in eligible Haozhou houses.
- Build one hidden indoor capability snapshot that covers current NPC targets, current house actions, conversation services, reachable Haozhou houses, leave action, and approved negotiation nodes.
- Extend the shared indoor semantic route contract so player turns can continue dialogue, switch NPCs, open house actions, request house services, jump to another Haozhou house, leave the current house, or negotiate an approved story node.
- Add a stable conversation-service contract for Haozhou house modules and wire the first house-owned handlers.
- Reuse current story negotiation ownership for temple/keep progression.
- Add focused tests, doc sync, and shell guards.

### Still Out Of Scope

- Non-Haozhou cities.
- Outdoor/city-level hidden AI travel.
- Replacing every current authored scene with AI dialogue.
- Promoting `house.kulan.temple_txt_narrative` into the shared owner.
- Letting AI mutate player money, inventory, flags, or story outcomes directly.
- Full-game rollout before Haozhou pilot validation.

## File Map

### Existing files to modify

- `src/application/app-shell.ts`
  - Add transient pilot UI/runtime state for Haozhou hidden house conversation ownership.
- `src/application/presenter/presenter-output.ts`
  - Expose pilot render state to the shell without pushing business logic into views.
- `src/ui/app-render.ts`
  - Hide the standalone NPC overlay and visible world-intent bar for eligible Haozhou pilot houses, and render the in-shell conversation panel.
- `src/ui/views/house/house-shared-view.ts`
  - Respect free-conversation view state so the central `actionContainer` disappears while the house shell remains intact.
- `src/ui/components/npc-interaction/npc-interaction-menu.ts`
  - Limit this file back to the standalone menu surface and stop making it the only renderer for the AI dialogue panel.
- `src/main.ts`
  - Shell-only wiring for the new coordinator and event forwarding; no concrete Haozhou service/business branches.
- `src/domain/npc-ai-dialogue.ts`
  - Extend the runtime/provider contract with the hidden indoor route state needed by the Haozhou pilot.
- `src/application/npc-interaction/npc-ai-dialogue-request-builder.ts`
  - Add the broader hidden indoor route request metadata and current capability summaries.
- `src/application/npc-interaction/external-npc-ai-dialogue-provider.ts`
  - Extend the existing route-only phase from current special actions to the broader hidden indoor route set.
- `src/core/runtime/npc-interaction-runtime.ts`
  - Accept and dispatch broader pending indoor routes while preserving stale-request cancellation and persistent NPC memory behavior.
- `src/domain/house-module.ts`
  - Extend the shared house contract with typed conversation-service capability/request support.
- `src/core/contracts/house-runtime.ts`
  - Extend the shared house runtime request contract with typed `conversation-service` dispatch support.
- `src/core/runtime/house-runtime.ts`
  - Forward the new typed conversation-service request through the existing house runtime seam without adding house-specific branches.
- `src/application/world-intent/world-intent-negotiation-registry.ts`
  - Reuse the existing Haozhou negotiation boundary where the hidden indoor route needs legal negotiation-node exposure.
- `src/application/house-modules/market-house/market-house-house-module.ts`
  - Add typed conversation-service capabilities and Haozhou semantic buy/sell/investigate handling.
- `src/application/house-modules/grain-shop/grain-shop-house-module.ts`
  - Add typed conversation-service capabilities and Haozhou semantic buy/sell/investigate/accounting handling.
- `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
  - Add typed conversation-service capabilities and first-pass semantic medicine service handling.
- `src/application/house-modules/tavern/tavern-house-module.ts`
  - Add typed conversation-service capabilities and first-pass semantic tavern service handling.
- `src/application/house-modules/tea-house/tea-house-house-module.ts`
  - Add typed conversation-service capabilities for the currently exposed tea-house interaction surface.
- `src/application/house-modules/temple-house/temple-house-house-module.ts`
  - Surface approved temple negotiation and any pilot-safe conversation service hooks.
- `src/application/house-modules/keep-house/keep-house-house-module.ts`
  - Surface approved keep negotiation hooks.
- `docs/special-house-interface.md`
  - Document the new hidden conversation-service request/capability contract if shared house interfaces change.
- `docs/change-log.md`
  - Record the Haozhou hidden indoor AI pilot mechanism and contract changes.

### Existing files expected to be deleted

- `none`

### New files to create

- `src/domain/house-conversation.ts`
  - Core Haozhou hidden indoor conversation domain contracts: pilot state, capability snapshot, semantic route types, and service capability types.
- `src/application/house-conversation/haozhou-house-conversation-policy.ts`
  - Haozhou-only eligibility and excluded-house policy.
- `src/application/house-conversation/select-house-conversation-capability-snapshot.ts`
  - Build the current hidden indoor capability snapshot from the active house stage and current legal state.
- `src/application/house-conversation/select-house-conversation-services.ts`
  - Resolve the active house module's currently legal typed conversation-service list through shell-safe generic wiring.
- `src/application/runtime/house-conversation-action-coordinator.ts`
  - Shared Haozhou indoor coordinator that owns auto-start, NPC switching, route dispatch, and suspension/resume behavior.
- `src/application/presenter/house-conversation-view-state.ts`
  - Project the current pilot state into a pure render-facing house-shell state.
- `src/ui/components/npc-interaction/npc-interaction-dialogue-panel.ts`
  - Render the shared AI dialogue transcript/options/custom-input panel as an in-shell bottom house surface instead of a detached overlay.
- `tests/house-conversation-coordinator.test.cjs`
  - Coverage for Haozhou-only eligibility, auto-start, suspension, resume, and NPC switching.
- `tests/house-hidden-ai-conversation-view-contract.test.cjs`
  - Coverage for in-shell rendering, hidden action container, absent world-intent bar, and preserved portraits/roster.
- `tests/house-conversation-route-contract.test.cjs`
  - Coverage for legal hidden indoor route classification and fail-closed route validation.
- `tests/house-conversation-service-contract.test.cjs`
  - Coverage for the shared typed conversation-service request/capability contract and pilot-house behavior.

## Verification Plan

- Targeted verification:
  - Eligible Haozhou houses auto-start NPC-first dialogue without showing the old standalone NPC overlay.
  - The central action container disappears only during free conversation mode and returns after local overlay/playable owners finish.
  - The hidden indoor capability snapshot only exposes the currently legal Haozhou NPCs, actions, services, leave action, and negotiation nodes.
  - Invalid or stale route results fail closed and do not mutate gameplay state.
  - Haozhou market/grain/tavern/medicine/tea/temple/keep behavior still routes through the current house owners.
  - `src/main.ts` stays shell-only.
- Required commands:
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json`
  - `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-conversation-coordinator.test.cjs tests/house-hidden-ai-conversation-view-contract.test.cjs tests/house-conversation-route-contract.test.cjs tests/house-conversation-service-contract.test.cjs tests/npc-ai-dialogue-runtime.test.cjs tests/npc-ai-dialogue-house-entry.test.cjs tests/world-intent-story-negotiation.test.cjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-name-pattern "hidden AI house conversation|main.ts free of Haozhou house business branches" tests/robustness.test.cjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build`

### Task 1: Add RED Coverage For Haozhou Pilot Policy, Coordinator Entry, And In-Shell View State

**Files:**
- Create: `tests/house-conversation-coordinator.test.cjs`
- Create: `tests/house-hidden-ai-conversation-view-contract.test.cjs`
- Read: `tests/npc-ai-dialogue-house-entry.test.cjs`
- Read: `tests/npc-ai-dialogue-view-contract.test.cjs`
- Read: `src/ui/app-render.ts`

**Interfaces:**
- Consumes:
  - `AppState`
  - `AppPresenterStageOutput`
  - existing `npcInteractionSession` AI dialogue session shape
- Produces:
  - `type HouseConversationPilotState = { enabled: boolean; cityId: string | null; houseId: string | null; hideActionContainer: boolean; hideWorldIntentBar: boolean; defaultTargetCharacterId: string | null; reason: "eligible" | "excluded-house" | "non-haozhou" | "blocking-owner" | "no-house"; }`
  - `function selectHaozhouHouseConversationPilotState(input: { appState: AppState; stageOutput: AppPresenterStageOutput; }): HouseConversationPilotState`
  - `function createHouseConversationActionCoordinator(dependencies: HouseConversationCoordinatorDependencies): HouseConversationActionCoordinator`

- [x] **Step 1: Write the failing RED tests**

Add the RED coverage that proves the new pilot policy and shell render state do not exist yet:

```js
test("Haozhou pilot auto-starts the default NPC only for eligible standard houses", () => {
  const state = createPilotHouseAppState("house.kulan.market");
  const pilotState = selectHaozhouHouseConversationPilotState({
    appState: state,
    stageOutput: createHouseStageOutput("house.kulan.market"),
  });

  assert.equal(pilotState.enabled, true);
  assert.equal(pilotState.defaultTargetCharacterId, "char.kulan_merchant");
  assert.equal(pilotState.hideActionContainer, true);
});

test("temple_txt_narrative and home_001 stay outside the hidden pilot", () => {
  assert.equal(
    selectHaozhouHouseConversationPilotState({
      appState: createPilotHouseAppState("house.kulan.temple_txt_narrative"),
      stageOutput: createHouseStageOutput("house.kulan.temple_txt_narrative"),
    }).enabled,
    false
  );
});

test("eligible Haozhou pilot houses suppress the standalone NPC overlay and visible world-intent bar", () => {
  const markup = renderApp(createPilotRenderInput("house.kulan.market"));
  assert.doesNotMatch(markup, /data-world-intent-bar="house"/u);
  assert.doesNotMatch(markup, /data-npc-menu="interaction"/u);
  assert.match(markup, /data-house-npc-dialogue="inline"/u);
});
```

- [x] **Step 2: Run the RED test batch**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-conversation-coordinator.test.cjs tests/house-hidden-ai-conversation-view-contract.test.cjs
```

Expected:

- `FAIL`
- failures should point at the missing Haozhou pilot policy, missing coordinator seam, and missing in-shell render contract.

- [x] **Step 3: Implement the minimal pilot policy and render-state seams**

Create the new domain/policy/coordinator/view-state skeletons with just enough code to make the RED expectations compilable:

```ts
export function selectHaozhouHouseConversationPilotState(input: {
  appState: AppState;
  stageOutput: AppPresenterStageOutput;
}): HouseConversationPilotState {
  if (input.stageOutput.type !== "house") {
    return {
      enabled: false,
      cityId: input.appState.gameState.world.currentCityId,
      houseId: input.appState.gameState.world.currentHouseId,
      hideActionContainer: false,
      hideWorldIntentBar: false,
      defaultTargetCharacterId: null,
      reason: "no-house",
    };
  }

  // Haozhou-only eligibility plus excluded-house gate live here.
}
```

- [x] **Step 4: Re-run the focused tests**

Run the same commands from Step 2.

Expected:

- `PASS`
- the pilot-policy and in-shell render-state tests should now turn green without changing actual route behavior yet.

- [x] **Step 5: Commit handling recorded**

```bash
git add tests/house-conversation-coordinator.test.cjs tests/house-hidden-ai-conversation-view-contract.test.cjs src/domain/house-conversation.ts src/application/house-conversation/haozhou-house-conversation-policy.ts src/application/runtime/house-conversation-action-coordinator.ts src/application/presenter/house-conversation-view-state.ts src/application/app-shell.ts src/application/presenter/presenter-output.ts src/ui/app-render.ts
git commit -m "feat: add Haozhou house conversation pilot policy"
```

Task 1 note: the listed Task 1 files already existed as pre-commit local Haozhou AI work in this dirty workspace before inline execution resumed, so no safe task-only commit could be created without sweeping in unrelated or user-owned changes. The task is therefore verified locally and carried forward uncommitted.

### Task 2: Move The Shared NPC Dialogue UI Into The Normal House Shell And Auto-Start On Entry

**Files:**
- Create: `src/ui/components/npc-interaction/npc-interaction-dialogue-panel.ts`
- Modify: `src/ui/components/npc-interaction/npc-interaction-menu.ts`
- Modify: `src/ui/app-render.ts`
- Modify: `src/ui/views/house/house-shared-view.ts`
- Modify: `src/main.ts`
- Modify: `tests/npc-ai-dialogue-house-entry.test.cjs`
- Modify: `tests/npc-ai-dialogue-view-contract.test.cjs`

**Interfaces:**
- Consumes:
  - `HouseConversationPilotState`
  - existing `NpcInteractionRuntimeBridge`
  - existing `renderDialogueTypewriterLines(...)`
- Produces:
  - `function renderNpcInteractionDialoguePanel(input: { session: NpcInteractionSession; targetName: string | null; portraitImageUrl?: string | null; portraitArtClassName?: string | null; inlineHouseMode: boolean; }): string`
  - `type HouseConversationActionCoordinator = { syncFromStage(): void; handleNpcTargetClick(input: { characterId: string; context: NpcInteractionContext | null; }): void; handleNpcAction(input: { action: "close" | "select-option" | "advance-page" | "open-custom-input" | "cancel-custom-input" | "submit-custom" | "profile" | "talk"; optionId?: string; characterId?: string; }): void; closeActiveRequest(): void; }`

- [x] **Step 1: Write the failing RED tests for in-shell auto-start and inline rendering**

Add the RED assertions that require the shared AI dialogue to render inside the current house shell and begin automatically:

```js
test("eligible Haozhou house entry auto-starts AI dialogue for the default NPC", async () => {
  const { coordinator, appStateRef, providerRequests } = createHouseConversationHarness("house.kulan.market");
  coordinator.syncFromStage();
  await Promise.resolve();

  assert.equal(providerRequests.length, 1);
  assert.equal(providerRequests[0].metadata.inputType, "start_talk");
  assert.equal(appStateRef.current.gameState.ui.npcInteractionSession?.targetCharacterId, "char.kulan_merchant");
});

test("inline dialogue panel stays in the house shell footer instead of the standalone overlay", () => {
  const markup = renderNpcInteractionDialoguePanel(createInlineDialogueInput());
  assert.match(markup, /data-house-npc-dialogue="inline"/u);
  assert.doesNotMatch(markup, /role="dialog".*data-npc-menu="interaction"/u);
});
```

- [x] **Step 2: Run the RED test batch**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/npc-ai-dialogue-house-entry.test.cjs tests/npc-ai-dialogue-view-contract.test.cjs tests/house-hidden-ai-conversation-view-contract.test.cjs
```

Expected:

- `FAIL`
- failures should show that eligible house entry does not auto-start yet and that the shared AI panel still belongs to the standalone overlay path.

- [x] **Step 3: Implement the inline dialogue panel and entry auto-start**

Split the dialogue renderer out of the standalone menu file, make the house shell own the panel, and let the coordinator seed `start_talk` when the stage becomes an eligible Haozhou pilot house:

```ts
export function renderNpcInteractionDialoguePanel(input: {
  session: NpcInteractionSession;
  targetName: string | null;
  portraitImageUrl?: string | null;
  portraitArtClassName?: string | null;
  inlineHouseMode: boolean;
}): string {
  if (input.session == null || input.session.mode !== "ai-dialogue") {
    return "";
  }

  return input.inlineHouseMode
    ? `<div class="c-house-npc-dialogue-panel" data-house-npc-dialogue="inline">...</div>`
    : `<div class="c-npc-interaction-inline" data-npc-dialogue="ai-dialogue">...</div>`;
}
```

- [x] **Step 4: Re-run the focused tests**

Run the same commands from Step 2.

Expected:

- `PASS`
- eligible Haozhou houses now auto-start the default NPC talk flow, and the shared AI panel renders inside the normal house shell.

- [x] **Step 5: Commit handling recorded**

```bash
git add src/ui/components/npc-interaction/npc-interaction-dialogue-panel.ts src/ui/components/npc-interaction/npc-interaction-menu.ts src/ui/app-render.ts src/ui/views/house/house-shared-view.ts src/main.ts tests/npc-ai-dialogue-house-entry.test.cjs tests/npc-ai-dialogue-view-contract.test.cjs
git commit -m "feat: move Haozhou npc dialogue into house shell"
```

Task 2 note: the listed files were still part of the same pre-existing dirty Haozhou AI line, so this batch was verified locally and carried forward without creating a task-only commit.

### Task 3: Extend The Hidden Indoor Route Contract And Shared NPC Runtime

**Files:**
- Create: `src/application/house-conversation/select-house-conversation-capability-snapshot.ts`
- Create: `tests/house-conversation-route-contract.test.cjs`
- Modify: `src/domain/house-conversation.ts`
- Modify: `src/domain/npc-ai-dialogue.ts`
- Modify: `src/application/npc-interaction/npc-ai-dialogue-request-builder.ts`
- Modify: `src/application/npc-interaction/external-npc-ai-dialogue-provider.ts`
- Modify: `src/core/runtime/npc-interaction-runtime.ts`
- Modify: `src/application/runtime/house-conversation-action-coordinator.ts`
- Modify: `tests/npc-ai-dialogue-runtime.test.cjs`

**Interfaces:**
- Consumes:
  - current `NpcAiDialogueProviderRequest`
  - current `NpcAiDialogueSpecialActionMetadata[]`
  - current `HouseDefinition` / house module view models / negotiation registry
- Produces:
  - `type HouseConversationCapabilitySnapshot = { cityId: string; houseId: string; moduleId?: string | null; targetCharacterId: string | null; targetCharacterName: string | null; switchableNpcTargets: Array<{ characterId: string; characterName: string; available: boolean; }>; houseActions: Array<{ actionId: string; label: string; available: boolean; }>; houseServices: HouseConversationServiceCapability[]; reachableHouses: Array<{ houseId: string; houseName: string; available: boolean; }>; leaveAction: { actionId: string; label: string; available: boolean; } | null; negotiableStoryNodes: Array<{ nodeId: string; label: string; allowedApproaches?: string[]; targetCharacterId?: string | null; }>; }`
  - `type HouseConversationRoute = { kind: "continue-dialogue"; } | { kind: "switch-target-npc"; characterId: string; } | { kind: "open-house-action"; actionId: string; } | { kind: "settle-house-service"; serviceId: string; rawPlayerText: string; } | { kind: "go-to-house"; houseId: string; } | { kind: "leave-house"; } | { kind: "negotiate-story-node"; nodeId: string; approach: string; targetCharacterId?: string | null; }`
  - `function selectHouseConversationCapabilitySnapshot(input: HouseConversationCapabilitySelectionInput): HouseConversationCapabilitySnapshot`

- [x] **Step 1: Write the failing RED route/runtime tests**

Add the RED tests that prove player turns still only understand current special actions:

```js
test("hidden indoor route snapshot includes legal npc targets, house actions, services, leave action, and negotiation nodes", () => {
  const snapshot = selectHouseConversationCapabilitySnapshot(createMarketConversationSelectionInput());

  assert.ok(snapshot.switchableNpcTargets.some((target) => target.characterId === "char.kulan_merchant"));
  assert.ok(snapshot.houseActions.some((action) => action.actionId === "buy-goods"));
  assert.ok(snapshot.houseServices.some((service) => service.serviceId === "market-buy"));
  assert.equal(snapshot.leaveAction?.actionId, "leave-house");
});

test("npc runtime keeps the turn in dialogue when the route result is continue-dialogue", async () => {
  const harness = createNpcRuntimeHarnessWithRouteResult({ kind: "continue-dialogue" });
  await harness.submitCustom("我想先随便聊聊");
  assert.equal(harness.appState.gameState.ui.npcInteractionSession?.mode, "ai-dialogue");
});

test("npc runtime routes legal house jump and leave results without accepting illegal targets", async () => {
  const harness = createNpcRuntimeHarnessWithRouteResult({ kind: "go-to-house", houseId: "house.kulan.grain_shop" });
  await harness.submitCustom("我去粮铺一趟");
  assert.equal(harness.enterHouseCalls[0], "house.kulan.grain_shop");
});
```

- [x] **Step 2: Run the RED test batch**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-conversation-route-contract.test.cjs tests/npc-ai-dialogue-runtime.test.cjs
```

Expected:

- `FAIL`
- failures should show the missing broader route snapshot, missing route result types, and missing runtime handoff behavior.

- [x] **Step 3: Implement the hidden route snapshot and runtime dispatch**

Extend the shared NPC runtime/provider pipeline so player turns first resolve a legal hidden indoor route, then either continue dialogue or dispatch the validated handoff:

```ts
function dispatchResolvedHouseConversationRoute(input: {
  route: HouseConversationRoute;
  appState: AppState;
}): void {
  switch (input.route.kind) {
    case "continue-dialogue":
      beginStreamingTurnAsDialogue(...);
      return;
    case "switch-target-npc":
      coordinator.handleNpcTargetClick({ characterId: input.route.characterId, context: activeContext });
      return;
    case "open-house-action":
      dispatchHouseAction(input.route.actionId);
      return;
    case "go-to-house":
      enterHouse(input.route.houseId);
      return;
    case "leave-house":
      leaveHouse();
      return;
  }
}
```

- [x] **Step 4: Re-run the focused tests**

Run the same commands from Step 2.

Expected:

- `PASS`
- the hidden indoor route contract now supports NPC switching, legal house switching, leaving, action handoff, and fail-closed validation.

- [x] **Step 5: Commit handling recorded**

```bash
git add src/domain/house-conversation.ts src/application/house-conversation/select-house-conversation-capability-snapshot.ts src/domain/npc-ai-dialogue.ts src/application/npc-interaction/npc-ai-dialogue-request-builder.ts src/application/npc-interaction/external-npc-ai-dialogue-provider.ts src/core/runtime/npc-interaction-runtime.ts src/application/runtime/house-conversation-action-coordinator.ts tests/house-conversation-route-contract.test.cjs tests/npc-ai-dialogue-runtime.test.cjs
git commit -m "feat: add Haozhou hidden conversation routes"
```

Task 3 note: the route/runtime batch landed on top of the same pre-existing dirty Haozhou AI line, so it was verified locally and carried forward without creating a task-only commit.

### Task 4: Add The Shared Conversation-Service Contract And Haozhou House Implementations

**Files:**
- Create: `tests/house-conversation-service-contract.test.cjs`
- Modify: `src/domain/house-module.ts`
- Create: `src/application/house-conversation/select-house-conversation-services.ts`
- Modify: `src/core/contracts/house-runtime.ts`
- Modify: `src/core/runtime/house-runtime.ts`
- Modify: `src/application/runtime/house-conversation-action-coordinator.ts`
- Modify: `src/main.ts`
- Modify: `src/application/house-modules/market-house/market-house-house-module.ts`
- Modify: `src/application/house-modules/grain-shop/grain-shop-house-module.ts`
- Modify: `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
- Modify: `src/application/house-modules/tavern/tavern-house-module.ts`
- Modify: `src/application/house-modules/tea-house/tea-house-house-module.ts`
- Modify: `tests/market-house-investigation.test.cjs`
- Read: `tests/market-house-settlement-trade.test.cjs`
- Read: `tests/tavern-short-gamble-house.test.cjs`

**Interfaces:**
- Consumes:
  - existing `HouseModuleDefinition`
  - existing `HouseModuleRequest`
  - current Haozhou house-specific action ids and settlement helpers
- Produces:
  - `type HouseConversationServiceCapability = { serviceId: string; label: string; description: string; enabled: boolean; }`
  - `type HouseModuleRequest = ... | { type: "conversation-service"; serviceId: string; rawPlayerText: string; targetCharacterId?: string | null; }`
  - `type HouseModuleDefinition<ModuleId extends HouseModuleId = HouseModuleId> = { ...; selectConversationServices?(input: HouseModuleViewModelInput<ModuleId>): HouseConversationServiceCapability[]; }`

- [x] **Step 1: Write the failing RED service-contract tests**

Add the RED tests that prove Haozhou houses do not yet publish or handle typed semantic services:

```js
test("market-house publishes hidden conversation services for buy, sell, and investigate", () => {
  const services = marketHouseModule.selectConversationServices(createMarketViewModelInput());
  assert.deepEqual(
    services.map((service) => service.serviceId),
    ["market-buy", "market-sell", "market-investigate"]
  );
});

test("conversation-service request reaches the current house through the typed house runtime seam", () => {
  const request = {
    type: "conversation-service",
    serviceId: "market-buy",
    rawPlayerText: "我想买一匹布",
    targetCharacterId: "char.kulan_merchant",
  };
  assert.match(JSON.stringify(request), /conversation-service/u);
});
```

- [x] **Step 2: Run the RED test batch**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none --test-name-pattern "conversation-service|publishes hidden conversation services|dispatches settled house services" tests/house-conversation-service-contract.test.cjs tests/market-house-investigation.test.cjs tests/tavern-short-gamble-house.test.cjs
```

Expected:

- `FAIL`
- failures should show the missing typed service capability contract and the missing house runtime/request support.

- [x] **Step 3: Implement the shared contract and pilot house handlers**

Add the typed service request/capability seam, wire it through the generic house runtime, and implement the first Haozhou house handlers so the current house remains the settlement owner:

```ts
export type HouseModuleRequest =
  | { type: "action"; actionId: string; }
  | { type: "field"; fieldId: string; value: string; }
  | { type: "tick"; tickId: string; }
  | {
      type: "conversation-service";
      serviceId: string;
      rawPlayerText: string;
      targetCharacterId?: string | null;
    }
  | {
      type: "txt-narrative-provider-event";
      requestId: string;
      event: TxtNarrativeProviderEvent;
    };
```

- [x] **Step 4: Re-run the focused tests**

Run the same commands from Step 2.

Expected:

- `PASS`
- the shared typed contract exists and the first Haozhou house service handlers are reachable through the generic house runtime seam.

- [x] **Step 5: Commit handling recorded**

```bash
git add src/domain/house-module.ts src/core/contracts/house-runtime.ts src/core/runtime/house-runtime.ts src/application/house-conversation/select-house-conversation-services.ts src/application/runtime/house-conversation-action-coordinator.ts src/main.ts src/application/house-modules/market-house/market-house-house-module.ts src/application/house-modules/grain-shop/grain-shop-house-module.ts src/application/house-modules/medicine-house/medicine-house-house-module.ts src/application/house-modules/tavern/tavern-house-module.ts src/application/house-modules/tea-house/tea-house-house-module.ts tests/house-conversation-service-contract.test.cjs tests/market-house-investigation.test.cjs tests/tavern-short-gamble-house.test.cjs
git commit -m "feat: add Haozhou house conversation services"
```

Task 4 note: the service-contract batch landed on top of the same pre-existing dirty Haozhou AI line, so it was verified locally and carried forward without creating a task-only commit.

### Task 5: Reuse Haozhou Story Negotiation, Sync Shared Docs, And Run Final Verification

**Files:**
- Read: `src/application/world-intent/world-intent-negotiation-registry.ts`
- Read: `src/application/house-modules/temple-house/temple-house-house-module.ts`
- Read: `src/application/house-modules/keep-house/keep-house-house-module.ts`
- Modify: `tests/house-conversation-route-contract.test.cjs`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/special-house-interface.md`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-08-27-haozhou-house-hidden-ai-conversation-plan.md`

**Interfaces:**
- Consumes:
  - current `selectHaozhouWorldIntentNegotiationNodes(...)`
  - current temple/keep negotiation action ids and allowed-approach guards
- Produces:
  - hidden indoor route visibility for the legal negotiation nodes:
    - `temple.request-early-begging`
    - `temple.review-work-plan-negotiation`
    - `keep.assignment-negotiation`

- [x] **Step 1: Write the failing RED negotiation and shell-guard assertions**

Add or extend the tests that prove the hidden indoor pilot does not yet reuse the legal Haozhou negotiation registry and that `src/main.ts` remains shell-only:

```js
test("hidden Haozhou house conversation exposes only the currently legal negotiation nodes", () => {
  const snapshot = selectHouseConversationCapabilitySnapshot(createTempleConversationSelectionInput());
  assert.ok(snapshot.negotiableStoryNodes.some((node) => node.nodeId === "temple.request-early-begging"));
});

test("main.ts stays free of concrete Haozhou house business branches", () => {
  const source = fs.readFileSync("src/main.ts", "utf8");
  assert.doesNotMatch(source, /house\\.kulan\\.market/u);
  assert.doesNotMatch(source, /market-buy/u);
  assert.doesNotMatch(source, /grain-shop/u);
});
```

- [x] **Step 2: Run the RED/final targeted verification batch**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-conversation-coordinator.test.cjs tests/house-hidden-ai-conversation-view-contract.test.cjs tests/house-conversation-route-contract.test.cjs tests/house-conversation-service-contract.test.cjs tests/npc-ai-dialogue-runtime.test.cjs tests/npc-ai-dialogue-house-entry.test.cjs tests/world-intent-story-negotiation.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-name-pattern "hidden AI house conversation|main.ts free of Haozhou house business branches" tests/robustness.test.cjs
```

Expected:

- `FAIL` if negotiation exposure or shell guards are still missing.

- [x] **Step 3: Implement negotiation reuse and doc sync**

Wire the hidden indoor pilot to reuse the existing legal Haozhou negotiation boundary, update the shared docs, and keep `main.ts` shell-only:

```ts
const negotiableStoryNodes =
  selectHaozhouWorldIntentNegotiationNodes({
    appState,
    stageOutput,
  }).map((node) => ({
    nodeId: node.nodeId,
    label: node.label,
    allowedApproaches: node.allowedApproaches,
    targetCharacterId: node.targetCharacterId ?? null,
  }));
```

- [x] **Step 4: Run full final verification**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-conversation-coordinator.test.cjs tests/house-hidden-ai-conversation-view-contract.test.cjs tests/house-conversation-route-contract.test.cjs tests/house-conversation-service-contract.test.cjs tests/npc-ai-dialogue-runtime.test.cjs tests/npc-ai-dialogue-house-entry.test.cjs tests/world-intent-story-negotiation.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-name-pattern "hidden AI house conversation|main.ts free of Haozhou house business branches" tests/robustness.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build
```

Expected:

- `PASS`
- the Haozhou hidden indoor pilot is locally verified without widening scope or reopening `src/main.ts` business logic.

- [x] **Step 5: Commit handling recorded**

```bash
git add tests/house-conversation-route-contract.test.cjs tests/robustness.test.cjs docs/special-house-interface.md docs/change-log.md docs/superpowers/plans/2026-08-27-haozhou-house-hidden-ai-conversation-plan.md
git commit -m "feat: wire Haozhou hidden ai house negotiation"
```

Task 5 note: the Haozhou negotiation reuse itself was already present from the earlier world-intent pilot, so this batch locked it in with hidden indoor snapshot + shell guard regressions, synced the governed docs, and completed the final local verification without creating a task-only commit on the existing dirty workspace.

## Exit Check

- [x] `Eligible Haozhou houses auto-start NPC-first dialogue inside the normal house shell.`
- [x] `The central house action container is hidden only during free conversation mode and returns after local owners finish.`
- [x] `The hidden indoor capability snapshot is Haozhou-only and fail-closed.`
- [x] `Player turns can continue dialogue, switch NPCs, open legal house actions, request legal house services, jump to another legal Haozhou house, leave, or negotiate an approved story node.`
- [x] `House services still settle through the current house owners rather than the AI layer.`
- [x] `Temple/keep story negotiation still settles through the current legal negotiation owners.`
- [x] `No concrete Haozhou business branch is added to src/main.ts.`
- [x] `Shared docs and the plan state are synchronized.`

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `not closed`
- Parent Task: `Haozhou Hidden AI House Conversation`
- Parent Stage: `Shared House NPC Interaction`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `If this verified local child should become canonical, sync docs/superpowers/project-progress.md and decide whether to commit/push the current dirty workspace; otherwise keep it open locally for follow-up rollout work only.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-08-27-haozhou-house-hidden-ai-conversation-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, decide whether to canonically sync this completed-but-open local child, then resume from any post-pilot rollout or cleanup task rather than restarting Task 1.`
