# Haozhou AI World Intent Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the first Haozhou-only AI world-intent slice so the player can keep using the current button-driven city/house flow while also typing natural-language intents for Haozhou building entry, house leaving, NPC targeting, service opening, and selected story negotiation.

**Architecture:** Keep current city, house, access, story, and NPC dialogue owners authoritative. Add a shared `world-intent` capability snapshot, observed-event context sync, AI classifier/provider seam, and validation router above the existing local owners. Only typed world input is classified by AI; button clicks still execute locally first and are then synchronized into AI context. Reuse the existing bottom dialogue box for narration / clarification / refusal, keep transient UI/session data in the shell-facing app state, keep persistent AI context support in unified `GameState.runtime`, and keep `src/main.ts` limited to shell-only wiring.

**Tech Stack:** TypeScript domain/application/ui/runtime modules, existing OpenAI-compatible provider patterns from the shared NPC AI dialogue seam, focused CommonJS tests under `.test-dist`, `tools/lint-superpowers-plans.mjs` via bundled Node, bundled TypeScript for `tsconfig.test.json` / `tsconfig.json`, targeted `node --test`, and Vite build verification.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-08-27`
- Current Focus: `Implementation finished locally; governance resync and keep-local vs commit/push decision remain open.`
- Next Step: `Review the verified Haozhou AI world-intent diff, decide whether to keep it local or resync governance, and only commit/push if requested.`
- Verification: `PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json; PASS - Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/world-intent-capability-registry.test.cjs tests/world-intent-runtime.test.cjs tests/world-intent-view-contract.test.cjs tests/world-intent-story-negotiation.test.cjs tests/world-intent-action-coordinator.test.cjs tests/world-intent-provider-bootstrap.test.cjs tests/npc-ai-dialogue-house-entry.test.cjs tests/location-access-runtime.test.cjs tests/main-source-sanity.test.cjs (24/24); PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-name-pattern "world intent|Haozhou typed world intent|main.ts free of world-intent business branches" tests/robustness.test.cjs; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build.`
- Notes: `The pilot stays Haozhou-only, keeps button play intact, keeps house.kulan.temple_txt_narrative separate from the shared owner, and must keep src/main.ts shell-only. Canonical governance is not being switched by this plan creation step. The local machine cannot run npm-script node entrypoints from PATH, so verification uses the equivalent bundled-node commands directly.`

## Progress Log

- 2026-08-26
  - Summary: `Created the governed local implementation plan from the approved Haozhou AI world-intent design, rechecked the current runtime/shell/UI owners, and kept the new child in waiting because canonical project-progress still belongs to the tavern completed-but-open batch.`
  - Verification: `PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs`
  - Next: `User chooses Subagent-Driven or Inline execution, then Task 1 starts with RED capability/runtime/view coverage.`

- 2026-08-27
  - Summary: `Started local execution in the approved current workspace, added the Task 1 RED world-intent capability/runtime/view tests, and confirmed the focused batch fails for the intended missing contracts: src/domain/world-intent.ts, the capability snapshot selector, the runtime bridge, app-shell worldIntentState, and the inline world-intent bar renderer.`
  - Verification: `PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json; PASS - Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline; FAIL (expected) - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/world-intent-capability-registry.test.cjs tests/world-intent-runtime.test.cjs tests/world-intent-view-contract.test.cjs with missing src/domain/world-intent.ts, missing .test-dist/application/world-intent/select-world-intent-capability-snapshot.js, missing .test-dist/core/runtime/world-intent-runtime.js, missing app-shell worldIntentState, and missing .test-dist/ui/components/world-intent/world-intent-bar.js.`
  - Next: `Implement the shared world-intent domain/runtime/provider and shell-state seams until the Task 1 RED batch turns green.`

- 2026-08-27
  - Summary: `Completed Task 2 locally by adding the shared world-intent domain contracts, pure capability snapshot selector, request builder, placeholder/external provider seams, runtime bridge, app-shell worldIntentState, runtime initialization, presenter overlay exposure, and the first inline world-intent bar renderer/hooks. The focused RED batch now passes.`
  - Verification: `PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json; PASS - Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/world-intent-capability-registry.test.cjs tests/world-intent-runtime.test.cjs tests/world-intent-view-contract.test.cjs (6/6).`
  - Next: `Add the shell action coordinator, actual city/house wiring, and the Haozhou typed-intent integration tests for navigation / leave / talk / service handoff.`

- 2026-08-27
  - Summary: `Completed Task 3 locally by adding the shell-safe world-intent action coordinator, wiring the inline city/house input into main-shell click/input/keydown forwarding, priming the shared world-intent provider with dedicated env keys plus NPC-AI env fallback, reusing the bottom location dialogue for narration/clarify/refusal flow, and routing typed Haozhou go-to-house / leave-house / talk-to-npc / open-service-action results back into the existing house and NPC owners.`
  - Verification: `PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json; PASS - Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/world-intent-action-coordinator.test.cjs tests/world-intent-provider-bootstrap.test.cjs tests/world-intent-capability-registry.test.cjs tests/world-intent-runtime.test.cjs tests/world-intent-view-contract.test.cjs tests/npc-ai-dialogue-house-entry.test.cjs tests/location-access-runtime.test.cjs tests/main-source-sanity.test.cjs (18/18).`
  - Next: `Formalize Haozhou story-negotiation nodes and documentation sync without pushing business logic back into src/main.ts.`

- 2026-08-27
  - Summary: `Completed Task 4 locally by adding the shared Haozhou negotiation-node registry, wiring temple/keep negotiation exposure into the world-intent capability snapshot, forwarding legal negotiation handoff through main-shell wiring, and keeping settlement inside the existing temple-house / keep-house local owners. The coordinator now fails closed when AI returns a negotiation approach not exposed by the current node. The originally drafted tests/world-intent-haozhou-integration.test.cjs was never materialized in this repo, so final verification used the existing Task 3 shell/provider coverage files world-intent-action-coordinator.test.cjs and world-intent-provider-bootstrap.test.cjs instead.`
  - Verification: `PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs; FAIL (expected environment issue) - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd run build:test because the script shell cannot resolve PATH node on this machine; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json; PASS - Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/world-intent-capability-registry.test.cjs tests/world-intent-runtime.test.cjs tests/world-intent-view-contract.test.cjs tests/world-intent-story-negotiation.test.cjs tests/world-intent-action-coordinator.test.cjs tests/world-intent-provider-bootstrap.test.cjs tests/npc-ai-dialogue-house-entry.test.cjs tests/location-access-runtime.test.cjs tests/main-source-sanity.test.cjs (24/24); PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-name-pattern "world intent|Haozhou typed world intent|main.ts free of world-intent business branches" tests/robustness.test.cjs; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build.`
  - Next: `Review the verified Haozhou AI world-intent diff, then decide whether to keep it local or commit/push and resync canonical governance.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-26-haozhou-ai-world-intent-pilot-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Main shell contract:
  - `docs/main-shell-contract.md`
- House / shared runtime contract:
  - `docs/special-house-interface.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `The current repo already has a shared NPC AI dialogue runtime/provider seam and the existing bottom house dialogue box that this pilot can reuse instead of replacing.`
  - `Haozhou still contains the approved standard building set plus the separate house.kulan.temple_txt_narrative host, and that parallel TXT path remains out of scope for owner promotion here.`
  - `The current project-progress document still points at the tavern completed-but-open child, so this plan remains a local waiting child until execution is explicitly chosen.`

## Global Constraints

- Keep the pilot limited to `city.kulan`; do not widen scope to non-Haozhou cities.
- Keep existing city/house buttons fully usable as the safest fallback path.
- Classify only typed world-intent input; button clicks execute locally first and only then synchronize observed events into AI context.
- Reuse the existing bottom dialogue box for narration, clarification, and refusal; do not introduce a detached AI world-intent popup.
- Do not add new concrete house business branches or story business branches to `src/main.ts`.
- Local access refusal rules, house modules, story callbacks, and negotiation resolvers remain the only authority for legality, state mutation, and story advancement.
- Keep `house.kulan.temple_txt_narrative` separate from the shared world-intent owner.
- Fail closed on timeout, invalid payload, illegal target, or ambiguity; the player must never be soft-locked behind AI availability.
- If shared interfaces, runtime session structure, registry shape, or cross-module wiring change, update `docs/special-house-interface.md` and `docs/change-log.md`.
- The current workspace is already dirty; do not revert unrelated local changes.

## Implementation Scope

### In Scope

- Add shared `world-intent` domain contracts, capability snapshot builders, and persistent observed-event support state.
- Add a replaceable AI classifier/provider seam with deterministic local fallback and optional external-provider bootstrap reuse.
- Add a compact world-intent input bar to the Haozhou city/house shell without removing existing buttons.
- Route valid typed intents into the existing local owners for house entry, house leaving, NPC targeting, and current service-opening actions.
- Add bottom-dialogue narration / clarification / refusal flow and stale-request cancellation.
- Formalize the approved Haozhou story negotiation nodes for temple and keep progression gates.
- Add focused tests, shell guards, and required doc synchronization.

### Still Out Of Scope

- Non-Haozhou cities or cross-city AI travel.
- Whole-game AI action ownership in one patch.
- Battle freeform AI.
- Replacing the specialized NPC AI dialogue owner once the player is already inside `头像 -> 谈话`.
- Converging `txt-narrative-place` into the same owner in this slice.
- Letting AI directly mutate state, bypass access rules, or decide story success/failure.

## File Map

### Existing files to modify

- `src/domain/game-state.ts`
  - Add persistent world-intent observed-event support state under unified runtime data.
- `src/application/state/create-initial-state.ts`
  - Initialize the new runtime branch.
- `src/application/app-shell.ts`
  - Carry transient world-intent UI/session state for draft text, pending narration follow-up, and in-flight request status.
- `src/domain/global-ui.ts`
  - Extend shared UI state with the world-intent entry surface where needed.
- `src/application/app-actions.ts`
  - Route shell-level world-intent submit / cancel / narration-advance actions into the new coordinator without owning business logic directly.
- `src/application/presenter/presenter-output.ts`
  - Expose any additional bottom-dialogue / world-intent render state needed by the shell.
- `src/ui/app-render.ts`
  - Render the compact world-intent input bar and bottom-dialogue narration / clarification state in city and house contexts.
- `src/ui/views/city/city-view.ts`
  - Surface the Haozhou city-stage input affordance without breaking current building buttons.
- `src/ui/views/house/house-shared-view.ts`
  - Surface the in-house input affordance while preserving current action/NPC UI.
- `src/application/house-modules/temple-house/temple-house-house-module.ts`
  - Expose or adapt local temple story-owner hooks needed by approved negotiation nodes.
- `src/application/house-modules/keep-house/keep-house-house-module.ts`
  - Expose or adapt local keep story-owner hooks needed by approved negotiation nodes.
- `src/main.ts`
  - Shell-only dependency injection and DOM-event forwarding if required; no new Haozhou business rules.
- `tests/robustness.test.cjs`
  - Add or extend shell-owner guards proving the feature does not push business branches back into `src/main.ts`.
- `docs/special-house-interface.md`
  - Sync any shared runtime / interaction boundary changes that affect house work.
- `docs/change-log.md`
  - Record the new world-intent pilot mechanism and ownership boundary.
- `docs/superpowers/plans/2026-08-26-haozhou-ai-world-intent-pilot-plan.md`
  - Keep execution state, progress log, and verification synchronized.

### New files to create

- `src/domain/world-intent.ts`
  - Core world-intent capability, observed-event, AI response, validation, and runtime-state contracts.
- `src/application/world-intent/select-world-intent-capability-snapshot.ts`
  - Build the legal Haozhou capability snapshot from current city/house/story state.
- `src/application/world-intent/world-intent-request-builder.ts`
  - Build classifier requests from the capability snapshot and recent observed events.
- `src/application/world-intent/world-intent-provider-bootstrap.ts`
  - Map env/bootstrap config into the shared external provider seam when real provider use is enabled.
- `src/application/world-intent/local-placeholder-world-intent-provider.ts`
  - Deterministic local fallback provider for RED/GREEN development and fail-closed testing.
- `src/application/world-intent/external-world-intent-provider.ts`
  - OpenAI-compatible external classifier adapter reusing the existing NPC dialogue transport pattern.
- `src/application/world-intent/world-intent-negotiation-registry.ts`
  - Shared registry for legal negotiation-node exposure and local resolution dispatch.
- `src/application/world-intent/haozhou-story-negotiation-nodes.ts`
  - Approved Haozhou negotiation nodes for temple and keep story gates.
- `src/core/runtime/world-intent-runtime.ts`
  - Async runtime that owns request start/cancel, stale-response suppression, and observed-event synchronization.
- `src/application/runtime/world-intent-action-coordinator.ts`
  - Shell-safe coordinator that validates AI results and hands valid actions to existing local owners.
- `src/ui/components/world-intent/world-intent-bar.ts`
  - Shared shell input renderer for city/house use.
- `src/styles/world-intent.css`
  - Token-based styling for the compact world-intent entry surface.
- `tests/world-intent-capability-registry.test.cjs`
  - Coverage for legal Haozhou house / NPC / service / negotiation capability exposure.
- `tests/world-intent-runtime.test.cjs`
  - Coverage for request lifecycle, stale response cancellation, timeout fallback, and observed-event sync.
- `tests/world-intent-view-contract.test.cjs`
  - Coverage for the world-intent bar, pending state, and bottom-dialogue narration / clarification markup contract.
- `tests/world-intent-story-negotiation.test.cjs`
  - Coverage for temple/keep negotiation-node availability and local-rule-owned resolution.
- `tests/world-intent-haozhou-integration.test.cjs`
  - End-to-end Haozhou typed-intent coverage for enter / leave / talk / service flows.

## Verification Plan

- Targeted verification:
  - Typed input is the only path classified by AI; button clicks remain direct local actions.
  - The capability snapshot reflects the currently legal Haozhou houses, talk targets, service actions, and negotiation nodes.
  - Invalid AI targets, invalid payloads, and timeouts fail closed without mutating gameplay state.
  - Bottom-dialogue narration appears before valid non-dialogue execution.
  - Typed Haozhou navigation, leave, NPC targeting, service opening, and approved story negotiation routes reach the correct local owners.
  - Haozhou buttons remain a complete fallback path.
  - `src/main.ts` stays shell-only.
- Required commands:
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd run build:test`
  - `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/world-intent-capability-registry.test.cjs tests/world-intent-runtime.test.cjs tests/world-intent-view-contract.test.cjs tests/world-intent-story-negotiation.test.cjs tests/world-intent-haozhou-integration.test.cjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-name-pattern "world intent|Haozhou typed world intent|main.ts free of world-intent business branches" tests/robustness.test.cjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build`

## Task 1: Add RED Contracts For World-Intent Domain, Capability Snapshot, And Shell View

**Files:**
- Create: `tests/world-intent-capability-registry.test.cjs`
- Create: `tests/world-intent-runtime.test.cjs`
- Create: `tests/world-intent-view-contract.test.cjs`
- Read: `tests/robustness.test.cjs`
- Read: `src/application/presenter/presenter-output.ts`

- [x] **Step 1: Write the failing RED tests**

Add RED tests that prove:

- the repo exports a typed `world-intent` domain contract,
- the capability snapshot exposes only the currently legal Haozhou houses / NPCs / services / negotiation nodes,
- the shell render contract includes a compact world-intent entry surface and bottom-dialogue narration / clarification state,
- the runtime can start requests, cancel stale ones, and store observed events without mutating unrelated gameplay state.

- [x] **Step 2: Run the focused RED test batch**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd run build:test
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/world-intent-capability-registry.test.cjs tests/world-intent-runtime.test.cjs tests/world-intent-view-contract.test.cjs
```

Expected:

- `FAIL`
- failures should point at the missing world-intent contracts, missing shell render seam, and missing runtime/capability implementation.

- [x] **Step 3: Sync the plan after RED**

Update this plan's `Progress Log` and `Execution State` with the RED evidence before production edits begin.

## Task 2: Implement Shared World-Intent Domain, Provider Seam, And Validation Runtime

**Files:**
- Create: `src/domain/world-intent.ts`
- Create: `src/application/world-intent/select-world-intent-capability-snapshot.ts`
- Create: `src/application/world-intent/world-intent-request-builder.ts`
- Create: `src/application/world-intent/world-intent-provider-bootstrap.ts`
- Create: `src/application/world-intent/local-placeholder-world-intent-provider.ts`
- Create: `src/application/world-intent/external-world-intent-provider.ts`
- Create: `src/core/runtime/world-intent-runtime.ts`
- Modify: `src/domain/game-state.ts`
- Modify: `src/application/state/create-initial-state.ts`
- Modify: `src/application/app-shell.ts`
- Modify: `src/domain/global-ui.ts`

- [x] **Step 1: Implement the minimal shared domain and runtime contracts**

Add the typed world-intent contracts, recent observed-event runtime branch, capability snapshot builder, request builder, payload validation, and async request lifecycle with stale-response suppression.

- [x] **Step 2: Add the provider seam with deterministic fallback and external bootstrap**

Reuse the shared NPC AI external-provider pattern so this pilot can run with a local deterministic provider first and later swap to a real OpenAI-compatible classifier without reopening the shell architecture.

- [x] **Step 3: Re-run the focused runtime and capability tests**

Run the same commands from Task 1 Step 2.

Expected:

- `PASS`
- the world-intent contracts, runtime, and capability snapshot should now satisfy the RED suites.

## Task 3: Integrate Haozhou Shell UI, Bottom Narration, And Local Action Handoff

**Files:**
- Create: `src/application/runtime/world-intent-action-coordinator.ts`
- Create: `src/ui/components/world-intent/world-intent-bar.ts`
- Create: `src/styles/world-intent.css`
- Modify: `src/application/app-actions.ts`
- Modify: `src/application/presenter/presenter-output.ts`
- Modify: `src/ui/app-render.ts`
- Modify: `src/ui/views/city/city-view.ts`
- Modify: `src/ui/views/house/house-shared-view.ts`
- Modify: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add the compact world-intent input bar and bottom-dialogue flow**

Render the shared text-entry affordance in Haozhou city and house contexts, show pending / clarify / refusal / narration states through the existing bottom dialogue box, and keep buttons usable when AI is idle or fails.

- [x] **Step 2: Hand validated intents to existing local owners**

Route valid `go-to-house`, `leave-house`, `talk-to-npc`, and `open-service-action` results into the current navigation / NPC interaction / house-action owners. Ensure button clicks still execute locally first and only append observed events into the AI context.

- [x] **Step 3: Add and green the shell/integration test coverage**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd run build:test
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/world-intent-capability-registry.test.cjs tests/world-intent-runtime.test.cjs tests/world-intent-view-contract.test.cjs tests/world-intent-haozhou-integration.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-name-pattern "world intent|Haozhou typed world intent|main.ts free of world-intent business branches" tests/robustness.test.cjs
```

Expected:

- `PASS`
- typed Haozhou navigation / leave / talk / service flows should work without reopening business logic in `src/main.ts`.

## Task 4: Add Haozhou Story Negotiation Nodes, Sync Docs, And Run Final Verification

**Files:**
- Create: `src/application/world-intent/world-intent-negotiation-registry.ts`
- Create: `src/application/world-intent/haozhou-story-negotiation-nodes.ts`
- Create: `tests/world-intent-story-negotiation.test.cjs`
- Modify: `src/application/house-modules/temple-house/temple-house-house-module.ts`
- Modify: `src/application/house-modules/keep-house/keep-house-house-module.ts`
- Modify: `docs/special-house-interface.md`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-08-26-haozhou-ai-world-intent-pilot-plan.md`

- [x] **Step 1: Formalize the approved negotiation nodes**

Implement the Haozhou negotiation-node registry for:

- `temple.request-early-begging`
- `temple.review-work-plan-negotiation`
- `keep.assignment-negotiation`

AI may classify the negotiation attempt and approach, but the local resolver must remain the only authority for success, failure, follow-up narration, and any resulting state change.

- [x] **Step 2: Run full targeted verification**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/world-intent-capability-registry.test.cjs tests/world-intent-runtime.test.cjs tests/world-intent-view-contract.test.cjs tests/world-intent-story-negotiation.test.cjs tests/world-intent-action-coordinator.test.cjs tests/world-intent-provider-bootstrap.test.cjs tests/npc-ai-dialogue-house-entry.test.cjs tests/location-access-runtime.test.cjs tests/main-source-sanity.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-name-pattern "world intent|Haozhou typed world intent|main.ts free of world-intent business branches" tests/robustness.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build
```

Expected:

- `PASS`
- the Haozhou pilot stays locally verified, Haozhou-only, fail-closed, and main-shell-safe.

- [x] **Step 3: Record the resulting governance state**

If the local implementation batch is complete but canonical project-progress is still not resynced or pushed, set:

- `Execution State.Status` to `completed-but-open`
- `Execution State.Current Focus` to `Implementation finished locally; governance resync and keep-local vs commit/push decision remain open.`
- `Execution State.Next Step` to `Review the verified Haozhou AI world-intent diff, decide whether to keep it local or resync governance, and only commit/push if requested.`

Append the final verification results to `Progress Log`.

## Exit Check

- [x] `Haozhou keeps its existing button-driven gameplay intact.`
- [x] `The player can type legal Haozhou world intents and reach the correct local destination or action.`
- [x] `Illegal AI targets, illegal services, and illegal story states are rejected without state mutation.`
- [x] `Approved temple and keep negotiation nodes remain local-rule authoritative.`
- [x] `AI failure never soft-locks the player.`
- [x] `The pilot remains Haozhou-only and does not silently widen scope.`
- [x] `house.kulan.temple_txt_narrative remains separate from the shared owner.`
- [x] `No new concrete Haozhou business branch lands in src/main.ts.`
- [x] `Shared docs and local plan state are synchronized.`

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `not closed`
- Parent Task: `Haozhou AI World Intent Pilot`
- Parent Stage: `AI World Intent Pilot`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Review the verified Haozhou AI world-intent diff, then decide whether to keep it local or commit/push and resync canonical governance.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-08-26-haozhou-ai-world-intent-pilot-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, confirm canonical governance is still unsynced, then review the verified local Haozhou AI world-intent diff before deciding keep-local vs commit/push.`
